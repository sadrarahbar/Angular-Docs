<!-- TODO: need an Angular + AI logo -->

<docs-decorative-header title="ساخت با AI" imgSrc="adev/src/assets/images/what_is_angular.svg"> <!-- markdownlint-disable-line -->
Applicationهای AI-powered بسازید. با AI سریع‌تر توسعه دهید.
</docs-decorative-header>

HELPFUL: می‌خواهید ساختن در AI-powered IDE مورد علاقه‌تان را شروع کنید؟ <br>[prompt rules و best practiceها](/ai/develop-with-ai) را ببینید.

Generative AI یا GenAI با large language modelها یا LLMها امکان ساخت experienceهای application پیچیده و جذاب را فراهم می‌کند؛ از جمله محتوای شخصی‌سازی‌شده، پیشنهادهای هوشمند، تولید و درک media، خلاصه‌سازی اطلاعات، و functionalityهای dynamic.

توسعه‌ی featureهایی مثل این‌ها در گذشته به domain expertise عمیق و engineering effort قابل توجه نیاز داشت. اما محصول‌ها و SDKهای جدید مانع ورود را پایین آورده‌اند. Angular به این دلیل‌ها برای ادغام AI در web application شما مناسب است:

- APIهای templating قدرتمند Angular امکان ساخت UIهای dynamic و تمیز را از محتوای تولیدشده فراهم می‌کنند
- معماری قوی مبتنی بر signal که برای مدیریت dynamic داده و state طراحی شده است
- Angular به‌سادگی با AI SDKها و APIها integrate می‌شود

این guide نشان می‌دهد چطور می‌توانید از [Genkit](/ai#build-ai-powered-applications-with-genkit-and-angular)، [Firebase AI Logic](/ai#build-ai-powered-applications-with-firebase-ai-logic-and-angular)، و [Gemini API](/ai#build-ai-powered-applications-with-gemini-api-and-angular) استفاده کنید تا همین امروز appهای Angular خود را با AI تقویت کنید. این guide با توضیح شروع ادغام AI در Angular appها، مسیر توسعه‌ی AI-powered web app را برای شما سریع‌تر می‌کند. همچنین resourceهایی مثل starter kitها، example code و recipeهایی برای workflowهای رایج معرفی می‌کند تا سریع‌تر راه بیفتید.

برای شروع، بهتر است درک پایه‌ای از Angular داشته باشید. تازه با Angular آشنا شده‌اید؟ [essentials guide](/essentials) یا [getting started tutorials](/tutorials) را امتحان کنید.

NOTE: هرچند این صفحه integrationها و مثال‌هایی با Google AI products را نشان می‌دهد، ابزارهایی مثل Genkit model agnostic هستند و اجازه می‌دهند model خودتان را انتخاب کنید. در بسیاری از موارد، مثال‌ها و code sampleها برای solutionهای third-party دیگر هم قابل استفاده‌اند.

## شروع کار

ساخت applicationهای AI-powered حوزه‌ای جدید و با رشد سریع است. انتخاب نقطه‌ی شروع و تکنولوژی مناسب می‌تواند سخت باشد. بخش زیر سه گزینه برای انتخاب ارائه می‌دهد:

1. _Genkit_ برای ساخت full-stack applicationها امکان انتخاب [model و interface پشتیبانی‌شده با یک API یکپارچه](https://genkit.dev) را می‌دهد. برای applicationهایی که به back-end AI logic پیشرفته نیاز دارند، مثل پیشنهادهای شخصی‌سازی‌شده، ایده‌آل است.

1. _Firebase AI Logic_ یک API امن client-side برای modelهای Google فراهم می‌کند تا applicationهای فقط client-side یا mobile appها ساخته شوند. برای featureهای AI تعاملی مستقیماً داخل browser، مثل real-time text analysis یا chatbotهای پایه، مناسب‌تر است.

1. _Gemini API_ به شما اجازه می‌دهد applicationی بسازید که مستقیماً از methodها و functionalityهای exposed در API surface استفاده می‌کند؛ بهترین گزینه برای full-stack applicationها. برای applicationهایی مناسب است که به کنترل مستقیم روی AI modelها نیاز دارند، مثل custom image generation یا data processing عمیق.

### ساخت AI-powered application با Genkit و Angular

[Genkit](https://genkit.dev) یک toolkit open-source است که برای کمک به ساخت featureهای AI-powered در web و mobile appها طراحی شده است. این ابزار interface یکپارچه‌ای برای ادغام AI modelها از Google، OpenAI، Anthropic، Ollama و موارد دیگر ارائه می‌دهد تا بتوانید modelهای مختلف را بررسی و بهترین گزینه را برای نیازتان انتخاب کنید. به‌عنوان یک راهکار server-side، web appهای شما برای ادغام با Genkit به یک server environment پشتیبانی‌شده نیاز دارند؛ مثلاً یک node-based server. برای نمونه، ساخت یک full-stack app با Angular SSR کد server-side شروع کار را در اختیار شما می‌گذارد.

در ادامه چند نمونه برای ساخت با Genkit و Angular آمده است:

- [Agentic Apps with Genkit and Angular starter-kit](https://github.com/angular/examples/tree/main/genkit-angular-starter-kit) — تازه می‌خواهید با AI بسازید؟ از اینجا با یک app پایه که agentic workflow دارد شروع کنید. نقطه‌ی شروع خوبی برای اولین تجربه‌ی ساخت با AI است.

- [Use Genkit in an Angular app](https://genkit.dev/docs/frameworks/angular/) — یک application پایه بسازید که از Genkit Flows، Angular و Gemini 2.5 Flash استفاده می‌کند. این walkthrough مرحله‌به‌مرحله شما را در ساخت یک full-stack Angular application با AI featureها راهنمایی می‌کند.

- [Dynamic Story Generator app](https://github.com/angular/examples/tree/main/genkit-angular-story-generator) — یاد بگیرید یک agentic Angular app بسازید که با Genkit، Gemini و Imagen 3 کار می‌کند و بر اساس تعامل کاربر، story را به‌صورت dynamic همراه با image panelهای زیبا برای رویدادهای داستان تولید می‌کند. اگر می‌خواهید با use case پیشرفته‌تری آزمایش کنید، از اینجا شروع کنید.

  این مثال یک video walkthrough عمیق هم دارد:
  - [تماشای "Building Agentic Apps with Angular and Genkit live!"](https://youtube.com/live/mx7yZoIa2n4?feature=share)
  - [تماشای "Building Agentic Apps with Angular and Genkit live! PT 2"](https://youtube.com/live/YR6LN5_o3B0?feature=share)

- [Building Agentic apps with Firebase and Google Cloud (Barista Example)](https://developers.google.com/solutions/learn/agentic-barista) - یاد بگیرید چطور با Firebase و Google Cloud یک agentic coffee ordering app بسازید. این مثال هم از Firebase AI Logic و هم از Genkit استفاده می‌کند.

- [Creating Dynamic, Server-Driven UIs](https://github.com/angular/examples/tree/main/dynamic-sdui-app) - یاد بگیرید Agentic Angular appهایی بسازید که UI viewهای آن‌ها در runtime و بر اساس input کاربر تولید می‌شوند.

  این مثال هم یک video walkthrough عمیق دارد:
  - [تماشای "Exploring the future of web apps"](https://www.youtube.com/live/4qargCqOu70?feature=share)

### ساخت AI-powered application با Firebase AI Logic و Angular

[Firebase AI Logic](https://firebase.google.com/products/vertex-ai-in-firebase) راه امنی برای تعامل مستقیم با Vertex AI Gemini API یا Imagen API از داخل web و mobile appهای شما فراهم می‌کند. این موضوع برای Angular developerها جذاب است چون appها می‌توانند full-stack یا فقط client-side باشند. اگر در حال توسعه‌ی یک application فقط client-side هستید، Firebase AI Logic گزینه‌ی مناسبی برای افزودن AI به web appهای شماست.

نمونه‌ای از ساخت با Firebase AI Logic و Angular:

- [Firebase AI Logic x Angular Starter Kit](https://github.com/angular/examples/tree/main/firebase-ai-logic-angular-example) - از این starter-kit برای ساخت یک e-commerce application با chat agentی استفاده کنید که می‌تواند task انجام دهد. اگر تجربه‌ی ساخت با Firebase AI Logic و Angular ندارید، از اینجا شروع کنید.

  این مثال شامل یک [video walkthrough عمیق برای توضیح functionality و نمایش نحوه اضافه کردن featureهای جدید](https://youtube.com/live/4vfDz2al_BI) است.

### ساخت AI-powered application با Gemini API و Angular

[Gemini API](https://ai.google.dev/gemini-api/docs) دسترسی به state-of-the-art modelهای Google را فراهم می‌کند که از audio، image، video و text input پشتیبانی می‌کنند. این modelها برای use caseهای مشخص optimize شده‌اند؛ [در documentation سایت Gemini API بیشتر بخوانید](https://ai.google.dev/gemini-api/docs/models).

- [AI Text Editor Angular app template](https://github.com/FirebaseExtended/firebase-framework-tools/tree/main/starters/angular/ai-text-editor) - با این template از یک text editor کاملاً functional شروع کنید که featureهای AI-powered مثل refine کردن متن، expand کردن متن و formalize کردن متن دارد. این نقطه‌ی شروع خوبی برای تجربه گرفتن در call کردن Gemini API از طریق HTTP است.

- [AI Chatbot app template](https://github.com/FirebaseExtended/firebase-framework-tools/tree/main/starters/angular/ai-chatbot) - این template با یک chatbot user interface شروع می‌شود که از طریق HTTP با Gemini API ارتباط برقرار می‌کند.

## Best Practices

### اتصال به model providerها و امن نگه داشتن API Credentialها

هنگام اتصال به model providerها، مهم است API secretهای خود را امن نگه دارید. _هرگز API key خود را داخل فایلی که به client ارسال می‌شود، مثل `environments.ts`، قرار ندهید_.

معماری application شما تعیین می‌کند کدام AI APIها و ابزارها را انتخاب کنید. به‌طور مشخص، انتخاب باید بر اساس client-side یا server-side بودن application انجام شود. ابزارهایی مثل Firebase AI Logic برای client-side code اتصال امن به model APIها فراهم می‌کنند. اگر می‌خواهید از API متفاوتی نسبت به Firebase AI Logic استفاده کنید یا ترجیح می‌دهید model provider دیگری داشته باشید، ساخت یک proxy-server یا حتی [Cloud Functions for Firebase](https://firebase.google.com/docs/functions) را در نظر بگیرید تا به‌عنوان proxy عمل کند و API keyهای شما expose نشوند.

برای نمونه‌ی اتصال با یک client-side app، code مربوط به [Firebase AI Logic Angular example repository](https://github.com/angular/examples/tree/main/firebase-ai-logic-angular-example) را ببینید.

برای اتصال server-side به model APIهایی که API key نیاز دارند، بهتر است از secrets manager یا environment variable استفاده کنید، نه `environments.ts`. باید best practiceهای استاندارد مربوط به امن‌سازی API keyها و credentialها را دنبال کنید. Firebase حالا همراه آخرین updateهای Firebase App Hosting یک secrets manager جدید ارائه می‌دهد. برای اطلاعات بیشتر، [documentation رسمی](https://firebase.google.com/docs/app-hosting/configure) را ببینید.

برای نمونه‌ی اتصال server-side در یک full-stack application، code مربوط به [Angular AI Example (Genkit and Angular Story Generator) repository](https://github.com/angular/examples/tree/main/genkit-angular-story-generator) را ببینید.

### استفاده از Tool Calling برای تقویت appها

اگر می‌خواهید agentic workflow بسازید، یعنی agentها بتوانند بر اساس prompt عمل کنند و از ابزارها برای حل مسئله استفاده کنند، از "tool calling" استفاده کنید. Tool calling، که با نام function calling هم شناخته می‌شود، راهی است برای دادن توانایی به LLMها تا به applicationی که آن‌ها را صدا زده request بفرستند. شما به‌عنوان developer تعیین می‌کنید چه toolهایی در دسترس‌اند و کنترل می‌کنید این toolها چطور یا چه زمانی صدا زده شوند.

Tool calling ادغام AI در web appهای شما را فراتر از chatbotهای پرسش و پاسخ می‌برد. در واقع می‌توانید با function calling API مربوط به model provider خود، model را قادر کنید request برای function call بدهد. toolهای موجود می‌توانند actionهای پیچیده‌تری را در context application شما انجام دهند.

در [e-commerce example](https://github.com/angular/examples/blob/main/firebase-ai-logic-angular-example/src/app/ai.service.ts#L88) از [Angular examples repository](https://github.com/angular/examples)، LLM برای به‌دست آوردن context لازم و انجام taskهای پیچیده‌تر، مثل محاسبه قیمت گروهی از itemهای فروشگاه، درخواست call کردن functionهای inventory را می‌دهد. scope API موجود به شما به‌عنوان developer بستگی دارد، درست مثل اینکه تصمیم بگیرید آیا function درخواست‌شده توسط LLM واقعاً call شود یا نه. شما کنترل flow اجرا را حفظ می‌کنید. برای مثال می‌توانید functionهای مشخصی از یک service را expose کنید، اما نه همه functionهای آن service را.

### مدیریت responseهای non-deterministic

از آنجا که modelها می‌توانند نتیجه‌های non-deterministic برگردانند، applicationهای شما باید با این موضوع در ذهن طراحی شوند. چند strategy که می‌توانید در پیاده‌سازی application استفاده کنید:

- Promptها و parameterهای model، مثل [temperature](https://ai.google.dev/gemini-api/docs/prompting-strategies)، را برای responseهای کم‌وبیش deterministic تنظیم کنید. در بخش [prompting strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies) در [ai.google.dev](https://ai.google.dev/) می‌توانید بیشتر بخوانید.
- از strategy «human in the loop» استفاده کنید؛ یعنی یک انسان قبل از ادامه workflow خروجی‌ها را verify کند. workflowهای application خود را طوری بسازید که operatorها، چه انسان و چه modelهای دیگر، بتوانند خروجی‌ها را verify و decisionهای کلیدی را confirm کنند.
- از tool یا function calling و schema constraintها استفاده کنید تا responseهای model را به formatهای از پیش تعریف‌شده هدایت و محدود کنید و predictability پاسخ‌ها افزایش پیدا کند.

حتی با در نظر گرفتن این strategyها و تکنیک‌ها، باید fallbackهای منطقی در طراحی application لحاظ شوند. استانداردهای موجود application resiliency را دنبال کنید. برای مثال، قابل قبول نیست که application به‌خاطر در دسترس نبودن یک resource یا API crash کند. در چنین حالتی، یک error message به کاربر نمایش داده می‌شود و در صورت امکان، optionهایی برای قدم‌های بعدی هم نشان داده می‌شود. ساخت applicationهای AI-powered هم همین ملاحظه را نیاز دارد. مطمئن شوید response با خروجی مورد انتظار هم‌راستا است و اگر نبود، از طریق [graceful degradation](https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation) یک "safe landing" فراهم کنید. این موضوع برای outageهای API مربوط به LLM providerها هم صدق می‌کند.

این مثال را در نظر بگیرید: LLM provider پاسخ نمی‌دهد. یک strategy احتمالی برای مدیریت outage:

- response کاربر را ذخیره کنید تا در سناریوی retry، همین حالا یا بعداً، استفاده شود
- کاربر را با پیام مناسب از outage آگاه کنید، بدون اینکه اطلاعات sensitive آشکار شود
- وقتی serviceها دوباره در دسترس بودند، conversation را بعداً ادامه دهید.

## قدم‌های بعدی

برای یادگیری درباره LLM promptها و setup کردن AI IDE، guideهای زیر را ببینید:

<docs-pill-row>
  <docs-pill href="ai/develop-with-ai" title="LLM prompts and IDE setup"/>
  <docs-pill href="ai/agent-skills" title="Agent Skills"/>
</docs-pill-row>
