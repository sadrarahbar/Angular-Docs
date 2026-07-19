<docs-decorative-header title="نصب" imgSrc="adev/src/assets/images/what_is_angular.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

با starterهای آنلاین یا به صورت محلی از طریق terminal، سریع کار با Angular را شروع کنید.

## اجرای آنلاین

اگر فقط می‌خواهید بدون راه‌اندازی یک پروژه، Angular را در مرورگر خود امتحان کنید، می‌توانید از sandbox آنلاین ما استفاده کنید:

<docs-card title="Playground" href="/playground" link="باز کردن در Playground" iconImgSrc="adev/src/assets/icons/playground.svg" titleInline>
سریع‌ترین راه برای کار کردن با یک برنامه Angular. هیچ راه‌اندازی‌ای لازم نیست.
</docs-card>

## راه‌اندازی یک پروژه جدید به صورت محلی

اگر در حال شروع یک پروژه جدید هستید، به احتمال زیاد می‌خواهید یک پروژه محلی بسازید تا بتوانید از ابزارهایی مثل Git استفاده کنید.

### پیش‌نیازها

- **Node.js** - [v20.19.0 یا جدیدتر](/reference/versions)
- **Text editor** - ما [Visual Studio Code](https://code.visualstudio.com/) را پیشنهاد می‌کنیم
- **Terminal** - برای اجرای commandهای [Angular CLI](/tools/cli) لازم است
- **Development Tool** - برای بهتر شدن جریان توسعه، [Angular Language Service](/tools/language-service) را پیشنهاد می‌کنیم

### دستورالعمل‌ها

راهنمای زیر شما را مرحله‌به‌مرحله با راه‌اندازی یک پروژه محلی Angular همراه می‌کند.

#### نصب Angular CLI

یک terminal باز کنید؛ اگر از [Visual Studio Code](https://code.visualstudio.com/) استفاده می‌کنید، می‌توانید یک [integrated terminal](https://code.visualstudio.com/docs/editor/integrated-terminal) باز کنید. سپس command زیر را اجرا کنید:

<docs-code-multifile>
  <docs-code
    header="npm"
    language="shell"
    >
    npm install -g @angular/cli
    </docs-code>
  <docs-code
    header="pnpm"
    language="shell"
    >
    pnpm install -g @angular/cli
    </docs-code>
  <docs-code
    header="yarn"
    language="shell"
    >
    yarn global add @angular/cli
    </docs-code>
  <docs-code
    header="bun"
    language="shell"
    >
    bun install -g @angular/cli
    </docs-code>
</docs-code-multifile>

اگر در اجرای این command در Windows یا Unix مشکلی دارید، برای اطلاعات بیشتر [مستندات CLI](/tools/cli/setup-local#install-the-angular-cli) را ببینید.

#### ساخت یک پروژه جدید

در terminal خود، command مربوط به CLI یعنی [`ng new`](cli/new) را با نام دلخواه پروژه اجرا کنید. در نمونه‌های زیر، از نام پروژه نمونه `my-first-angular-app` استفاده می‌کنیم.

```shell
ng new <project-name>
```

چند گزینه پیکربندی برای پروژه به شما نمایش داده می‌شود. با کلیدهای جهت‌نما و Enter جابه‌جا شوید و گزینه‌هایی را که می‌خواهید انتخاب کنید.

اگر ترجیح خاصی ندارید، فقط Enter را بزنید تا گزینه‌های پیش‌فرض انتخاب شوند و راه‌اندازی ادامه پیدا کند.

بعد از انتخاب گزینه‌های پیکربندی و اجرای مراحل راه‌اندازی توسط CLI، باید پیام زیر را ببینید:

```text
✔ Packages installed successfully.
    Successfully initialized git.
```

در این مرحله، آماده‌اید پروژه خود را به صورت محلی اجرا کنید!

#### اجرای پروژه جدید به صورت محلی

در terminal خود وارد پروژه جدید Angular شوید.

```shell
cd my-first-angular-app
```

در این مرحله همه dependencyهای شما باید نصب شده باشند؛ می‌توانید این را با بررسی وجود پوشه `node_modules` در پروژه تأیید کنید. سپس می‌توانید پروژه را با اجرای command زیر شروع کنید:

```shell
npm start
```

اگر همه چیز موفقیت‌آمیز باشد، باید یک پیام تأیید مشابه در terminal ببینید:

```text
Watch mode enabled. Watching for file changes...
NOTE: Raw file sizes do not reflect development server per-request transformations.
  ➜  Local:   http://localhost:4200/
  ➜  press h + enter to show help
```

حالا می‌توانید مسیر نمایش‌داده‌شده در `Local`، برای مثال `http://localhost:4200`، را باز کنید و برنامه خود را ببینید. کدنویسی خوش بگذرد! 🎉

### استفاده از AI برای توسعه

برای شروع ساخت برنامه در IDE مجهز به AI مورد علاقه‌تان، [قوانین prompt و بهترین روش‌های Angular](/ai/develop-with-ai) را ببینید.

## قدم‌های بعدی

حالا که پروژه Angular خود را ساخته‌اید، می‌توانید در [راهنمای Essentials](/essentials) بیشتر درباره Angular یاد بگیرید یا از راهنماهای عمیق‌تر یک موضوع را انتخاب کنید!
