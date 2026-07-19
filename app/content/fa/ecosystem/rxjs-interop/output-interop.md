# RxJS interop با خروجی‌های کامپوننت و directive

TIP: این راهنما فرض می‌کند با [خروجی‌های کامپوننت و directive](guide/components/outputs) آشنا هستید.

پکیج `@angular/rxjs-interop` دو API مرتبط با خروجی‌های کامپوننت و directive ارائه می‌دهد.

## ساخت یک output بر پایه RxJS Observable

`outputFromObservable` به شما اجازه می‌دهد خروجی کامپوننت یا directiveای بسازید که بر اساس یک RxJS observable emit کند:

```ts {highlight:[11]}
import {Directive} from '@angular/core';
import {outputFromObservable} from '@angular/core/rxjs-interop';

@Directive(/* ... */)
class Draggable {
  pointerMoves$: Observable<PointerMovements> = listenToPointerMoves();

  // Whenever `pointerMoves$` emits, the `pointerMove` event fires.
  pointerMove = outputFromObservable(this.pointerMoves$);
}
```

تابع `outputFromObservable` برای Angular compiler معنای ویژه‌ای دارد. **فقط می‌توانید `outputFromObservable` را در initializerهای property مربوط به کامپوننت و directive فراخوانی کنید.**

وقتی روی output، `subscribe` می‌کنید، Angular به صورت خودکار subscription را به observable زیرین forward می‌کند. وقتی کامپوننت یا directive destroy شود، Angular forward کردن مقدارها را متوقف می‌کند.

HELPFUL: اگر می‌توانید مقدارها را به صورت imperative emit کنید، استفاده مستقیم از `output()` را در نظر بگیرید.

## ساخت RxJS Observable از output کامپوننت یا directive

تابع `outputToObservable` به شما اجازه می‌دهد از output یک کامپوننت، یک RxJS observable بسازید.

```ts {highlight:[11]}
import {outputToObservable} from '@angular/core/rxjs-interop';

@Component(/*...*/)
class CustomSlider {
    valueChange = output<number>();
}

// Instance reference to `CustomSlider`.
const slider: CustomSlider = createSlider();

outputToObservable(slider.valueChange) // Observable<number>
    .pipe(...)
    .subscribe(...);
```

HELPFUL: اگر method مربوط به `subscribe` روی `OutputRef` نیاز شما را برآورده می‌کند، استفاده مستقیم از آن را در نظر بگیرید.

