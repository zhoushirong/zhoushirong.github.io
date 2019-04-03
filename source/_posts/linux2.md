---
layout: default
title: Linux学习笔记(二)
date: 2018-06-05 21:51:11
tag: [linux, shell]
category: 笔记
---

接下来一段时间打算学一下linux
学习来源书本《Linux命令行与shell脚本编程大全 第三版》


### 一、进程管理

##### ps命令

ps 命令默认会显示运行在当前控制台下的属于当前用户端的进程，显示的选项
```shell
UID # 启动这些进程的用户
PPID # 父进程的进程号
CMD # 启动程序的名称
PID # process ID 进程id
TTY # 运行在哪个终端
TIME # 已占用的CPU时间
```

常用参数 ps -xx
```shell
-e # 显示所有进程
-f # 显示完整格式的输出
-w # 采用宽输出模式，不限宽度显示
-l # 显示任务信息
```

##### top命令

```shell
top # ps命令是查看某一时刻的信息，如果想要查看进程占用资源的趋势则需要用到top命令
```

##### kill killall命令

kill命令可通过进程ID(PID)给进程发信号。

```shell
kill $pid # 杀掉进程id为pid的进程
```

killall # killall命令支持通过进程名而不是PID来结束进程，也支持通配符
以root身份执行此命令当小心，很可能会误杀重要的系统进程

```shell
# eg：
killall http* # 杀掉所有以http开头的进程
```

### 二、监测磁盘空间

linux文件系统将所有的磁盘都并入一个虚拟目录下。
在使用新的存储媒体之前，需要把它放到虚拟目录下。这项工作称为 ———— 挂载

一般情况，新发布的图形化桌面环境都会自动挂载特定类型的可移动存储媒体（可移动存储媒体指的是可从PC上轻易移除的媒体，比如软盘和U盘）

##### mount命令

用mount命令查看机器上的挂载信息

```shell
mount # 输出当前系统上挂载的设备 (设备文件名、挂载点、文件系统类型、已挂载媒体的访问状态)
```
mount挂载的文件举例，eg:
```html
/dev/disk2s1 on /Volumes/网易POPO (hfs, local, nodev, nosuid, read-only, noowners, quarantine, mounted by zsr)
```

使用 mount 命令手动挂载设备

```shell
mount -t type device directory
```

**type**
type 参数指定了磁盘被格式化的文件系统类型，linux可识别非常多的文件系统类型
如果是需要和windows PC共用这些存储设备，通常得使用下列的文件系统类型

```html
vfat: windows长文件系统。
ntfs: windows NT、XP、Vista以及windows7中广泛使用的高级文件系统
iso9660: 标准CD-ROM文件系统
```
大多数U盘和软盘会被格式化成vfat文件系统。而数据CD则必须使用iso9660文件系统类型

**device**
device参数指定了改存储设备的设备文件的位置

**directory**
directory参数指定了挂载点在虚拟目录中的位置


如：手动将U盘 /dev/sdb1 挂载到 /media/disk 可以使用下面的命令

```shell
mount -t ntfs /dev/sdb1 /media/disk
```

挂载之后root用户就可以使用该设备的所有访问权限了，其它用户访问，需要设置目录的访问权限


##### umount命令

从Linux系统上移除一个可移动设备时，不能直接从系统上移除而应该先卸载

```shell
umount [directory | device]
```

##### df命令

df命令可以很方便的查看所有已挂载的磁盘的使用情况

```shell
df
df -h # 把输出中的磁盘空间按照用户易读的形式显示
```
du命令可以指定显示某个特定目录的磁盘使用情况。可以很容易发现哪个磁盘的存储空间快没了。

```shell
du # 默认当前目录
du /path # 指定目录
du -c # 显示所有已累出文件的总大小
du -h # 把输出中的磁盘空间按照用户易读的形式显示
du -s # 输出每个参数的总计，如显示目录的总大小
```


### 三、处理数据文件

##### sort命令排序数据

sort 命令按照回话指定的默认语言的排序规则对文本文件中的数据进行排序。默认情况下，sort命令会把数据当做字符来执行标准的字符排序。
```shell
sort file # 标准字符排序方式
sort -n file # 把数字识别成数字而不是字符
sort -M file # 自动识别三个字符的月份名，并排序
sort -b # 排序时忽略起始的空白
sort -d # 仅考虑空白和字母，不考虑特殊字符
sort -f # 默认会将大写字母排在前面，这个参数会胡烈大小写
sort file -o newfile # 将排序结果写出到指定文件
sort -r # 反序排序
sort -k (--key=POS1[,POS2]) # 排序从POS1位置开始，如果指定了POS2，则到POS2位置结束
sort -t # 指定一个用来区分键位置的字符
```

其中-t和-k对按照字段分割的数据进行排序非常有用，比如：
对字符串 ‘abcd:cdef:dddd:xxxxxx’，以':'分割，然后取第三个字段dddd进行排序：

```shell
sort -t ':' -k 3 -n /etc/file   # 
```

综合运用，将当前目录的文件(夹)大小安照降序输出

```shell
du -sh * | sort -nr # | 为管道命令，将du的输出重定向到sort命令
```

##### grep命令搜索数据

grep命令就是从输入或者指定文件中查找包含指定字符的行

```shell
grep xxx file # 搜索某文件(file)中的字段(xxx)所在的那一行数据
grep -v xxx file # 反向搜索，返回不匹配的所有行
grep -n # 输出包含行号
grep -c # 输出匹配的总行数
grep [abcdefghxx] # 正则匹配搜索
```

##### 压缩数据

linux包含了多种文件压缩工具

```html
工具         文件扩展名     描述
bzip2       .bz2          
compress    .Z           最初的Unix文件压缩工具，快没人用了
gzip        .gz          GNU压缩工具，linux最常用的压缩工具
zip         .zip         Windows上的ePKZIP工具的Unix实现
```

gzip软件包是GNU项目的产物，这个软件包含有下面的工具

```html
gzip 用来压缩文件
gzcat 用来查看压缩过的文本文件的内容
gunzip 用来解压文件
```

```shell
gzip ./*  # 将当前目录下的所有文件进行压缩，（会替换源文件）
gunzip ./* # 解压当前目录下的所有.gz文件
```

**tar**
虽然zip命令能够很好的将单个文件压缩归档，但是它不是Unix和Linux中的标准归档工具。
目前Linux和Unix用的最广泛的归档工具是tar命令。

```shell
tar function [options] object1 object2 ...
tar -c # 创建一个新的归档文件
tar -v # 在处理文件时显示文件
tar -f # 输出结果到文件或设备
tar -t # 列出已有的tar归档文件的内容
tar -x # 从已有的归档文件中提取文件
tar -z # 将输出重定向给gzip命令来压缩内容
```

```shell
tar -cvf txt.tar 1.txt 2.txt 3.txt # 压缩
tar -zxvf txt.tar # 解压
```























