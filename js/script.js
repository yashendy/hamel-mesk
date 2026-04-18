// دالة البحث عن الطالب برقم الجلوس
function searchStudent() {
    const searchId = document.getElementById('searchStudentId').value;
    const studentName = document.getElementById('studentName');
    const studentGrade = document.getElementById('studentGrade');
    const studentRank = document.getElementById('studentRank');

    const student = studentsDatabase.find(s => s.id === searchId);

    if (student) {
        studentName.value = student.name;
        studentGrade.value = student.grade;
        studentRank.value = student.rank;
    } else if (searchId === "") {
        studentName.value = "";
        studentGrade.value = "";
        studentRank.value = "";
    }
}

// دالة التنقل بين الصفحات
function showPage(pageNum) {
    const pages = [document.getElementById('page1'), document.getElementById('page2'), document.getElementById('page3')];
    const btns = [document.getElementById('btnPage1'), document.getElementById('btnPage2'), document.getElementById('btnPage3')];

    pages.forEach((p, index) => {
        if (p) p.style.display = (index + 1 === pageNum) ? 'flex' : 'none';
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
}

// دوال رفع الشعار
function openDataModal() {
    document.getElementById('dataModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('dataModal').classList.add('hidden');
}

function saveDataFromModal() {
    const logoInput = document.getElementById('modalLogo');
    
    if (logoInput.files && logoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const logoImg = document.getElementById('cardLogo');
            logoImg.src = e.target.result;
            logoImg.style.display = 'block';
        };
        reader.readAsDataURL(logoInput.files[0]);
    }
    
    closeModal();
}

// دالة التحميل كصورة
function downloadCard(btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="font-cairo">جاري التحضير...</span>';
    
    const executeDownload = () => {
        const card = document.querySelector('.card-container');
        const inputs = document.querySelectorAll('.card-container input');
        
        inputs.forEach(input => {
            input.dataset.placeholder = input.placeholder;
            if (!input.value) input.placeholder = '';
        });

        window.html2canvas(card, {
            scale: 3, 
            useCORS: true,
            backgroundColor: '#ffffff'
        }).then(canvas => {
            inputs.forEach(input => {
                input.placeholder = input.dataset.placeholder;
            });
            
            const link = document.createElement('a');
            link.download = 'بطاقة_الأكاديمية.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            btn.innerHTML = originalText;
        }).catch(err => {
            console.error("خطأ: ", err);
            btn.innerHTML = originalText;
            alert("حدث خطأ. سيتم فتح نافذة الطباعة كبديل.");
            window.print();
        });
    };

    if (typeof window.html2canvas === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        script.onload = executeDownload;
        script.onerror = () => {
            btn.innerHTML = originalText;
            window.print();
        };
        document.body.appendChild(script);
    } else {
        executeDownload();
    }
}
