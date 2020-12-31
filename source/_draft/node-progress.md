---
title: Nodejs子进程
date: 2020/12/30
tag: [nodejs,child-process,cluster]
category: 技术
---

javascript 语言本身被发明出来就是为浏览器服务的
进程是CPU分配资源的最小单位，分配独立内存，进程之间可通信，但是必须通过内核，使用IPC接口来做，代价比较大
线程是CPU调度的最小单位


nodejs child_process - exec

exec 与 shell脚本

1.shell脚本介绍，作用
2.exec介绍
3.exec与shell脚本基本应用
4.exec与shell脚本安全

5.exec、shell异步执行

spawn 与 exec区别：
spawn处理大数据
exec处理少量输出数据的命令

spawn 提供了衍生子进程的能力

nodejs child_process 和 cluster详解



### 传送门
Nodejs cluster模块深入探究：
https://cloud.tencent.com/developer/article/1061912
Nodejs 进阶：解答 Cluster 模块的几个疑问：
https://cloud.tencent.com/developer/article/1600191


pm2的cluster模式与fork模式的区别
https://github.com/mopduan/team/issues/19

浏览器进程与线程梳理
https://segmentfault.com/a/1190000012925872