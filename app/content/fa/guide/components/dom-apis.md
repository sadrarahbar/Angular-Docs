# استفاده از DOM APIها

TIP: این راهنما فرض می‌کند قبلاً [راهنمای Essentials](essentials) را خوانده‌اید. اگر تازه با Angular آشنا شده‌اید، اول آن را بخوانید.

Angular بیشتر creation، update و removal مربوط به DOM را برای شما مدیریت می‌کند. با این حال، شاید به ندرت لازم باشد مستقیماً با DOM یک کامپوننت تعامل داشته باشید. کامپوننت‌ها می‌توانند `ElementRef` را inject کنند تا referenceای به host element کامپوننت بگیرند:

```ts
@Component(/* ... */)
export class ProfilePhoto {
  constructor() {
    const elementRef = inject(ElementRef);
    console.log(elementRef.nativeElement);
  }
}
```

property مربوط به `nativeElement` به instance مربوط به host [Element](https://developer.mozilla.org/docs/Web/API/Element) اشاره می‌کند.

می‌توانید از تابع‌های `afterEveryRender` و `afterNextRender` در Angular استفاده کنید تا یک **render callback** register کنید که وقتی Angular rendering صفحه را تمام کرد اجرا شود.

```ts
@Component(/* ... */)
export class ProfilePhoto {
  constructor() {
    const elementRef = inject(ElementRef);
    afterEveryRender(() => {
      // Focus the first input element in this component.
      elementRef.nativeElement.querySelector('input')?.focus();
    });
  }
}
```

`afterEveryRender` و `afterNextRender` باید در یک _injection context_ فراخوانی شوند، معمولاً constructor یک کامپوننت.

**تا حد امکان از دستکاری مستقیم DOM پرهیز کنید.** همیشه ترجیح دهید ساختار DOM خود را در templateهای کامپوننت بیان کنید و آن DOM را با bindingها update کنید.

**render callbackها هرگز در طول server-side rendering یا build-time pre-rendering اجرا نمی‌شوند.**

**هرگز DOM را مستقیماً داخل lifecycle hookهای دیگر Angular دستکاری نکنید**. Angular تضمین نمی‌کند DOM یک کامپوننت در هیچ نقطه‌ای جز render callbackها کاملاً render شده باشد. علاوه بر این، خواندن یا modify کردن DOM در lifecycle hookهای دیگر می‌تواند با ایجاد [layout thrashing](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing)، performance صفحه را تحت تأثیر منفی قرار دهد.

## استفاده از renderer کامپوننت

کامپوننت‌ها می‌توانند instanceای از `Renderer2` را inject کنند تا بعضی DOM manipulationهایی را انجام دهند که به featureهای دیگر Angular گره خورده‌اند.

هر DOM elementای که توسط `Renderer2` یک کامپوننت ساخته شود، در [style encapsulation](guide/components/styling#style-scoping) همان کامپوننت شرکت می‌کند.

بعضی APIهای `Renderer2` همچنین به animation system در Angular وصل می‌شوند. می‌توانید از method مربوط به `setProperty` برای update کردن synthetic animation propertyها و از method مربوط به `listen` برای اضافه کردن event listener به synthetic animation eventها استفاده کنید. برای جزئیات، راهنمای [Animations](guide/animations) را ببینید.

جز این دو use case محدود، تفاوتی بین استفاده از `Renderer2` و DOM APIهای native وجود ندارد. APIهای `Renderer2` از DOM manipulation در contextهای server-side rendering یا build-time pre-rendering پشتیبانی نمی‌کنند.

## چه زمانی از DOM APIها استفاده کنیم

در حالی که Angular بیشتر دغدغه‌های rendering را مدیریت می‌کند، بعضی behaviorها ممکن است همچنان به DOM APIها نیاز داشته باشند. چند use case رایج:

- مدیریت focus مربوط به element
- اندازه‌گیری geometry مربوط به element، مثل استفاده از `getBoundingClientRect`
- خواندن text content مربوط به یک element
- راه‌اندازی observerهای native مثل [`MutationObserver`](https://developer.mozilla.org/docs/Web/API/MutationObserver)، [`ResizeObserver`](https://developer.mozilla.org/docs/Web/API/ResizeObserver)، یا [`IntersectionObserver`](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API).

از insert کردن، remove کردن و modify کردن DOM elementها پرهیز کنید. به طور خاص، **هرگز property مربوط به `innerHTML` یک element را مستقیماً set نکنید**، چون می‌تواند برنامه شما را در برابر [cross-site scripting (XSS) exploitها](https://developer.mozilla.org/docs/Glossary/Cross-site_scripting) آسیب‌پذیر کند. bindingهای template در Angular، شامل bindingهای مربوط به `innerHTML`، safeguardهایی دارند که به محافظت در برابر XSS attackها کمک می‌کنند. برای جزئیات، [راهنمای Security](best-practices/security) را ببینید.

