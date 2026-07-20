<docs-decorative-header title="Combobox">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" title="Combobox ARIA pattern"/>
  <docs-pill href="/api?query=combobox#angular_aria_combobox" title="Combobox API Reference"/>
</docs-pill-row>

## Overview

directiveای که یک trigger element، مثل text input، button یا `div`، را با یک popup هماهنگ می‌کند و directive primitive را برای patternهای autocomplete، select و multiselect فراهم می‌کند.

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

## Usage

Combobox همان directive primitive است که یک interactive trigger element، مثل text input، button یا `div`، را با یک popup هماهنگ می‌کند. این directive foundation مربوط به patternهای autocomplete، select و multiselect را فراهم می‌کند. استفاده مستقیم از combobox را در این موارد در نظر بگیرید:

- **ساخت patternهای autocomplete سفارشی** - ایجاد behaviorهای خاص برای filtering یا suggestion.
- **ساخت کامپوننت‌های selection سفارشی** - توسعه dropdownهایی با نیازهای خاص.
- **هماهنگ کردن input با popup** - pairing کردن text input با listbox، tree یا dialog content.
- **پیاده‌سازی filtering سفارشی** - فیلتر و orchestrate کردن optionهای matching در user space.

در این موارد از patternهای مستندشده استفاده کنید:

- autocomplete استاندارد همراه با filtering لازم است - برای مثال‌های آماده استفاده، [pattern مربوط به Autocomplete](guide/aria/autocomplete) را ببینید.
- dropdownهای تک‌انتخابی لازم هستند - برای implementation کامل dropdown، [pattern مربوط به Select](guide/aria/select) را ببینید.
- dropdownهای چندانتخابی لازم هستند - برای multi-select با نمایش compact، [pattern مربوط به Multiselect](guide/aria/multiselect) را ببینید.

NOTE: راهنماهای [Autocomplete](guide/aria/autocomplete)، [Select](guide/aria/select) و [Multiselect](guide/aria/multiselect) patternهای مستندشده‌ای را نشان می‌دهند که این directive را برای use caseهای مشخص با [Listbox](guide/aria/listbox) ترکیب می‌کنند.

## قابلیت‌ها

Combobox در Angular یک سیستم کاملاً accessible برای هماهنگی input-popup فراهم می‌کند با:

- **Trigger Element with Popup** - trigger element را با popup content هماهنگ می‌کند.
- **Flexible Coordination** - به صورت seamless با layoutهای استاندارد \(listbox، tree، grid یا dialog\) integrate می‌شود.
- **Keyboard Navigation** - مدیریت arrow keyها، Enter و Escape.
- **Screen Reader Support** - attributeهای ARIA داخلی شامل role="combobox" و aria-expanded.
- **Popup Management** - show/hide خودکار بر اساس user interaction.
- **Signal-Based Reactivity** - مدیریت state reactive با Angular signals.

## مثال‌ها

### Autocomplete

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

Filtering در user space با update کردن signalای مدیریت می‌شود که option list را به صورت reactive فیلتر می‌کند. کاربران با arrow keyها navigate می‌کنند و با Enter یا click انتخاب می‌کنند. این approach کنترل کامل و بیشترین flexibility را برای selection logic سفارشی فراهم می‌کند. برای patternها و مثال‌های کامل filtering، [راهنمای Autocomplete](guide/aria/autocomplete) را ببینید.

### Readonly mode

patternای که یک combobox به صورت readonly را با listbox ترکیب می‌کند تا dropdownهای تک‌انتخابی با keyboard navigation و پشتیبانی screen reader بسازد.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Trigger کردن یک dropdown بدون text input را می‌توان با استفاده از button به عنوان host trigger، یا با اعمال attribute native HTML یعنی `readonly` روی input trigger انجام داد. popup با click یا arrow keyها باز می‌شود.

این configuration foundation مربوط به patternهای [Select](guide/aria/select) و [Multiselect](guide/aria/multiselect) را فراهم می‌کند. برای implementationهای کامل dropdown همراه با triggerها و overlay positioning، آن راهنماها را ببینید.

### Datepicker grid

Combobox می‌تواند با یک grid دوبعدی هماهنگ شود تا datepickerهای accessible بسازد. کاربران داخل table grid تقویم با directional arrow keyها بین dateها navigate می‌کنند و selection را با click، Enter یا Spacebar تأیید می‌کنند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### Dialog popup

Dialog popupها trigger مربوط به combobox را با layoutهای استاندارد dialog و focus trapها، مثل `cdkTrapFocus` در CDK، ترکیب می‌کنند. وقتی overlay به modal behavior یا backdrop interaction نیاز دارد، از dialog popup استفاده کنید.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Testing

Angular Aria برای testing کامپوننت‌های combobox یک `ComboboxHarness` فراهم می‌کند.
این نمونه نحوه استفاده از harness را در یک component test نشان می‌دهد:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComboboxHarness} from '@angular/aria/combobox/testing';
import {MyComboboxComponent} from './my-combobox'; // Your component

describe('MyComboboxComponent', () => {
  let fixture: ComponentFixture<MyComboboxComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyComboboxComponent],
    });

    fixture = TestBed.createComponent(MyComboboxComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow opening and closing the popup', async () => {
    const combobox = await loader.getHarness(ComboboxHarness);

    // Verify initial state
    expect(await combobox.isOpen()).toBe(false);

    // Open the popup
    await combobox.open();
    expect(await combobox.isOpen()).toBe(true);

    // Close the popup
    await combobox.close();
    expect(await combobox.isOpen()).toBe(false);
  });
});
```

## API reference

برای مستندات دقیق API، referenceهای API زیر را بررسی کنید:

- [`Combobox`](/api/aria/combobox/Combobox)
- [`ComboboxPopup`](/api/aria/combobox/ComboboxPopup)
- [`ComboboxWidget`](/api/aria/combobox/ComboboxWidget)

### Patternها و directiveهای مرتبط

Combobox، directive primitive برای این patternهای مستندشده است:

- [Autocomplete](guide/aria/autocomplete) - pattern مربوط به filtering و suggestionها \(هماهنگ کردن input typing با options list\)
- [Select](guide/aria/select) - pattern مربوط به dropdown تک‌انتخابی \(اعمال مستقیم روی triggerهای button غیرقابل‌ویرایش\)
- [Multiselect](guide/aria/multiselect) - pattern مربوط به انتخاب چندگانه \(اعمال روی triggerهای غیرقابل‌ویرایش با Listbox دارای multi\)

Combobox معمولاً با این‌ها ترکیب می‌شود:

- [Listbox](guide/aria/listbox) - رایج‌ترین popup content
- [Tree](guide/aria/tree) - popup content سلسله‌مراتبی \(برای مثال‌ها راهنمای Tree را ببینید\)
