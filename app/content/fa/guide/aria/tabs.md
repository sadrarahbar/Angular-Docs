<docs-decorative-header title="Tabs">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/" title="Tabs ARIA pattern"/>
  <docs-pill href="/api/aria/tabs/Tabs" title="Tabs API Reference"/>
</docs-pill-row>

## Overview

Tabها sectionهای layered content را نمایش می‌دهند که هر بار فقط یک panel visible است. کاربران با کلیک روی tab buttonها یا با استفاده از arrow keyها برای navigate کردن tab list، بین panelها switch می‌کنند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Usage

Tabها برای سازماندهی محتوای مرتبط در sectionهای متمایز مناسب‌اند، جایی که کاربران بین viewها یا categoryهای مختلف switch می‌کنند.

**از tab استفاده کنید وقتی:**

- محتوای مرتبط را در sectionهای متمایز سازماندهی می‌کنید.
- settings panelهایی با چند category می‌سازید.
- documentationای با چند topic می‌سازید.
- dashboardهایی با viewهای مختلف پیاده‌سازی می‌کنید.
- contentای نمایش می‌دهید که کاربران باید بین contextها switch کنند.

**از tab پرهیز کنید وقتی:**

- formهای sequential یا wizard می‌سازید \(از stepper pattern استفاده کنید\).
- بین pageها navigate می‌کنید \(از router navigation استفاده کنید\).
- فقط یک content section نمایش می‌دهید \(نیازی به tab نیست\).
- بیش از 7-8 tab دارید \(layout متفاوتی را در نظر بگیرید\).

## قابلیت‌ها

- **Selection modeها** - tabها با focus به صورت خودکار activate شوند یا activation دستی لازم داشته باشند.
- **Keyboard navigation** - arrow keyها، Home و End برای navigation کارآمد بین tabها.
- **Orientation** - layoutهای tab list افقی یا عمودی.
- **Lazy content** - tab panelها فقط وقتی برای اولین بار activate شوند render می‌شوند.
- **Disabled tabs** - tabهای جداگانه را با focus management غیرفعال کنید.
- **Focus modeها** - strategyهای focus مربوط به roving tabindex یا activedescendant.
- **RTL support** - navigation برای زبان‌های راست‌به‌چپ.

## مثال‌ها

### Selection follows focus

وقتی selection از focus پیروی کند، tabها به محض navigate کردن با arrow keyها activate می‌شوند. این behavior feedback فوری فراهم می‌کند و برای content سبک مناسب است.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

برای فعال کردن این behavior، `[selectionMode]="'follow'"` را روی tab list تنظیم کنید.

### Manual activation

در manual activation، arrow keyها focus را بین tabها جابه‌جا می‌کنند بدون اینکه tab selected تغییر کند. کاربران Space یا Enter را فشار می‌دهند تا tab دارای focus را activate کنند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/explicit-selection/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/explicit-selection/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/explicit-selection/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/explicit-selection/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/explicit-selection/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/explicit-selection/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/explicit-selection/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/explicit-selection/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/explicit-selection/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/explicit-selection/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/explicit-selection/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/explicit-selection/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

برای content panelهای سنگین از `[selectionMode]="'explicit'"` استفاده کنید تا از rendering غیرضروری جلوگیری شود.

### Vertical tabs

برای interfaceهایی مثل settings panel یا navigation sidebar، tabها را عمودی بچینید.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/vertical/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/vertical/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/vertical/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/vertical/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/vertical/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/vertical/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/vertical/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/vertical/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/vertical/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/vertical/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/vertical/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/vertical/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`[orientation]="'vertical'"` را روی tab list تنظیم کنید. navigation به arrow keyهای بالا/پایین تغییر می‌کند.

### Lazy content rendering

از directive مربوط به `ngTabContent` روی یک `ng-template` استفاده کنید تا rendering مربوط به tab panelها تا اولین نمایششان به تأخیر بیفتد.

```angular-html
<div ngTabs>
  <ul ngTabList [(selectedTab)]="selectedTab">
    <li ngTab value="tab1">Tab 1</li>
    <li ngTab value="tab2">Tab 2</li>
  </ul>

  <div ngTabPanel value="tab1">
    <ng-template ngTabContent>
      <!-- This content only renders when Tab 1 is first shown -->
      <app-heavy-component />
    </ng-template>
  </div>

  <div ngTabPanel value="tab2">
    <ng-template ngTabContent>
      <!-- This content only renders when Tab 2 is first shown -->
      <app-another-component />
    </ng-template>
  </div>
</div>
```

به صورت پیش‌فرض، پس از hidden شدن panel، content در DOM باقی می‌ماند. برای حذف content هنگام deactivate شدن panel، `[preserveContent]="false"` را تنظیم کنید.

### Disabled tabs

tabهای مشخص را disabled کنید تا از user interaction جلوگیری شود. کنترل کنید tabهای disabled بتوانند keyboard focus دریافت کنند یا نه.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

وقتی `[softDisabled]="true"` روی tab list باشد، tabهای disabled می‌توانند focus دریافت کنند اما activate نمی‌شوند. وقتی `[softDisabled]="false"` باشد، tabهای disabled هنگام keyboard navigation skip می‌شوند.

## Testing

Angular Aria برای testing کامپوننت‌های tabs، component harness ارائه می‌کند.
این نمونه نحوه استفاده از harnessها را در یک component test نشان می‌دهد:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentHarness, HarnessLoader} from '@angular/cdk/testing';
import {TabsHarness} from '@angular/aria/tabs/testing';
import {MyTabsComponent} from './my-tabs'; // Your component

// A simple harness to help query content inside the tab panel
class TestContentHarness extends ComponentHarness {
  static hostSelector = '.test-content';
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}

describe('MyTabsComponent', () => {
  let fixture: ComponentFixture<MyTabsComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyTabsComponent],
    });

    fixture = TestBed.createComponent(MyTabsComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should switch tabs and scope panel queries', async () => {
    const tabs = await loader.getHarness(TabsHarness);

    // Get all tabs
    const tabItems = await tabs.getTabs();
    expect(tabItems.length).toBe(3);

    // Verify initial selection
    expect(await tabItems[0].isSelected()).toBe(true);
    expect(await tabItems[1].isSelected()).toBe(false);

    // Query content inside the active tab panel
    // TabHarness automatically scopes queries to its associated panel
    const content = await tabItems[0].getHarness(TestContentHarness);
    expect(await content.getText()).toBe('Content 1');

    // Switch to the second tab
    await tabItems[1].select();

    // Verify selection updated
    expect(await tabItems[0].isSelected()).toBe(false);
    expect(await tabItems[1].isSelected()).toBe(true);
  });
});
```

## API reference

برای مستندات دقیق API، referenceهای API زیر را بررسی کنید:

- [`Tabs`](/api/aria/tabs/Tabs)
- [`TabList`](/api/aria/tabs/TabList)
- [`Tab`](/api/aria/tabs/Tab)
- [`TabPanel`](/api/aria/tabs/TabPanel)
- [`TabContent`](/api/aria/tabs/TabContent)
