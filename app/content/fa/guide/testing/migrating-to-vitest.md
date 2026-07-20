# مهاجرت از Karma به Vitest

Angular CLI برای پروژه‌های جدید از [Vitest](https://vitest.dev/) به عنوان test runner پیش‌فرض unit test استفاده می‌کند. این راهنما دستورالعمل‌های مهاجرت یک پروژه موجود از Karma و Jasmine به Vitest را ارائه می‌کند.

IMPORTANT: مهاجرت یک پروژه موجود به Vitest experimental در نظر گرفته می‌شود. این فرایند همچنین به استفاده از build system مربوط به `application` نیاز دارد، که برای همه پروژه‌های تازه‌ساخته‌شده پیش‌فرض است.

## مراحل migration دستی

پیش از استفاده از schematic مربوط به automated refactoring، باید پروژه خود را دستی update کنید تا از test runner مربوط به Vitest استفاده کند.

### 1. نصب dependencyها

`vitest` و یک کتابخانه DOM emulation را نصب کنید. با اینکه browser testing همچنان ممکن است \(مرحله [5](#5-configure-browser-mode-optional) را ببینید\)، Vitest به صورت پیش‌فرض از یک کتابخانه DOM emulation استفاده می‌کند تا محیط مرورگر را داخل Node.js شبیه‌سازی کند و testها سریع‌تر اجرا شوند. CLI اگر `happy-dom` نصب باشد آن را به صورت خودکار تشخیص می‌دهد و استفاده می‌کند؛ در غیر این صورت به `jsdom` fallback می‌کند. باید یکی از این packageها را نصب داشته باشید.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev vitest jsdom
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev vitest jsdom
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D vitest jsdom
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev vitest jsdom
  </docs-code>
</docs-code-multifile>

### 2. Update کردن `angular.json`

در فایل `angular.json`، target مربوط به `test` را برای پروژه خود پیدا کنید و `builder` را به `@angular/build:unit-test` تغییر دهید.

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test"
        }
      }
    }
  }
}
```

builder مربوط به `unit-test` به صورت پیش‌فرض از `"tsConfig": "tsconfig.spec.json"` و `"buildTarget": "::development"` استفاده می‌کند. اگر پروژه شما مقدارهای متفاوتی لازم دارد، می‌توانید این optionها را صریح تنظیم کنید. برای مثال، اگر build configuration مربوط به `development` وجود ندارد یا برای testing به optionهای متفاوتی نیاز دارید، می‌توانید یک build configuration با نام `testing` یا نام مشابه بسازید و برای `buildTarget` استفاده کنید.

builder قبلی `@angular/build:karma` اجازه می‌داد build optionهایی مثل `polyfills`، `assets` یا `styles` مستقیم داخل target مربوط به `test` configure شوند. builder جدید `@angular/build:unit-test` از این کار پشتیبانی نمی‌کند. اگر build optionهای مخصوص test شما با build configuration موجود `development` متفاوت هستند، باید آن‌ها را به یک build target configuration اختصاصی منتقل کنید. اگر build optionهای test شما از قبل با build configuration مربوط به `development` یکسان هستند، نیازی به کاری نیست.

### 3. مدیریت configurationهای سفارشی `karma.conf.js`

Configurationهای سفارشی در `karma.conf.js` به صورت خودکار migrate نمی‌شوند. پیش از حذف فایل `karma.conf.js`، آن را برای هر setting سفارشی که باید migrate شود بررسی کنید.

بسیاری از optionهای Karma معادل‌هایی در Vitest دارند که می‌توان آن‌ها را در یک فایل configuration سفارشی Vitest، مثل `vitest.config.ts`، تنظیم کرد و از طریق گزینه `runnerConfig` در `angular.json` به آن وصل شد.

مسیرهای رایج migration شامل موارد زیر است:

- **Reporters**: reporterهای Karma باید با reporterهای سازگار با Vitest جایگزین شوند. این‌ها اغلب می‌توانند مستقیم در `angular.json` زیر property مربوط به `test.options.reporters` configure شوند. برای configurationهای پیشرفته‌تر، از فایل سفارشی `vitest.config.ts` استفاده کنید.
- **Plugins**: pluginهای Karma ممکن است معادل‌هایی در Vitest داشته باشند که باید پیدا و نصب کنید. توجه کنید code coverage در Angular CLI یک قابلیت first-class است و می‌توان آن را با `ng test --coverage` فعال کرد.
- **Custom Browser Launchers**: این‌ها با گزینه `browsers` در `angular.json` و نصب یک browser provider مثل `@vitest/browser-playwright` جایگزین می‌شوند.

برای settingهای دیگر، مستندات رسمی [Vitest](https://vitest.dev/config/) را ببینید.

### 4. حذف Karma و فایل‌های `test.ts`

حالا می‌توانید `karma.conf.js` و `src/test.ts` را از پروژه حذف کنید و packageهای مرتبط با Karma را uninstall کنید. دستورهای زیر بر اساس packageهایی هستند که در یک پروژه جدید Angular CLI نصب می‌شوند؛ پروژه شما ممکن است packageهای مرتبط با Karma دیگری هم برای حذف داشته باشد.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core
  </docs-code>
  <docs-code header="bun" language="shell">
    bun remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core
  </docs-code>
</docs-code-multifile>

### 5. Configure کردن browser mode \(اختیاری\)

اگر لازم دارید testها را در مرورگر واقعی اجرا کنید، باید یک browser provider نصب کنید و `angular.json` خود را configure کنید.

**نصب یک browser provider:**

بر اساس نیازتان یکی از browser providerهای زیر را انتخاب کنید:

- **Playwright**: `@vitest/browser-playwright` برای Chromium، Firefox و WebKit.
- **WebdriverIO**: `@vitest/browser-webdriverio` برای Chrome، Firefox، Safari و Edge.
- **Preview**: `@vitest/browser-preview` برای محیط‌های WebContainer \(مثل StackBlitz\).

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-playwright
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-playwright
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-playwright
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-playwright
  </docs-code>
</docs-code-multifile>

**Update کردن `angular.json` برای browser mode:**

گزینه `browsers` را به optionهای target مربوط به `test` اضافه کنید. نام مرورگر به providerای که نصب کرده‌اید بستگی دارد، مثلاً `chromium` برای Playwright یا `chrome` برای WebdriverIO.

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "browsers": ["chromium"]
          }
        }
      }
    }
  }
}
```

اگر متغیر محیطی `CI` تنظیم شده باشد یا نام مرورگر شامل "Headless" باشد \(مثلاً `ChromeHeadless`\)، headless mode به صورت خودکار فعال می‌شود. در غیر این صورت، testها در مرورگر headed اجرا می‌شوند.

## Automated test refactoring با schematicها

IMPORTANT: schematic مربوط به `refactor-jasmine-vitest` experimental است و ممکن است همه patternهای ممکن test را پوشش ندهد. همیشه تغییرات انجام‌شده توسط schematic را review کنید.

Angular CLI، schematic مربوط به `refactor-jasmine-vitest` را فراهم می‌کند تا testهای Jasmine شما را به صورت خودکار refactor کند و از Vitest استفاده کند.

### Overview

schematic تغییرات زیر را در فایل‌های test شما \(`.spec.ts`\) خودکار انجام می‌دهد:

- `fit` و `fdescribe` را به `it.only` و `describe.only` تبدیل می‌کند.
- `xit` و `xdescribe` را به `it.skip` و `describe.skip` تبدیل می‌کند.
- فراخوانی‌های `spyOn` را به معادل `vi.spyOn` تبدیل می‌کند.
- `jasmine.objectContaining` را با `expect.objectContaining` جایگزین می‌کند.
- `jasmine.any` را با `expect.any` جایگزین می‌کند.
- `jasmine.createSpy` را با `vi.fn` جایگزین می‌کند.
- `beforeAll`، `beforeEach`، `afterAll` و `afterEach` را به معادل‌های Vitest آن‌ها update می‌کند.
- `fail()` را به `vi.fail()` در Vitest تبدیل می‌کند.
- expectationها را برای match شدن با APIهای Vitest تنظیم می‌کند.
- برای کدی که نمی‌تواند خودکار تبدیل شود commentهای TODO اضافه می‌کند.

schematic کارهای زیر را **انجام نمی‌دهد**:

- `vitest` یا dependencyهای مرتبط دیگر را نصب نمی‌کند.
- `angular.json` شما را برای استفاده از builder مربوط به Vitest تغییر نمی‌دهد و هیچ build optionای مثل `polyfills` یا `styles` را از target مربوط به `test` migrate نمی‌کند.
- فایل‌های `karma.conf.js` یا `test.ts` را حذف نمی‌کند.
- سناریوهای پیچیده یا nested مربوط به spyها را مدیریت نمی‌کند؛ این‌ها ممکن است به refactor دستی نیاز داشته باشند.

### اجرای schematic

وقتی پروژه شما برای Vitest configure شد، می‌توانید schematic را اجرا کنید تا فایل‌های test شما refactor شوند.

برای refactor کردن **همه** فایل‌های test در پروژه پیش‌فرض خود، اجرا کنید:

```bash
ng g @schematics/angular:refactor-jasmine-vitest
```

### Optionها

می‌توانید از optionهای زیر برای سفارشی کردن رفتار schematic استفاده کنید:

| Option                   | توضیح                                                                                         |
| :----------------------- | :-------------------------------------------------------------------------------------------------- |
| `--project <name>`       | پروژه‌ای را که باید در workspace چندپروژه‌ای refactor شود مشخص می‌کند. <br> مثال: `--project=my-lib`      |
| `--include <path>`       | فقط یک فایل یا directory مشخص را refactor می‌کند. <br> مثال: `--include=src/app/app.component.spec.ts` |
| `--file-suffix <suffix>` | suffix متفاوتی برای فایل‌های test مشخص می‌کند. <br> مثال: `--file-suffix=.test.ts`              |
| `--add-imports`          | اگر globals را در configuration مربوط به Vitest غیرفعال کرده‌اید، importهای صریح `vitest` را اضافه می‌کند.            |
| `--verbose`              | logging جزئی از همه transformationهای اعمال‌شده را نشان می‌دهد.                                                |
| `--browser-mode`         | اگر قصد دارید testها را در browser mode اجرا کنید.                                                     |

### پس از migration

بعد از کامل شدن schematic، بهتر است:

1.  **testهای خود را اجرا کنید**: `ng test` را اجرا کنید تا مطمئن شوید همه testها پس از refactoring هنوز pass می‌شوند.
2.  **تغییرات را review کنید**: تغییرات انجام‌شده توسط schematic را بررسی کنید و به testهای پیچیده، مخصوصاً testهایی که spy یا mockهای ظریف دارند، توجه ویژه داشته باشید چون ممکن است به تنظیم دستی بیشتری نیاز داشته باشند.

دستور `ng test` برنامه را در _watch mode_ build می‌کند و runner configureشده را اجرا می‌کند. watch mode هنگام استفاده از terminal تعاملی و زمانی که روی CI اجرا نمی‌شود، به صورت پیش‌فرض فعال است.

## Configuration

Angular CLI، configuration مربوط به Vitest را برای شما مدیریت می‌کند و configuration کامل را بر اساس optionهای `angular.json` در memory می‌سازد.

### Configuration سفارشی Vitest

IMPORTANT: استفاده از configuration سفارشی optionهای پیشرفته را فعال می‌کند، اما تیم Angular از محتوای مشخص آن فایل configuration یا pluginهای third-party استفاده‌شده داخل آن پشتیبانی مستقیم نمی‌کند. CLI همچنین بعضی propertyها مثل `test.projects` و `test.include` را override می‌کند تا operation درست حفظ شود.

می‌توانید یک فایل configuration سفارشی Vitest ارائه کنید تا settingهای پیش‌فرض را override کنید. برای فهرست کامل optionهای موجود، مستندات رسمی [Vitest](https://vitest.dev/config/) را ببینید.

**1. مسیر مستقیم:**
یک مسیر مستقیم به فایل configuration مربوط به Vitest در `angular.json` ارائه کنید:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {"runnerConfig": "vitest.config.ts"}
        }
      }
    }
  }
}
```

**2. جستجوی خودکار برای configuration پایه:**
اگر `runnerConfig` را روی `true` بگذارید، builder به صورت خودکار در rootهای project و workspace دنبال یک فایل مشترک `vitest-base.config.*` می‌گردد.

## Patch مربوط به `zone.js` برای Vitest

برای استفاده از functionهایی مثل `fakeAsync`، `flush` یا `waitForAsync`، یا برای اینکه testهای موجود شما بتوانند با آن‌ها کار کنند، می‌توانید `zone.js/plugins/vitest-patch` را به polyfillهای target مربوط به test در `angular.json` اضافه کنید.

با این حال، قویاً توصیه می‌کنیم برنامه‌ریزی برای تبدیل test suiteهای موجود خود به `async` native و fake timerهای Vitest را شروع کنید، چون این رویکرد جاافتاده‌تر است.

برای استفاده از fake timerها با Vitest، [اینجا یک مثال ببینید](/guide/testing/components-scenarios#async-test-with-a-vitest-fake-timers).

## گزارش bug

issueها و feature requestها را در [GitHub](https://github.com/angular/angular-cli/issues) گزارش کنید.

لطفاً تا جای ممکن یک reproduction حداقلی ارائه کنید تا به تیم در رسیدگی به issueها کمک کند.
