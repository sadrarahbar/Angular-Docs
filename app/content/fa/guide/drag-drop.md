# Drag and drop

## Overview

این صفحه directiveهای drag and drop را توضیح می‌دهد که به شما اجازه می‌دهند interfaceهای drag and drop را سریع با موارد زیر بسازید:

- Free dragging
- ساخت listای از elementهای draggable قابل reorder
- انتقال elementهای draggable بین listها
- Dragging animationها
- قفل کردن elementهای draggable روی یک axis یا element
- افزودن drag handleهای سفارشی
- افزودن preview هنگام drag
- افزودن drag placeholder سفارشی

برای reference کامل API، [صفحه drag and drop API reference در Angular CDK](api#angular_cdk_drag-drop) را ببینید.

## پیش از شروع

### نصب CDK

[Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories) مجموعه‌ای از primitiveهای رفتاری برای ساخت کامپوننت‌هاست. برای استفاده از directiveهای drag and drop، ابتدا `@angular/cdk` را از npm نصب کنید. می‌توانید این کار را از terminal با Angular CLI انجام دهید:

```shell
ng add @angular/cdk
```

### Import کردن drag and drop

برای استفاده از drag and drop، چیزهایی را که نیاز دارید از directiveها در کامپوننت خود import کنید.

```ts
import {Component} from '@angular/core';
import {CdkDrag} from '@angular/cdk/drag-drop';

@Component({
  selector: 'drag-drop-example',
  templateUrl: 'drag-drop-example.html',
  imports: [CdkDrag],
})
export class DragDropExample {}
```

## ساخت elementهای draggable

می‌توانید هر elementای را با افزودن directive مربوط به `cdkDrag` draggable کنید. به صورت پیش‌فرض، همه elementهای draggable از free dragging پشتیبانی می‌کنند.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/overview/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/overview/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/overview/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/overview/app/app.css"/>
</docs-code-multifile>

## ساخت listای از elementهای draggable قابل reorder

directive مربوط به `cdkDropList` را به یک parent element اضافه کنید تا elementهای draggable را در یک collection قابل reorder گروه‌بندی کند. این مشخص می‌کند elementهای draggable کجا می‌توانند drop شوند. elementهای draggable داخل drop list group هنگام حرکت یک element به صورت خودکار rearrange می‌شوند.

directiveهای drag and drop، data model شما را update نمی‌کنند. برای update کردن data model، به event مربوط به `cdkDropListDropped` گوش دهید \(وقتی کاربر dragging را تمام می‌کند\) و data model را دستی update کنید.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/sorting/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/sorting/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/sorting/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/sorting/app/app.css"/>
</docs-code-multifile>

می‌توانید از injection token مربوط به `CDK_DROP_LIST` استفاده کنید که برای reference گرفتن از instanceهای `cdkDropList` به کار می‌رود. برای اطلاعات بیشتر، [راهنمای dependency injection](/guide/di) و [drop list injection token API](api/cdk/drag-drop/CDK_DROP_LIST) را ببینید.

## انتقال elementهای draggable بین listها

directive مربوط به `cdkDropList` از انتقال elementهای draggable بین drop listهای connected پشتیبانی می‌کند. دو راه برای connect کردن یک یا چند instance از `cdkDropList` به هم وجود دارد:

- property مربوط به `cdkDropListConnectedTo` را روی drop list دیگری تنظیم کنید.
- elementها را داخل elementای با attribute مربوط به `cdkDropListGroup` wrap کنید.

directive مربوط به `cdkDropListConnectedTo` هم با reference مستقیم به `cdkDropList` دیگر کار می‌کند و هم با reference به id مربوط به drop container دیگر.

```html
<!-- This is valid -->
<div cdkDropList #listOne="cdkDropList" [cdkDropListConnectedTo]="[listTwo]"></div>
<div cdkDropList #listTwo="cdkDropList" [cdkDropListConnectedTo]="[listOne]"></div>

<!-- This is valid as well -->
<div cdkDropList id="list-one" [cdkDropListConnectedTo]="['list-two']"></div>
<div cdkDropList id="list-two" [cdkDropListConnectedTo]="['list-one']"></div>
```

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.css"/>
</docs-code-multifile>

اگر تعداد نامشخصی drop list connected دارید، از directive مربوط به `cdkDropListGroup` استفاده کنید تا connection به صورت خودکار setup شود. هر `cdkDropList` جدیدی که زیر یک group اضافه شود، خودکار به همه listهای دیگر connect می‌شود.

```angular-html
<div cdkDropListGroup>
  <!-- All lists in here will be connected. -->
  @for (list of lists; track list) {
    <div cdkDropList></div>
  }
</div>
```

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.css"/>
</docs-code-multifile>

می‌توانید از injection token مربوط به `CDK_DROP_LIST_GROUP` استفاده کنید که برای reference گرفتن از instanceهای `cdkDropListGroup` به کار می‌رود. برای اطلاعات بیشتر، [راهنمای dependency injection](/guide/di) و [drop list group injection token API](api/cdk/drag-drop/CDK_DROP_LIST_GROUP) را ببینید.

### Selective dragging

به صورت پیش‌فرض، کاربر می‌تواند elementهای `cdkDrag` را از یک container به container connected دیگر منتقل کند. برای کنترل دقیق‌تر اینکه کدام elementها بتوانند داخل یک container drop شوند، از `cdkDropListEnterPredicate` استفاده کنید. Angular هر بار که یک element draggable وارد container جدید می‌شود، predicate را فراخوانی می‌کند. بسته به اینکه predicate مقدار true یا false برگرداند، item ممکن است اجازه ورود به container جدید را داشته باشد یا نداشته باشد.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.css"/>
</docs-code-multifile>

## Attach کردن data

می‌توانید با تنظیم `cdkDragData` یا `cdkDropListData` به ترتیب، data دلخواهی را با هر دو `cdkDrag` و `cdkDropList` associate کنید. می‌توانید به eventهایی که از هر دو directive fire می‌شوند bind کنید؛ این eventها شامل همین data هستند و به شما اجازه می‌دهند origin مربوط به drag یا drop interaction را به سادگی تشخیص دهید.

```angular-html
@for (list of lists; track list) {
  <div cdkDropList [cdkDropListData]="list" (cdkDropListDropped)="drop($event)">
    @for (item of list; track item) {
      <div cdkDrag [cdkDragData]="item"></div>
    }
  </div>
}
```

## سفارشی‌سازی Dragging

### سفارشی‌سازی drag handle

به صورت پیش‌فرض، کاربر می‌تواند کل element مربوط به `cdkDrag` را drag کند تا آن را جابه‌جا کند. برای محدود کردن کاربر به اینکه فقط با یک handle element بتواند این کار را انجام دهد، directive مربوط به `cdkDragHandle` را به elementای داخل `cdkDrag` اضافه کنید. می‌توانید هر تعداد element از نوع `cdkDragHandle` که می‌خواهید داشته باشید.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.css"/>
</docs-code-multifile>

می‌توانید از injection token مربوط به `CDK_DRAG_HANDLE` استفاده کنید که برای reference گرفتن از instanceهای `cdkDragHandle` به کار می‌رود. برای اطلاعات بیشتر، [راهنمای dependency injection](/guide/di) و [drag handle injection token API](api/cdk/drag-drop/CDK_DRAG_HANDLE) را ببینید.

### سفارشی‌سازی drag preview

وقتی یک element مربوط به `cdkDrag` در حال drag شدن است، یک preview element visible می‌شود. به صورت پیش‌فرض، preview یک clone از element اصلی است که کنار cursor کاربر position شده است.

برای سفارشی‌سازی preview، یک template سفارشی از طریق `*cdkDragPreview` فراهم کنید. preview سفارشی با اندازه element اصلی dragged match نمی‌شود، چون فرضی درباره content element در نظر گرفته نمی‌شود. برای match کردن اندازه element برای drag preview، مقدار true را به input مربوط به `matchSize` پاس دهید.

element cloneشده attribute مربوط به id خودش را حذف می‌کند تا چند element با id یکسان در صفحه وجود نداشته باشد. این باعث می‌شود هر CSSای که آن id را target می‌کند اعمال نشود.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.css"/>
</docs-code-multifile>

می‌توانید از injection token مربوط به `CDK_DRAG_PREVIEW` استفاده کنید که برای reference گرفتن از instanceهای `cdkDragPreview` به کار می‌رود. برای اطلاعات بیشتر، [راهنمای dependency injection](/guide/di) و [drag preview injection token API](api/cdk/drag-drop/CDK_DRAG_PREVIEW) را ببینید.

### سفارشی‌سازی drag insertion point

به صورت پیش‌فرض، Angular برای جلوگیری از issueهای positioning و overflow، preview مربوط به `cdkDrag` را داخل `<body>` صفحه insert می‌کند. این ممکن است در بعضی caseها مطلوب نباشد، چون preview styleهای inherited خود را دریافت نمی‌کند.

می‌توانید محل insert شدن preview توسط Angular را با input مربوط به `cdkDragPreviewContainer` روی `cdkDrag` تغییر دهید. valueهای ممکن:

| Value                         | Description                                                                            | Advantages                                                                                                                  | Disadvantages                                                                                                                                                             |
| :---------------------------- | :------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `global`                      | مقدار پیش‌فرض. Angular preview را داخل <body> یا نزدیک‌ترین shadow root insert می‌کند. | preview تحت تأثیر `z-index` یا `overflow: hidden` قرار نمی‌گیرد. همچنین روی selectorهای `:nth-child` و flex layoutها اثر نمی‌گذارد. | styleهای inherited را حفظ نمی‌کند.                                                                                                                                          |
| `parent`                      | Angular preview را داخل parent همان elementای که drag می‌شود insert می‌کند.    | preview همان styleهای element dragged را inherit می‌کند.                                                                    | preview ممکن است با `overflow: hidden` clip شود یا به دلیل `z-index` زیر elementهای دیگر قرار بگیرد. علاوه بر این، می‌تواند روی selectorهای `:nth-child` و بعضی flex layoutها اثر بگذارد. |
| `ElementRef` یا `HTMLElement` | Angular preview را داخل element مشخص‌شده insert می‌کند.                                | preview styleها را از container element مشخص‌شده inherit می‌کند.                                                               | preview ممکن است با `overflow: hidden` clip شود یا به دلیل `z-index` زیر elementهای دیگر قرار بگیرد. علاوه بر این، می‌تواند روی selectorهای `:nth-child` و بعضی flex layoutها اثر بگذارد. |

به جای آن، می‌توانید injection token مربوط به `CDK_DRAG_CONFIG` را modify کنید تا اگر value برابر `global` یا `parent` است، `previewContainer` را داخل config update کنید. برای اطلاعات بیشتر، [راهنمای dependency injection](/guide/di)، [drag config injection token API](api/cdk/drag-drop/CDK_DRAG_CONFIG) و [drag drop config API](api/cdk/drag-drop/DragDropConfig) را ببینید.

### سفارشی‌سازی drag placeholder

وقتی یک element مربوط به `cdkDrag` در حال drag شدن است، directive یک placeholder element ایجاد می‌کند که نشان می‌دهد element هنگام drop شدن کجا قرار خواهد گرفت. به صورت پیش‌فرض، placeholder یک clone از elementای است که drag می‌شود. می‌توانید با directive مربوط به `*cdkDragPlaceholder` آن را با نمونه سفارشی جایگزین کنید:

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.css"/>
</docs-code-multifile>

می‌توانید از injection token مربوط به `CDK_DRAG_PLACEHOLDER` استفاده کنید که برای reference گرفتن از instanceهای `cdkDragPlaceholder` به کار می‌رود. برای اطلاعات بیشتر، [راهنمای dependency injection](/guide/di) و [drag placeholder injection token API](api/cdk/drag-drop/CDK_DRAG_PLACEHOLDER) را ببینید.

### سفارشی‌سازی drag root element

اگر elementای هست که می‌خواهید draggable شود اما به آن دسترسی مستقیم ندارید، attribute مربوط به `cdkDragRootElement` را تنظیم کنید.

این attribute یک selector می‌پذیرد و در DOM به سمت بالا جستجو می‌کند تا elementای را پیدا کند که با selector match شود. اگر element پیدا شود، draggable می‌شود. این برای caseهایی مثل draggable کردن dialog مفید است.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/root-element/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/root-element/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/root-element/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/root-element/app/app.css"/>
</docs-code-multifile>

به جای آن، می‌توانید injection token مربوط به `CDK_DRAG_CONFIG` را modify کنید تا `rootElementSelector` را داخل config update کنید. برای اطلاعات بیشتر، [راهنمای dependency injection](/guide/di)، [drag config injection token API](api/cdk/drag-drop/CDK_DRAG_CONFIG) و [drag drop config API](api/cdk/drag-drop/DragDropConfig) را ببینید.

### تنظیم position در DOM برای یک element draggable

به صورت پیش‌فرض، elementهای `cdkDrag` که داخل `cdkDropList` نیستند فقط وقتی کاربر element را دستی جابه‌جا کند از position عادی خود در DOM حرکت می‌کنند. از input مربوط به `cdkDragFreeDragPosition` استفاده کنید تا position element را صریح تنظیم کنید. یک use case رایج برای این کار، restore کردن position یک element draggable بعد از این است که کاربر از صفحه خارج شده و سپس برگشته است.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.css"/>
</docs-code-multifile>

### محدود کردن movement داخل یک element

برای اینکه کاربر نتواند یک element مربوط به `cdkDrag` را بیرون از element دیگری drag کند، یک CSS selector را به attribute مربوط به `cdkDragBoundary` پاس دهید. این attribute یک selector می‌پذیرد و در DOM به سمت بالا جستجو می‌کند تا elementای را پیدا کند که با آن match شود. اگر match پیدا شود، آن element به boundary تبدیل می‌شود که element draggable نمی‌تواند بیرون از آن drag شود. `cdkDragBoundary` همچنین وقتی `cdkDrag` داخل `cdkDropList` قرار دارد قابل استفاده است.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/boundary/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/boundary/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/boundary/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/boundary/app/app.css"/>
</docs-code-multifile>

به جای آن، می‌توانید injection token مربوط به `CDK_DRAG_CONFIG` را modify کنید تا boundaryElement را داخل config update کنید. برای اطلاعات بیشتر، [راهنمای dependency injection](/guide/di)، [drag config injection token API](api/cdk/drag-drop/CDK_DRAG_CONFIG) و [drag drop config API](api/cdk/drag-drop/DragDropConfig) را ببینید.

### محدود کردن movement روی یک axis

به صورت پیش‌فرض، `cdkDrag` حرکت آزاد در همه جهت‌ها را اجازه می‌دهد. برای محدود کردن dragging به یک axis مشخص، `cdkDragLockAxis` را روی `cdkDrag` به مقدار "x" یا "y" تنظیم کنید. برای محدود کردن dragging چند element draggable داخل `cdkDropList`، به جای آن `cdkDropListLockAxis` را روی `cdkDropList` تنظیم کنید.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.css"/>
</docs-code-multifile>

به جای آن، می‌توانید injection token مربوط به `CDK_DRAG_CONFIG` را modify کنید تا `lockAxis` را داخل config update کنید. برای اطلاعات بیشتر، [راهنمای dependency injection](/guide/di)، [drag config injection token API](api/cdk/drag-drop/CDK_DRAG_CONFIG) و [drag drop config API](api/cdk/drag-drop/DragDropConfig) را ببینید.

### Delay دادن به dragging

به صورت پیش‌فرض وقتی کاربر pointer خود را روی یک `cdkDrag` پایین می‌آورد، sequence مربوط به dragging شروع می‌شود. این behavior ممکن است در caseهایی مثل elementهای fullscreen draggable روی touch deviceها مطلوب نباشد، جایی که کاربر ممکن است هنگام scroll کردن صفحه تصادفی drag event را trigger کند.

می‌توانید sequence مربوط به dragging را با input مربوط به `cdkDragStartDelay` delay دهید. این input منتظر می‌ماند تا کاربر pointer را به تعداد millisecond مشخص‌شده نگه دارد و سپس element را drag کند.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.css"/>
</docs-code-multifile>

به جای آن، می‌توانید injection token مربوط به `CDK_DRAG_CONFIG` را modify کنید تا dragStartDelay را داخل config update کنید. برای اطلاعات بیشتر، [راهنمای dependency injection](/guide/di)، [drag config injection token API](api/cdk/drag-drop/CDK_DRAG_CONFIG) و [drag drop config API](api/cdk/drag-drop/DragDropConfig) را ببینید.

### غیرفعال کردن dragging

اگر می‌خواهید dragging را برای یک drag item مشخص غیرفعال کنید، input مربوط به `cdkDragDisabled` را روی یک item از نوع `cdkDrag` به true یا false تنظیم کنید. می‌توانید کل list را با input مربوط به `cdkDropListDisabled` روی یک `cdkDropList` غیرفعال کنید. همچنین غیرفعال کردن یک handle مشخص از طریق `cdkDragHandleDisabled` روی `cdkDragHandle` ممکن است.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.css"/>
</docs-code-multifile>

به جای آن، می‌توانید injection token مربوط به `CDK_DRAG_CONFIG` را modify کنید تا `draggingDisabled` را داخل config update کنید. برای اطلاعات بیشتر، [راهنمای dependency injection](/guide/di)، [drag config injection token API](api/cdk/drag-drop/CDK_DRAG_CONFIG) و [drag drop config API](api/cdk/drag-drop/DragDropConfig) را ببینید.

## سفارشی‌سازی Sorting

### جهت list

به صورت پیش‌فرض، directive مربوط به `cdkDropList` فرض می‌کند listها vertical هستند. می‌توان این را با تنظیم property مربوط به `cdkDropListOrientation` به horizontal تغییر داد.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.css"/>
</docs-code-multifile>

به جای آن، می‌توانید injection token مربوط به `CDK_DRAG_CONFIG` را modify کنید تا `listOrientation` را داخل config update کنید. برای اطلاعات بیشتر، [راهنمای dependency injection](/guide/di)، [drag config injection token API](api/cdk/drag-drop/CDK_DRAG_CONFIG) و [drag drop config API](api/cdk/drag-drop/DragDropConfig) را ببینید.

### Wrapping در list

به صورت پیش‌فرض، `cdkDropList` elementهای draggable را با جابه‌جا کردن آن‌ها توسط CSS transform sort می‌کند. این امکان animated شدن sorting را فراهم می‌کند و تجربه کاربری بهتری می‌دهد. اما یک drawback هم دارد: drop list فقط در یک جهت کار می‌کند، vertical یا horizontal.

اگر sortable listای دارید که باید روی خط‌های جدید wrap شود، می‌توانید attribute مربوط به `cdkDropListOrientation` را روی `mixed` تنظیم کنید. این باعث می‌شود list از strategy متفاوتی برای sort کردن elementها استفاده کند که شامل جابه‌جا کردن آن‌ها در DOM است. با این حال، list دیگر نمی‌تواند action مربوط به sorting را animate کند.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.css"/>
</docs-code-multifile>

### Selective sorting

به صورت پیش‌فرض، elementهای `cdkDrag` در هر positionای داخل یک `cdkDropList` sort می‌شوند. برای تغییر این behavior، attribute مربوط به `cdkDropListSortPredicate` را تنظیم کنید که یک function می‌گیرد. predicate function هر بار که یک element draggable قرار است به index جدیدی داخل drop list منتقل شود فراخوانی می‌شود. اگر predicate مقدار true برگرداند، item به index جدید منتقل می‌شود؛ در غیر این صورت position فعلی خود را نگه می‌دارد.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.css"/>
</docs-code-multifile>

### غیرفعال کردن sorting

caseهایی وجود دارد که elementهای draggable می‌توانند از یک `cdkDropList` به دیگری drag شوند، اما کاربر نباید بتواند آن‌ها را داخل source list sort کند. برای این caseها، attribute مربوط به `cdkDropListSortingDisabled` را اضافه کنید تا جلوی sort شدن elementهای draggable داخل یک `cdkDropList` گرفته شود. اگر dragged element به یک position معتبر جدید drag نشود، این کار position اولیه آن در source list را حفظ می‌کند.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.css"/>
</docs-code-multifile>

به جای آن، می‌توانید injection token مربوط به `CDK_DRAG_CONFIG` را modify کنید تا sortingDisabled را داخل config update کنید. برای اطلاعات بیشتر، [راهنمای dependency injection](/guide/di)، [drag config injection token API](api/cdk/drag-drop/CDK_DRAG_CONFIG) و [drag drop config API](api/cdk/drag-drop/DragDropConfig) را ببینید.

### Copy کردن itemها بین listها

به صورت پیش‌فرض، وقتی یک item از یک list به list دیگر drag می‌شود، از list اصلی خودش منتقل می‌شود. اما می‌توانید directiveها را طوری configure کنید که item copy شود و item اصلی در source list باقی بماند.

برای فعال کردن copying، می‌توانید input مربوط به `cdkDropListHasAnchor` را تنظیم کنید. این به `cdkDropList` می‌گوید یک element از نوع "anchor" بسازد که در container اصلی می‌ماند و همراه item حرکت نمی‌کند. اگر کاربر item را به container اصلی برگرداند، anchor به صورت خودکار حذف می‌شود. anchor element را می‌توان با target کردن CSS class مربوط به `.cdk-drag-anchor` style داد.

ترکیب `cdkDropListHasAnchor` با `cdkDropListSortingDisabled` ساختن listای را ممکن می‌کند که کاربر بتواند itemها را از آن copy کند بدون اینکه بتواند source list را reorder کند \(مثلاً product list و shopping cart\).

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/copy-list/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/copy-list/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/copy-list/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/copy-list/app/app.css"/>
</docs-code-multifile>

## سفارشی‌سازی animationها

Drag and drop برای هر دو مورد زیر از animation پشتیبانی می‌کند:

- Sort کردن یک element draggable داخل list
- حرکت دادن element draggable از positionای که کاربر آن را drop کرده تا position نهایی داخل list

برای setup کردن animationهای خود، یک CSS transition تعریف کنید که property مربوط به transform را target کند. classهای زیر برای animationها قابل استفاده هستند:

| CSS class name      | نتیجه افزودن transition                                                                                                                                                                                |
| :------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| .cdk-drag           | elementهای draggable را هنگام sort شدن animate می‌کند.                                                                                                                                                       |
| .cdk-drag-animating | element draggable را از position dropشده به position نهایی داخل `cdkDropList` animate می‌کند.<br><br>این CSS class فقط وقتی action مربوط به dragging متوقف شده روی یک element از نوع `cdkDrag` اعمال می‌شود. |

## Styling

هر دو directive مربوط به `cdkDrag` و `cdkDropList` فقط styleهای ضروری لازم برای functionality را اعمال می‌کنند. Applicationها می‌توانند با target کردن این CSS classهای مشخص، styleهای خود را سفارشی کنند.

| CSS class name           | Description                                                                                                                                                                                                                                                                                             |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| .cdk-drop-list           | selector برای container elementهای `cdkDropList`.                                                                                                                                                                                                                                                      |
| .cdk-drag                | selector برای elementهای `cdkDrag`.                                                                                                                                                                                                                                                                        |
| .cdk-drag-disabled       | selector برای elementهای disabled از نوع `cdkDrag`.                                                                                                                                                                                                                                                               |
| .cdk-drag-handle         | selector برای host element مربوط به `cdkDragHandle`.                                                                                                                                                                                                                                                   |
| .cdk-drag-preview        | selector برای drag preview element. این همان elementای است که هنگام drag کردن یک element در sortable list، کنار cursor کاربر ظاهر می‌شود.<br><br>این element دقیقاً شبیه elementای است که drag می‌شود، مگر اینکه با template سفارشی از طریق `*cdkDragPreview` سفارشی شده باشد.                   |
| .cdk-drag-placeholder    | selector برای drag placeholder element. این همان elementای است که در spotای نمایش داده می‌شود که draggable element پس از پایان action مربوط به dragging به آنجا drag خواهد شد.<br><br>این element دقیقاً شبیه elementای است که sort می‌شود، مگر اینکه با directive مربوط به cdkDragPlaceholder سفارشی شده باشد. |
| .cdk-drop-list-dragging  | selector برای container element مربوط به `cdkDropList` که در حال حاضر یک draggable element در حال drag شدن دارد.                                                                                                                                                                                                      |
| .cdk-drop-list-disabled  | selector برای container elementهای `cdkDropList` که disabled هستند.                                                                                                                                                                                                                                        |
| .cdk-drop-list-receiving | selector برای container element مربوط به `cdkDropList` که یک draggable element دارد که می‌تواند از یک connected drop list که در حال drag شدن است دریافت کند.                                                                                                                                                    |
| .cdk-drag-anchor         | selector برای anchor elementای که وقتی `cdkDropListHasAnchor` فعال است ایجاد می‌شود. این element position شروع item dragged را نشان می‌دهد.                                                                                                                                        |

## Dragging داخل scrollable container

اگر draggable itemهای شما داخل یک scrollable container هستند \(مثلاً یک `div` با `overflow: auto`\)، automatic scrolling کار نمی‌کند مگر اینکه scrollable container، directive مربوط به `cdkScrollable` را داشته باشد. بدون آن، CDK نمی‌تواند scroll behavior مربوط به container را هنگام drag operationها detect یا control کند.

## Integration با کامپوننت‌های دیگر

قابلیت drag-and-drop در CDK می‌تواند با کامپوننت‌های مختلف integrate شود. use caseهای رایج شامل کامپوننت‌های sortable از نوع `MatTable` و کامپوننت‌های sortable از نوع `MatTabGroup` هستند.
