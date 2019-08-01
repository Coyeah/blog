| 题目              | 创建时间            | 标签            |
| ----------------- | ------------------- | --------------- |
| DOM节点层次的问题 | 2018-04-18 23:54:42 | JavaScript/前端 |

------

很明显，上一次CSS选择器的题目没有让我好好吸取教训，又在DOM节点层次的问题上摔跟头了。

这一次是是表格数据获取的问题，看得出来是要用到节点获取的，可是英语不敏感的我能怎么办，又把单词忘记了。看来过四级还有漫漫长路啊！

题目不难。`function (type, order) { //TODO }`，对表格中指定列的内容进行倒序或者正序的排列。

```HTML
<table>
  <thead>
    <tr><th>id</th><th>price</th><th>sales</th></tr>
  </thead>
  <tbody id="jsList">
    <tr><td>1</td><td>10.0</td><td>800</td></tr>
    <tr><td>2</td><td>30.0</td><td>600</td></tr>
    <tr><td>3</td><td>20.5</td><td>700</td></tr>
    <tr><td>4</td><td>40.5</td><td>500</td></tr>
    <tr><td>5</td><td>60.5</td><td>300</td></tr>
    <tr><td>6</td><td>50.0</td><td>400</td></tr>
    <tr><td>7</td><td>70.0</td><td>200</td></tr>
    <tr><td>8</td><td>80.5</td><td>100</td></tr>
  </tbody>
</table>
```

答：

```JavaScript
function sort(type, order) {
  var target = document.getElementById("jsList");
  var targetChild = target.getElementsByTagName("tr");
  var arr = [];
  var flag;
  switch(type) {
    case "id": {
      flag = 0;
      break;
    }
    case "price": {
      flag = 1;
      break;
    }
    case "sales": {
      flag = 2;
      break;
      }
  }
  for (var i = 0; i < targetChild.length; i++) {
    arr.push(targetChild[i].childNodes[flag].innerHTML);
    console.log(targetChild[i].childNodes[flag].innerHTML);
  }
  arr.sort();
  if (order == "asc") {

  } else if (order == "desc") {
    arr.reverse();
  }
  console.log(arr);
}
```

知识点归纳一下，怕自己忘记。

## DOM节点层次

### Node 类型

主要是分`nodeName`和`nodeValue`，前者值为元素标签名，后者为null。前提是在元素下。

节点关系：

* `parentNode`和`childNodes`
* `firstChild`和`lastChild`
* `nextSibling`和`previousSibling`

操作方式：

* 插入：`appendChild()`和`insertBefore()`
* 替换：`replaceChild()`
* 删除：`removeChild()`
* 其他：`cloneNode()`

### Document 类型

多用于查找元素。

* `getElementById()`
* `getElementByTagName()`
* `getElementByName()`

### Element 类型

用于表现XML和HTML元素，提供对元素标签名、子节点及特性的访问。
