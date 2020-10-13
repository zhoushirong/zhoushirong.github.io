---
title: 前端基础二
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

1.实现一个 new
new 关键字调用的基本过程
1）创建一个新对象
2）继承父类原型的方法
3）添加父类属性到新对象上，并初始化，并保存方法的执行结果
4）如果执行结果有返回值，并且是一个对象，返回执行的结果，否则返回新创建的对象

```javascript
function Person(firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}
Person.prototype.getFullName = function() {
  return this.firstName + ' ' + this.lastName
}
function _new(obj, ...args) {
  var newObj = Object.create(obj.prototype)
  var result = obj.apply(newObj, args) // obj里面的this变成了newObj，所以，newObj有了obj的属性
  return (typeof result === 'object' && result !== null ) ? result : newObj
}
var newPerson = new Person('jack', 'bob')
var _newPerson = _new(Person, 'jack', 'bob')
```