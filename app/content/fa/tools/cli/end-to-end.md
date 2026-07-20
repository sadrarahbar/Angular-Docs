# End to End Testing

End-to-end یا E2E testing شکلی از testing است که برای اطمینان از درست کار کردن کل application از ابتدا تا انتها، یا _"end-to-end"_، استفاده می‌شود. E2E testing با unit testing فرق دارد، چون کاملاً از implementation detailهای زیرین کد شما جداست. معمولاً برای validate کردن application به روشی استفاده می‌شود که شبیه تعامل یک کاربر واقعی با آن باشد. این صفحه guideی برای شروع end-to-end testing در Angular با استفاده از Angular CLI است.

## Setup کردن E2E Testing

Angular CLI هر چیزی را که برای اجرای end-to-end testهای Angular application خود نیاز دارید دانلود و نصب می‌کند.

```shell

ng e2e

```

command مربوط به `ng e2e` ابتدا project شما را برای target به نام "e2e" بررسی می‌کند. اگر نتواند آن را پیدا کند، CLI از شما می‌پرسد می‌خواهید از کدام e2e package استفاده کنید و setup را مرحله‌به‌مرحله پیش می‌برد.

```text

Cannot find "e2e" target for the specified project.
You can add a package that implements these capabilities.

For example:
Cypress: ng add @cypress/schematic
Nightwatch: ng add @nightwatch/schematics
WebdriverIO: ng add @wdio/schematics
Playwright: ng add playwright-ng-schematics
Puppeteer: ng add @puppeteer/ng-schematics

Would you like to add a package with "e2e" capabilities now?
No
❯ Cypress
Nightwatch
WebdriverIO
Playwright
Puppeteer

```

اگر test runner مورد نظر خود را در list بالا پیدا نکردید، می‌توانید با `ng add` به‌صورت دستی یک package اضافه کنید.

## اجرای E2E Testها

حالا که application شما برای end-to-end testing configure شده است، می‌توانیم همان command را برای اجرای testها صدا بزنیم.

```shell

ng e2e

```

توجه کنید اجرای testها با هرکدام از e2e packageهای integrated چیز "خاصی" ندارد. command مربوط به `ng e2e` در واقع فقط builder مربوط به `e2e` را پشت صحنه اجرا می‌کند. همیشه می‌توانید [custom builder خودتان](tools/cli/cli-builder#creating-a-builder) را با نام `e2e` بسازید و با `ng e2e` اجرا کنید.

## اطلاعات بیشتر درباره end-to-end testing toolها

| Testing Tool | جزئیات                                                                                                              |
| :----------- | :------------------------------------------------------------------------------------------------------------------ |
| Cypress      | [Getting started with Cypress](https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test) |
| Nightwatch   | [Getting started with Nightwatch](https://nightwatchjs.org/guide/writing-tests/introduction.html)                   |
| WebdriverIO  | [Getting started with Webdriver.io](https://webdriver.io/docs/gettingstarted)                                       |
| Playwright   | [Getting started with Playwright](https://playwright.dev/docs/writing-tests)                                        |
| Puppeteer    | [Getting started with Puppeteer](https://pptr.dev)                                                                  |
