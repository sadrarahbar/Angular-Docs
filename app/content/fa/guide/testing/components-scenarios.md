# سناریوهای testing کامپوننت

این راهنما use caseهای رایج در component testing را بررسی می‌کند.

## Component binding

در برنامه نمونه، کامپوننت `Banner` یک متن title ثابت را در HTML template نمایش می‌دهد.

بعد از چند تغییر، کامپوننت `Banner` با binding به property مربوط به `title` در کامپوننت، یک title پویا نمایش می‌دهد:

```angular-ts {header="banner.ts"}
import {Component, signal} from '@angular/core';

@Component({
  selector: 'app-banner',
  template: '<h1>{{ title() }}</h1>',
  styles: ['h1 { color: green; font-size: 350%}'],
})
export class Banner {
  title = signal('Test Tour of Heroes');
}
```

با اینکه این مثال بسیار کوچک است، تصمیم می‌گیرید testی اضافه کنید تا تأیید کند کامپوننت واقعاً محتوای درست را همان‌جایی که انتظار دارید نمایش می‌دهد.

### Query برای `<h1>`

مجموعه‌ای از testها می‌نویسید که مقدار element مربوط به `<h1>` را بررسی می‌کنند؛ همان elementای که binding interpolation مربوط به property _title_ را wrap کرده است.

`beforeEach` را update می‌کنید تا این element را با `querySelector` استاندارد HTML پیدا کند و به variable مربوط به `h1` assign کند.

```ts {header: "banner.component.spec.ts"}
let component: Banner;
let fixture: ComponentFixture<Banner>;
let h1: HTMLElement;

beforeEach(() => {
  fixture = TestBed.createComponent(Banner);
  component = fixture.componentInstance; // Banner test instance
  h1 = fixture.nativeElement.querySelector('h1');
});
```

### `createComponent()` داده را bind نمی‌کند

برای test اول می‌خواهید ببینید صفحه `title` پیش‌فرض را نمایش می‌دهد.
غریزه‌تان این است که بلافاصله `<h1>` را این‌طور بررسی کنید:

```ts
it('should display original title', () => {
  expect(h1.textContent).toContain(component.title());
});
```

_این test fail می‌شود_ با پیام:

```shell {hideCopy}
expected '' to contain 'Test Tour of Heroes'.
```

Binding زمانی اتفاق می‌افتد که Angular **change detection** را اجرا کند.

در production، change detection به صورت خودکار اجرا می‌شود؛ مثلاً وقتی Angular یک کامپوننت ایجاد می‌کند یا کاربر یک keystroke وارد می‌کند.

`TestBed.createComponent` به صورت synchronous change detection را trigger نمی‌کند؛ نکته‌ای که test بازنویسی‌شده زیر تأیید می‌کند:

```ts
it('no title in the DOM after createComponent()', () => {
  expect(h1.textContent).toEqual('');
});
```

### `whenStable()`

می‌توانید به `TestBed` بگویید با `await fixture.whenStable()` منتظر اجرای change detection بماند.
فقط بعد از آن است که `<h1>` title مورد انتظار را دارد.

```ts
it('should display original title', async () => {
  await fixture.whenStable();
  expect(h1.textContent).toContain(component.title());
});
```

Change detection با تأخیر، عمدی و مفید است.
این رفتار به tester فرصت می‌دهد state کامپوننت را _قبل از اینکه Angular data binding را شروع کند و [lifecycle hookها](guide/components/lifecycle) را فراخوانی کند_ بررسی و تغییر دهد.

این test دیگر، property مربوط به `title` کامپوننت را _قبل از_ فراخوانی `fixture.whenStable()` تغییر می‌دهد.

```ts
it('should display a different test title', async () => {
  component.title.set('Test Title');
  await fixture.whenStable();
  expect(h1.textContent).toContain('Test Title');
});
```

### Binding کردن Signalها به inputها

برای منعکس کردن تغییرات inputها و گوش دادن به outputها، می‌توانید signalها را به inputها و functionها را به outputها به صورت dynamic bind کنید.

```ts
import {inputBinding, outputBinding} from '@angular/core';

const fixture = TestBed.createComponent(ValueDisplay, {
  bindings: [
    inputBinding('value', value),
    outputBinding('valueChange', () =>  (/* ... */) ),
  ],
});
```

### تغییر مقدار input با `dispatchEvent()`

برای شبیه‌سازی input کاربر، input element را پیدا کنید و property مربوط به `value` آن را تنظیم کنید.

اما یک مرحله میانی ضروری وجود دارد.

Angular نمی‌داند که شما property مربوط به `value` روی input element را تنظیم کرده‌اید.
تا زمانی که event مربوط به `input` را با فراخوانی `dispatchEvent()` روی element بالا نبرید، Angular آن property را نمی‌خواند.

مثال زیر از کامپوننتی که از `TitleCasePipe` استفاده می‌کند، sequence درست را نشان می‌دهد.

```ts
it('should convert hero name to Title Case', async () => {
  const hostElement = fixture.nativeElement;
  const nameInput: HTMLInputElement = hostElement.querySelector('input')!;
  const nameDisplay: HTMLElement = hostElement.querySelector('span')!;

  // simulate user entering a new name into the input box
  nameInput.value = 'quick BROWN  fOx';

  // Dispatch a DOM event so that Angular learns of input value change.
  nameInput.dispatchEvent(new Event('input'));

  // Wait for Angular to update the display binding through the title pipe
  await fixture.whenStable();

  expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
});
```

## کامپوننت با dependency

کامپوننت‌ها اغلب service dependency دارند.

کامپوننت `Welcome` یک پیام خوشامدگویی برای کاربر loginشده نمایش می‌دهد.
این کامپوننت بر اساس propertyای از `UserAuthentication` که inject شده، می‌داند کاربر چه کسی است:

```angular-ts
import {Component, inject, OnInit, signal} from '@angular/core';
import {UserAuthentication} from '../model/user.authentication';

@Component({
  selector: 'app-welcome',
  template: '<h3 class="welcome"><i>{{ welcome() }}</i></h3>',
})
export class Welcome {
  private userAuth = inject(UserAuthentication);
  welcome = signal(
    this.userAuth.isLoggedIn() ? `Welcome, ${this.userAuth.user().name}` : 'Please log in.',
  );
}
```

کامپوننت `Welcome` decision logicای دارد که با service تعامل می‌کند؛ logicای که ارزش test کردن دارد.

### فراهم کردن service test doubleها

یک _component-under-test_ لازم نیست با serviceهای واقعی provide شود.

Inject کردن `UserAuthentication` واقعی ممکن است دشوار باشد.
service واقعی شاید credentialهای login را از کاربر بخواهد و تلاش کند به authentication server وصل شود.
intercept کردن این رفتارها می‌تواند سخت باشد. آگاه باشید که استفاده از test double باعث می‌شود test با production متفاوت رفتار کند، پس از آن‌ها با احتیاط استفاده کنید.

### گرفتن serviceهای injectشده

testها به `UserAuthentication`ای نیاز دارند که داخل کامپوننت `Welcome` inject شده است.

Angular یک سیستم injection سلسله‌مراتبی دارد.
ممکن است injectorها در چند سطح وجود داشته باشند؛ از root injectorای که توسط `TestBed` ساخته می‌شود تا پایین component tree.

امن‌ترین راه برای گرفتن service injectشده، راهی که **_همیشه کار می‌کند_**،
این است که **آن را از injector مربوط به _component-under-test_ بگیرید**.
component injector یک property از `DebugElement` مربوط به fixture است.

```ts
// UserAuthentication actually injected into the component
userAuth = fixture.debugElement.injector.get(UserAuthentication);
```

HELPFUL: این کار _معمولاً_ لازم نیست. serviceها اغلب در root یا overrideهای TestBed provide می‌شوند و می‌توان آن‌ها را ساده‌تر با `TestBed.inject()` گرفت \(پایین‌تر ببینید\).

### `TestBed.inject()`

این روش از گرفتن service با استفاده از `DebugElement` مربوط به fixture، ساده‌تر برای یادآوری و کم‌حجم‌تر است.

در این test suite، _تنها_ provider مربوط به `UserAuthentication` همان root testing module است، پس فراخوانی `TestBed.inject()` به شکل زیر امن است:

```ts
userAuth = TestBed.inject(UserAuthentication);
```

HELPFUL: برای use caseای که `TestBed.inject()` کار نمی‌کند، بخش [_Override component providers_](#override-component-providers) را ببینید که توضیح می‌دهد چه زمانی و چرا باید service را به جای آن از injector کامپوننت بگیرید.

### Setup و testهای نهایی

این `beforeEach()` کامل است که از `TestBed.inject()` استفاده می‌کند:

```ts
let fixture: ComponentFixture<Welcome>;
let comp: Welcome;
let userAuth: UserAuthentication; // the TestBed injected service
let el: HTMLElement; // the DOM element with the welcome message

beforeEach(() => {
  fixture = TestBed.createComponent(Welcome);
  comp = fixture.componentInstance;

  // UserAuthentication from the root injector
  userAuth = TestBed.inject(UserAuthentication);

  //  get the "welcome" element by CSS selector (e.g., by class name)
  el = fixture.nativeElement.querySelector('.welcome');
});
```

و چند test:

```ts
it('should welcome the user', async () => {
  await fixture.whenStable();
  const content = el.textContent;

  expect(content, '"Welcome ..."').toContain('Welcome');
  expect(content, 'expected name').toContain('Test User');
});

it('should welcome "Bubba"', async () => {
  userAuth.user.set({name: 'Bubba'}); // welcome message hasn't been shown yet
  await fixture.whenStable();

  expect(el.textContent).toContain('Bubba');
});

it('should request login if not logged in', async () => {
  userAuth.isLoggedIn.set(false); // welcome message hasn't been shown yet
  await fixture.whenStable();
  const content = el.textContent;

  expect(content, 'not welcomed').not.toContain('Welcome');
  expect(content, '"log in"').toMatch(/log in/i);
});
```

اولی یک sanity test است؛ تأیید می‌کند `UserAuthentication` فراخوانی شده و کار می‌کند.

HELPFUL: argument دوم `expect` \(برای مثال، `'expected name'`\) یک failure label اختیاری است.
اگر expectation fail شود، Vitest این label را به پیام failure مربوط به expectation اضافه می‌کند.
در specای با چند expectation، این می‌تواند کمک کند روشن شود چه چیزی اشتباه شده و کدام expectation fail شده است.

testهای باقی‌مانده logic کامپوننت را وقتی service مقدارهای متفاوت برمی‌گرداند تأیید می‌کنند.
test دوم اثر تغییر نام کاربر را validate می‌کند.
test سوم بررسی می‌کند وقتی کاربر login نکرده، کامپوننت پیام مناسب را نمایش می‌دهد.

## کامپوننت با service async

در این نمونه، template کامپوننت `About` میزبان یک کامپوننت `Twain` است.
کامپوننت `Twain` نقل‌قول‌های Mark Twain را نمایش می‌دهد.

```angular-html
<p class="twain">
  <i>{{ quote | async }}</i>
</p>
<button type="button" (click)="getQuote()">Next quote</button>
@if (errorMessage()) {
  <p class="error">{{ errorMessage() }}</p>
}
```

HELPFUL: مقدار property مربوط به `quote` در کامپوننت از یک `AsyncPipe` عبور می‌کند.
یعنی این property یا یک `Promise` برمی‌گرداند یا یک `Observable`.

در این مثال، method مربوط به `TwainQuotes.getQuote()` به شما می‌گوید property مربوط به `quote` یک `Observable` برمی‌گرداند.

```ts
getQuote() {
  this.errorMessage.set('');
  this.quote = this.twainQuotes.getQuote().pipe(
    startWith('...'),
    catchError((err: any) => {
      this.errorMessage.set(err.message || err.toString());
      return of('...'); // reset message to placeholder
    }),
  );
}
```

کامپوننت `Twain` quoteها را از `TwainQuotes` injectشده می‌گیرد.
کامپوننت `Observable` برگشتی را پیش از اینکه service اولین quote را برگرداند، با یک مقدار placeholder \(`'...'`\) شروع می‌کند.

`catchError` خطاهای service را intercept می‌کند، یک error message آماده می‌کند و مقدار placeholder را روی success channel برمی‌گرداند.

این‌ها همه قابلیت‌هایی هستند که می‌خواهید test کنید.

### Testing با mock کردن http requestها با `HttpTestingController`

هنگام testing یک کامپوننت، فقط public API مربوط به service باید مهم باشد.
به طور کلی، خود testها نباید به serverهای remote call بزنند.
باید چنین callهایی را emulate کنند.

اگر service async شما برای load کردن data remote به `HttpClient` وابسته است، توصیه می‌شود responseهای mock را در سطح HTTP با `HttpTestingController` برگردانید.

برای جزئیات بیشتر درباره mock کردن `HttpBackend`، به [راهنمای اختصاصی](guide/http/testing) مراجعه کنید.

### Testing با فراهم کردن implementation stubشده از service

وقتی mock کردن request async در سطح http ممکن نیست، یک جایگزین استفاده از spyهاست.

setup زیر در `app/twain/twain-quotes.spec.ts` یک راه انجام این کار را نشان می‌دهد:

```ts {header: "twain.spec.ts"}
class TwainQuotesStub implements TwainQuotes {
  private testQuote = 'Test Quote';

  getQuote() {
    return of(this.testQuote);
  }

  // ... Implement everything to conform to the API
}

beforeEach(async () => {
  TestBed.configureTestingModule({
    providers: [{provide: TwainQuotes, useClass: TwainQuotesStub}],
  });

  fixture = TestBed.createComponent(Twain);
  component = fixture.componentInstance;
  await fixture.whenStable();
  quoteEl = fixture.nativeElement.querySelector('.twain');
});
```

روی این تمرکز کنید که implementation مربوط به stub چطور جای implementation اصلی را می‌گیرد.

```ts
TestBed.configureTestingModule({
  providers: [{provide: TwainQuotes, useClass: TwainQuotesStub}],
});
```

stub طوری طراحی شده که هر کامپوننت یا serviceای که آن را inject کند، implementation stubشده را دریافت کند.
یعنی هر call به `getQuote` یک observable با یک quote مخصوص test دریافت می‌کند.

برخلاف method واقعی `getQuote()`، این spy از server عبور نمی‌کند و یک observable synchronous برمی‌گرداند که مقدارش بلافاصله در دسترس است.

### Test async با fake timerهای Vitest

برای mock کردن functionهای async مثل `setTimeout` یا `Promise`ها، می‌توانید از fake timerهای Vitest استفاده کنید تا کنترل کنید چه زمانی اجرا شوند.

```ts
it('should display error when TwainQuotes service fails', async () => {
  class TwainQuotesStub implements TwainQuotes {
    getQuote() {
      return defer(() => {
        return new Promise<string>((_, reject) => {
          setTimeout(() => reject('TwainService test failure'));
        });
      });
    }

    // ... Implement everything to conform to the API
  }

  TestBed.configureTestingModule({
    providers: [{provide: TwainQuotes, useClass: TwainQuotesStub}],
  });

  vi.useFakeTimers(); // setting up the fake timers
  const fixture = TestBed.createComponent(TwainComponent);

  // rendering isn't async, we need to flush
  await vi.runAllTimersAsync();

  await expect(fixture.nativeElement.querySelector('.error')!.textContent).toMatch(/test failure/);
  expect(fixture.nativeElement.querySelector('.twain')!.textContent).toBe('...');

  vi.useRealTimers(); // resets to regular async execution
});
```

### Testهای async بیشتر

وقتی service stubشده observableهای async برمی‌گرداند، بیشتر testهای شما هم باید async باشند.

این test جریان dataای را که در دنیای واقعی انتظار دارید نشان می‌دهد.

```ts
it('should show quote after getQuote', async () => {
  class MockTwainQuotes implements TwainQuotes {
    private subject = new Subject<string>();

    getQuote() {
      return this.subject.asObservable();
    }

    emit(val: string) {
      this.subject.next(val);
    }
  }

  it('should show quote after getQuote (success)', async () => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [{provide: TwainQuotes, useClass: MockTwainQuotes}],
    });

    const fixture = TestBed.createComponent(TwainComponent);
    const twainQuotes = TestBed.inject(TwainQuotes) as MockTwainQuotes;
    await vi.runAllTimersAsync(); // render before the quote is received

    const quoteEl = fixture.nativeElement.querySelector('.twain');
    expect(quoteEl.textContent).toBe('...');

    twainQuotes.emit('Twain Quote'); // emits the quote
    await vi.runAllTimersAsync(); // render with the quote received

    expect(quoteEl.textContent).toBe('Twain Quote');
    expect(fixture.nativeElement.querySelector('.error')).toBeNull();

    vi.useRealTimers();
  });
});
```

توجه کنید quote element در rendering اول مقدار placeholder \(`'...'`\) را نمایش می‌دهد.
اولین quote هنوز نرسیده است.

سپس می‌توانید assert کنید که quote element متن مورد انتظار را نمایش می‌دهد.

### Testهای async با `zone.js` و `fakeAsync`

helper function مربوط به `fakeAsync` یک mock clock دیگر است که به patch کردن APIهای asynchronous با `zone.js` وابسته است. این helper معمولاً در برنامه‌های مبتنی بر `zone.js` برای testing استفاده می‌شد. استفاده از `fakeAsync` دیگر توصیه نمی‌شود.

TIP: استفاده از strategyهای native async testing یا fake timerهای دیگر \(که mock clock هم نامیده می‌شوند\)، مثل نمونه‌های Vitest یا Jasmine، را ترجیح دهید.

IMPORTANT: `fakeAsync` را نمی‌توان با test runner مربوط به Vitest استفاده کرد، چون هیچ patch مربوط به `zone.js` برای این runner اعمال نمی‌شود.

## کامپوننت با input و output

کامپوننتی با input و output معمولاً داخل view template یک host component ظاهر می‌شود.
host از property binding برای تنظیم input property و از event binding برای گوش دادن به eventهایی استفاده می‌کند که output property بالا می‌برد.

هدف testing این است که verify شود چنین bindingهایی همان‌طور که انتظار می‌رود کار می‌کنند.
testها باید مقدارهای input را تنظیم کنند و به output eventها گوش دهند.

کامپوننت `DashboardHero` یک نمونه کوچک از کامپوننتی در این نقش است.
این کامپوننت یک hero منفرد را که توسط کامپوننت `Dashboard` فراهم شده نمایش می‌دهد.
کلیک کردن روی آن hero به کامپوننت `Dashboard` می‌گوید کاربر hero را انتخاب کرده است.

کامپوننت `DashboardHero` در template کامپوننت `Dashboard` این‌طور embed شده است:

```angular-html
@for (hero of heroes; track hero) {
  <dashboard-hero class="col-1-4" [hero]="hero" (selected)="gotoDetail($event)" />
}
```

کامپوننت `DashboardHero` داخل یک block مربوط به `@for` ظاهر می‌شود؛ این block input property مربوط به `hero` در هر کامپوننت را روی مقدار loop تنظیم می‌کند و به event مربوط به `selected` کامپوننت گوش می‌دهد.

تعریف کامل کامپوننت:

```angular-ts
@Component({
  selector: 'dashboard-hero',
  imports: [UpperCasePipe],
  template: `
    <button type="button" (click)="click()" class="hero">
      {{ hero().name | uppercase }}
    </button>
  `,
})
export class DashboardHero {
  readonly hero = input.required<Hero>();
  readonly selected = output<Hero>();

  click() {
    this.selected.emit(this.hero());
  }
}
```

testing کامپوننتی به این سادگی ارزش ذاتی زیادی ندارد، اما دانستن روش آن مفید است.
از یکی از این approachها استفاده کنید:

- آن را همان‌طور test کنید که توسط کامپوننت `Dashboard` استفاده می‌شود.
- آن را به عنوان یک کامپوننت standalone test کنید.
- آن را همان‌طور test کنید که توسط جایگزینی برای کامپوننت `Dashboard` استفاده می‌شود.

هدف فوری، test کردن کامپوننت `DashboardHero` است، نه کامپوننت `Dashboard`؛ بنابراین گزینه‌های دوم و سوم را امتحان کنید.

### Test کردن کامپوننت `DashboardHero` به صورت standalone

این بخش اصلی setup فایل spec است.

```ts
let fixture: ComponentFixture<DashboardHero>;
let comp: DashboardHero;
let heroDe: DebugElement;
let heroEl: HTMLElement;
let expectedHero: Hero;

beforeEach(async () => {
  fixture = TestBed.createComponent(DashboardHero);
  comp = fixture.componentInstance;

  // find the hero's DebugElement and element
  heroDe = fixture.debugElement.query(By.css('.hero'));
  heroEl = heroDe.nativeElement;

  // mock the hero supplied by the parent component
  expectedHero = {id: 42, name: 'Test Name'};

  // simulate the parent setting the input property with that hero
  fixture.componentRef.setInput('hero', expectedHero);

  // wait for initial data binding
  await fixture.whenStable();
});
```

توجه کنید کد setup یک test hero \(`expectedHero`\) را به property مربوط به `hero` کامپوننت assign می‌کند و همان کاری را emulate می‌کند که `Dashboard` با property binding در repeater خودش انجام می‌دهد.

test زیر verify می‌کند که نام hero با استفاده از binding به template منتقل شده است.

```ts
it('should display hero name in uppercase', () => {
  const expectedPipedName = expectedHero.name.toUpperCase();
  expect(heroEl.textContent).toContain(expectedPipedName);
});
```

چون template نام hero را از `UpperCasePipe` در Angular عبور می‌دهد، test باید مقدار element را با نام uppercaseشده match کند.

### Clicking

کلیک روی hero باید یک event به نام `selected` بالا ببرد که host component \(احتمالاً `Dashboard`\) بتواند آن را بشنود:

```ts
it('should raise selected event when clicked (triggerEventHandler)', () => {
  let selectedHero: Hero | undefined;
  comp.selected.subscribe((hero: Hero) => (selectedHero = hero));

  heroDe.triggerEventHandler('click');
  expect(selectedHero).toBe(expectedHero);
});
```

property مربوط به `selected` در کامپوننت یک `EventEmitter` برمی‌گرداند که برای مصرف‌کننده‌ها شبیه یک `Observable` synchronous از RxJS است.
test همان‌طور که host component به صورت _implicit_ انجام می‌دهد، به صورت _explicit_ به آن subscribe می‌کند.

اگر کامپوننت طبق انتظار رفتار کند، کلیک روی element مربوط به hero باید به property مربوط به `selected` در کامپوننت بگوید object مربوط به `hero` را emit کند.

test آن event را از طریق subscription خودش به `selected` تشخیص می‌دهد.

### `triggerEventHandler`

`heroDe` در test قبلی یک `DebugElement` است که hero `<div>` را نمایش می‌دهد.

این object propertyها و methodهای Angular دارد که interaction با native element را abstract می‌کنند.
این test، `DebugElement.triggerEventHandler` را با نام event یعنی "click" فراخوانی می‌کند.
binding مربوط به event "click" با فراخوانی `DashboardHero.click()` پاسخ می‌دهد.

`DebugElement.triggerEventHandler` در Angular می‌تواند _هر event data-bound_ را با _نام event_ آن بالا ببرد.
parameter دوم همان event objectای است که به handler پاس داده می‌شود.

test یک event به نام "click" را trigger کرد.

```ts
heroDe.triggerEventHandler('click');
```

در این حالت، test درست فرض می‌کند که runtime event handler، یعنی method مربوط به `click()` کامپوننت، به event object اهمیتی نمی‌دهد.

HELPFUL: handlerهای دیگر کمتر بخشنده‌اند.
برای مثال، directive مربوط به `RouterLink` انتظار objectای با property مربوط به `button` را دارد که مشخص کند در طول click کدام mouse button، اگر وجود داشته باشد، فشار داده شده است.
اگر event object وجود نداشته باشد، directive مربوط به `RouterLink` خطا می‌دهد.

### کلیک روی element

test جایگزین زیر method مربوط به `click()` روی native element را فراخوانی می‌کند، که برای _این کامپوننت_ کاملاً مناسب است.

```ts
it('should raise selected event when clicked (element.click)', () => {
  let selectedHero: Hero | undefined;
  comp.selected.subscribe((hero: Hero) => (selectedHero = hero));

  heroEl.click();
  expect(selectedHero).toBe(expectedHero);
});
```

### Helper مربوط به `click()`

کلیک کردن روی button، anchor یا یک HTML element دلخواه، task رایجی در test است.

با encapsulate کردن فرایند _click-triggering_ در یک helper مثل function زیر یعنی `click()`، آن را consistent و ساده کنید:

```ts
/** Button events to pass to `DebugElement.triggerEventHandler` for RouterLink event handler */
export const ButtonClickEvents = {
  left: {button: 0},
  right: {button: 2},
};

/** Simulate element click. Defaults to mouse left-button click event. */
export function click(
  el: DebugElement | HTMLElement,
  eventObj: any = ButtonClickEvents.left,
): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}
```

parameter اول همان _element-to-click_ است.
اگر خواستید، یک event object سفارشی را به عنوان parameter دوم پاس دهید.
پیش‌فرض، یک [left-button mouse event object](https://developer.mozilla.org/docs/Web/API/MouseEvent/button) جزئی است که بسیاری از handlerها از جمله directive مربوط به `RouterLink` آن را می‌پذیرند.

IMPORTANT: helper function مربوط به `click()` **یکی** از utilityهای testing در Angular نیست.
این یک function است که در _sample code همین راهنما_ تعریف شده است.
همه sample testها از آن استفاده می‌کنند.
اگر آن را دوست دارید، به collection helperهای خودتان اضافه کنید.

این همان test قبلی است که با helper مربوط به click بازنویسی شده است.

```ts
it('should raise selected event when clicked (click helper with DebugElement)', () => {
  let selectedHero: Hero | undefined;
  comp.selected.subscribe((hero: Hero) => (selectedHero = hero));

  click(heroDe); // click helper with DebugElement

  expect(selectedHero).toBe(expectedHero);
});
```

## کامپوننت داخل test host

testهای قبلی خودشان نقش host component یعنی `Dashboard` را بازی کردند.
اما آیا کامپوننت `DashboardHero` وقتی درست به یک host component data-bound شده باشد درست کار می‌کند؟

```angular-ts
@Component({
  imports: [DashboardHero],
  template: ` <dashboard-hero [hero]="hero" (selected)="onSelected($event)" />`,
})
class TestHost {
  hero: Hero = {id: 42, name: 'Test Name'};
  selectedHero: Hero | undefined;

  onSelected(hero: Hero) {
    this.selectedHero = hero;
  }
}
```

test host، input property مربوط به `hero` کامپوننت را با test hero خودش تنظیم می‌کند.
event مربوط به `selected` کامپوننت را به handler خودش یعنی `onSelected` bind می‌کند؛ handlerای که hero emitشده را در property مربوط به `selectedHero` ثبت می‌کند.

بعداً testها می‌توانند `selectedHero` را بررسی کنند تا verify شود event مربوط به `DashboardHero.selected` همان hero مورد انتظار را emit کرده است.

setup برای testهای `test-host` شبیه setup testهای stand-alone است:

```ts
beforeEach(async () => {
  // create TestHost instead of DashboardHero
  fixture = TestBed.createComponent(TestHost);
  testHost = fixture.componentInstance;
  heroEl = fixture.nativeElement.querySelector('.hero');

  await fixture.whenStable();
});
```

این testing module configuration دو تفاوت مهم را نشان می‌دهد:

- به جای `DashboardHero`، کامپوننت `TestHost` را _create_ می‌کند.
- کامپوننت `TestHost`، مقدار `DashboardHero.hero` را با یک binding تنظیم می‌کند.

`createComponent` یک `fixture` برمی‌گرداند که instanceای از `TestHost` را نگه می‌دارد، نه instanceای از `DashboardHero`.

ساختن `TestHost` اثر جانبی ساختن `DashboardHero` را دارد، چون دومی داخل template اولی ظاهر می‌شود.
query مربوط به hero element \(`heroEl`\) همچنان آن را در test DOM پیدا می‌کند، هرچند در عمق بیشتری از element tree نسبت به قبل.

خود testها تقریباً با نسخه stand-alone یکسان هستند:

```ts
it('should display hero name', () => {
  const expectedPipedName = testHost.hero.name.toUpperCase();
  expect(heroEl.textContent).toContain(expectedPipedName);
});

it('should raise selected event when clicked', () => {
  click(heroEl);
  // selected hero should be the same data bound hero
  expect(testHost.selectedHero).toBe(testHost.hero);
});
```

فقط test مربوط به selected event فرق دارد.
این test تأیید می‌کند hero انتخاب‌شده در `DashboardHero` واقعاً از طریق event binding به host component می‌رسد.

## Routing component

یک _routing component_ کامپوننتی است که به `Router` می‌گوید به کامپوننت دیگری navigate کند.
کامپوننت `Dashboard` یک _routing component_ است، چون کاربر می‌تواند با کلیک روی یکی از _hero button_های dashboard به کامپوننت `HeroDetail` navigate کند.

Angular test helperهایی فراهم می‌کند تا boilerplate کم شود و کدی که به `HttpClient` وابسته است مؤثرتر test شود. function مربوط به `provideRouter` را هم می‌توان مستقیم در test module استفاده کرد.

```ts
beforeEach(async () => {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([{path: '**', component: Dashboard}]),
      provideHttpClientTesting(),
      HeroService,
    ],
  });
  harness = await RouterTestingHarness.create();
  comp = await harness.navigateByUrl('/', Dashboard);
  TestBed.inject(HttpTestingController).expectOne('api/heroes').flush(getTestHeroes());
});
```

test زیر روی hero نمایش‌داده‌شده کلیک می‌کند و تأیید می‌کند که به URL مورد انتظار navigate می‌کنیم.

```ts
it('should tell navigate when hero clicked', async () => {
  // get first <dashboard-hero> DebugElement
  const heroDe = harness.routeDebugElement!.query(By.css('dashboard-hero'));
  heroDe.triggerEventHandler('selected', comp.heroes[0]);

  // expecting to navigate to id of the component's first hero
  const id = comp.heroes[0].id;
  expect(TestBed.inject(Router).url, 'should nav to HeroDetail for first hero').toEqual(
    `/heroes/${id}`,
  );
});
```

## Routed components

یک _routed component_ مقصد یک navigation در `Router` است.
test کردن آن می‌تواند سخت‌تر باشد، مخصوصاً وقتی route مربوط به کامپوننت _شامل parameterها_ باشد.
`HeroDetail` یک _routed component_ است که مقصد چنین routeای است.

وقتی کاربر روی یک hero در _Dashboard_ کلیک می‌کند، `Dashboard` به `Router` می‌گوید به `heroes/:id` navigate کند.
`:id` یک route parameter است که مقدار آن `id` همان heroای است که باید edit شود.

`Router` آن URL را با route مربوط به `HeroDetail` match می‌کند.
یک object از `ActivatedRoute` با routing information می‌سازد و آن را داخل یک instance جدید از `HeroDetail` inject می‌کند.

serviceهای injectشده داخل `HeroDetail`:

```ts
private heroDetailService = inject(HeroDetailService);
private route = inject(ActivatedRoute);
private router = inject(Router);
```

کامپوننت `HeroDetail` به parameter مربوط به `id` نیاز دارد تا بتواند با استفاده از `HeroDetailService`، hero متناظر را fetch کند.
کامپوننت باید `id` را از property مربوط به `ActivatedRoute.paramMap` بگیرد که یک `Observable` است.

نمی‌تواند فقط به property مربوط به `id` روی `ActivatedRoute.paramMap` reference کند.
کامپوننت باید به observable مربوط به `ActivatedRoute.paramMap` _subscribe_ کند و آماده باشد که `id` در طول عمر کامپوننت تغییر کند.

```ts
constructor() {
  // get hero when `id` param changes
  this.route.paramMap
    .pipe(takeUntilDestroyed())
    .subscribe((pmap) => this.getHero(pmap.get('id')));
}
```

testها می‌توانند با navigate کردن به routeهای مختلف، بررسی کنند `HeroDetail` در برابر مقدارهای مختلف parameter مربوط به `id` چطور پاسخ می‌دهد.

## Nested component tests

templateهای کامپوننت اغلب nested component دارند و template آن‌ها هم ممکن است کامپوننت‌های بیشتری داشته باشد.

component tree می‌تواند بسیار عمیق باشد و گاهی nested componentها هیچ نقشی در test کردن کامپوننت بالای tree ندارند.

برای مثال، کامپوننت `App` یک navigation bar با anchorها و directiveهای `RouterLink` آن‌ها نمایش می‌دهد.

```angular-html
<app-banner />
<app-welcome />

<nav>
  <a routerLink="/dashboard">Dashboard</a>
  <a routerLink="/heroes">Heroes</a>
  <a routerLink="/about">About</a>
</nav>

<router-outlet />
```

برای validate کردن linkها، اما نه navigation، لازم نیست `Router` navigate کند و لازم نیست `<router-outlet>` مشخص کند `Router` کجا _routed component_ها را insert می‌کند.

کامپوننت‌های `Banner` و `Welcome` \(که با `<app-banner>` و `<app-welcome>` نشان داده شده‌اند\) هم نامرتبط هستند.

با این حال، هر testای که کامپوننت `App` را در DOM بسازد، instanceهایی از این سه کامپوننت را هم می‌سازد و اگر اجازه دهید این اتفاق بیفتد، باید `TestBed` را برای ساختن آن‌ها configure کنید.

اگر declaration آن‌ها را فراموش کنید، Angular compiler tagهای `<app-banner>`، `<app-welcome>` و `<router-outlet>` را در template مربوط به `App` نمی‌شناسد و خطا می‌دهد.

اگر کامپوننت‌های واقعی را declare کنید، باید nested componentهای _آن‌ها_ را هم declare کنید و برای _همه_ serviceهایی که در _هر_ کامپوننت داخل tree inject شده‌اند provider فراهم کنید.

این بخش دو تکنیک برای کم کردن setup را توضیح می‌دهد.
از آن‌ها، به تنهایی یا ترکیبی، استفاده کنید تا روی testing کامپوننت اصلی متمرکز بمانید.

### Stub کردن کامپوننت‌های غیرضروری

در تکنیک اول، نسخه‌های stub از کامپوننت‌ها و directiveهایی می‌سازید و declare می‌کنید که نقش کمی در testها دارند یا هیچ نقشی ندارند.

```ts
@Component({selector: 'app-banner', template: ''})
class BannerStub {}

@Component({selector: 'router-outlet', template: ''})
class RouterOutletStub {}

@Component({selector: 'app-welcome', template: ''})
class WelcomeStub {}
```

selectorهای stub با selectorهای کامپوننت‌های واقعی متناظر match هستند.
اما templateها و کلاس‌هایشان empty هستند.

سپس آن‌ها را با override کردن `imports` کامپوننت خود با `TestBed.overrideComponent` declare کنید.

```ts
let comp: App;
let fixture: ComponentFixture<App>;

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), UserAuthentication],
  }).overrideComponent(App, {
    set: {
      imports: [RouterLink, BannerStub, RouterOutletStub, WelcomeStub],
    },
  });

  fixture = TestBed.createComponent(App);
  comp = fixture.componentInstance;
});
```

HELPFUL: key مربوط به `set` در این مثال همه importهای موجود روی کامپوننت را جایگزین می‌کند؛ مطمئن شوید همه dependencyها را import می‌کنید، نه فقط stubها را. به عنوان جایگزین، می‌توانید از keyهای `remove`/`add` استفاده کنید تا importها را انتخابی حذف و اضافه کنید.

### `NO_ERRORS_SCHEMA`

در approach دوم، `NO_ERRORS_SCHEMA` را به metadata overrideهای کامپوننت خود اضافه کنید.

```ts
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), UserAuthentication],
  }).overrideComponent(App, {
    set: {
      imports: [], // resets all imports
      schemas: [NO_ERRORS_SCHEMA],
    },
  });
});
```

`NO_ERRORS_SCHEMA` به Angular compiler می‌گوید elementها و attributeهای ناشناخته را ignore کند.

compiler، element مربوط به `<app-root>` و attribute مربوط به `routerLink` را می‌شناسد، چون یک کامپوننت `App` متناظر و `RouterLink` را در configuration مربوط به `TestBed` declare کرده‌اید.

اما compiler وقتی به `<app-banner>`، `<app-welcome>` یا `<router-outlet>` برسد خطا نمی‌دهد.
آن‌ها را صرفاً به صورت tagهای empty render می‌کند و مرورگر آن‌ها را ignore می‌کند.

دیگر به stub componentها نیاز ندارید.

### استفاده هم‌زمان از هر دو تکنیک

این‌ها تکنیک‌هایی برای _Shallow Component Testing_ هستند؛ چنین نامیده می‌شوند چون سطح visual کامپوننت را فقط به elementهایی از template کامپوننت کاهش می‌دهند که برای testها مهم هستند.

approach مربوط به `NO_ERRORS_SCHEMA` ساده‌تر است، اما در استفاده از آن زیاده‌روی نکنید.

`NO_ERRORS_SCHEMA` همچنین مانع می‌شود compiler درباره کامپوننت‌ها و attributeهای missing که ناخواسته حذف کرده‌اید یا اشتباه نوشته‌اید به شما بگوید.
ممکن است ساعت‌ها دنبال bugهای خیالی بگردید که compiler در یک لحظه می‌توانست پیدا کند.

approach مربوط به _stub component_ مزیت دیگری دارد.
با اینکه stubهای _این_ مثال empty بودند، اگر testهای شما لازم داشته باشند به نحوی با آن‌ها تعامل کنند، می‌توانید templateها و کلاس‌های ساده‌شده‌ای به آن‌ها بدهید.

در عمل، این دو تکنیک را در یک setup ترکیب می‌کنید، همان‌طور که در این مثال دیده می‌شود.

```ts
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), UserAuthentication],
  }).overrideComponent(App, {
    remove: {imports: [RouterOutlet, Welcome]},
    set: {schemas: [NO_ERRORS_SCHEMA]},
  });
});
```

Angular compiler برای element مربوط به `<app-banner>`، `BannerStub` را ایجاد می‌کند و `RouterLink` را روی anchorهایی با attribute مربوط به `routerLink` اعمال می‌کند، اما tagهای `<app-welcome>` و `<router-outlet>` را ignore می‌کند.

### `By.directive` و directiveهای injectشده

کمی setup بیشتر data binding اولیه را trigger می‌کند و referenceهایی به navigation linkها می‌گیرد:

```ts
beforeEach(async () => {
  await fixture.whenStable();

  // find DebugElements with an attached RouterLinkStubDirective
  linkDes = fixture.debugElement.queryAll(By.directive(RouterLink));

  // get attached link directive instances
  // using each DebugElement's injector
  routerLinks = linkDes.map((de) => de.injector.get(RouterLink));
});
```

سه نکته با اهمیت ویژه:

- anchor elementهایی را که directive متصل دارند با `By.directive` پیدا کنید.
- query، wrapperهای `DebugElement` دور elementهای matchشده را برمی‌گرداند.
- هر `DebugElement` یک dependency injector expose می‌کند که instance مشخص directive متصل به همان element را دارد.

linkهای کامپوننت `App` که باید validate شوند:

```angular-html
<nav>
  <a routerLink="/dashboard">Dashboard</a>
  <a routerLink="/heroes">Heroes</a>
  <a routerLink="/about">About</a>
</nav>
```

این‌ها چند test هستند که تأیید می‌کنند این linkها همان‌طور که انتظار می‌رود به directiveهای `routerLink` وصل شده‌اند:

```ts
it('can get RouterLinks from template', () => {
  expect(routerLinks.length, 'should have 3 routerLinks').toBe(3);
  expect(routerLinks[0].href).toBe('/dashboard');
  expect(routerLinks[1].href).toBe('/heroes');
  expect(routerLinks[2].href).toBe('/about');
});

it('can click Heroes link in template', async () => {
  const heroesLinkDe = linkDes[1]; // heroes link DebugElement

  TestBed.inject(Router).resetConfig([{path: '**', children: []}]);
  heroesLinkDe.triggerEventHandler('click', {button: 0});

  await fixture.whenStable();

  expect(TestBed.inject(Router).url).toBe('/heroes');
});
```

## استفاده از object مربوط به `page`

کامپوننت `HeroDetail` یک view ساده با یک title، دو field مربوط به hero و دو button است.

اما حتی در همین form ساده هم template complexity زیادی وجود دارد.

```angular-html
@if (hero) {
  <div>
    <h2>
      <span>{{ hero.name | titlecase }}</span> Details
    </h2>
    <div><span>id: </span>{{ hero.id }}</div>
    <div>
      <label for="name">name: </label>
      <input id="name" [(ngModel)]="hero.name" placeholder="name" />
    </div>
    <button type="button" (click)="save()">Save</button>
    <button type="button" (click)="cancel()">Cancel</button>
  </div>
}
```

testهایی که کامپوننت را exercise می‌کنند نیاز دارند …

- منتظر بمانند تا hero برسد، پیش از آنکه elementها در DOM ظاهر شوند.
- referenceای به متن title داشته باشند.
- referenceای به name input box داشته باشند تا آن را inspect و set کنند.
- referenceهایی به دو button داشته باشند تا بتوانند روی آن‌ها click کنند.

حتی form کوچکی مثل این می‌تواند setup conditional پیچیده و انتخاب element با CSS را آشفته کند.

این پیچیدگی را با یک کلاس `Page` رام کنید؛ کلاسی که access به propertyهای کامپوننت را مدیریت می‌کند و logic تنظیم آن‌ها را encapsulate می‌کند.

این یک کلاس `Page` برای `hero-detail.component.spec.ts` است:

```ts
class Page {
  // getter properties wait to query the DOM until called.
  get buttons() {
    return this.queryAll<HTMLButtonElement>('button');
  }
  get saveBtn() {
    return this.buttons[0];
  }
  get cancelBtn() {
    return this.buttons[1];
  }
  get nameDisplay() {
    return this.query<HTMLElement>('span');
  }
  get nameInput() {
    return this.query<HTMLInputElement>('input');
  }

  //// query helpers ////
  private query<T>(selector: string): T {
    return harness.routeNativeElement!.querySelector(selector)! as T;
  }

  private queryAll<T>(selector: string): T[] {
    return harness.routeNativeElement!.querySelectorAll(selector) as any as T[];
  }
}
```

حالا hookهای مهم برای دستکاری و inspect کردن کامپوننت به شکل مرتب در یک instance از `Page` سازماندهی و قابل دسترسی شده‌اند.

یک method به نام `createComponent` یک object به نام `page` می‌سازد و وقتی `hero` رسید، جای خالی‌ها را پر می‌کند.

```ts
async function createComponent(id: number) {
  harness = await RouterTestingHarness.create();
  component = await harness.navigateByUrl(`/heroes/${id}`, HeroDetail);
  page = new Page();

  const request = TestBed.inject(HttpTestingController).expectOne(`api/heroes/?id=${id}`);
  const hero = getTestHeroes().find((h) => h.id === Number(id));
  request.flush(hero ? [hero] : []);
  await harness.fixture.whenStable();
}
```

چند test دیگر برای کامپوننت `HeroDetail` که نکته را محکم‌تر می‌کنند:

```ts
it("should display that hero's name", () => {
  expect(page.nameDisplay.textContent).toBe(expectedHero.name);
});

it('should navigate when click cancel', () => {
  click(page.cancelBtn);
  expect(TestBed.inject(Router).url).toEqual(`/heroes/${expectedHero.id}`);
});

it('should save when click save but not navigate immediately', () => {
  click(page.saveBtn);
  expect(TestBed.inject(HttpTestingController).expectOne({method: 'PUT', url: 'api/heroes'}));
  expect(TestBed.inject(Router).url).toEqual('/heroes/41');
});

it('should navigate when click save and save resolves', async () => {
  click(page.saveBtn);
  await harness.fixture.whenStable();
  expect(TestBed.inject(Router).url).toEqual('/heroes/41');
});

it('should convert hero name to Title Case', async () => {
  // get the name's input and display elements from the DOM
  const hostElement: HTMLElement = harness.routeNativeElement!;
  const nameInput: HTMLInputElement = hostElement.querySelector('input')!;
  const nameDisplay: HTMLElement = hostElement.querySelector('span')!;

  // simulate user entering a new name into the input box
  nameInput.value = 'quick BROWN  fOx';

  // Dispatch a DOM event so that Angular learns of input value change.
  nameInput.dispatchEvent(new Event('input'));

  // Wait for Angular to update the display binding through the title pipe
  await harness.fixture.whenStable();

  expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
});
```

## Override component providers

`HeroDetail`، `HeroDetailService` خودش را provide می‌کند.

```ts
@Component({
  /* ... */
  providers: [HeroDetailService],
})
export class HeroDetail {
  private heroDetailService = inject(HeroDetailService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
}
```

stub کردن `HeroDetailService` مربوط به کامپوننت در `providers` مربوط به `TestBed.configureTestingModule` ممکن نیست.
آن providerها برای _testing module_ هستند، نه برای کامپوننت.
آن‌ها dependency injector را در _سطح fixture_ آماده می‌کنند.

Angular کامپوننت را با injector _خودش_ می‌سازد که _child_ مربوط به fixture injector است.
providerهای کامپوننت \(در این case، `HeroDetailService`\) را در child injector ثبت می‌کند.

یک test نمی‌تواند از fixture injector به serviceهای child injector برسد.
و `TestBed.configureTestingModule` هم نمی‌تواند آن‌ها را configure کند.

Angular تمام مدت instanceهای جدیدی از `HeroDetailService` واقعی ساخته است!

HELPFUL: اگر `HeroDetailService` خودش XHR callهایی به یک server remote بزند، این testها ممکن است fail شوند یا timeout بخورند.
ممکن است server remoteای برای call کردن وجود نداشته باشد.

خوشبختانه، `HeroDetailService` مسئولیت دسترسی به data remote را به یک `HeroService` injectشده delegate می‌کند.

```ts
@Service()
export class HeroDetailService {
  private heroService = inject(HeroService);
}
```

configuration قبلی test، `HeroService` واقعی را با `TestHeroService` جایگزین می‌کند؛ serviceای که server requestها را intercept می‌کند و responseهای آن‌ها را fake می‌کند.

اگر این‌قدر خوش‌شانس نباشید چه؟
اگر fake کردن `HeroService` سخت باشد چه؟
اگر `HeroDetailService` خودش server request بزند چه؟

متد `TestBed.overrideComponent` می‌تواند providerهای کامپوننت را با _test double_های ساده‌تر برای مدیریت جایگزین کند، همان‌طور که در setup variation زیر دیده می‌شود:

```ts
beforeEach(async () => {
  await TestBed.configureTestingModule({
    providers: [
      provideRouter([
        {path: 'heroes', component: HeroList},
        {path: 'heroes/:id', component: HeroDetail},
      ]),
      // HeroDetailService at this level is IRRELEVANT!
      {provide: HeroDetailService, useValue: {}},
    ],
  }).overrideComponent(HeroDetail, {
    set: {providers: [{provide: HeroDetailService, useClass: HeroDetailServiceSpy}]},
  });
});
```

توجه کنید `TestBed.configureTestingModule` دیگر یک `HeroService` fake فراهم نمی‌کند، چون [لازم نیست](#provide-a-spy-stub-herodetailservicespy).

### متد `overrideComponent`

روی متد `overrideComponent` تمرکز کنید.

```ts
.overrideComponent(HeroDetail, {
  set: {providers: [{provide: HeroDetailService, useClass: HeroDetailServiceSpy}]},
});
```

این متد دو argument می‌گیرد: type کامپوننتی که باید override شود \(`HeroDetail`\) و یک metadata object برای override.
[metadata object مربوط به override](/guide/testing/utility-apis#testbed-class-summary) یک generic است که این‌طور تعریف شده است:

```ts
type MetadataOverride<T> = {
  add?: Partial<T>;
  remove?: Partial<T>;
  set?: Partial<T>;
};
```

یک metadata override object می‌تواند elementهایی را در metadata propertyها اضافه و حذف کند یا آن propertyها را کامل reset کند.
این مثال metadata مربوط به `providers` کامپوننت را reset می‌کند.

type parameter یعنی `T`، نوع metadataای است که به decorator مربوط به `@Component` پاس می‌دهید:

```ts
selector?: string;
template?: string;
templateUrl?: string;
providers?: any[];
…
```

### فراهم کردن یک _spy stub_ یعنی (`HeroDetailServiceSpy`)

این مثال آرایه `providers` کامپوننت را کامل با یک آرایه جدید شامل `HeroDetailServiceSpy` جایگزین می‌کند.

`HeroDetailServiceSpy` یک نسخه stubشده از `HeroDetailService` واقعی است که همه قابلیت‌های لازم آن service را fake می‌کند.
نه چیزی inject می‌کند و نه به `HeroService` سطح پایین‌تر delegate می‌کند، پس نیازی نیست برای آن test double فراهم کنید.

testهای مرتبط با کامپوننت `HeroDetail` با spy کردن روی methodهای service assert می‌کنند که methodهای `HeroDetailService` فراخوانی شده‌اند.
بنابراین stub، methodهای خودش را به صورت spy پیاده‌سازی می‌کند:

```ts
import {vi} from 'vitest';

class HeroDetailServiceSpy {
  testHero: Hero = {...testHero};

  /* emit cloned test hero */
  getHero = vi.fn(() => asyncData({...this.testHero}));

  /* emit clone of test hero, with changes merged in */
  saveHero = vi.fn((hero: Hero) => asyncData(Object.assign(this.testHero, hero)));
}
```

### Testهای override

حالا testها می‌توانند hero مربوط به کامپوننت را مستقیم با دستکاری `testHero` در spy-stub کنترل کنند و تأیید کنند methodهای service فراخوانی شده‌اند.

```ts
let hdsSpy: HeroDetailServiceSpy;

beforeEach(async () => {
  harness = await RouterTestingHarness.create();
  component = await harness.navigateByUrl(`/heroes/${testHero.id}`, HeroDetail);
  page = new Page();
  // get the component's injected HeroDetailServiceSpy
  hdsSpy = harness.routeDebugElement!.injector.get(HeroDetailService) as any;

  harness.detectChanges();
});

it('should have called `getHero`', () => {
  expect(hdsSpy.getHero, 'getHero called once').toHaveBeenCalledTimes(1);
});

it("should display stub hero's name", () => {
  expect(page.nameDisplay.textContent).toBe(hdsSpy.testHero.name);
});

it('should save stub hero change', async () => {
  const origName = hdsSpy.testHero.name;
  const newName = 'New Name';

  page.nameInput.value = newName;

  page.nameInput.dispatchEvent(new Event('input')); // tell Angular

  expect(component.hero.name, 'component hero has new name').toBe(newName);
  expect(hdsSpy.testHero.name, 'service hero unchanged before save').toBe(origName);

  click(page.saveBtn);
  expect(hdsSpy.saveHero, 'saveHero called once').toHaveBeenCalledTimes(1);

  await harness.fixture.whenStable();
  expect(hdsSpy.testHero.name, 'service hero has new name after save').toBe(newName);
  expect(TestBed.inject(Router).url).toEqual('/heroes');
});
```

### Overrideهای بیشتر

متد `TestBed.overrideComponent` می‌تواند چند بار برای همان کامپوننت یا کامپوننت‌های مختلف فراخوانی شود.
`TestBed` متدهای مشابه `overrideDirective`، `overrideModule` و `overridePipe` را هم برای رفتن به عمق و جایگزین کردن بخش‌هایی از این کلاس‌های دیگر ارائه می‌کند.

خودتان optionها و ترکیب‌های مختلف را بررسی کنید.
