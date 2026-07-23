# مهاجرت به signal queryها

Angular APIهای بهبودیافته‌ای برای queryها معرفی کرده است که از
نسخه v19 برای production آماده محسوب می‌شوند.
درباره signal queryها و مزایای آن‌ها در [راهنمای اختصاصی](guide/components/queries) بیشتر بخوانید.

برای پشتیبانی از تیم‌های موجودی که می‌خواهند از signal query استفاده کنند، تیم Angular
مهاجرت خودکاری ارائه می‌دهد که fieldهای query مبتنی بر decorator را به API جدید تبدیل می‌کند.

schematic را با دستور زیر اجرا کنید:

```bash
ng generate @angular/core:signal-queries-migration
```

همچنین این مهاجرت به‌صورت [عملیات code refactor](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_refactoring) در VSCode در دسترس است.
جدیدترین نسخه extension مربوط به VSCode را نصب و برای مثال روی یک field از نوع `@ViewChild` کلیک کنید.
جزئیات بیشتر را در [بخش پایین](#vscode-extension) ببینید.

## مهاجرت چه چیزهایی را تغییر می‌دهد؟

1. memberهای class از نوع `@ViewChild()`،‏ `@ViewChildren`،‏ `@ContentChild` و `@ContentChildren`
   به معادل‌های signal خود به‌روزرسانی می‌شوند.
2. referenceهای موجود در برنامه به queryهای مهاجرت‌داده‌شده برای فراخوانی signal به‌روزرسانی می‌شوند.
   - این موارد شامل referenceها در template،‏ host binding یا کد TypeScript است.

**پیش از مهاجرت**

```angular-ts
import {Component, ContentChild} from '@angular/core';

@Component({
  template: `Has ref: {{ someRef ? 'Yes' : 'No' }}`,
})
export class MyComponent {
  @ContentChild('someRef') ref: ElementRef | undefined = undefined;

  someMethod(): void {
    if (this.ref) {
      this.ref.nativeElement;
    }
  }
}
```

**پس از مهاجرت**

```angular-ts
import {Component, contentChild} from '@angular/core';

@Component({
  template: `Has ref: {{ someRef() ? 'Yes' : 'No' }}`,
})
export class MyComponent {
  readonly ref = contentChild<ElementRef>('someRef');

  someMethod(): void {
    const ref = this.ref();
    if (ref) {
      ref.nativeElement;
    }
  }
}
```

## گزینه‌های پیکربندی

مهاجرت چند گزینه برای تنظیم دقیق متناسب با نیازهای شما دارد.

### `--path`

مهاجرت به‌طور پیش‌فرض کل workspace مربوط به Angular CLI را به‌روزرسانی می‌کند.
با این گزینه می‌توانید مهاجرت را به یک subdirectory مشخص محدود کنید.

### `--best-effort-mode`

مهاجرت به‌طور پیش‌فرض queryهایی را که مهاجرت امن آن‌ها ممکن نیست نادیده می‌گیرد.
مهاجرت تلاش می‌کند کد را تا حد امکان ایمن بازآرایی کند.

با فعال‌بودن flag مربوط به `--best-effort-mode`، مهاجرت با جدیت
تلاش می‌کند بیشترین مقدار ممکن را مهاجرت دهد، حتی اگر build را خراب کند.

### `--insert-todos`

در صورت فعال‌بودن، مهاجرت برای queryهایی که قابل مهاجرت نبودند TODO اضافه می‌کند.
TODOها دلیل نادیده‌گرفتن queryها را توضیح می‌دهند. برای مثال:

```ts
// TODO: Skipped for migration because:
//  Your application code writes to the query. This prevents migration.
@ViewChild('ref') ref?: ElementRef;
```

### `--analysis-dir`

در پروژه‌های بزرگ می‌توانید با این گزینه تعداد فایل‌های تحلیل‌شده را کاهش دهید.
مهاجرت به‌طور پیش‌فرض و مستقل از گزینه `--path`، کل workspace را تحلیل می‌کند تا
تمام referenceهای تحت‌تأثیر declaration مربوط به query مهاجرت‌داده‌شده را به‌روزرسانی کند.

با این گزینه می‌توانید تحلیل را به یک subfolder محدود کنید. توجه کنید در این حالت
referenceهای بیرون این پوشه بدون هشدار نادیده گرفته می‌شوند و ممکن است build خراب شود.

## extension مربوط به VSCode

![تصویری از extension مربوط به VSCode و کلیک روی یک field از نوع `@ViewChild`](assets/images/migrations/signal-queries-vscode.png 'تصویری از extension مربوط به VSCode و کلیک روی یک field از نوع `@ViewChild`.')

مهاجرت به‌صورت [عملیات code refactor](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_refactoring) در VSCode در دسترس است.

برای استفاده از مهاجرت در VSCode، جدیدترین نسخه extension مربوط به VSCode را نصب کنید و روی یکی از موارد زیر کلیک کنید:

- یک field از نوع `@ViewChild`،‏ `@ViewChildren`،‏ `@ContentChild` یا `@ContentChildren`.
- یک directive/component.

سپس منتظر بمانید button زردرنگ lightbulb مربوط به refactoring در VSCode ظاهر شود.
از طریق این button می‌توانید مهاجرت signal query را انتخاب کنید.
