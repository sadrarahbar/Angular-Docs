# ارتباط با Service Worker

فعال کردن پشتیبانی service worker فقط آن را ثبت نمی‌کند؛ بلکه serviceهایی نیز در اختیارتان قرار می‌دهد که برای تعامل با service worker و کنترل cache برنامه قابل استفاده‌اند.

## service به نام `SwUpdate`

service به نام `SwUpdate` امکان دسترسی به رویدادهایی را فراهم می‌کند که زمان یافتن و نصب یک به‌روزرسانی موجود برای برنامه توسط service worker را نشان می‌دهند.

service به نام `SwUpdate` از سه عملیات جداگانه پشتیبانی می‌کند:

- دریافت اعلان هنگامی که نسخه به‌روزشده روی server _شناسایی_ شده، _نصب و آماده_ استفاده محلی است یا _نصب آن شکست خورده_ است.
- درخواست از service worker برای بررسی به‌روزرسانی‌های جدید روی server.
- درخواست از service worker برای فعال کردن آخرین نسخه برنامه در tab فعلی.

### به‌روزرسانی نسخه

`versionUpdates` یک ویژگی `Observable` در `SwUpdate` است و پنج نوع رویداد emit می‌کند:

| نوع رویداد | جزئیات |
| :--- | :--- |
| `VersionDetectedEvent` | هنگامی emit می‌شود که service worker نسخه جدیدی از برنامه را روی server یافته و در آستانه دانلود آن است. |
| `NoNewVersionDetectedEvent` | هنگامی emit می‌شود که service worker نسخه برنامه را روی server بررسی کرده، اما نسخه جدیدی نیافته است. |
| `VersionReadyEvent` | هنگامی emit می‌شود که نسخه جدید برنامه برای فعال‌سازی توسط clientها آماده است. می‌توان از آن برای آگاه کردن کاربر از به‌روزرسانی موجود یا درخواست refresh صفحه استفاده کرد. |
| `VersionInstallationFailedEvent` | هنگامی emit می‌شود که نصب نسخه جدید شکست خورده است. می‌توان از آن برای logging/monitoring استفاده کرد. |
| `VersionFailedEvent` | هنگامی emit می‌شود که یک نسخه با خرابی بحرانی \(مانند خطای hash خراب\) روبه‌رو شده که همه clientهای استفاده‌کننده از آن نسخه را تحت تأثیر قرار می‌دهد. برای debugging و شفافیت، جزئیات خطا را ارائه می‌کند. |

<docs-code header="log-update.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/log-update.service.ts" region="sw-update"/>

### بررسی به‌روزرسانی‌ها

می‌توان از service worker خواست بررسی کند آیا به‌روزرسانی‌ای روی server مستقر شده است یا خیر.
service worker هنگام مقداردهی اولیه و در هر درخواست پیمایش — یعنی وقتی کاربر از نشانی دیگری وارد برنامه می‌شود — به‌روزرسانی‌ها را بررسی می‌کند.
با این حال، اگر سایتی دارید که مرتب تغییر می‌کند یا می‌خواهید به‌روزرسانی‌ها طبق زمان‌بندی انجام شوند، می‌توانید آن‌ها را به‌صورت دستی بررسی کنید.

این کار را با متد `checkForUpdate()` انجام دهید:

<docs-code header="check-for-update.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/check-for-update.service.ts"/>

این متد یک `Promise<boolean>` برمی‌گرداند که آماده بودن به‌روزرسانی برای فعال‌سازی را نشان می‌دهد.
ممکن است بررسی شکست بخورد و باعث reject شدن `Promise` شود.

<docs-callout important title="پایدار شدن و ثبت service worker">
برای جلوگیری از تأثیر منفی بر render اولیه صفحه، service مربوط به service worker در Angular به‌طور پیش‌فرض پیش از ثبت اسکریپت ServiceWorker حداکثر 30 ثانیه منتظر پایدار شدن برنامه می‌ماند.

poll کردن مداوم برای به‌روزرسانی‌ها، برای نمونه با [setInterval()](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) یا [interval()](https://rxjs.dev/api/index/function/interval) در RxJS، مانع پایدار شدن برنامه می‌شود و اسکریپت ServiceWorker تا رسیدن به سقف 30 ثانیه در مرورگر ثبت نمی‌شود.

این موضوع درباره هر نوع polling انجام‌شده توسط برنامه صادق است.
برای اطلاعات بیشتر مستندات [isStable](api/core/ApplicationRef#isStable) را ببینید.

برای جلوگیری از این تأخیر، مانند نمونه قبلی ابتدا منتظر پایدار شدن برنامه بمانید و سپس polling برای به‌روزرسانی را آغاز کنید.
همچنین می‌توانید [راهبرد ثبت](api/service-worker/SwRegistrationOptions#registrationStrategy) متفاوتی برای ServiceWorker تعریف کنید.
</docs-callout>

### به‌روزرسانی به آخرین نسخه

می‌توانید به‌محض آماده شدن نسخه جدید، با reload کردن صفحه tab موجود را به آخرین نسخه به‌روزرسانی کنید.
برای مختل نشدن کار کاربر، معمولاً بهتر است از او درخواست کنید تأیید کند که reload صفحه و به‌روزرسانی به آخرین نسخه مشکلی ندارد:

<docs-code header="prompt-update.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/prompt-update.service.ts" region="sw-version-ready"/>

<docs-callout important title="ایمنی به‌روزرسانی بدون reload">
فراخوانی `activateUpdate()` بدون reload صفحه، tab را به آخرین نسخه به‌روزرسانی می‌کند؛ اما ممکن است برنامه را دچار مشکل کند.

به‌روزرسانی بدون reload می‌تواند میان application shell و سایر منابع صفحه مانند chunkهای lazy-loaded، که ممکن است نام فایلشان بین نسخه‌ها تغییر کند، ناسازگاری نسخه ایجاد کند.

تنها وقتی از `activateUpdate()` استفاده کنید که از ایمن بودن آن برای مورد استفاده مشخص خود مطمئن هستید.
</docs-callout>

### مدیریت وضعیت غیرقابل‌بازیابی

گاهی ممکن است نسخه‌ای از برنامه که service worker برای ارائه به client استفاده می‌کند، در وضعیتی خراب قرار بگیرد که بدون reload کامل صفحه قابل‌بازیابی نباشد.

برای نمونه، سناریوی زیر را در نظر بگیرید:

1. کاربر برای نخستین بار برنامه را باز می‌کند و service worker آخرین نسخه برنامه را cache می‌کند.
   فرض کنید assetهای cacheشده برنامه شامل `index.html`،‏ `main.<main-hash-1>.js` و `lazy-chunk.<lazy-hash-1>.js` باشند.

1. کاربر برنامه را می‌بندد و مدتی آن را باز نمی‌کند.
1. پس از مدتی، نسخه جدیدی از برنامه روی server مستقر می‌شود.
   این نسخه جدیدتر فایل‌های `index.html`،‏ `main.<main-hash-2>.js` و `lazy-chunk.<lazy-hash-2>.js` را در بر دارد.

IMPORTANT: اکنون hashها متفاوت‌اند، زیرا محتوای فایل‌ها تغییر کرده است. نسخه قدیمی دیگر روی server موجود نیست.

1. در این فاصله، مرورگر کاربر تصمیم می‌گیرد `lazy-chunk.<lazy-hash-1>.js` را از cache خود حذف کند.
   مرورگرها ممکن است برای آزاد کردن فضای دیسک، منابع مشخص یا همه منابع را از cache حذف کنند.

1. کاربر دوباره برنامه را باز می‌کند.
   service worker جدیدترین نسخه‌ای را که در این لحظه می‌شناسد، یعنی نسخه قدیمی \(`index.html` و `main.<main-hash-1>.js`\)، ارائه می‌دهد.

1. مدتی بعد، برنامه bundle از نوع lazy یعنی `lazy-chunk.<lazy-hash-1>.js` را درخواست می‌کند.
1. service worker نمی‌تواند asset را در cache پیدا کند \(به یاد داشته باشید مرورگر آن را حذف کرده است\).
   همچنین نمی‌تواند آن را از server دریافت کند \(زیرا server اکنون فقط `lazy-chunk.<lazy-hash-2>.js` متعلق به نسخه جدیدتر را دارد\).

در سناریوی بالا، service worker نمی‌تواند assetی را ارائه کند که معمولاً باید cache شده باشد.
آن نسخه مشخص برنامه خراب است و بدون reload صفحه راهی برای اصلاح وضعیت client وجود ندارد.
در چنین مواردی، service worker با ارسال رویداد `UnrecoverableStateEvent` به client اطلاع می‌دهد.
برای دریافت اعلان و مدیریت این خطاها در `SwUpdate#unrecoverable` مشترک شوید.

<docs-code header="handle-unrecoverable-state.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/handle-unrecoverable-state.service.ts" region="sw-unrecoverable-state"/>

## مطالب بیشتر درباره service workerهای Angular

ممکن است مطالب زیر نیز برایتان مفید باشند:

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/push-notifications" title="Push notificationها"/>
  <docs-pill href="ecosystem/service-workers/devops" title="DevOps مربوط به Service Worker"/>
</docs-pill-row>
