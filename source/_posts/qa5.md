---
title: 前端基础五
date: 2020/10/15
tag: [基础,面试,试题]
category: 技术
---

1.打印出1-10000之间的所有对称数，例如：121、1331等
```javascript
// answer1
function printNum(min, max) { // 1,2,3,4,5,6,7,8,9,11,22,33,44,55,66,77,88,99,101,111,121,131,...,9999
  for ( var i = min; i <= max; i++) {
    var stri = i.toString()
    if (stri.length % 2 === 0) { // 偶数
      var halfStri1 = stri.slice(0, stri.length / 2)
      var halfStri2 = stri.slice(stri.length / 2).split('').reverse().join('')
      if (halfStri1 === halfStri2) {
        console.log(i)
      }
    } else { // 奇数
      var c = Math.floor(stri.length / 2)
      var halfStri1 = stri.slice(0, c)
      var halfStri2 = stri.slice(c+1).split('').reverse().join('')
      if (halfStri1 === halfStri2) {
        console.log(i)
      }
    }
  }
}
// answer2
function printNum(min, max) {
  for (var i = min; i <= max; i++) {
    var stri = i.toString()
    var reverseI = stri.split('').reverse().join('')
    if (stri === reverseI) {
      console.log(i)
    }
  }
}
// answer3
function printNum(min, max) {
  for (var i = 1; i < 10 ; i++) {
    console.log(i) // 1, ..., 9
    console.log(i * 11) // 11, 22, 33, ..., 99
    for (var j = 0; j < 10; j++) {
      console.log(i * 101 + j * 10) // 101, 111, ..., 191, 202, 212, ... ,999
      console.log(i * 1001 + j * 110) // 1001, 1111, ..., 9999
    }
  }
}

printNum(1, 100000)
```

2.算法题【移动零】，给定一个数组nums，编写一个函数将所有0移动到数组的末尾，同时保持非零元素的相对顺序
输入：[0, 1, 0, 3, 12]
输出：[1, 3, 12, 0, 0]
补充：必须在原数组上操作，不能拷贝额外的数组
```javascript
// answer1
function dealArr(arr) {
  var j = 0
  for (var i = j; i < arr.length - j; i++) {
    if (arr[i] === 0) {
      arr.splice(i, 1)
      arr.push(0)
      j++
      i--
    }
  }
  return arr
}

console.log(dealArr([0, 1, 0, 3, 12]))
```

3.请实现一个add函数，满足以下功能
```javascript
add(1) // 1
add(1)(2) // 3
add(1)(2)(3) // 6
add(1)(2, 3) // 6
add(1, 2)(3) // 6
```
```javascript
function add() {
  let args = [...arguments]
  let fn = function() {
    args = args.concat([...arguments])
    return fn
  }
  fn.toString = () => args.reduce((acc, item) => acc + item)
  return fn
}
add(1,2)(3)(4, 5)
```

4.算法题之【两数之和】
给定一个整数数组和一个目标值，找出数组中和为目标值的两个数。
你可以假设每个输入值对应一种答案，且相同的元素不能重复利用。
示例：
```html
给定 nums = [2, 7, 11, 5], target = 9
因为 nums[0] + nums[1] = 2 + 7 = 9
所以返回 [0, 1]
```
```javascript
// answer1
function calc1(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j]
      }
    }
  }
}
// answer2
function calc2(nums, target) {
  let map = {}
  for (let [i, n] of nums.entries()) {
    map[n] = i
  }
  for (let i = 0; i < nums.length; i++) {
    let k = target - nums[i]
    if (map[k]) {
      return [i, map[k]]
    }
  }
}

var nums = [2, 7, 11, 5]
var target = 9
calc2(nums, target)
```

5.在输入框中如何判断输入的是一个正确的网址
```javascript
var url = 'https://www.abc.com'
function checkUrl(url) {
  try {
    return new URL(url)
  } catch(e) {
    return false
  }
}
checkUrl(url)
```
6.实现一个快速排序算法
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
7.实现插入排序算法
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

8.实现选择排序算法
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

9.使用Javascript Proxy实现简单的数据绑定 
```html
<input id="inputField" value="" type="text" placeholder="" />
<p id="showField"></p>
```
```javascript
const proxy1 = {
  get(target, propKey) {
    console.log(`getting:${propKey}`)
    return Reflect.get(target, propKey)
  },
  set(target, propKey, value) {
    console.log(`setting:${propKey}、${value}`)
    handler(value)
    return Reflect.set(target, propKey, value)
  }
}

function handler(value) {
  document.querySelector('#showField').innerHTML = value
}

var obj = new Proxy({}, proxy1)
document.querySelector('#inputField').addEventListener('input', (e) => {
  obj.txt = e.target.value
})
```
[demo](https://www.epoos.com/demo/vue/proxy.html)

