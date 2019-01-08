---
title: iphoneX 兼容
date: 2019/01/08
tag: [iphonex, 齐刘海, css]
---

iphone 齐刘海兼容，作为前端开发几乎是绕不过去的一道坎。
很早之前就遇到过，这里记录一下其解决办法。

大致思路就是：
第一步：在 H5 页面头部加入 meta，设置如下：
```html
<meta name="viewport" content="width=device-width, viewport-fit=cover">
```

第二步：在 css 中空出一个安全距离。
```css
padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
```

解释：
当然，不一定要用上面的 padding，可以是margin、padding、postion 的 top、left 等等。
具体视情况而定。

其兼容关键在于下面两个属性。
```css
constant(safe-area-inset-bottom)
env(safe-area-inset-bottom)
```

constant() 和 env() 函数是 ios11 新增特性，webkit的一个 css 函数。
用于设定安全区域的与边界的距离。
有四个预定义变量。
```html
safe-area-inset-left：安全区域距离左边边界距离
safe-area-inset-right：安全区域距离右边边界距离
safe-area-inset-top：安全区域距离顶部边界距离
safe-area-inset-bottom：安全区域距离底部边界距离
```

上面的方法与属性的组合目的就是计算出安全的边距。
这个边距只针对需要边距的设备（如：iphonex）生效。
有了这个边距，接下来我们不论是 margin、padding还是其他，只要能将这个边距空出来就能实现安全距离了。



