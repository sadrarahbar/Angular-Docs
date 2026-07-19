# مهاجرت از NgStyle به style bindingها

این schematic استفاده‌های directive مربوط به NgStyle را در برنامه شما به style bindingها migrate می‌کند. فقط usageهایی را migrate می‌کند که safe در نظر گرفته می‌شوند.

schematic را با command زیر اجرا کنید:

```bash
ng generate @angular/core:ngstyle-to-style
```

#### قبل

```html
<div [ngStyle]="{'background-color': 'red'}"></div>
```

#### بعد

```html
<div [style]="{'background-color': 'red'}"></div>
```

## گزینه‌های پیکربندی

این migration چند گزینه برای fine-tune کردن migration مطابق نیازهای مشخص شما پشتیبانی می‌کند.

### `--best-effort-mode`

به صورت پیش‌فرض، migration از migrate کردن usageهای `NgStyle` که object reference دارند خودداری می‌کند. وقتی flag مربوط به `--best-effort-mode` فعال باشد، instanceهای `ngStyle` که به object referenceها bind شده‌اند هم migrate می‌شوند. این می‌تواند برای migrate کردن unsafe باشد؛ برای مثال اگر object bind شده mutate شود.

```html
<div [ngStyle]="styleObject"></div>
```

به

```html
<div [style]="styleObject"></div>
```

