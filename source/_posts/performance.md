---
title: performance
date: 2019/09/05
tag: [js, 性能, chrome, performance]
---

Performance 接口可以获取到当前页面中与性能相关的信息。它是 High Resolution Time API 的一部分，同时也融合了 Performance Timeline API、Navigation Timing API、 User Timing API 和 Resource Timing API

### performance
```javascript
{
  'memory': { // Chrome 添加的一个非标准扩展，提供了一个可获取到基本内存使用情况的对象。
    'jsHeapSizeLimit': 2197815296, // 最大可使用的内存，单位byte
    'totalJSHeapSize': 8406242, // 当前分配的内存大小
    'usedJSHeapSize': 7743450, // 当前活动的JS内存
  },
  'navigation': { // 返回一个 PerformanceNavigation 对象。这个对象表示出现在当前浏览上下文的 navigation 类型
    'type': 0,
    'redirectCount': 0 // 获取某个资源重定向的次数
  },
  'onelementtimingbufferfull': null,
  'oneventtimingbufferfull': null,
  'onresourcetimingbufferfull': null,
  'timeOrigin': 1567685364180.6497, // 高精度的时间戳，表示 performance 开始测量的时间
  'timing': {
    'redirectStart': 0, // 第一个HTTP的重定向开始的时刻的 Unix毫秒时间戳。如果重定向没有发生，或者其中一个重定向非同源，则该值返回 0。
    'redirectEnd': 0, // 最后一次的HTTP重定向被完成且HTTP响应的最后一个字节被接收之时的 Unix毫秒时间戳。如果没有发生重定向，或者其中一个重定向不同源，则该值返回 0。
    'secureConnectionStart': 0, // 安全连接握手开始的时刻的 Unix毫秒时间戳。如果只要你过的连接没有被请求，则它返回 0。
    'navigationStart': 1567685364175, // 紧接着在相同的浏览环境下卸载前一个文档结束之时的 Unix毫秒时间戳。如果没有上一个文档，则它的值相当于 PerformanceTiming.fetchStart。
    'fetchStart': 1567685364178, // 浏览器已经准备好去使用HTTP请求抓取文档之时的 Unix毫秒时间戳。这一时刻在检查应用的缓存之前。
    'domainLookupStart': 1567685364178, // 域名开始解析之时的 Unix毫秒时间戳。如果一个持久连接被使用，或者该信息已经被本地资源或者缓存存储，则该值等同于 PerformanceTiming.fetchStart。
    'domainLookupEnd': 1567685364178, // 解析域名结束时的 Unix毫秒时间戳。如果一个持久连接被使用，或者该信息已经被本地资源或者缓存存储，则该值等同于 PerformanceTiming.fetchStart。
    'connectStart': 1567685364178, // 请求连接被发送到网络之时的Unix毫秒时间戳。如果传输层报告错误并且连接的建立重新开始，则把最后建立连接的开始时间作为该值。如果一个持久连接被使用，则该值与 PerformanceTiming.fetchStart 相同。
    'connectEnd': 1567685364178, // 代表了网络链接建立的时间节点。如果传输层报告了错误或者链接又被重新建立，则采用最后一次链接建立的时间。如果链接是长久的，那么这个值等同于PerformanceTiming.fetchStart。链接被认为打开以所有的链接握手，SOCKS认证结束为标志。
    'requestStart': 1567685364182, // 浏览器发送从服务器或者缓存获取实际文档的请求之时的 Unix毫秒时间戳。如果传输层在请求开始之后发生错误并且连接被重新打开，则该属性将会被设定为新的请求的相应的值 。
    'responseStart': 1567685364514, // 浏览器从服务器、缓存或者本地资源接收到响应的第一个字节之时的 Unix毫秒时间戳。
    'unloadEventStart': 1567685364524, //  unload 事件被触发之时的 Unix毫秒时间戳。如果没有上一个文档，或者上一个文档或需要重定向的页面之一不同源，则该值返回 0。
    'unloadEventEnd': 1567685364525, // unload 事件处理程序结束之时的 Unix毫秒时间戳。如果没有上一个的文档，或者上一个文档或需要被跳转的页面的其中之一不同源，则该值返回 0。
    'responseEnd': 1567685364522, // 为浏览器从服务器、缓存或者本地资源接收响应的最后一个字节或者连接被关闭之时的 Unix毫秒时间戳。
    'domLoading': 1567685364536, // 解析器开始工作，即 Document.readyState 改变为 'loading' 并且 readystatechange 事件被触发之时的 Unix毫秒时间戳。
    'domInteractive': 1567685364865, // 在主文档的解析器结束工作，即 Document.readyState 改变为 'interactive' 并且相当于 readystatechange 事件被触发之时的 Unix毫秒时间戳。这个属性被用于测量用户感受的加载网页的速度。然而，如果脚本被屏蔽发生，而不是被异步加载或者使用了自定义的 Web 字体，这里有一些警告可能会发生。在使用这个值作为网页加载用户体验的媒介时，请务必检查一下你是否处于以上的情况。
    'domContentLoadedEventStart': 1567685364865, // 解析器发出 DOMContentLoaded 事件之前，即所有的需要被运行的脚本已经被解析之时的 Unix毫秒时间戳。
    'domContentLoadedEventEnd': 1567685364866, // 以UNIX时间戳的形式表示一个时刻，这个时刻为所有需要尽早执行的脚本不管是否按顺序，都已经执行完毕。（译注：即DOM Ready）
    'domComplete': 1567685365169, // 主文档的解析器结束工作，Document.readyState 变为 'complete'且相当于 readystatechange 事件被触发时的 Unix毫秒时间戳。
    'loadEventStart': 1567685365169, // 为 load 事件被现在的文档触发之时的 Unix时间戳。如果这个事件没有被触发，则他返回 0。
    'loadEventEnd': 1567685365171, // load 事件处理程序被终止，加载事件已经完成之时的 Unix毫秒时间戳。如果这个事件没有被触发，或者没能完成，则该值将会返回 0。
  },
}
```

### 其它 api
```javascript
performance.now() // 1108998.7549999934
```
返回一个精确到毫秒的高精度时间戳，表示从 timeOrigin 到当前调用此方法经过的时间


### 对performance.timing 进行排序
```javascript 
const timeOrigin = Math.floor(performance.timeOrigin)
const timing = performance.timing.toJSON()
const arr = []

// 对 timing 从小到大排序
for( let [key, value] of Object.entries(timing)) {
  const obj = {
    id: key,
    time: value,
    timelen: value - timeOrigin > 0 ? value - timeOrigin : 0
  }
  arr.push(obj)
}
arr.sort((a, b) => {
  return a.time - b.time
})
console.log(arr)
```



### 传送门
https://developer.mozilla.org/zh-CN/docs/Web/API/Performance