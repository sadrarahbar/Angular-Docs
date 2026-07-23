# مهاجرت به تابع `inject`

تابع [`inject`](/api/core/inject) در Angular در مقایسه با injection مبتنی بر constructor، نوع‌های دقیق‌تر و سازگاری بهتری با decoratorهای استاندارد ارائه می‌دهد.

این schematic،‏ injection مبتنی بر constructor را در classهای شما به استفاده از تابع [`inject`](/api/core/inject) تبدیل می‌کند.

schematic را با دستور زیر اجرا کنید:

```shell
ng generate @angular/core:inject
```

#### پیش از مهاجرت

```typescript
import {Component, Inject, Optional} from '@angular/core';
import {MyService} from './service';
import {DI_TOKEN} from './token';

@Component()
export class MyComp {
  constructor(
    private service: MyService,
    @Inject(DI_TOKEN) @Optional() readonly token: string,
  ) {}
}
```

#### پس از مهاجرت

```typescript
import {Component, inject} from '@angular/core';
import {MyService} from './service';
import {DI_TOKEN} from './token';

@Component()
export class MyComp {
  private service = inject(MyService);
  readonly token = inject(DI_TOKEN, {optional: true});
}
```

## گزینه‌های مهاجرت

مهاجرت چند گزینه برای سفارشی‌کردن خروجی دارد.

### `path`

sub-path پروژه را که باید مهاجرت داده شود مشخص می‌کند. برای مهاجرت کل پوشه، `.` را وارد کنید یا آن را خالی
بگذارید.

### `migrateAbstractClasses`

Angular قابل inject بودن پارامترهای classهای abstract را اعتبارسنجی نمی‌کند. بنابراین
مهاجرت نمی‌تواند بدون خطر ایجاد breaking change آن‌ها را با اطمینان به [`inject`](/api/core/inject) تبدیل کند؛ به همین دلیل
این گزینه به‌طور پیش‌فرض غیرفعال است. اگر می‌خواهید classهای abstract مهاجرت داده شوند آن را فعال کنید، اما توجه داشته باشید
که ممکن است لازم شود **برخی خرابی‌ها را دستی رفع کنید**.

### `backwardsCompatibleConstructors`

مهاجرت به‌طور پیش‌فرض تلاش می‌کند کد را تا حد ممکن پاک‌سازی کند؛ از جمله حذف
پارامترهای constructor یا حتی کل constructor در صورتی که کدی نداشته باشد.
در برخی موارد، وقتی classهای دارای decorator در Angular از classهای دیگری با decoratorهای Angular ارث‌بری می‌کنند،
این کار ممکن است خطای compilation ایجاد کند. با فعال‌کردن این گزینه، مهاجرت
یک signature دیگر برای constructor تولید می‌کند تا سازگاری با نسخه قبل حفظ شود، البته به قیمت کد بیشتر.

#### پیش از مهاجرت

```typescript
import {Component} from '@angular/core';
import {MyService} from './service';

@Component()
export class MyComp {
  constructor(private service: MyService) {}
}
```

#### پس از مهاجرت

```ts
import { Component } from '@angular/core';
import { MyService } from './service';

@Component()
export class MyComp {
private service = inject(MyService);

  /\*_ Inserted by Angular inject() migration for backwards compatibility _/
  constructor(...args: unknown[]);

  constructor() {}
}
```

### `nonNullableOptional`

اگر injection برای پارامتری با decorator مربوط به `@Optional` شکست بخورد، Angular مقدار `null` برمی‌گرداند؛ بنابراین
نوع واقعی هر پارامتر `@Optional` شامل `| null` خواهد بود. اما چون decoratorها
نمی‌توانند بر نوع اثر بگذارند، کدهای موجود زیادی نوع نادرست دارند. نوع در `inject()` اصلاح شده و
ممکن است خطاهای compilation جدیدی ظاهر شوند. با فعال‌کردن این گزینه،
مهاجرت یک non-null assertion پس از فراخوانی `inject()` تولید می‌کند تا با نوع قدیمی مطابقت داشته باشد،
البته با احتمال پنهان‌شدن خطاهای نوع.

**توجه:** non-null assertion به پارامترهایی که از قبل nullable هستند افزوده نمی‌شود،
زیرا کد وابسته به آن‌ها احتمالاً nullable بودنشان را در نظر گرفته است.

#### پیش از مهاجرت

```typescript
import {Component, Inject, Optional} from '@angular/core';
import {TOKEN_ONE, TOKEN_TWO} from './token';

@Component()
export class MyComp {
  constructor(
    @Inject(TOKEN_ONE) @Optional() private tokenOne: number,
    @Inject(TOKEN_TWO) @Optional() private tokenTwo: string | null,
  ) {}
}
```

#### پس از مهاجرت

```typescript
import {Component, inject} from '@angular/core';
import {TOKEN_ONE, TOKEN_TWO} from './token';

@Component()
export class MyComp {
  // Note the `!` at the end.
  private tokenOne = inject(TOKEN_ONE, {optional: true})!;

  // Does not have `!` at the end, because the type was already nullable.
  private tokenTwo = inject(TOKEN_TWO, {optional: true});
}
```
