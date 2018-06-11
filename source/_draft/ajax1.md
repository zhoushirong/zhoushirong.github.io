---
title: 使用postman的post方式提交数据
date: 2018/04/24
tag: ajax post postman form-data x-www-form-urlencoded raw binary
---

ajax提交数据很常见
服务端获取post请求的时候是根据请求头中的content-type的值来获取消息主体(body)的编码方式，进而进行数据解析

值 | 描述
--|--
application/x-www-form-urlencoded | 在发送前编码所有字符（默认）
multipart/form-data | 不对字符编码，在使用包含文件上传控件的表单时，必须使用该值。
text/plain | 纯文本，空格转换为 "+" 加号，但不对特殊字符编码




使用postman的post方式提交数据的时候可以指定四种body类型。分别是form-data、x-www-form-urlencoded、raw、binary。
这是将发送信息至服务器时内容的编码类型。服务端根据这些类型来判断使用哪种方式解析数据。

#### form-data
它将表单的数据组织成Key-Value形式，用分隔符boundary（boundary可任意设置）处理成一条消息。
由于有boundary隔离，所以既可以上传文件，也可以上传参数。 

指定form-data的时候其post效果和form表单中指定enctype为'multipart/form-data'一样：
```html
<form action='xxx' method='post' enctype='multipart/form-data'>
  <input type='text' name='user_name' value='user_name_str'/>
  <input type='file' name='file_name' />
  <button type='submit'>提交</button>
</form>
```

当然，除了form表单，使用ajax同样能够达到同样的效果，以jquery的ajax为例：
```javascript
$.ajax({
  url: 'xxx',
  type: 'POST',
  contentType: 'multipart/form-data', // jquery ajax默认为x-www-form-urllencoded
  success: function() {}
})
```

#### x-www-form-urlencoded
content-type: application/x-www-form-urlencoded
原生的form表单提交方式。jQuery中的post也是这种方式提交的。

form表单的实现方式，指定enctype或者不指定（默认为）
```html
<form action='xxx' method='post' enctype='application/x-www-form-urlencoded'>
  <input type='text' name='user_name' value='user_name_str'/>
  <input type='file' name='file_name' />
  <button type='submit'>提交</button>
</form>
```
```javascript
$.ajax({
  url: 'xxx',
  type: 'POST',
  contentType: 'application/x-www-form-urlencoded', // jquery ajax默认为x-www-form-urllencoded
  success: function() {}
})
```

#### raw
content-type: application/json
content-type: application/xml
content-type: text/xml
content-type: text/plain

ps: application/xml 和 text/xml两种类型，二者功能一模一样，唯一的区别就是编码格式，text/xml忽略xml头所指定编码格式而默认采用us-ascii编码，而application/xml会根据xml头指定的编码格式来编码

可以上传任意格式的【文本】，可以上传text、json、xml、html等

#### binary
content-type: application/octet-stream

只可以上传二进制数据，通常用来上传文件。由于没有键值，所以一次只能上传一个文件。










