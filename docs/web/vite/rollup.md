# rollup

## 配置文件

```js
// rollup.config.js
// 解析node_modules中的模块
import resolve from 'rollup-plugin-node-resolve';
// 解析commonjs模块,比如react就需要这个插件
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
// 解析json文件
import json from 'rollup-plugin-json'
// 压缩js代码
import terser from 'rollup-plugin-terser';

const mode = process.env.MODE;

const isDev = mode === 'local';

// 也可以export default数组 [{},{}]
export default {
  input:'src/main.js',
  // output 配置也可以是数组
  output: {
    file: 'dist/bundle.js',
    format: isDev ? 'es' : 'umd',
    // 这个plugins触发时间在编译完代码之后
    plugins: [ terser() ],
    // 在打包之前在文件顶行插入注释
    banner: '版权所有，翻版必究',
  },
  // 排除某些包不需要打包进入文件
  external: ['react'],
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    isDev? {} : uglify(),
    json()
  ]
}
export default [
  {
    input:'src/main.js',
    output: {
      file: 'dist/bundle.js',
      format: isDev? 'es' : 'umd',
    }
  },
  {
    input:'src/main.js',
    output: {
      file: 'dist/bundle.es5.js',
      format: 'es',
    }
  }
]
```

## 打包

```bash
rollup -c rollup.config.js
```


## rollup插件

[文档](https://github.com/rollup/plugins)

rollup插件的基本api包含以下部分：

- options(options) 该方法允许插件修改它的配置，可以通过传入一个对象来提供额外的配置信息。通常该插件初始化时调用
- transform(code, filePath) 该方法允许插件修改输入的源代码，可以通过传入一个函数来实现代码的修改。在每个文件被编译前都会调用此方法，插件可以选择返回一个新的代码片段来替代原始的代码。
- generateBundle(outputOptions, bundle, isWrite) 该方法在输出阶段调用，允许插件修改输出文件的内容。输出文件通常由输入模块和它们之间的关系组成，通过 bundle 对象表示。该函数接收两个参数，第一个参数是输出文件的配置，第二个参数是输出文件组成的对象。
- buildStart(inputOptions) 该方法在开始编译之前调用，允许插件执行一些准备工作，比如读取外部数据、生成文件等。
- buildEnd(error) 该方法在编译结束后调用，允许插件执行一些清理工作，比如删除文件等。
- watchChange(id) 该方法在文件发生变化时调用，插件可以在这里做出响应，例如清理缓存或重新生成输出文件。


创建一个Rollup插件的过程如下：

- 导入Rollup插件构造器`rollup.Plugin`
- 创建一个类，继承自`rollup.Plugin`
- 在类中定义一个apply方法，该方法用于添加插件到Rollup构造函数中
- 定义所需的插件方法（transform或buildStart），并将它们添加到this上
- 使用Rollup的createConfig函数创建配置对象，并将插件传递给plugins参数

rollup的插件有的是有执行顺序的。

## alias 别名


## babel 转码


## commonjs 转换


## server 服务器



## 常用插件

- @rollup/plugin-commonjs：将CommonJS模块转换为 ES2015 供 Rollup 处理
- @rollup/plugin-babel：将 ES2015 转换为 ES5
- @rollup/plugin-node-resolve：将导入的模块解析为本地文件路径
- @rollup/plugin-typescript 将ts转成js
- @rollup/plugin-replace ：替换字符串
- @rollup/plugin-node-resolve ：将导入的模块解析为本地文件路径
- @rollup/plugin-eslint ：eslint 插件
- @rollup/plugin-image ：将图片转换为 base64
- @rollup/plugin-strip 删除调试器语句和assert等函数。从代码中删除Equal和console.log
