---
title: vue运行过程
date: 2018/08/02
tag: [vue]
category: 笔记
---

#### 初始化 
```javascript
var _v = new Vue()
_v.init()
```
在new Vue()之后，Vue会调用init函数进行初始化。
初始化包括：生命周期、事件、props、methods、data、computed、watch
其中，*最重要的是*，通过Object.defineProperty设置 setter与getter函数，用来实现响应式以及依赖收集。

#### mount()
```javascript
_v.$mount()
```
初始化之后调用 $mount 方法会挂载组件，如果是运行时编译（即不存在render function，但是存在template 的情况）需要进行编译步骤。


#### compile()
```javascript
compile() // 编译，包括三步
- parse() // 解析，用正则等方式解析template模板中的指令（class、style等数据），形成AST。
- optimize() // 优化，主要作用是标记静态节点，后面当update更新界面时，会有一个patch过程，此时，diff算法会直接跳过静态节点，优化patch性能
- generate() // 生成，将AST转换为render function
```

#### 响应式
```html
init的时候通过Object.defineProperty设置setter与getter函数。
render的时候，会触发getter函数，此时，进行依赖收集。
在修改数据对象的时候，会触发setter函数，此时，通知依赖来更新视图。
ps:更新视图之前还有一个path的过程以及使用队列 "异步更新" 的策略。
```

#### vertual DOM
render function 会被转化为Javascript对象节点（VNode）。
Virtual DOM其实就是一棵 VNode 作为基础的树，用对象属性来描述节点，实际上它只是一层对真实DOM的抽象。
最终可以通过一系列操作使这棵树映射到真实环境上。
由于Virtual DOM是以JavaScript对象为基础而不依赖真实平台环境，所以使它具有了跨平台的能力，比如说浏览器平台、Weex、Node 等。

数据变化之后会触发setter，然后触发watcher，最后update更新视图。
整个过程具体为：
数据变化 ——> 执行render function得到新的VNode ——> 解析VNode ——> （diff 算法） ——> 更新必要的DOM


### 独立构建与运行时构建
传送门：https://cn.vuejs.org/v2/guide/installation.html#对不同构建版本的解释

编译器：用来将模板字符串编译成为 JavaScript 渲染函数的代码。

*独立构建*，包括编译和支持 template 选项。 （同时，也依赖浏览器接口的存在，所以你不能使用它来为服务器端）
*运行时构建*，不包括模板编译，不支持template选项。运行时构建，可以用render选项，但它只在单文件组件中起作用，因为单文件组件的模板是在构建时预编译到 render 函数中，运行时构建只有独立构建大小的 30%。

完整版：同时包含编译器和运行时的版本。
运行时版本：用来创建 Vue 实例、渲染并处理虚拟 DOM 等的代码。基本上就是除去编译器的其它一切。

如果你使用 webpack，并且喜欢分离 JavaScript 和模板文件，你可以使用 vue-template-loader预编译模板，它也可以在构建过程中把模板文件转换成为 JavaScript 渲染函数。




### 传送门

https://github.com/answershuto/learnVue

