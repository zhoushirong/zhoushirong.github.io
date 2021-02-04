---
title: react学习笔记
date: 2021/02/05
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


#### class fields

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

#### 状态提升
通常，多个组件需要反映相同的变化数据，这时我们建议将共享状态提升到最近的共同父组件中去


React 最棒的部分之一是引导我们思考如何构建一个应用。
一个组件原则上只能负责一个功能

#### state 和 props 之间的区别是什么？
props（“properties” 的缩写）和 state 都是普通的 JavaScript 对象。它们都是用来保存信息的，这些信息可以控制组件的渲染输出，而它们的一个重要的不同点就是：props 是传递给组件的（类似于函数的形参），而 state 是在组件内被组件自己管理的（类似于在一个函数内声明的变量）。

#### 给 setState 传递一个对象与传递一个函数的区别是什么
传递一个函数可以让你在函数内访问到当前的 state 的值
因为 setState 的调用是分批的，所以你可以链式地进行更新，并确保它们是一个建立在另一个之上的，这样才不会发生冲突

在事件处理函数内部的 setState 是异步的。

### 传送门
为什么 React 中 Key 是必须的
https://zh-hans.reactjs.org/docs/reconciliation.html#recursing-on-children

受控组件和非受控组件
https://juejin.cn/post/6858276396968951822