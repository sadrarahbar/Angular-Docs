# Import کردن variantهای global مربوط به locale data

[Angular CLI][CliMain] اگر دستور [`ng build`][CliBuild] را با option مربوط به `--localize` اجرا کنید، locale data را به صورت خودکار include می‌کند.

```shell
ng build --localize
```

HELPFUL: نصب اولیه Angular از قبل locale data مربوط به English در United States \(`en-US`\) را دارد.
[Angular CLI][CliMain] وقتی از option مربوط به `--localize` همراه با دستور [`ng build`][CliBuild] استفاده می‌کنید، locale data را به صورت خودکار include می‌کند و مقدار `LOCALE_ID` را تنظیم می‌کند.

package مربوط به `@angular/common` در npm شامل فایل‌های locale data است.
variantهای global مربوط به locale data در `@angular/common/locales/global` در دسترس هستند.

## مثال `import` برای French

برای مثال، می‌توانید variantهای global مربوط به French \(`fr`\) را در `main.ts`، جایی که application را bootstrap می‌کنید، import کنید.

<docs-code header="src/main.ts (import locale)" path="adev/src/content/examples/i18n/src/main.ts" region="global-locale"/>

HELPFUL: در یک application مبتنی بر `NgModules`، آن را در `app.module` import می‌کنید.

[CliMain]: cli 'CLI Overview and Command Reference | Angular'
[CliBuild]: cli/build 'ng build | CLI | Angular'
