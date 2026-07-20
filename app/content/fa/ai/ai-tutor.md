# Angular AI Tutor

Angular AI Tutor طراحی شده تا شما را به‌صورت تعاملی و مرحله‌به‌مرحله در ساخت یک Angular application کامل و مدرن از پایه راهنمایی کند. شما latest patternها و best practiceها را با ساخت یک پروژه واقعی و ملموس یاد می‌گیرید: یک **"Smart Recipe Box"** برای ساخت و مدیریت recipeها.

هدف ما تقویت تفکر انتقادی و کمک به ماندگاری یادگیری شماست. به‌جای اینکه فقط کد آماده بدهد، tutor conceptها را توضیح می‌دهد، example نشان می‌دهد، و بعد exerciseهای مخصوص پروژه را به شما می‌دهد تا خودتان حل کنید.

## شروع کار

می‌توانید از طریق [Angular MCP server](ai/mcp) به AI tutor دسترسی داشته باشید.

1. Angular MCP server را [نصب کنید](ai/mcp#get-started)
2. یک Angular project جدید بسازید: `ng new <project-name>`
3. در یک AI-powered editor یا tool، مثل [Gemini CLI](https://geminicli.com/)، وارد project جدید شوید (`cd <project-name>`)
4. promptی مثل `launch the Angular AI tutor` وارد کنید
   ![A screenshot demonstrating how to launch the Angular AI Tutor in the Gemini CLI.](assets/images/launch-ai-tutor.png 'Launch the Angular AI Tutor')

## استفاده از AI Tutor

هر module با توضیح کوتاهی از concept شروع می‌شود.
![A screenshot of the Angular AI Tutor presenting a brief concept explanation.](assets/images/ai-tutor-preview-1.png 'Angular AI Tutor explanation')
در صورت نیاز، tutor یک code example برای نمایش concept ارائه می‌کند.
![A screenshot of the Angular AI Tutor showing a code example.](assets/images/ai-tutor-preview-2.png 'Angular AI Tutor code example')
tutor همچنین یک exercise باز ارائه می‌دهد تا میزان درک شما را بسنجد.
![A screenshot of the Angular AI Tutor providing an exercise.](assets/images/ai-tutor-preview-3.png 'Angular AI Tutor exercise')
در پایان، tutor قبل از رفتن به module بعدی، کار شما را بررسی می‌کند.
![A screenshot of the Angular AI Tutor checking the user's work.](assets/images/ai-tutor-preview-4.png 'Angular AI Tutor check')

## نحوه کار: چرخه یادگیری

برای هر topic جدید، یک learning loop را دنبال می‌کنید که بر تفکر انتقادی تأکید دارد تا آنچه یاد می‌گیرید بهتر در ذهن بماند.

1. **یادگیری Concept:** tutor یک feature اصلی Angular را کوتاه توضیح می‌دهد و یک generic code example برای نشان دادن آن ارائه می‌کند.
2. **به‌کارگیری دانسته‌ها:** بلافاصله یک hands-on exercise می‌گیرید. tutor این exerciseها را در سطح بالا، همراه objectiveها و expected outcomeها ارائه می‌کند تا شما را به فکر کردن درباره solution تشویق کند.
3. **دریافت Feedback و Support:** وقتی آماده بودید، به tutor اطلاع دهید. tutor به‌صورت خودکار **project fileهای شما را می‌خواند** تا بررسی کند solution شما درست است. اگر گیر کردید، کنترل کامل دست شماست. می‌توانید برای راهنمایی بیشتر درخواست **"hint"** بدهید، یا با نوشتن **"detailed guide"** یا **"step-by-step instructions"** دستورالعمل مرحله‌به‌مرحله بگیرید.

وقتی موفق شدید، tutor مستقیم به topic بعدی می‌رود. همچنین هر زمان می‌توانید از tutor اطلاعات بیشتری درباره یک topic بخواهید یا سؤال‌های مرتبط با Angular بپرسید.

---

## **Featureها و Commandها**

کنترل تجربه یادگیری دست شماست. هر زمان می‌توانید از این featureها استفاده کنید:

### **ترک کردن و برگشتن**

راحت pause کنید. progress شما به کد projectتان وابسته است. وقتی برای session جدید برگردید، tutor به‌صورت خودکار فایل‌های شما را analyze می‌کند تا دقیقاً تشخیص دهد کجا متوقف شده‌اید و بتوانید بدون دردسر از همان‌جا ادامه دهید.

**Pro Tip:** شدیداً پیشنهاد می‌کنیم برای ذخیره progress از Git استفاده کنید. بعد از کامل کردن هر module، بهتر است تغییراتتان را commit کنید؛ برای مثال `git commit -m "Complete Phase 1, Module 8"`. این کار یک checkpoint شخصی می‌سازد که هر زمان می‌توانید به آن برگردید.

### **تنظیم Experience Level**

می‌توانید experience level خودتان را روی **Beginner (1-3)**، **Intermediate (4-7)**، یا **Experienced (8-10)** تنظیم کنید. هر زمان در session می‌توانید این تنظیم را تغییر دهید و tutor بلافاصله teaching style خود را مطابق آن adapt می‌کند.

**Example Prompts:**

- "Set my experience level to beginner."
- "Change my rating to 8."

### **دیدن Full Learning Plan**

می‌خواهید تصویر کلی را ببینید یا بررسی کنید چقدر جلو آمده‌اید؟ فقط table of contents را درخواست کنید.

**Example Prompts:**

- "Where are we?"
- "Show the table of contents."
- "Show the plan."

tutor full learning plan را نمایش می‌دهد و location فعلی شما را mark می‌کند.

### **نکته‌ای درباره Styling**

tutor برای اینکه application ظاهر تمیزی داشته باشد، styling پایه اعمال می‌کند. با این حال، شدیداً تشویق می‌شوید styling خودتان را اعمال کنید تا app واقعاً متعلق به خودتان شود.

### **رد کردن Module فعلی**

اگر ترجیح می‌دهید به topic بعدی در learning path بروید، می‌توانید از tutor بخواهید exercise فعلی را skip کند.

**Example Prompts:**

- "Skip this section."
- "Auto-complete this step for me."

tutor تأیید شما را می‌گیرد و بعد solution کامل کد مربوط به module فعلی را ارائه می‌کند و تلاش می‌کند updateهای لازم را به‌صورت خودکار اعمال کند تا بتوانید با module بعدی روان ادامه دهید.

### **رفتن به هر Topic دلخواه**

اگر می‌خواهید topic مشخصی را خارج از ترتیب یاد بگیرید، مثلاً از basics مستقیم به forms بروید، می‌توانید. tutor کد لازم برای update کردن project به starting point درست برای module انتخاب‌شده را ارائه می‌کند و تلاش می‌کند updateهای لازم را به‌صورت خودکار اعمال کند.

**Example Prompts:**

- "Take me to the forms lesson."
- "I want to learn about Route Guards now."
- "Jump to the section on Services."

---

## **Troubleshooting**

### مشکل‌های Setup

**`"launch the Angular AI tutor"` کاری انجام نمی‌دهد؟**

اول مطمئن شوید یک project باز کرده‌اید. tutor برای کار کردن به یک Angular project واقعی نیاز دارد:

```bash
ng new my-app
cd my-app
code .
```

بعد مطمئن شوید MCP server شما در حال اجراست. در VS Code، فایل `.vscode/mcp.json` را باز کنید و روی دکمه **"Start"** در بالای فایل کلیک کنید.

وقتی `"launch the Angular AI tutor"` را تایپ می‌کنید، باید یک checkmark ببینید که می‌گوید
"Reviewed .vscode/mcp.json and ran start task" و یک prompt که می‌پرسد
"Allow task run?" — روی Allow کلیک کنید.

**هنوز کار نمی‌کند؟**

اول `#angular-cli` را تایپ کنید تا Angular context بارگذاری شود، سپس tutorial URL را paste کنید: `https://angular.dev/ai/ai-tutor`

**چطور بررسی کنیم server در حال اجراست**

Command Palette را باز کنید (`Ctrl+Shift+P`)، عبارت "MCP: List Running Servers" را تایپ کنید، و دنبال "angular-cli" در list بگردید.

---

### مشکل‌های عمومی

اگر tutor درست پاسخ نمی‌دهد یا فکر می‌کنید application شما مشکلی دارد، این چند راه را امتحان کنید:

1. **عبارت "proceed" را تایپ کنید:** این کار اغلب می‌تواند tutor را وادار کند در صورت گیر کردن، به step بعدی ادامه دهد.
2. **Tutor را اصلاح کنید:** اگر tutor درباره progress شما اشتباه می‌کند، مثلاً می‌گوید روی Module 3 هستید ولی Module 8 را تمام کرده‌اید، فقط به آن بگویید. برای مثال: _"I'm actually on Module 8."_ tutor کد شما را دوباره evaluate می‌کند و خودش را تنظیم می‌کند.
3. **UI خود را Verify کنید:** اگر می‌خواهید مطمئن شوید user interface application شما باید چه شکلی باشد، از tutor بپرسید. برای مثال: _"What should I see in my UI?"_
4. **Browser Window را Reload کنید:** refresh می‌تواند بسیاری از مشکل‌های مرتبط با application را حل کند.
5. **Browser را Hard Restart کنید:** گاهی errorها فقط در developer console مرورگر ظاهر می‌شوند. hard restart می‌تواند به پاک شدن issueهای زیرساختی مرتبط با application کمک کند.
6. **یک Chat جدید شروع کنید:** همیشه می‌توانید برای حذف history موجود و شروع تازه، یک chat جدید باز کنید. tutor فایل‌های شما را می‌خواند تا آخرین stepی که روی آن بوده‌اید را پیدا کند.

## **مسیر یادگیری شما: Phased Path**

شما application خود را در یک مسیر پنج‌مرحله‌ای می‌سازید. می‌توانید این مسیر را از ابتدا تا انتها دنبال کنید تا یک Angular application کامل و fully-functional بسازید. هر module منطقی روی قبلی بنا می‌شود و شما را از basics به featureهای پیشرفته و واقعی می‌رساند.

**نکته‌ای درباره Automated Setup:** بعضی moduleها به setup step نیاز دارند، مثل ساخت interfaceها یا mock data. در این موارد، tutor کد و file instructionها را ارائه می‌کند. شما مسئول ساخت و تغییر این فایل‌ها طبق دستورالعمل هستید، قبل از اینکه exercise شروع شود.

### **Phase 1: Angular Fundamentals**

- **Module 1:** Getting Started
- **Module 2:** Dynamic Text with Interpolation
- **Module 3:** Event Listeners (`(click)`)

### **Phase 2: State and Signals**

- **Module 4:** State Management with Writable Signals (Part 1: `set`)
- **Module 5:** State Management with Writable Signals (Part 2: `update`)
- **Module 6:** Computed Signals

### **Phase 3: Component Architecture**

- **Module 7:** Template Binding (Properties & Attributes)
- **Module 8:** Creating & Nesting Components
- **Module 9:** Component Inputs with Signals
- **Module 10:** Styling Components
- **Module 11:** List Rendering with `@for`
- **Module 12:** Conditional Rendering with `@if`

### **Phase 4: Advanced Features & Architecture**

- **Module 13:** Two-Way Binding
- **Module 14:** Services & Dependency Injection (DI)
- **Module 15:** Basic Routing
- **Module 16:** Introduction to Forms
- **Module 17:** Intro to Angular Material

### **Phase 5: Signal Forms**

- **Module 18**: **Introduction to Signal Forms**
- **Module 19**: **Submitting & Resetting**
- **Module 20**: **Validation in Signal Forms**
- **Module 21**: **Field State & Error Messages**

---

## **نکته‌ای درباره AI و Feedback**

این tutor توسط یک Large Language Model یا LLM قدرت می‌گیرد. با اینکه تلاش زیادی کرده‌ایم آن را expert کنیم، AIها ممکن است اشتباه کنند. اگر با توضیح یا code exampleی روبه‌رو شدید که نادرست به نظر می‌رسد، لطفاً به ما اطلاع دهید. می‌توانید tutor را اصلاح کنید و او از feedback شما برای تنظیم response خود استفاده می‌کند.

برای bugهای فنی یا feature requestها، لطفاً [یک issue ثبت کنید](https://github.com/angular/angular-cli/issues).
