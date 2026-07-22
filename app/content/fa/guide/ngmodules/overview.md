# NgModuleها

IMPORTANT: تیم Angular توصیه می‌کند در همهٔ کدهای جدید به‌جای `NgModule` از [کامپوننت‌های standalone](guide/components) استفاده کنید. این راهنما برای درک کدهای موجودی است که با `@NgModule` ساخته شده‌اند.

NgModule کلاسی است که با decorator مربوط به `@NgModule` علامت‌گذاری می‌شود. این decorator، _metadata_ای می‌پذیرد که نحوهٔ compileکردن template کامپوننت‌ها و پیکربندی Dependency Injection را به Angular اعلام می‌کند.

```typescript
import {NgModule} from '@angular/core';

@NgModule({
  // Metadata goes here
})
export class CustomMenuModule {}
```

یک NgModule دو مسئولیت اصلی دارد:

- تعریف کامپوننت‌ها، directiveها و pipeهایی که به آن NgModule تعلق دارند
- افزودن providerها به injector برای کامپوننت‌ها، directiveها و pipeهایی که NgModule را import می‌کنند

## Declarationها

ویژگی `declarations` در metadata مربوط به `@NgModule`، کامپوننت‌ها، directiveها و pipeهای متعلق به NgModule را مشخص می‌کند.

```typescript
@NgModule({
  /* ... */
  // CustomMenu and CustomMenuItem are components.
  declarations: [CustomMenu, CustomMenuItem],
})
export class CustomMenuModule {}
```

در مثال بالا، کامپوننت‌های `CustomMenu` و `CustomMenuItem` به `CustomMenuModule` تعلق دارند.

ویژگی `declarations` همچنین _آرایه‌هایی_ از کامپوننت‌ها، directiveها و pipeها را می‌پذیرد. این آرایه‌ها نیز می‌توانند آرایه‌های دیگری در خود داشته باشند.

```typescript
const MENU_COMPONENTS = [CustomMenu, CustomMenuItem];
const WIDGETS = [MENU_COMPONENTS, CustomSlider];

@NgModule({
  /* ... */
  // This NgModule declares all of CustomMenu, CustomMenuItem,
  // CustomSlider, and CustomCheckbox.
  declarations: [WIDGETS, CustomCheckbox],
})
export class CustomMenuModule {}
```

اگر Angular کامپوننت، directive یا pipeای را پیدا کند که در بیش از یک NgModule تعریف شده است، خطا گزارش می‌دهد.

هر کامپوننت، directive یا pipe برای تعریف‌شدن در یک NgModule باید صراحتاً با `standalone: false` علامت‌گذاری شود.

```typescript
@Component({
  // Mark this component as `standalone: false` so that it can be declared in an NgModule.
  standalone: false,
  /* ... */
})
export class CustomMenu {
  /* ... */
}
```

### imports

کامپوننت‌های تعریف‌شده در یک NgModule ممکن است به کامپوننت‌ها، directiveها و pipeهای دیگری وابسته باشند. این وابستگی‌ها را به ویژگی `imports` در metadata مربوط به `@NgModule` اضافه کنید.

```typescript
@NgModule({
  /* ... */
  // CustomMenu and CustomMenuItem depend on the PopupTrigger and SelectorIndicator components.
  imports: [PopupTrigger, SelectionIndicator],
  declarations: [CustomMenu, CustomMenuItem],
})
export class CustomMenuModule {}
```

آرایهٔ `imports` علاوه بر NgModuleهای دیگر، کامپوننت‌ها، directiveها و pipeهای standalone را نیز می‌پذیرد.

### exports

یک NgModule می‌تواند کامپوننت‌ها، directiveها و pipeهای تعریف‌شدهٔ خود را _export_ کند تا در اختیار سایر کامپوننت‌ها و NgModuleها قرار گیرند.

```typescript
@NgModule({
  imports: [PopupTrigger, SelectionIndicator],
  declarations: [CustomMenu, CustomMenuItem],

  // Make CustomMenu and CustomMenuItem available to
  // components and NgModules that import CustomMenuModule.
  exports: [CustomMenu, CustomMenuItem],
})
export class CustomMenuModule {}
```

با این حال، ویژگی `exports` به declarationها محدود نیست. یک NgModule می‌تواند هر کامپوننت، directive، pipe یا NgModule دیگری را که import کرده است نیز export کند.

```typescript
@NgModule({
  imports: [PopupTrigger, SelectionIndicator],
  declarations: [CustomMenu, CustomMenuItem],

  // Also make PopupTrigger available to any component or NgModule that imports CustomMenuModule.
  exports: [CustomMenu, CustomMenuItem, PopupTrigger],
})
export class CustomMenuModule {}
```

## providerهای `NgModule`

TIP: برای کسب اطلاعات دربارهٔ Dependency Injection و providerها، [راهنمای Dependency Injection](guide/di) را ببینید.

یک `NgModule` می‌تواند برای وابستگی‌های injectشده، `providers` مشخص کند. این providerها در اختیار موارد زیر قرار می‌گیرند:

- هر کامپوننت، directive یا pipe مستقل که NgModule را import کند؛ و
- `declarations` و `providers` هر NgModule _دیگری_ که این NgModule را import کند.

```typescript
@NgModule({
  imports: [PopupTrigger, SelectionIndicator],
  declarations: [CustomMenu, CustomMenuItem],

  // Provide the OverlayManager service
  providers: [OverlayManager],
  /* ... */
})
export class CustomMenuModule {}

@NgModule({
  imports: [CustomMenuModule],
  declarations: [UserProfile],
  providers: [UserDataClient],
})
export class UserProfileModule {}
```

در مثال بالا:

- `CustomMenuModule`، مقدار `OverlayManager` را فراهم می‌کند.
- کامپوننت‌های `CustomMenu` و `CustomMenuItem` می‌توانند `OverlayManager` را inject کنند، زیرا در `CustomMenuModule` تعریف شده‌اند.
- `UserProfile` می‌تواند `OverlayManager` را inject کند، زیرا NgModule آن، `CustomMenuModule` را import می‌کند.
- `UserDataClient` نیز به همین دلیل می‌تواند `OverlayManager` را inject کند.

### الگوی `forRoot` و `forChild`

برخی NgModuleها متد static به نام `forRoot` تعریف می‌کنند که مقداری پیکربندی می‌پذیرد و آرایه‌ای از providerها برمی‌گرداند. نام «`forRoot`» یک قرارداد است و نشان می‌دهد این providerها باید هنگام bootstrap منحصراً به _ریشهٔ_ برنامه اضافه شوند.

providerهایی که به این روش اضافه می‌شوند به‌صورت eager بارگذاری می‌شوند و اندازهٔ bundle جاوااسکریپت در بارگذاری اولیهٔ صفحه را افزایش می‌دهند.

```typescript
bootstrapApplication(MyApplicationRoot, {
  providers: [CustomMenuModule.forRoot(/* some config */)],
});
```

به همین ترتیب، بعضی NgModuleها متد static به نام `forChild` دارند که نشان می‌دهد providerها باید به کامپوننت‌های درون سلسله‌مراتب برنامه افزوده شوند.

```typescript
@Component({
  /* ... */
  providers: [CustomMenuModule.forChild(/* some config */)],
})
export class UserProfile {
  /* ... */
}
```

## Bootstrapکردن برنامه

IMPORTANT: تیم Angular توصیه می‌کند برای تمام کدهای جدید به‌جای `bootstrapModule` از [bootstrapApplication](api/platform-browser/bootstrapApplication) استفاده کنید. این راهنما برای درک برنامه‌های موجودی است که با `@NgModule` راه‌اندازی شده‌اند.

decorator مربوط به `@NgModule` یک آرایهٔ اختیاری `bootstrap` می‌پذیرد که می‌تواند شامل یک یا چند کامپوننت باشد.

برای شروع یک برنامهٔ Angular می‌توانید متد [`bootstrapModule`](/api/core/PlatformRef#bootstrapModule) را از [`platformBrowser`](api/platform-browser/platformBrowser) یا [`platformServer`](api/platform-server/platformServer) به کار ببرید. هنگام اجرا، این تابع elementهایی را در صفحه پیدا می‌کند که CSS selector آن‌ها با کامپوننت‌های فهرست‌شده مطابقت دارد و سپس آن کامپوننت‌ها را در صفحه render می‌کند.

```typescript
import {platformBrowser} from '@angular/platform-browser';

@NgModule({
  bootstrap: [MyApplication],
})
export class MyApplicationModule {}

platformBrowser().bootstrapModule(MyApplicationModule);
```

کامپوننت‌های موجود در `bootstrap` به‌صورت خودکار در declarationهای NgModule قرار می‌گیرند.

هنگامی که یک برنامه را از NgModule راه‌اندازی می‌کنید، `providers` گردآوری‌شدهٔ این ماژول و تمام `providers` مربوط به `imports` آن به‌صورت eager بارگذاری می‌شوند و در سراسر برنامه برای injectکردن در دسترس هستند.
