# شروع کار با service workerها

این سند نحوه فعال کردن پشتیبانی service worker انگولار را در پروژه‌های ساخته‌شده با [Angular CLI](tools/cli) توضیح می‌دهد. سپس با یک نمونه، عملکرد service worker را در بارگذاری و caching اولیه نشان می‌دهد.

## افزودن service worker به پروژه

برای راه‌اندازی service worker انگولار در پروژه، فرمان CLI زیر را اجرا کنید:

```shell

ng add @angular/pwa

```

CLI با اقدامات زیر application را برای استفاده از service worker پیکربندی می‌کند:

1. package به نام `@angular/service-worker` را به پروژه اضافه می‌کند.
1. پشتیبانی build مربوط به service worker را در CLI فعال می‌کند.
1. service worker را با providerهای ریشه application، import و ثبت می‌کند.
1. فایل `index.html` را به‌روزرسانی می‌کند:
   - یک link برای افزودن فایل `manifest.webmanifest` قرار می‌دهد
   - meta tag مربوط به `theme-color` را اضافه می‌کند
1. فایل‌های icon لازم برای پشتیبانی از Progressive Web App \(PWA\) نصب‌شده را اضافه می‌کند.
1. فایل پیکربندی service worker به نام [`ngsw-config.json`](ecosystem/service-workers/config) را ایجاد می‌کند که رفتارهای caching و تنظیمات دیگر را مشخص می‌کند.

اکنون پروژه را build کنید:

```shell

ng build

```

پروژه CLI اکنون برای استفاده از service worker انگولار آماده است.

## عملکرد service worker: یک مرور عملی

این بخش با استفاده از یک application نمونه، عملکرد service worker را نشان می‌دهد.
برای فعال کردن پشتیبانی service worker هنگام توسعه محلی، پیکربندی production را با فرمان زیر به کار ببرید:

```shell

ng serve --configuration=production

```

همچنین می‌توانید از [`http-server package`](https://www.npmjs.com/package/http-server) در npm استفاده کنید که از applicationهای دارای service worker پشتیبانی می‌کند. آن را بدون نصب و با فرمان زیر اجرا کنید:

```shell

npx http-server -p 8080 -c-1 dist/<project-name>/browser

```

این فرمان application را با پشتیبانی service worker در http://localhost:8080 ارائه می‌کند.

### بارگذاری اولیه

در حالی که server روی port شماره `8080` در حال اجراست، مرورگر را به `http://localhost:8080` هدایت کنید.
application باید به‌طور عادی بارگذاری شود.

TIP: هنگام آزمایش service workerهای انگولار بهتر است از یک پنجره incognito یا private مرورگر استفاده کنید تا service worker وضعیت باقی‌مانده قبلی را نخواند؛ زیرا ممکن است رفتار غیرمنتظره‌ای ایجاد کند.

HELPFUL: اگر از HTTPS استفاده نمی‌کنید، service worker فقط هنگام دسترسی به application روی `localhost` ثبت می‌شود.

### شبیه‌سازی مشکل network

برای شبیه‌سازی مشکل network، تعامل application با network را غیرفعال کنید.

در Chrome:

1. از منوی Chrome در گوشه بالا سمت راست، **Tools** > **Developer Tools** را انتخاب کنید.
1. به **Network tab** بروید.
1. از منوی کشویی **Throttling** گزینه **Offline** را انتخاب کنید.

<img alt="گزینه offline در Network tab انتخاب شده است" src="assets/images/guide/service-worker/offline-option.png">

اکنون application به network دسترسی ندارد.

در applicationهایی که از service worker انگولار استفاده نمی‌کنند، refresh کردن صفحه در این مرحله صفحه قطع بودن اینترنت Chrome را با پیام «There is no Internet connection» نمایش می‌دهد.

با افزودن service worker انگولار، رفتار application تغییر می‌کند.
هنگام refresh، صفحه به‌طور عادی بارگذاری می‌شود.

برای تأیید فعال بودن service worker، Network tab را بررسی کنید.

<img alt="requestها با عبارت from ServiceWorker مشخص شده‌اند" src="assets/images/guide/service-worker/sw-active.png">

HELPFUL: در ستون «Size»، وضعیت requestها برابر `(ServiceWorker)` است.
یعنی resourceها از network بارگذاری نمی‌شوند.
در عوض، از cache مربوط به service worker بارگذاری می‌شوند.

### چه چیزهایی cache می‌شوند؟

توجه کنید همه فایل‌هایی که مرورگر برای render کردن این application نیاز دارد cache شده‌اند.
پیکربندی اولیه `ngsw-config.json` برای cache کردن resourceهای مشخص مورد استفاده CLI تنظیم شده است:

- `index.html`
- `favicon.ico`
- artifactهای build \(bundleهای JS و CSS\)
- هر چیزی در مسیر `assets`
- تصویرها و fontهایی که مستقیماً در `outputPath` پیکربندی‌شده \(به‌طور پیش‌فرض `./dist/<project-name>/`\) یا `resourcesOutputPath` قرار دارند.
  برای اطلاعات بیشتر درباره این گزینه‌ها، مستندات `ng build` را ببینید.

IMPORTANT: فایل تولیدشده `ngsw-config.json` فهرست محدودی از extensionهای قابل cache مربوط به font و تصویر دارد. در برخی موارد ممکن است لازم باشد glob pattern را متناسب با نیاز خود تغییر دهید.

IMPORTANT: اگر پس از تولید فایل پیکربندی، pathهای `resourcesOutputPath` یا `assets` تغییر کنند، باید pathها را در `ngsw-config.json` به‌صورت دستی تغییر دهید.

### ایجاد تغییر در application

اکنون که نحوه cache کردن application توسط service worker را دیده‌اید، مرحله بعد درک نحوه عملکرد updateها است.
در application تغییری ایجاد کنید و نصب update توسط service worker را ببینید:

1. اگر در پنجره incognito آزمایش می‌کنید، یک tab خالی دوم باز کنید.
   با این کار وضعیت incognito و cache هنگام آزمایش زنده می‌ماند.

1. tab مربوط به application را ببندید، اما پنجره را نبندید.
   با این کار Developer Tools نیز باید بسته شود.

1. `http-server` را متوقف کنید \(Ctrl-c\).
1. فایل `src/app/app.component.html` را برای ویرایش باز کنید.
1. متن `Welcome to {{title}}!` را به `Bienvenue أ  {{title}}!` تغییر دهید.
1. application را build و server را دوباره اجرا کنید:

```shell
    ng build
    npx http-server -p 8080 -c-1 dist/<project-name>/browser
```

### به‌روزرسانی application در مرورگر

اکنون ببینید مرورگر و service worker چگونه application به‌روزشده را مدیریت می‌کنند.

1. دوباره در همان پنجره [http://localhost:8080](http://localhost:8080) را باز کنید.
   چه اتفاقی می‌افتد؟

   <img alt="همچنان پیام Welcome to Service Workers! نمایش داده می‌شود" src="assets/images/guide/service-worker/welcome-msg-en.png">

   چه مشکلی رخ داده است؟
   _در واقع هیچ مشکلی!_
   service worker انگولار وظیفه خود را انجام می‌دهد و با وجود آماده بودن update، نسخه‌ای از application را ارائه می‌کند که **نصب کرده است**.
   service worker برای افزایش سرعت، پیش از ارائه application ذخیره‌شده در cache منتظر بررسی updateها نمی‌ماند.

   logهای `http-server` را بررسی کنید تا request مربوط به service worker برای `/ngsw.json` را ببینید.

   ```text
   [2023-09-07T00:37:24.372Z]  "GET /ngsw.json?ngsw-cache-bust=0.9365263935102124" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
   ```

   service worker به این شکل updateها را بررسی می‌کند.

1. صفحه را refresh کنید.

   <img alt="متن به Bienvenue أ  app! تغییر کرده است" src="assets/images/guide/service-worker/welcome-msg-fr.png">

   service worker نسخه به‌روزشده application را _در پس‌زمینه_ نصب کرده است و بار بعدی که صفحه بارگذاری یا reload شود، به جدیدترین نسخه جابه‌جا می‌شود.

## پیکربندی service worker

service workerهای انگولار از طریق interface به نام `SwRegistrationOptions` گزینه‌های پیکربندی جامعی فراهم می‌کنند که امکان کنترل دقیق رفتار ثبت، caching و اجرای script را می‌دهد.

### فعال و غیرفعال کردن service workerها

گزینه `enabled` تعیین می‌کند service worker ثبت شود و serviceهای مرتبط برای ارتباط با آن تلاش کنند یا خیر.

```ts
import {ApplicationConfig, isDevMode} from '@angular/core';
import {provideServiceWorker} from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(), // Disable in development, enable in production
    }),
  ],
};
```

### کنترل cache با updateViaCache

گزینه `updateViaCache` نحوه مراجعه مرورگر به cache مربوط به HTTP هنگام update کردن service worker را کنترل می‌کند. این گزینه کنترل دقیقی بر زمان دریافت scriptهای به‌روزشده service worker و moduleهای importشده توسط مرورگر فراهم می‌کند.

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      updateViaCache: 'imports',
    }),
  ],
};
```

گزینه `updateViaCache` مقادیر زیر را می‌پذیرد:

- **`'imports'`** - برای scriptهای importشده توسط script مربوط به service worker به cache مربوط به HTTP مراجعه می‌شود، اما برای خود script مربوط به service worker خیر
- **`'all'`** - هم برای script مربوط به service worker و هم scriptهای importشده آن به cache مربوط به HTTP مراجعه می‌شود
- **`'none'`** - برای script مربوط به service worker یا scriptهای importشده آن به cache مربوط به HTTP مراجعه نمی‌شود

### پشتیبانی از ES Module با گزینه type

گزینه `type` اجازه می‌دهد هنگام ثبت service worker نوع script را تعیین کنید و از قابلیت‌های ES module در scriptهای service worker بهره ببرید.

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      type: 'module', // Enable ES module features
    }),
  ],
};
```

گزینه `type` مقادیر زیر را می‌پذیرد:

- **`'classic'`** \(پیش‌فرض\) - اجرای سنتی script مربوط به service worker. قابلیت‌های ES module مانند `import` و `export` در script مجاز نیستند
- **`'module'`** - script را به‌عنوان ES module ثبت می‌کند. استفاده از syntax مربوط به `import`/`export` و قابلیت‌های module را ممکن می‌سازد

### کنترل scope مربوط به ثبت

گزینه `scope`، scope مربوط به ثبت service worker و بازه URLهایی را تعیین می‌کند که service worker قادر به کنترل آن‌ها است.

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      scope: '/app/', // Service worker will only control URLs under /app/
    }),
  ],
};
```

- تعیین می‌کند service worker کدام URLها را می‌تواند رهگیری و مدیریت کند
- به‌طور پیش‌فرض، scope همان دایرکتوری حاوی script مربوط به service worker است
- هنگام فراخوانی `ServiceWorkerContainer.register()` استفاده می‌شود

### پیکربندی راهبرد ثبت

گزینه `registrationStrategy` زمان ثبت service worker در مرورگر را تعریف و امکان کنترل زمان‌بندی ثبت را فراهم می‌کند.

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
```

راهبردهای ثبت موجود:

- **`'registerWhenStable:timeout'`** \(پیش‌فرض: `'registerWhenStable:30000'`\) - به‌محض پایدار شدن application \(نبود micro-task یا macro-task در انتظار\)، اما نه دیرتر از timeout تعیین‌شده بر حسب millisecond، ثبت می‌شود
- **`'registerImmediately'`** - service worker را بلافاصله ثبت می‌کند
- **`'registerWithDelay:timeout'`** - service worker را با تأخیر timeout تعیین‌شده بر حسب millisecond ثبت می‌کند

```ts
// Register immediately
export const immediateConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately',
    }),
  ],
};

// Register with a 5-second delay
export const delayedConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWithDelay:5000',
    }),
  ],
};
```

برای زمان‌بندی سفارشی ثبت، می‌توانید تابع factory مربوط به Observable نیز ارائه کنید:

```ts
import {timer} from 'rxjs';

export const customConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: () => timer(10_000), // Register after 10 seconds
    }),
  ],
};
```

## اطلاعات بیشتر درباره service workerهای انگولار

ممکن است موارد زیر نیز برایتان مفید باشند:

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/config" title="فایل پیکربندی"/>
  <docs-pill href="ecosystem/service-workers/communications" title="ارتباط با Service Worker"/>
  <docs-pill href="ecosystem/service-workers/push-notifications" title="Push notificationها"/>
  <docs-pill href="ecosystem/service-workers/devops" title="DevOps مربوط به Service Worker"/>
  <docs-pill href="ecosystem/service-workers/app-shell" title="الگوی App shell"/>
</docs-pill-row>
