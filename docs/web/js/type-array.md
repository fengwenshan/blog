# 定型数组

定型数组（TypedArray）是ES新增的结构，目的是提升原生库传输数据的效率。实际上JS并没有该类型，它所指的其实是一种特殊的包含数值类型的数组。

一个 TypedArray 对象描述了底层二进制数据缓冲区的类数组视图。没有称为 TypedArray 的全局属性，也没有直接可用的 TypedArray 构造函数。但是，有很多不同的全局属性，其值是指定元素类型的类型化数组构造函数。

在webGL的早期版本中，因为JS数组和原生数组之间不匹配，所以出现性能方面问题。图形驱动程序API通常不需要以JS默认双精度浮点格式传递给它们的数值，而这也是JS数组内存中的格式。因此，每次WebGL与JS运行时之间传递数组时，WebGL绑定都需要在目标环境分配新的数组，以其当前格式迭代数组，然后将数值转型为新数组中的适当格式，而这些要花费很多时间。

这个问题很难接受，Mozilla为解决这个问题而实现CanvasFloatArray。这是一个提供JS接口、C语言风格浮点值数组。JS运行时使用这个类型可以分配、读取和写入数组。这个数组可以直接传给底层图形驱动程序api,也可以直接从底层获取。最终CanvasFloatArray变成Float32Array,就是今天定型数组中可用的第一类型。


第一种允许读写ArrayBuffer的视图是DataView。这个视图专为文件IO和网络IO设计，其api支持对缓冲数据的高度控制，但相比其他类型的视图性能也差一些。DataView对缓冲内容没有任何预设，也不能迭代。

定型数组是另一种形式的ArrayBuffer视图。概念和DataView接近，但定型数组的区别在于，它特定于一种ElementType且遵循系统原生的字节序。相应地地形数组提供更广api和更高性能。设计定型数组的目的就是提高与webGL等原生库交换二进制数据的效率。



## DataView

允许读写ArrayBuffer的视图是DataView。这个视图专为文件IO和网络IO设计，其api支持对缓冲数据的高度控制，但相比其他类型的视图性能也差一些。DataView对缓冲内容没有任何预设，也不能迭代。

DataView 视图是一个可以从二进制 ArrayBuffer 对象中读写多种数值类型的底层接口，使用它时，不用考虑不同平台的字节序（endianness）问题。

必须对已有的ArrayBuffer读取或写入时才能创建DataView实例。这个实例可以使用全部或部分ArrayBuffer，且维护着对该缓冲实例的引用，以及视图在缓冲中开始的位置。

> `new DataView(buffer[, byteOffset[, byteLength]])`

- buffer 一个现有的ArrayBuffer或SharedArrayBuffer，用作支持新DataView对象的存储。
- byteOffset 新视图引用的第一个字节的偏移量(以字节为单位)。如果未指定，则缓冲区视图从第一个字节开始。
- byteLength 字节数组中元素的数目。如果未指定，视图的长度将匹配缓冲区的长度。


```javascript
// 分配16字节
const buf = new ArrayBuffer(16)

// DataView默认使用整个ArrayBuffer
const dv = new DataView(buf)
// buffer属性描述在构造是DataView引用的ArrayBuffer
console.log(dv.buffer === buf) // true
// byteLength属性描述了视图从它的ArrayBuffer开始的字节长度
console.log(dv.byteLength) // 16
// byteOffset 属性描述了从 ArrayBuffer 开始的字节偏移量。
console.log(dv.byteOffset) // 0

// 缓冲起点0开始，限制视图前8个字节
const dv1 = new DataView(buf, 0, 8)
console.log(dv1.byteLength) // 8
console.log(dv1.byteOffset) // 0

// 缓冲起点9字节开始，默认为剩余缓冲
const dv1 = new DataView(buf, 8)
console.log(dv1.byteLength) // 8
console.log(dv1.byteOffset) // 0
```

DataView对存储在缓冲内的数据类型没有预设。它暴露的api强制开发者在读写时指定一个ElementType，然后DataView就会读写而完成相应的转换。es6支持8中不同的ElementType


| ElementType | 字节 | 说明             | 等价c类型          |
|-------------|----|----------------|----------------|
| Int8        | 1  | 8位有符号整数        | signed char    |
| Uint        | 1  | 8位无符号整数        | unsigned char  |
| Int16       | 2  | 16位有符号整数       | signed short   |
| Uint16      | 2  | 16位无符号整数       | unsigned short |
| Int32       | 4  | 32位有符号整数       | signed int     |
| Uint32      | 4  | 32位无符号整数       | unsigned int   |
| Float32     | 4  | 32位IIFE-754浮点数 | float          |
| double      | 8  | 64位IIFE-754浮点数 | double         |


DataView为上表的每种类型都暴露get和set方法。类型是可以互换使用的。

```javascript
const buf = new ArrayBuffer(2)
const view = new DataView(buf)

console.log(view.getInt8(0))
console.log(view.getInt8(1))
console.log(view.getInt32(0))
```


```javascript
const buf = new ArrayBuffer(2)
const view = new DataView(buf)

console.log(view.getInt8(0)) // 0
console.log(view.getInt8(1)) // 0
console.log(view.getInt16(0)) // 0

// 将整个缓冲区都设置1
view.setInt8(0, 255)
view.setInt8(1, 0xff)

// 打印-1， 缓冲里面都是1， 因为补数的有符号整数是-1
console.log(view.getInt16(0))
// 65535
console.log(view.getUint16(0))
```

### 字节序

字节序，或字节顺序（"Endian"、"endianness" 或 "byte-order"），计算系统维护的一种字节顺序的约定。DataView只支持两种约定：大端字节序和小端字节序。大端字节序也叫“网络字节序”，意思是最高有效位保存在第一个字节，最低有效保存在最后一个字节。小端字节序正好相反，即最低有效位保存在第一个字节，最后有效位保存在最后一个字节。

JS运行时所在系统的原生字节序决定了如何读取或写入字节，但DataView并不遵守这个约定。对一段内存而言，DataView是一个中立接口，它会遵循你指定的字节序。DataView的所有这个api方法都以大端字节序作为默认值，但接受一个可选的布尔参数，设置为true即可启用小端字节序。

```javascript
const buf = new ArrayBuffer(2);
const view = new DataView(buf)
// 填充缓冲，让第一位和最后一位都是1 
view.setUint8(0, 0x80) // 0x80 -> 128
view.setUint8(1, 0x01) // 0x01 -> 1


// 大端字节顺序读取 0x8001
console.log(view.getUint16(0)) // 32769
// 小端字节顺序读取 0x0180
console.log(view.getUint16(0, true)) // 384

// 大端字节写入
view.setUint8(0, 0x01, true)
```

### 边界

DataView完成读，写操作的前提是必须有充足的缓冲区，否则就会抛出RangeError.

DataView在写入缓冲里会尽最大努力把一个值转换为适当类型，后备为0。如果无法转换，则抛出错误。

```javascript
const buf = new ArrayBuffer(1);
const view = new DataView(buf);

// 尝试读取部分超出、超出、负值、写入超出都会报错

view.getInt32(2)
view.getInt32(-1)
view.setInt32(0, 123)

view.setInt8(0, 1.5) // view.getInt(0) -> 1
view.setInt(0, [4]) // 4
view.setInt8(0, 'f') // 0
view.setInt8(0, Symbol()) // TypeError
```

##  定型数组

定型数组是另一种形式的ArrayBuffer视图。概念和DataView接近，但定型数组的区别在于，它特定于一种ElementType且遵循系统原生的字节序。相应地地形数组提供更广api和更高性能。设计定型数组的目的就是提高与webGL等原生库交换二进制数据的效率。

创建定型数组的方式包括读取已有的缓冲、使用自有缓冲、填充可迭代结构、填写基于任意类型的定型数组。另外通过ElementType.from()和ElementType.of也可以创建定型数组

```javascript
// 创建12字节缓冲
const buf = new ArrayBuffer(12)
// 创建一个引用该缓冲的int32Array
const ints = new Int32Array(buf)
// 这个定型数组知道字节的每个元素需要4个字节，因此长度为3
console.log(ints.length) // 3

// 创建长度为6的Int32Array
const ints1 = new Int32Array(6)
// 类似DataView,定型数组也有一个指向关联缓冲的引用
console.log(ints1.buffer.byteLength) // 6

// 创建[2,4,6,8]的int32Array
const ints2 = new Int32Array([2,4,6,8])
console.log(ints2.length) // 4
console.log(ints2.buffer.byteLength) // 32
console.log(ints2[2]) // 6

// 复制ints2
const ints3 = new Int16Array(ints2)
console.log(ints3.length) // 4
console.log(ints3.buffer.byteLength) // 8
console.log(ints3[2]) // 6


```

## 总结




