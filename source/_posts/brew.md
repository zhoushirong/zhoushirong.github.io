---
layout: default
title: brew使用文档
date: 2020-10-12
tag: brew
category: 笔记
---

brew 官网: (https://brew.sh/index_zh-cn)[https://brew.sh/index_zh-cn]

```shell
# brew 安装，如果安装速度慢或者被墙，可自行网上找镜像链接安装
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

```shell
brew -v # 查看brew版本号
brew install xxx # 安装包
brew search xxx # 搜索包
brew info xxx # 查看包信息
brew uninstall xxx # 卸载包
brew list # 显示已安装的包
brew update # 更新包，此命令更新 Homebrew自己
brew outdated # 检查过时（是否有新版本），这会列出所有安装的包里，哪些可以升级
brew outdated xxx # 检查包
brew upgrade # 升级所有可以升级的软件们
brew upgrade xxx # 升级某个包
brew cleanup # 清理不需要的版本极其安装包缓存
brew cleanup xxx # 清理包
brew –help # 查看brew的帮助
brew pin xxx # 禁止指定软件升级
brew unpin # 取消禁止指定软件升级
```

服务相关命令
```shell
brew services list # 查看 services 列表
brew services run mysql # 启动 mysql 服务
brew services start mysql # 启动 mysql 服务，并注册开机自启
brew services stop mysql # 停止 mysql 服务，并取消开机自启
brew services restart mysql # 重启 mysql 服务，并注册开机自启
brew services cleanup # 清除已卸载应用的无用配置
```