# مهاجرت از NgClass به class bindingها

این schematic استفاده‌های directive مربوط به NgClass را در برنامه شما به class bindingها migrate می‌کند. فقط usageهایی را migrate می‌کند که safe در نظر گرفته می‌شوند.

schematic را با command زیر اجرا کنید:

```bash
ng generate @angular/core:ngclass-to-class
```

#### قبل

```html
<div [ngClass]="{admin: isAdmin, dense: density === 'high'}"></div>
```

#### بعد

```html
<div [class]="{admin: isAdmin, dense: density === 'high'}"></div>
```

## گزینه‌های پیکربندی

این migration چند گزینه برای fine-tune کردن migration مطابق نیازهای مشخص شما پشتیبانی می‌کند.

### `--migrate-space-separated-key`

به صورت پیش‌فرض، migration از migrate کردن usageهای `NgClass` که keyهای object literal در آن‌ها شامل class nameهای جداشده با فاصله هستند خودداری می‌کند. وقتی flag مربوط به `--migrate-space-separated-key` فعال باشد، برای هر key جداگانه یک binding ساخته می‌شود.

```html
<div [ngClass]="{'class1 class2': condition}"></div>
```

به

```html
<div [class.class1]="condition" [class.class2]="condition"></div>
```

