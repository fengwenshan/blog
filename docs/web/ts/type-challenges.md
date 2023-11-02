# type-challenges练习


## 实现`Pick<T, K>`

从类型 T 中选出符合 K 的属性，构造一个新的类型。

```typescript
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
}
```

::: details
```typescript
// keyof T ===  "title" | "description" | "completed"
type MyPick<T, U extends keyof T> = {
    [K in U]: T[K]
}
```
:::

## 实现 `Readonly<T>`

泛型 `Readonly<T>` 会接收一个 泛型参数，并返回一个完全一样的类型，只是所有属性都会是只读 (readonly) 的。

也就是不可以再对该对象的属性赋值。


```typescript
interface Todo {
  title: string
  description: string
}

const todo: MyReadonly<Todo> = {
  title: "Hey",
  description: "foobar"
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property
```

::: details
```typescript
type MyReadonly<T> = {
    readonly [K in keyof T]: T[K]
}
```
:::

## `Exclude<T, U>`

从联合类型 T 中排除 U 中的类型，来构造一个新的类型。

```typescript
type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
```



::: details
```typescript
// 分配性
type  MyExclude<T, U extends T> = T extends U ? never : T
```
:::

## 数组（元组）转对象


将一个元组类型转换为对象类型，这个对象类型的键/值和元组中的元素对应。

`PropertyKey` 是 TypeScript 中的一种内置类型，它表示一个属性的键（或键的集合），可以是字符串、数字或符号。在 TypeScript 中，对象的属性键必须是 `PropertyKey` 类型的值。

```typescript
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

type result = TupleToObject<typeof tuple> // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
```

::: details
```typescript
// type TupleToObject<T extends readonly any[]>
 type TupleToObject<T extends readonly PropertyKey[]> = {
    [Item in T[number]]: T[number]
    // [Item in T[number]]: Item
}
```
:::

## 实现`First<T>`

实现一个`First<T>`泛型，它接受一个数组T并返回它的第一个元素的类型。



```typescript
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type head1 = First<arr1> // 应推导出 'a'
type head2 = First<arr2> // 应推导出 3
```

::: details
```typescript
// 方法1：直接取
type First<T extends PropertyKey[]> =  T[0]

// 方法2：extends
type First<T extends PropertyKey[]> = T extends PropertyKey[] ? T[0] : undefined

// 方法3：inter
type First<T extends PropertyKey[]> = T extends [infer T1, ...infer args  ] ? T1 : undefined
```
:::

## Array.length

创建一个Length泛型，这个泛型接受一个只读的元组，返回这个元组的长度。


```typescript
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type teslaLength = Length<tesla> // expected 4
type spaceXLength = Length<spaceX> // expected 5
```





::: details
```typescript
type Length<T extends readonly PropertyKey[]> = T['length']

type Length<T extends readonly PropertyKey[]> = T extends { length: infer T } ? T : never
```
:::







