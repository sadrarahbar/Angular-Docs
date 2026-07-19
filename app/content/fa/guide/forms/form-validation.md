# اعتبارسنجی input فرم

با validate کردن input کاربر از نظر درستی و کامل بودن، می‌توانید کیفیت کلی داده را بهتر کنید. این صفحه نشان می‌دهد چطور input کاربر از UI را validate کنید و پیام‌های validation مفید نمایش دهید؛ هم در reactive forms و هم در template-driven forms.

## اعتبارسنجی input در template-driven forms

برای اضافه کردن validation به یک template-driven form، همان validation attributeهایی را اضافه می‌کنید که در [native HTML form validation](https://developer.mozilla.org/docs/Web/Guide/HTML/HTML5/Constraint_validation) استفاده می‌کنید. Angular از directiveها استفاده می‌کند تا این attributeها را با validator functionهای موجود در framework match کند.

هر بار که مقدار یک form control تغییر کند، Angular validation را اجرا می‌کند و یا فهرستی از validation errorها تولید می‌کند که به status برابر `INVALID` منجر می‌شود، یا `null` که به status برابر `VALID` منجر می‌شود.

بعد می‌توانید state کنترل را با export کردن `ngModel` به یک local template variable بررسی کنید. مثال زیر `NgModel` را داخل متغیری به نام `name` export می‌کند:

<docs-code header="actor-form-template.component.html (name)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" region="name-with-error-msg"/>

به قابلیت‌های زیر که در مثال نشان داده شده‌اند توجه کنید.

- element مربوط به `<input>` attributeهای validation در HTML را دارد: `required` و `minlength`. همچنین یک custom validator directive به نام `forbiddenName` دارد. برای اطلاعات بیشتر، بخش [Custom validators](#defining-custom-validators) را ببینید.

- عبارت `#name="ngModel"`، `NgModel` را داخل یک local variable به نام `name` export می‌کند. `NgModel` بسیاری از propertyهای instance مربوط به `FormControl` زیرین خودش را mirror می‌کند، بنابراین می‌توانید از آن در template برای بررسی stateهای control مثل `valid` و `dirty` استفاده کنید. برای فهرست کامل propertyهای control، مرجع API مربوط به [AbstractControl](api/forms/AbstractControl) را ببینید.
  - بیرونی‌ترین `@if` مجموعه‌ای از پیام‌های تو در تو را آشکار می‌کند، اما فقط وقتی `name` نامعتبر باشد و control یا `dirty` باشد یا `touched`.

  - هر `@if` تو در تو می‌تواند برای یکی از validation errorهای ممکن، پیام سفارشی نمایش دهد. برای `required`، `minlength` و `forbiddenName` پیام وجود دارد.

HELPFUL: برای جلوگیری از نمایش خطاهای validator قبل از اینکه کاربر فرصت ویرایش فرم را داشته باشد، باید در control وضعیت `dirty` یا `touched` را بررسی کنید.

- وقتی کاربر مقدار field تحت نظارت را تغییر می‌دهد، control به‌عنوان "dirty" علامت‌گذاری می‌شود.
- وقتی کاربر form control element را blur می‌کند، control به‌عنوان "touched" علامت‌گذاری می‌شود.

## اعتبارسنجی input در reactive forms

در reactive form، منبع حقیقت کلاس component است. به‌جای اضافه کردن validatorها از طریق attributeها در template، validator functionها را مستقیم به form control model در کلاس component اضافه می‌کنید. سپس Angular هر بار که مقدار control تغییر کند این functionها را صدا می‌زند.

### Validator functionها

Validator functionها می‌توانند synchronous یا asynchronous باشند.

| Validator type   | جزئیات |
| :--------------- | :----- |
| Sync validators  | functionهای synchronous که یک control instance می‌گیرند و بلافاصله یا مجموعه‌ای از validation errorها یا `null` برمی‌گردانند. هنگام instantiate کردن `FormControl`، این‌ها را به‌عنوان argument دوم پاس دهید. |
| Async validators | functionهای asynchronous که یک control instance می‌گیرند و Promise یا Observableای برمی‌گردانند که بعدا مجموعه‌ای از validation errorها یا `null` emit می‌کند. هنگام instantiate کردن `FormControl`، این‌ها را به‌عنوان argument سوم پاس دهید. |

برای performance، Angular فقط وقتی async validatorها را اجرا می‌کند که همه‌ی sync validatorها pass شوند. هر کدام باید کامل شوند تا errorها set شوند.

### Built-in validator functionها

می‌توانید [validator functionهای خودتان را بنویسید](#defining-custom-validators)، یا از بعضی validatorهای داخلی Angular استفاده کنید.

همان built-in validatorهایی که به‌عنوان attribute در template-driven forms در دسترس‌اند، مثل `required` و `minlength`، همگی به‌عنوان function از کلاس `Validators` قابل استفاده‌اند. برای فهرست کامل built-in validatorها، مرجع API مربوط به [Validators](api/forms/Validators) را ببینید.

برای تبدیل actor form به reactive form، از بعضی built-in validatorهای مشابه استفاده کنید؛ این بار به شکل function، مثل مثال زیر.

<docs-code header="actor-form-reactive.component.ts (validator functions)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.1.ts" region="form-group"/>

در این مثال، control مربوط به `name` دو built-in validator، یعنی `Validators.required` و `Validators.minLength(4)`، و یک custom validator به نام `forbiddenNameValidator` را setup می‌کند.

همه‌ی این validatorها synchronous هستند، پس به‌عنوان argument دوم پاس داده می‌شوند. توجه کنید با پاس دادن functionها در قالب array می‌توانید از چند validator پشتیبانی کنید.

این مثال چند getter method هم اضافه می‌کند. در reactive form، همیشه می‌توانید با متد `get` روی group والد به هر form control دسترسی داشته باشید، اما گاهی تعریف getterها به‌عنوان shorthand برای template مفید است.

اگر دوباره به template مربوط به input به نام `name` نگاه کنید، بسیار شبیه مثال template-driven است.

<docs-code header="actor-form-reactive.component.html (name with error msg)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.html" region="name-with-error-msg"/>

تفاوت این فرم با نسخه‌ی template-driven این است که دیگر هیچ directiveای را export نمی‌کند. در عوض از getter مربوط به `name` استفاده می‌کند که در کلاس component تعریف شده است.

توجه کنید attribute مربوط به `required` هنوز در template وجود دارد. اگرچه برای validation لازم نیست، باید برای accessibility حفظ شود.

## تعریف custom validatorها

built-in validatorها همیشه با use case دقیق application شما match نمی‌شوند، بنابراین گاهی لازم است custom validator بسازید.

function مربوط به `forbiddenNameValidator` را از مثال قبلی در نظر بگیرید. تعریف آن function این‌طور است.

<docs-code header="forbidden-name.directive.ts (forbiddenNameValidator)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" region="custom-validator"/>

این function یک factory است که یک regular expression برای تشخیص یک نام ممنوعه‌ی _مشخص_ می‌گیرد و یک validator function برمی‌گرداند.

در این نمونه، نام ممنوعه "bob" است، بنابراین validator هر actor nameای را که شامل "bob" باشد reject می‌کند. در جای دیگر می‌تواند "alice" یا هر نام دیگری را reject کند که regular expression تنظیم‌کننده با آن match شود.

factory مربوط به `forbiddenNameValidator`، validator function پیکربندی‌شده را برمی‌گرداند. آن function یک Angular control object می‌گیرد و _یا_ اگر مقدار control معتبر باشد null برمی‌گرداند، _یا_ یک validation error object. validation error object معمولا propertyای دارد که نام آن validation key است، یعنی `'forbiddenName'`، و مقدار آن یک dictionary دلخواه از مقدارهایی است که می‌توانید در پیام خطا قرار دهید، یعنی `{name}`.

custom async validatorها شبیه sync validatorها هستند، اما باید در عوض Promise یا observableای برگردانند که بعدا null یا یک validation error object emit کند. در حالت observable، observable باید complete شود؛ در آن نقطه فرم آخرین مقدار emitشده را برای validation استفاده می‌کند.

### اضافه کردن custom validatorها به reactive forms

در reactive forms، custom validator را با پاس دادن مستقیم function به `FormControl` اضافه کنید.

<docs-code header="actor-form-reactive.component.ts (validator functions)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.1.ts" region="custom-validator"/>

### اضافه کردن custom validatorها به template-driven forms

در template-driven forms، یک directive به template اضافه کنید که validator function را wrap کند. برای مثال، `ForbiddenValidatorDirective` متناظر به‌عنوان wrapper دور `forbiddenNameValidator` عمل می‌کند.

Angular نقش directive در فرایند validation را تشخیص می‌دهد، چون directive خودش را با provider مربوط به `NG_VALIDATORS` register می‌کند، همان‌طور که در مثال زیر نشان داده شده است. `NG_VALIDATORS` یک provider از پیش تعریف‌شده با مجموعه‌ای قابل گسترش از validatorهاست.

<docs-code header="forbidden-name.directive.ts (providers)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" region="directive-providers"/>

سپس کلاس directive interface مربوط به `Validator` را پیاده‌سازی می‌کند تا بتواند به‌سادگی با Angular forms یکپارچه شود. بقیه‌ی directive در ادامه آمده تا ببینید همه‌ی قسمت‌ها چطور کنار هم قرار می‌گیرند.

<docs-code header="forbidden-name.directive.ts (directive)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" region="directive"/>

وقتی `ForbiddenValidatorDirective` آماده شد، می‌توانید selector آن یعنی `appForbiddenName` را به هر input element اضافه کنید تا فعال شود. برای مثال:

<docs-code header="actor-form-template.component.html (forbidden-name-input)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" region="name-input"/>

HELPFUL: توجه کنید custom validation directive با `useExisting` instantiate شده، نه با `useClass`. validator ثبت‌شده باید _همین instance_ از `ForbiddenValidatorDirective` باشد؛ یعنی instance داخل فرم که property مربوط به `forbiddenName` آن به "bob" bind شده است.

اگر `useExisting` را با `useClass` جایگزین می‌کردید، یک class instance جدید register می‌کردید؛ instanceای که `forbiddenName` ندارد.

## CSS classهای وضعیت control

Angular به‌صورت خودکار بسیاری از propertyهای control را به‌عنوان CSS class روی form control element mirror می‌کند. از این classها برای style دادن به form control elementها بر اساس state فرم استفاده کنید. classهای زیر در حال حاضر پشتیبانی می‌شوند.

- `.ng-valid`
- `.ng-invalid`
- `.ng-pending`
- `.ng-pristine`
- `.ng-dirty`
- `.ng-untouched`
- `.ng-touched`
- `.ng-submitted` \(فقط element فرم دربرگیرنده\)

در مثال زیر، actor form از classهای `.ng-valid` و `.ng-invalid` استفاده می‌کند تا رنگ border هر form control را تنظیم کند.

<docs-code header="forms.css (status classes)" path="adev/src/content/examples/form-validation/src/assets/forms.css"/>

## Cross-field validation

یک cross-field validator یک [custom validator](#defining-custom-validators 'Read about custom validators') است که مقدارهای fieldهای مختلف در یک فرم را مقایسه می‌کند و ترکیب آن‌ها را accept یا reject می‌کند. مثلا ممکن است فرمی داشته باشید که optionهای ناسازگار با هم ارائه می‌دهد؛ طوری که کاربر بتواند A یا B را انتخاب کند، اما نه هر دو را. بعضی مقدارهای field هم ممکن است به مقدارهای دیگر وابسته باشند؛ کاربر شاید فقط وقتی بتواند B را انتخاب کند که A هم انتخاب شده باشد.

مثال‌های cross validation زیر نشان می‌دهند چطور کارهای زیر را انجام دهید:

- validate کردن input فرم reactive یا template-based بر اساس مقدارهای دو sibling control
- نمایش یک پیام خطای توصیفی بعد از اینکه کاربر با فرم تعامل کرد و validation شکست خورد

مثال‌ها از cross-validation استفاده می‌کنند تا با پر کردن Actor Form مطمئن شوند actorها همان نام را در role خود دوباره استفاده نمی‌کنند. validatorها این کار را با بررسی اینکه actor name و role با هم match نشوند انجام می‌دهند.

### اضافه کردن cross-validation به reactive forms

فرم ساختار زیر را دارد:

```ts
const actorForm = new FormGroup({
  'name': new FormControl(),
  'role': new FormControl(),
  'skill': new FormControl(),
});
```

توجه کنید `name` و `role` sibling control هستند. برای ارزیابی هر دو control در یک custom validator واحد، باید validation را در یک ancestor control مشترک انجام دهید: یعنی `FormGroup`. شما `FormGroup` را برای child controlهایش query می‌کنید تا بتوانید مقدارهای آن‌ها را مقایسه کنید.

برای اضافه کردن validator به `FormGroup`، validator جدید را هنگام ساخت به‌عنوان argument دوم پاس دهید.

```ts
const actorForm = new FormGroup(
  {
    'name': new FormControl(),
    'role': new FormControl(),
    'skill': new FormControl(),
  },
  {validators: unambiguousRoleValidator},
);
```

کد validator به شکل زیر است.

<docs-code header="unambiguous-role.directive.ts" path="adev/src/content/examples/form-validation/src/app/shared/unambiguous-role.directive.ts" region="cross-validation-validator"/>

validator مربوط به `unambiguousRoleValidator` interface مربوط به `ValidatorFn` را پیاده‌سازی می‌کند. یک Angular control object را به‌عنوان argument می‌گیرد و اگر فرم معتبر باشد null، و در غیر این صورت `ValidationErrors` برمی‌گرداند.

validator با فراخوانی متد [get](api/forms/AbstractControl#get) روی `FormGroup`، child controlها را دریافت می‌کند و بعد مقدارهای controlهای `name` و `role` را مقایسه می‌کند.

اگر مقدارها match نشوند، role بدون ابهام است، هر دو معتبرند و validator مقدار null برمی‌گرداند. اگر match شوند، role مربوط به actor مبهم است و validator باید با برگرداندن یک error object فرم را invalid علامت‌گذاری کند.

برای فراهم کردن تجربه‌ی کاربری بهتر، template وقتی فرم invalid است پیام خطای مناسب نمایش می‌دهد.

<docs-code header="actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.html" region="cross-validation-error-message"/>

این `@if` خطا را زمانی نمایش می‌دهد که `FormGroup` خطای cross validation برگشتی از validator مربوط به `unambiguousRoleValidator` را داشته باشد، اما فقط وقتی کاربر [با فرم تعامل کرده باشد](#control-status-css-classes).

### اضافه کردن cross-validation به template-driven forms

برای یک template-driven form، باید directiveای بسازید که validator function را wrap کند. آن directive را با استفاده از [`NG_VALIDATORS` token](/api/forms/NG_VALIDATORS) به‌عنوان validator فراهم می‌کنید، همان‌طور که در مثال زیر نشان داده شده است.

<docs-code header="unambiguous-role.directive.ts" path="adev/src/content/examples/form-validation/src/app/shared/unambiguous-role.directive.ts" region="cross-validation-directive"/>

باید directive جدید را به HTML template اضافه کنید. چون validator باید در بالاترین سطح فرم register شود، template زیر directive را روی tag مربوط به `form` قرار می‌دهد.

<docs-code header="actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" region="cross-validation-register-validator"/>

برای فراهم کردن تجربه‌ی کاربری بهتر، وقتی فرم invalid است یک پیام خطای مناسب ظاهر می‌شود.

<docs-code header="actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" region="cross-validation-error-message"/>

این رفتار در template-driven و reactive forms یکسان است.

## ساخت asynchronous validatorها

asynchronous validatorها interfaceهای `AsyncValidatorFn` و `AsyncValidator` را پیاده‌سازی می‌کنند. این‌ها بسیار شبیه همتایان synchronous خود هستند، با تفاوت‌های زیر.

- functionهای `validate()` باید یک Promise یا observable برگردانند.
- observable برگشتی باید finite باشد، یعنی باید در نقطه‌ای complete شود. برای تبدیل یک observable بی‌نهایت به finite، observable را از یک filtering operator مثل `first`، `last`، `take` یا `takeUntil` عبور دهید.

asynchronous validation بعد از synchronous validation اتفاق می‌افتد و فقط وقتی انجام می‌شود که synchronous validation موفق باشد. این check به فرم‌ها اجازه می‌دهد اگر روش‌های validation پایه‌تر از قبل input نامعتبر پیدا کرده‌اند، از فرایندهای async validation احتمالا پرهزینه، مثل HTTP request، اجتناب کنند.

بعد از شروع asynchronous validation، form control وارد state مربوط به `pending` می‌شود. property مربوط به `pending` را روی control بررسی کنید و از آن برای دادن بازخورد بصری درباره‌ی عملیات validation در حال انجام استفاده کنید.

یک الگوی رایج UI این است که هنگام انجام async validation یک spinner نشان دهید. مثال زیر نشان می‌دهد چطور این کار را در template-driven form انجام دهید.

```angular-html
<input [(ngModel)]="name" #model="ngModel" appSomeAsyncValidator />

@if (model.pending) {
  <app-spinner />
}
```

### پیاده‌سازی یک custom async validator

در مثال زیر، یک async validator مطمئن می‌شود actorها برای roleای انتخاب شوند که از قبل گرفته نشده است. actorهای جدید دائما audition می‌دهند و actorهای قدیمی بازنشسته می‌شوند، بنابراین فهرست roleهای در دسترس را نمی‌توان از قبل دریافت کرد. برای validate کردن role احتمالی، validator باید یک عملیات asynchronous شروع کند تا از یک database مرکزی شامل همه‌ی actorهای castشده‌ی فعلی سوال کند.

کد زیر کلاس validator یعنی `UniqueRoleValidator` را می‌سازد که interface مربوط به `AsyncValidator` را پیاده‌سازی می‌کند.

<docs-code header="role.directive.ts" path="adev/src/content/examples/form-validation/src/app/shared/role.directive.ts" region="async-validator"/>

property مربوط به `actorsService` با یک instance از token مربوط به `ActorsService` initialize می‌شود که interface زیر را تعریف می‌کند.

```ts
interface ActorsService {
  isRoleTaken: (role: string) => Observable<boolean>;
}
```

در یک application واقعی، `ActorsService` مسئول انجام HTTP request به actor database است تا بررسی کند role در دسترس است یا نه. از دید validator، پیاده‌سازی واقعی service مهم نیست، بنابراین مثال فقط در برابر interface مربوط به `ActorsService` کدنویسی می‌کند.

با شروع validation، `UniqueRoleValidator` متد `isRoleTaken()` از `ActorsService` را با مقدار فعلی control صدا می‌زند. در این نقطه control به‌عنوان `pending` علامت‌گذاری می‌شود و تا وقتی observable chain برگشتی از متد `validate()` کامل شود در همین state می‌ماند.

متد `isRoleTaken()` یک HTTP request dispatch می‌کند که بررسی می‌کند role در دسترس است یا نه، و نتیجه را به‌صورت `Observable<boolean>` برمی‌گرداند. متد `validate()` پاسخ را از operator مربوط به `map` عبور می‌دهد و آن را به validation result تبدیل می‌کند.

سپس این متد، مثل هر validator دیگر، اگر فرم معتبر باشد `null` برمی‌گرداند و اگر معتبر نباشد `ValidationErrors`. این validator هر error احتمالی را با operator مربوط به `catchError` مدیریت می‌کند. در این حالت، validator خطای `isRoleTaken()` را validation موفق در نظر می‌گیرد، چون شکست در انجام validation request لزوما به این معنی نیست که role نامعتبر است. می‌توانید error را به شکل دیگری مدیریت کنید و به‌جای آن object مربوط به `ValidationError` را برگردانید.

بعد از گذشت مدتی، observable chain کامل می‌شود و asynchronous validation تمام می‌شود. flag مربوط به `pending` برابر `false` می‌شود و اعتبار فرم به‌روزرسانی می‌شود.

### اضافه کردن async validatorها به reactive forms

برای استفاده از async validator در reactive forms، با inject کردن validator داخل یک property از کلاس component شروع کنید.

<docs-code header="actor-form-reactive.component.2.ts" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.2.ts" region="async-validator-inject"/>

سپس validator function را مستقیم به `FormControl` پاس دهید تا اعمال شود.

در مثال زیر، function مربوط به `validate` از `UniqueRoleValidator` با پاس داده شدن به option مربوط به `asyncValidators` روی `roleControl` اعمال می‌شود و به instance مربوط به `UniqueRoleValidator` bind می‌شود که داخل `ActorFormReactiveComponent` inject شده است. مقدار `asyncValidators` می‌تواند یک async validator function واحد یا arrayای از functionها باشد. برای یادگیری بیشتر درباره‌ی optionهای `FormControl`، مرجع API مربوط به [AbstractControlOptions](api/forms/AbstractControlOptions) را ببینید.

<docs-code header="actor-form-reactive.component.2.ts" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.2.ts" region="async-validator-usage"/>

### اضافه کردن async validatorها به template-driven forms

برای استفاده از async validator در template-driven forms، یک directive جدید بسازید و provider مربوط به `NG_ASYNC_VALIDATORS` را روی آن register کنید.

در مثال زیر، directive کلاس `UniqueRoleValidator` را inject می‌کند که منطق واقعی validation را در خود دارد و آن را در function مربوط به `validate` فراخوانی می‌کند؛ functionای که Angular هنگام نیاز به validation trigger می‌کند.

<docs-code header="role.directive.ts" path="adev/src/content/examples/form-validation/src/app/shared/role.directive.ts" region="async-validator-directive"/>

سپس، مثل validatorهای synchronous، selector مربوط به directive را به یک input اضافه کنید تا فعال شود.

<docs-code header="actor-form-template.component.html (unique-unambiguous-role-input)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" region="role-input"/>

### بهینه‌سازی performance مربوط به async validatorها

به‌صورت پیش‌فرض، همه‌ی validatorها بعد از هر تغییر form value اجرا می‌شوند. در مورد synchronous validatorها، این معمولا اثر قابل توجهی روی performance برنامه ندارد. اما async validatorها معمولا نوعی HTTP request برای validate کردن control انجام می‌دهند. dispatch کردن HTTP request بعد از هر keystroke می‌تواند به backend API فشار بیاورد و اگر ممکن است باید از آن اجتناب شود.

می‌توانید با تغییر property مربوط به `updateOn` از `change`، که پیش‌فرض است، به `submit` یا `blur`، به‌روزرسانی اعتبار فرم را به تاخیر بیندازید.

در template-driven forms، property را در template تنظیم کنید.

```angular-html
<input [(ngModel)]="name" [ngModelOptions]="{updateOn: 'blur'}" />
```

در reactive forms، property را در instance مربوط به `FormControl` تنظیم کنید.

```ts
new FormControl('', {updateOn: 'blur'});
```
