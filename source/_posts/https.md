---
title: Https基础以及本地Https搭建
tag: https
date: 2017/12/12
category: 技术
---

### 一、https是什么（相关概念简述）？
超文本传输安全协议（英语：Hypertext Transfer Protocol Secure，缩写：HTTPS，常称为HTTP over TLS，HTTP over SSL或HTTP Secure）是一种通过计算机网络进行安全通信的传输协议。 —— 维基百科

#### 1.对称加密和非对称加密
对称加密：需要对加解密的数据采用相同的密钥的加密算法。
优点：加密算法公开，计算量小，加密速度快，通常用在消息发送方加密大量数据的时候使用
缺点：需要消息传递的双方约定加密的密钥，一旦一方的密钥泄漏，信息就变得不安全了

非对称加密：需要两个密钥（公钥和私钥）来进行加密和解密，公钥解密私钥的加密数据、私钥解密公钥的加密数据，私钥一般存储在服务器端不会外漏
优点：相对于对称加密更安全，即使公钥泄漏也没办法解密
缺点：加解密花费时间长，只适合小数据量的加解密。


#### 2.https的加解密方式
https采用的是非对称加密和对称加密混合的方式进行加密的。
使用非对称加密的方式加密传递对称加密的密钥，随后使用对称加密进行通讯。

HTTP 建立 TCP 链接需要进行三次握手
HTTPS 在 TCP 之上又加上了 TLS 的握手过程，在握手过程中确定双方传输数据的密码信息。
SSL/TLS 握手是为了安全的协商出一份对称加密的密钥

#### 3.对称加密与非对称加密：

对称加密算法在加密和解密时使用的是同一个秘钥；
而非对称加密算法需要两个密钥来进行加密和解密，这两个秘钥是公开密钥（public key，简称公钥）和私有密钥（private key，简称私钥）。

与对称加密算法不同，非对称加密算法需要两个密钥：公开密钥（publickey）和私有密钥（privatekey）。
公开密钥与私有密钥是一对，如果用公开密钥对数据进行加密，只有用对应的私有密钥才能解密；如果用私有密钥对数据进行加密，那么只有用对应的公开密钥才能解密。
因为加密和解密使用的是两个不同的密钥，所以这种算法叫作非对称加密算法。


#### 4.https TLS握手过程：

``` html
1.浏览器发送一个消息：包含一个随机数Random1，支持的加密套件，TLS版本号（被叫做ClientHello请求）
2.服务端接收消息并回应（被叫做ServerHello）
	a）验证tls版本是否支持
	b)服务端从客户端发送的加密规则中选择一组加密套件
	c)接收随机数Random1,生成一份随机数Random2
	d)下发证书，包含公钥、随机数Random2（公钥放在服务器的数字证书中）
	e)如果有必要服务端需要确认客户端身份，则会要求客户端发送自己的证书（如usb密钥）
3.浏览器接收证书信息
  a)验证证书的合法性
  b)取出服务端发送过来的证书中的公钥,生成随机数Random3，并用证书中提供的公钥加密Random3
  c)最后将加密后的随机数消息发送给服务器
4.服务器接收浏览器发来的信息：使用自己的私钥将Random3解密出来，
5.用三个随机数生成session Key作为对称密钥，为后续数据传输用
```

握手结束之后，之后所有的通信数据将由浏览器之前生成的随机密码并利用对称加密算法进行加密

ps：之前浏览器与服务端互相发送加密的握手消息验证，目的是为了保证双方都获得了一致的对称加解密的密码，并且验证双方可以正常的加解密数据，为后面的真正数据传输做一次测试。


#### 5.https session Key
https建立连接是一个比较复杂的过程，如果连接断开之后需要重新进行建立连接。
重连有两种方式：sessionID和session ticket

如果对话中断，客户端可以发送之前的session重连对话，如果服务端存在这个sessionId就可以重新建立连接。

session ID是目前所有浏览器都支持的方法，但是它的缺点在于session ID往往只保留在一台服务器上。
所以，如果客户端的请求发到另一台服务器，就无法恢复对话。session ticket就是为了解决这个问题而诞生的，目前只有Firefox和Chrome浏览器支持。


##### 6.openssl是什么？
是一个开源程序的套件,这个套件有三个部分组成：一是libcryto，这是一个具有通用功能的加密库，里面实现了众多的加密库；二是libssl，这个是实现ssl机制的，它是用于实现TLS/SSL的功能；三是openssl，是个多功能命令行工具，它可以实现加密解密，甚至还可以当CA来用，可以让你创建证书、吊销证书。


### 二、为什么要使用https
1.数据加密，提高安全性。

2.证书保证，防止冒充

3.校验数据，防止被篡改



### 三、如何使用https

#### 1.使用openssl生成本地证书

##### 1）准备工作
创建一个存放证书的目录，如/sshkey：
``` shell
cd ~
mkdir sshkey
```

在sskkey目录下创建demoCA子目录
``` shell
cd sshkey
mkdir demoCA && cd demoCA && touch index.txt && touch serial && echo "01">./serial && mkdir newcerts
```

#### 2）正式生成：

制作CA证书：

第一步：生成ca.key CA私钥
```shell
openssl genrsa -des3 -out ca.key 2048
```

第二步：生成ca.crt CA根证书（公钥）：
```shell
openssl req -new -x509 -days 7305 -key ca.key -out ca.crt
```

生成网站的证书，并用CA签名认证（假设网站域名为www.example.com）

第三步：生成www.example.com证书私钥：
```shell
openssl genrsa -des3 -out www.example.com.pem 1024
```

第四步：制作解密后的www.example.com证书私钥：
```shell
openssl rsa -in www.example.com.pem -out www.example.com.key
```
ps:在common name中填入网站域名，如www.example.com即可生成改站点的证书(这里一定要填入common name，不然生成的东西为空)

第五步：生成签名请求：
```shell
openssl req -new -key www.example.com.pem -out www.example.com.csr
```

第六步：用CA进行签名：
```shell
openssl ca -policy policy_anything -days 1460 -cert ca.crt -keyfile ca.key -in www.example.com.csr -out www.example.com.crt
```

如果一切顺利，生成完成之后在demoCA下应该会看到如下子目录

```shell
#ls
ca.crt # 根证书
ca.key # CA私钥
www.example.com.crt # 
www.example.com.csr
www.example.com.key
www.example.com.pem
demoCA			
```


##### 遇到的问题
如果遇到如下报错
``` html
Using configuration from /private/etc/ssl/openssl.cnf
variable lookup failed for ca::default_ca
140735980385160:error:0E06D06C:configuration file routines:NCONF_get_string:no value:/BuildRoot/Library/Caches/com.apple.xbs/Sources/libressl/libressl-22/libressl/crypto/conf/conf_lib.c:323:group=ca name=default_ca
```

解决办法：将openssl安装目录下的openssl.cnf 拷贝到配置目录
``` shell
cp /usr/local/etc/openssl/openssl.cnf /private/etc/ssl/openssl.cnf
```

并修改其中的配置文件的dir的文件路径为之前创建的demoCA文件路径
``` shell
dir >> = /Users/zsr/learn/epoos/sshkey/demoCA/ > >
```

至此，使用openssl生成本地证书的过程就结束了，接下来就只需要在nginx中配置一番就可以看到一个https的网站了。

#### 2.生成证书之后nginx配置如下：
```shell
  1 server # 使用nginx做普通http代理
  2 {
  3     listen 80;
  4     server_name www.example.com;
  5     index index.html;
  6     location /
  7     {
  8         #proxy_pass http://10.242.22.138:8084/;
  9         alias /Users/zsr/learn/example/;
 10     }
 11     error_log /usr/local/etc/nginx/logs/error.log;
 12 }

 13 server # 使用nginx做普通https代理
 14 {
 15   listen 443;
 16   server_name www.example.com;
 17   index index.html;
 18   location /
 19   {
 20     alias /Users/zsr/learn/example/;
 21   }
 22   ssl on;
 23   ssl_certificate /Users/zsr/learn/example/sshkey/www.example.com.crt
 24   ssl_certificate_key /Users/zsr/learn/example/sshkey/www.example.com.key
 25 }
```




### 相关传送门：

生成证书
http://blog.creke.net/762.html

https介绍：
http://wetest.qq.com/lab/view/110.html

知乎上的https介绍：
https://zhuanlan.zhihu.com/p/26682342

简书上的介绍
http://www.jianshu.com/p/7158568e4867

阮一峰系列

http://www.ruanyifeng.com/blog/2014/09/illustration-ssl.html

http://www.ruanyifeng.com/blog/2014/02/ssl_tls.html

http://www.ruanyifeng.com/blog/2016/08/http.html
