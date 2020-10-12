---
title: 前端基础二
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

