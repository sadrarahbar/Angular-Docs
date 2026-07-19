# Binding متن، property و attributeهای dynamic

در Angular، یک **binding** ارتباطی dynamic میان template یک component و داده‌های آن ایجاد می‌کند. این ارتباط تضمین می‌کند که تغییرات داده‌های component به‌صورت خودکار template render شده را update کند.

## Render کردن متن dynamic با text interpolation

می‌توانید متن dynamic را در templateها با double curly braces bind کنید؛ این syntax به Angular می‌گوید مسئول expression داخل آن و update درست آن است. به این روش **text interpolation** گفته می‌شود.

```angular-ts
@Component({
  template: `
    <p>Your color preference is {{ theme }}.</p>
  `,
  ...
})
export class App {
  theme = 'dark';
}
```

در این مثال، وقتی snippet روی page render شود، Angular مقدار `{{ theme }}` را با `dark` جایگزین می‌کند.

```angular-html
<!-- Rendered Output -->
<p>Your color preference is dark.</p>
```

Bindingهایی که در طول زمان تغییر می‌کنند باید مقدارها را از [Signalها](/guide/signals) بخوانند. Angular Signalهایی را که در template خوانده می‌شوند track می‌کند و وقتی مقدار آن Signalها تغییر کند، page render شده را update می‌کند.

```angular-ts
@Component({
  template: `
    <!-- Does not necessarily update when `welcomeMessage` changes. -->
    <p>{{ welcomeMessage }}</p>

    <p>Your color preference is {{ theme() }}.</p> <!-- Always updates when the value of the `theme` signal changes. -->
  `
  ...
})
export class App {
  welcomeMessage = "Welcome, enjoy this app that we built for you";
  theme = signal('dark');
}
```

برای جزئیات بیشتر، [راهنمای Signals](/guide/signals) را ببینید.

در ادامه مثال theme، اگر کاربر بعد از load شدن page روی buttonی کلیک کند که Signal مربوط به `theme` را به `'light'` update می‌کند، page مطابق زیر update می‌شود:

```angular-html
<!-- Rendered Output -->
<p>Your color preference is light.</p>
```

هر جایی که معمولا در HTML متن می‌نویسید، می‌توانید از text interpolation استفاده کنید.

همه مقدارهای expression به string تبدیل می‌شوند. Objectها و arrayها با استفاده از متد `toString` همان value تبدیل می‌شوند.

## Binding property و attributeهای dynamic

Angular از binding مقدارهای dynamic به object propertyها و attributeهای HTML با square bracket پشتیبانی می‌کند.

می‌توانید به propertyهای instance مربوط به DOM یک element از HTML، یک instance از [component](/guide/components)، یا یک instance از [directive](/guide/directives) bind کنید.

### Propertyهای element بومی

هر element از HTML یک نمایش متناظر در DOM دارد. مثلا هر element `<button>` از HTML با یک instance از `HTMLButtonElement` در DOM متناظر است. در Angular، از property binding استفاده می‌کنید تا مقدارها را مستقیم روی نمایش DOM مربوط به element تنظیم کنید.

```angular-html
<!-- Bind the `disabled` property on the button element's DOM object -->
<button [disabled]="isFormValid()">Save</button>
```

در این مثال، هر بار `isFormValid` تغییر کند، Angular به‌صورت خودکار property مربوط به `disabled` را روی instance مربوط به `HTMLButtonElement` تنظیم می‌کند.

### Propertyهای component و directive

وقتی یک element یک component از Angular باشد، می‌توانید با همان syntax مربوط به square bracket، از property bindingها برای set کردن input propertyهای component استفاده کنید.

```angular-html
<!-- Bind the `value` property on the `MyListbox` component instance. -->
<my-listbox [value]="mySelection()" />
```

در این مثال، هر بار `mySelection` تغییر کند، Angular به‌صورت خودکار property مربوط به `value` را روی instance مربوط به `MyListbox` تنظیم می‌کند.

می‌توانید به propertyهای directive هم bind کنید.

```angular-html
<!-- Bind to the `ngSrc` property of the `NgOptimizedImage` directive  -->
<img [ngSrc]="profilePhotoUrl()" alt="The current user's profile photo" />
```

### Attributeها

وقتی لازم است attributeهای HTML را set کنید که property متناظر در DOM ندارند، مثل attributeهای SVG، می‌توانید attributeها را با prefix مربوط به `attr.` در template خود به elementها bind کنید.

<!-- prettier-ignore -->
```angular-html
<!-- Bind the `role` attribute on the `<ul>` element to the component's `listRole` property. -->
<ul [attr.role]="listRole()">
```

در این مثال، هر بار `listRole` تغییر کند، Angular با فراخوانی `setAttribute` به‌صورت خودکار attribute مربوط به `role` را روی element مربوط به `<ul>` تنظیم می‌کند.

اگر مقدار یک attribute binding برابر `null` باشد، Angular با فراخوانی `removeAttribute` آن attribute را حذف می‌کند.

### Text interpolation در propertyها و attributeها

می‌توانید از syntax مربوط به text interpolation در propertyها و attributeها هم استفاده کنید؛ یعنی به‌جای square brace دور نام property یا attribute، از double curly brace استفاده کنید. هنگام استفاده از این syntax، Angular assignment را به‌عنوان property binding در نظر می‌گیرد.

```angular-html
<!-- Binds a value to the `alt` property of the image element's DOM object. -->
<img src="profile-photo.jpg" alt="Profile photo of {{ firstName() }}" />
```

## Bindingهای CSS class و style property

Angular قابلیت‌های اضافه‌ای برای binding کردن CSS classها و CSS style propertyها به elementها پشتیبانی می‌کند.

### CSS classها

می‌توانید یک CSS class binding بسازید تا بر اساس [truthy یا falsy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) بودن مقدار bind شده، یک CSS class را به‌صورت شرطی به element اضافه یا از آن حذف کنید.

<!-- prettier-ignore -->
```angular-html
<!-- When `isExpanded` is truthy, add the `expanded` CSS class. -->
<ul [class.expanded]="isExpanded()">
```

همچنین می‌توانید مستقیم به property مربوط به `class` bind کنید. Angular سه نوع مقدار را می‌پذیرد:

| Description of `class` value                                                                                                 | TypeScript type       |
| ---------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| stringی شامل یک یا چند CSS class که با space جدا شده‌اند                                                                     | `string`              |
| arrayای از stringهای CSS class                                                                                               | `string[]`            |
| objectی که هر نام property آن یک نام CSS class است و مقدار متناظر مشخص می‌کند آن class، بر اساس truthiness، روی element اعمال شود یا نه. | `Record<string, any>` |

```angular-ts
@Component({
  template: `
    <ul [class]="listClasses"> ... </ul>
    <section [class]="sectionClasses()"> ... </section>
    <button [class]="buttonClasses()"> ... </button>
  `,
  ...
})
export class UserProfile {
  listClasses = 'full-width outlined';
  sectionClasses = signal(['expandable', 'elevated']);
  buttonClasses = signal({
    highlighted: true,
    embiggened: false,
  });
}
```

مثال بالا DOM زیر را render می‌کند:

<!-- prettier-ignore -->
```angular-html
<ul class="full-width outlined"> ... </ul>
<section class="expandable elevated"> ... </section>
<button class="highlighted"> ... </button>
```

Angular هر string valueای را که نام معتبر CSS class نباشد نادیده می‌گیرد.

هنگام استفاده از CSS classهای static، binding مستقیم `class` و binding classهای مشخص، Angular همه classها را در نتیجه render شده هوشمندانه ترکیب می‌کند.

```angular-ts
@Component({
  template: `<ul class="list" [class]="listType()" [class.expanded]="isExpanded()"> ...`,
  ...
})
export class Listbox {
  listType = signal('box');
  isExpanded = signal(true);
}
```

در مثال بالا، Angular element مربوط به `ul` را با هر سه CSS class render می‌کند.

<!-- prettier-ignore -->
```angular-html
<ul class="list box expanded">
```

Angular هیچ ترتیب مشخصی را برای CSS classها روی elementهای render شده تضمین نمی‌کند.

وقتی `class` را به یک array یا object bind می‌کنید، Angular مقدار قبلی را با مقدار فعلی با operator سه‌تایی equals یعنی (`===`) مقایسه می‌کند. برای اینکه Angular updateها را اعمال کند، هنگام تغییر این مقدارها باید یک instance جدید از object یا array بسازید.

اگر یک element چند binding برای یک CSS class یکسان داشته باشد، Angular collisionها را با دنبال کردن style precedence order خود resolve می‌کند.

NOTE: Class bindingها از نام classهای space-separated در یک key واحد پشتیبانی نمی‌کنند. همچنین از mutation روی objectها پشتیبانی نمی‌کنند، چون reference مربوط به binding همان قبلی باقی می‌ماند. اگر به هرکدام نیاز دارید، از directive مربوط به [ngClass](/api/common/NgClass) استفاده کنید.

### CSS style propertyها

همچنین می‌توانید مستقیم به CSS style propertyهای یک element bind کنید.

<!-- prettier-ignore -->
```angular-html
<!-- Set the CSS `display` property based on the `isExpanded` property. -->
<section [style.display]="isExpanded() ? 'block' : 'none'">
```

می‌توانید برای CSS propertyهایی که unit می‌پذیرند، unit را هم مشخص کنید.

<!-- prettier-ignore -->
```angular-html
<!-- Set the CSS `height` property to a pixel value based on the `sectionHeightInPixels` property. -->
<section [style.height.px]="sectionHeightInPixels()">
```

همچنین می‌توانید چند style value را در یک binding set کنید. Angular نوع‌های مقدار زیر را می‌پذیرد:

| Description of `style` value                                                                                             | TypeScript type       |
| ------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| stringی شامل صفر یا چند declaration مربوط به CSS، مثل `"display: flex; margin: 8px"`.                                   | `string`              |
| objectی که هر نام property آن یک نام CSS property است و مقدار متناظر آن، مقدار همان CSS property است.                    | `Record<string, any>` |

```angular-ts
@Component({
  template: `
    <ul [style]="listStyles()"> ... </ul>
    <section [style]="sectionStyles()"> ... </section>
  `,
  ...
})
export class UserProfile {
  listStyles = signal('display: flex; padding: 8px');
  sectionStyles = signal({
    border: '1px solid black',
    'font-weight': 'bold',
  });
}
```

مثال بالا DOM زیر را render می‌کند.

<!-- prettier-ignore -->
```angular-html
<ul style="display: flex; padding: 8px"> ... </ul>
<section style="border: 1px solid black; font-weight: bold"> ... </section>
```

وقتی `style` را به یک object bind می‌کنید، Angular مقدار قبلی را با مقدار فعلی با operator سه‌تایی equals یعنی (`===`) مقایسه می‌کند. برای اینکه Angular updateها را اعمال کند، هنگام تغییر این مقدارها باید یک instance جدید از object بسازید.

اگر یک element چند binding برای یک style property یکسان داشته باشد، Angular collisionها را با دنبال کردن style precedence order خود resolve می‌کند.

## Attributeهای ARIA

Angular از binding کردن string valueها به attributeهای ARIA پشتیبانی می‌کند.

```angular-html
<button type="button" [aria-label]="actionLabel()">
  {{ actionLabel() }}
</button>
```

Angular مقدار string را روی attribute مربوط به `aria-label` در element می‌نویسد و وقتی مقدار bind شده `null` باشد، آن را حذف می‌کند.

برخی قابلیت‌های ARIA، DOM propertyها یا directive inputهایی expose می‌کنند که مقدارهای structured می‌پذیرند، مثل reference به elementها. برای این موارد از property bindingهای استاندارد استفاده کنید. برای مثال‌ها و راهنمایی بیشتر، [accessibility guide](/best-practices/a11y#aria-attributes-and-properties) را ببینید.
