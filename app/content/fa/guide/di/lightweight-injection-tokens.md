# Optimize کردن اندازه client application با lightweight injection tokenها

این page یک نمای مفهومی از technique مربوط به dependency injection ارائه می‌دهد که برای library developerها پیشنهاد می‌شود.
طراحی library با _lightweight injection tokenها_ کمک می‌کند bundle size مربوط به client applicationهایی که از library شما استفاده می‌کنند optimize شود.

می‌توانید با استفاده از tree-shakable providerها، dependency structure میان componentها و injectable serviceهای خود را برای optimize کردن bundle size مدیریت کنید.
این معمولا تضمین می‌کند اگر یک component یا service provide شده واقعا توسط application استفاده نشود، compiler بتواند کد آن را از bundle حذف کند.

به‌دلیل نحوه ذخیره injection tokenها در Angular، ممکن است چنین component یا service استفاده‌نشده‌ای در هر صورت وارد bundle شود.
این page یک design pattern مربوط به dependency injection را توضیح می‌دهد که با استفاده از lightweight injection tokenها از tree-shaking درست پشتیبانی می‌کند.

Pattern طراحی lightweight injection token به‌خصوص برای library developerها مهم است.
این pattern تضمین می‌کند وقتی یک application فقط از بخشی از capabilityهای library شما استفاده می‌کند، کد استفاده‌نشده بتواند از bundle مربوط به client application حذف شود.

وقتی یک application از library شما استفاده می‌کند، ممکن است serviceهایی وجود داشته باشند که library شما فراهم می‌کند اما client application از آن‌ها استفاده نمی‌کند.
در این حالت، application developer انتظار دارد آن service tree-shaken شود و به اندازه compiled application اضافه نکند.
چون application developer نمی‌تواند مشکل tree-shaking داخل library را بداند یا برطرف کند، مسئولیت آن با library developer است.
برای جلوگیری از retention componentهای استفاده‌نشده، library شما باید از lightweight injection token design pattern استفاده کند.

## چه زمانی tokenها retained می‌شوند

برای توضیح بهتر conditionی که token retention در آن رخ می‌دهد، یک library را در نظر بگیرید که componentی به نام library-card فراهم می‌کند.
این component یک body دارد و می‌تواند یک header اختیاری داشته باشد:

```html
<lib-card>
  <lib-header>…</lib-header>
</lib-card>
```

در یک implementation محتمل، component مربوط به `<lib-card>` از `contentChild` یا `contentChildren` برای گرفتن `<lib-header>` و `<lib-body>` استفاده می‌کند:

```ts {highlight: [14]}
import {Component, contentChild} from '@angular/core';

@Component({
  selector: 'lib-header',
  …,
})
class LibHeader {}

@Component({
  selector: 'lib-card',
  …,
})
class LibCard {
  readonly header = contentChild(LibHeader);
}
```

چون `<lib-header>` اختیاری است، element می‌تواند در فرم minimal خود یعنی `<lib-card />` ظاهر شود.
در این حالت، `<lib-header>` استفاده نشده و انتظار دارید tree-shaken شود، اما این اتفاق نمی‌افتد.
دلیلش این است که `LibCard` در واقع دو reference به `LibHeader` دارد:

```ts
readonly header = contentChild(LibHeader);
```

- یکی از این referenceها در _type position_ است؛ یعنی `LibHeader` را به‌عنوان type مشخص می‌کند: `readonly header: Signal<LibHeader|undefined>`.
- reference دیگر در _value position_ است؛ یعنی `LibHeader` همان valueای است که به تابع `contentChild` پاس داده می‌شود: `contentChild(LibHeader)`.

Compiler referenceهای token را در این positionها متفاوت handle می‌کند:

- Compiler referenceهای _type position_ را بعد از تبدیل از TypeScript erase می‌کند، بنابراین اثری روی tree-shaking ندارند.
- Compiler باید referenceهای _value position_ را در runtime نگه دارد، که **مانع** tree-shaken شدن component می‌شود.

در مثال، compiler token مربوط به `LibHeader` را که در value position قرار دارد retain می‌کند.
این مانع tree-shaken شدن component reference شده می‌شود، حتی اگر application واقعا هیچ‌جا از `<lib-header>` استفاده نکند.
اگر کد، template و styleهای `LibHeader` در مجموع بزرگ باشند، include شدن غیرضروری آن می‌تواند اندازه client application را به‌شکل قابل‌توجهی افزایش دهد.

## چه زمانی از lightweight injection token pattern استفاده کنیم

مشکل tree-shaking زمانی ایجاد می‌شود که یک component به‌عنوان injection token استفاده شود.
این در دو حالت رخ می‌دهد:

- token در value position مربوط به یک [content query](guide/components/queries#content-queries) استفاده شود.
- token با تابع `inject` استفاده شود.

در مثال زیر، هر دو استفاده از token مربوط به `CustomOther` باعث retention آن می‌شوند و وقتی استفاده نشده باشد مانع tree-shaking می‌شوند:

```ts {highlight: [[2],[4]]}
class App {
  private readonly other = inject(CustomOther, {optional: true});

  readonly header = contentChild(CustomOther);
}
```

با اینکه tokenهایی که فقط به‌عنوان type specifier استفاده می‌شوند هنگام تبدیل به JavaScript حذف می‌شوند، همه tokenهای استفاده‌شده برای dependency injection در runtime لازم هستند.
هنگام استفاده از `inject(CustomOther)`، `CustomOther` به‌عنوان value argument پاس داده می‌شود.
اکنون token در value position است، و این باعث می‌شود tree-shaker آن reference را نگه دارد.

HELPFUL: Libraryها باید برای همه serviceها از [tree-shakable providers](guide/di/defining-dependency-providers) استفاده کنند و dependencyها را به‌جای componentها یا moduleها در root level provide کنند.

## استفاده از lightweight injection tokenها

Lightweight injection token design pattern شامل استفاده از یک abstract class کوچک به‌عنوان injection token و فراهم کردن implementation واقعی در مرحله‌ای بعد است.
Abstract class retained می‌شود و tree-shaken نمی‌شود، اما کوچک است و اثر قابل‌توجهی روی application size ندارد.

مثال زیر نشان می‌دهد این کار برای `LibHeader` چگونه انجام می‌شود:

```ts {highlight: [[1],[5], [15]]}
abstract class LibHeaderToken {}

@Component({
  selector: 'lib-header',
  providers: [{provide: LibHeaderToken, useExisting: LibHeader}],
  …,
})
class LibHeader extends LibHeaderToken {}

@Component({
  selector: 'lib-card',
  …,
})
class LibCard {
  readonly header = contentChild(LibHeaderToken);
}
```

در این مثال، implementation مربوط به `LibCard` دیگر نه در type position و نه در value position به `LibHeader` اشاره نمی‌کند.
این اجازه می‌دهد tree-shaking کامل `LibHeader` انجام شود.
`LibHeaderToken` retained می‌شود، اما فقط یک class declaration است، بدون implementation concrete.
کوچک است و بعد از compilation، retained شدن آن اثر مادی روی application size ندارد.

در عوض، خود `LibHeader` abstract class مربوط به `LibHeaderToken` را implement می‌کند.
می‌توانید با خیال راحت از آن token به‌عنوان provider در component definition استفاده کنید و به Angular اجازه دهید concrete type را درست inject کند.

خلاصه اینکه lightweight injection token pattern از این موارد تشکیل شده است:

1. یک lightweight injection token که به‌صورت abstract class نمایش داده می‌شود.
2. یک component definition که abstract class را implement می‌کند.
3. Injection مربوط به lightweight pattern با استفاده از `contentChild` یا `contentChildren`.
4. یک provider در implementation مربوط به lightweight injection token که lightweight injection token را با implementation associate می‌کند.

### استفاده از lightweight injection token برای API definition

Componentی که یک lightweight injection token را inject می‌کند ممکن است لازم داشته باشد یک method را در class inject شده invoke کند.
Token حالا یک abstract class است. چون component قابل inject آن class را implement می‌کند، باید یک abstract method هم در abstract lightweight injection token class declare کنید.
Implementation مربوط به method، همراه با همه code overhead آن، در injectable component قرار دارد که می‌تواند tree-shaken شود.
این اجازه می‌دهد parent در صورت وجود child، به‌صورت type-safe با آن communicate کند.

مثلا `LibCard` حالا به‌جای `LibHeader`، `LibHeaderToken` را query می‌کند.
مثال زیر نشان می‌دهد pattern چگونه به `LibCard` اجازه می‌دهد بدون reference واقعی به `LibHeader` با آن communicate کند:

```ts {highlight: [[2],[7],[11],[19]]}
abstract class LibHeaderToken {
  abstract doSomething(): void;
}

@Component({
  selector: 'lib-header',
  providers: [{provide: LibHeaderToken, useExisting: LibHeader}],
})
class LibHeader extends LibHeaderToken {
  doSomething(): void {
    // Concrete implementation of `doSomething`
  }
}

@Component({
  selector: 'lib-card',
})
class LibCard implements AfterContentInit {
  readonly header = contentChild(LibHeaderToken);

  ngAfterContentInit(): void {
    if (this.header() !== undefined) {
      this.header()!.doSomething();
    }
  }
}
```

در این مثال، parent token را query می‌کند تا child component را بگیرد و اگر حاضر بود reference حاصل به component را ذخیره می‌کند.
پیش از فراخوانی method در child، parent component بررسی می‌کند child component حاضر هست یا نه.
اگر child component tree-shaken شده باشد، هیچ runtime referenceای به آن وجود ندارد و method آن هم فراخوانی نمی‌شود.

### نام‌گذاری lightweight injection token

Lightweight injection tokenها فقط با componentها مفید هستند.
[Angular Style Guide](style-guide) پیشنهاد می‌کند componentها را بدون suffix مربوط به `Component` نام‌گذاری کنید.
مثال `LibHeader` همین convention را دنبال می‌کند.

باید رابطه میان component و token آن را حفظ کنید و در عین حال میان آن‌ها تمایز بگذارید.
Style پیشنهادی این است که از base name مربوط به component همراه با suffix مربوط به `Token` برای نام‌گذاری lightweight injection tokenها استفاده کنید: `LibHeaderToken`.
