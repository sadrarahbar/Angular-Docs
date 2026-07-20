# آماده‌سازی کامپوننت برای ترجمه

برای آماده‌سازی پروژه خود برای ترجمه، actionهای زیر را انجام دهید.

- از attribute مربوط به `i18n` برای mark کردن متن در component templateها استفاده کنید.
- از attribute مربوط به `i18n-` برای mark کردن text stringهای attribute در component templateها استفاده کنید.
- از tagged message string مربوط به `$localize` برای mark کردن text stringها در کد کامپوننت استفاده کنید.

## Mark کردن متن در component template

در component template، metadata مربوط به i18n همان مقدار attribute مربوط به `i18n` است.

```html
<element i18n="{i18n_metadata}">{string_to_translate}</element>
```

از attribute مربوط به `i18n` استفاده کنید تا یک static text message را در component templateهای خود برای ترجمه mark کنید.
آن را روی هر element tagای قرار دهید که متن ثابتی دارد و می‌خواهید ترجمه شود.

HELPFUL: attribute مربوط به `i18n` یک custom attribute است که ابزارها و compilerهای Angular آن را می‌شناسند.

### مثال `i18n`

tag زیر یعنی `<h1>` یک greeting ساده انگلیسی، "Hello i18n!"، را نمایش می‌دهد.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="greeting"/>

برای mark کردن greeting جهت ترجمه، attribute مربوط به `i18n` را به tag مربوط به `<h1>` اضافه کنید.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-attribute"/>

### استفاده از conditional statement با `i18n`

tag زیر یعنی `<div>` بر اساس toggle status، متن ترجمه‌شده را به عنوان بخشی از `div` و `aria-label` نمایش می‌دهد.

<docs-code-multifile>
    <docs-code header="app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html"  region="i18n-conditional"/>
    <docs-code header="app.component.ts" path="adev/src/content/examples/i18n/src/app/app.component.ts" visibleLines="[[14,21],[33,37]]"/>
</docs-code-multifile>

### ترجمه inline text بدون HTML element

از element مربوط به `<ng-container>` استفاده کنید تا behavior ترجمه را به یک متن مشخص associate کنید، بدون اینکه نحوه نمایش متن تغییر کند.

HELPFUL: هر HTML element یک DOM element جدید ایجاد می‌کند.
برای جلوگیری از ایجاد DOM element جدید، متن را داخل یک element از نوع `<ng-container>` wrap کنید.
مثال زیر نشان می‌دهد element مربوط به `<ng-container>` به یک HTML comment غیرقابل‌نمایش تبدیل شده است.

<docs-code path="adev/src/content/examples/i18n/src/app/app.component.html" region="i18n-ng-container"/>

### نام‌گذاری interpolation placeholder

به صورت پیش‌فرض، Angular برای هر interpolation در یک message ترجمه‌شده یک placeholder name تولید می‌کند. برای دادن نام معنادار که به translator کمک کند context را بفهمد، داخل interpolation یک comment به شکل `//i18n(ph="name")` اضافه کنید.

```html
<element i18n>{{ expression //i18n(ph="placeholder_name") }}</element>
```

برای مثال:

```html
<p i18n>Hello, {{ username //i18n(ph="name") }}!</p>
```

این معادل template برای نام‌گذاری placeholder در component code با [`$localize`][ApiLocalizeInitLocalize] است:

```ts
$localize`Hello, ${username}:name:!`;
```

## Mark کردن attributeهای element برای ترجمه

در component template، metadata مربوط به i18n همان مقدار attribute مربوط به `i18n-{attribute_name}` است.

```html
<element i18n-{attribute_name}="{i18n_metadata}" {attribute_name}="{attribute_value}" />
```

attributeهای HTML elementها شامل متنی هستند که باید همراه با بقیه متن نمایش‌داده‌شده در component template ترجمه شود.

از `i18n-{attribute_name}` همراه با هر attribute از هر element استفاده کنید و `{attribute_name}` را با نام attribute جایگزین کنید.
برای assign کردن meaning، description و custom ID، از syntax زیر استفاده کنید.

```html
i18n-{attribute_name}="{meaning}|{description}@@{id}"
```

### مثال `i18n-title`

برای ترجمه title یک image، این مثال را review کنید.
مثال زیر یک image با attribute مربوط به `title` نمایش می‌دهد.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-title"/>

برای mark کردن attribute مربوط به title جهت ترجمه، action زیر را انجام دهید.

attribute مربوط به `i18n-title` را اضافه کنید.

مثال زیر نشان می‌دهد چطور با افزودن `i18n-title`، attribute مربوط به `title` را روی tag مربوط به `img` mark کنید.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" region="i18n-title-translate"/>

## Mark کردن متن در component code

در component code، source text مربوط به ترجمه و metadata با کاراکترهای backtick \(`<code>&#96;</code>`\) احاطه می‌شوند.

از tagged message string مربوط به [`$localize`][ApiLocalizeInitLocalize] استفاده کنید تا یک string را در کد خود برای ترجمه mark کنید.

```ts
$localize`string_to_translate`;
```

metadata مربوط به i18n با کاراکترهای colon \(`:`\) احاطه می‌شود و قبل از source text ترجمه قرار می‌گیرد.

```ts
$localize`:{i18n_metadata}:string_to_translate`;
```

### شامل کردن متن interpolated

[interpolationها](guide/templates/binding#render-dynamic-text-with-text-interpolation) را داخل یک tagged message string مربوط به [`$localize`][ApiLocalizeInitLocalize] وارد کنید.

```ts
$localize`string_to_translate ${variable_name}`;
```

### نام‌گذاری interpolation placeholder

```ts
$localize`string_to_translate ${variable_name}:placeholder_name:`;
```

### Syntax شرطی برای ترجمه‌ها

```ts
return this.show ? $localize`Show Tabs` : $localize`Hide tabs`;
```

## i18n metadata برای ترجمه

```html
{meaning}|{description}@@{custom_id}
```

parameterهای زیر context و اطلاعات اضافی فراهم می‌کنند تا ابهام برای translator کمتر شود.

| Metadata parameter | جزئیات                                                               |
| :----------------- | :-------------------------------------------------------------------- |
| Custom ID          | یک custom identifier فراهم کنید                                           |
| Description        | اطلاعات یا context اضافی فراهم کنید                             |
| Meaning            | meaning یا intent متن را در context مشخص فراهم کنید |

برای اطلاعات بیشتر درباره custom IDها، [Manage marked text with custom IDs][GuideI18nOptionalManageMarkedText] را ببینید.

### افزودن description و meaning مفید

برای ترجمه دقیق یک text message، اطلاعات یا context بیشتری برای translator فراهم کنید.

یک _description_ از text message را به عنوان مقدار attribute مربوط به `i18n` یا tagged message string مربوط به [`$localize`][ApiLocalizeInitLocalize] اضافه کنید.

مثال زیر مقدار attribute مربوط به `i18n` را نشان می‌دهد.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-attribute-desc"/>

مثال زیر مقدار tagged message string مربوط به [`$localize`][ApiLocalizeInitLocalize] را همراه با description نشان می‌دهد.

```ts
$localize`:An introduction header for this sample:Hello i18n!`;
```

translator همچنین ممکن است لازم داشته باشد meaning یا intent یک text message را در context خاص همین application بداند، تا آن را مثل متن‌های دیگری که همان meaning را دارند ترجمه کند.
مقدار attribute مربوط به `i18n` را با _meaning_ شروع کنید و آن را با کاراکتر `|` از _description_ جدا کنید: `{meaning}|{description}`.

#### مثال `h1`

برای مثال، ممکن است بخواهید مشخص کنید tag مربوط به `<h1>` یک site header است و باید به همان شکل ترجمه شود، چه به عنوان header استفاده شود و چه در بخش دیگری از متن به آن اشاره شود.

مثال زیر نشان می‌دهد چطور مشخص کنید tag مربوط به `<h1>` باید به عنوان header ترجمه شود یا جای دیگری به آن ارجاع داده شود.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-attribute-meaning"/>

نتیجه این است که هر متنی که با `site header` به عنوان _meaning_ mark شده، دقیقاً به همان شکل ترجمه می‌شود.

مثال code زیر مقدار tagged message string مربوط به [`$localize`][ApiLocalizeInitLocalize] را همراه با meaning و description نشان می‌دهد.

```ts
$localize`:site header|An introduction header for this sample:Hello i18n!`;
```

<docs-callout title="Meaningها چطور text extraction و mergeها را کنترل می‌کنند">

ابزار extraction در Angular برای هر attribute مربوط به `i18n` در template، یک translation unit entry تولید می‌کند.
ابزار extraction در Angular به هر translation unit یک ID منحصربه‌فرد بر اساس _meaning_ و _description_ assign می‌کند.

HELPFUL: برای اطلاعات بیشتر درباره ابزار extraction در Angular، [Work with translation files](guide/i18n/translation-files) را ببینید.

text elementهای یکسان با _meaning_های متفاوت، با IDهای متفاوت extract می‌شوند.
برای مثال، اگر واژه "right" در دو location متفاوت از دو definition زیر استفاده کند، آن واژه متفاوت ترجمه می‌شود و به عنوان translation entryهای متفاوت به application merge می‌شود.

- `correct` مثل "you are right"
- `direction` مثل "turn right"

اگر text elementهای یکسان شرایط زیر را داشته باشند، فقط یک بار extract می‌شوند و از همان ID استفاده می‌کنند.

- meaning یا definition یکسان
- descriptionهای متفاوت

همان یک translation entry هر جا همان text elementها ظاهر شوند به application merge می‌شود.

</docs-callout>

## ICU expressionها

ICU expressionها به شما کمک می‌کنند alternate text را در component templateها mark کنید تا conditionها را پوشش دهد.
یک ICU expression شامل یک component property، یک ICU clause و case statementهایی است که با کاراکترهای open curly brace \(`{`\) و close curly brace \(`}`\) احاطه شده‌اند.

```html
{ component_property, icu_clause, case_statements }
```

component property همان variable را تعریف می‌کند.
یک ICU clause نوع متن شرطی را تعریف می‌کند.

| ICU clause                                                           | جزئیات                                                             |
| :------------------------------------------------------------------- | :------------------------------------------------------------------ |
| [`plural`][GuideI18nCommonPrepareMarkPlurals]                        | استفاده از plural numberها را mark می‌کند                                      |
| [`select`][GuideI18nCommonPrepareMarkAlternatesAndNestedExpressions] | choiceها را برای alternate text بر اساس string valueهای تعریف‌شده شما mark می‌کند |

برای ساده‌تر کردن ترجمه، از International Components for Unicode clauses \(ICU clauses\) همراه با regular expressionها استفاده کنید.

HELPFUL: ICU clauseها از [ICU Message Format][GithubUnicodeOrgIcuUserguideFormatParseMessages] مشخص‌شده در [CLDR pluralization rules][UnicodeCldrIndexCldrSpecPluralRules] پیروی می‌کنند.

### Mark کردن pluralها

زبان‌های مختلف ruleهای pluralization متفاوتی دارند که دشواری ترجمه را بیشتر می‌کند.
چون localeهای دیگر cardinality را متفاوت بیان می‌کنند، ممکن است لازم باشد pluralization categoryهایی تنظیم کنید که با English هم‌راستا نیستند.
از clause مربوط به `plural` برای mark کردن expressionهایی استفاده کنید که اگر word-for-word ترجمه شوند ممکن است معنای درستی نداشته باشند.

```html
{ component_property, plural, pluralization_categories }
```

بعد از pluralization category، متن پیش‌فرض \(English\) را وارد کنید که با کاراکترهای open curly brace \(`{`\) و close curly brace \(`}`\) احاطه شده است.

```html
pluralization_category { }
```

pluralization categoryهای زیر برای English در دسترس هستند و ممکن است بر اساس locale تغییر کنند.

| Pluralization category | جزئیات                    | Example                    |
| :--------------------- | :------------------------- | :------------------------- |
| `zero`                 | Quantity برابر zero است           | `=0 { }` <br /> `zero { }` |
| `one`                  | Quantity برابر 1 است              | `=1 { }` <br /> `one { }`  |
| `two`                  | Quantity برابر 2 است              | `=2 { }` <br /> `two { }`  |
| `few`                  | Quantity برابر 2 یا بیشتر است      | `few { }`                  |
| `many`                 | Quantity یک number بزرگ است | `many { }`                 |
| `other`                | Quantity پیش‌فرض       | `other { }`                |

اگر هیچ‌کدام از pluralization categoryها match نشوند، Angular از `other` برای match کردن fallback استاندارد category missing استفاده می‌کند.

```html
other { default_quantity }
```

HELPFUL: برای اطلاعات بیشتر درباره pluralization categoryها، [Choosing plural category names][UnicodeCldrIndexCldrSpecPluralRulesTocChoosingPluralCategoryNames] را در [CLDR - Unicode Common Locale Data Repository][UnicodeCldrMain] ببینید.

<docs-callout header='Background: ممکن است localeها بعضی pluralization categoryها را پشتیبانی نکنند'>

بسیاری از localeها بعضی pluralization categoryها را پشتیبانی نمی‌کنند.
locale پیش‌فرض \(`en-US`\) از یک function بسیار ساده `plural()` استفاده می‌کند که pluralization category مربوط به `few` را پشتیبانی نمی‌کند.
locale دیگری با یک function ساده `plural()`، مقدار `es` است.
مثال code زیر function مربوط به [en-US `plural()`][GithubAngularAngularBlobEcffc3557fe1bff9718c01277498e877ca44588dPackagesCoreSrcI18nLocaleEnTsL14L18] را نشان می‌دهد.

<docs-code path="adev/src/content/examples/i18n/doc-files/locale_plural_function.ts" class="no-box" hideCopy/>

function مربوط به `plural()` فقط 1 \(`one`\) یا 5 \(`other`\) برمی‌گرداند.
category مربوط به `few` هیچ‌وقت match نمی‌شود.

</docs-callout>

#### مثال `minutes`

اگر می‌خواهید phrase زیر را در English نمایش دهید، جایی که `x` یک number است.

<!--todo: replace output docs-code with screen capture image --->

```html
updated x minutes ago
```

و همچنین می‌خواهید phraseهای زیر را بر اساس cardinality مربوط به `x` نمایش دهید.

<!--todo: replace output docs-code with screen capture image --->

```html
updated just now
```

<!--todo: replace output docs-code with screen capture image --->

```html
updated one minute ago
```

از HTML markup و [interpolationها](guide/templates/binding#render-dynamic-text-with-text-interpolation) استفاده کنید.
مثال code زیر نشان می‌دهد چطور از clause مربوط به `plural` استفاده کنید تا سه وضعیت قبلی را در یک element از نوع `<span>` بیان کنید.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" region="i18n-plural"/>

جزئیات زیر را در مثال code قبلی review کنید.

| Parameters                        | جزئیات                                                                                                               |
| :-------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `minutes`                         | parameter اول مشخص می‌کند component property برابر `minutes` است و تعداد minuteها را تعیین می‌کند.               |
| `plural`                          | parameter دوم مشخص می‌کند ICU clause برابر `plural` است.                                                            |
| `=0 {just now}`                   | برای zero minute، pluralization category برابر `=0` است. value برابر `just now` است.                                        |
| `=1 {one minute}`                 | برای one minute، pluralization category برابر `=1` است. value برابر `one minute` است.                                        |
| `other {{{minutes}} minutes ago}` | برای هر cardinality بدون match، pluralization category پیش‌فرض `other` است. value برابر `{{minutes}} minutes ago` است. |

`{{minutes}}` یک [interpolation](guide/templates/binding#render-dynamic-text-with-text-interpolation) است.

### Mark کردن alternateها و nested expressionها

clause مربوط به `select`، choiceها را برای alternate text بر اساس string valueهای تعریف‌شده شما mark می‌کند.

```html
{ component_property, select, selection_categories }
```

همه alternateها را ترجمه کنید تا alternate text بر اساس مقدار یک variable نمایش داده شود.

بعد از selection category، متن \(English\) را وارد کنید که با کاراکترهای open curly brace \(`{`\) و close curly brace \(`}`\) احاطه شده است.

```html
selection_category { text }
```

زبان‌های مختلف ساختارهای grammatical متفاوتی دارند که دشواری ترجمه را بیشتر می‌کند.
از HTML markup استفاده کنید.
اگر هیچ‌کدام از selection categoryها match نشوند، Angular از `other` برای match کردن fallback استاندارد category missing استفاده می‌کند.

```html
other { default_value }
```

#### مثال `gender`

اگر می‌خواهید phrase زیر را در English نمایش دهید.

<!--todo: replace output docs-code with screen capture image --->

```html
The author is other
```

و همچنین می‌خواهید phraseهای زیر را بر اساس property مربوط به `gender` در کامپوننت نمایش دهید.

<!--todo: replace output docs-code with screen capture image --->

```html
The author is female
```

<!--todo: replace output docs-code with screen capture image --->

```html
The author is male
```

مثال code زیر نشان می‌دهد چطور property مربوط به `gender` در کامپوننت را bind کنید و از clause مربوط به `select` استفاده کنید تا سه وضعیت قبلی را در یک element از نوع `<span>` بیان کنید.

property مربوط به `gender` خروجی‌ها را به هرکدام از string valueهای زیر bind می‌کند.

| Value  | English value |
| :----- | :------------ |
| female | `female`      |
| male   | `male`        |
| other  | `other`       |

clause مربوط به `select`، valueها را به translationهای مناسب map می‌کند.
مثال code زیر property مربوط به `gender` را همراه با select clause نشان می‌دهد.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" region="i18n-select"/>

#### مثال `gender` و `minutes`

clauseهای مختلف را با هم ترکیب کنید، مثل clauseهای `plural` و `select`.
مثال code زیر clauseهای nested را بر اساس مثال‌های `gender` و `minutes` نشان می‌دهد.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" region="i18n-nested"/>

## قدم بعدی

<docs-pill-row>
  <docs-pill href="guide/i18n/translation-files" title="کار با فایل‌های ترجمه"/>
</docs-pill-row>

[ApiLocalizeInitLocalize]: api/localize/init/$localize '$localize | init - localize - API  | Angular'
[GuideI18nCommonPrepareMarkAlternatesAndNestedExpressions]: guide/i18n/prepare#mark-alternates-and-nested-expressions 'Mark alternates and nested expressions - Prepare templates for translation | Angular'
[GuideI18nCommonPrepareMarkPlurals]: guide/i18n/prepare#mark-plurals 'Mark plurals - Prepare component for translation | Angular'
[GuideI18nOptionalManageMarkedText]: guide/i18n/manage-marked-text 'Manage marked text with custom IDs | Angular'
[GithubAngularAngularBlobEcffc3557fe1bff9718c01277498e877ca44588dPackagesCoreSrcI18nLocaleEnTsL14L18]: https://github.com/angular/angular/blob/ecffc3557fe1bff9718c01277498e877ca44588d/packages/core/src/i18n/locale_en.ts#L14-L18 'Line 14 to 18 - angular/packages/core/src/i18n/locale_en.ts | angular/angular | GitHub'
[GithubUnicodeOrgIcuUserguideFormatParseMessages]: https://unicode-org.github.io/icu/userguide/format_parse/messages 'ICU Message Format - ICU Documentation | Unicode | GitHub'
[UnicodeCldrMain]: https://cldr.unicode.org 'Unicode CLDR Project'
[UnicodeCldrIndexCldrSpecPluralRules]: http://cldr.unicode.org/index/cldr-spec/plural-rules 'Plural Rules | CLDR - Unicode Common Locale Data Repository | Unicode'
[UnicodeCldrIndexCldrSpecPluralRulesTocChoosingPluralCategoryNames]: http://cldr.unicode.org/index/cldr-spec/plural-rules#TOC-Choosing-Plural-Category-Names 'Choosing Plural Category Names - Plural Rules | CLDR - Unicode Common Locale Data Repository | Unicode'
