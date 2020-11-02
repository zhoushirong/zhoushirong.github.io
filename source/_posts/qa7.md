---
title: 前端基础七
date: 2020/10/20
tag: [基础,面试,试题]
category: 技术
---

1.实现convert方法，把原始list转换成树形结构，要求尽可能降低时间复杂度
以下数据结构中，id代表部门编号，name是部门名称，parentId是父部门编号，为0代表一级部门，现在要求实现一个convert方法，把原始list转换成树形结构，parantId为多少就挂载在该id的属性children数组下
```javascript
let list = [
  { id: 1, name: '部门A', parentId: 0 },
  { id: 2, name: '部门B', parentId: 0 },
  { id: 3, name: '部门C', parentId: 1 },
  { id: 4, name: '部门D', parentId: 1 },
  { id: 5, name: '部门E', parentId: 2 },
  { id: 6, name: '部门F', parentId: 3 },
  { id: 7, name: '部门G', parentId: 2 },
  { id: 8, name: '部门H', parentId: 4 },
  // ...
]
function convert(list) {
  const res = []
  const map = {}
  list.forEach(item => map[item.id] = item)
  list.forEach(item => {
    if (item.parentId === 0) return res.push(item)
    const parent = map[item.parentId]
    if (parent.children) {
      parent.children.push(item)
    } else {
      parent.children = [item]
    }
  })
  return res
}

let result = convert(list)
result = [{
  id: 1,
  name: '部门A',
  parentId: 0,
  children: [{
    id: 3,
    name: '部门3',
    parentId: 1,
    children: [{
      id: 6,
      name: '部门6',
      parentId: 3,
    }]
  }]
}, /* ... */]
```

2.将entry转换为output、将output转换为entry：
```javascript
var entry = {
  'a.b.c.dd': 'abcdd',
  'a.d.xx': 'adxx',
  'a.e': 'ae',
}
// =>
var output = {
  a: {
    b: {
      c: {
        dd: 'abcdd'
      }
    },
    d: {
      xx: 'adxx'
    },
    e: 'ae'
  }
}
```

```javascript
// entry => output
function gen(obj = {}, str, val) {
  str.split('.').reduce((acc, i, idx, source) => {
    if (!acc[i]) {
      acc[i] = idx === source.length - 1 ? val : {}
    }
    return acc[i]
  }, obj)
  return obj
}
function generater(obj) {
  const newObj = {}
  for (let i in obj) {
    gen(newObj, i, obj[i])
  }
  return newObj
}
generater(entry)
```

```javascript
// output => entry answer1
const isObj = val => Object.prototype.toString.call(val) === '[object Object]'
function fn(obj = {}, key, newObj = {}) {
  for (let i in obj) {
    const nkey = key ? key + '.' + i : i
    if (isObj(obj[i])) {
      fn(obj[i], nkey, newObj)
    } else {
      newObj[nkey] = obj[i]
    }
  }
  return newObj
}
// output => entry answer2
function fn(obj = {}) {
  const queue = Object.entries(obj)
  const res = {}
  while(queue.length) {
    const [key, obj] = queue.pop()
    for (const [k, v] of Object.entries(obj)) {
      if (!isObj(v)) {
        res[`${key}.${k}`] = v
      } else {
        queue.push([`${key}.${k}`, v])
      }
    }
  }
  return res
}
```