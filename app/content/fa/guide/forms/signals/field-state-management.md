# مدیریت field state

Field state در Signal Forms به شما اجازه می‌دهد به user interactionها واکنش نشان دهید؛ با فراهم کردن signalهای reactive برای validation status مثل `valid`، `invalid` و `errors`، interaction tracking مثل `touched` و `dirty`، و availability مثل `disabled` و `hidden`.

## درک field state

وقتی با function مربوط به [`form()`](api/forms/signals/form) یک form می‌سازید، این function یک **field tree** برمی‌گرداند؛ ساختار objectای که form model شما را mirror می‌کند. هر field در tree با dot notation قابل دسترسی است، مثل [`form.email`](api/forms/signals/form#email).

### دسترسی به field state

وقتی هر field در field tree را مثل function call کنید، مثل [`form.email()`](api/forms/signals/form#email)، یک object از نوع `FieldState` برمی‌گرداند که شامل signalهای reactive برای track کردن validation، interaction و availability state همان field است. برای مثال، signal مربوط به `invalid()` به شما می‌گوید آیا field validation error دارد یا نه:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, email} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <input type="email" [formField]="registrationForm.email" />

    @if (registrationForm.email().invalid()) {
      <p class="error">Email has validation errors:</p>
      <ul>
        @for (error of registrationForm.email().errors(); track error) {
          <li>{{ error.message }}</li>
        }
      </ul>
    }
  `,
})
export class Registration {
  registrationModel = signal({
    email: '',
    password: '',
  });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.email, {message: 'Email is required'});
    email(schemaPath.email, {message: 'Enter a valid email address'});
  });
}
```

در این مثال، template مقدار `registrationForm.email().invalid()` را بررسی می‌کند تا تصمیم بگیرد error message را نمایش دهد یا نه.

### Signalهای field state

رایج‌ترین signal، `value()` است؛ یک `WritableSignal` که به value فعلی field دسترسی می‌دهد:

```ts
const emailValue = registrationForm.email().value();
console.log(emailValue); // Current email string
```

علاوه بر `value()`، field state شامل signalهایی برای validation، interaction tracking و availability control است:

| Category                                | Signal       | Description                                                                      |
| --------------------------------------- | ------------ | -------------------------------------------------------------------------------- |
| **[Validation](#validation-state)**     | `valid()`    | Field همه validation ruleها را pass کرده و validator pending ندارد              |
|                                         | `invalid()`  | Field validation error دارد                                                      |
|                                         | `errors()`   | Arrayای از validation error objectها                                             |
|                                         | `pending()`  | Async validation در حال اجراست                                                   |
| **[Interaction](#interaction-state)**   | `touched()`  | کاربر field را focus و blur کرده است، اگر interactive باشد                       |
|                                         | `dirty()`    | کاربر field را modify کرده است، حتی اگر value با initial state برابر شده باشد    |
| **[Availability](#availability-state)** | `disabled()` | Field disabled است و روی parent form state اثر نمی‌گذارد                        |
|                                         | `hidden()`   | نشان می‌دهد field باید hidden باشد؛ visibility در template با `@if` کنترل می‌شود |
|                                         | `readonly()` | Field readonly است و روی parent form state اثر نمی‌گذارد                        |

این signalها به شما اجازه می‌دهند form user experienceهای responsive بسازید که به رفتار کاربر واکنش نشان می‌دهند. بخش‌های زیر هر category را با جزئیات بررسی می‌کنند.

## Validation state

Signalهای validation state به شما می‌گویند آیا یک field valid است و چه errorهایی دارد.

NOTE: این راهنما روی **استفاده** از validation state در templateها و logic شما تمرکز دارد، مثل خواندن `valid()`، `invalid()` و `errors()` برای نمایش feedback. برای اطلاعات درباره **تعریف** validation ruleها و ساخت custom validatorها، [راهنمای Validation](guide/forms/signals/validation) را ببینید.

### بررسی validity

برای بررسی validation status از `valid()` و `invalid()` استفاده کنید:

```angular-ts
@Component({
  template: `
    <input type="email" [formField]="loginForm.email" />

    @if (loginForm.email().invalid()) {
      <p class="error">Email is invalid</p>
    }
    @if (loginForm.email().valid()) {
      <p class="success">Email looks good</p>
    }
  `,
})
export class Login {
  loginModel = signal({email: '', password: ''});
  loginForm = form(this.loginModel);
}
```

| Signal      | Returns `true` when                                             |
| ----------- | --------------------------------------------------------------- |
| `valid()`   | Field همه validation ruleها را pass کرده و validator pending ندارد |
| `invalid()` | Field validation error دارد                                     |

هنگام بررسی validity در code، اگر می‌خواهید بین «error دارد» و «validation pending است» تفاوت بگذارید، به‌جای `!valid()` از `invalid()` استفاده کنید. دلیلش این است که `valid()` و `invalid()` می‌توانند هنگام pending بودن async validation هر دو هم‌زمان `false` باشند، چون field هنوز valid نیست زیرا validation کامل نشده، و invalid هم نیست چون هنوز errorای پیدا نشده است.

### خواندن validation errorها

با `errors()` به array مربوط به validation errorها دسترسی پیدا کنید. هر error object شامل موارد زیر است:

| Property    | Description                                                     |
| ----------- | --------------------------------------------------------------- |
| `kind`      | Validation ruleای که fail شده، مثل "required" یا "email"       |
| `message`   | Error message اختیاری و قابل خواندن برای انسان                 |
| `fieldTree` | Reference به `FieldTree`ای که error در آن رخ داده است           |

NOTE: Property مربوط به `message` اختیاری است. Validatorها می‌توانند custom error message فراهم کنند، اما اگر مشخص نشده باشد، ممکن است لازم باشد valueهای `kind` را به messageهای خودتان map کنید.

مثالی از نمایش errorها در template:

```angular-ts
@Component({
  template: `
    <input type="email" [formField]="loginForm.email" />

    @if (loginForm.email().errors().length > 0) {
      <div class="errors">
        @for (error of loginForm.email().errors(); track error) {
          <p>{{ error.message }}</p>
        }
      </div>
    }
  `
})
```

این رویکرد همه errorهای یک field را loop می‌کند و هر error message را به کاربر نمایش می‌دهد.

### Pending validation

Signal مربوط به `pending()` نشان می‌دهد async validation در حال اجراست:

```angular-ts
@Component({
  template: `
    <input type="email" [formField]="signupForm.email" />

    @if (signupForm.email().pending()) {
      <p>Checking if email is available...</p>
    }

    @if (signupForm.email().invalid() && !signupForm.email().pending()) {
      <p>Email is already taken</p>
    }
  `
})
```

این signal به شما اجازه می‌دهد هنگام اجرای async validation، loading state نمایش دهید.

## Interaction state

Interaction state track می‌کند آیا کاربران با fieldها تعامل کرده‌اند یا نه، و patternهایی مثل «errorها را فقط بعد از touched شدن field نشان بده» را ممکن می‌کند.

### Touched state

Signal مربوط به `touched()` track می‌کند آیا کاربر یک field را focus و سپس blur کرده، یا field به‌صورت programmatic به‌عنوان touched علامت‌گذاری شده است. فقط fieldهای interactive می‌توانند touched شوند؛ fieldهای hidden، disabled و readonly از user interaction یا `markAsTouched()` touched نمی‌شوند.

وقتی به action در سطح section نیاز دارید تا validation errorهای داخل همان section را reveal کند، `markAsTouched()` را روی section field call کنید. مقدار پیش‌فرض `skipDescendants` برابر `false` است، پس این call، section field و همه descendant fieldهای آن را touched علامت‌گذاری می‌کند.

برای مثال، یک checkout flow می‌تواند قبل از اجازه دادن به کاربر برای رفتن به step پرداخت، section مربوط به shipping را validate کند:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';

@Component({
  selector: 'app-checkout-shipping',
  imports: [FormField],
  template: `
    <label>
      Name
      <input [formField]="checkoutForm.shipping.name" />
    </label>
    @if (checkoutForm.shipping.name().touched() && checkoutForm.shipping.name().invalid()) {
      <p>{{ checkoutForm.shipping.name().errors()[0].message }}</p>
    }

    <label>
      Address
      <input [formField]="checkoutForm.shipping.address" />
    </label>
    @if (checkoutForm.shipping.address().touched() && checkoutForm.shipping.address().invalid()) {
      <p>{{ checkoutForm.shipping.address().errors()[0].message }}</p>
    }

    <button type="button" (click)="continueToPayment()">Continue</button>

    @if (showPayment() && checkoutForm.shipping().valid()) {
      <p>Ready for payment.</p>
    }
  `,
})
export class CheckoutShipping {
  checkoutModel = signal({
    shipping: {
      name: '',
      address: '',
    },
  });

  showPayment = signal(false);

  checkoutForm = form(this.checkoutModel, (schemaPath) => {
    required(schemaPath.shipping.name, {message: 'Enter a name'});
    required(schemaPath.shipping.address, {message: 'Enter an address'});
  });

  continueToPayment() {
    this.checkoutForm.shipping().markAsTouched();

    if (this.checkoutForm.shipping().invalid()) {
      return;
    }

    this.showPayment.set(true);
  }
}
```

وقتی `continueToPayment()`، `markAsTouched()` را روی `checkoutForm.shipping()` call می‌کند، از behavior پیش‌فرض `skipDescendants: false` استفاده می‌کند. Angular، `shipping`، `shipping.name` و `shipping.address` را touched علامت‌گذاری می‌کند، بنابراین error messageهای child با pattern مربوط به `touched() && invalid()` قبل از submit شدن کل form visible می‌شوند.

NOTE: فقط وقتی `{skipDescendants: true}` پاس بدهید که field دریافت‌کننده call باید بدون تغییر touched state فرزندانش touched شود.

### Dirty state

Formها اغلب باید تشخیص دهند آیا data واقعا تغییر کرده است یا نه؛ مثلا برای هشدار درباره unsaved changeها یا فقط وقتی لازم است save button را enable کنند. Signal مربوط به `dirty()` track می‌کند آیا کاربر field را modify کرده است یا نه.

Signal مربوط به `dirty()` وقتی کاربر value یک interactive field را modify کند `true` می‌شود، و حتی اگر value دوباره به مقدار initial برگردد همچنان `true` می‌ماند:

```angular-ts
@Component({
  template: `
    <form novalidate>
      <input [formField]="profileForm.name" />
      <input [formField]="profileForm.bio" />

      @if (profileForm().dirty()) {
        <p class="warning">You have unsaved changes</p>
      }
    </form>
  `,
})
export class Profile {
  profileModel = signal({name: 'Alice', bio: 'Developer'});
  profileForm = form(this.profileModel);
}
```

از `dirty()` برای warningهای "unsaved changes" یا enable کردن save button فقط وقتی data تغییر کرده استفاده کنید.

### Touched در برابر dirty

این signalها نوع‌های متفاوتی از interaction state را track می‌کنند:

| Signal      | When it becomes true                                                                                      |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| `touched()` | کاربر یک interactive field را focus و blur کرده، یا field به‌صورت programmatic touched شده است             |
| `dirty()`   | کاربر یک interactive field را modify کرده، حتی اگر هرگز blur نکرده باشد و حتی اگر value فعلی با initial value برابر باشد |

یک field می‌تواند ترکیب‌های متفاوتی داشته باشد:

| State                  | Scenario                                           |
| ---------------------- | -------------------------------------------------- |
| Touched but not dirty  | کاربر field را focus و blur کرده اما تغییری نداده است |
| Both touched and dirty | کاربر field را focus کرده، value را تغییر داده و آن را blur کرده است |

NOTE: Fieldهای hidden، disabled و readonly non-interactive هستند؛ از user interaction touched یا dirty نمی‌شوند.

## Availability state

Signalهای availability state کنترل می‌کنند آیا fieldها interactive، editable یا visible هستند. Fieldهای disabled، hidden و readonly non-interactive هستند. آن‌ها روی اینکه parent form valid، touched یا dirty باشد اثر نمی‌گذارند.

### Fieldهای disabled

Signal مربوط به `disabled()` نشان می‌دهد آیا یک field user input می‌پذیرد یا نه. Fieldهای disabled در UI ظاهر می‌شوند اما کاربران نمی‌توانند با آن‌ها تعامل کنند.

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, disabled} from '@angular/forms/signals';

@Component({
  selector: 'app-order',
  imports: [FormField],
  // TIP: The `[formField]` directive automatically binds the `disabled` attribute based
  // on the field's `disabled()` state, so you don't need to manually add `[disabled]="field().disabled()"`
  template: `
    <input [formField]="orderForm.couponCode" />

    @if (orderForm.couponCode().disabled()) {
      <p class="info">Coupon code is only available for orders over $50</p>
    }
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

در این مثال، از `valueOf(schemaPath.total)` برای بررسی value مربوط به field `total` استفاده می‌کنیم تا مشخص شود `couponCode` باید disabled باشد یا نه.

NOTE: Parameter مربوط به schema callback، یعنی `schemaPath` در این مثال‌ها، objectای از نوع `SchemaPathTree` است که pathهای همه fieldهای form شما را فراهم می‌کند. می‌توانید این parameter را هر نامی که دوست دارید بگذارید.

وقتی ruleهایی مثل `disabled()`، `hidden()` یا `readonly()` تعریف می‌کنید، function مربوط به `when` یک object از نوع `FieldContext` دریافت می‌کند که معمولا destructure می‌شود، مثل `({valueOf})`. دو method که در validation ruleها زیاد استفاده می‌شوند:

- `valueOf(schemaPath.otherField)` - خواندن value یک field دیگر در form
- `value()` - Signal شامل value همان fieldای که rule روی آن اعمال شده است

Fieldهای disabled به validation state مربوط به parent form contribute نمی‌کنند. حتی اگر یک field disabled در صورت فعال بودن invalid می‌بود، parent form همچنان می‌تواند valid باشد. State مربوط به `disabled()` روی interactivity و validation اثر می‌گذارد، اما value field را تغییر نمی‌دهد.

### Fieldهای hidden

Signal مربوط به `hidden()` نشان می‌دهد آیا یک field به‌صورت شرطی hidden است یا نه. از `hidden()` همراه با `@if` استفاده کنید تا fieldها را بر اساس conditionها show یا hide کنید:

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

Fieldهای hidden در validation شرکت نمی‌کنند. اگر یک required field hidden باشد، جلوی form submission را نمی‌گیرد. State مربوط به `hidden()` روی availability و validation اثر می‌گذارد، اما value field را تغییر نمی‌دهد.

### Fieldهای readonly

Signal مربوط به `readonly()` نشان می‌دهد آیا یک field readonly است یا نه. Fieldهای readonly value خود را نمایش می‌دهند اما کاربران نمی‌توانند آن‌ها را edit کنند:

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

NOTE: Directive مربوط به `[formField]` بر اساس state مربوط به `readonly()` در field، attribute مربوط به `readonly` را به‌صورت خودکار bind می‌کند؛ بنابراین لازم نیست `[readonly]="field().readonly()"` را دستی اضافه کنید.

مثل fieldهای disabled و hidden، fieldهای readonly non-interactive هستند و روی parent form state اثر نمی‌گذارند. State مربوط به `readonly()` روی editability و validation اثر می‌گذارد، اما value field را تغییر نمی‌دهد.

### چه زمانی از هرکدام استفاده کنیم

| State        | Use when                                                            | User can see it | User can interact | Contributes to validation |
| ------------ | ------------------------------------------------------------------- | --------------- | ----------------- | ------------------------- |
| `disabled()` | Field موقتا unavailable است، مثلا بر اساس valueهای fieldهای دیگر   | Yes             | No                | No                        |
| `hidden()`   | Field در context فعلی relevant نیست                                | No (with @if)   | No                | No                        |
| `readonly()` | Value باید visible باشد اما editable نباشد                         | Yes             | No                | No                        |

## Form-level state

Root form هم یک field در field tree است. وقتی آن را مثل function call کنید، یک object از نوع `FieldState` برمی‌گرداند که state همه child fieldها را aggregate می‌کند.

### دسترسی به form state

```angular-ts
@Component({
  template: `
    <form novalidate>
      <input [formField]="loginForm.email" />
      <input [formField]="loginForm.password" />

      <button [disabled]="!loginForm().valid()">Sign In</button>
    </form>
  `,
})
export class Login {
  loginModel = signal({email: '', password: ''});
  loginForm = form(this.loginModel);
}
```

در این مثال، form فقط زمانی valid است که همه child fieldها valid باشند. این به شما اجازه می‌دهد submit buttonها را بر اساس validity کلی form enable/disable کنید.

### Signalهای form-level

چون root form هم یک field است، همان signalها را دارد، مثل `valid()`، `invalid()`، `touched()`، `dirty()` و غیره.

| Signal      | Form-level behavior                                            |
| ----------- | -------------------------------------------------------------- |
| `valid()`   | همه interactive fieldها valid هستند و validator pending وجود ندارد |
| `invalid()` | دست‌کم یک interactive field validation error دارد              |
| `pending()` | دست‌کم یک interactive field، async validation pending دارد     |
| `touched()` | خود form یا دست‌کم یک interactive descendant touched است       |
| `dirty()`   | کاربر دست‌کم یک interactive field را modify کرده است           |

### چه زمانی از form-level و چه زمانی از field-level استفاده کنیم

**از form-level state برای این موارد استفاده کنید:**

- Enabled/disabled state مربوط به submit button
- State مربوط به "Save" button
- بررسی‌های overall form validity
- Warningهای unsaved changes

**از field-level state برای این موارد استفاده کنید:**

- Error messageهای fieldهای جداگانه
- Styling مخصوص field
- Validation feedback به‌ازای هر field
- Availability شرطی fieldها

## State propagation

Field state از child fieldها به parent field groupها و سپس root form propagate می‌شود.

### Child state چطور روی parent formها اثر می‌گذارد

وقتی یک child field invalid شود، parent field group آن invalid می‌شود و root form هم همین‌طور. وقتی یک child touched یا dirty شود، parent field group و root form آن change را منعکس می‌کنند. این aggregation به شما اجازه می‌دهد validity را در هر سطحی بررسی کنید؛ field یا کل form.

```ts
const userModel = signal({
  profile: {
    firstName: '',
    lastName: '',
  },
  address: {
    street: '',
    city: '',
  },
});

const userForm = form(userModel);

// If firstName is invalid, profile is invalid
userForm.profile.firstName().invalid() === true;
// → userForm.profile().invalid() === true
// → userForm().invalid() === true
```

### Fieldهای hidden، disabled و readonly

Fieldهای hidden، disabled و readonly non-interactive هستند و روی parent form state اثر نمی‌گذارند:

```ts
const orderModel = signal({
  customerName: '',
  requiresShipping: false,
  shippingAddress: '',
});

const orderForm = form(orderModel, (schemaPath) => {
  hidden(schemaPath.shippingAddress, {when: ({valueOf}) => !valueOf(schemaPath.requiresShipping)});
});
```

در این مثال، وقتی `shippingAddress` hidden باشد، روی form validity اثر نمی‌گذارد. در نتیجه، حتی اگر `shippingAddress` خالی و required باشد، form می‌تواند valid باشد.

این behavior از block شدن form submission یا اثرگذاری روی validation، touched و dirty state توسط fieldهای hidden، disabled یا readonly جلوگیری می‌کند.

## استفاده از state در templateها

Field state signalها به‌صورت یکپارچه با Angular templateها کار می‌کنند و form user experienceهای reactive را بدون event handling دستی ممکن می‌کنند.

### نمایش شرطی error

Errorها را فقط بعد از اینکه کاربر با field تعامل کرده نشان دهید:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, email} from '@angular/forms/signals';

@Component({
  selector: 'app-signup',
  imports: [FormField],
  template: `
    <label>
      Email
      <input type="email" [formField]="signupForm.email" />
    </label>

    @if (signupForm.email().touched() && signupForm.email().invalid()) {
      <p class="error">{{ signupForm.email().errors()[0].message }}</p>
    }
  `,
})
export class Signup {
  signupModel = signal({email: '', password: ''});

  signupForm = form(this.signupModel, (schemaPath) => {
    email(schemaPath.email);
  });
}
```

این pattern جلوی نمایش errorها را قبل از اینکه کاربران فرصت تعامل با field داشته باشند می‌گیرد. Errorها فقط بعد از اینکه کاربر field را focus و سپس ترک کرد ظاهر می‌شوند.

### Availability شرطی field

از signal مربوط به `hidden()` همراه با `@if` استفاده کنید تا fieldها را به‌صورت شرطی show یا hide کنید:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, hidden} from '@angular/forms/signals';

@Component({
  selector: 'app-order',
  imports: [FormField],
  template: `
    <label>
      <input type="checkbox" [formField]="orderForm.requiresShipping" />
      Requires shipping
    </label>

    @if (!orderForm.shippingAddress().hidden()) {
      <label>
        Shipping Address
        <input [formField]="orderForm.shippingAddress" />
      </label>
    }
  `,
})
export class Order {
  orderModel = signal({
    requiresShipping: false,
    shippingAddress: '',
  });

  orderForm = form(this.orderModel, (schemaPath) => {
    hidden(schemaPath.shippingAddress, {
      when: ({valueOf}) => !valueOf(schemaPath.requiresShipping),
    });
  });
}
```

Fieldهای hidden در validation شرکت نمی‌کنند، و این اجازه می‌دهد form submit شود حتی اگر field hidden در حالت دیگر invalid می‌بود.

### Tracking valueها برای array fieldها

در signal forms، یک block از نوع `@for` روی مجموعه‌ای از fieldها باید با field identity track شود.

```angular-ts
@Component({
  imports: [FormField],
  template: `
    @for (field of form.emails; track field) {
      <input [formField]="field" />
    }
  `,
})
export class App {
  formModel = signal({emails: ['john.doe@mail.com', 'max.musterman@mail.com']});
  form = form(this.formModel);
}
```

Form system از قبل model valueهای داخل array را track می‌کند و identity پایدار fieldهایی را که می‌سازد به‌صورت خودکار حفظ می‌کند.

وقتی یک item تغییر می‌کند، ممکن است یک entity منطقی جدید را نشان دهد، حتی اگر بعضی propertyهای آن مشابه به نظر برسند. Tracking بر اساس identity مطمئن می‌کند framework آن را به‌عنوان item متمایز در نظر بگیرد، نه اینکه UI elementهای موجود را reuse کند. این کار از share شدن نادرست elementهای stateful مثل form inputها جلوگیری می‌کند و bindingها را با بخش درست model هم‌راستا نگه می‌دارد.

## استفاده از field state در component logic

Field state signalها با primitiveهای reactive Angular مثل `computed()` و `effect()` برای form logic پیشرفته کار می‌کنند.

### بررسی validation قبل از submission

Form validity را در component methodها بررسی کنید:

```ts
export class Registration {
  registrationModel = signal({
    username: '',
    email: '',
    password: '',
  });

  registrationForm = form(this.registrationModel);

  async onSubmit() {
    // Wait for any pending async validation
    if (this.registrationForm().pending()) {
      console.log('Waiting for validation...');
      return;
    }

    // Guard against invalid submissions
    if (this.registrationForm().invalid()) {
      console.error('Form is invalid');
      return;
    }

    const data = this.registrationModel();
    await this.api.register(data);
  }
}
```

این کار مطمئن می‌شود فقط data valid و کاملا validateشده به API شما برسد.

### Derived state با computed

Signalهای computed را بر اساس field state بسازید تا وقتی field state زیربنایی تغییر می‌کند، به‌صورت خودکار update شوند:

```ts
export class Password {
  passwordModel = signal({password: '', confirmPassword: ''});
  passwordForm = form(this.passwordModel);

  // Compute password strength indicator
  passwordStrength = computed(() => {
    const password = this.passwordForm.password().value();
    if (password.length < 8) return 'weak';
    if (password.length < 12) return 'medium';
    return 'strong';
  });

  // Check if all required fields are filled
  allFieldsFilled = computed(() => {
    return (
      this.passwordForm.password().value().length > 0 &&
      this.passwordForm.confirmPassword().value().length > 0
    );
  });
}
```

### تغییرات programmatic در state

هرچند field state معمولا از طریق user interactionها، مثل تایپ، focus و blur، update می‌شود، گاهی لازم دارید آن را programmatically کنترل کنید. سناریوهای رایج شامل form submission و reset کردن formها هستند.

#### Form submission

Signal Forms یک directive به نام `FormRoot` فراهم می‌کند که form submission را ساده می‌کند. این directive به‌صورت خودکار behavior پیش‌فرض browser form submission را prevent می‌کند و attribute مربوط به `novalidate` را روی element مربوط به `<form>` تنظیم می‌کند.

```angular-ts
import {FormField, FormRoot} from '@angular/forms/signals';

@Component({
  imports: [FormRoot, FormField],
  template: `
    <form [formRoot]="registrationForm">
      <input [formField]="registrationForm.username" />
      <input type="email" [formField]="registrationForm.email" />
      <input type="password" [formField]="registrationForm.password" />

      <button type="submit">Register</button>
    </form>
  `,
})
export class Registration {
  registrationModel = signal({username: '', email: '', password: ''});

  registrationForm = form(
    this.registrationModel,
    (schemaPath) => {
      required(schemaPath.username);
      email(schemaPath.email);
      required(schemaPath.password);
    },
    {
      submission: {
        action: async () => this.submitToServer(),
      },
    },
  );

  private submitToServer() {
    // Send data to server
  }
}
```

وقتی از `FormRoot` استفاده می‌کنید، submit کردن form به‌صورت خودکار function مربوط به `submit()` را call می‌کند؛ functionای که همه fieldها را touched علامت‌گذاری می‌کند، یعنی validation errorها را reveal می‌کند، و اگر form valid باشد callback مربوط به `action` شما را اجرا می‌کند.

همچنین می‌توانید بدون استفاده از directive، form را دستی submit کنید؛ با call کردن `submit(this.registrationForm)`. وقتی function مربوط به `submit` را explicit این‌طور call می‌کنید، می‌توانید یک `FormSubmitOptions` پاس بدهید تا logic پیش‌فرض `submission` مربوط به form override شود: `submit(this.registrationForm, {action: () => /* ... */ })`.

#### Reset کردن formها بعد از submission

بعد از submit موفق یک form، ممکن است بخواهید آن را به initial state برگردانید؛ هم user interaction history و هم field valueها را clear کنید. Method مربوط به `reset()` flagهای touched و dirty را clear می‌کند. همچنین می‌توانید یک value اختیاری به `reset()` پاس بدهید تا model data را update کنید:

```ts
export class Contact {
  private readonly INITIAL_MODEL = {name: '', email: '', message: ''};
  contactModel = signal({...this.INITIAL_MODEL});
  contactForm = form(this.contactModel, {
    submission: {
      action: async (f) => {
        await this.api.sendMessage(this.contactModel());
        // Clear interaction state (touched, dirty) and reset to initial values
        f().reset({...this.INITIAL_MODEL});
      },
    },
  });
}
```

این کار مطمئن می‌شود form برای input جدید آماده است، بدون اینکه error messageهای stale یا dirty state indicatorها نشان داده شوند.

## Styling بر اساس validation state

می‌توانید با bind کردن CSS classها بر اساس validation state، styleهای سفارشی به form خود اعمال کنید:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, email} from '@angular/forms/signals';

@Component({
  imports: [FormField],
  template: `
    <input
      type="email"
      [formField]="form.email"
      [class.is-invalid]="form.email().touched() && form.email().invalid()"
      [class.is-valid]="form.email().touched() && form.email().valid()"
    />
  `,
  styles: `
    input.is-invalid {
      border: 2px solid red;
      background-color: white;
    }

    input.is-valid {
      border: 2px solid green;
    }
  `,
})
export class StyleExample {
  model = signal({email: ''});

  form = form(this.model, (schemaPath) => {
    email(schemaPath.email);
  });
}
```

بررسی هم‌زمان `touched()` و validation state مطمئن می‌کند styleها فقط بعد از تعامل کاربر با field ظاهر شوند.

## Focus کردن form control bind شده به form field

Angular Signal Forms یک method به نام `focusBoundControl()` روی field state فراهم می‌کند که اجازه می‌دهد [focus](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) را به‌صورت programmatic به form control مرتبط با یک form field منتقل کنید.

یک use case رایج، بهتر کردن accessibility هنگام form submission است: وقتی form invalid است، error messageها را نمایش دهید و focus را به‌صورت خودکار به اولین field invalid منتقل کنید تا کاربر برای اصلاح آن هدایت شود.

### استفاده پایه

با یک registration form:

```ts
@Component({
  /* ... */
})
export class Registration {
  registrationModel = signal({username: '', email: '', password: ''});
  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.username);
    email(schemaPath.email);
    required(schemaPath.password);
  });
}
```

برای انتقال focus به control bind شده به field مربوط به `email`:

```ts
registrationForm.email().focusBoundControl();
```

### جلوگیری از scroll

اگر target control بیرون viewport است و می‌خواهید بدون trigger کردن scroll آن را focus کنید، می‌توانید هنگام call کردن method مربوط به `focusBoundControl()`، option مربوط به [preventScroll](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#preventscroll) را روی `true` بگذارید.

```ts
registrationForm.email().focusBoundControl({preventScroll: true});
```

### Focus کردن اولین field invalid هنگام submission

از `errorSummary()` استفاده کنید تا اولین field invalid را پیدا کنید و وقتی کاربر form دارای error را submit می‌کند آن را focus کنید:

```ts
onSubmit() {
  const firstError = this.registrationForm().errorSummary()[0];
  if (firstError?.fieldTree) {
    firstError.fieldTree().focusBoundControl();
  } else {
    // proceed with submission
  }
}
```

### Custom controlها

به‌صورت پیش‌فرض، call کردن `focusBoundControl()` روی یک custom control اثری ندارد، چون custom control می‌تواند چند native input داشته باشد. برای مثال، date picker می‌تواند fieldهای جداگانه day، month و year داشته باشد. در نتیجه، Angular نمی‌تواند مشخص کند کدام element باید focus بگیرد یا چه actionای باید انجام شود.

برای پشتیبانی از programmatic focus در یک custom control، methodای به نام `focus()` پیاده‌سازی کنید. وقتی `focusBoundControl()` روی field state مرتبط با یک custom control call شود، Angular اگر method مربوط به `focus()` وجود داشته باشد آن را call می‌کند.

یک custom password input را در نظر بگیرید:

```html
<div class="password-block">
  <input type="password" #passwordCtrl [value]="value()" (input)="value.set($event.target.value)" />
</div>
```

```ts
@Component({
  /* ... */
})
export class PasswordInput implements FormValueControl<string> {
  readonly value = model<string>('');
  readonly passwordCtrl = viewChild.required<ElementRef<HTMLInputElement>>('passwordCtrl');

  // Called automatically when focusBoundControl() is invoked
  // on the field state associated with this custom control
  focus(): void {
    this.passwordCtrl().nativeElement.focus();
  }
}
```

## قدم بعدی

این راهنما validation و availability status handling، interaction tracking و field state propagation را پوشش داد. راهنماهای مرتبط جنبه‌های دیگر Signal Forms را بررسی می‌کنند:

<!-- TODO: UNCOMMENT WHEN THE GUIDES ARE AVAILABLE -->
<docs-pill-row>
  <docs-pill href="guide/forms/signals/models" title="Form modelها" />
  <docs-pill href="guide/forms/signals/validation" title="Validation" />
  <docs-pill href="guide/forms/signals/custom-controls" title="Custom controlها" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Working with Arrays" /> -->
</docs-pill-row>
