# Animationهای transition بین routeها

Route transition animationها با فراهم کردن transitionهای بصری روان هنگام navigation بین viewهای مختلف در application Angular شما، user experience را بهتر می‌کنند. [Angular Router](/guide/routing) پشتیبانی داخلی از View Transitions API مرورگر دارد و در مرورگرهای پشتیبانی‌شده، animationهای یکپارچه بین تغییر routeها را ممکن می‌کند.

HELPFUL: Integration بومی Router با View Transitions در حال حاضر در [developer preview](/reference/releases#developer-preview) است. Native View Transitions یک قابلیت نسبتا جدید مرورگر است و هنوز در همه مرورگرها پشتیبانی گسترده ندارد.

## View Transitionها چطور کار می‌کنند

View transitionها از API بومی مرورگر یعنی [`document.startViewTransition` API](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition) استفاده می‌کنند تا بین stateهای مختلف application شما animationهای روان بسازند. این API به این شکل کار می‌کند:

1. **Capture کردن state فعلی** - مرورگر از صفحه فعلی screenshot می‌گیرد
2. **اجرای DOM update** - callback function شما اجرا می‌شود تا DOM را به‌روزرسانی کند
3. **Capture کردن state جدید** - مرورگر state به‌روزشده صفحه را capture می‌کند
4. **پخش transition** - مرورگر بین state قدیم و جدید animation اجرا می‌کند

ساختار پایه API مربوط به `startViewTransition`:

```ts
document.startViewTransition(async () => {
  await updateTheDOMSomehow();
});
```

برای جزئیات بیشتر درباره browser API، [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions) را ببینید.

## Router چطور از view transitionها استفاده می‌کند

Angular Router، view transitionها را وارد navigation lifecycle می‌کند تا تغییر routeها یکپارچه‌تر شوند. در طول navigation، Router:

1. **آماده‌سازی navigation را کامل می‌کند** - Route matching، [lazy loading](guide/routing/loading-strategies#lazily-loaded-components-and-routes)، [guardها](/guide/routing/route-guards) و [resolverها](/guide/routing/data-resolvers) اجرا می‌شوند
2. **View transition را شروع می‌کند** - وقتی routeها برای activation آماده شدند، Router، `startViewTransition` را call می‌کند
3. **DOM را به‌روزرسانی می‌کند** - Router درون transition callback، routeهای جدید را activate و routeهای قدیمی را deactivate می‌کند
4. **Transition را نهایی می‌کند** - وقتی Angular rendering را کامل کند، Promise مربوط به transition resolve می‌شود

Integration مربوط به view transition در Router به‌عنوان یک [progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) عمل می‌کند. وقتی مرورگرها از View Transitions API پشتیبانی نکنند، Router updateهای معمول DOM را بدون animation انجام می‌دهد و مطمئن می‌شود application شما در همه مرورگرها کار می‌کند.

## فعال کردن View Transitionها در Router

برای فعال کردن view transitionها، feature مربوط به `withViewTransitions` را به [router configuration](/guide/routing/define-routes#adding-the-router-to-your-application) اضافه کنید. Angular هم از رویکرد standalone bootstrap و هم NgModule bootstrap پشتیبانی می‌کند:

### Standalone bootstrap

```ts
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, withViewTransitions} from '@angular/router';
import {routes} from './app.routes';

bootstrapApplication(MyApp, {
  providers: [provideRouter(routes, withViewTransitions())],
});
```

### NgModule bootstrap

```ts
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableViewTransitions: true})],
})
export class AppRouting {}
```

[مثال "count" را در StackBlitz امتحان کنید](https://stackblitz.com/edit/stackblitz-starters-2dnvtm?file=src%2Fmain.ts)

این مثال نشان می‌دهد router navigation چطور می‌تواند جایگزین callهای مستقیم `startViewTransition` برای updateهای counter شود.

## سفارشی‌سازی transitionها با CSS

می‌توانید view transitionها را با CSS سفارشی کنید تا animation effectهای منحصربه‌فرد بسازید. مرورگر transition elementهای جداگانه‌ای می‌سازد که می‌توانید با CSS selectorها هدف بگیرید.

برای ساخت transitionهای سفارشی:

1. **اضافه کردن view-transition-name** - به elementهایی که می‌خواهید animate شوند nameهای یکتا assign کنید
2. **تعریف animationهای global** - CSS animationها را در global styles خود بسازید
3. **هدف گرفتن transition pseudo-elementها** - از selectorهای `::view-transition-old()` و `::view-transition-new()` استفاده کنید

در اینجا مثالی می‌بینید که یک rotation effect به counter element اضافه می‌کند:

```css
/* Define keyframe animations */
@keyframes rotate-out {
  to {
    transform: rotate(90deg);
  }
}

@keyframes rotate-in {
  from {
    transform: rotate(-90deg);
  }
}

/* Target view transition pseudo-elements */
::view-transition-old(count),
::view-transition-new(count) {
  animation-duration: 200ms;
  animation-name: -ua-view-transition-fade-in, rotate-in;
}

::view-transition-old(count) {
  animation-name: -ua-view-transition-fade-out, rotate-out;
}
```

IMPORTANT: View transition animationها را در فایل global styles تعریف کنید، نه در component styles. [View encapsulation](/guide/components/styling#style-scoping) در Angular، component styleها را scope می‌کند و همین باعث می‌شود نتوانند transition pseudo-elementها را درست هدف بگیرند.

[مثال به‌روزشده “count” را در StackBlitz امتحان کنید](https://stackblitz.com/edit/stackblitz-starters-fwn4i7?file=src%2Fmain.ts)

## کنترل پیشرفته transition با onViewTransitionCreated

Feature مربوط به `withViewTransitions` یک options object با callbackای به نام `onViewTransitionCreated` می‌پذیرد تا کنترل پیشرفته روی view transitionها داشته باشید. این callback:

- در یک [injection context](/guide/di/dependency-injection-context#run-within-an-injection-context) اجرا می‌شود
- یک object از نوع [`ViewTransitionInfo`](/api/router/ViewTransitionInfo) دریافت می‌کند که شامل موارد زیر است:
  - Instance مربوط به `ViewTransition` از `startViewTransition`
  - [`ActivatedRouteSnapshot`](/api/router/ActivatedRouteSnapshot) برای routeای که از آن navigate می‌شود
  - [`ActivatedRouteSnapshot`](/api/router/ActivatedRouteSnapshot) برای routeای که به آن navigate می‌شود

از این callback استفاده کنید تا رفتار transition را بر اساس navigation context سفارشی کنید. برای مثال، می‌توانید transitionها را برای نوع‌های مشخصی از navigation skip کنید:

```ts
import {inject} from '@angular/core';
import {Router, withViewTransitions, isActive} from '@angular/router';

withViewTransitions({
  onViewTransitionCreated: ({transition}) => {
    const router = inject(Router);
    const targetUrl = router.currentNavigation()!.finalUrl!;

    // Skip transition if only fragment or query params change
    const config = {
      paths: 'exact',
      matrixParams: 'exact',
      fragment: 'ignored',
      queryParams: 'ignored',
    };

    const isTargetRouteCurrent = isActive(targetUrl, router, config);

    if (isTargetRouteCurrent()) {
      transition.skipTransition();
    }
  },
});
```

این مثال وقتی navigation فقط [URL fragment یا query parameterها](/guide/routing/read-route-state#query-parameters) را تغییر می‌دهد، مثلا anchor linkهای داخل همان صفحه، view transition را skip می‌کند. Method مربوط به `skipTransition()` از animation جلوگیری می‌کند، در حالی که همچنان اجازه می‌دهد navigation کامل شود.

## مثال‌هایی از Chrome explainer که برای Angular سازگار شده‌اند

مثال‌های زیر تکنیک‌های مختلف view transition را نشان می‌دهند که از documentation تیم Chrome گرفته شده و برای استفاده با Angular Router سازگار شده‌اند:

### Elementهایی که transition می‌شوند لازم نیست همان DOM element باشند

Elementها تا زمانی که `view-transition-name` یکسانی داشته باشند، می‌توانند بین DOM elementهای متفاوت به‌صورت روان transition شوند.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#transitioning_elements_dont_need_to_be_the_same_dom_element)
- [Angular Example در StackBlitz](https://stackblitz.com/edit/stackblitz-starters-dh8npr?file=src%2Fmain.ts)

### Animationهای entry و exit سفارشی

برای elementهایی که هنگام route transition وارد viewport یا از آن خارج می‌شوند، animationهای منحصربه‌فرد بسازید.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#custom_entry_and_exit_transitions)
- [Angular Example در StackBlitz](https://stackblitz.com/edit/stackblitz-starters-8kly3o)

### DOM updateهای async و انتظار برای content

Angular Router transitionهای فوری را نسبت به انتظار برای load شدن content اضافه در اولویت قرار می‌دهد.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#async_dom_updates_and_waiting_for_content)

NOTE: Angular Router راهی برای delay دادن view transitionها فراهم نمی‌کند. این تصمیم طراحی از non-interactive شدن صفحه‌ها هنگام انتظار برای content اضافه جلوگیری می‌کند. همان‌طور که documentation Chrome اشاره می‌کند: "During this time, the page is frozen, so delays here should be kept to a minimum…in some cases it's better to avoid the delay altogether, and use the content you already have."

### مدیریت چند style مربوط به view transition با view transition typeها

از view transition typeها استفاده کنید تا بر اساس navigation context، styleهای animation متفاوت اعمال کنید.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#view-transition-types)
- [Angular Example در StackBlitz](https://stackblitz.com/edit/stackblitz-starters-vxzcam)

### مدیریت چند style مربوط به view transition با class name روی view transition root (deprecated)

این رویکرد از CSS classها روی transition root element برای کنترل animation styleها استفاده می‌کند.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#changing-on-navigation-type)
- [Angular Example در StackBlitz](https://stackblitz.com/edit/stackblitz-starters-nmnzzg?file=src%2Fmain.ts)

### Transition بدون freeze کردن animationهای دیگر

Animationهای دیگر صفحه را هنگام view transition حفظ کنید تا user experienceهای dynamicتری بسازید.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#transitioning-without-freezing)
- [Angular Example در StackBlitz](https://stackblitz.com/edit/stackblitz-starters-76kgww)

### Animate کردن با JavaScript

برای سناریوهای animation پیچیده، view transitionها را با JavaScript APIها به‌صورت programmatic کنترل کنید.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#animating-with-javascript)
- [Angular Example در StackBlitz](https://stackblitz.com/edit/stackblitz-starters-cklnkm)
