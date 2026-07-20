# ساخت harness برای کامپوننت‌های شما

## پیش از شروع

TIP: این راهنما فرض می‌کند قبلاً [راهنمای overview مربوط به component harnessها](guide/testing/component-harnesses-overview) را خوانده‌اید. اگر تازه با component harnessها کار می‌کنید، اول آن را بخوانید.

### چه زمانی ساخت test harness منطقی است؟

تیم Angular توصیه می‌کند برای کامپوننت‌های مشترکی که در جاهای زیادی استفاده می‌شوند و مقداری user interactivity دارند، component test harness بسازید. این موضوع بیشتر برای widget libraryها و کامپوننت‌های reusable مشابه صدق می‌کند. Harnessها برای این موارد ارزشمند هستند چون برای مصرف‌کنندگان این کامپوننت‌های مشترک، یک API خوب و پشتیبانی‌شده برای تعامل با کامپوننت فراهم می‌کنند. testهایی که از harness استفاده می‌کنند می‌توانند از وابستگی به جزئیات implementation غیرقابل‌اعتماد این کامپوننت‌های مشترک، مثل ساختار DOM و event listenerهای خاص، دوری کنند.

برای کامپوننت‌هایی که فقط در یک جا ظاهر می‌شوند، مثل یک صفحه در برنامه، harnessها سود زیادی ندارند. در این وضعیت‌ها، testهای یک کامپوننت می‌توانند به شکل معقولی به جزئیات implementation همان کامپوننت وابسته باشند، چون testها و کامپوننت‌ها هم‌زمان update می‌شوند. با این حال، اگر قرار باشد از harness هم در unit test و هم در end-to-end test استفاده کنید، harness همچنان ارزش دارد.

### نصب CDK

[Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories) مجموعه‌ای از primitiveهای رفتاری برای ساخت کامپوننت‌هاست. برای استفاده از component harnessها، ابتدا `@angular/cdk` را از npm نصب کنید. می‌توانید این کار را از terminal با Angular CLI انجام دهید:

```shell
ng add @angular/cdk
```

## Extend کردن `ComponentHarness`

کلاس abstract مربوط به `ComponentHarness`، base class همه component harnessهاست. برای ساخت یک component harness سفارشی، `ComponentHarness` را extend کنید و property static مربوط به `hostSelector` را پیاده‌سازی کنید.

property مربوط به `hostSelector` elementهایی را در DOM مشخص می‌کند که با این subclass از harness match می‌شوند. در بیشتر موارد، `hostSelector` باید همان selector مربوط به `Component` یا `Directive` متناظر باشد. برای مثال، یک کامپوننت popup ساده را در نظر بگیرید:

```ts
@Component({
  selector: 'my-popup',
  template: `
    <button (click)="toggle()">{{ triggerText() }}</button>
    @if (isOpen()) {
      <div class="my-popup-content"><ng-content /></div>
    }
  `,
})
class MyPopup {
  triggerText = input('');

  isOpen = signal(false);

  toggle() {
    this.isOpen.update((value) => !value);
  }
}
```

در این حالت، یک harness حداقلی برای کامپوننت شبیه زیر است:

```ts
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';
}
```

با اینکه subclassهای `ComponentHarness` فقط property مربوط به `hostSelector` را لازم دارند، بیشتر harnessها بهتر است یک متد static به نام `with` هم پیاده‌سازی کنند تا instanceهای `HarnessPredicate` تولید شود. بخش [فیلتر کردن harnessها](guide/testing/using-component-harnesses#filtering-harnesses) این موضوع را با جزئیات بیشتری پوشش می‌دهد.

## پیدا کردن elementها در DOM کامپوننت

هر instance از subclass مربوط به `ComponentHarness`، یک instance مشخص از کامپوننت متناظر را نمایش می‌دهد. می‌توانید از طریق method مربوط به `host()` در base class مربوط به `ComponentHarness` به host element کامپوننت دسترسی پیدا کنید.

`ComponentHarness` همچنین چند method برای پیدا کردن elementها داخل DOM کامپوننت ارائه می‌کند. این methodها `locatorFor()`، `locatorForOptional()` و `locatorForAll()` هستند. این methodها functionهایی می‌سازند که elementها را پیدا می‌کنند؛ خودشان مستقیم elementها را پیدا نمی‌کنند. این رویکرد از cache شدن referenceهای مربوط به elementهای قدیمی جلوگیری می‌کند. برای مثال، وقتی یک block مربوط به `@if` یک element را مخفی و سپس دوباره نمایش می‌دهد، نتیجه یک DOM element جدید است؛ استفاده از functionها تضمین می‌کند testها همیشه به state فعلی DOM reference کنند.

برای فهرست کامل جزئیات methodهای مختلف `locatorFor`، [صفحه reference مربوط به ComponentHarness API](/api/cdk/testing/ComponentHarness) را ببینید.

برای مثال، نمونه `MyPopupHarness` که بالاتر بحث شد می‌تواند methodهایی برای گرفتن elementهای trigger و content به شکل زیر فراهم کند:

```ts
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

  // Gets the trigger element
  getTriggerElement = this.locatorFor('button');

  // Gets the content element.
  getContentElement = this.locatorForOptional('.my-popup-content');
}
```

## کار با instanceهای `TestElement`

`TestElement` یک abstraction است که برای کار در محیط‌های test مختلف طراحی شده است \(Unit testها، WebDriver و غیره\). هنگام استفاده از harnessها، باید همه تعامل‌های DOM را از طریق این interface انجام دهید. روش‌های دیگر دسترسی به DOM elementها، مثل `document.querySelector()`، در همه محیط‌های test کار نمی‌کنند.

`TestElement` چندین method برای تعامل با DOM underlying دارد، مثل `blur()`، `click()`، `getAttribute()` و موارد دیگر. برای فهرست کامل methodها، [صفحه reference مربوط به TestElement API](/api/cdk/testing/TestElement) را ببینید.

instanceهای `TestElement` را در اختیار کاربران harness قرار ندهید، مگر اینکه elementای باشد که مصرف‌کننده کامپوننت مستقیم تعریف می‌کند، مثل host element خود کامپوننت. expose کردن instanceهای `TestElement` برای elementهای داخلی باعث می‌شود کاربران به ساختار DOM داخلی کامپوننت وابسته شوند.

به جای آن، methodهای متمرکزتر برای actionهای مشخصی که end-user ممکن است انجام دهد یا state مشخصی که ممکن است مشاهده کند ارائه کنید. برای مثال، `MyPopupHarness` از بخش‌های قبلی می‌تواند methodهایی مثل `toggle` و `isOpen` فراهم کند:

```ts
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

  protected getTriggerElement = this.locatorFor('button');
  protected getContentElement = this.locatorForOptional('.my-popup-content');

  /** Toggles the open state of the popup. */
  async toggle() {
    const trigger = await this.getTriggerElement();
    return trigger.click();
  }

  /** Checks if the popup us open. */
  async isOpen() {
    const content = await this.getContentElement();
    return !!content;
  }
}
```

## Load کردن harnessها برای subcomponentها

کامپوننت‌های بزرگ‌تر اغلب sub-componentها را compose می‌کنند. می‌توانید این ساختار را در harness یک کامپوننت هم منعکس کنید. هرکدام از methodهای `locatorFor` روی `ComponentHarness` یک signature جایگزین دارند که می‌تواند برای پیدا کردن sub-harnessها به جای elementها استفاده شود.

برای فهرست کامل methodهای مختلف `locatorFor`، [صفحه reference مربوط به ComponentHarness API](/api/cdk/testing/ComponentHarness) را ببینید.

برای مثال، یک menu را در نظر بگیرید که با popup بالا ساخته شده است:

```ts
@Directive({
  selector: 'my-menu-item',
})
class MyMenuItem {}

@Component({
  selector: 'my-menu',
  template: `
    <my-popup>
      <ng-content />
    </my-popup>
  `,
})
class MyMenu {
  triggerText = input('');

  items = contentChildren(MyMenuItem);
}
```

سپس harness مربوط به `MyMenu` می‌تواند از harnessهای دیگر برای `MyPopup` و `MyMenuItem` استفاده کند:

```ts
class MyMenuHarness extends ComponentHarness {
  static hostSelector = 'my-menu';

  protected getPopupHarness = this.locatorFor(MyPopupHarness);

  /** Gets the currently shown menu items (empty list if menu is closed). */
  getItems = this.locatorForAll(MyMenuItemHarness);

  /** Toggles open state of the menu. */
  async toggle() {
    const popupHarness = await this.getPopupHarness();
    return popupHarness.toggle();
  }
}

class MyMenuItemHarness extends ComponentHarness {
  static hostSelector = 'my-menu-item';
}
```

## فیلتر کردن instanceهای harness با `HarnessPredicate`

وقتی یک صفحه چندین instance از یک کامپوننت خاص دارد، ممکن است بخواهید بر اساس یک property از کامپوننت فیلتر کنید تا یک instance مشخص را بگیرید. برای مثال، شاید buttonای با متن مشخص یا menuای با ID مشخص بخواهید. کلاس `HarnessPredicate` می‌تواند چنین criteriaهایی را برای یک subclass از `ComponentHarness` capture کند. با اینکه نویسنده test می‌تواند instanceهای `HarnessPredicate` را دستی بسازد، وقتی subclass مربوط به `ComponentHarness` یک helper method برای ساخت predicateهای فیلترهای رایج ارائه کند، کار ساده‌تر می‌شود.

باید روی هر subclass از `ComponentHarness` یک متد static به نام `with()` بسازید که یک `HarnessPredicate` برای همان کلاس برگرداند. این کار به نویسندگان test اجازه می‌دهد کدی خوانا و قابل‌فهم بنویسند، مثل `loader.getHarness(MyMenuHarness.with({selector: '#menu1'}))`. علاوه بر گزینه‌های استاندارد selector و ancestor، متد `with` باید هر گزینه دیگری را که برای آن subclass خاص منطقی است اضافه کند.

Harnessهایی که لازم دارند گزینه‌های اضافی اضافه کنند، باید interface مربوط به `BaseHarnessFilters` را extend کنند و در صورت نیاز propertyهای اختیاری بیشتری اضافه کنند. `HarnessPredicate` چند method راحت برای افزودن optionها فراهم می‌کند: `stringMatches()`، `addOption()` و `add()`. برای توضیح کامل، [صفحه HarnessPredicate API](/api/cdk/testing/HarnessPredicate) را ببینید.

برای مثال، هنگام کار با menu مفید است بر اساس متن trigger فیلتر کنید و itemهای menu را بر اساس متنشان فیلتر کنید:

```ts
interface MyMenuHarnessFilters extends BaseHarnessFilters {
  /** Filters based on the trigger text for the menu. */
  triggerText?: string | RegExp;
}

interface MyMenuItemHarnessFilters extends BaseHarnessFilters {
  /** Filters based on the text of the menu item. */
  text?: string | RegExp;
}

class MyMenuHarness extends ComponentHarness {
  static hostSelector = 'my-menu';

  /** Creates a `HarnessPredicate` used to locate a particular `MyMenuHarness`. */
  static with(options: MyMenuHarnessFilters): HarnessPredicate<MyMenuHarness> {
    return new HarnessPredicate(MyMenuHarness, options).addOption(
      'trigger text',
      options.triggerText,
      (harness, text) => HarnessPredicate.stringMatches(harness.getTriggerText(), text),
    );
  }

  protected getPopupHarness = this.locatorFor(MyPopupHarness);

  /** Gets the text of the menu trigger. */
  async getTriggerText(): Promise<string> {
    const popupHarness = await this.getPopupHarness();
    return popupHarness.getTriggerText();
  }
}

class MyMenuItemHarness extends ComponentHarness {
  static hostSelector = 'my-menu-item';

  /** Creates a `HarnessPredicate` used to locate a particular `MyMenuItemHarness`. */
  static with(options: MyMenuItemHarnessFilters): HarnessPredicate<MyMenuItemHarness> {
    return new HarnessPredicate(MyMenuItemHarness, options).addOption(
      'text',
      options.text,
      (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text),
    );
  }

  /** Gets the text of the menu item. */
  async getText(): Promise<string> {
    const host = await this.host();
    return host.text();
  }
}
```

می‌توانید به جای کلاس `ComponentHarness`، یک `HarnessPredicate` را به هرکدام از APIهای `HarnessLoader`، `LocatorFactory` یا `ComponentHarness` پاس دهید. این کار به نویسندگان test اجازه می‌دهد هنگام ساخت instance مربوط به harness، به سادگی یک instance مشخص از کامپوننت را هدف بگیرند. همچنین به نویسنده harness اجازه می‌دهد از همان `HarnessPredicate` برای فعال کردن APIهای قوی‌تر روی کلاس harness خود استفاده کند. برای مثال، متد `getItems` را روی `MyMenuHarness` که بالاتر نشان داده شد در نظر بگیرید. افزودن یک filtering API به کاربران harness اجازه می‌دهد itemهای خاصی از menu را جستجو کنند:

```ts
class MyMenuHarness extends ComponentHarness {
  static hostSelector = 'my-menu';

  /** Gets a list of items in the menu, optionally filtered based on the given criteria. */
  async getItems(filters: MyMenuItemHarnessFilters = {}): Promise<MyMenuItemHarness[]> {
    const getFilteredItems = this.locatorForAll(MyMenuItemHarness.with(filters));
    return getFilteredItems();
  }
  ...
}
```

## ساخت `HarnessLoader` برای elementهایی که از content projection استفاده می‌کنند

بعضی کامپوننت‌ها content اضافی را داخل template کامپوننت project می‌کنند. برای اطلاعات بیشتر، [راهنمای content projection](guide/components/content-projection) را ببینید.

وقتی برای کامپوننتی که از content projection استفاده می‌کند harness می‌سازید، یک instance از `HarnessLoader` اضافه کنید که scope آن element حاوی `<ng-content>` باشد. این کار به کاربر harness اجازه می‌دهد برای هر کامپوننتی که به عنوان content پاس داده شده، harnessهای بیشتری load کند. `ComponentHarness` چند method دارد که می‌توانند برای ساخت instanceهای HarnessLoader در چنین caseهایی استفاده شوند: `harnessLoaderFor()`، `harnessLoaderForOptional()`، `harnessLoaderForAll()`. برای جزئیات بیشتر، [صفحه reference مربوط به HarnessLoader interface API](/api/cdk/testing/HarnessLoader) را ببینید.

برای مثال، نمونه `MyPopupHarness` از بالا می‌تواند `ContentContainerComponentHarness` را extend کند تا پشتیبانی load کردن harnessها در `<ng-content>` کامپوننت را اضافه کند.

```ts
class MyPopupHarness extends ContentContainerComponentHarness<string> {
  static hostSelector = 'my-popup';
}
```

## دسترسی به elementهای بیرون از host element کامپوننت

گاهی یک component harness نیاز دارد به elementهایی بیرون از host element کامپوننت متناظر خود دسترسی داشته باشد. برای مثال، کدی که یک floating element یا pop-up نمایش می‌دهد، اغلب DOM elementها را مستقیم به document body attach می‌کند؛ مثل service مربوط به `Overlay` در Angular CDK.

در این حالت، `ComponentHarness` methodای فراهم می‌کند که می‌تواند یک `LocatorFactory` برای root element سند بگیرد. `LocatorFactory` بیشتر APIهای مشابه base class مربوط به `ComponentHarness` را پشتیبانی می‌کند و سپس می‌تواند برای query کردن نسبت به root element سند استفاده شود.

فرض کنید کامپوننت `MyPopup` بالا، به جای elementای در template خودش، از CDK overlay برای popup content استفاده کند. در این حالت، `MyPopupHarness` باید از طریق method مربوط به `documentRootLocatorFactory()` به content element دسترسی پیدا کند؛ این method یک locator factory با root در document root می‌گیرد.

```ts
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

  /** Gets a `HarnessLoader` whose root element is the popup's content element. */
  async getHarnessLoaderForContent(): Promise<HarnessLoader> {
    const rootLocator = this.documentRootLocatorFactory();
    return rootLocator.harnessLoaderFor('my-popup-content');
  }
}
```

## صبر کردن برای taskهای asynchronous

methodهای روی `TestElement` به صورت خودکار change detection در Angular را trigger می‌کنند و منتظر taskهای داخل `NgZone` می‌مانند. در بیشتر موارد، نویسندگان harness برای صبر کردن روی taskهای asynchronous به کار خاصی نیاز ندارند. با این حال، چند edge case وجود دارد که ممکن است این رفتار کافی نباشد.

در بعضی شرایط، animationهای Angular ممکن است به یک cycle دوم از change detection و stabilize شدن بعدی `NgZone` نیاز داشته باشند تا eventهای animation کاملاً flush شوند. در مواردی که این کار لازم است، `ComponentHarness` یک method به نام `forceStabilize()` ارائه می‌کند که می‌توان آن را برای انجام دور دوم فراخوانی کرد.

می‌توانید از `NgZone.runOutsideAngular()` برای schedule کردن taskها بیرون از NgZone استفاده کنید. اگر لازم دارید صریحاً منتظر taskهای بیرون از `NgZone` بمانید، method مربوط به `waitForTasksOutsideAngular()` را روی harness متناظر فراخوانی کنید، چون این کار به صورت خودکار اتفاق نمی‌افتد.
