# ساختن و استفاده از سرویس‌ها

سرویس‌ها بخش‌هایی قابل استفاده‌مجدد از کد هستند که می‌توانید آن‌ها را در سراسر برنامه Angular خود به اشتراک بگذارید. معمولا از سرویس‌ها برای دریافت داده، نگه‌داشتن منطق تجاری برنامه، یا هر قابلیت دیگری استفاده می‌شود که چند کامپوننت به آن نیاز دارند.

## ساختن یک سرویس

می‌توانید با استفاده از [Angular CLI](tools/cli) و دستور زیر یک سرویس بسازید:

```bash
ng generate service CUSTOM_NAME
```

این دستور یک فایل اختصاصی با نام `CUSTOM_NAME.ts` در پوشه `src` شما ایجاد می‌کند.

همچنین می‌توانید سرویس را به‌صورت دستی بسازید؛ کافی است دکوراتور `@Service()` را به یک کلاس TypeScript اضافه کنید. با این کار به Angular می‌گویید که این کلاس می‌تواند به‌عنوان یک وابستگی قابل تزریق استفاده شود.

نمونه زیر سرویسی را تعریف می‌کند که به کاربران اجازه می‌دهد داده‌ای را اضافه کنند و دوباره آن را بخوانند:

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

## سرویس‌ها چطور در دسترس قرار می‌گیرند

سرویس‌ها به‌طور پیش‌فرض در سطح ریشه برنامه فراهم می‌شوند. وقتی یک سرویس به‌صورت سراسری فراهم شود، Angular سه مزیت اصلی را تضمین می‌کند:

- **یک نمونه Singleton:** برای کل برنامه فقط یک نمونه مشترک می‌سازد.
- **دسترسی سراسری:** سرویس بدون ثبت دستی provider، در هر جای برنامه قابل دسترسی است.
- **قابلیت Tree-shaking:** اگر کد شما هیچ‌وقت به‌صورت صریح از سرویس استفاده نکند، آن سرویس از باندل نهایی تولید حذف می‌شود.

### استفاده از دکوراتور `@Service` در برابر `@Injectable`

دکوراتور `@Service` یک شکل کوتاه‌تر، جدیدتر و خوش‌دست‌تر از سینتکس سنتی `@Injectable({ providedIn: 'root' })` است.

از جدول سریع زیر کمک بگیرید تا ببینید در سناریوی شما کدام دکوراتور مناسب‌تر است:

| قابلیت / نیاز                                  | `@Service` | `@Injectable`                            |
| ---------------------------------------------- | ---------- | ---------------------------------------- |
| **پشتیبانی از تابع `inject()`**                | بله        | بله                                      |
| **تزریق وابستگی از طریق constructor**          | ❌ خیر     | بله                                      |
| **provider پیش‌فرض Singleton در ریشه برنامه**  | بله        | ❌ خیر (به `{providedIn: 'root'}` نیاز دارد) |
| **کلیدهای پیشرفته provider مثل `useClass` و ...** | ❌ خیر     | بله                                      |
| **factoryهای سفارشی برای مقداردهی اولیه**      | بله        | بله                                      |
| **scopeهای غیرریشه مثل `platform` و ...**      | ❌ خیر     | بله                                      |

### جایگزین کردن پیاده‌سازی با یک factory

اگر لازم دارید نحوه ساخته‌شدن Singleton را کنترل کنید، مثلا برای اینکه بسته به محیط، پیاده‌سازی متفاوتی را جایگزین کنید، یک تابع `factory` پاس بدهید.

این factory در یک [injection context](guide/di/dependency-injection-context) اجرا می‌شود؛ بنابراین می‌توانید داخل آن از [`inject()`](api/core/inject) برای خواندن وابستگی‌های دیگر استفاده کنید.

سرویس `Analytics` در نمونه زیر، هنگام توسعه محلی کاری انجام نمی‌دهد تا رویدادها باعث شلوغ شدن console نشوند. در محیط production، factory مقدار token با نام `ANALYTICS_ENABLED` را می‌خواند و یک subclass به نام `GoogleAnalytics` برمی‌گرداند که رویدادها را به tracker واقعی ارسال می‌کند:

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

NOTE: گزینه `factory` جایگزین گزینه‌های `useClass`، `useValue`، `useExisting` و `useFactory` در `@Injectable` می‌شود. اگر به هرکدام از آن‌ها نیاز دارید، همچنان از `@Injectable` استفاده کنید.

### غیرفعال کردن فراهم‌سازی خودکار

به‌طور پیش‌فرض، `@Service` کلاس را در root injector فراهم می‌کند. اگر می‌خواهید سرویس را دستی فراهم کنید، مثلا آن را به یک route یا کامپوننت خاص محدود کنید، مقدار `autoProvided: false` را تنظیم کنید:

```ts {header: "src/app/analytics-logger.ts"}
import {Service} from '@angular/core';

@Service({autoProvided: false})
export class AnalyticsLogger {
  trackEvent(name: string) {
    console.log('event:', name);
  }
}
```

بعد از آن، درست مثل یک `@Injectable()` معمولی، خودتان مسئول هستید که سرویس را به آرایه `providers` اضافه کنید:

### چه زمانی از `@Service` و چه زمانی از `@Injectable` استفاده کنیم

وقتی یک کلاس Singleton جدید می‌سازید که برای وابستگی‌هایش از `inject()` استفاده می‌کند، سراغ `@Service` بروید. در موارد زیر بهتر است همچنان از `@Injectable` استفاده کنید:

- **تزریق وابستگی از طریق constructor.** `@Service` فقط از تابع [`inject()`](api/core/inject) پشتیبانی می‌کند.
- **تنظیمات پیشرفته provider** مثل `useClass`، `useValue`، `useExisting` یا `useFactory`. در `@Service` فقط یک گزینه `factory` در اختیار دارید.
- **scopeهای غیرریشه** مثل `providedIn: 'platform'`.

## تزریق یک سرویس

بعد از اینکه سرویسی را با `providedIn: 'root'` ساختید، می‌توانید با تابع `inject()` از `@angular/core` آن را در هر جای برنامه تزریق کنید.

### تزریق داخل یک کامپوننت

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

### تزریق داخل یک سرویس دیگر

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

اگرچه `providedIn: 'root'` بیشتر نیازها را پوشش می‌دهد، Angular راه‌های دیگری هم برای پیکربندی سرویس‌ها در سناریوهای تخصصی‌تر در اختیار شما می‌گذارد:

- **نمونه‌های مخصوص هر کامپوننت** - وقتی کامپوننت‌ها به نمونه‌های جدا و ایزوله از سرویس نیاز دارند
- **پیکربندی دستی** - برای سرویس‌هایی که به تنظیمات زمان اجرا نیاز دارند
- **Factory providerها** - برای ساخت پویای سرویس بر اساس شرایط زمان اجرا
- **Value providerها** - برای فراهم کردن objectهای تنظیمات یا ثابت‌ها

می‌توانید درباره این الگوهای پیشرفته در راهنمای بعدی بیشتر بخوانید: [تعریف dependency providerها](/guide/di/defining-dependency-providers).
