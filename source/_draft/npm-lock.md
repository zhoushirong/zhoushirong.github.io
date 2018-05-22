---
layout: default
title: 一个npm-lock导致的bug
date: 2018-05-22 19:33:33
tags:
---

## {{page.title}}

### 事情的背景
我司的项目基本上都是后端java，前端随意。
为什么说随意呢，因为前端什么技术都有，react、vue、jquery、regular、seajs...
构建工具用的是gulp+webpack
其实，还算是比较灵活了，虽然没有用nodejs，但是java的ftl模板也足够支持前后端分离了。

由于ftl文件是跟java绑定在一起的，发布一次ftl需要构建+发布java，而这个过程是相当耗时间的。
发布是走的运维提供的一个发布系统，发布需要分两次发布：
1.webpack+gulp构建，然后发前端静态资源到cdn
2.webpack+gulp构建，然后发ftl文件以及java文件到源站。

ps:
理论上来说，ftl文件是可以拆分和java绑定发布的，但是这个未实现。
又，java(ftl)和cdn也是可以构建一次，分别发布的，但是这个同样未实现。

### 
前人做的时候是分了前后端发布，如果改动了静态资源文件需要发布两次，一次是发布静态资源，另一次是发布ftl文件。


### 总结
一定要加npm-lock或者yarn.lock，并且提交到代码库来保证所有人使用的node包版本一致
截至目前位置，还是推荐使用yarn


### 问题
更新：


npm shrinkwrap