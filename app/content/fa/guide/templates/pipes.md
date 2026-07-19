# Pipeها

## نمای کلی

Pipeها operatorهای ویژه‌ای در Angular template expressionها هستند که اجازه می‌دهند داده را به‌صورت declarative در template خود transform کنید. Pipeها اجازه می‌دهند یک transformation function را یک بار declare کنید و سپس همان transformation را در چند template استفاده کنید. Pipeهای Angular از کاراکتر vertical bar یعنی (`|`) استفاده می‌کنند که از [Unix pipe](<https://en.wikipedia.org/wiki/Pipeline_(Unix)>) الهام گرفته شده است.

NOTE: syntax مربوط به pipe در Angular با JavaScript استاندارد فرق دارد؛ JavaScript از vertical bar برای [bitwise OR operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR) استفاده می‌کند. Angular template expressionها از bitwise operatorها پشتیبانی نمی‌کنند.

این یک مثال با چند pipe built-in است که Angular فراهم می‌کند:

```angular-ts
import {Component} from '@angular/core';
import {CurrencyPipe, DatePipe, TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe, DatePipe, TitleCasePipe],
  template: `
    <main>
      <!-- Transform the company name to title-case and
       transform the purchasedOn date to a locale-formatted string -->
      <h1>Purchases from {{ company | titlecase }} on {{ purchasedOn | date }}</h1>

      <!-- Transform the amount to a currency-formatted string -->
      <p>Total: {{ amount | currency }}</p>
    </main>
  `,
})
export class ShoppingCart {
  amount = 123.45;
  company = 'acme corporation';
  purchasedOn = '2024-07-08';
}
```

وقتی Angular این component را render می‌کند، مطمئن می‌شود format مناسب date و currency بر اساس locale کاربر باشد. اگر کاربر در United States باشد، این خروجی render می‌شود:

```angular-html
<main>
  <h1>Purchases from Acme Corporation on Jul 8, 2024</h1>
  <p>Total: $123.45</p>
</main>
```

برای یادگیری بیشتر درباره اینکه Angular چگونه valueها را localize می‌کند، [راهنمای جامع i18n](/guide/i18n) را ببینید.

### Pipeهای built-in

Angular در package مربوط به `@angular/common` مجموعه‌ای از pipeهای built-in دارد:

| Name                                          | Description                                                                       |
| --------------------------------------------- | --------------------------------------------------------------------------------- |
| [`AsyncPipe`](api/common/AsyncPipe)           | مقدار را از یک `Promise` یا یک RxJS `Observable` می‌خواند.                        |
| [`CurrencyPipe`](api/common/CurrencyPipe)     | یک number را به string مربوط به currency تبدیل می‌کند که طبق قوانین locale format شده است. |
| [`DatePipe`](api/common/DatePipe)             | یک مقدار `Date` را طبق قوانین locale format می‌کند.                              |
| [`DecimalPipe`](api/common/DecimalPipe)       | یک number را به stringی با decimal point تبدیل می‌کند که طبق قوانین locale format شده است. |
| [`I18nPluralPipe`](api/common/I18nPluralPipe) | یک value را به stringی map می‌کند که طبق قوانین locale، pluralization آن value را انجام می‌دهد. |
| [`I18nSelectPipe`](api/common/I18nSelectPipe) | یک key را به selector سفارشی map می‌کند که مقدار دلخواه را برمی‌گرداند.           |
| [`JsonPipe`](api/common/JsonPipe)             | یک object را با `JSON.stringify` به نمایش string تبدیل می‌کند و برای debugging در نظر گرفته شده است. |
| [`KeyValuePipe`](api/common/KeyValuePipe)     | Object یا Map را به arrayای از key value pairها تبدیل می‌کند.                     |
| [`LowerCasePipe`](api/common/LowerCasePipe)   | text را به حروف کوچک تبدیل می‌کند.                                                |
| [`PercentPipe`](api/common/PercentPipe)       | یک number را به string درصد تبدیل می‌کند که طبق قوانین locale format شده است.     |
| [`SlicePipe`](api/common/SlicePipe)           | یک Array یا String جدید شامل subset یا sliceای از elementها می‌سازد.              |
| [`TitleCasePipe`](api/common/TitleCasePipe)   | text را به title case تبدیل می‌کند.                                               |
| [`UpperCasePipe`](api/common/UpperCasePipe)   | text را به حروف بزرگ تبدیل می‌کند.                                                |

## استفاده از pipeها

Pipe operator در Angular از کاراکتر vertical bar یعنی (`|`) داخل template expression استفاده می‌کند. Pipe operator یک binary operator است؛ operand سمت چپ همان valueای است که به transformation function پاس داده می‌شود، و operand سمت راست نام pipe و هر argument اضافه است که پایین‌تر توضیح داده شده‌اند.

```angular-html
<p>Total: {{ amount | currency }}</p>
```

در این مثال، مقدار `amount` وارد `CurrencyPipe` می‌شود؛ جایی که نام pipe برابر `currency` است. سپس currency پیش‌فرض برای locale کاربر render می‌شود.

### ترکیب چند pipe در یک expression

می‌توانید با استفاده از چند pipe operator، چند transformation را روی یک value اعمال کنید. Angular pipeها را از چپ به راست اجرا می‌کند.

مثال زیر ترکیبی از pipeها را برای نمایش یک localized date با حروف بزرگ نشان می‌دهد:

```angular-html
<p>The event will occur on {{ scheduledOn | date | uppercase }}.</p>
```

### پاس دادن parameter به pipeها

برخی pipeها parameter می‌پذیرند تا transformation را configure کنند. برای مشخص کردن parameter، بعد از نام pipe یک colon یعنی (`:`) و سپس مقدار parameter را اضافه کنید.

برای مثال، `DatePipe` می‌تواند parameter بگیرد تا date را به شکل مشخصی format کند.

```angular-html
<p>The event will occur at {{ scheduledOn | date: 'hh:mm' }}.</p>
```

برخی pipeها ممکن است چند parameter بپذیرند. می‌توانید مقدارهای parameter اضافه را با کاراکتر colon یعنی (`:`) جدا کنید.

برای مثال، می‌توانیم یک parameter اختیاری دوم هم پاس دهیم تا timezone را کنترل کند.

```angular-html
<p>The event will occur at {{ scheduledOn | date: 'hh:mm' : 'UTC' }}.</p>
```

## Pipeها چگونه کار می‌کنند

از نظر مفهومی، pipeها functionهایی هستند که یک input value می‌پذیرند و یک transformed value برمی‌گردانند.

```angular-ts
import {Component} from '@angular/core';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe],
  template: `
    <main>
      <p>Total: {{ amount | currency }}</p>
    </main>
  `,
})
export class AppComponent {
  amount = 123.45;
}
```

در این مثال:

1. `CurrencyPipe` از `@angular/common` import شده است
1. `CurrencyPipe` به array مربوط به `imports` اضافه شده است
1. داده `amount` به pipe مربوط به `currency` پاس داده شده است

### Precedence مربوط به pipe operator

Pipe operator نسبت به binary operatorهای دیگر precedence پایین‌تری دارد، از جمله `+`، `-`، `*`، `/`، `%`، `&&`، `||` و `??`.

```angular-html
<!-- firstName and lastName are concatenated before the result is passed to the uppercase pipe -->
{{ firstName + lastName | uppercase }}
```

Pipe operator نسبت به conditional یا ternary operator precedence بالاتری دارد.

```angular-html
{{ (isAdmin ? 'Access granted' : 'Access denied') | uppercase }}
```

اگر همان expression بدون parenthesis نوشته شود:

<!-- prettier-ignore -->
```angular-html
{{ isAdmin ? 'Access granted' : 'Access denied' | uppercase }}
```

در عوض به این شکل parse می‌شود:

```angular-html
{{ isAdmin ? 'Access granted' : ('Access denied' | uppercase) }}
```

هر زمان operator precedence ممکن است مبهم باشد، همیشه در expressionهای خود از parenthesis استفاده کنید.

### Change detection با pipeها

به‌صورت پیش‌فرض، همه pipeها `pure` در نظر گرفته می‌شوند؛ یعنی فقط زمانی اجرا می‌شوند که یک primitive input value مثل `String`، `Number`، `Boolean` یا `Symbol`، یا یک object reference مثل `Array`، `Object`، `Function` یا `Date` تغییر کند. Pure pipeها مزیت performance دارند، چون اگر value پاس داده‌شده تغییر نکرده باشد، Angular می‌تواند از فراخوانی transformation function پرهیز کند.

در نتیجه، mutation روی object propertyها یا itemهای array تشخیص داده نمی‌شود، مگر اینکه کل reference مربوط به object یا array با instance متفاوتی جایگزین شود. اگر به این سطح از change detection نیاز دارید، به [detecting changes within arrays or objects](#detecting-change-within-arrays-or-objects) مراجعه کنید.

## ساخت custom pipeها

می‌توانید با پیاده‌سازی یک کلاس TypeScript همراه با decorator مربوط به `@Pipe` یک custom pipe تعریف کنید. یک pipe باید دو چیز داشته باشد:

- یک نام که در pipe decorator مشخص می‌شود
- متدی به نام `transform` که value transformation را انجام می‌دهد.

کلاس TypeScript همچنین بهتر است interface مربوط به `PipeTransform` را implement کند تا مطمئن شوید type signature لازم برای یک pipe را رعایت می‌کند.

این مثالی از یک custom pipe است که stringها را به kebab case تبدیل می‌کند:

```angular-ts
// kebab-case.pipe.ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'kebabCase',
})
export class KebabCasePipe implements PipeTransform {
  transform(value: string): string {
    return value.toLowerCase().replace(/ /g, '-');
  }
}
```

### استفاده از decorator مربوط به `@Pipe`

هنگام ساخت custom pipe، `Pipe` را از package مربوط به `@angular/core` import کنید و آن را به‌عنوان decorator برای کلاس TypeScript استفاده کنید.

```angular-ts
import {Pipe} from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe {}
```

decorator مربوط به `@Pipe` به یک `name` نیاز دارد که کنترل می‌کند pipe چگونه در template استفاده شود.

### Naming convention برای custom pipeها

Naming convention مربوط به custom pipeها از دو convention تشکیل شده است:

- `name` - camelCase پیشنهاد می‌شود. از hyphen استفاده نکنید.
- `class name` - نسخه PascalCase از `name` که `Pipe` به انتهای آن append شده است

### پیاده‌سازی interface مربوط به `PipeTransform`

علاوه بر decorator مربوط به `@Pipe`، custom pipeها همیشه باید interface مربوط به `PipeTransform` از `@angular/core` را implement کنند.

```angular-ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe implements PipeTransform {}
```

پیاده‌سازی این interface تضمین می‌کند کلاس pipe شما ساختار درست را دارد.

### Transform کردن value یک pipe

هر transformation توسط متد `transform` invoke می‌شود؛ parameter اول، value پاس داده‌شده است و return value همان transformed value است.

```angular-ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe implements PipeTransform {
  transform(value: string): string {
    return `My custom transformation of ${value}.`;
  }
}
```

### اضافه کردن parameter به custom pipe

می‌توانید با اضافه کردن parameterهای بیشتر به متد `transform`، به transformation خود parameter اضافه کنید:

```angular-ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe implements PipeTransform {
  transform(value: string, format: string): string {
    let msg = `My custom transformation of ${value}.`;

    if (format === 'uppercase') {
      return msg.toUpperCase();
    } else {
      return msg;
    }
  }
}
```

### تشخیص change داخل arrayها یا objectها

وقتی می‌خواهید یک pipe تغییرات داخل arrayها یا objectها را تشخیص دهد، باید با پاس دادن flag مربوط به `pure` با مقدار `false`، آن را به‌عنوان impure function علامت‌گذاری کنید.

IMPORTANT: از ساخت impure pipeها مگر در صورت ضرورت جدی پرهیز کنید، چون اگر با دقت استفاده نشوند می‌توانند performance penalty قابل‌توجهی داشته باشند.

```angular-ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'joinNamesImpure',
  pure: false,
})
export class JoinNamesImpurePipe implements PipeTransform {
  transform(names: string[]): string {
    return names.join();
  }
}
```

توسعه‌دهندگان Angular اغلب convention اضافه کردن `Impure` به `name` و class name مربوط به pipe را رعایت می‌کنند تا pitfall احتمالی performance را به توسعه‌دهندگان دیگر نشان دهند.
