# esbuild

esbuild使用go语言开发，用来打包工程项目。没有配置文件，使用命令行参数来配置。如果使用配置文件也是执行js api进行打包。

注意：不要使用esbuild去编译成es5语法的代码，因为esbuild默认是es6语法。

## 安装

安装：`pnpm i esbuild -D`

## 基本使用

```bash
esbuild src/index.js --bundle --outfile=dist/bundle.js
```

- `--bundle`：打包成一个文件, 也会默认启用tree-sharking，没有这个参数就是编译成一个模块。
- `--target`：指定输出环境，默认是es2015，可以指定es2018，es2019，es2020，esnext
- `--format`：指定输出格式，默认是iife，可以指定amd，cjs，esm，iife，umd
- `--minify`：压缩代码
- `--sourcemap`：生成sourcemap
- `--outdir`：指定输出目录
- `--outfile`：指定输出文件名
- `--platform`：指定目标平台，默认是浏览器参数是browser，node的平台参数就是node
- `--watch`：监听模式，当文件发生变化时重新编译
- `--external`：指定外部依赖，可以指定多个，用逗号分隔
- `--loader`：指定加载器，可以指定多个，用逗号分隔
  - `--loader:.png=dataurl`：指定png文件使用base64编码
  - `--loader:.jpg=file`：指定jpg文件使用file编码
- `--target`：指定目标环境，默认是浏览器，可以指定node
- `--tsconfig`：指定tsconfig.json文件路径
- `--define`：定义全局变量，可以指定多个，用逗号分隔。例如：`--define:TEST=1,TEST2=2`,然后在代码中直接使用`TEST`和`TEST2`
- `--jsx-factory`：指定jsx factory函数，默认是React.createElement.也可以指定 `--jsx-factory=h`

## 插件开发

esbuild支持插件，插件是esbuild的扩展，可以用来做很多事情，由于esbuild是使用go语言写的，所以编写插件有两种方式：

1. 编写go语言插件，然后通过`--loader=go-plugin`加载
2. 编写js语言插件，然后通过`--loader=js-plugin`加载

### 编写go语言插件

编写一个go语言插件，需要实现`github.com/evanw/esbuild/pkg/api.Plugin`接口，然后通过`--loader=go-plugin`加载

```go
package main

import "encoding/json"
import "os"
import "strings"
import "github.com/evanw/esbuild/pkg/api"

var envPlugin = api.Plugin{
  Name: "env",
  Setup: func(build api.PluginBuild) {
    // Intercept import paths called "env" so esbuild doesn't attempt
    // to map them to a file system location. Tag them with the "env-ns"
    // namespace to reserve them for this plugin.
    build.OnResolve(api.OnResolveOptions{Filter: `^env$`},
      func(args api.OnResolveArgs) (api.OnResolveResult, error) {
        return api.OnResolveResult{
          Path:      args.Path,
          Namespace: "env-ns",
        }, nil
      })

    // Load paths tagged with the "env-ns" namespace and behave as if
    // they point to a JSON file containing the environment variables.
    build.OnLoad(api.OnLoadOptions{Filter: `.*`, Namespace: "env-ns"},
      func(args api.OnLoadArgs) (api.OnLoadResult, error) {
        mappings := make(map[string]string)
        for _, item := range os.Environ() {
          if equals := strings.IndexByte(item, '='); equals != -1 {
            mappings[item[:equals]] = item[equals+1:]
          }
        }
        bytes, err := json.Marshal(mappings)
        if err != nil {
          return api.OnLoadResult{}, err
        }
        contents := string(bytes)
        return api.OnLoadResult{
          Contents: &contents,
          Loader:   api.LoaderJSON,
        }, nil
      })
  },
}

func main() {
  result := api.Build(api.BuildOptions{
    EntryPoints: []string{"app.js"},
    Bundle:      true,
    Outfile:     "out.js",
    Plugins:     []api.Plugin{envPlugin},
    Write:       true,
  })

  if len(result.Errors) > 0 {
    os.Exit(1)
  }
}
```

```javascript
import * as esbuild from 'esbuild'

let envPlugin = {
  name: 'env',
  setup(build) {
    // Intercept import paths called "env" so esbuild doesn't attempt
    // to map them to a file system location. Tag them with the "env-ns"
    // namespace to reserve them for this plugin.
    build.onResolve({ filter: /^env$/ }, args => ({
      path: args.path,
      namespace: 'env-ns',
    }))

    // Load paths tagged with the "env-ns" namespace and behave as if
    // they point to a JSON file containing the environment variables.
    build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => ({
      contents: JSON.stringify(process.env),
      loader: 'json',
    }))
  },
}

await esbuild.build({
  entryPoints: ['app.js'],
  bundle: true,
  outfile: 'out.js',
  plugins: [envPlugin],
})
```
