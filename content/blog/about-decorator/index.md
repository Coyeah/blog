---
title: 关于修饰器Decorator
date: "2019-04-03T06:29:16.000Z"
description: 
---

## ES7 的 JavaScript 修饰器

### 什么是修饰器

修饰器（Decorator）是 ES7 的一个提案，它的出现能够解决两个问题：

+ 不同类间共享方法
+ 编译期对类和方法的行为进行改变

用法也很简单。就是在类或者方法前加一个 `@` 符号。

### 修饰器特点

+ 修饰器本质上是一个函数
+ 被修饰对象可以使用多个修饰器
+ 修饰器可以带参数

### 简单的修饰器例子

#### 1. 修饰类

```javascript
@setProp
class User {}

function setProp(target) {
    target.age = 30
}

console.log(User.age);
```

这个例子要表达的是对 User 类使用 setProp 这个方法进行修饰，用来添加 User 类中的 age 属性。而 setProp 传入的 target 参数，代表着 User 类本身。

#### 2. 修饰类（自定义参数值）

```javascript
@setProp(20)
class User {}

function setProp(value) {
    return function (target) {
        target.age = value
    }
}

console.log(User.age);
```

此例和上面功能基本一致，唯一差别在于值是参考修饰函数传过来的。

#### 3. 修饰方法

```javascript
class User {
    @readonly
    getName() {
        return 'Hello World'
    }
}

// readonly修饰函数，对方法进行只读操作
function readonly(target, name, descriptor) {
    descriptor.writable = false
    return descriptor
}

let u = new User()
// 尝试修改函数，在控制台会报错
u.getName = () => {
    return 'I will override'
}
```

上例中，我们对 User 类中的 getName 方法使用了 readonly 修饰器进行修饰，使得方法不能被修改。

解释下参数：参数 target，就是 getName 方法本身；参数 name，就是方法名；参数 descriptor，对应着的是 Object.defineProperty 的三个参数。

```javascript
Object.getOwnPropertyDescriptor(obj, 'text')
// {
//   configurable: true,    // 当且仅当指定对象的属性描述可以被改变或者属性可被删除时，为true。
//   enumerable: true,      // 当且仅当指定对象的属性可以被枚举出时，为 true。
//   value: "text",         // 该属性的值(仅针对数据属性描述符有效)
//   writable: true         // 当且仅当属性的值可以被改变时为true。(仅针对数据属性描述有效)
// }
```

### 投入实际应用的修饰器

#### 1. 日志管理

在用 webpack 打包时，经常需要好多步骤，比如第一步读取 package.json 文件，第二步处理该文件，第三部加载 webpack.config.js 文件，第四步进行打包等等。为了直观我们需要在每一步打印一些日志文件，知道每一步都干了什么事情，而打印日志的操作和业务代码完全没有关系，我们不应该把日志和业务掺和在一起，这样使用修饰器就能够避免这个问题。

```javascript
class Pack {
    @log('读取package.json文件')
    step1() {
        // do something...
        // 没有修饰器之前，我们通常把console.log放到这里写
        // 放到函数里面写会有两个坏处
        //     1.console和业务无关，会破坏函数单一性原则
        //     2.如果要删除所有的console，那我们只能深入到每一个方法中
    }
    @log('合并webpack配置文件')
    step2() {
        // do something...
    }
}

function log(value) {
    return function (target, name, descriptor) {
        // 在这里，我们还可以拿到函数的参数，打印更加详细的信息
        console.log(value)
    }
}

let pack = new Pack()
pack.step1()
pack.step2()
```

#### 2. 检查登录

在实际的开发中，我们需要在一些操作前来判断用户是否已经登录，比如点赞、结算、发送消息等。按照以前的写法，我们必须在每一个方法中添加判断用户登录的情况，然后再进行业务的操作，然而这些前置条件和业务又混在一起，因此修饰器又一次优雅地解决了问题。

```javascript
class User {
    // 获取已登录用户的用户信息
    @checkLogin
    getUserInfo() {
        /**
         * 之前，我们都会这么写：
         *      if(checkLogin()) {
         *          // 业务代码
         *      }
         *  这段代码会在每一个需要登录的方法中执行
         *  还是上面的问题，执行的前提和业务又混到了一起
         */
        console.log('获取已登录用户的用户信息')
    }
    // 发送消息
    @checkLogin
    sendMsg() {
        console.log('发送消息')
    }
}

// 检查用户是否登录，如果没有登录，就跳转到登录页面
function checkLogin(target, name, descriptor) {
    let method = descriptor.value

    // 模拟判断条件
    let isLogin = true

    descriptor.value = function (...args) {
        if (isLogin) {
            method.apply(this, args)
        } else {
            console.log('没有登录，即将跳转到登录页面...')
        }
    }
}
let u = new User()
u.getUserInfo()
u.sendMsg()
```

