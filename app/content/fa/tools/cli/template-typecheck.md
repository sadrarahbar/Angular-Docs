# بررسی نوع template

## مروری بر بررسی نوع template

همان‌طور که TypeScript خطاهای نوع را در کد شما پیدا می‌کند، Angular نیز عبارت‌ها و bindingهای درون templateهای برنامه را بررسی می‌کند و می‌تواند هر خطای نوعی را که می‌یابد گزارش دهد.
Angular در حال حاضر، بسته به مقدار پرچم‌های `fullTemplateTypeCheck` و `strictTemplates` در [گزینه‌های کامپایلر Angular](reference/configs/angular-compiler-options)، سه حالت برای انجام این کار دارد.

### حالت پایه

در پایه‌ای‌ترین حالت بررسی نوع، با تنظیم پرچم `fullTemplateTypeCheck` روی `false`، Angular تنها عبارت‌های سطح بالای یک template را اعتبارسنجی می‌کند.

اگر `<map [city]="user.address.city">` را بنویسید، کامپایلر موارد زیر را بررسی می‌کند:

- `user` یک ویژگی در کلاس کامپوننت است
- `user` شیئی با ویژگی address است
- `user.address` شیئی با ویژگی city است

کامپایلر بررسی نمی‌کند که آیا مقدار `user.address.city` قابلیت انتساب به ورودی city کامپوننت `<map>` را دارد یا خیر.

کامپایلر در این حالت چند محدودیت مهم دیگر نیز دارد:

- مهم‌تر از همه، viewهای توکار مانند `*ngIf`،‏ `*ngFor` و سایر viewهای توکار `<ng-template>` را بررسی نمی‌کند.
- نوع `#refs`، نتیجه pipeها یا نوع `$event` در event bindingها را تشخیص نمی‌دهد.

در بسیاری از موارد، نوع این موارد در نهایت `any` می‌شود و ممکن است باعث شود بخش‌های بعدی عبارت بدون بررسی باقی بمانند.

### حالت کامل

اگر پرچم `fullTemplateTypeCheck` روی `true` تنظیم شود، Angular بررسی نوع را درون templateها سخت‌گیرانه‌تر انجام می‌دهد.
به‌طور مشخص:

- viewهای توکار \(مانند موارد درون `*ngIf` یا `*ngFor`\) بررسی می‌شوند
- pipeها نوع بازگشتی صحیح دارند
- referenceهای محلی به directiveها و pipeها نوع صحیح دارند \(به‌جز پارامترهای generic که `any` خواهند بود\)

موارد زیر همچنان نوع `any` دارند:

- referenceهای محلی به عناصر DOM
- شیء `$event`
- عبارت‌های پیمایش امن

IMPORTANT: پرچم `fullTemplateTypeCheck` از Angular 13 منسوخ شده است.
به‌جای آن باید از خانواده گزینه‌های کامپایلر `strictTemplates` استفاده شود.

### حالت سخت‌گیرانه

Angular رفتار پرچم `fullTemplateTypeCheck` را حفظ کرده و حالت سومی با نام «حالت سخت‌گیرانه» ارائه می‌دهد.
حالت سخت‌گیرانه مجموعه‌ای فراتر از حالت کامل است و با تنظیم پرچم `strictTemplates` روی true فعال می‌شود.
این پرچم جایگزین پرچم `fullTemplateTypeCheck` است.

Angular علاوه بر رفتار حالت کامل، کارهای زیر را انجام می‌دهد:

- بررسی می‌کند که bindingهای کامپوننت/directive قابلیت انتساب به `input()`های آن‌ها را داشته باشند
- هنگام اعتبارسنجی حالت پیشین، از پرچم `strictNullChecks` در TypeScript پیروی می‌کند
- نوع صحیح کامپوننت‌ها/directiveها، از جمله genericها را استنتاج می‌کند
- نوع context مربوط به template را در محل‌هایی که پیکربندی شده استنتاج می‌کند \(برای نمونه، امکان بررسی نوع صحیح `NgFor` را فراهم می‌کند\)
- نوع صحیح `$event` را در event bindingهای کامپوننت/directive،‏ DOM و animation استنتاج می‌کند
- نوع صحیح referenceهای محلی عناصر DOM را براساس نام تگ استنتاج می‌کند \(برای نمونه، نوعی که `document.createElement` برای آن تگ برمی‌گرداند\)

## بررسی `*ngFor`

سه حالت بررسی نوع با viewهای توکار به شکل متفاوتی رفتار می‌کنند.
نمونه زیر را در نظر بگیرید.

```ts {header:"رابط User"}
interface User {
  name: string;
  address: {
    city: string;
    state: string;
  };
}
```

```html
<div *ngFor="let user of users">
  <h2>{{config.title}}</h2>
  <span>City: {{user.address.city}}</span>
</div>
```

عناصر `<h2>` و `<span>` در view توکار `*ngFor` قرار دارند.
در حالت پایه، Angular هیچ‌یک از آن‌ها را بررسی نمی‌کند.
اما در حالت کامل، Angular وجود `config` و `user` را بررسی کرده و نوع `any` را برای آن‌ها فرض می‌کند.
در حالت سخت‌گیرانه، Angular می‌داند `user` در `<span>` از نوع `User` است و `address` شیئی با ویژگی `city` از نوع `string` است.

## عیب‌یابی خطاهای template

در حالت سخت‌گیرانه ممکن است با خطاهایی در template روبه‌رو شوید که در هیچ‌یک از حالت‌های قبلی رخ نمی‌دادند.
این خطاها اغلب نشان‌دهنده ناسازگاری‌های واقعی نوع در templateها هستند که ابزارهای قبلی آن‌ها را تشخیص نداده‌اند.
در این حالت، پیام خطا باید محل رخ دادن مشکل در template را به‌روشنی مشخص کند.

هنگامی که تعریف نوع یک کتابخانه Angular ناقص یا نادرست باشد، یا در موارد زیر با انتظارها کاملاً هم‌خوانی نداشته باشد، امکان گزارش مثبت کاذب نیز وجود دارد.

- زمانی که تعریف نوع یک کتابخانه نادرست یا ناقص است \(برای نمونه، اگر کتابخانه با در نظر گرفتن `strictNullChecks` نوشته نشده باشد، `null | undefined` در آن وجود ندارد\)
- زمانی که نوع ورودی‌های یک کتابخانه بیش از حد محدود است و کتابخانه metadata مناسب را برای تشخیص این موضوع توسط Angular اضافه نکرده است.
  این حالت معمولاً برای disabled یا سایر ورودی‌های Boolean رایجی رخ می‌دهد که به‌صورت attribute استفاده می‌شوند؛ برای نمونه `<input disabled>`.

- هنگام استفاده از `$event.target` برای رویدادهای DOM \(به‌دلیل امکان event bubbling،‏ `$event.target` در تعریف نوع DOM نوعی را که انتظار دارید ندارد\)

در صورت مشاهده چنین گزارش مثبت کاذبی، چند گزینه وجود دارد:

- در contextهای مشخص، با استفاده از تابع تبدیل نوع `$any()` بررسی نوع بخشی از عبارت را غیرفعال کنید
- با تنظیم `strictTemplates: false` در فایل پیکربندی TypeScript برنامه، یعنی `tsconfig.json`، بررسی‌های سخت‌گیرانه را به‌طور کامل غیرفعال کنید
- با تنظیم جداگانه یک _پرچم سخت‌گیری_ روی `false`، برخی عملیات بررسی نوع را غیرفعال کنید و سخت‌گیری را در جنبه‌های دیگر حفظ کنید
- اگر می‌خواهید `strictTemplates` و `strictNullChecks` را با هم به‌کار ببرید، با استفاده از `strictNullInputTypes` تنها بررسی سخت‌گیرانه نوع null را برای input bindingها غیرفعال کنید

مگر آنکه خلاف آن ذکر شده باشد، هر یک از گزینه‌های زیر برابر با مقدار `strictTemplates` تنظیم می‌شود \(وقتی `strictTemplates` برابر `true` است، مقدار آن نیز `true` خواهد بود و برعکس\).

| پرچم سخت‌گیری                 | اثر |
| :--------------------------- | :--- |
| `strictInputTypes`           | آیا قابلیت انتساب یک عبارت binding به فیلد `@Input()` بررسی شود یا خیر. این گزینه بر استنتاج نوع generic مربوط به directive نیز اثر می‌گذارد. |
| `strictInputAccessModifiers` | آیا هنگام انتساب یک عبارت binding به `@Input()` یا `input()`،‏ access modifierهایی مانند `private`/`protected`/`readonly` رعایت شوند یا خیر. در صورت غیرفعال بودن، access modifierهای ورودی نادیده گرفته می‌شوند و تنها نوع بررسی خواهد شد. حتی با تنظیم `strictTemplates` روی `true`، مقدار پیش‌فرض این گزینه `false` است. نکته: این بررسی تنها برای ورودی‌ها اعمال می‌شود، نه خروجی‌ها. |
| `strictNullInputTypes`       | آیا هنگام بررسی bindingهای `@Input()` \(مطابق `strictInputTypes`\) از `strictNullChecks` پیروی شود یا خیر. خاموش کردن این گزینه هنگام استفاده از کتابخانه‌ای که با در نظر گرفتن `strictNullChecks` ساخته نشده است، می‌تواند مفید باشد. |
| `strictAttributeTypes`       | آیا bindingهای `@Input()` که با attribute متنی ایجاد شده‌اند بررسی شوند یا خیر. برای نمونه، `<input matInput disabled="true">` \(تنظیم ویژگی `disabled` روی رشته `'true'`\) در مقایسه با `<input matInput [disabled]="true">` \(تنظیم ویژگی `disabled` روی مقدار Boolean یعنی `true`\). |
| `strictSafeNavigationTypes`  | آیا نوع بازگشتی عملیات پیمایش امن به‌درستی استنتاج شود یا خیر \(برای نمونه، `user?.name` براساس نوع `user` به‌درستی استنتاج می‌شود\). در صورت غیرفعال بودن، نوع `user?.name` برابر `any` خواهد بود. |
| `strictDomLocalRefTypes`     | آیا referenceهای محلی به عناصر DOM نوع صحیح داشته باشند یا خیر. در صورت غیرفعال بودن، نوع `ref` برای `<input #ref>` برابر `any` خواهد بود. |
| `strictOutputEventTypes`     | آیا `$event` برای event binding به `@Output()` یک کامپوننت/directive یا رویدادهای animation نوع صحیح داشته باشد یا خیر. در صورت غیرفعال بودن، نوع آن `any` خواهد بود. |
| `strictDomEventTypes`        | آیا `$event` برای event binding به رویدادهای DOM نوع صحیح داشته باشد یا خیر. در صورت غیرفعال بودن، نوع آن `any` خواهد بود. |
| `strictContextGenerics`      | آیا پارامترهای نوع کامپوننت‌های generic \(از جمله محدودیت‌های generic\) به‌درستی استنتاج شوند یا خیر. در صورت غیرفعال بودن، همه پارامترهای نوع `any` خواهند بود. |
| `strictLiteralTypes`         | آیا نوع literalهای شیء و آرایه تعریف‌شده در template استنتاج شود یا خیر. در صورت غیرفعال بودن، نوع چنین literalهایی `any` خواهد بود. وقتی _یکی_ از `fullTemplateTypeCheck` یا `strictTemplates` روی `true` تنظیم شده باشد، این پرچم `true` است. |

اگر پس از عیب‌یابی با این پرچم‌ها همچنان مشکل دارید، با غیرفعال کردن `strictTemplates` به حالت کامل بازگردید.

اگر این کار نیز نتیجه نداد، آخرین راه‌حل این است که با `fullTemplateTypeCheck: false` حالت کامل را کاملاً خاموش کنید.

خطای بررسی نوعی که با هیچ‌یک از روش‌های توصیه‌شده برطرف نمی‌شود، ممکن است ناشی از یک باگ در خود بررسی‌کننده نوع template باشد.
اگر خطاها شما را مجبور به بازگشت به حالت پایه می‌کنند، احتمالاً با چنین باگی روبه‌رو هستید.
در این صورت، [یک issue ثبت کنید](https://github.com/angular/angular/issues) تا تیم بتواند آن را بررسی کند.

## ورودی‌ها و بررسی نوع

بررسی‌کننده نوع template بررسی می‌کند که آیا نوع یک عبارت binding با نوع ورودی متناظر directive سازگار است یا خیر.
به‌عنوان نمونه، کامپوننت زیر را در نظر بگیرید:

```angular-ts
export interface User {
  name: string;
}

@Component({
  selector: 'user-detail',
  template: '{{ user.name }}',
})
export class UserDetailComponent {
  user = input.required<User>();
}
```

template مربوط به `AppComponent` از این کامپوننت به شکل زیر استفاده می‌کند:

```angular-ts
@Component({
  selector: 'app-root',
  template: '<user-detail [user]="selectedUser"></user-detail>',
})
export class AppComponent {
  selectedUser: User | null = null;
}
```

در اینجا، هنگام بررسی نوع template مربوط به `AppComponent`،‏ binding به‌شکل `[user]="selectedUser"` با ورودی `UserDetailComponent.user` متناظر است.
بنابراین Angular ویژگی `selectedUser` را به `UserDetailComponent.user` اختصاص می‌دهد؛ اگر نوع آن‌ها ناسازگار باشد این کار به خطا منجر خواهد شد.
TypeScript این انتساب را مطابق سیستم نوع خود و با رعایت پرچم‌هایی مانند `strictNullChecks`، براساس پیکربندی برنامه بررسی می‌کند.

با ارائه نیازمندی‌های نوع دقیق‌تر درون template به بررسی‌کننده نوع template، از خطاهای نوع هنگام اجرا جلوگیری کنید.
با افزودن توابع template guard در تعریف directive، نیازمندی‌های نوع ورودی directiveهای خود را تا جای ممکن دقیق کنید.
بخش [بهبود بررسی نوع template برای directiveهای سفارشی](/guide/directives/structural-directives#improving-template-type-checking-for-custom-directives) را در این راهنما ببینید.

### بررسی‌های سخت‌گیرانه null

وقتی `strictTemplates` و پرچم TypeScript به نام `strictNullChecks` را فعال می‌کنید، ممکن است در برخی شرایطی که اجتناب از آن‌ها آسان نیست، خطاهای بررسی نوع رخ دهند.
برای نمونه:

- یک مقدار nullable که به directiveای از کتابخانه‌ای bind شده که `strictNullChecks` در آن فعال نبوده است.

  برای کتابخانه‌ای که بدون `strictNullChecks` کامپایل شده، فایل‌های declaration مشخص نمی‌کنند که آیا یک فیلد می‌تواند `null` باشد یا خیر.
  این موضوع در شرایطی که کتابخانه `null` را به‌درستی مدیریت می‌کند مشکل‌ساز است، زیرا کامپایلر مقدار nullable را با فایل‌های declaration که نوع `null` را حذف کرده‌اند بررسی می‌کند.
  در نتیجه، کامپایلر به‌دلیل پیروی از `strictNullChecks` خطای بررسی نوع تولید می‌کند.

- استفاده از pipe به نام `async` همراه با Observableای که می‌دانید به‌صورت همگام مقداری emit خواهد کرد.

  pipe به نام `async` در حال حاضر فرض می‌کند Observable مورد subscribe می‌تواند ناهمگام باشد؛ یعنی ممکن است هنوز مقداری در دسترس نباشد.
  در این حالت همچنان باید چیزی برگرداند — که `null` است.
  به‌عبارت دیگر، نوع بازگشتی pipe به نام `async` شامل `null` است و ممکن است در شرایطی که می‌دانیم Observable به‌صورت همگام مقداری non-nullable را emit می‌کند، خطا ایجاد شود.

برای مشکلات بالا دو راه‌حل احتمالی وجود دارد:

- در template، عملگر non-null assertion یعنی `!` را در انتهای یک عبارت nullable قرار دهید؛ مانند:

```html
<user-detail [user]="user!"></user-detail>
```

در این نمونه، کامپایلر ناسازگاری نوع از نظر nullability را درست مانند کد TypeScript نادیده می‌گیرد.
برای pipe به نام `async` توجه داشته باشید که عبارت باید مانند نمونه زیر درون پرانتز قرار بگیرد:

```html
<user-detail [user]="(user$ | async)!"></user-detail>
```

- بررسی سخت‌گیرانه null را در templateهای Angular به‌طور کامل غیرفعال کنید.

  حتی با فعال بودن `strictTemplates` می‌توان جنبه‌های مشخصی از بررسی نوع را غیرفعال کرد.
  تنظیم گزینه `strictNullInputTypes` روی `false` بررسی سخت‌گیرانه null را در templateهای Angular غیرفعال می‌کند.
  این پرچم برای همه کامپوننت‌های برنامه اعمال می‌شود.

### توصیه‌ای برای نویسندگان کتابخانه

به‌عنوان نویسنده کتابخانه می‌توانید برای ارائه بهترین تجربه به کاربران خود چند اقدام انجام دهید.
نخست، فعال کردن `strictNullChecks` و افزودن `null` به نوع ورودی در محل مناسب، به مصرف‌کنندگان نشان می‌دهد که آیا می‌توانند مقدار nullable ارائه کنند یا خیر.
افزون بر این، می‌توان راهنمای نوع ویژه‌ای برای بررسی‌کننده نوع template فراهم کرد.
بخش‌های [بهبود بررسی نوع template برای directiveهای سفارشی](/guide/directives/structural-directives#improving-template-type-checking-for-custom-directives) و [تبدیل نوع setter ورودی](#input-setter-coercion) را ببینید.

## تبدیل نوع setter ورودی

گاهی بهتر است ویژگی `input()` یک directive یا کامپوننت، معمولاً با استفاده از تابع `transform` برای ورودی، مقدار bindشده به خود را تغییر دهد.
به‌عنوان نمونه، این کامپوننت دکمه سفارشی را در نظر بگیرید:

directive زیر را در نظر بگیرید:

```angular-ts
@Component({
  selector: 'submit-button',
  template: `
    <div class="wrapper">
      <button [disabled]="disabled">Submit</button>
    </div>
  `,
})
class SubmitButton {
  disabled = input.required({transform: booleanAttribute});
}
```

در اینجا، ورودی `disabled` کامپوننت به `<button>` در template منتقل می‌شود.
تا زمانی که یک مقدار `boolean` به ورودی bind شود، همه‌چیز مطابق انتظار کار می‌کند.
اما فرض کنید مصرف‌کننده این ورودی را در template به‌صورت attribute به‌کار ببرد:

```html
<submit-button disabled></submit-button>
```

این کار اثری مشابه binding زیر دارد:

```html
<submit-button [disabled]="''"></submit-button>
```

هنگام اجرا، ورودی روی رشته خالی تنظیم می‌شود که یک مقدار `boolean` نیست.
کتابخانه‌های کامپوننت Angular که با این مشکل سروکار دارند، اغلب مقدار را در setter به نوع صحیح «تبدیل» می‌کنند:

```ts

set disabled(value: boolean) {
  this._disabled = (value === '') || value;
}

```

بهتر بود نوع `value` در اینجا از `boolean` به `boolean|''` تغییر کند تا با مجموعه مقادیری که setter واقعاً می‌پذیرد منطبق باشد.
نسخه‌های پیش از 4.3 در TypeScript لازم می‌دانند getter و setter نوع یکسانی داشته باشند؛ بنابراین اگر getter باید `boolean` برگرداند، setter ناچار به استفاده از نوع محدودتر است.

اگر مصرف‌کننده سخت‌گیرانه‌ترین بررسی نوع Angular را برای templateها فعال کرده باشد، این موضوع مشکل‌ساز می‌شود: رشته خالی \(`''`\) در واقع قابلیت انتساب به فیلد `disabled` را ندارد و هنگام استفاده از شکل attribute خطای نوع ایجاد می‌کند.

برای حل این مشکل، Angular امکان بررسی نوعی گسترده‌تر و آسان‌گیرتر برای `@Input()` را نسبت به نوع تعریف‌شده خود فیلد ورودی فراهم می‌کند.
برای فعال کردن آن، یک ویژگی static با پیشوند `ngAcceptInputType_` به کلاس کامپوننت اضافه کنید:

```ts
class SubmitButton {
  private _disabled: boolean;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value === '' || value;
  }

  static ngAcceptInputType_disabled: boolean | '';
}
```

از TypeScript 4.3 به بعد، می‌توان setter را طوری تعریف کرد که نوع `boolean|''` را بپذیرد و به این ترتیب فیلد تبدیل نوع setter ورودی دیگر ضرورتی ندارد.
در نتیجه، فیلدهای تبدیل نوع setter ورودی منسوخ شده‌اند.

این فیلد نیازی به مقدار ندارد.
وجود آن به بررسی‌کننده نوع Angular اعلام می‌کند ورودی `disabled` باید bindingهای منطبق با نوع `boolean|''` را بپذیرد.
پسوند باید نام _فیلد_ `@Input` باشد.

اگر overrideای با نام `ngAcceptInputType_` برای یک ورودی وجود دارد، باید مطمئن شوید setter می‌تواند هر مقداری از نوع overrideشده را مدیریت کند.

## غیرفعال کردن بررسی نوع با `$any()`

با قرار دادن عبارت binding در فراخوانی شبه‌تابع تبدیل نوع `$any()`، بررسی آن عبارت را غیرفعال کنید.
کامپایلر با آن مانند تبدیل به نوع `any` در TypeScript از طریق `<any>` یا `as any` رفتار می‌کند.

در نمونه زیر، تبدیل `person` به نوع `any` خطای `Property address does not exist` را پنهان می‌کند.

```angular-ts
@Component({
  selector: 'my-component',
  template: '{{$any(person).address.street}}',
})
class MyComponent {
  person?: Person;
}
```
