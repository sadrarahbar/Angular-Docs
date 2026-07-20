<docs-decorative-header title="Listbox">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" title="Listbox pattern"/>
  <docs-pill href="/api?query=listbox#angular_aria_listbox" title="Listbox API Reference"/>
</docs-pill-row>

## Overview

directiveای که listای از optionها را برای انتخاب کاربران نمایش می‌دهد و از keyboard navigation، انتخاب single یا multiple و screen reader support پشتیبانی می‌کند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Usage

Listbox یک directive foundational است که توسط patternهای [Select](guide/aria/select)، [Multiselect](guide/aria/multiselect) و [Autocomplete](guide/aria/autocomplete) استفاده می‌شود. برای بیشتر نیازهای dropdown، به جای استفاده مستقیم از listbox، از همان patternهای مستندشده استفاده کنید.

استفاده مستقیم از listbox را در این موارد در نظر بگیرید:

- **ساخت کامپوننت‌های selection سفارشی** - ایجاد interfaceهای تخصصی با behavior مشخص.
- **Visible selection listها** - نمایش itemهای selectable مستقیم روی صفحه \(نه داخل dropdown\).
- **Custom integration patternها** - integration با نیازهای خاص popup یا layout.

از listbox پرهیز کنید وقتی:

- **Navigation menu لازم است** - برای actionها و commandها از directive مربوط به [Menu](guide/aria/menu) استفاده کنید.

## قابلیت‌ها

Listbox در Angular یک implementation کاملاً accessible برای list فراهم می‌کند با:

- **Keyboard Navigation** - با arrow keyها بین optionها navigate کنید و با Enter یا Space انتخاب کنید.
- **Screen Reader Support** - attributeهای ARIA داخلی شامل role="listbox".
- **Single یا Multiple Selection** - attribute مربوط به `multi` mode انتخاب را کنترل می‌کند.
- **Horizontal یا Vertical** - attribute مربوط به `orientation` برای جهت layout.
- **Type-ahead Search** - با type کردن characterها به optionهای matching بپرید.
- **Signal-Based Reactivity** - مدیریت state reactive با Angular signals.

## مثال‌ها

### Basic listbox

برنامه‌ها گاهی به listهای selectable نیاز دارند که به جای پنهان شدن در dropdown، مستقیم روی صفحه visible باشند. یک listbox standalone برای این interfaceهای list قابل مشاهده، keyboard navigation و selection فراهم می‌کند.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/app/app.html" />
</docs-code-multifile>

model signal مربوط به `value`، two-way binding به itemهای selected را فراهم می‌کند. با `selectionMode="explicit"`، کاربران Space یا Enter را فشار می‌دهند تا optionها را select کنند. برای patternهای dropdown که listbox را با combobox و overlay positioning ترکیب می‌کنند، pattern مربوط به [Select](guide/aria/select) را ببینید.

### Horizontal listbox

Listها گاهی به صورت افقی بهتر کار می‌کنند، مثل interfaceهایی شبیه toolbar یا selectionهای tab-style. attribute مربوط به `orientation` هم layout و هم جهت keyboard navigation را تغییر می‌دهد.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

با `orientation="horizontal"`، arrow keyهای چپ و راست به جای بالا و پایین بین optionها navigate می‌کنند. listbox زبان‌های راست‌به‌چپ \(RTL\) را با معکوس کردن جهت navigation به صورت خودکار مدیریت می‌کند.

### Selection modeها

Listbox دو selection mode را پشتیبانی می‌کند که کنترل می‌کنند itemها چه زمانی selected شوند.

mode مربوط به `'follow'` item دارای focus را به صورت خودکار select می‌کند و وقتی selection زیاد تغییر می‌کند interaction سریع‌تری فراهم می‌کند. mode مربوط به `'explicit'` برای confirm کردن selection به Space یا Enter نیاز دارد و هنگام navigation از تغییرات تصادفی جلوگیری می‌کند. patternهای dropdown معمولاً برای single selection از mode مربوط به `'follow'` استفاده می‌کنند.

#### Explicit

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/modes/app/explicit/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/modes/app/explicit/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/modes/app/explicit/app.html" />
</docs-code-multifile>

#### Follow

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/modes/app/follow/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/modes/app/follow/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/modes/app/follow/app.html" />
</docs-code-multifile>

| Mode         | توضیح                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| `'follow'`   | item دارای focus را به صورت خودکار selected می‌کند و وقتی selection زیاد تغییر می‌کند interaction سریع‌تری فراهم می‌کند |
| `'explicit'` | برای confirm کردن selection به Space یا Enter نیاز دارد و هنگام navigation از تغییرات تصادفی جلوگیری می‌کند           |

TIP: patternهای dropdown معمولاً برای single selection از mode مربوط به `'follow'` استفاده می‌کنند.

## Testing

Angular Aria برای testing کامپوننت‌های listbox، component harness ارائه می‌کند.
این نمونه نحوه استفاده از harnessها را در یک component test نشان می‌دهد:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ListboxHarness} from '@angular/aria/listbox/testing';
import {MyListboxComponent} from './my-listbox'; // Your component

describe('MyListboxComponent', () => {
  let fixture: ComponentFixture<MyListboxComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyListboxComponent],
    });

    fixture = TestBed.createComponent(MyListboxComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow selecting options', async () => {
    const listbox = await loader.getHarness(ListboxHarness);

    // Verify listbox properties
    expect(await listbox.isMulti()).toBe(true);

    // Get all options
    const options = await listbox.getOptions();
    expect(options.length).toBe(2);

    // Click an option
    await options[0].click();

    // Verify option is selected
    expect(await options[0].isSelected()).toBe(true);

    // Filter options by text
    const bananaOption = await listbox.getOptions({text: 'Banana'});
    expect(bananaOption.length).toBe(1);
  });
});
```

## API reference

برای مستندات دقیق API، referenceهای API زیر را بررسی کنید:

- [`Listbox`](/api/aria/listbox/Listbox)
- [`Option`](/api/aria/listbox/Option)

### Patternهای مرتبط

Listbox توسط این patternهای dropdown مستندشده استفاده می‌شود:

- [Select](guide/aria/select) - pattern مربوط به dropdown تک‌انتخابی با readonly combobox + listbox
- [Multiselect](guide/aria/multiselect) - pattern مربوط به dropdown چندانتخابی با readonly combobox + listbox همراه با `multi`
- [Autocomplete](guide/aria/autocomplete) - pattern مربوط به dropdown فیلترپذیر با combobox + listbox

برای patternهای کامل dropdown همراه با trigger، popup و overlay positioning، به جای استفاده تنها از listbox، آن راهنماهای pattern را ببینید.
