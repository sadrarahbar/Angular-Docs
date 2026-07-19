# reactivity async با resourceها

همه signal APIها synchronous هستند؛ `signal`، `computed`، `input` و موارد دیگر. با این حال، برنامه‌ها اغلب باید با داده‌ای کار کنند که به صورت asynchronous در دسترس قرار می‌گیرد. یک `Resource` راهی به شما می‌دهد تا async data را در کد signal-based برنامه خود وارد کنید و همچنان اجازه می‌دهد به داده آن synchronously دسترسی داشته باشید.

می‌توانید از `Resource` برای انجام هر نوع operation async استفاده کنید، اما رایج‌ترین use case برای `Resource`، دریافت داده از server است. مثال زیر resourceای می‌سازد که مقداری user data را fetch می‌کند.

ساده‌ترین راه ساخت یک `Resource`، تابع `resource` است.

```typescript
import {computed, resource, Signal} from '@angular/core';

const userId: Signal<string> = getUserId();

const userResource = resource({
  // Define a reactive computation.
  // The params value recomputes whenever any read signals change.
  params: () => ({id: userId()}),

  // Define an async loader that retrieves data.
  // The resource calls this function every time the `params` value changes.
  loader: ({params}) => fetchUser(params),
});

// Create a computed signal based on the result of the resource's loader function.
const firstName = computed(() => {
  if (userResource.hasValue()) {
    // `hasValue` serves 2 purposes:
    // - It acts as type guard to strip `undefined` from the type
    // - It protects against reading a throwing `value` when the resource is in error state
    return userResource.value().firstName;
  }

  // fallback in case the resource value is `undefined` or if the resource is in error state
  return undefined;
});
```

تابع `resource` یک object از نوع `ResourceOptions` می‌پذیرد که دو property اصلی دارد: `params` و `loader`.

property مربوط به `params` یک reactive computation تعریف می‌کند که یک parameter value تولید می‌کند. هر وقت signalهایی که در این computation خوانده شده‌اند تغییر کنند، resource مقدار parameter جدیدی تولید می‌کند؛ مشابه `computed`.

property مربوط به `loader` یک `ResourceLoader` تعریف می‌کند؛ تابعی async که مقداری state را retrieve می‌کند. هر بار که computation مربوط به `params` مقدار جدیدی تولید کند، resource loader را فراخوانی می‌کند و آن مقدار را به loader پاس می‌دهد. برای جزئیات بیشتر، بخش [Resource loaders](#resource-loaders) را در ادامه ببینید.

`Resource` یک signal به نام `value` دارد که نتیجه‌های loader را نگه می‌دارد.

## Resource loaderها

هنگام ساخت یک resource، یک `ResourceLoader` مشخص می‌کنید. این loader یک تابع async است که یک parameter می‌پذیرد؛ objectای از نوع `ResourceLoaderParams`؛ و یک مقدار برمی‌گرداند.

object مربوط به `ResourceLoaderParams` سه property دارد: `params`، `previous` و `abortSignal`.

| Property      | Description                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `params`      | مقدار computation مربوط به `params` در resource.                                                                                                |
| `previous`    | objectای با property مربوط به `status` که `ResourceStatus` قبلی را نگه می‌دارد.                                                                  |
| `abortSignal` | یک [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). برای جزئیات، بخش [لغو requestها](#aborting-requests) را ببینید. |

اگر computation مربوط به `params` مقدار `undefined` برگرداند، تابع loader اجرا نمی‌شود و status مربوط به resource برابر `'idle'` می‌شود.

### resourceهای streaming

بعضی data sourceهای asynchronous به جای برگرداندن یک نتیجه واحد، در طول زمان چند مقدار تولید می‌کنند. مثال‌ها شامل WebSocketها، Server-Sent Events \(SSE\) و listenerهای Firestore `onSnapshot` هستند.

برای این data sourceهایی که پیوسته update می‌شوند، از `stream` استفاده کنید. برخلاف `loader` که برای هر request یک بار resolve می‌شود، `stream` یک signal برمی‌گرداند که مقدار آن می‌تواند با در دسترس قرار گرفتن داده جدید همچنان update شود.

برای operationهای asynchronous یک‌باره، مثل fetch کردن داده از یک HTTP endpoint، از `loader` استفاده کنید.

```typescript
const userUpdates = signal({value: 'Alice'});

const userResource = resource({
  stream: () => userUpdates,
});

// Later, when new data arrives:
userUpdates.set({value: 'Bob'});
```

### لغو requestها

اگر computation مربوط به `params` در حالی تغییر کند که resource در حال loading است، resource operation loading در حال اجرا را abort می‌کند.

می‌توانید از `abortSignal` در `ResourceLoaderParams` استفاده کنید تا به requestهای abort شده واکنش نشان دهید. برای مثال، تابع native مربوط به `fetch` یک `AbortSignal` می‌پذیرد:

```typescript
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params, abortSignal}): Promise<User> => {
    // fetch cancels any outstanding HTTP requests when the given `AbortSignal`
    // indicates that the request has been aborted.
    return fetch(`users/${params.id}`, {signal: abortSignal});
  },
});
```

برای جزئیات بیشتر درباره cancellation مربوط به request با `AbortSignal`، [`AbortSignal` در MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) را ببینید.

### Reloading

می‌توانید با فراخوانی method مربوط به `reload`، `loader` یک resource را به صورت برنامه‌نویسی‌شده trigger کنید.

```typescript
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params}) => fetchUser(params),
});

// ...

userResource.reload();
```

## status مربوط به Resource

object مربوط به resource چند property از نوع signal دارد که برای خواندن status مربوط به loader asynchronous استفاده می‌شوند.

| Property    | Description                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| `value`     | جدیدترین مقدار resource، یا `undefined` اگر هنوز مقداری دریافت نشده باشد.                                      |
| `hasValue`  | اینکه resource مقدار دارد یا نه.                                                                               |
| `error`     | جدیدترین error رخ‌داده هنگام اجرای loader مربوط به resource، یا `undefined` اگر errorای رخ نداده باشد.          |
| `isLoading` | اینکه loader مربوط به resource در حال حاضر در حال اجرا است یا نه.                                              |
| `status`    | `ResourceStatus` مشخص resource، همان‌طور که در ادامه توضیح داده شده است.                                      |

signal مربوط به `status` یک `ResourceStatus` مشخص ارائه می‌دهد که وضعیت resource را با یک string constant توصیف می‌کند.

| Status        | `value()`         | Description                                                                  |
| ------------- | :---------------- | ---------------------------------------------------------------------------- |
| `'idle'`      | `undefined`       | resource هیچ request معتبری ندارد و loader اجرا نشده است.                   |
| `'error'`     | `undefined`       | loader با error مواجه شده است.                                               |
| `'loading'`   | `undefined`       | loader به دلیل تغییر مقدار `params` در حال اجرا است.                         |
| `'reloading'` | مقدار قبلی        | loader به دلیل فراخوانی method مربوط به `reload` در resource در حال اجرا است. |
| `'resolved'`  | مقدار resolved    | loader کامل شده است.                                                         |
| `'local'`     | مقدار locally set | مقدار resource به صورت local از طریق `.set()` یا `.update()` تنظیم شده است. |

می‌توانید از این status information برای نمایش شرطی elementهای user interface، مثل loading indicatorها و error messageها استفاده کنید.

## cache کردن داده `resource` با SSR

وقتی یک برنامه روی server render می‌شود، loader مربوط به resource یک بار اجرا می‌شود تا HTML اولیه تولید شود. در طول hydration، browser معمولاً همان loader را دوباره اجرا می‌کند.

برای reuse کردن نتیجه server، برای resource یک `id` ارائه دهید. Angular مقدار resolved را روی server در `TransferState` ذخیره می‌کند و روی client از آن استفاده می‌کند تا resource را در state مربوط به `'resolved'` initialize کند.

```ts
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params}) => fetchUser(params),
  id: 'user-unique-id',
});
```

مقدار `id` باید در برنامه شما یکتا باشد و روی server و client یکسان باشد تا Angular بتواند cached entry را با resourceای که آن را request کرده match کند.

IMPORTANT: چون مقدار cache شده داخل HTML صفحه serialize می‌شود، از set کردن `id` روی resourceهایی که data مخصوص کاربری را load می‌کنند که server-side render را trigger کرده خودداری کنید؛ مخصوصاً اگر HTML render شده می‌تواند بین کاربران cache یا share شود.

## chain کردن resourceها

گاهی یک resource به نتیجه resource دیگری وابسته است. می‌توانید این dependency را با تابع `chain` که در object مربوط به context در `params` در دسترس است بیان کنید.

```typescript
import {resource} from '@angular/core';

const userResource = resource({
  params: () => ({id: getUserId()}),
  loader: ({params}) => fetchUser(params),
});

const companyResource = resource({
  params: ({chain}) => chain(userResource)?.companyId,
  loader: ({params: companyId}) => fetchCompany(companyId),
});
```

اینجا `companyResource` به `companyId` کاربر وابسته است، که فقط بعد از load شدن `userResource` مشخص می‌شود. `chain(userResource)` مقدار `userResource` را می‌خواند و status آن را به صورت خودکار به `companyResource` propagate می‌کند:

- اگر `userResource` برابر **idle** باشد، `companyResource` هم `idle` می‌شود.
- اگر `userResource` در حال **loading** یا **reloading** باشد، `companyResource` وارد state مربوط به `loading` می‌شود و loader آن اجرا نمی‌شود. توجه کنید که در طول `reloading`، `chain` مقدار resolved قبلی را برنمی‌گرداند.
- اگر `userResource` در state مربوط به **error** باشد، `companyResource` هم وارد state مربوط به `error` می‌شود.
- اگر `userResource` برابر **resolved** یا **local** باشد، `chain` مقدار فعلی آن را برمی‌گرداند و `companyResource` سپس از آن به عنوان params خود استفاده می‌کند.

وقتی `chain` یک status را از `userResource` propagate می‌کند، یعنی `idle`، `loading`، `reloading` یا `error`، تابع params ادامه پیدا نمی‌کند. وقتی `userResource` برابر `resolved` یا `local` باشد، `chain` مقدار آن را برمی‌گرداند که خودش می‌تواند `undefined` باشد. مثال این حالت را با `chain(userResource)?.companyId` مدیریت می‌کند، بنابراین مقدار `undefined` باعث `undefined` شدن params می‌شود و `companyResource` به `idle` تبدیل می‌شود.

NOTE: مقدار chained را مستقیماً به عنوان مقدار params پاس بدهید، نه اینکه آن را داخل object بپیچید. مقدار paramsای مثل `{companyId: undefined}` هنوز یک مقدار defined است، بنابراین loader با `companyId` برابر `undefined` اجرا می‌شود، به جای اینکه resource به `idle` تبدیل شود.

### Chaining در برابر خواندن مستقیم مقدارهای resource

ممکن است وسوسه شوید مقدار یک resource را مستقیماً داخل `params` بخوانید:

```typescript {avoid, header: 'reads value() directly without status propagation'}
const companyResource = resource({
  params: () => {
    const user = userResource.value(); // may be undefined
    return user ? {companyId: user.companyId} : undefined;
  },
  loader: ({params}) => fetchCompany(params.companyId),
});
```

در حالی که این کار جواب می‌دهد، برگرداندن `undefined` از `params` باعث می‌شود resource به `idle` برود، نه اینکه state واقعی resource بالادستی را بازتاب دهد. استفاده از `chain` ترجیح دارد، چون stateهای `loading` و `error` را درست mirror می‌کند.

فقط وقتی سراغ `chain` بروید که resource پایین‌دستی async work خودش را انجام می‌دهد و به مقدار بالادستی وابسته است. اگر فقط لازم دارید مقداری را synchronously از یک resource derive کنید، به جای آن از `computed` استفاده کنید.

## data fetching reactive با `httpResource`

[`httpResource`](/guide/http/http-resource) wrapperای دور `HttpClient` است که status مربوط به request و response را به صورت signal در اختیار شما می‌گذارد. این API requestهای HTTP را از طریق stack مربوط به Angular HTTP، شامل interceptorها، انجام می‌دهد.

## ترکیب resourceها با snapshotها

یک `ResourceSnapshot` نمایش ساختاریافته‌ای از state فعلی یک resource است. هر resource یک property به نام `snapshot` دارد که signalای از state فعلی آن فراهم می‌کند.

```ts
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params}) => fetchUser(params),
});

const userSnapshot = userResource.snapshot;
```

هر snapshot شامل یک `status` و یا یک `value` یا یک `error` است.

### ترکیب resourceها با snapshotها

می‌توانید با استفاده از `resourceFromSnapshots` از snapshotها resourceهای جدید بسازید. این کار composition با signal APIهایی مثل `computed` و `linkedSignal` را ممکن می‌کند تا behavior مربوط به resource را transform کنید.

```ts
import {linkedSignal, resourceFromSnapshots, Resource, ResourceSnapshot} from '@angular/core';

function withPreviousValue<T>(input: Resource<T>): Resource<T> {
  const derived = linkedSignal<ResourceSnapshot<T>, ResourceSnapshot<T>>({
    source: input.snapshot,
    computation: (snap, previous) => {
      if (snap.status === 'loading' && previous && previous.value.status !== 'error') {
        // When the input resource enters loading state, we keep the value
        // from its previous state, if any.
        return {status: 'loading' as const, value: previous.value.value};
      }

      // Otherwise we simply forward the state of the input resource.
      return snap;
    },
  });

  return resourceFromSnapshots(derived);
}

@Component({
  /*... */
})
export class AwesomeProfile {
  userId = input.required<number>();
  user = withPreviousValue(httpResource(() => `/user/${this.userId()}`));
  // When userId changes, user.value() keeps the old user data until the new one loads
}
```

