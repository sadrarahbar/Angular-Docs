# شماتیک‌ها برای کتابخانه‌ها

هنگام ایجاد یک کتابخانه Angular، می‌توانید شماتیک‌هایی را همراه آن ارائه و بسته‌بندی کنید که با Angular CLI یکپارچه می‌شوند.
با این شماتیک‌ها، کاربران می‌توانند برای نصب نسخه اولیه کتابخانه از `ng add`، برای ایجاد مصنوعات تعریف‌شده در کتابخانه از `ng generate` و برای تطبیق پروژه با نسخه جدیدی از کتابخانه که تغییرات ناسازگار دارد از `ng update` استفاده کنند.

هر سه نوع شماتیک می‌توانند بخشی از یک collection باشند که همراه کتابخانه بسته‌بندی می‌کنید.

## ایجاد یک collection شماتیک

برای شروع یک collection، باید فایل‌های شماتیک را ایجاد کنید.
مراحل زیر نحوه افزودن پشتیبانی اولیه را بدون تغییر هیچ‌یک از فایل‌های پروژه نشان می‌دهند.

1. در پوشه ریشه کتابخانه، پوشه‌ای به نام `schematics` ایجاد کنید.
1. در پوشه `schematics/`، برای نخستین شماتیک خود پوشه‌ای به نام `ng-add` بسازید.
1. در سطح ریشه پوشه `schematics`، فایل `collection.json` را ایجاد کنید.
1. فایل `collection.json` را ویرایش و schema اولیه collection را تعریف کنید.

   <docs-code header="projects/my-lib/schematics/collection.json (Schematics Collection)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/collection.1.json"/>
   - مسیر `$schema` نسبت به schema مربوط به collection در Angular Devkit تعیین می‌شود.
   - شیء `schematics` شماتیک‌های نام‌گذاری‌شده‌ای را توصیف می‌کند که بخشی از این collection هستند.
   - نخستین ورودی مربوط به شماتیکی با نام `ng-add` است.
     این ورودی شامل توضیحات است و به تابع factory اشاره می‌کند که هنگام اجرای شماتیک فراخوانی می‌شود.

1. در فایل `package.json` پروژه کتابخانه، یک ورودی «schematics» با مسیر فایل schema خود اضافه کنید.
   Angular CLI هنگام اجرای فرمان‌ها از این ورودی برای یافتن شماتیک‌های نام‌گذاری‌شده در collection استفاده می‌کند.

<docs-code header="projects/my-lib/package.json (Schematics Collection Reference)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json" region="collection"/>

schema اولیه‌ای که ایجاد کرده‌اید به CLI می‌گوید شماتیک پشتیبان فرمان `ng add` را کجا پیدا کند.
اکنون آماده ایجاد آن شماتیک هستید.

## فراهم کردن پشتیبانی نصب

یک شماتیک برای فرمان `ng add` می‌تواند فرایند نصب اولیه را برای کاربران بهبود دهد.
مراحل زیر این نوع شماتیک را تعریف می‌کنند.

1. به پوشه `<lib-root>/schematics/ng-add` بروید.
1. یک فایل `schema.json` برای تعریف گزینه‌های قابل پذیرش شماتیک ایجاد کنید.

   <docs-code header="projects/my-lib/schematics/ng-add/schema.json (ng-add Schema)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/ng-add/schema.json"/>

1. فایل `schema.ts` را برای تعریف interface گزینه‌های موجود در فایل `schema.json` ایجاد کنید.

   <docs-code header="projects/my-lib/schematics/ng-add/schema.ts (ng-add Schema Interface)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/ng-add/schema.ts"/>

1. فایل اصلی یعنی `index.ts` را ایجاد و کد منبع تابع factory شماتیک را اضافه کنید.

   <docs-code header="projects/my-lib/schematics/ng-add/index.ts (ng-add Rule Factory)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/ng-add/index.ts"/>

Angular CLI جدیدترین نسخه کتابخانه را به‌طور خودکار نصب می‌کند و این نمونه با افزودن `MyLibModule` به ریشه application یک گام فراتر می‌رود. تابع `addRootImport` یک callback دریافت می‌کند که باید یک بلوک کد برگرداند. می‌توانید هر کدی را داخل رشته‌ای بنویسید که با تابع `code` برچسب خورده است؛ هر نماد خارجی نیز باید با تابع `external` پوشانده شود تا import statementهای مناسب تولید شوند.

### تعریف نوع dependency

از گزینه `save` مربوط به `ng-add` استفاده کنید تا مشخص شود کتابخانه به `dependencies` یا `devDependencies` افزوده شود، یا اصلاً در فایل پیکربندی `package.json` پروژه ذخیره نشود.

<docs-code header="projects/my-lib/package.json (ng-add Reference)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json" region="ng-add"/>

مقادیر ممکن عبارت‌اند از:

| مقدارها             | جزئیات                                           |
| :------------------ | :----------------------------------------------- |
| `false`             | package را به `package.json` اضافه نمی‌کند       |
| `true`              | package را به dependencies اضافه می‌کند          |
| `"dependencies"`    | package را به dependencies اضافه می‌کند          |
| `"devDependencies"` | package را به devDependencies اضافه می‌کند       |

## ساخت شماتیک‌ها

برای بسته‌بندی شماتیک‌ها همراه کتابخانه، باید کتابخانه را طوری پیکربندی کنید که شماتیک‌ها را جداگانه بسازد و سپس آن‌ها را به bundle اضافه کند.
شماتیک‌ها را باید _پس از_ ساخت کتابخانه بسازید تا در دایرکتوری درست قرار گیرند.

- کتابخانه به یک فایل پیکربندی سفارشی TypeScript نیاز دارد که دستورالعمل‌های کامپایل شماتیک‌ها در کتابخانه توزیع‌شده را مشخص کند
- برای افزودن شماتیک‌ها به bundle کتابخانه، scriptهایی را به فایل `package.json` کتابخانه اضافه کنید

فرض کنید در workspace انگولار خود پروژه کتابخانه‌ای به نام `my-lib` دارید.
برای مشخص کردن نحوه ساخت شماتیک‌ها، در کنار فایل تولیدشده `tsconfig.lib.json` که build کتابخانه را پیکربندی می‌کند، یک فایل `tsconfig.schematics.json` اضافه کنید.

1. فایل `tsconfig.schematics.json` را ویرایش و محتوای زیر را اضافه کنید.

   <docs-code header="projects/my-lib/tsconfig.schematics.json (TypeScript Config)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/tsconfig.schematics.json"/>

   | گزینه‌ها  | جزئیات                                                                                                                |
   | :-------- | :-------------------------------------------------------------------------------------------------------------------- |
   | `rootDir` | مشخص می‌کند پوشه `schematics` شامل فایل‌های ورودی قابل کامپایل است.                                                   |
   | `outDir`  | به پوشه خروجی کتابخانه نگاشت می‌شود. به‌طور پیش‌فرض، این پوشه `dist/my-lib` در ریشه workspace شما است.                |

1. برای اطمینان از کامپایل فایل‌های منبع شماتیک در bundle کتابخانه، scriptهای زیر را به فایل `package.json` در پوشه ریشه پروژه کتابخانه \(`projects/my-lib`\) اضافه کنید.

   <docs-code header="projects/my-lib/package.json (Build Scripts)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json"/>
   - script مربوط به `build` شماتیک را با استفاده از فایل سفارشی `tsconfig.schematics.json` کامپایل می‌کند
   - script مربوط به `postbuild` پس از تکمیل script مربوط به `build` فایل‌های شماتیک را کپی می‌کند
   - هر دو script مربوط به `build` و `postbuild` به dependencyهای `copyfiles` و `typescript` نیاز دارند.
     برای نصب dependencyها، به مسیر تعریف‌شده در `devDependencies` بروید و پیش از اجرای scriptها، `npm install` را اجرا کنید.

## فراهم کردن پشتیبانی تولید

می‌توانید یک شماتیک نام‌گذاری‌شده به collection خود اضافه کنید تا کاربران بتوانند با فرمان `ng generate` یک artifact تعریف‌شده در کتابخانه را ایجاد کنند.

فرض می‌کنیم کتابخانه شما serviceای به نام `my-service` تعریف می‌کند که به مقداری راه‌اندازی نیاز دارد.
می‌خواهید کاربران بتوانند آن را با فرمان CLI زیر تولید کنند.

```shell

ng generate my-lib:my-service

```

برای شروع، در پوشه `schematics` زیرپوشه جدیدی با نام `my-service` ایجاد کنید.

### پیکربندی شماتیک جدید

هنگام افزودن یک شماتیک به collection باید در schema مربوط به collection به آن اشاره کنید و فایل‌های پیکربندی لازم را برای تعریف گزینه‌های قابل ارسال کاربر به فرمان فراهم کنید.

1. فایل `schematics/collection.json` را ویرایش کنید تا به زیرپوشه شماتیک جدید و فایل schema مشخص‌کننده ورودی‌های آن اشاره کند.

   <docs-code header="projects/my-lib/schematics/collection.json (Schematics Collection)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/collection.json"/>

1. به پوشه `<lib-root>/schematics/my-service` بروید.
1. فایل `schema.json` را ایجاد و گزینه‌های در دسترس شماتیک را تعریف کنید.

   <docs-code header="projects/my-lib/schematics/my-service/schema.json (Schematic JSON Schema)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/schema.json"/>
   - _id_: شناسه‌ای یکتا برای schema در collection.
   - _title_: توضیحی خوانا برای schema.
   - _type_: توصیف‌کننده نوع ارائه‌شده توسط propertyها.
   - _properties_: شیئی که گزینه‌های در دسترس شماتیک را تعریف می‌کند.

   هر گزینه، یک کلید را به نوع، توضیحات و alias اختیاری مرتبط می‌کند.
   نوع، شکل مقدار مورد انتظار را تعریف می‌کند و وقتی کاربر راهنمای استفاده از شماتیک را درخواست کند، توضیحات نمایش داده می‌شوند.

   برای سفارشی‌سازی بیشتر گزینه‌های شماتیک، schema مربوط به workspace را ببینید.

1. فایل `schema.ts` را ایجاد و interfaceای تعریف کنید که مقادیر گزینه‌های موجود در فایل `schema.json` را نگه دارد.

   <docs-code header="projects/my-lib/schematics/my-service/schema.ts (Schematic Interface)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/schema.ts"/>

   | گزینه‌ها | جزئیات                                                                                                                               |
   | :------- | :------------------------------------------------------------------------------------------------------------------------------------ |
   | name     | نامی که می‌خواهید برای service ایجادشده ارائه کنید.                                                                                   |
   | path     | مسیر ارائه‌شده به شماتیک را بازنویسی می‌کند. مقدار پیش‌فرض مسیر بر اساس دایرکتوری کاری فعلی است.                                     |
   | project  | پروژه مشخصی را برای اجرای شماتیک فراهم می‌کند. اگر کاربر گزینه را ارائه نکند، می‌توانید در شماتیک یک مقدار پیش‌فرض تعیین کنید.      |

### افزودن فایل‌های template

برای افزودن artifactها به پروژه، شماتیک به فایل‌های template مخصوص خود نیاز دارد.
templateهای شماتیک از syntax ویژه‌ای برای اجرای کد و جایگزینی متغیرها پشتیبانی می‌کنند.

1. داخل پوشه `schematics/my-service/` یک پوشه `files/` ایجاد کنید.
1. فایلی با نام `__name@dasherize__.service.ts.template` ایجاد کنید که template مورد استفاده برای تولید فایل‌ها را تعریف کند.
   این template یک service ایجاد می‌کند که `HttpClient` انگولار از قبل در property به نام `http` آن inject شده است.

   ```ts {header:projects/my-lib/schematics/my-service/files/__name@dasherize__.service.ts.template (Schematic Template)}

   import { Service } from '@angular/core';
   import { HttpClient } from '@angular/common/http';

   @Service()
   export class <%= classify(name) %>Service {
      private http = inject(HttpClient);
   }

   ```

   - متدهای `classify` و `dasherize` توابع کمکی‌ای هستند که شماتیک برای تبدیل template منبع و نام فایل به کار می‌برد.
   - `name` به‌عنوان یک property از تابع factory شما ارائه می‌شود.
     این همان `name` تعریف‌شده در schema است.

### افزودن تابع factory

اکنون که زیرساخت آماده است، می‌توانید تابع اصلی انجام‌دهنده تغییرات مورد نیاز در پروژه کاربر را تعریف کنید.

فریم‌ورک Schematics یک سیستم templateسازی فایل فراهم می‌کند که هم از templateهای مسیر و هم محتوا پشتیبانی می‌کند.
این سیستم بر placeholderهای تعریف‌شده داخل فایل‌ها یا مسیرهای بارگذاری‌شده در `Tree` عمل می‌کند.
سپس با مقادیر ارسال‌شده به `Rule`، آن‌ها را پر می‌کند.

برای جزئیات این ساختارهای داده و syntax، [README مربوط به Schematics](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/schematics/README.md) را ببینید.

1. فایل اصلی `index.ts` را ایجاد و کد منبع تابع factory شماتیک را اضافه کنید.
1. ابتدا تعریف‌های شماتیک مورد نیاز را import کنید.
   فریم‌ورک Schematics توابع کمکی بسیاری برای ایجاد و استفاده از ruleها هنگام اجرای شماتیک ارائه می‌کند.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Imports)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="schematics-imports"/>

1. interface تعریف‌شده schema را که اطلاعات نوع گزینه‌های شماتیک را فراهم می‌کند import کنید.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Schema Import)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="schema-imports"/>

1. برای ساخت شماتیک تولید، با یک rule factory خالی شروع کنید.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Initial Rule)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.1.ts" region="factory"/>

این rule factory، tree را بدون تغییر برمی‌گرداند.
گزینه‌ها همان مقادیری هستند که از فرمان `ng generate` ارسال شده‌اند.

## تعریف rule تولید

اکنون چارچوب لازم برای ایجاد کدی را دارید که application کاربر را واقعاً تغییر می‌دهد تا برای service تعریف‌شده در کتابخانه آماده شود.

workspace انگولاری که کاربر کتابخانه شما را در آن نصب کرده شامل چندین پروژه \(application و کتابخانه\) است.
کاربر می‌تواند پروژه را در command line مشخص کند یا اجازه دهد مقدار پیش‌فرض استفاده شود.
در هر دو حالت، کد شما باید پروژه مشخصی را که شماتیک بر آن اعمال می‌شود شناسایی کند تا بتوانید اطلاعات پیکربندی پروژه را دریافت کنید.

این کار را با شیء `Tree` ارسال‌شده به تابع factory انجام دهید.
متدهای `Tree` به شما امکان دسترسی به کل file tree در workspace را می‌دهند تا هنگام اجرای شماتیک فایل‌ها را بخوانید و بنویسید.

### دریافت پیکربندی پروژه

1. برای تعیین پروژه مقصد، از متد `workspaces.readWorkspace` برای خواندن محتوای فایل پیکربندی workspace یعنی `angular.json` استفاده کنید.
   برای استفاده از `workspaces.readWorkspace` باید یک `workspaces.WorkspaceHost` از `Tree` ایجاد کنید.
   کد زیر را به تابع factory اضافه کنید.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Schema Import)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="workspace"/>

   حتماً وجود context را بررسی کنید و خطای مناسب را صادر کنید.

1. اکنون که نام پروژه را دارید، از آن برای دریافت اطلاعات پیکربندی مخصوص پروژه استفاده کنید.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Project)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="project-info"/>

   شیء `workspace.projects` تمام اطلاعات پیکربندی مخصوص پروژه را در خود دارد.

1. مقدار `options.path` تعیین می‌کند فایل‌های template شماتیک پس از اعمال شماتیک به کجا منتقل شوند.

   گزینه `path` در schema شماتیک به‌طور پیش‌فرض با دایرکتوری کاری فعلی جایگزین می‌شود.
   اگر `path` تعریف نشده باشد، از `sourceRoot` موجود در پیکربندی پروژه همراه با `projectType` استفاده کنید.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Project Info)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="path"/>

### تعریف rule

یک `Rule` می‌تواند از فایل‌های template خارجی استفاده کند، آن‌ها را تبدیل کند و شیء `Rule` دیگری را با template تبدیل‌شده برگرداند.
از templateسازی برای تولید هر فایل سفارشی مورد نیاز شماتیک استفاده کنید.

1. کد زیر را به تابع factory اضافه کنید.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Template transform)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="template"/>

   | متدها              | جزئیات                                                                                                                                                                                                                                            |
   | :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | `apply()`          | چندین rule را روی یک source اعمال می‌کند و source تبدیل‌شده را برمی‌گرداند. این متد دو آرگومان می‌گیرد: یک source و آرایه‌ای از ruleها.                                                                                                           |
   | `url()`            | فایل‌های source را نسبت به شماتیک از فایل‌سیستم می‌خواند.                                                                                                                                                                                        |
   | `applyTemplates()` | آرگومانی از متدها و propertyهایی را می‌گیرد که می‌خواهید در دسترس template شماتیک و نام فایل‌های شماتیک قرار گیرند و یک `Rule` برمی‌گرداند. متدهای `classify()` و `dasherize()` و property به نام `name` را اینجا تعریف می‌کنید.                       |
   | `classify()`       | مقداری را می‌گیرد و آن را به حالت title case برمی‌گرداند. برای نمونه، اگر نام ارائه‌شده `my service` باشد، خروجی `MyService` است.                                                                                                                |
   | `dasherize()`      | مقداری را می‌گیرد و آن را به حالت حروف کوچک و خط‌تیره‌دار برمی‌گرداند. برای نمونه، اگر نام ارائه‌شده MyService باشد، خروجی `my-service` است.                                                                                                     |
   | `move()`           | هنگام اعمال شماتیک، فایل‌های source ارائه‌شده را به مقصد منتقل می‌کند.                                                                                                                                                                           |

1. در پایان، rule factory باید یک rule برگرداند.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Chain Rule)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="chain"/>

   متد `chain()` اجازه می‌دهد چندین rule را در یک rule واحد ترکیب کنید تا بتوانید چندین عملیات را در یک شماتیک انجام دهید.
   در اینجا فقط ruleهای template را با هر کدی که شماتیک اجرا می‌کند ادغام می‌کنید.

نمونه کامل تابع rule شماتیک زیر را ببینید.

<docs-code header="projects/my-lib/schematics/my-service/index.ts" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts"/>

برای اطلاعات بیشتر درباره ruleها و متدهای کمکی، [Ruleهای ارائه‌شده](https://github.com/angular/angular-cli/tree/main/packages/angular_devkit/schematics#provided-rules) را ببینید.

## اجرای شماتیک کتابخانه

پس از ساخت کتابخانه و شماتیک‌ها می‌توانید collection شماتیک را نصب و آن را روی پروژه اجرا کنید.
مراحل زیر نحوه تولید یک service با شماتیکی را نشان می‌دهند که پیش‌تر ایجاد کردید.

### ساخت کتابخانه و شماتیک‌ها

از ریشه workspace، فرمان `ng build` را برای کتابخانه اجرا کنید.

```shell

ng build my-lib

```

سپس برای ساخت شماتیک وارد دایرکتوری کتابخانه شوید.

```shell

cd projects/my-lib
npm run build

```

### لینک کردن کتابخانه

کتابخانه و شماتیک‌های شما بسته‌بندی می‌شوند و در پوشه `dist/my-lib` در ریشه workspace قرار می‌گیرند.
برای اجرای شماتیک باید کتابخانه را به پوشه `node_modules` لینک کنید.
از ریشه workspace، فرمان `npm link` را با مسیر کتابخانه قابل توزیع اجرا کنید.

```shell

npm link dist/my-lib

```

### اجرای شماتیک

اکنون که کتابخانه نصب شده است، شماتیک را با فرمان `ng generate` اجرا کنید.

```shell

ng generate my-lib:my-service --name my-data

```

در console می‌بینید که شماتیک اجرا و فایل `my-data.service.ts` در پوشه application ایجاد شده است.

```shell {hideCopy}

CREATE src/app/my-data.service.ts (208 bytes)

```
