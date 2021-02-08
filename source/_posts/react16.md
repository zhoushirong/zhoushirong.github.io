---
title: react 学习笔记
date: 2021/02/08
tag: [react,fiber]
category: 笔记
---

影响 App 应用 ***快速响应***的因素主要有两个
```html
1.网络请求响应慢
2.js中含有大量计算，导致设备性能不足，导致卡顿（CPU瓶颈）
```
对于网络请求作为前端开发能做的无非就是做缓存、懒加载等。

对于 javascript 中含有必要的大量计算的情况，如果是异步计算可以使用 WebWorker另外开一个进程来解决。
对于同步计算，WebWorker就力不从心了。

对于大量计算导致设备性能不足，页面卡顿的情况，升级设备才是最好的办法。
当然，在设备有限的情况下我们只能从我们的代码入手，尽可能的优化代码，减少设备资源的消耗了。

主流浏览器的刷新频率是 60HZ，每16.66毫秒刷新一次，js可以操作DOM，GUI渲染界面
所以JS线程和 GUI 渲染线程如果同时执行，会导致混乱，因此，浏览器的这两个线程被设计成互斥的。
因此，如果 js 每次执行时间过长，超过了16.66毫秒则会导致 GUI 渲染不连贯，让用户感知到卡顿。

#### 如何保证 js 的执行不影响 GUI 的渲染呢？
React 给出了一个解决方案 ***“时间切片”***。
在浏览器每一帧中预留出一部分时间给 js 线程，React 在这部分时间来做组件更新。
当预留时间消耗完毕之后，中断js线程的执行，将剩余时间进行GUI渲染，待下一帧来临的时候继续被中断的js线程工作。
而如果想做到上面的工作，必须要做到的是：将同步的更新变为可中断的异步更新。

#### React
React 官网对它理念介绍是：
```html
React 是用 Javascript 构建能够快速响应的大型 Web 应用程序的首选方式。
```

#### React16
React16 三层架构
```html
Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入Reconciler (React16 新增)
Reconciler（协调器）—— 负责找出变化的组件
Renderer（渲染器）—— 负责将变化的组件渲染到页面上，根据不同的平台有不同的Renderer，如 reactDom、ReactNative
```

##### Scheduler 调度器
React16 做到了时间切片，以浏览器是否有剩余时间作为任务中断的标准。
它实现了一种机制，当浏览器有剩余时间时通知我们。
```html
其实部分浏览器已经实现了这个API，这就是requestIdleCallback (opens new window)。但是由于以下因素，React放弃使用
比如：触发频率不稳定，受很多因素影响。比如当我们的浏览器切换tab后，之前tab注册的 requestIdleCallback 触发的频率会变得很低
```
基于以上原因，React实现了功能更完备的 requestIdleCallbackpolyfill，这就是Scheduler。
除了在空闲时触发回调的功能外，Scheduler 还提供了多种调度优先级供任务设置。

调度器会按照任务的优先级来进行任务分配，任务分配分为有六种：
```html
synchronous，与之前的Stack Reconciler操作一样，同步执行
task，在next tick之前执行
animation，下一帧之前执行
high，在不久的将来立即执行
low，稍微延迟执行也没关系
offscreen，下一次render时或scroll时才执行
```
优先级高的任务（如键盘输入）可以打断优先级低的任务（如Diff）的执行，从而更快的生效。


##### Reconciler 协调器
协调器的作用是调用函数组件、或 class 组件的 render 方法，将返回的 JSX 转化为虚拟 DOM
首先将虚拟 DOM 和上次更新时的虚拟 DOM 对比，通过对比找出本次更新中变化的虚拟 DOM
然后通知 Renderer 将变化的虚拟DOM渲染到页面上。

React 团队给 Reconciler 层起了个新的名字，叫 ***Fiber Reconciler***。
为了加以区分，React16 以前的原 Reconciler 被命名为 Stack Reconciler。
Stack Reconciler 和 Fiber Reconciler 的区别在于前者的运作的过程是不能被打断的，后者每执行一段时间，都会将控制权交回给浏览器，可以实现分段执行。

##### Renderer 渲染器
由于React支持跨平台，所以不同平台有不同的Renderer。
我们前端最熟悉的是负责在浏览器环境渲染的 Renderer —— ReactDOM
除此之外，还有：
ReactNative 渲染器，渲染App原生组件
ReactTest 渲染器，渲染出纯Js对象用于测试
ReactArt 渲染器，渲染到Canvas, SVG 或 VML (IE8)

在每次更新发生时，Renderer 会接到 Reconciler 通知，然后将变化的组件渲染在当前宿主环境。

#### Fiber
Fiber 并不是计算机术语中的新名词，他的中文翻译叫做纤程
与进程（Process）、线程（Thread）、协程（Coroutine）同为程序执行过程。

Fiber 的主要目标是实现虚拟 DOM 的增量渲染，能够将渲染工作拆分成块并将其分散到多个帧的能力。
在新的更新到来时，能够暂停、中止和复用工作，能为不同类型的更新分配优先级顺序的能力。

React Fiber 是 React 内部实现的一套状态更新机制，***其实际上就是 React16版本的 的虚拟 DOM***。
作为静态的数据结构来说，每个Fiber节点对应一个React element，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息。
作为动态的工作单元来说，每个Fiber节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。

React Fiber 支持任务不同优先级，可中断与恢复，并且恢复后可以复用之前的中间状态。
其中每个任务更新单元为 React Element 对应的 Fiber 节点。

在React15及以前，Reconciler采用递归的方式创建虚拟DOM，递归过程是不能中断的。
如果组件树的层级很深，递归会占用线程很多时间，造成卡顿。
React16将递归的无法中断的更新重构为异步的可中断更新，由于曾经用于递归的虚拟DOM数据结构已经无法满足需要。
于是，全新的 Fiber 架构应运而生。

##### Fiber 工作原理
Fiber 保存的就是对应的虚拟DOM，Fiber 构成的 Fiber 树就是对应的 DOM树。
对于 Fiber DOM树的更新，用到了“双缓存”的技术。
双缓存是一种在内存中构建并直接替换的技术，类似 Canvas 绘图过程中事先在内存中绘制了完整的新图层，然后用新图层直接替换旧图层的操作。
在 React 视图更新的时候，最多会存在两颗 Fiber 树， 状态变化的时候产生内存树，绘制完成之后直接替换 UI树。


### 附录
#### requestIdleCallback
requestIdleCallback 的作用是是在浏览器一帧的剩余空闲时间内执行优先度相对较低的任务，它的 FPS 只有 20
同步的调用多次 requestIdleCallback，该方法的回调执行可能会分布在不同的帧上，每执行完一次回调，浏览器会检查是否还有剩余的空闲时间
如果没有，会将执行控制权交还 event loop
如果有才会继续执行下一个回调
和 react fiber 的调度很像（事实上，React Fiber就是 ReqeustIdleCallback 的 polyfill）。

其特点是：不占用单独帧，只在帧空闲的时间执行
window.requestIdleCallback()会在浏览器空闲时期依次调用函数，这就可以让开发者在主事件循环中执行后台或低优先级的任务
而且不会对像动画和用户交互这些延迟触发但关键的事件产生影响

#### requestAnimationFrame
其作用就是让浏览器流畅的执行动画效果
告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画
该方法的回调将会在浏览器的下一次绘制前
requestAnimationFrame()已经解决了浏览器不知道 JavaScript 动画何时开始的问题， 以及最佳间隔是多少的问题
requestAnimationFrame 方法会告诉浏览器希望执行动画并请求浏览器在下一次重绘之前调用回调函数来更新动画。
requestAnimationFrame的基本思想是 让页面重绘的频率和刷新频率保持同步
通过 requestAnimationFrame 调用回调函数引起的页面重绘或回流的时间间隔和显示器的刷新时间间隔相同。


#### jsx
React DOM 在渲染所有输入内容之前，默认会进行转义，可以有效地防止 xss 攻击
Babel 会把 JSX 转译成一个名为 React.createElement() 函数调用。

```javascript
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
)
```
等效
```javascript
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
)
```
React.createElement() 会预先执行一些检查，以帮助你编写无错代码，但实际上它创建了一个这样的对象：
```javascript
// 注意：这是简化过的结构
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
}
```


仅使用 React 构建的应用通常只有单一的根 DOM 节点。
想要将一个 React 元素渲染到根 DOM 节点中，只需把它们一起传入 ReactDOM.render()：
```javascript
const element = <h1>Hello, world</h1>
ReactDOM.render(element, document.getElementById('root'))
```

#### 函数组件
```javascript
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```
该函数是一个有效的 React 组件，因为它接收唯一带有数据的 “props”（代表属性）对象与并返回一个 React 元素。
这类组件被称为“函数组件”，因为它本质上就是 JavaScript 函数。

也可以使用 es6 的类定义的方式定义 class 组件
```javascript
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

#### state
State 与 props 类似，但是 state 是私有的，并且完全受控于当前组件

#### key
key 帮助 React 识别哪些元素改变了，比如被添加或删除。因此你应当给数组中的每一个元素赋予一个确定的标识。
当元素没有确定 id 的时候，万不得已你可以使用元素索引 index 作为 key
如果列表项目的顺序可能会变化，我们不建议使用索引来用作 key 值，因为这样做会导致性能变差，还可能引起组件状态的问题。
如果你选择不指定显式的 key 值，那么 React 将默认使用索引用作为列表项目的 key 值。
元素的 key 只有放在就近的数组上下文中才有意义。
```javascript
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 错误！元素的 key 应该在这里指定：
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```
一个好的经验法则是：在 map() 方法中的元素需要设置 key 属性。
数组元素中使用的 key 在其兄弟节点之间应该是独一无二的。
然而，它们不需要是全局唯一的。当我们生成两个不同的数组时，我们可以使用相同的 key 值
Post 组件可以读出 props.xx，但是不能读出 props.key (key的值应该使用其他属性名来传递)

#### 受控组件
表单元素依赖于状态，表单元素需要默认值实时映射到状态的时候，就是受控组件，这个和双向绑定相似.
受控组件，表单元素的修改会实时映射到状态值上，此时就可以对输入的内容进行校验.
受控组件只有继承React.Component才会有状态.
受控组件必须要在表单上使用onChange事件来绑定对应的事件.
React 最棒的部分之一是引导我们思考如何构建一个应用。一个组件原则上只能负责一个功能

#### 状态提升
通常，多个组件需要反映相同的变化数据，这时我们建议将共享状态提升到最近的共同父组件中去

#### state 和 props 之间的区别是什么？
props（“properties” 的缩写）和 state 都是普通的 JavaScript 对象。
它们都是用来保存信息的，这些信息可以控制组件的渲染输出
而它们的一个重要的不同点就是：props 是传递给组件的（类似于函数的形参）
而 state 是在组件内被组件自己管理的（类似于在一个函数内声明的变量）。

#### 给 setState 传递一个对象与传递一个函数的区别是什么
传递一个函数可以让你在函数内访问到当前的 state 的值
因为 setState 的调用是分批的，所以你可以链式地进行更新，并确保它们是一个建立在另一个之上的，这样才不会发生冲突
在事件处理函数内部的 setState 是异步的。

### 传送门
为什么 React 中 Key 是必须的
https://zh-hans.reactjs.org/docs/reconciliation.html#recursing-on-children

受控组件和非受控组件
https://juejin.cn/post/6858276396968951822

React 和 vue的区别
https://juejin.cn/post/6844903668446134286

React Fiber 原理
https://segmentfault.com/a/1190000018250127

Fiber 介绍
https://musicfe.dev/react-fiber/