---
title: commonjs与es6 module
date: 2020/10/21
tag: [基础,面试,试题]
category: 技术
---

当前最主流的两个模块化方案：nodejs使用的是commonjs规范、前台主要使用的是es6 Module
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
```javascript
var x = require('x.js')
console.log(x.a, x.b)
```
commonjs 是同步加载方案，适用于服务端

### commonjs和es6 module对比
1.commonjs输出的是值的拷贝、es6 输出的是值的引用
2.commonjs是运行时加载，es6 是编译时输出接口


### 传送门
[https://juejin.im/post/6844903576309858318](https://juejin.im/post/6844903576309858318)
[https://www.ruanyifeng.com/blog/2020/08/how-nodejs-use-es6-module.html](https://www.ruanyifeng.com/blog/2020/08/how-nodejs-use-es6-module.html)
[https://es6.ruanyifeng.com/#docs/module-loader](https://es6.ruanyifeng.com/#docs/module-loader)