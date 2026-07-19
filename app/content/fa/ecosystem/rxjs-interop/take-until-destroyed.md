# unsubscribe کردن با `takeUntilDestroyed`

TIP: این راهنما فرض می‌کند با [lifecycle کامپوننت و directive](guide/components/lifecycle) آشنا هستید.

operator مربوط به `takeUntilDestroyed` از `@angular/core/rxjs-interop` راهی کوتاه و قابل اعتماد برای unsubscribe خودکار از یک Observable هنگام destroy شدن کامپوننت یا directive فراهم می‌کند. این کار از memory leakهای رایج در subscriptionهای RxJS جلوگیری می‌کند. این operator شبیه operator مربوط به [`takeUntil`](https://rxjs.dev/api/operators/takeUntil) در RxJS کار می‌کند، اما نیازی به Subject جداگانه ندارد.

```typescript
import {Component, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NotificationDispatcher, CustomPopupShower} from './some-shared-project-code';

@Component(/* ... */)
export class UserProfile {
  private dispatcher = inject(NotificationDispatcher);
  private popup = inject(CustomPopupShower);

  constructor() {
    // This subscription the 'notifications' Observable is automatically
    // unsubscribed when the 'UserProfile' component is destroyed.
    const messages: Observable<string> = this.dispatcher.notifications;
    messages.pipe(takeUntilDestroyed()).subscribe((message) => {
      this.popup.show(message);
    });
  }
}
```

operator مربوط به `takeUntilDestroyed` یک argument اختیاری از نوع [`DestroyRef`](/api/core/DestroyRef) می‌پذیرد. این operator از `DestroyRef` استفاده می‌کند تا بداند کامپوننت یا directive چه زمانی destroy شده است. وقتی `takeUntilDestroyed` را در یک [injection context](/guide/di/dependency-injection-context)، معمولاً constructor یک کامپوننت یا directive، فراخوانی می‌کنید، می‌توانید این argument را حذف کنید. اگر ممکن است کد شما `takeUntilDestroyed` را خارج از injection context فراخوانی کند، همیشه یک `DestroyRef` ارائه دهید.

```typescript
@Component(/* ... */)
export class UserProfile {
  private dispatcher = inject(NotificationDispatcher);
  private popup = inject(CustomPopupShower);
  private destroyRef = inject(DestroyRef);

  startListeningToNotifications() {
    // Always pass a `DestroyRef` if you call `takeUntilDestroyed` outside
    // of an injection context.
    const messages: Observable<string> = this.dispatcher.notifications;
    messages.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((message) => {
      this.popup.show(message);
    });
  }
}
```

