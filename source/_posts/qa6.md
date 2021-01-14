---
title: 关于DOM的基础操作
date: 2020/12/14
tag: [基础,面试,试题]
category: 技术
---


1.手写前端路由
手写路由两个核心
1）改变url地址，页面不刷新
2）如何检测url变化

```javascript
/**
 * hash 实现 
 * 1）hash改变页面不会刷新
 * 2）通过hashchange监听hash变化
 * history 实现
 * 1）history提供了pushState、replaceState方法改变url的path不会引起页面刷新
 * 2）popstate事件监听url路径变化
 * 注意：浏览器前进、后退改变url的时候会触发popstate事件，
 *      javascript的history： go/back/forword 会触发该事件
 *      但是通过pushState、replaceState以及a标签改变url的时候不会触发
 */
class HistoryRoute {
	constructor() {
		this.current = null
	}
}
class VueRouter {
	constructor(options) {
		this.mode = options.mode || "hash"
		this.routes = options.routes || [] //你传递的这个路由是一个数组表
		this.routesMap = this.createMap(this.routes)
		this.history = new HistoryRoute();
		this.init()

	}
	init() {
		if (this.mode === "hash") {
			// 先判断用户打开时有没有hash值，没有的话跳转到#/
			location.hash ? '' : location.hash = "/";
			window.addEventListener("load", () => {
				this.history.current = location.hash.slice(1)
			})
			window.addEventListener("hashchange", () => {
				this.history.current = location.hash.slice(1)
			})
		} else {
			location.pathname ? '' : location.pathname = "/";
			window.addEventListener('load', () => {
				this.history.current = location.pathname
			})
			window.addEventListener("popstate", () => {
				this.history.current = location.pathname
			})
		}
	}

	createMap(routes) {
		return routes.reduce((pre, current) => {
			pre[current.path] = current.component
			return pre;
		}, {})
	}
}
```

2、实现下面的字符串格式化函数 format( String, Object),避免出现XSS :
```javascript
  document
  .body
  .innerHTML = 
  format('<div>I am {name}, my website is <a href="{website}">{website}</a></div>',{
    name: 'James',
    website: 'http://www.qq.com'
  })
```
```javascript
const str = '<div>I am { name }, my website is <a href="{website}">{website}</a></div>'
const data = {
  name: 'James',
  website: 'http://www.qq.com'
}
function format(str, data) {
  return str
  .replace(/&/g, '&amp')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/ /g, '&nbsp;')
  .replace(/\'/g, '&#39;')
  .replace(/\"/g, '&quot;')
  .replace(/\{(.*?)\}/g, (i, k) => data[k.trim()])
}
format(str, data)
```


3、通过JS在下面的ul中插入10000条 li 节点,并在点击 li 时打印其下标
```html
<ul id="list></ul>
```
```javascript
const ul = document.querySelector('#ul')
const fragment = document.createDocumentFragment()
ul.innerHTML= ''
for (let i = 0; i < 10000; i++) {
  const li = document.createElement('li')
  li.innerText = i
  li.setAttribute('data-index', i)
  fragment.appendChild(li)
}
ul.appendChild(fragment)
ul.addEventListener('click', (e) => {
  console.log(e.target.dataset.index)
})
```

4.在输入框中如何判断输入的是一个正确的网址
```javascript
var url = 'https://www.abc.com'
function checkUrl(url) {
  try {
    return new URL(url)
  } catch(e) {
    return false
  }
}
checkUrl(url)
```


5、请按照如下布局在pc端实现htm和css样式，要求:
a)A区域是 header部分,高度100像素,宽度根据屏幕自适应,居顶部展示
b)B区域固定宽度200像素,居左侧展示
c)C区域根据屏幕宽度自适应
d)D区域固定宽度200像素,居右侧展示
e)E区域高度80像素,宽度自适应,当整体内容不够满屏展示,E居屏幕底部展示
f)当整体内容超出屏幕高度,出现垂直滚动

demo：
[https://www.epoos.com/demo/learn/layout1.html](https://www.epoos.com/demo/learn/layout1.html)

```html
<style>
.header {
  background:#396;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 60px;
  z-index: 2;
}
.header-none {
  height: 60px;
}
.left {
  background:#963;
  position: absolute;
  left: 0;
  top: 60px;
  width: 200px;
}
.content {
  background:#693;
  width: 100%;
  min-height: 100%;
  padding: 60px 200px 30px 200px;
  margin-top: -60px;
  box-sizing: border-box;
}
.right {
  position: absolute;
  right: 0;
  top: 60px;
  background:#369;
  width: 200px;
}
.footer {
  background:cornsilk;
  float: left;
  width: 100%;
  height: 30px;
  margin-top: -30px;
}
</style>

<body>
<div class="header">header</div>
<div class="header-none"></div>
<div class="left">left</div>
<div class="content" contenteditable="true"></div>
<div class="right">right</div>
<div class="footer">footer</div>
</body>
```
