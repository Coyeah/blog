| 题目                  | 创建时间            | 标签       |
| --------------------- | ------------------- | ---------- |
| call&apply&bind的理解 | 2018-05-06 20:33:53 | JavaScript |

------

`call()` & `apply()` & `bind()`

* 都是用于改变函数的this对象的指向。
* bind是返回对应函数，便于稍后调用；call和apply则立刻调用。

## bind()

1. 是Function.prototype中的一个函数
2. 作用：给函数绑定一个对象，返回一个新函数，但该函数无prototype属性
3. 基本原理：使用apply()和闭包，返回包含apply()的闭包是的apply()绑定指定作用域但并未执行

```JavaScript
// bind
Function.prototype.bind = Function.prototype.bind || function (context) {
  let that = this;
  let aArgs = Array.prototype.slice.call(arguments, 1);
  return function () {
    return that.apply(context, aArgs.concat(Array.prototype.slice.call(arguments)));
  }
}
```

## 作用？

网络上对call()/apply()/bind()的解释都是简单的一句话：

`改变某函数运行的context即上下文`

但是，到底怎么用呢？具体的实际场景是什么呢？

儿童版又一个好玩的理解：

> 猫吃鱼，狗吃肉，奥特曼打小怪兽。
> 有天狗想吃鱼了
> 猫.吃鱼.call(狗，鱼)
> 狗就吃到鱼了
> 猫成精了，想打怪兽
> 奥特曼.打小怪兽.call(猫，小怪兽)

还不理解？

> 对象1.call（对象2，对象2的小弟a，对象2的小弟b）
> 对象1call（打电话给）对象2，说：“哥们，我应付不了了，你带上你的小弟们快来啊”。对象2接手了对象1的一切，成为对象1一切（如函数）的主人

常用的：

* Array.prototype.slice.call();

由于document.getElementsByTagName、arguments这样的类数组是不能应用Array的API

