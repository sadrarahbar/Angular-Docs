# dependencyهای npm در workspace

Angular Framework، ‏Angular CLI و componentهای مورد استفاده applicationهای انگولار به‌صورت [packageهای npm](https://docs.npmjs.com/getting-started/what-is-npm 'npm چیست؟') بسته‌بندی و از طریق [registry مربوط به npm](https://docs.npmjs.com) توزیع می‌شوند.

می‌توانید این packageهای npm را با [client مربوط به npm CLI](https://docs.npmjs.com/cli/install) دانلود و نصب کنید.
Angular CLI به‌طور پیش‌فرض از client مربوط به npm استفاده می‌کند.

HELPFUL: برای اطلاعات درباره نسخه‌های مورد نیاز و نصب `Node.js` و `npm`، [راه‌اندازی محیط محلی](tools/cli/setup-local 'راه‌اندازی برای توسعه محلی') را ببینید.

اگر پروژه‌هایی با نسخه‌های دیگر Node.js و npm روی دستگاه خود دارید، برای مدیریت نسخه‌های متعدد آن‌ها از [nvm](https://github.com/creationix/nvm) استفاده کنید.

## `package.json`

ابزار `npm`، ‏packageهای مشخص‌شده در فایل [`package.json`](https://docs.npmjs.com/files/package.json) را نصب می‌کند.

فرمان CLI به نام `ng new` هنگام ایجاد workspace جدید یک فایل `package.json` می‌سازد.
همه پروژه‌های workspace از این `package.json` استفاده می‌کنند؛ از جمله پروژه application اولیه‌ای که CLI هنگام ایجاد workspace می‌سازد.
کتابخانه‌های ایجادشده با `ng generate library` فایل `package.json` مخصوص خود را دارند.

این `package.json` در ابتدا شامل _مجموعه‌ای ابتدایی از packageها_ است؛ برخی برای انگولار ضروری هستند و برخی از سناریوهای رایج application پشتیبانی می‌کنند.
با تکامل application، ‏packageهای بیشتری به `package.json` اضافه می‌کنید.

## dependencyهای پیش‌فرض

packageهای انگولار زیر به‌عنوان dependency در فایل پیش‌فرض `package.json` مربوط به workspace جدید انگولار قرار دارند.
برای فهرست کامل packageهای انگولار، [مرجع API](api) را ببینید.

| نام package                                                                                    | جزئیات                                                                                                                                                                                                  |
| :--------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@angular/animations`](api#animations)                                                        | کتابخانه قدیمی animation انگولار، تعریف و اعمال effectهای animation مانند transition صفحه و فهرست را آسان می‌کند. [راهنمای animationهای قدیمی](guide/legacy-animations) را ببینید.                     |
| [`@angular/common`](api#common)                                                                | serviceها، pipeها و directiveهای پرکاربردی که تیم انگولار ارائه می‌کند.                                                                                                                                |
| `@angular/compiler`                                                                            | کامپایلر template انگولار. templateهای انگولار را درک و به کدی تبدیل می‌کند که application را اجرا می‌کند.                                                                                            |
| `@angular/compiler-cli`                                                                        | کامپایلر انگولار که فرمان‌های `ng build` و `ng serve` در Angular CLI آن را فراخوانی می‌کنند. templateهای انگولار را با `@angular/compiler` در کامپایل استاندارد TypeScript پردازش می‌کند.              |
| [`@angular/core`](api#core)                                                                    | بخش‌های حیاتی runtime فریم‌ورک که هر application به آن‌ها نیاز دارد؛ شامل همه decoratorهای metadata مانند `@Component`، ‏dependency injection و hookهای lifecycle مربوط به component.                |
| [`@angular/forms`](api#forms)                                                                  | پشتیبانی از [formهای template-driven](guide/forms) و [reactive formها](guide/forms/reactive-forms). [مقدمه formها](guide/forms) را ببینید.                                                           |
| [`@angular/platform-browser`](api#platform-browser)                                            | همه قابلیت‌های مرتبط با DOM و مرورگر، به‌ویژه بخش‌هایی که به render کردن در DOM کمک می‌کنند.                                                                                                          |
| [`@angular/platform-browser-dynamic`](api#platform-browser-dynamic)                            | شامل [providerها](api/core/Provider) و متدهای کامپایل و اجرای application روی client با [کامپایلر JIT](tools/cli/aot-compiler#choosing-a-compiler) است.                                               |
| [`@angular/router`](api#router)                                                                | module مربوط به router هنگام تغییر URL مرورگر میان صفحه‌های application جابه‌جا می‌شود. [Routing و Navigation](guide/routing) را ببینید.                                                             |
| [`@angular/cli`](https://github.com/angular/angular-cli)                                       | binary مربوط به Angular CLI را برای اجرای فرمان‌های `ng` در بر دارد.                                                                                                                                  |
| [`@angular-devkit/build-angular`](https://www.npmjs.com/package/@angular-devkit/build-angular) | builderهای پیش‌فرض CLI برای bundling، ‏testing و serve کردن applicationها و کتابخانه‌های انگولار را در بر دارد.                                                                                      |
| [`rxjs`](https://www.npmjs.com/package/rxjs)                                                   | کتابخانه‌ای برای برنامه‌نویسی reactive با استفاده از `Observableها`.                                                                                                                                |
| [`zone.js`](https://github.com/angular/zone.js)                                                | انگولار برای اجرای فرایندهای change detection هنگام ایجاد event توسط عملیات بومی JavaScript به `zone.js` متکی است.                                                                                    |
| [`typescript`](https://www.npmjs.com/package/typescript)                                       | کامپایلر TypeScript، ‏language server و تعریف نوع‌های داخلی.                                                                                                                                          |
