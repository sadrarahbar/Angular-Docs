# transitionها و triggerهای animation

IMPORTANT: بسته `@angular/animations` اکنون منسوخ شده است. تیم Angular توصیه می‌کند برای animationهای تمام کدهای جدید، از CSS بومی همراه با `animate.enter` و `animate.leave` استفاده کنید. برای اطلاعات بیشتر به [راهنمای animationهای enter و leave](guide/animations) مراجعه کنید. همچنین برای آشنایی با نحوه آغاز مهاجرت برنامه‌ها به animationهای CSS خالص، [مهاجرت از بسته Animations در Angular](guide/animations/migration) را ببینید.

این راهنما stateهای ویژه transition مانند wildcard با نماد `*` و `void` را به‌تفصیل بررسی می‌کند. همچنین نشان می‌دهد این stateها چگونه برای elementهای در حال ورود به view یا خروج از آن استفاده می‌شوند.
در این بخش چند trigger مربوط به animation،‏ callbackهای animation و animation مبتنی بر توالی با استفاده از keyframe نیز بررسی می‌شوند.

## stateهای ازپیش‌تعریف‌شده و تطبیق wildcard

در Angular می‌توان stateهای transition را به‌طور صریح با تابع [`state()`](api/animations/state)، یا با stateهای ازپیش‌تعریف‌شده wildcard یعنی `*` و `void` تعریف کرد.

### state از نوع wildcard

ستاره `*` یا _wildcard_ با هر state مربوط به animation تطبیق دارد.
این ویژگی برای تعریف transitionهایی مفید است که مستقل از state آغاز یا پایان element در HTML اعمال می‌شوند.

برای مثال، transition مربوط به `open => *` زمانی اعمال می‌شود که state یک element از open به هر مقدار دیگری تغییر کند.

<img alt="عبارت‌های state از نوع wildcard" src="assets/images/guide/animations/wildcard-state-500.png">

نمونه کد زیر نیز با استفاده از state از نوع wildcard، مثال قبلی stateهای `open` و `closed` را ادامه می‌دهد.
به‌جای تعریف تمام جفت‌های transition میان stateها، هر transition به `closed` یک ثانیه و هر transition به `open` نیم ثانیه طول می‌کشد.

به این ترتیب می‌توان stateهای جدید را بدون افزودن transition جداگانه برای هرکدام اضافه کرد.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="trigger-wildcard1"/>

برای مشخص‌کردن transition میان stateها در هر دو جهت، از syntax پیکان دوتایی استفاده کنید.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="trigger-wildcard2"/>

### استفاده از state از نوع wildcard همراه با چند state مربوط به transition

در مثال button دوحالته، wildcard چندان مفید نیست؛ زیرا فقط دو state ممکن یعنی `open` و `closed` وجود دارد.
به‌طور کلی، زمانی از stateهای wildcard استفاده کنید که یک element چند state احتمالی برای تغییر داشته باشد.
اگر button بتواند از `open` به `closed` یا مقداری مانند `inProgress` تغییر کند، استفاده از wildcard می‌تواند حجم کد لازم را کاهش دهد.

<img alt="state از نوع wildcard با ۳ state" src="assets/images/guide/animations/wildcard-3-states.png">

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="trigger-transition"/>

transition مربوط به `* => *` هنگام هر تغییر میان دو state اعمال می‌شود.

transitionها به‌ترتیب تعریف‌شدن تطبیق داده می‌شوند.
بنابراین می‌توانید transitionهای دیگری را روی transition مربوط به `* => *` اعمال کنید.
برای مثال، تغییرهای style یا animationهایی را تعریف کنید که فقط بر `open => closed` اعمال شوند و سپس `* => *` را برای جفت stateهایی که به‌طور مشخص بیان نشده‌اند، به‌عنوان fallback به‌کار ببرید.

برای این کار، transitionهای خاص‌تر را _پیش از_ `* => *` فهرست کنید.

### استفاده از wildcard همراه با style

از wildcard یعنی `*` همراه با یک style استفاده کنید تا animation مقدار فعلی آن style را به‌کار بگیرد و بر اساس آن animate شود.
wildcard مقدار fallback است که اگر state در حال animate در trigger اعلام نشده باشد، استفاده می‌شود.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="transition4"/>

### state از نوع void

از state مربوط به `void` برای پیکربندی transition یک element هنگام ورود به صفحه یا خروج از آن استفاده کنید.
[animate کردن ورود به view و خروج از آن](guide/legacy-animations/transition-and-triggers#aliases-enter-and-leave) را ببینید.

### ترکیب stateهای wildcard و void

stateهای wildcard و void را در یک transition ترکیب کنید تا animationهای ورود به صفحه و خروج از آن فعال شوند:

- transition مربوط به `* => void` هنگام خروج element از view، مستقل از state قبلی آن، اعمال می‌شود.
- transition مربوط به `void => *` هنگام ورود element به view، مستقل از state آن هنگام ورود، اعمال می‌شود.
- state از نوع wildcard یعنی `*` با _هر_ state از جمله `void` تطبیق دارد.

## animate کردن ورود به view و خروج از آن

این بخش نحوه animate کردن elementها هنگام ورود به صفحه یا خروج از آن را نشان می‌دهد.

رفتار جدیدی اضافه کنید:

- وقتی یک hero به فهرست heroها اضافه می‌شود، به نظر می‌رسد از سمت چپ به داخل صفحه پرواز می‌کند.
- وقتی یک hero را حذف می‌کنید، به نظر می‌رسد به سمت راست از صفحه پرواز می‌کند.

<docs-code header="hero-list-enter-leave.ts" path="adev/src/content/examples/animations/src/app/hero-list-enter-leave.ts" region="animationdef"/>

در کد بالا، هنگامی که element در HTML به view متصل نیست، state مربوط به `void` اعمال شده است.

## aliasهای :enter و :leave

`:enter` و `:leave` به‌ترتیب aliasهای transitionهای `void => *` و `* => void` هستند.
چندین تابع animation از این aliasها استفاده می‌کنند.

```ts {hideCopy}

transition ( ':enter', [ … ] ); // alias for void => _
transition ( ':leave', [ … ] ); // alias for _ => void

```

هدف‌گرفتن element در حال ورود به view دشوارتر است، زیرا هنوز در DOM وجود ندارد.
برای هدف‌گرفتن elementهای HTML که در view درج یا از آن حذف می‌شوند، از aliasهای `:enter` و `:leave` استفاده کنید.

### استفاده از `*ngIf` و `*ngFor` همراه با :enter و :leave

transition مربوط به `:enter` هنگام قرارگرفتن هر view مربوط به `*ngIf` یا `*ngFor` در صفحه اجرا می‌شود و `:leave` هنگام حذف آن viewها از صفحه اجرا خواهد شد.

IMPORTANT: رفتارهای ورود و خروج گاهی گیج‌کننده‌اند.
به‌عنوان یک قاعده کلی، هر element که Angular به DOM اضافه می‌کند از transition مربوط به `:enter` عبور می‌کند. تنها elementهایی که Angular مستقیماً از DOM حذف می‌کند از transition مربوط به `:leave` عبور می‌کنند. برای مثال، ممکن است view یک element به این دلیل از DOM حذف شود که والد آن در حال حذف‌شدن از DOM است.

این مثال trigger ویژه‌ای برای animation ورود و خروج با نام `myInsertRemoveTrigger` دارد.
template مربوط به HTML شامل کد زیر است.

<docs-code header="insert-remove.html" path="adev/src/content/examples/animations/src/app/insert-remove.html" region="insert-remove"/>

در فایل component،‏ transition مربوط به `:enter` مقدار اولیه opacity را ۰ تنظیم می‌کند. سپس هم‌زمان با درج element در view، آن را animate می‌کند تا opacity به ۱ تغییر کند.

<docs-code header="insert-remove.ts" path="adev/src/content/examples/animations/src/app/insert-remove.ts" region="enter-leave-trigger"/>

توجه کنید که این مثال نیازی به استفاده از [`state()`](api/animations/state) ندارد.

## transitionهای :increment و :decrement

تابع `transition()` مقادیر selector دیگری یعنی `:increment` و `:decrement` را نیز می‌پذیرد.
از این موارد برای آغاز transition هنگام افزایش یا کاهش یک مقدار عددی استفاده کنید.

HELPFUL: مثال زیر از methodهای `query()` و `stagger()` استفاده می‌کند.
برای اطلاعات بیشتر درباره این methodها، صفحه [توالی‌های پیچیده](guide/legacy-animations/complex-sequences) را ببینید.

<docs-code header="hero-list-page.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.ts" region="increment"/>

## مقادیر Boolean در transitionها

اگر trigger یک مقدار Boolean به‌عنوان مقدار binding داشته باشد، می‌توان آن را با عبارت `transition()` که `true` و `false` یا `1` و `0` را مقایسه می‌کند تطبیق داد.

<docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.2.html" region="trigger-boolean"/>

در قطعه‌کد بالا، template مربوط به HTML یک element از نوع `<div>` را با عبارت state مربوط به `isOpen` و مقادیر ممکن `true` و `false`، به triggerای با نام `openClose` متصل می‌کند.
این الگو جایگزینی برای ساخت دو state نام‌دار مانند `open` و `close` است.

در metadata مربوط به `@Component` زیر property مربوط به `animations:`، وقتی state به `true` ارزیابی می‌شود، ارتفاع element مرتبط در HTML یک style از نوع wildcard یا مقدار پیش‌فرض است.
در این حالت animation از همان ارتفاعی استفاده می‌کند که element پیش از شروع animation داشته است.
وقتی element در حالت `closed` است، ارتفاع آن به ۰ animate می‌شود و در نتیجه نامرئی خواهد بود.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.2.ts" region="trigger-boolean"/>

## چند trigger مربوط به animation

می‌توانید بیش از یک trigger مربوط به animation برای یک component تعریف کنید.
triggerهای animation را به elementهای مختلف متصل کنید؛ رابطه والد و فرزند میان elementها بر نحوه و زمان اجرای animationها تأثیر می‌گذارد.

### animationهای والد و فرزند

هر بار که یک animation در Angular فعال می‌شود، animation والد همیشه اولویت دارد و animationهای فرزند مسدود می‌شوند.
برای اجرای animation فرزند، animation والد باید هر element دارای animation فرزند را query کند و سپس با تابع [`animateChild()`](api/animations/animateChild) اجازه اجرای animationها را بدهد.

#### غیرفعال‌کردن animation روی یک element در HTML

یک binding ویژه کنترل animation با نام `@.disabled` را می‌توان روی element در HTML قرار داد تا animationهای آن element و تمام elementهای تو‌در‌تو خاموش شوند.
وقتی مقدار آن true باشد، binding مربوط به `@.disabled` از render شدن تمام animationها جلوگیری می‌کند.

نمونه کد زیر نحوه استفاده از این قابلیت را نشان می‌دهد.

<docs-code-multifile>
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.4.html" region="toggle-animation"/>
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.4.ts" region="toggle-animation" language="typescript"/>
</docs-code-multifile>

وقتی binding مربوط به `@.disabled` مقدار true دارد، trigger مربوط به `@childAnimation` آغاز نمی‌شود.

وقتی animationهای یک element درون template مربوط به HTML با host binding به نام `@.disabled` خاموش شوند، animationهای تمام elementهای داخلی نیز خاموش می‌شوند.
نمی‌توانید چند animation را روی یک element به‌صورت انتخابی خاموش کنید.<!-- vale off -->

بااین‌حال، animationهای انتخابی فرزند را می‌توان به یکی از روش‌های زیر روی والد غیرفعال اجرا کرد:

- animation والد می‌تواند با تابع [`query()`](api/animations/query)،‏ elementهای داخلی قرارگرفته در بخش‌های غیرفعال template مربوط به HTML را جمع‌آوری کند.
آن elementها همچنان می‌توانند animate شوند.
<!-- vale on -->

- animation فرزند می‌تواند توسط والد query شود و سپس با تابع `animateChild()` animate شود.

#### غیرفعال‌کردن تمام animationها

برای خاموش‌کردن تمام animationهای یک برنامه Angular،‏ host binding با نام `@.disabled` را روی بالاترین component در Angular قرار دهید.

<docs-code header="app.ts" path="adev/src/content/examples/animations/src/app/app.ts" region="toggle-app-animations"/>

HELPFUL: غیرفعال‌کردن animationها در کل برنامه هنگام تست end-to-end ‏(E2E) مفید است.

## callbackهای animation

تابع `trigger()` مربوط به animation هنگام شروع و پایان، _callback_ منتشر می‌کند.
مثال زیر componentای را نشان می‌دهد که دارای trigger با نام `openClose` است.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="events1"/>

در template مربوط به HTML،‏ event مربوط به animation از طریق `$event` به‌شکل `@triggerName.start` و `@triggerName.done` بازگردانده می‌شود؛ `triggerName` نام trigger مورد استفاده است.
در این مثال، trigger با نام `openClose` به‌شکل زیر ظاهر می‌شود.

<docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.3.html" region="callbacks"/>

یکی از کاربردهای احتمالی callbackهای animation، پوشاندن زمان انتظار یک فراخوانی کند API مانند جست‌وجو در database است.
برای مثال، می‌توان button با نام **InProgress** را طوری تنظیم کرد که تا پایان عملیات backend،‏ animation تکرارشونده خودش را اجرا کند.

پس از پایان animation فعلی می‌توان animation دیگری را فراخوانی کرد.
برای مثال، پس از تکمیل فراخوانی API،‏ button از state مربوط به `inProgress` به `closed` می‌رود.

animation می‌تواند باعث شود کاربر عملیات را سریع‌تر از آنچه واقعاً هست _احساس_ کند.

callbackها می‌توانند ابزار debugging باشند؛ برای مثال همراه با `console.warn()` برای مشاهده روند برنامه در Developer JavaScript Console مرورگر.
قطعه‌کد زیر برای مثال اصلی ــ button دارای دو state مربوط به `open` و `closed` ــ خروجی console log ایجاد می‌کند.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="events"/>

## Keyframeها

برای ساخت animation چندمرحله‌ای که مراحل آن به‌ترتیب اجرا می‌شوند، از _keyframe_ استفاده کنید.

تابع `keyframe()` در Angular چند تغییر style را در یک بخش زمان‌بندی ممکن می‌کند.
برای مثال، button می‌تواند به‌جای محوشدن، در یک بازه زمانی دوثانیه‌ای چند بار تغییر رنگ دهد.

<img alt="keyframeها" src="assets/images/guide/animations/keyframes-500.png">

کد این تغییر رنگ می‌تواند به‌شکل زیر باشد.

<docs-code header="status-slider.ts" path="adev/src/content/examples/animations/src/app/status-slider.ts" region="keyframes"/>

### Offset

keyframeها شامل یک `offset` هستند که نقطه وقوع هر تغییر style در animation را تعریف می‌کند.
offsetها معیارهایی نسبی از صفر تا یک هستند که آغاز و پایان animation را مشخص می‌کنند. اگر دست‌کم یک بار استفاده شوند، باید روی تمام مراحل keyframe اعمال شوند.

تعریف offset برای keyframeها اختیاری است.
اگر آن‌ها را حذف کنید، offsetهایی با فاصله مساوی به‌طور خودکار اختصاص می‌یابند.
برای مثال، سه keyframe بدون offset ازپیش‌تعریف‌شده، مقادیر ۰،‏ ۰٫۵ و ۱ را دریافت می‌کنند.
تعیین offset برابر ۰٫۸ برای transition میانی در مثال بالا می‌تواند به‌شکل زیر باشد.

<img alt="keyframeها همراه با offset" src="assets/images/guide/animations/keyframes-offset-500.png">

کدی که offset در آن مشخص شده به‌شکل زیر است.

<docs-code header="status-slider.ts" path="adev/src/content/examples/animations/src/app/status-slider.ts" region="keyframesWithOffsets"/>

می‌توانید keyframeها را در یک animation با `duration`،‏ `delay` و `easing` ترکیب کنید.

### keyframeهای دارای ضربان

با تعریف styleها در offsetهای مشخص در طول animation، از keyframeها برای ایجاد جلوه ضربان استفاده کنید.

در ادامه مثالی از ساخت جلوه ضربان با keyframeها آمده است:

- stateهای اصلی `open` و `closed` همراه با تغییرهای اولیه ارتفاع، رنگ و opacity که طی یک ثانیه رخ می‌دهند.
- توالی keyframe در میانه قرار می‌گیرد و باعث می‌شود button در همان بازه یک‌ثانیه‌ای به‌شکل نامنظم ضربان داشته باشد.

<img alt="keyframeهای دارای ضربان نامنظم" src="assets/images/guide/animations/keyframes-pulsation.png">

قطعه‌کد این animation می‌تواند به‌شکل زیر باشد.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.1.ts" region="trigger"/>

### propertyها و واحدهای قابل animate

animationهای Angular بر web animationها ساخته شده‌اند؛ بنابراین می‌توانید هر propertyای را که مرورگر قابل animate می‌داند animate کنید.
این موارد شامل موقعیت، اندازه، transform، رنگ، border و موارد دیگر هستند.
W3C فهرستی از propertyهای قابل animate را در صفحه [CSS Transitions](https://www.w3.org/TR/css-transitions-1) نگهداری می‌کند.

برای propertyهای دارای مقدار عددی، با ارائه مقدار به‌صورت رشته درون کوتیشن و همراه با پسوند مناسب، واحد را تعریف کنید:

- ۵۰ پیکسل:
  `'50px'`

- اندازه نسبی فونت:
  `'3em'`

- درصد:
  `'100%'`

می‌توانید مقدار را به‌صورت عدد نیز ارائه دهید. در این حالت Angular واحد پیش‌فرض را پیکسل یا `px` در نظر می‌گیرد.
نوشتن ۵۰ پیکسل به‌شکل `50` با `'50px'` یکسان است.

HELPFUL: در مقابل، رشته `"50"` معتبر در نظر گرفته نمی‌شود.

### محاسبه خودکار property با wildcard

گاهی مقدار یک property ابعادی در style تا هنگام runtime مشخص نیست.
برای مثال، width و height یک element اغلب به محتوای آن یا اندازه صفحه وابسته است.
animate کردن این propertyها با CSS معمولاً دشوار است.

در این موارد می‌توانید در `style()` از مقدار ویژه wildcard یعنی `*` برای property استفاده کنید. مقدار آن property مشخص در runtime محاسبه و سپس وارد animation می‌شود.

مثال زیر triggerای با نام `shrinkOut` دارد که هنگام خروج element در HTML از صفحه استفاده می‌شود.
animation ارتفاع element پیش از خروج را دریافت کرده و آن را از همان ارتفاع به صفر animate می‌کند.

<docs-code header="hero-list-auto.ts" path="adev/src/content/examples/animations/src/app/hero-list-auto.ts" region="auto-calc"/>

### خلاصه keyframeها

تابع `keyframes()` در Angular امکان تعیین چند style میانی در یک transition را فراهم می‌کند. می‌توان از `offset` اختیاری برای تعریف نقطه وقوع هر تغییر style در animation استفاده کرد.

## مطالب بیشتر درباره animationهای Angular

ممکن است مطالب زیر نیز برایتان مفید باشند:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations" title="مقدمه‌ای بر animationهای Angular"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="توالی‌های پیچیده animation"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="animationهای قابل‌استفاده مجدد"/>
  <docs-pill href="guide/routing/route-transition-animations" title="animationهای transition در routing"/>
  <docs-pill href="guide/animations/migration" title="مهاجرت به animationهای CSS بومی"/>
</docs-pill-row>
