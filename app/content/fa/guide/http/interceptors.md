# Interceptorها

`HttpClient` از شکلی از middleware پشتیبانی می‌کند که با نام _interceptors_ شناخته می‌شود.

TLDR: Interceptorها middlewareهایی هستند که اجازه می‌دهند الگوهای رایج مربوط به retry، caching، logging و authentication از requestهای جداگانه جدا و abstract شوند.

`HttpClient` از دو نوع interceptor پشتیبانی می‌کند: functional و مبتنی بر DI. پیشنهاد ما استفاده از functional interceptorهاست، چون رفتار قابل پیش‌بینی‌تری دارند، مخصوصا در setupهای پیچیده. مثال‌های این راهنما از functional interceptorها استفاده می‌کنند و [DI-based interceptors](#di-based-interceptors) را در بخش جداگانه‌ای در انتها پوشش می‌دهیم.

## Interceptorها

Interceptorها عموما functionهایی هستند که می‌توانید برای هر request اجرا کنید و قابلیت‌های گسترده‌ای برای اثر گذاشتن روی محتوای request/response و جریان کلی آن‌ها دارند. می‌توانید چند interceptor نصب کنید که یک interceptor chain می‌سازند؛ جایی که هر interceptor قبل از forward کردن request یا response به interceptor بعدی در chain، آن را پردازش می‌کند.

می‌توانید از interceptorها برای پیاده‌سازی الگوهای رایج زیادی استفاده کنید، مثل:

- اضافه کردن authentication headerها به requestهای خروجی برای یک API مشخص.
- retry کردن requestهای شکست‌خورده با exponential backoff.
- cache کردن responseها برای مدت مشخص، یا تا زمانی که با mutationها invalid شوند.
- customize کردن parse شدن responseها.
- اندازه‌گیری زمان response سرور و log کردن آن.
- هدایت elementهای UI مثل loading spinner هنگام انجام network operationها.
- جمع‌آوری و batch کردن requestهایی که در یک بازه‌ی زمانی مشخص ساخته می‌شوند.
- fail کردن خودکار requestها بعد از deadline یا timeout قابل پیکربندی.
- polling منظم سرور و refresh کردن نتیجه‌ها.

## تعریف interceptor

شکل پایه‌ی یک interceptor، functionای است که `HttpRequest` خروجی و یک function به نام `next` را دریافت می‌کند؛ `next` مرحله‌ی پردازش بعدی در interceptor chain را نمایش می‌دهد.

برای مثال، این `loggingInterceptor` قبل از forward کردن request، URL خروجی request را در `console.log` ثبت می‌کند:

```ts
export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  console.log(req.url);
  return next(req);
}
```

برای اینکه این interceptor واقعا requestها را intercept کند، باید `HttpClient` را برای استفاده از آن پیکربندی کنید.

## پیکربندی interceptorها

مجموعه interceptorهایی را که باید استفاده شوند هنگام پیکربندی `HttpClient` از طریق dependency injection و با feature مربوط به `withInterceptors` declare می‌کنید:

```ts
bootstrapApplication(App, {
  providers: [provideHttpClient(withInterceptors([loggingInterceptor, cachingInterceptor]))],
});
```

interceptorهایی که پیکربندی می‌کنید به همان ترتیبی که در providers فهرست کرده‌اید chain می‌شوند. در مثال بالا، `loggingInterceptor` request را پردازش می‌کند و سپس آن را به `cachingInterceptor` forward می‌کند.

### Intercept کردن response eventها

یک interceptor می‌تواند stream مربوط به `Observable` از `HttpEvent`ها را که توسط `next` برگردانده می‌شود transform کند تا به response دسترسی داشته باشد یا آن را manipulate کند. چون این stream همه‌ی response eventها را شامل می‌شود، ممکن است لازم باشد `.type` هر event را بررسی کنید تا response object نهایی را تشخیص دهید.

```ts
export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) {
        console.log(req.url, 'returned a response with status', event.status);
      }
    }),
  );
}
```

TIP: Interceptorها به‌صورت طبیعی responseها را با requestهای خروجی‌شان مرتبط می‌کنند، چون response stream را در closureای transform می‌کنند که request object را capture کرده است.

## تغییر دادن requestها

بیشتر جنبه‌های instanceهای `HttpRequest` و `HttpResponse` _immutable_ هستند و interceptorها نمی‌توانند مستقیم آن‌ها را تغییر دهند. در عوض، interceptorها mutationها را با clone کردن این objectها از طریق operation مربوط به `.clone()` اعمال می‌کنند و مشخص می‌کنند کدام propertyها باید در instance جدید تغییر کنند. این ممکن است شامل updateهای immutable روی خود مقدار هم باشد، مثل `HttpHeaders` یا `HttpParams`.

برای مثال، برای اضافه کردن header به request:

```ts
const reqWithHeader = req.clone({
  headers: req.headers.set('X-New-Header', 'new header value'),
});
```

این immutability اجازه می‌دهد بیشتر interceptorها idempotent باشند اگر همان `HttpRequest` چند بار به interceptor chain ارسال شود. این ممکن است به چند دلیل اتفاق بیفتد، از جمله وقتی request بعد از شکست retry می‌شود.

CRITICAL: بدنه‌ی request یا response در برابر deep mutation محافظت نمی‌شود. اگر interceptor باید body را mutate کند، مراقب باشید اجرای چندباره روی همان request را درست مدیریت کنید.

## Dependency injection در interceptorها

Interceptorها در _injection context_ مربوط به injectori اجرا می‌شوند که آن‌ها را register کرده است، و می‌توانند از API مربوط به [`inject`](/api/core/inject) در Angular برای دریافت dependencyها استفاده کنند.

برای مثال، فرض کنید application یک service به نام `AuthService` دارد که authentication tokenها را برای requestهای خروجی می‌سازد. یک interceptor می‌تواند این service را inject و استفاده کند:

```ts
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const authToken = inject(AuthService).getAuthToken();

  // Clone the request to add the authentication header.
  const newReq = req.clone({
    headers: req.headers.append('X-Authentication-Token', authToken),
  });
  return next(newReq);
}
```

## Metadata مربوط به request و response

اغلب مفید است اطلاعاتی را داخل request قرار دهید که به backend ارسال نمی‌شود، بلکه مشخصا برای interceptorهاست. `HttpRequest`ها objectای به نام `.context` دارند که این نوع metadata را به‌عنوان instanceای از `HttpContext` ذخیره می‌کند. این object مثل یک typed map کار می‌کند، با keyهایی از نوع `HttpContextToken`.

برای نشان دادن کارکرد این سیستم، از metadata استفاده می‌کنیم تا کنترل کنیم caching interceptor برای یک request مشخص فعال باشد یا نه.

### تعریف context tokenها

برای ذخیره اینکه caching interceptor باید request مشخصی را در map مربوط به `.context` همان request cache کند یا نه، یک `HttpContextToken` جدید تعریف کنید تا به‌عنوان key عمل کند:

```ts
export const CACHING_ENABLED = new HttpContextToken<boolean>(() => true);
```

function ارائه‌شده مقدار پیش‌فرض token را برای requestهایی می‌سازد که صراحتا مقداری برای آن set نکرده‌اند. استفاده از function تضمین می‌کند اگر مقدار token یک object یا array باشد، هر request instance خودش را بگیرد.

### خواندن token در interceptor

سپس interceptor می‌تواند token را بخواند و بر اساس مقدار آن تصمیم بگیرد caching logic را اعمال کند یا نه:

```ts
export function cachingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (req.context.get(CACHING_ENABLED)) {
    // apply caching logic
    return ...;
  } else {
    // caching has been disabled for this request
    return next(req);
  }
}
```

### تنظیم context tokenها هنگام ساخت request

هنگام ساخت request از طریق API مربوط به `HttpClient`، می‌توانید برای `HttpContextToken`ها مقدار فراهم کنید:

```ts
const data$ = http.get('/sensitive/data', {
  context: new HttpContext().set(CACHING_ENABLED, false),
});
```

Interceptorها می‌توانند این مقدارها را از `HttpContext` مربوط به request بخوانند.

### Request context mutable است

برخلاف propertyهای دیگر `HttpRequest`، `HttpContext` مرتبط با آن _mutable_ است. اگر interceptor context یک request را تغییر دهد و آن request بعدا retry شود، همان interceptor هنگام اجرای دوباره mutation مربوط به context را می‌بیند. این برای پاس دادن state در چند retry، در صورت نیاز، مفید است.

## Responseهای synthetic

بیشتر interceptorها فقط handler مربوط به `next` را invoke می‌کنند و request یا response را transform می‌کنند، اما این یک الزام strict نیست. این بخش چند راه را بررسی می‌کند که interceptor می‌تواند رفتار پیشرفته‌تری داشته باشد.

Interceptorها مجبور نیستند `next` را invoke کنند. به‌جای آن می‌توانند responseها را از طریق مکانیزم دیگری بسازند، مثل cache یا ارسال request از مسیر جایگزین.

ساخت response با constructor مربوط به `HttpResponse` ممکن است:

```ts
const resp = new HttpResponse({
  body: 'response body',
});
```

## کار با اطلاعات redirect

وقتی `HttpClient` از fetch backend استفاده می‌کند، responseها propertyای به نام `redirected` دارند که نشان می‌دهد response نتیجه‌ی redirect بوده یا نه. این property با specification بومی Fetch API هم‌راستا است و می‌تواند در interceptorها برای مدیریت سناریوهای redirect مفید باشد.

یک interceptor می‌تواند به اطلاعات redirect دسترسی پیدا کند و بر اساس آن عمل کند:

```ts
export function redirectTrackingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response && event.redirected) {
        console.log('Request to', req.url, 'was redirected to', event.url);
        // Handle redirect logic - maybe update analytics, security checks, etc.
      }
    }),
  );
}
```

می‌توانید از redirect information برای پیاده‌سازی conditional logic در interceptorهای خود هم استفاده کنید:

```ts
export function authRedirectInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response && event.redirected) {
        // Check if we were redirected to a login page
        if (event.url?.includes('/login')) {
          // Handle authentication redirect
          handleAuthRedirect();
        }
      }
    }),
  );
}
```

## کار با response typeها

وقتی `HttpClient` از fetch backend استفاده می‌کند، responseها propertyای به نام `type` دارند که نشان می‌دهد مرورگر بر اساس CORS policyها و request mode چطور response را مدیریت کرده است. این property با specification بومی Fetch API هم‌راستاست و insight ارزشمندی برای debug کردن مشکل‌های CORS و فهم accessibility مربوط به response فراهم می‌کند.

property مربوط به response `type` می‌تواند مقدارهای زیر را داشته باشد:

- `'basic'` - response از همان origin با دسترسی به همه‌ی headerها
- `'cors'` - response از origin دیگر با CORS headerهای درست پیکربندی‌شده
- `'opaque'` - response از origin دیگر بدون CORS؛ headerها و body ممکن است محدود باشند
- `'opaqueredirect'` - response از request redirectشده در no-cors mode
- `'error'` - network error رخ داده است

یک interceptor می‌تواند از اطلاعات response type برای CORS debugging و error handling استفاده کند:

```ts
export function responseTypeInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    map((event) => {
      if (event.type === HttpEventType.Response) {
        // Handle different response types appropriately
        switch (event.responseType) {
          case 'opaque':
            // Limited access to response data
            console.warn('Limited response data due to CORS policy');
            break;
          case 'cors':
          case 'basic':
            // Full access to response data
            break;
          case 'error':
            // Handle network errors
            console.error('Network error in response');
            break;
        }
      }
    }),
  );
}
```

## DI-based interceptors

`HttpClient` از interceptorهایی هم پشتیبانی می‌کند که به‌عنوان injectable class تعریف می‌شوند و از طریق سیستم DI پیکربندی می‌شوند. قابلیت‌های DI-based interceptorها با functional interceptorها یکسان است، اما مکانیزم configuration متفاوت است.

یک DI-based interceptor یک injectable class است که interface مربوط به `HttpInterceptor` را پیاده‌سازی می‌کند:

```ts
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Request URL: ' + req.url);
    return handler.handle(req);
  }
}
```

DI-based interceptorها از طریق یک dependency injection multi-provider پیکربندی می‌شوند:

```ts
bootstrapApplication(App, {
  providers: [
    provideHttpClient(
      // DI-based interceptors must be explicitly enabled.
      withInterceptorsFromDi(),
    ),

    {provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true},
  ],
});
```

DI-based interceptorها به ترتیبی اجرا می‌شوند که providerهایشان register شده‌اند. در appای با DI configuration گسترده و hierarchical، پیش‌بینی این ترتیب می‌تواند بسیار سخت باشد.
