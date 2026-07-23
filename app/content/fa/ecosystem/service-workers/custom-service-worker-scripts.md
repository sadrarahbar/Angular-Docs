# اسکریپت‌های سفارشی service worker

هرچند service worker در Angular قابلیت‌های بسیار خوبی ارائه می‌کند، ممکن است لازم باشد امکانات سفارشی مانند مدیریت push notificationها، همگام‌سازی پس‌زمینه یا سایر رویدادهای service worker را اضافه کنید. می‌توانید اسکریپت service worker سفارشی‌ای بسازید که service worker مربوط به Angular را import کرده و گسترش دهد.

## ساخت service worker سفارشی

برای ساخت service worker سفارشی‌ای که قابلیت‌های Angular را گسترش دهد:

1. یک فایل service worker سفارشی \(برای نمونه `custom-sw.js`\) در دایرکتوری `src` ایجاد کنید:

```js
// Import the Angular service worker
importScripts('./ngsw-worker.js');

(function () {
  'use strict';

  // Add custom notification click handler
  self.addEventListener('notificationclick', (event) => {
    console.log('Custom notification click handler');
    console.log('Notification details:', event.notification);

    // Handle notification click - open URL if provided
    if (clients.openWindow && event.notification.data.url) {
      event.waitUntil(clients.openWindow(event.notification.data.url));
      console.log('Opening URL:', event.notification.data.url);
    }
  });

  // Add custom background sync handler
  self.addEventListener('sync', (event) => {
    console.log('Custom background sync handler');

    if (event.tag === 'background-sync') {
      event.waitUntil(doBackgroundSync());
    }
  });

  function doBackgroundSync() {
    // Implement your background sync logic here
    return fetch('https://example.com/api/sync')
      .then((response) => response.json())
      .then((data) => console.log('Background sync completed:', data))
      .catch((error) => console.error('Background sync failed:', error));
  }
})();
```

2. فایل `angular.json` را برای استفاده از service worker سفارشی به‌روزرسانی کنید:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "assets": [
              {
                "glob": "**/*",
                "input": "public"
              },
              "app/src/custom-sw.js"
            ]
          }
        }
      }
    }
  }
}
```

3. ثبت service worker را برای استفاده از اسکریپت سفارشی خود پیکربندی کنید:

```ts
import {ApplicationConfig, isDevMode} from '@angular/core';
import {provideServiceWorker} from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('custom-sw.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
```

### روش‌های پیشنهادی برای service workerهای سفارشی

هنگام گسترش service worker مربوط به Angular:

- **همیشه ابتدا service worker مربوط به Angular را import کنید**؛ با استفاده از `importScripts('./ngsw-worker.js')` مطمئن می‌شوید همه قابلیت‌های cache و به‌روزرسانی در اختیار شما قرار دارند
- **کد سفارشی خود را در یک IIFE قرار دهید** \(عبارت تابعی که بلافاصله فراخوانی می‌شود\) تا scope سراسری آلوده نشود
- **برای عملیات ناهمگام از `event.waitUntil()` استفاده کنید** تا مطمئن شوید پیش از پایان یافتن service worker کامل می‌شوند
- **در هر دو محیط توسعه و production به‌طور کامل آزمایش کنید**
- **خطاها را به‌شکلی مناسب مدیریت کنید** تا کد سفارشی شما قابلیت‌های service worker مربوط به Angular را مختل نکند

### موارد استفاده رایج

service workerهای سفارشی معمولاً برای موارد زیر به‌کار می‌روند:

- **Push notificationها**: مدیریت پیام‌های push ورودی و نمایش notificationها
- **همگام‌سازی پس‌زمینه**: همگام‌سازی داده‌ها پس از برقراری دوباره اتصال شبکه
- **پیمایش سفارشی**: مدیریت سناریوهای خاص routing یا صفحه آفلاین
