# افزودن پشتیبانی harness برای محیط‌های testing بیشتر

## پیش از شروع

TIP: این راهنما فرض می‌کند قبلاً [راهنمای overview مربوط به component harnessها](guide/testing/component-harnesses-overview) را خوانده‌اید. اگر تازه با component harnessها کار می‌کنید، اول آن را بخوانید.

### چه زمانی افزودن پشتیبانی برای یک test environment منطقی است؟

برای استفاده از component harnessها در محیط‌های زیر، می‌توانید از دو محیط built-in مربوط به Angular CDK استفاده کنید:

- Unit testها
- End-to-end testهای WebDriver

برای استفاده از یک محیط testing پشتیبانی‌شده، [راهنمای ساخت harness برای کامپوننت‌های شما](guide/testing/creating-component-harnesses) را بخوانید.

در غیر این صورت، برای افزودن پشتیبانی از محیط‌های دیگر، باید تعریف کنید چطور با یک DOM element تعامل شود و تعامل‌های DOM در محیط شما چطور کار می‌کنند. برای یادگیری بیشتر ادامه دهید.

### نصب CDK

[Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories) مجموعه‌ای از primitiveهای رفتاری برای ساخت کامپوننت‌هاست. برای استفاده از component harnessها، ابتدا `@angular/cdk` را از npm نصب کنید. می‌توانید این کار را از terminal با Angular CLI انجام دهید:

```shell
ng add @angular/cdk
```

## ساخت implementation برای `TestElement`

هر test environment باید یک implementation برای `TestElement` تعریف کند. interface مربوط به `TestElement` یک نمایش environment-agnostic از DOM element است. این interface به harnessها اجازه می‌دهد بدون توجه به محیط underlying با DOM elementها تعامل کنند. چون بعضی محیط‌ها از تعامل synchronous با DOM elementها پشتیبانی نمی‌کنند \(مثلاً WebDriver\)، همه methodهای `TestElement` asynchronous هستند و یک `Promise` همراه با نتیجه operation برمی‌گردانند.

`TestElement` چندین method برای تعامل با DOM underlying ارائه می‌کند، مثل `blur()`، `click()`، `getAttribute()` و موارد دیگر. برای فهرست کامل methodها، [صفحه reference مربوط به TestElement API](/api/cdk/testing/TestElement) را ببینید.

interface مربوط به `TestElement` عمدتاً از methodهایی تشکیل شده که شبیه methodهای موجود روی `HTMLElement` هستند. methodهای مشابه در بیشتر محیط‌های test وجود دارند و همین موضوع implementation آن‌ها را نسبتاً ساده می‌کند. با این حال، هنگام پیاده‌سازی method مربوط به `sendKeys`، یک تفاوت مهم را در نظر داشته باشید: احتمالاً key codeهای enum مربوط به `TestKey` با key codeهای استفاده‌شده در test environment متفاوت هستند. نویسندگان environment باید mappingای از codeهای `TestKey` به codeهای استفاده‌شده در محیط testing خاص نگه دارند.

implementationهای [UnitTestElement](/api/cdk/testing/testbed/UnitTestElement) و [SeleniumWebDriverElement](/api/cdk/testing/selenium-webdriver/SeleniumWebDriverElement) در Angular CDK نمونه‌های خوبی از implementation این interface هستند.

## ساخت implementation برای `HarnessEnvironment`

نویسندگان test از `HarnessEnvironment` برای ساخت instanceهای component harness جهت استفاده در testها استفاده می‌کنند. `HarnessEnvironment` یک کلاس abstract است که برای ساخت یک subclass concrete برای محیط جدید باید extend شود. هنگام پشتیبانی از یک test environment جدید، یک subclass از `HarnessEnvironment` بسازید که implementationهای concrete برای همه memberهای abstract اضافه کند.

`HarnessEnvironment` یک generic type parameter دارد: `HarnessEnvironment<E>`. این parameter یعنی `E`، نوع raw element محیط را نشان می‌دهد. برای مثال، این parameter برای محیط‌های unit test برابر Element است.

methodهای abstract زیر باید پیاده‌سازی شوند:

| Method                                                       | توضیح                                                                                                                                                          |
| :----------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `abstract getDocumentRoot(): E`                              | root element محیط را می‌گیرد، مثل `document.body`.                                                                                                    |
| `abstract createTestElement(element: E): TestElement`        | برای raw element داده‌شده یک `TestElement` می‌سازد.                                                                                                                   |
| `abstract createEnvironment(element: E): HarnessEnvironment` | یک `HarnessEnvironment` با root در raw element داده‌شده می‌سازد.                                                                                                      |
| `abstract getAllRawElements(selector: string): Promise<E[]>` | همه raw elementهای زیر root element محیط را که با selector داده‌شده match می‌شوند می‌گیرد.                                                                  |
| `abstract forceStabilize(): Promise<void>`                   | یک `Promise` می‌گیرد که وقتی `NgZone` stable شد resolve می‌شود. علاوه بر آن، اگر قابل اعمال باشد، به `NgZone` می‌گوید stable شود، مثل فراخوانی `flush()` در یک test با `fakeAsync`. |
| `abstract waitForTasksOutsideAngular(): Promise<void>`       | یک `Promise` می‌گیرد که وقتی parent zone مربوط به `NgZone` stable شد resolve می‌شود.                                                                                           |

علاوه بر پیاده‌سازی methodهای missing، این کلاس باید راهی برای نویسندگان test فراهم کند تا instanceهای `ComponentHarness` را بگیرند. باید یک constructor به صورت protected تعریف کنید و یک static method به نام `loader` ارائه دهید که یک instance از `HarnessLoader` برمی‌گرداند. این کار به نویسندگان test اجازه می‌دهد کدی مثل `SomeHarnessEnvironment.loader().getHarness(...)` بنویسند. بسته به نیازهای محیط خاص، کلاس ممکن است چند static method مختلف ارائه کند یا نیاز داشته باشد argumentهایی پاس داده شوند. \(مثلاً method مربوط به `loader` روی `TestbedHarnessEnvironment` یک `ComponentFixture` می‌گیرد و کلاس static methodهای اضافی به نام `documentRootLoader` و `harnessForFixture` ارائه می‌کند\).

implementationهای [`TestbedHarnessEnvironment`](/api/cdk/testing/testbed/TestbedHarnessEnvironment) و [SeleniumWebDriverHarnessEnvironment](/api/cdk/testing/selenium-webdriver/SeleniumWebDriverHarnessEnvironment) در Angular CDK نمونه‌های خوبی از implementation این interface هستند.

## مدیریت auto change detection

برای پشتیبانی از APIهای `manualChangeDetection` و parallel، environment شما باید یک handler برای وضعیت auto change detection نصب کند.

وقتی environment شما می‌خواهد مدیریت وضعیت auto change detection را شروع کند، می‌تواند `handleAutoChangeDetectionStatus(handler)` را فراخوانی کند. function مربوط به handler یک `AutoChangeDetectionStatus` دریافت می‌کند که دو property دارد: `isDisabled` و `onDetectChangesNow()`. برای اطلاعات بیشتر، [صفحه reference مربوط به AutoChangeDetectionStatus API](/api/cdk/testing/AutoChangeDetectionStatus) را ببینید.
اگر environment شما می‌خواهد مدیریت وضعیت auto change detection را متوقف کند، می‌تواند `stopHandlingAutoChangeDetectionStatus()` را فراخوانی کند.
