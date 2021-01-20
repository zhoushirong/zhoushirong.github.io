
---
title: 回文字符串
date: 2021/01/20
tag: [回文]
category: 技术
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

#### 问题：插入最少 "字符" 让任意字符串成为回文串的
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
s[left] === s[right]
或者
s[left] !== s[right]
```
针对这两种情况，我们可以得到两种对应的结果
```html
0 + [left + 1, right - 1]
和
1 + min([left + 1, right], [left, right - 1])。
```

如果写成一个递推公式的话可以是
```javascript
f(left, right) = (s[left] === s[right]) 
  ? f(left + 1, right - 1)
  : 1 + min(f(left + 1, right), f(left, right - 1))
```

那么接下来按照动态规划，我们使用一个数组来记录递推的过程和中间值。
具体流程如下：
申明一个二维数组。
初始化长度为 1 时候的每个字符串所需要的开销，即 0，因为一个字符自身就是回文字符串。
根据上面的递推公式，逐层的推出每一层的值。
最终取出 [0, s.length - 1] 对应的值就是我们的结果。
根据上述流程，我们可以实现类似下面的代码：
```javascript
const minInsertions = s => {
  const LEN = s.length;
  const dp = [];
  for (let i = 0; i < LEN; ++i) {
    dp[i] = new Uint16Array(LEN);
    dp[i][i + 1] = s[i] === s[i + 1] ? 0 : 1;
  }
  for (let i = 2; i < s.length; ++i) {
    for (j = 0; j < s.length - i; ++j) {
      dp[j][j + i] = s[j] === s[j + i]
        ? dp[j + 1][j + i - 1]
        : 1 + Math.min(dp[j + 1][j + i], dp[j][j + i - 1]);
    }
  }
  return dp[0][s.length - 1];
};
```
优化
上面的代码时间复杂度 O(n^2)，空间复杂度也是 O(n^2)。
那么其实按照经验，我们可以尝试一下把空间复杂度压缩到 O(n)，即不是用二维数组，只是用一维数组来记录递推的中间值。

不过这里要注意的是，由于我们无法保存所有历史的中间值，所以我们的遍历递推方向做出了一点调整。
具体的代码如下：
```javascript
const minInsertions = s => {
  const LEN = s.length;
  const dp = new Uint16Array(LEN);
  for (let i = LEN - 2; i >= 0; i--) {
    let prev = 0;
    for (let j = i + 1; j < LEN; j++) {
      const tmp = dp[j];
      dp[j] = s[i] === s[j] ? prev : 1 + Math.min(dp[j], dp[j - 1]);
      prev = tmp;
    }
  }
  return dp[LEN - 1];
};
```

### 传送门
https://zhuanlan.zhihu.com/p/102224665

动态规划、马拉车算法