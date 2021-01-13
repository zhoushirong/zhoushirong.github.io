---
title: Http3基础
date: 2021/01/13
tag: [http3,http]
category: 笔记
---

#### http2.0 相对于 http1.0 的优点
http2.0的出现确实给互联网带来了很多的好处，相比于http1.0已经好很多很多了。
```html
二进制分帧，二进制协议替代原来的超文本文本协议，二进制格式在协议的解析和优化扩展上带来更多的优势和可能
头部压缩，使用HPACK压缩头部信息，减少冗余信息的传输，节约带宽
多路复用，多个请求可通过一个TCP连接进行并发完成。支持优先级和流量控制
服务端推送，可以将js和css等资源预先推送到客服端(浏览器内存中)，当客户端使用的时候不需要重新拉取。
保护网站安全，只有https的网站可以使用http2.0，确保信息不回被明文传输。
```

#### QUIC 协议简介
QUIC（ Quick UDP Internet Connections）,快速 UDP 网络连接，是一种实验性的网络协议，基于UDP协议在两端之间进行通信，支持多路复用。
2018年10月，互联网工程任务组 HTTP 及 QUIC 工作小组正式将基于 QUIC 协议的 HTTP（英语：HTTP over QUIC）重命名为HTTP/3以为确立下一代规范做准备。
QUIC旨在提供几乎等同于TCP连接的可靠性，但延迟大大减少
QUIC使用UDP协议作为其基础，每个QUIC流是单独控制，在QUIC级别而不是UDP级别重传丢失的数据。如果在一个流中发生错误，协议栈仍然可以独立地继续为其他流提供服务。

大多数情况下 TCP 协议通知数据包丢失或损坏之前可能会收到大量的正常数据，但是在纠正错误之前其他的正常请求都会等待甚至重发
而QUIC 在修复单个流时可以自由处理其他数据，也就是说即使一个请求发生了错误也不会影响到其他的请求。


#### http3.0相对于 http2.0 的优点
优点都是比出来的，没有完美的技术，看起来极好极好的很完美的http2.0，其实也有存在很多问题
```html
一是对线头阻塞(HOL)问题的解决更为彻底，TCP传输数据时时，若一个数据包出现问题，TCP需要等待该包重传后，才能继续传输其它数据包，而QUIC基于UDP协议，一条链接上可以有多个流，当UDP数据包在出问题需要重传时，并不会对其他流的传输产生影响。同时还可以对关键包发送多次，从而解决队头阻塞问题。

快速重启会话，切换网络时也能连接保持，可以内建与TCP中不同的连接标识方法，从而在网络完成切换之后，恢复之前与服务器的连接

快速建立网络连接，最快零RTT建立连接，目前TCP与SSL/TLS(1.0,1.1,1.2)每次建连需要TCP三次握手+安全握手，需要4~5个RRT（RTT耗时包括三部分：往返传播时延、网络设备内排队时延、应用程序数据处理时延。），QUIC的 0RTT 对于第一次交互的客户端和服务端也是做不到的。

前向安全。即使被人抓包存储起来，在未来某个时间点秘钥被破解后仍然不能解密。
```

#### http3.0 为什么使用 udp 而不使用 tcp
基于TCP开发的设备和协议非常多，兼容困难
提供了0-RTT支持，客户端可以在完成TLS协商前请求数，建立连接速度快
TCP协议栈是Linux内部的重要部分，修改和升级成本很大
UDP本身是无连接的、没有建链和拆链成本
UDP的数据包无队头阻塞问题
UDP改造成本小，tcp的历史包袱太重，改造成本太大
#### http3.0 初体验
由于当下http3.0还是正式推出，Nginx当前最新版本也不支持配置，所以如果要自己在自己的网站上使用http3.0还是很麻烦的，还得自己编译一个nginx内核。

当然，如果仅仅是感受一下http3.0还是很简单的
Google 搜索，Gmail 或者 Youtube官网，当前都已经使用了 Http3 协议了，只不过该功能被隐藏了起来。
要想感受一下http3.0请求，只需在最新版本的chrome浏览器，然后给它开启 QUIC 特性即可。

本人当前chrome版本
```html
版本 87.0.4280.141（正式版本） (x86_64) 
```
开启方式
```html
在 chrome://flags/ 中找到 Experimental 中 QUIC protocol, 设置为Enabled. 重启浏览器生效
```
![http://zhoushirong.github.io/img/http3-1.png](http://zhoushirong.github.io/img/http3-1.png)

判断自己的浏览器是否成功开启了http3.0的方法
```html
开着控制台访问Google，看看http请求是否是http3.0的协议
```
![http://zhoushirong.github.io/img/http3.png](http://zhoushirong.github.io/img/http3.png)

或者安装这个chrome插件
```html
在 chrome store 里面安装 HTTP/2 and SPDY indicator 插件
```
安装之后如果看到插件栏有一个闪电图标说明开启成功了，此后如果访问http3请求的网站，这个图标会变成绿色。



#### 什么是队头阻塞简介
队头阻塞 Head-of-line blocking(缩写为HOL blocking)是计算机网络中是一种性能受限的现象，通俗来说就是：一个数据包影响了一堆数据包
队头阻塞问题可能存在于HTTP层和TCP层，在HTTP1.x时两个层次都存在该问题。
HTTP2.0协议的多路复用机制解决了HTTP层的队头阻塞问题，但是在TCP层仍然存在队头阻塞问题。
TCP协议在收到数据包之后，这部分数据可能是乱序到达的，但是TCP必须将所有数据收集排序整合后给上层使用，如果其中某个包丢失了，就必须等待重传，从而出现某个丢包数据阻塞整个连接的数据使用。

### 传送门
[为什么HTTP3.0使用UDP协议](https://network.51cto.com/art/202009/625999.htm)

[一文读懂 HTTP/2 及 HTTP/3 特性](https://blog.fundebug.com/2019/03/07/understand-http2-and-http3/)

[http2/http3协议有什么优劣](https://github.com/LuckyWinty/fe-weekly-questions/issues/3)

[QUIC协议浅析与HTTP/3.0](https://www.jianshu.com/p/bb3eeb36b479)