# Testing serviceها

serviceها معمولاً business logic برنامه شما را نگه می‌دارند؛ logicای که کامپوننت‌ها به آن وابسته‌اند. testing serviceها بررسی می‌کند که logic به صورت isolated، مستقل از هر کامپوننت یا template، درست کار می‌کند.

این راهنما از [Vitest](https://vitest.dev/) استفاده می‌کند که پروژه‌های Angular CLI به صورت پیش‌فرض آن را دارند. برای اطلاعات بیشتر درباره setup مربوط به testing، [راهنمای overview testing](guide/testing#set-up-for-testing) را ببینید.

## Testing یک service

یک service به نام `Calculator` را در نظر بگیرید که عملیات ساده حسابی انجام می‌دهد:

```ts { header: 'calculator.ts' }
import {Service} from '@angular/core';

@Service()
export class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }
}
```

برای test کردن این service، یک `TestBed` configure کنید؛ `TestBed` ابزار testing در Angular برای ساختن یک محیط test isolated برای هر test است. این ابزار dependency injection را setup می‌کند و به شما اجازه می‌دهد instanceهای service را بگیرید، یعنی شبیه‌سازی می‌کند Angular در یک برنامه واقعی چطور چیزها را به هم وصل می‌کند.

```ts { header: 'calculator.spec.ts' }
import {TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it} from 'vitest';
import {Calculator} from './calculator';

describe('Calculator', () => {
  let service: Calculator;

  beforeEach(() => {
    // Injects the Calculator service which is available to Angular
    // because the service uses `providedIn: 'root'`
    service = TestBed.inject(Calculator);
  });

  it('adds two numbers', () => {
    expect(service.add(1, 2)).toBe(3);
  });

  it('subtracts two numbers', () => {
    expect(service.subtract(5, 3)).toBe(2);
  });
});
```

در مثال بالا، block مربوط به `beforeEach` پیش از هر test یک instance تازه از service را inject می‌کند. این کار مطمئن می‌کند هر test به صورت isolated اجرا می‌شود و هیچ stateای از testهای قبلی نشت نمی‌کند.

## Testing serviceها با dependency

بیشتر serviceها برای درست کار کردن به serviceهای دیگر وابسته‌اند. به صورت پیش‌فرض، `TestBed` implementationهای واقعی این dependencyها را فراهم می‌کند؛ یعنی testهای شما همان code pathهای واقعی برنامه را اجرا می‌کنند. اما گاهی یک dependency ممکن است پیچیده، کند یا غیرقابل‌پیش‌بینی باشد. در این موارد می‌توانید آن را با یک جایگزین کنترل‌شده عوض کنید.

یک service به نام `OrderTotal` را در نظر بگیرید که برای محاسبه قیمت نهایی یک order به `TaxCalculator` وابسته است:

```ts { header: 'tax-calculator.ts' }
import {Service} from '@angular/core';

@Service()
export class TaxCalculator {
  calculate(subtotal: number): number {
    return subtotal * 0.05;
  }
}
```

```ts { header: 'order-total.ts' }
import {inject, Service} from '@angular/core';
import {TaxCalculator} from './tax-calculator';

@Service()
export class OrderTotal {
  private taxCalculator = inject(TaxCalculator);

  total(subtotal: number): number {
    return subtotal + this.taxCalculator.calculate(subtotal);
  }
}
```

در این مثال، `OrderTotal` از `inject()` استفاده می‌کند تا `TaxCalculator` را از سیستم dependency injection در Angular درخواست کند. به صورت پیش‌فرض، `TestBed` همان `TaxCalculator` واقعی را فراهم می‌کند که برای محاسبه‌های ساده‌ای مثل این عالی است. اما اگر `TaxCalculator` شامل logic پیچیده، network request یا نتیجه‌های غیرقابل‌پیش‌بینی بود، احتمالاً می‌خواستید آن را با یک جایگزین کنترل‌شده عوض کنید.

### جایگزین کردن dependency با stub

stub راهی برای جایگزین کردن یک dependency یا method با چیزی است که مقدارهای قابل‌پیش‌بینی برمی‌گرداند؛ این کار می‌تواند بررسی نتیجه test را ساده‌تر کند.

برای test کردن `OrderTotal` بدون تکیه بر `TaxCalculator` واقعی، می‌توانید یک stub در configuration مربوط به `TestBed` فراهم کنید.

```ts { header: 'order-total.spec.ts' }
import {TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it, vi, type Mocked} from 'vitest';
import {OrderTotal} from './order-total';
import {TaxCalculator} from './tax-calculator';

// Vitest's `Mocked` utility type ensures the stub is type-safe,
// while `vi.fn()` creates a mock function for each method
const taxCalculatorStub: Mocked<TaxCalculator> = {
  calculate: vi.fn(),
};

describe('OrderTotal', () => {
  let service: OrderTotal;

  beforeEach(() => {
    // `mockReturnValue` sets a controlled return value for the stub
    taxCalculatorStub.calculate.mockReturnValue(5);

    TestBed.configureTestingModule({
      // The `providers` array accepts a provider object where `provide`
      // specifies the dependency to replace and `useValue` defines the stub
      providers: [{provide: TaxCalculator, useValue: taxCalculatorStub}],
    });
    service = TestBed.inject(OrderTotal);
  });

  it('adds tax to the subtotal', () => {
    expect(service.total(100)).toBe(105);
  });
});
```

با این stub، هر زمان `OrderTotal` درخواست `TaxCalculator` کند، `TestBed` می‌داند باید به جای آن از `taxCalculatorStub` استفاده کند. چون stub همیشه 5 برمی‌گرداند، test بررسی می‌کند که `OrderTotal` مقدار tax را درست به subtotal اضافه می‌کند، بدون توجه به اینکه rate مربوط به tax در `TaxCalculator` تغییر کند یا نه.

### بررسی interactionها با spyها

stub چیزی را که یک dependency برمی‌گرداند کنترل می‌کند، اما گاهی لازم است بررسی کنید یک service، dependency خود را با argumentهای درست فراخوانی کرده است. این کار با spyها انجام می‌شود؛ spyها دنبال می‌کنند یک function چطور فراخوانی شده است. در Vitest این قابلیت داخل `vi.fn()` وجود دارد و اجازه می‌دهد interaction بین serviceها را assert کنید.

```ts { header: 'order-total.spec.ts' }
import {TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it, vi, type Mocked} from 'vitest';
import {OrderTotal} from './order-total';
import {TaxCalculator} from './tax-calculator';

const taxCalculatorStub: Mocked<TaxCalculator> = {
  calculate: vi.fn(),
};

describe('OrderTotal', () => {
  let service: OrderTotal;

  beforeEach(() => {
    taxCalculatorStub.calculate.mockReturnValue(5);

    TestBed.configureTestingModule({
      providers: [{provide: TaxCalculator, useValue: taxCalculatorStub}],
    });
    service = TestBed.inject(OrderTotal);
  });

  afterEach(() => {
    taxCalculatorStub.calculate.mockClear();
  });

  it('adds tax to the subtotal', () => {
    expect(service.total(100)).toBe(105);
  });

  // Verify the interaction with a spy
  it('calls the tax calculator', () => {
    service.total(100);
    expect(taxCalculatorStub.calculate).toHaveBeenCalledExactlyOnceWith(100);
  });
});
```

test جدید بررسی می‌کند که `OrderTotal` هنگام محاسبه total، `TaxCalculator.calculate` را فراخوانی کرده است. این کار زمانی مفید است که می‌خواهید مطمئن شوید interaction بین serviceها درست اتفاق افتاده است.

## Testing serviceهای HTTP

بسیاری از serviceها از `HttpClient` در Angular برای گرفتن data از server استفاده می‌کنند. Angular ابزارهای testing اختصاصی برای `HttpClient` ارائه می‌کند که به شما اجازه می‌دهند responseهای HTTP را بدون network request واقعی کنترل کنید.

برای جزئیات درباره testing serviceهایی که از `HttpClient` استفاده می‌کنند، [راهنمای HTTP testing](guide/http/testing) را ببینید.
