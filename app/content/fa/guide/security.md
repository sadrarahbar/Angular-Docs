# امنیت

این مبحث محافظت‌های داخلی Angular در برابر آسیب‌پذیری‌ها و حملات رایج برنامه‌های وب، مانند cross-site scripting را توضیح می‌دهد.
امنیت سطح برنامه مانند authentication و authorization در این مطلب بررسی نمی‌شود.

برای اطلاعات بیشتر درباره حملات و روش‌های کاهش خطر در ادامه، [راهنمای Open Web Application Security Project ‏(OWASP)](https://www.owasp.org/index.php/Category:OWASP_Guide_Project) را ببینید.

<a id="report-issues"></a>

<docs-callout title="گزارش آسیب‌پذیری‌ها">

Angular بخشی از [برنامه پاداش آسیب‌پذیری نرم‌افزارهای متن‌باز](https://bughunters.google.com/about/rules/6521337925468160/google-open-source-software-vulnerability-reward-program-rules) گوگل است. برای آسیب‌پذیری‌های Angular، گزارش خود را در [https://bughunters.google.com](https://bughunters.google.com/report) ثبت کنید.

برای اطلاعات بیشتر درباره نحوه رسیدگی Google به مسائل امنیتی، [نگرش امنیتی Google](https://www.google.com/about/appsecurity) را ببینید.

</docs-callout>

## بهترین شیوه‌ها

برای اطمینان از امنیت برنامه Angular خود، این شیوه‌ها را رعایت کنید.

1. **همواره از جدیدترین نسخه کتابخانه‌های Angular استفاده کنید** — کتابخانه‌های Angular مرتب به‌روزرسانی می‌شوند و این به‌روزرسانی‌ها ممکن است نقص‌های امنیتی نسخه‌های قبلی را رفع کنند. برای به‌روزرسانی‌های امنیتی، [change log](https://github.com/angular/angular/blob/main/CHANGELOG.md) در Angular را بررسی کنید.
2. **نسخه Angular خود را تغییر ندهید** — نسخه‌های خصوصی و سفارشی Angular معمولاً از نسخه جاری عقب می‌مانند و ممکن است اصلاحات و بهبودهای امنیتی مهم را نداشته باشند. به‌جای آن، بهبودهای خود را با جامعه Angular به اشتراک بگذارید و pull request ایجاد کنید.
3. **از APIهایی که در مستندات Angular با "_Security Risk_" مشخص شده‌اند دوری کنید** — برای اطلاعات بیشتر، بخش [اعتماد به مقادیر امن](#trusting-safe-values) همین صفحه را ببینید.

## جلوگیری از cross-site scripting ‏(XSS)

[Cross-site scripting ‏(XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) به مهاجم اجازه می‌دهد کد مخرب را در صفحات وب تزریق کند.
چنین کدی می‌تواند داده‌های کاربر و ورود او را سرقت کند یا عملی را با جعل هویت کاربر انجام دهد.
این یکی از رایج‌ترین حملات وب است.

برای مسدودکردن حملات XSS باید مانع ورود کد مخرب به Document Object Model ‏(DOM) شوید.
برای مثال، اگر مهاجم بتواند شما را وادار کند یک تگ `<script>` در DOM درج کنید، می‌تواند کد دلخواه را در وب‌سایت شما اجرا کند.
حمله به تگ `<script>` محدود نیست؛ بسیاری از elementها و propertyهای DOM مانند `<img alt="" onerror="...">` و `<a href="javascript:...">` امکان اجرای کد دارند.
اگر داده تحت کنترل مهاجم وارد DOM شود، باید انتظار آسیب‌پذیری امنیتی داشته باشید.

### مدل امنیتی Angular برای cross-site scripting

Angular برای جلوگیری نظام‌مند از نقص‌های XSS، همه مقادیر را به‌طور پیش‌فرض غیرقابل‌اعتماد در نظر می‌گیرد.
وقتی مقداری از طریق template binding یا interpolation در DOM درج شود، Angular مقادیر غیرقابل‌اعتماد را sanitize و escape می‌کند.
اگر مقداری بیرون از Angular sanitize شده و امن تلقی می‌شود، با علامت‌گذاری [مقدار به‌عنوان قابل‌اعتماد](#trusting-safe-values) این موضوع را به Angular اعلام کنید.

برخلاف مقادیر مورد استفاده برای render،‏ templateهای Angular به‌طور پیش‌فرض قابل‌اعتماد و در حکم کد اجرایی هستند.
هرگز با به‌هم‌چسباندن ورودی کاربر و syntax مربوط به template،‏ template نسازید.
این کار به مهاجم اجازه [تزریق کد دلخواه](https://en.wikipedia.org/wiki/Code_injection) در برنامه را می‌دهد.
برای جلوگیری از این آسیب‌پذیری‌ها، در deploymentهای production همیشه از [template compiler پیش‌فرض Ahead-Of-Time ‏(AOT)](#use-the-aot-template-compiler) استفاده کنید.

Content Security Policy و Trusted Types می‌توانند لایه محافظتی دیگری فراهم کنند.
این قابلیت‌های platform وب در سطح DOM عمل می‌کنند که مؤثرترین محل جلوگیری از XSS است و APIهای سطح پایین‌تر نمی‌توانند آن‌ها را دور بزنند.
بنابراین استفاده از آن‌ها قویاً توصیه می‌شود. برای این کار [content security policy](#content-security-policy) برنامه را پیکربندی و [اجرای trusted types](#enforcing-trusted-types) را فعال کنید.

### sanitization و contextهای امنیتی

_Sanitization_ یعنی بررسی یک مقدار غیرقابل‌اعتماد و تبدیل آن به مقداری که درج آن در DOM امن است.
در بسیاری موارد sanitization مقدار را تغییر نمی‌دهد.
sanitization به context وابسته است.
برای مثال، مقداری بی‌خطر در CSS ممکن است در URL خطرناک باشد.

Angular contextهای امنیتی زیر را تعریف می‌کند:

| contextهای امنیتی | جزئیات                                                                                     |
| :---------------- | :----------------------------------------------------------------------------------------- |
| HTML              | هنگام تفسیر مقدار به‌عنوان HTML، برای مثال binding به `innerHtml`، استفاده می‌شود.         |
| Style             | هنگام binding کردن CSS به property مربوط به `style` استفاده می‌شود.                       |
| URL               | برای propertyهای URL مانند `<a href>` استفاده می‌شود.                                     |
| Resource URL      | URLای که به‌عنوان کد بارگذاری و اجرا می‌شود؛ برای مثال در `<script src>`.                  |

Angular مقادیر غیرقابل‌اعتماد HTML و URL را sanitize می‌کند. sanitize کردن resource URL ممکن نیست، زیرا حاوی کد دلخواه است.
در development mode، وقتی Angular ناچار باشد مقداری را هنگام sanitization تغییر دهد، در console هشدار می‌دهد.

### مثال sanitization

template زیر مقدار `htmlSnippet` را یک بار با interpolation در محتوای element و یک بار با binding به property مربوط به `innerHTML` متصل می‌کند:

<docs-code header="inner-html-binding.component.html" path="adev/src/content/examples/security/src/app/inner-html-binding.component.html"/>

محتوای interpolateشده همیشه escape می‌شود؛ HTML تفسیر نمی‌شود و مرورگر براکت‌های زاویه‌ای را در محتوای متنی element نمایش می‌دهد.

برای تفسیر HTML، مقدار را به propertyای در HTML مانند `innerHTML` متصل کنید.
توجه کنید binding کردن مقداری که ممکن است تحت کنترل مهاجم باشد به `innerHTML` معمولاً آسیب‌پذیری XSS ایجاد می‌کند.
برای مثال می‌توان JavaScript را به شکل زیر اجرا کرد:

<docs-code header="inner-html-binding.component.ts (class)" path="adev/src/content/examples/security/src/app/inner-html-binding.component.ts" region="class"/>

Angular مقدار را ناامن تشخیص داده و خودکار sanitize می‌کند؛ element مربوط به `script` حذف و محتوای امن مانند element مربوط به `<b>` حفظ می‌شود.

<img alt="تصویری از مقادیر HTML متصل‌شده و interpolateشده" src="assets/images/guide/security/binding-inner-html.png#small">

### استفاده مستقیم از APIهای DOM و فراخوانی صریح sanitization

تا زمانی که Trusted Types را enforce نکنید، APIهای داخلی DOM مرورگر به‌طور خودکار از شما در برابر آسیب‌پذیری‌های امنیتی محافظت نمی‌کنند.
برای مثال، `document`،‏ node قابل‌دسترسی از طریق `ElementRef` و بسیاری از APIهای شخص ثالث methodهای ناامن دارند.
همچنین هنگام کار با کتابخانه‌های دیگری که DOM را دست‌کاری می‌کنند، احتمالاً sanitization خودکار مشابه interpolationهای Angular را نخواهید داشت.
تا حد امکان از تعامل مستقیم با DOM خودداری و از templateهای Angular استفاده کنید.

در موارد اجتناب‌ناپذیر، از توابع داخلی sanitization در Angular استفاده کنید.
مقادیر غیرقابل‌اعتماد را با method مربوط به [DomSanitizer.sanitize](api/platform-browser/DomSanitizer#sanitize) و `SecurityContext` مناسب sanitize کنید.
این تابع مقادیری را که با توابع `bypassSecurityTrust` قابل‌اعتماد علامت خورده‌اند نیز می‌پذیرد و همان‌طور که [در ادامه](#trusting-safe-values) توضیح داده شده، آن‌ها را sanitize نمی‌کند.

### اعتماد به مقادیر امن

گاهی برنامه واقعاً باید کد اجرایی داشته باشد، یک `<iframe>` را از URL مشخصی نمایش دهد یا URL بالقوه خطرناکی بسازد.
برای جلوگیری از sanitization خودکار در این شرایط، به Angular اعلام کنید که مقدار را بررسی کرده‌اید، از نحوه ساخت آن آگاهید و از امنیت آن مطمئن هستید.
_بسیار محتاط باشید_.
اعتماد به مقداری که ممکن است مخرب باشد، یک آسیب‌پذیری امنیتی وارد برنامه می‌کند.
در صورت تردید از متخصص امنیت بخواهید آن را بررسی کند.

برای علامت‌گذاری یک مقدار به‌عنوان قابل‌اعتماد، `DomSanitizer` را inject و یکی از methodهای زیر را فراخوانی کنید:

- `bypassSecurityTrustHtml`
- `bypassSecurityTrustScript`
- `bypassSecurityTrustStyle`
- `bypassSecurityTrustUrl`
- `bypassSecurityTrustResourceUrl`

به یاد داشته باشید امن‌بودن مقدار به context وابسته است؛ بنابراین context درست را متناسب با کاربرد موردنظر انتخاب کنید.
فرض کنید template زیر باید URLای را به فراخوانی `javascript:alert(...)` متصل کند:

<docs-code header="bypass-security.component.html (URL)" path="adev/src/content/examples/security/src/app/bypass-security.component.html" region="URL"/>

Angular در حالت عادی URL را خودکار sanitize می‌کند، کد خطرناک را غیرفعال می‌سازد و در development mode این عمل را در console ثبت می‌کند.
برای جلوگیری از این رفتار، با فراخوانی `bypassSecurityTrustUrl` مقدار URL را قابل‌اعتماد علامت‌گذاری کنید:

<docs-code header="bypass-security.component.ts (trust-url)" path="adev/src/content/examples/security/src/app/bypass-security.component.ts" region="trust-url"/>

<img alt="تصویری از کادر alert ساخته‌شده از URL قابل‌اعتماد" src="assets/images/guide/security/bypass-security-component.png#medium">

اگر لازم است ورودی کاربر را به مقدار قابل‌اعتماد تبدیل کنید، از method مربوط به component استفاده کنید.
template زیر به کاربران امکان می‌دهد شناسه یک ویدئوی YouTube را وارد و ویدئوی متناظر را در `<iframe>` بارگذاری کنند.
attribute مربوط به `<iframe src>` یک context امنیتی Resource URL است، زیرا منبع غیرقابل‌اعتماد می‌تواند برای مثال فایل‌هایی را مخفیانه دانلود کند که کاربران ناآگاه اجرا می‌کنند.
برای جلوگیری از این وضعیت، methodای روی component فراخوانی کنید تا URL قابل‌اعتماد ویدئو را بسازد؛ در نتیجه Angular اجازه binding به `<iframe src>` را می‌دهد:

<docs-code header="bypass-security.component.html (iframe)" path="adev/src/content/examples/security/src/app/bypass-security.component.html" region="iframe"/>

<docs-code header="bypass-security.component.ts (trust-video-url)" path="adev/src/content/examples/security/src/app/bypass-security.component.ts" region="trust-video-url"/>

### Content security policy

Content Security Policy ‏(CSP) یک تکنیک defense-in-depth برای جلوگیری از XSS است.
برای فعال‌کردن CSP،‏ web server را طوری پیکربندی کنید که header مناسب `Content-Security-Policy` در HTTP را برگرداند.
در [راهنمای Web Fundamentals](https://developers.google.com/web/fundamentals/security/csp) در وب‌سایت Google Developers درباره content security policy بیشتر بخوانید.

حداقل policy لازم برای یک برنامه جدید Angular عبارت است از:

```txt
default-src 'self'; style-src 'self' 'nonce-randomNonceGoesHere'; script-src 'self' 'nonce-randomNonceGoesHere';
```

هنگام ارائه برنامه Angular،‏ server باید برای هر request یک nonce تصادفی در HTTP header قرار دهد.
باید این nonce را در اختیار Angular بگذارید تا framework بتواند elementهای `<style>` را render کند.
nonce را می‌توانید به یکی از روش‌های زیر برای Angular تنظیم کنید:

1. گزینه `autoCsp` را در [پیکربندی workspace](reference/configs/workspace-config#extra-build-and-test-options) روی `true` قرار دهید.
1. attribute مربوط به `ngCspNonce` را به‌شکل `<app ngCspNonce="randomNonceGoesHere"></app>` روی element ریشه برنامه تنظیم کنید. اگر به templating سمت server دسترسی دارید و هنگام ساخت response می‌توانید nonce را هم به header و هم `index.html` اضافه کنید، از این روش استفاده کنید.
1. nonce را با injection token مربوط به `CSP_NONCE` ارائه دهید. اگر هنگام runtime به nonce دسترسی دارید و می‌خواهید `index.html` قابل cache باشد، این روش را به‌کار ببرید.

```ts
import {bootstrapApplication, CSP_NONCE} from '@angular/core';
import {AppComponent} from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: CSP_NONCE,
      useValue: globalThis.myRandomNonceValue,
    },
  ],
});
```

<docs-callout title="nonceهای یکتا">

همیشه مطمئن شوید nonceهای ارائه‌شده <strong>برای هر request یکتا</strong> و غیرقابل‌پیش‌بینی یا حدس هستند.
اگر مهاجم بتواند nonceهای آینده را پیش‌بینی کند، می‌تواند محافظت CSP را دور بزند.

هنگام استفاده از CDN، تولید nonce در origin server معمولاً توصیه نمی‌شود، زیرا responseها اغلب cache می‌شوند. اگر server یک nonce تولید و CDN آن response مربوط به HTML را cache کند، تمام بازدیدکنندگان بعدی همان مقدار «یکتا» را دریافت می‌کنند و مهاجم می‌تواند مقدار ثابت را کشف کرده و CSP را دور بزند.

برای حفظ یک‌بارمصرف‌بودن nonce، بهتر است درست پیش از تحویل محتوا به کاربر در لایه Edge (برای مثال CDN) تولید شود.

</docs-callout>

NOTE: اگر می‌خواهید [CSS حیاتی برنامه را inline کنید](/tools/cli/build#critical-css-inlining)، نمی‌توانید از token مربوط به `CSP_NONCE` استفاده کنید و باید گزینه `autoCsp` را ترجیح دهید یا attribute مربوط به `ngCspNonce` را روی element ریشه برنامه تنظیم کنید.

اگر در پروژه امکان تولید nonce ندارید، با افزودن `'unsafe-inline'` به بخش `style-src` در header مربوط به CSP می‌توانید styleهای inline را مجاز کنید.

| بخش‌ها                                           | جزئیات                                                                                                                                                                                                                    |
| :----------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `default-src 'self';`                            | اجازه می‌دهد صفحه تمام resourceهای لازم را از همان origin بارگذاری کند.                                                                                                                                                  |
| `style-src 'self' 'nonce-randomNonceGoesHere';`  | اجازه می‌دهد صفحه styleهای سراسری را از همان origin ‏(یعنی `'self'`) و styleهای درج‌شده توسط Angular را با `nonce-randomNonceGoesHere` بارگذاری کند.                                                                      |
| `script-src 'self' 'nonce-randomNonceGoesHere';` | اجازه می‌دهد صفحه JavaScript را از همان origin ‏(یعنی `'self'`) و scriptهای درج‌شده توسط Angular CLI را با `nonce-randomNonceGoesHere` بارگذاری کند. فقط هنگام استفاده از inline کردن CSS حیاتی لازم است.                  |

خود Angular فقط برای عملکرد درست به همین تنظیمات نیاز دارد.
با رشد پروژه ممکن است لازم باشد تنظیمات CSP را برای قابلیت‌های اضافی مخصوص برنامه گسترش دهید.

### enforce کردن Trusted Types

توصیه می‌شود از [Trusted Types](https://w3c.github.io/trusted-types/dist/spec/) برای کمک به ایمن‌سازی برنامه در برابر حملات cross-site scripting استفاده کنید.
Trusted Types قابلیتی در [platform وب](https://en.wikipedia.org/wiki/Web_platform) است که با enforce کردن شیوه‌های کدنویسی امن‌تر به جلوگیری از حملات cross-site scripting کمک می‌کند.
Trusted Types همچنین می‌تواند audit کردن کد برنامه را ساده‌تر کند.

<docs-callout title="Trusted Types">

ممکن است Trusted Types هنوز در تمام مرورگرهای هدف برنامه موجود نباشد.
اگر برنامه دارای Trusted Types در مرورگری اجرا شود که از آن پشتیبانی نمی‌کند، قابلیت‌های برنامه حفظ می‌شوند و DomSanitizer در Angular از برنامه در برابر XSS محافظت می‌کند.
برای پشتیبانی فعلی مرورگرها، [caniuse.com/trusted-types](https://caniuse.com/trusted-types) را ببینید.

</docs-callout>

برای enforce کردن Trusted Types باید web server برنامه را طوری پیکربندی کنید که HTTP headerها را با یکی از policyهای Angular زیر منتشر کند:

| policyها                | جزئیات                                                                                                                                                                                                                                                                                           |
| :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `angular`               | در کد داخلی Angular که از نظر امنیت بررسی شده استفاده می‌شود و برای عملکرد Angular هنگام enforce شدن Trusted Types الزامی است. این policy تمام مقادیر inline در template یا محتوای sanitizeشده توسط Angular را امن می‌داند.                                                                   |
| `angular#bundler`       | Angular CLI bundler هنگام ساخت فایل‌های lazy chunk از آن استفاده می‌کند.                                                                                                                                                                                                                        |
| `angular#unsafe-bypass` | برنامه‌هایی که از methodهای دورزننده امنیت در [DomSanitizer](api/platform-browser/DomSanitizer)، مانند `bypassSecurityTrustHtml`، استفاده می‌کنند به این policy نیاز دارند. هر برنامه استفاده‌کننده از این methodها باید آن را فعال کند.                                                      |
| `angular#unsafe-jit`    | [compiler مربوط به Just-In-Time ‏(JIT)](api/core/Compiler) از آن استفاده می‌کند. اگر برنامه مستقیماً با JIT compiler تعامل دارد یا با [platform browser dynamic](api/platform-browser-dynamic/platformBrowserDynamic) در JIT mode اجرا می‌شود، باید این policy را فعال کنید.                    |
| `angular#unsafe-upgrade`| بسته [@angular/upgrade](api/upgrade/static/UpgradeModule) از آن استفاده می‌کند. اگر برنامه hybrid با AngularJS است باید این policy را فعال کنید.                                                                                                                                                  |

HTTP headerهای Trusted Types را باید در محل‌های زیر پیکربندی کنید:

- زیرساخت ارائه production
- Angular CLI ‏(`ng serve`) با property مربوط به `headers` در فایل `angular.json` برای توسعه محلی و تست end-to-end
- Karma ‏(`ng test`) با property مربوط به `customHeaders` در فایل `karma.config.js` برای unit test

نمونه header پیکربندی‌شده مخصوص Trusted Types و Angular:

```html
Content-Security-Policy: trusted-types angular; require-trusted-types-for 'script';
```

نمونه header مخصوص Trusted Types و برنامه Angular که از methodهای دورزننده امنیت در [DomSanitizer](api/platform-browser/DomSanitizer) استفاده می‌کند:

```html
Content-Security-Policy: trusted-types angular angular#unsafe-bypass; require-trusted-types-for
'script';
```

نمونه header مخصوص Trusted Types و برنامه Angular دارای JIT:

```html
Content-Security-Policy: trusted-types angular angular#unsafe-jit; require-trusted-types-for
'script';
```

نمونه header مخصوص Trusted Types و برنامه Angular دارای lazy loading برای moduleها:

```html
Content-Security-Policy: trusted-types angular angular#bundler; require-trusted-types-for 'script';
```

<docs-callout title="مشارکت‌های جامعه">

برای اطلاعات بیشتر درباره عیب‌یابی پیکربندی Trusted Types، منبع زیر مفید است:

[جلوگیری از آسیب‌پذیری cross-site scripting مبتنی بر DOM با Trusted Types](https://web.dev/trusted-types/#how-to-use-trusted-types)

</docs-callout>
### استفاده از template compiler مربوط به AOT

template compiler مربوط به AOT از مجموعه‌ای کامل از آسیب‌پذیری‌های معروف به template injection جلوگیری می‌کند و عملکرد برنامه را بسیار بهبود می‌دهد.
template compiler مربوط به AOT،‏ compiler پیش‌فرض برنامه‌های Angular CLI است و باید در تمام deploymentهای production از آن استفاده کنید.

گزینه جایگزین AOT compiler،‏ JIT compiler است که هنگام runtime در مرورگر templateها را به کد اجرایی template کامپایل می‌کند.
Angular به کد template اعتماد دارد؛ بنابراین ساخت پویای templateها و کامپایل آن‌ها، به‌ویژه templateهای دارای داده کاربر، محافظت‌های داخلی Angular را دور می‌زند. این یک anti-pattern امنیتی است.
برای اطلاعات درباره ساخت امن formهای پویا، راهنمای [Dynamic Forms](guide/forms/dynamic-forms) را ببینید.

### محافظت سمت server در برابر XSS

HTML ساخته‌شده روی server در برابر حملات injection آسیب‌پذیر است.
تزریق کد template به برنامه Angular معادل تزریق کد اجرایی به برنامه است:
این کار کنترل کامل برنامه را در اختیار مهاجم می‌گذارد.
برای جلوگیری از آن، از زبان templating استفاده کنید که مقادیر را برای جلوگیری از XSS روی server به‌طور خودکار escape می‌کند.
templateهای Angular را روی server با زبان templating نسازید؛ این کار خطر بالایی برای ایجاد template injection دارد.

## آسیب‌پذیری‌های سطح HTTP

Angular برای جلوگیری از دو آسیب‌پذیری رایج HTTP یعنی cross-site request forgery ‏(CSRF یا XSRF) و cross-site script inclusion ‏(XSSI) پشتیبانی داخلی دارد.
هر دو باید عمدتاً در سمت server کنترل شوند، اما Angular helperهایی برای یکپارچه‌سازی ساده‌تر سمت client ارائه می‌کند.

### Cross-site request forgery

در cross-site request forgery ‏(CSRF یا XSRF)، مهاجم کاربر را فریب می‌دهد تا صفحه دیگری مانند `evil.com` را که کد مخرب دارد باز کند. این صفحه مخفیانه request مخربی به web server برنامه مانند `example-bank.com` ارسال می‌کند.

فرض کنید کاربر در برنامه `example-bank.com` وارد شده است.
کاربر ایمیلی را باز و روی لینک `evil.com` کلیک می‌کند که در تب جدید باز می‌شود.

صفحه `evil.com` بلافاصله request مخربی به `example-bank.com` می‌فرستد.
این request ممکن است انتقال پول از حساب کاربر به حساب مهاجم باشد.
مرورگر cookieهای `example-bank.com`، از جمله cookie مربوط به authentication را خودکار همراه request می‌فرستد.

اگر server مربوط به `example-bank.com` محافظت XSRF نداشته باشد، نمی‌تواند request معتبر برنامه را از request جعلی `evil.com` تشخیص دهد.

برای جلوگیری از این حمله، برنامه باید مطمئن شود request کاربر از خود برنامه واقعی آمده است، نه سایتی دیگر.
server و client باید برای خنثی‌کردن حمله همکاری کنند.

در یک تکنیک رایج ضد XSRF،‏ application server یک token تصادفی authentication را در cookie می‌فرستد.
کد client،‏ cookie را می‌خواند و در تمام requestهای بعدی یک request header سفارشی حاوی token اضافه می‌کند.
server مقدار cookie را با مقدار request header مقایسه می‌کند و در صورت نبودن یا یکسان‌نبودن آن‌ها request را رد می‌کند.

این تکنیک مؤثر است، زیرا تمام مرورگرها _same origin policy_ را پیاده‌سازی می‌کنند.
فقط کد وب‌سایتی که cookie را تنظیم کرده می‌تواند cookieهای آن سایت را بخواند و header سفارشی روی requestهای همان سایت تنظیم کند.
یعنی فقط برنامه شما می‌تواند این cookie token را بخواند و header سفارشی را تنظیم کند.
کد مخرب `evil.com` چنین امکانی ندارد.

### امنیت XSRF/CSRF در `HttpClient`

`HttpClient` از یک [سازوکار رایج](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token) برای جلوگیری از XSRF پشتیبانی می‌کند. هنگام requestهای HTTP، یک interceptor،‏ token را از cookie با نام پیش‌فرض `XSRF-TOKEN` می‌خواند و در HTTP header با نام `X-XSRF-TOKEN` تنظیم می‌کند. چون فقط کد اجراشده در domain شما می‌تواند cookie را بخواند، backend مطمئن می‌شود request از برنامه client شما آمده است، نه مهاجم.

به‌طور پیش‌فرض interceptor این header را روی تمام requestهای تغییردهنده مانند `POST` به URLهای relative و same origin می‌فرستد، اما روی requestهای `GET` یا `HEAD` ارسال نمی‌کند.

<docs-callout helpful title="چرا از requestهای GET محافظت نمی‌شود؟">
محافظت CSRF فقط برای requestهایی لازم است که می‌توانند state را در backend تغییر دهند. حملات CSRF ذاتاً از مرز domain عبور می‌کنند و [same-origin policy](https://developer.mozilla.org/docs/Web/Security/Same-origin_policy) وب اجازه نمی‌دهد صفحه مهاجم نتیجه requestهای authenticated از نوع `GET` را دریافت کند.
</docs-callout>

برای بهره‌مندی از این قابلیت، server باید هنگام بارگذاری صفحه یا نخستین request از نوع GET،‏ token را در session cookie قابل‌خواندن توسط JavaScript با نام `XSRF-TOKEN` تنظیم کند. در requestهای بعدی server تطابق cookie با HTTP header به نام `X-XSRF-TOKEN` را بررسی می‌کند و مطمئن می‌شود فقط کد domain شما request را فرستاده است. token باید برای هر کاربر یکتا و برای server قابل‌تأیید باشد تا client نتواند token دلخواه بسازد. برای امنیت بیشتر، token را digest مربوط به cookie احراز هویت سایت همراه با salt قرار دهید.

برای جلوگیری از تداخل در محیط‌هایی که چند برنامه Angular یک domain یا subdomain مشترک دارند، به هر برنامه نام cookie یکتایی بدهید.

<docs-callout important title="HttpClient فقط بخش client طرح محافظت XSRF را پشتیبانی می‌کند">
  service مربوط به backend باید طوری پیکربندی شود که cookie را برای صفحه تنظیم و وجود header را در تمام requestهای واجدشرایط بررسی کند. در غیر این صورت محافظت پیش‌فرض Angular بی‌اثر است.
</docs-callout>

### پیکربندی نام سفارشی cookie و header

اگر backend برای cookie یا header مربوط به token در XSRF نام متفاوتی دارد، با `withXsrfConfiguration` مقادیر پیش‌فرض را بازنویسی کنید.

آن را به‌شکل زیر به فراخوانی `provideHttpClient` اضافه کنید:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'CUSTOM_XSRF_TOKEN',
        headerName: 'X-Custom-Xsrf-Header',
      }),
    ),
  ],
};
```

### غیرفعال‌کردن محافظت XSRF

اگر سازوکار داخلی محافظت XSRF برای برنامه شما مناسب نیست، با قابلیت `withNoXsrfProtection` آن را غیرفعال کنید:

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withNoXsrfProtection())],
};
```

برای اطلاعات OWASP درباره CSRF،‏ [Cross-Site Request Forgery ‏(CSRF)](https://owasp.org/www-community/attacks/csrf) و [راهنمای جلوگیری از Cross-Site Request Forgery ‏(CSRF)](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) را ببینید.
مقاله دانشگاه Stanford با عنوان [دفاع‌های مقاوم در برابر Cross-Site Request Forgery](https://seclab.stanford.edu/websec/csrf/csrf.pdf) منبعی پرجزئیات است.

همچنین [ارائه Dave Smith درباره XSRF در AngularConnect 2016](https://www.youtube.com/watch?v=9inczw6qtpY 'Cross Site Request Funkery Securing Your Angular Apps From Evil Doers') را ببینید.

### Cross-site script inclusion ‏(XSSI)

Cross-site script inclusion که با نام آسیب‌پذیری JSON نیز شناخته می‌شود، ممکن است به وب‌سایت مهاجم اجازه دهد داده‌های یک JSON API را بخواند.
این حمله در مرورگرهای قدیمی با بازنویسی constructorهای داخلی object در JavaScript و سپس افزودن URL مربوط به API با تگ `<script>` عمل می‌کند.

حمله فقط زمانی موفق است که JSON بازگشتی به‌عنوان JavaScript قابل‌اجرا باشد.
serverها می‌توانند با افزودن پیشوند به تمام responseهای JSON، آن‌ها را غیرقابل‌اجرا کنند؛ طبق قرارداد از رشته شناخته‌شده `")]}',\n"` استفاده می‌شود.

کتابخانه `HttpClient` در Angular این قرارداد را تشخیص داده و رشته `")]}',\n"` را پیش از parse بیشتر از تمام responseها حذف می‌کند.

برای اطلاعات بیشتر، بخش XSSI این [مطلب وبلاگ امنیت وب Google](https://security.googleblog.com/2011/05/website-security-for-webmasters.html) را ببینید.

## جلوگیری از Server-Side Request Forgery ‏(SSRF)

Angular برای جلوگیری از [Server-Side Request Forgery ‏(SSRF)](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/SSRF) مبتنی بر header،‏ headerهای `Host`،‏ `Forwarded`،‏ `X-Forwarded-Host`،‏ `X-Forwarded-Proto`،‏ `X-Forwarded-Prefix` و `X-Forwarded-Port` را در pipeline مدیریت request به‌دقت اعتبارسنجی می‌کند.

قواعد اعتبارسنجی عبارت‌اند از:

- `Host`،‏ `X-Forwarded-Host` و پارامتر `host` در header مربوط به `Forwarded` با allowlist سخت‌گیرانه اعتبارسنجی می‌شوند و نمی‌توانند path separator داشته باشند.
- header مربوط به `X-Forwarded-Port` باید عددی باشد.
- header مربوط به `X-Forwarded-Proto` و پارامتر `proto` در header مربوط به `Forwarded` باید `http` یا `https` باشند.
- header مربوط به `X-Forwarded-Prefix` باید با `/` شروع شود و فقط کاراکترهای alphanumeric، خط تیره و underscore داشته باشد که با slashهای تکی جدا شده‌اند.
- به‌طور پیش‌فرض header مربوط به `Forwarded` و تمام headerهای `X-Forwarded-*` غیرقابل‌اعتماد تلقی و از request حذف می‌شوند. برای حفظ آن‌ها باید با پیکربندی `trustProxyHeaders` صریحاً مجاز شوند.

header نامعتبر باعث ثبت error می‌شود و proxy headerهای غیرمجاز از request حذف می‌شوند. request با hostname ناشناخته به `400 Bad Request` منجر می‌شود.

NOTE: بیشتر cloud providerها و CDN providerها پیش از رسیدن request به origin برنامه، این headerها را خودکار اعتبارسنجی می‌کنند. این فیلتر داخلی سطح عملی حمله را بسیار کاهش می‌دهد.

### پیکربندی hostهای مجاز

برای مجازکردن hostnameهای مشخص باید آن‌ها را به allowlist اضافه کنید. این کار برای عملکرد درست و امن برنامه پس از deployment ضروری است. الگوها از wildcard برای تطبیق انعطاف‌پذیر hostname پشتیبانی می‌کنند.

می‌توانید گزینه `allowedHosts` را در `angular.json` پیکربندی کنید:

```json {hideCopy}
{
  // ...
  "projects": {
    "your-project-name": {
      // ...
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "security": {
              "allowedHosts": [
                "example.com",
                "*.example.com" // allows all subdomains of example.com
              ]
            }
            // ... other options
          }
        }
      }
    }
  }
}
```

همچنین هنگام مقداردهی اولیه application engine می‌توانید `allowedHosts` را پیکربندی کنید:

```typescript
const appEngine = new AngularAppEngine({
  allowedHosts: ['example.com', '*.trusted-example.com'],
});

const nodeAppEngine = new AngularNodeAppEngine({
  allowedHosts: ['example.com', '*.trusted-example.com'],
});
```

برای نوع Node.js یعنی `AngularNodeAppEngine` می‌توانید variable محیطی `NG_ALLOWED_HOSTS` را نیز به‌صورت فهرست جداشده با comma برای مجازکردن hostها ارائه کنید.

```bash {hideDollar}
export NG_ALLOWED_HOSTS="example.com,*.trusted-example.com"
```

IMPORTANT: می‌توانید مقدار `*` را در `allowedHosts` برای مجازکردن تمام hostnameها به‌کار ببرید، اما این کار معمولاً توصیه نمی‌شود و خطر امنیتی دارد. پذیرش هر host header ممکن است برنامه را در معرض host header injection و حملات [Server-Side Request Forgery ‏(SSRF)](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/SSRF) قرار دهد. فقط زمانی از این پیکربندی استفاده کنید که اعتبارسنجی headerهای `Host` و `X-Forwarded-Host` در لایه دیگری مانند load balancer یا reverse proxy انجام می‌شود. برای امنیت بهتر تا حد امکان فهرست صریح hostهای مجاز را به‌کار ببرید. برای جزئیات بیشتر [GHSA-x288-3778-4hhx](https://github.com/angular/angular-cli/security/advisories/GHSA-x288-3778-4hhx) را ببینید.

### پیکربندی proxy headerهای قابل‌اعتماد

Angular به‌طور پیش‌فرض header استاندارد `Forwarded` و تمام headerهای `X-Forwarded-*` را نادیده می‌گیرد. اگر برنامه پشت reverse proxy قابل‌اعتمادی مانند load balancer قرار دارد که این headerها را تنظیم می‌کند، می‌توانید Angular را برای اعتماد به آن‌ها پیکربندی کنید.

اگر header مربوط به `Forwarded` قابل‌اعتماد باشد، پارامترهای `host` و `proto` آن استخراج می‌شوند و بر headerهای متناظر `x-forwarded-host` و `x-forwarded-proto` اولویت دارند.

هنگام مقداردهی اولیه application engine می‌توانید `trustProxyHeaders` را پیکربندی کنید:

```typescript
const appEngine = new AngularAppEngine({
  trustProxyHeaders: ['forwarded'], // Trust the standard Forwarded header
});

const appEngine = new AngularAppEngine({
  trustProxyHeaders: ['x-forwarded-host', 'x-forwarded-proto'], // Trust non-standard headers
});

const nodeAppEngine = new AngularNodeAppEngine({
  trustProxyHeaders: true, // Trust standard Forwarded and all X-Forwarded-* headers
});
```

برای نوع Node.js یعنی `AngularNodeAppEngine` می‌توانید variable محیطی `NG_TRUST_PROXY_HEADERS` را نیز با فهرستی از headerها که با comma جدا شده‌اند ارائه کنید تا استفاده از آن‌ها مجاز شود.

```bash {hideDollar}
export NG_TRUST_PROXY_HEADERS="X-FORWARDED-HOST,X-FORWARDED-PREFIX"
```

IMPORTANT: فقط زمانی `trustProxyHeaders` را فعال کنید که برنامه پشت proxy قابل‌اعتمادی قرار دارد که این headerها را سخت‌گیرانه اعتبارسنجی یا بازنویسی می‌کند. در غیر این صورت مهاجم می‌تواند آن‌ها را جعل و حمله [Server-Side Request Forgery ‏(SSRF)](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/SSRF) ایجاد کند.

## audit کردن برنامه‌های Angular

برنامه‌های Angular باید همان اصول امنیتی برنامه‌های معمول وب را رعایت کنند و به همان شکل audit شوند.
APIهای مخصوص Angular که باید در بررسی امنیتی audit شوند، مانند methodهای [_bypassSecurityTrust_](#trusting-safe-values)، در مستندات به‌عنوان موارد حساس امنیتی علامت‌گذاری شده‌اند.

