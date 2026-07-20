<docs-decorative-header title="Menu">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" title="Menu ARIA pattern"/>
  <docs-pill href="/api/aria/menu/Menu" title="Menu API Reference"/>
</docs-pill-row>

## Overview

Menu لیستی از actionها یا optionها را به کاربران ارائه می‌کند و معمولاً در پاسخ به click روی button یا right-click ظاهر می‌شود. Menuها از keyboard navigation با arrow keyها، submenuها، checkboxها، radio buttonها و itemهای disabled پشتیبانی می‌کنند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Usage

Menuها برای ارائه listهایی از actionها یا commandهایی مناسب‌اند که کاربران می‌توانند از میان آن‌ها انتخاب کنند.

**از menu استفاده کنید وقتی:**

- application command menu می‌سازید \(File، Edit، View\).
- context menu می‌سازید \(actionهای right-click\).
- dropdown action list نمایش می‌دهید.
- toolbar dropdown پیاده‌سازی می‌کنید.
- settingها یا optionها را سازماندهی می‌کنید.

**از menu پرهیز کنید وقتی:**

- site navigation می‌سازید \(به جای آن از navigation landmarkها استفاده کنید\).
- form select می‌سازید \(از کامپوننت [Select](guide/aria/select) استفاده کنید\).
- بین content panelها switch می‌کنید \(از [Tabs](guide/aria/tabs) استفاده کنید\).
- content collapsible نمایش می‌دهید \(از [Accordion](guide/aria/accordion) استفاده کنید\).

## قابلیت‌ها

- **Keyboard navigation** - arrow keyها، Home/End و character search برای navigation کارآمد.
- **Submenuها** - پشتیبانی از menuهای nested با positioning خودکار.
- **Menu typeها** - menuهای standalone، triggered menuها و menubarها.
- **Checkboxها و radioها** - menu itemهای toggle و selection.
- **Disabled itemها** - stateهای soft یا hard disabled همراه با focus management.
- **Auto-close behavior** - close قابل configure هنگام selection.
- **RTL support** - navigation برای زبان‌های راست‌به‌چپ.

## مثال‌ها

### Menu با trigger

با pair کردن یک trigger button با menu، یک dropdown menu بسازید. trigger، menu را باز و بسته می‌کند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

وقتی کاربر itemای را select کند یا Escape را فشار دهد، menu خودکار بسته می‌شود.

### Context menu

Context menuها وقتی کاربران روی یک element right-click می‌کنند، در position مربوط به cursor ظاهر می‌شوند.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-context/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-context/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-context/app/app.html"/>
</docs-code-multifile>

menu را با استفاده از coordinateهای event مربوط به `contextmenu` position کنید.

### Standalone menu

یک standalone menu به trigger نیاز ندارد و در interface visible باقی می‌ماند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Standalone menuها برای action listهای همیشه visible یا navigation مناسب‌اند.

### Menu itemهای disabled

menu itemهای مشخص را با input مربوط به `disabled` غیرفعال کنید. focus behavior را با `softDisabled` کنترل کنید.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

وقتی `[softDisabled]="true"` باشد، itemهای disabled می‌توانند focus دریافت کنند اما activate نمی‌شوند. وقتی `[softDisabled]="false"` باشد، itemهای disabled هنگام keyboard navigation skip می‌شوند.

## Testing

Angular Aria برای testing کامپوننت‌های menu، component harness ارائه می‌کند.
این نمونه نحوه استفاده از harnessها را در یک component test نشان می‌دهد:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MenuHarness, MenuItemHarness} from '@angular/aria/menu/testing';
import {MyMenuComponent} from './my-menu'; // Your component

describe('MyMenuComponent', () => {
  let fixture: ComponentFixture<MyMenuComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyMenuComponent],
    });

    fixture = TestBed.createComponent(MyMenuComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should open menu and click item', async () => {
    // Load the menu harness by its trigger text
    const menu = await loader.getHarness(MenuHarness.with({triggerText: 'Open Menu'}));

    // Verify initial state
    expect(await menu.isOpen()).toBe(false);

    // Open the menu
    await menu.open();
    expect(await menu.isOpen()).toBe(true);

    // Get items
    const items = await menu.getItems();
    expect(items.length).toBe(3);
    expect(await items[0].getText()).toBe('Item 1');

    // Click first item
    await items[0].click();

    // Menu should close after selection (depending on your implementation)
    expect(await menu.isOpen()).toBe(false);
  });

  it('should interact with submenus', async () => {
    const menu = await loader.getHarness(MenuHarness.with({triggerText: 'Open Menu'}));
    await menu.open();

    // Get the item that triggers a submenu
    const subItem = await loader.getHarness(MenuItemHarness.with({text: 'Submenu'}));
    expect(await subItem.hasSubmenu()).toBe(true);

    // Open submenu
    await subItem.click();
    const submenu = await subItem.getSubmenu();
    expect(submenu).toBeTruthy();
    expect(await submenu!.isOpen()).toBe(true);

    // Interact with submenu items
    const subItems = await submenu!.getItems();
    expect(subItems.length).toBe(1);
  });
});
```

## API reference

برای مستندات دقیق API، referenceهای API زیر را بررسی کنید:

- [`Menu`](/api/aria/menu/Menu)
- [`MenuBar`](/api/aria/menu/MenuBar)
- [`MenuItem`](/api/aria/menu/MenuItem)
- [`MenuTrigger`](/api/aria/menu/MenuTrigger)
- [`MenuContent`](/api/aria/menu/MenuContent)
