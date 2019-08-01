| 题目                | 创建时间            | 标签  |
| ------------------- | ------------------- | ----- |
| React组件的生命周期 | 2018-06-13 21:04:44 | React |

------

## React组件的生命周期可分为三个状态：

挂载、更新、卸载。

* Mounting: 已插入真实DOM;
* Updating: 正在被重新渲染;
* Unmounting: 已移除真实DOM;

## React组件的生命周期函数

### 挂载

组件初始化

**componentWillMount**

在组件渲染之前调用，在客户端也在服务端。

**componentDidMount**

在第一次渲染后调用，只在客户端。之后组件会生成对应的DOM结构，可以在这个时候进行异步操作等。

### 更新

当组件属性修改导致需要重新渲染

**componentWillReceiveProps**

在组件接收到一个新的prop时被调用。

**componentShouldUpdate**

返回一个布尔值。在组件接收到新的prop或者state时被调用。判断是否需要重新渲染组件。

**componentWillUpdate**

接收到新的prop或者state后，在组件重新渲染之前调用。

**componentDidUpdate**

在组件重新渲染之后立即调用。

### 卸载

组件销毁或清理

**componentWillUnmount**

在组件从 DOM 中移除的时候立刻被调用。

## 服务器数据请求

当需要想服务器请求数据，获取组件所需的数据时，最合适的地方是在componentDidMount函数中进行数据请求。

## setState的时机

可用的函数：componentWillMount、componentDidMount、componentWillReceiveProps、componentDidUpdate

而在其他生命周期函数调用setState会导致两种结果：产生死循环或者无意义。

## render次数 != 浏览器界面更新次数

