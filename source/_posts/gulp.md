---
title: Gulp基本用法
date: 2016/12/20
tag: gulp
category: 技术
---

Gulp是一个模块化打包工具。
Gulp本身只有几个入口，支持他拥有强大功能的是各种各样的插件。
Gulp的使用看起来非常简单，只需要一个一个任务链式执行就可以了，它还可以与Webpack结合起来使用
比如将Webpack作为一个插件来处理ES6转换为ES5的操作。
下面记录一下Gulp的API以及一些用到的插件。


``` javascript
gulp.src(globs[, options])
```
输出（Emits）符合所提供的匹配模式（glob）或者匹配模式的数组（array of globs）的文件。 将返回一个 Vinyl files 的 stream 它可以被 piped 到别的插件中。

globs：一种匹配文件的规则。

---

``` javascript
gulp.dest(path[, options])
```
能被 pipe 进来，并且将会写文件。并且重新输出（emits）所有数据，因此你可以将它 pipe 到多个文件夹。如果某文件夹不存在，将会自动创建它。

文件被写入的路径是以所给的相对路径根据所给的目标目录计算而来。类似的，相对路径也可以根据所给的 base 来计算。 请查看上述的 gulp.src 来了解更多信息。

---

``` javascript
gulp.task(name[, deps], fn)
```
定义一个使用 Orchestrator 实现的任务（task）

Orchestrator: 一个执行并发任务的库。

---

``` javascript
gulp.watch(glob[, opts], tasks)
```
监视文件，并且可以在文件发生改动时候做一些事情。它总会返回一个 EventEmitter 来发射（emit） change 事件。

glob：

类型： String or Array

一个 glob 字符串，或者一个包含多个 glob 字符串的数组，用来指定具体监控哪些文件的变动。

eg:

``` javascript
var watcher = gulp.watch('js/**/*.js', ['uglify','reload']);
watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

gulp.watch('js/**/*.js', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
```

---



### 相关链接：

中文网官网：

http://www.gulpjs.com.cn/docs/api/

#### gulp-babel插件：

gulp使用babel编译文件

https://github.com/babel/gulp-babel


#### gulp-util插件

gulp插件的一些实用方法（Utility functions for gulp plugins）

https://github.com/gulpjs/gulp-util


#### gulp-imagemin插件

压缩png、jpeg、gif、svg图片用的压缩工具（Minify PNG, JPEG, GIF and SVG images with imagemin）

https://github.com/sindresorhus/gulp-imagemin


#### gulp-clean插件

用来移除文件或者文件夹的插件（A gulp plugin for removing files and folders from given paths.）

https://github.com/peter-vilja/gulp-clean


#### gulp-sequence插件

执行一个连续的gulp任务（Run a series of gulp tasks in order.）

https://github.com/teambition/gulp-sequence


#### gulp.spritesmith插件

合并图片（不会翻译）（Convert a set of images into a spritesheet and CSS variables via gulp）

https://github.com/twolfson/gulp.spritesmith


#### gulp-sourcemaps插件

gulp sourcemap支持（Source map support for Gulp.js）

https://github.com/floridoo/gulp-sourcemaps


#### gulp-concat插件

合并文件流（Streaming concat middleware for gulp）

https://github.com/contra/gulp-concat


#### gulp-autoprefixer 插件

给css加前缀（Prefix CSS）

https://github.com/sindresorhus/gulp-autoprefixer


#### gulp-file-include插件

文件include合并支持（a gulp plugin for file include）

https://github.com/coderhaoxin/gulp-file-include


#### gulp-rev插件

静态资源加hash重命名
(Static asset revisioning by appending content hash to filenames: unicorn.css → unicorn-d41d8cd98f.css)

https://github.com/sindresorhus/gulp-rev


#### gulp-rev-collector插件

文件变化之后修改时间戳（不会翻译）

（Static asset revision data collector from manifests, generated from different streams, and replace their links in html template.）

https://github.com/shonny-ua/gulp-rev-collector


#### browser-sync插件

浏览器实时更新(Keep multiple browsers & devices in sync when building websites.)

https://github.com/browsersync/browser-sync
















