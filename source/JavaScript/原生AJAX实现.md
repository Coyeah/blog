| 题目         | 创建时间            | 标签            |
| ------------ | ------------------- | --------------- |
| 原生AJAX实现 | 2018-02-02 22:21:10 | JavaScript/前端 |

------

> 原生AJAX，学习前端的第一步

AJAX技术的核心就是XMLHttpRequest对象。

AJAX技术的工作原理可以分为三步：

# 原生AJAX代码：
## 1、获取XMLHTTP浏览器控件，用于后面打开链接

``` javascript
var xmlHttp = false;
```


获的Microsoft IE

``` javascript
try {
	xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
} catch(e1) {
	try {
		xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	} catch(e2) {
		xmlHttp = false;
	}
}
```

获取非Microsoft IE

``` javascript
if (!xmlHttp && typeof XMLHttpRequest != 'undefined') {
	xmlHttp = new XMLHttpRequest();
}
```

## 2、打开连接，通过异步传输，发送参数到AjaxServlet，返回符合条件的XML/JSON文档或者普通文本

从表单中获取用户ID

``` javascript
var ID = document.getElementById("ID").value;
if ((ID == null) || (ID ==  "")) {
	alert("请输入ID！");
	return;
}
var url = "AjaxServlet?ID=" + ID + "&random=" + Math.random();
```

* GET

打开服务器连接，实际上是跟浏览器地址栏上输入 AjaxServlet?ID=xxx 是一样的

最后一个参数：false（同步）就是等待并处理完返回数据后再继续往下走，true（异步）就是 不等待，也就是所谓的异步获取数据！通常为true

当readystate变化时，一个名为 complete() 的方法将被触发

不用 complete() ，因为不是函数调用

``` javascript
xmlHttp.open("GET", url, true);
xmlHttp.onreadystatechange = complete;
xmlHttp.send(null);
```

* POST

``` javascript
xmlHttp.open("POST", url, true);
xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xmlHttp.send("ID=123456");
```

## 3、处理返回结果

当`readyState`为状态4表示：服务器已经完成对请求的处理

* 0:请求还没有建立（open执行前）
* 1:请求建立了还没发送（执行了open）
* 2:请求正式发送（执行了send）
* 3:请求已受理，有部分数据可以用，但还没有处理完成
* 4:请求完全处理完成

`.status`为200表示返回成功

`getText`为普通文本返回；`getXML`以XML文档返回；`getJSON`以JSON文档返回，json数据的处理统一先用`.responseText`作为一个字符串接收后 再转为json对象进行处理

``` javascript
function complete() {
	if (xmlHttp.readyState == 4) {
		if (xmlHttp.status == 200) {
			var ID = document.getElementById("ID").value;
			if (ID == "getTXT") {
				var str = xmlHttp.responseText;
				alert(str);
			}

			if (ID == "getXML") {
				var type = xmlHttp.responseXML.getElementsByTagName("Username");
				for (var i = 0; i < type.length; i++) {
					var str = type[i].firstChild.data;
					alert(str);
				}
			}

			if (ID == "getJSON") {
				var str = xmlHttp.responseText;
				var json = eval('(' + str + ')');
				alert(json.username);
				alert(json.age);
				alert(json.sex);
			}

			if (ID == "getJSON2") {
				var str = xmlHttp.responseText;
				var json = eval('(' + str + ')');
				for (var i = 0; i < json.length; i++) {
					alert(json[i].username);
					alert(json[i].age);
					alert(json[i].sex);
				}
			}
		} else {
			alert("出错！");
		}
	}
}
```

虽然说，现在AJAX都不用原生的了。