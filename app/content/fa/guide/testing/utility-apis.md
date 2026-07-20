# Testing Utility APIها

NOTE: در حالی که این راهنما برای Vitest به‌روزرسانی می‌شود، بعضی توضیح‌ها و مثال‌های utility APIها فعلاً در context مربوط به Karma/Jasmine ارائه شده‌اند. ما فعالانه در حال آماده کردن معادل‌های Vitest و راهنمایی به‌روز، در موارد قابل اعمال، هستیم.

این صفحه مفیدترین قابلیت‌های testing در Angular را توضیح می‌دهد.

ابزارهای testing در Angular شامل `TestBed`، `ComponentFixture` و چند function هستند که محیط test را کنترل می‌کنند.
کلاس‌های [`TestBed`](#testbed-class-summary) و [`ComponentFixture`](#the-componentfixture) جداگانه پوشش داده شده‌اند.

این یک خلاصه از functionهای stand-alone است، به ترتیب کاربرد احتمالی:

| Function     | جزئیات                                                                                                                                                                                                                                                      |
| :----------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`inject`]   | یک یا چند service را از injector فعلی `TestBed` داخل یک test function inject می‌کند. نمی‌تواند serviceای را inject کند که توسط خود کامپوننت provide شده است. بحث مربوط به [debugElement.injector](guide/testing/components-scenarios#get-injected-services) را ببینید. |
| `getTestBed` | instance فعلی `TestBed` را می‌گیرد. معمولاً لازم نیست، چون static class methodهای کلاس `TestBed` معمولاً کافی هستند. instance مربوط به `TestBed` چند member کم‌استفاده را expose می‌کند که به عنوان static method در دسترس نیستند.         |

برای مدیریت سناریوهای asynchronous پیچیده یا testing برنامه‌های legacy مبتنی بر Zone.js، [راهنمای Zone.js Testing Utilities](guide/testing/zone-js-testing-utilities) را ببینید.

## خلاصه کلاس `TestBed`

کلاس `TestBed` یکی از ابزارهای اصلی testing در Angular است.
API آن نسبتاً بزرگ است و تا زمانی که آن را کم‌کم بررسی نکرده‌اید، می‌تواند گیج‌کننده باشد.
ابتدای این راهنما را اول بخوانید تا قبل از تلاش برای فهم کل API، مبانی را یاد بگیرید.

تعریف moduleای که به `configureTestingModule` پاس داده می‌شود، subsetای از propertyهای metadata مربوط به `@NgModule` است.

```ts
type TestModuleMetadata = {
  providers?: any[];
  declarations?: any[];
  imports?: any[];
  schemas?: Array<SchemaMetadata | any[]>;
};
```

هر override method یک `MetadataOverride<T>` می‌گیرد که `T` نوع metadata مناسب برای همان method است؛ یعنی parameter مربوط به یک `@NgModule`، `@Component`، `@Directive` یا `@Pipe`.

```ts
type MetadataOverride<T> = {
  add?: Partial<T>;
  remove?: Partial<T>;
  set?: Partial<T>;
};
```

API مربوط به `TestBed` از static class methodهایی تشکیل شده که یک instance _global_ از `TestBed` را update یا reference می‌کنند.

در داخل، همه static methodها methodهای instance فعلی `TestBed` در runtime را پوشش می‌دهند؛ همان instanceای که function مربوط به `getTestBed()` هم برمی‌گرداند.

متدهای `TestBed` را _داخل_ یک `beforeEach()` فراخوانی کنید تا پیش از هر test منفرد، شروع تازه‌ای داشته باشید.

مهم‌ترین static methodها، به ترتیب کاربرد احتمالی، این‌ها هستند.

| Methods                  | جزئیات                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `configureTestingModule` | testing shimها [محیط test اولیه](guide/testing) و یک testing module پیش‌فرض را ایجاد می‌کنند. testing module پیش‌فرض با declarativeهای پایه و چند جایگزین service در Angular که هر tester نیاز دارد configure شده است. <br /> برای دقیق‌تر کردن configuration مربوط به testing module برای مجموعه‌ای مشخص از testها، `configureTestingModule` را فراخوانی کنید و importها، declarationها \(کامپوننت‌ها، directiveها و pipeها\)، و providerها را اضافه یا حذف کنید.                                                                                               |
| `compileComponents`      | بعد از تمام شدن configuration، testing module را به صورت asynchronous compile می‌کند. اگر _هر کدام_ از کامپوننت‌های testing module resourceهایی داشته باشند که asynchronous load می‌شوند، مثل blockهای @defer، **باید** این method را فراخوانی کنید. <br /> پس از فراخوانی `compileComponents`، configuration مربوط به `TestBed` برای مدت spec فعلی freeze می‌شود.                                                                                                                                                                                                                 |
| `createComponent<T>`     | بر اساس configuration فعلی `TestBed`، یک instance از کامپوننتی با type مربوط به `T` ایجاد می‌کند. پس از فراخوانی `createComponent`، configuration مربوط به `TestBed` برای مدت spec فعلی freeze می‌شود.                                                                                                                                                                                                                                                                                                                                                 |
| `overrideComponent`      | metadata مربوط به کلاس کامپوننت داده‌شده را جایگزین می‌کند؛ حتی اگر آن کامپوننت در عمق یک inner module قرار گرفته باشد.                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `overrideDirective`      | metadata مربوط به کلاس directive داده‌شده را جایگزین می‌کند؛ حتی اگر آن directive در عمق یک inner module قرار گرفته باشد.                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `overridePipe`           | metadata مربوط به کلاس pipe داده‌شده را جایگزین می‌کند؛ حتی اگر آن pipe در عمق یک inner module قرار گرفته باشد.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `overrideModule`         | metadata مربوط به `NgModule` داده‌شده را جایگزین می‌کند. به یاد داشته باشید moduleها می‌توانند moduleهای دیگر را import کنند. متد `overrideModule` می‌تواند به عمق testing module فعلی برود و یکی از این inner moduleها را تغییر دهد.                                                                                                                                                                                                                                                                                                                                              |
| `inject`                 | یک service را از injector فعلی `TestBed` می‌گیرد. function مربوط به `inject` اغلب برای این هدف کافی است. اما اگر نتواند service را provide کند، خطا می‌دهد. <br /> اگر service اختیاری باشد چه؟ <br /> متد `TestBed.inject()` یک parameter دوم اختیاری می‌گیرد؛ objectای که اگر Angular نتواند provider را پیدا کند برگردانده می‌شود \(`null` در این مثال\): `expect(TestBed.inject(NotProvided, null)).toBeNull();` پس از فراخوانی `TestBed.inject`، configuration مربوط به `TestBed` برای مدت spec فعلی freeze می‌شود. |
| `initTestEnvironment`    | محیط testing را برای کل اجرای test مقداردهی اولیه می‌کند. <br /> testing shimها این کار را برای شما انجام می‌دهند، بنابراین به ندرت دلیلی دارید خودتان آن را فراخوانی کنید. <br /> این method را _دقیقاً یک بار_ فراخوانی کنید. برای تغییر این پیش‌فرض در میانه اجرای test، اول `resetTestEnvironment` را فراخوانی کنید. <br /> Angular compiler factory، یک `PlatformRef` و یک testing module پیش‌فرض Angular را مشخص کنید. گزینه‌های جایگزین برای platformهای غیرمرورگری به شکل کلی `@angular/platform-<platform_name>/testing/<platform_name>` در دسترس هستند.                   |
| `resetTestEnvironment`   | محیط test اولیه، از جمله testing module پیش‌فرض را reset می‌کند.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

چند مورد از instance methodهای `TestBed` توسط static methodهای _کلاس_ `TestBed` پوشش داده نمی‌شوند.
این‌ها به ندرت لازم می‌شوند.

## `ComponentFixture`

`TestBed.createComponent<T>` یک instance از کامپوننت `T` ایجاد می‌کند و یک `ComponentFixture` strongly typed برای آن کامپوننت برمی‌گرداند.

propertyها و methodهای `ComponentFixture` دسترسی به کامپوننت، نمایش DOM آن، و جنبه‌هایی از محیط Angular آن را فراهم می‌کنند.

### propertyهای `ComponentFixture`

مهم‌ترین propertyها برای testerها، به ترتیب کاربرد احتمالی، این‌ها هستند.

| Properties          | جزئیات                                                                                                                                                                                                                                                                                   |
| :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `componentInstance` | instance کلاس کامپوننت که توسط `TestBed.createComponent` ایجاد شده است.                                                                                                                                                                                                                 |
| `debugElement`      | `DebugElement` مرتبط با root element کامپوننت. <br /> `debugElement` هنگام test و debugging، insight درباره کامپوننت و element مربوط به DOM آن فراهم می‌کند. این property برای testerها حیاتی است. جالب‌ترین memberهای آن [پایین‌تر](#debugelement) پوشش داده شده‌اند. |
| `nativeElement`     | native DOM element در root کامپوننت.                                                                                                                                                                                                                                      |
| `changeDetectorRef` | `ChangeDetectorRef` مربوط به کامپوننت. <br /> `ChangeDetectorRef` زمانی بیشترین ارزش را دارد که کامپوننتی را test می‌کنید که method مربوط به `ChangeDetectionStrategy.OnPush` دارد یا change detection کامپوننت تحت کنترل برنامه‌نویسی‌شده شماست.                                          |

### methodهای `ComponentFixture`

methodهای _fixture_ باعث می‌شوند Angular taskهای مشخصی را روی component tree انجام دهد.
این methodها را فراخوانی کنید تا رفتار Angular را در پاسخ به action شبیه‌سازی‌شده کاربر trigger کنید.

مفیدترین methodها برای testerها این‌ها هستند.

| Methods             | جزئیات                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| :------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `detectChanges`     | یک cycle مربوط به change detection را برای کامپوننت trigger می‌کند. <br /> آن را فراخوانی کنید تا کامپوننت initialize شود \(این کار `ngOnInit` را فراخوانی می‌کند\) و بعد از اینکه کد test شما مقدارهای data-bound propertyهای کامپوننت را تغییر داد. Angular نمی‌تواند ببیند که شما `personComponent.name` را تغییر داده‌اید و تا زمانی که `detectChanges` را فراخوانی نکنید، binding مربوط به `name` را update نمی‌کند. <br /> پس از آن `checkNoChanges` را اجرا می‌کند تا تأیید کند update چرخه‌ای وجود ندارد، مگر اینکه به صورت `detectChanges(false)` فراخوانی شود؛ |
| `autoDetectChanges` | وقتی می‌خواهید fixture تغییرات را خودکار detect کند، این را روی `true` بگذارید. <br /> وقتی autodetect برابر `true` باشد، test fixture بلافاصله پس از ایجاد کامپوننت `detectChanges` را فراخوانی می‌کند. سپس به eventهای مرتبط zone گوش می‌دهد و متناسب با آن‌ها `detectChanges` را فراخوانی می‌کند. وقتی کد test شما مقدار propertyهای کامپوننت را مستقیم تغییر می‌دهد، احتمالاً هنوز باید `fixture.detectChanges` را فراخوانی کنید تا updateهای data binding trigger شوند. <br /> مقدار پیش‌فرض `false` است. testerهایی که کنترل دقیق روی رفتار test را ترجیح می‌دهند معمولاً آن را `false` نگه می‌دارند. |
| `checkNoChanges`    | یک اجرای change detection انجام می‌دهد تا مطمئن شود تغییر pending وجود ندارد. اگر وجود داشته باشد exception پرتاب می‌کند.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `isStable`          | اگر fixture در حال حاضر _stable_ باشد، `true` برمی‌گرداند. اگر taskهای async کامل‌نشده وجود داشته باشند، `false` برمی‌گرداند.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `whenStable`        | promiseای برمی‌گرداند که وقتی fixture stable شد resolve می‌شود. <br /> برای ادامه testing پس از کامل شدن activity asynchronous یا change detection asynchronous، به این promise وصل شوید. [whenStable](guide/testing/components-scenarios#whenstable) را ببینید.                                                                                                                                                                                                                                                                                                   |
| `destroy`           | destruction کامپوننت را trigger می‌کند.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

#### `DebugElement`

`DebugElement` insightهای مهمی درباره نمایش DOM کامپوننت فراهم می‌کند.

از `DebugElement` مربوط به root کامپوننت test که توسط `fixture.debugElement` برگردانده می‌شود، می‌توانید کل subtreeهای element و کامپوننت fixture را پیمایش \(و query\) کنید.

مفیدترین memberهای `DebugElement` برای testerها، با ترتیب تقریبی کاربرد، این‌ها هستند:

| Members               | جزئیات                                                                                                                                                                                                                                                                                                                                         |
| :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nativeElement`       | DOM element متناظر در مرورگر                                                                                                                                                                                                                                                                                                    |
| `query`               | فراخوانی `query(predicate: Predicate<DebugElement>)` اولین `DebugElement`ای را برمی‌گرداند که در هر عمقی از subtree با predicate match شود.                                                                                                                                                                                                    |
| `queryAll`            | فراخوانی `queryAll(predicate: Predicate<DebugElement>)` همه `DebugElement`هایی را برمی‌گرداند که در هر عمقی از subtree با predicate match شوند.                                                                                                                                                                                                          |
| `injector`            | host dependency injector. برای مثال، injector مربوط به instance کامپوننت root element.                                                                                                                                                                                                                                                      |
| `componentInstance`   | instance کامپوننت خود element، اگر داشته باشد.                                                                                                                                                                                                                                                                                            |
| `context`             | objectای که parent context را برای این element فراهم می‌کند. اغلب instance یک کامپوننت ancestor است که این element را کنترل می‌کند. <br /> وقتی یک element داخل block مربوط به `@for` تکرار می‌شود، context یک `RepeaterContext` است که property مربوط به `$implicit` آن مقدار row instance value است. برای مثال، `hero` در `@for(hero of heroes; ...)`. |
| `children`            | فرزندان مستقیم `DebugElement`. با پایین رفتن در `children`، tree را پیمایش کنید. `DebugElement` همچنین `childNodes` دارد؛ فهرستی از objectهای `DebugNode`. `DebugElement` از objectهای `DebugNode` مشتق می‌شود و معمولاً nodeهای بیشتری نسبت به elementها وجود دارند. testerها معمولاً می‌توانند plain nodeها را نادیده بگیرند.                                               |
| `parent`              | parent مربوط به `DebugElement`. اگر این root element باشد، null است.                                                                                                                                                                                                                                                                                    |
| `name`                | نام tag مربوط به element، اگر element باشد.                                                                                                                                                                                                                                                                                                      |
| `triggerEventHandler` | اگر listener متناظری در collection مربوط به `listeners` روی element وجود داشته باشد، event را با نامش trigger می‌کند. parameter دوم _event object_ مورد انتظار handler است. <br /> اگر event listener ندارد یا مشکل دیگری وجود دارد، فراخوانی `nativeElement.dispatchEvent(eventObject)` را در نظر بگیرید.                               |
| `listeners`           | callbackهایی که به propertyهای `@Output` کامپوننت و/یا propertyهای event روی element متصل شده‌اند.                                                                                                                                                                                                                                           |
| `providerTokens`      | tokenهای lookup برای injector این کامپوننت. شامل خود کامپوننت به علاوه tokenهایی است که کامپوننت در metadata مربوط به `providers` فهرست کرده است.                                                                                                                                                                                                    |
| `source`              | محل پیدا کردن این element در template مربوط به کامپوننت source.                                                                                                                                                                                                                                                                                    |
| `references`          | dictionaryای از objectهای مرتبط با template local variableها \(برای مثال، `#foo`\)، که با نام local variable key شده‌اند.                                                                                                                                                                                                                       |

متدهای `DebugElement.query(predicate)` و `DebugElement.queryAll(predicate)` یک predicate می‌گیرند که subtree مربوط به source element را برای `DebugElement`های matchشده فیلتر می‌کند.

predicate هر methodای است که یک `DebugElement` می‌گیرد و یک مقدار _truthy_ برمی‌گرداند.
مثال زیر همه `DebugElement`هایی را پیدا می‌کند که referenceای به یک template local variable به نام "content" دارند:

```ts
// Filter for DebugElements with a #content reference
const contentRefs = el.queryAll((de) => de.references['content']);
```

کلاس `By` در Angular سه static method برای predicateهای رایج دارد:

| Static method             | جزئیات                                                                    |
| :------------------------ | :------------------------------------------------------------------------- |
| `By.all`                  | همه elementها را برمی‌گرداند                                                        |
| `By.css(selector)`        | elementهایی را برمی‌گرداند که CSS selectorهای matchشده دارند                                |
| `By.directive(directive)` | elementهایی را برمی‌گرداند که Angular با instanceای از کلاس directive match کرده است |

```ts
// Can find DebugElement either by css selector or by directive
const h2 = fixture.debugElement.query(By.css('h2'));
const directive = fixture.debugElement.query(By.directive(Highlight));
```
