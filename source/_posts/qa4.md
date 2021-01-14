---
title: JS数组操作
date: 2020/10/14
tag: [基础,数组]
category: 技术
---

1、当前字符串中包含字母和数字, 用一个方法实现出现最多的字母和数字 
a)如果只有字母, 那么只返回出现最多的字母, 只有数字情况同理
b)如果有相同次数多的字母或数字出现,将按照第一次出现的顺序返回
列表如下:
```javascript
const str = "abcdccbdb58575" 
["b","c","5"] // 数组 a:1, b:3, c:3, d: 2, 5:3, 7:1, 8:1
```
```javascript
// 方法一
const str = "abcdccbdb58575" 
const obj = {}
Array.from(
  new Set(
    str.split('').map(i => {
      obj[i] = obj[i] ? obj[i]+1 : 1
      return i
    })
  )
)
.sort((a, b) => obj[b] - obj[a])
.filter((item, index, arr) => obj[item] === obj[arr[0]])

// 方法二
const obj = {}
const str = "abcdccbdb58575"
str.split('').forEach((i, index) => {
  if (!obj[i]) {
    obj[i] = {
      index,
      value: 1
    }
  } else {
     obj[i].value = obj[i].value + 1
  }
})
Object.keys(obj)
.sort((a, b) => {
  return obj[b].value - obj[a].value
})
.filter((item, index, arr) => obj[item].value === obj[arr[0]].value)
.sort((a, b) => obj[a].index - obj[b].index)

// 方法三
const str = "abcdccbdb58575"
const map = new Map()
str.split('').forEach(i => {
  const v = map.get(i)
  map.set(i, v ? v + 1 : 1)
})
let max
for (let m of map) {
  if (!max) {
    max = m
    continue
  }
  if (m[1] > max[1]) {
    map.delete(max[0])
    max = m
    continue
  }
  if (m[1] < max[1]) {
    map.delete(m[0])
  }
}
console.log([...map.keys()])
```

2、已知有一个数组类似 var list=[{age:12, group:1},{age:20, group:3},{age:12, group:23}]
请实现对数组的排序,先按age升序排序再按 group降序排序,结果类似[age:12, group:23},{age:12,goup:1},tage:20, group:3]

```javascript
function compare(key, order) { 
  return (a,b) => { // return 大于0，b在前面；小于0，a在前面
    if (order === 'desc') { // 升序
      return a[key] - b[key] // 如果结果大于0，则b在前面 [b, a]，此为升序
    }
    return b[key] - a[key] // 如果结果大于0，则b在前面 [b, a]，此为降序
  }
}
list.sort(compare('age', 'desc'))
list.sort(compare('name'))
```

3、将数组扁平化并去除其中重复数据，最终得到一个升序且不重复的数组
```javascript
var arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10]
// 方法一
Array.from(new Set(arr.toString().split(','))).sort((a, b) => a - b).map(Number)
// 方法二
Array.from(new Set(arr.flat(Infinity))).sort((a, b) => a - b)
// 附录，flat方法兼容方法
function flat(arr) {
  return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flat(val) : val), [])
}
```


4、请把两个数组
['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'] 和 
['A', 'B', 'C', 'D'] 合并为 
['A1', 'A2', 'A', 'B1', 'B2', 'B', 'C1', 'C2', 'C', 'D1', 'D2', 'D']
```javascript
var arr1 = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2']
var arr2 = ['A', 'B', 'C', 'D']

arr2.map(item => item+'3').concat(arr1).sort().map(item => item.replace('3', ''))
```

5.合并两个有序数组
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


6.已知如下数组：var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10]
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

7.某公司1到12月份的销售额存在一个对象里面
如：{1:222, 2:123, 5: 888}, 请把数据处理为如下结构
[222, 123, null, null, 888, null, null, null, null, null, null, null]
```javascript
var data = { 1: 222, 2: 123, 5: 888 }
new Array(12).fill(null).map((i, index) => {
  return data[index + 1] || null
})
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

10.旋转数组
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

11.算法题【移动零】，给定一个数组nums，编写一个函数将所有0移动到数组的末尾，同时保持非零元素的相对顺序
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