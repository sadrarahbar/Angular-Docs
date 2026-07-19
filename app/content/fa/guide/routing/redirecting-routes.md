# Redirect کردن Routeها

Route redirectها به شما اجازه می‌دهند کاربران را به‌صورت خودکار از یک route به route دیگر ببرید. می‌توانید آن را شبیه forwarding آدرس در نظر بگیرید؛ جایی که چیزی که برای یک آدرس در نظر گرفته شده، به آدرسی دیگر فرستاده می‌شود. این قابلیت برای مدیریت URLهای قدیمی، پیاده‌سازی routeهای پیش‌فرض، یا مدیریت access control مفید است.

## چطور redirectها را configure کنیم

می‌توانید redirectها را در route configuration خود با property مربوط به `redirectTo` تعریف کنید. این property یک string می‌پذیرد.

```ts
import {Routes} from '@angular/router';

const routes: Routes = [
  // Simple redirect
  {path: 'marketing', redirectTo: 'newsletter'},

  // Redirect with path parameters
  {path: 'legacy-user/:id', redirectTo: 'users/:id'},

  // Redirect any other URLs that don’t match
  // (also known as a "wildcard" redirect)
  {path: '**', redirectTo: '/login'},
];
```

در این مثال سه redirect وجود دارد:

1. وقتی کاربر path مربوط به `/marketing` را باز کند، به `/newsletter` redirect می‌شود.
2. وقتی کاربر هر path از نوع `/legacy-user/:id` را باز کند، به path متناظر `/users/:id` هدایت می‌شود.
3. وقتی کاربر هر pathای را باز کند که در router تعریف نشده، به‌خاطر تعریف wildcard path یعنی `**` به صفحه login redirect می‌شود.

## درک `pathMatch`

Property مربوط به `pathMatch` روی routeها به توسعه‌دهنده‌ها اجازه می‌دهد کنترل کنند Angular چطور یک URL را با routeها match کند.

`pathMatch` دو مقدار می‌پذیرد:

| Value      | Description                              |
| ---------- | ---------------------------------------- |
| `'full'`   | کل URL path باید دقیقا match شود         |
| `'prefix'` | فقط ابتدای URL کافی است که match شود     |

به‌صورت پیش‌فرض، همه redirectها از strategy مربوط به `prefix` استفاده می‌کنند.

### `pathMatch: 'prefix'`

`pathMatch: 'prefix'` strategy پیش‌فرض است و وقتی مناسب است که می‌خواهید Angular Router هنگام trigger شدن یک redirect، همه routeهای بعدی را هم match کند.

```ts
export const routes: Routes = [
  // This redirect route is equivalent to…
  { path: 'news', redirectTo: 'blog },

  // This explicitly defined route redirect pathMatch
  { path: 'news', redirectTo: 'blog', pathMatch: 'prefix' },
];
```

در این مثال، همه routeهایی که با `news` شروع می‌شوند به معادل‌های `/blog` خود redirect می‌شوند. چند نمونه از redirect شدن کاربران هنگام باز کردن prefix قدیمی `news`:

- `/news` به `/blog` redirect می‌شود
- `/news/article` به `/blog/article` redirect می‌شود
- `/news/article/:id` به `/blog/article/:id` redirect می‌شود

### `pathMatch: 'full'`

از طرف دیگر، `pathMatch: 'full'` زمانی مفید است که می‌خواهید Angular Router فقط یک path مشخص را redirect کند.

```ts
export const routes: Routes = [{path: '', redirectTo: '/dashboard', pathMatch: 'full'}];
```

در این مثال، هر بار که کاربر root URL یعنی `''` را باز کند، router آن کاربر را به صفحه `'/dashboard'` redirect می‌کند.

هر صفحه بعدی، مثل `/login`، `/about`، `/product/id` و غیره، نادیده گرفته می‌شود و redirect را trigger نمی‌کند.

TIP: هنگام configure کردن redirect روی root page، یعنی `"/"` یا `""`، دقت کنید. اگر `pathMatch: 'full'` را تنظیم نکنید، router همه URLها را redirect می‌کند.

برای روشن‌تر شدن موضوع، اگر مثال `news` از بخش قبل به‌جای آن از `pathMatch: 'full'` استفاده کند:

```ts
export const routes: Routes = [{path: 'news', redirectTo: '/blog', pathMatch: 'full'}];
```

یعنی:

1. فقط path مربوط به `/news` به `/blog` redirect می‌شود.
2. هر segment بعدی مثل `/news/articles` یا `/news/articles/1` با prefix جدید `/blog` redirect نخواهد شد.

## Redirectهای شرطی

Property مربوط به `redirectTo` می‌تواند برای اضافه کردن logic به نحوه redirect شدن کاربران، یک function هم بپذیرد.

این [function](api/router/RedirectFunction) فقط به بخشی از data مربوط به [`ActivatedRouteSnapshot`](api/router/ActivatedRouteSnapshot) دسترسی دارد، چون بعضی dataها در مرحله route matching به‌طور دقیق مشخص نیستند. نمونه‌ها شامل titleهای resolved، componentهای lazy loaded و موارد مشابه هستند.

این function معمولا یک string یا [`URLTree`](api/router/UrlTree) برمی‌گرداند، اما می‌تواند observable یا promise هم برگرداند.

در اینجا مثالی می‌بینید که کاربر را بر اساس زمان روز به menu متفاوتی redirect می‌کند:

```ts
import {Routes} from '@angular/router';
import {Menu} from './menu';

export const routes: Routes = [
  {
    path: 'restaurant/:location/menu',
    redirectTo: (activatedRouteSnapshot) => {
      const location = activatedRouteSnapshot.params['location'];
      const currentHour = new Date().getHours();

      // Check if user requested a specific meal via query parameter
      if (activatedRouteSnapshot.queryParams['meal']) {
        return `/restaurant/${location}/menu/${queryParams['meal']}`;
      }

      // Auto-redirect based on time of day
      if (currentHour >= 5 && currentHour < 11) {
        return `/restaurant/${location}/menu/breakfast`;
      } else if (currentHour >= 11 && currentHour < 17) {
        return `/restaurant/${location}/menu/lunch`;
      } else {
        return `/restaurant/${location}/menu/dinner`;
      }
    },
  },

  // Destination routes
  {path: 'restaurant/:location/menu/breakfast', component: Menu},
  {path: 'restaurant/:location/menu/lunch', component: Menu},
  {path: 'restaurant/:location/menu/dinner', component: Menu},

  // Default redirect
  {path: '', redirectTo: '/restaurant/downtown/menu', pathMatch: 'full'},
];
```

برای یادگیری بیشتر، [API docs مربوط به RedirectFunction](api/router/RedirectFunction) را ببینید.

## قدم بعدی

برای اطلاعات بیشتر درباره property مربوط به `redirectTo`، [API docs](api/router/Route#redirectTo) را ببینید.
