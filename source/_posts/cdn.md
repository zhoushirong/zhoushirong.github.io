
---
title: cdn 简介
date: 2021/04/03
tag: [cdn,dns,cname]
category: 笔记
---


本文简单介绍 CDN 的缓存策略 以及 附带其关联名词解释


## CDN（Content Delivery Network，内容分发网络）
当下的互联网产品中 CDN 几乎已经成了标配，使用 CDN 能够加速网站资源的下载，能够避免浏览器对请求并发的限制。
那么它为什么能够实现加速资源下载呢？

CDN，中文意思为“内容分发网络”，从字面解释可以得知，是做内容分发的，也就是说将用户的内容分发到各个地方，即在各个地方都部署“CDN节点服务器”。

因此 ***CDN加速原因***总结一句话就是：在各个地方部署缓存服务器，尽可能让用户的请求命中缓存，从缓存中获取数据。

那么，如何才能做到为个区域发起的请求分配最优的资源数据源呢？

这个跟 DNS 有关。

当用户访问使用 CDN 资源服务的网站时，请求首次发起之后，域名解析请求会被流转到预先授权的 DNS 服务器。
DNS 服务器解析的时候会发现域名已经配置了 CNAME 记录（需要用户提前配置好），到了 CDN 服务商的某个域名。
然后域名解析请求会被发送至 CDN 服务商的 DNS 调度系统，该系统通过一组预先定义好的策略(如内容类型、地理区域、入网类型、网络负载状况等)，将最优的 CDN 节点 IP 地址提供给用户。
使用户通过该 IP 即可以最快的速度获得请求内容。

如下图所示。

### 假设用户访问 qcloud.com
#### 1.没有cdn，发起请求过程

<img src="http://zhoushirong.github.io/img/cdn1.png" alt="无CDN请求场景" width="85%">

由于服务器部署在广州，而北京、新疆距离广州距离不一样，因此会有**不同程度的延迟**。

此时的域名解析：
<img src="http://zhoushirong.github.io/img/cdn2.png" alt="无CDN域名解析场景" width="85%">

1) 本地DNS对域名进行解析,本地DNS经过 本地缓存识别 —— 路由缓存识别 —— 电信服务商缓存识别 —— DNS服务商解析等一系列解析
2) 之后得到服务器 IP 地址
3) 根据IP地址定向从服务器获取数据。

#### 2.cdn的请求，发起过程

<img src="http://zhoushirong.github.io/img/cdn4.png" alt="有CDN请求场景" width="85%">

一般来说 CDN 厂商会在全国各个大的区域部署一些服务器来作为 CDN 节点，这些节点可以用来缓存请求数据，以最快、最近、最优的方式返回请求数据

接入 CDN 以后，需要先给域名配置一个 CNAME 记录，当域名解析该域名的时候，此时的域名解析会被指向 CNAME 记录的值。
如下图所示。

<img src="http://zhoushirong.github.io/img/cdn3.png" alt="有CDN域名解析场景" width="85%">

0）用户接入 CDN 时候需要给域名配置一个 CNAME 记录到 CDN 厂商的某个域名(如：XX)，而 CDN 厂商则会对针对 XX 域名做相应的处理。
1) 访问 qcloud.com 域名
2) 本地 DNS 对域名进行解析，本地 DNS 经过本地缓存识别 ——> 路由缓存识别 ——> 电信服务商缓存识别 ——> DNS服务商解析... 等一系列解析
3) 解析之后得到 CNAME 记录的 CDN 域名(如：XX) 
4) 请求到达 CDN 域名 XX 对应的服务器，在该服务器上通过一系列算法选出当前最优节点。
5/6) 将最优节点的 IP 返回给用户
7/8) 用户通过该 IP 即可得到改 IP 对应节点上的数据了。


--- 

## 名词解释

### CDN 缓存穿透
CDN 如果没有缓存，则回源进行查找，如果请求资源每次都带有随机数，则每次都会回源，这就是缓存穿透。

### DNS (域名系统)
DNS 系统是一个分布式分层数据库，用于存储 IP 地址和其它数据，并按照名称进行查询，他用于将人类可读的域名转换为机器可读的 IP 地址。
DNS 目录存储于全球范围内分布的域名服务器上，定期更新。

#### DNS 服务器类型
DNS 服务器存储域名数据库，并根据来自网络中客户端的 DNS查询 来处理域名。
权威服务器 —— 保存 DNS 名称记录（包括 A、AAAA 和 CNAME）的服务器。
非权威服务器—— 根据以前的域名查询来构建缓存文件。它不存放原始名称记录。

```shell
$ nslookup epoos.com

Server:		10.11.56.23
Address:	10.11.56.23#53
Non-authoritative answer:
Name:	epoos.com
Address: 111.230.220.62
```
通过 nslookup 命令查询得知，当前查询 epoos.com 域名是由 dns 服务器 10.11.56.23 返回的，其结果并不是权威服务器的结果。
该 dns 服务器是[dnspod](https://docs.dnspod.cn/dns/5f471dbc8ae73e11c5b01986/)(国内的 DNS 服务商) 提供的。

```html
Nslookup 是一个监测网络中 DNS 服务器是否能正确实现域名解析的命令行工具。
```

### DNS 记录类型 —— CNAME (Canonical Name Record)
CNAME 是域名 DNS 的一种记录，用于解析域名到另外一个域名。
域名解析服务器遇到CNAME记录会以映射到的目标重新开始查询，这对于需要在同一个IP地址上运行多个服务的情况来说非常方便。

对于多个域名共用同一个IP的情况尤其有用，如将ftp.example.com 和 www.example.com 都指向DNS记录 example.com，而后者则有一个指向IP地址的A记录。
如此一来，若服务器 IP 地址改变，则只需修改 example.com 的A记录即可。

CNAME 多用在 CDN 加速上。
```
$ dig qcloud.com CNAME

# ...
;; QUESTION SECTION:
;qcloud.com.			IN	CNAME  # 要查询的记录类型

;; AUTHORITY SECTION:
qcloud.com.		600	IN	SOA	ns1.qq.com. webmaster.qq.com. 1330653999 300 600 86400 86400  # 要查询的记录别名
# ...
```


### DNS 记录类型 —— A 记录
A (Address) 记录是用来指定主机名（或域名）对应的IP地址记录
```
$ dig qcloud.com

# ...
;; QUESTION SECTION:
;qcloud.com.			IN	A  # 要查询的记录类型，不指定参数，默认查 A 记录

;; ANSWER SECTION:
qcloud.com.		17	IN	A	119.29.42.201  # 查询 A 记录的结果
qcloud.com.		17	IN	A	119.29.47.192
# ...
```

### DNS 记录类型 —— AAAA 记录
A 记录的 IPV6 版本

### DNS 记录类型 —— MX 记录
邮件交换记录，根据邮件域名的结尾指向对应的邮件服务器进行处理
```
$ dig qcloud.com MX

# ...
;; QUESTION SECTION:
;qcloud.com.			IN	MX

;; AUTHORITY SECTION:
qcloud.com.		600	IN	SOA	ns1.qq.com. webmaster.qq.com. 1330653999 300 600 86400 86400
# ...
```

### DNS 记录类型 —— NS 记录
解析服务器记录，用来表明哪台服务器对该域名进行解析
```
$ dig qcloud.com NS
# ...
;; QUESTION SECTION:
;qcloud.com.			IN	NS # 查询的记录类型为 NS

;; ANSWER SECTION:
# 域名解析服务器地址
qcloud.com.		86400	IN	NS	ns2.qq.com.
qcloud.com.		86400	IN	NS	ns3.qq.com.
qcloud.com.		86400	IN	NS	ns4.qq.com.
qcloud.com.		86400	IN	NS	ns1.qq.com.
# ...
```

### DNS 记录类型 —— SOA 记录
起始授权机构记录，NS 用于标识哪台服务器对该域名进行解析，SOA 用于记录在众多 NS 记录中哪一台是主服务器。
表示此域名的权威解析服务器地址。当域名解析没有命中缓存的时候，就会回源到此域名的 SOA 记录，这也叫权威解析记录。
```
$ dig qcloud.com SOA
# ...
;; QUESTION SECTION:
;qcloud.com.			IN	SOA

;; ANSWER SECTION:
qcloud.com.		86400	IN	SOA	ns1.qq.com. webmaster.qq.com. 1330653999 300 600 86400 86400
# ...
```
