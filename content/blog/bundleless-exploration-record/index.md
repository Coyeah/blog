---
title: bundleless一次探索记录
date: "2020-07-29T15:23:27.000Z"
description: 
---

探索的过程中写下的一个 demo。[传送门](https://github.com/Coyeah/snowpack-demo)。

第一次看到 `bundleless` 这个单词是从一篇博文上，随后知道了 `snowpack`。关键词：**不打包的构建工具**、**替代 webpack**、**ESM**、**vite**......

搜索 `snowpack` 网上有很多关于 snowpack 各种优势劣势的相关博文，以及与 webpack 的对比；谈及 snowpack 的优势，快；首先是**冷启动快**。因为不需要过多的打包，所以只需要处理修改后的单个文件，构建速度的优化，毋庸置疑的快。

## 一些原理

```html
<script type="module" src="/_dist_/index.js"></script>
```

原理基于浏览器原生支持 ESM（ECMAScript modules），把原本在 webpack 上完成的工作交付给浏览器完成。：基本主流的浏览器版本都支持直接使用 ESM 了。

### node_modules

snowpack 把所有从 node_modules 中引用的文件都分别打包至 `web_modules` 文件夹中，以供 import；对于源码对直接引用 `node_modules` 的模块都做了路径的替换，换成了 `/web_modules/` 并返回回去。即 `import React from 'react'` 转变为 `import React from '/web_modules/react'`；

默认情况下它将尝试安装 package.json 中 "dependencies" 列出的所有的依赖模块，如果模块定义了 ESM 格式的入口文件（即 package.json 有 "module" 字段），则会解析出其最小化的依赖关系，并将它和所依赖的模块都分别打包成一个单独的、浏览器环境能够原生支持的 ESM JS 文件，统一整理到 web_modules 文件夹中。

### CSS 与 CSS Modules

经过处理后会生成 `index.css.proxy.js`，内容则是通过 createEleme 向 head 插入 style；

snowpack 中启用 CSS Module 必须要以 `.module.css` 结尾，只有这样才会将文件特殊处理；

### 静态资源处理

同样处理成 `logo.svg.proxy.js`，导出的是静态资源的实际文件路径。

## 一些总结

一开始接触，是新奇；从而会去思考打包的必要性，打包工具主要解决了模块化和合并请求两个痛点；而在 HTTP/2 普及与 5G 时代的到来，把一部分内容分散请求变得可以接受了，而模块化浏览器则提供了支持；再者打包工具的越来越复杂，此消彼长自然难免不去思考。

snowpack 的优点：

+ 全量构建快，增量构建也快。不需要打包，减少 CPU 消耗和等待时间，提升开发体验；
+ 源码对于打包工具的依赖比较低，在 webpack 的项目，可能会因使用 import 语法导入各种非 JS 资源和依赖 plugin 处理代码导致比较难替换了；
+ 依赖模块和源码间相互独立，相当于直接做了 code spliting，可以高效利用缓存来提高性能，项目重新发布时也不用让用户重新获取整个包。

终归是有缺点的：

+ 把传统的 bundle 文件拆分成一堆小文件，多请求难免受制于浏览器 HTTP 请求并发和并行的瓶颈；
+ 没有生态，相关的工具链很缺；
+ 当前还有很多 npm 模块并没有提供 ESM 格式的导出文件，这也是最致命的。

因此 snowpack 主要的应对场景是开发环境（热更新速度很快），官方也提供了 `@snowpack/plugin-webpack` 插件工具来应对生产模式，但是在学习过程中，尝试代 webpack-dev-server，但还是存在很多坑等不稳定因素，比较难满足业务场景。

是一个很棒的学习机会，整体思路是非常棒的，也是对未来的一次认知，相信未来会用得上。在早期源码不多的情况下，能学到更贴近作者原始想法的东西，也算是很不错的收获。

> In 2019, you should use a bundler because you want to, not because you need to.

## 一些坑位

### package.json

需要去掉 `homepage` 字段。否则在执行 `snowpack build` 的时候会失败；使用 `@snowpack/plugin-webpack` 时，会获取 homepage 作为 baseUrl 使用，但是 npm 创建的 package 时 homepage 指向的是项目 readme。或者在 `snowpack.config.js` 中修改配置， `buildOptions: { baseUrl: '/'  }` 即可。

### lodash-es

`The Lodash library exported as ES modules.`

在 snowpack 构建的项目中，我们常常会这样使用：`import { isString } from 'lodash';`。但是如果所用到的项目不是通过 ES modules 导出的，就能使用这种解构的使用方式；

再直接导致的问题，就是打包的包过大，不能做到按需加载；

### 关于 babel

在原有项目中，会加很多插件来支持**箭头函数**、**async/await**、**Classes**等等的ES2015+特性，而在 snowpack 中，因为应用原理，每个支持`<script type="module">`的浏览器都可以直接使用，也不需要额外打包一个 polyfill 文件；

同样如果使用 `@snowpack/plugin-webpack` ，`bundle: true` 的时候，还是需要配置一些 babel 来优化，但是插件本身就会支持一些 runtime 的处理；

## 参考文档

+ [替代 webpack？带你了解 snowpack 原理，你还学得动么](https://zhuanlan.zhihu.com/p/149351900)
+ [Webpack 打包太慢？来试试 Bundleless 吧！](https://developer.aliyun.com/article/768060)
+ [ES modules: A cartoon deep-dive](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)
+ [What are CJS, AMD, UMD, and ESM in Javascript?](https://dev.to/iggredible/what-the-heck-are-cjs-amd-umd-and-esm-ikm)
+ [面向未来的中后台场景'伪'微前端几点想法](https://zhoukekestar.github.io/notes/2020/06/08/micro-frontends.html)

