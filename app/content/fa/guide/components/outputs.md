# رویدادهای سفارشی با outputها

TIP: این راهنما فرض می‌کند که قبلا [راهنمای Essentials](essentials) را خوانده‌اید. اگر با Angular تازه شروع کرده‌اید، اول آن را بخوانید.

Componentهای Angular می‌توانند با اختصاص دادن یک property به تابع `output`، رویدادهای سفارشی تعریف کنند:

```ts {highlight:[5]}
@Component({
  /*...*/
})
export class ExpandablePanel {
  panelClosed = output<void>();
}
```

```angular-html
<expandable-panel (panelClosed)="savePanelState()" />
```

تابع `output` یک `OutputEmitterRef` برمی‌گرداند. می‌توانید با فراخوانی متد `emit` روی `OutputEmitterRef` یک event منتشر کنید:

```ts
this.panelClosed.emit();
```

Angular به propertyهایی که با تابع `output` مقداردهی اولیه می‌شوند **outputs** می‌گوید. می‌توانید از outputها برای ایجاد custom event استفاده کنید، شبیه eventهای بومی مرورگر مثل `click`.

**custom eventهای Angular در DOM بالا نمی‌روند و bubble نمی‌شوند**.

**نام outputها case-sensitive است.**

وقتی یک کلاس component را extend می‌کنید، **outputها توسط کلاس child به ارث برده می‌شوند.**

تابع `output` برای compiler Angular معنای ویژه‌ای دارد. **فقط می‌توانید `output` را در initializer مربوط به propertyهای component و directive فراخوانی کنید.**

## انتشار داده همراه event

هنگام فراخوانی `emit` می‌توانید داده event را هم ارسال کنید:

```ts
// You can emit primitive values.
this.valueChanged.emit(7);

// You can emit custom event objects
this.thumbDropped.emit({
  pointerX: 123,
  pointerY: 456,
});
```

وقتی در template یک event listener تعریف می‌کنید، می‌توانید از طریق متغیر `$event` به داده event دسترسی داشته باشید:

```angular-html
<custom-slider (valueChanged)="logValue($event)" />
```

داده event را در component والد دریافت کنید:

```ts
@Component({
 /*...*/
})
export class App {
  logValue(value: number) {
    ...
  }
}

```

## سفارشی‌سازی نام outputها

تابع `output` پارامتری می‌پذیرد که اجازه می‌دهد نام متفاوتی برای event در template مشخص کنید:

```ts
@Component(/* ... */)
export class CustomSlider {
  changed = output({alias: 'valueChanged'});
}
```

```angular-html
<custom-slider (valueChanged)="saveVolume()" />
```

این alias روی استفاده از property در کد TypeScript اثری ندارد.

با اینکه معمولا بهتر است برای outputهای component از alias استفاده نکنید، این قابلیت می‌تواند برای تغییر نام propertyها همراه با حفظ alias برای نام قبلی، یا برای جلوگیری از collision با نام eventهای بومی DOM مفید باشد.

## subscribe کردن به outputها به‌صورت برنامه‌نویسی

وقتی یک component را به‌صورت dynamic ایجاد می‌کنید، می‌توانید به‌صورت برنامه‌نویسی به output eventهای instance آن component subscribe کنید. نوع `OutputRef` شامل متد `subscribe` است:

```ts
const someComponentRef: ComponentRef<SomeComponent> = viewContainerRef.createComponent(/*...*/);

someComponentRef.instance.someEventProperty.subscribe((eventData) => {
  console.log(eventData);
});
```

Angular وقتی componentهایی را که subscriber دارند destroy می‌کند، subscriptionهای event را به‌صورت خودکار پاک‌سازی می‌کند. همچنین می‌توانید به‌صورت دستی از یک event unsubscribe کنید. تابع `subscribe` یک `OutputRefSubscription` با متد `unsubscribe` برمی‌گرداند:

```ts
const eventSubscription = someComponent.someEventProperty.subscribe((eventData) => {
  console.log(eventData);
});

// ...

eventSubscription.unsubscribe();
```

## انتخاب نام eventها

از انتخاب نام outputهایی که با eventهای elementهای DOM مثل HTMLElement برخورد دارند پرهیز کنید. برخورد نام‌ها باعث ابهام می‌شود که property bind شده متعلق به component است یا element مربوط به DOM.

برای outputهای component مثل selectorهای component prefix اضافه نکنید. از آنجا که یک element مشخص فقط می‌تواند میزبان یک component باشد، می‌توان فرض کرد هر property سفارشی متعلق به همان component است.

همیشه برای نام outputها از [camelCase](https://en.wikipedia.org/wiki/Camel_case) استفاده کنید. از prefix کردن نام outputها با "on" پرهیز کنید.

## استفاده از outputها با RxJS

برای جزئیات interoperability میان outputهای component و directive با RxJS، [RxJS interop with component and directive outputs](ecosystem/rxjs-interop/output-interop) را ببینید.

## تعریف outputها با decorator مربوط به `@Output`

TIP: با اینکه تیم Angular استفاده از تابع `output` را برای پروژه‌های جدید پیشنهاد می‌کند، API اصلی مبتنی بر decorator یعنی `@Output` همچنان به‌صورت کامل پشتیبانی می‌شود.

همچنین می‌توانید custom eventها را با اختصاص دادن یک property به یک `EventEmitter` جدید و اضافه کردن decorator مربوط به `@Output` تعریف کنید:

```ts
@Component(/* ... */)
export class ExpandablePanel {
  @Output() panelClosed = new EventEmitter<void>();
}
```

می‌توانید با فراخوانی متد `emit` روی `EventEmitter` یک event منتشر کنید.

### Aliasها با decorator مربوط به `@Output`

decorator مربوط به `@Output` پارامتری می‌پذیرد که اجازه می‌دهد نام متفاوتی برای event در template مشخص کنید:

```ts
@Component(/* ... */)
export class CustomSlider {
  @Output('valueChanged') changed = new EventEmitter<number>();
}
```

```angular-html
<custom-slider (valueChanged)="saveVolume()" />
```

این alias روی استفاده از property در کد TypeScript اثری ندارد.

## مشخص کردن outputها در decorator مربوط به `@Component`

علاوه بر decorator مربوط به `@Output`، می‌توانید outputهای یک component را با property مربوط به `outputs` در decorator مربوط به `@Component` هم مشخص کنید. این کار زمانی مفید است که یک component یک property را از کلاس پایه به ارث می‌برد:

```ts
// `CustomSlider` inherits the `valueChanged` property from `BaseSlider`.
@Component({
  /*...*/
  outputs: ['valueChanged'],
})
export class CustomSlider extends BaseSlider {}
```

همچنین می‌توانید با قرار دادن alias بعد از یک دونقطه در string، یک alias برای output در فهرست `outputs` مشخص کنید:

```ts
// `CustomSlider` inherits the `valueChanged` property from `BaseSlider`.
@Component({
  /*...*/
  outputs: ['valueChanged: volumeChanged'],
})
export class CustomSlider extends BaseSlider {}
```
