# 异步

## 高阶函数

高阶函数遵循一个非常明确的定义：

- 它是一等公民
- 以一个函数作为参数
- 以一个函数作为返回结果


### forEach

- forEach有 三个参数:参数一：数组项；参数二：数组项索引；参数三：数组本身
- map 参数和forEach一样，只是有返回值，返回数组
- filter 参数和forEach一样，把符合条件的数组项，组装成新数组返回
- reduce 

```javascript
function def(target, key, value) {
  Object.defineProperty(target, key, {
    enumerable: false,
    writable: true,
    configurable: true,
    value,
  });
}

def(Array.prototype, 'ForEach', function(fn) {
  for(let i = 0, l = this.length; i < l; i++) {
    if( fn(this[i], i, this) === false ) break
  }
});

[1,2,3].ForEach((item, index, arr) => {
  console.log(item)
})

// lodash实现 _.each -> _.forEach
/**
 * @description 循环数组
 * @param {Array} array
 * @param {Function} iterationFn
 * @returns {Array}
 */
function arrayEach(array, iterationFn) {
  let index = -1;
  const length = array.length
  while(++index < length) {
    // 遍历函数return false立马终止循环
    if(iterationFn(array[index], index, array) === false) break
  }
  return array
}

/**
 * @description 循环对象
 * @param { Object  } collection
 * @param {Function} iterationFn
 * @return { Object }
 */
function baseEach(collection, iterationFn) {
  if(collection == null) return collection
  // es5可以使用for...in
  const keys = Object.keys(collection)
  let index = -1
  while(++index < keys.length) {
    if(iterationFn(collection[keys[index]], keys[index], collection) === false) break
  }
  return collection
}
/**
 *
 * @param {Array|Object} collection 集合
 * @param { Function } iterationFn
 * @return { Array | Object }
 */
function forEach(collection, iterationFn) {
  const func = Array.isArray(collection) ? arrayEach : baseEach
  return func(collection, iterationFn)
}


forEach([1, 2], function(value) {
  console.log(value);
});
forEach({ 'a': 1, 'b': 2 }, function(value, key) {
  console.log(value, key);
});
```


### map

```javascript
// map实现
function def(target, key, value) {
  Object.defineProperty(target, key, {
    enumerable: false,
    writable: true,
    configurable: true,
    value,
  });
}
def(Array.prototype, 'Map', function(fn) {
  const arr = new Array(this.length)
  for(let i = 0, l = this.length; i < l; i++) {
    arr.push(fn(this[i], index, this))
    // lodash 方案
    // arr[i] = fn(this[i], index, this)
  }
  return arr
});
```

### reduce

```javascript
// reduce实现 这里没有处理边界情况
function def(target, key, value) {
  Object.defineProperty(target, key, {
    enumerable: false,
    writable: true,
    configurable: true,
    value,
  });
}
def(Array.prototype, 'Reduce', function(fn, initState) {
  let value = initState
  for(let i = 0, l = this.length; i < l; i++) {
    value = fn(initState, this[i], i, this)
  }
  return value
});
const sum = [1,2,3].Reduce((initState, item, index, arr) => {
  return item + initState
}, 0)
console.log(sum)
```

### filter

```javascript
// filter 实现
function def(target, key, value) {
  Object.defineProperty(target, key, {
    enumerable: false,
    writable: true,
    configurable: true,
    value,
  });
}

def(Array.prototype, 'Filter', function(fn) {
  const result = []
  for(let i = 0, l = this.length; i < l; i++) {
    // lodash 好像并不喜欢用push, 源码里面是设置一个resultIndex初始索引，arr[++resultIndex] = this[i]
    result.push(fn(initState, this[i], i, this))
  }
  return result
});

const value = [1,2,3,4,5].filter(item => item > 3)
console.log(value)
```






## event loop

## 