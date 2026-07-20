# Unit testing

تست کردن برنامه Angular به شما کمک می‌کند مطمئن شوید برنامه همان‌طور کار می‌کند که انتظار دارید. Unit testها برای پیدا کردن زودهنگام bugها، حفظ کیفیت کد و refactor امن ضروری هستند.

NOTE: این راهنما setup پیش‌فرض testing را برای پروژه‌های جدید Angular CLI پوشش می‌دهد که از Vitest استفاده می‌کند. اگر یک پروژه موجود را از Karma مهاجرت می‌دهید، [راهنمای مهاجرت از Karma به Vitest](guide/testing/migrating-to-vitest) را ببینید. Karma همچنان پشتیبانی می‌شود؛ برای اطلاعات بیشتر، [راهنمای testing با Karma](guide/testing/karma) را ببینید.

## Set up برای testing

Angular CLI هر چیزی را که برای test کردن یک برنامه Angular با [framework تست Vitest](https://vitest.dev) لازم دارید دانلود و نصب می‌کند. پروژه‌های جدید به صورت پیش‌فرض `vitest` و `jsdom` را دارند.

Vitest unit testهای شما را در محیط Node.js اجرا می‌کند. برای شبیه‌سازی DOM مرورگر، Vitest از کتابخانه‌ای به نام `jsdom` استفاده می‌کند. این کار با حذف هزینه راه‌اندازی مرورگر، اجرای testها را سریع‌تر می‌کند. می‌توانید با نصب گزینه‌ای مثل `happy-dom` و حذف `jsdom`، آن را جایگزین کنید. در حال حاضر، `jsdom` و `happy-dom` کتابخانه‌های پشتیبانی‌شده برای شبیه‌سازی DOM هستند.

پروژه‌ای که با CLI ایجاد می‌کنید بلافاصله آماده test است. دستور [`ng test`](cli/test) را اجرا کنید:

```shell
ng test
```

دستور `ng test` برنامه را در _watch mode_ build می‌کند و [test runner مربوط به Vitest](https://vitest.dev) را اجرا می‌کند.

خروجی console شبیه این است:

```shell
 ✓ src/app/app.spec.ts (3)
   ✓ AppComponent should create the app
   ✓ AppComponent should have as title 'my-app'
   ✓ AppComponent should render title
 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  18:18:01
   Duration  2.46s (transform 615ms, setup 2ms, collect 2.21s, tests 5ms)
```

دستور `ng test` همچنین تغییرات فایل‌های شما را watch می‌کند. اگر فایلی را تغییر دهید و ذخیره کنید، testها دوباره اجرا می‌شوند.

## Configuration

Angular CLI بیشتر تنظیمات Vitest را برای شما مدیریت می‌کند. می‌توانید رفتار testها را با تغییر گزینه‌های target مربوط به `test` در فایل `angular.json` سفارشی کنید.

### گزینه‌های Angular.json

- `include`: الگوهای Glob برای فایل‌هایی که باید در testing وارد شوند. مقدار پیش‌فرض `['**/*.spec.ts', '**/*.test.ts']` است.
- `exclude`: الگوهای Glob برای فایل‌هایی که باید از testing خارج شوند.
- `setupFiles`: فهرستی از مسیرها به فایل‌های setup سراسری، مثل polyfillها یا mockهای سراسری، که پیش از testهای شما اجرا می‌شوند.
- `providersFile`: مسیر فایلی که یک آرایه پیش‌فرض از providerهای Angular را برای محیط test صادر می‌کند. این گزینه برای setup کردن providerهای سراسری test که داخل testها inject می‌شوند مفید است.
- `coverage`: یک boolean برای فعال یا غیرفعال کردن گزارش code coverage. مقدار پیش‌فرض `false` است.
- `browsers`: آرایه‌ای از نام مرورگرها برای اجرای testها در مرورگر واقعی، مثل `["chromium"]`. نیاز دارد یک browser provider نصب شده باشد. برای جزئیات بیشتر، بخش [اجرای testها در مرورگر](#running-tests-in-a-browser) را ببینید.

### Global test setup و providerها

گزینه‌های `setupFiles` و `providersFile` برای مدیریت configuration سراسری test بسیار کاربردی هستند.

برای مثال، می‌توانید یک فایل `src/test-providers.ts` بسازید تا `provideHttpClientTesting` را برای همه testها فراهم کند:

```typescript {header: "src/test-providers.ts"}
import {EnvironmentProviders, Provider} from '@angular/core';
import {provideHttpClientTesting} from '@angular/common/http/testing';

const testProviders: (Provider | EnvironmentProviders)[] = [provideHttpClientTesting()];

export default testProviders;
```

سپس این فایل را در `angular.json` ارجاع می‌دهید:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "providersFile": "src/test-providers.ts"
          }
        }
      }
    }
  }
}
```

HELPFUL: هنگام ساخت فایل‌های TypeScript جدید برای test setup یا providerها، مثل `src/test-providers.ts`، مطمئن شوید در فایل configuration مخصوص test TypeScript پروژه شما، که معمولاً `tsconfig.spec.json` است، include شده‌اند. این کار اجازه می‌دهد TypeScript compiler این فایل‌ها را هنگام testing درست پردازش کند.

### Configuration پیشرفته Vitest

برای use caseهای پیشرفته، می‌توانید با گزینه `runnerConfig` در `angular.json` یک فایل configuration سفارشی Vitest ارائه کنید.

IMPORTANT: استفاده از configuration سفارشی گزینه‌های پیشرفته را فعال می‌کند، اما تیم Angular از محتوای آن فایل configuration یا pluginهای third-party پشتیبانی نمی‌کند. CLI همچنین بعضی propertyها مثل `test.projects` و `test.include` را override می‌کند تا integration درست حفظ شود.

می‌توانید یک فایل configuration برای Vitest بسازید، مثل `vitest-base.config.ts`، و آن را در `angular.json` ارجاع دهید:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "runnerConfig": "vitest-base.config.ts"
          }
        }
      }
    }
  }
}
```

همچنین می‌توانید با CLI یک فایل configuration پایه تولید کنید:

```shell
ng generate config vitest
```

این دستور یک فایل `vitest-base.config.ts` ایجاد می‌کند که می‌توانید آن را سفارشی کنید.

HELPFUL: درباره configuration مربوط به Vitest در [مستندات رسمی Vitest](https://vitest.dev/config/) بیشتر بخوانید.

## Code coverage

می‌توانید با افزودن flag مربوط به `--coverage` به دستور `ng test`، گزارش code coverage تولید کنید. گزارش در directory مربوط به `coverage/` ایجاد می‌شود.

برای اطلاعات جزئی‌تر، [راهنمای Code coverage](guide/testing/code-coverage) را ببینید.

## اجرای testها در مرورگر

با اینکه محیط پیش‌فرض Node.js برای بیشتر unit testها سریع‌تر است، می‌توانید testهای خود را در مرورگر واقعی هم اجرا کنید. این کار برای testهایی مفید است که به APIهای مخصوص مرورگر، مثل rendering، وابسته‌اند یا برای debugging کاربرد دارند.

برای اجرای testها در مرورگر، ابتدا باید یک browser provider نصب کنید. درباره browser mode در Vitest در [مستندات رسمی](https://vitest.dev/guide/browser) بیشتر بخوانید.

پس از نصب provider، می‌توانید testها را با تنظیم گزینه `browsers` در `angular.json` یا با استفاده از flag مربوط به `--browsers` در CLI، داخل مرورگر اجرا کنید. testها به صورت پیش‌فرض در مرورگر headed اجرا می‌شوند. اگر متغیر محیطی `CI` تنظیم شده باشد، به جای آن از headless mode استفاده می‌شود. برای کنترل صریح headless mode، می‌توانید نام مرورگر را با `Headless` تمام کنید، مثل `chromiumHeadless`.

```bash
# Example for Playwright (headed)
ng test --browsers=chromium

# Example for Playwright (headless)
ng test --browsers=chromiumHeadless

# Example for WebdriverIO (headed)
ng test --browsers=chrome

# Example for WebdriverIO (headless)
ng test --browsers=chromeHeadless
```

بر اساس نیازتان یکی از browser providerهای زیر را انتخاب کنید:

### Playwright

[Playwright](https://playwright.dev/) یک کتابخانه browser automation است که از Chromium، Firefox و WebKit پشتیبانی می‌کند.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-playwright playwright
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-playwright playwright
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-playwright playwright
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-playwright playwright
  </docs-code>
</docs-code-multifile>

### WebdriverIO

[WebdriverIO](https://webdriver.io/) یک framework برای browser و mobile automation test است که از Chrome، Firefox، Safari و Edge پشتیبانی می‌کند.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-webdriverio webdriverio
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-webdriverio webdriverio
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-webdriverio webdriverio
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-webdriverio webdriverio
  </docs-code>
</docs-code-multifile>

### Preview

Provider مربوط به `@vitest/browser-preview` برای محیط‌های WebContainer مثل StackBlitz طراحی شده و برای استفاده در CI/CD مناسب نیست.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-preview
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-preview
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-preview
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-preview
  </docs-code>
</docs-code-multifile>

HELPFUL: برای configuration پیشرفته‌تر و مخصوص مرورگر، بخش [Configuration پیشرفته Vitest](#advanced-vitest-configuration) را ببینید.

## دیگر frameworkهای test

می‌توانید یک برنامه Angular را با کتابخانه‌ها و test runnerهای دیگر هم unit test کنید. هر کتابخانه و runner مراحل نصب، configuration و syntax خودش را دارد.

## Testing در continuous integration

یک test suite قوی، بخش مهمی از pipeline مربوط به continuous integration یا CI است. سرورهای CI به شما اجازه می‌دهند testها را روی هر commit و pull request به صورت خودکار اجرا کنید.

برای test کردن برنامه Angular در یک سرور CI، دستور استاندارد test را اجرا کنید:

```shell
ng test
```

بیشتر سرورهای CI متغیر محیطی `CI=true` را تنظیم می‌کنند و `ng test` آن را تشخیص می‌دهد. این کار testهای شما را به صورت خودکار در حالت غیرتعاملی و single-run اجرا می‌کند.

اگر سرور CI شما این متغیر را تنظیم نمی‌کند، یا اگر لازم است single-run mode را دستی اجباری کنید، می‌توانید از flagهای `--no-watch` و `--no-progress` استفاده کنید:

```shell
ng test --no-watch --no-progress
```

## اطلاعات بیشتر درباره testing

بعد از اینکه برنامه خود را برای testing آماده کردید، ممکن است راهنماهای testing زیر برایتان مفید باشند.

|                                                                    | جزئیات                                                                           |
| :----------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| [Code coverage](guide/testing/code-coverage)                       | testهای شما چه مقدار از app را پوشش می‌دهند و چطور مقدارهای لازم را مشخص کنید. |
| [Testing services](guide/testing/services)                         | چطور serviceهایی را که برنامه شما استفاده می‌کند test کنید.                                   |
| [Basics of testing components](guide/testing/components-basics)    | مبانی testing کامپوننت‌های Angular.                                             |
| [Component testing scenarios](guide/testing/components-scenarios)  | انواع سناریوهای testing کامپوننت و use caseهای مختلف.                       |
| [Testing attribute directives](guide/testing/attribute-directives) | چطور attribute directiveهای خود را test کنید.                                            |
| [Testing pipes](guide/testing/pipes)                               | چطور pipeها را test کنید.                                                                |
| [Debugging tests](guide/testing/debugging)                         | bugهای رایج testing.                                                              |
| [Testing utility APIs](guide/testing/utility-apis)                 | قابلیت‌های testing در Angular.                                                         |
