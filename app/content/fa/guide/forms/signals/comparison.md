# مقایسه با رویکردهای دیگر form

Angular سه رویکرد برای ساخت formها فراهم می‌کند: Signal Forms، Reactive Forms و Template-driven Forms. هرکدام برای مدیریت state، validation و data flow patternهای متفاوتی دارند. این راهنما کمک می‌کند تفاوت‌ها را بفهمید و رویکرد درست را برای project خود انتخاب کنید.

## مقایسه سریع

| Feature          | Signal Forms                       | Reactive Forms                        | Template-driven Forms   |
| ---------------- | ---------------------------------- | ------------------------------------- | ----------------------- |
| Source of truth  | Writable signal model تعریف‌شده توسط کاربر | `FormControl`/`FormGroup`             | User model در component |
| Type safety      | از model infer می‌شود              | با typed forms به‌صورت explicit       | حداقلی                  |
| Validation       | Schema با validatorهای path-based  | Listای از validatorها که به Controlها پاس داده می‌شود | مبتنی بر directive      |
| State management | مبتنی بر Signal                    | مبتنی بر Observable                   | مدیریت‌شده توسط Angular |
| Setup            | Signal + schema function           | FormControl tree                      | NgModel در template     |
| Best for         | Appهای مبتنی بر signal             | Formهای پیچیده                        | Formهای ساده            |
| Learning curve   | متوسط                              | متوسط تا زیاد                         | کم                      |
| Status           | Stable (v22+)                      | Stable                                | Stable                  |

## با مثال: Login form

بهترین راه برای فهم تفاوت‌ها این است که یک form یکسان را در هر سه رویکرد ببینید.

<docs-code-multifile>
  <docs-code language="angular-ts" header="Signal forms" path="adev/src/content/examples/signal-forms/src/comparison/app/signal-forms.ts"/>
  <docs-code header="Reactive forms" path="adev/src/content/examples/signal-forms/src/comparison/app/reactive-forms.ts"/>
  <docs-code header="Template-driven forms" path="adev/src/content/examples/signal-forms/src/comparison/app/template-driven-forms.ts"/>
</docs-code-multifile>

## درک تفاوت‌ها

این سه رویکرد design choiceهای متفاوتی دارند که روی نحوه نوشتن و نگهداری formها اثر می‌گذارد. این تفاوت‌ها از جایی می‌آیند که هر رویکرد form state را ذخیره می‌کند و validation را مدیریت می‌کند.

### Form data شما کجا زندگی می‌کند

بنیادی‌ترین تفاوت این است که هر رویکرد کجا را "source of truth" برای form valueها می‌داند.

Signal Forms، data را در یک writable signal ذخیره می‌کند. وقتی به valueهای فعلی form نیاز دارید، signal را call می‌کنید:

```ts
const credentials = this.loginModel(); // { email: '...', password: '...' }
```

این کار form data شما را در یک container reactive واحد نگه می‌دارد که هنگام تغییر valueها، Angular را به‌صورت خودکار notify می‌کند. ساختار form دقیقا data model شما را mirror می‌کند.

Reactive Forms، data را داخل instanceهای FormControl و FormGroup ذخیره می‌کند. از طریق form hierarchy به valueها دسترسی دارید:

```ts
const credentials = this.loginForm.value; // { email: '...', password: '...' }
```

این رویکرد form state management را از data model مربوط به component شما جدا می‌کند. ساختار form explicit است اما setup code بیشتری لازم دارد.

Template-driven Forms، data را در propertyهای component ذخیره می‌کند. مستقیما به valueها دسترسی دارید:

```ts
const credentials = {email: this.email, password: this.password};
```

این مستقیم‌ترین رویکرد است، اما وقتی به valueها نیاز دارید باید آن‌ها را دستی assemble کنید. Angular، form state را از طریق directiveهای داخل template مدیریت می‌کند.

### Validation چطور کار می‌کند

هر رویکرد validation ruleها را متفاوت تعریف می‌کند، و این روی محل قرار گرفتن validation logic و نحوه نگهداری آن اثر می‌گذارد.

Signal Forms از schema function استفاده می‌کند؛ جایی که validatorها را به field pathها bind می‌کنید:

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  required(fieldPath.email, {message: 'Email is required'});
  email(fieldPath.email, {message: 'Enter a valid email address'});
});
```

همه validation ruleها کنار هم در یک محل قرار می‌گیرند. Schema function هنگام ساخت form یک بار اجرا می‌شود و validatorها هنگام تغییر field valueها به‌صورت خودکار اجرا می‌شوند. Error messageها بخشی از validation definition هستند.

Reactive Forms هنگام ساخت controlها، validatorها را attach می‌کند:

```ts
loginForm = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
});
```

Validatorها به controlهای جداگانه در form structure گره خورده‌اند. این کار validation را در form definition شما پخش می‌کند. Error messageها معمولا در template قرار می‌گیرند.

Template-driven Forms از directive attributeها در template استفاده می‌کند:

```html
<input [(ngModel)]="email" required email />
```

Validation ruleها کنار HTML داخل template زندگی می‌کنند. این کار validation را نزدیک UI نگه می‌دارد، اما logic را بین template و component پخش می‌کند.

### Type safety و autocomplete

Integration با TypeScript بین رویکردها تفاوت زیادی دارد و روی اینکه compiler چقدر برای جلوگیری از errorها به شما کمک کند اثر می‌گذارد.

Signal Forms typeها را از ساختار model شما infer می‌کند:

```ts
const loginModel = signal({email: '', password: ''});
const loginForm = form(loginModel);
// TypeScript knows: loginForm.email exists and returns FieldState<string>
```

شکل data را یک بار در signal تعریف می‌کنید و TypeScript به‌صورت خودکار می‌داند چه fieldهایی وجود دارند و type آن‌ها چیست. دسترسی به `loginForm.username`، که وجود ندارد، type error ایجاد می‌کند.

Reactive Forms با typed forms به annotationهای explicit type نیاز دارد:

```ts
const loginForm = new FormGroup({
  email: new FormControl<string>(''),
  password: new FormControl<string>(''),
});
// TypeScript knows: loginForm.controls.email is FormControl<string>
```

برای هر control جداگانه type مشخص می‌کنید. TypeScript ساختار form شما را validate می‌کند، اما type information را جدا از data model نگه می‌دارید.

Template-driven Forms حداقل type safety را ارائه می‌کند:

```ts
email = '';
password = '';
// TypeScript only knows these are strings, no form-level typing
```

TypeScript propertyهای component شما را می‌فهمد اما از form structure یا validation آگاهی ندارد. در نتیجه compile-time checking برای form operationها را از دست می‌دهید.

## رویکردتان را انتخاب کنید

### از Signal Forms استفاده کنید اگر:

- در حال ساخت applicationهای جدید مبتنی بر signal هستید (Angular v22+)
- می‌خواهید type safety از ساختار model شما infer شود
- Validation مبتنی بر schema برایتان جذاب است
- Team شما با signalها آشناست

### از Reactive Forms استفاده کنید اگر:

- به stability آماده production نیاز دارید
- Formهای پیچیده و dynamic می‌سازید
- Patternهای مبتنی بر observable را ترجیح می‌دهید
- به کنترل دقیق روی form state نیاز دارید
- روی codebase موجودی کار می‌کنید که از reactive forms استفاده می‌کند

### از Template-driven Forms استفاده کنید اگر:

- Formهای ساده می‌سازید، مثل login، contact یا search
- در حال rapid prototyping هستید
- Form logic شما straightforward است
- ترجیح می‌دهید form logic را در template نگه دارید
- روی codebase موجودی کار می‌کنید که template-driven است

## قدم بعدی

برای یادگیری بیشتر درباره هر رویکرد:

- **Signal Forms**: برای شروع [Overview guide](guide/forms/signals/overview) را ببینید، یا وارد [Form Models](guide/forms/signals/models)، [Validation](guide/forms/signals/validation) و [Field State Management](guide/forms/signals/field-state-management) شوید
- **Reactive Forms**: [راهنمای Reactive Forms](guide/forms/reactive-forms) را در documentation Angular ببینید
- **Template-driven Forms**: [راهنمای Template-driven Forms](guide/forms/template-driven-forms) را در documentation Angular ببینید
