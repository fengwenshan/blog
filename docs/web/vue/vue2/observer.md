# 响应式原理


## 数据代理

```javascript

```





























## 数据代理与劫持

- 实现data数据代理
- 对象数据劫持与数组方法拦截


```ts
export function initState(vm: Component) {
  // 任务一
  Object.keys(vm.$data).forEach(key => {
    proxy(this, '$data', key)
  })
  // 任务二：劫持数据
  observe(vm.$data);
}

export function proxy(target, sourceKey, key) {
  Object.defineProperty(target, sourceKey, {
    get() {
      return target[sourcekey][key]
    },
    set(value) {
      target[sourcekey][key] = value
    }
  })
}

// 如果是普通数据类型，就会直接在下面方法中return
// 复杂类型，则会进行代理
export function observe(data) {
  if(!isObject(data)) return;
  let ob: Observer;
  if(hasOwn(value, '__ob__') && value.__ob__ instanceof  Observe) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }
  return ob
}

export function def(target, key, value) {
  Object.defineProperty(target, key, {
    enumerable: !!enumerable,
    configurable: true,
    writable: true,
    value
  })
}

export function defineReactive(target, key) {
  const value = target[key]
  observe(value)
  Object.defineProperty(target, key, {
    get() {
      // 注意这里不能target[key] 会导致死循环
      return value
    },
    set(val) {
      if (val === value) return
      // 防止val 是对象 
      observe(val)
      target[key] = val
    }
  })
}

export class Observer {
  constructor(data) {
    this.value = value
    // 设置__ob__ 不可枚举
    def(value, '__ob__', this);
    if (isFunction(data)) {
      this.walk(data)
    } else if (Array.isArray(data)) {
      // arrayMethods 增强proto，让执行数组方法的时候，我是知道的
      // 源码使用 value.__proto__ = arrayMethods; 这是个私有属性，ts不让访问
      Object.setPrototypeOf(value, arrayMethods);
      this.observeArray(data)
    }
  }

  walk(value: Record<string, any>) {
    Object.keys(value).forEach(key => {
      defineReactive(value, key)
    })
  }

  observeArray(value: any[]) {
    // 如果是数组，每一项都要进行代理
    value.forEach(item => {
      observe(item)
    })
  }
}
```


```ts
const arrProto: Record<string, any> = Array.prototype;
// 加到这里，数组目标原型上面多了一层空层
const array = Object.create(arrProto);
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
  // 原型链上面的原始方法
  const original = arrProto[method];
  // 经过Object.setPrototypeOf(value, arrayMethods); 修改原型链以后，执行的方法就会触发下面的代理
  def(arrayMethods, method, function(...args: any[]) {
    // original 什么方法触发，就是什么方法，比如 arr.push(5), 那么original就是push方法
    // this就是当前对象，比如arr.push(5), 那么this就是arr，
    // result执行该数组方法返回的参数 push 返回的参数

    // 调用原型链上的方法，然后执行自己的逻辑
    const result = origin.apply(this, args);
    const ob = this.__ob__;
    // 防止用户push 对象进去
    let inserted;
    switch(method) {
      case 'push':
      case 'unshift':
        inserted = args; // 对添加的数据进行响应式
        break;
      case 'splice':
        // 参数1：开始位置， 参数2删除熟练， 参数3+添加数据
        inserted = args.slice(2);
    }
    if (inserted) ob.observeArray(inserted);
    return result;
  })
})
```

## 观察者 与 依赖收集

其实上面内容配合 `compileToFunctions` 与 `vm._update(vm._render())`就能达到渲染内容

```javascript
const vm = new Vue({
  data() {
    return {
      count: 1
    }
  }
}).$mount('#app')

setTimeout(() => {
  vm.count = 2
  // 重新调用
  vm.update(vm.render())
}, 1000)
```

现在不用让用户自己调用，而是让代码属性改变然后，自动通知改变，从而更新视图。这时候就需要观察者观察属性变化

```javascript
// 标记watcher
let id = 0
export default class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.id = ++id;
    this.vm = vm
    this.expOrFn = expOrFn
    this.cb = cb
    this.options = options
    this.getter = expOrFn
    // 默认初始化， 取值
    this.get()
    this.deps = []
    this.depsId = new Set()
  }
  // 更新视图时候，重新调用getter方法
  get() {
    // defineProperty.get 每个睡醒都可以收集自己的watcher
    // 一个属性可以对应多个watcher, 同时一个watcher可以对应多个属性
    // 可以让Dep去收集属性的watcher
    
    // 这个就会把当前watcher缓存起来，然后下面就会触发getter，就会触发劫持get, 
    // 在劫持get里面访问Dep.target 就可以访问到
    pushTarget(this)
    this.getter()
    // 防止模板渲染完后，用户在外面取值，收取依赖
    popTarget()
  }
  addDep(dep) {
    // 一个属性有多个地方使用，那么只要一个watcher就行，所以需要去重，这时候可以使用set
    // 这样一个属性watcher对应多个dep
    // 这时候还要让多个dep都要存一份这个watcher
    const id = dep.id
    if(!this.depsId.has(id)) {
      this.deps.push(dep)
      this.depsId.add(dep)
      dep.addSub(this)
    }
  }
  update() {
    this.get()
  }
} 

// 只是渲染过程
function mountComponent(vm, el) {
  let updateComponent = () => {
    vm._update(vm._render())
  }
  // 如果属性改变，那就触发watcher
  // 一个组件一个watcher(每个组件，就有一个watcher)
  new Watcher(vm, updateComponent, () => {
    console.log('视图更新了')
  }, true /* 渲染过程 */)
}
```


```javascript
let id = 0
// 每个属性都分配一个dep, dep来存放watcher。 watcher中还要存放dep 
export default class Dep {
  constructor() {
    this.id = ++id;
    this.subs = [] // 存放watcher
  }
  depend() {
    // Dep.target dep里存放watcher, watcher里存放dep, 多对多关系
    if(Dep.target) {
      Dep.target.addDep(this)
    }
  }
  addDep(watcher) {
    this.subs = watcher 
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}

Dep.target = null

export function pushTarget(watcher) {
  Dep.target = watcher
}
export function popTarget() {
  Dep.target = null
}


export function defineReactive(target, key) {
  const value = target[key]
  observe(value)
  // 这样每个属性都有一个dep
  const dep = new Dep()
  Object.defineProperty(target, key, {
    get() {
      // 取值时，把dep和watcher关联起来
      if(Dep.target) {
        // 这个Dep.target 是模板渲染时候触发 watcher里面的get触发，给的值
        // 让dep记住watcher
        dep.depend()
      }
      // 注意这里不能target[key] 会导致死循环
      return value
    },
    set(val) {
      if (val === value) return
      // 防止val 是对象 
      observe(val)
      target[key] = val
      // 调用watcher 里面的更新方法
      dep.notify()
    }
  })
}
```

到了这里，数据更新页面就会更新，但是更新一个属性就会执行一次，n个属性就是n次，这时候可以异步更新。

## 数组更新

```javascript
export class Observer {
  constructor(data) {
    this.dep = new Dep()
    this.value = value
    def(value, '__ob__', this);
    if (isFunction(data)) {
      this.walk(data)
    } else if (Array.isArray(data)) {
      Object.setPrototypeOf(value, arrayMethods);
      this.observeArray(data)
    }
  }

  walk(value: Record<string, any>) {
    Object.keys(value).forEach(key => {
      defineReactive(value, key)
    })
  }

  observeArray(value: any[]) {
    value.forEach(item => {
      observe(item)
    })
  }
}

['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
  const original = arrProto[method];
  def(arrayMethods, method, function(...args: any[]) {
    const result = origin.apply(this, args);
    const ob = this.__ob__;
    let inserted;
    switch(method) {
      case 'push':
      case 'unshift':
        inserted = args; 
        break;
      case 'splice':
        inserted = args.slice(2);
    }
    if (inserted) ob.observeArray(inserted);
    // 数组的 observer.dep 属性， 只要调用数组方法就通知
    ob.dep.notify()
    return result;
  })
})

// 把数组每一项都做依赖收集
function dependArray(value) {
  // 数组里面的数组，对象里面的对象进行依赖收集
  if(Array.isArray(value)) {
    value.forEach(item => {
      item.__ob__ && item.__ob__.dep.depend()
      dependArray(item)
    }) 
  }
}

export function defineReactive(target, key) {
  const value = target[key]
  const ob = observe(value)
  // 这样每个属性都有一个dep
  const dep = new Dep()
  Object.defineProperty(target, key, {
    get() {
      if(Dep.target) {
        dep.depend()
        // 处理数组
        if(ob) {
          ob.dep.depend()
          dependArray(value)
        }
      }
      return value
    },
    set(val) {
      if (val === value) return
      // 防止val 是对象 
      observe(val)
      target[key] = val
      // 调用watcher 里面的更新方法
      dep.notify()
    }
  })
}
```



