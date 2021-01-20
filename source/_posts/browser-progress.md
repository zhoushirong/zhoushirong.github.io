---
title: 浏览器线程与进程
date: 2020/12/29
tag: [浏览器,browser,线程,进程,事件循环,硬件加速]
category: 技术
---

进程是CPU分配资源的最小单位，分配独立内存，进程之间可通信，但是必须通过内核，使用IPC接口来做，代价比较大
线程是CPU调度的最小单位，同一个进程下面可以有多个线程。

浏览器是作为前端开发者绕不开的话题，理解浏览器的运行原理是每个前端开发者进阶的必经之路。
javascript 语言本身当初被发明出来就是为浏览器服务的，只是后面Nodejs的出现为它赋予了更大的能力。

### 浏览器进程
1.browser主进程：负责浏览器界面显示、用户交互、资源管理。
2.第三方插件进程：每一个插件对应一个进程
3.GPU进程：只有一个，负责3D绘制
4.浏览器渲染进程：每个tab都有一个渲染进程，负责页面渲染，脚本执行，事件处理

浏览器多进程优势：充分利用多核优势、方便沙盒隔离插件等进程、防止单页面或者单插件crash影响其他页面。

#### 浏览器渲染进程：包含多个线程
1.GUI线程：负责渲染浏览器界面，解析html、js、css，构建DOM树、CSS树，完成布局和绘制、回流、重绘等。
2.JS引擎线程：JS内核，负责处理Javascript脚本，解析和运行JS代码（如V8引擎），一个TAB页中仅有一个JS线程在运行JS程序。
注意：GUI线程和JS引擎线程是互斥的，当JS引擎线程执行的时候，GUI线程会被挂起，阻塞页面渲染。待JS引擎空闲的时候才会继续执行。
3.事件触发线程：归属于浏览器而不是JS引擎，用来控制事件循环。当执行setTimeout/鼠标点击/Ajax请求等事件时，会将对应异步任务添加到事件线程中。当事件符合触发条件时，该线程会将其添加到事件队列的队尾，等待JS引擎线程处理。由于JS是单线程的，所以一定得等到JS引擎空闲的时候才会依次处理这些队列中的事件。
4.定时触发器线程：比如setTimeout、setInterval
5.异步http请求线程：在XMLHttpRequest在连接后是通过浏览器新开一个线程进行请求的，检测到状态变更后，如果设置了回调，则会产生状态变更事件，放入事件队列中，最后由Js线程执行。

#### GUI线程和JS引擎线程互斥的原因
浏览器刻意如此设计的，因为JS是可能操作DOM的，如果GUI正在渲染的时候，JS操作了DOM，就会可能出现JS获取的DOM在GUI渲染前后获取的不一致，导致最终渲染的结果与期待的结果不一致。

#### WebWorker 与 ShareWorker
WebWorker是JS引擎向浏览器申请的一个子线程，可在浏览器端实现密集运算，为Web内容在一个独立的后台线程中允许脚本提供了一种简单的方法，不能操作DOM。
JS引擎和Worker通过postMassage API通信。
这个和JS引擎是单线程的说法并不冲突。
ShareWorder是浏览器单独为其开了一个进程来运行Javascript，所有的GUI线程共享同一个ShareWorder。

#### 浏览器渲染过程
1.浏览器输入url，Browser主进程开启一个下载线程，下载网站内容，下载完成之后通过RenderHost接口转交给Renderer进程。
2.GUI线程解析DOM树、CSS树、合并DOM树和CSS树，计算元素尺寸位置完成Render布局，绘制页面像素信息，发送给GPU，GPU将各层合成(composite)生成图像，显示在屏幕上。此时触发页面load事件。

#### 渲染和性能、硬件加速
1.css不会阻塞DOM加载和解析，但是会阻塞Render树渲染。
2.GPU中各个复合图层是单独绘制的。
3.元素开启硬件加速之后会变成独立的复合层，此后改变改元素只会影响当前复合层，不会影响别的复合层。能够避免整个页面重绘。
4.硬件加速原理就是将元素变成复合图层，通过为复合层单独分配资源来渲染而实现渲染加速。（如果复合层过多会导致大量资源的消耗，同样影响性能）
5.webkit css3中，如果元素加了硬件加速，且设置了index层级，那么在这个元素后面 层级高于或等于该元素层级的元素会被隐式转换未复合图层。
注意：position-absolute虽然脱离普通文档流，但是未脱离复合层，因此，即使设置了absolute，也还是在同一个复合层当中。

开启GPU加速的方法有 transform动画、opacity动画、translateZ()/translate3D、will-change等
```css
.example1 {
  transform: translateZ(0);
}
.example2 {
  transform: rotateZ(360deg);
}
```

#### JS EventLoop
1.JS引擎为单线程执行的，浏览器中js执行任务分为同步任务和异步任务，同步任务在主线程中执行，形成一个执行栈。主线程之外，事件触发线程管理着任务队列，异步任务有了结果之后就会进入此队列中，当主线程中的同步任务执行完毕之后就会读取异步任务队列，将可执行的任务放入执行栈中执行。

#### 定时器线程
js中跑的setTimeout、setInterval等定时器，是一个单独的线程管理的控制的，当计时完成就会将特定的事件推送到事件队列中。等待主线程执行。
由于setTimeout在 timers 阶段执行，而setImmediate在 check 阶段执行，所以，setTimeout会早于setImmediate完成。但是，setTimeout 定时时间默认可能不是0ms，而是3ms或者更多，所以，setImeediate 也可能在 setTimeout 之前执行。

#### microTask
microTask是当前task执行结束之后，下一个task之前，渲染之前立即执行的任务。（如：promise、process.nextTick等，mutationobserver 可用来实现微任务）
process.nextTick() 的回调将在事件循环继续之前解析，所以微任务里面，process.nextTick 会在 promise 等其他微任务之前执行。


### 传送门
[https://segmentfault.com/a/1190000012925872](https://segmentfault.com/a/1190000012925872)
