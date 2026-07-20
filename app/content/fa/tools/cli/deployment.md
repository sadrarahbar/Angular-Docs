# Deployment

وقتی آماده‌اید Angular application خود را روی یک remote server deploy کنید، گزینه‌های مختلفی دارید.

## Deployment خودکار با CLI

command مربوط به Angular CLI یعنی `ng deploy`، [CLI builder](tools/cli/cli-builder) مربوط به `deploy` را که با project شما associate شده اجرا می‌کند.
تعدادی builder از third-partyها قابلیت deployment برای platformهای مختلف را implement کرده‌اند.
می‌توانید هرکدام از آن‌ها را با `ng add` به project خود اضافه کنید.

وقتی packageای با قابلیت deployment اضافه می‌کنید، workspace configuration شما، یعنی فایل `angular.json`، به‌صورت خودکار با یک بخش `deploy` برای project انتخاب‌شده update می‌شود.
بعد از آن می‌توانید از command مربوط به `ng deploy` برای deploy کردن آن project استفاده کنید.

برای مثال، command زیر یک project را به‌صورت خودکار روی [Firebase](https://firebase.google.com/) deploy می‌کند.

```shell

ng add @angular/fire
ng deploy

```

این command تعاملی است.
در این حالت باید یک Firebase account داشته باشید یا بسازید و با آن authenticate کنید.
پیش از build کردن application و upload کردن production assetها به Firebase، command از شما می‌خواهد یک Firebase project را برای deployment انتخاب کنید.

جدول زیر toolهایی را فهرست می‌کند که deployment functionality را برای platformهای مختلف implement کرده‌اند.
command مربوط به `deploy` برای هر package ممکن است به command line optionهای متفاوتی نیاز داشته باشد.
با دنبال کردن linkهای مرتبط با package nameها در پایین می‌توانید بیشتر بخوانید:

| Deployment به                                                     | Setup Command                                                                               |
| :---------------------------------------------------------------- | :------------------------------------------------------------------------------------------ |
| [Firebase hosting](https://firebase.google.com/docs/hosting)      | [`ng add @angular/fire`](https://npmjs.org/package/@angular/fire)                           |
| [Vercel](https://vercel.com/solutions/angular)                    | [`vercel init angular`](https://github.com/vercel/vercel/tree/main/examples/angular)        |
| [Netlify](https://www.netlify.com)                                | [`ng add @netlify-builder/deploy`](https://npmjs.org/package/@netlify-builder/deploy)       |
| [GitHub Pages](https://pages.github.com)                          | [`ng add angular-cli-ghpages`](https://npmjs.org/package/angular-cli-ghpages)               |
| [Amazon Cloud S3](https://aws.amazon.com/s3/?nc2=h_ql_prod_st_s3) | [`ng add @jefiozie/ngx-aws-deploy`](https://www.npmjs.com/package/@jefiozie/ngx-aws-deploy) |

اگر روی self-managed server deploy می‌کنید یا برای cloud platform مورد علاقه‌تان builderی وجود ندارد، می‌توانید یا یک [builder بسازید](tools/cli/cli-builder) که اجازه دهد از command مربوط به `ng deploy` استفاده کنید، یا این guide را بخوانید تا یاد بگیرید application خود را دستی deploy کنید.

## Deployment دستی روی remote server

برای deploy دستی application، یک production build بسازید و output directory را روی یک web server یا content delivery network یا CDN کپی کنید.
به‌صورت پیش‌فرض، `ng build` از configuration مربوط به `production` استفاده می‌کند.
اگر build configurationهای خود را customize کرده‌اید، بهتر است قبل از deployment مطمئن شوید [production optimizationها](tools/cli/deployment#production-optimizations) اعمال می‌شوند.

`ng build` به‌صورت پیش‌فرض artifactهای build شده را در `dist/my-app/` خروجی می‌دهد؛ با این حال، این path می‌تواند با option مربوط به `outputPath` در builder مربوط به `@angular/build:application` configure شود.
این directory را روی server کپی کنید و server را configure کنید تا همان directory را serve کند.

با اینکه این یک minimal deployment solution است، برای اینکه server بتواند Angular application شما را درست serve کند چند requirement وجود دارد.

## Server configuration

این بخش تغییراتی را پوشش می‌دهد که ممکن است لازم باشد روی server configure کنید تا Angular application شما اجرا شود.

### Routed appها باید به `index.html` fallback کنند

Angular applicationهایی که client-side render می‌شوند، گزینه‌های عالی برای serve شدن با static HTML server هستند چون تمام content آن‌ها static است و در build time generate می‌شود.

اگر application از Angular router استفاده می‌کند، باید server را طوری configure کنید که وقتی فایلی درخواست شد که ندارد، host page مربوط به application یعنی `index.html` را برگرداند.

یک routed application باید از "deep link" پشتیبانی کند.
_deep link_ یک URL است که path به یک component داخل application را مشخص می‌کند.
برای مثال، `http://my-app.test/users/42` یک _deep link_ به صفحه جزئیات user است که user با `id` برابر 42 را نمایش می‌دهد.

وقتی کاربر ابتدا index page را load کند و سپس از داخل client در حال اجرا به آن URL navigate کند، مشکلی وجود ندارد.
Angular router navigation را _client-side_ انجام می‌دهد و HTML page جدیدی request نمی‌کند.

اما کلیک روی deep link در email، وارد کردن آن در browser address bar، یا حتی refresh کردن browser وقتی همین حالا روی deep linked page هستید، همگی توسط خود browser مدیریت می‌شوند؛ یعنی _خارج_ از application در حال اجرا.
browser یک request مستقیم به server برای `/users/42` می‌فرستد و Angular router را bypass می‌کند.

یک static server معمولاً وقتی request برای `http://my-app.test/` دریافت کند، `index.html` را برمی‌گرداند.
اما بیشتر serverها به‌صورت پیش‌فرض `http://my-app.test/users/42` را reject می‌کنند و error مربوط به `404 - Not Found` برمی‌گردانند، _مگر اینکه_ configure شده باشند تا به‌جای آن `index.html` را برگردانند.
fallback route یا 404 page را برای server خود روی `index.html` configure کنید تا Angular برای deep linkها serve شود و بتواند route درست را نمایش دهد.
بعضی serverها این fallback behavior را حالت "Single-Page Application" یا SPA می‌نامند.

وقتی browser application را load کند، Angular router URL را می‌خواند تا تشخیص دهد روی کدام page است و `/users/42` را درست نمایش می‌دهد.

برای 404 pageهای "واقعی" مثل `http://my-app.test/does-not-exist`، server به configuration اضافه‌ای نیاز ندارد.
[404 pageهایی که در Angular router implement شده‌اند](guide/routing/common-router-tasks#displaying-a-404-page) درست نمایش داده می‌شوند.

### Request کردن data از server متفاوت (CORS)

Web developerها ممکن است هنگام ایجاد network request به serverی غیر از host server خود application با error مربوط به [_cross-origin resource sharing_](https://developer.mozilla.org/docs/Web/HTTP/CORS 'Cross-origin resource sharing') روبه‌رو شوند.
Browserها چنین requestهایی را ممنوع می‌کنند مگر اینکه server صریحاً آن‌ها را اجازه دهد.

Angular یا client application نمی‌تواند کاری برای این errorها انجام دهد.
_server_ باید configure شود تا requestهای application را بپذیرد.
درباره نحوه enable کردن CORS برای serverهای مشخص در [enable-cors.org](https://enable-cors.org/server.html 'Enabling CORS server') بخوانید.

## Production optimizationها

`ng build` از configuration مربوط به `production` استفاده می‌کند مگر اینکه طور دیگری configure شده باشد. این configuration featureهای build optimization زیر را enable می‌کند.

| Featureها                                                        | جزئیات                                                                                     |
| :--------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| [Ahead-of-Time (AOT) Compilation](tools/cli/aot-compiler)        | Angular component templateها را pre-compile می‌کند.                                       |
| [Production mode](tools/cli/deployment#development-only-features) | application را برای بهترین runtime performance optimize می‌کند                            |
| Bundling                                                         | تعداد زیاد فایل‌های application و library شما را به کمترین تعداد فایل deployed تبدیل می‌کند. |
| Minification                                                     | whitespace، commentها و tokenهای optional اضافی را حذف می‌کند.                            |
| Mangling                                                         | نام functionها، classها و variableها را به identifierهای کوتاه‌تر و arbitrary تغییر می‌دهد. |
| Dead code elimination                                            | moduleهای reference نشده و کد استفاده‌نشده را حذف می‌کند.                                 |

برای اطلاعات بیشتر درباره CLI build optionها و اثرات آن‌ها، [`ng build`](cli/build) را ببینید.

### Featureهای فقط مخصوص development

وقتی application را به‌صورت local با `ng serve` اجرا می‌کنید، Angular در runtime از development configuration استفاده می‌کند
که موارد زیر را enable می‌کند:

- safety checkهای اضافه مثل detection مربوط به [`expression-changed-after-checked`](errors/NG0100).
- error messageهای جزئی‌تر.
- debugging utilityهای اضافی مثل variable سراسری `ng` همراه [debugging functionها](api#core-global) و پشتیبانی از [Angular DevTools](tools/devtools).

این featureها هنگام development مفیدند، اما به کد اضافه در app نیاز دارند، چیزی که در production مطلوب نیست. برای اینکه این featureها روی bundle size کاربران نهایی اثر منفی نگذارند، Angular CLI هنگام build برای production کدهای فقط مخصوص development را از bundle حذف می‌کند.

Build کردن application با `ng build` به‌صورت پیش‌فرض از configuration مربوط به `production` استفاده می‌کند و این featureها را برای رسیدن به bundle size بهینه از خروجی حذف می‌کند.

## `--deploy-url`

`--deploy-url` یک command line option است که برای مشخص کردن base path جهت resolve کردن relative URLها برای assetهایی مثل imageها، scriptها و stylesheetها در زمان _compile_ استفاده می‌شود.

```shell

ng build --deploy-url /my/assets

```

اثر و هدف `--deploy-url` با [`<base href>`](guide/routing/router-reference#base-href) هم‌پوشانی دارد. هر دو می‌توانند برای initial scriptها، stylesheetها، lazy scriptها و css resourceها استفاده شوند.

برخلاف `<base href>` که می‌تواند در runtime و در یک جای واحد تعریف شود، `--deploy-url` باید در build time داخل application hard-code شود.
تا جای ممکن `<base href>` را ترجیح دهید.
