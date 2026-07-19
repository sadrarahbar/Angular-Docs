# کنترل دسترسی route با guardها

CRITICAL: هرگز به client-side guardها به‌عنوان تنها منبع access control تکیه نکنید. هر JavaScriptای که در مرورگر وب اجرا می‌شود، می‌تواند توسط کاربری که مرورگر را اجرا می‌کند تغییر کند. همیشه علاوه بر هر client-side guard، user authorization را در server-side هم enforce کنید.

Route guardها functionهایی هستند که کنترل می‌کنند آیا کاربر می‌تواند به یک route مشخص navigate کند یا از آن خارج شود. آن‌ها مثل checkpointهایی هستند که مدیریت می‌کنند کاربر اجازه دسترسی به routeهای مشخص را دارد یا نه. نمونه‌های رایج استفاده از route guardها شامل authentication و access control است.

## ساخت یک route guard

می‌توانید با Angular CLI یک route guard generate کنید:

```bash
ng generate guard CUSTOM_NAME
```

این دستور از شما می‌خواهد انتخاب کنید از کدام [نوع route guard](#types-of-route-guards) استفاده شود و سپس فایل متناظر `CUSTOM_NAME-guard.ts` را می‌سازد.

TIP: همچنین می‌توانید با ساخت یک فایل TypeScript جداگانه در پروژه Angular خود، route guard را به‌صورت دستی بسازید. توسعه‌دهنده‌ها معمولا suffix مربوط به `-guard.ts` را به نام فایل اضافه می‌کنند تا از فایل‌های دیگر قابل تشخیص باشد.

## نوع‌های return در route guard

همه route guardها نوع‌های return ممکن یکسانی دارند. این موضوع در نحوه کنترل navigation به شما flexibility می‌دهد:

| Return types                    | Description                                                                 |
| ------------------------------- | --------------------------------------------------------------------------- |
| `boolean`                       | `true` اجازه navigation می‌دهد، `false` آن را block می‌کند؛ note مربوط به `CanMatch` route guard را ببینید |
| `UrlTree` یا `RedirectCommand`  | به‌جای block کردن، به route دیگری redirect می‌کند                          |
| `Promise<T>` یا `Observable<T>` | Router از اولین value emitشده استفاده می‌کند و سپس unsubscribe می‌کند       |

NOTE: `CanMatch` متفاوت رفتار می‌کند؛ وقتی `false` برگرداند، Angular به‌جای block کردن کامل navigation، routeهای matching دیگر را امتحان می‌کند.

## نوع‌های route guard

Angular چهار نوع route guard فراهم می‌کند که هرکدام هدف متفاوتی دارند:

<docs-pill-row>
  <docs-pill href="#canactivate" title="CanActivate"/>
  <docs-pill href="#canactivatechild" title="CanActivateChild"/>
  <docs-pill href="#candeactivate" title="CanDeactivate"/>
  <docs-pill href="#canmatch" title="CanMatch"/>
</docs-pill-row>

همه guardها به [serviceهایی که در سطح route provide شده‌اند](guide/di/defining-dependency-providers#route-providers) و همچنین از طریق argument مربوط به `route` به اطلاعات مخصوص route دسترسی دارند.

### CanActivate

Guard مربوط به `CanActivate` مشخص می‌کند آیا کاربر می‌تواند به یک route دسترسی پیدا کند یا نه. این guard بیشتر برای authentication و authorization استفاده می‌شود.

به argumentهای پیش‌فرض زیر دسترسی دارد:

- `route`: `ActivatedRouteSnapshot` - شامل اطلاعاتی درباره routeای که در حال فعال شدن است
- `state`: `RouterStateSnapshot` - شامل state فعلی router

می‌تواند [نوع‌های return استاندارد guard](#route-guard-return-types) را برگرداند.

```ts
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};
```

Tip: اگر لازم دارید کاربر را redirect کنید، یک [`URLTree`](api/router/UrlTree) یا [`RedirectCommand`](api/router/RedirectCommand) برگردانید. مقدار `false` برنگردانید و بعد کاربر را به‌صورت programmatic `navigate` نکنید.

برای اطلاعات بیشتر، [API docs مربوط به CanActivateFn](api/router/CanActivateFn) را ببینید.

### CanActivateChild

Guard مربوط به `CanActivateChild` مشخص می‌کند آیا کاربر می‌تواند به child routeهای یک route والد خاص دسترسی پیدا کند یا نه. این guard وقتی مفید است که می‌خواهید یک section کامل از nested routeها را محافظت کنید. به بیان دیگر، `canActivateChild` برای _همه_ childها اجرا می‌شود. اگر یک child component خودش component فرزند دیگری زیرمجموعه داشته باشد، `canActivateChild` برای هر دو component یک بار اجرا می‌شود.

به argumentهای پیش‌فرض زیر دسترسی دارد:

- `childRoute`: `ActivatedRouteSnapshot` - شامل اطلاعاتی درباره snapshot «آینده»، یعنی stateای که router تلاش دارد به آن navigate کند، برای child routeای که در حال فعال شدن است
- `state`: `RouterStateSnapshot` - شامل state فعلی router

می‌تواند [نوع‌های return استاندارد guard](#route-guard-return-types) را برگرداند.

```ts
export const adminChildGuard: CanActivateChildFn = (
  childRoute: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);
  return authService.hasRole('admin');
};
```

برای اطلاعات بیشتر، [API docs مربوط به CanActivateChildFn](api/router/CanActivateChildFn) را ببینید.

### CanDeactivate

Guard مربوط به `CanDeactivate` مشخص می‌کند آیا کاربر می‌تواند از یک route خارج شود یا نه. یک سناریوی رایج، جلوگیری از navigation دور شدن از formهای ذخیره‌نشده است.

به argumentهای پیش‌فرض زیر دسترسی دارد:

- `component`: `T` - instance مربوط به componentای که در حال deactivated شدن است
- `currentRoute`: `ActivatedRouteSnapshot` - شامل اطلاعاتی درباره route فعلی
- `currentState`: `RouterStateSnapshot` - شامل router state فعلی
- `nextState`: `RouterStateSnapshot` - شامل router state بعدی که قرار است به آن navigate شود

می‌تواند [نوع‌های return استاندارد guard](#route-guard-return-types) را برگرداند.

```ts
export const unsavedChangesGuard: CanDeactivateFn<Form> = (
  component: Form,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot,
) => {
  return component.hasUnsavedChanges()
    ? confirm('You have unsaved changes. Are you sure you want to leave?')
    : true;
};
```

برای اطلاعات بیشتر، [API docs مربوط به CanDeactivateFn](api/router/CanDeactivateFn) را ببینید.

### CanMatch

Guard مربوط به `CanMatch` مشخص می‌کند آیا یک route می‌تواند در طول path matching match شود یا نه. برخلاف guardهای دیگر، رد شدن آن باعث می‌شود router routeهای matching دیگر را امتحان کند، نه اینکه navigation را کاملا block کند. این قابلیت برای feature flagها، A/B testing، یا route loading شرطی مفید است.

به argumentهای پیش‌فرض زیر دسترسی دارد:

- `route`: `Route` - route configurationای که در حال ارزیابی است
- `segments`: `UrlSegment[]` - URL segmentهایی که توسط ارزیابی routeهای والد قبلی مصرف نشده‌اند
- `currentSnapshot: PartialMatchRouteSnapshot` - route snapshot فعلی تا این نقطه از فرایند matching

می‌تواند [نوع‌های return استاندارد guard](#route-guard-return-types) را برگرداند، اما وقتی `false` برگرداند، Angular به‌جای block کردن کامل navigation، routeهای matching دیگر را امتحان می‌کند.

```ts
export const featureToggleGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[],
  currentSnapshot: PartialMatchRouteSnapshot,
) => {
  const featureService = inject(FeatureService);
  return featureService.isFeatureEnabled('newDashboard');
};
```

همچنین می‌تواند به شما اجازه دهد برای یک path یکسان از componentهای متفاوت استفاده کنید.

```ts
// 📄 routes.ts
const routes: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboard,
    canMatch: [adminGuard],
  },
  {
    path: 'dashboard',
    component: UserDashboard,
    canMatch: [userGuard],
  },
];
```

در این مثال، وقتی کاربر `/dashboard` را باز کند، اولین routeای که guard درست آن match شود استفاده خواهد شد.

برای اطلاعات بیشتر، [API docs مربوط به CanMatchFn](api/router/CanMatchFn) را ببینید.

## اعمال guardها روی routeها

بعد از اینکه route guardهای خود را ساختید، باید آن‌ها را در route definitionهای خود configure کنید.

Guardها در route configuration به‌صورت array مشخص می‌شوند تا بتوانید چند guard را روی یک route اعمال کنید. آن‌ها به همان ترتیبی اجرا می‌شوند که در array آمده‌اند.

```ts
import {Routes} from '@angular/router';
import {authGuard} from './guards/auth.guard';
import {adminGuard} from './guards/admin.guard';
import {canDeactivateGuard} from './guards/can-deactivate.guard';
import {featureToggleGuard} from './guards/feature-toggle.guard';

const routes: Routes = [
  // Basic CanActivate - requires authentication
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },

  // Multiple CanActivate guards - requires authentication AND admin role
  {
    path: 'admin',
    component: Admin,
    canActivate: [authGuard, adminGuard],
  },

  // CanActivate + CanDeactivate - protected route with unsaved changes check
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
  },

  // CanActivateChild - protects all child routes
  {
    path: 'users', // /user - NOT protected
    canActivateChild: [authGuard],
    children: [
      // /users/list - PROTECTED
      {path: 'list', component: UserList},
      // /users/detail/:id - PROTECTED
      {path: 'detail/:id', component: UserDetail},
    ],
  },

  // CanMatch - conditionally matches route based on feature flag
  {
    path: 'beta-feature',
    component: BetaFeature,
    canMatch: [featureToggleGuard],
  },

  // Fallback route if beta feature is disabled
  {
    path: 'beta-feature',
    component: ComingSoon,
  },
];
```
