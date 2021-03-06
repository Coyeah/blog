---
title: 处理二进制流的小白玩法
date: "2019-03-22T10:35:28.000Z"
description: 
---

事件的起源是 POST 请求后后端返回了一串二进制流，告诉我这就是 Excel，问我前端能不能处理。让我衍生出一个想法，前端是不是可以不通过服务器对文件下载。很多次在处理批量数据的时候，愁着怎么把数据对象用文件保存下来。说来就来。

## 浏览器玩二进制

### Blob 对象

> Blob 对象表示一个不可变、原始数据的类文件对象。Blob 表示的不一定是JavaScript原生格式的数据。File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。—— MDN

浏览器中的 Blob 和 MYSQL 中的 BLOB 类型在概念上有点区别。MYSQL 中的 BLOB 类型就只是个二进制数据容器，浏览器中的 Blob 除了存放二进制数据，还可以设置 MINE 类型，相当于对文件的存储。

``` JavaScript
let blob = new Blob(Array, Options);
```

通过构造方法，创建一个 Blob 对象，两个属性一个方法。传入值必须是是数组类型。

* blob.size: Blob 对象中所包含数据的大小（字节）
* blob.type: Blob 对象所包含数据的MIME类型
* blob.slice: 对 Blob 对象进行截取，返回一个新的 Blob 对象

除了对文件的处理，Blob 对象通过截取可以对大文件类型分段上传。

### URL 对象

Blob 对象要被使用，可以通过 URL.createObjectURL 方法，官方解释：

> URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。 —— MDN

### 实现下载

``` JavaScript
let blob = new Blob([target], {type});
const link = document.createElement('a');
link.href = window.URL.createObjectURL(blob);
link.download = filename;
link.click();
```

模拟浏览器 `<a>` 标签被点击的事件，触发浏览器机制对识别 URL，从而把二进制流文件下载下来。

## 在 Node 上玩玩二进制流

Stream，流！

是数据的集合 —— 就像数组或字符串一样。区别在于流中的数据可能不会立刻就全部可用，并且你无需一次性地把这些数据全部放入内存。

可以理解为水流，说起水流，自然就有方向可言，根据方向来区分出三种类型：

* 设备流向程序：readable;
* 程序流向设备：writable;
* 双向：duplex、transform;

如果你要从网站上看视频，node 可以想这样给你发送视频：

``` JavaScript
const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
   fs.readFile(moviePath, (err, data) => {
      res.end(data);
   });
}).listen(8080);
```

但是这样似乎太慢了，显示需要把文件读完，然后把文件放入内存。文件过大的时候就要等很久，内存占用很大。用流的方式，就可以一点点的送上前端。

所有的流都是 EventEmitter 的实例。它们发出可用于读取或写入数据的事件。然而，我们可以利用 pipe 方法以一种更简单的方式使用流中的数据。

``` JavaScript
const http = require('http');

const fs = require('fs');

http.createServer((req, res) => {

   fs.createReadStream(moviePath).pipe(res);

}).listen(8080);
```

在[wherever@0.3.4](https://github.com/Coyeah/wherever)中实践。
wherever 是一个 Node 静态资源服务器，`--image` 开启 Image base64 模式，对图片创建出 base64 的图片文件。

