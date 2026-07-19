# تست کردن routing و navigation

تست کردن routing و navigation ضروری است تا مطمئن شوید application شما هنگام navigate کردن کاربران بین routeهای مختلف درست رفتار می‌کند. این راهنما strategyهای مختلف برای تست کردن قابلیت‌های routing در applicationهای Angular را پوشش می‌دهد.

## پیش‌نیازها

این راهنما فرض می‌کند با ابزارها و کتابخانه‌های زیر آشنا هستید:

- **[Vitest](https://vitest.dev/)** - testing framework جاوااسکریپت که testing syntax مثل `describe`، `it` و `expect` را فراهم می‌کند
- **[Angular Testing Utilities](guide/testing)** - ابزارهای testing داخلی Angular، مثل [`TestBed`](api/core/testing/TestBed) و [`ComponentFixture`](api/core/testing/ComponentFixture)
- **[`RouterTestingHarness`](api/router/testing/RouterTestingHarness)** - test harness برای تست کردن routed componentها با navigation داخلی و قابلیت‌های component testing

## سناریوهای تست

### Route parameterها

Componentها اغلب برای fetch کردن data به route parameterهای داخل URL متکی هستند؛ مثلا user ID برای صفحه profile.

مثال زیر نشان می‌دهد چطور یک component به نام `UserProfile` را تست کنید که user ID را از route نمایش می‌دهد.

```ts { header: 'user-profile.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideRouter} from '@angular/router';
import {UserProfile} from './user-profile';

describe('UserProfile', () => {
  it('should display user ID from route parameters', async () => {
    TestBed.configureTestingModule({
      imports: [UserProfile],
      providers: [provideRouter([{path: 'user/:id', component: UserProfile}])],
    });

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/user/123', UserProfile);

    expect(harness.routeNativeElement?.textContent).toContain('User Profile: 123');
  });
});
```

```angular-ts {header: 'user-profile.ts'}
import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  template: '<h1>User Profile: {{userId}}</h1>',
})
export class UserProfile {
  private route = inject(ActivatedRoute);
  userId: string | null = this.route.snapshot.paramMap.get('id');
}
```

### Route guardها

Route guardها دسترسی به routeها را بر اساس شرط‌هایی مثل authentication یا permission کنترل می‌کنند. هنگام تست guardها، روی mock کردن dependencyها و verify کردن نتیجه navigation تمرکز کنید.

مثال زیر یک `authGuard` را تست می‌کند که برای کاربران authenticated اجازه navigation می‌دهد و کاربران unauthenticated را به صفحه login redirect می‌کند.

```ts {header: 'auth.guard.spec.ts'}
import {vi, type Mocked} from 'vitest';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideRouter, Router} from '@angular/router';
import {authGuard} from './auth.guard';
import {AuthStore} from './auth-store';
import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';

@Component({template: '<h1>Protected Page</h1>'})
class Protected {}

@Component({template: '<h1>Login Page</h1>'})
class Login {}

describe('authGuard', () => {
  let authStore: Mocked<AuthStore>;
  let harness: RouterTestingHarness;

  async function setup(isAuthenticated: boolean) {
    authStore = {isAuthenticated: vi.fn().mockReturnValue(isAuthenticated)} as Mocked<AuthStore>;

    TestBed.configureTestingModule({
      providers: [
        {provide: AuthStore, useValue: authStore},
        provideRouter([
          {path: 'protected', component: Protected, canActivate: [authGuard]},
          {path: 'login', component: Login},
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  }

  it('allows navigation when user is authenticated', async () => {
    await setup(true);
    await harness.navigateByUrl('/protected', Protected);
    // The protected component should render when authenticated
    expect(harness.routeNativeElement?.textContent).toContain('Protected Page');
  });

  it('redirects to login when user is not authenticated', async () => {
    await setup(false);
    await harness.navigateByUrl('/protected', Login);
    // The login component should render after redirect
    expect(harness.routeNativeElement?.textContent).toContain('Login Page');
  });
});
```

```ts {header: 'auth.guard.ts'}
import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthStore} from './auth-store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  return authStore.isAuthenticated() ? true : router.parseUrl('/login');
};
```

### Router outletها

تست‌های router outlet بیشتر شبیه integration test هستند، چون در اصل integration بین [`Router`](api/router/Router)، outlet و componentهای نمایش‌داده‌شده را تست می‌کنید.

در اینجا مثالی از setup یک test می‌بینید که verify می‌کند برای routeهای مختلف، componentهای متفاوت نمایش داده می‌شوند:

```ts {header: 'app.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideRouter} from '@angular/router';
import {Component} from '@angular/core';
import {App} from './app';

@Component({
  template: '<h1>Home Page</h1>',
})
class MockHome {}

@Component({
  template: '<h1>About Page</h1>',
})
class MockAbout {}

describe('App Router Outlet', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([
          {path: '', component: MockHome},
          {path: 'about', component: MockAbout},
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  });

  it('should display home component for default route', async () => {
    await harness.navigateByUrl('');

    expect(harness.routeNativeElement?.textContent).toContain('Home Page');
  });

  it('should display about component for about route', async () => {
    await harness.navigateByUrl('/about');

    expect(harness.routeNativeElement?.textContent).toContain('About Page');
  });
});
```

```angular-ts {header: 'app.ts'}
import {Component} from '@angular/core';
import {RouterOutlet, RouterLink} from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <a routerLink="/">Home</a>
      <a routerLink="/about">About</a>
    </nav>
    <router-outlet />
  `,
})
export class App {}
```

### Nested routeها

تست nested routeها مطمئن می‌شود وقتی به URLهای nested navigate می‌کنید، هم component والد و هم component فرزند درست render می‌شوند. این موضوع مهم است، چون nested routeها چند لایه دارند.

باید verify کنید که:

1. Component والد درست render می‌شود.
2. Component فرزند داخل آن render می‌شود.
3. مطمئن شوید هر دو component می‌توانند به route data مربوط به خودشان دسترسی داشته باشند.

در اینجا مثالی از تست کردن ساختار route والد-فرزند می‌بینید:

```ts {header: 'nested-routes.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideRouter} from '@angular/router';
import {Parent, Child} from './nested-components';

describe('Nested Routes', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Parent, Child],
      providers: [
        provideRouter([
          {
            path: 'parent',
            component: Parent,
            children: [{path: 'child', component: Child}],
          },
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  });

  it('should render parent and child components for nested route', async () => {
    await harness.navigateByUrl('/parent/child');

    expect(harness.routeNativeElement?.textContent).toContain('Parent Component');
    expect(harness.routeNativeElement?.textContent).toContain('Child Component');
  });
});
```

```angular-ts {header: 'nested.ts'}
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  imports: [RouterOutlet],
  template: `
    <h1>Parent Component</h1>
    <router-outlet />
  `,
})
export class Parent {}

@Component({
  template: '<h2>Child Component</h2>',
})
export class Child {}
```

### Query parameterها و fragmentها

Query parameterها، مثل `?search=angular&category=web`، و URL fragmentها، مثل `#section1`، data اضافه‌ای را از طریق URL فراهم می‌کنند که روی اینکه کدام component load شود اثر نمی‌گذارد، اما روی رفتار component اثر دارد. Componentهایی که query parameterها را از طریق [`ActivatedRoute.queryParams`](api/router/ActivatedRoute#queryParams) می‌خوانند، باید تست شوند تا مطمئن شوید سناریوهای مختلف parameter را درست مدیریت می‌کنند.

برخلاف route parameterها که بخشی از route definition هستند، query parameterها اختیاری‌اند و می‌توانند بدون trigger کردن route navigation تغییر کنند. یعنی باید هم initial loading و هم reactive updateها هنگام تغییر query parameterها را تست کنید.

در اینجا مثالی از نحوه تست query parameterها و fragmentها می‌بینید:

```ts {header: 'search.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {Router, provideRouter} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {Search} from './search';

describe('Search', () => {
  let component: Search;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Search],
      providers: [provideRouter([{path: 'search', component: Search}])],
    });

    harness = await RouterTestingHarness.create();
  });

  it('should read search term from query parameters', async () => {
    component = await harness.navigateByUrl('/search?q=angular', Search);

    expect(component.searchTerm()).toBe('angular');
  });
});
```

```angular-ts {header: 'search.ts'}
import {Component, inject, computed} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  template: '<div>Search term: {{searchTerm()}}</div>',
})
export class Search {
  private route = inject(ActivatedRoute);
  private queryParams = toSignal(this.route.queryParams, {initialValue: {}});

  searchTerm = computed(() => this.queryParams()['q'] || null);
}
```

## Best practiceها برای router testing

1. **از RouterTestingHarness استفاده کنید** - برای تست کردن routed componentها، از [`RouterTestingHarness`](api/router/testing/RouterTestingHarness) استفاده کنید که API تمیزتری فراهم می‌کند و نیاز به test host componentها را حذف می‌کند. این ابزار direct component access، navigation داخلی و type safety بهتر ارائه می‌دهد. با این حال، برای بعضی سناریوها مثل تست named outletها چندان مناسب نیست و ممکن است لازم باشد host componentهای سفارشی بسازید.
2. **External dependencyها را با فکر مدیریت کنید** - وقتی ممکن است، برای testهای واقعی‌تر از implementationهای واقعی استفاده کنید. اگر implementation واقعی ممکن نیست، مثلا برای APIهای خارجی، از fakeهایی استفاده کنید که رفتار واقعی را تقریب می‌زنند. Mock یا stub را فقط به‌عنوان آخرین راه استفاده کنید، چون می‌توانند testها را شکننده و کمتر قابل اعتماد کنند.
3. **Navigation state را تست کنید** - هم action مربوط به navigation و هم application state حاصل را verify کنید، از جمله تغییر URL و component rendering.
4. **Operationهای asynchronous را مدیریت کنید** - Router navigation asynchronous است. در testهای خود از `async/await` استفاده کنید تا timing درست مدیریت شود.
5. **سناریوهای error را تست کنید** - برای routeهای نامعتبر، navigation ناموفق و guard rejectionها test اضافه کنید تا مطمئن شوید application شما edge caseها را graceful مدیریت می‌کند.
6. **Angular Router را mock نکنید** - به‌جای آن، route configurationهای واقعی provide کنید و از harness برای navigate کردن استفاده کنید. این کار testهای شما را robustتر می‌کند و احتمال شکستن آن‌ها با updateهای داخلی Angular کمتر می‌شود؛ همچنین مطمئن می‌شود هنگام update شدن router، مشکل‌های واقعی را می‌گیرید، چون mockها می‌توانند breaking changeها را پنهان کنند.
