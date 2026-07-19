# Directive composition API

Directiveهای Angular راه خوبی برای encapsulate کردن behaviorهای reusable ارائه می‌دهند؛ directiveها می‌توانند attributeها، CSS classها و event listenerها را روی یک element اعمال کنند.

_directive composition API_ اجازه می‌دهد directiveها را از _داخل_ کلاس TypeScript یک component، روی host element همان component اعمال کنید.

## اضافه کردن directiveها به یک component

با اضافه کردن property مربوط به `hostDirectives` به decorator یک component، directiveها را روی آن component اعمال می‌کنید. به چنین directiveهایی _host directive_ می‌گوییم.

در این مثال، directive مربوط به `MenuBehavior` را روی host element مربوط به `AdminMenu` اعمال می‌کنیم. این کار شبیه اعمال `MenuBehavior` روی element مربوط به `<admin-menu>` در یک template است.

```typescript
@Component({
  selector: 'admin-menu',
  templateUrl: './admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu {}
```

وقتی framework یک component را render می‌کند، Angular برای هر host directive هم یک instance می‌سازد. Host bindingهای directiveها روی host element مربوط به component اعمال می‌شوند. به‌صورت پیش‌فرض، inputها و outputهای host directive به‌عنوان بخشی از public API مربوط به component expose نمی‌شوند. برای اطلاعات بیشتر، پایین‌تر بخش [Including inputs and outputs](#including-inputs-and-outputs) را ببینید.

**Angular host directiveها را به‌صورت static در compile time اعمال می‌کند.** نمی‌توانید در runtime directiveها را به‌صورت dynamic اضافه کنید.

**Directiveهایی که در `hostDirectives` استفاده می‌شوند نباید `standalone: false` مشخص کنند.**

**Angular مقدار `selector` مربوط به directiveهایی را که در property مربوط به `hostDirectives` اعمال شده‌اند نادیده می‌گیرد.**

## شامل کردن inputها و outputها

وقتی `hostDirectives` را روی component خود اعمال می‌کنید، inputها و outputهای host directiveها به‌صورت پیش‌فرض در API مربوط به component شما include نمی‌شوند. می‌توانید با expand کردن entry در `hostDirectives`، inputها و outputها را به‌صورت explicit در API component خود include کنید:

```typescript
@Component({
  selector: 'admin-menu',
  templateUrl: './admin-menu.html',
  hostDirectives: [
    {
      directive: MenuBehavior,
      inputs: ['menuId'],
      outputs: ['menuClosed'],
    },
  ],
})
export class AdminMenu {}
```

با مشخص کردن explicit inputها و outputها، مصرف‌کنندگان component همراه با `hostDirective` می‌توانند آن‌ها را در template bind کنند:

```angular-html
<admin-menu menuId="top-menu" (menuClosed)="logMenuClosed()"></admin-menu>
```

همچنین می‌توانید inputها و outputهای `hostDirective` را alias کنید تا API component خود را customize کنید:

```typescript
@Component({
  selector: 'admin-menu',
  templateUrl: './admin-menu.html',
  hostDirectives: [
    {
      directive: MenuBehavior,
      inputs: ['menuId: id'],
      outputs: ['menuClosed: closed'],
    },
  ],
})
export class AdminMenu {}
```

```angular-html
<admin-menu id="top-menu" (closed)="logMenuClosed()"></admin-menu>
```

## اضافه کردن directiveها به directive دیگر

علاوه بر componentها، می‌توانید `hostDirectives` را به directiveهای دیگر هم اضافه کنید. این کار aggregation transitive چند behavior را ممکن می‌کند.

در مثال زیر، دو directive به نام‌های `Menu` و `Tooltip` تعریف می‌کنیم. سپس behavior این دو directive را در `MenuWithTooltip` compose می‌کنیم. در نهایت، `MenuWithTooltip` را روی `SpecializedMenuWithTooltip` اعمال می‌کنیم.

وقتی `SpecializedMenuWithTooltip` در یک template استفاده شود، instanceهایی از همه `Menu`، `Tooltip` و `MenuWithTooltip` ساخته می‌شود. Host bindingهای هرکدام از این directiveها روی host element مربوط به `SpecializedMenuWithTooltip` اعمال می‌شود.

```ts
@Directive({
  /* ... */
})
export class Menu {}

@Directive({
  /* ... */
})
export class Tooltip {}

// MenuWithTooltip can compose behaviors from multiple other directives
@Directive({
  hostDirectives: [Tooltip, Menu],
})
export class MenuWithTooltip {}

// CustomWidget can apply the already-composed behaviors from MenuWithTooltip
@Directive({
  hostDirectives: [MenuWithTooltip],
})
export class SpecializedMenuWithTooltip {}
```

## Semantics مربوط به host directive

### ترتیب اجرای directive

Host directiveها همان lifecycle مربوط به componentها و directiveهایی را طی می‌کنند که مستقیم در template استفاده شده‌اند. با این حال، host directiveها همیشه constructor، lifecycle hookها و bindingهای خود را _قبل از_ component یا directiveای اجرا می‌کنند که روی آن اعمال شده‌اند.

مثال زیر استفاده حداقلی از یک host directive را نشان می‌دهد:

```typescript
@Component({
  selector: 'admin-menu',
  templateUrl: './admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu {}
```

ترتیب اجرا در اینجا چنین است:

1. `MenuBehavior` instantiated می‌شود
2. `AdminMenu` instantiated می‌شود
3. `MenuBehavior` inputها را دریافت می‌کند (`ngOnInit`)
4. `AdminMenu` inputها را دریافت می‌کند (`ngOnInit`)
5. `MenuBehavior` host bindingها را اعمال می‌کند
6. `AdminMenu` host bindingها را اعمال می‌کند

این ترتیب عملیات یعنی componentهایی با `hostDirectives` می‌توانند هر host binding مشخص‌شده توسط host directive را override کنند.

این ترتیب عملیات به chainهای nested از host directiveها هم گسترش پیدا می‌کند، همان‌طور که در مثال زیر نشان داده شده است.

```typescript
@Directive({...})
export class Tooltip { }

@Directive({
  hostDirectives: [Tooltip],
})
export class CustomTooltip { }

@Directive({
  hostDirectives: [CustomTooltip],
})
export class EvenMoreCustomTooltip { }
```

در مثال بالا، ترتیب اجرا چنین است:

1. `Tooltip` instantiated می‌شود
2. `CustomTooltip` instantiated می‌شود
3. `EvenMoreCustomTooltip` instantiated می‌شود
4. `Tooltip` inputها را دریافت می‌کند (`ngOnInit`)
5. `CustomTooltip` inputها را دریافت می‌کند (`ngOnInit`)
6. `EvenMoreCustomTooltip` inputها را دریافت می‌کند (`ngOnInit`)
7. `Tooltip` host bindingها را اعمال می‌کند
8. `CustomTooltip` host bindingها را اعمال می‌کند
9. `EvenMoreCustomTooltip` host bindingها را اعمال می‌کند

### Dependency injection

Component یا directiveای که `hostDirectives` مشخص می‌کند می‌تواند instanceهای آن host directiveها را inject کند و برعکس.

هنگام اعمال host directiveها به یک component، هم component و هم host directiveها می‌توانند provider تعریف کنند.

اگر یک component یا directive با `hostDirectives` و آن host directiveها هر دو injection token یکسانی را provide کنند، providerهای تعریف‌شده توسط کلاسی که `hostDirectives` دارد نسبت به providerهای تعریف‌شده توسط host directiveها precedence دارند.

### De-duplication مربوط به host directive

وقتی یک directive یکسان بیش از یک بار در host directive tree resolved شده ظاهر شود، به‌جای throw کردن error، به‌صورت خودکار de-duplicate می‌شود. دو قانون deterministic برای تصمیم‌گیری درباره اینکه کدام match باقی بماند استفاده می‌شود.

#### Template match precedence دارد

اگر یک directive یک بار از طریق **template selector** با یک element match شود و همچنین به‌عنوان **host directive** ظاهر شود، Angular فقط template match را نگه می‌دارد و همه host directive matchها را کنار می‌گذارد.

مدل ذهنی این است که host directive match نماینده `Partial<YourDirective>` است؛ یک application جزئی که در آن فقط inputها و outputهایی که explicit در `hostDirectives` list شده‌اند expose می‌شوند، در حالی که template match نماینده directive کامل با public API کامل آن است.

```ts
@Directive({selector: '[hoverable]'})
export class Hoverable {}

@Component({
  selector: 'app-button',
  hostDirectives: [Hoverable],
})
export class Button {}
```

```angular-html
<!-- Hoverable is matched by selector AND as a host directive of Button. -->
<!-- Angular keeps only the selector match, which has the full public API. -->
<app-button hoverable></app-button>
```

#### چند host directive match با هم merge می‌شوند

اگر یک directive یکسان **بیش از یک بار به‌عنوان host directive** ظاهر شود، مثلا وقتی دو directive هر دو یک dependency مشترک را در `hostDirectives` خود declare می‌کنند، Angular همه instanceها را در یک directive instance واحد merge می‌کند. Mappingهای input و output از همه instanceها با هم ترکیب می‌شوند.

این classic [diamond problem](https://en.wikipedia.org/wiki/Multiple_inheritance#The_diamond_problem) را در host directive composition resolve می‌کند:

```ts
// A shared behavior that both triggers need
@Directive({
  host: {
    '[attr.data-trigger-id]': 'triggerId',
  },
})
export class TriggerRef {
  readonly triggerId = `trigger-${crypto.randomUUID()}`;
}

// Two separate triggers, each declaring TriggerRef as a host directive
@Directive({
  selector: '[popoverTrigger]',
  hostDirectives: [TriggerRef],
})
export class PopoverTrigger {
  readonly triggerRef = inject(TriggerRef);
}

@Directive({
  selector: '[dropdownTrigger]',
  hostDirectives: [TriggerRef],
})
export class DropdownTrigger {
  readonly triggerRef = inject(TriggerRef);
}
```

```angular-html
<!-- Angular keeps one TriggerRef instance, shared by both triggers. -->
<button popoverTrigger dropdownTrigger>Actions</button>
```

HELPFUL: چون Angular فقط یک instance از directive مشترک تولید می‌کند، هر دو `PopoverTrigger` و `DropdownTrigger` هنگام inject کردن آن، همان instance مربوط به `TriggerRef` را دریافت می‌کنند.

#### Aliasهای conflicting

وقتی Angular host directive matchهای duplicate را merge می‌کند، mappingهای input و output آن‌ها را هم merge می‌کند.
اگر دو instance از یک host directive یک **input یا output یکسان را با aliasهای متفاوت** expose کنند، Angular در compile time خطا throw می‌کند ([NG8024](errors/NG8024)).

```ts
@Directive({
  selector: '[popoverTrigger]',
  hostDirectives: [{directive: TriggerRef, inputs: ['triggerId: popoverTriggerId']}],
})
export class PopoverTrigger {}

@Directive({
  selector: '[dropdownTrigger]',
  hostDirectives: [
    {directive: TriggerRef, inputs: ['triggerId: dropdownTriggerId']}, // different alias!
  ],
})
export class DropdownTrigger {}
```

```angular-html
<!-- Error: triggerId is exposed as both "popoverTriggerId" and "dropdownTriggerId". -->
<button popoverTrigger dropdownTrigger></button>
```

برای resolve کردن این مشکل، مطمئن شوید هر دو path، input یا output مشترک را با alias یکسان expose می‌کنند، یا اصلا آن را expose نمی‌کنند.
