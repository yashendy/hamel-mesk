let currentPage = 1;

function getStudentFields() {
  return {
    idInput: document.getElementById('searchStudentId'),
    nameInput: document.getElementById('studentName'),
    gradeInput: document.getElementById('studentGrade'),
    rankInput: document.getElementById('studentRank')
  };
}

function clearStudentFields() {
  const { nameInput, gradeInput, rankInput } = getStudentFields();
  nameInput.value = '';
  gradeInput.value = '';
  rankInput.value = '';
}

function searchStudent() {
  const { idInput, nameInput, gradeInput, rankInput } = getStudentFields();
  const searchId = idInput.value.trim();

  if (!searchId) {
    clearStudentFields();
    return;
  }

  const student = studentsDatabase[searchId];

  if (student) {
    nameInput.value = student.name;
    gradeInput.value = student.grade;
    rankInput.value = student.rank;
  } else {
    clearStudentFields();
  }
}

function showPage(pageNum) {
  currentPage = pageNum;

  const pages = [
    document.getElementById('page1'),
    document.getElementById('page2'),
    document.getElementById('page3')
  ];

  const btns = [
    document.getElementById('btnPage1'),
    document.getElementById('btnPage2'),
    document.getElementById('btnPage3')
  ];

  pages.forEach((page, index) => {
    page.style.display = index + 1 === pageNum ? 'flex' : 'none';
  });

  btns.forEach((button, index) => {
    button.className = index + 1 === pageNum
      ? 'bg-blue-900 text-white font-cairo font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 font-cairo font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2';
  });
}

function getDownloadFileName() {
  if (currentPage === 1) return 'الصفحة_الرئيسية.png';
  if (currentPage === 2) return 'لجنة_التحكيم.png';

  const studentName = document.getElementById('studentName').value.trim();
  return studentName ? `بيان_نجاح_${studentName}.png` : 'بيان_نجاح_طالب.png';
}

function downloadCard(btn) {
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="font-cairo">جاري التحضير...</span>';
  btn.disabled = true;

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
        input.placeholder = input.dataset.placeholder || '';
      });

      const link = document.createElement('a');
      link.download = getDownloadFileName();
      link.href = canvas.toDataURL('image/png');
      link.click();

      btn.innerHTML = originalText;
      btn.disabled = false;
    }).catch(error => {
      console.error('خطأ في معالجة الصورة:', error);

      inputs.forEach(input => {
        input.placeholder = input.dataset.placeholder || '';
      });

      btn.innerHTML = originalText;
      btn.disabled = false;
      alert('عذراً، حدث خطأ أثناء تجهيز الصورة. سيتم فتح نافذة الطباعة كبديل.');
      window.print();
    });
  };

  if (typeof window.html2canvas === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    script.onload = executeDownload;
    script.onerror = () => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      alert('تعذر تحميل أداة الصورة، سيتم استخدام الطباعة الافتراضية بدلاً من ذلك.');
      window.print();
    };
    document.body.appendChild(script);
  } else {
    executeDownload();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  showPage(1);
});
