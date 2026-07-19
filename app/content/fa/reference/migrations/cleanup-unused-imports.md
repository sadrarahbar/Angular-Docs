# پاک‌سازی importهای استفاده‌نشده

از نسخه 19 به بعد، Angular زمانی گزارش می‌دهد که آرایه `imports` یک کامپوننت شامل symbolهایی باشد که در template آن استفاده نشده‌اند.

اجرای این schematic همه importهای استفاده‌نشده داخل پروژه را پاک‌سازی می‌کند.

schematic را با command زیر اجرا کنید:

```shell
ng generate @angular/core:cleanup-unused-imports
```

#### قبل

```angular-ts
import {Component} from '@angular/core';
import {UnusedDirective} from './unused';

@Component({
  template: 'Hello',
  imports: [UnusedDirective],
})
export class MyComp {}
```

#### بعد

```angular-ts
import {Component} from '@angular/core';

@Component({
  template: 'Hello',
  imports: [],
})
export class MyComp {}
```

