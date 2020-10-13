---
title: 前端基础三
date: 2020/10/13
tag: [基础,面试,试题]
category: 技术
---

1.对象深度优先遍历和广度优先遍历的实现
如图：
<img src="http://zhoushirong.github.io/img/map.png" alt="ssh-l图片" width="630" height="215">

```javascript
const obj = {
  a1: {
    a1b1: 1,
    a1b2: 2
  },
  a2: {
    a2b1: 3,
    a2b2: 4,
    a2b3: 5
  }
}
// 深度优先遍历
const depthArr = []
function depthFirst(obj) {
  for (let i in obj) {
    depthArr.push(i)
    if (Object.prototype.toString.call(obj[i]) === '[object Object]') {
      depthFirst(obj[i])
    }
  }
  return depthArr
}

// 广度优先遍历
const breadthArr = []
function breadthFirst(obj) {
  const arr = Object.keys(obj)
  breadthArr = breadthArr.concat(arr)
  arr.forEach(i => {
    if (Object.prototype.toString.call(obj[i]) === '[object Object]') {
      breadthFirst(obj[i])
    }
  })
}

depthFirst(obj) // ['a1', 'a1b1', 'a1b2', 'a2', 'a2b1', 'a2b2', 'a2b3']
breadthFirst(obj) // ['a1', 'a2', 'a1b1', 'a1b2', 'a2b1', 'a2b2', 'a2b3']
console.log(depthArr, breadthArr)
```

2.用深度优先思想实现一个深拷贝函数
深度拷贝最主要需要考虑的因素就是需要考虑js的各种数据类型
1）6种基本类型(number,string,null,undefined,boolean,symbol)不需要处理，直接复制返回即可
2）几种特殊类型 date、regexp、set、map，直接new一遍即可
3）需要着重处理的类型 Array、Object，直接使用递归处理即可
4）递归处理Array、Object的过程中需要考虑循环引用，循环引用处理可以利用WeakMap将每次递归的对象存储起来，如果一样，直接返回

```javascript
const obj = {
  a1: {
    a1b1: 1,
    a1b2: 2
  },
  a2: {
    a2b1: 3,
    a2b2: 4,
    a2b3: 5
  },
  fn1: function() {
    console.log('fn1')
  },
  symbolData: Symbol('symbolData'),
  booleanData: false,
  date: new Date(),
  nullData: null,
  arrData: [1, 2, 3, { arr1: { a:1, b: 2 }, arr2: [] }],
  numberData: 1,
  strData: 'abc',
  regexData: new RegExp('abcdefg'),
  setData: new Set(),
  mapData: new Map(),
}
obj.obj = obj // 循环引用

function isType(target, type) {
  if (!type) {
    return Object.prototype.toString.call(target).slice(8, -1)
  }
  return Object.prototype.toString.call(target) === `[object ${type}]`
}
function depthFirstClone(obj, hash = new WeakMap()) {
  const oType = isType(obj)
  if (oType !== 'Object' && oType !== 'Array') return obj
  if (hash.has(obj)) return hash.get(obj)

  const newObj = oType === 'Array' ? [] : {}
  hash.set(obj, newObj)

  for (let i in obj) {
    if (
      typeof obj[i] === 'string' ||
      typeof obj[i] === 'number' ||
      typeof obj[i] === 'boolean' ||
      typeof obj[i] === 'symbol' ||
      obj[i] === undefined ||
      obj[i] === null
    ) {
      newObj[i] = obj[i]
      continue
    }
    if (isType(obj[i], 'Function')) {
      newObj[i] = obj[i]
      continue
    }
    if (isType(obj[i], 'Set')) {
      newObj[i] = new Set(obj[i])
      continue
    }
    if (isType(obj[i], 'Map')) {
      newObj[i] = new Map(obj[i])
      continue
    }
    if (isType(obj[i], 'Date')) {
      newObj[i] = new Date(obj[i])
      continue
    }
    if (isType(obj[i], 'RegExp')) {
      newObj[i] = new RegExp(obj[i])
      continue
    }
    if (isType(obj[i], 'Array') || isType(obj[i], 'Object')) {
      newObj[i] = depthFirstClone(obj[i], hash)
      continue
    }
  }
  return newObj
}
let cloneObj = depthFirstClone(obj)
```