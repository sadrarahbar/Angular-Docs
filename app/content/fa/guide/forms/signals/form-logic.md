# اضافه کردن form logic

Signal Forms به شما اجازه می‌دهد با استفاده از schemaها به form خود logic اضافه کنید. Validation logic در [راهنمای Validation](guide/forms/signals/validation) پوشش داده شده و این راهنما ruleهای دیگر موجود در schemaها را بررسی می‌کند. می‌توانید fieldها را به‌صورت شرطی disable کنید، بر اساس valueهای دیگر hidden کنید، readonly کنید، user input را debounce کنید و برای custom controlها metadata attach کنید.

این راهنما نشان می‌دهد چطور از ruleهایی مثل `disabled()`، `hidden()`، `readonly()`، `debounce()` و `metadata()` برای کنترل رفتار field استفاده کنید.

## چه زمانی form logic اضافه کنیم

وقتی رفتار field به valueهای fieldهای دیگر وابسته است یا باید به‌صورت reactive update شود، از ruleها استفاده کنید. برای مثال:

- Coupon code fieldای که وقتی order total خیلی پایین است disabled می‌شود
- Address fieldای که مگر در صورت نیاز به shipping hidden است
- Search fieldای که برای کاهش API callها debounce می‌شود

## Ruleها چطور کار می‌کنند

Ruleها reactive logic را به fieldهای مشخصی در form شما bind می‌کنند. بیشتر ruleهای شرطی یک options object با functionای به نام `when` می‌پذیرند. Function مربوط به `when` هر زمان signalهایی که به آن‌ها ارجاع می‌دهد تغییر کنند، درست مثل یک `computed`، به‌صورت خودکار دوباره compute می‌شود.

```ts
const orderForm = form(this.orderModel, (schemaPath) => {
  disabled(schemaPath.couponCode, {when: ({valueOf}) => valueOf(schemaPath.total) < 50});
  //~~~~~~ ~~~~~~~~~~~~~~~~~~~~~  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //rule     path                   reactive logic function
});
```

Reactive logic functionها یک object از نوع `FieldContext` دریافت می‌کنند که از طریق helperهایی مثل `valueOf()` و `stateOf()` به field valueها و state دسترسی می‌دهد. این object معمولا destructure می‌شود تا مستقیم به helperها دسترسی داشته باشید.

NOTE: Parameter مربوط به schema callback، یعنی `schemaPath` در این مثال‌ها، objectای از نوع `SchemaPathTree` است که pathهای همه fieldهای form شما را فراهم می‌کند. می‌توانید این parameter را هر نامی که دوست دارید بگذارید.

برای جزئیات کامل درباره propertyها و methodهای `FieldContext`، [راهنمای Validation](guide/forms/signals/validation) را ببینید.

## جلوگیری از field updateها با `disabled()`

Rule مربوط به `disabled()`، disabled state یک field را configure می‌کند.

این rule با directive مربوط به `[formField]` کار می‌کند تا attribute مربوط به `disabled` را بر اساس state field به‌صورت خودکار bind کند؛ بنابراین لازم نیست `[disabled]="yourForm.fieldName().disabled()"` را دستی به template اضافه کنید.

NOTE: Fieldهای disabled، validation را skip می‌کنند؛ در form validation checkها شرکت نمی‌کنند. Value field حفظ می‌شود اما validate نمی‌شود. برای جزئیات رفتار validation، [راهنمای Validation](guide/forms/signals/validation) را ببینید.

### همیشه disabled

برای disable کردن دائمی یک field، `disabled()` را فقط با field path call کنید:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, disabled} from '@angular/forms/signals';

@Component({
  selector: 'app-settings',
  imports: [FormField],
  template: `
    <label>
      System ID (cannot be changed)
      <input [formField]="settingsForm.systemId" />
    </label>
  `,
})
export class Settings {
  settingsModel = signal({
    systemId: 'SYS-12345',
    userName: '',
  });

  settingsForm = form(this.settingsModel, (schemaPath) => {
    disabled(schemaPath.systemId);
  });
}
```

### Conditional disabling

برای disable کردن یک field بر اساس conditionها، functionای به نام `when` فراهم کنید که `true` (disabled) یا `false` (enabled) برگرداند:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, disabled} from '@angular/forms/signals';

@Component({
  selector: 'app-order',
  imports: [FormField],
  template: `
    <label>
      Order Total
      <input type="number" [formField]="orderForm.total" />
    </label>

    <label>
      Coupon Code
      <input [formField]="orderForm.couponCode" />
    </label>
  `,
})
export class Order {
  orderModel = signal({
    total: 25,
    couponCode: '',
  });

  orderForm = form(this.orderModel, (schemaPath) => {
    disabled(schemaPath.couponCode, {when: ({valueOf}) => valueOf(schemaPath.total) < 50});
  });
}
```

در این مثال، وقتی order total کمتر از $50 باشد، coupon code field disabled می‌شود.

### دلیل‌های disabled شدن

وقتی یک field را disable می‌کنید، با برگرداندن string به‌جای `true`، توضیح user-facing فراهم کنید:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, disabled} from '@angular/forms/signals';

@Component({
  selector: 'app-order',
  imports: [FormField],
  template: `
    <label>
      Order Total
      <input type="number" [formField]="orderForm.total" />
    </label>

    <label>
      Coupon Code
      <input [formField]="orderForm.couponCode" />
    </label>

    @if (orderForm.couponCode().disabled()) {
      <div class="info">
        @for (reason of orderForm.couponCode().disabledReasons(); track reason) {
          <p>{{ reason.message }}</p>
        }
      </div>
    }
  `,
})
export class Order {
  orderModel = signal({
    total: 25,
    couponCode: '',
  });

  orderForm = form(this.orderModel, (schemaPath) => {
    disabled(schemaPath.couponCode, {
      when: ({valueOf}) =>
        valueOf(schemaPath.total) < 50 ? 'Order must be $50 or more to use a coupon' : false,
    });
  });
}
```

Function مربوط به `when` این‌ها را برمی‌گرداند:

- یک **string** برای disable کردن field همراه با reason
- مقدار `false` برای enable کردن field؛ نه هر falsy value، بلکه explicit از `false` استفاده کنید

Reasonها را از طریق signal مربوط به `disabledReasons()` روی field state بخوانید. هر reason یک property به نام `message` دارد که شامل stringای است که برگردانده‌اید.

#### چند دلیل disabled شدن

همچنین می‌توانید `disabled()` را چند بار روی یک field call کنید و همه reasonهای برگشتی accumulate می‌شوند:

```angular-ts
orderForm = form(this.orderModel, (schemaPath) => {
  disabled(schemaPath.promoCode, {
    when: ({valueOf}) =>
      !valueOf(schemaPath.hasAccount) ? 'You must have an account to use promo codes' : false,
  });
  disabled(schemaPath.promoCode, {
    when: ({valueOf}) => (valueOf(schemaPath.total) < 25 ? 'Order must be at least $25' : false),
  });
});
```

اگر هر دو condition true باشند، field هر دو disabled reason را نشان می‌دهد. این pattern برای availability ruleهای پیچیده‌ای مفید است که می‌خواهید جدا نگه‌شان دارید.

## Configure کردن state مربوط به `hidden()` روی fieldها

Rule مربوط به `hidden()`، hidden state یک field را configure می‌کند. با این حال، این rule فقط یک programmatic state تنظیم می‌کند. **شما کنترل می‌کنید آیا field در UI ظاهر شود یا نه**.

IMPORTANT: برخلاف `disabled` و `readonly`، برای state مربوط به `hidden` هیچ DOM property بومی وجود ندارد. Directive مربوط به `[formField]` attribute مربوط به `hidden` را روی elementها اعمال نمی‌کند. باید در template خود از `@if` یا CSS استفاده کنید تا fieldها را بر اساس state مربوط به `hidden()` به‌صورت شرطی render کنید.

NOTE: مثل fieldهای disabled، fieldهای hidden هم validation را skip می‌کنند. برای جزئیات، [راهنمای Validation](guide/forms/signals/validation) را ببینید.

### Hidden کردن ساده field

از `hidden()` همراه با function مربوط به `when` استفاده کنید که `true` (hidden) یا `false` (visible) برگرداند:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, hidden} from '@angular/forms/signals';

@Component({
  selector: 'app-profile',
  imports: [FormField],
  template: `
    <label>
      <input type="checkbox" [formField]="profileForm.isPublic" />
      Make profile public
    </label>

    @if (!profileForm.publicUrl().hidden()) {
      <label>
        Public URL
        <input [formField]="profileForm.publicUrl" />
      </label>
    }
  `,
})
export class Profile {
  profileModel = signal({
    isPublic: false,
    publicUrl: '',
  });

  profileForm = form(this.profileModel, (schemaPath) => {
    hidden(schemaPath.publicUrl, {when: ({valueOf}) => !valueOf(schemaPath.isPublic)});
  });
}
```

## نمایش fieldهای غیرقابل ویرایش با `readonly()`

Rule مربوط به `readonly()` جلوی update کردن field توسط کاربر را می‌گیرد. Directive مربوط به `[FormField]` این state را به‌صورت خودکار به attribute HTML یعنی `readonly` bind می‌کند؛ attributeای که جلوی edit را می‌گیرد اما همچنان اجازه می‌دهد کاربران focus کنند و text را select کنند.

NOTE: Fieldهای readonly، [validation](guide/forms/signals/validation) را skip می‌کنند.

### همیشه readonly

برای readonly کردن دائمی یک field، `readonly()` را فقط با field path call کنید:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, readonly} from '@angular/forms/signals';

@Component({
  selector: 'app-account',
  imports: [FormField],
  template: `
    <label>
      Username (cannot be changed)
      <input [formField]="accountForm.username" />
    </label>

    <label>
      Email
      <input [formField]="accountForm.email" />
    </label>
  `,
})
export class Account {
  accountModel = signal({
    username: 'johndoe',
    email: 'john@example.com',
  });

  accountForm = form(this.accountModel, (schemaPath) => {
    readonly(schemaPath.username);
  });
}
```

Directive مربوط به `[FormField]` بر اساس state field، attribute مربوط به `readonly` را به‌صورت خودکار bind می‌کند.

### Conditional readonly

برای readonly کردن یک field بر اساس conditionها، یک function به نام `when` فراهم کنید:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, readonly} from '@angular/forms/signals';

@Component({
  selector: 'app-document',
  imports: [FormField],
  template: `
    <label>
      <input type="checkbox" [formField]="documentForm.isLocked" />
      Lock document
    </label>

    <label>
      Document Title
      <input [formField]="documentForm.title" />
    </label>
  `,
})
export class Document {
  documentModel = signal({
    isLocked: false,
    title: 'Untitled',
  });

  documentForm = form(this.documentModel, (schemaPath) => {
    readonly(schemaPath.title, {when: ({valueOf}) => valueOf(schemaPath.isLocked)});
  });
}
```

وقتی `isLocked` مقدار true داشته باشد، title field readonly می‌شود.

## انتخاب بین hidden، disabled و readonly

این سه configuration function، availability مربوط به field را به روش‌های متفاوت کنترل می‌کنند:

وقتی `hidden()` را انتخاب کنید که field:

- اصلا نباید در UI ظاهر شود
- به form state فعلی مربوط نیست
- مثال: shipping address fieldها وقتی "same as billing" checked است

وقتی `disabled()` را انتخاب کنید که field:

- باید visible باشد اما editable نباشد
- لازم است نشان دهد چرا unavailable است، با استفاده از disabled reasonها
- باید از HTML form submission حذف شود
- مثال: submit button که تا valid شدن form disabled است، approval fieldهایی که برای non-admin userها disabled هستند

وقتی `readonly()` را انتخاب کنید که field:

- باید visible باشد اما editable نباشد
- شامل dataای است که کاربران باید ببینند، select کنند یا copy کنند
- باید در HTML form submission لحاظ شود
- مثال: order confirmation number، reference codeهای system-generated

هر سه هنگام active بودن validation را skip می‌کنند و جلوی user editing را می‌گیرند. تفاوت‌های کلیدی:

| Feature                          | `hidden()` | `disabled()` | `readonly()` |
| -------------------------------- | ---------- | ------------ | ------------ |
| Visible in UI                    | No         | Yes          | Yes          |
| Users can focus/select           | No         | No           | Yes          |
| Included in HTML form submission | No         | No           | Yes          |

## Delay دادن input operationها با `debounce()`

Rule مربوط به `debounce()`، update شدن form model را delay می‌دهد. این برای performance optimization و کاهش operationهای غیرضروری هنگام input سریع مفید است.

### Debouncing چه کاری انجام می‌دهد

بدون debouncing، هر keystroke بلافاصله form model را update می‌کند. این می‌تواند موارد زیر را trigger کند:

- Computed signalهای گران‌هزینه‌ای که روی هر change دوباره calculate می‌شوند
- Validation checkها بعد از هر character
- API callها یا side effectهای دیگر که به model value گره خورده‌اند

Debouncing این updateها را delay می‌دهد و کار غیرضروری را کاهش می‌دهد.

### Debouncing ساده

می‌توانید با مشخص کردن delay بر حسب millisecond یک field را debounce کنید:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, debounce} from '@angular/forms/signals';

@Component({
  selector: 'app-search',
  imports: [FormField],
  template: `
    <label>
      Search
      <input [formField]="searchForm.query" />
    </label>

    <p>Searching for: {{ searchForm.query().value() }}</p>
  `,
})
export class Search {
  searchModel = signal({
    query: '',
  });

  searchForm = form(this.searchModel, (schemaPath) => {
    debounce(schemaPath.query, 300);
  });
}
```

با debounce برابر 300ms:

- کاربر داخل input field تایپ می‌کند
- Form model فقط بعد از 300ms نبود فعالیت در تایپ update می‌شود
- اگر کاربر به تایپ ادامه دهد، timer با هر keystroke reset می‌شود
- وقتی کاربر 300ms مکث کند، model با value نهایی update می‌شود

### Guaranteeهای timing

Function مربوط به `debounce()` با این mechanismها مطمئن می‌شود کاربران data از دست ندهند:

- **وقتی touched علامت‌گذاری شود:** Value بلافاصله sync می‌شود و هر debounce delay در انتظار abort می‌شود. این اتفاق وقتی field focus را از دست می‌دهد، یعنی blur، یا وقتی به‌صورت explicit touched علامت‌گذاری شود رخ می‌دهد.
- **هنگام form submission:** همه fieldها قبل از validation touched علامت‌گذاری می‌شوند؛ این کار مطمئن می‌کند همه debounced valueها بلافاصله sync شوند.

یعنی کاربران می‌توانند سریع تایپ کنند، tab بزنند و بیرون بروند، یا form را submit کنند، بدون اینکه منتظر تمام شدن debounce delayها بمانند.

### Custom debounce logic

برای کنترل پیشرفته، یک debouncer function فراهم کنید که کنترل کند value چه زمانی synchronize شود. این function هر بار که control value update شود call می‌شود و می‌تواند یا `undefined` برگرداند تا synchronization بلافاصله انجام شود، یا Promiseای برگرداند که تا resolve شدن آن جلوی synchronization را بگیرد:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, debounce} from '@angular/forms/signals';

@Component({
  selector: 'app-search',
  imports: [FormField],
  template: `
    <label>
      Search
      <input [formField]="searchForm.query" />
    </label>
  `,
})
export class Search {
  searchModel = signal({
    query: '',
  });

  searchForm = form(this.searchModel, (schemaPath) => {
    debounce(schemaPath.query, () => {
      // Return a promise that resolves after 500ms
      return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    });
  });
}
```

Debouncer function می‌تواند این‌ها را برگرداند:

- `undefined` برای synchronize کردن فوری value
- یک `Promise<void>` که تا resolve شدنش جلوی synchronization را می‌گیرد

Use caseهای custom debounce logic:

- پیاده‌سازی custom timing logic فراتر از delayهای ساده
- هماهنگ کردن synchronization با eventهای خارجی
- Debouncing شرطی بر اساس application state

### چه زمانی از debouncing استفاده کنیم

Debouncing وقتی بیشترین کاربرد را دارد که:

- Computed signalهای گران‌هزینه‌ای دارید که به field value وابسته‌اند
- Field باعث trigger شدن API call یا side effectهای دیگر می‌شود
- می‌خواهید validation overhead را هنگام تایپ سریع کم کنید
- Performance profiling نشان می‌دهد model updateها باعث slowdown می‌شوند

از debouncing استفاده نکنید اگر:

- Field برای UX خوب به update فوری نیاز دارد، مثل calculator inputها
- Performance benefit ناچیز است
- کاربران انتظار feedback real-time دارند

## مرتبط کردن data با field با استفاده از `metadata()`

Metadata، data reactive را به یک field attach می‌کند. Validation ruleها از این system به‌صورت داخلی استفاده می‌کنند، و شما می‌توانید keyهای خودتان را برای اطلاعات application-specific مثل help text، configuration یا computed display valueها publish کنید.

Signal Forms metadata keyهای از پیش تعریف‌شده‌ای فراهم می‌کند که validatorهای built-in به‌صورت خودکار populate می‌کنند:

| Key          | Populated by         | Read via              |
| ------------ | -------------------- | --------------------- |
| `REQUIRED`   | `required()`         | `field().required()`  |
| `MIN`        | `min()`, `minDate()` | `field().min()`       |
| `MAX`        | `max()`, `maxDate()` | `field().max()`       |
| `MIN_LENGTH` | `minLength()`        | `field().minLength()` |
| `MAX_LENGTH` | `maxLength()`        | `field().maxLength()` |
| `PATTERN`    | `pattern()`          | `field().pattern()`   |

Directive مربوط به `[formField]` پنج مورد از این‌ها، یعنی `REQUIRED`، `MIN`، `MAX`، `MIN_LENGTH` و `MAX_LENGTH` را به attribute متناظر HTML روی native form control bind می‌کند. `PATTERN` استثناست، چون Signal Forms از چند pattern برای هر field پشتیبانی می‌کند اما attribute مربوط به HTML `pattern` فقط یک regular expression می‌پذیرد.

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, min, max} from '@angular/forms/signals';

@Component({
  selector: 'app-age',
  imports: [FormField],
  template: `
    <label>
      Age (between {{ ageForm.age().min?.() }} and {{ ageForm.age().max?.() }})
      <input type="number" [formField]="ageForm.age" />
    </label>

    @if (ageForm.age().required()) {
      <span class="required-indicator">*</span>
    }
  `,
})
export class Age {
  ageModel = signal({age: 0});

  ageForm = form(this.ageModel, (schemaPath) => {
    required(schemaPath.age);
    min(schemaPath.age, 18);
    max(schemaPath.age, 120);
  });
}
```

### Reactive metadata

Validation ruleها می‌توانند constraintهای خود را از fieldهای دیگر derive کنند و metadata منتشرشده را reactive کنند:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, max} from '@angular/forms/signals';

@Component({
  selector: 'app-inventory',
  imports: [FormField],
  template: `
    <label>
      Item
      <select [formField]="inventoryForm.item">
        <option value="widget">Widget</option>
        <option value="gadget">Gadget</option>
      </select>
    </label>

    <label>
      Quantity (max: {{ inventoryForm.quantity().max?.() }})
      <input type="number" [formField]="inventoryForm.quantity" />
    </label>
  `,
})
export class Inventory {
  inventoryModel = signal({
    item: 'widget',
    quantity: 0,
  });

  inventoryForm = form(this.inventoryModel, (schemaPath) => {
    max(schemaPath.quantity, ({valueOf}) => {
      const item = valueOf(schemaPath.item);
      return item === 'widget' ? 100 : 50;
    });
  });
}
```

Validation rule مربوط به `max()`، metadata مربوط به `MAX` را بر اساس item انتخاب‌شده به‌صورت reactive تنظیم می‌کند؛ بنابراین هر template یا controlای که `field().max()` را می‌خواند، هنگام تغییر item update می‌شود.

برای پوشش عمیق‌تر، از جمله نحوه تعریف custom keyها، ترکیب contributionها با reducerها و استفاده از managed metadata برای objectهای lifecycle-aware، [راهنمای Field metadata](guide/forms/signals/field-metadata) را ببینید.

## ترکیب ruleها

می‌توانید چند rule را روی یک field اعمال کنید، و می‌توانید از conditional logic برای اعمال groupهای کامل rule بر اساس form state استفاده کنید.

### چند rule روی یک field

برای configure کردن همه جنبه‌های رفتار یک field، چند rule اعمال کنید:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, disabled, hidden, debounce, metadata} from '@angular/forms/signals';
import {PLACEHOLDER} from './metadata-keys';

@Component({
  selector: 'app-promo',
  imports: [FormField],
  template: `
    @if (!promoForm.promoCode().hidden()) {
      <label>
        Promo Code
        <input [formField]="promoForm.promoCode" />
      </label>
    }
  `,
})
export class Promo {
  promoModel = signal({
    hasAccount: false,
    subscriptionType: 'free' as 'free' | 'premium',
    promoCode: '',
  });

  promoForm = form(this.promoModel, (schemaPath) => {
    disabled(schemaPath.promoCode, {
      when: ({valueOf}) => (!valueOf(schemaPath.hasAccount) ? 'You must have an account' : false),
    });
    hidden(schemaPath.promoCode, {
      when: ({valueOf}) => valueOf(schemaPath.subscriptionType) === 'free',
    });
    debounce(schemaPath.promoCode, 300);
    metadata(schemaPath.promoCode, PLACEHOLDER, () => 'Enter promo code');
  });
}
```

این ruleها با هم کار می‌کنند:

- Hidden precedence دارد؛ اگر field hidden باشد، disabled state اهمیتی ندارد
- Disabled صرف‌نظر از readonly state جلوی editing را می‌گیرد
- Debouncing صرف‌نظر از stateهای دیگر روی model updateها اثر می‌گذارد
- Metadata مستقل است و همیشه در دسترس قرار دارد

### Conditional logic با applyWhen

از `applyWhen()` برای اعمال شرطی groupهای کامل rule استفاده کنید:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, applyWhen, required, pattern} from '@angular/forms/signals';

@Component({
  selector: 'app-address',
  imports: [FormField],
  template: `
    <label>
      Country
      <select [formField]="addressForm.country">
        <option value="US">United States</option>
        <option value="CA">Canada</option>
      </select>
    </label>

    <label>
      Zip/Postal Code
      <input [formField]="addressForm.zipCode" />
    </label>
  `,
})
export class Address {
  addressModel = signal({
    country: 'US',
    zipCode: '',
  });

  addressForm = form(this.addressModel, (schemaPath) => {
    applyWhen(
      schemaPath,
      ({valueOf}) => valueOf(schemaPath.country) === 'US',
      (schemaPath) => {
        // Only applied when country is US
        required(schemaPath.zipCode);
        pattern(schemaPath.zipCode, /^\d{5}(-\d{4})?$/);
      },
    );
  });
}
```

Function مربوط به `applyWhen()` این‌ها را دریافت می‌کند:

1. Pathای که logic روی آن اعمال شود؛ اغلب root form path
2. یک reactive logic function که `true` (apply) یا `false` (اعمال نشود) برمی‌گرداند
3. یک schema function که ruleهای شرطی را تعریف می‌کند

Ruleهای شرطی فقط وقتی اجرا می‌شوند که condition برابر true باشد. این برای formهای پیچیده‌ای مفید است که validation ruleها یا behavior بر اساس انتخاب‌های کاربر تغییر می‌کند.

### Schema functionهای reusable

Configurationهای رایج rule را به functionهای reusable استخراج کنید:

```ts
import {SchemaPath, debounce, metadata, maxLength} from '@angular/forms/signals';
import {PLACEHOLDER} from './metadata-keys';

function emailFieldConfig(path: SchemaPath<string>) {
  debounce(path, 300);
  metadata(path, PLACEHOLDER, () => 'user@example.com');
  maxLength(path, 255);
}

// Use in multiple forms
const contactForm = form(contactModel, (schemaPath) => {
  emailFieldConfig(schemaPath.email);
  emailFieldConfig(schemaPath.alternateEmail);
});

const registrationForm = form(registrationModel, (schemaPath) => {
  emailFieldConfig(schemaPath.email);
});
```

این pattern وقتی مفید است که standard field configurationهایی دارید که در چند form داخل application استفاده می‌کنید.

## قدم بعدی

برای یادگیری بیشتر درباره Signal Forms، این راهنماهای مرتبط را ببینید:

- [Field State Management](guide/forms/signals/field-state-management) - یاد بگیرید چطور از state signalهایی که این functionها می‌سازند در templateها و component logic استفاده کنید
- [Validation](guide/forms/signals/validation) - درباره validation ruleها و error handling یاد بگیرید
- [Custom Controls](guide/forms/signals/custom-controls) - یاد بگیرید custom controlها چطور می‌توانند metadata و state را بخوانند تا خودشان را به‌صورت خودکار configure کنند
