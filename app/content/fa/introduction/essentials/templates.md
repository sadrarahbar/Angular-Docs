<docs-decorative-header title="Templateها" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
از syntax مربوط به template در Angular برای ساخت رابط‌های کاربری پویا استفاده کنید.
</docs-decorative-header>

templateهای کامپوننت فقط HTML ایستا نیستند؛ آن‌ها می‌توانند از داده‌های class کامپوننت شما استفاده کنند و handlerهایی برای تعامل کاربر تنظیم کنند.

## نمایش متن پویا

در Angular، یک _binding_ ارتباطی پویا بین template کامپوننت و داده‌های آن ایجاد می‌کند. این ارتباط تضمین می‌کند که تغییرات داده‌های کامپوننت، template render شده را به صورت خودکار به‌روز کند.

برای نمایش یک متن پویا در template، می‌توانید با استفاده از دو آکولاد یک binding بسازید:

```angular-ts
@Component({
  selector: 'user-profile',
  template: `<h1>Profile for {{ userName() }}</h1>`,
})
export class UserProfile {
  userName = signal('pro_programmer_123');
}
```

وقتی Angular کامپوننت را render می‌کند، این را می‌بینید:

```html
<h1>Profile for pro_programmer_123</h1>
```

Angular وقتی مقدار signal تغییر می‌کند، binding را به صورت خودکار به‌روز نگه می‌دارد. با ادامه دادن مثال بالا، اگر مقدار signal مربوط به `userName` را به‌روز کنیم:

```typescript
this.userName.set('cool_coder_789');
```

صفحه render شده به‌روز می‌شود تا مقدار جدید را نشان دهد:

```html
<h1>Profile for cool_coder_789</h1>
```

## تنظیم propertyها و attributeهای پویا

Angular از binding مقدارهای پویا به propertyهای DOM با براکت پشتیبانی می‌کند:

```angular-ts
@Component({
  /*...*/
  // Set the `disabled` property of the button based on the value of `isValidUserId`.
  template: `<button [disabled]="!isValidUserId()">Save changes</button>`,
})
export class UserProfile {
  isValidUserId = signal(false);
}
```

همچنین می‌توانید با اضافه کردن پیشوند `attr.` به نام attribute، به _attribute_های HTML هم bind کنید:

```angular-html
<!-- Bind the `role` attribute on the `<ul>` element to value of `listRole`. -->
<ul [attr.role]="listRole()"></ul>
```

Angular وقتی مقدار bind شده تغییر می‌کند، propertyها و attributeهای DOM را به صورت خودکار به‌روز می‌کند.

## مدیریت تعامل کاربر

Angular به شما اجازه می‌دهد با پرانتز، event listenerها را به یک element در template اضافه کنید:

```angular-ts
@Component({
  /*...*/
  // Add an 'click' event handler that calls the `cancelSubscription` method.
  template: `<button (click)="cancelSubscription()">Cancel subscription</button>`,
})
export class UserProfile {
  /* ... */

  cancelSubscription() {
    /* Your event handling code goes here. */
  }
}
```

اگر لازم است object مربوط به [event](https://developer.mozilla.org/docs/Web/API/Event) را به listener خود پاس بدهید، می‌توانید از variable داخلی Angular یعنی `$event` داخل فراخوانی تابع استفاده کنید:

```angular-ts
@Component({
  /*...*/
  // Add an 'click' event handler that calls the `cancelSubscription` method.
  template: `<button (click)="cancelSubscription($event)">Cancel subscription</button>`,
})
export class UserProfile {
  /* ... */

  cancelSubscription(event: Event) {
    /* Your event handling code goes here. */
  }
}
```

## کنترل جریان با `@if` و `@for`

می‌توانید با block مربوط به `@if` در Angular، بخش‌هایی از template را به صورت شرطی پنهان یا نمایش دهید:

```angular-html
<h1>User profile</h1>

@if (isAdmin()) {
  <h2>Admin settings</h2>
  <!-- ... -->
}
```

block مربوط به `@if` از block اختیاری `@else` هم پشتیبانی می‌کند:

```angular-html
<h1>User profile</h1>

@if (isAdmin()) {
  <h2>Admin settings</h2>
  <!-- ... -->
} @else {
  <h2>User settings</h2>
  <!-- ... -->
}
```

می‌توانید بخشی از یک template را با block مربوط به `@for` در Angular چندین بار تکرار کنید:

```angular-html
<h1>User profile</h1>

<ul class="user-badge-list">
  @for (badge of badges(); track badge.id) {
    <li class="user-badge">{{ badge.name }}</li>
  }
</ul>
```

Angular از keyword مربوط به `track` که در مثال بالا نشان داده شده، برای مرتبط کردن داده با elementهای DOM ساخته‌شده توسط `@for` استفاده می‌کند. برای اطلاعات بیشتر، [_چرا track در blockهای @for مهم است؟_](guide/templates/control-flow#why-is-track-in-for-blocks-important) را ببینید.

TIP: می‌خواهید درباره templateهای Angular بیشتر بدانید؟ برای جزئیات کامل، [راهنمای عمیق Templateها](guide/templates) را ببینید.

## قدم بعدی

حالا که در برنامه داده‌های پویا و template دارید، وقت آن است یاد بگیرید چطور templateها را با پنهان یا نمایش دادن شرطی بعضی elementها، loop کردن روی elementها و موارد بیشتر قدرتمندتر کنید.

<docs-pill-row>
  <docs-pill title="فرم‌ها با Signalها" href="essentials/signal-forms" />
  <docs-pill title="راهنمای عمیق template" href="guide/templates" />
</docs-pill-row>

