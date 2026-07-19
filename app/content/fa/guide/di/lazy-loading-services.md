# Lazy loading serviceها

IMPORTANT: برای اینکه lazy loading کار کند، serviceای که load می‌کنید باید auto-provided باشد. آن را یا با `@Injectable({providedIn: 'root'})` یا با [`@Service()`](guide/di/creating-and-using-services#using-the-service-vs-injectable-decorator) decorate کنید. بدون auto-provisioning، Angular راهی برای construct کردن service بعد از load شدن ندارد.

تابع `injectAsync` در Angular اجازه می‌دهد یک service را on demand و فقط وقتی واقعا لازم است load کنید. این زمانی مفید است که service به یک library بزرگ یا feature کم‌استفاده وابسته باشد و نمی‌خواهید هزینه آن را در initial page load بپردازید.

وقتی از `injectAsync` استفاده می‌کنید، کد service توسط bundler شما به یک chunk جداگانه JavaScript split می‌شود و اولین باری که instance را request می‌کنید download می‌شود. بعد از load شدن، Angular service را از طریق DI system عادی resolve می‌کند؛ بنابراین همچنان می‌تواند به injectableهای دیگر وابسته باشد و مثل هر singleton دیگری رفتار کند.

## Inject کردن lazy یک service

یک `ReportExporter` را تصور کنید که به یک spreadsheet library سنگین وابسته است. بیشتر کاربران report را باز می‌کنند؛ فقط تعداد کمی روی **Export** کلیک می‌کنند. Exporter را on demand load کنید:

```angular-ts
import {Component, injectAsync} from '@angular/core';

@Component({
  selector: 'app-report',
  template: `<button (click)="export()">Export</button>`,
})
export class Report {
  private exporter = injectAsync(() => import('./report-exporter').then((m) => m.ReportExporter));

  async export() {
    const exporter = await this.exporter();
    exporter.export();
  }
}
```

اولین فراخوانی `this.exporter()` dynamic import را trigger می‌کند و service را از DI resolve می‌کند. فراخوانی‌های بعدی همان promise را reuse می‌کنند، پس chunk فقط یک بار fetch می‌شود.

اگر lazy-loaded service همان [default export](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) باشد، dynamic import را مستقیم پاس دهید؛ Angular مقدار `default` را برای شما unwrap می‌کند:

```ts {header: report-exporter.ts}
@Service()
export default class ReportExporter {
  /* … */
}
```

```ts {header: report.ts}
private exporter = injectAsync(() => import('./report-exporter'));
```

## Prefetch کردن dependency

به‌صورت پیش‌فرض، lazy chunk فقط وقتی fetch می‌شود که function برگشتی را invoke کنید. می‌توانید با پاس دادن یک trigger از نوع `prefetch` در optionها، download را زودتر شروع کنید. Trigger هر functionی است که یک `Promise` برمی‌گرداند؛ وقتی resolve شود، Angular loader را اجرا می‌کند.

Angular همراه با `onIdle` ارائه می‌شود؛ یک trigger built-in که منتظر می‌ماند مرورگر idle شود:

```ts
import {Component, injectAsync, onIdle} from '@angular/core';

@Component({
  /* … */
})
export class Report {
  private exporter = injectAsync(() => import('./report-exporter').then((m) => m.ReportExporter), {
    prefetch: onIdle,
  });
}
```

همچنین می‌توانید `onIdle` را با حداکثر زمان انتظار configure کنید تا prefetch همیشه در یک window مشخص رخ دهد، حتی روی pageهای busy:

```ts
injectAsync(loader, {prefetch: () => onIdle({timeout: 1_000})});
```

NOTE: Prefetching opportunistic است. اگر کاربر پیش از اجرای prefetch از feature استفاده کند، Angular همچنان dependency را بلافاصله load می‌کند و `await` شما را به‌محض آماده شدن resolve می‌کند.

## فراهم کردن custom prefetch trigger

یک `PrefetchTrigger` فقط functionی است که promise برمی‌گرداند؛ loader به‌محض resolve شدن promise اجرا می‌شود. از این برای همسو کردن prefetching با Signalهای خودتان استفاده کنید، مثل hover یا scheduler tick:

```ts
import {PrefetchTrigger} from '@angular/core';

export function onHover(target: HTMLElement): PrefetchTrigger {
  return () =>
    new Promise<void>((resolve) => {
      target.addEventListener('pointerenter', () => resolve(), {once: true});
    });
}
```
