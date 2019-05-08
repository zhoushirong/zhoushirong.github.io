---
title: 小程序开发经验(一)
tag: [小程序, 微信开发]
date: 2019/01/08
---

小程序开发对于前端开发者来说其实很简单，稍微看一下官方文档就能够上手了。
但是，如果是第一次开发小程序，多多少少还是还是会遇到一些坑的。
最近恰好开发了一个正式版本的小程序，下面是开发过程中的一些总结以及遇到了一些问题。

ps: 适合有一定前端基础的、首先大致看过小程序官方文档的同学观看。

### 小程序开发前期准备
开发小程序，首先得申请账号：
小程序账号类型分为个人账号和企业账号，“企业账号”相对于“个人账号”拥有更多的功能。

账号申请成功之后就得申请并分配权限了：
小程序后台有各种权限，开发者权限(登录、体验、开发设置)、体验者权限、运营者权限、master。
可以预先给开发、测试、产品、UI等同学开相应的权限，以便后期测试、预览、体验。
申请权限地址： http://kf.qq.com/faq/170302zeQryI170302beuEVn.html


### 开发阶段
有了权限之后，就可以新建项目了，过程中需要配置appid、域名等。

**APPID 配置：**在小程序后台获取到 appid，并配置在项目中，（ appid 就是小程序的身份证明，唯一固定的），就是根据这个来判断小程序是个人账号还是企业账号的。

**域名配置：**开发环境配置 - 服务器域名配置：request、socket、uploadFile、downloadFile
小程序不支持 javascript 原生的 ajax 请求，需要使用其内置的请求接口，不同的功能需要使用不同的接口。
要想在生产环境中使用这些接口，需要预先在小程序后台配置其域名。

**开发环境配置 - 业务域名配置：**
小程序提供 webview 打开 h5 页面，统一需要预先在后台配置业务域名。
且该域名需要进行校验，其中一个校验方法就是下载其校验文件，将其配置在该域名的服务下面

如：域名：www.example.com  校验文件：abcAbc.txt
只需要能够保证 www.example.com/abcAbc.txt 能够正常拿到 abcAbc.txt 的文件内容即可。


**mock 数据：**
前后端分离开发，本地 mock 数据是不可缺少的
同 h5 开发一样，我们可以本地启动一个 mock 服务，提供 mock 数据接口，如：127.0.0.1:8587/test1
可以使用 https://github.com/zhoushirong/static-mock 一键启动本地 mock 服务

启动服务之后，需要在开发者工具中将域名合法校验等关闭，不然会出现请求不通的情况：
工具 —— 项目详情 —— 项目设置 —— 不校验合法域名、web-view 域名...

**注意：**
连代理在真机上调试的时候需要开启调试模式。（打开小程序 — 点击微信右上角'...' — 打开调试模式）
苹果开发 https 访问的时候，证书需要通过苹果 ATS 认证，不然访问不了，这意味着，自己做的证书不能用。
测试阶段建议使用 http，不要使用 https

后端接口上线之后，可以开启https请求，并将域名校验重新打开。
打开之后如果还是会出现请求不通的情况，可以通过下面的命令进行检测。
如：
```shell
# 下面命令是用来检测域名是否通过 ATS 认证的
# 仅适用于 MAC OS 系统。
nscurl --ats-diagnostics --verbose https://www.epoos.com
```


##### 小程序路由
小程序路由可以通过如下方法进行跳转
```html
wx.navigateBack：返回
wx.switchTab：切换 tab
wx.navigateTo：跳转、保留原页面
wx.redirectTo：跳转、不保留原页面
wx.reLaunch：关闭当前页，重新打开网页（重要：不能返回）
```

**注意：**
在小程序中使用中我们会经常用到很多跳转，是不希望用户能够返回上一个页面的
如登录，登录成功之后就不能允许用户通过返回回到登录页面了。
之前在网上看到有人说通过 wx.redirectTo 打开能够阻止用户返回上一个页面，经测试发现不行。
此时，需要使用 wx.reLaunch，通过这种方式打开的小程序页面左上角就没有返回图标了。


##### 小程序登录
1）登录过程
获取 code —— 换取 token —— 生成 cookie —— 存储 cookie
查看官方的登录文档即可。
https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html


2）登录态控制
对于登录态，一般情况下我们都是通过记录 cookie 来实现的。
但是，微信原生的 wx.request 不支持传统的 Cookie 读写，所以登录成功之后后端接口 response 写的 cookie 就不会成功。
原来我们的解决方案是将 cookie 信息通过请求内容来传输。

好在，现在社区还是有一些大侠做了一些基础设施。
我们可以使用 weapp-cookie 这个库来实现传统 cookie 的功能
它号称一句代码实现浏览器的 cookie 功能，当然，经实践，确实挺好用。
它将自动代理 wx.request 接口的访问，通过模拟的方式将cookie 存在 storage 来实现传统 cookie 的功能
使用凡是，可以查看其 github 文档
https://github.com/charleslo1/weapp-cookie

**注意：**
1.小程序原生支持 npm node_module 直接引入，但是，此组件通过 require 直接使用 node_module 中的组件之后，代码混淆之后会出现引入不成功的问题。因此，还是需要安装此组件官方推荐的方式，将其拷贝到其它目录下，然后再引入。

2.此组件只代理了 wx.request，并未代理 wx.uploadFile 等其它接口
因此，在 wx.uploadFile 调用的时候如果后端接口有校验用户身份，需要手动将 cookie 写入 header 中。
```javascript
let cookie = app.cookies.get('XXX_SESSION_KEY')
let uploadTask = wx.uploadFile({
  url: url,
  filePath: self.tempFilePaths,
  header: {
    'Cookie': `XXX_SESSION_KEY=${cookie}` // 手动添加 cookie
  },
  name: 'file',
  success (res) {
  }
})
```

##### 小程序兼容性
小程序在开发之前就应该确定好兼容的范围，然后根据此范围，在开发的时候来确定哪些 api 是否可用。
如：基础库
基础库决定了小程序支持哪些功能，不同的微信版本都有着对应的基础库版本，开发之前需要与产品人员商议、做好功能与用户体验的平衡，最低兼容到哪个微信版本。
关于基础库官方文档：
https://developers.weixin.qq.com/minigame/dev/framework/client-lib/

ES6 兼容情况：
小程序支持 ES6 很多常用的预发，但是并不是所有的都支持，具体可参考文档
关于 ES6 官方文档：
https://developers.weixin.qq.com/miniprogram/dev/framework/details.html

CSS3 兼容情况：
小程序不直接使用 css3，而是 wxss ，不过 css3 常用的动画、flex 布局都能够支持。
若是需要兼容低版本的手机系统，则需要开启 ES6 转 ES5;
上传代码时，样式自动补全（工具 - 项目详情 - 项目设置）



##### 小程序更新
小程序启动分为热启动、冷启动，冷启动的时候会触发小程序更新
除了微信冷启动自动更新之外，我们也可以自动检测小程序的更新 updateManager
在开发过程中，可以通过微信开发者工具，配置’编译‘模式，触发小程序模拟更新。
如无特殊要求，小程序自己的冷启动更新机制就能够满足更新要求了。
具体可查看官方文档：
https://developers.weixin.qq.com/miniprogram/dev/framework/operating-mechanism.html


##### 小程序性能与优化
大小限制与分包下载：小程序原先限制了包大小为 1M，后面改为了 2M，这个在开发者工具 —— 项目详情 可以看得到。
小程序太大一般原因是因为图片太多，可以尽可能的减少图片的使用，然后对图片进行压缩。
如果真的必须要超过 2M，可以使用分包加载。分包加载不得超过 8M。
为了能够更快的下载小程序，小程序的包还是越小越好。

性能：

1.打开性能窗口可以看到小程序的性能参数，开发版本能看到更多的信息。
体验版本和线上版本可以先通过开发打开调试，然后在打开体验版本和线上版本，能看到部分信息。

2.页面栈不要超过 5 层限制，超过之后会导致打不开页面，解决办法，可以使用 wx.redirect 或者 wx.reLaunch

3.网络状态小程序还是很重要的，可以通过获取网络状态来优化小程序的一些操作。
```javascript
// 可以根据不同的网络做相应的事情
wx.getNetworkType({
  success: function(res) {
    // networkType字段的有效值：
    // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
    if (res.networkType == 'wifi') {}
  }
})
```

4.另外，小程序开发者工具还有一个体验评分功能。
使用方式为：控制台 —— Audits（和 console、network 在同一排）
开启之后录制即可，一试便知。

5).小程序数据上报与监控
小程序自己本身后台有做很多数据的统计
除此之外还可以自己上报一些 自定义数据，自定义数据 value 为 number 类型，不得超过 128 个。
如果还不能满足，则可以自己做埋点，然后通过 wx.request 接口做数据上报。
官方文档：
https://developers.weixin.qq.com/miniprogram/dev/api/wx.reportMonitor.html



##### 小程序二维码与分享
小程序生成二维码，生成分享链接是必不可少的功能。
我们可以在小程序二维码生成需要小程序上线之后，通过后端接口请求小程序的接口来生成分享的二维码。
官方文档：
https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/qr-code.html

小程序的分享只能针对页面做配置，不能全局配置，详情可以查阅官方文档。

小程序模板与数据双向绑定（待续）


### 测试阶段
开发提测之后，我们需要给测试人员测试，有两种方式提测，各有优劣。
测试方法一：在开发者工具将小程序上传 — 在后台将上传的小程序设为体验版 — 测试人员用体验版进行测试
测试方法二：给测试人员开启开发者权限，开启代码权限，让他们自己拉代码，自己发布体验版进行测试。

**注意：**
未发布之前，自签证书 ios 可能会验证会通不过，https 接口调不通，因此、开发测试阶段使用 http 进行测试。
真机测试需开启调试模式。
测试阶段开发者工具需要设置不校验 https 证书



### 踩坑指南
以上是开发过程中的个人觉得比较不容易发觉但是又绕不过去的一些情形。
下面是开发过程中遇到的一些坑，稍微了解一下有助于走的更顺畅。

1.开发环境请求不通
原因：
1.自签证书 https 不通 
2.真机上未开启调试模式。
解决办法：
```html
开发者工具设置不检验合法域名
真机开启调试模式
```

2.线上(预发)环境 https 不通
场景：
预发环境 https 接口不通，真机，微信小程序体验版 ios 调接口不通，android 可以调通；
后验证相同域名下 H5 页面，发现 ios safari 不通、微信扫一扫打开 不通。
线上正常。
检测：
```shell
nscurl --ats-diagnostics --verbose https://xxx.xxx.xxx # 苹果电脑上 ATS 检测
```
结果：
检测之后发现预发环境的 ATS 测试通不过
线上检测能通过。

解决：
```html
检查并修改预发环境的 nginx 与证书配置，使之能够通过 ATS 检测
```

3.textarea ios 真机有默认内边距，导致对不齐，android 正常
原因：
搜了一下，别人也遇到过类似情况，微信官方未给出解决方案。
解决：
获取系统信息，根据系统型号对 ios 设置 class，针对 class 做样式特殊处理。
```javascript
let isIos = /ios/i.test(app.system.system)
if (isIos) {
  this.setData({
    isIos: true
  })
}
```
```html
<view class="c-textarea-box {{isIos ? 'c-textarea-box-ios' : ''}}">
	<textarea></textarea>
</view>
```
```css
.c-textarea-box-ios {
  padding-top: 16rpx;
  margin-left: -8rpx;
}
```


4.分别设置 loading 和 toast 蒙层的 mask 为 true 和 false
两个分别调用之后会导致蒙层属性干扰，蒙层不可穿透功能失效
```javascript
wx.showLoading({
  title: 'loading...',
  mask: true
})
wx.showToast({
  title: 'toast...',
  mask: false
})
```
解决办法：两个都设置为 true。


5.文件上传的时候后端获取不到用户登录态 cookie
原因：weapp-cookie 组件只代理了 wx.request，并未代理 wx.uploadFile 等其它接口。
解决办法：在 wx.uploadFile 调用的时候如果后端接口有校验用户身份，需要手动将 cookie 写入 header 中。



6.获取手机号码失败
用户注册之前获取手机号码密文，然后拿到服务端解密，会出现偶现的解密失败的情况
原因：获取微信登录 code 不能放在获取手机密文的回调里面
解决办法：预先获取微信登录 code


7.微信获取的用户头像是方形的
```html
<open-data class="user-logo" type="userAvatarUrl"></open-data>
```
通过上述方法获取到的用户头像是方形的，如果要展示圆形头像，直接通过 user-logo class 设置样式无效
解决办法：加一层父标签，然后对父标签设置绝对定位、并且设置 border-radius，设置 overflow: hidden;
```html
<view class="fbox">
  <open-data class="user-logo" type="userAvatarUrl"></open-data>
</view>
```

8.button disabled 样式不生效
解决办法：重写 disabled 样式加上 ! important 属性

9.checkbox 样式修改不了
解决办法：不知道哪来的黑科技，使用如下选择器即可
```css
checkbox {
 vertical-align: top;
}
/* 未选中的 背景样式 */
checkbox .wx-checkbox-input {
  border-radius: 2rpx;
  width: 28rpx;
  height: 28rpx;
  line-height: 28rpx;
  padding: 0;
  margin: 0;
  margin-top: -2rpx;
  text-align: center;
}
/* 选中后的 背景样式 （红色背景 无边框 可根据UI需求自己修改） */
checkbox .wx-checkbox-input.wx-checkbox-input-checked {
  background: #0064ff;
  border-color: #0064ff;
}
/* 选中后的 对勾样式 （白色对勾 可根据UI需求自己修改） */
checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
  font-size:26rpx;
  color:#fff; /* 对勾颜色 白色 */
  background: transparent;
  transform:translate(-50%, -50%) scale(1);
}
```


10.1px 像素问题
同 H5 一样，也存在 1px 像素问题。
解决办法同 H5 css3，通过 transform 变换设置 1px 像素
```css
/**
* 实线
*/
.border-1px:after {
  position: absolute; 
  content: '';
  width: 100%;
  left: 0;
  bottom: 0;
  height: 1px;
  background-color: #e6e6e6;
  -webkit-transform: scale(1, 0.5);
  transform: scale(1, 0.5);
  -webkit-transform-origin: center bottom;
  transform-origin: center bottom;
}
/**
* 虚线
*/
.dashed-line-1px {
  border-bottom: 1px dashed #e0e0e0;
  -webkit-transform: scale(1, 0.5);
  transform: scale(1, 0.5);
}
```

11.组件样式继承
全局样式对组件不生效。
原因：除了继承样式（如：font、color）在组件外面页面中 或者 全局定义的样式不会被组件内部继承。
两个解决办法：
```html
1).在组件内部再引入一次全局样式。
2).激活 addGlobalClass 选项。options.addGlobalClass: true (基础库 2.2.3 开始支持)
```

12.事件冒泡
要想事件触发不会冒泡到上一次父节点，需要使用 catch+event 的组合（如：catchtap）
bind 会触发事件冒泡、catch 不会触发事件冒泡
即 原来的 bindtab="tabEvent" 
改为： catchtab="tabEvent" 即可


13.上传图片会触发 onShow 事件
如果需要在onShow上做一些事件触发，得注意当前页面有没有文件或者图片上传，如果有，则需要注意

14.jpg格式图片上传，真机上的file/content-type为image/jpg，这是非标准的MIME头，正常的应该是image/jpeg，开发者工具是正确的，这个应该是微信的bug。


### 名词解释
appId：小程序ID，每个小程序都有唯一的一个 appid，在小程序后台就可以查到
openId：用户唯一标识，每个用户在每个应用（小程序、订阅号、服务号）中的 openId 都是不一样的，需要用户登录小程序后，后台拿着 code 去微信接口获取
unionId: 如果开发者拥有多个移动应用、网站应用、和公众帐号（包括小程序），可通过 UnionID 来区分用户的唯一性，因为只要是同一个微信开放平台帐号下的移动应用、网站应用和公众帐号（包括小程序），用户的 UnionID 是唯一的。换句话说，同一用户，对同一个微信开放平台下的不同应用，unionid是相同的。

