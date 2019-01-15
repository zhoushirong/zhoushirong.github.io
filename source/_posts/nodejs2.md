---
layout: default
title: NODEJS开发经验
date: 2019-01-15
tag: [nodejs, 服务端]
category: 笔记
---

前段时间做了一个 nodejs 应用，项目架构是 前端 vue 单页应用，后端 nodejs
其实有考虑 ssr，但是因开发时间比较紧张，就没能使用。
下面是开发过程中的一些经验以及遇到的一些问题。

### 一、技术架构
<img src="http://zhoushirong.github.io/img/nodejs.png" alt="koa洋葱模型" width="860px" />

具体项目技术栈如下：
client端: vue 全家桶、history-router
server端: koa、koa-router、redis+sentinel、msyql、java (java后端组同学开发)

### 二、项目目录
```html
client/ # 所有的前端文件
- node_module/ # 前端文件依赖包
- src/ # 前端代码源码
- webpack/ # 构建工具
- package.json # 前端依赖包文件
mock/ # mock数据，
- api/ #对后端的mock（接口数据）
- index.js #mock入口文件
node_modules/ # 项目启动开发工具依赖包
server/ # 服务端代码
- channel/ # 数据渠道、来源（java http、java dubbo、数据库、redis）
- config/ # 网站配置文件（环境配置、数据库、redis 配置等）
- middleware/ # 中间件
- model # 数据库数据模型层
- node_modules/ # 服务端依赖包
- router/ # 路由（controler层）
- tools/ # 一些常用工具函数
- app.js # 服务入口
- autoRouter.js #路由入口
- package.json # 后端依赖包文件
package.json # 公共项目依赖包文件
```

### 三、技术要点
##### promise、async await 
promise、async、await都属于javascript基础，这里略过。

##### client 端的请求
请求类型大概分为如下几类，以及各个类别对应的 koa 处理中间件模块

1.页面请求 —— history-router

2.静态资源请求 —— koa-static

3.favicon请求 —— koa-favicon

4.接口请求 —— koa-router

##### NODEJS 请求过程

<img src="http://zhoushirong.github.io/img/request1.png" alt="请求流程" width="560px" />

<img src="http://zhoushirong.github.io/img/request2.png" alt="请求接口模型" width="560px" />

##### koa 中间件、node端路由

中间件：中间件在请求和响应的过程中给我们一个修改数据的机会

中间件的功能包括：
1.执行任何代码。
2.修改请求和响应对象。
3.终结请求 - 响应循环。
4.调用堆栈中的下一个中间件


中间件是koa的核心，中间件return一个中间件函数，最好是用一个函数给封装起来，以便于传参和可扩展性。
本项目几乎所有路由处理都是通过中间件完成的。

中间件操作分为同步操作和异步操作。
同步操作很简单，处理完事务之后直接 await next() 到下一个中间件即可。
```javascript
function middleFunction(param1, param2) {
  return async function middle1(ctx, next) {
    if ('/middle1' == ctx.path) {
      ctx.body = { data: param1 + param2 }
    } else {
      await next();
    }
  }
}
```

异步中间件，也很好理解，就是在中间件内部进行处理的是一个异步流程。
我们可以借助 async 和 await 来处理异步事务。

```javascript
function middleFunction(param1, param2) {
  return async function middle3(ctx, next) {
    if ('/middle3' == ctx.path) {
      // 对于异步操作，await 必须等待一个promise对象
	  ctx.body = await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(param1 + param2)
        }, 3000)
      })
    } else {
      await next()
    }
  }
}
```

koa 中中间件是最核心的操作，因此往往会有很多中间件，中间件多意味着管理上需要花费更多的精力。
因此，koa 也提供了一些很方便的管理工具，如：用 koa-compose 组合中间件

```javascript
const compose = require('koa-compose')
async function middle1(ctx, next) {
  if ('/middle1' == ctx.path) {
    ctx.body = { data: 'middle1' }
  } else {
    await next();
  }
}
async function middle2(ctx, next) {
  if ('/middle2' == ctx.path) {
    ctx.body = { data: 'middle2' }
  } else {
    await next()
  }
}
// ...
const middles = compose([middle1, middle2, /*...*/])
app.use(middles)
```

多个中间件如何执行？执行顺序如何？
koa 中间件执行过程是一层一层的执行的，由外而内，再由内向外。
网上流传着很广泛的“洋葱模型”很好的诠释了这顺序，如下图所示：

<img src="http://zhoushirong.github.io/img/onion.png" alt="koa洋葱模型" width="360px" />

等同于下面的这张图。
<img src="http://zhoushirong.github.io/img/routerpath.png" alt="koa洋葱模型2" width="600px" />


```javascript
const Koa = require('koa')
const app = new Koa()
app.use(async (ctx, next) => {
  console.log(1)
  await next()
  console.log(2)
})

app.use(async (ctx, next) => {
  console.log(3)
  await next()
  console.log(4)
})

app.use(async (ctx, next) => {
  console.log(5)
  ctx.body = 'Hello World'
  console.log(6)
})
app.listen(3000)

// curl localhost:3000 输出：
// 1
// 3
// 5
// 6
// 4
// 2
```

其执行顺序等同于下面的：

```javascript
function func1() {
  return new Promise((resolve, reject) => {
    console.log(1)
    func2()
    console.log(2)
  })
}

function func2() {
  return new Promise((resolve, reject) => {
    console.log(3)
    func3()
    console.log(4)
  })
}

function func3() {
  console.log(5)
  return new Promise((resolve, reject) => {
    console.log(6)
  })
}

func1()

// node index.js 执行结果如下：
// 1
// 3
// 5
// 6
// 4
// 2
```
理解了上面两段代码也就大概理解了 koa 的中间件的执行了。


##### 整个系统执行中间件过程如下
koa-compress > koa-bodyparser > koa2-connect-history-api-fallback > koa-favicon > koa-static > commonRouter -> koa-router

其中 commonRouter 为自定义的中间件，内部路由过程如下：
记录开始时间 > 判断登录态 > 执行后续路由 > 回来执行记录结束时间 > 打日志(日志需要有请求时间)


##### 容错、错误码
容错是程序的必要操作，尤其是后端项目，尤其重要，因为一旦报错很可能导致整个系统崩溃。
影响范围极大，为了更好的管理错误，我们最好能做到统一出口、入口，以便能够对错误进行更好的监控，以及异常处理。
可以借助于中间件来完成。

##### 日志(引入log4 -> 日志埋点上报 -> logsearch|kibana查看)
日志也是后端项目必不可少的，nodejs 项目目前比较流行的日志框架有很多
log4js 是目前用的比较多的，其格式也跟其它语言的日志类似。（如 java 的log4j）
log4js：可以做日志收集、写入文件，在服务器直接指定固定目录/data/nodejs/log

```shell
data/nodejs/access.log
data/nodejs/other.log
data/nodejs/server.log
```

##### 本地调试
断点调试是一个很好的习惯，nodejs 最简单快捷的方式就是 console.log 直接控制台查看。
但是，对于复杂的情形，我们也会有需要用到断点调试的时候。
使用 vscode开发，并启动nodejs服务，可以很方便的进行断点 debug。

##### 数据 mock
对于 nodejs 数据 mock 可以有很多方式：
方式一：是用第三方 mock 服务，启动一个mock数据端口<a href="https://github.com/zhoushirong/static-mock">static-mock</a>
方式二：利用 webpack 的插件<a href="https://www.npmjs.com/package/webpack-api-mocker">webpack-api-mocker</a>

开发此项目的时候用的是方法二，好处是可以少启动一个端口，mock 可以和 client 的 webpack-dev-server 共享端口。


##### 用到的主要第三方中间件
***koa-static***：将静态目录映射为路由可访问的路径
***koa-favicon***：将favicon.ico路径映射为可访问路径并设置max-age缓存头
***koa-compress***：对请求进行开启gzip压缩，效果很明显（nginx也可以做压缩），压缩之后 
response-headers会有这个属性  Content-Encoding:gzip
***koa-bodyparser***：对于POST请求的处理，koa-bodyparser中间件可以把 koa2 上下文的 formData 数据解析到	      ctx.request.body中
***koa2-connect-history-api-fallback***：对vue history路由做处理，默认将非.xxx后缀请求跳到默认index.html页面


##### 安全 xss、csrf、sql注入
koa-helmet：9个安全中间件的集合、帮助app抵御常见的一些web安全隐患
koa-limit：防止DOS攻击
koa-csrf：防止CSRF攻击
sql注入：对参数进行过滤（见后面附录1）

除此之外，还用到了如下工具：
##### 启动工具 pm2、nodemon、配置、部署、健康检查
##### redis、sentinels、Medis图形化工具
##### mysql、mysql连接池、navicat图形化工具

#### 四、踩过的坑

1.favicon.ico 不出来：

```javascript
app.use(favicon(path.join(__dirname, 'favicon.ico')))
```

```html
<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
```


2.直接用浏览器打开接口失败

原因：koa2-connect-history-api-fallback 中间件做了强制跳转

```javascript
// /server/node_modules/koa2-connect-history-api-fallback/lib/connect-history-api-fallback.js
// koa2-connect-history-api-fallback 中间件在此处做了强制跳转
if (parsedUrl.pathname.indexOf('.') !== -1 && options.disableDotRule !== true) {
  logger('Not rewriting', ctx.method, ctx.url, 'because the path includes a dot (.) character.');
  return next();
}
```

解决办法：设置白名单

```javascript
app.use(historyApiFallback({ whiteList: ['/api/'] }))
```

3.ndp环境变量首次设置之后生效，后面修改不生效，不生效

```html
ndp -> 配置 -> 发布配置 -> NODE_ENV 
```

原因：怀疑是ndp本身的bug，未确定。

解决办法：手动杀掉服务器上pm2进程，重新启动。


4.发布之后进程没有杀死，有一个错误的进程将服务器cpu跑满了。

原因：可能是早期服务代码不完善，报错导致pm2管理失败，后续未重现

解决办法：手动杀掉服务器进程



5.日志打印报错，log4js 本地能写日志文件，服务器上写不了。

原因：

本地开发启动NODE服务的时候只启动一个进程。(需理解进程的概念)

而通过ndp发布之后，自动通过pm2启动，用的是cluster模式，启动了多个进程。

log4js，对于单进程和多进程需要做不同的配置。

解决办法：

```javascript
// 文档地址： https://log4js-node.github.io/log4js-node/api.html
log4js.configure({
  disableClustering: true, // 不启动日志的集群模式
  // pm2: true, // 或者使用pm2，此模式需要服务端安装 pm2 install pm2-intercom
  // ...
})
```

6.测试、后端登录我们的项目的时候登录偶尔登录不上，切接口数据更新不及时

原因：配置nginx的时候配置了缓存6min

```shell
 location / {
  proxy_pass http://node_server;
  expires 10m; # 这个不需要
}
```

解决办法：

去掉nginx缓存配置 expires选项。



7.每次到一个新的环境，第一次构建都会报模块找不到的错误，重试N次之后正常。

可能原因：

执行build.sh的时候执行的是npm install client && npm install server 安装的总命令

总命令下的子命令 npm install client 等才是真正的安装npm依赖模块

而执行build.sh的时候脚本是同步的，但是只针对脚本内的总命令，不包括子命令

导致npm安装变成异步执行了，在npm未安装完成的情况下执行npm run build导致报错

解决办法：将总命令拆开分别执行安装

```shell
registry=https://registry.npm.taobao.org
npm install --prefix  ./client --registry=$registry
npm install --prefix ./server --registry=$registry
npm run build
```



8.经过 Nginx 的静态资源和接口返回的数据被截掉了一部分，返回的数据不完整。

问题原因：

新的预发环境nginx配置了缓冲，缓冲过小的时候nginx会将数据写入硬盘，而此时如果没有硬盘文件夹的读取权限，就会出现请求数据被截断的情况。

 解决办法：增大缓冲

```shell
# 在预发环境 和 线上环境的location / 下面配置 proxy_buffers 缓存大小
location / {
  proxy_buffer_size 64k; # 请求头缓冲大小
  proxy_buffers 4 512k; # 请求内容缓冲大小 4 * 512kb
}
```


### 传送门：

1.mac 靠谱的安装mysql教程地址：

https://gist.github.com/nrollr/3f57fc15ded7dddddcc4e82fe137b58e

2.redis命令教程地址

http://redisdoc.com/

3.redis sentinels学习配置教程

https://blog.csdn.net/men_wen/article/details/72724406

4.上次分享的nodejs架构基础参考

http://doc.hz.netease.com/pages/viewpage.action?pageId=117468038

5.koa安全中间件简介

https://cnodejs.org/topic/5a502debafa0a121784a89c3


### 附录1：

node-mysql中防止SQL注入四种常用方法：

方法一：

使用 escape 方法对参数进行编码，如：

```sql
mysql.escape(param); 
connection.escape(param);
poll.escape(param)
```

escape()方法编码规则：

```html
Numbers不进行转换；

Booleans转换为true/false；

Date对象转换为’YYYY-mm-dd HH:ii:ss’字符串；

Buffers转换为hex字符串，如X’0fa5’；

Strings进行安全转义；

Arrays转换为列表，如[‘a’, ‘b’]会转换为’a’, ‘b’；

多维数组转换为组列表，如[[‘a’, ‘b’], [‘c’, ‘d’]]会转换为’a’, ‘b’), (‘c’, ‘d’)；

Objects会转换为key=value键值对的形式。嵌套的对象转换为字符串；

undefined/null会转换为NULL；

MySQL不支持NaN/Infinity，并且会触发MySQL错误。
```



方法二：

使用connection.query()的查询参数占位符

使用？作为查询参数占位符。

在使用查询参数占位符的时候，在其内部自动调用 connection.escape() 方法对其传入的参数进行编码，如：

```javascript
let post  = { name: 'namestring' }
let query = connection.query('SELECT * FROM users WHERE ?', post, (err, results) => {
});
console.log(query.sql); // SELECT * FROM users WHERE name = 'namestring'
```



方法三：

使用escapedId()编码SQL查询标识符。

```javascript
mysql.escapedId(identifier)
connection.escapeId(identifier)
pool.escapeId(identifier)

// 多用于排序，如：
let sorter = 'date'
let sql = 'SELECT * FROM posts ORDER BY ' + connection.escapeId(sorter)
```



方法四：

使用mysql.format()转义参数。

准备查询，此方法用于准备查询语句，该函数会自动选择合适的转义参数。


