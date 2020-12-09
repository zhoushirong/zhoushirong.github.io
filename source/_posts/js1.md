---
title: Javascript数据类型
date: 2018/01/14
tag: js
category: 技术
---

Javascript的基础知识。

ECMAScript 5的五种简单数据类型：Undefined、Null、Boolean、Number、String；

另外还有一种es6新增的Symbol也是属于简单数据类型

一种复杂数据类型： Object（Array、Function、RegExp、Date都属于 Object）

除此之外还有特殊的类型，三种基本包装类型：Boolean、Number、String


简单数据类型的值时保存在栈内存中的简单数据段，它们是按值访问的。

复杂的数据类型（引用类型）的值是保存在堆内存中的对象，它的值时按照引用访问的。


### 检测方法用typeof，打印出来分别是：
```html
undefined、boolean、string、number、object
```

### 常见类型判断方式
```javascript
o = '';
Object.prototype.toString.call(o).slice(8, -1) === 'String' # 判断字符串
o = NaN || o = 1;
Object.prototype.toString.call(o).slice(8, -1) === 'Number' # 判断数值
o = null;
Object.prototype.toString.call(o).slice(8, -1) === 'Null' # 判断为Null
o = undefined;
Object.prototype.toString.call(o).slice(8, -1) === 'Undefined' # 判断为Undefined
o = true;
Object.prototype.toString.call(o).slice(8, -1) === 'Boolean' # 判断为Boolean
var o = {};
Object.prototype.toString.call(o).slice(8, -1) === 'Object' # 判断对象
o = [];
Object.prototype.toString.call(o).slice(8, -1) === 'Array' # 判断数组
o = function(){};
Object.prototype.toString.call(o).slice(8, -1) === 'Function' # 判断为Function
o = new Date();
Object.prototype.toString.call(o).slice(8, -1) === 'Date' # 判断Date
o = new RegExp();
Object.prototype.toString.call(o).slice(8, -1) === 'RegExp' # 判断RegExp

o = Symbol()
Object.prototype.toString.call(o).slice(8, -1) === 'Symbol' # 判断Symbol
```


### 一些特殊的类型比较

```javascript
typeof null // object ，特殊值null会被认为是空对象的引用

typeof NaN // number ，NaN是属于number类型的

Boolean(NaN) // false

null == undefined // true，ECMAScript 规范认为，既然 null 和  undefined 的行为很相似，并且都表示 一个无效的值，那么它们所表示的内容也具有相似性

null === undefined // false

undefined == 0 // false

null == 0 // false

var message;
message === undefined // true;

[] == [] // false，不相等，因为当两个值都是对象（引用值）时，比较的是两个引用值在内存中是否是同一个对象
{} == {} // false，同上

[] == false // true 隐式类型转换，全部转换为了0，0 == 0

NaN == NaN // false
```

### 类型计算

```javascript 
0.1+0.2 // 0.30000000000000004

var number = Number.MAX_VALUE + Number.MAX_VALUE;
isFinite(number); // false isFinite这个函数在参数位于最小与最大值之间时会返回true
```

### 基本包装类型

基本包装类型也是一种引用类型，除了拥有基本类型的特征外还拥有其特殊的特征，每当读取一个基本类型的值的时候，后台就会自动创建一个对应的基本包装类型对象，从而让我们能够调用一些方法来操作这些数据。

```javascript
var str = 'abcdefg';
var newStr = str.substring(2);
```

本来str基本数据类型是没有方法的，但是，作为基本包装类型，后台自动创建了一个String类型的实例，在实例上调用指定的方法，最后销毁这个实例。

```javascript
var str = new String('abcdefg');
var newStr = str.substring(2);
str = null;
```







