# Overview مربوط به component harnessها

یک <strong>component harness</strong> کلاسی است که به testها اجازه می‌دهد از طریق یک API پشتیبانی‌شده، همان‌طور که کاربر نهایی با کامپوننت‌ها تعامل می‌کند با آن‌ها تعامل کنند. می‌توانید برای هر کامپوننتی test harness بسازید؛ از widgetهای کوچک قابل‌استفاده مجدد تا صفحه‌های کامل.

Harnessها چند مزیت دارند:

- testها را با جدا کردنشان از جزئیات implementation کامپوننت، مثل ساختار DOM آن، کمتر شکننده می‌کنند.
- باعث می‌شوند testها خواناتر و نگهداریشان ساده‌تر شود.
- می‌توانند در چند محیط testing مختلف استفاده شوند.

```ts
// Example of test with a harness for a component called MyButtonComponent
it('should load button with exact text', async () => {
  const button = await loader.getHarness(MyButtonComponentHarness);
  expect(await button.getText()).toBe('Confirm');
});
```

Component harnessها مخصوصاً برای widgetهای UI مشترک مفید هستند. developerها اغلب testهایی می‌نویسند که به جزئیات خصوصی implementation مربوط به widgetها، مثل ساختار DOM و CSS classها، وابسته‌اند. این dependencyها testها را شکننده و سخت‌نگهداری می‌کنند. Harnessها یک جایگزین ارائه می‌کنند: یک API پشتیبانی‌شده که همان‌طور با widget تعامل می‌کند که end-user تعامل می‌کند. حالا تغییرات implementation مربوط به widget کمتر احتمال دارد testهای کاربر را خراب کند. برای مثال، [Angular Material](https://material.angular.dev/components/categories) برای هر کامپوننت در library یک test harness ارائه می‌کند.

Component harnessها از چند محیط testing پشتیبانی می‌کنند. می‌توانید از همان implementation مربوط به harness هم در unit testها و هم در end-to-end testها استفاده کنید. نویسندگان test فقط باید یک API را یاد بگیرند و نویسندگان کامپوننت لازم نیست implementationهای جداگانه برای unit test و end-to-end test نگه دارند.

بسیاری از developerها را می‌توان در یکی از دسته‌های زیر قرار داد: test authorها، نویسندگان component harness و نویسندگان harness environment. بر اساس این دسته‌ها، از جدول زیر استفاده کنید تا مرتبط‌ترین بخش این راهنما را پیدا کنید:

| نوع Developer              | توضیح                                                                                                                                                                                                                                                                                            | بخش مرتبط                                                                                             |
| :-------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| Test Authors                | developerهایی که از component harnessهای نوشته‌شده توسط شخص دیگر برای test کردن برنامه خود استفاده می‌کنند. برای مثال، ممکن است یک app developer از یک کامپوننت menu متعلق به third-party استفاده کند و لازم داشته باشد در یک unit test با menu تعامل کند.                                                                       | [استفاده از component harnessها در testها](guide/testing/using-component-harnesses)                                |
| Component harness authors   | developerهایی که چند کامپوننت Angular قابل‌استفاده مجدد را نگهداری می‌کنند و می‌خواهند برای کاربرانشان test harness بسازند تا در testهای خود استفاده کنند. برای مثال، نویسنده یک library کامپوننت Angular متعلق به third-party یا developerای که مجموعه‌ای از کامپوننت‌های مشترک را برای یک برنامه بزرگ Angular نگهداری می‌کند.             | [ساخت component harness برای کامپوننت‌های شما](guide/testing/creating-component-harnesses)               |
| Harness environment authors | developerهایی که می‌خواهند پشتیبانی از استفاده component harnessها را در محیط‌های testing بیشتر اضافه کنند. برای اطلاعات درباره محیط‌های testing پشتیبانی‌شده به صورت آماده، [محیط‌ها و loaderهای test harness](guide/testing/using-component-harnesses#test-harness-environments-and-loaders) را ببینید. | [افزودن پشتیبانی برای محیط‌های testing بیشتر](guide/testing/component-harnesses-testing-environments) |

برای reference کامل API، [صفحه reference مربوط به component harness API در Angular CDK](/api#angular_cdk_testing) را ببینید.
