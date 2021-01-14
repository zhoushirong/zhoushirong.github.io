---
title: 手写apply/call/bind/new等代码
date: 2020/09/30
tag: [基础,apply,call,bind,new,instance,create]
category: 技术
---

1.手写 apply
```javascript
Function.prototype.apply1 = function(context = window, args) {
  const fn = Symbol('fn')
  context[fn] = this
  const res = context[fn](...args)
  delete context[fn]
  return res
}

// 思路：将要改变this指向的方法挂到目标this上执行并返回
Function.prototype.apply2 = function (context) {
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
2.手写 call
```javascript
Function.prototype.call1 = function(context = window, ...args) {
  const fn = Symbol('fn')
  context[fn] = this
  const res = context[fn](...args)
  delete context[fn]
  return res
}

// 思路：将要改变this指向的方法挂到目标this上执行并返回
Function.prototype.call2 = function (context) {
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
3.手写 bind 方法
```javascript
Function.prototype.bind1 = function(context, ...args) {
  let self = this
  return function F() {
    if (this instanceof F) {
      return new self(...args, ...arguments)
    }
    return self.apply(context, [...args, ...arguments])
  }
}


// 思路：类似call，但返回的是函数
Function.prototype.bind2 = function (context) {
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

4.实现一个 new
new 关键字调用的基本过程
1）创建一个新对象
2）继承父类原型的方法
3）添加父类属性到新对象上，并初始化，并保存方法的执行结果
4）如果执行结果有返回值，并且是一个对象，返回执行的结果，否则返回新创建的对象

```javascript
function _new1(obj, ...args) {
  var newObj = Object.create(obj.prototype)
  var result = obj.apply(newObj, args) // obj里面的this变成了newObj，所以，newObj有了obj的属性
  return (typeof result === 'object' && result !== null ) ? result : newObj
}

function _new2 (fun) {
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

function Person(firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}
Person.prototype.getFullName = function() {
  return this.firstName + ' ' + this.lastName
}
var newPerson = new Person('jack', 'bob')
var _newPerson = _new(Person, 'jack', 'bob')
```

5.手写instanceof
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

6.手写create
```javascript
// 思路：将传入的对象作为原型
function create(obj) {
  function F() {}
  F.prototype = obj
  return new F()
}
```
