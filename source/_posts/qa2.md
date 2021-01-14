---
title: js的简单排序算法
date: 2020/09/31
tag: [基础,冒泡算法,选择算法,快速算法,插入算法,算法]
category: 技术
---

1.冒泡排序如何实现，时间复杂度是多少，如何改进
```javascript
var arr = [1,8,4,5,7,9,6,2,3]
function swap(arr, i, j) {
  var temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}
function bubbleSort1(arr) { // O(n^2
  for (var i = 0; i < arr.length - 1; i++) {
    var flag = true
    for (var j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j+1]) {
        swap(arr, j, j+1)
        flag = false
      }
    }
    if (flag) {
      break
    }
  }
  return arr
}
function bubbleSort2(arr) {
  var endPos = arr.length - 1
  while(endPos > 0) {
    var thisTurnEndPos = endPos
    for (var i = 0; i < thisTurnEndPos; i++) {
      if (arr[i] > arr[i+1]) {
        swap(arr, i, i+1)
        endPos = i // 记录本次循环最后交换的位置
      }
    }
    if (thisTurnEndPos === endPos) { // 如果最后交换的位置不变则说明整体有序，排序完成
      return arr
    }
  }
  return arr
}

function bubbleSort3(arr) {
  var start = 0
  var end = arr.length - 1
  var startPos = start
  var endPos = end
  while (start < end) {
    var isSorted = true
    for (var i = start; i < end; i++) {
      if (arr[i] > arr[i+1]) {
        swap(arr, i, i+1)
        endPos = i
        isSorted = false
      }
    }
    if (isSorted) return arr
    end = endPos

    for (var j = end; j > start; j--) {
      if (arr[j] < arr[j-1]) {
        swap(arr, j, j-1)
        startPos = j
        isSorted = false
      }
    }
    if (isSorted) return arr
    start = startPos
  }
  return arr
}
var s0 = Date.now()
bubbleSort1([].concat(arr))
var s1 = Date.now()
bubbleSort2([].concat(arr))
var s2 = Date.now()
bubbleSort3([].concat(arr))
var s3 = Date.now()
console.log(s1-s0, s2-s1, s3-s2)
```
冒泡排序平均时间复杂度是O(n\*n)，最好的情况是O(n)、最差的情况是O(n\*n)
空间复杂度是O(1)
特点：外层for循环控制循环次数、内层for循环进行两数交换，找出最大的数放到最后
改进：
1）处理在排序过程中数组整体已经有序的情况，设置标志位
2）数组局部有序，遍历过程中记录最后一次交换的位置，设置为下一次交换的终点
3）同时将最大最小值归位，双向冒泡排序


2.实现一个快速排序算法
```javascript
/**
 * 快速排序
 * 1.选择一个基准
 * 2.遍历，小于基准放左边，大于基准放右边
 * 3.递归
 * @param arr 
 */
function quickSort(arr) {
  if (arr.length <= 1) return arr
  var pivotIndex = Math.floor(arr.length / 2)
  var pivot = arr.splice(pivotIndex, 1)
  var left = []
  var right = []
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left).concat(pivot).concat(quickSort(right))
}

var arr = [1, 8, 4, 5, 7, 9, 6, 2, 3]
quickSort(arr)
```
3.实现插入排序算法
1）循环数组，每次取一个数，判断是否比已排序数最大的大
2）如果大则放在后面，如果小则继续比较，如果最小则放在最前面

```javascript
/**
 * 插入排序1
 */
function insertSort(arr) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = i - 1; j >= 0; j--) {
      if (arr[i] >= arr[j]) {
        arr.splice(j + 1, 0, arr.splice(i, 1)[0])
        break
      } else if (j === 0) {
        arr.splice(j, 0, arr.splice(i, 1)[0])
      }
    }
  }
  return arr
}
/**
 * 插入排序2
 */
function insertSort(arr) {
  if (arr.length <= 1) return arr
  var newArr = arr.splice(0, 1)
  for (var i = 0; i < arr.length; i++) {
    for (var j = newArr.length - 1; j >= 0; j--) {
      if (arr[i] >= newArr[j]) {
        newArr.splice(j + 1, 0, arr[i])
        break
      } else if (j === 0) {
        newArr.unshift(arr[i])
      }
    }
  }
  return newArr
}

var arr = [1, 8, 4, 5, 7, 9, 6, 2, 3]
insertSort(arr)
```

4.实现选择排序算法
每次循环选取一个最小的数字放到前面的有序序列中

```javascript
function swap(arr, i, j) {
  var temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}
function selectSort(arr) {
  for (var i = 0; i < arr.length; i++) {
    var minIndex = i
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    swap(arr, i, minIndex)
  }
  return arr
}

var arr = [1, 8, 4, 5, 7, 9, 6, 2, 3]
selectSort(arr)
```
