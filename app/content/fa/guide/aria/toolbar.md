<docs-decorative-header title="Toolbar">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/" title="Toolbar ARIA pattern"/>
  <docs-pill href="/api/aria/toolbar/Toolbar" title="Toolbar API Reference"/>
</docs-pill-row>

## Overview

Containerای برای گروه‌بندی controlها و actionهای مرتبط همراه با keyboard navigation، که معمولاً برای text formatting، toolbarها و command panelها استفاده می‌شود.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Usage

Toolbar برای گروه‌بندی controlهای مرتبطی مناسب است که کاربران زیاد به آن‌ها دسترسی دارند. استفاده از toolbar را در این موارد در نظر بگیرید:

- **چند action مرتبط** - چند control دارید که functionهای مرتبط انجام می‌دهند، مثل buttonهای text formatting.
- **Keyboard efficiency مهم است** - کاربران از keyboard navigation سریع با arrow keyها سود می‌برند.
- **Grouped controls** - باید controlها را با separator در sectionهای منطقی سازماندهی کنید.
- **دسترسی پرتکرار** - controlها در یک workflow بارها استفاده می‌شوند.

از toolbar پرهیز کنید وقتی:

- یک button group ساده کافی است - برای فقط 2-3 action نامرتبط، buttonهای جداگانه بهتر کار می‌کنند.
- controlها مرتبط نیستند - toolbar به یک گروه‌بندی منطقی اشاره می‌کند؛ controlهای نامرتبط کاربران را گیج می‌کنند.
- navigation پیچیده nested دارید - hierarchyهای عمیق با menuها یا navigation componentها بهتر پشتیبانی می‌شوند.

## قابلیت‌ها

Toolbar در Angular یک implementation کامل و accessible برای toolbar فراهم می‌کند با:

- **Keyboard Navigation** - با arrow keyها بین widgetها navigate کنید و با Enter یا Space activate کنید.
- **Screen Reader Support** - attributeهای ARIA داخلی برای assistive technologyها.
- **Widget Groups** - widgetهای مرتبط مثل radio button groupها یا toggle button groupها را سازماندهی کنید.
- **Flexible Orientation** - layoutهای افقی یا عمودی با keyboard navigation خودکار.
- **Signal-Based Reactivity** - مدیریت state reactive با Angular signals.
- **Bidirectional Text Support** - مدیریت خودکار زبان‌های راست‌به‌چپ \(RTL\).
- **Configurable Focus** - بین wrapping navigation یا hard stop در edgeها انتخاب کنید.

## مثال‌ها

### Basic horizontal toolbar

Toolbarهای افقی controlها را از چپ به راست سازماندهی می‌کنند و با pattern رایج در text editorها و design toolها match هستند. arrow keyها بین widgetها navigate می‌کنند و focus را داخل toolbar نگه می‌دارند تا زمانی که کاربران Tab را فشار دهند و به element بعدی صفحه بروند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### Vertical toolbar

Toolbarهای عمودی controlها را از بالا به پایین stack می‌کنند و برای side panelها یا command paletteهای عمودی مفیدند. arrow keyهای بالا و پایین بین widgetها navigate می‌کنند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/vertical/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/vertical/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/vertical/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/vertical/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/vertical/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/vertical/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/vertical/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/vertical/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### Widget groupها

Widget groupها controlهای مرتبطی را در بر می‌گیرند که با هم کار می‌کنند، مثل optionهای text alignment یا choiceهای list formatting. Groupها state داخلی خودشان را نگه می‌دارند و در toolbar navigation هم شرکت می‌کنند.

در مثال‌های بالا، buttonهای alignment داخل `ngToolbarWidgetGroup` با `role="radiogroup"` wrap شده‌اند تا یک mutually exclusive selection group ایجاد شود.

input مربوط به `multi` کنترل می‌کند که چند widget داخل یک group بتوانند هم‌زمان selected شوند یا نه:

```html {highlight: [15]}
<!-- Single selection (radio group) -->
<div ngToolbarWidgetGroup role="radiogroup" aria-label="Alignment">
  <button ngToolbarWidget value="left">Left</button>
  <button ngToolbarWidget value="center">Center</button>
  <button ngToolbarWidget value="right">Right</button>
</div>

<!-- Multiple selection (toggle group) -->
<div ngToolbarWidgetGroup [multi]="true" aria-label="Formatting">
  <button ngToolbarWidget value="bold">Bold</button>
  <button ngToolbarWidget value="italic">Italic</button>
  <button ngToolbarWidget value="underline">Underline</button>
</div>
```

### Widgetهای disabled

Toolbarها دو mode مربوط به disabled را پشتیبانی می‌کنند:

1. **Soft-disabled** widgetها focusable می‌مانند اما از نظر visual نشان می‌دهند که unavailable هستند.
2. **Hard-disabled** widgetها کامل از keyboard navigation حذف می‌شوند.

به صورت پیش‌فرض، `softDisabled` برابر `true` است و اجازه می‌دهد widgetهای disabled همچنان focus دریافت کنند. اگر می‌خواهید hard-disabled mode را فعال کنید، `[softDisabled]="false"` را روی toolbar تنظیم کنید.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### پشتیبانی از راست‌به‌چپ \(RTL\)

Toolbarها به صورت خودکار از زبان‌های راست‌به‌چپ پشتیبانی می‌کنند. toolbar را داخل containerای با `dir="rtl"` wrap کنید تا layout و جهت keyboard navigation معکوس شود. navigation با arrow keyها خودکار تنظیم می‌شود: arrow چپ به widget بعدی می‌رود و arrow راست به قبلی.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/rtl/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/rtl/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/rtl/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/rtl/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/rtl/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/rtl/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/rtl/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/rtl/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Testing

Angular Aria برای testing کامپوننت‌های toolbar، component harness ارائه می‌کند.
این نمونه نحوه استفاده از harnessها را در یک component test نشان می‌دهد:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ToolbarHarness} from '@angular/aria/toolbar/testing';
import {MyToolbarComponent} from './my-toolbar'; // Your component

describe('MyToolbarComponent', () => {
  let fixture: ComponentFixture<MyToolbarComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyToolbarComponent],
    });

    fixture = TestBed.createComponent(MyToolbarComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should have widgets and allow selection', async () => {
    // Load the toolbar harness
    const toolbar = await loader.getHarness(ToolbarHarness);

    // Get all widgets
    const widgets = await toolbar.getWidgets();
    expect(widgets.length).toBe(3);

    // Click the first widget
    await widgets[0].click();

    // Verify selection state
    expect(await widgets[0].isSelected()).toBe(true);
  });
});
```

## API reference

برای مستندات دقیق API، referenceهای API زیر را بررسی کنید:

- [`Toolbar`](/api/aria/toolbar/Toolbar)
- [`ToolbarWidget`](/api/aria/toolbar/ToolbarWidget)
- [`ToolbarWidgetGroup`](/api/aria/toolbar/ToolbarWidgetGroup)
