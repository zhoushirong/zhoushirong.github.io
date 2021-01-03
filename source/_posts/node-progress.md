---
title: Nodejs子进程
date: 2020/12/30
tag: [nodejs,child_process,cluster]
category: 技术
---

进程是CPU分配资源的最小单位，分配独立内存，进程之间可通信，但是必须通过内核，使用IPC接口来做，代价比较大
线程是CPU调度的最小单位

javascript 语言本身被发明出来就是为浏览器服务的，所以为了在浏览器端渲染的界面的时候不会被来自不同金IC的数据干扰，js执行环境被设计成了单进程执行。
但是在作为Nodejs使用的时候，为了最大发挥服务器的多核优势，Nodejs也被安排了多进程的能力。而为其提供多进程能力的核心模块就是 child_process
child_process提供了衍生子进程的能力，主要由child_process.spawn()函数提供。
默认情况下， stdin、 stdout 和 stderr 的管道会在父 Node.js 进程和衍生的子进程之间建立，这些管道的容量是有限的。

#### child_process.spawn
nodejs还提供了一些基于child_process.spawn的一些替代方法，都是基于 child_process.spawn() 或 child_process.spawnSync() 实现的。
```html
// 来自[官方文档](http://nodejs.cn/api/child_process.html)
child_process.exec(): 衍生 shell 并且在 shell 中运行命令，当完成时则将 stdout 和 stderr 传给回调函数。
child_process.execFile(): 类似于 child_process.exec()，但是默认情况下它会直接衍生命令而不先衍生 shell。
child_process.fork(): 衍生新的 Node.js 进程，并调用指定的模块，该模块已建立了 IPC 通信通道，可以在父进程与子进程之间发送消息。
child_process.execSync(): child_process.exec() 的同步版本，会阻塞 Node.js 事件循环。
child_process.execFileSync(): child_process.execFile() 的同步版本，会阻塞 Node.js 事件循环。
```

#### cluster
cluster模块是基于child_process.fork方法创建的，它可以使用IPC和父进程进行通信。
![图片](http://zhoushirong.github.io/img/child_process.png)

cluster 模块可以创建共享服务器端口的子进程，因此常常被用作nodejs的多进程部署，pm2的cluster模式就是利用了此方法。
1.利用cluster创建子进程的方法
```javascript
const cluster = require('cluster')
const http = require('http')
const numsCPUS = require('os').cpus().length
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`)
  for( let i = 0; i < numsCPUS.length; i++) {
    cluster.fork() // fork出来的子进程拥有和父进程一致的、独立的资源(数据空间、堆、栈)等。
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
    cluster.fork() // 重新fork子进程
  })
} else { // 业务逻辑代码
  http.createServer((req, res) => {
    res.writeHead(200)
    res.end('hello world\n')
  }).listen(8000)
  console.log(`worker ${process.pid} started`)
}
```

2.cluster实现原理
cluster其实就是对于child_process模块的封装，通过child_procress.fork()出子进程，同时基于IPC实现了与master进程之间的通信。
master进程创建一个socket，并绑定监听到该目标端口，通过与子进程之间建立IPC通道，调用子进程的send方法，将socket（链接句柄）传递给子进程，大致实现如下。
```javascript
// master.js
const { fork } = require('child_process')
const cpus = require('os').cpus()
const net = require('net')
const workers = []
for (let i = 0; i < cpus.length; i++) {
  workers.push(fork('./worker.js'))
}

const handle = net._createServerHandle('0.0.0.0', 8000) // 其实这个handle就是我们的业务逻辑(app.js)
handle.listen()

handle.on('connection', (err, handle) => {
  const worker = workers.pop()
  worker.send({}, handle)
  workers.unshift(worker)
})
```
子进程的接收到来自主进程的消息以及句柄之后
```javascript
// worker.js
const net = require('net')
process.on('message', (message, handle) => {
  const socket = new net.socket({ handle })
  socket.readable = true
  socket.writable = true
  socket.end(['data', message])
})
```



### 传送门
Nodejs cluster模块深入探究：
https://cloud.tencent.com/developer/article/1061912
Nodejs 进阶：解答 Cluster 模块的几个疑问：
https://cloud.tencent.com/developer/article/1600191


pm2的cluster模式与fork模式的区别
https://github.com/mopduan/team/issues/19

浏览器进程与线程梳理
https://segmentfault.com/a/1190000012925872

cluster子进程重启方案
https://javascript.ruanyifeng.com/nodejs/cluster.html

cluster 模块的实现原理
https://cloud.tencent.com/developer/article/1600191