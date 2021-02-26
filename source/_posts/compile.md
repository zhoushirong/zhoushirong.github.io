---
title: 前端编译
date: 2021/02/26
tag: [前端编译,compile]
category: 笔记
---

计算机只能执行二进制文件，但是如果人工使用二进制编写代码，无疑是非常困难的，需要付出巨大的成本。
学过 C++ 或者 Java 的都知道，使用这两种预约编写的源码文件要运行，必须先进行编译，编译就是将源码转成二进制的机器码的过程。
执行编译的工具是一个特殊的软件，我们叫它为编译器（Compiler）。
编译器识别代码中的词汇、句子以及各种特定的格式，并将他们转换成计算机能够识别的二进制形式，这个过程就是编译（Compile）。

#### 编译型语言 VS 解释型语言
当然并不是所有的编程语言都需要编译才能执行
需要编译才能执行的语言（如：C、C++、Java）被称为编译型语言。
不需要编译即可执行的语言（如:Python、JavaScript、Perl、Shell）被称为解释型语言。

当然，解释型语言执行的时候也是需要转换成机器码才能执行的，只不过它们是在运行时才翻译成机器语言的，每执行一次都要翻译一次。因此效率比较低。
而编译型语言编写的应用在编译后能直接运行，效率相对更高。

#### 前端编译的转变
前端开的主要编程语言是Javascript，Javascript是解释型语言，是不需要提前编译的，所谓开箱即用，因此前端行业（在很早之前）没有编译这回事。
而随着前端越来越复杂，开发前端时一些新手段新特性越来越多，Vue、React、NodeJS、ES6新语法等变成了基本手段。
甚至 CSS 也可以使用 Sass/Less语法来进行编写。而这些新特性大多数都是不能“开箱即用”的，都需要进行预先转换转换才能使用。
因此，现在 Javascript 开发或者说前端开发逐渐变成了“非开箱即用”了。

编译是一个语言到另一个语言表达的转变，这里面不仅仅是功能上的应用，还可以给程序带来性能上的优化。
而前端的 ES6 转化到 ES5，Less/Sass 转换为 css，require依赖打包，代码压缩混淆都可以看做是语言的转换，更是提升了应用程序的性能。
因此，这些操作是 ***“编译”***。

#### 前端编译
前端编译主要功能
```html
将框架(如 vue/react) 根据其特性语法进行模板解析、语法转换为常规 js。
将 es6、es7 等高版本 js 转换为所需要版本(如es5)的js语法
将 less、sass、css3 转换为 css
将图片压缩转换(如雪碧图、base64等)
将字体文件合并
将 js/css 依赖合并，抽离公共部分
```
进行上述操作当前前端最常用的编译工具就是 Webpack，通过引用不同的 loader 和插件即可实现。
比如使用 babel-loader 转换高级语法、使用 sass-loader 转换 sass 等等。

#### 前端编译原理
目前大多数编译过程都是先将源代码 Parser 成AST（抽象语法树），然后对 AST 进行分析，在这个分析过程中进行各种优化。
AST 是源代码语法结构的一种抽象表示。
Babel,Webpack，vue-cli和esLint等很多的工具和库的核心都是通过 AST 抽象语法树这个概念来实现对代码的检查、分析等操作的。
在前端当中AST的使用场景非常广，比如在 vue.js 当中，我们在代码中编写的 template 转化成 render function 的过程当中第一步就是解析模版字符串生成AST。
AST 是一个非常基础但是同时非常重要的，我们熟知的 TypeScript、babel、webpack、vue-cli 得都是依赖 AST 进行开发的。

以 [acorn](https://github.com/acornjs/acorn) 为例
```javascript
const a = 1
```
词法分析阶段：将字符组成的字符串分解成一个个代码块（词法单元），例子中代码会被解析成 const、a、=、1 四个词法单元。
语法分析阶段：将词法单元流转换成一个由元素逐级嵌套组成的语法结构树，即所谓的抽象语法树。
代码生成阶段：将 AST 转换成一系列可执行的机器指令代码，例子就是机器通过执行指令会在内存中创建一个变量 a，并将值 1 赋值给它。

使用 acorn 转换转换的 AST
```javascript
{
  "type": "Program",
  "start": 0,
  "end": 11,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 11,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 6,
          "end": 11,
          "id": {
            "type": "Identifier",
            "start": 6,
            "end": 7,
            "name": "a"
          },
          "init": {
            "type": "Literal",
            "start": 10,
            "end": 11,
            "value": 1,
            "raw": "1"
          }
        }
      ],
      "kind": "const"
    }
  ],
  "sourceType": "module"
}
```
然后分析语法树，并逆向进行翻译成相应的语法代码即可实现代码的编译（转换）


### 附录 - VUE完整版和运行时
使用vue.js时，可以看到官方提供了两个版本可以使用，包括vue.js（完整版）和vue.runtime.js（运行时版
vue.runtime.js和vue.js的区别在于，vue.runtime.js不包含模版编译器来获得整个包体积的减少。

如果你需要在客户端编译模板 (比如传入一个字符串给 template 选项，或挂载到一个元素上并以其 DOM 内部的 HTML 作为模板)，就将需要加上编译器，即完整版：
```javascript
// 需要编译器
new Vue({
  template: '<div>{{ hi }}</div>'
})

// 不需要编译器
new Vue({
  el: "#app",
  data: { value: 0 },
  render (h) {
    return h('div', this.hi)
  }
})
```
h就是vue.runtime.js提供的函数，它接收模版字符串中的参数，返回渲染好的原始的html。
在实际开发中，由于h函数的参数比较复杂，实际开发中通过使用webpack的vue-loader插件能将vue单文件组件（以.vue结尾的文件）转换为h函数所需要的参数

