
---
title: 回文字符串
date: 2021/01/25
tag: [回文,动态规划,算法]
category: 笔记
---

#### 什么是回文字符串
回文字符串就是一个字符串，从头读到尾和从尾读到头，字符出现的顺序是一样的。
如：
```html
a
aba
abba
abcba
...
abcdefgfedcba
```

#### 问题1：让任意字符串成为回文串的需要插入的最小字符数
如：
```html
插入0次
a => a
```
```html
插入1次
ab => aba || bab
```
```html
插入2次
abc => abcba || cbabc
```

#### 分析
如果它最后要变成一个回文字符串，那么它最终的最左侧和最右侧的字符一定要是相同的。
如果当前最左侧和最右侧的字符一样，便可继续遍历；如果不一样我们就进行填补。

填补的方式有两种：
1.在左侧填补一个最右侧的字符，左侧继续向前遍历。
2.在右侧填补一个最左侧的字符，右侧继续向前遍历。

对于这两种填补方式，它们的填补消耗都是 1 个字符，我们也无法确定哪一种是最优解。
所以只有继续推导，直到最终遍历完成后便可得到全局最优解。


基于上述思路，这里可以利用动态规划的方式来实现，或者说动态规划是对于这种思路方式的一种比较不错的实现。

如上述思路中提到的内容，如果我们想知道区间 [left, right] 范围里的最优解，那么可能存在两种情况

```html
s[left] === s[right] (计数 +0)
或者
s[left] !== s[right] (计数 +1)
```
针对这两种情况，我们可以得到两种对应的结果
```html
+0 => [left + 1, right - 1] (加 0 的时候，说明相等，则指针向中间移动)
+1 => min([left + 1, right], [left, right - 1]) (加 1 的时候，说明不相等，比较左移指针和右移指针哪个更优)
```

如果写成一个递推公式的话可以是
```javascript
f(left, right) = (s[left] === s[right]) 
  ? f(left + 1, right - 1)
  : 1 + min(f(left + 1, right), f(left, right - 1))
```
对应的递归方法实现如下：
```javascript
const minInsertions = str => {
  const LEN = str.length
  const f = (left = 0, right = LEN - 1) => { // abcdefg
    if (left >= right) {
      return 0
    }
    // console.log(left, right, str[left], str[right])
    if (str[left] === str[right]) {
      return f(left + 1, right - 1)
    }
    return 1 + Math.min(f(left + 1, right), f(left, right - 1))
  }
  return f()
}
```

另一种实现方式是按照 ***动态规划（附录有简介）*** 方法。
我们使用一个数组来记录递推的过程和中间值，具体流程如下：
1）申明一个二维数组。
2）初始化长度为 1 时候的每个字符串所需要的开销为 0，因为一个字符自身就是回文字符串。
3）根据上面的递推公式，逐层的推出并保存每一层的值。
4）最终取出 [0, s.length - 1] 对应的值就是我们的结果。
```javascript
const minInsertions = str => { // abcdefg
  const LEN = str.length // 7
  const dp = [] // dp[i][j]的定义: 对字符串str[i..j]，最少需要进行dp[i][j]次插入才能变成回文串。
  for (let i = 0; i < LEN; i++) {
    dp[i] = new Array(LEN).fill(0) // 一个字符转回文的开销 dp = [0, 0, ... , 0]
    dp[i][i + 1] = str[i] === str[i + 1] ? 0 : 1 // 当前字符与下一个字符转回文的开销 dp[0][1] = 1; dp[1][2] = 1; ...; dp[LEN - 1][LEN] = 1;
    // console.log(dp, str[i], str[i + 1])
  }
  // dp.length === 7; dp = [[0, 1, 0, 0, 0, 0, 0], [0, 0, 1, 0 , 0, 0, 0], ... , [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0, 1]]
  for (let i = 2; i < LEN; i++) {
    for (j = 0; j < LEN - i; j++) { // LEN - i = 5,4,3,2,1;
      // 状态转移方程（核心算法）
      dp[j][j + i] = str[j] === str[j + i]
        // 如果 str[j] === str[j + i]，则它的内层字符串的回文开销就是它的开销。
        ? dp[j + 1][j + i - 1]
        // 否则 取插入到右边的开销和插入到左边的开销的最小值 + 插入一次
        // (j+i) - (j+1) = i-1，(j+i-1) - j = i-1；相差i-1个位置
        // 如何保证此时的 dp[j + 1][j + i] 和 dp[j][j + i - 1] 在这之前已经被计算出来了？
        : 1 + Math.min(dp[j + 1][j + i], dp[j][j + i - 1]) 
    }
  }
  // console.log(dp)
  return dp[0][LEN - 1] // dp[0][6] === 6
}
```
上面的代码时间复杂度 O(n^2)，空间复杂度也是 O(n^2)。

把空间复杂度压缩到 O(n)，不用二维数组，只用一维数组来记录递推的中间值。
优化代码如下：
```javascript
const minInsertions = str => { // abcdefg
  const LEN = str.length
  const dp = new Array(LEN).fill(0)
  for (let i = LEN - 2; i >= 0; i--) { // i = 5,4,3,2,1,0
    let prev = 0
    for (let j = i + 1; j < LEN; j++) { // j = [6],[5,6],[4,5,6],[3,4,5,6],[2,3,4,5,6],[1,2,3,4,5,6]
      const tmp = dp[j]
      if (str[i] === str[j]) { // 如果相等，则取上一个状态的值
        dp[j] = prev
      } else { // 不相等的时候
        dp[j] = 1 + Math.min(dp[j], dp[j - 1])
      }
      prev = tmp
    }
  }
  return dp[LEN - 1]
}
```

#### 问题2：找出让任意字符串成为回文串，所需要插入的最少数，并打印出最终的回文字符串
问题1是计算出插入的最少字符数，并没有保存插入的字符和相应的插入位置
所以，在原来的基础上需要加上。
```javascript
// 待定
```


#### 附录 - 动态规划算法
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
  if (n === 0 || n === 1 || n === 2) return n

  var val = new Array(n)
  val[1] = 1
  val[2] = 2
  for (var i = 3; i <= n; i++) {
    val[i] = val[i - 1] + val[i - 2]
  }
  return val[n - 1]
}
```

#### 附录-动态规划的状态转移方程
状态转移方程，是动态规划中本阶段的状态往往是上一阶段状态和上一阶段决策的结果。
如果给定了第K阶段的状态Sk以及决策uk(Sk)，则第K+1阶段的状态Sk+1也就完全确定。

也就是说得到k阶段的状态和决策后就可以得到k+1阶段的状态
状态转移就是从小规模问题的答案推导更大规模问题的答案，就是如何从已知求得未知的表达式。

### 传送门
[知乎-让字符串成为回文串的最少插入次数](https://zhuanlan.zhihu.com/p/300617309)
