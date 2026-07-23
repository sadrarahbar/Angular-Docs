# مرور کلی service worker انگولار

IMPORTANT: Angular Service Worker یک ابزار ساده caching برای پشتیبانی محدود از حالت offline است. به‌جز اصلاحات امنیتی، قابلیت جدیدی به آن افزوده نخواهد شد. برای caching پیشرفته‌تر و قابلیت‌های offline، پیشنهاد می‌کنیم APIهای بومی مرورگر را مستقیماً بررسی کنید.

service workerها مدل سنتی استقرار وب را گسترش می‌دهند و applicationها را قادر می‌سازند تجربه‌ای با قابلیت اطمینان و performance هم‌سطح کدی ارائه کنند که برای اجرا روی سیستم‌عامل و سخت‌افزار شما نوشته شده است.
افزودن service worker به application انگولار یکی از مراحل تبدیل application به [Progressive Web App](https://web.dev/progressive-web-apps/) \(که PWA نیز نامیده می‌شود\) است.

در ساده‌ترین حالت، service worker یک script است که در مرورگر وب اجرا می‌شود و caching یک application را مدیریت می‌کند.

service workerها مانند network proxy عمل می‌کنند.
آن‌ها همه requestهای خروجی HTTP ایجادشده توسط application را رهگیری می‌کنند و می‌توانند نحوه پاسخ‌گویی به آن‌ها را انتخاب کنند.
برای نمونه، می‌توانند cache محلی را بررسی کنند و اگر response ذخیره‌شده‌ای وجود داشت، آن را ارائه دهند.
proxy کردن به requestهای ایجادشده از طریق APIهای برنامه‌نویسی مانند `fetch` محدود نیست؛ resourceهای ارجاع‌شده در HTML و حتی request اولیه `index.html` را نیز شامل می‌شود.
بنابراین caching مبتنی بر service worker کاملاً قابل برنامه‌ریزی است و به headerهای caching تعیین‌شده توسط server وابسته نیست.

برخلاف سایر scriptهای تشکیل‌دهنده application مانند bundle انگولار، service worker پس از بستن tab توسط کاربر حفظ می‌شود.
بار بعدی که مرورگر application را بارگذاری کند، service worker ابتدا بارگذاری می‌شود و می‌تواند همه requestهای resourceهای مورد نیاز برای بارگذاری application را رهگیری کند.
اگر service worker برای این کار طراحی شده باشد، می‌تواند _بدون نیاز به network، بارگذاری application را به‌طور کامل انجام دهد_.

حتی در یک network سریع و قابل اعتماد، تأخیر رفت‌وبرگشت هنگام بارگذاری application می‌تواند latency قابل توجهی ایجاد کند.
کاهش وابستگی به network با استفاده از service worker می‌تواند تجربه کاربری را به میزان زیادی بهبود دهد.

## service workerها در انگولار

applicationهای انگولار به‌عنوان single-page application شرایط بسیار مناسبی برای بهره‌گیری از مزایای service workerها دارند. انگولار یک پیاده‌سازی service worker ارائه می‌کند. توسعه‌دهندگان انگولار بدون نیاز به کدنویسی با APIهای سطح پایین می‌توانند از افزایش قابلیت اطمینان و performance حاصل از این service worker بهره ببرند.

service worker انگولار برای بهینه‌سازی تجربه کاربر نهایی هنگام استفاده از application روی اتصال network کند یا نامطمئن طراحی شده و هم‌زمان خطر ارائه محتوای قدیمی را به حداقل می‌رساند.

برای رسیدن به این هدف، service worker انگولار از دستورالعمل‌های زیر پیروی می‌کند:

- cache کردن application مانند نصب یک application بومی است.
  application به‌عنوان یک واحد cache می‌شود و همه فایل‌ها با هم به‌روزرسانی می‌شوند.

- application در حال اجرا با نسخه یکسانی از همه فایل‌ها به کار ادامه می‌دهد.
  دریافت ناگهانی فایل‌های cacheشده نسخه جدیدتر که احتمالاً ناسازگار هستند آغاز نمی‌شود.

- وقتی کاربران application را refresh می‌کنند، جدیدترین نسخه‌ای را می‌بینند که به‌طور کامل cache شده است.
  tabهای جدید، جدیدترین کد cacheشده را بارگذاری می‌کنند.

- به‌روزرسانی‌ها مدت کوتاهی پس از انتشار تغییرات و در پس‌زمینه انجام می‌شوند.
  تا زمان نصب و آماده شدن update، نسخه قبلی application ارائه می‌شود.

- service worker در صورت امکان پهنای باند را حفظ می‌کند.
  resourceها فقط در صورت تغییر دانلود می‌شوند.

برای پشتیبانی از این رفتارها، service worker انگولار فایل _manifest_ را از server بارگذاری می‌کند.
این فایل با نام `ngsw.json` \(با [web app manifest](https://developer.mozilla.org/docs/Web/Manifest) اشتباه نشود\)، resourceهای قابل cache را توصیف می‌کند و hash محتوای هر فایل را در بر دارد.
هنگام deploy شدن update مربوط به application، محتوای manifest تغییر می‌کند و به service worker اطلاع می‌دهد نسخه جدید application باید دانلود و cache شود.
این manifest از فایل پیکربندی تولیدشده توسط CLI با نام `ngsw-config.json` ساخته می‌شود.

نصب service worker انگولار به سادگی [اجرای یک فرمان Angular CLI](ecosystem/service-workers/getting-started#adding-a-service-worker-to-your-project) است.
این کار علاوه بر ثبت service worker انگولار در مرورگر، چند service قابل inject را نیز فراهم می‌کند که با service worker تعامل دارند و برای کنترل آن قابل استفاده‌اند.
برای نمونه، application می‌تواند بخواهد هنگام آماده شدن update جدید مطلع شود یا از service worker بخواهد updateهای موجود را در server بررسی کند.

## پیش از شروع

برای استفاده از همه قابلیت‌های service worker انگولار، جدیدترین نسخه‌های انگولار و [Angular CLI](tools/cli) را به کار ببرید.

برای ثبت service worker، application باید از طریق HTTPS و نه HTTP در دسترس باشد.
مرورگرها در صفحه‌هایی که از طریق اتصال ناامن ارائه می‌شوند service worker را نادیده می‌گیرند.
دلیل این است که service workerها قدرت زیادی دارند، بنابراین برای اطمینان از دست‌کاری نشدن script مربوط به service worker باید مراقبت بیشتری صورت گیرد.

این قانون یک استثنا دارد: برای ساده‌تر شدن توسعه محلی، مرورگرها هنگام دسترسی به application روی `localhost` به اتصال امن نیاز ندارند.

### پشتیبانی مرورگر

برای بهره‌گیری از service worker انگولار، application باید در مرورگری اجرا شود که به‌طور کلی از service worker پشتیبانی می‌کند.
در حال حاضر جدیدترین نسخه‌های Chrome، Firefox، Edge، Safari، Opera، ‏UC Browser \(نسخه Android\) و Samsung Internet از service worker پشتیبانی می‌کنند.
مرورگرهایی مانند IE و Opera Mini از service worker پشتیبانی نمی‌کنند.

اگر کاربر با مرورگری بدون پشتیبانی service worker به application دسترسی پیدا کند، service worker ثبت نمی‌شود و رفتارهای مرتبط مانند مدیریت cache در حالت offline و push notification رخ نمی‌دهند.
به‌طور مشخص:

- مرورگر script مربوط به service worker و فایل manifest به نام `ngsw.json` را دانلود نمی‌کند
- تلاش‌های مستقیم برای تعامل با service worker مانند فراخوانی `SwUpdate.checkForUpdate()`، promiseهای rejectشده برمی‌گردانند
- eventهای observable مربوط به serviceهای مرتبط مانند `SwUpdate.available` trigger نمی‌شوند

اکیداً توصیه می‌شود مطمئن شوید application حتی بدون پشتیبانی service worker در مرورگر نیز کار می‌کند.
اگرچه مرورگر ناسازگار caching مربوط به service worker را نادیده می‌گیرد، اگر application برای تعامل با service worker تلاش کند همچنان خطا گزارش می‌دهد.
برای نمونه، فراخوانی `SwUpdate.checkForUpdate()`، promiseهای rejectشده برمی‌گرداند.
برای جلوگیری از چنین خطایی، با `SwUpdate.isEnabled` بررسی کنید service worker انگولار فعال است یا خیر.

برای آگاهی از مرورگرهای بیشتری که برای service worker آماده هستند، صفحه [Can I Use](https://caniuse.com/#feat=serviceworkers) و [مستندات MDN](https://developer.mozilla.org/docs/Web/API/Service_Worker_API) را ببینید.

## منابع مرتبط

سایر مقاله‌های این بخش به‌طور ویژه پیاده‌سازی service worker در انگولار را بررسی می‌کنند.

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/config" title="فایل پیکربندی"/>
  <docs-pill href="ecosystem/service-workers/communications" title="ارتباط با Service Worker"/>
  <docs-pill href="ecosystem/service-workers/push-notifications" title="Push notificationها"/>
  <docs-pill href="ecosystem/service-workers/devops" title="DevOps مربوط به Service Worker"/>
  <docs-pill href="ecosystem/service-workers/app-shell" title="الگوی App shell"/>
</docs-pill-row>

برای اطلاعات عمومی بیشتر درباره service workerها، [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers) را ببینید.

برای اطلاعات بیشتر درباره پشتیبانی مرورگر، بخش [پشتیبانی مرورگر](https://developers.google.com/web/fundamentals/primers/service-workers/#browser_support) در [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers)، صفحه [Is Serviceworker ready?](https://jakearchibald.github.io/isserviceworkerready) نوشته Jake Archibald و [Can I Use](https://caniuse.com/serviceworkers) را ببینید.

برای پیشنهادها و نمونه‌های بیشتر، موارد زیر را ببینید:

<docs-pill-row>
  <docs-pill href="https://web.dev/precaching-with-the-angular-service-worker" title="Precaching با Angular Service Worker"/>
  <docs-pill href="https://web.dev/creating-pwa-with-angular-cli" title="ایجاد PWA با Angular CLI"/>
</docs-pill-row>

## مرحله بعد

برای شروع استفاده از service workerهای انگولار، [شروع کار با service workerها](ecosystem/service-workers/getting-started) را ببینید.
