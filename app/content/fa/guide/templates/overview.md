<docs-decorative-header title="Template syntax" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
در Angular، یک template بخشی از HTML است.
برای استفاده از بسیاری از قابلیت‌های Angular، داخل template از syntax ویژه استفاده می‌کنید.
</docs-decorative-header>

TIP: پیش از ورود به این راهنمای جامع، [Essentials](essentials/templates) مربوط به Angular را ببینید.

هر component در Angular یک **template** دارد که [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) مربوط به چیزی را تعریف می‌کند که component روی page render می‌کند. با استفاده از templateها، Angular می‌تواند با تغییر داده‌ها، page شما را به‌صورت خودکار به‌روز نگه دارد.

Templateها معمولا یا داخل property مربوط به `template` در یک فایل `*.ts` قرار دارند، یا در فایل `*.html`. برای یادگیری بیشتر، [راهنمای جامع componentها](/guide/components) را ببینید.

## Templateها چگونه کار می‌کنند؟

Templateها بر پایه syntax مربوط به [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) هستند، همراه با قابلیت‌های اضافه مثل template functionهای built-in، data binding، event listening، variableها و موارد دیگر.

Angular templateها را به JavaScript کامپایل می‌کند تا یک درک داخلی از application شما بسازد. یکی از مزیت‌های این کار، optimizationهای built-in برای rendering است که Angular به‌صورت خودکار روی application شما اعمال می‌کند.

### تفاوت‌ها با HTML استاندارد

برخی تفاوت‌های templateها با syntax استاندارد HTML عبارت‌اند از:

- commentهای داخل source code مربوط به template در خروجی render شده قرار نمی‌گیرند
- elementهای component و directive می‌توانند self-close شوند، مثل `<UserProfile />`
- attributeهایی با کاراکترهای خاص، مثل `[]` و `()`، برای Angular معنای ویژه دارند. برای اطلاعات بیشتر، [مستندات binding](guide/templates/binding) و [مستندات اضافه کردن event listener](guide/templates/event-listeners) را ببینید.
- کاراکتر `@` برای Angular معنای ویژه‌ای دارد و برای اضافه کردن رفتار dynamic، مثل [control flow](guide/templates/control-flow)، به templateها استفاده می‌شود. می‌توانید کاراکتر literal مربوط به `@` را با escape کردن آن به‌عنوان entity code در HTML وارد کنید: `&commat;` یا `&#64;`.
- Angular whitespace characterهای غیرضروری را نادیده می‌گیرد و collapse می‌کند. برای جزئیات بیشتر، [whitespace in templates](guide/templates/whitespace) را ببینید.
- Angular ممکن است comment nodeهایی را به‌عنوان placeholder برای dynamic content به page اضافه کند، اما توسعه‌دهندگان می‌توانند آن‌ها را نادیده بگیرند.

علاوه بر این، با اینکه بیشتر syntaxهای HTML به‌عنوان template syntax معتبر هستند، Angular از element مربوط به `<script>` در templateها پشتیبانی نمی‌کند. برای اطلاعات بیشتر، page مربوط به [Security](best-practices/security) را ببینید.

## قدم بعدی چیست؟

ممکن است به موضوع‌های زیر هم علاقه‌مند باشید:

| Topics                                                                      | Details                                                                     |
| :-------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| [Binding dynamic text, properties, and attributes](guide/templates/binding) | داده dynamic را به text، property و attributeها bind کنید.                  |
| [Adding event listeners](guide/templates/event-listeners)                   | در templateهای خود به eventها پاسخ دهید.                                    |
| [Two-way binding](guide/templates/two-way-binding)                          | یک مقدار را هم‌زمان bind کنید و تغییرات را propagate کنید.                  |
| [Control flow](guide/templates/control-flow)                                | elementها را به‌صورت شرطی نمایش دهید، hidden کنید و تکرار کنید.             |
| [Pipes](guide/templates/pipes)                                              | داده را به‌صورت declarative transform کنید.                                  |
| [Slotting child content with ng-content](guide/templates/ng-content)        | کنترل کنید componentها چگونه content را render کنند.                         |
| [Create template fragments with ng-template](guide/templates/ng-template)   | یک template fragment declare کنید.                                           |
| [Grouping elements with ng-container](guide/templates/ng-container)         | چند element را با هم group کنید یا محلی برای rendering علامت بگذارید.        |
| [Variables in templates](guide/templates/variables)                         | درباره variable declarationها یاد بگیرید.                                    |
| [Deferred loading with @defer](guide/templates/defer)                       | با `@defer` viewهای deferrable بسازید.                                       |
| [Expression syntax](guide/templates/expression-syntax)                      | شباهت‌ها و تفاوت‌های Angular expressionها و JavaScript استاندارد را یاد بگیرید. |
| [Whitespace in templates](guide/templates/whitespace)                       | یاد بگیرید Angular چگونه whitespace را مدیریت می‌کند.                        |
