---
title: Javascript对象
date: 2016/10/11
tag: js
category: 技术
---

《JavaScript高级程序设计学习笔记》之Javascript对象。
面向对象（Object-Oriented, OO）的语言有一个标志，那就是它们都有类的概念
而通过类可以创建任意多个具有相同属性和方法的对象。
ECMAScript没有类的概念，因此它的对象也与机遇类的语言中的对象有所不同
**ES6新增了对象Class的语法糖，这里不讨论ES6**


### 理解对象

1.对象

``` javascript
var person = new Object();

person.name = "jack";

person.sayName = function(){  
  return this.name;
}
```

2.属性 

ECMAScript中有两种属性

1）数据属性，数据属性有4个描述其行为的特性

``` html
[[Configurable]]:表示能否通过delete删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性改为访问器属性。

[[Enumerable]]:能否通过for-in遍历

[[Writabe]]:是否能修改属性的值

[[value]]:包含这个属性的数据值。从这个位置读属性值，写属性值的时候把新的值保存在这个位置。默认为undefined
```

要修改属性的默认特性必须使用ECMAScript5的Object.defineProperty()方法。

``` javascript
var person = {};

Object.defineProperty(person, "name", {  
  configurable:true, //设置false之后下次用defineProperty修改此属性就会抛错  
  value: jack
});

```

2）访问器属性

访问器属性不包含数据值；它们包含一对getter和setter函数；

读取访问器属性的时候会调用getter函数；写入访问器属性的时候会调用setter函数

访问器属性有如下4个特性

``` html
[[Configurable]]:同上数据属性

[[Enumerable]]:同上数据属性

[[Get]]:在读取属性的时候调用的函数。默认undefined

[[Set]]:在写入属性的时候调用的函数。默认为undefined
```

3) 访问器属性不能直接定义，必须使用Object.defineProperty()来定义

``` javascript
var book = {
  __year:2016,
  edition:1	
};

Object.defineProperty(book, "year", {
  get: function() {
    return this.__year;
  },
  set: function(newValue) {
    if (newValue > 2016) {
      this.__year  = newValue;
      this.edition += newValue - 2016;
    }
  }
});

book.year = 2017;
console.log(book.edition); // 2
```

3) 定义多个属性

ECMAScript5定义了一个Object.defineProperties()方法。利用这个方法可以通过描述符一次定义多个属性。

``` javascript
var book = {};

Object.defineProperties(book, {
  __year: { //数据属性
    value:2016,
    writable:false
  },
  edition: { //数据属性
    value:1,
    writable:true
  },
  year: { //访问器属性
    get: function() {
      return this.__year;
    },
    set: function(newValue) {
      if (newValue > 2016) {
        this.__year = newValue;
        this.edition += newValue - 2016;
      }
    }
  }
});
```

4) 读取属性的特性

使用ECMAScript5的Ojbect.getOwnPropertyDescriptor()方法，可以取得给定属性的描述符。

``` javascript
//...上面的例子

var descriptor = Object.getOwnPropertyDescriptor(book, "__year"); 
console.log(descriptor.value, descriptor.writable, descriptor.configurable, descriptor.value);

```

--------------------------------

### 创建对象

1.工厂模式

2.构造函数模式

3.原型模式

4.组合使用构造函数模式和原型模式

5.动态原型模式

6.寄生构造函数模式

7.稳妥构造函数模式

---------------------------------

### 继承

许多OO语言都支持两种继承方式：

``` html
接口继承:继承方法签名

实现继承:继承实际方法
```
JavaScript支持实现继承，且继承方式是依靠原型链实现的（es6的class类已经支持继承）

1.原型链继承

2.借用构造函数实现继承

3.组合继承

4.原型式继承

5.寄生继承

6.寄生组合式继承
































