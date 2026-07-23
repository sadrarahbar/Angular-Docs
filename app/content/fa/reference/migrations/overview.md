# مهاجرت‌ها

با روش مهاجرت تدریجی پروژه موجود Angular به جدیدترین قابلیت‌ها آشنا شوید.

<docs-card-container>
  <docs-card title="Standalone" link="اکنون مهاجرت کنید" href="reference/migrations/standalone">
    componentهای standalone روشی ساده‌تر برای ساخت برنامه‌های Angular فراهم می‌کنند. این componentها dependencyهای خود را مستقیماً مشخص می‌کنند و آن‌ها را از NgModuleها دریافت نمی‌کنند.
  </docs-card>
  <docs-card title="syntax مربوط به Control Flow" link="اکنون مهاجرت کنید" href="reference/migrations/control-flow">
    syntax داخلی Control Flow به شما امکان می‌دهد از syntax روان‌تر و نزدیک به JavaScript با type checking بهتر استفاده کنید. این قابلیت نیاز به import کردن `CommonModule` برای استفاده از `*ngFor`،‏ `*ngIf` و `*ngSwitch` را برطرف می‌کند.
  </docs-card>
  <docs-card title="تابع inject()" link="اکنون مهاجرت کنید" href="reference/migrations/inject-function">
    تابع [`inject`](/api/core/inject) در Angular در مقایسه با injection مبتنی بر constructor، نوع‌های دقیق‌تر و سازگاری بهتری با decoratorهای استاندارد ارائه می‌دهد.
  </docs-card>
  <docs-card title="routeهای lazy-loaded" link="اکنون مهاجرت کنید" href="reference/migrations/route-lazy-loading">
    routeهای component با بارگذاری eager را به نوع lazy-loaded تبدیل کنید. به این ترتیب فرایند build می‌تواند bundleهای production را به chunkهای کوچک‌تر تقسیم کند تا در بارگذاری اولیه صفحه JavaScript کمتری بارگذاری شود.
  </docs-card>
  <docs-card title="API جدید `input()`" link="اکنون مهاجرت کنید" href="reference/migrations/signal-inputs">
    fieldهای موجود `@Input` را به API جدید signal input تبدیل کنید که اکنون برای production آماده است.
  </docs-card>
  <docs-card title="تابع جدید `output()`" link="اکنون مهاجرت کنید" href="reference/migrations/outputs">
    eventهای سفارشی موجود `@Output` را به تابع جدید output تبدیل کنید که اکنون برای production آماده است.
  </docs-card>
  <docs-card title="queryها به‌عنوان signal" link="اکنون مهاجرت کنید" href="reference/migrations/signal-queries">
    fieldهای query موجود مبتنی بر decorator را به API بهبودیافته signal query تبدیل کنید. این API اکنون برای production آماده است.
  </docs-card>
  <docs-card title="پاک‌سازی importهای بدون استفاده" link="اکنون امتحان کنید" href="reference/migrations/cleanup-unused-imports">
    importهای بدون استفاده را در پروژه پاک‌سازی کنید.
  </docs-card>
  <docs-card title="تگ‌های self-closing" link="اکنون مهاجرت کنید" href="reference/migrations/self-closing-tags">
    templateهای component را در موارد ممکن به استفاده از تگ‌های self-closing تبدیل کنید.
  </docs-card>
  <docs-card title="تبدیل NgClass به class binding" link="اکنون مهاجرت کنید" href="reference/migrations/ngclass-to-class">
      templateهای component را در موارد ممکن به استفاده از class binding به‌جای directiveهای `NgClass` تبدیل کنید.
  </docs-card>
  <docs-card title="تبدیل NgStyle به style binding" link="اکنون مهاجرت کنید" href="reference/migrations/ngstyle-to-style">
      templateهای component را در موارد ممکن به استفاده از style binding به‌جای directiveهای `NgStyle` تبدیل کنید.
  </docs-card>
  <docs-card title="مهاجرت RouterTestingModule" link="اکنون مهاجرت کنید" href="reference/migrations/router-testing-module-migration">
    کاربردهای `RouterTestingModule` را در پیکربندی TestBed به `RouterModule` تبدیل کنید و در صورت نیاز `provideLocationMocks()` را اضافه کنید.
  </docs-card>
  <docs-card title="تبدیل CommonModule به importهای standalone" link="اکنون مهاجرت کنید" href="reference/migrations/common-to-standalone">
    در موارد ممکن importهای `CommonModule` را با import جداگانه directiveها و pipeهای استفاده‌شده در template جایگزین کنید.
  </docs-card>
</docs-card-container>
