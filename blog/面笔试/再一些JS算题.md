| 题目         | 创建时间            | 标签        |
| ------------ | ------------------- | ----------- |
| 再一些JS算题 | 2018-06-12 16:10:58 | 笔试题/前端 |

------

## 1.请用 javascript 实现一个函数 parseUrl(url)，将一段 url 字符串解析为 Object。

> parseUrl("http://www.coyeah.top/product/list?id=123456&sort=discount#title");

返回结果：

> {
>   protocol: "http",
>   host: "www.coyeah.com",
>   path: "/product/list",
>   query: {
>     id: "12345",
>     sort: "discount"
>   },
>   hash: "title"
> }

```JavaScript
function parseUrl (url) {
  let obj = new Object();
  let arr = url.split("://");
  obj.protocol = arr[0];

  let temp = arr[1];
  obj.host = temp.slice(0, temp.indexOf("/"));

  temp = temp.slice(temp.indexOf("/"));
  obj.path = temp.slice(0, temp.indexOf("?"));
  obj.query = parseParam(url.slice(0, url.indexOf("#")));
  obj.hash = temp.slice(temp.indexOf("#") + 1);

  return obj;
}

function parseParam (url) {
  if (url.indexOf("?") == -1) return null;

  let arr = url.slice(url.indexOf("?") + 1).split("&");
  let param = new Object();

  for (let i = 0; i < arr.length; i++) {
    let key = arr[i];

    if (key.indexOf("=") != -1) {
      if (param[arr[i].split("=")[0]] == null) {
        param[arr[i].split("=")[0]] = typeJudge(key.split("=")[1]);
      } else {
        if (param[arr[i].split("=")[0]] instanceof Array) {
          param[arr[i].split("=")[0]].push(typeJudge(key.split("=")[1]));
        } else {
          param[arr[i].split("=")[0]] = [param[arr[i].split("=")[0]], typeJudge(key.split("=")[1])];
        }
      }
    } else {
      param[key] = true;
    }
  }

  return param;

  function typeJudge(text) {
    if (!isNaN(text)) {
      // number
      return +text;
    } else if (text.indexOf("%") != -1) {
      // chinese
      return decodeURI(text);
    } else {
      return text;
    }
  }
}
```

## 2.请用 javascript 实现一个函数 verify(text)，检查字串里面的括号是否有正确嵌套 

```JavaScript
function verify (text) {
  let arr = [];
  let ary = [];
  let key = ["(",")","[","]","<",">"];

  for (let i = 0; i < key.length; i = i + 2) {
    for (let j = 0; j < text.length; j++) {
      if (text.charAt(j) == key[i]) {
        arr.push(j);
      } else if (text.charAt(j) == key[i + 1]) {
        ary.unshift(j);
      }
    }

    if (arr[0] > ary[0]) {
      return 0;
    } else if (arr.length == ary.length) {
      for (let k = 1; k < arr.length; k++) {
        if ((arr[k] > ary[k - 1] && ary[k] > ary[k - 1]) || (arr[k] < ary[k - 1] && ary[k] < ary[k - 1])) {

        } else {
          return 0;
        }
      }
    } else {
      return 0
    }
    arr = [];
    ary = [];
  }

  return 1;
}
```

## 3.用js写一个简单的交通灯功能，10秒绿灯倒数，3秒黄灯倒数，5秒红灯倒数，如何让三个灯不断交替重复？

```JavaScript
function trafficLight () {

  greenLight();

  function greenLight () {
    console.log("绿灯亮！");
    setTimeout(function () {
      yellowLight();
    }, 10000);
  }

  function yellowLight () {
    console.log("黄灯亮！");
    setTimeout(function () {
      redLight();
    }, 3000);

  }

  function redLight () {
    console.log("红灯亮！");
    setTimeout(function () {
      greenLight();
    }, 5000);

  }
}

trafficLight();
```

## 4.DOM 树的遍历（广度优先）

```HTML
<!DOCTYPE html>
<html>
<head>
  <title></title>
</head>
<body>
<div class="root">
  <div class="container">
    <section class="sidebar">
      <ul class="menu"></ul>
    </section>
    <section class="main">
      <article class="post"></article>
      <p class="copyright"></p>
    </section>
  </div>
</div>
<script type="text/javascript">
const traverse = (ndRoot) => {
  const stack = [ndRoot];

  while (stack.length) {
    const node = stack.shift();

    printInfo(node);

    if (!node.children.length) {
      continue;
    }

    Array.from(node.children).forEach(x => stack.push(x));
  }
};

const printInfo = (node) => {
  console.log(node.tagName, `.${node.className}`);
};

// kickoff
traverse(document.querySelector('.root'));
</script>
</body>
</html>
```

