# ساخت route matchهای سفارشی

Angular Router از یک matching strategy قدرتمند پشتیبانی می‌کند که می‌توانید از آن برای کمک به navigation کاربران در application خود استفاده کنید.
این matching strategy از routeهای static، routeهای متغیر با parameter، wildcard routeها و موارد مشابه پشتیبانی می‌کند.
همچنین برای موقعیت‌هایی که URLها پیچیده‌تر هستند، می‌توانید pattern matching سفارشی خودتان را بسازید.

در این tutorial، با استفاده از `UrlMatcher` مربوط به Angular یک route matcher سفارشی می‌سازید.
این matcher در URL به‌دنبال یک Twitter handle می‌گردد.

## هدف‌ها

`UrlMatcher` مربوط به Angular را پیاده‌سازی کنید تا یک route matcher سفارشی بسازید.

## ساخت یک application نمونه

با استفاده از Angular CLI، یک application جدید به نام _angular-custom-route-match_ بسازید.
علاوه بر framework پیش‌فرض application Angular، یک component به نام _profile_ هم می‌سازید.

1. یک پروژه Angular جدید با نام _angular-custom-route-match_ بسازید.

   ```shell
   ng new angular-custom-route-match
   ```

   وقتی با پرسش `Would you like to add Angular routing?` روبه‌رو شدید، `Y` را انتخاب کنید.

   وقتی با پرسش `Which stylesheet format would you like to use?` روبه‌رو شدید، `CSS` را انتخاب کنید.

   بعد از چند لحظه، پروژه جدید `angular-custom-route-match` آماده است.

1. از terminal، به directory مربوط به `angular-custom-route-match` بروید.
1. یک component به نام _profile_ بسازید.

   ```shell
   ng generate component profile
   ```

1. در code editor، فایل `profile.html` را پیدا کنید و محتوای placeholder را با HTML زیر جایگزین کنید.

   <docs-code header="profile.html" path="adev/src/content/examples/routing-with-urlmatcher/src/app/profile/profile.html"/>

1. در code editor، فایل `app.html` را پیدا کنید و محتوای placeholder را با HTML زیر جایگزین کنید.

   <docs-code header="app.html" path="adev/src/content/examples/routing-with-urlmatcher/src/app/app.html"/>

## Configure کردن routeهای application

بعد از آماده شدن framework application، مرحله بعد این است که قابلیت‌های routing را به فایل `app.config.ts` اضافه کنید.
به‌عنوان بخشی از این فرایند، یک URL matcher سفارشی می‌سازید که در URL به‌دنبال Twitter handle می‌گردد.
این handle با یک علامت `@` در ابتدا تشخیص داده می‌شود.

1. در code editor، فایل `app.config.ts` خود را باز کنید.
1. یک statement از نوع `import` برای `provideRouter` و `withComponentInputBinding` از Angular، و همچنین routeهای application اضافه کنید.

   ```ts
   import {provideRouter, withComponentInputBinding} from '@angular/router';

   import {routes} from './app.routes';
   ```

1. در array مربوط به providers، یک statement از نوع `provideRouter(routes, withComponentInputBinding())` اضافه کنید.

1. با اضافه کردن کد زیر به routeهای application، route matcher سفارشی را تعریف کنید.

   <docs-code header="app.routes.ts" path="adev/src/content/examples/routing-with-urlmatcher/src/app/app.routes.ts" region="matcher"/>

این matcher سفارشی functionای است که کارهای زیر را انجام می‌دهد:

- Matcher بررسی می‌کند که array فقط یک segment داشته باشد
- Matcher از یک regular expression استفاده می‌کند تا مطمئن شود format مربوط به username match است
- اگر match وجود داشته باشد، function کل URL را برمی‌گرداند و یک route parameter به نام `username` را به‌عنوان substringای از path تعریف می‌کند
- اگر match وجود نداشته باشد، function مقدار null برمی‌گرداند و router به جست‌وجو برای routeهای دیگری که با URL match می‌شوند ادامه می‌دهد

HELPFUL: یک URL matcher سفارشی مثل هر route definition دیگری رفتار می‌کند. Child routeها یا lazy loaded routeها را همان‌طور تعریف کنید که برای هر route دیگری انجام می‌دهید.

## خواندن route parameterها

بعد از آماده شدن matcher سفارشی، اکنون می‌توانید route parameter را در component مربوط به `profile` bind کنید.

در code editor، فایل `profile.ts` را باز کنید و یک `input` مطابق با parameter مربوط به `username` بسازید.
پیش‌تر feature مربوط به `withComponentInputBinding` را در `provideRouter` اضافه کردیم.
این کار به `Router` اجازه می‌دهد اطلاعات را مستقیما به route componentها bind کند.

```ts
username = input.required<string>();
```

## تست URL matcher سفارشی

بعد از آماده شدن کد، اکنون می‌توانید URL matcher سفارشی خود را تست کنید.

1. از یک terminal window، دستور `ng serve` را اجرا کنید.

   ```shell
   ng serve
   ```

1. مرورگر را روی `http://localhost:4200` باز کنید.

   باید یک web page ساده ببینید که شامل جمله `Navigate to my profile` است.

1. روی hyperlink مربوط به **my profile** کلیک کنید.

   جمله جدید `Hello, Angular!` روی صفحه ظاهر می‌شود.

## قدم بعدی

Pattern matching با Angular Router وقتی URLهای dynamic در application دارید، انعطاف زیادی به شما می‌دهد.
برای یادگیری بیشتر درباره Angular Router، موضوع‌های زیر را ببینید:

<docs-pill-row>
  <docs-pill href="guide/routing/common-router-tasks" title="Routing و Navigation داخل برنامه"/>
  <docs-pill href="api/router/Router" title="Router API"/>
</docs-pill-row>

HELPFUL: این محتوا بر اساس [Custom Route Matching with the Angular Router](https://medium.com/@brandontroberts/custom-route-matching-with-the-angular-router-fbdd48665483)، نوشته [Brandon Roberts](https://twitter.com/brandontroberts)، تهیه شده است.
