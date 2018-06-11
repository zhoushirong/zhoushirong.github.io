---
title: vue学习总结
date: 2018/04/11
tag: vue vuex
---

### vue
vue是一个专门为vue应用程序开发的状态管理模式

```html
state: 数据源
actions: 用户行为
view: 视图 
```

简单的vue 组件视图交互单向数据流：
```html
用户行为作用在视图上，产生action，
action触发state变化，
state变化再引起view视图的改变
```
如图所示：（图片来源:https://vuex.vuejs.org/zh-cn/intro.html）
![avatar](https://vuex.vuejs.org/zh-cn/images/flow.png)


但是，当我们的应用遇到多个组件共享状态时，单向数据流的简洁性很容易被破坏：
比如：
```html
1.多个view共享同一个state
2.多个不同的action需要变更同样的state
```
对于上述两种情况,



### vuex

![avatar](https://vuex.vuejs.org/zh-cn/images/vuex.png)

##### vuex 核心概念
```html
State
Getter
Mutation
Action
Module
```







### event事件通讯

https://cn.vuejs.org/v2/guide/components.html#%E9%9D%9E%E7%88%B6%E5%AD%90%E7%BB%84%E4%BB%B6%E7%9A%84%E9%80%9A%E4%BF%A1






















