| 题目        | 创建时间            | 标签       |
| :---------- | :------------------ | :--------- |
| 吃吃ES6的糖 | 2018-04-30 22:41:16 | JavaScript |

------

今天在车上看到知乎上的一篇文章，想起第一次面试的时候，面试官问起如何把两个数组结合并且去除相同元素。用了一堆API和for，写是写出来了。面试官表示，用ES6一两行代码就能够搞定了。

ES5还在努力补充着知识，ES6也先摸摸门道。



## 1.拒绝var

JavaScript声明变量的方法有三种，var、let、const。

使用var：容易声明全局变量，没有块级作用域；变量提升；可以重复声明。基本上要拒绝使用var了。

let和const都有块级作用域；并不存在变量提升与死区；不允许重复声明。区分使用的话，会变的用let，其余用const。

## 2.数组复制

`const arr2 = [...arr1];`

一句话的事，完成了arr1复制到arr2，比起for都要优雅得多。

## 3.字符串输出

代码说话！

```JavaScript
const name = 'Coyeah';
console.log('Hello ' + name);  // 传统的写法
console.log(`Hello ${name}`);  // 新写法，方便！
```

## 4.class写法

继续代码说话！

```JavaScript
// 老方法
function Human(name) { this.name = name }
Human.prototype.getName = function () { console.log(this.name) }

// 新方法
class Human {
  constructor(name) {
    this.name = name;
  }
  getName() { console.log(this.name) }
}
```

## 5.对象属性复制简化写法

如果过对象的属性名与变量名相同，可以简写。

```JavaScript
const activeIndex = 0;

const setState = { activeIndex: activeIndex }  // 传统的写法
const setState = { activeIndex }  // 新方法，方便！
```

## 6.简单键值对使用Map，WeakMap

```JavaScript
let map = new Map(arr);
// 遍历key值
for (let Key of map.keys()) {
  console.log(key);
}
// 遍历value值
for (let value of map.values()) {
  console.log(value);
}
// 遍历key和value值
for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
```

WeakMap和Map用法类似，区别在于WeakMap的键只能是非null对象，而且此引用对象GC（垃圾回收）计数不会+1。

## 7.Symbol

ES6下新添的基本数据类型。Symbol函数前不能使用new命令。Symbol防止了ES5对象属性名重写造成的冲突。

## 参考文章：

* [ECMAScript 6 入门](http://es6.ruanyifeng.com/)
* [JS涨姿势](https://zhuanlan.zhihu.com/p/35746653)



