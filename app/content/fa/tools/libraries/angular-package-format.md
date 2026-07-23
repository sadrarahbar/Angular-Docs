# قالب بسته Angular

این سند قالب بسته Angular ‏(APF) را توضیح می‌دهد.
APF مشخصه‌ای ویژه Angular برای ساختار و قالب بسته‌های npm است که تمام بسته‌های رسمی Angular ‏(مانند `@angular/core` و `@angular/material`) و بیشتر کتابخانه‌های شخص ثالث Angular از آن استفاده می‌کنند.

APF باعث می‌شود بسته در بیشتر سناریوهای رایج استفاده از Angular بدون مشکل کار کند.
بسته‌های مبتنی بر APF هم با ابزارهای ارائه‌شده توسط تیم Angular و هم با اکوسیستم گسترده‌تر JavaScript سازگارند.
توصیه می‌شود توسعه‌دهندگان کتابخانه‌های شخص ثالث نیز همین قالب بسته npm را دنبال کنند.

HELPFUL: نسخه APF همراه با دیگر بخش‌های Angular تغییر می‌کند و هر نسخه major قالب بسته را بهبود می‌دهد.
نسخه‌های پیش از v13 این مشخصه را می‌توانید در این [سند Google](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview) پیدا کنید.

## چرا قالب بسته را مشخص کنیم؟

در فضای امروزی JavaScript، توسعه‌دهندگان بسته‌ها را با روش‌ها و toolchainهای گوناگون (مانند webpack،‏ Rollup و esbuild) مصرف می‌کنند.
این ابزارها ممکن است ورودی‌های متفاوتی را بفهمند یا لازم داشته باشند؛ برخی می‌توانند جدیدترین نسخه زبان ES را پردازش کنند و برخی دیگر از مصرف مستقیم نسخه قدیمی‌تر ES سود می‌برند.

قالب توزیع Angular از تمام ابزارها و workflowهای توسعه رایج پشتیبانی می‌کند و بر بهینه‌سازی‌هایی تمرکز دارد که اندازه payload برنامه را کاهش می‌دهند یا چرخه تکرار توسعه (زمان build) را سریع‌تر می‌کنند.

توسعه‌دهندگان می‌توانند برای تولید بسته‌ها در قالب بسته Angular به Angular CLI و [ng-packagr](https://github.com/ng-packagr/ng-packagr) ــ ابزار build مورد استفاده Angular CLI ــ تکیه کنند.
برای جزئیات بیشتر، راهنمای [ساخت کتابخانه‌ها](tools/libraries/creating-libraries) را ببینید.

## چیدمان فایل‌ها

مثال زیر نسخه ساده‌شده‌ای از چیدمان فایل بسته `@angular/core` را نشان می‌دهد و در ادامه کاربرد هر فایل توضیح داده می‌شود.

```markdown
node_modules/@angular/core
├── README.md
├── package.json
├── fesm2022
│ ├── core.mjs
│ ├── core.mjs.map
│ ├── testing.mjs
│ └── testing.mjs.map
└── types
│ ├── core.d.ts
│ ├── testing.d.ts
```

جدول زیر چیدمان فایل در `node_modules/@angular/core` و هدف فایل‌ها و پوشه‌ها را شرح می‌دهد:

| فایل‌ها                                                                                                                                                  | هدف                                                                                                                                                                                                            |
| :------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md`                                                                                                                                              | فایل README بسته که رابط وب npmjs از آن استفاده می‌کند.                                                                                                                                                        |
| `package.json`                                                                                                                                           | فایل اصلی `package.json` که خود بسته، تمام entry pointها و قالب‌های کد موجود را توصیف می‌کند. این فایل نگاشت `"exports"` مورد استفاده runtimeها و ابزارها برای module resolution را در بر دارد.                |
| `fesm2022/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `core.mjs.map` <br /> &nbsp;&nbsp;─ `testing.mjs` <br /> &nbsp;&nbsp;─ `testing.mjs.map` | کد تمام entry pointها در قالب مسطح‌شده ES2022 ‏(FESM)، همراه با source mapها.                                                                                                                                   |
| `types/` <br /> &nbsp;&nbsp;─ `core.d.ts` <br /> &nbsp;&nbsp;─ `testing.d.ts`                                                                            | تعریف‌های نوع bundleشده TypeScript برای تمام entry pointهای عمومی.                                                                                                                                             |

## `package.json`

فایل اصلی `package.json` شامل metadata مهم بسته است، از جمله:

- بسته را با قالب EcmaScript Module ‏(ESM) [اعلام می‌کند](#esm-declaration).
- فیلد `"exports"` را دارد که قالب‌های کد منبع موجود برای تمام entry pointها را تعریف می‌کند.
- [کلیدهایی](#legacy-resolution-keys) دارد که برای ابزارهای ناآشنا با `"exports"`، قالب‌های کد منبع موجود برای entry point اصلی `@angular/core` را تعریف می‌کنند.
  این کلیدها منسوخ تلقی می‌شوند و با گسترش پشتیبانی از `"exports"` در اکوسیستم ممکن است حذف شوند.

- وجود [side effect](#side-effects) در بسته را اعلام می‌کند.

### اعلام ESM

فایل سطح بالای `package.json` کلید زیر را دارد:

```js
{
  "type": "module"
}
```

این کلید به resolverها اطلاع می‌دهد که کد درون بسته به‌جای moduleهای CommonJS از EcmaScript Module استفاده می‌کند.

### `"exports"`

فیلد `"exports"` ساختار زیر را دارد:

```js
"exports": {
  "./schematics/*": {
    "default": "./schematics/*.js"
  },
  "./package.json": {
    "default": "./package.json"
  },
  ".": {
    "types": "./types/core.d.ts",
    "default": "./fesm2022/core.mjs"
  },
  "./testing": {
    "types": "./types/testing.d.ts",
    "default": "./fesm2022/testing.mjs"
  }
}
```

کلیدهای مهم‌تر `"."` و `"./testing"` هستند که به‌ترتیب قالب‌های کد موجود برای entry point اصلی `@angular/core` و entry point فرعی `@angular/core/testing` را تعریف می‌کنند.
قالب‌های موجود برای هر entry point عبارت‌اند از:

| قالب‌ها                       | جزئیات                                                                     |
| :--------------------------- | :------------------------------------------------------------------------- |
| Typingها (فایل‌های `.d.ts`)  | TypeScript هنگام وابستگی به یک بسته از فایل‌های `.d.ts` استفاده می‌کند.   |
| `default`                    | کد ES2022 که در یک منبع واحد مسطح شده است.                                 |

ابزارهای آگاه از این کلیدها می‌توانند قالب کد مطلوب را با اولویت از `"exports"` انتخاب کنند.

ممکن است کتابخانه‌ها بخواهند فایل‌های static دیگری مانند Sass mixin یا CSS ازپیش‌کامپایل‌شده را ارائه کنند که exportهای entry pointهای مبتنی بر JavaScript آن‌ها را پوشش نمی‌دهد.

برای اطلاعات بیشتر، [مدیریت assetها در کتابخانه](tools/libraries/creating-libraries#managing-assets-in-a-library) را ببینید.

### کلیدهای قدیمی resolution

فایل سطح بالای `package.json` علاوه بر `"exports"`، برای resolverهایی که از `"exports"` پشتیبانی نمی‌کنند، کلیدهای قدیمی module resolution را نیز تعریف می‌کند.
این کلیدها برای `@angular/core` عبارت‌اند از:

```js
{
  "module": "./fesm2022/core.mjs",
  "typings": "./types/core.d.ts",
}
```

همان‌طور که قطعه‌کد بالا نشان می‌دهد، module resolver می‌تواند با این کلیدها قالب کد مشخصی را بارگذاری کند.

### Side effectها

آخرین وظیفه `package.json` اعلام این است که بسته [side effect](#sideeffects-flag) دارد یا نه.

```js
{
  "sideEffects": false
}
```

بیشتر بسته‌های Angular نباید به side effectهای سطح بالا وابسته باشند و بنابراین باید این declaration را داشته باشند.

## entry pointها و code splitting

بسته‌های قالب بسته Angular یک entry point اصلی و صفر یا چند entry point فرعی دارند (برای مثال `@angular/common/http`).
entry pointها چند وظیفه دارند.

1. module specifierهایی را تعریف می‌کنند که کاربران کد را از آن‌ها import می‌کنند (برای مثال `@angular/core` و `@angular/core/testing`).

   کاربران معمولاً این entry pointها را گروه‌هایی مجزا از symbolها با هدف یا قابلیت متفاوت می‌بینند.

   برخی entry pointها ممکن است فقط برای هدف خاصی مانند تست استفاده شوند.
   چنین APIهایی را می‌توان از entry point اصلی جدا کرد تا احتمال استفاده تصادفی یا نادرست از آن‌ها کاهش یابد.

1. granularity قابل lazy load شدن کد را تعریف می‌کنند.

   بسیاری از ابزارهای build مدرن فقط در سطح ES Module قادر به «code splitting» یا lazy loading هستند.
   قالب بسته Angular عمدتاً برای هر entry point یک ES Module «مسطح» دارد. یعنی بیشتر ابزارهای build نمی‌توانند کد یک entry point واحد را به چند output chunk تقسیم کنند.

قاعده کلی بسته‌های APF این است که از entry point برای کوچک‌ترین مجموعه‌های ممکن از کدهای مرتبط منطقی استفاده شود.
برای مثال، بسته Angular Material هر component منطقی یا مجموعه componentها را به‌عنوان entry point جداگانه منتشر می‌کند؛ یکی برای Button، یکی برای Tabs و غیره.
در نتیجه در صورت نیاز هر component در Material می‌تواند جداگانه lazy load شود.

تمام کتابخانه‌ها به چنین granularity نیاز ندارند.
بیشتر کتابخانه‌هایی که یک هدف منطقی دارند باید به‌عنوان یک entry point منتشر شوند.
برای مثال `@angular/core` برای runtime از یک entry point استفاده می‌کند، زیرا runtime در Angular معمولاً یک موجودیت واحد است.

### resolution مربوط به entry pointهای فرعی

entry pointهای فرعی را می‌توان از طریق فیلد `"exports"` در `package.json` بسته resolve کرد.

## README.md

فایل README با قالب Markdown برای نمایش توضیحات بسته در npm و GitHub استفاده می‌شود.

نمونه محتوای README بسته @angular/core:

```html
Angular &equals;&equals;&equals;&equals;&equals;&equals;&equals; The sources for this package are in
the main [Angular](https://github.com/angular/angular) repo.Please file issues and pull requests
against that repo. License: MIT
```

## کامپایل جزئی

کتابخانه‌های قالب بسته Angular باید در حالت «کامپایل جزئی» منتشر شوند.
این حالت کامپایل `ngc`، کد کامپایل‌شده Angular را طوری تولید می‌کند که به نسخه خاصی از runtime در Angular وابسته نباشد؛ برخلاف کامپایل کامل برنامه‌ها که نسخه‌های compiler و runtime باید دقیقاً یکسان باشند.

برای کامپایل جزئی کد Angular، از flag با نام `compilationMode` در property مربوط به `angularCompilerOptions` در `tsconfig.json` استفاده کنید:

```js
{
  …
  "angularCompilerOptions": {
    "compilationMode": "partial",
  }
}
```

سپس Angular CLI در فرایند build برنامه، کد کتابخانه با کامپایل جزئی را به کد کاملاً کامپایل‌شده تبدیل می‌کند.

اگر pipeline مربوط به build شما از Angular CLI استفاده نمی‌کند، به راهنمای [مصرف کد partial ivy خارج از Angular CLI](tools/libraries/creating-libraries#consuming-partial-ivy-code-outside-the-angular-cli) مراجعه کنید.

## بهینه‌سازی‌ها

### مسطح‌سازی ES moduleها

قالب بسته Angular مشخص می‌کند کد باید با قالب ES module «مسطح‌شده» منتشر شود.
این کار زمان build برنامه‌های Angular و همچنین زمان دانلود و parse کردن bundle نهایی برنامه را به‌شکل چشمگیری کاهش می‌دهد.
مطلب عالی Nolan Lawson با عنوان [«هزینه moduleهای کوچک»](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules) را ببینید.

compiler در Angular می‌تواند فایل‌های index مربوط به ES module را تولید کند. ابزارهایی مانند Rollup می‌توانند با این فایل‌ها moduleهای مسطح را در قالب فایل _Flattened ES Module_ ‏(FESM) تولید کنند.

FESM قالب فایلی است که با مسطح‌کردن تمام ES Moduleهای قابل‌دسترسی از یک entry point در یک ES Module واحد ساخته می‌شود.
برای ساخت آن تمام importهای یک بسته دنبال می‌شوند، کد در یک فایل واحد کپی می‌شود، تمام exportهای عمومی ES حفظ و importهای private حذف می‌شوند.
بااین‌حال، FESM در برخی موارد ممکن است به chunkهای مشترک میان چند entry point وابسته باشد.

نام کوتاه FESM که _فِسوم_ تلفظ می‌شود، می‌تواند عددی مانند FESM2020 در ادامه داشته باشد.
این عدد سطح زبان JavaScript درون module را مشخص می‌کند.
بنابراین فایل FESM2022 برابر ESM+ES2022 است و عبارت‌های import/export و کد منبع ES2022 را در بر دارد.

برای تولید فایل index مربوط به ES Module مسطح‌شده، گزینه‌های زیر را در فایل tsconfig.json به‌کار ببرید:

```js
{
  "compilerOptions": {
    …
    "module": "esnext",
    "target": "es2022",
    …
  },
  "angularCompilerOptions": {
    …
    "flatModuleOutFile": "my-ui-lib.js",
    "flatModuleId": "my-ui-lib"
  }
}
```

پس از تولید فایل index (برای مثال `my-ui-lib.js`) توسط ngc، می‌توان با bundlerها و optimizerهایی مانند Rollup فایل ESM مسطح‌شده را تولید کرد.

### flag مربوط به "sideEffects"

EcmaScript Moduleها به‌طور پیش‌فرض side effect دارند: import از یک module تضمین می‌کند هر کد سطح بالای آن اجرا شود.
این رفتار اغلب نامطلوب است، زیرا بیشتر کدهای ظاهراً دارای side effect در moduleهای معمولی در واقع side effect واقعی ندارند و فقط symbolهای خاصی را تحت‌تأثیر قرار می‌دهند.
اگر آن symbolها import و استفاده نشده باشند، بهتر است در فرایند بهینه‌سازی معروف به tree-shaking حذف شوند؛ اما کد دارای side effect ممکن است مانع این کار شود.

ابزارهای build مانند webpack از flagای پشتیبانی می‌کنند که بسته‌ها با آن اعلام می‌کنند به کد دارای side effect در سطح بالای moduleهای خود وابسته نیستند؛ بنابراین ابزارها آزادی بیشتری برای tree-shake کردن کد بسته دارند.
نتیجه این بهینه‌سازی‌ها باید bundle کوچک‌تر و توزیع بهتر کد در chunkهای bundle پس از code-splitting باشد.
اگر کد شما side effect غیرمحلی داشته باشد، این بهینه‌سازی ممکن است آن را خراب کند؛ البته این وضعیت در برنامه‌های Angular رایج نیست و معمولاً نشانه طراحی نامناسب است.
توصیه می‌شود همه بسته‌ها با تنظیم property مربوط به `sideEffects` روی `false`، نبود side effect را اعلام کنند و توسعه‌دهندگان [راهنمای سبک Angular](/style-guide) را دنبال کنند که به‌طور طبیعی به کد بدون side effect غیرمحلی منجر می‌شود.

اطلاعات بیشتر: [مستندات webpack درباره side effectها](https://github.com/webpack/webpack/tree/master/examples/side-effects)

### سطح زبان ES2022

سطح زبان ES2022 اکنون سطح پیش‌فرضی است که Angular CLI و دیگر ابزارها مصرف می‌کنند.
Angular CLI هنگام build برنامه، bundle را به سطح زبانی تبدیل می‌کند که تمام مرورگرهای هدف از آن پشتیبانی می‌کنند.

### bundle کردن d.ts یا مسطح‌سازی تعریف نوع

از APF v8 توصیه می‌شود تعریف‌های TypeScript را bundle کنید.
bundle کردن تعریف‌های نوع می‌تواند سرعت کامپایل را برای کاربران به‌شکل چشمگیری افزایش دهد، به‌ویژه اگر کتابخانه شما فایل‌های منبع `.ts` زیادی داشته باشد.

Angular برای مسطح‌کردن فایل‌های `.d.ts` از [`rollup-plugin-dts`](https://github.com/Swatinem/rollup-plugin-dts) استفاده می‌کند (با `rollup` و مشابه روش ساخت فایل‌های FESM).

استفاده از rollup برای bundle کردن `.d.ts` مفید است، زیرا از code splitting میان entry pointها پشتیبانی می‌کند.
برای مثال، اگر چند entry point به یک نوع مشترک وابسته باشند، یک فایل `.d.ts` مشترک همراه با فایل‌های مسطح‌شده بزرگ‌تر `.d.ts` ایجاد می‌شود.
این رفتار مطلوب است و از تکرار نوع‌ها جلوگیری می‌کند.

### Tslib

از APF v10 توصیه می‌شود tslib را به‌عنوان dependency مستقیم entry point اصلی اضافه کنید.
دلیل این است که نسخه tslib به نسخه TypeScript مورد استفاده برای کامپایل کتابخانه وابسته است.

## مثال‌ها

<docs-pill-row>
  <docs-pill href="https://app.unpkg.com/@angular/core@21.0.6" title="بسته @angular/core"/>
  <docs-pill href="https://app.unpkg.com/@angular/material@21.0.3" title="بسته @angular/material"/>
</docs-pill-row>

## تعریف اصطلاحات

اصطلاحات زیر در سراسر این سند به‌صورت هدفمند استفاده شده‌اند.
این بخش تعریف تمام آن‌ها را برای شفافیت بیشتر ارائه می‌کند.

### بسته

کوچک‌ترین مجموعه فایل‌هایی که با هم در npm منتشر و نصب می‌شوند؛ برای مثال `@angular/core`.
این بسته شامل manifest با نام package.json، کد منبع کامپایل‌شده، فایل‌های تعریف TypeScript،‏ source map،‏ metadata و موارد دیگر است.
بسته با `npm install @angular/core` نصب می‌شود.

### Symbol

یک class،‏ function،‏ constant یا variable درون module که ممکن است از طریق export مربوط به module برای دنیای بیرون قابل‌مشاهده شده باشد.

### Module

شکل کوتاه ECMAScript Modules.
فایلی شامل عبارت‌هایی که symbolها را import و export می‌کنند.
این تعریف با تعریف module در مشخصه ECMAScript یکسان است.

### ESM

شکل کوتاه ECMAScript Modules (بخش بالا را ببینید).

### FESM

شکل کوتاه Flattened ES Modules و قالب فایلی است که با مسطح‌کردن تمام ES Moduleهای قابل‌دسترسی از یک entry point در یک ES Module واحد ایجاد می‌شود.
توجه کنید FESM معمولاً یک فایل واحد است، اما می‌تواند به chunk مشترکی وابسته باشد که با FESMهای دیگر به اشتراک گذاشته شده است.

### شناسه Module

شناسه module مورد استفاده در عبارت‌های import (برای مثال `@angular/core`).
این شناسه اغلب مستقیماً به مسیری در filesystem نگاشت می‌شود، اما به‌دلیل strategyهای متفاوت module resolution همیشه چنین نیست.

### Module specifier

یک شناسه module (بخش بالا را ببینید).

### strategy مربوط به Module resolution

algorithm مورد استفاده برای تبدیل شناسه‌های Module به مسیرهای filesystem.
Node.js یک strategy دقیقاً مشخص‌شده و پرکاربرد دارد، TypeScript از چند strategy مربوط به module resolution پشتیبانی می‌کند و [Closure Compiler](https://developers.google.com/closure/compiler) strategy دیگری دارد.

### قالب Module

مشخصه syntax مربوط به module که دست‌کم syntax مربوط به import و export از فایل را پوشش می‌دهد.
قالب‌های رایج module عبارت‌اند از CommonJS ‏(CJS که معمولاً برای برنامه‌های Node.js استفاده می‌شود) و ECMAScript Modules ‏(ESM).
قالب module فقط شیوه بسته‌بندی moduleهای منفرد را مشخص می‌کند، نه قابلیت‌های زبان JavaScript مورد استفاده در محتوای module.
به همین دلیل، تیم Angular اغلب مشخص‌کننده سطح زبان را به‌صورت پسوند قالب module به‌کار می‌برد (برای مثال ESM+ES2022 مشخص می‌کند module قالب ESM دارد و شامل کد ES2022 است).

### Bundle

artifactای به‌شکل یک فایل JS واحد که ابزار build (برای مثال [webpack](https://webpack.js.org) یا [Rollup](https://rollupjs.org)) آن را تولید می‌کند و شامل symbolهایی از یک یا چند module است.
bundleها راهکاری ویژه مرورگر برای کاهش فشار شبکه هستند که در صورت دانلود صدها یا حتی ده‌ها هزار فایل توسط مرورگر ایجاد می‌شد.
Node.js معمولاً از bundle استفاده نمی‌کند.
قالب‌های رایج bundle عبارت‌اند از UMD و System.register.

### سطح زبان

زبان کد (ES2022).
مستقل از قالب module است.

### Entry point

moduleای که برای import توسط کاربر در نظر گرفته شده است.
با یک شناسه module یکتا به آن ارجاع داده می‌شود و API عمومی مربوط به آن شناسه را export می‌کند.
`@angular/core` و `@angular/core/testing` نمونه‌هایی از آن هستند.
هر دو entry point در بسته `@angular/core` وجود دارند، اما symbolهای متفاوتی export می‌کنند.
یک بسته می‌تواند چندین entry point داشته باشد.

### Deep import

فرایند دریافت symbolها از moduleهایی که Entry Point نیستند.
شناسه این moduleها معمولاً APIهای private تلقی می‌شوند که ممکن است در طول عمر پروژه یا هنگام ساخت bundle بسته تغییر کنند.

### import سطح بالا

importای که از یک entry point می‌آید.
importهای سطح بالای موجود، API عمومی را تعریف می‌کنند و در moduleهای `"@angular/name"` مانند `@angular/core` یا `@angular/common` ارائه می‌شوند.

### Tree-shaking

فرایند شناسایی و حذف کدی که برنامه استفاده نمی‌کند؛ این فرایند با نام dead code elimination نیز شناخته می‌شود.
این بهینه‌سازی سراسری در سطح برنامه و با ابزارهایی مانند [Rollup](https://rollupjs.org)،‏ [Closure Compiler](https://developers.google.com/closure/compiler) یا [Terser](https://github.com/terser/terser) انجام می‌شود.

### compiler مربوط به AOT

Ahead of Time Compiler برای Angular.

### تعریف‌های نوع مسطح‌شده

تعریف‌های bundleشده TypeScript که با ابزارهایی مانند [API Extractor](https://api-extractor.com) یا [rollup-plugin-dts](https://github.com/Swatinem/rollup-plugin-dts) تولید می‌شوند.
