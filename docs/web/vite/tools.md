# 插件

## css

1. vite默认集成了css预处理器，支持less、sass、stylus、postcss等，并且支持全局、局部、按需加载。所以没有必要安装特定vite插件，只需安装相应预处理器依赖即可。

```bash
# .scss and .sass
pnpm i -D sass

# .less
pnpm i  -D less

# .styl and .stylus
pnpm i  -D stylus
```

2. vite内置postcss，无需安装插件, 如果工程有配置postcss配置文件（例如：postcss.config.js），会默认读取配置。

```js
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```

3. vite中任何`.module.css`后缀的文件都被认为是一个css modules文件，导入文件会返回一个模块对象，可以直接使用。


```js
import styles from './index.module.css'

export default {
  name: 'App',
  setup() {
    return () => <div class={styles.container}>Hello Vite + Vue 3!</div>
  }
}
```

4. 支持`@import index.css`和`@import url(index.css)`功能,修改也支持热更新，但是stylus不支持。

## TypeScript

Vite天然支持引入`.ts`文件。需要注意的是Vite仅执行`.ts`文件的编译工作，并不执行任何类型检查。如果需要校验，可以使用`tsc --noEmit`。

vscode编译器天然支持ts校验，编译的时候可以执行`"build": "tsc --noEmit && vite build"`。执行tsc需要typescript包，如果没有安装，可以执行`pnpm i -D typescript`。然后执行`npx tsc -init`初始化tsconfig.json文件。

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "importHelpers": true,
    "experimentalDecorators": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "baseUrl": ".",
    "resolveJsonModule": true,
    "types": ["vite/client"]
  },
  // 提示ts编译哪些文件夹下面的文件
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue", "src/**/*.jsx"]
}
```

typescript默认是不支持`.vue`文件校验，所以需要vue-tsc进行校验。

```bash
# vue-tsc
pnpm i -D vue-tsc

# 编译
npx vue-tsc --noEmit
```

修改下vue工程打包命令：`"build": "vue-tsc --noEmit && tsc --noEmit && vite build"`

**`isolateModules`** 应该设置成true, 可以多文件类型进行引用。设置成false就是单文件引用，这就导致有些特性不支持，如`const enum`和隐式类型导入。


## 静态资源处理


## JSON


## Glob