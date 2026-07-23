# pipeline سفارشی build

هنگام build کردن برنامه Angular، قویاً توصیه می‌کنیم برای بهره‌مندی از قابلیت به‌روزرسانی وابسته به ساختار و abstraction سیستم build آن، از Angular CLI استفاده کنید. به این ترتیب پروژه‌های شما از تازه‌ترین بهبودهای امنیت، عملکرد و API و نیز بهبودهای شفاف build بهره‌مند می‌شوند.

این صفحه **موارد استفاده نادری** را بررسی می‌کند که در آن‌ها به pipeline سفارشی build بدون Angular CLI نیاز دارید. همه ابزارهای فهرست‌شده در ادامه pluginهای متن‌باز build هستند که اعضای جامعه Angular نگهداری می‌کنند. برای آگاهی بیشتر از مدل پشتیبانی و وضعیت نگهداری آن‌ها، مستندات و URLهای repository آن‌ها در GitHub را ببینید.

## چه زمانی باید از pipeline سفارشی build استفاده کنید؟

در چند مورد استفاده خاص ممکن است بخواهید pipeline سفارشی build را نگهداری کنید. برای نمونه:

- برنامه‌ای موجود با toolchain متفاوت دارید و می‌خواهید Angular را به آن اضافه کنید
- به‌شدت به [module federation](https://module-federation.io/) وابسته‌اید و نمی‌توانید [native federation](https://www.npmjs.com/package/@angular-architects/native-federation) مستقل از bundler را بپذیرید
- می‌خواهید آزمایشی کوتاه‌مدت با ابزار build دلخواه خود ایجاد کنید

## گزینه‌های موجود کدام‌اند؟

در حال حاضر دو ابزار جامعه با پشتیبانی مناسب وجود دارند که امکان ایجاد pipeline سفارشی build را با [plugin مربوط به Vite](https://www.npmjs.com/package/@analogjs/vite-plugin-angular) و [plugin مربوط به Rspack](https://www.npmjs.com/package/@nx/angular-rspack) فراهم می‌کنند. هر دو از abstractionهای زیربنایی Angular CLI استفاده می‌کنند. آن‌ها امکان ایجاد pipeline منعطف build را فراهم می‌کنند، اما به نگهداری دستی نیاز دارند و تجربه به‌روزرسانی خودکاری ارائه نمی‌دهند.

### Rspack

Rspack یک bundler مبتنی بر Rust است که سازگاری با اکوسیستم pluginهای webpack را هدف می‌گیرد.

اگر پروژه شما وابستگی زیادی به اکوسیستم webpack دارد و به‌شدت به پیکربندی سفارشی webpack متکی است، می‌توانید برای بهبود زمان build از Rspack بهره بگیرید.

اطلاعات بیشتر درباره Angular Rspack را می‌توانید در [وب‌سایت مستندات](https://nx.dev/recipes/angular/rspack/introduction) پروژه بیابید.

### Vite

Vite یک ابزار frontend برای build است که تجربه توسعه سریع‌تر و سبک‌تری را برای پروژه‌های مدرن وب هدف می‌گیرد. Vite از طریق سیستم plugin خود نیز قابل‌گسترش است؛ این سیستم به اکوسیستم‌ها اجازه می‌دهد integrationهایی با Vite بسازند، مانند Vitest برای تست unit و مرورگر، Storybook برای نوشتن کامپوننت‌ها به‌صورت مستقل و موارد دیگر. Angular CLI نیز از Vite به‌عنوان development server خود استفاده می‌کند.

[plugin مربوط به AnalogJS Vite برای Angular](https://www.npmjs.com/package/@analogjs/vite-plugin-angular) امکان استفاده از Angular را در پروژه یا frameworkای فراهم می‌کند که از Vite استفاده می‌کند یا بر پایه آن ساخته شده است. این کاربرد می‌تواند شامل توسعه و build مستقیم پروژه Angular با Vite یا افزودن Angular به پروژه یا pipeline موجود باشد. یک نمونه، یکپارچه‌سازی کامپوننت‌های UI مربوط به Angular در وب‌سایت مستندات با استفاده از [Astro و Starlight](https://analogjs.org/docs/packages/astro-angular/overview) است.

می‌توانید در [صفحه مستندات](https://analogjs.org/docs/packages/vite-plugin-angular/overview) با AnalogJS و نحوه استفاده از plugin بیشتر آشنا شوید.
