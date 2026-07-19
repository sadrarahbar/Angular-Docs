# پردازش پس‌زمینه با web workerها

[Web workerها](https://developer.mozilla.org/docs/Web/API/Web_Workers_API) به شما اجازه می‌دهند محاسبات CPU-intensive را در یک thread پس‌زمینه اجرا کنید و main thread را آزاد بگذارید تا user interface را به‌روز کند. برنامه‌هایی که محاسبات زیادی انجام می‌دهند، مثل تولید نقشه‌های Computer-Aided Design \(CAD\) یا محاسبات هندسی سنگین، می‌توانند برای افزایش performance از web workerها استفاده کنند.

HELPFUL: Angular CLI از اجرای خود CLI داخل web worker پشتیبانی نمی‌کند.

## اضافه کردن یک web worker

برای اضافه کردن web worker به یک پروژه موجود، از command مربوط به Angular CLI یعنی `ng generate` استفاده کنید.

```shell
ng generate web-worker <location>
```

می‌توانید web worker را هر جایی در برنامه خود اضافه کنید. برای مثال، برای اضافه کردن web worker به کامپوننت ریشه، یعنی `src/app/app.component.ts`، command زیر را اجرا کنید.

```shell
ng generate web-worker app
```

این command کارهای زیر را انجام می‌دهد:

1. اگر پروژه شما هنوز برای استفاده از web workerها پیکربندی نشده باشد، آن را پیکربندی می‌کند.
1. scaffold code زیر را به `src/app/app.worker.ts` اضافه می‌کند تا messageها را دریافت کند.

   ```ts {header:"src/app/app.worker.ts"}
   addEventListener('message', ({data}) => {
     const response = `worker response to ${data}`;
     postMessage(response);
   });
   ```

1. scaffold code زیر را به `src/app/app.component.ts` اضافه می‌کند تا از worker استفاده کند.

   ```ts {header:"src/app/app.component.ts"}
   if (typeof Worker !== 'undefined') {
     // Create a new
     const worker = new Worker(new URL('./app.worker', import.meta.url));
     worker.onmessage = ({data}) => {
       console.log(`page got message: ${data}`);
     };
     worker.postMessage('hello');
   } else {
     // Web workers are not supported in this environment.
     // You should add a fallback so that your program still executes correctly.
   }
   ```

بعد از ساخت این scaffold اولیه، باید کد خود را refactor کنید تا با ارسال message به worker و دریافت message از آن، از web worker استفاده کند.

IMPORTANT: بعضی environmentها یا platformها، مثل `@angular/platform-server` که در [Server-side Rendering](guide/ssr) استفاده می‌شود، از web workerها پشتیبانی نمی‌کنند.

برای اینکه مطمئن شوید برنامه شما در این environmentها کار می‌کند، باید یک مکانیزم fallback ارائه دهید تا محاسباتی را انجام دهد که در حالت عادی worker انجام می‌داد.

