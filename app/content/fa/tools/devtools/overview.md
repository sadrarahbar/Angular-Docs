# مروری بر DevTools

Angular DevTools افزونه‌ای برای مرورگر است که قابلیت‌های اشکال‌زدایی و پروفایل‌گیری را برای برنامه‌های Angular فراهم می‌کند.

<docs-video src="https://www.youtube.com/embed/bavWOHZM6zE"/>

Angular DevTools را از [Chrome Web Store](https://chrome.google.com/webstore/detail/angular-developer-tools/ienfalfjdbdpebioblfackkekamfmbnh) یا [Firefox Addons](https://addons.mozilla.org/firefox/addon/angular-devtools/) نصب کنید.

در هر صفحه وب می‌توانید با فشردن <kbd>F12</kbd> یا <kbd><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd></kbd> در Windows یا Linux، و <kbd><kbd>Fn</kbd>+<kbd>F12</kbd></kbd> یا <kbd><kbd>Cmd</kbd>+<kbd>Option</kbd>+<kbd>I</kbd></kbd> در Mac، ابزارهای توسعه Chrome یا Firefox را باز کنید.
پس از بازشدن DevTools مرورگر و نصب Angular DevTools، آن را در تب «Angular» خواهید دید.

HELPFUL: صفحه تب جدید Chrome افزونه‌های نصب‌شده را اجرا نمی‌کند؛ بنابراین تب Angular در DevTools نمایش داده نمی‌شود. برای مشاهده آن، صفحه دیگری را باز کنید.

<img src="assets/images/guide/devtools/devtools.png" alt="An overview of Angular DevTools showing a tree of components for an application.">

## برنامه خود را باز کنید

پس از بازکردن افزونه، چهار تب دیگر مشاهده می‌کنید:

| تب‌ها | جزئیات |
| :--- | :--- |
| [Components](tools/devtools/component) | امکان بررسی کامپوننت‌ها و directiveهای برنامه و مشاهده یا ویرایش وضعیت آن‌ها را فراهم می‌کند. |
| [Profiler](tools/devtools/profiler) | امکان پروفایل‌گیری از برنامه و شناسایی گلوگاه عملکرد هنگام اجرای change detection را فراهم می‌کند. |
| [Injector Tree](tools/devtools/injectors) | سلسله‌مراتب Environment Injector و Element Injector را نمایش می‌دهد. |
| [Router Tree](tools/devtools/router) | درخت routing برنامه را نمایش می‌دهد. |

تب‌های دیگری مانند `Transfer State` آزمایشی‌اند، می‌توان آن‌ها را از تنظیمات DevTools فعال کرد و هنوز مستند نشده‌اند.

HELPFUL: اگر از مرورگرهای مبتنی بر Chromium استفاده می‌کنید، ممکن است [یکپارچه‌سازی با پنل Performance](/best-practices/profiling-with-chrome-devtools) برایتان مفید باشد.

<img src="assets/images/guide/devtools/devtools-tabs.png" alt="A screenshot of the top of Angular DevTools illustrating two tabs in the upper-left corner, one labeled 'Components' and another labeled 'Profiler'.">

در گوشه بالا سمت راست Angular DevTools دکمه اطلاعات قرار دارد که یک popover را باز می‌کند.
این popover، از جمله نسخه Angular در حال اجرا در صفحه و نسخه DevTools را نمایش می‌دهد.

### برنامه Angular شناسایی نشد

اگر هنگام بازکردن Angular DevTools پیام «Angular application not detected» را می‌بینید، ابزار نمی‌تواند با یک برنامه Angular در صفحه ارتباط برقرار کند.
رایج‌ترین دلیل این است که صفحه وب در حال بررسی، برنامه Angular ندارد.
مطمئن شوید صفحه درستی را بررسی می‌کنید و برنامه Angular در حال اجرا است.

### برنامه‌ای با پیکربندی production شناسایی شد

اگر پیام «We detected an application built with production configuration. Angular DevTools only supports development builds.» را می‌بینید، یک برنامه Angular در صفحه پیدا شده است، اما با بهینه‌سازی‌های production کامپایل شده است.
Angular CLI هنگام کامپایل برای production، قابلیت‌های مختلف اشکال‌زدایی را حذف می‌کند تا با کاهش مقدار JavaScript صفحه، عملکرد را بهبود دهد. این موارد شامل قابلیت‌های لازم برای ارتباط با DevTools نیز می‌شود.

برای اجرای DevTools باید برنامه را درحالی کامپایل کنید که بهینه‌سازی‌ها غیرفعال‌اند. `ng serve` به‌صورت پیش‌فرض همین کار را انجام می‌دهد.
اگر لازم است یک برنامه deployشده را اشکال‌زدایی کنید، بهینه‌سازی‌ها را با [گزینه پیکربندی `optimization`](reference/configs/workspace-config#optimization-configuration) و مقدار `{"optimization": false}` در build غیرفعال کنید.
