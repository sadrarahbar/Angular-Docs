# تولید کد با استفاده از schematics

یک schematic یک code generator مبتنی بر template است که از logic پیچیده پشتیبانی می‌کند.
schematic مجموعه‌ای از دستورالعمل‌ها برای transform کردن یک software project از طریق generate یا modify کردن code است.
Schematics داخل collectionها package می‌شوند و با npm نصب می‌شوند.

schematic collection می‌تواند ابزار قدرتمندی برای ساخت، تغییر و نگه‌داری هر software project باشد، اما به‌طور ویژه برای customize کردن Angular projectها بر اساس نیازهای مشخص سازمان شما مفید است.
برای مثال، ممکن است از schematics برای generate کردن UI patternهای رایج یا componentهای مشخص، با استفاده از templateها یا layoutهای predefined، استفاده کنید.
از schematics برای enforce کردن architectural ruleها و conventionها استفاده کنید تا projectهای شما consistent و interoperative باشند.

## Schematics برای Angular CLI

Schematics بخشی از Angular ecosystem هستند.
Angular CLI از schematics برای اعمال transformها روی یک web-app project استفاده می‌کند.
می‌توانید این schematics را modify کنید و schematics جدیدی تعریف کنید تا کارهایی مثل update کردن code برای fix کردن breaking changeها در یک dependency، یا اضافه کردن یک configuration option یا framework جدید به project موجود را انجام دهید.

Schematicsی که در collection مربوط به `@schematics/angular` include شده‌اند، به‌صورت پیش‌فرض توسط commandهای `ng generate` و `ng add` اجرا می‌شوند.
این package شامل named schematicهایی است که optionهای در دسترس CLI را برای sub-commandهای `ng generate` مثل `ng generate component` و `ng generate service` configure می‌کنند.
sub-commandهای `ng generate` شکل کوتاه‌شده schematic متناظر هستند.
برای مشخص کردن و generate کردن یک schematic مشخص، یا یک collection از schematics، با long form:

```shell

ng generate my-schematic-collection:my-schematic-name

```

یا

```shell

ng generate my-schematic-name --collection collection-name

```

### پیکربندی CLI schematics

یک JSON schema مرتبط با schematic به Angular CLI می‌گوید چه optionهایی برای commandها و sub-commandها در دسترس‌اند و defaultها را تعیین می‌کند.
این defaultها می‌توانند با ارائه مقدار متفاوت برای یک option در command line override شوند.
برای اطلاعات درباره تغییر defaultهای optionهای generation برای workspace خود، [Workspace Configuration](reference/configs/workspace-config) را ببینید.

JSON schemaهای مربوط به default schematicهایی که CLI برای generate کردن projectها و بخش‌هایی از projectها استفاده می‌کند، در package مربوط به [`@schematics/angular`](https://github.com/angular/angular-cli/tree/main/packages/schematics/angular) جمع شده‌اند.
schema، optionهای در دسترس CLI را برای هرکدام از sub-commandهای `ng generate` توضیح می‌دهد، همان‌طور که در خروجی `--help` نشان داده می‌شود.

## توسعه schematics برای libraryها

به‌عنوان library developer، می‌توانید collectionهای custom schematics خودتان را بسازید تا library شما با Angular CLI integrate شود.

- یک _add schematic_ به developerها اجازه می‌دهد library شما را با `ng add` داخل Angular workspace نصب کنند
- _Generation schematics_ می‌توانند به sub-commandهای `ng generate` بگویند چطور projectها را modify کنند، configurationها و scriptها را اضافه کنند، و artifactهایی را که در library شما تعریف شده‌اند scaffold کنند
- یک _update schematic_ می‌تواند به command مربوط به `ng update` بگوید وقتی نسخه جدیدی release می‌کنید، dependencyهای library شما را update کند و برای breaking changeها adjustment انجام دهد

برای جزئیات بیشتر درباره اینکه این‌ها چه شکلی‌اند و چطور باید آن‌ها را ساخت، ببینید:

<docs-pill-row>
  <docs-pill href="tools/cli/schematics-authoring" title="Authoring Schematics"/>
  <docs-pill href="tools/cli/schematics-for-libraries" title="Schematics for Libraries"/>
</docs-pill-row>

### Add schematics

یک _add schematic_ معمولاً همراه یک library ارائه می‌شود تا آن library بتواند با `ng add` به project موجود اضافه شود.
command مربوط به `add` از package manager شما برای دانلود dependencyهای جدید استفاده می‌کند و یک installation script را invoke می‌کند که به‌عنوان schematic implement شده است.

برای مثال، schematic مربوط به [`@angular/material`](https://material.angular.dev/guide/schematics) به command مربوط به `add` می‌گوید Angular Material و theming را نصب و setup کند و starter componentهای جدیدی را register کند که می‌توانند با `ng generate` ساخته شوند.
این مورد را به‌عنوان example و model برای add schematic خودتان بررسی کنید.

Partner libraryها و third-party libraryها هم با add schematics از Angular CLI پشتیبانی می‌کنند.
برای مثال، `@ng-bootstrap/schematics`، [ng-bootstrap](https://ng-bootstrap.github.io) را به app اضافه می‌کند و `@clr/angular`، [Clarity from VMWare](https://clarity.design/documentation/get-started) را نصب و setup می‌کند.

یک _add schematic_ همچنین می‌تواند project را با configuration changeها update کند، dependencyهای اضافه \(مثل polyfillها\) اضافه کند، یا initialization code مخصوص package را scaffold کند.
برای مثال، schematic مربوط به `@angular/pwa` با اضافه کردن application manifest و service worker، application شما را به PWA تبدیل می‌کند.

### Generation schematics

Generation schematics دستورالعمل‌هایی برای command مربوط به `ng generate` هستند.
sub-commandهای documented از default Angular generation schematics استفاده می‌کنند، اما می‌توانید یک schematic متفاوت را، به‌جای sub-command، مشخص کنید تا artifactی که در library شما تعریف شده generate شود.

برای مثال، Angular Material برای UI componentهایی که تعریف می‌کند generation schematic ارائه می‌دهد.
command زیر از یکی از این schematics استفاده می‌کند تا یک `<mat-table>` مربوط به Angular Material را render کند که از قبل با datasource برای sorting و pagination configure شده است.

```shell

ng generate @angular/material:table <component-name>

```

### Update schematics

command مربوط به `ng update` می‌تواند برای update کردن library dependencyهای workspace شما استفاده شود.
اگر هیچ optionی ارائه ندهید یا از help option استفاده کنید، command workspace شما را بررسی می‌کند و libraryهایی را که باید update شوند پیشنهاد می‌دهد.

```shell

ng update
We analyzed your package.json, there are some packages to update:

    Name                                      Version                     Command to update
    --------------------------------------------------------------------------------
    @angular/cdk                       7.2.2 -> 7.3.1           ng update @angular/cdk
    @angular/cli                       7.2.3 -> 7.3.0           ng update @angular/cli
    @angular/core                      7.2.2 -> 7.2.3           ng update @angular/core
    @angular/material                  7.2.2 -> 7.3.1           ng update @angular/material
    rxjs                                      6.3.3 -> 6.4.0           ng update rxjs

```

اگر مجموعه‌ای از libraryها را برای update به command پاس دهید، همان libraryها، peer dependencyهای آن‌ها، و peer dependencyهایی که به آن‌ها وابسته‌اند update می‌شوند.

HELPFUL: اگر inconsistency وجود داشته باشد، برای مثال اگر peer dependencyها با یک range ساده [semver](https://semver.io) match نشوند، command error generate می‌کند و هیچ چیزی را در workspace تغییر نمی‌دهد.

توصیه می‌کنیم به‌صورت پیش‌فرض همه dependencyها را force update نکنید.
اول update کردن dependencyهای مشخص را امتحان کنید.

برای اطلاعات بیشتر درباره نحوه کار command مربوط به `ng update`، [Update Command](https://github.com/angular/angular-cli/blob/main/docs/specifications/update.md) را ببینید.

اگر نسخه جدیدی از library خودتان بسازید که breaking changeهای احتمالی معرفی می‌کند، می‌توانید یک _update schematic_ ارائه کنید تا command مربوط به `ng update` بتواند هرکدام از این changeها را در projectی که update می‌شود به‌صورت خودکار resolve کند.

برای مثال، فرض کنید می‌خواهید Angular Material library را update کنید.

```shell
ng update @angular/material
```

این command هم `@angular/material` و هم dependency آن یعنی `@angular/cdk` را در `package.json` مربوط به workspace شما update می‌کند.
اگر هرکدام از packageها update schematicی داشته باشند که migration از نسخه موجود به نسخه جدید را پوشش دهد، command آن schematic را روی workspace شما اجرا می‌کند.
