# مهاجرت به تابع output

Angular در نسخه v17.3 یک API بهبودیافته برای outputها معرفی کرد که
از v19 برای production آماده محسوب می‌شود. این API مشابه API مربوط به `input()` است، اما بر Signalها مبتنی نیست.
درباره تابع output برای custom eventها و مزایای آن در [راهنمای اختصاصی](guide/components/outputs) بیشتر بخوانید.

برای پشتیبانی از پروژه‌های موجودی که می‌خواهند از تابع output استفاده کنند، تیم Angular
مهاجرت خودکاری ارائه می‌دهد که custom eventهای `@Output` را به API جدید `output()` تبدیل می‌کند.

schematic را با دستور زیر اجرا کنید:

```bash
ng generate @angular/core:output-migration
```

## مهاجرت چه چیزهایی را تغییر می‌دهد؟

1. memberهای class از نوع `@Output()` به معادل `output()` به‌روزرسانی می‌شوند.
2. importهای فایل componentها یا directiveها در سطح module مربوط به TypeScript نیز به‌روزرسانی می‌شوند.
3. فراخوانی‌های API مانند `event.next()` که توصیه نمی‌شود به `event.emit()` مهاجرت داده و فراخوانی‌های `event.complete()` حذف می‌شوند.

**پیش از مهاجرت**

```typescript
import {Component, Output, EventEmitter} from '@angular/core';

@Component({
  template: `<button (click)="someMethod('test')">emit</button>`,
})
export class MyComponent {
  @Output() someChange = new EventEmitter<string>();

  someMethod(value: string): void {
    this.someChange.emit(value);
  }
}
```

**پس از مهاجرت**

```typescript
import {Component, output} from '@angular/core';

@Component({
  template: `<button (click)="someMethod('test')">emit</button>`,
})
export class MyComponent {
  readonly someChange = output<string>();

  someMethod(value: string): void {
    this.someChange.emit(value);
  }
}
```

## گزینه‌های پیکربندی

مهاجرت چند گزینه برای تنظیم دقیق متناسب با نیازهای شما دارد.

### `--path`

اگر مشخص نشود، مهاجرت مسیر را از شما می‌پرسد و کل workspace مربوط به Angular CLI را به‌روزرسانی می‌کند.
با این گزینه می‌توانید مهاجرت را به یک subdirectory مشخص محدود کنید.

### `--analysis-dir`

در پروژه‌های بزرگ می‌توانید با این گزینه تعداد فایل‌های تحلیل‌شده را کاهش دهید.
مهاجرت به‌طور پیش‌فرض و مستقل از گزینه `--path`، کل workspace را تحلیل می‌کند تا
تمام referenceهای تحت‌تأثیر مهاجرت `@Output()` را به‌روزرسانی کند.

با این گزینه می‌توانید تحلیل را به یک subfolder محدود کنید. توجه کنید در این حالت
referenceهای بیرون این پوشه بدون هشدار نادیده گرفته می‌شوند و ممکن است build خراب شود.

این گزینه‌ها را مانند زیر به‌کار ببرید:

```bash
ng generate @angular/core:output-migration --path src/app/sub-folder
```

## موارد استثنا

در برخی موارد مهاجرت کد را تغییر نمی‌دهد.
یکی از این موارد زمانی است که event همراه با method مربوط به `pipe()` استفاده شده باشد.
کد زیر مهاجرت داده نمی‌شود:

```typescript
export class MyDialogComponent {
  @Output() close = new EventEmitter<void>();
  doSome(): void {
    this.close.complete();
  }
  otherThing(): void {
    this.close.pipe();
  }
}
```
