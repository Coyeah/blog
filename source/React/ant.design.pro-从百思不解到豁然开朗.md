| 题目                                | 创建时间            | 标签       |
| ----------------------------------- | ------------------- | ---------- |
| ant.design.pro-从百思不解到豁然开朗 | 2018-07-19 23:05:41 | React/前端 |

------

[ANT DESIGN PRO - 开箱即用的中台前端/设计解决方案](https://pro.ant.design/index-cn)

这是一个爬坑的过程，感觉像拿着左轮PK高达，甚至一度怀疑人生。在做电子货币交易系统这个项目的时候，也是我第一个说出来用antd，感觉就像给自己挖了一个坑，因为随后就看到了antd pro，然后就用上了。由于等级相差太多了，所以上手第一步，显示把它所用到的知识点都去学一遍。react-router、redux-saga、dva、mockJs......好了吧，学习好了基础知识点，要上手了。好家伙，又是一道难题。整个项目结构就九曲十八弯。写上一片文章纪念一下我所爬过的坑。

踏上了解antd pro源码的学习路径（只是一部分，纯个人理解和学习，欢迎指正）

### 添加菜单栏

下手地：`src/common/menu.js`

会发现有个`menuData`的常量，这就是用来管理整个菜单栏的内容。

```JavaScript
{
  name: 'dashboard',      // 大标题
  icon: 'dashboard',      // 图标
  path: 'dashboard',      // 路径 - 针对react-router
  children: [             // 小标题组
    {
      name: '分析页',      // 小标题
      path: 'analysis',   // 路径 - 针对react-router
    },
    {
      name: '监控页',
      path: 'monitor',
    },
    {
      name: '工作台',
      path: 'workplace',
      // hideInBreadcrumb: true,
      // hideInMenu: true,
    },
  ],
},
```

在menuData数组中添加新的对象就可以开新的菜单栏内容。

### 添加菜单栏对应的内容路由

下手地：`src/common/router.js`

对应`getRouterData`下的`routerConfig`，用于配置菜单栏中每个标题对应用上了什么model，需要渲染的组件是哪些。

```JavaScript
'/': {
  component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
},
'/dashboard/analysis': {
  component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
},
'/dashboard/monitor': {
  component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
},
'/dashboard/workplace': {
  component: dynamicWrapper(app, ['project', 'activities', 'chart'], () =>
    import('../routes/Dashboard/Workplace')
  ),
  // hideInBreadcrumb: true,
  // name: '工作台',
  // authority: 'admin',
},
```

`dynamicWrapper`，顾名思义：动态包装。

```JavaScript
const dynamicWrapper = (app, models, component) => {
	...
}
```

主要涉及了dva、react-router的知识点，从第二个参数说起，这个models是dva中的model，主要是集成了redux + effect(redux-saga) + reducers，添加了哪个model就能用哪个model中的state和一些操作。像钢铁侠的Mark1到Mark50外加钢铁爱国者，各有各的作用嘛。

### 添加菜单栏对应的内容

下手地：`src/routes/...`与`src/components/...`

写个react，作为内容展示。当然不用重新补充header、footer、nav，这才是react-router好处的地方之一。这一部分官方已经给出了一个较为详细的教程，这里就不瞎赘述了。

[新增页面](https://pro.ant.design/docs/new-page-cn) & [新增业务组件](https://pro.ant.design/docs/new-component-cn)

### 添加model

下手地：`src/models/...`

需要具备Dva的知识。结构：

```JavaScript
export default {
  namespace: 'list',

  state: {
    list: [],
  },

  effects: {
    ...
  },

  reducers: {
    ...
  },
};
```

在这里添加你所需要的业务操作，无论是更改state还是异步请求在更改state，都在此处完成。而在effects中用的是`redux-saga`，所以还要学习`Generator生成器`方面的知识。

关于`namespace`，其实就是一个指路人，稍后再论。

### 添加api请求模块

下手地：`src/services/api.js`

在查看源码的时候。会在model的第一行看到`import { ... } from '../services/api';`，顺藤摸瓜来看这个文件。

```JavaScript
import request from '../utils/request';
// GET
export async function queryProjectNotice() {
  return request('/api/project/notice');
}
// POST
export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}
```

> 为了方便管理维护，统一的请求处理都放在`services`文件夹中。
> `utils/request.js`是基于fetch的封装，便于统一处理POST，GET等请求参数，请求头，以及错误提示信息等。

通常到这里就结束了，因为api直接发送给后端获取数据，再一步步网上返回。实现修改数据。但是要是没有后端的情况下，就要接着用`mockJs`了。

### 模仿后端返回数据

下手地：`.roadhogrc.mock.js`

这一块比较简单，在`proxy`中对应的api返回对应的什么数据就完成了。而有些数据量大的则用额外的文件保存放在`src/mock/...`。

---

打着打着发现[官方文档](https://pro.ant.design/docs/getting-started-cn)其实也挺好的，可是在刚上手的时候比较晦涩吧。

都是自己的一些愚见。跳级打大佬的感觉其实在做的时候也不是那么好，可是在做的过程中学习到一些框架的结构和用法，感觉还是很新奇的。确实在看着陌生的代码又看不懂的情况下是比较难受的，要说有什么办法嘛，找到对应的知识点和原理死磕，这算不算一种办法呢？

参考资料：

* [一起玩react 10分钟带你入门ant-design-pro](https://blog.csdn.net/luo1055120207/article/details/78953381)
* [ant-design-pro Authorized权限组件设计](https://zhuanlan.zhihu.com/p/34665872)
* [ant-design-pro菜单路由组织方式](https://zhuanlan.zhihu.com/p/34641003)




