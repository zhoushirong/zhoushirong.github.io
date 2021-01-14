---
title: js对象和类的操作
date: 2020/10/19
tag: [基础,对象]
category: 技术
---

1.对象深度优先遍历和广度优先遍历的实现
如图：
<img src="http://zhoushirong.github.io/img/map.png" alt="ssh-l图片" width="630" height="215">

```javascript
const obj = {
  a1: {
    a1b1: 1,
    a1b2: 2
  },
  a2: {
    a2b1: 3,
    a2b2: 4,
    a2b3: 5
  }
}
// 深度优先遍历
const depthArr = []
function depthFirst(obj) {
  for (let i in obj) {
    depthArr.push(i)
    if (Object.prototype.toString.call(obj[i]) === '[object Object]') {
      depthFirst(obj[i])
    }
  }
  return depthArr
}

// 广度优先遍历
const breadthArr = []
function breadthFirst(obj) {
  const arr = Object.keys(obj)
  breadthArr = breadthArr.concat(arr)
  arr.forEach(i => {
    if (Object.prototype.toString.call(obj[i]) === '[object Object]') {
      breadthFirst(obj[i])
    }
  })
}

depthFirst(obj) // ['a1', 'a1b1', 'a1b2', 'a2', 'a2b1', 'a2b2', 'a2b3']
breadthFirst(obj) // ['a1', 'a2', 'a1b1', 'a1b2', 'a2b1', 'a2b2', 'a2b3']
console.log(depthArr, breadthArr)
```

2.用深度优先思想实现一个深拷贝函数
深度拷贝最主要需要考虑的因素就是需要考虑js的各种数据类型
1）6种基本类型(number,string,null,undefined,boolean,symbol)不需要处理，直接复制返回即可
2）几种特殊类型 date、regexp、set、map，直接new一遍即可
3）需要着重处理的类型 Array、Object，直接使用递归处理即可
4）递归处理Array、Object的过程中需要考虑循环引用，循环引用处理可以利用WeakMap将每次递归的对象存储起来，如果一样，直接返回

```javascript
const obj = {
  a1: {
    a1b1: 1,
    a1b2: 2
  },
  a2: {
    a2b1: 3,
    a2b2: 4,
    a2b3: 5
  },
  fn1: function() {
    console.log('fn1')
  },
  symbolData: Symbol('symbolData'),
  booleanData: false,
  date: new Date(),
  nullData: null,
  arrData: [1, 2, 3, { arr1: { a:1, b: 2 }, arr2: [] }],
  numberData: 1,
  strData: 'abc',
  regexData: new RegExp('abcdefg'),
  setData: new Set(),
  mapData: new Map(),
}
obj.obj = obj // 循环引用

function isType(target, type) {
  if (!type) {
    return Object.prototype.toString.call(target).slice(8, -1)
  }
  return Object.prototype.toString.call(target) === `[object ${type}]`
}
function depthFirstClone(obj, hash = new WeakMap()) {
  const oType = isType(obj)
  if (oType !== 'Object' && oType !== 'Array') return obj
  if (hash.has(obj)) return hash.get(obj)

  const newObj = oType === 'Array' ? [] : {}
  hash.set(obj, newObj)

  for (let i in obj) {
    if (
      typeof obj[i] === 'string' ||
      typeof obj[i] === 'number' ||
      typeof obj[i] === 'boolean' ||
      typeof obj[i] === 'symbol' ||
      obj[i] === undefined ||
      obj[i] === null
    ) {
      newObj[i] = obj[i]
      continue
    }
    if (isType(obj[i], 'Function')) {
      newObj[i] = obj[i]
      continue
    }
    if (isType(obj[i], 'Set')) {
      newObj[i] = new Set(obj[i])
      continue
    }
    if (isType(obj[i], 'Map')) {
      newObj[i] = new Map(obj[i])
      continue
    }
    if (isType(obj[i], 'Date')) {
      newObj[i] = new Date(obj[i])
      continue
    }
    if (isType(obj[i], 'RegExp')) {
      newObj[i] = new RegExp(obj[i])
      continue
    }
    if (isType(obj[i], 'Array') || isType(obj[i], 'Object')) {
      newObj[i] = depthFirstClone(obj[i], hash)
      continue
    }
  }
  return newObj
}
let cloneObj = depthFirstClone(obj)
```

3.实现一个LazyMan类，实现以下功能
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


5.实现convert方法，把原始list转换成树形结构，要求尽可能降低时间复杂度
以下数据结构中，id代表部门编号，name是部门名称，parentId是父部门编号，为0代表一级部门，现在要求实现一个convert方法，把原始list转换成树形结构，parantId为多少就挂载在该id的属性children数组下
```javascript
let list = [
  { id: 1, name: '部门A', parentId: 0 },
  { id: 2, name: '部门B', parentId: 0 },
  { id: 3, name: '部门C', parentId: 1 },
  { id: 4, name: '部门D', parentId: 1 },
  { id: 5, name: '部门E', parentId: 2 },
  { id: 6, name: '部门F', parentId: 3 },
  { id: 7, name: '部门G', parentId: 2 },
  { id: 8, name: '部门H', parentId: 4 },
  // ...
]
function convert(list) {
  const res = []
  const map = {}
  list.forEach(item => map[item.id] = item)
  list.forEach(item => {
    if (item.parentId === 0) return res.push(item)
    const parent = map[item.parentId]
    if (parent.children) {
      parent.children.push(item)
    } else {
      parent.children = [item]
    }
  })
  return res
}

let result = convert(list)
result = [{
  id: 1,
  name: '部门A',
  parentId: 0,
  children: [{
    id: 3,
    name: '部门3',
    parentId: 1,
    children: [{
      id: 6,
      name: '部门6',
      parentId: 3,
    }]
  }]
}, /* ... */]
```

6.将entry转换为output、将output转换为entry：
```javascript
var entry = {
  'a.b.c.dd': 'abcdd',
  'a.d.xx': 'adxx',
  'a.e': 'ae',
}
// =>
var output = {
  a: {
    b: {
      c: {
        dd: 'abcdd'
      }
    },
    d: {
      xx: 'adxx'
    },
    e: 'ae'
  }
}
```

```javascript
// entry => output
function gen(obj = {}, str, val) {
  str.split('.').reduce((acc, i, idx, source) => {
    if (!acc[i]) {
      acc[i] = idx === source.length - 1 ? val : {}
    }
    return acc[i]
  }, obj)
  return obj
}
function generater(obj) {
  const newObj = {}
  for (let i in obj) {
    gen(newObj, i, obj[i])
  }
  return newObj
}
generater(entry)
```

```javascript
// output => entry answer1
const isObj = val => Object.prototype.toString.call(val) === '[object Object]'
function fn(obj = {}, key, newObj = {}) {
  for (let i in obj) {
    const nkey = key ? key + '.' + i : i
    if (isObj(obj[i])) {
      fn(obj[i], nkey, newObj)
    } else {
      newObj[nkey] = obj[i]
    }
  }
  return newObj
}
// output => entry answer2
function fn(obj = {}) {
  const queue = Object.entries(obj)
  const res = {}
  while(queue.length) {
    const [key, obj] = queue.pop()
    for (const [k, v] of Object.entries(obj)) {
      if (!isObj(v)) {
        res[`${key}.${k}`] = v
      } else {
        queue.push([`${key}.${k}`, v])
      }
    }
  }
  return res
}
```

7.实现一个简单的仓储系统，可以不断转入和转出货物，货物最多有两层子类目，数字代表该子类目转入/转出的数量。转出时不能出现爆仓情况。
```javascript
/*
 * cargo 说明：
 * key代表类目/子类目名称
 * value 为 number时，代表这个类目的数量，为object 时，代表下一层货物的集合，最多嵌套两层
 * {
 *  productA:{  // 代表货物的类目名称
 *    a:1, // 1 代表子类目 a 的数量
 *    b:2,
 *    c:{   // c 代表货物的子类名称
 *      c1:1, // c1代表货物的子类名称
 *    }
 *   }，
 *  productB:{
 *      e:6
 *   }
 * }
 *
 * 爆仓情况：如转入 {productA:{a:3,c:1}} 转出 {productA:{a:4}},就会发生子类目a爆仓，此时要返回报错。
 */

class Depository {
  constructor() {
    this.product = {}
  }
  compineProduct(cargo, product) {
    for (let i in cargo) {
      if (!product[i]) {
        product[i] = {}
      }
      if (typeof cargo[i] === 'number') {
        if (typeof product[i] === 'number') {
          product[i] += cargo[i]
        } else {
          product[i] = cargo[i]
        }
      } else {
        this.compineProduct(cargo[i], product[i])
      }
    }
  }
  reduceProduct(cargo, product) {
    for (let i in cargo) {
      if (!product[i]) {
        throw `货物${i}不存在`
      }
      if (typeof cargo[i] === 'number') {
        if (product[i] - cargo[i] <= 0) {
          throw `货物${i}爆仓`
        }
        product[i] -= cargo[i]
      } else {
        this.reduceProduct(cargo[i], product[i])
      }
    }
  }
  // 转入货物
  transferIn(cargo) {
    if (!cargo) return this.product
    this.compineProduct(cargo, this.product)
    return this.product
  }
  // 转出货物
  transferOut(cargo) {
    if (!cargo) return this.product
    this.reduceProduct(cargo, this.product)
    return this.product
  }
}
```

8.使用Javascript Proxy实现简单的数据绑定 
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