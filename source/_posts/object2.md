---
title: javascript对象
date: 2021/01/01
tag: [object,js,对象]
category: 技术
---

之前学习对象的继承的时候遇到了很多对象的属性，这些属性理解起来还是比较费力的，理解了很多遍，也记忆了很多遍，同样的也忘记了很多遍
现在给它做个小整理吧

首先先从问题出发，下面表达式都返回 true。
```javascript
// 初始数据
function A() {}
const a = new A()
const arr = []
const obj = {}

// instanceof
A instanceof Object
a instanceof A
a instanceof Object
arr instanceof Object
arr instanceof Array

// prototype and __proto__
A.prototype === a.__proto__
Array.prototype === arr.__proto__
a.__proto__ === A.prototype // A.prototype === Object.getPrototypeOf(a)
obj.__proto__ === Object.prototype
Object.prototype.constructor === Object

// constructor
a.constructor === A
obj.constructor === Object
arr.constructor === Array
Object.constructor === Array.constructor
```
#### 分析与总结：
JS通过 \_\_proto\_\_ 和 prototype 的合作实现了原型链以及对象的继承。
上面表达式结果的核心原理也是 \_\_proto\_\_ 和 prototype 的指向和流转原理，明白了这两个属性也差不多就‘懂了’对象了。
es6中的class extends语法也是基于es5构造函数继承而封装的语法糖，也不外乎上面两个属性。
```html
每个js对象一定对应一个原型对象，且从该原型对象继承了属性和方法，对象的 __proto__ 属性的值就是它对应的原型对象
只有函数才有 prototype 属性，创建函数的时候js会自动为函数添加 prototype 属性，该属性的值是一个有 constructor 属性的对象。
instanceOf 用于检测对象的 prototype 属性是否出现在某个实例的原型链上
所有的对象都会从它的原型上继承一个 constructor 属性，这个属性指向父级对象(`被继承了constructor属性的对象`)，如：所有构造函数的实例都会从它的原型上继承一个 constructor 属性，这个属性指向该构造函数
对象的 __proto__ 属性指向父级对象的原型（生产环境使用 Object.getPrototypeOf 代替 __proto__ ）
对象的 prototype 属性的 __proto__ 属性表示方法的继承，指向父类的prototype属性
```

最后再来张图片吧

![http://www.mollypages.org/tutorials/js.mp](http://zhoushirong.github.io/img/jsobj.jpg)

### 传送门
从__proto__和prototype来深入理解JS对象和原型链
https://github.com/creeperyang/blog/issues/9