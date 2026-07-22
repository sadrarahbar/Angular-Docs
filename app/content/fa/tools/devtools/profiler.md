# پروفایل‌گیری از برنامه

زبانه **Profiler** به شما امکان می‌دهد اجرای change detection در Angular را به‌صورت بصری مشاهده کنید.
این قابلیت برای تشخیص زمان و نحوه تأثیر change detection بر عملکرد برنامه مفید است.

<img src="assets/images/guide/devtools/profiler.png" alt="تصویری از زبانه 'Profiler' که در آن نوشته شده است: 'برای شروع ضبط جدید روی دکمه پخش کلیک کنید، یا یک فایل json حاوی داده‌های profiler بارگذاری کنید.' در کنار این متن، یک دکمه ضبط برای آغاز پروفایل جدید و یک انتخابگر فایل برای انتخاب پروفایل موجود دیده می‌شود.">

زبانه Profiler به شما اجازه می‌دهد پروفایل‌گیری از برنامه فعلی را آغاز کنید یا پروفایلی را از اجرای قبلی وارد کنید.
برای شروع پروفایل‌گیری از برنامه، در زبانه **Profiler** نشانگر را روی دایره گوشه بالا سمت چپ ببرید و روی **Start recording** کلیک کنید.

هنگام پروفایل‌گیری، Angular DevTools رویدادهای اجرایی مانند change detection و اجرای lifecycle hookها را ثبت می‌کند.
با برنامه تعامل کنید تا change detection اجرا شود و داده‌های موردنیاز Angular DevTools تولید شوند.
برای پایان ضبط، دوباره روی دایره کلیک کنید تا **Stop recording** انجام شود.

همچنین می‌توانید یک ضبط موجود را وارد کنید.
درباره این قابلیت در بخش [وارد کردن ضبط](tools/devtools/profiler#import-and-export-recordings) بیشتر بخوانید.

## درک نحوه اجرای برنامه

پس از ضبط یا وارد کردن یک پروفایل، Angular DevTools نمایی بصری از چرخه‌های change detection نمایش می‌دهد.

<img src="assets/images/guide/devtools/default-profiler-view.png" alt="تصویری از زبانه 'Profiler' پس از ضبط یا بارگذاری یک پروفایل. این تصویر نمودار میله‌ای چرخه‌های مختلف change detection را همراه با متنی نمایش می‌دهد که می‌گوید: 'برای پیش‌نمایش یک چرخه change detection مشخص، یک میله را انتخاب کنید'.">

هر میله در این توالی، نمایانگر یک چرخه change detection در برنامه است.
هرچه یک میله بلندتر باشد، برنامه زمان بیشتری را در آن چرخه صرف اجرای change detection کرده است.
با انتخاب یک میله، DevTools اطلاعات مفیدی درباره آن نمایش می‌دهد، از جمله:

- نمودار میله‌ای همه componentها و directiveهایی که طی این چرخه ثبت شده‌اند
- مدت‌زمانی که Angular در این چرخه صرف اجرای change detection کرده است.
- نرخ فریم تخمینی از دید کاربر (اگر کمتر از 60fps باشد)

<img src="assets/images/guide/devtools/profiler-selected-bar.png" alt="تصویری از زبانه 'Profiler'. کاربر یک میله را انتخاب کرده و منوی کشویی کناری عبارت 'Bar chart` را نمایش می‌دهد؛ زیر آن نیز نمودار میله‌ای دیگری دیده می‌شود. نمودار جدید دو میله دارد که بیشتر فضا را اشغال کرده‌اند؛ یکی با برچسب `TodosComponent` و دیگری با برچسب `NgForOf`. سایر میله‌ها در مقایسه آن‌قدر کوچک‌اند که می‌توان از آن‌ها چشم‌پوشی کرد.">

## درک نحوه اجرای componentها

نمودار میله‌ای که پس از کلیک روی یک چرخه change detection نمایش داده می‌شود، جزئیات مدت‌زمان صرف‌شده برای اجرای change detection در آن component یا directive مشخص را نشان می‌دهد.

این مثال مجموع زمان صرف‌شده توسط directive با نام `NgForOf` و متدی را که روی آن فراخوانی شده است، نشان می‌دهد.

<img src="assets/images/guide/devtools/directive-details.png" alt="تصویری از زبانه 'Profiler' که در آن میله `NgForOf` انتخاب شده است. در سمت راست، نمای جزئیات `NgForOf` دیده می‌شود که عبارت 'Total time spent: 1.76 ms' را نمایش می‌دهد. این نما جدولی با دقیقاً یک ردیف دارد که `NgForOf` را به‌عنوان یک directive همراه با متد `ngDoCheck` فهرست کرده است؛ اجرای این متد 1.76 ms زمان برده است. همچنین فهرستی با عنوان 'Parent Hierarchy' دارد که componentهای والد این directive را نشان می‌دهد.">

## نماهای سلسله‌مراتبی

<img src="assets/images/guide/devtools/flame-graph-view.png" alt="تصویری از زبانه 'Profiler'. کاربر یک میله را انتخاب کرده و منوی کشویی کناری اکنون عبارت 'Flame graph' را نمایش می‌دهد؛ زیر آن نیز یک flame graph دیده می‌شود. flame graph با ردیفی به نام 'Entire application' و ردیف دیگری به نام 'AppComponent' آغاز می‌شود. زیر آن‌ها، ردیف‌ها به چندین مورد تقسیم می‌شوند که در ردیف سوم با `[RouterOutlet]` و `DemoAppComponent` شروع شده‌اند. چند لایه پایین‌تر، یک خانه با رنگ قرمز برجسته شده است.">

همچنین می‌توانید اجرای change detection را در نمایی شبیه flame graph مشاهده کنید.

هر خانه در نمودار، نمایانگر یک element روی صفحه در موقعیتی مشخص از render tree است.
برای نمونه، چرخه‌ای از change detection را در نظر بگیرید که در آن یک `LoggedOutUserComponent` حذف می‌شود و Angular به‌جای آن یک `LoggedInUserComponent` را render می‌کند. در این حالت، هر دو component در یک خانه نمایش داده می‌شوند.

محور x کل زمان لازم برای render کردن این چرخه change detection را نشان می‌دهد.
محور y سلسله‌مراتب elementها را نشان می‌دهد. اجرای change detection برای یک element مستلزم render کردن directiveها و componentهای فرزند آن است.
این نمودار در مجموع مشخص می‌کند render شدن کدام componentها بیشترین زمان را می‌گیرد و این زمان صرف چه کاری می‌شود.

رنگ هر خانه بر اساس مدت‌زمانی تعیین می‌شود که Angular در آن صرف کرده است.
Angular DevTools شدت رنگ را با مقایسه زمان صرف‌شده با خانه‌ای تعیین می‌کند که render شدن آن بیشترین زمان را برده است.

با کلیک روی یک خانه مشخص، جزئیات آن را در پنل سمت راست می‌بینید.
با دوبار کلیک روی خانه، روی آن بزرگ‌نمایی می‌شود تا فرزندان تودرتوی آن را راحت‌تر ببینید.

## اشکال‌زدایی change detection و componentهای `OnPush`

در حالت عادی، نمودار برای هر فریم change detection مدت‌زمان لازم برای _render_ کردن برنامه را به‌صورت بصری نشان می‌دهد. بااین‌حال، برخی componentها مانند componentهای `OnPush` فقط زمانی دوباره render می‌شوند که input propertyهای آن‌ها تغییر کنند. در بعضی فریم‌ها، مشاهده flame graph بدون این componentها می‌تواند مفید باشد.

برای اینکه فقط componentهایی از یک فریم change detection را ببینید که فرایند change detection را طی کرده‌اند، checkbox مربوط به **Change detection** را در بالای flame graph انتخاب کنید.

این نما همه componentهایی را که change detection را طی کرده‌اند برجسته می‌کند و مواردی را که این فرایند را طی نکرده‌اند به رنگ خاکستری نمایش می‌دهد؛ برای مثال، componentهای `OnPush` که دوباره render نشده‌اند.

<img src="assets/images/guide/devtools/debugging-onpush.png" alt="تصویری از زبانه 'Profiler' که نمای flame chart یک چرخه change detection را نمایش می‌دهد. checkbox با برچسب 'Show only change detection' اکنون انتخاب شده است. flame graph بسیار شبیه قبل است، اما رنگ componentها از نارنجی به آبی تغییر کرده است. چندین خانه با برچسب `[RouterOutlet]` دیگر با هیچ رنگی برجسته نشده‌اند.">

## وارد و صادر کردن ضبط‌ها

برای صادر کردن نشست پروفایل‌گیری ضبط‌شده به‌صورت فایل JSON و ذخیره آن روی دیسک، روی دکمه **Save Profile** در بالا سمت راست کلیک کنید.
بعداً می‌توانید با کلیک روی ورودی **Choose file** در نمای اولیه profiler، فایل را وارد کنید.

<img src="assets/images/guide/devtools/save-profile.png" alt="تصویری از زبانه 'Profiler' که چرخه‌های change detection را نمایش می‌دهد. در سمت راست، دکمه 'Save Profile' دیده می‌شود.">
