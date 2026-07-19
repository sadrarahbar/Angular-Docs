# اضافه کردن event listenerها

Angular از تعریف event listener روی یک element در template پشتیبانی می‌کند؛ کافی است نام event را داخل parenthesis همراه با statementای مشخص کنید که هر بار event رخ داد اجرا شود.

## گوش دادن به eventهای بومی

وقتی می‌خواهید به یک element از HTML event listener اضافه کنید، event را با parenthesis یعنی `()` wrap می‌کنید؛ این کار اجازه می‌دهد یک listener statement مشخص کنید.

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField()" />
  `,
  ...
})
export class App{
  updateField(): void {
    console.log('Field is updated!');
  }
}
```

در این مثال، هر بار element مربوط به `<input>` یک event از نوع `keyup` emit کند، Angular تابع `updateField` را فراخوانی می‌کند.

می‌توانید برای هر event بومی listener اضافه کنید، مثل `click`، `keydown`، `mouseover` و غیره. برای یادگیری بیشتر، [همه eventهای موجود روی elementها در MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element#events) را ببینید.

## دسترسی به argument مربوط به event

در هر template event listener، Angular متغیری به نام `$event` فراهم می‌کند که شامل reference به event object است.

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField($event)" />
  `,
  ...
})
export class App {
  updateField(event: KeyboardEvent): void {
    console.log(`The user pressed: ${event.key}`);
  }
}
```

## استفاده از key modifierها

وقتی می‌خواهید keyboard eventهای مشخصی را برای یک key مشخص capture کنید، ممکن است کدی شبیه زیر بنویسید:

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField($event)" />
  `,
  ...
})
export class App {
  updateField(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      console.log('The user pressed enter in the text field.');
    }
  }
}
```

اما چون این سناریو رایج است، Angular اجازه می‌دهد eventها را با مشخص کردن یک key خاص و استفاده از کاراکتر period یعنی `.` filter کنید. با این کار، کد می‌تواند به شکل زیر ساده شود:

```angular-ts
@Component({
  template: `
    <input type="text" (keyup.enter)="updateField($event)" />
  `,
  ...
})
export class App{
  updateField(event: KeyboardEvent): void {
    console.log('The user pressed enter in the text field.');
  }
}
```

همچنین می‌توانید key modifierهای بیشتری اضافه کنید:

```angular-html
<!-- Matches shift and enter -->
<input type="text" (keyup.shift.enter)="updateField($event)" />
```

Angular از modifierهای `alt`، `control`، `meta` و `shift` پشتیبانی می‌کند.

می‌توانید key یا codeای را که می‌خواهید به keyboard eventها bind شود مشخص کنید. فیلدهای key و code بخشی بومی از keyboard event object مرورگر هستند. به‌صورت پیش‌فرض، event binding فرض می‌کند می‌خواهید از [Key values for keyboard events](https://developer.mozilla.org/docs/Web/API/UI_Events/Keyboard_event_key_values) استفاده کنید.

Angular همچنین اجازه می‌دهد با ارائه suffix built-in مربوط به `code`، [Code values for keyboard events](https://developer.mozilla.org/docs/Web/API/UI_Events/Keyboard_event_code_values) را مشخص کنید.

```angular-html
<!-- Matches alt and left shift -->
<input type="text" (keydown.code.alt.shiftleft)="updateField($event)" />
```

این کار می‌تواند برای handling یکسان keyboard eventها در operating systemهای مختلف مفید باشد. مثلا هنگام استفاده از کلید Alt روی دستگاه‌های macOS، property مربوط به `key` مقدار کلید را بر اساس characterی گزارش می‌کند که قبلا توسط Alt تغییر کرده است. یعنی ترکیبی مثل Alt + S مقدار `key` برابر با `'ß'` گزارش می‌دهد. اما property مربوط به `code` به دکمه فیزیکی یا virtual فشرده‌شده متناظر است، نه character تولیدشده.

## گوش دادن روی targetهای global

نام targetهای global می‌توانند به‌عنوان prefix برای یک event استفاده شوند. سه target global پشتیبانی‌شده عبارت‌اند از `window`، `document` و `body`.

```angular-ts
@Component({
  /* ... */
  host: {
    'window:click': 'onWindowClick()',
    'document:click': 'onDocumentClick()',
    'body:click': 'onBodyClick()',
  },
})
export class MyView {}
```

## جلوگیری از رفتار پیش‌فرض event

اگر event handler شما باید رفتار بومی مرورگر را جایگزین کند، می‌توانید از [`preventDefault` method](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) مربوط به event object استفاده کنید:

```angular-ts
@Component({
  template: `
    <a href="#overlay" (click)="showOverlay($event)">
  `,
  ...
})
export class App{
  showOverlay(event: PointerEvent): void {
    event.preventDefault();
    console.log('Show overlay without updating the URL!');
  }
}
```

اگر event handler statement به `false` evaluate شود، Angular به‌صورت خودکار `preventDefault()` را فراخوانی می‌کند، شبیه [native event handler attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes#event_handler_attributes). _همیشه فراخوانی explicit مربوط به `preventDefault` را ترجیح دهید_، چون intent کد را واضح می‌کند.

## گسترش event handling

event system در Angular از طریق custom event pluginهایی که با injection token مربوط به `EVENT_MANAGER_PLUGINS` register می‌شوند extensible است.

### پیاده‌سازی Event Plugin

برای ساخت یک custom event plugin، کلاس `EventManagerPlugin` را extend کنید و methodهای required را پیاده‌سازی کنید.

```ts
import {Injectable} from '@angular/core';
import {EventManagerPlugin} from '@angular/platform-browser';

@Injectable()
export class DebounceEventPlugin extends EventManagerPlugin {
  constructor() {
    super(document);
  }

  // Define which events this plugin supports
  override supports(eventName: string) {
    return /debounce/.test(eventName);
  }

  // Handle the event registration
  override addEventListener(element: HTMLElement, eventName: string, handler: Function) {
    // Parse the event: e.g., "click.debounce.500"
    // event: "click", delay: 500
    const [event, method, delay = 300] = eventName.split('.');

    let timeoutId: number;

    const listener = (event: Event) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handler(event);
      }, delay);
    };

    element.addEventListener(event, listener);

    // Return cleanup function
    return () => {
      clearTimeout(timeoutId);
      element.removeEventListener(event, listener);
    };
  }
}
```

Custom plugin خود را با استفاده از token مربوط به `EVENT_MANAGER_PLUGINS` در providerهای application register کنید:

```ts
import {bootstrapApplication} from '@angular/platform-browser';
import {EVENT_MANAGER_PLUGINS} from '@angular/platform-browser';
import {App} from './app';
import {DebounceEventPlugin} from './debounce-event-plugin';

bootstrapApplication(App, {
  providers: [
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: DebounceEventPlugin,
      multi: true,
    },
  ],
});
```

بعد از register شدن، می‌توانید syntax مربوط به custom event خود را در templateها و همچنین در property مربوط به `host` استفاده کنید:

```angular-ts
@Component({
  template: `
    <input
      type="text"
      (input.debounce.500)="onSearch($event.target.value)"
      placeholder="Search..."
    />
  `,
  ...
})
export class Search {
 onSearch(query: string): void {
    console.log('Searching for:', query);
  }
}
```

```ts
@Component({
  ...,
  host: {
    '(click.debounce.500)': 'handleDebouncedClick()',
  },
})
export class AwesomeCard {
  handleDebouncedClick(): void {
   console.log('Debounced click!');
  }
}
```
