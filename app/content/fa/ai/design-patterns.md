# Design patternها برای AI SDKها و signal APIها

تعامل با AI و Large Language Model APIها یا LLM APIها چالش‌های خاصی ایجاد می‌کند؛ مثل مدیریت operationهای asynchronous، کار با streaming data، و طراحی user experience پاسخ‌گو برای network requestهایی که ممکن است کند یا unreliable باشند. [signals](guide/signals) در Angular و API مربوط به [`resource`](guide/signals/resource) ابزارهای قدرتمندی برای حل تمیز این مسئله‌ها فراهم می‌کنند.

## Trigger کردن requestها با signals

یک pattern رایج هنگام کار با promptهایی که کاربر وارد می‌کند این است که input زنده‌ی کاربر را از submitted value که API call را trigger می‌کند جدا کنید.

1. raw input کاربر را هنگام تایپ در یک signal ذخیره کنید
2. وقتی کاربر submit می‌کند، مثلاً با کلیک روی یک button، signal دوم را با محتوای signal اول update کنید.
3. signal دوم را در فیلد **`params`** مربوط به `resource` استفاده کنید.

این setup مطمئن می‌کند function مربوط به **`loader`** در resource فقط وقتی اجرا شود که کاربر prompt خود را صریحاً submit کرده باشد، نه با هر keystroke. می‌توانید parameterهای signal اضافی، مثل `sessionId` یا `userId` را هم که برای ساخت sessionهای ماندگار LLM مفیدند، در فیلد `loader` استفاده کنید. با این روش، request همیشه مقدار فعلی این parameterها را استفاده می‌کند بدون اینکه asynchronous function تعریف‌شده در فیلد `loader` دوباره trigger شود.

بسیاری از AI SDKها helper methodهایی برای API callها ارائه می‌کنند. برای مثال، client library مربوط به Genkit یک method به نام `runFlow` برای call کردن Genkit flowها expose می‌کند که می‌توانید آن را از `loader` یک resource صدا بزنید. برای APIهای دیگر، می‌توانید از [`httpResource`](guide/signals/resource#reactive-data-fetching-with-httpresource) استفاده کنید.

مثال زیر یک `resource` را نشان می‌دهد که بخش‌هایی از یک story تولیدشده با AI را fetch می‌کند. `loader` فقط وقتی trigger می‌شود که signal مربوط به `storyInput` تغییر کند.

```ts
// A resource that fetches three parts of an AI generated story
storyResource = resource({
  // The default value to use before the first request or on error
  defaultValue: DEFAULT_STORY,
  // The loader is re-triggered when this signal changes
  params: () => this.storyInput(),
  // The async function to fetch data
  loader: ({params}): Promise<StoryData> => {
    // The params value is the current value of the storyInput signal
    const url = this.endpoint();
    return runFlow({
      url,
      input: {
        userInput: params,
        sessionId: this.storyService.sessionId(), // Read from another signal
      },
    });
  },
});
```

## آماده‌سازی داده LLM برای templateها

می‌توانید LLM APIها را طوری configure کنید که structured data برگردانند. strongly typing کردن `resource` مطابق output مورد انتظار از LLM، type safety و editor autocompletion بهتری فراهم می‌کند.

برای مدیریت state مشتق‌شده از یک resource، از `computed` signal یا `linkedSignal` استفاده کنید. از آنجا که `linkedSignal` [به مقدارهای قبلی دسترسی می‌دهد](guide/signals/linked-signal)، می‌تواند برای انواع use caseهای مرتبط با AI به کار برود، از جمله:

- ساخت chat history
- حفظ یا سفارشی‌سازی داده‌ای که templateها هنگام تولید محتوا توسط LLMها نمایش می‌دهند

در مثال زیر، `storyParts` یک `linkedSignal` است که جدیدترین بخش‌های story برگشتی از `storyResource` را به array موجود از story partها اضافه می‌کند.

```ts
storyParts = linkedSignal<string[], string[]>({
  // The source signal that triggers the computation
  source: () => this.storyResource.value().storyParts,
  // The computation function
  computation: (newStoryParts, previous) => {
    // Get the previous value of this linkedSignal, or an empty array
    const existingStoryParts = previous?.value || [];
    // Return a new array with the old and new parts
    return [...existingStoryParts, ...newStoryParts];
  },
});
```

## Performance و user experience

LLM APIها ممکن است از APIهای conventional و deterministic کندتر و error-proneتر باشند. می‌توانید از چند feature در Angular برای ساخت interfaceی performant و user-friendly استفاده کنید.

- **Scoped Loading:** `resource` را در componentی قرار دهید که مستقیماً از داده استفاده می‌کند. این کار به محدود کردن چرخه‌های change detection کمک می‌کند، مخصوصاً در zoneless applicationها، و جلوی block شدن بخش‌های دیگر application را می‌گیرد. اگر داده باید بین چند component share شود، `resource` را از یک service provide کنید.
- **SSR و Hydration:** از Server-Side Rendering یا SSR همراه incremental hydration استفاده کنید تا محتوای اولیه page سریع render شود. می‌توانید برای محتوای تولیدشده با AI یک placeholder نشان دهید و fetch کردن داده را تا زمانی که component روی client hydrate شود defer کنید.
- **Loading State:** از `status` مربوط به `LOADING` در `resource` [status](guide/signals/resource#resource-status) استفاده کنید تا هنگام in flight بودن request، indicatorی مثل spinner نمایش دهید. این status هم initial loadها و هم reloadها را پوشش می‌دهد.
- **Error Handling و Retryها:** از method مربوط به [**`reload()`**](guide/signals/resource#reloading) در `resource` به‌عنوان راهی ساده برای retry کردن requestهای ناموفق توسط کاربر استفاده کنید؛ این مورد هنگام تکیه بر محتوای تولیدشده با AI می‌تواند رایج‌تر باشد.

مثال زیر نشان می‌دهد چطور یک UI پاسخ‌گو بسازید که یک image تولیدشده با AI را همراه loading و قابلیت retry به‌صورت dynamic نمایش دهد.

```angular-html
<!-- Display a loading spinner while the LLM generates the image -->
@if (imgResource.isLoading()) {
  <div class="img-placeholder">
    <mat-spinner [diameter]="50" />
  </div>
  <!-- Dynamically populates the src attribute with the generated image URL -->
} @else if (imgResource.hasValue()) {
  <img [src]="imgResource.value()" />
  <!-- Provides a retry option if the request fails  -->
} @else {
  <div class="img-placeholder" (click)="imgResource.reload()">
    <mat-icon fontIcon="refresh" />
    <p>Failed to load image. Click to retry.</p>
  </div>
}
```

## AI patternها در عمل: streaming chat responseها

Interfaceها اغلب partial resultها را از LLM-based APIها به‌صورت incremental و هم‌زمان با رسیدن response data نمایش می‌دهند. resource API در Angular قابلیت stream کردن responseها را برای پشتیبانی از این نوع pattern فراهم می‌کند. property مربوط به `stream` در `resource` یک asynchronous function می‌پذیرد که می‌توانید با آن updateها را در طول زمان روی مقدار یک signal اعمال کنید. signalی که update می‌شود نماینده‌ی data در حال stream است.

```ts
characters = resource({
  stream: async () => {
    const data = signal<ResourceStreamItem<string>>({value: ''});
    // Calls a Genkit streaming flow using the streamFlow method
    // exposed by the Genkit client SDK
    const response = streamFlow({
      url: '/streamCharacters',
      input: 10,
    });

    (async () => {
      for await (const chunk of response.stream) {
        data.update((prev) => {
          if ('value' in prev) {
            return {value: `${prev.value} ${chunk}`};
          } else {
            return {error: chunk as unknown as Error};
          }
        });
      }
    })();

    return data;
  },
});
```

member مربوط به `characters` به‌صورت asynchronous update می‌شود و می‌تواند در template نمایش داده شود.

```angular-html
@if (characters.isLoading()) {
  <p>Loading...</p>
} @else if (characters.hasValue()) {
  <p>{{ characters.value() }}</p>
} @else {
  <p>{{ characters.error() }}</p>
}
```

در سمت server، مثلاً در `server.ts`، endpoint تعریف‌شده data را برای stream شدن به client می‌فرستد. کد زیر از Gemini با framework مربوط به Genkit استفاده می‌کند، اما این تکنیک برای APIهای دیگری هم که از streaming response در LLMها پشتیبانی می‌کنند قابل استفاده است:

```ts
import {startFlowServer} from '@genkit-ai/express';
import {genkit} from 'genkit/beta';
import {googleAI, gemini20Flash} from '@genkit-ai/googleai';

const ai = genkit({plugins: [googleAI()]});

export const streamCharacters = ai.defineFlow(
  {
    name: 'streamCharacters',
    inputSchema: z.number(),
    outputSchema: z.string(),
    streamSchema: z.string(),
  },
  async (count, {sendChunk}) => {
    const {response, stream} = ai.generateStream({
      model: gemini20Flash,
      config: {
        temperature: 1,
      },
      prompt: `Generate ${count} different RPG game characters.`,
    });

    (async () => {
      for await (const chunk of stream) {
        sendChunk(chunk.content[0].text!);
      }
    })();

    return (await response).text;
  },
);

startFlowServer({
  flows: [streamCharacters],
});
```
