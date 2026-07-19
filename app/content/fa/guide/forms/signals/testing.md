# تست کردن Signal Forms

Formها اغلب برای applicationها حیاتی هستند و testing به شما اطمینان می‌دهد با تغییر codebase، درست رفتار می‌کنند. Signal Forms بیشتر logic خود را به‌جای template در schema نگه می‌دارد؛ یعنی می‌توانید بخش عمده رفتار form را بدون render کردن component تست کنید.

این راهنما توضیح می‌دهد چطور این testها را setup کنید؛ از isolated logic testها شروع می‌کند و سپس component-bound testها را برای مواردی پوشش می‌دهد که DOM interaction اهمیت دارد.

## تست form logic به‌صورت isolated

وقتی فقط لازم دارید validation، disabled state، required state یا error output را verify کنید، به‌جای render کردن component، خود form را مستقیم تست کنید. Testهای isolated، setup را کوچک نگه می‌دارند و اجازه می‌دهند test روی رفتار form تمرکز کند.

Requirement کلیدی injector است. Signal Forms هنگام ساخت form به injection context نیاز دارد. اگر یک test بدون آن `form()` را call کند، call قبل از اینکه test بتواند چیزی درباره form assert کند throw می‌کند.

مستقیم‌ترین راه برای برآورده کردن این requirement، پاس دادن صریح injector است. Test زیر formای با rule مربوط به `required` می‌سازد و verify می‌کند field بعد از دریافت value، valid می‌شود:

```ts {header: 'profile-form.spec.ts'}
import {Injector, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {form, required} from '@angular/forms/signals';
import {describe, expect, it} from 'vitest';

describe('profile form', () => {
  it('marks required fields as invalid until they have a value', () => {
    const model = signal({name: ''});

    const profileForm = form(
      model,
      (path) => {
        required(path.name);
      },
      {injector: TestBed.inject(Injector)},
    );

    expect(profileForm.name().valid()).toBe(false);
    expect(profileForm.name().errors()).toEqual([expect.objectContaining({kind: 'required'})]);

    profileForm.name().value.set('Ada');

    expect(profileForm.name().valid()).toBe(true);
    expect(profileForm.name().errors()).toEqual([]);
  });
});
```

این pattern برای بیشتر isolated testها خوب کار می‌کند، چون injector requirement در محل call قابل مشاهده می‌ماند. همچنین شبیه روشی است که unit testهای Signal Forms در source خود Angular form می‌سازند.

وقتی کدی که test می‌کنید به‌صورت داخلی `form()` را call می‌کند، ممکن است نتوانید injector را مستقیم پاس دهید. در این حالت، call را داخل یک ambient injection context wrap کنید:

```ts {header: 'profile-form.spec.ts'}
import {signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {form, required} from '@angular/forms/signals';
import {describe, expect, it} from 'vitest';

describe('profile form', () => {
  it('can create a form inside an injection context', () => {
    const model = signal({name: ''});

    TestBed.runInInjectionContext(() => {
      const profileForm = form(model, (path) => {
        required(path.name);
      });

      expect(profileForm.name().valid()).toBe(false);
    });
  });
});
```

هر دو pattern یک نوع form تولید می‌کنند. وقتی test خودش form را مستقیم می‌سازد، پاس دادن `{injector}` اغلب روشن‌ترین انتخاب است. `TestBed.runInInjectionContext()` وقتی مفید است که کد تحت test، `form()` را به‌صورت داخلی call می‌کند و شما باید injection context اطراف را فراهم کنید.

وقتی form ساخته شد، آن را از طریق field state signalها تست کنید. Assertionهای رایج شامل `valid()`، `invalid()`، `disabled()`، `required()` و `errors()` هستند. برای بیشتر form logicها همین کافی است تا behavior را بدون درگیر کردن DOM verify کنید.

## تست form با چند rule

بعد از اینکه injector setup آماده شد، قدم خوب بعدی یک test کامل است که چند بخش form logic را با هم exercise کند. این نوع test همچنان isolated است، اما خیلی نزدیک‌تر به یک application form واقعی به نظر می‌رسد.

برای مثال، این test هم یک basic required rule و هم یک conditional required rule را verify می‌کند که به field دیگری وابسته است:

```ts {header: 'profile-form.spec.ts'}
import {Injector, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {form, required} from '@angular/forms/signals';
import {describe, expect, it} from 'vitest';

describe('profile form', () => {
  it('updates validation state when related fields change', () => {
    const model = signal({
      name: '',
      age: 5,
    });

    const profileForm = form(
      model,
      (path) => {
        required(path.name);
        required(path.name, {
          error: (ctx) => ({kind: `required-${ctx.valueOf(path.age)}`}),
          when: ({valueOf}) => valueOf(path.age) > 10,
        });
      },
      {injector: TestBed.inject(Injector)},
    );

    expect(profileForm.name().invalid()).toBe(true);
    expect(profileForm.name().errors()).toEqual([expect.objectContaining({kind: 'required'})]);

    profileForm.age().value.set(15);

    expect(profileForm.name().errors()).toEqual([
      expect.objectContaining({kind: 'required'}),
      expect.objectContaining({kind: 'required-15'}),
    ]);

    profileForm.name().value.set('Ada');

    expect(profileForm.name().valid()).toBe(true);
    expect(profileForm.name().errors()).toEqual([]);
  });
});
```

این مثال یک testing pattern مهم را نشان می‌دهد: یک field را update کنید، سپس state field دیگری را assert کنید. چون ruleهای Signal Forms reactive هستند، validation یک field می‌تواند به sibling valueها، parent valueها یا conditionهای derived دیگر وابسته باشد. Testها باید این relationها را مستقیم verify کنند، نه اینکه فقط field تغییرکرده را بررسی کنند.

برای testهای validation-focused، `errors()` معمولا مفیدترین assertion است. `valid()` و `invalid()` به شما می‌گویند field در حال حاضر validation را pass می‌کند یا نه، اما `errors()` نشان می‌دهد کدام rule failure را تولید کرده است. این موضوع وقتی field چند validator یا rule شرطی دارد به‌خصوص مفید می‌شود.

همین ساختار برای بیشتر form testهای روزمره کار می‌کند:

1. یک model signal با کوچک‌ترین shapeای بسازید که behavior را reproduce می‌کند.
1. Form را با injector explicit بسازید.
1. Initial field state را assert کنید.
1. یک field را با `.value.set(...)` تغییر دهید، از جمله sibling fieldها وقتی cross-field ruleها را تست می‌کنید.
1. State signalهای به‌روزشده، معمولا `errors()`، `valid()` یا `invalid()`، را assert کنید.

وقتی test درباره schema behavior است نه rendering، این سبک isolated را default قرار دهید. از component test سریع‌تر است و وقتی behavior تغییر می‌کند، دیدن اینکه کدام rule مسئول است را آسان‌تر می‌کند.

## تست formهای bind شده به component

وقتی لازم دارید behavior وابسته به template bindingها، user interaction از طریق `dispatchEvent`، یا custom form controlهایی را verify کنید که rendering خودشان را مدیریت می‌کنند، isolated test کافی نیست. به component-bound test نیاز دارید تا template render شود و بتوانید با DOM elementهای واقعی تعامل کنید.

### Setup یک component test

Component-bound testها component را render می‌کنند تا بتوانید با DOM elementهای واقعی تعامل کنید. Component را با `TestBed.createComponent()` بسازید و قبل از assert کردن، منتظر کامل شدن rendering بمانید:

```angular-ts {header: 'profile-form.ts'}
import {Component, signal} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';

@Component({
  selector: 'app-profile-form',
  imports: [FormField],
  template: `<input [formField]="profileForm.name" />`,
})
export class ProfileForm {
  readonly model = signal({name: 'Ada'});
  readonly profileForm = form(this.model, (path) => {
    required(path.name);
  });
}
```

```ts {header: 'profile-form.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {describe, expect, it} from 'vitest';
import {ProfileForm} from './profile-form';

describe('ProfileForm', () => {
  it('reflects model values in the DOM and updates the model on user input', async () => {
    const fixture = TestBed.createComponent(ProfileForm);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    // Model → View: the input reflects the model's initial value
    expect(input.value).toBe('Ada');

    // View → Model: simulate the user clearing the field
    input.value = '';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(fixture.componentInstance.profileForm.name().value()).toBe('');
    expect(fixture.componentInstance.profileForm.name().valid()).toBe(false);
  });
});
```

توجه کنید component از `form()` بدون injector explicit استفاده می‌کند، چون injection context خود component آن را به‌صورت خودکار فراهم می‌کند. بعد از هر change، `await fixture.whenStable()` منتظر کامل شدن rendering و effectها می‌ماند و سپس assertion انجام می‌شود.

همین pattern برای async operationها مثل async validatorها یا server callها هم کار می‌کند. بعد از resolve شدن async work، `await fixture.whenStable()` را call کنید.

## چه زمانی از هر رویکرد استفاده کنیم

| What you need to verify                              | Approach        |
| ---------------------------------------------------- | --------------- |
| Validation ruleها، `errors()`، `valid()`، `invalid()` | Isolated        |
| Disabled، required یا readonly state                 | Isolated        |
| Cross-field reactive dependencyها                    | Isolated        |
| Conditional schemaها (`applyWhen`, `applyWhenValue`) | Isolated        |
| Render شدن input valueها در DOM                      | Component-bound |
| Update شدن model با تایپ کاربر                       | Component-bound |
| Custom form controlهایی با templateهای خودشان        | Component-bound |
| Focus management یا accessibility attributeها        | Component-bound |

بیشتر formها فقط به isolated test نیاز دارند. Logic مربوط به form، مثل validation، disabled state و cross-field ruleها، در schema زندگی می‌کند و schemaها برای اجرا به template نیاز ندارند. Component-bound testها زمانی ارزش اضافه می‌کنند که behavior مورد نظر شما از مرز بین form و DOM عبور کند.

## قدم بعدی

این راهنما تست Signal Forms را به‌صورت isolated و همراه با component templateها پوشش داد. این‌ها راهنماهای مرتبطی هستند که جنبه‌های دیگر Signal Forms را بررسی می‌کنند:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/validation" title="Validation" />
  <docs-pill href="guide/forms/signals/field-state-management" title="مدیریت field state" />
  <docs-pill href="guide/forms/signals/form-submission" title="Form submission" />
</docs-pill-row>
