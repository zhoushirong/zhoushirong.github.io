---
title: vuex
date: 2018/08/07
tag: [vue vuex]
---

Vuex是一个专门为Vue.js应用程序开发的状态管理模式。
它采用集中式存储管理应用的所有组件状态，并以相应的规则保证状态以一种可预测的方式发生变化。

状态管理包含以下几部分
```html
1.state 驱动应用的数据源
2.view 以声明方式将state映射到视图
3.action 相应在 view 上的用户输入导致的状态变化
```

这三个状态之间互相交互，就形成了vue的单向数据流

<img src="https://vuex.vuejs.org/flow.png" width="50%" height="50%">

但是这个单项数据流模式是很容易被破坏的。
如：
```html
1.多个视图依赖于同一状态。
2.来自不同视图的行为需要变更同一状态。
```

对于第一种状态，可以通过传参的形式解决，但是对于兄弟节点之间的状态传递就很麻烦了。
第二种状态，我们经常会采用父子组件直接引用或者通过事件来变更和同步状态的多份拷贝。

这些做法都有其局限性，那么有什么办法能解决这些问题呢？


这就是vuex被设计出来的原因了。它的出现就是为了解决这些问题。

<img src="https://vuex.vuejs.org/vuex.png" width="50%" height="50%">

### 核心概念

```html
state：vuex使用单一状态树，一个对象包含了全部应用层级的状态，是唯一数据源。
```
由于vuex的状态是存储是响应式的，从store实例中读取状态，最简单的方法就是在计算属性中返回某个状态。


除此之外，vue 还通过store选项，提供了一种机制，将状态从根组件 注入到每一个子组件。
```javascript

import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

let store = new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
})


const app = new Vue({
  el: '#app',
  store, // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `
})
```
通过在根实例中注册store选项，该store实例会注入到根组件下所有子组件中
子组件能通过 this.$store 访问到。

```html
getter： 通过getter获取属性，可以在获取state的时候对属性进行过滤或者计算。
```
getter的返回值跟计算属性一样，会被缓存，只有当依赖属性变化的时候才会重新计算，可以看做是store的计算属性。
getter可以返回一个函数，来实现给getter传参。
当getter返回的是一个函数的时候，通过方法访问的时候，每次都会去进行调用，不会缓存结果。


```html
mutation：更改vuex中store状态的唯一方法就是提交mutation
```
vuex中的mutation类似于事件
每个mutation都有一个字符串 事件类型（type）和一个回调函数（handler）
这个回调函数就是我们实际进行状态更改的地方，它接受一个state作为第一个参数。

定义一个mutation
```javascript
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state, n) {
      // 变更状态
      state.count++
    }
  }
})
```

调用一个mutation
```javascript
// 字符串的方式调用
store.commit('increment', n)

// 对象的方式调用cc
store.commit({
  type: 'increment',
  amount: 10
  ... // 更多字段
})
```
第二个参数‘n’叫做载荷，通常情况n是一个对象，这样方便传更多的参数。

特别注意：mutation必须是同步函数。
那么如果是异步请求怎么办呢？

此时，就需要用到另一个核心概念Action了


```html
action：action和mutation类型，区别在于，action是提交一个mutation而直接变更状态。
```
action可以包含任意异步操作。

Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象作为参数。
context可以有commit、state、getters、
因此，可以直接通过参数调用commit触发mutation。
```javascript
// 定义一个action
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}

// 调用一个action action也支持荷载，支持对象和字符串的方式传参
// 以载荷形式分发
store.dispatch('incrementAsync', {
  amount: 10
})

// 以对象形式分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

store.dispatch可以处理被触发action的处理函数返回的Promise，并且 store.dispatch仍旧返回Promise
```javascript
// 定义异步的action
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}

// dispatch一个promise
store.dispatch('actionA').then(() => {
  // ...
})
```

```html
module：将store分割成模块，每个模块拥有自己的state、mutation、action、getter、嵌套子模块等。这个模块就是module
```
如果store非常大的时候，非常不好管理，这时候就可以将其分割为小的module了。


```javascript
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```
对于模块内部的 mutation 和 getter，接收的第一个参数是模块的局部状态对象。
对于模块内部的 action，局部状态通过 context.state 暴露出来，根节点状态则为 context.rootState
对于模块内部的 getter，根节点状态会作为第三个参数暴露出来

#### 模块命名空间
默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的——这样使得多个模块能够对同一 mutation 或 action 作出响应。
如果希望你的模块具有更高的封装度和复用性，你可以通过添加 namespaced: true 的方式使其成为带命名空间的模块
```javascript
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true, // 待命名空间的模块，（命名空间控制属性会继承）
    }
  }
})
```

### 传送门
https://vuex.vuejs.org/zh/

















