# فرم‌های پویا با JSON

بعضی فرم‌ها نمی‌توانند ساختار خود را در زمان compile تعریف کنند. فرم‌های server-driven، admin panelها، برنامه‌های multi-tenant و محتوایی که توسط CMS مدیریت می‌شود همگی نیاز دارند fieldها را از configurationای render کنند که در runtime دریافت می‌شود؛ معمولا به شکل JSON از backend، ابزار admin یا تنظیمات هر tenant.

این راهنما نشان می‌دهد چطور فرم‌هایی بسازید که model، schema، validation و rendering آن‌ها همگی از یک runtime configuration واحد مشتق می‌شوند.

## چه زمانی از فرم‌های JSON-driven استفاده کنیم

این الگو انتخاب خوبی است وقتی:

- یک backend بر اساس role کاربر، feature flagها یا business ruleها مشخص می‌کند چه fieldهایی نمایش داده شوند.
- افراد غیر developer ساختار فرم را از طریق admin panel یا CMS تنظیم می‌کنند.
- هر tenant در یک برنامه‌ی multi-tenant ساختار فرم خودش را به‌صورت configuration ذخیره‌شده دارد.
- فرم‌ها باید بدون redeploy کردن frontend تکامل پیدا کنند.

وقتی ساختار فرم در زمان build مشخص است، از فرم static استفاده کنید، یعنی fieldها را مستقیم در component تعریف کنید. فرم‌های static برای هر field بررسی کامل TypeScript می‌گیرند و testing و tooling ساده‌تری دارند.

## تعریف یک field config تایپ‌شده

وقتی می‌خواهید fieldها را از runtime configuration render کنید، با یک type در TypeScript شروع کنید که شکل هر field را توصیف کند. یک discriminated union بر اساس `kind` اجازه می‌دهد هر variant گزینه‌های validation خودش را تعریف کند:

```ts
type FieldConfig =
  | {kind: 'text'; name: string; label: string; required?: boolean}
  | {kind: 'number'; name: string; label: string; required?: boolean; min?: number; max?: number};
```

هر variant یک name، label و flag اختیاری `required` دارد. fieldهای عددی علاوه بر این‌ها boundهای `min` و `max` را هم می‌پذیرند. برای اضافه کردن variant جدید، branchهای جدید `kind` اضافه کنید.

یک config واقعی می‌تواند شبیه این باشد:

```ts
const profileConfig: FieldConfig[] = [
  {kind: 'text', name: 'fullName', label: 'Full Name', required: true},
  {kind: 'number', name: 'age', label: 'Age', required: true, min: 18, max: 120},
];
```

در عمل، این `FieldConfig[]` معمولا از backend، admin panel یا CMS شما می‌آید. برای کوتاه ماندن مثال‌ها، نمونه‌های زیر از یک literal داخل component استفاده می‌کنند.

## ساخت model از config

model فرم به یک entry برای هر field نیاز دارد، با مقدار پیش‌فرضی که با kind آن field جور باشد. یک helper کوچک این کار را انجام می‌دهد:

```ts
function buildModel(configs: FieldConfig[]): Record<string, string | number | null> {
  const initial: Record<string, string | number | null> = {};
  for (const config of configs) {
    initial[config.name] = config.kind === 'number' ? null : '';
  }
  return initial;
}
```

model از `Record<string, string | number | null>` استفاده می‌کند، چون keyها از قبل معلوم نیستند.

همچنین fieldهای عددی به‌جای `0` با `null` initialize می‌شوند تا field خالی واقعا خالی خوانده شود. با `0`، [`required()`](api/forms/signals/required) field را از قبل پرشده در نظر می‌گیرد و هر constraint مربوط به [`min()`](api/forms/signals/min) که بالاتر از صفر باشد قبل از اینکه کاربر چیزی وارد کند field را invalid نشان می‌دهد.

## ساخت schema از config

schema هم از config مشتق می‌شود. می‌توانید روی هر entry loop بزنید و validatorهایی را اعمال کنید که با kind آن سازگارند:

```ts
import {required, min, max, SchemaFn} from '@angular/forms/signals';

function buildSchema(configs: FieldConfig[]): SchemaFn<Record<string, string | number | null>> {
  return (path) => {
    for (const config of configs) {
      const fieldPath = path[config.name];

      if (config.required) {
        required(fieldPath);
      }

      if (config.kind === 'number') {
        if (config.min !== undefined) min(fieldPath, config.min);
        if (config.max !== undefined) max(fieldPath, config.max);
      }
    }
  };
}
```

discriminated union داخل هر branch مقدار `config` را narrow می‌کند؛ بنابراین وقتی `config.kind === 'number'` است، `config.min` و `config.max` درست type می‌شوند.

## بیان ruleهای شرطی در config

بعضی ruleهای validation فقط تحت شرط‌های مشخص معنا دارند. مثلا کدهای ایالت آمریکا فقط وقتی کشور US است نیاز به validation دارند. این dependencyها را با اضافه کردن یک discriminator به نام `when` در config بیان کنید؛ چیزی که نام یک field دیگر و مقداری را مشخص می‌کند که باید با آن برابر باشد:

```ts
type WhenCondition = {field: string; equals: string | number};

type FieldConfig =
  | {kind: 'text'; name: string; label: string; required?: boolean; when?: WhenCondition}
  | {
      kind: 'number';
      name: string;
      label: string;
      required?: boolean;
      min?: number;
      max?: number;
      when?: WhenCondition;
    };
```

`buildSchema()` را به‌روزرسانی کنید تا `when` را به فراخوانی [`applyWhen()`](api/forms/signals/applyWhen) تبدیل کند. منطق مشترک اعمال ruleها وارد یک closure کوچک می‌شود تا هر دو branch شرطی و غیرشرطی همان تابع را صدا بزنند:

```ts
import {applyWhen, required, min, max, SchemaFn} from '@angular/forms/signals';

function buildSchema(configs: FieldConfig[]): SchemaFn<Record<string, string | number | null>> {
  return (rootPath) => {
    for (const config of configs) {
      const applyRules = (path: typeof rootPath) => {
        const fieldPath = path[config.name];
        if (config.required) required(fieldPath);
        if (config.kind === 'number') {
          if (config.min !== undefined) min(fieldPath, config.min);
          if (config.max !== undefined) max(fieldPath, config.max);
        }
      };

      if (config.when) {
        const {field, equals} = config.when;
        applyWhen(rootPath, ({valueOf}) => valueOf(rootPath[field]) === equals, applyRules);
      } else {
        applyRules(rootPath);
      }
    }
  };
}
```

وقتی شرط `applyWhen()` برابر true باشد، ruleهای داخل آن فعال می‌شوند. وقتی شرط false شود، ruleها غیرفعال می‌شوند و validation state آن field پاک می‌شود. چون condition function مقدار را از طریق `valueOf(rootPath[field])` می‌خواند، فرم هر بار که field ارجاع‌داده‌شده تغییر کند gate را دوباره ارزیابی می‌کند.

configای که از `when` استفاده می‌کند شبیه این است:

```ts
const addressConfig: FieldConfig[] = [
  {kind: 'text', name: 'country', label: 'Country', required: true},
  {
    kind: 'text',
    name: 'stateCode',
    label: 'State',
    required: true,
    when: {field: 'country', equals: 'US'},
  },
];
```

field مربوط به `stateCode` فقط وقتی به مقدار نیاز دارد که `country` برابر `'US'` باشد. کاربرانی که کشور دیگری وارد می‌کنند می‌توانند `stateCode` را خالی بگذارند و submission مسدود نمی‌شود.

برای شرط‌های پیچیده‌تر، مثل چند field، rangeها یا checkهایی غیر از equality، `WhenCondition` را با discriminatorهای بیشتر گسترش دهید، مثل `in: string[]` یا `notEquals: string | number`، و هر variant را داخل `buildSchema()` ترجمه کنید. اصل ماجرا همان است: config داده را نگه می‌دارد و `buildSchema()` آن را به فراخوانی‌های `applyWhen()` تبدیل می‌کند.

برای gate کردن visibility به‌جای validation، همین الگو را با [`hidden()`](api/forms/signals/hidden) روی مسیر field دنبال کنید. برای جزئیات، [Configuring `hidden()` state on fields](guide/forms/signals/form-logic#configuring-hidden-state-on-fields) را ببینید.

## بیان fieldهای تکرارشونده در config

بعضی configurationها به fieldهایی نیاز دارند که در runtime زیاد و کم می‌شوند، مثل فهرستی از شماره تلفن‌ها، tagها یا ردیف‌های invoice. یک kind به نام `array` به config اضافه کنید و آن را به [`applyEach()`](api/forms/signals/applyEach) تبدیل کنید تا ruleهای هر item با آمدن و رفتن itemها به‌صورت یکسان اعمال شوند.

`FieldConfig` را با یک variant از نوع `array` گسترش دهید. این مثال از آرایه‌ای از stringها استفاده می‌کند؛ همین رویکرد برای آرایه‌ای از objectها هم با جایگزین کردن شکل item با یک record قابل گسترش است:

```ts
type FieldConfig =
  | {kind: 'text'; name: string; label: string; required?: boolean; when?: WhenCondition}
  | {
      kind: 'number';
      name: string;
      label: string;
      required?: boolean;
      min?: number;
      max?: number;
      when?: WhenCondition;
    }
  | {kind: 'array'; name: string; label: string; itemRequired?: boolean; when?: WhenCondition};
```

`buildModel()` را به‌روزرسانی کنید تا fieldهای array را با آرایه‌ی خالی initialize کند. model بازتر می‌شود تا `string[]` را هم شامل شود:

```ts
function buildModel(configs: FieldConfig[]): Record<string, string | number | null | string[]> {
  const initial: Record<string, string | number | null | string[]> = {};
  for (const config of configs) {
    if (config.kind === 'number') initial[config.name] = null;
    else if (config.kind === 'array') initial[config.name] = [];
    else initial[config.name] = '';
  }
  return initial;
}
```

`buildSchema()` را به‌روزرسانی کنید تا ruleهای هر item را با `applyEach()` اعمال کند. مسیری که از model نوع `Record<string, string | number | null | string[]>` می‌آید برای type-check مستقیم `applyEach()`، و همین‌طور برای `min()` / `max()`، بیش از حد کلی است؛ بنابراین داخل هر branch مربوط به `kind`، `fieldPath` را به شکل مناسب cast کنید:

```ts
import {
  applyEach,
  applyWhen,
  required,
  min,
  max,
  SchemaFn,
  SchemaPath,
} from '@angular/forms/signals';

function buildSchema(
  configs: FieldConfig[],
): SchemaFn<Record<string, string | number | null | string[]>> {
  return (rootPath) => {
    for (const config of configs) {
      const applyRules = (path: typeof rootPath) => {
        const fieldPath = path[config.name];

        if (config.kind === 'array') {
          const arrayPath = fieldPath as unknown as SchemaPath<string[]>;
          if (config.itemRequired) {
            applyEach(arrayPath, (item) => required(item));
          }
          return;
        }

        if (config.required) required(fieldPath);

        if (config.kind === 'number') {
          const numberPath = fieldPath as unknown as SchemaPath<number | null>;
          if (config.min !== undefined) min(numberPath, config.min);
          if (config.max !== undefined) max(numberPath, config.max);
        }
      };

      if (config.when) {
        const {field, equals} = config.when;
        applyWhen(rootPath, ({valueOf}) => valueOf(rootPath[field]) === equals, applyRules);
      } else {
        applyRules(rootPath);
      }
    }
  };
}
```

castهای داخل هر branch راه‌های خروجی عمدی هستند: شما تضمین ساختاری compiler را با invariantای در runtime عوض می‌کنید که check اطراف `kind` آن را enforce می‌کند. هر cast به یک block مربوط به `kind` محدود است، بنابراین فرض مربوطه محلی و ساده برای audit باقی می‌ماند.

configای که از kind مربوط به `array` استفاده می‌کند شبیه این است:

```ts
const contactConfig: FieldConfig[] = [
  {kind: 'text', name: 'fullName', label: 'Full name', required: true},
  {kind: 'array', name: 'phoneNumbers', label: 'Phone numbers', itemRequired: true},
];
```

برای render کردن یک array field، با `@for` روی آن iterate کنید و اجازه دهید کاربرها با به‌روزرسانی model signal آیتم اضافه یا حذف کنند. یک accessor تایپ‌شده اضافه کنید که [`FieldTree`](api/forms/signals/FieldTree) برمی‌گرداند تا iteration ساختار array را ببیند، و متدهایی برای بزرگ و کوچک کردن model تعریف کنید:

```ts
import {FieldTree} from '@angular/forms/signals';

// inside the component class
asArrayField(name: string): FieldTree<string[]> {
  return this.dynamicForm[name] as unknown as FieldTree<string[]>;
}

addItem(name: string) {
  this.model.update(current => ({
    ...current,
    [name]: [...(current[name] as string[]), ''],
  }));
}

removeItem(name: string, index: number) {
  this.model.update(current => ({
    ...current,
    [name]: (current[name] as string[]).filter((_, i) => i !== index),
  }));
}
```

`FieldTree<string[]>` قابل iterate است، پس `@for` می‌تواند روی آن حرکت کند؛ هر item یک `FieldTree<string>` است که مستقیم با `[formField]` سازگار است. leaf fieldها می‌توانند به‌جای آن از accessorهای `Field<T>` استفاده کنند، چون `Field<T>` همان signature قابل فراخوانی بدون iteration است.

در template، case مربوط به array را این‌طور render کنید:

```angular-html
@case ('array') {
  <fieldset>
    <legend>{{ config.label }}</legend>
    @for (item of asArrayField(config.name); track item) {
      <input type="text" [formField]="item" />
      <button type="button" (click)="removeItem(config.name, $index)">Remove</button>
    }
    <button type="button" (click)="addItem(config.name)">Add</button>
  </fieldset>
}
```

متد `addItem()` مدل را گسترش می‌دهد؛ فرم fieldهای آرایه را به‌صورت خودکار دوباره مشتق می‌کند. itemهای جدید با validation state تازه شروع می‌کنند. `removeItem()` مدل را filter می‌کند؛ field state مربوط به item حذف‌شده هم همراهش می‌رود.

### دنبال کردن هویت item

Signal Forms هر item را در آرایه‌ای از objectها با identity خودش دنبال می‌کند. وقتی reference یک field در position مشخصی را نگه می‌دارید، آن reference داده‌ی underlying را دنبال می‌کند، نه position را. خواندن state از reference نگه‌داشته‌شده حتی اگر داده جابه‌جا شده باشد همان داده را برمی‌گرداند:

```ts
const contactModel = signal([
  {name: 'Alice', phone: '555-0001'},
  {name: 'Bob', phone: '555-0002'},
]);

const contactForm = form(contactModel);

// Hold a reference to the field that's currently at index 0 (Alice).
const aliceField = contactForm[0];

// Swap the array items so Bob is at index 0, Alice at index 1.
contactModel.update(([alice, bob]) => [bob, alice]);

// The held reference still points to Alice's field, even after the swap.
console.log(aliceField().value().phone); // '555-0001' (Alice's number)
console.log(contactForm[0]().value().phone); // '555-0002' (Bob, now at index 0)
```

این identity tracking هنگام sort، reorder یا filter از bug جلوگیری می‌کند، تا وقتی item ارجاع‌داده‌شده همچنان در array باقی بماند. referenceهای ذخیره‌شده‌ی field حتی وقتی ترتیب array تغییر می‌کند معتبر می‌مانند؛ حذف خود item ارجاع‌داده‌شده، reference نگه‌داشته‌شده را orphan می‌کند.

برای آرایه‌هایی از primitiveها، مثل مثال `phoneNumbers` بالا، Signal Forms به‌جای آن itemها را positionally دنبال می‌کند: index 0 همیشه به هر مقداری اشاره می‌کند که در حال حاضر در position 0 قرار دارد.

identity اینجا بر اساس JavaScript object reference است، نه یک id منطقی مثل database key. اگر array را با objectهای تازه deserializeشده جایگزین کنید، مثلا بعد از reload از server، field state item منطقی را دنبال نمی‌کند، حتی اگر `id` هر item تغییر نکرده باشد. این guarantee برای عملیات‌های in-memory مثل sort، reorder و filter است، نه refresh داده.

## اعتبارسنجی config

configهایی که از منابع خارجی می‌آیند باید قبل از ساخته شدن فرم validate شوند. چند حالت شکست می‌تواند در JSON غیرقابل اعتماد پنهان شود:

- مقدارهای تکراری `name`، entryهای قبلی model را overwrite می‌کنند و expression مربوط به `track config.name` را در template خراب می‌کنند.
- یک clause از نوع `when` که field ناموجودی را نام می‌برد، اولین بار که condition ارزیابی شود در runtime fail می‌شود.
- یک clause از نوع `when` که با field از نوع `array` مقایسه می‌کند semantics مشخصی برای equality ندارد.
- مقدار `when.equals` که type آن با kind فیلد ارجاع‌داده‌شده جور نیست، بی‌صدا هیچ‌وقت match نمی‌شود و رفتار شرطی را طوری پنهان می‌کند که انگار rule هرگز فعال نشده است.

هر چهار مورد را در مرز ورودی بگیرید:

```ts
function validateConfigs(configs: FieldConfig[]): FieldConfig[] {
  const knownNames = new Set<string>();

  for (const config of configs) {
    if (knownNames.has(config.name)) {
      throw new Error(`Duplicate field name in config: "${config.name}"`);
    }
    knownNames.add(config.name);
  }

  for (const config of configs) {
    if (!config.when) continue;
    if (!knownNames.has(config.when.field)) {
      throw new Error(
        `Field "${config.name}" references unknown field "${config.when.field}" in its 'when' condition.`,
      );
    }
    const referenced = configs.find((c) => c.name === config.when!.field)!;
    if (referenced.kind === 'array') {
      throw new Error(
        `Field "${config.name}" cannot use 'when' to compare against array field "${config.when.field}".`,
      );
    }
    const expected = referenced.kind === 'text' ? 'string' : 'number';
    if (typeof config.when.equals !== expected) {
      throw new Error(
        `Field "${config.name}" compares ${referenced.kind} field "${config.when.field}" against a ${typeof config.when.equals} value; expected a ${expected}.`,
      );
    }
  }

  return configs;
}
```

pass اول یکتا بودن را enforce می‌کند؛ pass دوم هر clause مربوط به `when` را بررسی می‌کند تا مطمئن شود field ارجاع‌داده‌شده وجود دارد، array نیست و با مقداری از type درست مقایسه می‌شود. تابع در صورت موفقیت configها را بدون تغییر برمی‌گرداند، بنابراین با initializer فیلدی که configها را داخل component نگه می‌دارد تمیز compose می‌شود. failureها در مرز بین application شما و منبع upstream آشکار می‌شوند، نه بعدها به شکل رفتار مبهم فرم.

## Render کردن فرم به‌صورت پویا

در component، از `@for` برای iterate کردن configها و از `@switch` روی `kind` برای انتخاب input control درست استفاده کنید:

```angular-ts
import {Component, signal} from '@angular/core';
import {Field, FieldTree, form, FormField, FormRoot} from '@angular/forms/signals';

@Component({
  selector: 'app-dynamic-form',
  imports: [FormField, FormRoot],
  template: `
    <form [formRoot]="dynamicForm">
      @for (config of configs; track config.name) {
        @switch (config.kind) {
          @case ('text') {
            <label>
              {{ config.label }}
              <input type="text" [formField]="asTextField(config.name)" />
            </label>
          }
          @case ('number') {
            <label>
              {{ config.label }}
              <input type="number" [formField]="asNumberField(config.name)" />
            </label>
          }
          @case ('array') {
            <fieldset>
              <legend>{{ config.label }}</legend>
              @for (item of asArrayField(config.name); track item; let i = $index) {
                <input type="text" [formField]="item" />
                <button type="button" (click)="removeItem(config.name, i)">Remove</button>
              }
              <button type="button" (click)="addItem(config.name)">Add</button>
            </fieldset>
          }
        }
      }
    </form>
  `,
})
export class DynamicForm {
  configs: FieldConfig[] = validateConfigs([
    {kind: 'text', name: 'fullName', label: 'Full Name', required: true},
    {kind: 'number', name: 'age', label: 'Age', required: true, min: 18, max: 120},
    {kind: 'array', name: 'phoneNumbers', label: 'Phone numbers', itemRequired: true},
  ]);

  model = signal(buildModel(this.configs));

  dynamicForm = form(this.model, buildSchema(this.configs));

  asTextField(name: string): Field<string> {
    // <input type="text"> requires Field<string>.
    return this.dynamicForm[name] as unknown as Field<string>;
  }

  asNumberField(name: string): Field<number | null> {
    // <input type="number"> requires Field<number | null>.
    return this.dynamicForm[name] as unknown as Field<number | null>;
  }

  asArrayField(name: string): FieldTree<string[]> {
    // FieldTree (not Field) so @for can iterate the array.
    return this.dynamicForm[name] as unknown as FieldTree<string[]>;
  }

  addItem(name: string) {
    this.model.update((current) => ({
      ...current,
      [name]: [...(current[name] as string[]), ''],
    }));
  }

  removeItem(name: string, index: number) {
    this.model.update((current) => ({
      ...current,
      [name]: (current[name] as string[]).filter((_, i) => i !== index),
    }));
  }
}
```

Template type-checking با `dynamicForm[name]` مثل یک expression مستقل رفتار می‌کند، بنابراین narrowing مربوط به `@switch` روی `config.kind` به indexed access نمی‌رسد. accessorها همان narrowing را به‌صورت cast در محل binding دوباره بیان می‌کنند، و branch متناظر `kind` تضمین می‌کند type narrowشده در runtime درست است.

چون model و schema هر دو هنگام ساخت component از همان `FieldConfig[]` مشتق می‌شوند، برای یک config مشخص نمی‌توانند از هم فاصله بگیرند. مثال بالا فرض می‌کند config هنگام ساخته شدن component به‌صورت synchronous در دسترس است.

## گام‌های بعدی

فرم‌های JSON-driven با مشتق کردن model و schema از همان `FieldConfig[]`، این دو را هم‌راستا نگه می‌دارند. هر extension در این راهنما، مثل ruleهای شرطی و fieldهای تکرارشونده، type را گسترش می‌دهد و یک مرحله‌ی ترجمه داخل `buildSchema()` اضافه می‌کند، در حالی که آن هم‌راستایی حفظ می‌شود. model و schema با هم قفل می‌مانند، فرقی ندارد config از کجا آمده باشد یا چطور رشد کند.

برای راهنماهای مرتبط که جنبه‌های دیگر Signal Forms را پوشش می‌دهند، این‌ها را ببینید:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/schemas" title="Schemas and schema composability" />
  <docs-pill href="guide/forms/signals/validation" title="Validation" />
  <docs-pill href="guide/forms/signals/form-logic" title="Adding form logic" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Field state management" />
</docs-pill-row>

برای مستندات API دقیق‌تر، ببینید:

- [`form()`](api/forms/signals/form) - ساخت فرم از model signal
- [`applyWhen()`](api/forms/signals/applyWhen) - اعمال schema به‌صورت شرطی بر اساس reactive state
- [`applyEach()`](api/forms/signals/applyEach) - اعمال schema روی هر item در یک array field
- [`FieldTree`](api/forms/signals/FieldTree) - درخت قابل پیمایش fieldها که توسط `form()` expose می‌شود
- [`SchemaFn`](api/forms/signals/SchemaFn) - type signature مربوط به schema functionها
