# Build system مربوط به Angular application

در v17 و بالاتر، build system جدید روش بهتری برای build کردن Angular applicationها فراهم می‌کند. این build system جدید شامل موارد زیر است:

- output format مدرن با استفاده از ESM، همراه dynamic import expressionها برای پشتیبانی از lazy module loading.
- build-time performance سریع‌تر، هم برای initial buildها و هم incremental rebuildها.
- ابزارهای جدیدتر JavaScript ecosystem مثل [esbuild](https://esbuild.github.io/) و [Vite](https://vitejs.dev/).
- قابلیت‌های SSR و prerendering یکپارچه.
- hot replacement خودکار برای global stylesheet و component stylesheet.

این build system جدید stable است و برای استفاده با Angular applicationها به‌طور کامل پشتیبانی می‌شود.
می‌توانید applicationهایی را که از builder مربوط به `browser` استفاده می‌کنند به build system جدید migrate کنید.
اگر از custom builder استفاده می‌کنید، لطفاً برای optionهای احتمالی migration به documentation همان builder مراجعه کنید.

IMPORTANT: build system موجود مبتنی بر webpack و builder مربوط به `browser` deprecated شده‌اند.
Applicationها می‌توانند موقتاً همچنان از builder مربوط به `browser` استفاده کنند و projectها می‌توانند هنگام update از migration خارج شوند، اما تیم Angular مهاجرت به build system جدید را توصیه می‌کند.

## برای applicationهای جدید

Applicationهای جدید به‌صورت پیش‌فرض از طریق builder مربوط به `application` از این build system جدید استفاده می‌کنند.

## برای applicationهای موجود

بسته به requirementهای project، هر دو روش automated و manual در دسترس‌اند.
از v18 به بعد، update process از شما می‌پرسد آیا می‌خواهید applicationهای موجود را از طریق automated migration به build system جدید migrate کنید یا نه.
قبل از migration، بهتر است بخش [Known Issues](#known-issues) را مرور کنید، چون ممکن است اطلاعات مرتبط با project شما داشته باشد.

HELPFUL: اگر از SSR استفاده می‌کنید، یادتان باشد هر assumption مربوط به CommonJS را از application server code حذف کنید؛ مثل `require`، `__filename`، `__dirname` یا constructهای دیگر از [CommonJS module scope](https://nodejs.org/api/modules.html#the-module-scope). همه application code باید با ESM compatible باشد. این موضوع شامل third-party dependencyها نمی‌شود.

### Automated migration (توصیه‌شده)

Automated migration هم application configuration داخل `angular.json` و هم code و stylesheetها را adjust می‌کند تا استفاده از featureهای قبلیِ مخصوص webpack حذف شود.
هرچند بسیاری از تغییرات می‌توانند خودکار شوند و بیشتر applicationها به تغییر اضافه‌ای نیاز ندارند، هر application منحصربه‌فرد است و ممکن است بعضی تغییرات manual لازم باشد.
بعد از migration، لطفاً یک build از application اجرا کنید، چون ممکن است errorهای جدیدی ظاهر شود که نیاز به adjustment در code دارند.
Errorها در صورت امکان تلاش می‌کنند solutionهایی برای problem ارائه کنند و بخش‌های بعدی این guide چند وضعیت رایج‌تر را که ممکن است با آن‌ها روبه‌رو شوید توضیح می‌دهند.
وقتی با `ng update` به Angular v18 update می‌کنید، از شما خواسته می‌شود migration را اجرا کنید.
این migration برای v18 کاملاً optional است و بعد از update هم هر زمان می‌توانید آن را به‌صورت manual با command زیر اجرا کنید:

```shell

ng update @angular/cli --name use-application-builder

```

این migration کارهای زیر را انجام می‌دهد:

- targetهای موجود `browser` یا `browser-esbuild` را به `application` تبدیل می‌کند
- هر SSR builder قبلی را حذف می‌کند، چون `application` حالا همان کار را انجام می‌دهد.
- configuration را مطابق آن update می‌کند.
- `tsconfig.server.json` را با `tsconfig.app.json` merge می‌کند و TypeScript option مربوط به `"esModuleInterop": true` را اضافه می‌کند تا importهای `express` از نظر [ESM compliant](#esm-default-imports-vs-namespace-imports) باشند.
- application server code را update می‌کند تا از bootstrapping جدید و ساختار output directory جدید استفاده کند.
- استفاده‌های stylesheet مخصوص webpack builder، مثل tilde یا caret در `@import`/`url()` را حذف می‌کند و configuration را update می‌کند تا behavior معادل فراهم شود.
- اگر استفاده دیگری از `@angular-devkit/build-angular` پیدا نشود، project را به استفاده از package جدیدتر و سبک‌تر `@angular/build` در Node.js تبدیل می‌کند.

### Manual migration

برای projectهای موجود، می‌توانید به‌صورت manual و برای هر application جداگانه، با دو option متفاوت وارد استفاده از builder جدید شوید.
هر دو option stable هستند و تیم Angular به‌طور کامل از آن‌ها پشتیبانی می‌کند.
انتخاب اینکه کدام option را استفاده کنید، به این بستگی دارد که برای migration چقدر تغییر لازم دارید و می‌خواهید از چه featureهای جدیدی در project استفاده کنید.

- builder مربوط به `browser-esbuild` فقط client-side bundle یک application را build می‌کند و طوری طراحی شده که با builder موجود `browser`، یعنی build system قبلی، compatible باشد.
  این builder build optionهای معادل فراهم می‌کند و در بسیاری از موارد، می‌تواند جایگزین drop-in برای applicationهای موجود `browser` باشد.
- builder مربوط به `application` کل application را پوشش می‌دهد؛ از client-side bundle گرفته تا build کردن optional یک server برای server-side rendering و انجام build-time prerendering برای static pageها.

builder مربوط به `application` معمولاً ترجیح داده می‌شود، چون buildهای server-side rendered یا SSR را بهبود می‌دهد و باعث می‌شود projectهای client-side rendered در آینده راحت‌تر SSR را adopt کنند.
با این حال، کمی migration effort بیشتری می‌خواهد، مخصوصاً برای applicationهای SSR موجود اگر به‌صورت manual انجام شود.
اگر adopt کردن builder مربوط به `application` برای project شما دشوار است، `browser-esbuild` می‌تواند solution ساده‌تری باشد که بیشتر benefitهای build performance را با breaking changeهای کمتر می‌دهد.

#### Manual migration به compatibility builder

builderی به نام `browser-esbuild` داخل package مربوط به `@angular-devkit/build-angular` موجود است؛ همان packageای که در application generate شده با Angular CLI وجود دارد.
می‌توانید build system جدید را برای applicationهایی که از builder مربوط به `browser` استفاده می‌کنند امتحان کنید.
اگر از custom builder استفاده می‌کنید، لطفاً برای optionهای احتمالی migration به documentation همان builder مراجعه کنید.

Compatibility option برای کمینه کردن مقدار تغییرات لازم جهت migration اولیه applicationها پیاده‌سازی شده است.
این قابلیت از طریق یک builder جایگزین یعنی `browser-esbuild` فراهم می‌شود.
می‌توانید target مربوط به `build` را برای هر application target update کنید تا به build system جدید migrate شود.

نمونه زیر چیزی است که معمولاً در `angular.json` برای یک application می‌بینید:

```json
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
...
```

تغییر فیلد `builder` تنها تغییری است که باید انجام دهید.

```json
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser-esbuild",
...
```

#### Manual migration به builder جدید `application`

builderی به نام `application` هم داخل package مربوط به `@angular-devkit/build-angular` موجود است؛ همان packageای که در application generate شده با Angular CLI وجود دارد.
این builder برای همه applicationهای جدیدی که با `ng new` ساخته می‌شوند default است.

نمونه زیر چیزی است که معمولاً در `angular.json` برای یک application می‌بینید:

```json
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
...
```

تغییر فیلد `builder` اولین تغییری است که باید انجام دهید.

```json
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:application",
...
```

بعد از تغییر نام builder، optionهای داخل target مربوط به `build` باید update شوند.
لیست زیر همه optionهای builder مربوط به `browser` را توضیح می‌دهد که باید adjust شوند.

- `main` باید به `browser` rename شود.
- `polyfills` باید array باشد، نه یک فایل تکی.
- `buildOptimizer` باید حذف شود، چون این مورد توسط option مربوط به `optimization` پوشش داده می‌شود.
- `resourcesOutputPath` باید حذف شود؛ این حالا همیشه `media` است.
- `vendorChunk` باید حذف شود، چون یک performance optimization بود که دیگر لازم نیست.
- `commonChunk` باید حذف شود، چون یک performance optimization بود که دیگر لازم نیست.
- `deployUrl` باید حذف شود و پشتیبانی نمی‌شود. به‌جای آن [`<base href>`](guide/routing/router-reference#base-href) را ترجیح دهید. برای اطلاعات بیشتر [deployment documentation](tools/cli/deployment#--deploy-url) را ببینید.
- `ngswConfigPath` باید به `serviceWorker` rename شود.

اگر application در حال حاضر از SSR استفاده نمی‌کند، این باید آخرین step باشد تا `ng build` کار کند.
بعد از اجرای `ng build` برای اولین بار، ممکن است بر اساس تفاوت‌های رفتاری یا استفاده application از featureهای مخصوص webpack، warning یا errorهای جدیدی ببینید.
بسیاری از warningها پیشنهادهایی برای رفع مشکل ارائه می‌کنند.
اگر به نظر می‌رسد warning نادرست است یا solution واضح نیست، لطفاً در [GitHub](https://github.com/angular/angular-cli/issues) issue باز کنید.
همچنین بخش‌های بعدی این guide اطلاعات بیشتری درباره چند مورد خاص و known issueهای فعلی ارائه می‌دهند.

برای applicationهایی که تازه می‌خواهند SSR را اضافه کنند، [Angular SSR Guide](guide/ssr) اطلاعات بیشتری درباره setup process افزودن SSR به application ارائه می‌دهد.

برای applicationهایی که همین حالا از SSR استفاده می‌کنند، adjustmentهای اضافه‌ای لازم است تا application server برای پشتیبانی از قابلیت‌های SSR یکپارچه جدید update شود.
builder مربوط به `application` حالا functionality یکپارچه برای همه builderهای قبلی زیر را فراهم می‌کند:

- `app-shell`
- `prerender`
- `server`
- `ssr-dev-server`

process مربوط به `ng update` به‌صورت خودکار استفاده از packageهای scope مربوط به `@nguniversal` را، که بعضی از این builderها قبلاً آنجا قرار داشتند، حذف می‌کند.
package جدید `@angular/ssr` هم به‌صورت خودکار اضافه می‌شود و همراه configuration و code که هنگام update adjust می‌شوند، استفاده خواهد شد.
package مربوط به `@angular/ssr` هم builder مربوط به `browser` و هم builder مربوط به `application` را پشتیبانی می‌کند.

## اجرای build

بعد از update کردن application configuration، buildها می‌توانند مثل قبل با `ng build` انجام شوند.
بسته به انتخابی که برای builder migration داشته‌اید، بعضی command line optionها ممکن است متفاوت باشند.
اگر build command داخل هر `npm` script یا scriptهای دیگر قرار دارد، مطمئن شوید review و update شده‌اند.
برای applicationهایی که به builder مربوط به `application` migrate شده‌اند و از SSR و/یا prerendering استفاده می‌کنند، احتمالاً می‌توانید حالا بعضی commandهای اضافه `ng run` را از scriptها حذف کنید، چون `ng build` پشتیبانی SSR یکپارچه دارد.

```shell

ng build

```

## شروع development server

development server به‌صورت خودکار build system جدید را detect می‌کند و از آن برای build کردن application استفاده می‌کند.
برای شروع development server، هیچ تغییری در configuration مربوط به builder `dev-server` یا command line لازم نیست.

```shell

ng serve

```

می‌توانید همچنان از [command line optionهایی](/cli/serve) که قبلاً با development server استفاده می‌کردید استفاده کنید.

HELPFUL: با development server ممکن است هنگام startup یک Flash of Unstyled Content کوچک یا FOUC ببینید، چون server initialize می‌شود.
development server تلاش می‌کند processing stylesheetها را تا اولین استفاده defer کند تا rebuild timeها بهتر شوند.
این اتفاق در buildهای خارج از development server رخ نمی‌دهد.

### Hot module replacement

Hot Module Replacement یا HMR تکنیکی است که development serverها استفاده می‌کنند تا وقتی فقط بخشی از application تغییر کرده، لازم نباشد کل page reload شود.
در بسیاری از موارد، تغییرات می‌توانند بلافاصله در browser نمایش داده شوند و این موضوع edit/refresh cycle را هنگام توسعه application بهتر می‌کند.
هرچند hot module replacement عمومی مبتنی بر JavaScript یا HMR در حال حاضر پشتیبانی نمی‌شود، چند شکل مشخص‌تر از HMR در دسترس است:

- **global stylesheet** یعنی build option مربوط به `styles`
- **component stylesheet** به‌صورت inline و file-based
- **component template** به‌صورت inline و file-based

قابلیت‌های HMR به‌صورت خودکار enabled هستند و برای استفاده به تغییر code یا configuration نیاز ندارند.
Angular برای component styleها و templateهای file-based یعنی `templateUrl`/`styleUrl`/`styleUrls` و inline یعنی `template`/`styles` از HMR پشتیبانی می‌کند.
وقتی build system تشخیص دهد تغییر فقط stylesheet است، تلاش می‌کند حداقل مقدار لازم از application code را compile و process کند.

اگر ترجیح می‌دهید، می‌توانید قابلیت‌های HMR را با تنظیم option مربوط به `hmr` در development server روی `false` disable کنید.
این مقدار از command line هم قابل تغییر است:

```shell

ng serve --no-hmr

```

### Vite به‌عنوان development server

استفاده از Vite در Angular CLI در حال حاضر فقط در ظرفیت _development server_ است. حتی بدون استفاده از build system زیرین Vite، خود Vite یک development server کامل با client side support فراهم می‌کند که در یک package کم‌dependency npm bundle شده است. همین موضوع آن را گزینه‌ای ایده‌آل برای فراهم کردن functionality جامع development server می‌کند. process فعلی development server از build system جدید برای generate کردن development build مربوط به application در memory استفاده می‌کند و resultها را به Vite می‌دهد تا application را serve کند. استفاده از Vite، درست مثل development server مبتنی بر Webpack، داخل builder مربوط به `dev-server` در Angular CLI encapsulate شده و در حال حاضر نمی‌تواند مستقیم configure شود.

### Prebundling

Prebundling هنگام استفاده از development server، build و rebuild timeها را بهتر می‌کند.
Vite قابلیت‌های [prebundling](https://vite.dev/guide/dep-pre-bundling) فراهم می‌کند که هنگام استفاده از Angular CLI به‌صورت پیش‌فرض enabled هستند.
process مربوط به prebundling همه dependencyهای third-party project را داخل یک project analyze و وقتی development server برای اولین بار اجرا می‌شود process می‌کند.
این process نیاز به rebuild و bundle کردن dependencyهای project را در هر rebuild یا هر بار اجرای development server حذف می‌کند.

در بیشتر موارد، customization اضافه‌ای لازم نیست. با این حال، بعضی وضعیت‌ها که ممکن است به آن نیاز داشته باشند شامل این مواردند:

- سفارشی‌سازی loader behavior برای importهای داخل dependency، مثل option مربوط به [`loader`](#file-extension-loader-customization)
- symlink کردن یک dependency به local code برای development، مثل [`npm link`](https://docs.npmjs.com/cli/v10/commands/npm-link)
- دور زدن errorی که هنگام prebundling یک dependency رخ داده است

در صورت نیاز project، process مربوط به prebundling می‌تواند کاملاً disabled شود یا dependencyهای مشخصی می‌توانند exclude شوند.
option مربوط به `prebundle` در builder مربوط به `dev-server` برای این customizationها قابل استفاده است.
برای exclude کردن dependencyهای مشخص، option مربوط به `prebundle.exclude` در دسترس است:

```json
    "serve": {
      "builder": "@angular/build:dev-server",
      "options": {
        "prebundle": {
          "exclude": ["some-dep"]
        }
      },
```

به‌صورت پیش‌فرض، `prebundle` روی `true` است اما می‌تواند روی `false` تنظیم شود تا prebundling کاملاً disabled شود.
با این حال، exclude کردن dependencyهای مشخص توصیه می‌شود، چون با disabled شدن prebundling، rebuild timeها افزایش پیدا می‌کنند.

```json
    "serve": {
      "builder": "@angular/build:dev-server",
      "options": {
        "prebundle": false
      },
```

## Featureهای جدید

یکی از benefitهای اصلی application build system، سرعت بهتر build و rebuild است.
اما application build system جدید featureهای اضافه‌ای هم دارد که در builder مربوط به `browser` وجود ندارند.

IMPORTANT: featureهای جدید builder مربوط به `application` که اینجا توضیح داده شده‌اند، به‌صورت پیش‌فرض با builder تست `karma` incompatible هستند، چون این builder در داخل از builder مربوط به `browser` استفاده می‌کند.
کاربرها می‌توانند با تنظیم option مربوط به `builderMode` روی `application` برای builder مربوط به `karma`، opt in کنند تا از builder مربوط به `application` استفاده شود.
این option در حال حاضر در developer preview است.
اگر issueای دیدید، لطفاً آن را [اینجا](https://github.com/angular/angular-cli/issues) گزارش کنید.

### Build-time value replacement با `define`

option مربوط به `define` اجازه می‌دهد identifierهای موجود در code در build time با مقدار دیگری replace شوند.
این behavior شبیه Webpack `DefinePlugin` است که قبلاً همراه بعضی custom Webpack configurationها و third-party builderها استفاده می‌شد.
این option می‌تواند هم داخل فایل configuration مربوط به `angular.json` و هم در command line استفاده شود.
Configure کردن `define` داخل `angular.json` برای caseهایی مفید است که valueها constant هستند و می‌توانند در source control check in شوند.

داخل configuration file، این option به‌شکل object است.
keyهای object نماینده identifierی هستند که باید replace شود و valueهای object نماینده replacement value متناظر برای آن identifier هستند.
مثال:

```json
  "build": {
    "builder": "@angular/build:application",
    "options": {
      ...
      "define": {
          "SOME_NUMBER": "5",
          "ANOTHER": "'this is a string literal, note the extra single quotes'",
          "REFERENCE": "globalThis.someValue.noteTheAbsentSingleQuotes"
      }
    }
  }
```

HELPFUL: همه replacement valueها در configuration file به‌صورت string تعریف می‌شوند.
اگر replacement قرار است یک string literal واقعی باشد، باید داخل single quote قرار بگیرد.
این کار flexibility استفاده از هر JSON type معتبر و همچنین یک identifier متفاوت را به‌عنوان replacement فراهم می‌کند.

استفاده از command line برای valueهایی ترجیح داده می‌شود که ممکن است در هر build execution تغییر کنند، مثل git commit hash یا environment variable.
CLI مقدارهای `--define` از command line را با مقدارهای `define` از `angular.json` merge می‌کند و هر دو را در build شامل می‌کند.
اگر identifier یکسانی در هر دو وجود داشته باشد، command line precedence دارد.
برای استفاده در command line، option مربوط به `--define` از format مربوط به `IDENTIFIER=VALUE` استفاده می‌کند.

```shell
ng build --define SOME_NUMBER=5 --define "ANOTHER='these will overwrite existing'"
```

Environment variableها هم می‌توانند به‌صورت انتخابی در build include شوند.
برای shellهای غیر Windows، در صورت تمایل می‌توان quoteهای اطراف hash literal را مستقیماً escape کرد.
این مثال یک shell شبیه bash را فرض می‌کند، اما behavior مشابه برای shellهای دیگر هم در دسترس است.

```shell
export MY_APP_API_HOST="http://example.com"
export API_RETRY=3
ng build --define API_HOST=\'$MY_APP_API_HOST\' --define API_RETRY=$API_RETRY
```

در هر دو روش استفاده، TypeScript باید از typeهای identifierها آگاه باشد تا از type-checking error هنگام build جلوگیری شود.
این کار با یک type definition file اضافه داخل application source code، مثلاً `src/types.d.ts`، با محتوایی شبیه زیر انجام می‌شود:

```ts
declare const SOME_NUMBER: number;
declare const ANOTHER: string;
declare const GIT_HASH: string;
declare const API_HOST: string;
declare const API_RETRY: number;
```

Default project configuration از قبل طوری setup شده که از هر type definition file موجود در project source directoryها استفاده کند.
اگر TypeScript configuration مربوط به project تغییر کرده باشد، ممکن است لازم باشد adjust شود تا به این type definition file تازه اضافه‌شده reference بدهد.

IMPORTANT: این option identifierهایی را که داخل Angular metadata قرار دارند، مثل decorator مربوط به Component یا Directive، replace نمی‌کند.

### File extension loader customization

IMPORTANT: این feature فقط با builder مربوط به `application` در دسترس است.

بعضی projectها ممکن است نیاز داشته باشند کنترل کنند همه فایل‌هایی که extension مشخصی دارند چطور load و داخل application bundle شوند.
هنگام استفاده از builder مربوط به `application`، می‌توانید از option مربوط به `loader` برای مدیریت این caseها استفاده کنید.
این option به project اجازه می‌دهد نوع loader مورد استفاده برای یک file extension مشخص را تعریف کند.
بعد از آن، فایلی با extension تعریف‌شده می‌تواند از طریق import statement یا dynamic import expression داخل application code استفاده شود.
loaderهای موجود عبارت‌اند از:

- `text` - content را به‌عنوان یک `string` و default export inline می‌کند
- `binary` - content را به‌عنوان یک `Uint8Array` و default export inline می‌کند
- `file` - فایل را در application output path emit می‌کند و runtime location فایل را به‌عنوان default export فراهم می‌کند
- `dataurl` - content را به‌عنوان یک [data URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) inline می‌کند.
- `base64` - content را به‌عنوان string کدشده با Base64 inline می‌کند.
- `empty` - content را empty در نظر می‌گیرد و آن را در bundleها include نمی‌کند

مقدار `empty`، با اینکه کمتر رایج است، می‌تواند برای compatibility با third-party libraryهایی مفید باشد که ممکن است import usage مخصوص bundler داشته باشند و لازم باشد حذف شود.
یک case برای این موضوع side-effect importهای CSS fileهاست، مثل `import 'my.css';`، که در browser اثری ندارد.
در عوض، project می‌تواند از `empty` استفاده کند و سپس CSS fileها را به build option مربوط به `styles` اضافه کند یا از روش injection دیگری استفاده کند.

option مربوط به loader یک object-based option است که keyهای آن برای تعریف file extension و valueهای آن برای تعریف loader type استفاده می‌شوند.

مثالی از استفاده build option برای inline کردن content فایل‌های SVG داخل bundled application:

```json
  "build": {
    "builder": "@angular/build:application",
    "options": {
      ...
      "loader": {
        ".svg": "text"
      }
    }
  }
```

بعد از آن می‌توان یک SVG file را import کرد:

```ts
import contents from './some-file.svg';

console.log(contents); // <svg>...</svg>
```

علاوه بر این، TypeScript باید از module type مربوط به import آگاه باشد تا از type-checking error هنگام build جلوگیری شود. این کار با یک type definition file اضافه داخل application source code، مثلاً `src/types.d.ts`، با محتوای زیر یا مشابه آن انجام می‌شود:

```ts
declare module '*.svg' {
  const content: string;
  export default content;
}
```

Default project configuration از قبل طوری setup شده که از هر type definition file، یعنی فایل‌های `.d.ts`، موجود در project source directoryها استفاده کند. اگر TypeScript configuration مربوط به project تغییر کرده باشد، ممکن است لازم باشد tsconfig adjust شود تا به این type definition file تازه اضافه‌شده reference بدهد.

### Import attribute loader customization

برای caseهایی که فقط بعضی فایل‌های مشخص باید به روش خاصی load شوند، کنترل loading behavior به‌صورت per file در دسترس است.
این کار با یک [import attribute](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with) به نام `loader` انجام می‌شود که می‌تواند هم با import statementها و هم expressionها استفاده شود.
وجود import attribute نسبت به همه loading behaviorهای دیگر precedence دارد، از جمله JS/TS و هر مقدار build option مربوط به `loader`.
برای loading عمومی همه فایل‌های یک file type که در حالت عادی unsupported است، build option مربوط به [`loader`](#file-extension-loader-customization) توصیه می‌شود.

برای import attribute، مقدارهای loader زیر پشتیبانی می‌شوند:

- `text` - content را به‌عنوان یک `string` و default export inline می‌کند
- `binary` - content را به‌عنوان یک `Uint8Array` و default export inline می‌کند
- `file` - فایل را در application output path emit می‌کند و runtime location فایل را به‌عنوان default export فراهم می‌کند
- `dataurl` - content را به‌عنوان یک [data URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) inline می‌کند.
- `base64` - content را به‌عنوان string کدشده با Base64 inline می‌کند.

یک requirement اضافه برای استفاده از import attributeها این است که option مربوط به TypeScript یعنی `module` روی `esnext` تنظیم شود تا TypeScript بتواند application code را با موفقیت build کند.
وقتی `ES2025` داخل TypeScript در دسترس باشد، این تغییر دیگر لازم نخواهد بود.

در حال حاضر TypeScript از type definitionهایی که بر اساس مقدار import attribute باشند پشتیبانی نمی‌کند.
استفاده از `@ts-expect-error`/`@ts-ignore` یا استفاده از type definition fileهای جداگانه، با فرض اینکه فایل فقط با همان loader attribute import می‌شود، در حال حاضر لازم است.
برای مثال، یک SVG file می‌تواند به‌صورت text import شود:

```ts
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import contents from './some-file.svg' with {loader: 'text'};
```

همین کار با یک import expression داخل async function هم قابل انجام است.

```ts
async function loadSvg(): Promise<string> {
  // @ts-expect-error TypeScript cannot provide types based on attributes yet
  return import('./some-file.svg', {with: {loader: 'text'}}).then((m) => m.default);
}
```

برای import expression، مقدار `loader` باید string literal باشد تا بتواند static analysis شود.
اگر مقدار string literal نباشد warning صادر می‌شود.

loader مربوط به `file` وقتی مفید است که فایل در runtime از طریق `fetch()`، تنظیم روی `src` مربوط به image elementها، یا روش مشابه دیگری load شود.

```ts
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import imagePath from './image.webp' with {loader: 'file'};

console.log(imagePath); // media/image-ULK2SIIB.webp
```

loader مربوط به `base64` وقتی مفید است که یک فایل باید مستقیماً به‌عنوان encoded string داخل bundle embed شود تا بعداً برای ساخت Data URL استفاده شود.

```ts
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import logo from './logo.png' with {loader: 'base64'};

console.log(logo); // "iVBORw0KGgoAAAANSUhEUgAA..."
```

loader مربوط به `dataurl` برای inline کردن assetها به‌صورت Data URL کامل است.

```ts
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import icon from './icon.svg' with {loader: 'dataurl'};

console.log(icon); // "data:image/svg+xml;..."
```

برای production buildها، همان‌طور که در code comment بالا نشان داده شده، hashing به‌صورت خودکار برای long-term caching به path اضافه می‌شود.

HELPFUL: هنگام استفاده از development server و import کردن یک فایل از Node.js package با attribute مربوط به `loader`، آن package باید از prebundling از طریق option مربوط به `prebundle` در development server exclude شود.

### Import/export conditionها

Projectها ممکن است نیاز داشته باشند بعضی import pathها را بر اساس نوع build به فایل‌های متفاوت map کنند.
این قابلیت به‌خصوص برای caseهایی مفید است مثل اینکه `ng serve` لازم باشد از کد مخصوص debug/development استفاده کند، اما `ng build` لازم باشد از کدی بدون feature یا information مربوط به development استفاده کند.
چند [condition](https://nodejs.org/api/packages.html#community-conditions-definitions) مربوط به import/export به‌صورت خودکار اعمال می‌شوند تا از این نیازهای project پشتیبانی شود:

- برای buildهای optimized، condition مربوط به `production` enabled است.
- برای buildهای non-optimized، condition مربوط به `development` enabled است.
- برای browser output code، condition مربوط به `browser` enabled است.

یک optimized build بر اساس مقدار option مربوط به `optimization` تشخیص داده می‌شود.
وقتی `optimization` روی `true` تنظیم شود، یا مشخص‌تر اگر `optimization.scripts` روی `true` باشد، build به‌عنوان optimized در نظر گرفته می‌شود.
این classification هم برای `ng build` و هم `ng serve` اعمال می‌شود.
در یک project جدید، `ng build` به‌صورت پیش‌فرض optimized است و `ng serve` به‌صورت پیش‌فرض non-optimized.

یک روش مفید برای استفاده از این conditionها داخل application code ترکیب آن‌ها با [subpath imports](https://nodejs.org/api/packages.html#subpath-imports) است.
با استفاده از import statement زیر:

```ts
import {verboseLogging} from '#logger';
```

فایل می‌تواند در فیلد `imports` داخل `package.json` switch شود:

```json
{
  ...
  "imports": {
    "#logger": {
      "development": "./src/logging/debug.ts",
      "default": "./src/logging/noop.ts"
    }
  }
}
```

برای applicationهایی که از SSR هم استفاده می‌کنند، browser و server code می‌توانند با استفاده از condition مربوط به `browser` switch شوند:

```json
{
  ...
  "imports": {
    "#crashReporter": {
      "browser": "./src/browser-logger.ts",
      "default": "./src/server-logger.ts"
    }
  }
}
```

این conditionها همچنین روی Node.js packageها و هر [`exports`](https://nodejs.org/api/packages.html#conditional-exports) تعریف‌شده داخل packageها اعمال می‌شوند.

HELPFUL: اگر در حال حاضر از build option مربوط به `fileReplacements` استفاده می‌کنید، این feature ممکن است بتواند جایگزین آن شود.

## Known Issues

در حال حاضر چند known issue وجود دارد که ممکن است هنگام امتحان کردن build system جدید با آن‌ها روبه‌رو شوید. این list به‌روزرسانی می‌شود تا current بماند. اگر هرکدام از این issueها فعلاً مانع امتحان کردن build system جدید برای شماست، در آینده دوباره بررسی کنید، چون ممکن است حل شده باشد.

### Type-checking کد Web Worker و پردازش Web Workerهای nested

Web Workerها می‌توانند داخل application code با همان syntax استفاده شوند، یعنی `new Worker(new URL('<workerfile>', import.meta.url))`، که با builder مربوط به `browser` پشتیبانی می‌شود.
با این حال، کد داخل Worker در حال حاضر توسط TypeScript compiler type-check نمی‌شود. TypeScript code پشتیبانی می‌شود، فقط type-check نمی‌شود.
علاوه بر این، workerهای nested توسط build system پردازش نمی‌شوند. nested worker یعنی Worker instantiation داخل یک Worker file دیگر.

### ESM default importها در برابر namespace importها

TypeScript به‌صورت پیش‌فرض اجازه می‌دهد default exportها به‌عنوان namespace import وارد شوند و سپس در call expressionها استفاده شوند.
متأسفانه این یک divergence از ECMAScript specification است.
bundler زیرین، یعنی `esbuild`، داخل build system جدید انتظار دارد ESM code مطابق specification باشد.
اگر application شما از نوع نادرستی از import برای یک package استفاده کند، build system حالا warning generate می‌کند.
با این حال، برای اینکه TypeScript استفاده درست را بپذیرد، یک TypeScript option باید داخل فایل `tsconfig` مربوط به application enabled شود.
وقتی enabled باشد، option مربوط به [`esModuleInterop`](https://www.typescriptlang.org/tsconfig#esModuleInterop) alignment بهتری با ECMAScript specification فراهم می‌کند و توسط تیم TypeScript هم توصیه می‌شود.
بعد از enabled کردن آن، می‌توانید importهای package را در صورت نیاز به شکل conformant با ECMAScript update کنید.

با استفاده از package مربوط به [`moment`](https://npmjs.com/package/moment) به‌عنوان مثال، application code زیر باعث runtime error می‌شود:

```ts
import * as moment from 'moment';

console.log(moment().format());
```

Build یک warning generate می‌کند تا به شما اطلاع دهد problem احتمالی وجود دارد. warning شبیه این خواهد بود:

```text
▲ [WARNING] Calling "moment" will crash at run-time because it's an import namespace object, not a function [call-import-namespace]

    src/main.ts:2:12:
      2 │ console.log(moment().format());
        ╵             ~~~~~~

Consider changing "moment" to a default import instead:

    src/main.ts:1:7:
      1 │ import * as moment from 'moment';
        │        ~~~~~~~~~~~
        ╵        moment

```

اما می‌توانید با enable کردن TypeScript option مربوط به `esModuleInterop` برای application و تغییر import به شکل زیر، از runtime errorها و warning جلوگیری کنید:

```ts
import moment from 'moment';

console.log(moment().format());
```

### Importهای side-effectful وابسته به ترتیب در lazy moduleها

Import statementهایی که به ترتیب مشخصی وابسته‌اند و همچنین در چند lazy module استفاده می‌شوند، می‌توانند باعث شوند top-level statementها خارج از ترتیب اجرا شوند.
این مورد رایج نیست، چون به استفاده از side-effectful moduleها وابسته است و به option مربوط به `polyfills` مربوط نمی‌شود.
علت آن یک [defect](https://github.com/evanw/esbuild/issues/399) در bundler زیرین است، اما در update آینده address خواهد شد.

IMPORTANT: پرهیز از استفاده از moduleهایی با non-local side effect، خارج از polyfillها، تا جای ممکن توصیه می‌شود، فارغ از اینکه از چه build systemی استفاده می‌کنید؛ و از همین issue مشخص هم جلوگیری می‌کند. moduleهایی با non-local side effect می‌توانند هم روی application size و هم runtime performance اثر منفی بگذارند.

### تغییرات output location

به‌صورت پیش‌فرض، بعد از build موفق توسط application builder، bundle داخل directory مربوط به `dist/<project-name>/browser` قرار می‌گیرد، به‌جای `dist/<project-name>` در builder مربوط به browser.
این ممکن است بعضی toolchainهایی را که به location قبلی تکیه دارند خراب کند. در این حالت، می‌توانید [output path را configure کنید](reference/configs/workspace-config#output-path-configuration) تا با نیازتان هماهنگ شود.

## Bug reportها

Issueها و feature requestها را در [GitHub](https://github.com/angular/angular-cli/issues) گزارش کنید.

لطفاً تا جای ممکن یک minimal reproduction ارائه دهید تا به تیم برای address کردن issueها کمک کند.
