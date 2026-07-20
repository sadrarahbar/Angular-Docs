<docs-decorative-header title="Menubar">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" title="Menubar ARIA pattern"/>
  <docs-pill href="/api/aria/menu/MenuBar" title="Menubar API Reference"/>
</docs-pill-row>

## Overview

Menubar یک navigation bar افقی است که دسترسی persistent به menuهای برنامه را فراهم می‌کند. Menubarها commandها را در categoryهای منطقی مثل File، Edit و View سازماندهی می‌کنند و به کاربران کمک می‌کنند featureهای برنامه را با keyboard یا mouse interaction پیدا و اجرا کنند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Usage

Menubarها برای سازماندهی commandهای برنامه در navigationای persistent و قابل discover مناسب‌اند.

**از menubar استفاده کنید وقتی:**

- application command bar می‌سازید \(مثل File، Edit، View، Insert، Format\).
- navigation persistent می‌سازید که در سراسر interface visible می‌ماند.
- commandها را در categoryهای top-level منطقی سازماندهی می‌کنید.
- به horizontal menu navigation همراه با keyboard support نیاز دارید.
- interfaceهایی به سبک برنامه‌های desktop می‌سازید.

**از menubar پرهیز کنید وقتی:**

- برای actionهای جداگانه dropdown menu می‌سازید \(به جای آن از [Menu with trigger](guide/aria/menu) استفاده کنید\).
- context menu می‌سازید \(از pattern موجود در راهنمای [Menu](guide/aria/menu) استفاده کنید\).
- action listهای ساده standalone دارید \(به جای آن از [Menu](guide/aria/menu) استفاده کنید\).
- interfaceهای mobile دارید که فضای افقی محدود است.
- navigation باید در sidebar یا header navigation pattern قرار بگیرد.

## قابلیت‌ها

- **Horizontal navigation** - arrow keyهای چپ/راست بین categoryهای top-level حرکت می‌کنند.
- **Persistent visibility** - همیشه visible است و modal یا dismissable نیست.
- **Hover-to-open** - پس از اولین interaction با keyboard یا click، submenuها روی hover باز می‌شوند.
- **Nested submenuها** - پشتیبانی از چند level عمق menu.
- **Keyboard navigation** - arrow keyها، Enter/Space، Escape و typeahead search.
- **Disabled stateها** - کل menubar یا itemهای جداگانه را disabled کنید.
- **RTL support** - navigation خودکار برای زبان‌های راست‌به‌چپ.

## مثال‌ها

### Basic menubar

Menubar دسترسی persistent به commandهای برنامه را فراهم می‌کند که در categoryهای top-level سازماندهی شده‌اند. کاربران با arrowهای چپ/راست بین categoryها navigate می‌کنند و با Enter یا arrow پایین menuها را باز می‌کنند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

arrow راست را فشار دهید تا بین File، Edit و View حرکت کنید. Enter یا arrow پایین را فشار دهید تا menu باز شود و با arrowهای بالا/پایین بین submenu itemها navigate کنید.

### Menubar itemهای disabled

menu itemهای مشخص یا کل menubar را disabled کنید تا از interaction جلوگیری شود. با input مربوط به `softDisabled` کنترل کنید itemهای disabled بتوانند keyboard focus دریافت کنند یا نه.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

وقتی `[softDisabled]="true"` روی menubar باشد، itemهای disabled می‌توانند focus دریافت کنند اما activate نمی‌شوند. وقتی `[softDisabled]="false"` باشد، itemهای disabled هنگام keyboard navigation skip می‌شوند.

### RTL support

Menubarها به صورت خودکار با زبان‌های راست‌به‌چپ \(RTL\) سازگار می‌شوند. navigation با arrow keyها جهت را معکوس می‌کند و submenuها در سمت چپ position می‌شوند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/rtl/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/rtl/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/rtl/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/rtl/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

attribute مربوط به `dir="rtl"`، RTL mode را فعال می‌کند. arrow چپ به راست حرکت می‌کند و arrow راست به چپ، تا navigation طبیعی برای کاربران زبان‌های RTL حفظ شود.

## Testing

Angular Aria برای testing کامپوننت‌های menubar، component harness ارائه می‌کند.
این نمونه نحوه استفاده از harnessها را در یک component test نشان می‌دهد:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MenuHarness} from '@angular/aria/menu/testing';
import {MyMenubarComponent} from './my-menubar'; // Your component

describe('MyMenubarComponent', () => {
  let fixture: ComponentFixture<MyMenubarComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyMenubarComponent],
    });

    fixture = TestBed.createComponent(MyMenubarComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should interact with menubar items', async () => {
    // Load the menubar harness (which is a MenuHarness with selector '[ngMenuBar]')
    const menubar = await loader.getHarness(MenuHarness.with({selector: '[ngMenuBar]'}));

    // Menubars are persistent and always "open"
    expect(await menubar.isOpen()).toBe(true);
    expect(await menubar.isMenuBar()).toBe(true);

    // Get top-level items
    const items = await menubar.getItems();
    expect(items.length).toBe(2);
    expect(await items[0].getText()).toBe('File');
    expect(await items[1].getText()).toBe('Edit');

    // Click an item to open its dropdown menu
    await items[0].click();

    const fileMenu = await items[0].getSubmenu();
    expect(fileMenu).toBeTruthy();
    expect(await fileMenu!.isOpen()).toBe(true);
  });
});
```

## API reference

برای مستندات دقیق API، referenceهای API زیر را بررسی کنید:

- [`MenuBar`](/api/aria/menu/MenuBar)
- [`MenuItem`](/api/aria/menu/MenuItem)
- [`MenuTrigger`](/api/aria/menu/MenuTrigger)
- [`Menu`](/api/aria/menu/Menu)
