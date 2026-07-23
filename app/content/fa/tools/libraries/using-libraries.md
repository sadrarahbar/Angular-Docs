# استفاده از کتابخانه‌های Angular منتشرشده در npm

هنگام ساخت برنامه Angular خود، از کتابخانه‌های پیشرفته رسمی و همچنین اکوسیستم غنی کتابخانه‌های شخص ثالث بهره ببرید.
[Angular Material][AngularMaterialMain] نمونه‌ای از یک کتابخانه پیشرفته رسمی است.

## نصب کتابخانه‌ها

کتابخانه‌ها به‌صورت [بسته‌های npm][GuideNpmPackages] منتشر می‌شوند و معمولاً schematicsهایی نیز همراه آن‌هاست که کتابخانه را با Angular CLI یکپارچه می‌کند.
برای یکپارچه‌کردن کد قابل‌استفاده مجدد یک کتابخانه با برنامه، باید بسته را نصب کنید و قابلیت ارائه‌شده را در محل استفاده import کنید.
برای بیشتر کتابخانه‌های منتشرشده Angular، از دستور `ng add <lib_name>` در Angular CLI استفاده کنید.

دستور `ng add` در Angular CLI با استفاده از یک package manager بسته کتابخانه را نصب می‌کند و schematicsهای موجود در بسته را برای ایجاد ساختارهای تکمیلی در کد پروژه اجرا می‌کند.
[npm][NpmjsMain] و [yarn][YarnpkgMain] نمونه‌هایی از package manager هستند.
این ساختارهای تکمیلی می‌توانند شامل عبارت‌های import، فونت‌ها و themeها باشند.

یک کتابخانه منتشرشده معمولاً فایل `README` یا مستندات دیگری دارد که شیوه افزودن آن به برنامه را توضیح می‌دهد.
برای مشاهده نمونه، به مستندات [Angular Material][AngularMaterialMain] مراجعه کنید.

### تعریف‌های نوع کتابخانه

بسته‌های کتابخانه معمولاً تعریف‌های نوع را در فایل‌های `.d.ts` قرار می‌دهند؛ نمونه‌هایی از آن را می‌توانید در `node_modules/@angular/material` ببینید.
اگر بسته کتابخانه شما تعریف نوع ندارد و IDE خطا نشان می‌دهد، ممکن است لازم باشد بسته `@types/<lib_name>` را در کنار کتابخانه نصب کنید.

برای مثال، فرض کنید کتابخانه‌ای به نام `d3` دارید:

```shell

npm install d3 --save
npm install @types/d3 --save-dev

```

نوع‌هایی که در بسته `@types/` مربوط به یک کتابخانه نصب‌شده در workspace تعریف شده‌اند، به‌طور خودکار به پیکربندی TypeScript پروژه استفاده‌کننده از آن کتابخانه افزوده می‌شوند.
TypeScript به‌صورت پیش‌فرض نوع‌ها را در مسیر `node_modules/@types` جست‌وجو می‌کند؛ بنابراین لازم نیست هر بسته نوع را جداگانه اضافه کنید.

اگر تعریف‌های نوع یک کتابخانه در `@types/` موجود نیست، می‌توانید با افزودن دستی تعریف‌های نوع از آن استفاده کنید.
برای این کار:

1. یک فایل `typings.d.ts` در پوشه `src/` ایجاد کنید.
   این فایل به‌طور خودکار به‌عنوان تعریف نوع سراسری در نظر گرفته می‌شود.

1. کد زیر را در `src/typings.d.ts` اضافه کنید:

   ```ts
   declare module 'host' {
     export interface Host {
       protocol?: string;
       hostname?: string;
       pathname?: string;
     }
     export function parse(url: string, queryString?: string): Host;
   }
   ```

1. کد زیر را در component یا فایلی که از کتابخانه استفاده می‌کند اضافه کنید:

   ```ts
   import * as host from 'host';
   const parsedUrl = host.parse('https://angular.dev');
   console.log(parsedUrl.hostname);
   ```

در صورت نیاز تعریف‌های نوع بیشتری اضافه کنید.

## به‌روزرسانی کتابخانه‌ها

ناشر می‌تواند یک کتابخانه را به‌روزرسانی کند و هر کتابخانه نیز dependencyهای مستقلی دارد که باید به‌روز نگه داشته شوند.
برای بررسی به‌روزرسانی کتابخانه‌های نصب‌شده، از دستور [`ng update`][CliUpdate] در Angular CLI استفاده کنید.

برای به‌روزرسانی نسخه یک کتابخانه مشخص، دستور `ng update <lib_name>` در Angular CLI را اجرا کنید.
Angular CLI آخرین نسخه منتشرشده کتابخانه را بررسی می‌کند و اگر از نسخه نصب‌شده جدیدتر باشد، آن را دانلود کرده و `package.json` شما را با نسخه جدید هماهنگ می‌کند.

هنگام ارتقای Angular به نسخه‌ای جدید، باید مطمئن شوید تمام کتابخانه‌های مورد استفاده نیز به‌روز هستند.
اگر کتابخانه‌ها به یکدیگر وابسته باشند، ممکن است لازم باشد آن‌ها را با ترتیب مشخصی به‌روزرسانی کنید.
برای راهنمایی به [راهنمای به‌روزرسانی Angular][AngularUpdateMain] مراجعه کنید.

## افزودن کتابخانه به scope سراسری runtime

اگر یک کتابخانه قدیمی JavaScript در برنامه import نمی‌شود، می‌توانید آن را به scope سراسری runtime اضافه کنید و طوری بارگذاری کنید که انگار در یک تگ script قرار گرفته است.
برای انجام این کار در زمان build، گزینه‌های `scripts` و `styles` مربوط به build target را در فایل پیکربندی workspace یعنی [`angular.json`][GuideWorkspaceConfig] تنظیم کنید.

برای مثال، برای استفاده از کتابخانه [Bootstrap 4][GetbootstrapDocs40GettingStartedIntroduction]:

1. کتابخانه و dependencyهای مرتبط را با package manager نرم‌افزار npm نصب کنید:

   ```shell
     npm install jquery --save
     npm install popper.js --save
     npm install bootstrap --save
   ```

1. فایل‌های script مرتبط را در فایل پیکربندی `angular.json` به آرایه `scripts` اضافه کنید:

   ```json
     "scripts": [
         "node_modules/jquery/dist/jquery.slim.js",
         "node_modules/popper.js/dist/umd/popper.js",
         "node_modules/bootstrap/dist/js/bootstrap.js"
       ],
   ```

1. فایل CSS با نام `bootstrap.css` را به آرایه `styles` اضافه کنید:

   ```json
     "styles": [
         "node_modules/bootstrap/dist/css/bootstrap.css",
         "src/styles.css"
     ],
   ```

1. برای مشاهده عملکرد Bootstrap 4 در برنامه، دستور `ng serve` در Angular CLI را اجرا یا دوباره راه‌اندازی کنید.

### استفاده از کتابخانه‌های سراسری runtime در برنامه

پس از import کردن یک کتابخانه از طریق آرایه "scripts"، آن را با عبارت import در کد TypeScript خود import **نکنید**.
قطعه‌کد زیر نمونه‌ای از عبارت import است.

```ts
import * as $ from 'jquery';
```

اگر کتابخانه را با عبارت‌های import نیز وارد کنید، دو نسخه متفاوت از آن خواهید داشت: یکی به‌عنوان کتابخانه سراسری و دیگری به‌عنوان module.
این وضعیت به‌ویژه برای کتابخانه‌های دارای plugin مانند jQuery نامطلوب است، زیرا هر نسخه pluginهای متفاوتی دارد.

در عوض، برای دانلود تعریف‌های نوع کتابخانه دستور `npm install @types/jquery` در Angular CLI را اجرا کنید و سپس مراحل نصب کتابخانه را ادامه دهید.
به این ترتیب به متغیرهای سراسری ارائه‌شده توسط آن کتابخانه دسترسی خواهید داشت.

### تعریف نوع برای کتابخانه‌های سراسری runtime

اگر کتابخانه سراسری مورد استفاده شما تعریف نوع سراسری ندارد، می‌توانید آن را به‌صورت `any` در `src/typings.d.ts` به‌طور دستی declare کنید.

برای مثال:

```ts
declare var libraryName: any;
```

برخی scriptها کتابخانه‌های دیگر را گسترش می‌دهند؛ برای نمونه pluginهای jQuery:

```ts
$('.test').myPlugin();
```

در این حالت، `@types/jquery` نصب‌شده شامل `myPlugin` نیست؛ بنابراین باید یک interface در `src/typings.d.ts` اضافه کنید.
برای مثال:

```ts
interface JQuery {
  myPlugin(options?: any): any;
}
```

اگر interface مربوط به extension تعریف‌شده توسط script را اضافه نکنید، IDE خطایی نمایش می‌دهد:

```text

[TS][Error] Property 'myPlugin' does not exist on type 'JQuery'

```

[CliUpdate]: cli/update 'ng update | CLI |Angular'
[GuideNpmPackages]: reference/configs/npm-packages 'Workspace npm dependencies | Angular'
[GuideWorkspaceConfig]: reference/configs/workspace-config 'Angular workspace configuration | Angular'
[Resources]: resources 'Explore Angular Resources | Angular'
[AngularMaterialMain]: https://material.angular.dev 'Angular Material | Angular'
[AngularUpdateMain]: /update-guide 'Angular Update Guide | Angular'
[GetbootstrapDocs40GettingStartedIntroduction]: https://getbootstrap.com/docs/4.0/getting-started/introduction 'Introduction | Bootstrap'
[NpmjsMain]: https://www.npmjs.com 'npm'
[YarnpkgMain]: https://yarnpkg.com ' Yarn'
