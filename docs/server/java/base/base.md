# 基础

## 基本数据类型

每个数据类型都有它的取值范围。编译器会根据每个变量或常量的数据类型为期分配内存空间。Java数值、字符值和布尔值数据提供八种基本数据类型


|类型名|范围|存储空间|
|----|----|----|
|byte| $-2^7$ 或 -128 ~ $-2^7 -1$ 或 127| 8位带符号数 |
|short| $-2^{15}$ 或 -32768 ~  $-2^{15}-1$ 或 32767 | 16位带符号数 |
|int| $-2^{31}$ 或 -2 147 483 648 ~  $-2^{31}-1$ 或 2 147 483 647| 32位带符号数 |
|long| $-2^{63}$ 或 -9 223 372 036 854 775 808 ~  $-2^{63}-1$ 或 9 223 372 036 854 775 807 | 64 位带符号数|
|float| 负数范围：-3.4028235E+38 ~ -1.4E-45 <br /> 正数范围：1.4E-45 ~ 3.4028235E+38 | 32位，标准IEEE 754|
|double| 负数范围：-1.7976931348623157E+380 ~ -4.9E-324 <br/> 正数范围：4.9E-324 ~ 1.7976931348623157E+308 | 64位，标准IEEE 754|
|char| 0 ~ 65535 |16位无符号整数|
|boolean| true、false| 8位无符号整数 |

Scanner对象读取数值的方法如下：

|方法|描述|
|----|----|
|nextByte()| 读取一个byte类型整数 |
|nextShort()| 读取一个short类型的整数|
|nextInt()| 读取一个int类型的整数 |
|nextLong()| 读取一个long类型的整数|
|nextFloat() | 读取一个float类型的数|
|nextDouble()| 读取一个double类型的数|

```java
// 定义一个三位数，将其拆分为个位、十位、百位
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello world!");
    int num = 123;
    int b = num / 100;
    int s = num % 100 / 10;
    int g = num % 10;
    System.out.printf("%d, %d, %d", b, s, g);
  }
}
```

不同类型的数值参与计算会进行隐式转换小转大。大转小可以使用强制类型转换。

- 字符串与任何基本类型做加法，都是拼接
- 字符与数字相加，取出内存中对应的数字与数字相加
- 字符与boolean相加，报错


```java
public class Main {
  public static void main(String[] args) {
    int a = 10;
    double b = 13.14;
    // 输出double类型，向上转换 23.140000
    System.out.printf("%f", a + b);

    // 强制类型转换 23
    short c = (short)(a + b);
    System.out.printf("%d\n", c);
    
    // 字符类型 75
    // 字符存储在底层是存储数值
    char s = 'A'; // 65
    System.out.printf("%d\n", s + a);
    // 78
    System.out.println(6 + 'H');
    // 6HH
    System.out.println(6 + "HH");
    // HHH
    System.out.println('H' + "HH");
    // trueHHH
    System.out.println(true + "HH");
  }
}
```

## 字符

字符数据类型用于表示单个字符，使用char表示单个字符。使用单引号括住。

计算机内部使用二进制数，一个字符在计算机中是以0和1构成的序列的形式来存储。将字符映射到它的二进制形式的过程为编码。字符有很多种不同的编码形式，编码表定义该如何编码每个字符。

Java支持Unicode码，Unicode码是由Unicode协会建立的一种编码方案，支持使用世界各种语言所书写文本的交换、处理和显示。Unicode一开始被设计为16位字符编码。

一个16位的编码所能产生的字符只有65 535个，它是不足以表示全世界所有字符的。因此，Unicode标准被扩展为1 112 064个字符。这些字符都远远超过原来16位的限制，它们被称为补充字符。Java支持这些补充字符。

一个16位Unicode占两个字节，用以\u开头的4位十六进制数表示，范围从'\u0000'到'\uFFFF'。大多数计算机采用ASCII(美国标准信息交换码)，它是所有大小写字母、数字、标点符号和控制字符的8位编码表。Unicode码包含ASCII码，从'\u0000'到'\u007F'对应128个ASCII字符。

常用字符ASCII码

| 方法       | 十进制编码值   | Unicode值        |
|:---------|:---------|:----------------|
| '0'~'9'  | 48 ~ 57  | \u0030 ~ \u0039 |
| '0'~'9'  | 65 ~ 90  | \u0041 ~ \u005A |
| '0'~'9'  | 97 ~ 122 | \u0061 ~ \u007A |

字符的表现形式是单个字符，但是存储在内存中是对应的数值类型。所以可以使用自增加减, 比较的时候也是比较底层数值。

- **转译字符**

| 转译序列 | 名称   | Unicode码 | 十进制 |
|:----|:-----|:---------|:----|
| \b  | 退格   | \u0008   | 8   |
| \t  | Tab键 | \u0009   | 9   |
| \n  | 换行符  | \u000A   | 10  |
| \f  | 换页符  | \u000C   | 12  |
| \r  | 回车符  | \u000D   | 13  |
| \\  | 反斜杠  | \u005C   | 92  |
| \"   | 双引号  | \u0022   | 34  |


- **Character**

| 方法                   | 描述                     |
|:---------------------|:-----------------------|
| isDigit(ch)          | 如果指定的字符是一个数字，返回true    |
| isLetter(ch)         | 如果指定的字符是一个字母，返回true    |
| isLetterOrDigit(ch)  | 如果指定的字符是一个字母或数字，返回true |
| isLowerCase(ch)      | 如果指定的字符是一个小写字母，返回true  |
| isUpperCase(ch)      | 如果指定的字符是一个大写字母，返回true  |
| isLowerCase(ch)      | 返回指定的字符小写形式            |
| isUpperCase(ch) | 返回指定的字符大写形式            |


## 字符串

字符串是一个字符序列

char类型只表示一个字符。为了表示一串字符，可以使用String数据类型: `String mes = "welcome"`,它是引用类型。

String简单方法

| 方法            | 描述                     |
|:--------------|:-----------------------|
| length()      | 返回字符串中的字符数             |
| charAt(index) | 返回字符串中指定位置的字符          |
| concat(s1)    | 将本字符串和字符串s1连接，返回一个新字符串 |
| toUpperCase() | 返回一个新字符串，其中所有的字母大写     |
| toLowerCase() | 返回一个新字符串，其中所有字母小写      |
| trim()        | 返回一个新字符串，去掉两边空白字符      |

String是Java中的对象，上面的方法只能从一个特定的字符串实例来调用。由于这个原因，这些方法称为实例方法。非实例方法称为静态方法。静态方法可以不使用对象来调用。定义在Math类中的所有方法都是静态方法。它们没有绑定到一个特定的对象实例上。

String对象静态方法

| 方法                                  | 描述                                                    |
|:------------------------------------|:------------------------------------------------------|
| str1.equals(str2)                   | 比较str1与str2是否相等                                       |
| str1.equalsIgnoreCase(str2)         | 比较str1与str2是否相等,不区分大小写                                |
| str1.compareTo(str2)                | 返回大于0、等于0、小于0的整数，表明该字符串是否大于等于或小于str2                  |
| str1.compareToIgnore(str2)          | 和 compareTo一样，只是在比较的过程中不区分大小写                         |
| str1.startsWith(str2)               | 如果字符串以特定的前缀开始，返回true                                  |
| str1.endsWith(suffix)               | 如果字符串以特定的后缀结束，返回true                                  |
| str1.contains(str2)                 | 如果s1是该字符串的子字符串，返回true                                 |
| str1.indexOf(str2[, fromIndex])     | 返回字符串出现在第一个str2的下标。如果没有匹配返回-1。fromIndex可以指定开始查找的位置    |
| str1.lastIndexOf(str2[, fromIndex]) | 返回字符串中出现在最后一个str2的下标。如果没有匹配返回-1， fromIndex可以指定开始查找的位置 |
| str1.contains(str2)                 | 如果s1是该字符串的子字符串，返回true                                 |
| str1.contains(str2)                 | 如果s1是该字符串的子字符串，返回true                                 |
| str1.contains(str2)                 | 如果s1是该字符串的子字符串，返回true                                 |
| str1.contains(str2)                 | 如果s1是该字符串的子字符串，返回true                                 |
| str1.contains(str2)                 | 如果s1是该字符串的子字符串，返回true                                 |

字符串转int值，可以使用`Integer.parseInt`方法，前提转换的字符串是合法数字字符串`int intValue = Integer.parseInt(intString)`

## 数学函数

Java在Math类中提供了许多实用方法，来计算常用的数学函数。

- min和max方法用于返回两个数的最大值和最小值
- abs返回绝对值。
- random 用于生成0.0且小于1.0的double型随机数

```java
// 生成50-60之间的整数数值
public class HelloWorld {
  public static void main(String[] args) {
      System.out.println( 50 + (int)(Math.random() * 10) ); // 2.0
  }
}
```


## 取整方法

| 方法       | 描述             |
|:---------|:---------------|
| ceil(x)  | 向上取整           |
| floor(x) | 向下取整数          |
| rint(x)  | 取整为它最接近的整数，如果x与两个整数的距离相等，则返回其中为偶数的那一个           |
| round(x) | 四舍五入 |

```java
public class HelloWorld {
  public static void main(String[] args) {
    System.out.println( Math.rint(2.3) ); // 2.0
    System.out.println( Math.rint(2.5) ); // 2.0
    System.out.println( Math.rint(2.7) ); // 3.0

    System.out.println( Math.rint(3.3) ); // 3.0
    System.out.println( Math.rint(3.5) ); // 4.0
    System.out.println( Math.rint(3.7) ); // 4.0


    System.out.println( Math.round(2.3) ); // 2
    System.out.println( Math.round(2.5) ); // 3
    System.out.println( Math.round(2.7) ); // 3

    System.out.println( Math.round(3.3) ); // 3
    System.out.println( Math.round(3.5) ); // 4
    System.out.println( Math.round(3.7) ); // 4
  }
}
```

### 指数函数

| 方法           | 描述                           |
|:-------------|:-----------------------------|
| exp(x)       | 返回e的x次方（$e^{x}$）             |
| log(x)       | 返回x的自然对数（lnx = log$_ex$）     |
| log10(x)     | 返回x的以10为底的对数（log$_{10}x$）    |
| pow(a, b)    | 返回a的b次方（$a^b$）               |
| sqrt(x)      | 对于x≥0的数字，返回x的平方根（$\sqrt{x}$） |

### 三角函数

| 方法                | 描述                   |
|:------------------|:---------------------|
| sin(radians)      | 返回以弧度为范围的角度，正弦函数值    |
| cos(radians)      | 返回以弧度为范围的角度，余弦函数值    |
| tan(radians)      | 返回以弧度为范围的角度，正切函数值    |
| toRadians(degree) | 将以度为单位的角度转换为弧度表示     |
| toDegrees(degree) | 将以弧度为单位的角度转换为度表示     |
| asin(degree)      | 返回以弧度为单位的角度的反三角正弦函数值 |
| acos(degree)      | 返回以弧度为单位的角度的反三角余弦函数值                     |
| atan(degree)      | 返回以弧度为单位的角度的反三角正切函数值                     |



## 方法


```java
public class Main {
  public static void main(String[] args) {
    // ·方法调用
    isEventNumber(10)
    int max = getMax(8 ,11);
    System.out.println(max);
    
    // true
    System.out.println( isNarcissus(153) );
    // false
    System.out.println( isNarcissus(154) );
  }
  // 判断是否是偶数
  public static void isEventNumber(int num) {
    
    System.out.println(num % 2 == 0 ? "偶数" : "奇数");
  }
  // 输出最大值
  public static int getMax(int num1, int num2) {
    // Math.max(num1, num2)
    return num1 > num2 ? num1 : num2;
  }
  // 判断是否为水仙花数（三位数）
  public static boolean isNarcissus(int num) {
    int b = num / 100;
    int s = num % 100 / 10;
    int g = num % 10;
    return num == Math.pow(b, 3) + Math.pow(s, 3) + Math.pow(g, 3);
  }

  // 方法重载  
  // public static int sum(int a, int b) 方法签名，所以才会有函数重载
  public static int sum(int a, int b) {
    return a + b
  }
  public static double sum(double a, double b) {
    return a + b
  }
  public static double sum(double a, double b, double c) {
    return a + b + c
  }
  
  // 可变长参数列表
  public static void parintMax(double... args) {
    
  }
}
```

## 数组

### 一维数组

```java
public class Main {
  public static void main() {
    // 静态初始化
    int[] value = new int[]{ 1, 2, 3, 4, 5, 6 };
    // 简化格式
    int[] value1 = { 1, 2, 3, 4, 5, 6 };
    // 数组溢出报错, 为null
    // System.out.println(value1[20]);
    for(int i = 0, len = value1.length; i < len; i++) {
        System.out.println(value1[i]);
    }
    // 动态初始化, 没有填充项默认值为0
    int[] value2 = new int[3];



    int maxValue = max({ 80, 90, 100, 60, 80, 70 });
    // 求最大值
    System.out.printf("数组{ 80, 90, 100, 60, 80, 70 }最大值：%d\n", max(new int[]{ 80, 90, 100, 60, 80, 70 }));
  }
  public static int max(int[] arr) {
    int maxValue = arr[0];
    for(int i = 1, len = arr.length; i < len; i++) {
        if(maxValue < arr[i]) maxValue = arr[i];
    }
    return maxValue;
  }
}
```

```java
// 数组随机数打乱
public class Main {
  public static void main() {
    int[] arr = { 70, 80, 90, 100, 101, 102 };
    int[] arr1 = outOfOrder(arr);
    System.out.println(arrJoin(arr1));
  }
  public static String arrJoin(int[] arr) {
    return arrJoin(arr, ",");
  }
  public static String arrJoin(int[] arr, String str) {
    String s = "";
    for(int i = 0, len = arr.length;  i < len; i++ ) {
        s = i != len - 1 ? (s + arr[i] + str) : (s + arr[i]);
    }
    return s;
  }
  // 打乱数组元素
  public static int[] outOfOrder(int[] arrs) {
    int len = arrs.length;
    int[] arr = Arrays.copyOf(arrs, len);
    Random r = new Random();
    for(int i = 0; i < len; i++) {
      int index = r.nextInt(len);
      if(i != index) {
        int temp = arr[i];
        arr[i] = arr[index];
        arr[index] = temp;
      }
    }
    return arr;
  }
}
```

### 二维数组

```java
// 定义
int[][] arr = new int[][]{ {1,2,3}, {1,2,3}, {1,2,3} };
int arr1[][] = { {1,2,3}, {1,2,3}, {1,2,3} };
int[] arr[] = { {1,2,3}, {1,2,3}, {1,2,3} };
```

## 导包

在同一包下，在不同包下的导入。

```java
// src/com.wenshan/Main.java
package com.wenshan;
public class Main {
  public static void main(String[] args) {
    StudentText s = new StudentText();
    s.study();
  }
}

// src/com.wenshan/Student
package com.wenshan;

public class StudentText {
    public void study() {
        System.out.println("好好学习");
    }
}

// src/com.shanghai.wenshan/Student
package com.shanghai.wenshan;

public class Student {
    public static void main(String[] args) {
        // 方法1
        com.wenshan.StudentText s = new com.wenshan.StudentText();
        s.study();
    }
}
/* ----- 上面 和 下面 二选一就行了------ */
// src/com.shanghai.wenshan/Student
package com.shanghai.wenshan;
import com.wenshan.StudentText;
public class Student {
    public static void main(String[] args) {
        // 方法二，引包
        StudentText s = new StudentText();
        s.study();
    }
}
```








![](img/type.png)

$(1+x)^{n} =1$

$-2_{7}$
$x^{22}$

$\sin \alpha + \sin \beta =2 \sin \frac{\alpha + \beta}{2}\cos \frac{\alpha - \beta}{2}$

$\begin{array}{c} 
  A={\left[ a_{ij}\right]_{m \times n}},B={\left[ b_{ij}\right]_{n \times s}} \\  
  c_{ij}= \sum \limits_{k=1}^{{n}}a_{ik}b_{kj} \\  
  C=AB=\left[ c_{ij}\right]_{m \times s}  
  = \left[ \sum \limits_{k=1}^{n}a_{ik}b_{kj}\right]_{m \times s} 
\end{array}$

$O = \begin{bmatrix}  
  0 & 0 & \cdots & 0 \\  
  0 & 0 & \cdots & 0 \\  
  \vdots & \vdots & \ddots & \vdots \\  
  0 & 0 & \cdots & 0  
\end{bmatrix}$

$P \left( \bigcup \limits_{i=1}^{+ \infty}A_{i}\right) = \prod \limits_{i=1}^{+ \infty}P{\left( A_{i}\right)}$     

$(1+x)^{n} =1 + \frac{nx}{1!} + \frac{n(n-1)x^{2}}{2!} + \cdots$ 


$\begin{array}{l}  
  \nabla \cdot \mathbf{E} =\cfrac{\rho}{\varepsilon _0}  \\  
  \nabla \cdot \mathbf{B} = 0 \\  
  \nabla \times  \mathbf{E} = -\cfrac{\partial \mathbf{B}}{\partial t }  \\  
  \nabla \times  \mathbf{B} = \mu _0\mathbf{J} + \mu _0\varepsilon_0 \cfrac{\partial \mathbf{E}}{\partial t }   
\end{array}$



