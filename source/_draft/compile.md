---
title: 前端编译
date: 2021/02/23
tag: [前端编译,compile]
category: 笔记
---

源码要运行，必须先转成二进制的机器码。这是编译器的任务。


前端编译

现在的 Babel，Webpack，ESLint，甚至 TypeScript 等的编译，都是分析 AST 后做下转换
前端工程化背景下，编译/构建几乎是前端开发中必备的一个环节了。

编译：从 A 语言到 B 语言的转换过程，如 sass 预编译文件编译到 css 文件等，sass 虽然和 css 长得像，但不能直接运行，与 css 不是同一种语言。
构建：对 A 语言的修饰过程，如压缩 js 文件，压缩之前和之后都是 JS 代码，都可以直接运行。

常见的JS编译器有babylon，acorn等等

编译出来的AST详细记录了代码中所有语义代码的类型、起始位置等信息。

正是由于AST详细记录了代码的语义化信息，所以Babel，Webpack，Sass，Less等工具可以针对代码进行非常智能的处理。

人们把能够将代码转化成AST的工具叫做“编译器”，而把能够将AST翻译成目标语言并运行的工具叫做“解释器”。




Angular 2 中有两种编译模式 JIT/AOT
https://segmentfault.com/a/1190000008739157

AOT: Adead Of Time 提前编译 - 静态编译的程序会在执行前，会使用指定编译器，将全部代码编译成机器码
JIT: Just In Time - 动态解释的程序会使用指定解释器，一边编译一边执行程序。


200 行 JS 代码，带你实现代码编译器
https://mp.weixin.qq.com/s/KpjFxHAf5jG2GyXXYMEtKQ



#### AST 与前端工程化实战
AST : 全称为 Abstract Syntax Tree，意为抽象语法树，它是源代码语法结构的一种抽象表示。
AST 是一个非常基础但是同时非常重要的知识点，我们熟知的 TypeScript、babel、webpack、vue-cli 得都是依赖 AST 进行开发的。本文将通过 AST 与前端工程化的实战向大家展示 AST 的强大以及重要性。
```javascript
const a = 1
```
词法分析阶段：将字符组成的字符串分解成一个个代码块（词法单元），例子中代码会被解析成 const、a、=、1 四个词法单元。
语法分析阶段：将词法单元流转换成一个由元素逐级嵌套组成的语法结构树，即所谓的抽象语法树。
代码生成阶段：将 AST 转换成一系列可执行的机器指令代码，例子就是机器通过执行指令会在内存中创建一个变量 a，并将值 1 赋值给它。



#### VUE完整版和运行时
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



#### webpack编译
Compiler的WebPack的模块是创建通过的WebPack CLI或途经的所有选项编译实例的主引擎
webpack 是一个强大的模块打包工具，之所以强大的一个原因在于它拥有灵活、丰富的插件机制
Compiler 是一个编译器实例，在 webpack 的每个进程中只会创建一个对象，它用来创建构建对象 Compilation，本身需要注意的属性和方法并不是很多。

#### Babel
Babel ，又名 Babel.js。 是一个用于 web 开发，且自由开源的 JavaScript 编译器、转译器。
Babel 使软件开发者能够以偏好的编程语言或风格来写作源代码，并将其利用 Babel 翻译成 JavaScript（现今在浏览器最常用的编程语言）。
Babel 是一个常用来使用最新的 JavaScript 语言特性的工具。身为一个转译器、或编译器，开发者可以使用 ECMAScript 6 以上的功能，并将其转换成旧版本等效的 JavaScript 让浏览器能够去解读。