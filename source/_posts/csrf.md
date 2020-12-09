---
title: Web安全
tag: [js, csrf, web安全]
date: 2018/11/24
category: 技术
---

### 1.CSRF（Cross-site Request Forgery）简介
跨站请求伪造，简称 CSRF。
是一种诱骗用户在当前已登录的应用程序上执行非本意的操作的攻击方法，诱导用户发起非本意的请求，执行恶意操作。
例如：以用户的名义发送邮件、发送消息、购买商品、转账汇款等。

### CSRF 防护
1.同源检测，禁止外域或者不信任域名发起的请求
2.CSRF token，对于重要请求，按照约定规则生成token，发起请求的时候服务端对token进行校验。
3.双重 Cookie 校验机制，在请求url中再附加一个Cookie信息
4.Samesite Cookie属性，Chrome最新防护机制；Samesite=Strict 模式下，从第三方网站发起的请求都无法带上Cookie
