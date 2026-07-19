# Reactive forms

Reactive forms رویکردی model-driven برای مدیریت inputهای فرم فراهم می‌کنند؛ inputهایی که مقدارشان در طول زمان تغییر می‌کند. این راهنما نشان می‌دهد چطور یک form control پایه بسازید و به‌روزرسانی کنید، چند control را در یک group استفاده کنید، مقدارهای فرم را validate کنید و فرم‌های dynamic بسازید که بتوانید در runtime control اضافه یا حذف کنید.

## نمای کلی reactive forms

Reactive forms برای مدیریت state فرم در یک نقطه‌ی مشخص از زمان، از رویکردی صریح و immutable استفاده می‌کنند. هر تغییر در form state یک state جدید برمی‌گرداند و این کار integrity مدل را بین تغییرات حفظ می‌کند. Reactive forms حول observable streamها ساخته شده‌اند؛ جایی که inputها و مقدارهای فرم به شکل streamهایی فراهم می‌شوند که می‌توان به‌صورت synchronous به آن‌ها دسترسی داشت.

Reactive forms مسیر ساده‌ای برای testing هم فراهم می‌کنند، چون مطمئن هستید داده‌ی شما هنگام درخواست، سازگار و قابل پیش‌بینی است. هر مصرف‌کننده‌ی این streamها می‌تواند داده را با خیال راحت manipulate کند.

Reactive forms از [template-driven forms](guide/forms/template-driven-forms) به شکل‌های مشخصی متفاوت‌اند. Reactive forms دسترسی synchronous به data model، immutability با observable operatorها و change tracking از طریق observable streamها فراهم می‌کنند.

Template-driven forms اجازه می‌دهند داده را مستقیم در template تغییر دهید، اما از reactive forms کمتر explicit هستند، چون به directiveهای embedded در template و داده‌ی mutable برای دنبال کردن تغییرات به‌صورت asynchronous تکیه می‌کنند. برای مقایسه‌ی دقیق این دو paradigm، [Forms Overview](guide/forms) را ببینید.

## اضافه کردن یک form control پایه

برای استفاده از form controlها سه مرحله وجود دارد.

1. یک component جدید generate کنید و reactive forms module را register کنید. این module directiveهای reactive-form لازم برای استفاده از reactive forms را declare می‌کند.
1. یک `FormControl` جدید instantiate کنید.
1. `FormControl` را در template register کنید.

سپس می‌توانید با اضافه کردن component به template، فرم را نمایش دهید.

مثال‌های زیر نشان می‌دهند چطور یک form control واحد اضافه کنید. در مثال، کاربر نام خود را در یک input field وارد می‌کند، مقدار input capture می‌شود و مقدار فعلی form control element نمایش داده می‌شود.

<docs-workflow>

<docs-step title="Generate a new component and import the ReactiveFormsModule">
از command مربوط به CLI یعنی `ng generate component` برای generate کردن component در پروژه استفاده کنید، `ReactiveFormsModule` را از package مربوط به `@angular/forms` import کنید و آن را به آرایه‌ی `imports` در Component اضافه کنید.

<docs-code header="name-editor.component.ts (excerpt)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" region="imports" />
</docs-step>

<docs-step title="Declare a FormControl instance">
از constructor مربوط به `FormControl` برای تنظیم مقدار اولیه استفاده کنید؛ در این مورد یک string خالی. با ساخت این controlها در کلاس component، بلافاصله به گوش دادن، به‌روزرسانی و validate کردن state مربوط به input فرم دسترسی دارید.

<docs-code header="name-editor.component.ts" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" region="create-control"/>
</docs-step>

<docs-step title="Register the control in the template">
بعد از ساخت control در کلاس component، باید آن را با یک form control element در template مرتبط کنید. template را با form control به‌روزرسانی کنید؛ با binding مربوط به `formControl` که توسط `FormControlDirective` فراهم می‌شود و آن هم در `ReactiveFormsModule` قرار دارد.

<docs-code header="name-editor.component.html" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" region="control-binding" />

با استفاده از syntax مربوط به template binding، form control حالا روی input element به نام `name` در template register شده است. form control و DOM element با هم ارتباط دارند: view تغییرات model را منعکس می‌کند و model تغییرات view را.
</docs-step>

<docs-step title="Display the component">
وقتی component مربوط به `<app-name-editor>` به یک template اضافه شود، `FormControl`ای که به property مربوط به `name` اختصاص داده شده نمایش داده می‌شود.

<docs-code header="app.component.html (name editor)" path="adev/src/content/examples/reactive-forms/src/app/app.component.1.html" region="app-name-editor"/>
</docs-step>
</docs-workflow>

### نمایش مقدار form control

می‌توانید مقدار را به روش‌های زیر نمایش دهید:

- از طریق observable مربوط به `valueChanges`، که با آن می‌توانید در template با `AsyncPipe` یا در کلاس component با متد `subscribe()` به تغییرات value فرم گوش دهید.
- با property مربوط به `value`، که یک snapshot از مقدار فعلی به شما می‌دهد.

مثال زیر نشان می‌دهد چطور مقدار فعلی را با interpolation در template نمایش دهید.

<docs-code header="name-editor.component.html (control value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" region="display-value"/>

مقدار نمایش‌داده‌شده با به‌روزرسانی form control element تغییر می‌کند.

Reactive forms از طریق propertyها و methodهایی که هر instance فراهم می‌کند، به اطلاعات مربوط به یک control مشخص دسترسی می‌دهد. این propertyها و methodهای کلاس زیرین [AbstractControl](api/forms/AbstractControl 'API reference') برای کنترل form state و تعیین زمان نمایش پیام‌ها هنگام مدیریت [input validation](#validating-form-input 'Learn more about validating form input') استفاده می‌شوند.

درباره‌ی propertyها و methodهای دیگر `FormControl` در [API Reference](api/forms/FormControl 'Detailed syntax reference') بخوانید.

### جایگزین کردن مقدار form control

Reactive forms methodهایی برای تغییر programmatic مقدار control دارند؛ این به شما انعطاف می‌دهد بدون تعامل کاربر مقدار را به‌روزرسانی کنید. یک form control instance متد `setValue()` را فراهم می‌کند که مقدار form control را به‌روزرسانی می‌کند و ساختار مقدار ارائه‌شده را در برابر ساختار control validate می‌کند. مثلا وقتی داده‌ی فرم را از backend API یا service می‌گیرید، از `setValue()` استفاده کنید تا control را به مقدار جدیدش به‌روزرسانی و مقدار قبلی را کامل جایگزین کنید.

مثال زیر متدی به کلاس component اضافه می‌کند تا مقدار control را با متد `setValue()` به _Nancy_ تغییر دهد.

<docs-code header="name-editor.component.ts (update value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" region="update-value"/>

template را با یک button به‌روزرسانی کنید تا update کردن name را شبیه‌سازی کند. وقتی روی دکمه‌ی **Update Name** کلیک می‌کنید، مقدار واردشده در form control element به‌عنوان مقدار فعلی آن منعکس می‌شود.

<docs-code header="name-editor.component.html (update value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" region="update-value"/>

form model منبع حقیقت control است؛ بنابراین وقتی روی button کلیک می‌کنید، مقدار input داخل کلاس component تغییر می‌کند و مقدار فعلی آن را override می‌کند.

HELPFUL: در این مثال، از یک control واحد استفاده می‌کنید. هنگام استفاده از متد `setValue()` با instanceهای [form group](#grouping-form-controls) یا [form array](#creating-dynamic-forms)، مقدار باید با ساختار group یا array match شود.

## گروه‌بندی form controlها

فرم‌ها معمولا چند control مرتبط دارند. Reactive forms دو راه برای گروه‌بندی چند control مرتبط در یک input form واحد فراهم می‌کنند.

| Form groups | جزئیات |
| :---------- | :----- |
| Form group  | فرمی با مجموعه‌ای ثابت از controlها تعریف می‌کند که می‌توانید آن‌ها را با هم مدیریت کنید. مبانی form group در همین بخش بررسی می‌شود. همچنین می‌توانید برای ساخت فرم‌های پیچیده‌تر [form groupها را nest کنید](#creating-nested-form-groups 'See more about nesting groups'). |
| Form array  | یک فرم dynamic تعریف می‌کند که می‌توانید در runtime control اضافه یا حذف کنید. برای ساخت فرم‌های پیچیده‌تر می‌توانید form arrayها را هم nest کنید. برای اطلاعات بیشتر درباره‌ی این گزینه، [Creating dynamic forms](#creating-dynamic-forms) را ببینید. |

همان‌طور که یک form control instance به شما کنترل یک input field واحد را می‌دهد، یک form group instance هم form state مجموعه‌ای از form control instanceها، مثلا یک فرم، را دنبال می‌کند. هر control در یک form group instance هنگام ساخت form group با name دنبال می‌شود. مثال زیر نشان می‌دهد چطور چند form control instance را در یک group واحد مدیریت کنید.

یک component به نام `ProfileEditor` generate کنید و کلاس‌های `FormGroup` و `FormControl` را از package مربوط به `@angular/forms` import کنید.

```shell
ng generate component ProfileEditor
```

<docs-code header="profile-editor.component.ts (imports)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="imports"/>

برای اضافه کردن form group به این component، مرحله‌های زیر را انجام دهید.

1. یک instance از `FormGroup` بسازید.
1. model و view مربوط به `FormGroup` را مرتبط کنید.
1. داده‌ی فرم را ذخیره کنید.

<docs-workflow>

<docs-step title="Create a FormGroup instance">
در کلاس component یک property به نام `profileForm` بسازید و آن را روی یک form group instance جدید قرار دهید. برای initialize کردن form group، به constructor یک object از keyهای نام‌دار بدهید که به controlهایشان map شده‌اند.

برای profile form، دو form control instance با نام‌های `firstName` و `lastName` اضافه کنید.

<docs-code header="profile-editor.component.ts (form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="formgroup"/>

form controlهای جداگانه حالا داخل یک group جمع شده‌اند. یک instance از `FormGroup` مقدار model خودش را به‌صورت objectای فراهم می‌کند که از مقدارهای هر control در group reduce شده است. یک form group instance همان propertyها، مثل `value` و `untouched`، و همان methodها، مثل `setValue()`، را دارد که یک form control instance دارد.
</docs-step>

<docs-step title="Associate the FormGroup model and view">
یک form group وضعیت و تغییرات هر control خودش را دنبال می‌کند؛ بنابراین اگر یکی از controlها تغییر کند، parent control هم status یا value change جدیدی emit می‌کند. model مربوط به group از memberهای آن نگه‌داری می‌شود. بعد از تعریف model، باید template را به‌روزرسانی کنید تا model را در view منعکس کند.

<docs-code header="profile-editor.component.html (template form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="formgroup"/>

همان‌طور که یک form group شامل گروهی از controlهاست، `FormGroup` مربوط به _profileForm_ با directive مربوط به `FormGroup` به element مربوط به `form` bind می‌شود و یک لایه‌ی ارتباطی بین model و formی که inputها را دارد ایجاد می‌کند. input مربوط به `formControlName` که توسط directive مربوط به `FormControlName` فراهم می‌شود، هر input جداگانه را به form control تعریف‌شده در `FormGroup` bind می‌کند. form controlها با elementهای متناظر خود ارتباط دارند. همچنین تغییرات را به form group instance منتقل می‌کنند، که منبع حقیقت برای مقدار model را فراهم می‌کند.
</docs-step>

<docs-step title="Save form data">
component مربوط به `ProfileEditor` input را از کاربر می‌پذیرد، اما در یک سناریوی واقعی می‌خواهید مقدار فرم را capture کنید و آن را برای پردازش بیشتر بیرون از component در دسترس بگذارید. directive مربوط به `FormGroup` به event مربوط به `submit` که توسط element فرم emit می‌شود گوش می‌دهد و eventای به نام `ngSubmit` emit می‌کند که می‌توانید به یک callback function bind کنید. یک event listener از نوع `ngSubmit` با callback method مربوط به `onSubmit()` به tag فرم اضافه کنید.

<docs-code header="profile-editor.component.html (submit event)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" region="ng-submit"/>

متد `onSubmit()` در component مربوط به `ProfileEditor` مقدار فعلی `profileForm` را capture می‌کند. از `output()` استفاده کنید تا فرم encapsulated بماند و مقدار فرم بیرون از component فراهم شود. مثال زیر از `console.warn` برای log کردن پیام در browser console استفاده می‌کند.

<docs-code header="profile-editor.component.ts (submit method)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="on-submit"/>

event مربوط به `submit` توسط tag فرم با استفاده از built-in DOM event emit می‌شود. شما با کلیک روی buttonای با type برابر `submit` این event را trigger می‌کنید. این امکان را می‌دهد که کاربر با فشردن کلید **Enter** فرم کامل‌شده را submit کند.

از یک element از نوع `button` استفاده کنید تا buttonی به پایین فرم اضافه شود و form submission را trigger کند.

<docs-code header="profile-editor.component.html (submit button)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" region="submit-button"/>

button در snippet قبلی همچنین یک binding مربوط به `disabled` دارد تا وقتی `profileForm` نامعتبر است button را disabled کند. هنوز هیچ validationای انجام نمی‌دهید، بنابراین button همیشه enabled است. form validation پایه در بخش [Validating form input](#validating-form-input) پوشش داده می‌شود.
</docs-step>

<docs-step title="Display the component">
برای نمایش component مربوط به `ProfileEditor` که فرم را در خود دارد، آن را به template یک component اضافه کنید.

<docs-code header="app.component.html (profile editor)" path="adev/src/content/examples/reactive-forms/src/app/app.component.1.html" region="app-profile-editor"/>

`ProfileEditor` به شما اجازه می‌دهد form control instanceهای مربوط به controlهای `firstName` و `lastName` را داخل form group instance مدیریت کنید.

### ساخت form groupهای تو در تو

Form groupها می‌توانند هم form control instanceهای جداگانه و هم form group instanceهای دیگر را به‌عنوان child بپذیرند. این کار compose کردن form modelهای پیچیده را ساده‌تر و نگهداری آن‌ها را منطقی‌تر می‌کند.

هنگام ساخت فرم‌های پیچیده، مدیریت areaهای مختلف اطلاعات در بخش‌های کوچک‌تر ساده‌تر است. استفاده از یک nested form group instance اجازه می‌دهد form groupهای بزرگ را به بخش‌های کوچک‌تر و قابل مدیریت‌تر بشکنید.

برای ساخت فرم‌های پیچیده‌تر، مرحله‌های زیر را انجام دهید.

1. یک nested group بسازید.
1. nested form را در template group کنید.

بعضی نوع‌های اطلاعات به‌طور طبیعی در یک group قرار می‌گیرند. name و address نمونه‌های معمول چنین nested groupهایی هستند و در مثال‌های زیر استفاده می‌شوند.

<docs-workflow>
<docs-step title="Create a nested group">
برای ساخت یک nested group در `profileForm`، یک element تو در تو به نام `address` به form group instance اضافه کنید.

<docs-code header="profile-editor.component.ts (nested form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="nested-formgroup"/>

در این مثال، `address group` کنترل‌های فعلی `firstName` و `lastName` را با کنترل‌های جدید `street`، `city`، `state` و `zip` ترکیب می‌کند. با اینکه element مربوط به `address` در form group فرزند element کلی `profileForm` در form group است، همان ruleها درباره‌ی تغییرات value و status اعمال می‌شوند. تغییرات status و value از nested form group به parent form group propagate می‌شوند و consistency با model کلی را حفظ می‌کنند.
</docs-step>

<docs-step title="Group the nested form in the template">
بعد از به‌روزرسانی model در کلاس component، template را به‌روزرسانی کنید تا form group instance و input elementهای آن را وصل کند. form group مربوط به `address` را که شامل fieldهای `street`، `city`، `state` و `zip` است به template مربوط به `ProfileEditor` اضافه کنید.

<docs-code header="profile-editor.component.html (template nested form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="formgroupname"/>

فرم `ProfileEditor` به‌صورت یک group نمایش داده می‌شود، اما model برای نمایش areaهای grouping منطقی، بیشتر شکسته می‌شود.

مقدار form group instance را در component template با استفاده از property مربوط به `value` و `JsonPipe` نمایش دهید.
</docs-step>
</docs-workflow>

### به‌روزرسانی بخش‌هایی از data model

هنگام به‌روزرسانی مقدار یک form group instance که چند control دارد، ممکن است بخواهید فقط بخش‌هایی از model را به‌روزرسانی کنید. این بخش پوشش می‌دهد چطور بخش‌های مشخصی از form control data model را به‌روزرسانی کنید.

دو راه برای به‌روزرسانی model value وجود دارد:

| Methods        | جزئیات |
| :------------- | :----- |
| `setValue()`   | مقدار جدیدی برای یک control جداگانه set می‌کند. متد `setValue()` به‌صورت strict به ساختار form group پایبند است و کل مقدار control را جایگزین می‌کند. |
| `patchValue()` | هر property تعریف‌شده در object را که در form model تغییر کرده است جایگزین می‌کند. |

checkهای strict متد `setValue()` کمک می‌کنند خطاهای nesting را در فرم‌های پیچیده پیدا کنید، در حالی که `patchValue()` در برابر آن خطاها بی‌صدا fail می‌شود.

در `ProfileEditorComponent`، از متد `updateProfile` همراه با مثال زیر استفاده کنید تا first name و street address کاربر را به‌روزرسانی کنید.

<docs-code header="profile-editor.component.ts (patch value)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="patch-value"/>

با اضافه کردن button به template، یک update را شبیه‌سازی کنید تا user profile در صورت نیاز به‌روزرسانی شود.

<docs-code header="profile-editor.component.html (update value)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="patch-value"/>

وقتی کاربر روی button کلیک می‌کند، model مربوط به `profileForm` با مقدارهای جدید برای `firstName` و `street` به‌روزرسانی می‌شود. توجه کنید `street` داخل objectی در property مربوط به `address` ارائه شده است. این لازم است چون متد `patchValue()` update را در برابر ساختار model اعمال می‌کند. `patchValue()` فقط propertyهایی را به‌روزرسانی می‌کند که form model تعریف کرده است.

## استفاده از service مربوط به FormBuilder برای generate کردن controlها

ساخت دستی form control instanceها هنگام کار با چند فرم می‌تواند تکراری شود. service مربوط به `FormBuilder` methodهای راحتی برای generate کردن controlها فراهم می‌کند.

برای استفاده از این service، مرحله‌های زیر را انجام دهید.

1. کلاس `FormBuilder` را import کنید.
1. service مربوط به `FormBuilder` را inject کنید.
1. محتوای فرم را generate کنید.

مثال‌های زیر نشان می‌دهند چطور component مربوط به `ProfileEditor` را refactor کنید تا از form builder service برای ساخت form control و form group instanceها استفاده کند.

<docs-workflow>
<docs-step title="Import the FormBuilder class">
کلاس `FormBuilder` را از package مربوط به `@angular/forms` import کنید.

<docs-code header="profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-builder-imports"/>

</docs-step>

<docs-step title="Inject the FormBuilder service">
service مربوط به `FormBuilder` یک injectable provider از reactive forms module است. از function مربوط به `inject()` استفاده کنید تا این dependency را در component خود inject کنید.

<docs-code header="profile-editor.component.ts (property init)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="inject-form-builder"/>

</docs-step>
<docs-step title="Generate form controls">
service مربوط به `FormBuilder` سه method دارد: `control()`، `group()` و `array()`. این‌ها factory methodهایی برای generate کردن instanceها در کلاس‌های component شما هستند، از جمله form control، form group و form array. از method مربوط به `group` برای ساخت controlهای `profileForm` استفاده کنید.

<docs-code header="profile-editor.component.ts (form builder)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-builder"/>

در مثال قبلی، از method مربوط به `group()` با همان object استفاده می‌کنید تا propertyهای model را تعریف کنید. مقدار هر control name آرایه‌ای است که مقدار اولیه را به‌عنوان item اول در array دارد.

TIP: می‌توانید control را فقط با مقدار اولیه تعریف کنید، اما اگر controlهای شما به sync یا async validation نیاز دارند، sync و async validatorها را به‌عنوان item دوم و سوم array اضافه کنید. استفاده از form builder را با ساخت دستی instanceها مقایسه کنید.

  <docs-code-multifile>
    <docs-code header="profile-editor.component.ts (instances)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="formgroup-compare"/>
    <docs-code header="profile-editor.component.ts (form builder)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="formgroup-compare"/>
  </docs-code-multifile>
</docs-step>

</docs-workflow>

## اعتبارسنجی input فرم

_Form validation_ برای اطمینان از کامل و درست بودن input کاربر استفاده می‌شود. این بخش اضافه کردن یک validator واحد به form control و نمایش وضعیت کلی فرم را پوشش می‌دهد. form validation با جزئیات بیشتر در راهنمای [Form Validation](guide/forms/form-validation) پوشش داده شده است.

برای اضافه کردن form validation، مرحله‌های زیر را انجام دهید.

1. یک validator function را در form component خود import کنید.
1. validator را به field در فرم اضافه کنید.
1. logic لازم برای مدیریت validation status را اضافه کنید.

رایج‌ترین validation اجباری کردن یک field است. مثال زیر نشان می‌دهد چطور required validation را به control مربوط به `firstName` اضافه کنید و نتیجه‌ی validation را نمایش دهید.

<docs-workflow>
<docs-step title="Import a validator function">
Reactive forms مجموعه‌ای از validator functionها برای use caseهای رایج دارد. این functionها controlی را برای validate کردن دریافت می‌کنند و بر اساس check مربوط به validation، یک error object یا مقدار null برمی‌گردانند.

کلاس `Validators` را از package مربوط به `@angular/forms` import کنید.

<docs-code header="profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="validator-imports"/>
</docs-step>

<docs-step title="Make a field required">
در component مربوط به `ProfileEditor`، static method مربوط به `Validators.required` را به‌عنوان item دوم در array مربوط به control `firstName` اضافه کنید.

<docs-code header="profile-editor.component.ts (required validator)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="required-validator"/>
</docs-step>

<docs-step title="Display form status">
وقتی یک required field به form control اضافه می‌کنید، status اولیه‌ی آن invalid است. این invalid status به parent form group element propagate می‌شود و status آن را invalid می‌کند. به status فعلی form group instance از طریق property مربوط به `status` دسترسی پیدا کنید.

status فعلی `profileForm` را با interpolation نمایش دهید.

<docs-code header="profile-editor.component.html (display status)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" region="display-status"/>

دکمه‌ی **Submit** disabled است چون `profileForm` به دلیل form control اجباری `firstName` نامعتبر است. بعد از پر کردن input مربوط به `firstName`، فرم معتبر می‌شود و دکمه‌ی **Submit** enabled می‌شود.

برای اطلاعات بیشتر درباره‌ی form validation، راهنمای [Form Validation](guide/forms/form-validation) را ببینید.
</docs-step>
</docs-workflow>

## ساخت فرم‌های dynamic

`FormArray` جایگزینی برای `FormGroup` است تا هر تعداد control بدون نام را مدیریت کنید. همانند form group instanceها، می‌توانید controlها را به‌صورت dynamic داخل form array instanceها insert و remove کنید، و مقدار form array instance و validation status آن از child controlهایش محاسبه می‌شود. اما لازم نیست برای هر control یک key با name تعریف کنید؛ پس اگر تعداد child valueها را از قبل نمی‌دانید، این گزینه بسیار مناسب است.

برای تعریف dynamic form، مرحله‌های زیر را انجام دهید.

1. کلاس `FormArray` را import کنید.
1. یک control از نوع `FormArray` تعریف کنید.
1. با getter method به control مربوط به `FormArray` دسترسی پیدا کنید.
1. form array را در template نمایش دهید.

مثال زیر نشان می‌دهد چطور arrayای از _aliases_ را در `ProfileEditor` مدیریت کنید.

<docs-workflow>
<docs-step title="Import the `FormArray` class">
کلاس `FormArray` را از `@angular/forms` import کنید تا برای type information استفاده شود. service مربوط به `FormBuilder` آماده است تا یک instance از `FormArray` بسازد.

<docs-code header="profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-array-imports"/>
</docs-step>

<docs-step title="Define a `FormArray` control">
می‌توانید form array را با هر تعداد control، از صفر تا تعداد زیاد، با تعریف آن‌ها در یک array initialize کنید. برای تعریف form array، یک property به نام `aliases` به form group instance مربوط به `profileForm` اضافه کنید.

از متد `FormBuilder.array()` برای تعریف array و از متد `FormBuilder.control()` برای پر کردن array با یک control اولیه استفاده کنید.

<docs-code header="profile-editor.component.ts (aliases form array)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="aliases"/>

control مربوط به aliases در form group instance حالا با یک control واحد پر شده است تا زمانی که controlهای بیشتری به‌صورت dynamic اضافه شوند.
</docs-step>

<docs-step title="Access the `FormArray` control">
یک getter در مقایسه با تکرار متد `profileForm.get()` برای گرفتن هر instance، دسترسی به aliases در form array instance را فراهم می‌کند. form array instance تعداد نامشخصی از controlها را در یک array نمایش می‌دهد. دسترسی به control از طریق getter راحت است و این رویکرد برای controlهای بیشتر هم مستقیم قابل تکرار است. <br />

از getter syntax استفاده کنید تا class propertyای به نام `aliases` بسازید و form array control مربوط به alias را از parent form group دریافت کنید.

<docs-code header="profile-editor.component.ts (aliases getter)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="aliases-getter"/>

چون control برگشتی از type مربوط به `AbstractControl` است، باید type صریحی ارائه کنید تا به method syntax مربوط به form array instance دسترسی داشته باشید. متدی تعریف کنید که یک alias control را به‌صورت dynamic داخل form array مربوط به alias insert کند. متد `FormArray.push()`، control را به‌عنوان item جدید در array insert می‌کند، و می‌توانید arrayای از controlها را هم به FormArray.push() پاس دهید تا چند control را یک‌جا register کنید.

<docs-code header="profile-editor.component.ts (add alias)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="add-alias"/>

در template، هر control به‌عنوان input field جداگانه نمایش داده می‌شود.

</docs-step>

<docs-step title="Display the form array in the template">

برای وصل کردن aliases از form model خود، باید آن را به template اضافه کنید. شبیه input مربوط به `formGroupName` که توسط `FormGroupNameDirective` فراهم می‌شود، `formArrayName` ارتباط را از form array instance به template با `FormArrayNameDirective` bind می‌کند.

HTML template زیر را بعد از `<div>`ای که element مربوط به `formGroupName` را می‌بندد اضافه کنید.

<docs-code header="profile-editor.component.html (aliases form array template)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" region="formarrayname"/>

block مربوط به `@for` روی هر form control instance فراهم‌شده توسط aliases form array instance iterate می‌کند. چون elementهای form array نام ندارند، index را به متغیر `i` assign می‌کنید و آن را به هر control پاس می‌دهید تا به input مربوط به `formControlName` bind شود.

هر بار که یک alias instance جدید اضافه می‌شود، form array instance جدید، control خودش را بر اساس index دریافت می‌کند. این به شما اجازه می‌دهد هنگام محاسبه‌ی status و value مربوط به root control، هر control جداگانه را دنبال کنید.

NOTE: در applicationهای zoneless، mutate کردن یک reactive forms model، مثلا فراخوانی `FormArray.push()`، به‌صورت خودکار component change detection را schedule نمی‌کند. اگر template شما به تغییرات ساختاری model مثل `aliases.controls` وابسته است، مطمئن شوید component به Angular اطلاع می‌دهد change detection را اجرا کند؛ مثلا با bridge کردن یک forms observable به `ChangeDetectorRef.markForCheck()`:

```ts
import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  /* ... */
})
export class ProfileEditor {
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    this.profileForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.cdr.markForCheck());
  }
}
```

</docs-step>

### استفاده از `FormArrayDirective` برای form arrayهای سطح‌بالا

می‌توانید با استفاده از `FormArrayDirective`، یک `FormArray` را مستقیم به element از نوع `<form>` bind کنید. این حالت زمانی مفید است که فرم از `FormGroup` سطح‌بالا استفاده نمی‌کند و خود array کل form model را نمایش می‌دهد.

```angular-ts
import {Component} from '@angular/core';
import {FormArray, FormControl} from '@angular/forms';

@Component({
  selector: 'form-array-example',
  template: `
    <form [formArray]="form">
      @for (control of form.controls; track $index) {
        <input [formControlName]="$index" />
      }
    </form>
  `,
})
export class FormArrayExampleComponent {
  controls = [new FormControl('fish'), new FormControl('cat'), new FormControl('dog')];

  form = new FormArray(this.controls);
}
```

<docs-step title="Add an alias">

در ابتدا، فرم یک field به نام `Alias` دارد. برای اضافه کردن field دیگر، روی دکمه‌ی **Add Alias** کلیک کنید. همچنین می‌توانید array مربوط به aliasها را که form model گزارش داده و پایین template با `Form Value` نمایش داده شده validate کنید. به‌جای یک form control instance برای هر alias، می‌توانید یک form group instance دیگر با fieldهای اضافه compose کنید. فرایند تعریف control برای هر item یکسان است.
</docs-step>

</docs-workflow>

## رویدادهای یکپارچه‌ی تغییر state کنترل

همه‌ی form controlها یک stream واحد و یکپارچه از **control state change events** را از طریق observable مربوط به `events` روی `AbstractControl` expose می‌کنند؛ شامل `FormControl`، `FormGroup`، `FormArray` و `FormRecord`. این stream یکپارچه به شما اجازه می‌دهد به تغییرات state مربوط به **value**، **status**، **pristine**، **touched** و **reset**، و همچنین actionهای سطح فرم مثل **submit** واکنش نشان دهید؛ یعنی همه‌ی updateها را با یک subscription مدیریت کنید، به‌جای اینکه چند observable را جداگانه wire کنید.

### نوع eventها

هر item که توسط `events` emit می‌شود instanceای از یک event class مشخص است:

- **`ValueChangeEvent`** — وقتی **value** کنترل تغییر می‌کند.
- **`StatusChangeEvent`** — وقتی **validation status** کنترل به یکی از مقدارهای `FormControlStatus`، یعنی `VALID`، `INVALID`، `PENDING` یا `DISABLED`، به‌روزرسانی می‌شود.
- **`PristineChangeEvent`** — وقتی state مربوط به **pristine/dirty** کنترل تغییر می‌کند.
- **`TouchedChangeEvent`** — وقتی state مربوط به **touched/untouched** کنترل تغییر می‌کند.
- **`FormResetEvent`** — وقتی یک control یا form reset می‌شود، چه از طریق API مربوط به `reset()` و چه از طریق action بومی.
- **`FormSubmittedEvent`** — وقتی فرم submit می‌شود.

همه‌ی event classها از `ControlEvent` extend می‌کنند و شامل یک reference به نام `source` به `AbstractControl`ای هستند که تغییر از آن شروع شده؛ این در فرم‌های بزرگ مفید است.

```ts
import {Component} from '@angular/core';
import {
  FormControl,
  ValueChangeEvent,
  StatusChangeEvent,
  PristineChangeEvent,
  TouchedChangeEvent,
  FormResetEvent,
  FormSubmittedEvent,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';

@Component(/* ... */)
export class UnifiedEventsBasicComponent {
  form = new FormGroup({
    username: new FormControl(''),
  });

  constructor() {
    this.form.events.subscribe((e) => {
      if (e instanceof ValueChangeEvent) {
        console.log('Value changed to: ', e.value);
      }

      if (e instanceof StatusChangeEvent) {
        console.log('Status changed to: ', e.status);
      }

      if (e instanceof PristineChangeEvent) {
        console.log('Pristine status changed to: ', e.pristine);
      }

      if (e instanceof TouchedChangeEvent) {
        console.log('Touched status changed to: ', e.touched);
      }

      if (e instanceof FormResetEvent) {
        console.log('Form was reset');
      }

      if (e instanceof FormSubmittedEvent) {
        console.log('Form was submitted');
      }
    });
  }
}
```

### فیلتر کردن eventهای مشخص

وقتی فقط به زیرمجموعه‌ای از event typeها نیاز دارید، RxJS operatorها را ترجیح دهید.

```ts
import {filter} from 'rxjs/operators';
import {StatusChangeEvent} from '@angular/forms';

control.events
  .pipe(filter((e) => e instanceof StatusChangeEvent))
  .subscribe((e) => console.log('Status:', e.status));
```

### یکپارچه‌سازی چند subscription

**Before**

```ts
import {combineLatest} from 'rxjs/operators';

combineLatest([control.valueChanges, control.statusChanges]).subscribe(([value, status]) => {
  /* ... */
});
```

**After**

```ts
control.events.subscribe((e) => {
  // Handle ValueChangeEvent, StatusChangeEvent, etc.
});
```

NOTE: هنگام value change، emit درست بعد از update شدن value همین control رخ می‌دهد. مقدار parent control، مثلا اگر این FormControl بخشی از یک FormGroup باشد، بعدا update می‌شود؛ بنابراین دسترسی به مقدار parent control با property مربوط به `value` از callback این event ممکن است مقداری را برگرداند که هنوز update نشده است. به‌جای آن، به `events` مربوط به parent control subscribe کنید.

## مدیریت form control state

Reactive forms، control state را از طریق **touched/untouched** و **pristine/dirty** دنبال می‌کنند. Angular این‌ها را هنگام تعامل‌های DOM به‌صورت خودکار به‌روزرسانی می‌کند، اما شما هم می‌توانید آن‌ها را به‌صورت programmatic مدیریت کنید.

**[`markAsTouched`](api/forms/FormControl#markAsTouched)** — یک control یا form را از طریق focus و blur eventهایی که مقدار را تغییر نمی‌دهند به‌عنوان touched علامت‌گذاری می‌کند. به‌صورت پیش‌فرض به parent controlها propagate می‌شود.

```ts
// Show validation errors after user leaves a field
onEmailBlur() {
  const email = this.form.get('email');
  email.markAsTouched();
}
```

**[`markAsUntouched`](api/forms/FormControl#markAsUntouched)** — یک control یا form را به‌عنوان untouched علامت‌گذاری می‌کند. به همه‌ی child controlها cascade می‌شود و touched status همه‌ی parent controlها را دوباره محاسبه می‌کند.

```ts
// Reset form state after successful submission
onSubmitSuccess() {
  this.form.markAsUntouched();
  this.form.markAsPristine();
}
```

**[`markAsDirty`](api/forms/FormControl#markAsDirty)** — یک control یا form را به‌عنوان dirty علامت‌گذاری می‌کند، یعنی مقدار تغییر کرده است. به‌صورت پیش‌فرض به parent controlها propagate می‌شود.

```ts
// Mark programmatically changed values as modified
autofillAddress() {
  const previousAddress = getAddress();
  this.form.patchValue(previousAddress, { emitEvent: false });
  this.form.markAsDirty();
}
```

**[`markAsPristine`](api/forms/FormControl#markAsPristine)** — یک control یا form را به‌عنوان pristine علامت‌گذاری می‌کند. همه‌ی child controlها را pristine می‌کند و pristine status همه‌ی parent controlها را دوباره محاسبه می‌کند.

```ts
// Reset pristine state after saving to track new changes
saveForm() {
  this.api.save(this.form.value).subscribe(() => {
    this.form.markAsPristine();
  });
}
```

**[`markAllAsDirty`](api/forms/FormControl#markAllAsDirty)** — control یا form و همه‌ی descendant controlهای آن را به‌عنوان dirty علامت‌گذاری می‌کند.

```ts
// Mark imported data as dirty
loadData(data: FormData) {
  this.form.patchValue(data);
  this.form.markAllAsDirty();
}
```

**[`markAllAsTouched`](api/forms/FormControl#markAllAsTouched)** — control یا form و همه‌ی descendant controlهای آن را به‌عنوان touched علامت‌گذاری می‌کند. برای نمایش validation errorها در سراسر فرم مفید است.

```ts
// Show all validation errors before submission
onSubmit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  this.saveForm();
}
```

## کنترل event emission و propagation

وقتی form controlها را به‌صورت programmatic به‌روزرسانی می‌کنید، کنترل دقیقی روی این دارید که تغییرات چطور در hierarchy فرم propagate شوند و آیا eventها emit شوند یا نه.

### شناخت event emission

به‌صورت پیش‌فرض `emitEvent: true` است؛ هر تغییر روی یک control، eventهایی را از طریق observableهای `valueChanges` و `statusChanges` emit می‌کند. تنظیم `emitEvent: false` این emissionها را suppress می‌کند؛ چیزی که هنگام set کردن مقدارها به‌صورت programmatic بدون trigger کردن رفتار reactive مثل auto-save، جلوگیری از updateهای circular بین controlها، یا انجام bulk updateهایی که eventها باید فقط یک‌بار در پایان emit شوند مفید است.

```ts
@Component({
  /* ... */
})
export class BlogPostEditor {
  postForm = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
  });

  constructor() {
    // Auto-save draft every time user types
    this.postForm.valueChanges.subscribe((formValue) => {
      this.autosaveDraft(formValue);
    });
  }

  loadExistingDraft(savedDraft: {title: string; content: string}) {
    // Restore draft without triggering auto-save
    this.postForm.setValue(savedDraft, {emitEvent: false});
  }
}
```

### شناخت propagation control

به‌صورت پیش‌فرض `onlySelf: false` است؛ updateها به parent controlها cascade می‌شوند و value و validation status آن‌ها را دوباره محاسبه می‌کنند. تنظیم `onlySelf: true` update را به control فعلی محدود می‌کند و از notification به parent جلوگیری می‌کند. این برای batch operationهایی مفید است که می‌خواهید parent update را یک‌بار به‌صورت دستی trigger کنید.

```ts
updatePostalCodeValidator(country: string) {
  const postal = this.addressForm.get('postalCode');

  const validators = country === 'US'
    ? [Validators.maxLength(5)]
    : [Validators.maxLength(7)];

  postal.setValidators(validators);
  postal.updateValueAndValidity({ onlySelf: true, emitEvent: false });
}
```

HELPFUL: برای مدیریت dynamic validatorها در runtime، بخش [Managing validators dynamically in reactive forms](guide/forms/form-validation#managing-validators-dynamically-in-reactive-forms) را در راهنمای Form Validation ببینید.

## Utility functionها برای narrow کردن typeهای form control

Angular چهار utility function فراهم می‌کند که کمک می‌کنند type concrete یک `AbstractControl` را مشخص کنید. این functionها به‌عنوان **type guard** عمل می‌کنند و وقتی `true` برگردانند type کنترل را narrow می‌کنند؛ بنابراین می‌توانید داخل همان block به propertyهای مخصوص subtype با خیال راحت دسترسی داشته باشید.

| Utility function | جزئیات |
| :--------------- | :----- |
| `isFormControl`  | وقتی control یک `FormControl` باشد `true` برمی‌گرداند. |
| `isFormGroup`    | وقتی control یک `FormGroup` باشد `true` برمی‌گرداند. |
| `isFormRecord`   | وقتی control یک `FormRecord` باشد `true` برمی‌گرداند. |
| `isFormArray`    | وقتی control یک `FormArray` باشد `true` برمی‌گرداند. |

این helperها به‌خصوص در **custom validator**ها مفیدند؛ جایی که function signature یک `AbstractControl` دریافت می‌کند، اما logic برای نوع مشخصی از control طراحی شده است.

```ts
import {AbstractControl, isFormArray} from '@angular/forms';

export function positiveValues(control: AbstractControl) {
  if (!isFormArray(control)) {
    return null; // Not a FormArray: validator is not applicable.
  }

  // Safe to access FormArray-specific API after narrowing.
  const hasNegative = control.controls.some((c) => c.value < 0);
  return hasNegative ? {positiveValues: true} : null;
}
```

## خلاصه‌ی API مربوط به reactive forms

جدول زیر کلاس‌ها و serviceهای پایه‌ای را فهرست می‌کند که برای ساخت و مدیریت reactive form controlها استفاده می‌شوند. برای جزئیات کامل syntax، مستندات API مربوط به [Forms package](api#forms 'API reference') را ببینید.

### کلاس‌ها

| Class             | جزئیات |
| :---------------- | :----- |
| `AbstractControl` | کلاس پایه‌ی abstract برای کلاس‌های concrete form control یعنی `FormControl`، `FormGroup` و `FormArray`. رفتارها و propertyهای مشترک آن‌ها را فراهم می‌کند. |
| `FormControl`     | مقدار و validity status یک form control جداگانه را مدیریت می‌کند. با یک HTML form control مثل `<input>` یا `<select>` متناظر است. |
| `FormGroup`       | مقدار و validity state گروهی از instanceهای `AbstractControl` را مدیریت می‌کند. propertyهای group شامل child controlهای آن است. فرم سطح‌بالا در component شما `FormGroup` است. |
| `FormArray`       | مقدار و validity state یک array با index عددی از instanceهای `AbstractControl` را مدیریت می‌کند. |
| `FormBuilder`     | یک injectable service که factory methodهایی برای ساخت control instanceها فراهم می‌کند. |
| `FormRecord`      | مقدار و validity state مجموعه‌ای از instanceهای `FormControl` را دنبال می‌کند که هر کدام value type یکسانی دارند. |

### Directiveها

| Directive              | جزئیات |
| :--------------------- | :----- |
| `FormControlDirective` | یک standalone `FormControl` instance را با form control element sync می‌کند. |
| `FormControlName`      | `FormControl` موجود در یک `FormGroup` instance را با form control element بر اساس name sync می‌کند. |
| `FormGroupDirective`   | یک `FormGroup` instance موجود را با یک DOM element sync می‌کند. |
| `FormGroupName`        | یک nested `FormGroup` instance را با یک DOM element sync می‌کند. |
| `FormArrayName`        | یک nested `FormArray` instance را با یک DOM element sync می‌کند. |
| `FormArrayDirective`   | یک standalone `FormArray` instance را با یک DOM element sync می‌کند. |
