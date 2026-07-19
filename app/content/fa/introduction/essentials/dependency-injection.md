<docs-decorative-header title="Dependency Injection" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->
کد را reuse کنید و behaviorها را در سراسر برنامه و testهای خود کنترل کنید.
</docs-decorative-header>

وقتی لازم است logic را بین کامپوننت‌ها به اشتراک بگذارید، Angular از الگوی طراحی [dependency injection](guide/di) استفاده می‌کند. این الگو به شما اجازه می‌دهد یک «service» بسازید تا بتوانید کد را به کامپوننت‌ها inject کنید و در عین حال آن را از یک منبع واحد مدیریت کنید.

## serviceها چه هستند؟

serviceها بخش‌های قابل استفاده مجددی از کد هستند که می‌توانند inject شوند.

serviceها هم مشابه تعریف یک کامپوننت، از بخش‌های زیر تشکیل می‌شوند:

- یک **TypeScript decorator** که class را از طریق `@Service` به عنوان یک service در Angular اعلام می‌کند و اجازه می‌دهد serviceای تعریف کنید که در هر جای برنامه قابل دسترسی باشد.
- یک **TypeScript class** که کد مورد نظر را تعریف می‌کند؛ کدی که وقتی service inject می‌شود در دسترس خواهد بود.

این نمونه‌ای از service به نام `Calculator` است.

```angular-ts
import {Service} from '@angular/core';

@Service()
export class Calculator {
  add(x: number, y: number) {
    return x + y;
  }
}
```

## چطور از یک service استفاده کنیم

وقتی می‌خواهید از یک service در کامپوننت استفاده کنید، باید:

1. service را import کنید.
2. یک field در class تعریف کنید که service در آن inject شود. این field را برابر با نتیجه فراخوانی تابع داخلی [`inject`](/api/core/inject) قرار دهید؛ تابعی که service را ایجاد می‌کند.

در کامپوننت `Receipt` ممکن است چیزی شبیه این باشد:

```angular-ts
import {Component, inject} from '@angular/core';
import {Calculator} from './calculator';

@Component({
  selector: 'app-receipt',
  template: `<h1>The total is {{ totalCost }}</h1>`,
})
export class Receipt {
  private calculator = inject(Calculator);
  totalCost = this.calculator.add(50, 25);
}
```

در این مثال، `Calculator` با فراخوانی تابع Angular یعنی [`inject`](/api/core/inject) و پاس دادن service به آن استفاده می‌شود.

## قدم بعدی

<docs-pill-row>
  <docs-pill title="قدم‌های بعدی پس از Essentials" href="essentials/next-steps" />
  <docs-pill title="راهنمای عمیق Dependency Injection" href="guide/di" />
</docs-pill-row>

