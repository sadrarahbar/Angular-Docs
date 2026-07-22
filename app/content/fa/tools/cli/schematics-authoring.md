# ساخت schematics

می‌توانید schematics اختصاصی خود را برای کار روی پروژه‌های Angular ایجاد کنید.
توسعه‌دهندگان کتابخانه معمولاً schematics را همراه کتابخانه‌هایشان ارائه می‌کنند تا آن‌ها را با Angular CLI یکپارچه سازند.
همچنین می‌توانید schematics مستقلی بسازید که فایل‌ها و ساختارهای برنامه‌های Angular را تغییر دهند؛ به این ترتیب می‌توانید آن‌ها را متناسب با محیط توسعه خود سفارشی کرده و با استانداردها و محدودیت‌هایتان هماهنگ کنید.
schematics را می‌توان به یکدیگر زنجیر کرد تا با اجرای schematics دیگر، عملیات پیچیده‌ای انجام دهند.

دست‌کاری کد یک برنامه می‌تواند بسیار قدرتمند و به همان اندازه خطرناک باشد.
برای مثال، ایجاد فایلی که از قبل وجود دارد خطا محسوب می‌شود و اگر تغییر بلافاصله اعمال شود، تمام تغییرات دیگری را که تا آن لحظه انجام شده‌اند از بین می‌برد.
ابزار Angular Schematics با ایجاد یک فایل‌سیستم مجازی از بروز عوارض جانبی و خطاها جلوگیری می‌کند.
یک schematic، زنجیره‌ای از تبدیل‌ها را توصیف می‌کند که می‌توان آن‌ها را روی فایل‌سیستم مجازی اعمال کرد.
هنگام اجرای schematic، تبدیل‌ها در حافظه ثبت می‌شوند و تنها پس از تأیید معتبر بودنشان روی فایل‌سیستم واقعی اعمال خواهند شد.

## مفاهیم schematics

API عمومی schematics کلاس‌هایی را تعریف می‌کند که مفاهیم پایه را نمایش می‌دهند.

- فایل‌سیستم مجازی با یک `Tree` نمایش داده می‌شود.
  ساختار داده `Tree` شامل یک _base_ \(مجموعه‌ای از فایل‌های موجود\) و یک _staging area_ \(فهرستی از تغییراتی که باید روی base اعمال شوند\) است.
  هنگام ایجاد تغییر، خود base را مستقیماً تغییر نمی‌دهید؛ بلکه تغییرات را به staging area اضافه می‌کنید.

- شیء `Rule` تابعی را تعریف می‌کند که یک `Tree` را دریافت کرده، تبدیل‌ها را روی آن اعمال می‌کند و یک `Tree` جدید برمی‌گرداند.
  فایل اصلی یک schematic یعنی `index.ts`، مجموعه‌ای از ruleها را تعریف می‌کند که منطق schematic را پیاده‌سازی می‌کنند.

- هر تبدیل با یک `Action` نمایش داده می‌شود.
  چهار نوع action وجود دارد: `Create`، `Rename`، `Overwrite` و `Delete`.

- هر schematic در یک context اجرا می‌شود که با شیء `SchematicContext` نمایش داده می‌شود.

شیء context که به rule ارسال می‌شود، امکان دسترسی به توابع کاربردی و metadata موردنیاز schematic را فراهم می‌کند؛ از جمله یک logging API برای کمک به اشکال‌زدایی.
context همچنین یک _merge strategy_ تعریف می‌کند که مشخص می‌سازد تغییرات چگونه از tree مرحله‌بندی‌شده با base ادغام شوند.
یک تغییر می‌تواند پذیرفته یا نادیده گرفته شود، یا باعث ایجاد exception شود.

### تعریف ruleها و actionها

وقتی با [Schematics CLI](#schematics-cli) یک schematic خالی جدید ایجاد می‌کنید، تابع ورودی تولیدشده یک _rule factory_ است.
شیء `RuleFactory` یک تابع مرتبه‌بالاتر را تعریف می‌کند که یک `Rule` می‌سازد.

```ts {header: "index.ts"}
import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';

// You don't have to export the function as default.
// You can also have more than one rule factory per file.
export function helloWorld(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return tree;
  };
}
```

ruleهای شما می‌توانند با فراخوانی ابزارهای خارجی و پیاده‌سازی منطق، پروژه‌ها را تغییر دهند.
برای مثال، برای تعیین نحوه ادغام یک template موجود در schematic با پروژه میزبان، به یک rule نیاز دارید.

ruleها می‌توانند از ابزارهای ارائه‌شده در پکیج `@schematics/angular` استفاده کنند.
در این پکیج می‌توانید توابع کمکی برای کار با moduleها، dependencyها، TypeScript، AST، JSON، workspaceها و پروژه‌های Angular CLI و موارد دیگر را پیدا کنید.

```ts {header: "index.ts"}
import {
  JsonAstObject,
  JsonObject,
  JsonValue,
  Path,
  normalize,
  parseJsonAst,
  strings,
} from '@angular-devkit/core';
```

### تعریف گزینه‌های ورودی با schema و interfaceها

ruleها می‌توانند مقدار گزینه‌ها را از فراخواننده دریافت کرده و در templateها تزریق کنند.
گزینه‌های در دسترس ruleها، همراه مقادیر مجاز و پیش‌فرض آن‌ها، در فایل JSON schema مربوط به schematic یعنی `<schematic>/schema.json` تعریف می‌شوند.
نوع داده‌های متغیر یا enum را با استفاده از interfaceهای TypeScript برای schema تعریف کنید.

schema نوع و مقدار پیش‌فرض متغیرهای مورد استفاده در schematic را مشخص می‌کند.
برای مثال، schematic فرضی «Hello World» می‌تواند schema زیر را داشته باشد.

```json {header: "schema.json"}
{
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1,
      "default": "world"
    },
    "useColor": {
      "type": "boolean"
    }
  }
}
```

نمونه فایل‌های schema مربوط به schematics فرمان‌های Angular CLI را در [`@schematics/angular`](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/application/schema.json) ببینید.

### promptهای schematic

_prompt_های schematic تعامل با کاربر را وارد فرایند اجرای schematic می‌کنند.
گزینه‌های schematic را طوری پیکربندی کنید که یک پرسش قابل سفارشی‌سازی به کاربر نمایش دهند.
promptها پیش از اجرای schematic نمایش داده می‌شوند و سپس schematic پاسخ را به‌عنوان مقدار گزینه استفاده می‌کند.
به این ترتیب کاربران می‌توانند بدون نیاز به شناخت عمیق همه گزینه‌های موجود، نحوه عملکرد schematic را هدایت کنند.

برای مثال، schematic «Hello World» می‌تواند نام کاربر را بپرسد و آن نام را به‌جای مقدار پیش‌فرض `"world"` نمایش دهد.
برای تعریف چنین promptی، یک property با نام `x-prompt` به schema متغیر `name` اضافه کنید.

به همین شکل می‌توانید promptی اضافه کنید تا کاربر مشخص کند آیا schematic هنگام اجرای action مربوط به hello از رنگ استفاده کند یا خیر.
schema شامل هر دو prompt به‌شکل زیر خواهد بود.

```json {header: "schema.json"}
{
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1,
      "default": "world",
      "x-prompt": "What is your name?"
    },
    "useColor": {
      "type": "boolean",
      "x-prompt": "Would you like the response in color?"
    }
  }
}
```

#### syntax کوتاه prompt

این مثال‌ها از شکل کوتاه syntax مربوط به prompt استفاده می‌کنند و فقط متن پرسش را ارائه می‌دهند.
در بیشتر موارد همین مقدار کافی است.
بااین‌حال توجه کنید که این دو prompt انتظار انواع متفاوتی از ورودی را دارند.
در شکل کوتاه، مناسب‌ترین نوع به‌طور خودکار و بر اساس schema مربوط به property انتخاب می‌شود.
در مثال، prompt مربوط به `name` چون یک property از نوع string است، از نوع `input` استفاده می‌کند.
prompt مربوط به `useColor` نیز چون یک property از نوع Boolean است، نوع `confirmation` را به کار می‌گیرد.
در این حالت «yes» معادل `true` و «no» معادل `false` است.

سه نوع ورودی پشتیبانی می‌شود.

| Input type   | Details                                            |
| :----------- | :------------------------------------------------- |
| confirmation | پرسش بله یا خیر؛ مناسب گزینه‌های Boolean.          |
| input        | ورودی متنی؛ مناسب گزینه‌های string یا number.      |
| list         | مجموعه‌ای از پیش تعریف‌شده از مقادیر مجاز.          |

در شکل کوتاه، نوع ورودی از نوع و محدودیت‌های property استنباط می‌شود.

| Property schema   | Prompt type                                             |
| :---------------- | :------------------------------------------------------ |
| "type": "boolean" | confirmation \("yes"=`true`, "no"=`false`\)          |
| "type": "string"  | input                                                   |
| "type": "number"  | input \(فقط عددهای معتبر پذیرفته می‌شوند\)             |
| "type": "integer" | input \(فقط عددهای معتبر پذیرفته می‌شوند\)             |
| "enum": [â€¦]       | list \(اعضای enum به گزینه‌های فهرست تبدیل می‌شوند\)    |

در مثال زیر، property یک مقدار enum می‌پذیرد؛ بنابراین schematic به‌طور خودکار نوع list را انتخاب کرده و از مقادیر ممکن یک منو می‌سازد.

```json {header: "schema.json"}
{
  "style": {
    "description": "The file extension or preprocessor to use for style files.",
    "type": "string",
    "default": "css",
    "enum": ["css", "scss", "sass", "less", "styl"],
    "x-prompt": "Which stylesheet format would you like to use?"
  }
}
```

محیط اجرای prompt، پاسخ ارائه‌شده را به‌طور خودکار با محدودیت‌های تعیین‌شده در JSON schema اعتبارسنجی می‌کند.
اگر مقدار قابل قبول نباشد، دوباره از کاربر درخواست مقدار جدید می‌شود.
این رفتار تضمین می‌کند تمام مقادیر ارسال‌شده به schematic با انتظارات پیاده‌سازی آن مطابقت داشته باشند و نیازی به افزودن بررسی‌های بیشتر در کد schematic نداشته باشید.

#### syntax کامل prompt

syntax مربوط به فیلد `x-prompt` برای مواردی که به سفارشی‌سازی و کنترل بیشتری روی prompt نیاز دارید، از یک شکل کامل پشتیبانی می‌کند.
در این حالت، مقدار فیلد `x-prompt` یک شیء JSON با زیرفیلدهایی است که رفتار prompt را سفارشی می‌کنند.

| Field   | Data value                                                                    |
| :------ | :---------------------------------------------------------------------------- |
| type    | `confirmation`، `input` یا `list` \(در شکل کوتاه خودکار انتخاب می‌شود\)       |
| message | string \(الزامی\)                                                            |
| items   | string و/یا جفت شیء label/value \(فقط برای نوع `list` معتبر است\)             |

مثال زیر از شکل کامل، از JSON schema مربوط به schematicای گرفته شده است که CLI برای [تولید برنامه‌ها](https://github.com/angular/angular-cli/blob/ba8a6ea59983bb52a6f1e66d105c5a77517f062e/packages/schematics/angular/application/schema.json#L56) استفاده می‌کند.
این مثال promptی را تعریف می‌کند که به کاربران اجازه می‌دهد پیش‌پردازنده style برنامه در حال ساخت را انتخاب کنند.
با استفاده از شکل کامل، schematic می‌تواند قالب‌بندی دقیق‌تری برای گزینه‌های منو فراهم کند.

```json {header: "schema.json"}
{
  "style": {
    "description": "The file extension or preprocessor to use for style files.",
    "type": "string",
    "default": "css",
    "enum": ["css", "scss", "sass", "less"],
    "x-prompt": {
      "message": "Which stylesheet format would you like to use?",
      "type": "list",
      "items": [
        {"value": "css", "label": "CSS"},
        {"value": "scss", "label": "SCSS [ https://sass-lang.com/documentation/syntax#scss ]"},
        {
          "value": "sass",
          "label": "Sass [ https://sass-lang.com/documentation/syntax#the-indented-syntax ]"
        },
        {"value": "less", "label": "Less [ https://lesscss.org/ ]"}
      ]
    }
  }
}
```

#### schema مربوط به x-prompt

JSON schema تعریف‌کننده گزینه‌های یک schematic، extensionهایی را برای تعریف declarative مربوط به promptها و رفتار آن‌ها پشتیبانی می‌کند.
برای پشتیبانی از promptها به منطق اضافه یا تغییر در کد schematic نیازی نیست.
JSON schema زیر، شرح کاملی از syntax شکل کامل فیلد `x-prompt` است.

```json {header: "x-prompt schema"}
{
  "oneOf": [
    {
      "type": "string"
    },
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string"
        },
        "message": {
          "type": "string"
        },
        "items": {
          "type": "array",
          "items": {
            "oneOf": [
              {
                "type": "string"
              },
              {
                "type": "object",
                "properties": {
                  "label": {
                    "type": "string"
                  },
                  "value": {}
                },
                "required": ["value"]
              }
            ]
          }
        }
      },
      "required": ["message"]
    }
  ]
}
```

## Schematics CLI

Schematics ابزار command-line اختصاصی خود را دارد.
با استفاده از Node 6.9 یا نسخه‌های جدیدتر، ابزار command-line مربوط به Schematics را به‌صورت global نصب کنید:

```shell

npm install -g @angular-devkit/schematics-cli

```

این فرمان فایل اجرایی `schematics` را نصب می‌کند. با آن می‌توانید یک collection جدید از schematics را در پوشه پروژه خودش ایجاد کنید، schematic جدیدی به collection موجود بیفزایید یا یک schematic موجود را توسعه دهید.

در بخش‌های بعدی با استفاده از CLI یک collection جدید می‌سازید تا با فایل‌ها، ساختار فایل و برخی مفاهیم پایه آشنا شوید.

بااین‌حال رایج‌ترین کاربرد schematics، یکپارچه‌سازی یک کتابخانه Angular با Angular CLI است.
برای این کار، بدون استفاده از Schematics CLI، فایل‌های schematic را مستقیماً در پروژه کتابخانه داخل یک workspace از Angular بسازید.
[Schematics برای کتابخانه‌ها](tools/cli/schematics-for-libraries) را ببینید.

### ایجاد یک collection از schematics

فرمان زیر یک schematic جدید با نام `hello-world` در پوشه پروژه‌ای جدید و هم‌نام ایجاد می‌کند.

```shell

schematics blank --name=hello-world

```

schematic با نام `blank` توسط Schematics CLI ارائه می‌شود.
این فرمان یک پوشه پروژه جدید \(پوشه root مربوط به collection\) و یک schematic اولیه و نام‌گذاری‌شده در آن collection ایجاد می‌کند.

به پوشه collection بروید، dependencyهای npm را نصب کنید و collection جدید را در editor دلخواه خود باز کنید تا فایل‌های تولیدشده را ببینید.
برای مثال، اگر از VS Code استفاده می‌کنید:

```shell

cd hello-world
npm install
npm run build
code .

```

schematic اولیه هم‌نام پوشه پروژه است و در `src/hello-world` تولید می‌شود.
schematics مرتبط را به این collection اضافه کنید و کد skeleton تولیدشده را برای تعریف قابلیت‌های schematic تغییر دهید.
نام هر schematic درون collection باید یکتا باشد.

### اجرای schematic

برای اجرای یک schematic نام‌گذاری‌شده از فرمان `schematics` استفاده کنید.
مسیر پوشه پروژه، نام schematic و گزینه‌های الزامی را با قالب زیر ارائه دهید.

```shell

schematics <path-to-schematics-project>:<schematics-name> --<required-option>=<value>

```

مسیر می‌تواند absolute یا نسبت به working directory فعلی محل اجرای فرمان، relative باشد.
برای مثال، برای اجرای schematicای که اکنون تولید کردید \(و گزینه الزامی ندارد\)، از فرمان زیر استفاده کنید.

```shell

schematics .:hello-world

```

### افزودن schematic به collection

برای افزودن یک schematic به collection موجود، همان فرمانی را اجرا کنید که برای آغاز پروژه جدید schematics به کار می‌رود؛ با این تفاوت که آن را داخل پوشه پروژه اجرا کنید.

```shell

cd hello-world
schematics blank --name=goodbye-world

```

این فرمان schematic نام‌گذاری‌شده جدید را همراه فایل اصلی `index.ts` و test spec مرتبط درون collection تولید می‌کند.
همچنین نام، توضیح و تابع factory مربوط به schematic جدید را به schema متعلق به collection در فایل `collection.json` اضافه می‌کند.

## محتوای collection

سطح بالای پوشه root پروژه یک collection شامل فایل‌های پیکربندی، پوشه `node_modules` و پوشه `src/` است.
پوشه `src/` شامل زیرپوشه‌های schematics نام‌گذاری‌شده در collection و schemaای با نام `collection.json` است که schematics گردآوری‌شده را توصیف می‌کند.
هر schematic با یک نام، توضیح و تابع factory ساخته می‌شود.

```json
{
  "$schema": "../node_modules/@angular-devkit/schematics/collection-schema.json",
  "schematics": {
    "hello-world": {
      "description": "A blank schematic.",
      "factory": "./hello-world/index#helloWorld"
    }
  }
}
```

- property با نام `$schema`، schema مورد استفاده CLI برای اعتبارسنجی را مشخص می‌کند.
- property با نام `schematics`، schematics نام‌گذاری‌شده متعلق به این collection را فهرست می‌کند.
  هر schematic یک توضیح متنی ساده دارد و به تابع ورودی تولیدشده در فایل اصلی اشاره می‌کند.

- property با نام `factory` به تابع ورودی تولیدشده اشاره دارد.
  در این مثال، با فراخوانی تابع factory یعنی `helloWorld()`، schematic با نام `hello-world` را اجرا می‌کنید.

- property اختیاری `schema` به یک فایل JSON schema اشاره می‌کند که گزینه‌های command-line در دسترس schematic را تعریف می‌کند.
- آرایه اختیاری `aliases` یک یا چند string را مشخص می‌کند که می‌توان از آن‌ها برای فراخوانی schematic استفاده کرد.
  برای مثال، schematic مربوط به فرمان «generate» در Angular CLI دارای alias با مقدار «g» است که امکان استفاده از فرمان `ng g` را فراهم می‌کند.

### schematics نام‌گذاری‌شده

هنگام استفاده از Schematics CLI برای ایجاد یک پروژه خالی schematics، schematic خالی جدید نخستین عضو collection است و همان نام collection را دارد.
وقتی یک schematic نام‌گذاری‌شده جدید به این collection اضافه می‌کنید، به‌طور خودکار به schema موجود در `collection.json` افزوده می‌شود.

هر schematic علاوه بر نام و توضیح، یک property با نام `factory` دارد که نقطه ورود آن را مشخص می‌کند.
در این مثال، با فراخوانی تابع `helloWorld()` در فایل اصلی `hello-world/index.ts`، قابلیت تعریف‌شده schematic را اجرا می‌کنید.

<img alt="overview" src="assets/images/guide/schematics/collection-files.gif">

هر schematic نام‌گذاری‌شده در collection بخش‌های اصلی زیر را دارد.

| Parts         | Details                                                          |
| :------------ | :--------------------------------------------------------------- |
| `index.ts`    | کدی که منطق تبدیل یک schematic نام‌گذاری‌شده را تعریف می‌کند.     |
| `schema.json` | تعریف متغیرهای schematic.                                        |
| `schema.d.ts` | متغیرهای schematic.                                              |
| `files/`      | فایل‌های اختیاری component/template برای تکثیر.                   |

یک schematic می‌تواند بدون templateهای اضافه، تمام منطق خود را در فایل `index.ts` ارائه دهد.
بااین‌حال می‌توانید با قراردادن componentها و templateها در پوشه `files`، مشابه موارد موجود در پروژه‌های standalone از Angular، schematics پویا برای Angular بسازید.
منطق موجود در فایل index با تعریف ruleهایی که داده تزریق کرده و متغیرها را تغییر می‌دهند، این templateها را پیکربندی می‌کند.
