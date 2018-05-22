---
title: React、Flux以及Redux小结
date: 2018/04/10
tag: [js,react,flux,redux]
category: 技术
---

React和Vue是当下前端最流行的Javascript框架。作为一名现代化前端工程师，学习这两个框架已经成为了标配。
本人学习这两个框架已经有很长一段时间了，当下对其做一些基本概念梳理总结，利人利己。


### Flux

##### Flux是什么

Flux是一种架构思想，专门解决软件结构问题，它和MVC是同一种东西。

##### facebook flux官网描述
```html
Flux is the application architecture that Facebook uses for building client-side web applications. 
It complements React's composable view components by utilizing a unidirectional data flow. 
It's more of a pattern rather than a formal framework, and you can start using Flux immediately without a lot of new code.

（Flux是Facebook用来构建客户端应用程序的web应用程序架构。它是React单向数据流view组件的补充。它更向是一种模式，而不是一种框架，你只需要使用一点点代码就能立即使用它）
```

##### Flux结构组成
```html
View 视图层

Action 动作 比如视图层发出的消息（比如mouseClick）

Dispatcher 派发器 接受Actions，执行回调函数

Store 数据层 用来存放应用状态 Store变动的时候，会触发View更新
```

##### Flux最大的特点就是“数据的单向流动”

```html
1.用户访问View

2.用户触发View发起Action

3.Dispather接收到用户的Action，要求Store进行相应更新

4.Store更新之后通知view更新
```
如图所示：（图片来源:http://www.ruanyifeng.com/）

![avatar](http://www.ruanyifeng.com/blogimg/asset/2016/bg2016011503.png)

##### Flux的应用
Flux是一种架构思想，使用flux就是使用flux的这种思想模式构建程序代码。
使用flux模式构建的代码能够更容易阅读，修改维护更为简单。
当然，通其它结构思想一样（如MVC）引入flux模式必然会需要引入一些其它的代码，一定程度上提升了代码的复杂度。
因此，如果不是项目到达一定的规模，如果不是觉得不用框架开发起来很艰难，那就不需要使用flux框架。


---

### React
React是一个View层框架，用来渲染视图，不直接操作View，想要操作view只能通过修改state来实现
state的改变主要来自两个方面，一个是服务端，另一个是用户行为，其中用户行为占很大一部分。
React每个组件都有一个setState方法用来修改当前的state，所以一般把修改state操作都放在各自的组件中。
但是，随着项目的扩大，业务逻辑越来越复杂，一个state的变化往往对应着多个组件，这样很可能导致混乱。
此时，我们需要一个对state进行统一管理，这也就是Flux出现的原因了。


##### React使用Flux
Flux在React中主要用来集中管理引起state变化的情况，Flux维护着一个或多个Store，（MVC中的Model），Store中存储着应用用到的所有数据。
当Action触发的时候，Flux根据Action在对应Store中经过一系列逻辑处理，更新Store。
当Store发生变化的时候，通常根组件（也可以不是根组件）会去获取新的store，然后更新state，然后利用React的单项数据流的特点一层层的向下传递state以更新view。


##### Redux
Redux的作用和Flux相同，可以看作是Flux的一种实现

当然，Redux既然独立存在，肯定是有其独特之处，同Flux相比，Redux有以下不同。
```html
1.Redux没有 Dispatcher，只有Reducer，Reducer是一个纯函数，它接受两个参数(previousState、action)，返回一个新的state；
  Redux中含有多个reducer，多个reducer通过combineReducers方法合并为一个根reducer，这个根reducer负责维护完整的state；
  当action发起的时候，store会调用dispatch方法，向某个特定的reducer纯函数传递该action，以更新state。

2.Flux有多个store；在store中完成新的state的推导；每一个store都只对对应的view，每次更新都只通知对应的view
  Redux只有一个store；Redux的更新逻辑也不在store中执行，而是放在reducer中；Redux中所有reducer都由根Reducer统一管理，对应一个根View。
```

##### Redux Store 以及 Redux State
Store保存所有的数据，可以将其看做是一个容器。整个应用只能有一个Store
``` javascript
import {createStore} from "redux";

const store = createStore(fn);
```

如果想得到某个时点的数据，就要对Store生成快照。这种时点的数据集合就叫做State
``` javascript
import {createStore} from "redux";

const store = createStore(fn);

const state = store.getState();
```

Redux规定，一个State对应一个View。只要State相同，View就相同。
知道State就能知道View是什么样，反之亦然。

##### Redux Action
Action为View发出的通知，表示State将要发生变化
Action描述当前发生的事情。改变State的唯一办法就是通过Action将数据运送到Store
``` javascript
const action = {
  type: "ADD_TODO", // Action的名称
  payload: "LEARN Redux" // Action携带的字符串信息
};
```

#### Redux Action Creater
定义一个函数，用来自动生成Action，这个函数就叫做Action Creator

``` javascript
const ADD_TODO = "添加 TODO";

function addToDo(text) {
    return {
        type: ADD_TODO,
        text
    }
}

const action = addToDo(Learn Redux);
```

#### Redux store.dispatch()
store.dispatch()是View唯一发出Action的方法

``` javascript
import {createStore} form "redux";

const store = createStore(fn);

store.dispatch({
  type: "ADD_TODO",
  payload: "Learn Redux",
});
```
store.dispatch接受一个Action对象作为参数，将它发送出去

结合Action Creater

``` javascript
store.dispatch(addToDo("Learn Redux"));
```

##### Redux Reducer
Store收到一个Action之后必须给出一个新的State，这样View才会发生变化。
这种State的计算过程就叫做Reducer，Reducer是一个纯函数，它接受Action和当前的State作为参数，返回一个新的State
``` javascript
const Reducer = function(state, action){
  //...
  return new_state;
}
```

##### Redux subscribe()
Store允许使用Store.subscribe方法设置监听函数，一旦State发生变化就自动执行这个函数

``` javascript
import {createStore} from "redux";
const store = createStore(reducer);

store.subscribe(listener);
```

解除监听，store.subscribe方法返回一个函数，调用这个函数即可解除监听

``` javascript
const unsubscribe = store.subscribe(() => 
    console.log(store.getState());
);
unsubscribe();
```

##### Redux Store的实现
Store提供了三个方法

``` javascript
store.getState();

store.dispatch();

store.subscribe();
```

``` javascript
import {createStore} from "redux";
let {subscribe, dispatch, getState} = createStore(reducer);
```

##### Reducer拆分
Reducer负责生成State，由于一个项目只有一个State，导致这个State会非常庞大。
所以，Redux提供了解决方案，那就是将其拆分开来，同时Redux又提供了一个combineReducers方法
用这个方法可以将各个子Reducer合并成一个大的Reducer。

``` javascript
import {combineReducers} form "redux";

const chatReducer = combineReducers(){
    chatLog,
    statusMessage,
    userName
};

export default todoApp;
```

可以将所有的子Reducer放在一个文件里面，然后统一引入

``` javascript
import {combineReducers} form "redux";
import * as reducers from "./reducers";

const reducer = combineReducers(reducers); 
```


##### Reducer工作流程
1.用户发出action
``` javascript
store.dispatch(actioin);
```

2.Store自动调用Reducer，并传入两个参数（当前State和Action）。Reducer会返回新的State
``` javascript
let nextState = todoApp(previousState, action);
```

3.State出现变化之后，Store调用监听函数
``` javascript
store.subscribe(listener);
```
listener可以通过store.getState()获取当前状态。

``` javascript
function listener() {
  let newState = store.getState();
  component.setState(newState);
}
```


---------------------------------------

### 传送门

#### babel官网
<a href="https://babeljs.io/" target="_blank">https://babeljs.io/</a>


#### react官网
<a href="https://facebook.github.io/react/" target="_blank">https://facebook.github.io/react/</a>


#### redux中文文档
<a href="http://cn.redux.js.org/" target="_blank">http://cn.redux.js.org/</a>


#### redux介绍（segmentfault）
<a href="https://segmentfault.com/a/1190000003503338?_ea=323420" target="_blank">https://segmentfault.com/a/1190000003503338?_ea=323420</a>


#### react入门实践
<a href="http://www.jianshu.com/p/808bb43b3744" target="_blank">http://www.jianshu.com/p/808bb43b3744</a>


#### 阮一峰react系列教程
<a href="http://www.ruanyifeng.com/blog/2016/09/react-technology-stack.html" target="_blank" >http://www.ruanyifeng.com/blog/2016/09/react-technology-stack.html</a>

#### imwebRedux文章
<a href="http://imweb.io/topic/57711e37f0a5487b05f325b5" target="_blank">http://imweb.io/topic/57711e37f0a5487b05f325b5</a>



