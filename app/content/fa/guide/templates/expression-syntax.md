# Expression Syntax

Angular expressionها بر پایه JavaScript هستند، اما در چند مورد کلیدی تفاوت دارند. این راهنما شباهت‌ها و تفاوت‌های Angular expressionها و JavaScript استاندارد را مرور می‌کند.

## Literalهای value

Angular از subsetای از [literal valueهای](https://developer.mozilla.org/en-US/docs/Glossary/Literal) JavaScript پشتیبانی می‌کند.

### Literalهای value پشتیبانی‌شده

| Literal type           | Example values                  |
| ---------------------- | ------------------------------- |
| String                 | `'Hello'`, `"World"`            |
| Boolean                | `true`, `false`                 |
| Number                 | `123`, `3.14`                   |
| Object                 | `{name: 'Alice'}`               |
| Array                  | `['Onion', 'Cheese', 'Garlic']` |
| null                   | `null`                          |
| RegExp                 | `/\d+/`                         |
| Template string        | `` `Hello ${name}` ``           |
| Tagged template string | `` tag`Hello ${name}` ``        |

### Literalهای value پشتیبانی‌نشده

| Literal type | Example values |
| ------------ | -------------- |
| BigInt       | `1n`           |

## Globalها

Angular expressionها از [global](https://developer.mozilla.org/en-US/docs/Glossary/Global_object)های زیر پشتیبانی می‌کنند:

- [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)
- [$any](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)

هیچ global دیگری از JavaScript پشتیبانی نمی‌شود. Globalهای رایج JavaScript شامل `Number`، `Boolean`، `NaN`، `Infinity`، `parseInt` و موارد دیگر هستند.

## Local variableها

Angular به‌صورت خودکار local variableهای ویژه‌ای را برای استفاده در expressionها در contextهای مشخص در دسترس قرار می‌دهد. این variableهای ویژه همیشه با کاراکتر dollar sign یعنی (`$`) شروع می‌شوند.

برای مثال، blockهای `@for` چند local variable متناظر با اطلاعات loop، مثل `$index`، در دسترس قرار می‌دهند.

## چه operatorهایی پشتیبانی می‌شوند؟

### Operatorهای پشتیبانی‌شده

Angular از operatorهای زیر از JavaScript استاندارد پشتیبانی می‌کند.

| Operator                      | Example(s)                                     |
| ----------------------------- | ---------------------------------------------- |
| Add / Concatenate             | `1 + 2`                                        |
| Subtract                      | `52 - 3`                                       |
| Multiply                      | `41 * 6`                                       |
| Divide                        | `20 / 4`                                       |
| Remainder (Modulo)            | `17 % 5`                                       |
| Exponentiation                | `10 ** 3`                                      |
| Parenthesis                   | `9 * (8 + 4)`                                  |
| Conditional (Ternary)         | `a > b ? true : false`                         |
| And (Logical)                 | `&&`                                           |
| Or (Logical)                  | `\|\|`                                         |
| Not (Logical)                 | `!`                                            |
| Nullish Coalescing            | `possiblyNullValue ?? 'default'`               |
| Comparison Operators          | `<`, `<=`, `>`, `>=`, `==`, `===`, `!==`, `!=` |
| Unary Negation                | `-x`                                           |
| Unary Plus                    | `+y`                                           |
| Property Accessor             | `person['name']`                               |
| typeof                        | `typeof 42`                                    |
| void                          | `void 1`                                       |
| in                            | `'model' in car`                               |
| instanceof                    | `car instanceof Automobile`                    |
| Assignment                    | `a = b`                                        |
| Addition Assignment           | `a += b`                                       |
| Subtraction Assignment        | `a -= b`                                       |
| Multiplication Assignment     | `a *= b`                                       |
| Division Assignment           | `a /= b`                                       |
| Remainder Assignment          | `a %= b`                                       |
| Exponentiation Assignment     | `a **= b`                                      |
| Logical AND Assignment        | `a &&= b`                                      |
| Logical OR Assignment         | `a \|\|= b`                                    |
| Nullish Coalescing Assignment | `a ??= b`                                      |
| Spread in object literals     | `{...obj, foo: 'bar'}`                         |
| Spread in array literals      | `[...arr, 1, 2, 3]`                            |
| Rest in function calls        | `fn(...args)`                                  |

Angular expressionها علاوه بر این از operatorهای non-standard زیر هم پشتیبانی می‌کنند:

| Operator                        | Example(s)                     |
| ------------------------------- | ------------------------------ |
| [Pipe](/guide/templates/pipes)  | `{{ total \| currency }}`      |
| Optional chaining\*             | `someObj.someProp?.nestedProp` |
| Non-null assertion (TypeScript) | `someObj!.someProp`            |

### Safe navigation migration

پیش از Angular 22، optional chaining operator یعنی (`?.`) وقتی سمت چپ آن `null` یا `undefined` بود، `null` برمی‌گرداند؛ در حالی که `?.` استاندارد JavaScript مقدار `undefined` برمی‌گرداند.
از Angular 22 به بعد، رفتار optional chaining operator در Angular expressionها با رفتار JavaScript استاندارد align شده است.

در زمان migration به v22، schematics مربوط به `ng update` یک magic function به نام `$safeNavigationMigration` به expressionهای موجود اضافه کرد تا رفتار قبلی، یعنی برگشت دادن `null`، حفظ شود.

```html
{{ $safeNavigationMigration(foo?.bar) }}
```

`$safeNavigationMigration` **فقط یک کمک موقت برای migration** است. این function به compiler دستور می‌دهد safe-navigation expression wrap شده را با semantics قدیمیِ null-returning کامپایل کند، نه semantics استاندارد JavaScript برای `?.`. این یک function واقعی نیست و نمی‌تواند از TypeScript فراخوانی شود.

NOTE: ترجیح دهید expressionها را طوری migrate کنید که دیگر به تفاوت `null` و `undefined` وابسته نباشند تا بتوان `$safeNavigationMigration` را حذف کرد. این function ممکن است در نسخه‌ای آینده از Angular حذف شود.

### Operatorهای پشتیبانی‌نشده

| Operator              | Example(s)                        |
| --------------------- | --------------------------------- |
| All bitwise operators | `&`, `&=`, `~`, `\|=`, `^=`, etc. |
| Object destructuring  | `const { name } = person`         |
| Array destructuring   | `const [firstItem] = items`       |
| Comma operator        | `x = (x++, x)`                    |
| new                   | `new Car()`                       |

## Lexical context برای expressionها

Angular expressionها در context مربوط به کلاس component و همچنین هر [template variable](/guide/templates/variables)، local و global مرتبط evaluate می‌شوند.

هنگام ارجاع به memberهای کلاس component، `this` همیشه ضمنی است. اما اگر یک template یک [template variable](guide/templates/variables) با همان نام یک member declare کند، آن variable روی member سایه می‌اندازد. می‌توانید چنین class memberای را با استفاده explicit از `this.` بدون ابهام reference دهید. این کار هنگام ساخت یک declaration از نوع `@let` که روی class member سایه می‌اندازد می‌تواند مفید باشد، مثلا برای signal narrowing.

## Declarationها

به‌طور کلی، declarationها در Angular expressionها پشتیبانی نمی‌شوند. این شامل موارد زیر است، اما محدود به آن‌ها نیست:

| Declarations    | Example(s)                                  |
| --------------- | ------------------------------------------- |
| Variables       | `let label = 'abc'`, `const item = 'apple'` |
| Functions       | `function myCustomFunction() { }`           |
| Arrow Functions | `() => { }`                                 |
| Classes         | `class Rectangle { }`                       |

## Statementهای event listener

Event handlerها به‌جای expression، **statement** هستند. با اینکه همه syntaxهای Angular expression را پشتیبانی می‌کنند، دو تفاوت کلیدی دارند:

1. Statementها از assignment operatorها **پشتیبانی می‌کنند**، اما نه destructuring assignmentها
1. Statementها از pipeها **پشتیبانی نمی‌کنند**
