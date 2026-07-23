# Push notificationها

Push notificationها روشی جذاب برای تعامل با کاربران هستند.
به کمک قدرت service workerها، حتی وقتی برنامه شما در کانون توجه نیست نیز می‌توان notification را به دستگاه تحویل داد.

service worker مربوط به Angular امکان نمایش push notificationها و مدیریت رویداد کلیک روی notification را فراهم می‌کند.

HELPFUL: هنگام استفاده از service worker مربوط به Angular، تعامل با push notificationها از طریق service به نام `SwPush` مدیریت می‌شود.
برای آشنایی بیشتر با APIهای مرورگر درگیر، [Push API](https://developer.mozilla.org/docs/Web/API/Push_API) و [استفاده از Notifications API](https://developer.mozilla.org/docs/Web/API/Notifications_API/Using_the_Notifications_API) را ببینید.

## payload مربوط به notification

برای فراخوانی push notification، پیامی با payload معتبر push کنید.
برای راهنمایی به `SwPush` مراجعه کنید.

HELPFUL: در Chrome می‌توانید push notificationها را بدون backend آزمایش کنید.
Devtools -> Application -> Service Workers را باز کنید و از ورودی `Push` برای ارسال payload از نوع JSON مربوط به notification استفاده کنید.

## مدیریت کلیک روی notification

رفتار پیش‌فرض رویداد `notificationclick`، بستن notification و اطلاع دادن به `SwPush.notificationClicks` است.

با افزودن ویژگی `onActionClick` به شیء `data` و ارائه entry به نام `default` می‌توانید عملیات دیگری را برای اجرا هنگام `notificationclick` مشخص کنید.
این ویژگی به‌خصوص زمانی مفید است که هنگام کلیک روی notification هیچ client بازی وجود ندارد.

```json
{
  "notification": {
    "title": "New Notification!",
    "data": {
      "onActionClick": {
        "default": {"operation": "openWindow", "url": "foo"}
      }
    }
  }
}
```

### عملیات

service worker مربوط به Angular از عملیات زیر پشتیبانی می‌کند:

| عملیات | جزئیات |
| :--- | :--- |
| `openWindow` | یک tab جدید در URL مشخص‌شده باز می‌کند. |
| `focusLastFocusedOrOpen` | آخرین client دارای focus را در کانون قرار می‌دهد. اگر client بازی وجود نداشته باشد، tab جدیدی در URL مشخص‌شده باز می‌کند. |
| `navigateLastFocusedOrOpen` | آخرین client دارای focus را در کانون قرار داده و به URL مشخص‌شده هدایت می‌کند. اگر client بازی وجود نداشته باشد، tab جدیدی در URL مشخص‌شده باز می‌کند. |
| `sendRequest` | یک درخواست ساده GET به URL مشخص‌شده ارسال می‌کند. |

IMPORTANT: URLها نسبت به scope ثبت service worker resolve می‌شوند.<br />اگر یکی از موارد `onActionClick` دارای `url` نباشد، scope ثبت service worker استفاده می‌شود.

### actionها

actionها راهی برای سفارشی کردن نحوه تعامل کاربر با notification فراهم می‌کنند.

با ویژگی `actions` می‌توانید مجموعه‌ای از actionهای موجود را تعریف کنید.
هر action به‌شکل دکمه‌ای نمایش داده می‌شود که کاربر برای تعامل با notification می‌تواند روی آن کلیک کند.

افزون بر این، با استفاده از ویژگی `onActionClick` روی شیء `data` می‌توانید هر action را به عملیاتی پیوند دهید که هنگام کلیک روی دکمه متناظر انجام شود:

```json
{
  "notification": {
    "title": "New Notification!",
    "actions": [
      {"action": "foo", "title": "Open new tab"},
      {"action": "bar", "title": "Focus last"},
      {"action": "baz", "title": "Navigate last"},
      {"action": "qux", "title": "Send request in the background"},
      {"action": "other", "title": "Just notify existing clients"}
    ],
    "data": {
      "onActionClick": {
        "default": {"operation": "openWindow"},
        "foo": {"operation": "openWindow", "url": "/absolute/path"},
        "bar": {"operation": "focusLastFocusedOrOpen", "url": "relative/path"},
        "baz": {"operation": "navigateLastFocusedOrOpen", "url": "https://other.domain.com/"},
        "qux": {"operation": "sendRequest", "url": "https://yet.another.domain.com/"}
      }
    }
  }
}
```

IMPORTANT: اگر action دارای entry متناظر در `onActionClick` نباشد، notification بسته شده و به `SwPush.notificationClicks` در clientهای موجود اطلاع داده می‌شود.

## مطالب بیشتر درباره service workerهای Angular

ممکن است مطالب زیر نیز برایتان مفید باشند:

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/communications" title="ارتباط با Service Worker"/>
  <docs-pill href="ecosystem/service-workers/devops" title="DevOps مربوط به Service Worker"/>
</docs-pill-row>
