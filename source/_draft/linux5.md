---
layout: default
title: Linux学习笔记(五)
date: 2018-06-15
tag: [linux, shell]
category: 笔记
---

接下来一段时间打算学一下linux
学习来源书本《Linux命令行与shell脚本编程大全 第三版》


### 一、理解linux文件权限

Linux沿用了Unix文件权限的办法，允许用户和组根据每个文件和目录的安全性设置来访问文件。
Linux安全系统的核心是用户账户。每个能够进入Linux系统的用户都会被分配唯一的用户账户。
用户对系统中各个文件的访问权限取决于他们登录系统时的账户。

用户权限是通过创建用户时分配的用户ID(User ID，通常缩写为UID)来跟踪的。
UID是数值，每个用户都有唯一的UID。

```shell
echo $UID # UID保存在全局环境变量中，可以通过UID变量打印出来。
```

#### /etc/passwd文件

```shell
$ cat /etc/passwd
nobody:*:-2:-2:Unprivileged User:/var/empty:/usr/bin/false
root:*:0:0:System Administrator:/var/root:/bin/sh
daemon:*:1:1:System Services:/var/root:/usr/bin/false
_uucp:*:4:4:Unix to Unix Copy Protocol:/var/spool/uucp:/usr/sbin/uucico
_taskgated:*:13:13:Task Gate Daemon:/var/empty:/usr/bin/false
_networkd:*:24:24:Network Services:/var/networkd:/usr/bin/false
... #省略
```

此文件是linux系统专门用来将用户的登录名匹配到对应的UID值，包含了一些用户相关的信息。

如上面所示，Linux系统会为各种各样的功能创建不同的用户账户
这些账户叫做系统账户，并不是真正的用户。是系统上运行的各种服务进程访资源用的特殊账户。
所有运行在后台的服务都需要用一个系统用户账户登录到linux系统上。

如果所有的服务都用root账户登录，那么一旦有非授权的用户攻陷了这些服务中的一个，那么他就能作为root用户进入系统。
为了防止这种事情发生，现在所有运行在linux服务器后台的几乎都用自己的账户登录。

Linux 为系统账户预留了 500 以下的 UID 值。
为普通用户创建账户时，大多数linux系统会从 501 始。

ps：我的mac上是从501开始的，linux虚拟机是1000开始的。

```html

```




