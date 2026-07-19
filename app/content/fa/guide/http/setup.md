# راه‌اندازی `HttpClient`

`HttpClient` در Angular v21 و نسخه‌های بعدی به‌صورت پیش‌فرض برای injection در دسترس است.

## فراهم کردن `HttpClient` از طریق dependency injection

می‌توانید از helper function مربوط به `provideHttpClient` استفاده کنید تا feature set پیش‌فرض HTTP را پیکربندی کنید یا featureهایی را در `providers` برنامه، داخل `app.config.ts`، اضافه کنید.

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(/* add features here, such as withInterceptors(...) */)],
};
```

اگر app شما به‌جای آن از bootstrap مبتنی بر NgModule استفاده می‌کند، می‌توانید `provideHttpClient` را در providers مربوط به NgModule برنامه قرار دهید تا feature set پیش‌فرض HTTP را پیکربندی کنید یا featureهایی اضافه کنید:

```ts
@NgModule({
  providers: [provideHttpClient(/* add features here, such as withInterceptors(...) */)],
  // ... other application configuration
})
export class AppModule {}
```

سپس می‌توانید service مربوط به `HttpClient` را به‌عنوان dependency در componentها، serviceها یا classهای دیگر inject کنید:

```ts
@Service()
export class ConfigService {
  private http = inject(HttpClient);
  // This service can now make HTTP requests via `this.http`.
}
```

## پیکربندی featureهای `HttpClient`

`provideHttpClient` فهرستی از feature configurationهای اختیاری را می‌پذیرد تا جنبه‌های مختلف client را فعال یا پیکربندی کند. این بخش featureهای اختیاری و نحوه‌ی استفاده از آن‌ها را توضیح می‌دهد.

### `withXhr`

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withXhr())],
};
```

به‌صورت پیش‌فرض، `HttpClient` برای ارسال request از API مربوط به [`fetch`](https://developer.mozilla.org/docs/Web/API/Fetch_API) استفاده می‌کند. feature مربوط به `withXhr`، client را به استفاده از API مربوط به [`XMLHttpRequest`](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest) تغییر می‌دهد.

`fetch` API مدرن‌تری است و در بعضی environmentهایی که `XMLHttpRequest` پشتیبانی نمی‌شود در دسترس است. البته چند محدودیت دارد؛ مثلا upload progress event تولید نمی‌کند.

<docs-callout critical title="Do not use `withXhr` in server-side rendering (SSR) environments">

پشتیبانی XHR روی server **deprecated** است و قرار است در Angular 23 حذف شود. library زیرین `xhr2` redirectها را به شکل امن مدیریت نمی‌کند: ممکن است headerهای `Authorization` را در redirectهای cross-origin forward کند و نسبت به denial-of-service (DoS) از طریق redirect loopها آسیب‌پذیر است. برای applicationهای SSR، به‌جای آن از backend پیش‌فرض `fetch` استفاده کنید.

</docs-callout>

### `withInterceptors(...)`

`withInterceptors` مجموعه‌ی interceptor functionهایی را پیکربندی می‌کند که requestهای ساخته‌شده از طریق `HttpClient` را پردازش می‌کنند. برای اطلاعات بیشتر [راهنمای interceptor](guide/http/interceptors) را ببینید.

### `withInterceptorsFromDi()`

`withInterceptorsFromDi` سبک قدیمی‌تر interceptorهای class-based را در configuration مربوط به `HttpClient` شامل می‌کند. برای اطلاعات بیشتر [راهنمای interceptor](guide/http/interceptors) را ببینید.

HELPFUL: Functional interceptorها، از طریق `withInterceptors`، ordering قابل پیش‌بینی‌تری دارند و ما آن‌ها را به interceptorهای مبتنی بر DI ترجیح می‌دهیم.

### `withRequestsMadeViaParent()`

به‌صورت پیش‌فرض، وقتی `HttpClient` را با `provideHttpClient` داخل یک injector مشخص پیکربندی می‌کنید، این configuration هر configuration مربوط به `HttpClient` را که ممکن است در parent injector وجود داشته باشد override می‌کند.

وقتی `withRequestsMadeViaParent()` را اضافه می‌کنید، `HttpClient` به‌جای آن طوری پیکربندی می‌شود که requestها را، بعد از عبور از هر interceptor پیکربندی‌شده در همین سطح، به instance مربوط به `HttpClient` در parent injector پاس دهد. این زمانی مفید است که بخواهید در یک child injector interceptorهایی _اضافه_ کنید اما همچنان request از interceptorهای parent injector هم عبور کند.

CRITICAL: باید یک instance از `HttpClient` را بالاتر از injector فعلی پیکربندی کرده باشید؛ وگرنه این option معتبر نیست و وقتی تلاش کنید از آن استفاده کنید runtime error می‌گیرید.

### `withJsonpSupport()`

اضافه کردن `withJsonpSupport` متد `.jsonp()` را روی `HttpClient` فعال می‌کند؛ متدی که برای load کردن داده از domain دیگر با [قرارداد JSONP](https://en.wikipedia.org/wiki/JSONP)، یک GET request می‌فرستد.

HELPFUL: اگر ممکن است، برای requestهای cross-domain به‌جای JSONP از [CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS) استفاده کنید.

### `withXsrfConfiguration(...)`

اضافه کردن این option اجازه می‌دهد functionality امنیتی XSRF داخلی `HttpClient` را customize کنید. برای اطلاعات بیشتر [راهنمای امنیت](best-practices/security) را ببینید.

### `withNoXsrfProtection()`

اضافه کردن این option functionality امنیتی XSRF داخلی `HttpClient` را disabled می‌کند. برای اطلاعات بیشتر [راهنمای امنیت](best-practices/security) را ببینید.

## Configuration مبتنی بر `HttpClientModule`

بعضی applicationها ممکن است `HttpClient` را با API قدیمی‌تر مبتنی بر NgModule پیکربندی کنند.

این جدول NgModuleهای موجود از `@angular/common/http` و ارتباطشان با provider configuration functionهای بالا را فهرست می‌کند.

| **NgModule**                            | معادل `provideHttpClient()` |
| --------------------------------------- | --------------------------- |
| `HttpClientModule`                      | `provideHttpClient(withInterceptorsFromDi(), withXhr())` |
| `HttpClientJsonpModule`                 | `withJsonpSupport()` |
| `HttpClientXsrfModule.withOptions(...)` | `withXsrfConfiguration(...)` |
| `HttpClientXsrfModule.disable()`        | `withNoXsrfProtection()` |

<docs-callout important title="Use caution when using HttpClientModule in multiple injectors">
وقتی `HttpClientModule` در چند injector وجود داشته باشد، رفتار interceptorها خوب تعریف نشده و به optionهای دقیق و ترتیب provider/import وابسته است.

برای configurationهای multi-injector، `provideHttpClient` را ترجیح دهید، چون رفتار پایدارتری دارد. feature مربوط به `withRequestsMadeViaParent` را در بالا ببینید.
</docs-callout>
