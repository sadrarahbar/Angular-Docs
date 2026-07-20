# Code coverage

گزارش‌های code coverage به شما نشان می‌دهند کدام بخش‌های code base ممکن است توسط unit testهای شما درست test نشده باشند.

## پیش‌نیازها

برای تولید گزارش‌های code coverage با Vitest، باید package مربوط به `@vitest/coverage-v8` را نصب کنید:

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/coverage-v8
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/coverage-v8
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/coverage-v8
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/coverage-v8
  </docs-code>
</docs-code-multifile>

## تولید گزارش

برای تولید گزارش coverage، flag مربوط به `--coverage` را به دستور `ng test` اضافه کنید:

```shell
ng test --coverage
```

بعد از اجرای testها، دستور یک directory جدید به نام `coverage/` در پروژه ایجاد می‌کند. فایل `index.html` را باز کنید تا گزارشی همراه با source code و مقدارهای code coverage ببینید.

اگر می‌خواهید هر بار که test می‌کنید گزارش‌های code coverage ایجاد شوند، می‌توانید گزینه `coverage` را در فایل `angular.json` روی `true` تنظیم کنید:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "coverage": true
          }
        }
      }
    }
  }
}
```

## اجباری کردن thresholdهای code coverage

درصدهای code coverage به شما کمک می‌کنند تخمین بزنید چه مقدار از کد شما test شده است. اگر تیم شما یک حداقل برای unit test شدن تعیین کرده باشد، می‌توانید این حداقل را در configuration خود enforce کنید.

برای مثال، فرض کنید می‌خواهید code base حداقل 80% code coverage داشته باشد. برای فعال کردن این مورد، گزینه `coverageThresholds` را به فایل `angular.json` اضافه کنید:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "coverage": true,
            "coverageThresholds": {
              "statements": 80,
              "branches": 80,
              "functions": 80,
              "lines": 80
            }
          }
        }
      }
    }
  }
}
```

حالا اگر هنگام اجرای testها coverage شما از 80% پایین‌تر بیاید، دستور fail می‌شود.

## Configuration پیشرفته

می‌توانید چند گزینه دیگر coverage را در فایل `angular.json` configure کنید:

- `coverageInclude`: الگوهای Glob برای فایل‌هایی که باید در گزارش coverage وارد شوند.
- `coverageExclude`: الگوهای Glob برای فایل‌هایی که باید از گزارش coverage خارج شوند.
- `coverageReporters`: آرایه‌ای از reporterهایی که باید استفاده شوند، مثل `html`، `lcov`، `json`.
- `coverageWatermarks`: objectای که watermarkهای `[low, high]` را برای HTML reporter مشخص می‌کند و می‌تواند روی رنگ‌بندی گزارش اثر بگذارد.

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "coverage": true,
            "coverageReporters": ["html", "lcov"],
            "coverageWatermarks": {
              "statements": [50, 80],
              "branches": [50, 80],
              "functions": [50, 80],
              "lines": [50, 80]
            }
          }
        }
      }
    }
  }
}
```
