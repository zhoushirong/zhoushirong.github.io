---
title: weakSet与js内存回收
date: 2021/02/24
tag: [set,weakSet]
category: 笔记
---

#### Map与WeakMap简单区别
```html
Map的键值可以是原始数据类型和引用类型，WeakMap的键值只能说引用类型（object）
Map可以迭代遍历键，WeakMap不可迭代遍历键
```
#### Map 与 WeakMap 使用内存情况
1.WeakMap 内存占用
```javascript
// index.js
// 第一次手动清理垃圾以确保为最新状态，观察内存情况
global.gc()
console.log(`第一次垃圾回收，当前内存使用情况：${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`)
const wm = new WeakMap()

let key = {}
// 给 WeakMap实例 赋值一个 占领内存足够大的 键值对
wm.set(key, new Array(114514 * 19))
// 手动清理一下垃圾 观察内存占用情况
global.gc()
console.log(`第二次垃圾回收，当前内存使用情况：${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`)

// 此时把 key键 的引用进行断开，并观察内存占用情况
key = null
// key = new Array()  
// 这种改变引用地址写法也可以引起 弱映射，因为引用地址不再是同块内存地址 WeakMap内对应的value也会被垃圾回收

global.gc()
console.log(`第三次垃圾回收，当前内存使用情况：${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`)
// $ node --expose-gc index.js
// 第一次垃圾回收，当前内存使用情况：1.76MB
// 第二次垃圾回收，当前内存使用情况：18.54MB
// 第三次垃圾回收，当前内存使用情况：1.94MB
```
2.Map 内存占用
同上，只不过是将
```javascript
const wm = new WeakMap();
```
替换为
```javascript
const wm = new Map();
```
结果为
```javascript
// 第一次垃圾回收，当前内存使用情况：1.77MB
// 第二次垃圾回收，当前内存使用情况：18.54MB
// 第三次垃圾回收，当前内存使用情况：18.54MB
```
比较1、2例子可以发现，当引用类型key的值指向为空的时候，使用WeakMap的时候会立即释放内存
当使用Map的时候不会立即释放内存。

当然，如果在 2例子里面起一个定时器，每隔100ms定时打印内存情况，会发现，即使使用Map，过一段时间内存也会被释放掉
这是因为 javascript 引擎做了优化，会定期清理内存。
```javascript
setInterval(() => {
  console.log(`第N次垃圾回收，当前内存使用情况：${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`);
}, 100)

// 结果
// 第一次垃圾回收，当前内存使用情况：1.77MB
// 第二次垃圾回收，当前内存使用情况：18.54MB
// 第三次垃圾回收，当前内存使用情况：18.54MB
// 第N次垃圾回收，当前内存使用情况：18.55MB
// ...
// 第N次垃圾回收，当前内存使用情况：2.00MB
// 第N次垃圾回收，当前内存使用情况：2.01MB
```

---

虽然，javascript引擎会自动优化内存，但是作为开发者还是应该适当关注一下内存的使用情况，以防止极端的情况内存释放不及时。
```javascript
// index.js
// 第一次手动清理垃圾以确保为最新状态，观察内存情况
global.gc();
console.log(
  `第一次垃圾回收，当前内存使用情况：${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`
);
const m = new Map();

let key = {};
m.set(key, new Array(114514 * 19));
// 手动清理一下垃圾 观察内存占用情况
global.gc();
console.log(
  `第二次垃圾回收，当前内存使用情况：${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB，
  当前Map的长度: ${m.size}`
);

// 此时把 key键 的引用进行断开，并观察内存占用情况
key = null;
global.gc();
console.log(
  `第三次垃圾回收，当前内存使用情况：${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB，
  当前Map的长度: ${m.size}`
);

// 清除Map所有键值对
m.clear();

global.gc();
console.log(
  `第四次垃圾回收，当前内存使用情况：${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB，
  当前Map的长度: ${m.size}`
);
// $ node --expose-gc index.js
// 第一次垃圾回收，当前内存使用情况：1.76MB
// 第二次垃圾回收，当前内存使用情况：18.54MB，
//   当前Map的长度: 1
// 第三次垃圾回收，当前内存使用情况：18.54MB，
//   当前Map的长度: 1
// 第四次垃圾回收，当前内存使用情况：1.94MB，
//   当前Map的长度: 0
```

### 附录
使用 node 命令执行js的时候加入 --expose-gc参数的作用
```html
--expose-gc 参数表示允许手动执行垃圾回收机制
```





### 传送门


[WeakSet 用法解惑](https://zhuanlan.zhihu.com/p/54889129)

[通过垃圾回收机制来了解Map与WeakMap](https://mp.weixin.qq.com/s/reCQIfaLM3rTsvKJwovIHQ)

