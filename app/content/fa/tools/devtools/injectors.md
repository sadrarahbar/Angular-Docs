## بررسی injectorها

نکته: Injector Tree برای برنامه‌های Angular ساخته‌شده با نسخه 17 یا بالاتر در دسترس است.

### مشاهده سلسله‌مراتب injectorهای برنامه

زبانه **Injector Tree** به شما امکان می‌دهد ساختار Injectorهای پیکربندی‌شده در برنامه را بررسی کنید. در این بخش دو درخت را می‌بینید که [سلسله‌مراتب injector](guide/di/hierarchical-dependency-injection) برنامه را نشان می‌دهند. یکی سلسله‌مراتب environment و دیگری سلسله‌مراتب element است.

<img src="assets/images/guide/devtools/di-injector-tree.png" alt="تصویری از زبانه 'Profiler' که زبانه injector tree را در Angular Devtools نمایش می‌دهد و نمودار injector یک برنامه نمونه را به‌صورت بصری نشان می‌دهد.">

### نمایش مسیرهای resolution

وقتی injector مشخصی انتخاب می‌شود، مسیری که الگوریتم Dependency Injection در Angular از آن injector تا root طی می‌کند برجسته می‌شود. برای element injectorها، این نما environment injectorهایی را نیز برجسته می‌کند که الگوریتم Dependency Injection، وقتی نتواند یک dependency را در سلسله‌مراتب element برطرف کند، به آن‌ها منتقل می‌شود.

برای جزئیات بیشتر درباره نحوه تعیین مسیرهای resolution در Angular، به [قواعد resolution](guide/di/hierarchical-dependency-injection#resolution-rules) مراجعه کنید.

<img src="assets/images/guide/devtools/di-injector-tree-selected.png" alt="تصویری از زبانه 'Profiler' که نشان می‌دهد نمای injector tree هنگام انتخاب یک injector چگونه مسیرهای resolution را برجسته می‌کند.">

### مشاهده providerهای injector

با کلیک روی injectorی که providerهایی برای آن پیکربندی شده‌اند، فهرست آن providerها در سمت راست نمای injector tree نمایش داده می‌شود. در این بخش می‌توانید token ارائه‌شده و type آن را ببینید. دکمه سمت راست هر provider به شما امکان می‌دهد آن provider را در console ثبت کنید.

<img src="assets/images/guide/devtools/di-injector-tree-providers.png" alt="تصویری از زبانه 'Profiler' که نشان می‌دهد با انتخاب یک injector، providerها چگونه نمایش داده می‌شوند.">
