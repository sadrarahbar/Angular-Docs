# مهاجرت RouterTestingModule

این schematic کاربردهای `RouterTestingModule` را در تست‌ها به `RouterModule` مهاجرت می‌دهد.

وقتی تست `SpyLocation` را از `@angular/common/testing` import کند و از property مربوط به `urlChanges` استفاده کند، schematic برای حفظ رفتار قبلی `provideLocationMocks()` را نیز اضافه می‌کند.

schematic را با دستور زیر اجرا کنید:

```shell
ng generate @angular/core:router-testing-module-migration
```

## گزینه‌ها

| گزینه  | جزئیات                                                                                                                                 |
| :----- | :------------------------------------------------------------------------------------------------------------------------------------- |
| `path` | مسیر مهاجرت نسبت به ریشه پروژه. مقدار پیش‌فرض `./` است. با آن می‌توانید بخشی از پروژه را تدریجی مهاجرت دهید.                            |

## مثال‌ها

### حفظ گزینه‌های router

پیش از مهاجرت:

```ts
import {RouterTestingModule} from '@angular/router/testing';
import {SpyLocation} from '@angular/common/testing';

describe('test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes, {initialNavigation: 'enabledBlocking'})],
    });
  });
});
```

پس از مهاجرت:

```ts
import {RouterModule} from '@angular/router';
import {SpyLocation} from '@angular/common/testing';

describe('test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes, {initialNavigation: 'enabledBlocking'})],
    });
  });
});
```

### افزودن provideLocationMocks هنگام import شدن `SpyLocation` و استفاده از `urlChanges`

پیش از مهاجرت:

```ts
import {RouterTestingModule} from '@angular/router/testing';
import {SpyLocation} from '@angular/common/testing';

describe('test', () => {
  let spy: SpyLocation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    spy = TestBed.inject(SpyLocation);
  });

  it('Awesome test', () => {
    expect(spy.urlChanges).toBeDefined();
  });
});
```

پس از مهاجرت:

```ts
import {RouterModule} from '@angular/router';
import {provideLocationMocks} from '@angular/common/testing';
import {SpyLocation} from '@angular/common/testing';

describe('test', () => {
  let spy: SpyLocation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule],
      providers: [provideLocationMocks()],
    });
    spy = TestBed.inject(SpyLocation);
  });

  it('Awesome test', () => {
    expect(spy.urlChanges).toBeDefined();
  });
});
```
