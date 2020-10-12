---
title: javascript常用技巧一
date: 2020/09/30
tag: [基础,面试,试题]
category: 技术
---

1.手写 apply、call、bind 方法
```javascript
Function.prototype.apply = function(context = window, args) {
  const fn = Symbol('fn')
  context[fn] = this
  const res = context[fn](...args)
  delete context[fn]
  return res
}
Function.prototype.call = function(context = window, ...args) {
  const fn = Symbol('fn')
  context[fn] = this
  const res = context[fn](...args)
  delete context[fn]
  return res
}
Function.prototype.bind = function(context, ...args) {
  let self = this
  return function F() {
    if (this instanceof F) {
      return new self(...args, ...arguments)
    }
    return self.apply(context, [...args, ...arguments])
  }
}
```

测试代码：
```javascript
var obj = {
  a: 1,
  showA(n, m) {
    return this.a + n + m
  },
}
function test1() {
  this.a = 4
  var s = obj.showA.bind(this, 10)
  console.log('result:',s(20)) // 34
}
function test2() {
  this.a = 2
  var s = obj.showA.apply(this, [1, 2])
  console.log('result:', s) // 5
}
function test3() {
  this.a = 3
  var s = obj.showA.call(this, 2, 3)
  console.log('result:', s) // 8
}
test1()
test2()
test3()
```