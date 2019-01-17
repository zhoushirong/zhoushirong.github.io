---
title: Webpack学习整理
date: 2019/01/17
tag: webpack
category: 技术
---

webpack 配置说难不难，说简单也不简单，学了几年的 webpack，总得有一些东西需要整理一下。
下面将 Webpack 整个配置过程理一理。
虽然 Webpack 和框架无关，但是为了举例方便，下面整片文章都是基于 Vue 项目的。

```javascript
// webpack.config.js
// 如果无特殊说明，默认定义 devMode 变量为是否开发环境判断
const devMode = process.env.NODE_ENV !== 'production'
```

loader 是一个函数，用来把文件转换为 webpack 识别的模块
webpack loader 加载方式是从右向左

file-loader : 文件 loader，加载比如 background-image 图片等资源
url-loader : 会依赖 file-loader，和file-loader功能一样，能加载文件，不同之处在于能将文件转为base64

style-loader :  将css插入Dom 中
会和 mini-css-extract-plugin 的 loader 冲突，会报错，但是开发环境使用这个做不到css热更新，建议写法：
[devMode ? 'style-loader' : MiniCssExtractPlugin.loader]

css-loader：加载外部引用 css (@import)以及 从 .vue 文件中提取出来的 css 资源，使用此 loader 之后需用 style-loader 等 loader 将 css 插入 Dom，建议写法：
{
	test: /\.css$/,
	loader: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
},

sass-loader: 将 sass/scss 文件编译为 css 文件，需要依赖 node-sass，编译为css之后还需要加载css，所以还得调用 css 的加载 loader，建议写法：
{
 	test: /\.scss$/,
    	loader: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
  }

postcss-loader：给 css 加前缀，需要和 autoprefixer 配合使用
postcss.config.js 文件
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

推荐用法：
{
  test: /\.(css|scss)$/,
  loader: [
    devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 
    'css-loader',
    'postcss-loader', 
    'sass-loader'
  ]
},







