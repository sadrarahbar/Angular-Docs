# Group کردن elementها با ng-container

`<ng-container>` یک element ویژه در Angular است که چند element را با هم group می‌کند یا بدون render کردن یک element واقعی در DOM، یک location را در template علامت‌گذاری می‌کند.

```angular-html
<!-- Component template -->
<section>
  <ng-container>
    <h3>User bio</h3>
    <p>Here's some info about the user</p>
  </ng-container>
</section>
```

```angular-html
<!-- Rendered DOM -->
<section>
  <h3>User bio</h3>
  <p>Here's some info about the user</p>
</section>
```

می‌توانید directiveها را روی `<ng-container>` اعمال کنید تا behavior یا configuration به بخشی از template خود اضافه کنید.

Angular همه attribute bindingها و event listenerهایی را که روی `<ng-container>` اعمال شده‌اند نادیده می‌گیرد، از جمله آن‌هایی که از طریق directive اعمال شده‌اند.

## استفاده از `<ng-container>` برای نمایش contentهای dynamic

`<ng-container>` می‌تواند به‌عنوان placeholder برای render کردن dynamic content عمل کند.

### Render کردن componentها

می‌توانید از directive built-in مربوط به `NgComponentOutlet` در Angular استفاده کنید تا یک component را به‌صورت dynamic در location مربوط به `<ng-container>` render کنید.

```angular-ts
@Component({
  template: `
    <h2>Your profile</h2>
    <ng-container [ngComponentOutlet]="profileComponent()" />
  `,
})
export class UserProfile {
  isAdmin = input(false);
  profileComponent = computed(() => (this.isAdmin() ? AdminProfile : BasicUserProfile));
}
```

در مثال بالا، directive مربوط به `NgComponentOutlet` به‌صورت dynamic یکی از دو component یعنی `AdminProfile` یا `BasicUserProfile` را در location مربوط به element `<ng-container>` render می‌کند.

### Render کردن template fragmentها

می‌توانید از directive built-in مربوط به `NgTemplateOutlet` در Angular استفاده کنید تا یک template fragment را به‌صورت dynamic در location مربوط به `<ng-container>` render کنید.

```angular-ts
@Component({
  template: `
    <h2>Your profile</h2>
    <ng-container [ngTemplateOutlet]="profileTemplate()" />

    <ng-template #admin>This is the admin profile</ng-template>
    <ng-template #basic>This is the basic profile</ng-template>
  `,
})
export class UserProfile {
  isAdmin = input(false);
  adminTemplate = viewChild('admin', {read: TemplateRef});
  basicTemplate = viewChild('basic', {read: TemplateRef});
  profileTemplate = computed(() => (this.isAdmin() ? this.adminTemplate() : this.basicTemplate()));
}
```

در مثال بالا، directive مربوط به `ngTemplateOutlet` به‌صورت dynamic یکی از دو template fragment را در location مربوط به element `<ng-container>` render می‌کند.

برای اطلاعات بیشتر درباره `NgTemplateOutlet`، page مربوط به [NgTemplateOutlet API documentation](/api/common/NgTemplateOutlet) را ببینید.

## استفاده از `<ng-container>` همراه structural directiveها

همچنین می‌توانید structural directiveها را روی elementهای `<ng-container>` اعمال کنید. نمونه‌های رایج این کار شامل `ngIf` و `ngFor` است.

```angular-html
<ng-container *ngIf="permissions == 'admin'">
  <h1>Admin Dashboard</h1>
  <admin-infographic />
</ng-container>

<ng-container *ngFor="let item of items; index as i; trackBy: trackByFn">
  <h2>{{ item.title }}</h2>
  <p>{{ item.description }}</p>
</ng-container>
```

## استفاده از `<ng-container>` برای injection

برای اطلاعات بیشتر درباره dependency injection system در Angular، [راهنمای Dependency Injection](/guide/di) را ببینید.

وقتی یک directive را روی `<ng-container>` اعمال می‌کنید، elementهای descendant می‌توانند آن directive یا هر چیزی را که directive provide می‌کند inject کنند. وقتی می‌خواهید یک مقدار را به‌صورت declarative برای بخش مشخصی از template خود provide کنید، از این روش استفاده کنید.

```angular-ts
@Directive({
  selector: '[theme]',
})
export class Theme {
  // Create an input that accepts 'light' or 'dark`, defaulting to 'light'.
  mode = input<'light' | 'dark'>('light');
}
```

```angular-html
<ng-container theme="dark">
  <profile-pic />
  <user-bio />
</ng-container>
```

در مثال بالا، componentهای `ProfilePic` و `UserBio` می‌توانند directive مربوط به `Theme` را inject کنند و بر اساس `mode` آن style اعمال کنند.
