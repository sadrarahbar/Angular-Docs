# پیکربندی workspace انگولار

فایل `angular.json` در سطح ریشه workspace انگولار، مقادیر پیش‌فرض پیکربندی سراسر workspace و مخصوص پروژه را فراهم می‌کند. ابزارهای build و توسعه ارائه‌شده توسط Angular CLI از این مقادیر استفاده می‌کنند.
مقادیر path در پیکربندی نسبت به دایرکتوری ریشه workspace هستند.

## ساختار کلی JSON

در سطح بالای `angular.json` چند property، ‏workspace را پیکربندی می‌کنند و بخش `projects` شامل سایر گزینه‌های پیکربندی هر پروژه است.
می‌توانید مقادیر پیش‌فرض Angular CLI در سطح workspace را با مقادیر سطح پروژه بازنویسی کنید.
مقادیر پیش‌فرض سطح پروژه نیز از طریق command line قابل بازنویسی هستند.

propertyهای زیر در سطح بالای فایل workspace را پیکربندی می‌کنند.

| propertyها       | جزئیات                                                                                                                                                                      |
| :--------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `version`        | نسخه فایل پیکربندی.                                                                                                                                                         |
| `newProjectRoot` | مسیری که ابزارهایی مانند `ng generate application` یا `ng generate library` پروژه جدید را در آن ایجاد می‌کنند. مسیر می‌تواند مطلق یا نسبت به workspace باشد. پیش‌فرض `projects` است. |
| `cli`            | مجموعه گزینه‌های سفارشی‌سازی [Angular CLI](tools/cli). بخش [گزینه‌های پیکربندی Angular CLI](#angular-cli-configuration-options) را ببینید.                                  |
| `schematics`     | مجموعه [شماتیک‌هایی](tools/cli/schematics) که مقدار پیش‌فرض گزینه‌های زیرفرمان `ng generate` را برای این workspace سفارشی می‌کنند. بخش [شماتیک‌ها](#schematics) را ببینید. |
| `projects`       | برای هر application یا کتابخانه workspace یک زیربخش با گزینه‌های پیکربندی مخصوص پروژه دارد.                                                                                 |

application اولیه ساخته‌شده با `ng new app-name` زیر «projects» فهرست می‌شود.

هنگام ایجاد پروژه کتابخانه با `ng generate library`، پروژه کتابخانه نیز به بخش `projects` افزوده می‌شود.

HELPFUL: بخش `projects` فایل پیکربندی دقیقاً با ساختار فایل workspace متناظر نیست.

<!-- markdownlint-disable-next-line MD032 -->

- application اولیه ساخته‌شده با `ng new` در سطح بالای ساختار فایل workspace است.
- سایر applicationها و کتابخانه‌ها به‌طور پیش‌فرض زیر دایرکتوری `projects` هستند.

برای اطلاعات بیشتر، [ساختار فایل workspace و پروژه](reference/configs/file-structure) را ببینید.

## گزینه‌های پیکربندی Angular CLI

propertyهای زیر Angular CLI را سفارشی می‌کنند.

| property               | جزئیات                                                                                                                                                         | نوع مقدار                                    | مقدار پیش‌فرض |
| :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------- | :------------ |
| `analytics`            | داده ناشناس استفاده را با تیم انگولار به اشتراک می‌گذارد. boolean اشتراک‌گذاری را تعیین می‌کند و رشته UUID داده را با شناسه مستعار به اشتراک می‌گذارد.       | `boolean` \| `string`                        | `false`       |
| `cache`                | [cache پایدار دیسک](cli/cache) مورد استفاده [builderهای Angular CLI](tools/cli/cli-builder) را کنترل می‌کند.                                                   | [گزینه‌های Cache](#cache-options)            | `{}`          |
| `schematicCollections` | فهرست collectionهای شماتیک مورد استفاده در `ng generate`.                                                                                                      | `string[]`                                   | `[]`          |
| `packageManager`       | ابزار package manager ترجیحی.                                                                                                                                  | `npm` \| `cnpm` \| `pnpm` \| `yarn`\| `bun` | `npm`         |
| `warnings`             | warningهای مخصوص Angular CLI در console را کنترل می‌کند.                                                                                                       | [گزینه‌های Warnings](#warnings-options)      | `{}`          |

### گزینه‌های Cache

| property      | جزئیات                                                                                                                                                                                        | نوع مقدار                | مقدار پیش‌فرض    |
| :------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------- | :--------------- |
| `enabled`     | فعال بودن caching روی دیسک برای buildها را تنظیم می‌کند.                                                                                                                                       | `boolean`                | `true`           |
| `environment` | محیط فعال بودن cache دیسک را تنظیم می‌کند.<br><br>_ `ci` فقط در محیط CI.<br>_ `local` فقط _خارج_ از محیط CI.<br>\* `all` در همه‌جا caching را فعال می‌کند. | `local` \| `ci` \| `all` | `local`          |
| `path`        | دایرکتوری ذخیره نتایج cache.                                                                                                                                                                   | `string`                 | `.angular/cache` |

### گزینه‌های Warnings

| property          | جزئیات                                                                            | نوع مقدار | مقدار پیش‌فرض |
| :---------------- | :--------------------------------------------------------------------------------- | :-------- | :------------ |
| `versionMismatch` | وقتی نسخه سراسری Angular CLI جدیدتر از نسخه محلی است warning نمایش می‌دهد.        | `boolean` | `true`        |

## گزینه‌های پیکربندی پروژه

propertyهای پیکربندی سطح بالا زیر برای هر پروژه در `projects['project-name']` در دسترس‌اند.

| property      | جزئیات                                                                                                                                                                                                     | نوع مقدار                                                        | مقدار پیش‌فرض   |
| :------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------- | :-------------- |
| `root`        | دایرکتوری ریشه فایل‌های پروژه نسبت به workspace. برای application اولیه سطح بالای workspace خالی است.                                                                                                      | `string`                                                         | ندارد \(الزامی\) |
| `projectType` | یکی از «application» یا «library». application می‌تواند مستقل در مرورگر اجرا شود، اما library نمی‌تواند.                                                                                                   | `application` \| `library`                                       | ندارد \(الزامی\) |
| `sourceRoot`  | دایرکتوری ریشه فایل‌های منبع پروژه.                                                                                                                                                                         | `string`                                                         | `''`            |
| `prefix`      | رشته‌ای که انگولار هنگام تولید component، ‏directive و pipe با `ng generate` به selectorها می‌افزاید. برای شناسایی application یا feature قابل سفارشی‌سازی است.                                           | `string`                                                         | `'app'`         |
| `i18n`        | گزینه‌های internationalization پروژه. locale منبع و localeهای بیشتر برای build را تعریف می‌کند. [تعریف localeها در پیکربندی build](guide/i18n/merge#define-locales-in-the-build-configuration) را ببینید. | [گزینه‌های i18n](#i18n-options)                                 | `{}`            |
| `schematics`  | مجموعه شماتیک‌های سفارشی‌کننده مقدار پیش‌فرض زیرفرمان `ng generate` برای پروژه. بخش [شماتیک‌های تولید](#schematics) را ببینید.                                                                             | [شماتیک‌ها](#schematics)                                         | `{}`            |
| `architect`   | مقادیر پیش‌فرض پیکربندی targetهای Architect builder پروژه.                                                                                                                                                 | [پیکربندی targetهای builder](#configuring-builder-targets)       | `{}`            |

## گزینه‌های i18n

با گزینه پروژه `i18n`، ‏locale منبع application و localeهای بیشتر برای build را تعریف کنید.

| property       | جزئیات                                                                                                                       | نوع مقدار                                               | مقدار پیش‌فرض |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------ | :------------ |
| `sourceLocale` | locale مورد استفاده در کد منبع. می‌تواند شناسه locale یا [شیء پیکربندی](#sourcelocale-object) باشد.                          | `string` \| [شیء sourceLocale](#sourcelocale-object)    | `"en-US"`     |
| `locales`      | نگاشت شناسه localeها به فایل ترجمه یا [شیء پیکربندی locale](#locale-object).                                                 | `object`                                                | `{}`          |

### شیء `sourceLocale`

برای سفارشی کردن دایرکتوری خروجی یا base HREF مربوط به locale منبع، به‌جای رشته یک شیء ارسال کنید:

| property   | جزئیات                                                                                                                                    | نوع مقدار | مقدار پیش‌فرض |
| :--------- | :----------------------------------------------------------------------------------------------------------------------------------------- | :-------- | :------------ |
| `code`     | شناسه locale منبع.                                                                                                                         | `string`  | `"en-US"`     |
| `baseHref` | مقدار HTML به شکل `<base href>` را برای locale بازنویسی می‌کند. نام دایرکتوری خروجی همان کد locale می‌ماند. با `subPath` قابل استفاده نیست. | `string`  | کد locale     |
| `subPath`  | هم نام دایرکتوری خروجی و هم HTML به شکل `<base href>` را برای locale تنظیم می‌کند. با `baseHref` قابل استفاده نیست.                        | `string`  | کد locale     |

### شیء Locale

هر ورودی `locales` می‌تواند رشته path، آرایه pathها یا یک شیء باشد:

| property      | جزئیات                                                                                                                                            | نوع مقدار              | مقدار پیش‌فرض |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------- | :------------ |
| `translation` | path یا pathهای فایل ترجمه locale.                                                                                                                  | `string` \| `string[]` |               |
| `baseHref`    | مقدار HTML به شکل `<base href>` را بازنویسی می‌کند. نام دایرکتوری خروجی همان شناسه locale می‌ماند. با `subPath` قابل استفاده نیست.                 | `string`               | کد locale     |
| `subPath`     | هم نام دایرکتوری خروجی و هم HTML به شکل `<base href>` را تنظیم می‌کند. با `baseHref` قابل استفاده نیست.                                            | `string`               | کد locale     |

HELPFUL: وقتی علاوه بر baseHref باید نام دایرکتوری خروجی را تغییر دهید از `subPath` استفاده کنید؛ برای نمونه خروجی `de-DE/` به‌جای `de/`.

## شماتیک‌ها

[شماتیک‌های انگولار](tools/cli/schematics) دستورالعمل‌هایی برای تغییر پروژه با افزودن فایل جدید یا اصلاح فایل‌های موجود هستند.
با نگاشت نام شماتیک به مجموعه گزینه‌های پیش‌فرض می‌توان آن‌ها را پیکربندی کرد.

«نام» شماتیک format برابر `<schematic-package>:<schematic-name>` دارد.
شماتیک‌های زیرفرمان‌های پیش‌فرض `ng generate` در Angular CLI در package به نام [`@schematics/angular`](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/application/schema.json) جمع شده‌اند.
برای نمونه، شماتیک تولید component با `ng generate component` برابر `@schematics/angular:component` است.

fieldهای schema شماتیک با مقادیر مجاز آرگومان command line و مقادیر پیش‌فرض گزینه‌های زیرفرمان Angular CLI متناظرند.
می‌توانید فایل schema مربوط به workspace را برای تنظیم مقدار پیش‌فرض متفاوت به‌روزرسانی کنید. برای نمونه، برای غیرفعال کردن پیش‌فرض `standalone` در `ng generate component`:

```json
{
  "projects": {
    "my-app": {
      "schematics": {
        "@schematics/angular:component": {
          "standalone": false
        }
      }
    }
  }
}
```

## پیکربندی builderهای CLI

Architect ابزاری است که Angular CLI برای taskهای پیچیده مانند کامپایل و اجرای test به کار می‌برد.
Architect یک shell است که builder مشخصی را مطابق پیکربندی target برای انجام task اجرا می‌کند.
برای گسترش Angular CLI می‌توانید builder و targetهای جدید تعریف و پیکربندی کنید.
[Builderهای Angular CLI](tools/cli/cli-builder) را ببینید.

### builderها و targetهای پیش‌فرض Architect

انگولار builderهای پیش‌فرضی برای فرمان‌های مشخص یا فرمان عمومی `ng run` تعریف می‌کند.
schemaهای JSON تعریف‌کننده گزینه‌ها و مقادیر پیش‌فرض هر builder در package به نام [`@angular-devkit/build-angular`](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/builders.json) قرار دارند.
این schemaها گزینه‌های builderهای زیر را پیکربندی می‌کنند.

### پیکربندی targetهای builder

بخش `architect` در `angular.json` شامل مجموعه targetهای Architect است.
بسیاری از targetها با فرمان‌های Angular CLI اجراکننده آن‌ها متناظرند.
targetهای دیگر با `ng run` قابل اجرا هستند و می‌توانید target سفارشی خود را تعریف کنید.

هر شیء target، ‏`builder` آن target یعنی package مربوط به npm ابزار اجراشده توسط Architect را مشخص می‌کند.
هر target یک بخش `options` برای گزینه‌های پیش‌فرض و بخش `configurations` برای نام‌گذاری و تعیین پیکربندی‌های جایگزین دارد.
نمونه بخش [target مربوط به Build](#build-target) را ببینید.

| property       | جزئیات                                                                                                                                                                                   |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build`        | مقادیر پیش‌فرض گزینه‌های فرمان `ng build` را پیکربندی می‌کند. بخش [target مربوط به Build](#build-target) را ببینید.                                                                      |
| `serve`        | مقادیر پیش‌فرض build را بازنویسی و گزینه‌های بیشتر serve برای `ng serve` فراهم می‌کند. علاوه بر گزینه‌های `ng build`، گزینه‌های مرتبط با serve کردن application را می‌افزاید.          |
| `e2e`          | مقادیر پیش‌فرض build مربوط به applicationهای end-to-end testing را برای فرمان `ng e2e` بازنویسی می‌کند.                                                                                  |
| `test`         | مقادیر پیش‌فرض build مربوط به test را بازنویسی و مقادیر بیشتر اجرای test را برای `ng test` فراهم می‌کند.                                                                                  |
| `lint`         | مقادیر پیش‌فرض `ng lint` را برای تحلیل static فایل‌های منبع پروژه پیکربندی می‌کند.                                                                                                        |
| `extract-i18n` | مقادیر پیش‌فرض `ng extract-i18n` را پیکربندی می‌کند که پیام‌های بومی‌شده را از کد منبع استخراج و فایل ترجمه internationalization تولید می‌کند.                                          |

HELPFUL: همه گزینه‌های فایل پیکربندی باید به‌جای `dash-case` مورد استفاده در command line از `camelCase` استفاده کنند.

## target مربوط به Build

هر target زیر `architect` propertyهای زیر را دارد:

| property         | جزئیات                                                                                                                                                                                                         |
| :--------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `builder`        | builder مربوط به CLI برای ایجاد target با format برابر `<package-name>:<builder-name>`.                                                                                                                        |
| `options`        | گزینه‌های پیش‌فرض target مربوط به build.                                                                                                                                                                        |
| `configurations` | پیکربندی‌های جایگزین اجرای target. هر پیکربندی مقادیر پیش‌فرض محیط مورد نظر را تعیین و مقدار متناظر در `options` را بازنویسی می‌کند. بخش [پیکربندی جایگزین build](#alternate-build-configurations) را ببینید. |

برای نمونه، جهت پیکربندی build با optimization غیرفعال:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "optimization": false
          }
        }
      }
    }
  }
}
```

### پیکربندی‌های جایگزین build

Angular CLI دو پیکربندی build به نام‌های `production` و `development` دارد.
فرمان `ng build` به‌طور پیش‌فرض از `production` استفاده می‌کند که چند optimization را اعمال می‌کند:

- bundle کردن فایل‌ها
- کمینه کردن whitespace اضافی
- حذف comment و کد مرده
- minify کردن کد با نام‌های کوتاه و تغییرشکل‌یافته

می‌توانید پیکربندی جایگزین بیشتری مانند `staging` متناسب با فرایند توسعه تعریف و نام‌گذاری کنید.
برای انتخاب آن، نام را به flag مربوط به command line یعنی `--configuration` بدهید.

برای نمونه، جهت فعال بودن optimization فقط در production \(`ng build --configuration production`\):

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "optimization": false
          },
          "configurations": {
            "production": {
              "optimization": true
            }
          }
        }
      }
    }
  }
}
```

می‌توانید چند نام پیکربندی را با comma ارسال کنید.
برای نمونه، برای اعمال `staging` و `french` از `ng build --configuration staging,french` استفاده کنید.
فرمان پیکربندی‌ها را از چپ به راست parse می‌کند و اگر چند پیکربندی یک تنظیم را تغییر دهند، آخرین مقدار نهایی است.
برای نمونه اگر هر دو output path را تنظیم کنند، مقدار `french` استفاده می‌شود.

### گزینه‌های بیشتر build و test

گزینه‌های قابل پیکربندی build پیش‌فرض یا هدفمند معمولاً با گزینه‌های فرمان‌های [`ng build`](cli/build) و [`ng test`](cli/test) متناظرند.
برای جزئیات، [مرجع Angular CLI](cli) را ببینید.

| property گزینه‌ها          | جزئیات                                                                                                                                                                                                 |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `assets`                   | شیئی شامل pathهای assetهای static قابل ارائه با application. pathهای پیش‌فرض به دایرکتوری `public` پروژه اشاره دارند. بخش [پیکربندی Assets](#assets-configuration) را ببینید.                         |
| `styles`                   | آرایه‌ای از فایل‌های CSS برای افزودن به context سراسری پروژه. Angular CLI از importهای CSS و preprocessorهای اصلی پشتیبانی می‌کند. بخش [پیکربندی style و script](#styles-and-scripts-configuration). |
| `stylePreprocessorOptions` | شیئی از جفت option-value برای ارسال به style preprocessorها. بخش [پیکربندی style و script](#styles-and-scripts-configuration).                                                                          |
| `scripts`                  | شیئی شامل فایل‌های JavaScript قابل افزودن. scriptها درست مانند افزودن tag به نام `<script>` در `index.html` بارگذاری می‌شوند. بخش [پیکربندی style و script](#styles-and-scripts-configuration).       |
| `budgets`                  | نوع و threshold پیش‌فرض size budget برای کل یا بخشی از application. builder می‌تواند هنگام رسیدن یا عبور خروجی از threshold warning یا error دهد. [پیکربندی size budget](tools/cli/build#configuring-size-budgets). |
| `fileReplacements`         | شیئی شامل فایل‌ها و جایگزین‌های زمان کامپایل آن‌ها. [جایگزینی فایل مخصوص target](tools/cli/environments#configure-environment-specific-defaults) را ببینید.                                              |
| `index`                    | سند پایه HTML که application را بارگذاری می‌کند. [پیکربندی Index](#index-configuration).                                                                                                                |
| `security`                 | شیئی شامل کلید `autoCsp` که می‌تواند `true` یا `false` باشد.                                                                                                                                            |

### گزینه‌های بیشتر serve

dev-server مجموعه گزینه‌های خود را دارد که معمولاً با گزینه‌های فرمان [`ng serve`](cli/serve) متناظر هستند.

| property گزینه‌ها | جزئیات                                                                                                                                                                                                  |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowedHosts`    | آرایه hostهایی که development server به آن‌ها پاسخ می‌دهد. این گزینه، مقدار هم‌نام Vite را تنظیم می‌کند. [مستندات vite](https://vite.dev/config/server-options.html#server-allowedhosts) را ببینید. |

## مقادیر پیکربندی پیچیده

گزینه‌های `assets`، ‏`index`، ‏`outputPath`، ‏`styles` و `scripts` می‌توانند رشته path ساده یا شیئی با fieldهای مشخص باشند.
گزینه‌های `sourceMap` و `optimization` می‌توانند boolean ساده یا مقداری پیچیده در فایل پیکربندی باشند.

بخش‌های زیر نحوه استفاده از این مقادیر پیچیده را توضیح می‌دهند.

### پیکربندی Assets

هر پیکربندی target مربوط به `build` می‌تواند آرایه `assets` از فایل‌ها یا پوشه‌هایی داشته باشد که هنگام build بدون تغییر کپی می‌شوند.
به‌طور پیش‌فرض محتوای دایرکتوری `public/` کپی می‌شود.

برای خارج کردن asset، آن را از پیکربندی assets حذف کنید.

برای تنظیم دقیق‌تر، assetها را به‌جای path ساده نسبت به ریشه workspace به‌صورت شیء مشخص کنید.
شیء مشخصات asset می‌تواند fieldهای زیر را داشته باشد.

| fieldها          | جزئیات                                                                                                                                    |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| `glob`           | یک [node-glob](https://github.com/isaacs/node-glob/blob/master/README.md) که `input` را دایرکتوری پایه می‌گیرد.                           |
| `input`          | path نسبت به ریشه workspace.                                                                                                               |
| `output`         | path نسبت به `outDir`. به دلایل امنیتی Angular CLI هرگز خارج از path خروجی پروژه فایل نمی‌نویسد.                                          |
| `ignore`         | فهرست globهای قابل حذف.                                                                                                                    |
| `followSymlinks` | اجازه می‌دهد glob pattern دایرکتوری‌های symlink را دنبال و زیرپوشه آن را جست‌وجو کند. پیش‌فرض `false` است.                                |

برای نمونه، pathهای پیش‌فرض asset با شیءهای زیر با جزئیات بیشتر نمایش داده می‌شوند.

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "assets": [
              {
                "glob": "**/*",
                "input": "src/assets/",
                "output": "/assets/"
              },
              {
                "glob": "favicon.ico",
                "input": "src/",
                "output": "/"
              }
            ]
          }
        }
      }
    }
  }
}
```

نمونه زیر با field به نام `ignore` برخی فایل‌های دایرکتوری assets را از کپی شدن در build حذف می‌کند:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "assets": [
              {
                "glob": "**/*",
                "input": "src/assets/",
                "ignore": ["**/*.svg"],
                "output": "/assets/"
              }
            ]
          }
        }
      }
    }
  }
}
```

### پیکربندی style و script

هر ورودی آرایه گزینه‌های `styles` و `scripts` می‌تواند رشته path ساده یا شیئی باشد که به فایل entry-point بیشتر اشاره می‌کند.
builder مرتبط، آن فایل و dependencyهایش را هنگام build به‌صورت bundle جداگانه بارگذاری می‌کند.
در شیء پیکربندی می‌توانید با field به نام `bundleName`، ‏bundle مربوط به entry point را نام‌گذاری کنید.

bundle به‌طور پیش‌فرض inject می‌شود؛ با قرار دادن `inject` روی `false` می‌توانید آن را از injection خارج کنید.
برای نمونه، مقادیر زیر bundle شامل style و script را ایجاد و نام‌گذاری و از injection خارج می‌کنند:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "styles": [
              {
                "input": "src/external-module/styles.scss",
                "inject": false,
                "bundleName": "external-module"
              }
            ],
            "scripts": [
              {
                "input": "src/external-module/main.js",
                "inject": false,
                "bundleName": "external-module"
              }
            ]
          }
        }
      }
    }
  }
}
```

#### گزینه‌های style preprocessor

در Sass می‌توانید برای styleهای component و سراسری از قابلیت `includePaths` استفاده کنید تا pathهای پایه بیشتری برای import بررسی شوند.

برای افزودن path از گزینه `stylePreprocessorOptions` استفاده کنید:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "stylePreprocessorOptions": {
              "includePaths": ["src/style-paths"]
            }
          }
        }
      }
    }
  }
}
```

فایل‌های آن دایرکتوری مانند `src/style-paths/_variables.scss` بدون نیاز به path نسبی از هر جای پروژه قابل import هستند:

```scss
// src/app/app.scss
// A relative path works
@import '../style-paths/variables';

// But now this works as well
@import 'variables';
```

HELPFUL: اگر style یا scriptها را برای unit test نیاز دارید باید آن‌ها را به builder مربوط به `test` نیز اضافه کنید.
[استفاده از کتابخانه‌های سراسری runtime در application](tools/libraries/using-libraries#using-runtime-global-libraries-inside-your-app) را نیز ببینید.

### پیکربندی Optimization

گزینه `optimization` می‌تواند boolean یا شیئی برای تنظیم دقیق‌تر باشد.
این گزینه چند optimization را در خروجی build فعال می‌کند:

- minification مربوط به script و style
- tree-shaking
- حذف کد مرده
- [inline کردن CSS حیاتی](/tools/cli/build#critical-css-inlining)
- inline کردن font

چند گزینه برای تنظیم دقیق optimization وجود دارد.

| گزینه‌ها  | جزئیات                                                 | نوع مقدار                                                                  | مقدار پیش‌فرض |
| :-------- | :------------------------------------------------------ | :-------------------------------------------------------------------------- | :------------ |
| `scripts` | optimization خروجی scriptها را فعال می‌کند.            | `boolean`                                                                   | `true`        |
| `styles`  | optimization خروجی styleها را فعال می‌کند.             | `boolean` \| [گزینه‌های optimization مربوط به Styles](#styles-optimization-options) | `true` |
| `fonts`   | optimization مربوط به font را فعال می‌کند و به اینترنت نیاز دارد. | `boolean` \| [گزینه‌های optimization مربوط به Fonts](#fonts-optimization-options) | `true` |

#### گزینه‌های optimization مربوط به Styles

| گزینه‌ها                | جزئیات                                                                                                                       | نوع مقدار | مقدار پیش‌فرض |
| :---------------------- | :---------------------------------------------------------------------------------------------------------------------------- | :-------- | :------------ |
| `minify`                | تعریف‌های CSS را با حذف whitespace و comment اضافی، ادغام identifierها و کمینه کردن مقدارها minify می‌کند.                 | `boolean` | `true`        |
| `inlineCritical`        | تعریف‌های CSS حیاتی را برای بهبود [First Contentful Paint](https://web.dev/first-contentful-paint) استخراج و inline می‌کند. | `boolean` | `true`        |
| `removeSpecialComments` | commentهای CSS سراسری شامل `@license`، ‏`@preserve` یا شروع‌شونده با `//!` یا `/*!` را حذف می‌کند.                           | `boolean` | `true`        |

#### گزینه‌های optimization مربوط به Fonts

| گزینه‌ها | جزئیات                                                                                                                                                                                  | نوع مقدار | مقدار پیش‌فرض |
| :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------- | :------------ |
| `inline` | با inline کردن تعریف‌های CSS مربوط به Google Fonts و Adobe Fonts در فایل HTML index، ‏[requestهای مسدودکننده render](https://web.dev/render-blocking-resources) را کاهش می‌دهد. به اینترنت نیاز دارد. | `boolean` | `true` |

برای اعمال optimization به بخشی مشخص می‌توانید مقداری مانند زیر ارائه کنید:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "stylePreprocessorOptions": {
              "includePaths": ["src/style-paths"]
            }
          }
        }
      }
    }
  }
}
```

### پیکربندی Source map

گزینه builder به نام `sourceMap` می‌تواند boolean یا شیئی برای کنترل دقیق‌تر source mapهای application باشد.

| گزینه‌ها          | جزئیات                                                   | نوع مقدار | مقدار پیش‌فرض |
| :---------------- | :------------------------------------------------------- | :-------- | :------------ |
| `scripts`         | source map همه scriptها را خروجی می‌دهد.                 | `boolean` | `true`        |
| `styles`          | source map همه styleها را خروجی می‌دهد.                  | `boolean` | `true`        |
| `vendor`          | source map مربوط به packageهای vendor را resolve می‌کند. | `boolean` | `false`       |
| `hidden`          | لینک sourcemap را از JavaScript خروجی حذف می‌کند.        | `boolean` | `false`       |
| `sourcesContent`  | محتوای منبع اصلی فایل‌ها را در source map خروجی می‌دهد.  | `boolean` | `true`        |

نمونه زیر تغییر یک یا چند مقدار برای پیکربندی خروجی source map را نشان می‌دهد:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "sourceMap": {
              "scripts": true,
              "styles": false,
              "hidden": true,
              "vendor": true
            }
          }
        }
      }
    }
  }
}
```

HELPFUL: هنگام استفاده از source map مخفی، در bundle به آن‌ها reference داده نمی‌شود.
اگر فقط برای نگاشت stack trace در ابزار گزارش خطا source map می‌خواهید و نباید در developer tools مرورگر دیده شود، این حالت مفید است.
گرچه `hidden` مانع لینک شدن source map در bundle خروجی می‌شود، فرایند deployment باید از ارائه sourcemap تولیدشده در production جلوگیری کند؛ در غیر این صورت اطلاعات همچنان افشا می‌شود.

#### Source map بدون محتوای منبع

می‌توانید source map را بدون field به نام `sourcesContent` که شامل کد منبع اصلی است تولید کنید.
این کار اجازه می‌دهد برای گزارش خطای بهتر با نام‌های اصلی، source map را در production deploy کنید و هم‌زمان کد منبع را از افشا شدن محافظت کنید.

برای حذف محتوای منبع، گزینه `sourcesContent` را روی `false` قرار دهید:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "sourceMap": {
              "scripts": true,
              "styles": true,
              "sourcesContent": false
            }
          }
        }
      }
    }
  }
}
```

### پیکربندی Index

تولید HTML index مربوط به application را پیکربندی می‌کند.

گزینه `index` می‌تواند رشته یا شیئی برای تنظیم دقیق‌تر باشد.

وقتی مقدار رشته باشد، نام فایل path تعیین‌شده برای فایل تولیدشده استفاده و در ریشه path خروجی پیکربندی‌شده application ایجاد می‌شود.

#### گزینه‌های Index

| گزینه‌ها | جزئیات                                                                                                                                                 | نوع مقدار | مقدار پیش‌فرض |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------- | :------------ |
| `input`  | path فایل مورد استفاده برای HTML index تولیدشده application.                                                                                           | `string`  | ندارد \(الزامی\) |
| `output` | path خروجی فایل HTML index تولیدشده. path کامل ارائه‌شده نسبت به path خروجی پیکربندی‌شده application در نظر گرفته می‌شود.                              | `string`  | `index.html`  |

### پیکربندی path خروجی

گزینه `outputPath` می‌تواند String مورد استفاده به‌عنوان مقدار `base` یا Object برای پیکربندی دقیق‌تر باشد.

چند گزینه برای تنظیم دقیق ساختار خروجی application در دسترس است.

| گزینه‌ها  | جزئیات                                                                                                                                                   | نوع مقدار | مقدار پیش‌فرض |
| :-------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------- | :------------ |
| `base`    | path خروجی را نسبت به ریشه workspace مشخص می‌کند.                                                                                                        | `string`  |               |
| `browser` | نام دایرکتوری خروجی build مرورگر در path پایه خروجی. می‌توان آن را با اطمینان به کاربران ارائه کرد.                                                     | `string`  | `browser`     |
| `server`  | نام دایرکتوری خروجی build مربوط به server در پایه path خروجی.                                                                                            | `string`  | `server`      |
| `media`   | نام دایرکتوری خروجی فایل‌های media داخل دایرکتوری خروجی مرورگر. این فایل‌ها معمولاً در فایل‌های CSS، ‏resource نامیده می‌شوند.                         | `string`  | `media`       |
