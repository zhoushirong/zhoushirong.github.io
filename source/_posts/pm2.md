---
title: pm2简单用法
date: 2016/03/29
tag: [pm2,nodejs]
category: 技术
---

pm2是nodejs的进程管理工具能够让你的nodejs进程永远处于启动状态
是nodejs项目常用的进程管理工具


启动如下
``` shell
set NODE_ENV=production&& npm start

set port=端口号
```

``` shell
pm2 start app.json --env production

pm2 restart app.json --env production
```

**linux 使用 export代替set**
``` shell
export -p 列出当前的所有环境变量
```

如果使用了pm2，app.json


### pm2正式项目配置举例
``` 
{
  "apps":[{
    "name":"appName",
    "script":"bin/www",
    "log_date_format":"YYYY-MM-DD HH:mm:SS",
    "merge_logs":true,
    "log_file":"../logpath/file.log",
    "error_file":"../logpath/err.log",
    "out_file":"../logpath/out.log",
    "pid_file":"../logpath/file.pid",
    "exec_mode":"fork_mode",
    "watch":true,
    "env":{
      "NODE_ENV":"development",
      "PORT":80
    },
    "env_test":{
      "NODE_ENV":"test",
    },
    "env_production":{
      "NODE_ENV":"production",
      "PORT":80
    }
  }]
}
```
示例启动
``` shell
pm2 start app.json --env test
```


pm2传送门：

[https://github.com/Unitech/pm2](https://github.com/Unitech/pm2)

nodejs传送门：

[https://nodejs.org/dist/latest-v5.x/docs/api/](https://nodejs.org/dist/latest-v5.x/docs/api/)

nodejs中文传送门：

[http://nodeapi.ucdok.com/#/api/](http://nodeapi.ucdok.com/#/api/)


