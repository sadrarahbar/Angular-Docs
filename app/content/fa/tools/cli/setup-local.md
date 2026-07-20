# راه‌اندازی local environment و workspace

این guide توضیح می‌دهد چطور environment خود را برای Angular development با استفاده از [Angular CLI](cli 'CLI command reference') setup کنید.
این راهنما شامل اطلاعاتی درباره نصب CLI، ساخت workspace اولیه و starter app، و اجرای local آن app برای بررسی setup شماست.

<docs-callout title="Angular را بدون local setup امتحان کنید">

اگر تازه با Angular آشنا شده‌اید، بهتر است با [Try it now!](tutorials/learn-angular) شروع کنید؛ جایی که essentials مربوط به Angular را در browser یاد می‌گیرید.
این standalone tutorial از محیط تعاملی [StackBlitz](https://stackblitz.com) برای online development استفاده می‌کند.
تا زمانی که آماده نیستید، لازم نیست local environment خودتان را setup کنید.

</docs-callout>

## قبل از شروع

برای استفاده از Angular CLI، بهتر است با موارد زیر آشنا باشید:

<docs-pill-row>
  <docs-pill href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" title="JavaScript"/>
  <docs-pill href="https://developer.mozilla.org/en-US/docs/Web/HTML" title="HTML"/>
  <docs-pill href="https://developer.mozilla.org/en-US/docs/Web/CSS" title="CSS"/>
</docs-pill-row>

همچنین باید با استفاده از ابزارهای command line interface یا CLI آشنا باشید و درک کلی از command shellها داشته باشید.
دانستن [TypeScript](https://www.typescriptlang.org) مفید است، اما الزامی نیست.

## Dependencyها

برای نصب Angular CLI روی سیستم local خود، باید [Node.js](https://nodejs.org/) را نصب کنید.
Angular CLI از Node و package manager همراه آن، یعنی npm، برای نصب و اجرای JavaScript toolها خارج از browser استفاده می‌کند.

[Node.js را دانلود و نصب کنید](https://nodejs.org/en/download)، که `npm` CLI را هم شامل می‌شود.
Angular به نسخه‌ای از Node.js نیاز دارد که [active LTS یا maintenance LTS](https://nodejs.org/en/about/previous-releases) باشد.
برای اطلاعات بیشتر، guide مربوط به [version compatibility در Angular](reference/versions) را ببینید.

## نصب Angular CLI

برای نصب Angular CLI، یک terminal window باز کنید و command زیر را اجرا کنید:

<docs-code-multifile>
   <docs-code
     header="npm"
     language="shell"
     >
     npm install -g @angular/cli
     </docs-code>
   <docs-code
     header="pnpm"
     language="shell"
     >
     pnpm install -g @angular/cli
     </docs-code>
   <docs-code
     header="yarn"
     language="shell"
     >
     yarn global add @angular/cli
     </docs-code>
   <docs-code
     header="bun"
     language="shell"
     >
     bun install -g @angular/cli
     </docs-code>

 </docs-code-multifile>

### PowerShell execution policy

روی کامپیوترهای Windows client، اجرای PowerShell scriptها به‌صورت پیش‌فرض disabled است؛ بنابراین command بالا ممکن است با error شکست بخورد.
برای اجازه دادن به اجرای PowerShell scriptها، که برای npm global binaryها لازم است، باید <a href="https://docs.microsoft.com/powershell/module/microsoft.powershell.core/about/about_execution_policies" target="_blank">execution policy</a> زیر را تنظیم کنید:

```sh

Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

```

پیامی را که بعد از اجرای command نمایش داده می‌شود با دقت بخوانید و دستورالعمل‌ها را دنبال کنید. مطمئن شوید اثرات تنظیم execution policy را می‌فهمید.

### Unix permissionها

در بعضی setupهای شبیه Unix، global scriptها ممکن است متعلق به root user باشند؛ بنابراین command بالا ممکن است با permission error شکست بخورد.
برای اجرای command به‌عنوان root user از `sudo` استفاده کنید و وقتی prompt شد password خود را وارد کنید:

<docs-code-multifile>
   <docs-code
     header="npm"
     language="shell"
     >
     sudo npm install -g @angular/cli
     </docs-code>
   <docs-code
     header="pnpm"
     language="shell"
     >
     sudo pnpm install -g @angular/cli
     </docs-code>
   <docs-code
     header="yarn"
     language="shell"
     >
     sudo yarn global add @angular/cli
     </docs-code>
   <docs-code
     header="bun"
     language="shell"
     >
     sudo bun install -g @angular/cli
     </docs-code>

 </docs-code-multifile>

مطمئن شوید اثرات اجرای commandها به‌عنوان root را می‌فهمید.

## ساخت workspace و application اولیه

شما appها را در context یک Angular **workspace** توسعه می‌دهید.

برای ساخت یک workspace جدید و starter app اولیه، command مربوط به CLI یعنی `ng new` را اجرا کنید و نام `my-app` را بدهید، همان‌طور که اینجا نشان داده شده است؛ سپس به promptهای مربوط به featureهایی که باید include شوند پاسخ دهید:

```shell

ng new my-app

```

Angular CLI packageهای npm لازم برای Angular و dependencyهای دیگر را نصب می‌کند.
این کار ممکن است چند دقیقه طول بکشد.

CLI یک workspace جدید و یک welcome app کوچک را در دایرکتوری جدیدی با همان نام workspace می‌سازد که آماده اجراست.
به دایرکتوری جدید بروید تا commandهای بعدی از همین workspace استفاده کنند.

```shell

cd my-app

```

## اجرای application

Angular CLI یک development server دارد تا app خود را به‌صورت local build و serve کنید. command زیر را اجرا کنید:

```shell

ng serve --open

```

command مربوط به `ng serve` server را اجرا می‌کند، فایل‌های شما را watch می‌کند، و هنگام تغییر آن فایل‌ها app را rebuild و browser را reload می‌کند.

option مربوط به `--open` یا فقط `-o` به‌صورت خودکار browser شما را روی `http://localhost:4200/` باز می‌کند تا application generated را ببینید.

## Workspaceها و project fileها

command مربوط به [`ng new`](cli/new) یک folder مربوط به [Angular workspace](reference/configs/workspace-config) می‌سازد و یک application جدید داخل آن generate می‌کند.
یک workspace می‌تواند چند application و library داشته باشد.
application اولیه‌ای که command مربوط به [`ng new`](cli/new) می‌سازد، در root directory مربوط به workspace قرار دارد.
وقتی یک application یا library اضافی در workspace موجود generate می‌کنید، به‌صورت پیش‌فرض داخل subfolder مربوط به `projects/` قرار می‌گیرد.

یک application تازه generate شده شامل source fileهای root component و template است.
هر application یک folder به نام `src` دارد که componentها، data و assetهای آن را شامل می‌شود.

می‌توانید فایل‌های generated را مستقیماً edit کنید، یا با CLI commandها به آن‌ها اضافه کنید و آن‌ها را modify کنید.
از command مربوط به [`ng generate`](cli/generate) برای اضافه کردن فایل‌های جدید برای componentها، directiveها، pipeها، serviceها و موارد دیگر استفاده کنید.
commandهایی مثل [`ng add`](cli/add) و [`ng generate`](cli/generate)، که applicationها و libraryها را می‌سازند یا روی آن‌ها عمل می‌کنند، باید
از داخل یک workspace اجرا شوند. در مقابل، commandهایی مثل `ng new` باید _خارج_ از workspace اجرا شوند چون workspace جدیدی می‌سازند.

## قدم‌های بعدی

- درباره [file structure](reference/configs/file-structure) و [configuration](reference/configs/workspace-config) مربوط به workspace generated بیشتر یاد بگیرید.

- application جدید خود را با [`ng test`](cli/test) test کنید.

- boilerplateهایی مثل componentها، directiveها و pipeها را با [`ng generate`](cli/generate) generate کنید.

- application جدیدتان را با [`ng deploy`](cli/deploy) deploy کنید و آن را در دسترس کاربران واقعی قرار دهید.

- end-to-end testهای application خود را با [`ng e2e`](cli/e2e) setup و اجرا کنید.
