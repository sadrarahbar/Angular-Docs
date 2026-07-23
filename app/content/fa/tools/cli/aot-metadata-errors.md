# خطاهای metadata در AOT

در ادامه، خطاهای metadataای که ممکن است با آن‌ها روبه‌رو شوید، همراه با توضیح و راه‌حل پیشنهادی آمده‌اند.

## فرم expression پشتیبانی نمی‌شود

HELPFUL: کامپایلر هنگام ارزیابی metadata انگولار با expressionای روبه‌رو شده که آن را درک نمی‌کند.

ویژگی‌های زبانی خارج از [syntax محدودشده expression](tools/cli/aot-compiler) کامپایلر می‌توانند این خطا را ایجاد کنند؛ همان‌طور که در نمونه زیر می‌بینید:

```ts
// ERROR
export class Fooish { … }
…
const prop = typeof Fooish; // typeof is not valid in metadata
  …
  // bracket notation is not valid in metadata
  { provide: 'token', useValue: { [prop]: 'value' } };
  …
```

می‌توانید در کد عادی application از `typeof` و bracket notation استفاده کنید.
فقط نمی‌توانید این ویژگی‌ها را در expressionهایی به کار ببرید که metadata انگولار را تعریف می‌کنند.

برای جلوگیری از این خطا، هنگام نوشتن metadata انگولار به [syntax محدودشده expression](tools/cli/aot-compiler) کامپایلر پایبند بمانید و درباره ویژگی‌های جدید یا نامتعارف TypeScript محتاط باشید.

## ارجاع به یک نماد محلی (exportنشده)

HELPFUL: ارجاع به نماد محلی \(exportنشده\) با نام «symbol name». نماد را export کنید.

کامپایلر با ارجاعی به یک نماد تعریف‌شده محلی روبه‌رو شده است که یا export نشده یا مقدار اولیه ندارد.

نمونه زیر مشکل را در یک `provider` نشان می‌دهد.

```ts

// ERROR
let foo: number; // neither exported nor initialized

@Component({
  selector: 'my-component',
  template: … ,
  providers: [
    { provide: Foo, useValue: foo }
  ]
})
export class MyComponent {}

```

کامپایلر component factory را که شامل کد provider مربوط به `useValue` است، در module جداگانه‌ای تولید می‌کند. _آن_ module مربوط به factory نمی‌تواند برای دسترسی به متغیر محلی \(exportنشده\) یعنی `foo` به _این_ module منبع برگردد.

می‌توانید با مقداردهی اولیه `foo` مشکل را برطرف کنید.

```ts
let foo = 42; // initialized
```

کامپایلر expression را در provider [fold](tools/cli/aot-compiler#code-folding) می‌کند؛ گویی کد زیر را نوشته‌اید.

```ts
providers: [{provide: Foo, useValue: 42}];
```

راه دیگر این است که `foo` را export کنید، با این انتظار که در runtime و زمانی که مقدار آن مشخص شد به `foo` مقدار داده شود.

```ts
// CORRECTED
export let foo: number; // exported

@Component({
  selector: 'my-component',
  template: … ,
  providers: [
    { provide: Foo, useValue: foo }
  ]
})
export class MyComponent {}
```

افزودن `export` اغلب برای متغیرهایی جواب می‌دهد که در metadataهایی مانند `providers` و `animations` به آن‌ها ارجاع شده است، زیرا کامپایلر می‌تواند در این expressionها _ارجاع‌هایی_ به متغیرهای exportشده تولید کند. کامپایلر به _مقدار_ آن متغیرها نیاز ندارد.

اگر کامپایلر برای تولید کد به _مقدار واقعی_ نیاز داشته باشد، افزودن `export` کارساز نیست.
برای نمونه، این روش برای property به نام `template` عمل نمی‌کند.

```ts
// ERROR
export let someTemplate: string; // exported but not initialized

@Component({
  selector: 'my-component',
  template: someTemplate,
})
export class MyComponent {}
```

کامپایلر برای تولید component factory _همین حالا_ به مقدار property به نام `template` نیاز دارد.
ارجاع به متغیر به‌تنهایی کافی نیست.
افزودن `export` به ابتدای declaration تنها خطای جدید «[`Only initialized variables and constants can be referenced`](#only-initialized-variables-and-constants)» را ایجاد می‌کند.

## فقط متغیرها و ثابت‌های مقداردهی‌شده

HELPFUL: _فقط می‌توان به متغیرها و ثابت‌های مقداردهی‌شده ارجاع داد، زیرا template compiler به مقدار این متغیر نیاز دارد._

کامپایلر ارجاعی به یک متغیر exportشده یا static field بدون مقدار اولیه پیدا کرده است.
برای تولید کد به مقدار آن متغیر نیاز دارد.

نمونه زیر تلاش می‌کند property به نام `template` مربوط به component را برابر متغیر exportشده `someTemplate` قرار دهد؛ متغیری که declaration شده اما _مقداری به آن اختصاص نیافته است_.

```ts
// ERROR
export let someTemplate: string;

@Component({
  selector: 'my-component',
  template: someTemplate,
})
export class MyComponent {}
```

اگر `someTemplate` را از module دیگری import کرده باشید اما در آنجا نیز مقداردهی اولیه نکرده باشید، همین خطا رخ می‌دهد.

```ts
// ERROR - not initialized there either
import {someTemplate} from './config';

@Component({
  selector: 'my-component',
  template: someTemplate,
})
export class MyComponent {}
```

کامپایلر نمی‌تواند برای دریافت اطلاعات template تا runtime منتظر بماند.
باید مقدار متغیر `someTemplate` را به‌صورت static از کد منبع به دست آورد تا بتواند component factory را تولید کند؛ factoryای که دستورالعمل‌های ساخت element بر اساس template را در بر می‌گیرد.

برای اصلاح این خطا، مقدار اولیه متغیر را در یک initializer clause _در همان خط_ ارائه کنید.

```ts
// CORRECTED
export let someTemplate = '<h1>Greetings from Angular</h1>';

@Component({
  selector: 'my-component',
  template: someTemplate,
})
export class MyComponent {}
```

## ارجاع به یک class exportنشده

HELPFUL: _ارجاع به class exportنشده `<class name>`._
_class را export کنید._

metadata به classای ارجاع داده است که export نشده بود.

برای نمونه، ممکن است classای تعریف کرده و آن را به‌عنوان injection token در آرایه providers به کار برده باشید، اما export کردن آن را فراموش کرده باشید.

```ts
// ERROR
abstract class MyStrategy { }

  …
  providers: [
    { provide: MyStrategy, useValue: … }
  ]
  …
```

انگولار یک class factory در module جداگانه‌ای تولید می‌کند و این factory [فقط می‌تواند به classهای exportشده دسترسی داشته باشد](tools/cli/aot-compiler#public-or-protected-symbols).
برای اصلاح این خطا، class مورد ارجاع را export کنید.

```ts
// CORRECTED
export abstract class MyStrategy { }

  …
  providers: [
    { provide: MyStrategy, useValue: … }
  ]
  …
```

## ارجاع به یک تابع exportنشده

HELPFUL: _metadata به تابعی ارجاع داده که export نشده است._

برای نمونه، ممکن است property به نام `useFactory` مربوط به یک provider را روی تابعی محلی تنظیم کرده باشید که export کردن آن را فراموش کرده‌اید.

```ts
// ERROR
function myStrategy() { … }

  …
  providers: [
    { provide: MyStrategy, useFactory: myStrategy }
  ]
  …
```

انگولار یک class factory در module جداگانه‌ای تولید می‌کند و این factory [فقط می‌تواند به توابع exportشده دسترسی داشته باشد](tools/cli/aot-compiler#public-or-protected-symbols).
برای اصلاح این خطا، تابع را export کنید.

```ts
// CORRECTED
export function myStrategy() { … }

  …
  providers: [
    { provide: MyStrategy, useFactory: myStrategy }
  ]
  …
```

## متغیر یا ثابت destructureشده پشتیبانی نمی‌شود

HELPFUL: _template compiler از ارجاع به متغیر یا ثابت exportشده‌ای که destructure شده باشد پشتیبانی نمی‌کند. برای پرهیز از destructuring آن را ساده‌سازی کنید._

کامپایلر از ارجاع به متغیرهایی که با [destructuring](https://www.typescriptlang.org/docs/handbook/variable-declarations.html#destructuring) مقدار گرفته‌اند پشتیبانی نمی‌کند.

برای نمونه، نمی‌توانید چیزی شبیه کد زیر بنویسید:

```ts
// ERROR
import { configuration } from './configuration';

// destructured assignment to foo and bar
const {foo, bar} = configuration;
  …
  providers: [
    {provide: Foo, useValue: foo},
    {provide: Bar, useValue: bar},
  ]
  …
```

برای اصلاح این خطا به مقادیری ارجاع دهید که destructure نشده‌اند.

```ts
// CORRECTED
import { configuration } from './configuration';
  …
  providers: [
    {provide: Foo, useValue: configuration.foo},
    {provide: Bar, useValue: configuration.bar},
  ]
  …
```

## نوع قابل resolve نیست

HELPFUL: _کامپایلر با نوعی روبه‌رو شده و نمی‌تواند تعیین کند کدام module آن نوع را export می‌کند._

این وضعیت ممکن است هنگام ارجاع به یک ambient type رخ دهد.
برای نمونه، نوع `Window` یک ambient type است که در فایل سراسری `.d.ts` تعریف شده است.

اگر در constructor مربوط به component به آن ارجاع دهید، خطا دریافت می‌کنید؛ زیرا کامپایلر باید آن را به‌صورت static تحلیل کند.

```ts
// ERROR
@Component({ })
export class MyComponent {
  constructor (private win: Window) { … }
}
```

TypeScript انواع ambient را درک می‌کند، بنابراین آن‌ها را import نمی‌کنید.
کامپایلر انگولار نوعی را که export یا import نکرده‌اید درک نمی‌کند.

در این مورد، کامپایلر نمی‌داند چگونه چیزی را با token به نام `Window` inject کند.

در expressionهای metadata به ambient typeها ارجاع ندهید.

اگر مجبورید نمونه‌ای از یک ambient type را inject کنید، می‌توانید با چهار مرحله مشکل را مدیریت کنید:

1. برای نمونه ambient type یک injection token ایجاد کنید.
1. تابع factoryای ایجاد کنید که آن نمونه را برگرداند.
1. یک provider از نوع `useFactory` با آن تابع factory اضافه کنید.
1. برای inject کردن نمونه از `@Inject` استفاده کنید.

نمونه‌ای گویا:

```ts
// CORRECTED
import { Inject } from '@angular/core';

export const WINDOW = new InjectionToken('Window');
export function _window() { return window; }

@Component({
  …
  providers: [
    { provide: WINDOW, useFactory: _window }
  ]
})
export class MyComponent {
  constructor (@Inject(WINDOW) private win: Window) { … }
}
```

وجود نوع `Window` در constructor دیگر برای کامپایلر مشکلی ایجاد نمی‌کند، زیرا برای تولید کد injection از `@Inject(WINDOW)` استفاده می‌کند.

انگولار برای token به نام `DOCUMENT` نیز کاری مشابه انجام می‌دهد تا بتوانید شیء `document` مرورگر \(یا انتزاعی از آن، بسته به پلتفرمی که application روی آن اجرا می‌شود\) را inject کنید.

```ts
import { Inject }   from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({ … })
export class MyComponent {
  constructor (@Inject(DOCUMENT) private doc: Document) { … }
}
```

## نام مورد انتظار است

HELPFUL: _کامپایلر در expression در حال ارزیابی، انتظار یک نام را داشت._

این مشکل ممکن است زمانی رخ دهد که مانند نمونه زیر از عدد به‌عنوان نام property استفاده کنید.

```ts
// ERROR
provider: [{provide: Foo, useValue: {0: 'test'}}];
```

نام property را به مقداری غیرعددی تغییر دهید.

```ts
// CORRECTED
provider: [{provide: Foo, useValue: {'0': 'test'}}];
```

## نام عضو enum پشتیبانی نمی‌شود

HELPFUL: _انگولار نتوانست مقدار [عضو enum](https://www.typescriptlang.org/docs/handbook/enums.html) مورد ارجاع در metadata را تعیین کند._

کامپایلر می‌تواند مقادیر ساده enum را درک کند، اما مقادیر پیچیده‌ای مانند مقادیر حاصل از propertyهای محاسبه‌شده را نمی‌فهمد.

```ts
// ERROR
enum Colors {
  Red = 1,
  White,
  Blue = "Blue".length // computed
}

  …
  providers: [
    { provide: BaseColor,   useValue: Colors.White } // ok
    { provide: DangerColor, useValue: Colors.Red }   // ok
    { provide: StrongColor, useValue: Colors.Blue }  // bad
  ]
  …
```

از ارجاع به enumهایی با initializerهای پیچیده یا propertyهای محاسبه‌شده خودداری کنید.

## expressionهای tagged template پشتیبانی نمی‌شوند

HELPFUL: _expressionهای tagged template در metadata پشتیبانی نمی‌شوند._

کامپایلر با یک [tagged template expression](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals) مربوط به JavaScript ES2015 مانند نمونه زیر روبه‌رو شده است.

```ts

// ERROR
const expression = 'funky';
const raw = String.raw`A tagged template ${expression} string`;
 …
 template: '<div>' + raw + '</div>'
 …

```

[`String.raw()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/raw) یک _tag function_ بومی JavaScript ES2015 است.

کامپایلر AOT از tagged template expressionها پشتیبانی نمی‌کند؛ از آن‌ها در expressionهای metadata استفاده نکنید.

## ارجاع به نماد مورد انتظار است

HELPFUL: _کامپایلر در محلی که پیام خطا مشخص کرده، انتظار ارجاع به یک نماد را داشت._

این خطا ممکن است زمانی رخ دهد که در clause مربوط به `extends` یک class از expression استفاده کنید.

<!--todo: Chuck: After reviewing your PR comment I'm still at a loss. See [comment there](https://github.com/angular/angular/pull/17712#discussion_r132025495). -->
