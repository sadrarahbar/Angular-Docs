# استراتژی‌های بارگذاری Route

درک اینکه routeها و componentها در Angular routing چطور و چه زمانی load می‌شوند، برای ساختن web applicationهای responsive ضروری است. Angular دو استراتژی اصلی برای کنترل رفتار loading ارائه می‌کند:

1. **Eagerly loaded**: Routeها و componentهایی که بلافاصله load می‌شوند
2. **Lazily loaded**: Routeها و componentهایی که فقط در زمان نیاز load می‌شوند

هر روش برای سناریوهای متفاوت مزیت‌های مشخصی دارد.

## Componentهای eager loaded

وقتی routeای را با property مربوط به [`component`](api/router/Route#component) تعریف می‌کنید، component ارجاع‌داده‌شده به‌عنوان بخشی از همان JavaScript bundle مربوط به route configuration به‌صورت eager load می‌شود.

```ts
import {Routes} from '@angular/router';
import {HomePage} from './components/home/home-page';
import {LoginPage} from './components/auth/login-page';

export const routes: Routes = [
  // HomePage and LoginPage are both directly referenced in this config,
  // so their code is eagerly included in the same JavaScript bundle as this file.
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'login',
    component: LoginPage,
  },
];
```

Eager loading برای route componentها به این معناست که مرورگر باید همه JavaScript مربوط به این componentها را به‌عنوان بخشی از load اولیه صفحه download و parse کند، اما componentها بلافاصله در اختیار Angular هستند.

هرچند اضافه کردن JavaScript بیشتر به load اولیه صفحه باعث کندتر شدن initial load می‌شود، می‌تواند هنگام navigation کاربر در application، transitionهای روان‌تری ایجاد کند.

## Componentها و routeهای lazy loaded

می‌توانید از property مربوط به [`loadComponent`](api/router/Route#loadComponent) استفاده کنید تا JavaScript یک component را دقیقا زمانی lazy load کنید که آن route قرار است فعال شود. property مربوط به [`loadChildren`](api/router/Route#loadChildren) هم child routeها را هنگام route matching به‌صورت lazy load می‌کند.

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login-page'),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component'),
    loadChildren: () => import('./admin/admin.routes'),
  },
];
```

Propertyهای [`loadComponent`](/api/router/Route#loadComponent) و [`loadChildren`](/api/router/Route#loadChildren) یک loader function می‌پذیرند که یک Promise برمی‌گرداند؛ این Promise به‌ترتیب به یک Angular component یا مجموعه‌ای از routeها resolve می‌شود. در بیشتر موارد، این function از API استاندارد [JavaScript dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) استفاده می‌کند. با این حال، می‌توانید از هر async loader function دلخواهی هم استفاده کنید.

اگر فایل lazy loaded از `default` export استفاده کند، می‌توانید promise مربوط به `import()` را مستقیما و بدون call اضافه `.then` برای انتخاب class صادرشده برگردانید.

Lazy loading برای routeها می‌تواند با حذف بخش‌های بزرگی از JavaScript از initial bundle، سرعت load application Angular شما را به‌طور چشمگیری بهتر کند. این بخش‌های کد شما به JavaScript "chunk"های جداگانه compile می‌شوند که router فقط وقتی کاربر route متناظر را باز می‌کند آن‌ها را درخواست می‌کند.

## Lazy loading در injection context

Router، [`loadComponent`](/api/router/Route#loadComponent) و [`loadChildren`](/api/router/Route#loadChildren) را در **injection context مربوط به route فعلی** اجرا می‌کند؛ بنابراین می‌توانید داخل این loader functionها [`inject`](/api/core/inject) را صدا بزنید تا به providerهایی دسترسی داشته باشید که روی همان route تعریف شده‌اند، از routeهای والد از طریق hierarchical dependency injection به ارث رسیده‌اند، یا به‌صورت global در دسترس هستند. این کار lazy loading وابسته به context را ممکن می‌کند.

```ts
import {Routes} from '@angular/router';
import {inject} from '@angular/core';
import {FeatureFlags} from './feature-flags';

export const routes: Routes = [
  {
    path: 'dashboard',
    // Runs inside the route's injection context
    loadComponent: () => {
      const flags = inject(FeatureFlags);
      return flags.isPremium
        ? import('./dashboard/premium-dashboard')
        : import('./dashboard/basic-dashboard');
    },
  },
];
```

## باید از route eager استفاده کنم یا lazy؟

برای تصمیم‌گیری درباره اینکه یک route باید eager باشد یا lazy، عامل‌های زیادی را باید در نظر بگیرید.

به‌طور کلی، eager loading برای landing pageهای اصلی پیشنهاد می‌شود و صفحه‌های دیگر بهتر است lazy-loaded باشند.

NOTE: هرچند lazy routeها از نظر performance اولیه این مزیت را دارند که مقدار data اولیه درخواست‌شده توسط کاربر را کم می‌کنند، اما requestهای بعدی ایجاد می‌کنند که ممکن است مطلوب نباشد. این موضوع به‌خصوص در nested lazy loading در چند سطح مهم است، چون می‌تواند performance را به‌شکل قابل توجهی تحت تاثیر قرار دهد.

## قدم بعدی

یاد بگیرید چطور [محتوای routeهای خود را با Outletها نمایش دهید](/guide/routing/show-routes-with-outlets).
