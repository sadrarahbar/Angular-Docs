# WebMCP

Web Model Context Protocol یا WebMCP یک [web standard نوظهور](https://github.com/webmachinelearning/webmcp/) است که به web applicationها اجازه می‌دهد toolهای structured را مستقیماً برای AI agentهایی که به‌صورت native در browser اجرا می‌شوند expose کنند. toolهایی که application تعریف می‌کند به AI assistantها اجازه می‌دهند مستقیماً با آن تعامل کنند، قابلیت‌های بیشتری به agent بدهند، و نیاز به تعامل از طریق DOM را کمتر کنند.

برای مثال، applicationی برای register کردن کاربر جدید می‌تواند یک WebMCP tool در اختیار AI agent مرورگر بگذارد تا کاربر را مستقیماً بسازد، به‌جای اینکه agent مجبور باشد از یک wizard UI پیچیده با DOM interaction عبور کند.

Angular پشتیبانی آزمایشی برای WebMCP ارائه می‌دهد؛ بنابراین می‌توانید toolهایی را که به lifecycle مربوط به dependency injection در application شما وصل‌اند، به‌سادگی register کنید و Signal Formهای خود را به‌صورت خودکار به toolهای آماده برای AI تبدیل کنید.

IMPORTANT: مشخصات WebMCP هنوز در مرحله بسیار ابتدایی lifecycle خود است و تغییرات مکرر دارد. بنابراین پشتیبانی WebMCP در Angular در حال حاضر [**experimental**](reference/releases#experimental) است. APIها حتی خارج از major versionها هم ممکن است تغییر کنند.

## فراهم کردن tool برای application

از [`provideExperimentalWebMcpTools`](api/core/provideExperimentalWebMcpTools) در application config خود استفاده کنید تا toolها را برای کل lifecycle application register کنید. toolهایی که به این شکل provide می‌شوند، هنگام initialize شدن application به‌صورت خودکار register و هنگام destroy شدن application unregister می‌شوند.

callback مربوط به `execute` در injection context مربوط به `Injector` مرتبط invoke می‌شود؛ یعنی می‌توانید serviceها را مستقیماً [`inject`](api/core/inject) کنید.

```ts {header:"main.ts"}
import {Service, inject, provideExperimentalWebMcpTools} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppRoot} from './app-root';

@Service()
class Greeter {
  sayHello(): string {
    return 'Hello agent!';
  }
}

bootstrapApplication(AppRoot, {
  providers: [
    provideExperimentalWebMcpTools([
      {
        name: 'greet',
        description: 'Greets the agent.',
        inputSchema: {type: 'object', properties: {}},
        execute: () => {
          const greeter = inject(Greeter);

          return {content: [{type: 'text', text: greeter.sayHello()}]};
        },
      },
    ]),
  ],
});
```

### تعریف parameterهای tool

وقتی یک tool به input از AI assistant نیاز دارد، argumentهای مورد انتظار را داخل `inputSchema` با syntax مربوط به [JSON Schema](https://json-schema.org/) تعریف کنید. Angular بر اساس schema definition، type parameterهایی را که به callback مربوط به `execute` پاس داده می‌شوند به‌صورت خودکار infer می‌کند.

```ts {header:"main.ts"}
import {provideExperimentalWebMcpTools} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppRoot} from './app-root';

bootstrapApplication(AppRoot, {
  providers: [
    provideExperimentalWebMcpTools([
      {
        name: 'searchCatalog',
        description: 'Searches the store catalog for products matching a query.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search keywords.',
            },
            maxResults: {
              type: 'number',
              description: 'Maximum number of results to return.',
            },
          },
          required: ['query'],
          additionalProperties: false,
        },
        execute: ({query, maxResults}) => {
          // Type of `query` is inferred as `string`.
          // Type of `maxResults` is inferred as `number | undefined`.

          // Consider validating this at runtime, since inputs may not be validated to match the schema.
          if (typeof query !== 'string') throw new Error(`Bad query: ${query}`);
          if (typeof maxResults !== 'number' && maxResults !== undefined)
            throw new Error(`Bad maxResults: ${maxResults}`);

          const limit = maxResults ?? 5;
          return {
            content: [{type: 'text', text: `Returning up to ${limit} results for "${query}".`}],
          };
        },
      },
    ]),
  ],
});
```

TIP: از `required: ['param1', 'param2', ...]` استفاده کنید تا `undefined` از type آن parameterها حذف شود، و از `additionalProperties: false` استفاده کنید تا type مربوط به argument object فقط به همین parameterها محدود شود.

## فراهم کردن tool برای یک route

هنگام ساخت applicationهای پیچیده، ممکن است بخواهید فقط وقتی کاربر routeهای مشخصی را می‌بیند، toolهای خاصی در دسترس باشند. می‌توانید این کار را با provide کردن مستقیم toolها در route definitionها انجام دهید.

```ts {header:"routes.ts"}
import {provideExperimentalWebMcpTools} from '@angular/core';
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard').then((m) => m.Dashboard),
    providers: [
      provideExperimentalWebMcpTools([
        {
          name: 'exportDashboardReports',
          description: 'Exports the current dashboard analytics.',
          inputSchema: {type: 'object', properties: {}},
          execute: () => ({
            content: [{type: 'text', text: 'Dashboard export successfully triggered.'}],
          }),
        },
      ]),
    ],
  },
];
```

NOTE: هنگام register کردن toolها برای یک route مشخص، بهتر است router را طوری configure کنید که از [`withExperimentalAutoCleanupInjectors`](api/router/withExperimentalAutoCleanupInjectors) استفاده کند تا وقتی کاربر از route خارج می‌شود، toolها به‌صورت خودکار _unregistered_ شوند. بدون این option، WebMCP toolهایی که روی routeها declare شده‌اند حتی بعد از navigation کاربر به route دیگر هم برای AI agentها قابل دسترس باقی می‌مانند.

```ts {header:"app.config.ts"}
import {ApplicationConfig} from '@angular/core';
import {provideRouter, withExperimentalAutoCleanupInjectors} from '@angular/router';
import {routes} from './routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withExperimentalAutoCleanupInjectors())],
};
```

## فراهم کردن tool داخل serviceها

برای use caseهای dynamic، function مربوط به [`declareExperimentalWebMcpTool`](api/core/declareExperimentalWebMcpTool) یک tool را مستقیماً داخل injection context register می‌کند و وقتی آن context destroy شود، به‌صورت خودکار unregister می‌کند.

```ts {header:"counter.ts"}
import {Service, declareExperimentalWebMcpTool, signal, inject} from '@angular/core';

@Service()
export class Counter {
  readonly count = signal(0);

  constructor() {
    declareExperimentalWebMcpTool({
      name: 'getCounter',
      description: 'Reads the global counter.',
      inputSchema: {type: 'object', properties: {}},
      execute: () => ({
        content: [{type: 'text', text: `The count is: ${this.count()}.`}],
      }),
    });
  }
}
```

هرچند `declareExperimentalWebMcpTool` در هر injection contextی کار می‌کند، مراقب [name collisionها](#name-collisions) باشید و ترجیح دهید آن را در root serviceها استفاده کنید.

## toolهای implicit در Signal Forms

می‌توانید با کمترین configuration، از یک [Signal Form](essentials/signal-forms) موجود در Angular یک WebMCP tool به‌صورت implicit بسازید. Angular form modelهای شما را به WebMCP toolهای غنی تبدیل می‌کند و عملاً از formهای بسیار dynamic پشتیبانی می‌کند، بدون اینکه لازم باشد JSON schema یا event handler را دستی بنویسید.

### فعال کردن WebMCP forms feature

ابتدا [`provideExperimentalWebMcpForms`](api/forms/signals/provideExperimentalWebMcpForms) را به root application providerهای خود اضافه کنید:

```ts {header:"main.ts"}
import {bootstrapApplication} from '@angular/platform-browser';
import {provideExperimentalWebMcpForms} from '@angular/forms/signals';
import {AppRoot} from './app-root';

bootstrapApplication(AppRoot, {
  providers: [provideExperimentalWebMcpForms()],
});
```

### Opt in کردن یک Signal Form

دوم، هنگام تعریف Signal Form با [`form`](api/forms/signals/form)، option مربوط به configuration به نام `experimentalWebMcpTool` را پاس دهید تا به یک WebMCP tool implicit opt in کنید. Angular data model فرم شما را inspect می‌کند و به‌صورت خودکار یک JSON schema برای AI agentهای متصل generate می‌کند.

```ts {header:"user-registration.ts"}
import {Component, signal} from '@angular/core';
import {form, required, minLength} from '@angular/forms/signals';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.html',
})
export class UserRegistration {
  private readonly model = signal({
    firstName: '',
    lastName: '',
    age: 0,
    hobbies: ['Web Development'],
  });

  readonly userForm = form(
    this.model,
    (f) => {
      required(f.firstName, {message: 'First name is mandatory.'});
      required(f.lastName, {message: 'Last name is mandatory.'});
    },
    {
      // Implicitly registers a WebMCP tool named `registerUser` with parameters derived from `model`.
      experimentalWebMcpTool: {
        name: 'registerUser',
        description: 'Registers a new user.',
      },
      submission: {
        action: async (formValue) => {
          console.log('Submitting user:', formValue);
          // ...
        },
      },
    },
  );
}
```

در این مثال، Angular یک WebMCP tool با JSON schema تولید می‌کند که:

1. `firstName`، `lastName`، `age` و `hobbies` را به‌عنوان parameterهایی که از initial value مربوط به signal `model` infer شده‌اند شامل می‌شود.
2. بر اساس validator مربوط به [`required`](api/forms/signals/required)، `firstName` و `lastName` را به‌عنوان fieldهای _required_ تعریف می‌کند.
3. `hobbies` را به‌عنوان arrayی از stringها تعریف می‌کند و به agent اجازه می‌دهد هر تعداد hobby دلخواه ارائه کند.

فراتر از infer کردن input schema، Angular همچنین WebMCP tool را به validation logic و submission handler فرم وصل می‌کند. یعنی agent هر validation errorی را که توسط inputهایش trigger شود یا هر failureی را که هنگام submission رخ دهد observe می‌کند؛ بنابراین می‌تواند خود را اصلاح کند و احتمالاً retry انجام دهد.

NOTE: Async validatorها trigger _نمی‌شوند_ و باید توسط submission action مدیریت شوند.

#### Constraintها

Angular schema مربوط به WebMCP را از initial value مربوط به form model شما infer می‌کند. این کار نیاز دارد:

- initial valueهای concrete مثل (`''`، `0`، `false`): Angular نمی‌تواند data typeها را از `null` یا `undefined` infer کند.
- arrayهای non-empty مثل (`['Hello!']`): Angular نمی‌تواند data typeها را از array خالی infer کند و حداقل یک initial value نیاز دارد.

## Best practiceها

best practiceهای زیر را در نظر داشته باشید:

### Name collisionها

WebMCP نیاز دارد هر tool یک name یکتا داشته باشد و اگر یک tool name چند بار register شود error می‌دهد. یعنی صدا زدن `declareExperimentalWebMcpTool` یا `provideExperimentalWebMcpTools` در contextی که ممکن است چند بار register شود، مثل constructor یک component، می‌تواند در runtime باعث error شود.

در صورت امکان، toolها را روی application providerها، route providerها یا root serviceها قرار دهید. هنگام قرار دادن tool روی component، از جمله [toolهای implicit در Signal Forms](#implicit-tools-in-signal-forms)، مطمئن شوید آن component در هر لحظه حداکثر _یک بار_ روی page render می‌شود.

### اعتبارسنجی inputهای tool

Angular هیچ validation ضمنی ارائه نمی‌دهد که inputهای ارائه‌شده توسط agent واقعاً با JSON schema تعریف‌شده match باشند. برای اطمینان از reliability، قبل از استفاده از argumentها در function مربوط به `execute`، بهتر است آن‌ها را صریحاً validate کنید.

### Testing

برای unit test مؤثر toolهای خود، استفاده از یک mock WebMCP implementation مثل [`@mcp-b/webmcp-polyfill`](https://www.npmjs.com/package/@mcp-b/webmcp-polyfill) را در نظر بگیرید.
