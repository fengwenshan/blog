# 动画与图形

## requestAnimationFrame

早期web浏览器实现动画使用setInterval 与 setTimeout实现，基本上使用setInterval来控制动画执行，这种定时动画的问题在于无法准确知晓循环之间的延时。定时时间足够短才能让动画流畅，非高刷显示器一般都是60帧，也就是每秒需要重绘60次，大多数浏览器会限制重绘频率不超过屏幕刷新率，因为超过刷新率用户也感知不到。理论而言1000ms/60=16.67ms，这样的速度重绘可以实现最平滑的动画。

虽然使用setInterval的定时动画比使用多个setTimeout实现循环效率更高，但也不是没有问题。无论setInterval还是setTimeout都是不能保证时间精度的。第二个参数的延时只能保证何时会把代码添加到浏览器任务队列，不能保证添加到队列立即执行。

前面的方法都是根据时间，然后加入任务队列中，等待前面任务执行完毕后再执行，这种方式并不能保证动画的连贯性，如果使用帧率去控制动画，那么动画就可以做到平滑。随着canvas的流行那么setInterval和setTimeout精度不准的问题也被放大了。

Mozilla的Robert O'Callahan一直在思考这个问题，并提出一个独特的方案。他指出浏览器知道css过渡和动画应该什么时候开始，并根据此计算出正确的时间间隔，到时间就去刷新用户界面，但是对于js动画浏览器并不知道动画什么时候执行，他给出的方案是创造一个名为mozRequestAnimationFrame的API，告诉浏览器希望之星一个动画，并且要求浏览器在下次重绘之前调用指定回调函数更新动画（可以理解为hooks），该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。目前所有浏览器都支持不带有前缀的这个方法requestAnimationFrame。

为了实现动画循环，可以把多个requestAnimationFrame调用放在一个循环中，每一次循环都调用一次requestAnimationFrame调用串联起来，就像以前使用setTimeout()时一样。所以requestAnimationFrame是一次性的。

```javascript
let count = 0
const start = Date.now()
function animation() {
  window.requestAnimationFrame(() => {
    count++
    console.log(count)
    const end =  Date.now()
    if(start + 1000 <= end) {
      console.log(start, 'end', end)
    } else {
      animation()
    }
  })
}
animation()
```


与setTimeout类似，requestAnimationFrame也返回一个请求id,可以用于通过另外一个方法cancelAnimationFrame来取消重绘任务。

```javascript
const requestId = window.requestAnimationFrame(() => {
    console.log('requestAnimationFrame')
})
window.cancelAnimationFrame(requestId)
```

支持requestAnimationFrame的浏览器实际上会暴露出作为钩子的回调队列。这个钩子触发时机就是浏览器在执行下一次重绘之前的一个点。这个回调队列是一个可修改的函数列表，包含应该在重绘之前调用的函数。每次调用都会在队列上推入一个回调函数，队列的长度没有限制。

通过requestAnimationFrame递归地向队列中加入回调函数，可以保证每次重绘最多只调用一次回调函数。这也是一个非常好的节流工具，在频繁执行影响页面外观的代码时，可以利用这个回调队列进行节流（比如滚动事件）

```javascript
let i = 0
document.addEventListener('scroll', function() {
  console.log(++i)
})
// 这种不会过滤调用每次重绘的多余调用, 触发次数和上面一样
let j = 0
document.addEventListener('scroll', function() {
  requestAnimationFrame(() => {
    console.log(++j)
  })
})
// 定义一个标记变量，由回调设置其开关, 将多余的调度屏蔽
let k = 0
let enabled = true
window.addEventListener('scroll', function() {
  if(enabled) {
    enabled = false
    requestAnimationFrame(() => {
      console.log(++k)
      enabled = true
    })
  }
})
// 因为重绘是非常频繁的操作，所以上面3个例子代码都一样，更好地限制是通过定时器来限制频繁的操作
// 这样定时器限制实际的操作执行间隔，而requestAnimationFrame控制在浏览器的哪个渲染周期中执行
let l = 0
let flag = true
window.addEventListener('scroll', function() {
  console.log('first', k)
  if(flag) {
    flag = false
    requestAnimationFrame(() => {
      console.log(++l)
    })
    // 放在上面也行，触发要慢一点，慢的速度就是requestAnimationFrame的执行时机 + 一些时间
    setTimeout(() => flag = true, 50)
  }
})
```


## canvas

html5添加canvas元素，在创建的时候需要设置width和height属性，用于高速浏览器在多大面积上绘图，在标签之间的内容是后备数据，会在浏览器不支持canvas元素时显示。要在画布上绘制图形，首先需要取得绘图上下文。使用getContext()方法可以获取对绘图上下文的引用，对于平面2d图形，传递参数`2d`,表示要获取2d上下文。

2d绘图上下文提供绘制2d图形的方法，包括弧形、矩形、路径。2d上下文的坐标使用是直角坐标系第四象限。

2d上下文有两个基本操作：填充（fillStyle）和描边（strokeStyle）,这两个属性可以是字符串、渐变对象、图案对象，默认值都为`#000000`。字符串表示颜色值，可以是css支持任何格式：名称、十六进制、rgba、hsl或hsla。比如：

### 绘制矩形

2d上下文绘制，矩形是唯一一个可以在2d绘图上下文中绘制的形状，与绘制矩形的相关的方法有3个：fillRect()、strokeRect()和clearRect()。



```html
<canvas id="drawing" width="1000" height="1000"></canvas>
<script>
  const drawing = document.querySelector('#drawing');
  // 判断是否支持
  if(drawing.getContext) {
    // 2d绘图上下文提供绘制2d图形的方法，包括弧形、矩形、路径
    const ctx = drawing.getContext('2d');
    // 填充
    ctx.fillStyle = '#0000ff';
    // 填充矩形 (开始坐标x, 结束坐标y, 矩形宽度, 矩形高度)
    ctx.fillRect(100, 100, 100, 100);
    // 描边
    ctx.strokeStyle = 'red';
    // 描边宽度
    ctx.lineWidth = 10;
     // 描边填充 (开始坐标x, 结束坐标y, 矩形宽度, 矩形高度)
    ctx.strokeRect(200, 200, 100, 100);
    
    // 清除画布某个区域矩形 (开始坐标x, 结束坐标y, 矩形宽度, 矩形高度)
    // 在第一个画布上面打个孔
    ctx.clearRect(125, 125, 25, 25);

    // // 转换图片
    // const imgUrl = drawing.toDataURL("image/png"/* MIME 类型*/);
    // // 显示图片
    // const img = document.createElement('img');
    // img.src = imgUrl;
    // document.body.appendChild(img);
  }              
</script>
```



### 绘制路径

2d绘制上下文支持很多在画布上绘制路径的方法。通过路径可以创建复杂的形状和线条。要绘制路径必须先调用beginPath方法表示要开始绘制路径。然后调用下面方法开始绘制：

- beginPath() 清空子路径列表开始一个新路径的方法
- arc(x, y, radius, startAngle, endAngle, counterclockwise) 绘制圆弧
- arcTo(x1, y1, x2, y2, radius) 给定半径radius, 经过两个点(x1, y1)和(x2, y2)绘制圆弧
- lineTo(x, y) 绘制直线
- moveTo(x, y) 移动到指定坐标
- rect(x, y, width, height)
- quadraticCurveTo(cpx, cpy, x, y) 绘制二次贝塞尔曲线
- bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) 绘制三次贝塞尔曲线
- closePath() 关闭路径，然后开始绘制，下一个图形就要调用beginPath方法。

创建后使用fillStyle与fill方法进行填充路径， 也可以使用strokeStyle与stroke方法进行描边路径，还可以使用clip方法基于已有的路径创建一个新裁切区域

```html
<canvas id="drawing" width="1000" height="1000"></canvas>
<script>
  const drawing = document.querySelector('#drawing');
  // 判断是否支持
  if(drawing.getContext) {
    const ctx = drawing.getContext('2d');
    // 1. 先调用beginPath，表示绘制新路径
    ctx.beginPath();
    // arc(圆心x, 圆心y, 半径raduis, 起始角度startAngle, 结束角度endAngle, 是否逆时针counterclockwise)
    // 3点方向是0度
    ctx.arc(50, 50, 30,  -(Math.PI / 3), Math.PI / 6, true);
    // ctx.arc(50, 50, 30,  Math.PI + (Math.PI / 1.5), Math.PI / 6, true);
    
    // 描边宽度
    ctx.lineWidth = 1;
    // // 填充颜色
    // ctx.fillStyle = '#0000ff';
    // 填充当前或已存在的路径方法
    // ctx.fill();
    // 描边填充
    ctx.strokeStyle = '#0000ff';
    // 结束缺口向圆心画一条直线
    ctx.lineTo(50, 50);
    // 关闭路径
    ctx.closePath()
    // 绘制当前或已存在的路径方法
    ctx.stroke();

    // 2. 需要上一次绘制路径前，先关闭路径，下一次绘制先调用beginPath重新开始
    ctx.beginPath();
    ctx.arc(100, 100, 100, 0, Math.PI * 2, true);
    // 绘制内圆, 先更改笔的坐标到圆心 + radius, 可以防止下一笔和上一笔有连线
    ctx.moveTo(150, 100);
    ctx.arc(100, 100, 50, 0, Math.PI * 2, true);

    // 在画一个大圆，开始边的点位置
    ctx.moveTo(400, 400)
    ctx.arc(200, 400, 200, 0, Math.PI * 2, true);
    // 关闭路径
    ctx.closePath()
    ctx.strokeStyle = '#0000ff';
    ctx.stroke();

    // 3.  arcTo mdn 
    ctx.setLineDash([])
    ctx.beginPath();
    ctx.moveTo(150, 20);
    ctx.arcTo(150,100,50,20,30);
    ctx.stroke();

    ctx.fillStyle = 'blue';
    // base point
    ctx.fillRect(150, 20, 10, 10);

    ctx.fillStyle = 'red';
    // control point one
    ctx.fillRect(150, 100, 10, 10);
    // control point two
    ctx.fillRect(50, 20, 10, 10);
    //
    ctx.setLineDash([5,5])
    ctx.moveTo(150, 20);
    ctx.lineTo(150,100);
    ctx.lineTo(50, 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(120,38,30,0,2*Math.PI);
    ctx.stroke();
}
</script>
```

### 绘制文本


## webGL