# dev配置

## 配置vite

### 导出

当命令行方式运行vite时，vite会自动解析项目根目录下名为`vite.config.ts`的文件，并将其作为配置对象。

```js
// vite.config.js 通过IDE和jsdoc的配合来实现智能提示
/** @type {import('vite').UserConfig} */
export default {
    // 基础配置
}
```

即使项目没有在`package.json`中开启`type: module`, Vite也支持在配置文件中使用esm语法。这种情况下，配置文件会在被加载前自动进行预处理。

也可以通过`--config`命令行选项指定配置文件`vite --config my-config.js`

Vite本身附带TypeScript类型，可以使用`defineConfig`工具函数获取类型提示

```typescript
import { defineConfig } from 'vite'

export default defineConfig ({
  // ...
})
```

### 情景配置

如果配置文件需要基于dev或build命令 或 其他不同的模式来决定选项，或者是一个SSR构建，则可以选择导出这样的函数

```typescript
export default defineConfig({ command, mode, ssrbuild}) => {
    if(command === 'serve') {
        return {
            // vite中开发模式command的值为serve
        }
    } else if(command === 'build') {
        return {
            // build配置
        }
    } else if(mode === 'development') {
        return {
            // dev配置
        }
    } else if(mode === 'production') {
        return {
            // prod配置
        }
    } else if(ssrbuild) {
        return {
            // ssr配置
        }
    }
}
```

### 异步配置

如果配置需要调用一个异步函数，也可以转而导出一个异步函数。这个异步函数也可以通过 defineConfig 传递，以便获得更好的智能提示：

```typescript
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // vite 配置
  }
})
```

### 配置中使用环境变量

环境变量可以从`process.env`中获取，但是vite默认不加载`.env`文件，因为这些文件需要执行完vite配置后才能知道加载哪一个，举个例子，root 和 envDir 选项会影响加载行为。不过当你的确需要时，你可以使用 Vite 导出的 loadEnv 函数来加载指定的 .env 文件。

```typescript
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // vite 配置
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  }
})
```

## 共享配置

### root

`root: string`，默认`process.cwd`，项目根目录（index.html文件所在位置）。可以是一个绝对路径或者相对于该配置文件的相对路径。

### base

`base: string`，默认`/`，项目部署的根路径，部署应用时，所有资源的路径相对于该路径。例如，如果将base设置为`/assets/`，那么`/assets/main.js`会被解析为`/assets/main.js`，`/assets/`会被解析为`/assets/`。就是设置请求资源前缀。

## mode

`mode: string`，默认`'development'`用于开发，`'production'`用于构建，在配置中指明将会把serve和build时的模式都覆盖。也可以通过命令行`--mode`选项来重写。


## define

`define: Record<string, any>`，定义全局常量替换方法，其中每项在开发环境下会被定义在全局，而在构建时被静态替换，一般被用来替换那些在代码中使用的常量或硬编码的值。

- String值会以原始表达式形式使用，所以若果定义了字符串常量，它需要被显示地打引号（JSON.stringify(str)）
- 为了与esbuild的行为保持一致，表达式必须为一个JSON对象（null, boolean, number,string,数组或对象）或是一个单独的标识符。
- 替换只会在匹配到周围而不是其他字母、数字、`_`、`$`时执行

```typescript
export default defineConfig({
  define: {
    MY_NAME: 'John Doe'
  }
})
```

然后在vue组件中可以通过`MY_NAME`来访问这个全局变量。

```vue
<template>
  <div>{{ appVersion }}</div>
</template>

<script>
  export default {
    computed: {
      appVersion() {
        return this.$__APP_VERSION__;
      }
    }
  }
</script>
```

对于TypeScript开发者来说，确保在`env.d.ts`或`vite-env.d.ts`文件中添加类型声明，以获得类型检查以及代码提示

```typescript
// vite-env.d.ts
declare const __APP_VERSION__: string
declare const __APP_ENV__: string

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $APP_VERSION: typeof __APP_VERSION__
    $APP_ENV: typeof __APP_ENV__
  }
}
```

## envPrefix

类型：`string | string[]` 默认`VITE_`

以 envPrefix 开头的环境变量会通过 import.meta.env 暴露在你的客户端源码中。

envPrefix 不应被设置为空字符串 ''，这将暴露你所有的环境变量，导致敏感信息的意外泄漏。 检测到配置为 '' 时 Vite 将会抛出错误. 如果你想暴露一个不含前缀的变量，可以使用 define 选项：

```js
define: {
  'import.meta.env.ENV_VARIABLE': JSON.stringify(process.env.ENV_VARIABLE)
}
```

## plugins

`plugins: (Plugin | Plugin[])[]`，默认`[]`，用于配置插件，可以是一个数组，也可以是一个函数。

```typescript
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vitePluginImp({
      libList: [
        {
          libName: 'vant',
          style: (name) => `vant/es/${name}/style`
        }
      ]
    })
  ]
})
```

## publicDir

`publicDir: string`，默认`false`，用于静态资源服务的文件夹。该目录中的文件在开发期间在 / 处提供，并在构建期间复制到 outDir 的根目录，并且始终按原样提供或复制而无需进行转换。该值可以是文件系统的绝对路径，也可以是相对于项目根目录的相对路径。



## cacheDir

`cacheDir: string`，默认`node_modules/.vite`，存储缓存文件的目录。此目录下会存储预打包的依赖项或 vite 生成的某些缓存文件，使用缓存可以提高性能。如需重新生成缓存文件，你可以使用 --force 命令行选项或手动删除目录。此选项的值可以是文件的绝对路径，也可以是以项目根目录为基准的相对路径。当没有检测到 package.json 时，则默认为 .vite。

## resolve

类型：`resolve: Record<string, any>`

### resolve.alias

类型：`Record<string, string> | Array<{ find: string | RegExp, replacement: string, customResolver?: ResolverFunction | ResolverObject }>`

将会被传入到`@rollup/plugin-alias`作为entries的选项。也可以是一个对象，或者一个`{ find, replacement, customResolver } `数组

当使用文件系统路径的别名时，请使用绝对路径。相对路径的别名值会原封不动的被使用，因此无法被正茬的解析

### resolve.dedupe

类型： `string[]`，用于解决多个同名模块导入的问题。有时开发中需要安装多个依赖包，并在不同上下文中引用，这种情况如果没有特殊处理，vite默认会保留所有版本，并在需要的时候自动选择正确的版本，如果想强制选择一个版本可以是使用这个参数

```typescript
export default defineConfig({
  resolve: {
    dedupe: ['lodash']
  }
})
```

需要注意的是，resolve.dedupe只适用于同步模块导入。对于异步模块导入，Vite会始终使用最新导入的版本。


### resolve.conditions

类型：`string[]`，默认`['import', 'node']`，用于控制模块导入的条件匹配

如果在想在生成环境中使用一个优化过的版本模块，而在开发环境中使用源码模块，可以配置resolve.conditions，将`import`和`node`从默认值中移除，这样在开发环境中就会使用优化过的版本模块，而在生成环境中就会使用源码模块。

```typescript
export default defineConfig({
  resolve: {
    conditions: {
      react: process.env.NODE_ENV === 'production' ? 'react/dist/react.min.js' : 'react/src/index.js',
      // 匹配所有的css预处理器 
      // 如果一个模块以@/style开头，并且它的父目录中包含less、scss、stylus文件夹，那么这个模块会被认为是css预处理器
      '^@\\w+/style$': /node_modules\/(less|scss|stylus)\/dist/
      // 所有的.vue模块都被编译成ES模块
      '*.vue': 'module',
      // css模块压缩
      '*.css': 'production'
    }
  }
})
```

resolve.conditions只适用于同步模块导入。对于异步模块导入，Vite会始终使用最新导入的版本。



### resolve.mainFields

类型：`string[]`，默认`['module', 'jsnext:main', 'jsnext']`，用于配置在package.json中查找模块的字段。用于处理一些不符合默认规范的模块时非常有用，例如在处理一些第三方模块或库时。


在 Vite 中，模块解析通常依赖于模块的 package.json 文件中的 "main" 字段来确定入口文件。然而，某些库可能会使用不同的字段，如 "module"、"esm" 或 "browser"，来指定不同环境下的入口文件。如果你想使用不同的字段来解析模块的入口文件，可以通过 resolve.mainFields 配置选项来实现。

例如，如果一个库在 package.json 中同时指定了 "module" 和 "main" 字段，你可以在 Vite 配置中这样使用 resolve.mainFields：


```typescript
export default defineConfig({
  resolve: {
    mainFields: ['module','main']
  }
})
```

上面配置告诉vite在解释模块时首先查找module字段，如果不存在，再查找main字段。这样，Vite 将使用首次找到的字段来确定模块的入口文件。

package.json的main是required字段，module字段用于import导出，main字段用于浏览器环境，module字段用于node环境，如果都不存在，则使用jsnext字段。



### resolve.extensions

类型：`string[]`，默认`['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']`，导入时想要省略扩展名列表。注意，不建议忽略自定义导入类型的扩展名（比如：`.vue`）,因为它会影响IDE和类型支持


### resolve.preserveSymlinks

类型：`boolean`，默认`false`，是否保留软链。如果设置为true，软链将会被保留，否则软链将会被忽略。软链是指在文件系统中存在指向另一个文件的链接。软链在构建时会被忽略，但在开发时会被保留。

举个例子，假设你正在开发两个不同的项目：Project A 和 Project B，它们都位于本地文件系统中。你希望在 Project A 中使用 Project B 的最新代码，并且你希望 Project A 通过符号链接引用 Project B，以便在 Project A 中对 Project B 进行更改并即时查看效果。

注意，大多数情况下，你可能不需要设置 resolve.preserveSymlinks，因为默认行为通常是符合预期的。只有在你明确需要保留符号链接的原始路径时，才需要设置此选项。



## css.modules 


```typescript
interface CSSModulesOptions {
  scopeBehaviour?: 'global' | 'local'
  globalModulePaths?: RegExp[]
  generateScopedName?:
    | string
    | ((name: string, filename: string, css: string) => string)
  hashPrefix?: string
  /**
   * 默认：null
   */
  localsConvention?:
    | 'camelCase'
    | 'camelCaseOnly'
    | 'dashes'
    | 'dashesOnly'
    | null
}
```

配置 CSS modules 的行为。选项将被传递给 postcss-modules。

当使用 Lightning CSS 时，该选项不会产生任何效果。如果要启用该选项，则应该使用 css.lightningcss.cssModules 来替代。

### css.postcss

类型：`string | (postcss.ProcessOptions & { plugins?: postcss.AcceptedPlugin[] })`

内联的 PostCSS 配置（格式同 postcss.config.js），或者一个（默认基于项目根目录的）自定义的 PostCSS 配置路径。

对内联的 POSTCSS 配置，它期望接收与 postcss.config.js 一致的格式。但对于 plugins 属性有些特别，只接收使用 数组格式。

搜索是使用 postcss-load-config 完成的，只有被支持的文件名才会被加载。

注意：如果提供了该内联配置，Vite 将不会搜索其他 PostCSS 配置源。 建议使用postcss.config.js

## css.preprocessorOptions

类型：`Record<string, object>`

指定传递给 CSS 预处理器的选项。文件扩展名用作选项的键。每个预处理器支持的选项可以在它们各自的文档中找到：

- sass/scss - [选项](https://sass-lang.com/documentation/js-api/interfaces/legacystringoptions/)。
- less - [选项](https://lesscss.org/usage/#less-options)。
- styl/stylus - 仅支持 [define](https://stylus-lang.com/docs/js.html#define-name-node)，可以作为对象传递。

```typescript
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`,
      },
      less: {
        math: 'parens-division',
      },
      styl: {
        define: {
          $specialColor: new stylus.nodes.RGBA(51, 197, 255, 1),
        },
      },
    },
  },
})
```

## json

### json.namedExports

类型：`boolean`，默认`true`，是否将 JSON 文件中的命名导出作为模块的默认导出。

### json.stringify

类型：`boolean`，默认`false`，若设置为 true，导入的 JSON 会被转换为 export default JSON.parse("...")，这样会比转译成对象字面量性能更好，尤其是当 JSON 文件较大的时候。


## esbuild

这个里面就是传入esbuild配置

```typescript
interface ESBuildOptions extends esbuild.BuildOptions {
  include?: string | string[]
  exclude?: string | string[]
  jsxFactory?: string
  jsxFragment?: string
  jsxInject?: string
}
```

ESBuildOptions 继承自 esbuild 转换选项。最常见的用例是自定义 JSX

```typescript
export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})
```

默认情况下，esbuild 会被应用在 ts、jsx、tsx 文件。你可以通过 esbuild.include 和 esbuild.exclude 对要处理的文件类型进行配置，这两个配置的值可以是一个正则表达式、一个 picomatch 模式，或是一个值为这两种类型的数组。

此外，你还可以通过 esbuild.jsxInject 来自动为每一个被 esbuild 转换的文件注入 JSX helper。

```typescript
export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
})
```

当 build.minify 为 true 时，所有最小化的优化过程都会被默认应用，要禁用它的 某些特定方面，请设置 esbuild.minifyIdentifiers、esbuild.minifySyntax 或 esbuild.minifyWhitespace 三种选项其中任意一种为 false。注意 esbuild.minify 选项无法用于覆盖 build.minify。

设置为 false 来禁用 esbuild 转换。

## assetsInclude

类型：`string | RegExp | (string | RegExp)[]`，默认`[]`，指定其他文件类型作为静态资源处理，因此：

- 当从HTML引用它们或直接通过fetch请求时，它们将被插件转换管道排除在外
- 从JS导入它们将返回解析后的url字符串

```typescript
export default defineConfig({
  assetsInclude: ['**/*.gltf'],
})
```

