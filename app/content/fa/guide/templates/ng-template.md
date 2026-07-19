# ساخت template fragmentها با ng-template

با الهام از [element بومی `<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)، element مربوط به `<ng-template>` اجازه می‌دهد یک **template fragment** declare کنید؛ یعنی بخشی از content که می‌توانید به‌صورت dynamic یا برنامه‌نویسی‌شده render کنید.

## ساخت template fragment

می‌توانید داخل template هر component با element مربوط به `<ng-template>` یک template fragment بسازید:

```angular-html
<p>This is a normal element</p>

<ng-template>
  <p>This is a template fragment</p>
</ng-template>
```

وقتی مورد بالا render می‌شود، content مربوط به element `<ng-template>` روی page render نمی‌شود. در عوض، می‌توانید referenceای به template fragment بگیرید و کدی بنویسید که آن را به‌صورت dynamic render کند.

### Binding context برای fragmentها

Template fragmentها می‌توانند bindingهایی با expressionهای dynamic داشته باشند:

```angular-ts
@Component({
  /* ... */,
  template: `<ng-template>You've selected {{count}} items.</ng-template>`,
})
export class ItemCounter {
  count: number = 0;
}
```

Expressionها یا statementهای داخل یک template fragment در برابر componentی evaluate می‌شوند که fragment در آن declare شده، صرف‌نظر از اینکه fragment کجا render شود.

## گرفتن reference به template fragment

می‌توانید به یکی از سه روش reference یک template fragment را بگیرید:

- با declare کردن یک [template reference variable](/guide/templates/variables#template-reference-variables) روی element مربوط به `<ng-template>`
- با query کردن fragment از طریق [component یا directive query](/guide/components/queries)
- با inject کردن fragment در directiveای که مستقیم روی element `<ng-template>` اعمال شده است.

در هر سه حالت، fragment با یک object از نوع [TemplateRef](/api/core/TemplateRef) نمایش داده می‌شود.

### ارجاع به template fragment با template reference variable

می‌توانید به یک element از نوع `<ng-template>` یک template reference variable اضافه کنید تا در بخش‌های دیگر همان template file به آن template fragment reference دهید:

```angular-html
<p>This is a normal element</p>

<ng-template #myFragment>
  <p>This is a template fragment</p>
</ng-template>
```

سپس می‌توانید از طریق variable مربوط به `myFragment`، در هر جای دیگر template به این fragment reference دهید.

### ارجاع به template fragment با queryها

می‌توانید با هر [component یا directive query API](/guide/components/queries)، reference یک template fragment را بگیرید.

می‌توانید object مربوط به `TemplateRef` را مستقیم با یک query از نوع `viewChild` query کنید.

```angular-ts
@Component({
  /* ... */,
  template: `
    <p>This is a normal element</p>

    <ng-template>
      <p>This is a template fragment</p>
    </ng-template>
  `,
})
export class ComponentWithFragment {
  templateRef = viewChild<TemplateRef<unknown>>(TemplateRef);
}
```

سپس می‌توانید در کد component یا template همان component مثل هر class member دیگری به این fragment reference دهید.

اگر یک template چند fragment داشته باشد، می‌توانید با اضافه کردن template reference variable به هر element `<ng-template>`، به هر fragment نامی assign کنید و fragmentها را بر اساس همان نام query کنید:

```angular-ts
@Component({
  /* ... */,
  template: `
    <p>This is a normal element</p>

    <ng-template #fragmentOne>
      <p>This is one template fragment</p>
    </ng-template>

    <ng-template #fragmentTwo>
      <p>This is another template fragment</p>
    </ng-template>
  `,
})
export class ComponentWithFragment {
    fragmentOne = viewChild<TemplateRef<unknown>>('fragmentOne');
    fragmentTwo = viewChild<TemplateRef<unknown>>('fragmentTwo');
}
```

باز هم می‌توانید در کد component یا template همان component مثل هر class member دیگری به این fragmentها reference دهید.

### Inject کردن template fragment

اگر یک directive مستقیم روی element مربوط به `<ng-template>` اعمال شده باشد، می‌تواند `TemplateRef` را inject کند:

```angular-ts
@Directive({
  selector: '[myDirective]',
})
export class MyDirective {
  private fragment = inject(TemplateRef);
}
```

```angular-html
<ng-template myDirective>
  <p>This is one template fragment</p>
</ng-template>
```

سپس می‌توانید در کد directive خود مثل هر class member دیگری به این fragment reference دهید.

## Render کردن template fragment

وقتی reference object مربوط به `TemplateRef` یک template fragment را دارید، می‌توانید fragment را به یکی از دو روش render کنید: در template با directive مربوط به `NgTemplateOutlet` یا در کد TypeScript با `ViewContainerRef`.

### استفاده از `NgTemplateOutlet`

Directive مربوط به `NgTemplateOutlet` از `@angular/common` یک `TemplateRef` می‌پذیرد و fragment را به‌عنوان **sibling** نسبت به elementی که outlet دارد render می‌کند. معمولا بهتر است `NgTemplateOutlet` را روی یک [element از نوع `<ng-container>`](/guide/templates/ng-container) استفاده کنید.

اول، `NgTemplateOutlet` را import کنید:

```typescript
import {NgTemplateOutlet} from '@angular/common';
```

مثال زیر یک template fragment declare می‌کند و آن fragment را با `NgTemplateOutlet` در یک element از نوع `<ng-container>` render می‌کند:

```angular-html
<p>This is a normal element</p>

<ng-template #myFragment>
  <p>This is a fragment</p>
</ng-template>

<ng-container *ngTemplateOutlet="myFragment"></ng-container>
```

این مثال DOM render شده زیر را تولید می‌کند:

```angular-html
<p>This is a normal element</p>
<p>This is a fragment</p>
```

### استفاده از `ViewContainerRef`

یک **view container** یک node در درخت componentهای Angular است که می‌تواند content داشته باشد. هر component یا directive می‌تواند `ViewContainerRef` را inject کند تا reference به view container متناظر با محل همان component یا directive در DOM را بگیرد.

می‌توانید از متد `createEmbeddedView` روی `ViewContainerRef` استفاده کنید تا یک template fragment را به‌صورت dynamic render کنید. وقتی یک fragment را با `ViewContainerRef` render می‌کنید، Angular آن را به‌عنوان sibling بعدی component یا directiveای که `ViewContainerRef` را inject کرده، به DOM append می‌کند.

مثال زیر componentی را نشان می‌دهد که reference به یک template fragment را به‌عنوان input می‌پذیرد و با click روی button آن fragment را در DOM render می‌کند.

```angular-ts
@Component({
  /* ... */,
  selector: 'component-with-fragment',
  template: `
    <h2>Component with a fragment</h2>
    <ng-template #myFragment>
      <p>This is the fragment</p>
    </ng-template>
    <my-outlet [fragment]="myFragment" />
  `,
})
export class ComponentWithFragment { }

@Component({
  /* ... */,
  selector: 'my-outlet',
  template: `<button (click)="showFragment()">Show</button>`,
})
export class MyOutlet {
  private viewContainer = inject(ViewContainerRef);
  fragment = input<TemplateRef<unknown> | undefined>();

  showFragment() {
    if (this.fragment()) {
      this.viewContainer.createEmbeddedView(this.fragment());
    }
  }
}
```

در مثال بالا، کلیک روی button مربوط به "Show" خروجی زیر را ایجاد می‌کند:

```angular-html
<component-with-fragment>
  <h2>Component with a fragment>
  <my-outlet>
    <button>Show</button>
  </my-outlet>
  <p>This is the fragment</p>
</component-with-fragment>
```

## پاس دادن parameter هنگام render کردن template fragment

وقتی با `<ng-template>` یک template fragment declare می‌کنید، می‌توانید parameterهایی را هم declare کنید که fragment می‌پذیرد. وقتی یک fragment را render می‌کنید، می‌توانید به‌صورت اختیاری یک object به نام `context` پاس دهید که با این parameterها متناظر است. می‌توانید از داده این context object در binding expressionها و statementها استفاده کنید، علاوه بر reference دادن به داده componentی که fragment در آن declare شده است.

هر parameter به‌صورت attributeای نوشته می‌شود که با `let-` prefix شده و مقدار آن با یک property name در context object match می‌شود:

```angular-html
<ng-template let-pizzaTopping="topping">
  <p>You selected: {{ pizzaTopping }}</p>
</ng-template>
```

### استفاده از `NgTemplateOutlet` {#using-ngtemplateoutlet-with-parameters}

می‌توانید یک context object را به input مربوط به `ngTemplateOutletContext` bind کنید:

```angular-html
<ng-template #myFragment let-pizzaTopping="topping">
  <p>You selected: {{ pizzaTopping }}</p>
</ng-template>

<ng-container [ngTemplateOutlet]="myFragment" [ngTemplateOutletContext]="{topping: 'onion'}" />
```

### استفاده از `ViewContainerRef` {#using-viewcontainerref-with-parameters}

می‌توانید یک context object را به‌عنوان argument دوم به `createEmbeddedView` پاس دهید:

```ts
this.viewContainer.createEmbeddedView(this.myFragment, {topping: 'onion'});
```

## فراهم کردن injector برای template fragmentها

وقتی یک template fragment را render می‌کنید، injector context آن از **محل declaration template** می‌آید، نه از جایی که render می‌شود. می‌توانید این رفتار را با فراهم کردن یک custom injector override کنید.

### استفاده از `NgTemplateOutlet` {#using-ngtemplateoutlet-with-injectors}

می‌توانید یک `Injector` سفارشی را به input مربوط به `ngTemplateOutletInjector` پاس دهید:

```angular-ts
export const THEME_DATA = new InjectionToken<string>('THEME_DATA', {
  factory: () => 'light',
});

@Component({
  selector: 'themed-panel',
  template: `<div [class]="theme">...</div>`,
})
export class ThemedPanel {
  theme = inject(THEME_DATA);
}

@Component({
  selector: 'root',
  imports: [NgTemplateOutlet, ThemedPanel],
  template: `
    <ng-template #myFragment>
      <themed-panel />
    </ng-template>
    <ng-container *ngTemplateOutlet="myFragment; injector: customInjector" />
  `,
})
export class Root {
  customInjector = Injector.create({
    providers: [{provide: THEME_DATA, useValue: 'dark'}],
  });
}
```

#### به ارث بردن injector مربوط به outlet

می‌توانید `ngTemplateOutletInjector` را روی string مربوط به `'outlet'` تنظیم کنید تا embedded view به‌جای محل declaration template، injector خود را از location مربوط به outlet در DOM به ارث ببرد.

```angular-html
<ng-template #node let-items>
  <item-component>
    @for (child of items; track $index) {
      <ng-container
        *ngTemplateOutlet="node; context: {$implicit: child.children}; injector: 'outlet'"
      />
    }
  </item-component>
</ng-template>

<ng-container *ngTemplateOutlet="node; context: {$implicit: topLevelItems}" />
```

هر render بازگشتی از template مربوط به `node`، injector را از `<item-component>` اطراف خود به ارث می‌برد و به هر سطح nested اجازه می‌دهد به providerهای scope شده به component والد خود دسترسی داشته باشد.

NOTE: این برای ساخت ساختارهای recursive یا هر موقعیتی مفید است که template render شده باید به providerهای component tree در محل outlet دسترسی داشته باشد.

### استفاده از `ViewContainerRef` {#using-viewcontainerref-with-injectors}

می‌توانید یک custom injector را به‌عنوان بخشی از options object در `createEmbeddedView` پاس دهید:

```ts
this.viewContainer.createEmbeddedView(this.myFragment, context, {
  injector: myCustomInjector,
});
```

## Structural directiveها

یک **structural directive** هر directiveای است که:

- `TemplateRef` را inject می‌کند
- `ViewContainerRef` را inject می‌کند و `TemplateRef` inject شده را به‌صورت برنامه‌نویسی‌شده render می‌کند

Angular برای structural directiveها یک syntax راحت ویژه پشتیبانی می‌کند. اگر directive را روی یک element اعمال کنید و selector مربوط به directive را با کاراکتر asterisk یعنی (`*`) prefix کنید، Angular کل element و همه content آن را به‌عنوان یک template fragment تفسیر می‌کند:

```angular-html
<section *myDirective>
  <p>This is a fragment</p>
</section>
```

این equivalent کد زیر است:

```angular-html
<ng-template myDirective>
  <section>
    <p>This is a fragment</p>
  </section>
</ng-template>
```

توسعه‌دهندگان معمولا از structural directiveها برای render کردن شرطی fragmentها یا render کردن چندباره fragmentها استفاده می‌کنند.

برای جزئیات بیشتر، [Structural Directives](/guide/directives/structural-directives) را ببینید.

## منابع بیشتر

برای مثال‌هایی از اینکه `ng-template` در کتابخانه‌های دیگر چگونه استفاده می‌شود، این موارد را ببینید:

- [Tabs from Angular Material](https://material.angular.dev/components/tabs/overview) - تا وقتی tab فعال نشود چیزی داخل DOM render نمی‌شود
- [Table from Angular Material](https://material.angular.dev/components/table/overview) - به توسعه‌دهندگان اجازه می‌دهد روش‌های متفاوتی برای render کردن data تعریف کنند
