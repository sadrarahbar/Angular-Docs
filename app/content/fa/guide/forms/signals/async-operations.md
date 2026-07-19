# Operationهای async

بعضی validationها به data از sourceهای خارجی مثل backend APIها یا serviceهای third-party نیاز دارند. Signal Forms دو function برای asynchronous validation فراهم می‌کند: `validateHttp()` برای validation مبتنی بر HTTP و `validateAsync()` برای validation سفارشی مبتنی بر resource.

## چه زمانی از async validation استفاده کنیم

وقتی validation logic شما به data خارجی نیاز دارد، از async validation استفاده کنید. چند مثال رایج:

- **Uniqueness checkها** - بررسی کنید username یا email از قبل وجود نداشته باشد
- **Database lookupها** - Valueها را با data سمت server بررسی کنید
- **External API validation** - Addressها، tax IDها یا dataهای دیگر را با serviceهای third-party validate کنید
- **Business ruleهای server-side** - Ruleهایی را اعمال کنید که فقط server می‌تواند verify کند

برای checkهایی که می‌توانید به‌صورت synchronous روی client انجام دهید از async validation استفاده نکنید. برای format validation و ruleهای static از synchronous validation ruleهایی مثل `pattern()`، `email()` یا `validate()` استفاده کنید.

## Async validation چطور کار می‌کند

Async validation فقط بعد از pass شدن همه synchronous validationها اجرا می‌شود. هنگام اجرای validation، signal مربوط به `pending()` در field مقدار `true` برمی‌گرداند. Validation می‌تواند errorها را به fieldهای مشخص target کند، و requestهای pending هنگام تغییر field valueها به‌صورت خودکار cancel می‌شوند.

در اینجا مثالی برای بررسی availability مربوط به username می‌بینید:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, validateHttp, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <form>
      <label>
        Username:
        <input [formField]="registrationForm.username" />
      </label>

      @if (registrationForm.username().pending()) {
        <span class="checking">Checking availability...</span>
      }
      @if (registrationForm.username().invalid()) {
        @for (error of registrationForm.username().errors(); track $index) {
          <span class="error">{{ error.message }}</span>
        }
      }
    </form>
  `,
})
export class Registration {
  registrationModel = signal({username: ''});

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateHttp(schemaPath.username, {
      request: ({value}) => {
        const username = value();
        return username ? `/api/users/check?username=${username}` : undefined;
      },
      onSuccess: (response: {available: boolean}) => {
        return response.available
          ? null
          : {
              kind: 'usernameTaken',
              message: 'Username is already taken',
            };
      },
      onError: (error) => {
        console.error('Validation request failed:', error);
        return {
          kind: 'serverError',
          message: 'Could not verify username availability',
        };
      },
    });
  });
}
```

Validation flow این‌طور کار می‌کند:

1. کاربر یک value تایپ می‌کند
2. Synchronous validation ruleها اول اجرا می‌شوند
3. اگر synchronous validation fail شود، async validation اجرا نمی‌شود
4. اگر synchronous validation pass شود، async validation شروع می‌شود و `pending()` مقدار `true` می‌شود
5. Request کامل می‌شود و `pending()` مقدار `false` می‌شود
6. Errorها بر اساس response update می‌شوند

## HTTP validation با validateHttp()

Function مربوط به `validateHttp()` رایج‌ترین شکل async validation را فراهم می‌کند. وقتی لازم دارید در برابر یک REST API یا هر HTTP endpointای validate کنید از آن استفاده کنید.

### Request function

Function مربوط به `request` یا یک URL string برمی‌گرداند یا یک object از نوع `HttpResourceRequest`. برای skip کردن validation، مقدار `undefined` برگردانید:

```ts
import {Component, signal} from '@angular/core';
import {form, validateHttp, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `...`,
})
export class Registration {
  registrationModel = signal({username: ''});

  // Cache usernames that passed validation
  private validatedUsernames = new Set<string>();

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateHttp(schemaPath.username, {
      request: ({value}) => {
        const username = value();
        // Skip HTTP request if already validated
        if (this.validatedUsernames.has(username)) return undefined;

        return `/api/users/check?username=${username}`;
      },
      onSuccess: (response: {available: boolean}, {value}) => {
        if (response.available) {
          // Cache successful validations
          this.validatedUsernames.add(value());
          return null;
        }
        return {
          kind: 'usernameTaken',
          message: 'Username is already taken',
        };
      },
      onError: () => ({
        kind: 'serverError',
        message: 'Could not verify username',
      }),
    });
  });
}
```

برای POST requestها یا headerهای سفارشی، یک object از نوع `HttpResourceRequest` برگردانید:

```ts
request: ({value}) => ({
  url: '/api/validate',
  method: 'POST',
  body: {username: value()},
}) // prettier-ignore
```

### Success و error handlerها

Function مربوط به `onSuccess`، HTTP response را دریافت می‌کند و validation error یا `undefined` برای value معتبر برمی‌گرداند:

```ts
onSuccess: (response: { valid: boolean; message?: string }) => {
  if (response.valid) return undefined;

  return {
    kind: 'invalid',
    message: response.message || 'Validation failed',
  };
} // prettier-ignore
```

وقتی لازم است چند error برگردانید:

```ts
onSuccess: (response: { usernameTaken: boolean; profanity: boolean }) => {
  const errors = [];
  if (response.usernameTaken) {
    errors.push({
      kind: 'usernameTaken',
      message: 'Username taken',
    });
  }
  if (response.profanity) {
    errors.push({
      kind: 'profanity',
      message: 'Username contains inappropriate content',
    });
  }
  return errors.length > 0 ? errors : undefined;
} // prettier-ignore
```

Type مربوط به `onSuccess` را می‌توان یا مستقیم در parameter مشخص کرد، یا با property مربوط به `parse` در `options` مربوط به `validateHttp`:

```ts
onSuccess: (response: { usernameTaken: boolean; profanity: boolean }) => {
  // ...
} // prettier-ignore

// or

options: {
  parse: (response) => response as {usernameTaken: boolean; profanity: boolean};
}
onSuccess: (response) => {
  // ...
} // prettier-ignore
```

Function مربوط به `onError`، request failureهایی مثل network error یا HTTP error را مدیریت می‌کند:

```ts
onError: (error) => {
  console.error('Validation request failed:', error);
  return {
    kind: 'serverError',
    message: 'Could not verify. Please try again later.',
  };
} // prettier-ignore
```

### HTTP optionها

HTTP request را با parameter مربوط به `options` سفارشی کنید:

```ts
import {HttpHeaders} from '@angular/common/http';

validateHttp(schemaPath.field, {
  request: ({value}) => `/api/validate?value=${value()}`,
  options: {
    headers: new HttpHeaders({
      Authorization: 'Bearer token',
    }),
    timeout: 5000,
  },
  onSuccess: (response: {valid: boolean}) =>
    response.valid
      ? null
      : {
          kind: 'invalid',
          message: 'Invalid value',
        },
  onError: () => ({
    kind: 'requestFailed',
    message: 'Unable to reach server to validate.',
  }),
});
```

TIP: برای همه optionهای در دسترس، [مستندات API مربوط به httpResource](api/common/http/httpResource) را ببینید.

## Custom async validation با validateAsync()

بیشتر applicationها باید برای async validation از `validateHttp()` استفاده کنند. این function HTTP requestها را با configuration حداقلی مدیریت می‌کند و بیشتر use caseها را پوشش می‌دهد.

`validateAsync()` یک API سطح پایین‌تر است که resource primitive مربوط به Angular را مستقیم expose می‌کند. کنترل کامل می‌دهد اما به کد بیشتر و آشنایی با resource API مربوط به Angular نیاز دارد.

فقط وقتی `validateHttp()` نیاز شما را برآورده نمی‌کند، `validateAsync()` را در نظر بگیرید. چند نمونه:

- **Validation غیر HTTP** - WebSocket connectionها، IndexedDB lookupها یا Web Worker computationها
- **Custom caching strategyها** - Caching مخصوص application فراتر از memoization ساده
- **Retry logic پیچیده** - Strategyهای backoff سفارشی یا retryهای شرطی
- **دسترسی مستقیم به resource** - وقتی به lifecycle کامل resource نیاز دارید

### ساخت یک custom validation rule

Function مربوط به `validateAsync()` به چهار property نیاز دارد: `params`، `factory`، `onSuccess` و `onError`. Function مربوط به `params` parameterهای resource شما را برمی‌گرداند، در حالی که `factory` resource را می‌سازد:

```ts
import {Component, inject, signal, resource, Signal} from '@angular/core';
import {form, validateAsync, FormField} from '@angular/forms/signals';
import {UsernameValidator} from './username-validator';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `...`,
})
export class Registration {
  registrationModel = signal({username: ''});

  private usernameValidator = inject(UsernameValidator);
  private cache = new Map<string, {available: boolean}>();

  // Custom resource factory with caching
  createUsernameResource = (usernameSignal: Signal<string | undefined>) => {
    return resource({
      params: () => usernameSignal(),
      loader: async ({params: username}) => {
        if (!username) return undefined;

        // Check cache first
        const cached = this.cache.get(username);
        if (cached !== undefined) return cached;

        // Use injected service for validation
        const result = await this.usernameValidator.checkAvailability(username);

        // Cache result
        this.cache.set(username, result);
        return result;
      },
    });
  };

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateAsync(schemaPath.username, {
      params: ({value}) => {
        const username = value();
        return username.length >= 3 ? username : undefined!;
      },
      factory: this.createUsernameResource,
      onSuccess: (result) => {
        return result?.available
          ? null
          : {
              kind: 'usernameTaken',
              message: 'Username taken',
            };
      },
      onError: (error) => {
        console.error('Validation failed:', error);
        return {
          kind: 'serverError',
          message: 'Could not verify username',
        };
      },
    });
  });
}
```

Function مربوط به `params` روی هر value change اجرا می‌شود. برای skip کردن validation مقدار `undefined` برگردانید. Function مربوط به `factory` هنگام setup یک بار اجرا می‌شود و params را به‌عنوان signal دریافت می‌کند. Resource هنگام تغییر params به‌صورت خودکار update می‌شود.

### استفاده از serviceهای Observable-based

اگر application شما serviceهای موجودی دارد که Observable برمی‌گردانند، از `rxResource` از `@angular/core/rxjs-interop` استفاده کنید:

```ts
import {Component, inject, signal, Signal} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {form, validateAsync, FormField} from '@angular/forms/signals';
import {UsernameService} from './username-service';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `...`,
})
export class Registration {
  registrationModel = signal({username: ''});

  private usernameService = inject(UsernameService);

  private createUsernameResource = (usernameSignal: Signal<string | undefined>) => {
    return rxResource({
      params: () => usernameSignal(),
      stream: ({params: username}) => this.usernameService.checkUsername(username),
    });
  };

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateAsync(schemaPath.username, {
      params: ({value}) => value(),
      factory: this.createUsernameResource,
      onSuccess: (result) =>
        result?.available ? null : {kind: 'usernameTaken', message: 'Username taken'},
      onError: () => ({
        kind: 'serverError',
        message: 'Could not verify username',
      }),
    });
  });
}
```

Function مربوط به `rxResource` مستقیم با Observableها کار می‌کند و وقتی field value تغییر کند، subscription cleanup را به‌صورت خودکار مدیریت می‌کند.

## Debouncing

Rule مربوط به `debounce` زمان commit شدن input کاربر به form model را delay می‌دهد. می‌توانید آن را این‌طور تصور کنید که rule، valueها را نگه می‌دارد تا کاربر تایپ را متوقف کند. این وقتی مفید است که رفتارهای downstream نباید به هر keystroke واکنش نشان دهند؛ مثل derived computationهای گران‌هزینه، validationای که وسط کلمه errorها را flash می‌کند، یا search filterهایی که روی هر character دوباره اعمال می‌شوند.

Rule مربوط به `debounce` را داخل schema اضافه کنید تا delay بدهید که UI changeهای یک form field چطور به form model برسند. در ساده‌ترین شکل، `debounce(path, ms)` هر UI change را به تعداد millisecond مشخص نگه می‌دارد و بعد در model می‌نویسد. Change جدید در همان بازه timer را reset می‌کند.

مثال زیر `debounce` و `validateHttp` را روی username field اعمال می‌کند تا بررسی availability مربوط به username در registration form تا زمان مکث کاربر در تایپ delay شود:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, debounce, validateHttp, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <label>
      Username:
      <input [formField]="registrationForm.username" />
    </label>

    @if (registrationForm.username().pending()) {
      <span class="checking">Checking availability...</span>
    }
  `,
})
export class Registration {
  registrationModel = signal({username: ''});

  registrationForm = form(this.registrationModel, (schemaPath) => {
    // Hold UI updates for 300 ms before writing to the model
    debounce(schemaPath.username, 300);

    // Runs against the debounced model value, not every keystroke
    validateHttp(schemaPath.username, {
      request: ({value}) => {
        const username = value();
        // Skip the request for blank values
        return username ? `/api/users/check?username=${username}` : undefined;
      },
      onSuccess: (response: {available: boolean}) =>
        response.available ? null : {kind: 'usernameTaken', message: 'Username is already taken'},
      onError: () => ({
        kind: 'serverError',
        message: 'Could not verify username availability',
      }),
    });
  });
}
```

با debounce برابر 300 ms، model فقط بعد از اینکه کاربر بیشتر از duration تنظیم‌شده مکث کند update و validate می‌شود. برای مثال، تایپ سریع "signal forms" به‌جای دوازده validation request، یک request validation ایجاد می‌کند.

### Touch، model را flush می‌کند

صرف‌نظر از debounce duration، framework وقتی field touched شود، `controlValue()` مربوط به field را بلافاصله در model می‌نویسد. Native inputها روی blur touched می‌شوند، پس کاربری که تایپش را تمام می‌کند و tab می‌زند لازم نیست منتظر تمام شدن debounce timer بماند. Custom controlها می‌توانند field را در واکنش به هر eventای که انتخاب می‌کنند touched علامت‌گذاری کنند.

در حالت معمول، این موضوع برای form submission مهم است. وقتی کاربر روی submit button کلیک می‌کند، input دارای focus blur می‌شود، و همین آن field را touched می‌کند و debounce pending آن را قبل از اجرای submission handler flush می‌کند.

### Commit فقط روی blur

بعضی fieldها اصلا نباید وسط تایپ update شوند، و در عوض فقط باید بعد از تمام شدن ورود value توسط کاربر update شوند. برای مثال، اگر search filter دارید که روی هر change دوباره اعمال می‌شود یا formای دارید که derived state گران‌هزینه trigger می‌کند، اغلب بهتر است model تا پایان تایپ کاربر صبر کند.

در این سناریوها، به‌جای duration، مقدار `'blur'` پاس بدهید تا همه updateها تا زمانی که field touched شود defer شوند:

```ts
form(this.registrationModel, (schemaPath) => {
  debounce(schemaPath.username, 'blur');
});
```

با `'blur'`، model هنگام تایپ کاربر value قبلی خود را نگه می‌دارد. Sync و async validation، derived signalها، و هر reactive ruleای که field را می‌خواند تا زمانی که field touched شود value قبلی را می‌بینند. این معمولا وقتی رخ می‌دهد که کاربر یک native input را blur کند، یا custom control به روش خودش touch را signal کند.

### Custom timing logic

برای timing logicای که یک duration یا `'blur'` نمی‌تواند بیان کند، یک function از نوع `Debouncer` پاس بدهید. این function، field context و یک [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) دریافت می‌کند و یک `Promise<void>` برمی‌گرداند که وقتی model باید update شود resolve می‌شود:

```ts
import {debounce, type Debouncer} from '@angular/forms/signals';

const shorterWhenLonger: Debouncer<string> = ({value}, abortSignal) => {
  // Shorter queries get a longer delay since the user is likely still typing.
  const ms = value().length < 3 ? 500 : 200;
  return new Promise((resolve) => {
    const timeoutId = setTimeout(resolve, ms);
    // Abort fires when this field is touched or its value changes, so the pending timer is cleared
    abortSignal.addEventListener(
      'abort',
      () => {
        clearTimeout(timeoutId);
        resolve();
      },
      {once: true},
    );
  });
};

const registrationForm = form(registrationModel, (schemaPath) => {
  debounce(schemaPath.username, shorterWhenLonger);
});
```

`abortSignal` وقتی field touched شود، یا وقتی value آن قبل از resolve شدن debounce تغییر کند fire می‌شود. Promise را روی abort resolve کنید تا debouncer شما timerهای pending را آزاد کند. Framework مقدار pending را هنگام touch در model می‌نویسد، و وقتی value جدیدتر برسد آن را discard می‌کند. برای signature کامل `Debouncer`، [`debounce` API reference](api/forms/signals/debounce) را ببینید.

### Debounce کردن یک async validator

Rule مربوط به `debounce` هر واکنش به field را عقب می‌اندازد؛ از sync validation تا derived signalها و async validation. اما گاهی برعکسش را می‌خواهید: validatorهای sync ارزان مثل `required` یا `email` برای feedback فوری بلافاصله اجرا شوند، اما فقط async call گران‌هزینه صبر کند تا کاربر مکث کند. هم `validateHttp()` و هم `validateAsync()` option مربوط به [`debounce`](api/forms/signals/validateAsync) خودشان را می‌پذیرند که فقط همان validator را throttle می‌کند:

```ts
form(this.registrationModel, (schemaPath) => {
  validateHttp(schemaPath.username, {
    // Throttles only this HTTP call
    debounce: 300,
    request: ({value}) => {
      const username = value();
      // Skip the request for blank values
      return username ? `/api/users/check?username=${username}` : undefined;
    },
    onSuccess: (response: {available: boolean}) =>
      response.available ? null : {kind: 'usernameTaken', message: 'Username is already taken'},
    onError: () => ({
      kind: 'serverError',
      message: 'Could not verify username availability',
    }),
  });
});
```

Model همچنان روی هر keystroke update می‌شود، و هر rule دیگری که به field attach شده همچنان بلافاصله واکنش نشان می‌دهد. فقط HTTP request debounce می‌شود: هر change، 300 ms سکوت را قبل از fire شدن منتظر می‌ماند، پس request فقط وقتی ارسال می‌شود که کاربر تایپ را متوقف کرده باشد.

بر اساس scope بین دو لایه انتخاب کنید:

| Option                                                        | When to use                                                                                                               |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Rule مربوط به `debounce()`                                   | Sync validation، derived state و submission همه باید تا commit شدن field صبر کنند. کل field نباید وسط تایپ واکنش دهد.    |
| `validateHttp({ debounce })` یا `validateAsync({ debounce })` | Validatorهای sync ارزان باید feedback فوری بدهند، اما async callهای گران باید منتظر مکث کاربر بمانند.                  |

هر دو option یک duration بر حسب millisecond می‌پذیرند. Callbackهای custom-timing آن‌ها متفاوت‌اند: rule در سطح form یک `Debouncer` می‌گیرد، و option در سطح validator یک `DebounceTimer` از `@angular/core` می‌گیرد. این دو signature قابل جایگزینی با هم نیستند.

## Compose کردن resourceها در async validation با factory

Option built-in مربوط به [`debounce`](api/forms/signals/validateAsync) throttling را پوشش می‌دهد، اما `validateAsync()` یک composition point عمیق‌تر expose می‌کند: function مربوط به `factory`. Factory، params را به‌عنوان signal دریافت می‌کند و resource برمی‌گرداند. بین این دو نقطه، آزادید هر چیزی را که نیاز دارید compose کنید.

در ساده‌ترین شکل، factory یک resource واحد را wrap می‌کند. Check مربوط به username availability می‌تواند به‌عنوان method روی component class زندگی کند و سپس با reference به `validateAsync` وصل شود:

```ts
export class Registration {
  registrationModel = signal({username: ''});
  private usernameValidator = inject(UsernameValidator);

  // Factory function
  checkUsernameAvailable = (username: Signal<string | undefined>) =>
    resource({
      params: () => username(),
      loader: async ({params: name}) => this.usernameValidator.checkAvailability(name),
    });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateAsync(schemaPath.username, {
      params: ({value}) => {
        const username = value();
        // Skip validation for short usernames
        return username.length >= 3 ? username : undefined!;
      },
      debounce: 300,
      // Reference to the factory defined above
      factory: this.checkUsernameAvailable,
      onSuccess: (result) =>
        result?.available ? null : {kind: 'usernameTaken', message: 'Username taken'},
      onError: () => ({kind: 'serverError', message: 'Could not verify'}),
    });
  });
}
```

Callback مربوط به `params` برای usernameهای کوتاه `undefined` برمی‌گرداند و signal می‌دهد که validation باید skip شود. با اعمال `debounce: 300`، resource صبر می‌کند تا کاربر برای 300 ms تایپ را متوقف کند و بعد روی هر change عمل می‌کند. سپس loader را برای usernameهای معتبر اجرا می‌کند و وقتی debounced value به `undefined` برسد idle می‌ماند.

### ترکیب debounce با logic اضافه

وقتی به logic فراتر از duration debounce ساده نیاز دارید، از custom factory استفاده کنید تا debouncing را با آن logic ترکیب کنید. یک مورد رایج، cache کردن responseهای validateشده است. مثلا وقتی server یک username را confirm کرد، لازم نیست در keystrokeهای بعدی که دوباره به همان value برمی‌گردند آن را دوباره بپرسید.

```ts
export class Registration {
  registrationModel = signal({username: ''});
  private usernameValidator = inject(UsernameValidator);

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateAsync(schemaPath.username, {
      params: ({value}) => {
        const username = value();
        return username.length >= 3 ? username : undefined;
      },
      factory: (username) => {
        // Core primitive: settles 300 ms after the source stops changing
        const debouncedUsername = debounced(username, 300);
        // Cache lives in the factory's closure and persists for the field's lifetime
        const cache = new Map<string, {available: boolean}>();
        return resource({
          // Read from the debounced signal, not the raw one
          params: () => debouncedUsername.value(),
          loader: async ({params: name}) => {
            const cached = cache.get(name);
            if (cached) return cached;

            const result = await this.usernameValidator.checkAvailability(name);
            cache.set(name, result);
            return result;
          },
        });
      },
      onSuccess: (result) =>
        result?.available ? null : {kind: 'usernameTaken', message: 'Username taken'},
      onError: () => ({
        kind: 'serverError',
        message: 'Could not verify username',
      }),
    });
  });
}
```

`cache` داخل closure مربوط به factory زندگی می‌کند، بنابراین در طول عمر field persist می‌شود. وقتی کاربر usernameای را تایپ کند که server قبلا بررسی کرده، loader به‌جای ساخت network request جدید از cache می‌خواند.

## درک pending state

وقتی async validation اجرا می‌شود، signal مربوط به `pending()` در field مقدار `true` برمی‌گرداند. در این مدت:

- `valid()` مقدار `false` برمی‌گرداند
- `invalid()` مقدار `false` برمی‌گرداند
- `errors()` یک array خالی برمی‌گرداند
- `submit()` منتظر کامل شدن validation می‌ماند

Pending state را در template خود نشان دهید تا feedback فراهم کنید:

```angular-html
<input [formField]="loginForm.username" />

@if (loginForm.username().pending()) {
  <span class="loading">Checking availability...</span>
}

@if (loginForm.username().touched() && loginForm.username().invalid()) {
  @for (error of loginForm.username().errors(); track $index) {
    <span class="error">{{ error.message }}</span>
  }
}
```

Form submission را هنگام pending بودن validation disable کنید:

```angular-html
<button type="submit" [disabled]="loginForm().pending()">
  @if (loginForm().pending()) {
    Validating...
  } @else {
    Submit
  }
</button>
```

TIP: برای patternهای بیشتر با signalهای `pending()`، `valid()` و `invalid()`، [راهنمای Field State Management](guide/forms/signals/field-state-management) را ببینید.

### ترتیب اجرای Validation

Async validation فقط بعد از pass شدن synchronous validation اجرا می‌شود. این از server requestهای غیرضروری برای input نامعتبر جلوگیری می‌کند:

```ts
import {form, required, minLength, validateHttp} from '@angular/forms/signals';

form(model, (schemaPath) => {
  // 1. These synchronous validation rules run first
  required(schemaPath.username);
  minLength(schemaPath.username, 3);

  // 2. This async validation rule only runs if synchronous validation passes
  validateHttp(schemaPath.username, {
    request: ({value}) => `/api/check?username=${value()}`,
    onSuccess: (result: {valid: boolean}) =>
      result.valid
        ? null
        : {
            kind: 'usernameTaken',
            message: 'Username taken',
          },
    onError: () => ({
      kind: 'serverError',
      message: 'Validation failed',
    }),
  });
});
```

این ترتیب اجرا با کاهش server load و گرفتن فوری format errorها، performance را بهتر می‌کند.

### Request cancellation

وقتی field value تغییر کند، Signal Forms هر async validation request pending برای آن field را به‌صورت خودکار cancel می‌کند. این از race condition جلوگیری می‌کند و مطمئن می‌شود validation همیشه value فعلی را منعکس می‌کند. لازم نیست cancellation logic را خودتان پیاده‌سازی کنید.

## Best practiceها

### با synchronous validation ترکیب کنید

همیشه قبل از ساخت async request، format را validate کنید. این کار errorها را فوری می‌گیرد و از server requestهای غیرضروری جلوگیری می‌کند:

```ts
import {form, required, email, validateHttp} from '@angular/forms/signals';

form(model, (schemaPath) => {
  // Validate format first
  required(schemaPath.email);
  email(schemaPath.email);

  // Then check availability
  validateHttp(schemaPath.email, {
    request: ({value}) => `/api/emails/check?email=${value()}`,
    onSuccess: (result: {available: boolean}) =>
      result.available
        ? null
        : {
            kind: 'emailInUse',
            message: 'Email already in use',
          },
    onError: () => ({
      kind: 'serverError',
      message: 'Could not verify email',
    }),
  });
});
```

### وقتی مناسب است validation را skip کنید

برای skip کردن validation از function مربوط به `request` مقدار `undefined` برگردانید. از این برای جلوگیری از validate کردن fieldهای خالی یا valueهایی که حداقل requirementها را ندارند استفاده کنید:

```ts
import {validateHttp} from '@angular/forms/signals';

validateHttp(schemaPath.username, {
  request: ({value}) => {
    const username = value();
    // Skip validation for empty or short usernames
    if (!username || username.length < 3) return undefined;

    return `/api/users/check?username=${username}`;
  },
  onSuccess: (result: {valid: boolean}) =>
    result.valid
      ? null
      : {
          kind: 'usernameTaken',
          message: 'Username taken',
        },
  onError: () => ({
    kind: 'serverError',
    message: 'Validation failed',
  }),
});
```

### Errorها را graceful مدیریت کنید

Error messageهای روشن و user-friendly فراهم کنید. Detailهای technical را برای debugging log کنید اما messageهای ساده به کاربران نشان دهید:

```ts
import {validateHttp} from '@angular/forms/signals';

validateHttp(schemaPath.field, {
  request: ({value}) => `/api/validate?field=${value()}`,
  onSuccess: (result: {valid: boolean; message?: string}) => {
    if (result.valid) return null;
    // Use server message when available
    return {
      kind: 'serverError',
      message: result.message || 'Validation failed',
    };
  },
  onError: (error) => {
    // Log for debugging
    console.error('Validation request failed:', error);

    // Show user-friendly message
    return {
      kind: 'serverError',
      message: 'Unable to validate. Please try again later.',
    };
  },
});
```

### Feedback روشن نشان دهید

از signal مربوط به `pending()` استفاده کنید تا نشان دهید validation در حال انجام است. این به کاربران کمک می‌کند delayها را بفهمند و perceived performance بهتری فراهم می‌کند:

```angular-html
@if (field().pending()) {
  <span class="checking">
    <span class="spinner"></span>
    Checking...
  </span>
}
@if (field().valid() && !field().pending()) {
  <span class="success">Available</span>
}
@if (field().invalid()) {
  <span class="error">{{ field().errors()[0]?.message }}</span>
}
```

## قدم بعدی

این راهنما async validation با `validateHttp()` و `validateAsync()` را پوشش داد. راهنماهای مرتبط جنبه‌های دیگر Signal Forms را بررسی می‌کنند:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/validation" title="Validation"/>
  <docs-pill href="guide/forms/signals/field-state-management" title="Field State Management"/>
</docs-pill-row>

برای API documentation دقیق، ببینید:

- [`validateHttp()`](api/forms/signals/validateHttp) - Async validation مبتنی بر HTTP
- [`validateAsync()`](api/forms/signals/validateAsync) - Async validation سفارشی مبتنی بر resource
- [`httpResource()`](api/common/http/httpResource) - HTTP resource API مربوط به Angular
- [`resource()`](api/core/resource) - Resource primitive مربوط به Angular
