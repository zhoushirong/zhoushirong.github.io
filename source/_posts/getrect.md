---
title: getBoundingClientReact方法
date: 2018/03/20
tag: js
category: 技术
---


##### getBoundingClientRect方法兼容IE7写法

```javascript
rectObject = object.getBoundingClientRect(); // 返回元素的大小及其相对于视口的位置
```

ie7中的getBoundingClientRect方法只有bottom、left、right、top属性，没有width合height

![图片](http://zhoushirong.github.io/img/rect.png)

通过上图可以看出：
除了width和height，其它几个属性都是相对于视口的左上角而言的。

根据left、right的值可以推算出width

根据top、bottom的值可以推算出height

完整的代码如下：
```javascript
/**
 * getBoundingClientRect 兼容IE7
 * @param {DOM Object} obj 
 */
function getBoundingClientRect(obj) {
    var boundingClientRect = obj.getBoundingClientRect();
    var newObj = {
        bottom: boundingClientRect.bottom,
        left: boundingClientRect.left,
        right: boundingClientRect.right,
        top: boundingClientRect.top
    }

	if (boundingClientRect.width) {
		newObj.width = boundingClientRect.width;
		newObj.height = boundingClientRect.height;
	} else {
		newObj.width = boundingClientRect.right - boundingClientRect.left;
		newObj.height = boundingClientRect.bottom - boundingClientRect.top;
    }
	return newObj;
}
```



### 参考链接

https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect