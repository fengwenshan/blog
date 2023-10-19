# 类型转换

## 数据类型

- 基本数据类型：Number、Boolean、String、Null、Undefined、System(ES6新增)、Bigint(ES10新增)
- 引用数据类型：Object

`typeof`操作符可以用来确定任意变量的数据类型，返回值：`"undefined"`、`"boolean"`、`"number"`、`"string"`、`"object"`、`"function"`、`"symbol"`、`"bigint"`

```javascript
console.log(typeof '12213'); // 'string'
console.log(typeof 123); // 'number'
console.log(typeof true); // 'boolean;
console.log(typeof undefined); // 'undefined'
console.log(typeof null); // 'object'
console.log(typeof {}); // 'object'
console.log(typeof []); // 'object'
console.log(typeof function() {}); // 'function'

console.log(typeof Symbol('id')) //'symbol'

console.log(typeof 10n); // 'bigint'
```

::: tip typeof 函数为什么返回function
JavaScript中的函数是一种特殊对象，它们是可以调用的对象。虽然函数是对象，但它们有一些独特特性：

- 可调用性：函数可以被调用，这是它们的主要目的。其他对象没有这个特性。
- Function构造函数：函数在JavaScript内部都是通过`Function`构造函数创建的。这就是为什么函数在typeof操作符下返回"function"。
- 内部属性和方法：函数对象包括内部属性和方法：如length、name、apply、bind等, 这些属性和方法使函数在语言内部有特殊作用。

因此，虽然函数是对象的一个特殊类型，但它们有自己的行为和特性，这就是为什么 typeof function 返回 "function" 的原因。
:::

::: tip undefined 与 null区别

undefined: 表示一个声明但未赋值的变量、 一个函数没有返回值时的默认返回值、访问对象的不存在属性时，返回undefined
null: 表示一个特殊的空值，通常用于显示地表示一个变量应该为空或者没有值。通常用于重置对象属性或表示变量不引用有效对象。

区别：

1. undefined是变量在声明后单尚未赋值时的默认值（系统级别），而null需要显示分配给变量。
2. 当想表示变量尚未初始化时，通常使用`undefined`或 `void 0`。而想要表示变量为空或不引用有效对象时，通常使用`null`
3. typeof判断的时候，undefined会返回自身的字符串表示。而null会返回`"object"`。

**建议**：永远不要显示地将变量值设置为undefined.但null可以。任何时候只要变量要保存对象，而当时又没有那个对象可以保存，就要用null来填充。这样就可以保持null是空指针的语义，从而进一步与undefined分开。
:::

::: tip typeof null 返回 "object"
这是一个历史遗留问题，可以说是设计缺陷。这是由于JS早期版本在处理`null`值时出现的问题，导致`null`被错误地标识为对象。

在JavaScript的早期版本中，使用32位系统，其中前3位用于表示值得类型标签。在这个设计中，`000`表示对象，而`null`的二进制表示全为0，因此被错误地解释为对象。

实际上`null`是一种特殊的空值，不是对象。它表示变量不引用任何有效对象。
:::


::: tip undefined == null 返回true

不是隐式类型转换。如果和其他类型进行比较会涉及到隐式类型转换。

在ECMAScript-262第3版之前是不存在的。增加这个特殊值得目的就是为了正式明确空对象指针（null）和未初始化变量的区别。

undefined值是由null值派生而来的，因此ECMA-262将它们定义为表面上相等。
:::

## Boolean

不同类型与布尔值之间的转换规则

| 数据类型       | 转换为false  |
|-----------|-----------|
| Boolean    | false     |
| String   | ""        |
| Number     | 0、NaN     |
| Object    | null      |
| Undefined | undefined |

注意：基本数据类型中三个有包装对象，包装对象也是对象，返回true。

## Number 

JS不区分整数类型与浮点数类型，所有值均使用浮点类型表示。与大部分编程语言一样，JS中数字类型是基于IEEE 754标准实现，该标准通常也称为“浮点数”。JS使用”双精度“格式（即64位二进制）

因为JS中所有数字都是64位浮点格式表示，所以能表现的最大值为：`Number.MAX_VALUE === 1.7976931348623157e308`，最小值`5e-324 === Number.MIN_VALUE`。

JS整数范围是从-9 007 199 254 740 991 ~ 9 007 199 254 740 991（即pow(-2, 53) + 1 ~ pow(2, 53) -1）,最大值可以使用Number.MAX_SAFE_INTEGER表示，最小值使用Number.MIN_SAFE_INTEGER表示。

边界：如果超过这个范围，最大值上溢为Infinity，下溢-Infinity, 最小值下溢为0, 当一个负数发生下溢的时候会返回-0。

JS预定义全局变量：Infinity、NaN。在ES3的时候是可以修改的，ES5修正了这个错误。

:::tip Infinity计算
```javascript
console.log(isFinite(-Infinity)) // true
console.log(Number.NEGATIVE_INFINITY); // -Infinity
console.log(Number.POSITIVE_INFINITY); // Infinity

console.log(0 / Infinity) // 0
console.log(0 / -Infinity) // -0

console.log(2 / 0) // Infinity
console.log(-2 / 0) // -Infinity

console.log(Infinity / 0) // Infinity
console.log(-Infinity / 0) // -Infinity

// 以下非法操作
console.log(0 / 0) // NaN
console.log(-Infinity/ Infinity) // NaN
console.log(-Infinity % Infinity) // NaN
```
:::

::: tip 除数与被除数
6 / 2 = 3  -> 2被6除， 6被除数，2是除数。

在数学中被除数（分母）不能为0。在实数中，整数除以0得到正无穷，负数除以0得到负无穷。

在编程中，具体行为可能会因编程语音而异，在JS中实数除以0，会变为特殊值 Infinity 或 -Infinity，因为js使用IEEE 954浮点数标准，它定义了这种行为。

扩展乘法特殊点：在数学中0乘任何数都为0，但是在js中`Infinity * 0`返回NaN，因为涉及到浮点数特殊规则。
:::

::: tip NaN
NaN: Not a Number（不是一个数值），js中进行非法操作就会返回

- 0除以0： 在数学中，0除以0是一个不定形式或无效操作，通常没有一个单一的确定解。这意味着0除以0并不等于一个特定的数，因为它在数学上没有明确定义结果，这个情况有时表示为0/0
- 给负数做开方，负数不能开方
- 算数运算符与不是数字 或者无法转换为数字的操作数 一起使用
- NaN进行比较的时候都会返回false（包括与自己比较），可以使用`isNaN()`函数或`x != x`

分析0/0: 首先0/0本身就是非法操作，所以返回NaN。优先级比任何数除以0返回无穷大高

isNaN底层实现：首先调用参数的valueOf(), 然后判断返回值是否可以转换为数值，如果不能，则调用toString()方法，并测试其返回值。这也是ECMAScript内置函数和操作符的工作方式。
:::

Number提供三种方法，强制将非数值转换为数值：Number、parseInt、parseFloat。

小技巧：如果写一个输入框，输入`3.`时候输入框应该显示`3.0`, 实际绑定`3`, 可以使用`Number`,虽然parseFloat可以实现，但是它会裁切后面字符串，而Number直接返回NaN.

**Number()方法**

- 数值直接返回（Infinity这个也是数值）
- null 返回 0
- undefined 返回NaN
- bool值，true返回0，false返回-1
- 字符串将被假定为包含数字字面量，并通过解析它们来转换。解析失败返回NaN：
  - 解析前忽略前置后尾随的空格或换行符，忽略前置0（不会导致该值称为8进制）。
  - `+`和`-`允许出现在字符串的开头以表示符号位。只能出现这一次，后面不能跟空格。
  - "" 或 " " 转换为0
  - 浮点值字符串，转换为相应的浮点值
  - 十六进制字符串，则会转换为与该十六进制对应的十进制整数值。
  - BigInt、Symbol抛出TypeError。前者防止精度损失。
  - 其余都是返回NaN
- 对象首先就通过按殊勋调用它们的`[@@toPrimitive]()`、`valueOf()`、`toString()`方法将其转换为原始值。然后将得到的原始值转换为数字。


Symbol.toPrimitive 是内置的 symbol 属性，其指定了一种接受首选类型并返回对象原始值的表示的方法。它被所有的强类型转换制算法优先调用。

Number.parseFloat() 和 Number.parseInt() 与 Number() 相似，但只能转换字符串，并且解析规则略有不同。例如，parseInt() 无法识别小数点, 可以转换进制，parseFloat() 无法识别 0x 前缀。


JS中的浮点值内存空间是整数的两倍，所以ECMAScript总是想办法把值转换为整数。如果值比较大那么使用科学计数法。


:::tip 经典计算问题0.1 + 0.2 === 0.3返回false。
上面说到JS采用IEEE-754浮点数表示（几乎所有语言都是）, 是一种二进制表示法，通过64位来表示一个数字（1 + 11 + 52）。
- 1符号位（二进制符号位）
- 11 指数位（e -1022到1023）
- 52尾数，小数部分（即有效数字,0和1之间的数值）

当0.1和0.2转换为二进制时，会出现无限循环，而双进度浮点数小数部分最多支持52位，超过52位部分就会被截断，然后进行二进制计算，计算完成转为十进制，这个过程就已经出现误差，这个误差的部分就是被计算机阶段的部分导致。

解决方案有两种：

方案1: Number.EPSILON 静态数据属性表示 1 与大于 1 的最小浮点数之间的差值,因为双精度浮点格式只有52位来表示尾数，并且最低位的有效值位`pow(2, -52)`

```javascript
function equal(x, y) {
  return Math.abs(x - y) < Number.EPSILON;
}

const x = 0.2;
const y = 0.3;
const z = 0.1;
console.log(equal(x + z, y)); // true
```

方案二：获取加数中最多的小数位数 e，所有的加数同时放大 Math.pow(10, e) 倍，进行计算之后的结果再缩小 Math.pow(10, e) 倍
:::


进制：二进制（0b）0-1， 八进制（0o或0O）0-7, 十六进制（0x或0X）开始0-9与a-f组合。越界报错


```javascript
const a = 0b1111
console.log(a) // 15

const b = 0o77
console.log(b) // 63

// VM78:1 Uncaught SyntaxError: Invalid or unexpected token
// console.log(0o79)

const c = 0xff
console.log(c) // 255
```


## BigInt

在 JavaScript 中，“number” 类型无法安全地表示大于 pow(2, 53) -1（即 9007199254740991），或小于 pow(-2, 53) + 1 的整数。所以ES10添加BigInt类型，用于表示任意长度的整数。

对 bigint 的所有操作，返回的结果也是 bigint。不要把bigint和常规数字类型混合使用，会报错

```javascript
// 尾部的 "n" 表示这是一个 BigInt 类型
const bigInt = 1234567890123456789012345678901234567890n;
const sameBigint = BigInt("1234567890123456789012345678901234567890");
const bigintFromNumber = BigInt(10); // 与 10n 相同

console.log(1n + 2n); // 3

console.log(5n / 2n); // 2


// 将 number 转换为 bigint
alert(bigint + BigInt(2)); // 3

// 将 bigint 转换为 number
alert(Number(1n) + number); // 3
```

比较

```javascript
// BigInt 和 Number 不是严格相等的，但是宽松相等的。
console.log(0n === 0) // false
console.log(0n == 0) // true

console.log(1n < 2) // true
console.log(2n > 1) // true
```

转换操作始终是静默的，绝不会报错，但是如果 bigint 太大而数字类型无法容纳，则会截断多余的位，因此我们应该谨慎进行此类转换。

对任何 BigInt 值使用 JSON.stringify() 都会引发 TypeError，因为默认情况下 BigInt 值不会在 JSON 中序列化。但是，如果需要，可以实现 toJSON 方法：

```javascript
BigInt.prototype.toJSON = function () {
  return this.toString();
};

JSON.stringify(BigInt(1)); // '"1"'
```

## String


JS采用UTF-16编码的Unicode字符集，是由一组无符号的16位值组成的序号.在UTF-16编码中，每个码元都是16位长。这意味着最多有pow(2, 16)或65535个可能的字符可表示为单个UTF-16码元。每个码元都可以用`\u`开头的4个十六进制数字写在字符串中。

然而，整个Unicode字符集比65536大的多。二外的字符以代理对的形式存储UTF-16中，代理对是一对16码元，表示一个单个字符。为了避免歧义，配对的两个部分必须介于`0xD800`和`0xDFFF`之间，并且这些码元不用于编码单码元字符。（更准确地说，前导代理，也称为高位代理，其值在 `0xD800` 和 `0xDBFF` 之间（含），而后尾代理，也称为低位代理，其值在 `0xDC00` 和 `0xDFFF` 之间（含）。）每个 Unicode 字符由一个或者两个 UTF-16 码元组成，也称为 Unicode 码位（code point）。每个 Unicode 码位都可以使用 \u{xxxxxx} 写成一个字符串，其中 xxxxxx 表示 1–6 个十六进制数字。

```javascript
"😄".split(""); // ['\ud83d', '\ude04']; splits into two lone surrogates

// "Backhand Index Pointing Right: Dark Skin Tone"
[..."👉🏿"]; // ['👉', '🏿']
// splits into the basic "Backhand Index Pointing Right" emoji and
// the "Dark skin tone" emoji

// "Family: Man, Boy"
[..."👨‍👦"]; // [ '👨', '‍', '👦' ]
// splits into the "Man" and "Boy" emoji, joined by a ZWJ

// The United Nations flag
[..."🇺🇳"]; // [ '🇺', '🇳' ]
// splits into two "region indicator" letters "U" and "N".
// All flag emojis are formed by joining two region indicator letters
```

字符串强制类型转换：许多内置操作首先将它们的参数强制转换为字符串（这就是为什么String对象的行为类似于字符串原始值的原因）

- 字符串直接返回
- undefined和null 本身直接转为字符串形式展示
- true, false 转换成字符串相应表示。
- 使用与`toString(10)`想同的算法转换数字
- Symbol抛出TypeError
- 对于对象，首先，通过依次调用其`[@@toPrimitive]()`（hint 为 "string"）、toString() 和 valueOf() 方法将其转换为原始值。然后将生成的原始值转换为一个字符串。



- `JSON.stringify()`在将JSON对象序列化为字符串时也用到了ToString的相关规则：
  - 大多数情况下JSON字符串化和toString()效果基本相同，只不过序列化的结果总是字符串（42 -> "42"、"42" -> ""42""、null -> "null"、"true" -> "true"）,所有安全JSON值都可以使用该方法
  - 不安全的JSON值：undefined、function、symbol和循环引用的对象（报错）都不符合JSON结构的标准，如果该方法遇到则会忽略返回undefined， 如果是数组中则返回null, 如果对象中使用，则会直接删除该字段
  - 如果对象中定义了toJSON()方法，JSON字符串化时会首先调用该方法，然后用它的返回值来序列化
  - 如果含有非法JSON值得对象做字符串化，或对象中的某些值无法序列化，就需要重新定义toString()方法类返回一个安全的JSON值

```javascript
const a = {}
const b = {
  n: 42,
  a,
  f: function(){}
}
a.e = b; // 产生了循环引用

// JSON.stringify(b) // 报错

// 自定义JSON序列化
b.toJSON = function() {
    return { n: this.n }
}
JSON.stringify(b) // "{ "n": 42 }"
```


## 隐式类型转换

- Boolean与其他类型对比, 先将Boolean转换成Number类型，然后再次对两个操作数进行宽松比较。
- Number与String, 将String转换为Number. 转换失败会得到NaN。
- Number 转 BigInt：按照其数值进行比较。如果 Number 是 ±Infinity 或 NaN，返回 false。
- String 转 BigInt: 使用与 BigInt() 构造函数相同的算法将字符串转换为 BigInt。如果转换失败，则返回 false。
- 对象将依次调用它的 `[@@toPrimitive]()`（将 default 作为 hint 值）、`valueOf()` 和 `toString()` 方法，将其转换为原始值。注意，原始值转换会在 `toString()` 方法之前调用 `valueOf()` 方法。字符串顺序第二个和第三个顺序调换


```javascript
// 当数组进行比较的时候，那么数组会先调用valueOf()进行转换，如果是原始值，则进一步进行原始值比较。如果是不是原始值，则继续调用toString()方法转换为原始值，如果不是则报错
// 数组重写了toString方法，内部实现join(',')
function def(target, key, value) {
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: false,
    writable: true,
    value,
  })
}


// 数组没有valueOf, 调用的是对象的
def(Array.prototype, 'valueOf', function(...args) {
  console.log('我是数组valueOf', Object.prototype.valueOf.call(this, ...args))
  return Object.prototype.valueOf.call(this, ...args)
  // return this.join(...args)
})


// 数组有toString
const arrTostring = Array.prototype.toString
def(Array.prototype, 'toString', function(...args) {
  console.log('我是数组toString', arrTostring.call(this, ...args))
  return arrTostring.call(this, ...args)
  // return this
})

if(1 == [1]) {
  console.log('相等')
} else {
  console.log('不相等')
}
/*
我是数组valueOf [ 1 ]
我是数组toString 1
相等
*/

/** 下面是对象内容，输出顺序和数组一致
 * 我是对象valueOf { key: 1 }
 * 我是对象toStringf [object Object]
 * 不相等
 */
const objValueOf = Object.prototype.valueOf
const objtoString = Object.prototype.toString

def(Object.prototype, 'valueOf', function(...args) {
  console.log('我是对象valueOf', objValueOf.call(this, ...args))
  return objValueOf.call(this, ...args)
})

def(Object.prototype, 'toString', function(...args) {
  console.log('我是对象toStringf', objtoString.call(this, ...args))
  return objtoString.call(this, ...args)
})

if(1 == {key: 1}) {
  console.log('相等')
} else {
  console.log('不相等')
}
```

## Symbol

Symbol出现背景，在之前对象的属性名都是字符串，可能造成属性名的冲突，从而出现覆盖问题。Symbol的出现就是解决这个问题，它的机制就是保证每个属性的名字都是独一无二的。

```javascript
// 不能使用new, 因为它是原始数据类型
const s = Symbol()
```

## 位运算符

JS操作内存中表示数据的比特（位）。ECMAScript中的所有数值都以IEEE 754 64位格式存储，但位操作并不直接应用到64位表示，而是先把值转换为32位整数，再进行位操作，之后再把结果转为64位。对于开发者而言，就好像只有32位整数一样，因为64位整数存储格式是不可见的。那么只需要考虑32位整数即可。这也让二进制操作变得与其他语言中类似。但这个转换也导致了一个奇特的副作用，就是特殊值NaN与Infinity在位操作中都会被当成0处理。

有符号32位表示：左边第一位代表符号位。0表示正、1表示负。 如果是正值，以二进制格式存储。如果是负值，则以**二补数**的二进制编码存储

::: tip 二补数计算
1. 确定绝对值的二进制表示（如-18， 先确定18的二进制表示）
2. 然后二进制各位取反（0变1,1变0）
3. 得到的二进制 + 1
:::

如果将位运算符应用到非数值，那么首先会使用Number()函数将该值转换为数值，然后在应用位操作。最终得到数值

```javascript
const num1 = 25 
// ~num1 // -26 64进制表示，然后各位取反，转译10进制

const num2 = 25
-num1 -1 // -26
```

上面两个结果一样，但位操作的速度快的多。因为位操作符是在数值的底层完成。

- 按位与（`&`）：有假（0）即为假（0）；`25 & 3 = 1`
- 按位或（`|`）：有真（1）即为真（1）；`25 | 3 = 27`
- 按位异或（`^`）：想同为假（0），不同为真（1）；`25 ^ 3 = 26`
- 左移 （`<<`）：左移几位，在右边补几位0；如果有符号位，符号位保留；`2 << 5 = 64`
- 有符号位右移（`>>`）：右移几位，在符号位右边补几位0；`64 >> 5 = 2`
- 无符号位右移（`>>>`）：对于正数，无符号右移与有符号右移结果相同。但是负数差别就很大：无符号右移将负数的二进制表示当成整数的二进制表示来处理，如下代码：

```javascript
const value = -64; 
// 64 -> 0000 0000 0000 0000    0000 0000 0100 0000
//取反 -> 1111 1111 1111 1111    1111 1111 1011 1111
//+1  -> 1111 1111 1111 1111    1111 1111 1100 0000
value >>> 5 // 134 217 726
// 无符号右移 会把它当成正数处理
//    -> 0000 0011 1111 1111    1111 1111 1111 1110    0000 0 
//    -> 0000 0011 1111 1111    1111 1111 1111 1110
```

## bool操作符

> 布尔运算符一共三个：逻辑非（`!`）、逻辑与（`&&`）、逻辑或（`||`）。

**逻辑非**

可以应用于任何数据类型，都会返回boolean值。逻辑非操作首先将操作值转换为bool值，然后再对其取反。逻辑非遵循的规则如下都是返回true（与bool转换刚好相反）：

- 空字符、
- 0、
- NaN
- null、undefined

同时使用`!!`相当于调用`Boolean()`

**逻辑与**

逻辑与操作符可用于任何类型的操作数，不限于bool值。如果有操作数不是bool值，则逻辑与并不一定会返回boolean值，而是遵循以下规则：

- 如果第一个值为假值，就会直接返回相应的假值（空字符串、0、NaN、null、undefined、false），不会对第二个值进行求值
- 如果第一个值为真值，那么直接返回第二个值

**逻辑或**

- 如果第一个值为假值，那么就会返回第二个值
- 如果第一个值为真值，那么直接返回第一个值






