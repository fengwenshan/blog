# ECMA面试题

## infinity 代表什么数据

- `Infinity` 英/ɪnˈfɪnəti/ 是一个存放表示正无穷大值
- 是全局对象的一个属性
- 在ES5规范中，是只读属性
- 可以使用 `isFinit(val)` 可以用来检测数值是否有限

## 运算符优先级（计算）

```javascript
var val = "test";
console.log("output is " + (val === "Test") ? "123" : "456");
```

注意不要看见三目运算符就条件反射元素，这里考的是运算符优先级，`+` 号比 `? `优先级高，所有输出123。

## 把10.36四舍五入为最接近的整数

```javascript
// 方案1：向下取整数

// 方案2：直接裁切整数部分

// 方案3：parseInt() Math.trunc(x)

// 方案4：四舍五入

// 方案5：进行两个取反位运算

// Math.round(10.36) ?
```

## 类型转换（计算）

### 概念

类型转换分为

```javascript
var temp = [0];
if (temp) {
  console.log(temp == true);
} else {
  console.log("测试");
}
```

解答：首先`[0]`进入if判断，所有`非空字符串`、`0`、`NaN`、`null`、`undefined`、`false`都是true; 然后就是进行比较，temp就会隐式类型转换，数组首先会调用`valueOf()`,返回值还是本身，不是基本类型，那么就调用`toString()`, 返回基本数据类型`0`, 然后对比的其实是`"0" == true`


## null与undefined的区别

[详细见这里](./base.html#数据类型)

## 原型与原型链



## 闭包

[详细见这里](./function.html#闭包)

## 继承


## 防抖

在单位时间内频繁触发事件，只生效最后一次


```javascript
function debounce(fn, delay) {
  let flag
  return function(...args) {
    if(flag) clearTimeout(flag)
    flag = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
window.addEventListener('scroll', debounceTask)

// 测试
function task() {
  console.log('run task')
}
// 该函数频繁触发，只执行最后一次，最后一次延迟1秒执行
const debounceTask = debounce(task, 1000)
```

## 节流

在单位时间内频繁触发事件，只生效第一次

```javascript
function throttle(fn, delay) {
  let last = 0;
  return function(...args) {
    const now = Date.now()
    if(now - last > delay) {
      last = now
      fn.apply(this.args)
    }
  }
}
window.addEventListener('scroll', throttle)

// 测试
function task() {
  console.log('run task')
}
// 该函数频繁触发，只执行第一次，然后间隔多少秒再执行一次
const debounceTask = debounce(task, 1000)
```


## 事件循环

## 宏任务与微任务

## promise

## 手写nextTick

## 手写promise

## 手写new 

## 手写 instanceof

## 手写bind、apply和call

## 手写高阶函数

## 手写class



