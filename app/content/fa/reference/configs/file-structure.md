# ساختار فایل workspace و پروژه

applicationها را در context مربوط به workspace انگولار توسعه می‌دهید.
workspace شامل فایل‌های یک یا چند پروژه است.
پروژه مجموعه فایل‌هایی است که یک application یا کتابخانه قابل اشتراک‌گذاری را تشکیل می‌دهند.

فرمان `ng new` در Angular CLI یک workspace ایجاد می‌کند.

```shell
ng new my-project
```

هنگام اجرای این فرمان، CLI ‏packageهای لازم Angular npm و سایر dependencyها را در workspace جدیدی نصب می‌کند که application سطح ریشه آن _my-project_ نام دارد.

فرمان `ng new` به‌طور پیش‌فرض اسکلت application اولیه را همراه testهای end-to-end آن در سطح ریشه workspace ایجاد می‌کند.
این اسکلت یک application خوش‌آمدگویی ساده، آماده اجرا و قابل تغییر است.
application سطح ریشه هم‌نام workspace است و فایل‌های منبع آن در زیرپوشه `src/` مربوط به workspace قرار دارند.

این رفتار پیش‌فرض برای سبک توسعه معمول «multi-repo» مناسب است که هر application در workspace مخصوص خود قرار دارد.
به کاربران مبتدی و متوسط پیشنهاد می‌شود با `ng new` برای هر application یک workspace جداگانه ایجاد کنند.

انگولار از workspaceهای دارای [چندین پروژه](#multiple-projects) نیز پشتیبانی می‌کند.
این محیط توسعه برای کاربران پیشرفته‌ای که کتابخانه‌های قابل اشتراک‌گذاری می‌سازند و سازمان‌هایی که از سبک توسعه «monorepo» با یک repository و پیکربندی سراسری برای همه پروژه‌های انگولار استفاده می‌کنند مناسب است.

برای راه‌اندازی workspace از نوع monorepo، ایجاد application ریشه را رد کنید.
بخش [راه‌اندازی workspace چندپروژه‌ای](#multiple-projects) را در ادامه ببینید.

## فایل‌های پیکربندی workspace

همه پروژه‌های یک workspace در یک [پیکربندی](reference/configs/workspace-config) مشترک هستند.
سطح بالای workspace شامل فایل‌های پیکربندی سراسر workspace، فایل‌های پیکربندی application سطح ریشه و زیرپوشه‌های فایل‌های منبع و test همان application است.

| فایل‌های پیکربندی workspace | کاربرد                                                                                                                                                                                                                                     |
| :-------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.editorconfig`             | پیکربندی editorهای کد. [EditorConfig](https://editorconfig.org) را ببینید.                                                                                                                                                                  |
| `.gitignore`                | فایل‌هایی را مشخص می‌کند که عمداً track نمی‌شوند و [Git](https://git-scm.com) باید نادیده بگیرد.                                                                                                                                             |
| `README.md`                 | مستندات workspace.                                                                                                                                                                                                                          |
| `angular.json`              | پیکربندی CLI برای همه پروژه‌های workspace، شامل گزینه‌های نحوه build، ‏serve و test هر پروژه. [پیکربندی Workspace انگولار](reference/configs/workspace-config) را ببینید.                                                                   |
| `package.json`              | [dependencyهای package مربوط به npm](reference/configs/npm-packages) را که برای همه پروژه‌ها در دسترس هستند پیکربندی می‌کند. برای format و محتوای فایل، [مستندات npm](https://docs.npmjs.com/files/package.json) را ببینید.                    |
| `package-lock.json`         | اطلاعات نسخه همه packageهای نصب‌شده در `node_modules` توسط client مربوط به npm را ارائه می‌کند. [مستندات npm](https://docs.npmjs.com/files/package-lock.json) را ببینید.                                                                    |
| `src/`                      | فایل‌های منبع پروژه application سطح ریشه.                                                                                                                                                                                                   |
| `public/`                   | شامل تصویر و assetهای دیگری است که dev server به‌صورت فایل static ارائه می‌کند و هنگام build کردن application بدون تغییر کپی می‌شوند.                                                                                                      |
| `node_modules/`             | [packageهای npm](reference/configs/npm-packages) نصب‌شده برای کل workspace. ‏dependencyهای `node_modules` در سراسر workspace برای همه پروژه‌ها قابل مشاهده‌اند.                                                                             |
| `tsconfig.json`             | پیکربندی پایه [TypeScript](https://www.typescriptlang.org) برای پروژه‌های workspace. سایر فایل‌های پیکربندی از این فایل پایه ارث می‌برند. [مستندات مربوط به TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#tsconfig-bases) را ببینید. |

## فایل‌های پروژه application

فرمان CLI به نام `ng new my-app` به‌طور پیش‌فرض پوشه workspace با نام «my-app» را ایجاد و اسکلت application جدیدی در پوشه `src/` در سطح بالای workspace تولید می‌کند.
application تازه‌تولیدشده فایل‌های منبع یک module ریشه را همراه component و template ریشه دارد.

پس از آماده شدن ساختار فایل workspace می‌توانید با فرمان `ng generate` در command line قابلیت و داده به application اضافه کنید.
این application اولیه سطح ریشه، _application پیش‌فرض_ فرمان‌های CLI است؛ مگر اینکه پس از ایجاد [applicationهای بیشتر](#multiple-projects) مقدار پیش‌فرض را تغییر دهید.

در workspace تک‌application، زیرپوشه `src` مربوط به workspace شامل فایل‌های منبع \(منطق application، داده و assetها\) برای application ریشه است.
در workspace چندپروژه‌ای، پروژه‌های بیشتر در پوشه `projects` زیرپوشه‌ای به شکل `project-name/src/` با همین ساختار دارند.

### فایل‌های منبع application

فایل‌های سطح بالای `src/` از اجرای application پشتیبانی می‌کنند.
زیرپوشه‌ها شامل کد منبع application و پیکربندی مخصوص آن هستند.

| فایل‌های پشتیبان application | کاربرد                                                                                                                                                                                                    |
| :--------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`                       | شامل فایل‌های component است که منطق و داده application در آن‌ها تعریف می‌شود. جزئیات در ادامه آمده است.                                                                                                  |
| `favicon.ico`                | icon مورد استفاده application در نوار bookmark.                                                                                                                                                           |
| `index.html`                 | صفحه اصلی HTML که هنگام بازدید سایت ارائه می‌شود. CLI هنگام build کردن application همه فایل‌های JavaScript و CSS را خودکار اضافه می‌کند؛ بنابراین معمولاً لازم نیست tagهای `<script>` یا `<link>` را دستی اضافه کنید. |
| `main.ts`                    | entry point اصلی application.                                                                                                                                                                              |
| `styles.css`                 | styleهای سراسری CSS که روی کل application اعمال می‌شوند.                                                                                                                                                   |

داخل پوشه `src`، پوشه `app` شامل منطق و داده پروژه است.
componentها، templateها و styleهای انگولار در این محل قرار می‌گیرند.

| فایل‌های `src/app/`       | کاربرد                                                                                                                                                                                                                                                   |
| :------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app.config.ts`           | پیکربندی application را تعریف می‌کند و به انگولار می‌گوید چگونه application را مونتاژ کند. providerهای جدید باید اینجا declaration شوند.<br><br>_فقط هنگام استفاده از گزینه `--standalone` تولید می‌شود._                                             |
| `app.component.ts`        | component ریشه application با نام `AppComponent` را تعریف می‌کند. با افزودن component و service، view مرتبط با این component به ریشه سلسله‌مراتب view تبدیل می‌شود.                                                                                     |
| `app.component.html`      | template مربوط به HTML مرتبط با `AppComponent` را تعریف می‌کند.                                                                                                                                                                                                          |
| `app.component.css`       | stylesheet مربوط به CSS برای `AppComponent` را تعریف می‌کند.                                                                                                                                                                                                             |
| `app.component.spec.ts`   | unit test مربوط به `AppComponent` را تعریف می‌کند.                                                                                                                                                                                                                        |
| `app.module.ts`           | module ریشه با نام `AppModule` را تعریف می‌کند و به انگولار می‌گوید application را چگونه مونتاژ کند. ابتدا فقط `AppComponent` را declaration می‌کند و componentهای جدید نیز باید اینجا declaration شوند.<br><br>_فقط با گزینه `--standalone false` تولید می‌شود._ |
| `app.routes.ts`           | پیکربندی routing مربوط به application را تعریف می‌کند.                                                                                                                                                                                                                    |

### فایل‌های پیکربندی application

فایل‌های پیکربندی مخصوص application ریشه در سطح ریشه workspace قرار دارند.
در workspace چندپروژه‌ای، فایل‌های پیکربندی مخصوص پروژه در ریشه پروژه و زیر `projects/project-name/` هستند.

فایل‌های پیکربندی [TypeScript](https://www.typescriptlang.org) مخصوص پروژه از `tsconfig.json` سراسر workspace ارث می‌برند.

| فایل‌های پیکربندی مخصوص application | کاربرد                                                                                                                                                                                     |
| :---------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tsconfig.app.json`                 | [پیکربندی TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) مخصوص application، شامل [گزینه‌های کامپایلر انگولار](reference/configs/angular-compiler-options).     |
| `tsconfig.spec.json`                | [پیکربندی TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) برای testهای application.                                                                            |

## چندین پروژه

workspace چندپروژه‌ای برای سازمانی مناسب است که از یک repository و پیکربندی سراسری برای چندین پروژه انگولار استفاده می‌کند \(مدل «monorepo»\).
workspace چندپروژه‌ای از توسعه کتابخانه نیز پشتیبانی می‌کند.

### راه‌اندازی workspace چندپروژه‌ای

اگر قصد دارید چند پروژه در یک workspace داشته باشید، هنگام ایجاد workspace می‌توانید تولید application اولیه را رد کنید و نامی یکتا به workspace بدهید.
فرمان زیر workspaceای با همه فایل‌های پیکربندی سراسر workspace، اما بدون application سطح ریشه ایجاد می‌کند.

```shell
ng new my-workspace --no-create-application
```

سپس می‌توانید applicationها و کتابخانه‌هایی با نام یکتا در workspace تولید کنید.

```shell
cd my-workspace
ng generate application my-app
ng generate library my-lib
```

### ساختار فایل چندپروژه‌ای

نخستین application که به‌طور صریح تولید می‌شود، همراه سایر پروژه‌های workspace در پوشه `projects` قرار می‌گیرد.
کتابخانه‌های تازه‌تولیدشده نیز زیر `projects` اضافه می‌شوند.
وقتی پروژه‌ها را به این روش ایجاد کنید، ساختار فایل workspace کاملاً با ساختار [فایل پیکربندی workspace](reference/configs/workspace-config) یعنی `angular.json` هماهنگ است.

```markdown
my-workspace/
├── … (workspace-wide configuration files)
└── projects/ (applications and libraries)
├── my-app/ (an explicitly generated application)
│ └── … (application-specific code and configuration)
└── my-lib/ (a generated library)
└── … (library-specific code and configuration)
```

## فایل‌های پروژه کتابخانه

وقتی با CLI و فرمانی مانند `ng generate library my-lib` کتابخانه تولید می‌کنید، فایل‌های ایجادشده در پوشه `projects/` مربوط به workspace قرار می‌گیرند.
برای اطلاعات بیشتر درباره ایجاد کتابخانه، [ایجاد کتابخانه‌ها](tools/libraries/creating-libraries) را ببینید.

برخلاف application، هر کتابخانه فایل پیکربندی `package.json` مخصوص خود را دارد.

زیر پوشه `projects/`، پوشه `my-lib` شامل کد کتابخانه است.

| فایل‌های منبع کتابخانه  | کاربرد                                                                                                                                                                               |
| :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib`               | شامل منطق و داده پروژه کتابخانه است. مانند پروژه application، پروژه کتابخانه می‌تواند component، ‏service، ‏module، ‏directive و pipe داشته باشد.                                   |
| `src/public-api.ts`      | همه فایل‌هایی را مشخص می‌کند که از کتابخانه export می‌شوند.                                                                                                                          |
| `ng-package.json`       | فایل پیکربندی مورد استفاده [ng-packagr](https://github.com/ng-packagr/ng-packagr) برای build کردن کتابخانه.                                                                         |
| `package.json`          | [dependencyهای package مربوط به npm](reference/configs/npm-packages) مورد نیاز این کتابخانه را پیکربندی می‌کند.                                                                      |
| `tsconfig.lib.json`     | [پیکربندی TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) مخصوص کتابخانه، شامل [گزینه‌های کامپایلر انگولار](reference/configs/angular-compiler-options). |
| `tsconfig.lib.prod.json` | [پیکربندی TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) مخصوص کتابخانه که هنگام build کردن در حالت production استفاده می‌شود.                       |
| `tsconfig.spec.json`    | [پیکربندی TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) برای unit testهای کتابخانه.                                                                  |
