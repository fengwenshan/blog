# Dart 语法

Dart是谷歌发布的开源编程语言，初期目标是下一代web开发语言，目前已经可用于全平台开发。Dart又是强类型面向对象编程语言。

## HelloWorld

和c语言一样，main方法作为入口，返回类型放在前面。

```dark
void main() {
  // 控制台打印
  print("Hello World");
}
```

## 变量、常量

使用var声明一个变量（这点和JavaScript声明变量方式一样）,然后就是赋值了，未初始化默认为null。

Dart是一门强类型语言，在第一次赋值后，就不能修改类型。如果想要修改可以使用`dynamic`关键字。

常量可以使用`final`或`const`进行修饰，它们的区别是： final 修饰的必须声明赋值同时。而const可以先声明后赋值，赋值后就不能修改了

## 内置类型

Dart内置一些类型： Number、String、Boolean、List、Map、Runes、Symbols。

Dart内部不存在隐式类型转换。


### 数字


数值型可以分为：int和double，可以使用num、int、double声明。

```dart
abstract class int extends num;
abstract class double num;
```

### 字符串

字符串创建方式：单引号、双引号、三个引号或双引号创建多行字符串、r创建原始raw字符串。

差值表达式：`${expression}`

```dart
var str1 = '''您好，
  下次再来。
''';

var str1 = """您好，
  下次再来。
""";


var str2 = r'我是r创建的raw字符串';
```


### 布尔类型

布尔类型通常在if条件判断语句里面。布尔值：使用bool表示、只有true和false、是编译时常量、可以在debug模式下通过assert断言函数判断。


### List与数组

list表示集合，和数组一个概念。

```dart
// 创建list
var list = [1,2,3];

// 通过构造方法创建list
var list1 = new List();

// 创建一个不可变的List
var list2 = const(1, 2, 3);

// 尝试修改一个不可变的List, 会报错
list2[1] = 2;
```

### Map

Map以key-value形式存储，键值都可以是任何类型的对象，每个键只出现一次。

```dart
void main() {
  // 键需要使用引号引起来
  Map map = {
    "name": "Switch",
    "age": 18,
    "like": ["eat", "play"]
  };
  print(obj);
  
  // 创建不可变的：前面添加const
  Map map1 = const {
    "name": "Switch",
    "age": 18,
    "like": ["eat", "play"]
  };
  
  // 构建方式：先创建后赋值
  Map map2 = new Map();
  obj2['name'] = 'Switch';
  obj2['age'] = 18;
}
```

### dynamic 与 Object

在Dart中，一切皆对象，而且这些对象的父类都是Object。

```dart
var name1 = "abc";
Object name2 = "abc";
dynamic name3 = "abc";
```

上面写法都没有问题，但是不建议，在开发中进来明确变量类型，因为这样可以提高安全性和加快编译速度，如果不指定类型，则再debug模式下类型会是动态的。

dynamic与Object不同的是dynamic声明的对象就是告诉编译器不用检测，而Object声明的对象只能使用 Object 的属性与方法, 否则编译器会报错

```dart
dynamic obj = <String, int>{};

if(obj is Map<String, int>) {
  obj['age'] = 20;
}
var map = obj as Map<String, int>;
```

## 运算符

```dart
// 三目运算符
expr ?? expr1 : expr2;

// 除法
var val = 12 ~/ 7; // 1

// 级联操作符
String s = new StringBuffer();
```

- as、is与is!
  - as 判断属于某种类型
  - is 如果对象具有指定的类型，则为true
  - is! 如果对象具有指定的类型，则为false




## 捕获异常

Dart的异常捕获比Java还要强大，可以抛出任意类型的对象，抛出方式：`throw Exception('我是异常')`。

```dart
try {
  // 捕获特定类型的异常
} on AuthorizationException catch (e) {
  // 捕获特定类型的异常，但不需要这个对象
} on Exception {
  // 捕获所有异常
} catch(e) { 
  // 异常处理
} finally { }
```



### 函数Function

Dart是一门面向对象语言，所以函数也是对象，并且函数的类型是Function（和JavaScript一样）。在Flutter里面，函数也可以作为参数传递给其他函数，这就代表可以函数式编程。

每个应用程序都必须有一个顶层main函数，该main函数返回void并具有List可选参数：

```dart
void main() {
  runApp( MyApp() );
}

// 可选参数：平常风格
void sum(int a, int b) {}
// 指定可选参数位置
void sum(int a, [int b]) {}

// 必传参数 @requred修饰 形参
void sum(@required int a, @required int b) {}

// 默认参数
void sum(int a = 21, int b = 42) {}

// 函数作为参数传递
void printItem(String item) {
  print(item);
}
var users = ['1' , '2', '3'];
users.forEach(printItem)

// 函数作为变量
var say = (name/* 这里没有指明类型，随便传入参数 */) {
  print(name);
};
say('xixixi');
```


## 异步编程

### Future

- Future: 是一个Future自身的泛型`Future<T>`对象，它表示一个异步操作产生的T类型的结果。和JavaScript的`Promise`有点像。如果结果的值不可用，Future的类型回事`Future<void>`，如果返回一个Future的函数被调用，将会发生两个事情：
  - 这个函数加入待完成的队列并且返回一个未完成的Future对象。这点和Promise一样
  - 当这个操作结束，Future对象返回一个值或者错误。

```dart
Future<int> future = getFuture();
future.then(value => handleValue(value))
.catcheError(err => handleError(error)
.whenComplete() => handleComplete();
```

future.then中接收异步处理结果，并根据业务需求做相应处理。而future.catchError则用于在异步函数中捕获并处理错误。在有些业务场景下，无论异步任务的处理结果是成功还是失败，都要做一些处理，这时候可以使用Future的whenComplete进行回调。


### async和 await

这里的async和await 出现原因和JavaScript一样，解决回调地狱问题，也是语法糖

```dart
// JavaScript async 放在前面
setup() async {
  try {
    String seep1Result = await step('step');
    String seep2Result = await step('step');
    String seep3Result = await step('step');
    String seep4Result = await step('step');
  } catch(e) {
  }
}
```

### 继承、实现和混入

Java中有接口（interface）、继承（extends）、抽象（implement）。dark也是一样的

- 继承：Flutter继承是单继承，继承一个类之后，子类可以通过`@override`来重写超类（父类）中的方法，也可以通过super来调用超类中的方法。构造函数不能被继承，另外Flutter没有属性修饰符，因此可以直接访问超类中的所有变量。
- 接口实现：Flutter是没有接口interface关键字，但是Flutter中的每个类都是一个隐式接口，这个接口包含类里的所有成员变量和定义方法。当类被看做是接口时，类中的方法就是接口中的方法，它需要在子类里重新被实现。
- 抽象：

```dart
abstract class CanFixComputer {
  void fixComputer();
}
class CanProgramming {
  void programming();
}
class SoftwareEngineer extends Engineer implements CanFixComputer, CanProgramming {
  @override
  void fixComputer() {}
  @override 
  void programming() {}
}
```

Dart新增混合（mixins,也可以理解混入），特性就是可以把自己方法提供给其他类使用，但却不需要成为其他类的父类，它以非继承方式来复用类中的代码。使用mixins,则要用关键字with来复用类中的代码。

```dart
abstract class CanFixComputer {
  void fixComputer();
}
class CanProgramming {
  void programming();
}
class SoftwareEngineer extends Engineer with CanFixComputer, CanProgramming {
  @override
  void fixComputer() {}
  @override 
  void programming() {}
}
```

如果同时使用extends、implements和mixins，并且@override方法都一样，那么执行的优先级就是：mixins, extends, implements.




### 泛型

Dart中泛型和Java相似，比如`List<E>`。用尖括号括起来的就是泛型写法。我的理解：泛型就是类型的方法，接口E类型参数类型。

```dart
void main() {
  List animals = new List<String>();
  animals.addAll(['1', '2', '3']);
}
```

在上面代码中List集合存放数字字符串，并且指定`List<String>`的泛型，这样就是表示List中只能放字符串。如果添加其他类型就会报错。

泛型的好处就是可以使代码的逻辑控制更严谨，有效地对程序做类型检查，还能有效减少重复代码，并且在多种类型之间定义统一接口实现，如下面代码：

```dart
// 不用泛型，存储Object
abstract class ObjectData {
  Object getByKey(String key);
  void setByKey(String key, Object value);
}

// 不用泛型，存储String
abstract class StringData {
  String getByKey(String key);
  void setByKey(String key, String value)
}

// 使用泛型
abstract class Data<T> {
  T getByKey(String key)
  void setByKey(String key, T value)
}

// extends 限制参数类型
class Animal {}
class Cat extends Animal {}
class Bird extends Animal {}

class NewAnimal<T extends Animal> {
  String toString() => "创建一个新动物：`Foo<$T>`"
}
void main () {
  var cat = NewAnimal<Cat>();
  var bird = NewAnimal<Bird>();
  var cat = NewAnimal();
}
```








