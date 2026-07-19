# ارجاع به childهای component با queryها

TIP: این راهنما فرض می‌کند که قبلا [راهنمای Essentials](essentials) را خوانده‌اید. اگر با Angular تازه شروع کرده‌اید، اول آن را بخوانید.

یک component می‌تواند **queryهایی** تعریف کند که elementهای child را پیدا می‌کنند و مقدارهایی را از injectorهای آن‌ها می‌خوانند.

توسعه‌دهندگان معمولا از queryها برای گرفتن reference به componentهای child، directiveها، elementهای DOM و موارد دیگر استفاده می‌کنند.

همه query functionها Signalهایی برمی‌گردانند که تازه‌ترین نتایج را منعکس می‌کنند. می‌توانید نتیجه را با فراخوانی تابع Signal بخوانید، از جمله در [reactive contextها](guide/signals#reactive-contexts) مثل `computed` و `effect`.

دو دسته query وجود دارد: **view queryها** و **content queryها.**

## View queryها

View queryها نتیجه‌ها را از elementهای داخل _view_ component بازیابی می‌کنند؛ یعنی elementهایی که در template خود component تعریف شده‌اند. می‌توانید با تابع `viewChild` یک نتیجه تکی query کنید.

```angular-ts {highlight: [14, 15]}
@Component({
  selector: 'custom-card-header',
  /*...*/
})
export class CustomCardHeader {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard {
  header = viewChild(CustomCardHeader);
  headerText = computed(() => this.header()?.text);
}
```

در این مثال، component مربوط به `CustomCard` یک child از نوع `CustomCardHeader` را query می‌کند و از نتیجه آن در یک `computed` استفاده می‌کند.

اگر query نتیجه‌ای پیدا نکند، مقدار آن `undefined` است. این ممکن است زمانی رخ دهد که target element با `@if` hidden شده باشد. Angular نتیجه `viewChild` را با تغییر state مربوط به application شما به‌روز نگه می‌دارد.

همچنین می‌توانید با تابع `viewChildren` چند نتیجه را query کنید.

```angular-ts {highlight: [17]}
@Component({
  selector: 'custom-card-action',
  /*...*/
})
export class CustomCardAction {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: `
    <custom-card-action>Save</custom-card-action>
    <custom-card-action>Cancel</custom-card-action>
  `,
})
export class CustomCard {
  actions = viewChildren(CustomCardAction);
  actionsTexts = computed(() => this.actions().map((action) => action.text));
}
```

`viewChildren` یک Signal با یک `Array` از نتایج query می‌سازد.

**Queryها هرگز از مرزهای component عبور نمی‌کنند.** View queryها فقط می‌توانند نتیجه‌ها را از template همان component بازیابی کنند.

## Content queryها

Content queryها نتیجه‌ها را از elementهای داخل _content_ component بازیابی می‌کنند؛ یعنی elementهایی که در template محل استفاده component، داخل خود component nest شده‌اند. می‌توانید با تابع `contentChild` یک نتیجه تکی query کنید.

```angular-ts {highlight: [14, 15]}
@Component({
  selector: 'custom-toggle',
  /*...*/
})
export class CustomToggle {
  text: string;
}

@Component({
  selector: 'custom-expando',
  /* ... */
})
export class CustomExpando {
  toggle = contentChild(CustomToggle);
  toggleText = computed(() => this.toggle()?.text);
}

@Component({
  /* ... */
  // CustomToggle is used inside CustomExpando as content.
  template: `
    <custom-expando>
      <custom-toggle>Show</custom-toggle>
    </custom-expando>
  `,
})
export class UserProfile {}
```

اگر query نتیجه‌ای پیدا نکند، مقدار آن `undefined` است. این ممکن است زمانی رخ دهد که target element غایب باشد یا با `@if` hidden شده باشد. Angular نتیجه `contentChild` را با تغییر state مربوط به application شما به‌روز نگه می‌دارد.

به‌صورت پیش‌فرض، content queryها فقط childهای _direct_ component را پیدا می‌کنند و وارد descendantها نمی‌شوند.

همچنین می‌توانید با تابع `contentChildren` چند نتیجه را query کنید.

```angular-ts {highlight: [14, 15]}
@Component({
  selector: 'custom-menu-item',
  /*...*/
})
export class CustomMenuItem {
  text: string;
}

@Component({
  selector: 'custom-menu',
  /*...*/
})
export class CustomMenu {
  items = contentChildren(CustomMenuItem);
  itemTexts = computed(() => this.items().map((item) => item.text));
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-menu>
      <custom-menu-item>Cheese</custom-menu-item>
      <custom-menu-item>Tomato</custom-menu-item>
    </custom-menu>
  `,
})
export class UserProfile {}
```

`contentChildren` یک Signal با یک `Array` از نتایج query می‌سازد.

**Queryها هرگز از مرزهای component عبور نمی‌کنند.** Content queryها فقط می‌توانند نتیجه‌ها را از همان template خود component بازیابی کنند.

## Queryهای required

اگر یک child query مثل `viewChild` یا `contentChild` نتیجه‌ای پیدا نکند، مقدار آن `undefined` است. این ممکن است زمانی رخ دهد که target element با statement کنترل flow مثل `@if` یا `@for` hidden شده باشد. به همین دلیل، child queryها Signalی برمی‌گردانند که در نوع مقدار خود شامل `undefined` است.

در بعضی موارد، به‌خصوص با `viewChild`، با قطعیت می‌دانید که یک child مشخص همیشه در دسترس است. در موارد دیگر، ممکن است بخواهید حضور یک child مشخص را به‌صورت سخت‌گیرانه enforce کنید. برای این حالت‌ها می‌توانید از _required query_ استفاده کنید.

```ts
@Component(/* ... */)
export class CustomCard {
  header = viewChild.required(CustomCardHeader);
  body = contentChild.required(CustomCardBody);
}
```

اگر یک required query نتیجه مطابقی پیدا نکند، Angular خطا گزارش می‌دهد. چون این رفتار تضمین می‌کند که یک نتیجه در دسترس است، required queryها به‌صورت خودکار `undefined` را در نوع مقدار Signal وارد نمی‌کنند.

## Locatorهای query

اولین parameter هر query decorator همان **locator** آن است.

بیشتر وقت‌ها می‌خواهید از یک component یا directive به‌عنوان locator استفاده کنید.

همچنین می‌توانید یک string locator متناظر با یک [template reference variable](guide/templates/variables#template-reference-variables) مشخص کنید.

```angular-ts
@Component({
  /*...*/
  template: `
    <button #save>Save</button>
    <button #cancel>Cancel</button>
  `,
})
export class ActionBar {
  saveButton = viewChild<ElementRef<HTMLButtonElement>>('save');
}
```

اگر بیش از یک element یک template reference variable یکسان تعریف کند، query اولین element مطابق را بازیابی می‌کند.

Angular از CSS selectorها به‌عنوان query locator پشتیبانی نمی‌کند.

### Queryها و درخت injector

TIP: برای پیش‌زمینه درباره providerها و injection tree در Angular، [Dependency Injection](guide/di) را ببینید.

برای حالت‌های پیشرفته‌تر، می‌توانید هر `ProviderToken` را به‌عنوان locator استفاده کنید. این به شما اجازه می‌دهد elementها را بر اساس providerهای component و directive پیدا کنید.

```angular-ts
const SUB_ITEM = new InjectionToken<string>('sub-item');

@Component({
  /*...*/
  providers: [{provide: SUB_ITEM, useValue: 'special-item'}],
})
export class SpecialItem {}

@Component(/* ... */)
export class CustomList {
  subItemType = contentChild(SUB_ITEM);
}
```

مثال بالا از یک `InjectionToken` به‌عنوان locator استفاده می‌کند، اما می‌توانید برای locate کردن elementهای مشخص از هر `ProviderToken` استفاده کنید.

## Optionهای query

همه query functionها یک options object به‌عنوان parameter دوم می‌پذیرند. این optionها کنترل می‌کنند query چگونه نتیجه‌های خود را پیدا کند.

### خواندن مقدارهای مشخص از injector یک element

به‌صورت پیش‌فرض، query locator هم elementی را که جست‌وجو می‌کنید مشخص می‌کند و هم مقداری را که بازیابی می‌شود. همچنین می‌توانید option مربوط به `read` را مشخص کنید تا مقدار متفاوتی را از elementی که locator با آن match شده بازیابی کنید.

```ts
@Component(/* ... */)
export class CustomExpando {
  toggle = contentChild(ExpandoContent, {read: TemplateRef});
}
```

مثال بالا elementی را که directive مربوط به `ExpandoContent` دارد locate می‌کند و `TemplateRef` مرتبط با آن element را بازیابی می‌کند.

توسعه‌دهندگان معمولا از `read` برای بازیابی `ElementRef` و `TemplateRef` استفاده می‌کنند.

### Descendantهای content

به‌صورت پیش‌فرض، queryهای `contentChildren` فقط childهای _direct_ component را پیدا می‌کنند و وارد descendantها نمی‌شوند.
Queryهای `contentChild` به‌صورت پیش‌فرض وارد descendantها می‌شوند.

```angular-ts {highlight: [13, 14, 15, 16, 17]}
@Component({
  selector: 'custom-expando',
  /*...*/
})
export class CustomExpando {
  toggle = contentChildren(CustomToggle); // none found
  // toggle = contentChild(CustomToggle); // found
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-expando>
      <some-other-component>
        <custom-toggle>Show</custom-toggle>
      </some-other-component>
    </custom-expando>
  `,
})
export class UserProfile {}
```

در مثال بالا، `CustomExpando` نمی‌تواند با `contentChildren`، `<custom-toggle>` را پیدا کند چون child مستقیم `<custom-expando>` نیست. با تنظیم `descendants: true`، query را طوری configure می‌کنید که همه descendantهای همان template را traverse کند. با این حال، queryها _هرگز_ وارد componentها نمی‌شوند تا elementهای templateهای دیگر را traverse کنند.

View queryها این option را ندارند، چون _همیشه_ وارد descendantها می‌شوند.

## Queryهای مبتنی بر decorator

TIP: با اینکه تیم Angular استفاده از query functionهای signal-based را برای پروژه‌های جدید پیشنهاد می‌کند، APIهای query اصلی مبتنی بر decorator همچنان به‌صورت کامل پشتیبانی می‌شوند.

همچنین می‌توانید queryها را با اضافه کردن decorator متناظر به یک property declare کنید. Queryهای decorator-based مثل queryهای signal-based رفتار می‌کنند، به‌جز مواردی که در ادامه توضیح داده شده‌اند.

### View queryها {#decorator-view-queries}

می‌توانید با decorator مربوط به `@ViewChild` یک نتیجه تکی query کنید.

```angular-ts {highlight: [14, 16, 17, 18]}
@Component({
  selector: 'custom-card-header',
  /*...*/
})
export class CustomCardHeader {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard implements AfterViewInit {
  @ViewChild(CustomCardHeader) header: CustomCardHeader;

  ngAfterViewInit() {
    console.log(this.header.text);
  }
}
```

در این مثال، component مربوط به `CustomCard` یک child از نوع `CustomCardHeader` را query می‌کند و در `ngAfterViewInit` به نتیجه دسترسی پیدا می‌کند.

Angular نتیجه `@ViewChild` را با تغییر state مربوط به application شما به‌روز نگه می‌دارد.

**نتایج view query در lifecycle method مربوط به `ngAfterViewInit` در دسترس قرار می‌گیرند**. قبل از این نقطه، مقدار `undefined` است. برای جزئیات lifecycle component، بخش [Lifecycle](guide/components/lifecycle) را ببینید.

همچنین می‌توانید با decorator مربوط به `@ViewChildren` چند نتیجه را query کنید.

```angular-ts {highlight: [17, 19, 20, 21, 22, 23]}
@Component({
  selector: 'custom-card-action',
  /*...*/
})
export class CustomCardAction {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: `
    <custom-card-action>Save</custom-card-action>
    <custom-card-action>Cancel</custom-card-action>
  `,
})
export class CustomCard implements AfterViewInit {
  @ViewChildren(CustomCardAction) actions: QueryList<CustomCardAction>;

  ngAfterViewInit() {
    this.actions.forEach((action) => {
      console.log(action.text);
    });
  }
}
```

`@ViewChildren` یک object از نوع `QueryList` می‌سازد که نتایج query را شامل می‌شود. می‌توانید از طریق property مربوط به `changes`، به تغییرات نتایج query در طول زمان subscribe کنید.

### Content queryها {#decorator-content-queries}

می‌توانید با decorator مربوط به `@ContentChild` یک نتیجه تکی query کنید.

```angular-ts {highlight: [14, 16, 17, 18]}
@Component({
  selector: 'custom-toggle',
  /*...*/
})
export class CustomToggle {
  text: string;
}

@Component({
  selector: 'custom-expando',
  /*...*/
})
export class CustomExpando implements AfterContentInit {
  @ContentChild(CustomToggle) toggle: CustomToggle;

  ngAfterContentInit() {
    console.log(this.toggle.text);
  }
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-expando>
      <custom-toggle>Show</custom-toggle>
    </custom-expando>
  `,
})
export class UserProfile {}
```

در این مثال، component مربوط به `CustomExpando` یک child از نوع `CustomToggle` را query می‌کند و در `ngAfterContentInit` به نتیجه دسترسی پیدا می‌کند.

Angular نتیجه `@ContentChild` را با تغییر state مربوط به application شما به‌روز نگه می‌دارد.

**نتایج content query در lifecycle method مربوط به `ngAfterContentInit` در دسترس قرار می‌گیرند**. قبل از این نقطه، مقدار `undefined` است. برای جزئیات lifecycle component، بخش [Lifecycle](guide/components/lifecycle) را ببینید.

همچنین می‌توانید با decorator مربوط به `@ContentChildren` چند نتیجه را query کنید.

```angular-ts {highlight: [14, 16, 17, 18, 19, 20]}
@Component({
  selector: 'custom-menu-item',
  /*...*/
})
export class CustomMenuItem {
  text: string;
}

@Component({
  selector: 'custom-menu',
  /*...*/
})
export class CustomMenu implements AfterContentInit {
  @ContentChildren(CustomMenuItem) items: QueryList<CustomMenuItem>;

  ngAfterContentInit() {
    this.items.forEach((item) => {
      console.log(item.text);
    });
  }
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-menu>
      <custom-menu-item>Cheese</custom-menu-item>
      <custom-menu-item>Tomato</custom-menu-item>
    </custom-menu>
  `,
})
export class UserProfile {}
```

`@ContentChildren` یک object از نوع `QueryList` می‌سازد که نتایج query را شامل می‌شود. می‌توانید از طریق property مربوط به `changes`، به تغییرات نتایج query در طول زمان subscribe کنید.

### Optionهای query مبتنی بر decorator

همه query decoratorها یک options object به‌عنوان parameter دوم می‌پذیرند. این optionها مثل queryهای signal-based کار می‌کنند، مگر در مواردی که در ادامه توضیح داده شده‌اند.

### Queryهای static

decoratorهای `@ViewChild` و `@ContentChild` option مربوط به `static` را می‌پذیرند.

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard implements OnInit {
  @ViewChild(CustomCardHeader, {static: true}) header: CustomCardHeader;

  ngOnInit() {
    console.log(this.header.text);
  }
}
```

با تنظیم `static: true`، به Angular تضمین می‌دهید که target این query _همیشه_ حاضر است و به‌صورت شرطی render نمی‌شود. این باعث می‌شود نتیجه زودتر، در lifecycle method مربوط به `ngOnInit`، در دسترس باشد.

نتایج queryهای static بعد از initialization update نمی‌شوند.

option مربوط به `static` برای queryهای `@ViewChildren` و `@ContentChildren` در دسترس نیست.

### استفاده از QueryList

هر دو `@ViewChildren` و `@ContentChildren` یک object از نوع `QueryList` ارائه می‌دهند که فهرستی از نتیجه‌ها را شامل می‌شود.

`QueryList` چند API راحت برای کار با نتیجه‌ها به‌شکل array-like ارائه می‌دهد، مثل `map`، `reduce` و `forEach`. می‌توانید با فراخوانی `toArray` یک array از نتیجه‌های فعلی بگیرید.

می‌توانید به property مربوط به `changes` subscribe کنید تا هر بار نتیجه‌ها تغییر کردند کاری انجام دهید.

## خطاهای رایج query

هنگام استفاده از queryها، چند اشتباه رایج می‌تواند فهم و نگهداری کد را سخت‌تر کند.

همیشه برای state مشترک میان چند component یک single source of truth نگه دارید. این کار از سناریوهایی جلوگیری می‌کند که state تکرارشده در componentهای مختلف از sync خارج می‌شود.

از نوشتن مستقیم state در componentهای child پرهیز کنید. این pattern می‌تواند به کد شکننده‌ای منجر شود که فهمش سخت است و مستعد خطاهای [ExpressionChangedAfterItHasBeenChecked](errors/NG0100) است.

هرگز state را مستقیم در componentهای parent یا ancestor ننویسید. این pattern می‌تواند به کد شکننده‌ای منجر شود که فهمش سخت است و مستعد خطاهای [ExpressionChangedAfterItHasBeenChecked](errors/NG0100) است.
