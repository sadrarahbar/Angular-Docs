# Angular CLI

Angular CLI یک ابزار command-line interface است که به شما اجازه می‌دهد Angular applicationها را مستقیماً از command shell scaffold، develop، test، deploy و maintain کنید.

Angular CLI روی npm با package نام `@angular/cli` منتشر می‌شود و شامل binaryای به نام `ng` است. commandهایی که `ng` را invoke می‌کنند، در واقع از Angular CLI استفاده می‌کنند.

<docs-callout title="Angular را بدون local setup امتحان کنید">

اگر تازه با Angular آشنا شده‌اید، بهتر است با [Try it now!](tutorials/learn-angular) شروع کنید؛ جایی که essentials مربوط به Angular را در context یک online store app پایه و آماده یاد می‌گیرید و می‌توانید آن را بررسی و تغییر دهید.
این standalone tutorial از محیط تعاملی [StackBlitz](https://stackblitz.com) برای online development استفاده می‌کند.
تا زمانی که آماده نیستید، لازم نیست local environment خودتان را setup کنید.

</docs-callout>

<docs-card-container>
  <docs-card title="شروع کار" link="شروع کنید" href="tools/cli/setup-local">
    Angular CLI را نصب کنید تا اولین app خود را بسازید و build کنید.
  </docs-card>
  <docs-card title="Command Reference" link="بیشتر بدانید" href="cli">
    CLI commandها را کشف کنید تا با Angular productiveتر باشید.
  </docs-card>
  <docs-card title="Schematics" link="بیشتر بدانید" href="tools/cli/schematics">
    schematics بسازید و اجرا کنید تا source fileهای application شما به‌صورت خودکار generate و modify شوند.
  </docs-card>
  <docs-card title="Builders" link="بیشتر بدانید" href="tools/cli/cli-builder">
    builderها را بسازید و اجرا کنید تا transformationهای پیچیده را از source code به build outputهای generated انجام دهند.
  </docs-card>
</docs-card-container>

## Syntax زبان commandهای CLI

Angular CLI تقریباً conventionهای Unix/POSIX را برای syntax مربوط به optionها دنبال می‌کند.

### Boolean optionها

Boolean optionها دو شکل دارند: `--this-option` مقدار flag را روی `true` می‌گذارد، و `--no-this-option` آن را روی `false` می‌گذارد.
همچنین می‌توانید از `--this-option=false` یا `--this-option=true` استفاده کنید.
اگر هیچ‌کدام از optionها داده نشود، flag در default state خودش باقی می‌ماند؛ همان‌طور که در reference documentation آمده است.

### Array optionها

Array optionها را می‌توان به دو شکل ارائه کرد: `--option value1 value2` یا `--option value1 --option value2`.

### Key/value optionها

بعضی optionها مثل `--define` انتظار دارند مقدارشان arrayی از pairهای `key=value` باشد.
درست مثل array optionها، key/value optionها هم می‌توانند به دو شکل ارائه شوند:
`--define 'KEY_1="value1"' KEY_2=true` یا `--define 'KEY_1="value1"' --define KEY_2=true`.

### Relative pathها

Optionهایی که فایل مشخص می‌کنند می‌توانند absolute path بگیرند، یا pathهایی relative به current working directory؛ که معمولاً root مربوط به workspace یا project است.
