# Date

ECMAScript的Date类型参考Java早期版本中java.util.Date，为此Date类型将日期保存为自协调世界时（UT， UniversalTime Coordinated）时间1970年1月1日午夜（零时）至今所经过的毫秒数。

使用new操作符来调用Date构造函数：`new Date()`

- Date.parse() 接收一个表示日期的字符串参数，尝试将这个字符串转换为表示该日期的毫秒数，支持以下格式：
  - "月/日/年"，如"5/23/2019"
  - "月英文名 日, 年",如"May 23, 2019"
  - "周几 月英文名 日 年 时:分:秒 时区"，"Tue May 23 2019 00:00:00 GMT-0700"
  - ISO 8601扩展格式: "YYYY-MM-DDTHH:mm:ss.sssZ",如2019-05-23T00:00:00(只适用于兼容ES5实现)

如果传给Date.parse()字符串并不表示日期，则返回NaN。如果直接把表示日期的字符串传给Date构造函数，那么Date会在后台调用Date.parse()。

- Date.UTC()方法也返回日期的毫秒表示，但使用跟Date.parse()不同的信息来生成这个值。传给Date.UTC()的参数是年、零起点月数、日、时（0起点）、分、秒和毫秒。这些参数只有前面两个是必须的。后面的参数如果不提供，那么就是0或1.

```javascript
// 代表2023 年1月1日 0时0分0秒
Date(Date.UTC(2023, 0))
```

与Date.parse()一样，Date.UTC()也会被Date构造函数隐式调用，但有一个区别：这种情况下创建的是本地日期，不是GMT日期

- ECMAScript还提供Date.now()方法，返回表示方法执行时日期和时间的毫秒数`Date.now()`


**继承方法**

与其他类型不同，Date类型重写了`toLocaleString()`、`toString()`、`valueOf()`方法。重写后这些方法的返回值不一样。

- `toLocaleString()`方法返回与浏览器运行的本地环境一致的日期和时间。
- `toString()`方法通常返回带时区信息的日期和24小时时间的字符串。
- `valueOf()`根本不会返回字符串，返回日期的毫秒数。