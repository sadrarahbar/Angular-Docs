# ساخت فرم‌های پویا

بسیاری از فرم‌ها، مثل پرسش‌نامه‌ها، می‌توانند از نظر قالب و هدف بسیار شبیه هم باشند. برای اینکه ساخت نسخه‌های مختلف چنین فرمی سریع‌تر و ساده‌تر شود، می‌توانید یک _dynamic form template_ بر اساس metadataای بسازید که business object model را توصیف می‌کند. سپس از template استفاده کنید تا فرم‌های جدید را بر اساس تغییرات data model به‌صورت خودکار تولید کنید.

این تکنیک به‌خصوص وقتی مفید است که نوعی فرم دارید که محتوای آن باید مرتب تغییر کند تا با نیازهای business و regulatory که سریع تغییر می‌کنند هماهنگ بماند. یک use case معمول، پرسش‌نامه است. ممکن است لازم باشد در contextهای مختلف از کاربرها input بگیرید. قالب و style فرم‌هایی که کاربر می‌بیند باید ثابت بماند، در حالی که سوال‌های واقعی‌ای که باید بپرسید با context تغییر می‌کنند.

در این tutorial، یک dynamic form می‌سازید که یک پرسش‌نامه‌ی پایه را نمایش می‌دهد. شما یک application آنلاین برای درخواست استخدام قهرمان‌ها می‌سازید. agency دائما فرایند application را تغییر می‌دهد، اما با استفاده از dynamic form می‌توانید فرم‌های جدید را بدون تغییر کد application در لحظه بسازید.

این tutorial شما را از این مرحله‌ها عبور می‌دهد:

1. reactive forms را برای یک پروژه فعال کنید.
1. یک data model برای نمایش form controlها ایجاد کنید.
1. model را با sample data پر کنید.
1. componentای توسعه دهید که form controlها را به‌صورت dynamic بسازد.

فرمی که می‌سازید از input validation و styling برای بهتر کردن تجربه‌ی کاربر استفاده می‌کند. این فرم یک دکمه‌ی Submit دارد که فقط وقتی همه‌ی inputهای کاربر معتبر باشند فعال می‌شود، و input نامعتبر را با رنگ‌بندی و پیام خطا مشخص می‌کند.

نسخه‌ی پایه می‌تواند تکامل پیدا کند تا تنوع بیشتری از سوال‌ها، rendering نرم‌تر و تجربه‌ی کاربری بهتر را پشتیبانی کند.

## فعال کردن reactive forms برای پروژه

dynamic formها بر پایه‌ی reactive forms هستند.

برای اینکه application به directiveهای reactive form دسترسی داشته باشد، `ReactiveFormsModule` را از package مربوط به `@angular/forms` داخل componentهای لازم import کنید.

<docs-code-multifile>
    <docs-code header="dynamic-form.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.ts"/>
    <docs-code header="dynamic-form-question.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.ts"/>
</docs-code-multifile>

## ساخت object model فرم

یک dynamic form به object modelای نیاز دارد که بتواند همه‌ی سناریوهای موردنیاز functionality فرم را توصیف کند. فرم نمونه‌ی درخواست استخدام قهرمان‌ها مجموعه‌ای از questionهاست؛ یعنی هر control در فرم باید یک question بپرسد و یک answer بپذیرد.

data model برای این نوع فرم باید یک question را نمایش دهد. مثال شامل `DynamicFormQuestionComponent` است که question را به‌عنوان object بنیادی model تعریف می‌کند.

`QuestionBase` زیر یک base class برای مجموعه‌ای از controlهاست که می‌توانند question و answer آن را در فرم نمایش دهند.

<docs-code header="question-base.ts" path="adev/src/content/examples/dynamic-form/src/app/question-base.ts"/>

### تعریف کلاس‌های control

از این base، مثال دو کلاس جدید به نام‌های `TextboxQuestion` و `DropdownQuestion` مشتق می‌کند که typeهای مختلف control را نمایش می‌دهند. وقتی در مرحله‌ی بعد form template را می‌سازید، این نوع‌های خاص question را instantiate می‌کنید تا controlهای مناسب به‌صورت dynamic render شوند.

نوع control مربوط به `TextboxQuestion` در form template با یک element از نوع `<input>` نمایش داده می‌شود. این control یک question نمایش می‌دهد و اجازه می‌دهد کاربرها input وارد کنند. attribute مربوط به `type` برای element بر اساس field مربوط به `type` که در argument مربوط به `options` مشخص شده تعریف می‌شود، مثلا `text`، `email` یا `url`.

<docs-code header="question-textbox.ts" path="adev/src/content/examples/dynamic-form/src/app/question-textbox.ts"/>

نوع control مربوط به `DropdownQuestion` فهرستی از گزینه‌ها را در یک select box نمایش می‌دهد.

 <docs-code header="question-dropdown.ts" path="adev/src/content/examples/dynamic-form/src/app/question-dropdown.ts"/>

### Compose کردن form groupها

یک dynamic form از service برای ساخت مجموعه‌های گروه‌بندی‌شده از input controlها بر اساس form model استفاده می‌کند. `QuestionControlService` زیر مجموعه‌ای از instanceهای `FormGroup` را جمع می‌کند که metadata را از question model مصرف می‌کنند. می‌توانید مقدارهای پیش‌فرض و validation ruleها را مشخص کنید.

<docs-code header="question-control.service.ts" path="adev/src/content/examples/dynamic-form/src/app/question-control.service.ts"/>

## Compose کردن محتوای dynamic form

خود dynamic form با یک container component نمایش داده می‌شود که در مرحله‌ای بعد آن را اضافه می‌کنید. هر question در template مربوط به form component با tag `<app-question>` نمایش داده می‌شود که با یک instance از `DynamicFormQuestionComponent` match می‌شود.

`DynamicFormQuestionComponent` مسئول render کردن جزئیات یک question جداگانه بر اساس مقدارهای موجود در object مربوط به question است که data-bound شده. فرم برای وصل کردن HTML template به control objectهای underlying به directive مربوط به [`[formGroup]`](api/forms/FormGroupDirective 'API reference') تکیه می‌کند. `DynamicFormQuestionComponent`، form groupها را می‌سازد و آن‌ها را با controlهایی که در question model تعریف شده‌اند پر می‌کند و ruleهای display و validation را مشخص می‌کند.

<docs-code-multifile>
  <docs-code header="dynamic-form-question.component.html" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.html"/>
  <docs-code header="dynamic-form-question.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.ts"/>
</docs-code-multifile>

هدف `DynamicFormQuestionComponent` نمایش typeهای question تعریف‌شده در model شماست. در این نقطه فقط دو نوع question دارید، اما می‌توانید انواع بسیار بیشتری را تصور کنید. block مربوط به `@switch` در template مشخص می‌کند کدام نوع question نمایش داده شود. این switch از directiveهایی با selectorهای [`formControlName`](api/forms/FormControlName 'FormControlName directive API reference') و [`formGroup`](api/forms/FormGroupDirective 'FormGroupDirective API reference') استفاده می‌کند. هر دو directive در `ReactiveFormsModule` تعریف شده‌اند.

### فراهم کردن داده

service دیگری لازم است تا مجموعه‌ای مشخص از questionها را برای ساخت یک فرم جداگانه فراهم کند. برای این تمرین، `QuestionService` را می‌سازید تا این array از questionها را از sample data hard-coded فراهم کند. در یک app واقعی، service ممکن است داده را از یک backend system fetch کند. نکته‌ی اصلی اما این است که questionهای درخواست استخدام قهرمان‌ها را کاملا از طریق objectهایی کنترل می‌کنید که از `QuestionService` برمی‌گردند. برای نگهداری پرسش‌نامه هم‌زمان با تغییر requirementها، فقط لازم است objectهای array مربوط به `questions` را اضافه، به‌روزرسانی یا حذف کنید.

`QuestionService` مجموعه‌ای از questionها را به شکل آرایه‌ای فراهم می‌کند که به `input()` مربوط به questions bind شده است.

<docs-code header="question.service.ts" path="adev/src/content/examples/dynamic-form/src/app/question.service.ts"/>

## ساخت template مربوط به dynamic form

component مربوط به `DynamicFormComponent` نقطه‌ی ورود و container اصلی فرم است؛ فرمی که در template با `<app-dynamic-form>` نمایش داده می‌شود.

component مربوط به `DynamicFormComponent` با bind کردن هر question به یک element از نوع `<app-question>` که با `DynamicFormQuestionComponent` match می‌شود، فهرستی از questionها را نمایش می‌دهد.

<docs-code-multifile>
    <docs-code header="dynamic-form.component.html" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.html"/>
    <docs-code header="dynamic-form.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.ts"/>
</docs-code-multifile>

### نمایش فرم

برای نمایش یک instance از dynamic form، template مربوط به shell در `AppComponent`، آرایه‌ی `questions` برگشتی از `QuestionService` را به form container component یعنی `<app-dynamic-form>` پاس می‌دهد.

<docs-code header="app.component.ts" path="adev/src/content/examples/dynamic-form/src/app/app.component.ts"/>

این جداسازی model و data به شما اجازه می‌دهد componentها را برای هر نوع survey دوباره استفاده کنید، تا وقتی با object model مربوط به _question_ سازگار باشد.

### اطمینان از داده‌ی معتبر

form template از dynamic data binding مربوط به metadata استفاده می‌کند تا بدون فرض hardcoded درباره‌ی questionهای مشخص، فرم را render کند. همچنین control metadata و validation criteria را به‌صورت dynamic اضافه می‌کند.

برای اطمینان از input معتبر، دکمه‌ی _Save_ تا زمانی که فرم در وضعیت معتبر نباشد disabled است. وقتی فرم معتبر است، روی _Save_ کلیک کنید تا application مقدارهای فعلی فرم را به‌صورت JSON render کند.

شکل زیر فرم نهایی را نشان می‌دهد.

<img alt="Dynamic-Form" src="assets/images/guide/dynamic-form/dynamic-form.png">

## گام‌های بعدی

<docs-pill-row>
  <docs-pill title="Validating form input" href="guide/forms/reactive-forms#validating-form-input" />
  <docs-pill title="Form validation guide" href="guide/forms/form-validation" />
</docs-pill-row>
