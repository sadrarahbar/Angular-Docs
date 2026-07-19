# تعریف routeها

Routeها بلوک‌های اصلی navigation داخل یک Angular app هستند.

## route چیست؟

در Angular، یک **route** آبجکتی است که مشخص می‌کند برای یک URL path یا pattern مشخص، کدام component باید render شود؛ و همین‌طور optionهای configuration اضافه‌ای را درباره اتفاقی که هنگام navigation کاربر به آن URL رخ می‌دهد تعریف می‌کند.

یک مثال ساده از route:

```ts
import {AdminPage} from './app-admin';

const adminPage = {
  path: 'admin',
  component: AdminPage,
};
```

برای این route، وقتی کاربر path مربوط به `/admin` را باز کند، app، component مربوط به `AdminPage` را نمایش می‌دهد.

### مدیریت routeها در application

بیشتر projectها routeها را در فایلی جداگانه تعریف می‌کنند که در نام آن `routes` وجود دارد.

یک مجموعه route به این شکل است:

```ts
import {Routes} from '@angular/router';
import {HomePage} from './home-page';
import {AdminPage} from './admin-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'admin',
    component: AdminPage,
  },
];
```

Tip: اگر project را با Angular CLI ساخته باشید، routeهای شما در `src/app/app.routes.ts` تعریف شده‌اند.

### اضافه کردن router به application

وقتی یک Angular application را بدون Angular CLI bootstrap می‌کنید، می‌توانید یک configuration object پاس بدهید که شامل arrayای به نام `providers` است.

داخل array مربوط به `providers`، می‌توانید با اضافه کردن call مربوط به function `provideRouter` همراه با routeهای خود، Angular router را به application اضافه کنید.

```ts
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // ...
  ],
};
```

## URL pathهای route

### URL pathهای static

URL pathهای static به routeهایی اشاره دارند که pathهای از پیش تعریف‌شده دارند و بر اساس parameterهای dynamic تغییر نمی‌کنند. این‌ها routeهایی هستند که یک string مربوط به `path` را دقیقا match می‌کنند و نتیجه ثابتی دارند.

نمونه‌ها:

- "/admin"
- "/blog"
- "/settings/account"

### تعریف URL pathها با route parameter

URLهای parameterized به شما اجازه می‌دهند pathهای dynamic تعریف کنید تا چند URL به یک component برسند، در حالی که data بر اساس parameterهای داخل URL به‌صورت dynamic نمایش داده می‌شود.

می‌توانید این نوع pattern را با اضافه کردن parameterها به string مربوط به `path` در route و گذاشتن کاراکتر colon (`:`) قبل از هر parameter تعریف کنید.

IMPORTANT: Parameterها با اطلاعات موجود در [query string](https://en.wikipedia.org/wiki/Query_string) مربوط به URL متفاوت‌اند.
در [این راهنما](/guide/routing/read-route-state#query-parameters) درباره query parameterها در Angular بیشتر یاد بگیرید.

مثال زیر component مربوط به user profile را بر اساس user id پاس‌داده‌شده از طریق URL نمایش می‌دهد.

```ts
import {Routes} from '@angular/router';
import {UserProfile} from './user-profile/user-profile';

const routes: Routes = [{path: 'user/:id', component: UserProfile}];
```

در این مثال، URLهایی مثل `/user/leeroy` و `/user/jenkins`، component مربوط به `UserProfile` را render می‌کنند. سپس این component می‌تواند parameter مربوط به `id` را بخواند و از آن برای کارهای بعدی، مثل fetch کردن data، استفاده کند. برای جزئیات خواندن route parameterها، [راهنمای خواندن route state](/guide/routing/read-route-state) را ببینید.

نام‌های معتبر برای route parameter باید با یک حرف (a-z یا A-Z) شروع شوند و فقط می‌توانند شامل موارد زیر باشند:

- حرف‌ها (a-z، A-Z)
- عددها (0-9)
- Underscore (\_)
- Hyphen (-)

همچنین می‌توانید pathهایی با چند parameter تعریف کنید:

```ts
import {Routes} from '@angular/router';
import {UserProfile} from './user-profile';
import {SocialMediaFeed} from './social-media-feed';

const routes: Routes = [
  {path: 'user/:id/:social-media', component: SocialMediaFeed},
  {path: 'user/:id/', component: UserProfile},
];
```

با این path جدید، کاربران می‌توانند `/user/leeroy/youtube` و `/user/leeroy/bluesky` را باز کنند و بر اساس parameter مربوط به کاربر leeroy، feedهای social media متناظر را ببینند.

برای جزئیات خواندن route parameterها، [Reading route state](/guide/routing/read-route-state) را ببینید.

### Wildcardها

وقتی لازم دارید همه routeهای یک path مشخص را بگیرید، راه‌حل یک wildcard route است که با double asterisk (`**`) تعریف می‌شود.

یک مثال رایج، تعریف component مربوط به Page Not Found است.

```ts
import {Home} from './home/home';
import {UserProfile} from './user-profile';
import {NotFound} from './not-found';

const routes: Routes = [
  {path: 'home', component: Home},
  {path: 'user/:id', component: UserProfile},
  {path: '**', component: NotFound},
];
```

در این array از routeها، وقتی کاربر هر pathای خارج از `home` و `user/:id` را باز کند، app، component مربوط به `NotFound` را نمایش می‌دهد.

Tip: Wildcard routeها معمولا در انتهای array مربوط به routes قرار می‌گیرند.

## Angular چطور URLها را match می‌کند

وقتی routeها را تعریف می‌کنید، ترتیب مهم است، چون Angular از strategy «اولین match برنده است» استفاده می‌کند. یعنی وقتی Angular یک URL را با `path` یک route match کند، بررسی routeهای بعدی را متوقف می‌کند. در نتیجه، همیشه routeهای خاص‌تر را قبل از routeهای عمومی‌تر قرار دهید.

مثال زیر routeها را از خاص‌ترین تا عمومی‌ترین نشان می‌دهد:

```ts
const routes: Routes = [
  {path: '', component: Home}, // Empty path
  {path: 'users/new', component: NewUser}, // Static, most specific
  {path: 'users/:id', component: UserDetail}, // Dynamic
  {path: 'users', component: Users}, // Static, less specific
  {path: '**', component: NotFound}, // Wildcard - always last
];
```

اگر کاربر `/users/new` را باز کند، Angular router این مراحل را طی می‌کند:

1. `''` را بررسی می‌کند - match نمی‌شود
1. `users/new` را بررسی می‌کند - match می‌شود! همین‌جا متوقف می‌شود
1. هرگز به `users/:id` نمی‌رسد، حتی اگر بتواند match شود
1. هرگز به `users` نمی‌رسد
1. هرگز به `**` نمی‌رسد

## Redirectها

می‌توانید routeای تعریف کنید که به‌جای render کردن یک component، به route دیگری redirect کند:

```ts
import {Blog} from './home/blog';

const routes: Routes = [
  {
    path: 'articles',
    redirectTo: '/blog',
  },
  {
    path: 'blog',
    component: Blog,
  },
];
```

اگر routeای را تغییر دهید یا حذف کنید، ممکن است بعضی کاربران هنوز روی linkها یا bookmarkهای قدیمی آن route کلیک کنند. می‌توانید redirect اضافه کنید تا به‌جای صفحه "not found"، آن کاربران را به route جایگزین مناسب هدایت کنید.

## عنوان‌های صفحه

می‌توانید به هر route یک **title** اختصاص دهید. Angular وقتی route فعال می‌شود، [page title](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title) را به‌صورت خودکار به‌روزرسانی می‌کند. همیشه titleهای مناسب برای application خود تعریف کنید، چون این titleها برای ایجاد تجربه accessible لازم هستند.

```ts
import {Routes} from '@angular/router';
import {Home} from './home';
import {About} from './about';
import {Products} from './products';

const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home Page',
  },
  {
    path: 'about',
    component: About,
    title: 'About Us',
  },
];
```

Property مربوط به `title` صفحه می‌تواند با استفاده از [`ResolveFn`](/api/router/ResolveFn) به‌صورت dynamic روی یک resolver function تنظیم شود.

```ts
const titleResolver: ResolveFn<string> = (route) => route.queryParams['id'];
const routes: Routes = [
  ...{
    path: 'products',
    component: Products,
    title: titleResolver,
  },
];
```

Route titleها را همچنین می‌توان از طریق serviceای تنظیم کرد که abstract class مربوط به [`TitleStrategy`](/api/router/TitleStrategy) را extend می‌کند. Angular به‌صورت پیش‌فرض از [`DefaultTitleStrategy`](/api/router/DefaultTitleStrategy) استفاده می‌کند.

### استفاده از TitleStrategy برای عنوان‌های صفحه

برای سناریوهای پیشرفته که به کنترل centralized روی نحوه ساخته شدن document title نیاز دارید، یک `TitleStrategy` پیاده‌سازی کنید.

`TitleStrategy` یک token است که می‌توانید آن را provide کنید تا strategy پیش‌فرض title که Angular استفاده می‌کند override شود. می‌توانید یک `TitleStrategy` سفارشی فراهم کنید تا conventionهایی مثل اضافه کردن suffix application، format کردن titleها از breadcrumbها، یا ساخت dynamic titleها از route data را پیاده‌سازی کند.

```ts
import {inject, Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {TitleStrategy, RouterStateSnapshot} from '@angular/router';

@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  updateTitle(snapshot: RouterStateSnapshot): void {
    // PageTitle is equal to the "Title" of a route if it's set
    // If its not set it will use the "title" given in index.html
    const pageTitle = this.buildTitle(snapshot) || this.title.getTitle();
    this.title.setTitle(`MyAwesomeApp - ${pageTitle}`);
  }
}
```

برای استفاده از strategy سفارشی، آن را با token مربوط به `TitleStrategy` در سطح application provide کنید:

```ts
import {provideRouter, TitleStrategy} from '@angular/router';
import {AppTitleStrategy} from './app-title.strategy';

export const appConfig = {
  providers: [provideRouter(routes), {provide: TitleStrategy, useClass: AppTitleStrategy}],
};
```

## Providerهای route-level برای dependency injection

هر route یک property به نام `providers` دارد که به شما اجازه می‌دهد dependencyها را از طریق [dependency injection](/guide/di) برای content همان route provide کنید.

سناریوهای رایجی که این قابلیت در آن‌ها مفید است شامل applicationهایی است که بسته به admin بودن یا نبودن کاربر، serviceهای متفاوتی دارند.

```ts
export const ROUTES: Route[] = [
  {
    path: 'admin',
    providers: [AdminService, {provide: ADMIN_API_KEY, useValue: '12345'}],
    children: [
      {path: 'users', component: AdminUsers},
      {path: 'teams', component: AdminTeams},
    ],
  },
  // ... other application routes that don't
  //     have access to ADMIN_API_KEY or AdminService.
];
```

در این code sample، path مربوط به `admin` یک data property محافظت‌شده از نوع `ADMIN_API_KEY` دارد که فقط برای childهای داخل همان section در دسترس است. در نتیجه، هیچ path دیگری نمی‌تواند به data فراهم‌شده از طریق `ADMIN_API_KEY` دسترسی پیدا کند.

برای اطلاعات بیشتر درباره providerها و injection در Angular، [راهنمای Dependency injection](/guide/di) را ببینید.

## مرتبط کردن data با routeها

Route data به شما اجازه می‌دهد اطلاعات اضافه‌ای را به routeها attach کنید. می‌توانید بر اساس این data، نحوه رفتار componentها را configure کنید.

دو روش برای کار با route data وجود دارد: static data که ثابت می‌ماند، و dynamic data که می‌تواند بر اساس شرایط runtime تغییر کند.

### Static data

می‌توانید از طریق property مربوط به `data`، data static دلخواهی را به یک route مرتبط کنید تا چیزهایی مثل metadata مخصوص route، مانند analytics tracking، permissionها و غیره، centralized شوند:

```ts
import {Routes} from '@angular/router';
import {Home} from './home';
import {About} from './about';
import {Products} from './products';

const routes: Routes = [
  {
    path: 'about',
    component: About,
    data: {analyticsId: '456'},
  },
  {
    path: '',
    component: Home,
    data: {analyticsId: '123'},
  },
];
```

در این code sample، صفحه home و about با `analyticsId` مشخص configure شده‌اند؛ سپس این مقدار در componentهای متناظر آن‌ها برای analytics مربوط به page tracking استفاده می‌شود.

می‌توانید این static data را با inject کردن `ActivatedRoute` بخوانید. برای جزئیات، [Reading route state](/guide/routing/read-route-state) را ببینید.

### Dynamic data با data resolverها

وقتی لازم دارید dynamic data برای یک route فراهم کنید، [راهنمای route data resolverها](/guide/routing/data-resolvers) را ببینید.

## Nested Routeها

Nested routeها، که با نام child routeها هم شناخته می‌شوند، یک تکنیک رایج برای مدیریت navigation routeهای پیچیده‌تر هستند؛ جایی که یک component یک sub-view دارد که بر اساس URL تغییر می‌کند.

<img alt="Diagram to illustrate nested routes" src="assets/images/guide/router/nested-routing-diagram.svg">

می‌توانید با property مربوط به `children` به هر route definition، child route اضافه کنید:

```ts
const routes: Routes = [
  {
    path: 'product/:id',
    component: Product,
    children: [
      {
        path: 'info',
        component: ProductInfo,
      },
      {
        path: 'reviews',
        component: ProductReviews,
      },
    ],
  },
];
```

مثال بالا routeای برای صفحه محصول تعریف می‌کند که به کاربر اجازه می‌دهد بر اساس URL مشخص کند product info نمایش داده شود یا reviews.

Property مربوط به `children` یک array از objectهای `Route` می‌پذیرد.

برای نمایش child routeها، component والد، یعنی `Product` در مثال بالا، `<router-outlet>` خودش را دارد.

```angular-html
<!-- Product -->
<article>
  <h1>Product {{ id }}</h1>
  <router-outlet />
</article>
```

بعد از اضافه کردن child routeها به configuration و اضافه کردن `<router-outlet>` به component، navigation بین URLهایی که با child routeها match می‌شوند فقط nested outlet را به‌روزرسانی می‌کند.

## قدم بعدی

<docs-pill-row>
  <docs-pill href="/guide/routing/loading-strategies" title="استراتژی‌های بارگذاری Route"/>
  <docs-pill href="/guide/routing/show-routes-with-outlets" title="نمایش محتوای routeها با Outletها"/>
</docs-pill-row>
