# Cross-field logic

**Cross-field logic** زمانی لازم است که هر rule، validation یا behavior مربوط به یک field به value یا state مربوط به field دیگری وابسته باشد.

Signal forms برای هر rule function یک **field context** فراهم می‌کند. Field context دسترسی به value و state مربوط به field فعلی را فراهم می‌کند و اجازه می‌دهد با استفاده از `valueOf()`، `stateOf()` و `fieldTreeOf()` fieldهای دیگر form را بخوانید.

این راهنما field context API را عمیق‌تر پوشش می‌دهد و patternهای رایج cross-field را نشان می‌دهد. برای validation روی fieldهای تکی، [راهنمای Validation](/guide/forms/signals/validation) را ببینید.

## درک field context

هر rule function در signal forms یک parameter از نوع **field context** دریافت می‌کند؛ objectای که field فعلی را توصیف می‌کند و دسترسی به بقیه form را فراهم می‌کند.

برای field فعلی، به سه property دسترسی دارید:

| Property    | Type                 | Description                                                                 |
| ----------- | -------------------- | --------------------------------------------------------------------------- |
| `value`     | `Signal<TValue>`     | Value فعلی field به‌عنوان signal                                            |
| `state`     | `FieldState<TValue>` | State فعلی field، مثل validity، errors، touched و dirty                     |
| `fieldTree` | `FieldTree<TValue>`  | Tree مربوط به field فعلی، برای دسترسی programmatic به child fieldها        |

برای cross-field logic، سه property زیر اجازه می‌دهند به بخش‌های دیگر form دسترسی داشته باشید:

| Property        | Type                           | Description                                                                                                      |
| --------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `valueOf()`     | `(path) => PValue`             | رایج‌ترین مورد. وقتی برای comparison یا calculation به raw value یک field دیگر نیاز دارید استفاده کنید.          |
| `stateOf()`     | `(path) => FieldState<PValue>` | وقتی logic شما به state یک field دیگر وابسته است، مثل valid، touched یا dirty بودن آن، استفاده کنید.             |
| `fieldTreeOf()` | `(path) => FieldTree<PModel>`  | وقتی به دسترسی programmatic به tree یک field دیگر نیاز دارید، مثلا push کردن errorها به child field مشخص با validateTree، استفاده کنید. |

در اینجا مثالی از استفاده از `value` و `valueOf()` برای validate کردن اینکه field فعلی، یعنی end date، بعد از start date داخل form قرار دارد می‌بینید:

```ts
import {Component, signal} from '@angular/core';
import {form, validate} from '@angular/forms/signals';

@Component({
  /* ... */
})
export class EventForm {
  eventModel = signal({
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-06-05'),
  });

  eventForm = form(this.eventModel, (schemaPath) => {
    validate(schemaPath.endDate, ({value, valueOf}) => {
      if (value() <= valueOf(schemaPath.startDate)) {
        return {
          kind: 'invalidDateRange',
          message: 'End date must be after start date',
        };
      }

      return null;
    });
  });
}
```

NOTE: Parameter مربوط به `fieldContext` معمولا destructure می‌شود تا فقط چیزهایی که rule نیاز دارد بیرون کشیده شود. مثال‌های باقی‌مانده این راهنما از همین pattern استفاده می‌کنند.

## Patternهای cross-field validation

مثال date range از بخش قبلی، end date را نسبت به start date validate می‌کند. چون rule مقدار `valueOf(schemaPath.startDate)` را می‌خواند، هر زمان هرکدام از dateها تغییر کند، به‌صورت خودکار دوباره evaluate می‌شود. به بیان دیگر، یک validator واحد برای درست نگه داشتن error state کافی است.

با این حال، آن validator واحد فقط error را روی field مربوط به end date قرار می‌دهد. اگر می‌خواهید هنگام invalid بودن range، هر دو field error نشان دهند، به هر field یک validation rule متناظر اضافه کنید:

```ts
import {Component, signal} from '@angular/core';
import {form, validate} from '@angular/forms/signals';

@Component({
  /* ... */
})
export class EventForm {
  eventModel = signal({
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-06-05'),
  });

  eventForm = form(this.eventModel, (schemaPath) => {
    validate(schemaPath.startDate, ({value, valueOf}) => {
      if (value() >= valueOf(schemaPath.endDate)) {
        return {
          kind: 'invalidDateRange',
          message: 'Start date must be before end date',
        };
      }
      return null;
    });

    validate(schemaPath.endDate, ({value, valueOf}) => {
      if (value() <= valueOf(schemaPath.startDate)) {
        return {
          kind: 'invalidDateRange',
          message: 'End date must be after start date',
        };
      }
      return null;
    });
  });
}
```

هر دو rule از `valueOf()` برای خواندن field دیگر استفاده می‌کنند. چون هر rule reactive است، تغییر هرکدام از dateها هر دو validation را به‌صورت خودکار دوباره evaluate می‌کند.

NOTE: وقتی یک rule چند field را درگیر می‌کند، باید تصمیم بگیرید error کجا قرار بگیرد: روی یک field مشخص، روی چند field، یا روی parent. به‌طور کلی، error را جایی بگذارید که کاربر به احتمال زیاد برای رفع مشکل به آن مراجعه می‌کند.

### Requirementهای شرطی

در بعضی formها، بعضی fieldها فقط تحت شرایط خاص required هستند. برای مثال، یک registration form ممکن است company name را فقط وقتی لازم داشته باشد که کاربر business account type را انتخاب کند:

```ts
import {Component, signal} from '@angular/core';
import {form, required} from '@angular/forms/signals';

@Component({
  /* ... */
})
export class RegistrationForm {
  registrationModel = signal({
    accountType: 'personal' as 'personal' | 'business',
    companyName: '',
  });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.companyName, {
      when: ({valueOf}) => valueOf(schemaPath.accountType) === 'business',
      message: 'Company name is required for business accounts',
    });
  });
}
```

Option مربوط به `when` همان field context را دریافت می‌کند که هر rule function دیگری دریافت می‌کند، پس `valueOf` به همان شکل کار می‌کند. وقتی کاربر دوباره به `'personal'` برگردد، condition دوباره evaluate می‌شود و requirement همراه با error آن به‌صورت خودکار clear می‌شود.

استفاده از `required()` همراه با `when` به‌جای check دستی با `validate()`، metadata مناسب required را هم به field اضافه می‌کند؛ این metadata قابلیت‌های accessibility مثل علامت‌گذاری field به‌عنوان required برای screen readerها را فعال می‌کند.

### Validation بر اساس state یک field دیگر

مثال‌های تا اینجا از `valueOf()` برای خواندن value یک field دیگر استفاده کردند. گاهی logic شما به _state_ یک field دیگر وابسته است؛ مثلا اینکه valid، touched یا dirty باشد. برای این کار از `stateOf()` استفاده کنید.

برای مثال، field مربوط به confirm-password فقط وقتی باید match بودن را بررسی کند که کاربر با password field تعامل کرده باشد. اگر کاربر هنوز password را لمس نکرده، flag کردن mismatch روی confirmation زودهنگام است:

```ts
import {Component, signal} from '@angular/core';
import {form, validate} from '@angular/forms/signals';

@Component({
  /* ... */
})
export class PasswordForm {
  passwordModel = signal({
    password: '',
    confirmPassword: '',
  });

  passwordForm = form(this.passwordModel, (schemaPath) => {
    validate(schemaPath.confirmPassword, ({value, valueOf, stateOf}) => {
      if (!stateOf(schemaPath.password).touched()) {
        return null;
      }
      if (value() !== valueOf(schemaPath.password)) {
        return {
          kind: 'passwordMismatch',
          message: 'Passwords do not match',
        };
      }
      return null;
    });
  });
}
```

Call مربوط به `stateOf()`، [field state](api/forms/signals/FieldState) مربوط به field دیگر را برمی‌گرداند و به signalهایی مثل `invalid()`، `touched()` و `dirty()` دسترسی می‌دهد. چون این‌ها signal هستند، هر زمان validity مربوط به password field تغییر کند، rule دوباره evaluate می‌شود.

WARNING: مراقب باشید stateای را نخوانید که به validation field شما وابسته است، چون circular loop ایجاد می‌کند. برای مثال، validatorای که بررسی می‌کند parent field valid است یا نه، infinite loop ایجاد می‌کند، چون validity والد به validity childهای آن وابسته است، که validator شما را هم شامل می‌شود.

## استفاده از validateTree

مثال‌های تا اینجا از `validate()` برای بررسی fieldهای جداگانه استفاده کردند. گاهی لازم دارید یک group از fieldها را validate کنید؛ جایی که logic ذاتا درباره چند field در یک group است و باید errorها را به childهای مشخص داخل آن هدایت کنید. `validateTree` برای این نوع سناریوها ایده‌آل است.

برای مثال، در یک puzzle سودوکو، هر row باید numberهای یکتا داشته باشد. این یک group-level rule است: کل row را بررسی می‌کنید، سپس cellهای مشخصی را که آن را نقض می‌کنند flag می‌کنید. این نوع validation را نمی‌توان تمیز با `validate` روی fieldهای جداگانه بیان کرد، چون هر cell باید درباره همه cellهای دیگر بداند.

```ts
import {Component, signal} from '@angular/core';
import {form, validateTree} from '@angular/forms/signals';

@Component({
  /* ... */
})
export class SudokuRow {
  rowModel = signal({
    cell1: 1,
    cell2: 3,
    cell3: 1,
    cell4: 4,
  });

  rowForm = form(this.rowModel, (schemaPath) => {
    validateTree(schemaPath, ({value, fieldTreeOf}) => {
      const row = value();
      const entries = [
        {val: row.cell1, fieldTree: fieldTreeOf(schemaPath.cell1)},
        {val: row.cell2, fieldTree: fieldTreeOf(schemaPath.cell2)},
        {val: row.cell3, fieldTree: fieldTreeOf(schemaPath.cell3)},
        {val: row.cell4, fieldTree: fieldTreeOf(schemaPath.cell4)},
      ];

      const counts = new Map<number, number>();
      for (const {val} of entries) {
        if (val !== 0) {
          counts.set(val, (counts.get(val) ?? 0) + 1);
        }
      }

      const errors = entries
        .filter(({val}) => val !== 0 && (counts.get(val) ?? 0) > 1)
        .map(({val, fieldTree}) => ({
          kind: 'duplicateInRow',
          message: `${val} already appears in this row`,
          fieldTree,
        }));

      return errors.length > 0 ? errors : null;
    });
  });
}
```

Validator روی parent field، یعنی row، اجرا می‌شود، valueهای همه cellها را می‌خواند، duplicateها را می‌شمارد و برای هر cellای که number تکراری دارد error برمی‌گرداند. Property مربوط به `fieldTree` روی هر error دقیقا به Angular می‌گوید کدام cell باید error را نشان دهد. بدون `fieldTree`، errorها روی خود row اعمال می‌شوند، نه جایی که کاربر لازم دارد آن‌ها را ببیند.

چون `validateTree` می‌تواند arrayای از errorها برگرداند، یک validator واحد می‌تواند چند cell را هم‌زمان flag کند. هر error شامل یک `fieldTree` است که به target آن اشاره می‌کند، بنابراین Angular errorها را به fieldهای درست route می‌کند.

### چه زمانی از validateTree و چه زمانی از validate استفاده کنیم

وقتی error روی همان fieldای قرار می‌گیرد که validate می‌شود، حتی اگر rule از fieldهای دیگر بخواند، `validate()` همراه با `valueOf()` را ترجیح دهید. وقتی به موارد زیر نیاز دارید سراغ `validateTree` بروید:

- Validation logic ذاتا درباره یک group از fieldهاست، نه یک field واحد
- Validator باید errorهایی برگرداند که child fieldهای متفاوتی را هدف می‌گیرند

TIP: برای معرفی `validateTree` و return type آن، [راهنمای Validation](/guide/forms/signals/validation) را ببینید.

## قدم بعدی

این راهنما field context API و patternهای رایج cross-field را پوشش داد. برای یادگیری بیشتر درباره راهنماهای مرتبط Signal Forms، ببینید:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/validation" title="Validation" />
  <docs-pill href="guide/forms/signals/field-state-management" title="مدیریت field state" />
  <docs-pill href="guide/forms/signals/custom-controls" title="Custom controlها" />
</docs-pill-row>
