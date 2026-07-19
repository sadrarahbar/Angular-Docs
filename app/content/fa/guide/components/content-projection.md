# Content projection با ng-content

TIP: این راهنما فرض می‌کند که قبلا [راهنمای Essentials](essentials) را خوانده‌اید. اگر با Angular تازه شروع کرده‌اید، اول آن را بخوانید.

اغلب لازم است componentهایی بسازید که مثل container برای انواع مختلف محتوا عمل کنند. مثلا ممکن است بخواهید یک component کارت سفارشی بسازید:

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <!-- card content goes here --> </div>',
})
export class CustomCard {
  /* ... */
}
```

**می‌توانید از element مربوط به `<ng-content>` به‌عنوان placeholder استفاده کنید تا مشخص کنید محتوا باید کجا قرار بگیرد**:

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <ng-content/> </div>',
})
export class CustomCard {
  /* ... */
}
```

TIP: `<ng-content>` شبیه [element بومی `<slot>`](https://developer.mozilla.org/docs/Web/HTML/Element/slot) کار می‌کند، اما چند قابلیت مخصوص Angular هم دارد.

وقتی componentی با `<ng-content>` استفاده می‌کنید، هر child مربوط به host element آن component در محل همان `<ng-content>` render یا **project** می‌شود:

```angular-ts
// Component source
@Component({
  selector: 'custom-card',
  template: `
    <div class="card-shadow">
      <ng-content />
    </div>
  `,
})
export class CustomCard {
  /* ... */
}
```

```angular-html
<!-- Using the component -->
<custom-card>
  <p>This is the projected content</p>
</custom-card>
```

```angular-html
<!-- The rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <p>This is the projected content</p>
  </div>
</custom-card>
```

Angular به هر child که به این شکل به یک component پاس داده شود **content** آن component می‌گوید. این با **view** component فرق دارد؛ view به elementهایی اشاره می‌کند که در template خود component تعریف شده‌اند.

**element مربوط به `<ng-content>` نه component است و نه element مربوط به DOM**. در عوض، یک placeholder ویژه است که به Angular می‌گوید محتوا را کجا render کند. compiler Angular همه elementهای `<ng-content>` را در build-time پردازش می‌کند. نمی‌توانید در runtime یک `<ng-content>` را insert، remove یا modify کنید. همچنین نمی‌توانید directive، style یا attribute دلخواه به `<ng-content>` اضافه کنید.

IMPORTANT: نباید `<ng-content>` را با `@if`، `@for` یا `@switch` به‌صورت شرطی include کنید. Angular همیشه DOM nodeهای مربوط به محتوایی را که در یک placeholder از نوع `<ng-content>` render می‌شود instantiate و create می‌کند، حتی اگر آن placeholder مربوط به `<ng-content>` hidden باشد. برای render شرطی محتوای component، [Template fragments](api/core/ng-template) را ببینید.

## چند placeholder برای content

Angular از project کردن چند element متفاوت در placeholderهای متفاوت `<ng-content>` بر اساس CSS selector پشتیبانی می‌کند. اگر مثال کارت بالا را گسترش دهید، می‌توانید با استفاده از attribute مربوط به `select`، دو placeholder برای عنوان کارت و بدنه کارت بسازید:

```angular-ts
@Component({
  selector: 'card-title',
  template: `<ng-content>card-title</ng-content>`,
})
export class CardTitle {}

@Component({
  selector: 'card-body',
  template: `<ng-content>card-body</ng-content>`,
})
export class CardBody {}
```

```angular-ts
<!-- Component template -->
@Component({
  selector: 'custom-card',
  template: `
  <div class="card-shadow">
    <ng-content select="card-title" />
    <div class="card-divider"></div>
    <ng-content select="card-body" />
  </div>
  `,
})
export class CustomCard {}
```

```angular-ts
<!-- Using the component -->
@Component({
  selector: 'app-root',
  imports: [CustomCard, CardTitle, CardBody],
  template: `
    <custom-card>
      <card-title>Hello</card-title>
      <card-body>Welcome to the example</card-body>
    </custom-card>
`,
})
export class App {}
```

```angular-html
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    <card-body>Welcome to the example</card-body>
  </div>
</custom-card>
```

placeholder مربوط به `<ng-content>` از همان CSS selectorهایی پشتیبانی می‌کند که [selectorهای component](guide/components/selectors) پشتیبانی می‌کنند.

اگر یک یا چند placeholder از نوع `<ng-content>` با attribute مربوط به `select` داشته باشید و یک placeholder از نوع `<ng-content>` بدون attribute مربوط به `select` هم داشته باشید، دومی همه elementهایی را capture می‌کند که با attributeهای `select` match نشده‌اند:

```angular-html
<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title" />
  <div class="card-divider"></div>
  <!-- capture anything except "card-title" -->
  <ng-content />
</div>
```

```angular-html
<!-- Using the component -->
<custom-card>
  <card-title>Hello</card-title>
  <img src="..." />
  <p>Welcome to the example</p>
</custom-card>
```

```angular-html
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    <img src="..." />
    <p>Welcome to the example</p>
  </div>
</custom-card>
```

اگر یک component هیچ placeholder از نوع `<ng-content>` بدون attribute مربوط به `select` نداشته باشد، هر elementی که با یکی از placeholderهای component match نشود در DOM render نمی‌شود.

## محتوای fallback

Angular می‌تواند برای placeholder مربوط به `<ng-content>` در یک component، زمانی که آن component هیچ child content مطابقی ندارد، _fallback content_ نمایش دهد. می‌توانید fallback content را با اضافه کردن child content به خود element مربوط به `<ng-content>` مشخص کنید.

```angular-html
<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title">Default Title</ng-content>
  <div class="card-divider"></div>
  <ng-content select="card-body">Default Body</ng-content>
</div>
```

```angular-html
<!-- Using the component -->
<custom-card>
  <card-title>Hello</card-title>
  <!-- No card-body provided -->
</custom-card>
```

```angular-html
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    Default Body
  </div>
</custom-card>
```

## Alias کردن content برای projection

Angular از یک attribute ویژه به نام `ngProjectAs` پشتیبانی می‌کند که اجازه می‌دهد یک CSS selector روی هر element مشخص کنید. هر زمان elementی با `ngProjectAs` در برابر یک placeholder از نوع `<ng-content>` بررسی شود، Angular به‌جای identity خود element، مقدار `ngProjectAs` را مقایسه می‌کند:

```angular-html
<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title" />
  <div class="card-divider"></div>
  <ng-content />
</div>
```

```angular-html
<!-- Using the component -->
<custom-card>
  <h3 ngProjectAs="card-title">Hello</h3>

  <p>Welcome to the example</p>
</custom-card>
```

```angular-html
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <h3>Hello</h3>
    <div class="card-divider"></div>
    <p>Welcome to the example</p>
  </div>
</custom-card>
```

`ngProjectAs` فقط از مقدارهای static پشتیبانی می‌کند و نمی‌توان آن را به expressionهای dynamic bind کرد.

## نکات احتیاطی

### محتوای projected در view والد زندگی می‌کند

با اینکه محتوای projected داخل component دریافت‌کننده _render_ می‌شود، همچنان مالکیت آن با componentی است که آن را declare کرده است. Angular آن را به‌عنوان بخشی از view والد track می‌کند، و این چند اثر جانبی دارد که دانستنشان مفید است.

**Change detection:** محتوای projected زمانی check می‌شود که _والد_ change detection را اجرا کند. اگر component دریافت‌کننده از `OnPush` استفاده کند، Angular می‌تواند بررسی template خود آن component را skip کند؛ اما محتوای projected را skip نمی‌کند، چون متعلق به والد است.

```angular-html
<!-- Parent template (default change detection) -->
<onpush-wrapper>
  <!-- Still checked on every parent cycle, OnPush doesn't help here -->
  <expensive-component />
</onpush-wrapper>
```

**Dependency injection:** محتوای projected dependencyهای خود را از injector والد می‌گیرد، نه از `viewProviders` مربوط به component دریافت‌کننده. برای جزئیات، [Providers and viewProviders](guide/di/hierarchical-dependency-injection) را ببینید.

### بعضی componentهای کتابخانه‌ای از childهای projected پشتیبانی نمی‌کنند

برخی componentها، مثل menuها، tabها و listها، از `ContentChildren` استفاده می‌کنند تا childهای خود را پیدا کنند و behaviorهایی مثل keyboard navigation، focus management یا attributeهای ARIA را وصل کنند. این componentها با این فرض نوشته شده‌اند که childهای خود را مستقیم در اختیار دارند؛ بنابراین project کردن محتوای بیرونی داخل آن‌ها معمولا چیزهایی را به‌شکل ظریف خراب می‌کند.

برای مثال، wrap کردن elementهای `<mat-menu-item>` در یک لایه اضافه و project کردن آن‌ها داخل `<mat-menu>` می‌تواند keyboard navigation و پشتیبانی screen reader را بی‌صدا خراب کند. query همچنان itemها را پیدا می‌کند، اما setup داخلی که آن‌ها را interactive می‌کند ممکن است وقتی itemها از یک view context متفاوت می‌آیند درست کار نکند.

اگر یک component کتابخانه‌ای behavior childهای خود را مدیریت می‌کند، پیش از استفاده از content projection مستنداتش را بررسی کنید؛ ممکن است پشتیبانی نشده باشد.
