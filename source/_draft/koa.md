---
title: Koa
date: 2018/09/11
tag: koa nodejs
---

### Koa 中间件系统
目前做Nodejs服务最常用的框架就是Koa和Express了。这两个框架各有各的优缺点。
其中Express出现的早，到目前为止在github上已经有 4w Star了，使用人数最多，最受欢迎。
而Koa




二者都是基于中间件的应用程序。

Express采用“尾递归”方式，中间件一个接一个的顺序执行, 通常将response响应写在最后一个中间件中；
Koa应用程序是一个包含一组中间件函数的对象，它是按照堆栈的方式组织和执行的。
Koa的中间件支持 generator, 它的执行顺序是“洋葱圈”模型。



Nodejs对async await支持：
Node 7.6 Brings Default Async/Await Support




### 传送门
https://koa.bootcss.com/#application

















