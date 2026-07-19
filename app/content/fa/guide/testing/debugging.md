# debug کردن testها

اگر testهای شما آن‌طور که انتظار دارید کار نمی‌کنند، می‌توانید آن‌ها را هم در environment پیش‌فرض Node.js و هم در یک مرورگر واقعی debug کنید.

## debug کردن در Node.js

debug کردن در environment پیش‌فرض Node.js اغلب سریع‌ترین راه برای تشخیص issueهایی است که به APIهای خاص مرورگر یا rendering مربوط نیستند.

1.  command مربوط به `ng test` را با flag مربوط به `--debug` اجرا کنید:
    ```shell
    ng test --debug
    ```
2.  test runner در debug mode شروع می‌شود و منتظر attach شدن debugger می‌ماند.
3.  حالا می‌توانید debugger مورد علاقه‌تان را attach کنید. برای مثال، می‌توانید از debugger داخلی Node.js در VS Code یا Chrome DevTools برای Node.js استفاده کنید.

## debug کردن در مرورگر

همان‌طور که در Node یک debugging session را شروع می‌کنید، می‌توانید `ng test` را با flag مربوط به `--debug` همراه با Vitest و [browser mode](/guide/testing/migrating-to-vitest#5-configure-browser-mode-optional) استفاده کنید.

test runner در debug mode شروع می‌شود و منتظر می‌ماند تا browser devtools را برای debug کردن testها باز کنید.

