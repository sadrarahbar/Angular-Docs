<docs-decorative-header title="نقشه راه انگولار" imgSrc="adev/src/assets/images/roadmap.svg"> <!-- markdownlint-disable-line -->
با برنامه تیم انگولار برای پیشبرد وب آشنا شوید.
</docs-decorative-header>

انگولار پروژه‌ای متن‌باز است و commitها، PRها و روند روزانه آن در GitHub قابل پیگیری هستند. برای شفاف‌تر شدن ارتباط این فعالیت‌های روزمره با آینده فریم‌ورک، نقشه راه ما چشم‌انداز فعلی و برنامه‌های آینده تیم را یک‌جا ارائه می‌کند.

پروژه‌های زیر به نسخه مشخصی از انگولار وابسته نیستند. آن‌ها را پس از تکمیل منتشر می‌کنیم و بر اساس برنامه انتشار و با رعایت نسخه‌بندی معنایی در نسخه مناسب قرار می‌گیرند. برای نمونه، قابلیت تکمیل‌شده در نسخه minor بعدی منتشر می‌شود؛ مگر اینکه تغییر ناسازگار داشته باشد که در این صورت در نسخه major بعدی قرار می‌گیرد.

انگولار اکنون سه هدف برای فریم‌ورک دارد:

1. بهبود [تجربه هوش مصنوعی برای توسعه‌دهندگان](/ai)
1. بهبود [تجربه توسعه‌دهندگان انگولار](#improving-the-angular-developer-experience)
1. بهبود performance فریم‌ورک

برای آشنایی با پروژه‌های مشخصی که این اهداف را محقق می‌کنند، ادامه مطلب را بخوانید.

## تجربه انگولار مدرن

توسعه با جدیدترین قابلیت‌های انگولار در نقشه راه را آغاز کنید. فهرست زیر وضعیت فعلی قابلیت‌های جدید نقشه راه را نشان می‌دهد:

### آماده آزمایش

- [Web MCP](/ai/webmcp)

### آماده production

- [Signal Forms](/guide/forms/signals/overview)
- [Resource API](/guide/signals/resource)
- [httpResource](/api/common/http/httpResource)
- [change detection بدون Zone](/guide/zoneless)
- [Linked Signal API](/guide/signals/linked-signal)
- [hydration افزایشی](/guide/incremental-hydration)
- [Effect API](/api/core/effect)
- [بازپخش event همراه SSR](/api/platform-browser/withEventReplay)
- [حالت render در سطح route](/guide/ssr)

## بهبود تجربه هوش مصنوعی برای توسعه‌دهندگان انگولار

### ارائه بهترین قابلیت‌های هوش مصنوعی در انگولار

<docs-card-container>
  <docs-card title="انگولار مجهز به هوش مصنوعی">
  هوش مصنوعی همچنان چشم‌انداز توسعه را شکل می‌دهد و نحوه ساخت applicationها و تجربه‌های کاربری ممکن را تغییر داده است. قصد داریم بهترین پشتیبانی را برای جامعه توسعه‌دهندگان در کدنویسی با کمک هوش مصنوعی و یکپارچه‌سازی آن با applicationها فراهم کنیم.
  </docs-card>
  <docs-card title="توسعه با هوش مصنوعی">
  تیم به توسعه یکپارچه‌سازی‌های معنادار با ابزارهایی مانند Google AI Studio، ‏Gemini CLI و ابزارهای agentic مانند IDEهای Agentic نظیر Antigravity ادامه می‌دهد. قصد داریم راه‌حل‌هایی هماهنگ با این صنعت به‌سرعت در حال تحول ارائه کنیم؛ از جمله agent skillها، قابلیت‌های جدید MCP و AI SDKها.
  </docs-card>
  <docs-card title="تولید کد">
  [بر اساس پژوهش ما](https://blog.angular.dev/beyond-the-horizon-how-angular-is-embracing-ai-for-next-gen-apps-7a7ed706e1a3)، کیفیت تولید کد انگولار با LLMهای مدرن هم‌اکنون بالا است. سرمایه‌گذاری برای بهبود آن را ادامه می‌دهیم؛ یعنی کیفیت تولید کد را با مدل‌های فعلی به‌طور منظم ارزیابی و از طریق system instructionها، مستندات و تغییرات هدفمند فریم‌ورک بهتر می‌کنیم. سرمایه‌گذاری روی [Web Codegen Scorer](https://github.com/angular/web-codegen-scorer)، زیرساخت ارزیابی ما، نیز ادامه می‌یابد.
  </docs-card>
  <docs-card title="تجربه‌های مجهز به هوش مصنوعی">
  مفاهیم جدیدی مانند تولید پویای UI، مرز تازه‌ای برای توسعه‌دهندگان انگولار ایجاد کرده‌اند. با افزودن پشتیبانی انگولار از A2UI آغاز کردیم و فعالانه فرصت‌های بیشتری برای پشتیبانی از تجربه‌های مدرن application جست‌وجو می‌کنیم.
  </docs-card>
</docs-card-container>

## بهبود تجربه توسعه‌دهندگان انگولار

### سرعت توسعه‌دهنده

<docs-card-container>
  <docs-card title="کامپایلر">
    Microsoft در سال گذشته کامپایلر TypeScript را به Go منتقل کرده و برای کامپایل‌های معمول TypeScript وعده افزایش سرعت ۵ تا ۱۰ برابری داده است. انگولار یکی از عمیق‌ترین یکپارچه‌سازی‌ها با کامپایلر TypeScript را دارد؛ بنابراین پشتیبانی از گردش‌کار جدید مبتنی بر tsgo هم در کامپایلر و هم language service به تغییرات معماری بزرگ‌تری نیاز دارد.

در حال نمونه‌سازی و بررسی شکل این پشتیبانی هستیم و کامپایلر انگولاری سازگار با tsgo ارائه خواهیم کرد که مزایای performance انتقال بومی Microsoft را به ecosystem انگولار می‌آورد.
</docs-card>

  <docs-card title="سازگاری بهتر با ecosystem">
    توسعه‌دهندگان کد تولیدشده با هوش مصنوعی را با کد دستی ترکیب می‌کنند و می‌خواهند از کتابخانه‌های محبوب استفاده و تجربه‌های جدید را سریع یکپارچه کنند. انگولار باید به‌خوبی در این ecosystem ادغام شود؛ توسعه‌دهندگان باید بتوانند ابزارهای محبوب خود را به کار ببرند و فریم‌ورک‌ها را متناسب با نیازشان ترکیب کنند.

در این پروژه، نیازهای تعامل میان فریم‌ورک‌ها و ابزار build را برای بهبود سازگاری بررسی می‌کنیم. همچنین می‌خواهیم ببینیم آیا می‌توانیم مانند پروژه [Web Codegen Scorer](https://github.com/angular/web-codegen-scorer)، با ارائه راه‌حل‌های مستقل از فریم‌ورک برای مسائل حل‌نشده ecosystem وب به این حوزه کمک کنیم.

  </docs-card>

  <docs-card title="Componentها">
  در Angular v21، ‏Angular Aria را به‌صورت developer preview با هشت الگو برای componentهای headless و دسترس‌پذیر منتشر کردیم. قصد داریم این الگوها را پایدار کنیم و در صورت نیاز الگوهای جدیدی ارائه دهیم. هدف، ایجاد بنیادی محکم برای ساخت componentهای سفارشی با Angular Aria است؛ تعاملات را ما فراهم می‌کنیم و شما style متناسب با design system خود را می‌آورید. توسعه‌دهندگان می‌توانند component سفارشی را با Angular Aria بسازند، از الگوهای تعاملی CDK استفاده کنند یا componentهای آماده و styleدار Material را به کار ببرند.

برای accessibility، ‏componentها و الگوها را پیوسته در برابر استانداردهایی مانند WCAG ارزیابی و مشکلات شناسایی‌شده را اصلاح می‌کنیم.
</docs-card>
</docs-card-container>

### بهبود ابزارها

<docs-card-container>
  <docs-card title="مدرن‌سازی ابزار unit testing با ng test">
  پس از انتشار پایدار Vitest در Angular v21، این ابزار اکنون test runner اصلی ما است. تمرکز فعلی روی پایدار کردن ابزار آزمایشی migration از Karma به Vitest و بررسی قابلیت‌های جدید برای بهبود بیشتر گردش‌کار testing توسعه‌دهنده است.
</docs-card>
</docs-card-container>

## پروژه‌های تکمیل‌شده

<docs-card-container>

  <docs-card title="Signal Forms" href="/guide/forms/signals/overview" link="تکمیل‌شده در ۲۰۲۶">
  Signal Forms اکنون پایدار است. این رویکرد جدید به توسعه‌دهندگان اجازه می‌دهد state مربوط به form را با Signalها مدیریت کنند و تجربه‌ای روان برای ایجاد form داشته باشند. Signal Forms را پایدار و تعامل آن با reactive formها را بهتر کردیم تا تیم‌ها بتوانند formهای بزرگ را به‌تدریج و با سرعت دلخواه منتقل کنند.
  </docs-card>
  
  <docs-card title="Reactivity" href="/guide/signals" link="تکمیل‌شده در ۲۰۲۶">
  APIهای Signal جدید `resource()` و `httpResource()` را برای مدیریت انعطاف‌پذیر داده asynchronous معرفی و آن‌ها را برای توسعه‌دهندگان پایدار کردیم.
  </docs-card>
  
  <docs-card title="Change Detection" href="/api/core/ChangeDetectionStrategy" link="تکمیل‌شده در ۲۰۲۶">
  با پایدار و پیش‌فرض شدن حالت بدون Zone، راهبرد پیش‌فرض change detection را مطابق best practiceهای فعلی روی `OnPush` قرار دادیم. همچنین `ChangeDetectionStrategy.Default` را به `ChangeDetectionStrategy.Eager` تغییر نام دادیم.
  
  [برای جزئیات، بحث RFC را ببینید](https://github.com/angular/angular/discussions/66779).
  </docs-card>

  <docs-card title="اشکال‌زدایی Signal در Angular DevTools" link="تکمیل‌شده در ۲۰۲۶">
  ابزارهای بهتری برای اشکال‌زدایی Signalها با Angular DevTools اضافه کرده‌ایم؛ از جمله UI جدیدی برای بررسی و اشکال‌زدایی Signalها.
  </docs-card>

  <docs-card title="بهبود HMR (Hot Module Reload)" href="https://github.com/angular/angular/issues/39367#issuecomment-1439537306" link="تکمیل‌شده در ۲۰۲۵">
  برای چرخه سریع‌تر ویرایش و refresh، جایگزینی داغ module را فعال کردیم. Angular v19 پشتیبانی اولیه HMR برای CSS و template را ارائه داد و در v20، ‏template HMR پایدار شد. برای اطمینان از برآورده شدن نیاز توسعه‌دهندگان پیش از تکمیل پروژه، جمع‌آوری بازخورد را ادامه می‌دهیم.
</docs-card>

<docs-card title="انگولار بدون Zone" link="تکمیل‌شده در سه‌ماهه چهارم ۲۰۲۵">
در v18 پشتیبانی آزمایشی حالت بدون Zone را منتشر کردیم که اجازه می‌دهد بدون قرار دادن zone.js در bundle از فریم‌ورک استفاده کنید و performance، تجربه اشکال‌زدایی و interoperability را بهبود می‌دهد. در انتشار اولیه، پشتیبانی بدون Zone را به Angular CDK و Angular Material نیز افزودیم.

در v19 پشتیبانی بدون Zone را در server-side rendering معرفی، edge caseها را اصلاح و شماتیکی برای scaffold کردن پروژه‌های بدون Zone ایجاد کردیم. <a href="https://fonts.google.com/" target="_blank">Google Fonts</a> را به حالت بدون Zone منتقل کردیم که performance و تجربه توسعه‌دهنده را بهبود داد و gapهای لازم پیش از developer preview را مشخص کرد.

از Angular v20.2، انگولار بدون Zone پایدار است و بهبودهایی در مدیریت خطا و server-side rendering دارد.
</docs-card>

<docs-card title="پیکربندی route سمت server" link="تکمیل‌شده در سه‌ماهه دوم ۲۰۲۵">
برای پیکربندی ساده‌تر route در server کار کردیم تا declaration کردن routeهای server-side render، ‏prerender یا client-side render آسان باشد.

در Angular v19، حالت render در سطح route را به‌صورت developer preview ارائه کردیم تا نوع render هر route را دقیق تنظیم کنید و در v20 آن را پایدار کردیم.
</docs-card>
<docs-card title="فعال کردن hydration افزایشی" link="تکمیل‌شده در سه‌ماهه دوم ۲۰۲۵">
در v17، ‏hydration را از developer preview خارج کردیم و پیوسته بهبود ۴۰ تا ۵۰ درصدی LCP مشاهده شد. سپس نمونه‌سازی hydration افزایشی را آغاز و demoای در ng-conf ارائه کردیم.

در v19، ‏hydration افزایشی مبتنی بر بلوک‌های `@defer` را در developer preview و در Angular v20 به‌صورت پایدار منتشر کردیم.
</docs-card>
<docs-card title="ارائه Signalهای انگولار" link="تکمیل‌شده در سه‌ماهه دوم ۲۰۲۵" href="https://github.com/angular/angular/discussions/49685">
این پروژه با معرفی Signal به‌عنوان primitive مربوط به reactivity، مدل reactivity انگولار را بازطراحی کرد. برنامه‌ریزی اولیه به صدها بحث، گفت‌وگو با توسعه‌دهندگان، جلسه بازخورد، مطالعه تجربه کاربری و مجموعه‌ای RFC با بیش از هزار comment منجر شد.

در Angular v20 همه primitiveهای اصلی reactivity، شامل signal، ‏effect، ‏linkedSignal، ‏queryهای مبتنی بر Signal و inputها پایدار شدند.
</docs-card>
<docs-card title="پشتیبانی drag-and-drop دوبعدی" link="تکمیل‌شده در سه‌ماهه دوم ۲۰۲۴" href="https://github.com/angular/components/issues/13372">
در این پروژه پشتیبانی جهت ترکیبی را برای drag-and-drop در Angular CDK پیاده‌سازی کردیم؛ یکی از پرتقاضاترین قابلیت‌های repository.
</docs-card>
<docs-card title="بازپخش event با SSR و prerendering" link="تکمیل‌شده در سه‌ماهه چهارم ۲۰۲۴" href="api/platform-browser/withEventReplay">
در v18 قابلیت بازپخش event را هنگام server-side rendering یا prerendering معرفی کردیم. این قابلیت به primitive مربوط به event dispatch که پیش‌تر jsaction نام داشت و در Google.com اجرا می‌شود وابسته است.

در Angular v19 بازپخش event را پایدار و برای همه پروژه‌های جدید پیش‌فرض کردیم.
</docs-card>
<docs-card title="یکپارچه‌سازی Angular Language Service با شماتیک‌ها" link="تکمیل‌شده در سه‌ماهه چهارم ۲۰۲۴">
برای ساده‌تر شدن استفاده از APIهای مدرن انگولار، یکپارچه‌سازی language service انگولار و شماتیک‌ها را فعال کردیم تا application را با یک click refactor کنید.
</docs-card>
<docs-card title="ساده‌سازی importهای standalone با Language Service" link="تکمیل‌شده در سه‌ماهه چهارم ۲۰۲۴">
language service در این پروژه componentها و pipeها را در applicationهای standalone و مبتنی بر NgModule خودکار import می‌کند. همچنین عیب‌یابی template برای مشخص کردن importهای استفاده‌نشده componentهای standalone افزودیم تا bundleها کوچک‌تر شوند.
</docs-card>
<docs-card title="متغیرهای محلی template" link="تکمیل‌شده در سه‌ماهه سوم ۲۰۲۴">
پشتیبانی از متغیرهای محلی template را منتشر کردیم؛ برای اطلاعات بیشتر [مستندات `@let`](/api/core/@let) را ببینید.
</docs-card>
<docs-card title="گسترش قابلیت سفارشی‌سازی Angular Material" link="تکمیل‌شده در سه‌ماهه دوم ۲۰۲۴" href="https://material.angular.dev/guide/theming">
برای سفارشی‌سازی بهتر componentهای Angular Material و فعال کردن قابلیت‌های Material 3، با تیم Material Design گوگل در تعریف APIهای theme مبتنی بر token همکاری کردیم.

در v17.2 پشتیبانی آزمایشی Angular Material 3 و در v18 نسخه پایدار آن را ارائه کردیم.
</docs-card>
<docs-card title="معرفی بارگذاری deferred" link="تکمیل‌شده در سه‌ماهه دوم ۲۰۲۴" href="https://next.angular.dev/guide/templates/defer">
در v17، ‏deferrable viewها را در developer preview منتشر کردیم که API ساده‌ای برای بارگذاری deferred کد فراهم می‌کنند. در v18 این قابلیت را برای توسعه‌دهندگان کتابخانه فعال و API را پایدار کردیم.
</docs-card>
<docs-card title="پشتیبانی iframe در Angular DevTools" link="تکمیل‌شده در سه‌ماهه دوم ۲۰۲۴">
اشکال‌زدایی و profiling مربوط به applicationهای انگولار embedشده در iframe صفحه را فعال کردیم.
</docs-card>
<docs-card title="خودکارسازی انتقال پروژه‌های hybrid rendering به esbuild و vite" link="تکمیل‌شده در سه‌ماهه دوم ۲۰۲۴" href="tools/cli/build-system-migration">
در v17 یک application builder مبتنی بر vite و esbuild منتشر و آن را برای پروژه‌های جدید پیش‌فرض کردیم که زمان build پروژه‌های hybrid rendering را تا ۸۷ درصد بهتر می‌کند. در v18 شماتیک‌ها و راهنمای migration پروژه‌های موجود به pipeline جدید را منتشر کردیم.
</docs-card>
<docs-card title="تبدیل Angular.dev به خانه رسمی توسعه‌دهندگان انگولار" link="تکمیل‌شده در سه‌ماهه دوم ۲۰۲۴" href="https://goo.gle/angular-dot-dev">
Angular.dev سایت، domain و خانه جدید توسعه انگولار است و مستندات، tutorialها و راهنمای به‌روز برای ساخت با جدیدترین قابلیت‌های انگولار دارد.
</docs-card>
<docs-card title="معرفی control flow داخلی" link="تکمیل‌شده در سه‌ماهه دوم ۲۰۲۴" href="guide/templates/control-flow">
در v17 نسخه developer preview از control flow جدیدی منتشر کردیم که performance و تجربه نگارش template را بهبود می‌دهد. migration مربوط به `*ngIf`، ‏`*ngFor` و `*ngSwitch` موجود را نیز ارائه کردیم. از v18، ‏control flow داخلی پایدار است.
</docs-card>
<docs-card title="مدرن‌سازی tutorial شروع کار" link="تکمیل‌شده در سه‌ماهه چهارم ۲۰۲۳">
در دو سه‌ماهه، tutorial جدید [ویدئویی](https://www.youtube.com/watch?v=xAT0lHYhHMY&list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF) و [متنی](/tutorials/learn-angular) مبتنی بر componentهای standalone ساختیم.
</docs-card>
<docs-card title="بررسی bundlerهای مدرن" link="تکمیل‌شده در سه‌ماهه چهارم ۲۰۲۳" href="guide/hydration">
در Angular v16 یک builder مبتنی بر esbuild با پشتیبانی `ng build` و `ng serve` در developer preview منتشر کردیم. dev server مربوط به `ng serve` از Vite و کامپایل چندفایلی توسط esbuild و کامپایلر انگولار استفاده می‌کند. در v17 ابزار build را پایدار و برای پروژه‌های جدید پیش‌فرض کردیم.
</docs-card>
<docs-card title="معرفی APIهای اشکال‌زدایی dependency injection" link="تکمیل‌شده در سه‌ماهه چهارم ۲۰۲۳" href="tools/devtools">
برای بهبود ابزارهای اشکال‌زدایی انگولار و Angular DevTools روی APIهایی کار کردیم که به runtime مربوط به dependency injection دسترسی می‌دهند. متدهای اشکال‌زدایی برای بررسی سلسله‌مراتب injector و dependencyهای providerها ارائه شدند. از v17 قابلیت اتصال به lifecycle مربوط به dependency injection، نمایش tree مربوط به injector و بررسی providerهای هر node را منتشر کردیم.
</docs-card>
<docs-card title="بهبود مستندات و شماتیک‌های componentهای standalone" link="تکمیل‌شده در سه‌ماهه چهارم ۲۰۲۳" href="essentials/components">
مجموعه شماتیک `ng new --standalone` را در developer preview منتشر کردیم تا applicationهای بدون NgModule بسازید. در v17 format نگارش application جدید را به APIهای standalone تغییر دادیم و مستندات را به‌روز کردیم. شماتیک migration applicationهای موجود به component، ‏directive و pipeهای standalone نیز ارائه شد. NgModuleها در آینده قابل پیش‌بینی باقی می‌مانند، اما بررسی مزایای APIهای جدید را توصیه می‌کنیم.
</docs-card>
<docs-card title="بررسی بهبود hydration و server-side rendering" link="تکمیل‌شده در سه‌ماهه چهارم ۲۰۲۳">
در v16 نسخه developer preview از full hydration غیرمخرب منتشر کردیم؛ [راهنمای hydration](guide/hydration) و [مطلب وبلاگ](https://blog.angular.dev/whats-next-for-server-side-rendering-in-angular-2a6f27662b67) را ببینید. بهبود قابل توجه Core Web Vitals شامل [LCP](https://web.dev/lcp) و [CLS](https://web.dev/cls) مشاهده شد و در test آزمایشگاهی LCP یک application واقعی پیوسته ۴۵ درصد بهتر بود.

در v17، ‏hydration را پایدار و server-side rendering را با کشف route هنگام runtime برای SSG، زمان build تا ۸۷ درصد سریع‌تر برای applicationهای hybrid render و prompt فعال‌کننده hybrid rendering در پروژه‌های جدید بهبود دادیم.
</docs-card>
<docs-card title="Full app hydration غیرمخرب" link="تکمیل‌شده در سه‌ماهه اول ۲۰۲۳" href="guide/hydration">
در v16 نسخه developer preview از full hydration غیرمخرب منتشر کردیم که به انگولار اجازه می‌دهد به‌جای ایجاد مجدد application، ‏nodeهای DOM موجود صفحه server-side renderشده را استفاده کند. راهنمای hydration را ببینید.
</docs-card>
<docs-card title="بهبودهای directive تصویر" link="تکمیل‌شده در سه‌ماهه اول ۲۰۲۳" href="guide/image-optimization">
directive تصویر انگولار را در v15 پایدار کردیم. قابلیت fill mode جدیدی افزودیم تا تصویر به‌جای dimension صریح، در container والد جا شود. تیم Chrome Aurora این directive را به v12 و جدیدتر backport کرد.
</docs-card>
<docs-card title="بازآرایی مستندات" link="تکمیل‌شده در سه‌ماهه اول ۲۰۲۳" href="https://angular.io">
همه مستندات موجود را با مجموعه یکسانی از انواع محتوا هماهنگ کردیم و محتوای tutorialمحور بیش از حد را به topicهای مستقل تبدیل کردیم. هدف این بود که محتوای خارج از tutorialهای اصلی بدون وابستگی شدید به مجموعه راهنماها خودکفا باشد. در سه‌ماهه دوم ۲۰۲۲ محتوای template و dependency injection و در سه‌ماهه اول ۲۰۲۳ راهنماهای HTTP بازآرایی شدند.
</docs-card>
<docs-card title="بهبود performance تصویر" link="تکمیل‌شده در سه‌ماهه چهارم ۲۰۲۲" href="guide/image-optimization">
تیم‌های Aurora و انگولار directive تصویری برای بهبود Core Web Vitals پیاده‌سازی کردند و نسخه پایدار آن در v15 منتشر شد.
</docs-card>
<docs-card title="CSS مدرن" link="تکمیل‌شده در سه‌ماهه چهارم ۲۰۲۲" href="https://blog.angular.dev/modern-css-in-angular-layouts-4a259dca9127">
ecosystem وب پیوسته تکامل می‌یابد و می‌خواهیم استانداردهای مدرن را در انگولار منعکس کنیم. راهنمای استفاده از قابلیت‌های جدید CSS برای رعایت best practiceهای layout و styling ارائه و انتشار flex layout متوقف شد.
</docs-card>
<docs-card title="پشتیبانی افزودن directive به host elementها" link="تکمیل‌شده در سه‌ماهه چهارم ۲۰۲۲" href="guide/directives/directive-composition-api">
درخواست قدیمی افزودن directive به host elementها به توسعه‌دهنده اجازه می‌دهد بدون inheritance رفتار بیشتری به component خود بیفزاید. API مربوط به directive composition در v15 منتشر شد.
</docs-card>
<docs-card title="stack traceهای بهتر" link="تکمیل‌شده در سه‌ماهه چهارم ۲۰۲۲" href="https://developer.chrome.com/blog/devtools-better-angular-debugging/">
انگولار و Chrome DevTools برای stack traceهای خواناتر در پیام خطا همکاری کردند. در v15، ‏stack traceهای مرتبط و لینک‌شده بهتر منتشر شدند و بررسی نام دقیق‌تر call frame برای templateها ادامه دارد.
</docs-card>
<docs-card title="بهبود componentهای Angular Material با MDC Web" link="تکمیل‌شده در سه‌ماهه چهارم ۲۰۲۲" href="https://material.angular.dev/guide/mdc-migration">
MDC Web کتابخانه‌ای از تیم Google Material Design است که primitiveهای قابل استفاده مجدد برای ساخت componentهای Material Design فراهم می‌کند. ادغام این primitiveها، ‏Angular Material را با specification مربوط به Material Design هماهنگ‌تر، دسترس‌پذیری و کیفیت component را بهتر و سرعت تیم را بیشتر کرد.
</docs-card>
<docs-card title="پیاده‌سازی API برای NgModuleهای اختیاری" link="تکمیل‌شده در سه‌ماهه چهارم ۲۰۲۲" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
برای ساده‌تر شدن انگولار APIهایی معرفی کردیم که initialization مربوط به application، ایجاد component و استفاده از router را بدون NgModule ممکن می‌کنند. Angular v14 نسخه developer preview از APIهای component، ‏directive و pipeهای standalone را ارائه داد و پس از جمع‌آوری بازخورد، آن‌ها پایدار شدند.
</docs-card>
<docs-card title="اجازه binding به fieldهای protected در template" link="تکمیل‌شده در سه‌ماهه دوم ۲۰۲۲" href="guide/templates/binding">
برای encapsulation بهتر componentهای انگولار، binding به memberهای protected نمونه component را فعال کردیم تا برای استفاده در template مجبور نباشید field یا متد را public کنید.
</docs-card>
<docs-card title="انتشار راهنماهای مفاهیم پیشرفته" link="تکمیل‌شده در سه‌ماهه دوم ۲۰۲۲" href="https://angular.io/guide/change-detection">
راهنمای عمیق change detection و محتوای profiling مربوط به performance applicationهای انگولار منتشر شد؛ شامل تعامل change detection با Zone.js، زمان trigger شدن، profiling مدت آن و روش‌های رایج بهینه‌سازی performance.
</docs-card>
<docs-card title="ارائه type سخت‌گیرانه برای @angular/forms" link="تکمیل‌شده در سه‌ماهه دوم ۲۰۲۲" href="guide/forms/typed-forms">
در سه‌ماهه چهارم ۲۰۲۱ راه‌حل type سخت‌گیرانه formها طراحی و در سه‌ماهه اول ۲۰۲۲ درخواست comment نهایی شد. راهبرد rollout همراه migration خودکار ابتدا روی بیش از ۲۵۰۰ پروژه Google آزمایش شد تا مسیر migration جامعه خارجی روان باشد.
</docs-card>
<docs-card title="حذف View Engine قدیمی" link="تکمیل‌شده در سه‌ماهه اول ۲۰۲۲" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
پس از انتقال همه ابزارهای داخلی به Ivy، ‏View Engine قدیمی برای کاهش سربار مفهومی انگولار، اندازه package، هزینه نگهداری و پیچیدگی codebase حذف شد.
</docs-card>
<docs-card title="مدل ذهنی ساده‌تر انگولار با NgModuleهای اختیاری" link="تکمیل‌شده در سه‌ماهه اول ۲۰۲۲" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
برای ساده‌تر کردن مدل ذهنی و مسیر یادگیری انگولار، NgModuleها اختیاری شدند تا توسعه‌دهندگان componentهای standalone بسازند و از API جایگزین برای declaration کردن scope کامپایل component استفاده کنند.
</docs-card>
<docs-card title="طراحی type سخت‌گیرانه برای @angular/forms" link="تکمیل‌شده در سه‌ماهه اول ۲۰۲۲" href="guide/forms/typed-forms">
راهی برای بررسی نوع سخت‌گیرانه‌تر reactive formها با حداقل پیامد ناسازگار طراحی شد تا مشکل‌های بیشتری هنگام توسعه شناسایی، پشتیبانی editor و IDE بهتر و type checking مربوط به reactive formها تقویت شود.
</docs-card>
<docs-card title="بهبود یکپارچه‌سازی Angular DevTools با فریم‌ورک" link="تکمیل‌شده در سه‌ماهه اول ۲۰۲۲" href="tools/devtools">
برای یکپارچه‌سازی بهتر Angular DevTools با فریم‌ورک، codebase به monorepository به نام angular/angular منتقل شد؛ شامل انتقال Angular DevTools به Bazel و ادغام در فرایندها و pipeline مربوط به CI.
</docs-card>
<docs-card title="راه‌اندازی عیب‌یابی پیشرفته کامپایلر" link="تکمیل‌شده در سه‌ماهه اول ۲۰۲۲" href="extended-diagnostics">
عیب‌یابی کامپایلر انگولار فراتر از type checking گسترش یافت و بررسی‌های درستی و conformance برای تضمین best practiceها اضافه شدند.
</docs-card>
<docs-card title="به‌روزرسانی راهبرد e2e testing" link="تکمیل‌شده در سه‌ماهه سوم ۲۰۲۱" href="guide/testing">
برای راهبرد آینده‌نگر e2e، وضعیت Protractor، نوآوری جامعه و best practiceها ارزیابی شد. RFC منتشر و با partnerها برای یکپارچه‌سازی روان Angular CLI و ابزارهای مدرن e2e همکاری شد.
</docs-card>
<docs-card title="استفاده کتابخانه‌های انگولار از Ivy" link="تکمیل‌شده در سه‌ماهه سوم ۲۰۲۱" href="tools/libraries">
پس از RFC توزیع کتابخانه Ivy و بازخورد جامعه، format مربوط به package کتابخانه برای کامپایل Ivy توسعه یافت و مسیر منسوخ کردن format مربوط به View Engine و ngcc باز شد.
</docs-card>
<docs-card title="بهبود زمان test و اشکال‌زدایی با پاک‌سازی خودکار محیط" link="تکمیل‌شده در سه‌ماهه سوم ۲۰۲۱" href="guide/testing">
برای کاهش زمان test و isolation بهتر، ‏TestBed طوری تغییر کرد که پس از هر اجرای test محیط را خودکار پاک و teardown کند.
</docs-card>
<docs-card title="منسوخ و حذف کردن پشتیبانی IE11" link="تکمیل‌شده در سه‌ماهه سوم ۲۰۲۱" href="https://github.com/angular/angular/issues/41840">
Internet Explorer 11 مانع استفاده انگولار از قابلیت‌های مدرن وب بود. پس از RFC و دریافت بازخورد جامعه، پشتیبانی آن حذف شد تا مسیر قابلیت‌های مرورگرهای evergreen باز شود.
</docs-card>
<docs-card title="استفاده از ES2017+ به‌عنوان زبان خروجی پیش‌فرض" link="تکمیل‌شده در سه‌ماهه سوم ۲۰۲۱" href="https://www.typescriptlang.org/docs/handbook/tsconfig-json.html">
پشتیبانی مرورگرهای مدرن امکان استفاده از syntax جدید، فشرده‌تر، گویاتر و سریع‌تر JavaScript را فراهم کرد و موانع این انتقال برطرف شدند.
</docs-card>
<docs-card title="اشکال‌زدایی و profiling سریع‌تر با Angular DevTools" link="تکمیل‌شده در سه‌ماهه دوم ۲۰۲۱" href="tools/devtools">
ابزارهای توسعه انگولار برای اشکال‌زدایی و profiling مربوط به performance ارائه شدند تا توسعه‌دهندگان ساختار component و change detection را در application درک کنند.
</docs-card>
<docs-card title="ساده‌سازی انتشارها با نسخه‌بندی و branch یکپارچه" link="تکمیل‌شده در سه‌ماهه دوم ۲۰۲۱" href="reference/releases">
ابزار مدیریت release میان repositoryهای angular/angular، ‏angular/angular-cli و angular/components یکپارچه شد تا زیرساخت reuse، فرایندها ساده و قابلیت اطمینان release بهتر شود.
</docs-card>
<docs-card title="یکنواختی بیشتر با استانداردسازی پیام commit" link="تکمیل‌شده در سه‌ماهه دوم ۲۰۲۱" href="https://github.com/angular/angular">
الزامات و conformance پیام commit میان repositoryهای انگولار یکسان شد تا فرایند توسعه هماهنگ و زیرساخت ابزار reuse شود.
</docs-card>
<docs-card title="انتقال Angular language service به Ivy" link="تکمیل‌شده در سه‌ماهه دوم ۲۰۲۱" href="tools/language-service">
برای بهبود تجربه و حذف dependency قدیمی، language service به Ivy منتقل شد. parser مربوط به template و type checking بهتر Ivy با رفتار application هماهنگ شد و مسیر حذف View Engine، کاهش اندازه package و نگهداری بهتر فریم‌ورک باز شد.
</docs-card>
<docs-card title="امنیت بیشتر با Trusted Types بومی" link="تکمیل‌شده در سه‌ماهه دوم ۲۰۲۱" href="best-practices/security">
با همکاری تیم امنیت Google از API جدید Trusted Types پشتیبانی کردیم تا توسعه‌دهندگان applicationهای وب امن‌تری بسازند.
</docs-card>
<docs-card title="بهینه‌سازی سرعت build و اندازه bundle با webpack 5" link="تکمیل‌شده در سه‌ماهه دوم ۲۰۲۱" href="tools/cli/build">
در release شماره v11 پیش‌نمایش اختیاری webpack 5 را در Angular CLI معرفی و برای پایداری و بهبود سرعت build و اندازه bundle توسعه دادیم.
</docs-card>
<docs-card title="application سریع‌تر با inline کردن styleهای حیاتی" link="تکمیل‌شده در سه‌ماهه اول ۲۰۲۱" href="guide/ssr">
بارگذاری stylesheet خارجی render را مسدود می‌کند و بر first contentful paint اثر دارد. با تیم Google Chrome برای inline کردن CSS حیاتی و بارگذاری asynchronous سایر styleها همکاری کردیم.
</docs-card>
<docs-card title="بهبود اشکال‌زدایی با پیام خطای بهتر" link="تکمیل‌شده در سه‌ماهه اول ۲۰۲۱" href="errors">
برای کاربردی‌تر شدن پیام‌های خطا، codeهای مرتبط، راهنما و مطالب دیگر اضافه شد تا تجربه اشکال‌زدایی روان‌تر باشد.
</docs-card>
<docs-card title="شروع بهتر توسعه‌دهنده با مستندات مقدماتی تازه" link="تکمیل‌شده در سه‌ماهه اول ۲۰۲۱" href="tutorials">
مسیر یادگیری کاربر و مستندات مقدماتی بازتعریف شد تا مزایای انگولار، روش بررسی قابلیت‌ها و راهنمای تسلط سریع بر فریم‌ورک روشن باشد.
</docs-card>
<docs-card title="گسترش best practiceهای component harness" link="تکمیل‌شده در سه‌ماهه اول ۲۰۲۱" href="https://material.angular.dev/guide/using-component-harnesses">
Angular CDK در نسخه 9 مفهوم component test harness را معرفی کرد تا نویسندگان component برای test تعاملات API پشتیبانی‌شده ارائه کنند. زیرساخت harness و best practiceهای آن بهبود یافت و استفاده داخلی در Google گسترش پیدا کرد.
</docs-card>
<docs-card title="نگارش راهنمای content projection" link="تکمیل‌شده در سه‌ماهه دوم ۲۰۲۱" href="https://angular.io/docs">
برای مفهوم اصلی content projection، use caseها و مفاهیم پایه شناسایی و مستند شدند.
</docs-card>
<docs-card title="migration به ESLint" link="تکمیل‌شده در سه‌ماهه چهارم ۲۰۲۰" href="tools/cli">
پس از منسوخ شدن TSLint به ESLint منتقل شدیم؛ همراه با backward compatibility پیکربندی پیشنهادی TSLint، راهبرد migration applicationهای موجود و ابزار جدید در toolchain مربوط به Angular CLI.
</docs-card>
<docs-card title="عملیات خداحافظی با backlog (Operation Byelog)" link="تکمیل‌شده در سه‌ماهه چهارم ۲۰۲۰" href="https://github.com/angular/angular/issues">
تا ۵۰ درصد ظرفیت مهندسی برای triage کردن issueها و PRها و درک نیازهای گسترده جامعه سرمایه‌گذاری شد؛ سپس تا ۲۰ درصد ظرفیت برای رسیدگی سریع به submissionهای جدید اختصاص یافت.
</docs-card>
</docs-card-container>
