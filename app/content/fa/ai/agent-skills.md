# Agent Skills

Agent Skills دستورالعمل‌ها و قابلیت‌های تخصصی و domain-specific هستند که برای AI agentهایی مثل Gemini CLI طراحی شده‌اند. این skillها راهنمایی معماری ارائه می‌کنند، کد idiomatic Angular تولید می‌کنند، و کمک می‌کنند پروژه‌های جدید با best practiceهای مدرن scaffold شوند.

با استفاده از Agent Skills می‌توانید مطمئن شوید AI agentی که با آن کار می‌کنید، به‌روزترین اطلاعات را درباره conventionهای Angular، مدل‌های reactivity مثل Signals، و ساختار پروژه دارد.

## Skillهای موجود

تیم Angular مجموعه‌ای از skillهای رسمی را نگه‌داری می‌کند که به‌طور منظم به‌روزرسانی می‌شوند تا با آخرین بهبودهای framework هماهنگ بمانند.

| Skill                   | توضیح                                                                                                                                                                                                                                                                                                 |
| :---------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`angular-developer`** | کد Angular تولید می‌کند و راهنمایی معماری ارائه می‌دهد. برای ساخت componentها، serviceها، یا دریافت best practice درباره reactivity مثل signals، linkedSignal و resource، forms، dependency injection، routing، SSR، accessibility یا ARIA، animations، styling، testing، یا CLI tooling مفید است. |
| **`angular-new-app`**   | با استفاده از Angular CLI یک Angular app جدید می‌سازد. guidelineهای مهمی برای setup و ساختاردهی مؤثر یک application مدرن Angular ارائه می‌دهد.                                                                                                                                                    |

## استفاده از Agent Skills

Agent Skills برای استفاده با agentic coding toolهایی مثل [Gemini CLI](https://geminicli.com/docs/cli/skills/)، [Antigravity](https://antigravity.google/docs/skills) و ابزارهای مشابه طراحی شده‌اند. فعال کردن یک skill، دستورالعمل‌ها و resourceهای مشخص مورد نیاز آن task را بارگذاری می‌کند.

برای استفاده از این skillها در محیط خودتان، می‌توانید دستورالعمل ابزار مورد نظر را دنبال کنید یا از یک community tool مثل [skills.sh](https://skills.sh/) استفاده کنید.

```bash
npx skills add https://github.com/angular/skills
```
