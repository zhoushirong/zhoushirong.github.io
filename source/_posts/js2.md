---
title: Javascript基本方法
date: 2018/01/15
tag: js
category: 技术
---

Javascript的基础知识。

ECMAScript有几个常见的基本方法一直没怎么搞清楚，

### 一、容易混淆的几个方法：split、slice、splice


### split()

split()方法用于将一个字符串分割成字符串数组
```javascript
var str = 'abcdefg';
var strArr = str.split('');
console.log(strArr); // ["a", "b", "c", "d", "e", "f", "g"]
```

### slice()

slice()方法用于返回从数组中返回的元素，不会改变原数组
```javascript
var arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
arr.slice(0, 1); // ['a']
arr.slice(2, 5); // ['c', 'd', 'e']
arr.slice(0); // 相当于深度拷贝数组
var str = 'abcdefg'; //也可以用于字符串
str.slice(2,5); // 'cde'
```

### splice()

splice() 用于对数组，删除添加和替换，会改变元素组
```javascript
var arr = ['a', 'b', 'c', 'd', 'e'];
arr.splice(2, 5); // ['c', 'd', 'e']
```


### replace()正则

```javascript
text = text.replace(/<wiki>(.+?)<\/wiki>/g, function(match, contents, offset, input_string)
    {
        return "<a href='wiki/"+contents.replace(/ /g, '_')+"'>"+contents+"</a>";
    }
);
```







