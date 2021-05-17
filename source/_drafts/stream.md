
---
title: Nodejs 中的 Stream
date: 2021/05/16
tag: [file, stream]
category: 技术
---

## 一、Stream(流) 基础介绍
Stream 中文翻译“流”。
流最主要的特点就是“读一点数据处理一点数据”，可以理解为按需处理。
日常生活中最常见的“流”就是音视频流了。
当然，作为编程人员我们知道，除了音视频流，还存在字节流、比特流等。

流的一个很重要的特点就是: 连续且可以没有头尾，没有绝对位置，只有相对位置。
流不是一个容器，它只是一个抽象的概念，可以理解为是对程序与外界交换数据的一种抽象。

市面上比较流行的编程语言都实现了自己的流，比如 Unix 操作系统中的管道运算符。
```shell
$ cat logfile.txt | grep 2021/05/20
```
如上述命令，`cat logfile.txt` 意思是查看日志文件 `logfile.txt`的所有日志信息，但是日志文件往往很大，如果所有的都显示显然会让人很头疼。
因此，管道符 '|' 出现了，管道符的作用就是让一边的数据像流水一样流向右边，作为右边 grep 命令的输入，而 grep 命令就是一个过滤网，过滤掉不需要的数据，仅仅留下 '2021/05/20' 相关的日志。

流的应用在日常生活中非常多，其实现方式也多种多样，作为前端开发，日常生活中接触最多的语言就是 javascript，而早期的 Javascript 作为网页脚本语言，本身是没有实现流的。
直到后来 Nodejs的出现，Nodejs 提供了很多核心模块，包括操作文件的 `fs` 模块，处理 http 请求的 `http` 模块等。正是这些模块的出现让我们的 javascript 语言一飞冲天，成为了编程语言界的主流语言之一。

然而，无论是文件和 http 请求的处理，其身后都离不开另一个核心模块，那就是 `Stream`, Stream 核心模块就是 Nodejs 中对于流的实现。


## 二、Nodejs 核心模块 Stream 在生产环境中的运用
就我个人感官，平时使用 Nodejs 做一些小工具开发或者网络后端 http 应用的时候，很少甚至可以说没有直接用到 Stream 模块。我们很难在某个 Nodejs 应用中找到类似这样的代码。
```javascript
const stream = require('stream')
```

是不是说我们可以不用关心这个模块呢？
很显然，不是。

### 那么 Stream 模块在 Nodejs 处于一个什么位置呢？
Stream 模块本身主要用于开发者创建新类型的流实例
对于以消费流对象为主的开发者，极少需要直接使用 Stream 模块。

Stream 类似于一个基类，其它模块都是继承此基类实现的子类。
那么他们到底是如何继承或者说使用 Stream 类的呢？

我们先看一个简单的 http 请求例子。
### http 请求例子
```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>hello world</title>
</head>
<body>
  hello world
</body>
</html>
```

```javascript
// http.js
const http = require('http')
const fs = require('fs')
const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  fs.readFile('./bigindex.html', 'utf8', (err, data) => {
    if (err) {
      console.log(err)
    }
    res.end(data)
  })
})
server.listen(3000, () => {
  console.log(`url is http://localhost:${3000}/`)
})
```
上面是一个简单的 http 请求服务器，返回 index.html。

看上去没什么问题，但是如果这个html文件特别大(如：1G+)会怎么？
亲测答案是：
```html
url is http://localhost:3000/
Error: Cannot create a string longer than 0x1fffffe8 characters
    at Object.slice (buffer.js:608:37)
    at Buffer.toString (buffer.js:805:14)
    at FSReqCallback.readFileAfterClose [as oncomplete] (internal/fs/read_file_context.js:68:23) {
  code: 'ERR_STRING_TOO_LONG'
}
Error: Cannot create a string longer than 0x1fffffe8 characters
    at Object.slice (buffer.js:608:37)
    at Buffer.toString (buffer.js:805:14)
    at FSReqCallback.readFileAfterClose [as oncomplete] (internal/fs/read_file_context.js:68:23) {
  code: 'ERR_STRING_TOO_LONG'
}
```
很明显，内存爆了(当然如果机器特别特别特别牛，也可能不爆)。
我们使用 `fs.readfile` 或者 `fs.readfileSync` 的时候是先将文件存储在内存中，直到读完为止再进行下一步的，如果文件过大，内存存不下的时候就会出错。

因此，对于大文件，很明显不能直接读文件
那么这种情况该如何处理呢？答案就是 Stream。
```javascript
const http = require('http')
const fs = require('fs')
const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  // 创建一个可读流，然后通过 pipe 将文件一点一点的返回
  const stream = fs.createReadStream('./bigindex.html')
  stream.pipe(res)
})
server.listen(3000, () => {
  console.log(`url is http://localhost:${3000}/`)
})
```
亲测，采用流处理的方式之后不会再报错，哪怕文件再大都没问题，而且在浏览器端肉眼可见其在边下载边显示。

你怎么选？
![通过内存读取文件](http://zhoushirong.github.io/img/kangshui.jpeg)
![通过stream传输文件](http://zhoushirong.github.io/img/shuiguan.png)

### fs.createReadStream 的实现。
从 Nodejs 官方文档可知，```fs``` 模块继承了 Stream，源码如下
```javascript
// node/lib/fs.js
function lazyLoadStreams() {
  if (!ReadStream) {
    ({ ReadStream, WriteStream } = require('internal/fs/streams'));
    FileReadStream = ReadStream;
    FileWriteStream = WriteStream;
  }
}
function createReadStream(path, options) {
  lazyLoadStreams();
  // ReadStream 来自 node/internal/fs/streams.js
  return new ReadStream(path, options);
}
```

从上述代码可以看出，其核心还是在 `internal/fs/streams.js` 中
```javascript
const { Readable, Writable, finished } = require('stream');

function ReadStream(path, options) {
  if (!(this instanceof ReadStream))
    return new ReadStream(path, options);
  //...
  // 其世界上调用了 stream 模块的 Readable
  ReflectApply(Readable, this, [options]);
}
ReadStream.prototype.open = openReadFs;
ReadStream.prototype._construct = _construct;
ReadStream.prototype._read = function(n) {
ReadStream.prototype._destroy = function(err, cb) {
ReadStream.prototype.close = function(cb) {
//...
module.exports = {
  ReadStream,
  WriteStream
};
```
从源码可看出，此文件导出两个类 `ReadStream` 和 `WriteStream`，我们暂时只关心 ReadStream。
很容易可以看出来，ReadStream 类最终继承自核心模块`stream`
通过后面关于 stream 的介绍可以很容易得出结论：
```html
fs.createReadStream 其实质上就是对于核心模块`stream`的一个继承实现。
```

## 如何实现自己的 Stream。
Stream 其实就是程序与外界交换数据的一种抽象，Nodejs 中的 Stream 就是该抽象的类。
前面通过对`fs.createReadStream`源码的简单分析也可以得知，它就是对于 Stream 的一个继承实现。
既然如此，我们是不是也可以实现自己的 `createReadStream`呢？
答案是肯定的。

```javascript
// MyReadStream.js
const { Readable } = require('stream');
const fs = require('fs')
class MyReadStream extends Readable {
  constructor(path, options = {}) {
    super(options);
    this.bytesRead = 0;
    this.fd = fs.openSync(path, 'r')

    if (this.start !== undefined) {
      this.pos = this.start;
    }
    if (this.end === undefined) {
      this.end = Infinity;
    }
  }
  _read(n) {
    n = this.pos !== undefined ?
      Math.min(this.end - this.pos + 1, n) :
      Math.min(this.end - this.bytesRead + 1, n);

    if (n <= 0) {
      this.push(null);
      return;
    }

    const buf = Buffer.allocUnsafeSlow(n);

    fs.read(this.fd, buf, 0, n, this.pos, (er, bytesRead, buf) => {
      if (bytesRead > 0) {
        if (this.pos !== undefined) {
          this.pos += bytesRead;
        }

        this.bytesRead += bytesRead;

        if (bytesRead !== buf.length) {
          const dst = Buffer.allocUnsafeSlow(bytesRead);
          buf.copy(dst, 0, 0, bytesRead);
          buf = dst;
        }

        this.push(buf);
      } else {
        this.push(null);
      }
    });
  }
}
module.exports = MyReadStream
```
使用自己的 MyReadStream 类
```javascript
const http = require('http')
const MyReadStream = require('./my-read-stream')

const server = http.createServer((req, res) => {
	res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  const stream = new MyReadStream('./index.html')
  stream.pipe(res)
})
server.listen(3000, () => {
	console.log(`url is http://localhost:${3000}/`)
})
```
上面的例子 MyReadStream 类其实就是继承了 `Stream.Readable`类，然后实现了自己的 `_read()`方法。
而 _read 方法的实现就是调用了`fs.read()`方法逐步读取文件内容，当文件读取完成之后 `this.push(null)`结束。

相信看了如上例子你已经对流的使用有了基本认识，对于`fs.createReadStream`有了很直观的了解了。
但是上面，仅仅是基于 Stream 的一个可读流的实现，那么 Stream 内部到底是什么样呢？


## 三、关于 Stream 类。
```javascript
const { Readable } = require('stream');
```
我们从上面可以看到一个关键类`Readable`，它是实现 ReadStream 的一个核心类，而这个类是由`stream` 库提供的。
从nodejs源码中可以找到这个类所在的文件 stream.js
```javascript
// node/lib/stream.js
const Stream = module.exports = require('internal/streams/legacy').Stream;
Stream.Readable = require('internal/streams/readable');
Stream.Writable = require('internal/streams/writable');
Stream.Duplex = require('internal/streams/duplex');
Stream.Transform = require('internal/streams/transform');
Stream.PassThrough = require('internal/streams/passthrough');
Stream.pipeline = pipeline;
```
从源码可以看出，Stream 类是基于 legacy 文件中的 Stream 创建的。
```javascript
// node/lib/internal/streams/legacy.js
const EE = require('events');
function Stream(opts) {
  EE.call(this, opts);
}
ObjectSetPrototypeOf(Stream.prototype, EE.prototype);
ObjectSetPrototypeOf(Stream, EE);
Stream.prototype.pipe = function(dest, options) {/*...*/}
```

从上面代码可以得出如下信息
```
1.Stream 类继承了events
2.Stream 类实现了Readable、Writable、Duplex、Transform、PassThrough、pipeline 类
```
也就是说，基于 Stream 创建的流是具有Event事件接口的。
且除了 Readable 方法之外还有其他的方法。
中文版官网原话
```html
流可以是可读的、可写的、或者可读可写的。 所有的流都是 EventEmitter 的实例。
```
Nodejs 中的 Stream 有四种主要基本的流类型
```html
Writable - 可写入数据的流，可以通过管道写入、但不能通过管道读取的流
Readable - 可读取数据的流，可以通过管道读取、但不能通过管道写入的流
Duplex - 可读又可写的流，可以通过管道写入和读取的流，基本上相对于是可读流和可写流的组合
Transform - 在读写过程中可以修改或转换数据的 Duplex 流。
```
```html
PassThrough - 类是一个无关紧要的转换流，只是单纯地把输入的字节原封不动地输出。 它主要用于示例或测试。
pipeline - 一个模块化函数，用于对接不同的数据流，可以处理异常错误并善后清理释放资源。它同时也提供了一个回调函数——当整个 pipeline 任务完成时将触发，可以用来替代 pipe 方法，使用 Promise 包装可写流避免数据积压问题
```

接下来继续探究 `Stream.Readable`方法。
从上面源码不难看出，Stream.Readable 方法来自于文件 `internal/streams/readable`
```javascript
// internal/streams/readable
// ...
Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undesroy;
Readable.prototype._destroy = function(err, cb) {/*...*/}
Readable.prototype.push = function(chunk, encoding) {/*...*/}
Readable.prototype.unshift = function(chunk, encoding) {/*...*/}
Readable.prototype.isPaused = function() {/*...*/}
Readable.prototype.setEncoding = function(enc) {/*...*/}
Readable.prototype.read = function(n) {/*...*/}
Readable.prototype._read = function(n) {
  // 调用这个方法直接报错，要想不报错，必须手动实现此方法。
  throw new ERR_METHOD_NOT_IMPLEMENTED('_read()');
};
Readable.prototype.pipe = function(dest, pipeOpts) {/*...*/}
Readable.prototype.unpipe = function(dest) {/*...*/}
Readable.prototype.on = function(ev, fn) {/*...*/}
Readable.prototype.off = Readable.prototype.removeListener;
Readable.prototype.removeAllListeners = function(ev) {/*...*/}
Readable.prototype.resume = function() {/*...*/}
Readable.prototype.pause = function() {/*...*/}
Readable.prototype.wrap = function(stream) {/*...*/}
```
如上就是 readable 文件提供的操作流的方法。
需要注意的是，其中`_read()`方法是一个抽象方法，这里直接抛出一个错误，这就是意味着如果要执行_read 方法，使用者必须自己实现。


## 流的工作过程及其注意事项(待完善...)

### 流中流动的数据格式
1）二进制模式，buffer 或者 string 对象
2）一系列普通对象

### 关于缓存与 highWaterMark
当创建一个流的时候，就会先将缓存区填满。
当消费小于最高水位线的时候，会自动填满缓存区数据至最高水位线。
当缓存区被清空以后，会再次触发 readable 事件

### 流的两个工作模式
作为源头的可读流有两个工作模式： 流动（flowing） 和 暂停（paused）
“流动模式”，就是说数据源源不断地从上游而来，你只要不断地处理即可。但是每道工序消耗的时间不同，如果你处理不过来，数据就累积在你的缓冲区里面，越来越多，直到你的缓冲区爆掉；（相当于 Push 模式）
此模式中，数据自动从底层系统读取，并通过 EventEmitter 接口的事件尽可能快地被提供给应用程序。

“非流动模式”，数据也会来，但是你要手动从流中提取数据，你不提取数据就存留在上游的发送缓冲区里，最后上游的发送缓冲区爆掉了。（相当于 Pull 模式）因此实现流也要考虑流的“溢出”。
此模式中，数据会堆积在内部缓冲器中，必须显式调用 stream.read() 读取数据块。

所有可读流都开始于暂停模式 ，可以通过以下方式切换到流动模式：
```html
添加 'data' 事件句柄，添加 on('data', ...) 事件监听
调用 stream.resume() 方法。
调用 stream.pipe() 方法将数据发送到可写流。
```

可读流可以通过以下方式 切换回暂停模式：
```html
如果没有管道目标，则调用 stream.pause() 。
如果有管道目标，则移除所有管道目标。调用 stream.unpipe() 可以删除所有管道。
默认情况下，所有可读流均以 暂停模式 开始，但可以很轻易地将其切换为 流动模式 ，如有必要也可以在两种模式中来回切换。
```
当可读流处于暂停模式时，我们可以使用 read() 方法按需从流中读取数据。但是，在流动模式下，数据会一直不断地被读取，如果没有及时消费数据，则可能丢失数据。所以在流动模式中，我们需要通过 'data' 事件来获取并处理数据。

### 关于积压或背压(Backpressuring)
有太多的例子证明有时 Readable 传输给 Writable 的速度远大于它接受和处理的速度。
如果发生了这种情况，消费者开始为后面的消费而将数据列队形式积压起来，写入队列的时间会越来越长，也正因为如此，更多的数据不得不保存在内存中知道整个流程全部处理完毕。
比如写入磁盘的速度远比从磁盘读取数据慢得多，因此，当我们试图压缩一个文件并写入磁盘时，积压的问题也就出现了。因为写磁盘的速度不能跟上读磁盘的速度，导致内存溢出。

以上，就是通过 ReadStream 的基本使用探索了 Nodejs Stream 的完整实现路径，并不涉及一些细节。

## 总结
流是一种抽象，流式处理是一种思想，一种渐进式处理数据的方式。

### 为什么要有 Stream
在计算机处理任务的过程中，通常会把数据加载到内存中，但是内存空间是有限的。
当数据量过大时，不可能把所有数据都放在内存里，此时就需要一种能够持续处理数据的方式，流式处理就是其中一个。

另一个重要的原因是内存的 IO 速度高于 HD 和网络的 IO 速度，又不能让内存一直处于 pending 状态。
所以需要缓冲区，而流处理恰好能够提供这样一个缓冲区。
它的优点
```html
节约内存 ：无需先在内存中加载大量数据，然后再进行处理
提升时效 ：无需等待数据全部加载完成后才能处理，从第一个分段数据就可以开始处理，极大提升了数据处理时效
```

### 流的特点
1.事件： 所有流都是 EventEmitter 的实例，所以不同的流也具有不同的事件，事件也就是告知外界自己自身的工作状态的方式。
2.独立缓冲区： 可读流和可写流都有自己的独立缓冲区，而双工流和转换流是同时实现了可读流与可写流，则内部会同时有可读流缓冲区与可写流缓冲区。
3.字符编码： 我们通常在进行文件读写时，操作的其实是字节流，所以在设置流参数 options 时需要注意编码格式，这是会影响 chunk 的内容和大小。而可读流与可写流默认的编码格式并不同，而每种不同的流也都不相同，所以在使用流操作前一定要先看默认参数设定，以免发生数据积压问题。
4.highWaterMark：可读流和可写流都会在内部的缓冲器中存储数据 ，对于非对象流来说， highWaterMark 指定了 字节 的总数。实际上 highWaterMark 只是一个 阈值 ，它并不会限制写入缓冲的数据大小 ，除非直接突破 Node.js 缓冲区最大值。数据是被 缓冲 ，而不是 缓存。
可缓冲的数据大小取决于传入流沟槽函数的 highWaterMark 选项。
对于普通的流，hightWaterMark 制定了字节的总数
对于对象模式的流，highWaterMark 指定了对象的总数



## 流的应用场景
文件系统、网络系统、加密解密、压缩解压模块中都使用了流，并且都根据自身系统的需要扩展了 Stream 模块的抽象类。


## 附录 - 名词简介
**比特流（bitstream或bit stream）** 是一个比特的序列。一个字节流则是一个字节的序列，一般来说一个字节是8个比特。也可以被视为是一种特殊的比特流。

**字节流（英语：byte stream）** 在计算机科学中是一种比特流，不过里面的比特被打包成一个个我们叫做字节（Bytes）的单位。

**流媒体（英语：Streaming media）** 是指将一连串的多媒体资料压缩后，经过互联网分段发送资料，在互联网上即时传输影音以供观赏的一种技术与过程，此技术使得资料数据包得以像流水一样发送，如果不使用此技术，就必须在使用前下载整个媒体文件。