# Express

Express是一个快速，简单，极简的Node web应用开发框架。通过它，可以轻松构建各种web应用。

Express本身是极简的，仅仅提供web开发的基础功能，但是它通过中间件的方式集成了许多的外部插件来处理HTTP请求。

express内置中间件：

- express.json() 解析Content-type为
- express.urlencoded()  解析Content-Type为application/x-www-form-urlencoded格式的请求体
- express.raw() 解析Content-Type为application/octet-stream格式的请求提
- express.text() 解析Content-Type为text/plain格式的请求体
- express.static() 托管静态资源文件

[第三方中间件](http://expressjs.com/en/resources/middleware.html)：

- body-parse 解析HTTP post请求体
- compression 压缩HTTP响应
- cookie-parse 解析cookie数据
- cors 处理跨域资源请求
- morgan http请求日志记录
- url 解析链接
- mime 识别静态文件类型
- dateformat 格式化时间


## 使用

```javascript
// pnpm init -y
// pnpm i express

const app = require('express')

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(8080, () => {
  console.log('启动成功')
})
```

## 基础路由

路由用于确定应用程序如何响应对特定端点的客户机请求，包含一个 URI（或路径）和一个特定的 HTTP 请求方法（GET、POST 等）。

每个路由可以具有一个或多个处理程序函数，这些函数在路由匹配时执行。

路由定义结构：`app.METHOD(PATH, HANDLER)`

[4.x api](https://expressjs.com/en/4x/api.html#res)

```javascript
// 匹配跟路由 get 响应
app.get('/', function (req, res) {
  res.send('Hello World!');
});
// 匹配跟路由 post响应
app.post('/', function (req, res) {
  res.send('Got a POST request');
});
// 匹配 /user put响应
app.put('/user', function (req, res) {
  res.send('Got a PUT request at /user');
});
// 匹配/user delete响应
app.delete('/user', function (req, res) {
  res.send('Got a DELETE request at /user');
});
```

Express应用使用路由回调函数的参数：request和response对象来处理请求和响应数据。

Express不对node已有的特性进行二次封装，只是在它之上扩展了web应用所需的基本功能。

内部使用的还是http模块，请求对象继承自http.IncomingMessage，响应对象继承http.ServerResponse

## 中间件

中间件函数能够访问请求对象 (req)、响应对象 (res) 以及应用程序的请求/响应循环中的下一个中间件函数。下一个中间件函数通常由名为 next 的变量来表示。

中间件函数可以执行以下任务：

- 执行任何代码
- 对请求和响应对象进行修改
- 结束请求、响应循环
- 调用堆栈中的下一个中间件

如果当前中间件函数没有结束请求/响应循环，那么它必须调用 next()，以将控制权传递给下一个中间件函数。否则，请求将保持挂起状态。

### 应用中间件

```javascript
// 关心请求路径
const express = require('express');
const app = express()

app.use((req, res, next) => {
  console.lg(Date.now())
  next()
})

// 限定请求路径
app.use('/user/:id', (req, res, next) => {
  console.log('Request type', req.method);
  next()  
})

// 限定请求方法 + 请求路径
app.get('/user/:id', (req, res, next) => {
  res.send('user')
})

// 多个处理函数
app.use('/user/:id', (req, res, next) => {
  next()
})

// 处理多个函数 下面同样适用 app.get, app.post
app.use('/user/:id', (req, res, next) => {
  console.log('处理请求路径')
  next()
}, (req, res, next) => {
  console.log('处理请求方法')
  next('route') // 跳过后面的中间件 
}, (req, res, next) => {
  console.log('这个不会执行，被上面next("route")了， 会执行下一个app.xxx')
})
```

### 路由中间件

```javascript
const express = require('express');

// 创建路由实例
const router = express.Router()

router.get('/foo',async ( req, res) => {
  try {
      const db = await getDB()
      res.status(200).json(db.todos)
  } catch(err) {
    // next() 下一个中间件
    // next('route') // 匹配下一个中间件
    next(err) // 其他内容直接进入错误
  }
})

module.exports = router
```

```javascript
const express = require('express')
const router = require('./router/index')

const app = express()

// 配置路由
app.use(express.json())
// 解析表单请求提
app.use(express.urlencoded())

// app.use(router) 
// 默认给路由添加前缀
app.use('/bbc', router)

// 处理404内容 上面的路由都没有匹配到就是404
app.use((req, res, next) => {
  res.status(404).send('404 Not Found')
})
// 全局错误处理
app.use((err, req, res, next) => {
  res.status(500).send(err.message)
})

app.listen(3000)
```




