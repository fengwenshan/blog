#  VNode

## 官方文档相关内容

在Vue中存在VNode类，使用它可以实例化不同类型vnode实例，而不同类型vnode实例各自表示不同类型的DOM元素（元素节点，文本节点，注释节点等）。

- [中文文档](https://v2.cn.vuejs.org/v2/guide/render-function.html#%E8%99%9A%E6%8B%9F-DOM)
- [英文文档](https://v2.vuejs.org/v2/guide/render-function#The-Virtual-DOM)

Vue通过建立一个**虚拟DOM**来追踪自己要如何改变真实dom

```ts
// `createElement`其实也是`h`函数
return createElement('h1', this.blogTitle)
```

`createElement`返回的不是真实dom,而是真实dom对象的描述，也可以说是“虚拟节点（virtual node）”,也简称”VNode“。


```ts
// @returns { VNode }
h(
    'div',  // 参数1： 标签名称
  { // 参数2：{ Object } 标签属性
    'class': {
      foo: true,
      bar: false
    },
    'style': {
      color: 'red',
      fontSize: '14px'
    },
    attrs: { // 普通html属性
        id: 'foo'
    },
    domProps: { // DOM property v-html指令
      innerHTML: 'baz'
    },
    key: '',
    ref: '',
    on: {
        click: () => {}
    },
    nativeOn: {
      click: this.clickHandle
    },
    directives: [
      {
        name: 'my-custom-directive',
        value: '2',
        expression: '1+ 1',
        arg: 'foo',
        modifiers: {
          bar: true
        }
      }
    ],
    scopedSlots: { // 作用域插槽的格式为 { name: props => VNode | Array<VNode> }
        default: props => h('span', props.text)
    },
    // 如果组件是其它组件的子组件，需为插槽指定名称
    slot: 'name-of-slot',
    // 如果你在渲染函数中给多个元素都应用了相同的 ref 名，
    // 那么 `$refs.myRef` 会变成一个数组。
    refInFor: true
  }, 
  [ // 参数3：{ array } 子节点
    '我是一段文本',
    h('h1', '我是标题'),
    h(MyComponent, {
        props: {
          count: 'foobar'
        }
    })
  ]
)
```


## VNode

`VNode` 也就是 `virtual dom`简写，也就是虚拟dom， 用一个对象描述dom


VNode作用：每次渲染视图都是先创建vnode, 然后使用它创建真实DOM插入到页面中，所以可以将上一次渲染视图时所创建的vnode缓存起来，之后每当需要重新渲染视图时，将新创建的vnode和上一次缓存的vnode进行对比，找不不同的地方，并基于此修改真实DOM。

也就是说，只要组件使用众多状态，有一个发生改变，那么整个组件就要重新渲染。

如果组件只有一个节点发生变化，那么重新渲染整个组件的所有节点，很明显会造成很大的性能浪费。因此对vnode进行缓存，更新时新旧对比，只更新发生改变的节点。

```ts
/**
 * vnode 类型有以下几种
 *  注释节点 
 *  文本节点
 *  元素节点: tag、data、children、context
 *  组件节点: componentOptions、componentInstance Vue实例，每个组件都是以一个Vue实例、context、data、tag: 'custom-name'
 *  函数式组件: functionalContext、functionOptions、context、data、tag
 *  克隆节点
 */
/* @flow */

export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  devtoolsMeta: ?Object; // used to store functional render context for devtools
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}

export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}

export function createTextVNode (val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
export function cloneVNode (vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.asyncMeta = vnode.asyncMeta
  cloned.isCloned = true
  return cloned
}

```
