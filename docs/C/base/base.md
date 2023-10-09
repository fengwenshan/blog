# c基础

## 基本数据类型

基本数据类型：int、long、short、char、float、double、unsigned、signed、_Bool、_Complex和_Imaginary
其他类型：数组、指针、结构和联合。

### int类型

C语言中整数类型可表示不同的取值范围和正负值。一般情况使用int类型即可。

int类型是有符号整形，即int类型值必须是整数，可以是正整数、负整数或零。其取值范围-32768 ~ 32767.

C原因提供3个附属关键字修饰基本整数类型：short、long和unsigned。

- `short int`类型，简称short，占用存储空间可能比int类型少，常用语较小的值以达到节约空间。有符号类型
- `long int` 或 `long` 占用空间的存储空间可能比int多，适用于较大数值的场合。long是有符号类型
- `long long int`或`long long`（C99增加）占用的存储空间可能比long多，适用于更大数值场合。该类型至少占64位。属于有符号类型。
- `unsigned int` 或 `unsigned` 只适用于非负值场合。这种类型与有符号类型表示的范围不同（0 ~ 65535）。
- C90 标准中添加了`unsigned long int`或`unsigned long`、`unsigned short int` 或 `unsigned short`。
- C99 标准中添加了`unsigned long long int`或`unsigned long long`。
- 在任何有符号类型前面添加关键字signed。可以强调使用有符号类型意图。

| 类型                 | 转换说明     |
|--------------------|----------|
| int                | d%       |
| 八进制                | %o 或 %#o |
| 十六进制               | %x 或 %#x |
| 八进制                | %o 或 %#o |
| unsigned int       | %u       |
| long类型             | %ld      |
| 十六进制long类型         | %lx      |
| 八进制long类型          | %lo      |
| short              | %h       |
| 十进制显示short         | %hd      |
| 八进制显示short         | %ho      |
| unsigned long      | %lu      |
| signed long long   | %lld     |
| unsigned long long | %llu     |

## 浮点类型

C语言提供浮点类型有：float、double和long double类型

| 类型             | 转换说明 |
|----------------|------|
| float 或 double | f%   |
| 指数             | e%   |
| long float     | lf%  |

还有一个特殊浮点值NaN.

## char类型

char类型用于存储字符，但是从技术层面看，char是整数类型。因为char类型实际上存储的是整数而不是字符。计算机使用数字编码来处理字符。

在C语言中，用**单引号**括起来的单个字符被称为字符常量。

scanf()方法&符号表示把输入的字符赋值给变量ch.

```c
char grade = 'A'
```

| 类型   | 转换说明 |
|------|------|
| char | c%   |

## bool类型

C99标准添加_Bool类型，用于表示布尔值，即逻辑值true 和 false。因为C语言用值1和0表示true和false,所以Bool类型实际上是一种整数类型。但原则上它仅占用1位存储空间。

## 字符串

字符串是一个或多个字符的序列。C语言中没有专门用于存储字符串的变量类型，字符串都被存储在char类型的数组中。数组由连续的存储单元组成，字符串中的字符被存储在相邻的存储单元中，每个单元存储一个字符。最后结尾位置`\0`空字符结束。因此，如果内存40个存储单元字符串，只能存储39个字符串，剩下一个字节留给空字符串。

```c
char name[40]
```


## 练习题

### 前n项求和

### 整数分解


### 求最大公约数

### 给定条件的整数集

### 水仙花数

### 九九乘法表

### 统计素数求和

### 猜数游戏

### n项求和







## 格式化输入输出

