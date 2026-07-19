# خواندن route state

Angular Router به شما اجازه می‌دهد اطلاعات مرتبط با یک route را بخوانید و استفاده کنید تا componentهای responsive و context-aware بسازید.

## گرفتن اطلاعات route فعلی با ActivatedRoute

`ActivatedRoute` یک service از `@angular/router` است که همه اطلاعات مرتبط با route فعلی را فراهم می‌کند.

```angular-ts
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-product',
})
export class Product {
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    console.log(this.activatedRoute);
  }
}
```

`ActivatedRoute` می‌تواند اطلاعات مختلفی درباره route فراهم کند. چند property رایج:

| Property      | Details                                                                                                                              |
| :------------ | :----------------------------------------------------------------------------------------------------------------------------------- |
| `url`         | یک `Observable` از route pathها، که به‌صورت arrayای از stringها برای هر بخش از route path نمایش داده می‌شود.                         |
| `data`        | یک `Observable` که object مربوط به `data` فراهم‌شده برای route را در خود دارد. همچنین هر value مربوط به resolve guard را هم شامل می‌شود. |
| `params`      | یک `Observable` که parameterهای required و optional مخصوص route را در خود دارد.                                                       |
| `queryParams` | یک `Observable` که query parameterهای در دسترس همه routeها را در خود دارد.                                                            |

برای فهرست کامل چیزهایی که می‌توانید در route به آن‌ها دسترسی داشته باشید، [`ActivatedRoute` API docs](/api/router/ActivatedRoute) را ببینید.

## درک route snapshotها

Page navigationها eventهایی در طول زمان هستند، و می‌توانید با دریافت یک route snapshot، به router state در یک لحظه مشخص دسترسی پیدا کنید.

Route snapshotها اطلاعات ضروری route را شامل می‌شوند، از جمله parameterها، data و child routeها. علاوه بر این، snapshotها static هستند و تغییرات آینده را منعکس نمی‌کنند.

در اینجا مثالی از نحوه دسترسی به route snapshot می‌بینید:

```angular-ts
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';

@Component(/* ... */)
export class UserProfile {
  readonly userId: string;
  private route = inject(ActivatedRoute);

  constructor() {
    // Example URL: https://www.angular.dev/users/123?role=admin&status=active#contact

    // Access route parameters from snapshot
    this.userId = this.route.snapshot.paramMap.get('id');

    // Access multiple route elements
    const snapshot = this.route.snapshot;
    console.log({
      url: snapshot.url, // https://www.angular.dev
      // Route parameters object: {id: '123'}
      params: snapshot.params,
      // Query parameters object: {role: 'admin', status: 'active'}
      queryParams: snapshot.queryParams, // Query parameters
    });
  }
}
```

برای فهرست کامل همه propertyهایی که می‌توانید به آن‌ها دسترسی داشته باشید، [`ActivatedRoute` API docs](/api/router/ActivatedRoute) و [`ActivatedRouteSnapshot` API docs](/api/router/ActivatedRouteSnapshot) را ببینید.

## خواندن parameterها روی یک route

دو نوع parameter وجود دارد که توسعه‌دهنده‌ها می‌توانند از یک route استفاده کنند: route parameterها و query parameterها.

### Route Parameterها

Route parameterها به شما اجازه می‌دهند data را از طریق URL به یک component پاس بدهید. این زمانی مفید است که می‌خواهید content مشخصی را بر اساس یک identifier در URL، مثل user ID یا product ID، نمایش دهید.

می‌توانید [route parameterها را تعریف کنید](/guide/routing/define-routes#define-url-paths-with-route-parameters)؛ کافی است قبل از نام parameter یک colon (`:`) بگذارید.

```angular-ts
import {Routes} from '@angular/router';
import {Product} from './product';

const routes: Routes = [{path: 'product/:id', component: Product}];
```

می‌توانید با subscribe کردن به `route.params` به parameterها دسترسی داشته باشید.

```angular-ts
import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-product-detail',
  template: `<h1>Product Details: {{ productId() }}</h1>`,
})
export class ProductDetail {
  productId = signal('');
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    // Access route parameters
    this.activatedRoute.params.subscribe((params) => {
      this.productId.set(params['id']);
    });
  }
}
```

### Query Parameterها

[Query parameterها](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) راهی flexible برای پاس دادن data اختیاری از طریق URL فراهم می‌کنند، بدون اینکه روی ساختار route اثر بگذارند. برخلاف route parameterها، query parameterها می‌توانند بین navigation eventها باقی بمانند و برای مدیریت filtering، sorting، pagination و دیگر elementهای stateful UI عالی هستند.

```angular-ts
// Single parameter structure
// /products?category=electronics
router.navigate(['/products'], {
  queryParams: {category: 'electronics'},
});

// Multiple parameters
// /products?category=electronics&sort=price&page=1
router.navigate(['/products'], {
  queryParams: {
    category: 'electronics',
    sort: 'price',
    page: 1,
  },
});
```

می‌توانید با `route.queryParams` به query parameterها دسترسی داشته باشید.

در اینجا مثالی از `ProductList` می‌بینید که query parameterهایی را به‌روزرسانی می‌کند که روی نحوه نمایش list محصولات اثر می‌گذارند:

```angular-ts
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-product-list',
  template: `
    <div>
      <select (change)="updateSort($event)">
        <option value="price">Price</option>
        <option value="name">Name</option>
      </select>
      <!-- Products list -->
    </div>
  `,
})
export class ProductList {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    // Access query parameters reactively
    this.route.queryParams.subscribe((params) => {
      const sort = params['sort'] || 'price';
      const page = Number(params['page']) || 1;
      this.loadProducts(sort, page);
    });
  }

  updateSort(event: Event) {
    const sort = (event.target as HTMLSelectElement).value;
    // Update URL with new query parameter
    this.router.navigate([], {
      queryParams: {sort},
      queryParamsHandling: 'merge', // Preserve other query parameters
    });
  }
}
```

در این مثال، کاربران می‌توانند از یک select element برای مرتب‌سازی product list بر اساس name یا price استفاده کنند. change handler مرتبط، query parameterهای URL را به‌روزرسانی می‌کند؛ این کار به‌نوبه خود یک change event trigger می‌کند که می‌تواند query parameterهای جدید را بخواند و product list را به‌روزرسانی کند.

برای اطلاعات بیشتر، docs رسمی مربوط به [QueryParamsHandling](/api/router/QueryParamsHandling) را ببینید.

### Matrix Parameterها

Matrix parameterها parameterهای اختیاری هستند که به یک URL segment مشخص تعلق دارند، نه اینکه روی کل route اعمال شوند. برخلاف query parameterها که بعد از `?` ظاهر می‌شوند و global اعمال می‌شوند، matrix parameterها از semicolon (`;`) استفاده می‌کنند و scope آن‌ها به path segmentهای جداگانه محدود است.

Matrix parameterها وقتی مفیدند که لازم دارید auxiliary data را به یک route segment مشخص پاس بدهید، بدون اینکه روی route definition یا matching behavior اثر بگذارید. مثل query parameterها، لازم نیست در route configuration شما تعریف شوند.

```ts
// URL format: /path;key=value
// Multiple parameters: /path;key1=value1;key2=value2

// Navigate with matrix parameters
this.router.navigate(['/awesome-products', {view: 'grid', filter: 'new'}]);
// Results in URL: /awesome-products;view=grid;filter=new
```

**استفاده از ActivatedRoute**

```ts
import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component(/* ... */)
export class AwesomeProducts {
  private route = inject(ActivatedRoute);

  constructor() {
    // Access matrix parameters via params
    this.route.params.subscribe((params) => {
      const view = params['view']; // e.g., 'grid'
      const filter = params['filter']; // e.g., 'new'
    });
  }
}
```

NOTE: به‌عنوان جایگزین استفاده از `ActivatedRoute`، matrix parameterها هنگام استفاده از `withComponentInputBinding` به component inputها هم bind می‌شوند.

## تشخیص route فعال فعلی با RouterLinkActive

می‌توانید از directive مربوط به `RouterLinkActive` استفاده کنید تا elementهای navigation را بر اساس route فعال فعلی به‌صورت dynamic style کنید. این کار در elementهای navigation رایج است تا کاربران بدانند route فعال کدام است.

```angular-html
<nav>
  <a
    class="button"
    routerLink="/about"
    routerLinkActive="active-button"
    ariaCurrentWhenActive="page"
  >
    About
  </a>
  |
  <a
    class="button"
    routerLink="/settings"
    routerLinkActive="active-button"
    ariaCurrentWhenActive="page"
  >
    Settings
  </a>
</nav>
```

در این مثال، وقتی URL با `routerLink` متناظر match شود، Angular Router کلاس `active-button` و مقدار `page` برای `ariaCurrentWhenActive` را روی anchor link درست اعمال می‌کند.

اگر لازم دارید چند کلاس به element اضافه کنید، می‌توانید از یک string جداشده با فاصله یا یک array استفاده کنید:

```angular-html
<!-- Space-separated string syntax -->
<a routerLink="/user/bob" routerLinkActive="class1 class2">Bob</a>

<!-- Array syntax -->
<a routerLink="/user/bob" [routerLinkActive]="['class1', 'class2']">Bob</a>
```

وقتی مقداری برای routerLinkActive مشخص می‌کنید، همان مقدار را برای `ariaCurrentWhenActive` هم تعریف می‌کنید. این کار مطمئن می‌کند کاربران کم‌بینا یا نابینا، که ممکن است styling متفاوت اعمال‌شده را تشخیص ندهند، بتوانند button فعال را شناسایی کنند.

اگر می‌خواهید مقدار متفاوتی برای aria تعریف کنید، باید مقدار را به‌صورت صریح با directive مربوط به `ariaCurrentWhenActive` تنظیم کنید.

### Route matching strategy

به‌صورت پیش‌فرض، `RouterLinkActive` هر ancestor در route را یک match در نظر می‌گیرد.

```angular-html
<a [routerLink]="['/user/jane']" routerLinkActive="active-link"> User </a>
<a [routerLink]="['/user/jane/role/admin']" routerLinkActive="active-link"> Role </a>
```

وقتی کاربر `/user/jane/role/admin` را باز کند، هر دو link کلاس `active-link` خواهند داشت.

### اعمال RouterLinkActive فقط روی match دقیق route

اگر می‌خواهید کلاس فقط روی match دقیق اعمال شود، باید directive مربوط به `routerLinkActiveOptions` را با یک configuration object فراهم کنید که شامل مقدار `exact: true` است.

```angular-html
<a
  [routerLink]="['/user/jane']"
  routerLinkActive="active-link"
  [routerLinkActiveOptions]="{exact: true}"
>
  User
</a>
<a
  [routerLink]="['/user/jane/role/admin']"
  routerLinkActive="active-link"
  [routerLinkActiveOptions]="{exact: true}"
>
  Role
</a>
```

اگر می‌خواهید در نحوه match شدن یک route دقیق‌تر باشید، خوب است بدانید `exact: true` در واقع syntactic sugar برای مجموعه کامل optionهای matching است:

```angular-ts
// `exact: true` is equivalent to
{
  paths: 'exact',
  fragment: 'ignored',
  matrixParams: 'ignored',
  queryParams: 'exact',
}

// `exact: false` is equivalent
{
  paths: 'subset',
  fragment: 'ignored',
  matrixParams: 'ignored',
  queryParams: 'subset',
}
```

برای اطلاعات بیشتر، docs رسمی مربوط به [isActiveMatchOptions](/api/router/IsActiveMatchOptions) را ببینید.

### اعمال RouterLinkActive روی ancestor

Directive مربوط به RouterLinkActive می‌تواند روی یک ancestor element هم اعمال شود تا توسعه‌دهنده‌ها بتوانند elementها را مطابق نیاز style کنند.

```angular-html
<div routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
  <a routerLink="/user/jim">Jim</a>
  <a routerLink="/user/bob">Bob</a>
</div>
```

برای اطلاعات بیشتر، [API docs مربوط به RouterLinkActive](/api/router/RouterLinkActive) را ببینید.

## بررسی فعال بودن یک URL

Function مربوط به `isActive` یک computed signal برمی‌گرداند که دنبال می‌کند آیا یک URL مشخص در حال حاضر در router فعال است یا نه. این signal با تغییر router state به‌صورت خودکار به‌روزرسانی می‌شود.

```angular-ts
import {Component, inject} from '@angular/core';
import {isActive, Router} from '@angular/router';

@Component({
  template: `
    <div [class.active]="isSettingsActive()">
      <h2>Settings</h2>
    </div>
  `,
})
export class Panel {
  private router = inject(Router);

  isSettingsActive = isActive('/settings', this.router, {
    paths: 'subset',
    queryParams: 'ignored',
    fragment: 'ignored',
    matrixParams: 'ignored',
  });
}
```
