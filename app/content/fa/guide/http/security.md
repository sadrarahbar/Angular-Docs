# امنیت `HttpClient`

`HttpClient` به‌صورت داخلی از دو سازوکار رایج امنیت HTTP پشتیبانی می‌کند: محافظت در برابر XSSI و محافظت در برابر XSRF/CSRF.

TIP: استفاده از [Content Security Policy](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy) را نیز برای APIهای خود در نظر بگیرید.

## محافظت در برابر XSSI

Cross-Site Script Inclusion \(XSSI\) نوعی حمله [Cross-Site Scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) است که در آن مهاجم، داده JSON را از endpointهای API شما به‌صورت `<script>` در صفحه‌ای تحت کنترل خود بارگذاری می‌کند. سپس می‌تواند با روش‌های مختلف JavaScript به این داده دسترسی پیدا کند.

یکی از روش‌های رایج پیشگیری از XSSI، ارائه responseهای JSON با یک «پیشوند غیرقابل اجرا» است که معمولاً `)]}',\n` است. این پیشوند مانع تفسیر response مربوط به JSON به‌عنوان JavaScript معتبر و قابل اجرا می‌شود. وقتی API به‌عنوان داده بارگذاری شود، می‌توان پیش از parse کردن JSON پیشوند را حذف کرد.

`HttpClient` هنگام parse کردن JSON از response، این پیشوند XSSI را در صورت وجود به‌طور خودکار حذف می‌کند.

## محافظت در برابر XSRF/CSRF

[Cross-Site Request Forgery \(XSRF یا CSRF\)](https://en.wikipedia.org/wiki/Cross-site_request_forgery) روشی برای حمله است که مهاجم با آن کاربر احراز هویت‌شده را فریب می‌دهد تا بدون آگاهی، اقداماتی را در وب‌سایت شما اجرا کند.

`HttpClient` از [سازوکاری رایج](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token) برای جلوگیری از حمله‌های XSRF پشتیبانی می‌کند. هنگام انجام requestهای HTTP، یک interceptor به‌طور پیش‌فرض token را از cookie به نام `XSRF-TOKEN` می‌خواند و آن را به‌صورت header مربوط به HTTP با نام `X-XSRF-TOKEN` تنظیم می‌کند. چون فقط کدی که روی domain شما اجرا می‌شود می‌تواند cookie را بخواند، backend مطمئن می‌شود request مربوط به HTTP از application سمت client شما آمده است، نه مهاجم.

interceptor به‌طور پیش‌فرض این header را در همه requestهای تغییردهنده \(مانند `POST`\) به URLهای نسبی و same-origin ارسال می‌کند، اما آن را در requestهای `GET` یا `HEAD` نمی‌فرستد.

<docs-callout helpful title="چرا از requestهای GET محافظت نمی‌شود؟">
محافظت CSRF فقط برای requestهایی لازم است که می‌توانند state را در backend تغییر دهند. حمله‌های CSRF ذاتاً از مرز domain عبور می‌کنند و [سیاست same-origin](https://developer.mozilla.org/docs/Web/Security/Same-origin_policy) وب مانع دریافت نتیجه requestهای احراز هویت‌شده `GET` توسط صفحه مهاجم می‌شود.
</docs-callout>

برای بهره‌گیری از این قابلیت، server باید هنگام بارگذاری صفحه یا نخستین request از نوع GET، token را در session cookie قابل خواندن توسط JavaScript با نام `XSRF-TOKEN` قرار دهد. در requestهای بعدی server می‌تواند تطابق cookie با header مربوط به HTTP به نام `X-XSRF-TOKEN` را بررسی کند و مطمئن شود فقط کد در حال اجرا روی domain شما می‌توانسته request را ارسال کند. token باید برای هر کاربر یکتا و توسط server قابل تأیید باشد؛ این ویژگی مانع ساخت token دلخواه توسط client می‌شود. برای امنیت بیشتر، token را برابر digest مربوط به cookie احراز هویت سایت همراه با salt قرار دهید.

برای جلوگیری از تداخل در محیط‌هایی که چندین application انگولار یک domain یا subdomain مشترک دارند، به هر application نام cookie یکتایی اختصاص دهید.

<docs-callout important title="HttpClient فقط از بخش client در طرح محافظت XSRF پشتیبانی می‌کند">
  service مربوط به backend باید طوری پیکربندی شود که cookie را برای صفحه تنظیم و وجود header را در همه requestهای واجد شرایط بررسی کند. در غیر این صورت، محافظت پیش‌فرض انگولار بی‌اثر خواهد بود.
</docs-callout>

### پیکربندی نام سفارشی cookie و header

اگر service مربوط به backend برای cookie یا header مربوط به token به نام XSRF از نام‌های دیگری استفاده می‌کند، با `withXsrfConfiguration` مقادیر پیش‌فرض را بازنویسی کنید.

آن را به شکل زیر به فراخوانی `provideHttpClient` اضافه کنید:

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

### غیرفعال کردن محافظت XSRF

اگر سازوکار داخلی محافظت XSRF برای application شما مناسب نیست، می‌توانید آن را با قابلیت `withNoXsrfProtection` غیرفعال کنید:

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withNoXsrfProtection())],
};
```
