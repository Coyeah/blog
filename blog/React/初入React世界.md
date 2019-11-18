| 题目          | 创建时间            | 标签  |
| ------------- | ------------------- | ----- |
| 初入React世界 | 2018-04-27 17:05:37 | React |

------

## React 特点

1. 组件化，JSX自定义标签，便于抽象化。
2. 通过虚拟DOM和Diff算法隔离DOM操作。
3. 采用单向数据流，数据流动方向单一，可跟踪。

## React 组件构建

> React的所有组件都继承自顶层类React.Component。它的定义非常简洁，只是促使话了React.Component方法，声明了props、context、refs等，并在原型上定义了setState和forceUpdate方法。内部初始化的生命周期方法与createClass方法使用的是同一个方法创建的。————『深入React技术栈』

`React.createClass()`已被React最新版本抛弃。用ES6的class还是最方便的。

```JavaScript
import React, { Component } from 'react';

class Button extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    color: 'blue',
    text: 'Confirm',
  };

  render() {
    const { color, text } = this.props;

    return (
      <button className={`btn btn-${color}`}>
        <em>{text}</em>
      </button>
    );
  }
}
```

## React 数据流

### state (状态)

**state是组件对内的接口**

state改变，界面重新渲染。

setState，异步方法，用于更新state

两种不同视角：

* 智能组件 (Smart Component) ：内部更新
* 木偶组件 (Dumb Component) ：外部更新

// React官方建议把state当作不可变对象，一方面是如果直接修改this.state，组件并不会重新render；另一方面state中包含的所有状态都应该是不可变对象。当state中的某个状态发生变化，我们应该重新创建一个新状态，而不是直接修改原来的状态。

### props (属性)

**props是组件对外的接口**

用于组件间相互联系的一种机制。类似方法的参数，父级向子级。

* 子组件 prop

children，代表组件的子组件集合。通过React.Children.map方法遍历子组件，还有forEach、count等API。

```JavaScript
<ul 
  children={[
    <li>1</li>,
    <li>2</li>,
    <li>3</li>,
  ]}
>
</ul>
```

* 组件 props

获取标签内定义的属性来做简单配置和自定义配置。

* 用function prop与父组件通信

通过回调函数实现组件间的通信。

* propTypes

用于规范props类型与必要状态

```JavaScript
static propTypes = {
  classPrefix: PropTypes.string,
  activeIndex: PropTypes.number,
  onChange: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  disable: PropTypes.bool,
  order: PropTypes.string.isRequired,
}
```

### refs (参考)

虚拟DOM上的`Click`/`KeyDown`/`Copy`/`Scroll`等事件操作是没有意义的。ref指向真实DOM节点进行事件操作。

`<input type="text" ref="myTextInput" />`

`this.refs.myTextInput.focus();`

## 学习之路

Github项目：[https://github.com/Coyeah/react-tabs](https://github.com/Coyeah/react-tabs)
参考文章：[React 入门实例教程](http://www.ruanyifeng.com/blog/2015/03/react.html)

## 遇到的问题

### #React/Error: Minified React error #130

低级错误; 缺少导入。

**解决方法：**

`export default App;`

### #Module build failed: SyntaxError Unexpected token

使用`static defaultProps`生成默认的props。

```JavaScript
static defaultProps = {
  name: 'React defaultProps demo',
}
```

如果babel设置为es6的转码方式，会报错。因为定义静态属性不属于es6，而在es7的草案中。es6的class中只有静态方法，没有静态属性。加入stage-0后就能尝试es7语法了，static也能在class内部定义属性了。

**解决方法：**

设置babel为es7转码方式，安装babel-preset-stage-0

`npm install --save-dev babel-preset-stage-0`

配置根目录下的`.babelrc`文件

```Json
{
  "presets": ["es2015","react","stage-0"]
}
```

### #Cannot read property 'string' of undefined

在之前的版本可以通过React.PropTypes这个API来访问React内置的一些类型来检查props，后来这一API被独立成了一个新的包prop-types

**解决方法：**

安装并引用prop-types

`cnpm install --save prop-types`

### #make me crary!?

我也不知道为什么。

这个，是我手打的。

```JavaScript
<Tabs defaultAcitveIndex={this.state.activeIndex} className="tabs-bar">
  <TabPane order="0" tab={'Tab 1'}>第一个 Tab 里的内容</TabPane>
  <TabPane order="1" tab={'Tab 2'}>第二个 Tab 里的内容</TabPane>
  <TabPane order="2" tab={'Tab 3'}>第三个 Tab 里的内容</TabPane>
</Tabs>
```

这个，是教材的源码。

```JavaScript
<Tabs defaultActiveIndex={this.state.activeIndex} className="tabs-bar">
  <TabPane order="0" tab={'Tab 1'}>第一个 Tab 里的内容</TabPane>
  <TabPane order="1" tab={'Tab 2'}>第二个 Tab 里的内容</TabPane>
  <TabPane order="2" tab={'Tab 3'}>第三个 Tab 里的内容</TabPane>
</Tabs>
```

找不同？

就这一小段，我手打的，没有效果。教材源码，就有效果。

谁能告诉我为什么！