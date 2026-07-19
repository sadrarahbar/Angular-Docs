# selectorهای کامپوننت

TIP: این راهنما فرض می‌کند قبلاً [راهنمای Essentials](essentials) را خوانده‌اید. اگر تازه با Angular آشنا شده‌اید، اول آن را بخوانید.

هر کامپوننت یک [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_selectors) تعریف می‌کند که مشخص می‌کند کامپوننت چطور استفاده می‌شود:

```angular-ts {highlight: [2]}
@Component({
  selector: 'profile-photo',
  ...
})
export class ProfilePhoto { }
```

با ساختن یک HTML element مطابق در templateهای کامپوننت‌های _دیگر_ از یک کامپوننت استفاده می‌کنید:

```angular-ts {highlight: [3]}
@Component({
  template: `
    <profile-photo />
    <button>Upload a new profile photo</button>`,
  ...,
})
export class UserProfile { }
```

**Angular selectorها را به صورت static در compile-time match می‌کند**. تغییر دادن DOM در run-time، چه از طریق bindingهای Angular و چه با DOM APIها، روی کامپوننت‌های render شده اثر نمی‌گذارد.

**یک element می‌تواند دقیقاً با یک component selector match شود.** اگر چند component selector با یک element واحد match شوند، Angular یک error گزارش می‌دهد.

**Component selectorها case-sensitive هستند.**

## نوع‌های selector

Angular در component selectorها از subset محدودی از [نوع‌های پایه CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) پشتیبانی می‌کند:

| **Selector type**  | **Description**                                                                                                 | **Examples**                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Type selector      | elementها را بر اساس HTML tag name یا node name آن‌ها match می‌کند.                                             | `profile-photo`               |
| Attribute selector | elementها را بر اساس وجود یک attribute در HTML و به صورت اختیاری مقدار exact آن attribute match می‌کند.        | `[dropzone]` `[type="reset"]` |
| Class selector     | elementها را بر اساس وجود یک CSS class match می‌کند.                                                           | `.menu-item`                  |

برای مقدارهای attribute، Angular match کردن مقدار exact attribute را با operator مربوط به equals \(`=`\) پشتیبانی می‌کند. Angular از operatorهای دیگر برای مقدار attribute پشتیبانی نمی‌کند.

Component selectorهای Angular از combinatorها پشتیبانی نمی‌کنند، از جمله [descendant combinator](https://developer.mozilla.org/docs/Web/CSS/Descendant_combinator) یا [child combinator](https://developer.mozilla.org/docs/Web/CSS/Child_combinator).

Component selectorهای Angular از مشخص کردن [namespaceها](https://developer.mozilla.org/docs/Web/SVG/Namespaces_Crash_Course) پشتیبانی نمی‌کنند.

### pseudo-class مربوط به `:not`

Angular از [pseudo-class مربوط به `:not`](https://developer.mozilla.org/docs/Web/CSS/:not) پشتیبانی می‌کند. می‌توانید این pseudo-class را به هر selector دیگری اضافه کنید تا مشخص‌تر کنید selector یک کامپوننت با کدام elementها match شود. برای مثال، می‌توانید یک attribute selector به نام `[dropzone]` تعریف کنید و از match شدن elementهای `textarea` جلوگیری کنید:

```angular-ts {highlight: [2]}
@Component({
  selector: '[dropzone]:not(textarea)',
  ...
})
export class DropZone { }
```

Angular در component selectorها از pseudo-classها یا pseudo-elementهای دیگر پشتیبانی نمی‌کند.

### ترکیب selectorها

می‌توانید چند selector را با concatenate کردن آن‌ها ترکیب کنید. برای مثال، می‌توانید elementهای `<button>` را که `type="reset"` مشخص کرده‌اند match کنید:

```angular-ts {highlight: [2]}
@Component({
  selector: 'button[type="reset"]',
  ...
})
export class ResetButton { }
```

همچنین می‌توانید چند selector را با یک list جداشده با comma تعریف کنید:

```angular-ts {highlight: [2]}
@Component({
  selector: 'drop-zone, [dropzone]',
  ...
})
export class DropZone { }
```

Angular برای هر elementای که با _هر کدام_ از selectorهای list match شود، یک کامپوننت می‌سازد.

## انتخاب selector

اکثر کامپوننت‌ها باید از یک custom element name به عنوان selector خود استفاده کنند. همه custom element nameها باید طبق [HTML specification](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) شامل hyphen باشند. به صورت پیش‌فرض، اگر Angular با custom tag nameای روبه‌رو شود که با هیچ کامپوننت موجودی match نمی‌شود، error گزارش می‌دهد و جلوی bugهای ناشی از typo در نام کامپوننت را می‌گیرد.

برای جزئیات درباره استفاده از [native custom elementها](https://developer.mozilla.org/docs/Web/Web_Components) در templateهای Angular، [پیکربندی پیشرفته کامپوننت](guide/components/advanced-configuration) را ببینید.

### prefixهای selector

تیم Angular پیشنهاد می‌کند برای همه custom componentهایی که داخل پروژه خود تعریف می‌کنید، از یک prefix کوتاه و consistent استفاده کنید. برای مثال، اگر قرار بود YouTube را با Angular بسازید، ممکن بود کامپوننت‌های خود را با `yt-` prefix کنید؛ با کامپوننت‌هایی مثل `yt-menu`، `yt-player` و غیره. namespacing selectorها به این شکل فوراً روشن می‌کند یک کامپوننت خاص از کجا آمده است. به صورت پیش‌فرض، Angular CLI از `app-` استفاده می‌کند.

IMPORTANT: Angular از prefix مربوط به `ng` برای framework APIهای خودش استفاده می‌کند. هرگز از `ng` به عنوان prefix selector برای custom componentهای خودتان استفاده نکنید.

### چه زمانی از attribute selector استفاده کنیم

وقتی می‌خواهید یک کامپوننت را روی یک element استاندارد native بسازید، بهتر است attribute selector را در نظر بگیرید. برای مثال، اگر می‌خواهید یک کامپوننت button سفارشی بسازید، می‌توانید با استفاده از attribute selector از element استاندارد `<button>` بهره ببرید:

```angular-ts {highlight: [2]}
@Component({
  selector: 'button[yt-upload]',
   ...
})
export class YouTubeUploadButton { }
```

این رویکرد به consumerهای کامپوننت اجازه می‌دهد بدون کار اضافه، مستقیماً از همه APIهای استاندارد element استفاده کنند. این به‌خصوص برای ARIA attributeهایی مثل `aria-label` ارزشمند است.

وقتی Angular با custom attributeهایی روبه‌رو می‌شود که با هیچ کامپوننت موجودی match نمی‌شوند، error گزارش نمی‌دهد. هنگام استفاده از کامپوننت‌هایی با attribute selector، consumerها ممکن است فراموش کنند کامپوننت یا NgModule آن را import کنند و در نتیجه کامپوننت render نشود. برای اطلاعات بیشتر، [import و استفاده از کامپوننت‌ها](guide/components#imports-in-the-component-decorator) را ببینید.

کامپوننت‌هایی که attribute selector تعریف می‌کنند باید از attributeهای lowercase و dash-case استفاده کنند. می‌توانید همان پیشنهاد prefixگذاری بالا را دنبال کنید.

