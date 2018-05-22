---
title: Nodejs服务器部署
date: 2018/01/08
tag: nodejs
category: 技术
---

虽然PHP是“世界上最好的语言。”
但是我还是喜欢JS。
凡是可以用Javascript来写的应用，最终都会用Javascript来写。
近些年Nodejs异常的火爆，因此有一些服务端也开始使用js来写了。作为前端开发工程师，nodejs也是必须要掌握的一项技能了。
最近在网上买了个云服务器，于是想搭个Node服务出来。

### 第一步：Nodejs的安装

现在，在Window上和Mac上安装nodejs还是很方便的，去官网下载下来，下一步下一步下一步...就可以了。
可是在服务器上安装就稍微有些麻烦了，在服务端（ubuntu）安装的时候一般都是下载源码，手动编译的，这就显得有些麻烦了。
刚开始的时候还是有些坑。

#### 通过源码编译安装

首先将nodejs的源码安装包下载下来，然后解压编译

``` shell
apt-get update # 更新已安装的包 若提示权限不足，在前面加上sudo
wget https://nodejs.org/dist/v8.9.4/node-v8.9.4.tar.gz # 获取nodejs最新包，版本号可选最新的
tar xvf node-v8.9.4.tar.gz # 解压nodejs源码包
cd node-v8.9.4 
./configure 
make # make编译需要花较长的时间
make install # 如果发现权限异常，需要在命令前面加上sudo
cp /usr/local/bin/node /usr/sbin/ 
node -v  #v8.9.4 查看当前安装的Node的版本 
```

make的时候可能会报这个错误：
``` html
WARNING: failed to autodetect C++ compiler version (CXX=g++)
```

解决办法，手动编译； 编译结束，执行make install
``` shell
apt-get install build-essential
make install
```

如果没有报错或者已解决错误，完成上述步骤，nodejs在服务端的安装以及结束了。
接下来通过查看版本，检测是否安装成功

node安装完成
``` html
node -v # 查看nodejs版本 v8.9.4
npm -v # 查看npm版本
```

nodejs安装目录
```shell
which node # 利用which命令查看当前使用的nodejs可执行文件位置
where node # 利用where is 命令查看当前所有的nodejs可执行文件位置
```

### 第二步：将本地的小网站上传到服务器上去

首先确定服务器上的网站存放目录。

这里我将它放到/website/

``` shell
scp -r /Users/zsr/test ubuntu/@123.xxx.xxx.xxx:/website
```

或者用rsync

``` html
rsync -a /Users/zsr/* root@118.193.173.25:~/website/
```
上传过长中出了一个错误,如果是直接上传到tmp就可以，其它的目录就会报错：

``` html
scp permission denied
```

网上查了下是因为权限不足，于是试了下上传到tmp目录，发现可行，确定是权限的问题之后就将自己的目录权限设置一下，就能正常上传了。
*权限问题需谨慎，这里给了最高权限，实际生产环境自己调整适当的权限。*

``` html
# chmod 777 ./data1
```

### 第三步：安装mongodb

``` html
apt-get update
apt-get install mongo
```

如果不update会报如下错误：
``` html
Unable to locate package mongo
```

### 第四步：安装pm2

``` html
npm install -g pm2
```

### 第五步：安装并配置Nginx解析

安装
``` shell
sudo apt-get install nginx
```

查看nginx是否安装成功

``` shell
nginx -v
```

配置文件路径
``` shell
/etc/nginx
```

配置过程中遇到个坑，老是返回hello nginx页面

解决办法
``` html
注释掉

/etc/nginx/nginx.conf 

里面的 

include /etc/nginx/sites-enabled/* 

这一行
```

然后增加如下nginx配置，将80端口反代理到项目端口
比如我在服务端写了个简单的node程序，端口为3000

配置代理如下：

``` html
server {
    listen 80;
    server_name xxx.xxx.xxx.xxx;
    location / {
        proxy_pass http://xxx.xxx.xxx.xxx:3000;
    }
}
```

配置完毕，检测Nginx配置是否正确

``` html
sudo nginx -t
```

检测错误，则对应具体信息做修改
检测正确，重启Nginx 服务生效

``` shell
sudo service nginx reload
```

然后访问xxx.xxx.xxx.xxx:80即可访问到Node程序了

至此服务端Node搭建网站告一段落
下一步就是申请域名了。







