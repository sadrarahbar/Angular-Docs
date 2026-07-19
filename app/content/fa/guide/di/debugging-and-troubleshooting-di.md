# Debugging و troubleshooting در dependency injection

مشکل‌های dependency injection یا DI معمولا از اشتباه‌های configuration، مشکل‌های scope یا patternهای استفاده نادرست می‌آیند. این راهنما کمک می‌کند مشکل‌های رایج DI را که توسعه‌دهندگان با آن روبه‌رو می‌شوند شناسایی و resolve کنید.

## Pitfallهای رایج و راه‌حل‌ها

### Serviceها جایی که انتظار دارید در دسترس نیستند

یکی از رایج‌ترین مشکل‌های DI زمانی رخ می‌دهد که تلاش می‌کنید یک service را inject کنید، اما Angular آن را در injector فعلی یا هیچ parent injector پیدا نمی‌کند. این معمولا وقتی اتفاق می‌افتد که service در scope اشتباه provide شده یا اصلا provide نشده است.

#### Provider scope mismatch

وقتی یک service را در array مربوط به `providers` یک component provide می‌کنید، Angular یک instance در injector همان component می‌سازد. این instance فقط برای همان component و childهای آن در دسترس است. Componentهای parent و sibling نمی‌توانند به آن دسترسی داشته باشند، چون از injectorهای متفاوتی استفاده می‌کنند.

```angular-ts {header: 'child-view.ts'}
import {Component} from '@angular/core';
import {DataStore} from './data-store';

@Component({
  selector: 'app-child',
  template: '<p>Child</p>',
  providers: [DataStore], // Only available in this component and its children
})
export class ChildView {}
```

```angular-ts {header: 'parent-view.ts'}
import {Component, inject} from '@angular/core';
import {DataStore} from './data-store';

@Component({
  selector: 'app-parent',
  template: '<app-child />',
})
export class ParentView {
  private dataService = inject(DataStore); // ERROR: Not available to parent
}
```

Angular فقط در hierarchy به سمت بالا search می‌کند، نه پایین. Componentهای parent نمی‌توانند به serviceهایی که در componentهای child provide شده‌اند دسترسی داشته باشند.

**راه‌حل:** Service را در سطح بالاتر provide کنید، مثل application یا parent component.

```ts {prefer}
import {Service} from '@angular/core';

@Service()
export class DataStore {
  // Available everywhere
}
```

TIP: `@Service` serviceها را همه‌جا در دسترس قرار می‌دهد و tree-shaking را فعال می‌کند. اگر نمی‌خواهید scope آن کل app باشد، `autoProvided: false` را مشخص کنید.

#### Serviceها و routeهای lazy-loaded

وقتی یک service را در array مربوط به `providers` یک route lazy-loaded provide می‌کنید، Angular برای آن route یک child injector می‌سازد. این injector و serviceهای آن فقط بعد از load شدن route در دسترس می‌شوند. Componentهای بخش‌های eagerly-loaded application شما نمی‌توانند به این serviceها دسترسی داشته باشند، چون از injectorهای متفاوتی استفاده می‌کنند که پیش از ساخته شدن lazy-loaded injector وجود دارند.

```ts {header: 'feature.routes.ts'}
import {Routes} from '@angular/router';
import {FeatureClient} from './feature-client';

export const featureRoutes: Routes = [
  {
    path: 'feature',
    providers: [FeatureClient],
    loadComponent: () => import('./feature-view'),
  },
];
```

```angular-ts {header: 'eager-view.ts'}
import {Component, inject} from '@angular/core';
import {FeatureClient} from './feature-client';

@Component({
  selector: 'app-eager',
  template: '<p>Eager Component</p>',
})
export class EagerView {
  private featureService = inject(FeatureClient); // ERROR: Not available yet
}
```

Routeهای lazy-loaded child injectorهایی می‌سازند که فقط بعد از load شدن route در دسترس‌اند.

NOTE: به‌صورت پیش‌فرض، route injectorها و serviceهای آن‌ها حتی بعد از navigate کردن از route هم باقی می‌مانند. تا بسته شدن application destroy نمی‌شوند. برای cleanup خودکار route injectorهای استفاده‌نشده، [customizing route behavior](guide/routing/customizing-route-behavior#experimental-automatic-cleanup-of-unused-route-injectors) را ببینید.

**راه‌حل:** برای serviceهایی که باید از lazy boundaryها shared شوند از `@Service` استفاده کنید.

```ts {prefer, header: 'Provide at root for shared services'}
import {Service} from '@angular/core';

@Service()
export class FeatureClient {
  // Available everywhere, including before lazy load
}
```

اگر service باید lazy-loaded باشد اما همچنان برای eager componentها هم در دسترس باشد، فقط جایی که لازم است آن را inject کنید و برای handle کردن availability از optional injection استفاده کنید.

### چند instance به‌جای singleton

انتظار دارید یک instance shared یا singleton داشته باشید، اما در componentهای مختلف instanceهای جداگانه می‌گیرید.

#### Provide کردن در component به‌جای root

وقتی یک service را به array مربوط به `providers` یک component اضافه می‌کنید، Angular برای هر instance از component یک instance جدید از آن service می‌سازد. هر component instance سرویس جداگانه خود را می‌گیرد؛ یعنی تغییرات در یک component روی service instance در componentهای دیگر اثر نمی‌گذارد. این معمولا زمانی غیرمنتظره است که state مشترک در application می‌خواهید.

```angular-ts {avoid, header: 'Component-level provider creates multiple instances'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>Profile</p>',
  providers: [UserClient], // Creates new instance per component!
})
export class UserProfile {
  private userService = inject(UserClient);
}

@Component({
  selector: 'app-settings',
  template: '<p>Settings</p>',
  providers: [UserClient], // Different instance!
})
export class UserSettings {
  private userService = inject(UserClient);
}
```

هر component instance مخصوص خودش از `UserClient` را می‌گیرد. تغییرات در یکی روی دیگری اثر ندارد.

**راه‌حل:** برای singletonها از `@Service` استفاده کنید.

```ts {prefer, header: 'Root-level singleton'}
import {Injectable} from '@angular/core';

@Service()
export class UserClient {
  // Single instance shared across all components
}
```

#### وقتی چند instance intentional است

گاهی برای state مخصوص component، instanceهای جداگانه می‌خواهید.

```angular-ts {header: 'Intentional: Component-scoped state'}
import {Injectable, signal} from '@angular/core';

@Injectable() // No providedIn - must be provided explicitly
export class FormStateStore {
  private formData = signal({});

  setData(data: any) {
    this.formData.set(data);
  }

  getData() {
    return this.formData();
  }
}

@Component({
  selector: 'app-user-form',
  template: '<form>...</form>',
  providers: [FormStateStore], // Each form gets its own state
})
export class UserForm {
  private formState = inject(FormStateStore);
}
```

این pattern برای موارد زیر مفید است:

- Form state management، وقتی هر form state isolated دارد
- caching مخصوص component
- data موقتی که نباید shared باشد

### استفاده نادرست از inject()

تابع `inject()` فقط در contextهای مشخص، هنگام class construction و factory execution کار می‌کند.

#### استفاده از inject() در lifecycle hookها

وقتی تابع `inject()` را داخل lifecycle hookهایی مثل `ngOnInit()`، `ngAfterViewInit()` یا `ngOnDestroy()` فراخوانی می‌کنید، Angular خطا throw می‌کند، چون این methodها بیرون از injection context اجرا می‌شوند. Injection context فقط هنگام execution synchronous مربوط به class construction در دسترس است، که پیش از فراخوانی lifecycle hookها رخ می‌دهد.

```angular-ts {avoid, header: 'inject() in ngOnInit'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{userName}}</p>',
})
export class UserProfile {
  userName = '';

  ngOnInit() {
    const userService = inject(UserClient); // ERROR: Not an injection context
    this.userName = userService.getUser().name;
  }
}
```

**راه‌حل:** Dependencyها را در field initializerها capture کنید و valueها را همان‌جا derive کنید.

```angular-ts {prefer, header: 'Derive values in field initializers'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{userName}}</p>',
})
export class UserProfile {
  private userService = inject(UserClient);
  userName = this.userService.getUser().name;
}
```

#### استفاده از Injector برای deferred injection

وقتی لازم است serviceها را بیرون از injection context retrieve کنید، از `Injector` capture شده مستقیم با `injector.get()` استفاده کنید:

```angular-ts
import {Component, inject, Injector} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<button (click)="delayedLoad()">Load Later</button>',
})
export class UserProfile {
  private injector = inject(Injector);

  delayedLoad() {
    setTimeout(() => {
      const userService = this.injector.get(UserClient);
      console.log(userService.getUser());
    }, 1000);
  }
}
```

#### استفاده از runInInjectionContext برای callbackها

وقتی لازم است **کد دیگری** بتواند `inject()` را فراخوانی کند، از `runInInjectionContext()` استفاده کنید. این زمانی مفید است که callbackهایی می‌پذیرید که ممکن است از dependency injection استفاده کنند:

```angular-ts
import {Component, inject, Injector, input} from '@angular/core';

@Component({
  selector: 'app-data-loader',
  template: '<button (click)="load()">Load</button>',
})
export class DataLoader {
  private injector = inject(Injector);
  onLoad = input<() => void>();

  load() {
    const callback = this.onLoad();
    if (callback) {
      // Enable the callback to use inject()
      this.injector.runInInjectionContext(callback);
    }
  }
}
```

Method مربوط به `runInInjectionContext()` یک injection context موقت می‌سازد و به کد داخل callback اجازه می‌دهد `inject()` را فراخوانی کند.

IMPORTANT: تا جای ممکن همیشه dependencyها را در سطح class capture کنید. برای retrieval ساده deferred از `injector.get()` استفاده کنید و `runInInjectionContext()` را فقط وقتی استفاده کنید که کد خارجی باید `inject()` را فراخوانی کند.

TIP: برای verify کردن اینکه کد شما در injection context معتبر اجرا می‌شود، از `assertInInjectionContext()` استفاده کنید. این هنگام ساخت functionهای reusable که `inject()` را فراخوانی می‌کنند مفید است. برای جزئیات، [Asserting the context](guide/di/dependency-injection-context#asserts-the-context) را ببینید.

### ابهام providers و viewProviders

تفاوت میان `providers` و `viewProviders` روی scenarioهای content projection اثر می‌گذارد.

#### درک تفاوت

**providers:** برای template خود component و هر contentی که داخل component project شده باشد، یعنی ng-content، در دسترس است.

**viewProviders:** فقط برای template خود component در دسترس است، نه برای projected content.

```angular-ts {header: 'parent-view.ts'}
import {Component, inject} from '@angular/core';
import {ThemeStore} from './theme-store';

@Component({
  selector: 'app-parent',
  template: `
    <div>
      <p>Theme: {{ themeService.theme() }}</p>
      <ng-content />
    </div>
  `,
  providers: [ThemeStore], // Available to content children
})
export class ParentView {
  protected themeService = inject(ThemeStore);
}

@Component({
  selector: 'app-parent-view',
  template: `
    <div>
      <p>Theme: {{ themeService.theme() }}</p>
      <ng-content />
    </div>
  `,
  viewProviders: [ThemeStore], // NOT available to content children
})
export class ParentViewOnly {
  protected themeService = inject(ThemeStore);
}
```

```angular-ts {header: 'child-view.ts'}
import {Component, inject} from '@angular/core';
import {ThemeStore} from './theme-store';

@Component({
  selector: 'app-child',
  template: '<p>Child theme: {{theme()}}</p>',
})
export class ChildView {
  private themeService = inject(ThemeStore, {optional: true});
  theme = () => this.themeService?.theme() ?? 'none';
}
```

```angular-ts {header: 'app.ts'}
@Component({
  selector: 'app-root',
  template: `
    <app-parent>
      <app-child />
      <!-- Can access ThemeStore -->
    </app-parent>

    <app-parent-view>
      <app-child />
      <!-- Cannot access ThemeStore -->
    </app-parent-view>
  `,
})
export class App {}
```

**وقتی داخل `app-parent` project شود:** child component می‌تواند `ThemeStore` را inject کند، چون `providers` آن را برای projected content در دسترس قرار می‌دهد.

**وقتی داخل `app-parent-view` project شود:** child component نمی‌تواند `ThemeStore` را inject کند، چون `viewProviders` آن را فقط به template parent محدود می‌کند.

#### انتخاب میان providers و viewProviders

از `providers` استفاده کنید وقتی:

- service باید برای projected content در دسترس باشد
- می‌خواهید content childها به service دسترسی داشته باشند
- serviceهای general-purpose provide می‌کنید

از `viewProviders` استفاده کنید وقتی:

- service فقط باید برای template component خودتان در دسترس باشد
- می‌خواهید implementation detailها را از projected content پنهان کنید
- serviceهای داخلی provide می‌کنید که نباید leak شوند

**پیشنهاد پیش‌فرض:** از `providers` استفاده کنید، مگر اینکه دلیل مشخصی برای محدود کردن access با `viewProviders` داشته باشید.

### مشکل‌های InjectionToken

هنگام استفاده از `InjectionToken` برای dependencyهای غیر class، توسعه‌دهندگان اغلب با مشکل‌های مرتبط با token identity، type safety و provider configuration روبه‌رو می‌شوند. این مشکل‌ها معمولا از نحوه handle کردن object identity در JavaScript و infer کردن typeها در TypeScript می‌آیند.

#### ابهام token identity

وقتی یک instance جدید از `InjectionToken` می‌سازید، JavaScript یک object یکتا در memory ایجاد می‌کند. حتی اگر یک `InjectionToken` دیگر با description string دقیقا یکسان بسازید، object کاملا متفاوتی است. Angular از identity خود token object، نه description آن، برای match کردن providerها با injection pointها استفاده می‌کند؛ بنابراین tokenهایی با description یکسان اما object identity متفاوت نمی‌توانند به valueهای هم دسترسی داشته باشند.

```ts {header: 'config.token.ts'}
import {InjectionToken} from '@angular/core';

export interface AppConfig {
  apiUrl: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app config');
```

```ts {header: 'app.config.ts'}
import {APP_CONFIG} from './config.token';

export const appConfig: AppConfig = {
  apiUrl: 'https://api.example.com',
};

bootstrapApplication(App, {
  providers: [{provide: APP_CONFIG, useValue: appConfig}],
});
```

```angular-ts {avoid, header: 'feature-view.ts'}
// Creating new token with same description
import {InjectionToken, inject} from '@angular/core';
import {AppConfig} from './config.token';

const APP_CONFIG = new InjectionToken<AppConfig>('app config');

@Component({
  selector: 'app-feature',
  template: '<p>Feature</p>',
})
export class FeatureView {
  private config = inject(APP_CONFIG); // ERROR: Different token instance!
}
```

با اینکه هر دو token description برابر `'app config'` دارند، objectهای متفاوتی هستند. Angular tokenها را با reference مقایسه می‌کند، نه description.

**راه‌حل:** همان token instance را import کنید.

```angular-ts {prefer, header: 'feature-view.ts'}
import {inject} from '@angular/core';
import {APP_CONFIG, AppConfig} from './config.token';

@Component({
  selector: 'app-feature',
  template: '<p>API: {{config.apiUrl}}</p>',
})
export class FeatureView {
  protected config = inject(APP_CONFIG); // Works: Same token instance
}
```

TIP: همیشه tokenها را از یک فایل shared export کنید و هر جا لازم است همان‌ها را import کنید. هرگز چند `InjectionToken` instance با description یکسان نسازید.

#### تلاش برای inject کردن interfaceها

وقتی یک TypeScript interface تعریف می‌کنید، فقط هنگام compilation برای type checking وجود دارد. TypeScript همه interface definitionها را هنگام compile به JavaScript حذف می‌کند؛ بنابراین در runtime objectی وجود ندارد که Angular بتواند به‌عنوان injection token استفاده کند. اگر تلاش کنید یک interface type را inject کنید، Angular چیزی برای match کردن با provider configuration ندارد.

```angular-ts {avoid, header: "Can't inject interface"}
interface UserConfig {
  name: string;
  email: string;
}

@Component({
  selector: 'app-profile',
  template: '<p>Profile</p>',
})
export class UserProfile {
  // ERROR: Interfaces don't exist at runtime
  constructor(private config: UserConfig) {}
}
```

**راه‌حل:** برای interface typeها از `InjectionToken` استفاده کنید.

```angular-ts {prefer, header: 'Use InjectionToken for interfaces'}
import {InjectionToken, inject} from '@angular/core';

interface UserConfig {
  name: string;
  email: string;
}

export const USER_CONFIG = new InjectionToken<UserConfig>('user configuration');

// Provide the configuration
bootstrapApplication(App, {
  providers: [
    {
      provide: USER_CONFIG,
      useValue: {name: 'Alice', email: 'alice@example.com'},
    },
  ],
});

// Inject using the token
@Component({
  selector: 'app-profile',
  template: '<p>User: {{config.name}}</p>',
})
export class UserProfile {
  protected config = inject(USER_CONFIG);
}
```

`InjectionToken` در runtime وجود دارد و می‌تواند برای injection استفاده شود، در حالی که interface مربوط به `UserConfig` در زمان development type safety فراهم می‌کند.

### Circular dependencyها

Circular dependencyها زمانی رخ می‌دهند که serviceها همدیگر را inject کنند و cycleای بسازند که Angular نتواند resolve کند. برای توضیح‌های دقیق و مثال‌های کد، [NG0200: Circular dependency](errors/NG0200) را ببینید.

**Strategyهای resolution**، به‌ترتیب ترجیح:

1. **Restructure** - logic مشترک را به service سوم استخراج کنید و cycle را بشکنید
2. **استفاده از eventها** - dependencyهای مستقیم را با communication مبتنی بر event جایگزین کنید، مثل `Subject`
3. **Lazy injection** - از `Injector.get()` برای defer کردن یک dependency استفاده کنید، فقط به‌عنوان آخرین راه

NOTE: از `forwardRef()` برای service circular dependencyها استفاده نکنید؛ این فقط circular importها را در standalone component configuration حل می‌کند.

## Debug کردن dependency resolution

### درک فرایند resolution

Angular dependencyها را با بالا رفتن در injector hierarchy resolve می‌کند. وقتی `NullInjectorError` رخ می‌دهد، فهمیدن search order کمک می‌کند تشخیص دهید provider جاافتاده را کجا اضافه کنید.

Angular به این ترتیب search می‌کند:

1. **Element injector** - component یا directive فعلی
2. **Parent element injectorها** - بالا رفتن در DOM tree از طریق componentهای parent
3. **Environment injector** - route یا application injector
4. **NullInjector** - اگر پیدا نشود `NullInjectorError` throw می‌کند

وقتی `NullInjectorError` می‌بینید، service در هیچ سطحی که component بتواند access کند provide نشده است. بررسی کنید:

- service دارای `@Service()` است یا
- service دارای `@Injectable({providedIn: 'root'})` است، یا
- service در array مربوط به `providers` قرار دارد که component می‌تواند به آن برسد

می‌توانید این search behavior را با resolution modifierهایی مثل `self`، `skipSelf`، `host` و `optional` تغییر دهید. برای پوشش کامل resolution ruleها و modifierها، [Hierarchical injectors guide](guide/di/hierarchical-dependency-injection) را ببینید.

### استفاده از Angular DevTools

Angular DevTools یک injector tree inspector دارد که کل injector hierarchy را visualize می‌کند و نشان می‌دهد در هر سطح چه providerهایی در دسترس هستند. برای نصب و استفاده عمومی، [Angular DevTools injector documentation](tools/devtools/injectors) را ببینید.

هنگام debug کردن مشکل‌های DI، از DevTools برای پاسخ به این پرسش‌ها استفاده کنید:

- **آیا service provide شده است؟** componentی را که injection در آن fail می‌شود انتخاب کنید و بررسی کنید service در بخش Injector ظاهر می‌شود یا نه.
- **در چه سطحی؟** در component tree بالا بروید تا ببینید service واقعا کجا provide شده است: component، route یا application level.
- **چند instance؟** اگر singleton service در چند component injector ظاهر شود، احتمالا به‌جای استفاده از `@Service` یا `providedIn: 'root'`، در arrayهای `providers` componentها provide شده است.

اگر service در هیچ injector ظاهر نشود، verify کنید decorator مربوط به `@Service` دارد یا در array مربوط به `providers` list شده است.

### Logging و tracing injection

وقتی DevTools کافی نیست، از logging برای trace کردن injection behavior استفاده کنید.

#### Log کردن service creation

به constructorهای serviceها console log اضافه کنید تا ببینید serviceها چه زمانی ساخته می‌شوند.

```ts
import {Service} from '@angular/core';

@Service()
export class UserClient {
  constructor() {
    console.log('UserClient created');
    console.trace(); // Shows call stack
  }

  getUser() {
    return {name: 'Alice'};
  }
}
```

وقتی service ساخته شود، log message و stack trace را می‌بینید که نشان می‌دهد injection کجا رخ داده است.

**دنبال چه چیزی بگردیم:**

- constructor چند بار فراخوانی شده است؟ برای singletonها باید یک بار باشد
- در کجای کد inject شده است؟ stack trace را بررسی کنید
- آیا در زمان موردانتظار ساخته شده است؟ application startup در برابر lazy

#### بررسی availability مربوط به service

از optional injection همراه با logging استفاده کنید تا تشخیص دهید یک service در دسترس هست یا نه.

```angular-ts
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-debug',
  template: '<p>Debug Component</p>',
})
export class DebugView {
  private userService = inject(UserClient, {optional: true});

  constructor() {
    if (this.userService) {
      console.log('UserClient available:', this.userService);
    } else {
      console.warn('UserClient NOT available');
      console.trace(); // Shows where we tried to inject
    }
  }
}
```

این pattern کمک می‌کند بدون crash کردن application، verify کنید service در دسترس هست یا نه.

#### Log کردن resolution modifierها

Strategyهای مختلف resolution را با logging test کنید.

```angular-ts
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-debug',
  template: '<p>Debug Component</p>',
  providers: [UserClient],
})
export class DebugView {
  // Try to get local instance
  private localService = inject(UserClient, {self: true, optional: true});

  // Try to get parent instance
  private parentService = inject(UserClient, {
    skipSelf: true,
    optional: true,
  });

  constructor() {
    console.log('Local instance:', this.localService);
    console.log('Parent instance:', this.parentService);
    console.log('Same instance?', this.localService === this.parentService);
  }
}
```

این نشان می‌دهد چه instanceهایی در injector levelهای مختلف در دسترس‌اند.

### Workflow پیشنهادی debugging

وقتی DI fail می‌شود، این approach سیستماتیک را دنبال کنید:

**Step 1: Error message را بخوانید**

- error code را شناسایی کنید، مثل NG0200، NG0203 و غیره
- dependency path را بخوانید
- tokenی را که fail شده یادداشت کنید

**Step 2: پایه‌ها را بررسی کنید**

- آیا service `@Service` یا `@Injectable()` دارد؟
- اگر از `@Injectable` استفاده می‌کنید، آیا `providedIn` درست set شده است؟
- آیا importها درست هستند؟
- آیا فایل وارد compilation شده است؟

**Step 3: Injection context را verify کنید**

- آیا `inject()` در context معتبر فراخوانی شده است؟
- مشکل‌های async را بررسی کنید، مثل await، setTimeout و promiseها
- timing را verify کنید، مثلا بعد از destroy نباشد

**Step 4: از ابزارهای debugging استفاده کنید**

- Angular DevTools را باز کنید
- injector hierarchy را بررسی کنید
- به constructorها console log اضافه کنید
- از optional injection برای test کردن availability استفاده کنید

**Step 5: ساده و isolate کنید**

- dependencyها را یکی‌یکی حذف کنید
- در یک component minimal test کنید
- هر injector level را جداگانه بررسی کنید
- یک reproduction case بسازید

## مرجع خطاهای DI

این بخش اطلاعات دقیق‌تری درباره error codeهای DI در Angular ارائه می‌دهد که ممکن است با آن‌ها روبه‌رو شوید. وقتی این errorها را در console دیدید، از این بخش به‌عنوان reference استفاده کنید.

### NullInjectorError: No provider for [Service]

**Error code:** ندارد، به‌صورت `NullInjectorError` نمایش داده می‌شود

این error زمانی رخ می‌دهد که Angular نتواند provider مربوط به یک token را در injector hierarchy پیدا کند. Error message شامل dependency path است که نشان می‌دهد injection کجا attempt شده است.

```
NullInjectorError: No provider for UserClient!
  Dependency path: App -> AuthClient -> UserClient
```

Dependency path نشان می‌دهد `App`، `AuthClient` را inject کرده، و `AuthClient` تلاش کرده `UserClient` را inject کند، اما provider پیدا نشده است.

#### نبود decorator مربوط به `@Service ` یا `@Injectable`

رایج‌ترین علت، فراموش کردن decorator مربوط به `@Service` یا `@Injectable()` روی service class است.

```ts {avoid, header: 'Missing decorator'}
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

Angular برای تولید metadata لازم برای dependency injection به decorator مربوط به `@Service()` نیاز دارد.

```ts {prefer, header: 'Include @Service'}
import {Service} from '@angular/core';

@Service()
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

NOTE: Classهایی با constructor بدون argument ممکن است بدون `@Service()` هم کار کنند، اما این پیشنهاد نمی‌شود. همیشه برای consistency و جلوگیری از مشکل هنگام اضافه کردن dependencyها در آینده، decorator را include کنید.

#### نبود providedIn configuration

ممکن است یک service `@Injectable()` داشته باشد اما مشخص نکند کجا باید provide شود.

```ts {avoid, header: 'No providedIn specified'}
import {Injectable} from '@angular/core';

@Injectable()
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

از decorator مربوط به `@Service` استفاده کنید تا service در سراسر application شما در دسترس شود.

```ts {prefer, header: 'Specify providedIn'}
import {Service} from '@angular/core';

@Service()
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

Decorator مربوط به `@Service` service را application-wide در دسترس قرار می‌دهد و tree-shaking را فعال می‌کند؛ اگر service هرگز inject نشود از bundle حذف می‌شود.

#### Standalone component با importهای جاافتاده

در Angular v20+ با standalone componentها، باید dependencyها را در هر component صراحتا import یا provide کنید.

```angular-ts {avoid, header: 'Missing service import'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{user().name}}</p>',
})
export class UserProfile {
  private userService = inject(UserClient); // ERROR: No provider
  user = this.userService.getUser();
}
```

مطمئن شوید service از `@Service` استفاده می‌کند یا آن را به array مربوط به `providers` در component اضافه کنید.

```angular-ts {prefer, header: 'Service uses providedIn: root'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{user().name}}</p>',
})
export class UserProfile {
  private userService = inject(UserClient); // Works: providedIn: 'root'
  user = this.userService.getUser();
}
```

#### Debugging با dependency path

Dependency path در error message زنجیره injectionهایی را نشان می‌دهد که به failure منجر شده‌اند.

```
NullInjectorError: No provider for LoggerStore!
  Dependency path: App -> DataStore -> ApiClient -> LoggerStore
```

این path به شما می‌گوید:

1. `App`، `DataStore` را inject کرده است
2. `DataStore`، `ApiClient` را inject کرده است
3. `ApiClient` تلاش کرده `LoggerStore` را inject کند
4. هیچ providerای برای `LoggerStore` پیدا نشده است

Investigation را از انتهای chain یعنی `LoggerStore` شروع کنید و verify کنید configuration درست دارد.

#### بررسی provider availability با optional injection

از optional injection استفاده کنید تا بدون throw شدن error بررسی کنید provider وجود دارد یا نه.

```angular-ts
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-debug',
  template: '<p>Service available: {{serviceAvailable}}</p>',
})
export class DebugView {
  private userService = inject(UserClient, {optional: true});
  serviceAvailable = this.userService !== null;
}
```

Optional injection اگر provider پیدا نشود `null` برمی‌گرداند و اجازه می‌دهد absence را gracefully handle کنید.

### NG0203: inject() must be called from an injection context

**Error code:** NG0203

این error وقتی رخ می‌دهد که `inject()` را بیرون از injection context معتبر فراخوانی کنید. Angular لازم دارد `inject()` به‌صورت synchronous هنگام class construction یا factory execution فراخوانی شود.

```
NG0203: inject() must be called from an injection context such as a
constructor, a factory function, a field initializer, or a function
used with `runInInjectionContext`.
```

#### Injection contextهای معتبر

Angular در این locationها `inject()` را مجاز می‌داند:

1. **Class field initializerها**

   ```angular-ts
   import {Component, inject} from '@angular/core';
   import {UserClient} from './user-client';

   @Component({
     selector: 'app-profile',
     template: '<p>User: {{user().name}}</p>',
   })
   export class UserProfile {
     private userService = inject(UserClient); // Valid
     user = this.userService.getUser();
   }
   ```

2. **Class constructor**

   ```angular-ts
   import {Component, inject} from '@angular/core';
   import {UserClient} from './user-client';

   @Component({
     selector: 'app-profile',
     template: '<p>User: {{user().name}}</p>',
   })
   export class UserProfile {
     private userService: UserClient;

     constructor() {
       this.userService = inject(UserClient); // Valid
     }

     user = this.userService.getUser();
   }
   ```

3. **Provider factory functionها**

   ```ts
   import {inject, InjectionToken} from '@angular/core';
   import {UserClient} from './user-client';

   export const GREETING = new InjectionToken<string>('greeting', {
     factory() {
       const userService = inject(UserClient); // Valid
       const user = userService.getUser();
       return `Hello, ${user.name}`;
     },
   });
   ```

4. **داخل runInInjectionContext()**

   ```angular-ts
   import {Component, inject, Injector} from '@angular/core';
   import {UserClient} from './user-client';

   @Component({
     selector: 'app-profile',
     template: '<button (click)="loadUser()">Load User</button>',
   })
   export class UserProfile {
     private injector = inject(Injector);

     loadUser() {
       this.injector.runInInjectionContext(() => {
         const userService = inject(UserClient); // Valid
         console.log(userService.getUser());
       });
     }
   }
   ```

Injection contextهای دیگری که `inject()` در آن‌ها کار می‌کند شامل این موارد است:

- [provideAppInitializer](api/core/provideAppInitializer)
- [provideEnvironmentInitializer](api/core/provideEnvironmentInitializer)
- [route guard](guide/routing/route-guards)های functional
- [data resolver](guide/routing/data-resolvers)های functional

#### این error چه زمانی رخ می‌دهد

این error زمانی رخ می‌دهد که:

- `inject()` را در lifecycle hookها فراخوانی کنید، مثل `ngOnInit`، `ngAfterViewInit` و غیره
- `inject()` را بعد از `await` در async functionها فراخوانی کنید
- `inject()` را در callbackها فراخوانی کنید، مثل `setTimeout` یا `Promise.then()`
- `inject()` را بیرون از phase مربوط به class construction فراخوانی کنید

برای مثال‌ها و راه‌حل‌های دقیق، بخش "Incorrect inject() usage" را ببینید.

#### راه‌حل‌ها و workaroundها

**Solution 1:** Dependencyها را در field initializerها capture کنید، رایج‌ترین حالت

```ts
private userService = inject(UserClient) // Capture at class level
```

**Solution 2:** برای callbackها از `runInInjectionContext()` استفاده کنید

```ts
private injector = inject(Injector)

someCallback() {
  this.injector.runInInjectionContext(() => {
    const service = inject(MyClient)
  })
}
```

**Solution 3:** به‌جای inject کردن dependencyها داخل callback، آن‌ها را به‌عنوان parameter پاس دهید

```ts
// Instead of injecting inside a callback
setTimeout(() => {
  const service = inject(MyClient) // ERROR
}, 1000)

// Capture first, then use
private service = inject(MyClient)

setTimeout(() => {
  this.service.doSomething() // Use captured reference
}, 1000)
```

### NG0200: Circular dependency detected

**Error code:** NG0200

این error وقتی رخ می‌دهد که دو یا چند service به هم وابسته باشند و circular dependencyای بسازند که Angular نتواند resolve کند.

```
NG0200: Circular dependency in DI detected for AuthClient
  Dependency path: AuthClient -> UserClient -> AuthClient
```

Dependency path cycle را نشان می‌دهد: `AuthClient` به `UserClient` وابسته است و `UserClient` دوباره به `AuthClient` وابسته است.

#### درک error

Angular service instanceها را با فراخوانی constructorهای آن‌ها و inject کردن dependencyها می‌سازد. وقتی serviceها circularly به هم وابسته باشند، Angular نمی‌تواند تشخیص دهد کدام را اول بسازد.

#### علت‌های رایج

- Circular dependency مستقیم، Service A → Service B → Service A
- Circular dependency غیرمستقیم، Service A → Service B → Service C → Service A
- Import cycleها در module fileهایی که service dependency هم دارند

#### Strategyهای resolution

برای مثال‌ها و راه‌حل‌های دقیق، بخش "Circular dependencies" را ببینید:

1. **Restructure** - logic مشترک را به service سوم استخراج کنید، پیشنهادشده
2. **استفاده از eventها** - dependencyهای مستقیم را با communication مبتنی بر event جایگزین کنید
3. **Lazy injection** - از `Injector.get()` برای defer کردن یک dependency استفاده کنید، آخرین راه

برای service circular dependencyها از `forwardRef()` استفاده نکنید. این فقط circular importها را در component configuration حل می‌کند.

### سایر error codeهای DI

برای توضیح‌ها و راه‌حل‌های دقیق این errorها، [Angular error reference](errors) را ببینید:

| Error Code              | Description                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| [NG0204](errors/NG0204) | نمی‌تواند همه parameterها را resolve کند - decorator مربوط به `@Injectable()` جا افتاده است |
| [NG0205](errors/NG0205) | Injector قبلا destroy شده - دسترسی به serviceها بعد از component destruction               |
| [NG0207](errors/NG0207) | EnvironmentProviders در context اشتباه - استفاده از `provideHttpClient()` در component providers |

## قدم‌های بعدی

وقتی با DI error روبه‌رو می‌شوید، به یاد داشته باشید:

1. Error message و dependency path را با دقت بخوانید
2. Configuration پایه را verify کنید، مثل decoratorها، `providedIn` و importها
3. Injection context و timing را بررسی کنید
4. برای investigate از DevTools و logging استفاده کنید
5. مشکل را ساده و isolate کنید

برای درک عمیق‌تر topicهای مشخص dependency injection، این‌ها را ببینید:

- [Understanding dependency injection](guide/di) - مفهوم‌ها و patternهای اصلی DI
- [Hierarchical dependency injection](guide/di/hierarchical-dependency-injection) - injector hierarchy چگونه کار می‌کند
- [Testing with dependency injection](guide/testing) - استفاده از TestBed و mock کردن dependencyها
