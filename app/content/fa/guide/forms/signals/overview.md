<docs-decorative-header title="Formها با Angular Signals" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

Signal Forms کتابخانه‌ای است که به شما اجازه می‌دهد با تکیه بر foundation reactive مربوط به signalها، form state را در applicationهای Angular مدیریت کنید. با two-way binding خودکار، field access با type safety، و validation مبتنی بر schema، Signal Forms به شما کمک می‌کند formهای robust بسازید.

TIP: برای معرفی سریع Signal Forms، [راهنمای ضروری Signal Forms](essentials/signal-forms) را ببینید.

## چرا Signal Forms؟

ساخت form در web applicationها شامل مدیریت چند concern به‌هم‌پیوسته است: track کردن field valueها، validate کردن user input، مدیریت error stateها، و هماهنگ نگه داشتن UI با data model. مدیریت جداگانه این concernها boilerplate code و complexity ایجاد می‌کند.

Signal Forms این چالش‌ها را این‌طور حل می‌کند:

- **هماهنگ‌سازی خودکار state** - Form data model را به‌صورت خودکار با form fieldهای bind شده sync می‌کند
- **فراهم کردن type safety** - Schemaها و bindingهای کاملا type safe بین UI controlهای شما و data model را پشتیبانی می‌کند
- **Centralize کردن validation logic** - همه validation ruleها را در یک محل و با استفاده از validation schema تعریف کنید

Signal Forms در applicationهای جدیدی که با signalها ساخته شده‌اند بهترین نتیجه را می‌دهد. اگر با application موجودی کار می‌کنید که از reactive forms استفاده می‌کند، یا به guaranteeهای production stability نیاز دارید، reactive formها همچنان انتخاب محکمی هستند.

NOTE: اگر از template یا reactive forms می‌آیید، ممکن است [راهنمای مقایسه](guide/forms/signals/comparison) برایتان مفید باشد.

## پیش‌نیازها

Signal Forms نیاز دارد به:

- Angular v21 یا بالاتر

## Setup

Signal Forms از قبل در package مربوط به `@angular/forms` وجود دارد. Functionها و directiveهای لازم را از `@angular/forms/signals` import کنید:

```ts
import {form, FormField, required, email} from '@angular/forms/signals';
```

Directive مربوط به `FormField` باید در هر componentای که form fieldها را به HTML inputها bind می‌کند import شود:

```ts
@Component({
  // ...
  imports: [FormField],
})
```

## قدم بعدی

برای یادگیری بیشتر درباره نحوه کار Signal Forms، راهنماهای زیر را ببینید:

<docs-pill-row>
  <docs-pill href="essentials/signal-forms" title="مبانی Signal forms" />
  <docs-pill href="guide/forms/signals/models" title="Form modelها" />
  <docs-pill href="guide/forms/signals/model-design" title="طراحی form model" />
  <docs-pill href="guide/forms/signals/field-state-management" title="مدیریت field state" />
  <docs-pill href="guide/forms/signals/validation" title="Validation" />
  <docs-pill href="guide/forms/signals/custom-controls" title="Custom controlها" />
  <docs-pill href="guide/forms/signals/comparison" title="مقایسه با سیستم‌های form دیگر" />
</docs-pill-row>
