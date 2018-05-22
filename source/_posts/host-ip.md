---
title: Nginx防止别人的域名解析到自己的服务器上
date: 2017/02/23
tag: nginx
category: 技术
---

今天早上打开百度统计，发现突然多了一些奇怪的入口页面，点进去全部是我的网站内容，当时我就懵逼了。
看了下请求的页面地址的ip，发现是指向我的服务器的，还以为是中毒了，检查了下nginx配置和服务器登录信息，发现没有异常。后面经过google发现，原来是别人把自己的域名解析到了我的服务器上。他们这样做的目的是为了可以增加搜索引擎对他的域名的收录。
虽然对自己的站点看似没什么影响，但是总感觉心里不爽，于是网上查了下资料，解决了此问题。

### Top10入口页面
入口页面	| 浏览量(PV)	| 占比
-|-
http://xxxxx1.com	| 1 | 5.56%
http://www.xxxxx2.com | 1 | 5.56%
http://www.xxxxx3.com | 1 | 5.56%
http://www.xxxxx4.com | 1 | 5.56%
http://xxxxx5.com | 1 | 5.56%
http://xxxxx6.com | 1 | 5.56%
http://xxxxx7.com | 1	| 5.56%
http://www.xxxxx8.com	| 1	|5.56%
http://www.xxxxx9.com | 1 | 5.56%
http://www.xxxxx10.com	| 1	| 5.56%
||

### 解决办法
将nginx的默认配置修改一下，将其指向500或者直接rewrite到自己的网站。

``` shell
server {  
  listen 80 default;  
  return 500;  
}
```
当然也可以写成这样，跳转到自己的网站

``` shell
server {
  listen 80 default;  
  rewrite ^(.*) https://www.epoos.com;
}  
```

还可以粗暴一点，直接返回404，并关闭到accesslog日志

``` shel
server {
  listen 80 default;
  location / {
    return 404;
    access_log off;
  }
}
```