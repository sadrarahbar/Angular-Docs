# Injection context

Dependency injection یا DI system به یک runtime context تکیه دارد که injector فعلی در آن در دسترس است.

یعنی injectorها فقط وقتی کار می‌کنند که کد را داخل این context اجرا کنید.

در موقعیت‌های زیر injection context در دسترس دارید:

- هنگام construction، از طریق `constructor`، برای classای که توسط DI system instantiate شده است، مثل `@Injectable` یا `@Component`.
- در field initializerهای چنین classهایی.
- در factory function مشخص‌شده برای `useFactory` مربوط به یک `Provider` یا یک `@Injectable`.
- در function مربوط به `factory` که برای یک `InjectionToken` مشخص شده است.
- داخل stack frameای که در injection context اجرا می‌شود.

دانستن اینکه چه زمانی داخل injection context هستید اجازه می‌دهد از تابع [`inject`](api/core/inject) برای retrieve کردن dependencyها استفاده کنید.

NOTE: برای مثال‌های پایه استفاده از `inject()` در constructorها و field initializerهای کلاس، [overview guide](/guide/di#where-can-inject-be-used) را ببینید.

## Stack frame در context

برخی APIها طوری طراحی شده‌اند که داخل injection context اجرا شوند. مثلا router guardها چنین هستند. این به شما اجازه می‌دهد از [`inject`](api/core/inject) داخل guard function برای دسترسی به serviceها استفاده کنید.

مثالی برای `CanActivateFn`:

```ts {highlight: [3]}
const canActivateTeam: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(PermissionsService).canActivate(inject(UserToken), route.params.id);
};
```

## اجرا داخل injection context

اگر لازم است یک function را داخل injection context اجرا کنید اما از قبل داخل یکی نیستید، می‌توانید از `runInInjectionContext` استفاده کنید.
این به دسترسی به یک injector مثل `EnvironmentInjector` نیاز دارد:

```ts {highlight: [9], header:"hero.service.ts"}
@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private environmentInjector = inject(EnvironmentInjector);

  someMethod() {
    runInInjectionContext(this.environmentInjector, () => {
      inject(SomeService); // Do what you need with the injected service
    });
  }
}
```

توجه کنید [`inject`](/api/core/inject) فقط زمانی یک instance برمی‌گرداند که injector بتواند token درخواست‌شده را resolve کند.

## Assert کردن context

Angular helper function مربوط به `assertInInjectionContext` را فراهم می‌کند تا verify کنید context فعلی یک injection context است و اگر نبود، error واضحی throw کند. یک reference به calling function پاس دهید تا error message به API entry point درست اشاره کند. این پیام واضح‌تر و قابل‌اقدام‌تری نسبت به generic injection error پیش‌فرض تولید می‌کند.

```ts
import {ElementRef, assertInInjectionContext, inject} from '@angular/core';

export function injectNativeElement<T extends Element>(): T {
  assertInInjectionContext(injectNativeElement);
  return inject(ElementRef).nativeElement;
}
```

سپس می‌توانید این helper را **از یک injection context** فراخوانی کنید، مثل constructor، field initializer، provider factory یا کدی که از طریق `runInInjectionContext` اجرا شده است:

```ts
import {Component, inject} from '@angular/core';
import {injectNativeElement} from './dom-helpers';

@Component({
  /* … */
})
export class PreviewCard {
  readonly hostEl = injectNativeElement<HTMLElement>(); // Field initializer runs in an injection context.

  onAction() {
    const anotherRef = injectNativeElement<HTMLElement>(); // Fails: runs outside an injection context.
  }
}
```

## استفاده از DI بیرون از context

اگر [`inject`](api/core/inject) یا `assertInInjectionContext` را بیرون از injection context فراخوانی کنید، Angular خطای [NG0203](/errors/NG0203) را throw می‌کند.
