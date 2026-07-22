# سرویس زبان Angular

سرویس زبان Angular این امکان را برای ویرایشگرهای کد فراهم می‌کند که تکمیل خودکار، خطاها، راهنمایی‌ها و پیمایش درون templateهای Angular را ارائه دهند.
این سرویس هم با templateهای خارجی در فایل‌های HTML جداگانه و هم با templateهای درون‌خطی کار می‌کند.

## پیکربندی گزینه‌های کامپایلر برای سرویس زبان Angular

برای فعال‌کردن جدیدترین قابلیت‌های سرویس زبان، گزینهٔ `strictTemplates` را در `tsconfig.json` روی `true` تنظیم کنید؛ همان‌طور که در مثال زیر نشان داده شده است:

```json

"angularCompilerOptions": {
  "strictTemplates": true
}

```

برای اطلاعات بیشتر، راهنمای [گزینه‌های کامپایلر Angular](reference/configs/angular-compiler-options) را ببینید.

## قابلیت‌ها

ویرایشگر شما به‌طور خودکار تشخیص می‌دهد که یک فایل Angular را باز کرده‌اید.
سپس با استفاده از سرویس زبان Angular، فایل `tsconfig.json` را می‌خواند، همهٔ templateهای برنامه را پیدا می‌کند و برای هر templateای که باز کنید، خدمات زبانی ارائه می‌دهد.

این خدمات زبانی شامل موارد زیر هستند:

- فهرست‌های تکمیل خودکار
- پیام‌های تشخیصی AOT
- اطلاعات سریع
- رفتن به تعریف

### تکمیل خودکار

تکمیل خودکار با ارائهٔ گزینه‌ها و راهنمایی‌های متناسب با زمینه هنگام تایپ، سرعت توسعه را افزایش می‌دهد.
این مثال تکمیل خودکار را درون یک interpolation نشان می‌دهد.
هنگام تایپ می‌توانید برای تکمیل، کلید tab را فشار دهید.

<img alt="تکمیل خودکار" src="assets/images/guide/language-service/language-completion.gif">

تکمیل خودکار درون elementها نیز در دسترس است.
هر elementای که selector یک component باشد، در فهرست تکمیل نمایش داده می‌شود.

### بررسی خطا

سرویس زبان Angular می‌تواند پیشاپیش دربارهٔ اشتباه‌های کد به شما هشدار دهد.
در این مثال، Angular نمی‌داند `orders` چیست یا از کجا آمده است.

<img alt="بررسی خطا" src="assets/images/guide/language-service/language-error.gif">

### اطلاعات سریع و پیمایش

قابلیت اطلاعات سریع به شما اجازه می‌دهد نشانگر را روی کد نگه دارید و ببینید componentها، directiveها و moduleها از کجا آمده‌اند.
سپس می‌توانید روی «رفتن به تعریف» کلیک کنید یا با فشردن F12 مستقیماً به تعریف بروید.

<img alt="پیمایش" src="assets/images/guide/language-service/language-navigation.gif">

## سرویس زبان Angular در ویرایشگر شما

سرویس زبان Angular در حال حاضر به‌صورت افزونه برای [Visual Studio Code](https://code.visualstudio.com)، [WebStorm](https://www.jetbrains.com/webstorm)، [Sublime Text](https://www.sublimetext.com)، [Zed](https://zed.dev)، [Neovim](https://neovim.io) و [Eclipse IDE](https://www.eclipse.org/eclipseide) در دسترس است.

### Visual Studio Code

در [Visual Studio Code](https://code.visualstudio.com)، افزونه را از [بازارچهٔ افزونه‌ها](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template) نصب کنید.
بازارچه را با آیکون Extensions در نوار سمت چپ ویرایشگر باز کنید، یا از VS Quick Open با (⌘+P در Mac و CTRL+P در Windows) استفاده کنید و عبارت "? ext" را بنویسید.
در بازارچه، افزونهٔ Angular Language Service را جست‌وجو و روی دکمهٔ **Install** کلیک کنید.

یکپارچه‌سازی Visual Studio Code با سرویس زبان Angular توسط تیم Angular نگهداری و توزیع می‌شود.

### Visual Studio

در [Visual Studio](https://visualstudio.microsoft.com)، افزونه را از [بازارچهٔ افزونه‌ها](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.AngularLanguageService) نصب کنید.
برای بازکردن بازارچه از داخل ویرایشگر، در نوار منوی بالا Extensions و سپس Manage Extensions را انتخاب کنید.
در بازارچه، افزونهٔ Angular Language Service را جست‌وجو و روی دکمهٔ **Install** کلیک کنید.

یکپارچه‌سازی Visual Studio با سرویس زبان Angular با کمک تیم Angular، توسط Microsoft نگهداری و توزیع می‌شود.
پروژه را [اینجا](https://github.com/microsoft/vs-ng-language-service) ببینید.

### WebStorm

در [WebStorm](https://www.jetbrains.com/webstorm)، افزونهٔ [Angular and AngularJS](https://plugins.jetbrains.com/plugin/6971-angular-and-angularjs) را فعال کنید.

از WebStorm 2019.1 به بعد، دیگر نیازی به `@angular/language-service` نیست و باید آن را از `package.json` حذف کنید.

### Sublime Text

در [Sublime Text](https://www.sublimetext.com)، وقتی سرویس زبان به‌صورت افزونه نصب شده باشد فقط از templateهای درون‌خطی پشتیبانی می‌کند.
برای تکمیل خودکار در فایل‌های HTML، به یک افزونهٔ سفارشی Sublime (یا تغییر افزونهٔ فعلی) نیاز دارید.

برای استفاده از سرویس زبان در templateهای درون‌خطی، ابتدا باید افزونه‌ای برای پشتیبانی از TypeScript اضافه و سپس افزونهٔ سرویس زبان Angular را نصب کنید.
از TypeScript 2.3 به بعد، TypeScript دارای مدل افزونه‌ای است که سرویس زبان می‌تواند از آن استفاده کند.

1. جدیدترین نسخهٔ TypeScript را در یک دایرکتوری محلی `node_modules` نصب کنید:

   ```shell
   npm install --save-dev typescript
   ```

1. پکیج سرویس زبان Angular را در همان محل نصب کنید:

   ```shell

   npm install --save-dev @angular/language-service

   ```

1. پس از نصب پکیج، تنظیمات زیر را به بخش `"compilerOptions"` فایل `tsconfig.json` پروژه اضافه کنید.

   ```json {header:"tsconfig.json"}
   "plugins": [
     {"name": "@angular/language-service"}
   ]
   ```

1. در تنظیمات کاربری ویرایشگر (`Cmd+,` یا `Ctrl+,`)، موارد زیر را اضافه کنید:

   ```json {header:"Sublime Text user preferences"}

   "typescript-tsdk": "<path to your folder>/node_modules/typescript/lib"

   ```

با این کار، سرویس زبان Angular می‌تواند در فایل‌های `.ts` اطلاعات تشخیصی و تکمیل خودکار ارائه دهد.

### Eclipse IDE

یا مستقیماً پکیج «Eclipse IDE for Web and JavaScript developers» را که Angular Language Server در آن گنجانده شده نصب کنید، یا در سایر پکیج‌های Eclipse IDE از مسیر Help > Eclipse Marketplace، افزونهٔ [Eclipse Wild Web Developer](https://marketplace.eclipse.org/content/wild-web-developer-html-css-javascript-typescript-nodejs-angular-json-yaml-kubernetes-xml) را پیدا و نصب کنید.

### Neovim

#### Conquer of Completion با Node.js

سرویس زبان Angular از tsserver استفاده می‌کند که دقیقاً از مشخصات LSP پیروی نمی‌کند. بنابراین اگر از neovim یا vim همراه با JavaScript، TypeScript یا Angular استفاده می‌کنید، ممکن است [Conquer of Completion](https://github.com/neoclide/coc.nvim) (COC) کامل‌ترین پیاده‌سازی سرویس زبان Angular و tsserver را در اختیار شما بگذارد. دلیلش این است که COC پیاده‌سازی tsserver در VSCode را منتقل کرده است؛ پیاده‌سازی‌ای که با شیوهٔ کار tsserver سازگار است.

1. [coc.nvim را راه‌اندازی کنید](https://github.com/neoclide/coc.nvim)

2. سرویس زبان Angular را پیکربندی کنید

   پس از نصب، فرمان خط فرمان vim یعنی `CocConfig` را اجرا کنید تا فایل پیکربندی `coc-settings.json` باز شود؛ سپس ویژگی angular را اضافه کنید.

   مطمئن شوید مسیرهای صحیح `node_modules` سراسری خود را جایگزین کرده‌اید، به‌گونه‌ای که به‌ترتیب به دایرکتوری‌های حاوی `tsserver` و `ngserver` اشاره کنند.

   ```json {header:"CocConfig example file coc-settings.json"}
   {
     "languageserver": {
       "angular": {
         "command": "ngserver",
         "args": [
           "--stdio",
           "--tsProbeLocations",
           "/usr/local/lib/node_modules/typescript/lib/CHANGE/THIS/TO/YOUR/GLOBAL/NODE_MODULES",
           "--ngProbeLocations",
           "/usr/local/lib/node_modules/@angular/language-server/bin/CHANGE/THIS/TO/YOUR/GLOBAL/NODE_MODULES"
         ],
         "filetypes": ["ts", "typescript", "html"],
         "trace.server.verbosity": "verbose"
       }
     }
   }
   ```

راهنمایی: مسیرهای `/usr/local/lib/node_modules/typescript/lib` و `/usr/local/lib/node_modules/@angular/language-server/bin` در بالا باید به محل moduleهای سراسری Node شما اشاره کنند که ممکن است متفاوت باشد.

#### LSP داخلی Neovim

با استفاده از افزونهٔ [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) می‌توان سرویس زبان Angular را در Neovim به کار برد.

1. [nvim-lspconfig را نصب کنید](https://github.com/neovim/nvim-lspconfig?tab=readme-ov-file#install)

2. [angularls را برای nvim-lspconfig پیکربندی کنید](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md#angularls)

### Zed

در [Zed](https://zed.dev)، افزونه را از [بازارچهٔ افزونه‌ها](https://zed.dev/extensions/angular) نصب کنید.

## سرویس زبان چگونه کار می‌کند

وقتی از ویرایشگری مجهز به سرویس زبان استفاده می‌کنید، ویرایشگر یک فرایند جداگانه برای سرویس زبان اجرا می‌کند و از طریق [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call) و با استفاده از [پروتکل سرور زبان](https://microsoft.github.io/language-server-protocol) با آن ارتباط برقرار می‌کند.
هنگام تایپ در ویرایشگر، اطلاعاتی برای فرایند سرویس زبان ارسال می‌شود تا وضعیت پروژهٔ شما را دنبال کند.

وقتی فهرست تکمیل را درون یک template فعال می‌کنید، ویرایشگر ابتدا template را به یک [درخت نحو انتزاعی (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree) در HTML تجزیه می‌کند.
کامپایلر Angular این درخت را تفسیر می‌کند تا زمینه را تشخیص دهد: template بخشی از کدام module است، scope فعلی چیست، selector مربوط به component کدام است و مکان cursor شما در AST مربوط به template کجاست.
سپس می‌تواند symbolهایی را که احتمال دارد در آن موقعیت قرار بگیرند مشخص کند.

اگر داخل یک interpolation باشید، فرایند کمی پیچیده‌تر است.
اگر interpolation به‌شکل `{{data.---}}` درون یک `div` داشته باشید و پس از `data.---` به فهرست تکمیل نیاز پیدا کنید، کامپایلر نمی‌تواند پاسخ را از HTML AST به دست آورد.
HTML AST فقط می‌تواند به کامپایلر بگوید متنی با نویسه‌های «`{{data.---}}`» وجود دارد.
در این مرحله، تجزیه‌کنندهٔ template یک AST عبارت تولید می‌کند که درون AST مربوط به template قرار دارد.
سپس سرویس زبان Angular عبارت `data.---` را در زمینهٔ خودش بررسی می‌کند، از سرویس زبان TypeScript می‌پرسد اعضای `data` چه هستند و فهرست گزینه‌ها را برمی‌گرداند.

## اطلاعات بیشتر

- برای اطلاعات عمیق‌تر دربارهٔ پیاده‌سازی، [کد منبع سرویس زبان Angular](https://github.com/angular/angular/blob/main/packages/language-service/src) را ببینید
- برای آشنایی بیشتر با ملاحظات و اهداف طراحی، [مستندات طراحی را اینجا ببینید](https://github.com/angular/vscode-ng-language-service/wiki/Design)

