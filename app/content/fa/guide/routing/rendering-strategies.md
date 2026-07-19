# استراتژی‌های rendering در Angular

این راهنما کمک می‌کند برای بخش‌های مختلف application Angular خود، rendering strategy مناسب را انتخاب کنید.

## Rendering strategy چیست؟

Rendering strategyها مشخص می‌کنند محتوای HTML مربوط به application Angular شما چه زمانی و کجا تولید شود. هر strategy بین performance مربوط به initial page load، interactivity، قابلیت‌های SEO و مصرف resourceهای server trade-offهای متفاوتی دارد.

Angular از سه rendering strategy اصلی پشتیبانی می‌کند:

- **Client-Side Rendering (CSR)** - Content کاملا در مرورگر render می‌شود
- **Static Site Generation (SSG/Prerendering)** - Content در build time از قبل render می‌شود
- **Server-Side Rendering (SSR)** - Content برای initial request یک route، روی server render می‌شود

## Client-Side Rendering (CSR)

**CSR حالت پیش‌فرض Angular است.** Content بعد از load شدن JavaScript، کاملا در مرورگر render می‌شود.

### چه زمانی از CSR استفاده کنیم

✅ می‌تواند برای این موارد مناسب باشد:

- Applicationهای interactive مثل dashboardها و admin panelها
- Applicationهای real-time
- Internal toolهایی که SEO برایشان مهم نیست
- Single-page applicationهایی با client-side state پیچیده

❌ در صورت امکان، برای این موارد بهتر است از آن دوری کنید:

- Content عمومی که به SEO نیاز دارد
- صفحه‌هایی که initial load performance در آن‌ها حیاتی است

### Trade-offهای CSR

| Aspect            | Impact                                                     |
| :---------------- | :--------------------------------------------------------- |
| **SEO**           | ضعیف - content تا زمان اجرای JS برای crawlerها قابل مشاهده نیست |
| **Initial load**  | کندتر - ابتدا باید JavaScript download و اجرا شود          |
| **Interactivity** | بعد از load شدن، فوری                                      |
| **Server needs**  | خارج از مقداری configuration، حداقلی                       |
| **Complexity**    | ساده‌ترین حالت، چون با حداقل configuration کار می‌کند      |

## Static Site Generation (SSG/Prerendering)

**SSG صفحه‌ها را در build time** به فایل‌های HTML static تبدیل و pre-render می‌کند. Server برای initial page load، HTML از پیش ساخته‌شده را می‌فرستد. بعد از hydration، app شما مثل یک SPA سنتی کاملا در مرورگر اجرا می‌شود؛ navigationهای بعدی، تغییر routeها و API callها همه بدون server rendering و در client-side رخ می‌دهند.

### چه زمانی از SSG استفاده کنیم

✅ می‌تواند برای این موارد مناسب باشد:

- Marketing pageها و landing pageها
- Blog postها و documentation
- Product catalogهایی با content پایدار
- Contentای که برای هر کاربر تغییر نمی‌کند

❌ در صورت امکان، برای این موارد بهتر است از آن دوری کنید:

- Content مخصوص هر کاربر
- Dataای که مرتب تغییر می‌کند
- اطلاعات real-time

### Trade-offهای SSG

| Aspect              | Impact                                      |
| :------------------ | :------------------------------------------ |
| **SEO**             | عالی - HTML کامل بلافاصله در دسترس است      |
| **Initial load**    | سریع‌ترین - HTML از پیش generate شده        |
| **Interactivity**   | بعد از کامل شدن hydration                   |
| **Server needs**    | برای serving نیاز ندارد و CDN-friendly است  |
| **Build time**      | طولانی‌تر - همه صفحه‌ها را upfront generate می‌کند |
| **Content updates** | نیاز به rebuild و redeploy دارد             |

📖 **Implementation:** بخش [Customizing build-time prerendering](guide/ssr#customizing-build-time-prerendering-ssg) را در راهنمای SSR ببینید.

## Server-Side Rendering (SSR)

**SSR برای initial request یک route، HTML را روی server تولید می‌کند** و dynamic content را با SEO خوب فراهم می‌کند. Server، HTML را render می‌کند و به client می‌فرستد.

وقتی client صفحه را render کرد، Angular app را [hydrate](/guide/hydration#what-is-hydration) می‌کند و سپس مثل یک SPA سنتی کاملا در مرورگر اجرا می‌شود؛ navigationهای بعدی، تغییر routeها و API callها همه در client-side و بدون server rendering اضافه انجام می‌شوند.

### چه زمانی از SSR استفاده کنیم

✅ می‌تواند برای این موارد مناسب باشد:

- صفحه‌های محصول در e-commerce، مثل قیمت‌گذاری یا inventory dynamic
- News siteها و social media feedها
- Content شخصی‌سازی‌شده‌ای که مرتب تغییر می‌کند

❌ در صورت امکان، برای این موارد بهتر است از آن دوری کنید:

- Content static؛ به‌جای آن از SSG استفاده کنید
- وقتی هزینه‌های server نگرانی مهمی است

### Trade-offهای SSR

| Aspect              | Impact                                                 |
| :------------------ | :----------------------------------------------------- |
| **SEO**             | عالی - HTML کامل برای crawlerها                        |
| **Initial load**    | سریع - content بلافاصله قابل مشاهده است                |
| **Interactivity**   | تا hydration کمی تاخیر دارد                            |
| **Server needs**    | به server نیاز دارد                                    |
| **Personalization** | دسترسی کامل به user context                            |
| **Server costs**    | بالاتر - روی initial request یک route render می‌کند     |

📖 **Implementation:** بخش‌های [Server routing](guide/ssr#server-routing) و [Authoring server-compatible components](guide/ssr#authoring-server-compatible-components) را در راهنمای SSR ببینید.

## انتخاب strategy درست

### Decision matrix

| If you need...             | Use this strategy | Why                                               |
| :------------------------- | :---------------- | :------------------------------------------------ |
| **SEO + Static content**   | SSG               | HTML از پیش render شده و سریع‌ترین load           |
| **SEO + Dynamic content**  | SSR               | Content تازه روی initial request یک route         |
| **No SEO + Interactivity** | CSR               | ساده‌ترین حالت، بدون نیاز به server               |
| **Mixed requirements**     | Hybrid            | Strategyهای متفاوت برای routeهای مختلف            |

## Interactive کردن SSR/SSG با Hydration

وقتی از SSR یا SSG استفاده می‌کنید، Angular، HTML renderشده در server را "hydrate" می‌کند تا interactive شود.

**Strategyهای در دسترس:**

- **Full hydration** - کل app یک‌جا interactive می‌شود؛ حالت پیش‌فرض
- **Incremental hydration** - بخش‌ها در زمان نیاز interactive می‌شوند؛ performance بهتر
- **Event replay** - clickها را قبل از کامل شدن hydration capture می‌کند

📖 **بیشتر یاد بگیرید:**

- [راهنمای Hydration](guide/hydration) - Setup کامل hydration
- [Incremental hydration](guide/incremental-hydration) - Hydration پیشرفته با blockهای `@defer`

## قدم بعدی

<docs-pill-row>
  <docs-pill href="/guide/ssr" title="Server-Side Rendering"/>
  <docs-pill href="/guide/hydration" title="Hydration"/>
  <docs-pill href="/guide/incremental-hydration" title="Incremental Hydration"/>
</docs-pill-row>
