# Testing با Karma و Jasmine

با اینکه [Vitest](https://vitest.dev) برای پروژه‌های جدید Angular test runner پیش‌فرض است، [Karma](https://karma-runner.github.io) همچنان یک test runner پشتیبانی‌شده و پرکاربرد است. این راهنما دستورالعمل‌های testing برنامه Angular شما را با test runner مربوط به Karma و framework تست [Jasmine](https://jasmine.github.io) ارائه می‌کند.

## راه‌اندازی Karma و Jasmine

می‌توانید Karma و Jasmine را برای یک پروژه جدید setup کنید یا به یک پروژه موجود اضافه کنید.

### برای پروژه‌های جدید

برای ساخت یک پروژه جدید با Karma و Jasmine که از قبل configure شده‌اند، دستور `ng new` را با گزینه `--test-runner=karma` اجرا کنید:

```shell
ng new my-karma-app --test-runner=karma
```

### برای پروژه‌های موجود

برای افزودن Karma و Jasmine به یک پروژه موجود، این مراحل را دنبال کنید:

1.  **Packageهای لازم را نصب کنید:**

    <docs-code-multifile>
      <docs-code header="npm" language="shell">
        npm install --save-dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
      <docs-code header="yarn" language="shell">
        yarn add --dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
      <docs-code header="pnpm" language="shell">
        pnpm add -D karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
      <docs-code header="bun" language="shell">
        bun add --dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
    </docs-code-multifile>

2.  **test runner را در `angular.json` configure کنید:**

    در فایل `angular.json`، target مربوط به `test` را پیدا کنید و option مربوط به `runner` را روی `karma` بگذارید:

    ```json
    {
      // ...
      "projects": {
        "your-project-name": {
          // ...
          "architect": {
            "test": {
              "builder": "@angular/build:unit-test",
              "options": {
                "runner": "karma"
                // ... other options
              }
            }
          }
        }
      }
    }
    ```

3.  **برای typeهای Jasmine، `tsconfig.spec.json` را update کنید:**

    برای اینکه TypeScript functionهای testing سراسری مثل `describe` و `it` را بشناسد، `"jasmine"` را به آرایه `types` در `tsconfig.spec.json` اضافه کنید:

    ```json
    {
      // ...
      "compilerOptions": {
        // ...
        "types": ["jasmine"]
      }
      // ...
    }
    ```

## اجرای testها

پس از configure شدن پروژه، testها را با دستور [`ng test`](cli/test) اجرا کنید:

```shell
ng test
```

دستور `ng test` برنامه را در _watch mode_ build می‌کند و [test runner مربوط به Karma](https://karma-runner.github.io) را اجرا می‌کند.

خروجی console شبیه زیر است:

```shell

02 11 2022 09:08:28.605:INFO [karma-server]: Karma v6.4.1 server started at http://localhost:9876/
02 11 2022 09:08:28.607:INFO [launcher]: Launching browsers Chrome with concurrency unlimited
02 11 2022 09:08:28.620:INFO [launcher]: Starting browser Chrome
02 11 2022 09:08:31.312:INFO [Chrome]: Connected on socket -LaEYvD2R7MdcS0-AAAB with id 31534482
Chrome: Executed 3 of 3 SUCCESS (0.193 secs / 0.172 secs)
TOTAL: 3 SUCCESS

```

خروجی test با استفاده از [Karma Jasmine HTML Reporter](https://github.com/dfederm/karma-jasmine-html-reporter) در مرورگر نمایش داده می‌شود.

<img alt="Jasmine HTML Reporter in the browser" src="assets/images/guide/testing/initial-jasmine-html-reporter.png">

روی یک ردیف test کلیک کنید تا فقط همان test دوباره اجرا شود، یا روی یک description کلیک کنید تا testهای گروه test انتخاب‌شده \("test suite"\) دوباره اجرا شوند.

در همین زمان، دستور `ng test` تغییرات را watch می‌کند. برای دیدن این رفتار، تغییر کوچکی در یک source file بدهید و ذخیره کنید. testها دوباره اجرا می‌شوند، مرورگر refresh می‌شود و نتیجه‌های جدید test ظاهر می‌شوند.

## Configuration

Angular CLI، configuration مربوط به Jasmine و Karma را برای شما مدیریت می‌کند. این configuration کامل را بر اساس optionهای مشخص‌شده در فایل `angular.json` در memory می‌سازد.

### سفارشی کردن Karma Configuration

اگر می‌خواهید Karma را سفارشی کنید، می‌توانید با اجرای دستور زیر یک `karma.conf.js` بسازید:

```shell
ng generate config karma
```

HELPFUL: درباره Karma configuration در [راهنمای Karma configuration](http://karma-runner.github.io/6.4/config/configuration-file.html) بیشتر بخوانید.

### تنظیم Test Runner در `angular.json`

برای اینکه Karma را صریحاً به عنوان test runner پروژه خود تنظیم کنید، target مربوط به `test` را در فایل `angular.json` پیدا کنید و option مربوط به `runner` را روی `karma` بگذارید:

```json
{
  // ...
  "projects": {
    "your-project-name": {
      // ...
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "runner": "karma"
            // ... other options
          }
        }
      }
    }
  }
}
```

## اجباری کردن code coverage

برای enforce کردن حداقل سطح code coverage، می‌توانید از property مربوط به `check` در بخش `coverageReporter` فایل `karma.conf.js` خود استفاده کنید.

برای مثال، برای نیاز به حداقل 80% coverage:

```javascript
coverageReporter: {
  dir: require('path').join(__dirname, './coverage/<project-name>'),
  subdir: '.',
  reporters: [
    { type: 'html' },
    { type: 'text-summary' }
  ],
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
```

این کار باعث می‌شود اگر thresholdهای coverage مشخص‌شده برآورده نشوند، اجرای test fail شود.

## Testing در continuous integration

برای اجرای testهای Karma در محیط CI، از دستور زیر استفاده کنید:

```shell
ng test --no-watch --no-progress --browsers=ChromeHeadless
```

NOTE: flagهای `--no-watch` و `--no-progress` برای Karma در محیط‌های CI حیاتی هستند تا مطمئن شوید testها یک بار اجرا می‌شوند و تمیز خارج می‌شوند. flag مربوط به `--browsers=ChromeHeadless` هم برای اجرای testها در محیط مرورگر بدون interface گرافیکی ضروری است.

## Debugging testها

اگر testهای شما همان‌طور که انتظار دارید کار نمی‌کنند، می‌توانید آن‌ها را در مرورگر inspect و debug کنید.

برای debug کردن یک برنامه با test runner مربوط به Karma:

1.  پنجره مرورگر Karma را نمایش دهید. اگر برای این مرحله کمک لازم دارید، [Set up for testing](guide/testing#set-up-for-testing) را ببینید.
2.  روی دکمه **DEBUG** کلیک کنید تا یک tab جدید مرورگر باز شود و testها دوباره اجرا شوند.
3.  **Developer Tools** مرورگر را باز کنید. در Windows، کلیدهای `Ctrl-Shift-I` را فشار دهید. در macOS، کلیدهای `Command-Option-I` را فشار دهید.
4.  بخش **Sources** را انتخاب کنید.
5.  `Control/Command-P` را فشار دهید و سپس شروع کنید به تایپ نام فایل test خود تا باز شود.
6.  در test یک breakpoint بگذارید.
7.  مرورگر را refresh کنید و ببینید چطور روی breakpoint متوقف می‌شود.

<img alt="Karma debugging" src="assets/images/guide/testing/karma-1st-spec-debug.png">
