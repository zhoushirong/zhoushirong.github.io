---
title: vue服务端渲染
date: 2018/08/08
tag: vue ssr
---

### Vue服务端渲染
Vue.js是构建客户端应用程序的框架。
其渲染页面原理就是，利用javascript生成虚拟DOM树，然后根据虚拟DOM树生成真实的DOM。
因此，在浏览器端加载页面的时候其实际上是先加载包含虚拟DOM树的javascript，待javascript加载完之后再生成真实的DOM。

这与传统的后端模板渲染的优势在于前后端完全分离，开发快速方便。
缺点就是没办法做SEO、首屏渲染慢。

当然，除此之外，开发上也有一定的技术要求，对服务器的cpu计算等也有一些影响。

具体是否要用服务端渲染还得根据是实际情况来定。详细优缺点可以查看其官网介绍，后面有传送门。


### 服务端预渲染
如果是纯静态页面，没有什么动态数据，那么其实可以不需要用到服务端渲染
只需要配置一个服务端预渲染就行了。
那么什么是服务端预渲染呢？
所谓的预渲染，其实就是在构建阶段就将页面给渲染生成了静态的html页面了。（可以理解为使用vue开发静态html页面）

### 开发服务端渲染

安装服务端渲染所需要的vue和vue-server-renderer插件
```shell
npm install vue vue-server-renderer --save
```
注意：vue 和 vue-server-renderer必须匹配版本。

举例：
```javascript
// 第一步，创建一个vue实例
const Vue = require('vue')
const app = new Vue({
	template: `<div>Hello World</div>`
})

// 第二步，创建一个renderer
const renderer = require('vue-servver-renderer').createRenderer()

// 第三步，将Vue实例渲染为HTML
renderer.renderToString(app, (err, html) => {
	if (err) {
		throw err
	}
	console.log(html) // 这里的html就是服务端传到前端页面的html字符串。
})

// 在2.5.0+，如果没有传入回调函数，则会返回Promise
renderer.renderToString(app).then(html => {
	console.log(html)
}).catch(err => {
	console.error(err)
	})
```






### 传送门
https://ssr.vuejs.org/zh/

















