# Deploy کردن چند locale

اگر `myapp` directoryای باشد که فایل‌های distributable پروژه شما را در خود دارد، معمولاً نسخه‌های مختلف را برای localeهای مختلف در directoryهای locale در دسترس قرار می‌دهید.
برای مثال، نسخه French شما در directory مربوط به `myapp/fr` و نسخه Spanish در directory مربوط به `myapp/es` قرار می‌گیرد.

tag مربوط به HTML `base` همراه با attribute مربوط به `href`، base URI یا URL را برای relative linkها مشخص می‌کند.
اگر option مربوط به `"localize"` را در فایل build configuration مربوط به workspace یعنی [`angular.json`][GuideWorkspaceConfig] روی `true` یا روی آرایه‌ای از locale IDها بگذارید، CLI مقدار base `href` را برای هر نسخه application تنظیم می‌کند.
برای تنظیم base `href` برای هر نسخه application، CLI locale را به `"subPath"` configureشده اضافه می‌کند.
`"subPath"` را برای هر locale در فایل build configuration مربوط به workspace یعنی [`angular.json`][GuideWorkspaceConfig] مشخص کنید.
مثال زیر `"subPath"` را با string خالی نشان می‌دهد.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" region="i18n-subPath"/>

## Configure کردن server

Deployment معمول چند language، هر language را از یک subdirectory متفاوت serve می‌کند.
کاربران با استفاده از HTTP header مربوط به `Accept-Language` به language ترجیحی تعریف‌شده در browser redirect می‌شوند.
اگر کاربر language ترجیحی تعریف نکرده باشد، یا اگر language ترجیحی در دسترس نباشد، server به language پیش‌فرض fallback می‌کند.
برای تغییر language، location فعلی خود را به subdirectory دیگری تغییر دهید.
تغییر subdirectory اغلب با menuای انجام می‌شود که در application پیاده‌سازی شده است.

برای اطلاعات بیشتر درباره deploy کردن appها روی remote server، [Deployment][GuideDeployment] را ببینید.

IMPORTANT: اگر از [Server rendering](guide/ssr) با `outputMode` تنظیم‌شده روی `server` استفاده می‌کنید، Angular به صورت خودکار redirection را بر اساس HTTP header مربوط به `Accept-Language` به شکل dynamic مدیریت می‌کند. این کار deployment را با حذف نیاز به تنظیم دستی server یا configuration ساده‌تر می‌کند.

### مثال Nginx

مثال زیر یک Nginx configuration را نمایش می‌دهد.

<docs-code path="adev/src/content/examples/i18n/doc-files/nginx.conf" language="nginx"/>

### مثال Apache

مثال زیر یک Apache configuration را نمایش می‌دهد.

<docs-code path="adev/src/content/examples/i18n/doc-files/apache2.conf" language="apache"/>

[CliBuild]: cli/build 'ng build | CLI | Angular'
[GuideDeployment]: tools/cli/deployment 'Deployment | Angular'
[GuideWorkspaceConfig]: reference/configs/workspace-config 'Angular workspace configuration | Angular'
