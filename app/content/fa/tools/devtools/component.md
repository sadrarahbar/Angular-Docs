# بررسی درخت کامپوننت

## اشکال‌زدایی برنامه

تب **Components** امکان بررسی ساختار برنامه را فراهم می‌کند.
می‌توانید نمونه‌های کامپوننت و directive موجود در DOM را ببینید و وضعیت آن‌ها را بررسی یا ویرایش کنید.

### بررسی ساختار برنامه

درخت کامپوننت، رابطه سلسله‌مراتبی _کامپوننت‌ها و directiveها_ را در برنامه نمایش می‌دهد.

<img src="assets/images/guide/devtools/component-explorer.png" alt="A screenshot of the 'Components' tab showing a tree of Angular components and directives starting the root of the application.">

برای انتخاب هر کامپوننت یا directive و مشاهده ویژگی‌های آن، روی مورد موردنظر در component explorer کلیک کنید.
Angular DevTools ویژگی‌ها و metadata را در سمت راست درخت کامپوننت نمایش می‌دهد.

برای یافتن یک کامپوننت یا directive بر اساس نام، از کادر جست‌وجوی بالای درخت کامپوننت استفاده کنید.

<img src="assets/images/guide/devtools/search.png" alt="A screenshot of the 'Components' tab. The filter bar immediately underneath the tab is searching for 'todo' and all components with 'todo' in the name are highlighted in the tree. `app-todos` is currently selected and a sidebar to the right displays information about the component's properties. This includes a section of `@Output` fields and another section for other properties.">

### رفتن به گره میزبان

برای رفتن به عنصر میزبان یک کامپوننت یا directive مشخص، در component explorer روی آن دوبار کلیک کنید.
Angular DevTools تب Elements را در Chrome یا تب Inspector را در Firefox باز و گره DOM مرتبط را انتخاب می‌کند.

### رفتن به کد منبع

Angular DevTools برای کامپوننت‌ها امکان رفتن به تعریف کامپوننت در تب Sources در Chrome و تب Debugger در Firefox را فراهم می‌کند.
پس از انتخاب کامپوننت موردنظر، روی آیکون گوشه بالا سمت راست نمای ویژگی‌ها کلیک کنید:

<img src="assets/images/guide/devtools/navigate-source.png" alt="A screenshot of the 'Components' tab. The properties view on the right is visible for a component and the mouse rests in the upper right corner of that view on top of a `<>` icon. An adjacent tooltip reads 'Open component source'.">

### به‌روزرسانی مقدار ویژگی

نمای ویژگی‌ها نیز مانند DevTools مرورگرها امکان ویرایش مقدار input، output یا سایر ویژگی‌ها را فراهم می‌کند.
روی مقدار ویژگی کلیک راست کنید؛ اگر این نوع مقدار قابل ویرایش باشد، یک ورودی متنی ظاهر می‌شود.
مقدار جدید را وارد کنید و برای اعمال آن روی ویژگی، `Enter` را فشار دهید.

<img src="assets/images/guide/devtools/update-property.png" alt="A screenshot of the 'Components' tab with the properties view open for a component. An `@Input` named `todo` contains a `label` property which is currently selected and has been manually updated to the value 'Buy milk'.">

### دسترسی به کامپوننت یا directive انتخاب‌شده در console

Angular DevTools به‌عنوان میان‌بری در console، دسترسی به نمونه‌های کامپوننت‌ها یا directiveهای انتخاب‌شده اخیر را فراهم می‌کند.
برای دریافت reference نمونه کامپوننت یا directive انتخاب‌شده فعلی، `$ng0` را وارد کنید. برای نمونه انتخاب‌شده قبلی `$ng1`، برای نمونه پیش از آن `$ng2` و به همین ترتیب استفاده کنید.

<img src="assets/images/guide/devtools/access-console.png" alt="A screenshot of the 'Components' tab with the browser console underneath. In the console, the user has typed three commands, `$ng0`, `$ng1`, and `$ng2` to view the three most recently selected elements. After each statement, the console prints a different component reference.">

### انتخاب یک directive یا کامپوننت

مشابه DevTools مرورگرها، می‌توانید برای انتخاب یک کامپوننت یا directive مشخص، صفحه را inspect کنید.
در گوشه بالا سمت چپ Angular DevTools روی آیکون **_Inspect element_** کلیک کنید و نشانگر را روی یک عنصر DOM در صفحه نگه دارید.
افزونه directiveها و کامپوننت‌های مرتبط را شناسایی می‌کند و امکان انتخاب عنصر متناظر در درخت Component را می‌دهد.

<img src="assets/images/guide/devtools/inspect-element.png" alt="A screenshot of the 'Components' tab with an Angular todo application visible. In the very top-left corner of Angular DevTools, an icon of a screen with a mouse icon inside it is selected. The mouse rests on a todo element in the Angular application UI. The element is highlighted with a `<TodoComponent>` label displayed in an adjacent tooltip.">

### بررسی viewهای قابل تعویق

درخت directive علاوه بر directiveها، شامل [بلوک‌های `@defer`](/guide/templates/defer) نیز می‌شود.

<img src="assets/images/guide/devtools/defer-block.png" />

با کلیک روی یک بلوک defer، جزئیات بیشتری در نوار کناری ویژگی‌ها نمایش داده می‌شود: بلوک‌های اختیاری مختلف مانند `@loading`، `@placeholder` و `@error`؛ triggerهای پیکربندی‌شده شامل defer، prefetch و hydrate؛ و گزینه‌های زمان‌بندی مانند مقادیر `minimum` و `after`.

### Hydration

وقتی [hydration](/guide/hydration) در برنامه SSR/SSG فعال باشد، درخت directive وضعیت hydration هر کامپوننت را نمایش می‌دهد.

در صورت بروز خطا، پیام خطا روی کامپوننت درگیر نمایش داده می‌شود.

<img src="assets/images/guide/devtools/hydration-status.png" />

با فعال‌کردن overlay، وضعیت hydration را می‌توان روی خود برنامه نیز مشاهده کرد.

<img src="assets/images/guide/devtools/hydration-overlay-ecom.png" />

تصویر بالا overlayهای hydration را در یک برنامه نمونه فروشگاه اینترنتی Angular نشان می‌دهد.
