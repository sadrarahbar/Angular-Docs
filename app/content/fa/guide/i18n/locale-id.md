# ارجاع به localeها با ID

Angular از _locale identifier_ مربوط به Unicode \(Unicode locale ID\) استفاده می‌کند تا locale data درست را برای internationalization مربوط به text stringها پیدا کند.

<docs-callout title="Unicode locale ID">

- یک locale ID با [specification اصلی Unicode Common Locale Data Repository (CLDR)][UnicodeCldrDevelopmentCoreSpecification] سازگار است.
  برای اطلاعات بیشتر درباره locale IDها، [Unicode Language and Locale Identifiers][UnicodeCldrDevelopmentCoreSpecificationLocaleIDs] را ببینید.

- CLDR و Angular از [BCP 47 tags][RfcEditorInfoBcp47] به عنوان پایه locale ID استفاده می‌کنند.

</docs-callout>

یک locale ID زبان، کشور و یک code اختیاری را برای variantها یا subdivisionهای بیشتر مشخص می‌کند.
locale ID از language identifier، یک کاراکتر hyphen \(`-`\) و locale extension تشکیل می‌شود.

```html
{language_id}-{locale_extension}
```

HELPFUL: برای ترجمه دقیق پروژه Angular خود، باید تصمیم بگیرید کدام languageها و localeها را برای internationalization هدف قرار می‌دهید.

کشورهای زیادی زبان یکسانی دارند، اما در usage متفاوت‌اند.
این تفاوت‌ها شامل grammar، punctuation، formatهای currency، decimal numberها، dateها و موارد مشابه است.

برای مثال‌های این راهنما، از languageها و localeهای زیر استفاده کنید.

| Language | Locale                   | Unicode locale ID |
| :------- | :----------------------- | :---------------- |
| English  | Canada                   | `en-CA`           |
| English  | United States of America | `en-US`           |
| French   | Canada                   | `fr-CA`           |
| French   | France                   | `fr-FR`           |

[Angular repository][GithubAngularAngularTreeMasterPackagesCommonLocales] شامل localeهای رایج است.

<docs-callout>
برای فهرست language codeها، [ISO 639-2](https://www.loc.gov/standards/iso639-2) را ببینید.
</docs-callout>

## تنظیم source locale ID

از Angular CLI استفاده کنید تا source languageای را تنظیم کنید که component template و code را با آن می‌نویسید.

به صورت پیش‌فرض، Angular از `en-US` به عنوان source locale پروژه شما استفاده می‌کند.

برای تغییر source locale پروژه خود برای build، actionهای زیر را انجام دهید.

1. فایل build configuration مربوط به workspace یعنی [`angular.json`][GuideWorkspaceConfig] را باز کنید.
2. field مربوط به `sourceLocale` را داخل section مربوط به `i18n` اضافه یا modify کنید:

```json
{
  "projects": {
    "your-project": {
      "i18n": {
        "sourceLocale": "ca" // Use your desired locale code
      }
    }
  }
}
```

## قدم بعدی

<docs-pill-row>
  <docs-pill href="guide/i18n/format-data-locale" title="Format کردن data بر اساس locale"/>
</docs-pill-row>

[GuideWorkspaceConfig]: reference/configs/workspace-config 'Angular workspace configuration | Angular'
[GithubAngularAngularTreeMasterPackagesCommonLocales]: https://github.com/angular/angular/tree/main/packages/common/locales 'angular/packages/common/locales | angular/angular | GitHub'
[RfcEditorInfoBcp47]: https://www.rfc-editor.org/info/bcp47 'BCP 47 | RFC Editor'
[UnicodeCldrDevelopmentCoreSpecification]: https://cldr.unicode.org/index/cldr-spec 'Core Specification | Unicode CLDR Project'
[UnicodeCldrDevelopmentCoreSpecificationLocaleID]: https://cldr.unicode.org/index/cldr-spec/picking-the-right-language-code 'Unicode Language and Locale Identifiers - Core Specification | Unicode CLDR Project'
