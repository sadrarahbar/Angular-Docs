# Form modelها

Form modelها foundation مربوط به Signal Forms هستند و به‌عنوان single source of truth برای form data شما عمل می‌کنند. این راهنما بررسی می‌کند چطور form model بسازید، آن‌ها را update کنید و برای maintainability طراحی‌شان کنید.

NOTE: Form modelها با signal مربوط به `model()` در Angular که برای component two-way binding استفاده می‌شود متفاوت‌اند. Form model یک writable signal است که form data را ذخیره می‌کند، در حالی که `model()` برای communication بین parent/child component، input/output می‌سازد.

## Form modelها چه مشکلی را حل می‌کنند

Formها نیاز دارند dataای را مدیریت کنند که در طول زمان تغییر می‌کند. بدون ساختار روشن، این data می‌تواند بین propertyهای component پخش شود و track کردن changeها، validate کردن input یا submit کردن data به server را دشوار کند.

Form modelها این مشکل را با centralize کردن form data در یک writable signal واحد حل می‌کنند. وقتی model update شود، form آن changeها را به‌صورت خودکار منعکس می‌کند. وقتی کاربران با form تعامل کنند، model هم مطابق آن update می‌شود.

## ساخت modelها

Form model یک writable signal است که با function مربوط به `signal()` در Angular ساخته می‌شود. این signal آبجکتی را نگه می‌دارد که ساختار data مربوط به form شما را نشان می‌دهد.

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  imports: [FormField],
  template: `
    <input type="email" [formField]="loginForm.email" />
    <input type="password" [formField]="loginForm.password" />
  `,
})
export class LoginComponent {
  loginModel = signal({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel);
}
```

Function مربوط به [`form()`](api/forms/signals/form)، model signal را می‌پذیرد و یک **field tree** می‌سازد؛ ساختار object ویژه‌ای که شکل model شما را mirror می‌کند. Field tree هم قابل پیمایش است، مثلا با dot notation مثل `loginForm.email` به child fieldها دسترسی دارید، و هم callable است، یعنی می‌توانید یک field را مثل function call کنید تا به state آن دسترسی پیدا کنید.

Directive مربوط به `[formField]` هر input element را به field متناظر آن در field tree bind می‌کند و synchronization دوطرفه خودکار بین UI و model را ممکن می‌سازد.

### ساختارهای model پشتیبانی‌شده

Signal Forms با پیمایش model شما field tree را می‌سازد. Objectها و arrayهایی که از آن‌ها عبور می‌کند، یعنی **structural layer**، باید plain JavaScript object و array باشند. Valueهای برگ‌ها، یعنی positionهایی که nested field ندارند، معمولا primitiveهایی مثل string، number، boolean یا `null` هستند. Inputهای native از نوع `date`، `month`، `time` و `week` مقدار `Date` را هم می‌پذیرند، و custom controlها می‌توانند هر value typeای را که می‌فهمند قبول کنند.

```ts {prefer, header: 'Plain structure'}
interface UserFormModel {
  name: string;
  birthday: Date | null;
  preferences: {
    theme: string;
    notifications: boolean;
  };
  tags: string[];
}

const userModel = signal<UserFormModel>({
  name: '',
  birthday: null,
  preferences: {
    theme: 'dark',
    notifications: true,
  },
  tags: [],
});
```

IMPORTANT: Class instanceها، `Map` و `Set` در **structural layer** پشتیبانی نمی‌شوند، حتی اگر TypeScript آن‌ها را بپذیرد. Signal Forms شکل model را در runtime validate نمی‌کند، پس framework این valueها را بدون throw کردن می‌پذیرد، اما بسته به shape، رفتار نادرست تولید می‌کند:

- **Class instanceها** در اولین write، prototype خود را از دست می‌دهند، چون Signal Forms هنگام update، parent objectها را shallow-copy می‌کند. بعد از آن methodها، getterها و checkهای `instanceof` از بین می‌روند.
- **Objectهای non-extensible یا frozen داخل arrayها** وقتی Signal Forms برای حفظ identity آیتم‌ها در reorder، tracking symbol assign می‌کند throw می‌کنند.
- **`Map` و `Set`** field tree خالی تولید می‌کنند، چون Signal Forms childها را با `Object.keys` enumerate می‌کند.

اگر application شما برای domain modeling از class استفاده می‌کند، در مرز form آن را به plain object تبدیل کنید. [ترجمه بین form model و domain model](guide/forms/signals/model-design#translating-between-form-model-and-domain-model) را ببینید.

### استفاده از TypeScript typeها

هرچند TypeScript typeها را از object literalها infer می‌کند، تعریف typeهای explicit کیفیت کد را بهتر می‌کند و پشتیبانی IntelliSense بهتری فراهم می‌کند.

```ts
interface LoginData {
  email: string;
  password: string;
}

export class LoginComponent {
  loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel);
}
```

با typeهای explicit، field tree type safety کامل فراهم می‌کند. دسترسی به `loginForm.email` به‌عنوان `FieldTree<string>` type می‌شود و تلاش برای دسترسی به propertyای که وجود ندارد، compile-time error ایجاد می‌کند.

```ts
// TypeScript knows this is FieldTree<string>
const emailField = loginForm.email;

// TypeScript error: Property 'username' does not exist
const usernameField = loginForm.username;
```

### Initialize کردن همه fieldها

Form modelها باید برای همه fieldهایی که می‌خواهید در field tree باشند، initial value فراهم کنند.

```ts {prefer}
// Good: All fields initialized
const userModel = signal({
  name: '',
  email: '',
  age: 0,
});
```

```ts {avoid}
// Avoid: Missing initial value
const userModel = signal({
  name: '',
  email: '',
  // age field is not defined - cannot access userForm.age
});
```

برای fieldهای optional، آن‌ها را به‌صورت explicit روی value خالی یا `null` تنظیم کنید:

```ts
interface UserData {
  name: string;
  email: string;
  phoneNumber: string | null;
}

const userModel = signal<UserData>({
  name: '',
  email: '',
  phoneNumber: null,
});
```

HELPFUL: Controlهای text بومی مثل `<input type=text>` و `<textarea>` از `null` پشتیبانی نمی‌کنند؛ برای نمایش value خالی از `''` استفاده کنید.

Fieldهایی که روی `undefined` تنظیم شده‌اند از field tree حذف می‌شوند. Modelای با `{value: undefined}` درست مثل `{}` رفتار می‌کند؛ دسترسی به field به‌جای `FieldTree` مقدار `undefined` برمی‌گرداند.

## خواندن valueهای model

می‌توانید form valueها را به دو روش بخوانید: مستقیما از model signal، یا از طریق fieldهای جداگانه. هر رویکرد هدف متفاوتی دارد.

### خواندن از model

وقتی به کل form data نیاز دارید، مثلا هنگام form submission، به model signal دسترسی پیدا کنید:

```ts
async onSubmit() {
  const formData = this.loginModel();
  console.log(formData.email, formData.password);

  // Send to server
  await this.authService.login(formData);
}
```

Model signal کل data object را برمی‌گرداند و برای operationهایی که با کل form state کار می‌کنند مناسب است.

### خواندن از field state

هر field در field tree یک function است. Call کردن یک field، objectای از نوع `FieldState` برمی‌گرداند که signalهای reactive مربوط به value، validation status و interaction state همان field را در خود دارد.

وقتی با fieldهای جداگانه در templateها یا reactive computationها کار می‌کنید، به field state دسترسی پیدا کنید:

```angular-ts
@Component({
  template: `
    <p>Current email: {{ loginForm.email().value() }}</p>
    <p>Password length: {{ passwordLength() }}</p>
  `,
})
export class LoginComponent {
  loginModel = signal({email: '', password: ''});
  loginForm = form(this.loginModel);

  passwordLength = computed(() => {
    return this.loginForm.password().value().length;
  });
}
```

Field state برای value هر field، signalهای reactive فراهم می‌کند و برای نمایش اطلاعات مخصوص field یا ساخت derived state مناسب است.

TIP: Field state علاوه بر `value()` signalهای بسیار بیشتری دارد، مثل validation state، مانند valid، invalid و errors؛ interaction tracking، مانند touched و dirty؛ و visibility، مانند hidden و disabled.

<!-- TODO: UNCOMMENT BELOW WHEN GUIDE IS AVAILABLE -->
<!-- See the [Field State Management guide](guide/forms/signals/field-state-management) for complete coverage. -->

## Update کردن programmatic form modelها

### جایگزین کردن form modelها با `set()`

برای جایگزین کردن کل value، از `set()` روی form model استفاده کنید:

```ts
loadUserData() {
  this.userModel.set({
    name: 'Alice',
    email: 'alice@example.com',
    age: 30,
  });
}

resetForm() {
  this.userModel.set({
    name: '',
    email: '',
    age: 0,
  });
}
```

این رویکرد هنگام load کردن data از API یا reset کردن کل form خوب کار می‌کند.

### Update مستقیم یک field با `set()` یا `update()`

برای update مستقیم field state، از `set()` روی valueهای fieldهای جداگانه استفاده کنید:

```ts
clearEmail() {
  this.userForm.email().value.set('');
}

incrementAge() {
  this.userForm.age().value.update(currentAge => currentAge + 1);
}
```

این‌ها با نام "field-level updates" هم شناخته می‌شوند. این updateها به‌صورت خودکار به model signal propagate می‌شوند و هر دو را sync نگه می‌دارند.

### مثال: Load کردن data از API

یک pattern رایج شامل fetch کردن data و پر کردن model است:

```ts
export class UserProfileComponent {
  userModel = signal({
    name: '',
    email: '',
    bio: '',
  });

  userForm = form(this.userModel);
  private userService = inject(UserService);

  ngOnInit() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    const userData = await this.userService.getUserProfile();
    this.userModel.set(userData);
  }
}
```

وقتی model تغییر کند، form fieldها به‌صورت خودکار update می‌شوند و data fetchشده را بدون کد اضافه نمایش می‌دهند.

## Two-way data binding

Directive مربوط به `[formField]` بین model، form state و UI، two-way synchronization خودکار ایجاد می‌کند.

### Data چطور جریان پیدا می‌کند

Changeها دوطرفه جریان پیدا می‌کنند:

**User input → Model:**

1. کاربر داخل input element تایپ می‌کند
2. Directive مربوط به `[formField]` change را تشخیص می‌دهد
3. Field state update می‌شود
4. Model signal update می‌شود

**Programmatic update → UI:**

1. کد با `set()` یا `update()`، model را update می‌کند
2. Model signal، subscriberها را notify می‌کند
3. Field state update می‌شود
4. Directive مربوط به `[formField]`، input element را update می‌کند

این synchronization به‌صورت خودکار رخ می‌دهد. برای sync نگه داشتن model و UI، subscription یا event handler نمی‌نویسید.

### مثال: هر دو جهت

```angular-ts
@Component({
  template: `
    <input type="text" [formField]="userForm.name" />
    <button (click)="setName('Bob')">Set Name to Bob</button>
    <p>Current name: {{ userModel().name }}</p>
  `,
})
export class UserComponent {
  userModel = signal({name: ''});
  userForm = form(this.userModel);

  setName(name: string) {
    this.userForm.name().value.set(name);
    // Input automatically displays 'Bob'
  }
}
```

وقتی کاربر داخل input تایپ کند، `userModel().name` update می‌شود. وقتی button کلیک شود، input value به "Bob" تغییر می‌کند. هیچ کد synchronization دستی لازم نیست.

## Patternهای ساختار model

Form modelها می‌توانند objectهای flat باشند یا objectها و arrayهای nested داشته باشند. ساختاری که انتخاب می‌کنید روی نحوه دسترسی به fieldها و سازمان‌دهی validation اثر می‌گذارد.

### Modelهای flat در برابر nested

Form modelهای flat همه fieldها را در top level نگه می‌دارند:

```ts
// Flat structure
const userModel = signal({
  name: '',
  email: '',
  street: '',
  city: '',
  state: '',
  zip: '',
});
```

Modelهای nested، fieldهای مرتبط را group می‌کنند:

```ts
// Nested structure
const userModel = signal({
  name: '',
  email: '',
  address: {
    street: '',
    city: '',
    state: '',
    zip: '',
  },
});
```

**وقتی از ساختار flat استفاده کنید که:**

- Fieldها grouping مفهومی روشنی ندارند
- Field access ساده‌تر می‌خواهید، مثل `userForm.city` در برابر `userForm.address.city`
- Validation ruleها چند group احتمالی را دربرمی‌گیرند

**وقتی از ساختار nested استفاده کنید که:**

- Fieldها یک group مفهومی روشن می‌سازند، مثل address
- Data groupشده با ساختار API شما match است
- می‌خواهید group را به‌عنوان یک واحد validate کنید

### کار با objectهای nested

می‌توانید با دنبال کردن object path به fieldهای nested دسترسی پیدا کنید:

```ts
const userModel = signal({
  profile: {
    firstName: '',
    lastName: '',
  },
  settings: {
    theme: 'light',
    notifications: true,
  },
});

const userForm = form(userModel);

// Access nested fields
userForm.profile.firstName; // FieldTree<string>
userForm.settings.theme; // FieldTree<string>
```

در templateها، fieldهای nested را همان‌طور bind می‌کنید که fieldهای top-level را bind می‌کنید:

```angular-ts
@Component({
  template: `
    <input [formField]="userForm.profile.firstName" />
    <input [formField]="userForm.profile.lastName" />

    <select [formField]="userForm.settings.theme">
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  `,
})
```

### کار با arrayها

Modelها می‌توانند برای collectionهای itemها شامل array باشند:

```ts
const orderModel = signal({
  customerName: '',
  items: [{product: '', quantity: 0, price: 0}],
});

const orderForm = form(orderModel);

// Access array items by index
orderForm.items[0].product; // FieldTree<string>
orderForm.items[0].quantity; // FieldTree<number>
```

Array itemهایی که object دارند به‌صورت خودکار tracking identity دریافت می‌کنند؛ این کار کمک می‌کند حتی وقتی itemها در array جابه‌جا می‌شوند، field state حفظ شود. این موضوع مطمئن می‌کند validation state و user interactionها هنگام reorder شدن arrayها درست باقی می‌مانند.

<!-- TBD: For dynamic arrays and complex array operations, see the [Working with arrays guide](guide/forms/signals/arrays). -->

## قدم بعدی

این راهنما ساخت modelها و update کردن valueها را پوشش داد. راهنماهای مرتبط جنبه‌های دیگر Signal Forms را بررسی می‌کنند:

<!-- TODO: UNCOMMENT WHEN THE GUIDES ARE AVAILABLE -->
<docs-pill-row>
  <docs-pill href="guide/forms/signals/field-state-management" title="مدیریت field state" />
  <docs-pill href="guide/forms/signals/validation" title="Validation" />
  <docs-pill href="guide/forms/signals/custom-controls" title="Custom controlها" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Working with Arrays" /> -->
</docs-pill-row>
