# شروع کار با NgOptimizedImage

Directive مربوط به `NgOptimizedImage` پذیرش best practiceهای performance برای load کردن imageها را ساده می‌کند.

این directive مطمئن می‌شود load شدن image مربوط به [Largest Contentful Paint (LCP)](http://web.dev/lcp) اولویت بگیرد، با این کارها:

- تنظیم خودکار attribute مربوط به `fetchpriority` روی tag مربوط به `<img>`
- lazy loading کردن imageهای دیگر به‌صورت پیش‌فرض
- تولید خودکار tag مربوط به preconnect link در document head
- تولید خودکار attribute مربوط به `srcset`
- تولید [preload hint](https://developer.mozilla.org/docs/Web/HTML/Link_types/preload) اگر app از SSR استفاده کند

علاوه بر optimize کردن load شدن image مربوط به LCP، `NgOptimizedImage` چند best practice مربوط به image را enforce می‌کند، مثل:

- استفاده از [image CDN URLها برای اعمال image optimizationها](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options)
- جلوگیری از layout shift با required کردن `width` و `height`
- warning دادن اگر `width` یا `height` اشتباه set شده باشند
- warning دادن اگر image هنگام render شدن از نظر بصری distort شود

اگر در CSS از background image استفاده می‌کنید، [از اینجا شروع کنید](#how-to-migrate-your-background-image).

**NOTE: با اینکه directive مربوط به `NgOptimizedImage` در Angular نسخه 15 stable شد، backport شده و در نسخه‌های 13.4.0 و 14.3.0 هم به‌عنوان stable feature در دسترس است.**

## شروع

<docs-workflow>
<docs-step title="Import `NgOptimizedImage` directive">
Directive مربوط به `NgOptimizedImage` را از `@angular/common` import کنید:

```ts
import {NgOptimizedImage} from '@angular/common';
```

و آن را در array مربوط به `imports` یک standalone component یا یک NgModule include کنید:

```ts
imports: [
  NgOptimizedImage,
  // ...
],
```

</docs-step>
<docs-step title="(Optional) Set up a Loader">
برای استفاده از NgOptimizedImage وجود image loader **الزامی** نیست، اما استفاده از loader همراه با image CDN قابلیت‌های performance قدرتمندی را فعال می‌کند، از جمله `srcset`های خودکار برای imageهای شما.

راهنمای کوتاه setup کردن loader را می‌توانید در بخش [Configuring an Image Loader](#configuring-an-image-loader-for-ngoptimizedimage) در انتهای همین page ببینید.
</docs-step>
<docs-step title="Enable the directive">
برای فعال کردن directive مربوط به `NgOptimizedImage`، attribute مربوط به `src` در image خود را با `ngSrc` جایگزین کنید.

```html
<img ngSrc="cat.jpg" />
```

اگر از یک [loader built-in شخص ثالث](#built-in-loaders) استفاده می‌کنید، مطمئن شوید base URL path را از `src` حذف کرده‌اید، چون loader آن را به‌صورت خودکار prepend می‌کند.
</docs-step>
<docs-step title="Mark images as `priority`">
همیشه [LCP image](https://web.dev/lcp/#what-elements-are-considered) در page خود را با `priority` علامت‌گذاری کنید تا load شدنش اولویت بگیرد.

```html
<img ngSrc="cat.jpg" width="400" height="200" priority />
```

علامت‌گذاری یک image به‌عنوان `priority` این optimizationها را اعمال می‌کند:

- `fetchpriority=high` را set می‌کند، درباره priority hintها [اینجا](https://web.dev/priority-hints) بیشتر بخوانید
- `loading=eager` را set می‌کند، درباره native lazy loading [اینجا](https://web.dev/browser-level-image-lazy-loading) بیشتر بخوانید
- اگر [rendering on the server](guide/ssr) باشد، یک [preload link element](https://developer.mozilla.org/docs/Web/HTML/Link_types/preload) خودکار تولید می‌کند.

اگر LCP element یک image باشد که attribute مربوط به `priority` ندارد، Angular در development warning نمایش می‌دهد. LCP element یک page می‌تواند بر اساس چند عامل تغییر کند، مثل dimensions صفحه کاربر؛ بنابراین ممکن است یک page چند image داشته باشد که باید `priority` شوند. برای جزئیات بیشتر [CSS for Web Vitals](https://web.dev/css-web-vitals/#images-and-largest-contentful-paint-lcp) را ببینید.
</docs-step>
<docs-step title="Include Width and Height">
برای جلوگیری از [layout shiftهای مرتبط با image](https://web.dev/css-web-vitals/#images-and-layout-shifts)، NgOptimizedImage لازم می‌داند برای image خود height و width مشخص کنید:

```html
<img ngSrc="cat.jpg" width="400" height="200" />
```

برای **responsive imageها**، یعنی imageهایی که style شده‌اند تا نسبت به viewport بزرگ و کوچک شوند، attributeهای `width` و `height` باید اندازه intrinsic خود image file باشند. برای responsive imageها همچنین مهم است [برای `sizes` مقدار set کنید.](#responsive-images)

برای **fixed size imageها**، attributeهای `width` و `height` باید اندازه render شده مطلوب image را منعکس کنند. aspect ratio این attributeها باید همیشه با aspect ratio intrinsic image match باشد.

NOTE: اگر اندازه imageهای خود را نمی‌دانید، استفاده از "fill mode" را در نظر بگیرید تا اندازه parent container به ارث برسد، همان‌طور که پایین‌تر توضیح داده شده است.
</docs-step>
</docs-workflow>

## استفاده از mode مربوط به `fill`

در حالت‌هایی که می‌خواهید image یک containing element را پر کند، می‌توانید از attribute مربوط به `fill` استفاده کنید. این کار اغلب وقتی مفید است که می‌خواهید behavior شبیه "background image" داشته باشید. همچنین وقتی width و height دقیق image را نمی‌دانید، اما parent container با اندازه مشخص دارید که می‌خواهید image داخل آن fit شود، مفید است.

وقتی attribute مربوط به `fill` را به image اضافه می‌کنید، نیازی به `width` و `height` ندارید و نباید آن‌ها را include کنید:

```html
<img ngSrc="cat.jpg" fill />
```

می‌توانید از CSS property مربوط به [object-fit](https://developer.mozilla.org/docs/Web/CSS/object-fit) استفاده کنید تا نحوه پر کردن container توسط image را تغییر دهید. با `object-fit: "contain"`، image aspect ratio خود را حفظ می‌کند و برای fit شدن letterbox می‌شود. با `object-fit: "cover"`، image aspect ratio خود را حفظ می‌کند، element را کامل پر می‌کند و ممکن است بخشی از content crop شود.

نمونه‌های بصری را در [مستندات MDN برای object-fit](https://developer.mozilla.org/docs/Web/CSS/object-fit) ببینید.

همچنین می‌توانید image خود را با [object-position property](https://developer.mozilla.org/docs/Web/CSS/object-position) style کنید تا position آن داخل containing element تنظیم شود.

IMPORTANT: برای اینکه image با "fill" درست render شود، parent element آن **باید** با `position: "relative"`، `position: "fixed"` یا `position: "absolute"` style شده باشد.

## مهاجرت background image

این یک فرایند ساده مرحله‌به‌مرحله برای مهاجرت از `background-image` به `NgOptimizedImage` است. در این stepها، elementی را که background image دارد "containing element" می‌نامیم:

1. style مربوط به `background-image` را از containing element حذف کنید.
2. مطمئن شوید containing element دارای `position: "relative"`، `position: "fixed"` یا `position: "absolute"` است.
3. یک image element جدید به‌عنوان child مربوط به containing element بسازید و برای فعال کردن directive مربوط به `NgOptimizedImage` از `ngSrc` استفاده کنید.
4. به آن element attribute مربوط به `fill` بدهید. `height` و `width` را include نکنید.
5. اگر فکر می‌کنید این image ممکن است [LCP element](https://web.dev/lcp/) شما باشد، attribute مربوط به `priority` را به image element اضافه کنید.

می‌توانید نحوه پر کردن container توسط background image را همان‌طور که در بخش [Using fill mode](#using-fill-mode) توضیح داده شد تنظیم کنید.

## استفاده از placeholderها

### Placeholderهای خودکار

اگر از CDN یا image hostی استفاده می‌کنید که automatic image resizing فراهم می‌کند، NgOptimizedImage می‌تواند برای image شما یک placeholder خودکار با resolution پایین نمایش دهد. برای استفاده از این قابلیت، attribute مربوط به `placeholder` را به image اضافه کنید:

```html
<img ngSrc="cat.jpg" width="400" height="200" placeholder />
```

اضافه کردن این attribute به‌صورت خودکار نسخه دوم و کوچک‌تری از image را با loader مشخص‌شده درخواست می‌کند. این image کوچک هنگام load شدن image اصلی، به‌عنوان style مربوط به `background-image` همراه با CSS blur اعمال می‌شود. اگر image loader فراهم نشده باشد، placeholder image قابل تولید نیست و error throw می‌شود.

اندازه پیش‌فرض placeholderهای تولیدشده 30px عرض است. می‌توانید این اندازه را با مشخص کردن pixel value در provider مربوط به `IMAGE_CONFIG` تغییر دهید:

```ts
providers: [
  {
    provide: IMAGE_CONFIG,
    useValue: {
      placeholderResolution: 40
    }
  },
],
```

اگر می‌خواهید edgeهای sharp دور placeholder blur شده داشته باشید، می‌توانید image را داخل یک `<div>` حاوی style مربوط به `overflow: hidden` wrap کنید. تا وقتی `<div>` هم‌اندازه image باشد، مثلا با `width: fit-content`، edgeهای fuzzy مربوط به placeholder hidden می‌شوند.

### Placeholderهای Data URL

همچنین می‌توانید بدون image loader، با یک [data URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URLs) از نوع base64، placeholder مشخص کنید. فرمت data url برابر `data:image/[imagetype];[data]` است، جایی که `[imagetype]` فرمت image مثل `png` است و `[data]` encoding مربوط به base64 image است. این encoding را می‌توان با command line یا JavaScript انجام داد. برای commandهای مشخص، [مستندات MDN](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URLs#encoding_data_into_base64_format) را ببینید. نمونه placeholder با data URL کوتاه‌شده:

```html
<img ngSrc="cat.jpg" width="400" height="200" placeholder="data:image/png;base64,iVBORw0K..." />
```

اما data URLهای بزرگ اندازه bundleهای Angular شما را افزایش می‌دهند و load page را کند می‌کنند. اگر نمی‌توانید از image loader استفاده کنید، تیم Angular توصیه می‌کند base64 placeholder imageها را کوچک‌تر از 4KB نگه دارید و فقط روی imageهای critical استفاده کنید. علاوه بر کاهش dimensions placeholder، تغییر image format یا parameterهای هنگام save کردن image را هم در نظر بگیرید. در resolutionهای خیلی پایین، این parameterها می‌توانند اثر زیادی روی file size داشته باشند.

### Placeholderهای بدون blur

به‌صورت پیش‌فرض، NgOptimizedImage یک CSS blur effect روی image placeholderها اعمال می‌کند. برای render کردن placeholder بدون blur، argument مربوط به `placeholderConfig` را با objectی فراهم کنید که property مربوط به `blur` را با مقدار false دارد:

```html
<img ngSrc="cat.jpg" width="400" height="200" placeholder [placeholderConfig]="{blur: false}" />
```

## تنظیم style مربوط به image

بسته به styling مربوط به image، اضافه کردن attributeهای `width` و `height` ممکن است باعث شود image متفاوت render شود. اگر styling شما image را با aspect ratio distorted render کند، `NgOptimizedImage` warning می‌دهد.

معمولا می‌توانید این مشکل را با اضافه کردن `height: auto` یا `width: auto` به styleهای image حل کنید. برای اطلاعات بیشتر، [مقاله web.dev درباره tag مربوط به `<img>`](https://web.dev/patterns/web-vitals-patterns/images/img-tag) را ببینید.

اگر attributeهای `width` و `height` روی image مانع sizing موردنظر شما با CSS می‌شوند، استفاده از `fill` mode و style دادن به parent element مربوط به image را در نظر بگیرید.

## قابلیت‌های Performance

NgOptimizedImage چند قابلیت برای بهبود loading performance در app شما دارد. این قابلیت‌ها در این بخش توضیح داده می‌شوند.

### اضافه کردن resource hintها

یک [`preconnect` resource hint](https://web.dev/preconnect-and-dns-prefetch) برای origin مربوط به image شما مطمئن می‌شود LCP image تا حد ممکن سریع load شود.

Preconnect linkها برای domainهایی که به‌عنوان argument به [loader](#optional-set-up-a-loader) داده می‌شوند خودکار تولید می‌شوند. اگر image origin به‌صورت خودکار قابل شناسایی نباشد و preconnect link برای LCP image تشخیص داده نشود، `NgOptimizedImage` در development warning می‌دهد. در این حالت باید یک resource hint را دستی به `index.html` اضافه کنید. داخل `<head>` document، یک tag مربوط به `link` با `rel="preconnect"` اضافه کنید:

```html
<link rel="preconnect" href="https://my.cdn.origin" />
```

برای غیرفعال کردن preconnect warningها، token مربوط به `PRECONNECT_CHECK_BLOCKLIST` را inject کنید:

```ts

providers: [
{provide: PRECONNECT_CHECK_BLOCKLIST, useValue: 'https://your-domain.com'}
],

```

اطلاعات بیشتر درباره تولید خودکار preconnect را [اینجا](#why-is-a-preconnect-element-not-being-generated-for-my-image-domain) ببینید.

### درخواست imageها با اندازه درست و `srcset` خودکار

تعریف یک [`srcset` attribute](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset) مطمئن می‌شود مرورگر image را با اندازه درست برای viewport کاربر درخواست کند و وقت را برای download کردن image بیش از حد بزرگ هدر ندهد. `NgOptimizedImage` بر اساس وجود و مقدار [`sizes` attribute](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes) روی image tag، یک `srcset` مناسب برای image تولید می‌کند.

#### Fixed-size imageها

اگر image شما باید اندازه "fixed" داشته باشد، یعنی روی deviceها اندازه یکسانی داشته باشد مگر از نظر [pixel density](https://web.dev/codelab-density-descriptors/)، نیازی به set کردن attribute مربوط به `sizes` نیست. یک `srcset` می‌تواند به‌صورت خودکار از attributeهای width و height مربوط به image تولید شود، بدون نیاز به input بیشتر.

نمونه srcset تولیدشده:

```html
<img ... srcset="image-400w.jpg 1x, image-800w.jpg 2x" />
```

#### Responsive imageها

اگر image شما باید responsive باشد، یعنی بر اساس viewport size بزرگ و کوچک شود، باید یک [`sizes` attribute](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes) تعریف کنید تا `srcset` تولید شود.

اگر قبلا از `sizes` استفاده نکرده‌اید، شروع خوب این است که آن را بر اساس viewport width تنظیم کنید. مثلا اگر CSS شما باعث می‌شود image کل 100% عرض viewport را پر کند، `sizes` را روی `100vw` بگذارید تا مرورگر image موجود در `srcset` را انتخاب کند که نزدیک‌ترین اندازه به viewport width است، بعد از لحاظ کردن pixel density. اگر image احتمالا فقط نصف صفحه را می‌گیرد، مثلا در sidebar، `sizes` را روی `50vw` بگذارید تا مرورگر image کوچک‌تری انتخاب کند، و همین‌طور ادامه دهید.

اگر این مقدارها behavior مطلوب شما را پوشش نمی‌دهند، مستندات مربوط به [advanced sizes values](#advanced-sizes-values) را ببینید.

توجه کنید `NgOptimizedImage` به‌صورت خودکار `"auto"` را به ابتدای مقدار `sizes` داده‌شده اضافه می‌کند. این optimization دقت انتخاب srcset را در مرورگرهایی که از `sizes="auto"` پشتیبانی می‌کنند افزایش می‌دهد و توسط مرورگرهایی که پشتیبانی نمی‌کنند نادیده گرفته می‌شود.

به‌صورت پیش‌فرض، breakpointهای responsive این‌ها هستند:

`[16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]`

اگر می‌خواهید این breakpointها را customize کنید، می‌توانید با provider مربوط به `IMAGE_CONFIG` این کار را انجام دهید:

```ts
providers: [
  {
    provide: IMAGE_CONFIG,
    useValue: {
      breakpoints: [16, 48, 96, 128, 384, 640, 750, 828, 1080, 1200, 1920]
    }
  },
],
```

اگر می‌خواهید attribute مربوط به `srcset` را دستی تعریف کنید، می‌توانید آن را با attribute مربوط به `ngSrcset` فراهم کنید:

```html
<img ngSrc="hero.jpg" ngSrcset="100w, 200w, 300w" />
```

اگر attribute مربوط به `ngSrcset` وجود داشته باشد، `NgOptimizedImage` بر اساس sizeهای include شده، `srcset` را تولید و set می‌کند. نام image file را در `ngSrcset` include نکنید؛ directive این اطلاعات را از `ngSrc` infer می‌کند. directive هم از width descriptorها مثل `100w` و هم از density descriptorها مثل `1x` پشتیبانی می‌کند.

```html
<img ngSrc="hero.jpg" ngSrcset="100w, 200w, 300w" sizes="50vw" />
```

### غیرفعال کردن تولید خودکار srcset

برای غیرفعال کردن srcset generation برای یک image، می‌توانید attribute مربوط به `disableOptimizedSrcset` را روی image اضافه کنید:

```html
<img ngSrc="about.jpg" disableOptimizedSrcset />
```

### غیرفعال کردن image lazy loading

به‌صورت پیش‌فرض، `NgOptimizedImage` برای همه imageهایی که `priority` نشده‌اند، `loading=lazy` را set می‌کند. می‌توانید این رفتار را برای imageهای non-priority با set کردن attribute مربوط به `loading` غیرفعال کنید. این attribute مقدارهای `eager`، `auto` و `lazy` را می‌پذیرد. [برای جزئیات، مستندات attribute استاندارد `loading` برای image را ببینید](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/loading#value).

```html
<img ngSrc="cat.jpg" width="400" height="200" loading="eager" />
```

### کنترل image decoding

به‌صورت پیش‌فرض، `NgOptimizedImage` برای همه imageها `decoding="auto"` را set می‌کند. این به مرورگر اجازه می‌دهد زمان بهینه decode کردن image بعد از fetch شدن را تعیین کند. وقتی یک image به‌عنوان `priority` علامت‌گذاری شود، Angular به‌صورت خودکار `decoding="sync"` را set می‌کند تا image تا حد ممکن زود decode و paint شود و بهبود **Largest Contentful Paint (LCP)** کمک کند.

همچنان می‌توانید با set کردن explicit attribute مربوط به `decoding` این رفتار را override کنید.  
[برای جزئیات، مستندات attribute استاندارد `decoding` برای image را ببینید](https://developer.mozilla.org/docs/Web/HTML/Element/img#decoding).

```html
<!-- Default: decoding is 'auto' -->
<img ngSrc="gallery/landscape.jpg" width="1200" height="800" />

<!-- Decode the image asynchronously to avoid blocking the main thread.-->
<img ngSrc="gallery/preview.jpg" width="600" height="400" decoding="async" />

<!-- Priority images automatically use decoding="sync" -->
<img ngSrc="awesome.jpg" width="500" height="625" priority />

<!-- Decode immediately (can block) when you need the pixels right away -->
<img ngSrc="hero.jpg" width="1600" height="900" decoding="sync" />
```

**مقدارهای مجاز**

- `auto` (پیش‌فرض): به مرورگر اجازه می‌دهد strategy بهینه را انتخاب کند.
- `async`: image را asynchronous decode می‌کند و تا جای ممکن از main-thread blocking جلوگیری می‌کند.
- `sync`: image را بلافاصله decode می‌کند؛ ممکن است rendering را block کند، اما تضمین می‌کند pixelها به‌محض در دسترس بودن image آماده باشند.

### مقدارهای پیشرفته برای `sizes`

ممکن است بخواهید imageها در screenهایی با اندازه‌های متفاوت، با widthهای متفاوت نمایش داده شوند. یک نمونه رایج این pattern، layout مبتنی بر grid یا column است که روی mobile deviceها یک column و روی deviceهای بزرگ‌تر دو column render می‌کند. می‌توانید این behavior را در attribute مربوط به `sizes` با syntax شبیه "media query" capture کنید:

```html
<img ngSrc="cat.jpg" width="400" height="200" sizes="(max-width: 768px) 100vw, 50vw" />
```

Attribute مربوط به `sizes` در مثال بالا می‌گوید: "انتظار دارم این image روی deviceهایی با عرض کمتر از 768px، صددرصد عرض screen باشد. در غیر این صورت، انتظار دارم پنجاه درصد عرض screen باشد."

برای اطلاعات بیشتر درباره attribute مربوط به `sizes`، [web.dev](https://web.dev/learn/design/responsive-images/#sizes) یا [mdn](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes) را ببینید.

## Configure کردن image loader برای `NgOptimizedImage`

"loader" functionی است که برای یک image file مشخص، یک [image transformation URL](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options) تولید می‌کند. در صورت مناسب بودن، `NgOptimizedImage` transformationهای size، format و image quality را برای یک image set می‌کند.

`NgOptimizedImage` هم یک generic loader فراهم می‌کند که transformation اعمال نمی‌کند و هم loaderهایی برای serviceهای مختلف image شخص ثالث. همچنین از نوشتن custom loader خودتان پشتیبانی می‌کند.

| Loader type                            | Behavior                                                                                                                                                                                                                     |
| :------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Generic loader                         | URL برگشتی از generic loader همیشه با مقدار `src` match می‌شود. به بیان دیگر، این loader transformation اعمال نمی‌کند. siteهایی که با Angular image serve می‌کنند use case اصلی این loader هستند. |
| Loaders for third-party image services | URL برگشتی از loaderهای سرویس‌های image شخص ثالث، conventionهای API همان image service را دنبال می‌کند.                                                                                                                     |
| Custom loaders                         | behavior مربوط به custom loader توسط developer آن تعریف می‌شود. اگر image service شما توسط loaderهای preconfigured در `NgOptimizedImage` پشتیبانی نمی‌شود، از custom loader استفاده کنید.       |

بر اساس image serviceهایی که معمولا با Angular applicationها استفاده می‌شوند، `NgOptimizedImage` loaderهای preconfigured برای serviceهای زیر فراهم می‌کند:

| Image Service             | Angular API               | Documentation                                                               |
| :------------------------ | :------------------------ | :-------------------------------------------------------------------------- |
| Cloudflare Image Resizing | `provideCloudflareLoader` | [Documentation](https://developers.cloudflare.com/images/image-resizing/)   |
| Cloudinary                | `provideCloudinaryLoader` | [Documentation](https://cloudinary.com/documentation/resizing_and_cropping) |
| ImageKit                  | `provideImageKitLoader`   | [Documentation](https://docs.imagekit.io/)                                  |
| Imgix                     | `provideImgixLoader`      | [Documentation](https://docs.imgix.com/)                                    |
| Netlify                   | `provideNetlifyLoader`    | [Documentation](https://docs.netlify.com/image-cdn/overview/)               |

برای استفاده از **generic loader** به تغییر کد اضافه‌ای نیاز نیست. این رفتار پیش‌فرض است.

### Loaderهای built-in

برای استفاده از loader موجود برای یک **third-party image service**، provider factory سرویس انتخابی خود را به array مربوط به `providers` اضافه کنید. در مثال زیر از Imgix loader استفاده شده است:

```ts
providers: [
  provideImgixLoader('https://my.base.url/'),
],
```

Base URL مربوط به image assetهای شما باید به‌عنوان argument به provider factory پاس داده شود. برای بیشتر siteها، این base URL باید با یکی از patternهای زیر match باشد:

- <https://yoursite.yourcdn.com>
- <https://subdomain.yoursite.com>
- <https://subdomain.yourcdn.com/yoursite>

می‌توانید درباره ساختار base URL در docs مربوط به CDN provider متناظر بیشتر یاد بگیرید.

### Custom Loaderها

برای استفاده از یک **custom loader**، loader function خود را به‌عنوان value برای DI token مربوط به `IMAGE_LOADER` provide کنید. در مثال زیر، custom loader function یک URL شروع‌شونده با `https://example.com` برمی‌گرداند که `src`، `width` و `height` را به‌عنوان URL parameter include می‌کند.

```ts
providers: [
  {
    provide: IMAGE_LOADER,
    useValue: (config: ImageLoaderConfig) => {
      return `https://example.com/images?src=${config.src}&width=${config.width}&height=${config.height}`;
    },
  },
],
```

Loader function برای directive مربوط به `NgOptimizedImage` یک object با نوع `ImageLoaderConfig` از `@angular/common` به‌عنوان argument می‌گیرد و absolute URL مربوط به image asset را برمی‌گرداند. object مربوط به `ImageLoaderConfig` شامل property مربوط به `src` و propertyهای اختیاری `width`، `height` و `loaderParams` است.

NOTE: با اینکه property مربوط به `width` ممکن است همیشه حاضر نباشد، custom loader باید از آن استفاده کند تا درخواست imageها با widthهای مختلف را پشتیبانی کند و `ngSrcset` درست کار کند.

### Property مربوط به `loaderParams`

یک attribute اضافه به نام `loaderParams` توسط directive مربوط به `NgOptimizedImage` پشتیبانی می‌شود که مخصوص پشتیبانی از custom loaderها طراحی شده است. attribute مربوط به `loaderParams` یک object با هر propertyای می‌گیرد و به‌تنهایی کاری انجام نمی‌دهد. داده داخل `loaderParams` به object مربوط به `ImageLoaderConfig` که به custom loader شما پاس داده می‌شود اضافه می‌شود و می‌تواند برای کنترل behavior loader استفاده شود.

یک کاربرد رایج `loaderParams` کنترل قابلیت‌های پیشرفته image CDN است.

### استفاده از property مربوط به `transform` با loaderهای built-in

Loaderهای built-in برای Cloudinary، Cloudflare، ImageKit و Imgix از یک property ویژه به نام `transform` داخل `loaderParams` پشتیبانی می‌کنند. این property اجازه می‌دهد custom image transformationهای ارائه‌شده توسط CDN خود را اعمال کنید.

Property مربوط به `transform` دو format می‌پذیرد:

#### String format

Transformationها را به‌صورت string جداشده با comma و با syntax transformation مربوط به CDN خود provide کنید:

```html
<img
  ngSrc="my-image.jpg"
  width="400"
  height="300"
  [loaderParams]="{transform: 'e_grayscale,r_10'}"
/>
```

#### Object format

Transformationها را به‌صورت object با key-value pairها provide کنید.

```html
<img
  ngSrc="my-image.jpg"
  width="400"
  height="300"
  [loaderParams]="{transform: {e: 'grayscale', r: 10}}"
/>
```

NOTE: property مربوط به `transform` توسط Netlify loader پشتیبانی نمی‌شود، چون image CDN مربوط به Netlify custom transformation parameter فراهم نمی‌کند.

### مثال custom loader

نمونه زیر یک custom loader function را نشان می‌دهد. این function نمونه `src`، `width` و `height` را concatenate می‌کند و از `loaderParams` برای کنترل یک قابلیت custom CDN برای rounded cornerها استفاده می‌کند:

```ts
const myCustomLoader = (config: ImageLoaderConfig) => {
  let url = `https://example.com/images/${config.src}?`;
  let queryParams = [];
  if (config.width) {
    queryParams.push(`w=${config.width}`);
  }
  if (config.height) {
    queryParams.push(`h=${config.height}`);
  }
  if (config.loaderParams?.roundedCorners) {
    queryParams.push('mask=corners&corner-radius=5');
  }
  return url + queryParams.join('&');
};
```

توجه کنید در مثال بالا، نام property مربوط به `roundedCorners` را برای کنترل یک قابلیت custom loader خودمان invent کرده‌ایم. سپس می‌توانیم هنگام ساخت image از این قابلیت استفاده کنیم:

```html
<img ngSrc="profile.jpg" width="300" height="300" [loaderParams]="{roundedCorners: true}" />
```

## پرسش‌های متداول

### آیا NgOptimizedImage از CSS property مربوط به `background-image` پشتیبانی می‌کند؟

NgOptimizedImage مستقیم از CSS property مربوط به `background-image` پشتیبانی نمی‌کند، اما طوری طراحی شده که use case داشتن image به‌عنوان background یک element دیگر را به‌سادگی پوشش دهد.

برای فرایند مرحله‌به‌مرحله مهاجرت از `background-image` به `NgOptimizedImage`، بخش [How to migrate your background image](#how-to-migrate-your-background-image) را در بالا ببینید.

### چرا نمی‌توانم از `src` با `NgOptimizedImage` استفاده کنم؟

Attribute مربوط به `ngSrc` به‌دلیل ملاحظات technical درباره نحوه load شدن imageها توسط مرورگر، به‌عنوان trigger برای NgOptimizedImage انتخاب شده است. NgOptimizedImage تغییرات برنامه‌نویسی‌شده‌ای روی attribute مربوط به `loading` انجام می‌دهد؛ اگر مرورگر پیش از اعمال این تغییرات attribute مربوط به `src` را ببیند، eager download کردن image file را شروع می‌کند و تغییرات loading نادیده گرفته می‌شوند.

### چرا برای image domain من preconnect element تولید نمی‌شود؟

Preconnect generation بر اساس static analysis application شما انجام می‌شود. یعنی image domain باید مستقیم در loader parameter include شده باشد، مثل این مثال:

```ts
providers: [
  provideImgixLoader('https://my.base.url/'),
],
```

اگر از variable برای پاس دادن domain string به loader استفاده کنید، یا اصلا از loader استفاده نکنید، static analysis نمی‌تواند domain را شناسایی کند و preconnect link تولید نمی‌شود. در این حالت باید preconnect link را همان‌طور که [بالا توضیح داده شد](#add-resource-hints)، دستی به document head اضافه کنید.

### آیا می‌توانم در یک page از دو image domain متفاوت استفاده کنم؟

Pattern مربوط به providerهای [image loader](#configuring-an-image-loader-for-ngoptimizedimage) طوری طراحی شده که برای use case رایجِ داشتن فقط یک image CDN داخل یک component تا حد ممکن ساده باشد. با این حال، مدیریت چند image CDN با یک provider واحد کاملا ممکن است.

برای این کار، پیشنهاد می‌کنیم یک [custom image loader](#custom-loaders) بنویسید که از [`loaderParams` property](#the-loaderparams-property) برای پاس دادن flag مشخص‌کننده image CDN استفاده کند، و سپس بر اساس همان flag، loader مناسب را invoke کند.

### آیا می‌توانید loader built-in جدیدی برای CDN محبوب من اضافه کنید؟

به دلایل نگهداری، فعلا برنامه‌ای برای پشتیبانی از loaderهای built-in اضافه در repository مربوط به Angular نداریم. در عوض، توسعه‌دهندگان را تشویق می‌کنیم image loaderهای اضافه را به‌عنوان third-party package منتشر کنند.

### آیا می‌توانم این را با tag مربوط به `<picture>` استفاده کنم؟

نه، اما این مورد در roadmap ماست، پس منتظر بمانید.

اگر منتظر این قابلیت هستید، لطفا issue مربوط به GitHub را [اینجا](https://github.com/angular/angular/issues/56594) upvote کنید.

### چطور LCP image خود را با Chrome DevTools پیدا کنم؟

1. با استفاده از performance tab در Chrome DevTools، روی button مربوط به "start profiling and reload page" در بالا سمت چپ کلیک کنید. شبیه icon refresh page است.

2. این کار یک profiling snapshot از Angular application شما trigger می‌کند.

3. وقتی profiling result آماده شد، در section مربوط به timings، گزینه "LCP" را انتخاب کنید.

4. یک summary entry باید در panel پایین ظاهر شود. می‌توانید LCP element را در row مربوط به "related node" پیدا کنید. کلیک روی آن، element را در Elements panel نشان می‌دهد.

<img alt="LCP in the Chrome DevTools" src="assets/images/guide/image-optimization/devtools-lcp.png">

NOTE: این فقط LCP element را داخل viewport همان pageای که test می‌کنید شناسایی می‌کند. همچنین توصیه می‌شود برای شناسایی LCP element در screenهای کوچک‌تر از mobile emulation استفاده کنید.
