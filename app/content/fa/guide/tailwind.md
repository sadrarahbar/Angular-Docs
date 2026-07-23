# استفاده از Tailwind CSS با انگولار

[Tailwind CSS](https://tailwindcss.com/) یک فریم‌ورک CSS مبتنی بر utility است که با آن می‌توانید بدون خارج شدن از HTML، وب‌سایت‌های مدرن بسازید. این راهنما شما را در راه‌اندازی Tailwind CSS در پروژه انگولار همراهی می‌کند.

## راه‌اندازی خودکار با `ng add`

Angular CLI با استفاده از فرمان `ng add` راهی ساده برای یکپارچه‌سازی Tailwind CSS با پروژه فراهم می‌کند. این فرمان packageهای لازم را خودکار نصب، Tailwind CSS را پیکربندی و تنظیمات build پروژه را به‌روزرسانی می‌کند.

ابتدا در terminal به دایرکتوری ریشه پروژه انگولار بروید و فرمان زیر را اجرا کنید:

```shell
ng add tailwindcss
```

این فرمان کارهای زیر را انجام می‌دهد:

- `tailwindcss` و peer dependencyهای آن را نصب می‌کند.
- پروژه را برای استفاده از Tailwind CSS پیکربندی می‌کند.
- statement مربوط به `@import` در Tailwind CSS را به styleهای شما می‌افزاید.

پس از اجرای `ng add tailwindcss` می‌توانید بلافاصله استفاده از classهای utility مربوط به Tailwind را در templateهای component آغاز کنید.

## راه‌اندازی دستی (روش جایگزین)

اگر ترجیح می‌دهید Tailwind CSS را دستی راه‌اندازی کنید، مراحل زیر را انجام دهید:

### 1. ایجاد یک پروژه انگولار

اگر هنوز پروژه انگولار ندارید، ابتدا یک پروژه جدید ایجاد کنید.

```shell
ng new my-project
cd my-project
```

### 2. نصب Tailwind CSS

سپس terminal را در دایرکتوری ریشه پروژه انگولار باز کنید و برای نصب Tailwind CSS و peer dependencyهای آن فرمان زیر را اجرا کنید:

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install tailwindcss @tailwindcss/postcss postcss
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add tailwindcss @tailwindcss/postcss postcss
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add tailwindcss @tailwindcss/postcss postcss
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add tailwindcss @tailwindcss/postcss postcss
  </docs-code>
</docs-code-multifile>

### 3. پیکربندی pluginهای PostCSS

سپس فایل `.postcssrc.json` را در ریشه فایل‌های پروژه اضافه کنید.
plugin به نام `@tailwindcss/postcss` را به پیکربندی PostCSS بیفزایید.

```json {header: '.postcssrc.json'}
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

### 4. import کردن Tailwind CSS

یک `@import` به `./src/styles.css` اضافه کنید که Tailwind CSS را import کند.

```css {header: "src/styles.css"}
@import 'tailwindcss';
```

اگر از SCSS استفاده می‌کنید، `@use` را به `./src/styles.scss` اضافه کنید.

```scss {header: "src/styles.scss"}
@use 'tailwindcss';
```

### 5. شروع استفاده از Tailwind در پروژه

اکنون می‌توانید با classهای utility مربوط به Tailwind، templateهای component را styleدهی کنید. فرایند build را با `ng serve` اجرا کنید؛ heading باید با style تعیین‌شده نمایش داده شود.

برای نمونه، می‌توانید کد زیر را به فایل `app.html` اضافه کنید:

```html
<h1 class="text-3xl font-bold underline">Hello world!</h1>
```

## منابع بیشتر

- [مستندات Tailwind CSS](https://tailwindcss.com/docs)
