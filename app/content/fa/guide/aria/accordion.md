<docs-decorative-header title="Accordion">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/" title="Accordion ARIA pattern"/>
  <docs-pill href="/api?query=accordion#angular_aria_accordion" title="Accordion API Reference"/>
</docs-pill-row>

## Overview

Accordion محتوای مرتبط را در sectionهای قابل expand و collapse سازماندهی می‌کند، scrolling صفحه را کاهش می‌دهد و کمک می‌کند کاربران روی اطلاعات مرتبط تمرکز کنند. هر section یک trigger button و یک content panel دارد. کلیک روی trigger، visibility مربوط به panel مرتبط را toggle می‌کند.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.css"/>
</docs-code-multifile>

## Usage

Accordionها برای سازماندهی محتوا در گروه‌های منطقی مناسب‌اند، جایی که کاربران معمولاً باید هر بار یک section را ببینند.

**از accordion استفاده کنید وقتی:**

- FAQهایی با چند question و answer نمایش می‌دهید.
- formهای طولانی را به sectionهای قابل‌مدیریت تقسیم می‌کنید.
- می‌خواهید scrolling را در صفحه‌های پرمحتوا کاهش دهید.
- اطلاعات مرتبط را به صورت progressive disclosure نمایش می‌دهید.

**از accordion پرهیز کنید وقتی:**

- navigation menu می‌سازید \(به جای آن از کامپوننت [Menu](guide/aria/menu) استفاده کنید\).
- interfaceهای tabدار می‌سازید \(به جای آن از کامپوننت [Tabs](guide/aria/tabs) استفاده کنید\).
- فقط یک section collapsible نمایش می‌دهید \(به جای آن از disclosure pattern استفاده کنید\).
- کاربران باید چند section را هم‌زمان ببینند \(layout متفاوتی را در نظر بگیرید\).

## قابلیت‌ها

- **Expansion modeها** - کنترل کنید یک panel یا چند panel بتوانند هم‌زمان باز باشند.
- **Keyboard navigation** - با arrow keyها، Home و End بین triggerها navigate کنید.
- **Lazy rendering** - content فقط وقتی ساخته می‌شود که panel برای اولین بار expand شود، که performance load اولیه را بهتر می‌کند.
- **Disabled stateها** - کل group یا triggerهای جداگانه را disabled کنید.
- **Focus management** - کنترل کنید itemهای disabled بتوانند keyboard focus دریافت کنند یا نه.
- **Programmatic control** - panelها را از کد کامپوننت خود expand، collapse یا toggle کنید.
- **RTL support** - پشتیبانی خودکار از زبان‌های راست‌به‌چپ.

## مثال‌ها

### Single expansion mode

`[multiExpandable]="false"` را تنظیم کنید تا فقط یک panel بتواند در هر زمان باز باشد. باز کردن یک panel جدید، هر panel باز قبلی را خودکار می‌بندد.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

این mode برای FAQها یا وضعیت‌هایی مناسب است که می‌خواهید کاربران هر بار روی یک answer تمرکز کنند.

### Multiple expansion mode

`[multiExpandable]="true"` را تنظیم کنید تا چند panel بتوانند هم‌زمان باز باشند. کاربران می‌توانند بدون بستن بقیه، هر تعداد panel لازم را expand کنند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

این mode برای sectionهای form یا زمانی مفید است که کاربران باید content چند panel را با هم مقایسه کنند.

NOTE: input مربوط به `multiExpandable` به صورت پیش‌فرض `true` است. اگر رفتار single expansion می‌خواهید، آن را صریحاً روی `false` تنظیم کنید.

### Accordion itemهای disabled

triggerهای مشخص را با input مربوط به `disabled` غیرفعال کنید. با input مربوط به `softDisabled` روی accordion group کنترل کنید itemهای disabled هنگام keyboard navigation چطور رفتار کنند.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

وقتی `[softDisabled]="true"` باشد \(مقدار پیش‌فرض\)، itemهای disabled می‌توانند focus دریافت کنند اما activate نمی‌شوند. وقتی `[softDisabled]="false"` باشد، itemهای disabled هنگام keyboard navigation کامل skip می‌شوند.

### Lazy content rendering

از directive مربوط به `ngAccordionContent` روی یک `ng-template` استفاده کنید تا rendering محتوا را تا اولین expand شدن panel به تأخیر بیندازید. این کار performance را برای accordionهایی با content سنگین مثل imageها، chartها یا کامپوننت‌های پیچیده بهتر می‌کند.

```angular-html
<div ngAccordionGroup>
  <div>
    <button ngAccordionTrigger [panel]="panel1">Trigger Text</button>
    <div ngAccordionPanel #panel1="ngAccordionPanel">
      <ng-template ngAccordionContent>
        <!-- This content only renders when the panel first opens -->
        <img src="large-image.jpg" alt="Description" />
        <app-expensive-component />
      </ng-template>
    </div>
  </div>
</div>
```

به صورت پیش‌فرض، پس از collapse شدن panel، content در DOM باقی می‌ماند. برای حذف content از DOM هنگام بسته شدن panel، `[preserveContent]="false"` را تنظیم کنید.

## Testing

Angular Aria برای testing کامپوننت‌های accordion، component harness ارائه می‌کند.
این نمونه نحوه استفاده از harnessها را در یک component test نشان می‌دهد:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {AccordionGroupHarness} from '@angular/aria/accordion/testing';
import {MyAccordionComponent} from './my-accordion'; // Your component

describe('MyAccordionComponent', () => {
  let fixture: ComponentFixture<MyAccordionComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyAccordionComponent],
    });

    fixture = TestBed.createComponent(MyAccordionComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow expanding panels', async () => {
    // Load the accordion group harness
    const group = await loader.getHarness(AccordionGroupHarness);

    // Get all individual accordions (items) in the group
    const accordions = await group.getAccordions();
    expect(accordions.length).toBe(3);

    // Verify initial state (first expanded, others collapsed)
    expect(await accordions[0].isExpanded()).toBe(true);
    expect(await accordions[1].isExpanded()).toBe(false);

    // Expand the second panel
    await accordions[1].expand();

    // Verify updated state
    expect(await accordions[1].isExpanded()).toBe(true);
    // If multiExpandable is false, the first one should now be collapsed
    expect(await accordions[0].isExpanded()).toBe(false);
  });
});
```

## API reference

برای مستندات دقیق API، referenceهای API زیر را بررسی کنید:

- [`AccordionGroup`](/api/aria/accordion/AccordionGroup)
- [`AccordionTrigger`](/api/aria/accordion/AccordionTrigger)
- [`AccordionPanel`](/api/aria/accordion/AccordionPanel)
- [`AccordionContent`](/api/aria/accordion/AccordionContent)
