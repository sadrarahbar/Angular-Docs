# debounce کردن signalها با `debounced`

IMPORTANT: `debounced` [experimental](reference/releases#experimental) است. آماده است که آن را امتحان کنید، اما ممکن است قبل از stable شدن تغییر کند.

از `debounced` استفاده کنید تا واکنش به مقدار یک signal را تا زمانی که تغییرش متوقف شود به تأخیر بیندازید. این تابع یک `Resource` برمی‌گرداند که مقدار آن، مقدار debounced مربوط به source signal را بازتاب می‌دهد.

```angular-ts
import {debounced, resource, signal} from '@angular/core';

@Component({
  template: `
    <input (input)="query.set($event.target.value)" />

    @if (results.isLoading()) {
      <p>Searching…</p>
    }
    @for (item of results.value(); track item.id) {
      <li>{{ item.name }}</li>
    }
  `,
})
export class Search {
  query = signal('');

  debouncedQuery = debounced(this.query, 300);

  results = resource({
    params: () => this.debouncedQuery.value(),
    loader: ({params}) => fetchResults(params),
  });
}
```

`debounced` source signal و یک مدت انتظار بر حسب millisecond را می‌گیرد. مقدار `value()` در resource برگشتی همیشه آخرین مقدار settled را شامل می‌شود و `status()` به شما می‌گوید آیا مقدار جدید هنوز pending است یا نه.

## status هنگام debounce

وقتی timer مربوط به debounce در حال شمارش معکوس است، `status()` برابر `'loading'` است و `value()` مقدار resolved قبلی را برمی‌گرداند. وقتی timer تمام شود، resource به `'resolved'` settle می‌شود. اگر source signal throw کند، resource بلافاصله وارد وضعیت `'error'` می‌شود و timer اجرا نمی‌شود.

برای لیست کامل statusها و رفتار `value()` آن‌ها، [Resource status](/guide/signals/resource#resource-status) را ببینید.

## تابع wait سفارشی

به جای مدت زمان millisecond، می‌توانید تابعی پاس بدهید که `Promise<void>` برمی‌گرداند. resource وقتی promise resolve شود resolve می‌شود. اگر source signal قبل از settle شدن promise تغییر کند، Angular promise قبلی را کنار می‌گذارد و promise جدیدی شروع می‌کند.

```ts
debouncedQuery = debounced(query, (value, lastSnapshot) => {
  // Retry immediately after an error rather than making the user wait again.
  if (lastSnapshot.status === 'error') return;
  // Short queries get a longer delay—the user is likely still typing.
  const ms = value.length < 3 ? 500 : 200;
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
});
```

برای جزئیات، type مربوط به `DebounceTimer` را در API reference ببینید.

## Equality

به صورت پیش‌فرض، `debounced` برای مقایسه مقدارها از `Object.is` استفاده می‌کند.

وقتی identity check پیش‌فرض بیش از حد strict است، با option مربوط به `equal` یک equality function سفارشی ارائه دهید:

```ts
debouncedFilter = debounced(filter, 200, {
  equal: (a, b) => a.category === b.category && a.minPrice === b.minPrice,
});
```

## injection context

`debounced` باید داخل یک [injection context](guide/di/dependency-injection-context) فراخوانی شود. وقتی injector destroy شود، Angular resource مربوط به debounce را به صورت خودکار destroy می‌کند و هر timer pending را cancel می‌کند.

برای استفاده از `debounced` خارج از injection context، یک `Injector` صریح را از طریق options پاس بدهید:

```ts
@Service()
export class SearchService {
  private injector = inject(Injector);

  createDebouncedQuery(query: Signal<string>): Resource<string> {
    return debounced(query, 300, {injector: this.injector});
  }
}
```

