---
title: defer与async区别
date: 2021/01/18
tag: [defer,async]
category: 笔记
---

众所周知，在浏览器中网页加载中 javascript 的 ***加载*** 和 ***执行***会默认阻塞 DOM 的加载和页面的渲染。
因此，在编写代码的时候我们往往将 script 标签放到 body 的最后面。

当然，脚本本身不阻塞页面加载的需求其实是存在的。为此，在 HTML4.1 规范中新增了一个 defer 属性。
#### script 标签的 defer 属性
HTML4.1规范规定，只需要给 script 加上 defer 属性，脚本就可以延迟到文档完全被解析和显示之后执行。
```html
<html>
  <head>
    <script defer src="example1.js"></script>
    <script defer src="example2.js"></script>
  </head>
  <body>DOM Content!</body>
</html>
```
HTML5 规范在之前的规范基础上补充了几条规则
```html
defer 属性只对外部脚本文件有效。 （在 IE7 及更早的版本中，对行内脚本也可以指定这个属性。）
加了 defer 属性的脚本应该按照它们出现的顺序执行
所有的加了 defer 属性的脚本都会在 DOMContentLoaded 事件之前执行
```

因此，正常情况下，按照规范
```html
上面的 DOM 结构中，example1.js 和 example2.js 脚本会在 DOM 渲染的时候同步下载，并不会阻塞 DOM 的加载。
并且脚本下载完成之后，执行的时机应该是在 DOMContentLoaded 事件之前
并且 example1.js 里面的代码会先于 example2.js执行。
```

然而，规范是规范，有了规范也得有浏览器产商遵循才行，对于 defer 属性也有部分浏览器并没有按照上述规范执行。
比如，多个 script 加了 defer属性的情况下，执行顺序不一定是 script 标签出现的顺序；
又比如，在某些浏览器环境下，defer 的脚本不一定在 DOMContentLoaded 事件之前执行等。
因此，稳妥起见，即便加了refer，最好还是将脚本放到 body 的最后。


HTML5 规范除了补充了 defer 的规则，也新增了一个新的属性 async。
#### script 标签的 async 属性
1.从改变脚本的处理来看，async 和 defer 类似
2.async 和 defer 的新规范一样，仅支持外部脚本
3.async 和 defer 规范不一样的地方在于，defer 执行按照 script 标签的出现顺序，而 async 执行顺序是不确定的。因此，多个 async 的脚本之间不应该有依赖关系。
4.async 的下载和执行都是独立的，和 DOM 的加载和解析完成与否无关，因此，若 async 在 DOM 解析完成之前执行，则很可能会阻塞 DOM 的渲染。

#### 总结
1.异步脚本不会阻塞DOM，而且保证会在页面的 load 事件前执行，但可能会在 DOMContentLoaded 之前或之后。
***2.正因为加了 defer 或者 async 的脚本不会阻塞 DOM 的加载，所以，内部不应该有操作 DOM 的行为。***
2.defer 脚本下载和执行都不会阻塞DOM，async下载不会阻塞DOM，但是执行有可能阻塞DOM。
3.多个 async 的脚本并不会保证按照它们在文档中的先后顺序执行。
4.async 的脚本下载和解析不会阻塞 DOM，解析完成之后执行的时候会阻塞 DOM


#### 最后引用网上的一张图
![https://i.stack.imgur.com/wfL82.png](http://zhoushirong.github.io/img/deferasync.png)


#### 传送门
[浅谈script标签中的async和defer](https://cloud.tencent.com/developer/article/1093912)