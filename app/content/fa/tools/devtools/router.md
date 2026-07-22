# بررسی Router Tree

زبانه **Router Tree** به شما امکان می‌دهد routing tree برنامه را به‌صورت بصری مشاهده کنید. می‌توانید نحوه تودرتو شدن routeها را بررسی کنید و جزئیات routeهای مشخص را ببینید.

<img src="assets/images/guide/devtools/router-tree.png" alt="تصویری از زبانه 'Router Tree' در Angular DevTools که درختی از routeهای پیکربندی‌شده را نشان می‌دهد. routeهای فعال با رنگ سبز و routeهای غیرفعال با رنگ سفید برجسته شده‌اند.">

### مشاهده جزئیات route

وقتی route مشخصی را در درخت انتخاب می‌کنید، Angular DevTools ویژگی‌های آن را در نوار کناری سمت راست نمایش می‌دهد. این اطلاعات شامل موارد زیر است:

- **Path**: مسیر URL مربوط به route. اگر route از URL matcher سفارشی استفاده کند، DevTools به‌جای آن **Matcher** را نمایش می‌دهد.
- **Component**: componentی که برای این route render می‌شود. اگر route یک redirect باشد، DevTools به‌جای آن مقصد **Redirect to** را نمایش می‌دهد.
- **Path Match**: راهبرد تطبیق مسیر (`prefix` یا `full`)، در صورت پیکربندی.
- **Data**: داده‌های ایستای مرتبط با route که به‌شکل یک درخت JSON نمایش داده می‌شوند.
- **Resolvers**: resolverهای route که به‌صورت جفت‌های key-value نمایش داده می‌شوند.
- **Guards**: همه guardهای پیکربندی‌شده روی route که بر اساس type گروه‌بندی می‌شوند — `canActivate`، `canActivateChild`، `canDeactivate` و `canMatch`.
- **Providers**: providerهای سطح route، در صورت پیکربندی.
- **Title**: عنوان route، در صورت پیکربندی.
- **RunGuardsAndResolvers**: راهبرد اجرای مجدد guardها و resolverها، در صورت پیکربندی.
- **Active**: مشخص می‌کند آیا این route در حال حاضر فعال است یا نه.
- **Auxiliary**: مشخص می‌کند آیا route از نوع auxiliary است یا نه (برای مثال، در یک outlet نام‌گذاری‌شده).
- **Lazy**: مشخص می‌کند آیا route به‌صورت lazy بارگذاری شده است یا نه.

نکته: ویژگی‌هایی مانند Path Match، Data، Resolvers، Guards، Providers، Title و RunGuardsAndResolvers فقط زمانی در نوار کناری ظاهر می‌شوند که روی route انتخاب‌شده پیکربندی شده باشند.

### رفتن به یک route مشخص

می‌توانید navigation را به‌سادگی و مستقیماً از DevTools آغاز کنید. هنگام بررسی جزئیات یک route در نوار کناری سمت راست، روی آیکون **Navigate** در کنار رشته path کلیک کنید. با این کار، Angular router به آن URL در برنامه navigation می‌کند.

<img src="assets/images/guide/devtools/router-tree-navigate.png" alt="تصویری که tooltip با عنوان 'Navigate to' را روی path مربوط به route در نوار کناری 'Routes Details' نشان می‌دهد.">
