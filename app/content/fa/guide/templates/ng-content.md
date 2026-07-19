# render کردن templateها از کامپوننت parent با `ng-content`

`<ng-content>` یک element ویژه است که markup یا یک template fragment را می‌پذیرد و کنترل می‌کند کامپوننت‌ها چطور content را render کنند. این element یک DOM element واقعی render نمی‌کند.

این نمونه‌ای از کامپوننت `BaseButton` است که هر markupای را از parent خود می‌پذیرد.

```angular-ts {header:'base-button/base-button.ts'}
import {Component} from '@angular/core';

@Component({
  selector: 'button[baseButton]',
  template: `<ng-content />`,
})
export class BaseButton {}
```

```angular-ts {header:'app.ts'}
import {Component} from '@angular/core';
import {BaseButton} from './base-button';

@Component({
  selector: 'app-root',
  imports: [BaseButton],
  template: `<button baseButton>Next <span class="icon arrow-right"></span></button>`,
})
export class App {}
```

برای جزئیات بیشتر، [راهنمای عمیق `<ng-content>`](/guide/components/content-projection) را ببینید تا روش‌های دیگر استفاده از این pattern را هم یاد بگیرید.

