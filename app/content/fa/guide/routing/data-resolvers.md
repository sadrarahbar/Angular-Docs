# Data resolverها

Data resolverها به شما اجازه می‌دهند قبل از navigation به یک route، data را fetch کنید و مطمئن شوید componentهای شما قبل از render شدن، data مورد نیازشان را دریافت کرده‌اند. این کار می‌تواند نیاز به loading stateها را کم کند و با pre-load کردن data ضروری، user experience را بهتر کند.

## Data resolver چیست؟

Data resolver یک service است که function مربوط به `ResolveFn` را پیاده‌سازی می‌کند. قبل از فعال شدن یک route اجرا می‌شود و می‌تواند data را از APIها، databaseها یا sourceهای دیگر fetch کند. Dataی resolved از طریق `ActivatedRoute` در اختیار component قرار می‌گیرد.

Data resolverها به [serviceهایی که در سطح route provide شده‌اند](guide/di/defining-dependency-providers#route-providers) و همچنین از طریق argument مربوط به `route` به اطلاعات مخصوص route دسترسی دارند.

## چرا از data resolver استفاده کنیم؟

Data resolverها چالش‌های رایج routing را حل می‌کنند:

- **جلوگیری از empty stateها**: Componentها بلافاصله هنگام loading، data دریافت می‌کنند
- **User experience بهتر**: برای data حیاتی، loading spinner لازم نیست
- **Error handling**: Errorهای data fetching را قبل از navigation مدیریت می‌کند
- **Data consistency**: مطمئن می‌شود data لازم قبل از render شدن در دسترس است، که برای SSR مهم است

## ساخت resolver

برای ساخت resolver، functionای با type مربوط به `ResolveFn` می‌نویسید.

این function، `ActivatedRouteSnapshot` و `RouterStateSnapshot` را به‌عنوان parameter دریافت می‌کند.

در اینجا resolverای می‌بینید که قبل از render کردن یک route، با استفاده از function مربوط به [`inject`](api/core/inject) اطلاعات کاربر را می‌گیرد:

```ts
import {inject} from '@angular/core';
import {UserStore, SettingsStore} from './user-store';
import type {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import type {User, Settings} from './types';

export const userResolver: ResolveFn<User> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const userStore = inject(UserStore);
  const userId = route.paramMap.get('id')!;
  return userStore.getUser(userId);
};

export const settingsResolver: ResolveFn<Settings> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const settingsStore = inject(SettingsStore);
  const userId = route.paramMap.get('id')!;
  return settingsStore.getUserSettings(userId);
};
```

## Configure کردن routeها با resolverها

وقتی می‌خواهید یک یا چند data resolver را به یک route اضافه کنید، می‌توانید آن را زیر key مربوط به `resolve` در route configuration قرار دهید. Type مربوط به `Routes` ساختار route configurationها را تعریف می‌کند:

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'user/:id',
    component: UserDetail,
    resolve: {
      user: userResolver,
      settings: settingsResolver,
    },
  },
];
```

می‌توانید درباره [`resolve` configuration در API docs](api/router/Route#resolve) بیشتر یاد بگیرید.

## دسترسی به resolved data در componentها

### استفاده از ActivatedRoute

می‌توانید در یک component با دسترسی به snapshot data از `ActivatedRoute` و با استفاده از function مربوط به `signal`، به resolved data دسترسی داشته باشید:

```angular-ts
import {Component, inject, computed} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import type {User, Settings} from './types';

@Component({
  template: `
    <h1>{{ user().name }}</h1>
    <p>{{ user().email }}</p>
    <div>Theme: {{ settings().theme }}</div>
  `,
})
export class UserDetail {
  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data);
  user = computed(() => this.data().user as User);
  settings = computed(() => this.data().settings as Settings);
}
```

### استفاده از withComponentInputBinding

یک رویکرد دیگر برای دسترسی به resolved data این است که هنگام configure کردن router با `provideRouter`، از `withComponentInputBinding()` استفاده کنید. این کار اجازه می‌دهد resolved data مستقیما به‌عنوان component input پاس داده شود:

```ts
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {routes} from './app.routes';

bootstrapApplication(App, {
  providers: [provideRouter(routes, withComponentInputBinding())],
});
```

با این configuration، می‌توانید در component خود inputهایی تعریف کنید که با keyهای resolver match باشند و برای inputهای required از functionهای `input` و `input.required` استفاده کنید:

```angular-ts
import {Component, input} from '@angular/core';
import type {User, Settings} from './types';

@Component({
  template: `
    <h1>{{ user().name }}</h1>
    <p>{{ user().email }}</p>
    <div>Theme: {{ settings().theme }}</div>
  `,
})
export class UserDetail {
  user = input.required<User>();
  settings = input.required<Settings>();
}
```

این رویکرد type safety بهتری فراهم می‌کند و نیاز به inject کردن `ActivatedRoute` فقط برای دسترسی به resolved data را حذف می‌کند.

## Error handling در resolverها

در صورت failure در navigation، مهم است errorها را در data resolverهای خود graceful مدیریت کنید. در غیر این صورت، یک `NavigationError` رخ می‌دهد و navigation به route فعلی fail می‌شود؛ این موضوع تجربه بدی برای کاربران ایجاد می‌کند.

سه راه اصلی برای مدیریت errorها با data resolverها وجود دارد:

1. Centralize کردن error handling در `withNavigationErrorHandler`
2. مدیریت errorها از طریق subscription به router eventها
3. مدیریت errorها به‌صورت مستقیم در resolver

### Centralize کردن error handling در `withNavigationErrorHandler`

Feature مربوط به [`withNavigationErrorHandler`](api/router/withNavigationErrorHandler) راهی centralized برای مدیریت همه navigation errorها فراهم می‌کند، از جمله errorهایی که از data resolverهای ناموفق می‌آیند. این رویکرد logic مربوط به error handling را در یک محل نگه می‌دارد و از duplicate شدن کد error handling در resolverهای مختلف جلوگیری می‌کند.

```ts
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, withNavigationErrorHandler} from '@angular/router';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {routes} from './app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(
      routes,
      withNavigationErrorHandler((error) => {
        const router = inject(Router);

        if (error?.message) {
          console.error('Navigation error occurred:', error.message);
        }

        router.navigate(['/error']);
      }),
    ),
  ],
});
```

با این configuration، resolverهای شما می‌توانند روی data fetching تمرکز کنند و مدیریت error scenarioها را به handler مرکزی بسپارند:

```ts
export const userResolver: ResolveFn<User> = (route) => {
  const userStore = inject(UserStore);
  const userId = route.paramMap.get('id')!;
  // No need for explicit error handling - let it bubble up
  return userStore.getUser(userId);
};
```

### مدیریت errorها از طریق subscription به router eventها

همچنین می‌توانید errorهای resolver را با subscribe کردن به router eventها و گوش دادن به eventهای `NavigationError` مدیریت کنید. این رویکرد کنترل granularتری روی error handling می‌دهد و اجازه می‌دهد logic سفارشی برای recovery از error پیاده‌سازی کنید.

```angular-ts
import {Component, inject, signal} from '@angular/core';
import {Router, NavigationError} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    @if (errorMessage()) {
      <div class="error-banner">
        {{ errorMessage() }}
        <button (click)="retryNavigation()">Retry</button>
      </div>
    }
    <router-outlet />
  `,
})
export class App {
  private router = inject(Router);
  private lastFailedUrl = signal('');

  private navigationErrors = toSignal(
    this.router.events.pipe(
      map((event) => {
        if (event instanceof NavigationError) {
          this.lastFailedUrl.set(event.url);

          if (event.error) {
            console.error('Navigation error', event.error);
          }

          return 'Navigation failed. Please try again.';
        }
        return '';
      }),
    ),
    {initialValue: ''},
  );

  errorMessage = this.navigationErrors;

  retryNavigation() {
    if (this.lastFailedUrl()) {
      this.router.navigateByUrl(this.lastFailedUrl());
    }
  }
}
```

این رویکرد به‌خصوص وقتی مفید است که لازم دارید:

- برای navigation ناموفق، retry logic سفارشی پیاده‌سازی کنید
- بر اساس نوع failure، error messageهای مشخصی نمایش دهید
- Navigation failureها را برای analytics track کنید

### مدیریت مستقیم errorها در resolver

در اینجا نسخه به‌روزشده‌ای از `userResolver` می‌بینید که error را log می‌کند و با استفاده از service مربوط به `Router` به صفحه generic مربوط به `/users` برمی‌گردد:

```ts
import {inject} from '@angular/core';
import {ResolveFn, RedirectCommand, Router} from '@angular/router';
import {catchError, of, EMPTY} from 'rxjs';
import {UserStore} from './user-store';
import type {User} from './types';

export const userResolver: ResolveFn<User | RedirectCommand> = (route) => {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const userId = route.paramMap.get('id')!;

  return userStore.getUser(userId).pipe(
    catchError((error) => {
      console.error('Failed to load user:', error);
      return of(new RedirectCommand(router.parseUrl('/users')));
    }),
  );
};
```

## نکته‌های navigation loading

هرچند data resolverها از loading state داخل componentها جلوگیری می‌کنند، یک نکته UX متفاوت ایجاد می‌کنند: تا زمانی که resolverها اجرا می‌شوند، navigation block است. کاربران ممکن است بین کلیک روی link و دیدن route جدید، تاخیر حس کنند؛ مخصوصا با network requestهای کند.

### فراهم کردن feedback برای navigation

برای بهتر کردن user experience هنگام اجرای resolver، می‌توانید به router eventها گوش دهید و loading indicator نمایش دهید:

```angular-ts
import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    @if (isNavigating()) {
      <div class="loading-bar">Loading...</div>
    }
    <router-outlet />
  `,
})
export class App {
  private router = inject(Router);
  isNavigating = computed(() => !!this.router.currentNavigation());
}
```

این رویکرد مطمئن می‌شود کاربران در حالی که resolverها data را fetch می‌کنند، feedback بصری از در جریان بودن navigation دریافت می‌کنند.

## Best practiceها

- **Resolverها را سبک نگه دارید**: Resolverها فقط باید data ضروری را fetch کنند، نه هر چیزی که صفحه ممکن است لازم داشته باشد
- **Errorها را مدیریت کنید**: همیشه errorها را graceful مدیریت کنید تا بهترین تجربه ممکن را برای کاربران فراهم کنید
- **از caching استفاده کنید**: برای بهتر شدن performance، caching برای resolved data را در نظر بگیرید
- **Navigation UX را در نظر بگیرید**: برای اجرای resolverها loading indicator پیاده‌سازی کنید، چون هنگام data fetching، navigation block می‌شود
- **Timeoutهای منطقی تنظیم کنید**: از resolverهایی که ممکن است بی‌نهایت hang کنند و navigation را block کنند دوری کنید
- **Type safety**: برای resolved data از TypeScript interfaceها استفاده کنید

## خواندن resolved data والد در resolverهای فرزند

Resolverها از والد به فرزند اجرا می‌شوند. وقتی یک route والد resolver تعریف کند، dataی resolved آن برای resolverهای فرزندی که بعدا اجرا می‌شوند در دسترس است.

```ts
import { inject } from '@angular/core';
import { provideRouter , ActivatedRouteSnapshot } from '@angular/router';
import { userResolver } from './resolvers';
import { UserPosts } from './pages';
import { PostService } from './services',
import type { User } from './types';

provideRouter([
  {
    path: 'users/:id',
    resolve: { user: userResolver }, // user resolver in the parent route
    children: [
      {
        path: 'posts',
        component: UserPosts,
        // route.data.user is available here while this resolver runs
        resolve: {
          posts: (route: ActivatedRouteSnapshot) => {
            const postService = inject(PostService);
            const user = route.parent?.data['user'] as User; // parent data
            const userId = user.id;
            return postService.getPostByUser(userId);
          },
        },
      },
    ],
  },
]);
```
