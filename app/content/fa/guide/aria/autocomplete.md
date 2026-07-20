<docs-decorative-header title="Autocomplete">
</docs-decorative-header>

## Overview

یک input field قابل‌دسترس که هنگام typing کاربر optionها را فیلتر و suggest می‌کند و به او کمک می‌کند valueها را از یک list پیدا و انتخاب کند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Usage

Autocomplete زمانی بهترین انتخاب است که کاربران باید از میان مجموعه بزرگی از optionها انتخاب کنند و typing سریع‌تر از scrolling است. در این موارد استفاده از autocomplete را در نظر بگیرید:

- **Option list طولانی است** \(بیش از 20 item\) - typing انتخاب‌ها را سریع‌تر از scrolling در dropdown محدود می‌کند.
- **کاربران می‌دانند دنبال چه هستند** - می‌توانند بخشی از value مورد انتظار را type کنند، مثل نام state، product یا username.
- **Optionها patternهای قابل‌پیش‌بینی دارند** - کاربران می‌توانند matchهای جزئی را حدس بزنند، مثل country codeها، email domainها یا categoryها.
- **سرعت مهم است** - formها از انتخاب سریع بدون navigation زیاد سود می‌برند.

از autocomplete پرهیز کنید وقتی:

- list کمتر از 10 option دارد - یک dropdown معمولی یا radio group visibility بهتری فراهم می‌کند.
- کاربران باید optionها را browse کنند - اگر discovery مهم است، همه optionها را از ابتدا نشان دهید.
- optionها ناآشنا هستند - کاربران نمی‌توانند چیزی را type کنند که نمی‌دانند در list وجود دارد.

## قابلیت‌ها

Autocomplete در Angular یک implementation کامل و accessible از combobox فراهم می‌کند با:

- **Keyboard Navigation** - با arrow keyها بین optionها navigate کنید، با Enter انتخاب کنید و با Escape ببندید.
- **Screen Reader Support** - attributeهای ARIA داخلی برای assistive technologyها.
- **Dynamic Highlight Behavior** - پشتیبانی داخلی از suggestionهای inline selection.
- **Signal-Based Reactivity** - مدیریت state reactive با Angular signals.
- **Popover API Integration** - استفاده از HTML Popover API native برای positioning بهتر.
- **Bidirectional Text Support** - مدیریت خودکار زبان‌های راست‌به‌چپ \(RTL\).

## مثال‌ها

### Auto-select mode

کاربرانی که متن جزئی type می‌کنند انتظار دارند سریع تأیید بگیرند که inputشان با یک option موجود match می‌شود. Auto-select mode هنگام typing کاربر، مقدار input را با اولین option فیلترشده match می‌کند، تعداد keystrokeهای لازم را کاهش می‌دهد و feedback فوری می‌دهد که search آن‌ها در مسیر درست است.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### Manual selection mode

Manual selection mode هنگام navigate کردن کاربران در suggestion list، متن typed‌شده را بدون تغییر نگه می‌دارد و از گیج شدن کاربر به خاطر updateهای خودکار جلوگیری می‌کند. input فقط زمانی تغییر می‌کند که کاربر انتخاب خود را صریحاً با Enter یا click تأیید کند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/manual/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/manual/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/manual/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/manual/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### Highlight mode

Highlight mode به کاربر اجازه می‌دهد با arrow keyها بین optionها navigate کند، بدون اینکه هنگام browse کردن مقدار input تغییر کند؛ تا زمانی که صریحاً با Enter یا click یک option جدید انتخاب کند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/highlight/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/highlight/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/highlight/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/highlight/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/highlight/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/highlight/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/highlight/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/highlight/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/highlight/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/highlight/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/highlight/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/highlight/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### Integration با Signal Forms

Angular Aria به صورت seamless با API مبتنی بر signal یعنی [Signal Forms](guide/forms/signals/overview) integrate می‌شود. می‌توانید inputهای پیچیده را داخل کامپوننت‌های custom control قابل‌استفاده مجدد encapsulate کنید که `FormValueControl` را پیاده‌سازی می‌کنند.

مثال زیر یک کامپوننت country selector را نشان می‌دهد که `FormValueControl<string>` را پیاده‌سازی می‌کند، با `[formField]` به form والد bind شده و با ruleهای schema validation محافظت می‌شود.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/app.html"/>
  <docs-code header="country-selector.ts" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/country-selector.ts"/>
  <docs-code header="country-selector.html" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/country-selector.html"/>
  <docs-code header="country-selector.css" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/country-selector.css"/>
  <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/app.css"/>
</docs-code-multifile>

## Testing

pattern مربوط به autocomplete را می‌توان با ترکیبی از `ComboboxHarness` و `ListboxHarness` از `@angular/aria/combobox/testing` و `@angular/aria/listbox/testing` test کرد.
این نمونه نشان می‌دهد چطور از harnessها برای test کردن یک کامپوننت autocomplete استفاده کنید:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComboboxHarness} from '@angular/aria/combobox/testing';
import {ListboxHarness} from '@angular/aria/listbox/testing';
import {MyAutocompleteComponent} from './my-autocomplete'; // Your component

describe('MyAutocompleteComponent', () => {
  let fixture: ComponentFixture<MyAutocompleteComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyAutocompleteComponent],
    });

    fixture = TestBed.createComponent(MyAutocompleteComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should filter options based on input', async () => {
    const combobox = await loader.getHarness(ComboboxHarness);

    // Type in the input to trigger filtering
    await combobox.setValue('ap');
    expect(await combobox.isOpen()).toBe(true);

    // Get the listbox harness from the popup
    const listbox = await combobox.getPopupWidget(ListboxHarness);
    const options = await listbox.getOptions();

    // Verify options are filtered (e.g., 'Apple', 'Apricot')
    expect(options.length).toBe(2);
    expect(await options[0].getText()).toBe('Apple');

    // Select the first option
    await options[0].click();

    // Verify the input value is updated and popup is closed
    expect(await combobox.isOpen()).toBe(false);
    expect(await combobox.getValue()).toBe('Apple');
  });
});
```

## API reference

برای مستندات دقیق API، referenceهای API زیر را بررسی کنید:

- [`Combobox`](/api/aria/combobox/Combobox)
- [`ComboboxPopup`](/api/aria/combobox/ComboboxPopup)
- [`ComboboxWidget`](/api/aria/combobox/ComboboxWidget)
- [`Listbox`](/api/aria/listbox/Listbox)
- [`Option`](/api/aria/listbox/Option)
