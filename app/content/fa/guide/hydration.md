# Hydration

## Hydration چیست؟

Hydration فرایندی است که applicationای را که server-side rendered شده روی client restore می‌کند. این شامل کارهایی مثل reuse کردن ساختارهای DOM که روی server render شده‌اند، حفظ application state، منتقل کردن application dataای که قبلا توسط server دریافت شده، و فرایندهای دیگر است.

## چرا hydration مهم است؟

Hydration با جلوگیری از کار اضافه برای ساخت دوباره‌ی DOM nodeها، performance برنامه را بهتر می‌کند. به‌جای این کار، Angular تلاش می‌کند DOM elementهای موجود را در runtime با ساختار application match کند و هر جا ممکن است DOM nodeها را reuse کند. نتیجه‌ی این کار بهبود performance است که می‌توان آن را با آمارهای [Core Web Vitals (CWV)](https://web.dev/learn-core-web-vitals/) اندازه‌گیری کرد؛ مثل کاهش First Input Delay یا [FID](https://web.dev/fid/)، Largest Contentful Paint یا [LCP](https://web.dev/lcp/) و همچنین Cumulative Layout Shift یا [CLS](https://web.dev/cls/). بهتر شدن این عددها روی مواردی مثل SEO performance هم اثر می‌گذارد.

بدون فعال بودن hydration، applicationهای Angular که server-side rendered شده‌اند DOM برنامه را destroy و دوباره render می‌کنند، که ممکن است باعث flicker قابل مشاهده در UI شود. این re-rendering می‌تواند روی [Core Web Vitals](https://web.dev/learn-core-web-vitals/) مثل [LCP](https://web.dev/lcp/) اثر منفی بگذارد و layout shift ایجاد کند. فعال کردن hydration اجازه می‌دهد DOM موجود reuse شود و از flicker جلوگیری می‌کند.

## چطور hydration را در Angular فعال کنیم؟

Hydration فقط برای applicationهای server-side rendered یا SSR قابل فعال شدن است. ابتدا [Angular SSR Guide](guide/ssr) را دنبال کنید تا server-side rendering را فعال کنید.

### استفاده از Angular CLI

اگر از Angular CLI برای فعال کردن SSR استفاده کرده‌اید، چه هنگام ساخت application و چه بعدا با `ng add @angular/ssr`، code مربوط به فعال کردن hydration باید از قبل داخل application شما قرار گرفته باشد.

### Setup دستی

اگر setup سفارشی دارید و برای فعال کردن SSR از Angular CLI استفاده نکرده‌اید، می‌توانید hydration را به‌صورت دستی فعال کنید؛ به main application component یا module بروید و `provideClientHydration` را از `@angular/platform-browser` import کنید. سپس آن provider را به فهرست bootstrapping providers برنامه اضافه کنید.

```typescript
import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
...

bootstrapApplication(App, {
  providers: [provideClientHydration()]
});
```

به‌عنوان جایگزین، اگر از NgModuleها استفاده می‌کنید، `provideClientHydration` را به provider list مربوط به root app module اضافه می‌کنید.

```typescript
import {provideClientHydration} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

@NgModule({
  declarations: [App],
  exports: [App],
  bootstrap: [App],
  providers: [provideClientHydration()],
})
export class AppModule {}
```

IMPORTANT: مطمئن شوید فراخوانی `provideClientHydration()` همچنین در مجموعه providerهایی قرار دارد که برای bootstrap کردن application روی **server** استفاده می‌شود. در applicationهایی با ساختار پیش‌فرض پروژه، که با command مربوط به `ng new` تولید شده‌اند، اضافه کردن این فراخوانی به root `AppModule` باید کافی باشد، چون این module توسط server module import می‌شود. اگر setup سفارشی دارید، فراخوانی `provideClientHydration()` را به فهرست providers در server bootstrap configuration اضافه کنید.

### بررسی فعال بودن hydration

بعد از پیکربندی hydration و بالا آوردن server، application خود را در browser load کنید.

HELPFUL: احتمالا باید قبل از اینکه hydration کامل کار کند، instanceهای Direct DOM Manipulation را اصلاح کنید؛ یا با تغییر آن‌ها به constructهای Angular، یا با استفاده از `ngSkipHydration`. برای جزئیات بیشتر، [Constraints](#constraints)، [Direct DOM Manipulation](#direct-dom-manipulation) و [How to skip hydration for particular components](#how-to-skip-hydration-for-particular-components) را ببینید.

هنگام اجرای application در dev mode، می‌توانید با باز کردن Developer Tools در browser و مشاهده‌ی console تایید کنید hydration فعال است. باید پیامی ببینید که شامل statهای مرتبط با hydration است، مثل تعداد componentها و nodeهایی که hydrated شده‌اند. Angular statها را بر اساس همه‌ی componentهای renderشده روی صفحه محاسبه می‌کند، شامل componentهایی که از libraryهای third-party می‌آیند.

همچنین می‌توانید از [Angular DevTools browser extension](tools/devtools) استفاده کنید تا hydration status componentهای صفحه را ببینید. Angular DevTools همچنین اجازه می‌دهد overlayای فعال کنید که نشان می‌دهد کدام بخش‌های صفحه hydrated شده‌اند. اگر hydration mismatch error وجود داشته باشد، DevTools componentی را که باعث error شده highlight می‌کند.

## Capture و replay کردن eventها

وقتی application روی server render می‌شود، به محض load شدن HTML تولیدشده در browser قابل مشاهده است. کاربران ممکن است فرض کنند می‌توانند با صفحه تعامل کنند، اما event listenerها تا کامل شدن hydration attach نشده‌اند. از v18 به بعد، می‌توانید feature مربوط به Event Replay را فعال کنید؛ featureای که اجازه می‌دهد همه‌ی eventهایی که قبل از hydration رخ می‌دهند capture شوند و بعد از کامل شدن hydration replay شوند. می‌توانید آن را با function مربوط به `withEventReplay()` فعال کنید، مثلا:

```typescript
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [provideClientHydration(withEventReplay())],
});
```

### Event replay چطور کار می‌کند؟

Event Replay featureای است که با capture کردن eventهای کاربر که قبل از کامل شدن hydration process trigger شده‌اند، تجربه‌ی کاربر را بهتر می‌کند. سپس آن eventها replay می‌شوند تا هیچ تعاملی از دست نرود.

Event Replay به سه phase اصلی تقسیم می‌شود:

- **Capturing user interactions**<br>
  قبل از **Hydration**، Event Replay همه‌ی تعامل‌هایی را که کاربر ممکن است انجام دهد، مثل clickها و eventهای native دیگر browser، capture و ذخیره می‌کند.

- **Storing events**<br>
  **Event Contract** همه‌ی تعامل‌های ثبت‌شده در step قبلی را در memory نگه می‌دارد و مطمئن می‌شود برای replay بعدی از دست نمی‌روند.

- **Relaunch of events**<br>
  وقتی **Hydration** کامل شد، Angular eventهای captureشده را دوباره invoke می‌کند.

Event replay از _native browser events_ پشتیبانی می‌کند، مثلا `click`، `mouseover` و `focusin`. اگر می‌خواهید درباره‌ی JSAction، libraryای که event replay را power می‌کند، بیشتر بدانید، می‌توانید [readme](https://github.com/angular/angular/tree/main/packages/core/primitives/event-dispatch#readme) را بخوانید.

این feature تجربه‌ی کاربر را consistent نگه می‌دارد و مانع می‌شود actionهایی که کاربر قبل از hydration انجام داده نادیده گرفته شوند.

NOTE: اگر [incremental hydration](guide/incremental-hydration) را فعال کرده باشید، event replay به‌صورت خودکار در پشت صحنه فعال می‌شود.

## Constraints

Hydration چند constraint به application شما تحمیل می‌کند که بدون فعال بودن hydration وجود ندارند. application شما باید روی server و client ساختار DOM تولیدشده‌ی یکسانی داشته باشد. فرایند hydration انتظار دارد DOM tree در هر دو جا ساختار یکسانی داشته باشد. این شامل whitespaceها و comment nodeهایی هم می‌شود که Angular هنگام rendering روی server تولید می‌کند. آن whitespaceها و nodeها باید در HTML تولیدشده توسط فرایند server-side rendering وجود داشته باشند.

IMPORTANT: HTML تولیدشده توسط عملیات server side rendering **نباید** بین server و client تغییر کند.

اگر بین ساختارهای DOM tree در server و client mismatch وجود داشته باشد، hydration process هنگام تلاش برای match کردن چیزی که انتظار داشته با چیزی که واقعا در DOM وجود دارد با مشکل روبه‌رو می‌شود. componentهایی که با native DOM APIها دستکاری مستقیم DOM انجام می‌دهند رایج‌ترین علت هستند.

### Direct DOM Manipulation

اگر componentهایی دارید که DOM را با native DOM APIها manipulate می‌کنند یا از `innerHTML` یا `outerHTML` استفاده می‌کنند، hydration process با error روبه‌رو می‌شود. موارد مشخصی که DOM manipulation مشکل ایجاد می‌کند شامل دسترسی به `document`، query کردن elementهای مشخص و inject کردن nodeهای اضافی با `appendChild` است. جدا کردن DOM nodeها و جابه‌جا کردنشان به مکان‌های دیگر هم error ایجاد می‌کند.

دلیلش این است که Angular از این تغییرات DOM آگاه نیست و نمی‌تواند آن‌ها را هنگام hydration resolve کند. Angular انتظار ساختار مشخصی را دارد، اما هنگام تلاش برای hydrate کردن با ساختار متفاوتی روبه‌رو می‌شود. این mismatch باعث شکست hydration و throw شدن DOM mismatch error می‌شود، [پایین را ببینید](#errors).

بهتر است component خود را refactor کنید تا از این نوع DOM manipulation دوری کند. اگر می‌توانید، برای انجام این کار از Angular APIها استفاده کنید. اگر نمی‌توانید این رفتار را refactor کنید، تا زمانی که بتوانید آن را به راه‌حلی سازگار با hydration تبدیل کنید، از attribute مربوط به `ngSkipHydration` استفاده کنید؛ [در پایین توضیح داده شده](#how-to-skip-hydration-for-particular-components).

### ساختار HTML معتبر

چند حالت وجود دارد که اگر component template شما ساختار HTML معتبر نداشته باشد، ممکن است هنگام hydration به DOM mismatch error منجر شود.

به‌عنوان مثال، چند مورد از رایج‌ترین حالت‌های این مشکل:

- `<table>` بدون `<tbody>`
- `<div>` داخل `<p>`
- `<a>` داخل یک `<a>` دیگر

اگر مطمئن نیستید HTML شما معتبر است یا نه، می‌توانید از یک [syntax validator](https://validator.w3.org/) برای بررسی آن استفاده کنید.

NOTE: با اینکه HTML standard وجود element مربوط به `<tbody>` داخل tableها را الزامی نمی‌داند، browserهای مدرن به‌صورت خودکار برای tableهایی که `<tbody>` declare نکرده‌اند یک `<tbody>` می‌سازند. به دلیل این ناسازگاری، همیشه داخل tableها به‌صورت explicit یک `<tbody>` declare کنید تا از hydration error جلوگیری شود.

### Preserve Whitespaces Configuration

هنگام استفاده از feature مربوط به hydration، پیشنهاد می‌کنیم از تنظیم پیش‌فرض `false` برای `preserveWhitespaces` استفاده کنید. اگر این setting در tsconfig شما نیست، مقدار آن `false` خواهد بود و نیازی به تغییر نیست. اگر با اضافه کردن `preserveWhitespaces: true` به tsconfig، حفظ whitespaceها را فعال کنید، ممکن است با hydration به مشکل بخورید. این configuration هنوز کاملا پشتیبانی‌شده نیست.

HELPFUL: مطمئن شوید این setting در `tsconfig.server.json` برای server و `tsconfig.app.json` برای browser buildهای شما **به‌صورت consistent** تنظیم شده است. مقدار mismatch باعث خراب شدن hydration می‌شود.

اگر تصمیم دارید این setting را در tsconfig تنظیم کنید، پیشنهاد می‌کنیم آن را فقط در `tsconfig.app.json` تنظیم کنید؛ چون به‌صورت پیش‌فرض `tsconfig.server.json` آن را از همان‌جا inherit می‌کند.

### Custom یا Noop Zone.js هنوز پشتیبانی نمی‌شوند

Hydration وقتی Zone.js داخل application stable می‌شود به signal آن تکیه می‌کند، تا Angular بتواند serialization process را روی server یا cleanup بعد از hydration را روی client شروع کند و DOM nodeهایی را که claim نشده‌اند حذف کند.

فراهم کردن implementation سفارشی یا "noop" از Zone.js ممکن است باعث timing متفاوت event مربوط به "stable" شود و در نتیجه serialization یا cleanup خیلی زود یا خیلی دیر trigger شود. این configuration هنوز کاملا پشتیبانی‌شده نیست و ممکن است لازم باشد timing event مربوط به `onStable` را در custom Zone.js implementation تنظیم کنید.

## Errors

چند error مرتبط با hydration ممکن است ببینید؛ از node mismatchها گرفته تا حالت‌هایی که `ngSkipHydration` روی host node نامعتبر استفاده شده است. رایج‌ترین error به خاطر direct DOM manipulation با native APIها رخ می‌دهد که باعث می‌شود hydration نتواند ساختار DOM tree مورد انتظار روی client را پیدا یا match کند؛ ساختاری که توسط server render شده است. حالت دیگر برای این نوع error قبلا در بخش [Valid HTML structure](#valid-html-structure) گفته شد. پس مطمئن شوید HTML در templateهای شما ساختار معتبر دارد تا از این error جلوگیری کنید.

برای مرجع کامل errorهای مرتبط با hydration، [Errors Reference Guide](/errors) را ببینید.

## چطور hydration را برای componentهای خاص skip کنیم؟

بعضی componentها ممکن است با فعال بودن hydration به دلیل موارد بالا، مثل [Direct DOM Manipulation](#direct-dom-manipulation)، درست کار نکنند. به‌عنوان workaround، می‌توانید attribute مربوط به `ngSkipHydration` را به tag یک component اضافه کنید تا hydration کل component skip شود.

```angular-html
<app-example ngSkipHydration />
```

به‌عنوان جایگزین، می‌توانید `ngSkipHydration` را به‌عنوان host binding تنظیم کنید.

```typescript
@Component({
  ...
  host: {ngSkipHydration: 'true'},
})
class ExampleComponent {}
```

attribute مربوط به `ngSkipHydration`، Angular را مجبور می‌کند hydration کل component و childهایش را skip کند. استفاده از این attribute یعنی component طوری رفتار می‌کند که انگار hydration فعال نیست؛ یعنی خودش را destroy و دوباره render می‌کند.

HELPFUL: این کار rendering issueها را رفع می‌کند، اما یعنی برای این component و childهایش از مزیت‌های hydration بهره‌مند نمی‌شوید. باید implementation component را طوری تنظیم کنید که از patternهای خراب‌کننده‌ی hydration، یعنی Direct DOM Manipulation، دوری کند تا بتوانید annotation مربوط به skip hydration را حذف کنید.

attribute مربوط به `ngSkipHydration` فقط روی component host nodeها قابل استفاده است. اگر این attribute به nodeهای دیگر اضافه شود، Angular error throw می‌کند.

به خاطر داشته باشید اضافه کردن attribute مربوط به `ngSkipHydration` به root application component عملا hydration را برای کل application غیرفعال می‌کند. در استفاده از این attribute محتاط و دقیق باشید. هدف آن workaround نهایی است. componentهایی که hydration را خراب می‌کنند باید bugهایی در نظر گرفته شوند که لازم است fix شوند.

## Hydration Timing و Application Stability

Application stability بخش مهمی از hydration process است. Hydration و هر فرایند بعد از hydration فقط وقتی رخ می‌دهند که application اعلام stability کرده باشد. چند راه وجود دارد که stability می‌تواند delay شود؛ مثل تنظیم timeout و interval، promiseهای resolveنشده و microtaskهای pending. در این حالت‌ها ممکن است error مربوط به [Application remains unstable](errors/NG0506) را ببینید، که نشان می‌دهد app شما بعد از 10 ثانیه هنوز به stable state نرسیده است. اگر می‌بینید application شما بلافاصله hydrate نمی‌شود، بررسی کنید چه چیزی روی application stability اثر می‌گذارد و refactor کنید تا از این delayها جلوگیری شود.

### Debugging Application Stability

utility مربوط به `provideStabilityDebugging` کمک می‌کند مشخص کنید چرا application شما fail می‌شود تا stable شود. این utility در dev mode هنگام استفاده از `provideClientHydration` به‌صورت پیش‌فرض فراهم می‌شود. همچنین می‌توانید آن را به‌صورت دستی به application providers اضافه کنید تا در production bundleها یا هنگام استفاده از SSR بدون hydration هم استفاده شود. اگر application بیشتر از حد انتظار طول بکشد تا stable شود، این feature اطلاعاتی را در console log می‌کند.

```typescript
import {provideStabilityDebugging} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import 'zone.js/plugins/task-tracking'; // Use if you have Zone.js with `provideZoneChangeDetection`

bootstrapApplication(App, {
  providers: [provideStabilityDebugging()],
});
```

وقتی فعال باشد، utility taskهای pending، یعنی `PendingTasks`، را در console log می‌کند. اگر application شما از Zone.js استفاده می‌کند، می‌توانید `zone.js/plugins/task-tracking` را هم import کنید تا ببینید کدام macrotaskها جلوی stable شدن Angular Zone را می‌گیرند. این plugin stack trace مربوط به ساخت macrotask را فراهم می‌کند و عملا به شما کمک می‌کند منبع delay را پیدا کنید.

IMPORTANT: Angular پلاگین task tracking مربوط به zone.js یا این utility را از production bundleها حذف نمی‌کند. از آن‌ها فقط برای debugging موقت stability issueها در زمان development استفاده کنید، از جمله برای production buildهای optimized.

## I18N

HELPFUL: به‌صورت پیش‌فرض، Angular برای componentهایی که از i18n blockها استفاده می‌کنند hydration را skip می‌کند و عملا آن componentها را از صفر re-render می‌کند.

برای فعال کردن hydration برای i18n blockها، می‌توانید [`withI18nSupport`](/api/platform-browser/withI18nSupport) را به فراخوانی `provideClientHydration` اضافه کنید.

```typescript
import {
  bootstrapApplication,
  provideClientHydration,
  withI18nSupport,
} from '@angular/platform-browser';
...

bootstrapApplication(App, {
  providers: [provideClientHydration(withI18nSupport())]
});
```

## Rendering consistent بین server-side و client-side

از وارد کردن `@if` blockها و conditionalهای دیگری که هنگام server-side rendering نسبت به client-side rendering محتوای متفاوتی نمایش می‌دهند خودداری کنید؛ مثل استفاده از `@if` block همراه با function مربوط به `isPlatformBrowser` در Angular. این تفاوت‌های rendering باعث layout shift می‌شوند و روی تجربه‌ی کاربر نهایی و core web vitals اثر منفی می‌گذارند.

## Third Party Libraries با DOM Manipulation

تعدادی third party library وجود دارند که برای render شدن به DOM manipulation وابسته‌اند. D3 charts نمونه‌ی بارز آن است. این libraryها بدون hydration کار می‌کردند، اما وقتی hydration فعال باشد ممکن است DOM mismatch error ایجاد کنند. فعلا اگر هنگام استفاده از یکی از این libraryها DOM mismatch error دیدید، می‌توانید attribute مربوط به `ngSkipHydration` را به componentی اضافه کنید که با آن library render می‌شود.

## Third Party Scripts با DOM Manipulation

بسیاری از third party scriptها، مثل ad trackerها و analytics، قبل از اینکه hydration رخ دهد DOM را modify می‌کنند. این scriptها ممکن است hydration error ایجاد کنند، چون صفحه دیگر با ساختاری که Angular انتظار دارد match نیست. تا جای ممکن این نوع script را به بعد از hydration defer کنید. استفاده از [`AfterNextRender`](api/core/afterNextRender) را در نظر بگیرید تا script تا بعد از انجام فرایندهای post-hydration به تاخیر بیفتد.

## Incremental Hydration

Incremental hydration شکل پیشرفته‌ای از hydration است که اجازه می‌دهد کنترل granularتری روی زمان رخ دادن hydration داشته باشید. برای اطلاعات بیشتر، [incremental hydration guide](guide/incremental-hydration) را ببینید.
