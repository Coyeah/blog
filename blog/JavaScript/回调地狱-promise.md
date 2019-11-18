| 题目             | 创建时间            | 标签       |
| ---------------- | ------------------- | ---------- |
| 回调地狱-promise | 2018-04-18 21:05:38 | JavaScript |

------

## Callback Hell(回调地狱)

今天遇到一道题，回答下什么是回调陷进。又是一个新名词，知道promise却不知回调地狱，知识面有待提高啊！

查了一下，就是Callback Hell。何为回调地狱呢？

这个一堆以 `})` 结尾的金字塔，我们很亲切地称它为——“回调地狱”。它增加了函数的嵌套深度也会造成一定的逻辑混乱。

用代码说话。假设有一个大量AJAX请求。假设ajax()的参数url，data，callback。

```JavaScript
ajax(u1, d1, function() {
  if (...)
  ajax(u2, d2, function() {
    if (...)
    ajax(u3, d3, function() {
      if (...)
      ajax(u4, d4, function() {
        if (...)
        ajax(u5, d5, function() {
          // 此处还有好多个...
        })
      })
    })
  })
})
```

这样的代码无论可读性和可维护性都很差。

## promise对象

使用ES6的promise可以完美优雅地解决回调地狱。promise的好处是把执行代码和处理结果的代码分离。

promise小例子，如何实现promise。

```JavaScript
function test(resolve, reject) {
  var timeOut = Math.random() * 2;
  log("set timeOut to:" + timeOut + "s.");
  setTimeout(function() {
    if (timeOut < 1) {
      log("call resolve() ...");
      resolve("200, ok");
    } else {
      log("call reject() ...");
      reject("timeOut in " + timeOut + "s.");
    }
  }, timeOut * 1000);
}

var p1 = new Promise(test);
var p2 = p1.then(function(result) {
  console.log("success:" + result);
});
var p3 = p2.catch(function(reason) {
  console.log("failure:" + reason);
});
```

详细学习得前往 >>
[Promise - 廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/0014345008539155e93fc16046d4bb7854943814c4f9dc2000)

[JavaScript Promise迷你书（中文版）](http://liubin.org/promises-book/)

### 链式promise

```JavaScript
function showNum (num, time) {
  return new Promise(function(resolve, rejest){
    function _show(){
      setTimeout(function(){
        console.log(num);
        resolve();
      }, time)
    }
    _show()
  })
}
showNum(1, 1000).then(function(){
  return showNum(2, 2000)
}).then(function(){
  return showNum(3, 3000)
});
```

