---
title: weakSe与js内存回收
date: 2021/01/25
tag: [set,weakSet]
category: 笔记
---

```javascript
let set = new Set()
let key = { a: 1 }
set.add(key)
console.log(key) // {a: 1}
console.log(set.size) // 1
console.log(set) // Set(1) {{…}}

key = null // 移除原始引用
console.log(key) // null
console.log(set) // Set(1) {{…}}
```

```javascript
let set = new WeakSet()
let key = { a: 1 }
set.add(key)
console.log(key) // {a: 1}
console.log(set) // WeakSet {{…}}

key = null // 移除原始引用
console.log(key) // null
console.log(set) // WeakSet {{…}}
```


假如在一个模块内部，我既控制了对象的生命周期，而又需要这个集合进行判断，那么的确，这个 WeakSet 确实没有必要。但是假如需要这个集合进行判断的一方并不想控制这个对象的生命周期，那么 WeakSet 倒显得有些必要了。

WeakSet 对象中储存的对象值都是被弱引用的，即垃圾回收机制不考虑 WeakSet 对该对象的引用，如果没有其他的变量或属性引用这个对象值，则这个对象将会被垃圾回收掉（不考虑该对象还存在于 WeakSet 中），所以，WeakSet 对象里有多少个成员元素，取决于垃圾回收机制有没有运行，运行前后成员个数可能不一致，遍历结束之后，有的成员可能取不到了（被垃圾回收了），WeakSet 对象是无法被遍历的（ES6 规定 WeakSet 不可遍历），也没有办法拿到它包含的所有元素

https://zhuanlan.zhihu.com/p/54889129

https://www.jianshu.com/p/c99dd69a8f2c