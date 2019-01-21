---
title: Webpack 学习整理(二)
date: 2019/01/21
tag: [webpack, babel]
category: 技术
---

Demo 源代码以及完整配置在此 <a href="https://github.com/zhoushirong/webpackLearn">https://github.com/zhoushirong/webpackLearn</a>


##### ecmascript 标准制定过程
Ecmascript 制定一般会经过如下几个阶段。
```html
stage0：开放阶段，草稿阶段
stage1：初步标准，提议阶段
stage2：草稿阶段，观察阶段
stage3：候补阶段，开发者基本认可了
stage4：完成阶段，基本确定（不会100%确定）会加入下一个 ecmascript 版本中
```

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
下面是本人配置 babel 编译 es6 编译为 es5 的一些总结。

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
因此，当你安装 babel-loader，并执行编译之后，会报一个错误，需要你安装 @babel/core，当你安装 @babel/core 之后依然报错
还需要 @babel/preset-env
还需要...
N次之后，终于，正常编译并跑起来了。
具体过程不说了，结果如下：

需要在项目根目录下增加一个 babel 的配置。
其余的需要什么就安装什么，根据报错提示就行了。
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

Plugins && Presets
plugin 和 preset 告诉编译器如果对代码进行转换。
下面是一些常用 preset 和插件

```javascript
@babel/core // 核心库，必须安装此依赖
```
```javascript
@babel/cli // 是一个允许你从终端使用 babel 的工具(可以全局安装)
```
```javascript
@babel/preset-env 
/*
包括支持现代 JavaScript（ES2015，ES2016 等）的所有插件，只是为浏览器没有的功能加载转换插件
只能进行语法转化，但是不能对 api 进行转码，如 promise、set、map 等新增对象，Object.assign/Object.entries 等全局对象的转码功能
而 babel-runtime 和 babel-polyfill 就是做这些事情的。
*/
```
```javascript
@babel/polyfill // 实现目标环境中缺少的功能，包括 core-js 和自定义 regenerator runtime 来模拟完整的 ES2015+ 环境。
```
```javascript
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
除此之外，还有一些常用的，比如：
```javascript
@babel/preset-react // 转换 jsx 语法
```

#### typescript 支持
typescript 支持并不麻烦，加一个 loader，再加一个 tsconfig 配置文件即可
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
```javascript
// 在根目录下加 tsconfig.json 文件
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







