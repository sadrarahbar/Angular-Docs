# Serve کردن Angular appها برای development

می‌توانید Angular CLI application خود را با command مربوط به `ng serve` serve کنید.
این command application شما را compile می‌کند، optimizationهای غیرضروری را skip می‌کند، یک devserver اجرا می‌کند، و هر تغییر بعدی را به‌صورت خودکار rebuild و live reload می‌کند.
می‌توانید با فشردن `Ctrl+C` server را متوقف کنید.

`ng serve` فقط builder مربوط به target به نام `serve` را در default project، همان‌طور که در `angular.json` مشخص شده، اجرا می‌کند. هرچند هر builderی می‌تواند اینجا استفاده شود، رایج‌ترین و default builder همان `@angular/build:dev-server` است.

می‌توانید با نگاه کردن به target مربوط به `serve` در project مشخص، تشخیص دهید کدام builder استفاده می‌شود.

```json
{
  "projects": {
    "my-app": {
      "architect": {
        // `ng serve` invokes the Architect target named `serve`.
        "serve": {
          "builder": "@angular/build:dev-server"
          // ...
        },
        "build": {
          /* ... */
        },
        "test": {
          /* ... */
        }
      }
    }
  }
}
```

## Proxy کردن به backend server

برای هدایت URLهای مشخص به backend server، از [proxying support](https://vite.dev/config/server-options#server-proxy) استفاده کنید و یک فایل را به build option مربوط به `--proxy-config` پاس دهید.
برای مثال، برای هدایت همه callهای مربوط به `http://localhost:4200/api` به serverی که روی `http://localhost:3000/api` اجراست، این stepها را انجام دهید.

1. فایلی به نام `proxy.conf.json` در folder مربوط به `src/` پروژه بسازید.
1. محتوای زیر را به proxy file جدید اضافه کنید:

```json
{
  "/api/**": {
    "target": "http://localhost:3000",
    "secure": false
  }
}
```

1. در فایل configuration مربوط به CLI یعنی `angular.json`، option مربوط به `proxyConfig` را به target مربوط به `serve` اضافه کنید:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "serve": {
          "builder": "@angular/build:dev-server",
          "options": {
            "proxyConfig": "src/proxy.conf.json"
          }
        }
      }
    }
  }
}
```

1. برای اجرای development server با این proxy configuration، `ng serve` را صدا بزنید.

NOTE: برای اعمال تغییراتی که در proxy configuration file انجام می‌دهید، باید process مربوط به `ng serve` را restart کنید.

### رفتار path matching به builder وابسته است

**`@angular/build:dev-server`** مبتنی بر [Vite](https://vite.dev/config/server-options#server-proxy)

- `/api` فقط با `/api` match می‌شود.
- `/api/*` با `/api/users` match می‌شود اما با `/api/users/123` نه.
- `/api/**` با `/api/users` و `/api/users/123` match می‌شود.

**`@angular-devkit/build-angular:dev-server`** مبتنی بر [Webpack DevServer](https://webpack.js.org/configuration/dev-server/#devserverproxy)

- `/api` با `/api` و همه sub-pathها match می‌شود؛ معادل `/api/**`.
