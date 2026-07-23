# الگوی App shell

[الگوی App shell](https://developer.chrome.com/blog/app-shell) روشی برای render کردن بخشی از برنامه از طریق یک route هنگام build است.
این الگو با راه‌اندازی سریع یک صفحه renderشده ثابت \(اسکلتی مشترک میان همه صفحه‌ها\)، در حالی که مرورگر نسخه کامل client را دانلود می‌کند و پس از بارگذاری کد به‌طور خودکار به آن تغییر می‌دهد، تجربه کاربر را بهبود می‌بخشد.

به این ترتیب نخستین paint معنادار برنامه به‌سرعت به کاربران نمایش داده می‌شود، زیرا مرورگر می‌تواند HTML و CSS را بدون نیاز به مقداردهی اولیه JavaScript render کند.

<docs-workflow>
<docs-step title="آماده‌سازی برنامه">
این کار را با دستور زیر در Angular CLI انجام دهید:

```shell
ng new my-app
```

برای برنامه موجود، باید `Router` را به‌صورت دستی اضافه کرده و یک `<router-outlet>` درون برنامه تعریف کنید.
</docs-step>
<docs-step title="ساخت application shell">
برای ساخت خودکار application shell از Angular CLI استفاده کنید.

```shell
ng generate app-shell
```

برای اطلاعات بیشتر درباره این دستور، [دستور App shell](cli/generate/app-shell) را ببینید.

این دستور کد برنامه را به‌روزرسانی کرده و فایل‌های بیشتری به ساختار پروژه اضافه می‌کند.

```text
src
├── app
│ ├── app.config.server.ts # server application configuration
│ └── app-shell # app-shell component
│   ├── app-shell.component.html
│   ├── app-shell.component.scss
│   ├── app-shell.component.spec.ts
│   └── app-shell.component.ts
└── main.server.ts # main server application bootstrapping
```

<docs-step title="بررسی build شدن برنامه با محتوای shell">

```shell
ng build --configuration=development
```

یا برای استفاده از پیکربندی production:

```shell
ng build
```

برای بررسی خروجی build، فایل <code class="no-auto-link">dist/my-app/browser/index.html</code> را باز کنید.
متن پیش‌فرض `app-shell works!` را پیدا کنید؛ وجود آن نشان می‌دهد route مربوط به application shell به‌عنوان بخشی از خروجی render شده است.
</docs-step>
</docs-workflow>
