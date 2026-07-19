<docs-decorative-header title="Angular Signals" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
Angular Signals سیستمی است که با دقت دنبال می‌کند state شما در سراسر برنامه چگونه و کجا استفاده می‌شود و به framework اجازه می‌دهد updateهای rendering را optimize کند.
</docs-decorative-header>

TIP: قبل از ورود به این راهنمای جامع، [Essentials](essentials/signals) مربوط به Angular را ببینید.

## signal چیست؟

یک **signal** wrapperای دور یک مقدار است که وقتی آن مقدار تغییر می‌کند، consumerهای علاقه‌مند را باخبر می‌کند. Signalها می‌توانند هر مقداری را نگه دارند، از primitiveها تا data structureهای پیچیده.

مقدار یک signal را با فراخوانی getter function آن می‌خوانید. این کار به Angular اجازه می‌دهد دنبال کند signal کجا استفاده شده است.

Signalها می‌توانند _writable_ یا _read-only_ باشند.

### signalهای writable

signalهای writable یک API برای به‌روزرسانی مستقیم مقدارشان فراهم می‌کنند. با فراخوانی تابع `signal` همراه با مقدار اولیه signal، یک writable signal می‌سازید:

```ts
const count = signal(0);

// Signals are getter functions - calling them reads their value.
console.log('The count is: ' + count());
```

برای تغییر مقدار یک writable signal، می‌توانید مستقیماً `.set()` را فراخوانی کنید:

```ts
count.set(3);
```

یا از operation مربوط به `.update()` استفاده کنید تا مقدار جدید را بر اساس مقدار قبلی محاسبه کنید:

```ts
// Increment the count by 1.
count.update((value) => value + 1);
```

signalهای writable دارای type مربوط به `WritableSignal` هستند.

#### تبدیل signalهای writable به readonly

`WritableSignal` methodای به نام `asReadonly()` فراهم می‌کند که نسخه readonly همان signal را برمی‌گرداند. این زمانی مفید است که می‌خواهید مقدار یک signal را در اختیار consumerها بگذارید، بدون اینکه اجازه دهید آن را مستقیماً تغییر دهند:

```ts
@Service()
export class CounterState {
  // Private writable state
  private readonly _count = signal(0);

  readonly count = this._count.asReadonly(); // public readonly

  increment() {
    this._count.update((v) => v + 1);
  }
}

@Component({
  /* ... */
})
export class AwesomeCounter {
  state = inject(CounterState);

  count = this.state.count; // can read but not modify

  increment() {
    this.state.increment();
  }
}
```

signal readonly هر تغییری را که روی signal writable اصلی انجام شود بازتاب می‌دهد، اما نمی‌توان آن را با methodهای `set()` یا `update()` تغییر داد.

IMPORTANT: signalهای readonly هیچ mechanism داخلی‌ای ندارند که از deep-mutation مقدارشان جلوگیری کند.

### signalهای computed

**Computed signals** signalهای read-only هستند که مقدار خود را از signalهای دیگر derive می‌کنند. signalهای computed را با تابع `computed` و مشخص کردن یک derivation تعریف می‌کنید:

```typescript
const count: WritableSignal<number> = signal(0);
const doubleCount: Signal<number> = computed(() => count() * 2);
```

signal مربوط به `doubleCount` به signal مربوط به `count` وابسته است. هر وقت `count` update شود، Angular می‌داند که `doubleCount` هم باید update شود.

#### signalهای computed هم lazy evaluate می‌شوند و هم memoize می‌شوند

تابع derivation مربوط به `doubleCount` تا وقتی اولین بار `doubleCount` را نخوانید برای محاسبه مقدار اجرا نمی‌شود. مقدار محاسبه‌شده سپس cache می‌شود و اگر دوباره `doubleCount` را بخوانید، بدون محاسبه دوباره همان مقدار cache شده را برمی‌گرداند.

اگر بعداً `count` را تغییر دهید، Angular می‌داند مقدار cache شده `doubleCount` دیگر معتبر نیست و دفعه بعد که `doubleCount` را بخوانید، مقدار جدید آن محاسبه می‌شود.

در نتیجه، می‌توانید derivationهای computationally expensive، مثل filter کردن arrayها، را با خیال راحت در signalهای computed انجام دهید.

#### signalهای computed writable نیستند

نمی‌توانید مستقیماً به یک computed signal مقدار assign کنید. یعنی:

```ts
doubleCount.set(3);
```

یک compilation error تولید می‌کند، چون `doubleCount` یک `WritableSignal` نیست.

#### dependencyهای computed signal پویا هستند

فقط signalهایی که واقعاً در طول derivation خوانده می‌شوند track می‌شوند. برای مثال، در این `computed`، signal مربوط به `count` فقط وقتی خوانده می‌شود که signal مربوط به `showCount` برابر true باشد:

```ts
const showCount = signal(false);
const count = signal(0);
const conditionalCount = computed(() => {
  if (showCount()) {
    return `The count is ${count()}.`;
  } else {
    return 'Nothing to see here!';
  }
});
```

وقتی `conditionalCount` را می‌خوانید، اگر `showCount` برابر `false` باشد، message مربوط به "Nothing to see here!" بدون خواندن signal مربوط به `count` برگردانده می‌شود. یعنی اگر بعداً `count` را update کنید، باعث recomputation برای `conditionalCount` نخواهد شد.

اگر `showCount` را روی `true` بگذارید و دوباره `conditionalCount` را بخوانید، derivation دوباره اجرا می‌شود و branchای را می‌گیرد که `showCount` در آن `true` است؛ سپس messageای را برمی‌گرداند که مقدار `count` را نشان می‌دهد. تغییر دادن `count` بعد از آن، مقدار cache شده `conditionalCount` را invalidate می‌کند.

توجه کنید که dependencyها همان‌طور که می‌توانند در طول derivation اضافه شوند، می‌توانند حذف هم بشوند. اگر بعداً `showCount` را دوباره روی `false` بگذارید، دیگر `count` به عنوان dependency مربوط به `conditionalCount` در نظر گرفته نمی‌شود.

## contextهای reactive

یک **reactive context** وضعیت runtimeای است که Angular در آن خواندن signalها را monitor می‌کند تا dependency ایجاد کند. کدی که signal را می‌خواند _consumer_ است و signal خوانده‌شده _producer_ است.

Angular به صورت خودکار وارد reactive context می‌شود وقتی:

- یک callback مربوط به `effect` یا `afterRenderEffect` را اجرا می‌کند.
- یک signal از نوع `computed` را evaluate می‌کند.
- یک `linkedSignal` را evaluate می‌کند.
- params یا loader function مربوط به یک `resource` را evaluate می‌کند.
- template یک کامپوننت را render می‌کند، شامل bindingها در [host property](guide/components/host-elements#binding-to-the-host-element).

در طول این operationها، Angular یک connection _live_ ایجاد می‌کند. اگر یک signal track شده تغییر کند، Angular _در نهایت_ consumer را دوباره اجرا می‌کند.

### assert کردن reactive context

Angular helper function مربوط به `assertNotInReactiveContext` را فراهم می‌کند تا assert کنید که کد داخل reactive context اجرا نمی‌شود. یک reference به تابع فراخواننده پاس بدهید تا اگر assertion شکست خورد، پیام error به entry point درست API اشاره کند. این پیام error واضح‌تر و actionableتر از یک reactive context error عمومی است.

```ts
import {assertNotInReactiveContext} from '@angular/core';

function subscribeToEvents() {
  assertNotInReactiveContext(subscribeToEvents);
  // Safe to proceed - subscription logic here
}
```

### خواندن بدون track کردن dependencyها

به ندرت ممکن است بخواهید کدی را اجرا کنید که داخل یک تابع reactive مثل `computed` یا `effect` signalها را بخواند، اما _dependency_ ایجاد نکند.

برای مثال، فرض کنید وقتی `currentUser` تغییر می‌کند، مقدار یک `counter` باید log شود. می‌توانید effectای بسازید که هر دو signal را بخواند:

```ts
effect(() => {
  console.log(`User set to ${currentUser()} and the counter is ${counter()}`);
});
```

این مثال وقتی _هر کدام_ از `currentUser` یا `counter` تغییر کند یک message log می‌کند. اما اگر effect فقط باید وقتی `currentUser` تغییر می‌کند اجرا شود، خواندن `counter` فقط incidental است و تغییرات `counter` نباید message جدیدی log کنند.

می‌توانید با فراخوانی getter یک signal همراه با `untracked` از track شدن خواندن signal جلوگیری کنید:

```ts
effect(() => {
  console.log(`User set to ${currentUser()} and the counter is ${untracked(counter)}`);
});
```

`untracked` همچنین زمانی مفید است که یک effect باید کدی خارجی را invoke کند که نباید به عنوان dependency در نظر گرفته شود:

```ts
effect(() => {
  const user = currentUser();
  untracked(() => {
    // If the `loggingService` reads signals, they won't be counted as
    // dependencies of this effect.
    this.loggingService.log(`User set to ${user}`);
  });
});
```

### reactive context و operationهای async

reactive context فقط برای کد synchronous فعال است. هر خواندن signal که بعد از یک asynchronous boundary رخ دهد، به عنوان dependency track نمی‌شود.

```ts {avoid}
effect(async () => {
  const data = await fetchUserData();
  // Reactive context is lost here - theme() won't be tracked
  console.log(`User: ${data.name}, Theme: ${theme()}`);
});
```

برای اینکه مطمئن شوید همه خواندن‌های signal track می‌شوند، signalها را قبل از `await` بخوانید. این شامل پاس دادن آن‌ها به عنوان argument به تابع await شده هم می‌شود، چون argumentها synchronously evaluate می‌شوند:

```ts {prefer}
effect(async () => {
  const currentTheme = theme(); // Read before await
  const data = await fetchUserData();
  console.log(`User: ${data.name}, Theme: ${currentTheme}`);
});
```

```ts {prefer}
effect(async () => {
  // Also works: signal is read before await (as function argument)
  await renderContent(docContent());
});
```

## derivationهای پیشرفته

در حالی که `computed` derivationهای ساده readonly را مدیریت می‌کند، ممکن است به stateای writable نیاز پیدا کنید که به signalهای دیگر وابسته است. برای اطلاعات بیشتر، راهنمای [state وابسته با linkedSignal](/guide/signals/linked-signal) را ببینید.

همه signal APIها synchronous هستند؛ `signal`، `computed`، `input` و موارد دیگر. اما برنامه‌ها اغلب باید با داده‌ای کار کنند که به صورت asynchronous در دسترس قرار می‌گیرد. یک `Resource` راهی به شما می‌دهد تا async data را وارد کد signal-based برنامه کنید و همچنان بتوانید synchronously به داده آن دسترسی داشته باشید. برای اطلاعات بیشتر، راهنمای [reactivity async با resourceها](/guide/signals/resource) را ببینید.

## اجرای side effectها روی APIهای non-reactive

وقتی می‌خواهیم به تغییرات state واکنش نشان دهیم، derivationهای synchronous یا asynchronous توصیه می‌شوند. اما این همه use caseهای ممکن را پوشش نمی‌دهد و گاهی در موقعیتی قرار می‌گیرید که لازم است به تغییرات signal روی APIهای non-reactive واکنش نشان دهید. برای این use caseهای مشخص از `effect` یا `afterRenderEffect` استفاده کنید. برای اطلاعات بیشتر، راهنمای [side effectها برای APIهای non-reactive](/guide/signals/effect) را ببینید.

## خواندن signalها در کامپوننت‌های `OnPush`

وقتی یک signal را داخل template کامپوننت `OnPush` می‌خوانید، Angular آن signal را به عنوان dependency همان کامپوننت track می‌کند. وقتی مقدار آن signal تغییر کند، Angular به صورت خودکار کامپوننت را [mark](api/core/ChangeDetectorRef#markforcheck) می‌کند تا مطمئن شود دفعه بعد که change detection اجرا می‌شود update خواهد شد. برای اطلاعات بیشتر درباره کامپوننت‌های `OnPush`، راهنمای [نادیده گرفتن component subtreeها](best-practices/skipping-subtrees) را ببینید.

## topicهای پیشرفته

### تابع‌های equality برای Signal

هنگام ساخت یک signal، می‌توانید به صورت اختیاری یک equality function ارائه دهید که برای بررسی اینکه مقدار جدید واقعاً با مقدار قبلی متفاوت است یا نه استفاده می‌شود.

```ts
import isEqual from 'lodash/isEqual';

const data = signal(['test'], {equal: isEqual});

// Even though this is a different array instance, the deep equality
// function will consider the values to be equal, and the signal won't
// trigger any updates.
data.set(['test']);
```

equality functionها را می‌توان هم به signalهای writable و هم computed ارائه داد.

HELPFUL: به صورت پیش‌فرض، signalها از referential equality، یعنی comparison مربوط به [`Object.is()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/is)، استفاده می‌کنند.

### type checking برای signalها

می‌توانید از `isSignal` استفاده کنید تا بررسی کنید یک مقدار `Signal` هست یا نه:

```ts
const count = signal(0);
const doubled = computed(() => count() * 2);

isSignal(count); // true
isSignal(doubled); // true
isSignal(42); // false
```

برای اینکه مشخصاً بررسی کنید یک signal writable است یا نه، از `isWritableSignal` استفاده کنید:

```ts
const count = signal(0);
const doubled = computed(() => count() * 2);

isWritableSignal(count); // true
isWritableSignal(doubled); // false
```

## استفاده از signalها با RxJS

برای جزئیات interoperability بین signalها و RxJS، [RxJS interop با Angular signals](ecosystem/rxjs-interop) را ببینید.

