# استفاده از component harnessها در testها

## پیش از شروع

TIP: این راهنما فرض می‌کند قبلاً [راهنمای overview مربوط به component harnessها](guide/testing/component-harnesses-overview) را خوانده‌اید. اگر تازه با component harnessها کار می‌کنید، اول آن را بخوانید.

### نصب CDK

[Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories) مجموعه‌ای از primitiveهای رفتاری برای ساخت کامپوننت‌هاست. برای استفاده از component harnessها، ابتدا `@angular/cdk` را از npm نصب کنید. می‌توانید این کار را از terminal با Angular CLI انجام دهید:

```shell
ng add @angular/cdk
```

## محیط‌ها و loaderهای test harness

می‌توانید از component test harnessها در محیط‌های test مختلف استفاده کنید. Angular CDK دو محیط built-in را پشتیبانی می‌کند:

- Unit testها با `TestBed` در Angular
- End-to-end testها با [WebDriver](https://developer.mozilla.org/en-US/docs/Web/WebDriver)

هر محیط یک <strong>harness loader</strong> فراهم می‌کند. loader همان instanceهای harness را می‌سازد که در طول testهای خود استفاده می‌کنید. برای راهنمایی مشخص‌تر درباره محیط‌های testing پشتیبانی‌شده، بخش‌های زیر را ببینید.

محیط‌های testing دیگر به bindingهای سفارشی نیاز دارند. برای اطلاعات بیشتر، [راهنمای افزودن پشتیبانی harness برای محیط‌های testing دیگر](guide/testing/component-harnesses-testing-environments) را ببینید.

### استفاده از loader مربوط به `TestbedHarnessEnvironment` برای unit testها

برای unit testها می‌توانید از [TestbedHarnessEnvironment](/api/cdk/testing/testbed/TestbedHarnessEnvironment) یک harness loader بسازید. این محیط از یک [component fixture](api/core/testing/ComponentFixture) استفاده می‌کند که توسط `TestBed` در Angular ایجاد شده است.

برای ساخت یک harness loader که root آن root element مربوط به fixture باشد، از متد `loader()` استفاده کنید:

```ts
const fixture = TestBed.createComponent(MyComponent);

// Create a harness loader from the fixture
const loader = TestbedHarnessEnvironment.loader(fixture);
...

// Use the loader to get harness instances
const myComponentHarness = await loader.getHarness(MyComponent);
```

برای ساخت harness loader برای harnessهای elementهایی که بیرون از fixture قرار می‌گیرند، از متد `documentRootLoader()` استفاده کنید. برای مثال، کدی که یک floating element یا pop-up نمایش می‌دهد، اغلب DOM elementها را مستقیم به document body attach می‌کند؛ مثل service مربوط به `Overlay` در Angular CDK.

همچنین می‌توانید با `harnessForFixture()` مستقیماً برای harnessای در root element همان fixture یک harness loader بسازید.

### استفاده از loader مربوط به `SeleniumWebDriverHarnessEnvironment` برای end-to-end testها

برای end-to-end testهای مبتنی بر WebDriver می‌توانید با `SeleniumWebDriverHarnessEnvironment` یک harness loader بسازید.

از متد `loader()` استفاده کنید تا instance مربوط به harness loader را برای HTML document فعلی بگیرید؛ root آن root element مربوط به document است. این محیط از یک WebDriver client استفاده می‌کند.

```ts
let wd: webdriver.WebDriver = getMyWebDriverClient();
const loader = SeleniumWebDriverHarnessEnvironment.loader(wd);
...
const myComponentHarness = await loader.getHarness(MyComponent);
```

## استفاده از harness loader

instanceهای harness loader به یک DOM element مشخص مربوط هستند و برای ساخت instanceهای component harness برای elementهای زیر همان element مشخص استفاده می‌شوند.

برای گرفتن `ComponentHarness` مربوط به اولین instance از element، از متد `getHarness()` استفاده کنید. برای گرفتن همه instanceهای `ComponentHarness`، از متد `getAllHarnesses()` استفاده کنید.

```ts
// Get harness for first instance of the element
const myComponentHarness = await loader.getHarness(MyComponent);

// Get harnesses for all instances of the element
const myComponentHarnesses = await loader.getAllHarnesses(MyComponent);
```

علاوه بر `getHarness` و `getAllHarnesses`، `HarnessLoader` چند متد مفید دیگر هم برای query کردن harnessها دارد:

- `getHarnessAtIndex(...)`: harness مربوط به کامپوننتی را می‌گیرد که در index مشخص با criteria داده‌شده match می‌شود.
- `countHarnesses(...)`: تعداد instanceهای کامپوننتی را می‌شمارد که با criteria داده‌شده match می‌شوند.
- `hasHarness(...)`: بررسی می‌کند آیا دست‌کم یک instance کامپوننت با criteria داده‌شده match می‌شود یا نه.

به عنوان مثال، یک کامپوننت dialog-button قابل‌استفاده مجدد را در نظر بگیرید که با click یک dialog باز می‌کند. این کامپوننت شامل کامپوننت‌های زیر است که هرکدام harness متناظر خودشان را دارند:

- `MyDialogButton` \(کامپوننت‌های `MyButton` و `MyDialog` را با یک API راحت compose می‌کند\)
- `MyButton` \(یک کامپوننت button استاندارد\)
- `MyDialog` \(dialogای که پس از click توسط `MyDialogButton` به `document.body` append می‌شود\)

test زیر harnessها را برای هرکدام از این کامپوننت‌ها load می‌کند:

```ts
let fixture: ComponentFixture<MyDialogButton>;
let loader: HarnessLoader;
let rootLoader: HarnessLoader;

beforeEach(() => {
  fixture = TestBed.createComponent(MyDialogButton);
  loader = TestbedHarnessEnvironment.loader(fixture);
  rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
});

it('loads harnesses', async () => {
  // Load a harness for the bootstrapped component with `harnessForFixture`
  dialogButtonHarness = await TestbedHarnessEnvironment.harnessForFixture(
    fixture,
    MyDialogButtonHarness,
  );

  // The button element is inside the fixture's root element, so we use `loader`.
  const buttonHarness = await loader.getHarness(MyButtonHarness);

  // Click the button to open the dialog
  await buttonHarness.click();

  // The dialog is appended to `document.body`, outside of the fixture's root element,
  // so we use `rootLoader` in this case.
  const dialogHarness = await rootLoader.getHarness(MyDialogHarness);

  // ... make some assertions
});
```

### رفتار harness در محیط‌های مختلف

Harnessها ممکن است در همه محیط‌ها دقیقاً یکسان رفتار نکنند. بعضی تفاوت‌ها بین تعامل واقعی کاربر و eventهای شبیه‌سازی‌شده‌ای که در unit testها تولید می‌شوند اجتناب‌ناپذیر است. Angular CDK تا حد ممکن تلاش می‌کند رفتار را normalize کند.

### تعامل با child elementها

برای تعامل با elementهای زیر root element همین harness loader، از instance مربوط به `HarnessLoader` برای یک child element استفاده کنید. برای اولین instance از child element، از متد `getChildLoader()` استفاده کنید. برای همه instanceهای child element، از متد `getAllChildLoaders()` استفاده کنید.

```ts
const myComponentHarness = await loader.getHarness(MyComponent);

// Get loader for first instance of child element with '.child' selector
const childLoader = await myComponentHarness.getLoader('.child');

// Get loaders for all instances of child elements with '.child' selector
const allChildLoaders = await myComponentHarness.getAllChildLoaders('.child');
```

### فیلتر کردن harnessها

وقتی یک صفحه چندین instance از یک کامپوننت خاص دارد، ممکن است بخواهید بر اساس بعضی propertyهای کامپوننت فیلتر کنید تا یک instance مشخص را بگیرید. برای این کار می‌توانید از یک <strong>harness predicate</strong> استفاده کنید؛ کلاسی که یک کلاس `ComponentHarness` را به predicate functionهایی وصل می‌کند که می‌توانند برای فیلتر کردن instanceهای کامپوننت استفاده شوند.

وقتی از یک `HarnessLoader` یک harness می‌خواهید، در واقع یک HarnessQuery فراهم می‌کنید. یک query می‌تواند یکی از دو چیز باشد:

- یک constructor مربوط به harness. این فقط همان harness را می‌گیرد.
- یک `HarnessPredicate` که harnessهایی را می‌گیرد که بر اساس یک یا چند condition فیلتر شده‌اند.

`HarnessPredicate` از چند فیلتر پایه \(selector، ancestor\) پشتیبانی می‌کند که روی هر چیزی که `ComponentHarness` را extend کند کار می‌کنند.

```ts
// Example of loading a MyButtonComponentHarness with a harness predicate
const disabledButtonPredicate = new HarnessPredicate(MyButtonComponentHarness, {
  selector: '[disabled]',
});
const disabledButton = await loader.getHarness(disabledButtonPredicate);
```

اما رایج است که harnessها یک متد static به نام `with()` پیاده‌سازی کنند که گزینه‌های filtering مخصوص کامپوننت را می‌گیرد و یک `HarnessPredicate` برمی‌گرداند.

```ts
// Example of loading a MyButtonComponentHarness with a specific selector
const button = await loader.getHarness(MyButtonComponentHarness.with({selector: 'btn'}));
```

برای جزئیات بیشتر به مستندات همان harness مشخص مراجعه کنید، چون گزینه‌های filtering اضافی مخصوص هر implementation از harness هستند.

## استفاده از APIهای test harness

هر harness یک API مخصوص کامپوننت متناظر خودش تعریف می‌کند، اما همه آن‌ها یک base class مشترک دارند: [ComponentHarness](/api/cdk/testing/ComponentHarness). این base class یک property static به نام `hostSelector` تعریف می‌کند که کلاس harness را با instanceهای کامپوننت در DOM match می‌کند.

فراتر از آن، API هر harness مشخص به کامپوننت متناظر آن وابسته است؛ برای یادگیری نحوه استفاده از یک harness مشخص، به مستندات همان کامپوننت مراجعه کنید.

به عنوان مثال، test زیر برای کامپوننتی است که از [harness مربوط به slider در Angular Material](https://material.angular.dev/components/slider/api#MatSliderHarness) استفاده می‌کند:

```ts
it('should get value of slider thumb', async () => {
  const slider = await loader.getHarness(MatSliderHarness);
  const thumb = await slider.getEndThumb();
  expect(await thumb.getValue()).toBe(50);
});
```

## Interop با change detection در Angular

به صورت پیش‌فرض، test harnessها پیش از خواندن state یک DOM element و پس از تعامل با یک DOM element، [change detection](/best-practices/runtime-performance) در Angular را اجرا می‌کنند.

ممکن است زمان‌هایی باشد که در testهای خود به کنترل دقیق‌تر روی change detection نیاز داشته باشید؛ مثلاً بررسی state یک کامپوننت وقتی یک عملیات async هنوز pending است. در این موارد از function مربوط به `manualChangeDetection` استفاده کنید تا مدیریت خودکار change detection برای یک block از کد غیرفعال شود.

```ts
it('checks state while async action is in progress', async () => {
  const buttonHarness = loader.getHarness(MyButtonHarness);
  await manualChangeDetection(async () => {
    await buttonHarness.click();
    fixture.detectChanges();
    // Check expectations while async click operation is in progress.
    expect(isProgressSpinnerVisible()).toBe(true);
    await fixture.whenStable();
    // Check expectations after async click operation complete.
    expect(isProgressSpinnerVisible()).toBe(false);
  });
});
```

تقریباً همه methodهای harness asynchronous هستند و یک `Promise` برمی‌گردانند تا موارد زیر را پشتیبانی کنند:

- پشتیبانی از unit testها
- پشتیبانی از end-to-end testها
- جدا کردن testها از تغییرات در رفتار asynchronous

تیم Angular توصیه می‌کند برای بهبود خوانایی test از [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) استفاده کنید. فراخوانی `await` اجرای test شما را تا زمانی که `Promise` مربوطه resolve شود block می‌کند.

گاهی ممکن است بخواهید چند action را هم‌زمان انجام دهید و به جای اجرای ترتیبی هر action، منتظر بمانید همه آن‌ها تمام شوند. برای مثال، چند property از یک کامپوننت را بخوانید. در این وضعیت‌ها از function مربوط به `parallel` برای parallel کردن operationها استفاده کنید. function مربوط به `parallel` شبیه `Promise.all` کار می‌کند، در حالی که checkهای change detection را هم optimize می‌کند.

```ts
it('reads properties in parallel', async () => {
  const checkboxHarness = loader.getHarness(MyCheckboxHarness);
  // Read the checked and intermediate properties simultaneously.
  const [checked, indeterminate] = await parallel(() => [
    checkboxHarness.isChecked(),
    checkboxHarness.isIndeterminate(),
  ]);
  expect(checked).toBe(false);
  expect(indeterminate).toBe(true);
});
```
