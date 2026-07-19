# Structural directiveها

Structural directiveها directiveهایی هستند که روی یک element از نوع `<ng-template>` اعمال می‌شوند و content آن `<ng-template>` را به‌صورت شرطی یا تکراری render می‌کنند.

## مثال use case

در این راهنما یک structural directive می‌سازید که data را از یک data source مشخص fetch می‌کند و وقتی آن data در دسترس بود، template خود را render می‌کند. این directive با الهام از keyword مربوط به SQL یعنی `SELECT`، `SelectDirective` نام دارد و با یک attribute selector به نام `[select]` match می‌شود.

`SelectDirective` یک input خواهد داشت که data source مورد استفاده را نام‌گذاری می‌کند؛ آن را `selectFrom` می‌نامیم. prefix مربوط به `select` برای این input برای [shorthand syntax](#structural-directive-shorthand) مهم است. Directive، `<ng-template>` خود را با یک template context که data انتخاب‌شده را فراهم می‌کند instantiate خواهد کرد.

نمونه استفاده مستقیم از این directive روی یک `<ng-template>` به این شکل است:

```angular-html
<ng-template select let-data [selectFrom]="source">
  <p>The data is: {{ data }}</p>
</ng-template>
```

Structural directive می‌تواند منتظر شود تا data در دسترس قرار بگیرد و سپس `<ng-template>` خود را render کند.

HELPFUL: توجه کنید element مربوط به `<ng-template>` در Angular templateای تعریف می‌کند که به‌صورت پیش‌فرض چیزی render نمی‌کند؛ اگر فقط elementها را داخل یک `<ng-template>` wrap کنید و structural directive روی آن اعمال نکنید، آن elementها render نمی‌شوند.

برای اطلاعات بیشتر، مستندات [ng-template API](api/core/ng-template) را ببینید.

## Shorthand مربوط به structural directive

Angular برای structural directiveها از یک shorthand syntax پشتیبانی می‌کند که نیاز به نوشتن explicit یک element از نوع `<ng-template>` را حذف می‌کند.

Structural directiveها می‌توانند مستقیم روی یک element اعمال شوند، با prefix کردن attribute selector مربوط به directive با کاراکتر asterisk یعنی (`*`)، مثل `*select`. Angular asterisk جلوی structural directive را به یک `<ng-template>` تبدیل می‌کند که میزبان directive است و element و descendantهای آن را در بر می‌گیرد.

می‌توانید این را با `SelectDirective` به شکل زیر استفاده کنید:

```angular-html
<p *select="let data; from: source">The data is: {{ data }}</p>
```

این مثال انعطاف‌پذیری shorthand syntax مربوط به structural directive را نشان می‌دهد که گاهی _microsyntax_ نامیده می‌شود.

وقتی به این شکل استفاده شود، فقط structural directive و bindingهای آن روی `<ng-template>` اعمال می‌شوند. هر attribute یا binding دیگر روی tag مربوط به `<p>` دست‌نخورده باقی می‌ماند. مثلا این دو فرم equivalent هستند:

```angular-html
<!-- Shorthand syntax: -->
<p class="data-view" *select="let data; from: source">The data is: {{ data }}</p>

<!-- Long-form syntax: -->
<ng-template select let-data [selectFrom]="source">
  <p class="data-view">The data is: {{ data }}</p>
</ng-template>
```

Shorthand syntax از طریق مجموعه‌ای از conventionها expand می‌شود. یک [grammar](#structural-directive-syntax-reference) کامل‌تر پایین‌تر تعریف شده، اما در مثال بالا، این transformation را می‌توان این‌گونه توضیح داد:

بخش اول expression مربوط به `*select` برابر `let data` است که یک template variable به نام `data` declare می‌کند. چون assignmentی بعد از آن نمی‌آید، template variable به template context property مربوط به `$implicit` bind می‌شود.

بخش دوم syntax یک key-expression pair است: `from source`. `from` یک binding key است و `source` یک template expression عادی. Binding keyها با تبدیل به PascalCase و اضافه شدن structural directive selector به ابتدای آن‌ها، به propertyها map می‌شوند. key مربوط به `from` به `selectFrom` map می‌شود و سپس به expression مربوط به `source` bind می‌شود. به همین دلیل است که بسیاری از structural directiveها inputهایی دارند که همگی با selector همان structural directive prefix شده‌اند.

## یک structural directive برای هر element

هنگام استفاده از shorthand syntax فقط می‌توانید یک structural directive روی هر element اعمال کنید. دلیلش این است که فقط یک element از نوع `<ng-template>` وجود دارد که آن directive روی آن unwrap می‌شود. چند directive به چند `<ng-template>` nested نیاز دارند و مشخص نیست کدام directive باید اول باشد. وقتی لازم است چند structural directive دور یک DOM element یا component فیزیکی یکسان اعمال شوند، می‌توان از `<ng-container>` برای ساخت wrapper layerها استفاده کرد؛ این به کاربر اجازه می‌دهد ساختار nested را تعریف کند.

## ساخت یک structural directive

این بخش شما را در ساخت `SelectDirective` راهنمایی می‌کند.

<docs-workflow>
<docs-step title="Generate the directive">
با استفاده از Angular CLI، command زیر را اجرا کنید؛ جایی که `select` نام directive است:

```shell
ng generate directive select
```

Angular کلاس directive را می‌سازد و CSS selector مربوط به `[select]` را مشخص می‌کند که directive را در template شناسایی می‌کند.
</docs-step>
<docs-step title="Make the directive structural">
`TemplateRef`، `ViewContainerRef` و `input` را import کنید. `TemplateRef` و `ViewContainerRef` را به‌عنوان private property در directive inject کنید.

```ts
import {Directive, TemplateRef, ViewContainerRef, inject, input} from '@angular/core';

export interface DataSource<T> {
  load(): Promise<T>;
}

@Directive({
  selector: '[select]',
})
export class SelectDirective {
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
}
```

</docs-step>
<docs-step title="Add the 'selectFrom' input">
یک `input()` property به نام `selectFrom` اضافه کنید.

```ts
export class SelectDirective {
  // ...
  selectFrom = input.required<DataSource<unknown>>();
}
```

</docs-step>
<docs-step title="Add the business logic">
اکنون که `SelectDirective` به‌عنوان structural directive با input خود scaffold شده است، می‌توانید logic مربوط به fetch کردن data و render کردن template همراه با آن را اضافه کنید:

```ts
export class SelectDirective {
  // ...
  async ngOnInit() {
    const data = await this.selectFrom().load();
    this.viewContainerRef.createEmbeddedView(this.templateRef, {
      // Create the embedded view with a context object that contains
      // the data via the key `$implicit`.
      $implicit: data,
    });
  }
}
```

</docs-step>
</docs-workflow>

همین است؛ `SelectDirective` آماده و در حال کار است. یک step بعدی می‌تواند [اضافه کردن پشتیبانی template type-checking](#typing-the-directives-context) باشد.

## مرجع syntax مربوط به structural directive

وقتی structural directiveهای خودتان را می‌نویسید، از syntax زیر استفاده کنید:

```ts {hideCopy}
_: prefix = "( :let | :expression ) (';' | ',')? ( :let | :as | :keyExp )_";
```

Patternهای زیر هر بخش از grammar مربوط به structural directive را توضیح می‌دهند:

```ts
as = :export "as" :local ";"?
keyExp = :key ":"? :expression ("as" :local)? ";"?
let = "let" :local "=" :export ";"?
```

| Keyword      | Details                                      |
| :----------- | :------------------------------------------- |
| `prefix`     | HTML attribute key                           |
| `key`        | HTML attribute key                           |
| `local`      | نام local variable استفاده‌شده در template   |
| `export`     | valueای که directive با نام مشخص export می‌کند |
| `expression` | Angular expression استاندارد                 |

### Angular چگونه shorthand را ترجمه می‌کند

Angular shorthand مربوط به structural directive را به syntax عادی binding به شکل زیر ترجمه می‌کند:

| Shorthand                       | Translation                                                     |
| :------------------------------ | :-------------------------------------------------------------- |
| `prefix` و `expression` تنها    | `[prefix]="expression"`                                         |
| `keyExp`                        | `[prefixKey]="expression"` (`prefix` به `key` اضافه می‌شود)     |
| `let local`                     | `let-local="export"`                                            |

### مثال‌های shorthand

جدول زیر مثال‌هایی از shorthand ارائه می‌دهد:

| Shorthand                                                             | How Angular interprets the syntax                                                                             |
| :-------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| `*myDir="let item of [1,2,3]"`                                        | `<ng-template myDir let-item [myDirOf]="[1, 2, 3]">`                                                          |
| `*myDir="let item of [1,2,3] as items; trackBy: myTrack; index as i"` | `<ng-template myDir let-item [myDirOf]="[1,2,3]" let-items="myDirOf" [myDirTrackBy]="myTrack" let-i="index">` |
| `*ngComponentOutlet="componentClass";`                                | `<ng-template [ngComponentOutlet]="componentClass">`                                                          |
| `*ngComponentOutlet="componentClass; inputs: myInputs";`              | `<ng-template [ngComponentOutlet]="componentClass" [ngComponentOutletInputs]="myInputs">`                     |
| `*myDir="exp as value"`                                               | `<ng-template [myDir]="exp" let-value="myDir">`                                                               |

## بهبود template type checking برای custom directiveها

می‌توانید template type checking را برای custom directiveها با اضافه کردن template guard به تعریف directive خود بهبود دهید.
این guardها به Angular template type checker کمک می‌کنند mistakeهای داخل template را در compile time پیدا کند، که می‌تواند از runtime errorها جلوگیری کند.
دو نوع guard متفاوت ممکن است:

- `ngTemplateGuard_(input)` اجازه می‌دهد کنترل کنید یک input expression بر اساس نوع یک input مشخص چگونه narrowed شود.
- `ngTemplateContextGuard` برای تعیین نوع context object مربوط به template استفاده می‌شود، بر اساس نوع خود directive.

این بخش برای هر دو نوع guard مثال ارائه می‌دهد.
برای اطلاعات بیشتر، [Template type checking](tools/cli/template-typecheck 'Template type-checking guide') را ببینید.

### Type narrowing با template guardها

یک structural directive در template کنترل می‌کند آیا آن template در run time render شود یا نه. بعضی structural directiveها می‌خواهند بر اساس نوع input expression، type narrowing انجام دهند.

دو narrowing با input guardها ممکن است:

- Narrow کردن input expression بر اساس یک TypeScript type assertion function.
- Narrow کردن input expression بر اساس truthiness آن.

برای narrow کردن input expression با تعریف یک type assertion function:

```ts
// This directive only renders its template if the actor is a user.
// You want to assert that within the template, the type of the `actor`
// expression is narrowed to `User`.
@Directive(...)
class ActorIsUser {
  actor = input<User | Robot>();

  static ngTemplateGuard_actor(dir: ActorIsUser, expr: User | Robot): expr is User {
    // The return statement is unnecessary in practice, but included to
    // prevent TypeScript errors.
    return true;
  }
}
```

Type-checking داخل template طوری رفتار می‌کند که انگار `ngTemplateGuard_actor` روی expression bind شده به input assert شده است.

بعضی directiveها فقط زمانی templateهای خود را render می‌کنند که یک input truthy باشد. capture کردن semantics کامل truthiness در یک type assertion function ممکن نیست؛ بنابراین به‌جای آن می‌توان از literal type مربوط به `'binding'` استفاده کرد تا به template type-checker signal دهد که خود binding expression باید به‌عنوان guard استفاده شود:

```ts
@Directive(...)
class CustomIf {
  condition = input.required<boolean>();

  static ngTemplateGuard_condition: 'binding';
}
```

Template type-checker طوری رفتار می‌کند که انگار expression bind شده به `condition` داخل template به truthy بودن assert شده است.

### Typing کردن context مربوط به directive

اگر structural directive شما contextی به template instantiate شده provide می‌کند، می‌توانید با فراهم کردن یک static `ngTemplateContextGuard` type assertion function، آن را داخل template درست type کنید. این function می‌تواند از نوع directive برای derive کردن نوع context استفاده کند، که وقتی نوع directive generic است مفید خواهد بود.

برای `SelectDirective` که بالاتر توضیح داده شد، می‌توانید یک `ngTemplateContextGuard` پیاده‌سازی کنید تا نوع data را درست مشخص کند، حتی اگر data source generic باشد.

```ts
// Declare an interface for the template context:
export interface SelectTemplateContext<T> {
  $implicit: T;
}

@Directive(...)
export class SelectDirective<T> {
  // The directive's generic type `T` will be inferred from the `DataSource` type
  // passed to the input.
  selectFrom = input.required<DataSource<T>>();

  // Narrow the type of the context using the generic type of the directive.
  static ngTemplateContextGuard<T>(dir: SelectDirective<T>, ctx: any): ctx is SelectTemplateContext<T> {
    // As before the guard body is not used at runtime, and included only to avoid
    // TypeScript errors.
    return true;
  }
}
```
