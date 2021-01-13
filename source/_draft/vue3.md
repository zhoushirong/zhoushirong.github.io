---
title: VUE3简介
date: 2021/01/14
tag: [vue,vue3]
category: 技术
---

#### VUE2 父子组件生命周期执行顺序
```html
父beforeCreate
-> 父created
->父beforeMount
->子beforeCreate
->子created
->子beforeMount
->子mounted
->父mounted
```
#### 1.composition api
最大的改动就是composition api，将原来挂载到this上的方法直接通过引用的方式调用
手动import之后就可以在setup中使用了
```html
beforeCreated/cateated => setup
beforeMounted => onBeforeMounted
mounted => onMounted
beforeUpdated => onBeforeUpdated
updated => onUpdated
beforeDestroyed => onBeforeUnmounted
destroyed => onUnmounted
errorCaptured => onErrorCaptured
```

onRenderTracked
onRenderTriggered

Vue server-render
使用vue-server-render将vue实例生成html，同时，将渲染的数据状态直接传到前端
前端页面初始化vue实例的时候，以服务端传过来的vuex的状态为初始状态进行渲染



