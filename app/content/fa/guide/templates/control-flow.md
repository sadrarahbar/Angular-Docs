# Control flow

Templateهای Angular از blockهای control flow پشتیبانی می‌کنند که اجازه می‌دهند elementها را به‌صورت شرطی نمایش دهید، hidden کنید و تکرار کنید.

## نمایش شرطی content با `@if`، `@else if` و `@else`

block مربوط به `@if` وقتی condition expression آن truthy باشد، content خودش را به‌صورت شرطی نمایش می‌دهد:

```angular-html
@if (a > b) {
  <p>{{ a }} is greater than {{ b }}</p>
}
```

اگر می‌خواهید content جایگزین نمایش دهید، می‌توانید هر تعداد block مربوط به `@else if` و یک block واحد `@else` فراهم کنید.

```angular-html
@if (a > b) {
  {{ a }} is greater than {{ b }}
} @else if (b > a) {
  {{ a }} is less than {{ b }}
} @else {
  {{ a }} is equal to {{ b }}
}
```

### ارجاع به نتیجه expression شرطی

شرط `@if` از ذخیره کردن نتیجه conditional expression در یک variable برای استفاده مجدد داخل block پشتیبانی می‌کند.

```angular-html
@if (user.profile.settings.startDate; as startDate) {
  {{ startDate }}
}
```

این کار برای ارجاع به expressionهای طولانی‌تر که خواندن و نگهداری‌شان داخل template سخت‌تر است مفید است.

## تکرار content با block مربوط به `@for`

block مربوط به `@for` روی یک collection loop می‌زند و content یک block را بارها render می‌کند. collection می‌تواند هر [iterable](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols) در JavaScript باشد، اما Angular برای مقدارهای `Array` optimizationهای performance اضافه دارد.

یک loop معمولی `@for` شبیه این است:

```angular-html
@for (item of items; track item.id) {
  {{ item.name }}
}
```

block مربوط به `@for` در Angular از statementهایی که flow را تغییر می‌دهند، مثل `continue` یا `break` در JavaScript، پشتیبانی نمی‌کند.

### چرا `track` در blockهای `@for` مهم است؟

expression مربوط به `track` به Angular اجازه می‌دهد رابطه میان داده‌های شما و DOM nodeهای روی page را حفظ کند. این به Angular اجازه می‌دهد هنگام تغییر داده‌ها با اجرای کمترین عملیات لازم روی DOM، performance را optimize کند.

استفاده موثر از track می‌تواند هنگام loop زدن روی data collectionها، performance مربوط به rendering application شما را به‌شکل قابل‌توجهی بهبود دهد.

در expression مربوط به `track`، propertyای را انتخاب کنید که هر item را به‌صورت یکتا مشخص می‌کند. اگر data model شما شامل property یکتاساز است، معمولا `id` یا `uuid`، از همان مقدار استفاده کنید. اگر داده شما چنین فیلدی ندارد، قویا در نظر بگیرید یکی اضافه کنید.

برای collectionهای static که هرگز تغییر نمی‌کنند، می‌توانید از `$index` استفاده کنید تا به Angular بگویید هر item را بر اساس index آن در collection track کند.

اگر هیچ گزینه دیگری در دسترس نیست، می‌توانید خود item را به‌عنوان tracking key استفاده کنید. این به Angular می‌گوید item را با reference identity آن و با operator سه‌تایی equals یعنی (`===`) track کند. تا جای ممکن از این گزینه پرهیز کنید، چون می‌تواند updateهای rendering را بسیار کندتر کند؛ زیرا Angular راهی ندارد که map کند کدام data item با کدام DOM node متناظر است.

```angular-html
@for (item of items; track item) {
  {{ item.name }}
}
```

NOTE: برخلاف `*ngFor`، block مربوط به `@for` اولویت را به reuse کردن view می‌دهد. اگر یک tracked property تغییر کند اما object reference همان قبلی بماند، Angular به‌جای destroy و recreate کردن کل element، bindingهای view را update می‌کند، از جمله inputهای component.

### Variableهای contextual در blockهای `@for`

داخل blockهای `@for` چند variable ضمنی همیشه در دسترس هستند:

| Variable | Meaning                                      |
| -------- | -------------------------------------------- |
| `$count` | تعداد itemهای collectionی که روی آن iterate می‌شود |
| `$index` | index مربوط به row فعلی                      |
| `$first` | آیا row فعلی اولین row است یا نه             |
| `$last`  | آیا row فعلی آخرین row است یا نه             |
| `$even`  | آیا index مربوط به row فعلی زوج است یا نه    |
| `$odd`   | آیا index مربوط به row فعلی فرد است یا نه    |

این variableها همیشه با همین نام‌ها در دسترس هستند، اما می‌توانند از طریق segment مربوط به `let` alias شوند:

```angular-html
@for (item of items; track item.id; let idx = $index, e = $even) {
  <p>Item #{{ idx }}: {{ item.name }}</p>
}
```

Alias کردن هنگام nest کردن blockهای `@for` مفید است، چون اجازه می‌دهد variableهای block بیرونی `@for` را از داخل block داخلی `@for` بخوانید.

### فراهم کردن fallback برای blockهای `@for` با block مربوط به `@empty`

می‌توانید به‌صورت اختیاری یک section مربوط به `@empty` را بلافاصله بعد از content مربوط به block `@for` include کنید. وقتی هیچ itemی وجود نداشته باشد، content مربوط به block `@empty` نمایش داده می‌شود:

```angular-html
@for (item of items; track item.name) {
  <li>{{ item.name }}</li>
} @empty {
  <li>There are no items.</li>
}
```

## نمایش شرطی content با block مربوط به `@switch`

با اینکه block مربوط به `@if` برای بیشتر سناریوها عالی است، block مربوط به `@switch` یک syntax جایگزین برای render شرطی data فراهم می‌کند. syntax آن بسیار شبیه statement مربوط به `switch` در JavaScript است.

```angular-html
@switch (userPermissions) {
  @case ('admin') {
    <app-admin-dashboard />
  }
  @case ('reviewer')
  @case ('editor') {
    <app-editor-dashboard />
  }
  @default {
    <app-viewer-dashboard />
  }
}
```

مقدار conditional expression با case expression و با استفاده از operator سه‌تایی equals یعنی (`===`) مقایسه می‌شود.

**`@switch` fallthrough ندارد**، بنابراین در block به equivalent مربوط به statementهای `break` یا `return` نیاز ندارید.

می‌توانید با داشتن statementهای پشت سر هم `@case`، چند condition را برای یک block واحد مشخص کنید.

می‌توانید به‌صورت اختیاری یک block مربوط به `@default` include کنید. اگر هیچ‌کدام از case expressionهای قبلی با switch value match نشوند، content مربوط به block `@default` نمایش داده می‌شود.

اگر هیچ `@case` با expression match نشود و block مربوط به `@default` هم وجود نداشته باشد، چیزی نمایش داده نمی‌شود.

### Exhaustive type checking

`@switch` از exhaustive type checking پشتیبانی می‌کند و به Angular اجازه می‌دهد در compile time بررسی کند که همه مقدارهای ممکن یک union type handle شده‌اند.

با استفاده از `@default never;`، به‌صورت explicit declare می‌کنید که هیچ case باقی‌مانده‌ای نباید وجود داشته باشد. اگر union type بعدا گسترش پیدا کند و یک case جدید توسط هیچ @case پوشش داده نشده باشد، template type checker در Angular خطا گزارش می‌دهد و کمک می‌کند branchهای جاافتاده را زود تشخیص دهید.

```angular-html
@Component({
  template: `
    @switch (state) {
      @case ('loggedOut') {
        <button>Login</button>
      }

      @case ('loggedIn') {
        <p>Welcome back!</p>
      }

      @default never; // throws because `@case ('loading')` is missing
    }
  `,
})
export class AppComponent {
  state: 'loggedOut' | 'loading' | 'loggedIn' = 'loggedOut';
}
```

وقتی expression مربوط به switch داخل یک union nest شده باشد، باید expression مورد بررسی برای exhaustiveness را به‌صورت explicit مشخص کنید.

<!-- prettier-ignore -->
```angular-ts
@Component({
  template: `
    @switch (state.mode) {
      @case ('show') {
        {{ state.menu }};
      }
      @case ('hide') {}
      @default never(state);
    }
  `,
})
export class App {
  state!: {mode: 'hide'} | {mode: 'show'; menu: number};
}
```
