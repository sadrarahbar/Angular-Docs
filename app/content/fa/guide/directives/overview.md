<docs-decorative-header title="Built-in directives" imgSrc="adev/src/assets/images/directives.svg"> <!-- markdownlint-disable-line -->
Directiveها classهایی هستند که behavior اضافه‌ای به elementها در applicationهای Angular شما اضافه می‌کنند.
</docs-decorative-header>

از directiveهای built-in در Angular برای مدیریت formها، listها، styleها و چیزهایی که کاربر می‌بیند استفاده کنید.

نوع‌های مختلف directive در Angular به این شکل‌اند:

| Directive Types                                                  | Details                                                                           |
| :--------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| [Components](guide/components)                                   | همراه با template استفاده می‌شوند. این نوع directive رایج‌ترین نوع directive است. |
| [Attribute directives](#built-in-attribute-directives)           | ظاهر یا behavior یک element، component یا directive دیگر را تغییر می‌دهند.        |
| [Structural directives](/guide/directives/structural-directives) | با اضافه و حذف کردن DOM elementها، layout مربوط به DOM را تغییر می‌دهند.          |

این راهنما [attribute directive](#built-in-attribute-directives)های built-in را پوشش می‌دهد.

## Attribute directiveهای built-in

Attribute directiveها به behavior مربوط به elementهای HTML، attributeها، propertyها و componentهای دیگر گوش می‌دهند و آن را modify می‌کنند.

رایج‌ترین attribute directiveها عبارت‌اند از:

| Common directives                                      | Details                                                |
| :----------------------------------------------------- | :----------------------------------------------------- |
| [`NgClass`](#adding-and-removing-classes-with-ngclass) | مجموعه‌ای از CSS classها را اضافه و حذف می‌کند.        |
| [`NgStyle`](#setting-inline-styles-with-ngstyle)       | مجموعه‌ای از styleهای HTML را اضافه و حذف می‌کند.      |
| [`NgModel`](guide/forms/template-driven-forms)         | two-way data binding را به یک HTML form element اضافه می‌کند. |

HELPFUL: Directiveهای built-in فقط از public APIها استفاده می‌کنند. آن‌ها دسترسی ویژه‌ای به private APIهایی ندارند که directiveهای دیگر نتوانند به آن‌ها دسترسی داشته باشند.

## اضافه و حذف کردن classها با `NgClass`

با `ngClass` چند CSS class را هم‌زمان اضافه یا حذف کنید.

HELPFUL: برای اضافه یا حذف کردن _یک_ class، به‌جای `NgClass` از [class binding](/guide/templates/binding#css-class-and-style-property-bindings) استفاده کنید.

### Import کردن `NgClass` در component

برای استفاده از `NgClass`، آن را به list مربوط به `imports` در component اضافه کنید.

```angular-ts
import {NgClass} from '@angular/common';

@Component({
  /* ... */
  imports: [NgClass],
})
export class AppComponent {}
```

### استفاده از `NgClass` با یک expression

روی elementی که می‌خواهید style دهید، `[ngClass]` را اضافه کنید و آن را برابر یک expression قرار دهید.
در این حالت، `isSpecial` یک boolean است که در `app.component.ts` روی `true` تنظیم شده است.
چون `isSpecial` برابر true است، `ngClass` کلاس `special` را روی `<div>` اعمال می‌کند.

<docs-code header="app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" region="special-div"/>

### استفاده از `NgClass` با یک method

1. برای استفاده از `NgClass` با یک method، آن method را به کلاس component اضافه کنید.
   در مثال زیر، `setCurrentClasses()` property مربوط به `currentClasses` را با objectی set می‌کند که بر اساس state مربوط به `true` یا `false` سه property دیگر component، سه class را اضافه یا حذف می‌کند.

   هر key در object یک نام CSS class است.
   اگر یک key برابر `true` باشد، `ngClass` آن class را اضافه می‌کند.
   اگر یک key برابر `false` باشد، `ngClass` آن class را حذف می‌کند.

   <docs-code header="app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" region="setClasses"/>

1. در template، property binding مربوط به `ngClass` را به `currentClasses` اضافه کنید تا classهای element تنظیم شوند:

   <docs-code header="app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" region="NgClass-1"/>

برای این use case، Angular classها را هنگام initialization و در صورت تغییرات ناشی از reassign شدن object مربوط به `currentClasses` اعمال می‌کند.
مثال کامل در ابتدا با `ngOnInit()` و وقتی کاربر روی button مربوط به `Refresh currentClasses` کلیک می‌کند، `setCurrentClasses()` را فراخوانی می‌کند.
این stepها برای پیاده‌سازی `ngClass` ضروری نیستند.

## تنظیم inline styleها با `NgStyle`

HELPFUL: برای اضافه یا حذف کردن _یک_ style، به‌جای `NgStyle` از [style bindings](guide/templates/binding#css-class-and-style-property-bindings) استفاده کنید.

### Import کردن `NgStyle` در component

برای استفاده از `NgStyle`، آن را به list مربوط به `imports` در component اضافه کنید.

```angular-ts
import {NgStyle} from '@angular/common';

@Component({
  /* ... */
  imports: [NgStyle],
})
export class AppComponent {}
```

از `NgStyle` برای تنظیم هم‌زمان چند inline style بر اساس state مربوط به component استفاده کنید.

1. برای استفاده از `NgStyle`، یک method به کلاس component اضافه کنید.

   در مثال زیر، `setCurrentStyles()` property مربوط به `currentStyles` را با objectی set می‌کند که سه style را بر اساس state مربوط به سه property دیگر component تعریف می‌کند.

   <docs-code header="app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" region="setStyles"/>

1. برای تنظیم styleهای element، یک property binding از نوع `ngStyle` به `currentStyles` اضافه کنید.

   <docs-code header="app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" region="NgStyle-2"/>

برای این use case، Angular styleها را هنگام initialization و در صورت تغییرات اعمال می‌کند.
برای این کار، مثال کامل در ابتدا با `ngOnInit()` و وقتی propertyهای dependent از طریق click روی button تغییر می‌کنند، `setCurrentStyles()` را فراخوانی می‌کند.
با این حال، این stepها برای پیاده‌سازی خود `ngStyle` ضروری نیستند.

## قدم بعدی

<docs-pill-row>
  <docs-pill href="guide/directives/attribute-directives" title="Attribute Directives"/>
  <docs-pill href="guide/directives/structural-directives" title="Structural Directives"/>
  <docs-pill href="guide/directives/directive-composition-api" title="Directive composition API"/>
</docs-pill-row>
