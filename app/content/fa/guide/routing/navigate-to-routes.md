# Navigate کردن به routeها

Directive مربوط به RouterLink رویکرد declarative Angular برای navigation است. این directive به شما اجازه می‌دهد از elementهای anchor استاندارد (`<a>`) استفاده کنید که به‌صورت یکپارچه با سیستم routing Angular کار می‌کنند.

## چطور از RouterLink استفاده کنیم

به‌جای استفاده از elementهای anchor معمولی `<a>` با attribute مربوط به `href`، یک directive از نوع RouterLink با path مناسب اضافه می‌کنید تا از Angular routing استفاده کنید.

```angular-ts
import {RouterLink} from '@angular/router';

@Component({
  template: `
    <nav>
      <a routerLink="/user-profile">User profile</a>
      <a routerLink="/settings">Settings</a>
    </nav>
  `,
  imports: [RouterLink],
  ...
})
export class App {}
```

### استفاده از linkهای absolute یا relative

**Relative URLها** در Angular routing به شما اجازه می‌دهند navigation pathها را نسبت به محل route فعلی تعریف کنید. این در مقابل **absolute URLها** قرار دارد که path کامل همراه با protocol، مثلا `http://`، و **root domain**، مثلا `google.com`، را شامل می‌شوند.

```angular-html
<!-- Absolute URL -->
<a href="https://www.angular.dev/essentials">Angular Essentials Guide</a>

<!-- Relative URL -->
<a href="/essentials">Angular Essentials Guide</a>
```

در این مثال، نمونه اول path کامل را همراه با protocol یعنی `https://` و root domain یعنی `angular.dev` برای صفحه essentials به‌صورت صریح تعریف کرده است. در مقابل، نمونه دوم فرض می‌کند کاربر از قبل روی root domain درست برای `/essentials` قرار دارد.

به‌طور کلی، relative URLها ترجیح داده می‌شوند، چون در applicationهای مختلف نگهداری‌پذیرترند و لازم نیست موقعیت absolute خود را در routing hierarchy بدانند.

### Relative URLها چطور کار می‌کنند

Angular routing دو syntax برای تعریف relative URLها دارد: string و array.

```angular-html
<!-- Navigates user to /dashboard -->
<a routerLink="dashboard">Dashboard</a>
<a [routerLink]="['dashboard']">Dashboard</a>
```

HELPFUL: پاس دادن string رایج‌ترین روش برای تعریف relative URLهاست.

وقتی لازم دارید parameterهای dynamic را در یک relative URL تعریف کنید، از syntax مربوط به array استفاده کنید:

```angular-html
<a [routerLink]="['user', currentUserId]">Current User</a>
```

علاوه بر این، Angular routing به شما اجازه می‌دهد مشخص کنید path نسبت به URL فعلی باشد یا نسبت به root domain؛ این موضوع بر اساس این تعیین می‌شود که relative path با forward slash (`/`) شروع شده باشد یا نه.

برای مثال، اگر کاربر روی `example.com/settings` باشد، در اینجا می‌بینید relative pathهای مختلف برای سناریوهای گوناگون چطور تعریف می‌شوند:

```angular-html
<!-- Navigates to /settings/notifications -->
<a routerLink="notifications">Notifications</a>
<a routerLink="/settings/notifications">Notifications</a>

<!-- Navigates to /team/:teamId/user/:userId -->
<a routerLink="/team/123/user/456">User 456</a>
<a [routerLink]="['/team', teamId, 'user', userId]">Current User</a>
```

## Programmatic navigation به routeها

در حالی که `RouterLink` در templateها declarative navigation را انجام می‌دهد، Angular برای سناریوهایی که باید بر اساس logic، actionهای کاربر، یا application state navigate کنید، programmatic navigation فراهم می‌کند. با inject کردن `Router`، می‌توانید در کد TypeScript خود به‌صورت dynamic به routeها navigate کنید، parameter پاس بدهید و رفتار navigation را کنترل کنید.

### `router.navigate()`

می‌توانید از method مربوط به `router.navigate()` برای navigation برنامه‌ای بین routeها استفاده کنید؛ کافی است یک array از URL pathها مشخص کنید.

```angular-ts
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: ` <button (click)="navigateToProfile()">View Profile</button> `,
})
export class AppDashboard {
  private router = inject(Router);

  navigateToProfile() {
    // Standard navigation
    this.router.navigate(['/profile']);

    // With route parameters
    this.router.navigate(['/users', userId]);

    // With query parameters
    this.router.navigate(['/search'], {
      queryParams: {category: 'books', sort: 'price'},
    });

    // With matrix parameters
    this.router.navigate(['/products', {featured: true, onSale: true}]);
  }
}
```

`router.navigate()` هم از سناریوهای ساده و هم پیچیده routing پشتیبانی می‌کند و به شما اجازه می‌دهد route parameterها، [query parameterها](/guide/routing/read-route-state#query-parameters) و کنترل رفتار navigation را پاس بدهید.

همچنین می‌توانید با استفاده از option مربوط به `relativeTo`، navigation pathهای dynamic را نسبت به محل component خود در routing tree بسازید.

```angular-ts
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-user-detail',
  template: `
    <button (click)="navigateToEdit()">Edit User</button>
    <button (click)="navigateToParent()">Back to List</button>
  `,
})
export class UserDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Navigate to a sibling route
  navigateToEdit() {
    // From: /users/123
    // To:   /users/123/edit
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  // Navigate to parent
  navigateToParent() {
    // From: /users/123
    // To:   /users
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  navigateToList() {
    // Angular resolves the commands array as a single navigation path relative to the current route.
    // From: /users/123
    // Result: /users/list
    this.router.navigate(['..', 'list'], {relativeTo: this.route});
  }
}
```

هنگام navigate کردن چند سطح به بالا، همه segmentهای `..` باید در **اولین element** از array مربوط به commands باشند. Router فقط `..` را از اولین command string parse می‌کند؛ elementهای بعدی array به‌عنوان path segment literal در نظر گرفته می‌شوند.

```angular-ts {prefer}
// From: /team/123/users/456
// Result: /team/123/settings
this.router.navigate(['../../settings'], {relativeTo: this.route});
```

وقتی از `relativeTo` استفاده می‌کنید، هرگز command اول را با `/` شروع نکنید. یک `/` در ابتدا، navigation را absolute می‌کند و `relativeTo` را کاملا نادیده می‌گیرد.

```angular-ts {prefer}
// From: /team/123/users/456
// Result: /team/123/users/456/edit
this.router.navigate(['edit'], {relativeTo: this.route});
```

```angular-ts {avoid}
// From: /team/123/users/456
// Leading '/' causes absolute navigation — relativeTo is ignored
// Result: /edit
this.router.navigate(['/edit'], {relativeTo: this.route});
```

### `router.navigateByUrl()`

Method مربوط به `router.navigateByUrl()` راهی مستقیم برای programmatic navigation با stringهای URL path فراهم می‌کند، نه با segmentهای array. این method وقتی مناسب است که یک URL path کامل دارید و باید absolute navigation انجام دهید، مخصوصا وقتی با URLهای فراهم‌شده از بیرون یا سناریوهای deep linking کار می‌کنید.

```ts
// Standard route navigation
router.navigateByUrl('/products');

// Navigate to nested route
router.navigateByUrl('/products/featured');

// Complete URL with parameters and fragment
router.navigateByUrl('/products/123?view=details#reviews');

// Navigate with query parameters
router.navigateByUrl('/search?category=books&sortBy=price');

// With matrix parameters
router.navigateByUrl('/sales-awesome;isOffer=true;showModal=false');
```

اگر لازم دارید URL فعلی را در history جایگزین کنید، `navigateByUrl` یک configuration object هم می‌پذیرد که optionای به نام `replaceUrl` دارد.

```ts
// Replace current URL in history
router.navigateByUrl('/checkout', {
  replaceUrl: true,
});
```

### نمایش URL متفاوت در address bar

می‌توانید یک option به نام browserUrl به navigateByUrl پاس بدهید تا URL متفاوتی از URL استفاده‌شده برای route matching در address bar مرورگر نمایش داده شود.

این کار وقتی مفید است که می‌خواهید کاربر را به route متفاوتی redirect کنید، مثلا یک error page، بدون اینکه URLای که کاربر در اصل قصد باز کردنش را داشت تغییر کند.

```ts
router.navigateByUrl('/not-found', {browserUrl: '/products/missing-item'});
```

Angular به route مربوط به `/not-found` navigate می‌کند و آن را render می‌کند، اما address bar مرورگر `/products/missing-item` را نشان می‌دهد.

NOTE: `browserUrl` فقط روی چیزی اثر می‌گذارد که در address bar مرورگر نمایش داده می‌شود.

## سفارشی‌سازی URL مرورگر با RouterLink

Directive مربوط به `RouterLink` از inputای به نام `browserUrl` هم پشتیبانی می‌کند؛ این input به شما اجازه می‌دهد URL نمایش‌داده‌شده در address bar مرورگر را هنگام کلیک روی یک link، مستقل از routeای که Angular به آن navigate می‌کند، کنترل کنید.

```angular-html
<!-- Navigates to /dashboard, but the address bar shows /home -->
<a [routerLink]="['/dashboard']" [browserUrl]="'/home'">Go to Dashboard</a>
```

همچنین می‌توانید برای use caseهای dynamicتر، یک `UrlTree` را bind کنید:

```angular-ts
import {Component, inject} from '@angular/core';
import {Router, RouterLink, UrlTree} from '@angular/router';

@Component({
  template: `
    <a [routerLink]="['/products', product.id]" [browserUrl]="displayUrl">
      {{ product.name }}
    </a>
  `,
  imports: [RouterLink],
})
export class ProductList {
  private router = inject(Router);

  product = {id: 42, name: 'Widget'};

  // Create a UrlTree to display in the address bar
  displayUrl: UrlTree = this.router.createUrlTree(['/products', 'widget']);
}
```

## قدم بعدی

یاد بگیرید چطور [route state را بخوانید](/guide/routing/read-route-state) تا componentهای responsive و context-aware بسازید.
