---
title: 事件冒泡与事件捕获
date: 2019/01/09
tag: [js, event]
---

### 关于事件捕获和事件冒泡的理解
javascript 的事件捕获和事件冒泡之前一直没能弄明白，知道看到一个例子。
利用丢一颗石头入水的例子，就能够非常形象的解释了。

<img src="http://zhoushirong.github.io/img/event.png" alt="池塘入水" width="600" height="400">
![图片]()

事件捕获和事件冒泡就像是一颗石子投入水中：
首先是水的最外层捕获石头，然后是内层捕获石头，直到最里面。
当石头落底之后
然后是冒泡阶段，由最内层产生气泡，然后由内而外，不断冒泡，直到最外面。

element.addEventListener(event, function, useCapture)
useCapture: false (默认 false)，为 true 的时候表示在事件捕获阶段调用处理函数，否则在事件冒泡阶段处理函数。


事件代理：
在父节点绑定事件，当事件开始捕获或者冒泡的时候一定会到达父节点，然后通过 e.target 判断触发事件的元素。

event.preventDefault() 阻止事件默认动作
event.stopPropagation() 阻止捕获和冒泡阶段中事件的进一步传播
event.type 返回事件类型

event.target 引起触发事件的元素
event.currentTarget 事件绑定的元素


