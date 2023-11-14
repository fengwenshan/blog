# build构建

build配置基本和rollup配置一致，不同的是build配置的入口和出口，build配置的入口是src目录下的index.ts，出口是dist目录下的index.js。

## build.target

类型：`string | string[]`,默认值为'modules',

可选值：'es2015', 'es2016', 'es2017', 'es2018', 'es2019', 'es2020', 'esnext', 'chrome87', 'firefox78','safari14', 'edge88', 'node12','modules' 指定最终构建的目标。

用于指定构建的目标环境，默认情况下，Vite会假设代码在最新浏览器上运行，并使用es modules进行导入。但是，如果希望打包的代码在旧浏览器上运行，可以设置这个选项指定目标环境

```typescript
export default defineConfig({
  build: {
    target: ['es2015 /*IE 11*/', 'edge88', 'firefox78', 'chrome87','safari14']
  }
})
```

该选项只会影响代码的语法编译，不会更改代码的功能和结构。如果需要针对不同环境提供不同功能，可以使用条件编译或其他技术。该选项只会在构建时生效，不会影响开发过程中。

注意：如果代码包含不能被 esbuild 安全地编译的特性，那么构建将会失败。

### build.modulePreload

类型： `boolean | { polyfill?: boolean, resolveDependencies?: ResolveModulePreloadDependenciesFn }`, 默认值：`{ polyfill: true }` 用于指定模块预加载行为

默认情况下，一个 模块预加载 polyfill 会被自动注入。该 polyfill 会自动注入到每个 index.html 入口的的代理模块中。如果构建通过 build.rollupOptions.input 被配置为了使用非 HTML 入口的形式，那么必须要在你的自定义入口中手动引入该`import 'vite/modulepreload-polyfill'`

此 polyfill 可以通过 { polyfill: false } 来禁用。

在开发模式下vite自动启用模块预加载，以便浏览器中快速地进行调试和测试，此外，该选项还会影响代码分隔和懒加载行为。如果禁用了模块预加载，那么懒加载和代码分隔将会被禁用。

如果需要自定义模块预加载行为，可以通过 { resolveDependencies } 选项来实现。该选项接收一个函数，该函数接收一个模块路径，返回一个模块路径数组。

```typescript
export default defineConfig({
  build: {
    modulePreload: {
      polyfill: false,
      resolveDependencies: (filename, deps, { hostId, hostType }) => {
        if (filename.startsWith('my-custom-module')) {
        }
      }
    }
  }
})
```

`resolveDependencies` 函数将为每个动态导入调用，同时带着一个它所依赖的 chunk 列表。并且它还会为每个在入口 HTML 文件中导入的 chunk 调用。 可以返回一个新的依赖关系数组，可能被过滤后变少了，也可能有更多依赖注入进来了，同时它们的路径也被修改过。deps 路径是相对于 build.outDir 的。若在注入该模块到 HTML head 时使用 new URL(dep, import.meta.url) 获取绝对路径，则对于 hostType === 'js'，允许返回一个相对于 hostId 的路径。

解析得到的依赖路径可以再在之后使用 `experimental.renderBuiltUrl` 更改。

### build.outDir

指定构建输出目录，类型string, 默认值'dist'

### build.assetsDir

指定静态资源输出目录，类型string, 默认值'dist'

### build.assetsInlineLimit

类型：`number`, 默认值：`4096`

指定静态资源内联的最大字节数，超过该值将会被内联到外部文件中。小于该值的导入或引用资源将内联为base64编码，以避免额外的http请求。设置0完全禁用该选项。

### build.cssCodeSplit

类型：`boolean`, 默认值：`true`

是否将 CSS 代码拆分为单独的文件。当启用时，在异步chunk中导入的css将内联到异步chunk本身，并在其被加载时一并获取。如果禁用项目整个css将被提取到一个css文件中。

如果制定了build.lib，那么该选项默认为false

### build.lib

类型： `{ entry: string | string[] | { [entryAlias: string]: string }, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string | ((format: ModuleFormat, entryName: string) => string) }`

构建库。entry必须的，因为库不能以html作为入口。name则是暴露全局变量，并且在formats包含`umd`或`iife`，默认`formats`是`['es','umd']`,如果使用多个配置入口，则是`['es','cjs']`。

filename是输出的包文件名，默认filename是package.json的name选项。同时还可以被定义为参数为`format`和entryAlias`的函数



### build.cssTarget

类型：`string | string[]`, 默认值：`['modules']`, 可以参考build.target

指定最终构建的目标环境，默认情况下，Vite会假设代码在最新浏览器上运行，并使用es modules进行导入。但是，如果希望打包的代码在旧浏览器上运行，可以设置这个选项指定目标环境

```typescript
export default defineConfig({
  build: {
    cssTarget: []
  }
})
```

### build.minify

类型：`boolean | 'esbuild' | 'terser' | 'terser-terserOptions' | 'terser-minifyOptions'`, 默认值：`true`

是否压缩代码，默认会压缩代码，如果设置为false，则不会压缩代码。

如果指定为false，则可以指定minifyOptions来进行压缩配置。

```typescript
export default defineConfig({
  build: {
    minify: {
      terserOptions: {
      }
    }
  }
})

```


### build.cssMinify

类型：`boolean | 'esbuild'| 'lightningcss'`, 默认值：`true`

是否压缩css代码，默认使用`build.minify`，如果设置为false就可以不压缩css,该选项还可以接受一个对象作为参数，用于定制css与js压缩行为

```typescript
// 启用 JavaScript 和 CSS 压缩
export default defineConfig({
  build: {
    minify: {
      js: true,
      css: true
    }
  }
})

// 使用 Esbuild 进行 JavaScript 压缩，但禁用 CSS 压缩
export default defineConfig({
  build: {
    minify: {
      js: 'esbuild',
      css: false
    }
  }
})

// 使用 Terser 进行 JavaScript 压缩，但禁用 CSS 压缩
export default defineConfig({
  build: {
    minify: {
      js: 'terser',
      css: false
    }
  }
})

//  Lightning CSS 进行 CSS 压缩
import { createLightningCSSPlugin } from '@zeit/lightning-css-plugin'
export default defineConfig({
  build: {
    extendPlugins: [createLightningCSSPlugin()],
    minify: {
      css: 'lightningcss'
    }
  }
})

// 自定义css压缩
import { createLightningCSSPlugin } from '@zeit/lightning-css-plugin'
export default defineConfig({
  build: {
    extendPlugins: [createLightningCSSPlugin()],
    minify: {
      css: {
        // 自定义css压缩
        minify: (data) => {
          return data
        },
        // 自定义css压缩后输出
        output: (data) => {
          return data
        }
      }
    }
  }
})

// 使用 terser 进行 JavaScript 压缩
import { terser } from 'rollup-plugin-terser'

export default defineConfig({
  build: {
    extendPlugins: [terser()],
    minify: {
      js: 'terser'
    }
  }
})

```


### build.terserOptions

类型：`TerserOptions`

用于配置 Terser 压缩行为。自定义底层的 Terser 压缩配置。这与从 Rollup 配置文件导出的选项相同，并将与 Vite 的内部 Rollup 选项合并。



### build.sourcemap

类型： boolean | 'inline' | 'hidden'， 默认值： `false`， 是否生成 sourcemap 文件，默认不生成。

- 如果设置为 true，则会生成带有.map 文件的 js 文件，并将其嵌入到生成的 js 文件中。
- 如果设置为 'inline'，则会将 sourcemap 内联到 js 文件中，并使用 data:application/json;base64 格式的 sourcemap。
- 如果设置为 'hidden'，则不会生成 sourcemap 文件，但是会保留 sourcemap 注释，以便调试。

### build.rollupOptions

类型：`RollupOptions`

用于配置 Rollup 打包行为。自定义底层的 Rollup 打包配置。这与从 Rollup 配置文件导出的选项相同，并将与 Vite 的内部 Rollup 选项合并。

### build.commonjsOptions

类型：`CommonJSOptions`

用于配置 CommonJS 打包行为。自定义底层的 CommonJS 打包配置。这与从 Rollup 配置文件导出的选项相同，并将与 Vite 的内部 Rollup 选项合并。

传递给 @rollup/plugin-commonjs 插件的选项。

### build.dynamicImportVarsOptions

类型：`RollupDynamicImportVarsOptions` 动态导入，传递给 @rollup/plugin-dynamic-import-vars 的选项。

用于配置动态导入变量的行为。自定义底层的 Rollup 打包配置。这与从 Rollup 配置文件导出的选项相同，并将与 Vite 的内部 Rollup 选项合并。

### build.browserslist

类型：`string[]`

指定浏览器兼容列表，默认值：`['defaults']`

### build.polyfillModulePreload

类型：`boolean`, 默认值：`true`

是否自动添加预加载模块，默认会添加。

### build.rollupInputOptions

类型：`RollupInputOptions`

用于配置 Rollup 打包行为。自定义底层的 Rollup 打包配置。这与从 Rollup 配置文件导出的选项相同，并将与 Vite 的内部 Rollup 选项合并。

### build.rollupOutputOptions

类型：`RollupOutputOptions`

用于配置 Rollup 打包行为。自定义底层的 Rollup 打包配置。这与从 Rollup 配置文件导出的选项相同，并将与 Vite 的内部 Rollup 选项合并。

### build.write

类型：`boolean`, 默认值：`true`

是否将打包后的文件写入磁盘。false禁用构建后的文件写入磁盘。这用于编程式调用build()在写入磁盘之前，需要对构建后的文件进行进一步处理

### build.emptyOutDir

类型：`boolean`, 默认值：`false`，若outDir在root目录下，则默认值为true

是否在构建前清空输出目录。

### build.copyPublicDir

类型：`boolean`, 默认值：`false`

是否将 public 目录中的文件复制到输出目录中。


### build.reportCompressedSize

类型：`boolean`, 默认值：`false`

启用/禁用 gzip 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。

### build.chunkSizeWarningLimit

类型：`number`, 默认值：`500`

当超过此限制时，Vite 会发出警告。

### build.watch

类型：`WatcherOptions| null`, 默认值：`null`, 设置为`{}`则会启用rollup的监听器，对于构建阶段或集成流程是用的插件很有用

是否启用监听模式，默认不启用。





