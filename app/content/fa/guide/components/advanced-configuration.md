# پیکربندی پیشرفته کامپوننت

TIP: این راهنما فرض می‌کند قبلاً [راهنمای Essentials](essentials) را خوانده‌اید. اگر تازه با Angular آشنا شده‌اید، اول آن را بخوانید.

## ChangeDetectionStrategy

decorator مربوط به `@Component` optionای به نام `changeDetection` می‌پذیرد که **change detection mode** کامپوننت را کنترل می‌کند. دو option برای change detection mode وجود دارد.

**`ChangeDetectionStrategy.Eager`/`Default`** یک mode اختیاری است. در این mode، هر زمان ممکن است activityای در سطح برنامه رخ داده باشد، Angular بررسی می‌کند آیا DOM کامپوننت به update نیاز دارد یا نه. activityهایی که این checking را trigger می‌کنند شامل تعامل کاربر، response شبکه، timerها و موارد دیگر هستند.

**`ChangeDetectionStrategy.OnPush`** strategy پیش‌فرض است \(از v22\). این mode مقدار checkingای را که Angular باید انجام دهد کاهش می‌دهد. در این mode، framework فقط زمانی بررسی می‌کند آیا DOM یک کامپوننت به update نیاز دارد یا نه که:

- یک component input در نتیجه binding داخل template تغییر کرده باشد، یا
- یک event listener در این کامپوننت اجرا شود
- کامپوننت صراحتاً برای check شدن mark شود، از طریق `ChangeDetectorRef.markForCheck` یا چیزی که آن را wrap می‌کند، مثل `AsyncPipe`.

علاوه بر این، وقتی یک کامپوننت OnPush بررسی می‌شود، Angular _همچنین_ همه کامپوننت‌های ancestor آن را هم بررسی می‌کند و در application tree رو به بالا حرکت می‌کند.

## PreserveWhitespaces

به صورت پیش‌فرض، Angular whitespaceهای اضافی در templateها را حذف و collapse می‌کند؛ معمولاً newlineها و indentation. می‌توانید این setting را با set کردن صریح `preserveWhitespaces` به `true` در metadata کامپوننت تغییر دهید.

## schemaهای custom element

به صورت پیش‌فرض، Angular وقتی با یک HTML element ناشناخته روبه‌رو شود error throw می‌کند. می‌توانید این behavior را برای یک کامپوننت با قرار دادن `CUSTOM_ELEMENTS_SCHEMA` در property مربوط به `schemas` در component metadata غیرفعال کنید.

```angular-ts
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

@Component({
  ...,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: '<some-unknown-component />'
})
export class ComponentWithCustomElements { }
```

Angular در حال حاضر از schema دیگری پشتیبانی نمی‌کند.

