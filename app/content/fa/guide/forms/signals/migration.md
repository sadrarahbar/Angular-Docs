# مهاجرت formهای موجود به Signal Forms

این راهنما strategyهایی برای migrate کردن codebaseهای موجود به Signal Forms فراهم می‌کند، با تمرکز روی interoperability با Reactive Forms موجود.

## مهاجرت top-down با `compatForm`

گاهی ممکن است بخواهید instanceهای reactive `FormControl` موجود را داخل یک Signal Form استفاده کنید. این کار برای controlهایی مفید است که شامل موارد زیر هستند:

- Logic asynchronous پیچیده.
- Operatorهای RxJS ظریف که هنوز port نشده‌اند.
- Integration با libraryهای third-party موجود.

### Integrate کردن یک `FormControl` داخل signal form

یک `passwordControl` موجود را در نظر بگیرید که از یک `enterprisePasswordValidator` تخصصی استفاده می‌کند. به‌جای بازنویسی validator، می‌توانید control را به signal state خود bridge کنید.

می‌توانیم این کار را با `compatForm` انجام دهیم:

```typescript
import {signal} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {compatForm} from '@angular/forms/signals/compat';

// 1. Existing control with a specialized validator
const passwordControl = new FormControl('', {
  validators: [Validators.required, enterprisePasswordValidator()],
  nonNullable: true,
});

// 2. Wrap it inside your form state signal
const user = signal({
  email: '',
  password: passwordControl, // Nest the existing control directly
});

// 3. Create the form
const f = compatForm(user);

// Access values via the signal tree
console.log(f.email().value()); // Current email value
console.log(f.password().value()); // Current value of passwordControl

// Reactive state is proxied automatically
const isPasswordValid = f.password().valid();
const passwordErrors = f.password().errors(); // Returns CompatValidationError if the existing validator fails
```

در template، با bind کردن underlying control از syntax استاندارد reactive استفاده کنید:

```angular-html
<form novalidate>
  <div>
    <label>
      Email:
      <input [formField]="f.email" />
    </label>
  </div>

  <div>
    <label>
      Password:
      <input [formField]="f.password" type="password" />
    </label>

    @if (f.password().touched() && f.password().invalid()) {
      <div class="error-list">
        @for (error of f.password().errors(); track error) {
          <p>{{ error.message || error.kind }}</p>
        }
      </div>
    }
  </div>
</form>
```

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/compat-form-control-integration/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/compat-form-control-integration/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/compat-form-control-integration/app/app.html"/>
</docs-code-multifile>

### Integrate کردن یک `FormGroup` داخل signal form

همچنین می‌توانید یک `FormGroup` کامل را wrap کنید. این کار وقتی رایج است که یک subsection reusable از form، مثل **Address Block**، هنوز توسط Reactive Forms موجود مدیریت می‌شود.

```typescript
import {signal} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {compatForm} from '@angular/forms/signals/compat';

// 1. An existing address group with its own validation logic
const addressGroup = new FormGroup({
  street: new FormControl('123 Angular Way', Validators.required),
  city: new FormControl('Mountain View', Validators.required),
  zip: new FormControl('94043', Validators.required),
});

// 2. Include it in the state like it's a value
const checkoutModel = signal({
  customerName: 'Pirojok the Cat',
  shippingAddress: addressGroup,
});

const f = compatForm(checkoutModel, (p) => {
  required(p.customerName);
});
```

Field مربوط به `shippingAddress` مثل یک branch در tree مربوط به Signal Form شما عمل می‌کند. می‌توانید این nested controlها را در template با دسترسی به underlying existing controlها از طریق `.control()` bind کنید:

```angular-html
<form novalidate>
  <h3>Shipping Details</h3>

  <div>
    <label>
      Customer Name:
      <input [formField]="f.customerName" />
    </label>

    @if (f.customerName().touched() && f.customerName().invalid()) {
      <div class="error-list">
        <p>Customer name is required.</p>
      </div>
    }
  </div>

  <fieldset>
    <legend>Address</legend>

    @let street = f.shippingAddress().control().controls.street;
    <div>
      <label>
        Street:
        <input [formControl]="street" />
      </label>
      @if (street.touched && street.invalid) {
        <div class="error-list">
          <p>Street is required</p>
        </div>
      }
    </div>

    @let city = f.shippingAddress().control().controls.city;
    <div>
      <label>
        City:
        <input [formControl]="city" />
      </label>
      @if (city.touched && city.invalid) {
        <div class="error-list">
          <p>City is required</p>
        </div>
      }
    </div>

    @let zip = f.shippingAddress().control().controls.zip;
    <div>
      <label>
        Zip Code:
        <input [formControl]="zip" />
      </label>
      @if (zip.touched && zip.invalid) {
        <div class="error-list">
          <p>Zip Code is required</p>
        </div>
      }
    </div>
  </fieldset>
</form>
```

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/compat-form-group-integration/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/compat-form-group-integration/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/compat-form-group-integration/app/app.html"/>
</docs-code-multifile>

### دسترسی به valueها

در حالی که `compatForm` دسترسی به value را در سطح `FormControl` proxy می‌کند، value کامل form خود control را حفظ می‌کند:

```typescript
const passwordControl = new FormControl('password' /** ... */);

const user = signal({
  email: '',
  password: passwordControl, // Nest the existing control directly
});

const form = compatForm(user);
form.password().value(); // 'password'
form().value(); // { email: '', password: FormControl}
```

اگر به value کل form نیاز دارید، باید آن را دستی بسازید:

```typescript
const formValue = computed(() => ({
  email: form.email().value(),
  password: form.password().value(),
})); // {email: '', password: ''}
```

## مهاجرت bottom-up

### Integrate کردن یک Signal Form داخل `FormGroup`

می‌توانید از `SignalFormControl` استفاده کنید تا یک form مبتنی بر signal را به‌عنوان یک `FormControl` استاندارد expose کنید. این کار وقتی مفید است که می‌خواهید leaf nodeهای یک form را به Signals migrate کنید، در حالی که ساختار parent `FormGroup` را نگه می‌دارید.

```typescript
import {Component, signal} from '@angular/core';
import {ReactiveFormsModule, FormGroup} from '@angular/forms';
import {SignalFormControl} from '@angular/forms/signals/compat';
import {required} from '@angular/forms/signals';

@Component({
  // ...
  imports: [ReactiveFormsModule],
})
export class UserProfile {
  // 1. Create a SignalFormControl, use signal form rules.
  emailControl = new SignalFormControl('', (p) => {
    required(p, {message: 'Email is required'});
  });

  // 2. Use it in an existing FormGroup
  form = new FormGroup({
    email: this.emailControl,
  });
}
```

`SignalFormControl` valueها را به‌صورت bidirectional بین سیستم **Signal Forms** و سیستم **Reactive Forms** sync می‌کند:

- **Signal -> Reactive**: Update کردن value از طریق Signal Forms، control مربوط به Reactive Form را بلافاصله update می‌کند.

```typescript
// Signal Forms update
this.emailControl.fieldTree().value.set('new@example.com');

// Reactive Forms reflects the change
console.log(this.form.value); // {email: 'new@example.com'}
```

- **Reactive -> Signal**: Update کردن value از طریق parent `FormGroup`، state مربوط به Signal Forms را update می‌کند.

```typescript
// Reactive Forms update
this.form.patchValue({email: 'other@example.com'});

// Signal Forms reflects the change
console.log(this.emailControl.fieldTree().value()); // 'other@example.com'
```

### Bind کردن `SignalFormControl`

برای استفاده از `SignalFormControl` در یک `FormGroup`، آن را به‌عنوان control پاس بدهید و در template با استفاده از `.fieldTree` bind کنید:

```typescript
readonly emailControl = new SignalFormControl('', (p) => { required(p); });

readonly form = new FormGroup({
  name: new FormControl('Alice'),
  email: this.emailControl,
});
```

```angular-html {prefer}
<form [formGroup]="form">
  <!-- Standard control -->
  <input formControlName="name" />

  <!-- Signal control -->
  <input [formField]="emailControl.fieldTree" />
</form>
```

```angular-html {avoid}
<!-- Avoid: Using formControlName or [formControl] for SignalFormControl -->
<input formControlName="email" />
<input [formControl]="emailControl" />
```

### چرا `SignalFormControl` به‌جای signal، value می‌گیرد

در Signal Forms استاندارد، با پاس دادن یک signal، form می‌سازید: `form(mySignal)`.

اما `SignalFormControl` به‌عنوان اولین argument یک **raw value**، مثل string یا object، می‌گیرد:

```typescript
// Takes a raw value, not a signal
const userControl = new SignalFormControl({
  email: 'pirojok@example.com',
});
```

`SignalFormControl` signal را به‌صورت داخلی می‌سازد تا writeها را intercept کند و **synchronous update**هایی را trigger کند که Reactive Forms انتظار دارد.

همچنان می‌توانید از طریق `.sourceValue` به internal signal دسترسی داشته باشید:

```typescript
const value = userControl.sourceValue();
```

### Disable/Enable کردن control

APIهای imperative برای تغییر enabled/disabled state، مثل `enable()` و `disable()`، عمدا در `SignalFormControl` پشتیبانی نمی‌شوند.
دلیلش این است که state مربوط به control باید از signal state و ruleها derive شود.

تلاش برای call کردن disable/enable باعث throw شدن error می‌شود.

```typescript {avoid}
import {signal, effect} from '@angular/core';

export class UserProfile {
  readonly emailControl = new SignalFormControl('');

  readonly isLoading = signal(false);

  constructor() {
    // This will throw an error
    effect(() => {
      if (this.isLoading()) {
        this.emailControl.disable();
      } else {
        this.emailControl.enable();
      }
    });
  }
}
```

به‌جای آن از disabled rule استفاده کنید:

```typescript {prefer}
import {signal} from '@angular/core';
import {SignalFormControl} from '@angular/forms/signals/compat';
import {disabled} from '@angular/forms/signals';

export class UserProfile {
  readonly isLoading = signal(false);

  readonly emailControl = new SignalFormControl('', (p) => {
    // The control becomes disabled whenever isLoading is true
    disabled(p, {when: () => this.isLoading()});
  });

  async saveData() {
    this.isLoading.set(true);
    // ... perform save ...
    this.isLoading.set(false);
  }
}
```

### Dynamic manipulation

APIهای imperative برای اضافه یا حذف کردن validatorها، مثل `addValidators()`، `removeValidators()` و `setValidators()`، عمدا در `SignalFormControl` پشتیبانی نمی‌شوند.

تلاش برای call کردن این methodها باعث throw شدن error می‌شود.

```typescript {avoid}
export class UserProfile {
  readonly emailControl = new SignalFormControl('');
  readonly isRequired = signal(false);

  toggleRequired() {
    this.isRequired.update((v) => !v);
    // This will throw an error
    if (this.isRequired()) {
      this.emailControl.addValidators(Validators.required);
    } else {
      this.emailControl.removeValidators(Validators.required);
    }
  }
}
```

به‌جای آن از rule مربوط به `applyWhen` استفاده کنید تا validatorها را به‌صورت شرطی اعمال کنید:

```typescript {prefer}
import {signal} from '@angular/core';
import {SignalFormControl} from '@angular/forms/signals/compat';
import {applyWhen, required} from '@angular/forms/signals';

export class UserProfile {
  readonly isRequired = signal(false);

  readonly emailControl = new SignalFormControl('', (p) => {
    // The control becomes required whenever isRequired is true
    applyWhen(
      p,
      () => this.isRequired(),
      (p) => {
        required(p);
      },
    );
  });
}
```

### انتخاب دستی Error

Methodهای `setErrors()` و `markAsPending()` پشتیبانی نمی‌شوند. در Signal Forms، errorها از validation ruleها و async validation status derive می‌شوند. اگر لازم دارید errorای گزارش کنید، باید به‌صورت declarative و از طریق یک validation rule در schema انجام شود.

## Status classهای خودکار

Reactive/Template Forms به‌صورت خودکار [class attribute](/guide/forms/template-driven-forms#track-control-states)هایی مثل `.ng-valid` یا `.ng-dirty` اضافه می‌کنند تا styling مربوط به control stateها آسان شود. Signal Forms این کار را انجام نمی‌دهد.

اگر می‌خواهید این behavior را حفظ کنید، می‌توانید preset مربوط به `NG_STATUS_CLASSES` را provide کنید:

```typescript
import {provideSignalFormsConfig} from '@angular/forms/signals';
import {NG_STATUS_CLASSES} from '@angular/forms/signals/compat';

bootstrapApplication(App, {
  providers: [
    provideSignalFormsConfig({
      classes: NG_STATUS_CLASSES,
    }),
  ],
});
```

همچنین می‌توانید configuration سفارشی خود را فراهم کنید تا بر اساس custom logic خودتان هر classای خواستید اعمال شود:

```typescript
import {provideSignalFormsConfig} from '@angular/forms/signals';

bootstrapApplication(App, {
  providers: [
    provideSignalFormsConfig({
      classes: {
        'ng-valid': ({state}) => state().valid(),
        'ng-invalid': ({state}) => state().invalid(),
        'ng-touched': ({state}) => state().touched(),
        'ng-dirty': ({state}) => state().dirty(),
      },
    }),
  ],
});
```

## Custom Controlها

هر [custom Signal Form Control](guide/forms/signals/custom-controls) را می‌توان همان‌طور که هست با Reactive Forms و Template-Driven Forms استفاده کرد. این کار اجازه می‌دهد implementationهای موجود `ControlValueAccessor` را بدون شکستن usageهای فعلی، به `FormValueControl`/`FormCheckboxControl` migrate کنید.

IMPORTANT: روی یک component، هم `ControlValueAccessor` و هم `FormValueControl`/`FormCheckboxControl` را با هم implement نکنید. یکی از آن‌ها را implement کنید.

با custom control زیر:

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

می‌توانید این custom control را با reactive forms همان‌طور استفاده کنید که از native input یا custom control مبتنی بر `ControlValueAccessor` استفاده می‌کنید. برای مثال، این component ساده را با Reactive Form در نظر بگیرید.

```angular-ts
import {Component} from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import {BasicInput} from './basic-input';

@Component({
  selector: 'app-example',
  template: `
    <form [formGroup]="reactiveFormGroup">
      <app-basic-input formControlName="reactiveControlName" />
    </form>
    <p>Text: {{ reactiveFormGroup.value.reactiveControlName }}</p>
  `,
  imports: [ReactiveFormsModule],
})
export class ExampleComponent {
  readonly reactiveFormGroup = new FormGroup({
    reactiveControlName: new FormControl(''),
  });
}
```

هر change روی custom control مربوط به `app-basic-input` در reactive `FormControl` منعکس می‌شود.
