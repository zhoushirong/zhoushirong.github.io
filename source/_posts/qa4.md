---
title: 前端基础四
date: 2020/10/14
tag: [基础,面试,试题]
category: 技术
---

1.下面代码中a在什么情况下会打印1
```javascript
var a = ?;
if (a == 1 && a == 2 && a == 3) {
  console.log(1)
}
// answer1
a = console.log(1)
// answer2
var a = { num: 0 }
a.valueOf = () => ++a.num
if (a == 1 && a == 2 && a == 3) {
  console.log(1)
}
// answer3
Object.defineProperty(window, 'a', {
  get() { 
    return this.value = this.value ? ++this.value : 1
  }
})
if (a == 1 && a == 2 && a == 3) {
  console.log(1)
}
```
2.实现一个 sleep 函数，比如 sleep(1000),意味着等等1000毫秒，可从Promise、Generator、Async/Await等角度实现
```javascript
// answer1
function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
}
let start = Date.now()
sleep(3000).then(() => {
  console.log(Date.now() - start)
})
```

3.实现(5).add(3).minus(2)功能
```javascript
Number.prototype.add = function (i = 0) { return this.valueOf() + i }
Number.prototype.minus = function (i = 0) { return this.valueOf() - i }
var result = (5).add(3).minus(2)
console.log(result)
```

4.实现加法运算，解决浮点数问题
```javascript
function digitLength(a, b) {
  var as = a.toString()
  var bs = b.toString()

  var t1 = as.split('.')
  var t2 = bs.split('.')
  var len1 = t1[1] ? t1[1].length : 0
  var len2 = t2[1] ? t2[1].length : 0

  return Math.pow(10, len1 > len2 ? len1 : len2)
}

function add(a = 0, b = 0) {
  var max = digitLength(a, b)
  return (a * max + b * max) / max
}
function minus(a = 0, b = 0) {
  var max = digitLength(a, b)
  return (a * max - b * max) / max
}
function multiply(a = 0, b = 0) {
  var max = digitLength(a, b)
  return ((a * max) * (b * max)) / (max*max)
}
function devide(a = 0, b = 0) {
  var max = digitLength(a, b)
  return (a * max) / (b * max)
}
add(0.1, 0.2) // 0.3
minus(0.3, 0.2) // 0.1
multiply(0.7, 0.2) // 0.14
devide(0.7, 0.2) // 3.5
```

5.冒泡排序如何实现，时间复杂度是多少，如何改进
```javascript
var arr = [1,8,4,5,7,9,6,2,3]
function swap(arr, i, j) {
  var temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}
function bubbleSort1(arr) {
  for (var i = 0; i < arr.length - 1; i++) {
    var flag = true
    for (var j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j+1]) {
        swap(arr, j, j+1)
      }
      flag = false
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


6.某公司1到12月份的销售额存在一个对象里面
如：{1:222, 2:123, 5: 888}, 请把数据处理为如下结构
[222, 123, null, null, 888, null, null, null, null, null, null, null]
```javascript
var data = { 1: 222, 2: 123, 5: 888 }
new Array(12).fill(null).map((i, index) => {
  return data[index + 1] || null
})
```

7.实现一个LazyMan类，实现以下功能
```javascript
LazyMan('Tony') // Hi I am Tony
LazyMan('Tony').sleep(10).eat('lunch') 
// Hi I am Tony 
// 等待10s
// I am eating lunch
LazyMan('Tony').eat('lunch').sleep(10).eat('dinner')
// Hi I am Tony 
// I am eating lunch
// 等待10s
// I am eating dinner
LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food')
// Hi I am Tony 
// 等待5s
// I am eating lunch
// I am eating dinner
// 等待10s
// I am eating junk food
```
```javascript
class LazyManClass {
  constructor(name) {
    this.name = name
    this.task = []
    console.log(`Hi I am ${this.name}`)
    setTimeout(() => this.next())
  }
  sleepFirst(time) {
    const fn = () => {
      console.log(`sleep ${time}ms`)
      setTimeout(() => {
        this.next()
      }, time)
    }
    this.task.unshift(fn)
    return this
  }
  sleep(time) {
    const fn = () => {
      console.log(`sleep ${time}ms`)
      setTimeout(() => {
        this.next()
      }, time)
    }
    this.task.push(fn)
    return this
  }
  eat(food) {
    this.task.push(() => {
      console.log(`I am eating ${food}`)
      this.next()
    })
    return this
  }
  next() {
    const fn = this.task.shift()
    fn && fn()
  }
}
function LazyMan(name) {
  return new LazyManClass(name)
}
LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5000).sleep(10000).eat('junk food')
```

8.给定两个数组，用一个方法来计算他们的公共元素
```javascript
var nums1 = [1, 2, 2, 1]
var nums2 = [2, 3, 4, 5, 6, 1, 1]
// 返回[1, 2, 1]

// answer
function getIntersection(items1, items2) {
  var arr1 = [...items1]
  var arr2 = [...items2]
  return arr1.filter(item => {
    var index = arr2.indexOf(item)
    if (index > -1) {
      arr2.splice(index, 1)
      return true
    }
  })
}
getIntersection(nums1, nums2) // [1, 2, 1]
```
9.随机生成一个长度为10，数值区间为[0, 100)的整数类型的数组，如：[2, 10, 3, 4, 5, 11, 10, 11, 20, 30]
将其排列成一个新的数据，要求升序排列，10分位相同的数为一个子数组
新的数组形式如：[[2, 3, 4, 5], [10, 11], [20], [30]]

```javascript
const getRandomNumber = () => Math.floor(Math.random() * 100)
const arr = Array.from({ length: 10 }).map(item => getRandomNumber())
const sortArr = Array.from(new Set(arr)).sort((a, b) => a - b)
const newArr = []
sortArr.forEach(item => {
  const i = Math.floor(item/10)
  newArr[i] = newArr[i] || []
  newArr[i].push(item)
})
console.log(newArr)
```
10.如何把一个字符串大小写取反，如 Abc => aBC
```javascript
var str = 'aBcDefGhij'
function capitalReverse1(str) {
  var arr = str.split('').map(s => s === s.toUpperCase() ? s.toLowerCase() : s.toUpperCase())
  return arr.join('')
}
function capitalReverse2(str) {
  return str.replace(/./ig, (a) => a === a.toUpperCase() ? a.toLowerCase() : a.toUpperCase())
}
var newStr = capitalReverse2(str)
console.log(newStr)
```

11.实现一个字符串匹配算法，从长度为n的字符串S中，查找是否存在字符串T，T的长度是m，若存在则返回所在位置
```javascript
var S = 'abcdefghijklmnopqrstuvwxyz'
var T = 'cdef'
function findStr(t, s) {
  try {
    return new RegExp(t).exec(s).index
  } catch(e) {
    return -1
  }
}
var index = findStr(T, S)
console.log(index) // 2
```
12.旋转数组
给定一个数组，将数组中的元素向右移动k个位置，其中k是非负数。
```html
输入：[1, 2, 3, 4, 5, 6, 7] k = n
输出：[5, 6, 7, 1, 2, 3, 4]
解释：
向右旋转1步：[7, 1, 2, 3, 4, 5, 6]
向右旋转2步：[6, 7, 1, 2, 3, 4, 5]
向右旋转3步：[5, 6, 7, 1, 2, 3, 4]
```
```javascript
var arr = [1, 2, 3, 4, 5, 6, 7]
function arrReverse(arr, k) {
  return arr.splice(arr.length - k).concat(arr)
}
var newArr = arrReverse(arr, 4)
console.log(newArr)
```
