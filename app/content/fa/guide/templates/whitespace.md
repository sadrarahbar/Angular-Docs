# Whitespace در templateها

به‌صورت پیش‌فرض، templateهای Angular whitespaceهایی را که framework غیرضروری تشخیص می‌دهد حفظ نمی‌کنند. این معمولا در دو موقعیت رخ می‌دهد: whitespace بین elementها و whitespace قابل collapse داخل text.

## Whitespace بین elementها

بیشتر توسعه‌دهندگان ترجیح می‌دهند templateهای خود را با newline و indentation format کنند تا template خوانا باشد:

```html
<section>
  <h3>User profile</h3>
  <label>
    User name
    <input />
  </label>
</section>
```

این template بین همه elementها whitespace دارد. snippet زیر همان HTML را نشان می‌دهد که در آن هر whitespace character با کاراکتر hash یعنی `#` جایگزین شده تا مقدار whitespace موجود واضح شود:

<!-- prettier-ignore -->
```html
<!-- Total Whitespace: 20 -->
<section>###<h3>User profile</h3>###<label>#####User name#####<input>###</label>#</section>
```

حفظ whitespace دقیقا همان‌طور که در template نوشته شده، باعث ایجاد تعداد زیادی [text node](https://developer.mozilla.org/en-US/docs/Web/API/Text) غیرضروری می‌شود و overhead مربوط به rendering page را افزایش می‌دهد. Angular با نادیده گرفتن این whitespace بین elementها، هنگام render کردن template روی page کار کمتری انجام می‌دهد و performance کلی را بهبود می‌بخشد.

## Whitespace قابل collapse داخل text

وقتی مرورگر وب شما HTML را روی page render می‌کند، چند whitespace character پشت سر هم را به یک کاراکتر واحد collapse می‌کند:

<!-- prettier-ignore -->
```html
<!-- What it looks like in the template -->
<p>Hello         world</p>
```

در این مثال، مرورگر فقط یک space بین "Hello" و "world" نمایش می‌دهد.

```angular-html
<!-- What shows up in the browser -->
<p>Hello world</p>
```

برای زمینه بیشتر درباره نحوه کار این رفتار، [How whitespace is handled by HTML, CSS, and in the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace) را ببینید.

Angular در همان ابتدا از ارسال این whitespace characterهای غیرضروری به مرورگر جلوگیری می‌کند؛ یعنی هنگام compile کردن template، آن‌ها را به یک کاراکتر واحد collapse می‌کند.

## حفظ whitespace

می‌توانید با مشخص کردن `preserveWhitespaces: true` در decorator مربوط به `@Component` برای یک template، به Angular بگویید whitespace را در template حفظ کند.

```angular-ts
@Component({
  /* ... */,
  preserveWhitespaces: true,
  template: `
    <p>Hello         world</p>
  `
})
```

از تنظیم این option مگر در صورت ضرورت جدی پرهیز کنید. حفظ whitespace می‌تواند باعث شود Angular هنگام rendering تعداد nodeهای بسیار بیشتری تولید کند و application شما کندتر شود.

همچنین می‌توانید از یک HTML entity ویژه و منحصر به Angular یعنی `&ngsp;` استفاده کنید. این entity یک space character واحد تولید می‌کند که در خروجی compile شده حفظ می‌شود.
