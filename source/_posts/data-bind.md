---
title: 响应式
date: 2021/01/11
tag: [proxy,响应式]
category: 技术
---

当前实现
#### proxy 对比 Object.defineProperty
Object.defineProperty 数据劫持只是对对象的属性进行劫持，无法监听新增属性和删除属性
```html
深层对象的劫持需要一次性递归，性能不好
劫持数组时需要重写覆盖部分 Array.prototype 原生方法
```
补充：
其实在Object.defineProperty 本身是可用劫持数组的，本质上和劫持对象属性一样，只不过数组的属性是数组下标。
对象属性的新增需要重新劫持，所以，对于已经被劫持的数组，push的时候也需要进行重新添加劫持。
Vue 的实现中，从性能/体验的性价比考虑，放弃了这个特性。

proxy 数据劫持真正的对对象本身进行劫持，不好做polyfill
```html
可以监听到对象新增、删除属性
只在 getter 时才对对象的下一层进行劫持(优化了性能)
能正确监听原生数组方法
```

#### proxy 优势
1.支持13种拦截操作，这是defineProperty不具备的
```html
get(target, propKey, receiver)：拦截对象属性的读取，比如 proxy.foo 和 proxy['foo']。
set(target, propKey, value, receiver)：拦截对象属性的设置，比如 proxy.foo = v 或 proxy['foo'] = v ，返回一个布尔值。
has(target, propKey)：拦截 propKey in proxy 的操作，返回一个布尔值。
deleteProperty(target, propKey)：拦截 delete proxy[propKey] 的操作，返回一个布尔值。
ownKeys(target)：拦截 Object.getOwnPropertyNames(proxy) 、 Object.getOwnPropertySymbols(proxy) 、Object.keys(proxy) 、for...in 循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而 Object.keys() 的返回结果仅包括目标对象自身的可遍历属性。
getOwnPropertyDescriptor(target, propKey)：拦截 Object.getOwnPropertyDescriptor(proxy, propKey) ，返回属性的描述对象。
defineProperty(target, propKey, propDesc)：拦截 Object.defineProperty(proxy, propKey, propDesc） 、Object.defineProperties(proxy, propDescs) ，返回一个布尔值。
preventExtensions(target)：拦截 Object.preventExtensions(proxy) ，返回一个布尔值。
getPrototypeOf(target)：拦截 Object.getPrototypeOf(proxy) ，返回一个对象。
isExtensible(target)：拦截 Object.isExtensible(proxy) ，返回一个布尔值。
setPrototypeOf(target, proto)：拦截 Object.setPrototypeOf(proxy, proto) ，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如 proxy(...args)、proxy.call(object, ...args) 、proxy.apply(...) 。
construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如 new proxy(...args) 。
```
2.作为新标准，长远来看，JS引擎会继续优化 Proxy ，但 getter 和 setter 基本不会再有针对性优化。


### 传送门
[Vue2.0响应式原理](https://github.com/answershuto/learnVue/blob/master/docs/响应式原理.MarkDownMarkDown)

[Vue2.0 defineProperty正名](https://www.huaweicloud.com/articles/2474b1a4d8d3904e213cac1085726dda.html)