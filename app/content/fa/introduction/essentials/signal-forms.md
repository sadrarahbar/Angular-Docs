<docs-decorative-header title="فرم‌ها با Signalها" imgSrc="adev/src/assets/images/signals.svg"> </docs-decorative-header>

Signal Forms با استفاده از Angular signals، state فرم را مدیریت می‌کند تا بین data model شما و UI با Angular Signals همگام‌سازی خودکار ایجاد شود.

این راهنما شما را با مفاهیم اصلی ساخت فرم با Signal Forms آشنا می‌کند. روش کار این‌گونه است:

## ساخت اولین فرم

### 1. ساخت form model با `signal()`

هر فرم با ساخت یک signal شروع می‌شود که data model فرم شما را نگه می‌دارد:

```ts
interface LoginData {
  email: string;
  password: string;
}

const loginModel = signal<LoginData>({
  email: '',
  password: '',
});
```

### 2. پاس دادن form model به `form()` برای ساخت `FieldTree`

سپس form model خود را به تابع `form()` پاس می‌دهید تا یک **field tree** ساخته شود؛ ساختاری object-based که شکل model شما را بازتاب می‌دهد و اجازه می‌دهد با dot notation به fieldها دسترسی داشته باشید.

هم object ریشه فرم و هم propertyهای nested آن، nodeهایی از نوع `FieldTree` هستند:

```ts
const loginForm = form(loginModel);

loginForm; // is a FieldTree
loginForm.email; // is also a FieldTree
```

### 3. bind کردن inputهای HTML با directive مربوط به `[formField]`

در مرحله بعد، inputهای HTML خود را با استفاده از directive مربوط به `[formField]` به فرم bind می‌کنید؛ این directive بین آن‌ها two-way binding ایجاد می‌کند:

```html
<input type="email" [formField]="loginForm.email" />
<input type="password" [formField]="loginForm.password" />
```

در نتیجه، تغییرات کاربر، مثل تایپ کردن در field، فرم را به صورت خودکار به‌روز می‌کند.

NOTE: directive مربوط به `[formField]` در صورت مناسب بودن، state مربوط به field را برای attributeهایی مثل `required`، `disabled` و `readonly` هم sync می‌کند.

### 4. خواندن state با signalهای `FieldTree`

می‌توانید با فراخوانی node مربوط به `FieldTree` به شکل تابع، به state هر بخش از tree دسترسی داشته باشید. این کار objectای از state برمی‌گرداند که شامل signalهای reactive برای مقدار، وضعیت validation و وضعیت interaction است:

```ts
loginForm(); // Returns state for the whole form
loginForm.email(); // Returns state for the email field
```

برای خواندن مقدار فعلی، به signal مربوط به `value()` دسترسی بگیرید:

```html
<!-- Render values that update automatically as user types -->
<p>Form value: {{ loginForm().value() | json }}</p>
<p>Email: {{ loginForm.email().value() }}</p>
```

```ts
// Get the current value
const currentEmail = loginForm.email().value();
```

### 5. به‌روزرسانی مقدارها با `set()`

می‌توانید با method مربوط به `value.set()` روی هر node، مقدارها را به صورت برنامه‌نویسی‌شده به‌روز کنید. این کار هم `FieldTree` و هم signal مربوط به model اصلی را به‌روز می‌کند:

```ts
// Update the value programmatically
loginForm.email().value.set('alice@wonderland.com');
```

در نتیجه، هم مقدار field و هم signal مربوط به model به صورت خودکار به‌روز می‌شوند:

```ts
// The model signal is also updated
console.log(loginModel().email); // 'alice@wonderland.com'
```

### نمونه کامل

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-simple/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.css"/>
</docs-code-multifile>

## استفاده پایه

directive مربوط به `[formField]` با همه typeهای استاندارد input در HTML کار می‌کند. رایج‌ترین patternها این‌ها هستند:

### inputهای متنی

inputهای متنی با attributeهای مختلف `type` و textareaها کار می‌کنند:

```html
<!-- Text and email -->
<input type="text" [formField]="form.name" />
<input type="email" [formField]="form.email" />
```

#### عددها

inputهای عددی به صورت خودکار بین string و number تبدیل انجام می‌دهند:

```html
<!-- Number - automatically converts to number type -->
<input type="number" [formField]="form.age" />
```

#### تاریخ و زمان

inputهای تاریخ، مقدارها را به صورت string با قالب `YYYY-MM-DD` نگه می‌دارند و inputهای زمان از قالب `HH:mm` استفاده می‌کنند:

```html
<!-- Date and time - stores as ISO format strings -->
<input type="date" [formField]="form.eventDate" />
<input type="time" [formField]="form.eventTime" />
```

اگر لازم است stringهای تاریخ را به objectهای Date تبدیل کنید، می‌توانید مقدار field را به `Date()` پاس بدهید:

```ts
const dateObject = new Date(form.eventDate().value());
```

#### متن چندخطی

textareaها همانند inputهای متنی کار می‌کنند:

```html
<!-- Textarea -->
<textarea [formField]="form.message" rows="4"></textarea>
```

### checkboxها

checkboxها به مقدارهای boolean bind می‌شوند:

```html
<!-- Single checkbox -->
<label>
  <input type="checkbox" [formField]="form.agreeToTerms" />
  I agree to the terms
</label>
```

#### چند checkbox

برای چند گزینه، برای هر کدام یک `formField` جداگانه با مقدار boolean بسازید:

```html
<label>
  <input type="checkbox" [formField]="form.emailNotifications" />
  Email notifications
</label>
<label>
  <input type="checkbox" [formField]="form.smsNotifications" />
  SMS notifications
</label>
```

### radio buttonها

radio buttonها مشابه checkboxها کار می‌کنند. تا زمانی که radio buttonها از همان مقدار `[formField]` استفاده کنند، Signal Forms به صورت خودکار attribute یکسان `name` را به همه آن‌ها bind می‌کند:

```html
<label>
  <input type="radio" value="free" [formField]="form.plan" />
  Free
</label>
<label>
  <input type="radio" value="premium" [formField]="form.plan" />
  Premium
</label>
```

وقتی کاربر یک radio button را انتخاب می‌کند، `formField` فرم مقدار attribute مربوط به `value` همان radio button را ذخیره می‌کند. برای مثال، انتخاب "Premium" مقدار `form.plan().value()` را روی `"premium"` قرار می‌دهد.

### select dropdownها

elementهای select هم با optionهای static و هم dynamic کار می‌کنند:

```angular-html
<!-- Static options -->
<select [formField]="form.country">
  <option value="">Select a country</option>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
</select>

<!-- Dynamic options with @for -->
<select [formField]="form.productId">
  <option value="">Select a product</option>
  @for (product of products; track product.id) {
    <option [value]="product.id">{{ product.name }}</option>
  }
</select>
```

NOTE: در حال حاضر multiple select یعنی `<select multiple>` توسط directive مربوط به `[formField]` پشتیبانی نمی‌شود.

## validation و state

Signal Forms validatorهای built-in ارائه می‌دهد که می‌توانید روی fieldهای فرم خود اعمال کنید. برای اضافه کردن validation، یک تابع schema را به عنوان argument دوم به `form()` پاس بدهید:

```ts
const loginForm = form(loginModel, (schemaPath) => {
  debounce(schemaPath.email, 500);
  required(schemaPath.email);
  email(schemaPath.email);
});
```

تابع schema یک پارامتر **schema path** دریافت می‌کند که pathهای fieldهای شما را برای پیکربندی ruleهای validation فراهم می‌کند.

validatorهای رایج شامل این موارد هستند:

- **`required()`** - مطمئن می‌شود field مقدار دارد
- **`email()`** - قالب email را validate می‌کند
- **`min()`** / **`max()`** - بازه عددی را validate می‌کند
- **`minLength()`** / **`maxLength()`** - طول string یا collection را validate می‌کند
- **`pattern()`** - مقدار را در برابر یک regex pattern validate می‌کند

همچنین می‌توانید با پاس دادن یک options object به عنوان argument دوم validator، پیام‌های error را customize کنید:

```ts
required(schemaPath.email, {message: 'Email is required'});
email(schemaPath.email, {message: 'Please enter a valid email address'});
```

هر node در `FieldTree`، state مربوط به validation و interaction خود را از طریق signalهای reactive در اختیار می‌گذارد.

### Signalهای state در FieldTree

هر node در tree، از جمله object ریشه فرم، signalهای یکسانی برای track کردن state خود ارائه می‌دهد. چون هر node یک `FieldTree` است، API مربوط به مانیتور کردن validity و interaction در همه سطح‌ها یکسان است.

| State        | Description                                                                     |
| ------------ | ------------------------------------------------------------------------------- |
| `valid()`    | اگر node همه ruleهای validation را پاس کند `true` برمی‌گرداند                   |
| `invalid()`  | اگر errorهای validation وجود داشته باشد `true` برمی‌گرداند                      |
| `pending()`  | اگر async validation در حال اجرا باشد `true` برمی‌گرداند                        |
| `touched()`  | اگر کاربر روی field یا هر child field فوکوس کرده و سپس blur کرده باشد `true` برمی‌گرداند |
| `dirty()`    | اگر مقدار توسط کاربر تغییر کرده باشد `true` برمی‌گرداند                         |
| `disabled()` | اگر node غیرفعال باشد `true` برمی‌گرداند                                        |
| `readonly()` | اگر node readonly باشد `true` برمی‌گرداند                                       |
| `errors()`   | آرایه‌ای از errorهای validation با propertyهای `kind` و `message` برمی‌گرداند   |

### نمونه کامل

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.css"/>
</docs-code-multifile>

## قدم‌های بعدی

برای یادگیری بیشتر درباره Signal Forms و نحوه کار آن، راهنماهای عمیق‌تر را ببینید:

- [نمای کلی](guide/forms/signals/overview) - معرفی Signal Forms و زمان استفاده از آن‌ها
- [Form modelها](guide/forms/signals/models) - ساخت و مدیریت داده‌های فرم با signalها
- [مدیریت state فیلد](guide/forms/signals/field-state-management) - کار با state مربوط به validation، track کردن interaction و visibility فیلد
- [Validation](guide/forms/signals/validation) - validatorهای built-in، ruleهای validation سفارشی و async validation

<docs-pill-row>
  <docs-pill title="طراحی ماژولار با Dependency Injection" href="essentials/dependency-injection" />
</docs-pill-row>

