# ساخت یک فرم template-driven

این tutorial نشان می‌دهد چطور یک فرم template-driven بسازید. elementهای control در فرم به data propertyهایی bind شده‌اند که input validation دارند. input validation کمک می‌کند یکپارچگی داده حفظ شود و styling تجربه‌ی کاربر را بهتر کند.

template-driven forms از [two-way data binding](guide/templates/two-way-binding) استفاده می‌کنند تا وقتی در template تغییری ایجاد می‌شود data model در component به‌روزرسانی شود و برعکس.

<docs-callout helpful title="Template vs Reactive forms">
Angular از دو رویکرد طراحی برای فرم‌های interactive پشتیبانی می‌کند. template-driven forms به شما اجازه می‌دهند در Angular template از directiveهای مخصوص فرم استفاده کنید. reactive forms رویکردی model-driven برای ساخت فرم‌ها فراهم می‌کنند.

template-driven forms برای فرم‌های کوچک یا ساده انتخاب خوبی هستند، در حالی که reactive forms مقیاس‌پذیرترند و برای فرم‌های پیچیده مناسب‌ترند. برای مقایسه‌ی این دو رویکرد، [Choosing an approach](guide/forms#choosing-an-approach) را ببینید.
</docs-callout>

تقریبا هر نوع فرمی را می‌توانید با یک Angular template بسازید: فرم login، فرم contact و تقریبا هر فرم business. می‌توانید controlها را خلاقانه layout کنید و آن‌ها را به داده‌ی object model خود bind کنید. می‌توانید validation ruleها را مشخص کنید، validation errorها را نمایش دهید، به‌صورت شرطی input گرفتن از controlهای مشخص را مجاز کنید، بازخورد بصری داخلی را فعال کنید و کارهای بسیار بیشتر.

## اهداف

این tutorial به شما یاد می‌دهد چطور کارهای زیر را انجام دهید:

- ساخت یک Angular form با component و template
- استفاده از `ngModel` برای ساخت two-way data binding جهت خواندن و نوشتن مقدارهای input-control
- فراهم کردن بازخورد بصری با استفاده از CSS classهای خاصی که state کنترل‌ها را دنبال می‌کنند
- نمایش validation errorها به کاربر و اجازه دادن شرطی به input گرفتن از form controlها بر اساس وضعیت فرم
- به‌اشتراک‌گذاری اطلاعات بین HTML elementها با استفاده از [template reference variables](guide/templates/variables#template-reference-variables)

## ساخت یک فرم template-driven

template-driven forms به directiveهایی تکیه می‌کنند که در `FormsModule` تعریف شده‌اند.

| Directives     | جزئیات |
| :------------- | :----- |
| `NgModel`      | تغییرات مقدار در form element متصل‌شده را با تغییرات data model هماهنگ می‌کند و به شما اجازه می‌دهد با input validation و error handling به input کاربر واکنش نشان دهید. |
| `NgForm`       | یک instance سطح‌بالا از `FormGroup` می‌سازد و آن را به یک element از نوع `<form>` bind می‌کند تا form value و validation status تجمیع‌شده را دنبال کند. به محض اینکه `FormsModule` را import کنید، این directive به‌صورت پیش‌فرض روی همه‌ی tagهای `<form>` فعال می‌شود. لازم نیست selector خاصی اضافه کنید. |
| `NgModelGroup` | یک instance از `FormGroup` می‌سازد و آن را به یک DOM element bind می‌کند. |

### نمای کلی مرحله‌ها

در طول این tutorial، یک فرم نمونه را با مرحله‌های زیر به داده bind می‌کنید و input کاربر را مدیریت می‌کنید.

1. فرم پایه را بسازید.
   - یک sample data model تعریف کنید.
   - زیرساخت لازم مثل `FormsModule` را اضافه کنید.
1. form controlها را با directive مربوط به `ngModel` و syntax مربوط به two-way data-binding به data propertyها bind کنید.
   - بررسی کنید `ngModel` چطور stateهای control را با CSS classها گزارش می‌کند.
   - برای controlها name بگذارید تا برای `ngModel` قابل دسترس باشند.
1. اعتبار input و وضعیت control را با `ngModel` دنبال کنید.
   - CSS سفارشی اضافه کنید تا درباره‌ی وضعیت، بازخورد بصری بدهد.
   - پیام‌های validation-error را نمایش یا پنهان کنید.
1. با اضافه کردن داده به model، به event بومی click روی button در HTML واکنش نشان دهید.
1. submission فرم را با output property مربوط به [`ngSubmit`](api/forms/NgForm#properties) در فرم مدیریت کنید.
   - دکمه‌ی **Submit** را تا زمانی که فرم معتبر نیست disabled کنید.
   - بعد از submit، فرم کامل‌شده را با محتوای دیگری در صفحه جایگزین کنید.

## ساخت فرم

<!-- TODO: link to preview -->
<!-- <docs-code live/> -->

1. application نمونه‌ی ارائه‌شده کلاس `Actor` را می‌سازد که data model بازتاب‌یافته در فرم را تعریف می‌کند.

   <docs-code header="actor.ts" language="typescript" path="adev/src/content/examples/forms/src/app/actor.ts"/>

1. layout و جزئیات فرم در کلاس `ActorFormComponent` تعریف می‌شوند.

   <docs-code header="actor-form.component.ts (v1)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" region="v1"/>

   مقدار `selector` در component، یعنی "app-actor-form"، یعنی می‌توانید این فرم را با tag `<app-actor-form>` داخل template والد قرار دهید.

1. کد زیر یک instance جدید از actor می‌سازد تا فرم اولیه بتواند یک actor نمونه را نشان دهد.

   <docs-code language="typescript" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" language="typescript" region="Marilyn"/>

   این demo از داده‌ی ساختگی برای `model` و `skills` استفاده می‌کند. در یک app واقعی، یک data service inject می‌کنید تا داده‌ی واقعی را بگیرید و ذخیره کنید، یا این propertyها را به‌عنوان input و output expose می‌کنید.

1. component با import کردن module مربوط به `FormsModule` قابلیت Forms را فعال می‌کند.

   <docs-code language="typescript" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" language="typescript" region="imports"/>

1. فرم در application layoutی نمایش داده می‌شود که template مربوط به root component تعریف کرده است.

   <docs-code header="app.component.html" language="html" path="adev/src/content/examples/forms/src/app/app.component.html"/>

   template اولیه layout فرمی با دو form group و یک submit button را تعریف می‌کند. form groupها با دو property از data model مربوط به Actor متناظرند: name و studio. هر group یک label و یک box برای input کاربر دارد.
   - element مربوط به `<input>` برای **Name** attribute مربوط به HTML5 یعنی `required` را دارد.
   - element مربوط به `<input>` برای **Studio** این attribute را ندارد، چون `studio` اختیاری است.

   دکمه‌ی **Submit** چند class برای styling دارد. در این نقطه، layout فرم کاملا HTML5 ساده است و binding یا directive ندارد.

1. فرم نمونه از چند style class از [Twitter Bootstrap](https://getbootstrap.com/css) استفاده می‌کند: `container`، `form-group`، `form-control` و `btn`. برای استفاده از این styleها، stylesheet برنامه library را import می‌کند.

   <docs-code header="styles.css" path="adev/src/content/examples/forms/src/styles.1.css"/>

1. فرم نیاز دارد skill مربوط به actor از فهرست از پیش تعریف‌شده‌ی `skills` انتخاب شود که داخل `ActorFormComponent` نگه‌داری می‌شود. loop مربوط به `@for` در Angular روی data valueها iterate می‌کند تا element مربوط به `<select>` را پر کند.

   <docs-code header="actor-form.component.html (skills)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="skills"/>

اگر همین حالا application را اجرا کنید، فهرست skillها را در selection control می‌بینید. input elementها هنوز به data value یا event bind نشده‌اند، پس هنوز خالی هستند و رفتاری ندارند.

## Bind کردن input controlها به data propertyها

مرحله‌ی بعد این است که input controlها را با two-way data binding به propertyهای متناظر `Actor` bind کنید، تا در پاسخ به input کاربر data model را به‌روزرسانی کنند و در پاسخ به تغییرات programmatic در داده، display را هم به‌روزرسانی کنند.

directive مربوط به `ngModel` که در `FormsModule` تعریف شده اجازه می‌دهد controlهای template-driven form را به propertyهای data model خود bind کنید. وقتی directive را با syntax مربوط به two-way data binding یعنی `[(ngModel)]` اضافه می‌کنید، Angular می‌تواند مقدار و تعامل کاربر با control را دنبال کند و view را با model sync نگه دارد.

1. فایل template یعنی `actor-form.component.html` را ویرایش کنید.
1. tag مربوط به `<input>` کنار label **Name** را پیدا کنید.
1. directive مربوط به `ngModel` را با syntax two-way data binding یعنی `[(ngModel)]="..."` اضافه کنید.

<docs-code header="actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="ngModelName-1"/>

HELPFUL: این مثال بعد از هر input tag یک interpolation تشخیصی موقت دارد، یعنی `{{model.name}}`، تا مقدار داده‌ی فعلی property متناظر را نشان دهد. comment یادآوری می‌کند وقتی مشاهده‌ی کارکرد two-way data binding تمام شد، خط‌های تشخیصی را حذف کنید.

### دسترسی به وضعیت کلی فرم

وقتی `FormsModule` را در component خود import کردید، Angular به‌صورت خودکار یک directive از نوع [NgForm](api/forms/NgForm) ساخت و به tag مربوط به `<form>` در template وصل کرد، چون `NgForm` selector به نام `form` دارد که با elementهای `<form>` match می‌شود.

برای دسترسی به `NgForm` و وضعیت کلی فرم، یک [template reference variable](guide/templates/variables#template-reference-variables) تعریف کنید.

1. فایل template یعنی `actor-form.component.html` را ویرایش کنید.
1. tag مربوط به `<form>` را با یک template reference variable به نام `#actorForm` به‌روزرسانی کنید و مقدار آن را به شکل زیر تنظیم کنید.

   <docs-code header="actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="template-variable"/>

   متغیر template به نام `actorForm` حالا referenceای به instance directive مربوط به `NgForm` است که کل فرم را کنترل می‌کند.

1. app را اجرا کنید.
1. در input box مربوط به **Name** شروع به تایپ کنید.

   وقتی character اضافه و حذف می‌کنید، می‌بینید که آن‌ها در data model ظاهر و ناپدید می‌شوند.

خط تشخیصی که مقدارهای interpolated را نشان می‌دهد ثابت می‌کند مقدارها واقعا از input box به model و دوباره برعکس جریان دارند.

### نام‌گذاری control elementها

وقتی روی یک element از `[(ngModel)]` استفاده می‌کنید، باید attributeای به نام `name` برای آن element تعریف کنید. Angular از نام اختصاص‌داده‌شده برای register کردن element با directive مربوط به `NgForm` استفاده می‌کند که به element والد `<form>` وصل شده است.

مثال یک attribute به نام `name` به element مربوط به `<input>` اضافه کرد و آن را روی "name" گذاشت، که برای نام actor منطقی است. هر مقدار یکتایی کافی است، اما استفاده از نام توصیفی کمک‌کننده است.

1. bindingهای مشابه `[(ngModel)]` و attributeهای `name` را به **Studio** و **Skill** اضافه کنید.
1. حالا می‌توانید پیام‌های تشخیصی‌ای را که مقدارهای interpolated را نشان می‌دهند حذف کنید.
1. برای تایید اینکه two-way data binding برای کل actor model کار می‌کند، یک text binding جدید با pipe مربوط به [`json`](api/common/JsonPipe) در بالای template component اضافه کنید که داده را به string serialize می‌کند.

بعد از این اصلاحات، template فرم باید شبیه زیر باشد:

<docs-code header="actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="ngModel-2"/>

متوجه می‌شوید که:

- هر element از نوع `<input>` یک property به نام `id` دارد. این property توسط attribute مربوط به `for` در element `<label>` استفاده می‌شود تا label با input control خودش match شود. این یک [قابلیت استاندارد HTML](https://developer.mozilla.org/docs/Web/HTML/Element/label) است.

- هر element از نوع `<input>` همچنین property موردنیاز `name` را دارد که Angular برای register کردن control با فرم از آن استفاده می‌کند.

وقتی اثرها را مشاهده کردید، می‌توانید text binding مربوط به `{{ model | json }}` را حذف کنید.

## دنبال کردن stateهای فرم

Angular بعد از submit شدن فرم، class مربوط به `ng-submitted` را روی elementهای `form` اعمال می‌کند. از این class می‌توان برای تغییر style فرم بعد از submit استفاده کرد.

## دنبال کردن stateهای control

اضافه کردن directive مربوط به `NgModel` به یک control، نام classهایی به آن control اضافه می‌کند که state آن را توصیف می‌کنند. از این classها می‌توان برای تغییر style کنترل بر اساس state آن استفاده کرد.

جدول زیر نام classهایی را توصیف می‌کند که Angular بر اساس state کنترل اعمال می‌کند.

| States                           | Class if true | Class if false |
| :------------------------------- | :------------ | :------------- |
| The control has been visited.    | `ng-touched`  | `ng-untouched` |
| The control's value has changed. | `ng-dirty`    | `ng-pristine`  |
| The control's value is valid.    | `ng-valid`    | `ng-invalid`   |

Angular هنگام submission، class مربوط به `ng-submitted` را هم روی elementهای `form` اعمال می‌کند، اما نه روی controlهای داخل element مربوط به `form`.

شما از این CSS classها برای تعریف styleهای control بر اساس status آن استفاده می‌کنید.

### مشاهده‌ی stateهای control

برای دیدن اینکه framework چطور classها را اضافه و حذف می‌کند، developer tools مرورگر را باز کنید و element مربوط به `<input>` را که نام actor را نمایش می‌دهد inspect کنید.

1. با developer tools مرورگر، element مربوط به `<input>` را که با input box مربوط به **Name** متناظر است پیدا کنید. می‌بینید که element علاوه بر "form-control" چند CSS class دیگر هم دارد.

1. وقتی ابتدا آن را باز می‌کنید، classها نشان می‌دهند که مقدار معتبری دارد، مقدار از زمان initialization یا reset تغییر نکرده و control از زمان initialization یا reset بازدید نشده است.

   ```html
   <input class="form-control ng-untouched ng-pristine ng-valid" />
   ```

1. کارهای زیر را روی box مربوط به `<input>` برای **Name** انجام دهید و ببینید کدام classها ظاهر می‌شوند.
   - نگاه کنید اما دست نزنید. classها نشان می‌دهند untouched، pristine و valid است.

   - داخل name box کلیک کنید، سپس بیرون آن کلیک کنید. control حالا بازدید شده است و element به‌جای class مربوط به `ng-untouched`، class مربوط به `ng-touched` دارد.

   - چند slash به انتهای name اضافه کنید. حالا touched و dirty است.

   - name را پاک کنید. این کار مقدار را invalid می‌کند، پس class مربوط به `ng-invalid` جایگزین `ng-valid` می‌شود.

### ساخت بازخورد بصری برای stateها

جفت `ng-valid`/`ng-invalid` به‌خصوص جالب است، چون می‌خواهید وقتی مقدارها نامعتبر هستند یک signal بصری قوی بدهید. همچنین می‌خواهید fieldهای required را مشخص کنید.

می‌توانید fieldهای required و داده‌ی invalid را هم‌زمان با یک نوار رنگی در سمت چپ input box مشخص کنید.

برای تغییر ظاهر به این شکل، مرحله‌های زیر را انجام دهید.

1. definitionهایی برای CSS classهای `ng-*` اضافه کنید.
1. این class definitionها را به یک فایل جدید به نام `forms.css` اضافه کنید.
1. فایل جدید را به پروژه اضافه کنید، به‌عنوان sibling فایل `index.html`:

   <docs-code header="forms.css" language="css" path="adev/src/content/examples/forms/src/assets/forms.css"/>

1. در فایل `index.html`، tag مربوط به `<head>` را به‌روزرسانی کنید تا stylesheet جدید را شامل شود.

   <docs-code header="index.html (styles)" path="adev/src/content/examples/forms/src/index.html" region="styles"/>

### نمایش و پنهان کردن پیام‌های validation error

input box مربوط به **Name** required است و پاک کردن آن نوار را قرمز می‌کند. این نشان می‌دهد چیزی اشتباه است، اما کاربر نمی‌داند مشکل چیست یا باید چه کند. می‌توانید با بررسی و واکنش به state کنترل، پیام مفیدی فراهم کنید.

select box مربوط به **Skill** هم required است، اما به این نوع error handling نیاز ندارد چون selection box خودش انتخاب را به مقدارهای معتبر محدود می‌کند.

برای تعریف و نمایش پیام خطا در زمان مناسب، مرحله‌های زیر را انجام دهید.

<docs-workflow>
<docs-step title="Add a local reference to the input">
tag مربوط به `input` را با یک template reference variable گسترش دهید که بتوانید از داخل template برای دسترسی به Angular control مربوط به input box استفاده کنید. در مثال، این متغیر `#name="ngModel"` است.

template reference variable یعنی `#name` روی `"ngModel"` تنظیم شده، چون این مقدار property مربوط به [`NgModel.exportAs`](api/core/Directive#exportAs) است. این property به Angular می‌گوید چطور یک reference variable را به یک directive link کند.
</docs-step>

<docs-step title="Add the error message">
یک `<div>` اضافه کنید که پیام خطای مناسب را در خود دارد.
</docs-step>

<docs-step title="Make the error message conditional">
با bind کردن propertyهای control مربوط به `name` به property مربوط به `hidden` در element پیام `<div>`، پیام خطا را نمایش یا پنهان کنید.
</docs-step>

<docs-code header="actor-form.component.html (hidden-error-msg)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="hidden-error-msg"/>

<docs-step title="Add a conditional error message to name">
یک پیام خطای شرطی به input box مربوط به `name` اضافه کنید، مثل مثال زیر.

<docs-code header="actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="name-with-error-msg"/>
</docs-step>
</docs-workflow>

<docs-callout title='Illustrating the "pristine" state'>

در این مثال، وقتی control معتبر یا _pristine_ است پیام را پنهان می‌کنید. pristine یعنی کاربر از زمانی که مقدار در این فرم نمایش داده شده آن را تغییر نداده است. اگر state مربوط به `pristine` را نادیده بگیرید، پیام فقط زمانی پنهان می‌شود که مقدار معتبر باشد. اگر با یک actor جدید و خالی یا یک actor نامعتبر وارد این component شوید، پیام خطا را بلافاصله و قبل از هر کاری می‌بینید.

ممکن است بخواهید پیام فقط زمانی نمایش داده شود که کاربر یک تغییر نامعتبر انجام می‌دهد. پنهان کردن پیام وقتی control در state مربوط به `pristine` است به همین هدف می‌رسد. اهمیت این انتخاب را وقتی در مرحله‌ی بعد actor جدیدی به فرم اضافه می‌کنید می‌بینید.

</docs-callout>

## اضافه کردن actor جدید

این تمرین نشان می‌دهد چطور می‌توانید با اضافه کردن داده به model، به event بومی click روی button در HTML واکنش نشان دهید. برای اینکه کاربران فرم بتوانند actor جدید اضافه کنند، یک دکمه‌ی **New Actor** اضافه می‌کنید که به click event پاسخ می‌دهد.

1. در template، یک element از نوع `<button>` با متن "New Actor" در پایین فرم قرار دهید.
1. در فایل component، متد ساخت actor را به actor data model اضافه کنید.

   <docs-code header="actor-form.component.ts (New Actor method)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" region="new-actor"/>

1. event مربوط به click دکمه را به متد ساخت actor یعنی `newActor()` bind کنید.

   <docs-code header="actor-form.component.html (New Actor button)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="new-actor-button-no-reset"/>

1. دوباره application را اجرا کنید و روی دکمه‌ی **New Actor** کلیک کنید.

   فرم پاک می‌شود و نوارهای _required_ سمت چپ input box قرمز می‌شوند و نشان می‌دهند propertyهای `name` و `skill` نامعتبرند. توجه کنید پیام‌های خطا پنهان هستند. دلیلش این است که فرم pristine است؛ شما هنوز چیزی را تغییر نداده‌اید.

1. یک name وارد کنید و دوباره روی **New Actor** کلیک کنید.

   حالا application پیام خطای `Name is required` را نمایش می‌دهد، چون input box دیگر pristine نیست. فرم به خاطر دارد که قبل از کلیک روی **New Actor** یک name وارد کرده بودید.

1. برای برگرداندن state مربوط به pristine در form controlها، بعد از فراخوانی متد `newActor()` همه‌ی flagها را به‌صورت imperative با فراخوانی متد `reset()` فرم پاک کنید.

   <docs-code header="actor-form.component.html (Reset the form)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="new-actor-button-form-reset"/>

   حالا کلیک روی **New Actor** هم فرم و هم flagهای controlهای آن را reset می‌کند.

## Submit کردن فرم با `ngSubmit`

کاربر باید بتواند بعد از پر کردن این فرم، آن را submit کند. دکمه‌ی **Submit** در پایین فرم به‌تنهایی کاری انجام نمی‌دهد، اما به دلیل type آن، یعنی `type="submit"`، یک form-submit event را trigger می‌کند.

برای واکنش به این event، مرحله‌های زیر را انجام دهید.

<docs-workflow>

<docs-step title="Listen to ngOnSubmit">
event property مربوط به [`ngSubmit`](api/forms/NgForm#properties) در فرم را به متد `onSubmit()` در actor-form component bind کنید.

<docs-code header="actor-form.component.html (ngSubmit)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="ngSubmit"/>
</docs-step>

<docs-step title="Bind the disabled property">
از template reference variable یعنی `#actorForm` برای دسترسی به فرمی که دکمه‌ی **Submit** را در خود دارد استفاده کنید و یک event binding بسازید.

property فرم را که اعتبار کلی آن را نشان می‌دهد به property مربوط به `disabled` در دکمه‌ی **Submit** bind می‌کنید.

<docs-code header="actor-form.component.html (submit-button)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="submit-button"/>
</docs-step>

<docs-step title="Run the application">
توجه کنید دکمه فعال است، هرچند هنوز کار مفیدی انجام نمی‌دهد.
</docs-step>

<docs-step title="Delete the Name value">
این کار rule مربوط به "required" را نقض می‌کند، بنابراین پیام خطا را نمایش می‌دهد و توجه کنید که دکمه‌ی **Submit** را هم disabled می‌کند.

لازم نبود وضعیت enabled دکمه را به‌صورت صریح به اعتبار فرم wire کنید. `FormsModule` این کار را به‌صورت خودکار انجام داد، وقتی روی form element بهبودیافته یک template reference variable تعریف کردید و بعد در button control به همان متغیر ارجاع دادید.
</docs-step>
</docs-workflow>

### واکنش به form submission

برای نشان دادن یک پاسخ به form submission، می‌توانید ناحیه‌ی ورود داده را پنهان کنید و چیز دیگری را به‌جای آن نمایش دهید.

<docs-workflow>
<docs-step title="Wrap the form">
کل فرم را داخل یک `<div>` wrap کنید و property مربوط به `hidden` آن را به property مربوط به `ActorFormComponent.submitted` bind کنید.

<docs-code header="actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="edit-div"/>

فرم اصلی از ابتدا visible است، چون property مربوط به `submitted` تا زمانی که فرم را submit نکرده‌اید false است؛ همان‌طور که این fragment از `ActorFormComponent` نشان می‌دهد:

<docs-code header="actor-form.component.ts (submitted)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" region="submitted"/>

وقتی روی دکمه‌ی **Submit** کلیک می‌کنید، flag مربوط به `submitted` برابر true می‌شود و فرم ناپدید می‌شود.
</docs-step>

<docs-step title="Add the submitted state">
برای نمایش چیز دیگری وقتی فرم در submitted state است، HTML زیر را پایین wrapper جدید `<div>` اضافه کنید.

<docs-code header="actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="submitted"/>

این `<div>` که یک actor فقط‌خواندنی را با interpolation bindingها نمایش می‌دهد، فقط وقتی component در submitted state است ظاهر می‌شود.

نمای جایگزین شامل یک دکمه‌ی _Edit_ است که click event آن به expressionای bind شده که flag مربوط به `submitted` را پاک می‌کند.
</docs-step>

<docs-step title="Test the Edit button">
روی دکمه‌ی *Edit* کلیک کنید تا display دوباره به فرم قابل ویرایش برگردد.
</docs-step>
</docs-workflow>

## خلاصه

فرم Angularی که در این صفحه بررسی شد از قابلیت‌های زیر در framework استفاده می‌کند تا از تغییر داده، validation و موارد دیگر پشتیبانی کند.

- یک template فرم HTML در Angular
- یک کلاس form component با decorator مربوط به `@Component`
- مدیریت form submission با bind شدن به event property مربوط به `NgForm.ngSubmit`
- template-reference variableهایی مثل `#actorForm` و `#name`
- syntax مربوط به `[(ngModel)]` برای two-way data binding
- استفاده از attributeهای `name` برای validation و دنبال کردن تغییر form-element
- property مربوط به `valid` روی reference variable در input controlها نشان می‌دهد آیا control معتبر است یا باید پیام خطا نمایش دهد
- کنترل وضعیت enabled دکمه‌ی **Submit** با bind شدن به اعتبار `NgForm`
- CSS classهای سفارشی که درباره‌ی controlهای نامعتبر به کاربر بازخورد بصری می‌دهند

کد نسخه‌ی نهایی application اینجاست:

<docs-code-multifile>
    <docs-code header="actor-form.component.ts" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" region="final"/>
    <docs-code header="actor-form.component.html" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="final"/>
    <docs-code header="actor.ts" path="adev/src/content/examples/forms/src/app/actor.ts"/>
    <docs-code header="app.component.html" path="adev/src/content/examples/forms/src/app/app.component.html"/>
    <docs-code header="app.component.ts" path="adev/src/content/examples/forms/src/app/app.component.ts"/>
    <docs-code header="main.ts" path="adev/src/content/examples/forms/src/main.ts"/>
    <docs-code header="forms.css" path="adev/src/content/examples/forms/src/assets/forms.css"/>
</docs-code-multifile>
