# Angular بدون ZoneJS ‏(Zoneless)

## چرا از Zoneless استفاده کنیم؟

مزایای اصلی حذف ZoneJS از dependencyهای برنامه عبارت‌اند از:

- **بهبود عملکرد**: ZoneJS از رویدادهای DOM و taskهای async به‌عنوان نشانه‌ای استفاده می‌کند که وضعیت برنامه _ممکن است_ تغییر کرده باشد؛ سپس همگام‌سازی برنامه را برای اجرای change detection روی viewهای آن فعال می‌کند. ZoneJS نمی‌داند وضعیت برنامه واقعاً تغییر کرده است یا نه، بنابراین این همگام‌سازی بیش از حد لازم اجرا می‌شود.
- **بهبود Core Web Vitals**: ‏ZoneJS هم از نظر اندازه payload و هم زمان راه‌اندازی، سربار قابل‌توجهی ایجاد می‌کند.
- **تجربه بهتر debugging**: ‏ZoneJS اشکال‌زدایی کد را دشوارتر می‌کند. stack traceها با ZoneJS سخت‌تر فهمیده می‌شوند و تشخیص اینکه کد به‌دلیل اجراشدن خارج از Angular Zone دچار مشکل شده نیز دشوار است.
- **سازگاری بهتر با اکوسیستم**: ‏ZoneJS با patch کردن APIهای مرورگر کار می‌کند، اما برای هر API جدید مرورگر به‌طور خودکار patch ندارد. برخی APIها مانند `async`/`await` را نمی‌توان به‌شکل مؤثر patch کرد و برای کار با ZoneJS باید به نسخه سطح پایین‌تری تبدیل شوند. گاهی کتابخانه‌های اکوسیستم نیز با شیوه patch کردن APIهای بومی توسط ZoneJS سازگار نیستند. حذف ZoneJS از dependencyها، با کنارگذاشتن یکی از منابع پیچیدگی، monkey patching و نگهداری مداوم، سازگاری بلندمدت بهتری فراهم می‌کند.

## فعال‌کردن Zoneless در برنامه

Zoneless در Angular v21 و نسخه‌های بعدی حالت پیش‌فرض است؛ بنابراین برای فعال‌کردن آن لازم نیست کاری انجام دهید. بررسی کنید که `provideZoneChangeDetection` در جایی برای بازنویسی پیکربندی پیش‌فرض استفاده نشده باشد.

اگر از Angular v20 استفاده می‌کنید، با افزودن `provideZonelessChangeDetection()` هنگام bootstrap، change detection بدون Zone را فعال کنید:

```ts {header: 'standalone bootstrap'}
bootstrapApplication(MyApp, {providers: [provideZonelessChangeDetection()]});
```

```ts {header: 'NgModule bootstrap'}
platformBrowser().bootstrapModule(AppModule);

@NgModule({
  providers: [provideZonelessChangeDetection()],
})
export class AppModule {}
```

## حذف ZoneJS

برنامه‌های Zoneless باید ZoneJS را به‌طور کامل از build حذف کنند تا اندازه bundle کاهش یابد. ZoneJS معمولاً
از طریق گزینه `polyfills` در `angular.json` و در هر دو target مربوط به `build` و `test` بارگذاری می‌شود. برای حذف آن از build، موارد `zone.js`
و `zone.js/testing` را از هر دو target بردارید. پروژه‌هایی که فایل صریح `polyfills.ts` دارند
باید `import 'zone.js';` و `import 'zone.js/testing';` را از آن فایل حذف کنند.

پس از حذف ZoneJS از build، دیگر نیازی به dependency مربوط به `zone.js` نیز نیست و می‌توانید
بسته را به‌طور کامل حذف کنید:

```shell
npm uninstall zone.js
```

## الزامات سازگاری با Zoneless

Angular برای تعیین زمان اجرای change detection و viewهایی که باید بررسی شوند، به اعلان‌های APIهای اصلی متکی است.
این اعلان‌ها شامل موارد زیر هستند:

- `ChangeDetectorRef.markForCheck` (که `AsyncPipe` آن را به‌طور خودکار فراخوانی می‌کند)
- `ComponentRef.setInput`
- به‌روزرسانی یک signal که در template خوانده می‌شود
- callbackهای listener متصل به host یا template
- متصل‌کردن viewای که توسط یکی از موارد بالا dirty علامت‌گذاری شده است

### componentهای سازگار با `OnPush`

یکی از راه‌های اطمینان از اینکه component سازوکارهای اعلان درست بالا را به‌کار می‌گیرد،
استفاده از [ChangeDetectionStrategy.OnPush](/best-practices/skipping-subtrees#using-onpush) است.

استراتژی change detection از نوع `OnPush` الزامی نیست، اما برای سازگاری componentهای برنامه با Zoneless توصیه می‌شود. componentهای کتابخانه همیشه نمی‌توانند از `ChangeDetectionStrategy.OnPush` استفاده کنند.
وقتی یک component کتابخانه میزبان componentهای کاربر است که ممکن است از `ChangeDetectionStrategy.Eager`/`Default` استفاده کنند، نمی‌تواند `OnPush` باشد؛ زیرا اگر component فرزند با `OnPush` سازگار نباشد و برای فعال‌کردن change detection به ZoneJS متکی باشد، دیگر refresh نمی‌شود. componentها تا زمانی می‌توانند از استراتژی `Default` استفاده کنند که هنگام نیاز به اجرای change detection به Angular اعلان دهند (با فراخوانی `markForCheck`، استفاده از signalها، `AsyncPipe` و غیره).
میزبان‌بودن برای component کاربر یعنی استفاده از APIای مانند `ViewContainerRef.createComponent`، نه صرفاً میزبانی بخشی از template یک component کاربر (برای مثال content projection یا استفاده از ورودی template ref).

### حذف `NgZone.onMicrotaskEmpty`،‏ `NgZone.onUnstable`،‏ `NgZone.isStable` یا `NgZone.onStable`

برنامه‌ها و کتابخانه‌ها باید استفاده از `NgZone.onMicrotaskEmpty`،‏ `NgZone.onUnstable` و `NgZone.onStable` را حذف کنند.
وقتی برنامه change detection بدون Zone را فعال می‌کند، این observableها هرگز مقداری منتشر نمی‌کنند.
به همین ترتیب، `NgZone.isStable` همیشه `true` خواهد بود و نباید به‌عنوان شرط اجرای کد استفاده شود.

observableهای `NgZone.onMicrotaskEmpty` و `NgZone.onStable` اغلب برای انتظار تا تکمیل
change detection در Angular پیش از انجام یک task استفاده می‌شوند. در عوض، اگر تنها انتظار برای یک نوبت change detection لازم است، آن‌ها را با `afterNextRender`
و اگر شرطی ممکن است چندین نوبت change detection را در بر بگیرد، با `afterEveryRender` جایگزین کنید. در موارد دیگر، این observableها فقط به این دلیل استفاده شده‌اند که
آشنا بوده‌اند و زمان‌بندی مشابهی با نیاز برنامه داشته‌اند. به‌جای آن‌ها می‌توان از APIهای مستقیم‌تر و ساده‌تر DOM استفاده کرد؛
برای مثال وقتی کد باید منتظر وضعیت مشخصی در DOM بماند، از `MutationObserver` استفاده کنید (به‌جای انتظار غیرمستقیم
از طریق render hookهای Angular).

<docs-callout title="NgZone.run و NgZone.runOutsideAngular با Zoneless سازگار هستند">
برای سازگاری کد با برنامه‌های Zoneless لازم نیست `NgZone.run` و `NgZone.runOutsideAngular` حذف شوند.
در واقع، حذف این فراخوانی‌ها ممکن است عملکرد کتابخانه‌هایی را که در برنامه‌های متکی به ZoneJS استفاده می‌شوند کاهش دهد.
</docs-callout>

### استفاده از `PendingTasks` برای Server Side Rendering ‏(SSR)

اگر همراه Angular از SSR استفاده می‌کنید، احتمالاً می‌دانید که SSR برای تشخیص زمان "پایدار" شدن و امکان serialize کردن برنامه
به ZoneJS متکی است. اگر taskهای asynchronousی وجود دارند که باید مانع serialization شوند، برنامه‌ای
که از ZoneJS استفاده نمی‌کند باید با service مربوط به [PendingTasks](/api/core/PendingTasks)، Angular را از وجود آن‌ها آگاه کند. serialization
تا نخستین لحظه‌ای که همه taskهای در انتظار حذف شوند، منتظر می‌ماند.

یکی از دو روش ساده استفاده از pending taskها، متد `run` است:

```typescript
const taskService = inject(PendingTasks);
taskService.run(async () => {
  const someResult = await doSomeWorkThatNeedsToBeRendered();
  this.someState.set(someResult);
});
```

برای use caseهای پیچیده‌تر، می‌توانید یک pending task را به‌صورت دستی اضافه و حذف کنید:

```typescript
const taskService = inject(PendingTasks);
const taskCleanup = taskService.add();
try {
  await doSomeWorkThatNeedsToBeRendered();
} catch {
  // handle error
} finally {
  taskCleanup();
}
```

علاوه بر این، helper مربوط به [pendingUntilEvent](/api/core/rxjs-interop/pendingUntilEvent#) در `rxjs-interop` تضمین می‌کند
که برنامه تا زمان انتشار مقدار، تکمیل، رخ‌دادن خطا یا لغو subscription مربوط به observable، ناپایدار باقی بماند.

```typescript
readonly myObservableState = someObservable.pipe(pendingUntilEvent());
```

framework نیز درون خود از این service استفاده می‌کند تا پیش از تکمیل taskهای asynchronous از serialization جلوگیری کند. این taskها شامل navigation در حال اجرای Router و request تکمیل‌نشده `HttpClient` هستند، اما به این موارد محدود نمی‌شوند.

### Reactive formها در برنامه‌های Zoneless

به‌روزرسانی‌های مدل reactive form (مانند `setValue`،‏ `patchValue`،‏ `FormArray.push` و APIهای مشابه) وضعیت form را به‌روزرسانی و observableهای آن را منتشر می‌کنند، اما به‌طور خودکار change detection مربوط به component را زمان‌بندی نمی‌کنند.

اگر یک template به وضعیت reactive form وابسته است، observableهای form را به یک اعلان change detection متصل کنید (برای مثال `ChangeDetectorRef.markForCheck()`)، یا داده‌ها را از طریق signalهایی که template مصرف می‌کند بازتاب دهید.

## تست و اشکال‌زدایی

### استفاده از Zoneless در `TestBed`

وقتی `zone.js` از طریق `polyfills` بارگذاری شده باشد، `TestBed` به‌طور پیش‌فرض از change detection مبتنی بر Zone استفاده می‌کند.

اگر `zone.js` وجود نداشته باشد، `TestBed` به‌طور پیش‌فرض بدون Zone اجرا می‌شود. برای اجبار حالت Zoneless هنگام بارگذاری `zone.js`،‏ `provideZonelessChangeDetection()` را اضافه کنید:

```typescript
TestBed.configureTestingModule({
  // Optional: include the provider to force the testing environment
  // uses the same zoneless behavior as a zoneless application.
  providers: [provideZonelessChangeDetection()],
});

const fixture = TestBed.createComponent(MyComponent);
await fixture.whenStable();
```

برای اینکه رفتار تست‌ها تا حد ممکن به کد production شبیه باشد،
هرجا ممکن است از `fixture.detectChanges()` استفاده نکنید. این دستور change detection را
در زمانی اجرا می‌کند که Angular در حالت عادی آن را زمان‌بندی نکرده است.
تست‌ها باید از انجام‌شدن این اعلان‌ها مطمئن شوند و اجازه دهند Angular زمان همگام‌سازی
وضعیت را مدیریت کند، نه اینکه آن را به‌صورت دستی در تست تحمیل کنند.

استفاده از `fixture.detectChanges()` در مجموعه‌تست‌های موجود الگویی رایج است
و احتمالاً تبدیل همه آن‌ها به `await fixture.whenStable()` ارزش صرف زمان را ندارد. `TestBed` همچنان
سازگاری component مربوط به fixture با `OnPush` را بررسی می‌کند و اگر متوجه شود مقادیر template بدون
اعلان تغییر به‌روزرسانی شده‌اند، `ExpressionChangedAfterItHasBeenCheckedError` ایجاد می‌کند
(برای مثال `fixture.componentInstance.someValue = 'newValue';`).
اگر component در production استفاده می‌شود، باید با استفاده از signalها برای state یا فراخوانی `ChangeDetectorRef.markForCheck()` این مشکل را برطرف کنید.
اگر component فقط wrapper تست است و هرگز در برنامه استفاده نمی‌شود،
استفاده از `fixture.changeDetectorRef.markForCheck()` قابل‌قبول است.

### بررسی حالت debug برای اطمینان از تشخیص به‌روزرسانی‌ها

Angular ابزار دیگری نیز برای بررسی این موضوع ارائه می‌کند که آیا برنامه
state را به روشی سازگار با Zoneless به‌روزرسانی می‌کند یا نه. می‌توان از `provideCheckNoChangesConfig({exhaustive: true, interval: <milliseconds>})`
برای بررسی دوره‌ای استفاده کرد تا مطمئن شوید هیچ bindingای
بدون اعلان به‌روزرسانی نشده است. اگر binding به‌روزشده‌ای وجود داشته باشد که change detection
بدون Zone آن را refresh نمی‌کند، Angular خطای `ExpressionChangedAfterItHasBeenCheckedError` ایجاد می‌کند.
