
---
title: 动态规划算法
date: 2021/01/29
tag: [动态规划,算法]
category: 笔记
---

#### 动态规划算法
动态规划有时被认为是一种与递归相反的技术。
递归是从顶部开始将问题分解，通过解决掉所有分解出小问题的方式，来解决整个问题。
动态规划解决方案从底部开始解决问题，将所有小问题解决掉，然后合并成一个整体解决方案，从而解决掉整个大问题。

使用递归去解决问题虽然简洁，但效率不高。
许多使用递归去解决的编程问题，可以重写为使用动态规划的技巧去解决。
动态规划方案通常会使用一个数组来建立一张表，用于存放被分解成众多子问题的解。
当算法执行完毕，最终的解将会在这个表中很明显的地方被找到

计算斐波拉契数列的值，使用递归算法 和 动态规范算法举例
```javascript
/**
 * 递归算法计算
 */
function recurFib(n) {
  if (n < 2) return n
  return recurFib(n - 1) + recurFib(n - 2)
}
/**
 * 动态规划算法计算
 * 将每一步的值先计算好，并存起来
 * 最后直接取最后一步的值即可
 */
function dynFib(n) {
  if (n < 2) return n

  var val = new Array(n)
  val[1] = 1
  val[2] = 2
  for (var i = 3; i <= n; i++) {
    val[i] = val[i - 1] + val[i - 2]
  }
  return val[n - 1]
}
```
就上述例子而言，如果仅仅是计算出斐波拉契数列的值，其实可以不用数组
之所以使用数组就是为了保存每一步的值，然而我们其实不需要中间值，只需要最后的结果就行了。
因此，可使用迭代的方式进行优化
```javascript
function iterFib(n) {
  if (n < 2) return n
  var last = 1 // 最后一个
  var preLast = 1 // 下一个最后一个
  var result = 1 // 当前结果
  for (var i = 2; i < n; i++) {
    result = preLast + last
    preLast = last
    last = result
  }
  return result
}
```

#### 利用动态规划找出两个字符串的最长公共子序列长度
```javascript
function lcs(strX, strY) {
  const m = strX.length
  const n = strY.length
  const nArr = new Array(n + 1).fill(0)
  const l = []
  for (let i = 0; i < m+1; i++) {
    l[i] = [...nArr]
  }
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (strX[i - 1] === strY[j - 1]) { // 两两遍历，如果有相等的，该坐标 +1
        l[i][j] = l[i - 1][j - 1] + 1
      } else {
        l[i][j] = Math.max(l[i - 1][j], l[i][j - 1]) // max
      }
    }
  }
  // console.log(l)
  return l[m][n] // {5}
}
// lcs('abbcc', 'dbbcc') // bbcc 4
lcs('abbc', 'abbbc') // abbb 4
// lcs('ababbccbac', 'abbcac') // abbcac 6
```

#### 背包问题
背包问题是算法研究中的一个经典问题。
一大堆物品物品规格和价值不同，你希望用自己的小背包装这些物品，直至装满，最后结果要使背包内的物品总价值最大。

1.使用递归的方式解决背包问题
```javascript
/**
*  @capacity 背包剩余容量
*  @size 即将装入物品的体积
*  @value 即将装入物品的价值
*  @n 所有物品的数量
*/
function knapsack(capacity, size, value, n) {
  // 物品装完或者背包装满的时候停止
  if (n === 0 || capacity === 0) return 0

  // 即将装入的物品体积 大于 背包剩余容积的时候，继续装
  if (size[n - 1] > capacity) {
    return knapsack(capacity, size, value, n - 1)
  }
  // 装入当前物品 和 装入其它物品哪个价值更大
  return Math.max(
    value[n - 1] + knapsack(capacity - size[n - 1], size, value, n - 1),
                   knapsack(capacity,               size, value, n - 1)
  )
}
// 一堆共5件物品，
var value = [4, 5, 10, 11, 13] // 物品价值分别是 4、5、10、11、13
var size  = [3, 4, 7, 8, 9] // 物品尺寸分别是 3、4、7、8、9
var capacity = 16 // 背包的容积为 16
var n = value.length // 所有物品数量
var result = knapsack(capacity, size, value, n) // 总价值计算
// console.log(result)
```

2.动态规划算法
上面的递归算法能解决问题，但是性能并不好，有大量的重复计算。
使用动态规划来解决背包是一个更好的选择。
动态规划解决此问题的关键思路是计算装入背包的每一个物品的最大价值，直到背包装满。
```javascript
function dKnapsack(capacity, size, value, n) {
  var arr = []
  for (var i = 0; i <= capacity + 1; i++) {
    arr[i] = []
  }
  
  for (var i = 0; i <= n; i++) {
    for (var j = 0; j <= capacity; j++) {
      if (i == 0 || j == 0) {
        arr[i][j] = 0
      } else if (size[i - 1] <= j) { // 即将装入的物品小于等于背包容积的时候
        arr[i][j] = Math.max(
          value[i - 1] + arr[i - 1][j - size[i - 1]], // 即将装入物品的价值 + 装入此物品之前的总价值
          arr[i - 1][j]
        )
      } else { // 装不下的时候取上一次装入之后的总价值
        arr[i][j] = arr[i - 1][j]
      }
    }
  }
  return arr[n][capacity]
}

// 一堆共5件物品，
var value = [4, 5, 10, 11, 13] // 物品价值分别是 4、5、10、11、13
var size  = [3, 4, 7, 8, 9] // 物品尺寸分别是 3、4、7、8、9
var capacity = 16 // 背包的容积为 16
var n = value.length // 所有物品数量
var result = dKnapsack(capacity, size, value, n) // 总价值计算
console.log(result)
```

#### 最少硬币找零问题

#### 矩阵链相乘

### 附录 - 动态规划状态转移方程
状态转移方程，是动态规划中本阶段的状态往往是上一阶段状态和上一阶段决策的结果。
如果给定了第K阶段的状态Sk以及决策uk(Sk)，则第K+1阶段的状态Sk+1也就完全确定。

也就是说得到k阶段的状态和决策后就可以得到k+1阶段的状态
状态转移就是从小规模问题的答案推导更大规模问题的答案，就是如何从已知求得未知的表达式。
