# Test requests

مثل هر dependency خارجی دیگر، باید HTTP backend را mock کنید تا testهای شما بتوانند تعامل با server remote را شبیه‌سازی کنند. library مربوط به `@angular/common/http/testing` ابزارهایی فراهم می‌کند تا requestهای ساخته‌شده توسط application را capture کنید، درباره‌ی آن‌ها assertion بنویسید و responseها را mock کنید تا رفتار backend شما emulate شود.

testing library برای الگویی طراحی شده که در آن app ابتدا code را اجرا می‌کند و request می‌سازد. سپس test انتظار دارد requestهای مشخصی ساخته شده یا نشده باشند، روی آن requestها assertion انجام می‌دهد و در نهایت با "flushing" هر request مورد انتظار، response فراهم می‌کند.

در پایان، testها می‌توانند verify کنند که app هیچ request غیرمنتظره‌ای نساخته است.

## Setup برای testing

برای شروع test کردن استفاده از `HttpClient`، `TestBed` را پیکربندی کنید و `provideHttpClientTesting()` را در setup مربوط به test قرار دهید. `HttpClient` توسط test environment مربوط به Angular فراهم می‌شود، و `provideHttpClientTesting()` آن را طوری پیکربندی می‌کند که به‌جای network واقعی از test backend استفاده کند. این همچنین `HttpTestingController` را فراهم می‌کند؛ چیزی که برای تعامل با test backend، set کردن expectation درباره‌ی requestهای ساخته‌شده و flush کردن response برای آن requestها استفاده می‌کنید. بعد از configuration، `HttpTestingController` را می‌توان از `TestBed` inject کرد.

```ts
TestBed.configureTestingModule({
  providers: [
    // ... other test providers
    provideHttpClientTesting(),
  ],
});

const httpTesting = TestBed.inject(HttpTestingController);
```

حالا وقتی testهای شما request می‌سازند، به‌جای backend عادی به testing backend می‌خورند. می‌توانید از `httpTesting` برای assertion روی آن requestها استفاده کنید.

### پیکربندی `HttpClient` در testها

اگر یک test لازم دارد featureهای `HttpClient` مثل interceptorها را پیکربندی کند، `provideHttpClient(...)` را قبل از `provideHttpClientTesting()` اضافه کنید.
IMPORTANT: به خاطر داشته باشید `provideHttpClient()` را **قبل از** `provideHttpClientTesting()` فراهم کنید، چون `provideHttpClientTesting()` بخش‌هایی از `provideHttpClient()` را overwrite می‌کند. انجام دادن این کار برعکس می‌تواند testهای شما را خراب کند.

```ts
TestBed.configureTestingModule({
  providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()],
});
```

## انتظار داشتن و پاسخ دادن به requestها

برای مثال، می‌توانید testی بنویسید که انتظار دارد یک GET request رخ دهد و یک mock response فراهم می‌کند:

```ts
TestBed.configureTestingModule({
  providers: [ConfigService, provideHttpClientTesting()],
});

const httpTesting = TestBed.inject(HttpTestingController);

// Load `ConfigService` and request the current configuration.
const service = TestBed.inject(ConfigService);
const config$ = service.getConfig<Config>();

// `firstValueFrom` subscribes to the `Observable`, which makes the HTTP request,
// and creates a `Promise` of the response.
const configPromise = firstValueFrom(config$);

// At this point, the request is pending, and we can assert it was made
// via the `HttpTestingController`:
const req = httpTesting.expectOne('/api/config', 'Request to load the configuration');

// We can assert various properties of the request if desired.
expect(req.request.method).toBe('GET');

// Flushing the request causes it to complete, delivering the result.
req.flush(DEFAULT_CONFIG);

// We can then assert that the response was successfully delivered by the `ConfigService`:
expect(await configPromise).toEqual(DEFAULT_CONFIG);

// Finally, we can assert that no other requests were made.
httpTesting.verify();
```

NOTE: اگر test بیش از یک request ساخته باشد که با criteria داده‌شده match شود، `expectOne` fail می‌شود.

به‌عنوان جایگزین assertion روی `req.method`، می‌توانید از شکل گسترده‌تر `expectOne` استفاده کنید تا method request هم match شود:

```ts
const req = httpTesting.expectOne(
  {
    method: 'GET',
    url: '/api/config',
  },
  'Request to load the configuration',
);
```

HELPFUL: APIهای expectation در برابر URL کامل requestها match می‌کنند، شامل هر query parameter.

مرحله‌ی آخر، یعنی verify کردن اینکه request outstanding دیگری باقی نمانده، آن‌قدر رایج است که می‌توانید آن را به یک step از نوع `afterEach()` منتقل کنید:

```ts
afterEach(() => {
  // Verify that none of the tests make any extra HTTP requests.
  TestBed.inject(HttpTestingController).verify();
});
```

## مدیریت بیش از یک request به‌صورت هم‌زمان

اگر در test خود باید به requestهای duplicate پاسخ دهید، به‌جای `expectOne()` از API مربوط به `match()` استفاده کنید. این API همان argumentها را می‌گیرد اما arrayای از requestهای matching برمی‌گرداند. بعد از برگردانده شدن، این requestها از matchingهای آینده حذف می‌شوند و شما مسئول flush و verify کردنشان هستید.

```ts
const allGetRequests = httpTesting.match({method: 'GET'});
for (const req of allGetRequests) {
  // Handle responding to each request.
}
```

## Matching پیشرفته

همه‌ی matching functionها یک predicate function برای custom matching logic می‌پذیرند:

```ts
// Look for one request that has a request body.
const requestsWithBody = httpTesting.expectOne((req) => req.body !== null);
```

function مربوط به `expectNone` assert می‌کند که هیچ requestای با criteria داده‌شده match نشود.

```ts
// Assert that no mutation requests have been issued.
httpTesting.expectNone((req) => req.method !== 'GET');
```

## Test کردن error handling

باید responseهای app خود را هنگام fail شدن HTTP requestها test کنید.

### Backend errorها

برای test کردن مدیریت backend errorها، یعنی وقتی server status code ناموفق برمی‌گرداند، requestها را با error responseای flush کنید که چیزی را emulate می‌کند که backend شما هنگام fail شدن request برمی‌گرداند.

```ts
const req = httpTesting.expectOne('/api/config');
req.flush('Failed!', {status: 500, statusText: 'Internal Server Error'});

// Assert that the application successfully handled the backend error.
```

### Network errorها

requestها می‌توانند به دلیل network error هم fail شوند؛ این‌ها به‌صورت errorهای `ProgressEvent` ظاهر می‌شوند. می‌توانید آن‌ها را با متد `error()` تحویل دهید:

```ts
const req = httpTesting.expectOne('/api/config');
req.error(new ProgressEvent('network error!'));

// Assert that the application successfully handled the network error.
```

## Test کردن یک Interceptor

باید test کنید interceptorهای شما در شرایط موردنظر درست کار می‌کنند.

برای مثال، ممکن است یک application لازم داشته باشد authentication token تولیدشده توسط یک service را به هر request خروجی اضافه کند. این رفتار را می‌توان با استفاده از interceptor enforce کرد:

```ts
export function authInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  const clonedRequest = request.clone({
    headers: request.headers.append('X-Authentication-Token', authService.getAuthToken()),
  });
  return next(clonedRequest);
}
```

configuration مربوط به `TestBed` برای این interceptor باید به feature مربوط به `withInterceptors` تکیه کند.

```ts
TestBed.configureTestingModule({
  providers: [
    AuthService,
    // Testing one interceptor at a time is recommended.
    provideHttpClient(withInterceptors([authInterceptor])),
    provideHttpClientTesting(),
  ],
});
```

`HttpTestingController` می‌تواند request instance را retrieve کند و سپس می‌توان آن را inspect کرد تا مطمئن شوید request تغییر کرده است.

```ts
const service = TestBed.inject(AuthService);
const req = httpTesting.expectOne('/api/config');

expect(req.request.headers.get('X-Authentication-Token')).toEqual(service.getAuthToken());
```

یک interceptor مشابه را می‌توان با class-based interceptorها هم پیاده‌سازی کرد:

```ts
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const clonedRequest = request.clone({
      headers: request.headers.append('X-Authentication-Token', this.authService.getAuthToken()),
    });
    return next.handle(clonedRequest);
  }
}
```

برای test کردن آن، configuration مربوط به `TestBed` باید به‌جای قبل این باشد:

```ts
TestBed.configureTestingModule({
  providers: [
    AuthService,
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClientTesting(),
    // We rely on the HTTP_INTERCEPTORS token to register the AuthInterceptor as an HttpInterceptor
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
});
```
