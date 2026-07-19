# Typed Forms

از Angular 14 به بعد، reactive forms به‌صورت پیش‌فرض strictly typed هستند.

برای پیش‌زمینه‌ی این راهنما، بهتر است از قبل با [Angular Reactive Forms](guide/forms/reactive-forms) آشنا باشید.

## نمای کلی Typed Forms

<docs-video src="https://www.youtube.com/embed/L-odCf4MfJc" alt="Typed Forms in Angular" />

در reactive forms مربوط به Angular، شما یک _form model_ را به‌صورت صریح مشخص می‌کنید. به‌عنوان یک مثال ساده، این فرم پایه‌ی login کاربر را در نظر بگیرید:

```ts
const login = new FormGroup({
  email: new FormControl(''),
  password: new FormControl(''),
});
```

Angular APIهای زیادی برای تعامل با این `FormGroup` فراهم می‌کند. برای مثال، می‌توانید `login.value`، `login.controls`، `login.patchValue` و موارد مشابه را صدا بزنید. برای مرجع کامل API، [مستندات API](api/forms/FormGroup) را ببینید.

در نسخه‌های قبلی Angular، بیشتر این APIها جایی در typeهای خود `any` داشتند و تعامل با ساختار controlها یا خود مقدارها type-safe نبود. مثلا می‌توانستید کد نامعتبر زیر را بنویسید:

```ts
const emailDomain = login.value.email.domain;
```

با reactive forms از نوع strictly typed، کد بالا compile نمی‌شود، چون روی `email` هیچ propertyای به نام `domain` وجود ندارد.

علاوه بر ایمنی بیشتر، typeها بهبودهای دیگری هم ممکن می‌کنند؛ مثل autocomplete بهتر در IDEها و روشی صریح برای مشخص کردن ساختار فرم.

این بهبودها فعلا فقط برای فرم‌های _reactive_ اعمال می‌شوند، نه فرم‌های [_template-driven_](guide/forms/template-driven-forms).

## فرم‌های Untyped

فرم‌های بدون type همچنان پشتیبانی می‌شوند و مثل قبل کار خواهند کرد. برای استفاده از آن‌ها باید symbolهای `Untyped` را از `@angular/forms` import کنید:

```ts
const login = new UntypedFormGroup({
  email: new UntypedFormControl(''),
  password: new UntypedFormControl(''),
});
```

هر symbol از نوع `Untyped` دقیقا همان semantics نسخه‌های قبلی Angular را دارد. با حذف prefixهای `Untyped` می‌توانید typeها را به‌صورت تدریجی فعال کنید.

## `FormControl`: شروع کار

ساده‌ترین فرم ممکن از یک control واحد تشکیل می‌شود:

```ts
const email = new FormControl('angularrox@gmail.com');
```

type این control به‌صورت خودکار `FormControl<string|null>` infer می‌شود. TypeScript این type را در سراسر API مربوط به [`FormControl`](api/forms/FormControl)، مثل `email.value`، `email.valueChanges` و `email.setValue(...)`، enforce می‌کند.

### Nullability

شاید بپرسید چرا type این control شامل `null` است؟ دلیلش این است که control هر زمانی می‌تواند با فراخوانی reset به `null` تبدیل شود:

```ts
const email = new FormControl('angularrox@gmail.com');
email.reset();
console.log(email.value); // null
```

TypeScript شما را مجبور می‌کند همیشه احتمال `null` شدن control را مدیریت کنید. اگر می‌خواهید این control non-nullable باشد، می‌توانید از option مربوط به `nonNullable` استفاده کنید. این کار باعث می‌شود control هنگام reset شدن به مقدار اولیه‌ی خودش برگردد، نه به `null`:

```ts
const email = new FormControl('angularrox@gmail.com', {nonNullable: true});
email.reset();
console.log(email.value); // angularrox@gmail.com
```

تاکید دوباره: این option رفتار runtime فرم شما را هنگام فراخوانی `.reset()` تغییر می‌دهد و باید با دقت فعال شود.

### مشخص کردن type صریح

می‌توانید به‌جای تکیه بر inference، type را صریح مشخص کنید. controlی را در نظر بگیرید که با `null` initialize می‌شود. چون مقدار اولیه `null` است، TypeScript مقدار `FormControl<null>` را infer می‌کند که از چیزی که می‌خواهیم محدودتر است.

```ts
const email = new FormControl(null);
email.setValue('angularrox@gmail.com'); // Error!
```

برای جلوگیری از این مشکل، type را به‌صورت صریح `string|null` مشخص می‌کنیم:

```ts
const email = new FormControl<string | null>(null);
email.setValue('angularrox@gmail.com');
```

## `FormArray`: مجموعه‌های dynamic و همگن

یک `FormArray` شامل فهرستی open-ended از controlهاست. type parameter آن با type هر control داخلی متناظر است:

```ts
const names = new FormArray([new FormControl('Alex')]);
names.push(new FormControl('Jess'));
```

وقتی لازم دارید چند entry را یک‌جا اضافه کنید، آرایه‌ای از controlها را به `aliases.push()` پاس دهید.

```ts
const aliases = new FormArray([new FormControl('ng')]);
aliases.push([new FormControl('ngDev'), new FormControl('ngAwesome')]);
```

این `FormArray`، controlهای داخلی از نوع `FormControl<string|null>` خواهد داشت.

اگر می‌خواهید چند نوع element متفاوت داخل array داشته باشید، باید از `UntypedFormArray` استفاده کنید، چون TypeScript نمی‌تواند infer کند کدام element type در کدام position قرار می‌گیرد.

یک `FormArray` متد `clear()` هم فراهم می‌کند تا همه‌ی controlهایی را که شامل می‌شود حذف کنید:

```ts
const aliases = new FormArray([new FormControl('ngDev'), new FormControl('ngAwesome')]);
aliases.clear();
console.log(aliases.length); // 0
```

## `FormGroup` و `FormRecord`

Angular type مربوط به `FormGroup` را برای فرم‌هایی با مجموعه‌ای مشخص از keyها فراهم می‌کند، و type دیگری به نام `FormRecord` را برای گروه‌های open-ended یا dynamic.

### مقدارهای Partial

دوباره یک فرم login را در نظر بگیرید:

```ts
const login = new FormGroup({
  email: new FormControl('', {nonNullable: true}),
  password: new FormControl('', {nonNullable: true}),
});
```

در هر `FormGroup`، [غیرفعال کردن controlها](api/forms/FormGroup) ممکن است. هر control غیرفعال‌شده در value گروه ظاهر نمی‌شود.

در نتیجه، type مربوط به `login.value` برابر `Partial<{email: string, password: string}>` است. `Partial` در این type یعنی هر member ممکن است undefined باشد.

دقیق‌تر، type مربوط به `login.value.email` برابر `string|undefined` است و TypeScript شما را مجبور می‌کند مقدار احتمالا `undefined` را مدیریت کنید، البته اگر `strictNullChecks` فعال باشد.

اگر می‌خواهید به value شامل controlهای disabled هم دسترسی داشته باشید و در نتیجه fieldهای احتمالا `undefined` را دور بزنید، می‌توانید از `login.getRawValue()` استفاده کنید.

### Controlهای اختیاری و گروه‌های dynamic

بعضی فرم‌ها controlهایی دارند که ممکن است وجود داشته باشند یا نداشته باشند، و می‌توانند در runtime اضافه یا حذف شوند. می‌توانید این controlها را با _optional fields_ نمایش دهید:

```ts
interface LoginForm {
  email: FormControl<string>;
  password?: FormControl<string>;
}

const login = new FormGroup<LoginForm>({
  email: new FormControl('', {nonNullable: true}),
  password: new FormControl('', {nonNullable: true}),
});

login.removeControl('password');
```

در این فرم، type را به‌صورت صریح مشخص می‌کنیم؛ این کار اجازه می‌دهد control مربوط به `password` را optional کنیم. TypeScript enforce می‌کند که فقط controlهای optional بتوانند اضافه یا حذف شوند.

### `FormRecord`

بعضی کاربردهای `FormGroup` با الگوی بالا جور نیستند، چون keyها از قبل معلوم نیستند. کلاس `FormRecord` برای همین حالت طراحی شده است:

```ts
const addresses = new FormRecord<FormControl<string | null>>({});
addresses.addControl('Andrew', new FormControl('2340 Folsom St'));
```

هر controlی از نوع `string|null` می‌تواند به این `FormRecord` اضافه شود.

اگر به `FormGroup`ای نیاز دارید که هم dynamic یعنی open-ended باشد و هم heterogeneous یعنی controlهای آن typeهای متفاوت داشته باشند، type safety بهبودیافته‌ای ممکن نیست و باید از `UntypedFormGroup` استفاده کنید.

یک `FormRecord` را می‌توان با `FormBuilder` هم ساخت:

```ts
const addresses = fb.record({'Andrew': '2340 Folsom St'});
```

## `FormBuilder` و `NonNullableFormBuilder`

کلاس `FormBuilder` هم به همان شکل مثال‌های بالا برای پشتیبانی از typeهای جدید ارتقا یافته است.

علاوه بر آن، builder دیگری هم در دسترس است: `NonNullableFormBuilder`. این type میان‌بری برای مشخص کردن `{nonNullable: true}` روی هر control است و می‌تواند boilerplate فرم‌های non-nullable بزرگ را به‌طور قابل توجهی کم کند. می‌توانید با property مربوط به `nonNullable` روی یک `FormBuilder` به آن دسترسی پیدا کنید:

```ts
const fb = new FormBuilder();
const login = fb.nonNullable.group({
  email: '',
  password: '',
});
```

در مثال بالا، هر دو control داخلی non-nullable خواهند بود، یعنی `nonNullable` برایشان set می‌شود.

همچنین می‌توانید آن را با نام `NonNullableFormBuilder` inject کنید.
