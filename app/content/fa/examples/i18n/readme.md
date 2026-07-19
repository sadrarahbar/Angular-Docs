# نمونه Internationalization با Angular i18n

این sample از صفحه "[Example Angular Internationalization application](https://angular.dev/guide/i18n/example)" در مستندات Angular آمده است.

## نصب و اجرای دانلود

1. با `npm install` packageهای node_module را نصب کنید
2. با `npm start` اجرای آن را به انگلیسی ببینید
3. با `npm run start:fr` اجرای آن را با ترجمه فرانسوی ببینید.

> برای توضیح این commandها، scriptهای داخل `package.json` را ببینید.

## اجرا در StackBlitz

StackBlitz به صورت پیش‌فرض نسخه انگلیسی را compile و اجرا می‌کند.

برای دیدن ترجمه نمونه به فرانسوی با Angular i18n:

1. فایل `project.json` را باز کنید و مورد زیر را به انتهای آن اضافه کنید:

```json
  "stackblitz": {
    "startCommand": "npm run start:fr"
  }
```

1. روی دکمه "Fork" در header مربوط به StackBlitz کلیک کنید. این کار یک کپی جدید با این تغییر برای شما می‌سازد و نمونه را دوباره به فرانسوی اجرا می‌کند.

