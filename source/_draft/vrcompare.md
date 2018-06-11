---
title: vue 和 react组件通信
date: 2018/04/18
tag: vue vuex react redux
---

### vue
一、父子组件通信
父组件通过props向子组件下发数据

子组件
```html
Vue.component('child', {
	// 声明props
	props: ['message'],
	template: '<span>{{ message }}</span>'
})
```

父组件

```html
<child message='this is message from father component !'></child>
```


子组件通过event向父组件发送消息



如图所示：（图片来源:https://cn.vuejs.org）
![avatar](https://cn.vuejs.org/images/props-events.png)




兄弟（嵌套）组件通信



### react
1.父 -> 子组件通信
2.子 -> 父组件通信
3.兄弟（嵌套）组件通信


### react和vue的比较
1.共同点
2.异同点





### vue event事件通讯
https://cn.vuejs.org/v2/guide/components.html#%E9%9D%9E%E7%88%B6%E5%AD%90%E7%BB%84%E4%BB%B6%E7%9A%84%E9%80%9A%E4%BF%A1






















