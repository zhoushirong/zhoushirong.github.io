---
title: 常用Linux命令
date: 2016/12/30
tag: linux
category: 技术
---

Linux 是一种自由和开放源代码的类UNIX操作系统。该操作系统的内核由林纳斯·托瓦兹在1991年10月5日首次发布。在加上用户空间的应用程序之后，成为Linux操作系统。Linux也是自由软件和开放源代码软件发展中最著名的例子。
作为一个前端或许很少用到linux，但是作为一个有理想、有道德、有激情的前端，linux是必须要了解的一项技能。尤其是立志成为全端（什么都会一点，什么都不精通）的前端工程师，更是需要知道了。

下面记录一下linux服务器上经常会用到的基本操作，便于以后回来查阅。

``` html
# 超级用户

$ 普通用户

命令 [选项] [参数]
```


### 系统

``` shell
# uname -a               # 查看内核/操作系统/CPU信息
# head -n 1 /etc/issue   # 查看操作系统版本
# cat /proc/cpuinfo      # 查看CPU信息
# hostname               # 查看计算机名
# lspci -tv              # 列出所有PCI设备
# lsusb -tv              # 列出所有USB设备
# lsmod                  # 列出加载的内核模块
# env                    # 查看环境变量
```

### 资源

``` shell
# free -m                # 查看内存使用量和交换区使用量
# df -h                  # 查看各分区使用情况
# du -sh <目录名>        # 查看指定目录的大小
# grep MemTotal /proc/meminfo   # 查看内存总量
# grep MemFree /proc/meminfo    # 查看空闲内存量
# uptime                 # 查看系统运行时间、用户数、负载
# cat /proc/loadavg      # 查看系统负载
```

### 磁盘和分区

``` shell
# mount | column -t      # 查看挂接的分区状态
# fdisk -l               # 查看所有分区
# swapon -s              # 查看所有交换分区
# hdparm -i /dev/hda     # 查看磁盘参数(仅适用于IDE设备)
# dmesg | grep IDE       # 查看启动时IDE设备检测状况
```

### 网络

``` shell
# ifconfig               # 查看所有网络接口的属性
# iptables -L            # 查看防火墙设置
# route -n               # 查看路由表
# netstat -lntp          # 查看所有监听端口
# netstat -antp          # 查看所有已经建立的连接
# netstat -s             # 查看网络统计信息
```

### 进程

``` shell
# ps -ef                 # 查看所有进程
# top                    # 实时显示进程状态
```

### 用户

``` shell
# w                      # 查看活动用户
# id <用户名>            # 查看指定用户信息
# last                   # 查看用户登录日志
# cut -d: -f1 /etc/passwd   # 查看系统所有用户
# cut -d: -f1 /etc/group    # 查看系统所有组
# crontab -l             # 查看当前用户的计划任务
```


### 登录

```
w 查询当前所有的登录用户

who 查询当前所有的登录用户

last 查询所有的登录信息

/val/log —— 系统日志信息
```

### 服务

``` shell
# chkconfig --list       # 列出所有系统服务
# chkconfig --list | grep on    # 列出所有启动的系统服务
```

### 程序

``` shell
# rpm -qa                # 查看所有安装的软件包
```

### 查看CPU信息（型号） 

``` shell
# cat /proc/cpuinfo | grep name | cut -f2 -d: | uniq -c 

# cat /proc/cpuinfo | grep physical | uniq -c 
 
# getconf LONG_BIT 

# cat /proc/cpuinfo | grep flags | grep ' lm ' | wc -l 

# dmidecode | grep 'Processor Information' 
```

### head tail cat awk grep vim 

```
dmi 查看cpu信息

chmod +x filename.sh

chown —— 改变文件所属

/etc/rc.local —— 开机启动配置

cron —— 定时器相关
```

### 查看内存信息 

``` shell
# cat /proc/meminfo 

# uname -a 

# cat /etc/issue | grep Linux 
```

### 查看机器型号 

``` shell
# dmidecode | grep "Product Name"  
```

查看网卡信息 

``` shell
# dmesg | grep -i eth
```

### 显示文件列表

``` shell
ls -a —— 显示隐藏文件  

ls -i —— 显示详细信息

ls -l —— 显示扩展名以及权限

ls -h —— 显示格式化列表

对于文件前面的这一串字符串的意思：-rw-r--r--

-表示文件类型

rw-表示所有者u     

r--

g所属组

r--

o其他人

r读 w写 x执行
```

### linux查找功能

``` shell
# locate locate // 更新locate数据库 updatedb

# find 范围 -name 文件名

# find 范围 -iname 文件名（不区分大小写）

# find 范围 -mtime 文件名 +10 （10天内修改的文件）a访问

# find 范围 -size -15k (小于25k的文件) M兆

# find 范围 -size +1k -a -size -50k (大于1k小于50k) -o或

```


### 帮助命令

```
main 查看帮助文档

help 获取内部命令
```


### 压缩与解压缩命令

#### .zip .gz .bz2 

``` html
.zip在window和linux通用  压缩文件命令为：zip 压缩文件名 源文件名 ； 
压缩文件夹命令为：zip -r 压缩文件名 源目录 ;解压命令将zip改为unzip即可
```

#### .tar.gz .tar.bz2 打包命令tar

``` html
tar -cvf 打包文件名 源文件 

-c：打包 

-v：显示过程 

-f：指定打包后的文件名 

-x：解打包 

-z：压缩包名为.tar.gz 

-C：指定解压目录

// 举例

tar -zcvf packfiles.tar.gz packfiles

tar -zxvf packfiles.tar.gz

tar -zxvf packfiles.tar.gz -C ./dirs
```


-----------------------------------------------

### 下面是shell相关部分

shell是什么？

shell是一个命令行解释器

用户 ——》shell ——》内核 

内核 ——》sell ——》用户


#### 创建一个可执行文件 hello.sh

``` shell
#!/bin/bash

echo "hello zsr !!!"
```

#### 执行可执行文件

``` shell
chmod 755 hello.sh —— 给予文件可执行权限

./hello.sh —— 执行可执行文件
```



``` html
echo $SHELL 查看当前的shell环境变量

/etc/shells 查看当前shell支持的版本
```

### echo命令

``` html
echo 选项 输出内容

选项：-e 支持反斜杠控制的字符转换
```

### 创建可执行文件 hello.sh

``` html
#!/bin/bash
#the first program

echo -e "\e[1;34m i live yellow \e[0m"
```

#### 执行可执行文件

两个方法：

#### 赋予执行权限再执行

```
chmod 755 hello.sh

./hello.sh
```

#### 直接用bash执行

```
bash hello.sh
```


### bash的基本功能

#### alias 设置命令别名

```
alias 查看已有的别名

alias ll='ls -ilpa' 重命名显示文件详细信息的命令

unalias 删除别名

命令的生效顺序：绝对路径启动 》 别名 》 bash内部命令 》 $PATH环境变量定义的目录查找到的第一个命令
```

#### 常用快捷键

```
ctl+c 强制终止当前命令

ctl+l 清屏

ctl+a 光标移到行首

ctl+e 光标移到行尾

ctl+u 从光标删除到行首

ctl+z 把命令放入后台

ctl+r 在历史命令中搜索
```

#### 历史命令

```
history 显示所有的历史命令

保存位置在 ~/.bash_history文件里面

history -c 清除历史命令
```


### 重定向

dev目录 —— linux保存特殊文件的目录

#### 输出重定向

```
命令 > 文件 —— 标准输出重定向

命令 >> 文件 —— 追加重定向

命令 2> 文件 —— 标准错误输出

命令 2>> 文件 —— 追加标准错误输出

命令 >> 文件 2>&1 —— 追加错误或者正确的命令

命令 &> /dev/null —— 放弃查看命令执行结果

命令 >> success.log 2 >> error.log —— 分别保存这两个正确和错误的信息
```

#### 输入重定向

```
wc 选项 文件名 —— 统计（ctl+d结束）

- c 统计字节数。

- l 统计行数。

- w 统计字数。
```


#### 多命令顺序执行

```
命令1; 命令2 —— 多个命令顺序执行，命令之间没有任何逻辑关系

命令1 && 命令2 —— 逻辑与关系

命令1 || 命令2 —— 逻辑或关系 
```

### 管道符

```
命令1 | 命令2 —— 命令1的正确输出结果作为命令2的操作对象

eg:

netstat -an | grep "ESTABLISHED"
```

### 通配符

```
? —— 匹配任意字符

* —— 匹配0个或多个任意字符

[] —— 匹配中括号中任意一个字符

"" —— 可以调用变量的值

'' —— 所有特殊符号如 $ 都没有特殊含义

` ` —— 反引号可以执行命令

$(命令) —— 执行命令
```

### 远程拷贝

```shell
scp -r ./* admin@10.242.22.222:~/data1/ # scp将本地文件拷贝到远程机器
rsync -a ../views/* ubuntu@10.220.220.222:~/data1/htdocs/index.epoos.com/views/ # rsync方式拷贝文件
```



### 相关链接《linux命令大全》

http://man.linuxde.net/rsync

