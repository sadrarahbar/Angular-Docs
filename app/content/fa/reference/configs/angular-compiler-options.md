# گزینه‌های کامپایلر انگولار

هنگام استفاده از [کامپایل ahead-of-time ‏(AOT)](tools/cli/aot-compiler)، با مشخص کردن گزینه‌های کامپایلر انگولار در [فایل پیکربندی TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) می‌توانید نحوه کامپایل application را کنترل کنید.

شیء گزینه‌های انگولار یعنی `angularCompilerOptions` هم‌سطح شیء `compilerOptions` است که گزینه‌های استاندارد کامپایلر TypeScript را فراهم می‌کند.

<docs-code header="tsconfig.json" path="adev/src/content/examples/angular-compiler-options/tsconfig.json" region="angular-compiler-options"/>

## ارث‌بری پیکربندی با `extends`

مانند کامپایلر TypeScript، کامپایلر AOT انگولار نیز در بخش `angularCompilerOptions` فایل پیکربندی TypeScript از `extends` پشتیبانی می‌کند.
property به نام `extends` در سطح بالای فایل و هم‌سطح `compilerOptions` و `angularCompilerOptions` قرار دارد.

پیکربندی TypeScript می‌تواند با property به نام `extends` تنظیمات را از فایل دیگری به ارث ببرد.
ابتدا گزینه‌های پیکربندی فایل پایه بارگذاری می‌شوند و سپس فایل پیکربندی ارث‌بر آن‌ها را بازنویسی می‌کند.

برای نمونه:

<docs-code header="tsconfig.app.json" path="adev/src/content/examples/angular-compiler-options/tsconfig.app.json" region="angular-compiler-options-app"/>

برای اطلاعات بیشتر، [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) را ببینید.

## گزینه‌های template

گزینه‌های زیر برای پیکربندی کامپایلر AOT انگولار در دسترس هستند.

### `annotationsAs`

نحوه خروجی دادن annotationهای مخصوص انگولار را برای بهبود tree-shaking تغییر می‌دهد.
annotationهای غیر انگولار تحت تأثیر قرار نمی‌گیرند.
یکی از مقادیر `static fields` یا `decorators` را می‌پذیرد. مقدار پیش‌فرض `static fields` است.

- کامپایلر به‌طور پیش‌فرض decoratorها را با یک static field در class جایگزین می‌کند تا tree-shakerهای پیشرفته مانند [Closure compiler](https://github.com/google/closure-compiler) بتوانند classهای استفاده‌نشده را حذف کنند
- مقدار `decorators`، ‏decoratorها را در محل خود باقی می‌گذارد و کامپایل را سریع‌تر می‌کند.
  TypeScript فراخوانی‌های helper به نام `__decorate` را خروجی می‌دهد.
  برای reflection در runtime از `--emitDecoratorMetadata` استفاده کنید.

  HELPFUL: کد حاصل نمی‌تواند به‌درستی tree-shake شود.

### `annotateForClosureCompiler`

<!-- vale Angular.Angular_Spelling = NO -->

وقتی `true` باشد، با [Tsickle](https://github.com/angular/tsickle)، ‏JavaScript خروجی با commentهای [JSDoc](https://jsdoc.app) مورد نیاز [Closure Compiler](https://github.com/google/closure-compiler) annotation می‌شود.
مقدار پیش‌فرض `false` است.

<!-- vale Angular.Angular_Spelling = YES -->

### `compilationMode`

حالت کامپایل مورد استفاده را مشخص می‌کند.
حالت‌های زیر در دسترس‌اند:

| حالت‌ها     | جزئیات                                                                                       |
| :---------- | :------------------------------------------------------------------------------------------- |
| `'full'`    | کد کاملاً کامپایل‌شده AOT را مطابق نسخه فعلی انگولار تولید می‌کند.                           |
| `'partial'` | کدی با format میانی و پایدار تولید می‌کند که برای کتابخانه منتشرشده مناسب است.              |

مقدار پیش‌فرض `'full'` است.

برای بیشتر applicationها، ‏`'full'` حالت کامپایل صحیح است.

برای کتابخانه‌هایی که مستقل منتشر می‌شوند، مانند packageهای npm، از `'partial'` استفاده کنید.
کامپایل‌های `'partial'` یک format میانی پایدار تولید می‌کنند که استفاده توسط applicationهای ساخته‌شده با نسخه‌های متفاوت انگولار نسبت به کتابخانه را بهتر پشتیبانی می‌کند.
کتابخانه‌هایی که در یک mono-repository و در کنار applicationهای خود با نسخه یکسان انگولار از «HEAD» ساخته می‌شوند می‌توانند از `'full'` استفاده کنند، زیرا خطر اختلاف نسخه وجود ندارد.

### `disableExpressionLowering`

وقتی مقدار پیش‌فرض آن یعنی `true` باشد، کدی را که در annotation استفاده می‌شود یا ممکن است استفاده شود تبدیل می‌کند تا امکان import آن از moduleهای template factory فراهم شود.
برای اطلاعات بیشتر [بازنویسی metadata](tools/cli/aot-compiler#metadata-rewriting) را ببینید.

وقتی `false` باشد این بازنویسی را غیرفعال می‌کند و باید بازنویسی را دستی انجام دهید.

### `disableTypeScriptVersionCheck`

وقتی `true` باشد، کامپایلر نسخه TypeScript را بررسی نمی‌کند و در صورت استفاده از نسخه پشتیبانی‌نشده TypeScript خطا گزارش نمی‌دهد.
این کار توصیه نمی‌شود، زیرا نسخه‌های پشتیبانی‌نشده TypeScript ممکن است رفتار تعریف‌نشده داشته باشند.
مقدار پیش‌فرض `false` است.

### `enableI18nLegacyMessageIdFormat`

به کامپایلر template انگولار می‌گوید برای پیام‌هایی که در template با attribute به نام `i18n` علامت‌گذاری شده‌اند ID قدیمی ایجاد کند.
برای اطلاعات بیشتر درباره علامت‌گذاری پیام‌ها برای بومی‌سازی، [علامت‌گذاری متن برای ترجمه][GuideI18nCommonPrepareMarkTextInComponentTemplate] را ببینید.

مگر اینکه پروژه به ترجمه‌هایی وابسته باشد که پیش‌تر با IDهای قدیمی ساخته شده‌اند، این گزینه را روی `false` قرار دهید.
مقدار پیش‌فرض `true` است.

ابزار استخراج پیام پیش از Ivy، ‏formatهای قدیمی متنوعی برای ID پیام‌های استخراج‌شده ایجاد می‌کرد.
این formatها مشکلاتی مانند مدیریت whitespace و وابستگی به اطلاعات داخل HTML اصلی template دارند.

format جدید پیام در برابر تغییر whitespace مقاوم‌تر است، در همه formatهای فایل ترجمه یکسان است و مستقیماً از فراخوانی‌های `$localize` تولید می‌شود.
در نتیجه پیام‌های `$localize` در کد application می‌توانند همان ID پیام‌های یکسان `i18n` در templateهای component را داشته باشند.

### `enableResourceInlining`

وقتی `true` باشد، propertyهای `templateUrl` و `styleUrls` در همه decoratorهای `@Component` را با محتوای inline در propertyهای `template` و `styles` جایگزین می‌کند.

در صورت فعال بودن، خروجی `.js` مربوط به `ngc` هیچ URL مربوط به template یا style با lazy loading ندارد.

برای پروژه‌های کتابخانه ایجادشده با Angular CLI، مقدار پیش‌فرض پیکربندی development برابر `true` است.

### `enableLegacyTemplate`

وقتی `true` باشد، element منسوخ‌شده `<template>` را به‌جای `<ng-template>` فعال می‌کند.
مقدار پیش‌فرض `false` است.
ممکن است برخی کتابخانه‌های شخص ثالث انگولار به آن نیاز داشته باشند.

### `flatModuleId`

شناسه module مورد استفاده برای import کردن یک flat module \(وقتی `flatModuleOutFile` برابر `true` است\).
referenceهای ساخته‌شده توسط کامپایلر template هنگام import نمادها از flat module از این نام module استفاده می‌کنند.
اگر `flatModuleOutFile` برابر `false` باشد نادیده گرفته می‌شود.

### `flatModuleOutFile`

وقتی `true` باشد، index مربوط به flat module را با نام فایل داده‌شده و metadata متناظر آن تولید می‌کند.
برای ایجاد flat moduleهایی استفاده می‌شود که مشابه `@angular/core` و `@angular/common` بسته‌بندی شده‌اند.
هنگام استفاده از این گزینه، `package.json` کتابخانه باید به‌جای فایل index کتابخانه به index مربوط به flat module ایجادشده اشاره کند.

فقط یک فایل `.metadata.json` تولید می‌کند که همه metadata لازم برای نمادهای exportشده از index کتابخانه را دارد.
در فایل‌های `.ngfactory.js` ایجادشده، برای import نمادها از index مربوط به flat module استفاده می‌شود؛ نمادهایی که هم API عمومی index کتابخانه و هم نمادهای داخلی پنهان را شامل می‌شوند.

به‌طور پیش‌فرض فرض می‌شود فایل `.ts` ارائه‌شده در field به نام `files` همان index کتابخانه است.
اگر بیش از یک فایل `.ts` مشخص شده باشد، `libraryIndex` فایل مورد استفاده را انتخاب می‌کند.
اگر چند فایل `.ts` بدون `libraryIndex` ارائه شوند، خطا ایجاد می‌شود.

یک index مربوط به flat module با extensionهای `.d.ts` و `.js` و نام تعیین‌شده در `flatModuleOutFile`، در همان محل فایل `.d.ts` مربوط به index کتابخانه ایجاد می‌شود.

برای نمونه، اگر کتابخانه از فایل `public_api.ts` به‌عنوان index مربوط به module استفاده کند، field به نام `files` در `tsconfig.json` برابر `["public_api.ts"]` خواهد بود.
سپس می‌توان گزینه `flatModuleOutFile` را برای نمونه روی `"index.js"` قرار داد که فایل‌های `index.d.ts` و `index.metadata.json` را تولید می‌کند.
field به نام `module` در `package.json` کتابخانه برابر `"index.js"` و field به نام `typings` برابر `"index.d.ts"` خواهد بود.

### `generateCodeForLibraries`

وقتی `true` باشد، برای فایل‌های `.d.ts` دارای فایل متناظر `.metadata.json`، فایل‌های factory \(`.ngfactory.js` و `.ngstyle.js`\) ایجاد می‌کند. مقدار پیش‌فرض `true` است.

وقتی `false` باشد، فایل‌های factory فقط برای فایل‌های `.ts` ایجاد می‌شوند.
هنگام استفاده از factory summaryها این کار را انجام دهید.

### `preserveWhitespaces`

وقتی مقدار پیش‌فرض آن یعنی `false` باشد، nodeهای متنی خالی را از templateهای کامپایل‌شده حذف می‌کند و moduleهای template factory کوچک‌تری در خروجی ایجاد می‌شوند.
برای حفظ nodeهای متنی خالی آن را روی `true` قرار دهید.

HELPFUL: هنگام استفاده از hydration پیشنهاد می‌شود مقدار پیش‌فرض `preserveWhitespaces: false` را حفظ کنید. اگر با افزودن `preserveWhitespaces: true` به tsconfig حفظ whitespace را فعال کنید، ممکن است با hydration مشکل داشته باشید. این پیکربندی هنوز به‌طور کامل پشتیبانی نمی‌شود. مطمئن شوید این مقدار در فایل‌های tsconfig سمت server و client یکسان تنظیم شده است. برای جزئیات بیشتر [راهنمای hydration](guide/hydration#preserve-whitespaces-configuration) را ببینید.

### `skipMetadataEmit`

وقتی `true` باشد فایل‌های `.metadata.json` تولید نمی‌شوند.
مقدار پیش‌فرض `false` است.

فایل‌های `.metadata.json` شامل اطلاعات مورد نیاز کامپایلر template از فایل `.ts` هستند که در فایل `.d.ts` تولیدشده توسط کامپایلر TypeScript قرار ندارند.
برای نمونه، این اطلاعات شامل محتوای annotationهایی مانند template مربوط به component است که TypeScript در فایل `.js` خروجی می‌دهد اما در فایل `.d.ts` قرار نمی‌دهد.

هنگام استفاده از factory summaryها می‌توانید آن را روی `true` قرار دهید، زیرا factory summaryها یک کپی از اطلاعات فایل `.metadata.json` دارند.

اگر از گزینه `--outFile` مربوط به TypeScript استفاده می‌کنید آن را روی `true` قرار دهید، زیرا فایل‌های metadata برای این نوع خروجی TypeScript معتبر نیستند.
جامعه انگولار استفاده از `--outFile` همراه انگولار را توصیه نمی‌کند.
در عوض از bundlerای مانند [webpack](https://webpack.js.org) استفاده کنید.

### `skipTemplateCodegen`

وقتی `true` باشد فایل‌های `.ngfactory.js` و `.ngstyle.js` را خروجی نمی‌دهد.
این گزینه بیشتر بخش‌های کامپایلر template را خاموش و گزارش عیب‌یابی template را غیرفعال می‌کند.

می‌توان با آن به کامپایلر template گفت فایل‌های `.metadata.json` را برای توزیع همراه package مربوط به `npm` تولید کند. این کار از تولید فایل‌های `.ngfactory.js` و `.ngstyle.js` که قابل توزیع در `npm` نیستند جلوگیری می‌کند.

برای پروژه‌های کتابخانه ایجادشده با Angular CLI، مقدار پیش‌فرض پیکربندی development برابر `true` است.

### `strictMetadataEmit`

وقتی `true` باشد و `"skipMetadataEmit"` برابر `false` باشد، خطا را در فایل `.metadata.json` گزارش می‌کند.
مقدار پیش‌فرض `false` است.
فقط وقتی `"skipMetadataEmit"` برابر `false` و `"skipTemplateCodegen"` برابر `true` است از آن استفاده کنید.

هدف این گزینه تأیید فایل‌های `.metadata.json` خروجی برای bundling همراه package مربوط به `npm` است.
اعتبارسنجی سخت‌گیرانه است و ممکن است برای metadataای که هنگام استفاده توسط کامپایلر template هرگز خطا ایجاد نمی‌کند، خطا منتشر کند.
می‌توانید با افزودن `@dynamic` به comment مستندساز نماد exportشده، خطای ایجادشده توسط این گزینه را suppress کنید.

وجود خطا در فایل‌های `.metadata.json` معتبر است.
اگر metadata برای تعیین محتوای annotation استفاده شود، کامپایلر template این خطاها را گزارش می‌کند.
گردآورنده metadata نمی‌تواند پیش‌بینی کند کدام نمادها برای استفاده در annotation طراحی شده‌اند؛ بنابراین از پیش error nodeها را برای نمادهای exportشده در metadata قرار می‌دهد.
سپس اگر این نمادها استفاده شوند، کامپایلر template می‌تواند با error nodeها خطا گزارش کند.

اگر مصرف‌کننده کتابخانه قصد استفاده از یک نماد در annotation را داشته باشد، کامپایلر template معمولاً آن را گزارش نمی‌کند؛ گزارش پس از استفاده واقعی نماد توسط مصرف‌کننده انجام می‌شود.
این گزینه امکان شناسایی چنین خطاهایی را هنگام مرحله build کتابخانه فراهم می‌کند و برای نمونه در تولید خود کتابخانه‌های انگولار استفاده می‌شود.

برای پروژه‌های کتابخانه ایجادشده با Angular CLI، مقدار پیش‌فرض پیکربندی development برابر `true` است.

### `strictInjectionParameters`

وقتی `true` باشد، برای پارامتر ارائه‌شده‌ای که نوع injection آن قابل تشخیص نیست خطا گزارش می‌دهد.
وقتی `false` باشد، پارامترهای constructor مربوط به classهای علامت‌گذاری‌شده با `@Injectable` که نوع آن‌ها resolve نمی‌شود warning ایجاد می‌کنند.
مقدار پیشنهادی `true` است، اما مقدار پیش‌فرض `false` است.

وقتی از فرمان Angular CLI به نام `ng new --strict` استفاده کنید، در پیکربندی پروژه ایجادشده روی `true` تنظیم می‌شود.

### `strictTemplates`

وقتی `true` باشد، [بررسی سخت‌گیرانه نوع template](tools/cli/template-typecheck#strict-mode) را فعال می‌کند.

flagهای سخت‌گیری فعال‌شده توسط این گزینه اجازه می‌دهند انواع مشخص بررسی سخت‌گیرانه نوع template را روشن یا خاموش کنید.
[رفع خطاهای template](tools/cli/template-typecheck#troubleshooting-template-errors) را ببینید.

وقتی از فرمان Angular CLI به نام `ng new --strict` استفاده کنید، در پیکربندی پروژه جدید روی `true` تنظیم می‌شود.

### `strictStandalone`

وقتی `true` باشد، اگر component، ‏directive یا pipe مستقل نباشد خطا گزارش می‌دهد.

### `trace`

وقتی `true` باشد، هنگام کامپایل templateها اطلاعات بیشتری چاپ می‌کند.
مقدار پیش‌فرض `false` است.

### `typeCheckHostBindings`

وقتی `true` باشد، بررسی نوع expressionهای موجود در object literal به نام `host` و decoratorهای `@HostBinding`/`@HostListener` مربوط به componentها و directiveها را فعال می‌کند.
مقدار پیش‌فرض `true` است.

## گزینه‌های command line

بیشتر اوقات از طریق [Angular CLI](reference/configs/angular-compiler-options) به‌طور غیرمستقیم با Angular Compiler تعامل دارید. هنگام اشکال‌زدایی برخی مشکلات ممکن است فراخوانی مستقیم Angular Compiler مفید باشد.
برای فراخوانی کامپایلر از command line می‌توانید از فرمان `ngc` ارائه‌شده توسط package مربوط به npm به نام `@angular/compiler-cli` استفاده کنید.

فرمان `ngc` یک wrapper پیرامون فرمان کامپایلر TypeScript به نام `tsc` است. Angular Compiler عمدتاً از طریق `tsconfig.json` پیکربندی می‌شود، در حالی که Angular CLI عمدتاً از طریق `angular.json` پیکربندی می‌شود.

علاوه بر فایل پیکربندی می‌توانید از [گزینه‌های command line مربوط به `tsc`](https://www.typescriptlang.org/docs/handbook/compiler-options.html) برای پیکربندی `ngc` استفاده کنید.

[GuideI18nCommonPrepareMarkTextInComponentTemplate]: guide/i18n/prepare#mark-text-in-component-template 'علامت‌گذاری متن در template مربوط به component - آماده‌سازی component برای ترجمه | Angular'
