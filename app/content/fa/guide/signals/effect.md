## Effectها

Signalها مفیدند چون وقتی تغییر می‌کنند، consumerهای علاقه‌مند را باخبر می‌کنند. یک **effect** operationای است که هر وقت مقدار یک یا چند signal تغییر کند اجرا می‌شود. می‌توانید با تابع `effect` یک effect بسازید:

```ts
import {effect} from '@angular/core';

effect(() => {
  console.log(`The current count is: ${count()}`);
});
```

Effectها همیشه **حداقل یک بار** اجرا می‌شوند. وقتی effect اجرا می‌شود، هر خواندن مقدار signal را track می‌کند. هر وقت یکی از این مقدارهای signal تغییر کند، effect دوباره اجرا می‌شود. مشابه signalهای computed، effectها dependencyهای خود را به صورت پویا دنبال می‌کنند و فقط signalهایی را track می‌کنند که در آخرین execution خوانده شده‌اند.

Effectها همیشه در طول فرآیند change detection به صورت **asynchronous** اجرا می‌شوند.

### use caseهای effectها

Effectها باید آخرین APIای باشند که سراغش می‌روید. همیشه برای مقدارهای derived، `computed()` را ترجیح دهید و برای مقدارهایی که هم derived هستند و هم می‌توانند manually set شوند، `linkedSignal()` را ترجیح دهید. اگر دیدید با effect دارید داده‌ای را از یک signal به signal دیگر copy می‌کنید، نشانه این است که باید source-of-truth خود را بالاتر ببرید و به جای آن از `computed()` یا `linkedSignal()` استفاده کنید. Effectها برای sync کردن signal state با APIهای imperative و non-signal بهترین گزینه‌اند.

TIP: هیچ موقعیتی وجود ندارد که effect «خوب» باشد؛ فقط موقعیت‌هایی وجود دارد که effect در آن‌ها مناسب است.

- log کردن مقدارهای signal، چه برای analytics و چه به عنوان ابزار debugging.
- sync نگه داشتن data با انواع مختلف storage: `window.localStorage`، session storage، cookies و موارد دیگر.
- اضافه کردن behavior سفارشی DOM که با template syntax قابل بیان نیست.
- انجام rendering سفارشی روی element مربوط به `<canvas>`، charting library یا libraryهای UI شخص ثالث دیگر.

<docs-callout critical title="چه زمانی از effect استفاده نکنیم">
از effectها برای propagation تغییرات state استفاده نکنید. این کار می‌تواند باعث errorهای `ExpressionChangedAfterItHasBeenChecked`، updateهای circular بی‌نهایت یا cycleهای غیرضروری change detection شود.

به جای آن، از signalهای `computed` برای model کردن stateای استفاده کنید که به state دیگری وابسته است.
</docs-callout>

### injection context

به صورت پیش‌فرض، فقط می‌توانید یک `effect()` را داخل یک [injection context](guide/di/dependency-injection-context) بسازید؛ جایی که به تابع `inject` دسترسی دارید. ساده‌ترین راه برای برآورده کردن این requirement این است که `effect` را داخل `constructor` یک کامپوننت، directive یا service فراخوانی کنید:

```ts
@Component(/* ... */)
export class EffectiveCounter {
  readonly count = signal(0);

  constructor() {
    // Register a new effect.
    effect(() => {
      console.log(`The count is: ${this.count()}`);
    });
  }
}
```

برای ساخت effect بیرون از constructor، می‌توانید از طریق options مربوط به `effect` یک `Injector` پاس بدهید:

```ts
@Component(/* ... */)
export class EffectiveCounter {
  readonly count = signal(0);
  private injector = inject(Injector);

  initializeLogging(): void {
    effect(
      () => {
        console.log(`The count is: ${this.count()}`);
      },
      {injector: this.injector},
    );
  }
}
```

### اجرای effectها

Angular بسته به contextای که effectها در آن ساخته شده‌اند، دو behavior implicit برای effectهای خود تعریف می‌کند.

یک "View Effect"، `effect`ای است که در context مربوط به instantiation یک کامپوننت ساخته می‌شود. این شامل effectهایی هم می‌شود که توسط serviceهای وابسته به injectorهای کامپوننت ساخته شده‌اند.<br>
یک "Root Effect" در context مربوط به instantiation یک service ارائه‌شده در root ساخته می‌شود.

اجرای هر دو نوع `effect` به فرآیند change detection گره خورده است.

- "View effects" پیش از اینکه کامپوننت متناظرشان توسط فرآیند change detection بررسی شود اجرا می‌شوند.
- "Root effects" پیش از بررسی همه کامپوننت‌ها توسط فرآیند change detection اجرا می‌شوند.

در هر دو حالت، اگر در طول اجرای effect حداقل یکی از dependencyهای effect تغییر کند، effect پیش از ادامه فرآیند change detection دوباره اجرا می‌شود.

### destroy کردن effectها

وقتی یک کامپوننت یا directive destroy می‌شود، Angular هر effect مرتبط با آن را به صورت خودکار cleanup می‌کند.

یک `effect` می‌تواند در دو context متفاوت ساخته شود که روی زمان destroy شدن آن اثر می‌گذارد:

- یک "View effect" وقتی کامپوننت destroy شود destroy می‌شود.
- یک "Root effect" وقتی application destroy شود destroy می‌شود.

Effectها یک `EffectRef` برمی‌گردانند. می‌توانید از method مربوط به `destroy` روی ref استفاده کنید تا یک effect را manually dispose کنید. می‌توانید هنگام ساخت effect، این را با option مربوط به `manualCleanup` ترکیب کنید تا cleanup خودکار غیرفعال شود. مراقب باشید چنین effectهایی را وقتی دیگر لازم نیستند واقعاً destroy کنید.

### تابع‌های cleanup مربوط به effect

وقتی یک کامپوننت یا directive destroy می‌شود، Angular هر effect مرتبط با آن را به صورت خودکار cleanup می‌کند. Effectها ممکن است operationهای long-running شروع کنند؛ اگر effect destroy شود یا پیش از تمام شدن operation اول دوباره اجرا شود، باید آن operationها را cancel کنید. وقتی یک effect می‌سازید، تابع شما می‌تواند به صورت اختیاری یک تابع `onCleanup` را به عنوان اولین پارامتر بپذیرد. این تابع `onCleanup` به شما اجازه می‌دهد callbackای register کنید که قبل از شروع اجرای بعدی effect یا هنگام destroy شدن effect invoke می‌شود.

```ts
effect((onCleanup) => {
  const user = currentUser();

  const timer = setTimeout(() => {
    console.log(`1 second ago, the user became ${user}`);
  }, 1000);

  onCleanup(() => {
    clearTimeout(timer);
  });
});
```

## side effectها روی elementهای DOM

تابع `effect` ابزاری general-purpose برای اجرای کد در واکنش به تغییرات signal است. با این حال، _قبل از_ اینکه Angular، DOM را update کند اجرا می‌شود. در بعضی موقعیت‌ها، ممکن است لازم باشد DOM را manually inspect یا modify کنید، یا یک library شخص ثالث را integrate کنید که نیاز به دسترسی مستقیم به DOM دارد.

برای این موقعیت‌ها، می‌توانید از `afterRenderEffect` استفاده کنید. این مثل `effect` کار می‌کند، اما بعد از اینکه Angular rendering را تمام کرد و تغییرات خود را به DOM commit کرد اجرا می‌شود.

```ts
@Component(/* ... */)
export class MyFancyChart {
  chartData = input.required<ChartData>();
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  chart: ChartInstance;

  constructor() {
    // Run a single time to create the chart instance
    afterNextRender({
      write: () => {
        this.chart = initializeChart(this.canvas().nativeElement(), this.chartData());
      },
    });

    // Re-run after DOM has been updated whenever `chartData` changes
    afterRenderEffect(() => {
      this.chart.updateData(this.chartData());
    });
  }
}
```

در این مثال از `afterRenderEffect` برای update کردن chartای استفاده شده که توسط یک library شخص ثالث ساخته شده است.

TIP: اغلب برای بررسی تغییرات DOM به `afterRenderEffect` نیاز ندارید. APIهایی مثل `ResizeObserver`، `MutationObserver` و `IntersectionObserver` وقتی ممکن باشد به `effect` یا `afterRenderEffect` ترجیح داده می‌شوند.

### phaseهای render

دسترسی به DOM و mutate کردن آن می‌تواند روی performance برنامه اثر بگذارد؛ برای مثال با trigger کردن تعداد زیادی [reflow](https://developer.mozilla.org/en-US/docs/Glossary/Reflow) غیرضروری.

برای optimize کردن این operationها، `afterRenderEffect` چهار phase ارائه می‌دهد تا callbackها را گروه‌بندی کند و آن‌ها را با ترتیب optimize شده اجرا کند.

phaseها عبارت‌اند از:

| Phase            | Description                                                                                                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `earlyRead`      | از این phase برای خواندن از DOM پیش از یک callback نوشتن بعدی استفاده کنید؛ برای مثال برای انجام layout سفارشی که browser به صورت native پشتیبانی نمی‌کند. اگر خواندن می‌تواند صبر کند، phase مربوط به read را ترجیح دهید. |
| `write`          | از این phase برای نوشتن در DOM استفاده کنید. در این phase **هرگز** از DOM نخوانید.                                                                                                                  |
| `mixedReadWrite` | از این phase برای خواندن و نوشتن هم‌زمان در DOM استفاده کنید. اگر می‌شود کار را بین phaseهای دیگر تقسیم کرد، هرگز از این phase استفاده نکنید.                                                       |
| `read`           | از این phase برای خواندن از DOM استفاده کنید. در این phase **هرگز** در DOM ننویسید.                                                                                                                  |

استفاده از این phaseها به جلوگیری از layout thrashing کمک می‌کند و مطمئن می‌شود operationهای DOM شما به شکلی امن و efficient انجام می‌شوند.

می‌توانید phase را با پاس دادن objectای دارای property مربوط به `phase` به `afterRender` یا `afterNextRender` مشخص کنید:

```ts
afterRenderEffect({
  earlyRead: (cleanupFn) => {
    /* ... */
  },
  write: (previousPhaseValue, cleanupFn) => {
    /* ... */
  },
  mixedReadWrite: (previousPhaseValue, cleanupFn) => {
    /* ... */
  },
  read: (previousPhaseValue, cleanupFn) => {
    /* ... */
  },
});
```

CRITICAL: اگر phase را مشخص نکنید، `afterRenderEffect` callbackها را در phase مربوط به `mixedReadWrite` اجرا می‌کند. این ممکن است با ایجاد DOM reflowهای اضافه، performance برنامه را بدتر کند.

#### اجرای phaseها

callback مربوط به phase `earlyRead` هیچ پارامتری دریافت نمی‌کند. هر phase بعدی، مقدار برگشتی callback phase قبلی را به عنوان Signal دریافت می‌کند. می‌توانید از این برای هماهنگ کردن کار بین phaseها استفاده کنید.

Effectها با ترتیب phase زیر اجرا می‌شوند:

1. `earlyRead`
2. `write`
3. `mixedReadWrite`
4. `read`

اگر یکی از phaseها مقدار signalای را modify کند که توسط `afterRenderEffect` track شده، phaseهای affected دوباره اجرا می‌شوند.

#### Cleanup

هر phase یک cleanup callback function به عنوان argument فراهم می‌کند. cleanup callbackها وقتی `afterRenderEffect` destroy شود یا قبل از اجرای دوباره phase effectها اجرا می‌شوند.

### نکته‌های server-side rendering

`afterRenderEffect`، مشابه `afterNextRender`/`afterEveryRender`، فقط روی client اجرا می‌شود.

NOTE: تضمین نمی‌شود کامپوننت‌ها پیش از اجرای callback [hydrated](/guide/hydration) شده باشند. هنگام خواندن یا نوشتن مستقیم DOM و layout باید احتیاط کنید.

