# افزودن package مربوط به localize

برای استفاده از قابلیت‌های localization در Angular، از [Angular CLI][CliMain] استفاده کنید تا package مربوط به `@angular/localize` را به پروژه خود اضافه کنید.

برای افزودن package مربوط به `@angular/localize`، از دستور زیر استفاده کنید تا فایل‌های `package.json` و TypeScript configuration در پروژه شما update شوند.

<docs-code language="shell" path="adev/src/content/examples/i18n/doc-files/commands.sh" region="add-localize"/>

این کار `types: ["@angular/localize"]` را در فایل‌های TypeScript configuration اضافه می‌کند.
همچنین خط `/// <reference types="@angular/localize" />` را در بالای فایل `main.ts` اضافه می‌کند که reference به type definition است.

HELPFUL: برای اطلاعات بیشتر درباره فایل‌های `package.json` و `tsconfig.json`، [Workspace npm dependencies][GuideNpmPackages] و [TypeScript Configuration][GuideTsConfig] را ببینید. برای یادگیری درباره Triple-slash Directives به [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html#-reference-types-) مراجعه کنید.

اگر `@angular/localize` نصب نشده باشد و تلاش کنید یک نسخه localized از پروژه خود build کنید \(برای مثال، هنگام استفاده از attributeهای `i18n` در templateها\)، [Angular CLI][CliMain] خطایی تولید می‌کند که شامل مراحلی است که می‌توانید برای فعال کردن i18n در پروژه خود انجام دهید.

## Optionها

| OPTION             | DESCRIPTION                                                                                                                                                                                   | VALUE TYPE | DEFAULT VALUE |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------------ |
| `--project`        | نام پروژه.                                                                                                                                                                      | `string`   |
| `--use-at-runtime` | اگر تنظیم شود، `$localize` می‌تواند در runtime استفاده شود. همچنین `@angular/localize` به جای `devDependencies`، که پیش‌فرض است، در بخش `dependencies` فایل `package.json` قرار می‌گیرد. | `boolean`  | `false`       |

برای optionهای بیشتر، `ng add` را در [Angular CLI][CliMain] ببینید.

## قدم بعدی

<docs-pill-row>
  <docs-pill href="guide/i18n/locale-id" title="ارجاع به localeها با ID"/>
</docs-pill-row>

[CliMain]: cli 'CLI Overview and Command Reference | Angular'
[GuideNpmPackages]: reference/configs/npm-packages 'Workspace npm dependencies | Angular'
[GuideTsConfig]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html 'TypeScript Configuration'
