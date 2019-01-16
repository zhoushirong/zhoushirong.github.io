---
title: node与dubbo接口
date: 2019/01/16
tag: [dubbo, nodejs]
---

对于一个很少写后端服务的前端开发者来说，开发一个 nodejs 应用，并通过 nodejs 服务代理调用其它服务（如java）提供的 http 接口还是很容易理解的。
无非就是将原本在 client 端的调用转到 nodejs 端来做。

但是，随着业务的扩大（nodejs服务技术的积累），渐渐的 jser 们开始不再满足于单单作为一个 http 请求中转站了。
开始为 nodejs 争取更大的适用范围，包括调用缓存服务（如:redis）、调用数据库（如:mysql)。
当然，对于一些大厂，一些后端业务比较复杂的情形，更为常见的是通过“RPC”来进行数据调用。

#### 什么是 RPC 调用？
官方解释：RPC（Remote Proceduce Call）远程过程调用，是一种通过网络从远程计算机程序上请求服务的操作。
我的理解是：
1.可以在同一台机器上的不同进程之间进行数据交换。
2.可以在同一机房不同机器之间进行数据交换。
3.可以在不同机房、不同地域之间进行数据交换。

从上面的解释可以看出，在 nodejs 端进行 http 请求转发其实也可以算是一种 RPC 调用。
但是，此处，我想要介绍的却不是 http，而是另外的‘RPC’调用方式。

#### 为什么 Nodejs 要接入 ‘另外的 RPC ’调用方式呢？
其实，之前我们使用 nodejs 开发的后端服务使用http已经足够满足当前的业务需求了。
那么，为什么还需要接入另外的 RPC 框架呢？

下面是个人总结的原因：
```html
1.性能，对于内网调用，在 http 未经过特别优化的情况下，Http 调用性能并不好，三次握手就占据了大部分时间。
2.通用性，我们公司我所在的部门后端服务之间的互相调用都是用的非 Http 协议，如果我们接入 Nodejs 需要后端同学专门为我们提供 http 接口。
3.技术积累，虽然目前 http 服务能够满足业务，但是难保以后不会切这种模式。
```

#### 如何选择另外的‘RPC’框架？
RPC 调用有很多种方式，互联网发展这么多年，目前市面上已经发展出了很多框架。
其中比较常用的有：
```html
Dubbo：阿里巴巴开源的一个分布式服务框架
Motan：新浪微博开源的 Java 框架
gRPC：Google 开发的开源 RPC 框架
Thrift：Facebook 开发的一个 RPC 框架，采用 thrift 作为 IDL
jsonrpc：一个无状态轻量级的 RPC 框架
```

没有最好的框架，只有最适合自己的才是最好的。
经过一番了解与实践，我们的 Nodejs 服务最终的选择是 Dubbo。

#### 为什么选择 Dubbo
既然市面上有那么多 RPC 框架，为什么我们要选择 Dubbo 呢？
原因如下：
```html
1.框架统一性，我厂 java 后端目前使用的 RPC 框架是 Dubbo，因此 Nodejs 同样使用 Dubbo 能减少一些麻烦。
2.目前国内 nodejs 社区相对比较活跃，用的比较成熟的 rpc 框架也是 dubbo。
3.Dubbo 框架是阿里开源的，文档是中文，而且很详细。
```

#### Dubbo 简介
既然框架已经确定了，那么接下来就是如何接入 Dubbo 了，在此之前，我们需要明白 Dubbo 是什么？
官方说法：
```html
Dubbo 是一个分布式服务框架，致力于提供高性能和透明化的 RPC 远程服务调用方案，以 SOA 服务治理方案。
```
Dubbo 是阿里开源的一个 java 的分布式服务框架，原来是专门为 java 服务的，之前一段时间停止维护了，但是后面又宣布开始维护了。于是，在 Nodejs 兴起之后，就有一些个人或者企业做起了 Nodejs 端对 Dubbo 的接入。

其中相对用的比较多的有<a href="https://github.com/omnip620/node-zookeeper-dubbo" target="_blank">node-zookeeper-dubbo</a> 以及 <a href="https://github.com/dubbo/dubbo2.js">dubbo2.js</a>（官方推荐）。

如果仅仅只需要接入 Dubbo，通过上面两个框架就已经足够了，只要能够调通就能够正常的使用 java 方提供的 Dubbo 接口了。
但是，显然这样是不够的（亲身经历），如果不搞明白 Dubbo 的大概原理，遇到问题就直接懵逼了。
不说别的，至少 Dubbo 的大概框架得弄清楚一下，不然接口配置都不一定能配对。

因此，下面再简单介绍一下 Dubbo 这个框架（可以直接看<a href="http://dubbo.apache.org/zh-cn/docs/user/quick-start.html" target="_blank">官方文档</a>然后再回来）。
官方文档以及很详细了，就不过多介绍了。

下面补充一下官方文档上我觉得“不够直观”或者我觉得比较重要的东西。

#### Dubbo 组成。
其实，主要就是这一张图。
<img src="http://zhoushirong.github.io/img/dubbo-arc.png" alt="Dubbo 架构"/>
Dubbo 的核心就是上面这张图了，能看懂基本上也就明白了什么是 Dubbo 了。

Dubbo 分为几大块：
1.服务提供者（Provider）
2.服务消费者（Consumer）
3.服务调度者（Registry）
4.服务统计、管理者（Monitor）

这里提供者就是服务的提供方了，可以是 java、也可以是 nodejs。
当然，Nodejs 用作“服务提供方”的情形，阿里内部有这个操作，对于其它团队来说可能有些麻烦。
因此，这里我们所说的 nodejs 不用作提供方，仅仅用作消费方。

大致过程为：
```html
1.java 后端开发启动Dubbo服务，作为“服务提供者”，注册到“服务调度者（zookeeper）”
2.nodejs 作为消费者，启动服务，作为“服务消费者”，“服务调度者（zookeeper）在订阅服务”
3.服务调度者通知消费者服务状态。
4.经过调度，nodejs 消费方与 java 服务提供方建立直连，并将调用情况以统计的方式发送到“服务的统计管理者”
5.服务调度者与消费者和提供者建立长连接，实时监控服务状态，并及时通知提供者和消费者。
```

#### Dubbo 协议报文消息格式
Dubbo 默认使用 Dubbo 协议，Hessian2 序列化方式。适合传入参数数据包较小，消费者比提供者个数多的场景。

下面是其中一帧数据的数据格式：
header：存放一些协议信息

位数 | 0-7 | 8-15 | 16-23 | 24-31 | 32-95 | 96-127
--|--
含义 | magic heihgt | magic low | request and serializtion flag | response status | request id | body length

dubbo 采用固定长度的消息头：16个字节（128bit），不固定长度的消息体来进行数据传输

2byte（0-15）:类似java字节码文件里的魔数，用来判断是不是dubbo协议的数据包，类似 class 类文件里面的作用，用来标识一帧的开始，魔数是常量0xdabb。
1byte（16-23）：消息标志位，16-20 序列 id, 21 event, 22 two way, 23 请求或响应标识。
1byte（24-31） 状态，当消息类型为响应时，设置响应状态。24-31位。状态位, 设置请求响应状态，dubbo定义了一些响应的类型。
8byte（32-95）： 消息ID, long类型，每一个请求的唯一识别id（由于采用异步通讯的方式，用来把请求request和返回的response对应上）
4byte （96-127）：消息长度，96-127位。消息体 body 长度, int 类型，即记录Body Content有多少个字节。


### 附录
Dubbo 协议：消息状态码
```java
/**
* ok.
*/
public static final byte OK = 20;

/**
* clien side timeout.
*/
public static final byte CLIENT_TIMEOUT = 30;

/**
* server side timeout.
*/
public static final byte SERVER_TIMEOUT = 31;

/**
* request format error.
*/
public static final byte BAD_REQUEST = 40;

/**
* response format error.
*/
public static final byte BAD_RESPONSE = 50;

/**
* service not found.
*/
public static final byte SERVICE_NOT_FOUND = 60;

/**
* service error.
*/
public static final byte SERVICE_ERROR = 70;

/**
* internal server error.
*/
public static final byte SERVER_ERROR = 80;

/**
* internal server error.
*/
public static final byte CLIENT_ERROR = 90;

/**
* server side threadpool exhausted and quick return.
*/
public static final byte SERVER_THREADPOOL_EXHAUSTED_ERROR = 100;
```


### 传送门

Dubbo 官方文档：
http://dubbo.apache.org/zh-cn/docs/user/quick-start.html
Dubbo2.js github 地址：
https://github.com/dubbo/dubbo2.js
NodeZookeeperDubbo github 地址：
https://github.com/omnip620/node-zookeeper-dubbo