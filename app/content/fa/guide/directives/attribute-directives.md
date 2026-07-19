# Attribute directiveها

با attribute directiveها ظاهر یا behavior مربوط به DOM elementها و componentهای Angular را تغییر دهید.

## ساخت یک attribute directive

این بخش شما را در ساخت یک highlight directive راهنمایی می‌کند که background color مربوط به host element را روی yellow تنظیم می‌کند.

1. برای ساخت یک directive، از command مربوط به CLI یعنی [`ng generate directive`](tools/cli/schematics) استفاده کنید.

   ```shell
   ng generate directive highlight
   ```

   CLI فایل `src/app/highlight.directive.ts` و یک test file متناظر به نام `src/app/highlight.directive.spec.ts` را می‌سازد.

   ```angular-ts
   import {Directive} from '@angular/core';

   @Directive({
     selector: '[appHighlight]',
   })
   export class HighlightDirective {}
   ```

   property مربوط به configuration در decorator مربوط به `@Directive()`، CSS attribute selector مربوط به directive یعنی `[appHighlight]` را مشخص می‌کند.

1. `ElementRef` و `inject` را از `@angular/core` import کنید.
   `ElementRef` از طریق property مربوط به `nativeElement` خود، دسترسی مستقیم به host DOM element می‌دهد.

1. از [`inject`](guide/di) استفاده کنید تا reference به host DOM element بگیرید؛ همان elementی که `appHighlight` را روی آن اعمال می‌کنید.

1. به کلاس `HighlightDirective` logic اضافه کنید که background را روی yellow تنظیم کند.

   <docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.1.ts"/>

IMPORTANT: Directiveها از namespace پشتیبانی _نمی‌کنند_.

```angular-html {avoid}
<p app:Highlight>This is invalid</p>
```

## اعمال یک attribute directive

برای استفاده از `HighlightDirective`، یک element از نوع `<p>` به HTML template اضافه کنید و directive را به‌عنوان attribute روی آن بگذارید.

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.1.html" region="applied"/>

Angular یک instance از کلاس `HighlightDirective` می‌سازد؛ این کلاس با `inject(ElementRef)` یک reference به element مربوط به `<p>` می‌گیرد و background style آن را روی yellow تنظیم می‌کند.

## مدیریت eventهای کاربر

این بخش نشان می‌دهد چگونه تشخیص دهید کاربر mouse را وارد element یا از آن خارج می‌کند و در پاسخ، highlight color را تنظیم یا پاک کنید.

1. Host event bindingها را با استفاده از property مربوط به `host` در decorator مربوط به `@Directive()` configure کنید.

   <docs-code header="src/app/highlight.directive.ts (decorator)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts" region="decorator"/>

1. دو event handler method اضافه کنید و eventهای host element را از طریق property مربوط به `host` به آن‌ها map کنید.

   <docs-code header="highlight.directive.ts (mouse-methods)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts" region="mouse-methods"/>

با configure کردن event listenerها روی [`host` property](guide/components/host-elements#binding-to-the-host-element) مربوط به directive، به eventهای DOM elementی که میزبان attribute directive است subscribe کنید؛ در اینجا element مربوط به `<p>`.

HELPFUL: Handlerها کار را به یک helper method به نام `highlight()` واگذار می‌کنند که color را روی host DOM element یعنی `el` تنظیم می‌کند.

Directive کامل به این شکل است:

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts"/>

Background color وقتی pointer روی paragraph element hover می‌کند ظاهر می‌شود و وقتی pointer خارج می‌شود ناپدید می‌شود.

<img alt="Second Highlight" src="assets/images/guide/attribute-directives/highlight-directive-anim.gif">

## پاس دادن value به یک attribute directive

این بخش شما را در تنظیم highlight color هنگام اعمال `HighlightDirective` راهنمایی می‌کند.

1. در `highlight.directive.ts`، `input` را از `@angular/core` import کنید.

   <docs-code header="highlight.directive.ts (imports)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" region="imports"/>

1. یک `input` property به نام `appHighlight` اضافه کنید.

   <docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" region="input"/>

   تابع `input()` metadataای به class اضافه می‌کند که property مربوط به `appHighlight` در directive را برای binding در دسترس قرار می‌دهد.

1. در `app.component.ts`، یک property به نام `color` به `AppComponent` اضافه کنید.

   <docs-code header="app.component.ts (class)" path="adev/src/content/examples/attribute-directives/src/app/app.component.1.ts" region="class"/>

1. برای اینکه directive و color را هم‌زمان اعمال کنید، از property binding با selector مربوط به directive یعنی `appHighlight` استفاده کنید و آن را برابر `color` قرار دهید.

   <docs-code header="app.component.html (color)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="color"/>

   Attribute binding مربوط به `[appHighlight]` دو کار انجام می‌دهد:
   - highlighting directive را روی element مربوط به `<p>` اعمال می‌کند
   - highlight color مربوط به directive را با property binding تنظیم می‌کند

### تنظیم value با input کاربر

این بخش شما را در اضافه کردن radio buttonها راهنمایی می‌کند تا انتخاب color خود را به directive مربوط به `appHighlight` bind کنید.

1. Markup زیر را برای انتخاب color به `app.component.html` اضافه کنید:

   <docs-code header="app.component.html (v2)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="v2"/>

2. `AppComponent.color` را طوری revise کنید که مقدار اولیه نداشته باشد.

   <docs-code header="app.component.ts (class)" path="adev/src/content/examples/attribute-directives/src/app/app.component.ts" region="class"/>

3. در `highlight.directive.ts`، method مربوط به `onMouseEnter` را revise کنید تا ابتدا با `appHighlight` highlight کند و اگر `appHighlight` برابر `undefined` بود، به `red` fallback کند.
   <docs-code header="highlight.directive.ts (mouse-enter)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" region="mouse-enter"/>

4. Application خود را serve کنید تا verify کنید کاربر می‌تواند با radio buttonها color را انتخاب کند.

   <img alt="Animated gif of the refactored highlight directive changing color according to the radio button the user selects" src="assets/images/guide/attribute-directives/highlight-directive-v2-anim.gif">

## Binding به یک property دوم

این بخش شما را در configure کردن application راهنمایی می‌کند تا developer بتواند default color را set کند.

1. یک `input()` property دوم به نام `defaultColor` به `HighlightDirective` اضافه کنید.

   <docs-code header="highlight.directive.ts (defaultColor)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.ts" region="defaultColor"/>

2. `onMouseEnter` مربوط به directive را revise کنید تا ابتدا با `appHighlight` highlight کند، سپس با `defaultColor`، و اگر هر دو property برابر `undefined` بودند، به `red` fallback کند.

   <docs-code header="highlight.directive.ts (mouse-enter)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.ts" region="mouse-enter"/>

3. برای bind کردن به `AppComponent.color` و fallback به "violet" به‌عنوان default color، HTML زیر را اضافه کنید.
   در این حالت، binding مربوط به `defaultColor` از square bracket یعنی `[]` استفاده نمی‌کند، چون مقدار یک static string است، نه dynamic expression.

   <docs-code header="app.component.html (defaultColor)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="defaultColor"/>

   مثل componentها، می‌توانید چند directive property binding به یک host element اضافه کنید.

اگر default color binding وجود نداشته باشد، default color برابر red است.
وقتی کاربر یک color انتخاب می‌کند، color انتخاب‌شده به active highlight color تبدیل می‌شود.

<img alt="Animated gif of final highlight directive that shows red color with no binding and violet with the default color set. When user selects color, the selection takes precedence." src="assets/images/guide/attribute-directives/highlight-directive-final-anim.gif">

## غیرفعال کردن پردازش Angular با `NgNonBindable`

برای جلوگیری از evaluate شدن expression در مرورگر، `ngNonBindable` را به host element اضافه کنید.
`ngNonBindable` interpolation، directiveها و binding را در templateها غیرفعال می‌کند.

در مثال زیر، expression مربوط به `{{ 1 + 1 }}` دقیقا همان‌طور render می‌شود که در code editor شما دیده می‌شود و `2` نمایش داده نمی‌شود.

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="ngNonBindable"/>

اعمال `ngNonBindable` روی یک element، binding را برای child elementهای آن element متوقف می‌کند.
با این حال، `ngNonBindable` همچنان اجازه می‌دهد directiveها روی همان elementی که `ngNonBindable` را اعمال کرده‌اید کار کنند.
در مثال زیر، directive مربوط به `appHighlight` همچنان active است، اما Angular expression مربوط به `{{ 1 + 1 }}` را evaluate نمی‌کند.

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="ngNonBindable-with-directive"/>

اگر `ngNonBindable` را روی یک parent element اعمال کنید، Angular interpolation و هر نوع binding مثل property binding یا event binding را برای childهای آن element غیرفعال می‌کند.
