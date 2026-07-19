# نمای کلی Angular elements

_Angular elements_ همان componentهای Angular هستند که به‌صورت _custom element_ بسته‌بندی شده‌اند \(که Web Components هم نامیده می‌شوند\)، یعنی یک استاندارد وب برای تعریف elementهای جدید HTML به‌روشی مستقل از framework.

[Custom elementها](https://developer.mozilla.org/docs/Web/Web_Components/Using_custom_elements) یک قابلیت Web Platform هستند که در همه مرورگرهای پشتیبانی‌شده توسط Angular در دسترس است.
یک custom element با اجازه دادن به شما برای تعریف tagی که محتوایش توسط کد JavaScript ساخته و کنترل می‌شود، HTML را گسترش می‌دهد.
مرورگر یک `CustomElementRegistry` از custom elementهای تعریف‌شده نگه می‌دارد که یک کلاس JavaScript قابل instantiate را به یک tag از HTML map می‌کند.

package مربوط به `@angular/elements` یک API به نام `createCustomElement()` export می‌کند که پلی میان interface مربوط به componentهای Angular و قابلیت change detection آن با API built-in مربوط به DOM فراهم می‌کند.

تبدیل یک component به custom element همه زیرساخت لازم Angular را در اختیار مرورگر قرار می‌دهد.
ساخت custom element ساده و مستقیم است و view تعریف‌شده توسط component شما را به‌صورت خودکار به change detection و data binding وصل می‌کند، و قابلیت‌های Angular را به equivalentهای built-in متناظر در HTML map می‌کند.

## استفاده از custom elementها

Custom elementها خودشان را bootstrap می‌کنند؛ وقتی به DOM اضافه می‌شوند شروع به کار می‌کنند و وقتی از DOM حذف می‌شوند destroy می‌شوند.
وقتی یک custom element به DOM هر page اضافه شود، مثل هر element دیگر HTML دیده و رفتار می‌کند و به دانش ویژه‌ای درباره اصطلاحات Angular یا conventionهای استفاده از آن نیاز ندارد.

برای اضافه کردن package مربوط به `@angular/elements` به workspace خود، command زیر را اجرا کنید:

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install @angular/elements
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add @angular/elements
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add @angular/elements
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add @angular/elements
  </docs-code>
</docs-code-multifile>

### نحوه کار

تابع `createCustomElement()` یک component را به کلاسی تبدیل می‌کند که می‌تواند به‌عنوان custom element در مرورگر register شود.
بعد از اینکه کلاس configure شده خود را در registry مربوط به custom elementهای مرورگر register کردید، از element جدید درست مثل یک element built-in HTML در محتوایی استفاده کنید که مستقیم به DOM اضافه می‌کنید:

```html
<my-popup message="Use Angular!" />
```

وقتی custom element شما روی یک page قرار می‌گیرد، مرورگر یک instance از کلاس register شده می‌سازد و آن را به DOM اضافه می‌کند.
Content توسط template مربوط به component فراهم می‌شود، که از Angular template syntax استفاده می‌کند، و با استفاده از component و داده DOM render می‌شود.
Input propertyهای component با input attributeهای element متناظر هستند.

## تبدیل componentها به custom element

Angular تابع `createCustomElement()` را برای تبدیل یک component Angular، همراه با dependencyهای آن، به یک custom element ارائه می‌دهد.

فرایند conversion، interface مربوط به `NgElementConstructor` را پیاده‌سازی می‌کند و یک کلاس constructor می‌سازد که configure شده تا یک instance self-bootstrapping از component شما تولید کند.

از تابع بومی مرورگر یعنی [`customElements.define()`](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry/define) برای register کردن constructor configure شده و tag مربوط به custom element آن در [`CustomElementRegistry`](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry) مرورگر استفاده کنید.
وقتی مرورگر با tag مربوط به element register شده روبه‌رو می‌شود، از constructor برای ساخت یک instance از custom element استفاده می‌کند.

IMPORTANT: از selector خود component به‌عنوان tag name مربوط به custom element استفاده نکنید.
این کار می‌تواند به رفتار غیرمنتظره منجر شود، چون Angular برای یک DOM element واحد دو instance از component می‌سازد:
یکی component عادی Angular و دومی با استفاده از custom element.

### Mapping

یک custom element، یک component Angular را _host_ می‌کند و پلی میان data و logic تعریف‌شده در component و APIهای استاندارد DOM فراهم می‌کند.
Propertyها و logic مربوط به component مستقیم به attributeهای HTML و سیستم event مرورگر map می‌شوند.

- API مربوط به creation، component را parse می‌کند تا input propertyها را پیدا کند و attributeهای متناظر را برای custom element تعریف کند.
  این API نام propertyها را تبدیل می‌کند تا با custom elementها سازگار شوند، چون custom elementها تمایز case را تشخیص نمی‌دهند.
  نام attributeهای نهایی با حروف کوچک و dash-separated هستند.
  مثلا برای componentی با `inputProp = input({alias: 'myInputProp'})`، custom element متناظر یک attribute به نام `my-input-prop` تعریف می‌کند.

- Outputهای component به‌عنوان [Custom Events](https://developer.mozilla.org/docs/Web/API/CustomEvent) مربوط به HTML dispatch می‌شوند، و نام custom event با نام output برابر است.
  مثلا برای componentی با `valueChanged = output()`، custom element متناظر eventهایی با نام "valueChanged" dispatch می‌کند و داده emit شده روی property مربوط به `detail` در event ذخیره می‌شود.
  اگر alias فراهم کنید، همان مقدار استفاده می‌شود؛ مثلا `clicks = output<string>({alias: 'myClick'});` باعث dispatch شدن eventهایی با نام "myClick" می‌شود.

برای اطلاعات بیشتر، مستندات Web Component درباره [Creating custom events](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events#creating_custom_events) را ببینید.

## مثال: یک Popup Service

برای اضافه کردن یک component به application در runtime، می‌توانید با API مربوط به `createComponent` آن را [به‌صورت برنامه‌نویسی render کنید](guide/components/programmatic-rendering).
با این رویکرد، مسئولیت زیرساخت اطراف با شماست: attach کردن host view مربوط به component به `ApplicationRef` تا change detection اجرا شود، set کردن inputها، subscribe کردن به outputها و detach و cleanup کردن view وقتی component حذف می‌شود.

استفاده از یک custom element در Angular فرایند را ساده‌تر و شفاف‌تر می‌کند، چون همه این زیرساخت را به‌صورت خودکار فراهم می‌کند؛ تنها کاری که باید انجام دهید تعریف نوع event handling موردنیازتان است.

application نمونه Popup Service زیر componentی تعریف می‌کند که می‌توانید آن را یا به‌صورت dynamic load کنید یا به custom element تبدیل کنید.

| Files              | Details                                                                                                                                                                                                                       |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `popup.ts`         | یک pop-up element ساده تعریف می‌کند که یک input message را همراه با مقداری animation و styling نمایش می‌دهد.                                                                                                                  |
| `popup.service.ts` | یک injectable service می‌سازد که دو راه متفاوت برای invoke کردن `Popup` ارائه می‌دهد: به‌عنوان dynamic component یا به‌عنوان custom element. توجه کنید روش dynamic-loading چقدر setup بیشتری نیاز دارد.                   |
| `app.ts`           | component ریشه application را تعریف می‌کند که از `PopupService` برای اضافه کردن pop-up به DOM در run time استفاده می‌کند. وقتی application اجرا می‌شود، constructor مربوط به root component، `Popup` را به custom element تبدیل می‌کند. |

برای مقایسه، demo هر دو روش را نشان می‌دهد.
یک button با روش dynamic-loading، popup را اضافه می‌کند و button دیگر از custom element استفاده می‌کند.
نتیجه یکسان است، اما آماده‌سازی متفاوت است.

<docs-code-multifile>
    <docs-code language="angular-ts" header="popup.ts" path="adev/src/content/examples/elements/src/app/popup.ts"/>
    <docs-code header="popup.service.ts" path="adev/src/content/examples/elements/src/app/popup.service.ts"/>
    <docs-code header="app.ts" path="adev/src/content/examples/elements/src/app/app.ts"/>
</docs-code-multifile>

## Typing برای custom elementها

APIهای عمومی DOM، مثل `document.createElement()` یا `document.querySelector()`، نوع elementی را برمی‌گردانند که برای argumentهای مشخص‌شده مناسب است.
مثلا فراخوانی `document.createElement('a')` یک `HTMLAnchorElement` برمی‌گرداند، و TypeScript می‌داند که این نوع property مربوط به `href` دارد.
به همین شکل، `document.createElement('div')` یک `HTMLDivElement` برمی‌گرداند، و TypeScript می‌داند که این نوع property مربوط به `href` ندارد.

وقتی این methodها با elementهای ناشناخته، مثل نام custom element \(`popup-element` در مثال ما\)، فراخوانی شوند، یک نوع عمومی مثل `HTMLElement` برمی‌گردانند، چون TypeScript نمی‌تواند نوع درست element برگشتی را infer کند.

Custom elementهایی که با Angular ساخته می‌شوند، `NgElement` را extend می‌کنند \(که خودش `HTMLElement` را extend می‌کند\).
علاوه بر این، این custom elementها برای هر input مربوط به component متناظر یک property خواهند داشت.
مثلا `popup-element` ما یک property به نام `message` با نوع `string` دارد.

اگر می‌خواهید typeهای درست برای custom elementهای خود داشته باشید، چند گزینه دارید.
فرض کنید یک custom element به نام `my-dialog` بر اساس component زیر می‌سازید:

```ts
@Component(/* ... */)
class MyDialog {
  content = input('');
}
```

ساده‌ترین راه برای گرفتن typing دقیق این است که مقدار برگشتی methodهای مرتبط DOM را به نوع درست cast کنید.
برای این کار از نوع‌های `NgElement` و `WithProperties` استفاده کنید \(هر دو از `@angular/elements` export می‌شوند\):

```ts
const aDialog = document.createElement('my-dialog') as NgElement &
  WithProperties<{content: string}>;
aDialog.content = 'Hello, world!';
aDialog.content = 123; // <-- ERROR: TypeScript knows this should be a string.
aDialog.body = 'News'; // <-- ERROR: TypeScript knows there is no `body` property on `aDialog`.
```

این روش راه خوبی است تا به‌سرعت قابلیت‌های TypeScript، مثل type checking و پشتیبانی autocomplete، را برای custom element خود داشته باشید.
اما اگر در چند جای مختلف به آن نیاز داشته باشید، می‌تواند دست‌وپاگیر شود، چون باید در هر occurrence نوع برگشتی را cast کنید.

یک راه جایگزین که فقط نیاز دارد نوع هر custom element را یک بار تعریف کنید، augment کردن `HTMLElementTagNameMap` است؛ همان چیزی که TypeScript برای infer کردن نوع element برگشتی بر اساس tag name آن استفاده می‌کند \(برای DOM methodهایی مثل `document.createElement()`، `document.querySelector()` و غیره\):

```ts

declare global {
  interface HTMLElementTagNameMap {
    'my-dialog': NgElement & WithProperties<{content: string}>;
    'my-other-element': NgElement & WithProperties<{foo: 'bar'}>;
    …
  }
}

```

حالا TypeScript می‌تواند نوع درست را همان‌طور که برای elementهای built-in انجام می‌دهد infer کند:

```ts
document.createElement('div'); //--> HTMLDivElement (built-in element)
document.querySelector('foo'); //--> Element        (unknown element)
document.createElement('my-dialog'); //--> NgElement & WithProperties<{content: string}> (custom element)
document.querySelector('my-other-element'); //--> NgElement & WithProperties<{foo: 'bar'}>      (custom element)
```

## محدودیت‌ها

هنگام destroy کردن و سپس attach دوباره custom elementهایی که با `@angular/elements` ساخته شده‌اند باید به‌دلیل مشکلات callback مربوط به [disconnect()](https://github.com/angular/angular/issues/38778) دقت کنید. حالت‌هایی که ممکن است در آن‌ها با این مشکل روبه‌رو شوید عبارت‌اند از:

- Render کردن یک component در `ng-if` یا `ng-repeat` در `AngularJS`
- detach و attach دوباره دستی یک element به DOM
