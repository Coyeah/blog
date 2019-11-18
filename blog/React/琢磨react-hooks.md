| 题目            | 创建时间            | 标签        |
| --------------- | ------------------- | ----------- |
| 琢磨react-hooks | 2019-06-18 18:45:30 | React/hooks |

------

`React v16.8` 推出了 `hooks` 的新功能。抱着多学习多种树的心里来琢磨琢磨 hooks。什么是 hooks？是针对函数组件的特殊功能，解决的问题是状态共享。那如果 hooks 玩得好是不是没 redux 什么事了？

# 函数组件区别 class 组件

从代码上看出区别：

```JavaScript
// class 组件
class ExampleClass extends React.Component {
  componentWillMount() {...}

  componentDidMount() {...}
  
  componentWilllUnmount() {...}
  
  render() {...}
}

// 函数组件
const ExampleFunc = (props) => {
  return () {...}
}
```

除了写法上的区别以外，就是函数组件缺少了对于[React 生命周期](https://www.coyeah.top/2018/06/13/React%E7%BB%84%E4%BB%B6%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F/)上的控制，所以函数组件通常用作展示组件，不会给他赋予一些业务逻辑的操作。hooks 的出现，函数组件可以有自己的内置状态和控制生命周期的能力，那 class 组件也好像没它什么事了？

使用 React Hooks 相比于从前的类组件有以下几点好处：

+ 代码可读性更强，原本同一块功能的代码逻辑被拆分在了不同的生命周期函数中，容易使开发者不利于维护和迭代，通过 React Hooks 可以将功能代码聚合，方便阅读维护。
+ 组件树层级变浅，在原本的代码中，我们经常使用 HOC/render props 等方式来复用组件的状态，增强功能等，无疑增加了组件树层数及渲染，而在 React Hooks 中，这些功能都可以通过强大的自定义的 Hooks 来实现。

函数组件迫使你思考最佳实践。这是最重要的一点。组件的主要职责是 UI 渲染，理想情况下，所有的组件都是展示性组件，每个页面都是由这些展示性组件组合而成。

更多介绍可以看看*参考资料*

+ [官网介绍](https://reactjs.org/docs/hooks-intro.html)
+ [一篇看懂 React Hooks](https://zhuanlan.zhihu.com/p/50597236)
+ [精读《Function VS Class 组件》](https://github.com/dt-fe/weekly/blob/master/95.%E7%B2%BE%E8%AF%BB%E3%80%8AFunction%20VS%20Class%20%E7%BB%84%E4%BB%B6%E3%80%8B.md)

# 在学习过程中对部分 hooks 功能的自我理解

先抛出 [github 上的 demo](https://github.com/Coyeah/react-primer#Hooks---demo14)。

## useCallback

从前写代码的时候并不以为然。组件中的 props 变化导致组件触发重新渲染。

```JavaScript
<Component onClick={() => {...}} />
```

解决办法：

+ 抽离变量，用变量复制，props 的指向不变。
+ 通过 this 存储函数，属于 class 组件的用法。
+ useCallback

通过 useCallback 获取一个`记忆体函数`，避免重新定义带来的不必要的重渲染。

何为记忆体函数？由于函数组件本质就是函数，每一次调用就是一次函数的运行，而运行函数，这个函数作用域内的所有变量都重新定义，新的函数新的作用域新的定义变量，重新定义变量，props 的指向就变了，就违背了解决不必要渲染的目的。而记忆体函数就是让这个变量在函数运行的时候不要重新定义，变量指向不变，就解决问题了。

### useCallback 与 useMemo

`useCallback`所得的是一个记忆体函数，而`useMemo`所获取的是一个结果，即 return 的内容。

## useRef

> Refs 提供了一种方式，允许我们访问 DOM 节点或在 render 方法中创建的 React 元素

函数组件中也是没有办法操控 ref 的，通过 useRef 返回的值传递 `组件/DOM` 的 ref 属性又完美解决问题。*可通过 `ref.current` 访问 DOM 节点*，*useRef 创建的是一个引用*。

利用 useRef 规避了 capture value 特性。

*capture value*: 在我们使用 setTimeout 的时候，当中所有获取的值都是捕获当时的值，而并非最新值。也就是说，当按下一个按钮调用了 setTimeout 的时候（假设延迟 10 秒运行），而这期间对 state 的值无论怎么改变，都不会影响 setTimeout 的函数。*[参考资料：理解 React Hooks 的 Capture Value 特性](https://segmentfault.com/a/1190000018685253)*

## useLayoutEffect 与 useEffect

无论 useLayoutEffect 还是 useEffect 都是对应 ComponentDidMount、ComponentDidUpdate 以及 ComponentWillUnmount 的生命周期，在组件 render 后触发副作用。而其区别在于执行时机不同，useLayoutEffect 是在浏览器读取 DOM 事件时开始运行，在计算一个组件高宽并展示时可以得到更快的响应。而 useEffect 则需要 render 完全完成才开始运行。

```JavaScript
useEffect:                         start -------- end
                    读取 DOM --------> 渲染至页面 --------> render
useLayoutEffect:      start -------- end
```

*[参考资料：精读《useEffect 完全指南》](https://github.com/dt-fe/weekly/issues/138)*

## useImperativeHandle 与 forwardRef

官方代码：

```JavaScript
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

useImperativeHandle 与 forwardRef 是结合使用的，通俗来讲，效果其实就是让父组件通过 ref 来操纵 子组件中的节点，并且可以规定了父组件能够控制的方法。

useImperativeHandle 第一个参数指向父组件传入的 ref，第二个参数（函数）返回一个对象，创建出给父组件开放的 ref 方法。

而 forwardRef 则是让子组件可以获取传下来的 ref。`function Comonent (props, ref) { ... }`

# 小结

呃嗯~~没想好该结啥子结论，继续学习。