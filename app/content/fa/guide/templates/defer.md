# Deferred loading با `@defer`

Deferrable viewها، که با نام blockهای `@defer` هم شناخته می‌شوند، با به‌تاخیر انداختن load شدن کدی که برای render اولیه یک page کاملا ضروری نیست، اندازه bundle اولیه application شما را کاهش می‌دهند. این کار اغلب باعث load اولیه سریع‌تر و بهبود Core Web Vitals یا CWV می‌شود، به‌خصوص Largest Contentful Paint یا LCP و Time to First Byte یا TTFB.

برای استفاده از این قابلیت، می‌توانید به‌صورت declarative بخشی از template خود را در یک block مربوط به @defer قرار دهید:

```angular-html
@defer {
  <large-component />
}
```

کد هر component، directive و pipe داخل block مربوط به `@defer` به یک فایل JavaScript جداگانه split می‌شود و فقط وقتی لازم باشد، بعد از render شدن باقی template، load می‌شود.

Deferrable viewها از انواع triggerها، optionهای prefetching و sub-blockهایی برای مدیریت stateهای placeholder، loading و error پشتیبانی می‌کنند.

## کدام dependencyها deferred می‌شوند؟

Componentها، directiveها، pipeها و هر CSS style مربوط به component می‌توانند هنگام load شدن application deferred شوند.

برای اینکه dependencyهای داخل یک block مربوط به `@defer` deferred شوند، باید دو شرط را داشته باشند:

1. **باید standalone باشند.** dependencyهای non-standalone deferred نمی‌شوند و حتی اگر داخل blockهای `@defer` باشند، همچنان eagerly loaded می‌شوند.
1. **نباید بیرون از blockهای `@defer` در همان فایل reference شده باشند.** اگر بیرون از block مربوط به `@defer` یا داخل queryهای ViewChild به آن‌ها reference داده شود، dependencyها eagerly loaded می‌شوند.

Dependencyهای _transitive_ مربوط به componentها، directiveها و pipeهایی که داخل block `@defer` استفاده می‌شوند الزام سختی برای standalone بودن ندارند؛ dependencyهای transitive همچنان می‌توانند در یک `NgModule` declare شوند و در deferred loading شرکت کنند.

compiler Angular برای هر component، directive و pipe استفاده‌شده داخل block مربوط به `@defer` یک statement از نوع [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) تولید می‌کند. محتوای اصلی block بعد از resolve شدن همه importها render می‌شود. Angular هیچ ترتیب خاصی برای این importها تضمین نمی‌کند.

## مدیریت stageهای مختلف deferred loading

Blockهای `@defer` چند sub-block دارند تا بتوانید stageهای مختلف فرایند deferred loading را به‌شکل مناسبی handle کنید.

### `@defer`

این block اصلی است که section مربوط به contentی را تعریف می‌کند که lazily loaded می‌شود. این content ابتدا render نمی‌شود؛ deferred content وقتی [trigger](#controlling-deferred-content-loading-with-triggers) مشخص رخ دهد یا condition مربوط به `when` برقرار شود load و render می‌شود.

به‌صورت پیش‌فرض، یک block مربوط به `@defer` وقتی browser state [idle](/guide/templates/defer#idle) شود trigger می‌شود.

```angular-html
@defer {
  <large-component />
}
```

### نمایش placeholder content با `@placeholder`

به‌صورت پیش‌فرض، defer blockها پیش از trigger شدن هیچ contentی render نمی‌کنند.

`@placeholder` یک block اختیاری است که مشخص می‌کند پیش از trigger شدن block مربوط به `@defer` چه contentی نمایش داده شود.

```angular-html
@defer {
  <large-component />
} @placeholder {
  <p>Placeholder content</p>
}
```

با اینکه اختیاری است، بعضی triggerها ممکن است برای کار کردن به وجود `@placeholder` یا یک [template reference variable](/guide/templates/variables#template-reference-variables) نیاز داشته باشند. برای جزئیات بیشتر، بخش [Triggers](#controlling-deferred-content-loading-with-triggers) را ببینید.

Angular بعد از کامل شدن loading، placeholder content را با content اصلی جایگزین می‌کند. می‌توانید در section مربوط به placeholder از هر contentی استفاده کنید، از جمله plain HTML، componentها، directiveها و pipeها. در نظر داشته باشید _dependencyهای block مربوط به placeholder eagerly loaded می‌شوند_.

Block مربوط به `@placeholder` یک parameter اختیاری می‌پذیرد تا مقدار `minimum` زمانی را مشخص کند که این placeholder باید بعد از render اولیه placeholder content نمایش داده شود.

```angular-html
@defer {
  <large-component />
} @placeholder (minimum 500ms) {
  <p>Placeholder content</p>
}
```

این parameter مربوط به `minimum` با incrementهای زمانی millisecond یعنی ms یا second یعنی s مشخص می‌شود. می‌توانید از این parameter برای جلوگیری از flicker سریع placeholder content استفاده کنید، وقتی dependencyهای deferred خیلی سریع fetch می‌شوند.

### نمایش loading content با `@loading`

Block مربوط به `@loading` یک block اختیاری است که اجازه می‌دهد contentی را declare کنید که هنگام load شدن dependencyهای deferred نمایش داده می‌شود. وقتی loading trigger شود، این block جایگزین block مربوط به `@placeholder` می‌شود.

```angular-html
@defer {
  <large-component />
} @loading {
  <img alt="loading..." src="loading.gif" />
} @placeholder {
  <p>Placeholder content</p>
}
```

Dependencyهای آن eagerly loaded می‌شوند، شبیه `@placeholder`.

Block مربوط به `@loading` دو parameter اختیاری می‌پذیرد که کمک می‌کنند از flicker سریع content در حالتی که dependencyهای deferred سریع fetch می‌شوند جلوگیری کنید:

- `minimum` - حداقل مدت زمانی که این placeholder باید نمایش داده شود
- `after` - مقدار زمانی که بعد از آغاز loading صبر می‌شود و سپس loading template نمایش داده می‌شود

```angular-html
@defer {
  <large-component />
} @loading (after 100ms; minimum 1s) {
  <img alt="loading..." src="loading.gif" />
}
```

هر دو parameter با incrementهای زمانی millisecond یعنی ms یا second یعنی s مشخص می‌شوند. علاوه بر این، timerهای مربوط به هر دو parameter بلافاصله بعد از trigger شدن loading شروع می‌شوند.

### نمایش error state هنگام شکست deferred loading با `@error`

Block مربوط به `@error` یک block اختیاری است که اگر deferred loading شکست بخورد نمایش داده می‌شود. شبیه `@placeholder` و `@loading`، dependencyهای block مربوط به @error eagerly loaded می‌شوند.

```angular-html
@defer {
  <large-component />
} @error {
  <p>Failed to load large component.</p>
}
```

## کنترل load شدن deferred content با triggerها

می‌توانید **triggerهایی** مشخص کنید که کنترل می‌کنند Angular چه زمانی deferred content را load و display کند.

وقتی یک block مربوط به `@defer` trigger می‌شود، placeholder content را با contentی که lazily loaded شده جایگزین می‌کند.

می‌توان چند event trigger را با جدا کردن آن‌ها توسط semicolon یعنی `;` تعریف کرد و آن‌ها به‌عنوان OR condition evaluate می‌شوند.

دو نوع trigger وجود دارد: `on` و `when`.

### `on`

`on` یک condition برای زمان trigger شدن block مربوط به `@defer` مشخص می‌کند.

Triggerهای موجود به این شکل هستند:

| Trigger                       | Description                                                        |
| ----------------------------- | ------------------------------------------------------------------ |
| [`idle`](#idle)               | وقتی مرورگر idle باشد trigger می‌شود. از timeout اختیاری پشتیبانی می‌کند. |
| [`viewport`](#viewport)       | وقتی content مشخص وارد viewport شود trigger می‌شود                 |
| [`interaction`](#interaction) | وقتی کاربر با element مشخص تعامل کند trigger می‌شود                |
| [`hover`](#hover)             | وقتی mouse روی area مشخص hover کند trigger می‌شود                  |
| [`immediate`](#immediate)     | بلافاصله بعد از پایان render شدن contentهای non-deferred trigger می‌شود |
| [`timer`](#timer)             | بعد از مدت مشخص trigger می‌شود                                     |

#### `idle`

Trigger مربوط به `idle`، deferred content را وقتی browser به idle state برسد، بر اساس requestIdleCallback، load می‌کند. این رفتار پیش‌فرض defer block است.

می‌توانید به‌صورت اختیاری یک timeout بر حسب millisecond مشخص کنید که به [`requestIdleCallback`](https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback) پاس داده می‌شود. اگر مرورگر callback را به‌موقع schedule نکند، کار حداکثر تا timeout مشخص‌شده اجرا می‌شود.

```angular-html
<!-- @defer (on idle) -->
@defer {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}

<!-- With a 500ms timeout -->
@defer (on idle(500)) {
  <large-cmp />
}
```

##### سفارشی‌سازی رفتار `idle`

می‌توانید با فراهم کردن implementation خودتان از `IdleService` و register کردن آن با `provideIdleServiceWith` در providerهای application، trigger مربوط به `idle` را customize کنید.

```ts
@Service()
class CustomIdleService implements IdleService {
  requestOnIdle(callback: (deadline?: IdleDeadline) => void, options?: IdleRequestOptions) {
    // Custom idle scheduling logic can be implemented here.
  }

  cancelOnIdle(id: number) {
    // Implement custom idle cancellation here.
  }
}

bootstrapApplication(App, {
  providers: [provideIdleServiceWith(CustomIdleService)],
});
```

#### `viewport`

Trigger مربوط به `viewport`، deferred content را زمانی load می‌کند که content مشخص با استفاده از [Intersection Observer API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) وارد viewport شود. content مشاهده‌شده می‌تواند content مربوط به `@placeholder` یا یک explicit element reference باشد.

به‌صورت پیش‌فرض، `@defer` ورود placeholder به viewport را watch می‌کند. Placeholderهایی که به این شکل استفاده می‌شوند باید یک root element واحد داشته باشند.

```angular-html
@defer (on viewport) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

همچنین می‌توانید یک [template reference variable](/guide/templates/variables) در همان template مربوط به block `@defer` مشخص کنید تا elementی باشد که برای ورود به viewport watch می‌شود. این variable به‌عنوان parameter به viewport trigger پاس داده می‌شود.

```angular-html
<div #greeting>Hello!</div>
@defer (on viewport(greeting)) {
  <greetings-cmp />
}
```

اگر می‌خواهید optionهای `IntersectionObserver` را customize کنید، trigger مربوط به `viewport` از پاس دادن یک object literal پشتیبانی می‌کند. این literal همه propertyهای parameter دوم `IntersectionObserver` را به‌جز `root` پشتیبانی می‌کند. هنگام استفاده از notation مربوط به object literal، باید trigger خود را با property مربوط به `trigger` پاس دهید.

```angular-html
<div #greeting>Hello!</div>

<!-- With options and a trigger -->
@defer (on viewport({trigger: greeting, rootMargin: '100px', threshold: 0.5})) {
  <greetings-cmp />
}

<!-- With options and an implied trigger -->
@defer (on viewport({rootMargin: '100px', threshold: 0.5})) {
  <greetings-cmp />
} @placeholder {
  <div>Implied trigger</div>
}
```

#### `interaction`

Trigger مربوط به `interaction`، deferred content را وقتی کاربر از طریق eventهای `click` یا `keydown` با element مشخص تعامل کند load می‌کند.

به‌صورت پیش‌فرض، placeholder به‌عنوان interaction element عمل می‌کند. Placeholderهایی که به این شکل استفاده می‌شوند باید یک root element واحد داشته باشند.

```angular-html
@defer (on interaction) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

همچنین می‌توانید یک [template reference variable](/guide/templates/variables) در همان template مربوط به block `@defer` مشخص کنید تا elementی باشد که برای interactionها watch می‌شود. این variable به‌عنوان parameter به interaction trigger پاس داده می‌شود.

```angular-html
<div #greeting>Hello!</div>
@defer (on interaction(greeting)) {
  <greetings-cmp />
}
```

#### `hover`

Trigger مربوط به `hover`، deferred content را وقتی mouse از طریق eventهای `mouseover` و `focusin` روی area trigger شده hover کرده باشد load می‌کند.

به‌صورت پیش‌فرض، placeholder به‌عنوان interaction element عمل می‌کند. Placeholderهایی که به این شکل استفاده می‌شوند باید یک root element واحد داشته باشند.

```angular-html
@defer (on hover) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

همچنین می‌توانید یک [template reference variable](/guide/templates/variables) در همان template مربوط به block `@defer` مشخص کنید تا elementی باشد که روی آن hover می‌شود. این variable به‌عنوان parameter به hover trigger پاس داده می‌شود.

```angular-html
<div #greeting>Hello!</div>
@defer (on hover(greeting)) {
  <greetings-cmp />
}
```

#### `immediate`

Trigger مربوط به `immediate`، deferred content را بلافاصله load می‌کند. یعنی defer block به‌محض اینکه همه contentهای non-deferred render شدند load می‌شود.

```angular-html
@defer (on immediate) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `timer`

Trigger مربوط به `timer`، deferred content را بعد از مدت مشخصی load می‌کند.

```angular-html
@defer (on timer(500ms)) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Parameter مربوط به duration باید بر حسب millisecond یعنی (`ms`) یا second یعنی (`s`) مشخص شود.

### `when`

Trigger مربوط به `when` یک custom conditional expression می‌پذیرد و وقتی condition truthy شود، deferred content را load می‌کند.

```angular-html
@defer (when condition) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

این یک عملیات یک‌باره است؛ block مربوط به `@defer` اگر condition بعد از truthy شدن دوباره به falsy value تغییر کند، به placeholder برنمی‌گردد.

## Prefetch کردن data با `prefetch`

علاوه بر مشخص کردن conditionای که تعیین می‌کند deferred content چه زمانی نمایش داده شود، می‌توانید به‌صورت اختیاری یک **prefetch trigger** هم مشخص کنید. این trigger اجازه می‌دهد JavaScript مرتبط با block مربوط به `@defer` را پیش از نمایش deferred content load کنید.

Prefetching رفتارهای پیشرفته‌تری را ممکن می‌کند؛ مثلا می‌توانید prefetch کردن resourceها را پیش از اینکه کاربر واقعا یک defer block را ببیند یا با آن تعامل کند شروع کنید، در حالی که ممکن است به‌زودی با آن تعامل کند، و resourceها سریع‌تر آماده شوند.

می‌توانید prefetch trigger را شبیه trigger اصلی block مشخص کنید، اما با keyword مربوط به `prefetch` به‌عنوان prefix. Trigger اصلی block و prefetch trigger با semicolon یعنی (`;`) از هم جدا می‌شوند.

در مثال زیر، prefetching زمانی شروع می‌شود که مرورگر idle شود و contentهای block فقط وقتی کاربر با placeholder تعامل کند render می‌شوند.

```angular-html
@defer (on interaction; prefetch on idle) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}

<!-- Prefetching with a 500ms idle timeout -->
@defer (on interaction; prefetch on idle(500)) {
  <large-cmp />
}
```

## تست blockهای `@defer`

Angular APIهای TestBed را فراهم می‌کند تا فرایند test کردن blockهای `@defer` و trigger کردن stateهای مختلف در test ساده‌تر شود. به‌صورت پیش‌فرض، blockهای `@defer` در testها همان‌طور play through می‌شوند که یک defer block در application واقعی رفتار می‌کند. اگر می‌خواهید stateها را به‌صورت دستی step کنید، می‌توانید رفتار defer block را در configuration مربوط به TestBed به `Manual` تغییر دهید.

```angular-ts
it('should render a defer block in different states', async () => {
  // configures the defer block behavior to start in "paused" state for manual control.
  TestBed.configureTestingModule({deferBlockBehavior: DeferBlockBehavior.Manual});
  @Component({
    // ...
    template: `
      @defer {
        <large-component />
      } @placeholder {
        Placeholder
      } @loading {
        Loading...
      }
    `,
  })
  class ExampleA {}
  // Create component fixture.
  const componentFixture = TestBed.createComponent(ExampleA);
  // Retrieve the list of all defer block fixtures and get the first block.
  const deferBlockFixture = (await componentFixture.getDeferBlocks())[0];
  // Renders placeholder state by default.
  expect(componentFixture.nativeElement.innerHTML).toContain('Placeholder');
  // Render loading state and verify rendered output.
  await deferBlockFixture.render(DeferBlockState.Loading);
  expect(componentFixture.nativeElement.innerHTML).toContain('Loading');
  // Render final state and verify the output.
  await deferBlockFixture.render(DeferBlockState.Complete);
  expect(componentFixture.nativeElement.innerHTML).toContain('large works!');
});
```

## آیا `@defer` با `NgModule` کار می‌کند؟

Blockهای `@defer` با componentها، directiveها و pipeهای standalone و NgModule-based سازگارند. با این حال، **فقط componentها، directiveها و pipeهای standalone می‌توانند deferred شوند**. Dependencyهای NgModule-based deferred نمی‌شوند و در eagerly loaded bundle قرار می‌گیرند.

## سازگاری blockهای `@defer` و Hot Module Reload یا HMR

وقتی Hot Module Replacement یا HMR فعال باشد، همه chunkهای blockهای `@defer` eagerly fetch می‌شوند و هر trigger configure شده را override می‌کنند. برای برگرداندن رفتار استاندارد triggerها، باید HMR را با serve کردن application همراه با flag مربوط به `--no-hmr` غیرفعال کنید.

## `@defer` با server-side rendering یا SSR و static-site generation یا SSG چگونه کار می‌کند؟

به‌صورت پیش‌فرض، هنگام render کردن یک application روی server، چه با SSR و چه با SSG، defer blockها همیشه `@placeholder` خود را render می‌کنند، یا اگر placeholder مشخص نشده باشد هیچ‌چیز render نمی‌کنند، و triggerها invoke نمی‌شوند. روی client، content مربوط به `@placeholder` hydrate می‌شود و triggerها فعال می‌شوند.

برای render کردن محتوای اصلی blockهای `@defer` روی server، هم در SSR و هم در SSG، می‌توانید [قابلیت Incremental Hydration](/guide/incremental-hydration) را فعال کنید و triggerهای `hydrate` را برای blockهای لازم configure کنید.

## Barrel fileها و lazy chunkها

اگر از `@defer` استفاده می‌کنید اما در build output خود lazy chunk جداگانه‌ای نمی‌بینید، بررسی کنید deferred component را چگونه import کرده‌اید. Import کردن از طریق barrel file یعنی `index.ts` یکی از دلیل‌های رایج است؛ bundlerها barrel را یک module واحد می‌بینند و همه exportهایش را کنار هم نگه می‌دارند، بنابراین component شما بدون توجه به `@defer` در main bundle قرار می‌گیرد.

```typescript
// index.ts
export {HeavyComponent} from './heavy.component';
export {OtherComponent} from './other.component';
```

```typescript
// parent.component.ts
import {HeavyComponent} from './index'; // pulls in OtherComponent too

@Component({
  imports: [HeavyComponent],
  template: `@defer {
    <heavy-component />
  }`,
})
export class ParentComponent {}
```

راه‌حل مستقیم است: از فایل خود component مستقیم import کنید:

```typescript
import {HeavyComponent} from './heavy.component';
```

همین کافی است تا bundler آن را به chunk خودش split کند و وقتی trigger اجرا شد، آن را lazily load کند.

## Best practiceها برای deferred viewها

### از loadهای زنجیره‌ای با blockهای nested مربوط به `@defer` پرهیز کنید

وقتی blockهای nested مربوط به `@defer` دارید، باید triggerهای متفاوتی داشته باشند تا هم‌زمان load نشوند؛ چون این کار باعث requestهای زنجیره‌ای می‌شود و ممکن است روی performance مربوط به page load اثر منفی بگذارد.

### از layout shift پرهیز کنید

از deferred کردن componentهایی که هنگام load اولیه در viewport کاربر visible هستند پرهیز کنید. این کار ممکن است با افزایش cumulative layout shift یا CLS روی Core Web Vitals اثر منفی بگذارد.

اگر این کار ضروری است، از triggerهای `immediate`، `timer`، `viewport` و custom `when` که باعث load شدن content هنگام render اولیه page می‌شوند پرهیز کنید.

### Accessibility را در نظر داشته باشید

هنگام استفاده از blockهای `@defer`، اثر آن را روی کاربرانی که از assistive technologyهایی مثل screen reader استفاده می‌کنند در نظر بگیرید.
Screen readerهایی که روی یک deferred section focus می‌کنند، ابتدا placeholder یا loading content را می‌خوانند، اما ممکن است هنگام load شدن deferred content تغییرات را announce نکنند.

برای اینکه تغییرات deferred content برای screen readerها announce شود، می‌توانید block مربوط به `@defer` را داخل elementی با live region wrap کنید:

```angular-html
<div aria-live="polite" aria-atomic="true">
  @defer (on timer(2000)) {
    <user-profile [user]="currentUser" />
  } @placeholder {
    Loading user profile...
  } @loading {
    Please wait...
  } @error {
    Failed to load profile
  }
</div>
```

این کار مطمئن می‌شود تغییرات هنگام transitionها، یعنی placeholder &rarr; loading &rarr; content/error، به کاربر announce شوند.
