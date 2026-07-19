# کارهای رایج دیگر در Routing

این راهنما چند کار رایج دیگر مرتبط با استفاده از Angular router در application شما را پوشش می‌دهد.

## گرفتن اطلاعات route

اغلب وقتی کاربر در application شما navigate می‌کند، می‌خواهید اطلاعاتی را از یک component به component دیگر پاس بدهید.
برای مثال، applicationای را در نظر بگیرید که یک shopping list از grocery itemها نمایش می‌دهد.
هر item در list یک `id` یکتا دارد.
برای edit کردن یک item، کاربران روی button مربوط به Edit کلیک می‌کنند و componentای به نام `EditGroceryItem` باز می‌شود.
می‌خواهید آن component، `id` مربوط به grocery item را بگیرد تا بتواند اطلاعات درست را به کاربر نمایش دهد.

برای پاس دادن این نوع اطلاعات به componentهای application خود، از route استفاده کنید.
برای این کار از feature مربوط به `withComponentInputBinding` همراه با `provideRouter` یا option مربوط به `bindToComponentInputs` در `RouterModule.forRoot` استفاده می‌کنید.

برای گرفتن اطلاعات از route:

<docs-workflow>

<docs-step title="اضافه کردن `withComponentInputBinding`">

Feature مربوط به `withComponentInputBinding` را به method مربوط به `provideRouter` اضافه کنید.

```ts
providers: [provideRouter(appRoutes, withComponentInputBinding())];
```

</docs-step>

<docs-step title="اضافه کردن یک `input` به component">

Component را به‌روزرسانی کنید تا یک property از نوع `input()` مطابق با نام parameter داشته باشد.

```ts
id = input.required<string>();
hero = computed(() => this.service.getHero(id()));
```

</docs-step>
<docs-step title="اختیاری: استفاده از مقدار پیش‌فرض">
وقتی `withComponentInputBinding` فعال باشد، router بر اساس route فعلی به همه inputها value assign می‌کند.
اگر هیچ route dataای با key مربوط به input match نباشد، مثلا وقتی یک query parameter اختیاری وجود ندارد، router مقدار `undefined` assign می‌کند.
وقتی احتمال دارد یک input با route match نشود، باید `undefined` را در type آن `input` لحاظ کنید.

با استفاده از option مربوط به `transform` روی input یا مدیریت local state با یک `linkedSignal`، مقدار پیش‌فرض فراهم کنید.

```ts
id = input.required({
  transform: (maybeUndefined: string | undefined) => maybeUndefined ?? '0',
});
// or
id = input<string | undefined>();
internalId = linkedSignal(() => this.id() ?? getDefaultId());
```

</docs-step>
</docs-workflow>

NOTE: می‌توانید همه route dataها را با key/value pair به component inputها bind کنید: static یا resolved route data، path parameterها، matrix parameterها و query parameterها.

### غیرفعال کردن query parameter binding

اگر query parameterها را جداگانه مدیریت می‌کنید، برای غیرفعال کردن query parameter binding از `ComponentInputBindingOptions` استفاده کنید:

```ts
provideRouter(appRoutes, withComponentInputBinding({queryParams: false}));
```

### Configure کردن رفتار برای inputهایی که در router data در دسترس نیستند

به‌صورت پیش‌فرض، اگر یک input در طول navigation در router data در دسترس نباشد، router مقدار آن را روی `undefined` تنظیم می‌کند. این کار مطمئن می‌شود stale data نگه داشته نمی‌شود.

اگر می‌خواهید برای inputهایی که _هرگز_ در router data برای active component instance در دسترس نبوده‌اند از تنظیم `undefined` جلوگیری کنید، می‌توانید option مربوط به `unmatchedInputBehavior` را روی `'undefinedIfStale'` بگذارید:

```ts
provideRouter(appRoutes, withComponentInputBinding({unmatchedInputBehavior: 'undefinedIfStale'}));
```

وقتی `unmatchedInputBehavior: 'undefinedIfStale'` را با `queryParams: false` ترکیب می‌کنید، inputها مقدارهای اولیه خود را نگه می‌دارند، مگر اینکه به‌صورت explicit توسط router فراهم شوند. استثنا matrix parameterها هستند: اگر یک matrix parameter در یک navigation فراهم شود و در navigation بعدی حذف شود، router برای جلوگیری از نگه‌داشتن stale data، input را روی `undefined` تنظیم می‌کند.

```ts
provideRouter(
  appRoutes,
  withComponentInputBinding({
    queryParams: false,
    unmatchedInputBehavior: 'undefinedIfStale',
  }),
);
```

### به ارث بردن data از route والد

به‌صورت پیش‌فرض، child routeها parameterها و data را از routeهای والد به ارث می‌برند؛ معادل `paramsInheritanceStrategy: 'always'`. یعنی می‌توانید مستقیما در child componentها به اطلاعات route والد دسترسی داشته باشید.

اگر لازم دارید رفتار legacy را برگردانید، که در آن parameterها فقط از routeهای با empty path به ارث می‌رسیدند، می‌توانید `paramsInheritanceStrategy` را روی `'emptyOnly'` تنظیم کنید:

```ts
provideRouter(routes, withRouterConfig({paramsInheritanceStrategy: 'emptyOnly'}));
```

برای جزئیات settingهای در دسترس دیگر، [router configuration options](guide/routing/customizing-route-behavior#router-configuration-options) را ببینید.

## نمایش صفحه 404

برای نمایش صفحه 404، یک [wildcard route](guide/routing/define-routes#wildcards) با property مربوط به `component` بسازید و componentای را که می‌خواهید برای صفحه 404 استفاده شود به آن بدهید:

```ts
const routes: Routes = [
  {path: 'first-component', component: First},
  {path: 'second-component', component: Second},
  {path: '**', component: PageNotFound}, // Wildcard route for a 404 page
];
```

آخرین route با `path` برابر `**` یک wildcard route است.
اگر URL درخواست‌شده با هیچ‌کدام از pathهای قبلی در list match نشود، router این route را انتخاب می‌کند و کاربر را به `PageNotFound` می‌فرستد.

## Array مربوط به link parameterها

یک link parameters array موارد زیر را برای router navigation در خود دارد:

- Path مربوط به route مقصد component
- Route parameterهای required و optional که وارد route URL می‌شوند

Directive مربوط به `RouterLink` را به چنین arrayای bind کنید:

```angular-html
<a [routerLink]="['/heroes']">Heroes</a>
```

نمونه زیر هنگام مشخص کردن route parameter، یک array دو elementی است:

```angular-html
<a [routerLink]="['/hero', hero.id]">
  <span class="badge">{{ hero.id }}</span
  >{{ hero.name }}
</a>
```

Route parameterهای اختیاری را در یک object فراهم کنید، مثل `{ foo: 'foo' }`:

```angular-html
<a [routerLink]="['/crisis-center', {foo: 'foo'}]">Crisis Center</a>
```

این syntax، matrix parameterها را پاس می‌دهد؛ parameterهای اختیاری‌ای که با یک URL segment مشخص مرتبط‌اند. درباره [matrix parameterها](/guide/routing/read-route-state#matrix-parameters) بیشتر یاد بگیرید.

این سه مثال نیازهای یک application با یک سطح routing را پوشش می‌دهند.
با این حال، با یک child router، مثل مورد crisis center، می‌توانید امکان‌های جدیدی برای link array بسازید.

نمونه حداقلی زیر از `RouterLink` بر اساس یک default child route مشخص برای crisis center ساخته شده است.

```angular-html
<a [routerLink]="['/crisis-center']">Crisis Center</a>
```

موارد زیر را مرور کنید:

- اولین item در array، route والد را مشخص می‌کند \(`/crisis-center`\)
- برای این route والد parameterی وجود ندارد
- برای child route مقدار پیش‌فرضی وجود ندارد، پس باید یکی را انتخاب کنید
- شما به `CrisisList` navigate می‌کنید که route path آن `/` است، اما لازم نیست slash را به‌صورت explicit اضافه کنید

Router link زیر را در نظر بگیرید که از root application به سمت Dragon Crisis navigate می‌کند:

```angular-html
<a [routerLink]="['/crisis-center', 1]">Dragon Crisis</a>
```

- اولین item در array، route والد را مشخص می‌کند \(`/crisis-center`\)
- برای این route والد parameterی وجود ندارد
- دومین item، child route مربوط به جزئیات یک crisis مشخص را تعیین می‌کند \(`/:id`\)
- Child route مربوط به details به یک route parameter از نوع `id` نیاز دارد
- `id` مربوط به Dragon Crisis را به‌عنوان دومین item در array اضافه کرده‌اید \(`1`\)
- Path نهایی `/crisis-center/1` است

همچنین می‌توانید template مربوط به `App` را فقط با routeهای Crisis Center دوباره تعریف کنید:

```angular-ts
@Component({
  template: `
    <h1 class="title">Angular Router</h1>
    <nav>
      <a [routerLink]="['/crisis-center']">Crisis Center</a>
      <a [routerLink]="['/crisis-center/1', {foo: 'foo'}]">Dragon Crisis</a>
      <a [routerLink]="['/crisis-center/2']">Shark Crisis</a>
    </nav>
    <router-outlet />
  `,
})
export class App {}
```

خلاصه اینکه می‌توانید applicationهایی با یک، دو یا چند سطح routing بنویسید.
Link parameters array انعطاف لازم را فراهم می‌کند تا هر عمق routing و هر sequence معتبر از route pathها، router parameterهای \(required\) و objectهای route parameter \(optional\) را نمایش دهید.

## `LocationStrategy` و styleهای URL مرورگر

وقتی router به یک component view جدید navigate می‌کند، location و history مرورگر را با URL مربوط به آن view به‌روزرسانی می‌کند.

مرورگرهای مدرن HTML5 از [history.pushState](https://developer.mozilla.org/docs/Web/API/History_API/Working_with_the_History_API#adding_and_modifying_history_entries 'HTML5 browser history push-state') پشتیبانی می‌کنند؛ تکنیکی که location و history مرورگر را بدون trigger کردن server page request تغییر می‌دهد.
Router می‌تواند یک URL «طبیعی» بسازد که از URLای که در حالت دیگر به page load نیاز داشت، قابل تشخیص نباشد.

این URL مربوط به Crisis Center در style مربوط به "HTML5 pushState" است:

```text
localhost:3002/crisis-center
```

مرورگرهای قدیمی‌تر وقتی location URL تغییر می‌کند، page request به server می‌فرستند، مگر اینکه تغییر بعد از یک "#" رخ دهد \(که "hash" نامیده می‌شود\).
Routerها می‌توانند از این exception استفاده کنند و URLهای route داخل application را با hash بسازند.
این یک "hash URL" است که به Crisis Center route می‌شود.

```text
localhost:3002/src/#/crisis-center
```

Router از هر دو style با دو provider مربوط به `LocationStrategy` پشتیبانی می‌کند:

| Providers              | Details                                  |
| :--------------------- | :--------------------------------------- |
| `PathLocationStrategy` | Style پیش‌فرض "HTML5 pushState".         |
| `HashLocationStrategy` | Style مربوط به "hash URL".              |

Function مربوط به `RouterModule.forRoot()`، `LocationStrategy` را روی `PathLocationStrategy` تنظیم می‌کند و آن را به strategy پیش‌فرض تبدیل می‌کند.
همچنین می‌توانید در طول فرایند bootstrapping، با یک override به `HashLocationStrategy` تغییر دهید.

HELPFUL: برای اطلاعات بیشتر درباره providerها و فرایند bootstrap، [Dependency Injection](guide/di/defining-dependency-providers) را ببینید.
