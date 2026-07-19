# نمایش routeها با outletها

Directive مربوط به `RouterOutlet` یک placeholder است که محل render شدن component مربوط به URL فعلی توسط router را مشخص می‌کند.

```html
<app-header />
<!-- Angular inserts your route content here -->
<router-outlet />
<app-footer />
```

```ts
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
```

در این مثال، اگر یک application routeهای زیر را تعریف کرده باشد:

```ts
import {Routes} from '@angular/router';
import {Home} from './home';
import {Products} from './products';

const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home Page',
  },
  {
    path: 'products',
    component: Products,
    title: 'Our Products',
  },
];
```

وقتی کاربر `/products` را باز کند، Angular خروجی زیر را render می‌کند:

```angular-html
<app-header />
<app-products />
<app-footer />
```

اگر کاربر به home page برگردد، Angular این خروجی را render می‌کند:

```angular-html
<app-header />
<app-home />
<app-footer />
```

هنگام نمایش یک route، element مربوط به `<router-outlet>` به‌عنوان نقطه مرجع برای navigationهای بعدی در DOM باقی می‌ماند. Angular محتوای routed را درست بعد از outlet element و به‌صورت sibling وارد می‌کند.

```angular-html
<!-- Contents of the component's template -->
<app-header />
<router-outlet />
<app-footer />
```

```angular-html
<!-- Content rendered on the page when the user visits /admin -->
<app-header />
<router-outlet />
<app-admin-page />
<app-footer />
```

## تو در تو کردن routeها با child routeها

وقتی application شما پیچیده‌تر می‌شود، ممکن است بخواهید routeهایی بسازید که نسبت به componentای غیر از root component تعریف می‌شوند. این کار تجربه‌هایی ایجاد می‌کند که با تغییر URL فقط بخشی از application تغییر می‌کند، نه اینکه کاربر حس کند کل صفحه refresh شده است.

این نوع routeهای nested را child route می‌نامند. یعنی شما یک `<router-outlet>` دوم به app اضافه می‌کنید، چون این outlet علاوه بر `<router-outlet>` داخل AppComponent است.

در این مثال، component مربوط به `Settings` بر اساس انتخاب کاربر panel مورد نظر را نمایش می‌دهد. یکی از نکته‌های خاص child routeها این است که component اغلب `<nav>` و `<router-outlet>` خودش را دارد.

```angular-html
<h1>Settings</h1>
<nav>
  <ul>
    <li><a routerLink="profile">Profile</a></li>
    <li><a routerLink="security">Security</a></li>
  </ul>
</nav>
<router-outlet />
```

یک child route مثل هر route دیگری است، چون هم به `path` نیاز دارد و هم به `component`. تنها تفاوت این است که child routeها را داخل یک array به نام children در route والد قرار می‌دهید.

```ts
const routes: Routes = [
  {
    path: 'settings',
    component: Settings, // this is the component with the <router-outlet> in the template
    children: [
      {
        path: 'profile', // child route path
        component: Profile, // child route component that the router renders
      },
      {
        path: 'security',
        component: Security, // another child route component that the router renders
      },
    ],
  },
];
```

وقتی هم `routes` و هم `<router-outlet>` درست configure شوند، application شما از nested routeها استفاده می‌کند.

## Routeهای secondary با named outletها

صفحه‌ها ممکن است چند outlet داشته باشند؛ می‌توانید به هر outlet یک name بدهید تا مشخص کنید کدام content به کدام outlet تعلق دارد.

```angular-html
<app-header />
<router-outlet />
<router-outlet name="read-more" />
<router-outlet name="additional-actions" />
<app-footer />
```

هر outlet باید name یکتا داشته باشد. name را نمی‌توان به‌صورت dynamic تنظیم یا تغییر داد. مقدار پیش‌فرض name برابر `'primary'` است.

Angular نام outlet را با property مربوط به `outlet` که روی هر route تعریف شده match می‌کند:

```ts
{
  path: 'user/:id',
  component: UserDetails,
  outlet: 'additional-actions'
}
```

## Lifecycle eventهای outlet

یک router outlet می‌تواند چهار lifecycle event emit کند:

| Event        | Description                                                        |
| ------------ | ------------------------------------------------------------------ |
| `activate`   | وقتی component جدید instantiate می‌شود                             |
| `deactivate` | وقتی component destroy می‌شود                                      |
| `attach`     | وقتی `RouteReuseStrategy` به outlet می‌گوید subtree را attach کند  |
| `detach`     | وقتی `RouteReuseStrategy` به outlet می‌گوید subtree را detach کند  |

می‌توانید با syntax استاندارد event binding، event listener اضافه کنید:

```angular-html
<router-outlet
  (activate)="onActivate($event)"
  (deactivate)="onDeactivate($event)"
  (attach)="onAttach($event)"
  (detach)="onDetach($event)"
/>
```

اگر می‌خواهید بیشتر یاد بگیرید، [API docs مربوط به RouterOutlet](/api/router/RouterOutlet?tab=api) را ببینید.

## پاس دادن contextual data به routed componentها

پاس دادن contextual data به routed componentها اغلب به global state یا route configurationهای پیچیده نیاز دارد. برای ساده‌تر کردن این کار، هر `RouterOutlet` از inputای به نام `routerOutletData` پشتیبانی می‌کند. Routed componentها و فرزندانشان می‌توانند این data را با استفاده از injection token مربوط به `ROUTER_OUTLET_DATA` به‌عنوان یک signal بخوانند؛ بنابراین بدون تغییر route definitionها می‌توانید configuration مخصوص هر outlet داشته باشید.

```angular-ts
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet],
  template: `
    <h2>Dashboard</h2>
    <router-outlet [routerOutletData]="{layout: 'sidebar'}" />
  `,
})
export class Dashboard {}
```

Routed component می‌تواند با استفاده از `ROUTER_OUTLET_DATA`، outlet data فراهم‌شده را inject کند:

```angular-ts
import {Component, inject} from '@angular/core';
import {ROUTER_OUTLET_DATA} from '@angular/router';

@Component({
  selector: 'app-stats',
  template: `<p>Stats view (layout: {{ outletData().layout }})</p>`,
})
export class Stats {
  outletData = inject(ROUTER_OUTLET_DATA) as Signal<{layout: string}>;
}
```

وقتی Angular، `Stats` را در آن outlet فعال می‌کند، `{ layout: 'sidebar' }` را به‌عنوان injected data دریافت می‌کند.

NOTE: وقتی input مربوط به `routerOutletData` تنظیم نشده باشد، مقدار injected به‌صورت پیش‌فرض null است.

---

## قدم بعدی

یاد بگیرید چطور با Angular Router [به routeها navigate کنید](/guide/routing/navigate-to-routes).
