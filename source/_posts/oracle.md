---
title: 用Nodejs连接Oracle数据库
tag: [oracle, nodejs, 数据库]
date: 2019/03/25
category: 技术
---

用 nodejs 连接 oracle 目前最方便的方式是使用 oracledb 这个库。
使用方法如下：
```javascript
const oracledb = require('oracledb')

const createConnection = function(data_source) {
  const { host_addr, host_port, db_name, username, pwd } = data_source
  return new Promise((resolve, reject) => {
    oracledb.getConnection({
      user: username,
      password: pwd,
      connectString: `(DESCRIPTION =
        (ADDRESS = 
          (PROTOCOL = TCP)
          (HOST = ${host_addr})
          (PORT = ${host_port})
        )
        (CONNECT_DATA =
          (SERVICE_NAME= ${db_name})
        )
      )`
    }, (err, connection) => {
      if (err) {
        console.error('connect oracle data source failed:', + err)
        return
      }
      resolve(connection)
    })
  })
}

createConnection(params).then((connection) => {
  connection.execute(sql, (err, result) => {
    connection.close((err) => {
      if (err) {
        console.error(err) // TODO
      }
    })
    console.log(result)
  })
})
```

*有一点需要特别注意: nodejs 连接 oracle 数据库可能不能直接进行连接，需要在 nodejs 应用所在的机器（服务器）上安装一个 oracle 即时客户端。*

##### 安装详细教程见：
https://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html

##### 安装步骤简化版本如下：
1.下载 oracle 即时客户端
*Mac osx 系统*直接下载osx版本，直接解压后放置在当前用户下的 lib 目录下即可。
```html
~/lib/instantclient_18_1
```

除了Mac系统，对于 Linux 系统，根据不同的系统，去如下连接找到对应系统版本，将其上传到服务器上
https://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html

2-1.对于服务器安装，解压 oracle 即时客户端到对应目录下，如: ~/instantclient_18_3
配置环境变量 LD_LIBRARY_PATH
如: LD_LIBRARY_PATH="$HOME/xxxx/instantclient_18_3"
注意：*亲测：将此配置直接写在 profile 文件里面不生效；但是，在外面用 export LD_LIBRARY_PATH ="$HOME/xxxx/instantclient_18_3” 手动设置就会生效*
所以，不推荐使用此方式，而是用下面的这种 2-2 步骤


2-2(推荐)，如果 2-1 未能生效，则选用下面的方式，创建 config 文件
```shell
# 这个命令的意思是将 instantclient 解压目录写入到动态配置软件库里面，也可以手动创建文件，文件内容就是instantclient的绝对路径
sudo sh -c "echo /xxx/instantclient_18_3 > \ /etc/ld.so.conf.d/oracle-instantclient.conf" 
sudo ldconfig # 重启服务
```
一般系统配置 config 文件之后就能正常使用了，但是有的系统还是会报错，有可能是缺少 libaio1 这个库。
如果发现缺少这个库，则进行下面的第三步进行安装。

3.安装 libaio1 库
```shell
# 有的是需要安装 libaio1, 有的是 libaio，具体根据系统决定。
# 安装方式也不一定是apt-get，可能是rpm yum等。
apt-get install libaio1
```

装完上面的基本上就ok了，如果还是不行，那么...自己再想办法吧。

-- end --
