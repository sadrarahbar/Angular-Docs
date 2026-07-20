# مبانی testing کامپوننت‌ها

یک کامپوننت، برخلاف همه بخش‌های دیگر یک برنامه Angular، یک HTML template و یک کلاس TypeScript را با هم ترکیب می‌کند.
کامپوننت در واقع همان template و کلاس است که _با هم کار می‌کنند_.
برای test کردن درست یک کامپوننت، باید test کنید که این دو همان‌طور که انتظار دارید با هم کار می‌کنند.

این نوع testها نیاز دارند host element کامپوننت را در DOM مرورگر ایجاد کنید، همان‌طور که Angular انجام می‌دهد، و تعامل کلاس کامپوننت با DOM را بر اساس template آن بررسی کنید.

`TestBed` در Angular این نوع testing را ساده‌تر می‌کند؛ همان‌طور که در بخش‌های بعد می‌بینید.
اما در بسیاری از موارد، _test کردن فقط کلاس کامپوننت_، بدون دخالت DOM، می‌تواند بخش زیادی از رفتار کامپوننت را به شکلی ساده و روشن validate کند.

## Testing کامپوننت در DOM

کامپوننت چیزی بیشتر از کلاس خودش است.
کامپوننت با DOM و با کامپوننت‌های دیگر تعامل دارد.
کلاس‌ها به تنهایی نمی‌توانند به شما بگویند آیا کامپوننت درست render می‌شود، به ورودی و gestureهای کاربر پاسخ می‌دهد، یا با کامپوننت‌های parent و child خود integrate می‌شود یا نه.

- آیا `Lightswitch.clicked()` به چیزی bind شده است که کاربر بتواند آن را فراخوانی کند؟
- آیا `Lightswitch.message` نمایش داده می‌شود؟
- آیا کاربر واقعاً می‌تواند hero نمایش‌داده‌شده توسط کامپوننت `DashboardHero` را انتخاب کند؟
- آیا نام hero همان‌طور که انتظار می‌رود نمایش داده شده است \(مثلاً با حروف بزرگ\)؟
- آیا پیام خوشامدگویی توسط template کامپوننت `Welcome` نمایش داده می‌شود؟

این پرسش‌ها برای کامپوننت‌های ساده قبلی شاید نگران‌کننده نباشند.
اما بسیاری از کامپوننت‌ها تعامل‌های پیچیده‌ای با elementهای DOM توصیف‌شده در templateهایشان دارند و با تغییر state کامپوننت، HTML ظاهر و ناپدید می‌شود.

برای پاسخ دادن به این نوع پرسش‌ها، باید elementهای DOM مرتبط با کامپوننت‌ها را ایجاد کنید، DOM را بررسی کنید تا مطمئن شوید state کامپوننت در زمان مناسب درست نمایش داده می‌شود، و تعامل کاربر با صفحه را شبیه‌سازی کنید تا مشخص شود آیا آن تعامل‌ها باعث رفتار مورد انتظار کامپوننت می‌شوند یا نه.

برای نوشتن این نوع test، از قابلیت‌های بیشتری از `TestBed` و helperهای testing دیگر استفاده می‌کنید.

### Testهای تولیدشده توسط CLI

وقتی از CLI می‌خواهید یک کامپوننت جدید generate کند، به صورت پیش‌فرض یک فایل test اولیه هم برای شما ایجاد می‌کند.

برای مثال، دستور CLI زیر یک کامپوننت `Banner` در پوشه `app/banner` تولید می‌کند \(با template و style به صورت inline\):

```shell
ng generate component banner --inline-template --inline-style
```

همچنین یک فایل test اولیه برای کامپوننت، یعنی `banner.spec.ts`، تولید می‌کند که شبیه این است:

```ts
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Banner} from './banner';

describe('Banner', () => {
  let component: Banner;
  let fixture: ComponentFixture<Banner>;

  beforeEach(async () => {
    TestBed.configureTestingModule({});

    fixture = TestBed.createComponent(Banner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### کم کردن setup

فقط سه خط آخر این فایل واقعاً کامپوننت را test می‌کنند و تنها کاری که انجام می‌دهند این است که assert می‌کنند Angular می‌تواند کامپوننت را ایجاد کند.

بقیه فایل، کد boilerplate برای setup است و testهای پیشرفته‌تری را پیش‌بینی می‌کند که _ممکن است_ اگر کامپوننت به چیزی جدی‌تر تبدیل شد لازم شوند.

در بخش‌های بعد با این قابلیت‌های پیشرفته test آشنا می‌شوید.
فعلاً می‌توانید این فایل test را به اندازه‌ای بسیار قابل‌مدیریت‌تر کاهش دهید:

```ts
describe('Banner (minimal)', () => {
  it('should create', () => {
    const fixture = TestBed.createComponent(Banner);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});
```

بعداً `TestBed.configureTestingModule()` را با importها، providerها و declarationهای بیشتر، متناسب با نیازهای testing خود فراخوانی می‌کنید.
متدهای اختیاری `override` هم می‌توانند جنبه‌های configuration را دقیق‌تر تنظیم کنند.

NOTE: `TestBed.compileComponents` فقط زمانی لازم است که blockهای `@defer` در کامپوننت‌های در حال test استفاده شده باشند.

### `createComponent()`

بعد از configure کردن `TestBed`، متد `createComponent()` آن را فراخوانی می‌کنید.

```ts
const fixture = TestBed.createComponent(Banner);
```

`TestBed.createComponent()` یک instance از کامپوننت `Banner` ایجاد می‌کند، element متناظر را به DOM مربوط به test runner اضافه می‌کند، و یک [`ComponentFixture`](#componentfixture) برمی‌گرداند.

IMPORTANT: پس از فراخوانی `createComponent`، `TestBed` را دوباره configure نکنید.

متد `createComponent` تعریف فعلی `TestBed` را freeze می‌کند و آن را برای configuration بیشتر می‌بندد.

دیگر نمی‌توانید هیچ متد configuration دیگری از `TestBed` را فراخوانی کنید؛ نه `configureTestingModule()`، نه `get()`، و نه هیچ‌کدام از متدهای `override...`.
اگر تلاش کنید، `TestBed` خطا می‌دهد.

### `ComponentFixture`

[`ComponentFixture`](api/core/testing/ComponentFixture) یک test harness برای تعامل با کامپوننت ایجادشده و element متناظر آن است.

از طریق fixture به instance کامپوننت دسترسی بگیرید و با یک expectation وجود آن را تأیید کنید:

```ts
const component = fixture.componentInstance;
expect(component).toBeDefined();
```

### `beforeEach()`

با رشد این کامپوننت، testهای بیشتری اضافه خواهید کرد.
به جای تکرار configuration مربوط به `TestBed` برای هر test، setup را به یک `beforeEach()` و چند variable پشتیبان منتقل می‌کنید:

```ts
describe('Banner (with beforeEach)', () => {
  let component: Banner;
  let fixture: ComponentFixture<Banner>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Banner);
    component = fixture.componentInstance;

    await fixture.whenStable(); // necessary to wait for the initial rendering
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
```

HELPFUL: با await کردن rendering اولیه در `beforeEach` با `await fixture.whenStable`، testهای منفرد synchronous می‌مانند.

حالا testی اضافه کنید که element کامپوننت را از `fixture.nativeElement` می‌گیرد و متن مورد انتظار را پیدا می‌کند.

```ts
it('should contain "banner works!"', () => {
  const bannerElement: HTMLElement = fixture.nativeElement;
  expect(bannerElement.textContent).toContain('banner works!');
});
```

### ساخت یک تابع `setup`

به عنوان جایگزین `beforeEach`، می‌توانید یک تابع setup هم بسازید که در هر test فراخوانی می‌کنید.
مزیت تابع setup این است که می‌تواند از طریق parameterها سفارشی شود.

نمونه‌ای از شکل یک تابع setup:

```ts
function setup(providers?: StaticProviders[]): ComponentFixture<Banner> {
  TestBed.configureTestingModule({providers});
  return TestBed.createComponent(Banner);
}
```

### `nativeElement`

مقدار `ComponentFixture.nativeElement` نوع `any` دارد.
بعداً با `DebugElement.nativeElement` روبه‌رو می‌شوید که آن هم نوع `any` دارد.

Angular در زمان compile نمی‌تواند بداند `nativeElement` چه نوع HTML elementای است یا اصلاً HTML element هست یا نه.
ممکن است برنامه روی یک _platform غیرمرورگری_، مثل server یا محیط node، اجرا شود؛ جایی که element شاید API محدودتری داشته باشد یا اصلاً وجود نداشته باشد.

testهای این راهنما برای اجرا در مرورگر طراحی شده‌اند، بنابراین مقدار `nativeElement` همیشه یک `HTMLElement` یا یکی از کلاس‌های مشتق‌شده از آن خواهد بود.

وقتی می‌دانید این مقدار نوعی `HTMLElement` است، از `querySelector` استاندارد HTML برای رفتن به عمق tree مربوط به element استفاده کنید.

این هم test دیگری که `HTMLElement.querySelector` را فراخوانی می‌کند تا paragraph element را بگیرد و متن banner را بررسی کند:

```ts
it('should have <p> with "banner works!"', () => {
  const bannerElement: HTMLElement = fixture.nativeElement;
  const p = bannerElement.querySelector('p')!;
  expect(p.textContent).toEqual('banner works!');
});
```

### `DebugElement`

_fixture_ در Angular، element کامپوننت را مستقیماً از طریق `fixture.nativeElement` فراهم می‌کند.

```ts
const bannerElement: HTMLElement = fixture.nativeElement;
```

این در واقع یک متد راحتی است که به صورت `fixture.debugElement.nativeElement` پیاده‌سازی شده است.

```ts
const bannerDe: DebugElement = fixture.debugElement;
const bannerEl: HTMLElement = bannerDe.nativeElement;
```

برای این مسیر کمی غیرمستقیم به element، دلیل خوبی وجود دارد.

propertyهای `nativeElement` به محیط runtime بستگی دارند.
ممکن است این testها را روی یک platform _غیرمرورگری_ اجرا کنید که DOM ندارد یا DOM-emulation آن از کل API مربوط به `HTMLElement` پشتیبانی نمی‌کند.

Angular به abstraction مربوط به `DebugElement` تکیه می‌کند تا روی _همه platformهای پشتیبانی‌شده_ امن کار کند.
به جای ساختن یک HTML element tree، Angular یک tree از `DebugElement` می‌سازد که _native element_های platform runtime را wrap می‌کند.
property مربوط به `nativeElement`، `DebugElement` را unwrap می‌کند و object مخصوص element در آن platform را برمی‌گرداند.

چون sample testهای این راهنما فقط برای اجرا در مرورگر طراحی شده‌اند، یک `nativeElement` در این testها همیشه یک `HTMLElement` است که می‌توانید methodها و propertyهای آشنای آن را در test بررسی کنید.

این همان test قبلی است که با `fixture.debugElement.nativeElement` دوباره پیاده‌سازی شده است:

```ts
it('should find the <p> with fixture.debugElement.nativeElement', () => {
  const bannerDe: DebugElement = fixture.debugElement;
  const bannerEl: HTMLElement = bannerDe.nativeElement;
  const p = bannerEl.querySelector('p')!;
  expect(p.textContent).toEqual('banner works!');
});
```

`DebugElement` methodها و propertyهای دیگری دارد که در testها مفید هستند و در بخش‌های دیگر این راهنما آن‌ها را خواهید دید.

symbol مربوط به `DebugElement` را از کتابخانه core در Angular import می‌کنید.

```ts
import {DebugElement} from '@angular/core';
```

### `By.css()`

با اینکه همه testهای این راهنما در مرورگر اجرا می‌شوند، بعضی برنامه‌ها ممکن است دست‌کم بخشی از زمان روی platform دیگری اجرا شوند.

برای مثال، کامپوننت ممکن است ابتدا روی server render شود؛ به عنوان بخشی از strategy برای اینکه برنامه روی دستگاه‌هایی با اتصال ضعیف سریع‌تر شروع شود.
server-side renderer ممکن است از کل API مربوط به HTML element پشتیبانی نکند.
اگر از `querySelector` پشتیبانی نکند، test قبلی ممکن است fail شود.

`DebugElement` متدهای query ارائه می‌کند که برای همه platformهای پشتیبانی‌شده کار می‌کنند.
این متدهای query یک تابع _predicate_ می‌گیرند که وقتی nodeای در tree مربوط به `DebugElement` با معیار انتخاب match شود، `true` برمی‌گرداند.

شما با کمک کلاس `By` که از کتابخانه‌ای برای platform runtime import می‌شود، یک _predicate_ می‌سازید.
این import مربوط به `By` برای platform مرورگر است:

```ts
import {By} from '@angular/platform-browser';
```

مثال زیر test قبلی را با `DebugElement.query()` و متد `By.css` مرورگر دوباره پیاده‌سازی می‌کند.

```ts
it('should find the <p> with fixture.debugElement.query(By.css)', () => {
  const bannerDe: DebugElement = fixture.debugElement;
  const paragraphDe = bannerDe.query(By.css('p'));
  const p: HTMLElement = paragraphDe.nativeElement;
  expect(p.textContent).toEqual('banner works!');
});
```

چند نکته قابل توجه:

- متد static مربوط به `By.css()`، nodeهای `DebugElement` را با یک [CSS selector استاندارد](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Selectors 'CSS selectors') انتخاب می‌کند.
- query یک `DebugElement` برای paragraph برمی‌گرداند.
- باید آن نتیجه را unwrap کنید تا paragraph element را بگیرید.

وقتی بر اساس CSS selector فیلتر می‌کنید و فقط propertyهای _native element_ مرورگر را test می‌کنید، رویکرد `By.css` ممکن است بیش از حد لازم باشد.

اغلب ساده‌تر و روشن‌تر است که با یک متد استاندارد `HTMLElement` مثل `querySelector()` یا `querySelectorAll()` فیلتر کنید.
