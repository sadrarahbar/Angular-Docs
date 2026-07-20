# LLM prompts و setup کردن AI IDE

تولید کد با large language modelها یا LLMها یکی از حوزه‌هایی است که به‌سرعت برای developerها مهم‌تر می‌شود. هرچند LLMها معمولاً می‌توانند کد قابل اجرا تولید کنند، اما تولید کد دقیق برای frameworkهایی مثل Angular که پیوسته در حال تکامل‌اند، می‌تواند چالش‌برانگیز باشد.

دستورالعمل‌های پیشرفته و prompting، به یک استاندارد در حال شکل‌گیری برای پشتیبانی از code generation مدرن با جزئیات domain-specific تبدیل شده‌اند. این بخش شامل محتوا و resourceهای curated است تا code generation برای Angular و LLMها دقیق‌تر شود.

## Promptهای سفارشی و System Instructions

برای بهتر شدن تجربه‌ی تولید کد با LLMها، از یکی از فایل‌های سفارشی و domain-specific زیر استفاده کنید.

NOTE: این فایل‌ها به‌صورت منظم به‌روزرسانی می‌شوند تا با conventionهای Angular هماهنگ بمانند.

در ادامه مجموعه‌ای از دستورالعمل‌ها آمده که به LLMها کمک می‌کند کد درست و مطابق best practiceهای Angular تولید کنند. این فایل می‌تواند به‌عنوان system instructions به AI tooling شما اضافه شود، یا همراه prompt شما به‌عنوان context استفاده شود.

<docs-code language="md" path="packages/core/resources/best-practices.md" class="compact"/>

<a download href="/assets/context/best-practices.md" target="_blank">برای دانلود فایل best-practices.md اینجا کلیک کنید.</a>

## فایل‌های Rules

چندین editor، مثل <a href="https://studio.firebase.google.com?utm_source=adev&utm_medium=website&utm_campaign=BUILD_WITH_AI_ANGULAR&utm_term=angular_devrel&utm_content=build_with_ai_angular_firebase_studio" target="_blank">Firebase Studio</a>، فایل‌های rules دارند که برای دادن context مهم به LLMها مفیدند.

| Environment/IDE      | فایل Rules                                                                                                             | دستورالعمل نصب                                                                                                                                                   |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Firebase Studio      | <a download href="/assets/context/airules.md" target="_blank">airules.md</a>                                           | <a href="https://firebase.google.com/docs/studio/set-up-gemini#custom-instructions" target="_blank">پیکربندی `airules.md`</a>                                    |
| Copilot powered IDEs | <a download="copilot-instructions.md" href="/assets/context/guidelines.md" target="_blank">copilot-instructions.md</a> | <a href="https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions" target="_blank">پیکربندی `.github/copilot-instructions.md`</a>   |
| Cursor               | <a download href="/assets/context/angular-20.mdc" target="_blank">cursor.md</a>                                        | <a href="https://docs.cursor.com/context/rules" target="_blank">پیکربندی `cursorrules.md`</a>                                                                    |
| JetBrains IDEs       | <a download href="/assets/context/guidelines.md" target="_blank">guidelines.md</a>                                     | <a href="https://www.jetbrains.com/help/junie/customize-guidelines.html" target="_blank">پیکربندی `guidelines.md`</a>                                            |
| VS Code              | <a download=".instructions.md" href="/assets/context/guidelines.md" target="_blank">.instructions.md</a>               | <a href="https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions" target="_blank">پیکربندی `.instructions.md`</a>                  |
| Windsurf             | <a download href="/assets/context/guidelines.md" target="_blank">guidelines.md</a>                                     | <a href="https://docs.windsurf.com/windsurf/cascade/memories#rules" target="_blank">پیکربندی `guidelines.md`</a>                                                 |

## راه‌اندازی Angular CLI MCP Server

Angular CLI شامل یک [Model Context Protocol (MCP) server](https://modelcontextprotocol.io/) آزمایشی است که به AI assistantها در محیط توسعه‌ی شما اجازه می‌دهد با Angular CLI تعامل داشته باشند.

[**یاد بگیرید چطور Angular CLI MCP Server را راه‌اندازی کنید**](/ai/mcp)

## دادن Context با `llms.txt`

`llms.txt` یک استاندارد پیشنهادی برای وب‌سایت‌هاست که کمک می‌کند LLMها محتوای آن‌ها را بهتر بفهمند و پردازش کنند. تیم Angular دو نسخه از این فایل را توسعه داده تا LLMها و ابزارهایی که از LLMها برای code generation استفاده می‌کنند، بتوانند کد مدرن Angular بهتری بسازند.

- <a href="/llms.txt" target="_blank">llms.txt</a> - یک فایل index که به فایل‌ها و resourceهای کلیدی لینک می‌دهد.
- <a href="/assets/context/llms-full.txt" target="_blank">llms-full.txt</a> - مجموعه‌ای کامل‌تر و compile شده از resourceها که توضیح می‌دهد Angular چطور کار می‌کند و چطور باید Angular application ساخت.

برای اطلاعات بیشتر درباره‌ی ادغام AI در Angular applicationها، حتماً [صفحه overview](/ai) را ببینید.

## Web Codegen Scorer

تیم Angular ابزار [Web Codegen Scorer](https://github.com/angular/web-codegen-scorer) را توسعه داده و open-source کرده است؛ ابزاری برای ارزیابی و امتیازدهی کیفیت web code تولیدشده با AI. می‌توانید از این ابزار برای تصمیم‌گیری مبتنی بر شواهد درباره‌ی کد تولیدشده با AI استفاده کنید؛ مثلاً fine-tune کردن promptها برای افزایش دقت کد Angular تولیدشده توسط LLM. این promptها می‌توانند به‌عنوان system instructions در AI tooling شما قرار بگیرند یا همراه prompt شما به‌عنوان context استفاده شوند. همچنین می‌توانید با این ابزار کیفیت کد تولیدشده توسط modelهای مختلف را مقایسه کنید و با تکامل modelها و agentها، کیفیت را در طول زمان پایش کنید.
