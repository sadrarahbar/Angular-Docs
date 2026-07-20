# مدیریت متن markشده با custom IDها

extractor در Angular برای هرکدام از instanceهای زیر، فایلی با translation unit entry تولید می‌کند.

- هر attribute مربوط به `i18n` در component template
- هر tagged message string مربوط به [`$localize`][ApiLocalizeInitLocalize] در component code

همان‌طور که در [How meanings control text extraction and merges][GuideI18nCommonPrepareHowMeaningsControlTextExtractionAndMerges] توضیح داده شد، Angular به هر translation unit یک ID منحصربه‌فرد assign می‌کند.

مثال زیر translation unitهایی با IDهای منحصربه‌فرد را نمایش می‌دهد.

<docs-code header="messages.fr.xlf" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="generated-id"/>

وقتی متن قابل ترجمه را تغییر می‌دهید، extractor برای آن translation unit یک ID جدید تولید می‌کند.
در بیشتر موارد، تغییر در source text به تغییر translation هم نیاز دارد.
بنابراین استفاده از ID جدید، تغییر متن را با translationها sync نگه می‌دارد.

با این حال، بعضی سیستم‌های translation به شکل یا syntax مشخصی برای ID نیاز دارند.
برای پاسخ به این نیاز، از custom ID برای mark کردن متن استفاده کنید.
بیشتر developerها نیازی به استفاده از custom ID ندارند.
اگر می‌خواهید از syntax منحصربه‌فردی برای انتقال metadata اضافی استفاده کنید، custom ID به کار ببرید.
metadata اضافی می‌تواند شامل library، کامپوننت یا areaای از application باشد که متن در آن ظاهر می‌شود.

برای مشخص کردن custom ID در attribute مربوط به `i18n` یا tagged message string مربوط به [`$localize`][ApiLocalizeInitLocalize]، از prefix مربوط به `@@` استفاده کنید.
مثال زیر custom ID مربوط به `introductionHeader` را در یک heading element تعریف می‌کند.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-attribute-solo-id"/>

مثال زیر custom ID مربوط به `introductionHeader` را برای یک variable تعریف می‌کند.

```ts
variableText1 = $localize`:@@introductionHeader:Hello i18n!`;
```

وقتی custom ID مشخص می‌کنید، extractor یک translation unit با همان custom ID تولید می‌کند.

<docs-code header="messages.fr.xlf" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="custom-id"/>

اگر متن را تغییر دهید، extractor ID را تغییر نمی‌دهد.
در نتیجه، لازم نیست step اضافی برای update کردن translation انجام دهید.
نقطه ضعف استفاده از custom ID این است که اگر متن را تغییر دهید، translation شما ممکن است با source text تازه‌تغییرکرده out-of-sync شود.

## استفاده از custom ID همراه با description

از custom ID در ترکیب با description و meaning استفاده کنید تا بیشتر به translator کمک شود.

مثال زیر یک description را نشان می‌دهد که پس از آن custom ID آمده است.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-attribute-id"/>

مثال زیر custom ID و description مربوط به `introductionHeader` را برای یک variable تعریف می‌کند.

```ts
variableText2 = $localize`:An introduction header for this sample@@introductionHeader:Hello i18n!`;
```

مثال زیر یک meaning اضافه می‌کند.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-attribute-meaning-and-id"/>

مثال زیر custom ID مربوط به `introductionHeader` را برای یک variable تعریف می‌کند.

```ts
variableText3 = $localize`:site header|An introduction header for this sample@@introductionHeader:Hello i18n!`;
```

### تعریف custom IDهای منحصربه‌فرد

مطمئن شوید custom IDهایی تعریف می‌کنید که منحصربه‌فرد هستند.
اگر برای دو text element متفاوت از یک ID یکسان استفاده کنید، ابزار extraction فقط اولی را extract می‌کند و Angular از translation به جای هر دو text element اصلی استفاده می‌کند.

برای مثال، در code snippet زیر custom ID یکسان `myId` برای دو text element متفاوت تعریف شده است.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-duplicate-custom-id"/>

مورد زیر translation به French را نمایش می‌دهد.

<docs-code header="src/locale/messages.fr.xlf" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="i18n-duplicate-custom-id"/>

هر دو element اکنون از همان translation \(`Bonjour`\) استفاده می‌کنند، چون هر دو با همان custom ID تعریف شده بودند.

<docs-code path="adev/src/content/examples/i18n/doc-files/rendered-output.html"/>

[ApiLocalizeInitLocalize]: api/localize/init/$localize '$localize | init - localize - API | Angular'
[GuideI18nCommonPrepareHowMeaningsControlTextExtractionAndMerges]: guide/i18n/prepare#h1-example 'How meanings control text extraction and merges - Prepare components for translations | Angular'
