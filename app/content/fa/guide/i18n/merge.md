# Merge کردن ترجمه‌ها داخل application

برای merge کردن translationهای کامل‌شده داخل پروژه خود، actionهای زیر را انجام دهید.

1. از [Angular CLI][CliMain] برای build کردن یک copy از فایل‌های distributable پروژه خود استفاده کنید.
1. از option مربوط به `"localize"` استفاده کنید تا همه i18n messageها با translationهای معتبر جایگزین شوند و یک localized variant application build شود.
   variant application یک copy کامل از فایل‌های distributable application شماست که برای یک locale ترجمه شده است.

بعد از merge کردن translationها، هر copy distributable از application را با server-side language detection یا subdirectoryهای متفاوت serve کنید.

HELPFUL: برای اطلاعات بیشتر درباره نحوه serve کردن هر copy distributable از application، [deploying multiple locales](guide/i18n/deploy) را ببینید.

برای translation در compile-time، فرایند build از ahead-of-time \(AOT\) compilation استفاده می‌کند تا applicationای کوچک، سریع و آماده اجرا تولید کند.

HELPFUL: برای توضیح دقیق فرایند build، [Building and serving Angular apps][GuideBuild] را ببینید.
فرایند build برای translation fileهایی با format مربوط به `.xlf` یا format دیگری که Angular می‌فهمد، مثل `.xtb`، کار می‌کند.
برای اطلاعات بیشتر درباره formatهای translation file که Angular استفاده می‌کند، [Change the source language file format][GuideI18nCommonTranslationFilesChangeTheSourceLanguageFileFormat] را ببینید.

برای build کردن یک copy distributable جداگانه از application برای هر locale، [localeها را در build configuration تعریف کنید][GuideI18nCommonMergeDefineLocalesInTheBuildConfiguration]؛ در فایل build configuration مربوط به workspace یعنی [`angular.json`][GuideWorkspaceConfig] پروژه خود.

این روش با حذف نیاز به انجام build کامل application برای هر locale، فرایند build را کوتاه‌تر می‌کند.

برای [تولید application variant برای هر locale][GuideI18nCommonMergeGenerateApplicationVariantsForEachLocale]، از option مربوط به `"localize"` در فایل build configuration مربوط به workspace یعنی [`angular.json`][GuideWorkspaceConfig] استفاده کنید.
همچنین برای [build از command line][GuideI18nCommonMergeBuildFromTheCommandLine]، از دستور [`build`][CliBuild] در [Angular CLI][CliMain] همراه با option مربوط به `--localize` استفاده کنید.

HELPFUL: به صورت اختیاری، برای custom locale configuration می‌توانید [build optionهای مشخص را فقط برای یک locale اعمال کنید][GuideI18nCommonMergeApplySpecificBuildOptionsForJustOneLocale].

## تعریف localeها در build configuration

از option پروژه یعنی `i18n` در فایل build configuration مربوط به workspace یعنی [`angular.json`][GuideWorkspaceConfig] پروژه خود استفاده کنید تا localeها را برای یک پروژه تعریف کنید.

sub-optionهای زیر source language را مشخص می‌کنند و به compiler می‌گویند translationهای پشتیبانی‌شده پروژه را کجا پیدا کند.

| Suboption      | جزئیات                                                                                                                                                |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sourceLocale` | localeای که داخل source code برنامه استفاده می‌کنید \(`en-US` به صورت پیش‌فرض\). همچنین می‌تواند objectای با propertyهای `code`، `baseHref` و `subPath` باشد. |
| `locales`      | mapای از locale identifierها به translation fileها. هر entry همچنین می‌تواند objectای با propertyهای `translation`، `baseHref` و `subPath` باشد.           |

برای فهرست کامل propertyهای `i18n` و typeهایشان، [i18n options][GuideWorkspaceConfigI18n] را ببینید.

### مثال `angular.json` برای `en-US` و `fr`

برای مثال، excerpt زیر از فایل build configuration مربوط به workspace یعنی [`angular.json`][GuideWorkspaceConfig]، source locale را روی `en-US` تنظیم می‌کند و path مربوط به translation file برای locale فرانسوی \(`fr`\) را فراهم می‌کند.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" region="locale-config"/>

## تولید application variant برای هر locale

برای استفاده از locale definition خود در build configuration، از option مربوط به `"localize"` در فایل build configuration مربوط به workspace یعنی [`angular.json`][GuideWorkspaceConfig] استفاده کنید تا به CLI بگویید کدام localeها را برای build configuration تولید کند.

- `"localize"` را روی `true` بگذارید تا همه localeهایی که قبلاً در build configuration تعریف شده‌اند build شوند.
- `"localize"` را روی آرایه‌ای از subset مربوط به locale identifierهای قبلاً تعریف‌شده بگذارید تا فقط همان نسخه‌های locale build شوند.
- `"localize"` را روی `false` بگذارید تا localization غیرفعال شود و هیچ نسخه مخصوص locale تولید نشود.

HELPFUL: برای localize کردن component templateها، ahead-of-time \(AOT\) compilation لازم است.

اگر این setting را تغییر داده‌اید، برای استفاده از AOT مقدار `"aot"` را روی `true` بگذارید.

HELPFUL: به دلیل پیچیدگی‌های deployment در i18n و نیاز به کمینه کردن rebuild time، development server فقط localize کردن یک locale در هر زمان را پشتیبانی می‌کند.
اگر option مربوط به `"localize"` را روی `true` بگذارید، بیش از یک locale تعریف کنید و از `ng serve` استفاده کنید، خطا رخ می‌دهد.
اگر می‌خواهید با یک locale مشخص development کنید، option مربوط به `"localize"` را روی همان locale مشخص تنظیم کنید.
برای مثال، برای French \(`fr`\)، مقدار `"localize": ["fr"]` را مشخص کنید.

CLI، locale data را load و register می‌کند، هر نسخه تولیدشده را در directory مخصوص همان locale قرار می‌دهد تا از نسخه‌های locale دیگر جدا بماند، و directoryها را داخل `outputPath` configureشده برای پروژه قرار می‌دهد.
برای هر application variant، attribute مربوط به `lang` در element مربوط به `html` روی locale تنظیم می‌شود.
CLI همچنین HTML base HREF را برای هر نسخه application با افزودن locale به `baseHref` configureشده تنظیم می‌کند.

property مربوط به `"localize"` را به عنوان shared configuration تنظیم کنید تا عملاً برای همه configurationها inherit شود.
همچنین، property را برای override کردن configurationهای دیگر تنظیم کنید.

### مثال `angular.json` برای include کردن همه localeها از build

مثال زیر option مربوط به `"localize"` را در فایل build configuration مربوط به workspace یعنی [`angular.json`][GuideWorkspaceConfig] روی `true` نشان می‌دهد، تا همه localeهای تعریف‌شده در build configuration build شوند.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" region="build-localize-true"/>

## Build از command line

همچنین از option مربوط به `--localize` همراه با دستور [`ng build`][CliBuild] و configuration موجود `production` خود استفاده کنید.
CLI همه localeهای تعریف‌شده در build configuration را build می‌کند.
اگر localeها را در build configuration تنظیم کرده باشید، شبیه زمانی است که option مربوط به `"localize"` را روی `true` تنظیم می‌کنید.

HELPFUL: برای اطلاعات بیشتر درباره نحوه تنظیم localeها، [Generate application variants for each locale][GuideI18nCommonMergeGenerateApplicationVariantsForEachLocale] را ببینید.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" region="build-localize"/>

## اعمال build optionهای مشخص فقط برای یک locale

برای اعمال build optionهای مشخص فقط روی یک locale، یک locale منفرد را مشخص کنید تا یک custom locale-specific configuration ساخته شود.

IMPORTANT: از development server مربوط به [Angular CLI][CliMain] یعنی \(`ng serve`\) فقط با یک locale استفاده کنید.

### مثال build برای French

مثال زیر یک custom locale-specific configuration با استفاده از یک locale منفرد را نمایش می‌دهد.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" region="build-single-locale"/>

این configuration را به دستورهای `ng serve` یا `ng build` پاس دهید.
مثال code زیر نشان می‌دهد چطور فایل زبان French را serve کنید.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" region="serve-french"/>

برای production buildها، از configuration composition برای اجرای هر دو configuration استفاده کنید.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" region="build-production-french"/>

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" region="build-production-french" />

## گزارش translationهای missing

وقتی translationای missing باشد، build موفق می‌شود اما warningای مثل `Missing translation for message "{translation_text}"` تولید می‌کند.
برای configure کردن level مربوط به warningای که compiler Angular تولید می‌کند، یکی از levelهای زیر را مشخص کنید.

| Warning level | جزئیات                                              | Output                                                 |
| :------------ | :--------------------------------------------------- | :----------------------------------------------------- |
| `error`       | error پرتاب می‌کند و build fail می‌شود                   | n/a                                                    |
| `ignore`      | هیچ کاری انجام نمی‌دهد                                           | n/a                                                    |
| `warning`     | warning پیش‌فرض را در console یا shell نمایش می‌دهد | `Missing translation for message "{translation_text}"` |

warning level را در section مربوط به `options` برای target مربوط به `build` در فایل build configuration مربوط به workspace یعنی [`angular.json`][GuideWorkspaceConfig] مشخص کنید.

### مثال warning با `error` در `angular.json`

مثال زیر نشان می‌دهد چطور warning level را روی `error` تنظیم کنید.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" region="missing-translation-error" />

HELPFUL: وقتی پروژه Angular خود را به یک Angular application compile می‌کنید، instanceهای attribute مربوط به `i18n` با instanceهای tagged message string مربوط به [`$localize`][ApiLocalizeInitLocalize] جایگزین می‌شوند.
این یعنی Angular application شما بعد از compilation ترجمه می‌شود.
همچنین یعنی می‌توانید نسخه‌های localized از Angular application خود بسازید، بدون اینکه کل پروژه Angular را برای هر locale دوباره compile کنید.

وقتی Angular application خود را ترجمه می‌کنید، _translation transformation_ بخش‌های \(static stringها و expressionها\) template literal string را با stringهایی از مجموعه‌ای از translationها جایگزین و reorder می‌کند.
برای اطلاعات بیشتر، [`$localize`][ApiLocalizeInitLocalize] را ببینید.

TLDR: یک بار compile کنید، سپس برای هر locale ترجمه کنید.

## قدم بعدی

<docs-pill-row>
  <docs-pill href="guide/i18n/deploy" title="Deploy کردن چند locale"/>
</docs-pill-row>

[ApiLocalizeInitLocalize]: api/localize/init/$localize '$localize | init - localize - API | Angular'
[CliMain]: cli 'CLI Overview and Command Reference | Angular'
[CliBuild]: cli/build 'ng build | CLI | Angular'
[GuideBuild]: tools/cli/build 'Building and serving Angular apps | Angular'
[GuideI18nCommonMergeApplySpecificBuildOptionsForJustOneLocale]: guide/i18n/merge#apply-specific-build-options-for-just-one-locale 'Apply specific build options for just one locale - Merge translations into the application | Angular'
[GuideI18nCommonMergeBuildFromTheCommandLine]: guide/i18n/merge#build-from-the-command-line 'Build from the command line - Merge translations into the application | Angular'
[GuideI18nCommonMergeDefineLocalesInTheBuildConfiguration]: guide/i18n/merge#define-locales-in-the-build-configuration 'Define locales in the build configuration - Merge translations into the application | Angular'
[GuideI18nCommonMergeGenerateApplicationVariantsForEachLocale]: guide/i18n/merge#generate-application-variants-for-each-locale 'Generate application variants for each locale - Merge translations into the application | Angular'
[GuideI18nCommonTranslationFilesChangeTheSourceLanguageFileFormat]: guide/i18n/translation-files#change-the-source-language-file-format 'Change the source language file format - Work with translation files | Angular'
[GuideWorkspaceConfig]: reference/configs/workspace-config 'Angular workspace configuration | Angular'
[GuideWorkspaceConfigI18n]: reference/configs/workspace-config#i18n-options 'i18n options - Angular workspace configuration | Angular'
