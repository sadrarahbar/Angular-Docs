<docs-decorative-header title="Multiselect">
</docs-decorative-header>

## Overview

pattern مربوط به multiselect یک combobox trigger به صورت read-only را با یک popup از نوع listbox چندانتخابی ترکیب می‌کند تا dropdownهای multiple-selection بسیار accessible همراه با keyboard navigation و screen reader support بسازد.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Usage

pattern مربوط به multiselect زمانی بهترین انتخاب است که کاربران باید چند item مرتبط را از مجموعه‌ای آشنا از optionها انتخاب کنند.

استفاده از این pattern را در این موارد در نظر بگیرید:

- **کاربران به چند selection نیاز دارند** - tagها، categoryها، filterها یا labelهایی که چند انتخاب درباره آن‌ها صدق می‌کند.
- **Option list ثابت است** \(کمتر از 20 item\) - کاربران می‌توانند optionها را بدون search scan کنند.
- **Filtering content** - چند criteria می‌توانند هم‌زمان active باشند.
- **Assign کردن attributeها** - labelها، permissionها یا featureهایی که چند value برایشان معنا دارد.
- **انتخاب‌های مرتبط** - optionهایی که از نظر منطقی با هم کار می‌کنند، مثل انتخاب چند team member.

از این pattern پرهیز کنید وقتی:

- **فقط single selection لازم است** - برای dropdownهای تک‌انتخابی ساده‌تر، از [pattern مربوط به Select](guide/aria/select) استفاده کنید.
- **list بیش از 20 item دارد و search لازم است** - از [pattern مربوط به Autocomplete](guide/aria/autocomplete) با قابلیت multiselect استفاده کنید.
- **بیشتر یا همه optionها انتخاب خواهند شد** - checklist pattern visibility بهتری فراهم می‌کند.
- **choiceها optionهای binary مستقل هستند** - checkboxهای جداگانه choiceها را روشن‌تر communicate می‌کنند.

## قابلیت‌ها

pattern مربوط به multiselect، directiveهای [Combobox](guide/aria/combobox) و [Listbox](guide/aria/listbox) را ترکیب می‌کند تا یک dropdown کاملاً accessible فراهم کند با:

- **Keyboard Navigation** - با arrow keyها بین optionها navigate کنید، با Space toggle کنید و با Escape ببندید.
- **Screen Reader Support** - attributeهای ARIA داخلی شامل aria-multiselectable.
- **Selection Count Display** - pattern compact مثل "Item + 2 more" را برای selectionهای چندگانه نمایش می‌دهد.
- **Signal-Based Reactivity** - مدیریت state reactive با Angular signals.
- **Smart Positioning** - CDK Overlay، edgeهای viewport و scrolling را مدیریت می‌کند.
- **Persistent Selection** - optionهای selected بعد از selection با checkmark visible باقی می‌مانند.

## مثال‌ها

### Basic multiselect

کاربران باید چند item را از یک list از optionها انتخاب کنند. یک readonly combobox همراه با listbox دارای multi، functionality آشنای multiselect را با accessibility کامل فراهم می‌کند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

attribute مربوط به `multi` روی `ngListbox` انتخاب چندگانه را فعال می‌کند. Space را فشار دهید تا optionها toggle شوند و popup برای selectionهای بیشتر باز می‌ماند. display اولین item selected را به همراه شمارش selectionهای باقی‌مانده نشان می‌دهد.

### Multiselect با display سفارشی

Optionها اغلب به indicatorهای visual مثل icon یا color نیاز دارند تا کاربران choiceها را شناسایی کنند. templateهای سفارشی داخل optionها formatting غنی را ممکن می‌کنند، در حالی که display value یک summary compact نشان می‌دهد.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

هر option یک icon کنار label خودش نمایش می‌دهد. display value update می‌شود تا icon و text مربوط به اولین selection را نشان دهد و سپس تعداد selectionهای اضافی را بیاورد. optionهای selected برای visual feedback روشن، checkmark نشان می‌دهند.

### Controlled selection

Formها گاهی باید تعداد selectionها را محدود کنند یا choiceهای کاربر را validate کنند. کنترل programmatic روی selection این constraintها را ممکن می‌کند و در عین حال accessibility را حفظ می‌کند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/limited/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/limited/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/limited/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/limited/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

این مثال selectionها را به دو item محدود می‌کند. وقتی limit پر شود، optionهای unselected disabled می‌شوند تا جلوی selectionهای بیشتر گرفته شود، و display مربوط به combobox update می‌شود تا choiceها را منعکس کند.

## Testing

pattern مربوط به multiselect را می‌توان با ترکیبی از `ComboboxHarness` و `ListboxHarness` از `@angular/aria/combobox/testing` و `@angular/aria/listbox/testing` test کرد.
این نمونه نشان می‌دهد چطور از harnessها برای test کردن یک کامپوننت multiselect استفاده کنید:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComboboxHarness} from '@angular/aria/combobox/testing';
import {ListboxHarness} from '@angular/aria/listbox/testing';
import {MyMultiselectComponent} from './my-multiselect'; // Your component

describe('MyMultiselectComponent', () => {
  let fixture: ComponentFixture<MyMultiselectComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyMultiselectComponent],
    });

    fixture = TestBed.createComponent(MyMultiselectComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow selecting multiple options', async () => {
    const select = await loader.getHarness(ComboboxHarness);

    // Open the dropdown
    await select.open();

    // Get the listbox harness from the popup
    const listbox = await select.getPopupWidget(ListboxHarness);
    expect(await listbox.isMulti()).toBe(true);

    const options = await listbox.getOptions();

    // Select first and second options
    await options[0].click();
    await options[1].click();

    // Verify both options are selected
    expect(await options[0].isSelected()).toBe(true);
    expect(await options[1].isSelected()).toBe(true);

    // Close the dropdown
    await select.close();

    // Verify value is updated (e.g., comma separated list or count)
    expect(await (await select.host()).text()).toContain('Option 1, Option 2');
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
