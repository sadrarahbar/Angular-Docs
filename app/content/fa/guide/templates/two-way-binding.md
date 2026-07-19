# Two-way binding

**Two-way binding** یک shorthand است برای اینکه هم‌زمان یک مقدار را داخل یک element bind کنید و به همان element هم توانایی بدهید تغییرات را از طریق همان binding به عقب propagate کند.

## Syntax

Syntax مربوط به two-way binding ترکیبی از square bracket و parenthesis است: `[()]`. این syntax، syntax مربوط به property binding یعنی `[]` و syntax مربوط به event binding یعنی `()` را ترکیب می‌کند. جامعه Angular به‌صورت غیررسمی به این syntax می‌گوید "banana-in-a-box".

## Two-way binding با form controlها

توسعه‌دهندگان معمولا از two-way binding استفاده می‌کنند تا داده component هنگام تعامل کاربر با یک form control، با آن control sync بماند. مثلا وقتی کاربر یک text input را پر می‌کند، باید state داخل component update شود.

مثال زیر attribute مربوط به `firstName` را به‌صورت dynamic روی page update می‌کند:

```angular-ts
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  imports: [FormsModule],
  template: `
    <main>
      <h2>Hello {{ firstName }}!</h2>
      <input type="text" [(ngModel)]="firstName" />
    </main>
  `,
})
export class App {
  firstName = 'Ada';
}
```

برای استفاده از two-way binding با form controlهای بومی، باید:

1. `FormsModule` را از `@angular/forms` import کنید
1. directive مربوط به `ngModel` را با syntax مربوط به two-way binding استفاده کنید، مثل `[(ngModel)]`
1. stateای را که می‌خواهید update شود به آن assign کنید، مثل `firstName`

بعد از این setup، Angular مطمئن می‌شود هر update در text input به‌درستی داخل state مربوط به component منعکس شود.

در مستندات رسمی، درباره [`NgModel`](/api/forms/NgModel) بیشتر یاد بگیرید.

## Two-way binding بین componentها

استفاده از two-way binding بین component والد و child نسبت به form elementها configuration بیشتری لازم دارد.

در این مثال، `App` مسئول تنظیم state اولیه count است، اما logic مربوط به update و render کردن UI برای counter عمدتا داخل child آن یعنی `Counter` قرار دارد.

```angular-ts {header: 'app.ts'}
import {Component} from '@angular/core';
import {Counter} from './counter';

@Component({
  selector: 'app-root',
  imports: [Counter],
  template: `
    <main>
      <h1>Counter: {{ initialCount }}</h1>
      <app-counter [(count)]="initialCount"></app-counter>
    </main>
  `,
})
export class App {
  initialCount = 18;
}
```

```angular-ts {header: 'counter.ts'}
import {Component, model} from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <button (click)="updateCount(-1)">-</button>
    <span>{{ count() }}</span>
    <button (click)="updateCount(+1)">+</button>
  `,
})
export class Counter {
  count = model<number>(0);

  updateCount(amount: number): void {
    this.count.update((currentCount) => currentCount + amount);
  }
}
```

### فعال کردن two-way binding بین componentها

اگر مثال بالا را به core آن بشکنیم، هر two-way binding برای componentها به موارد زیر نیاز دارد:

Component child باید یک property از نوع `model` داشته باشد.

یک مثال ساده‌شده:

```angular-ts {header: 'counter.ts'}
import {Component, model} from '@angular/core';

@Component({
  /* Omitted for brevity */
})
export class Counter {
  count = model<number>(0);

  updateCount(amount: number): void {
    this.count.update((currentCount) => currentCount + amount);
  }
}
```

Component والد باید:

1. نام property مربوط به `model` را در syntax مربوط به two-way binding قرار دهد.
1. یک property یا یک Signal را به property مربوط به `model` assign کند.

یک مثال ساده‌شده:

```angular-ts {header: 'app.ts'}
import {Component} from '@angular/core';
import {Counter} from './counter';

@Component({
  selector: 'app-root',
  imports: [Counter],
  template: `
    <main>
      <app-counter [(count)]="initialCount"></app-counter>
    </main>
  `,
})
export class App {
  initialCount = 18;
}
```
