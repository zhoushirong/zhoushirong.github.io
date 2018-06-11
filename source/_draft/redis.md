---
title: redis入门
date: 2018/04/24
tag: redis
---

### ubuntu安装redis
```shell
sudo apt-get install redis-server
```


### 进入redis

```shell
redis-server
# or
cd /etc/redis 
sudo redis-server redis.conf
```

### 查看redis
```shell
ps -ef|grep redis
```

### 进入redis
```shell
redis-cli
```

### redis常用命令

```shell
set age 25 # 设置一个redis数据age
keys * # 查看redis数据
get age # 查看redis数据age
```




