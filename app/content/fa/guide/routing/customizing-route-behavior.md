# سفارشی‌سازی رفتار route

Angular Router extension pointهای قدرتمندی فراهم می‌کند که به شما اجازه می‌دهند نحوه رفتار routeها در application خود را سفارشی کنید. هرچند رفتار پیش‌فرض routing برای بیشتر applicationها خوب کار می‌کند، requirementهای خاص اغلب برای performance optimization، مدیریت URLهای خاص، یا routing logic پیچیده به implementationهای سفارشی نیاز دارند.

Route customization زمانی ارزشمند می‌شود که application شما به موارد زیر نیاز داشته باشد:

- **حفظ component state** بین navigationها برای جلوگیری از fetch دوباره data
- **Lazy module loading استراتژیک** بر اساس رفتار کاربر یا شرایط network
- **Integration با URLهای خارجی** یا مدیریت routeهای Angular در کنار سیستم‌های legacy
- **Dynamic route matching** بر اساس شرایط runtime فراتر از path patternهای ساده

NOTE: قبل از پیاده‌سازی strategyهای سفارشی، مطمئن شوید رفتار پیش‌فرض router نیاز شما را برآورده نمی‌کند. Routing پیش‌فرض Angular برای use caseهای رایج optimized شده و بهترین تعادل بین performance و سادگی را فراهم می‌کند. سفارشی‌سازی route strategyها می‌تواند complexity کد را بیشتر کند و اگر با دقت مدیریت نشود، روی مصرف memory اثر performance داشته باشد.

## Router configuration optionها

`withRouterConfig` یا `RouterModule.forRoot` اجازه می‌دهد `RouterConfigOptions` اضافه فراهم کنید تا رفتار Router تنظیم شود.

### مدیریت navigationهای cancel شده

`canceledNavigationResolution` کنترل می‌کند وقتی یک navigation cancel می‌شود، Router چطور browser history را restore کند. مقدار پیش‌فرض `'replace'` است که با `location.replaceState` به URL قبل از navigation برمی‌گردد. در عمل یعنی هر زمانی که address bar از قبل برای navigation به‌روزرسانی شده باشد، مثلا با دکمه‌های back یا forward مرورگر، اگر navigation fail شود یا توسط guard رد شود، history entry با "rollback" overwrite می‌شود.
تغییر به `'computed'`، history index در حال اجرا را با Angular navigation هماهنگ نگه می‌دارد؛ بنابراین cancel شدن یک navigation با دکمه back باعث trigger شدن یک navigation رو به جلو می‌شود و برعکس، تا به صفحه اصلی برگردد.

این setting وقتی بیشترین کاربرد را دارد که app شما از `urlUpdateStrategy: 'eager'` استفاده می‌کند یا guardها زیاد navigationهای popstate شروع‌شده توسط مرورگر را cancel می‌کنند.

```ts
provideRouter(routes, withRouterConfig({canceledNavigationResolution: 'computed'}));
```

### واکنش به navigationهای same-URL

`onSameUrlNavigation` configure می‌کند وقتی کاربر درخواست navigate به URL فعلی را دارد چه اتفاقی بیفتد. مقدار پیش‌فرض `'ignore'` کار را skip می‌کند، در حالی که `'reload'` دوباره guardها و resolverها را اجرا می‌کند و component instanceها را refresh می‌کند.

این قابلیت وقتی مفید است که می‌خواهید کلیک‌های تکراری روی list filter، item در left-nav، یا refresh button با وجود تغییر نکردن URL، data retrieval جدیدی trigger کنند.

```ts
provideRouter(routes, withRouterConfig({onSameUrlNavigation: 'reload'}));
```

همچنین می‌توانید این behavior را برای navigationهای جداگانه کنترل کنید، نه به‌صورت global. این کار اجازه می‌دهد default مربوط به `'ignore'` را نگه دارید و فقط برای use caseهای مشخص، reload behavior را فعال کنید:

```ts
router.navigate(['/some-path'], {onSameUrlNavigation: 'reload'});
```

### کنترل به ارث رسیدن parameterها

`paramsInheritanceStrategy` تعریف می‌کند route parameterها و data چطور از routeهای والد جریان پیدا کنند.

به‌صورت پیش‌فرض، یعنی `'always'`، child routeها به‌صورت خودکار parameterها، route data و resolved valueها را از routeهای والد به ارث می‌برند.

```ts
provideRouter(routes, withRouterConfig({paramsInheritanceStrategy: 'emptyOnly'}));
```

```ts
export const routes: Routes = [
  {
    path: 'org/:orgId',
    component: Organization,
    children: [
      {
        path: 'projects/:projectId',
        component: Project,
        children: [
          {
            path: 'customers/:customerId',
            component: Customer,
          },
        ],
      },
    ],
  },
];
```

```ts
@Component({
  /* ... */
})
export class Customer {
  private route = inject(ActivatedRoute);

  orgId = this.route.parent?.parent?.snapshot.params['orgId'];
  projectId = this.route.parent?.snapshot.params['projectId'];
  customerId = this.route.snapshot.params['customerId'];
}
```

این کار مطمئن می‌شود matrix parameterها، route data و resolved valueها در بخش‌های پایین‌تر route tree در دسترس باشند؛ چیزی که وقتی contextual identifierها را بین feature areaها share می‌کنید کاربردی است، مثل:

```text {hideCopy}
/org/:orgId/projects/:projectId/customers/:customerId
```

```ts
@Component({
  /* ... */
})
export class Customer {
  private route = inject(ActivatedRoute);

  // All parent parameters are available directly
  orgId = this.route.snapshot.params['orgId'];
  projectId = this.route.snapshot.params['projectId'];
  customerId = this.route.snapshot.params['customerId'];
}
```

### تصمیم‌گیری درباره زمان update شدن URL

`urlUpdateStrategy` مشخص می‌کند Angular چه زمانی در address bar مرورگر بنویسد. مقدار پیش‌فرض `'deferred'` قبل از تغییر URL منتظر navigation موفق می‌ماند. از `'eager'` استفاده کنید تا URL بلافاصله هنگام شروع navigation به‌روزرسانی شود. Updateهای eager نشان دادن URL تلاش‌شده را در صورت fail شدن navigation به‌خاطر guardها یا errorها آسان‌تر می‌کنند، اما اگر guardهای طولانی‌اجرا داشته باشید ممکن است برای مدت کوتاهی URL در حال پردازش را نشان دهند.

وقتی analytics pipeline شما لازم دارد route تلاش‌شده را حتی اگر guardها آن را block کنند ببیند، این مورد را در نظر بگیرید.

```ts
provideRouter(routes, withRouterConfig({urlUpdateStrategy: 'eager'}));
```

### انتخاب default query parameter handling

`defaultQueryParamsHandling` رفتار fallback مربوط به `Router.createUrlTree` را وقتی call مقدار `queryParamsHandling` مشخص نکرده باشد تنظیم می‌کند. `'replace'` مقدار پیش‌فرض است و query string موجود را جایگزین می‌کند. `'merge'` مقدارهای فراهم‌شده را با مقدارهای فعلی ترکیب می‌کند، و `'preserve'` query parameterهای موجود را نگه می‌دارد مگر اینکه به‌صورت explicit مقدارهای جدید فراهم کنید.

```ts
provideRouter(routes, withRouterConfig({defaultQueryParamsHandling: 'merge'}));
```

این مورد به‌خصوص برای صفحه‌های search و filter مفید است تا وقتی parameterهای اضافه فراهم می‌شوند، filterهای موجود به‌صورت خودکار حفظ شوند.

### Configure کردن trailing slash handling

به‌صورت پیش‌فرض، service مربوط به `Location` هنگام خواندن URL، trailing slashها را حذف می‌کند.

می‌توانید با provide کردن `TrailingSlashPathLocationStrategy` در application، service مربوط به `Location` را configure کنید تا روی همه URLهایی که در مرورگر نوشته می‌شوند trailing slash اجباری باشد.

```ts
import {LocationStrategy, TrailingSlashPathLocationStrategy} from '@angular/common';

bootstrapApplication(App, {
  providers: [{provide: LocationStrategy, useClass: TrailingSlashPathLocationStrategy}],
});
```

همچنین می‌توانید با provide کردن `NoTrailingSlashPathLocationStrategy` در application، service مربوط به `Location` را مجبور کنید هیچ URLای که در مرورگر نوشته می‌شود trailing slash نداشته باشد.

```ts
import {LocationStrategy, NoTrailingSlashPathLocationStrategy} from '@angular/common';

bootstrapApplication(App, {
  providers: [{provide: LocationStrategy, useClass: NoTrailingSlashPathLocationStrategy}],
});
```

این strategyها فقط روی URLای اثر می‌گذارند که در مرورگر نوشته می‌شود.
`Location.path()` و `Location.normalize()` هنگام خواندن URL همچنان trailing slashها را حذف می‌کنند.

Angular Router چهار حوزه اصلی برای customization ارائه می‌کند:

  <docs-pill-row>
    <docs-pill href="#route-reuse-strategy" title="Route reuse strategy"/>
    <docs-pill href="#preloading-strategy" title="Preloading strategy"/>
    <docs-pill href="#url-handling-strategy" title="URL handling strategy"/>
    <docs-pill href="#custom-route-matchers" title="Custom route matchers"/>
  </docs-pill-row>

## Route reuse strategy

Route reuse strategy کنترل می‌کند آیا Angular هنگام navigation، componentها را destroy و recreate کند یا آن‌ها را برای reuse حفظ کند. به‌صورت پیش‌فرض، Angular هنگام خارج شدن از یک route، component instanceها را destroy می‌کند و هنگام برگشتن به آن route، instanceهای جدید می‌سازد.

### چه زمانی route reuse را پیاده‌سازی کنیم

Custom route reuse strategyها برای applicationهایی مفیدند که به موارد زیر نیاز دارند:

- **حفظ form state** - Formهای نیمه‌کامل را وقتی کاربران از صفحه خارج می‌شوند و برمی‌گردند نگه دارید
- **نگه‌داری data گران‌هزینه** - از fetch دوباره datasetهای بزرگ یا calculationهای پیچیده جلوگیری کنید
- **حفظ scroll position** - Scroll position را در listهای طولانی یا implementationهای infinite scroll حفظ کنید
- **Interfaceهای شبیه tab** - هنگام جابه‌جایی بین tabها، component state را نگه دارید

### ساخت یک route reuse strategy سفارشی

Class مربوط به `RouteReuseStrategy` در Angular به شما اجازه می‌دهد navigation behavior را از طریق مفهوم "detached route handle" سفارشی کنید.

"Detached route handle"ها روش Angular برای ذخیره کردن component instanceها و کل view hierarchy آن‌ها هستند. وقتی یک route detached می‌شود، Angular، component instance، child componentهای آن و همه state مرتبط را در memory حفظ می‌کند. این state حفظ‌شده می‌تواند بعدا هنگام navigation برگشتی به همان route دوباره reattach شود.

Class مربوط به `RouteReuseStrategy` methodهای زیر را فراهم می‌کند که lifecycle مربوط به route componentها را کنترل می‌کنند:

| Method                                                                         | Description                                                                                                      |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| [`shouldDetach`](api/router/RouteReuseStrategy#shouldDetach)                   | مشخص می‌کند آیا route هنگام navigation دور شدن باید برای reuse بعدی ذخیره شود یا نه                              |
| [`store`](api/router/RouteReuseStrategy#store)                                 | وقتی `shouldDetach` مقدار true برگرداند، detached route handle را ذخیره می‌کند                                   |
| [`shouldAttach`](api/router/RouteReuseStrategy#shouldAttach)                   | مشخص می‌کند آیا هنگام navigation به یک route، route ذخیره‌شده باید reattach شود یا نه                            |
| [`retrieve`](api/router/RouteReuseStrategy#retrieve)                           | Route handle ذخیره‌شده قبلی را برای reattachment برمی‌گرداند                                                     |
| [`shouldReuseRoute`](api/router/RouteReuseStrategy#shouldReuseRoute)           | مشخص می‌کند آیا router هنگام navigation باید instance فعلی route را به‌جای destroy کردن آن reuse کند یا نه        |
| [`shouldDestroyInjector`](api/router/RouteReuseStrategy#shouldDestroyInjector) | (Experimental) مشخص می‌کند وقتی یک detached route دیگر ذخیره نیست، router باید injector آن را destroy کند یا نه  |

مثال زیر یک route reuse strategy سفارشی را نشان می‌دهد که component state را بر اساس route metadata به‌صورت انتخابی حفظ می‌کند:

```ts
import {
  RouteReuseStrategy,
  Route,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private handlers = new Map<Route | null, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Determines if a route should be stored for later reuse
    return route.data['reuse'] === true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    // Stores the detached route handle when shouldDetach returns true
    if (handle && route.data['reuse'] === true) {
      const key = this.getRouteKey(route);
      this.handlers.set(key, handle);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // Checks if a stored route should be reattached
    const key = this.getRouteKey(route);
    return route.data['reuse'] === true && this.handlers.has(key);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    // Returns the stored route handle for reattachment
    const key = this.getRouteKey(route);
    return route.data['reuse'] === true ? (this.handlers.get(key) ?? null) : null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // Determines if the router should reuse the current route instance
    return future.routeConfig === curr.routeConfig;
  }

  private getRouteKey(route: ActivatedRouteSnapshot): Route | null {
    return route.routeConfig;
  }
}
```

### Destroy کردن دستی detached route handleها

وقتی یک `RouteReuseStrategy` سفارشی پیاده‌سازی می‌کنید، ممکن است لازم باشد اگر تصمیم گرفتید یک `DetachedRouteHandle` را بدون reattach کردن دور بیندازید، آن را به‌صورت دستی destroy کنید. برای مثال، اگر strategy شما محدودیت cache size دارد یا handleها را بعد از زمان مشخصی expire می‌کند، باید مطمئن شوید component و state آن درست destroy می‌شوند تا memory leak ایجاد نشود.

از آنجا که `DetachedRouteHandle` یک type opaque است، نمی‌توانید مستقیما روی آن destroy method صدا بزنید. در عوض، از function مربوط به `destroyDetachedRouteHandle` که توسط Router فراهم شده استفاده کنید.

```ts
import {destroyDetachedRouteHandle} from '@angular/router';

// ... inside your strategy
if (this.handles.size > MAX_CACHE_SIZE) {
  const handle = this.handles.get(oldestKey);
  if (handle) {
    destroyDetachedRouteHandle(handle);
    this.handles.delete(oldestKey);
  }
}
```

NOTE: وقتی guardهای `canMatch` دخیل هستند، از route path به‌عنوان key استفاده نکنید، چون ممکن است باعث duplicate entry شود.

### (Experimental) Cleanup خودکار injectorهای route استفاده‌نشده

به‌صورت پیش‌فرض، Angular injectorهای routeهای detached را destroy نمی‌کند، حتی اگر دیگر توسط `RouteReuseStrategy` ذخیره نشده باشند. دلیل اصلی این است که این سطح از memory management برای بیشتر applicationها معمولا لازم نیست.

برای فعال کردن cleanup خودکار injectorهای route استفاده‌نشده، می‌توانید در router configuration خود از feature مربوط به `withExperimentalAutoCleanupInjectors` استفاده کنید. این feature بعد از navigationها بررسی می‌کند کدام routeها در حال حاضر توسط strategy ذخیره شده‌اند و injectorهای هر detached routeای را که اکنون توسط reuse strategy ذخیره نشده destroy می‌کند.

```ts
import {provideRouter, withExperimentalAutoCleanupInjectors} from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withExperimentalAutoCleanupInjectors())],
};
```

اگر custom `RouteReuseStrategy` فراهم نکنید یا strategy سفارشی شما `BaseRouteReuseStrategy` را extend کند، اکنون وقتی route inactive شود، injectorها destroy می‌شوند.

#### Cleanup با custom `RouteReuseStrategy`

اگر application شما از custom `RouteReuseStrategy` استفاده می‌کند _و_ آن strategy، `BaseRouteReuseStrategy` را extend نمی‌کند، باید `shouldDestroyInjector` را پیاده‌سازی کنید تا به router بگویید injector کدام routeها باید destroy شود:

```ts
@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  // ... other methods

  shouldDestroyInjector(route: Route): boolean {
    return !route.data['retainInjector'];
  }
}
```

اگر strategy شما جایی یک `DetachedRouteHandle` ذخیره می‌کند، باید این موارد را هم به Router اعلام کنید تا injectorهایی را که آن detached handle نیاز دارد destroy نکند:

```ts
@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private readonly handles = new Map<Route, DetachedRouteHandle>();

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null) {
    this.handles.set(route.routeConfig!, handle);
  }

  retrieveStoredRouteHandles(): DetachedRouteHandle {
    return Array.from(this.handles.values());
  }

  // ... other methods
}
```

### Configure کردن route برای استفاده از route reuse strategy سفارشی

Routeها می‌توانند از طریق metadata مربوط به route configuration وارد reuse behavior شوند. این رویکرد reuse logic را از component code جدا نگه می‌دارد و تغییر behavior را بدون تغییر componentها آسان می‌کند:

```ts
export const routes: Routes = [
  {
    path: 'products',
    component: ProductList,
    data: {reuse: true}, // Component state persists across navigations
  },
  {
    path: 'products/:id',
    component: ProductDetail,
    // No reuse flag - component recreates on each navigation
  },
  {
    path: 'search',
    component: Search,
    data: {reuse: true}, // Preserves search results and filter state
  },
];
```

همچنین می‌توانید یک route reuse strategy سفارشی را از طریق dependency injection system در سطح application configure کنید. در این حالت، Angular یک instance واحد از strategy می‌سازد که همه تصمیم‌های route reuse را در سراسر application مدیریت می‌کند:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy},
  ],
};
```

## Preloading strategy

Preloading strategyها مشخص می‌کنند Angular چه زمانی lazy-loaded route moduleها را در background load کند. هرچند lazy loading با عقب انداختن download moduleها initial load time را بهتر می‌کند، کاربران همچنان هنگام اولین navigation به یک lazy route تاخیر تجربه می‌کنند. Preloading strategyها با load کردن moduleها قبل از اینکه کاربران آن‌ها را درخواست کنند، این تاخیر را حذف می‌کنند.

### Preloading strategyهای built-in

Angular دو preloading strategy آماده فراهم می‌کند:

| Strategy                                            | Description                                                                                                      |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [`NoPreloading`](api/router/NoPreloading)           | Strategy پیش‌فرض که همه preloading را غیرفعال می‌کند. به بیان دیگر، moduleها فقط وقتی load می‌شوند که کاربران به آن‌ها navigate کنند |
| [`PreloadAllModules`](api/router/PreloadAllModules) | همه lazy-loaded moduleها را بلافاصله بعد از initial navigation load می‌کند                                      |

Strategy مربوط به `PreloadAllModules` را می‌توان به شکل زیر configure کرد:

```ts
import {ApplicationConfig} from '@angular/core';
import {provideRouter, withPreloading, PreloadAllModules} from '@angular/router';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withPreloading(PreloadAllModules))],
};
```

Strategy مربوط به `PreloadAllModules` برای applicationهای کوچک تا متوسط خوب کار می‌کند؛ جایی که download کردن همه moduleها اثر قابل توجهی روی performance ندارد. اما applicationهای بزرگ‌تر با feature moduleهای زیاد ممکن است از preloading انتخابی‌تر سود ببرند.

### ساخت preloading strategy سفارشی

Preloading strategyهای سفارشی interface مربوط به `PreloadingStrategy` را پیاده‌سازی می‌کنند که به یک method به نام `preload` نیاز دارد. این method، route configuration و functionای را دریافت می‌کند که load واقعی module را trigger می‌کند. Strategy یک Observable برمی‌گرداند که هنگام کامل شدن preloading emit می‌کند، یا یک Observable خالی برای skip کردن preloading:

```ts
import {Injectable} from '@angular/core';
import {PreloadingStrategy, Route} from '@angular/router';
import {Observable, of, timer} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

@Injectable()
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Only preload routes marked with data: { preload: true }
    if (route.data?.['preload']) {
      return load();
    }
    return of(null);
  }
}
```

این strategy انتخابی route metadata را بررسی می‌کند تا رفتار preloading را تعیین کند. Routeها می‌توانند از طریق configuration خود وارد preloading شوند:

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes'),
    data: {preload: true}, // Preload immediately after initial navigation
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.routes'),
    data: {preload: false}, // Only load when user navigates to reports
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes'),
    // No preload flag - won't be preloaded
  },
];
```

### نکته‌های performance برای preloading

Preloading هم روی network usage و هم memory consumption اثر می‌گذارد. هر module preloaded، bandwidth مصرف می‌کند و memory footprint application را افزایش می‌دهد. کاربران mobile روی connectionهای metered ممکن است preloading حداقلی را ترجیح دهند، در حالی که کاربران desktop روی networkهای سریع می‌توانند strategyهای preloading تهاجمی‌تر را تحمل کنند.

Timing مربوط به preloading هم مهم است. Preloading فوری بعد از initial load ممکن است با resourceهای حیاتی دیگر مثل imageها یا API callها رقابت کند. Strategyها باید رفتار application بعد از load را در نظر بگیرند و با taskهای background دیگر هماهنگ شوند تا performance degradation ایجاد نشود.

محدودیت‌های resource مرورگر هم روی رفتار preloading اثر می‌گذارند. مرورگرها تعداد connectionهای HTTP هم‌زمان را محدود می‌کنند، بنابراین preloading تهاجمی ممکن است پشت requestهای دیگر queue شود. Service workerها می‌توانند با فراهم کردن کنترل دقیق‌تر روی caching و network requestها، preloading strategy را کامل کنند.

## URL handling strategy

URL handling strategyها مشخص می‌کنند Angular router کدام URLها را پردازش کند و کدام را نادیده بگیرد. به‌صورت پیش‌فرض، Angular تلاش می‌کند همه navigation eventها را داخل application مدیریت کند، اما applicationهای واقعی اغلب باید با سیستم‌های دیگر هم‌زیستی داشته باشند، linkهای خارجی را مدیریت کنند، یا با applicationهای legacy که routeهای خودشان را مدیریت می‌کنند integrate شوند.

Class مربوط به `UrlHandlingStrategy` به شما کنترل این مرز بین routeهای مدیریت‌شده توسط Angular و URLهای خارجی را می‌دهد. این موضوع هنگام migrate کردن تدریجی applicationها به Angular یا وقتی applicationهای Angular باید URL space را با frameworkهای دیگر share کنند ضروری می‌شود.

### پیاده‌سازی URL handling strategy سفارشی

URL handling strategyهای سفارشی class مربوط به `UrlHandlingStrategy` را extend می‌کنند و سه method را پیاده‌سازی می‌کنند. Method مربوط به `shouldProcessUrl` مشخص می‌کند آیا Angular باید یک URL داده‌شده را مدیریت کند یا نه؛ `extract` بخشی از URL را برمی‌گرداند که Angular باید پردازش کند؛ و `merge`، URL fragment را با بقیه URL ترکیب می‌کند:

```ts
import {Injectable} from '@angular/core';
import {UrlHandlingStrategy, UrlTree} from '@angular/router';

@Injectable()
export class CustomUrlHandlingStrategy implements UrlHandlingStrategy {
  shouldProcessUrl(url: UrlTree): boolean {
    // Only handle URLs that start with /app or /admin
    return url.toString().startsWith('/app') || url.toString().startsWith('/admin');
  }

  extract(url: UrlTree): UrlTree {
    // Return the URL unchanged if we should process it
    return url;
  }

  merge(newUrlPart: UrlTree, rawUrl: UrlTree): UrlTree {
    // Combine the URL fragment with the rest of the URL
    return newUrlPart;
  }
}
```

این strategy مرزهای روشن در URL space ایجاد می‌کند. Angular، pathهای `/app` و `/admin` را مدیریت می‌کند و بقیه را نادیده می‌گیرد. این pattern هنگام migrate کردن applicationهای legacy خوب کار می‌کند؛ جایی که Angular sectionهای مشخصی را کنترل می‌کند و سیستم legacy بخش‌های دیگر را نگه می‌دارد.

### Configure کردن URL handling strategy سفارشی

می‌توانید یک strategy سفارشی را از طریق dependency injection system مربوط به Angular register کنید:

```ts
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {UrlHandlingStrategy} from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {provide: UrlHandlingStrategy, useClass: CustomUrlHandlingStrategy},
  ],
};
```

## Custom route matcherها

به‌صورت پیش‌فرض، router مربوط به Angular routeها را به همان ترتیبی که تعریف شده‌اند پیمایش می‌کند و تلاش می‌کند URL path را با path pattern مربوط به هر route match کند. از segmentهای static، segmentهای parameterized مثل `:id`، و wildcardها مثل `**` پشتیبانی می‌کند. اولین routeای که match شود برنده است و router جست‌وجو را متوقف می‌کند.

وقتی applicationها به matching logic پیشرفته‌تری بر اساس شرایط runtime، URL patternهای پیچیده، یا ruleهای سفارشی دیگر نیاز دارند، custom matcherها این flexibility را بدون قربانی کردن سادگی routeهای استاندارد فراهم می‌کنند.

Router، custom matcherها را در phase مربوط به route matching و قبل از انجام path matching ارزیابی می‌کند. وقتی یک matcher، match موفق برگرداند، می‌تواند parameterها را هم از URL استخراج کند و درست مثل route parameterهای استاندارد، آن‌ها را در اختیار component فعال‌شده قرار دهد.

### ساخت یک custom matcher

Custom matcher functionای است که URL segmentها را دریافت می‌کند و یا یک match result همراه با segmentهای consumed و parameterها برمی‌گرداند، یا null برمی‌گرداند تا نشان دهد match وجود ندارد. Matcher function قبل از اینکه Angular property مربوط به path در route را ارزیابی کند اجرا می‌شود:

```ts
import {Route, UrlSegment, UrlSegmentGroup, UrlMatchResult} from '@angular/router';

export function customMatcher(
  segments: UrlSegment[],
  group: UrlSegmentGroup,
  route: Route,
): UrlMatchResult | null {
  // Matching logic here
  if (matchSuccessful) {
    return {
      consumed: segments,
      posParams: {
        paramName: new UrlSegment('paramValue', {}),
      },
    };
  }
  return null;
}
```

### پیاده‌سازی version-based routing

یک سایت API documentation را در نظر بگیرید که باید بر اساس version numberهای داخل URL route شود. Versionهای مختلف ممکن است component structure یا feature setهای متفاوتی داشته باشند:

```ts
import {Routes, UrlSegment, UrlMatchResult} from '@angular/router';

export function versionMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  // Match patterns like /v1/docs, /v2.1/docs, /v3.0.1/docs
  if (segments.length >= 2 && segments[0].path.match(/^v\d+(\.\d+)*$/)) {
    return {
      consumed: segments.slice(0, 2), // Consume version and 'docs'
      posParams: {
        version: segments[0], // Make version available as a parameter
        section: segments[1], // Make section available too
      },
    };
  }
  return null;
}

// Route configuration
export const routes: Routes = [
  {
    matcher: versionMatcher,
    component: Documentation,
  },
  {
    path: 'latest/docs',
    redirectTo: 'v3/docs',
  },
];
```

Component، parameterهای extracted را از طریق route inputها دریافت می‌کند:

```angular-ts
import {Component, input, inject} from '@angular/core';
import {resource} from '@angular/core';

@Component({
  selector: 'app-documentation',
  template: `
    @if (documentation.isLoading()) {
      <div>Loading documentation...</div>
    } @else if (documentation.error()) {
      <div>Error loading documentation</div>
    } @else if (documentation.value(); as docs) {
      <article>{{ docs.content }}</article>
    }
  `,
})
export class Documentation {
  // Route parameters are automatically bound to signal inputs
  version = input.required<string>(); // Receives the version parameter
  section = input.required<string>(); // Receives the section parameter

  private docsService = inject(DocumentationService);

  // Resource automatically loads documentation when version or section changes
  documentation = resource({
    params: () => {
      if (!this.version() || !this.section()) return;

      return {
        version: this.version(),
        section: this.section(),
      };
    },
    loader: ({params}) => {
      return this.docsService.loadDocumentation(params.version, params.section);
    },
  });
}
```

### Locale-aware routing

Applicationهای international اغلب locale information را در URL encode می‌کنند. یک custom matcher می‌تواند locale codeها را استخراج کند و به componentهای مناسب route کند، در حالی که locale را به‌عنوان parameter در دسترس می‌گذارد:

```ts
// Supported locales
const locales = ['en', 'es', 'fr', 'de', 'ja', 'zh'];

export function localeMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length > 0) {
    const potentialLocale = segments[0].path;

    if (locales.includes(potentialLocale)) {
      // This is a locale prefix, consume it and continue matching
      return {
        consumed: [segments[0]],
        posParams: {
          locale: segments[0],
        },
      };
    } else {
      // No locale prefix, use default locale
      return {
        consumed: [], // Don't consume any segments
        posParams: {
          locale: new UrlSegment('en', {}),
        },
      };
    }
  }

  return null;
}
```

### Matching بر اساس business logic پیچیده

Custom matcherها برای پیاده‌سازی business ruleهایی عالی هستند که بیان کردنشان با path patternها ناخوشایند است. یک e-commerce site را در نظر بگیرید که URLهای محصول در آن بر اساس product type از patternهای متفاوتی پیروی می‌کنند:

```ts
export function productMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length === 0) return null;

  const firstSegment = segments[0].path;

  // Books: /isbn-1234567890
  if (firstSegment.startsWith('isbn-')) {
    return {
      consumed: [segments[0]],
      posParams: {
        productType: new UrlSegment('book', {}),
        identifier: new UrlSegment(firstSegment.substring(5), {}),
      },
    };
  }

  // Electronics: /sku/ABC123
  if (firstSegment === 'sku' && segments.length > 1) {
    return {
      consumed: segments.slice(0, 2),
      posParams: {
        productType: new UrlSegment('electronics', {}),
        identifier: segments[1],
      },
    };
  }

  // Clothing: /style/BRAND/ITEM
  if (firstSegment === 'style' && segments.length > 2) {
    return {
      consumed: segments.slice(0, 3),
      posParams: {
        productType: new UrlSegment('clothing', {}),
        brand: segments[1],
        identifier: segments[2],
      },
    };
  }

  return null;
}
```

### نکته‌های performance برای custom matcherها

Custom matcherها برای هر navigation attempt تا زمانی که match پیدا شود اجرا می‌شوند. در نتیجه، matching logic پیچیده می‌تواند روی navigation performance اثر بگذارد، مخصوصا در applicationهایی با routeهای زیاد. Matcherها را focused و efficient نگه دارید:

- وقتی match غیرممکن است زود return کنید
- از operationهای گران مثل API call یا regular expressionهای پیچیده دوری کنید
- برای URL patternهای تکراری، caching نتیجه‌ها را در نظر بگیرید

هرچند custom matcherها requirementهای routing پیچیده را elegant حل می‌کنند، استفاده بیش از حد از آن‌ها می‌تواند route configuration را سخت‌تر برای فهم و نگهداری کند. Custom matcherها را برای سناریوهایی نگه دارید که standard path matching واقعا کافی نیست.
