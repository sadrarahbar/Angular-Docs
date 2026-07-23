# animationهای قابل‌استفاده مجدد

IMPORTANT: بسته `@angular/animations` اکنون منسوخ شده است. تیم Angular توصیه می‌کند برای animationهای تمام کدهای جدید، از CSS بومی همراه با `animate.enter` و `animate.leave` استفاده کنید. برای اطلاعات بیشتر به [راهنمای animationهای enter و leave](guide/animations) مراجعه کنید. همچنین برای آشنایی با نحوه آغاز مهاجرت برنامه‌ها به animationهای CSS خالص، [مهاجرت از بسته Animations در Angular](guide/animations/migration) را ببینید.

این مبحث نمونه‌هایی از ساخت animationهای قابل‌استفاده مجدد ارائه می‌کند.

## ساخت animationهای قابل‌استفاده مجدد

برای ساخت یک animation قابل‌استفاده مجدد، با تابع [`animation()`](api/animations/animation) آن را در یک فایل `.ts` جداگانه تعریف کنید و این تعریف animation را در قالب یک متغیر export از نوع `const` اعلام کنید.
سپس می‌توانید با تابع [`useAnimation()`](api/animations/useAnimation)، این animation را در componentهای برنامه import کرده و دوباره به‌کار ببرید.

<docs-code header="animations.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" region="animation-const"/>

در قطعه‌کد بالا، با اعلام `transitionAnimation` به‌عنوان متغیر export، امکان استفاده مجدد از آن فراهم شده است.

HELPFUL: ورودی‌های `height`،‏ `opacity`،‏ `backgroundColor` و `time` هنگام runtime جایگزین می‌شوند.

همچنین می‌توانید بخشی از یک animation را export کنید.
برای مثال، قطعه‌کد زیر `trigger` مربوط به animation را export می‌کند.

<docs-code header="animations.1.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" region="trigger-const"/>

از این مرحله به بعد می‌توانید متغیرهای animation قابل‌استفاده مجدد را در class مربوط به component خود import کنید.
برای مثال، قطعه‌کد زیر متغیر `transitionAnimation` را import کرده و آن را از طریق تابع `useAnimation()` به‌کار می‌برد.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.3.ts" region="reusable"/>

## مطالب بیشتر درباره animationهای Angular

ممکن است مطالب زیر نیز برایتان مفید باشند:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations" title="مقدمه‌ای بر animationهای Angular"/>
  <docs-pill href="guide/legacy-animations/transition-and-triggers" title="transitionها و triggerها"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="توالی‌های پیچیده animation"/>
  <docs-pill href="guide/routing/route-transition-animations" title="animationهای transition در routing"/>
  <docs-pill href="guide/animations/migration" title="مهاجرت به animationهای CSS بومی"/>
</docs-pill-row>
