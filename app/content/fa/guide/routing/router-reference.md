# Router reference

بخش‌های زیر بعضی از conceptها و terminology اصلی router را برجسته می‌کنند.

## Router eventها

در طول هر navigation، `Router` از طریق property مربوط به `Router.events`، navigation event emit می‌کند.
این eventها در جدول زیر نشان داده شده‌اند.

| Router event                                              | Details                                                                                                                                                                |
| :-------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`NavigationStart`](api/router/NavigationStart)           | وقتی navigation شروع می‌شود trigger می‌شود.                                                                                                                           |
| [`RouteConfigLoadStart`](api/router/RouteConfigLoadStart) | قبل از اینکه `Router` یک route configuration را lazy load کند trigger می‌شود.                                                                                         |
| [`RouteConfigLoadEnd`](api/router/RouteConfigLoadEnd)     | بعد از اینکه یک route به‌صورت lazy loaded شده trigger می‌شود.                                                                                                         |
| [`RoutesRecognized`](api/router/RoutesRecognized)         | وقتی Router، URL را parse می‌کند و routeها شناخته می‌شوند trigger می‌شود.                                                                                             |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)         | وقتی Router، phase مربوط به Guards در routing را شروع می‌کند trigger می‌شود.                                                                                          |
| [`ChildActivationStart`](api/router/ChildActivationStart) | وقتی Router فعال‌سازی childهای یک route را شروع می‌کند trigger می‌شود.                                                                                                |
| [`ActivationStart`](api/router/ActivationStart)           | وقتی Router فعال‌سازی یک route را شروع می‌کند trigger می‌شود.                                                                                                         |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)             | وقتی Router، phase مربوط به Guards در routing را با موفقیت تمام می‌کند trigger می‌شود.                                                                                |
| [`ResolveStart`](api/router/ResolveStart)                 | وقتی Router، phase مربوط به Resolve در routing را شروع می‌کند trigger می‌شود.                                                                                         |
| [`ResolveEnd`](api/router/ResolveEnd)                     | وقتی Router، phase مربوط به Resolve در routing را با موفقیت تمام می‌کند trigger می‌شود.                                                                               |
| [`ChildActivationEnd`](api/router/ChildActivationEnd)     | وقتی Router فعال‌سازی childهای یک route را تمام می‌کند trigger می‌شود.                                                                                                |
| [`ActivationEnd`](api/router/ActivationEnd)               | وقتی Router فعال‌سازی یک route را تمام می‌کند trigger می‌شود.                                                                                                         |
| [`NavigationEnd`](api/router/NavigationEnd)               | وقتی navigation با موفقیت تمام می‌شود trigger می‌شود.                                                                                                                 |
| [`NavigationCancel`](api/router/NavigationCancel)         | وقتی navigation cancel می‌شود trigger می‌شود. این اتفاق می‌تواند وقتی رخ دهد که یک Route Guard در طول navigation مقدار false برگرداند، یا با برگرداندن `UrlTree` یا `RedirectCommand` redirect کند. |
| [`NavigationError`](api/router/NavigationError)           | وقتی navigation به‌خاطر یک error غیرمنتظره fail شود trigger می‌شود.                                                                                                   |
| [`Scroll`](api/router/Scroll)                             | یک scrolling event را نشان می‌دهد.                                                                                                                                    |

وقتی feature مربوط به `withDebugTracing` را فعال کنید، Angular این eventها را در console log می‌کند.

## Terminology مربوط به Router

در اینجا termهای کلیدی `Router` و معنای آن‌ها آمده است:

| Router part           | Details                                                                                                                                                                                                                                   |
| :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Router`              | Component مربوط به application را برای URL فعال نمایش می‌دهد. Navigation از یک component به component بعدی را مدیریت می‌کند.                                                                                                            |
| `provideRouter`       | Service providerهای لازم برای navigate کردن بین application viewها را فراهم می‌کند.                                                                                                                                                      |
| `RouterModule`        | یک NgModule جداگانه که service providerها و directiveهای لازم برای navigate کردن بین application viewها را فراهم می‌کند.                                                                                                                |
| `Routes`              | Arrayای از Routeها را تعریف می‌کند که هرکدام یک URL path را به یک component map می‌کنند.                                                                                                                                                 |
| `Route`               | مشخص می‌کند router باید بر اساس یک URL pattern چطور به یک component navigate کند. بیشتر routeها از یک path و یک component type تشکیل می‌شوند.                                                                                          |
| `RouterOutlet`        | Directive مربوط به \(`<router-outlet>`\) که مشخص می‌کند router کجا یک view را نمایش دهد.                                                                                                                                                |
| `RouterLink`          | Directive برای bind کردن یک HTML element قابل کلیک به یک route. کلیک روی elementای با directive مربوط به `routerLink` که به یک _string_ یا _link parameters array_ bind شده، navigation را trigger می‌کند.                              |
| `RouterLinkActive`    | Directive برای اضافه/حذف کردن classها از یک HTML element وقتی `routerLink` مرتبط روی آن element یا داخل آن active/inactive می‌شود. همچنین می‌تواند برای accessibility بهتر، `aria-current` مربوط به link فعال را تنظیم کند.          |
| `ActivatedRoute`      | Serviceای که برای هر route component فراهم می‌شود و اطلاعات مخصوص route مثل route parameterها، static data، resolve data، global query parameterها و global fragment را در خود دارد.                                                  |
| `RouterState`         | State فعلی router، شامل treeای از routeهای فعال فعلی همراه با methodهای کمکی برای پیمایش route tree.                                                                                                                                    |
| Link parameters array | Arrayای که router آن را به‌عنوان routing instruction تفسیر می‌کند. می‌توانید آن array را به یک `RouterLink` bind کنید یا آن را به‌عنوان argument به method مربوط به `Router.navigate` پاس بدهید.                                      |
| Routing component     | یک Angular component با `RouterOutlet` که viewها را بر اساس router navigationها نمایش می‌دهد.                                                                                                                                           |

## `<base href>`

Router برای navigation از [history.pushState](https://developer.mozilla.org/docs/Web/API/History_API/Working_with_the_History_API#adding_and_modifying_history_entries 'HTML5 browser history push-state') مرورگر استفاده می‌کند.
`pushState` به شما اجازه می‌دهد URL pathهای داخل application را سفارشی کنید؛ مثلا `localhost:4200/crisis-center`.
URLهای داخل application می‌توانند از URLهای server قابل تشخیص نباشند.

مرورگرهای مدرن HTML5 اولین مرورگرهایی بودند که از `pushState` پشتیبانی کردند، به همین دلیل بسیاری از افراد این URLها را URLهای "HTML5 style" می‌نامند.

HELPFUL: Navigation با HTML5 style حالت پیش‌فرض router است.
در بخش [LocationStrategy و browser URL styles](guide/routing/common-router-tasks#locationstrategy-and-browser-url-styles)، یاد می‌گیرید چرا HTML5 style ترجیح داده می‌شود، چطور behavior آن را تنظیم کنید، و در صورت نیاز چطور به style قدیمی‌تر hash \(`#`\) تغییر دهید.

برای اینکه `pushState` routing کار کند، باید یک element از نوع [`<base href>`](https://developer.mozilla.org/docs/Web/HTML/Element/base 'base href') به `index.html` مربوط به application اضافه کنید.
مرورگر هنگام ارجاع دادن به فایل‌های CSS، scriptها و imageها از مقدار `<base href>` برای prefix کردن relative URLها استفاده می‌کند.

Element مربوط به `<base>` را درست بعد از tag مربوط به `<head>` اضافه کنید.
اگر folder مربوط به `app`، application root باشد، همان‌طور که برای این application هست، مقدار `href` را در `index.html` به شکل زیر تنظیم کنید.

```html
<base href="/" />
```

### HTML5 URLها و `<base href>`

راهنماهای بعدی به بخش‌های مختلف یک URL اشاره می‌کنند.
این diagram نشان می‌دهد این بخش‌ها به چه چیزی اشاره دارند:

```text {hideCopy}
foo://example.com:8042/over/there?name=ferret#nose
\_/   \______________/\_________/ \_________/ \__/
 |           |            |            |        |
scheme    authority      path        query   fragment
```

هرچند router به‌صورت پیش‌فرض از style مربوط به [HTML5 pushState](https://developer.mozilla.org/docs/Web/API/History_API#Adding_and_modifying_history_entries 'Browser history push-state') استفاده می‌کند، باید آن strategy را با یک `<base href>` configure کنید.

روش پیشنهادی برای configure کردن strategy این است که یک tag از نوع [`<base href>`](https://developer.mozilla.org/docs/Web/HTML/Element/base 'base href') را در `<head>` فایل `index.html` اضافه کنید.

```angular-html
<base href="/" />
```

بدون آن tag، ممکن است مرورگر هنگام "deep linking" به داخل application نتواند resourceها \(imageها، CSS و scriptها\) را load کند.

ممکن است بعضی توسعه‌دهنده‌ها نتوانند element مربوط به `<base>` را اضافه کنند، شاید چون به `<head>` یا `index.html` دسترسی ندارند.

آن توسعه‌دهنده‌ها همچنان می‌توانند با انجام دو مرحله زیر از HTML5 URLها استفاده کنند:

1. مقدار مناسب `APP_BASE_HREF` را برای router فراهم کنید.
1. برای همه web resourceها، یعنی CSS، imageها، scriptها و فایل‌های template HTML، از root URLها \(URLهایی با `authority`\) استفاده کنید.
   - `path` مربوط به `<base href>` باید با "/" تمام شود، چون مرورگرها characterهای داخل `path` بعد از راست‌ترین "`/`" را نادیده می‌گیرند
   - اگر `<base href>` شامل بخش `query` باشد، `query` فقط زمانی استفاده می‌شود که `path` یک link در صفحه خالی باشد و `query` نداشته باشد.
     یعنی `query` داخل `<base href>` فقط هنگام استفاده از `HashLocationStrategy` لحاظ می‌شود.

   - اگر یک link در صفحه root URL باشد \(دارای `authority` باشد\)، `<base href>` استفاده نمی‌شود.
     به این ترتیب، `APP_BASE_HREF` دارای authority باعث می‌شود همه linkهایی که Angular می‌سازد مقدار `<base href>` را نادیده بگیرند.

   - Fragment داخل `<base href>` _هرگز_ persist نمی‌شود

برای اطلاعات کامل‌تر درباره اینکه `<base href>` چطور برای ساخت target URIها استفاده می‌شود، بخش مربوط به transform کردن referenceها را در [RFC](https://tools.ietf.org/html/rfc3986#section-5.2.2) ببینید.

### `HashLocationStrategy`

برای استفاده از `HashLocationStrategy`، مقدار `useHash: true` را در یک object به‌عنوان argument دوم `RouterModule.forRoot()` در `AppModule` فراهم کنید.

```ts
providers: [provideRouter(appRoutes, withHashLocation())];
```

وقتی از `RouterModule.forRoot` استفاده می‌کنید، این مورد با `useHash: true` در argument دوم configure می‌شود: `RouterModule.forRoot(routes, {useHash: true})`.
