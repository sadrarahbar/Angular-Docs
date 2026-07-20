# Incremental Hydration

**Incremental hydration** نوع پیشرفته‌ای از [hydration](guide/hydration) است که می‌تواند بخش‌هایی از application شما را dehydrated نگه دارد و hydration آن بخش‌ها را وقتی لازم شدند به‌صورت _incremental_ trigger کند.

## چرا از incremental hydration استفاده کنیم؟

Incremental hydration یک بهبود performance است که روی full application hydration ساخته می‌شود. این روش می‌تواند bundleهای اولیه‌ی کوچک‌تری تولید کند و در عین حال تجربه‌ی end-user را نزدیک به تجربه‌ی full application hydration نگه دارد. bundleهای کوچک‌تر initial load time را بهتر می‌کنند و [First Input Delay (FID)](https://web.dev/fid) و [Cumulative Layout Shift (CLS)](https://web.dev/cls) را کاهش می‌دهند.

Incremental hydration همچنین اجازه می‌دهد از deferrable viewها، یعنی `@defer`، برای محتوایی استفاده کنید که شاید قبلا قابل defer کردن نبود. مشخصا، حالا می‌توانید از deferrable viewها برای محتوای above the fold استفاده کنید. قبل از incremental hydration، قرار دادن یک block از نوع `@defer` در above the fold باعث می‌شد placeholder content render شود و بعد با محتوای main template مربوط به block `@defer` جایگزین شود. این باعث layout shift می‌شد. Incremental hydration یعنی main template مربوط به block `@defer` هنگام hydration بدون layout shift render می‌شود.

## چطور incremental hydration را در Angular فعال کنیم؟

می‌توانید incremental hydration را برای applicationهایی فعال کنید که از قبل از server-side rendering یا SSR همراه با hydration استفاده می‌کنند. ابتدا [Angular SSR Guide](guide/ssr) را برای فعال کردن server-side rendering و [Angular Hydration Guide](guide/hydration) را برای فعال کردن hydration دنبال کنید.

وقتی از `provideClientHydration()` استفاده می‌کنید، incremental hydration به‌صورت پیش‌فرض فعال است.

```ts
import {bootstrapApplication, provideClientHydration} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [provideClientHydration()],
});
```

NOTE: Incremental Hydration به [event replay](guide/hydration#capturing-and-replaying-events) وابسته است و آن را به‌صورت خودکار فعال می‌کند. اگر از قبل `withEventReplay()` را در فهرست خود دارید، می‌توانید با خیال راحت آن را حذف کنید.

برای opt out کردن از incremental hydration، از `withNoIncrementalHydration()` استفاده کنید:

```ts
import {
  bootstrapApplication,
  provideClientHydration,
  withNoIncrementalHydration,
} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [provideClientHydration(withNoIncrementalHydration())],
});
```

## Incremental hydration چطور کار می‌کند؟

Incremental hydration روی [hydration](guide/hydration) کل application، [deferrable views](/guide/templates/defer) و [event replay](guide/hydration#capturing-and-replaying-events) ساخته می‌شود. با incremental hydration می‌توانید triggerهای اضافی به blockهای `@defer` اضافه کنید که boundaryهای incremental hydration را تعریف می‌کنند. اضافه کردن trigger از نوع `hydrate` به یک defer block به Angular می‌گوید هنگام server-side rendering dependencyهای آن defer block را load کند و main template را به‌جای `@placeholder` render کند. هنگام client-side rendering، dependencyها همچنان deferred می‌مانند و محتوای defer block تا وقتی trigger مربوط به `hydrate` اجرا شود dehydrated باقی می‌ماند. آن trigger به defer block می‌گوید dependencyهایش را fetch کند و محتوا را hydrate کند. هر browser event، مخصوصا eventهایی که با listenerهای registerشده در component شما match هستند، اگر پیش از hydration توسط کاربر trigger شوند، queue می‌شوند و بعد از کامل شدن hydration process replay می‌شوند.

## کنترل hydration محتوا با triggerها

می‌توانید **hydrate trigger**هایی مشخص کنید که کنترل می‌کنند Angular چه زمانی deferred content را load و hydrate کند. این‌ها triggerهای اضافی هستند که می‌توانند کنار triggerهای معمولی `@defer` استفاده شوند.

هر block از نوع `@defer` می‌تواند چند hydrate event trigger داشته باشد که با semicolon یعنی `;` جدا شده‌اند. Angular وقتی _هر کدام_ از triggerها اجرا شود hydration را trigger می‌کند.

سه نوع hydrate trigger وجود دارد: `hydrate on`، `hydrate when` و `hydrate never`.

### `hydrate on`

`hydrate on` شرطی را مشخص می‌کند که hydration برای block مربوط به `@defer` چه زمانی trigger شود.

triggerهای در دسترس:

| Trigger | توضیح |
| ------- | ----- |
| [`hydrate on idle`](#hydrate-on-idle) | وقتی browser idle است trigger می‌شود. از timeout اختیاری پشتیبانی می‌کند. |
| [`hydrate on viewport`](#hydrate-on-viewport) | وقتی محتوای مشخص وارد viewport می‌شود trigger می‌شود. |
| [`hydrate on interaction`](#hydrate-on-interaction) | وقتی کاربر با element مشخص تعامل می‌کند trigger می‌شود. |
| [`hydrate on hover`](#hydrate-on-hover) | وقتی mouse روی area مشخص hover می‌کند trigger می‌شود. |
| [`hydrate on immediate`](#hydrate-on-immediate) | بلافاصله بعد از تمام شدن rendering محتوای non-deferred trigger می‌شود. |
| [`hydrate on timer`](#hydrate-on-timer) | بعد از duration مشخص trigger می‌شود. |

#### `hydrate on idle`

trigger مربوط به `hydrate on idle`، dependencyهای deferrable view را load می‌کند و وقتی browser بر اساس `requestIdleCallback` به idle state رسید، محتوا را hydrate می‌کند.

می‌توانید timeout اختیاری بر حسب millisecond مشخص کنید که به [`requestIdleCallback`](https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback) پاس داده می‌شود. اگر browser callback را به‌اندازه‌ی کافی زود schedule نکند، کار حداکثر تا timeout مشخص‌شده اجرا می‌شود.

```angular-html
@defer (hydrate on idle) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}

<!-- With a 500ms timeout -->
@defer (hydrate on idle(500)) {
  <large-cmp />
}
```

#### `hydrate on viewport`

trigger مربوط به `hydrate on viewport`، dependencyهای deferrable view را load می‌کند و وقتی محتوای متناظر وارد viewport شود، صفحه‌ی مربوط از app را با استفاده از [Intersection Observer API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) hydrate می‌کند.

```angular-html
@defer (hydrate on viewport) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on interaction`

trigger مربوط به `hydrate on interaction`، dependencyهای deferrable view را load می‌کند و وقتی کاربر از طریق eventهای `click` یا `keydown` با element مشخص تعامل کند محتوا را hydrate می‌کند.

```angular-html
@defer (hydrate on interaction) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on hover`

trigger مربوط به `hydrate on hover`، dependencyهای deferrable view را load می‌کند و وقتی mouse از طریق eventهای `mouseover` و `focusin` روی area triggerشده hover کند، محتوا را hydrate می‌کند.

```angular-html
@defer (hydrate on hover) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on immediate`

trigger مربوط به `hydrate on immediate`، dependencyهای deferrable view را load می‌کند و محتوا را بلافاصله hydrate می‌کند. یعنی deferred block به محض اینکه همه‌ی محتوای non-deferred دیگر rendering را تمام کرد load می‌شود.

```angular-html
@defer (hydrate on immediate) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on timer`

trigger مربوط به `hydrate on timer`، dependencyهای deferrable view را load می‌کند و محتوا را بعد از یک duration مشخص hydrate می‌کند.

```angular-html
@defer (hydrate on timer(500ms)) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

پارامتر duration باید بر حسب millisecond یعنی `ms` یا second یعنی `s` مشخص شود.

### `hydrate when`

trigger مربوط به `hydrate when` یک conditional expression سفارشی می‌پذیرد و وقتی condition truthy شود، dependencyهای deferrable view را load و محتوا را hydrate می‌کند.

```angular-html
@defer (hydrate when condition) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

NOTE: conditionهای `hydrate when` فقط وقتی trigger می‌شوند که top-most dehydrated `@defer` block باشند. condition ارائه‌شده برای trigger در parent component مشخص می‌شود و آن component باید قبل از trigger شدن وجود داشته باشد. اگر parent block dehydrated باشد، آن expression هنوز برای Angular قابل resolve نیست.

### `hydrate never`

`hydrate never` به کاربران اجازه می‌دهد مشخص کنند محتوای داخل defer block به‌صورت نامحدود dehydrated بماند و عملا به static content تبدیل شود. توجه کنید این فقط روی render اولیه اعمال می‌شود. در renderهای client-side بعدی، block مربوط به `@defer` با `hydrate never` همچنان dependencyها را fetch می‌کند، چون hydration فقط روی initial load محتوای server-side rendered اعمال می‌شود. در مثال زیر، renderهای client-side بعدی dependencyهای block مربوط به `@defer` را on viewport load می‌کنند.

```angular-html
@defer (on viewport; hydrate never) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

NOTE: استفاده از `hydrate never` جلوی hydration کل nested subtree مربوط به یک block مشخص `@defer` را می‌گیرد. هیچ trigger دیگری از نوع `hydrate` برای محتوای nested زیر آن block اجرا نمی‌شود.

## Hydrate triggerها کنار triggerهای معمولی

Hydrate triggerها triggerهای اضافی هستند که کنار triggerهای معمولی روی یک block از نوع `@defer` استفاده می‌شوند. Hydration یک optimization برای initial load است، یعنی hydrate triggerها فقط روی همان initial load اعمال می‌شوند. هر render client-side بعدی همچنان از trigger معمولی استفاده می‌کند.

```angular-html
@defer (on idle; hydrate on interaction) {
  <example-cmp />
} @placeholder {
  <div>Example Placeholder</div>
}
```

در این مثال، در initial load، `hydrate on interaction` اعمال می‌شود. hydration هنگام interaction با component مربوط به `<example-cmp />` trigger می‌شود. در هر page load بعدی که client-side rendered باشد، مثلا وقتی کاربر روی یک routerLink کلیک می‌کند که صفحه‌ای با این component را load می‌کند، `on idle` اعمال می‌شود.

## Incremental hydration با blockهای nested `@defer` چطور کار می‌کند؟

سیستم component و dependency در Angular hierarchical است، یعنی hydrate کردن هر component نیاز دارد همه‌ی parentهای آن هم hydrated باشند. پس اگر hydration برای یک child `@defer` block از مجموعه‌ای تو در تو از blockهای dehydrated `@defer` trigger شود، hydration از top-most dehydrated `@defer` block تا child triggerشده آغاز می‌شود و به همان ترتیب اجرا می‌شود.

```angular-html
@defer (hydrate on interaction) {
  <parent-block-cmp />
  @defer (hydrate on hover) {
    <child-block-cmp />
  } @placeholder {
    <div>Child placeholder</div>
  }
} @placeholder {
  <div>Parent Placeholder</div>
}
```

در مثال بالا، hover کردن روی nested `@defer` block، hydration را trigger می‌کند. ابتدا parent `@defer` block همراه با `<parent-block-cmp />` hydrate می‌شود، سپس child `@defer` block همراه با `<child-block-cmp />` بعد از آن hydrate می‌شود.

## Constraints

Incremental hydration همان constraintهای full-application hydration را دارد، از جمله محدودیت‌های مربوط به direct DOM manipulation و نیاز به ساختار HTML معتبر. برای جزئیات بیشتر، بخش [Hydration guide constraints](guide/hydration#constraints) را ببینید.

## آیا هنوز باید blockهای `@placeholder` را مشخص کنم؟

بله. محتوای block مربوط به `@placeholder` برای incremental hydration استفاده نمی‌شود، اما برای موارد بعدی client-side rendering همچنان وجود `@placeholder` لازم است. اگر محتوای شما روی routeای نبوده که بخشی از initial load بوده است، هر navigation به routeای که محتوای block مربوط به `@defer` شما را دارد مثل یک block معمولی `@defer` render می‌شود. بنابراین در آن حالت‌های client-side rendering، `@placeholder` render می‌شود.
