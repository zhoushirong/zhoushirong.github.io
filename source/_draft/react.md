---
title: react学习笔记
date: 2021/02/01
tag: [react]
category: 笔记
---

React 是用 Javascript 构建能够快速响应的大型 Web 应用程序的首选方式。

日常使用 App 应用的时候影响‘快速响应’的因素主要有两个：
1.js中含有大量计算，导致设备性能不足，导致卡顿（CPU瓶颈）
2.网络请求响应慢

“时间切片”解决 cpu 瓶颈
解决CPU瓶颈的关键是实现时间切片，而时间切片的关键是：将同步的更新变为 可中断的异步更新。

#### React15
##### Reconciler 协调器作用
调用函数组件、或 class 组件的 render 方法，将返回的 JSX 转化为虚拟DOM
将虚拟DOM和上次更新时的虚拟DOM对比
通过对比找出本次更新中变化的虚拟DOM
通知 Renderer 将变化的虚拟DOM渲染到页面上

##### Renderer 渲染器作用
由于React支持跨平台，所以不同平台有不同的Renderer。我们前端最熟悉的是负责在浏览器环境渲染的Renderer —— ReactDOM
除此之外，还有：
ReactNative 渲染器，渲染App原生组件
ReactTest 渲染器，渲染出纯Js对象用于测试
ReactArt 渲染器，渲染到Canvas, SVG 或 VML (IE8)

在每次更新发生时，Renderer接到Reconciler通知，将变化的组件渲染在当前宿主环境。


#### React16
React16架构可以分为三层：
Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入Reconciler
Reconciler（协调器）—— 负责找出变化的组件
Renderer（渲染器）—— 负责将变化的组件渲染到页面上
可以看到，相较于React15，React16 中新增了 Scheduler （调度器）

Scheduler（调度器）
既然我们以浏览器是否有剩余时间作为任务中断的标准，那么我们需要一种机制，当浏览器有剩余时间时通知我们。
其实部分浏览器已经实现了这个API，这就是requestIdleCallback (opens new window)。但是由于以下因素，React放弃使用：
浏览器兼容性
触发频率不稳定，受很多因素影响。比如当我们的浏览器切换tab后，之前tab注册的requestIdleCallback触发的频率会变得很低

基于以上原因，React实现了功能更完备的 requestIdleCallbackpolyfill，这就是Scheduler。除了在空闲时触发回调的功能外，Scheduler还提供了多种调度优先级供任务设置。

#### requestIdleCallback
requestIdleCallback 的作用是是在浏览器一帧的剩余空闲时间内执行优先度相对较低的任务
requestIdleCallback 的 FPS 只有 20
同步的调用多次 requestIdleCallback，该方法的回调执行可能会分布在不同的帧上，每执行完一次回调，浏览器会检查是否还有剩余的空闲时间，如果没有，会将执行控制权交还 event loop，如果有才会继续执行下一个回调，听起来是不是和 react fiber 的调度很像。
不占用单独帧，只在帧空闲的时间执行

#### requestAnimationFrame
其作用就是让浏览器流畅的执行动画效果
告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画
该方法的回调将会在浏览器的下一次绘制前
requestAnimationFrame()已经解决了浏览器不知道 JavaScript 动画何时开始的问题， 以及最佳间隔是多少的问题
requestAnimationFrame 方法会告诉浏览器希望执行动画并请求浏览器在下一次重绘之前调用回调函数来更新动画。
requestAnimationFrame的基本思想是 让页面重绘的频率和刷新频率保持同步
通过 requestAnimationFrame 调用回调函数引起的页面重绘或回流的时间间隔和显示器的刷新时间间隔相同。

#### Fiber
在应用中我们可以多次调用ReactDOM.render渲染不同的组件树，他们会拥有不同的rootFiber
但是整个应用的根节点只有一个，那就是fiberRootNode