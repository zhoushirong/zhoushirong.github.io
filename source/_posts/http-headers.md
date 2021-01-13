---
title: http的请求头基础
date: 2021/01/12
tag: [MIMETYPE,CONTENTTYPE,请求头]
category: 笔记
---

### 互联网媒体类型
互联网媒体类型（Internet media type，也称为MIME类型（MIME type）或内容类型（content type））
是给互联网上传输的内容赋予的分类类型。互联网媒体类型与文件拓展名相对应。

一个MIME类型一定包括 ***类型（type）***和 ***子类型（subtype）***
还可能包括一个或多个 ***可选参数（optional parameter）***。

比如，HTML文件的互联网媒体类型可能是
```html
text/html; charset=UTF-8
```
上面例子，文件类型为text，子类型为html，charset是一个可选参数，其值为UTF-8

#### Content-Type（内容类型）
实体头部用于指示资源的MIME类型，一般是指网页中存在的 Content-Type，用于定义网络文件的类型和网页的编码，决定浏览器将以什么形式、什么编码读取这个文件
这就是为什么发起请求的时候，有的是请求图片，有的是请求网页，有的是下载文件的原因了。

#### request 里面的 Content-Type 
用于表明发送数据流的类型，服务端根据此类型来采用该类型文件的解析方式来解析数据


#### 使用 post 方式提交数据的时候指定的几种 body 类型。
这是将发送信息至服务器时内容的编码类型。服务端根据这些类型来判断使用哪种方式解析数据。

值 | 描述
--|--
application/x-www-form-urlencoded | 原生的 form 表单的提交的默认数据格式，Body 中的数据以'key1=value1&key2=value2'的文本格式传输；如果是使用 ajax提交，则需要手动格式化body的内容。
multipart/form-data | Http协议最开始是不支持文件上传的，直到1995年发布的规范新增这个contentType类型，multipart单词是多部分的意思，这意味着body中的数据允许由多部分组成，可以同时传入二进制和文本；将表单的数据组织成Key-Value形式，用分隔符 boundary（boundary可任意设置）处理成一条消息。可同时上传文件和参数。 
application/json | body内容是 json 格式的文本
text/plain | body 的内容就只是文本，空格转换为 "+" 加号，但不对特殊字符编码。

#### form-data 举例
```html
<form action='xxx' method='post' enctype='multipart/form-data'>
  <input type='text' name='user_name' value='user_name_str'/>
  <input type='file' name='file_name' />
  <button type='submit'>提交</button>
</form>
```
下面的使用jquery post 提交方式和上面是等效的
```javascript
$.ajax({
  url: 'xxx',
  type: 'POST',
  contentType: 'multipart/form-data', // jquery ajax 默认为 x-www-form-urllencoded
  success: function() {}
})
```
#### response 里面的 Content-Type
Http响应也会带Content-Type，原理和请求的一致，目的是告诉客户端实际返回的内容的内容类型，让接收方知道怎么解析数据。


#### 常见媒体格式（维基百科）

##### Type application
值 | 描述
--|--
application/atom+xml | Atom feeds
application/ecmascript | ECMAScript/JavaScript;[4]（相当于application/javascript但是严格的处理规则）
application/EDI-X12 | EDI ANSI ASC X12资料[5]
application/EDIFACT | EDI EDIFACT资料[5]
application/json | JSON（JavaScript Object Notation）[6]
application/javascript | JavaScript。
application/octet-stream | 任意的二进制文件（通常做为通知浏览器下载文件
application/ogg | Ogg, 视频文件格式[9]
application/pdf | PDF（Portable Document Format）[10]
application/postscript | PostScript[7]
application/rdf+xml | Resource Description Framework[11]
application/rss+xml | RSS feeds
application/soap+xml | SOAP[12]
application/font-woff | Web Open Font Format;（推荐使用；使用application/x-font-woff直到它变为官方标准）
application/xhtml+xml | XHTML[13]
application/xml | XML文件[14]
application/xml-dtd | DTD文件[14]
application/xop+xml | XML-binary Optimized Packaging[15]
application/zip | ZIP压缩包[16]
application/gzip | Gzip[17]

##### Type Audio
值 | 描述
--|--
audio/mp4 | MP4音频档案[18]
audio/mpeg | MP3或其他MPEG音频档案[19]
audio/ogg | Ogg音频档案[9]
audio/vorbis | Vorbis音频档案[20]
audio/vnd.rn-realaudio | RealAudio音频档案[21]
audio/vnd.wave | WAV音频档案[22]
audio/webm | WebM音频档案
audio/flac | FLAC音频档案

##### Type Image
值 | 描述
--|--
image/gif | GIF图像文件[23]
image/jpeg | JPEG图像文件[23]
image/png | PNG图像文件[24]
image/webp | WebP图像文件
image/svg+xml | SVG向量图像文件[25]
image/tiff | TIFF图像文件[26]
image/icon | ICO图片文件。

##### Type Text
值 | 描述
--|--
text/css | CSS文件[29]
text/csv | CSV文件[30]
text/html | HTML文件[31]
text/javascript | (过时)，推荐使用 application/javascript。
text/plain | 纯文字内容[32]
text/vcard | vCard（电子名片）[33]
text/xml | XML[14]

##### Type Video
值 | 描述
--|--
video/mpeg | MPEG-1视频文件[34]
video/mp4 | MP4视频文件[35]
video/ogg | Ogg视频文件[9]
video/quicktime | QuickTime视频文件[36]
video/webm | WebM视频文件（基于Matroska基础）
video/x-matroska | Matroska（多媒体封装格式）
video/x-ms-wmv | Windows Media Video视频文件[37]
video/x-flv | Flash Video（FLV档）

##### Type Model(三维计算机图形文件)
值 | 描述
--|--
model/example[27] | Example Media Types for Use in Documentation
model/iges | IGS files, IGES files[28]
model/mesh | MSH files, MESH files[28]
model/vrml | WRL files, VRML files[28]
model/x3d+binary | X3D ISO standard for representing 3D computer graphics, X3DB binary files
model/x3d+vrml | X3D ISO standard for representing 3D computer graphics, X3DV VRML files
model/x3d+xml | X3D ISO standard for representing 3D computer graphics, X3D XML files

#### Request Headers的候选属性
属性值 | 描述 | 示例
--|--|--
Accept | 指定客户端能够接收的内容类型 | Accept: text/plain, text/html
Accept-Charset | 请求头用来告知（服务器）客户端可以处理的字符集类型。 | Accept-Charset: utf-8, iso-8859-1;q=0.5, *;q=0.1
Accept-Encoding | 指定浏览器可以支持的web服务器返回内容压缩编码类型 | Accept-Encoding: compress, gzip, deflate
Accept-Language | 浏览器可接受的语言 | Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7
Accept-Ranges | 请求资源的某一段数据 | Accept-Ranges: bytes=0-1023
Authorization | 请求消息首部包含有用来向（代理）服务器证明用户代理身份的凭证。 | Authorization: Basic QWxhZLRpbjpvcGVuIHNoc2FtZQ==
Cache-Control | 指定请求和响应遵循的缓存机制 | Cache-Control: no-cache(或者 max-age=100)
Connection | 决定当前的事务完成后，是否会关闭网络连接 | Connection: keep-alive
Cookie | HTTP请求发送时，会把保存在该请求域名下的所有cookie值一起发送给web服务器 | Cookie: $Version=1; Skin=new;
Content-Length | 请求的内容长度 | Content-Length: 348
Content-Type | 请求的与实体对应的MIME信息 | Content-Type: application/x-www-form-urlencoded
Date | 请求发送的日期和时间 | Date: Tue, 15 Nov 2018 08:22:31 GMT
Expect | 包含一个期望条件，表示服务器只有在满足此期望条件的情况下才能妥善地处理请求 | Expect: 100-continue
From | 发出请求的用户的Email | From: user@email.com
Host | 指定请求的服务器的域名和端口号 | Host: www.yanggb.com
If-Match | 只有请求内容与实体相匹配才有效 | If-Match: "737060ff8c284d8af7ad2082f209582d"
If-Modified-Since | 如果请求的部分在指定时间之后被修改则请求成功，未被修改则返回304代码 | If-Modified-Since: Sat, 29 Oct 2018 19:43:31 GMT
If-None-Match | 如果内容未改变返回304代码，参数为服务器先前发送的Etag，与服务器回应的Etag比较判断是否改变 | If-None-Match: "737060cd8c284d8af7ad3082f209582d"
If-Range | 如果实体未改变，服务器发送客户端丢失的部分，否则发送整个实体。参数也为Etag | If-Range: "737060cd8c284d8af7ad3082f209582d"
If-Unmodified-Since | 只在实体在指定时间之后未被修改才请求成功 | If-Unmodified-Since: Sat, 29 Oct 2018 19:23:11 GMT
Max-Forwards | 限制信息通过代理和网关传送的时间 | Max-Forwards: 10
Pragma | 用来包含实现特定的指令 | Pragma: no-cache
Proxy-Authorization | 连接到代理的授权证书 | Proxy-Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
Range | 只请求实体的一部分，指定范围 | Range: bytes=500-999
Referer | 先前网页的地址，当前请求网页紧随其后，即来路 | Referer: http://www.yanggb.com/yanggb1.html
TE | 客户端愿意接受的传输编码，并通知服务器接受接受尾加头信息 | TE: trailers,deflate;q=0.5
Upgrade | 向服务器指定某种传输协议以便服务器进行转换（如果支持） | Upgrade: HTTP/2.0, SHTTP/1.3, IRC/6.9, RTA/x11
User-Agent | User-Agent的内容包含发出请求的用户信息 | User-Agent: Mozilla/5.0 (Linux; X11)
Via | 通知中间网关或代理服务器地址，通信协议 | Via: 1.0 fred, 1.1 nowhere.com (Apache/1.1)
Warning | 关于消息实体的警告信息 | Warn: 199 Miscellaneous warning


#### Response Headers的候选属性
候选属性 | 说明 | 示例
--|--|--
Accept-Ranges | 表明服务器是否支持指定范围请求及哪种类型的分段请求 | Accept-Ranges: bytes
Age | 从原始服务器到代理缓存形成的估算时间（以秒计，非负） | Age: 12
Allow | 对某网络资源的有效的请求行为，不允许则返回405 | Allow: GET, HEAD
Access-Control-Allow-Credentials | 表示是否可以将对请求的响应暴露给页面，常用作跨域 | Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin | 表示请求的许可域名 | Access-Control-Allow-Origin: https://www.163.com
Access-Control-Allow-Methods | 预检请求应答中明确客户端所要访问的资源允许使用的方法(列表)。 | Access-Control-Allow-Methods: POST, OPTIONS
Cache-Control | 告诉所有的缓存机制是否可以缓存及哪种类型 | Cache-Control: no-cache
Content-Encoding | web服务器支持的返回内容压缩编码类型 | Content-Encoding: gzip
Content-Language | 响应体的语言 | Content-Language: en,zh
Content-Length | 响应体的长度 | Content-Length: 348
Content-Location | 请求资源可替代的备用的另一地址 | Content-Location: /index.htm
Content-MD5 | 返回资源的MD5校验值 | Content-MD5: Q2hlY2sgSW50ZWdyaXR5IQ==
Content-Range | 在整个返回体中本部分的字节位置 | Content-Range: bytes 21010-47021/47022
Content-Type | 返回内容的MIME类型 | Content-Type: text/html; charset=utf-8
Date | 原始服务器消息发出的时间 | Date: Tue, 15 Nov 2018 08:22:22 GMT
ETag | 请求变量的实体标签的当前值 | ETag: "737060cd8c284d8af7ad3082f209582d"
Expires | 响应过期的日期和时间 | Expires: Thu, 01 Dec 2018 16:00:00 GMT
Last-Modified | 请求资源的最后修改时间 | Last-Modified: Tue, 15 Nov 2018 12:25:26 GMT
Location | 用来重定向接收方到非请求URL的位置来完成请求或标识新的资源 | Location: http://www.yanggb.com/yanggb2.html
Pragma | 包括实现特定的指令，它可应用到响应链上的任何接收方 | Pragma: no-cache
Proxy-Authenticate | 它指出认证方案和可应用到代理的该URL上的参数 | Proxy-Authenticate: Basic
refresh | 应用于重定向或一个新的资源被创造，在5秒之后重定向（由网景提出，被大部分浏览器支持） | Refresh: 5; url=http://www.yanggb.com/yanggb9.html
Retry-After | 如果实体暂时不可取，通知客户端在指定时间之后再次尝试 | Retry-After: 120
Server | web服务器软件名称 | Server: Apache/1.3.27 (Unix) (Red-Hat/Linux)
Set-Cookie | 设置Http Cookie | Set-Cookie: UserID=JohnDoe; Max-Age=3600; Version=1
Trailer | 指出头域在分块传输编码的尾部存在 | Trailer: Max-Forwards
Transfer-Encoding | 文件传输编码 | Transfer-Encoding:chunked
Vary | 告诉下游代理是使用缓存响应还是从原始服务器请求 | Vary: *
Via | 告知代理客户端响应是通过哪里发送的 | Via: 1.0 fred, 1.1 nowhere.com (Apache/1.1)
Warning | 警告实体可能存在的问题 | Warning: 199 Miscellaneous warning
WWW-Authenticate | 表明客户端请求实体应该使用的授权方案 | WWW-Authenticate: Basic

### 传送门
[互联网媒体类型](https://zh.wikipedia.org/wiki/互联网媒体类型)







