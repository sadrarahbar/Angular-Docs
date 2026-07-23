# مهاجرت به routeهای lazy-loaded

این schematic به توسعه‌دهندگان کمک می‌کند routeهای component با بارگذاری eager را به routeهای lazy-loaded تبدیل کنند. این کار به فرایند build اجازه می‌دهد bundle مربوط به production را به chunkهای کوچک‌تر تقسیم کند و از ایجاد bundle بزرگ JS شامل همه routeها که بر بارگذاری اولیه برنامه اثر منفی دارد جلوگیری شود.

schematic را با دستور زیر اجرا کنید:

```shell
ng generate @angular/core:route-lazy-loading
```

### گزینه پیکربندی `path`

مهاجرت به‌طور پیش‌فرض کل برنامه را بررسی می‌کند. اگر می‌خواهید آن را فقط روی بخشی از فایل‌ها اعمال کنید، آرگومان path را مانند زیر وارد کنید:

```shell
ng generate @angular/core:route-lazy-loading --path src/app/sub-component
```

مقدار پارامتر path یک مسیر relative در پروژه است.

### چگونه کار می‌کند؟

schematic تلاش می‌کند تمام محل‌هایی را که routeهای برنامه در آن‌ها تعریف شده‌اند پیدا کند:

- `RouterModule.forRoot` و `RouterModule.forChild`
- `Router.resetConfig`
- `provideRouter`
- variableهایی از نوع `Routes` یا `Route[]` (برای مثال `const routes: Routes = [{...}]`)

مهاجرت تمام componentهای routeها را بررسی می‌کند؛ اگر standalone و با بارگذاری eager باشند، آن‌ها را به routeهای lazy-loaded تبدیل می‌کند.

#### پیش از مهاجرت

```typescript
// app.module.ts
import {Home} from './home';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'home',
        // Home is standalone and eagerly loaded
        component: Home,
      },
    ]),
  ],
})
export class AppModule {}
```

#### پس از مهاجرت

```typescript
// app.module.ts
@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'home',
        // ↓ Home is now lazy loaded
        loadComponent: () => import('./home').then((m) => m.Home),
      },
    ]),
  ],
})
export class AppModule {}
```

این مهاجرت همچنین اطلاعات تمام componentهای declarationشده در NgModuleها را جمع‌آوری و فهرست routeهایی را که از آن‌ها استفاده می‌کنند همراه با محل فایل نمایش می‌دهد. بهتر است آن componentها را standalone کرده و مهاجرت را دوباره اجرا کنید. برای تبدیل آن‌ها به standalone می‌توانید از [مهاجرت موجود](reference/migrations/standalone) استفاده کنید.
