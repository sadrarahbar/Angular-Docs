# پیکربندی application environmentها

می‌توانید برای project خود build configurationهای named مختلفی مثل `development` و `staging` تعریف کنید که defaultهای متفاوتی داشته باشند.

هر named configuration می‌تواند برای هرکدام از optionهایی که به builder targetهای مختلف اعمال می‌شوند default داشته باشد؛ مثل `build`، `serve` و `test`.
سپس commandهای `build`، `serve` و `test` در [Angular CLI](tools/cli) می‌توانند فایل‌ها را با نسخه‌های مناسب برای target environment مورد نظر شما replace کنند.

## Angular CLI configurationها

Angular CLI builderها از objectی به نام `configurations` پشتیبانی می‌کنند که اجازه می‌دهد optionهای مشخصی برای یک builder، بر اساس configurationی که در command line داده شده، overwrite شوند.

```json

{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            // By default, disable source map generation.
            "sourceMap": false
          },
          "configurations": {
            // For the `debug` configuration, enable source maps.
            "debug": {
              "sourceMap": true
            }
          }
        },
        …
      }
    }
  }
}

```

می‌توانید با option مربوط به `--configuration` انتخاب کنید از کدام configuration استفاده شود.

```shell

ng build --configuration debug

```

Configurationها می‌توانند روی هر Angular CLI builderی اعمال شوند. می‌توان چند configuration را با comma separator مشخص کرد. configurationها به‌ترتیب اعمال می‌شوند و برای optionهای دارای conflict، مقدار configuration آخر استفاده می‌شود.

```shell

ng build --configuration debug,production,customer-facing

```

## Configure کردن defaultهای مخصوص environment

`@angular/build:application` از file replacementها پشتیبانی می‌کند؛ optionی برای جایگزین کردن source fileها قبل از اجرای build.
استفاده از این قابلیت همراه `--configuration` مکانیزمی برای configure کردن data مخصوص environment در application شما فراهم می‌کند.

با [generating environments](cli/generate/environments) شروع کنید تا directory مربوط به `src/environments/` ساخته شود و project برای استفاده از file replacementها configure شود.

```shell

ng generate environments

```

directory مربوط به `src/environments/` در project شامل فایل configuration پایه، یعنی `environment.ts`، است که default configuration برای production را فراهم می‌کند.
می‌توانید default valueها را برای environmentهای اضافی، مثل `development` و `staging`، در فایل‌های configuration مخصوص target override کنید.

برای مثال:

```text

my-app/src/environments
├── environment.development.ts
├── environment.staging.ts
└── environment.ts

```

فایل پایه `environment.ts` شامل default environment settingهاست.
برای مثال:

```ts
export const environment = {
  production: true,
};
```

وقتی هیچ environmentی مشخص نشده باشد، command مربوط به `build` از این فایل به‌عنوان build target استفاده می‌کند.
می‌توانید variableهای بیشتری اضافه کنید؛ یا به‌عنوان propertyهای اضافه روی environment object، یا به‌عنوان objectهای جدا.
برای مثال، کد زیر یک default برای یک variable به default environment اضافه می‌کند:

```ts
export const environment = {
  production: true,
  apiUrl: 'http://my-prod-url',
};
```

CRITICAL: فایل‌های داخل `src/environments/` در client-side application شما bundle می‌شوند و برای هر کسی که page را load کند قابل مشاهده‌اند. هرگز secretهایی مثل API keyها را اینجا ذخیره نکنید. به‌جای آن از server-side proxy یا secrets manager استفاده کنید.

می‌توانید فایل‌های configuration مخصوص target اضافه کنید، مثل `environment.development.ts`.
محتوای زیر default valueها را برای development build target تنظیم می‌کند:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://my-dev-url',
};
```

## استفاده از variableهای مخصوص environment در app

برای استفاده از environment configurationهایی که تعریف کرده‌اید، componentهای شما باید فایل environments اصلی را import کنند:

```ts
import {environment} from './environments/environment';
```

این کار مطمئن می‌کند commandهای build و serve بتوانند configurationهای مربوط به build targetهای مشخص را پیدا کنند.

کد زیر در فایل component یعنی `app.ts` از یک environment variable تعریف‌شده در configuration fileها استفاده می‌کند.

```ts
import {environment} from './../environments/environment';

// Fetches from `http://my-prod-url` in production, `http://my-dev-url` in development.
fetch(environment.apiUrl);
```

فایل اصلی CLI configuration یعنی `angular.json` شامل بخشی به نام `fileReplacements` در configuration مربوط به هر build target است که به شما اجازه می‌دهد هر فایلی در TypeScript program را با نسخه مخصوص target از همان فایل replace کنید.
این برای include کردن کد یا variableهای مخصوص target در buildی که environment مشخصی مثل production یا staging را هدف گرفته مفید است.

به‌صورت پیش‌فرض هیچ فایلی replace نمی‌شود؛ اما `ng generate environments` این configuration را به‌صورت خودکار setup می‌کند.
می‌توانید با edit مستقیم configuration مربوط به `angular.json`، file replacementها را برای build targetهای مشخص تغییر دهید یا اضافه کنید.

```json

  "configurations": {
    "development": {
      "fileReplacements": [
          {
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environment.development.ts"
          }
        ],
        …

```

یعنی وقتی development configuration خود را با `ng build --configuration development` build می‌کنید، فایل `src/environments/environment.ts` با نسخه مخصوص target یعنی `src/environments/environment.development.ts` replace می‌شود.

برای اضافه کردن staging environment، یک copy از `src/environments/environment.ts` با نام `src/environments/environment.staging.ts` بسازید، سپس یک configuration به نام `staging` به `angular.json` اضافه کنید:

```json

  "configurations": {
    "development": { … },
    "production": { … },
    "staging": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.staging.ts"
        }
      ]
    }
  }

```

می‌توانید optionهای configuration بیشتری هم به این target environment اضافه کنید.
هر optionی که build شما پشتیبانی کند، می‌تواند در build target configuration override شود.

برای build کردن با staging configuration، command زیر را اجرا کنید:

```shell

ng build --configuration staging

```

به‌صورت پیش‌فرض، target مربوط به `build` شامل configurationهای `production` و `development` است و `ng serve` از development build مربوط به application استفاده می‌کند.
اگر option مربوط به `buildTarget` را تنظیم کنید، می‌توانید `ng serve` را هم configure کنید تا از targeted build configuration استفاده کند:

```json

  "serve": {
    "builder": "@angular/build:dev-server",
    "options": { … },
    "configurations": {
      "development": {
        // Use the `development` configuration of the `build` target.
        "buildTarget": "my-app:build:development"
      },
      "production": {
        // Use the `production` configuration of the `build` target.
        "buildTarget": "my-app:build:production"
      }
    },
    "defaultConfiguration": "development"
  },

```

option مربوط به `defaultConfiguration` مشخص می‌کند کدام configuration به‌صورت پیش‌فرض استفاده شود.
وقتی `defaultConfiguration` تنظیم نشده باشد، `options` مستقیماً و بدون تغییر استفاده می‌شوند.
