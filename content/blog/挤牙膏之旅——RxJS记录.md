---
title: '挤牙膏之旅——RxJS记录'
date: '2019-08-08 13:03:30'
tag: 'React/前端'
path: 'rxjs-learning-record'
---

## WHAT

看看谷歌对 `RxJS` 的（枯燥的）定义：

> RxJS is a library for reactive programming using Observables, to make it easier to compose asynchronous or callback-based code.【RxJS 是一个使用 Observables 进行反应式编程的库，可以更容易地组合一步或基于回调的代码。】
>
> …...Balabalabala…...
>
> Reactive programming is just a different way of building software applications. Essentially, your software is built to “react” to changes that happen, instead of the typical way of writing software where we explicitly write code (aka “imperative” programming) to handle those changes.【反应式编程知识构建软件应用程序的另一种方式。从本质上讲，您的软件是为了对发生的变化作出“反应”，而不是编写程序的典型方式，我们明确地编写代码（也就是“命令式”编程）来处理这些变化。】
>
> …...Balabalabala…...
>
> One of the most attractive features of integrating RxJS into your code base is that the more you use it, the more you can do with it.【将RxJS集成到代码库中最吸引人的特性之一就是使用它越多，你可以做的就越多。】

解释了一大堆，还是不知道 RxJS实际做了什么。

### 有几个重要的概念需要理解

+ Observable可观察对象：表示一个可调用的未来值或者事件的集合。
+ Observer观察者：一个回调函数集合,它知道怎样去监听被Observable发送的值
+ Subscription订阅： 表示一个可观察对象的执行，主要用于取消执行。
+ Operators操作符： 纯粹的函数，使得以函数编程的方式处理集合比如:map，filter，contact，flatmap。
+ Subject(主题)：等同于一个事件驱动器，是将一个值或者事件广播到多个观察者的唯一途径。
+ Schedulers(调度者)： 用来控制并发，当计算发生的时候允许我们协调，比如setTimeout，requestAnimationFrame。

换种说法，在一个 Web 页面中，点击一次按钮，触发了一次点击事件；点击两次，自然触发了两次点击事件；周而复始，疯狂点击。那么 RxJS 关注的就是 `事件源自事件的事件（点击的动作）` 以及 `事件需要完成的事件（预设点击后页面给出的反应）`。

![典型的Observable](https://www.coyeah.top/source/rxjs_observable.png)

与观察者模式相似，RxJS 中的 Observable（观察）可以被认为是随着时间的推移而填充的数组或者流。每次对事件“数组” push 一个新事件的时候，触发指定的操作。故此我们的程序中所有事件都具有相对应的 Observable，它确切地知道如何处理相应的事件，我们从传统转变为数据和视图之间更加活跃的关系，从主动变为被动。

RxJS 的流式结构 = 观察者模式 + 迭代器模式。

**Observable**其实就是数据流**stream**。**流**是在时间流逝的过程中产生的一系列事件，它具有事件与事件响应的概念。

我们可以把一切的输入都当作数据流来处理，例如用户操作、网络响应、定时器、Worker。

### Pull（拉取） & Push（推送）

拉和推是数据产生者和数据消费者的两种不同的交流协议（方式）。

在 `Pull体系` 中，数据消费者决定合适从数据产生者那里获取数据，而产生者本身不会意识到什么时候数据会被发送到消费者手上。这是我们比较常用的方式，函数就是 `Pull体系` 的一个表现，函数就是数据的生产者，调用函数就是一个拉取一个返回值/数据（return）给消费者。

`Push体系` 是由数据生产者来决定何时发送数据给消费者，消费者不会在接收到数据之前意识到它将要接收这个数据。Promise 是最常见的 `Push体系`，一个 Promise 发送一个 resolve 来注册一个回调函数（数据消费者），但是不同函数的地方在于：Promise 决定何时数据才被推送至这个回调函数。

RxJS 引入的 Observable 是一个全新的 `Push体系`，一个可观察者对象是一个产生多值的生产者，并 Push 给 Observer。

#### RxJS 与 Promise 的不同

|点|RxJS|Promise|
| --- | --- | --- |
|动作是否可以取消|是|否|
|是否可以发送多个值|是|否|
|各种工具函数|是|否|

## WHY

RxJS 在处理异步操作上有着很出色的表现，异步存在的问题：

+ 竞态条件（Race Condition）

> 每当我们对同一个资源同时做多次的非同步存取时，就可能发生Race Condition 的问题。比如说我们发了一个Request 更新使用者资料，然后我们又立即发送另一个Request 取得使用者资料，这时第一个Request 和第二个Request 先后顺序就会影响到最终接收到的结果不同，这就是Race Condition。

+ 记忆体泄漏（Memory Leak）

> 做SPA (Single Page Application)网站时，我们是透过JavaScript来达到切换页面的内容，这时如果有对DOM注册监听事件，而没有在适当的时机点把监听的事件移除，就有可能造成Memory Leak。比如说在A页面监听body的scroll事件，但页面切换时，没有把scroll的监听事件移除。

+ 复杂的状态（Complex State）

> 有一支付费用户才能播放的影片，首先可能要先抓取这部影片的资讯，接着我们要在播放时去验证使用者是否有权限播放，而使用者也有可能再按下播放后又立即按了取消，而这些都是非同步执行，这时就会各种复杂的状态需要处理。

+ 例外处理（Exception Handling）

> JavaScript 的try/catch 可以捕捉同步的例外，但非同步的程序就没这么容易，尤其当我们的异步行为很复杂时，这个问题就愈加明显。


## HOW

[源码地址](https://github.com/Coyeah/rxjs-react-demo)

## 请求中的节流与防抖

对于流有了基本的概念，但是发现单纯的使用 RxJS 融入 React 在网络上的 demo 少的可怜。不是通过 `document` 绑定事件，就是 `redux-observable`。一条筋的我就想，我就只想使用 RxJS 来完成对事件的绑定和流的传递，所以瓶颈塞了巨久。

从一个突破口开始吧——节流与防抖

### 节流 Throttle

> 规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。

`underscore` 和 `lodash` 都提供了节流函数处理我们的需求，效果相同，上代码！

```jsx
import * as _ from 'underscore';
// import * as _ from 'lodash';

class Autodata extends PureComponent {
  construcotr(props) {
    super(props);
    this.handleInputThrottle = _.throttle(this.handleInput, 500);
  }
  handleInput = (e) => {
    const value = e.target.value;
    // do something else
  }
  render() {
    return (
    	<div>
      	<input onChange={this.handleInputThrottle} />
      </div>
    )
  }
}
```

RxJS 提供了一个节流运算符来实现需求。

```jsx
import { BehaviorSubject, of } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

class Autodata extends PureComponent {
  constructor(props) {
    super(props);
  	// 初始化一个 Subject，作为观察主体
    this.inputStream = new BehaviorSubject();
  }
  // 订阅处理方式
  componentDidMount() {
    this.inputStream
      .pipe(throttleTime(1000))
    	.subscribe(value => {
				// do something else
    	});
  }
  render() {
    return (
    	<div>
      	<input onChange={e => this.inputStream.next(e.target.value)} />
      </div>
    )
  }
}
```

#### 防抖 Debounce

> 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。

依旧是 `underscore` 和 `lodash` 的实现。

```jsx
import * as _ from 'underscore';
// import * as _ from 'lodash';

class Autodata extends PureComponent {
  construcotr(props) {
    super(props);
    this.handleInputDebounce = _.debounce(this.handleInput, 500);
  }
  handleInput = (e) => {
    const value = e.target.value;
    // do something else
  }
  render() {
    return (
    	<div>
      	<input onChange={this.handleInputDebounce} />
      </div>
    )
  }
}
```

RxJS again.

```jsx
import { BehaviorSubject, of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

class Autodata extends PureComponent {
  constructor(props) {
    super(props);
  	// 初始化一个 Subject，作为观察主体
    this.inputStream = new BehaviorSubject();
  }
  // 订阅处理方式
  componentDidMount() {
    this.inputStream
      .pipe(debounceTime(1000))
    	.subscribe(value => {
				// do something else
    	});
  }
  render() {
    return (
    	<div>
      	<input onChange={e => this.inputStream.next(e.target.value)} />
      </div>
    )
  }
}
```

### 结合 recompose

> A React utility belt for function components and higher-order components.

`recompose` 被视为 React 版的 lodash，随着 react hooks 的推广，React 的函数式开发越来越受欢迎，函数组件更清晰，更短，更易于阅读，也没有必要使用this关键字。同时 recompose 也失宠了，因为它更专注于处理 HOC 高阶组件。

但是当中的 `Observable utilities` 对于结合 RxJS 有很好的帮助。Go ahead！

#### 0、让组件“流”起来

```jsx
import { componentFromStream } from 'recompose';
import { map } from 'rxjs/operators';

const App = componentFromStream(prop$ => {
  
  return prop$.pipe(
  	map(props => (
      <div>Hello World!</div>
    ))
  );
})
```

#### 1、处理一个事件

导入 `createEventHandler`，用于处理事件，handler 作为一个发射器对事件作一个监听，推送至 stream 中。

```jsx
const App = componentFromStream(prop$ => {
  const { handler, stream } = createEventHandler();

  return prop$.pipe(
    map(() => (
      <div>
        <input
          onChange={handler}
          placeholder="GitHub username"
        />
      </div>
    ))
  )
});
```

再导入一些处理流的工具函数：

```jsx
import { combineLatest } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
```

实现代码如下：

```jsx
const App = componentFromStream(prop$ => {
  const { handler, stream } = createEventHandler();
  const value$ = stream.pipe(
    map(e => e.target.value),
    startWith('')
  );

  return combineLatest(prop$, value$).pipe(
    tap(console.warn),
    map(([props, value]) => (
      <div>
        <input
          value={value}
          onChange={handler}
          placeholder="GitHub username"
        />
      </div>
    ))
  )
});
```

`combineLatest` 是创建方法，用于把 `prop$` 和 `values$` 两个流合成一个。其他更多的工具类使用方法可以从[官网](https://rxjs-dev.firebaseapp.com/api)上查得到。

#### 2、在请求上做文章

RxJS 有一个 ajax 的方法提供请求操作，流式编程的好处就如同 Promise，同步的方式来操作异步。

```jsx
const User = componentFromStream(prop$ => {
  const loading$ = of(<h3>Loading...</h3>);
  const getUser$ = prop$.pipe(
    debounceTime(1000),
    pluck('user'),
    filter(user => user && user.length),
    map(formatUrl),
    switchMap(url => 
      merge(
        loading$,
        ajax(url).pipe(
          pluck('response'),
          map(UserCard),
          catchError(error => of(<Error {...error} />))
        )
      )
    )
  );
  return getUser$;
});
```

+ pluck：挑取对象中指定对象属性的数据。
+ debounceTime：防抖的定时操作。
+ merge：合并两个流，组成一个新流。
+ catchError：捕获异常情况。

这只是简单的把这段代码做了个小总结，[作者的博文](https://www.freecodecamp.org/news/how-to-build-a-github-search-in-react-with-rxjs-6-and-recompose-e9c6cc727e7f/)讲述的更为详细。

### 结合 rxjs-hooks

那么问题来了。如果不使用流式组件，如何在 React 使用 RxJS 呢？答案就是：[rxjs-hooks](https://github.com/LeetCode-OpenSource/rxjs-hooks)。

主要提供了两个方法：**useObservable** & **useEventCallback**。

+ useObservable：把流结构的值转换为 JS 基本数据类型，类似于 mobx 的 toJS 方法。
+ useEventCallback：类似于 `useState`，返回一个方法和值，主要是对事件做监听和处理。

## 总结

探索 `RxJS` 有段时日了，实用和记录像挤牙膏一样难搞。在把 DEMO 写出来以后，突然会想这样子代码层面上的流式编程，用 pull 体系的操作都能够实现，为啥写起来有一种多此一举的感觉。慢慢的明白到，这是一种编程思想，就像使用 Promise 的时候也不会有什么不适感，那 RxJS 也应该如此，毕竟相比 Promise 有优势。

[Demo 地址](https://github.com/Coyeah/rxjs-react-demo)
