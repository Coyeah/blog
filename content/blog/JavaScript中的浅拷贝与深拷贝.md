---
title: 'JavaScript中的浅拷贝与深拷贝'
date: '2018-06-30 12:25:41'
tag: 'JavaScript'
path: 'shallow-copy-and-deep-copy-in-javascript'
---

拷贝、复制、克隆......

在JavaScript中的Object类型中，拷贝是有分为浅拷贝与深拷贝的。

## JavaScript的变量类型

（1）变量类型：

Undefined, Null, Boolean, Number, String。在ES6中新添加了一种Symbol。

这样一种类型的变量是按值存放的。存放在栈内存中的简单数据段，可以直接访问。不存在深拷贝或者浅拷贝的区别，拷贝就是拷贝。

（2）引用类型：

Object

存放在堆内存中的对象，变量保存的是一个指针，指向一个地址。当需要访问引用类型（如对象、数组等）的值的时候，首先从栈中获取该对象的地址指针，再从堆内存中提取所要的数据。

## 浅拷贝

由于引用类型的特点是通过地址指针去找到数据的。因此出现了这样一个问题：拷贝是只要指向同一个地址好呢？还是再在堆内存中再创建一个一模一样的对象？

前者就是浅拷贝。

```JavaScript
var arr1 = [1, 2, 3];
var arr2 = arr1;
arr1[0] = 'change';
console.log('shallow copy: ' + arr1 + " );   //shallow copy: change,2,3
console.log('shallow copy: ' + arr2 + " );   //shallow copy: change,2,3
```

因为arr2是由arr1浅拷贝而来，因此这两个对象是指向同一块内存空间的。也就是在本质上这两个对象，只是一个数组。因此无论任何一个改变了，相应的对方也会改变。

### 浅拷贝实现

1.简单的引用复制

```JavaScript
function shallowClone(copyObj) {
  var obj = {};
  for ( var i in copyObj) {
    obj[i] = copyObj[i];
  }
  return obj;
}

var x = {
  a: 1,
  b: { f: { g: 1 } },
  c: [ 1, 2, 3 ]
};
var y = shallowClone(x);
console.log(y.b.f === x.b.f);     // true
```

2.Object.assign()

`Object.assign()`方法可以把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。

```JavaScript
var x = {
  a: 1,
  b: { f: { g: 1 } },
  c: [ 1, 2, 3 ]
};
var y = Object.assign({}, x);
console.log(y.b.f === x.b.f);     // true
```

## 深拷贝

深拷贝则完全区别于浅拷贝，数据我们平常所理解的COPY，复制一个独立的对象。

### 深拷贝实现

1.JSON对象的parse和stringify

JSON对象是ES5中引入的新的类型（支持的浏览器为IE8+），JSON对象parse方法可以将JSON字符串反序列化成JS对象，stringify方法可以将JS对象序列化成JSON字符串，借助这两个方法，也可以实现对象的深拷贝。

```JavaScript
//例1
var source = { name:"source", child:{ name:"child" } }
var target = JSON.parse(JSON.stringify(source));
target.name = "target";  //改变target的name属性
console.log(source.name); //source
console.log(target.name); //target
target.child.name = "target child"; //改变target的child
console.log(source.child.name); //child
console.log(target.child.name); //target child
//例2
var source = { name:function(){console.log(1);}, child:{ name:"child" } }
var target = JSON.parse(JSON.stringify(source));
console.log(target.name); //undefined
//例3
var source = { name:function(){console.log(1);}, child:new RegExp("e") }
var target = JSON.parse(JSON.stringify(source));
console.log(target.name); //undefined
console.log(target.child); //Object {}
```

2.jQuery.extend()方法实现

jQuery的extend方法使用基本的递归思路实现了浅拷贝和深拷贝，但是这个方法也无法处理源对象内部循环引用。

```JavaScript
var a = {"name":"aaa"};
var b = {"name":"bbb"};
a.child = b;
b.parent = a;
$.extend(true,{},a);//直接报了栈溢出。Uncaught RangeError: Maximum call stack size exceeded
```
