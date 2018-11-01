---
title: rpc与thrift简介
date: 2018/07/31
tag: [rpc, thrift, nodejs]
---

现如今都流行大前端开发，所谓的大前端就是，将后端的传统的MVC（model、view、controler）中的view和controler给接过来。
将view接过来这个没什么问题，最近的vue、react等框架，以前的静态html页面，ftl模板等都是干这种事情的，没什么好说。
但是，如果要将controler给接过来，就有些麻烦了。
最直接的问题就是需要搞定服务器内部服务之间的通讯

对于Jser来说，就是需要搞定nodejs和其它语言（如java）之间的通讯。

### 通讯方式
对于Jser来说，最简单，最熟悉，最好用的莫过于直接通过http请求调用接口了。
这种方式最实用，也最好实现，这个也是我之前公司用的方式。（中小型公司首选）

但是，http协议设计最初是为了实现web与服务器之间的通讯。
而http请求是基于http协议的，因此存在有很多web浏览器定制的信息。这对于服务器之间的通讯来说这些信息就是冗余信息了。
除此之外，http通讯对于大规模的后端服务器之间数据交互还是存在一定的性能问题的。

http协议并不是服务器之间通讯的最理想协议。

那么，除了http协议，还有其他的方式来做服务器之间的通讯吗？
当然有，而且目前在后端开发领域还很常见，那就是RPC。
而作为Jser，要想搞定controler层，RPC就是必须得啃的骨头了。


### rpc是什么？
```html
rpc(remote procedure call)远程过程调用，是一个计算机通信协议。
该协议允许运行在一台计算机的程序调用另一台计算机的子程序。
如果涉及的软件采用面向对象编程，那么远程过程调用亦可称作远程调用或远程方法调用。
```

### IDL是什么？
```html
IDL（Interface Description Language）接口描述语言。
是一个描述软件组件接口的语言“规范”。
为了不同服务器能够访问服务器，需要定制一些标准化的RPC，大部分采用的接口描述语言。
IDL采用一种中立的方式来描述接口，使得不同平台上运行的对象和用不同语言编写的程序可以相互通信交流。
```

### rpc框架？
rpc框架有很多，目前用的比较多的有：gRPC、Thrift、Dubbo
```html
Dubbo是阿里开源的一款rpc框架
gRPC是google开源的一款rpc框架
Thrift是facebook开源的rpc框架
```

其中，阿里巴巴开源的Dubbo在国内是最流行的RPC框架（我厂java后端就是用的这个）。
当然，据我了解，目前阿里内部都用HSF，据说是继Dubbo之后的下一代RPC框架。
只是，目前HSF并没有开源。

---

*当然，thrift也是用的挺多的，至少我之前在网上搜索node-java通讯，搜出来的很多结果都是说用thrift进行通讯，于是顺便了解了一下thrift。*

### thrift 是什么？
```html
thrift是一种接口描述语言和二进制通讯协议，它被用来定义和创建跨语言的服务。
它被当做一个远程过程调用（RPC）框架使用。
早期由Facebook“为大规模跨语言服务”而开发的。现在是Apache软件基金会的开源项目。
```

### thrift与IDL
```html
thrift采用IDL来定义通用的服务接口，然后通过thrift提供的编译器，可以将服务接口编译成不同语言编写的代码，通过这种方式来实现跨语言通信。
thrift是一个基于IDL生成跨语言的RPC clients and services。
```

### thrift使用？
```html
1.安装
https://thrift.apache.org/docs/install/os_x
```

####  安装遇到问题：
```html
Couldn't find libtoolize!
```
解决：
```shell
brew reinstall libtool;
```

问题：
```html
configure: error: Bison version 2.5 or higher must be installed on the system!
```
解决：
```shell
brew install bison # 缺什么安装什么
export PATH=/usr/local/Cellar/bison/3.0.5/bin:$PATH # 安装完成之后设置环境变量
```

问题：make报错
```html
'boost/tokenizer.hpp' file not found
```
解决：
```shell
brew install boost
```

问题：make报错
```html
make[3]: /usr/local/bin/bundle: No such file or directory
```
解决：
```html
好烦，有完没完。。。
```

这条路没完没了了，搜一下还有什么其他的方式吧，要不回去用brew安装一下试试？

```shell
brew install thrift
```
解决
```html
好吧，安装成功了。
明明记得之前安装会报错的，在源码安装之前其实我有试过brew安装，但是也报了一个什么环境错误。
但是现在却能够安装成功。
唯一的解释是，上面的安装的那些环境包还是有用的。
理论上来说安装方式有多种：一种是通过源码一步一步编译、构建；另一种就是通过brew直接安装。
```

安装的过程中或多或少都会遇到一些环境问题，但是，只要一步一步去解决最终还是能搞定的。

至此，整个thrift安装就已经结束了。

---

作为程序员，不论学了什么，如果没有跑一个hello world！总觉得少了些什么。
要跑thrift的hello world，首先得有一个thrift服务端、一个thrift客户端。
既然我们是要做nodejs跟java的通讯，这个demo最好当然是用nodejs和java来互相通讯了。

但是，我不懂java...

好吧，其实thrift是rpc框架，不仅仅是跨语言通讯，更主要功能还是做服务器各个子服务之间的通讯。
（妥协）那就做一个nodejs跟nodejs之间的一个通讯吧。

### 使用thrift协议作为NODEJS之间的通讯实例。

第一步：
要创建一个thrift服务，必须写一些thrift文件来描述它，为目标语言生成代码，并且写一些代码来启动服务器及从客户端调用它。
下面是我从thrift上官网上扒下来的NODEJS版本的thrift例子的简化版。

tutorial.thrift文件，遵循IDL语法规则。
```thrift
// 命名空间
namespace js tutorial
// 定义接口方法
service Ping {
  void ping(),
}
```

通过thrift生成nodejs版本的代码

```shell
thrift --gen <language> <Thrift filename> # eg：thrift -r --gen js:node tutorial.thrift
```
通过上面的命令，会生成如下结构的两个文件（这两个文件不要手动修改）

```html
-gen-nodejs
  -Ping.js
  -tutorial_types.js
```

之后，用nodejs 分别写服务端和客户端文件，并引入上面thrift生成的文件。

```javascript
// 文件：./server.js

var thrift = require("thrift");
var Ping = require("./gen-nodejs/Ping");

var server = thrift.createServer(Ping, {
	// 接收到客户端的ping之后，打印一个ping()
  ping: function() {
    console.log("ping()");
    result(null);
  }
});

server.listen(9090);
```

```javascript
// 文件：./client.js
var thrift = require('thrift');
var Ping = require('./gen-nodejs/Ping');
const assert = require('assert');

var transport = thrift.TBufferedTransport;
var protocol = thrift.TBinaryProtocol;

var connection = thrift.createConnection("localhost", 9090, {
  transport : transport,
  protocol : protocol
});

connection.on('error', function(err) {
  assert(false, err);
});

// Create a Ping client with the connection
var client = thrift.createClient(Ping, connection);

function ping() {
  client.ping(function(err, response) {
    console.log('ping...');
  });
}

// 每一秒ping一次
setInterval(function() {
  ping()
}, 1000)
```

运行：
```shell
# 先运行服务端
node ./server.js
# 再运行客户端
node ./client.js
```

客户端控制台结果：
```html
ping...
ping...
ping...
...
```

服务端控制台结果：
```html
ping()
ping()
ping()
...
```

---

至此，我们就完成了一个完整的通过thrift协议进行nodejs之间的通讯了。
当然，上面只是一个最简单的例子。
要想做一个完整而复杂的thrift通讯还有很多事情要做。

得了解更多的IDL语法，动态生成获取thrift生成文件，服务的稳定性，容错性等。
几乎是需要搭建一整套thrift服务应用程序了。这个过程其实就是开发一个新的基础服务系统。
总算明白了为什么得大厂的jser才会玩rpc服务了。


 
### 传送门：

thrift的IDL
http://thrift.apache.org/docs/idl

NODEJS实例传送门：
https://thrift.apache.org/tutorial/nodejs

dubbo传送门
https://github.com/dubbo/dubbo2.js

