---
title: 事件冒泡与事件捕获
date: 2019/01/09
tag: [js, event, 事件冒泡, 事件捕获]
---

### 关于事件捕获和事件冒泡的理解
javascript 的事件捕获和事件冒泡之前一直没能弄明白，知道看到一个例子。
利用丢一颗石头入水的例子，就能够非常形象了，如图所示：

<img src="http://zhoushirong.github.io/img/event.png" alt="池塘入水" width="300" height="200">

事件捕获和事件冒泡就像是一颗石头(点击事件)投入水中：
首先是最外层水面(html)接触(捕获)石头，然后石头下沉，内层的水(body/dom 父节点)捕获石头，直到池塘底部(目标节点)。
当石头到达池塘底部(事件被捕获)之后，产生了一个气泡，然后就开始了冒泡阶段
由底部（目标元素）产生的气泡，由内而外，不断向上冒泡，直到最外面（html标签）结束。


好吧，我知道画的有点丑，但是不可否认，确实挺形象的。
如果还是有些迷糊，那么可以再看一下下面这张图。(点击可查看示例)

<a href="https://www.epoos.com/demo/event/index.html" target="_blank">
  <img src="http://zhoushirong.github.io/img/event2.png" alt="DOM 冒泡" width="300" height="200">
</a>

自己试一试便清楚了。

### 处理事件
理解了事件的捕获和冒泡机制，对于处理事件就好办了。

**监听事件**
```javascript
/**
 * @param { event } 事件
 * @param { functionEvent } 事件处理函数
 * @param { capture } 是否在捕获阶段触发事件
 **/
element.addEventListener(event, functionEvent, useCapture)
```
事件和事件处理函数很好理解。
capture 表示是否在捕获阶段处理函数
ps：默认为 false，表示在冒泡阶段处理函数，ie 低版本浏览器不支持在捕获阶段处理函数。

**阻止默认事件**
```javascript
event.preventDefault()  // 阻止事件默认动作，比如阻止 submit 按钮默认提交
event.stopPropagation() // 阻止捕获 和 冒泡阶段中事件的进一步传播，比如是在‘石头’下沉或者‘气泡’冒泡的过程中使之突然消失
```

**事件代理：**
从上面事件机制可以看出，如果没有外部干扰，在子节点上触发的事件，在捕获和冒泡最终都会经过父节点
因此，我们可以将事件处理函数绑定在父节点上面

这样做的好处一个是可以不关心子元素是同步还是异步的
另一个是如果有多个子元素，可以不用绑定多个事件（在异步列表 click 事件中很常见）。
```html
<ul id="ulId">
  <li>list1</li>
  <li>list2</li>
  <li>list3</li>
</ul>
```
```javascript
document.getElementById('ulId').addEventListener('click', function(e) {
  var innerHTML = e.target.innerHTML // e.target 表示触发事件的元素（石头）
  if(innerHTML === 'list1') {
    console.log(1)
  } else {
    console.log(0)
  }
}, false)
```

