---
title: commonjs与es6 module
date: 2020/10/21
tag: [基础,面试,试题,commonjs,es6Module]
category: 技术
---

当前最主流的两个模块化方案：nodejs使用的是commonjs规范、前台浏览器端主要使用的是es6 Module
nodejs当前就是commonjs规范的代表实践者，因此用的是require。
import是es6新增的api，在语言标准层面上，实现了模块功能。旨在成为浏览器和服务器端的通用模块解决方案。

用法如下：

ES6 Module
```javascript
export a = 1
export default b = 2
```
```javascript
import { a } from x.js
import b from x.js
```

commonjs require
```javascript
module.exports = {
  a: 1,
  b: 2
}
```
当然，Nodejs为每个模块提供了一个 exports变量，指向module.exports，相当于
```javascript
var exports = module.exports
```
因此可以直接使用
```javascript
exports.a = {} // 不能重写 exports,比如：exports = { a: {} }
```
调用方法
```javascript
var x = require('x.js')
console.log(x.a, x.b)
```


### commonjs和es6 module对比
1.commonjs输出的是值的拷贝、es6 输出的是值的引用
2.commonjs是运行时加载，es6 是编译时输出接口

对待循环引用的区别：
es6模块，遇到模块加载命令import时，不会去执行模块，而是只生成一个引用。等到真的需要用到时，再到模块里面去取值。
因此遇到循环引用的时候会抛出一个错误。
CommonJS模块，的特性是加载时执行，在首次加载的时候就已经执行出结果了，此结果会一直缓存在内存中，等需要用到的时候直接取用缓存结果，因此，如果出现循环引用，只会输出已经执行的部分


### 其它，amd、cmd
amd和cmd是早期社区提出的标准，曾经流行过一段时间。这两个标准都是直接在前端浏览器端使用的。
amd标准的代表是requirejs，它推崇依赖前置，提前执行
cmd标准的代表是seajs，它推崇依赖就近，延迟执行；requirejs后期版本也支持延迟执行


### 传送门
[https://juejin.im/post/6844903576309858318](https://juejin.im/post/6844903576309858318)
[https://www.ruanyifeng.com/blog/2020/08/how-nodejs-use-es6-module.html](https://www.ruanyifeng.com/blog/2020/08/how-nodejs-use-es6-module.html)
[https://es6.ruanyifeng.com/#docs/module-loader](https://es6.ruanyifeng.com/#docs/module-loader)
