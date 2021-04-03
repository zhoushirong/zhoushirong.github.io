
---
title: cdn 简介
date: 2021/04/03
tag: [cdn,dns,cname]
category: 笔记
---


本文通过了解 CDN 附带了解其关联名词解释


## CDN（Content Delivery Network，内容分发网络）
众所周知，使用 CDN 能够加速网站的内容显示，但是到底是什么原因让它能够实现加速呢？
《内容分发网络》从字面解释可以得知，是做内容分发的，也就是说将用户的内容分发到各个地方，而所谓的各个地方就是各个“CDN节点服务器”。

***加速原理：***通过在全国各地部署节点服务器，实现将源站内容分发至所有 CDN 节点。

当用户访问使用 CDN 服务的网站时，本地 DNS 服务器通过 CNAME 方式将最终域名请求重定向到 CDN 服务。
CDN 服务通过一组预先定义好的策略(如内容类型、地理区域、网络负载状况等)，将当时能够最快响应用户的 CDN 节点 IP 地址提供给用户。
使用户可以通过该 IP 以最快的速度获得请求内容。

***假设用户访问 qcloud.com ***
1.没有cdn，发起请求过程
<img src="http://zhoushirong.github.io/img/cdn1.png" alt="无CDN请求场景" width="1136" height="810">
由于服务器部署在广州，而北京、新疆距离广州距离不一样，因此会有**不同程度的延迟**。

此时的域名解析
<img src="http://zhoushirong.github.io/img/cdn2.png" alt="无CDN域名解析场景" width="950" height="576">
1) 本地DNS对域名进行解析,本地DNS经过 本地缓存识别 —— 路由缓存识别 —— 电信服务商缓存识别 —— DNS服务商解析等一系列解析
2）之后得到服务器 IP 地址
3) 根据IP地址定向从服务器获取数据。

2.cdn的请求，发起过程
<img src="http://zhoushirong.github.io/img/cdn4.png" alt="有CDN请求场景" width="1330" height="952">
一般稍微好一点的 cdn 厂商都会在全国各个区域部署一些服务器来作为cdn节点，这些节点可以用来缓存请求数据，以最快、最近、最优的方式返回请求数据

此时的域名解析
<img src="http://zhoushirong.github.io/img/cdn3.png" alt="有CDN域名解析场景" width="1432" height="596">
0）用户接入 cdn 的时候需要将域名授权给 cdn 厂商，在cdn厂商做一个 CNAME 解析。
1) 访问 qcloud.com 域名
2) 本地DNS对域名进行解析,本地DNS经过 本地缓存识别 —— 路由缓存识别 —— 电信服务商缓存识别 —— DNS服务商解析等一系列解析
3）之后得到 CNAME 的 cdn 域名
4）请求 cdn 域名，到达 cdn 服务端，服务端通过一系列算法选出当前最优节点
5/6）将最优节点的 ip 返回给用户
7/8) 用户通过该 ip 即可从该最优的 cdn 节点上请求所需要数据了


--- 

## 名词解释
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
该 dns 服务器应该是[dnspod](https://docs.dnspod.cn/dns/5f471dbc8ae73e11c5b01986/)(国内的 DNS 服务商) 提供的。

```html
Nslookup 是一个监测网络中 DNS 服务器是否能正确实现域名解析的命令行工具。
```

### CNAME (Canonical Name Record)
CNAME 是域名 DNS 的一种记录，用于解析域名到另外一个域名。
域名解析服务器遇到CNAME记录会以映射到的目标重新开始查询，这对于需要在同一个IP地址上运行多个服务的情况来说非常方便。

对于多个域名共用同一个IP的情况尤其有用，如将ftp.example.com 和 www.example.com 都指向DNS记录 example.com，而后者则有一个指向IP地址的A记录。
如此一来，若服务器 IP 地址改变，则只需修改 example.com 的A记录即可。

CNAME 多用在 CDN 加速上。

### A 记录
A (Address) 记录是用来指定主机名（或域名）对应的IP地址记录

### CDN 缓存穿透
CDN 如果没有缓存，则回源进行查找，如果请求资源每次都带有随机数，则每次都会回源，这就是缓存穿透。
