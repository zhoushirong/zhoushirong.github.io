---
layout: default
title: ssh命令笔记
date: 2020/10/11
tag: [ssh, scp, rsync]
category: 笔记
---

#### ssh 简介
ssh命令是，secure shell 的缩写。
是一种网络协议，用于机密两台计算机之前的通信，支持各种身份验证机制，主要用与保证远程登录和远程通信的安全，任何网络服务都可以用这个协议来加密。

#### ssh 架构
SSH 的软件架构是服务器-客户端模式（Server - Client）。在这个架构中，SSH 软件分成两个部分：
向服务器发出请求的部分，称为客户端（client），OpenSSH 的实现为 ssh；
接收客户端发出的请求的部分，称为服务器（server），OpenSSH 的实现为 sshd

补充：
OpenSSH（OpenBSD Secure Shell）是使用 SSH 透过计算机网络加密通信的实现，是一种实现方式。


#### ssh 基本用法
1.ssh 命令
ssh命令可用来登录远程机器，如：
```shell
ssh user@hostname -p 端口 # ssh root@111.222.333 -p 8821 || ssh root@epoos.com -p 8821
ssh -l user hostname -p 端口 # ssh -l root 111.222.333 -p 8821
```
ssh 在远程机器上执行命令
```shell
ssh user@hostname ls # 在远程机器上执行 ls 命令
```

2.ssh -L命令
ssh -L 命令可以用来做本地转发，端口代理，将本地ip和端口通过跳板机代理到目标机器

在本人日常工作中经常会遇到这样的场景，本地机器需要与测试服务器的某个*纯IP加端口的 http服务*进行直连，以便调试。
但是，由于安全考虑，测试服务器往往不能与本地进行直连，哪怕是连了vpn也不行，唯一的办法就是通过跳板机转发，如图：
<img src="http://zhoushirong.github.io/img/ssh-l.png" alt="ssh-l图片" width="350" height="250">
此时，ssh -L命令就能派上用场了，如下命令
```shell
# ssh -L 本地IP:本地端口:目标机器ip:目标机器端口 跳板机用户名@跳板机IP -N(可选，加了之后不会登陆到跳板机，仅仅做转发功能)
  ssh -L 127.0.0.1:8877:10.113.133.786:8877 root@10.101.111.122 -N
```

如果本地配置了跳板机的别名，则可直接使用别名
```shell
ssh -L 127.0.0.1:8877:10.113.133.78:8877 tbj
```
跳板机本地别名配置如下（将此配置写在本地.ssh目录下的config文件，没有config文件则创建一个）
```shell
Host tbj
HostName 10.101.111.122
Port 1233
User root
IdentityFile ~/.ssh/unamekey
```
如上示例，使用ssh -L 命令之后，在本地访问 127.0.0.1:8877 服务的时候，就会被跳板机代理到目标机器 10.113.133.786:8877 服务上了，此时本地即可访问到目标服务器的服务了。

#### scp 命令
scp 命令是 SSH 提供的一个客户端程序，用来在两台主机之间加密传送文件，可实现文件的上传和下载（可以利用此命令实现简单的应用程序发布）
scp 命令相当于 ssh + cp，先登录到远程机器，然后再复制文件。

```html
本地复制到远程。
远程复制到本地。
两个远程系统之间的复制。
```
基本命令
```shell
scp source destination # source 是源文件，destination是目标文件，两个都可以带上host

# 例：scp 远端的目标文件foo.txt 本地文件bar.txt
scp user@host:foo.txt bar.txt

scp -r documents username@serverhost:remote_path_dir # 将本机的 documents 目录拷贝到远程主机
scp -r username@serverhost:remote_path_dir local_documents # 将远程的的 documents 目录拷贝到本地
```

#### rsync 命令
rsync（remote sync）远程同步命令，是一个常用的 Linux 应用程序。
可以用于本地计算机的两个目录之间的同步（能够很方便的实现应用程序发布，比scp更好用）。
也可以在两台远程计算机直接进行文件同步（比如多点备份？）
rsync 不是 SSH 工具集的一部分，需要手动安装此命令。

```shell
# 命令执行以后，目标目录下就会出现 destination/source 这个子目录
rsync -r source destination # -r 命令表示递归，即包含子目录
rsync -r source1 source2 destination # 多文件同步
rsync -a source1 source2 destination # -a参数可以替代-r，除了可以递归同步以外，还可以同步元信息（比如修改时间、权限等）

#如果只想同步源目录source里面的内容到目标目录destination，则需要在源目录后面加上斜杠。
# 命令执行后，source目录里面的内容，就都被复制到了destination目录里面，并不会在destination下面创建一个source子目录
rsync -a source1/ source2/ destination
```

如果不确定 rsync 执行后会产生什么结果，可以先用 ***-n***或 --dry-run 参数模拟执行的结果。
-n 参数模拟命令执行的结果，并不真的执行命令。***-v***参数则是将结果输出到终端，这样就可以看到哪些内容会被同步。
```shell
rsync -anv source/ destination
```

默认情况下，rsync 只确保源目录的所有内容（明确排除的文件除外）都复制到目标目录。它不会使两个目录保持相同，并且不会删除文件。
如果要使得目标目录成为源目录的镜像副本，则必须使用 ***--delete*** 参数，这将删除只存在于目标目录、不存在于源目录的文件。
```shell
rsync -av --delete source/ destination
```

补充：
rsync 的最大特点就是它可以完成增量备份，也就是默认只复制有变动的文件，能够极大地减少文件同步的时间。

### 传送门
https://wangdoc.com/ssh/basic.html