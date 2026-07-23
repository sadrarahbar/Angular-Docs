# مهاجرت به signal inputها

Angular یک API بهبودیافته برای inputها معرفی کرده است که از
نسخه v19 برای production آماده محسوب می‌شود.
درباره signal inputها و مزایای آن‌ها در [راهنمای اختصاصی](guide/components/inputs) بیشتر بخوانید.

برای پشتیبانی از تیم‌های موجودی که می‌خواهند از signal input استفاده کنند، تیم Angular
مهاجرت خودکاری ارائه می‌دهد که fieldهای `@Input` را به API جدید `input()` تبدیل می‌کند.

schematic را با دستور زیر اجرا کنید:

```bash
ng generate @angular/core:signal-input-migration
```

همچنین این مهاجرت به‌صورت [عملیات code refactor](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_refactoring) در VSCode در دسترس است.
جدیدترین نسخه extension مربوط به VSCode را نصب و روی یک field از نوع `@Input` کلیک کنید.
جزئیات بیشتر را در [بخش پایین](#vscode-extension) ببینید.

## مهاجرت چه چیزهایی را تغییر می‌دهد؟

1. memberهای class از نوع `@Input()` به معادل signal یعنی `input()` به‌روزرسانی می‌شوند.
2. referenceهای inputهای مهاجرت‌داده‌شده برای فراخوانی signal به‌روزرسانی می‌شوند.
   - این موارد شامل referenceها در template،‏ host binding یا کد TypeScript است.

**پیش از مهاجرت**

```angular-ts
import {Component, Input} from '@angular/core';

@Component({
  template: `Name: {{ name ?? '' }}`,
})
export class MyComponent {
  @Input() name: string | undefined = undefined;

  someMethod(): number {
    if (this.name) {
      return this.name.length;
    }
    return -1;
  }
}
```

**پس از مهاجرت**

```angular-ts {[[4],[7], [10,12]]}
import {Component, input} from '@angular/core';

@Component({
  template: `Name: {{ name() ?? '' }}`,
})
export class MyComponent {
  readonly name = input<string>();

  someMethod(): number {
    const name = this.name();
    if (name) {
      return name.length;
    }
    return -1;
  }
}
```

## گزینه‌های پیکربندی

مهاجرت چند گزینه برای تنظیم دقیق متناسب با نیازهای شما دارد.

### `--path`

مهاجرت به‌طور پیش‌فرض کل workspace مربوط به Angular CLI را به‌روزرسانی می‌کند.
با این گزینه می‌توانید مهاجرت را به یک subdirectory مشخص محدود کنید.

### `--best-effort-mode`

مهاجرت به‌طور پیش‌فرض inputهایی را که مهاجرت امن آن‌ها ممکن نیست نادیده می‌گیرد.
مهاجرت تلاش می‌کند کد را تا حد امکان ایمن بازآرایی کند.

با فعال‌بودن flag مربوط به `--best-effort-mode`، مهاجرت با جدیت
تلاش می‌کند بیشترین مقدار ممکن را مهاجرت دهد، حتی اگر build را خراب کند.

### `--insert-todos`

در صورت فعال‌بودن، مهاجرت برای inputهایی که قابل مهاجرت نبودند TODO اضافه می‌کند.
TODOها دلیل نادیده‌گرفتن input را توضیح می‌دهند. برای مثال:

```ts
// TODO: Skipped for migration because:
//  Your application code writes to the input. This prevents migration.
@Input() myInput = false;
```

### `--analysis-dir`

در پروژه‌های بزرگ می‌توانید با این گزینه تعداد فایل‌های تحلیل‌شده را کاهش دهید.
مهاجرت به‌طور پیش‌فرض و مستقل از گزینه `--path`، کل workspace را تحلیل می‌کند تا
تمام referenceهای تحت‌تأثیر مهاجرت `@Input()` را به‌روزرسانی کند.

با این گزینه می‌توانید تحلیل را به یک subfolder محدود کنید. توجه کنید در این حالت
referenceهای بیرون این پوشه بدون هشدار نادیده گرفته می‌شوند و ممکن است build خراب شود.

## extension مربوط به VSCode

![تصویری از extension مربوط به VSCode و کلیک روی یک field از نوع `@Input`](assets/images/migrations/signal-inputs-vscode.png 'تصویری از extension مربوط به VSCode و کلیک روی یک field از نوع `@Input`.')

مهاجرت به‌صورت [عملیات code refactor](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_refactoring) در VSCode در دسترس است.

برای استفاده از مهاجرت در VSCode، جدیدترین نسخه extension مربوط به VSCode را نصب کنید و روی یکی از موارد زیر کلیک کنید:

- یک field از نوع `@Input`.
- یا یک directive/component.

سپس منتظر بمانید button زردرنگ lightbulb مربوط به refactoring در VSCode ظاهر شود.
از طریق این button می‌توانید مهاجرت signal input را انتخاب کنید.
