# ساخت یک injectable service

Service یک دسته گسترده است که هر value، function یا feature موردنیاز application شما را در بر می‌گیرد.
یک service معمولا classای با هدف مشخص و متمرکز است.
Component هم یکی از نوع‌های class است که می‌توانید با dependency injection یا DI استفاده کنید.

Angular برای بهبود modularity و reusability میان componentها و serviceها تمایز قائل می‌شود.
با جدا کردن featureهای مرتبط با view در component از نوع‌های دیگر processing، می‌توانید classهای component خود را lean و efficient نگه دارید.

در حالت ایده‌آل، مسئولیت component شما فقط enable کردن user experience است و نه بیشتر.
یک component باید propertyها و methodهایی برای data binding ارائه دهد تا میان view، که توسط template render می‌شود، و application logic، که اغلب شامل نوعی model است، mediation کند.

می‌توانید taskها را از component به serviceها delegate کنید، مثل fetch کردن data از server، validate کردن user input یا log کردن در console.
با تعریف چنین taskهایی در یک injectable service class، این capabilityها را برای هر component در دسترس قرار می‌دهید.
همچنین می‌توانید با configure کردن providerهای متفاوت برای همان نوع service بر اساس شرایط متفاوت، application خود را adaptableتر کنید.

Angular این اصول را به‌صورت سخت‌گیرانه enforce نمی‌کند.
Angular کمک می‌کند این اصول را دنبال کنید، با ساده کردن organize کردن application logic در serviceها و در دسترس قرار دادن آن serviceها برای componentها از طریق DI.

## مثال‌های service

این نمونه‌ای از service class است که در browser console log می‌کند:

```ts {header: "logger.service.ts (class)"}
export class Logger {
  log(msg: unknown) {
    console.log(msg);
  }
  error(msg: unknown) {
    console.error(msg);
  }
  warn(msg: unknown) {
    console.warn(msg);
  }
}
```

Serviceها می‌توانند به serviceهای دیگر وابسته باشند.
مثلا این یک `HeroService` است که به service مربوط به `Logger` وابسته است و همچنین از `BackendService` برای گرفتن heroها استفاده می‌کند.
آن service هم ممکن است به service مربوط به `HttpClient` وابسته باشد تا heroها را به‌صورت asynchronous از server fetch کند:

```ts {header: "hero.service.ts", highlight="[7,8,12,13]"}
import {inject} from '@angular/core';

export class HeroService {
  private heroes: Hero[] = [];

  private backend = inject(BackendService);
  private logger = inject(Logger);

  async getHeroes() {
    // Fetch
    this.heroes = await this.backend.getAll(Hero);
    // Log
    this.logger.log(`Fetched ${this.heroes.length} heroes.`);
    return this.heroes;
  }
}
```

## ساخت injectable service با CLI

Angular CLI یک command برای ساخت service جدید فراهم می‌کند. در مثال زیر، یک service جدید به application موجود اضافه می‌کنید.

برای generate کردن یک class جدید به نام `HeroService` در folder مربوط به `src/app/heroes`، این stepها را دنبال کنید:

1. این command مربوط به [Angular CLI](/tools/cli) را اجرا کنید:

```sh
ng generate service heroes/hero
```

این command، `HeroService` پیش‌فرض زیر را می‌سازد:

```ts {header: 'heroes/hero.service.ts (CLI-generated)'}
import {Service} from '@angular/core';

@Service()
export class HeroService {}
```

Decorator مربوط به `@Service()` مشخص می‌کند که Angular می‌تواند از این class در DI system استفاده کند و `HeroService` در سراسر application شما در دسترس است.

یک method به نام `getHeroes()` اضافه کنید که heroها را از `mock.heroes.ts` برگرداند تا hero mock data را بگیرید:

```ts {header: 'hero.service.ts'}
import {Service} from '@angular/core';
import {HEROES} from './mock-heroes';

@Service()
export class HeroService {
  getHeroes() {
    return HEROES;
  }
}
```

برای clarity و maintainability، پیشنهاد می‌شود componentها و serviceها را در فایل‌های جداگانه تعریف کنید.

## Inject کردن serviceها

برای inject کردن یک service داخل component، یک class field برای dependency declare کنید و از تابع [`inject`](/api/core/inject) در Angular برای initialize کردن آن استفاده کنید.

مثال زیر `HeroService` را در `HeroList` مشخص می‌کند.
نوع `heroService` برابر `HeroService` است.

```ts
import {inject} from '@angular/core';

export class HeroList {
  private heroService = inject(HeroService);
}
```

همچنین می‌توان یک service را با استفاده از constructor component داخل component inject کرد:

```ts {header: 'hero-list.ts (constructor signature)'}
  constructor(private heroService: HeroService)
```

Method مربوط به [`inject`](/api/core/inject) هم در classها و هم در functionها قابل استفاده است، در حالی که constructor method طبیعتا فقط در class constructor قابل استفاده است. با این حال، در هر دو حالت، فقط می‌توانید یک dependency را داخل [injection context](guide/di/dependency-injection-context) معتبر inject کنید، معمولا هنگام construction یا initialization یک component.

## Inject کردن serviceها در serviceهای دیگر

وقتی یک service به service دیگر وابسته است، همان pattern مربوط به inject کردن داخل component را دنبال کنید.
در مثال زیر، `HeroService` به service مربوط به `Logger` وابسته است تا فعالیت‌های خود را report کند:

```ts {header: 'hero.service.ts, highlight: [[3],[9],[12]]}
import {inject, Service} from '@angular/core';
import {HEROES} from './mock-heroes';
import {Logger} from '../logger.service';

@Service()
export class HeroService {
  private logger = inject(Logger);

  getHeroes() {
    this.logger.log('Getting heroes.');
    return HEROES;
  }
}
```

در این مثال، method مربوط به `getHeroes()` با log کردن یک message هنگام fetching heroها، از service مربوط به `Logger` استفاده می‌کند.

## قدم بعدی

<docs-pill-row>
  <docs-pill href="guide/di/defining-dependency-providers" title="Configuring dependency providers"/>
  <docs-pill href="guide/di/defining-dependency-providers#automatic-provision-for-non-class-dependencies" title="`InjectionTokens`"/>
</docs-pill-row>
