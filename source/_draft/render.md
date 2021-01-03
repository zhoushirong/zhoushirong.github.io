---
title: H5与小程序的渲染
date: 2020/12/31
tag: [H5,小程序]
category: 技术
---


网页中渲染线程和脚本线程是互斥的
小程序中渲染线程和脚本线程是分开的，分别运行在两个线程中，小程序的逻辑层和渲染出分开，逻辑层运行在JSCore中，没有完整的浏览器运行环境

wxml、wxss 允许在渲染层
js 运行在逻辑层
渲染层界面使用webview进行渲染，一个小程序存在多个界面，所以渲染层有多个webview线程。
渲染层和逻辑层的通信由微信做中转
逻辑层发送网络请求也由native转发

为什么会分为渲染层和逻辑层：
1、html js和渲染是互斥的，不可用同步进行
2、渲染层是webview，逻辑层是jsCore（javascriptCore和v8、nwjs），渲染层可以有多个、逻辑层只有一个，用一个逻辑层管理多个渲染层，可同步进行，节省资源，方便管理。
快速加载、能力更强、原生体验、易用安全的开放数据、高效简单开发
管控和安全能力、屏蔽浏览器的页面跳转、dom操作、动态执行脚本等开放接口
防止开发者随意操作界面，保证用户数据安全
多页面数据共享


生命周期：
app: onLunch/onShow/onHide
page: onLoad/onShow/onReady/onHide/onUnload
component: created/attached/ready/moved/detached/error show/hide/resize
->app(onlaunch)
->app(onshow) 
->component(created)
->component(attached)
->page(onload)
->page(onshow)
->component(ready)
->page(onready)


通信：
渲染层与逻辑层：setData、bindTap/catchTap
父子组件之间：wxml数据绑定、事件triggerEvent、observers
兄弟组件之间：通过父组件中转、全局数据、relations

性能优化：
setData频率、数据量、wxml节点数、节点深度、图片缓存、
分包下载、
小程序评分参考、Audits调试参考


https://careers.tencent.com/jobdesc.html?postId=52139

微信小程序技术原理分析
https://zhaomenghuan.js.org/blog/wechat-miniprogram-principle-analysis.html

