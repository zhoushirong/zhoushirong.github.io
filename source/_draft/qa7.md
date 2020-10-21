---
title: 前端基础六
date: 2020/10/16
tag: [基础,面试,试题]
category: 技术
---



.如何设计无缝轮播
```javascript

```

.实现模糊搜索结果的关键词高亮显示 （28）

.实现convert方法，把原始list转换成树形结构，要求尽可能降低时间复杂度
以下数据结构中，id代表部门编号，name是部门名称，parentId是父部门编号，为0代表一级部门，现在要求实现一个convert方法，把原始list转换成树形结构，parantId为多少就挂载在该id的属性children数组下
```javascript
let list = [
  {id: 1, name: '部门A', parentId: 0 },
  {id: 2, name: '部门B', parentId: 0 },
  {id: 3, name: '部门C', parentId: 1 },
  {id: 4, name: '部门D', parentId: 1 },
  {id: 5, name: '部门E', parentId: 2 },
  {id: 6, name: '部门F', parentId: 3 },
  {id: 7, name: '部门G', parentId: 2 },
  {id: 8, name: '部门H', parentId: 4 },
]
function convert(list) {
  var result = []

}


let result = convert(list)
result = [
  {
    id: 1,
    name: '部门A',
    parentId: 0,
    children: [
      {
        id: 3,
        name: '部门3',
        parentId: 1,
        children: [
          {
            id: 6,
            name: '部门6',
            parentId: 3,
          },
          {
            id: 6,
            name: '部门6',
            parentId: 3,
          }
        ]
      }
    ]
  }
  // ...
]
```
