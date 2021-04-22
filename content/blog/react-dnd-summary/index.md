---
title: react-dnd 小结
date: "2019-08-08T05:03:30.000Z"
description: 
---

react-dnd 是 react 的一个拖拽插件，在 react 升级了 hooks 功能后也配置了一系列拖拽功能的自定义 hooks。[官网地址](https://github.com/react-dnd/react-dnd/)

回看以前使用 react-dnd 感觉比较复杂，因为要声明 `collect`、`source`、`target` 然后往 `DragSource` \ `DropTarget` 里塞。无论是用装饰器还是柯里化，代码乍眼一看小复杂的（真正使用的时候又不是这回事的感觉）。

## 本文 demo

[react-primer/demo15](https://github.com/Coyeah/react-primer/tree/master/demo15)

多多支持一下 Start 一下！感谢

## 用法小解

### useDrag

```jsx
const DraggableComponent = (props) => {
  const [collectedProps, drag, preview] = useDrag({
    item: { id, type },
    collect: monitor => ({ ... })
  });
  return (
    <>
    	<DragPreviewImage connect={preview} src={ ... } />
    	<div ref={drag}>{props.children}</div>
  	</>
  )
}
```

返回的参数：

+ `index 0`: 收藏家，从 `useDrag` 传参中的 `collect` 属性返回的对象都会放入收藏家中，如果没有定义 `collect` 则会返回一个控对象，所以是一一对应的。
+ `index 1`: 一个 `drag source` 元素，放置到 div 的 ref 中就会让该元素被拖拽起来。
+ `index 2`: 一个 `drag preview` 元素，用作于被拖拽起来后跟随鼠标的视图所展示的内容。联合 `DragPreviewImage` 组件一起使用的。

初始化传参的部分内容：

+ `item`: 通行证，拖拽内容的标示，通常以 `{ type, id }` 为主要内容，官方不建议存放太多内容，因为每一点点拖拽都要疯狂传递，内容多了就大了，影响性能。
+ `begin(monitor)`: 开始拖拽时会调用。
+ `end(item, monitor)` : 结束拖拽时会调用
+ `canDrag(monitor)`: 用它来限定当前是否允许拖动。如果您想要始终允许它，只需省略此方法即可。
+ `isDragging(monitor)`: 默认情况下，仅启动拖动操作的拖动源被视为拖动。
+ `collect`: 下文解释。

解释得比较笼统，详情请看[官方解释](https://react-dnd.github.io/react-dnd/docs/api/use-drag)。

### useDrop

```jsx
const DropTarget = (props) => {
  const [collectedProps, drop] = useDrop({
    accept,
    collect: monitor => ({ ... })
  });
    return <div ref={drop}>Drop Target</div>
}
```

返回的参数：

+ `index 0`: 收藏家 again～
+ `index 1`: 一个 `drop source` 元素，让 `drag source` 对象可以放置的作用，放置到 div 的 ref 就会起作用了。

初始化传参的部分内容：

+ `accept`: 一个 string 或者 symbol，放置 `drag source` 中通行证  `item` 中 type 的内容，表示允许哪种类型的 `drag source` 放下。
+ `drop(item, monitor)`: 当放置元素被拖拽元素放下的时候调用，你可以返回 undefined 或者一个普通函数。如果返回一个普通函数，这个结果会在 `monitor.getDropResult()` 函数的的结果呈现。如果你希望根据接收到的目标不同而作出不同的反应，This is useful！如果你是嵌套的放置元素，可以通过 `monitor.didDrop()` 和 `monitor.getDropResult()` 来进行对比判断是否放置到你所想要的位置。如果 `canDrop()` 返回的是false 就不会调用这些方法哟。
+ `hover(item, monitor)`: 当拖拽元素被拖到放置元素上方的时候，即悬停，就会被调用，而且是疯狂调用哟，反正就是不断触法触发触法的。可以通过 `monitor.isOver({ shallow: true })` 来检测一下悬停是仅发生在当前目标上还是发生在嵌套目标上。即是 `canDrop()` 返回为 false 也会调用。
+ `canDrop(item, monitor)`: 用它来限定是否接收这个孤独的拖拽元素。如果您想要始终允许它，只需省略此方法即可。
+ `collect`: 下文解释要来了。

详情再次请看[官方解释](https://react-dnd.github.io/react-dnd/docs/api/use-drop)

### collect

`collect` 放置的是一个方法函数，调用后的返回内容就会给到收藏家。函数的参数为 `monitor`。它是一个 `DragSourceMonitor` 的实例，包含以下的方法。

+ `canDrag()`: 是否可以被拖拽。如果没有正在进行拖动操作，则返回 true。
+ `isDragging`: 是否正在被拖动。如果正在进行拖动操作，则返回 true。
+ `getItemType()`: 返回标识当前拖动项的类型的字符串或ES6符号。 如果没有拖动项目，则返回 `null`。
+ `getItem()`: 返回表示当前拖动项的普通对象。 每个拖动源都必须通过从其beginDrag（）方法返回一个对象来指定它。 如果没有拖动项目，则返回 `null`。
+ `getDropResult()`: 返回表示最后记录的放置 `drop result` 对象。
+ `didDrop()`: 如果某个 `drop target` 处理了 `drop` 事件，则返回 true，否则返回 false。即使 `target` 没有返回 `drop` 结果，`didDrop()` 也会返回true。 在 `endDrag()` 中使用它来测试任何放置目标是否已处理掉落。 如果在 `endDrag()` 之外调用，则返回 false。
+ `getInitialClientOffset()`: 返回当前拖动操作开始时指针的{x，y} `client` 偏移量。 如果没有拖动项目，则返回 `null`。
+ `getInitialSourceClientOffset()`: 返回当前拖动操作开始时 `drag source` 组件的根DOM节点的{x，y}`client` 偏移量。 如果没有拖动项目，则返回 `null`。
+ `getClientOffset()`: 拖动操作正在进行时，返回指针的最后记录的{x，y}`client` 偏移量。 如果没有拖动项目，则返回 `null`。
+ `getDifferenceFromInitialOffset()`: 返回当前拖动操作开始时鼠标的最后记录 `client` 偏移量与 `client` 偏移量之间的{x，y}差异。 如果没有拖动项目，则返回 `null`。
+ `getSourceClientOffset()`: 返回 `drag source` 组件的根DOM节点的预计{x，y} `client` 偏移量，基于其在当前拖动操作开始时的位置以及移动差异。 如果没有拖动项目，则返回 `null`。

官方地址：[DragSourceMonitor](https://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor) & [DropTargetMonitor](https://react-dnd.github.io/react-dnd/docs/api/drop-target-monitor)

### DndProvider & HTML5Backend

> The DndProvider component provides React-DnD capabilities to your application. This must be injected with a backend via the `backend`prop, but it may can be injected with a `window`object.

这句话真的翻译不不过来了，水平有限，如果没有被这个东西包裹的话，就会报错，有点像 redux 需要有 Provider 包裹作全局效果吧。就是为了启用 react-dnd 的效果，提供上下文和注入场景这样子的，欢迎斧正哈。

```jsx
import HTML5Backend from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

export default class YourApp {
  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        /* Your Drag-and-Drop Application */
      </DndProvider>
    )
  }
}
```

### 最后没有尝试的两个

+ Handles and Previews: [提供拖拽手柄和拖拽预览的两个例子](https://react-dnd.github.io/react-dnd/examples/customize/handles-and-previews)
+ Custom Drag Layer: [拖拽区域的一个用法](https://react-dnd.github.io/react-dnd/examples/drag-around/custom-drag-layer)

官方例子很详尽。

## 参考链接

附上两个事例，不使用 hooks 的 dnd。

+ [拖拽组件：React DnD 的使用](https://juejin.im/post/5aebbdedf265da0ba469a56f)
+ [使用React DND 完成一个简单的卡片排序功能](https://juejin.im/post/5aebbdedf265da0ba469a56f)

