# Internationalization در Angular \(i18n\)

_Internationalization_ که گاهی با i18n هم به آن اشاره می‌شود، فرایند طراحی و آماده‌سازی پروژه شما برای استفاده در localeهای مختلف در سراسر جهان است.
_Localization_ فرایند ساخت نسخه‌هایی از پروژه شما برای localeهای مختلف است.
فرایند localization شامل actionهای زیر است.

- استخراج متن برای ترجمه به زبان‌های مختلف
- format کردن data برای یک locale مشخص

یک _locale_ منطقه‌ای را مشخص می‌کند که مردم در آن به یک زبان یا variant مشخصی از زبان صحبت می‌کنند.
regionهای ممکن شامل کشورها و regionهای جغرافیایی هستند.
locale، formatting و parsing جزئیات زیر را تعیین می‌کند.

- unitهای اندازه‌گیری شامل date و time، numberها و currencyها
- نام‌های ترجمه‌شده شامل time zoneها، languageها و countryها

برای یک معرفی سریع از localization و internationalization این ویدیو را ببینید:

<docs-video src="https://www.youtube.com/embed/KNTN-nsbV7M"/>

## یادگیری internationalization در Angular

<docs-card-container>
  <docs-card title="افزودن package مربوط به localize" href="guide/i18n/add-package">
    یاد بگیرید چطور package مربوط به Angular Localize را به پروژه خود اضافه کنید
  </docs-card>
  <docs-card title="ارجاع به localeها با ID" href="guide/i18n/locale-id">
    یاد بگیرید چطور locale identifier را برای پروژه خود شناسایی و مشخص کنید
  </docs-card>
  <docs-card title="Format کردن data بر اساس locale" href="guide/i18n/format-data-locale">
    یاد بگیرید چطور pipeهای localized data را پیاده‌سازی کنید و locale پروژه را override کنید
  </docs-card>
  <docs-card title="آماده‌سازی کامپوننت برای ترجمه" href="guide/i18n/prepare">
    یاد بگیرید چطور source text را برای ترجمه مشخص کنید
  </docs-card>
  <docs-card title="کار با فایل‌های ترجمه" href="guide/i18n/translation-files">
    یاد بگیرید چطور text ترجمه را review و process کنید
  </docs-card>
  <docs-card title="Merge کردن ترجمه‌ها داخل application" href="guide/i18n/merge">
    یاد بگیرید چطور ترجمه‌ها را merge کنید و application ترجمه‌شده خود را build کنید
  </docs-card>
  <docs-card title="Deploy کردن چند locale" href="guide/i18n/deploy">
    یاد بگیرید چطور چند locale را برای application خود deploy کنید
  </docs-card>
  <docs-card title="Import کردن variantهای global مربوط به locale data" href="guide/i18n/import-global-variants">
    یاد بگیرید چطور locale data را برای language variantها import کنید
  </docs-card>
  <docs-card title="مدیریت متن markشده با IDهای سفارشی" href="guide/i18n/manage-marked-text">
    یاد بگیرید چطور custom IDها را پیاده‌سازی کنید تا به مدیریت متن markشده کمک کند
  </docs-card>
  <docs-card title="مثال Internationalization" href="guide/i18n/example">
    یک مثال از internationalization در Angular را review کنید.
  </docs-card>
</docs-card-container>
