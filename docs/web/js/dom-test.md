# dom 面试题

## 如何计算动画帧

可以借助[requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame),当准备调用方法时，浏览器将会在下一次重绘之前调用你传入给该方法的动画函数（回调函数），回调函数执行次数通常是每秒60次，但在大多数遵循W3C建议浏览器中，回调函数执行次数通常与浏览器屏幕刷新次数相匹配。如果运行在后台或者隐藏在iframe里时，会暂停调用。

> `requestAnimationFrame(callback)`

返回long整数，请求ID, 回调列表中唯一的标识。是个非零值window.cancelAnimationFrame() 以取消回调函数请求。

```javascript
// 求当前浏览器屏幕的fps

```


