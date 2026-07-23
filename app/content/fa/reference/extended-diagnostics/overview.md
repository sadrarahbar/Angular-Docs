# عیب‌یابی‌های توسعه‌یافته

الگوهای کدنویسی بسیاری وجود دارند که از نظر فنی برای کامپایلر یا runtime معتبرند، اما نکته‌ها یا محدودیت‌های پیچیده‌ای دارند.
ممکن است این الگوها اثر مورد انتظار توسعه‌دهنده را نداشته باشند و اغلب به bug منجر شوند.
کامپایلر انگولار شامل «عیب‌یابی‌های توسعه‌یافته» است که بسیاری از این الگوها را شناسایی می‌کنند تا درباره مشکلات احتمالی به توسعه‌دهندگان هشدار دهند و best practiceهای رایج را در codebase اعمال کنند.

## عیب‌یابی‌ها

در حال حاضر انگولار از عیب‌یابی‌های توسعه‌یافته زیر پشتیبانی می‌کند:

| کد       | نام                                                                    |
| :------- | :--------------------------------------------------------------------- |
| `NG8101` | [`invalidBananaInBox`](extended-diagnostics/NG8101)                    |
| `NG8102` | [`nullishCoalescingNotNullable`](extended-diagnostics/NG8102)          |
| `NG8103` | [`missingControlFlowDirective`](extended-diagnostics/NG8103)           |
| `NG8104` | [`textAttributeNotBinding`](extended-diagnostics/NG8104)               |
| `NG8105` | [`missingNgForOfLet`](extended-diagnostics/NG8105)                     |
| `NG8106` | [`suffixNotSupported`](extended-diagnostics/NG8106)                    |
| `NG8107` | [`optionalChainNotNullable`](extended-diagnostics/NG8107)              |
| `NG8108` | [`skipHydrationNotStatic`](extended-diagnostics/NG8108)                |
| `NG8109` | [`interpolatedSignalNotInvoked`](extended-diagnostics/NG8109)          |
| `NG8111` | [`uninvokedFunctionInEventBinding`](extended-diagnostics/NG8111)       |
| `NG8113` | [`unusedStandaloneImports`](extended-diagnostics/NG8113)               |
| `NG8114` | [`unparenthesizedNullishCoalescing`](extended-diagnostics/NG8114)      |
| `NG8115` | [`uninvokedTrackFunction`](extended-diagnostics/NG8115)                |
| `NG8116` | [`missingStructuralDirective`](extended-diagnostics/NG8116)            |
| `NG8117` | [`uninvokedFunctionInTextInterpolation`](extended-diagnostics/NG8117)  |
| `NG8021` | [`deferTriggerMisconfiguration`](extended-diagnostics/NG8021)          |

## پیکربندی

عیب‌یابی‌های توسعه‌یافته به‌طور پیش‌فرض warning هستند و مانع کامپایل نمی‌شوند.
هر عیب‌یابی را می‌توان به یکی از حالت‌های زیر پیکربندی کرد:

| دسته خطا      | نتیجه                                                                                                                                                       |
| :------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `warning`     | حالت پیش‌فرض؛ کامپایلر عیب‌یابی را به‌عنوان warning منتشر می‌کند اما مانع کامپایل نمی‌شود. حتی با وجود warning، کامپایلر با status code برابر 0 خارج می‌شود. |
| `error`       | کامپایلر عیب‌یابی را به‌عنوان error منتشر می‌کند و کامپایل را ناموفق می‌سازد. با وجود یک یا چند error، کامپایلر با status code غیرصفر خارج می‌شود.          |
| `suppress`    | کامپایلر این عیب‌یابی را اصلاً منتشر نمی‌کند.                                                                                                               |

شدت بررسی را می‌توان به‌عنوان یک [گزینه کامپایلر انگولار](reference/configs/angular-compiler-options) پیکربندی کرد:

```json
{
  "angularCompilerOptions": {
    "extendedDiagnostics": {
      "checks": {
        "invalidBananaInBox": "suppress"
      },
      "defaultCategory": "error"
    }
  }
}
```

field به نام `checks` نام هر عیب‌یابی را به دسته مرتبط آن نگاشت می‌کند.
برای فهرست کامل عیب‌یابی‌های توسعه‌یافته و نام مورد استفاده برای پیکربندی، بخش [عیب‌یابی‌ها](#diagnostics) را ببینید.

field به نام `defaultCategory` برای همه عیب‌یابی‌هایی استفاده می‌شود که به‌طور صریح در `checks` فهرست نشده‌اند.
اگر تنظیم نشود، این عیب‌یابی‌ها `warning` در نظر گرفته می‌شوند.

عیب‌یابی‌های توسعه‌یافته هنگام فعال بودن [`strictTemplates`](tools/cli/template-typecheck#strict-mode) منتشر می‌شوند.
این تنظیم لازم است تا کامپایلر انواع template انگولار را بهتر درک کند و عیب‌یابی‌های دقیق و معنادار ارائه دهد.

## نسخه‌بندی معنایی

تیم انگولار قصد دارد عیب‌یابی‌های توسعه‌یافته جدید را در نسخه‌های **minor** انگولار اضافه یا فعال کند \([semver](https://docs.npmjs.com/about-semantic-versioning) را ببینید\).
یعنی ارتقای انگولار ممکن است warningهای جدیدی را در codebase موجود نشان دهد.
این رویکرد به تیم اجازه می‌دهد قابلیت‌ها را سریع‌تر ارائه کند و عیب‌یابی‌های توسعه‌یافته را بیشتر در دسترس توسعه‌دهندگان قرار دهد.

بااین‌حال، تنظیم `"defaultCategory": "error"` چنین warningهایی را به error قطعی تبدیل می‌کند.
در نتیجه ممکن است ارتقای نسخه minor باعث ایجاد خطاهای کامپایل شود که می‌تواند تغییر ناسازگار با semver تلقی شود.
هر عیب‌یابی جدید را می‌توان از طریق [پیکربندی](#configuration) بالا suppress کرد یا به warning کاهش داد؛ بنابراین اثر عیب‌یابی جدید روی پروژه‌هایی که به‌طور پیش‌فرض آن‌ها را error در نظر می‌گیرند باید حداقل باشد.
قرار دادن حالت پیش‌فرض روی error ابزار بسیار قدرتمندی است؛ هنگام تصمیم‌گیری درباره مناسب بودن `error` به‌عنوان مقدار پیش‌فرض پروژه، این محدودیت semver را در نظر داشته باشید.

## عیب‌یابی‌های جدید

تیم انگولار همیشه از پیشنهاد برای عیب‌یابی‌های جدید استقبال می‌کند.
عیب‌یابی توسعه‌یافته معمولاً باید:

- یک اشتباه رایج و غیرآشکار توسعه‌دهنده در templateهای انگولار را شناسایی کند
- روشن توضیح دهد چرا این الگو ممکن است به bug یا رفتار ناخواسته منجر شود
- یک یا چند راه‌حل واضح پیشنهاد کند
- نرخ false-positive اندک و ترجیحاً صفر داشته باشد
- برای بیشتر applicationهای انگولار کاربرد داشته باشد و مختص کتابخانه‌ای غیررسمی نباشد
- درستی یا performance برنامه را بهبود دهد، نه style را؛ مسئولیت style بر عهده linter است

اگر ایده‌ای برای عیب‌یابی توسعه‌یافته متناسب با این معیارها دارید، یک [درخواست قابلیت](https://github.com/angular/angular/issues/new?template=2-feature-request.yaml) ثبت کنید.
