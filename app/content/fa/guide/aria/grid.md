<docs-decorative-header title="Grid">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/grid/" title="Grid ARIA pattern"/>
  <docs-pill href="/api?query=grid#angular_aria_grid" title="Grid API Reference"/>
</docs-pill-row>

## Overview

Grid به کاربران اجازه می‌دهد data یا elementهای تعاملی دوبعدی را با directional arrow keyها، Home، End و Page Up/Down navigate کنند. Gridها برای data tableها، calendarها، spreadsheetها و layout patternهایی مناسب‌اند که elementهای تعاملی مرتبط را گروه‌بندی می‌کنند.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.css"/>
</docs-code-multifile>

## Usage

Gridها برای data یا elementهای تعاملی‌ای مناسب‌اند که در row و column سازماندهی شده‌اند و کاربران به keyboard navigation در چند جهت نیاز دارند.

**از grid استفاده کنید وقتی:**

- data tableهای تعاملی با cellهای editable یا selectable می‌سازید.
- calendar یا date picker ایجاد می‌کنید.
- interfaceهایی شبیه spreadsheet پیاده‌سازی می‌کنید.
- elementهای تعاملی \(buttonها، checkboxها\) را گروه‌بندی می‌کنید تا tab stopها در صفحه کمتر شوند.
- interfaceهایی می‌سازید که به keyboard navigation دوبعدی نیاز دارند.

**از grid پرهیز کنید وقتی:**

- tableهای ساده read-only نمایش می‌دهید \(به جای آن از HTML semantic یعنی `<table>` استفاده کنید\).
- listهای تک‌ستونه نمایش می‌دهید \(به جای آن از [Listbox](guide/aria/listbox) استفاده کنید\).
- data سلسله‌مراتبی نمایش می‌دهید \(به جای آن از [Tree](guide/aria/tree) استفاده کنید\).
- formهایی بدون layout جدولی می‌سازید \(از form controlهای استاندارد استفاده کنید\).

## قابلیت‌ها

- **Two-dimensional navigation** - arrow keyها بین cellها در همه جهت‌ها حرکت می‌کنند.
- **Focus modeها** - بین strategyهای focus مربوط به roving tabindex یا activedescendant انتخاب کنید.
- **Selection support** - cell selection اختیاری با modeهای single یا multi-select.
- **Wrapping behavior** - configure کنید navigation در edgeهای grid چطور wrap شود \(continuous، loop یا nowrap\).
- **Range selection** - چند cell را با modifier keyها یا dragging انتخاب کنید.
- **Disabled stateها** - کل grid یا cellهای جداگانه را disabled کنید.
- **RTL support** - navigation خودکار برای زبان‌های راست‌به‌چپ.

## مثال‌ها

### Data table grid

برای tableهای تعاملی که کاربران باید با arrow keyها بین cellها navigate کنند، از grid استفاده کنید. این مثال یک data table پایه همراه با keyboard navigation را نشان می‌دهد.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/table/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/table/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/table/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/table/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/table/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/table/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/table/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/table/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

directive مربوط به `ngGrid` را روی table element، `ngGridRow` را روی هر row، و `ngGridCell` را روی هر cell اعمال کنید.

### Calendar grid

Calendarها use case رایجی برای gridها هستند. این مثال یک month view را نشان می‌دهد که کاربران در آن dateها را با arrow keyها navigate می‌کنند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

کاربران می‌توانند وقتی focus روی یک cell است، با فشردن Enter یا Space یک date را activate کنند.

### Layout grid

برای گروه‌بندی elementهای تعاملی و کاهش tab stopها از layout grid استفاده کنید. این مثال gridای از pill buttonها را نشان می‌دهد.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

به جای tab کردن بین تک‌تک buttonها، کاربران با arrow keyها navigate می‌کنند و فقط یک button tab focus دریافت می‌کند.

### Selection و focus modeها

selection را با `[enableSelection]="true"` فعال کنید و configure کنید focus و selection چطور با هم تعامل کنند.

```angular-html
<table
  ngGrid
  [enableSelection]="true"
  [selectionMode]="'explicit'"
  [multi]="true"
  [focusMode]="'roving'"
>
  <tr ngGridRow>
    <td ngGridCell>Cell 1</td>
    <td ngGridCell>Cell 2</td>
  </tr>
</table>
```

**Selection modeها:**

- `follow`: cell دارای focus به صورت خودکار selected می‌شود.
- `explicit`: کاربران با Space یا click cellها را select می‌کنند.

**Focus modeها:**

- `roving`: focus با استفاده از `tabindex` به cellها منتقل می‌شود \(برای gridهای ساده بهتر است\).
- `activedescendant`: focus روی grid container می‌ماند و `aria-activedescendant` cell فعال را نشان می‌دهد \(برای virtual scrolling بهتر است\).

## Testing

Angular Aria برای testing کامپوننت‌های grid، component harness ارائه می‌کند.
این نمونه نحوه استفاده از harnessها را در یک component test نشان می‌دهد:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {GridHarness} from '@angular/aria/grid/testing';
import {MyGridComponent} from './my-grid'; // Your component

describe('MyGridComponent', () => {
  let fixture: ComponentFixture<MyGridComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyGridComponent],
    });

    fixture = TestBed.createComponent(MyGridComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should read cell values and focus cells', async () => {
    const grid = await loader.getHarness(GridHarness);

    // Get all cells text in a 2D array organized by rows
    const cellTexts = await grid.getCellTextByIndex();
    expect(cellTexts).toEqual([
      ['Cell 1.1', 'Cell 1.2'],
      ['Cell 2.1', 'Cell 2.2'],
    ]);

    // Get a specific cell by text
    const cells = await grid.getCells({text: 'Cell 1.1'});
    expect(cells.length).toBe(1);
    const cell = cells[0];

    // Verify cell state
    expect(await cell.isSelected()).toBe(true);
    expect(await cell.isActive()).toBe(true);

    // Focus the cell
    await cell.focus();
    expect(await cell.isFocused()).toBe(true);
  });
});
```

## API reference

برای مستندات دقیق API، referenceهای API زیر را بررسی کنید:

- [`Grid`](/api/aria/grid/Grid)
- [`GridRow`](/api/aria/grid/GridRow)
- [`GridCell`](/api/aria/grid/GridCell)
- [`GridCellWidget`](/api/aria/grid/GridCellWidget)
