# Lifecycle و eventهای Router

Angular Router مجموعه کاملی از lifecycle hookها و eventها فراهم می‌کند که به شما اجازه می‌دهند به تغییرات navigation واکنش نشان دهید و در طول فرایند routing، logic سفارشی اجرا کنید.

## Eventهای رایج router

Angular Router، navigation eventهایی emit می‌کند که می‌توانید برای دنبال کردن navigation lifecycle به آن‌ها subscribe کنید. این eventها از طریق observable مربوط به `Router.events` در دسترس‌اند. این بخش eventهای رایج routing lifecycle را برای navigation و error tracking پوشش می‌دهد، به‌ترتیب زمانی.

| Events                                              | Description                                                                                          |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [`NavigationStart`](api/router/NavigationStart)     | وقتی navigation شروع می‌شود رخ می‌دهد و URL درخواست‌شده را شامل می‌شود.                              |
| [`RoutesRecognized`](api/router/RoutesRecognized)   | بعد از اینکه router مشخص کرد کدام route با URL match است رخ می‌دهد و اطلاعات route state را شامل می‌شود. |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)   | phase مربوط به route guard را شروع می‌کند. Router، route guardهایی مثل `canActivate` و `canDeactivate` را ارزیابی می‌کند. |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)       | کامل شدن ارزیابی guard را اعلام می‌کند. نتیجه، یعنی allowed یا denied، را شامل می‌شود.              |
| [`ResolveStart`](api/router/ResolveStart)           | phase مربوط به data resolution را شروع می‌کند. Route resolverها fetch کردن data را شروع می‌کنند.     |
| [`ResolveEnd`](api/router/ResolveEnd)               | Data resolution کامل می‌شود. همه data لازم در دسترس قرار می‌گیرد.                                    |
| [`NavigationEnd`](api/router/NavigationEnd)         | event نهایی وقتی navigation با موفقیت کامل می‌شود. Router، URL را به‌روزرسانی می‌کند.                |
| [`NavigationSkipped`](api/router/NavigationSkipped) | وقتی router navigation را skip می‌کند رخ می‌دهد، مثلا navigation به همان URL.                         |

موارد زیر error eventهای رایج هستند:

| Event                                             | Description                                                                 |
| ------------------------------------------------- | --------------------------------------------------------------------------- |
| [`NavigationCancel`](api/router/NavigationCancel) | وقتی router، navigation را cancel می‌کند رخ می‌دهد؛ اغلب به‌خاطر اینکه guard مقدار false برگردانده است. |
| [`NavigationError`](api/router/NavigationError)   | وقتی navigation fail می‌شود رخ می‌دهد؛ ممکن است به‌خاطر route نامعتبر یا error در resolver باشد.      |

برای فهرست همه lifecycle eventها، [جدول کامل این راهنما](#all-router-events) را ببینید.

## چطور به router eventها subscribe کنیم

وقتی می‌خواهید هنگام lifecycle eventهای مشخص navigation کد اجرا کنید، می‌توانید به `router.events` subscribe کنید و instance مربوط به event را بررسی کنید:

```ts
// Example of subscribing to router events
import {Component, inject, signal, effect} from '@angular/core';
import {Event, Router, NavigationStart, NavigationEnd} from '@angular/router';

@Component(/* ... */)
export class RouterEvents {
  private readonly router = inject(Router);

  constructor() {
    // Subscribe to router events and react to events
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Navigation starting
        console.log('Navigation starting:', event.url);
      }
      if (event instanceof NavigationEnd) {
        // Navigation completed
        console.log('Navigation completed:', event.url);
      }
    });
  }
}
```

NOTE: Type مربوط به [`Event`](api/router/Event) از `@angular/router` همنام type global معمولی [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) است، اما با type مربوط به [`RouterEvent`](api/router/RouterEvent) تفاوت دارد.

## چطور routing eventها را debug کنیم

Debug کردن مشکل‌های router navigation بدون دیدن sequence eventها می‌تواند دشوار باشد. Angular یک debugging feature داخلی فراهم می‌کند که همه router eventها را در console log می‌کند و به شما کمک می‌کند navigation flow را بفهمید و تشخیص دهید مشکل کجا رخ می‌دهد.

وقتی لازم دارید sequence مربوط به Router event را inspect کنید، می‌توانید logging برای eventهای داخلی navigation را برای debugging فعال کنید. این کار را می‌توانید با پاس دادن یک configuration option، یعنی `withDebugTracing()`، انجام دهید که console logging دقیق برای همه routing eventها را فعال می‌کند.

```ts
import {provideRouter, withDebugTracing} from '@angular/router';

const appRoutes: Routes = [];
bootstrapApplication(App, {
  providers: [provideRouter(appRoutes, withDebugTracing())],
});
```

برای اطلاعات بیشتر، docs رسمی مربوط به [`withDebugTracing`](api/router/withDebugTracing) را ببینید.

## Use caseهای رایج

Router eventها قابلیت‌های کاربردی زیادی را در applicationهای واقعی ممکن می‌کنند. در اینجا چند pattern رایج را می‌بینید که با router eventها استفاده می‌شوند.

### Loading indicatorها

هنگام navigation، loading indicator نمایش دهید:

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

### Analytics tracking

Page viewها را برای analytics track کنید:

```ts
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {inject, DestroyRef, Service} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

@Service()
export class AnalyticsService {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  startTracking() {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      // Track page views when URL changes
      if (event instanceof NavigationEnd) {
        // Send page view to analytics
        this.analytics.trackPageView(event.url);
      }
    });
  }

  private analytics = {
    trackPageView: (url: string) => {
      console.log('Page view tracked:', url);
    },
  };
}
```

### Error handling

Navigation errorها را graceful مدیریت کنید و به کاربر feedback بدهید:

```angular-ts
import {Component, inject, signal} from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationError,
  NavigationCancel,
  NavigationCancellationCode,
} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-error-handler',
  template: `
    @if (errorMessage()) {
      <div class="error-banner">
        {{ errorMessage() }}
        <button (click)="dismissError()">Dismiss</button>
      </div>
    }
  `,
})
export class ErrorHandler {
  private router = inject(Router);
  readonly errorMessage = signal('');

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.errorMessage.set('');
      } else if (event instanceof NavigationError) {
        console.error('Navigation error:', event.error);
        this.errorMessage.set('Failed to load page. Please try again.');
      } else if (event instanceof NavigationCancel) {
        console.warn('Navigation cancelled:', event.reason);
        if (event.code === NavigationCancellationCode.GuardRejected) {
          this.errorMessage.set('Access denied. Please check your permissions.');
        }
      }
    });
  }

  dismissError() {
    this.errorMessage.set('');
  }
}
```

## همه router eventها

برای reference، اینجا فهرست کامل همه router eventهای در دسترس در Angular آمده است. این eventها بر اساس category مرتب شده‌اند و به همان ترتیبی فهرست شده‌اند که معمولا در طول navigation رخ می‌دهند.

### Navigation eventها

این eventها فرایند اصلی navigation را از شروع تا route recognition، guard checkها و data resolution دنبال می‌کنند. آن‌ها به شما دید می‌دهند که هر phase از navigation lifecycle چطور پیش می‌رود.

| Event                                                     | Description                                      |
| --------------------------------------------------------- | ------------------------------------------------ |
| [`NavigationStart`](api/router/NavigationStart)           | وقتی navigation شروع می‌شود رخ می‌دهد            |
| [`RouteConfigLoadStart`](api/router/RouteConfigLoadStart) | قبل از lazy loading یک route configuration رخ می‌دهد |
| [`RouteConfigLoadEnd`](api/router/RouteConfigLoadEnd)     | بعد از load شدن یک lazy-loaded route configuration رخ می‌دهد |
| [`RoutesRecognized`](api/router/RoutesRecognized)         | وقتی router، URL را parse می‌کند و routeها را تشخیص می‌دهد رخ می‌دهد |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)         | در شروع phase مربوط به guard رخ می‌دهد           |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)             | در پایان phase مربوط به guard رخ می‌دهد          |
| [`ResolveStart`](api/router/ResolveStart)                 | در شروع phase مربوط به resolve رخ می‌دهد         |
| [`ResolveEnd`](api/router/ResolveEnd)                     | در پایان phase مربوط به resolve رخ می‌دهد        |

### Activation eventها

این eventها در phase مربوط به activation رخ می‌دهند؛ زمانی که route componentها در حال instantiate و initialize شدن هستند. Activation eventها برای هر route در route tree اجرا می‌شوند، از جمله routeهای والد و فرزند.

| Event                                                     | Description                              |
| --------------------------------------------------------- | ---------------------------------------- |
| [`ActivationStart`](api/router/ActivationStart)           | در شروع route activation رخ می‌دهد       |
| [`ChildActivationStart`](api/router/ChildActivationStart) | در شروع child route activation رخ می‌دهد |
| [`ActivationEnd`](api/router/ActivationEnd)               | در پایان route activation رخ می‌دهد      |
| [`ChildActivationEnd`](api/router/ChildActivationEnd)     | در پایان child route activation رخ می‌دهد |

### Eventهای تکمیل navigation

این eventها نتیجه نهایی یک تلاش برای navigation را نشان می‌دهند. هر navigation دقیقا با یکی از این eventها تمام می‌شود و مشخص می‌کند navigation موفق بوده، cancel شده، fail شده یا skip شده است.

| Event                                               | Description                                              |
| --------------------------------------------------- | -------------------------------------------------------- |
| [`NavigationEnd`](api/router/NavigationEnd)         | وقتی navigation با موفقیت تمام می‌شود رخ می‌دهد          |
| [`NavigationCancel`](api/router/NavigationCancel)   | وقتی router، navigation را cancel می‌کند رخ می‌دهد        |
| [`NavigationError`](api/router/NavigationError)     | وقتی navigation به‌خاطر error غیرمنتظره fail می‌شود رخ می‌دهد |
| [`NavigationSkipped`](api/router/NavigationSkipped) | وقتی router، navigation را skip می‌کند رخ می‌دهد، مثلا navigation به همان URL |

### Eventهای دیگر

یک event اضافه وجود دارد که بیرون از lifecycle اصلی navigation رخ می‌دهد، اما همچنان بخشی از event system مربوط به router است.

| Event                         | Description            |
| ----------------------------- | ---------------------- |
| [`Scroll`](api/router/Scroll) | هنگام scrolling رخ می‌دهد |

## قدم بعدی

درباره [route guardها](/guide/routing/route-guards) و [کارهای رایج router](/guide/routing/common-router-tasks) بیشتر یاد بگیرید.
