# متحرک‌سازی applicationها با `animate.enter` و `animate.leave`

animationهای خوب طراحی‌شده می‌توانند application شما را شهودی‌تر و جذاب‌تر کنند، اما فقط جنبه ظاهری ندارند.
animationها می‌توانند application و تجربه کاربر را به چند روش بهتر کنند:

- بدون animation، transitionهای web page می‌توانند ناگهانی و آزاردهنده به نظر برسند.
- motion تجربه کاربر را بسیار بهتر می‌کند، بنابراین animationها به کاربران فرصت می‌دهند response application به actionهایشان را تشخیص دهند.
- animationهای خوب می‌توانند توجه کاربر را در طول یک workflow به نرمی هدایت کنند.

Angular برای animate کردن elementهای application شما، `animate.enter` و `animate.leave` را فراهم می‌کند. این دو feature در زمان مناسب CSS classهای enter و leave را اعمال می‌کنند یا functionهایی را فراخوانی می‌کنند تا animationها از libraryهای third-party اعمال شوند. `animate.enter` و `animate.leave` directive نیستند. آن‌ها API خاصی هستند که مستقیماً توسط Angular compiler پشتیبانی می‌شوند. می‌توان از آن‌ها مستقیم روی elementها و همچنین به عنوان host binding استفاده کرد.

## `animate.enter`

می‌توانید از `animate.enter` برای animate کردن elementها هنگام _ورود_ آن‌ها به DOM استفاده کنید. می‌توانید enter animationها را با CSS classها، چه با transitionها و چه با keyframe animationها، تعریف کنید.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.ts">
    <docs-code header="enter.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.ts" />
    <docs-code header="enter.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.html" />
    <docs-code header="enter.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.css"/>
</docs-code-multifile>

وقتی animation کامل شود، Angular class یا classهایی را که در `animate.enter` مشخص کرده‌اید از DOM حذف می‌کند. Animation classها فقط وقتی animation فعال است وجود دارند.

NOTE: هنگام استفاده از چند keyframe animation یا transition property روی یک element، Angular همه classها را فقط _بعد از_ کامل شدن طولانی‌ترین animation حذف می‌کند.

می‌توانید `animate.enter` را همراه با هر feature دیگر Angular مثل control flow یا dynamic expressionها استفاده کنید. `animate.enter` هم یک class string منفرد را می‌پذیرد \(با چند class که با space جدا شده‌اند\)، و هم آرایه‌ای از class stringها را.

یک نکته سریع درباره استفاده از CSS transitionها: اگر به جای keyframe animation از transition استفاده می‌کنید، classهایی که با `animate.enter` به element اضافه می‌شوند stateای را نشان می‌دهند که transition به سمت آن animate می‌کند. CSS پایه element همان چیزی است که element وقتی هیچ animationای اجرا نمی‌شود شبیه آن خواهد بود، که احتمالاً مشابه end state مربوط به CSS transition است. بنابراین هنوز باید آن را با `@starting-style` pair کنید تا state مناسب _from_ برای کار کردن transition داشته باشید.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.ts">
    <docs-code header="enter-binding.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.ts" />
    <docs-code header="enter-binding.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.html" />
    <docs-code header="enter-binding.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.css"/>
</docs-code-multifile>

## `animate.leave`

می‌توانید از `animate.leave` برای animate کردن elementها هنگام _خروج_ آن‌ها از DOM استفاده کنید. می‌توانید leave animationها را با CSS classها، چه با transformها و چه با keyframe animationها، تعریف کنید.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.ts">
    <docs-code header="leave.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.ts" />
    <docs-code header="leave.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.html" />
    <docs-code header="leave.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.css"/>
</docs-code-multifile>

وقتی animation کامل شود، Angular به صورت خودکار element animateشده را از DOM حذف می‌کند.

NOTE: هنگام استفاده از چند keyframe animation یا transition property روی یک element، Angular فقط _بعد از_ کامل شدن طولانی‌ترین آن animationها منتظر حذف element می‌ماند.

`animate.leave` را می‌توان همراه با signalها و bindingهای دیگر هم استفاده کرد. می‌توانید `animate.leave` را با یک class یا چند class استفاده کنید. آن را یا به صورت یک string ساده با spaceها مشخص کنید یا به صورت string array.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.ts">
    <docs-code header="leave-binding.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.ts" />
    <docs-code header="leave-binding.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.html" />
    <docs-code header="leave-binding.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.css"/>
</docs-code-multifile>

### ترتیب حذف element

در نحوه اجرای animationهای `animate.leave` و زمان رخ دادن animation کمی ظرافت وجود دارد. `animate.leave` وقتی کار می‌کند که روی elementای قرار بگیرد که در حال حذف شدن است، و اگر `animate.leave` روی elementای قرار بگیرد که _descendent_ همان element در حال حذف است، animationهای child _قبل از_ حذف parent node از DOM اجرا می‌شوند. این تضمین می‌کند که بتوانید با اطمینان child elementها را animate کنید بدون اینکه parent node زودتر از موعد ناپدید شود.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-parent.ts">
    <docs-code header="leave.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-parent.ts" />
    <docs-code header="leave.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-parent.html" />
    <docs-code header="leave.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-parent.css"/>
</docs-code-multifile>

## Event Bindingها، Functionها و Libraryهای third-party

هر دو `animate.enter` و `animate.leave` از syntax مربوط به event binding پشتیبانی می‌کنند که امکان function call را فراهم می‌کند. می‌توانید از این syntax برای فراخوانی function در کد کامپوننت خود یا استفاده از animation libraryهای third-party مثل [GSAP](https://gsap.com/)، [anime.js](https://animejs.com/) یا هر JavaScript animation library دیگر استفاده کنید.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.ts">
    <docs-code header="leave-event.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.ts" />
    <docs-code header="leave-event.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.html" />
    <docs-code header="leave-event.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.css"/>
</docs-code-multifile>

object مربوط به `$event` نوع `AnimationCallbackEvent` دارد. این object شامل element به عنوان `target` است و functionای به نام `animationComplete()` فراهم می‌کند تا وقتی animation تمام شد framework را باخبر کنید.

IMPORTANT: هنگام استفاده از `animate.leave`، برای اینکه Angular element را حذف کند **باید** function مربوط به `animationComplete()` را فراخوانی کنید.

اگر هنگام استفاده از `animate.leave`، `animationComplete()` را فراخوانی نکنید، Angular پس از delay چهارثانیه‌ای این function را به صورت خودکار فراخوانی می‌کند. می‌توانید مدت delay را با provide کردن token مربوط به `MAX_ANIMATION_TIMEOUT` بر حسب millisecond configure کنید.

```typescript
  { provide: MAX_ANIMATION_TIMEOUT, useValue: 6000 }
```

## سازگاری با Legacy Angular Animations

نمی‌توانید legacy animationها را همراه با `animate.enter` و `animate.leave` داخل همان کامپوننت استفاده کنید. انجام این کار باعث می‌شود enter classها روی element باقی بمانند یا nodeهای leaving حذف نشوند. اما استفاده از legacy animationها و animationهای جدید `animate.enter` و `animate.leave` داخل همان _application_ مشکلی ندارد. تنها caveat مربوط به content projection است. اگر content را از کامپوننتی با legacy animationها به کامپوننت دیگری با `animate.enter` یا `animate.leave` project کنید، یا برعکس، همان رفتاری رخ می‌دهد که انگار آن‌ها با هم در همان کامپوننت استفاده شده‌اند. این پشتیبانی نمی‌شود.

## Testing

`TestBed` پشتیبانی built-in برای فعال یا غیرفعال کردن animationها در test environment شما فراهم می‌کند. CSS animationها برای اجرا به browser نیاز دارند و بسیاری از APIها در test environment در دسترس نیستند. به صورت پیش‌فرض، `TestBed` animationها را در test environmentهای شما غیرفعال می‌کند.

اگر می‌خواهید test کنید animationها در browser test، مثلاً end-to-end test، واقعاً animate می‌شوند، می‌توانید `TestBed` را با مشخص کردن `animationsEnabled: true` در test configuration، برای فعال کردن animationها configure کنید.

```typescript
TestBed.configureTestingModule({animationsEnabled: true});
```

این کار animationها را در test environment شما configure می‌کند تا normal رفتار کنند.

NOTE: بعضی test environmentها eventهای animation مثل `animationstart`، `animationend` و معادل‌های transition event آن‌ها را emit نمی‌کنند.

## بیشتر درباره animationهای Angular

ممکن است به موارد زیر هم علاقه‌مند باشید:

<docs-pill-row>
  <docs-pill href="guide/animations/css" title="Complex Animations with CSS"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route transition animations"/>
</docs-pill-row>
