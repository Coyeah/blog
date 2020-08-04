---
title: '用hooks来状态管理&解读hox'
date: '2019-11-08 16:50:30'
tag: 'React/hooks'
path: 'use-hooks-for-state-management'
---

有想过这个问题，hooks的出现是否能够取缔传统的状态管理方式，如redux和mobx，寻思着不通过context的方式做全局处理（context + useReducer实现了redux的方式，还是偏炒冷饭），结果在github上就看到了[hox](https://github.com/umijs/hox)，实现效果正是所想，佐证了我思路还是正确的～

代码很简短，细细品。

## 前菜

Container，数据存储容器，用于数据分发，观察者模式的设计模式。

```javascript
class Container {
	constructor(hook) {}
  subscribers = new Set();
	data;
	
	notify() {
		for (const subscriber of this.subscribers) {
			subscriber(this.data);
    }    
	}
}
```

Executor，直译执行者，无论 `mobx` 还是 `redux` 都是用根节点上的 context 作为数据存储点，而在 hox 上则是用 `<Executor />` 组件作为数据存储点。

```jsx
/*
	Executor 作为一个组件，但是返回 null，实际仅仅是调用hooks和更新触发。
 */
function Executor (props) {
	const data = props.hook();
  props.onUpdate(data);
  return null as React.ReactElement;
}
```

## 主菜

```javascript
function createModel (hook) {
	const element = document.createElement('div'); // 创建一个 div 节点
  const container = new Container(hook); // 创建一个数据存储容器
  // 把组件渲染到 div 节点上，但是这个 div 节点并没有出现在实际的 html 树上
  // 奇妙点就在这，这并不影响整体的页面效果，但是在虚拟层面上做了数据的存储处理，这个 div 存在于内存，React的虚拟 dom 中。
  ReactDOM.render(
  	<Executor
			onUpdate=(val => {
				container.data = val;	// 保存新的 data 值
    		container.notify(); // 分发数据给订阅者
    	})    
      hook={hook}
    />,
    element
  ); // <====== 撒冷 / 天空城
  // useModel 是用在业务页面，但是中间逻辑是链接到”撒冷“上的。相当于传输管道，从“天空城”拿下数据，业务页面使用和操作。
	const useModel = depsFn => {
		const [state, setState] = useState(
    	container ? container.data : undefined
    ); // 主存储
  	const depsFnRef = useRef(depsFn); // 依赖方法，传入新数据，传出{} / []，与 hooks 方法的第二个参数类似，不过这个是一个 function
    depsFnRef.current = depsFn;
    const depsRef = useRef([]); //
    useEffect(() => {
      if (!container) return;
      // 这个方法作用在于，当”撒冷“上的数据发生改变，发送新数据到订阅者上时，这个作用在业务页面上的 useModel 需要作出响应来改变存储值，相当于一个拉取数据的操作。
      function subscriber(val) {
        if (!depsFnRef.current) {
          setState(val);
        } else {
          const oldDeps = depsRef.current; 
          const newDeps = depsFnRef.current(val);
          if (compare(oldDeps, newDeps)) { // 新老依赖的浅比较，判断是否更新数据
            setState(val);
          }
          depsFn.current = newDeps;
        }
      }
      container.subscribers.add(subscriber); // 添加订阅，数据改变则触发该方法
      return () => {
        container.subscribers.delete(subscriber); // 组件重新渲染时需要取消订阅，详见 useEffect。
      }
		}, [container]);
  	return state;
  };
  Object.defineProperty(useModel, 'data', {
    get: function () {
      return container.data; 
    }
  }); // 添加 data 属性，便于数据获取。
	return useModel;
}
```

## 甜品

简单的demo。

```javascript
// model.js
const useId = () => {
  const [state, set] = useState(generateUUID());
  const reset = () => {
    set(generateUUID());
  }
  return { id: state, reset }
};
```

```javascript
// page 1
const Page1: React.FC = () => {
  const {
    id, reset
  } = useId();
  return (
    <>
      <div>This is a endurance page 1.</div>
      <div>id: {id}</div>
      <div><Button onClick={reset}>reset</Button></div>
    </>
  )
};
```

```javascript
// page 2
const Page2: React.FC = () => {
  const {
    id, reset
  } = useId();
  return (
    <>
      <div>This is a endurance page 2.</div>
      <div>id: {id}</div>
      <div><Button onClick={reset}>reset</Button></div>
    </>
  )
};
```

## 小结

随着 hooks 越来越普及，越来越多好玩的写法都出来了，各种结合式的玩法特别有趣，阅读源码下来收获颇丰，还有更多的玩法有待继续探索了。对于 hox 也是简单的解读了一下，不正确的地方请斧正。给自己也立一个 flag，待完成的课题：`如何完善基于 hooks 的持久化数据管理`。
