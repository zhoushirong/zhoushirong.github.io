---
title: 前端基础八
date: 2020/12/14
tag: [基础,面试,试题]
category: 技术
---

### 常见的原理代码
手写这些方法有利于快速理解以及记忆这些api。

1.手写call
```javascript
// 思路：将要改变this指向的方法挂到目标this上执行并返回
Function.prototype.mycall = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('not funciton')
  }
  context = context || window
  context.fn = this
  let arg = [...arguments].slice(1)
  let result = context.fn(...arg)
  delete context.fn
  return result
} 
```

2.手写apply
```javascript
// 思路：将要改变this指向的方法挂到目标this上执行并返回
Function.prototype.myapply = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('not funciton')
  }
  context = context || window
  context.fn = this
  let result
  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}
```

3.手写bind
```javascript
// 思路：类似call，但返回的是函数
Function.prototype.mybind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  let _this = this
  let arg = [...arguments].slice(1)
  return function F() {
    // 处理函数使用new的情况
    if (this instanceof F) {
      return new _this(...arg, ...arguments)
    } else {
      return _this.apply(context, arg.concat(...arguments))
    }
  }
}
```

4.手写instanceof
```javascript
// 思路：右边变量的原型存在于左边变量的原型链上
function instanceOf(left, right) {
  let leftValue = left.__proto__
  let rightValue = right.prototype
  while (true) {
    if (leftValue === null) {
      return false
    }
    if (leftValue === rightValue) {
      return true
    }
    leftValue = leftValue.__proto__
  }
}
```

5.手写create
```javascript
// 思路：将传入的对象作为原型
function create(obj) {
  function F() {}
  F.prototype = obj
  return new F()
}
```

6.手写new
```javascript
function myNew (fun) {
  return function () {
    // 创建一个新对象且将其隐式原型指向构造函数原型
    let obj = {
      __proto__ : fun.prototype
    }
    // 执行构造函数
    fun.call(obj, ...arguments)
    // 返回该对象
    return obj
  }
}
```

7.手写Promise
```javascript
// 未添加异步处理等其他边界情况
// ①自动执行函数，②三个状态，③then
class Promise {
  constructor (fn) {
    // 三个状态
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    let resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
      }
    }
    let reject = value => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = value
      }
    }
    // 自动执行函数
    try {
      fn(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }
  // then
  then(onFulfilled, onRejected) {
    switch (this.state) {
      case 'fulfilled':
        onFulfilled()
        break
      case 'rejected':
        onRejected()
        break
      default:
    }
  }
}
```

7.手写事件监听
```javascript
// 组件通信，一个触发与监听的过程
class EventEmitter {
  constructor () {
    // 存储事件
    this.events = this.events || new Map()
  }
  // 监听事件
  addListener (type, fn) {
    if (!this.events.get(type)) {
      this.events.set(type, fn)
    }
  }
  // 触发事件
  emit (type) {
    let handle = this.events.get(type)
    handle.apply(this, [...arguments].slice(1))
  }
}
```

8.手写前端路由
手写路由两个核心
1）改变url地址，页面不刷新
2）如何检测url变化

```javascript
/**
 * hash 实现 
 * 1）hash改变页面不会刷新
 * 2）通过hashchange监听hash变化
 * history 实现
 * 1）history提供了pushState、replaceState方法改变url的path不会引起页面刷新
 * 2）popstate事件监听url路径变化
 * 注意：浏览器前进、后退改变url的时候会触发popstate事件，
 *      javascript的history： go/back/forword 会触发该事件
 *      但是通过pushState、replaceState以及a标签改变url的时候不会触发
 */
class HistoryRoute {
	constructor() {
		this.current = null
	}
}
class VueRouter {
	constructor(options) {
		this.mode = options.mode || "hash"
		this.routes = options.routes || [] //你传递的这个路由是一个数组表
		this.routesMap = this.createMap(this.routes)
		this.history = new HistoryRoute();
		this.init()

	}
	init() {
		if (this.mode === "hash") {
			// 先判断用户打开时有没有hash值，没有的话跳转到#/
			location.hash ? '' : location.hash = "/";
			window.addEventListener("load", () => {
				this.history.current = location.hash.slice(1)
			})
			window.addEventListener("hashchange", () => {
				this.history.current = location.hash.slice(1)
			})
		} else {
			location.pathname ? '' : location.pathname = "/";
			window.addEventListener('load', () => {
				this.history.current = location.pathname
			})
			window.addEventListener("popstate", () => {
				this.history.current = location.pathname
			})
		}
	}

	createMap(routes) {
		return routes.reduce((pre, current) => {
			pre[current.path] = current.component
			return pre;
		}, {})
	}
}
```
