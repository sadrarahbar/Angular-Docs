<docs-decorative-header title="Dependency injection in Angular" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->

Dependency Injection یا DI یک design pattern است که با supply کردن dependencyها به یک class، به‌جای ساختن آن‌ها داخل همان class، برای organize و share کردن code در سراسر application استفاده می‌شود.
</docs-decorative-header>

TIP: پیش از ورود به این راهنمای جامع، [Essentials](essentials/dependency-injection) مربوط به Angular را ببینید.

با بزرگ شدن یک application، توسعه‌دهندگان اغلب نیاز دارند functionality را در بخش‌های مختلف codebase reuse و share کنند. [Dependency Injection (DI)](https://en.wikipedia.org/wiki/Dependency_injection) با این کار کمک می‌کند: اجازه می‌دهد dependencyها را به یک class provide کنید، به‌جای اینکه آن‌ها را مستقیم داخل همان class بسازید. این باعث می‌شود بخش‌های مختلف application reusableتر و مدیریتشان ساده‌تر باشد.

Dependency injection یک pattern محبوب است، چون به توسعه‌دهندگان اجازه می‌دهد challengeهای رایجی را address کنند:

- **بهبود maintainability کد**: Dependency injection separation of concerns واضحی ایجاد می‌کند، refactor کردن کد را ساده‌تر می‌کند و duplication را کاهش می‌دهد.
- **Scalability**: می‌توانید functionalityهای modular را در بخش‌های مختلف application reuse کنید و scale کردن را ساده‌تر کنید.
- **Testing بهتر**: DI به unit testها اجازه می‌دهد در صورت نیاز به‌جای implementationهای واقعی از [test double](https://en.wikipedia.org/wiki/Test_double) استفاده کنند.

## Dependency injection در Angular چگونه کار می‌کند؟

Dependency هر object، value، function یا serviceای است که یک class برای کار کردن به آن نیاز دارد، اما خودش آن را نمی‌سازد. در عوض، آن را از بیرون provide می‌کنید و رابطه‌ای واضح میان بخش‌های مختلف application ایجاد می‌کنید.

با dependency injection system به دو روش اصلی تعامل می‌کنید:

- می‌توانید valueها را _provide_ یا در دسترس قرار دهید.
- می‌توانید آن valueها را به‌عنوان dependency _inject_ یا request کنید.

در این context، "value" می‌تواند به هر value در JavaScript اشاره کند، از جمله objectها، functionها یا class instanceها. نوع‌های رایج dependencyهای inject شده عبارت‌اند از:

- **Configuration valueها**: constantهای مخصوص environment، API URLها، feature flagها و غیره.
- **Factoryها**: functionهایی که بر اساس runtime conditionها object یا value می‌سازند
- **Serviceها**: classهایی که functionality مشترک، business logic یا state فراهم می‌کنند

Componentها و directiveهای Angular به‌صورت خودکار در DI شرکت می‌کنند؛ یعنی می‌توانید dependencyها را داخل آن‌ها inject کنید و آن‌ها را برای injection در دسترس قرار دهید.

## Serviceها چه هستند؟

یک _service_ در Angular یک TypeScript class است که با `@Service` decorate شده و اجازه می‌دهد یک instance از آن class را به‌عنوان dependency inject کنید. Serviceها رایج‌ترین روش share کردن data و functionality در سراسر application هستند.

نوع‌های رایج service شامل این‌ها هستند:

- **Data clientها:** جزئیات request زدن به server برای retrieve و mutate کردن data را abstract می‌کنند
- **State management:** state مشترک میان چند component یا page را تعریف می‌کند
- **Authentication و authorization:** authentication کاربر، token storage و access control را مدیریت می‌کند
- **Logging و error handling:** یک API مشترک برای logging یا ارتباط دادن error stateها به کاربر ایجاد می‌کند
- **Event handling و dispatch:** eventها یا notificationهایی را handle می‌کند که به component مشخصی وابسته نیستند، یا برای dispatch کردن event و notification به componentها، طبق [observer pattern](https://en.wikipedia.org/wiki/Observer_pattern)
- **Utility functionها:** utility functionهای reusable مثل data formatting، validation یا calculation ارائه می‌دهد

مثال زیر یک service به نام `AnalyticsLogger` declare می‌کند:

```ts
import {Service} from '@angular/core';

@Service()
export class AnalyticsLogger {
  trackEvent(category: string, value: string) {
    console.log('Analytics event logged:', {
      category,
      value,
      timestamp: new Date().toISOString(),
    });
  }
}
```

NOTE: `@Service` این service را در سراسر application شما به‌عنوان singleton در دسترس قرار می‌دهد. این approach برای بیشتر serviceها پیشنهاد می‌شود.

HELPFUL: decorator مربوط به [`@Service`](guide/di/creating-and-using-services#using-the-service-vs-injectable-decorator) یک shorthand ergonomic برای `@Injectable({providedIn: 'root'})` است.

## Inject کردن dependencyها با `inject()`

می‌توانید dependencyها را با تابع `inject()` در Angular inject کنید.

این مثالی از یک navigation bar است که `AnalyticsLogger` و service مربوط به `Router` در Angular را inject می‌کند تا کاربران بتوانند هنگام track شدن event به page دیگری navigate کنند.

```angular-ts
import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {AnalyticsLogger} from './analytics-logger';

@Component({
  selector: 'app-navbar',
  template: `<a href="#" (click)="navigateToDetail($event)">Detail Page</a>`,
})
export class Navbar {
  private router = inject(Router);
  private analytics = inject(AnalyticsLogger);

  navigateToDetail(event: Event) {
    event.preventDefault();
    this.analytics.trackEvent('navigation', '/details');
    this.router.navigate(['/details']);
  }
}
```

### `inject()` کجا قابل استفاده است؟

می‌توانید dependencyها را هنگام construction یک component، directive یا service inject کنید. فراخوانی [`inject`](/api/core/inject) می‌تواند یا در `constructor` یا در field initializer ظاهر شود. چند مثال رایج:

```ts
@Component(/* ... */)
export class MyComponent {
  // ✅ In class field initializer
  private service = inject(MyService);

  // ✅ In constructor body
  private anotherService: MyService;

  constructor() {
    this.anotherService = inject(MyService);
  }
}
```

```ts
@Directive({...})
export class MyDirective {
  // ✅ In class field initializer
  private element = inject(ElementRef);
}
```

```ts
import {Service, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Service()
export class MyService {
  // ✅ In a service
  private http = inject(HttpClient);
}
```

```ts
export const authGuard = () => {
  // ✅ In a route guard
  const auth = inject(AuthService);
  return auth.isAuthenticated();
};
```

Angular از اصطلاح "injection context" برای توصیف هر جایی در کد استفاده می‌کند که بتوانید [`inject`](/api/core/inject) را فراخوانی کنید. با اینکه construction مربوط به component، directive و service رایج‌ترین حالت است، برای جزئیات بیشتر [injection contexts](/guide/di/dependency-injection-context) را ببینید.

برای اطلاعات بیشتر، [inject API docs](api/core/inject#usage-notes) را ببینید.

## قدم‌های بعدی

حالا که fundamentals مربوط به dependency injection در Angular را می‌دانید، آماده‌اید یاد بگیرید چگونه serviceهای خودتان را بسازید.

راهنمای بعدی، [Creating and using services](guide/di/creating-and-using-services)، به شما نشان می‌دهد:

- چگونه با Angular CLI یا به‌صورت دستی یک service بسازید
- pattern مربوط به `providedIn: 'root'` چگونه کار می‌کند
- چگونه serviceها را داخل componentها و serviceهای دیگر inject کنید

این رایج‌ترین use case مربوط به serviceها در Angular applicationها را پوشش می‌دهد.
