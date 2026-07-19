# دریافت داده با input propertyها

TIP: این راهنما فرض می‌کند که قبلا [راهنمای Essentials](essentials) را خوانده‌اید. اگر با Angular تازه شروع کرده‌اید، اول آن را بخوانید.

TIP: اگر با frameworkهای وب دیگر آشنا هستید، input propertyها شبیه _props_ هستند.

وقتی از یک component استفاده می‌کنید، معمولا می‌خواهید مقداری داده به آن پاس بدهید. یک component داده‌هایی را که می‌پذیرد با declare کردن **inputها** مشخص می‌کند:

```ts {highlight:[6]}
import {Component, input} from '@angular/core';

@Component(/* ... */)
export class CustomSlider {
  // Declare an input named 'value' with a default value of zero.
  value = input(0);
}
```

این کار اجازه می‌دهد در template به آن property bind کنید:

```angular-html
<custom-slider [value]="50" />
```

اگر یک input مقدار پیش‌فرض داشته باشد، TypeScript نوع را از همان مقدار پیش‌فرض infer می‌کند:

```ts
@Component(/* ... */)
export class CustomSlider {
  // TypeScript infers that this input is a number, returning InputSignal<number>.
  value = input(0);
}
```

می‌توانید با مشخص کردن یک generic parameter برای تابع، نوع input را به‌صورت explicit declare کنید.

اگر inputی بدون مقدار پیش‌فرض set نشود، مقدار آن `undefined` است:

```ts
@Component(/* ... */)
export class CustomSlider {
  // Produces an InputSignal<number | undefined> because `value` may not be set.
  value = input<number>();
}
```

**Angular inputها را به‌صورت static و در compile-time ثبت می‌کند**. Inputها را نمی‌توان در run-time اضافه یا حذف کرد.

تابع `input` برای compiler Angular معنای ویژه‌ای دارد. **فقط می‌توانید `input` را در initializer مربوط به propertyهای component و directive فراخوانی کنید.**

وقتی یک کلاس component را extend می‌کنید، **inputها توسط کلاس child به ارث برده می‌شوند.**

**نام inputها case-sensitive است.**

## خواندن inputها

تابع `input` یک `InputSignal` برمی‌گرداند. می‌توانید مقدار را با فراخوانی Signal بخوانید:

```ts {highlight:[9]}
import {Component, input, computed} from '@angular/core';

@Component(/* ... */)
export class CustomSlider {
  // Declare an input named 'value' with a default value of zero.
  value = input(0);

  // Create a computed expression that reads the value input
  label = computed(() => `The slider's value is ${this.value()}`);
}
```

Signalهایی که تابع `input` می‌سازد read-only هستند.

## inputهای required

می‌توانید با فراخوانی `input.required` به‌جای `input` اعلام کنید که یک input الزامی است:

```ts {highlight:[4]}
@Component(/* ... */)
export class CustomSlider {
  // Declare a required input named value. Returns an `InputSignal<number>`.
  value = input.required<number>();
}
```

Angular enforce می‌کند که inputهای required هنگام استفاده از component در template _حتما_ set شده باشند. اگر تلاش کنید componentی را بدون مشخص کردن همه inputهای required آن استفاده کنید، Angular در build-time خطا گزارش می‌دهد.

Inputهای required به‌صورت خودکار `undefined` را در generic parameter مربوط به `InputSignal` برگشتی وارد نمی‌کنند.

## پیکربندی inputها

تابع `input` یک config object به‌عنوان پارامتر دوم می‌پذیرد که اجازه می‌دهد رفتار آن input را تغییر دهید.

### Transformهای input

می‌توانید یک تابع `transform` مشخص کنید تا وقتی Angular مقدار یک input را set می‌کند، آن مقدار تغییر داده شود.

```ts {highlight:[6]}
@Component({
  selector: 'custom-slider',
  /*...*/
})
export class CustomSlider {
  label = input('', {transform: trimString});
}

function trimString(value: string | undefined): string {
  return value?.trim() ?? '';
}
```

```angular-html
<custom-slider [label]="systemVolume" />
```

در مثال بالا، هر بار مقدار `systemVolume` تغییر کند، Angular تابع `trimString` را اجرا می‌کند و `label` را روی نتیجه آن قرار می‌دهد.

رایج‌ترین کاربرد input transformها این است که در templateها طیف گسترده‌تری از نوع‌های مقدار پذیرفته شود، معمولا شامل `null` و `undefined`.

**تابع input transform باید در build-time به‌صورت static قابل تحلیل باشد.** نمی‌توانید تابع‌های transform را به‌صورت شرطی یا به‌عنوان نتیجه evaluate شدن یک expression تنظیم کنید.

**تابع‌های input transform باید همیشه [pure functions](https://en.wikipedia.org/wiki/Pure_function) باشند.** تکیه بر state بیرون از تابع transform می‌تواند به رفتار غیرقابل پیش‌بینی منجر شود.

#### Type checking

وقتی یک input transform مشخص می‌کنید، نوع پارامتر تابع transform تعیین می‌کند چه نوع مقدارهایی می‌توانند در template روی input set شوند.

```ts
@Component(/* ... */)
export class CustomSlider {
  widthPx = input('', {transform: appendPx});
}

function appendPx(value: number): string {
  return `${value}px`;
}
```

در مثال بالا، input مربوط به `widthPx` یک `number` می‌پذیرد، در حالی که property مربوط به `InputSignal` یک `string` برمی‌گرداند.

#### Transformهای built-in

Angular برای دو سناریوی بسیار رایج، دو تابع transform built-in دارد: coercion مقدارها به boolean و number.

```ts
import {Component, input, booleanAttribute, numberAttribute} from '@angular/core';

@Component(/* ... */)
export class CustomSlider {
  disabled = input(false, {transform: booleanAttribute});
  value = input(0, {transform: numberAttribute});
}
```

`booleanAttribute` رفتار [boolean attributeهای](https://developer.mozilla.org/docs/Glossary/Boolean/HTML) استاندارد HTML را تقلید می‌کند؛ جایی که _وجود_ attribute نشان‌دهنده مقدار "true" است. با این حال، `booleanAttribute` در Angular string literal مربوط به `"false"` را به‌عنوان boolean برابر با `false` در نظر می‌گیرد.

`numberAttribute` تلاش می‌کند مقدار داده‌شده را به number parse کند و اگر parsing شکست بخورد، `NaN` تولید می‌کند.

### Aliasهای input

می‌توانید option مربوط به `alias` را مشخص کنید تا نام input در templateها تغییر کند.

```ts {highlight:[3]}
@Component(/* ... */)
export class CustomSlider {
  value = input(0, {alias: 'sliderValue'});
}
```

```angular-html
<custom-slider [sliderValue]="50" />
```

این alias روی استفاده از property در کد TypeScript اثری ندارد.

با اینکه معمولا بهتر است برای inputهای component از alias استفاده نکنید، این قابلیت می‌تواند برای تغییر نام propertyها همراه با حفظ alias برای نام قبلی، یا برای جلوگیری از collision با نام propertyهای elementهای بومی DOM مفید باشد.

## Model inputها

**Model inputها** نوع ویژه‌ای از input هستند که به یک component اجازه می‌دهند مقدارهای جدید را دوباره به component والد propagate کند.

وقتی یک component می‌سازید، می‌توانید model input را شبیه ساختن یک input استاندارد تعریف کنید.

هر دو نوع input اجازه می‌دهند کسی مقداری را داخل property bind کند. اما **model inputها به نویسنده component اجازه می‌دهند داخل property مقدار بنویسد**. اگر property با two-way binding bind شده باشد، مقدار جدید به همان binding propagate می‌شود.

```ts
@Component(/* ... */)
export class CustomSlider {
  // Define a model input named "value".
  value = model(0);

  increment() {
    // Update the model input with a new value, propagating the value to any bindings.
    this.value.update((oldValue) => oldValue + 10);
  }
}

@Component({
  /* ... */
  // Using the two-way binding syntax means that any changes to the slider's
  // value automatically propagate back to the `volume` signal.
  // Note that this binding uses the signal *instance*, not the signal value.
  template: `<custom-slider [(value)]="volume" />`,
})
export class MediaControls {
  // Create a writable signal for the `volume` local state.
  volume = signal(0);
}
```

در مثال بالا، `CustomSlider` می‌تواند داخل model input مربوط به `value` مقدار بنویسد، و این مقدارها سپس به Signal مربوط به `volume` در `MediaControls` propagate می‌شوند. این binding مقدارهای `value` و `volume` را sync نگه می‌دارد. توجه کنید که binding، instance مربوط به Signal به نام `volume` را پاس می‌دهد، نه _مقدار_ Signal را.

از جنبه‌های دیگر، model inputها شبیه inputهای استاندارد کار می‌کنند. می‌توانید مقدار را با فراخوانی تابع Signal بخوانید، از جمله در [reactive contextها](guide/signals#reactive-contexts) مثل `computed` و `effect`.

برای جزئیات بیشتر درباره two-way binding در templateها، [Two-way binding](guide/templates/two-way-binding) را ببینید.

### Two-way binding با propertyهای ساده

می‌توانید یک property ساده JavaScript را به model input bind کنید.

```angular-ts
@Component({
  /* ... */
  // `value` is a model input.
  // The parenthesis-inside-square-brackets syntax (aka "banana-in-a-box") creates a two-way binding
  template: '<custom-slider [(value)]="volume" />',
})
export class MediaControls {
  protected volume = 0;
}
```

در مثال بالا، `CustomSlider` می‌تواند داخل model input مربوط به `value` مقدار بنویسد، و این مقدارها سپس به property مربوط به `volume` در `MediaControls` propagate می‌شوند. این binding مقدارهای `value` و `volume` را sync نگه می‌دارد.

### eventهای ضمنی `change`

وقتی در یک component یا directive یک model input declare می‌کنید، Angular به‌صورت خودکار یک [output](guide/components/outputs) متناظر برای آن model ایجاد می‌کند. نام output برابر است با نام model input به‌علاوه suffix مربوط به "Change".

```ts
@Directive(/* ... */)
export class CustomCheckbox {
  // This automatically creates an output named "checkedChange".
  // Can be subscribed to using `(checkedChange)="handler()"` in the template.
  checked = model(false);
}
```

Angular هر بار که با فراخوانی متدهای `set` یا `update` یک مقدار جدید داخل model input می‌نویسید، این change event را emit می‌کند.

برای جزئیات بیشتر درباره outputها، [Custom events with outputs](guide/components/outputs) را ببینید.

### سفارشی‌سازی model inputها

می‌توانید یک model input را مثل یک [input استاندارد](guide/components/inputs) به‌عنوان required علامت‌گذاری کنید یا برای آن alias فراهم کنید.

Model inputها از input transform پشتیبانی نمی‌کنند.

### چه زمانی از model input استفاده کنیم

وقتی می‌خواهید یک component از two-way binding پشتیبانی کند، از model inputها استفاده کنید. این معمولا زمانی مناسب است که یک component برای تغییر دادن یک مقدار بر اساس تعامل کاربر وجود دارد. رایج‌ترین نمونه، custom form controlها مثل date picker یا combobox هستند که باید برای مقدار اصلی خود از model input استفاده کنند.

## انتخاب نام inputها

از انتخاب نام inputهایی که با propertyهای elementهای DOM مثل HTMLElement برخورد دارند پرهیز کنید. برخورد نام‌ها باعث ابهام می‌شود که property bind شده متعلق به component است یا element مربوط به DOM.

برای inputهای component مثل selectorهای component prefix اضافه نکنید. از آنجا که یک element مشخص فقط می‌تواند میزبان یک component باشد، می‌توان فرض کرد هر property سفارشی متعلق به همان component است.

## تعریف inputها با decorator مربوط به `@Input`

TIP: با اینکه تیم Angular استفاده از تابع signal-based مربوط به `input` را برای پروژه‌های جدید پیشنهاد می‌کند، API اصلی مبتنی بر decorator یعنی `@Input` همچنان به‌صورت کامل پشتیبانی می‌شود.

همچنین می‌توانید inputهای component را با اضافه کردن decorator مربوط به `@Input` به یک property declare کنید:

```ts {highlight:[3]}
@Component(/* ... */)
export class CustomSlider {
  @Input() value = 0;
}
```

Binding به یک input در inputهای signal-based و decorator-based یکسان است:

```angular-html
<custom-slider [value]="50" />
```

### سفارشی‌سازی inputهای decorator-based

decorator مربوط به `@Input` یک config object می‌پذیرد که اجازه می‌دهد رفتار آن input را تغییر دهید.

#### inputهای required

می‌توانید option مربوط به `required` را مشخص کنید تا enforce شود که یک input مشخص همیشه مقدار داشته باشد.

```ts {highlight:[3]}
@Component(/* ... */)
export class CustomSlider {
  @Input({required: true}) value = 0;
}
```

اگر تلاش کنید componentی را بدون مشخص کردن همه inputهای required آن استفاده کنید، Angular در build-time خطا گزارش می‌دهد.

#### Transformهای input

می‌توانید یک تابع `transform` مشخص کنید تا وقتی Angular مقدار یک input را set می‌کند، آن مقدار تغییر داده شود. این تابع transform دقیقا مثل تابع‌های transform برای inputهای signal-based که بالاتر توضیح داده شد کار می‌کند.

```ts {highlight:[6]}
@Component({
  selector: 'custom-slider',
  ...
})
export class CustomSlider {
  @Input({transform: trimString}) label = '';
}

function trimString(value: string | undefined) {
  return value?.trim() ?? '';
}
```

#### Aliasهای input

می‌توانید option مربوط به `alias` را مشخص کنید تا نام input در templateها تغییر کند.

```ts {highlight:[3]}
@Component(/* ... */)
export class CustomSlider {
  @Input({alias: 'sliderValue'}) value = 0;
}
```

```angular-html
<custom-slider [sliderValue]="50" />
```

decorator مربوط به `@Input` همچنین alias را به‌جای config object، به‌عنوان پارامتر اول می‌پذیرد.

Aliasهای input مثل inputهای signal-based که بالاتر توضیح داده شدند کار می‌کنند.

### Inputها با getter و setter

وقتی از inputهای decorator-based استفاده می‌کنید، propertyای که با getter و setter پیاده‌سازی شده باشد می‌تواند input باشد:

```ts
export class CustomSlider {
  @Input()
  get value(): number {
    return this.internalValue;
  }

  set value(newValue: number) {
    this.internalValue = newValue;
  }

  private internalValue = 0;
}
```

حتی می‌توانید با تعریف کردن فقط یک setter عمومی، یک input _write-only_ بسازید:

```ts
export class CustomSlider {
  @Input()
  set value(newValue: number) {
    this.internalValue = newValue;
  }

  private internalValue = 0;
}
```

**در صورت امکان، به‌جای getter و setter از input transformها استفاده کنید.**

از getter و setterهای پیچیده یا پرهزینه پرهیز کنید. Angular ممکن است setter مربوط به یک input را چندین بار invoke کند، و اگر setter رفتارهای پرهزینه‌ای مثل DOM manipulation انجام دهد، این می‌تواند روی performance application اثر منفی بگذارد.

## مشخص کردن inputها در decorator مربوط به `@Component`

علاوه بر decorator مربوط به `@Input`، می‌توانید inputهای یک component را با property مربوط به `inputs` در decorator مربوط به `@Component` هم مشخص کنید. این کار زمانی مفید است که یک component یک property را از کلاس پایه به ارث می‌برد:

```ts {highlight:[4]}
// `CustomSlider` inherits the `disabled` property from `BaseSlider`.
@Component({
  ...,
  inputs: ['disabled'],
})
export class CustomSlider extends BaseSlider { }
```

همچنین می‌توانید با قرار دادن alias بعد از یک دونقطه در string، یک alias برای input در فهرست `inputs` مشخص کنید:

```ts {highlight:[4]}
// `CustomSlider` inherits the `disabled` property from `BaseSlider`.
@Component({
  ...,
  inputs: ['disabled: sliderDisabled'],
})
export class CustomSlider extends BaseSlider { }
```
