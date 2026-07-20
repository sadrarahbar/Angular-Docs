<docs-decorative-header title="Angular Aria">
</docs-decorative-header>

## Angular Aria چیست؟

ساخت کامپوننت‌های accessible در نگاه اول ساده به نظر می‌رسد، اما پیاده‌سازی آن‌ها مطابق [راهنماهای Accessibility در W3C](https://www.w3.org/TR/wcag/) به تلاش قابل توجه و تخصص accessibility نیاز دارد.

Angular Aria مجموعه‌ای از directiveهای headless و accessible است که patternهای رایج [WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/) را پیاده‌سازی می‌کنند. این directiveها keyboard interactionها، attributeهای ARIA، مدیریت focus و پشتیبانی از screen reader را مدیریت می‌کنند. تنها کاری که شما باید انجام دهید فراهم کردن ساختار HTML، styling با CSS و business logic است!

## نصب

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install @angular/aria
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add @angular/aria
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add @angular/aria
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add @angular/aria
  </docs-code>
</docs-code-multifile>

## Showcase

برای مثال، یک toolbar menu را در نظر بگیریم. با اینکه ممکن است در ظاهر فقط یک ردیف «ساده» از buttonها با logic مشخص باشد، keyboard navigation و screen readerها برای کسانی که با accessibility آشنا نیستند پیچیدگی‌های غیرمنتظره زیادی اضافه می‌کنند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

در همین یک سناریو، developerها باید این موارد را در نظر بگیرند:

- **Keyboard navigation**. کاربران باید بتوانند menu را با Enter یا Space باز کنند، با arrow keyها بین optionها حرکت کنند، با Enter انتخاب کنند و با Escape ببندند.
- **Screen readerها** باید state مربوط به menu، تعداد optionها و اینکه کدام option focus دارد را announce کنند.
- **Focus management** باید focus را منطقی بین trigger و menu itemها جابه‌جا کند.
- **زبان‌های راست‌به‌چپ** به قابلیت navigate کردن در جهت معکوس نیاز دارند.

## چه چیزهایی شامل می‌شود؟

Angular Aria شامل directiveهایی با مستندات جامع، مثال‌های کارکرده و API reference برای patternهای تعاملی رایج است:

### جستجو و انتخاب

| کامپوننت                               | توضیح                                                    |
| --------------------------------------- | -------------------------------------------------------------- |
| [Autocomplete](guide/aria/autocomplete) | Text input همراه با suggestionهای فیلترشده که هنگام typing کاربر ظاهر می‌شوند |
| [Listbox](guide/aria/listbox)           | لیست‌های option با single-select یا multi-select و keyboard navigation   |
| [Select](guide/aria/select)             | pattern مربوط به dropdown تک‌انتخابی با keyboard navigation     |
| [Multiselect](guide/aria/multiselect)   | pattern مربوط به dropdown چندانتخابی با نمایش compact       |
| [Combobox](guide/aria/combobox)         | directive primitive که یک text input را با popup هماهنگ می‌کند |

### Navigation و call to action

| کامپوننت                     | توضیح                                                |
| ----------------------------- | ---------------------------------------------------------- |
| [Menu](guide/aria/menu)       | dropdown menuها با submenuهای nested و keyboard shortcutها |
| [Menubar](guide/aria/menubar) | navigation bar افقی برای menuهای persistent برنامه |
| [Toolbar](guide/aria/toolbar) | مجموعه‌های گروه‌بندی‌شده از controlها با keyboard navigation منطقی  |

### سازماندهی محتوا

| کامپوننت                         | توضیح                                                            |
| --------------------------------- | ---------------------------------------------------------------------- |
| [Accordion](guide/aria/accordion) | panelهای محتوایی collapsible که می‌توانند جداگانه یا انحصاری expand شوند |
| [Tabs](guide/aria/tabs)           | interfaceهای tabدار با modeهای activation خودکار یا دستی            |
| [Tree](guide/aria/tree)           | لیست‌های سلسله‌مراتبی با قابلیت expand/collapse                  |
| [Grid](guide/aria/grid)           | نمایش دوبعدی data با keyboard navigation سلول‌به‌سلول     |

## چه زمانی از Angular Aria استفاده کنیم

Angular Aria زمانی مناسب است که به کامپوننت‌های تعاملی accessible نیاز دارید که با WCAG سازگار باشند و styling سفارشی داشته باشند. مثال‌ها:

- **ساخت design system** - تیم شما یک component library با استانداردهای visual مشخص نگه می‌دارد که به implementationهای accessible نیاز دارد.
- **Enterprise component libraryها** - در حال ساخت کامپوننت‌های reusable برای چند برنامه درون یک سازمان هستید.
- **نیازهای brand سفارشی** - interface باید با design specificationهای دقیق match شود که component libraryهای pre-styled به سادگی نمی‌توانند فراهم کنند.

## چه زمانی از Angular Aria استفاده نکنیم

Angular Aria ممکن است برای هر سناریویی مناسب نباشد:

- **کامپوننت‌های pre-styled** - اگر به کامپوننت‌هایی نیاز دارید که بدون styling سفارشی کامل به نظر برسند، به جای آن از Angular Material استفاده کنید.
- **Formهای ساده** - controlهای native HTML مثل `<button>` و `<input type="radio">` برای use caseهای ساده accessibility داخلی فراهم می‌کنند.
- **Rapid prototyping** - وقتی conceptها را سریع validate می‌کنید، component libraryهای pre-styled زمان development اولیه را کاهش می‌دهند.

## قدم‌های بعدی

از side nav یا [فهرست بالا](#whats-included) یک کامپوننت را بررسی کنید، یا با [Toolbar](guide/aria/toolbar) شروع کنید تا یک مثال کامل از نحوه کار directiveهای Angular Aria ببینید!
