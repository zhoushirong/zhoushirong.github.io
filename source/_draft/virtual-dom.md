---
title: 虚拟DOM
date: 2021/01/03
tag: [virtualDom,虚拟DOM]
category: 技术
---

剖析Vue实现原理 - 如何实现双向绑定mvvm
https://github.com/DMQ/mvvm

虚拟DOM是对DOM的一层抽象，以Javascript对象（VNode节点）作为基础的树。
用对象的属性描述节点，最后通过一些方法将其映射为真实的环境上，因此可实现跨平台。

虚拟DOM的优势：通过diff算法最小代价的操作DOM、抽象的虚拟DOM节点可方便的实现跨平台。

proxy为什么比Object.defineProperty 性能更好
