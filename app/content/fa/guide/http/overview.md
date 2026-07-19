# درک ارتباط با سرویس‌های backend با استفاده از HTTP

بیشتر برنامه‌های front-end برای download یا upload داده و دسترسی به سرویس‌های دیگر back-end نیاز دارند از طریق protocol مربوط به HTTP با یک server ارتباط برقرار کنند. Angular برای برنامه‌های Angular یک client HTTP API فراهم می‌کند: class مربوط به service به نام `HttpClient` در `@angular/common/http`.

## قابلیت‌های service مربوط به HTTP client

service مربوط به HTTP client قابلیت‌های اصلی زیر را ارائه می‌دهد:

- امکان request کردن [مقدارهای response با type مشخص](guide/http/making-requests#fetching-json-data)
- [مدیریت error](guide/http/making-requests#handling-request-failure) ساده‌تر
- [interception](guide/http/interceptors) برای request و response
- [ابزارهای testing](guide/http/testing) قابل اعتماد

## قدم بعدی چیست؟

<docs-pill-row>
  <docs-pill href="guide/http/setup" title="راه‌اندازی HttpClient"/>
  <docs-pill href="guide/http/making-requests" title="ارسال HTTP request"/>
</docs-pill-row>

