# Metadata فیلد

Field metadata داده‌ای reactive است که می‌توانید به یک field مشخص وصل کنید. validatorهای constraint داخلی Angular مثل `required()` و `min()` در داخل از همین سیستم استفاده می‌کنند. به بیان دیگر، هر بار که یک validator را صدا می‌زنید، دارید به یک metadata key برای همان field خاص contribution اضافه می‌کنید.

این راهنما سیستم metadata را عمیق‌تر بررسی می‌کند: اینکه reducerها چطور contributionهای چند schema rule را ترکیب می‌کنند، چطور reducer سفارشی بنویسید، خواندن metadata چطور با `hasMetadata()` ترکیب می‌شود، و managed metadata چطور objectهای lifecycle-aware را به fieldهای جداگانه وصل می‌کند.

## شما همین حالا هم از metadata استفاده کرده‌اید

وقتی در یک schema، `required()` را صدا می‌زنید و در template روی field حاصل `.required()` را می‌خوانید، دارید از سیستم metadata استفاده می‌کنید. `state.required` یک property استثنایی و جداگانه نیست. این یک getter کمکی است که مقدار فعلی metadata key داخلی `REQUIRED` را برمی‌گرداند.

```angular-ts
import {Component, signal} from '@angular/core';
import {form, required, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <form>
      <label>
        Username
        @if (registrationForm.username().required()) {
          <span class="required-marker" aria-hidden="true">*</span>
        }
        <input [formField]="registrationForm.username" />
      </label>
    </form>
  `,
})
export class Registration {
  registrationModel = signal({username: ''});

  registrationForm = form(this.registrationModel, (path) => {
    required(path.username);
  });
}
```

فراخوانی `required(path.username)` یک مقدار به metadata key مربوط به `REQUIRED` روی همان field اضافه می‌کند. خواندن `registrationForm.username().required()` مقدار انباشته‌شده را برمی‌گرداند. metadata key پلی است که این دو سمت را به هم وصل می‌کند.

چند validator داخلی از نوع constraint از همین الگو پیروی می‌کنند:

| Validator     | Metadata key               | Type                  | `FieldState` getter |
| ------------- | -------------------------- | --------------------- | ------------------- |
| `required()`  | `REQUIRED`                 | `boolean`             | `required`          |
| `min()`       | `MIN` selects `MIN_NUMBER` | `number \| undefined` | `min`               |
| `max()`       | `MAX` selects `MAX_NUMBER` | `number \| undefined` | `max`               |
| `minDate()`   | `MIN` selects `MIN_DATE`   | `Date \| undefined`   | `min`               |
| `maxDate()`   | `MAX` selects `MAX_DATE`   | `Date \| undefined`   | `max`               |
| `minLength()` | `MIN_LENGTH`               | `number \| undefined` | `minLength`         |
| `maxLength()` | `MAX_LENGTH`               | `number \| undefined` | `maxLength`         |
| `pattern()`   | `PATTERN`                  | `RegExp[]`            | `pattern`           |

validatorهای غیر constraint مثل `email()` و `validate()` به metadata چیزی اضافه نمی‌کنند. آن‌ها بررسی خودشان را اجرا می‌کنند و یک validation error نشان می‌دهند، اما مقدار reactiveای منتشر نمی‌کنند که template بتواند بخواند.

## چه زمانی از custom metadata استفاده کنیم

وقتی به داده‌ای reactive نیاز دارید که به یک field مشخص وصل باشد و signalهای داخلی state مثل `valid()`، `disabled()` و `touched()` آن را پوشش نمی‌دهند، از **custom metadata** استفاده کنید.

چند نمونه:

- **Configuration وصل‌شده به schemaهای field قابل استفاده‌ی دوباره.** مثلا نماد currency روی یک price field، تا هر template یا custom controlی که field را render می‌کند بتواند آن را نمایش دهد. یا `MIN_DATE` و `MAX_DATE` روی یک date field که یک range picker قابل استفاده‌ی دوباره آن‌ها را می‌خواند.
- **مقادیر parseشده‌ی مشترک بین ruleهای یک field.** مثلا یک شماره تلفن که یک‌بار به قالب E.164 parse می‌شود، تا هم format validator و هم uniqueness check همان فرم canonical را بدون parse دوباره بخوانند.
- **راهنماهای نمایشی ساخته‌شده از state فیلد.** مثلا یک سطح severity از نوع `'info' | 'warning' | 'error'` که UI آن را به badge و icon نگاشت می‌کند، یا یک help message وابسته به context که بر اساس چیزی که کاربر تایپ کرده و fieldهای دیگر که پر شده‌اند تغییر می‌کند.

اگر دیدید کنار form خودتان یک `Map<fieldKey, value>` موازی نگه می‌دارید تا چیزی را برای هر field دنبال کنید، این نشانه‌ای است که metadata ابزار مناسب‌تری است. metadata کنار schema باقی می‌ماند، reactive است و در lifecycle همان field شرکت می‌کند.

## ساخت یک metadata key

وقتی می‌خواهید یک key سفارشی بسازید، `createMetadataKey<TWrite>()` را صدا بزنید. type parameter مقدارهایی را توصیف می‌کند که schema ruleهای شما contribute می‌کنند.

```ts
import {createMetadataKey} from '@angular/forms/signals';

export const USERNAME_HELP = createMetadataKey<string>();
```

هر فراخوانی `createMetadataKey()` یک key یکتای جدید می‌سازد. حتی دو فراخوانی با type parameter یکسان هم دو key جدا هستند؛ بنابراین هر key را یک‌بار در سطح module تعریف کنید و هر جا لازم است import کنید.

NOTE: keyای که بدون reducer ساخته می‌شود، به‌صورت پیش‌فرض از semantics نوع "override" استفاده می‌کند: اگر چند rule همان key را set کنند، آخرین contribution برنده می‌شود.

## تنظیم مقدارها از schema

وقتی باید برای یک key روی fieldی مشخص مقدار ثبت کنید، داخل schema function از `metadata(path, key, logic)` استفاده کنید.

```angular-ts
import {Component, computed, signal} from '@angular/core';
import {form, metadata, FormField} from '@angular/forms/signals';
import {USERNAME_HELP} from './metadata-keys';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <form>
      <label>
        Username
        <input [formField]="registrationForm.username" />
      </label>
      <p class="help">{{ usernameHelp() }}</p>
    </form>
  `,
})
export class Registration {
  registrationModel = signal({username: ''});

  registrationForm = form(this.registrationModel, (path) => {
    metadata(path.username, USERNAME_HELP, ({value}) => {
      const username = value();
      if (username.length === 0) {
        return 'Choose a unique username between 3 and 20 characters.';
      }
      if (username.length < 3) {
        return 'Keep typing, usernames are at least 3 characters.';
      }
      if (username.length > 20) {
        return 'Usernames are at most 20 characters.';
      }
      return 'Looks good.';
    });
  });

  usernameHelp = computed(() => this.registrationForm.username().metadata(USERNAME_HELP)?.() ?? '');
}
```

تابع logic، context فیلد را دریافت می‌کند؛ این context، `value` را به‌عنوان signal مقدار فعلی field، `state` را به‌عنوان `FieldState` همان field، و متدهایی مثل `valueOf(path)` و `stateOf(path)` را برای خواندن fieldهای دیگر در همان فرم فراهم می‌کند. هر signalی که این تابع بخواند، به dependency reactive تبدیل می‌شود: وقتی `value()` تغییر کند، metadata دوباره محاسبه می‌شود و هر templateای که آن key را می‌خواند به‌روزرسانی می‌شود.

## خواندن metadata از یک field

`hasMetadata(key)` زمانی `true` برمی‌گرداند که هر schema ruleای آن key را روی این field ثبت کرده باشد. `state.metadata(key)` زمانی که هیچ ruleای آن key را ثبت نکرده باشد `undefined` برمی‌گرداند، و در غیر این صورت signalی از مقدار reduced فعلی را برمی‌گرداند.

```ts
registrationForm.username().hasMetadata(USERNAME_HELP); // true if any metadata() rule registered this key
```

شکل مقدار داخلی، مثلا اینکه خودش می‌تواند `undefined` باشد یا چه typeای دارد، به reducer آن key بستگی دارد. reducerها در بخش بعدی پوشش داده می‌شوند.

وقتی ممکن است key ثبت نشده باشد، خواندن را با `hasMetadata()` محافظت کنید:

```angular-html
@if (registrationForm.username().hasMetadata(USERNAME_HELP)) {
  <p class="help">{{ registrationForm.username().metadata(USERNAME_HELP)!() }}</p>
}
```

وقتی می‌دانید یک rule همیشه آن key را ثبت می‌کند، چون schema در همان فایل این کار را انجام می‌دهد، می‌توانید check مربوط به `hasMetadata()` را حذف کنید و به‌عنوان جایگزین کوتاه‌تر از optional chaining استفاده کنید:

```ts
const message = registrationForm.username().metadata(USERNAME_HELP)?.();
// message: string | undefined
```

یا وقتی rule تضمین‌شده ثبت شده است، optional chain را حذف کنید و assert کنید:

```ts
const message = registrationForm.username().metadata(USERNAME_HELP)!();
// message: string | undefined (still, because the inner value may be undefined)
```

نمونه‌ی component بالا از optional chaining داخل یک `computed()` استفاده می‌کند تا template به یک `string` ساده bind شود و برای frame اولیه fallback خالی داشته باشد.

این کل API برای یک contributor واحد است. بخش بعدی پوشش می‌دهد وقتی بیش از یک schema rule به یک key واحد contribution می‌دهد چه اتفاقی می‌افتد و چطور آن contributionها را با reducerها ترکیب کنید.

## ترکیب contributionها با reducerها

semantics نوع Override زمانی خوب کار می‌کند که فقط یک rule روی یک field مشخص به یک key contribution بدهد. به محض اینکه دو rule contribution بدهند، مقدار اول بی‌صدا کنار گذاشته می‌شود:

```ts
const HELP = createMetadataKey<string>();

form(model, (path) => {
  metadata(path.username, HELP, () => 'Choose something unique across the system.');
  metadata(path.username, HELP, () => 'Usernames are 3 to 20 characters.');
});
```

بعد از اجرای هر دو rule، `state.metadata(HELP)!()` فقط پیام دوم را برمی‌گرداند. تقریبا هیچ‌وقت این چیزی نیست که می‌خواهید. contributionها اغلب از منبع‌های مختلف می‌آیند: دو schema که با `apply()` compose شده‌اند و هر کدام help text اضافه می‌کنند، یا چند validation rule که هر کدام یک hint contribute می‌کنند.

برای ترکیب contributionها، یک reducer به `createMetadataKey()` پاس دهید. reducer توصیف می‌کند مقدارهای جداگانه چطور به یک نتیجه‌ی انباشته fold شوند:

```ts
import {createMetadataKey, MetadataReducer} from '@angular/forms/signals';

const HELP = createMetadataKey<string, string[]>(MetadataReducer.list());

form(model, (path) => {
  metadata(path.username, HELP, () => 'Choose something unique across the system.');
  metadata(path.username, HELP, () => 'Usernames are 3 to 20 characters.');
});

// state.metadata(HELP)!() === [
//   'Choose something unique across the system.',
//   'Usernames are 3 to 20 characters.',
// ]
```

به دو type parameter روی `createMetadataKey<TWrite, TAcc>` دقت کنید: اولی typeای است که هر rule contribute می‌کند، دومی typeای است که reducer تولید می‌کند. با `list()`، ruleها یک `string` contribute می‌کنند و field یک `string[]` پس می‌گیرد.

### Reducerهای داخلی

Angular شش reducer داخلی روی namespace مربوط به [`MetadataReducer`](api/forms/signals/MetadataReducer) فراهم می‌کند. `override()` دو شکل با semantics کمی متفاوت دارد که جداگانه در جدول آمده‌اند:

| Reducer        | Accumulator type      | کاری که انجام می‌دهد | مقدار اولیه |
| -------------- | --------------------- | -------------------- | ----------- |
| `list<T>()`    | `T[]`                 | contributionهای `T \| undefined` را می‌پذیرد و مقدارهای غیر `undefined` را اضافه می‌کند | `[]` |
| `or()`         | `boolean`             | اگر هر contribution برابر `true` باشد، `true` می‌شود | `false` |
| `and()`        | `boolean`             | فقط زمانی `true` می‌شود که همه‌ی contributionها `true` باشند | `true` |
| `min()`        | `number \| undefined` | کوچک‌ترین عدد contributeشده را نگه می‌دارد | `undefined` |
| `max()`        | `number \| undefined` | بزرگ‌ترین عدد contributeشده را نگه می‌دارد | `undefined` |
| `override()`   | `T \| undefined`      | آخرین contribution جایگزین قبلی می‌شود، که حالت پیش‌فرض است | `undefined` |
| `override(fn)` | `T`                   | همان رفتار، اما با مقدار اولیه‌ی ارائه‌شده | `fn()` |

`list()` تنها reducer داخلی است که type آیتم آن از type عنصر accumulator بازتر است. یک rule می‌تواند `undefined` contribute کند و reducer آن را بی‌صدا حذف می‌کند. built-in key مربوط به `PATTERN` به همین شکل ruleهای پویای `pattern()` را مدیریت می‌کند که logic function آن‌ها `undefined` برمی‌گرداند: contribution نوع `undefined` رد می‌شود و وارد فهرست نهایی regexها نمی‌شود.

### validator keyهای داخلی چطور از reducerها استفاده می‌کنند

با اینکه `MetadataReducer.min()` و `MetadataReducer.max()` reducer هستند، شاید تعجب کنید که validator نیستند. `MetadataReducer.min()` کوچک‌ترین contribution یک key را انتخاب می‌کند، در حالی که validator مربوط به `min()` یک حد پایین برای مقدار field enforce می‌کند. نام مشترک دارند، اما مسئله‌های متفاوتی را حل می‌کنند.

built-in constraint keyها reducerهای خودشان را بر اساس این انتخاب می‌کنند که برای constraint، «سخت‌گیرانه‌ترین» حالت چیست؛ چیزی که اغلب برعکس چیزی است که نام key القا می‌کند:

| Key          | Reducer          | دلیل |
| ------------ | ---------------- | ---- |
| `REQUIRED`   | `or()`           | اگر هر rule مربوط به `required()` مقدار `true` بدهد، field اجباری است. |
| `MIN_NUMBER` | `max()`          | constraint حداقل عدد وقتی سخت‌گیرانه‌تر است که بزرگ‌تر باشد. اگر یک rule مقدار `>= 5` بخواهد و دیگری `>= 10`، حداقل موثر `10` است. |
| `MIN_DATE`   | `max()`          | همان منطق `MIN_NUMBER`: آخرین تاریخ لازم برنده می‌شود. |
| `MAX_NUMBER` | `min()`          | constraint حداکثر عدد وقتی سخت‌گیرانه‌تر است که کوچک‌تر باشد. اگر یک rule سقف را `100` بگذارد و دیگری `50`، حداکثر موثر `50` است. |
| `MAX_DATE`   | `min()`          | همان منطق `MAX_NUMBER`: زودترین تاریخ مجاز برنده می‌شود. |
| `MIN_LENGTH` | `max()`          | همان منطق `MIN_NUMBER`: طول لازم طولانی‌تر برنده می‌شود. |
| `MAX_LENGTH` | `min()`          | همان منطق `MAX_NUMBER`: طول مجاز کوتاه‌تر برنده می‌شود. |
| `PATTERN`    | `list<RegExp>()` | هر فراخوانی `pattern()` یک regex contribute می‌کند؛ مقدار باید با همه‌ی آن‌ها match شود. |

`MIN` و `MAX` keyهای selection هستند. آن‌ها به key concreteای اشاره می‌کنند که با type مقدار field جور است، مثل `MIN_NUMBER` برای `min()` و `MIN_DATE` برای `minDate()`. به همین دلیل `field().min()` و `field().max()` هم برای fieldهای عددی و هم برای fieldهای تاریخ کار می‌کنند.

همین جفت شدن با قاعده‌ی «سخت‌گیرانه‌ترین برنده می‌شود» باعث می‌شود فراخوانی `min(path.age, 18)` و `min(path.age, 21)` در دو schema composeشده درست کار کند. هر فراخوانی validator خودش را ثبت می‌کند که bound خاص خودش را enforce می‌کند، پس مقداری که پایین‌تر از هر کدام از boundها باشد validation را fail می‌کند. جدا از آن، هر فراخوانی به key مربوط به `MIN_NUMBER` contribution می‌دهد و `state.min!()` مقدار aggregate یعنی `21` را گزارش می‌کند تا UI و custom controlها بتوانند حداقل موثر را بخوانند.

### نوشتن reducer سفارشی

وقتی می‌خواهید reducer خودتان را بنویسید، objectای پیاده‌سازی کنید که با interface مربوط به `MetadataReducer<TAcc, TItem>` هم‌خوان باشد:

```ts
interface MetadataReducer<TAcc, TItem> {
  reduce: (acc: TAcc, item: TItem) => TAcc;
  getInitial: () => TAcc;
}
```

وقتی هیچ‌کدام از reducerهای داخلی semantics موردنیاز شما را ندارند، می‌توانید reducer سفارشی تعریف کنید. مثلا یک key به نام `SEVERITY` که شدیدترین سطح contributeشده توسط هر rule را نگه می‌دارد:

```ts
import {createMetadataKey, type MetadataReducer} from '@angular/forms/signals';

type Severity = 'info' | 'warning' | 'error';

const SEVERITY_RANK: Record<Severity, number> = {info: 0, warning: 1, error: 2};

const maxSeverity: MetadataReducer<Severity | undefined, Severity> = {
  reduce(acc, item) {
    if (acc === undefined) return item;
    return SEVERITY_RANK[item] > SEVERITY_RANK[acc] ? item : acc;
  },
  getInitial: () => undefined,
};

export const SEVERITY = createMetadataKey<Severity, Severity | undefined>(maxSeverity);
```

حالا هر تعداد rule می‌توانند severity contribute کنند و field بالاترین سطح را گزارش می‌کند:

```ts
form(model, (path) => {
  metadata(path.password, SEVERITY, () => 'info');
  metadata(path.password, SEVERITY, ({value}) => (value().length < 12 ? 'warning' : 'info'));
  metadata(path.password, SEVERITY, ({value}) =>
    /password|1234/i.test(value()) ? 'error' : 'info',
  );
});
```

reducer هر بار که signalهای هر contribution تغییر کنند اجرا می‌شود، پس `state.metadata(SEVERITY)!()` همیشه با بدترین حالت فعلی در میان همه‌ی ruleها sync می‌ماند.

TIP: reducerهای خود را pure نگه دارید: `reduce()` باید فقط به دو آرگومان خودش وابسته باشد و `getInitial()` باید هر بار که صدا زده می‌شود همان مقدار را برگرداند. reducerها داخل یک reactive computation اجرا می‌شوند که با تغییر signalهای هر contribution دوباره اجرا می‌شود؛ بنابراین reducerهای impure metadata ناسازگار تولید می‌کنند.

## وصل کردن objectهای lifecycle-aware با managed metadata

Managed metadata به‌جای یک مقدار reactive، یک object lifecycle-aware را روی field ذخیره می‌کند. از آن برای objectهای وابسته به هر field استفاده کنید؛ مثل یک `resource()` که داده‌ی خارجی fetch می‌کند، یک `effect()` که با یک سیستم بیرونی sync می‌شود، یا یک service handle که به یک field خاص scope شده است.

### ساخت یک managed key

وقتی می‌خواهید یک managed key تعریف کنید، `createManagedMetadataKey<TRead, TWrite>(create)` را صدا بزنید. تابع `create` که پاس می‌دهید مقداری را تولید می‌کند که key نگه می‌دارد.

```ts
import {Signal} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {createManagedMetadataKey} from '@angular/forms/signals';

export interface UrlPreview {
  title: string;
  description?: string;
  image?: string;
}

export const URL_PREVIEW = createManagedMetadataKey((_state, url: Signal<string | undefined>) => {
  return httpResource<UrlPreview>(() => {
    const currentUrl = url();
    return currentUrl ? {url: '/api/url-preview', params: {url: currentUrl}} : undefined;
  });
});
```

تابع `create`، `FieldState` فیلد و یک `Signal<TAcc>` از داده‌ای را دریافت می‌کند که ruleهای `metadata()` برای این key contribute کرده‌اند، و هر objectی را که باید روی field زندگی کند برمی‌گرداند. مقدار برگشتی همان‌طور که هست ذخیره می‌شود: برخلاف keyهای non-managed، framework آن را داخل `computed()` wrap نمی‌کند.

`create` یک‌بار هنگام ساخته شدن field و داخل injection context همان field اجرا می‌شود. این امکان را می‌دهد که داخل `create`، `inject()`، `resource()` و `effect()` را صدا بزنید و cleanup را به lifecycle فیلد گره بزنید: وقتی field نابود می‌شود، Angular injection context را نابود می‌کند و هر `resource()`، `effect()` یا callback مربوط به `DestroyRef` که آنجا ثبت کرده‌اید به‌صورت خودکار cleanup می‌شود.

چون خود `create` reactive نیست، هر رفتاری که باید به تغییر signalها واکنش نشان دهد باید داخل یک `effect()`، `resource()` یا `httpResource()` قرار بگیرد که در همان فراخوانی اولیه setup شده است. `URL_PREVIEW` همین الگو را نشان می‌دهد: `httpResource()` داخل request function خودش signal مربوط به URL را می‌خواند، پس هر بار signal تغییر کند request دوباره اجرا می‌شود. schema rule، یعنی `metadata(path.url, URL_PREVIEW, ({value}) => value())`، تصمیم می‌گیرد چه داده‌ای وارد شود؛ managed key تصمیم می‌گیرد با آن چه کند.

### استفاده از managed key در فرم

وقتی باید از یک managed key در فرم استفاده کنید، برای آن key یک rule از نوع `metadata()` ثبت کنید و بعد object برگشتی را از field state بخوانید.

```angular-ts
import {Component, computed, signal} from '@angular/core';
import {applyEach, form, metadata, FormField} from '@angular/forms/signals';
import {URL_PREVIEW} from './url-preview';

@Component({
  selector: 'app-link-editor',
  imports: [FormField],
  template: `
    <form>
      @for (link of linksForm.links; track link) {
        <fieldset>
          <label>
            URL
            <input [formField]="link.url" />
          </label>
          <!-- Read the URL_PREVIEW key for this link's url field; the result is the resource its create function produced -->
          @let preview = link.url().metadata(URL_PREVIEW);
          @if (preview?.isLoading()) {
            <p>Loading preview...</p>
          } @else if (preview?.hasValue() && preview.value(); as data) {
            <article class="preview">
              <h3>{{ data.title }}</h3>
              @if (data.description) {
                <p>{{ data.description }}</p>
              }
            </article>
          } @else if (preview?.error()) {
            <p class="error">Could not load preview.</p>
          }
        </fieldset>
      }
      <button type="button" (click)="addLink()">Add link</button>
    </form>
  `,
})
export class LinkEditor {
  linksModel = signal({links: [{url: ''}]});

  linksForm = form(this.linksModel, (path) => {
    // Register the URL_PREVIEW key on each link's url field.
    // applyEach runs the schema per item, so create() runs once per link
    // and each link gets its own resource.
    applyEach(path.links, (itemPath) => {
      metadata(itemPath.url, URL_PREVIEW, ({value}) => value());
    });
  });

  addLink() {
    this.linksForm.links().value.update((links) => [...links, {url: ''}]);
  }
}
```

هر item در array، resource مخصوص خودش از `URL_PREVIEW` را می‌گیرد، چون `applyEach` schema ruleها را برای هر item مستقل ثبت می‌کند. وقتی کاربر یک link اضافه می‌کند، `create` برای field مربوط به item جدید اجرا می‌شود. وقتی یک link حذف شود، که اینجا نشان داده نشده اما الگوی رایجی است، framework injector همان field را همراه با resource آن tear down می‌کند.

## گام‌های بعدی

به یاد داشته باشید metadata وجود دارد تا داده‌ی reactive بتواند همراه field از schema composition عبور کند، در میان ruleها accumulate شود و همراه lifecycle field tear down شود. این سیستم از همان مکانیزمی استفاده می‌کند که validatorهای داخلی Angular استفاده می‌کنند، و می‌تواند برای use caseهای خودتان سفارشی شود.

برای مستندات API دقیق‌تر، ببینید:

- [`createMetadataKey()`](api/forms/signals/createMetadataKey) - تعریف metadata key با reducer اختیاری
- [`createManagedMetadataKey()`](api/forms/signals/createManagedMetadataKey) - تعریف metadata key وابسته به lifecycle
- [`metadata()`](api/forms/signals/metadata) - contribute کردن مقدار به یک metadata key در schema
- [`MetadataReducer`](api/forms/signals/MetadataReducer) - reducerهای داخلی برای ترکیب contributionها

برای راهنماهای مرتبط بیشتر درباره‌ی Signal Forms، این‌ها را ببینید:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/form-logic" title="Adding form logic" />
  <docs-pill href="guide/forms/signals/validation" title="Validation" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Field state management" />
  <docs-pill href="guide/forms/signals/async-operations" title="Async operations" />
</docs-pill-row>
