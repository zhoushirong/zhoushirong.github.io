---
layout: default
title: Linux 软件的安装
date: 2018-11-05
tag: [linux, shell, 软件安装]
category: 笔记
---

### linux系统的软件安装
在GNU/Linux操作系统中，rpm和dpkg是 *最为常见的两类* 软件包管理工具。
他们分别应用于 RPM 软件包的Linux发行版本和 DEB 软件包的Linux发行版本。

RPM全称 Redhat Package Manager，最早由Red Hat公司制定实施，后被GNU开源操作系统接受，成为很多 Linux 系统的既定软件标准。
DEB是与RPM进行竞争的基于Debian操作系统(Ubuntu)的 DEB 软件包管理工具 - DPKG(Debian Package)


#### yum
yum 基于 rpm 软件包管理工具，是一个shell前端软件包管理器，能够自动安装、更新 RMP 包以及其依赖。


#### apt
apt 是与 yum 对应的，是debian(ubuntu) Linux发行版本中的APT软件包管理工具。
所有基于debian的发行都使用这个包管理系统。
APT 的主要包管理工具为 APT-GET，通过此工具可满足和上述 YUM 相似的功能要求

### Mac OSX系统的软件安装
Mac OSX系统是基于linux的，绝大多数特性和功能都喝linux相似。
但是也有很多不一样的地方，比如软件的安装。

#### brew
brew 全称homebrew，是mac osx系统下的包管理器。

### 源码安装
除了用上面的包管理工具安装软件外，还可以直接下载源码然后解压编译安装。

#### wget
wget 是Linux系统中一个下载文件工具。
很多时候我们都需要用到这个命令去下载文件，比如下载软件源码。
源码包发布格式一般都是.tar.gz和.tar.bz2的。

具体源码包的安装过程
```shell
# 第一步：解压文件（两种解压命令分别对应两种压缩格式）
tar -zxvf ×××.tar.gz
tar -jxvf ×××.tar.bz2
# 第二步：执行配置文件，检测目标平台特征，一般会生成makefile文件。
./configure
# 第三步：make编译，将源码编译为二进制可执行程序
make
# 第四步： make install，安装，这一步需要root权限，因为要向系统写入文件
make install
```






