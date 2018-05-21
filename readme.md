## 使用hexo一分钟搭建博客

注意：开发的时候切换到开发分支，不要切换到master分支，master分支用作hexo自动部署用。

```html
问题：
1.github.io只支持master分支；
2.hexo deploy git发布会改变提交的源码

因此既要解决保存源码又要部署hexo网站，需要在一个非master分支上开发，然后在_config.yml配置里面配置master分支即可。
```

### 部署
```shell
npm install || yarn install
hexo server
```

### 发布
```shell
hexo clean && hexo g && hexo d
```








