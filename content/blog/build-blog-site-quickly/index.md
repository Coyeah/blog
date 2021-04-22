---
title: 找到一个快速搭建博客的方式
date: "2021-04-21T15:22:55.000Z"
description: 
---

最近又双叒叕整理自己的博客网站，发现一个可以比较快速搭建自己博客的方式，非常适合懒的我，**极其简单**地记录下流程。由于自己是个小前端，所以这个方式比较偏前端。

## 利用 gatsby

### 1. 安装

```bash
# 安装 gatsby 脚手架
npm install -g gatsby-cli
# 下载一个模版
gatsby new my-blog-starter https://github.com/gatsbyjs/gatsby-starter-blog
# 跑起来
cd my-blog-starter
npm install
npm start
```

### 2. 修改配置

gatsby 的配置在 `gatsby-config` 这个文件里设置；

```javascript

module.exports = {
  siteMetadata: {
    title: `Gatsby Starter Blog`,		// 文章标题
    author: {
      name: `Kyle Mathews`,		// 你的名字
      summary: `who lives and works in San Francisco building useful things.`,		// 一句话总结下自己
    },
    description: `A starter blog demonstrating what Gatsby can do.`,
    siteUrl: `https://gatsbystarterblogsource.gatsbyjs.io/`,
    social: {
      twitter: `kylemathews`,
    },
  },
	...
}
```

外加一些快速生成模版的能力；

```bash
# 需要额外安装一个库支持一下
npm install --save-dev oops-blogger
```

`package.json` 中的 `script` 添加一个新的命令：

```json
{
  "script": {
    "new": "blogger -r ./content/blog -d iso"
  }
}
```

完成了这两步，你就能通过 `npm run new` 来生成模板，可以在这个 `content/blog/{filename}` 路径下开始你的第一篇博文了！并且 `npm start` 后看到你的成果。

### 3. 修改样式

这里不做一一列举了。只需要对 `src` 下的 css 一通改，就能整理出你想要的样式。自带的样式就很简约。

## 构建

```bash
npm run build
```

构建出的 `public` 文件里的所有东西就是整个我们的网站了。

## 丢上 github

这里主要是用到的 github page。这个的使用就不赘述了，网上资料很多。随手找到一个[应该如何使用Github Pages?](https://developer.mozilla.org/zh-CN/docs/Learn/Common_questions/Using_Github_pages)

跟着上面的教程，把 `public` 文件中的内容 push 上去。

## 至此

done! perfect!