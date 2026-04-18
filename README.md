# Academy Card Project

مشروع صفحة بطاقة/دبلومة أكاديمية حامل المسك باستخدام:

- HTML
- CSS
- JavaScript
- Tailwind CSS
- html2canvas

## هيكل المشروع

```text
academy-card-project/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── data/
│   └── students.js
└── assets/
    ├── logo.png
    ├── stamp-right.png
    ├── stamp-center.png
    └── stamp-left.png
```

## ملاحظات مهمة

1. الشعار الآن صورة ثابتة من المسار:
   `assets/logo.png`

2. أختام صفحة الطلبة ثابتة أسفل الصفحة من المسارات:
   - `assets/stamp-right.png`
   - `assets/stamp-center.png`
   - `assets/stamp-left.png`

3. بيانات الطلبة موجودة في:
   `data/students.js`

## التشغيل

افتح الملف `index.html` مباشرة في المتصفح.

## التعديل على الطلبة

أضف الطلبة بنفس الصيغة:

```js
window.studentsDatabase = [
    { id: "1", name: "اسم الطالب", grade: "ممتاز", rank: "الأول" }
];
```

## الرفع على GitHub

ارفع جميع الملفات بنفس الهيكل بدون تغيير المسارات.
