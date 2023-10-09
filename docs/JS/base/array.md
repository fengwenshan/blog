# 数组

## 描述

在JS中，数组是引用数据类型，核心特征Array对象：

- JS数组时可调整大小的，并且可以包含不同数据类型
- JS数组不是关联数组，因此不能使用字符串作为索引访问数组元素，但必须使用非负整数作为索引访问
- JS数组的索引从0开始。最后一个元素是数组length属性减去1的值
- JS数组赋值操作创建浅拷贝

ES数组时一组有序的数据，但跟其他语言不同的是，数组中每个槽位可以存储任意类型数据。并且长度也是动态大小，会随着数据添加而自动增长。

## 创建数组

- 创建一个新的Array对象： `const arr = new Array()`;
- 也可以给构造函数传入数值，指定数组长度：`const arr = new Array(20)`
- 也可以给构造函数传入元素，那么会创建一个包含3个元素的数组：`const arr = new Array('red', 'blur','blur')`

总结：春关键数组时可以给构造函数传入一个数值。则会创建一个长度为指定数值的数组；如果这个值是其他类型，则会创建一个包含特定值的数组。

在使用Array构造函数时，也可以省略new操作符。结果和上面一样。还有一种创建数组的方式就是数组字面量表示法：

```javascript
let color = ['red', 'blur','blur']
let name = []
```

在使用数组字面量表示法创建数组不会调用Array构造函数。

数组可以使用length修改数组的长度，实现裁切与增长。

数组最多可以包含 4 294 967 295个元素，这对于大多数编程任务是足够了。如果尝试添加更多项，则会抛出错误。这个最大值作为初始值创建数组，可能导致脚本运行时间过长而导致错误。

## 静态方法

Array构造函数还有两个ES6新增的用于创建数组的静态方法:`from()`和`of()`。ES6之前提供的静态方法：`isArray()`

### Array.from

- Array.from(arrayLike[, cb[, thisArg]]) thisArg 用于设置cb里面的this指向, 箭头函数不适用
- Array.fromAsync(arrayLike[, cb[, thisArg]]) 转换异步可迭代对象到数组，返回一个promise

```javascript
// Array.from() 静态方法从可迭代对象（例如Map和Set）或类数组对象创建一个新的浅拷贝数组实例

// ['f', 'o', 'o']
const fooArr = Array.from('foo')

// [1, 2, 4]
const arr = Array.from([1,2,3], x => x * 2)

//  [0, 1, 2, 3, 4]
Array.from({ length: 5 }, (_, i) => i)

const set = new Set(["foo", "bar", "baz", "foo"]);
// [ "foo", "bar", "baz" ]
const setArr = Array.from(set);

const map = new Map([ [1, 2], [2, 4], [4, 8] ]);
// [[1, 2], [2, 4], [4, 8]]
const mapArr = Array.from(map);

function fn() {
  return Array.from(arguments)
}
/**
 * 序列生成器（range）c
 * @param start 开始至
 * @param stop 结束值
 * @param step 步长
 */
function range(start, end, step) {
  return Array.from({ length: (end - start) / step + 1}, (_, v) => start + v * step)
}
range(0, 4, 1) // [ 0, 1, 2, 3, 4 ]
// 生成数字范围 1 - 10， 步长为2
range(1, 10, 2) // [ 1, 3, 5, 7, 9 ]
// 使用Array.from 生成字母表，并将其排序
// A - Z  65 - 90
console.log(range("A".charCodeAt(0), "Z".charCodeAt(0), 1).map(i => String.fromCharCode(i)))
// a - z  97 - 122
console.log(range("a".charCodeAt(0), "z".charCodeAt(0), 1).map(i => String.fromCharCode(i)))
```

### Array.of

> Array.of()可以把一组参数转换为数组，这个方法用于替换在ES6之前常用的`Array.prototype.slice.call(arguments)`

```javascript
console.log(Array.of('foo', 2, 'bar', true));
// Expected output: Array ["foo", 2, "bar", true]

console.log(Array.of());
// Expected output: Array []
```

### Array.isArray

> `Array.isArray(value)` 检查value是否为数组，是则返回true。如果value是TypeArray实例，则总是返回false

`Array.isArray`检查传递的值是否为Array.它不检查值得原型链，也不依赖于它所附加的Array构造函数。对于数组字面量语法或Array构造函数创建的任何值，他都会返回true.这使得它可以安全地使用跨领域（cross-realm）对象，其中 Array 构造函数的标识是不同的，因此会导致 instanceof Array 失败。

如果原型链带有Array.prototype,但是不是数组对象，也会返回false。但是`instanceof Array`会返回true


> `value instanceof Array`


当检测 Array 实例时，Array.isArray 优于 instanceof，因为 Array.isArray 能跨领域工作。

《高级程序设计第四版》说明：使用instanceof的问题是假设只有一个全局上下文。如果网页里有多个框架，则可能涉及两个不同的全局执行上下文，因此就会有两个不同版本Array构造函数。如果要把数组从一个框架传给另一个框架，则这个数组的构造函数将有别于在第二个框架内本地创建的数组。

## 迭代方法

> ES6中，Array原型暴露了3个用于检测数组内容：`keys()`、`values()`、`entries()`

- Array.prototype.keys() 返回一个可迭代器对象。其中包含数组中每个索引的键
- Array.prototype.values() 返回一个可迭代器对象。该对象迭代数组中每个元素的值
- Array.prototype.entries() 返回一个可迭代器对象。该对象包含数组中每个索引的键/值对

```javascript
const array1 = ['a', 'b', 'c'];
// Object [Array Iterator] {}, 使用for...of迭代
const keyIter = array1.keys();
// Object [Array Iterator] {}, 使用for...of迭代
const valIter = array1.values()
// Object [Array Iterator] {}, 使用for...of迭代
const valIter = array1.entries()

for(const key of keyIter) {
  // 0  1  2
  console.log(key)
}
for(const value of keyIter) {
  // a b c
  console.log(value)
}

for(const [key, value] of keyIter) {
  // 0 a
  // 1 b
  // 2 c
  console.log(key, value)
}
```

## 复制和填充方法

> es6中新增两个方法：批量赋值方法fill和填充数组方法copyWithin()。


- Array.prototype.fill(value[, start[, end]]) 用一个固定值填充满数组每项。返回修改后的数组（**副作用方法，会修改this的内容，不会修改长度**）。
  - start 
    - 负数从数组末端开始计算，如果start < 0,则使用start + array.length
    - 如果start < -array.length 或 start被省略，则使用0
    - 如果start >= array.length, 没有索引被填充
  - end
    - 负数索引从数组的末端进行计算，如果end < 0， 则使用end + array.length
    - 如果end < -array.length或end被省略，则使用0
    - 如果end >= array.length或end被省略，则使用array.length，导致所有索引都被填充
    - 如果经标准化后，end的位置在start之前或之上，没有索引被填充
- Array.prototype.copyWithin(target[, start[, end]])  拷贝数组的部分到当前数组中的另一部分，并返回它（**副作用方法，会修改this的内容，不会修改长度**）。
  - target 
    - 负索引将从数组末尾开始计数。如果target < 0，实际是target + array.length
    - 如果target < -array.length，则使用0
    - 如果target >= array.length, 则不会拷贝任何内容
    - 如果target位于start之后，则复制只会持续到array.length结束。
  - start
    - 负索引将从数组末尾开始计数，start + array.length
    - 如果省略start 或 start < -array.length, 则默认为0
    - 如果start >= array.length, 则不会拷贝任何内容
  - end
    - 负索引将从数组末尾计数。如果end < 0, 则实际是end + array.length
    - 如果end < -array.length, 则使用0
    - 如果省略end 或 end >= array.length,则默认array.length，这将导致直到数组末尾所有元素都会被赋值
    - 如果end位于start之前，则不会拷贝任何内容

```javascript
/* fill ---------- */
const arr = [1,2,3,4]
// [ 0, 0, 0, 0 ]
console.log(arr.fill(0, 0, arr.length))
// [ 0, 0, 0, 0 ]
console.log(arr.fill(0))
// [ 1, 0, 0, 0 ]
console.log(arr.fill(0, 1, arr.length))

/* copyWithin ---------- */
let array1 = ['a', 'b', 'c', 'd', 'e'];

// [3, 4) -> d (从0开始), 导致索引0个位置元素被替换
console.log(array1.copyWithin(0, 3, 4)); // ['d', 'b', 'c', 'd', 'e']

array1 = ['a', 'b', 'c', 'd', 'e'];
// [3, 5) -> d,e (从0开始), 导致索引0,1个位置元素被替换
console.log(array1.copyWithin(0, 3, 5)); // ['d', 'b', 'c', 'd', 'e']

array1 = ['a', 'b', 'c', 'd', 'e'];
// [2, array1.length]  -> 'd', 'e'(从0开始),导致索引1，2位置被替换
console.log(array1.copyWithin(1, 3)) // ['a', 'd', 'e', 'd', 'e']
```

## 转换方法

所有对象都有toLocaleString()、toString()、和valueOf()方法。

- Array.prototype.toLocaleString() 返回一个字符串，表示数组中的所有元素。每个元素通过调用它们自己的 toLocaleString 方法转换为字符串，并且使用特定于语言环境的字符串（例如逗号“,”）分隔开。
- Array.prototype.toString() 数组内部会调用join方法，如果该方法不可用则会调用`Object.prototype.toString`来替代，并返回`[object Array]`
- Object.prototype.valueOf() Array的原型没有valueOf方法，使用的是Object.prototype.valueOf(),该方法返回this值。

JS调用valueOf方法来将对象转换基本类型值。很少需要用户调用该方法，当遇到需要基本类型值对象时，JS会自动调用该方法。

强制数字类型转换和强制基本类型转换优先调用该方法，而强制字符串转换会优先调用toString()方法，并且toString()很可能返回字符串值（甚至对Object.prototype.toString基本也是如此），因此这种情况下不会调用valueOf()

从Object.prototype继承所有对象（除null原型对象之外的所有对象）都继承toString()方法。Object.prototype.valueOf()基本实现被有意设计为无用的：返回一个对象；其返回值将永远被任何基本类型转换算法使用。许多内置对象重写此方法，以便将自定义对象转换为基本值。


## 堆栈方法

> ES给数组提供类似栈方法push和pop与堆方法shift和push

栈特点先进后出，push推入，pop弹出
队列特点先进先出，push推入，shift拿取

- Array.prototype.push(arg1, arg2, ..., argN) 接收任意数量参数,并将它们推入末尾，返回数组最新长度
- Array.prototype.pop() 用于删除数组最后一项，同时减少数组length值，返回被删除的项（我都怀疑内部是不是直接执行arr.length -= 1）
- Array.prototype.shift() 删除数组第一项，并返回该项，数组长度减一

数组还提供unshift方法。就是跟shift相反操作，在数组开始添加任意多个值，然后返回数组长度。通过pop()与unshift()可以模拟相反方向的模拟队列，数组开头添加数据，末尾取得数据。


## 排序

> ES给数组提供两个排序方法：reverse()、sort()、toSorted()

- Array.prototype.reverse() 反转数组中的元素，并返回同一数组的引用。（**有副作用**）要在不改变原始数组的情况下反转数组中的元素，请使用toReversed(),有兼容性问题。
- Array.prototype.toReversed() 它返回一个元素顺序相反的新数组（**兼容性**）
- `Array.prototype.sort([(a,b) => number])` 对数组的元素进行排序，并返回对相同数组的引用。默认排序是将元素转换为字符串，然后按照它们的 UTF-16 码元值升序排序（**有副作用**）。如果想要不改变原数组的排序方法，可以使用 toSorted()。
  - `> 0` 倒序
  - `< 0` 默认排序（升序），有时候和sort()相等
  - `===` 保持原来顺序
- Array.prototype.toSorted([(a,b) => number]) 它返回一个新数组，其元素按升序排列（**兼容性**）


```javascript
const months = ['March', 'Jan', 'Feb', 'Dec'];
months.sort();
console.log(months);
// Expected output: Array ["Dec", "Feb", "Jan", "March"]
```

## 操作方法

- Array.prototype.concat(arr) 用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组
- Array.prototype.with(index, value) 修改指定索引值。返回新数组（存在兼容性问题）。
- Array.prototype.slice([start[, end]]) 返回被提取的新数组
  - start
    - 如果索引是负数，则从数组末尾开始计算 - 如果start < 0，则使用start + array.length
    - 如果start < -array.length 或者 省略start,则使用0
    - 如果start >= array.length 则不提取任何元素
  - end
    - 如果索引是负数，则从数组末尾开始计算 - 如果end < 0, 则使用end + array.length
    - 如果end < -array.length, 则使用0
    - 如果end >= array.length 或者 省略end, 则使用array.length，提取所有元素直到末尾
    - 如果end在规范化后小于或等于start, 则不提取任何元素
- Array.prototype.splice(start, deleteCount, item1, item2, itemN) 通过移除或者替换已存在的元素和/或添加新元素就地改变一个数组的内容(**副作用**)。该方法可以进行删除，插入，替换操作。
  - start
    - 负索引从数组末尾开始计算——如果 start < 0，使用 start + array.length。
    - 如果 start < -array.length，使用 0。
    - 如果 start >= array.length，则不会删除任何元素，但是该方法会表现为添加元素的函数，添加所提供的那些元素。
    - 如果 start 被省略了（即调用 splice() 时不传递参数），则不会删除任何元素。这与传递 undefined 不同，后者会被转换为 0。
  - deleteCount 一个整数，表示数组中要从 start 开始删除的元素数量。小于等于0，不进行删除处理
- Array.prototype.toSpliced(start, deleteCount, item1, item2, itemN) 它返回一个新数组，并在给定的索引处删除和/或替换了一些元素
- Array.prototype.flat(depth)  数组扁平化，返回新的数组
  - depth: 指定要提取嵌套数组的结构深度，默认值为 1
- Array.prototype.flatMap((item, index, arr) => any, thisArg) 给数组中的每个元素给定回调，然后将结果展开一级，返回一个新的数组。等价于调用map方法后再调用flat(1),比调用两个方法更高效。

```javascript
/* flat -------- */
const arr = [1,[2,[3, [4, [5] ] ] ] ]
console.log(arr.flat()) // [1, 2, [3, [4, [5]]]]
console.log(arr.flat(2)) // [1, 2, 3, [4, [5]]]
console.log(arr.flat(3)) // [1, 2, 3, 4, [5]]
console.log(arr.flat(4)) // [1, 2, 3, 4, 5]
console.log(arr.flat(Infinity)) // [1, 2, 3, 4, 5]

/* flatMap ------ */
const arr = [1, 2, 3, 4]
// [1, 2, 2, 4, 3, 6, 4, 8]
arr.flatMap((x) => [x, x * 2] /* 将这个数组扁平化 */);
arr1.map((x) => [x * 2]);
// [[2], [4], [6], [8]]
arr1.flatMap((x) => [x * 2]);
// [2, 4, 6, 8]
// 只有一层被展平
arr1.flatMap((x) => [[x * 2]]);
// [[2], [4], [6], [8]]
```


## 搜索和位置

- Array.prototype.indexOf(searchElement[, fromIndex]) 数组中第一次出现给定元素（严格相等）的下标，如果不存在则返回 -1
  - fromIndex
    - 负索引从数组末尾开始计数——如果 fromIndex < 0，使用 fromIndex + array.length。注意，在这种情况下，仍然从前到后搜索数组。
    - 如果 fromIndex < -array.length 或者省略了 fromIndex ，将使用 0，而导致整个数组被搜索。
    - 如果 fromIndex >= array.length，数组不会继续搜索并返回 -1。
- Array.prototype.lastIndexOf(searchElement[, fromIndex]) 返回数组中给定元素（严格相等）最后一次出现的索引，如果不存在则返回 -1
  - fromIndex
    - 如果 fromIndex < 0，则从数组末尾开始倒数计数——即使用 fromIndex + array.length 的值。
    - 如果 fromIndex < -array.length，则不搜索数组并返回 -1。从概念上讲，你可以把它想象成从数组开始之前不存在的位置开始反向搜索，这条路径上没有任何数组元素，因此 searchElement 永远不会被找到。
    - 如果 fromIndex >= array.length 或者省略了 fromIndex，则使用 array.length - 1，这会导致搜索整个数组。可以将其理解为从数组尾部之后不存在的位置开始向前搜索。最终会访问到数组最后一个元素，并继续向前开始实际搜索数组元素。
- Array.prototype.findLastIndex((item, index, arr) => boolean, thisArg) 反向迭代数组，并返回满足所提供的测试函数的第一个元素的索引。若没有找到对应元素，则返回 -1
- Array.prototype.includes(searchElement[, fromIndex]) es7新增。 判断一个数组是否包含一个指定的值（严格相等）， 返回boolean值
  - 负索引从数组末尾开始计数——如果 fromIndex < 0，那么实际使用的是 fromIndex + array.length。然而在这种情况下，数组仍然从前往后进行搜索。
  - 如果 fromIndex < -array.length 或者省略 fromIndex，则使用 0，这将导致整个数组被搜索。
  - 如果 fromIndex >= array.length，则不会搜索数组并返回 false。
- Array.prototype.find(callbackFn[, thisArg]) 返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined
  - 如果需要在数组中找到对应元素的索引，使用findIndex()
  - 如果需要某个值得索引，请使用Array.prototype.indexOf()（它类似于findIndex(), 但只是检查每个元素是否与值相等，而不是使用测试函数）
  - 如果需要查找数组中是否存在某个值，请使用Array.prototype.includes()。同样它检查每个元素是否与值相等，而不是使用测试函数
  - 如果需要查找是否有元素满足所有提供的测试函数，使用Array.prototype.some()
- Array.prototype.findLast((item, index, arr) => boolean, thisArg) 反向迭代数组，并返回满足提供的测试函数的第一个元素的值。如果没有找到对应元素，则返回 undefined。
- Array.prototype.findIndex(callbackFn[, thisArg])  返回数组中满足提供的测试函数的第一个元素的索引。若没有找到对应元素则返回 -1
- Array.prototype.ar(index)  接收一个整数值并返回该索引对应的元素，允许正数和负数。负整数从数组中的最后一个元素开始倒数。

## 迭代方法

- Array.prototype.every((item, index, arr) => boolean, thisArg) 测试一个数组内的所有元素是否都能通过指定函数的测试。它返回一个布尔值
- Array.prototype.filter((item, index, arr) => boolean, thisArg) 创建给定数组一部分的浅拷贝，其包含通过所提供函数实现的测试的所有元素。如果没有元素通过测试，则返回一个空数组。
- Array.prototype.forEach((item, index, arr) => void, thisArg) 对数组的每个元素执行一次给定的函数。中断除非抛出异常，否则没有办法停止或中断 forEach() 循环。如果有这样的需求，则不应该使用 forEach() 方法。
- Array.prototype.map((item, index, arr) => void, thisArg) 创建一个新数组，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成
- Array.prototype.some((item, index, arr) => void, thisArg) 测试数组中是否至少有一个元素通过了由提供的函数实现的测试。如果在数组中找到一个元素使得提供的函数返回 true，则返回 true；否则返回 false。它不会修改数组。

## 归并方法

- Array.prototype.reduce((accumulator, item, index, arr) => any, initState) 对数组中的每个元素按序执行一个提供的 reducer 函数，每一次运行 reducer 会将先前元素的计算结果作为参数传入，最后将其结果汇总为单个返回值
- Array.prototype.reduceRight((accumulator, item, index, arr) => any, initState) 对累加器（accumulator）和数组的每个值（按从右到左的顺序）应用一个函数，并使其成为单个值。

