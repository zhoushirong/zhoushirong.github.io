---
title: Webpack 学习整理
date: 2019/01/17
tag: [webpack, babel]
category: 笔记
---

Webpack是一个前端资源加载以及打包工具,只需要简单的配置即可实现前端各种工程化的操作。
配置 webpack 说难不难，说简单也不简单，现在几大框架都配备了全家桶，quick-start 项目基本上都已经配置好了基础的 webpack 配置。
虽然能够正常使用，但是，对于各个配置项，并不是很清楚。这几天利用空余时间，理一下几个 loader 和 插件的使用。


### 关于 loader && loader 的加载顺序
loader 是一个函数，用来把文件转换为 webpack 识别的模块，webpack 本身只能处理加载 javascript，对于 css、image 等资源是无法处理的，而 loader 就是 webpack 开放出来的接口，供用户开发自己的 loader。

loader的使用方式如下
```javascript
rules: [
  {
    test: /\.(css|scss)$/,
    loader: ['style-loader', '....', 'url-loader']
  }
]
```
webpack loader 可以是一个数组，数组的加载方式是从右向左，如上面这个配置，loader 执行的时候，会先使用 url-loader 加载文件，最后用 style-loader 将代码插入文档中。

### file-loader/url-loader/tyle-loader/mini-css-extract-plugin loader/vue-loader/css-loader

1.*file-loader* 
文件加载 loader，主要用来加载 import/require 导入的文件
加载比如 css 中 background-image src 的图片等资源
加载导入的字体文件
*官方介绍*
```html
The file-loader resolves import/require() on a file into a url and emits the file into the output directory.
```

2.*url-loader* 
和 file-loader 功能类似，它依赖于 file-loader，file-loader 有的功能它都有
*不同之处在于能将导入的文件转为 base64，可以指定文件大小限制，小于某个值的时候将文件转为 base64 的 url*

3.*style-loader && vue-style-loader && mini-css-extract-plugin loader*
1）style-loader 负责将 css 以内联的方式插入文档中
2）vue-style-loader 功能和style-loader 类似，只不过它更专注于 vue 中的 css 提取
3）mini-css-extract-plugin 从名字可以看出，它本身是一个插件，作用是将 css 分离出来，它能将 css 插入文档中，和 style-loader 的区别在于 style 是将 css 内联插入，而它的 loader 通过外部引入的方式将 css 插入文档中。
*注意：mini-css-extract-plugin loader 和 vue-style-loader不能同时使用*

4.*css-loader*
加载外部引用 css (@import)以及 从 .vue 文件中提取出来的 css 资源
使用此 loader 只是提取 css 资源，之后还需要用 style-loader 等 loader 将 css 插入 Dom，建议写法：
```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
...
{
  test: /\.css$/,
  loader: [devMode ? 'style-loader': MiniCssExtractPlugin.loader, 'css-loader']
},
```
注意：css-loader如果是用在vue-ssr服务端构建的时候，需要配置exportOnlyLocals，示例如下：
```javascript
module: {
  rules: [
    {
      test: /\.(css|scss)$/,
      loader: [
        {
          loader: 'css-loader',
          options: {
            exportOnlyLocals:true
          }
        },
        'postcss-loader', 
        'sass-loader'
      ]
    },
  ]
},
```

5.*sass-loader*
将 sass/scss 文件编译为 css 文件，需要依赖 node-sass，编译为 css 之后还需要加载 css，所以还得调用 css 的加载 loader，建议写法：
```javascript
{
  test: /\.scss$/,
  loader: [devMode ? 'style-loader': MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
}
```

6.*postcss-loader*
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

---

### javascript 还需要 loader 吗？

不是说 webpack 自己能加载 js 吗，为什么还需要 js 相关的 loader 呢？
没错，javascript 本身是不需要 loader 的，但是如果要使用 es6+ 的新特性，就需要用到 loader 了。
我们知道，对于 es6 新特性，不同浏览器支持情况是不一样的，我们使用 loader 的目的就是将 es6 转换为可被浏览器接受的 javascript 语法，似乎跟前面 css 的 postcss-loader 作用一样？

##### ecmascript 标准制定过程
使用 babel 和 babel-loader，最好是能先对 Ecmascript 的版本和制定有一定的了解。
Ecmascript制定一般会经过如下几个阶段：
```html
stage0：开放阶段，草稿阶段
stage1：初步标准，提议阶段
stage2：草稿阶段，观察阶段
stage3：候补阶段，开发者基本认可了
stage4：完成阶段，基本确定（不会100%确定）会加入下一个 ecmascript 版本中
```
而 babel 的转换具体转换到哪个阶段，则需要自己对其进行相应的配置。

##### babel
babel，是一个伟大的“发明”。
最近几年 javascript 更新很快，不断有新的特性被提出，不断有的的版本发出。
但是因为客户端本身的复杂性，要想将 js 的新特性运用在浏览器端，并做到很好的兼容性是一个很“艰难”的过程。
各种各样的兼容性已经足够增加成倍的开发成本了。

好在，babel 的出现解决了这个问题，它的出现可以说推进了 javascript 的演进历程。
那么它是如何做到的呢？

#### babel 原理
babel 是一个‘编译器’，能将高版本的 javascript 编译成低版本的 javascript，以至于浏览器能够正常的使用。
babel 可以单独使用，但是目前更多的还是配合构建工具（如 webpack）来进行使用。

sass-loader 能够将 scss 转换为 css 供浏览器识别。
使用 babel-loader 能够将 es6 转换为 es5 来供浏览器识别。
```javascript
{
  test: /\.js$/,
  include: [resolve('src')],
  loader: 'babel-loader'
}
```

当然，仅仅这样配置是不够的。因为 javascript 本身比 css 复杂，涉及到更多的版本，包括前面提到的各个 stage 需要兼顾，还得考虑转换之后代码的冗余程度。
具体配置示例如下所示：

```javascript
// babel.config.js
module.exports = function(api) {
  api.cache(true)
  const presets = [
    [
      '@babel/preset-env', // 可简写 @babel/env， 这个是包括了很多支持 javascript 版本转换的插件。
      {
        'targets': {
          'browsers': [ // 这个指定编译之后需要兼容的浏览器范围
            '> 1%',
            'last 2 versions',
            'ie >= 9'
          ]
        },
        // 只包括你需要的 polyfill,
        // Babel 将检查你的所有代码，以查找目标环境中缺少的功能，并仅包含所需的 polyfill
        // 如果我们没有将 env preset 的 "useBuiltIns" 选项的设置为 "usage" ，就必须在其他代码之前 require 一次完整的 polyfill。
        'useBuiltIns': 'usage',
        // "amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false, defaults to "auto".
        'modules': false,
      },
    ]
  ]
  const plugins = [
    '@babel/plugin-syntax-dynamic-import', // 支持转换 import 语法
  ]
  return {
    presets,
    plugins
  }
}
```

##### Plugins && Presets
plugin 和 preset 告诉编译器如果对代码进行转换。
下面是一些常用 preset 和插件

```javascript
@babel/core // 核心库，必须安装此依赖
@babel/cli // 是一个允许你从终端使用 babel 的工具(可以全局安装)
@babel/preset-env 
/*
包括支持现代 JavaScript（ES2015，ES2016 等）的所有插件，只是为浏览器没有的功能加载转换插件
只能进行语法转化，但是不能对 api 进行转码，如 promise、set、map 等新增对象，Object.assign/Object.entries 等全局对象的转码功能
而 babel-runtime 和 babel-polyfill 就是做这些事情的。
*/
```
```javascript
@babel/polyfill // 实现目标环境中缺少的功能，包括 core-js 和自定义 regenerator runtime 来模拟完整的 ES2015+ 环境。
@babel/runtime // 和 @babel/polyfill 功能类似。
```

polyfill 和 runtime 两个模块功能几乎一样，但是实现方法不同
polyfill 会污染全局对象，但是使用简单，如果不是作为公共模块提供给其它应用，可以使用此配置。
runtime 会手动引入 helper 函数
const Promise = require('babel-runtime/core-js/promise') 就可以引入 Promise。

缺点是通过引入的方式，引入的模块不能共享，造成打包之后有很多重复的 helper 代码
所以，babel 又开发了 babel-plugin-transform-runtime 这个模块将代码重写，提取公共方法。
```javascript
babel-plugin-transform-runtime
```

除此之外，还有一些常用的，比如react支持
```javascript
@babel/preset-react // 转换 jsx 语法
```

typescript 支持，加一个 loader，再加一个 tsconfig 配置文件即可
```javascript
@babel/preset-typescript // 转换 typescript 语法 用法见后面。
```

typescript 支持，需要加 ts-loader 以及 tsconfig 配置
```javascript
{
  test: /\.ts$/,
  include: [resolve('src')],
  loader: 'ts-loader'
}
```

在根目录下加 tsconfig.json 文件
```javascript
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "sourceMap": true
  },
  "files": [
    "./src/views/index.ts",
  ]
}
```

### 相关链接

### webpack指南：
https://webpack.toobug.net/zh-cn/chapter4/using-loaders.html

### babel 中文网站
https://babel.docschina.org/docs/en/usage




