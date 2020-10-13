---
layout: default
title: ssh命令笔记
date: 2020/10/11
tag: ssh
category: 笔记
---


1.ssh 命令
ssh命令可用来登录远程机器，如：
```shell
ssh xxx@ip -p 端口
```

2.ssh -L命令
ssh -L命令可以用来做端口代理，将本地ip和端口通过跳板机代理到目标机器

在本人日常工作中经常会遇到这样的场景，本地机器需要与测试服务器的某个*纯IP加端口的 http服务*进行直连，以便调试。
但是，由于安全考虑，测试服务器往往不能与本地进行直连，哪怕是连了vpn也不行，唯一的办法就是通过跳板机转发，如图：
<img src="http://zhoushirong.github.io/img/ssh-l.png" alt="ssh-l图片" width="350" height="250">
此时，ssh -L命令就能派上用场了，如下命令
```shell
# ssh -L 本地IP:本地端口:目标机器ip:目标机器端口 跳板机用户名@跳板机IP
  ssh -L 127.0.0.1:8877:10.113.133.786:8877 root@10.101.111.122
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
