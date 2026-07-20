# Format کردن data بر اساس locale

Angular [pipeهای](guide/templates/pipes) built-in زیر را برای data transformation فراهم می‌کند.
pipeهای data transformation از token مربوط به [`LOCALE_ID`][ApiCoreLocaleId] استفاده می‌کنند تا data را بر اساس ruleهای هر locale format کنند.

| Data transformation pipe                | جزئیات                                           |
| :-------------------------------------- | :------------------------------------------------ |
| [`DatePipe`][ApiCommonDatepipe]         | یک date value را format می‌کند.                             |
| [`CurrencyPipe`][ApiCommonCurrencypipe] | یک number را به currency string تبدیل می‌کند.       |
| [`DecimalPipe`][ApiCommonDecimalpipe]   | یک number را به decimal number string تبدیل می‌کند. |
| [`PercentPipe`][ApiCommonPercentpipe]   | یک number را به percentage string تبدیل می‌کند.     |

## استفاده از DatePipe برای نمایش date فعلی

برای نمایش date فعلی با format مربوط به locale فعلی، از format زیر برای `DatePipe` استفاده کنید.

```angular-html
{{ today | date }}
```

## Override کردن locale فعلی برای CurrencyPipe

parameter مربوط به `locale` را به pipe اضافه کنید تا مقدار فعلی token مربوط به `LOCALE_ID` را override کنید.

برای اینکه currency را مجبور کنید از American English \(`en-US`\) استفاده کند، از format زیر برای `CurrencyPipe` استفاده کنید:

```angular-html
{{ amount | currency: 'USD' : 'symbol' : '1.2-2' : 'en-US' }}
```

HELPFUL: locale مشخص‌شده برای `CurrencyPipe`، token سراسری `LOCALE_ID` در application شما را override می‌کند.

## قدم بعدی

<docs-pill-row>
  <docs-pill href="guide/i18n/prepare" title="آماده‌سازی کامپوننت برای ترجمه"/>
</docs-pill-row>

[ApiCommonCurrencypipe]: api/common/CurrencyPipe 'CurrencyPipe | Common - API | Angular'
[ApiCommonDatepipe]: api/common/DatePipe 'DatePipe | Common - API | Angular'
[ApiCommonDecimalpipe]: api/common/DecimalPipe 'DecimalPipe | Common - API | Angular'
[ApiCommonPercentpipe]: api/common/PercentPipe 'PercentPipe | Common - API | Angular'
[ApiCoreLocaleId]: api/core/LOCALE_ID 'LOCALE_ID | Core - API | Angular'
