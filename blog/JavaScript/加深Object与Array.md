| 题目              | 创建时间            | 标签            |
| ----------------- | ------------------- | --------------- |
| 加深Object与Array | 2018-05-24 18:06:42 | JavaScript/算法 |

------

## Object 与 Array 的转换

学习通用的数据用不同的数据结构进行存储，以及相互的转换。

加强基础练习！

### 1、 Object -> Array

```JavaScript
var scoreObject = {
    "Tony": {
        "Math": 95,
        "English": 79,
        "Music": 68
    }, 
    "Simon": {
        "Math": 100,
        "English": 95,
        "Music": 98
    }, 
    "Annie": {
        "Math": 54,
        "English": 65,
        "Music": 88
    }
}
// 如上有一个用来存储学习成绩的对象，编写一个函数，将其转为如下的二维数组
var scoreArray = [
    ["Tony", 95, 79, 68],
    ……
];
```

coding: 

```JavaScript
let scoreArray = [];

let arr = Object.keys(scoreObject);

for (let i = 0; i < arr.length; i++) {
  let newArr = [arr[i], scoreObject[arr[i]].Math, scoreObject[arr[i]].English, scoreObject[arr[i]].Music];
  scoreArray.push(newArr);
}

console.log(scoreArray);
```

### Array -> Object

```JavaScript
var menuArr = [
    [1, "Area1", -1],
    [2, "Area2", -1],
    [3, "Area1-1", 1],
    [4, "Area1-2", 1],
    [5, "Area2-1", 2],
    [6, "Area2-2", 2],
    [7, "Area1-2-3", 4],
    [8, "Area2-2-1", 6],
];
// 如上有一个用来存储多级菜单数据的数组，编写一个函数，将其转为如下的对象
var menuObject = {
    "1": {
        name: "Area1",
        subMenu: {
            "3": {
                name: "Area1-1"
            },
            "4": {
                name: "Area1-2",
                subMenu: {
                    "7": {
                        name: "Area1-2-3"
                    }
                }
            }
        }
    }
    ……
}
```

coding: 

```JavaScript
let menuObj = {};

for (let i = 0; i < menuArr.length; i++) {
  if (menuArr[i][2] == -1) {
    menuObj[menuArr[i][0]] = { name : menuArr[i][1] };
  } else {
    findObj(menuObj, menuArr[i]);
  }
}

function findObj(obj, target) {
  if (obj[target[2]]) {
    obj[target[2]].subMenu = obj[target[2]].subMenu || {};
    obj[target[2]].subMenu[target[0]] = { name : target[1] };
    return;
  }

  for (let i in obj) {
    if (obj[i].subMenu) {
      findObj(obj[i].subMenu, target);
    }
  }
}

console.log(menuObj);
```


思路思维都比较简单，入门级的，欢迎交流！