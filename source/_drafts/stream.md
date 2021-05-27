
---
title: Nodejs 中的 Stream
date: 2021/05/27
tag: [file, stream]
category: 技术
---

## 一、Stream(流) 基础介绍
Stream 中文翻译“流”。
其一个重要的的特点就是为按需处理，即“读一点数据处理一点数据”。
日常生活中最常见的“流”就是音视频流了。
当然，作为编程人员我们知道，除了音视频流，还存在字节流、比特流等。

流连续且没有头尾，没有绝对位置，它不是一个容器，只是一个抽象概念，可以理解为是对程序与外界交换数据的一种抽象。

在数据处理上，流处理是最常见也是最实用的处理的方式。
比如 Unix 操作系统中的管道运算符。
```shell
$ cat logfile.txt | grep 2021/05/20
```
如上命令的作用就是查看日志文件 `logfile.txt` 中包含 '2021/05/20' 字符串的日志记录。
管道符 '|' 让左边 cat 命令查看的数据，像流水一样流向右边，作为 grep 命令的输入，而 grep 命令就是一个过滤网，过滤掉不需要的数据。
仅仅留下 '2021/05/20' 相关的日志。

类似于上面的例子，我们日常编程中也用到了很多类似文件操作，最常见的就是对于磁盘文件的读写了。
市面上比较流行的编程语言都实现了自己的流，Nodejs 就是其中之一。

作为前端开发，日常生活中接触最多的语言就是 javascript，而早期的 Javascript 作为网页脚本语言，本身是没有实现流的。
直到后来 Nodejs 的出现。
Nodejs 作为后端编程语言，它提供了很多 Javascript 没有的能力，集成在它的核心模块里面。
Nodejs 的 Stream 模块就是 Nodejs 语言对于流的实现。

## 二、Nodejs 核心模块 Stream 在生产环境中的运用
平时使用 Nodejs 做一些小工具开发或者使用 Koa/express 开发后端应用的时候，很少甚至可以说没有直接用到 Stream 模块。
我们很难在某个 Nodejs 应用中找到直接使用 stream 模块的代码，比如
```javascript
const stream = require('stream')
```

但是我们一定很熟悉这样的代码。
```javascript
const http = require('http');
const fs = require('fs');
http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  const stream = fs.createReadStream('./index.html')
  stream.pipe(res)
}).listen(3000)
```
如上代码中的 ```http``` 和 ```fs``` 模块让我们可以用个位数的代码行数实现一个 http 服务器。
能够让我们如此便利编写服务器应用，其背后的模块就是 ```stream```。

### 那么 Stream 模块在 Nodejs 处于一个什么位置呢？
Stream 模块本身主要用于开发者创建新类型的流实例，对于以消费流对象为主的开发者，极少需要直接使用 Stream 模块。
它类似于一个基类，其它模块都是继承此基类实现的子类。
http 请求的 req/res 以及 fs 模块的 createReadStream 等都是基于 stream 的实现。

如下图
![stream简单依赖关系](http://zhoushirong.github.io/img/jiandan.png)
http 依赖于 event、stream、buffer
fs 依赖于 event 和 stream、buffer

上面只是一个简化版的依赖关系图，其实际比这个复杂的多，比如
![stream复杂的依赖关系](http://zhoushirong.github.io/img/fuza.png)

当然，这几个模块作为nodejs 的基础能力，与其它模块以及互相之间依赖关系其只会更复杂。
有兴趣可以去 Nodejs 源码逐个分析了解，本文的重心还是在于介绍 Stream。

### Stream 的作用
对于实现一个 http 服务器的例子，或许有人会想到这样的代码。
```javascript
const http = require('http')
const fs = require('fs')
const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  // 直接读取文件
  fs.readFile('./bigindex.html', 'utf8', (err, data) => {
    res.end(data)
  })
}).listen(3000)
```
这段代码和前面例子的区别在于，读取文件的方式。
前面是创建文件流，然后将文件流通过 pipe 方法传送给 res。
后面的例子值直接读取整个文件，然后将文件通过 end 方法返回。

看上去没什么问题，两中方式都能实现。
如果我们实际写一个 index.html 文件来运行也不会出现什么问题。

那么哪种方式更好呢？
```html
答案是：第一种，使用文件流的形式。
```

但是，为什么呢？
因为我做了一个测试，我创建了一个特别大的 html 文件特别大，1G+。
然后第一个例子能正常跑，第二个例子直接报错了。
```html
url is http://localhost:3000/
Error: Cannot create a string longer than 0x1fffffe8 characters
    at Object.slice (buffer.js:608:37)
    at Buffer.toString (buffer.js:805:14)
    at FSReqCallback.readFileAfterClose [as oncomplete] (internal/fs/read_file_context.js:68:23) {
  code: 'ERR_STRING_TOO_LONG'
}
```
很明显，报错的原因字符串过长。
当我们使用 `fs.readfile` 或者 `fs.readfileSync` 的时候是先将文件存储在内存中，一次性读取
一次性读完之后再进行下一步，如果文件过大，就会导致存不下的时候就会出错。


因此，对于大文件，很明显不能直接读文件。
那么，为什么第一个例子中不会报错呢？
答案就是 Stream。
采用流处理的方式不会报错，哪怕文件再大都没问题。

你怎么选？
![通过内存读取文件](http://zhoushirong.github.io/img/kangshui.png)
![通过stream传输文件](http://zhoushirong.github.io/img/shuiguan.jpeg)

---

看了上面的实例，你一定会想知道，到底是为什么呢？
为什么使用流就不会报错呢？
接下来，让我们一起去探索探索。


## fs.createReadStream 的实现。
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
ReadStream.prototype._read = function(n) {/* */}
ReadStream.prototype._destroy = function(err, cb) {/* */}
ReadStream.prototype.close = function(cb) {/* */}
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

那么它是如何实现的呢？
通过查阅 `ReadStream.prototype._read`源码可知，其最最核心的原力就是重写了`_read()`方法。
```javascript
// 精简版本
ReadStream.prototype._read = function (n) {
  let toRead = n;
  this[kFs].read(this.fd, pool, pool.used, toRead, this.pos, (er, bytesRead) => {
    this.push(b);
  });
  this.pos += toRead;
};
```
`toRead`是n参数，表示一次读取的数据大小
`this.fd`是文件描述符，`this.pos`表示读取文件的位置
`this.[kFs]`就是 fs 模块对象，调用 fs.read 方法实现选择性读取文件数据块。
通过分析可知，`_read`方法其实就是一个少量多次读取文件的实现方式。

## 如何实现自己的 Stream。
前面分析了 `fs.createReadStream` 的实现过程，可以看出它就是对于 Stream 的一个继承实现。
而核心方法 `ReadStream.prototype._read`就是实现了一个少量多次读取文件数据的方法实现。
既然如此，我们是不是也可以实现自己的 `createReadStream`呢？
答案是肯定的。

```javascript
// MyReadStream.js
const { Readable } = require('stream');
const fs = require('fs')
class MyReadStream extends Readable {
  constructor(path, options = {}) {
    super(options);
    this.pos = 0
    this.fd = fs.openSync(path, 'r') // fs.open 创建文件描述符
  }
  _read(n) {
    if (n <= 0) return this.push(null);

    const buffer = Buffer.allocUnsafeSlow(n);
    /**
     * fd 文件描述符
     * buffer 是一个缓冲区，读取的数据将会写入到这里，默认大小Buffer.alloc(16384)
     * offset 是开始向缓冲区 buffer 写入数据时的偏移量
     * length 是整数，指定要读取的字节数
     * position 是整数，指读取的文件起始位置
     * 
     * bytesRead is how many bytes were read from the file
     * buf 指缓冲区
     */
    fs.read(this.fd, buffer, 0, n, this.pos, (err, bytesRead, buf) => {
      if (bytesRead > 0) {
        this.pos += bytesRead;
        if (bytesRead !== buf.length) {
          const dst = Buffer.allocUnsafeSlow(bytesRead);
          // buffer.copy( target, targetStart, sourceStart, sourceEnd )
          // 从buf中提取 0-bytesRead 位置的数据，拷贝至 dst 0-end 的位置
          buf.copy(dst, 0, 0, bytesRead);
          buf = dst;
        }
        this.push(buf);
      } else {
        // 如果等于0，表示读取结束。
        this.push(null);
      }
    });
  }
}
module.exports = MyReadStream
```

MyReadStream 类的调用方法
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


## 关于 Stream 类。
```javascript
const { Readable } = require('stream');
```
无论是 `fs.createReadStrea` 还是 `./my-read-stream.js` 都可以看到第一行包含了上述语句。
它是干什么的呢？

从源码可以看出，关键类 `Readable`，它是实现 ReadStream 的一个核心类，而这个类是由`stream` 库提供的。
从 nodejs 源码中可以找到这个类所在的文件 stream.js
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
1.Stream 类继承了 events
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
从源码不难看出，Stream.Readable 方法来自于文件 `internal/streams/readable`
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

## pipe 方法
```javascript
const stream = new MyReadStream('./index.html')
stream.pipe(res)
```
上面实现了 MyReadStream 类，搞清楚了流从哪里来
那么`stream.pipe(res)`是如何去的呢？
就是上面列出来的 `internal/streams/readable.js`文件中的 `Readable.prototype.pipe`方法。
```javascript
Readable.prototype.pipe = function(dest, pipeOpts) {
  const src = this;
  // 流的基本信息存储
  const state = this._readableState;
  state.pipes.push(dest);
  dest.on('unpipe', onunpipe);
  src.on('data', ondata);
  function ondata(chunk) {
    // 写入数据到dest
    const ret = dest.write(chunk);
    if (ret === false) {
      if (!cleanedUp) {
        src.pause();
      }
      if (!ondrain) {
        dest.on('drain', ondrain);
      }
    }
  }
  dest.once('close', onclose);
  dest.once('finish', onfinish);
  dest.emit('pipe', src);
  if (!state.flowing) {
    src.resume();
  }
  return dest;
};
```
`pipe` 方法主要调用`dest.write(chunk)`实现了数据的写入，除此之外还添加了一些事件的监听。
最后返回数据流 dest，而，http 的 res 实质上也是一个流的实现,因此，可以很容易的通过 pipe 将数据进行流转。

## 流的工作过程

使用`.push()`将数据推进一个 readable 流中时，一直要到另一个东西来消耗数据之前，数据都会存在一个缓冲器中。
想要的是当需要数据时数据才会产生，以此来避免大量的缓存数据，我们可以通过定义一个 `._read` 函数来实现按需推送数据。
只有在数据消耗者出现时，`_read` 函数才会被调用。

数据源 ——> 管道 ——> 缓冲区 ——> 目的地
1.readable 从数据源 file 读取数据
  1) 创建的可读流对象可是二进制模式(buffer|string) 或者 普通对象模式
  2) 读出的数据名为 readableStream，此时流状态为 paused(暂停)
  3) 当创建一个流的时候，就会先将缓存区填满，缓存区大小为 hightWaterMark

2.两种方式将 paused 变为 flowing(流动)状态，触发数据开始流动
  1) 通过 on('data', ...) 事件触发 readableStream 的数据的流动
  2) 通过 resume() 方法触发数据流动
  3) 通过 pipe() 方法将数据转接到另一个 writeable 对象

3.数据暂停
  1) 当调用方式为 pipe() 时，先移除 data 的监听事件，然后调用 stream.unpipe() 方法清除所有管道，流状态将变为 paused
  2) 当调用方式为非 pipe() 时，调用 stream.pause() 方法可以将状态变为 paused
  3) 当流状态为 paused 的时候，调用 stream.read() 方法，可以按需从流中读取数据块
  4) 当数据 paused 的时候，数据会先存在上游的缓冲区里，缓冲区满了之后需要停止数据的读取
  5) 缓冲区数据满了之后，需要调用 on('drain', ...) 清空缓冲区的数据
  6) 当缓冲区被清空之后，会再次出发 readable 事件，读取数据存入缓冲区

ondata onreadable onpipe 区别？
当一个数据块可以从流中被读出时，会触发'readable'事件。
某些情况下，如果没有准备好，监听'readable'事件将会导致一些数据从底层系统读出到内部缓存。
当内部缓冲区被排空后，当有更多数据时，'readable'事件会被再次触发。

当可读流中有数据读出时会触发'data'事件，绑定'data'事件监听器，监听器绑定后如果流是暂停模式将会被切换到流动模式。
其监听函数callback(chunk)中有一个chunk参数，表示收到的数据块：
chunk {Buffer | String} 数据块 'data'事件监听器绑定后，数据会被尽可能地传递，如果你想从流尽快的取出所有数据，这是最理想的方式。

read()方法会从内部缓冲区中拉取并返回若干数据。
当没有更多可用数据时，会返回null。
使用read()方法读取数据时，如果传入了size参数，那么它会返回指定字节的数据；当指定的size字节不可用时，则返回null。
如果没有指定size参数，那么会返回内部缓冲区中的所有数据
该方法仅应在暂停模式时被调用，在流动模式中，该方法会被自动调用直到内部缓冲区被清空。


(未完，待补充...)

### 关于积压或背压(Backpressure)
背压指在异步场景下，被观察者发送事件速度远快于观察者处理的速度，从而导致下游的 buffer 溢出，这种现象叫作背压。
![背压成因](http://zhoushirong.github.io/img/back-pressure.jpeg)
比如上图，管道入口处一样大，入口数据也一样，但是中间或者出口因为各种因素被阻塞或者减小了口径，导致流动受阻，形成背压。

在流的系统中，当 Readable 传输给 Writable 的速度远大于它接受和处理的速度的时候，会导致未能被处理的数据越来越大，占用更多内存。
之后更多的数据不得不保存在内存中直到整个流程全部处理完毕，形成恶性循环，最终导致内存溢出。

### buffer、hightWaterMark 与背压问题的解决方法
```缓冲器(buffer)```是流的读写过程中的一个临时存放点，是一个独立于 V8 堆内存之外的内存空间。
利用缓冲器能够将少量、多次的数据进行批量的在磁盘中读写；也能够将大块文件分批少量的进行搬运。

```hightWaterMark```是一个可选参数，缓冲器中缓冲数据的大小取决于 highWaterMark 的值，它是一个阈值，默认 16kb (16384字节,对于对象模型流而言是 16)。
当缓冲器中数据达到 highWaterMark 的值时，会暂停从底层资源读取数据(readable._read)，直到当前缓冲器中数据被消费完。

<!-- stream API的一个核心目标（特别是stream.pipe()方法）是把缓存的数据控制在可接受范围内。例如，不同速度的源头和目的地缓存的数据不会超过可见内存。 -->


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




## 流的应用场景
文件系统、网络系统、加密解密、压缩解压模块中都使用了流，并且都根据自身系统的需要扩展了 Stream 模块的抽象类。


## 附录 - 名词简介
**比特流（bitstream或bit stream）** 是一个比特的序列。一个字节流则是一个字节的序列，一般来说一个字节是8个比特。也可以被视为是一种特殊的比特流。

**字节流（英语：byte stream）** 在计算机科学中是一种比特流，不过里面的比特被打包成一个个我们叫做字节（Bytes）的单位。

**流媒体（英语：Streaming media）** 是指将一连串的多媒体资料压缩后，经过互联网分段发送资料，在互联网上即时传输影音以供观赏的一种技术与过程，此技术使得资料数据包得以像流水一样发送，如果不使用此技术，就必须在使用前下载整个媒体文件。

**Buffer** (常被翻译为缓冲区)在 Node.js 中，Buffer 类是随 Node 内核一起发布的核心库。Buffer 库为 Node.js 带来了一种存储原始数据的方法，可以让 Node.js 处理二进制数据，每当需要在 Node.js 中处理I/O操作中移动的数据时，就有可能使用 Buffer 库。原始数据存储在 Buffer 类的实例中。一个 Buffer 类似于一个整数数组，但它对应于 V8 堆内存之外的一块原始内存。任何数据的读写都会产生缓冲区。