---
title: 'redux store 设计优化问题'
date: '2019-04-10 17:35:21'
tag: 'React/前端'
path: 'redux-store-design-optimization'
---

## 一张图解释 redux

![redux流程图解](https://www.coyeah.top/source/redux-flow-chart.png)

关于`redux`的入门实践，[github.com 传送门](https://github.com/Coyeah/react-primer#redux---demo10)

## 关于 redux store 设计优化问题的思考

这个问题出现在实际项目开发的时候，存在一个页面配置一个 dva model，或者一个 Nav 配置一个；这样的写法没有特别大的问题，随着项目开发，不免引发性能上的思考。

项目中很多情况是，一个页面就是一个 data list table 的展示，而这些 data 都存放在 redux store 中，但这些数据仅仅用于该页面而不和其他页面共享。

这会导致 redux 承载的数据很多很杂，后期的可维护性和可拓展性变得很差，那针对 redux store 应该如何设计和优化才更加适应工程化和提高项目可拓展可维护性呢？

## 实操

### 设计 store 结构

store 是一个树状结构，因此尽可能的减少嵌套、设计要便于维护并且明确数据类型。

+ 按模块划分，如一个界面的相关数据放在一个树节点中。
+ 尽量扁平，如一级数据为模块而二级数据则存放数据。
+ 显式声明使用不变量类型，这样的目的是为了在协同开发的时候能够明确数据用途。

### redux store 中涉及的性能开销

+ action 触发大量 reducer 的开销。**（redux 在派发一个 action 的时候，需要把所有的 reducer 遍历一次，再出发对应的 action 修改 state）**

+ state 树内存开销。**（其实这个开销并不是特别大）**
+ 通过 connect 连接 store 的 subscript，在 store 改变时被触发的开销。**(事件监听)**
+ 渲染大型虚拟 DOM 的开销。**(这也不是一个大问题，以列表数据为例也很少出现一次性渲染上万条)**

### 关于数据

进行一个单页面应用开发的时候，需要处理数据，分为四类：

+ 页面需要展示的数据；
+ 为获取*#1*所需要的数据（分页筛选的参数等）；
+ 页面相关的状态数据（例如加载、刷新时控制动画等这样一类的交互状态的数据。这三种数据似乎没有共享的需要，存放在 state 是合理的）；
+ 其他（指的是初始化状态的数据，如果在较多的页面中都用到同样的初始化状态的数据，而在每个 state 中保存一份就一点都不工程化了）；

### 设计数据结构

优化 react-redux 存储以实现高性能更新。

```JavaScript
const state = {
  targets: [{id: 'target1', radius: 10}, {id: 'target2', radius: 2}]
};
```

常见的数据存储是以这样的一种方式，而渲染也是用 `Array.map` 的方式对数组进行遍历。

```JavaScript
const TargetsList = connect(state => ({targets: state.targets}))(
  ({ targets }) =>
    <ul>
      { targets.map((target) => <TargetView key={target.id} target={target} />) }
    </ul>
);
```

而这样的不难发现会有一个问题，`TargetView` 是一个哑组件，来什么数据就渲染什么数据，没有任何话语权。只要修改数据中任意一个对象的其中一个属性，整个列表都会被重新渲染一次。每次更新列表跟着一同更新，而这样对于渲染的性能开销就存在问题了。

如何优化？

```JavaScript
const state = {
  targetsOrder: ['id-1', 'id-2'],
  targets: {
    'id-1': { id: 'id-1', radius: 10 },
    'id-2': { id: 'id-2', radius: 20 },
  }
};

const TargetsList = connect(state => ({targetsOrder: state.targetsOrder}))(
  ({ targetsOrder }) =>
    <ul>
      { targetsOrder.map((id) => <TargetView key={id} targetId={id} />) }
    </ul>
);

const TargetView = connect(
  (state, ownProps) => ({target: state.targets[ownProps.targetId]})
)(({ target }) => {
  // your render logic
  return <Circle radius={target.radius} />;
});
```

把数据获取逻辑抽离出来，用 Set 保存 key 值，而用 Map 保存具体数据。一来无需每次遍历数组对象，二来获取数据内容的途径不再是数据遍历后赋值给子组件。运行效率会比之前的模式快10倍。

### 借助 immutableJs

immutable 不可变数据其实本质上还是为了减少相同数据导致重复渲染的问题。

## 总结

回归一开始遇到的问题，不管三七二十一把所有通过接口获取的数据都存放在 redux store 中是一个错误的做法。按照页面或者 Nav 来划分在 store 的存储空间，其实很多数据也仅仅被一个页面所使用。无形的增大了 redux 的开销。

尽可能的扁平与减少嵌套，**被多个组件所依赖或者影响的状态** 放入 redux store。根据具体业务的复用程度来划分 Redux Store 的模块，结合数据结构和算法，来解决设计优化的问题。

如果什么不对的地方，联系我指正我，大家一起交流学习！
