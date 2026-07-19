# Host elementهای component

TIP: این راهنما فرض می‌کند که قبلا [راهنمای Essentials](essentials) را خوانده‌اید. اگر با Angular تازه شروع کرده‌اید، اول آن را بخوانید.

Angular برای هر element از HTML که با selector یک component match شود، یک instance از آن component می‌سازد. element مربوط به DOM که با selector یک component match می‌شود، **host element** همان component است.
محتوای template یک component داخل host element آن render می‌شود.

```angular-ts
// Component source
@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo" />`,
})
export class ProfilePhoto {}
```

```angular-html
<!-- Using the component -->
<h3>Your profile photo</h3>
<profile-photo />
<button>Upload a new profile photo</button>
```

```angular-html
<!-- Rendered DOM -->
<h3>Your profile photo</h3>
<profile-photo>
  <img src="profile-photo.jpg" alt="Your profile photo" />
</profile-photo>
<button>Upload a new profile photo</button>
```

در مثال بالا، `<profile-photo>` همان host element مربوط به component به نام `ProfilePhoto` است.

## Binding به host element

یک component می‌تواند propertyها، attributeها، styleها و eventها را به host element خود bind کند. این کار دقیقا مانند binding روی elementهای داخل template component رفتار می‌کند، اما به‌جای template، با property مربوط به `host` در decorator مربوط به `@Component` تعریف می‌شود:

```angular-ts
@Component({
  ...,
  host: {
    'role': 'slider',
    '[attr.aria-valuenow]': 'value',
    '[class.active]': 'isActive()',
    '[style.background]' : `hasError() ? 'red' : 'green'`,
    '[tabIndex]': 'disabled ? -1 : 0',
    '(keydown)': 'updateValue($event)',
  },
})
export class CustomSlider {
  value: number = 0;
  disabled: boolean = false;
  isActive = signal(false);
  hasError = signal(false);
  updateValue(event: KeyboardEvent) { /* ... */ }

  /* ... */
}
```

NOTE: نام‌های target سراسری که می‌توانند به‌عنوان prefix برای نام event استفاده شوند عبارت‌اند از `document:`، `window:` و `body:`.

## Decoratorهای `@HostBinding` و `@HostListener`

همچنین می‌توانید با اعمال decoratorهای `@HostBinding` و `@HostListener` روی memberهای کلاس، به host element bind کنید.

`@HostBinding` اجازه می‌دهد host propertyها و attributeها را به propertyها و getterها bind کنید:

```ts
@Component({
  /* ... */
})
export class CustomSlider {
  @HostBinding('attr.aria-valuenow')
  value: number = 0;

  @HostBinding('tabIndex')
  get tabIndex() {
    return this.disabled ? -1 : 0;
  }

  /* ... */
}
```

`@HostListener` اجازه می‌دهد event listenerها را به host element bind کنید. این decorator یک نام event و یک آرایه اختیاری از argumentها می‌پذیرد:

```ts
export class CustomSlider {
  @HostListener('keydown', ['$event'])
  updateValue(event: KeyboardEvent) {
    /* ... */
  }
}
```

<docs-callout critical title="استفاده از property مربوط به `host` را به decoratorها ترجیح دهید">
  **همیشه استفاده از property مربوط به `host` را به `@HostBinding` و `@HostListener` ترجیح دهید.** این decoratorها فقط برای سازگاری با گذشته وجود دارند.
</docs-callout>

## برخورد bindingها

وقتی یک component را در template استفاده می‌کنید، می‌توانید bindingهایی به element مربوط به instance آن component اضافه کنید.
خود component هم ممکن است برای همان propertyها یا attributeها host binding تعریف کرده باشد.

```angular-ts
@Component({
  ...,
  host: {
    'role': 'presentation',
    '[id]': 'id',
  }
})
export class ProfilePhoto { /* ... */ }
```

```angular-html
<profile-photo role="group" [id]="otherId" />
```

در چنین حالت‌هایی، قوانین زیر مشخص می‌کنند کدام مقدار برنده می‌شود:

- اگر هر دو مقدار static باشند، binding مربوط به instance برنده می‌شود.
- اگر یکی از مقدارها static و دیگری dynamic باشد، مقدار dynamic برنده می‌شود.
- اگر هر دو مقدار dynamic باشند، host binding مربوط به component برنده می‌شود.

## استایل‌دهی با CSS custom propertyها

توسعه‌دهندگان اغلب برای فعال کردن پیکربندی منعطف styleهای component خود به [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties) تکیه می‌کنند.
می‌توانید چنین custom propertyهایی را با یک [style binding](guide/templates/binding#css-style-properties) روی host element تنظیم کنید.

```angular-ts
@Component({
  /* ... */
  host: {
    '[style.--my-background]': 'color()',
  },
})
export class MyComponent {
  color = signal('lightgreen');
}
```

در این مثال، CSS custom property به نام `--my-background` به Signal مربوط به `color` bind شده است. مقدار custom property هر بار که Signal مربوط به `color` تغییر کند، به‌صورت خودکار update می‌شود. این تغییر روی component فعلی و همه childهای آن که به این custom property تکیه دارند اثر می‌گذارد.

### تنظیم custom propertyها روی componentهای child

همچنین می‌توان با یک [style binding](guide/templates/binding#css-style-properties)، CSS custom propertyها را روی host element مربوط به componentهای child تنظیم کرد.

```angular-ts
@Component({
  selector: 'my-component',
  template: `<my-child [style.--my-background]="color()" />`,
})
export class MyComponent {
  color = signal('lightgreen');
}
```

## Inject کردن attributeهای host element

Componentها و directiveها می‌توانند attributeهای static را از host element خود، با استفاده از `HostAttributeToken` همراه با تابع [`inject`](api/core/inject)، بخوانند.

```ts
import { Component, HostAttributeToken, inject } from '@angular/core';

@Component({
  selector: 'app-button',
  ...,
})
export class Button {
  variation = inject(new HostAttributeToken('variation'));
}
```

```angular-html
<app-button variation="primary">Click me</app-button>
```

HELPFUL: اگر attribute وجود نداشته باشد، `HostAttributeToken` خطا throw می‌کند، مگر اینکه injection به‌عنوان optional علامت‌گذاری شده باشد.
