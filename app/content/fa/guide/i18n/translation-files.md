# کار با فایل‌های ترجمه

بعد از اینکه یک کامپوننت را برای ترجمه آماده کردید، از دستور [`extract-i18n`][CliExtractI18n] در [Angular CLI][CliMain] استفاده کنید تا متن markشده در کامپوننت را داخل یک فایل _source language_ extract کنید.

متن markشده شامل متنی است که با `i18n` mark شده، attributeهایی که با `i18n-`_attribute_ mark شده‌اند، و متنی که با `$localize` tag شده است؛ همان‌طور که در [Prepare component for translation][GuideI18nCommonPrepare] توضیح داده شد.

برای ایجاد و update کردن فایل‌های ترجمه پروژه خود، مراحل زیر را انجام دهید.

1. [فایل source language را extract کنید][GuideI18nCommonTranslationFilesExtractTheSourceLanguageFile].
   1. به صورت اختیاری، location، format و name را تغییر دهید.
1. فایل source language را copy کنید تا [برای هر language یک translation file بسازید][GuideI18nCommonTranslationFilesCreateATranslationFileForEachLanguage].
1. [هر translation file را ترجمه کنید][GuideI18nCommonTranslationFilesTranslateEachTranslationFile].
1. pluralها و alternate expressionها را جداگانه ترجمه کنید.
   1. [Pluralها را ترجمه کنید][GuideI18nCommonTranslationFilesTranslatePlurals].
   1. [Alternate expressionها را ترجمه کنید][GuideI18nCommonTranslationFilesTranslateAlternateExpressions].
   1. [Nested expressionها را ترجمه کنید][GuideI18nCommonTranslationFilesTranslateNestedExpressions].

## Extract کردن فایل source language

برای extract کردن فایل source language، actionهای زیر را انجام دهید.

1. یک terminal window باز کنید.
1. به root directory پروژه خود بروید.
1. دستور CLI زیر را اجرا کنید.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" region="extract-i18n-default"/>

دستور `extract-i18n` یک فایل source language به نام `messages.xlf` در root directory پروژه شما ایجاد می‌کند.
برای اطلاعات بیشتر درباره XML Localization Interchange File Format \(XLIFF، نسخه 1.2\)، [XLIFF][WikipediaWikiXliff] را ببینید.

از optionهای زیر برای دستور [`extract-i18n`][CliExtractI18n] استفاده کنید تا location، format و file name مربوط به source language file را تغییر دهید.

| Command option  | جزئیات                              |
| :-------------- | :----------------------------------- |
| `--format`      | format فایل output را تنظیم می‌کند    |
| `--out-file`    | نام فایل output را تنظیم می‌کند      |
| `--output-path` | path مربوط به output directory را تنظیم می‌کند |

### تغییر location فایل source language

برای ایجاد فایل در directory مربوط به `src/locale`، output path را به عنوان option مشخص کنید.

#### مثال `extract-i18n --output-path`

مثال زیر output path را به عنوان option مشخص می‌کند.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" region="extract-i18n-output-path"/>

### تغییر format فایل source language

دستور `extract-i18n` فایل‌هایی با formatهای ترجمه زیر ایجاد می‌کند.

| Translation format | جزئیات                                                                                                          | File extension    |
| :----------------- | :--------------------------------------------------------------------------------------------------------------- | :---------------- |
| ARB                | [Application Resource Bundle][GithubGoogleAppResourceBundleWikiApplicationresourcebundlespecification]           | `.arb`            |
| JSON               | [JavaScript Object Notation][JsonMain]                                                                           | `.json`           |
| XLIFF 1.2          | [XML Localization Interchange File Format, version 1.2][OasisOpenDocsXliffXliffCoreXliffCoreHtml]                | `.xlf`            |
| XLIFF 2            | [XML Localization Interchange File Format, version 2][OasisOpenDocsXliffXliffCoreV20Cos01XliffCoreV20Cose01Html] | `.xlf`            |
| XMB                | [XML Message Bundle][UnicodeCldrDevelopmentDevelopmentProcessDesignProposalsXmb]                                 | `.xmb` \(`.xtb`\) |

translation format را با command option مربوط به `--format` صریح مشخص کنید.

HELPFUL: format مربوط به XMB فایل‌های source language با extension `.xmb` تولید می‌کند، اما از فایل‌های translation با extension `.xtb` استفاده می‌کند.

#### مثال `extract-i18n --format`

مثال زیر چند translation format را نشان می‌دهد.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" region="extract-i18n-formats"/>

### تغییر نام فایل source language

برای تغییر نام source language fileای که ابزار extraction تولید می‌کند، از command option مربوط به `--out-file` استفاده کنید.

#### مثال `extract-i18n --out-file`

مثال زیر نام‌گذاری output file را نشان می‌دهد.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" region="extract-i18n-out-file"/>

## ساخت translation file برای هر language

برای ساخت translation file برای یک locale یا language، actionهای زیر را انجام دهید.

1. [فایل source language را extract کنید][GuideI18nCommonTranslationFilesExtractTheSourceLanguageFile].
1. از source language file یک copy بگیرید تا برای هر language یک فایل _translation_ بسازید.
1. نام فایل _translation_ را تغییر دهید تا locale به آن اضافه شود.

   ```file {hideCopy}

   messages.xlf --> messages.{locale}.xlf

   ```

1. در project root خود یک directory جدید به نام `locale` بسازید.

   ```file {hideCopy}

   src/locale

   ```

1. فایل _translation_ را به directory جدید منتقل کنید.
1. فایل _translation_ را برای translator خود بفرستید.
1. مراحل بالا را برای هر languageای که می‌خواهید به application خود اضافه کنید تکرار کنید.

### مثال `extract-i18n` برای French

برای مثال، برای ساخت یک translation file به زبان French، actionهای زیر را انجام دهید.

1. دستور `extract-i18n` را اجرا کنید.
1. از فایل source language یعنی `messages.xlf` یک copy بگیرید.
1. نام copy را برای ترجمه French language \(`fr`\) به `messages.fr.xlf` تغییر دهید.
1. فایل translation مربوط به `fr` را به directory مربوط به `src/locale` منتقل کنید.
1. فایل translation مربوط به `fr` را برای translator بفرستید.

## ترجمه هر translation file

اگر به زبان مورد نظر مسلط نیستید و زمان کافی برای edit کردن translationها ندارید، احتمالاً مراحل زیر را انجام می‌دهید.

1. هر translation file را برای یک translator بفرستید.
1. translator از یک XLIFF file editor استفاده می‌کند تا actionهای زیر را انجام دهد.
   1. translation را ایجاد کند.
   1. translation را edit کند.

### مثال فرایند translation برای French

برای نمایش فرایند، فایل `messages.fr.xlf` را در [Example Angular Internationalization application][GuideI18nExample] review کنید. [Example Angular Internationalization application][GuideI18nExample] شامل یک translation فرانسوی است که می‌توانید بدون XLIFF editor خاص یا دانش French آن را edit کنید.

actionهای زیر فرایند translation را برای French توضیح می‌دهند.

1. فایل `messages.fr.xlf` را باز کنید و اولین element مربوط به `<trans-unit>` را پیدا کنید.
   این یک _translation unit_ است، که با نام _text node_ هم شناخته می‌شود، و translation مربوط به greeting tag یعنی `<h1>` را نمایش می‌دهد که قبلاً با attribute مربوط به `i18n` mark شده بود.

   <docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="translated-hello-before"/>

   مقدار `id="introductionHeader"` یک [custom ID][GuideI18nOptionalManageMarkedText] است، اما بدون prefix مربوط به `@@` که در HTML source لازم است.

1. element مربوط به `<source>... </source>` را در text node duplicate کنید، نام آن را به `target` تغییر دهید و سپس content را با متن French جایگزین کنید.

   <docs-code header="src/locale/messages.fr.xlf (<trans-unit>, after translation)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="translated-hello"/>

   در یک translation پیچیده‌تر، information و context موجود در [description و meaning elementها][GuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings] کمک می‌کند واژه‌های درست را برای ترجمه انتخاب کنید.

1. text nodeهای دیگر را ترجمه کنید.
   مثال زیر روش ترجمه را نمایش می‌دهد.

   <docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="translated-other-nodes"/>

IMPORTANT: IDهای translation unitها را تغییر ندهید.
هر attribute مربوط به `id` توسط Angular تولید می‌شود و به content متن کامپوننت و meaning assignشده بستگی دارد.

اگر متن یا meaning را تغییر دهید، attribute مربوط به `id` هم تغییر می‌کند.
برای اطلاعات بیشتر درباره مدیریت updateهای متن و IDها، [custom IDs][GuideI18nOptionalManageMarkedText] را ببینید.

## ترجمه pluralها

برای هر language، plural caseها را در صورت نیاز اضافه یا حذف کنید.

HELPFUL: برای ruleهای plural در languageها، [CLDR plural rules][GithubUnicodeOrgCldrStagingChartsLatestSupplementalLanguagePluralRulesHtml] را ببینید.

### مثال `minute` `plural`

برای ترجمه یک `plural`، مقدارهای match مربوط به ICU format را ترجمه کنید.

- `just now`
- `one minute ago`
- `<x id="INTERPOLATION" equiv-text="{{minutes}}"/> minutes ago`

مثال زیر روش ترجمه را نمایش می‌دهد.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="translated-plural"/>

## ترجمه alternate expressionها

Angular همچنین expressionهای alternate از نوع `select` ICU را به عنوان translation unitهای جداگانه extract می‌کند.

### مثال `gender` `select`

مثال زیر یک ICU expression از نوع `select` را در component template نمایش می‌دهد.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" region="i18n-select"/>

در این مثال، Angular expression را به دو translation unit extract می‌کند.
اولی شامل متن بیرون از clause مربوط به `select` است و از placeholder برای `select` استفاده می‌کند \(`<x id="ICU">`\):

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="translate-select-1"/>

IMPORTANT: هنگام ترجمه متن، اگر لازم بود placeholder را جابه‌جا کنید، اما آن را حذف نکنید.
اگر placeholder را حذف کنید، ICU expression از application ترجمه‌شده شما حذف می‌شود.

مثال زیر دومین translation unit را نشان می‌دهد که clause مربوط به `select` را شامل می‌شود.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="translate-select-2"/>

مثال زیر هر دو translation unit را بعد از کامل شدن translation نمایش می‌دهد.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="translated-select"/>

## ترجمه nested expressionها

Angular یک nested expression را همانند یک alternate expression مدیریت می‌کند.
Angular expression را به دو translation unit extract می‌کند.

### مثال nested `plural`

مثال زیر اولین translation unit را نشان می‌دهد که متن بیرون از nested expression را شامل می‌شود.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="translate-nested-1"/>

مثال زیر دومین translation unit را نشان می‌دهد که nested expression کامل را شامل می‌شود.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="translate-nested-2"/>

مثال زیر هر دو translation unit را بعد از ترجمه نشان می‌دهد.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="translate-nested"/>

## قدم بعدی

<docs-pill-row>
  <docs-pill href="guide/i18n/merge" title="Merge کردن ترجمه‌ها داخل app"/>
</docs-pill-row>

[CliMain]: cli 'CLI Overview and Command Reference | Angular'
[CliExtractI18n]: cli/extract-i18n 'ng extract-i18n | CLI | Angular'
[GuideI18nCommonPrepare]: guide/i18n/prepare 'Prepare component for translation | Angular'
[GuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings]: guide/i18n/prepare#add-helpful-descriptions-and-meanings 'Add helpful descriptions and meanings - Prepare component for translation | Angular'
[GuideI18nCommonTranslationFilesCreateATranslationFileForEachLanguage]: guide/i18n/translation-files#create-a-translation-file-for-each-language 'Create a translation file for each language - Work with translation files | Angular'
[GuideI18nCommonTranslationFilesExtractTheSourceLanguageFile]: guide/i18n/translation-files#extract-the-source-language-file 'Extract the source language file - Work with translation files | Angular'
[GuideI18nCommonTranslationFilesTranslateAlternateExpressions]: guide/i18n/translation-files#translate-alternate-expressions 'Translate alternate expressions - Work with translation files | Angular'
[GuideI18nCommonTranslationFilesTranslateEachTranslationFile]: guide/i18n/translation-files#translate-each-translation-file 'Translate each translation file - Work with translation files | Angular'
[GuideI18nCommonTranslationFilesTranslateNestedExpressions]: guide/i18n/translation-files#translate-nested-expressions 'Translate nested expressions - Work with translation files | Angular'
[GuideI18nCommonTranslationFilesTranslatePlurals]: guide/i18n/translation-files#translate-plurals 'Translate plurals - Work with translation files | Angular'
[GuideI18nExample]: guide/i18n/example 'Example Angular Internationalization application | Angular'
[GuideI18nOptionalManageMarkedText]: guide/i18n/manage-marked-text 'Manage marked text with custom IDs | Angular'
[GithubGoogleAppResourceBundleWikiApplicationresourcebundlespecification]: https://github.com/google/app-resource-bundle/wiki/ApplicationResourceBundleSpecification 'ApplicationResourceBundleSpecification | google/app-resource-bundle | GitHub'
[GithubUnicodeOrgCldrStagingChartsLatestSupplementalLanguagePluralRulesHtml]: https://cldr.unicode.org/index/cldr-spec/plural-rules 'Language Plural Rules - CLDR Charts | Unicode | GitHub'
[JsonMain]: https://www.json.org 'Introducing JSON | JSON'
[OasisOpenDocsXliffXliffCoreXliffCoreHtml]: https://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html 'XLIFF Version 1.2 Specification | Oasis Open Docs'
[OasisOpenDocsXliffXliffCoreV20Cos01XliffCoreV20Cose01Html]: http://docs.oasis-open.org/xliff/xliff-core/v2.0/cos01/xliff-core-v2.0-cos01.html 'XLIFF Version 2.0 | Oasis Open Docs'
[UnicodeCldrDevelopmentDevelopmentProcessDesignProposalsXmb]: http://cldr.unicode.org/development/development-process/design-proposals/xmb 'XMB | CLDR - Unicode Common Locale Data Repository | Unicode'
[WikipediaWikiXliff]: https://en.wikipedia.org/wiki/XLIFF 'XLIFF | Wikipedia'
