---
title: Webpack 学习整理(一)
date: 2019/01/17
tag: webpack
category: 技术
---

Webpack是一个前端资源加载以及打包工具,只需要简单的配置即可实现前端各种工程化的操作。
配置 webpack 说难不难，说简单也不简单，现在几大框架都配备了全家桶，quick-start 项目基本上都已经配置好了基础的 webpack 配置。虽然能够正常使用，但是，对于各个配置项，并不是很清楚。

这几天利用空余时间，从 0 到 1，纯手工打造一套 基于 webpack4.28+ + vue2.5+ 的基础构建框架。
顺便理一下几个 loader 和 插件的使用。

Demo 源代码以及完整配置在此 <a href="https://github.com/zhoushirong/webpackLearn">https://github.com/zhoushirong/webpackLearn</a>

#### 前言
如果无特殊说明，默认定义 devMode 变量为是否开发环境判断
```javascript
// webpack.config.js
const devMode = process.env.NODE_ENV !== 'production'
```


#### 关于 loader && loader 的加载顺序
loader 是一个函数，用来把文件转换为 webpack 识别的模块，webpack 本身只能处理加载 javascript，对于 css、image 等资源是无法处理的。而 loader 就是 webpack 开放出来的接口，供用户开发自己的 loader。

目前社区已经有茫茫多的 loader 了，这里不多介绍。

如下所示：
```javascript
rules: [
  {
    test: /\.(css|scss)$/,
    loader: ['style-loader', '....', 'url-loader']
  }
]
```
webpack loader 可以是一个数组，数组的加载方式是从右向左，会先使用 url-loader 加载文件，最后用 style-loader 将代码插入文档中。

##### file-loader:
```html
<!-- 官方介绍 -->
The file-loader resolves import/require() on a file into a url and emits the file into the output directory.
```
文件加载 loader，主要用来加载 import/require 导入的文件
加载比如 css 中 background-image src 的图片等资源
加载导入的字体文件

##### url-loader
依赖 file-loader，file-loader 有的功能它都有
不同之处在于能将导入的文件转为 base64，可以指定文件大小限制，小于某个值的时候将文件转为 base64 的 url

##### style-loader && mini-css-extract-plugin loader
style-loader 负责将 css 以内联的方式插入文档中
mini-css-extract-plugin 从名字可以看出，它本身是一个插件，作用是将 css 分离出来
他提供的 loader 也能将 css 插入文档中，和 style-loader 的区别在于 style 是将 css 内联插入，而它的 loader 通过外部引入的方式将 css 插入文档中。

使用举例：
```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// ...
module: {
  rules: [
    {
    test: /\.(css)$/,
      loader: [
        // 会和 style-loader 冲突，开发环境用 style-loader 能是 css 改动热更新
        // MiniCssExtractPlugin.loader 不能热更新
        devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 
      ]
    }
  ]
}
// 引入插件
plugins: [
  new MiniCssExtractPlugin({
    filename: './style.css'
  })
]
```

##### css-loader
加载外部引用 css (@import)以及 从 .vue 文件中提取出来的 css 资源
使用此 loader 只是提取 css 资源，之后还需要用 style-loader 等 loader 将 css 插入 Dom，建议写法：
```javascript
{
  test: /\.css$/,
  loader: [devMode ? 'style-loader': MiniCssExtractPlugin.loader, 'css-loader']
},
```

##### sass-loader
将 sass/scss 文件编译为 css 文件，需要依赖 node-sass，编译为css之后还需要加载css，所以还得调用 css 的加载 loader，建议写法：
```javascript
{
  test: /\.scss$/,
  loader: [devMode ? 'style-loader': MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
}
```

#### postcss-loader
写过 css3 的人应该遇到过很多需要写 css 前缀的情况，这是因为不同浏览器对新特性的支持情况不一样，很多试验性新特性需要加上浏览器前缀才会生效。
postcss 是一个很强大的东东，这里我们只是用它的一个 loader，目的是为了简化 css 写法。
和 autoprefixer 配合使用，会自动给 css 加前缀。
如：
```css
transition: transform 1s
```
经过 postcss-loader 会转换为：
```css
-webkit-transition: -webkit-transform 1s;
transition: -webkit-transform 1s;
-o-transition: transform 1s;
transition: transform 1s;
transition: transform 1s, -webkit-transform 1s;
```

用法相对其它loader，需要依赖 autoprefixer，需要多加一个配置文件 postcss.config.js
作用是设置浏览器的范围
```javascript
// postcss.config.js 文件
module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: [
        '> 1%',
        'last 20 versions',
        'ie > 9'
      ]
    })
  ]
}
```
之后就可以正常使用 postcss-loader 了，同样，此 loader 只是将 css 转换，并不会直接插入到文档中
因此后续还需要用的其它 loader，推荐用法：
```javascript
{
  test: /\.(css|scss)$/,
  loader: [
    devMode ? 'style-loader': MiniCssExtractPlugin.loader, 
    'css-loader',
    'postcss-loader', 
    'sass-loader'
  ]
}
```
**注意：**这里有个坑
在做的过程中，发现在 index.vue 中 通过 ‘@import url("../css/index.scss");’ 导入 index.scss 文件，发现 index.scss 中的 css 属性并没有经过 postcss 转换。
网上查了一下，说是需要给 css-loader 加一个 options：
```javascript
{ loader: 'css-loader', options: { importLoaders: 1 } },
```
但是，经过测试，发现并未生效，看网上的人们说的还真有这么回事儿，但是确实不行（可能是我用的 webpack 版本不一样）。
经过一番折腾，发现只有 @import 加 url 的不行
解决办法：
```css
@import url("../css/index.scss");
/* 去掉 url 改为 */
@import "../css/index.scss";
```


搞好上面几个 loader，整个 css 的处理基本上就搞清楚了。
接下来就是弄 javascript 的 loader 了。

#### javascript 还需要 loader 吗？
不是说 webpack 自己能加载 js 吗，为什么还需要 js 相关的 loader 呢？
没错，javascript 本身是不需要 loader 的，但是如果要使用 es6+ 的新特性，就需要用到 loader 了。
我们知道，对于 es6 新特性，不同浏览器支持情况是不一样的，我们使用 loader 的目的就是将 es6 转换为可被浏览器接受的 javascript 语法。
似乎跟前面 css 的 postcss-loader 作用一样？
我感觉确实是一样的。
关于 javascript-loader, "babel" 详情，请看下回分解。


