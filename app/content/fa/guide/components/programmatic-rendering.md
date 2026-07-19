# Render کردن componentها به‌صورت برنامه‌نویسی

TIP: این راهنما فرض می‌کند که قبلا [راهنمای Essentials](essentials) را خوانده‌اید. اگر با Angular تازه شروع کرده‌اید، اول آن را بخوانید.

علاوه بر استفاده مستقیم از یک component در template، می‌توانید componentها را به‌صورت dynamic و برنامه‌نویسی‌شده هم render کنید. این برای موقعیت‌هایی مفید است که component در ابتدا مشخص نیست، در نتیجه نمی‌توان مستقیم در template به آن reference داد، و به چند شرط وابسته است.

دو راه اصلی برای render کردن برنامه‌نویسی‌شده component وجود دارد: در template با استفاده از `NgComponentOutlet`، یا در کد TypeScript با استفاده از `ViewContainerRef`.

HELPFUL: برای use-caseهای lazy-loading، مثلا وقتی می‌خواهید بارگذاری یک component سنگین را به تاخیر بیندازید، بهتر است از قابلیت built-in مربوط به [`@defer`](/guide/templates/defer) استفاده کنید. قابلیت `@defer` اجازه می‌دهد کد هر component، directive و pipe داخل block مربوط به `@defer` به‌صورت خودکار در chunkهای JavaScript جداگانه استخراج شود و فقط در صورت نیاز، بر اساس triggerهای configure شده، load شود.

## استفاده از NgComponentOutlet

`NgComponentOutlet` یک structural directive است که یک component مشخص را به‌صورت dynamic در template render می‌کند.

```angular-ts
@Component({/*...*/})
export class AdminBio { /* ... */ }

@Component({/*...*/})
export class StandardBio { /* ... */ }

@Component({
  ...,
  template: `
    <p>Profile for {{user.name}}</p>
    <ng-container *ngComponentOutlet="getBioComponent()" /> `
})
export class CustomDialog {
  user = input.required<User>();

  getBioComponent() {
    return this.user().isAdmin ? AdminBio : StandardBio;
  }
}
```

### پاس دادن inputها به componentهای render شده به‌صورت dynamic

می‌توانید با استفاده از property مربوط به `ngComponentOutletInputs`، inputها را به componentی که به‌صورت dynamic render شده پاس دهید. این property یک object می‌پذیرد که keyهای آن نام inputها و valueهای آن مقدار inputها هستند.

```angular-ts
@Component({
  selector: 'user-greeting',
  template: `
    <div>
      <p>User: {{ username() }}</p>
      <p>Role: {{ role() }}</p>
    </div>
  `,
})
export class UserGreeting {
  username = input.required<string>();
  role = input('guest');
}

@Component({
  selector: 'profile-view',
  imports: [NgComponentOutlet],
  template: `<ng-container *ngComponentOutlet="greetingComponent; inputs: greetingInputs()" />`,
})
export class ProfileView {
  greetingComponent = UserGreeting;
  greetingInputs = signal({username: 'ngAwesome', role: 'admin'});
}
```

هر بار Signal مربوط به `greetingInputs` تغییر کند، inputها update می‌شوند و component dynamic با state والد sync می‌ماند.

### فراهم کردن content projection

از `ngComponentOutletContent` برای پاس دادن projected content به componentی که به‌صورت dynamic render شده استفاده کنید. این زمانی مفید است که component dynamic از `<ng-content>` برای نمایش محتوا استفاده می‌کند.

```angular-ts
@Component({
  selector: 'card-wrapper',
  template: `
    <div class="card">
      <ng-content />
    </div>
  `,
})
export class CardWrapper {}

@Component({
  imports: [NgComponentOutlet],
  template: `
    <ng-container *ngComponentOutlet="cardComponent; content: cardContent()" />

    <ng-template #contentTemplate>
      <h3>Dynamic Content</h3>
      <p>This content is projected into the card.</p>
    </ng-template>
  `,
})
export class DynamicCard {
  private vcr = inject(ViewContainerRef);
  cardComponent = CardWrapper;

  private contentTemplate = viewChild<TemplateRef<unknown>>('contentTemplate');

  cardContent = computed(() => {
    const template = this.contentTemplate();
    if (!template) return [];
    // Returns an array of projection slots. Each element represents one <ng-content> slot.
    // CardWrapper has one <ng-content>, so we return an array with one element.
    return [this.vcr.createEmbeddedView(template).rootNodes];
  });
}
```

NOTE: Hydration از project کردن DOM nodeهایی که با APIهای بومی DOM ساخته شده‌اند پشتیبانی نمی‌کند. این باعث خطای [NG0503](/errors/NG0503) می‌شود. برای ساخت projected content از APIهای Angular استفاده کنید یا `ngSkipHydration` را به component اضافه کنید.

### فراهم کردن injectorها

می‌توانید با استفاده از `ngComponentOutletInjector` یک injector سفارشی برای component ساخته‌شده به‌صورت dynamic فراهم کنید. این برای ارائه serviceها یا configurationهای مخصوص component مفید است.

```angular-ts
export const THEME_DATA = new InjectionToken<string>('THEME_DATA', {
  factory: () => 'light',
});

@Component({
  selector: 'themed-panel',
  template: `<div [class]="theme">...</div>`,
})
export class ThemedPanel {
  theme = inject(THEME_DATA);
}

@Component({
  selector: 'dynamic-panel',
  imports: [NgComponentOutlet],
  template: `<ng-container *ngComponentOutlet="panelComponent; injector: customInjector" />`,
})
export class DynamicPanel {
  panelComponent = ThemedPanel;

  customInjector = Injector.create({
    providers: [{provide: THEME_DATA, useValue: 'dark'}],
  });
}
```

### دسترسی به instance مربوط به component

می‌توانید با استفاده از قابلیت `exportAs` در directive، به instance مربوط به component ساخته‌شده به‌صورت dynamic دسترسی داشته باشید:

```angular-ts
@Component({
  selector: 'counter',
  template: `<p>Count: {{ count() }}</p>`,
})
export class Counter {
  count = signal(0);
  increment() {
    this.count.update((c) => c + 1);
  }
}

@Component({
  imports: [NgComponentOutlet],
  template: `
    <ng-container [ngComponentOutlet]="counterComponent" #outlet="ngComponentOutlet" />

    <button (click)="outlet.componentInstance?.increment()">Increment</button>
  `,
})
export class CounterHost {
  counterComponent = Counter;
}
```

NOTE: property مربوط به `componentInstance` قبل از render شدن component برابر `null` است.

برای اطلاعات بیشتر درباره قابلیت‌های directive، [NgComponentOutlet API reference](api/common/NgComponentOutlet) را ببینید.

## استفاده از ViewContainerRef

یک **view container** یک node در درخت componentهای Angular است که می‌تواند content داشته باشد. هر component یا directive می‌تواند `ViewContainerRef` را inject کند تا reference به view container متناظر با محل همان component یا directive در DOM را بگیرد.

می‌توانید از متد `createComponent` روی `ViewContainerRef` برای ساخت و render کردن dynamic یک component استفاده کنید. وقتی با یک `ViewContainerRef` یک component جدید می‌سازید، Angular آن را به‌عنوان sibling بعدی component یا directiveای که `ViewContainerRef` را inject کرده، به DOM append می‌کند.

```angular-ts
@Component({
  selector: 'leaf-content',
  template: `This is the leaf content`,
})
export class LeafContent {}

@Component({
  selector: 'outer-container',
  template: `
    <p>This is the start of the outer container</p>
    <inner-item />
    <p>This is the end of the outer container</p>
  `,
})
export class OuterContainer {}

@Component({
  selector: 'inner-item',
  template: `<button (click)="loadContent()">Load content</button>`,
})
export class InnerItem {
  private viewContainer = inject(ViewContainerRef);

  loadContent() {
    this.viewContainer.createComponent(LeafContent);
  }
}
```

در مثال بالا، کلیک روی دکمه "Load content" باعث ایجاد ساختار DOM زیر می‌شود:

```angular-html
<outer-container>
  <p>This is the start of the outer container</p>
  <inner-item>
    <button>Load content</button>
  </inner-item>
  <leaf-content>This is the leaf content</leaf-content>
  <p>This is the end of the outer container</p>
</outer-container>
```

## Lazy-loading componentها

HELPFUL: اگر می‌خواهید چند component را lazy-load کنید، بهتر است از قابلیت built-in مربوط به [`@defer`](/guide/templates/defer) استفاده کنید.

اگر use-case شما با قابلیت `@defer` پوشش داده نمی‌شود، می‌توانید از `NgComponentOutlet` یا `ViewContainerRef` همراه با [dynamic import](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import) استاندارد JavaScript استفاده کنید.

```angular-ts
@Component({
  ...,
  template: `
    <section>
      <h2>Basic settings</h2>
      <basic-settings />
    </section>
    <section>
      <h2>Advanced settings</h2>
      @if(!advancedSettings) {
        <button (click)="loadAdvanced()">
          Load advanced settings
        </button>
      }
      <ng-container *ngComponentOutlet="advancedSettings" />
    </section>
  `
})
export class AdminSettings {
  advancedSettings: {new(): AdvancedSettings} | undefined;

  async loadAdvanced() {
    const { AdvancedSettings } = await import('path/to/advanced_settings.js');
    this.advancedSettings = AdvancedSettings;
  }
}
```

مثال بالا پس از دریافت click روی button، `AdvancedSettings` را load و نمایش می‌دهد.

## Binding کردن inputها و outputها و تنظیم host directiveها هنگام creation

وقتی componentها را به‌صورت dynamic می‌سازید، set کردن دستی inputها و subscribe کردن به outputها می‌تواند error-prone باشد. اغلب لازم است فقط برای وصل کردن bindingها بعد از instantiate شدن component، کد اضافه بنویسید.

برای ساده‌تر کردن این کار، هم `createComponent` و هم `ViewContainerRef.createComponent` از پاس دادن یک آرایه `bindings` با helperهایی مثل `inputBinding()`، `outputBinding()` و `twoWayBinding()` برای configure کردن inputها و outputها از ابتدا پشتیبانی می‌کنند. همچنین می‌توانید یک آرایه `directives` مشخص کنید تا هر host directive اعمال شود. این امکان ساخت برنامه‌نویسی‌شده componentها با bindingهایی شبیه template را در یک فراخوانی declarative فراهم می‌کند.

### Host view با استفاده از `ViewContainerRef.createComponent`

`ViewContainerRef.createComponent` یک component می‌سازد و host view و host element آن را به‌صورت خودکار در hierarchy مربوط به view container و در محل container insert می‌کند. وقتی dynamic component باید بخشی از ساختار logical و visual مربوط به container باشد از این روش استفاده کنید، مثلا برای اضافه کردن list itemها یا UI inline.

در مقابل، API standalone مربوط به `createComponent`، component جدید را به هیچ view یا محل DOM موجودی attach نمی‌کند؛ یک `ComponentRef` برمی‌گرداند و کنترل explicit روی محل قرار دادن host element component به شما می‌دهد.

```angular-ts
import {Component, input, model, output} from '@angular/core';

@Component({
  selector: 'app-warning',
  template: `
    @if (isExpanded()) {
      <section>
        <p>Warning: Action needed!</p>
        <button (click)="close.emit(true)">Close</button>
      </section>
    }
  `,
})
export class AppWarning {
  readonly canClose = input.required<boolean>();
  readonly isExpanded = model<boolean>();
  readonly close = output<boolean>();
}
```

```ts
import {
  Component,
  ViewContainerRef,
  signal,
  inputBinding,
  outputBinding,
  twoWayBinding,
  inject,
} from '@angular/core';
import {FocusTrap} from '@angular/cdk/a11y';
import {ThemeDirective} from '../theme.directive';

@Component({
  template: `<ng-container #container />`,
})
export class Host {
  private vcr = inject(ViewContainerRef);
  readonly canClose = signal(true);
  readonly isExpanded = signal(true);

  showWarning() {
    const compRef = this.vcr.createComponent(AppWarning, {
      bindings: [
        inputBinding('canClose', this.canClose),
        twoWayBinding('isExpanded', this.isExpanded),
        outputBinding<boolean>('close', (confirmed) => {
          console.log('Closed with result:', confirmed);
        }),
      ],
      directives: [
        FocusTrap,
        {type: ThemeDirective, bindings: [inputBinding('theme', () => 'warning')]},
      ],
    });
  }
}
```

در مثال بالا، **AppWarning** به‌صورت dynamic ساخته می‌شود، در حالی که input مربوط به `canClose` آن به یک Signal reactive bind شده، یک two-way binding روی state مربوط به `isExpanded` دارد و یک output listener برای `close` تنظیم شده است. `FocusTrap` و `ThemeDirective` از طریق `directives` به host element attach می‌شوند.

### Popup متصل به `document.body` با `createComponent` + `hostElement`

وقتی بیرون از hierarchy مربوط به view فعلی render می‌کنید، مثلا برای overlayها، از این روش استفاده کنید. `hostElement` فراهم‌شده host مربوط به component در DOM می‌شود، بنابراین Angular element جدیدی مطابق selector ایجاد نمی‌کند. این روش اجازه می‌دهد **bindings** را مستقیم configure کنید.

```ts
import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  inputBinding,
  outputBinding,
  Service,
} from '@angular/core';
import {Popup} from './popup';

@Service()
export class PopupService {
  private readonly injector = inject(EnvironmentInjector);
  private readonly appRef = inject(ApplicationRef);

  show(message: string) {
    // Create a host element for the popup
    const host = document.createElement('popup-host');

    // Create the component and bind in one call
    const ref = createComponent(Popup, {
      environmentInjector: this.injector,
      hostElement: host,
      bindings: [
        inputBinding('message', () => message),
        outputBinding('closed', () => {
          document.body.removeChild(host);
          this.appRef.detachView(ref.hostView);
          ref.destroy();
        }),
      ],
    });

    // Registers the component’s view so it participates in change detection cycle.
    this.appRef.attachView(ref.hostView);
    // Inserts the provided host element into the DOM (outside the normal Angular view hierarchy).
    // This is what makes the popup visible on screen, typically used for overlays or modals.
    document.body.appendChild(host);
  }
}
```
