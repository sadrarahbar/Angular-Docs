# پروفایل‌گیری با Chrome DevTools

Angular با [API توسعه‌پذیری Chrome DevTools](https://developer.chrome.com/docs/devtools/performance/extension) یکپارچه می‌شود تا داده‌ها و بینش‌های اختصاصی framework را مستقیماً در [پنل Performance در Chrome DevTools](https://developer.chrome.com/docs/devtools/performance/overview) نمایش دهد.

پس از فعال‌کردن این یکپارچگی می‌توانید یک [پروفایل عملکرد ثبت کنید](https://developer.chrome.com/docs/devtools/performance#record) که شامل دو مجموعه داده است:

- داده‌های استاندارد عملکرد بر اساس برداشتی که Chrome از اجرای کد شما در مرورگر دارد؛ و
- داده‌های اختصاصی Angular که runtime این framework فراهم می‌کند.

هر دو مجموعه در یک tab اما روی trackهای جداگانه نمایش داده می‌شوند:

<img alt="track اختصاصی Angular در profiler ابزار Chrome DevTools" src="assets/images/best-practices/runtime-performance/angular-perf-in-chrome.png">

داده‌های اختصاصی Angular با مفاهیم framework مانند کامپوننت‌ها، change detection و hookهای چرخهٔ حیات بیان می‌شوند و در کنار فراخوانی‌های سطح پایین‌تر تابع و متد قرار می‌گیرند که مرورگر ثبت کرده است. این دو مجموعه داده با هم ارتباط دارند و می‌توانید میان نماها و سطوح جزئیات مختلف جابه‌جا شوید.

با track مربوط به Angular می‌توانید درک بهتری از نحوهٔ اجرای کد در مرورگر به دست آورید، از جمله:

- تشخیص اینکه یک بلوک کد مشخص بخشی از برنامهٔ Angular است یا به script دیگری در همان صفحه تعلق دارد.
- شناسایی گلوگاه‌های عملکرد و نسبت‌دادن آن‌ها به کامپوننت یا service مشخص.
- دستیابی به دیدی عمیق‌تر از عملکرد داخلی Angular با نمایش بصری اجزای هر چرخهٔ change detection.

## ثبت پروفایل

### فعال‌کردن یکپارچگی

پروفایل‌گیری Angular را به یکی از دو روش زیر فعال کنید:

1. [`ng.enableProfiling()`](api/core/enableProfiling) را در پنل Console در Chrome اجرا کنید؛ یا
1. فراخوانی [`enableProfiling()`](api/core/enableProfiling) را که از `@angular/core` وارد شده است، به کد راه‌اندازی برنامه اضافه کنید.

NOTE: پروفایل‌گیری Angular فقط در حالت development کار می‌کند.

نمونهٔ زیر این یکپارچگی را هنگام bootstrap برنامه فعال می‌کند تا تمام رویدادهای ممکن ثبت شوند:

```ts
import {enableProfiling} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {MyApp} from './my-app';

// Turn on profiling *before* bootstrapping your application
// in order to capture all of the code run on start-up.
enableProfiling();
bootstrapApplication(MyApp);
```

### ثبت یک پروفایل

از دکمهٔ **Record** در پنل Performance ابزار Chrome DevTools استفاده کنید:

<img alt="ثبت یک پروفایل" src="assets/images/best-practices/runtime-performance/recording-profile-in-chrome.png">

برای جزئیات بیشتر دربارهٔ ثبت پروفایل، [مستندات Chrome DevTools](https://developer.chrome.com/docs/devtools/performance#record) را ببینید.

## بازکردن یک کامپوننت در Angular DevTools

پس از ثبت پروفایل، یک رویداد کامپوننت را در track مربوط به **Angular** انتخاب کنید.
ممکن است tab **Summary** شامل لینک **Component** با الگوی URL به‌شکل `angular-devtools://component/...` باشد.

<img alt="پنل Performance ابزار Chrome DevTools که track اختصاصی Angular را با رویداد انتخاب‌شدهٔ _MainComponent نشان می‌دهد. tab مربوط به Summary شامل لینک Component با الگوی angular-devtools://component است." src="assets/images/best-practices/runtime-performance/chrome-performance-deep-link.png">

روی لینک کلیک کنید تا Angular DevTools باز شود و کامپوننت متناظر را در tab مربوط به **Components** انتخاب کند.
این قابلیت کمک می‌کند از پروفایل سطح مرورگر به وضعیت و metadata کامپوننت مربوط به رویداد انتخاب‌شده بروید.

NOTE: بازکردن لینک کامپوننت به Angular DevTools برای Chrome و فعال‌بودن flag آزمایشی `chrome://flags/#enable-devtools-deep-link-via-extensibility-api` در Chrome نیاز دارد.

## تفسیر پروفایل ثبت‌شده

با track اختصاصی «Angular» می‌توانید مشکلات عملکرد را سریع شناسایی و عیب‌یابی کنید. بخش‌های زیر چند سناریوی رایج پروفایل‌گیری را شرح می‌دهند.

### تمایز میان برنامهٔ Angular و سایر taskهای همان صفحه

از آنجا که داده‌های Angular و Chrome روی trackهای جدا اما مرتبط نمایش داده می‌شوند، می‌توانید زمان اجرای کد برنامهٔ Angular را از پردازش‌های دیگر مرورگر، معمولاً layout و paint، یا scriptهای دیگر همان صفحه تشخیص دهید. در حالت دوم، track اختصاصی Angular داده‌ای ندارد:

<img alt="داده‌های پروفایل: اجرای Angular در برابر scriptهای شخص ثالث" src="assets/images/best-practices/runtime-performance/profile-angular-vs-3rd-party.png">

به این ترتیب می‌توانید مشخص کنید بررسی‌های بعدی باید روی کد برنامهٔ Angular متمرکز شوند یا بخش‌های دیگر codebase و وابستگی‌ها.

### کدگذاری رنگی

Angular برای متمایزکردن انواع task در نمودار flame chart از رنگ‌ها استفاده می‌کند:

- 🔵 آبی نشان‌دهندهٔ کد TypeScript نوشته‌شده توسط توسعه‌دهندهٔ برنامه است؛ مانند serviceها، constructor کامپوننت‌ها و hookهای چرخهٔ حیات.
- 🟣 بنفش نشان‌دهندهٔ کد template نوشته‌شده توسط توسعه‌دهنده و تبدیل‌شده توسط compiler انگولار است.
- 🟢 سبز نقطه‌های ورود به کد برنامه را نشان می‌دهد و _دلایل_ اجرای کد را مشخص می‌کند.

نمونه‌های زیر این رنگ‌بندی را در چند پروفایل واقعی نشان می‌دهند.

#### نمونه: bootstrap برنامه

فرایند bootstrap برنامه معمولاً شامل موارد زیر است:

- triggerهایی با رنگ آبی، مانند فراخوانی `bootstrapApplication`، نمونه‌سازی کامپوننت ریشه و change detection اولیه
- serviceهای مختلف DI که هنگام bootstrap نمونه‌سازی شده و با سبز مشخص می‌شوند.

<img alt="داده‌های پروفایل: bootstrap برنامه" src="assets/images/best-practices/runtime-performance/profile-bootstrap-application.png">

#### نمونه: اجرای کامپوننت

پردازش یک کامپوننت معمولاً به‌شکل یک نقطهٔ ورود آبی و سپس اجرای template بنفش آن نمایش داده می‌شود. template نیز ممکن است نمونه‌سازی directiveها و اجرای hookهای چرخهٔ حیات سبز را فعال کند:

<img alt="داده‌های پروفایل: پردازش کامپوننت" src="assets/images/best-practices/runtime-performance/profile-component-processing.png">

#### نمونه: Change detection

یک چرخهٔ change detection معمولاً شامل یک یا چند مرحلهٔ همگام‌سازی داده با رنگ آبی است که در هر مرحله بخشی از کامپوننت‌ها پیمایش می‌شوند.

<img alt="داده‌های پروفایل: change detection" src="assets/images/best-practices/runtime-performance/profile-change-detection.png">

با این نمایش می‌توان کامپوننت‌های درگیر در change detection و کامپوننت‌های نادیده‌گرفته‌شده را فوراً تشخیص داد؛ این موارد معمولاً کامپوننت‌های `OnPush` هستند که dirty علامت‌گذاری نشده‌اند.

همچنین می‌توانید تعداد مراحل همگام‌سازی در یک change detection را بررسی کنید. وجود بیش از یک مرحله نشان می‌دهد state هنگام change detection به‌روزرسانی می‌شود. باید از این کار پرهیز کنید، زیرا به‌روزرسانی صفحه را کند می‌کند و در بدترین حالت حتی می‌تواند حلقهٔ بی‌نهایت ایجاد کند.
