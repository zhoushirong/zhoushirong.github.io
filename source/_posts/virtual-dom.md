---
title: Vue的虚拟DOM
date: 2021/01/04
tag: [virtualDom,虚拟DOM,Vue]
category: 技术
---

#### 什么是虚拟 DOM
虚拟DOM是对DOM的一层抽象，以Javascript对象（VNode节点）作为基础的树。
用对象的属性描述节点，最后通过一些方法将其映射为真实的环境上，因此可实现跨平台。
当前主流前端框架React、Vue以及各种小程序的界面渲染都是用到的虚拟DOM技术。

```html
<div id="app">
  <p class="text">hello world!!!</p>
</div>
```
```javascript
const vNode = {
  tag: 'div',
  props: { id: 'app' },
  chidren: [{
    tag: 'p',
    props: { className: 'text' },
    chidren: [ 'hello world!!!' ]
  }]
}
```
该js对象就是虚拟 DOM 了，它以js对象的形式描述了 DOM 节点。后续如果有 DOM 操作，不会直接操作 DOM，而是先变更 js 对象，然后 使用 diff 算法计算出新老对象之间的差异。最后最小范围的直接替换掉有变化的节点。

#### 虚拟 DOM 的优势
原生 DOM 因为浏览器厂商需要实现众多的规范（各种 HTML5 属性、DOM事件），即使创建一个空的 div 也要付出昂贵的代价。
```javascript
var arr = []
var div = document.createElement('div')
for (let i in div){ arr.push(i) }
console.log(arr.length) // 314
```
上面代码输出可以看出，即使创建一个简单的DIV，就需要为其添加314个属性，如果之后直接操作该 DIV，应该会消耗掉不少的资源。

而对于虚拟DOM，我们只需要创建和维护几个我们用得上的必要属性，之后无论是增删查改还是通过diff算法计算出差异点，都是能够大大提高其效率的。
因此使用虚拟DOM，我们能够以最小代价的预处理DOM，最后一步到位另其变成渲染成真实的DOM。

当然这并不是虚拟DOM的主要优势，因为即使是原生的DOM操作也可以人为的控制批量操作DOM，通过减少DOM操作能够最大限度的解决这个效能问题。

虚拟DOM的**最大的优势**在于它可以接受 Parser 解析转化，这意味着其实相当多的东西我们都可以在编译阶段解决，比如：xss 攻击过滤。
除此之外，因为虚拟DOM是一个用 js 对象描述的DOM抽象，所以只要为这个抽象实现一个与之对应的UI层的映射，那么就可以将其应用到相应的UI处理，这也就是为什么能够实现跨平台的原因了。

#### Vue使用虚拟DOM渲染页面的完整过程
1.挂载，通过调用Vue.prototype.$mount()方法实现Vue页面的挂载
2.通过编译器来解析Template模板之后，生成render函数
3.调用vm._render()，将render函数转换为虚拟DOM
4.调用vm._update()，将虚拟DOM渲染为真实DOM

Vue是通过修改数据来更新视图的，当某个数据被修改的时候，set方法会让闭包中的Dep调用notify通知所有订阅者Watcher
Watcher通过get方法执行_update
```javascript
// _update 的调用时机有两个，一个是发生在初次渲染阶段，另一个发生数据更新阶段。
// _update 第一个参数是 vNode对象，update内部会先执行patch方法，该方法使用 diff算法 计算出最小的视图修改。
VNode = vm._render()
vm._update(VNode)
```

#### diff算法
diff算法通过同层的树节点比较，时间复杂度只有O(n)
只有Vnode节点相同（是同一个节点）的时候才会进行节点比较（patchVnode），否则直接删除旧节点，添加新节点。
##### 判断是否同一个节点的标准
```html
key相同
tag标签名相同
是否同为注释节点
是否都有data
当为input标签的时候，type是否相同
```

##### 新老节点 patchVnode 过程
```html
若 都是静态节点判断key是否相同（相同表示为同一节点），且新VNode是clone或是标记了once，则直接替换elm以及componentInstance。
若 均有children子节点，则对子节点进行diff操作，调用 updateChildren（diff算法的核心）。
若 老节点无子节点，新节点有子节点，先清空老节点DOM的文本内容，再为改DOM加入新子节点。
若 新节点无子节点，老节点有子节点，移除该DOM节点的所有子节点。
若 新老节点都无子节点的时候，仅进行文本的替换。
```

##### updateChildren过程
```html
新老节点的左右两边 子节点 各起一个变量标记（oldStartVnode, newStartVnode, oldEndVnode, oldEndVnode），遍历的过程两边的标记向中间靠拢，直到全部遍历完成。
要点：oldStartVnode、oldEndVnode与newStartVnode、newEndVnode 两两比较一共会有 2*2=4 种比较方法

遍历过程中：
如 存在key，且为相同节点，则复用节点
如 sameVnode(oldStartVnode, newStartVnode) 或 sameVnode(oldEndVnode, newEndVnode)，则直接对该节点进行 pathVnode
如 sameVnode(oldStartVnode, newEndVnode)，则进行 patchVnode 的同时还需要将真实DOM节点移动到 oldEndVnode 的后面
如 sameVnode(oldEndVnode, newStartVnode)，则进行 patchVnode 的同时还需要将真实DOM节点移动到 oldStartVnode 的前面
非上述情况，则创建 oldKeyToIdx: { [旧的VNode]: index }，从中刚找到含有与 newStartVnode 的key一致的节点X，
  1）如sameVnode(x, newStartVnode) ，则进行 patchVnode 的同时将这个真实DOM移动到 oldStartVnode 对应的真实DOM的前面。
  2）如notSameVnode(x, newStartVnode) ，则调用 createElm 创建一个新的节点。

结束时
如 新节点 多余 老节点，则将多余VNode节点插入到真实DOM中去
如 新节点 少于 老节点，则删除多余的DOM节点
```




### 传送门

Vue虚拟DOM的diff实现
https://github.com/answershuto/learnVue/blob/master/docs/VirtualDOM与diff(Vue实现).MarkDown

剖析Vue实现原理 - 如何实现双向绑定mvvm
https://github.com/DMQ/mvvm

一个虚拟DOM库
https://github.com/Matt-Esch/virtual-dom

Vue2 的虚拟DOM
https://juejin.cn/post/6844903895467032589