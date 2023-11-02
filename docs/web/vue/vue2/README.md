# 初始化 

- 任务一：把data数据代理到Vue实例上面，后面可以直接使用this.xxx, 而不是this.$data.xxx
- 任务二：写一个observe类进行对象的劫持，数组的原型链代理


```ts
class Vue {
  $options: Options;
  $data: Record<string, any>;
  _init!: (options: Options) => void;
  _watchers: Watcher[];
  $watch!: () => () => void;// VmWatch;

  constructor(options: Options) {
    if(options && isPlainObject(options)){
      this.$options = options;
      this.$data =  isFunction(options.data) ? options.data.call(this) : options.data;
      this.$el = options.el;
      // Vue源码处理："noImplicitThis": false 来禁用隐式 any 类型的警告。
      this._init(options);
    } else {
      throw new Error('Options 传递对象');
    }
  }
}

function initMixin(Vue: typeof Component) {
  Vue.prototype._init = function (options: Option) {
    initState(this)
  }
}

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

initMixin(Vue);
```

```ts
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