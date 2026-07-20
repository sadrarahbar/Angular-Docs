# Server و hybrid rendering

Angular به‌صورت پیش‌فرض همه‌ی applicationها را به شکل client-side rendered یا CSR تحویل می‌دهد. این رویکرد payload اولیه‌ی سبک‌تری دارد، اما trade-offهایی مثل load time کندتر، metricهای performance ضعیف‌تر و نیاز بیشتر به resource را به همراه می‌آورد، چون device کاربر بیشتر محاسبات را انجام می‌دهد. در نتیجه، بسیاری از applicationها با وارد کردن server-side rendering یا SSR در یک strategy از نوع hybrid rendering، بهبودهای performance قابل توجهی می‌گیرند.

## Hybrid rendering چیست؟

Hybrid rendering به developerها اجازه می‌دهد برای بهینه کردن Angular application از مزیت‌های server-side rendering یا SSR، pre-rendering که با نام "static site generation" یا SSG هم شناخته می‌شود، و client-side rendering یا CSR استفاده کنند. این روش کنترل دقیقی می‌دهد تا بخش‌های مختلف app شما چگونه render شوند و بهترین تجربه‌ی ممکن را برای کاربران فراهم کنند.

## راه‌اندازی hybrid rendering

می‌توانید با استفاده از flag مربوط به server-side rendering، یعنی `--ssr`، همراه command مربوط به Angular CLI یعنی `ng new` یک پروژه‌ی **جدید** با hybrid rendering بسازید:

```shell
ng new --ssr
```

همچنین می‌توانید با command مربوط به `ng add`، server-side rendering را به پروژه‌ی موجود اضافه و hybrid rendering را فعال کنید:

```shell
ng add @angular/ssr
```

NOTE: به‌صورت پیش‌فرض، Angular کل application شما را prerender می‌کند و یک server file می‌سازد. برای غیرفعال کردن این رفتار و ساخت یک app کاملا static، مقدار `outputMode` را روی `static` بگذارید. برای فعال کردن SSR، server routeها را به استفاده از `RenderMode.Server` به‌روزرسانی کنید. برای جزئیات بیشتر، [`Server routing`](#server-routing) و [`Generate a fully static application`](#generate-a-fully-static-application) را ببینید.

## Server routing

### پیکربندی server routeها

می‌توانید با declare کردن آرایه‌ای از objectهای [`ServerRoute`](api/ssr/ServerRoute 'API reference')، یک server route config بسازید. این configuration معمولا در فایلی به نام `app.routes.server.ts` قرار می‌گیرد.

```typescript
// app.routes.server.ts
import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '', // This renders the "/" route on the client (CSR)
    renderMode: RenderMode.Client,
  },
  {
    path: 'about', // This page is static, so we prerender it (SSG)
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'profile', // This page requires user-specific data, so we use SSR
    renderMode: RenderMode.Server,
  },
  {
    path: '**', // All other routes will be rendered on the server (SSR)
    renderMode: RenderMode.Server,
  },
];
```

می‌توانید این config را با [`provideServerRendering`](api/ssr/provideServerRendering 'API reference') و با استفاده از function مربوط به [`withRoutes`](api/ssr/withRoutes 'API reference') به application اضافه کنید:

```typescript
import {provideServerRendering, withRoutes} from '@angular/ssr';
import {serverRoutes} from './app.routes.server';

// app.config.server.ts
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // ... other providers ...
  ],
};
```

هنگام استفاده از [App shell pattern](ecosystem/service-workers/app-shell)، باید componentی را مشخص کنید که برای routeهای client-side rendered به‌عنوان app shell استفاده می‌شود. برای این کار از feature مربوط به [`withAppShell`](api/ssr/withAppShell 'API reference') استفاده کنید:

```typescript
import {provideServerRendering, withRoutes, withAppShell} from '@angular/ssr';
import {AppShell} from './app-shell';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes), withAppShell(AppShell)),
    // ... other providers ...
  ],
};
```

### Rendering modeها

server routing configuration به شما اجازه می‌دهد با تنظیم [`RenderMode`](api/ssr/RenderMode 'API reference') مشخص کنید هر route در application شما چگونه render شود:

| Rendering mode      | توضیح |
| ------------------- | ----- |
| **Server (SSR)**    | application را برای هر request روی server render می‌کند و یک HTML page کامل و پرشده به browser می‌فرستد. |
| **Client (CSR)**    | application را در browser render می‌کند. این رفتار پیش‌فرض Angular است. |
| **Prerender (SSG)** | application را در build time prerender می‌کند و برای هر route فایل HTML static می‌سازد. |

#### انتخاب rendering mode

هر rendering mode مزایا و محدودیت‌های متفاوتی دارد. می‌توانید بر اساس نیازهای مشخص application خود rendering modeها را انتخاب کنید.

##### Client-side rendering (CSR)

Client-side rendering ساده‌ترین development model را دارد، چون می‌توانید کدی بنویسید که فرض می‌کند همیشه در web browser اجرا می‌شود. این به شما اجازه می‌دهد از طیف وسیعی از client-side libraryها استفاده کنید که آن‌ها هم فرض می‌کنند در browser اجرا می‌شوند.

Client-side rendering معمولا performance ضعیف‌تری نسبت به rendering modeهای دیگر دارد، چون باید JavaScript صفحه download، parse و execute شود تا کاربر بتواند هر محتوای renderشده‌ای را ببیند. اگر صفحه هنگام render شدن داده‌ی بیشتری از server fetch کند، کاربران باید برای آن requestهای اضافی هم منتظر بمانند تا محتوای کامل را ببینند.

اگر صفحه‌ی شما توسط search crawlerها index می‌شود، client-side rendering ممکن است روی search engine optimization یا SEO اثر منفی بگذارد، چون crawlerها محدودیت‌هایی در مقدار JavaScriptای دارند که هنگام index کردن یک صفحه اجرا می‌کنند.

در client-side rendering، server لازم نیست برای render کردن صفحه کاری فراتر از serve کردن assetهای static JavaScript انجام دهد. اگر server cost برایتان مهم است، می‌توانید این عامل را در نظر بگیرید.

applicationهایی که از تجربه‌های installable و offline با [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) پشتیبانی می‌کنند، می‌توانند بدون نیاز به ارتباط با server به client-side rendering تکیه کنند.

##### Server-side rendering (SSR)

Server-side rendering نسبت به client-side rendering، page load سریع‌تری ارائه می‌دهد. به‌جای اینکه منتظر download و اجرای JavaScript بمانید، server بعد از دریافت request از browser مستقیما یک HTML document render می‌کند. کاربر فقط latency لازم برای fetch کردن داده توسط server و render کردن صفحه‌ی درخواست‌شده را تجربه می‌کند. این mode نیاز به network requestهای اضافی از سمت browser را هم حذف می‌کند، چون code شما می‌تواند هنگام rendering روی server داده را fetch کند.

Server-side rendering معمولا SEO عالی دارد، چون search crawlerها یک HTML document کاملا renderشده دریافت می‌کنند.

Server-side rendering از شما می‌خواهد کدی بنویسید که وابستگی strict به browser APIها نداشته باشد و انتخاب JavaScript libraryهایی را که فرض می‌کنند در browser اجرا می‌شوند محدود می‌کند.

در server-side rendering، server شما Angular را برای تولید HTML response برای هر request اجرا می‌کند و این می‌تواند هزینه‌ی hosting server را افزایش دهد.

##### Build-time prerendering

Prerendering نسبت به client-side rendering و server-side rendering page load سریع‌تری ارائه می‌دهد. چون prerendering، HTML documentها را در _build-time_ می‌سازد، server می‌تواند بدون کار اضافی مستقیما با همان HTML document static به requestها پاسخ دهد.

Prerendering نیاز دارد همه‌ی اطلاعات لازم برای render کردن صفحه در _build-time_ در دسترس باشد. یعنی صفحه‌های prerendered نمی‌توانند داده‌ی مخصوص کاربری را که صفحه را load می‌کند شامل شوند. Prerendering عمدتا برای صفحه‌هایی مفید است که برای همه‌ی کاربران application یکسان هستند.

چون prerendering در build-time رخ می‌دهد، می‌تواند زمان قابل توجهی به production buildهای شما اضافه کند. استفاده از [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') برای تولید تعداد زیادی HTML document می‌تواند روی اندازه‌ی کل فایل‌های deployment اثر بگذارد و در نتیجه deployment را کندتر کند.

Prerendering معمولا SEO عالی دارد، چون search crawlerها یک HTML document کاملا renderشده دریافت می‌کنند.

Prerendering از شما می‌خواهد کدی بنویسید که وابستگی strict به browser APIها نداشته باشد و انتخاب JavaScript libraryهایی را که فرض می‌کنند در browser اجرا می‌شوند محدود می‌کند.

Prerendering سربار بسیار کمی برای هر server request دارد، چون server شما با HTML documentهای static پاسخ می‌دهد. فایل‌های static همچنین به‌راحتی توسط Content Delivery Networkها یا CDNها، browserها و لایه‌های caching میانی cache می‌شوند تا page loadهای بعدی حتی سریع‌تر شوند. سایت‌های کاملا static را می‌توان فقط از طریق CDN یا static file server deploy کرد و نیاز به نگه‌داری custom server runtime برای application را حذف کرد. این کار با برداشتن load از application web server، scalability را بهتر می‌کند و برای applicationهای پرترافیک به‌خصوص مفید است.

NOTE: هنگام استفاده از Angular service worker، request اول server-rendered است، اما همه‌ی requestهای بعدی توسط service worker مدیریت و client-side render می‌شوند.

### تنظیم headerها و status codeها

می‌توانید با propertyهای `headers` و `status` در configuration مربوط به `ServerRoute`، برای server routeهای جداگانه custom header و status code تنظیم کنید.

```typescript
// app.routes.server.ts
import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'profile',
    renderMode: RenderMode.Server,
    headers: {
      'X-My-Custom-Header': 'some-value',
    },
    status: 201,
  },
  // ... other routes
];
```

### Redirectها

Angular redirectهایی را که با property مربوط به [`redirectTo`](api/router/Route#redirectTo 'API reference') در route configuration مشخص می‌شوند، در سمت server متفاوت مدیریت می‌کند.

**Server-Side Rendering (SSR)**
Redirectها در فرایند server-side rendering با HTTP redirectهای استاندارد، مثل 301 و 302، انجام می‌شوند.

**Prerendering (SSG)**
Redirectها به‌صورت "soft redirects" با tagهای [`<meta http-equiv="refresh">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#refresh) در HTML prerendered پیاده‌سازی می‌شوند.

### سفارشی‌سازی build-time prerendering (SSG)

هنگام استفاده از [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference')، می‌توانید چند option پیکربندی را برای customize کردن فرایند prerendering و serving مشخص کنید.

#### Routeهای parameterized

برای هر route با [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference')، می‌توانید functionای به نام [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') مشخص کنید. این function اجازه می‌دهد کنترل کنید کدام parameterهای مشخص، documentهای prerendered جداگانه تولید کنند.

function مربوط به [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') یک `Promise` برمی‌گرداند که به آرایه‌ای از objectها resolve می‌شود. هر object یک key-value map از نام route parameter به value است. مثلا اگر routeای مثل `post/:id` تعریف کنید، `getPrerenderParams ` می‌تواند آرایه‌ی `[{id: 123}, {id: 456}]` را برگرداند و در نتیجه برای `post/123` و `post/456` documentهای جداگانه render کند.

بدنه‌ی [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') می‌تواند از function مربوط به [`inject`](api/core/inject 'API reference') در Angular برای inject کردن dependencyها و انجام هر کاری برای تعیین routeهایی که باید prerender شوند استفاده کند. این معمولا شامل request برای fetch کردن داده و ساخت آرایه‌ی مقدارهای parameter است.

می‌توانید از این function با catch-all routeها هم استفاده کنید، مثلا `/**`، جایی که نام parameter برابر `"**"` است و مقدار برگشتی segmentهای path مثل `foo/bar` خواهد بود. این‌ها می‌توانند با parameterهای دیگر، مثلا `/post/:id/**`، ترکیب شوند تا route configurationهای پیچیده‌تر مدیریت شوند.

```ts
// app.routes.server.ts
import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(PostService);
      const ids = await dataService.getIds(); // Assuming this returns ['1', '2', '3']

      return ids.map((id) => ({id})); // Generates paths like: /post/1, /post/2, /post/3
    },
  },
  {
    path: 'post/:id/**',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [
        {id: '1', '**': 'foo/3'},
        {id: '2', '**': 'bar/4'},
      ]; // Generates paths like: /post/1/foo/3, /post/2/bar/4
    },
  },
];
```

چون [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') فقط برای [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference') اعمال می‌شود، این function همیشه در _build-time_ اجرا می‌شود. `getPrerenderParams` نباید برای داده به browser-specific یا server-specific APIها تکیه کند.

IMPORTANT: هنگام استفاده از [`inject`](api/core/inject 'API reference') داخل `getPrerenderParams`، به خاطر داشته باشید که `inject` باید synchronous استفاده شود. نمی‌توان آن را داخل asynchronous callbackها یا بعد از statementهای `await` فراخوانی کرد. برای اطلاعات بیشتر به `runInInjectionContext` مراجعه کنید.

#### Fallback strategyها

هنگام استفاده از mode مربوط به [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference')، می‌توانید fallback strategy مشخص کنید تا requestهای مربوط به pathهایی که prerender نشده‌اند مدیریت شوند.

fallback strategyهای در دسترس:

- **Server:** به server-side rendering fallback می‌کند. اگر property مربوط به `fallback` مشخص نشود، این رفتار **پیش‌فرض** است.
- **Client:** به client-side rendering fallback می‌کند.
- **None:** بدون fallback. Angular requestهای مربوط به pathهایی را که prerender نشده‌اند مدیریت نمی‌کند.

```ts
// app.routes.server.ts
import {RenderMode, PrerenderFallback, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client, // Fallback to CSR if not prerendered
    async getPrerenderParams() {
      // This function returns an array of objects representing prerendered posts at the paths:
      // `/post/1`, `/post/2`, and `/post/3`.
      // The path `/post/4` will utilize the fallback behavior if it's requested.
      return [{id: 1}, {id: 2}, {id: 3}];
    },
  },
];
```

## نوشتن componentهای سازگار با server

بعضی APIها و قابلیت‌های رایج browser ممکن است روی server در دسترس نباشند. applicationها نمی‌توانند از global objectهای مخصوص browser مثل `window`، `document`، `navigator` یا `location` و همچنین بعضی propertyهای `HTMLElement` استفاده کنند.

به‌طور کلی، codeای که به symbolهای مخصوص browser تکیه دارد باید فقط در browser اجرا شود، نه روی server. این را می‌توان با lifecycle hookهای `afterEveryRender` و `afterNextRender` enforce کرد. این hookها فقط در browser اجرا می‌شوند و روی server skip می‌شوند.

```angular-ts
import {Component, viewChild, afterNextRender} from '@angular/core';

@Component({
  selector: 'my-cmp',
  template: `<span #content>{{ ... }}</span>`,
})
export class MyComponent {
  contentRef = viewChild.required<ElementRef>('content');

  constructor() {
    afterNextRender(() => {
      // Safe to check `scrollHeight` because this will only run in the browser, not the server.
      console.log('content height: ' + this.contentRef().nativeElement.scrollHeight);
    });
  }
}
```

NOTE: به‌جای runtime check با `isPlatformBrowser` یا `isPlatformServer`، [platform-specific providers](guide/ssr#providing-platform-specific-implementations) را ترجیح دهید.

IMPORTANT: از استفاده‌ی `isPlatformBrowser` در templateها همراه با `@if` یا conditionalهای دیگر برای render کردن محتوای متفاوت روی server و client خودداری کنید. این کار hydration mismatch و layout shift ایجاد می‌کند و روی تجربه‌ی کاربر و [Core Web Vitals](https://web.dev/learn-core-web-vitals/) اثر منفی می‌گذارد. به‌جای آن، برای initialization مخصوص browser از `afterNextRender` استفاده کنید و محتوای renderشده را در platformهای مختلف consistent نگه دارید.

## تنظیم providerها روی server

در سمت server، مقدارهای top level provider یک‌بار وقتی application code برای اولین بار parse و evaluate می‌شود set می‌شوند. یعنی providerهایی که با `useValue` پیکربندی شده‌اند مقدارشان را در چند request نگه می‌دارند، تا زمانی که server application restart شود.

اگر می‌خواهید برای هر request مقدار جدیدی generate کنید، از factory provider با `useFactory` استفاده کنید. factory function برای هر request ورودی اجرا می‌شود و تضمین می‌کند هر بار مقدار جدیدی ساخته و به token اختصاص داده شود.

## فراهم کردن پیاده‌سازی‌های platform-specific

وقتی application شما در browser و server رفتار متفاوتی نیاز دارد، برای هر platform پیاده‌سازی service جداگانه فراهم کنید. این رویکرد platform logic را در serviceهای اختصاصی متمرکز می‌کند.

```ts
export abstract class AnalyticsService {
  abstract trackEvent(name: string): void;
}
```

پیاده‌سازی browser را بسازید:

```ts
@Injectable()
export class BrowserAnalyticsService implements AnalyticsService {
  trackEvent(name: string): void {
    // Sends the event to the browser-based third-party analytics provider
  }
}
```

پیاده‌سازی server را بسازید:

```ts
@Injectable()
export class ServerAnalyticsService implements AnalyticsService {
  trackEvent(name: string): void {
    // Records the event on the server
  }
}
```

پیاده‌سازی browser را در main application configuration register کنید:

```ts
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [{provide: AnalyticsService, useClass: BrowserAnalyticsService}],
};
```

در server configuration با پیاده‌سازی server override کنید:

```ts
// app.config.server.ts
const serverConfig: ApplicationConfig = {
  providers: [{provide: AnalyticsService, useClass: ServerAnalyticsService}],
};
```

service را در componentهای خود inject و استفاده کنید:

```ts
@Component(/* ... */)
export class Checkout {
  private analytics = inject(AnalyticsService);

  onAction() {
    this.analytics.trackEvent('action');
  }
}
```

## دسترسی به Document از طریق DI

هنگام کار با server-side rendering، باید از reference مستقیم به globalهای مخصوص browser مثل `document` خودداری کنید. به‌جای آن، از token مربوط به [`DOCUMENT`](api/core/DOCUMENT) استفاده کنید تا به document object به شکلی platform-agnostic دسترسی داشته باشید.

```ts
import {inject, DOCUMENT, Service} from '@angular/core';

@Service()
export class CanonicalLinkService {
  private readonly document = inject(DOCUMENT);

  // During server rendering, inject a <link rel="canonical"> tag
  // so the generated HTML includes the correct canonical URL
  setCanonical(href: string): void {
    const link = this.document.createElement('link');
    link.rel = 'canonical';
    link.href = href;
    this.document.head.appendChild(link);
  }
}
```

HELPFUL: برای مدیریت meta tagها، Angular service مربوط به `Meta` را فراهم می‌کند.

## دسترسی به Request و Response از طریق DI

package مربوط به `@angular/core` چند token برای تعامل با environment مربوط به server-side rendering فراهم می‌کند. این tokenها هنگام SSR در Angular application شما به اطلاعات و objectهای مهم دسترسی می‌دهند.

- **[`REQUEST`](api/core/REQUEST 'API reference'):** به request object فعلی دسترسی می‌دهد که از نوع [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) در Web API است. این اجازه می‌دهد به headerها، cookieها و اطلاعات دیگر request دسترسی داشته باشید.
- **[`RESPONSE_INIT`](api/core/RESPONSE_INIT 'API reference'):** به response initialization options دسترسی می‌دهد که از نوع [`ResponseInit`](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#parameters) در Web API است. این اجازه می‌دهد headerها و status code مربوط به response را به‌صورت dynamic تنظیم کنید. از این token برای تنظیم headerها یا status codeهایی استفاده کنید که باید در runtime تعیین شوند.
- **[`REQUEST_CONTEXT`](api/core/REQUEST_CONTEXT 'API reference'):** به context اضافی مرتبط با request فعلی دسترسی می‌دهد. این context می‌تواند به‌عنوان parameter دوم function مربوط به [`handle`](api/ssr/AngularAppEngine#handle 'API reference') پاس داده شود. معمولا از آن برای فراهم کردن اطلاعات مرتبط با request استفاده می‌شود که بخشی از Web API استاندارد نیستند.

```angular-ts
import {inject, REQUEST} from '@angular/core';

@Component({
  selector: 'app-my-component',
  template: `<h1>My Component</h1>`,
})
export class MyComponent {
  constructor() {
    const request = inject(REQUEST);
    console.log(request?.url);
  }
}
```

<!-- UL is used below as otherwise the list will not be include as part of the note. -->
<!-- prettier-ignore-start -->

IMPORTANT: tokenهای بالا در سناریوهای زیر `null` خواهند بود:<ul class="docs-list">
  <li>During the build processes.</li>
  <li>When the application is rendered in the browser (CSR).</li>
  <li>When performing static site generation (SSG).</li>
  <li>During route extraction in development (at the time of the request).</li>
</ul>

<!-- prettier-ignore-end -->

## ساخت یک application کاملا static

به‌صورت پیش‌فرض، Angular کل application شما را prerender می‌کند و برای مدیریت requestها یک server file می‌سازد. این به app شما اجازه می‌دهد محتوای pre-rendered را به کاربران serve کند. با این حال، اگر یک سایت کاملا static بدون server را ترجیح می‌دهید، می‌توانید با تنظیم `outputMode` روی `static` در فایل configuration مربوط به `angular.json` از این رفتار خارج شوید.

وقتی `outputMode` روی `static` تنظیم شود، Angular در build time برای هر route فایل HTML pre-rendered تولید می‌کند، اما server file تولید نمی‌کند و برای serve کردن app به Node.js server نیاز ندارد. این برای deploy روی static hosting providerهایی مفید است که backend server لازم ندارند.

برای پیکربندی این حالت، فایل `angular.json` را به شکل زیر به‌روزرسانی کنید:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "outputMode": "static"
          }
        }
      }
    }
  }
}
```

## Cache کردن داده هنگام استفاده از HttpClient

`HttpClient` هنگام اجرا روی server، network requestهای خروجی را cache می‌کند. این اطلاعات serialize می‌شود و به‌عنوان بخشی از HTML اولیه‌ی ارسال‌شده از server به browser منتقل می‌شود. در browser، `HttpClient` بررسی می‌کند آیا داده‌ای در cache دارد یا نه؛ اگر داشته باشد، هنگام rendering اولیه‌ی application به‌جای ساخت HTTP request جدید، همان را reuse می‌کند. وقتی application هنگام اجرا در browser [stable](api/core/ApplicationRef#isStable) شود، `HttpClient` دیگر از cache استفاده نمی‌کند.

### پیکربندی محدودیت اندازه‌ی response body

وقتی `HttpClient` هنگام server-side rendering از fetch backend پیش‌فرض استفاده می‌کند، Angular هر response body را به 1 MB محدود می‌کند. این محدودیت مانع می‌شود server هنگام rendering responseهای غیرمنتظره بزرگ را buffer کند. اگر response از limit پیکربندی‌شده بیشتر شود، request با error مربوط به [NG02825](errors/NG02825) fail می‌شود.

اگر application شما هنگام server rendering نیاز دارد responseهای بزرگ‌تری fetch کند، `maxResponseBodySize` را در optionهای `provideServerRendering` تنظیم کنید:

```ts
import {provideServerRendering, withRoutes} from '@angular/ssr';
import {serverRoutes} from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(
      {
        maxResponseBodySize: 5 * 1024 * 1024, // 5MB
      },
      withRoutes(serverRoutes),
    ),
  ],
};
```

`maxResponseBodySize` بر حسب byte پیکربندی می‌شود و به‌صورت global روی requestهای server-side مربوط به `HttpClient` اعمال می‌شود که از fetch backend استفاده می‌کنند.

IMPORTANT: این limit را تا جایی که application شما اجازه می‌دهد کوچک نگه دارید. افزایش آن به requestهای server-side اجازه می‌دهد response bodyهای بزرگ‌تری buffer کنند، که می‌تواند memory use و denial-of-service risk را افزایش دهد. بهتر است downloadهای بزرگ را بیرون از server rendering منتقل کنید.

### پیکربندی caching optionها

می‌توانید با پیکربندی `HttpTransferCacheOptions` customize کنید Angular هنگام server-side rendering یا SSR، HTTP responseها را چطور cache کند و هنگام hydration چطور آن‌ها را reuse کند.  
این configuration به‌صورت global با `withHttpTransferCacheOptions` داخل `provideClientHydration()` فراهم می‌شود.

به‌صورت پیش‌فرض، `HttpClient` همه‌ی requestهای `HEAD` و `GET` را cache می‌کند که headerهای `Authorization`، `Proxy-Authorization` یا `Cookie` ندارند و با `withCredentials` یا modeهای `credentials` مربوط به Fetch API که می‌توانند credential بفرستند ارسال نشده‌اند. Angular همچنین وقتی request یا response شامل directiveهای `Cache-Control` باشد که caching را ممنوع می‌کنند، یعنی `no-store`، `no-cache` یا `private`، یا وقتی option مربوط به `cache` در Fetch API روی `no-store` یا `no-cache` تنظیم شده باشد، transfer cache را skip می‌کند. responseهایی که header مربوط به `Set-Cookie` دارند هم skip می‌شوند. می‌توانید تنظیمات filtering request را با استفاده از `withHttpTransferCacheOptions` در hydration configuration override کنید.

```ts
import {bootstrapApplication} from '@angular/platform-browser';
import {provideClientHydration, withHttpTransferCacheOptions} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [
    provideClientHydration(
      withHttpTransferCacheOptions({
        includeHeaders: ['ETag', 'Cache-Control'],
        filter: (req) => !req.url.includes('/api/profile'),
        includePostRequests: true,
        includeRequestsWithAuthHeaders: false,
      }),
    ),
  ],
});
```

### `includeHeaders`

مشخص می‌کند کدام headerها از server response باید در entryهای cacheشده قرار بگیرند.  
به‌صورت پیش‌فرض هیچ headerی شامل نمی‌شود.

```ts
withHttpTransferCacheOptions({
  includeHeaders: ['ETag', 'Cache-Control'],
});
```

IMPORTANT: از شامل کردن headerهای حساس مثل authentication tokenها خودداری کنید. این‌ها می‌توانند داده‌ی مخصوص کاربر را بین requestها leak کنند.

شامل کردن `Cache-Control` در `includeHeaders` فقط آن header را روی response hydrated در دسترس قرار می‌دهد. Angular هنگام تصمیم‌گیری درباره‌ی اینکه یک request یا response واجد شرایط transfer cache هست یا نه، از قبل headerهای `Cache-Control` را به‌صورت خودکار evaluate می‌کند.

### `includePostRequests`

به‌صورت پیش‌فرض، فقط requestهای `GET` و `HEAD` cache می‌شوند.  
می‌توانید caching را برای requestهای `POST` فعال کنید، وقتی به‌عنوان read operation مثل GraphQL query استفاده می‌شوند.

```ts
withHttpTransferCacheOptions({
  includePostRequests: true,
});
```

فقط زمانی از این استفاده کنید که requestهای `POST` **idempotent** باشند و reuse کردنشان بین renderهای server و client امن باشد.

### `includeRequestsWithAuthHeaders`

تعیین می‌کند requestهایی که headerهای `Authorization`، `Proxy‑Authorization` یا `Cookie` دارند واجد شرایط caching هستند یا نه.  
به‌صورت پیش‌فرض، این‌ها exclude می‌شوند تا از cache شدن responseهای مخصوص کاربر جلوگیری شود.

```ts
withHttpTransferCacheOptions({
  includeRequestsWithAuthHeaders: true,
});
```

فقط زمانی فعال کنید که authentication headerها روی محتوای response اثر نمی‌گذارند، مثلا tokenهای عمومی برای analytics APIها.

### `includeRequestsWithCredentials`

تعیین می‌کند requestهایی که با `withCredentials` یا modeهای `credentials` در Fetch API، یعنی `include` یا `same-origin`، ارسال شده‌اند واجد شرایط caching هستند یا نه.  
به‌صورت پیش‌فرض، این‌ها exclude می‌شوند تا از cache شدن responseهای مخصوص کاربر جلوگیری شود.

```ts
withHttpTransferCacheOptions({
  includeRequestsWithCredentials: true,
});
```
