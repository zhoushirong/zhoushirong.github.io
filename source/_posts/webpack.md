---
title: Webpack配置入门
date: 2017/03/06
tag: webpack
category: 技术
---

Webpack是一个前端资源加载以及打包工具。
只需要简单的配置即可实现前端各种工程化的操作。
Webpack结合其Loader、Plugin能够完成复杂的前端自动化构建。
除此之外它还可以与Gulp等其它工程化工具结合使用。

### Webpack的Loader和Plugin
Loader是Webpack中的一个重要概念，它是指将一段代码转换为另外一段代码的Webpack插件。
Loader被用来加载某些资源文件。
因为Webpack本身只能打包commonjs规范的js文件，对于其它资源，例如css、图片或者其他的语法集（jsx、coffee）是没有办法加载的。这就需要对应的loader将资源转化，加载进来。

Plugin用于扩展Webpack的功能。
它直接作用于Webpack，Loader也是变相扩展了Webpack的功能，之不过只是专注于资源的加载和转化。
Plugin的功能更加丰富。不仅局限于资源的加载。

### Webpack的Loader

处理样式，转成css
``` html
css-loader：遍历css文件，找到url()然后处理它们

style-loader：把css代码插入到页面的style标签中

less-loader：和css-loader、style-loader合作让webpack支持less语法

sass-loader：让webpack支持sass语法
```

图片处理，两个都必须用上。否则超过大小限制的图片无法生成到目标文件夹中
``` html
url-loader：

file-loader：
```

处理js，将es6或更高级的代码转成es5的代码。
``` html
babel-loader

babel-preset-es2015

babel-preset-react
```

将js模块暴露到全局.
``` html
expose-loader
```

---

### Webpack的Plugin

代码热替换
``` html
HotModuleReplacementPlugin
```

生成html文件
``` html
HtmlWebpackPlugin
```

将css成生文件，而非内联
``` html
ExtractTextPlugin
```

报错但不退出webpack进程
``` html
NoErrorsPlugin
```

代码丑化,开发过程中不建议打开
``` html
UglifyJsPlugin
```

多个 html共用一个js文件(chunk)
``` html
CommonsChunkPlugin
```

清理文件夹
``` html
Clean
```

调用模块的别名,例如想在js中用$，如果通过webpack加载，需要将$与jQuery对应起来

``` html
ProvidePlugin
```

定义一些全局的变量,我们可以在模块当中直接使用这些变量，无需作任何声明

``` html
DefinePlugin
```

### webpack热更新以及完整示例

热更新，可以在修改代码后，不用刷新浏览器就能看到修改后的效果。而它的另一个好处则是可以只替换修改部分相关的代码，大大的缩短了构建的时间。Webpack的热更新是它的一个特色功能，通过启动一个服务，在内存中运行，速度相对很快。

有几种配置方法都能实现热更新的
这里介绍一种通过express+webpack-hot-middleware+webpack-dev-middleware中间件来实现。

在网站根目录下创建如下文件
``` html
./webpack-dev-server.js
```

``` javascript
// 引入express
let express = require('express');

// 引入webpack
let webpack = require('webpack');

// 结合webpack-dev-middleware使用的middleware
// 它可以实现浏览器的无刷新更新（hot reload）。
// 这也是webpack文档里常说的HMR（Hot Module Replacement）。
let webpackHotMiddleware = require('webpack-hot-middleware');

// 处理静态资源的中间件
let webpackDevMiddleware = require("webpack-dev-middleware");

// webpack配置文件
let webpackConfig = require('./webpack.config.js');

// webpack服务ip端口配置
let serverConfig = require('./config/server.js');

let app = new express();

let serverOptions = {
  publicPath: webpackConfig.output.publicPath,
  contentBase: 'http://' + serverConfig.HOST + ':' + serverConfig.PORT,
  quiet: false,
  noInfo: false,
  hot: true,
  lazy: false,
  stats: {
    chunks : false,
    chunkModules : false,
    colors : true
  },
};

let compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, serverOptions));
app.use(webpackHotMiddleware(compiler));

var router = express.Router()
router.get('/', function (req, res, next) {
  res.render('/index', { message: 'Hey there!'});
})
app.use(router)

app.listen(serverConfig.PORT, function onAppListening(err) {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webpack development server listening on port %s', serverConfig.PORT);
  }
});
```

``` html
./webpack.config.js
```

``` javascript
'use strict';
let webpack = require('webpack');
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let serverConfig = require('./config/server.js');

let config = {
  devtool: 'source-map',
  context: path.join(__dirname, './'),
  entry: {
    index: [
      'webpack-hot-middleware/client?reload=true&path=http://' + serverConfig.HOST + ':' + serverConfig.PORT + '/__webpack_hmr',
      './static/js/Index.js'
    ] // reload=true是用于当需要刷新的时候允许刷新页面
  },
  output: {
    publicPath:'/',
    path: path.resolve(__dirname, './'),
    filename: 'staticPub/js/[name].entry.js'
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/,
    },{
      test: /\.(css|scss)$/,
      loader: 'style-loader?sourceMap=true!css-loader?sourceMap=true'
    },{
      test: /\.scss$/,
      loader: 'sass-loader?sourceMap=true'
    },{
      test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
      loader: 'url?prefix=font/&limit=10000',
    }]
  },

  //devtool: false,
  plugins: [
    new webpack.HotModuleReplacementPlugin(),    
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      mangle: true,
      compress: {
        warnings: false,
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new HtmlWebpackPlugin({
      favicon: path.join(__dirname, './favicon.ico'),
      title: '标题',
      filename: './index.html',
      template: path.join(__dirname, './static/html/index.html'),
      inject: true,
      hash: false,    // 为静态资源生成hash值
      minify: {       // 压缩HTML文件
        removeComments: false,      // 移除HTML中的注释
        collapseWhitespace: true    // 删除空白符与换行符
      }
    })
  ],
  resolve: {
    //定义了解析模块路径时的配置，常用的就是extensions，可以用来指定模块的后缀，这样在引入模块时就不需要写后缀了，会自动补全
    extensions: ['.js', '.jsx', 'es6', 'css', 'scss', 'png', 'jpg', 'jpeg']
  }
};

module.exports = config;
```

``` html
./config/server.js // 非必须，这里将其拆分出来
```

``` javascript
/**
 * 服务器配置
 */
const config = {
    HOST: '127.0.0.1',
    PORT: 3000
}
module.exports = config;
```

### 相关链接

## webpack指南：

https://webpack.toobug.net/zh-cn/chapter4/using-loaders.html












