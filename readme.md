## 博客地址
[https://zhoushirong.github.io](https://zhoushirong.github.io)

## 使用hexo一分钟搭建博客

注意：开发的时候切换到开发分支，不要切换到master分支，master分支用作hexo自动部署用。

### github.io
```html
创建github账号
创建xxx(用户名).github.io项目
创建master分支、创建develop分支（要创建两个分支，master默认的，develop可自行定义名称）
```

### 安装nodejs、安装git
```html
过程略（安装过程网上有很多）
```

### 安装、搭建hexo环境
```shell
npm install hexo-cli
hexo init
npm install || yarn install
npm run server
```
如果有不明白的可以参考[hexo](https://hexo.io/zh-cn/docs/index.html)官网

### 发布准备
```shell
npm install hexo-deployer-git --save
```
要发布需要安装此模块，不然发布不了。

### 修改_config.yml的deplay配置，填自己的git仓库地址和‘master’分支。（必须）
```shell
deploy:
  type: git
  repo: https://github.com/zhoushirong/zhoushirong.github.io.git
  branch: master
```


### 遇到的问题

```html
1.github.io只支持master分支；
2.hexo deploy git发布会改变提交的源码
```

因此，如果在master分支上开。
发布之后master代码会被重新覆盖，这样肯定是不能接受的。
解决办法是开发不要用master分支，用develop分支，部署的之后指定branch为master。

同时切换默认分支master为develop（settings -> branchs -> develop）

### 部署
```shell
npm install || yarn install
hexo server
```

### 发布
```shell
hexo clean && hexo g && hexo d
```








