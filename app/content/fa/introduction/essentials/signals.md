<docs-decorative-header title="Signalها" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
داده‌های پویا را بسازید و مدیریت کنید.
</docs-decorative-header>

در Angular، برای ساخت و مدیریت state از _signalها_ استفاده می‌کنید. یک signal wrapper سبک‌وزنی دور یک مقدار است.

از تابع `signal` برای ساخت signalای استفاده کنید که state محلی را نگه می‌دارد:

```typescript
import {signal} from '@angular/core';

// Create a signal with the `signal` function.
const firstName = signal('Morgan');

// Read a signal value by calling it— signals are functions.
console.log(firstName());

// Change the value of this signal by calling its `set` method with a new value.
firstName.set('Jaime');

// You can also use the `update` method to change the value
// based on the previous value.
firstName.update((name) => name.toUpperCase());
```

Angular ردگیری می‌کند signalها کجا خوانده می‌شوند و چه زمانی به‌روزرسانی می‌شوند. framework از این اطلاعات برای انجام کارهای اضافه استفاده می‌کند؛ مثلاً DOM را با state جدید به‌روز می‌کند. این توانایی برای واکنش نشان دادن به تغییر مقدار signalها در طول زمان، _reactivity_ نام دارد.

## عبارت‌های computed

یک `computed`، signalای است که مقدار خود را بر اساس signalهای دیگر تولید می‌کند.

```typescript
import {signal, computed} from '@angular/core';

const firstName = signal('Morgan');
const firstNameCapitalized = computed(() => firstName().toUpperCase());

console.log(firstNameCapitalized()); // MORGAN
```

یک signal از نوع `computed` فقط خواندنی است؛ methodهای `set` یا `update` ندارد. در عوض، مقدار signal مربوط به `computed` هر وقت یکی از signalهایی که می‌خواند تغییر کند، به صورت خودکار تغییر می‌کند:

```typescript
import {signal, computed} from '@angular/core';

const firstName = signal('Morgan');
const firstNameCapitalized = computed(() => firstName().toUpperCase());
console.log(firstNameCapitalized()); // MORGAN

firstName.set('Jaime');
console.log(firstNameCapitalized()); // JAIME
```

## استفاده از signalها در کامپوننت‌ها

برای ساخت و مدیریت state داخل کامپوننت‌ها، از `signal` و `computed` استفاده کنید:

```ts
@Component({
  /* ... */
})
export class UserProfile {
  isTrial = signal(false);
  isTrialExpired = signal(false);
  showTrialDuration = computed(() => this.isTrial() && !this.isTrialExpired());

  activateTrial() {
    this.isTrial.set(true);
  }
}
```

TIP: می‌خواهید درباره Angular Signals بیشتر بدانید؟ برای جزئیات کامل، [راهنمای عمیق Signalها](guide/signals) را ببینید.

## قدم بعدی

حالا که یاد گرفتید چطور داده‌های پویا را declare و مدیریت کنید، وقت آن است یاد بگیرید چطور از آن داده‌ها داخل templateها استفاده کنید.

<docs-pill-row>
  <docs-pill title="رابط‌های پویا با templateها" href="essentials/templates" />
  <docs-pill title="راهنمای عمیق Signalها" href="guide/signals" />
</docs-pill-row>

