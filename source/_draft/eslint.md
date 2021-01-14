---
title: ESLint代码规范
date: 2018/04/24
tag: [ESLint,代码规范]
---

####  常见的代码规范工具有：

jslint:jslint是一个JavaScript的代码质量检查工具，主要用来检查代码质量以及找出一些潜在的代码缺陷。
csslint:csslint是一个用来帮你找出CSS代码中问题的工具，它可做基本的语法检查以及使用一套预设的规则来检查代码中的问题，规则是可以扩展的。
htmlhint:htmllint较好地同时支持了格式规则及语义规则,同时也支持自定义规则。
scss-lint:使scss代码持续保持简洁、高效和可维护性。

JSLint，古老，不可配置，不可扩展，不可禁用许多特性的校验
JSHint，可配置的JSLint版本
ESLint，易于扩展，可自定义规则，可以插件形式安装更多的规则。


#### ESLint

默认规则包含所有 JSLint、JSHint 中存在的规则，易迁移
规则可配置性高：可设置「警告」、「错误」两个 error 等级，或者直接禁用
包含代码风格检测的规则（可以丢掉 JSCS 了）
支持插件扩展、自定义规则
支持JSX、ES2015语法


配置
可以通过以下三种方式配置 ESLint:

使用 .eslintrc 文件（支持 JSON 和 YAML 两种语法）；
在 package.json 中添加 eslintConfig 配置块；
直接在代码文件中定义。

#### .eslintrc 文件示例：
{
  "env": {
    "browser": true,
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "globals": {
    "angular": true,
  },
  "rules": {
    "camelcase": 2,
    "curly": 2,
    "brace-style": [2, "1tbs"],
    "quotes": [2, "single"],
    "semi": [2, "always"],
    "space-in-brackets": [2, "never"],
    "space-infix-ops": 2,
  }
}


package.json 示例：
```json
{
  "name": "mypackage",
  "version": "0.0.1",
  "eslintConfig": {
    "env": {
      "browser": true,
      "node": true
    }
  }
}
```

#### 文件内配置(eg:禁用 ESLint)
```javascript
/* eslint-disable */
var obj = { key: 'value', }; // I don't care about IE8


/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: { App }
})
```

### 工作流集成，编辑器集成


#### 代码风格检测
在团队协作中，统一的代码风格更具可读性、可维护性。ESLint 内置了一系列有关代码风格的规则，可以根据团队的编码规范设置。


#### 插件集成
```json
{
  "plugins": [
      "react"
  ]
}
```


### 自动化构建工具
eslint-loader
### es6？
babel-eslint


## eslint

http://eslint.cn/docs/user-guide/configuring
http://tutuxxx.github.io/2016/08/14/%E5%9C%A8Vue+Babel+Webpack%E7%8E%AF%E5%A2%83%E4%B8%AD%E4%BD%BF%E7%94%A8ESLint/










