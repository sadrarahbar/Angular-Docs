# state وابسته با `linkedSignal`

می‌توانید از تابع `signal` برای نگه داشتن مقداری state در کد Angular خود استفاده کنید. گاهی این state به state _دیگری_ وابسته است. برای مثال، کامپوننتی را تصور کنید که به کاربر اجازه می‌دهد روش ارسال یک سفارش را انتخاب کند:

```typescript
@Component({
  /* ... */
})
export class ShippingMethodPicker {
  shippingOptions: Signal<ShippingMethod[]> = getShippingOptions();

  // Select the first shipping option by default.
  selectedOption = signal(this.shippingOptions()[0]);

  changeShipping(newOptionIndex: number) {
    this.selectedOption.set(this.shippingOptions()[newOptionIndex]);
  }
}
```

در این مثال، `selectedOption` به صورت پیش‌فرض روی اولین گزینه قرار می‌گیرد، اما اگر کاربر گزینه دیگری انتخاب کند تغییر می‌کند. اما `shippingOptions` یک signal است؛ مقدار آن ممکن است تغییر کند! اگر `shippingOptions` تغییر کند، `selectedOption` ممکن است مقداری داشته باشد که دیگر گزینه معتبری نیست.

**تابع `linkedSignal` به شما اجازه می‌دهد signalای بسازید که stateای را نگه دارد که ذاتاً به state دیگری _linked_ است.** اگر به مثال بالا برگردیم، `linkedSignal` می‌تواند جایگزین `signal` شود:

```ts
@Component({
  /* ... */
})
export class ShippingMethodPicker {
  shippingOptions: Signal<ShippingMethod[]> = getShippingOptions();

  // Initialize selectedOption to the first shipping option.
  selectedOption = linkedSignal(() => this.shippingOptions()[0]);

  changeShipping(index: number) {
    this.selectedOption.set(this.shippingOptions()[index]);
  }
}
```

`linkedSignal` مشابه `signal` کار می‌کند، با یک تفاوت کلیدی: به جای پاس دادن مقدار پیش‌فرض، یک _computation function_ پاس می‌دهید، درست مثل `computed`. وقتی مقدار computation تغییر کند، مقدار `linkedSignal` به نتیجه computation تغییر می‌کند. این کمک می‌کند مطمئن شوید `linkedSignal` همیشه مقدار معتبری دارد.

مثال زیر نشان می‌دهد مقدار یک `linkedSignal` چطور می‌تواند بر اساس state لینک‌شده‌اش تغییر کند:

```ts
const shippingOptions = signal(['Ground', 'Air', 'Sea']);
const selectedOption = linkedSignal(() => shippingOptions()[0]);
console.log(selectedOption()); // 'Ground'

selectedOption.set(shippingOptions()[2]);
console.log(selectedOption()); // 'Sea'

shippingOptions.set(['Email', 'Will Call', 'Postal service']);
console.log(selectedOption()); // 'Email'
```

## در نظر گرفتن state قبلی

در بعضی موارد، computation مربوط به یک `linkedSignal` باید مقدار قبلی همان `linkedSignal` را هم در نظر بگیرد.

در مثال بالا، وقتی `shippingOptions` تغییر می‌کند، `selectedOption` همیشه دوباره به اولین گزینه برمی‌گردد. اما شاید بخواهید انتخاب کاربر را حفظ کنید، اگر گزینه انتخاب‌شده هنوز جایی در list وجود دارد. برای انجام این کار، می‌توانید یک `linkedSignal` با _source_ و _computation_ جداگانه بسازید:

```ts
interface ShippingMethod {
  id: number;
  name: string;
}

@Component({
  /* ... */
})
export class ShippingMethodPicker {
  constructor() {
    this.changeShipping(2);
    this.changeShippingOptions();
    console.log(this.selectedOption()); // {"id":2,"name":"Postal Service"}
  }

  shippingOptions = signal<ShippingMethod[]>([
    {id: 0, name: 'Ground'},
    {id: 1, name: 'Air'},
    {id: 2, name: 'Sea'},
  ]);

  selectedOption = linkedSignal<ShippingMethod[], ShippingMethod>({
    // `selectedOption` is set to the `computation` result whenever this `source` changes.
    source: this.shippingOptions,
    computation: (newOptions, previous) => {
      // If the newOptions contain the previously selected option, preserve that selection.
      // Otherwise, default to the first option.
      return newOptions.find((opt) => opt.id === previous?.value.id) ?? newOptions[0];
    },
  });

  changeShipping(index: number) {
    this.selectedOption.set(this.shippingOptions()[index]);
  }

  changeShippingOptions() {
    this.shippingOptions.set([
      {id: 0, name: 'Email'},
      {id: 1, name: 'Sea'},
      {id: 2, name: 'Postal Service'},
    ]);
  }
}
```

وقتی یک `linkedSignal` می‌سازید، می‌توانید به جای اینکه فقط یک computation ارائه دهید، objectای با propertyهای جداگانه `source` و `computation` پاس بدهید.

`source` می‌تواند هر signalای باشد، مثل یک `computed` یا یک `input` کامپوننت. `linkedSignal` وقتی مقدار `source` تغییر کند یا وقتی هر signalای که در `computation` به آن ارجاع داده شده تغییر کند، مقدار خود را با نتیجه `computation` ارائه‌شده update می‌کند.

`computation` تابعی است که مقدار جدید `source` و یک object به نام `previous` را دریافت می‌کند. object مربوط به `previous` دو property دارد: `previous.source` مقدار قبلی `source` است و `previous.value` مقدار قبلی `linkedSignal` است. می‌توانید از این مقدارهای قبلی برای تصمیم‌گیری درباره نتیجه جدید computation استفاده کنید.

HELPFUL: هنگام استفاده از پارامتر `previous`، لازم است generic type argumentهای `linkedSignal` را صراحتاً ارائه دهید. generic type اول با type مربوط به `source` متناظر است و generic type دوم output type مربوط به `computation` را تعیین می‌کند.

## مقایسه equality سفارشی

`linkedSignal` هم مثل هر signal دیگری می‌تواند با equality function سفارشی پیکربندی شود. این تابع توسط downstream dependencyها استفاده می‌شود تا مشخص کنند مقدار `linkedSignal`، یعنی نتیجه یک computation، تغییر کرده یا نه:

```typescript
const activeUser = signal({id: 123, name: 'Morgan', isAdmin: true});

const activeUserEditCopy = linkedSignal(() => activeUser(), {
  // Consider the user as the same if it's the same `id`.
  equal: (a, b) => a.id === b.id,
});

// Or, if separating `source` and `computation`
const activeUserEditCopy = linkedSignal({
  source: activeUser,
  computation: (user) => user,
  equal: (a, b) => a.id === b.id,
});
```

## سفارشی‌سازی operation مربوط به set

گاهی ممکن است بخواهید operationهای `set` و `update` مربوط به یک `linkedSignal` به جای اینکه مقدار خود `linkedSignal` را مستقیماً update کنند، به source of truth بنویسند. می‌توانید این رفتار را با پاس دادن تابع `set` در options سفارشی کنید.

تابع سفارشی `set` دو argument دریافت می‌کند:

1. مقدار جدیدی که set می‌شود.
2. تابع `rawSet` که می‌توانید آن را invoke کنید تا state داخلی `linkedSignal` را مستقیماً update کند، مطابق رفتار پیش‌فرض.

NOTE: استفاده از `rawSet` به شما اجازه می‌دهد مقدار `linkedSignal` را مستقیماً update کنید. این می‌تواند برای جلوگیری از اجرای computation مفید باشد؛ برای مثال وقتی computation expensive است و شما از قبل نتیجه را می‌دانید.

### نوشتن دوباره به source signal

کامپوننتی را در نظر بگیرید که دما را با Fahrenheit نمایش می‌دهد و اجازه edit می‌دهد، اما از یک signal Celsius به عنوان source of truth استفاده می‌کند:

```typescript
const tempC = signal(0);
const tempF = linkedSignal(() => (tempC() * 9) / 5 + 32, {
  set: (valF) => tempC.set(((valF - 32) * 5) / 9),
});

console.log(tempF()); // 32

// Setting Fahrenheit updates Celsius, which reactively updates Fahrenheit
tempF.set(212);
console.log(tempC()); // 100
console.log(tempF()); // 212
```

### update کردن یک property داخل object والد

سناریوی رایج دیگر update کردن یک property مشخص داخل object والد است. والد در یک signal نگه داشته می‌شود و شما به یک property nested لینک می‌کنید:

```typescript
interface Order {
  id: number;
  shippingMethod: string;
}

const order = signal<Order>({
  id: 42,
  shippingMethod: 'Ground',
});

const shippingMethod = linkedSignal(() => order().shippingMethod, {
  set: (newMethod) => {
    // Perform an immutable update to write the change back to the order
    order.update((currentOrder) => ({
      ...currentOrder,
      shippingMethod: newMethod,
    }));
  },
});

console.log(shippingMethod()); // 'Ground'

// Updating the shippingMethod updates the parent order object
shippingMethod.set('Air');
console.log(order()); // { id: 42, shippingMethod: 'Air' }
console.log(shippingMethod()); // 'Air'
```

