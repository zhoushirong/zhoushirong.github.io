---
title: 聊聊微信小程序
date: 2020/12/31
tag: [小程序,微信开发]
category: 技术
---

#### 微信小程序渲染特点
1.小程序运行在app中的，区别于H5运行在浏览器中，小程序的运行环境是基于浏览器内核重构的内置解析器，没有BOM和DOM API
2.小程序的渲染区别于H5的渲染线程和脚本线程互斥，小程序采用双线程模型，渲染层运行在Webview中，逻辑层运行在JSCore中，两个线程通过jsBridage进行中转通信。wxml、wxss 运行在渲染层，js 运行在逻辑层
3.一个小程序一个界面对应一个渲染线程，所以有多个webview线程，webview的渲染是通过js绘制的虚拟DOM为基础渲染的。
4.只有一个逻辑线程，逻辑层发送网络请求由native转发

#### 为什么小程序会采用双线程模型
1、H5中，html js和渲染是互斥的，不可用同步进行，为了不让逻辑层阻塞渲染层渲染。
2.防止开发者随意操作DOM，保护只想给用户查看的这一类隐私数据，保证用户数据安全
3.限制API的调用(如跳转功能)把js执行的逻辑层放入沙盒，一个纯js的执行环境，然后单独开一个渲染线程来做页面的渲染。
4.逻辑层的数据给渲染层的时候可以做数据过滤，防止xss

#### 小程序的生命周期
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

#### 小程序的数据通信
渲染层与逻辑层：逻辑层到渲染层通信使用setData、渲染层想逻辑层使用事件bindTap/catchTap
父子组件之间：props数据绑定、事件triggerEvent、observers
兄弟组件之间：通过父组件中转、全局数据、relations

#### 小程序登录
1.登录机制
小程序本身没有cookie机制，所有的数据都存储在storage里面，所以传统的cookie登录方式如果直接用在小程序是行不通的
简单的办法就是使用第三方库[weap-cookie](https://github.com/charleslo1/weapp-cookie)来做兼容
此库的原理就是在底层自动代理wx.request接口的访问，为请求预先做好cookie的存取。
2.小程序做微信自动登录
小程序可以通过微信官方提供的登录能力方便地获取微信提供的用户身份标识，快速建立小程序内的用户体系。
登录过程分为三步：
1）调用wx.login()获取微信登录凭据code，并将其传给开发者自己的服务端。
2）后端服务用前台传过来的code调用微信的后台接口，换取session和openid等信息存储在开发者的服务器
3）后端服务以session和openid为关联基础生成自己的session登录态，返回前端
4）前端拿到session登录凭证，登录成功（后续只需要通过session即可判断是否登录了）

#### 小程序性能优化
1.控制setData频率、数据量
2.控制wxml节点数、节点深度
3.接口数据、图片数据缓存
4.减少包的体量、做必要的分包下载
5.参考小程序后台评分、开发者工具Audits性能评估做相应优化


### 传送门
微信小程序技术原理分析
https://zhaomenghuan.js.org/blog/wechat-miniprogram-principle-analysis.html

小程序性能优化
https://developers.weixin.qq.com/miniprogram/dev/framework/performance/

小程序生命周期执行顺序
https://developers.weixin.qq.com/community/develop/article/doc/000002e9b647c833cab9ef81f51c13

小程序自动微信登录
https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html