# کنترل‌های سفارشی

NOTE: این راهنما فرض می‌کند با [مبانی Signal Forms](essentials/signal-forms) آشنا هستید.

کنترل‌های داخلی فرم در مرورگر، مثل input، select و textarea، سناریوهای رایج را پوشش می‌دهند؛ اما برنامه‌ها اغلب به ورودی‌های تخصصی نیاز دارند. یک date picker با رابط تقویم، یک rich text editor با نوار ابزار قالب‌بندی، یا یک tag selector همراه با autocomplete همگی به پیاده‌سازی سفارشی نیاز دارند.

Signal Forms با هر componentای کار می‌کند که interfaceهای مشخصی را پیاده‌سازی کند. یک **control interface** propertyها و signalهایی را تعریف می‌کند که component شما از طریق آن‌ها با سیستم فرم ارتباط می‌گیرد. وقتی component شما یکی از این interfaceها را پیاده‌سازی کند، directive مربوط به `[formField]` به‌صورت خودکار control شما را به form state، validation و data binding وصل می‌کند.

HELPFUL: Custom Signal Form Controls را می‌توان [بدون کد سازگاری اضافه](guide/forms/signals/migration#custom-controls) با Signal Forms، Reactive Forms و Template-Driven Forms استفاده کرد.

## ساخت یک custom control پایه

بیایید با یک پیاده‌سازی حداقلی شروع کنیم و هر جا لازم شد قابلیت‌های بیشتری اضافه کنیم.

### کنترل input حداقلی

یک custom input پایه فقط باید interface مربوط به `FormValueControl` را پیاده‌سازی کند و signal مدل `value` موردنیاز را تعریف کند.

```angular-ts
import {Component, model} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';

@Component({
  selector: 'app-basic-input',
  template: `
    <div class="basic-input">
      <input
        type="text"
        [value]="value()"
        (input)="value.set($event.target.value)"
        placeholder="Enter text..."
      />
    </div>
  `,
})
export class BasicInput implements FormValueControl<string> {
  /** The current input value */
  value = model('');
}
```

### کنترل checkbox حداقلی

یک control شبیه checkbox به دو چیز نیاز دارد:

1. interface مربوط به `FormCheckboxControl` را پیاده‌سازی کند تا directive مربوط به `FormField` آن را به‌عنوان form control تشخیص دهد.
2. یک signal مدل `checked` ارائه کند.

```angular-ts
import {Component, model, ChangeDetectionStrategy} from '@angular/core';
import {FormCheckboxControl} from '@angular/forms/signals';

@Component({
  selector: 'app-basic-toggle',
  template: `
    <button type="button" [class.active]="checked()" (click)="toggle()">
      <span class="toggle-slider"></span>
    </button>
  `,
})
export class BasicToggle implements FormCheckboxControl {
  /** Whether the toggle is checked */
  checked = model<boolean>(false);

  toggle() {
    this.checked.update((val) => !val);
  }
}
```

### استفاده از custom control

بعد از ساخت یک control، می‌توانید آن را هر جایی که از یک input داخلی استفاده می‌کنید به کار ببرید؛ کافی است directive مربوط به `FormField` را به آن اضافه کنید:

```angular-ts
import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';
import {BasicInput} from './basic-input';
import {BasicToggle} from './basic-toggle';

@Component({
  imports: [FormField, BasicInput, BasicToggle],
  template: `
    <form novalidate>
      <label>
        Email
        <app-basic-input [formField]="registrationForm.email" />
      </label>

      <label>
        Accept terms
        <app-basic-toggle [formField]="registrationForm.acceptTerms" />
      </label>

      <button type="submit" [disabled]="registrationForm().invalid()">Register</button>
    </form>
  `,
})
export class Registration {
  registrationModel = signal({
    email: '',
    acceptTerms: false,
  });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.email, {message: 'Email is required'});
    required(schemaPath.acceptTerms, {message: 'You must accept the terms'});
  });
}
```

NOTE: پارامتر callback مربوط به schema، یعنی `schemaPath` در این مثال‌ها، یک object از نوع `SchemaPathTree` است که مسیر همه‌ی fieldهای فرم را فراهم می‌کند. می‌توانید این پارامتر را هر نامی که دوست دارید بگذارید.

directive مربوط به `[formField]` برای custom controlها و inputهای داخلی دقیقا یکسان کار می‌کند. Signal Forms با هر دو مثل هم رفتار می‌کند: validation اجرا می‌شود، state به‌روزرسانی می‌شود و data binding به‌صورت خودکار کار می‌کند.

## شناخت control interfaceها

حالا که custom controlها را در عمل دیدید، بیایید بررسی کنیم چطور با Signal Forms یکپارچه می‌شوند.

### Control interfaceها

componentهای `BasicInput` و `BasicToggle` که ساختید، interfaceهای مشخصی را پیاده‌سازی می‌کنند که به Signal Forms می‌گویند چطور با آن‌ها تعامل کند.

#### FormValueControl

`FormValueControl` interface بیشتر نوع‌های input است: text input، number input، date picker، select dropdown و هر controlی که یک مقدار واحد را ویرایش می‌کند. وقتی component شما این interface را پیاده‌سازی می‌کند:

- **Property موردنیاز**: component شما باید یک signal مدل `value` ارائه کند.
- **کاری که directive مربوط به FormField انجام می‌دهد**: مقدار form field را به signal `value` کنترل شما bind می‌کند.

IMPORTANT: کنترل‌هایی که `FormValueControl` را پیاده‌سازی می‌کنند نباید property به نام `checked` داشته باشند.

#### FormCheckboxControl

`FormCheckboxControl` interface کنترل‌های شبیه checkbox است: toggleها، switchها و هر controlی که یک وضعیت boolean روشن/خاموش را نمایش می‌دهد. وقتی component شما این interface را پیاده‌سازی می‌کند:

- **Property موردنیاز**: component شما باید یک signal مدل `checked` ارائه کند.
- **کاری که directive مربوط به FormField انجام می‌دهد**: مقدار form field را به signal `checked` کنترل شما bind می‌کند.

IMPORTANT: کنترل‌هایی که `FormCheckboxControl` را پیاده‌سازی می‌کنند نباید property به نام `value` داشته باشند.

### Propertyهای اختیاری state

هر دو interface، یعنی `FormValueControl` و `FormCheckboxControl`، از `FormUiControl` گسترش پیدا می‌کنند؛ یک interface پایه که propertyهای اختیاری برای یکپارچگی با form state فراهم می‌کند.

همه‌ی propertyها اختیاری هستند. فقط همان‌هایی را پیاده‌سازی کنید که control شما نیاز دارد.

#### Interaction state

زمان تعامل کاربر با control را دنبال کنید:

| Property  | هدف |
| --------- | --- |
| `touched` | آیا کاربر با field تعامل داشته است |
| `dirty`   | آیا مقدار با وضعیت اولیه‌اش متفاوت است |

#### Validation state

بازخورد validation را به کاربر نمایش دهید:

| Property  | هدف |
| --------- | --- |
| `errors`  | آرایه‌ای از خطاهای validation فعلی |
| `valid`   | آیا field معتبر است |
| `invalid` | آیا field خطای validation دارد |
| `pending` | آیا async validation در حال اجراست |

#### Availability state

کنترل کنید کاربر می‌تواند با field تعامل کند یا نه:

| Property          | هدف |
| ----------------- | --- |
| `disabled`        | آیا field غیرفعال است |
| `disabledReasons` | دلیل‌های غیرفعال بودن field |
| `readonly`        | آیا field فقط‌خواندنی است، یعنی دیده می‌شود اما قابل ویرایش نیست |
| `hidden`          | آیا field از نما پنهان است |

NOTE: `disabledReasons` آرایه‌ای از objectهای `DisabledReason` است. هر object یک property به نام `field` دارد، یعنی reference به field tree، و می‌تواند یک property اختیاری `message` هم داشته باشد. پیام را از طریق `reason.message` بخوانید.

#### Validation constraints

مقادیر constraint مربوط به validation را از فرم دریافت کنید:

| Property    | هدف |
| ----------- | --- |
| `required`  | آیا field اجباری است |
| `min`       | حداقل مقدار عددی، یا `undefined` اگر constraintی وجود ندارد |
| `max`       | حداکثر مقدار عددی، یا `undefined` اگر constraintی وجود ندارد |
| `minLength` | حداقل طول string، یا undefined اگر constraintی وجود ندارد |
| `maxLength` | حداکثر طول string، یا undefined اگر constraintی وجود ندارد |
| `pattern`   | آرایه‌ای از الگوهای regular expression که باید match شوند |

#### Field metadata

| Property | هدف |
| -------- | --- |
| `name`   | attribute مربوط به نام field، که در سراسر formها و appها یکتا است |

بخش «[اضافه کردن state signalها](#adding-state-signals)» در ادامه نشان می‌دهد چطور این propertyها را در controlهای خود پیاده‌سازی کنید.

### directive مربوط به FormField چطور کار می‌کند

directive مربوط به `[formField]` تشخیص می‌دهد control شما کدام interface را پیاده‌سازی کرده و signalهای مناسب را به‌صورت خودکار bind می‌کند:

```angular-ts
import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';
import {CustomInput} from './custom-input';
import {CustomToggle} from './custom-toggle';

@Component({
  selector: 'app-my-form',
  imports: [FormField, CustomInput, CustomToggle],
  template: `
    <form novalidate>
      <app-custom-input [formField]="userForm.username" />
      <app-custom-toggle [formField]="userForm.subscribe" />
    </form>
  `,
})
export class MyForm {
  formModel = signal({
    username: '',
    subscribe: false,
  });

  userForm = form(this.formModel, (schemaPath) => {
    required(schemaPath.username, {message: 'Username is required'});
  });
}
```

TIP: برای پوشش کامل ساخت و مدیریت form modelها، [راهنمای Form Models](guide/forms/signals/models) را ببینید.

وقتی `[formField]="userForm.username"` را bind می‌کنید، directive مربوط به FormField:

1. تشخیص می‌دهد control شما `FormValueControl` را پیاده‌سازی کرده است.
2. به‌صورت داخلی به `userForm.username().value()` دسترسی پیدا می‌کند و آن را به signal مدل `value` در control شما bind می‌کند.
3. signalهای form state مثل `disabled()` و `errors()` را به input signalهای اختیاری control شما bind می‌کند.
4. به‌روزرسانی‌ها از طریق reactivity سیگنال‌ها به‌صورت خودکار انجام می‌شوند.

## اضافه کردن state signalها

controlهای حداقلی بالا کار می‌کنند، اما به form state واکنش نشان نمی‌دهند. می‌توانید input signalهای اختیاری اضافه کنید تا controlها به disabled state واکنش نشان دهند، خطاهای validation را نمایش دهند و تعامل کاربر را دنبال کنند.

این یک نمونه‌ی کامل است که propertyهای رایج state را پیاده‌سازی می‌کند:

```angular-ts
import {Component, model, input, output, ChangeDetectionStrategy} from '@angular/core';
import {
  FormValueControl,
  WithOptionalFieldTree,
  ValidationError,
  DisabledReason,
} from '@angular/forms/signals';

@Component({
  selector: 'app-stateful-input',
  template: `
    @if (!hidden()) {
      <div class="input-container">
        <input
          type="text"
          [value]="value()"
          (input)="value.set($event.target.value)"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [class.invalid]="invalid()"
          [attr.aria-invalid]="invalid()"
          (blur)="touch.emit()"
        />

        @if (invalid()) {
          <div class="error-messages" role="alert">
            @for (error of errors(); track error) {
              <span class="error">{{ error.message }}</span>
            }
          </div>
        }

        @if (disabled() && disabledReasons().length > 0) {
          <div class="disabled-reasons">
            @for (reason of disabledReasons(); track reason) {
              <span>{{ reason.message }}</span>
            }
          </div>
        }
      </div>
    }
  `,
})
export class StatefulInput implements FormValueControl<string> {
  // Required
  value = model<string>('');

  // Writable interaction state - control updates these
  touched = input<boolean>(false);
  touch = output<void>();

  // Read-only state - form system manages these
  disabled = input<boolean>(false);
  disabledReasons = input<readonly DisabledReason[]>([]);
  readonly = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
}
```

در نتیجه، می‌توانید این control را همراه با validation و state management استفاده کنید:

```angular-ts
import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
import {form, FormField, required, email} from '@angular/forms/signals';
import {StatefulInput} from './stateful-input';

@Component({
  imports: [FormField, StatefulInput],
  template: `
    <form novalidate>
      <label>
        Email
        <app-stateful-input [formField]="loginForm.email" />
      </label>
    </form>
  `,
})
export class Login {
  loginModel = signal({email: ''});

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, {message: 'Email is required'});
    email(schemaPath.email, {message: 'Enter a valid email address'});
  });
}
```

وقتی کاربر یک email نامعتبر وارد می‌کند، directive مربوط به FormField به‌صورت خودکار `invalid()` و `errors()` را به‌روزرسانی می‌کند. control شما می‌تواند بازخورد validation را نمایش دهد.

### نوع signal برای propertyهای state

بیشتر propertyهای state از `input()` استفاده می‌کنند، چون از سمت فرم فقط خواندنی هستند. وقتی control شما `touched` را هنگام تعامل کاربر به‌روزرسانی می‌کند، برای آن از `model()` استفاده کنید. property مربوط به `touched` به‌طور خاص بسته به نیاز شما از `model()`، `input()` یا `OutputRef` پشتیبانی می‌کند.

### کار با `debounce('blur')`

قاعده‌ی [`debounce('blur')`](api/forms/signals/debounce) به‌روزرسانی‌ها از UI به form model را تا زمانی که field blur شود به تاخیر می‌اندازد، به‌جای اینکه آن‌ها را روی هر keystroke اعمال کند. کنترل‌های داخلی blur را به‌صورت خودکار به فرم گزارش می‌کنند. یک custom control فقط زمانی در این رفتار شرکت می‌کند که output مربوط به `touch` را در پاسخ به event بومی [`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) emit کند:

```angular-ts
import {Component, model, output} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';

@Component({
  selector: 'app-custom-input',
  template: `
    <input
      type="text"
      [value]="value()"
      (input)="value.set($event.target.value)"
      (blur)="touch.emit()"
    />
  `,
})
export class CustomInput implements FormValueControl<string> {
  value = model('');
  touch = output<void>();
}
```

وقتی output مربوط به `touch` وجود داشته باشد، `debounce('blur')` برای control شما همان رفتاری را دارد که برای inputهای داخلی دارد:

```angular-ts
import {Component, signal} from '@angular/core';
import {debounce, form, FormField} from '@angular/forms/signals';
import {CustomInput} from './custom-input';

@Component({
  selector: 'app-root',
  imports: [CustomInput, FormField],
  template: `<app-custom-input [formField]="userForm.name" />`,
})
export class App {
  userModel = signal({name: ''});

  userForm = form(this.userModel, (schemaPath) => {
    debounce(schemaPath.name, 'blur');
  });
}
```

IMPORTANT: `touch` را روی `blur` emit کنید، یعنی زمانی که focus از control خارج می‌شود، نه روی `focus`. بدون output مربوط به `touch`، field هرگز به‌عنوان blurred ثبت نمی‌شود؛ بنابراین `debounce('blur')` اثری روی control شما ندارد.

## تبدیل مقدار

controlها گاهی مقدارها را متفاوت از چیزی نمایش می‌دهند که form model ذخیره می‌کند؛ مثلا یک date picker ممکن است "January 15, 2024" را نمایش دهد اما "2024-01-15" را ذخیره کند، یا یک currency input ممکن است "$1,234.56" را نشان دهد اما 1234.56 را ذخیره کند.

برای تبدیل مقدار مدل به مقدار نمایشی از `linkedSignal()`، از `@angular/core`، استفاده کنید و eventهای input را مدیریت کنید تا ورودی کاربر دوباره به قالب ذخیره‌سازی parse شود:

```angular-ts
import {formatCurrency} from '@angular/common';
import {ChangeDetectionStrategy, Component, linkedSignal, model} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';

@Component({
  selector: 'app-currency-input',
  template: `
    <input
      type="text"
      [value]="displayValue()"
      (input)="displayValue.set($event.target.value)"
      (blur)="updateModel()"
    />
  `,
})
export class CurrencyInput implements FormValueControl<number> {
  // Stores numeric value (1234.56)
  readonly value = model.required<number>();

  // Stores display value ("1,234.56")
  readonly displayValue = linkedSignal(() => formatCurrency(this.value(), 'en', 'USD'));

  // Update the model from the display value.
  updateModel() {
    this.value.set(parseCurrency(this.displayValue()));
  }
}

// Converts a currency string to a number (e.g. "USD1,234.56" -> 1234.56).
function parseCurrency(value: string): number {
  return parseFloat(value.replace(/^[^\d-]+/, '').replace(/,/g, ''));
}
```

## یکپارچگی با validation

controlها validation state را نمایش می‌دهند، اما خودشان validation انجام نمی‌دهند. validation در schema فرم انجام می‌شود؛ control شما signalهای `invalid()` و `errors()` را از directive مربوط به FormField دریافت می‌کند و آن‌ها را نمایش می‌دهد، همان‌طور که در نمونه‌ی StatefulInput بالا دیدید.

directive مربوط به FormField همچنین مقدار constraintهای validation مثل `required`، `min`، `max`، `minLength`، `maxLength` و `pattern` را پاس می‌دهد. control شما می‌تواند از این‌ها برای بهتر کردن UI استفاده کند:

```ts
export class NumberInput implements FormValueControl<number> {
  value = model<number>(0);

  // Constraint values from schema validation rules
  required = input<boolean>(false);
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);
}
```

وقتی ruleهای validation مربوط به `min()` و `max()` را به schema اضافه می‌کنید، directive مربوط به FormField این مقدارها را به control شما پاس می‌دهد. می‌توانید از آن‌ها برای اعمال attributeهای HTML5 یا نمایش راهنمای constraint در template استفاده کنید.

IMPORTANT: منطق validation را داخل control پیاده‌سازی نکنید. ruleهای validation را در schema فرم تعریف کنید و اجازه دهید control فقط نتیجه‌ها را نمایش دهد:

```ts {avoid}
// Avoid: Validation in control
export class BadControl implements FormValueControl<string> {
  value = model<string>('');
  isValid() {
    return this.value().length >= 8;
  } // Don't do this!
}
```

```ts {prefer}
// Good: Validation in schema, control displays results
accountForm = form(this.accountModel, (schemaPath) => {
  minLength(schemaPath.password, 8, {message: 'Password must be at least 8 characters'});
});
```

## قابل استفاده‌ی دوباره کردن controlها

یک custom control اغلب انتظارهای ضمنی درباره‌ی validation دارد. یک email input در هر فرمی که از آن استفاده می‌کند به ruleهای `required` و `email` نیاز دارد. به‌جای اینکه روی هر مصرف‌کننده حساب کنید تا آن ruleها را دوباره تعریف کند، یک schema همراه در کنار control بسته‌بندی کنید و هر دو را از همان module export کنید:

```ts {header: 'email-input.ts'}
import {schema, required, email} from '@angular/forms/signals';

export const emailFieldSchema = schema<string>((path) => {
  required(path, {message: 'Email is required'});
  email(path, {message: 'Enter a valid email address'});
});
```

مصرف‌کننده schema همراه را import می‌کند و آن را با `apply()` داخل فرم خودش compose می‌کند:

```ts {header: 'registration.ts'}
import {form, apply} from '@angular/forms/signals';
import {emailFieldSchema} from './email-input';

registrationForm = form(this.registrationModel, (path) => {
  apply(path.email, emailFieldSchema);
});
```

`apply()` ruleهای schema همراه را در مسیر مشخص‌شده با فرم والد merge می‌کند. مصرف‌کننده همچنان می‌تواند ruleهای بیشتری به همان field اضافه کند، چون `apply()` با ruleهای دیگر compose می‌شود و آن‌ها را جایگزین نمی‌کند. برای پوشش کامل `schema()`، `apply()` و composition شرطی با `applyWhen()`، [راهنمای Schemas](guide/forms/signals/schemas) را ببینید.

### نکته‌های طراحی

model مصرف‌کننده باید هر field را با یک مقدار تعریف‌شده initialize کند. در Signal Forms، `undefined` به معنی نبودن field است، نه مقدار خالی. برای یک email control قابل استفاده‌ی دوباره، این یعنی مصرف‌کننده باید مقدار اولیه را `''` قرار دهد و property را undefined رها نکند. برای جزئیات انتخاب مقدارهای اولیه، [راهنمای Form Models](guide/forms/signals/models) را ببینید.

همچنین controlها نباید effectهای خودشان را برای state management ثبت کنند. سیستم فرم، field state را از طریق effectهای داخلی مدیریت می‌کند. یعنی control شما به‌روزرسانی‌های state را از طریق input signalها دریافت می‌کند. اگر control لازم دارد مقدارها را تبدیل کند، همان‌طور که در بخش «[تبدیل مقدار](#value-transformation)» نشان داده شد از `linkedSignal()` استفاده کنید، نه از `effect()`.

## گام‌های بعدی

این راهنما ساخت custom controlهایی را پوشش داد که با Signal Forms یکپارچه می‌شوند. راهنماهای مرتبط، جنبه‌های دیگر Signal Forms را بررسی می‌کنند:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/models" title="Form models" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Field state management" />
  <docs-pill href="guide/forms/signals/validation" title="Validation" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Working with Arrays" /> -->
</docs-pill-row>
