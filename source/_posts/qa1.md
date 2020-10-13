---
title: 前端基础一
date: 2020/09/30
tag: [基础,面试,试题]
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


2、请用闭包定义一个函数,实现每隔1秒,输出从1到500
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

3、实现下面的字符串格式化函数 format( String, Object),避免出现XSS :
```javascript
  document
  .body
  .innerHTML = 
  format('<div>I am {name}, my website is <a href="{website}">{website}</a></div>',{
    name: 'James',
    website: 'http://www.qq.com'
  })
```
```javascript
const str = '<div>I am { name }, my website is <a href="{website}">{website}</a></div>'
const data = {
  name: 'James',
  website: 'http://www.qq.com'
}
function format(str, data) {
  return str
  .replace(/&/g, '&amp')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/ /g, '&nbsp;')
  .replace(/\'/g, '&#39;')
  .replace(/\"/g, '&quot;')
  .replace(/\{(.*?)\}/g, (i, k) => data[k.trim()])
}
format(str, data)
```

4、定义一个列表类List,该类包含成员方法 add()、all() 和属性 length,要求构造函数和add0方法的参数为动态参数
```javascript
  // 构造函数示例：
  var ls = new List('A', 'B','C')
  // add方法示例
  ls.add('D','E');
  // length属性
  ls.length; // =>5
  // items属性
  ls.all(); // =>【A,B,"C,"D,"E]
```

```javascript
class List {
  constructor() {
    this.args = [...arguments]
  }
  add() {
    this.args = Array.prototype.concat(this.args, [...arguments])
  }
  all() {
    return this.args
  }
  get length() {
    return this.args.length
  }
}

let ls = new List('A', 'B', 'C')
ls.add('D', 'E')
console.log(ls.length)
ls.all()
```


5、通过JS在下面的ul中插入10000条 li 节点,并在点击 li 时打印其下标
```html
<ul id="list></ul>
```
```javascript
const ul = document.querySelector('#ul')
const fragment = document.createDocumentFragment()
ul.innerHTML= ''
for (let i = 0; i < 10000; i++) {
  const li = document.createElement('li')
  li.innerText = i
  li.setAttribute('data-index', i)
  fragment.appendChild(li)
}
ul.appendChild(fragment)
ul.addEventListener('click', (e) => {
  console.log(e.target.dataset.index)
})
```


6、 nodes如何注册和监听一个自定义事件
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

7、已知有一个数组类似 var list=[{age:12, group:1},{age:20, group:3},{age:12, group:23}]
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
8、将数组扁平化并去除其中重复数据，最终得到一个升序且不重复的数组
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

9、请把两个数组
['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'] 和 
['A', 'B', 'C', 'D'] 合并为 
['A1', 'A2', 'A', 'B1', 'B2', 'B', 'C1', 'C2', 'C', 'D1', 'D2', 'D']
```javascript
var arr1 = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2']
var arr2 = ['A', 'B', 'C', 'D']

arr2.map(item => item+'3').concat(arr1).sort().map(item => item.replace('3', ''))
```

10、改造下面代码，使之输出0-9
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
// anser3
for (var i = 0; i < 10; i++) {
  setTimeout((i) => {
    console.log(i)
  }, 1000, i)
}
// anser4
for (var i = 0; i < 10; i++) {
  setTimeout(console.log, 1000, i)
}
```

11、请按照如下布局在pc端实现htm和css样式，要求:
a)A区域是 header部分,高度100像素,宽度根据屏幕自适应,居顶部展示
b)B区域固定宽度200像素,居左侧展示
c)C区域根据屏幕宽度自适应
d)D区域固定宽度200像素,居右侧展示
e)E区域高度80像素,宽度自适应,当整体内容不够满屏展示,E居屏幕底部展示
f)当整体内容超出屏幕高度,出现垂直滚动

demo：
[https://www.epoos.com/demo/learn/layout1.html](https://www.epoos.com/demo/learn/layout1.html)

```html
<style>
.header {
  background:#396;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 60px;
  z-index: 2;
}
.header-none {
  height: 60px;
}
.left {
  background:#963;
  position: absolute;
  left: 0;
  top: 60px;
  width: 200px;
}
.content {
  background:#693;
  width: 100%;
  min-height: 100%;
  padding: 60px 200px 30px 200px;
  margin-top: -60px;
  box-sizing: border-box;
}
.right {
  position: absolute;
  right: 0;
  top: 60px;
  background:#369;
  width: 200px;
}
.footer {
  background:cornsilk;
  float: left;
  width: 100%;
  height: 30px;
  margin-top: -30px;
}
</style>

<body>
<div class="header">header</div>
<div class="header-none"></div>
<div class="left">left</div>
<div class="content" contenteditable="true"></div>
<div class="right">right</div>
<div class="footer">footer</div>
</body>
```

