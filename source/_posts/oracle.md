---
title: Nodejs连接oracle数据库
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
有一点需要特别注意，nodejs 连接 oracle 数据库可能不能直接进行连接，需要在 nodejs 应用所在的机器（服务器）上安装一个 oracle 即时客户端。

##### 安装详细教程见：
https://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html

##### 安装步骤简化版本如下：
1.下载 oracle 即时客户端
mac系统直接下载osx版本，直接放置在当前用户下的lib目录下即可（无须进行后面的步骤）。
如:
```html
~/lib/instantclient_18_1
```
linux服务器，去如下连接找到对应系统版本，将其上传到服务器上
https://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html

2.对于服务器安装，解压 oracle 即时客户端到对应目录下，如: instantclient_18_3
配置环境变量 LD_LIBRARY_PATH(好像没用，没用直接用第三步2)
如: LD_LIBRARY_PATH="$HOME/xxxx/instantclient_18_3"
注意：不知道为什么直接写在profile文件里面不生效，用export LD_LIBRARY_PATH ="$HOME/xxxx/instantclient_18_3” 就会生效


2-2(推荐).如果2未能生效，则选用下面的方式，创建 config 文件
```shell
# 这个命令的意思是将 instantclient 解压目录写入到动态配置软件库里面，也可以手动创建文件，文件内容就是instantclient的绝对路径
sudo sh -c "echo /xxx/instantclient_18_3 > \ /etc/ld.so.conf.d/oracle-instantclient.conf" 
sudo ldconfig # 重启服务
```

3.安装 libaio1 库，有的老版本服务器，系统未安装libaio，则需要手动安装这个库
```shell
# 有的是需要安装 libaio1, 有的是 libaio，具体根据系统决定。
# 安装方式也不一定是apt-get，可能是rpm yum等。
apt-get install libaio1
```
