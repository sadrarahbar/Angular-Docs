# طراحی form model

Signal Forms از رویکرد model-driven استفاده می‌کند و state و ساختار form را مستقیما از modelای که فراهم می‌کنید derive می‌کند. چون form model foundation کل form است، مهم است با یک form model خوب طراحی‌شده شروع کنید. این راهنما best practiceهای طراحی form modelها را بررسی می‌کند.

## Form model در برابر domain model

Formها برای جمع‌آوری user input استفاده می‌شوند. Application شما احتمالا domain modelای دارد که برای نمایش این input به‌شکلی optimized برای business logic یا storage استفاده می‌شود. با این حال، این شکل اغلب با نحوه‌ای که می‌خواهیم data را در form خود model کنیم _متفاوت_ است.

Form model، user input خام را همان‌طور که در UI ظاهر می‌شود نمایش می‌دهد. برای نمونه، ممکن است در یک form از کاربر بخواهید برای یک appointment، date و time slot را به‌عنوان input fieldهای جداگانه انتخاب کند، حتی اگر domain model شما آن را به‌عنوان یک object واحد JavaScript `Date` نمایش دهد.

```ts
interface AppointmentFormModel {
  name: string; // Appointment owner's name
  date: Date; // Appointment date (carries only date information, time component is unused)
  time: string; // Selected time as a string
}

interface AppointmentDomainModel {
  name: string; // Appointment owner's name
  time: Date; // Appointment time (carries both date and time information)
}
```

Formها باید از form modelای استفاده کنند که برای input experience طراحی شده، نه اینکه صرفا domain model را دوباره استفاده کنند.

## Best practiceهای form model

### از typeهای مشخص استفاده کنید

همیشه همان‌طور که در [استفاده از TypeScript typeها](/guide/forms/signals/models#using-typescript-types) نشان داده شده، برای modelهای خود interface یا type تعریف کنید. Typeهای explicit، IntelliSense بهتری فراهم می‌کنند، errorها را در compile time می‌گیرند و به‌عنوان documentation برای data داخل form عمل می‌کنند.

### همه fieldها را initialize کنید

برای هر field در model خود initial value فراهم کنید:

```ts {prefer, header: 'All fields initialized'}
const taskModel = signal({
  title: '',
  description: '',
  priority: 'medium',
  completed: false,
});
```

```ts {avoid, header: 'Partial initialization'}
const taskModel = signal({
  title: '',
  // Missing description, priority, completed
});
```

Initial valueهای missing یعنی آن fieldها در field tree وجود نخواهند داشت و برای form interactionها قابل دسترسی نیستند.

### Modelها را focused نگه دارید

هر model باید یک form واحد یا مجموعه‌ای cohesive از data مرتبط را نمایش دهد:

```ts {prefer, header: 'Focused on a single purpose'}
const loginModel = signal({
  email: '',
  password: '',
});
```

```ts {avoid, header: 'Mixing unrelated concerns'}
const appModel = signal({
  // Login data
  email: '',
  password: '',
  // User preferences
  theme: 'light',
  language: 'en',
  // Shopping cart
  cartItems: [],
});
```

Modelهای جدا برای concernهای متفاوت، formها را آسان‌تر برای فهم و reuse می‌کنند. اگر مجموعه‌های data متمایزی را مدیریت می‌کنید، چند form بسازید.

### Requirementهای validation را در نظر بگیرید

Modelها را با در نظر گرفتن validation طراحی کنید. Fieldهایی را که با هم validate می‌شوند group کنید:

```ts {prefer, header: 'Related fields grouped for comparison'}
// Password fields grouped for comparison
interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

این ساختار cross-field validation، مثل بررسی اینکه `newPassword` با `confirmPassword` match است یا نه، را طبیعی‌تر می‌کند.

### Data typeها را با UI controlها match کنید

Propertyهای form model شما باید با data typeهایی match باشند که UI controlهای شما انتظار دارند.

برای مثال، یک beverage order form را در نظر بگیرید که fieldای به نام `size` دارد، با مقدارهای 6، 12 یا 24 pack، و fieldای به نام `quantity`. UI برای size از dropdown (`<select>`) و برای quantity از number input (`<input type="number">`) استفاده می‌کند.

هرچند optionهای size عددی به نظر می‌رسند، elementهای `<select>` با string valueها کار می‌کنند، پس `size` باید به‌عنوان string model شود. از طرف دیگر، `<input type="number">` با numberها کار می‌کند، پس `quantity` می‌تواند به‌عنوان number model شود.

```ts {prefer, header: 'Appropriate data types for the bound UI controls'}
interface BeverageOrderFormModel {
  size: string; // Bound to: <select> (option values: "6", "12", "24")
  quantity: number; // Bound to: <input type="number">
}
```

### از `undefined` دوری کنید

Form model نباید value یا property از نوع `undefined` داشته باشد. در Signal Forms، ساختار form از ساختار model derive می‌شود و `undefined` به معنی _نبودن یک field_ است، نه fieldای با value خالی. یعنی باید از fieldهای optional، مثلا `{property?: string}`، هم دوری کنید، چون به‌صورت implicit اجازه `undefined` می‌دهند.

برای نمایش propertyای با value خالی در form model، از valueای استفاده کنید که UI control آن را به معنی "empty" می‌فهمد، مثل `""` برای `<input type="text">`. اگر custom UI control طراحی می‌کنید، `null` اغلب value خوبی برای نشان دادن "empty" است.

```ts {prefer, header: 'Appropriate empty values'}
interface UserFormModel {
  name: string; // Bound to <input type="text">
  birthday: Date | null; // Bound to <input type="date">
}

// Initialize our form with empty values.
form(signal({name: '', birthday: null}));
```

### از modelهایی با ساختار dynamic دوری کنید

Form model زمانی ساختار dynamic دارد که shape آن، یعنی propertyهای object، بر اساس value تغییر کند. این اتفاق وقتی رخ می‌دهد که model type اجازه valueهایی با shapeهای متفاوت بدهد، مثل unionای از object typeهایی که propertyهای متفاوت دارند، یا unionای از object و primitive. بخش‌های زیر چند سناریوی رایج را بررسی می‌کنند که modelهای با ساختار dynamic ممکن است جذاب به نظر برسند، اما در نهایت مشکل‌ساز می‌شوند.

#### Value خالی برای object پیچیده

اغلب از formها استفاده می‌کنیم تا از کاربران بخواهیم data کاملا جدید وارد کنند، نه اینکه data موجود در سیستم را edit کنند. یک مثال خوب، account creation form است. ممکن است آن را با form model زیر model کنیم.

```ts
interface CreateAccountFormModel {
  name: {
    first: string;
    last: string;
  };
  username: string;
}
```

هنگام ساخت form با یک dilemma روبه‌رو می‌شویم: initial value داخل model باید چه باشد؟ ممکن است وسوسه شویم `form<CreateAccountFormModel | null>()` بسازیم، چون هنوز inputای از کاربر نداریم.

```ts {avoid, header: 'Using null as empty value for complex object'}
createAccountForm = form<CreateAccountFormModel | null>(signal(/* what goes here, null? */));
```

اما مهم است به یاد داشته باشید Signal Forms، _model driven_ است. اگر model ما `null` باشد و `null` propertyهای `name` یا `username` نداشته باشد، یعنی form ما هم آن subfieldها را نخواهد داشت. در عوض چیزی که واقعا می‌خواهیم، instanceای از `CreateAccountFormModel` است که همه leaf fieldهای آن روی empty value تنظیم شده‌اند.

```ts {prefer, header: 'Same shape value with empty values for properties'}
createAccountForm = form<CreateAccountFormModel>(
  signal({
    name: {
      first: '',
      last: '',
    },
    username: '',
  }),
);
```

با این نمایش، همه subfieldهایی که نیاز داریم اکنون وجود دارند و می‌توانیم آن‌ها را با directive مربوط به `[formField]` در template خود bind کنیم.

```html
First: <input [formField]="createAccountForm.name.first" /> Last:
<input [formField]="createAccountForm.name.last" /> Username:
<input [formField]="createAccountForm.username" />
```

#### Fieldهایی که به‌صورت شرطی hidden یا unavailable هستند

Formها همیشه linear نیستند. اغلب لازم دارید بر اساس user input قبلی، مسیرهای شرطی بسازید. یک مثال، formای است که در آن optionهای پرداخت متفاوتی به کاربر می‌دهیم. بیایید با تصور اینکه UI چنین formای چه شکلی دارد شروع کنیم.

```html
Name: <input type="text" />

<section>
  <h2>Payment Info</h2>
  <input type="radio" /> Credit Card @if (/* credit card selected */) {
  <section>
    Card Number <input type="text" /> Security Code <input type="text" /> Expiration
    <input type="text" />
  </section>
  }
  <input type="radio" /> Bank Account @if (/* bank account selected */) {
  <section>Account Number <input type="text" /> Routing Number <input type="text" /></section>
  }
</section>
```

بهترین راه مدیریت این وضعیت، استفاده از form modelای با ساختار static است که fieldهای مربوط به _همه_ payment methodهای احتمالی را شامل شود. در schema خود می‌توانیم fieldهایی را که در حال حاضر در دسترس نیستند hide یا disable کنیم.

```ts {prefer, header: 'Static structure model'}
interface BillPayFormModel {
  name: string;
  method: {
    type: string;
    card: {
      cardNumber: string;
      securityCode: string;
      expiration: string;
    };
    bank: {
      accountNumber: string;
      routingNumber: string;
    };
  };
}

const billPaySchema = schema<BillPayFormModel>((billPay) => {
  // Hide credit card details when user has selected a method other than credit card.
  hidden(billPay.method.card, {when: ({valueOf}) => valueOf(billPay.method.type) !== 'card'});
  // Hide bank account details when user has selected a method other than bank account.
  hidden(billPay.method.bank, {when: ({valueOf}) => valueOf(billPay.method.type) !== 'bank'});
});
```

با استفاده از این model، هر دو object مربوط به `card` و `bank` همیشه در state فرم وجود دارند. وقتی کاربر payment method را عوض می‌کند، فقط property مربوط به `type` را update می‌کنیم. Dataای که در fieldهای card وارد کرده، با خیال راحت در object مربوط به `card` ذخیره می‌ماند و اگر دوباره برگردد آماده نمایش است.

در مقابل، form model با ساختار dynamic ممکن است در ابتدا برای این use case مناسب به نظر برسد. بالاخره اگر کاربر "Credit Card" را انتخاب کرده باشد، به fieldهای account و routing number نیاز نداریم. ممکن است وسوسه شویم این را به‌صورت discriminated union model کنیم:

```ts {avoid, header: 'Dynamic structure model'}
interface BillPayFormModel {
  name: string;
  method:
    | {
        type: 'card';
        cardNumber: string;
        securityCode: string;
        expiration: string;
      }
    | {
        type: 'bank';
        accountNumber: string;
        routingNumber: string;
      };
}
```

اما ببینید در سناریوی زیر چه اتفاقی می‌افتد:

1. کاربر نام و اطلاعات credit card خود را وارد می‌کند
2. در آستانه submit است، اما در آخرین لحظه متوجه convenience fee می‌شود.
3. به option مربوط به bank account تغییر می‌دهد، چون فکر می‌کند بهتر است از fee دوری کند.
4. وقتی می‌خواهد اطلاعات bank account را وارد کند، دودل می‌شود؛ نمی‌خواهد آن اطلاعات در یک leak قرار بگیرد.
5. دوباره به option مربوط به credit card برمی‌گردد، اما می‌بیند همه اطلاعاتی که وارد کرده بود از بین رفته است!

این موضوع مشکل دیگری را در form modelهایی با ساختار dynamic نشان می‌دهد: آن‌ها می‌توانند باعث data loss شوند. چنین modelای فرض می‌کند وقتی یک field hidden شد، اطلاعات داخل آن دیگر هرگز لازم نخواهد شد. اطلاعات credit card را با اطلاعات bank جایگزین می‌کند و راهی برای برگرداندن اطلاعات credit card ندارد.

#### استثناها

هرچند ساختار static عموما ترجیح داده می‌شود، سناریوهای مشخصی وجود دارند که ساختار dynamic در آن‌ها لازم و پشتیبانی‌شده است.

##### Arrayها

Arrayها رایج‌ترین استثنا هستند. Formها اغلب باید تعداد متغیری از itemها را جمع‌آوری کنند، مثل listای از phone numberها، attendeeها یا line itemهای یک order.

```ts
interface SendEmailFormModel {
  subject: string;
  recipientEmails: string[];
}
```

در این حالت، array مربوط به `recipientEmails` با تعامل کاربر با form بزرگ و کوچک می‌شود. هرچند طول array dynamic است، ساختار itemهای جداگانه باید consistent باشد، یعنی هر item باید shape یکسانی داشته باشد.

##### Fieldهایی که UI control آن‌ها را atomic در نظر می‌گیرد

حالت دیگری که ساختار dynamic قابل قبول است، زمانی است که یک object پیچیده توسط UI control به‌عنوان یک value واحد و atomic در نظر گرفته شود. یعنی اگر control تلاش نکند به subfieldهای آن به‌صورت جداگانه bind کند یا به آن‌ها دسترسی داشته باشد. در این سناریو، control با جایگزین کردن کل object در یک مرحله، value را update می‌کند، نه با modify کردن propertyهای داخلی آن. چون form structure در این سناریو irrelevant است، dynamic بودن آن structure قابل قبول است.

برای مثال، یک user profile form را در نظر بگیرید که fieldای به نام `location` دارد. Location با یک widget پیچیده "location picker" انتخاب می‌شود، شاید map یا dropdown با search-ahead، که یک coordinate object برمی‌گرداند. وقتی location هنوز انتخاب نشده، یا کاربر انتخاب می‌کند location خود را share نکند، picker مقدار location را `null` نشان می‌دهد.

```ts {prefer, header: 'Dynamic structure is ok when field is treated as atomic'}
interface Location {
  lat: number;
  lng: number;
}

interface UserProfileFormModel {
  username: string;
  // This property has dynamic structure,
  // but that's ok because the location picker treats this field as atomic.
  location: Location | null;
}
```

در template، field مربوط به `location` را مستقیما به custom control خود bind می‌کنیم:

```html
Username: <input [formField]="userForm.username" /> Location:
<location-picker [formField]="userForm.location"></location-picker>
```

اینجا `<location-picker>` کل object مربوط به `Location` یا `null` را consume و produce می‌کند و به `userForm.location.lat` یا `userForm.location.lng` دسترسی ندارد. بنابراین `location` می‌تواند بدون نقض اصول model-driven forms، shape dynamic داشته باشد.

## ترجمه بین form model و domain model

از آنجا که form model و domain model یک concept یکسان را متفاوت نمایش می‌دهند، باید راهی برای translate کردن بین این representationهای متفاوت داشته باشیم. وقتی می‌خواهیم data موجود در سیستم را در یک form به کاربر نشان دهیم، باید آن را از representation مربوط به domain model به representation مربوط به form model تبدیل کنیم. برعکس، وقتی می‌خواهیم changeهای کاربر را save کنیم، باید data را از representation مربوط به form model به representation مربوط به domain model تبدیل کنیم.

فرض کنید یک domain model و یک form model داریم و functionهایی برای convert کردن بین آن‌ها نوشته‌ایم.

```ts
interface MyDomainModel { ... }

interface MyFormModel { ... }

// Instance of `MyFormModel` populated with empty input (e.g. `''` for string inputs, etc.)
const EMPTY_MY_FORM_MODEL: MyFormModel = { ... };

function domainModelToFormModel(domainModel: MyDomainModel): MyFormModel { ... }

function formModelToDomainModel(formModel: MyFormModel): MyDomainModel { ... }
```

### Domain model به form model

وقتی formای می‌سازیم تا domain model موجودی را در سیستم edit کنیم، معمولا آن domain model را یا به‌عنوان `input()` به form component دریافت می‌کنیم یا از backend، مثلا از طریق resource. در هر دو حالت، `linkedSignal` راه بسیار خوبی برای اعمال transform فراهم می‌کند.

وقتی domain model را به‌عنوان `input()` دریافت می‌کنیم، می‌توانیم از `linkedSignal` برای ساخت یک writable form model از input signal استفاده کنیم.

```ts {prefer, header: 'Use linkedSignal to convert domain model to form model'}
@Component(...)
class MyForm {
  // The domain model to initialize the form with, if not given we start with an empty form.
  readonly domainModel = input<MyDomainModel>();

  private readonly formModel = linkedSignal({
    // Linked signal based on the domain model
    source: this.domainModel,
    // If domain model is defined convert it to a form model, otherwise use an empty form model.
    computation: (domainModel) => domainModel
      ? domainModelToFormModel(domainModel)
      : EMPTY_MY_FORM_MODEL
  });

  protected readonly myForm = form(this.formModel);
}
```

به همین شکل، وقتی domain model را از backend از طریق resource دریافت می‌کنیم، می‌توانیم بر اساس value آن یک `linkedSignal` بسازیم تا `formModel` خود را ایجاد کنیم. در این سناریو، fetch شدن domain model ممکن است زمان‌بر باشد، و باید form را تا زمان load شدن data disable کنیم.

```ts {prefer, header: 'Disable or hide the form when data is unavailable'}
@Component(...)
class MyForm {
  // Fetch the domain model from the backend.
  readonly domainModelResource: ResourceRef<MyDomainModel | undefined> = httpResource(...);

  private readonly formModel = linkedSignal({
    // Linked signal based on the domain model resource
    source: this.domainModelResource.value,
    // Convert the domain model once it loads, use an empty form model while loading.
    computation: (domainModel) => domainModel
      ? domainModelToFormModel(domainModel)
      : EMPTY_MY_FORM_MODEL
  });

  protected readonly myForm = form(this.formModel, (root) => {
    // Disable the entire form when the resource is loading.
    disabled(root, {when: () => this.domainModelResource.isLoading()});
  });
}
```

مثال‌های بالا derivation خالص form model را مستقیما از domain model نشان می‌دهند. با این حال، در بعضی موارد ممکن است بخواهید بین value جدید domain model و valueهای قبلی domain model و form model، diff operation پیشرفته‌تری انجام دهید. این کار را می‌توان بر اساس [previous state](/guide/signals/linked-signal#accounting-for-previous-state) مربوط به `linkedSignal` پیاده‌سازی کرد.

### Form model به domain model

وقتی آماده‌ایم input کاربر را در سیستم save کنیم، باید آن را به representation مربوط به domain model تبدیل کنیم. این کار معمولا وقتی رخ می‌دهد که کاربر form را submit می‌کند، یا در formهای auto-saving به‌صورت continuous هنگام edit کردن کاربر.

برای save کردن هنگام submit، می‌توانیم conversion را در function مربوط به `submit` مدیریت کنیم.

```ts {prefer, header: 'Convert form model to domain model on submit'}
@Component(...)
class MyForm {
  private readonly myDataService = inject(MyDataService);

  protected readonly myForm = form<MyFormModel>(...);

  handleSubmit() {
    submit(this.myForm, async () => {
      await this.myDataService.update(formModelToDomainModel(this.myForm().value()));
    });
  };
}
```

همچنین می‌توانید form model را مستقیما به server بفرستید و conversion از form model به domain model را روی server انجام دهید.

برای continuous saving، domain model را داخل یک `effect` update کنید.

```ts {prefer, header: 'Convert form model to domain model in an effect for auto-saving'}
@Component(...)
class MyForm {
  readonly domainModel = model.required<MyDomainModel>()

  protected readonly myForm = form(...);

  constructor() {
    effect(() => {
      // When the form model changes to a valid value, update the domain model.
      if (this.myForm().valid()) {
        this.domainModel.set(formModelToDomainModel(this.myForm().value()));
      }
    });
  };
}
```

مثال‌های بالا conversion خالص از form model به domain model را نشان می‌دهند. با این حال، کاملا قابل قبول است که علاوه بر value ساده form model، کل form state را هم در نظر بگیرید. برای مثال، برای صرفه‌جویی در byteها ممکن است بخواهیم فقط partial updateها را بر اساس چیزی که کاربر تغییر داده به server بفرستیم. در این حالت، conversion function ما می‌تواند طوری طراحی شود که کل form state را بگیرد و بر اساس valueها و dirtiness form، یک sparse domain model برگرداند.

```ts
type Sparse<T> = T extends object ? {
    [P in keyof T]?: Sparse<T[P]>;
} : T;

function formStateToPartialDomainModel(
  formState: FieldState<MyFormModel>
): Sparse<MyDomainModel> { ... }
```
