# راهنمای سبک کدنویسی Angular

## مقدمه

این راهنما مجموعه‌ای از قراردادهای سبک کدنویسی برای برنامه‌های Angular را پوشش می‌دهد. رعایت این توصیه‌ها
برای کارکرد Angular الزامی نیست، بلکه مجموعه‌ای از شیوه‌های کدنویسی را مشخص می‌کند که
هماهنگی در سراسر اکوسیستم Angular را افزایش می‌دهند. مجموعه‌ای یکپارچه از شیوه‌ها، اشتراک‌گذاری
کد و جابه‌جایی میان پروژه‌ها را آسان‌تر می‌کند.

این راهنما شیوه‌های عمومی کدنویسی TypeScript یا موارد نامرتبط با Angular را پوشش _نمی‌دهد_.
برای TypeScript، به
[راهنمای سبک TypeScript گوگل](https://google.github.io/styleguide/tsguide.html) مراجعه کنید.

### هنگام تردید، هماهنگی را در اولویت قرار دهید

هرگاه با موقعیتی روبه‌رو شدید که این قواعد با سبک یک فایل مشخص تضاد داشتند،
حفظ هماهنگی در همان فایل را در اولویت قرار دهید. ترکیب چند قرارداد سبک متفاوت در یک
فایل، بیشتر از فاصله‌گرفتن از توصیه‌های این راهنما سردرگمی ایجاد می‌کند.

## نام‌گذاری

### کلمات نام فایل را با خط تیره جدا کنید

کلمات موجود در نام فایل را با خط تیره (`-`) از یکدیگر جدا کنید. برای مثال، componentای با نام `UserProfile`
باید نام فایل `user-profile.ts` را داشته باشد.

### برای تست‌های یک فایل از همان نام با پسوند `.spec` استفاده کنید

نام فایل‌های unit test را با `.spec.ts` تمام کنید. برای مثال، نام فایل unit test مربوط به
component با نام `UserProfile` باید `user-profile.spec.ts` باشد.

### نام فایل را با شناسه TypeScript درون آن هماهنگ کنید

نام فایل معمولاً باید محتوای کد داخل آن را توصیف کند. اگر فایل شامل یک class در TypeScript است،
نام فایل باید بازتاب‌دهنده نام آن class باشد. برای مثال، فایل دارای component با نام
`UserProfile` باید `user-profile.ts` نام داشته باشد.

اگر فایل بیش از یک شناسه اصلی و قابل‌نام‌گذاری دارد، نامی را انتخاب کنید که موضوع مشترک
کدهای درون آن را توصیف کند. اگر کدهای یک فایل در یک موضوع یا feature مشترک قرار نمی‌گیرند،
آن‌ها را به فایل‌های جدا تقسیم کنید. از نام‌های بیش از حد عمومی
مانند `helpers.ts`،‏ `utils.ts` یا `common.ts` بپرهیزید.

### برای فایل‌های TypeScript،‏ template و style یک component از نام یکسان استفاده کنید

componentها معمولاً از یک فایل TypeScript، یک فایل template و یک فایل style تشکیل می‌شوند. این
فایل‌ها باید نامی یکسان و پسوندهایی متفاوت داشته باشند. برای مثال، component با نام `UserProfile`
می‌تواند شامل فایل‌های `user-profile.ts`،‏ `user-profile.html` و `user-profile.css` باشد.

اگر component بیش از یک فایل style دارد، کلمات دیگری به نام فایل اضافه کنید که
styleهای مخصوص آن فایل را توصیف می‌کنند. برای مثال، `UserProfile` می‌تواند فایل‌های style
با نام `user-profile-settings.css` و `user-profile-subscription.css` داشته باشد.

## ساختار پروژه

### تمام کدهای برنامه در پوشه‌ای به نام `src` قرار می‌گیرند

تمام کدهای UI برنامه Angular شما (TypeScript،‏ HTML و styleها) باید در پوشه‌ای
به نام `src` قرار بگیرند. کدهای نامرتبط با UI مانند فایل‌های پیکربندی یا scriptها باید
خارج از پوشه `src` باشند.

این کار ساختار پوشه ریشه برنامه را میان پروژه‌های مختلف Angular یکسان نگه می‌دارد و
مرز روشنی میان کد UI و سایر کدهای پروژه ایجاد می‌کند.

### برنامه را در فایل `main.ts` مستقیماً داخل `src` راه‌اندازی کنید

کد آغاز یا **bootstrap** یک برنامه Angular باید همیشه در فایلی
به نام `main.ts` قرار بگیرد. این فایل entry point اصلی برنامه است.

### فایل‌های نزدیک و مرتبط را در یک پوشه گروه‌بندی کنید

componentهای Angular از یک فایل TypeScript و در صورت نیاز، یک template و یک یا چند فایل style
تشکیل می‌شوند. این فایل‌ها را در یک پوشه قرار دهید.

unit testها باید در همان پوشه کد تحت تست قرار بگیرند. تست‌های نامرتبط را در یک
پوشه واحد با نام `tests` جمع نکنید.

### پروژه را بر اساس featureها سازمان‌دهی کنید

پروژه را بر اساس featureهای برنامه یا موضوع مشترک کدهای هر پوشه، در subdirectoryها
سازمان‌دهی کنید. برای مثال، ساختار پروژه وب‌سایت یک سینما با نام
MovieReel می‌تواند به شکل زیر باشد:

```
src/
├─ movie-reel/
│ ├─ show-times/
│ │ ├─ film-calendar/
│ │ ├─ film-details/
│ ├─ reserve-tickets/
│ │ ├─ payment-info/
│ │ ├─ purchase-confirmation/
```

از ساختن subdirectory بر اساس نوع کد موجود در آن خودداری کنید. برای
مثال، پوشه‌هایی مانند `components`،‏ `directives` و `services` نسازید.

تعداد فایل‌ها را در یک پوشه آن‌قدر زیاد نکنید که خواندن یا پیمایش آن دشوار شود. با
افزایش تعداد فایل‌های یک پوشه، آن را به subdirectoryهای بیشتری تقسیم کنید.

### هر فایل، یک مفهوم

ترجیحاً هر فایل منبع را بر یک _مفهوم_ متمرکز کنید. به‌طور مشخص برای classهای Angular، این کار معمولاً
به‌معنای داشتن یک component،‏ directive یا service در هر فایل است. بااین‌حال، اگر classها نسبتاً
کوچک و به‌عنوان بخش‌هایی از یک مفهوم واحد به هم مرتبط‌اند، وجود چند component یا directive در یک فایل اشکالی ندارد.

هنگام تردید، رویکردی را انتخاب کنید که به فایل‌های کوچک‌تر منجر می‌شود.

## Dependency injection

### تابع `inject` را به تزریق پارامترهای constructor ترجیح دهید

استفاده از تابع [`inject`](/api/core/inject) را به تزریق پارامترهای constructor ترجیح دهید. تابع [`inject`](/api/core/inject) همانند تزریق پارامترهای constructor عمل می‌کند، اما چند مزیت از نظر سبک کدنویسی دارد:

- خواندن [`inject`](/api/core/inject) معمولاً آسان‌تر است، به‌ویژه وقتی یک class تعداد زیادی dependency تزریق می‌کند.
- افزودن comment به dependencyهای تزریق‌شده از نظر syntax ساده‌تر است.
- [`inject`](/api/core/inject) استنتاج نوع بهتری ارائه می‌دهد.
- هنگام هدف‌گیری ES2022 و نسخه‌های بعدی همراه با [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig/#useDefineForClassFields)، اگر fieldها dependencyهای تزریق‌شده را می‌خوانند، دیگر لازم نیست declaration و initialization آن‌ها را جدا کنید.

[می‌توانید کد موجود را با ابزاری خودکار به `inject` بازآرایی کنید](reference/migrations/inject-function).

## componentها و directiveها

### انتخاب selector برای component

برای جزئیات انتخاب selector برای component، به
[راهنمای componentها](guide/components/selectors#choosing-a-selector) مراجعه کنید.

### نام‌گذاری memberهای component و directive

برای جزئیات مربوط به [نام‌گذاری propertyهای ورودی](guide/components/inputs#choosing-input-names)
و [نام‌گذاری propertyهای خروجی](guide/components/outputs#choosing-event-names)
به راهنمای componentها مراجعه کنید.

### انتخاب selector برای directive

directiveها باید از همان
[پیشوند مخصوص برنامه](guide/components/selectors#selector-prefixes)
که componentها استفاده می‌کنند، بهره ببرند.

هنگام استفاده از attribute selector برای یک directive، نام attribute را به‌شکل camelCase بنویسید. برای مثال، اگر
نام برنامه شما "MovieReel" است و directiveای می‌سازید که tooltip به یک element اضافه می‌کند،
می‌توانید از selector با نام `[mrTooltip]` استفاده کنید.

### propertyهای مخصوص Angular را پیش از methodها گروه‌بندی کنید

componentها و directiveها باید propertyهای مخصوص Angular را کنار هم و معمولاً نزدیک بالای
class declaration قرار دهند. این موارد شامل dependencyهای تزریق‌شده، ورودی‌ها، خروجی‌ها و queryها هستند.
این موارد و سایر propertyها را پیش از methodهای class تعریف کنید.

این شیوه پیداکردن APIهای template و dependencyهای class را آسان‌تر می‌کند.

### componentها و directiveها را بر presentation متمرکز نگه دارید

کد داخل componentها و directiveها معمولاً باید به UI نمایش‌داده‌شده در صفحه مربوط باشد. کدی را که
مستقل از UI معنا دارد به فایل‌های دیگر منتقل کنید. برای مثال، می‌توانید قواعد اعتبارسنجی form
یا تبدیل داده‌ها را به functionها یا classهای جدا منتقل کنید.

### از منطق بیش از حد پیچیده در templateها بپرهیزید

templateهای Angular برای پشتیبانی از
[عبارت‌های مشابه JavaScript](guide/templates/expression-syntax) طراحی شده‌اند.
از این عبارت‌ها برای پیاده‌سازی مستقیم منطق نسبتاً ساده در عبارت‌های template استفاده کنید.

اما وقتی کد template بیش از حد پیچیده شد، منطق را به کد TypeScript منتقل کنید (معمولاً با یک [computed](guide/signals#computed-signals)).

قاعده قطعی و واحدی برای تعیین «پیچیده» بودن وجود ندارد. از قضاوت حرفه‌ای خود استفاده کنید.

### برای memberهایی که فقط در template یک component استفاده می‌شوند، `protected` به‌کار ببرید

memberهای public در class یک component ذاتاً API عمومی آن را تعریف می‌کنند که از طریق
dependency injection و [queryها](guide/components/queries) در دسترس است. برای memberهایی که قرار است
از template مربوط به component خوانده شوند، دسترسی `protected` را ترجیح دهید.

```ts
@Component({
  ...,
  template: `<p>{{ fullName() }}</p>`,
})
export class UserProfile {
  firstName = input();
  lastName = input();

// `fullName` is not part of the component's public API, but is used in the template.
  protected fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
}
```

### برای propertyهایی که نباید تغییر کنند از `readonly` استفاده کنید

propertyهای component و directive را که Angular مقداردهی اولیه می‌کند با `readonly` علامت‌گذاری کنید. این موارد
شامل propertyهایی هستند که با `input`،‏ `model`،‏ `output` و queryها مقداردهی اولیه می‌شوند. modifier دسترسی readonly
تضمین می‌کند مقداری که Angular تنظیم کرده است بازنویسی نشود.

```ts
@Component(/* ... */)
export class UserProfile {
  readonly userId = input();
  readonly userSaved = output();
  readonly userName = model();
}
```

برای componentها و directiveهایی که از APIهای مبتنی بر decorator یعنی `@Input`،‏ `@Output` و query استفاده می‌کنند، این
توصیه درباره propertyهای خروجی و queryها صدق می‌کند، اما شامل propertyهای ورودی نمی‌شود.

```ts
@Component(/* ... */)
export class UserProfile {
  @Output() readonly userSaved = new EventEmitter<void>();
  @ViewChildren(PaymentMethod) readonly paymentMethods?: QueryList<PaymentMethod>;
}
```

### `class` و `style` را به `ngClass` و `ngStyle` ترجیح دهید

bindingهای `class` و `style` را به استفاده از directiveهای [`NgClass`](/api/common/NgClass) و [`NgStyle`](/api/common/NgStyle) ترجیح دهید.

```html {prefer}
<div [class.admin]="isAdmin" [class.dense]="density === 'high'">
  <div [style.color]="textColor" [style.background-color]="backgroundColor">
    <!-- OR -->
    <div [class]="{admin: isAdmin, dense: density === 'high'}">
      <div [style]="{'color': textColor, 'background-color': backgroundColor}"></div>
    </div>
  </div>
</div>
```

```html {avoid}
<div [ngClass]="{admin: isAdmin, dense: density === 'high'}">
  <div [ngStyle]="{'color': textColor, 'background-color': backgroundColor}"></div>
</div>
```

هر دو binding یعنی `class` و `style` از syntax ساده‌تری استفاده می‌کنند که با
attributeهای استاندارد HTML هماهنگی نزدیکی دارد. این ویژگی خواندن و درک templateها را، به‌ویژه برای
توسعه‌دهندگان آشنا با HTML پایه، آسان‌تر می‌کند.

علاوه بر این، directiveهای `NgClass` و `NgStyle` در مقایسه با syntax داخلی bindingهای
`class` و `style` هزینه عملکردی بیشتری دارند.

برای جزئیات بیشتر، به [راهنمای bindingها](/guide/templates/binding#css-class-and-style-property-bindings) مراجعه کنید.

### event handlerها را بر اساس کاری که _انجام می‌دهند_ نام‌گذاری کنید، نه رویداد فعال‌کننده

event handlerها را بر اساس عملی که انجام می‌دهند نام‌گذاری کنید، نه رویدادی که آن‌ها را فعال می‌کند:

```html {prefer}
<button (click)="saveUserData()">Save</button>
```

```html {avoid}
<button (click)="handleClick()">Save</button>
```

چنین نام‌های معناداری باعث می‌شوند تنها با خواندن
template بتوانید عملکرد یک event را تشخیص دهید.

برای eventهای صفحه‌کلید، می‌توانید modifierهای key event در Angular را همراه با نام‌های مشخص handler به‌کار ببرید:

```html
<textarea (keydown.control.enter)="commitNotes()" (keydown.control.space)="showSuggestions()">
```

گاهی منطق مدیریت event آن‌قدر طولانی یا پیچیده است که تعریف یک
handler واحد با نام مناسب عملی نیست. در این موارد می‌توانید از نامی مانند `handleKeydown` استفاده کنید و
سپس بر اساس جزئیات event، کار را به رفتارهای مشخص‌تر بسپارید:

```ts
@Component(/* ... */)
class RichText {
  handleKeydown(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if (event.key === 'B') {
        this.activateBold();
      } else if (event.key === 'I') {
        this.activateItalic();
      }
      // ...
    }
  }
}
```

### lifecycle methodها را ساده نگه دارید

منطق طولانی یا پیچیده را داخل lifecycle hookهایی مانند `ngOnInit` قرار ندهید. در عوض، methodهایی
با نام مناسب برای نگهداری آن منطق ایجاد کنید و سپس _آن methodها را_ در lifecycle hook فراخوانی کنید.
نام lifecycle hook توضیح می‌دهد که _چه زمانی_ اجرا می‌شود؛ بنابراین کد درون آن
نام معناداری ندارد که کاری را که انجام می‌دهد توصیف کند.

```ts {prefer}
ngOnInit() {
  this.startLogging();
  this.runBackgroundTask();
}
```

```ts {avoid}
ngOnInit() {
  this.logger.setMode('info');
  this.logger.monitorErrors();
  // ...and all the rest of the code that would be unrolled from these methods.
}
```

### از interfaceهای lifecycle hook استفاده کنید

Angular برای هر lifecycle method یک interface در TypeScript ارائه می‌کند. هنگام افزودن lifecycle hook به
class خود، این interfaceها را import و `implement` کنید تا از نام‌گذاری صحیح methodها مطمئن شوید.

```ts
import {Component, OnInit} from '@angular/core';

@Component(/* ... */)
export class UserProfile implements OnInit {
  // The `OnInit` interface ensures this method is named correctly.
  ngOnInit() {
    /* ... */
  }
}
```
