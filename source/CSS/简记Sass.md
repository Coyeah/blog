| 题目     | 创建时间            | 标签 |
| -------- | ------------------- | ---- |
| 简记Sass | 2018-01-20 22:47:28 | 总结 |

------

> Sass，世界上最成熟、最稳定、最强大的专业级CSS扩展语言！

## 为什么会接触Sass

之前听说过`Less`，可是一直没有去了解这一类的CSS预处理器。一直习惯于直接编写CSS文件，即便在建设企业的网站时，都用这种传统麻烦的方法，习惯真的很可怕。在写博客样式的时候看到文章上提到`Sass`，兴起想学习下。记下用法，也好方便以后翻阅。

## 关于Sass

* `Sass`没办法直接使用，需要通过`Ruby`或者其他工具安装`Sass`后进行一次“编译”，类似于`.java`需要转成`.class`才能运行。以至于在编写CSS的时候，很多效果没办法及时的反馈出来，毕竟CSS需要很直观快速的表现，以便于修改。
* 对于写惯写熟了直接CSS文件的人来说，`Sass`更加趋向于编程的思想，有变量有条件语句。也就是相对来说更加难以使用。对于企业级的网站开发，`Sass`反而会更加适合团队上的使用，不需要考虑样式上的问题，例如颜色、边距等问题，因为可能已经在`.yml`或者`.scss`里设置好了，直接调用就好了。
* 编辑器不支持对`Sass`格式的支持，所以没有代码高亮。

## Sass和SCSS的区别

`Sass`有两种后缀名的写法，`.sass`和`.scss`。两者主要的区别在于：Sass以严格缩进式语法规则来书写的，不用括号和分号；SCSS的语法和CSS的语法类似。

## Sass的基本用法

### 1、变量
Sass给CSS引用了变量，把反复使用的CSS属性值转变成直接使用变量名，所有变量以`$`开头。
当引用到外部文件中有相同名字的变量时，`!default`的存在让其变量无效。
```scss
$theme-color: #8B0016 !default;
$theme-width: 100px;
div {
    background-color: $theme-color;
    width: $theme-width;
}
```
还有一种使用方法，但是我倒是觉得用起来有点多余。如果要把变量镶嵌到字符串中，需要写在`#{ }`中。
```scss
$side: left;
div {
	border-#{$side}-radius: 5px;
}
```

### 2、计算
```scss
$theme-width: 100px;
div {
    width: $theme-width * 10%;
    height: 100px + 10px;
}
```

### 3、嵌套
复用是非常恼人的一件事，键盘都按坏了代码都还没写完。
```scss
.content-block {
    color: #000000;

    p, span {
        font-size: 16px;

	    border: {
	        color: #888888;
	    }
		
        a {
            color: #8B0016;
            text-decoration: none;

            &:hover {
                color: #888888;
                text-decoration: none;
            }
        }
    }
}
```

### 4、导入
`SCSS`通过`@import`引用外部`.scss`文件，还可以不写文件的全名，即省略文件名开头的下划线。举例来说，导入`themes/_header.scss`只需要写上`@import "themes/header";`

### 5、混合器
混合器用`@mixin`声明，可以传递参数，通过`@include`调用。可以避免通用样式的重复。
```scss
// sass style
@mixin theme-margin {
	margin-left: 30px;
	margin-top: 50px;
}

.header {
    @include theme-margin;
}

// css style
.header {
    margin-left: 30px;
    margin-top: 50px;
}
```

传参的混合器
```scss
@mixin link-colors($normal, $hover, $visited) {
    color: $normal;
    &:hover { color: $hover; }
    &:visited { color: $visited; }
}

a {
    @include link-colors(
        $normal: blue,
        $visited: green,
        $hover: red
    );
}
```

### 6、继承
使用`@extend`实现继承
```scss
.error {
    border: 1px red;
    background-color: #fdd;
}
.seriousError {
    @extend .error;
    border-width: 3px;
}
```

### 7、条件语句
Sass中的条件语句为`@if`与`@else`，可以组合成为`@else if`。
```scss
// sass style
$color: white;
p {
  @if $color == white {
    color: #fff;
  }
  @else {
    color: #000;
  }
}

// css style
p {
  color: #fff;
}
```

### 8、循环语句
for循环有两种形式，分别为：`@for $var from <start> through <end>`和`@for $var from <start> to <end>`。`through`与`to`的区别是循环包不包括`<end>`。
```scss
// sass style
@for $i from 1 through 3 {
  .item-#{$i} { width: 10px * $i; }
}

// css style
.item-1 {
  width: 10px;
}
.item-2 {
  width: 20px;
}
.item-3 {
  width: 30px;
}
```
each循环语法为：`@each $var in <list or map>`，与JavaScript中的`each`类似，即是遍历`list`或者`map`。
```scss
// sass style
$color-list: red green yellow;
@each $color in $color-list {
  .#{$color} {
    color: $color;
  }
}

// css style
.red {
  color: red;
}
.green {
  color: green;
}
.yellow {
  color: yellow;
}
```