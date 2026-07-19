# استایل‌دهی به componentها

TIP: این راهنما فرض می‌کند که قبلا [راهنمای Essentials](essentials) را خوانده‌اید. اگر با Angular تازه شروع کرده‌اید، اول آن را بخوانید.

Componentها می‌توانند به‌صورت اختیاری CSS styleهایی داشته باشند که روی DOM همان component اعمال می‌شوند:

```angular-ts {highlight:[4]}
@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo" />`,
  styles: `
    img {
      border-radius: 50%;
    }
  `,
})
export class ProfilePhoto {}
```

همچنین می‌توانید styleهای خود را در فایل‌های جداگانه بنویسید:

```angular-ts {highlight:[4]}
@Component({
  selector: 'profile-photo',
  templateUrl: 'profile-photo.html',
  styleUrl: 'profile-photo.css',
})
export class ProfilePhoto {}
```

وقتی Angular component شما را کامپایل می‌کند، این styleها همراه با خروجی JavaScript همان component منتشر می‌شوند. یعنی styleهای component در سیستم ماژول JavaScript هم حضور دارند. وقتی یک component در Angular render می‌شود، framework به‌صورت خودکار styleهای مرتبط با آن را هم اضافه می‌کند، حتی وقتی component به‌صورت lazy-load بارگذاری شده باشد.

Angular با هر ابزاری که CSS خروجی بدهد کار می‌کند، از جمله [Sass](https://sass-lang.com)، [Less](https://lesscss.org) و [Stylus](https://stylus-lang.com).

## محدود کردن scope استایل‌ها

هر component یک تنظیم **view encapsulation** دارد که مشخص می‌کند framework چگونه styleهای component را scope کند. چهار mode برای view encapsulation وجود دارد: `Emulated`، `ShadowDom`، `ExperimentalIsolatedShadowDom` و `None`.
می‌توانید mode را در decorator مربوط به `@Component` مشخص کنید:

```angular-ts {highlight:[3]}
@Component({
  ...,
  encapsulation: ViewEncapsulation.None,
})
export class ProfilePhoto { }
```

### ViewEncapsulation.Emulated

Angular به‌صورت پیش‌فرض از encapsulation شبیه‌سازی‌شده استفاده می‌کند تا styleهای یک component فقط روی elementهایی اعمال شوند که در template همان component تعریف شده‌اند. در این mode، framework برای هر instance از component یک attribute یکتای HTML تولید می‌کند، آن attribute را به elementهای template component اضافه می‌کند و همان attribute را وارد selectorهای CSS تعریف‌شده در styleهای component می‌کند.

این mode مطمئن می‌شود styleهای یک component به بیرون نشت نکنند و روی componentهای دیگر اثر نگذارند. با این حال، styleهای global که بیرون از component تعریف شده‌اند همچنان ممکن است روی elementهای داخل componentی با encapsulation شبیه‌سازی‌شده اثر بگذارند.

در mode شبیه‌سازی‌شده، Angular از pseudo-class مربوط به [`:host`](https://developer.mozilla.org/docs/Web/CSS/:host) پشتیبانی می‌کند.
با اینکه pseudo-class مربوط به [`:host-context()`](https://developer.mozilla.org/docs/Web/CSS/:host-context) در مرورگرهای مدرن deprecated شده، compiler Angular از آن پشتیبانی کامل ارائه می‌دهد. هر دو pseudo-class را می‌توان بدون تکیه بر [Shadow DOM](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM) بومی استفاده کرد.
در زمان کامپایل، framework این pseudo-classها را به attribute تبدیل می‌کند؛ بنابراین در runtime تابع قوانین بومی این pseudo-classها نیست، مثل سازگاری مرورگر یا specificity. mode شبیه‌سازی‌شده Angular از pseudo-classهای دیگر مرتبط با Shadow DOM، مثل `::shadow` یا `::part`، پشتیبانی نمی‌کند.

#### `::ng-deep`

mode شبیه‌سازی‌شده Angular از یک pseudo-class سفارشی به نام `::ng-deep` پشتیبانی می‌کند.
**تیم Angular قویا استفاده جدید از `::ng-deep` را توصیه نمی‌کند**. این APIها فقط برای سازگاری با کدهای قدیمی باقی مانده‌اند.

وقتی یک selector شامل `::ng-deep` باشد، Angular از آن نقطه به بعد در selector، مرزهای view encapsulation را اعمال نمی‌کند. هر بخشی از selector که بعد از `::ng-deep` بیاید، می‌تواند با elementهای بیرون از template component هم match شود.

برای مثال:

- یک selector قانون CSS مثل `p a`، با encapsulation شبیه‌سازی‌شده، با elementهای `<a>` که descendant یک element `<p>` هستند match می‌شود، در حالی که هر دو داخل template خود component قرار دارند.

- یک selector مثل `::ng-deep p a` با elementهای `<a>` در هر جای application match می‌شود، اگر descendant یک element `<p>` در هر جای application باشند.

  این عملا باعث می‌شود مانند یک global style رفتار کند.

- در `p ::ng-deep a`، Angular لازم می‌داند element مربوط به `<p>` از template خود component آمده باشد، اما element مربوط به `<a>` می‌تواند هر جای application باشد.

  بنابراین در عمل، element مربوط به `<a>` می‌تواند در template خود component باشد، یا در هر محتوای projected یا child آن.

- با `:host ::ng-deep p a`، هر دو element مربوط به `<a>` و `<p>` باید descendantهای host element component باشند.

  آن‌ها می‌توانند از template component یا viewهای componentهای child آن بیایند، اما نه از جای دیگری در app.

### ViewEncapsulation.ShadowDom

این mode با استفاده از [API استاندارد وب Shadow DOM](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM)، styleها را داخل یک component scope می‌کند.
وقتی این mode را فعال می‌کنید، Angular یک shadow root به host element component وصل می‌کند و template و styleهای component را داخل shadow tree متناظر render می‌کند.

Styleهای داخل shadow tree نمی‌توانند روی elementهای بیرون از همان shadow tree اثر بگذارند.

اما فعال کردن encapsulation با `ShadowDom` فقط روی scoping styleها اثر ندارد. Render شدن component داخل یک shadow tree روی propagation رویدادها، تعامل با [API مربوط به `<slot>`](https://developer.mozilla.org/docs/Web/Web_Components/Using_templates_and_slots) و نحوه نمایش elementها در ابزارهای توسعه‌دهنده مرورگر هم اثر می‌گذارد. پیش از فعال کردن این گزینه، همیشه پیامدهای کامل استفاده از Shadow DOM در application خود را درک کنید.

### ViewEncapsulation.ExperimentalIsolatedShadowDom

مانند mode بالا رفتار می‌کند، با این تفاوت که این mode به‌صورت سخت‌گیرانه تضمین می‌کند _فقط_ styleهای همان component روی elementهای template آن component اعمال شوند. Styleهای global نمی‌توانند روی elementهای داخل shadow tree اثر بگذارند و styleهای داخل shadow tree هم نمی‌توانند روی elementهای بیرون از آن اثر بگذارند.

### ViewEncapsulation.None

این mode همه encapsulation مربوط به style را برای component غیرفعال می‌کند. هر style مرتبط با component مانند global style رفتار می‌کند.

NOTE: در modeهای `Emulated` و `ShadowDom`، Angular صددرصد تضمین نمی‌کند که styleهای component شما همیشه styleهای بیرونی را override کنند.
فرض بر این است که در صورت برخورد، این styleها specificity یکسانی با styleهای component شما دارند.

## تعریف styleها در templateها

می‌توانید از element مربوط به `<style>` در template یک component استفاده کنید تا styleهای بیشتری تعریف کنید. mode مربوط به view encapsulation در component روی styleهایی که به این شکل تعریف می‌شوند هم اعمال می‌شود.

Angular از binding داخل elementهای style پشتیبانی نمی‌کند.

## ارجاع به فایل‌های style خارجی

Templateهای component می‌توانند از [element مربوط به `<link>`](https://developer.mozilla.org/docs/Web/HTML/Element/link) برای ارجاع به فایل‌های CSS استفاده کنند. علاوه بر این، CSS شما می‌تواند از [at-rule مربوط به `@import`](https://developer.mozilla.org/docs/Web/CSS/@import) برای ارجاع به فایل‌های CSS استفاده کند. Angular این ارجاع‌ها را styleهای _خارجی_ در نظر می‌گیرد. Styleهای خارجی تحت تاثیر view encapsulation شبیه‌سازی‌شده قرار نمی‌گیرند.
