# Form submission

وقتی کاربر یک form را submit می‌کند، application شما معمولا باید چند concern را هم‌زمان مدیریت کند: نمایش validation errorها، جلوگیری از duplicate submission، ارسال data به server و موارد بیشتر. مدیریت دستی هرکدام از این‌ها می‌تواند خسته‌کننده و error-prone باشد.

Signal Forms یک function به نام `submit()` فراهم می‌کند که کمک می‌کند lifecycle مربوط به form submission را مدیریت کنید. این راهنما نحوه استفاده از آن را قدم‌به‌قدم توضیح می‌دهد.

## `submit()` چه کاری انجام می‌دهد؟

Function مربوط به `submit()` یک sequence مشخص را اجرا می‌کند:

1. **Interactive fieldها را touched علامت‌گذاری می‌کند** — Fieldهایی که فقط بعد از touched شدن error نشان می‌دهند، حالا validation errorهای خود را نشان می‌دهند. Fieldهای hidden، disabled و readonly skip می‌شوند.
1. **Validation را بررسی می‌کند** — اگر هر validation ruleای fail شده باشد، submission متوقف می‌شود و function مربوط به `action` اجرا نمی‌شود.
1. **Action را اجرا می‌کند** — Function مربوط به `action` با value فعلی form اجرا می‌شود. هنگام اجرای آن، `submitting()` مقدار `true` برمی‌گرداند.
1. **Result را مدیریت می‌کند** — اگر action error برگرداند، errorها به fieldهای target خود route می‌شوند. اگر چیزی برنگرداند، submission موفق در نظر گرفته می‌شود.

Function مربوط به `submit()` یک `Promise<boolean>` برمی‌گرداند که وقتی action بدون error کامل شود به `true` resolve می‌شود، و وقتی validation fail شود یا action error برگرداند به `false` resolve می‌شود.

## Setup کردن form submission با `FormRoot`

رایج‌ترین روش استفاده از function مربوط به `submit()` از طریق directive مربوط به `FormRoot` است.

Directive مربوط به `FormRoot` وقتی به element `<form>` bind شود، سه کار را به‌صورت خودکار انجام می‌دهد:

1. **[`novalidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form#novalidate) را تنظیم می‌کند** — validation داخلی مرورگر را غیرفعال می‌کند تا Signal Forms validation را مدیریت کند
1. **Default را prevent می‌کند** — جلوی navigate کردن مرورگر هنگام form submission را می‌گیرد
1. **`submit()` را call می‌کند** — وقتی کاربر form را submit می‌کند submission flow را trigger می‌کند

NOTE: Directive مربوط به `FormRoot` به‌صورت خودکار attribute مربوط به `novalidate` را روی element مربوط به `form` تنظیم می‌کند. هنگام استفاده از `FormRoot` لازم نیست آن را دستی اضافه کنید.

`FormRoot` event مربوط به submission را مدیریت می‌کند، اما همچنان باید به آن بگویید با form data _چه کاری انجام دهد_. این کار به سه چیز نیاز دارد:

1. Form خود را به directive مربوط به `FormRoot` bind کنید
1. یک option به نام `submission` به function مربوط به `form()` پاس بدهید
1. داخل option مربوط به `submission`، یک function به نام `action` تعریف کنید که submitted data را مدیریت کند

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, FormRoot, required} from '@angular/forms/signals';

@Component({
  selector: 'app-contact',
  imports: [FormField, FormRoot],
  template: `
    <form [formRoot]="contactForm">
      <label>
        Name
        <input [formField]="contactForm.name" />
      </label>

      <label>
        Email
        <input type="email" [formField]="contactForm.email" />
      </label>

      <button type="submit">Send</button>
    </form>
  `,
})
export class Contact {
  contactModel = signal({
    name: '',
    email: '',
  });

  contactForm = form(
    this.contactModel,
    (schemaPath) => {
      required(schemaPath.name);
      required(schemaPath.email);
    },
    {
      submission: {
        action: async (field) => {
          const result = await saveContact(field().value());
          if (result.ok) return;

          return {kind: 'serverError', message: 'Failed to submit form'};
        },
      },
    },
  );
}
```

Function مربوط به `action` فقط وقتی اجرا می‌شود که هیچ validation ruleای fail نشده باشد. به‌صورت پیش‌فرض، async validatorهای pending جلوی submission را نمی‌گیرند؛ برای جزئیات بیشتر [کنترل validation gating](#controlling-validation-gating-with-ignorevalidators) را ببینید. Action، field tree و یک object به نام `detail` با field treeهای `root` و `submitted` دریافت می‌کند، که هنگام submit کردن یک sub-form مفید است.

بعد از pass شدن validation، خود action ممکن است همچنان به‌خاطر سناریوهایی مثل network error یا duplicate entry fail شود. در این حالت‌ها می‌توانید failure را با برگرداندن errorها نمایش دهید. از طرف دیگر، برای نشان دادن success کافی است `null` یا `undefined` برگردانید، یا یک `return` خالی call کنید.

## نمایش submission state با `submitting()`

وقتی لازم دارید track کنید form در حال submit شدن است یا نه، Signal Forms یک signal به نام `submitting()` فراهم می‌کند که هنگام اجرای function مربوط به `action` مقدار `true` برمی‌گرداند. از آن برای نمایش loading indicator یا disable کردن submit button برای جلوگیری از duplicate submission استفاده کنید.

```angular-html
<button type="submit" [disabled]="contactForm().submitting()">
  @if (contactForm().submitting()) {
    Sending...
  } @else {
    Send
  }
</button>
```

وقتی function مربوط به `action` موفق شود یا error برگرداند، signal مربوط به `submitting()` به‌صورت خودکار دوباره به `false` reset می‌شود.

## مدیریت submission errorها

### Server errorها

وقتی function مربوط به `action` با server ارتباط می‌گیرد، server ممکن است errorهایی برگرداند که باید روی fieldهای مشخص ظاهر شوند. این errorها را از `action` برگردانید تا به fieldهای target خود route شوند.

#### Errorها روی submitted field

به‌صورت پیش‌فرض، errorهایی که از `action` برمی‌گردند به submitted field، یعنی field treeای که به `submit()` پاس داده‌اید، assign می‌شوند:

```ts
action: async (field) => {
  const result = await saveContact(field().value());
  if (result.ok) return;

  return {kind: 'serverError', message: 'Failed to submit form'};
};
```

#### Errorها روی fieldهای مشخص

وقتی می‌خواهید یک error را به field مشخصی route کنید، یک property به نام `fieldTree` اضافه کنید که به آن field اشاره می‌کند:

```ts
action: async (field) => {
  const result = await saveContact(field().value());
  if (result.ok) return;

  return {kind: 'taken', message: result.message, fieldTree: field.email};
};
```

#### چند error

وقتی می‌خواهید errorها را روی چند field گزارش کنید، یک array برگردانید:

```ts
action: async (field) => {
  const result = await registerUser(field().value());
  if (result.ok) return;

  return result.errors.map((err: {field: string; message: string}) => ({
    kind: 'serverError',
    message: err.message,
    fieldTree: field[err.field as keyof typeof field],
  }));
};
```

### Clear شدن خودکار submission errorها

Submission errorها وقتی کاربر field را edit کند به‌صورت خودکار clear می‌شوند. اگر `action` روی email field error برگرداند، به‌محض اینکه کاربر email value را تغییر دهد، آن error ناپدید می‌شود.

این با validation errorها فرق دارد، چون validation errorها به‌صورت reactive دوباره compute می‌شوند. Validation ruleها روی هر change دوباره اجرا می‌شوند و ممکن است همان error را تولید کنند. Submission errorها resultهای یک‌باره از server هستند؛ وقتی clear شوند، دوباره ظاهر نمی‌شوند مگر اینکه form دوباره submit شود.

TIP: Submission errorها کنار validation errorها در signal مربوط به `errors()` همان field ظاهر می‌شوند. برای راهنمایی درباره نمایش errorها در template، [راهنمای Field State Management](guide/forms/signals/field-state-management) را ببینید.

## مدیریت submissionهای invalid با `onInvalid`

وقتی validation fail شود، function مربوط به `action` اجرا نمی‌شود. اگر لازم دارید به تلاش ناموفق برای submission واکنش نشان دهید، مثلا scroll به اولین error، نمایش toast یا focus کردن یک field invalid، از callback مربوط به `onInvalid` استفاده کنید.

```ts
contactForm = form(
  this.contactModel,
  (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.email);
  },
  {
    submission: {
      action: async (field) => {
        await saveContact(field().value());
      },
      onInvalid: (field) => {
        const firstError = field().errorSummary()[0];
        firstError?.fieldTree().focusBoundControl();
      },
    },
  },
);
```

Callback مربوط به `onInvalid` همان parameterهای `(field, detail)` را دریافت می‌کند که `action` دریافت می‌کند. بعد از اینکه همه interactive fieldها touched علامت‌گذاری شدند اجرا می‌شود، پس validation errorها هنگام اجرای آن از قبل در UI visible هستند.

## کنترل validation gating با `ignoreValidators`

به‌صورت پیش‌فرض، `submit()` validatorهای pending را ignore می‌کند. اگر هیچ validatorای fail نشده باشد، action اجرا می‌شود حتی اگر بعضی async validatorها هنوز در حال اجرا باشند. Option مربوط به `ignoreValidators` کنترل این behavior را به شما می‌دهد.

| Value       | Behavior                                                                 |
| ----------- | ------------------------------------------------------------------------ |
| `'pending'` | اگر هیچ validatorای fail نشده باشد submit می‌کند، حتی اگر بعضی pending باشند؛ پیش‌فرض |
| `'none'`    | فقط وقتی submit می‌کند که همه validatorها pass شوند؛ validatorهای pending جلوی submission را می‌گیرند |
| `'all'`     | صرف‌نظر از validation state، همیشه submit می‌کند                         |

```ts
contactForm = form(
  this.contactModel,
  (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.email);
  },
  {
    submission: {
      action: async (field) => {
        await saveContact(field().value());
      },
      ignoreValidators: 'none',
    },
  },
);
```

وقتی form شما async validator دارد، مثل بررسی availability مربوط به username، و لازم دارید قبل از submit همه validation کامل شود، از `'none'` استفاده کنید. برای سناریوهای draft-saving که می‌خواهید data را صرف‌نظر از validation state persist کنید، از `'all'` استفاده کنید.

## Submission دستی با `submit()`

Directive مربوط به `FormRoot` رایج‌ترین روش trigger کردن submission است، اما می‌توانید `submit()` را مستقیم هم call کنید. این کار برای multi-step wizardها، auto-save، یا trigger کردن submission از بیرون form element مفید است.

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, submit} from '@angular/forms/signals';

@Component({
  selector: 'app-contact',
  imports: [FormField],
  template: `
    <label>
      Name
      <input [formField]="contactForm.name" />
    </label>

    <label>
      Email
      <input type="email" [formField]="contactForm.email" />
    </label>

    <button (click)="onSave()">Save</button>
  `,
})
export class Contact {
  contactModel = signal({
    name: '',
    email: '',
  });

  contactForm = form(this.contactModel, (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.email);
  });

  async onSave() {
    // When calling `submit()` directly, you pass the action as the second argument
    // instead of configuring it in `FormOptions`.
    const success = await submit(this.contactForm, async (field) => {
      const result = await saveContact(field().value());
      if (result.ok) return;

      return {kind: 'serverError', message: 'Failed to save'};
    });

    if (success) {
      // Handle success — navigate, show confirmation, etc.
    }
  }
}
```

## مدیریت side effectها

Function مربوط به `submit()` یک `Promise<boolean>` برمی‌گرداند؛ وقتی action بدون error کامل شود `true`، و وقتی validation fail شود یا action error برگرداند `false`. از این برای trigger کردن side effectهایی مثل navigation یا notification استفاده کنید.

```ts
async onSave() {
  const success = await submit(this.contactForm, async (field) => {
    await saveContact(field().value());
  });

  if (success) {
    await this.router.navigate(['/confirmation']);
  }
}
```

وقتی action dataای تولید می‌کند که یک side effect به آن نیاز دارد، مثل ID تولیدشده توسط server، side effect را داخل action مدیریت کنید:

```ts
async onSave() {
  await submit(this.contactForm, async (field) => {
    const contact = await createContact(field().value());
    await this.router.navigate(['/confirmation', contact.id]);
  });
}
```

وقتی از `FormRoot` استفاده می‌کنید، side effectها هم داخل `action` قرار می‌گیرند، چون `FormRoot` به‌صورت داخلی `submit()` را call می‌کند:

```ts
submission: {
  action: async (field) => {
    const result = await saveContact(field().value());
    if (result.ok) {
      await this.router.navigate(['/confirmation']);
      return;
    }

    return {kind: 'serverError', message: 'Failed to submit form'};
  },
}
```

## Submissionهای concurrent

وقتی یک submission در حال انجام است، callهای بعدی `submit()` برای همان form یا هر parent آن بلافاصله `false` برمی‌گردانند و action را اجرا نمی‌کنند. این کار از duplicate submission و side effectها جلوگیری می‌کند اگر کاربر submit action را چند بار پشت سر هم trigger کند.

## قدم بعدی

این راهنما submit کردن formها و مدیریت form submission errorها را پوشش داد. راهنماهای مرتبط جنبه‌های دیگر Signal Forms را بررسی می‌کنند:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/validation" title="Validation" />
  <docs-pill href="guide/forms/signals/field-state-management" title="مدیریت field state" />
  <docs-pill href="guide/forms/signals/form-logic" title="اضافه کردن form logic" />
</docs-pill-row>
