# دریافت داده‌ی reactive با `httpResource`

`httpResource` یک wrapper reactive دور `HttpClient` است که request status و response را به‌صورت signal به شما می‌دهد. بنابراین می‌توانید این signalها را با `computed`، `effect`، `linkedSignal` یا هر API reactive دیگری استفاده کنید. چون روی `HttpClient` ساخته شده، `httpResource` از همان featureها مثل interceptorها پشتیبانی می‌کند.

برای اطلاعات بیشتر درباره‌ی الگوی `resource` در Angular، [Async reactivity with `resource`](/guide/signals/resource) را ببینید.

## `Using httpResource`

TIP: `httpResource` از `HttpClient` سراسری در دسترس استفاده می‌کند. فقط وقتی لازم دارید featureهای HTTP مثل interceptorها یا optionهای XSRF را پیکربندی کنید، از `provideHttpClient(...)` استفاده کنید. برای جزئیات، [Setting up HttpClient](/guide/http/setup) را ببینید.

می‌توانید یک HTTP resource را با برگرداندن یک url تعریف کنید:

```ts
userId = input.required<string>();

user = httpResource(() => `/api/user/${userId()}`); // A reactive function as argument
```

`httpResource` reactive است؛ یعنی هر وقت یکی از signalهایی که به آن وابسته است تغییر کند، مثل `userId`، resource یک http request جدید emit می‌کند. اگر requestای از قبل pending باشد، resource قبل از ارسال request جدید، request در جریان را cancel می‌کند.

HELPFUL: `httpResource` با `HttpClient` فرق دارد، چون request را _eagerly_ شروع می‌کند. در مقابل، `HttpClient` فقط هنگام subscription به `Observable` برگشتی request را شروع می‌کند.

برای requestهای پیشرفته‌تر، می‌توانید request objectای شبیه چیزی تعریف کنید که `HttpClient` می‌گیرد. هر property از request object که باید reactive باشد، باید با یک signal compose شود.

```ts
user = httpResource(() => ({
  url: `/api/user/${userId()}`,
  method: 'GET',
  headers: {
    'X-Special': 'true',
  },
  params: {
    'fast': 'yes',
  },
  reportProgress: true,
  transferCache: true,
  keepalive: true,
  mode: 'cors',
  redirect: 'error',
  priority: 'high',
  cache: 'force-cache',
  credentials: 'include',
  referrer: 'no-referrer',
  integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GhEXAMPLEKEY=',
  referrerPolicy: 'no-referrer',
}));
```

TIP: از `httpResource` برای _mutation_هایی مثل `POST` یا `PUT` استفاده نکنید. به‌جای آن، استفاده‌ی مستقیم از APIهای زیرین `HttpClient` را ترجیح دهید.

signalهای `httpResource` را می‌توان در template استفاده کرد تا کنترل کنید کدام elementها نمایش داده شوند.

```angular-html
@if (user.hasValue()) {
  <user-details [user]="user.value()" />
} @else if (user.error()) {
  <div>Could not load user information</div>
} @else if (user.isLoading()) {
  <div>Loading user info...</div>
}
```

HELPFUL: خواندن signal مربوط به `value` روی یک `resource` که در error state است، در runtime throw می‌کند. پیشنهاد می‌شود readهای `value` را با `hasValue()` guard کنید.

### Response typeها

به‌صورت پیش‌فرض، `httpResource` پاسخ را به‌عنوان JSON برمی‌گرداند و parse می‌کند. با این حال، می‌توانید با functionهای اضافی روی `httpResource` نوع برگشتی دیگری مشخص کنید:

```ts
httpResource.text(() => ({ … })); // returns a string in value()

httpResource.blob(() => ({ … })); // returns a Blob object in value()

httpResource.arrayBuffer(() => ({ … })); // returns an ArrayBuffer in value()
```

## Response parsing و validation

هنگام fetch کردن داده، ممکن است بخواهید responseها را در برابر یک schema از پیش تعریف‌شده validate کنید؛ اغلب با libraryهای open-source محبوب مثل [Zod](https://zod.dev) یا [Valibot](https://valibot.dev). می‌توانید چنین validation libraryهایی را با مشخص کردن option مربوط به `parse` با `httpResource` یکپارچه کنید. return type مربوط به function `parse`، type مقدار `value` در resource را تعیین می‌کند.

مثال زیر از Zod برای parse و validate کردن response از [StarWars API](https://swapi.info/) استفاده می‌کند. سپس resource همان typeای را می‌گیرد که output type مربوط به parsing در Zod است.

```ts
const starWarsPersonSchema = z.object({
  name: z.string(),
  height: z.number({coerce: true}),
  edited: z.string().datetime(),
  films: z.array(z.string()),
});

export class CharacterViewer {
  id = signal(1);

  swPersonResource = httpResource(() => `https://swapi.info/api/people/${this.id()}`, {
    parse: starWarsPersonSchema.parse,
  });
}
```

## Testing یک httpResource

چون `httpResource` یک wrapper دور `HttpClient` است، می‌توانید `httpResource` را با دقیقا همان APIهای `HttpClient` test کنید. برای جزئیات، [HttpClient Testing](/guide/http/testing) را ببینید.

مثال زیر یک unit test برای کدی نشان می‌دهد که از `httpResource` استفاده می‌کند.

```ts
TestBed.configureTestingModule({
  providers: [provideHttpClientTesting()],
});

const id = signal(0);
const mockBackend = TestBed.inject(HttpTestingController);
const response = httpResource(() => `/data/${id()}`, {injector: TestBed.inject(Injector)});
TestBed.tick(); // Triggers the effect
const firstRequest = mockBackend.expectOne('/data/0');
firstRequest.flush(0);

// Ensures the values are propagated to the httpResource
await TestBed.inject(ApplicationRef).whenStable();

expect(response.value()).toEqual(0);
```
