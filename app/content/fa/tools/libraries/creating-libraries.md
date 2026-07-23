# ایجاد کتابخانه‌ها

این صفحه یک نمای کلی مفهومی از نحوه ایجاد و انتشار کتابخانه‌های جدید برای گسترش قابلیت‌های انگولار ارائه می‌دهد.

اگر لازم است مسئله یکسانی را در بیش از یک application حل کنید \(یا می‌خواهید راه‌حل خود را با توسعه‌دهندگان دیگر به اشتراک بگذارید\)، آن راه‌حل گزینه مناسبی برای تبدیل شدن به کتابخانه است.
یک نمونه ساده می‌تواند دکمه‌ای باشد که کاربران را به وب‌سایت شرکت شما می‌فرستد و در همه applicationهای ساخته‌شده توسط شرکت استفاده می‌شود.

## شروع کار

با فرمان‌های زیر از Angular CLI برای تولید اسکلت یک کتابخانه جدید در workspaceای تازه استفاده کنید.

```shell

ng new my-workspace --no-create-application
cd my-workspace
ng generate library my-lib

```

<docs-callout title="نام‌گذاری کتابخانه">

اگر می‌خواهید کتابخانه را بعداً در یک package registry عمومی مانند npm منتشر کنید، در انتخاب نام آن بسیار دقت کنید.
[انتشار کتابخانه](tools/libraries/creating-libraries#publishing-your-library) را ببینید.

از نام‌هایی با پیشوند `ng-` مانند `ng-library` استفاده نکنید.
پیشوند `ng-` کلمه‌ای رزروشده است که فریم‌ورک انگولار و کتابخانه‌های آن به کار می‌برند.
طبق convention رایج، پیشوند `ngx-` ترجیح داده می‌شود تا نشان دهد کتابخانه برای استفاده با انگولار مناسب است.
این پیشوند همچنین نشانه بسیار خوبی برای کاربران registry است تا کتابخانه‌های فریم‌ورک‌های مختلف JavaScript را از یکدیگر تشخیص دهند.

</docs-callout>

فرمان `ng generate` پوشه `projects/my-lib` را که شامل یک component است در workspace شما ایجاد می‌کند.

HELPFUL: برای جزئیات بیشتر درباره ساختار پروژه کتابخانه، بخش [فایل‌های پروژه کتابخانه](reference/configs/file-structure#library-project-files) از [راهنمای ساختار فایل پروژه](reference/configs/file-structure) را ببینید.

برای استفاده از یک workspace مشترک برای چندین پروژه، مدل monorepo را به کار ببرید.
[راه‌اندازی workspace چندپروژه‌ای](reference/configs/file-structure#multiple-projects) را ببینید.

هنگام تولید یک کتابخانه جدید، فایل پیکربندی workspace یعنی `angular.json` با پروژه‌ای از نوع `library` به‌روزرسانی می‌شود.

```json

"projects": {
  …
  "my-lib": {
    "root": "projects/my-lib",
    "sourceRoot": "projects/my-lib/src",
    "projectType": "library",
    "prefix": "lib",
    "architect": {
      "build": {
        "builder": "@angular/build:ng-packagr",
        …

```

پروژه را با فرمان‌های CLI بسازید، آزمایش و lint کنید:

```shell

ng build my-lib --configuration development
ng test my-lib
ng lint my-lib

```

توجه کنید builder پیکربندی‌شده برای پروژه با builder پیش‌فرض پروژه‌های application متفاوت است.
این builder در کنار کارهای دیگر تضمین می‌کند که کتابخانه همیشه با [کامپایلر AOT](tools/cli/aot-compiler) ساخته شود.

برای استفاده مجدد از کد کتابخانه باید یک API عمومی برای آن تعریف کنید.
این «لایه کاربر» مشخص می‌کند چه چیزهایی در دسترس مصرف‌کنندگان کتابخانه قرار دارند.
کاربر کتابخانه باید بتواند از طریق یک مسیر import واحد به قابلیت‌های عمومی \(مانند service providerها و توابع کمکی عمومی\) دسترسی پیدا کند.

API عمومی کتابخانه در فایل `public-api.ts` داخل پوشه کتابخانه نگهداری می‌شود.
هر چیزی که از این فایل export شود، هنگام import کردن کتابخانه در یک application عمومی خواهد بود.

کتابخانه باید مستنداتی \(معمولاً یک فایل README\) برای نصب و نگهداری ارائه کند.

## بازآرایی بخش‌هایی از application به یک کتابخانه

برای استفاده مجدد از راه‌حل باید آن را طوری تنظیم کنید که به کد مخصوص application وابسته نباشد.
هنگام انتقال قابلیت‌های application به کتابخانه، موارد زیر را در نظر بگیرید.

- declarationهایی مانند componentها و pipeها باید بدون state طراحی شوند؛ یعنی به متغیرهای خارجی وابسته نباشند یا آن‌ها را تغییر ندهند.
  اگر به state وابسته هستید، باید هر مورد را ارزیابی کنید و تصمیم بگیرید که state متعلق به application است یا باید توسط کتابخانه مدیریت شود.

- هر observableای که componentها به‌صورت داخلی subscribe می‌کنند باید در lifecycle همان componentها پاک‌سازی و dispose شود
- componentها باید تعاملات خود را از طریق inputها برای ارائه context و outputها برای انتقال eventها به componentهای دیگر در دسترس قرار دهند

- همه dependencyهای داخلی را بررسی کنید.
  - برای classها یا interfaceهای سفارشی استفاده‌شده در component یا service، بررسی کنید آیا به classها یا interfaceهای دیگری وابسته‌اند که آن‌ها نیز باید منتقل شوند
  - به همین ترتیب، اگر کد کتابخانه به serviceای وابسته است، آن service نیز باید منتقل شود
  - اگر کد کتابخانه یا templateهای آن به کتابخانه‌های دیگری \(برای نمونه Angular Material\) وابسته‌اند، باید کتابخانه خود را با آن dependencyها پیکربندی کنید

- نحوه ارائه serviceها به applicationهای مصرف‌کننده را در نظر بگیرید.
  - serviceها باید providerهای خود را declaration کنند، نه اینکه providerها در NgModule یا یک component تعریف شوند.
    declaration کردن provider باعث می‌شود service قابلیت _tree-shaking_ داشته باشد.
    به این ترتیب، اگر service هیچ‌گاه در application واردکننده کتابخانه inject نشود، کامپایلر آن را از bundle کنار می‌گذارد.
    برای اطلاعات بیشتر، [providerهای قابل tree-shaking](guide/di/lightweight-injection-tokens) را ببینید.

  - اگر service providerهای سراسری ثبت می‌کنید، یک تابع provider به نام `provideXYZ()` در دسترس قرار دهید.
  - اگر کتابخانه serviceهای اختیاری‌ای دارد که ممکن است همه applicationهای مصرف‌کننده از آن‌ها استفاده نکنند، با استفاده از [الگوی طراحی token سبک](guide/di/lightweight-injection-tokens) از tree-shaking درست پشتیبانی کنید

## یکپارچه‌سازی با CLI از طریق شماتیک‌های تولید کد

یک کتابخانه معمولاً شامل _کد قابل استفاده مجددی_ است که componentها، serviceها و دیگر artifactهای انگولار \(pipeها و directiveها\) را تعریف می‌کند و شما آن‌ها را در پروژه import می‌کنید.
کتابخانه برای انتشار و اشتراک‌گذاری در قالب یک package مربوط به npm بسته‌بندی می‌شود.
این package همچنین می‌تواند شامل شماتیک‌هایی باشد که مانند ایجاد یک component عمومی توسط CLI با `ng generate component`، دستورالعمل‌های تولید یا تبدیل مستقیم کد در پروژه را ارائه می‌کنند.
برای نمونه، شماتیکی که همراه کتابخانه بسته‌بندی شده است می‌تواند اطلاعات لازم برای تولید componentای را در اختیار Angular CLI بگذارد که یک قابلیت خاص یا مجموعه‌ای از قابلیت‌های تعریف‌شده در کتابخانه را پیکربندی و استفاده می‌کند.
یک نمونه، [شماتیک navigation در Angular Material](https://material.angular.dev/guide/schematics#navigation-schematic) است که [BreakpointObserver](https://material.angular.dev/cdk/layout/overview#breakpointobserver) مربوط به CDK را پیکربندی می‌کند و آن را همراه componentهای [MatSideNav](https://material.angular.dev/components/sidenav/overview) و [MatToolbar](https://material.angular.dev/components/toolbar/overview) مربوط به Material به کار می‌برد.

انواع زیر از شماتیک‌ها را ایجاد و اضافه کنید:

- یک شماتیک نصب اضافه کنید تا `ng add` بتواند کتابخانه را به پروژه بیفزاید
- شماتیک‌های تولید را در کتابخانه قرار دهید تا `ng generate` بتواند artifactهای تعریف‌شده \(componentها، serviceها و testها\) را در پروژه scaffold کند
- یک شماتیک به‌روزرسانی اضافه کنید تا `ng update` بتواند dependencyهای کتابخانه را به‌روزرسانی و migrationهای تغییرات ناسازگار نسخه‌های جدید را ارائه کند

محتوایی که در کتابخانه قرار می‌دهید به وظیفه شما بستگی دارد.
برای نمونه، می‌توانید شماتیکی تعریف کنید که یک dropdown با داده‌های نمونه از پیش‌واردشده بسازد و نحوه افزودن آن به application را نشان دهد.
اگر dropdown باید هر بار مقادیر ارسالی متفاوتی داشته باشد، کتابخانه می‌تواند شماتیکی تعریف کند که آن را با پیکربندی مشخص ایجاد کند.
سپس توسعه‌دهندگان می‌توانند با `ng generate` یک نمونه را برای application خود پیکربندی کنند.

فرض کنید می‌خواهید یک فایل پیکربندی را بخوانید و سپس بر اساس آن یک form تولید کنید.
اگر آن form به سفارشی‌سازی بیشتری توسط توسعه‌دهنده استفاده‌کننده از کتابخانه نیاز دارد، احتمالاً شماتیک انتخاب بهتری است.
اما اگر form همیشه یکسان است و توسعه‌دهندگان به سفارشی‌سازی زیادی نیاز ندارند، می‌توانید componentای پویا بسازید که پیکربندی را دریافت و form را تولید کند.
به‌طور کلی، هرچه سفارشی‌سازی پیچیده‌تر باشد، رویکرد شماتیک مفیدتر خواهد بود.

برای اطلاعات بیشتر، [مرور کلی شماتیک‌ها](tools/cli/schematics) و [شماتیک‌ها برای کتابخانه‌ها](tools/cli/schematics-for-libraries) را ببینید.

## انتشار کتابخانه

برای ساخت و انتشار کتابخانه به‌عنوان یک package مربوط به npm، از Angular CLI و package manager به نام npm استفاده کنید.

Angular CLI برای ساخت packageهای قابل انتشار در npm از کد کامپایل‌شده شما، ابزاری به نام [ng-packagr](https://github.com/ng-packagr/ng-packagr/blob/master/README.md) به کار می‌برد.
برای اطلاعات درباره formatهای توزیع پشتیبانی‌شده توسط `ng-packagr` و راهنمای انتخاب format مناسب کتابخانه، [ساخت کتابخانه‌ها با Ivy](tools/libraries/creating-libraries#publishing-libraries) را ببینید.

همیشه باید کتابخانه‌های قابل توزیع را با پیکربندی `production` بسازید.
این کار تضمین می‌کند خروجی تولیدشده از بهینه‌سازی‌های مناسب و format صحیح package برای npm استفاده کند.

```shell

ng build my-lib
cd dist/my-lib
npm publish

```

## مدیریت assetها در کتابخانه

در کتابخانه انگولار، خروجی قابل توزیع می‌تواند assetهای بیشتری مانند فایل‌های theme، mixinهای Sass یا مستندات \(مانند changelog\) داشته باشد.
برای اطلاعات بیشتر، [assetها را به‌عنوان بخشی از build در کتابخانه کپی کنید](https://github.com/ng-packagr/ng-packagr/blob/master/docs/copy-assets.md) و [assetها را در styleهای component قرار دهید](https://github.com/ng-packagr/ng-packagr/blob/master/docs/embed-assets-css.md).

IMPORTANT: هنگام افزودن assetهایی مانند mixinهای Sass یا CSS از پیش کامپایل‌شده، باید آن‌ها را به‌صورت دستی به ["exports"](tools/libraries/angular-package-format#exports) شرطی در `package.json` مربوط به entrypoint اصلی اضافه کنید.

`ng-packagr` مقدارهای `"exports"` دست‌نویس را با مقادیر تولیدشده خودکار ادغام می‌کند و به نویسندگان کتابخانه اجازه می‌دهد export subpathهای بیشتر یا conditionهای سفارشی را پیکربندی کنند.

```json

"exports": {
  ".": {
    "sass": "./_index.scss",
  },
  "./theming": {
    "sass": "./_theming.scss"
  },
  "./prebuilt-themes/indigo-pink.css": {
    "style": "./prebuilt-themes/indigo-pink.css"
  }
}

```

کد بالا بخشی از خروجی قابل توزیع [@angular/material](https://unpkg.com/browse/@angular/material/package.json) است.

## Peer dependencyها

کتابخانه‌های انگولار باید همه dependencyهای `@angular/*` مورد نیاز کتابخانه را در peer dependencyها فهرست کنند.
این کار تضمین می‌کند وقتی moduleها انگولار را درخواست می‌کنند، همگی دقیقاً همان module را دریافت کنند.
اگر کتابخانه به‌جای `peerDependencies`، مقدار `@angular/core` را در `dependencies` قرار دهد، ممکن است module متفاوتی از انگولار دریافت کند و application شما از کار بیفتد.

## استفاده از کتابخانه خود در applicationها

برای استفاده از کتابخانه در همان workspace مجبور نیستید آن را در package manager به نام npm منتشر کنید، اما باید ابتدا آن را بسازید.

برای استفاده از کتابخانه خود در یک application:

- کتابخانه را بسازید.
  پیش از ساخت نمی‌توانید از کتابخانه استفاده کنید.

```shell
  ng build my-lib
```

- در applicationها با نام کتابخانه از آن import کنید:

```ts
import {myExport} from 'my-lib';
```

### ساخت و بازسازی کتابخانه

اگر کتابخانه را به‌عنوان package مربوط به npm منتشر نکرده و سپس دوباره از npm در application نصب نکرده باشید، مرحله build اهمیت دارد.
برای نمونه، اگر repository مربوط به git را clone و `npm install` را اجرا کنید، تا زمانی که کتابخانه را نساخته‌اید editor، importهای `my-lib` را مفقود نشان می‌دهد.

HELPFUL: وقتی چیزی را از یک کتابخانه در application انگولار import می‌کنید، انگولار به‌دنبال نگاشتی میان نام کتابخانه و محلی روی دیسک می‌گردد.
هنگام نصب package کتابخانه، این نگاشت در پوشه `node_modules` قرار دارد.
وقتی کتابخانه خود را می‌سازید، این نگاشت باید در pathهای `tsconfig` پیدا شود.

تولید کتابخانه با Angular CLI مسیر آن را به‌طور خودکار به فایل `tsconfig` اضافه می‌کند.
Angular CLI با استفاده از pathهای `tsconfig` به build system می‌گوید کتابخانه را کجا پیدا کند.

برای اطلاعات بیشتر، [مرور کلی path mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping) را ببینید.

پس از هر تغییر می‌توانید کتابخانه را دوباره بسازید، اما این مرحله اضافی زمان می‌برد.
قابلیت _incremental build_ تجربه توسعه کتابخانه را بهتر می‌کند.
هر بار که فایلی تغییر کند، یک build جزئی انجام می‌شود و فایل‌های اصلاح‌شده را خروجی می‌دهد.

incremental buildها می‌توانند به‌صورت فرایندی پس‌زمینه در محیط توسعه اجرا شوند.
برای استفاده از این قابلیت، flag به نام `--watch` را به فرمان build اضافه کنید:

```shell

ng build my-lib --watch

```

IMPORTANT: فرمان `build` در CLI برای کتابخانه‌ها نسبت به applicationها از builder و ابزار build متفاوتی استفاده می‌کند.

- build system مربوط به applicationها یعنی `@angular/build` مبتنی بر `esbuild` است و در همه پروژه‌های جدید Angular CLI وجود دارد
- build system مربوط به کتابخانه‌ها مبتنی بر `ng-packagr` است.
  این ابزار فقط زمانی به dependencyها اضافه می‌شود که با `ng generate library my-lib` یک کتابخانه اضافه کنید.

این دو build system از قابلیت‌های متفاوتی پشتیبانی می‌کنند و حتی قابلیت‌های مشترک را نیز به شکل متفاوتی انجام می‌دهند.
یعنی یک کد منبع TypeScript ممکن است در کتابخانه ساخته‌شده به کد JavaScript متفاوتی نسبت به application ساخته‌شده تبدیل شود.

به همین دلیل، application وابسته به کتابخانه فقط باید از TypeScript path mappingهایی استفاده کند که به _کتابخانه ساخته‌شده_ اشاره دارند.
TypeScript path mappingها _نباید_ به فایل‌های منبع `.ts` کتابخانه اشاره کنند.

### لینک کردن کتابخانه‌ها برای توسعه محلی

این بخش نحوه استفاده از قابلیت لینک محلی package manager \(مانند [`npm link`](https://docs.npmjs.com/cli/v11/commands/npm-link) یا [`pnpm link`](https://pnpm.io/cli/link)\) را برای آزمایش یک کتابخانه مستقل انگولار با applicationای خارجی در طول توسعه محلی توضیح می‌دهد؛ بدون وابستگی به ساختار workspace مربوط به monorepo یا انتشار در registry مربوط به npm.

NOTE: اگر کتابخانه و application در یک workspace انگولار مشترک \(ساختار monorepo\) هستند، گردش‌کار استاندارد monorepo لینک کردن را به‌صورت خودکار مدیریت می‌کند و معمولاً کارآمدتر است. این رویکرد لینک محلی در موارد زیر مناسب‌تر است:

- در حال توسعه یک کتابخانه مستقل هستید و باید تغییرات را با applicationای خارجی که آن را مصرف می‌کند آزمایش کنید.
- تغییرات کتابخانه را در application مصرف‌کننده‌ای خارج از workspace مربوط به monorepo آزمایش می‌کنید.

#### پیکربندی application مصرف‌کننده

برای استفاده از کتابخانه‌های لینک‌شده، باید فایل `angular.json` مربوط به application را با تنظیمات زیر پیکربندی کنید:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "preserveSymlinks": true
          },
          "configurations": {
            "development": {
              "sourceMap": {
                "scripts": true,
                "styles": true,
                "vendor": true
              }
            }
          }
        },
        "serve": {
          "builder": "@angular/build:dev-server",
          "options": {
            "prebundle": {
              "exclude": ["my-lib"]
            }
          }
        }
      }
    }
  }
}
```

**توضیح گزینه‌های پیکربندی:**

- `preserveSymlinks: true`: به build system می‌گوید به‌جای resolve کردن symlinkها به محل اصلی آن‌ها، symlinkهای ایجادشده توسط فرمان لینک package manager را دنبال کند. این تنظیم برای جلوگیری از چند نسخه‌ای شدن node packageهای وابسته ضروری است.
- `sourceMap.vendor`: فعال کردن source mapهای vendor \(به‌ویژه `vendor: true`\) برای اشکال‌زدایی آسان‌تر کد کتابخانه لینک‌شده.
- `prebundle.exclude`: Angular CLI به‌طور پیش‌فرض می‌تواند همه node dependencyها را از قبل bundle کند. خارج کردن کتابخانه تضمین می‌کند کد منبع لینک‌شده به‌درستی watch شود و هنگام تغییر دوباره ساخته شود.

## انتشار کتابخانه‌ها

برای انتشار یک کتابخانه، دو format توزیع وجود دارد:

| formatهای توزیع              | جزئیات                                                                                                                                                                                                                                                                                                                            |
| :--------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Partial-Ivy \(پیشنهادشده\)   | شامل کد قابل حملی است که applicationهای Ivy ساخته‌شده با هر نسخه انگولار از v12 به بعد می‌توانند از آن استفاده کنند.                                                                                                                                                                                                              |
| Full-Ivy                     | شامل دستورالعمل‌های خصوصی Angular Ivy است که تضمینی برای کار کردن آن‌ها میان نسخه‌های مختلف انگولار وجود ندارد. این format نیاز دارد کتابخانه و application با _دقیقاً_ یک نسخه انگولار ساخته شوند. این format برای محیط‌هایی مناسب است که همه کد کتابخانه و application مستقیماً از source ساخته می‌شود.                        |

برای انتشار در npm از format به نام partial-Ivy استفاده کنید، زیرا میان نسخه‌های patch انگولار پایدار است.

اگر کتابخانه را در npm منتشر می‌کنید، آن را با کد full-Ivy کامپایل نکنید؛ زیرا دستورالعمل‌های Ivy تولیدشده بخشی از API عمومی انگولار نیستند و ممکن است میان نسخه‌های patch تغییر کنند.

## تضمین سازگاری نسخه کتابخانه

نسخه انگولاری که برای ساخت application استفاده می‌شود باید همیشه برابر یا جدیدتر از نسخه‌های انگولار استفاده‌شده برای ساخت هر یک از کتابخانه‌های وابسته باشد.
برای نمونه، اگر کتابخانه‌ای با Angular نسخه 13 دارید، application وابسته به آن باید از Angular نسخه 13 یا جدیدتر استفاده کند.
انگولار از استفاده نسخه قدیمی‌تر برای application پشتیبانی نمی‌کند.

اگر می‌خواهید کتابخانه را در npm منتشر کنید، با تنظیم `"compilationMode": "partial"` در `tsconfig.prod.json` آن را با کد partial-Ivy کامپایل کنید.
این format جزئی میان نسخه‌های مختلف انگولار پایدار است، پس انتشار آن در npm ایمن خواهد بود.
کد دارای این format هنگام build کردن application و با همان نسخه کامپایلر انگولار پردازش می‌شود؛ در نتیجه application و همه کتابخانه‌هایش از یک نسخه انگولار استفاده می‌کنند.

اگر کتابخانه را در npm منتشر می‌کنید، آن را با کد full-Ivy کامپایل نکنید؛ زیرا دستورالعمل‌های Ivy تولیدشده بخشی از API عمومی انگولار نیستند و ممکن است میان نسخه‌های patch تغییر کنند.

اگر تاکنون packageای در npm منتشر نکرده‌اید، باید حساب کاربری ایجاد کنید.
در [انتشار packageهای npm](https://docs.npmjs.com/getting-started/publishing-npm-packages) بیشتر بخوانید.

## استفاده از کد partial-Ivy خارج از Angular CLI

یک application بسیاری از کتابخانه‌های انگولار را از npm در دایرکتوری `node_modules` خود نصب می‌کند.
بااین‌حال، چون کد این کتابخانه‌ها به‌طور کامل کامپایل نشده است، نمی‌توان آن را مستقیماً همراه application ساخته‌شده bundle کرد.
برای تکمیل کامپایل، از Angular linker استفاده کنید.

برای applicationهایی که از Angular CLI استفاده نمی‌کنند، linker به‌صورت یک plugin برای [Babel](https://babeljs.io) در دسترس است.
این plugin باید از `@angular/compiler-cli/linker/babel` import شود.

plugin مربوط به Angular linker برای Babel از build caching پشتیبانی می‌کند؛ یعنی صرف‌نظر از دیگر عملیات npm، کافی است کتابخانه‌ها فقط یک بار توسط linker پردازش شوند.

نمونه‌ای از یکپارچه‌سازی plugin در build سفارشی [webpack](https://webpack.js.org) با ثبت linker به‌عنوان plugin مربوط به [Babel](https://babeljs.io) و با استفاده از [babel-loader](https://webpack.js.org/loaders/babel-loader/#options):

<docs-code header="webpack.config.mjs" path="adev/src/content/examples/angular-linker-plugin/webpack.config.mjs" region="webpack-config"/>

HELPFUL: Angular CLI به‌طور خودکار plugin مربوط به linker را یکپارچه می‌کند؛ بنابراین اگر مصرف‌کنندگان کتابخانه از CLI استفاده کنند، می‌توانند کتابخانه‌های بومی Ivy را بدون پیکربندی بیشتر از npm نصب کنند.
