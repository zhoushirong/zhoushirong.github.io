
---
title: CLI 开发技巧
date: 2021/04/08
tag: [cli, nodejs]
category: 技术
---


Npm install -g xxx 做了什么？
1.npm install -g xxx， 将安装xxx到 /usr/local/lib/node_modules 目录下
2.查找 xxx 包的 package.json 配置的 bin 属性
3.将 bin 内部的配置命令的执行文件添加到 /usr/local/bin 中
4.此时，bin 对象的内部配置命令可直接使用

Npm link 命令
在本地npm包开发的时候使用npm link命令可以为当前包创建一个全局链接，使之能够全局使用该模块的命令。
在当前目录下执行 npm link 之后，npm 会 package.json 上的配置将当前项目链接到全局node_modules
如：/usr/local/lib/node_modules/seed-cli

npm install -g(注意：此处无需指定包名)
在本地npm包开发的时候，在当前包目录下使用npm install -g 命令可以为当前包创建一个全局连接，使之能够全局使用该模块的命令
作用同 npm link

解除链接方式
在软链存在的目录下(/usr/local/lib/node_modules) 执行 unlink xxx
Warning: 千万不要执行npm unlink xxx，不然会误删所有的全局包



在命令构造器函数中使用 .positional() 方法来描述和配置位置参数



commander.js，可以自动的解析命令和参数，用于处理用户输入的命令。
download-git-repo，下载并提取 git 仓库，用于下载项目模板。
Inquirer.js，通用的命令行用户界面集合，用于和用户进行交互。
handlebars.js，模板引擎，将用户提交的信息动态填充到文件中。
ora，下载过程久的话，可以用于显示下载中的动画效果。
chalk，可以给终端的字体加上颜色。
log-symbols，可以在终端上显示出 √ 或 × 等的图标



https://winterdogdog.github.io/2019/02/node-cli-开发/

Vue-cli原理分析
https://juejin.cn/post/6844903646556078093

Vuecli 3.0 源码阅读

