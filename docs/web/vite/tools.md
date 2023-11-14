# 工程化资源

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


```javascript
// 显式加载资源为一个 URL, return './asset.js'
import assetAsURL from './asset.js?url'

// 以字符串形式加载资源  retrun 引入资源文件text文本
import assetAsString from './shader.glsl?raw'

// 加载为 Web Worker（把js文件加载成worker操作）

import Worker from './worker.js?worker'

// 在构建时 Web Worker 内联为 base64 字符串
import InlineWorker from './worker.js?worker&inline'
```

## eslint与 pritter

eslint作用是校验代码风格，prettier作用是格式化代码风格。

校验代码风格：`"lint": "eslint --ext js src/"`

```bash
# eslint
# 新建.eslintrc.js文件
pnpm i -D eslint eslint-config-standard eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-standard

# 新建.prettierrc.js文件
pnpm i -D prettier eslint-config-prettier eslint-plugin-prettier
```

```js
//.eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
   'standard',
    'plugin:vue/essential',
    'plugin:prettier/recommended'
  ],
  global: {
      jQuery: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production'? 'error' : 'off',
  }
}
```

```javascript
// .prettierrc.js
module.exports = {
  printWidth: 120, // 一行代码最大长度
  tabWidth: 2, // tab缩进
  useTabs: false, // 是否使用tab缩进
  semi: true, // 是否使用分号
  singleQuote: true, // 是否使用单引号
  trailingComma: 'all', // 是否使用尾随逗号
  bracketSpacing: true, // 对象括号内是否加空格
  jsxBracketSameLine: false, // jsx中大括号是否独占一行
  arrowParens: 'always', // 小括号是否有空格
  proseWrap: 'preserve', // 换行时，是否折行
  extends:'standard',
}
```

## husky


git 常用钩子

1. pre-commit: git提交前执行
2. pre-push: git提交前执行
3. pre-commit: git提交前执行
4. post-commit: git提交后执行
5. post-checkout: git checkout后执行
6. post-merge: git merge后执行
7. post-checkout: git checkout后执行
8. post-merge: git merge后执行
9. post-rewrite: git rewrite后执行
10. post-checkout: git checkout后执行

husky 是一个 git 钩子工具，可以监听 git 事件，在事件触发时运行命令。如果直接执行`"lint": "eslint --ext js src/"`那么就是整个文件，随着项目的增大就会很慢，所以就有`lint-staged`能够让lint只检测暂存区的文件。

```bash
pnpm i husky lint-staged -D

# package.json 配置
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,vue}": "eslint --ext.js,.vue --fix"
  }
}
```

也可以不用配置到package.json中，直接在项目根目录执行`npx husky add.husky/pre-commit "npx lint-staged"`。

## commitizen

commitizen是一个提交规范工具，可以让你更好地提交代码。

```bash
# commitizen
pnpm i -D commitizen cz-conventional-changelog
```

```js
//.cz-config.js
module.exports = {
    types: [
        {value: 'feat', name: 'feat: 新增功能'},
        {value: 'fix', name: 'fix: 修复bug'},
        {value: 'docs', name: 'docs: 文档更新'},
        {value: 'style', name: 'style: 代码格式'},
        {value: 'refactor', name: 'refactor: 重构代码'},
        {value: 'perf', name: 'perf: 性能优化'},
        {value: 'test', name: 'test: 测试代码'},
        {value: 'build', name: 'build: 构建系统'},
        {value: 'ci', name: 'ci: 持续集成'},
        {value: 'chore', name: 'chore: 构建过程或辅助工具的变动'},
        {value: 'revert', name: 'revert: 回退'},
        {value: 'wip', name: 'wip: 临时提交'},
        {value: 'release', name: 'release: 发布'}
    ]
}
```

## editorconfig

.editorconfig是一个配置文件，用于统一代码风格，比如缩进、换行、空格等。

和eslint的区别是，editorconfig是针对整个项目的，eslint是针对单个文件。

```bash
# editorconfig
pnpm i -D @editorconfig/editorconfig-checker
```

```bash
# .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

