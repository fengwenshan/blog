# Vite 使用

## 快速上手

在原有的项目中可以集成vite: `pnpm install vite --D`。

空文件可以直接搭建vite项目: `npm create vite@latest` 或 `yarn | pnpm create vite`。

创建项目的时候可以指定模板：`创建命令 模板名称 --template vue | react` 构建Vite+Vue或react项目, [模板社区](https://github.com/vitejs/awesome-vite#templates)

**index.html与项目根目录**

在vite中`index.html`在项目最外层，而不是在public文件夹下，这是因为vite在开发环境的时候是一个服务器，而index.html是vite项目的入口文件。

vite将index.html视为源码和模块图的一部分。vite解析`<script type="module" src="...">`，这个标签指向JS源码。甚至内联引入JS的`<script type="module">`和引用css的`<link href>`也能利用vite特有的功能被解析。

## 创建项目

### 集成vue2项目

使用`pnpm i vite vue@^2.6.14 underfin/vite-plugin-vue2`插件, vue2.7x使用`@vitejs/plugin-vue2`插件

```javascript
// vite.config.js
import { createVuePlugin } from 'vite-plugin-vue2';
import vue from '@vitejs/plugin-vue2';

module.exports = {
  plugins: [
    createVuePlugin(/* options */), // vue2.6x
    vue() // vue 2.7x
  ]
}
```

```json
{
  "scripts": {
    "dev": "vite", // 启动开发服务器，别名：`vite dev`，`vite serve`
    "build": "vite build", // 为生产环境构建产物
    "preview": "vite preview" // 本地预览生产构建产物
  }
}
```



### 集成Vue3

使用`pnpm i vite vue@latest @vitejs/plugin-vue`插件

```javascript
// vite.config.ts
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [vue()],
}
```

```typescript
// src/vite-env.d.ts

/// <reference types="vite/client" />
```

### 集成React

```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

```typescript
// src/vite-env.d.ts
/// <reference types="vite/client" />
```

## 别名alias

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname,'src'),
      '@styles': path.resolve(__dirname,'src/styles'),
    },
  },
})
```

## 客户端类型

Vite 默认的类型定义是写给它的 Node.js API 的。要将其补充到一个 Vite 应用的客户端代码环境中，请添加一个 d.ts 声明文件：

```typescript
/// <reference types="vite/client" />
```

也可以在 tsconfig.json 中添加 `types: ["vite/client"]` 选项。

这样会提供一下类型定义提示：

- `import.meta` 对象
- `import.meta.glob`
- `import.meta.globEager`
- `import.meta.env` Vite 注入的环境变量的类型定义
- `import.meta.hot`  HMR API 类型定义
- `import.meta.webpackHot`
- `import.meta.webpackJsonp`
- `import.meta.url`
- `import.meta.glob`

:::tip

要覆盖默认的类型定义，请添加一个包含你所定义类型的文件，请在三斜线注释 reference vite/client 前添加定义。

例如，要为 React 组件中的 *.svg 文件定义类型：

- Vite-env-overge.d.ts (包含您的输入的文件)：

```ts
declare module '*.svg' {
const content: React.FC<React.SVGProps<SVGElement>>
export default content
}
```

- 包含对 vite/client 的引用的文件:

```ts
/// <reference types="./vite-env-override.d.ts" />
/// <reference types="vite/client" />
```
:::

## 环境变量

Vite在一个特殊的`import.meta.env`对象上暴露环境变量。还有一些可以使用的内建变量：

- `import.meta.env.MODE` 项目模式，例如：`development`、`production`、`test`
- `import.meta.env.DEV` 项目模式是否为开发模式
- `import.meta.env.PROD` 项目模式是否为生产模式
- `import.meta.env.HOST` 服务器主机名
- `import.meta.env.PORT` 服务器端口
- `import.meta.env.BASE_URL` 项目根路径
- `import.meta.env.SSR` 是否在服务端渲染

打包后，这些环境变量会被替换为它们的值。因此，在引用它们时请使用完全静态的字符串。动态的key将无法生效。


也可以自定义env,在项目的根目录下创建`.env`文件，vite使用dotenv从环境目录中环境文件加载额外环境变量，然后在`vite.config.js`中引入。

格式`.env[.mode[.local]] || .env[.local]`  .local文件会被git忽略， 

```bash
.env # 公共环境变量 优先级最低
.env.local # 本地环境变量 
.env.development # 开发环境变量
.env.test # 测试环境变量
.env.staging # 预发布环境变量
.env.production # 生产环境变量

# 以下为本地环境变量，不会被提交到git
.env.development.local
.env.test.local
.env.staging.local
.env.production.local
```

```javascript
import { defineConfig } from 'vite';
import { loadEnv } from 'vite';

export default defineConfig({
  envDir: './',
  envPrefix: 'VITE_',
  env: loadEnv(),
})
```

```bash
# env 变量必须使用VITE_ 开头
VITE_TITLE = "Hello World"
VITE_BASE_URL = "/vite"
```

默认情况，开发服务器（dev）运行在`development`模式，生产服务器（build）运行在`production`模式。

在某些情况下，若想在开发环境`vite`时运行不同的模式来渲染不同的标题，可以通过传递`--mode`选项来覆盖命令的默认模式。

```bash
"dev": "vite --mode production"
# 同时需要建.env.production文件

```

由于 vite build 默认运行生产模式构建，你也可以通过使用不同的模式和对应的 .env 文件配置来改变它，用以运行开发模式的构建：

```bash
# .env.testing
NODE_ENV=development
```

ts开发需要声明相应的类型

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```


Vite 还支持在 HTML 文件中替换环境变量。import.meta.env 中的任何属性都可以通过特殊的 %ENV_NAME% 语法在 HTML 文件中使用：

```html
<h1>Vite is running in %MODE%</h1>
<p>Using data from %VITE_API_URL%</p>
```

如果环境变量在 import.meta.env 中不存在，比如不存在的 %NON_EXISTENT%，则会将被忽略而不被替换，这与 JS 中的 import.meta.env.NON_EXISTENT 不同，JS 中会被替换为 undefined。

## envDir

用于加载 .env 文件的目录。可以是一个绝对路径，也可以是相对于项目根的路径。

## glob import

```js
// Vite 支持使用特殊的 import.meta.glob 函数从文件系统导入多个模块：
const modules = import.meta.glob('./dir/*.js')

// vite 生成的代码
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
  './dir/bar.js': () => import('./dir/bar.js'),
}

// 默认是懒加载，通过动态导入实现，如果想直接引入，可以传入 { eager: true } 作为第二个参数：
const modules = import.meta.glob('./dir/*.js', { eager: true })

// vite 生成的代码
import * as __glob__0_0 from './dir/foo.js'
import * as __glob__0_1 from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1,
}


// 字符串形式导入文件，类似于 以字符串形式导入资源。在这里，我们使用了 Import Reflection 语法对导入进行断言：
const modules = import.meta.glob('./dir/*.js', { as: 'raw', eager: true })

// code produced by vite（代码由 vite 输出）
const modules = {
  './dir/foo.js': 'export default "foo"\n',
  './dir/bar.js': 'export default "bar"\n',
}
// 还可以多个匹配模式
const modules = import.meta.glob(['./dir/*.js', './another/*.js'])

// ! 排除匹配模式
const modules = import.meta.glob(['./dir/*.js', '!**/bar.js'])

// 导入模块中的部分内容，那么可以利用 import 选项。
const modules = import.meta.glob('./dir/*.js', { import: 'setup' })

// vite 生成的代码
const modules = {
  './dir/foo.js': () => import('./dir/foo.js').then((m) => m.setup),
  './dir/bar.js': () => import('./dir/bar.js').then((m) => m.setup),
}

// 当与 eager 一同存在时，甚至可以对这些模块进行 tree-shaking。
const modules = import.meta.glob('./dir/*.js', {
  import: 'setup',
  eager: true,
})

// vite 生成的代码
import { setup as __glob__0_0 } from './dir/foo.js'
import { setup as __glob__0_1 } from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1,
}

// 设置 import 为 default 可以加载默认导出。
const modules = import.meta.glob('./dir/*.js', {
  import: 'default',
  eager: true,
})

// vite 生成的代码
import __glob__0_0 from './dir/foo.js'
import __glob__0_1 from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1,
}

// 也可以使用 query 选项来提供对导入的自定义查询，以供其他插件使用。
const modules = import.meta.glob('./dir/*.js', {
  query: { foo: 'bar', bar: true },
})
// vite 生成的代码
const modules = {
  './dir/foo.js': () => import('./dir/foo.js?foo=bar&bar=true'),
  './dir/bar.js': () => import('./dir/bar.js?foo=bar&bar=true'),
}
```

glob导入注意事项

- 这是一个vite独有的功能而不是一个Web或ES标准
- 该glob模式会被当成导入标识符：必须是相对路径（./开头）或绝对路径（以/开头，相对于项目根目录解析）或别名路径（resolve.alias）
- glob匹配使用fast-glob来实现的
- `import.meta.glob`的参数都必须是字面量，不能是变量或表达式

## clearScreen

```js
import { clearScreen } from 'vite'

clearScreen()
```

在终端中清除屏幕，默认情况下，Vite 会在每次重新编译时清除屏幕，以便在重新编译时看到更新后的输出。

如果你想在每次重新编译时保持屏幕不变，你可以使用 clearScreen 函数。


## logLevel 

类型：`'info' | 'warn' | 'error' |'silent'`, 调整控制台输出的级别，默认info