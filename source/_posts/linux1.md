---
layout: default
title: Linux学习笔记(一)
date: 2018-06-05 21:51:11
tag: [linux, shell]
category: 笔记
---

接下来一段时间打算学一下linux
学习来源书本《Linux命令行与shell脚本编程大全 第三版》


#### Linux目录名称

常见的目录均基于文件系统层级标准（FHS）。很多Linux发型版都遵循了FHS。
因此，你可以在任何兼容FHS的Linux系统中很容易的查找文件

```shell
/sbin # 系统二进制目录，存放许多GNU管理员级工具
/bin # 二进制目录，存放许多用户级别的GNU工具
/usr # 用户二进制目录，大量用户级的GNU工具和数据文件都存储在这里

/boot # 启动目录，存放启动文件
/dev # 设备目录，Linux在这里创建设备节点
/etc # 系统配置文件目录
/home # 主目录，Linux在这里创建用户目录
/lib # 库目录，存放系统和应用程序的库文件
/media # 媒体目录，可移动媒体设备的常用挂载点
/mnt # 挂载目录，另一个可移动媒体设备的常用挂载点
/opt # 可选目录，常用于存放第三方软件包和数据文件
/proc # 进程目录，存放现有硬件及当前进程的相关信息
/root # root用户的主目录
/run # 运行目录，存放系统运行时的运行时数据
/srv # 服务目录，存放不能低服务的相关文件
/sys # 系统目录，存放系统硬件信息的相关文件
/tmp # 临时目录，可以在该目录中创建和删除临时工作文件
/var # 可变目录，用以存放经常变化的文件，比如日志文件
```

#### 基本命令

用的最多的几个基本文件查看操作命令，详细参数使用的时候去查

```shell
cd # 进入目录
ls # 列出
cp # 拷贝
echo # 写入文件
touch # 创建文件
ln # 软连接
mv # 重名了文件(夹)
mkdir # 创建文件夹
rm # 删除文件
rmdir # 删除文件目录
file # 查看文件类型
cat # 查看文件内容
more # 查看一页文件内容 cat升级版
less # 查看一页文件内容 more升级版
tail # 查看文件后n行的内容 可指定查看行数 tail -n file
head # 查看文件前n行的内容 和tail相反 head -n file
cat -n access.log | tail -n 300 | head -n 10
```


#### 名词解释

GNU计划：又称革奴计划，是由Richard Stallman在1983年9月27日公开发起的。它的目标是创建一套完全自由的操作系统。 ———— 百度百科

GNU软件：GNU软件是通过GNU项目发布的软件，它是一种根据GNU软件包的README手册以及自由软件指南开发的，大多数GNU软件是免费分发的，但不是多有的都这样，然而，所有的GNU软件都必须是自由软件。 ———— 百度百科

GCC：GNU编译器套件（GNU Compiler Collection）。
包括C、C++、Objective-C、Fortran、Java、Ada和Go语言的前端，也包括了这些语言的库（如libstdc++、libgcj等等）GCC的初衷是为GNU操作系统专门编写的一款编译器。 ———— 百度百科

