---
title: 实时通信与socket
date: 2021/01/06
tag: [长连接]
category: 技术
---

在很久之前浏览器要实现一个与服务端的实时双端通信（比如聊天系统）只能通过http轮询来做
当然，除此之外也有利用了flash实现一个socket来作为中转的方式。

后来随着web应用的越发成熟，html5推出了webSocket协议，webSocket协议的出现大大的提高了浏览器与服务端实时通信的效率与性能。
随着浏览器设备的不断更新升级，webSocket的逐渐成为了实时通信的主流方式

#### 那么webSocket的优势在哪里呢？
首先，跟flash相比，不需要再加载一个flash，少了一个中间中转环节；其次，flash本身在浏览器端就存在很多比如安全、性能等问题，当下flash已经退出了浏览器客户端的舞台了。
至于对比http轮询方式，简单来说就是少去了三次握手和四次挥手的过程，也省掉了相对冗余的http头信息，极大的减少了通讯时间和节省了带宽资源。

#### 基础知识
TCP协议对应于传输层，而HTTP协议对应于应用层，Http协议是建立在TCP协议基础之上的，是一个超文本传输协议。
当浏览器需要从服务器获取网页数据的时候，会发出一次Http请求。 Http会通过TCP建立起一个到服务器的连接通道，当本次请求的数据完毕后，Http会立即将TCP连接断开，这个过程是很短的。要想通过http建立实时通信，必须每隔一段时间发起一个请求询问服务器一次。
当然http也可以开启长链接，增长tcp断开的时间，一定程度上减少http建立连接的耗时。但是http冗余的请求头数据还是无法得到解决。

Socket 就像一个电话插座，负责连通两端的电话，进行点对点通信，让电话可以进行通信，端口就像插座上的孔，端口不能同时被其他进程占用。 
而我们建立连接就像把插头插在这个插座上，创建一个Socket 实例开始监听后，这个电话插座就时刻监听着消息的传入，谁拨通我这个“IP 地址和端口”，我就接通谁。
Socket 起源于 UNIX，在 UNIX 一切皆文件的思想下，进程间通信就被冠名为文件描述符（file descriptor），Socket 是一种“打开—读/写—关闭”模式的实现，服务器和客户端各自维护一个“文件”，在建立连接打开后，可以向文件写入内容供对方读取或者读取对方内容，通讯结束时关闭文件。

服务端代码只有处理完一个客户端请求才会去处理下一个客户端的请求，这样的服务器处理能力很弱，而实际中服务器都需要有并发处理能力，为了达到并发处理，服务器就需要 fork 一个新的进程或者线程去处理请求。
#### http2.0通讯方式
好在，前面说的http都是说的http2.0以前的http，随着http2.0标准的普及，越来越多的浏览器都支持了此标准。
http2.0的特点是支持多路复用、压缩请求头、采用二进制传输数据。
因此理论上来说使用http2.0协议来建立长连接，也是一种替代websocket的手段。

#### http2.0轮询与webSocket的比较
```html
安全与解密：
1）WebSocket 支持明文通信 ws:// 和加密 wss://
2）而 HTTP/2 协议虽然没有规定必须加密，但是主流浏览器都只支持 HTTP/2 over TLS.

消息推送：
1）WebSocket是全双工通道，可以双向通信。消息直接推送给 Web App。
2）HTTP/2 虽然也支持 Server Push，但是服务器只能主动将资源推送到客户端缓存,并不允许将数据推送到客户端里跑的 Web App 本身
服务器推送只能由浏览器处理，不会在应用程序代码中弹出服务器数据，这意味着应用程序没有 API 来获取这些事件的通知。为了接近实时地将数据推送给 Web App， HTTP/2 可以结合 SSE（Server-Sent Event）使用。这是一种新提出的 API，用于从服务端单向将数据推送给 Web App.
3）WebSocket 在需要接近实时双向通信的领域，很有用武之地。而 HTTP/2 + SSE 适合用于展示实时数据，另外在客户端非浏览器的情况下，使用不加密的 HTTP/2 也是可能的。
```

#### websocket与Socket
tcp/ip协议是一个协议栈，必须要具体实现以及对外提供操作接口，tcp/ip对外提供的操作接口就是 socket
socket跟tcp/ip并没有必然的联系，socket被设计的时候就希望能够适应其它网络协议，所以socket编程接口的出现只是可以更方便的的使用tcp/ip协议栈。
其对tcp/ip进行抽象，形成了几个基本的函数接口：create、listen、accept、connect、read、write等
不同语言都对应的建立了socket服务和客服端服务库。
nodejs可以通过net模块。
```javascript
const net = require(‘net’)
const server = net.createServer()
server.on('connection', client => {
  client.write(‘Hi \n’)
  client.end(‘Bye\n’)
})
server.listen(9000)
```
```html
curl http://127.0.0.1:9000
Hi
Bye!
```
与socket连接的不一定只有浏览器，也可能是其它服务器或者其他客户端，比如可以用另一个Nodejs应用来做client端来进行连接。
```javascript
// client
const net = require('net')
const server = net.createServer()
server.on('connection', client => {
  client.write(‘Hi \n’)
  client.end(‘Bye\n’)
})
// Hi
// Bye
```

当然，实际使用过程并不会如此简单，至少得在服务端维护一个连接池，专门用来管理连接
而客户端也需要有相应的容错机制，比如重连和心跳等。
```html
长连接：连接 -> 数据传输 -> 心跳 -> 数据传输 -> 心跳 -> … -> 关闭连接
```

与socket名称相似的webSocket，其实两个并不是同一个东西。
socket本身并不是一个协议，它工作在OSI模型会话层，是一个套接字，是tcp/ip网络的api，是为了方便大家直接使用底层协议而存在的一个抽象层，是传输控制层协议。
而WebSocket 却是应用层协议，是一个html5的协议（当然并不是说只能用在html5，其它客户端也可以按照此标准实现自己的），是一个典型的应用层协议。websocket和http一样都是建立在tcp之上的，通过tcp传输数据
```html
websocket属性：Socket.readyState、Socket.bufferedAmount
0 - 表示连接尚未建立
1 - 表示连接已建立，可以进行通信
2 - 表示连接正在进行关闭
3 - 表示连接已经关闭或者连接不能打开
websocket事件：open、message、error、close、
websocket方法：send、close
```

### 传送门
https://zhuanlan.zhihu.com/p/51279572
https://baibingqianlan.github.io/2019/07/04/websocket%E4%B8%8Ehttp%E8%BD%AE%E8%AF%A2.html
SSE
https://www.ruanyifeng.com/blog/2017/05/server-sent_events.html
[socket通信原理](https://segmentfault.com/a/1190000013712747)
