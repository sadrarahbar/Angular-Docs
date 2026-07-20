# Angular CLI builderها

تعدادی از commandهای Angular CLI یک process پیچیده را روی کد شما اجرا می‌کنند؛ مثل build، test یا serve کردن application.
این commandها از یک ابزار داخلی به نام Architect برای اجرای _CLI builderها_ استفاده می‌کنند؛ builderهایی که ابزار دیگری مثل bundler، test runner یا server را invoke می‌کنند تا task مورد نظر انجام شود.
Custom builderها می‌توانند یک task کاملاً جدید انجام دهند، یا مشخص کنند کدام third-party tool توسط command موجود استفاده شود.

این document توضیح می‌دهد CLI builderها چطور با workspace configuration file integrate می‌شوند و نشان می‌دهد چطور می‌توانید builder خودتان را بسازید.

HELPFUL: کد exampleهای استفاده‌شده در اینجا را در این [GitHub repository](https://github.com/mgechev/cli-builders-demo) پیدا کنید.

## CLI builderها

ابزار داخلی Architect کار را به handler functionهایی به نام _builder_ delegate می‌کند.
یک builder handler function دو argument دریافت می‌کند:

| Argument  | Type             |
| :-------- | :--------------- |
| `options` | `JSONObject`     |
| `context` | `BuilderContext` |

separation of concerns در اینجا همانند [schematics](tools/cli/schematics-authoring) است؛ schematics برای commandهای دیگری از CLI استفاده می‌شوند که code شما را لمس می‌کنند، مثل `ng generate`.

- object مربوط به `options` از optionها و configuration کاربر CLI فراهم می‌شود، در حالی که object مربوط به `context` به‌صورت خودکار توسط CLI Builder API فراهم می‌شود.
- علاوه بر contextual information، object مربوط به `context` دسترسی به scheduling method به نام `context.scheduleTarget()` را هم فراهم می‌کند.
  scheduler، builder handler function را با یک target configuration مشخص اجرا می‌کند.

builder handler function می‌تواند synchronous باشد و یک value برگرداند، asynchronous باشد و یک `Promise` برگرداند، یا watch کند و چند value برگرداند، یعنی یک `Observable` برگرداند.
return valueها همیشه باید از type مربوط به `BuilderOutput` باشند.
این object شامل یک فیلد Boolean به نام `success` و یک فیلد optional به نام `error` است که می‌تواند error message داشته باشد.

Angular چند builder فراهم می‌کند که CLI برای commandهایی مثل `ng build` و `ng test` از آن‌ها استفاده می‌کند.
Default target configurationهای این builderها و دیگر CLI builderهای built-in را می‌توان در بخش "architect" مربوط به [workspace configuration file](reference/configs/workspace-config)، یعنی `angular.json`، پیدا و configure کرد.
همچنین می‌توانید با ساخت builderهای خودتان Angular را extend و customize کنید و آن‌ها را مستقیماً با [`ng run` CLI command](cli/run) اجرا کنید.

### ساختار project مربوط به builder

یک builder داخل folderی به‌شکل "project" قرار می‌گیرد که از نظر ساختار شبیه Angular workspace است؛ با global configuration fileها در top level و configuration مشخص‌تر داخل source folder همراه code fileهایی که behavior را تعریف می‌کنند.
برای مثال، folder مربوط به `myBuilder` می‌تواند فایل‌های زیر را داشته باشد.

| فایل‌ها                  | هدف                                                                                                      |
| :----------------------- | :------------------------------------------------------------------------------------------------------- |
| `src/my-builder.ts`      | فایل source اصلی برای builder definition.                                                               |
| `src/my-builder.spec.ts` | فایل source برای testها.                                                                                 |
| `src/schema.json`        | definition مربوط به input optionهای builder.                                                            |
| `builders.json`          | builder definition.                                                                                      |
| `package.json`           | Dependencyها. [https://docs.npmjs.com/files/package.json](https://docs.npmjs.com/files/package.json) را ببینید. |
| `tsconfig.json`          | [TypeScript configuration](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).             |

Builderها می‌توانند روی `npm` منتشر شوند؛ [Publishing your Library](tools/libraries/creating-libraries) را ببینید.

## ساخت یک builder

به‌عنوان مثال، builderی بسازید که یک فایل را به location جدیدی copy کند.
برای ساخت builder، از function مربوط به CLI Builder یعنی `createBuilder()` استفاده کنید و یک object از نوع `Promise<BuilderOutput>` برگردانید.

<docs-code header="src/my-builder.ts (builder skeleton)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" region="builder-skeleton"/>

حالا کمی logic به آن اضافه کنیم.
کد زیر pathهای source و destination file را از user optionها می‌گیرد و فایل را از source به destination کپی می‌کند \(با استفاده از [نسخه Promise function داخلی Node.js به نام `copyFile()`](https://nodejs.org/api/fs.html#fs_fspromises_copyfile_src_dest_mode)\).
اگر copy operation شکست بخورد، یک error همراه پیامی درباره problem زیرین برمی‌گرداند.

<docs-code header="src/my-builder.ts (builder)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" region="builder"/>

### مدیریت output

به‌صورت پیش‌فرض، `copyFile()` چیزی در standard output یا error مربوط به process چاپ نمی‌کند.
اگر error رخ دهد، ممکن است سخت باشد بفهمیم builder دقیقاً هنگام رخ دادن problem قصد انجام چه کاری داشته است.
با logging کردن اطلاعات اضافه با استفاده از `Logger` API، context بیشتری اضافه کنید.
این کار همچنین اجازه می‌دهد خود builder در process جداگانه‌ای اجرا شود، حتی اگر standard output و error deactivated باشند.

می‌توانید یک instance از `Logger` را از context دریافت کنید.

<docs-code header="src/my-builder.ts (handling output)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" region="handling-output"/>

### Progress و status reporting

CLI Builder API شامل ابزارهای progress و status reporting است که می‌توانند برای بعضی functionها و interfaceها hint فراهم کنند.

برای report کردن progress، از method مربوط به `context.reportProgress()` استفاده کنید که current value، optional total، و status string را به‌عنوان argument می‌گیرد.
total می‌تواند هر عددی باشد. برای مثال، اگر می‌دانید چند فایل باید process کنید، total می‌تواند تعداد فایل‌ها باشد و current باید تعداد فایل‌های process شده تا آن لحظه باشد.
status string بدون تغییر می‌ماند مگر اینکه یک string value جدید پاس دهید.

در مثال ما، copy operation یا تمام می‌شود یا هنوز در حال اجراست؛ بنابراین نیازی به progress report نیست، اما می‌توانید status را report کنید تا parent builderی که builder ما را صدا زده بداند چه اتفاقی در جریان است.
از method مربوط به `context.reportStatus()` برای generate کردن status string با هر طولی استفاده کنید.

HELPFUL: تضمینی نیست که یک string طولانی کامل نمایش داده شود؛ ممکن است برای fit شدن در UI نمایش‌دهنده cut شود.

برای حذف status، یک string خالی پاس دهید.

<docs-code header="src/my-builder.ts (progress reporting)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" region="progress-reporting"/>

## Builder input

می‌توانید یک builder را به‌صورت غیرمستقیم از طریق commandهای CLI مثل `ng build` invoke کنید، یا مستقیماً با command مربوط به Angular CLI یعنی `ng run`.
در هر دو حالت، باید inputهای required را فراهم کنید، اما می‌توانید اجازه دهید inputهای دیگر از valueهایی استفاده کنند که برای یک _target_ مشخص، توسط یک [configuration](tools/cli/environments)، یا روی command line از قبل configure شده‌اند.

### Input validation

inputهای builder را در یک JSON schema مرتبط با همان builder تعریف می‌کنید.
مشابه schematics، ابزار Architect مقدارهای input resolve شده را داخل یک object به نام `options` جمع می‌کند و typeهای آن‌ها را قبل از پاس دادن به builder function در برابر schema validate می‌کند.

برای example builder ما، `options` باید یک `JsonObject` با دو key باشد:
یک `source` و یک `destination`، که هر دو string هستند.

می‌توانید schema زیر را برای type validation این valueها ارائه کنید.

```json {header: "schema.json"}
{
  "$schema": "http://json-schema.org/schema",
  "type": "object",
  "properties": {
    "source": {
      "type": "string"
    },
    "destination": {
      "type": "string"
    }
  }
}
```

HELPFUL: این یک example حداقلی است، اما استفاده از schema برای validation می‌تواند بسیار قدرتمند باشد.
برای اطلاعات بیشتر، [JSON schemas website](http://json-schema.org) را ببینید.

برای link کردن implementation مربوط به builder با schema و name آن، باید یک فایل _builder definition_ بسازید که بتوانید در `package.json` به آن point کنید.

فایلی به نام `builders.json` بسازید که شبیه این باشد:

```json {header: "builders.json"}
{
  "builders": {
    "copy": {
      "implementation": "./dist/my-builder.js",
      "schema": "./src/schema.json",
      "description": "Copies a file."
    }
  }
}
```

در فایل `package.json`، key مربوط به `builders` را اضافه کنید که به Architect tool می‌گوید builder definition file ما را کجا پیدا کند.

```json {header: "package.json"}
{
  "name": "@example/copy-file",
  "version": "1.0.0",
  "description": "Builder for copying files",
  "builders": "builders.json",
  "dependencies": {
    "@angular/build": "^21.2.0"
  }
}
```

نام رسمی builder ما حالا `@example/copy-file:copy` است.
بخش اول package name است و بخش دوم builder name، همان‌طور که در فایل `builders.json` مشخص شده.

این valueها روی `options.source` و `options.destination` قابل دسترسی هستند.

<docs-code header="src/my-builder.ts (report status)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" region="report-status"/>

### Target configuration

یک builder باید target تعریف‌شده‌ای داشته باشد که آن را با یک input configuration و project مشخص associate کند.

Targetها در [CLI configuration file](reference/configs/workspace-config) یعنی `angular.json` تعریف می‌شوند.
یک target مشخص می‌کند از کدام builder استفاده شود، default options configuration آن چیست، و named alternative configurationها کدام‌اند.
Architect در Angular CLI از target definition برای resolve کردن input optionها برای یک run مشخص استفاده می‌کند.

فایل `angular.json` برای هر project یک section دارد، و بخش "architect" هر project، targetهای builderهایی را configure می‌کند که توسط CLI commandهایی مثل 'build'، 'test' و 'serve' استفاده می‌شوند.
به‌عنوان مثال، command مربوط به `ng build` به‌صورت پیش‌فرض builder مربوط به `@angular/build:application` را برای انجام build task اجرا می‌کند و default option valueها را طبق چیزی که برای target مربوط به `build` در `angular.json` مشخص شده پاس می‌دهد.

```json {header: "angular.json"}
{
  "myApp": {
    "...": "...",
    "architect": {
      "build": {
        "builder": "@angular/build:application",
        "options": {
          "outputPath": "dist/myApp",
          "index": "src/index.html",
          "...": "..."
        },
        "configurations": {
          "production": {
            "fileReplacements": [
              {
                "replace": "src/environments/environment.ts",
                "with": "src/environments/environment.prod.ts"
              }
            ],
            "optimization": true,
            "outputHashing": "all",
            "...": "..."
          }
        }
      },
      "...": "..."
    }
  }
}
```

command، مجموعه default optionهایی را که در بخش "options" مشخص شده‌اند به builder پاس می‌دهد.
اگر flag مربوط به `--configuration=production` را پاس دهید، از override valueهای مشخص‌شده در configuration مربوط به `production` استفاده می‌کند.
overrideهای option بیشتر را به‌صورت جداگانه روی command line مشخص کنید.

#### Target stringها

command عمومی CLI یعنی `ng run` اولین argument خود را به‌شکل target string زیر می‌گیرد.

```shell

project:target[:configuration]

```

|               | جزئیات                                                                                                               |
| :------------ | :-------------------------------------------------------------------------------------------------------------------- |
| project       | نام Angular CLI projectی که target با آن associate شده است.                                                          |
| target        | یک named builder configuration از بخش `architect` فایل `angular.json`.                                               |
| configuration | اختیاری؛ نام یک configuration override مشخص برای target داده‌شده، همان‌طور که در فایل `angular.json` تعریف شده است. |

اگر builder شما builder دیگری را صدا بزند، ممکن است لازم باشد یک target string پاس داده‌شده را بخواند.
این string را با استفاده از utility function مربوط به `targetFromTargetString()` از `@angular-devkit/architect` به object parse کنید.

## Schedule و run

Architect builderها را به‌صورت asynchronous اجرا می‌کند.
برای invoke کردن یک builder، taskی را schedule می‌کنید تا وقتی همه configuration resolutionها کامل شدند اجرا شود.

builder function تا زمانی که scheduler یک control object از نوع `BuilderRun` برنگرداند اجرا نمی‌شود.
CLI معمولاً taskها را با صدا زدن function مربوط به `context.scheduleTarget()` schedule می‌کند و سپس input optionها را با استفاده از target definition داخل فایل `angular.json` resolve می‌کند.

Architect input optionها را برای یک target مشخص با گرفتن default options object، سپس overwrite کردن valueها از configuration، و بعد overwrite کردن بیشتر valueها از overrides objectی که به `context.scheduleTarget()` پاس داده شده resolve می‌کند.
برای Angular CLI، overrides object از command line argumentها ساخته می‌شود.

Architect مقدارهای option نهایی را در برابر schema مربوط به builder validate می‌کند.
اگر inputها معتبر باشند، Architect context را می‌سازد و builder را اجرا می‌کند.

برای اطلاعات بیشتر [Workspace Configuration](reference/configs/workspace-config) را ببینید.

HELPFUL: همچنین می‌توانید یک builder را مستقیماً از builder یا test دیگری با صدا زدن `context.scheduleBuilder()` invoke کنید.
یک object به نام `options` را مستقیماً به method پاس می‌دهید و آن option valueها بدون adjustment اضافه در برابر schema مربوط به builder validate می‌شوند.

فقط method مربوط به `context.scheduleTarget()` است که configuration و overrideها را از طریق فایل `angular.json` resolve می‌کند.

### Default architect configuration

بیایید یک فایل ساده `angular.json` بسازیم که target configurationها را در context قرار دهد.

می‌توانید builder را روی npm منتشر کنید؛ [Publishing your Library](tools/libraries/creating-libraries#publishing-your-library) را ببینید، و آن را با command زیر نصب کنید:

```shell

npm install @example/copy-file

```

اگر با `ng new builder-test` یک project جدید بسازید، فایل generated مربوط به `angular.json` چیزی شبیه زیر خواهد بود؛ فقط با default builder configurationها.

```json {header: "angular.json"}
{
  "projects": {
    "builder-test": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "outputPath": "dist/builder-test",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "src/tsconfig.app.json"
          },
          "configurations": {
            "production": {
              "optimization": true,
              "aot": true
            }
          }
        }
      }
    }
  }
}
```

### اضافه کردن target

یک target جدید اضافه کنید که builder ما را برای copy کردن یک فایل اجرا کند.
این target به builder می‌گوید فایل `package.json` را copy کند.

- یک target section جدید به object مربوط به `architect` برای project خود اضافه می‌کنیم
- targetی با نام `copy-package` از builder ما استفاده می‌کند که آن را روی `@example/copy-file` منتشر کرده‌اید.
- object مربوط به options مقدارهای default برای دو inputی که تعریف کرده‌اید فراهم می‌کند.
  - `source` - فایل موجودی که copy می‌کنید.
  - `destination` - pathی که می‌خواهید فایل در آن copy شود.

```json {header: "angular.json"}
{
  "projects": {
    "builder-test": {
      "architect": {
        "copy-package": {
          "builder": "@example/copy-file:copy",
          "options": {
            "source": "package.json",
            "destination": "package-copy.json"
          }
        }
        // Existing targets...
      }
    }
  }
}
```

### اجرای builder

برای اجرای builder ما با default configuration مربوط به target جدید، از CLI command زیر استفاده کنید.

```shell

ng run builder-test:copy-package

```

این command فایل `package.json` را به `package-copy.json` copy می‌کند.

از command-line argumentها برای override کردن defaultهای configure شده استفاده کنید.
برای مثال، برای اجرا با مقدار متفاوتی برای `destination`، از CLI command زیر استفاده کنید.

```shell

ng run builder-test:copy-package --destination=package-other.json

```

این command فایل را به‌جای `package-copy.json` در `package-other.json` copy می‌کند.
چون option مربوط به _source_ را override نکرده‌اید، همچنان از default file یعنی `package.json` copy می‌کند.

## Testing یک builder

برای builder خود از integration testing استفاده کنید تا بتوانید مثل این [example](https://github.com/mgechev/cli-builders-demo)، از Architect scheduler برای ساخت context استفاده کنید.
در builder source directory، یک test file جدید به نام `my-builder.spec.ts` بسازید. test، instanceهای جدیدی از `JsonSchemaRegistry` برای schema validation، `TestingArchitectHost` برای implementation in-memory از `ArchitectHost`، و `Architect` می‌سازد.

اینجا مثالی از testی آمده که copy file builder را اجرا می‌کند.
test از builder برای copy کردن فایل `package.json` استفاده می‌کند و validate می‌کند که محتوای فایل copied با source یکی باشد.

<docs-code header="src/my-builder.spec.ts" path="adev/src/content/examples/cli-builder/src/my-builder.spec.ts"/>

HELPFUL: هنگام اجرای این test در repo خود، به package مربوط به [`ts-node`](https://github.com/TypeStrong/ts-node) نیاز دارید.
می‌توانید با rename کردن `my-builder.spec.ts` به `my-builder.spec.js` از این نیاز جلوگیری کنید.

### Watch mode

بیشتر builderها یک بار run می‌شوند و return می‌کنند. با این حال، این behavior با builderی که تغییرات را watch می‌کند، مثل devserver، کاملاً compatible نیست.
Architect می‌تواند از watch mode پشتیبانی کند، اما چند نکته وجود دارد.

- برای استفاده با watch mode، یک builder handler function باید یک `Observable` برگرداند.
  Architect تا زمانی که `Observable` complete شود subscribe می‌ماند و اگر builder دوباره با همان argumentها schedule شود، ممکن است از آن reuse کند.

- builder باید بعد از هر execution همیشه یک object از نوع `BuilderOutput` emit کند.
  بعد از اینکه اجرا شد، می‌تواند وارد watch mode شود تا توسط external event trigger شود.
  اگر eventی آن را برای restart trigger کند، builder باید function مربوط به `context.reportRunning()` را اجرا کند تا به Architect بگوید دوباره در حال اجراست.
  این کار مانع می‌شود Architect در صورت schedule شدن run دیگر، builder را stop کند.

وقتی builder شما برای خروج از watch mode، `BuilderRun.stop()` را صدا می‌زند، Architect از `Observable` مربوط به builder unsubscribe می‌کند و teardown logic مربوط به builder را برای clean up صدا می‌زند.
این behavior همچنین اجازه می‌دهد buildهای long-running stop و clean up شوند.

به‌طور کلی، اگر builder شما یک external event را watch می‌کند، بهتر است run خود را به سه phase جدا کنید.

| Phaseها    | جزئیات                                                                                                                                                                                                                                        |
| :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Running    | task در حال انجام، مثل invoke کردن compiler. این phase وقتی تمام می‌شود که compiler finish شود و builder شما یک object از نوع `BuilderOutput` emit کند.                                                                                   |
| Watching   | بین دو run، یک external event stream را watch کنید. برای مثال، file system را برای هر change watch کنید. این phase وقتی تمام می‌شود که compiler restart شود و `context.reportRunning()` صدا زده شود.                                    |
| Completion | یا task کاملاً complete شده است، مثل compilerی که باید چند بار run شود، یا builder run متوقف شده است، با استفاده از `BuilderRun.stop()`. Architect teardown logic را اجرا می‌کند و از `Observable` مربوط به builder unsubscribe می‌کند. |

## Summary

CLI Builder API راهی فراهم می‌کند تا behavior مربوط به Angular CLI را با استفاده از builderها برای اجرای custom logic تغییر دهید.

- Builderها می‌توانند synchronous یا asynchronous باشند، یک بار execute شوند یا external eventها را watch کنند، و می‌توانند builderها یا targetهای دیگر را schedule کنند.
- Builderها option defaultهایی دارند که در configuration file مربوط به `angular.json` مشخص می‌شوند؛ این مقدارها می‌توانند توسط alternate configuration برای target و سپس توسط command line flagها overwrite شوند
- تیم Angular توصیه می‌کند برای test کردن Architect builderها از integration test استفاده کنید. از unit testها برای validate کردن logicی استفاده کنید که builder اجرا می‌کند.
- اگر builder شما یک `Observable` برمی‌گرداند، باید builder را در teardown logic همان `Observable` clean up کند.
