# Testing Pipeها

می‌توانید [pipeها](guide/templates/pipes) را بدون ابزارهای testing در Angular test کنید.

## Testing مربوط به `TitleCasePipe`

یک کلاس pipe یک method به نام `transform` دارد که مقدار ورودی را به خروجی transform‌شده تبدیل می‌کند.
implementation مربوط به `transform` به ندرت با DOM تعامل دارد.
بیشتر pipeها جز metadata مربوط به `@Pipe` و یک interface، وابستگی دیگری به Angular ندارند.

یک `TitleCasePipe` را در نظر بگیرید که حرف اول هر واژه را بزرگ می‌کند.
این یک implementation با regular expression است.

```ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'titlecase', pure: true})
/** Transform to Title Case: uppercase the first letter of the words in a string. */
export class TitleCasePipe implements PipeTransform {
  transform(input: string): string {
    return input.length === 0
      ? ''
      : input.replace(/\w\S*/g, (txt) => txt[0].toUpperCase() + txt.slice(1).toLowerCase());
  }
}
```

هر چیزی که از regular expression استفاده می‌کند ارزش این را دارد که کامل test شود. می‌توانید با تکنیک‌های استاندارد unit testing، caseهای مورد انتظار و edge caseها را بررسی کنید.

```ts
describe('TitleCasePipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new TitleCasePipe();

  it('transforms "abc" to "Abc"', () => {
    expect(pipe.transform('abc')).toBe('Abc');
  });

  it('transforms "abc def" to "Abc Def"', () => {
    expect(pipe.transform('abc def')).toBe('Abc Def');
  });

  // ... more tests ...
});
```

## نوشتن testهای DOM برای پشتیبانی از test یک pipe

این‌ها testهای pipe _به صورت isolated_ هستند.
آن‌ها نمی‌توانند بگویند آیا `TitleCasePipe` وقتی در کامپوننت‌های برنامه اعمال می‌شود درست کار می‌کند یا نه.

در نظر بگیرید testهای کامپوننتی مثل این را اضافه کنید:

```ts
it('should convert hero name to Title Case', async () => {
  // get the name's input and display elements from the DOM
  const hostElement: HTMLElement = harness.routeNativeElement!;
  const nameInput: HTMLInputElement = hostElement.querySelector('input')!;
  const nameDisplay: HTMLElement = hostElement.querySelector('span')!;

  // simulate user entering a new name into the input box
  nameInput.value = 'quick BROWN  fOx';

  // Dispatch a DOM event so that Angular learns of input value change.
  nameInput.dispatchEvent(new Event('input'));

  // Wait for Angular to update the display binding through the title pipe
  await harness.fixture.whenStable();

  expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
});
```
