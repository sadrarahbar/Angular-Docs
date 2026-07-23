# مهاجرت از بسته Animations در Angular

بسته `@angular/animations` از نسخه v20.2 منسوخ شده است؛ همین نسخه قابلیت‌های جدید `animate.enter` و `animate.leave` را برای افزودن animation به برنامه معرفی کرد. با این قابلیت‌ها می‌توانید تمام animationهای مبتنی بر `@angular/animations` را با CSS ساده یا کتابخانه‌های animation در JS جایگزین کنید. حذف `@angular/animations` از برنامه می‌تواند اندازه bundle مربوط به JavaScript را به‌شکل چشمگیری کاهش دهد. animationهای بومی CSS معمولاً عملکرد بهتری دارند، زیرا می‌توانند از hardware acceleration بهره ببرند. این راهنما فرایند بازآرایی کد از `@angular/animations` به animationهای بومی CSS را شرح می‌دهد.

## نوشتن animation با CSS بومی

اگر تاکنون animation بومی CSS ننوشته‌اید، راهنماهای بسیار خوبی برای شروع وجود دارند. چند مورد از آن‌ها عبارت‌اند از:  
[راهنمای CSS Animations در MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)  
[راهنمای CSS3 Animations در W3Schools](https://www.w3schools.com/css/css3_animations.asp)  
[آموزش کامل CSS Animations](https://www.lambdatest.com/blog/css-animations-tutorial/)  
[CSS Animation برای مبتدیان](https://thoughtbot.com/blog/css-animation-for-beginners)

و چند ویدئو:  
[یادگیری CSS Animation در ۹ دقیقه](https://www.youtube.com/watch?v=z2LQYsZhsFw)  
[فهرست پخش آموزش CSS Animation از Net Ninja](https://www.youtube.com/watch?v=jgw82b5Y2MU&list=PL4cUxeGkcC9iGYgmEd2dm3zAKzyCGDtM5)

برخی از این راهنماها و آموزش‌ها را بررسی کنید و سپس به این راهنما بازگردید.

## ساخت animationهای قابل‌استفاده مجدد

درست مانند بسته animations، می‌توانید animationهای قابل‌استفاده مجددی بسازید که در سراسر برنامه به اشتراک گذاشته شوند. در نسخه مبتنی بر بسته animations، از تابع `animation()` در یک فایل مشترک TypeScript استفاده می‌شد. نسخه CSS بومی مشابه آن است، اما در یک فایل CSS مشترک قرار می‌گیرد.

#### با بسته Animations

<docs-code header="animations.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" region="animation-example"/>

#### با CSS بومی

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-shared"/>

افزودن class با نام `animated-class` به یک element،‏ animation آن element را فعال می‌کند.

## animate کردن یک transition

### animate کردن state و styleها

بسته animations به شما امکان می‌داد با تابع [`state()`](api/animations/state) درون یک component،‏ stateهای گوناگون تعریف کنید. برای مثال، stateهای `open` یا `closed` می‌توانند styleهای مربوط به هر state را در تعریف خود داشته باشند:

#### با بسته Animations

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="state1"/>

همین رفتار را می‌توان به‌صورت بومی با classهای CSS و با استفاده از animation مبتنی بر keyframe یا styleهای transition پیاده‌سازی کرد.

#### با CSS بومی

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-states"/>

فعال‌کردن state مربوط به `open` یا `closed` با تغییر classهای element در component انجام می‌شود. نمونه‌های انجام این کار را در [راهنمای template](guide/templates/binding#css-class-and-style-property-bindings) ببینید.

در راهنمای template نمونه‌های مشابهی برای [animate کردن مستقیم styleها](guide/templates/binding#css-style-properties) نیز وجود دارد.

### transitionها، زمان‌بندی و easing

تابع `animate()` در بسته animations امکان ارائه تنظیمات زمان‌بندی مانند duration،‏ delay و easing را می‌دهد. این کار با چند property یا propertyهای shorthand در CSS بومی نیز امکان‌پذیر است.

برای animation مبتنی بر keyframe در CSS،‏ `animation-duration`،‏ `animation-delay` و `animation-timing-function` را مشخص کنید یا به‌جای آن property مربوط به shorthand یعنی `animation` را به‌کار ببرید.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-timing"/>

به‌طور مشابه، برای animationهایی که از `@keyframes` استفاده نمی‌کنند می‌توانید `transition-duration`،‏ `transition-delay`،‏ `transition-timing-function` و shorthand مربوط به `transition` را به‌کار ببرید.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="transition-timing"/>

### فعال‌کردن animation

بسته animations نیازمند تعیین triggerها با تابع `trigger()` و قراردادن تمام stateها درون آن بود. در CSS بومی نیازی به این کار نیست. animationها با تغییر styleها یا classهای CSS فعال می‌شوند. به‌محض قرارگرفتن یک class روی element،‏ animation اجرا می‌شود. حذف class،‏ element را به CSS تعریف‌شده برای آن بازمی‌گرداند. در نتیجه برای اجرای همان animation به کد بسیار کمتری نیاز است. مثالی را ببینید:

#### با بسته Animations

<docs-code-multifile>
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/animations-package/open-close.ts" />
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/animations-package/open-close.html" />
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/animations-package/open-close.css"/>
</docs-code-multifile>

#### با CSS بومی

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/open-close.ts">
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/native-css/open-close.ts" />
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/native-css/open-close.html" />
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/native-css/open-close.css"/>
</docs-code-multifile>

## transitionها و triggerها

### stateهای ازپیش‌تعریف‌شده و تطبیق wildcard

بسته animations امکان تطبیق stateهای تعریف‌شده با یک transition از طریق رشته‌ها را فراهم می‌کند. برای مثال، animation از open به closed به‌شکل `open => closed` نوشته می‌شود. می‌توانید با wildcard هر state را به یک state مقصد تطبیق دهید، مانند `* => closed`؛ keyword مربوط به `void` نیز برای stateهای ورود و خروج به‌کار می‌رود. برای مثال، `* => void` برای خروج element از view و `void => *` برای ورود آن به view استفاده می‌شود.

هنگام animate کردن مستقیم با CSS، به این الگوهای تطبیق state نیازی نیست. بر اساس classها یا styleهایی که روی elementها تنظیم می‌کنید، می‌توانید transitionها و animationهای `@keyframes` قابل‌اعمال را مدیریت کنید. همچنین می‌توانید برای کنترل ظاهر element بلافاصله پس از ورود به DOM از `@starting-style` استفاده کنید.

### محاسبه خودکار property با wildcard

بسته animations امکان animate کردن مواردی را فراهم می‌کند که در گذشته دشوار بوده‌اند؛ مانند animate کردن یک height مشخص به `height: auto`. اکنون می‌توانید این کار را با CSS خالص نیز انجام دهید.

#### با بسته Animations

<docs-code-multifile>
    <docs-code header="auto-height.ts" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.ts" />
    <docs-code header="auto-height.html" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.html" />
    <docs-code header="auto-height.css" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.css" />
</docs-code-multifile>

برای animate کردن به height خودکار می‌توانید از CSS Grid استفاده کنید.

#### با CSS بومی

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/auto-height.ts">
    <docs-code header="auto-height.ts" path="adev/src/content/examples/animations/src/app/native-css/auto-height.ts" />
    <docs-code header="auto-height.html" path="adev/src/content/examples/animations/src/app/native-css/auto-height.html" />
    <docs-code header="auto-height.css" path="adev/src/content/examples/animations/src/app/native-css/auto-height.css"  />
</docs-code-multifile>

اگر لازم نیست از تمام مرورگرها پشتیبانی کنید، می‌توانید `calc-size()` را نیز بررسی کنید که راهکار واقعی animate کردن height خودکار است. برای اطلاعات بیشتر [مستندات MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size) و [این آموزش](https://frontendmasters.com/blog/one-of-the-boss-battles-of-css-is-almost-won-transitioning-to-auto/) را ببینید.

### animate کردن ورود به view و خروج از آن

بسته animations علاوه بر الگوی تطبیق گفته‌شده برای ورود و خروج، aliasهای کوتاه `:enter` و `:leave` را نیز ارائه می‌کرد.

#### با بسته Animations

<docs-code-multifile>
    <docs-code header="insert-remove.ts" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.ts" />
    <docs-code header="insert-remove.html" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.html" />
    <docs-code header="insert-remove.css" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.css" />
</docs-code-multifile>

#### با CSS بومی

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/insert.ts">
    <docs-code header="insert.ts" path="adev/src/content/examples/animations/src/app/native-css/insert.ts" />
    <docs-code header="insert.html" path="adev/src/content/examples/animations/src/app/native-css/insert.html" />
    <docs-code header="insert.css" path="adev/src/content/examples/animations/src/app/native-css/insert.css"  />
</docs-code-multifile>

#### با CSS بومی

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/remove.ts">
    <docs-code header="remove.ts" path="adev/src/content/examples/animations/src/app/native-css/remove.ts" />
    <docs-code header="remove.html" path="adev/src/content/examples/animations/src/app/native-css/remove.html" />
    <docs-code header="remove.css" path="adev/src/content/examples/animations/src/app/native-css/remove.css"  />
</docs-code-multifile>

برای اطلاعات بیشتر درباره `animate.enter` و `animate.leave` به [راهنمای animationهای Enter و Leave](guide/animations) مراجعه کنید.

### animate کردن افزایش و کاهش

علاوه بر `:enter` و `:leave` گفته‌شده،‏ `:increment` و `:decrement` نیز وجود دارند. این موارد را نیز می‌توانید با افزودن و حذف classها animate کنید. برخلاف aliasهای داخلی بسته animation، با افزایش یا کاهش مقدار، classها به‌طور خودکار اعمال نمی‌شوند. می‌توانید class مناسب را به‌صورت programmatic اعمال کنید. مثالی را ببینید:

#### با بسته Animations

<docs-code-multifile>
    <docs-code header="increment-decrement.ts" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.ts" />
    <docs-code header="increment-decrement.html" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.html" />
    <docs-code header="increment-decrement.css" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.css" />
</docs-code-multifile>

#### با CSS بومی

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.ts">
    <docs-code header="increment-decrement.ts" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.ts" />
    <docs-code header="increment-decrement.html" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.html" />
    <docs-code header="increment-decrement.css" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.css" />
</docs-code-multifile>

### animationهای والد و فرزند

برخلاف بسته animations، وقتی چند animation در یک component مشخص شده‌اند، هیچ animation بر دیگری اولویت ندارد و چیزی مانع آغاز animationها نمی‌شود. هرگونه توالی animation باید در تعریف animation مربوط به CSS و با استفاده از delay در animation یا transition، یا با استفاده از `animationend` یا `transitionend` برای افزودن CSS بعدی که باید animate شود، مدیریت شود.

### غیرفعال‌کردن یک animation یا تمام animationها

برای غیرفعال‌کردن animationهای تعریف‌شده در CSS بومی، چند گزینه دارید.

1. یک class سفارشی بسازید که animation و transition را به `none` وادار کند.

```css
.no-animation {
  animation: none !important;
  transition: none !important;
}
```

اعمال این class روی یک element از آغاز هر animation روی آن جلوگیری می‌کند. همچنین می‌توانید scope آن را به کل DOM یا بخشی از DOM گسترش دهید تا این رفتار اعمال شود. بااین‌حال، این کار مانع فعال‌شدن eventهای animation می‌شود. اگر برای حذف element منتظر eventهای animation هستید، این راهکار کار نمی‌کند. یک راه‌حل جایگزین، تنظیم durationها روی یک میلی‌ثانیه است.

2. با media query مربوط به [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) مطمئن شوید برای کاربرانی که حرکت کمتر را ترجیح می‌دهند، animation اجرا نمی‌شود.

3. از افزودن programmatic کلاس‌های animation جلوگیری کنید.

### callbackهای animation

بسته animations برای زمانی که می‌خواهید پس از پایان animation کاری انجام دهید، callbackهایی در اختیار شما قرار می‌داد. animationهای بومی CSS نیز این callbackها را دارند.

[`OnAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event)  
[`OnAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event)  
[`OnAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationitration_event)  
[`OnAnimationCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationcancel_event)

[`OnTransitionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionstart_event)  
[`OnTransitionRun`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionrun_event)  
[`OnTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event)  
[`OnTransitionCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitioncancel_event)

Web Animations API قابلیت‌های بسیار بیشتری دارد. برای مشاهده تمام APIهای animation موجود، [مستندات آن](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) را بررسی کنید.

NOTE: مراقب مشکلات bubbling در این callbackها باشید. اگر فرزندها و والدها را animate می‌کنید، eventها از فرزند به والد bubble می‌شوند. propagation را متوقف کنید یا جزئیات بیشتری از event را بررسی کنید تا مطمئن شوید به target موردنظر پاسخ می‌دهید، نه eventای که از node فرزند بالا آمده است. برای اطمینان از انتخاب nodeهای درست، می‌توانید property مربوط به `animationname` یا propertyهایی را که transition می‌شوند بررسی کنید.

## توالی‌های پیچیده

بسته animations قابلیت داخلی ساخت توالی‌های پیچیده را دارد. تمام این توالی‌ها بدون بسته animations نیز کاملاً قابل‌پیاده‌سازی هستند.

### هدف‌گرفتن elementهای مشخص

در بسته animations می‌توانستید با تابع `query()`، مشابه [`document.querySelector()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector)،‏ elementهای مشخص را بر اساس نام class در CSS پیدا و هدف‌گیری کنید. در دنیای animationهای بومی CSS نیازی به این کار نیست. در عوض، با selectorهای CSS می‌توانید subclassها را هدف بگیرید و `transform` یا `animation` دلخواه را اعمال کنید.

برای تغییر classهای nodeهای فرزند درون یک template می‌توانید از bindingهای class و style استفاده کنید تا animationها در نقطه مناسب افزوده شوند.

### Stagger()

تابع `stagger()` به شما امکان می‌داد animation هر آیتم در فهرست را به‌اندازه زمان مشخصی به تأخیر بیندازید تا جلوه آبشاری ایجاد شود. می‌توانید این رفتار را با استفاده از `animation-delay` یا `transition-delay` در CSS بومی بازسازی کنید. نمونه‌ای از چنین CSS در ادامه آمده است.

#### با بسته Animations

<docs-code-multifile>
    <docs-code header="stagger.ts" path="adev/src/content/examples/animations/src/app/animations-package/stagger.ts" />
    <docs-code header="stagger.html" path="adev/src/content/examples/animations/src/app/animations-package/stagger.html" />
    <docs-code header="stagger.css" path="adev/src/content/examples/animations/src/app/animations-package/stagger.css" />
</docs-code-multifile>

#### با CSS بومی

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/stagger.ts">
    <docs-code header="stagger.ts" path="adev/src/content/examples/animations/src/app/native-css/stagger.ts" />
    <docs-code header="stagger.html" path="adev/src/content/examples/animations/src/app/native-css/stagger.html" />
    <docs-code header="stagger.css" path="adev/src/content/examples/animations/src/app/native-css/stagger.css" />
</docs-code-multifile>

### animationهای موازی

بسته animations تابع `group()` را برای اجرای هم‌زمان چند animation ارائه می‌کند. در CSS کنترل کاملی بر زمان‌بندی animation دارید. اگر چند animation تعریف شده باشد، می‌توانید همه را به‌طور هم‌زمان اعمال کنید.

```css
.target-element {
  animation:
    rotate 3s,
    fade-in 2s;
}
```

در این مثال animationهای `rotate` و `fade-in` هم‌زمان اجرا می‌شوند.

### animate کردن آیتم‌های یک فهرست مرتب‌شونده

مرتب‌سازی مجدد آیتم‌های فهرست با تکنیک‌های گفته‌شده به‌صورت پیش‌فرض کار می‌کند و اقدام ویژه دیگری لازم نیست. آیتم‌های حلقه `@for` به‌درستی حذف و دوباره اضافه می‌شوند و این کار animationهای ورود مبتنی بر `@starting-styles` را فعال می‌کند. همچنین می‌توانید برای همین رفتار از `animate.enter` استفاده کنید. همان‌طور که در مثال بالا دیدید، برای animate کردن elementها هنگام حذف از `animate.leave` استفاده کنید.

#### با بسته Animations

<docs-code-multifile>
    <docs-code header="reorder.ts" path="adev/src/content/examples/animations/src/app/animations-package/reorder.ts" />
    <docs-code header="reorder.html" path="adev/src/content/examples/animations/src/app/animations-package/reorder.html" />
    <docs-code header="reorder.css" path="adev/src/content/examples/animations/src/app/animations-package/reorder.css" />
</docs-code-multifile>

#### با CSS بومی

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/reorder.ts">
    <docs-code header="reorder.ts" path="adev/src/content/examples/animations/src/app/native-css/reorder.ts" />
    <docs-code header="reorder.html" path="adev/src/content/examples/animations/src/app/native-css/reorder.html" />
    <docs-code header="reorder.css" path="adev/src/content/examples/animations/src/app/native-css/reorder.css" />
</docs-code-multifile>

## مهاجرت کاربردهای AnimationPlayer

class مربوط به `AnimationPlayer` امکان دسترسی به animation و انجام کارهای پیشرفته‌تری مانند pause،‏ play،‏ restart و finish کردن animation از طریق کد را فراهم می‌کند. تمام این کارها را می‌توان به‌صورت بومی نیز انجام داد.

می‌توانید animationهای یک element را مستقیماً با [`Element.getAnimations()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations) دریافت کنید. این method آرایه‌ای از تمام [`Animation`](https://developer.mozilla.org/en-US/docs/Web/API/Animation)های روی آن element برمی‌گرداند. با API مربوط به `Animation` می‌توانید کارهایی بسیار بیشتر از قابلیت‌های `AnimationPlayer` در بسته animations انجام دهید. از اینجا می‌توانید `cancel()`،‏ `play()`،‏ `pause()`،‏ `reverse()` و بسیاری موارد دیگر را فراخوانی کنید. این API بومی باید تمام امکانات لازم برای کنترل animationها را فراهم کند.

## transitionهای route

برای animate کردن میان routeها می‌توانید از view transition استفاده کنید. برای شروع به [راهنمای animationهای transition در Route](guide/routing/route-transition-animations) مراجعه کنید.
