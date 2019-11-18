| 题目                   | 创建时间            | 标签 |
| ---------------------- | ------------------- | ---- |
| CSS填充剩余宽度问题.md | 2018-03-26 21:06:29 | CSS  |

------

久久没有写博文了，要和时间赛跑呀。近期做企业面试的练习题的时候，遇到了一个很基础的问题，一下子惊起我对基础问题的重视！

> 题目：父div未知宽度，内有两个div，第一个固定宽度，第二个需要填满整个父容器的剩余宽度。如何实现？纯CSS解决，要求两种解决方案。

一下子也是问懵了，铺上解决方案。

```html
<!DOCTYPE html>
<html>
<head>
	<title>aboutWidth</title>
</head>
<body>
	<div id="parents">
		<div id="nav"></div>
		<div id="main"></div>
	</div>
</body>
</html>
```

## 方案一：

最常用，使用`float: left;`。

```css
#parents {
	width: 800px;
	height: 400px;
	border: 1px solid #000;
}
#nav {
	width: 200px;
	height: 100%;
	background-color: red;
	float: left;
}
#main {
	width: 100%;
	height: 100%;
	background-color: green;
}
```

## 方案二：

使用`position`定位。

```css
#parents {
	width: 800px;
	height: 400px;
	border: 1px solid #000;
	position: absolute;
}
#nav {
	width: 200px;
	height: 100%;
	background-color: red;
	top: 0;
	left: 0;
	position: absolute;
}
#main {
	width: 100%;
	height: 100%;
	background-color: green;
}
```