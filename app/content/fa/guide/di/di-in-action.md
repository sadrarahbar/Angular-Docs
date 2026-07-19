# DI در عمل

این راهنما قابلیت‌های اضافه dependency injection یا DI در Angular را بررسی می‌کند.

NOTE: برای پوشش جامع InjectionToken و custom providerها، [راهنمای defining dependency providers](guide/di/defining-dependency-providers#injection-tokens) را ببینید.

## Inject کردن DOM element مربوط به component

با اینکه توسعه‌دهندگان معمولا از آن پرهیز می‌کنند، بعضی visual effectها و third-party toolها نیاز دارند مستقیم به DOM دسترسی داشته باشید.
در چنین حالت‌هایی، ممکن است لازم باشد به DOM element مربوط به یک component دسترسی پیدا کنید.

Angular DOM element زیرین یک `@Component` یا `@Directive` را از طریق injection و با token مربوط به `ElementRef` expose می‌کند:

```ts {highlight:[7]}
import {Directive, ElementRef, inject} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  private element = inject(ElementRef);

  update() {
    this.element.nativeElement.style.color = 'red';
  }
}
```

## Inject کردن tag name مربوط به host element

برای گرفتن tag name مربوط به host element، آن را با token مربوط به `HOST_TAG_NAME` inject کنید.

```ts
import {Directive, HOST_TAG_NAME, inject} from '@angular/core';

@Directive({
  selector: '[roleButton]',
})
export class RoleButtonDirective {
  private tagName = inject(HOST_TAG_NAME);

  onAction() {
    switch (this.tagName) {
      case 'button':
        // Handle button action
        break;
      case 'a':
        // Handle anchor action
        break;
      default:
        // Handle other elements
        break;
    }
  }
}
```

NOTE: اگر host element ممکن است tag name نداشته باشد، مثلا `ng-container` یا `ng-template`، injection را optional کنید.

## Resolve کردن circular dependencyها با forward reference

در TypeScript، ترتیب class declarationها اهمیت دارد.
نمی‌توانید پیش از تعریف یک class، مستقیم به آن reference دهید.

این معمولا مشکل نیست، به‌خصوص اگر rule پیشنهادی _یک class در هر فایل_ را رعایت کنید.
اما در بعضی حالت‌ها، circular referenceها اجتناب‌ناپذیرند.
مثلا اگر class به نام 'A' به class به نام 'B' اشاره کند و class 'B' به class 'A' اشاره کند، یکی از آن‌ها باید اول تعریف شود.

تابع `forwardRef()` در Angular یک reference _غیرمستقیم_ می‌سازد که Angular می‌تواند بعدا resolve کند.

وقتی یک class _به خودش reference_ می‌دهد هم با مسئله مشابهی روبه‌رو هستید.
مثلا در array مربوط به `providers` خودش.
Array مربوط به `providers` یک property از decorator function مربوط به `@Component()` است که باید پیش از class definition ظاهر شود.
چنین circular referenceهایی را می‌توان با `forwardRef` resolve کرد.

```typescript {header: 'app.component.ts', highlight: [4]}
providers: [
  {
    provide: PARENT_MENU_ITEM,
    useExisting: forwardRef(() => MenuItem),
  },
],
```
