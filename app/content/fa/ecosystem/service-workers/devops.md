# DevOps مربوط به service worker

این صفحه مرجعی برای deployment و پشتیبانی برنامه‌های production است که از service worker مربوط به Angular استفاده می‌کنند.
همچنین جایگاه آن در محیط بزرگ‌تر production، رفتارش در شرایط گوناگون و منابع و سازوکارهای ایمنی موجود را توضیح می‌دهد.

## service worker و cache منابع برنامه

service worker مربوط به Angular را مانند یک forward cache یا لبه Content Delivery Network \(CDN\) در مرورگر کاربر نهایی تصور کنید.
این service worker بدون انتظار برای شبکه، از cache محلی به درخواست‌های برنامه Angular برای منابع یا داده پاسخ می‌دهد.
مانند هر cache دیگری، قواعدی برای انقضا و به‌روزرسانی محتوا دارد.

### نسخه‌های برنامه

در service worker مربوط به Angular، «نسخه» مجموعه منابعی است که build مشخصی از برنامه Angular را نمایندگی می‌کند.
هر build جدیدی که مستقر شود، حتی اگر تنها یک فایل تغییر کرده باشد، نسخه جدید برنامه محسوب می‌شود.
service worker ممکن است هم‌زمان چند نسخه را در cache داشته باشد و ارائه کند. بخش [tabهای برنامه](#application-tabs) را ببینید.

برای حفظ یکپارچگی، service worker مربوط به Angular همه فایل‌های یک نسخه را با هم گروه‌بندی می‌کند.
این فایل‌ها معمولاً HTML،‏ JS و CSS هستند که اغلب به یکدیگر reference می‌دهند و به محتوای مشخصی وابسته‌اند.
برای نمونه، `index.html` ممکن است تگ `<script>` ارجاع‌دهنده به `bundle.js` داشته باشد و تابع `startApp()` آن را فراخوانی کند.
هر بار که این نسخه `index.html` ارائه می‌شود، باید `bundle.js` متناظر نیز همراهش باشد.
اگر `startApp()` در هر دو فایل به `runApp()` تغییر نام دهد، ارائه `index.html` قدیمی که `startApp()` را فراخوانی می‌کند همراه bundle جدیدی که `runApp()` را تعریف می‌کند معتبر نیست.

این یکپارچگی هنگام lazy loading اهمیت ویژه‌ای دارد.
یک bundle از نوع JS ممکن است به چندین chunk از نوع lazy با نام‌های یکتای همان build ارجاع دهد.
اگر برنامه نسخه `X` بخواهد chunk از نوع lazy را بارگذاری کند، اما server به نسخه `X + 1` به‌روزرسانی شده باشد، عملیات شکست می‌خورد.

شناسه نسخه برنامه با محتوای همه منابع تعیین می‌شود و با تغییر هرکدام عوض خواهد شد.
در عمل، محتویات `ngsw.json` که hash همه محتوای شناخته‌شده را دارد نسخه را تعیین می‌کند.
تغییر هر فایل cacheشده، hash آن را در `ngsw.json` تغییر می‌دهد و service worker مجموعه فعال فایل‌ها را نسخه‌ای جدید تلقی می‌کند.

HELPFUL: فرایند build با اطلاعات `ngsw-config.json` فایل manifest به نام `ngsw.json` را می‌سازد.

این رفتار versionبندی به server برنامه اجازه می‌دهد همواره مجموعه‌ای سازگار از فایل‌ها را برای برنامه Angular تضمین کند.

#### بررسی به‌روزرسانی

هر بار که کاربر برنامه را باز یا refresh می‌کند، service worker مربوط به Angular با بررسی تغییرات manifest به نام `ngsw.json` به‌روزرسانی‌ها را بررسی می‌کند.
به‌روزرسانی یافت‌شده خودکار دانلود و cache شده و بار بعدی که برنامه بارگذاری شود ارائه می‌گردد.

### یکپارچگی منابع

یکی از عوارض احتمالی cache طولانی، cache شدن ناخواسته منبعی نامعتبر است.
در cache معمولی HTTP،‏ hard refresh یا انقضای cache اثر منفی آن را محدود می‌کند؛ اما service worker این محدودیت‌ها را نادیده گرفته و عملاً کل برنامه را طولانی‌مدت cache می‌کند.
بنابراین برای حفظ یکپارچگی، hash منابع را نگه می‌دارد.

#### محتوای دارای hash

service worker مربوط به Angular برای تضمین یکپارچگی، hash همه منابع دارای hash را اعتبارسنجی می‌کند.
در برنامه ساخته‌شده با [Angular CLI](tools/cli)، این شامل همه موارد دایرکتوری `dist` تحت پوشش پیکربندی `src/ngsw-config.json` است.

اگر فایلی اعتبارسنجی نشود، service worker برای جلوگیری از cache مرورگر یا واسطه، دریافت دوباره را با پارامتر URL از نوع cache-busting امتحان می‌کند.
اگر آن محتوا نیز نامعتبر باشد، کل نسخه برنامه نامعتبر تلقی و ارائه آن متوقف می‌شود.
در صورت نیاز وارد حالت امن می‌شود تا درخواست‌ها به شبکه بازگردند و در صورت خطر زیاد ارائه محتوای خراب، قدیمی یا نامعتبر از cache استفاده نمی‌کند.

ناسازگاری hash دلایل گوناگونی دارد:

- لایه‌های cache میان origin server و کاربر محتوای قدیمی ارائه کنند
- deployment غیراتمی باعث مشاهده محتوای نیمه‌به‌روزشده شود
- خطای build منابع را بدون به‌روزرسانی `ngsw.json` تغییر دهد، یا برعکس `ngsw.json` بدون منابع به‌روز شود

#### محتوای بدون hash

فقط منابع حاضر در `dist` هنگام ساخت manifest در `ngsw.json` دارای hash هستند.
محتوای سایر منابع، به‌ویژه CDNها، هنگام build ناشناخته است یا بیش از deployment برنامه تغییر می‌کند.

service worker محتوای بدون hash را نیز cache می‌کند و هم‌زمان با سیاست _stale while revalidate_ از headerهای cache در HTTP پیروی می‌کند.
حتی پس از نامعتبر اعلام شدن منبع توسط headerها، آن را ارائه می‌دهد و هم‌زمان در پس‌زمینه برای refresh تلاش می‌کند.
بنابراین منابع خراب بدون hash بیش از طول عمر پیکربندی‌شده در cache باقی نمی‌مانند.

### tabهای برنامه

تغییر ناگهانی نسخه منابع برای برنامه مشکل‌ساز است؛ بخش [نسخه‌های برنامه](#application-versions) را ببینید.

service worker تضمین می‌کند برنامه در حال اجرا همان نسخه را ادامه دهد.
اگر instance دیگری در tab جدید باز شود، جدیدترین نسخه ارائه می‌شود؛ بنابراین tab جدید ممکن است نسخه‌ای متفاوت از tab اصلی اجرا کند.

IMPORTANT: این تضمین از مدل deployment معمول وب **قوی‌تر** است؛ بدون service worker تضمینی نیست کد lazy-loaded هم‌نسخه کد اولیه باشد.

service worker ممکن است در شرایط خطا نسخه برنامه در حال اجرا را تغییر دهد:

- نسخه فعلی به‌دلیل شکست hash نامعتبر شود.
- خطایی نامرتبط service worker را وارد حالت امن کرده و موقتاً غیرفعال کند.

نسخه‌هایی که هیچ tabی استفاده نمی‌کند پاک می‌شوند.

موارد عادی تغییر نسخه نیز عبارت‌اند از:

- reload/refresh صفحه.
- درخواست فعال‌سازی فوری به‌روزرسانی با service به نام `SwUpdate`.

### به‌روزرسانی‌های service worker

service worker مربوط به Angular اسکریپت کوچکی در مرورگر است که گاه با رفع باگ و بهبود قابلیت‌ها به‌روزرسانی می‌شود.
هنگام نخستین باز شدن برنامه و دسترسی پس از دوره‌ای عدم فعالیت دانلود می‌شود و تغییراتش در پس‌زمینه به‌روزرسانی می‌گردد.

بیشتر به‌روزرسانی‌ها برای برنامه شفاف‌اند و cacheهای قدیمی معتبر می‌مانند.
گاهی رفع باگ یا قابلیتی جدید مستلزم نامعتبر کردن cacheهای قدیمی است؛ در این حالت service worker برنامه را به‌طور شفاف از شبکه refresh می‌کند.

### عبور دادن درخواست از service worker

گاهی می‌خواهید service worker کاملاً نادیده گرفته شود؛ مانند اتکا به قابلیت پشتیبانی‌نشده‌ای مثل [گزارش پیشرفت upload فایل](https://github.com/w3c/ServiceWorker/issues/1141).

برای این کار `ngsw-bypass` را به‌عنوان header درخواست یا پارامتر query تنظیم کنید.
مقدار آن نادیده گرفته می‌شود و می‌تواند خالی یا حذف‌شده باشد.

### درخواست‌ها هنگام دسترس‌ناپذیری server

service worker همه درخواست‌ها را پردازش می‌کند مگر آنکه [صریحاً نادیده گرفته شود](#bypassing-the-service-worker).
بسته به وضعیت و پیکربندی cache، پاسخ cacheشده برمی‌گرداند یا درخواست را به server می‌فرستد.
فقط پاسخ درخواست‌های بدون تغییر داده مانند `GET` و `HEAD` cache می‌شوند.

اگر خطایی از server دریافت شود یا پاسخی نرسد، status خطایی متناسب برمی‌گرداند.
برای نمونه، در نبود پاسخ [504 Gateway Timeout](https://developer.mozilla.org/docs/Web/HTTP/Status/504) ایجاد می‌کند؛ ممکن است server آفلاین یا client قطع باشد.

## debugging کردن service worker مربوط به Angular

گاهی برای بررسی مشکلات یا عملکرد صحیح، باید service worker در حال اجرا را تحلیل کرد.
مرورگرها ابزارهای داخلی debugging دارند و خود service worker نیز قابلیت‌های مفیدی ارائه می‌کند.

### یافتن و تحلیل اطلاعات debugging

اطلاعات debugging زیر دایرکتوری مجازی `ngsw/` ارائه می‌شود؛ اکنون تنها URL آن `ngsw/state` است. نمونه:

```shell {hideCopy}

NGSW Debug Info:

Driver version: 13.3.7
Driver state: NORMAL ((nominal))
Latest manifest hash: eea7f5f464f90789b621170af5a569d6be077e5c
Last update check: never

=== Version eea7f5f464f90789b621170af5a569d6be077e5c ===

Clients: 7b79a015-69af-4d3d-9ae6-95ba90c79486, 5bc08295-aaf2-42f3-a4cc-9e4ef9100f65

=== Idle Task Queue ===
Last update tick: 1s496u
Last update run: never
Task queue:

- init post-load (update, cleanup)

Debug log:

```

#### وضعیت driver

خط نخست وضعیت driver را نشان می‌دهد:

```shell {hideCopy}

Driver state: NORMAL ((nominal))

```

`NORMAL` یعنی service worker عادی و بدون افت عملکرد کار می‌کند.

دو وضعیت افت‌کرده ممکن است:

| وضعیت | جزئیات |
| :--- | :--- |
| `EXISTING_CLIENTS_ONLY` | نسخه پاکی از آخرین نسخه شناخته‌شده موجود نیست. نسخه‌های cacheشده قدیمی امن‌اند و tabهای موجود از cache ادامه می‌دهند، اما بارگذاری‌های جدید از شبکه ارائه می‌شوند. با یافتن و نصب نسخه جدید، یعنی `ngsw.json` جدید، برای بازیابی تلاش می‌شود. |
| `SAFE_MODE` | ایمنی داده cacheشده قابل‌تضمین نیست؛ خطای غیرمنتظره رخ داده یا همه نسخه‌ها نامعتبرند. تمام ترافیک از شبکه و با کمترین اجرای کد service worker ارائه می‌شود. |

در هر دو، توضیح درون پرانتز خطای عامل ورود به وضعیت را ارائه می‌کند.
هر دو موقتی و فقط در طول عمر [instance مربوط به ServiceWorker](https://developer.mozilla.org/docs/Web/API/ServiceWorkerGlobalScope) ذخیره می‌شوند.
مرورگر گاهی service worker بیکار را برای صرفه‌جویی می‌بندد و در رویداد شبکه instance جدیدی می‌سازد که مستقل از وضعیت قبلی در `NORMAL` آغاز می‌شود.

#### آخرین hash مربوط به manifest

```shell {hideCopy}

Latest manifest hash: eea7f5f464f90789b621170af5a569d6be077e5c

```

این SHA1 hash جدیدترین نسخه شناخته‌شده برنامه است.

#### آخرین بررسی به‌روزرسانی

```shell {hideCopy}

Last update check: never

```

زمان آخرین بررسی نسخه جدید را نشان می‌دهد؛ `never` یعنی هرگز بررسی نشده است.
در فایل نمونه، بررسی طبق توضیح بخش بعد زمان‌بندی شده است.

#### نسخه

```shell {hideCopy}

=== Version eea7f5f464f90789b621170af5a569d6be077e5c ===

Clients: 7b79a015-69af-4d3d-9ae6-95ba90c79486, 5bc08295-aaf2-42f3-a4cc-9e4ef9100f65

```

در نمونه، یک نسخه cacheشده برنامه دو tab را ارائه می‌کند.

HELPFUL: این hash همان «latest manifest hash» بالاست؛ هر دو client روی آخرین نسخه‌اند و با ID خود از API به نام `Clients` فهرست شده‌اند.

#### صف وظایف بیکار

```shell {hideCopy}

=== Idle Task Queue ===
Last update tick: 1s496u
Last update run: never
Task queue:

- init post-load (update, cleanup)

```

Idle Task Queue صف همه وظایف در انتظار پس‌زمینه service worker است و وظایف با توضیح فهرست می‌شوند.
اینجا یک عملیات پس از مقداردهی اولیه شامل بررسی به‌روزرسانی و پاک‌سازی cacheهای قدیمی زمان‌بندی شده است.

شمارنده‌های آخرین tick/run زمان سپری‌شده از رویدادهای مرتبط را می‌دهند.
`Last update run` آخرین اجرای واقعی وظایف بیکار و `Last update tick` زمان آخرین رویدادی را نشان می‌دهد که پس از آن امکان پردازش صف وجود داشت.

#### log مربوط به debugging

```shell {hideCopy}

Debug log:

```

خطاهای درون service worker اینجا ثبت می‌شوند.

### ابزارهای توسعه‌دهنده

مرورگرهایی مانند Chrome ابزار تعامل با service worker دارند. نکات مهم:

- با ابزار توسعه‌دهنده، service worker در پس‌زمینه فعال می‌ماند و restart نمی‌شود؛ بنابراین رفتار ممکن است با تجربه کاربر متفاوت باشد.
- نمای Cache Storage اغلب قدیمی است؛ روی عنوان آن راست‌کلیک و cacheها را refresh کنید.
- توقف و شروع service worker در پنل Service Worker، به‌روزرسانی‌ها را بررسی می‌کند.

## ایمنی service worker

باگ یا پیکربندی خراب می‌تواند رفتار غیرمنتظره ایجاد کند؛ سازوکارهای زیر امکان غیرفعال‌سازی سریع را فراهم می‌کنند.

### Fail-safe

برای غیرفعال‌سازی، فایل `ngsw.json` را تغییر نام دهید یا حذف کنید.
با بازگشت `404`،‏ service worker همه cacheها را حذف، خود را deregister و عملاً نابود می‌کند.

### Safety worker

<!-- vale Angular.Google_Acronyms = NO -->

اسکریپت کوچک `safety-worker.js` نیز در package مربوط به npm به نام `@angular/service-worker` وجود دارد.
پس از بارگذاری، خود را در مرورگر unregister کرده و cacheهای service worker را حذف می‌کند.
این آخرین راه برای حذف service workerهای ناخواسته نصب‌شده روی صفحه client است.

<!-- vale Angular.Google_Acronyms = YES -->

CRITICAL: نمی‌توانید آن را مستقیم ثبت کنید، زیرا clientهای قدیمی ممکن است `index.html` جدید نصب‌کننده اسکریپت متفاوت را نبینند.

در عوض، محتوای `safety-worker.js` را در URL اسکریپت Service Worker موردنظر ارائه دهید و تا اطمینان از unregister شدن همه کاربران ادامه دهید؛ برای بیشتر سایت‌ها یعنی ارائه همیشگی safety worker در URL قدیمی.
این اسکریپت `@angular/service-worker` و cacheهایش و نیز هر Service Worker دیگری را که پیش‌تر سایت ارائه کرده حذف می‌کند.

### تغییر محل برنامه

IMPORTANT: service worker پشت redirect کار نمی‌کند.
ممکن است خطای `The script resource is behind a redirect, which is disallowed` را دیده باشید.

با تغییر محل برنامه و redirect از محل قدیمی مانند `example.com` به `www.example.com`،‏ worker متوقف می‌شود.
برای کاربرانی که سایت را کاملاً از Service Worker می‌گیرند حتی redirect اجرا نمی‌شود.
worker قدیمی ثبت‌شده در `example.com` برای به‌روزرسانی به محل قدیمی درخواست می‌فرستد؛ redirect به محل جدید خطای یادشده را ایجاد می‌کند.

برای رفع آن، worker قدیمی را با [Fail-safe](#fail-safe) یا [Safety Worker](#safety-worker) غیرفعال کنید.

## مطالب بیشتر درباره service workerهای Angular

ممکن است مطالب زیر نیز مفید باشند:

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/config" title="فایل پیکربندی"/>
  <docs-pill href="ecosystem/service-workers/communications" title="ارتباط با Service Worker"/>
</docs-pill-row>
