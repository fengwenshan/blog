# 包装类型

ECMAScript提供三种特殊的引用类型：Boolean、Number、和String。

每当使用某个原始值得方法或属性时，后台都会创建一个相应原始包装类型的对象，从而暴露出操作原始值的各种方法

```javascript
const a = "some text"
const b = a.substring(2)
```

上面第二行代码会执行三个步骤：

- 创建String类型实例
- 调用实例上面特定方法
- 销毁实例

```javascript
let a = new String("some text");
const b = a.substring(2)
a = null
```

以上三步发生在后台。引用类型与原始值包装类型的主要区别在于对象的生命周期。在通过new实例化引用类型后，得到的实例会在离开作用域时被销毁，而自动创建的原始值包装对象则只存在于访问它的那行代码执行期间。这就意味着不能再运行时给原始值添加属性和方法。

```javascript
const a = "some text";
a.color = "red"
console.log(a.color) // undefined
```

上面第二行代码尝试给字符串a添加属性。但是第三行访问却是undefined。原因就是第二行代码会临时创建一个String对象，而执行第三行时候，那个临时变量对象已经被销毁了。实际上第三行代码在这里创建了自己的String对象，但这个对象没有color属性

包装类型 typeof 返回"object",所以说使用的时候最好显示调用，避免开发者疑惑。

Object构造函数作为工厂方法，能够根据传入值得类型返回相应的原始值包装类型的实例

```javascript
const obj = new Object("some text");
console.log(obj instanceof Object)
```

需要注意使用New调用原始包装类型的构造函数与调用同名的转型函数不一样

```javascript
const value = "25"
const num = Number(value) // typeof num => 25
const num1 = new Number(value) // typeof num1 => "object"
```

Boolean的实例重写valueOf()方法，返回一个原始值boolean值，toString()方法在被调用的时候也会被覆盖，返回字符串形式boolean值。
Number的实例重写valueOf()方法、toLocaleString()和toString()方法 valueOf返回Number对象表示的原始数值，另外两个返回字符串形式，但是toString()方法可选地接收一个表示基数的参数（进制）

