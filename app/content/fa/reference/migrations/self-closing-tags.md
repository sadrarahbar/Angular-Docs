# مهاجرت به tagهای self-closing

tagهای self-closing از [v16](https://blog.angular.dev/angular-v16-is-here-4d7a28ec680d#7065) در templateهای Angular پشتیبانی می‌شوند.

این schematic، templateهای برنامه شما را migrate می‌کند تا از tagهای self-closing استفاده کنند.

schematic را با command زیر اجرا کنید:

```shell
ng generate @angular/core:self-closing-tag
```

#### قبل

```angular-html
<hello-world></hello-world>
```

#### بعد

```angular-html
<hello-world />
```

