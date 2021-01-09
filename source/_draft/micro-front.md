---
title: 微前端
date: 2021/01/05
tag: [微前端]
category: 技术
---


微前端的目的
针对单页系统
解决遗留系统问题，在不重写原有系统的基础上，使用新技术开发一些新功能，是vue、react、angular等共同存在同一个系统中。
前端微服务的一个卖点也在这里，去兼容不同类型的前端框架

***后台微服务***的一个很大的卖点在于，可以使用不同的技术栈来开发后台应用。但是，事实上，采用微服务架构的组织和机构，一般都是中大型规模的。
相较于中小型，对于框架和语言的选型要求比较严格，如在内部限定了框架，限制了语言。
因此，在充分使用不同的技术栈来发挥微服务的优势这一点上，几乎是很少出现的。
在这些大型组织机构里，采用微服务的原因主要还是在于，使用微服务架构来解耦服务间依赖。

***前端微服务化***上，则是恰恰与之相反的，人们更想要的结果是聚合，尤其是那些 To B（to Bussiness）的应用。
在这两三年里，移动应用出现了一种趋势，用户不想装那么多应用了。而往往一家大的商业公司，会提供一系列的应用。这些应用也从某种程度上，反应了这家公司的组织架构。然而，在用户的眼里他们就是一家公司，他们就只应该有一个产品。相似的，这种趋势也在桌面 Web 出现。聚合成为了一个技术趋势，体现在前端的聚合就是微服务化架构。

在这个时候，我们就需要使用新的技术、新的架构，来容纳、兼容这些旧的应用。而前端微服务化，正好是契合人们想要的这个卖点罢了。

微前端架构是一种类似于微服务的架构，它将微服务的理念应用于浏览器端，即将 Web 应用由单一的单体应用转变为多个小型前端应用聚合为一的应用。


#### 微前端架构一般可以由以下几种方式进行
```html
使用 HTTP 服务器的路由来重定向多个应用
在不同的框架之上设计通讯、加载机制，诸如 Mooa 和 Single-SPA
通过组合多个独立应用、组件来构建一个单体应用
iFrame。使用 iFrame 及自定义消息传递机制
使用纯 Web Components 构建应用
结合 Web Components 构建
```



https://github.com/fengshi123/blog/issues/21

### 传送门

qiankun 是一个基于 single-spa 的微前端实现库，旨在帮助大家能更简单、无痛的构建一个生产可用微前端架构系统。
https://qiankun.umijs.org/zh/guide

微前端在美团外卖的实践
https://tech.meituan.com/2020/02/27/meituan-waimai-micro-frontends-practice.html

微前端那些事
https://github.com/phodal/microfrontends

从IaaS到FaaS—— Serverless架构的前世今生
https://aws.amazon.com/cn/blogs/china/iaas-faas-serverless/

功能即服务(Faas)
https://www.redhat.com/zh/topics/cloud-native-apps/what-is-faas

BFF架构设计
https://juejin.cn/post/6844903959333699598

Web Components 入门实例教程
http://www.ruanyifeng.com/blog/2019/08/web_components.html