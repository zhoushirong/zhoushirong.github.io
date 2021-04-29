
---
title: Nodejs 中的 Stream
date: 2021/04/23
tag: [file, stream]
category: 技术
---

## 一个简单的例子
```javascript
const fs = require('fs')
const txt = fs.readFileSync('./small.txt', 'utf8')
console.log(txt)
```

## Stream(流) 是什么
Stream 中文翻译是“流”，在日常开发中我们有很多接触到流的机会。

在 Nodejs 中也实现了 Stream，他在 Nodejs 中是用来处理流式数据的抽象接口。
Stream 模块构建实现了流接口的对象。

Http 服务器的请求，process.stdout 都是流的实例。

所有的 Stream 都是 EventEmitter 的实例。

流是一个抽象接口，被 Nodejs 中很对对象实现。

流中流动的是什么？
1）二进制模式，buffer 或者 string 对象
2）一系列普通对象

## 为什么要有 Stream
在计算机处理任务的过程中，通常会把数据加载到内存中，但是当数据过大时，不可能把所有数据都放在内存里。
另一个重要的原因是内存的IO速度高于HD和网络的IO速度，又不能让内存一直处于 pending 状态，所以需要缓冲区和 Stream。
例如，文件大小可能大于 Node.js 默认缓冲区大小，从而无法将整个文件读入内存以进行处理。
这时就需要一种方法来分段处理数据，而最理想的结果是 有序地加载一点，处理一点 。
所以你可以把流 Stream 理解为—— 有序的数据块处理过程。

## 流数据的处理的两个特点
节约内存 ：无需先在内存中加载大量数据，然后再进行处理
提升时效 ：无需等待数据全部加载完成后才能开始处理，在第一个分段数据就可以开始处理数据，这可以极大提升数据处理时效

所以说流（Stream）是指数据（Data），而不是容器。
流的容器是管道（Pipeline），即运输装置。
流的本意是模拟水流的特性，水流从上游流动到下游，编程里的流也是一样的。
对于单个流处理器（工序）而言，上一个流处理器（工序）就是上游，下一个就是下游。

## 编程里面流一般有两个工作模式
一是“流动模式”，就是说数据源源不断地从上游而来，你只要不断地处理即可。但是每道工序消耗的时间不同，如果你处理不过来，数据就累积在你的缓冲区里面，越来越多，直到你的缓冲区爆掉；（相当于 Push 模式）
二是“非流动模式”，数据也会来，但是你要手动从流中提取数据，你不提取数据就存留在上游的发送缓冲区里，最后上游的发送缓冲区爆掉了。（相当于 Pull 模式）因此实现流也要考虑流的“溢出”。

## 接触过的流
视频流、音频流
文件上传、下载
请求流、响应流、socket流，底层都是对 Stream 的封装。

### stream 的实现

## Nodejs 中的流
流（stream）是 Node.js 中处理流式数据的抽象接口。 stream 模块用于构建实现了流接口的对象。
Node.js 提供了多种流对象。 例如，HTTP 服务器的请求和 process.stdout 都是流的实例。
流可以是可读的、可写的、或者可读可写的。 所有的流都是 EventEmitter 的实例。

Node.js 中有四种基本的流类型：

Writable - 可写入数据的流（例如 fs.createWriteStream()）。
Readable - 可读取数据的流（例如 fs.createReadStream()）。
Duplex - 可读又可写的流（例如 net.Socket）。
Transform - 在读写过程中可以修改或转换数据的 Duplex 流（例如 zlib.createDeflate()）。
此外，该模块还包括实用函数 stream.pipeline()、stream.finished() 和 stream.Readable.from()。

Node.js 创建的流都是运作在字符串和 Buffer（或 Uint8Array）上


## Nodejs fs 模块
文件的同步读取和异步读取
文件的同步写入
文件的追加写入
fs模块继承 Event {EventEmitter}

Node.js 的 stream 模块 提供了构建所有流 API 的基础。 所有的流都是 EventEmitter 的实例。


## 文件的读取方式
1.一次性读取到文件中
2.以水流的形式通过管道传送到目的地 stream 边读边取，io 的方式读取大文件，节省时间和空间


```javascript
/*
 以流的形式读取文件
*/ 
var fs = require('fs');
var rs = fs.createReadStream('filename', 'utf-8') // 得到的 rs 是一个输出流句柄，通过事件触发得到它到状态

// 数据开始读取...
// data 事件可能会读取多次，每次读取一块数据
rs.on('data', function (chunk) {
    console.log('DATA:')
    console.log(chunk)
})

// 读完触发
rs.on('end', function () {
    console.log('END')
})

// 错误触发
rs.on('error', function (err) {
    console.log('ERROR: ' + err)
})


/* 
 以流的形式写入文件
*/
var fs = require('fs')
var ws = fs.createWriteStream('filename', 'utf-8')
ws.write('1') // 一点
ws.write('2') // 一点
ws.end() // 写入

```

直接读写
```javascript
let water = fs.readFileSync('a.txt', { encoding: 'utf8' })
fs.writeFileSync('b.txt', water)
```
这种读写方法，实现方式是，先将整个文件内容存放到内存当中，然后直接从内存中写入
缺点：
1.如果文件过大，不能分块处理，会导致内存不足，处理速度慢

以流的形式读写
```javascript
var fs = require('fs');
var readStream = fs.createReadStream('a.mp4'); // 创建可读流
var writeStream = fs.createWriteStream('b.mp4'); // 创建可写流

readStream.on('data', function(chunk) { // 当有数据流出时，写入数据
    writeStream.write(chunk);
});

readStream.on('end', function() { // 当没有数据时，关闭数据流
    writeStream.end();
});
```


### pipe
```javascript
var fs = require('fs')
var rs = fs.createReadStream('a.txt') // 输出流
var ws = fs.createWriteStream('b.txt') // 输入流
rs.pipe(ws) // 输出通过管道流向输入

/* 
 上面做的工作，是读取 a.txt 的内容，写入到 b.txt
 在 Linux 中它有一个名字，叫做 “重定向”
*/
```

### pipeline
由于pipe 不安全，应使用 pipeline 代替 pipe。

```javascript
const { createReadStream } = require('fs');
const { createServer } = require('http');
const server = createServer(
  (req, res) => {
    createReadStream(__filename).pipe(res);
  }
);

server.listen(3000);
```
当请求连接关闭的时候，这个文件流的读取不会被销毁，导致内存泄漏。

```javascript
const { createReadStream } = require('fs');
const { createServer } = require('http');
const { pipeline } = require('stream');

const server = createServer(
  (req, res) => {
    pipeline(
      createReadStream(__filename),
      res,
      err => {
        if (err)
          console.error('Pipeline failed.', err);
        else
          console.log('Pipeline succeeded.');
      }
    );
  }
);

server.listen(3000);
```

fs.readFile在读取小文件时很方便，因为它是一次把文件全部读取到内存中
但是如果是一个3G的文件，那么就会出现内存不够的情况

此时就需要用到 Stream 了。

### 不同类型的四类流

可读，Readable: 可以通过管道读取、但不能通过管道写入的流（可以接收数据，但不能向其发送数据）。 
当推送数据到可读流中时，会对其进行缓冲，直到使用者开始读取数据为止。
fs.createReadStream()

可写，Writable: 可以通过管道写入、但不能通过管道读取的流（可以发送数据，但不能从中接收数据）。
fs.createWriteStream()

双工，Duplex: 可以通过管道写入和读取的流，基本上相对于是可读流和可写流的组合。
net.Socket

转化流，Transform: 类似于双工流、但其输出是其输入的转换的转换流。
在读写过程中可以修改或转换数据的 Duplex 流，转换流（Transform）也是一种 Duplex 流，但它的输出与输入是 相关联的 。
与 Duplex 流一样， Transform 流也同时实现了 Readable 和 Writable 接口。
（例如 zlib.createDeflate() ）。


### 流的特点
1.事件： 所有流都是 EventEmitter 的实例，所以不同的流也具有不同的事件，事件也就是告知外界自己自身的工作状态的方式。
2.独立缓冲区： 可读流和可写流都有自己的独立缓冲区，而双工流和转换流是同时实现了可读流与可写流，则内部会同时有可读流缓冲区与可写流缓冲区。
3.字符编码： 我们通常在进行文件读写时，操作的其实是字节流，所以在设置流参数 options 时需要注意编码格式，这是会影响 chunk 的内容和大小。而可读流与可写流默认的编码格式并不同，而每种不同的流也都不相同，所以在使用流操作前一定要先看默认参数设定，以免发生数据积压问题。

```javascript
// fs.createReadStream 默认 encoding为 null
const readableStream = fs.createReadStream(smallFile, { encoding: 'utf-8', highWaterMark: 1 * 256 }); 
/**
 * 1. fs.createWriteStream 默认encoding为utf-8, 但是如果在创建时不设置，则具体encoding 以实际write()时写入数据为准
 * 2. 可以通过writable.setDefaultEncoding(encoding)去设置，效果同上
 * 3. 如果设置了默认的encoding，则写入时只可以写入指定类型
 * 4. 编码类型直接影响字节数，如果以下代码不设置，则会影响write()方法写入压缩数据（导致写入文件字节数与定义highWaterMark不符合预期）
 */
const writeableStream = fs.createWriteStream(upperFile, { encoding: 'utf-8', highWaterMark: 1 * 25 });
// 读取文件的内容chunk size 远大于 可写流一次写入的字节的大小，所以会触发 'drain' 事件以等待排空积压在可写流缓冲器中的数据
```
4.highWaterMark：可读流和可写流都会在内部的缓冲器中存储数据 ，对于非对象流来说， highWaterMark 指定了 字节 的总数。
实际上 highWaterMark 只是一个 阈值 ，它并 不会限制写入缓冲的数据大小 ，除非直接突破 Node.js 缓冲区最大值。
数据是被 缓冲 ，而不是 缓存 


### 可读流的两种模式
作为源头的可读流有两个工作模式： 流动（flowing） 和 暂停（paused）
在流动模式中，数据自动从底层系统读取，并通过 EventEmitter 接口的事件尽可能快地被提供给应用程序。
在暂停模式中，数据会堆积在内部缓冲器中，必须显式调用 stream.read() 读取数据块。

所有可读流都开始于暂停模式 ，可以通过以下方式切换到流动模式：

添加 'data' 事件句柄。
调用 stream.resume() 方法。
调用 stream.pipe() 方法将数据发送到可写流。


可读流可以通过以下方式 切换回 暂停模式：

如果没有管道目标，则调用 stream.pause() 。
如果有管道目标，则移除所有管道目标。调用 stream.unpipe() 可以移除多个管道目标。
默认情况下，所有可读流均以 暂停模式 开始，但可以很轻易地将其切换为 流动模式 ，如有必要也可以在两种模式中来回切换。

当可读流处于暂停模式时，我们可以使用 read() 方法按需从流中读取数据。但是，在流动模式下，数据会一直不断地被读取，如果没有及时消费数据，则可能丢失数据。所以在流动模式中，我们需要通过 'data' 事件来获取并处理数据。


## 使用流实现的一个 http 服务器
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // req 是一个 http.IncomingMessage 实例，它是可读流。
  // res 是一个 http.ServerResponse 实例，它是可写流。

  let body = '';
  // 接收数据为 utf8 字符串，
  // 如果没有设置字符编码，则会接收到 Buffer 对象。
  req.setEncoding('utf8');

  // 如果添加了监听器，则可读流会触发 'data' 事件。
  req.on('data', (chunk) => {
    body += chunk;
  });

  // 'end' 事件表明整个请求体已被接收。 
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      // 响应信息给用户。
      res.write(typeof data);
      res.end();
    } catch (er) {
      // json 解析失败。
      res.statusCode = 400;
      return res.end(`错误: ${er.message}`);
    }
  });
});

server.listen(1337);
```

## 如何创建新类型的流实例


### 总结

**stream 模块本身主要用于开发者创建新类型的流实例**
对于以消费流对象为主的开发者，极少需要直接使用 stream 模块。

可缓冲的数据大小取决于传入流沟槽函数的 highWaterMark 选项。
对于普通的流，hightWaterMark 制定了字节的总数
对于对象模式的流，highWaterMark 指定了对象的总数



使用 pipeline 替代 pipe
可读流可以使用 Readable.from() 直接创建
使用 Promise 包装可写流避免数据积压问题
可以使用异步迭代器 消费 可读流（异步迭代器可以迭代可迭代对象和迭代器，同时也可以迭代可读流）


3种方式从暂停模式切换到流动模式：
1.on data 事件监听
2.调用 resume 方法
3.调用 pipe 方法

2中方式从流动模式切换到暂停模式
1.调用 pause 方法
2.unpipe 删除所有管道

可读流的 readable 事件：
当创建一个流的时候，就会先将缓存区填满。
当消费小于最高水位线的时候，会自动填满缓存区数据至最高水位线。
当缓存区被清空以后，会再次触发 readable 事件



## 扩展
以流的形式进行接口的返回


有太多的例子证明有时 Readable 传输给 Writable 的速度远大于它接受和处理的速度！
如果发生了这种情况，消费者开始为后面的消费而将数据列队形式积压起来。写入队列的时间越来越长，也正因为如此，更多的数据不得不保存在内存中知道整个流程全部处理完毕。
写入磁盘的速度远比从磁盘读取数据慢得多，因此，当我们试图压缩一个文件并写入磁盘时，积压的问题也就出现了。因为写磁盘的速度不能跟上读磁盘的速度。


## 文件上传和下载



1.Node.js 流
http://nodejs.cn/learn/nodejs-streams

2.nodejs 流的积压处理
https://nodejs.org/zh-cn/docs/guides/backpressuring-in-streams/

3.背压机制与 hightWaterMark
https://cnodejs.org/topic/5b8bb226632c7f422e5b83ca

4.Stream 的原型链
https://juejin.cn/post/6854573219060400141

5.流 - 知乎
https://zhuanlan.zhihu.com/p/36728655


6.文件流的实现
https://github.com/Aaaaaaaty/Blog/issues/28


7.nodejs 大文件下载

8.
https://nodesource.com/blog/understanding-streams-in-nodejs/

9.模拟实现和深入理解Node Stream内部机制
https://juejin.cn/post/6844903558060441614

10.深入理解 Node Stream 内部机制
https://www.barretlee.com/blog/2017/06/06/dive-to-nodejs-at-stream-module/

11.nodejs中的stream
https://segmentfault.com/a/1190000014138192

12.美团关于流的文章
https://github.com/zoubin/streamify-your-node-program/blob/master/docs/gulp.md


13.受益匪浅的关于流的文章
https://www.cnblogs.com/wanghui-garcia/p/9798158.html

14.nodejs学习博客
https://github.com/koala-coding/goodBlog




node.js 提供了流的抽象类。
stream.Readable 可读抽象类。
stream.Writable 可写抽象类。

文件系统、网络系统、加密解密、压缩解压模块中都使用了流，根据自身系统的需要扩展了stream模块的抽象类。

流的本质就是让数据能够流动起了

stream不是node.js独有的概念，而是一个操作系统最基本的操作方式，只不过node.js有API支持这种操作方式。linux命令的 | 就是stream。


linux管道符 
Linux所提供的管道符“|”将两个命令隔开，管道符左边命令的输出就会作为管道符右边命令的输入。
```
$ cat if.js | wc -l
$ ps -ef | grep node
```