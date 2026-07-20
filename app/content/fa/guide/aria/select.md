<docs-decorative-header title="Select">
</docs-decorative-header>

## Overview

patternای که combobox را با listbox ترکیب می‌کند تا dropdownهای تک‌انتخابی همراه با keyboard navigation و screen reader support بسازد.

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

## Usage

pattern مربوط به select زمانی بهترین انتخاب است که کاربران باید یک value را از مجموعه‌ای آشنا از optionها انتخاب کنند.

استفاده از این pattern را در این موارد در نظر بگیرید:

- **Option list ثابت است** \(کمتر از 20 item\) - کاربران می‌توانند بدون filtering، scan و choose کنند.
- **Optionها آشنا هستند** - کاربران choiceها را بدون نیاز به search تشخیص می‌دهند.
- **Formها به fieldهای استاندارد نیاز دارند** - انتخاب country، state، category یا status.
- **Settingها و configuration** - dropdown menuها برای preferenceها یا optionها.
- **Option labelهای روشن** - هر choice نامی distinct و قابل scan دارد.

از این pattern پرهیز کنید وقتی:

- **list بیش از 20 item دارد** - برای filtering بهتر از [pattern مربوط به Autocomplete](guide/aria/autocomplete) استفاده کنید.
- **کاربران باید optionها را search کنند** - [Autocomplete](guide/aria/autocomplete) text input و filtering فراهم می‌کند.
- **Multiple selection لازم است** - به جای آن از [pattern مربوط به Multiselect](guide/aria/multiselect) استفاده کنید.
- **optionهای خیلی کمی وجود دارد \(2-3\)** - radio buttonها visibility بهتری از همه choiceها فراهم می‌کنند.

## قابلیت‌ها

pattern مربوط به select، directiveهای [Combobox](guide/aria/combobox) و [Listbox](guide/aria/listbox) را ترکیب می‌کند تا یک dropdown کاملاً accessible فراهم کند با:

- **Keyboard Navigation** - با arrow keyها بین optionها navigate کنید، با Enter انتخاب کنید و با Escape ببندید.
- **Screen Reader Support** - attributeهای ARIA داخلی برای assistive technologyها.
- **Custom Display** - valueهای selected را با icon، formatting یا rich content نمایش دهید.
- **Signal-Based Reactivity** - مدیریت state reactive با Angular signals.
- **Smart Positioning** - CDK Overlay، edgeهای viewport و scrolling را مدیریت می‌کند.
- **Bidirectional Text Support** - مدیریت خودکار زبان‌های راست‌به‌چپ \(RTL\).

## مثال‌ها

### Basic select

کاربران به یک dropdown استاندارد نیاز دارند تا از listای از valueها انتخاب کنند. یک combobox همراه با listbox تجربه familiar مربوط به select را با accessibility کامل فراهم می‌کند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Text input با اعمال مستقیم directive مربوط به `ngCombobox` روی یک host element غیرتعاملی، مثل `div` یا `button`، به جای `<input>` جلوگیری می‌شود. کاربران درست مثل یک native select element، با arrow keyها و Enter با dropdown تعامل می‌کنند.

### Select با display سفارشی

Optionها اغلب به indicatorهای visual مثل icon یا badge نیاز دارند تا کاربران choiceها را سریع تشخیص دهند. templateهای سفارشی داخل optionها rich formatting را ممکن می‌کنند و در عین حال accessibility را حفظ می‌کنند.

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

هر option یک icon کنار label نمایش می‌دهد. selected value update می‌شود تا icon و text مربوط به option انتخاب‌شده را نشان دهد و visual feedback روشنی فراهم کند.

### Select disabled

Selectها می‌توانند disabled شوند تا وقتی شرط‌های مشخص form برقرار نیستند، از user interaction جلوگیری شود. disabled state، visual feedback فراهم می‌کند و keyboard interaction را متوقف می‌کند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

وقتی disabled باشد، select یک visual state مربوط به disabled نمایش می‌دهد و همه user interactionها را block می‌کند. Screen readerها disabled state را برای کاربران assistive technology announce می‌کنند.

## Testing

pattern مربوط به select را می‌توان با ترکیبی از `ComboboxHarness` و `ListboxHarness` از `@angular/aria/combobox/testing` و `@angular/aria/listbox/testing` test کرد.
این نمونه نشان می‌دهد چطور از harnessها برای test کردن یک کامپوننت select استفاده کنید:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComboboxHarness} from '@angular/aria/combobox/testing';
import {ListboxHarness} from '@angular/aria/listbox/testing';
import {MySelectComponent} from './my-select'; // Your component

describe('MySelectComponent', () => {
  let fixture: ComponentFixture<MySelectComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MySelectComponent],
    });

    fixture = TestBed.createComponent(MySelectComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow selecting an option', async () => {
    // Load the combobox harness (which acts as the select trigger)
    const select = await loader.getHarness(ComboboxHarness);

    // Verify it is closed initially
    expect(await select.isOpen()).toBe(false);

    // Open the dropdown
    await select.open();
    expect(await select.isOpen()).toBe(true);

    // Get the listbox harness from the popup
    const listbox = await select.getPopupWidget(ListboxHarness);
    const options = await listbox.getOptions();
    expect(options.length).toBe(3);

    // Click the second option
    await options[1].click();

    // Verify the dropdown closed and the value updated
    expect(await select.isOpen()).toBe(false);
    expect(await (await select.host()).text()).toContain('Option 2');
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

### Positioning

pattern مربوط به select با [CDK Overlay](https://material.angular.io/cdk/overlay/overview) برای smart positioning integrate می‌شود. از `cdkConnectedOverlay` استفاده کنید تا edgeهای viewport و scrolling به صورت خودکار مدیریت شوند.
