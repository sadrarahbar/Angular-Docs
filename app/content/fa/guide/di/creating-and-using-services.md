# ساخت و استفاده از serviceها

Serviceها تکه‌های reusable از code هستند که می‌توانید در سراسر Angular application خود share کنید. معمولا از آن‌ها برای data fetching، business logic یا functionalityهای دیگری استفاده می‌کنید که چند component باید به آن‌ها دسترسی داشته باشند.

## ساخت یک service

می‌توانید با [Angular CLI](tools/cli) و command زیر یک service بسازید:

```bash
ng generate service CUSTOM_NAME
```

این command یک فایل اختصاصی به نام `CUSTOM_NAME.ts` در directory مربوط به `src` شما می‌سازد.

همچنین می‌توانید با اضافه کردن decorator مربوط به `@Service()` به یک TypeScript class، service را دستی بسازید. این به Angular می‌گوید که می‌توانید از class به‌عنوان injectable dependency استفاده کنید.

مثال زیر serviceای تعریف می‌کند که به کاربران اجازه می‌دهد data اضافه و retrieve کنند:

```ts {header: "src/app/basic-data-store.ts"}
import {Service} from '@angular/core';

@Service()
export class BasicDataStore {
  private data: string[] = [];

  addData(item: string): void {
    this.data.push(item);
  }

  getData(): string[] {
    return [...this.data];
  }
}
```

## Serviceها چگونه در دسترس قرار می‌گیرند

Serviceها به‌صورت پیش‌فرض در root level provision می‌شوند. وقتی یک service به‌صورت global provide شود، Angular سه مزیت اصلی را تضمین می‌کند:

- **Singleton Instance:** یک instance واحد و shared برای کل application می‌سازد.
- **Global Availability:** بدون registration دستی provider، همه‌جا به‌صورت خودکار قابل دسترسی است.
- **Tree-shakability:** اگر کد شما هرگز صراحتا از service استفاده نکند، مطمئن می‌شود service از production bundle نهایی حذف شود.

### استفاده از decorator مربوط به `@Service` در برابر `@Injectable`

Decorator مربوط به `@Service` یک shorthand مدرن و ergonomic برای syntax سنتی `@Injectable({ providedIn: 'root' })` است.

از این reference سریع استفاده کنید تا تصمیم بگیرید کدام decorator مناسب scenario شماست:

| Feature / Requirement                         | `@Service` | `@Injectable`                           |
| --------------------------------------------- | ---------- | --------------------------------------- |
| **پشتیبانی از تابع `inject()`**               | Yes        | Yes                                     |
| **DI مبتنی بر constructor**                   | ❌ No      | Yes                                     |
| **Root singleton provider ضمنی**              | Yes        | ❌ No (requires `{providedIn: 'root'}`) |
| **Provider keyهای پیشرفته (`useClass` و غیره)** | ❌ No      | Yes                                     |
| **Custom initialization factoryها**           | Yes        | Yes                                     |
| **Scopeهای غیر root (`platform` و غیره)**     | ❌ No      | Yes                                     |

### جایگزین کردن implementation با factory

اگر لازم است کنترل کنید singleton چگونه ساخته شود، مثلا برای اینکه بسته به environment، implementation متفاوتی جایگزین شود، یک تابع `factory` پاس دهید.

Factory در یک [injection context](guide/di/dependency-injection-context) اجرا می‌شود، بنابراین می‌توانید داخل آن از [`inject()`](api/core/inject) برای خواندن dependencyهای دیگر استفاده کنید.

Service زیر به نام `Analytics` در local یک no-op است تا eventها در زمان development console را شلوغ نکنند. در production، factory یک token به نام `ANALYTICS_ENABLED` را می‌خواند و یک subclass به نام `GoogleAnalytics` برمی‌گرداند که eventها را به tracker واقعی forward می‌کند:

```ts {header: "src/app/analytics.ts"}
import {inject, InjectionToken, Service} from '@angular/core';
import {ANALYTICS_ENABLED} from './token';

@Service({
  factory: () => (inject(ANALYTICS_ENABLED) ? new GoogleAnalytics() : new Analytics()),
})
export class Analytics {
  track(event: string, payload?: Record<string, unknown>) {
    // No-op by default.
  }
}

class GoogleAnalytics extends Analytics {
  override track(event: string, payload?: Record<string, unknown>) {
    // Dispatches an analytics event to Google Analytics
  }
}
```

NOTE: Option مربوط به `factory` جایگزین optionهای `useClass`، `useValue`، `useExisting` و `useFactory` در `@Injectable` می‌شود. اگر به هرکدام از آن‌ها نیاز دارید، همچنان از `@Injectable` استفاده کنید.

### خارج شدن از automatic provisioning

به‌صورت پیش‌فرض، `@Service` کلاس را در root injector provide می‌کند. اگر می‌خواهید آن را دستی provide کنید، مثلا برای scope کردن آن به یک route یا component خاص، `autoProvided: false` را set کنید:

```ts {header: "src/app/analytics-logger.ts"}
import {Service} from '@angular/core';

@Service({autoProvided: false})
export class AnalyticsLogger {
  trackEvent(name: string) {
    console.log('event:', name);
  }
}
```

بعد از آن، شما مسئول اضافه کردن service به array مربوط به `providers` هستید، درست مثل یک `@Injectable()` ساده:

### چه زمانی از `@Service` و چه زمانی از `@Injectable` استفاده کنیم

وقتی در حال ساخت یک singleton class جدید هستید که برای dependencyهای خود از `inject()` استفاده می‌کند، سراغ `@Service` بروید. وقتی به هرکدام از موارد زیر نیاز دارید، همچنان از `@Injectable` استفاده کنید:

- **Dependency injection مبتنی بر constructor.** `@Service` فقط از تابع [`inject()`](api/core/inject) پشتیبانی می‌کند.
- **Provider configuration پیشرفته** مثل `useClass`، `useValue`، `useExisting` یا `useFactory`. `@Service` در عوض یک option واحد به نام `factory` expose می‌کند.
- **Scopeهای غیر root** مثل `providedIn: 'platform'`.

## Inject کردن یک service

بعد از اینکه یک service با `providedIn: 'root'` ساختید، می‌توانید آن را با تابع `inject()` از `@angular/core` در هر جای application خود inject کنید.

### Inject کردن داخل component

```angular-ts
import {Component, inject} from '@angular/core';
import {BasicDataStore} from './basic-data-store';

@Component({
  selector: 'app-example',
  template: `
    <div>
      <p>{{ dataStore.getData() }}</p>
      <button (click)="dataStore.addData('More data')">Add more data</button>
    </div>
  `,
})
export class Example {
  dataStore = inject(BasicDataStore);
}
```

### Inject کردن داخل service دیگر

```ts
import {inject, Service} from '@angular/core';
import {AdvancedDataStore} from './advanced-data-store';

@Service()
export class BasicDataStore {
  private advancedDataStore = inject(AdvancedDataStore);
  private data: string[] = [];

  addData(item: string): void {
    this.data.push(item);
  }

  getData(): string[] {
    return [...this.data, ...this.advancedDataStore.getData()];
  }
}
```

## قدم‌های بعدی

با اینکه `providedIn: 'root'` بیشتر use caseها را پوشش می‌دهد، Angular راه‌های دیگری هم برای configure کردن serviceها در scenarioهای تخصصی‌تر فراهم می‌کند:

- **Instanceهای مخصوص component** - وقتی componentها به instanceهای service isolated خود نیاز دارند
- **Manual configuration** - برای serviceهایی که به runtime configuration نیاز دارند
- **Factory providerها** - برای ساخت dynamic service بر اساس runtime conditionها
- **Value providerها** - برای provide کردن configuration objectها یا constantها

می‌توانید درباره این patternهای پیشرفته در راهنمای بعدی بیشتر یاد بگیرید: [defining dependency providers](/guide/di/defining-dependency-providers).
