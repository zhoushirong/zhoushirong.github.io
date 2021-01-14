---
title: 关于js的二叉树
date: 2020/10/13
tag: [基础,二叉树,算法]
category: 技术
---

1.将二叉树的顺序存储数组转换为链表结构
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

2.给定一个二叉树，找出其最大深度。
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
  getTreeLeft(root.left, stack)
  getTreeLeft(root.right, stack)
  return stack
}

/**
 * 中序遍历
 */
function getTreeCenter(root, stack = []) {
  if (root.value === undefined) return stack
  getTreeCenter(root.left, stack)
  stack.push(root.value)
  getTreeCenter(root.right, stack)
  return stack
}

/**
 * 后序遍历
 */
function getTreeRight(root, stack = []) {
  if (root.value === undefined) return stack
  getTreeRight(root.right, stack)
  stack.push(root.value)
  getTreeRight(root.left, stack)
  return stack
}

getTreeLeft(root)
```

3.获取二叉树的所有叶子节点的路径
```javascript
function findAllPath(root) {
  var paths = []
  var genPath = (root, path) => {
    if (!root.value) return path

    path += '>' + root.value
    if (root.left === undefined && root.right === undefined) {
      paths.push(path)
    } else {
      genPath(root.left, path)
      genPath(root.right, path)
    }
  }
  genPath(root, '')
  return paths
}
```