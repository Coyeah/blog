---
title: '浅谈对AST的理解——动手写写Babel插件'
date: '2019-03-08 19:37:15'
tag: 'Babel/前端'
path: 'understanding-of-ast'
---

AST，Abstract Syntax Tree，抽象语法树。

以前在准备面试的时候，在看 webpack 原理和 babel 原理的时候都提到 AST，但是对于 AST 的概念是一知半解的。趁这个机会捋一捋这一块的知识点。

简单描述一下 webpack 的原理，就是：

1. 读取文件分析模块依赖
2. 对模块进行解析执行（深度遍历）
3. 针对不同的模块使用相对应的 loader
4. 编译模块，生成抽象语法树（AST）
5. 循环遍历 AST 树，拼接输出 JavaScript

再简单的描述下 babel 的原理，就是：babel 解析成 AST，然后用插件更改 AST，最后由 babel 输出代码。

![babel原理图](https://www.coyeah.top/source/ast.png)

## 什么是 AST

> It is a hierarchical program representation that presents source code structure according to the grammar of a programming language, each AST node corresponds to an item of a source code.

懵了？

在计算机科学中，抽象语法树（abstract syntax tree 或者缩写为 AST），或者语法树（syntax tree），是源代码的抽象语法结构的树状表现形式，这里特指编程语言的源代码。树上的每个节点都表示源代码中的一种结构。

AST 是对源代码结构的一种抽象表现，称得上是“抽象”，即不会对真实语法中的每一个细节都记录下来。

## AST 的使用场景

+ JavaScript 反编译
+ Babel 编译 ES6 语法
+ 代码高亮
+ 关键词匹配
+ 作用域判断
+ 代码压缩

## AST 的解析过程

AST 解析和编译器所做的事并不同，相对来说更加简单（保住了发量）。编译器需要把高级编程语言转换成二进制，而 AST 解析只需要关注 **词法分析** 和用 **语法分析** 这两个关键的步骤。

### 词法分析

词法分析，就是把一句话拆分成词语。既不让丢失原本的意思，又能够拆分成最小词法单元。

JavaScript 可以识别的最小词法单元：空格、注释、字符串、数字、标识符、运算符、括号。

#### 举个栗子

`用纸笔记录生活的美好。` > JavaScript 文件

babel working now...

`用`、`纸笔`、`记录`、`生活`、`的`、`美好` > AST

#### 用代码说明

``` JavaScript
if (1 > 0) {
  alert("if 1 > 0");
};
```

这样的一串代码，在 babel 看来就是这个样子的：`if`、`(`、`1`、`>`、`0`、`)`、`{`、`alert`、`(`、`"if 1 > 0"`、`)`、`;`、`}`、`;`。省去了空格。

这个有点太简单了，走个专业点的。

``` JavaScript
[
 { type: "whitespace", value: "\n" },
 { type: "identifier", value: "if" },
 { type: "whitespace", value: " " },
 { type: "parens", value: "(" },
 { type: "number", value: "1" },
 { type: "whitespace", value: " " },
 { type: "operator", value: ">" },
 { type: "whitespace", value: " " },
 { type: "number", value: "0" },
 { type: "parens", value: ")" },
 { type: "whitespace", value: " " },
 { type: "brace", value: "{" },
 { type: "whitespace", value: "\n " },
 { type: "identifier", value: "alert" },
 { type: "parens", value: "(" },
 { type: "string", value: "\"if 1 > 0\"" },
 { type: "parens", value: ")" },
 { type: "sep", value: ";" },
 { type: "whitespace", value: "\n" },
 { type: "brace", value: "}" },
 { type: "whitespace", value: "\n" },
]
```

### 语法分析

经历过词法分析的分词步骤后，语法分析便是把这些个分词进行立体化的组合。确认有多重意义的词语最终是什么意思、多个词语之间有什么关系以及又应该再哪里断句等。表现出来的就是有个从属关系，Object 中有着 Children， Children 中包含着子 Object。

``` JavaScript
const text = 'AST';
```

经过语法分析后呈现的 AST，来看看通过解析成 AST 最真实的样子。也可以通过[在线编辑器](https://astexplorer.net/)来体验一下。

``` JavaScript
{
  "type": "Program",
  "start": 0,
  "end": 19,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 19,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 6,
          "end": 18,
          "id": {
            "type": "Identifier",
            "start": 6,
            "end": 10,
            "name": "text"
          },
          "init": {
            "type": "Literal",
            "start": 13,
            "end": 18,
            "value": "AST",
            "raw": "\"AST\""
          }
        }
      ],
      "kind": "const"
    }
  ],
  "sourceType": "module"
}
```

简析下图中的内容：

+ **type** - 描述该语句的类型
+ **kind** - 变量声明的关键字
+ **declaration** - 声明的内容，用数组的形式体现，每一项都是一个对象
+ **name** - 变量名称
+ **type** - 变量类型
+ **value** - 变量的值，不带引号
+ **row** - 变量的值，带引号

## 动手做做看——Babel插件

首先得介绍两个关键库

+ **babel-core** - babel 核心库，用于实现核心的转换引擎
+ **babel-types** - 实现类型转换，生成 AST 节点

### 简单入手

从简单的入手，我们先让第三方类库为我们完成解析、遍历和生成的工作。

``` JavaScript
const esprima = require('esprima');         //解析 JavaScript 的语法的包
const estraverse = require('estraverse');   //遍历树的包
const escodegen = require('escodegen');     //生成新的树的包
```

从打印出来的结构可以看得出来，解析出 AST 树是经过词法和语法分析后的立体结构。

```JavaScript
let code = 'let sum = () => {};';
let AST = esprima.parse(code);  // 解析
console.log(AST);
/*
Script {
  type: 'Program',
  body:
   [ VariableDeclaration {
       type: 'VariableDeclaration',
       declarations: [Array],
       kind: 'let' } ],
  sourceType: 'script' }
 */
```

AST 遍历过程中每个节点都被访问了两次，一进一出各一次。每次访问都对`node.name`进行一次改写操作。

```JavaScript
// 遍历
estraverse.traverse(AST, {
  enter(node) {
    console.log('enter > ', node.type);
    if (node.type === 'Identifier') {
      node.name += '_enter';
    }
  },
  leave(node) {
    console.log('leave > ', node.type);
    if (node.type === 'Identifier') {
      node.name += '_leave';
    }
  }
})
/*
enter >  Program
enter >  VariableDeclaration
enter >  VariableDeclarator
enter >  Identifier
leave >  Identifier
enter >  ArrowFunctionExpression
enter >  BlockStatement
leave >  BlockStatement
leave >  ArrowFunctionExpression
leave >  VariableDeclarator
leave >  VariableDeclaration
leave >  Program
 */
```

最后的部分就是生成新的代码。函数的变量名称也被改变了。

```JavaScript
let result = escodegen.generate(AST);
console.log(result);
/*
let sum_enter_leave = () => {};
 */
```

### 正式开始做第一个插件（预计算和箭头函数）

`index.js`

``` JavaScript
const compute = require('./compute');
const arrow = require('./arrow');
let code1 = 'const result = 1 + 2 + 3 + 4 + 5 + 6;';
let code2 = 'let sum = (a,b) => a+b;';
const result = babel.transform(code1, {
  plugins: [
    compute,
    arrow,
  ]
});
```

`compute.js`

``` JavaScript
const visitor = {
  BinaryExpression(path) {
    const node = path.node;
    let result;
    // 判断表调是两遍是否都是数字
    if (types.isNumericLiteral(node.left) && types.isNumericLiteral(node.right)) {
      switch (node.operator) {
        case "+":
          result = node.left.value + node.right.value;
          break;
        case "-":
          result = node.left.value - ndoe.right.value;
          break;
        case "*":
          result = node.left.value * ndoe.right.value;
          break;
        case "/":
          result = node.left.value / ndoe.right.value;
          break;
        case "**":
          let i = node.right.value;
          while(--i) {
            result = result || node.left.value;
            result = result * node.left.value;
          }
          break;
        default:
      }
    }
    // 如果上面的运算有结果的话
    if (result !== undefined) {
      // 把表达式节点替换成number字面量
      path.replaceWith(types.numericLiteral(result));
    }
    // 向上递归的方式遍历父级节点，判断父级节点是否是运算
    if (path.parentPath.node.type == 'BinaryExpression') {
      visitor.BinaryExpression.call(null, path.parentPath);
    }
  }
}
module.exports = {
  visitor,
}
```

`arrow.js`

``` JavaScript
const visitor = {
  ArrowFunctionExpression(path) {
    // 如果这个节点是箭头函数的节点的话，进行替换工作
    let params = path.node.params;
    let blockStatement = types.blockStatement([types.returnStatement(path.node.body)])
    let func = types.functionExpression(null, params, blockStatement, false,false);
    path.replaceWith(func)
  }
}
module.exports = {
  visitor,
}
```

#### Key Point

+ **visitor** - 当Babel处理一个节点时，是以 visitor 的形式获取节点信息，并进行相关操作，这种方式是通过一个 visitor 对象来完成的，在 visitor 对象中定义了对于各种节点的访问函数，这样就可以针对不同的节点做出不同的处理。我们编写的 Babel 插件其实也是通过定义一个实例化 visitor 对象处理一系列的 AST 节点来完成我们对代码的修改操作。
+ **path** - 每次访问节点方法时，都会传入一个 path 参数，这个参数中包含了节点的信息以及节点和所在的位置，以供对特定节点进行操作。具体来说 Path 是表示两个节点之间连接的对象。这个对象不仅包含了当前节点的信息，也有当前节点的父节点的信息，同时也包含了添加、更新、移动和删除节点有关的其他很多方法。
+ **state** - 每次访问节点方法时传入的第二个参数
+ **square** - 作用域

## 总结

在网路上找了很多资料学习而来，还在学习阶段。对于 AST 原理并没有很高盛莫测，却有着探索的必要。以上是我对抽象语法树的理解，若有什么不正确的地方。恳请斧正！

参考资料：[Babel 插件手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#toc-introduction)
项目传送门：[传送门](https://github.com/Coyeah/demo-babel-plugin)