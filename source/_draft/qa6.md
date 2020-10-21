---
title: 前端基础六
date: 2020/10/19
tag: [基础,面试,试题]
category: 技术
---

1.合并两个有序数组
给你两个有序整数数组 nums1和nums2，请你将nums2合并到nums1，使nums1成为一个有序数组
说明：
初始化nums1和nums2的元素数量分别为m，n，你可以假设nums1有足够的空间（空间大小大于等于m+n）来保存nums2的元素
```javascript
// 输入：
var nums1 = [1, 2, 3, 0, 0, 0], m = 3
var nums2 = [2, 5, 6], n = 3

function deal(nums1, m, nums2, n) {
  nums1.splice(m, n, ...nums2)
  nums1.sort((a, b) => a - b)
  return nums1
}
deal(nums1, m, nums2, n) // [1, 2, 2, 3, 5, 6]
```


2.已知如下数组：var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10]
编写一个程序将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组
```javascript

function deal1(arr) {
  return Array.from(new Set(arr.toString().replace(/\[|\]/g, '').split(','))).map(item => +item).sort((a, b) => a - b)
}
function _flat(arr) {
  return arr.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? _flat(item) : item)
  }, [])
}
function deal(arr) {
  return Array.from(new Set(_flat(arr))).sort((a, b) => a - b)
}
var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10]
deal(arr)
```

3.给定一个二叉树，找出其最大深度。
二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。
说明: 叶子节点是指没有子节点的节点。
示例：给定二叉树 [3,9,20,null,null,15,7]
最大深度是 3
```javascript
var arr = [3,9,20,null,null,15,7]
function genRoot(arr) {
  let root = {}
  
}
function maxDepth(root) {
  if (root) 0
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right))
}
```

