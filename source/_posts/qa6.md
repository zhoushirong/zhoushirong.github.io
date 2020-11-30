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

3.将二叉树的顺序存储数组转换为链表结构
```javascript
// 输入
var arr = [3, 9, 20, null, null, 15, 7]

/**
 * 仅适用于完全二叉树
 */
function toBeLink1(arr, x, obj) {
  obj = obj || {}
  x = x || 0
  obj.value = arr[x]
  var lIndex = 2 * x + 1 // 左侧子节点序是父节点序列的2倍（下标从0开始，所以未 2*x + 1）
  var rIndex = 2 * x + 2 // 右侧子节点序是父节点序列的2倍+1（下标从0开始，所以未 2*x + 2）
  if (arr[lIndex] === 0 || arr[lIndex]) {
    toBeLink(arr, lIndex, obj.left = {})
  }
  if (arr[rIndex] === 0 || arr[rIndex]) {
    toBeLink(arr, rIndex, obj.right = {})
  }
  return obj
}

/**
* 适用所有二叉树 - 方法1
*/
class TreeNode {
  constructor(value) {
    this.value = value
  }
  insert(values) {
    if (!values.length) return this
    const queue = [this]
    let i = 0
    while (queue.length > 0) {
      const current = queue.shift()
      for (let side of ['left', 'right']) {
        if (!current[side]) {
          if (values[i] !== null) {
            current[side] = new TreeNode(values[i])
          }
          i++
          if (i >= values.length) return this
        }
        if (current[side]) queue.push(current[side])
      }
    }
    return this
  }
}

function toBeLink(arr) {
  if (arr.length === 0) return {}
  const myTree = new TreeNode(arr[0])
  myTree.insert(arr.slice(1))
  return myTree
}

/**
* 适用所有二叉树 - 方法2
*/
function toBeLink(arr, obj = {}, queue = []) {
  if (!arr || arr[0] === null || arr[0] === '' || arr[0] === undefined) return obj
  // 根节点初始化
  obj.value = arr[0]
  queue.push(obj)

  let i = 1
  while(i <= arr.length) {
    const current = queue.shift()
    for (let side of ['left', 'right']) {
      const arri = arr[i]
      i++
      console.log(i, arr.length)
      if (i > arr.length) return obj
      if (arri === null) continue

      current[side] = { value: arri }
      if (arri !== undefined) {
        queue.push(current[side])
      }
    }
  }
}

/**
* 适用所有二叉树 - 方法2 - 纯 es5 版本
*/
function toBeLink(arr) {
  if (arr.length === 0 || arr[0] === null) return {}
  var obj = { value: arr[0] }
  var queue = [obj]
  var i = 1
  var sideArr = ['left', 'right']
  while (i <= arr.length) {
    var current = queue.shift()
    for (var j = 0; j < sideArr.length; j++) {
      var arri = arr[i]
      var side = sideArr[j]
      i++
      if (i > arr.length) return obj
      if (arri === null) continue

      current[side] = { value: arri }
      queue.push(current[side])
    }
  }
}

// 输出
var root = {
  value: 3,
  left: {
    value: 9,
  },
  right: {
    value: 20,
    left: {
      value: 15,
    },
    right: {
      value: 7,
    }
  }
}
```

4.给定一个二叉树，找出其最大深度。
二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。
说明: 叶子节点是指没有子节点的节点。
示例：给定二叉树 [3,9,20,null,null,15,7]
最大深度是 3
```javascript
var maxDepth = function(root) {
  if(!root) return 0 
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right))
}
var root = toBeLink(arr)
maxDepth(root) // 3
```

5.返回二叉树前序遍历(根左右)、中序遍历(左跟右)、后序遍历(左右跟)
```javascript
var arr = [1, null, 2, 3] // return [1, 2, 3]
var root = toBeLink(arr)

/**
 * 前序遍历
 */
function getTreeLeft(root, stack = []) {
  if (root.value === undefined) return stack
  stack.push(root.value)
  getTree(root.left, stack)
  getTree(root.right, stack)
  return stack
}

/**
 * 中序遍历
 */
function getTreeCenter(root, stack = []) {
  if (root.value === undefined) return stack
  getTree(root.left, stack)
  stack.push(root.value)
  getTree(root.right, stack)
  return stack
}

/**
 * 后序遍历
 */
function getTreeRight(root, stack = []) {
  if (root.value === undefined) return stack
  getTree(root.right, stack)
  stack.push(root.value)
  getTree(root.left, stack)
  return stack
}

getTreeLeft(root)
```