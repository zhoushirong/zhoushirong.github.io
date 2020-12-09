---
title: Web安全
tag: [js, xss, web安全]
date: 2018/11/23
category: 技术
---

### 1.XSS（Cross-site Script）简介
跨站脚本攻击，Cross-site Script，简称 XSS（因CSS与样式脚本命名一样）。
是一种代码注入攻击。攻击者想尽一切办法，在网站上注入恶意脚本，使之在用户的浏览器上运行，当用户访问该网站的时候浏览器执行该脚本
攻击者可通过恶意脚本的执行窃取用户的Session、Cookie等敏感信息，进而危害数据安全。

### XSS 类型：
1、持久型XSS（存储型XSS）
持久型 XSS 一般是通过 form 表单提交带有恶意脚本的数据到服务端，服务端未经过滤，直接保存到数据库。
然后直接拿到数据库的数据返回给前端，前端未能过滤，直接展示服务端提供的带有恶意脚本的数据。

2、非持久型XSS（反射型XSS）
非持久型 XSS 一般是通过给别人发送带恶意脚本代码参数的 url 来达到攻击目的。
前端取得url参数直接传给服务端，服务端未经过滤，直接返回带有恶意代码的字符串。

3、DOM型XSS
攻击者构造出特殊的url，包含恶意代码，前端直接取出url中带恶意代码的字符串，并在前端执行

### XSS 防护 
1、不轻易将不可信代码嵌入html、script、location、redirect-to、a-href、background-url、img-src、form-src 等中
尽量避免对以下信息直接取用，如果必须要用，需要经过严格检测或者转义处理之后再小心使用。
1）不信任来自用户的 UGC 信息
2）不信任来自第三方的链接，不能直接打开或者执行 redirectTo
3）不信任 URL 参数，不能直接取url参数插入Dom或者当做脚本执行
4）不信任 不明来源的Referer信息、来自其它子域的 Cookie信息等，不能直接插入脚本或者直接当做脚本执行

常用转义字符：
```html
< &lt;
> &gt;
& &amp;
" &quot;
' &#x27;
/ &#x2f;
```
2、敏感的Cookie、Session信息设置HttpOnly。禁止Javascript读取敏感cookie信息。
3、设置CSP的安全策略
  1）通过meta标签设置
  2) 通过Http响应头 Content-Security-Policy


