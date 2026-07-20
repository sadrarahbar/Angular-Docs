# Build کردن Angular appها

می‌توانید Angular CLI application یا library خود را با command مربوط به `ng build` build کنید.
این command کد TypeScript شما را به JavaScript compile می‌کند و همچنین خروجی را در صورت نیاز optimize، bundle و minify می‌کند.

`ng build` فقط builder مربوط به target به نام `build` را در default project، همان‌طور که در `angular.json` مشخص شده، اجرا می‌کند.
Angular CLI چهار builder دارد که معمولاً به‌عنوان targetهای `build` استفاده می‌شوند:

| Builder                                         | هدف                                                                                                                                                                                                                                                  |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@angular/build:application`                    | یک application را با client-side bundle، یک Node server، و routeهای prerender شده در build-time با [esbuild](https://esbuild.github.io/) build می‌کند.                                                                                             |
| `@angular-devkit/build-angular:browser-esbuild` | یک client-side application را برای استفاده در browser با [esbuild](https://esbuild.github.io/) bundle می‌کند. برای اطلاعات بیشتر، [`browser-esbuild` documentation](tools/cli/build-system-migration#manual-migration-to-the-compatibility-builder) را ببینید. |
| `@angular-devkit/build-angular:browser`         | یک client-side application را برای استفاده در browser با [webpack](https://webpack.js.org/) bundle می‌کند.                                                                                                                                          |
| `@angular/build:ng-packagr`                     | یک Angular library مطابق [Angular Package Format](tools/libraries/angular-package-format) build می‌کند.                                                                                                                                            |

Applicationهایی که با `ng new` generate می‌شوند، به‌صورت پیش‌فرض از `@angular/build:application` استفاده می‌کنند.
Libraryهایی که با `ng generate library` generate می‌شوند، به‌صورت پیش‌فرض از `@angular/build:ng-packagr` استفاده می‌کنند.

می‌توانید با نگاه کردن به target مربوط به `build` در یک project مشخص، تشخیص دهید کدام builder استفاده می‌شود.

```json
{
  "projects": {
    "my-app": {
      "architect": {
        // `ng build` invokes the Architect target named `build`.
        "build": {
          "builder": "@angular/build:application",
          …
        },
        "serve": { … }
        "test": { … }
        …
      }
    }
  }
}
```

این صفحه درباره استفاده و optionهای `@angular/build:application` صحبت می‌کند.

## Output directory

نتیجه این build process به یک directory خروجی نوشته می‌شود؛ به‌صورت پیش‌فرض `dist/${PROJECT_NAME}`.

## پیکربندی size budgetها

Applicationها هرچه از نظر functionality رشد می‌کنند، از نظر size هم بزرگ‌تر می‌شوند.
CLI به شما اجازه می‌دهد size thresholdهایی را در configuration خود تنظیم کنید تا مطمئن شوید بخش‌هایی از application داخل size boundaryهایی که تعریف کرده‌اید باقی می‌مانند.

Size boundaryهای خود را در فایل configuration مربوط به CLI یعنی `angular.json`، داخل یک بخش `budgets` برای هر [configured environment](tools/cli/environments) تعریف کنید.

```json
{
  …
  "configurations": {
    "production": {
      …
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "250kb",
          "maximumError": "500kb"
        },
      ]
    }
  }
}
```

می‌توانید size budget را برای کل app و برای بخش‌های مشخص تعریف کنید.
هر budget entry یک budget از نوع مشخص را configure می‌کند.
برای مثال، budget نوع `initial` اندازه JavaScript و CSS لازم برای bootstrap کردن application را اندازه می‌گیرد که با مقدار `Initial Total` نمایش‌داده‌شده در build output summary متناظر است.
مقدارهای size را در formatهای زیر مشخص کنید:

| مقدار size      | جزئیات                                                                    |
| :-------------- | :------------------------------------------------------------------------ |
| `123` یا `123b` | size بر حسب byte.                                                         |
| `123kb`         | size بر حسب kilobyte.                                                     |
| `123mb`         | size بر حسب megabyte.                                                     |
| `12%`           | درصد size نسبت به baseline. \(برای مقدارهای baseline معتبر نیست.\)       |

وقتی یک budget را configure می‌کنید، builder زمانی warning می‌دهد یا error report می‌کند که بخش مشخصی از application به boundary size تعیین‌شده برسد یا از آن عبور کند.

هر budget entry یک JSON object با propertyهای زیر است:

| Property       | مقدار                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type           | نوع budget. یکی از این مقدارها: <table> <thead> <tr> <th> مقدار </th> <th> جزئیات </th> </tr> </thead> <tbody> <tr> <td> <code>bundle</code> </td> <td> size مربوط به یک bundle مشخص. از این type همراه <code>name</code> استفاده کنید تا برای یک bundle مشخص، از جمله lazy-loaded bundle، budget تعریف شود. </td> </tr> <tr> <td> <code>initial</code> </td> <td> size مربوط به JavaScript و CSS لازم برای bootstrap کردن application. این مقدار با <code>Initial Total</code> نمایش‌داده‌شده در build output summary متناظر است. به‌صورت پیش‌فرض در 500kb warning و در 1mb error می‌دهد. </td> </tr> <tr> <td> <code>allScript</code> </td> <td> size همه scriptها. </td> </tr> <tr> <td> <code>all</code> </td> <td> size کل application. </td> </tr> <tr> <td> <code>anyComponentStyle</code> </td> <td> size هر stylesheet مربوط به یک component. به‌صورت پیش‌فرض در 2kb warning و در 4kb error می‌دهد. </td> </tr> <tr> <td> <code>anyScript</code> </td> <td> size هر script. </td> </tr> <tr> <td> <code>any</code> </td> <td> size هر file. </td> </tr> </tbody> </table> |
| name           | نام bundle برای `type=bundle`. این همان bundle name گزارش‌شده توسط builder است، نه generated output filename.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| baseline       | size مربوط به baseline برای comparison. اگر تنظیم نشود، baseline به‌صورت پیش‌فرض `0` است و threshold valueها نسبت به همان baseline محاسبه می‌شوند.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| maximumWarning | maximum threshold برای warning نسبت به baseline.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| maximumError   | maximum threshold برای error نسبت به baseline.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| minimumWarning | minimum threshold برای warning نسبت به baseline.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| minimumError   | minimum threshold برای error نسبت به baseline.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| warning        | threshold مربوط به warning نسبت به baseline؛ هم min و هم max.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| error          | threshold مربوط به error نسبت به baseline؛ هم min و هم max.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

برای configure کردن budget برای یک lazy-loaded bundle، از `type: "bundle"` استفاده کنید و `name` را روی نام آن bundle بگذارید.

```json
{
  "budgets": [
    {
      "type": "bundle",
      "name": "admin",
      "maximumWarning": "250kb",
      "maximumError": "300kb"
    }
  ]
}
```

فیلد `name` با bundle name match می‌شود، نه emitted filename؛ بنابراین از wildcard یا regular expression patternهایی مثل `admin.*.js` استفاده نمی‌کند.

مثال زیر budgetی را نشان می‌دهد که از baseline استفاده می‌کند:

```json
{
  "type": "bundle",
  "name": "main",
  "baseline": "200kb",
  "maximumWarning": "10%",
  "maximumError": "20%"
}
```

در این مثال، builder وقتی bundle از `220kb` بزرگ‌تر شود warning می‌دهد و وقتی از `240kb` بزرگ‌تر شود error می‌دهد.

## پیکربندی CommonJS dependencyها

در سراسر application و dependencyهای آن، همیشه [ECMAScript modules](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) یا ESM native را ترجیح دهید.
ESM یک web standard و feature کامل و مشخص‌شده در JavaScript language است که پشتیبانی قوی از static analysis دارد. همین موضوع bundle optimizationها را نسبت به formatهای module دیگر قدرتمندتر می‌کند.

Angular CLI همچنین import کردن dependencyهای [CommonJS](https://nodejs.org/api/modules.html) به project شما را پشتیبانی می‌کند و این dependencyها را به‌صورت خودکار bundle می‌کند.
اما CommonJS moduleها می‌توانند مانع optimize مؤثر آن moduleها توسط bundlerها و minifierها شوند، که نتیجه‌اش bundle size بزرگ‌تر است.
برای اطلاعات بیشتر، [How CommonJS is making your bundles larger](https://web.dev/commonjs-larger-bundles) را ببینید.

Angular CLI اگر تشخیص دهد browser application شما به CommonJS moduleها وابسته است، warning خروجی می‌دهد.
وقتی با یک CommonJS dependency روبه‌رو می‌شوید، درخواست از maintainer برای پشتیبانی از ECMAScript modules، contribute کردن آن پشتیبانی توسط خودتان، یا استفاده از dependency جایگزینی که نیازهای شما را برآورده کند در نظر بگیرید.
اگر بهترین گزینه استفاده از CommonJS dependency است، می‌توانید این warningها را با اضافه کردن نام CommonJS module به option مربوط به `allowedCommonJsDependencies` در build optionهای واقع در `angular.json` disable کنید.

```json
"build": {
  "builder": "@angular/build:application",
  "options": {
     "allowedCommonJsDependencies": [
        "lodash"
     ]
     …
   }
   …
},
```

## پیکربندی browser compatibility

Angular CLI از [Browserslist](https://github.com/browserslist/browserslist) استفاده می‌کند تا compatibility با نسخه‌های مختلف browser تضمین شود.
بسته به browserهای پشتیبانی‌شده، Angular به‌صورت خودکار بعضی featureهای JavaScript و CSS را transform می‌کند تا مطمئن شود application build شده از featureی استفاده نمی‌کند که توسط browser پشتیبانی‌شده implement نشده است. با این حال، Angular CLI به‌صورت خودکار polyfill برای Web APIهای missing اضافه نمی‌کند. برای اضافه کردن polyfillها از option مربوط به `polyfills` در `angular.json` استفاده کنید.

به‌صورت پیش‌فرض، Angular CLI از configuration مربوط به `browserslist` استفاده می‌کند که با [browserهای پشتیبانی‌شده توسط Angular](reference/versions#browser-support) برای major version فعلی match است.

برای override کردن internal configuration، [`ng generate config browserslist`](cli/generate/config) را اجرا کنید؛ این command یک فایل configuration به نام `.browserslistrc` در project directory generate می‌کند که با browserهای پشتیبانی‌شده توسط Angular match است.

برای مثال‌های بیشتر درباره هدف قرار دادن browserها و versionهای مشخص، [browserslist repository](https://github.com/browserslist/browserslist) را ببینید.
از گسترش این list به browserهای بیشتر پرهیز کنید. حتی اگر application code شما compatibility گسترده‌تری داشته باشد، خود Angular ممکن است چنین compatibilityای نداشته باشد.
شما فقط باید مجموعه browserها یا versionهای موجود در این list را _کاهش_ دهید.

HELPFUL: برای نمایش browserهای compatible برای یک query مربوط به `browserslist`، از [browsersl.ist](https://browsersl.ist) استفاده کنید.

## پیکربندی Tailwind

Angular از [Tailwind CSS](https://tailwindcss.com/) پشتیبانی می‌کند؛ یک utility-first CSS framework.

برای ادغام Tailwind CSS با Angular CLI، [Using Tailwind CSS with Angular](guide/tailwind) را ببینید.

## Inline کردن Critical CSS

Angular می‌تواند definitionهای critical CSS مربوط به application شما را inline کند تا [First Contentful Paint (FCP)](https://web.dev/first-contentful-paint) بهتر شود.
این option به‌صورت پیش‌فرض enabled است. می‌توانید این inlining را در [`styles` customization options](reference/configs/workspace-config#styles-optimization-options) disable کنید.

این optimization، CSS لازم برای render کردن initial viewport را استخراج می‌کند و مستقیماً داخل HTML generated قرار می‌دهد؛ بنابراین browser می‌تواند بدون انتظار برای load شدن کامل stylesheetها، content را سریع‌تر نمایش دهد. CSS باقی‌مانده سپس در background به‌صورت asynchronous load می‌شود. Angular CLI از [Beasties](https://github.com/danielroe/beasties) برای analyze کردن HTML و styleهای application شما استفاده می‌کند.
