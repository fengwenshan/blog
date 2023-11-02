# 工具类

类型工具可以分为三类：操作符、关键字和专用语法。

使用的目的来划分，类型工具可以分为 类型创建 与 类型安全保护 两类。


## 类型别名

类型别名最简单的使用：`type A = string`, 使用type关键字声明一个类型别名A, 同时它的类型等价于string类型。类型别名的作用主要是对一组类型 或 一个特定类型结构进行封装，以便在其他地方进行复用。

```typescript
// 抽离一组联合类型：
type StatusCode = 200 | 301 | 400 | 500 | 502;
type PossibleDataTypes = string | number | (() => unknown);

const status: StatusCode = 502

// 抽离一个函数类型
type Handler = (e: Event) => void;

const clickHandler: Handler = (e) => { };
const moveHandler: Handler = (e) => { };
const dragHandler: Handler = (e) => { };

// type声明一个对象
type ObjType = {
  name: string;
  age: number;
}


interface Person {}
interface Student extends Person {}

// type 实现extends
type Student = {} & Person
```

如果真的把type当做类型别名，那就简单，然而，类型别名还能作为工具类型。工具类同样基于类型别名，只是多了个泛型。

在类型别名中，类型别名`type Factory<T> = T | number | string;`可以像这样的声明，一旦接收了泛型，就是工具类型。 泛型我的理解就是js方法，这是一个Factory方法，接收T参数，返回`T | number | string`类型。

现在类型别名摇身一变成了工具类型，但它的基本功能仍然是创建类型，只不过工具类型能够接受泛型参数，实现更灵活的类型创建功能。从这个角度看，工具类型就像一个函数一样，泛型是入参，内部逻辑基于入参进行某些操作，再返回一个新的类型。

```typescript
type Factory<T> = T | number | string;
const foo: Factory<boolean> = true;

// 通常不会使用工具类型做类型标注，而是再声明新的类型别名
type FactoryWithBool = Factory<boolean>
const foo1: FactoryWithBool = true
```

声明一个简单、有实际意义的工具类型：

```typescript
import {MaybeArray} from "rollup";

type MaybeNull<T> = T | null
type MaybeArray<T> = T | T[]
type MaybePromise<T> = Promise<T> | T

function process(input: MaybeNull<{ handler: (() => {}) }>) {
  input?.handler()
}

function ensureArray<T>(input: MaybeArray<T>): T[] {
    return Array.isArray(input) ? input : [input]
}

async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  const data: MaybePromise<string> = await response.text();
  // 这里可以是 Promise<string> 或 string，取决于实际运行时的结果
  return data; 
}
```

## 联合类型和交叉类型

- 联合类型使用符号 `|`, 两边只要符合一个就行, 相对应的就是js中的`||`
- 交叉类型使用符号 `&`，需要同时满足两边, 相对应的就是js中的`&&`

```typescript
interface NameStruct {
  name: string;
}

interface AgeStruct {
  age: number;
}

type ProfileStruct = NameStruct & AgeStruct;

const profile: ProfileStruct = {
  name: "linbudu",
  age: 18
}
```

如果两个原始类型交叉在一起就是never。对象类型交叉在一个就是实现对象继承，对象类型交叉在一起，假如两边都有键值对`{ name: string}`, 那么name推倒出来就是never。

```typescript
type Struct1 = {
  primitiveProp: string;
  objectProp: {
    name: string;
  }
}

type Struct2 = {
  primitiveProp: number;
  objectProp: {
    age: number;
  }
}

type Composed = Struct1 & Struct2;

type PrimitivePropType = Composed['primitiveProp']; // never
type ObjectPropType = Composed['objectProp']; // { name: string; age: number; }
```

如果是两个联合类型组成的交叉类型呢？其实还是类似的思路，既然只需要实现一个联合类型成员就能认为是实现了这个联合类型，那么各实现两边联合类型中的一个就行了，也就是两边联合类型的交集：

```typescript
type UnionIntersection1 = (1 | 2 | 3) & (1 | 2); // 1 | 2
type UnionIntersection2 = (string | number | symbol) & string; // string
```

## 索引类型

索引类型指的不是某一个特定的类型工具，它其实包含三个部分：索引签名类型、索引类型查询与索引类型访问。目前很多社区的学习教程并没有这一点进行说明，实际上这三者都是独立的类型工具。唯一共同点是，它们都通过索引的形式来进行类型操作，但索引签名类型是声明，后两者则是读取

### 索引签名类型

索引签名类型主要指的是在接口或类型别名中，通过以下语法来快速声明一个键值类型一致的类型结构

```typescript
interface AllStringTypes {
  propA: number
  propB: boolean
  [key: string]: string
}
```

但由于 JavaScript 中，对于 obj[prop] 形式的访问会将数字索引访问转换为字符串索引访问，也就是说， obj[599] 和 obj['599'] 的效果是一致的。因此，在字符串索引签名类型中我们仍然可以声明数字类型的键。类似的，symbol 类型也是如此：


### 索引类型查询

索引类型查询在js中，可以理解一个`obj[prop]` 这就实现obj对象查询prop是否存在, 而ts中的索引类型查询就是将对象中的键类型集合在一起组成联合类型。

```typescript
interface Foo {
  a: 1,
  11: 2
}
type Fookeys = keyof  Foo; // "a" | 11

// 如果想要看到推断的值 "a" | 11
type FooKeys = keyof Foo & {}
```

### 索引类型访问

在js中可以通过`obj[expression]`方式来动态访问一个对象属性，而ts中可以通过类似范式，只不过这里expression要换成类型

```typescript
interface NumberRecord {
    [key: string]: number
}
type PropType = NumberRecord[string] // number

interface Foo {
  propA: number;
  propB: boolean;
}

type PropAType = Foo['propA']; // number
type PropBType = Foo['propB']; // boolean
```

结合keyof, 可以访问到所有属性值得联合类型

```typescript
interface Foo {
  propA: number;
  propB: boolean;
  propC: string;
}

// propA | propB | propC
type FooKeys = keyof Foo & {}
// string | number | boolean
type PropTypeUnion = Foo[keyof Foo]; 
```

```typescript
interface Foo {
  propA: number;
}

// 类型“Foo”没有匹配的类型“string”的索引签名。
// ERROR: 类型“Foo”没有匹配的类型“string”的索引签名。
type PropAType = Foo[string]; 
```

## 映射类型

映射类型的主要作用是基于键名映射到键值类型。

```typescript
type Stringify<T> = {
  [K in keyof T]: string;
};
```
这个工具类型会接受一个对象类型，使用`keyof T`拿到键，然后通过in将这个联合类型的每个键成员映射出来，并将其键值类型设置为string


```typescript
interface Foo {
  prop1: string;
  prop2: number;
  prop3: boolean;
  prop4: () => void;
}
type Stringify<T> = {
  [K in keyof T]: string;
};
type StringifiedFoo = Stringify<Foo>;

// 等价于
interface StringifiedFoo {
  prop1: string;
  prop2: string;
  prop3: string;
  prop4: string;
}
```

```typescript
type Stringify<T> = {
  [K in keyof T]: T[K];
};
```

这里的`T[K]`就是上面说的索引类型访问，使用键的字面量类型访问到键值的类型。`K in`属于映射类型的语法，`keyof T`属于keyof操作符,`[k in keyof T]`的`[]`属于索引签名类型，`T[K]`属于索引类型访问。


## 类型查询

ts存在两种功能不同的typeof操作符，最常见的就是js中的typeof操作符，ts还新增了用于类型查询的typeof， 即Type Query Operator, 这个typeof返回的是一个TypeScript类型：

```typescript
const str = "qiuqiu";

const obj = { name: "qiuqiu" };

const nullVar = null;
const undefinedVar = undefined;

const func = (input: string) => {
  return input.length > 10;
}

type Str = typeof str; // "qiuqiu"
type Obj = typeof obj; // { name: string; }
type Null = typeof nullVar; // null
type Undefined = typeof undefined; // undefined
type Func = typeof func; // (input: string) => boolean
```

typeof在类型标注中使用typeof， 还能在工具类型中使用typeof。

```typescript
const func = (input: string) => {
  return input.length > 10;
}

// boolean
type FuncReturnType = ReturnType<typeof func>;
```

区分两个typeof, 在使用逻辑代码时候， typeof的一定是js的操作符，而类型代码中的一定是类型查询的typeof。同时为了更好地避免这种情况，也就是隔离类型曾和逻辑层，类型查询操作符后是不允许使用表达式的。

```TypeScript
const isInputValid = (input: string) => {
  return input.length > 10;
}

// 不允许表达式
let isValid: typeof isInputValid("linbudu");
```

## 类型守卫

TypeScript中提供了非常强大的类型推断能力，它会随着你的代码逻辑不断尝试收窄类型，这一能力称之为**类型的控制流分析**。

```typescript
function foo(input: string | number) {
    if(typeof input === 'string') {}
    if(typeof input === 'number') {}
}
```

在类型控制控制流分析下，每流过一个if分支，后续联合类型的分支就少了，因为这个类型已经在这个分支处理过了，不会进入下一个分支：

```typescript
declare const strOrNumOrBool: string | number | boolean;

if (typeof strOrNumOrBool === "string") {
  // 一定是字符串！
  strOrNumOrBool.charAt(1); 
} else if (typeof strOrNumOrBool === "number") {
  // 一定是数字！
  strOrNumOrBool.toFixed(); 
} else if (typeof strOrNumOrBool === "boolean") {
  // 一定是布尔值！
  strOrNumOrBool === true;
} else {
  // 要是走到这里就说明有问题！
  const _exhaustiveCheck: never = strOrNumOrBool;
  throw new Error(`Unknown input type: ${_exhaustiveCheck}`);
}
```

通过 if 条件中的表达式进行了类型保护，即告知了流过这里的分析程序每个 if 语句代码块中变量会是何类型。这是编程语言的类型能力中最重要的一部分：与实际逻辑紧密关联的类型。我们从逻辑中进行类型地推导，再反过来让类型为逻辑保驾护航。

```typescript
function isString(input: unknown) {
  return typeof input === 'string'
}

function foo(input: string | number) {
  if ( isString(input) ) {
    //string | number
  }
}
```

正常的情况来说，进入if循环内，input就是string类型，刚流进`if(isString(input))`因为isString这个函数在另外一个地方，内部的逻辑并不在函数foo中，这里的理性控制流分析做不到跨函数上下文来进行类型的信息收集。

实际上，将判断逻辑封装起来提取到函数外部进行复用非常常见。为了解决这一类型控制流分析的能力不足，TypeScript引入is关键字来显示地提示类型信息：

```typescript
function isString(input: unknown): input is string {
  return typeof input === "string";
}

function foo(input: string | number) {
  if (isString(input)) {
    input.replace("bababa", "66666666")
  }
  if (typeof input === 'number') { }
}
```

isString函数称为类型守卫，在它的返回值中，我们不在使用boolean作为类型标注，而是使用`input is string`这么个奇怪的搭配，拆开来看它是这样的：

- input 函数的某个参数
- is string，即 is 关键字 + 预期类型，即如果这个函数成功返回为 true，那么 is 关键字前这个入参的类型，就会被这个类型守卫调用方后续的类型控制流分析收集到。

需要注意的是，类型守卫函数中并不会对判断逻辑和实际类型的关联进行检查：

```typescript
function isString(input: unknown): input is number {
  return typeof input === "string";
}

function foo(input: string | number) {
  if (isString(input)) {
    // 报错，在这里变成了 number 类型
    (input).replace("linbudu", "linbudu599")
  }
  if (typeof input === 'number') { }
  // ...
}
```

从这个角度来看，其实类型守卫有些类似于类型断言，但类型守卫更宽容，也更信任你一些。你指定什么类型，它就是什么类型。 除了使用简单的原始类型以外，我们还可以在类型守卫中使用对象类型、联合类型等，比如下面我开发时常用的两个守卫：

```typescript
export type Falsy = false | "" | 0 | null | undefined;

export const isFalsy = (val: unknown): val is Falsy => !val;

// 不包括不常用的 symbol 和 bigint
export type Primitive = string | number | boolean | undefined;

export const isPrimitive = (val: unknown): val is Primitive => ['string', 'number', 'boolean' , 'undefined'].includes(typeof val);
```

## 基于in 与 instanceof 的类型保护

in操作符并不是TS中新增的概念，而是JS中已有的部分，可以通过`key in object`的方式来判断key是否存在object或原型链上（返回true说明存在）

```typescript
interface Foo {
  foo: string;
  kind: 'foo';
  diffType: string;
  fooOnly: boolean;
  shared: number;
}

interface Bar {
  bar: string;
  kind: 'bar';
  diffType: number;
  barOnly: boolean;
  shared: number;
}

function handle1(input: Foo | Bar) {
  // 不同属性键进行区分
  if('foo' in input) {
    // (parameter) input: Foo
  } else {
    // (parameter) input: Bar
  }


  // 共同属性的字面量类型差异
  if (input.kind === 'foo') {
    // (parameter) input: Foo
  } else {
    // (parameter) input: Bar
  }

}
```

还有一个功能类似typeof与in的操作符：instanceof, 它判断的是否原型级别的关系。

```typescript
class FooBase {}

class BarBase {}

class Foo extends FooBase {
  fooOnly() {}
}
class Bar extends BarBase {
  barOnly() {}
}

function handle(input: Foo | Bar) {
  if (input instanceof FooBase) {
    input.fooOnly();
  } else {
    input.barOnly();
  }
}
```

`input instanceof FooBase` 会沿着 `input` 的原型链查找 `FooBase.prototype` 是否存在其上。


## 结构化类型系统

```typescript
// 案例1
class Cat {
  eat() { }
}

class Dog {
  eat() { }
}

function feedCat(cat: Cat) { }

feedCat(new Dog())
```

上面类型中，需要一只猫，但是传入了狗也行，这是因为ts类型系统特性:结构化类型系统。

```typescript
// 案例2
class Cat {
  meow() { }
  eat() { }
}

class Dog {
  eat() { }
}

function feedCat(cat: Cat) { }

// 报错！
feedCat(new Dog())
```

上面报错因为ts在比较两个类型并非通过类型名称，而是比较两个类型实际拥有的属性和方法。也就是说在比较cat类型上的属性是否都存在dog类型上。在案例一中cat与dog类型上的方法一样的，它们虽然是两个名字不同类型，但仍然被视为结构一致，这就是结构化类型系统的特性。这也就是所谓的鸭子类型，这个源于鸭子测试。其核心理念就是，如果你看到一只鸟走起来像鸭子，游泳像鸭子，叫得也像鸭子，那么这只鸟就是鸭子。

```typescript
class Cat {
  eat() { }
}

class Dog {
  bark() { }
  eat() { }
}

function feedCat(cat: Cat) { }

feedCat(new Dog())
```

这个案例就没有报错，因为结构化类型系统认为Dog类型完全实现了Cat类型，至于额外的bark方法，可以认为Dog类型继承Cat类型后添加的新方法，即Dog类可以被认为Cat类的子类。同样的，面向对象编程中的里氏替换原则也提到了鸭子测试：如果它看起来像鸭子，叫起来也像鸭子，但是却需要电池才能工作，那么你的抽象很可能出错了。

更进一步，在比较对象类型的属性时，同样会采用结构化类型系统进行判断。而对结构中的函数类型（即方法）进行比较时，同样存在类型的兼容性比较：

```typescript
class Cat {
  eat(): boolean {
    return true
  }
}

class Dog {
  eat(): number {
    return 599;
  }
}

function feedCat(cat: Cat) { }

// 报错！
feedCat(new Dog())
```

严格来说，鸭子类型系统和结构化类型系统并不完全一致，结构化类型系统意味着基于完全的类型结构来判断类型兼容性，而鸭子类型则只基于运行时访问的部分来决定。也就是说，如果我们调用了走、游泳、叫这三个方法，那么传入的类型只需要存在这几个方法即可（而不需要类型结构完全一致）。但由于 TypeScript 本身并不是在运行时进行类型检查（也做不到），同时官方文档中同样认为这两个概念是一致的（One of TypeScript’s core principles is that type checking focuses on the shape that values have. This is sometimes called “duck typing” or “structural typing”.）。因此在这里，我们可以直接认为鸭子类型与结构化类型是同一概念。



## 标称类型系统

除了基于类型结构进行兼容性判断的结构化类型系统以外，还有一种基于类型名进行兼容性判断的类型系统，标称类型系统。

标称类型系统要求两个可兼容的类型，其名称必须是完全一致的。

```typescript
type USD = number;
type CNY = number;

const CNYCount: CNY = 200;
const USDCount: USD = 200;

function addCNY(source: CNY, input: CNY) {
  return source + input;
}

addCNY(CNYCount, USDCount)
```

在结构化类型系统中，USD 与 CNY （分别代表美元单位与人民币单位）被认为是两个完全一致的类型，因此在 addCNY 函数中可以传入 USD 类型的变量。这就很离谱了，人民币与美元这两个单位实际的意义并不一致，怎么能进行相加？

在标称类型系统中，CNY 与 USD 被认为是两个完全不同的类型，因此能够避免这一情况发生。在《编程与类型系统》一书中提到，类型的重要意义之一是限制了数据的可用操作与实际意义，这一点在标称类型系统中的体现要更加明显。比如，上面我们可以通过类型的结构，来让结构化类型系统认为两个类型具有父子类型关系，而对于标称类型系统，父子类型关系只能通过显式的继承来实现，称为标称子类型（Nominal Subtyping）。



```typescript
class Cat { }
// 实现一只短毛猫！
class ShorthairCat extends Cat { }
```

C++、Java、Rust 等语言中都主要使用标称类型系统。那么，我们是否可以在 TypeScript 中模拟出标称类型系统？



## ts模拟标称类型


再看一遍这句话：类型的重要意义之一是限制了数据的可用操作与实际意义。这往往是通过类型附带的额外信息来实现的（类似于元数据），要在 TypeScript 中实现，其实我们也只需要为类型额外附加元数据即可。


比如 CNY 与 USD，我们分别附加上它们的单位信息即可，但同时又需要保留原本的信息（即原本的 number 类型）。 我们可以通过交叉类型的方式来实现信息的附加：

```typescript
// 使用类型结构化处理同单位计算
declare class TagPrivate<U extends string> {
  // 携带额外信息
  private __tag__: U
}

type Nominal<T, U extends string> = T & TagPrivate<U>

type RMB = Nominal<number, 'RMB'>;
type CNY = Nominal<number, 'CNY'>

// number & { tag: 'RMB' }
const RMB1 = 100 as RMB
// number & { tag: 'CNY' }
const RMB2 = 100 as RMB

function sumRMB(num1: RMB, num2: RMB) {
  return (num1 + num2) as RMB
}

sumRMB(RMB1, RMB2);
// 报错了！
sumRMB(RMB1, 200 as CNY)
```

这一实现方式本质上只在类型层面做了数据的处理，在运行时无法进行进一步的限制。我们还可以从逻辑层面入手进一步确保安全性：

```typescript
class CNY {
  private __tag!: void;
  constructor(public value: number) {}
}
class USD {
    private __tag!: void;
    constructor(public value: number) { }
}
const CNYCount = new CNY(100);
const USDCount = new USD(100);

function addCNY(source: CNY, input: CNY) {
  return (source.value + input.value);
}

addCNY(CNYCount, CNYCount);
// 报错了！
addCNY(CNYCount, USDCount);
```

通过这种方式，我们可以在运行时添加更多的检查逻辑，同时在类型层面也得到了保障。

这两种方式的本质都是通过额外属性实现了类型信息的附加，从而使得结构化类型系统将结构一致的两个类型也判断为不可兼容。


## 条件类型

条件类型的语法类似于我们平时常用的三元表达式，它的基本语法如下（伪代码）：


```typescript
ValueA === ValueB ? Result1 : Result2;
TypeA extends TypeB ? Result1 : Result2;
```

条件类型中使用 extends 判断类型的兼容性，而非判断类型的全等性。这是因为在类型层面中，对于能够进行赋值操作的两个变量，我们并不需要它们的类型完全相等，只需要具有兼容性，而两个完全相同的类型，其 extends 自然也是成立的。

条件类型绝大部分场景下会和泛型一起使用，我们知道，泛型参数的实际类型会在实际调用时才被填充（类型别名中显式传入，或者函数中隐式提取），而条件类型在这一基础上，可以基于填充后的泛型参数做进一步的类型操作


```typescript
type LiteralType<T> = T extends string ? "string" : "other";

type Res1 = LiteralType<"linbudu">; // "string"
type Res2 = LiteralType<599>; // "othe
```


## infer 关键字

```typescript
type Func = (...args: any[]) => any;

// 方案一
type FunctionConditionType<T extends Func> = 
    T extends (...args: any[]) => string ? 'A' : 'B';

// 方案2
type FunctionConditionType2<T extends Func> = 
    // infer T 不用管，当是个any就行
    // 返回 infer R 位置的值，即 R。否则，返回 never
    T extends (...args: any[]) => infer T ? T : never;

// 'A'
type Bol = FunctionConditionType<() => boolean>
// 'B'
type Str = FunctionConditionType<() => string>
// 'B'
type Num = FunctionConditionType<() => number>

// boolean
type Bol2 = FunctionConditionType2<() => boolean>
// string
type Str2 = FunctionConditionType2<() => string>
// number
type Num2 = FunctionConditionType2<() => number>
```

infer，意为推断，如 infer R 中 R 就表示 待推断的类型。 infer 只能在条件类型中使用，因为我们实际上仍然需要类型结构是一致的，比如上例中类型信息需要是一个函数类型结构，我们才能提取出它的返回值类型。如果连函数类型都不是，那我只会给你一个 never 。

这里的类型结构当然并不局限于函数类型结构，还可以是数组：

```typescript
type Swap<T extends any[]> = T extends [infer A, infer B] ? [B, A] : T;

type SwapResult1 = Swap<[1, 2]>; // 符合元组结构，首尾元素替换[2, 1]
type SwapResult2 = Swap<[1, 2, 3]>; // 不符合结构，没有发生替换，仍是 [1, 2, 3]
```

infer 甚至可以和 rest 操作符一样同时提取一组不定长的类型，而 ...any[] 的用法是否也让你直呼神奇？上面的输入输出仍然都是数组，而实际上我们完全可以进行结构层面的转换。比如从数组到联合类型

```typescript
// 提取首尾两个
type ExtractStartAndEnd<T extends any[]> = T extends [
  infer Start,
  ...any[],
  infer End
]
  ? [Start, End]
  : T;

// 调换首尾两个
type SwapStartAndEnd<T extends any[]> = T extends [
  infer Start,
  ...infer Left,
  infer End
]
  ? [End, ...Left, Start]
  : T;

// 调换开头两个
type SwapFirstTwo<T extends any[]> = T extends [
  infer Start1,
  infer Start2,
  ...infer Left
]
  ? [Start2, Start1, ...Left]
  : T;
```


```typescript
type ArrayItemType<T> = T extends Array<infer ElementType> ? ElementType : never;

type ArrayItemTypeResult1 = ArrayItemType<[]>; // never
type ArrayItemTypeResult2 = ArrayItemType<string[]>; // string
type ArrayItemTypeResult3 = ArrayItemType<[string, number]>; // string | number
```

原理即是这里的 `[string, number]` 实际上等价于` (string | number)[]`。除了数组，infer 结构也可以是接口：

```typescript
// 提取对象的属性类型
type PropType<T, K extends keyof T> = T extends { [Key in K]: infer R }
  ? R
  : never;

type PropTypeResult1 = PropType<{ name: string }, 'name'>; // string
type PropTypeResult2 = PropType<{ name: string; age: number }, 'name' | 'age'>; // string | number

// 反转键名与键值
type ReverseKeyValue<T extends Record<string, unknown>> = T extends Record<infer K, infer V> ? Record<V & string, K> : never

type ReverseKeyValueResult1 = ReverseKeyValue<{ "key": "value" }>; // { "value": "key" }
```

















































