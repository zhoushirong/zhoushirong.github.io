---
title: 我所理解的微前端
date: 2021/01/09
tag: [微前端]
category: 技术
---

当下业内的微前端字眼出现的频率比较高，于是大致了解了一下微前端
主要内容包括：什么是微前端？微前端的好处和意义是什么？做微前端应该如何做？

#### 什么是微前端
说微前端之前首先得跟微服务区分开来
***微服务***是一种以业务功能为主的服务设计概念，每一个服务都具有自主运行的业务功能，对外开放不受语言限制的API (最常用的是HTTP)，应用程序则是由一个或多个微服务组成。
微服务是由以单一应用程序构成的小服务，自己拥有自己的行程与轻量化处理，服务依业务功能设计，以全自动的方式部署，与其他服务使用HTTP API通信。同时服务会使用最小的规模的集中管理 (例如 Docker) 能力，服务可以用不同的编程语言与数据库等组件实现。 —— 维基百科

而微前端，是针对前台的单页系统而定义的概念，每一个微前端的功能模块都具有自主运行的业务功能，对外提供url访问路径（可以是完整的URL，也可以是前端history/hash等路由），应用有一个或多个单页系统组成，可以独立部署，方便的插拔，又能够方便的实现独立模块间的通信。类似与微服务的不同语言的兼容性，微前端各个子应用也可以使用各自自己的语言，比如react、vue、angular等。
现如今前端多框架齐头并进，而且谁也不能保证会不会过几个月就新增一个新的框架，因此，在不重写原有系统的基础上使用新技术开发新功能是十分必要的需求，而微前端的思想就能够很方便的让这一需求成为可能，这也是微服务的一个很重要的卖点。

#### 微前端的好处和意义
1.独立开发部署，聚合使用。
有过一定前端开发经验的人都知道，一个健康发展，长期迭代更新维护的系统，一定是越做越大，功能越来越多的。
而随着功能的增多，代码量增多，打包构建更耗时，模块依赖更复杂，模块崩溃连锁反应风险更大。因此，当到达某个临界点的时候，就会促使开发人员对应用进行拆分了。
然而系统拆分确实能够解决问题，但是对于用户来说就变成了使用一个系统变成了使用多个系统了，即使我们做了授权登录或者跨子域登录，对于不同系统之前的切换也是很麻烦的，如果有的选择，用户肯定是希望一个系统就能把自己的事情做完。

2.跨团队、跨技术开发
一个复杂的系统往往需要很多人、甚至不同的团队一起来开发的，而这也就意味着需要跨越多个时间线、多个技术栈和多个团队的编码风格。
这些差异点集成在一起往往就是风险的不断叠加和维护成本的不断上升。微前端的思想可以很好的处理这一类问题。


3.微前端最佳的使用场景是一些B端的管理系统，既能兼容集成历史系统，也可以将新的系统集成进来，并且不影响原先的交互体验。
整体的微前端不仅仅是只将系统集成进来，而是整个微前端体系的完善。
```html
基座应用和微应用的自动部署能力。
微应用的配置管理能力。
本地开发调试能力。
线上监控和统计能力等。
```
只有将整个能力体系搭建完善，才能说是整个微前端体系流程的完善。
当发现使用微前端反而使效率变低，简单的变更复杂那就说明微前端并不适用。

#### 如何做微前端
微前端的思想其实有点类似于 iframe，起一个框架，做一个导航，然后嵌入不同的页面。
单纯根据对概念的理解，实现微前端的就是将应用进行拆解和整合，通常是一个父应用加上一些子应用，主应用管理各个子应用。
采用iframe来将多个应用整合到一起等等这些其实都属于微前端的实现方案

当然，如果仅仅是套一个iframe那也太low了。
一个好的微前端方案主要需要解决三个问题：
```html
路由切换、路由分发问题。
子应用之间、子应用与主微应用的隔离问题。
子应用直接的通信问题。
```

1.路由分发
作为一个SPA的基座应用，本身是一套纯前端项目，要想展示微应用的页面除了采用iframe之外，要能先拉取到微应用的页面内容， 这就需要远程拉取机制。
远程拉取机制通常会采用fetch API来首先获取到微应用的HTML内容，然后通过解析将微应用的 JavaScript 和 CSS 进行抽离，采用 eval 方法来运行JavaScript，并将CSS和HTML 内容 append 到基座应用中留给微应用的展示区域，当微应用切换走时，同步卸载这些内容，这就构成的当前应用的展示流程。
当然这个流程里会涉及到 CSS 样式的污染以及 JavaScript 对全局对象的污染。

2.微应用隔离
当前处理微应用隔离， 应对 CSS 全局对象污染的方法
```html
可结合 Webpack等打包工具，使用 css Module或者命名空间的方式给每个子应用添加特定的前缀，每次应用加载时，<br>将该应用所有的 link 和 style 内容进行标记。在应用卸载后，同步卸载页面上对应的link和style即可

使用Web Components（shadowDom）技术，Web Components能够填入隔离 CSS 作用域。
```
每当微应用的JavaScript被加载并运行时，它的核心实际上是对全局对象 Window 的修改以及一些全局事件的改变，例如jQuery这个js运行后，会在Window上挂载一个window.$对象，对于其他库React，Vue也不例外。为此，需要在加载和卸载每个微应用的同时，尽可能消除这种冲突和影响
当前处理 Javascript 全局对象污染的方法
```html
最普遍的做法是采用沙箱机制（SandBox）。
沙箱机制的核心是让局部的JavaScript运行时，对外部对象的访问和修改处在可控的范围内，即无论内部怎么运行，都不会影响外部的对象。
通常在Node.js端可以采用vm模块，而对于浏览器，则需要结合 with 关键字和 window.Proxy 对象来实现浏览器端的沙箱。
```

3.微前端的消息通信
消息订阅（pub/sub）模式的通信机制
在基座应用中会定义事件中心Event，每个微应用分别来注册事件，当被触发事件时再有事件中心统一分发，这就构成了基本的通信机制
如果使用的是 React或者 Vue等框架，可以结合Redux和Vuex来一起使用，实现应用之间的通信。

### 传送门
[微前端探索](https://github.com/fengshi123/blog/issues/21)，介绍了了什么是微前端，以及乾坤框架的一些简介。

[qiankun框架](https://qiankun.umijs.org/zh/guide) 是一个基于 single-spa 的微前端实现库，旨在帮助大家能更简单、无痛的构建一个生产可用微前端架构系统。

[微前端在美团外卖的实践](https://tech.meituan.com/2020/02/27/meituan-waimai-micro-frontends-practice.html)，美团在微前端的实践经验

[微前端那些事](https://github.com/phodal/microfrontends)，微前端框架 Mooa 

[Web Components](http://www.ruanyifeng.com/blog/2019/08/web_components.html) 入门实例教程

[with关键字](https://cloud.tencent.com/developer/article/1408030)

[CSS Module简介](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)（CSSmodule就是一个css模块化的一个方案）

[微应用简介](https://juejin.cn/post/6844904162509979662)
