const appState = {
    currentPage: 1
};

const pageButtons = Array.from(document.querySelectorAll(".page-btn"));
const pagePanels = [
    document.getElementById("page1"),
    document.getElementById("page2"),
    document.getElementById("page3")
];

const downloadButton = document.getElementById("downloadBtn");
const searchStudentIdInput = document.getElementById("searchStudentId");
const studentNameInput = document.getElementById("studentName");
const studentGradeInput = document.getElementById("studentGrade");
const studentRankInput = document.getElementById("studentRank");

function showPage(pageNumber) {
    appState.currentPage = pageNumber;

    pagePanels.forEach((panel, index) => {
        const isActive = index + 1 === pageNumber;
        panel.classList.toggle("hidden", !isActive);
    });

    pageButtons.forEach((button, index) => {
        const isActive = index + 1 === pageNumber;

        if (isActive) {
            button.className =
                "page-btn bg-blue-900 text-white font-cairo font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2";
        } else {
            button.className =
                "page-btn bg-gray-200 text-gray-700 hover:bg-gray-300 font-cairo font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2";
        }
    });
}

function clearStudentFields() {
    studentNameInput.value = "";
    studentGradeInput.value = "";
    studentRankInput.value = "";
}

function searchStudent() {
    const searchId = searchStudentIdInput.value.trim();

    if (!searchId) {
        clearStudentFields();
        return;
    }

    const student = window.studentsDatabase.find((item) => item.id === searchId);

    if (student) {
        studentNameInput.value = student.name;
        studentGradeInput.value = student.grade;
        studentRankInput.value = student.rank;
        return;
    }

    clearStudentFields();
}

function getCurrentPageFileName() {
    if (appState.currentPage === 1) {
        return "الصفحة_الرئيسية.png";
    }

    if (appState.currentPage === 2) {
        return "لجنة_التحكيم.png";
    }

    if (appState.currentPage === 3) {
        const studentName = studentNameInput.value.trim();
        return studentName ? `بيان_نجاح_${studentName}.png` : "بيان_نجاح_طالب.png";
    }

    return "بطاقة_الأكاديمية.png";
}

function prepareInputsForExport() {
    const inputs = document.querySelectorAll(".card-container input");

    inputs.forEach((input) => {
        input.dataset.placeholder = input.placeholder;
        if (!input.value) {
            input.placeholder = "";
        }
    });

    return inputs;
}

function restoreInputsAfterExport(inputs) {
    inputs.forEach((input) => {
        input.placeholder = input.dataset.placeholder || "";
    });
}

async function downloadCurrentCard() {
    const originalButtonContent = downloadButton.innerHTML;
    downloadButton.disabled = true;
    downloadButton.innerHTML = '<span class="font-cairo">جاري التحضير...</span>';

    const inputs = prepareInputsForExport();

    try {
        const card = document.querySelector(".card-container");

        if (typeof window.html2canvas !== "function") {
            throw new Error("html2canvas library is not available.");
        }

        const canvas = await window.html2canvas(card, {
            scale: 3,
            useCORS: true,
            backgroundColor: "#ffffff"
        });

        const link = document.createElement("a");
        link.download = getCurrentPageFileName();
        link.href = canvas.toDataURL("image/png");
        link.click();
    } catch (error) {
        console.error("Error exporting card:", error);
        alert("حدث خطأ أثناء تجهيز الصورة، سيتم فتح الطباعة كبديل.");
        window.print();
    } finally {
        restoreInputsAfterExport(inputs);
        downloadButton.disabled = false;
        downloadButton.innerHTML = originalButtonContent;
    }
}

function attachEvents() {
    pageButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const pageNumber = Number(button.dataset.page);
            showPage(pageNumber);
        });
    });

    if (searchStudentIdInput) {
        searchStudentIdInput.addEventListener("input", searchStudent);
    }

    if (downloadButton) {
        downloadButton.addEventListener("click", downloadCurrentCard);
    }
}

function init() {
    attachEvents();
    showPage(1);
}

document.addEventListener("DOMContentLoaded", init);
