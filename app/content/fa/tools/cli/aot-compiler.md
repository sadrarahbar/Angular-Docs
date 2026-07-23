# کامپایل پیش از اجرا (AOT)

یک برنامه Angular عمدتاً از کامپوننت‌ها و templateهای HTML آن‌ها تشکیل شده است.
از آنجا که مرورگر نمی‌تواند کامپوننت‌ها و templateهای ارائه‌شده توسط Angular را مستقیماً درک کند، برنامه‌های Angular پیش از اجرا در مرورگر به فرایند کامپایل نیاز دارند.

کامپایلر پیش از اجرای Angular یا AOT، کد HTML و TypeScript مربوط به Angular را در مرحله build و _پیش از_ آنکه مرورگر کد را دانلود و اجرا کند، به کد JavaScript کارآمد تبدیل می‌کند.
کامپایل برنامه در فرایند build باعث render سریع‌تر در مرورگر می‌شود.

این راهنما توضیح می‌دهد چگونه metadata را مشخص کنید و گزینه‌های موجود کامپایلر را برای کامپایل کارآمد برنامه‌ها با کامپایلر AOT به‌کار ببرید.

HELPFUL: [توضیحات Alex Rickabaugh درباره کامپایلر Angular را تماشا کنید](https://www.youtube.com/watch?v=anphffaCZrQ) که در AngularConnect 2019 ارائه شده است.

در ادامه برخی دلایل استفاده از AOT آمده است.

| دلیل | جزئیات |
| :--- | :--- |
| render سریع‌تر | با AOT، مرورگر نسخه ازپیش‌کامپایل‌شده برنامه را دانلود می‌کند. مرورگر کد اجرایی را بارگذاری می‌کند تا بدون انتظار برای کامپایل اولیه برنامه، آن را بلافاصله render کند. |
| درخواست‌های ناهمگام کمتر | کامپایلر، templateهای HTML و stylesheetهای CSS خارجی را در JavaScript برنامه _درج_ می‌کند و درخواست‌های جداگانه ajax برای این فایل‌های مبدأ را از بین می‌برد. |
| حجم دانلود کمتر framework مربوط به Angular | اگر برنامه از قبل کامپایل شده باشد، نیازی به دانلود کامپایلر Angular نیست. حجم کامپایلر تقریباً نصف خود Angular است؛ بنابراین حذف آن payload برنامه را به‌شدت کاهش می‌دهد. |
| تشخیص زودهنگام خطاهای template | کامپایلر AOT خطاهای binding در template را طی مرحله build و پیش از آنکه کاربران آن‌ها را ببینند، تشخیص داده و گزارش می‌کند. |
| امنیت بهتر | AOT مدت‌ها پیش از ارائه فایل‌ها به client،‏ templateهای HTML و کامپوننت‌ها را به فایل‌های JavaScript کامپایل می‌کند. چون templateای برای خواندن و ارزیابی پرخطر HTML یا JavaScript در سمت client وجود ندارد، فرصت‌های کمتری برای حملات injection فراهم می‌شود. |

## انتخاب کامپایلر

Angular دو روش برای کامپایل برنامه ارائه می‌کند:

| روش کامپایل Angular | جزئیات |
| :--- | :--- |
| Just-in-Time \(JIT\) | برنامه را هنگام اجرا در مرورگر کامپایل می‌کند. این روش تا Angular 8 پیش‌فرض بود. |
| Ahead-of-Time \(AOT\) | برنامه و کتابخانه‌ها را هنگام build کامپایل می‌کند. از Angular 9 به بعد این روش پیش‌فرض است. |

هنگام اجرای دستورهای CLI به نام [`ng build`](cli/build) \(فقط build\) یا [`ng serve`](cli/serve) \(build و ارائه محلی\)، نوع کامپایل \(JIT یا AOT\) به مقدار ویژگی `aot` در پیکربندی build مشخص‌شده در `angular.json` بستگی دارد.
مقدار پیش‌فرض `aot` در برنامه‌های جدید CLI برابر `true` است.

برای اطلاعات بیشتر، [مرجع دستورهای CLI](cli) و [build و ارائه برنامه‌های Angular](tools/cli/build) را ببینید.

## نحوه کار AOT

کامپایلر AOT در Angular برای تفسیر بخش‌هایی از برنامه که Angular باید مدیریت کند، **metadata** را استخراج می‌کند.
می‌توانید metadata را به‌طور صریح در **decorator**هایی مانند `@Component()` یا به‌طور ضمنی در declarationهای constructor کلاس‌های decorateشده مشخص کنید.
metadata به Angular می‌گوید چگونه instanceهایی از کلاس‌های برنامه بسازد و هنگام اجرا با آن‌ها تعامل داشته باشد.

در نمونه زیر، شیء metadata مربوط به `@Component()` و constructor کلاس به Angular می‌گویند چگونه یک instance از `Typical` را ایجاد و نمایش دهد.

```angular-ts
@Component({
  selector: 'app-typical',
  template: '<div>A typical component for {{data.name}}</div>',
})
export class Typical {
  data = input.required<TypicalData>();
  private someService = inject(SomeService);
}
```

کامپایلر Angular metadata را _یک بار_ استخراج کرده و یک _factory_ برای `Typical` تولید می‌کند.
هرگاه Angular به ایجاد instanceای از `Typical` نیاز داشته باشد، factory را فراخوانی می‌کند؛ factory نیز یک عنصر بصری جدید تولید می‌کند که به instance جدیدی از کلاس کامپوننت با dependency تزریق‌شده آن bind شده است.

### مراحل کامپایل

کامپایل AOT سه مرحله دارد.

|     | مرحله | جزئیات |
| :-- | :--- | :--- |
| 1 | تحلیل کد | در این مرحله، کامپایلر TypeScript و _جمع‌آوری‌کننده AOT_ نمایشی از مبدأ ایجاد می‌کنند. جمع‌آوری‌کننده برای تفسیر metadata جمع‌آوری‌شده تلاشی نمی‌کند؛ metadata را تا حد ممکن بازنمایی کرده و در صورت تشخیص نقض syntax مربوط به metadata، خطاها را ثبت می‌کند. |
| 2 | تولید کد | در این مرحله، `StaticReflector` کامپایلر metadata جمع‌آوری‌شده در مرحله 1 را تفسیر می‌کند، اعتبارسنجی بیشتری روی آن انجام می‌دهد و در صورت تشخیص نقض محدودیت metadata خطا ایجاد می‌کند. |
| 3 | بررسی نوع template | در این مرحله اختیاری، _کامپایلر template_ در Angular از کامپایلر TypeScript برای اعتبارسنجی عبارت‌های binding در templateها استفاده می‌کند. با تنظیم صریح گزینه پیکربندی `strictTemplates` می‌توانید این مرحله را فعال کنید؛ [گزینه‌های کامپایلر Angular](reference/configs/angular-compiler-options) را ببینید. |

### محدودیت‌های metadata

metadata را در _زیرمجموعه‌ای_ از TypeScript می‌نویسید که باید با محدودیت‌های کلی زیر مطابقت داشته باشد:

- [syntax عبارت](#expression-syntax-limitations) را به زیرمجموعه پشتیبانی‌شده JavaScript محدود کنید
- پس از [fold کردن کد](#code-folding) تنها به symbolهای exportشده reference دهید
- تنها [توابع پشتیبانی‌شده](#supported-classes-and-functions) توسط کامپایلر را فراخوانی کنید
- Input/Outputها و اعضای کلاس که data binding دارند باید public یا protected باشند. برای راهنمایی‌ها و دستورالعمل‌های بیشتر درباره آماده‌سازی برنامه برای کامپایل AOT، بخش [Angular: نوشتن برنامه‌های سازگار با AOT](https://medium.com/sparkles-blog/angular-writing-aot-friendly-applications-7b64c8afbe3f) را ببینید.

HELPFUL: خطاهای کامپایل AOT معمولاً به‌دلیل metadataای رخ می‌دهند که با الزامات کامپایلر مطابقت ندارد \(این الزامات در ادامه با جزئیات بیشتری توضیح داده شده‌اند\).
برای کمک به درک و رفع این مشکلات، [خطاهای Metadata در AOT](tools/cli/aot-metadata-errors) را ببینید.

### پیکربندی کامپایل AOT

می‌توانید گزینه‌ها را در [فایل پیکربندی TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) که فرایند کامپایل را کنترل می‌کند، ارائه دهید.
برای فهرست کامل گزینه‌های موجود، [گزینه‌های کامپایلر Angular](reference/configs/angular-compiler-options) را ببینید.

## مرحله 1: تحلیل کد

کامپایلر TypeScript بخشی از کار تحلیلی مرحله نخست را انجام می‌دهد.
این کامپایلر فایل‌های _تعریف نوع_ با پسوند `.d.ts` را همراه با اطلاعات نوع مورد نیاز کامپایلر AOT برای تولید کد برنامه خروجی می‌دهد.
هم‌زمان، **جمع‌آوری‌کننده** AOT،‏ metadata ثبت‌شده در decoratorهای Angular را تحلیل کرده و اطلاعات metadata را در فایل‌های **`.metadata.json`**، به‌ازای هر فایل `.d.ts` یک فایل، خروجی می‌دهد.

می‌توانید `.metadata.json` را نموداری از ساختار کلی metadata یک decorator در نظر بگیرید که به‌شکل [درخت syntax انتزاعی (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree) بازنمایی شده است.

HELPFUL: فایل [schema.ts](https://github.com/angular/angular/blob/main/packages/compiler-cli/src/metadata/schema.ts) در Angular، قالب JSON را به‌صورت مجموعه‌ای از interfaceهای TypeScript توصیف می‌کند.

### محدودیت‌های syntax عبارت

جمع‌آوری‌کننده AOT تنها زیرمجموعه‌ای از JavaScript را درک می‌کند.
اشیای metadata را با syntax محدود زیر تعریف کنید:

| syntax | نمونه |
| :--- | :--- |
| شیء literal | `{cherry: true, apple: true, mincemeat: false}` |
| آرایه literal | `['cherries', 'flour', 'sugar']` |
| Spread در آرایه literal | `['apples', 'flour', …]` |
| فراخوانی‌ها | `bake(ingredients)` |
| New | `new Oven()` |
| دسترسی به ویژگی | `pie.slice` |
| index آرایه | `ingredients[0]` |
| reference هویت | `Component` |
| یک template string | <code>`pie is ${multiplier} times better than cake`</code> |
| رشته literal | `'pi'` |
| عدد literal | `3.14153265` |
| مقدار Boolean به‌شکل literal | `true` |
| null به‌شکل literal | `null` |
| عملگر prefix پشتیبانی‌شده | `!cake` |
| عملگر binary پشتیبانی‌شده | `a+b` |
| عملگر شرطی | `a ? b : c` |
| پرانتز | `(a+b)` |

اگر عبارتی از syntax پشتیبانی‌نشده استفاده کند، جمع‌آوری‌کننده یک گره خطا در فایل `.metadata.json` می‌نویسد.
اگر کامپایلر بعداً برای تولید کد برنامه به آن بخش از metadata نیاز داشته باشد، خطا را گزارش می‌کند.

HELPFUL: اگر می‌خواهید `ngc` به‌جای تولید فایل `.metadata.json` حاوی خطا، خطاهای syntax را بلافاصله گزارش دهد، گزینه `strictMetadataEmit` را در فایل پیکربندی TypeScript تنظیم کنید.

```json

"angularCompilerOptions": {
  …
  "strictMetadataEmit" : true
}

```

این گزینه در کتابخانه‌های Angular فعال است تا همه فایل‌های `.metadata.json` مربوط به Angular پاک باشند؛ انجام همین کار هنگام ساخت کتابخانه‌های خودتان نیز یک روش پیشنهادی است.

### نبود پشتیبانی از arrow functionها

کامپایلر AOT از [عبارت‌های function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/function)
و [arrow functionها](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions)، که _تابع lambda_ نیز نامیده می‌شوند، پشتیبانی نمی‌کند.

decorator کامپوننت زیر را در نظر بگیرید:

```ts

@Component({
  …
  providers: [{provide: server, useFactory: () => new Server()}]
})

```

جمع‌آوری‌کننده AOT از arrow function به‌شکل `() => new Server()` در عبارت metadata پشتیبانی نمی‌کند.
این ابزار به‌جای تابع یک گره خطا تولید می‌کند.
وقتی کامپایلر بعداً این گره را تفسیر می‌کند، خطایی گزارش می‌دهد که از شما می‌خواهد arrow function را به یک _تابع exportشده_ تبدیل کنید.

می‌توانید با تبدیل آن به کد زیر خطا را برطرف کنید:

```ts

export function serverFactory() {
  return new Server();
}

@Component({
  …
  providers: [{provide: server, useFactory: serverFactory}]
})

```

در نسخه 5 و نسخه‌های بعد، کامپایلر این بازنویسی را هنگام خروجی دادن فایل `.js` به‌طور خودکار انجام می‌دهد.

### fold کردن کد

کامپایلر تنها می‌تواند referenceهای مربوط به symbolهای **_exportشده_** را resolve کند.
با این حال، جمع‌آوری‌کننده می‌تواند یک عبارت را هنگام جمع‌آوری ارزیابی کرده و به‌جای عبارت اصلی، نتیجه را در `.metadata.json` ثبت کند.
این قابلیت امکان استفاده محدود از symbolهای exportنشده را درون عبارت‌ها فراهم می‌کند.

برای نمونه، جمع‌آوری‌کننده می‌تواند عبارت `1 + 2 + 3 + 4` را ارزیابی کرده و با نتیجه آن، یعنی `10`، جایگزین کند.
این فرایند _fold کردن_ نام دارد.
عبارتی که بتوان آن را به این شکل کاهش داد، _قابل fold_ است.

جمع‌آوری‌کننده می‌تواند referenceهای declarationهای `const` محلی module و declarationهای مقداردهی‌شده `var` و `let` را ارزیابی کند و عملاً آن‌ها را از فایل `.metadata.json` حذف کند.

تعریف کامپوننت زیر را در نظر بگیرید:

```angular-ts
const template = '<div>{{hero().name}}</div>';

@Component({
  selector: 'app-hero',
  template: template,
})
export class Hero {
  hero = input.required<Hero>();
}
```

کامپایلر نمی‌تواند به ثابت `template` reference دهد، زیرا export نشده است.
با این حال، جمع‌آوری‌کننده می‌تواند با درج مستقیم محتوای ثابت `template` در تعریف metadata، آن را fold کند.
اثر این کار مانند آن است که نوشته باشید:

```angular-ts
@Component({
  selector: 'app-hero',
  template: '<div>{{hero().name}}</div>',
})
export class Hero {
  hero = input.required<Hero>();
}
```

دیگر referenceای به `template` وجود ندارد و بنابراین وقتی کامپایلر بعداً خروجی _جمع‌آوری‌کننده_ در `.metadata.json` را تفسیر می‌کند، چیزی باعث مشکل نخواهد شد.

می‌توانید با استفاده از ثابت `template` در عبارت دیگری، این نمونه را یک گام جلوتر ببرید:

```angular-ts
const template = '<div>{{hero().name}}</div>';

@Component({
  selector: 'app-hero',
  template: template + '<div>{{hero().title}}</div>',
})
export class Hero {
  hero = input.required<Hero>();
}
```

جمع‌آوری‌کننده این عبارت را به رشته _foldشده_ معادل آن کاهش می‌دهد:

```angular-ts
'<div>{{hero().name}}</div><div>{{hero().title}}</div>';
```

#### syntax قابل fold

جدول زیر عبارت‌هایی را شرح می‌دهد که جمع‌آوری‌کننده می‌تواند یا نمی‌تواند fold کند:

| syntax | قابلیت fold |
| :--- | :--- |
| شیء literal | بله |
| آرایه literal | بله |
| Spread در آرایه literal | خیر |
| فراخوانی‌ها | خیر |
| New | خیر |
| دسترسی به ویژگی | بله، اگر target قابل fold باشد |
| index آرایه | بله، اگر target و index قابل fold باشند |
| reference هویت | بله، اگر reference به یک مقدار محلی باشد |
| template بدون جای‌گذاری | بله |
| template دارای جای‌گذاری | بله، اگر جای‌گذاری‌ها قابل fold باشند |
| رشته literal | بله |
| عدد literal | بله |
| مقدار Boolean به‌شکل literal | بله |
| null به‌شکل literal | بله |
| عملگر prefix پشتیبانی‌شده | بله، اگر operand قابل fold باشد |
| عملگر binary پشتیبانی‌شده | بله، اگر هر دو سمت چپ و راست قابل fold باشند |
| عملگر شرطی | بله، اگر شرط قابل fold باشد |
| پرانتز | بله، اگر عبارت قابل fold باشد |

اگر عبارتی قابل fold نباشد، جمع‌آوری‌کننده آن را به‌شکل یک [AST](https://en.wikipedia.org/wiki/Abstract*syntax*tree) در `.metadata.json` می‌نویسد تا کامپایلر آن را resolve کند.

## مرحله 2: تولید کد

جمع‌آوری‌کننده برای درک metadataای که جمع‌آوری کرده و در `.metadata.json` خروجی می‌دهد تلاشی نمی‌کند.
این ابزار metadata را تا حد ممکن بازنمایی کرده و هنگام تشخیص نقض syntax مربوط به metadata، خطاها را ثبت می‌کند.
تفسیر `.metadata.json` در مرحله تولید کد برعهده کامپایلر است.

کامپایلر همه شکل‌های syntax پشتیبانی‌شده توسط جمع‌آوری‌کننده را درک می‌کند، اما اگر _معنای_ metadata صحیح از نظر _syntax_ قوانین کامپایلر را نقض کند، ممکن است آن را رد کند.

### symbolهای public یا protected

کامپایلر تنها می‌تواند به _symbolهای exportشده_ reference دهد.

- اعضای کلاس کامپوننت decorateشده باید public یا protected باشند.
  نمی‌توانید یک ویژگی `input()` را private کنید.

- ویژگی‌های دارای data binding نیز باید public یا protected باشند

### کلاس‌ها و توابع پشتیبانی‌شده

تا زمانی که syntax معتبر باشد، جمع‌آوری‌کننده می‌تواند فراخوانی تابع یا ایجاد شیء با `new` را بازنمایی کند.
با این حال، کامپایلر ممکن است بعداً از تولید فراخوانی یک تابع _خاص_ یا ایجاد یک شیء _خاص_ خودداری کند.

کامپایلر فقط می‌تواند instanceهایی از کلاس‌های مشخص ایجاد کند، تنها از decoratorهای هسته پشتیبانی می‌کند و فقط فراخوانی macroها \(توابع یا متدهای static\) را که عبارت برمی‌گردانند پشتیبانی می‌کند.

| عملکرد کامپایلر | جزئیات |
| :--- | :--- |
| instanceهای جدید | کامپایلر فقط metadataای را مجاز می‌داند که instanceهایی از کلاس `InjectionToken` در `@angular/core` ایجاد کند. |
| decoratorهای پشتیبانی‌شده | کامپایلر فقط از metadata مربوط به [decoratorهای Angular در module به نام `@angular/core`](/api?type=decorator) پشتیبانی می‌کند. |
| فراخوانی تابع | توابع factory باید exportشده و نام‌گذاری‌شده باشند. کامپایلر AOT از عبارت‌های lambda \("arrow functionها"\) برای توابع factory پشتیبانی نمی‌کند. |

### فراخوانی تابع و متد static

جمع‌آوری‌کننده هر تابع یا متد static حاوی یک دستور `return` را می‌پذیرد.
با این حال، کامپایلر فقط macroهایی را به‌شکل تابع یا متد static پشتیبانی می‌کند که یک _عبارت_ برمی‌گردانند.

برای نمونه، تابع زیر را در نظر بگیرید:

```ts
export function wrapInArray<T>(value: T): T[] {
  return [value];
}
```

می‌توانید `wrapInArray` را در تعریف metadata فراخوانی کنید، زیرا مقدار عبارتی را برمی‌گرداند که با زیرمجموعه محدود JavaScript مورد پذیرش کامپایلر مطابقت دارد.

ممکن است `wrapInArray()` را به این شکل به‌کار ببرید:

```ts
@NgModule({
  declarations: wrapInArray(Typical),
})
export class TypicalModule {}
```

کامپایلر با این کاربرد مانند کد زیر رفتار می‌کند:

```ts
@NgModule({
  declarations: [Typical],
})
export class TypicalModule {}
```

کلاس [`RouterModule`](api/router/RouterModule) در Angular دو متد static از نوع macro به نام‌های `forRoot` و `forChild` را export می‌کند تا به تعریف routeهای ریشه و فرزند کمک کند.
[کد مبدأ](https://github.com/angular/angular/blob/main/packages/router/src/router_module.ts#L139 'RouterModule.forRoot source code')
این متدها را بررسی کنید تا ببینید macroها چگونه می‌توانند پیکربندی [NgModuleهای](guide/ngmodules/overview) پیچیده را ساده کنند.

### بازنویسی metadata

کامپایلر با object literalهای حاوی فیلدهای `useClass`،‏ `useValue`،‏ `useFactory` و `data` به‌شکل ویژه‌ای رفتار می‌کند و عبارت مقداردهنده هر یک از این فیلدها را به متغیری exportشده تبدیل می‌کند که جایگزین عبارت می‌شود.
این فرایند بازنویسی عبارت‌ها همه محدودیت‌های مربوط به محتوای آن‌ها را از میان برمی‌دارد، زیرا
کامپایلر نیازی به دانستن مقدار عبارت ندارد — فقط باید بتواند referenceای به مقدار تولید کند.

ممکن است چیزی شبیه کد زیر بنویسید:

```ts
class TypicalServer {}

@NgModule({
  providers: [{provide: SERVER, useFactory: () => TypicalServer}],
})
export class TypicalModule {}
```

این کد بدون بازنویسی نامعتبر است، زیرا lambdaها پشتیبانی نمی‌شوند و `TypicalServer` نیز export نشده است.
برای مجاز کردن آن، کامپایلر به‌طور خودکار کد را تقریباً به شکل زیر بازنویسی می‌کند:

```ts
class TypicalServer {}

export const θ0 = () => new TypicalServer();

@NgModule({
  providers: [{provide: SERVER, useFactory: θ0}],
})
export class TypicalModule {}
```

این کار به کامپایلر اجازه می‌دهد بدون نیاز به دانستن محتوای مقدار `θ0`، در factory به `θ0` reference دهد.

کامپایلر بازنویسی را هنگام خروجی دادن فایل `.js` انجام می‌دهد.
با این حال، فایل `.d.ts` را بازنویسی نمی‌کند؛ بنابراین TypeScript آن را به‌عنوان export تشخیص نمی‌دهد.
این کار با API خروجی ES module نیز تداخلی ندارد.

## مرحله 3: بررسی نوع template

یکی از مفیدترین قابلیت‌های کامپایلر Angular، امکان بررسی نوع عبارت‌های درون templateها و یافتن خطاها پیش از ایجاد crash هنگام اجرا است.
در مرحله بررسی نوع template، کامپایلر template در Angular از کامپایلر TypeScript برای اعتبارسنجی عبارت‌های binding در templateها استفاده می‌کند.

این مرحله را با افزودن صریح گزینه کامپایلر `"strictTemplates"` به `"angularCompilerOptions"` در فایل پیکربندی TypeScript پروژه فعال کنید
\([گزینه‌های کامپایلر Angular](reference/configs/angular-compiler-options) را ببینید\).

اگر هنگام اعتبارسنجی template یک خطای نوع در عبارت binding تشخیص داده شود، پیام خطایی مشابه گزارش خطاهای نوع توسط کامپایلر TypeScript برای کد در فایل
`.ts` تولید می‌شود.

برای نمونه، کامپوننت زیر را در نظر بگیرید:

```angular-ts
@Component({
  selector: 'my-component',
  template: '{{person.addresss.street}}',
})
class MyComponent {
  person?: Person;
}
```

این کد خطای زیر را تولید می‌کند:

```shell {hideCopy}

my.component.ts.MyComponent.html(1,1): : Property 'addresss' does not exist on type 'Person'. Did you mean 'address'?

```

نام فایل گزارش‌شده در پیام خطا، یعنی `my.component.ts.MyComponent.html`، فایلی مصنوعی است
که کامپایلر template تولید می‌کند و محتوای template کلاس `MyComponent` را در خود نگه می‌دارد.
کامپایلر هرگز این فایل را روی دیسک نمی‌نویسد.
شماره خط و ستون نسبت به رشته template در annotation به نام `@Component` کلاس، در اینجا `MyComponent`، محاسبه می‌شوند.
اگر کامپوننت به‌جای `template` از `templateUrl` استفاده کند، خطاها به‌جای فایل مصنوعی، در فایل HTML مورد reference توسط `templateUrl` گزارش می‌شوند.

محل خطا ابتدای text nodeای است که عبارت interpolation خطادار را در بر دارد.
اگر خطا در attribute bindingای مانند `[value]="person.address.street"` باشد، محل
خطا همان محل attribute حاوی خطا است.

اعتبارسنجی از بررسی‌کننده نوع TypeScript و گزینه‌های ارائه‌شده به کامپایلر TypeScript برای کنترل میزان جزئیات اعتبارسنجی نوع استفاده می‌کند.
برای نمونه، اگر `strictTypeChecks` مشخص شده باشد، خطای

```shell {hideCopy}

my.component.ts.MyComponent.html(1,1): : Object is possibly 'undefined'

```

همراه با پیام خطای بالا گزارش می‌شود.

### محدود کردن نوع

عبارت استفاده‌شده در directive به نام `ngIf` برای محدود کردن type unionها در کامپایلر
template مربوط به Angular به‌کار می‌رود؛ درست مانند کاری که عبارت `if` در TypeScript انجام می‌دهد.
برای نمونه، برای جلوگیری از خطای `Object is possibly 'undefined'` در template بالا، آن را طوری تغییر دهید که تنها در صورت مقداردهی اولیه `person` عبارت interpolation را خروجی دهد:

```angular-ts
@Component({
  selector: 'my-component',
  template: '<span *ngIf="person"> {{person.address.street}} </span>',
})
class MyComponent {
  person?: Person;
}
```

استفاده از `*ngIf` به کامپایلر TypeScript اجازه می‌دهد استنتاج کند `person` استفاده‌شده در عبارت binding هرگز `undefined` نخواهد بود.

برای اطلاعات بیشتر درباره محدود کردن نوع ورودی، [بهبود بررسی نوع template برای directiveهای سفارشی](/guide/directives/structural-directives#improving-template-type-checking-for-custom-directives) را ببینید.

### عملگر non-null type assertion

هنگامی که استفاده از `*ngIf` مناسب نیست، یا محدودیتی در کامپوننت تضمین می‌کند عبارت در زمان interpolation شدن binding همیشه non-null است، برای پنهان کردن خطای `Object is possibly 'undefined'` از عملگر non-null type assertion استفاده کنید.

در نمونه زیر، ویژگی‌های `person` و `address` همیشه با هم تنظیم می‌شوند؛ یعنی اگر `person` مقدار non-null داشته باشد، `address` نیز همیشه non-null است.
روش مناسبی برای شرح این محدودیت به TypeScript و کامپایلر template وجود ندارد، اما در نمونه با استفاده از `address!.street` خطا پنهان می‌شود.

```angular-ts
@Component({
  selector: 'my-component',
  template: '<span *ngIf="person"> {{person.name}} lives on {{address!.street}} </span>',
})
class MyComponent {
  person?: Person;
  address?: Address;

  setData(person: Person, address: Address) {
    this.person = person;
    this.address = address;
  }
}
```

باید از عملگر non-null assertion با احتیاط استفاده کرد، زیرا refactor کردن کامپوننت ممکن است این محدودیت را نقض کند.

در این نمونه توصیه می‌شود بررسی `address` را نیز مانند کد زیر در `*ngIf` قرار دهید:

```angular-ts
@Component({
  selector: 'my-component',
  template: '<span *ngIf="person && address"> {{person.name}} lives on {{address.street}} </span>',
})
class MyComponent {
  person?: Person;
  address?: Address;

  setData(person: Person, address: Address) {
    this.person = person;
    this.address = address;
  }
}
```
