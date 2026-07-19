# Variableها در templateها

Angular دو نوع variable declaration در templateها دارد: local template variableها و template reference variableها.

HELPFUL: در این راهنما، "template" به کل فایل HTML template اشاره نمی‌کند. منظور فقط یک construct یا expression مشخص داخل فایل است.

## Local template variableها با `@let`

Syntax مربوط به `@let` در Angular اجازه می‌دهد یک local variable تعریف کنید و آن را در سراسر template دوباره استفاده کنید، شبیه [syntax مربوط به `let` در JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let).

### استفاده از `@let`

از `@let` برای declare کردن variableای استفاده کنید که مقدارش بر اساس نتیجه یک template expression است. Angular مقدار variable را به‌صورت خودکار با expression داده‌شده به‌روز نگه می‌دارد، شبیه [bindingها](/guide/templates/binding).

```angular-html
@let name = user.name;
@let greeting = 'Hello, ' + name;
@let data = data$ | async;
@let pi = 3.14159;
@let coordinates = {x: 50, y: 100};
@let longExpression =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit ' +
  'sed do eiusmod tempor incididunt ut labore et dolore magna ' +
  'Ut enim ad minim veniam...';
```

هر block مربوط به `@let` دقیقا می‌تواند یک variable declare کند. نمی‌توانید چند variable را با comma در یک block declare کنید.

### ارجاع به مقدار `@let`

بعد از اینکه یک variable را با `@let` declare کردید، می‌توانید آن را در همان template دوباره استفاده کنید:

```angular-html
@let user = user$ | async;

@if (user) {
  <h1>Hello, {{ user.name }}</h1>
  <user-avatar [photo]="user.photo" />

  <ul>
    @for (snack of user.favoriteSnacks; track snack.id) {
      <li>{{ snack.name }}</li>
    }
  </ul>

  <button (click)="update(user)">Update profile</button>
}
```

### Assignability

یک تفاوت کلیدی میان `@let` و `let` در JavaScript این است که `@let` بعد از declaration نمی‌تواند reassigned شود. با این حال، Angular مقدار variable را به‌صورت خودکار با expression داده‌شده به‌روز نگه می‌دارد.

```angular-html
@let value = 1;

<!-- Invalid - This does not work! -->
<button (click)="value = value + 1">Increment the value</button>
```

### Scope مربوط به variable

Declarationهای `@let` به view فعلی و descendantهای آن scope می‌شوند. Angular در مرزهای component و هر جایی که یک template ممکن است dynamic content داشته باشد، مثل blockهای control flow، blockهای `@defer` یا structural directiveها، یک view جدید می‌سازد.

از آنجا که declarationهای `@let` hoist نمی‌شوند، **نمی‌توان** از viewهای والد یا sibling به آن‌ها دسترسی داشت:

```angular-html
@let topLevel = value;

<div>
  @let insideDiv = value;
</div>

<!-- Valid -->
{{ topLevel }}
<!-- Valid -->
{{ insideDiv }}

@if (condition) {
  <!-- Valid -->
  {{ topLevel + insideDiv }}

  @let nested = value;

  @if (condition) {
    <!-- Valid -->
    {{ topLevel + insideDiv + nested }}
  }
}

<!-- Error, not hoisted from @if -->
{{ nested }}
```

### Syntax کامل

Syntax مربوط به `@let` به‌صورت رسمی این‌گونه تعریف می‌شود:

- keyword مربوط به `@let`.
- سپس یک یا چند whitespace، بدون شامل شدن newline.
- سپس یک نام معتبر JavaScript و صفر یا چند whitespace.
- سپس symbol مربوط به = و صفر یا چند whitespace.
- سپس یک Angular expression که می‌تواند multi-line باشد.
- با symbol مربوط به `;` پایان می‌یابد.

## Template reference variableها

Template reference variableها راهی می‌دهند تا variableای declare کنید که به یک value از elementی در template شما reference می‌دهد.

یک template reference variable می‌تواند به موارد زیر اشاره کند:

- یک DOM element داخل template، از جمله [custom elementها](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)
- یک component یا directive در Angular
- یک [TemplateRef](/api/core/TemplateRef) از یک [ng-template](/api/core/ng-template)

می‌توانید از template reference variableها برای خواندن اطلاعات از یک بخش template در بخش دیگری از همان template استفاده کنید.

### Declare کردن template reference variable

می‌توانید با اضافه کردن attributeای که با کاراکتر hash یعنی (`#`) شروع می‌شود و سپس نام variable می‌آید، یک variable را روی elementی در template declare کنید.

```angular-html
<!-- Create a template reference variable named "taskInput", referring to the HTMLInputElement. -->
<input #taskInput placeholder="Enter task name" />
```

### Assign کردن value به template reference variableها

Angular بر اساس elementی که variable روی آن declare شده، به template variableها مقدار assign می‌کند.

اگر variable را روی یک component از Angular declare کنید، variable به instance همان component اشاره می‌کند.

```angular-html
<!-- The `startDate` variable is assigned the instance of `MyDatepicker`. -->
<my-datepicker #startDate />
```

اگر variable را روی یک element از نوع `<ng-template>` declare کنید، variable به یک instance از TemplateRef اشاره می‌کند که نماینده template است. برای اطلاعات بیشتر، [How Angular uses the asterisk, \*, syntax](/guide/directives/structural-directives#structural-directive-shorthand) را در [Structural directives](/guide/directives/structural-directives) ببینید.

```angular-html
<!-- The `myFragment` variable is assigned the `TemplateRef` instance corresponding to this template fragment. -->
<ng-template #myFragment>
  <p>This is a template fragment</p>
</ng-template>
```

اگر variable را روی هر element نمایش‌داده‌شده دیگری declare کنید، variable به instance مربوط به `HTMLElement` اشاره می‌کند.

```angular-html
<!-- The "taskInput" variable refers to the HTMLInputElement instance. -->
<input #taskInput placeholder="Enter task name" />
```

#### Assign کردن reference به یک directive در Angular

Directiveهای Angular ممکن است یک property به نام `exportAs` داشته باشند که نامی را تعریف می‌کند که با آن می‌توان در template به directive reference داد:

```angular-ts
@Directive({
  selector: '[dropZone]',
  exportAs: 'dropZone',
})
export class DropZone {
  /* ... */
}
```

وقتی یک template variable را روی یک element declare می‌کنید، می‌توانید با مشخص کردن این نام `exportAs`، instance مربوط به directive را به آن variable assign کنید:

```angular-html
<!-- The `firstZone` variable refers to the `DropZone` directive instance. -->
<section dropZone #firstZone="dropZone">...</section>
```

نمی‌توانید به directiveای reference دهید که نام `exportAs` مشخص نکرده است.

### استفاده از template reference variableها با queryها

علاوه بر استفاده از template variableها برای خواندن valueها از بخش دیگری از همان template، می‌توانید از این سبک variable declaration برای "mark" کردن یک element برای [queryهای component و directive](/guide/components/queries) هم استفاده کنید.

وقتی می‌خواهید یک element مشخص را در template query کنید، می‌توانید یک template variable روی آن element declare کنید و سپس element را بر اساس نام آن variable query کنید.

```angular-html
<input #description value="Original description" />
```

```angular-ts
@Component({
  /* ... */,
  template: `<input #description value="Original description">`,
})
export class AppComponent {
  // Query for the input element based on the template variable name.
  @ViewChild('description') input: ElementRef | undefined;
}
```

برای اطلاعات بیشتر درباره queryها، [Referencing children with queries](/guide/components/queries) را ببینید.

### Scope مربوط به template variable

درست مثل variableهای کد JavaScript یا TypeScript، template variableها به templateای scope می‌شوند که آن‌ها را declare می‌کند.

به همین شکل، [Structural directiveها](guide/directives/structural-directives) یا declarationهای `<ng-template>` یک template scope تو در تو جدید می‌سازند، بسیار شبیه statementهای control flow در JavaScript مثل `if` و `for` که lexical scope جدید می‌سازند. نمی‌توانید از بیرون مرزهای یکی از این structural directiveها به template variableهای داخل آن دسترسی داشته باشید.

HELPFUL: یک variable را فقط یک بار در template تعریف کنید تا مقدار runtime قابل پیش‌بینی بماند.

#### دسترسی در template تو در تو

یک template داخلی می‌تواند به template variableهایی که template بیرونی تعریف کرده دسترسی داشته باشد.

در مثال زیر، تغییر text در `<input>` مقدار داخل `<span>` را تغییر می‌دهد، چون Angular تغییرات را از طریق template variable یعنی `ref1` بلافاصله update می‌کند.

```html
<input #ref1 type="text" [(ngModel)]="firstExample" />

<span *ngIf="true">Value: {{ ref1.value }}</span>
```

در این حالت، `*ngIf` روی `<span>` یک template scope جدید می‌سازد که variable مربوط به `ref1` را از scope والد خود شامل می‌شود.

اما دسترسی به template variable از scope child در template والد کار نمی‌کند:

```html {avoid}
<input *ngIf="true" #ref2 type="text" [(ngModel)]="secondExample" />

<span>Value: {{ ref2?.value }}</span>
```

اینجا `ref2` در child scope ساخته‌شده توسط `*ngIf` declare شده و از template والد قابل دسترسی نیست.
