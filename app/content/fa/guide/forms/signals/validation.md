# Validation

Formها برای اینکه مطمئن شوند کاربران قبل از submission، data درست و کامل فراهم می‌کنند به validation نیاز دارند. بدون validation، باید مشکل‌های کیفیت data را در server مدیریت کنید، user experience ضعیفی با error messageهای نامشخص ارائه دهید و هر constraint را دستی بررسی کنید.

Signal Forms یک رویکرد validation مبتنی بر schema فراهم می‌کند. Validation ruleها با استفاده از schema function به fieldها bind می‌شوند، هنگام تغییر valueها به‌صورت خودکار اجرا می‌شوند و errorها را از طریق field state signalها expose می‌کنند. این کار validation reactive را ممکن می‌کند که هم‌زمان با تعامل کاربران با form update می‌شود.

<docs-code-multifile preview hideCode path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.css"/>
</docs-code-multifile>

## مبانی Validation

Validation در Signal Forms از طریق schema functionای تعریف می‌شود که به‌عنوان argument دوم به `form()` پاس داده می‌شود.

### Schema function

Schema function یک object از نوع `SchemaPathTree` دریافت می‌کند که به شما اجازه می‌دهد validation ruleهای خود را تعریف کنید:

<docs-code
  header="app.ts"
  path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.ts"
  visibleLines="[29,30,31,32,33,34]"
  highlight="[30,31,33]"
/>

Schema function هنگام initialization فرم یک بار اجرا می‌شود. Validation ruleها با استفاده از schema path parameter، مثل `schemaPath.email` و `schemaPath.password`، به fieldها bind می‌شوند و validation هر زمان field valueها تغییر کنند به‌صورت خودکار اجرا می‌شود.

NOTE: Parameter مربوط به schema callback، یعنی `schemaPath` در این مثال‌ها، objectای از نوع `SchemaPathTree` است که pathهای همه fieldهای form شما را فراهم می‌کند. می‌توانید این parameter را هر نامی که دوست دارید بگذارید.

### Validation چطور کار می‌کند

Validation در Signal Forms از این pattern پیروی می‌کند:

1. **تعریف validation ruleها در schema** - Validation ruleها را در schema function به fieldها bind کنید
2. **اجرای خودکار** - Validation ruleها هنگام تغییر field valueها اجرا می‌شوند
3. **Error propagation** - Validation errorها از طریق field state signalها expose می‌شوند
4. **Updateهای reactive** - UI هنگام تغییر validation state به‌صورت خودکار update می‌شود

Validation روی هر value change برای interactive fieldها اجرا می‌شود. Fieldهای hidden و disabled validation را اجرا نمی‌کنند؛ validation ruleهای آن‌ها تا زمانی که field دوباره interactive شود skip می‌شوند.

### زمان‌بندی validation

Validation ruleها به این ترتیب اجرا می‌شوند:

1. **Synchronous validation** - همه synchronous validation ruleها هنگام تغییر value اجرا می‌شوند
2. **Asynchronous validation** - Asynchronous validation ruleها فقط بعد از pass شدن همه synchronous validation ruleها اجرا می‌شوند
3. **Update شدن field state** - Signalهای `valid()`، `invalid()`، `errors()` و `pending()` update می‌شوند

Synchronous validation ruleها مثل `required()` و `email()` بلافاصله کامل می‌شوند. Asynchronous validation ruleها مثل `validateHttp()` ممکن است زمان ببرند و هنگام اجرا signal مربوط به `pending()` را روی `true` بگذارند.

همه validation ruleها روی هر change اجرا می‌شوند؛ validation بعد از اولین error short-circuit نمی‌شود. اگر یک field هم `required()` و هم `email()` داشته باشد، هر دو اجرا می‌شوند و هر دو می‌توانند هم‌زمان error تولید کنند.

## Validation ruleهای built-in

Signal Forms برای سناریوهای validation رایج ruleهایی فراهم می‌کند. همه validation ruleهای built-in یک options object برای custom error messageها و conditional logic می‌پذیرند.

### required()

Validation rule مربوط به `required()` مطمئن می‌شود field value دارد:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Username
        <input [formField]="registrationForm.username" />
      </label>

      <label>
        Email
        <input type="email" [formField]="registrationForm.email" />
      </label>

      <button type="submit">Register</button>
    </form>
  `,
})
export class RegistrationComponent {
  registrationModel = signal({
    username: '',
    email: '',
  });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.username, {message: 'Username is required'});
    required(schemaPath.email, {message: 'Email is required'});
  });
}
```

یک field وقتی "empty" در نظر گرفته می‌شود که:

| Condition                | Example |
| ------------------------ | ------- |
| Value برابر `null` باشد  | `null`, |
| Value یک string خالی باشد | `''`    |

برای requirementهای شرطی، از option مربوط به `when` استفاده کنید:

```ts
registrationForm = form(this.registrationModel, (schemaPath) => {
  required(schemaPath.promoCode, {
    message: 'Promo code is required for discounts',
    when: ({valueOf}) => valueOf(schemaPath.applyDiscount),
  });
});
```

Validation rule فقط وقتی اجرا می‌شود که function مربوط به `when` مقدار `true` برگرداند.

Note: `required` یک array خالی را present یعنی valid در نظر می‌گیرد، پس برای enforce کردن حداقل تعداد itemهای array از [`minLength()`](#minlength-and-maxlength) استفاده کنید؛ همچنین `false` را missing یعنی invalid در نظر می‌گیرد، مطابق با `<input type="checkbox" required>`.

### email()

Validation rule مربوط به `email()` فرمت معتبر email را بررسی می‌کند:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, email} from '@angular/forms/signals';

@Component({
  selector: 'app-contact',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Your Email
        <input type="email" [formField]="contactForm.email" />
      </label>
    </form>
  `,
})
export class ContactComponent {
  contactModel = signal({email: ''});

  contactForm = form(this.contactModel, (schemaPath) => {
    email(schemaPath.email, {message: 'Please enter a valid email address'});
  });
}
```

Validation rule مربوط به `email()` از regex استاندارد email format استفاده می‌کند. Addressهایی مثل `user@example.com` را می‌پذیرد اما addressهای malformed مثل `user@` یا `@example.com` را رد می‌کند.

### min() و max()

Validation ruleهای `min()` و `max()` با valueهای numeric کار می‌کنند:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, min, max} from '@angular/forms/signals';

@Component({
  selector: 'app-age-form',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Age
        <input type="number" [formField]="ageForm.age" />
      </label>

      <label>
        Rating (1-5)
        <input type="number" [formField]="ageForm.rating" />
      </label>
    </form>
  `,
})
export class AgeFormComponent {
  ageModel = signal({
    age: 0,
    rating: 0,
  });

  ageForm = form(this.ageModel, (schemaPath) => {
    min(schemaPath.age, 18, {message: 'You must be at least 18 years old'});
    max(schemaPath.age, 120, {message: 'Please enter a valid age'});

    min(schemaPath.rating, 1, {message: 'Rating must be at least 1'});
    max(schemaPath.rating, 5, {message: 'Rating cannot exceed 5'});
  });
}
```

می‌توانید برای constraintهای dynamic از computed valueها استفاده کنید:

```ts
ageForm = form(this.ageModel, (schemaPath) => {
  min(schemaPath.participants, () => this.minimumRequired(), {
    message: 'Not enough participants',
  });
});
```

### minLength() و maxLength()

Validation ruleهای `minLength()` و `maxLength()` با stringها و arrayها کار می‌کنند:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, minLength, maxLength} from '@angular/forms/signals';

@Component({
  selector: 'app-password-form',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Password
        <input type="password" [formField]="passwordForm.password" />
      </label>

      <label>
        Bio
        <textarea [formField]="passwordForm.bio"></textarea>
      </label>
    </form>
  `,
})
export class PasswordFormComponent {
  passwordModel = signal({
    password: '',
    bio: '',
  });

  passwordForm = form(this.passwordModel, (schemaPath) => {
    minLength(schemaPath.password, 8, {message: 'Password must be at least 8 characters'});
    maxLength(schemaPath.password, 100, {message: 'Password is too long'});

    maxLength(schemaPath.bio, 500, {message: 'Bio cannot exceed 500 characters'});
  });
}
```

برای stringها، "length" یعنی تعداد characterها. برای arrayها، "length" یعنی تعداد elementها.

### pattern()

Validation rule مربوط به `pattern()` value را با یک regular expression validate می‌کند:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, pattern} from '@angular/forms/signals';

@Component({
  selector: 'app-phone-form',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Phone Number
        <input [formField]="phoneForm.phone" placeholder="555-123-4567" />
      </label>

      <label>
        Postal Code
        <input [formField]="phoneForm.postalCode" placeholder="12345" />
      </label>
    </form>
  `,
})
export class PhoneFormComponent {
  phoneModel = signal({
    phone: '',
    postalCode: '',
  });

  phoneForm = form(this.phoneModel, (schemaPath) => {
    pattern(schemaPath.phone, /^\d{3}-\d{3}-\d{4}$/, {
      message: 'Phone must be in format: 555-123-4567',
    });

    pattern(schemaPath.postalCode, /^\d{5}$/, {
      message: 'Postal code must be 5 digits',
    });
  });
}
```

Patternهای رایج:

| Pattern Type     | Regular Expression      | Example      |
| ---------------- | ----------------------- | ------------ |
| Phone            | `/^\d{3}-\d{3}-\d{4}$/` | 555-123-4567 |
| Postal code (US) | `/^\d{5}$/`             | 12345        |
| Alphanumeric     | `/^[a-zA-Z0-9]+$/`      | abc123       |
| URL-safe         | `/^[a-zA-Z0-9_-]+$/`    | my-url_123   |

## Validation برای array itemها

Formها می‌توانند شامل arrayهایی از objectهای nested باشند، مثلا listای از order itemها. برای اعمال validation ruleها روی هر item در یک array، داخل schema function خود از `applyEach()` استفاده کنید. `applyEach()`، array path را iterate می‌کند و برای هر item یک path فراهم می‌کند که می‌توانید validatorها را درست مثل fieldهای top-level روی آن اعمال کنید.

```ts
import {Component, signal} from '@angular/core';
import {applyEach, FormField, form, min, required, SchemaPathTree} from '@angular/forms/signals';

type Item = {name: string; quantity: number};

interface Order {
  title: string;
  description: string;
  items: Item[];
}

function ItemSchema(item: SchemaPathTree<Item>) {
  required(item.name, {message: 'Item name is required'});
  min(item.quantity, 1, {message: 'Quantity must be at least 1'});
}

@Component(/* ... */)
export class OrderComponent {
  orderModel = signal<Order>({
    title: '',
    description: '',
    items: [{name: '', quantity: 0}],
  });

  orderForm = form(this.orderModel, (schemaPath) => {
    required(schemaPath.title);
    required(schemaPath.description);

    applyEach(schemaPath.items, ItemSchema);
  });
}
```

## Validation errorها

وقتی validation ruleها fail می‌شوند، error objectهایی تولید می‌کنند که توضیح می‌دهند چه چیزی اشتباه شده است. درک ساختار error کمک می‌کند feedback روشنی به کاربران بدهید.

<!-- TODO: Uncomment when field state management guide is published

NOTE: This section covers the errors that validation rules produce. For displaying and using validation errors in your UI, see the [Field State Management guide](guide/forms/signals/field-state-management). -->

### ساختار Error

هر validation error object شامل propertyهای زیر است:

| Property  | Description                                                              |
| --------- | ------------------------------------------------------------------------ |
| `kind`    | Validation ruleای که fail شده، مثل "required"، "email" یا "minLength"   |
| `message` | Error message اختیاری و قابل خواندن برای انسان                          |

Validation ruleهای built-in به‌صورت خودکار property مربوط به `kind` را تنظیم می‌کنند. Property مربوط به `message` اختیاری است؛ می‌توانید از طریق optionهای validation rule، messageهای سفارشی فراهم کنید.

### Custom error messageها

همه validation ruleهای built-in optionای به نام `message` برای error text سفارشی می‌پذیرند:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, minLength} from '@angular/forms/signals';

@Component({
  selector: 'app-signup',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Username
        <input [formField]="signupForm.username" />
      </label>

      <label>
        Password
        <input type="password" [formField]="signupForm.password" />
      </label>
    </form>
  `,
})
export class SignupComponent {
  signupModel = signal({
    username: '',
    password: '',
  });

  signupForm = form(this.signupModel, (schemaPath) => {
    required(schemaPath.username, {
      message: 'Please choose a username',
    });

    required(schemaPath.password, {
      message: 'Password cannot be empty',
    });
    minLength(schemaPath.password, 12, {
      message: 'Password must be at least 12 characters for security',
    });
  });
}
```

Custom messageها باید روشن و specific باشند و به کاربران بگویند چطور مشکل را رفع کنند. به‌جای "Invalid input"، از "Password must be at least 12 characters for security" استفاده کنید.

### چند error برای هر field

وقتی یک field چند validation rule دارد، هر validation rule مستقل اجرا می‌شود و می‌تواند error تولید کند:

```ts
signupForm = form(this.signupModel, (schemaPath) => {
  required(schemaPath.email, {message: 'Email is required'});
  email(schemaPath.email, {message: 'Enter a valid email address'});
  minLength(schemaPath.email, 5, {message: 'Email is too short'});
});
```

اگر email field خالی باشد، فقط error مربوط به `required()` ظاهر می‌شود. اگر کاربر "a@b" تایپ کند، هر دو error مربوط به `email()` و `minLength()` ظاهر می‌شوند. همه validation ruleها اجرا می‌شوند؛ validation بعد از اولین failure متوقف نمی‌شود.

TIP: در templateهای خود از pattern مربوط به `touched() && invalid()` استفاده کنید تا errorها قبل از تعامل کاربران با field ظاهر نشوند. برای راهنمای جامع درباره نمایش validation errorها، [راهنمای Field State Management](guide/forms/signals/field-state-management#conditional-error-display) را ببینید.

## Custom validation ruleها

هرچند validation ruleهای built-in موارد رایج را پوشش می‌دهند، اغلب برای business ruleها، formatهای پیچیده یا constraintهای domain-specific به custom validation logic نیاز دارید.

### استفاده از validate()

Function مربوط به `validate()`، custom validation rule می‌سازد. یک validator function دریافت می‌کند که به field context دسترسی دارد و این‌ها را برمی‌گرداند:

| Return Value          | Meaning          |
| --------------------- | ---------------- |
| Error object          | Value نامعتبر است |
| `null` یا `undefined` | Value معتبر است  |

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, validate} from '@angular/forms/signals';

@Component({
  selector: 'app-url-form',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Website URL
        <input [formField]="urlForm.website" />
      </label>
    </form>
  `,
})
export class UrlFormComponent {
  urlModel = signal({website: ''});

  urlForm = form(this.urlModel, (schemaPath) => {
    validate(schemaPath.website, ({value}) => {
      if (!value().startsWith('https://')) {
        return {
          kind: 'https',
          message: 'URL must start with https://',
        };
      }

      return null;
    });
  });
}
```

Validator function یک object از نوع `FieldContext` دریافت می‌کند که شامل موارد زیر است:

| Property        | Type       | Description                                  |
| --------------- | ---------- | -------------------------------------------- |
| `value`         | Signal     | Signal شامل value فعلی field                 |
| `state`         | FieldState | Reference مربوط به field state               |
| `field`         | FieldTree  | Reference مربوط به field tree                |
| `valueOf()`     | Method     | گرفتن value یک field دیگر بر اساس path       |
| `stateOf()`     | Method     | گرفتن state یک field دیگر بر اساس path       |
| `fieldTreeOf()` | Method     | گرفتن field tree یک field دیگر بر اساس path  |
| `pathKeys`      | Signal     | Path keyها از root تا field فعلی             |

NOTE: Child fieldها همچنین یک signal به نام `key` دارند، و array item fieldها هم `key` و هم `index` signal دارند.

وقتی validation fail می‌شود، error objectای با `kind` و `message` برگردانید. وقتی validation pass می‌شود، `null` یا `undefined` برگردانید.

### استفاده از validateTree()

Function مربوط به `validateTree()`، custom validation ruleهایی می‌سازد که می‌توانند چند field را target کنند یا validation logic پیچیده برای یک subtree کامل فراهم کنند.

```angular-ts
import {Component, model} from '@angular/core';
import {form, FormField, validateTree} from '@angular/forms/signals';

interface User {
  firstName: string;
  lastName: string;
}

@Component({
  /* ... */
})
export class UserFormComponent {
  readonly userModel = model<User>({
    firstName: '',
    lastName: '',
  });

  userForm = form(this.userModel, (path) => {
    validateTree(path, (ctx) => {
      if (ctx.valueOf(path.firstName).length < 5) {
        return {
          kind: 'minLength5',
          message: 'First name must be at least 5 characters',
          fieldTree: ctx.fieldTree.lastName,
        };
      }

      return null;
    });
  });
}
```

Validator function مربوط به `validateTree()` همان object از نوع `FieldContext` را دریافت می‌کند که `validate()` دریافت می‌کند.

### Validation ruleهای reusable

با wrap کردن `validate()`، validation rule functionهای reusable بسازید:

```ts
function url(path: SchemaPath<string>, options?: {message?: string}) {
  validate(path, ({value}) => {
    try {
      new URL(value());
      return null;
    } catch {
      return {
        kind: 'url',
        message: options?.message || 'Enter a valid URL',
      };
    }
  });
}

function phoneNumber(path: SchemaPath<string>, options?: {message?: string}) {
  validate(path, ({value}) => {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

    if (!phoneRegex.test(value())) {
      return {
        kind: 'phoneNumber',
        message: options?.message || 'Phone must be in format: 555-123-4567',
      };
    }

    return null;
  });
}
```

می‌توانید custom validation ruleها را درست مثل validation ruleهای built-in استفاده کنید:

```ts
urlForm = form(this.urlModel, (schemaPath) => {
  url(schemaPath.website, {message: 'Please enter a valid website URL'});
  phoneNumber(schemaPath.phone);
});
```

## Cross-field validation

Cross-field validation چند field value را compare یا به هم مرتبط می‌کند.

یک سناریوی رایج برای cross-field validation، password confirmation است:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, minLength, validate} from '@angular/forms/signals';

@Component({
  selector: 'app-password-change',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        New Password
        <input type="password" [formField]="passwordForm.password" />
      </label>

      <label>
        Confirm Password
        <input type="password" [formField]="passwordForm.confirmPassword" />
      </label>

      <button type="submit">Change Password</button>
    </form>
  `,
})
export class PasswordChangeComponent {
  passwordModel = signal({
    password: '',
    confirmPassword: '',
  });

  passwordForm = form(this.passwordModel, (schemaPath) => {
    required(schemaPath.password, {message: 'Password is required'});
    minLength(schemaPath.password, 8, {message: 'Password must be at least 8 characters'});

    required(schemaPath.confirmPassword, {message: 'Please confirm your password'});

    validate(schemaPath.confirmPassword, ({value, valueOf}) => {
      const confirmPassword = value();
      const password = valueOf(schemaPath.password);

      if (confirmPassword !== password) {
        return {
          kind: 'passwordMismatch',
          message: 'Passwords do not match',
        };
      }

      return null;
    });
  });
}
```

Validation rule مربوط به confirmation با استفاده از `valueOf(schemaPath.password)` به value مربوط به password field دسترسی پیدا می‌کند و آن را با confirmation value مقایسه می‌کند. این validation rule به‌صورت reactive اجرا می‌شود؛ اگر هرکدام از passwordها تغییر کند، validation به‌صورت خودکار دوباره اجرا می‌شود.

## Conditional validation

گاهی یک validation rule باید فقط تحت شرایط خاصی اعمال شود؛ مثلا validate کردن shipping address فقط وقتی order به‌صورت international ارسال می‌شود، یا اعمال ruleهای متفاوت برای هر variant از یک field با union type.

چون validation ruleها در schema function زندگی می‌کنند، آن‌ها را با همان structural functionهایی که schemaها را compose می‌کنند به‌صورت شرطی اعمال می‌کنید:

- از [`applyWhen()`](guide/forms/signals/form-logic#conditional-logic-with-applywhen) استفاده کنید تا groupای از ruleها را بر اساس form state reactive فعال کنید، از جمله valueهای fieldهای دیگر.
- از [`applyWhenValue()`](guide/forms/signals/schemas#type-narrowing-with-applywhenvalue) استفاده کنید تا ruleها را بر اساس value خود field اعمال کنید. وقتی predicate یک type guard باشد، ruleها به narrowed value type می‌شوند؛ این روش برای validate کردن discriminated unionها و variant typeهای دیگر پیشنهاد می‌شود.

برای مثال‌های کامل، از جمله schemaهای reusable و discriminated unionها، [راهنمای Schemas and schema composability](guide/forms/signals/schemas) را ببینید.

## Async validation

Async validation، validationهایی را مدیریت می‌کند که به external data source نیاز دارند، مثل بررسی availability مربوط به username روی server یا validate کردن بر اساس API.

### استفاده از validateHttp()

Function مربوط به `validateHttp()`، validation مبتنی بر HTTP انجام می‌دهد:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, validateHttp} from '@angular/forms/signals';

@Component({
  selector: 'app-username-form',|
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Username
        <input [formField]="usernameForm.username" />

        @if (usernameForm.username().pending()) {
          <span class="checking">Checking availability...</span>
        }
      </label>
    </form>
  `,
})
export class UsernameFormComponent {
  usernameModel = signal({username: ''});

  usernameForm = form(this.usernameModel, (schemaPath) => {
    required(schemaPath.username, {message: 'Username is required'});

    validateHttp(schemaPath.username, {
      request: ({value}) => `/api/check-username?username=${value()}`,
      onSuccess: (response: any) => {
        if (response.taken) {
          return {
            kind: 'usernameTaken',
            message: 'Username is already taken',
          };
        }
        return null;
      },
      onError: (error) => ({
        kind: 'networkError',
        message: 'Could not verify username availability',
      }),
    });
  });
}
```

Validation rule مربوط به `validateHttp()`:

1. URL یا requestای را که function مربوط به `request` برمی‌گرداند call می‌کند
2. Response موفق را با `onSuccess` به validation error یا `null` map می‌کند
3. Request failureها، مثل network errorها و HTTP errorها، را با `onError` مدیریت می‌کند
4. هنگام در جریان بودن request، `pending()` را روی `true` می‌گذارد
5. فقط بعد از pass شدن همه synchronous validation ruleها اجرا می‌شود

### Pending state

وقتی async validation اجرا می‌شود، signal مربوط به `pending()` همان field مقدار `true` برمی‌گرداند. از این برای نمایش loading indicatorها استفاده کنید:

```angular-html
@if (form.username().pending()) {
  <span class="spinner">Checking...</span>
}
```

Signal مربوط به `valid()` هنگام pending بودن validation مقدار `false` برمی‌گرداند، حتی اگر هنوز errorای وجود نداشته باشد. Signal مربوط به `invalid()` فقط وقتی `true` برمی‌گرداند که error وجود داشته باشد.

## Integration با schema validation libraryها

Signal Forms پشتیبانی built-in برای libraryهایی دارد که با [Standard Schema](https://standardschema.dev/) سازگارند، مثل [Zod](https://zod.dev/) یا [Valibot](https://valibot.dev/). این integration از طریق function مربوط به `validateStandardSchema` فراهم می‌شود. این کار اجازه می‌دهد از schemaهای موجود استفاده کنید و در عین حال مزیت‌های validation reactive مربوط به Signal Forms را حفظ کنید.

```ts
import {form, validateStandardSchema} from '@angular/forms/signals';
import * as z from 'zod';

// Define your schema
const userSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

// Use with Signal Forms
const userForm = form(signal({email: '', password: ''}), (schemaPath) => {
  validateStandardSchema(schemaPath, userSchema);
});
```

### Dynamic schemaها

می‌توانید به‌جای static schema یک signal پاس بدهید تا validation schema هنگام تغییر dependencyهایش به‌صورت خودکار update شود.

```angular-ts
import {Component, computed, signal} from '@angular/core';
import {form, FormField, validateStandardSchema} from '@angular/forms/signals';
import z from 'zod';

@Component({
  /* ... */
})
export class DynamicSchema {
  model = signal({document: '', type: 'dni'});

  // Schema reacts automatically to type changes
  schema = computed(() =>
    z.object({
      document:
        this.model().type === 'dni'
          ? z.string().length(8, 'DNI must be 8 digits')
          : z.string().min(12, 'Passport must be at least 12 characters'),
    }),
  );

  f = form(this.model, (p) => validateStandardSchema(p, () => this.schema()));
}
```

## قدم بعدی

این راهنما ساخت و اعمال validation ruleها را پوشش داد. راهنماهای مرتبط جنبه‌های دیگر Signal Forms را بررسی می‌کنند:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/field-state-management" title="مدیریت field state" />
  <docs-pill href="guide/forms/signals/models" title="Form modelها" />
  <docs-pill href="guide/forms/signals/form-logic" title="اضافه کردن form logic" />
  <docs-pill href="guide/forms/signals/schemas" title="Schemaها و composability مربوط به schema" />
</docs-pill-row>
