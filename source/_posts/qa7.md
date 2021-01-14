---
title: 一些面试题集合
date: 2020/12/15
tag: [基础,面试,试题]
category: 技术
---


1.关于事件监听
```javascript
const event = require('events')
const emitter = new event.EventEmitter()
setTimeout(() => {
   emitter.emit('some_event', 123)
}, 3000)

emitter.on('some_event', (evt) => {
  console.log('receive:',evt)
})
```

```javascript
// 组件通信，一个触发与监听的过程
class EventEmitter {
  constructor () {
    // 存储事件
    this.events = this.events || new Map()
  }
  // 监听事件
  addListener (type, fn) {
    if (!this.events.get(type)) {
      this.events.set(type, fn)
    }
  }
  // 触发事件
  emit (type) {
    let handle = this.events.get(type)
    handle.apply(this, [...arguments].slice(1))
  }
}
```

2.手写Promise
```javascript
// 未添加异步处理等其他边界情况
// ①自动执行函数，②三个状态，③then
class Promise {
  constructor (fn) {
    // 三个状态
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    let resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
      }
    }
    let reject = value => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = value
      }
    }
    // 自动执行函数
    try {
      fn(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }
  // then
  then(onFulfilled, onRejected) {
    switch (this.state) {
      case 'fulfilled':
        onFulfilled()
        break
      case 'rejected':
        onRejected()
        break
      default:
    }
  }
}
```

4.下面代码中a在什么情况下会打印1
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

5.实现一个 sleep 函数，比如 sleep(1000),意味着等等1000毫秒，可从Promise、Generator、Async/Await等角度实现
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

6.实现(5).add(3).minus(2)功能
```javascript
Number.prototype.add = function (i = 0) { return this.valueOf() + i }
Number.prototype.minus = function (i = 0) { return this.valueOf() - i }
var result = (5).add(3).minus(2)
console.log(result)
```

7.实现加法运算，解决浮点数问题
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


8.如何把一个字符串大小写取反，如 Abc => aBC
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

9.实现一个字符串匹配算法，从长度为n的字符串S中，查找是否存在字符串T，T的长度是m，若存在则返回所在位置
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


10、请用闭包定义一个函数,实现每隔1秒,输出从1到500
```javascript
function interval(num) {
  let i = 0
  const timer = setInterval(function() {
    if (i >= num) return clearInterval(timer)
    console.log(++i)
  }, 1000)
}
interval(10)
```


11、改造下面代码，使之输出0-9
```javascript
// question code
for (var i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i)
  }, 1000)
}
// answer1
for (let i = 0; i<10;i++) {
  setTimeout(() => {
    console.log(i)
  }, 1000)
}
// answer2
for (var i = 0; i < 10; i++) {
  setTimeout(((i) => {
    console.log(i)
  })(i), 1000)
}
// answer3
for (var i = 0; i < 10; i++) {
  setTimeout((i) => {
    console.log(i)
  }, 1000, i)
}
// answer4
for (var i = 0; i < 10; i++) {
  setTimeout(console.log, 1000, i)
}
```


12.打印出1-10000之间的所有对称数，例如：121、1331等
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

13.请实现一个add函数，满足以下功能
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

14.算法题之【两数之和】
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
