# تعامل RxJS با Signalهای انگولار

package به نام `@angular/core/rxjs-interop`، APIهایی برای یکپارچه‌سازی RxJS و Signalهای انگولار ارائه می‌کند.

## ایجاد Signal از Observable مربوط به RxJS با `toSignal`

با تابع `toSignal` یک Signal ایجاد کنید که مقدار Observable را دنبال می‌کند. رفتار آن شبیه pipe به نام `async` در templateها است، اما انعطاف بیشتری دارد و در هر بخش application قابل استفاده است.

```angular-ts
import {Component} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {interval} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  template: `{{ counter() }}`,
})
export class Ticker {
  counterObservable = interval(1000);

  // Get a `Signal` representing the `counterObservable`'s value.
  counter = toSignal(this.counterObservable, {initialValue: 0});
}
```

مانند pipe به نام `async`، تابع `toSignal` بلافاصله در Observable، subscribe می‌کند و این کار ممکن است side effect ایجاد کند. subscription ایجادشده توسط `toSignal` با نابود شدن component یا service فراخوانی‌کننده `toSignal`، به‌طور خودکار از Observable داده‌شده unsubscribe می‌کند.

IMPORTANT: تابع `toSignal` یک subscription ایجاد می‌کند. از فراخوانی مکرر آن برای یک Observable یکسان خودداری و در عوض از Signal برگشتی آن دوباره استفاده کنید.

### context مربوط به Injection

تابع `toSignal` به‌طور پیش‌فرض باید در یک [injection context](guide/di/dependency-injection-context)، مانند زمان ساخت component یا service اجرا شود. اگر injection context در دسترس نیست، می‌توانید `Injector` مورد استفاده را دستی مشخص کنید.

### مقادیر اولیه

ممکن است Observableها هنگام subscription به‌صورت synchronous مقداری تولید نکنند، اما Signalها همیشه به مقدار فعلی نیاز دارند. برای مدیریت مقدار «اولیه» Signalهای `toSignal` چند روش وجود دارد.

#### گزینه `initialValue`

مانند نمونه بالا، می‌توانید گزینه `initialValue` را با مقداری تعیین کنید که Signal باید پیش از نخستین emit شدن Observable برگرداند.

#### مقادیر اولیه `undefined`

اگر `initialValue` ارائه نکنید، Signal حاصل تا زمان emit شدن Observable مقدار `undefined` برمی‌گرداند. این رفتار شبیه pipe به نام `async` است که `null` برمی‌گرداند.

#### گزینه `requireSync`

برخی Observableها مانند `BehaviorSubject` تضمین می‌کنند مقدار را به‌صورت synchronous منتشر کنند. در این موارد می‌توانید گزینه `requireSync: true` را مشخص کنید.

وقتی `requireSync` برابر `true` باشد، `toSignal` الزام می‌کند Observable هنگام subscription به‌صورت synchronous مقداری منتشر کند. بنابراین Signal همیشه مقدار دارد و به نوع `undefined` یا مقدار اولیه نیازی نیست.

### `manualCleanup`

تابع `toSignal` به‌طور پیش‌فرض با نابود شدن component یا service سازنده، به‌صورت خودکار از Observable unsubscribe می‌کند.

برای بازنویسی این رفتار می‌توانید گزینه `manualCleanup` را ارسال کنید. این تنظیم برای Observableهایی مناسب است که به‌طور طبیعی کامل می‌شوند.

#### مقایسه برابری سفارشی

برخی Observableها ممکن است مقادیری منتشر کنند که با وجود تفاوت در reference یا جزئیات کوچک، **برابر** هستند. گزینه `equal` امکان تعریف یک **تابع برابری سفارشی** را فراهم می‌کند تا تعیین کنید چه زمانی دو مقدار پیاپی یکسان در نظر گرفته شوند.

وقتی دو مقدار منتشرشده برابر در نظر گرفته شوند، Signal حاصل **به‌روزرسانی نمی‌شود**. این کار از محاسبات تکراری، به‌روزرسانی DOM یا اجرای دوباره و غیرضروری effectها جلوگیری می‌کند.

```ts
import {Component} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {interval, map} from 'rxjs';

@Component(/* ... */)
export class EqualExample {
  temperature$ = interval(1000).pipe(
    map(() => ({temperature: Math.floor(Math.random() * 3) + 20})), // 20, 21, or 22 randomly
  );

  // Only update if the temperature changes
  temperature = toSignal(this.temperature$, {
    initialValue: {temperature: 20},
    equal: (prev, curr) => prev.temperature === curr.temperature,
  });
}
```

### خطا و تکمیل

اگر Observable مورد استفاده در `toSignal` خطایی ایجاد کند، هنگام خواندن Signal آن خطا throw می‌شود.

اگر Observable مورد استفاده در `toSignal` کامل شود، Signal همچنان آخرین مقدار منتشرشده پیش از تکمیل را برمی‌گرداند.

## ایجاد Observable مربوط به RxJS از Signal با `toObservable`

با ابزار `toObservable` یک `Observable` ایجاد کنید که مقدار Signal را دنبال می‌کند. مقدار Signal با یک `effect` پایش می‌شود و هنگام تغییر، مقدار را در Observable منتشر می‌کند.

```ts
import {Component, signal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';

@Component(/* ... */)
export class SearchResults {
  query: Signal<string> = inject(QueryService).query;
  query$ = toObservable(this.query);

  results$ = this.query$.pipe(switchMap((query) => this.http.get('/search?q=' + query)));
}
```

با تغییر Signal به نام `query`، Observable به نام `query$` جدیدترین query را منتشر و یک request جدید HTTP ایجاد می‌کند.

### context مربوط به Injection

تابع `toObservable` به‌طور پیش‌فرض باید در یک [injection context](guide/di/dependency-injection-context)، مانند زمان ساخت component یا service اجرا شود. اگر injection context در دسترس نیست، می‌توانید `Injector` مورد استفاده را دستی مشخص کنید.

### زمان‌بندی `toObservable`

تابع `toObservable` برای دنبال کردن مقدار Signal در یک `ReplaySubject` از effect استفاده می‌کند. هنگام subscription ممکن است نخستین مقدار \(در صورت وجود\) به‌صورت synchronous منتشر شود، اما همه مقادیر بعدی asynchronous خواهند بود.

برخلاف Observableها، Signalها هیچ‌گاه تغییرات را به‌صورت synchronous اطلاع نمی‌دهند. حتی اگر مقدار Signal را چند بار تغییر دهید، `toObservable` فقط پس از پایدار شدن Signal مقدار را منتشر می‌کند.

```ts
const obs$ = toObservable(mySignal);
obs$.subscribe((value) => console.log(value));

mySignal.set(1);
mySignal.set(2);
mySignal.set(3);
```

در اینجا فقط آخرین مقدار \(3\) log می‌شود.

## استفاده از `rxResource` برای داده asynchronous

[`resource function`](/guide/signals/resource) انگولار راهی برای ترکیب داده asynchronous با کد مبتنی بر Signal در application فراهم می‌کند. `rxResource` بر پایه این الگو به شما اجازه می‌دهد resourceای تعریف کنید که منبع داده آن با یک `Observable` مربوط به RxJS تعریف می‌شود. `rxResource` به‌جای تابع `loader`، تابع `stream` را می‌پذیرد که یک `Observable` مربوط به RxJS دریافت می‌کند.

```typescript
import {Component, inject} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';

@Component(/* ... */)
export class UserProfile {
  // This component relies on a service that exposes data through an RxJS Observable.
  private userData = inject(MyUserDataClient);

  protected userId = input<string>();

  private userResource = rxResource({
    params: () => ({userId: this.userId()}),

    // The `stream` property expects a factory function that returns
    // a data stream as an RxJS Observable.
    stream: ({params}) => this.userData.load(params.userId),
  });
}
```

property به نام `stream` یک تابع factory برای `Observable` مربوط به RxJS می‌پذیرد. مقدار `params` مربوط به resource به این تابع factory ارسال می‌شود و تابع یک `Observable` برمی‌گرداند. هر بار محاسبه `params` مقدار جدیدی تولید کند، resource این تابع factory را فراخوانی می‌کند. برای جزئیات بیشتر درباره پارامترهای ارسال‌شده به تابع factory، [loaderهای Resource](/guide/signals/resource#resource-loaders) را ببینید.

در سایر جنبه‌ها، `rxResource` مانند `resource` رفتار می‌کند و همان APIها را برای تعیین پارامترها، خواندن مقادیر، بررسی state بارگذاری و مشاهده خطاها فراهم می‌کند.
