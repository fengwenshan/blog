# 异步更新

```javascript
let id = 0
export default class Watcher {
  run() {
    this.get()
  }
  update() {
    // 这种 n个属性发生2n次变化，就会触发2n次渲染， 所以需要异步,然后一起更新
    // this.get()
    queueWatcher(this)
  }
} 

// scheduler.js
const queue: watcher = []
// 去重watcher
const has = {}


function flushSchedulerQueue() {
  queue.forEach(item => {
    // 添加run方法
    item.run()
  })
  // 调用完毕清空
  queue = []
  has = {}
  pending = false
}

let pedding = false
function queueWatcher(watcher) {
  const id = watcher.id
  if(has[id] ?? false) {
    queue.push(watcher)
    has[id] = true
    // 开启一次更新操作 防抖（多次触发，只触发一次）
    if(!pedding) {
      // 同步代码执行完毕之后，会清空微任务，然后再试宏任务
      // setTimeout 是宏任务，写代码的时候，打印日志就是上一次的变量值
      // setTimeout(flushSchedulerQueue, 0) 
      nextTick(flushSchedulerQueue)
      pedding = true
    }
  } 
}


const callback = []
let waiting = false

function flushCallbacks() {
  callback.forEach( cb => cb )
  waiting = false
}

function timer(flushCallbacks) {
  let timerFn = () => { }
  // 兼容性处理
  if(Promise) {
    timerFn = () => {
      promise.resolve().then(flushCallbacks)
    }
  } else if(MutationObserver) {
    // MutationObserver 可以监控dom变化，异步更新
    let textNode = document.createTextNode(1)
    const observe = new MutationObserver(flushCallbacks)
    observe.observe(textNode, {
      characterData: true
    })
    timerFn = () => {
      textNode.textContent = 3
    }
  } else if(setImmediate) {
    // ie才支持， 性能比setTimout好
    timerFn = () => {
      setImmediate(flushCallbacks)
    }
  } else {
    setTimeout( flushCallbacks, 0)
  }
  timerFn()
}

function nextTick(cb) {
  callback.push(cb)
  if(!waiting) {
    // 这里源码考虑兼容性，
    // setTimeout( flushCallbacks, 0)
    timer(flushCallbacks)
    // vue3没有考虑兼容性promise.resolve().then(flushCallbacks)
    
    waiting = true
  }
}

Vue.prototype.$nextTick = nextTick
```