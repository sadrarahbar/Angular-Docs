# توالی‌های پیچیده animation

IMPORTANT: بسته `@angular/animations` اکنون منسوخ شده است. تیم Angular توصیه می‌کند برای animationهای تمام کدهای جدید، از CSS بومی همراه با `animate.enter` و `animate.leave` استفاده کنید. برای اطلاعات بیشتر به [راهنمای animationهای enter و leave](/guide/animations) مراجعه کنید. همچنین برای آشنایی با نحوه آغاز مهاجرت برنامه‌ها به animationهای CSS خالص، [مهاجرت از بسته Animations در Angular](guide/animations/migration) را ببینید.

تا اینجا animationهای ساده یک element در HTML را آموختیم.
Angular امکان animate کردن توالی‌های هماهنگ را نیز فراهم می‌کند؛ مانند یک grid یا فهرست کامل از elementها هنگام ورود به صفحه و خروج از آن.
می‌توانید چند animation را به‌صورت موازی اجرا کنید یا animationهای مجزا را به‌ترتیب و یکی پس از دیگری اجرا کنید.

توابع کنترل‌کننده توالی‌های پیچیده animation عبارت‌اند از:

| توابع                             | جزئیات                                                          |
| :-------------------------------- | :-------------------------------------------------------------- |
| `query()`                         | یک یا چند element داخلی HTML را پیدا می‌کند.                    |
| `stagger()`                       | تأخیری آبشاری بر animation چندین element اعمال می‌کند.          |
| [`group()`](api/animations/group) | چند مرحله animation را به‌صورت موازی اجرا می‌کند.               |
| `sequence()`                      | مراحل animation را یکی پس از دیگری اجرا می‌کند.                 |

## تابع query()

بیشتر animationهای پیچیده برای یافتن elementهای فرزند و اعمال animation بر آن‌ها به تابع `query()` متکی هستند. نمونه‌های پایه عبارت‌اند از:

| نمونه‌ها                                | جزئیات                                                                                                                                                                                                                |
| :-------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query()` و سپس `animate()`             | برای جست‌وجوی elementهای ساده HTML و اعمال مستقیم animation بر آن‌ها استفاده می‌شود.                                                                                                                                 |
| `query()` و سپس `animateChild()`        | برای جست‌وجوی elementهای فرزندی استفاده می‌شود که خود metadata مربوط به animation دارند و آن animationها را فعال می‌کند؛ animationهایی که در غیر این صورت توسط animation مربوط به element فعلی یا والد مسدود می‌شوند. |

آرگومان اول `query()` یک رشته [selector در CSS](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) است که می‌تواند tokenهای مخصوص Angular زیر را نیز داشته باشد:

| tokenها                   | جزئیات                                              |
| :------------------------ | :-------------------------------------------------- |
| `:enter` <br /> `:leave`  | برای elementهای در حال ورود یا خروج.                |
| `:animating`              | برای elementهایی که در حال animate شدن هستند.       |
| `@*` <br /> `@triggerName`| برای elementهای دارای هر trigger یا یک trigger خاص. |
| `:self`                   | خود element در حال animate شدن.                     |

<docs-callout title="elementهای در حال ورود و خروج">

تمام elementهای فرزند واقعاً در حال ورود یا خروج محسوب نمی‌شوند؛ این موضوع گاهی برخلاف انتظار و گیج‌کننده است. برای اطلاعات بیشتر به [مستندات API مربوط به query](api/animations/query#entering-and-leaving-elements) مراجعه کنید.

نمونه‌ای تصویری از این رفتار را نیز می‌توانید در مثال animationها ــ که در [بخش مقدمه](guide/legacy-animations#about-this-guide) معرفی شد ــ زیر تب Querying ببینید.

</docs-callout>

## animate کردن چند element با توابع query() و stagger()

پس از جست‌وجوی elementهای فرزند با `query()`، تابع `stagger()` به شما امکان می‌دهد فاصله زمانی میان هر آیتم را مشخص کنید تا elementها با تأخیر نسبت به یکدیگر animate شوند.

مثال زیر نحوه استفاده از توابع `query()` و `stagger()` را برای animate کردن یک فهرست از heroها نشان می‌دهد؛ هر مورد با اندکی تأخیر و به‌ترتیب از بالا به پایین اضافه می‌شود.

- با `query()` elementای را پیدا کنید که وارد صفحه می‌شود و معیارهای مشخصی دارد.
- برای هر یک از این elementها، با `style()` یک style اولیه یکسان تنظیم کنید.
  element را شفاف کنید و با `transform` آن را از موقعیت اصلی بیرون ببرید تا بتواند به محل خود slide شود.

- با `stagger()` هر animation را ۳۰ میلی‌ثانیه به تأخیر بیندازید.
- هر element را با یک منحنی easing سفارشی طی ۰٫۵ ثانیه روی صفحه animate کنید؛ هم‌زمان opacity آن را افزایش دهید و transform را برگردانید.

<docs-code header="hero-list-page.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.ts" region="page-animations"/>

## animation موازی با تابع group()

دیدید که چگونه میان animationهای متوالی تأخیر ایجاد کنید.
اما ممکن است بخواهید animationهایی را پیکربندی کنید که به‌صورت موازی رخ می‌دهند.
برای مثال، شاید بخواهید دو property در CSS مربوط به یک element را animate کنید، اما برای هرکدام تابع `easing` متفاوتی به‌کار ببرید.
برای این کار می‌توانید از تابع animation یعنی [`group()`](api/animations/group) استفاده کنید.

HELPFUL: تابع [`group()`](api/animations/group) برای گروه‌بندی _مراحل_ animation استفاده می‌شود، نه elementهای animate‌شده.

مثال زیر از [`group()`](api/animations/group) برای هر دو حالت `:enter` و `:leave` با دو پیکربندی زمان‌بندی متفاوت استفاده می‌کند؛ بنابراین دو animation مستقل را به‌صورت موازی بر یک element اعمال می‌کند.

<docs-code header="hero-list-groups.ts (excerpt)" path="adev/src/content/examples/animations/src/app/hero-list-groups.ts" region="animationdef"/>

## animationهای متوالی در برابر موازی

در animationهای پیچیده ممکن است چند اتفاق هم‌زمان رخ دهند.
اما اگر بخواهید چند animation را یکی پس از دیگری اجرا کنید چه؟ پیش‌تر از [`group()`](api/animations/group) برای اجرای موازی و هم‌زمان چند animation استفاده کردید.

تابع دیگری با نام `sequence()` به شما امکان می‌دهد همان animationها را یکی پس از دیگری اجرا کنید.
درون `sequence()`، مراحل animation از فراخوانی تابع `style()` یا `animate()` تشکیل می‌شوند.

- با `style()` داده‌های style ارائه‌شده را بی‌درنگ اعمال کنید.
- با `animate()` داده‌های style را طی یک بازه زمانی مشخص اعمال کنید.

## مثال animation مربوط به filter

animation دیگری را در صفحه نمونه بررسی کنید.
در تب Filter/Stagger، متنی مانند `Magnet` یا `tornado` را در کادر **Search Heroes** وارد کنید.

filter هم‌زمان با تایپ شما و به‌صورت بلادرنگ کار می‌کند.
با تایپ هر حرف جدید، elementها از صفحه خارج و filter به‌تدریج سخت‌گیرانه‌تر می‌شود.
با حذف هر حرف از کادر filter، فهرست heroها به‌تدریج دوباره وارد صفحه می‌شود.

template مربوط به HTML دارای triggerای با نام `filterAnimation` است.

<docs-code header="hero-list-page.html" path="adev/src/content/examples/animations/src/app/hero-list-page.html" region="filter-animations" language="angular-html"/>

`filterAnimation` در decorator مربوط به component شامل سه transition است.

<docs-code header="hero-list-page.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.ts" region="filter-animations"/>

کد این مثال کارهای زیر را انجام می‌دهد:

- وقتی کاربر برای نخستین بار این صفحه را باز می‌کند یا به آن می‌رود، animationها را نادیده می‌گیرد (animation مربوط به filter نتایج موجود را محدود می‌کند؛ بنابراین فقط روی elementهایی کار می‌کند که از قبل در DOM وجود دارند).
- heroها را بر اساس مقدار ورودی جست‌وجو filter می‌کند.

برای هر تغییر:

- با تنظیم opacity و width روی ۰، element در حال خروج از DOM را پنهان می‌کند.
- element در حال ورود به DOM را طی ۳۰۰ میلی‌ثانیه animate می‌کند.
  در طول animation،‏ element دارای width و opacity پیش‌فرض خود می‌شود.

- اگر چند element وارد DOM یا از آن خارج شوند، animation هر element را از بالای صفحه و با تأخیر ۵۰ میلی‌ثانیه نسبت به element بعدی به‌صورت stagger اجرا می‌کند.

## animate کردن آیتم‌های یک فهرست مرتب‌شونده

با اینکه Angular آیتم‌های فهرست `*ngFor` را به‌صورت پیش‌فرض به‌درستی animate می‌کند، در صورت تغییر ترتیب آن‌ها قادر به انجام این کار نخواهد بود.
دلیل این است که Angular دیگر نمی‌تواند تشخیص دهد هر element کدام است و در نتیجه animationها به‌درستی اجرا نمی‌شوند.
تنها راه کمک به Angular برای ردیابی چنین elementهایی، اختصاص یک `TrackByFunction` به directive مربوط به `NgForOf` است.
این کار تضمین می‌کند Angular همواره هر element را تشخیص دهد و در نتیجه animation درست را همیشه بر element صحیح اعمال کند.

IMPORTANT: اگر لازم است آیتم‌های یک فهرست `*ngFor` را animate کنید و احتمال تغییر ترتیب آن‌ها هنگام runtime وجود دارد، همیشه از `TrackByFunction` استفاده کنید.

## animationها و View Encapsulation در component

animationهای Angular بر ساختار DOM مربوط به componentها استوارند و [View Encapsulation](guide/components/styling#style-scoping) را مستقیماً در نظر نمی‌گیرند. یعنی componentهای دارای `ViewEncapsulation.Emulated` دقیقاً مانند زمانی رفتار می‌کنند که از `ViewEncapsulation.None` استفاده می‌کنند (`ViewEncapsulation.ShadowDom` و `ViewEncapsulation.ExperimentalIsolatedShadowDom` رفتار متفاوتی دارند که کمی بعد بررسی می‌کنیم).

برای مثال، اگر تابع `query()` ــ که در ادامه راهنمای Animations بیشتر با آن آشنا می‌شوید ــ در بالای درختی از componentهای دارای view encapsulation شبیه‌سازی‌شده اعمال شود، این query می‌تواند elementهای DOM را در هر عمقی از درخت شناسایی و در نتیجه animate کند.

از سوی دیگر، `ViewEncapsulation.ShadowDom` و `ViewEncapsulation.ExperimentalIsolatedShadowDom` با «پنهان‌کردن» elementهای DOM درون elementهای [`ShadowRoot`](https://developer.mozilla.org/docs/Web/API/ShadowRoot)، ساختار DOM مربوط به component را تغییر می‌دهند. چنین دست‌کاری‌هایی در DOM مانع عملکرد درست برخی پیاده‌سازی‌های animation می‌شوند، زیرا این پیاده‌سازی‌ها به ساختار ساده DOM متکی‌اند و elementهای `ShadowRoot` را در نظر نمی‌گیرند. بنابراین توصیه می‌شود animation را روی viewهایی که شامل componentهای دارای view encapsulation از نوع ShadowDom هستند اعمال نکنید.

## خلاصه توالی animation

توابع Angular برای animate کردن چند element، با `query()` برای یافتن elementهای داخلی آغاز می‌شوند؛ برای مثال، جمع‌آوری تمام تصویرهای درون یک `<div>`.
توابع باقی‌مانده یعنی `stagger()`،‏ [`group()`](api/animations/group) و `sequence()` تأخیرهای آبشاری اعمال می‌کنند یا امکان کنترل شیوه اعمال چند مرحله animation را فراهم می‌سازند.

## مطالب بیشتر درباره animationهای Angular

ممکن است مطالب زیر نیز برایتان مفید باشند:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations" title="مقدمه‌ای بر animationهای Angular"/>
  <docs-pill href="guide/legacy-animations/transition-and-triggers" title="transitionها و triggerها"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="animationهای قابل‌استفاده مجدد"/>
  <docs-pill href="guide/routing/route-transition-animations" title="animationهای transition در routing"/>
  <docs-pill href="guide/animations/migration" title="مهاجرت به animationهای CSS بومی"/>
</docs-pill-row>
