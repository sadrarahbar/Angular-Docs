# ارث‌بری

TIP: این راهنما فرض می‌کند قبلاً [راهنمای Essentials](essentials) را خوانده‌اید. اگر تازه با Angular آشنا شده‌اید، اول آن را بخوانید.

کامپوننت‌های Angular classهای TypeScript هستند و در semantics استاندارد inheritance در JavaScript شرکت می‌کنند.

یک کامپوننت می‌تواند هر base classای را extend کند:

```ts
export class ListboxBase {
  value: string;
}

@Component(/* ... */)
export class CustomListbox extends ListboxBase {
  // CustomListbox inherits the `value` property.
}
```

## extend کردن کامپوننت‌ها و directiveهای دیگر

وقتی یک کامپوننت، کامپوننت یا directive دیگری را extend می‌کند، بخشی از metadata تعریف‌شده در decorator مربوط به base class و memberهای decorated آن base class را به ارث می‌برد. این شامل host bindingها، inputها، outputها و lifecycle methodها می‌شود.

```angular-ts
@Component({
  selector: 'base-listbox',
  template: ` ... `,
  host: {
    '(keydown)': 'handleKey($event)',
  },
})
export class ListboxBase {
  value = input.required<string>();
  handleKey(event: KeyboardEvent) {
    /* ... */
  }
}

@Component({
  selector: 'custom-listbox',
  template: ` ... `,
  host: {
    '(click)': 'focusActiveOption()',
  },
})
export class CustomListbox extends ListboxBase {
  disabled = input(false);
  focusActiveOption() {
    /* ... */
  }
}
```

در مثال بالا، `CustomListbox` همه information مرتبط با `ListboxBase` را به ارث می‌برد و selector و template را با مقدارهای خودش override می‌کند. `CustomListbox` دو input دارد \(`value` و `disabled`\) و دو event listener \(`keydown` و `click`\).

classهای child در نهایت _union_ همه inputها، outputها و host bindingهای ancestorهای خود و خودشان را خواهند داشت.

### forward کردن dependencyهای inject شده

وقتی یک base class از `inject()` به عنوان property initializer استفاده می‌کند، child class آن property را به صورت خودکار به ارث می‌برد. نیازی به forwarding با `super` نیست.

```ts
@Component(/* ... */)
export class ListboxBase {
  protected element = inject(ElementRef);
}

@Component(/* ... */)
export class CustomListbox extends ListboxBase {
  // `element` is inherited from `ListboxBase`.
}
```

اگر یک base class dependencyها را به عنوان constructor parameter inject کند، child class باید این dependencyها را صراحتاً به `super` پاس بدهد.

```ts
@Component(/* ... */)
export class ListboxBase {
  constructor(private element: ElementRef) {}
}

@Component(/* ... */)
export class CustomListbox extends ListboxBase {
  constructor(element: ElementRef) {
    super(element);
  }
}
```

### override کردن lifecycle methodها

اگر یک base class lifecycle methodای مثل `ngOnInit` تعریف کند، child classای که آن هم `ngOnInit` را implement می‌کند، implementation مربوط به base class را _override_ می‌کند. اگر می‌خواهید lifecycle method مربوط به base class را حفظ کنید، method را صراحتاً با `super` فراخوانی کنید:

```ts
@Component(/* ... */)
export class ListboxBase {
  protected isInitialized = false;
  ngOnInit() {
    this.isInitialized = true;
  }
}

@Component(/* ... */)
export class CustomListbox extends ListboxBase {
  override ngOnInit() {
    super.ngOnInit();
    /* ... */
  }
}
```

