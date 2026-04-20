// دالة البحث عن الطالب برقم الجلوس
function searchStudent() {
    const searchId = document.getElementById('searchStudentId').value;
    const studentName = document.getElementById('studentName');
    const studentGrade = document.getElementById('studentGrade');
    const studentRank = document.getElementById('studentRank');
    const errorMsg = document.getElementById('errorMsg');

    if (!searchId) {
        if (errorMsg) errorMsg.style.display = 'none';
        studentName.value = "";
        studentGrade.value = "";
        studentRank.value = "";
        return;
    }

    const student = window.studentsDatabase ? window.studentsDatabase.find(s => s.id == searchId) : null;

    if (student) {
        if (errorMsg) errorMsg.style.display = 'none';
        studentName.value = student.name;
        studentGrade.value = student.grade;
        studentRank.value = student.rank;
    } else {
        if (errorMsg) errorMsg.style.display = 'block';
        studentName.value = "";
        studentGrade.value = "";
        studentRank.value = "";
    }
}

// دالة التنقل بين الصفحات
function showPage(pageNum) {
    const pages = [
        document.getElementById('page1'), 
        document.getElementById('page2'), 
        document.getElementById('page3'),
        document.getElementById('page4') // القالب المخفي
    ];
    
    const btns = [
        document.getElementById('btnPage1'), 
        document.getElementById('btnPage2'), 
        document.getElementById('btnPage3')
    ];

    pages.forEach((p, index) => {
        if (p) {
            // صفحة 4 دائماً مخفية إلا أثناء التصوير البرمجي
            if (index === 3) {
                p.style.display = 'none';
            } else {
                p.style.display = (index + 1 === pageNum) ? 'flex' : 'none';
            }
        }
    });

    btns.forEach((b, index) => {
        if (b) {
            if (index + 1 === pageNum) {
                b.className = "bg-blue-900 text-white font-cairo font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2";
            } else {
                b.className = "bg-gray-200 text-gray-700 hover:bg-gray-300 font-cairo font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2";
            }
        }
    });

    // إظهار زر تحميل المحكمين فقط في صفحة لجنة التحكيم (صفحة 2)
    const btnDownloadJudges = document.getElementById('btnDownloadJudges');
    if(btnDownloadJudges) {
        btnDownloadJudges.style.display = (pageNum === 2) ? 'flex' : 'none';
    }
}

// دالة تحميل البطاقة الحالية المعروضة
function downloadCard(btn) {
    const page3 = document.getElementById('page3');

    // إذا كنا في صفحة الطلبة، نحمل الصورة الجاهزة من السيرفر/المجلد
    if (page3 && page3.style.display !== 'none') {
        const searchId = document.getElementById('searchStudentId').value;
        const student = window.studentsDatabase ? window.studentsDatabase.find(s => s.id == searchId) : null;

        if (student) {
            const link = document.createElement('a');
            link.href = `assets/certificates/${student.id}.jpeg`; 
            link.download = `شهادة_${student.name}.jpeg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert("يرجى البحث عن رقم جلوس صحيح أولاً.");
        }
        return;
    }

    // تصوير الصفحات الأخرى باستخدام html2canvas
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="font-cairo">جاري التحضير...</span>';
    
    const card = document.querySelector('.card-container');
    
    window.html2canvas(card, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'بطاقة_الأكاديمية.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        btn.innerHTML = originalText;
    }).catch(err => {
        console.error(err);
        btn.innerHTML = originalText;
    });
}

// الدالة الخاصة بتحميل كروت جميع المحكمين تلقائياً (تعتمد على ID وتصور الشاشة برمجياً)
async function downloadJudgesCards(btn) {
    if (!window.judgesDatabase || window.judgesDatabase.length === 0) {
        alert("بيانات المحكمين غير موجودة.");
        return;
    }

    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="font-cairo">جاري التحميل...</span>';
    btn.disabled = true;

    const page2 = document.getElementById('page2');
    const page4 = document.getElementById('page4');
    const judgeNameDisplay = document.getElementById('judgeNameDisplay');
    const judgeRoleDisplay = document.getElementById('judgeRoleDisplay');
    const cardContainer = document.querySelector('.card-container');

    page2.style.display = 'none';
    page4.style.display = 'flex';

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (let judge of window.judgesDatabase) {
        judgeNameDisplay.textContent = judge.name;
        judgeRoleDisplay.textContent = judge.role;
        
        await sleep(400);

        try {
            const canvas = await window.html2canvas(cardContainer, {
                scale: 3,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const link = document.createElement('a');
            // حفظ الصورة برقم الـ ID
            link.download = `${judge.id}.jpg`;
            link.href = canvas.toDataURL('image/jpeg', 0.95);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            await sleep(500);
        } catch (err) {
            console.error("خطأ في كارت:", judge.name, err);
        }
    }

    page4.style.display = 'none';
    page2.style.display = 'flex';
    btn.innerHTML = originalText;
    btn.disabled = false;
    alert("تم تحميل جميع كروت المحكمين بنجاح.");
}

// دالة تحميل كارت محكم واحد (من الصور المرفوعة مسبقاً في مجلد assets/judges)
function downloadSingleJudgeCard(judgeId) {
    // التحقق من وجود بيانات المحكم
    if (!window.judgesDatabase) {
        alert("بيانات المحكمين غير محملة.");
        return;
    }

    const judge = window.judgesDatabase.find(j => j.id === judgeId);
    if (!judge) {
        alert("لم يتم العثور على بيانات هذا المحكم.");
        return;
    }

    // إنشاء رابط وهمي لتحميل الصورة المحفوظة مسبقاً
    const link = document.createElement('a');
    // توجيه الرابط إلى المسار الصحيح للصورة المرفوعة
    link.href = `assets/judges/${judge.id}.jpg`;
    // تحديد اسم الملف عند التحميل ليكون بالاسم العربي لسهولة القراءة
    link.download = `${judge.name}_كارت_تعارف.jpg`; 
    
    // إضافة الرابط للصفحة، الضغط عليه، ثم إزالته
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
