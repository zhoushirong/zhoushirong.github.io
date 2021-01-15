---
title: Vue3 Composition API
date: 2021/01/15
tag: [vue,vue3]
category: 技术
---

Vue3 已经来了，详细文档见下方传送门
这里记录一下比较重要的几个点。

#### 关于生命周期函数
1.Vue2 父子组件生命周期执行顺序
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

2.Vue3 中生命周期函数变化
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
#### setup 组件选项
setup 是Vue新增的选项， 组件选项在创建组件之前执行，没有 this 。
```javascript
setup(props, context) {
  // ...
}
```

#### 组合式API（Composition API）
Vue3中生命周期函数的执行顺序大体上没有变化，但是生命周期函数被从全局抽离了出来，原来挂载在 this 下面的生命周期函数需要手动引入。
也就是 Vue3 最大的改变 —— Composition API

通过组合式API，我们可以将接口的可重复部分及其功能提取到可重用的代码段中，能够将与同一个逻辑关注点相关的代码配置在一起。
为了使组合式 API 的特性与选项式 API 相比更加完整，我们还需要一种在 setup 中注册生命周期钩子的方法。
```html
<template>
  <div>{{ readersNumber }} - {{ twiceTheCounter }}-{{ book.title }}-{{ author }}</div>
</template>
```
```javascript
import { ref, onMounted, watch, computed, toRefs } from 'vue'
/**
* props 即 vue2 中的 props 属性，是响应式的
* context 是一个普通的 js 对象，它暴露三个组件的 property（context.attrs/context.slots/context.emit）
*/
export default {
  setup(props, context) {
    /*
    * 使用 `toRefs` 创建对prop的 `author` property 的响应式引用
    * 确保我们的侦听器能够对 author prop 所做的更改做出反应。
    * 因为 props 是响应式的，不能使用 ES6 解构，因为它会消除 prop 的响应性
    */
    const { author } = toRefs(props)
    const readersNumber = ref(0)
    const book = reactive({ title: 'Vue 3 Guide' })
    const twiceTheCounter = computed(() => readersNumber.value * 2)
    watch(user, (newValue, oldValue) => {
      console.log('user change', newValue, oldValue)
    })
    // 如何在 setup () 内部调用生命周期钩子
    onMounted() {
      console.log('Component is mounted!')
    }
    // expose to template
    return {
      readersNumber,
      book,
      author,
      twiceTheCounter,
    }
  }
}
```


### 传送门
[Vue3官方文档&迁移指南](https://vue3js.cn/docs/zh/guide/migration/introduction.html)