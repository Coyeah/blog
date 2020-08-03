---
title: 'CSS布局：圣杯与flex'
date: '2018-06-20 19:04:38'
tag: 'CSS/前端'
path: 'css-layout-holy-grail-and-flex'
---

## 关于圣杯布局

描述下圣杯布局，有点类似于网格布局的三列式，可以理解为中间列是杯身，两侧则为两个杯耳。不同于网格布局的是只有三列一行。

![float_css_1.jpg](https://www.coyeah.top/source/float_css_1.jpg)

两侧的盒子固定宽度，中间盒子自适应宽度。

但是为什么不用网格布局来实现呢，主要是因为圣杯布局里，中间盒子是可以优先渲染的，代码上它是优先于两侧的盒子。

```HTML
<header><h4>Header内容区</h4></header>
<div class="container">
  <div class="middle"><h4>中间弹性区</h4></div>
  <div class="left"><h4>左边栏</h4></div>
  <div class="right"><h4>右边栏</h4></div>
</div>
<footer><h4>Footer内容区</h4></footer>
```

在`.middle`、`.left`、`.right`中设置`float:left;`。你会看到是这样的模样。

![float_css_2.jpg](https://www.coyeah.top/source/float_css_2.jpg)

它的实现主要在三个知识点，`float`、`position`和`box-sizing`。

float的特殊情况：浮动元素的覆盖问题；当margin设置为负时，会与其他浮动元素重叠。

![float_css_3.jpg](https://www.coyeah.top/source/float_css_3.jpg)

继续就是要调节整体盒子的内边距问题了，因为两侧盒子遮住了中间盒子的内容嘛。但是又出现了一个问题，float的规则限定了，浮动元素的margin不能超过包含块的padding。因此就要利用到了相对定位relative，这样就可以突破这样的限制。

在整体盒子上设置了padding，但是width的宽度是不变的。box-sizing的设置可以很优雅的实现自适应。

附上CSS代码。想过就会像第一张图一样。

```CSS
html, body, h4 {
margin: 0;
padding: 0;
}
header {
background-color: darkseagreen;
width: 100%;
height: 40px;
}
footer {
background-color: darkslategray;
width: 100%;
height: 40px;
}
.container {
background-color: red;
width: 100%;
height: 200px;
padding: 0 200px;
box-sizing: border-box;
overflow: hidden;
}
.middle {
background-color: deeppink;
float: left;
width: 100%;
height: 200px;
}
.left {
background-color: blue;
float: left;
width: 200px;
height: 200px;
margin-left: -100%;
position: relative;
left: -200px;
}
.right {
background-color: darkorchid;
float: left;
width: 200px;
height: 200px;
margin-left: -200px;
position: relative;
right: -200px;
}
```

## flex布局

弹性盒布局，是响应式开发经常使用的一种布局方式。顾名思义是可以随着用户窗口大小或者设备不同自适应的去改变大小宽窄。

比较重要的属性：

* display: flex;  // 设置为弹性布局
* flex-direction: row/column;  // 确立主轴。即横向还是竖向
* justify-content: center/flex-start/flex-end/space-between/space-around;  // 定义沿主轴如何排布
* align-items: center/flex-start/flex-end;  // 定义沿侧轴如何排布

通常我会配合上媒体查询，这样可以在布局上看起来更加舒服。
