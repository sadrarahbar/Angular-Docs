# دانشنامه خطاها

## خطاهای runtime

| کد        | نام                                                                                             |
| :-------- | :---------------------------------------------------------------------------------------------- |
| `NG0100`  | [تغییر expression پس از بررسی](errors/NG0100)                                                   |
| `NG0200`  | [dependency حلقوی در DI](errors/NG0200)                                                         |
| `NG0201`  | [provider پیدا نشد](errors/NG0201)                                                              |
| `NG0203`  | [`inject()` باید از injection context فراخوانی شود](errors/NG0203)                              |
| `NG0204`  | [Injection Token نامعتبر](errors/NG0204)                                                        |
| `NG0205`  | [Injector قبلاً نابود شده است](errors/NG0205)                                                   |
| `NG0207`  | [EnvironmentProviders در context نادرست](errors/NG0207)                                         |
| `NG0209`  | [multi provider نامعتبر](errors/NG0209)                                                         |
| `NG0300`  | [تداخل selector](errors/NG0300)                                                                 |
| `NG0301`  | [export پیدا نشد](errors/NG0301)                                                                |
| `NG0302`  | [pipe پیدا نشد](errors/NG0302)                                                                  |
| `NG0401`  | [platform وجود ندارد](errors/NG0401)                                                            |
| `NG0403`  | [NgModule راه‌اندازی‌شده component قابل initialize را مشخص نکرده است](errors/NG0403)            |
| `NG0500`  | [عدم تطابق node در hydration](errors/NG0500)                                                    |
| `NG0501`  | [نبود siblingها در hydration](errors/NG0501)                                                    |
| `NG0502`  | [نبود node در hydration](errors/NG0502)                                                         |
| `NG0503`  | [projection پشتیبانی‌نشده nodeهای DOM در hydration](errors/NG0503)                             |
| `NG0504`  | [flag مربوط به رد کردن hydration روی node نامعتبر اعمال شده است](errors/NG0504)                 |
| `NG0505`  | [اطلاعات hydration در response سمت server وجود ندارد](errors/NG0505)                            |
| `NG0506`  | [NgZone ناپایدار باقی مانده است](errors/NG0506)                                                 |
| `NG0507`  | [محتوای HTML پس از SSR تغییر کرده است](errors/NG0507)                                           |
| `NG0602`  | [فراخوانی تابع غیرمجاز در reactive context](errors/NG0602)                                     |
| `NG0750`  | [dependencyهای @defer بارگذاری نشدند](errors/NG0750)                                           |
| `NG0751`  | [رفتار @defer هنگام فعال بودن HMR](errors/NG0751)                                               |
| `NG0910`  | [bindingهای ناامن روی element به نام iframe](errors/NG0910)                                    |
| `NG0912`  | [تداخل در تولید ID مربوط به component](errors/NG0912)                                          |
| `NG0913`  | [هشدارهای performance در runtime](errors/NG0913)                                               |
| `NG0919`  | [dependency حلقوی شناسایی شد](errors/NG0919)                                                   |
| `NG0950`  | [پیش از تنظیم مقدار به input الزامی دسترسی گرفته شده است](errors/NG0950)                        |
| `NG0951`  | [نتیجه child query الزامی است اما مقداری وجود ندارد](errors/NG0951)                             |
| `NG0955`  | [expression مربوط به track برای collection داده‌شده کلیدهای تکراری ایجاد کرده است](errors/NG0955) |
| `NG0956`  | [expression مربوط به tracking باعث ایجاد دوباره ساختار DOM شده است](errors/NG0956)              |
| `NG01002` | [مقدار Control وجود ندارد](errors/NG01002)                                                     |
| `NG01101` | [نوع بازگشتی Async Validator نادرست است](errors/NG01101)                                       |
| `NG01203` | [value accessor وجود ندارد](errors/NG01203)                                                    |
| `NG01902` | [field بدون والد در signal formها](errors/NG01902)                                             |
| `NG02200` | [Iterable Differ وجود ندارد](errors/NG02200)                                                   |
| `NG02800` | [پشتیبانی JSONP در پیکربندی HttpClient](errors/NG02800)                                        |
| `NG02802` | [headerها توسط HttpTransferCache منتقل نشده‌اند](errors/NG02802)                               |
| `NG02825` | [بدنه response مربوط به Fetch از محدودیت پیکربندی‌شده بیشتر است](errors/NG02825)                 |
| `NG05000` | [hydration با نمونه پشتیبانی‌نشده Zone.js](errors/NG05000)                                     |
| `NG05104` | [element ریشه پیدا نشد](errors/NG05104)                                                        |
| `NG05703` | [تغییر مشکوک origin مربوط به URL هنگام SSR](errors/NG05703)                                    |

## خطاهای کامپایلر

| کد       | نام                                                                 |
| :------- | :------------------------------------------------------------------ |
| `NG1001` | [آرگومان literal نیست](errors/NG1001)                               |
| `NG2003` | [Token وجود ندارد](errors/NG2003)                                   |
| `NG2009` | [selector نامعتبر Shadow DOM](errors/NG2009)                        |
| `NG3003` | [چرخه import شناسایی شد](errors/NG3003)                             |
| `NG6100` | [ضدالگوی تنظیم NgModule.id روی module.id](errors/NG6100)            |
| `NG8001` | [element نامعتبر](errors/NG8001)                                    |
| `NG8002` | [attribute نامعتبر](errors/NG8002)                                  |
| `NG8003` | [target مربوط به reference وجود ندارد](errors/NG8003)               |
| `NG8023` | [چند component با یک element مطابقت دارند](errors/NG8023)           |
| `NG8024` | [binding متعارض Host Directive](errors/NG8024)                      |
