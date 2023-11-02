# Vue2

Vue四大核心：响应式原理（defineProperty）、模板编译（compiler）、html标签对象（VNode）和虚拟DOM（Virtual dom）。

模板编译只是在开发环境中存在，开发环境打包时候，vue-loader就会处理模板，编译成render函数。

响应式原理：数据代理（proxy）、对象劫持（defineProperty）、数组原型链包装。

模板编译：解析模板（parseHTML）、优化AST（optimize）、代码生成（generate）。

产生虚拟dom: 挂载执行`mountComponent(this, el, hydrating)`这个里面就是执行`updateComponent = function () { vm._update(vm._render(), hydrating); };`这句代码，`VNode vnode = vm._render()`执行模板编译产生的render函数，返回vnode类型节点、`vm._update( vnode )`也就是产生虚拟dom对比，生成dom

更新操作就是执行`updateComponent = function () { vm._update(vm._render(), hydrating); };`


核心代码写完了之后，就是添加周边的一些方法和边界，更利于用户使用。




