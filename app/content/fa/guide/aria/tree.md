<docs-decorative-header title="Tree">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/treeview/" title="Tree ARIA pattern"/>
  <docs-pill href="/api/aria/tree/Tree" title="Tree API Reference"/>
</docs-pill-row>

## Overview

Tree داده‌های سلسله‌مراتبی را نمایش می‌دهد؛ جایی که itemها می‌توانند expand شوند تا childها را نشان دهند یا collapse شوند تا آن‌ها را پنهان کنند. کاربران با arrow keyها navigate می‌کنند، nodeها را expand و collapse می‌کنند، و در صورت نیاز برای سناریوهای navigation یا data selection، itemها را select می‌کنند.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.css"/>
</docs-code-multifile>

## Usage

Treeها برای نمایش داده‌های سلسله‌مراتبی مناسب‌اند، جایی که کاربران باید در ساختارهای nested navigate کنند.

**از tree استفاده کنید وقتی:**

- file system navigation می‌سازید.
- hierarchyهای folder و document را نمایش می‌دهید.
- ساختارهای nested menu ایجاد می‌کنید.
- organization chart نمایش می‌دهید.
- data سلسله‌مراتبی را browse می‌کنید.
- site navigation با sectionهای nested پیاده‌سازی می‌کنید.

**از tree پرهیز کنید وقتی:**

- listهای flat نمایش می‌دهید \(به جای آن از [Listbox](guide/aria/listbox) استفاده کنید\).
- data table نمایش می‌دهید \(به جای آن از [Grid](guide/aria/grid) استفاده کنید\).
- dropdownهای ساده می‌سازید \(به جای آن از [Select](guide/aria/select) استفاده کنید\).
- breadcrumb navigation می‌سازید \(از breadcrumb patternها استفاده کنید\).

## قابلیت‌ها

- **Hierarchical navigation** - ساختار tree nested با قابلیت expand و collapse.
- **Selection modeها** - single یا multi-selection با behavior مربوط به explicit یا follow-focus.
- **Selection follows focus** - selection خودکار اختیاری هنگام تغییر focus.
- **Keyboard navigation** - arrow keyها، Home، End و type-ahead search.
- **Expand/collapse** - arrowهای راست/چپ یا Enter برای toggle کردن parent nodeها.
- **Disabled items** - nodeهای مشخص را با focus management disabled کنید.
- **Focus modeها** - strategyهای focus مربوط به roving tabindex یا activedescendant.
- **RTL support** - navigation برای زبان‌های راست‌به‌چپ.

## مثال‌ها

### Navigation tree

برای navigationای که کلیک روی itemها به جای select کردن آن‌ها action trigger می‌کند، از tree استفاده کنید.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

برای فعال کردن navigation mode، `[nav]="true"` را تنظیم کنید. این mode به جای selection، از `aria-current` برای نشان دادن page فعلی استفاده می‌کند.

### Single selection

برای سناریوهایی که کاربران یک item را از tree انتخاب می‌کنند، single selection را فعال کنید.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

برای single selection، `[multi]="false"` را به حالت پیش‌فرض رها کنید. کاربران Space را فشار می‌دهند تا item دارای focus را select کنند.

### Multi-selection

اجازه دهید کاربران چند item را از tree انتخاب کنند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`[multi]="true"` را روی tree تنظیم کنید. کاربران itemها را جداگانه با Space انتخاب می‌کنند یا rangeها را با Shift+Arrow keyها select می‌کنند.

### Selection follows focus

وقتی selection از focus پیروی کند، item دارای focus به صورت خودکار selected می‌شود. این behavior interaction را برای سناریوهای navigation ساده‌تر می‌کند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`[selectionMode]="'follow'"` را روی tree تنظیم کنید. با navigate کردن کاربران با arrow keyها، selection خودکار update می‌شود.

### Tree itemهای disabled

tree nodeهای مشخص را disabled کنید تا از interaction جلوگیری شود. کنترل کنید itemهای disabled بتوانند focus دریافت کنند یا نه.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

وقتی `[softDisabled]="true"` روی tree باشد، itemهای disabled می‌توانند focus دریافت کنند اما activate یا select نمی‌شوند. وقتی `[softDisabled]="false"` باشد، itemهای disabled هنگام keyboard navigation skip می‌شوند.

## Testing

Angular Aria برای testing کامپوننت‌های tree، component harness ارائه می‌کند.
این نمونه نحوه استفاده از harnessها را در یک component test نشان می‌دهد:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {TreeHarness} from '@angular/aria/tree/testing';
import {MyTreeComponent} from './my-tree'; // Your component

describe('MyTreeComponent', () => {
  let fixture: ComponentFixture<MyTreeComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyTreeComponent],
    });

    fixture = TestBed.createComponent(MyTreeComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should navigate and expand tree items', async () => {
    const tree = await loader.getHarness(TreeHarness);

    // Get top-level structure representation
    expect(await tree.getTreeStructure()).toEqual({
      children: [{text: 'public'}, {text: 'src'}, {text: 'package.json'}],
    });

    // Get all items (currently visible)
    const items = await tree.getItems();
    expect(items.length).toBe(3);

    // Expand the first item ('public')
    expect(await items[0].isExpanded()).toBe(false);
    await items[0].click();
    expect(await items[0].isExpanded()).toBe(true);

    // Verifying tree structure updates after expansion
    expect(await tree.getTreeStructure()).toEqual({
      children: [
        {
          text: 'public',
          children: [{text: 'index.html'}, {text: 'styles.css'}],
        },
        {text: 'src'},
        {text: 'package.json'},
      ],
    });
  });
});
```

## API reference

برای مستندات دقیق API، referenceهای API زیر را بررسی کنید:

- [`Tree`](/api/aria/tree/Tree)
- [`TreeItem`](/api/aria/tree/TreeItem)
- [`TreeItemGroup`](/api/aria/tree/TreeItemGroup)
