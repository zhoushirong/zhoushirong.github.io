---
layout: default
title: 一个localhost引发的血案。
date: 2018-05-21 19:41:48
tags: [npm,proxy]
category: 技术
---

## {{page.title}}

本来一天都开开心心，直到跑了一个npm run dev。
原本百分百没有问题的项目，npm run dev的时候某个接口突然跑不通了，一直报504错误。
看了下代码，这个接口是做了本地代理的mock数据接口，之前一直好好的。
查了很久，检查了N遍代码，切了master分支，皆不行。不得已让同事跑了一下此项目，结果 —— 在他们那能正常运行。
嗯，既然如此，真相只有一个：本地环境的问题。
于是开始了漫长的试错与调试。
尝试了如下方法，重装nodejs（怀疑是node 10.0.0的问题），重装node_module，重装gulp，干掉nginx，干掉其它一切可能占用端口的软件，甚至最后重启了电脑。结果 —— 全部铺盖。

两个小时以后。。。

算了，去node_module看源码吧（基本上80%把握确定是代理的问题）
于是决定重头开始，仔细分析控制台的错误码，错误信息如下：

```html
[HPM] Error occurred while trying to proxy request /repay/get_api_info from localhost:8084 to http://localhost:8088 (ENOTFOUND) (https://nodejs.org/api/errors.html#errors_common_system_errors)
```
拿着此错误码google了一下，无果。大家遇到的错误都和我的不一样。即使有一样的也没有人解决。

算了，还是去看看代理的源码吧。于是找到如下文件。

```html
/node_modules/http-proxy-middleware/lib/index.js
```

经过人肉搜索，终于找到抛出错误信息的位置（如下代码所示）。
原来这个错误是经过加工的，而且真正抛出错误的地方还不是此模块，而是它依赖的另外一个模块（/node_modules/http-proxy）
先不管这些，先将错误信息打印出来看看详细错误。（如下的console.log(err)）

```javascript
function logError(err, req, res) {
  var hostname = (req.headers && req.headers.host) || (req.hostname || req.host);     // (websocket) || (node0.10 || node 4/5)
  var target = proxyOptions.target.host || proxyOptions.target;
  var errReference = 'https://nodejs.org/api/errors.html#errors_common_system_errors'; // link to Node Common Systems Errors page
  // ------------>  在此处打印错误日志
  console.log(err)
  logger.error('[HPM] Error occurred while trying to proxy request %s from %s to %s (%s) (%s)', req.url, hostname, target, err.code, errReference);
}
```

最终打印错误信息如下：

```html
{ Error: getaddrinfo ENOTFOUND localhost localhost:8088
    at errnoException (dns.js:50:10)
    at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:92:26)
  code: 'ENOTFOUND',
  errno: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'localhost',
  host: 'localhost',
  port: '8088' }
```

google搜索了一下关键字 *getaddrinfo ENOTFOUND localhost*
找到这个报错的原因，是本地的host没有绑定

```shell
127.0.0.1 localhost
```

嗯？应该有的啊，算了去hosts看看，这一看才发现不知道什么时候被注释掉了。
于是，去除注释，npm run dev，
咦？好了？wtf!!!!.

事情经过就是这样，就这样解决了。

### 分析总结
分析：
本来这个127.0.0.1 localhost是存在的，只是因为之前装了一个SwitchHosts软件，SwitchHosts会修改原来的文件/etc/hosts，将其内容剪切到另外的位置，也就是SwitchHosts软件存放host的位置的。同时会将默认的配置选项开启，所以正常情况是不会对原有的host造成影响的。
于是我检查了一下我的host文件配置，发现原来是自己把SwitchHosts的那个基础配置选项关掉了，所以才导致找不到这个localhost。
解决办法将其打开即可（当然，直接在hosts文件补上也行）。

总结：
此问题的解决和运气有一定的关系，同时，自己的解决问题的思路也有问题，浪费了很多时间。
如果一开始就认真分析错误日志，可能早就解决了。

---全文完---




