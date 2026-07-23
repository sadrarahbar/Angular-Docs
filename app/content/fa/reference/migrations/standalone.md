# مهاجرت یک پروژه موجود Angular به standalone

**componentهای standalone** روشی ساده‌تر برای ساخت برنامه‌های Angular فراهم می‌کنند. هدف componentها،‏ directiveها و pipeهای standalone روان‌ترکردن تجربه توسعه با کاهش نیاز به `NgModule` است. برنامه‌های موجود می‌توانند style جدید standalone را به‌صورت اختیاری و تدریجی، بدون breaking change، به‌کار بگیرند.

<docs-video src="https://www.youtube.com/embed/x5PZwb4XurU" title="شروع کار با componentهای standalone"/>

این schematic به تبدیل componentها،‏ directiveها و pipeهای پروژه‌های موجود به standalone کمک می‌کند. schematic تلاش می‌کند بیشترین مقدار کد ممکن را خودکار تبدیل کند، اما ممکن است نویسنده پروژه ناچار به انجام برخی اصلاحات دستی شود.

schematic را با دستور زیر اجرا کنید:

```shell
ng generate @angular/core:standalone
```

## پیش از به‌روزرسانی

پیش از استفاده از schematic مطمئن شوید پروژه:

1. از Angular 15.2.0 یا جدیدتر استفاده می‌کند.
2. بدون خطای compilation ساخته می‌شود.
3. روی یک branch تمیز Git قرار دارد و تمام تغییرها ذخیره شده‌اند.

## گزینه‌های schematic

| گزینه  | جزئیات                                                                                                                                       |
| :----- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode` | تبدیلی که باید انجام شود. برای گزینه‌های موجود، بخش [حالت‌های مهاجرت](#migration-modes) را ببینید.                                          |
| `path` | مسیر مهاجرت نسبت به ریشه پروژه. با این گزینه می‌توانید بخش‌های پروژه را به‌صورت تدریجی مهاجرت دهید.                                           |

## مراحل مهاجرت

فرایند مهاجرت از سه مرحله تشکیل می‌شود. باید آن را چند بار اجرا و به‌صورت دستی بررسی کنید که پروژه مطابق انتظار build و اجرا می‌شود.

NOTE: با اینکه schematic می‌تواند بیشتر کد را خودکار به‌روزرسانی کند، برخی edge caseها به دخالت توسعه‌دهنده نیاز دارند.
برای اعمال اصلاحات دستی پس از هر مرحله برنامه‌ریزی کنید. همچنین ممکن است کد جدید تولیدشده توسط schematic با قواعد formatting کد شما مطابقت نداشته باشد.

مهاجرت را به ترتیب زیر اجرا کنید و میان مراحل از build و اجرای درست کد مطمئن شوید:

1. دستور `ng g @angular/core:standalone` را اجرا و گزینه "Convert all components, directives and pipes to standalone" را انتخاب کنید.
2. دستور `ng g @angular/core:standalone` را اجرا و گزینه "Remove unnecessary NgModule classes" را انتخاب کنید.
3. دستور `ng g @angular/core:standalone` را اجرا و گزینه "Bootstrap the project using standalone APIs" را انتخاب کنید.
4. بررسی‌های linting و formatting را اجرا، خطاها را رفع و نتیجه را commit کنید.

## پس از مهاجرت

تبریک، برنامه شما به standalone تبدیل شد 🎉. اکنون می‌توانید این مراحل اختیاری را انجام دهید:

- declarationهای باقی‌مانده `NgModule` را پیدا و حذف کنید: چون مرحله [«حذف NgModuleهای غیرضروری»](#remove-unnecessary-ngmodules) نمی‌تواند تمام moduleها را خودکار حذف کند، ممکن است لازم باشد declarationهای باقی‌مانده را دستی حذف کنید.
- unit testهای پروژه را اجرا و خطاها را رفع کنید.
- اگر پروژه از formatting خودکار استفاده می‌کند، code formatterها را اجرا کنید.
- linterهای پروژه را اجرا و هشدارهای جدید را رفع کنید. برخی linterها flag مربوط به `--fix` دارند که می‌تواند تعدادی از هشدارها را خودکار برطرف کند.

## حالت‌های مهاجرت

مهاجرت حالت‌های زیر را دارد:

1. تبدیل declarationها به standalone.
2. حذف NgModuleهای غیرضروری.
3. تغییر به API مربوط به bootstrap از نوع standalone.
   این مهاجرت‌ها را به‌ترتیب ارائه‌شده اجرا کنید.

### تبدیل declarationها به standalone

در این حالت، مهاجرت با حذف `standalone: false` و افزودن dependencyها به آرایه `imports`، تمام componentها،‏ directiveها و pipeها را به standalone تبدیل می‌کند.

HELPFUL: schematic در این مرحله NgModuleهایی را که componentای را bootstrap می‌کنند نادیده می‌گیرد، زیرا احتمالاً moduleهای ریشه مورد استفاده `bootstrapModule` هستند، نه `bootstrapApplication` سازگار با standalone. schematic این declarationها را در مرحله [«تغییر به API مربوط به bootstrap از نوع standalone»](#switch-to-standalone-bootstrapping-api) خودکار تبدیل می‌کند.

**پیش از مهاجرت:**

```typescript
// shared.module.ts
@NgModule({
  imports: [CommonModule],
  declarations: [Greeter],
  exports: [Greeter],
})
export class SharedModule {}
```

```angular-ts
// greeter.ts
@Component({
  selector: 'greeter',
  template: '<div *ngIf="showGreeting">Hello</div>',
  standalone: false,
})
export class Greeter {
  showGreeting = true;
}
```

**پس از مهاجرت:**

```typescript
// shared.module.ts
@NgModule({
  imports: [CommonModule, Greeter],
  exports: [Greeter],
})
export class SharedModule {}
```

```angular-ts
// greeter.ts
@Component({
  selector: 'greeter',
  template: '<div *ngIf="showGreeting">Hello</div>',
  imports: [NgIf],
})
export class Greeter {
  showGreeting = true;
}
```

### حذف NgModuleهای غیرضروری

پس از تبدیل تمام declarationها به standalone، بسیاری از NgModuleها را می‌توان با خیال آسوده حذف کرد. این مرحله declarationهای چنین moduleهایی و بیشترین تعداد ممکن از referenceهای مرتبط را حذف می‌کند. اگر مهاجرت نتواند referenceای را خودکار حذف کند، comment زیر را باقی می‌گذارد تا NgModule را دستی حذف کنید:

```typescript
/* TODO(standalone-migration): clean up removed NgModule reference manually */
```

مهاجرت یک module را زمانی برای حذف امن در نظر می‌گیرد که:

- `declarations` نداشته باشد.
- `providers` نداشته باشد.
- component در `bootstrap` نداشته باشد.
- در `imports` به symbol از نوع `ModuleWithProviders` یا module غیرقابل‌حذف ارجاع ندهد.
- member در class نداشته باشد. constructorهای خالی نادیده گرفته می‌شوند.

**پیش از مهاجرت:**

```typescript
// importer.module.ts
@NgModule({
  imports: [FooComponent, BarPipe],
  exports: [FooComponent, BarPipe],
})
export class ImporterModule {}
```

**پس از مهاجرت:**

```typescript
// importer.module.ts
// Does not exist!
```

### تغییر به API مربوط به bootstrap از نوع standalone

این مرحله تمام کاربردهای `bootstrapModule` را به `bootstrapApplication` جدید و مبتنی بر standalone تبدیل می‌کند. همچنین `standalone: false` را از component ریشه حذف کرده و NgModule ریشه را پاک می‌کند. اگر module ریشه `providers` یا `imports` داشته باشد، مهاجرت تلاش می‌کند بیشترین مقدار ممکن از این پیکربندی را به فراخوانی bootstrap جدید منتقل کند.

**پیش از مهاجرت:**

```typescript
// ./app/app.module.ts
import {NgModule} from '@angular/core';
import {App} from './app';

@NgModule({
  declarations: [App],
  bootstrap: [App],
})
export class AppModule {}
```

```typescript
// ./app/app.ts
@Component({
  selector: 'app',
  template: 'hello',
  standalone: false,
})
export class App {}
```

```typescript
// ./main.ts
import {platformBrowser} from '@angular/platform-browser';
import {AppModule} from './app/app.module';

platformBrowser()
  .bootstrapModule(AppModule)
  .catch((e) => console.error(e));
```

**پس از مهاجرت:**

```typescript
// ./app/app.module.ts
// Does not exist!
```

```typescript
// ./app/app.ts
@Component({
  selector: 'app',
  template: 'hello',
})
export class App {}
```

```typescript
// ./main.ts
import {bootstrapApplication} from '@angular/platform-browser';
import {App} from './app';

bootstrapApplication(App).catch((e) => console.error(e));
```

## مشکلات رایج

برخی مشکلات رایج که ممکن است مانع عملکرد درست schematic شوند عبارت‌اند از:

- خطاهای compilation: اگر پروژه خطای compilation داشته باشد، Angular نمی‌تواند آن را به‌درستی تحلیل و مهاجرت دهد.
- فایل‌های خارج از tsconfig:‏ schematic با تحلیل فایل‌های `tsconfig.json` پروژه، فایل‌های لازم برای مهاجرت را مشخص می‌کند. هر فایلی که در tsconfig پوشش داده نشده باشد کنار گذاشته می‌شود.
- کد غیرقابل static analysis:‏ schematic با static analysis کد را درک و محل تغییرها را مشخص می‌کند. مهاجرت ممکن است classهایی را که metadata آن‌ها هنگام build قابل static analysis نیست نادیده بگیرد.

## محدودیت‌ها

به‌دلیل اندازه و پیچیدگی مهاجرت، schematic در برخی موارد محدودیت دارد:

- چون unit testها به‌صورت ahead-of-time ‏(AoT) کامپایل نمی‌شوند، ممکن است `imports` اضافه‌شده به componentها در unit test کاملاً درست نباشند.
- schematic به فراخوانی مستقیم APIهای Angular متکی است و wrapperهای سفارشی پیرامون آن‌ها را تشخیص نمی‌دهد. برای مثال، اگر تابع سفارشی `customConfigureTestModule` را به‌عنوان wrapper برای `TestBed.configureTestingModule` تعریف کنید، ممکن است componentهای declarationشده توسط آن شناسایی نشوند.
