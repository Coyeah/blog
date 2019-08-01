| 题目                 | 创建时间            | 标签            |
| -------------------- | ------------------- | --------------- |
| JS-DIV的左右动画滑动 | 2018-01-22 19:49:03 | 前端/JavaScript |

------

WEB网页侧导航栏的应用，我一直都是用这JQuery里的`.slideToggle()`，只能上下不能左右不便捷又不美观。

JQuery上的`.animate()`方法执行CSS属性集的自定义动画，可以在移动端上实现一个，可以左右滑动，显示和隐藏，侧导航栏。

## 代码实现：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <script src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
    <style>
        html,body{
            width:100%;
            height:100%;
            overflow-x: hidden;
        }
        *{
            margin:0px;
            padding:0px;
        }
    </style>
</head>
<body>
    <div id="redDiv" style="background-color:red;width:100%;height:100%;position:absolute;">
        <button id="moveRightButton" type="button">
            点击向右侧移动
        </button>
    </div>
    <div id="yellowDiv" style="background-color:yellow;width:100%;height:100%;position:absolute;top:100%;">
    </div>
    <div id="greenDiv" style="display: none;background-color:green;width:100%;height:100%;position:absolute;left:100%;top:0px;">
        <button id="moveLeftButton" type="button">
            点击向左侧移动
        </button>
    </div>
</body>
<script>
    window.onload = function(){
        $("#moveRightButton").click(function(){
            $("#greenDiv").css("display","block");
            $("#greenDiv").animate({left:'0px'},'slow');
            $("#redDiv").animate({left:'-100%'},"slow",function(){
                $(this).css("display","none");
            });
        });
        $("#moveLeftButton").click(function(){
            $("#redDiv").css("display","block");
            $("#redDiv").animate({left:'0px'},"slow");
            $("#greenDiv").animate({left:'100%'},'slow',function(){
                $(this).css("display","none");
            });
        });
    }
</script>
</html>
```

我想起之前看到的一个很好用的动画库[Animate.css](https://daneden.github.io/animate.css/)，页面一点进去就可以看到它的效果和功能，给人眼前一亮的感觉。这里不得不佩服一下[Daniel Eden](https://daneden.me/)，他的设计确实让人眼前一亮，`Animate.css`用起来很上手很舒服。