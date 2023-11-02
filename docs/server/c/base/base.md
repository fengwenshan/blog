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




## 函数和指针

### 函数基本使用

函数完成特定任务的独立程序和代码单元。语法规则需要定义函数的结构和使用方法。

```c
#include <stdio.h>
#define WIDTH 40

void starbar(void);

int main(void) {
    starbar();
    return 0;
}

void starbar(void) {
    for(int count = 0; count < WIDTH; count++)
        putchar('*');
    printf("\n");
}
```

如上程序，有三处使用了starbar函数名：

1. 函数原型：告诉编译器`starbar()`的类型
2. 函数调用：表明在此处执行函数
3. 函数定义：明确指出函数做什么

解析函数原型：`void starbar(void);` starbar函数名，前面一个void, 代表函数返回值为空，如果是int, 那么函数就会return int类型数据，最后面的void代表调用函数不用传递参数，最后一个分号代表函数声明，不是函数定义。也就是说该行告诉编译器去下面找该函数，我只是该函数的定义。这也叫函数签名。


```c
#include <stdio.h>

int max(int a, int b);
// int max(int, int);

int main(void) {
    int a = 10;
    int b = 20;
    int maxValue = max(a, b);
    return 0;
}
int max(int a, int b) {
    return a > b ? a : b;
}
```

max函数签名告诉编译器，我需要两个int类型形参，执行完毕后我将会返回int类型数据出来。

### 尾递归

```c

```






## 数组和指针

1. 数组是由数据类型想同的一系列元素组成。
2. 声明数组需要告诉编译器数组内含有多少项元素与这些元素的类型。编译器会根据这些信息在内存里面开辟响应的空间。
3. 数组声明前加上const, 可以防止数组内容被修改。
4. 初始化数组并复制，如果值的个数少于长度，使用0填充，多就报错。

```c
#include <stdio.h>
#define arrLength 8

void array();

int main() {
    array();
    return 0;
}

void array() {
    // 报错
    // const int arrLength = 8;
    int a = 1;
    printf("%p\n", &a);
    // 使用const声明数组，那么数据项就不能修改 
    // const int powers[arrLength]
    int powers[arrLength] = { 1, 2,3,4, 5,6,7,8 };

    for(int i = 0; i < arrLength; i++) {
        printf("%d\t", powers[i]);
    }
    printf("\n");

    printf("Hello World!\n");
    printf("%p, %p, %d, %d, %d\n", &powers[0], powers, sizeof(int), sizeof(powers[0]), sizeof(powers) );
}
```

5. 定义一个数组，不指定长度，但是要赋值，这时候就是编译器计算数组长度: `const int days[] = { 31, 28 }`, 那么就涉及到数组长度计算了。使用sizeof(数组名)，就会返回数组整个长度，使用seizeof(arr[0]), 返回数组项占用内存的大小， 于是就可以计算出数组的length属性。

```c
#include <stdio.h>
void length(int arr[], int len);

int main() {
    const int days[] = { 31, 28, 31, 30, 31, 30};
    length(days, sizeof days);
    return 0;
}
void length(int arr[], int memoryLen) {
    // 动态数组计算
    const int arrLen = memoryLen / sizeof arr[0];
    for(int i = 0; i < arrLen; i++) {
        printf("%d\t", arr[i]);
    }
    printf("\n");
}
```

6. c99新增特性，指定初始化容器, 未初始化的项都是0

```c
#include <stdio.h>
int main() {
    const int arr[] = { [10] = 20 };
    printf("%d\n", sizeof arr / sizeof arr[0]);
    return 0;
}
```

7. 数组赋值可以单个赋值，但是不允许直接数组之间的赋值，即使数量一样，空数组也不行。

8. 数组下标越界

```c
#include <stdio.h>
void length(int arr[], int len);

int main() {
    const int days[] = { 31, 28, 31, 30, 31, 30};
    length(days, sizeof days);
    return 0;
}
void length(int arr[], int memoryLen) {
    // 动态数组计算
    const int arrLen = memoryLen / sizeof arr[0];
    for(int i = 0; i < arrLen + 2; i++) {
        printf("%d\t", arr[i]);
    }
    printf("\n");
}
```

最后输出：`31      28      31      30      31      30      0       1`。在C语言标注中，使用越界下标的结果是未定义的,这意味着程序看上去是在运行。越界的值编译器不同输出的值也不同，有些会直接终止。

9. c99 指定数组大小

```c
#include <stdio.h>

int main() {
    int len = 2;
    int value[len] = {};
    // 2
    printf("%d\n", sizeof value / sizeof value[0]);
    len = 20;
    // 2 20
    printf("%d\n", sizeof value / sizeof value[0]);
    return 0;
}
```

## 多维数组

定义

```c
#include <stdio.h>

int main(void) {
  const value[][] = {
    {1, 2, 3},
    {1, 2, 3},
    {1, 2, 3}
  }
}
```



