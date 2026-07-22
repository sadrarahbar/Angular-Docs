# رفع آلودگی Zone

**Zone.js** سازوکار اعلان Angular برای تشخیص احتمال تغییر وضعیت برنامه است. این کتابخانه عملیات ناهمگام مانند `setTimeout`، درخواست‌های شبکه و event listenerها را ردیابی می‌کند و Angular بر اساس سیگنال‌های Zone.js، change detection را زمان‌بندی می‌کند.

گاهی [taskها](https://developer.mozilla.org/docs/Web/API/HTML_DOM_API/Microtask_guide#tasks) یا [microtaskهای](https://developer.mozilla.org/docs/Web/API/HTML_DOM_API/Microtask_guide#microtasks) زمان‌بندی‌شده هیچ تغییری در مدل داده ایجاد نمی‌کنند؛ بنابراین اجرای change detection ضروری نیست. نمونه‌های رایج عبارت‌اند از:

- `requestAnimationFrame`، `setTimeout` یا `setInterval`
- زمان‌بندی task یا microtask توسط کتابخانه‌های شخص ثالث

این بخش نحوهٔ شناسایی چنین شرایطی و اجرای کد خارج از Angular zone را برای جلوگیری از فراخوانی‌های غیرضروری change detection توضیح می‌دهد.

## شناسایی فراخوانی‌های غیرضروری change detection

با Angular DevTools می‌توانید فراخوانی‌های غیرضروری change detection را پیدا کنید. این موارد اغلب به‌شکل نوارهای پی‌درپی در timeline ابزار profiler و با منبع `setTimeout`، `setInterval`، `requestAnimationFrame` یا یک event handler دیده می‌شوند. اگر برنامهٔ شما فقط چند بار این APIها را فراخوانی می‌کند، معمولاً عامل اجرای change detection یک کتابخانهٔ شخص ثالث است.

<img alt="پیش‌نمایش profiler در Angular DevTools که آلودگی Zone را نشان می‌دهد" src="assets/images/best-practices/runtime-performance/zone-pollution.png">

در تصویر بالا مجموعه‌ای از فراخوانی‌های change detection دیده می‌شود که event handlerهای متصل به یک element آن‌ها را فعال کرده‌اند. این مشکل هنگام استفاده از کامپوننت‌های شخص ثالثی که مخصوص Angular نیستند و رفتار پیش‌فرض `NgZone` را تغییر نمی‌دهند، رایج است.

## اجرای taskها خارج از `NgZone`

در چنین شرایطی، با استفاده از [NgZone](/api/core/NgZone) می‌توانید به Angular بگویید برای taskهای زمان‌بندی‌شده توسط بخشی مشخص از کد، change detection را فراخوانی نکند.

```ts {header:"Run outside of the Zone" , linenums}
import { Component, NgZone, OnInit, inject } from '@angular/core';

@Component(...)
class AppComponent implements OnInit {
  private ngZone = inject(NgZone);

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => setInterval(pollForUpdates, 500));
  }
}
```

قطعه‌کد بالا به Angular می‌گوید `setInterval` را خارج از Angular Zone فراخوانی کند و پس از اجرای `pollForUpdates`، change detection را اجرا نکند.

کتابخانه‌های شخص ثالث معمولاً هنگامی چرخه‌های غیرضروری change detection ایجاد می‌کنند که API آن‌ها در Angular zone فراخوانی شود. این پدیده به‌ویژه در کتابخانه‌هایی دیده می‌شود که event listener ایجاد یا taskهای دیگری مانند timer و درخواست XHR راه‌اندازی می‌کنند. با فراخوانی API کتابخانه خارج از Angular zone از این چرخه‌های اضافی جلوگیری کنید:

```ts {header:"Move the plot initialization outside of the Zone" , linenums}
import { Component, NgZone, OnInit, inject } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component(...)
class AppComponent implements OnInit {
  private ngZone = inject(NgZone);

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      Plotly.newPlot('chart', data);
    });
  }
}
```

اجرای `Plotly.newPlot('chart', data);` درون `runOutsideAngular` به framework اعلام می‌کند که پس از taskهای زمان‌بندی‌شده توسط منطق راه‌اندازی، change detection را اجرا نکند.

برای مثال، اگر `Plotly.newPlot('chart', data)` به یک element در DOM، event listener اضافه کند، Angular پس از اجرای handlerهای آن‌ها change detection را اجرا نمی‌کند.

با این حال، گاهی لازم است به رویدادهای منتشرشده توسط APIهای شخص ثالث گوش دهید. در این حالت به خاطر داشته باشید اگر منطق راه‌اندازی خارج از Angular zone اجرا شده باشد، event listenerهای آن نیز خارج از zone اجرا می‌شوند:

```ts {header:"Check whether the handler is called outside of the Zone" , linenums}
import { Component, NgZone, OnInit, output, inject } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component(...)
class AppComponent implements OnInit {
  private ngZone = inject(NgZone);

  plotlyClick = output<Plotly.PlotMouseEvent>();

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.createPlotly();
    });
  }

  private async createPlotly() {
    const plotly = await Plotly.newPlot('chart', data);

    plotly.on('plotly_click', (event: Plotly.PlotMouseEvent) => {
      // This handler will be called outside of the Angular zone because
      // the initialization logic is also called outside of the zone. To check
      // whether we're in the Angular zone, we can call the following:
      console.log(NgZone.isInAngularZone());
      this.plotlyClick.emit(event);
    });
  }
}
```

اگر باید رویدادی را به کامپوننت‌های والد ارسال کنید و منطق مشخصی برای به‌روزرسانی view اجرا شود، بهتر است دوباره وارد Angular zone شوید تا framework را به اجرای change detection وادار کنید؛ یا change detection را دستی اجرا کنید:

```ts {header:"Re-enter the Angular zone when dispatching event" , linenums}
import { Component, NgZone, OnInit, output, inject } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component(...)
class AppComponent implements OnInit {
  private ngZone = inject(NgZone);

  plotlyClick = output<Plotly.PlotMouseEvent>();

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.createPlotly();
    });
  }

  private async createPlotly() {
    const plotly = await Plotly.newPlot('chart', data);

    plotly.on('plotly_click', (event: Plotly.PlotMouseEvent) => {
      this.ngZone.run(() => {
        this.plotlyClick.emit(event);
      });
    });
  }
}
```

ممکن است سناریوی ارسال رویداد خارج از Angular zone نیز رخ دهد. به خاطر داشته باشید فعال‌کردن change detection، برای مثال به‌صورت دستی، ممکن است باعث ایجاد یا به‌روزرسانی viewها خارج از Angular zone شود.
