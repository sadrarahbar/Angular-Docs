# مهاجرت به syntax کنترل جریان

[syntax کنترل جریان](guide/templates/control-flow) از Angular v17 در دسترس است. syntax جدید در خود template قرار دارد، بنابراین دیگر لازم نیست `CommonModule` را import کنید.

این schematic همه کدهای موجود در برنامه شما را migrate می‌کند تا از Control Flow Syntax جدید استفاده کنند.

schematic را با command زیر اجرا کنید:

```shell
ng generate @angular/core:control-flow
```

## تغییرات breaking

### reuse شدن view در `@for`

اگر در block مربوط به `@for`، property استفاده‌شده در expression مربوط به `track` تغییر کند اما reference خود object ثابت بماند، یعنی تغییر in-place انجام شود، Angular به جای destroy و recreate کردن element، bindingهای view، از جمله inputهای کامپوننت، را به‌روز می‌کند.

این رفتار با `*ngFor` متفاوت است؛ در سناریوی مشابه، اگر تابع `trackBy` مقدار متفاوتی برگرداند، `*ngFor` باعث remount شدن element، یعنی destroy و recreate، می‌شود.

