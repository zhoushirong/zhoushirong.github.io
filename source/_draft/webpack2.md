
##### babel
babel，伟大的发名。







处理js，将es6或更高级的代码转成es5的代码。
``` html
babel-loader

babel-preset-es2015

babel-preset-react
```

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



### 相关链接

## webpack指南：

https://webpack.toobug.net/zh-cn/chapter4/using-loaders.html









