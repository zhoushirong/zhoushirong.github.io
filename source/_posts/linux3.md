---
layout: default
title: Linux学习笔记(三)
date: 2018-06-10 10:39:00
tag: [linux, shell]
category: 笔记
---

接下来一段时间打算学一下linux
学习来源书本《Linux命令行与shell脚本编程大全 第三版》


### 一、SHELL与BASH简介

**SHELL** 不单单是一种CLI。它是一个时刻都在运行的复杂交互式程序。
shell是用户和Linux(Linux内核)之间的接口程序。你在控制台输入的每一个命令都是由shell解释之后再传给Linux内核的。
shell是一个命令语言解释器。

**SH** (Bourne shell) 是一个早期的重要shell，是UNIX标准的默认shell

**BASH** (GNU Bourne-Again Shell) 是一个为GNU计划编写的Unix shell。
BASH 是 GNU 组织开发和推广的一个项目。

BASH是大多数Linux系统以及Mac OSX默认的shell
BASH的命令语法是Bourne shell命令语法的超集

除此之外，还有很多shell，可通过如下方式查看本机安装的shell

```shell
cat /etc/shells
```

输出如下：

```html
/bin/dash
/bin/rbash
/bin/bash
/bin/csh
/bin/ksh
/bin/sh
/bin/tcsh
/bin/zsh
```




##### 默认SHELL类型

系统启动什么样的shell程序取决于个人用户ID配置。
在/etc/passwd文件中，在用户ID记录的第七个字段中列出了默认的shell程序。

eg：

```shell
cat /etc/passwd
nobody:*:-2:-2:Unprivileged User:/var/empty:/usr/bin/false
root:*:0:0:System Administrator:/var/root:/bin/sh
daemon:*:1:1:System Services:/var/root:/usr/bin/false
...
```

比如上面的root用户配置的默认shell程序为/bin/sh

或通过如下方式直接查看：

```shell
ls -l /bin/sh
-r-xr-xr-x  1 root  wheel  618512 10 26  2017 /bin/sh
```

可直接通过输入bash命令进入相应的shell解释程序

eg:
```shell
zsr :: / % sh
sh-3.2$ exit
exit
zsr :: / % bash
bash-3.2$ exit
exit
```

### shell的父子关系

shell也是需要程序来运行的，运行shell的程序就是父shell

eg：
```shell
zsr :: ~ ‹master*› % ps -f
  UID   PID  PPID   C STIME   TTY           TIME CMD
  501 68216   324   0 11:27上午 ttys000    0:00.04 /Applications/iTerm.app/Contents/MacOS/iTerm2 --server login -fp zsr
  501 68218 68217   0 11:27上午 ttys000    0:00.48 -zsh
zsr :: ~ ‹master*› % bash
bash-3.2$ ps -f
  UID   PID  PPID   C STIME   TTY           TIME CMD
  501 68216   324   0 11:27上午 ttys000    0:00.04 /Applications/iTerm.app/Contents/MacOS/iTerm2 --server login -fp zsr
  501 68218 68217   0 11:27上午 ttys000    0:00.48 -zsh
  501 68553 68218   0 11:27上午 ttys000    0:00.01 bash
bash-3.2$
```
上面运行bash之后，在运行ps -f ，此时，使用zsh运行bash，zsh就是bash的父shell。
可循环创建子shell。


#####  进程列表

进程列表是一种命令分组。

可以在一行中指定要依次运行的一系列命令。可以通过命令列表来实现，只需要在命令之间加入分号即可。

```shell
pwd; ls; pwd; ls; echo $BASH_SUBSHELL
{pwd; ls; pwd; ls; echo $BASH_SUBSHELL;} # 花括号不会成为进程列表
(pwd; ls; pwd; ls; echo $BASH_SUBSHELL;) # 将命令列表用括号起来能成为进程列表
```

在shell脚本中，经常使用子shell进行多shell处理。

**后台模式** 在后台模式中运行的命令可以在处理命令的同事让出CLI。

```shell
sleep 10 # 此命令会让进程等待10秒，在这个期间会话是不可用的
sleep 10& # 在命令后面加‘&’，能让程序进入后台运行
ps -f # 查看后台运行的进程
jobs -l # 查看后台运行的进程 -l 参数显示更多信息
coproc sleep 10 # 协程，1.在后台生成子shell；2.在子shell中执行命令
coproc copname { sleep 10; } # copname，自定义协程名称，多个协程的时候用到
```

##### SHELL内建命令

**内建命令** 已经和shell编译成了一体，作为shell工具的组成部分存在，不需要借助外部程序文件来运行。

**外部命令** 有时候也被称作文件系统命令，是存在于bash shell之外的程序。
它们并不是shell程序的一部分。
外部命令程序通常位于/bin、/usr/bin、/sbin 或 /usr/sbin中。

```shell
$ which ps # 查看ps命令的位置
/bin/ps # 输出路径，表示ps为外部命令
$ type ps # 查看ps命令的类型
ps is /bin/ps 

$ which cd
cd: shell built-in command # 表示cd为内部命令
$ type cd
cd is a shell builtin # 表示cd为内部命令

$ type -a echo # echo命令既有内建命令，也有外部命令
echo is a shell builtin
echo is /bin/echo
```

当执行外部命令时，会创建出一个子进程。这种操作被称为衍生(forking)。
当进程必须执行衍生操作时，它需要花费时间和精力来设置子进程的环境。
所以，外部命令多少还是有些代价的。

##### history

history命令能够查看所有的shell命令历史
history 历史记录保存在隐藏文件.bash_history中，位于用户的主目录中。
需要注意的是，bash命令的历史记录是先保存在内存中的，当shell退出时才会写入到历史文件中

```shell
history
!100 # 可执行历史中命令号为100的命令
!！ # 可执行历史中上一条命令
```


##### alias

alias命令可以为命令创建别名

```shell
alias # 查看已经创建的别名
alias ll='ls -al' # 执行ll表示执行ls -al
```

别名只在当前的shell进程中有效，若是想全局设置，需要修改环境变量。

环境变量请关注下一节。
























