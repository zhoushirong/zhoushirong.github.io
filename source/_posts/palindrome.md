
---
title: 回文字符串
date: 2021/01/25
tag: [回文,算法]
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

#### 问题1：如何判断一个字符串是否回文字符串
```javascript
/**
 * 判断是否回文字符串
 */ 
function isPlalindrome(str) {
  const len = str.length
  let i = 0
  while(i < len / 2) {
    if (str[i] !== str[len - i - 1]) {
      return false
    }
    i++
  }
  return true
}
```

#### 问题2：让任意字符串成为回文串的需要插入的最小字符数
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
    dp[i] = new Array(LEN).fill(0) // dp[a] dp[b] ... dp[g]
    dp[i][i + 1] = str[i] === str[i + 1] ? 0 : 1 // dp[ab] dp[bc] ... dp[fg]
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
        // 当i=2的时候，(j+1 & j+i)/(j & j+i-1)均相临，所以一定是已知值的
        // 当i>2的时候，(j+1 & j+i)/(j & j+i-1)间隔2，上一轮循环的时候一定依据计算得到了值，所以已知值
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
  let num = 0
  const LEN = str.length
  const dp = new Array(LEN).fill(0)
  for (let i = LEN - 2; i >= 0; i--) { // i = 5,4,3,2,1,0
    let prev = 0
    for (let j = i + 1; j < LEN; j++) { // j = [6],[5,6],[4,5,6],[3,4,5,6],[2,3,4,5,6],[1,2,3,4,5,6]
      // console.log(i, j, num++, JSON.stringify(dp))
      const tmp = dp[j] // 0
      if (str[i] === str[j]) { // 如果相等，则取上一个状态的值
        dp[j] = prev
      } else { // 不相等的时候，取 dp[j] 和 dp[j-1] 中的最小 + 1
        dp[j] = 1 + Math.min(dp[j], dp[j - 1])
      }
      prev = tmp
    }
  }
  return dp[LEN - 1]
}
minInsertions('abcdefg')
```

#### 问题3：找出让任意字符串成为回文串，所需要插入的最少数，并打印出最终的回文字符串
问题1是计算出插入的最少字符数，并没有保存插入的字符和相应的插入位置
所以，在原来的基础上需要打印出最终的回文字符串。
分析：
插入最少字符数只有一个最优解，打印出来的回文字符串可能有多个。
所以需要把 dp[0][1]-- dp[i][j]最优的的所有字符串保存起来，得出结果之后再倒推回去

```javascript
/**
 * 补充最短回文字符串
 * 待补全，还没想到办法，留待日后解决。。。
 */ 
function getPlalindrome(str) { // abcdefg
  // const LEN = str.length
  // const dp = []
  // for (let i = 0; i < LEN; i++) {
  //   dp[i] = new Array(LEN).fill(0)
  //   dp[i][i + 1] = str[i] === str[i + 1] ? 0 : 1
  // }

  // for (let i = 2; i < LEN; i++) {
  //   for (j = 0; j < LEN - i; j++) {
  //     if (str[j] === str[j + i]) {
  //       dp[j][j + i] = dp[j + 1][j + i - 1]
  //     } else {
  //       if (dp[j + 1][j + i] > dp[j][j + i - 1]) {
  //         dp[j][j + i] = 1 + dp[j][j + i - 1]
  //       } else {
  //         dp[j][j + i] = 1 + dp[j + 1][j + i]
  //       }
  //     }
  //   }
  // }
  // return dp[0][LEN - 1]
}

getPlalindrome('abcdefg')
```
### 传送门
[知乎-让字符串成为回文串的最少插入次数](https://zhuanlan.zhihu.com/p/300617309)

