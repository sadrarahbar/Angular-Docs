<docs-decorative-header title="Routing در Angular" imgSrc="adev/src/assets/images/routing.svg"> <!-- markdownlint-disable-line -->
Routing کمک می‌کند در یک single-page app چیزی را که کاربر می‌بیند تغییر دهید.
</docs-decorative-header>

Angular Router (`@angular/router`) کتابخانه رسمی برای مدیریت navigation در applicationهای Angular و یکی از بخش‌های اصلی framework است. این کتابخانه به‌صورت پیش‌فرض در همه پروژه‌هایی که با Angular CLI ساخته می‌شوند وجود دارد.

## چرا routing در یک SPA لازم است؟

وقتی در مرورگر وب به یک URL می‌روید، مرورگر معمولا یک network request به web server می‌فرستد و صفحه HTML برگشتی را نمایش می‌دهد. وقتی به URL دیگری می‌روید، مثلا با کلیک روی یک link، مرورگر یک network request دیگر می‌فرستد و کل صفحه را با صفحه‌ای جدید جایگزین می‌کند.

یک single-page application یا SPA از این جهت متفاوت است که مرورگر فقط برای صفحه اول، یعنی `index.html`، از web server درخواست می‌فرستد. بعد از آن، یک client-side router کنترل را به‌دست می‌گیرد و بر اساس URL مشخص می‌کند چه محتوایی نمایش داده شود. وقتی کاربر به URL دیگری می‌رود، router محتوای صفحه را در همان‌جا به‌روزرسانی می‌کند، بدون اینکه full-page reload رخ دهد.

## Angular چطور routing را مدیریت می‌کند

Routing در Angular از سه بخش اصلی تشکیل شده است:

1. **Routes** مشخص می‌کنند وقتی کاربر یک URL خاص را باز می‌کند، کدام component نمایش داده شود.
2. **Outlets** جای‌نگهدارهایی در templateهای شما هستند که componentها را بر اساس route فعال به‌صورت dynamic load و render می‌کنند.
3. **Links** راهی فراهم می‌کنند تا کاربران بدون full page reload بین routeهای مختلف application جابه‌جا شوند.

علاوه بر این، کتابخانه Angular Routing قابلیت‌های دیگری هم ارائه می‌کند، از جمله:

- Nested routes
- Programmatic navigation
- Route params، queryها و wildcardها
- اطلاعات route فعال با `ActivatedRoute`
- View transition effectها
- Navigation guardها

## قدم بعدی

یاد بگیرید چطور می‌توانید [routeها را با Angular router تعریف کنید](/guide/routing/define-routes).
