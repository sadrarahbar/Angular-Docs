# تبدیل کاربرد CommonModule به importهای standalone

این مهاجرت با افزودن حداقل مجموعه directiveها و pipeهای موردنیاز هر template (برای مثال `NgIf`،‏ `NgFor`،‏ `AsyncPipe` و غیره)، به پروژه‌ها کمک می‌کند importهای `CommonModule` را از componentها حذف کنند.

schematic را با دستور زیر اجرا کنید:

```shell
ng generate @angular/core:common-to-standalone
```

## گزینه‌ها

| گزینه  | جزئیات                                                                                                                                 |
| :----- | :------------------------------------------------------------------------------------------------------------------------------------- |
| `path` | مسیر مهاجرت نسبت به ریشه پروژه. مقدار پیش‌فرض `./` است. با آن می‌توانید بخشی از پروژه را تدریجی مهاجرت دهید.                            |

## مثال

پیش از مهاجرت:

```angular-ts
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-example',
  imports: [CommonModule],
  template: `
    <div *ngIf="show">
      {{ data | async | json }}
    </div>
  `,
})
export class Example {
  show = true;
  data = Promise.resolve({message: 'Hello'});
}
```

پس از اجرای مهاجرت (importهای component اضافه و CommonModule حذف شده‌اند):

```angular-ts
import {Component} from '@angular/core';
import {AsyncPipe, JsonPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-example',
  imports: [AsyncPipe, JsonPipe, NgIf],
  template: `
    <div *ngIf="show">
      {{ data | async | json }}
    </div>
  `,
})
export class Example {
  show = true;
  data = Promise.resolve({message: 'Hello'});
}
```
