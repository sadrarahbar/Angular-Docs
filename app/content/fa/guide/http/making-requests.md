# ساخت HTTP request

`HttpClient` متدهایی متناظر با verbهای مختلف HTTP دارد که برای ساخت request استفاده می‌شوند؛ هم برای load کردن داده و هم برای اعمال mutation روی server. هر متد یک [RxJS `Observable`](https://rxjs.dev/guide/observable) برمی‌گرداند که وقتی subscribe شود، request را ارسال می‌کند و سپس وقتی server پاسخ داد نتیجه‌ها را emit می‌کند.

NOTE: `Observable`هایی که توسط `HttpClient` ساخته می‌شوند می‌توانند هر تعداد بار subscribe شوند و برای هر subscription یک backend request جدید می‌سازند.

از طریق options objectای که به request method پاس داده می‌شود، propertyهای مختلف request و response type برگشتی قابل تنظیم هستند.

## دریافت JSON data

دریافت داده از backend اغلب نیازمند ساخت یک GET request با متد [`HttpClient.get()`](api/common/http/HttpClient#get) است. این متد دو argument می‌گیرد: URL endpoint به‌صورت string که باید از آن fetch شود، و یک object اختیاری از نوع _options_ برای پیکربندی request.

برای مثال، برای fetch کردن configuration data از یک API فرضی با متد `HttpClient.get()`:

```ts
http.get<Config>('/api/config').subscribe((config) => {
  // process the configuration.
});
```

به generic type argument توجه کنید که مشخص می‌کند داده‌ی برگشتی از server از نوع `Config` خواهد بود. این argument اختیاری است و اگر آن را حذف کنید، داده‌ی برگشتی type مربوط به `Object` خواهد داشت.

TIP: هنگام کار با داده‌ای که ساختار نامطمئن دارد و ممکن است مقدارهای `undefined` یا `null` داشته باشد، به‌جای `Object` از type مربوط به `unknown` به‌عنوان response type استفاده کنید.

CRITICAL: type generic متدهای request یک **assertion** درباره‌ی داده‌ی برگشتی از server است. `HttpClient` بررسی نمی‌کند که داده‌ی واقعی برگشتی با این type match شود.

## دریافت نوع‌های دیگر داده

به‌صورت پیش‌فرض، `HttpClient` فرض می‌کند serverها JSON data برمی‌گردانند. هنگام تعامل با APIای که JSON نیست، می‌توانید به `HttpClient` بگویید هنگام ساخت request چه response typeای انتظار دارد. این کار با option مربوط به `responseType` انجام می‌شود.

| **مقدار `responseType`** | **response type برگشتی** |
| ------------------------ | ------------------------ |
| `'json'` (default)       | JSON data از generic type داده‌شده |
| `'text'`                 | string data |
| `'arraybuffer'`          | [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) شامل byteهای خام response |
| `'blob'`                 | instanceای از [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob) |

برای مثال، می‌توانید از `HttpClient` بخواهید byteهای خام یک تصویر `.jpeg` را داخل `ArrayBuffer` download کند:

```ts
http.get('/images/dog.jpg', {responseType: 'arraybuffer'}).subscribe((buffer) => {
  console.log('The image is ' + buffer.byteLength + ' bytes large');
});
```

<docs-callout important title="Literal value for `responseType`">
چون مقدار `responseType` روی type برگشتی از `HttpClient` اثر می‌گذارد، باید literal type داشته باشد، نه type مربوط به `string`.

اگر options objectای که به request method پاس می‌دهید literal object باشد، این به‌صورت خودکار رخ می‌دهد؛ اما اگر request options را داخل یک variable یا helper method بیرون کشیده‌اید، شاید لازم باشد آن را به‌صورت صریح literal مشخص کنید، مثل `responseType: 'text' as const`.
</docs-callout>

## Mutate کردن server state

APIهای server که mutation انجام می‌دهند معمولا نیازمند ساخت POST request با request body هستند که state جدید یا تغییری را که باید انجام شود مشخص می‌کند.

متد [`HttpClient.post()`](api/common/http/HttpClient#post) شبیه `get()` رفتار می‌کند و قبل از options، یک argument اضافه به نام `body` می‌پذیرد:

```ts
http.post<Config>('/api/config', newConfig).subscribe((config) => {
  console.log('Updated config:', config);
});
```

نوع‌های مختلفی از مقدارها می‌توانند به‌عنوان `body` مربوط به request فراهم شوند و `HttpClient` آن‌ها را متناسب با نوعشان serialize می‌کند:

| **نوع `body`** | **به این شکل serialize می‌شود** |
| -------------- | ------------------------------- |
| string | Plain text |
| number، boolean، array یا plain object | JSON |
| [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | داده‌ی خام از buffer |
| [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob) | داده‌ی خام با content type مربوط به `Blob` |
| [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData) | داده‌ی encodeشده به‌صورت `multipart/form-data` |
| [`HttpParams`](api/common/http/HttpParams) یا [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) | string قالب‌بندی‌شده به‌صورت `application/x-www-form-urlencoded` |

IMPORTANT: یادتان باشد برای اینکه mutation request واقعا ارسال شود، باید به `Observable`های request مربوط به mutation، `.subscribe()` کنید.

## تنظیم URL parameterها

با option مربوط به `params`، parameterهای request را مشخص کنید که باید در request URL قرار بگیرند.

پاس دادن یک object literal ساده‌ترین راه پیکربندی URL parameterهاست:

```ts
http
  .get('/api/config', {
    params: {filter: 'all'},
  })
  .subscribe((config) => {
    // ...
  });
```

به‌عنوان جایگزین، اگر به کنترل بیشتری روی ساخت یا serialization parameterها نیاز دارید، یک instance از `HttpParams` پاس دهید.

IMPORTANT: instanceهای `HttpParams` _immutable_ هستند و مستقیم قابل تغییر نیستند. در عوض، mutation methodهایی مثل `append()` یک instance جدید از `HttpParams` با mutation اعمال‌شده برمی‌گردانند.

```ts
const baseParams = new HttpParams().set('filter', 'all');

http
  .get('/api/config', {
    params: baseParams.set('details', 'enabled'),
  })
  .subscribe((config) => {
    // ...
  });
```

می‌توانید `HttpParams` را با یک `HttpParameterCodec` سفارشی instantiate کنید که تعیین می‌کند `HttpClient` parameterها را چطور داخل URL encode کند.

### Encoding سفارشی parameterها

به‌صورت پیش‌فرض، `HttpParams` از [`HttpUrlEncodingCodec`](api/common/http/HttpUrlEncodingCodec) داخلی برای encode و decode کردن keyها و valueهای parameter استفاده می‌کند.

می‌توانید پیاده‌سازی خودتان از [`HttpParameterCodec`](api/common/http/HttpParameterCodec) را فراهم کنید تا نحوه‌ی اعمال encoding و decoding را customize کنید.

```ts
import {HttpClient, HttpParams, HttpParameterCodec} from '@angular/common/http';
import {inject} from '@angular/core';

export class CustomHttpParamEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

export class ApiService {
  private http = inject(HttpClient);

  search() {
    const params = new HttpParams({
      encoder: new CustomHttpParamEncoder(),
    })
      .set('email', 'dev+alerts@example.com')
      .set('q', 'a & b? c/d = e');

    return this.http.get('/api/items', {params});
  }
}
```

## تنظیم request headerها

با option مربوط به `headers`، request headerهایی را مشخص کنید که باید در request قرار بگیرند.

پاس دادن object literal ساده‌ترین راه پیکربندی request headerهاست:

```ts
http
  .get('/api/config', {
    headers: {
      'X-Debug-Level': 'verbose',
    },
  })
  .subscribe((config) => {
    // ...
  });
```

به‌عنوان جایگزین، اگر به کنترل بیشتری روی ساخت headerها نیاز دارید، یک instance از `HttpHeaders` پاس دهید.

IMPORTANT: instanceهای `HttpHeaders` _immutable_ هستند و مستقیم قابل تغییر نیستند. در عوض، mutation methodهایی مثل `append()` یک instance جدید از `HttpHeaders` با mutation اعمال‌شده برمی‌گردانند.

```ts
const baseHeaders = new HttpHeaders().set('X-Debug-Level', 'minimal');

http
  .get<Config>('/api/config', {
    headers: baseHeaders.set('X-Debug-Level', 'verbose'),
  })
  .subscribe((config) => {
    // ...
  });
```

## تعامل با eventهای response از server

برای راحتی، `HttpClient` به‌صورت پیش‌فرض یک `Observable` از داده‌ی برگشتی توسط server، یعنی response body، برمی‌گرداند. گاهی لازم است خود response واقعی را بررسی کنید؛ مثلا برای دریافت response headerهای مشخص.

برای دسترسی به کل response، option مربوط به `observe` را روی `'response'` تنظیم کنید:

```ts
http.get<Config>('/api/config', {observe: 'response'}).subscribe((res) => {
  console.log('Response status:', res.status);
  console.log('Body:', res.body);
});
```

<docs-callout important title="Literal value for `observe`">
چون مقدار `observe` روی type برگشتی از `HttpClient` اثر می‌گذارد، باید literal type داشته باشد، نه type مربوط به `string`.

اگر options objectای که به request method پاس می‌دهید literal object باشد، این به‌صورت خودکار رخ می‌دهد؛ اما اگر request options را داخل یک variable یا helper method بیرون کشیده‌اید، شاید لازم باشد آن را به‌صورت صریح literal مشخص کنید، مثل `observe: 'response' as const`.
</docs-callout>

## دریافت raw progress eventها

علاوه بر response body یا response object، `HttpClient` می‌تواند streamای از _event_های خام را هم برگرداند که با لحظه‌های مشخصی در lifecycle request متناظرند. این eventها شامل زمان ارسال request، زمان برگشت response header و زمان کامل شدن body هستند. این eventها همچنین می‌توانند _progress event_هایی را شامل شوند که وضعیت upload و download را برای request یا response bodyهای بزرگ گزارش می‌کنند.

progress eventها به‌صورت پیش‌فرض disabled هستند، چون هزینه‌ی performance دارند، اما می‌توان آن‌ها را با option مربوط به `reportProgress` فعال کرد.

NOTE: fetch backend پیش‌فرض `HttpClient`، progress event مربوط به _upload_ را گزارش نمی‌کند. اگر app شما به upload progress event نیاز دارد، `HttpClient` را با `withXhr()` در `provideHttpClient(...)` پیکربندی کنید.

برای observe کردن event stream، option مربوط به `observe` را روی `'events'` تنظیم کنید:

```ts
http
  .post('/api/upload', myData, {
    reportProgress: true,
    observe: 'events',
  })
  .subscribe((event) => {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
        break;
      case HttpEventType.Response:
        console.log('Finished uploading!');
        break;
    }
  });
```

<docs-callout important title="Literal value for `observe`">
چون مقدار `observe` روی type برگشتی از `HttpClient` اثر می‌گذارد، باید literal type داشته باشد، نه type مربوط به `string`.

اگر options objectای که به request method پاس می‌دهید literal object باشد، این به‌صورت خودکار رخ می‌دهد؛ اما اگر request options را داخل یک variable یا helper method بیرون کشیده‌اید، شاید لازم باشد آن را به‌صورت صریح literal مشخص کنید، مثل `observe: 'events' as const`.
</docs-callout>

هر `HttpEvent` که در event stream گزارش می‌شود یک `type` دارد که مشخص می‌کند event چه چیزی را نمایش می‌دهد:

| **مقدار `type`**                 | **معنای event** |
| -------------------------------- | --------------- |
| `HttpEventType.Sent`             | request به server dispatch شده است |
| `HttpEventType.UploadProgress`   | یک `HttpUploadProgressEvent` که progress مربوط به upload کردن request body را گزارش می‌کند |
| `HttpEventType.ResponseHeader`   | head مربوط به response دریافت شده، شامل status و headerها |
| `HttpEventType.DownloadProgress` | یک `HttpDownloadProgressEvent` که progress مربوط به download کردن response body را گزارش می‌کند |
| `HttpEventType.Response`         | کل response دریافت شده، شامل response body |
| `HttpEventType.User`             | یک custom event از HTTP interceptor. |

## مدیریت شکست request

یک HTTP request از سه راه می‌تواند fail شود:

- یک network یا connection error می‌تواند مانع رسیدن request به backend server شود.
- وقتی timeout option تنظیم شده، request به‌موقع پاسخ نداده است.
- backend می‌تواند request را دریافت کند اما در پردازش آن fail شود و error response برگرداند.

`HttpClient` همه‌ی نوع‌های خطای بالا را داخل یک `HttpErrorResponse` capture می‌کند و آن را از طریق error channel مربوط به `Observable` برمی‌گرداند. خطاهای network و timeout، `status` code برابر `0` و یک `error` دارند که instanceای از [`ProgressEvent`](https://developer.mozilla.org/docs/Web/API/ProgressEvent) است. backend errorها status code شکست‌خورده‌ی برگشتی از backend و error response را به‌عنوان `error` دارند. response را inspect کنید تا علت error و action مناسب برای مدیریت آن را مشخص کنید.

[RxJS library](https://rxjs.dev/) چند operator ارائه می‌دهد که می‌توانند برای error handling مفید باشند.

می‌توانید از operator مربوط به `catchError` استفاده کنید تا error response را به مقداری برای UI تبدیل کنید. این مقدار می‌تواند به UI بگوید یک error page یا value نمایش دهد و در صورت نیاز علت error را capture کند.

گاهی errorهای transient مثل قطع شدن network می‌توانند باعث fail شدن غیرمنتظره‌ی request شوند و retry ساده‌ی request اجازه می‌دهد موفق شود. RxJS چند operator از نوع _retry_ فراهم می‌کند که تحت شرایط مشخص به‌صورت خودکار به `Observable` شکست‌خورده دوباره subscribe می‌شوند. مثلا operator مربوط به `retry()` به‌صورت خودکار تعداد دفعات مشخصی تلاش می‌کند دوباره subscribe شود.

### Timeoutها

برای تنظیم timeout برای یک request، می‌توانید option مربوط به `timeout` را همراه با request optionهای دیگر روی تعداد millisecond تنظیم کنید. اگر backend request در زمان مشخص‌شده کامل نشود، request abort می‌شود و error emit می‌شود.

NOTE: timeout فقط روی خود backend HTTP request اعمال می‌شود. این timeout برای کل request handling chain نیست. بنابراین این option تحت تاثیر delayای که interceptorها ایجاد می‌کنند قرار نمی‌گیرد.

```ts
http
  .get('/api/config', {
    timeout: 3000,
  })
  .subscribe({
    next: (config) => {
      console.log('Config fetched successfully:', config);
    },
    error: (err) => {
      // If the request times out, an error will have been emitted.
    },
  });
```

## Fetch optionهای پیشرفته

`HttpClient` در Angular از optionهای پیشرفته‌ی fetch API پشتیبانی می‌کند که می‌توانند performance و تجربه‌ی کاربر را بهتر کنند. این optionها هنگام استفاده از fetch backend در دسترس‌اند؛ backendی که پیش‌فرض است.

### Fetch optionها

optionهای زیر هنگام استفاده از fetch backend کنترل دقیقی روی رفتار request فراهم می‌کنند.

#### Keep-alive connectionها

option مربوط به `keepalive` اجازه می‌دهد یک request بیشتر از صفحه‌ای که آن را شروع کرده زنده بماند. این به‌خصوص برای requestهای analytics یا logging مفید است که باید حتی اگر کاربر از صفحه خارج شد کامل شوند.

```ts
http
  .post('/api/analytics', analyticsData, {
    keepalive: true,
  })
  .subscribe();
```

#### کنترل HTTP caching

option مربوط به `cache` کنترل می‌کند request چطور با HTTP cache مرورگر تعامل کند؛ چیزی که می‌تواند performance را برای requestهای تکراری به شکل قابل توجهی بهتر کند.

```ts
//  Use cached response regardless of freshness
http
  .get('/api/config', {
    cache: 'force-cache',
  })
  .subscribe((config) => {
    // ...
  });

// Always fetch from network, bypass cache
http
  .get('/api/live-data', {
    cache: 'no-cache',
  })
  .subscribe((data) => {
    // ...
  });

// Use cached response only, fail if not in cache
http
  .get('/api/static-data', {
    cache: 'only-if-cached',
  })
  .subscribe((data) => {
    // ...
  });
```

#### Request priority برای Core Web Vitals

option مربوط به `priority` اجازه می‌دهد اهمیت نسبی یک request را مشخص کنید و به مرورگر کمک می‌کند resource loading را برای امتیازهای بهتر Core Web Vitals optimize کند.

```ts
// High priority for critical resources
http
  .get('/api/user-profile', {
    priority: 'high',
  })
  .subscribe((profile) => {
    // ...
  });

// Low priority for non-critical resources
http
  .get('/api/recommendations', {
    priority: 'low',
  })
  .subscribe((recommendations) => {
    // ...
  });

// Auto priority (default) lets the browser decide
http
  .get('/api/settings', {
    priority: 'auto',
  })
  .subscribe((settings) => {
    // ...
  });
```

مقدارهای در دسترس برای `priority`:

- `'high'`: priority بالا، زود load می‌شود، مثلا critical user data یا above-the-fold content
- `'low'`: priority پایین، وقتی resourceها در دسترس باشند load می‌شود، مثلا analytics یا prefetch data
- `'auto'`: مرورگر priority را بر اساس request context تعیین می‌کند، حالت پیش‌فرض

TIP: برای requestهایی که روی Largest Contentful Paint (LCP) اثر دارند از `priority: 'high'` استفاده کنید و برای requestهایی که روی تجربه‌ی اولیه‌ی کاربر اثر ندارند از `priority: 'low'`.

#### Request mode

option مربوط به `mode` کنترل می‌کند request چطور cross-origin requestها را مدیریت کند و response type را تعیین می‌کند.

```ts
// Same-origin requests only
http
  .get('/api/local-data', {
    mode: 'same-origin',
  })
  .subscribe((data) => {
    // ...
  });

// CORS-enabled cross-origin requests
http
  .get('https://api.external.com/data', {
    mode: 'cors',
  })
  .subscribe((data) => {
    // ...
  });

// No-CORS mode for simple cross-origin requests
http
  .get('https://external-api.com/public-data', {
    mode: 'no-cors',
  })
  .subscribe((data) => {
    // ...
  });
```

مقدارهای در دسترس برای `mode`:

- `'same-origin'`: فقط same-origin requestها را مجاز می‌کند و برای cross-origin requestها fail می‌شود.
- `'cors'`: cross-origin requestها را همراه با CORS مجاز می‌کند، حالت پیش‌فرض.
- `'no-cors'`: requestهای ساده‌ی cross-origin را بدون CORS مجاز می‌کند؛ response opaque است.

TIP: برای requestهای حساس که هرگز نباید cross-origin شوند، از `mode: 'same-origin'` استفاده کنید.

#### مدیریت redirect

option مربوط به `redirect` مشخص می‌کند redirect responseهای server چطور مدیریت شوند.

```ts
// Follow redirects automatically (default behavior)
http
  .get('/api/resource', {
    redirect: 'follow',
  })
  .subscribe((data) => {
    // ...
  });

// Prevent automatic redirects
http
  .get('/api/resource', {
    redirect: 'manual',
  })
  .subscribe((response) => {
    // Handle redirect manually
  });

// Treat redirects as errors
http
  .get('/api/resource', {
    redirect: 'error',
  })
  .subscribe({
    next: (data) => {
      // Success response
    },
    error: (err) => {
      // Redirect responses will trigger this error handler
    },
  });
```

مقدارهای در دسترس برای `redirect`:

- `'follow'`: redirectها را به‌صورت خودکار دنبال می‌کند، حالت پیش‌فرض.
- `'error'`: redirectها را error در نظر می‌گیرد.
- `'manual'`: redirectها را به‌صورت خودکار دنبال نمی‌کند و redirect response را برمی‌گرداند.

TIP: وقتی لازم دارید redirectها را با custom logic مدیریت کنید، از `redirect: 'manual'` استفاده کنید.

#### مدیریت credentials

option مربوط به `credentials` کنترل می‌کند cookies، authorization headerها و credentialهای دیگر همراه cross-origin requestها ارسال شوند یا نه. این برای سناریوهای authentication به‌خصوص مهم است.

```ts
// Include credentials for cross-origin requests
http
  .get('https://api.example.com/protected-data', {
    credentials: 'include',
  })
  .subscribe((data) => {
    // ...
  });

// Never send credentials (default for cross-origin)
http
  .get('https://api.example.com/public-data', {
    credentials: 'omit',
  })
  .subscribe((data) => {
    // ...
  });

// Send credentials only for same-origin requests
http
  .get('/api/user-data', {
    credentials: 'same-origin',
  })
  .subscribe((data) => {
    // ...
  });

// withCredentials overrides credentials setting
http
  .get('https://api.example.com/data', {
    credentials: 'omit', // This will be ignored
    withCredentials: true, // This forces credentials: 'include'
  })
  .subscribe((data) => {
    // Request will include credentials despite credentials: 'omit'
  });

// Legacy approach (still supported)
http
  .get('https://api.example.com/data', {
    withCredentials: true,
  })
  .subscribe((data) => {
    // Equivalent to credentials: 'include'
  });
```

IMPORTANT: option مربوط به `withCredentials` نسبت به option مربوط به `credentials` تقدم دارد. اگر هر دو مشخص شوند، `withCredentials: true` همیشه به `credentials: 'include'` منجر می‌شود، بدون توجه به مقدار صریح `credentials`.

مقدارهای در دسترس برای `credentials`:

- `'omit'`: هرگز credential ارسال نمی‌کند.
- `'same-origin'`: credentialها را فقط برای same-origin requestها ارسال می‌کند، حالت پیش‌فرض.
- `'include'`: همیشه credential ارسال می‌کند، حتی برای cross-origin requestها.

TIP: وقتی لازم دارید authentication cookie یا header را به domain دیگری بفرستید که CORS را پشتیبانی می‌کند، از `credentials: 'include'` استفاده کنید. برای جلوگیری از ابهام، optionهای `credentials` و `withCredentials` را با هم مخلوط نکنید.

#### Referrer

option مربوط به `referrer` اجازه می‌دهد کنترل کنید چه referrer informationای همراه request ارسال شود. این برای ملاحظات privacy و security مهم است.

```ts
// Send a specific referrer URL
http
  .get('/api/data', {
    referrer: 'https://example.com/page',
  })
  .subscribe((data) => {
    // ...
  });

// Use the current page as referrer (default behavior)
http
  .get('/api/analytics', {
    referrer: 'about:client',
  })
  .subscribe((data) => {
    // ...
  });
```

option مربوط به `referrer` این‌ها را می‌پذیرد:

- یک URL string معتبر: referrer URL مشخصی را برای ارسال set می‌کند.
- یک string خالی `''`: هیچ referrer informationای ارسال نمی‌کند.
- `'about:client'`: از referrer پیش‌فرض، یعنی URL صفحه‌ی فعلی، استفاده می‌کند.

TIP: برای requestهای حساس که نمی‌خواهید URL صفحه‌ی ارجاع‌دهنده leak شود، از `referrer: ''` استفاده کنید.

#### Referrer policy

option مربوط به `referrerPolicy` کنترل می‌کند چه مقدار referrer information، یعنی URL صفحه‌ای که request را می‌سازد، همراه HTTP request ارسال شود. این تنظیم هم privacy و هم analytics را تحت تاثیر قرار می‌دهد و اجازه می‌دهد visibility داده را با ملاحظات security متعادل کنید.

```ts
// Send no referrer information regardless of the current page
http
  .get('/api/data', {
    referrerPolicy: 'no-referrer',
  })
  .subscribe();

// Send origin only (e.g. https://example.com)
http
  .get('/api/analytics', {
    referrerPolicy: 'origin',
  })
  .subscribe();
```

option مربوط به `referrerPolicy` این‌ها را می‌پذیرد:

- `'no-referrer'` هرگز header مربوط به `Referer` را ارسال نمی‌کند.
- `'no-referrer-when-downgrade'` referrer را برای same-origin و requestهای secure، یعنی HTTPS→HTTPS، ارسال می‌کند؛ اما هنگام navigation از origin امن به origin کم‌امن‌تر، یعنی HTTPS→HTTP، آن را حذف می‌کند.
- `'origin'` فقط origin، یعنی scheme، host و port، مربوط به referrer را ارسال می‌کند و path و query information را حذف می‌کند.
- `'origin-when-cross-origin'` برای same-origin requestها URL کامل را ارسال می‌کند، اما برای cross-origin requestها فقط origin را.
- `'same-origin'` برای same-origin requestها URL کامل را ارسال می‌کند و برای cross-origin requestها هیچ referrerی ارسال نمی‌کند.
- `'strict-origin'` فقط origin را ارسال می‌کند، و فقط اگر سطح امنیت protocol downgrade نشده باشد، مثلا HTTPS→HTTPS. هنگام downgrade referrer را حذف می‌کند.
- `'strict-origin-when-cross-origin'` رفتار پیش‌فرض مرورگر. برای same-origin requestها URL کامل را ارسال می‌کند، برای cross-origin requestهایی که downgrade نشده‌اند origin را ارسال می‌کند، و هنگام downgrade referrer را حذف می‌کند.
- `'unsafe-url'` همیشه URL کامل، شامل path و query، را ارسال می‌کند. این می‌تواند داده‌ی حساس را expose کند و باید با احتیاط استفاده شود.

TIP: برای requestهای حساس از نظر privacy، مقدارهای conservative مثل `'no-referrer'`، `'origin'` یا `'strict-origin-when-cross-origin'` را ترجیح دهید.

#### Integrity

option مربوط به `integrity` اجازه می‌دهد با فراهم کردن cryptographic hash از محتوای مورد انتظار، verify کنید response دستکاری نشده است. این به‌خصوص برای load کردن scriptها یا resourceهای دیگر از CDNها مفید است.

```ts
// Verify response integrity with SHA-256 hash
http
  .get('/api/script.js', {
    integrity: 'sha256-ABC123...',
    responseType: 'text',
  })
  .subscribe((script) => {
    // Script content is verified against the hash
  });
```

IMPORTANT: option مربوط به `integrity` نیازمند match دقیق بین response content و hash فراهم‌شده است. اگر content match نشود، request با network error fail می‌شود.

TIP: هنگام load کردن resourceهای critical از منبع‌های خارجی، از subresource integrity استفاده کنید تا مطمئن شوید تغییر نکرده‌اند. hashها را با ابزارهایی مثل `openssl` generate کنید.

## HTTP `Observable`ها

هر request method روی `HttpClient` یک `Observable` از response type درخواست‌شده می‌سازد و برمی‌گرداند. فهمیدن اینکه این `Observable`ها چطور کار می‌کنند هنگام استفاده از `HttpClient` مهم است.

`HttpClient` چیزی تولید می‌کند که RxJS آن را `Observable`های "cold" می‌نامد؛ یعنی تا وقتی به `Observable` subscribe نشود، request واقعی رخ نمی‌دهد. فقط آن زمان است که request واقعا به server dispatch می‌شود. چند بار subscribe کردن به همان `Observable` چند backend request را trigger می‌کند. هر subscription مستقل است.

TIP: می‌توانید `Observable`های مربوط به `HttpClient` را مثل _blueprint_هایی برای requestهای واقعی server در نظر بگیرید.

بعد از subscribe شدن، unsubscribe کردن request در حال انجام را abort می‌کند. اگر `Observable` از طریق pipe مربوط به `async` subscribe شده باشد، این بسیار مفید است، چون اگر کاربر از صفحه‌ی فعلی خارج شود request به‌صورت خودکار cancel می‌شود. علاوه بر این، اگر `Observable` را با یک RxJS combinator مثل `switchMap` استفاده کنید، این cancellation هر request قدیمی را cleanup می‌کند.

وقتی response برگردد، `Observable`های `HttpClient` معمولا complete می‌شوند، هرچند interceptorها می‌توانند روی این رفتار اثر بگذارند.

به خاطر complete شدن خودکار، اگر subscriptionهای `HttpClient` cleanup نشوند معمولا خطر memory leak وجود ندارد. با این حال، مثل هر async operation، قویا پیشنهاد می‌کنیم وقتی component استفاده‌کننده از آن‌ها destroyed می‌شود subscriptionها را cleanup کنید؛ وگرنه callback مربوط به subscription ممکن است اجرا شود و هنگام تلاش برای تعامل با component نابودشده به error بخورد.

TIP: استفاده از pipe مربوط به `async` یا operation مربوط به `toSignal` برای subscribe شدن به `Observable`ها تضمین می‌کند subscriptionها درست dispose شوند.

## Best practiceها

با اینکه `HttpClient` می‌تواند مستقیم از componentها inject و استفاده شود، معمولا پیشنهاد می‌کنیم serviceهای reusable و injectable بسازید که data access logic را isolate و encapsulate کنند. برای مثال، این `UserService` منطق request کردن داده‌ی یک user بر اساس id او را encapsulate می‌کند:

```ts
@Service()
export class UserService {
  private http = inject(HttpClient);

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`/api/user/${id}`);
  }
}
```

داخل یک component، می‌توانید `@if` را با pipe مربوط به `async` ترکیب کنید تا UI مربوط به داده فقط بعد از تمام شدن loading render شود:

```angular-ts
import {AsyncPipe} from '@angular/common';

@Component({
  imports: [AsyncPipe],
  template: `
    @if (user$ | async; as user) {
      <p>Name: {{ user.name }}</p>
      <p>Biography: {{ user.biography }}</p>
    }
  `,
})
export class UserProfile {
  userId = input.required<string>();
  user$!: Observable<User>;

  private userService = inject(UserService);

  constructor(): void {
    effect(() => {
      this.user$ = this.userService.getUser(this.userId());
    });
  }
}
```
