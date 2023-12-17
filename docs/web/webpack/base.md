# webpack基础

## webpack核心概念

- entry：入口
- output：输出
- module：模块，webpack构建对象
- bundle：输出文件，webpack构建产物
- chunk：中间文件，webpack构建的中间产物
- loader：文件转换器
- plugin：插件，执行特定的任务


## 快速上手


```shell
# 初始化项目
pnpm init 
## 创建src/index.ts、public/index.html, webpack.config.js 文件
.
├── public
│   └── index.html
├── src
│   └── index.ts
└── webpack.config.js

# 安装webpack
pnpm i webpack webpack-cli -D

# build
npx webpack

# dev
npx webpack-dev-server
```


```javascript
// webpack.config.js
module.exports = {
    mode: 'development',
    // 开发环境建议使用source-map，生产环境建议使用none
    devtool: 'source-map',
    enrty: {
        main: './src/index.ts'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
    devServer: {
        contentBase: './dist',
        port: 3000,
        open: true,
        hot: true
    }
}
```

### devtool

[devtool官方地址](https://webpack.docschina.org/configuration/devtool/)

[SourceMapDevToolPlugin](https://webpack.docschina.org/plugins/source-map-dev-tool-plugin)进行更细粒度的配置

控制是否生成与如何生成 source map。开发环境建议使用source-map，生产环境建议使用none。

## loader

loader作用文件转换

### assets.css

### assets.img

### assets.fonts

### assets.json

## plugin

[Plugin list](https://webpack.docschina.org/plugins/)

[Plugins compiler Hook](https://webpack.docschina.org/api/compiler-hooks/)

[Plugins compilation Hook](https://webpack.docschina.org/api/compilation-hooks/)

webpack构建生命周期功能定制问题，webpack本身就是一个构建过程的状态机，其自身的核心功能也是构建在loader和plugin的机制上

 



