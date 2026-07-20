# Angular CLI MCP Server

Angular CLI شامل یک Model Context Protocol یا MCP server است که به AI assistantها مثل Cursor، Antigravity، JetBrains AI و ابزارهای مشابه اجازه می‌دهد مستقیماً با Angular CLI تعامل داشته باشند. این server ابزارهایی برای code generation، تحلیل workspace، و اجرای build/test فراهم می‌کند.

<docs-callout title="ادغام با Angular AI Agent Skills">
  اگر host environment شما از Agent Skills سفارشی پشتیبانی می‌کند، مثل Antigravity، می‌توانید Angular CLI MCP server را با [Angular AI Skills](https://angular.dev/ai/skills) رسمی ترکیب کنید. skillها راهنمایی عمیق در سطح دستورالعمل و coding standardها را به agent می‌دهند، و MCP server ابزارهای عملیاتی مثل compile کردن، اجرای testها و تحلیل workspace را فراهم می‌کند تا آن guidelineها اجرا شوند؛ نتیجه یک development agent کامل و قدرتمند است.
</docs-callout>

## شروع کار

برای استفاده از MCP server، host environment خودتان، یعنی IDE یا CLI، را طوری configure کنید که `npx @angular/cli mcp` را اجرا کند.

<docs-tab-group>
  <docs-tab label="Antigravity IDE">
    در root پروژه‌ی خودتان فایلی با نام `.antigravity/mcp.json` بسازید:

    ```json
    {
      "mcpServers": {
        "angular-cli": {
          "command": "npx",
          "args": ["-y", "@angular/cli", "mcp"]
        }
      }
    }
    ```

  </docs-tab>

  <docs-tab label="Cursor">
    در root پروژه `.cursor/mcp.json` بسازید، یا به‌صورت global در `~/.cursor/mcp.json`:

    ```json
    {
      "mcpServers": {
        "angular-cli": {
          "command": "npx",
          "args": ["-y", "@angular/cli", "mcp"]
        }
      }
    }
    ```

  </docs-tab>

  <docs-tab label="VS Code">
    فایل `.vscode/mcp.json` را بسازید:

    ```json
    {
      "servers": {
        "angular-cli": {
          "command": "npx",
          "args": ["-y", "@angular/cli", "mcp"]
        }
      }
    }
    ```

  </docs-tab>
</docs-tab-group>

## ابزارهای موجود به‌صورت پیش‌فرض

وقتی MCP server فعال باشد، AI agentها به ابزارهای زیر دسترسی دارند:

| نام                         | توضیح                                                                                                      |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------- |
| `ai_tutor`                  | یک tutor تعاملی Angular با قدرت AI را اجرا می‌کند.                                                        |
| `devserver.start`           | یک dev server را به‌صورت asynchronous اجرا می‌کند (`ng serve`). بلافاصله برمی‌گردد.                     |
| `devserver.stop`            | dev server را متوقف می‌کند.                                                                                |
| `devserver.wait_for_build`  | logهای جدیدترین build را در یک dev server در حال اجرا برمی‌گرداند.                                        |
| `get_best_practices`        | Angular Best Practices Guide را دریافت می‌کند؛ برای standalone componentها، typed forms و موارد مشابه مهم است. |
| `list_projects`             | با خواندن `angular.json` همه applicationها و libraryهای workspace را فهرست می‌کند.                       |
| `onpush_zoneless_migration` | کد را تحلیل می‌کند و planی برای مهاجرت آن به `OnPush` change detection می‌دهد؛ پیش‌نیاز zoneless.        |
| `run_target`                | یک target پیکربندی‌شده را اجرا می‌کند؛ مثل build، test، lint، e2e یا deploy.                             |
| `search_documentation`      | documentation رسمی را در `https://angular.dev` جست‌وجو می‌کند.                                           |

## Workflowهای رایج

این workflowها نشان می‌دهند AI assistantها چطور ابزارهای مختلف MCP را هماهنگ می‌کنند تا storyهای پیچیده‌ی developer را خودکار انجام دهند.

### 1. Performance Tuning: مهاجرت Zoneless و OnPush

AI agent عملکرد change detection را optimize می‌کند و componentها را به وضعیتی آماده برای zoneless مهاجرت می‌دهد.

1. **کشف Workspace**: AI agent ابزار `list_projects` را صدا می‌زند تا componentها، projectها، و configurationهای style/test را در workspace پیدا کند.
2. **Schematic Modernization به‌عنوان پیش‌نیاز**: AI agent هر migration پیش‌نیاز مربوط به signalها را با commandهای استاندارد `ng generate` اجرا می‌کند؛ مثل Signal Inputs و Signal Queries.
3. **برنامه‌ریزی Migration**: AI agent ابزار `onpush_zoneless_migration` را با absolute path دایرکتوری یا فایل component صدا می‌زند.
4. **اعمال تغییرات**: AI agent تنها تغییر actionable برگردانده‌شده توسط ابزار را به‌صورت خودکار روی codebase اعمال می‌کند.
5. **اعتبارسنجی تغییرات**: AI agent با صدا زدن `run_target` و تنظیم target parameter روی `"test"`، unit testها را اجرا می‌کند.
6. **تکرار**: AI agent دوباره `onpush_zoneless_migration` را صدا می‌زند تا step بعدی را بگیرد و این روند را تا زمانی ادامه می‌دهد که ابزار اعلام کند migration کامل شده است.

### 2. Feature Development و چرخه TDD

AI agent هنگام توسعه featureهای جدید، research، implementation و verification را خودکار می‌کند.

1. **تحقیق درباره API و Syntax**: AI agent از `search_documentation` برای پیدا کردن Angular APIها یا ruleهای syntax استفاده می‌کند؛ مثلاً optionهای block مربوط به `@defer`.
2. **بارگذاری Coding Standardها**: AI agent ابزار `get_best_practices` را با workspace path صدا می‌زند تا ruleهای coding هماهنگ با نسخه Angular را بارگذاری کند.
3. **شروع Local Dev Server**: AI agent با صدا زدن `devserver.start` یک background server اجرا می‌کند.
4. **پایش Build**: AI agent از `devserver.wait_for_build` برای دنبال کردن build logها استفاده می‌کند تا هنگام edit کردن کد مطمئن شود compilation موفق است.
5. **نوشتن و اجرای Testها**: AI agent test framework پروژه را، مثل Jasmine، Jest یا Vitest، از طریق `list_projects` تشخیص می‌دهد، test file مناسب را می‌نویسد و testها را با `run_target` و مقدار `"test"` اجرا می‌کند.
6. **توقف Dev Server**: در پایان، AI agent با صدا زدن `devserver.stop`، dev server فعال را متوقف می‌کند.

### 3. Onboarding و یادگیری Developer

AI agent در یک sandbox تعاملی، developer را در مفاهیم Angular راهنمایی می‌کند.

1. **کشف Projectها**: AI agent ابزار `list_projects` را صدا می‌زند تا workspace را scan کند و ساختار codebase را تشخیص دهد.
2. **اجرای Tutor**: AI agent ابزار `ai_tutor` را اجرا می‌کند تا curriculum instructions، persona و tutoring guidelineها بارگذاری شوند.
3. **دنبال کردن Curriculum**: AI agent کاربر را در curriculum راهنمایی می‌کند، conceptها را توضیح می‌دهد و از او می‌خواهد componentهایی را بسازد یا تغییر دهد.
4. **پیاده‌سازی و Verification**: AI agent کمک می‌کند sandbox code پیاده‌سازی شود و تغییرات را با `run_target` و مقدار `"test"` یا `"build"` بررسی می‌کند.

## Command Optionها

می‌توانید argumentها را در آرایه `args` مربوط به configuration به MCP server پاس بدهید:

- `--read-only`: فقط ابزارهایی را register می‌کند که project را تغییر نمی‌دهند.
- `--local-only`: فقط ابزارهایی را register می‌کند که به internet connection نیاز ندارند.

نمونه برای read-only mode:

```json
"args": ["-y", "@angular/cli", "mcp", "--read-only"]
```
