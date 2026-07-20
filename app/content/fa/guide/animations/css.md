# متحرک‌سازی Application با CSS

CSS مجموعه قدرتمندی از ابزارها را در اختیار شما می‌گذارد تا animationهای زیبا و جذاب داخل application خود ایجاد کنید.

## نوشتن animationها با CSS native

اگر تا حالا animation native با CSS ننوشته‌اید، guideهای بسیار خوبی برای شروع وجود دارند. چند نمونه:
[MDN's CSS Animations guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)
[W3Schools CSS3 Animations guide](https://www.w3schools.com/css/css3_animations.asp)
[The Complete CSS Animations Tutorial](https://www.lambdatest.com/blog/css-animations-tutorial/)
[CSS Animation for Beginners](https://thoughtbot.com/blog/css-animation-for-beginners)

و چند ویدیو:
[Learn CSS Animation in 9 Minutes](https://www.youtube.com/watch?v=z2LQYsZhsFw)
[Net Ninja CSS Animation Tutorial Playlist](https://www.youtube.com/watch?v=jgw82b5Y2MU&list=PL4cUxeGkcC9iGYgmEd2dm3zAKzyCGDtM5)

چند مورد از این guideها و tutorialها را ببینید و سپس به این راهنما برگردید.

## ساخت Animationهای قابل استفاده مجدد

می‌توانید با استفاده از `@keyframes`، animationهای قابل استفاده مجدد بسازید که در سراسر application شما share شوند. keyframe animationها را در یک فایل CSS مشترک تعریف کنید تا بتوانید هر جا در application خواستید دوباره از آن‌ها استفاده کنید.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-shared"/>

افزودن class مربوط به `animated-class` به یک element، animation را روی همان element trigger می‌کند.

## متحرک‌سازی یک Transition

### متحرک‌سازی State و Styleها

ممکن است بخواهید بین دو state متفاوت animate کنید، برای مثال وقتی یک element باز یا بسته می‌شود. می‌توانید این کار را با CSS classها انجام دهید، چه با keyframe animation و چه با transition styling.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-states"/>

Trigger کردن state مربوط به `open` یا `closed` با toggle کردن classها روی element در کامپوننت شما انجام می‌شود. می‌توانید مثال‌های انجام این کار را در [template guide](guide/templates/binding#css-class-and-style-property-bindings) ببینید.

در template guide مثال‌های مشابهی برای [animate کردن مستقیم styleها](guide/templates/binding#css-style-properties) هم می‌بینید.

### Transitionها، Timing و Easing

Animate کردن اغلب به تنظیم timing، delay و easing behaviorها نیاز دارد. این کار را می‌توان با چند CSS property یا shorthand property انجام داد.

برای یک keyframe animation در CSS، `animation-duration`، `animation-delay` و `animation-timing-function` را مشخص کنید، یا به جای آن از shorthand property مربوط به `animation` استفاده کنید.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-timing"/>

به طور مشابه، برای animationهایی که از `@keyframes` استفاده نمی‌کنند، می‌توانید از `transition-duration`، `transition-delay` و `transition-timing-function` و shorthand مربوط به `transition` استفاده کنید.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="transition-timing"/>

### Trigger کردن یک Animation

animationها می‌توانند با toggle کردن CSS styleها یا classها trigger شوند. وقتی یک class روی element حاضر باشد، animation رخ می‌دهد. حذف class باعث می‌شود element به هر CSSای که برای آن تعریف شده برگردد. این یک مثال است:

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/open-close.ts">
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/native-css/open-close.ts" />
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/native-css/open-close.html" />
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/native-css/open-close.css"/>
</docs-code-multifile>

## Transition و Triggerها

### متحرک‌سازی Auto Height

می‌توانید از CSS Grid برای animate کردن به auto height استفاده کنید.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/auto-height.ts">
    <docs-code header="auto-height.ts" path="adev/src/content/examples/animations/src/app/native-css/auto-height.ts" />
    <docs-code header="auto-height.html" path="adev/src/content/examples/animations/src/app/native-css/auto-height.html" />
    <docs-code header="auto-height.css" path="adev/src/content/examples/animations/src/app/native-css/auto-height.css"  />
</docs-code-multifile>

اگر لازم نیست نگران پشتیبانی همه browserها باشید، می‌توانید `calc-size()` را هم بررسی کنید که راه‌حل واقعی برای animate کردن auto height است. برای اطلاعات بیشتر، [MDN's docs](https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size) و [این tutorial](https://frontendmasters.com/blog/one-of-the-boss-battles-of-css-is-almost-won-transitioning-to-auto/) را ببینید.

### Animate کردن ورود و خروج از view

می‌توانید برای زمانی که یک item وارد view می‌شود یا از view خارج می‌شود animation بسازید. ابتدا ببینیم چطور یک element را هنگام ورود به view animate کنیم. این کار را با `animate.enter` انجام می‌دهیم که وقتی element وارد view شود، animation classها را اعمال می‌کند.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/insert.ts">
    <docs-code header="insert.ts" path="adev/src/content/examples/animations/src/app/native-css/insert.ts" />
    <docs-code header="insert.html" path="adev/src/content/examples/animations/src/app/native-css/insert.html" />
    <docs-code header="insert.css" path="adev/src/content/examples/animations/src/app/native-css/insert.css"  />
</docs-code-multifile>

Animate کردن element هنگام خروج از view مشابه animate کردن هنگام ورود به view است. از `animate.leave` استفاده کنید تا مشخص کنید هنگام خروج element از view کدام CSS classها اعمال شوند.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/remove.ts">
    <docs-code header="remove.ts" path="adev/src/content/examples/animations/src/app/native-css/remove.ts" />
    <docs-code header="remove.html" path="adev/src/content/examples/animations/src/app/native-css/remove.html" />
    <docs-code header="remove.css" path="adev/src/content/examples/animations/src/app/native-css/remove.css"  />
</docs-code-multifile>

برای اطلاعات بیشتر درباره `animate.enter` و `animate.leave`، [راهنمای Enter and Leave animations](guide/animations) را ببینید.

### Animate کردن increment و decrement

Animate کردن هنگام increment و decrement یک pattern رایج در applicationهاست. این مثالی از انجام آن behavior است.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.ts">
    <docs-code header="increment-decrement.ts" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.ts" />
    <docs-code header="increment-decrement.html" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.html" />
    <docs-code header="increment-decrement.css" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.css" />
</docs-code-multifile>

### غیرفعال کردن یک animation یا همه animationها

اگر می‌خواهید animationهایی را که مشخص کرده‌اید غیرفعال کنید، چند option دارید.

1. یک custom class بسازید که animation و transition را به `none` اجبار کند.

```css
.no-animation {
  animation: none !important;
  transition: none !important;
}
```

اعمال این class روی یک element مانع اجرای هر animation روی همان element می‌شود. همچنین می‌توانید این behavior را به کل DOM یا بخشی از DOM خود scope کنید. با این حال، این کار جلوی fire شدن animation eventها را می‌گیرد. اگر برای حذف element منتظر animation eventها هستید، این راه‌حل کار نمی‌کند. یک workaround این است که durationها را به 1 millisecond تنظیم کنید.

2. از media query مربوط به [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) استفاده کنید تا برای کاربرانی که animation کمتر را ترجیح می‌دهند، هیچ animationای play نشود.

3. از افزودن animation classها به صورت programatic جلوگیری کنید.

### Animation Callbackها

اگر actionهایی دارید که می‌خواهید در نقطه‌های مشخصی طی animation اجرا شوند، eventهای مختلفی برای listen کردن وجود دارد. چند نمونه:

[`OnAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event)  
[`OnAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event)  
[`OnAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationitration_event)  
[`OnAnimationCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationcancel_event)

[`OnTransitionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionstart_event)  
[`OnTransitionRun`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionrun_event)  
[`OnTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event)  
[`OnTransitionCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitioncancel_event)

Web Animations API قابلیت‌های اضافی زیادی دارد. برای دیدن همه animation APIهای موجود، [documentation را ببینید](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API).

NOTE: حواستان به bubbling issueها در این callbackها باشد. اگر childها و parentها را animate می‌کنید، eventها از child به parent bubble می‌شوند. stopping propagation را در نظر بگیرید یا جزئیات بیشتری داخل event بررسی کنید تا مشخص شود به target event مورد نظر پاسخ می‌دهید، نه eventای که از child node بالا آمده است. می‌توانید property مربوط به `animationname` یا propertyهایی را که transition می‌شوند بررسی کنید تا مطمئن شوید nodeهای درست را دارید.

## Sequenceهای پیچیده

animationها اغلب پیچیده‌تر از یک fade in یا fade out ساده هستند. ممکن است sequenceهای پیچیده زیادی از animationها داشته باشید که بخواهید اجرا شوند. بیایید چند سناریوی ممکن را ببینیم.

### Stagger کردن animationها در یک list

یک effect رایج این است که animation هر item در یک list را stagger کنید تا cascade effect ایجاد شود. این کار را می‌توان با استفاده از `animation-delay` یا `transition-delay` انجام داد. این نمونه‌ای از CSS چنین کاری است.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/stagger.ts">
    <docs-code header="stagger.ts" path="adev/src/content/examples/animations/src/app/native-css/stagger.ts" />
    <docs-code header="stagger.html" path="adev/src/content/examples/animations/src/app/native-css/stagger.html" />
    <docs-code header="stagger.css" path="adev/src/content/examples/animations/src/app/native-css/stagger.css" />
</docs-code-multifile>

### Animationهای parallel

می‌توانید با استفاده از shorthand property مربوط به `animation`، چند animation را هم‌زمان روی یک element اعمال کنید. هرکدام می‌توانند duration و delay خودشان را داشته باشند. این به شما اجازه می‌دهد animationها را با هم compose کنید و effectهای پیچیده بسازید.

```css
.target-element {
  animation:
    rotate 3s,
    fade-in 2s;
}
```

در این مثال، animationهای `rotate` و `fade-in` هم‌زمان fire می‌شوند، اما durationهای متفاوتی دارند.

### Animate کردن itemهای یک list در حال reorder

itemهای داخل یک loop مربوط به `@for` حذف و دوباره اضافه می‌شوند، که animationها را با استفاده از `@starting-styles` برای entry animationها fire می‌کند. به جای آن، می‌توانید برای همین behavior از `animate.enter` استفاده کنید. برای animate کردن elementها هنگام حذف، همان‌طور که در مثال زیر دیده می‌شود، از `animate.leave` استفاده کنید.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/reorder.ts">
    <docs-code header="reorder.ts" path="adev/src/content/examples/animations/src/app/native-css/reorder.ts" />
    <docs-code header="reorder.html" path="adev/src/content/examples/animations/src/app/native-css/reorder.html" />
    <docs-code header="reorder.css" path="adev/src/content/examples/animations/src/app/native-css/reorder.css" />
</docs-code-multifile>

## کنترل programmatic animationها

می‌توانید animationها را مستقیماً از روی یک element با [`Element.getAnimations()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations) بگیرید. این method آرایه‌ای از هر [`Animation`](https://developer.mozilla.org/en-US/docs/Web/API/Animation) روی آن element برمی‌گرداند. با `Animation` API می‌توانید بسیار بیشتر از چیزی که `AnimationPlayer` از package animations ارائه می‌کرد انجام دهید. از اینجا می‌توانید `cancel()`، `play()`، `pause()`، `reverse()` و کارهای بسیار بیشتری انجام دهید. این API native باید هر چیزی را که برای کنترل animationها لازم دارید فراهم کند.

## بیشتر درباره animationهای Angular

ممکن است به موارد زیر هم علاقه‌مند باشید:

<docs-pill-row>
  <docs-pill href="guide/animations" title="Enter and Leave animations"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route transition animations"/>
</docs-pill-row>
