# مقدمه‌ای بر animationهای Angular

IMPORTANT: بسته `@angular/animations` اکنون منسوخ شده است. تیم Angular توصیه می‌کند برای animationهای تمام کدهای جدید، از CSS بومی همراه با `animate.enter` و `animate.leave` استفاده کنید. برای اطلاعات بیشتر به [راهنمای animationهای enter و leave](guide/animations) مراجعه کنید. همچنین برای آشنایی با نحوه آغاز مهاجرت برنامه‌ها به animationهای CSS خالص، [مهاجرت از بسته Animations در Angular](guide/animations/migration) را ببینید.

animation توهم حرکت ایجاد می‌کند: styleهای elementهای HTML در طول زمان تغییر می‌کنند.
animationهای خوش‌ساخت می‌توانند برنامه شما را قابل‌درک‌تر و جذاب‌تر کنند، اما صرفاً جنبه ظاهری ندارند.
animationها از چند راه می‌توانند برنامه و تجربه کاربری را بهبود دهند:

- بدون animation،‏ transitionهای صفحه وب ممکن است ناگهانی و آزاردهنده به نظر برسند.
- حرکت تجربه کاربری را به‌طور چشمگیری بهبود می‌دهد؛ بنابراین animation به کاربر فرصت می‌دهد واکنش برنامه به عمل خود را تشخیص دهد.
- animationهای مناسب به‌شکلی طبیعی توجه کاربر را به نقطه موردنیاز جلب می‌کنند.

animationها معمولاً شامل چند _تبدیل_ style در طول زمان هستند.
یک element در HTML می‌تواند جابه‌جا شود، تغییر رنگ دهد، بزرگ یا کوچک شود، محو شود یا از صفحه slide کند.
این تغییرها می‌توانند هم‌زمان یا متوالی باشند و می‌توانید زمان‌بندی هر تبدیل را کنترل کنید.

سیستم animation در Angular بر قابلیت‌های CSS ساخته شده است؛ بنابراین هر propertyای را که مرورگر قابل animate بداند می‌توانید animate کنید.
این موارد شامل موقعیت، اندازه، transform، رنگ، border و موارد دیگر هستند.
W3C فهرستی از propertyهای قابل animate را در صفحه [CSS Transitions](https://www.w3.org/TR/css-transitions-1) نگهداری می‌کند.

## درباره این راهنما

این راهنما قابلیت‌های پایه animation در Angular را پوشش می‌دهد تا افزودن animationهای Angular به پروژه را آغاز کنید.

## شروع کار

moduleهای اصلی Angular برای animation عبارت‌اند از `@angular/animations` و `@angular/platform-browser`.

برای آغاز افزودن animationهای Angular به پروژه، moduleهای مخصوص animation را همراه با قابلیت‌های استاندارد Angular import کنید.

<docs-workflow>
<docs-step title="فعال‌کردن module مربوط به animation">
`provideAnimationsAsync` را از `@angular/platform-browser/animations/async` import کنید و آن را به فهرست providerها در فراخوانی تابع `bootstrapApplication` بیفزایید.

```ts {header: "Enabling Animations", linenums}
bootstrapApplication(AppComponent, {
  providers: [provideAnimationsAsync()],
});
```

<docs-callout important title="اگر برنامه به animation فوری نیاز دارد">
  اگر لازم است animation بلافاصله هنگام بارگذاری برنامه اجرا شود،
  از module مربوط به animation با بارگذاری eager استفاده کنید. `provideAnimations` را
  از `@angular/platform-browser/animations` import کنید و در فراخوانی `bootstrapApplication`،
  `provideAnimations` را **به‌جای** `provideAnimationsAsync` به‌کار ببرید.
</docs-callout>

برای برنامه‌های مبتنی بر `NgModule`،‏ `BrowserAnimationsModule` را import کنید تا قابلیت animation به module ریشه برنامه Angular افزوده شود.

<docs-code header="app.module.ts" path="adev/src/content/examples/animations/src/app/app.module.1.ts"/>
</docs-step>
<docs-step title="Import کردن توابع animation در فایل‌های component">
اگر قصد دارید توابع مشخصی از animation را در فایل‌های component به‌کار ببرید، آن توابع را از `@angular/animations` import کنید.

<docs-code header="app.ts" path="adev/src/content/examples/animations/src/app/app.ts" region="imports"/>

در پایان این راهنما تمام [توابع animation موجود](guide/legacy-animations#animations-api-summary) را ببینید.

</docs-step>
<docs-step title="افزودن property مربوط به metadata در animation">
در فایل component، یک property مربوط به metadata با نام `animations:` داخل decorator مربوط به `@Component()` اضافه کنید.
trigger تعریف‌کننده animation را داخل property مربوط به metadata یعنی `animations` قرار دهید.

<docs-code header="app.ts" path="adev/src/content/examples/animations/src/app/app.ts" region="decorator"/>
</docs-step>
</docs-workflow>

## animate کردن یک transition

یک transition را animate می‌کنیم که یک element در HTML را از یک state به state دیگر تغییر می‌دهد.
برای مثال، می‌توانید تعیین کنید یک button بر اساس آخرین عمل کاربر **Open** یا **Closed** را نمایش دهد.
وقتی button در state مربوط به `open` است، قابل‌مشاهده و زردرنگ است.
در state مربوط به `closed`، نیمه‌شفاف و آبی است.

در HTML این attributeها با styleهای معمول CSS مانند color و opacity تنظیم می‌شوند.
در Angular با تابع `style()` مجموعه‌ای از styleهای CSS را برای استفاده در animation مشخص کنید.
مجموعه‌ای از styleها را در یک state مربوط به animation گردآوری کرده و نامی مانند `open` یا `closed` به آن بدهید.

HELPFUL: یک component جدید با نام `open-close` می‌سازیم تا با transitionهای ساده animate شود.

برای تولید component، دستور زیر را در terminal اجرا کنید:

```shell
ng g component open-close
```

این دستور component را در `src/app/open-close.ts` ایجاد می‌کند.

### state و styleهای animation

با تابع [`state()`](api/animations/state) در Angular،‏ stateهای متفاوتی را تعریف کنید که در پایان هر transition فراخوانی می‌شوند.
این تابع دو آرگومان دریافت می‌کند:
نامی یکتا مانند `open` یا `closed` و یک تابع `style()`.

با تابع `style()` مجموعه styleهای مرتبط با نام یک state را تعریف کنید.
برای attributeهای style دارای خط تیره، مانند `backgroundColor`، باید از _camelCase_ استفاده کنید یا آن‌ها را مانند `'background-color'` درون کوتیشن بگذارید.

ببینیم تابع [`state()`](api/animations/state) در Angular چگونه همراه با تابع `styleâپ£آ­(âپ )` برای تنظیم attributeهای style در CSS کار می‌کند.
در این قطعه‌کد، چند attribute مربوط به style به‌طور هم‌زمان برای state تنظیم شده‌اند.
در state مربوط به `open`، ارتفاع button برابر ۲۰۰ پیکسل، opacity آن ۱ و رنگ پس‌زمینه‌اش زرد است.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="state1"/>

در state زیر یعنی `closed`، ارتفاع button برابر ۱۰۰ پیکسل، opacity آن ۰٫۸ و رنگ پس‌زمینه‌اش آبی است.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="state2"/>

### transitionها و زمان‌بندی

در Angular می‌توانید چند style را بدون animation تنظیم کنید.
بااین‌حال، بدون تنظیمات بیشتر، button فوراً تغییر می‌کند و هیچ محوشدن، کوچک‌شدن یا نشانه دیداری دیگری از تغییر دیده نمی‌شود.

برای نرم‌ترکردن تغییر، باید یک _transition_ مربوط به animation تعریف کنید که تغییرهای میان دو state را در یک بازه زمانی مشخص کند.
تابع `transition()` دو آرگومان می‌پذیرد:
آرگومان اول عبارتی برای جهت میان دو state و آرگومان دوم یک یا چند مرحله `animate()` است.

با تابع `animate()` مدت، تأخیر و easing یک transition و تابع style مربوط به زمان اجرای transition را تعریف کنید.
همچنین با تابع `animate()` تابع `keyframes()` را برای animationهای چندمرحله‌ای تعریف کنید.
این تعریف‌ها در آرگومان دوم تابع `animate()` قرار می‌گیرند.

#### metadata مربوط به animation: مدت، تأخیر و easing

تابع `animate()` ــ آرگومان دوم تابع transition ــ پارامترهای ورودی `timings` و `styles` را می‌پذیرد.

پارامتر `timings` یک عدد یا رشته سه‌بخشی دریافت می‌کند.

```ts
animate(duration);
```

یا

```ts
animate('duration delay easing');
```

بخش اول یعنی `duration` الزامی است.
مدت را می‌توان به‌صورت عدد بدون کوتیشن بر حسب میلی‌ثانیه، یا رشته بر حسب ثانیه همراه با مشخص‌کننده زمان نوشت.
برای مثال، یک‌دهم ثانیه را می‌توان به شکل‌های زیر بیان کرد:

- عدد ساده بر حسب میلی‌ثانیه:
  `100`

- رشته بر حسب میلی‌ثانیه:
  `'100ms'`

- رشته بر حسب ثانیه:
  `'0.1s'`

آرگومان دوم یعنی `delay` syntax مشابه `duration` دارد.
برای مثال:

- ۱۰۰ میلی‌ثانیه انتظار و سپس ۲۰۰ میلی‌ثانیه اجرا: `'0.2s 100ms'`

آرگومان سوم یعنی `easing`، نحوه [شتاب‌گرفتن و کاهش سرعت](https://easings.net) animation هنگام runtime را کنترل می‌کند.
برای مثال، `ease-in` باعث می‌شود animation آهسته آغاز شود و به‌تدریج سرعت بگیرد.

- ۱۰۰ میلی‌ثانیه انتظار و ۲۰۰ میلی‌ثانیه اجرا.
  استفاده از منحنی کاهش سرعت برای شروع سریع و کاهش تدریجی سرعت تا توقف:
  `'0.2s 100ms ease-out'`

- ۲۰۰ میلی‌ثانیه اجرا بدون تأخیر.
  استفاده از منحنی استاندارد برای شروع آهسته، شتاب‌گیری در میانه و کاهش آرام سرعت در پایان:
  `'0.2s ease-in-out'`

- شروع فوری و اجرای ۲۰۰ میلی‌ثانیه‌ای.
  استفاده از منحنی شتاب برای شروع آهسته و رسیدن به بیشترین سرعت در پایان:
  `'0.2s ease-in'`

HELPFUL: برای اطلاعات عمومی درباره منحنی‌های easing، مبحث [Natural easing curves](https://material.io/design/motion/speed.html#easing) در وب‌سایت Material Design را ببینید.

این مثال transition یک‌ثانیه‌ای از state مربوط به `open` به `closed` را ارائه می‌کند.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="transition1"/>

در قطعه‌کد بالا، عملگر `=>` نشان‌دهنده transition یک‌طرفه و `<=>` نشان‌دهنده transition دوطرفه است.
درون transition،‏ `animate()` مدت اجرای transition را مشخص می‌کند.
در این حالت تغییر state از `open` به `closed` یک ثانیه طول می‌کشد که با `1s` بیان شده است.

مثال زیر transition از state مربوط به `closed` به `open` را با قوس animation نیم‌ثانیه‌ای اضافه می‌کند.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="transition2"/>

HELPFUL: نکات تکمیلی درباره استفاده از styleها در توابع [`state`](api/animations/state) و `transition`:

- با [`state()`](api/animations/state) styleهایی را تعریف کنید که در پایان هر transition اعمال می‌شوند و پس از پایان animation باقی می‌مانند.
- با `transition()` styleهای میانی را تعریف کنید که هنگام animation توهم حرکت ایجاد می‌کنند.
- وقتی animationها غیرفعال‌اند، styleهای `transition()` ممکن است نادیده گرفته شوند، اما styleهای [`state()`](api/animations/state) نادیده گرفته نمی‌شوند.
- چند جفت state را در یک آرگومان `transition()` قرار دهید:

  ```ts
  transition('on => off, off => void');
  ```

### فعال‌کردن animation

یک animation برای تشخیص زمان شروع به _trigger_ نیاز دارد.
تابع `trigger()`،‏ stateها و transitionها را گردآوری و animation را نام‌گذاری می‌کند تا بتوانید آن را به element فعال‌کننده در template مربوط به HTML متصل کنید.

تابع `trigger()` نام propertyای را مشخص می‌کند که باید تغییرهای آن بررسی شوند.
هنگام تغییر، trigger عمل‌های موجود در تعریف خود را آغاز می‌کند.
این عمل‌ها می‌توانند transition یا توابع دیگری باشند که بعداً می‌بینیم.

در این مثال trigger را `openClose` می‌نامیم و به element مربوط به `button` متصل می‌کنیم.
trigger،‏ stateهای باز و بسته و زمان‌بندی دو transition را توصیف می‌کند.

HELPFUL: در هر فراخوانی تابع `trigger()`، یک element در هر لحظه فقط می‌تواند در یک state باشد.
بااین‌حال، چند trigger می‌توانند هم‌زمان فعال باشند.

### تعریف animation و اتصال آن به template مربوط به HTML

animationها در metadata مربوط به component کنترل‌کننده element در HTML تعریف می‌شوند.
کد تعریف animationها را زیر property مربوط به `animations:` در decorator مربوط به `@Component()` قرار دهید.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="component"/>

پس از تعریف trigger مربوط به animation برای یک component، نام trigger را درون براکت و با پیشوند `@` قرار دهید و آن را به element داخل template آن component متصل کنید.
سپس trigger را با syntax استاندارد property binding در Angular به یک عبارت template متصل کنید؛ در نمونه زیر `triggerName` نام trigger است و `expression` به یک state تعریف‌شده animation ارزیابی می‌شود.

```angular-html
<div [@triggerName]="expression">…</div>
```

وقتی مقدار عبارت به state جدیدی تغییر کند، animation اجرا یا فعال می‌شود.

قطعه‌کد زیر trigger را به مقدار property مربوط به `isOpen` متصل می‌کند.

<docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.1.html" region="trigger"/>

در این مثال، وقتی عبارت `isOpen` به state تعریف‌شده `open` یا `closed` ارزیابی شود، تغییر state را به trigger با نام `openClose` اعلام می‌کند.
سپس کد `openClose` تغییر state را مدیریت کرده و animation مربوط به آن را آغاز می‌کند.

برای elementهایی که وارد صفحه یا از آن خارج می‌شوند ــ یعنی در DOM درج یا از آن حذف می‌شوند ــ می‌توانید animationها را شرطی کنید.
برای مثال، در template مربوط به HTML از `*ngIf` همراه با trigger مربوط به animation استفاده کنید.

HELPFUL: در فایل component،‏ trigger تعریف‌کننده animationها را به‌عنوان مقدار property مربوط به `animations:` در decorator مربوط به `@Component()` تنظیم کنید.

در فایل template مربوط به HTML، از نام trigger برای اتصال animationهای تعریف‌شده به element موردنظر استفاده کنید.

### مرور کد

فایل‌های کد بررسی‌شده در مثال transition در ادامه آمده‌اند.

<docs-code-multifile>
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="component"/>
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.1.html" region="trigger"/>
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/open-close.css"/>
</docs-code-multifile>

### خلاصه

آموختید با استفاده از `style()` و [`state()`](api/animations/state) همراه با `animate()` برای زمان‌بندی، به transition میان دو state animation اضافه کنید.

در بخش Animation درباره قابلیت‌های پیشرفته‌تر animationهای Angular مطالعه کنید؛ این بخش با تکنیک‌های پیشرفته [transitionها و triggerها](guide/legacy-animations/transition-and-triggers) آغاز می‌شود.

## خلاصه API مربوط به Animations

API تابعی ارائه‌شده توسط module با نام `@angular/animations` یک زبان مخصوص دامنه (DSL) برای ساخت و کنترل animationها در برنامه‌های Angular فراهم می‌کند.
برای فهرست کامل و جزئیات syntax توابع اصلی و ساختارهای داده مرتبط، به [مرجع API](api#animations) مراجعه کنید.

| نام تابع                          | عملکرد                                                                                                                                                                                                                 |
| :-------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trigger()`                       | animation را آغاز می‌کند و container تمام فراخوانی‌های دیگر توابع animation است. template مربوط به HTML به `triggerName` متصل می‌شود. آرگومان اول نام یکتای trigger را تعریف می‌کند. از syntax آرایه استفاده می‌کند. |
| `style()`                         | یک یا چند style در CSS را برای استفاده در animation تعریف می‌کند و ظاهر elementهای HTML هنگام animation را کنترل می‌کند. از syntax شیء استفاده می‌کند.                                                                |
| [`state()`](api/animations/state) | مجموعه‌ای نام‌دار از styleهای CSS را ایجاد می‌کند که پس از transition موفق به یک state مشخص اعمال می‌شوند. سپس می‌توان در توابع دیگر animation با نام به آن state ارجاع داد.                                          |
| `animate()`                       | اطلاعات زمان‌بندی transition را مشخص می‌کند. مقادیر `delay` و `easing` اختیاری‌اند و می‌تواند فراخوانی‌های `style()` را در خود داشته باشد.                                                                             |
| `transition()`                    | توالی animation میان دو state نام‌دار را تعریف می‌کند. از syntax آرایه استفاده می‌کند.                                                                                                                               |
| `keyframes()`                     | امکان تغییر متوالی میان styleها در یک بازه زمانی مشخص را می‌دهد. درون `animate()` استفاده می‌شود و می‌تواند در هر `keyframe()` چند فراخوانی `style()` داشته باشد.                                                     |
| [`group()`](api/animations/group) | گروهی از مراحل animation ــ _animationهای داخلی_ ــ را برای اجرای موازی مشخص می‌کند. animation تنها پس از تکمیل تمام مراحل داخلی ادامه می‌یابد. درون `sequence()` یا `transition()` استفاده می‌شود.                    |
| `query()`                         | یک یا چند element داخلی HTML را درون element فعلی پیدا می‌کند.                                                                                                                                                        |
| `sequence()`                      | فهرستی از مراحل animation را تعیین می‌کند که به‌ترتیب و یکی‌یکی اجرا می‌شوند.                                                                                                                                         |
| `stagger()`                       | زمان شروع animation چند element را با فاصله تنظیم می‌کند.                                                                                                                                                             |
| `animation()`                     | animation قابل‌استفاده مجددی ایجاد می‌کند که از محل دیگری قابل فراخوانی است. همراه با `useAnimation()` استفاده می‌شود.                                                                                                |
| `useAnimation()`                  | یک animation قابل‌استفاده مجدد را فعال می‌کند. همراه با `animation()` استفاده می‌شود.                                                                                                                                |
| `animateChild()`                  | اجازه می‌دهد animationهای component فرزند در همان بازه زمانی والد اجرا شوند.                                                                                                                                          |

</table>

## مطالب بیشتر درباره animationهای Angular

HELPFUL: این [ارائه](https://www.youtube.com/watch?v=rnTK9meY5us) در کنفرانس AngularConnect در نوامبر ۲۰۱۷ و [کد منبع](https://github.com/matsko/animationsftw.in) همراه آن را ببینید.

ممکن است مطالب زیر نیز برایتان مفید باشند:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations/transition-and-triggers" title="transitionها و triggerها"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="توالی‌های پیچیده animation"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="animationهای قابل‌استفاده مجدد"/>
  <docs-pill href="guide/routing/route-transition-animations" title="animationهای transition در routing"/>
  <docs-pill href="guide/animations/migration" title="مهاجرت به animationهای CSS بومی"/>
</docs-pill-row>
