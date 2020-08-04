---
title: 'webpack配置总结'
date: '2019-04-07 11:33:23'
tag: 'Webpack'
path: 'webpack-configuration-summay'
---

## webpack 学习与配置总结

### What is webpack

一款 JS 代码模块化的打包工具。

`webpack-cli` 是使用 webpack 的命令行工具，4.x 版本后使用。

### webpack 核心概念

+ **entry**：一个可执行模块或库的入口文件。
+ **chunk**：多个文件组成一个代码块。体现了 webpack 的打包机制。
+ **loader**：文件转换器。
+ **plugin**：插件，用于拓展 webpack 的功能。

### webpack 构建流程

1. 解析 webpack 配置参数，合并从 shell 传入和 webpack.config.js 文件里配置的参数，生产最后的配置结果。
2. 注册所有配置的插件，好让插件监听 webpack 构建生命周期的事件节点，以做出对应的反应。
3. 从配置的 entry 入口文件开始解析文件构建 AST 语法树，找出每个文件所依赖的文件，递归下去。
4. 在解析文件递归的过程中根据文件类型和 loader 配置找出合适的 loader 用来对文件进行转换。
5. 递归完后得到每个文件的最终结果，根据 entry 配置生成代码块 chunk。
6. 输出所有 chunk 到文件系统。

### 一个简单的 webpack 配置

```JavaScript
const path = require('path')
const UglifyPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  // 入口
  entry: './src/index.js',

  // 出口
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  // loader（转换器）
  module: {
    rules: [
      {
        test: /\.jsx?/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: 'babel-loader',
      },
    ],
  },

  // 代码模块路径解析的配置
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, 'src')
    ],

    extensions: [".wasm", ".mjs", ".js", ".json", ".jsx"],
  },

  // plugin（插件）
  plugins: [
    new UglifyPlugin(),
    // 使用 uglifyjs-webpack-plugin 来压缩 JS 代码
    // 如果你留意了我们一开始直接使用 webpack 构建的结果，你会发现默认已经使用了 JS 代码压缩的插件
    // 这其实也是我们命令中的 --mode production 的效果，后续的小节会介绍 webpack 的 mode 参数
  ],
}
```

### 相关 plugin 与 loader

#### html-webpack-plugin

在使用该插件会为项目创建一个 HTML 文件，并会引用构建出的 JS 文件。也可以通过该插件传递一个自定义（已写好的）HTML 模板。

```JavaScript
module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 配置输出文件名和路径
      template: 'assets/index.html', // 配置文件模板
    }),
  ],
}
```

亦可以通过该插件实例化多个 HTML 页面。

#### css-loader 与 style-loader

+ css-loader 负责解析 CSS 代码，主要为了处理 CSS 中的依赖。
+ style-loader 会把 css-loader 解析的结构转为 JS 代码，运行时动态插入 `style` 标签中。

```JavaScript
module.exports = {
  module: {
    rules: [
      // ...
      {
        test: /\.css/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: true, // 使用 css 的压缩功能
            },
          },
          {
            loader: "postcss-loader",
            options: { plugins: [autoprefixer()] }
          }
        ]
      },
    ],
  }
}
```

#### less-loader

CSS 预处理器的相关 loader。

```JavaScript
module.exports = {
  module: {
    rules: [
      // ...
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: true, // 使用 css 的压缩功能
              module: true, // 开启模块化
            },
          },
          {
            loader: 'less-loader',
             options: {
               javascriptEnabled: true,
             },
           }
        ]
      }
    ],
  }
}
```

#### url-loader 与 file-loader

项目中使用的图片，webpack 不能直接处理。通过添加处理图片的插件进行处理。

```JavaScript
module.exports = {
  // ...
  module: {
    rules: [{
      test: /\.(gif|jpg|jpeg|png|svg)$/,
      use: [{
        loader: "url-loader",
        query: {
          limit: 8192,
          name: "images/[name]-[hash:5].[ext]"
        }
      }, {
        loader: "image-webpack-loader",
        options: {
          mozjpeg: { // 压缩 jpeg 的配置
            progressive: true,
            quality: 65
          },
          optipng: { // 使用 imagemin-optipng 压缩 png，enable: false 为关闭
            enabled: false,
          },
          pngquant: { // 使用 imagemin-pngquant 压缩 png
            quality: '65-90',
            speed: 4
          },
          gifsicle: { // 压缩 gif 的配置
            interlaced: false,
          },
          webp: { // 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
            quality: 75
          },
        }
      }]
    }],
  },
}
```

通过设置 `limit`，如果文件小于字节限制，则可以返回 DataURL。

#### Babel

在 webpack 配置 Babel，以便于代码中使用 ES6，ES7 标准来编写 JS 代码。

Babel 的相关配置可以在目录下使用 .babelrc 文件来处理。

```JavaScript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.jsx?/, // 支持 js 和 jsx
        include: [
          path.resolve(__dirname, 'src'), // src 目录下的才需要经过 babel-loader 处理
        ],
        loader: 'babel-loader',
      },
    ],
  },
}
```

### 启动静态服务

通过 webpack-dev-server 在本地开启一个简单的静态服务来进行开发。

在项目下安装 webpack-dev-server，然后添加启动命令到 package.json 中：

```JSON
"scripts": {
  "build": "webpack --mode production",
  "start": "webpack-dev-server --mode development"
}
```

### webpack 解析代码模块路径

webpack 在构建的时候，会解析依赖后再进行加载依赖的模块文件。webpack 在引用时，区分 `./index.js` 和 `react`（区分代码模块或第三方库）是通过模块 `enhanced-resolve` 来处理依赖模块路径的解析的。该模块可以说是 Node.js 的模块路径解析的增强版本，有很多可以自定义的解析配置。

#### 关于 Node.js 的模块机制

CommonJS 规范解决了一下问题：

+ 没有模块系统。没有原生的支持密闭作用域或依赖管理
+ 没有标准库。除了一些核心库外，没有文件系统的 API，没有 IO 流 API 等。
+ 没有标准接口。没有像 Web Server 或者数据库的统一接口。
+ 没有包管理系统。不能够自动加载和安装依赖。

而 Node.js 就是 CommonJS 规范的实现，其自身实现了 require 方法作为其引入模块的方法，同时 NPM 也基于 CommonJS 定义的包规范，实现了依赖管理和模块自动安装等功能。

Node.js 的模块分为两类，一类为原生（核心）模块，一类为文件模块。原生模块在 Node.js 源代码编译的时候编译进了二进制执行文件，加载的速度最快。另一类文件模块是动态加载的，加载速度比原生模块慢。但是 Node.js 对原生模块和文件模块都进行了缓存，于是在第二次 require 时，是不会有重复开销的。其中原生模块都被定义在 lib 这个目录下面，文件模块则不定性。

require 方法中的文件查找策略：（按优先级排序）

+ 文件模块缓存区
+ 原生模块缓存区
+ 原生模块
+ 文件模块

#### webpack 上的一些配置

##### resolve.alias

对常用的文件模块在webpack配置上配置，减少编写相对路径的麻烦。

```JavaScript
alias: {
  utils: path.resolve(__dirname, 'src/utils') // 这里使用 path.resolve 和 __dirname 来获取绝对路径
}
```

如果需要进行精确匹配可以使用：

```JavaScript
alias: {
  utils$: path.resolve(__dirname, 'src/utils') // 只会匹配 import 'utils'
}
```

##### resolve.extensions

该配置可以定义在进行模块路径解析时，webpack 会尝试帮你补全那些后缀名来进行查找

```JavaScript
extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx'],
// 这里的顺序代表匹配后缀的优先级，例如对于 index.js 和 index.jsx，会优先选择 index.js
```

##### resolve.modules

这样配置在某种程度上可以简化模块的查找，提升构建速度。

```JavaScript
resolve: {
  modules: [
    path.resolve(__dirname, 'node_modules'), // 指定当前目录下的 node_modules 优先查找
    'node_modules', // 如果有一些类库是放在一些奇怪的地方的，你可以添加自定义的路径或者目录
  ],
},
```

##### resolve.mainFields

当引用的是一个模块或者一个目录时，会使用 package.json 文件的哪一个字段下指定的文件，默认的配置是这样的：

```JavaScript
resolve: {
  // 配置 target === "web" 或者 target === "webworker" 时 mainFields 默认值是：
  mainFields: ['browser', 'module', 'main'],

  // target 的值为其他时，mainFields 默认值为：
  mainFields: ["module", "main"],
},
```

##### resolve.mainFiles

当目录下没有 package.json 文件时，会默认使用目录下的 index.js 这个文件，其实这个也是可以配置的，是的，使用 resolve.mainFiles 字段，默认配置是：

```JavaScript
resolve: {
  mainFiles: ['index'], // 你可以添加其他默认使用的文件名
},
```

通常情况下无须修改这个配置，index.js 基本就是约定俗成的了。

##### resolve.resolveLoader

这个字段 resolve.resolveLoader 用于配置解析 loader 时的 resolve 配置，原本 resolve 的配置项在这个字段下基本都有。默认的配置：

```JavaScript
resolve: {
  resolveLoader: {
    extensions: ['.js', '.json'],
    mainFields: ['loader', 'main'],
  },
},
```

这里提供的配置相对少用，一般遵从标准的使用方式，使用默认配置，然后把 loader 安装在项目根路径下的 node_modules 下就可以了。

### 开发与生产环境的构建配置

mode 的概念是在 webpack 4.x 引入的。在运行 webpack 时指定使用 `production` 或 `development` 其中一个。

+ production mode：默认启动各种性能优化功能，包括构建结果优化和webpack运行性能优化。
+ development mode：开启 debug 工具，运行时打印详细的错误信息，快速的增量编译构建。

### webpack 3.x 区分环境

因为 webpack 的运行环境是 Node.js，因此可以通过 Node.js 提供的机制给要运行的 webpack 程序传递环境变量。

```JSON
{
  "scripts": {
    "build": "NODE_ENV=production webpack",
    "develop": "NODE_ENV=development webpack-dev-server"
  }
}
```

在 webpack.config.js 文件中可以通过 process.env.NODE_ENV 来获取命令行传入的环境变量。

```JavaScript
const config = {
  // ... webpack 配置
}

if (process.env.NODE_ENV === 'production') {
  // 生产环境需要做的事情，如使用代码压缩插件等
  config.plugins.push(new UglifyJsPlugin())
}

module.exports = config
```

在应用代码运行时，也可以通过 process.env.NODE_ENV 获取。

```JavaScript
export default function log(...args) {
  if (process.env.NODE_ENV === 'development' && console && console.log) {
    console.log.apply(console, args)
  }
}
```

在 webpack 3.x 中需要通过 DefinePlugin 插件，来定义变量。

```JavaScript
module.exports = {
  // ...
  // webpack 的配置

  plugins: [
    new webpack.DefinePlugin({
      // webpack 3.x 的 process.env.NODE_ENV 是通过手动在命令行中指定 NODE_ENV=... 的方式来传递的
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
}
```

#### 环境差异配置

+ 生产环境
  + 分离 CSS 成单独文件，以便于多个页面共享一个 CSS 文件
  + 压缩 HTML/CSS/JS
  + 压缩图片
+ 开发环境
  + 生成 sourcemap 文件
  + 打印 debug 信息
  + live reload 或 hot reload 功能

webpack 4.x 的 mode 为 preduction 时默认使用 JS 代码压缩，而 mode 为 development 时默认启用 hot reload。

*sourcemap: 是一个信息文件，里面储存着位置信息。即转换后的代码的每一个位置，所对应的转换前的位置。
*live reload：自动刷新页面
*hot reload：热加载

### 资源优化加载

#### 图片压缩

通过 image-webpack-loader 来压缩文件。

```JavaScript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /.*\.(gif|png|jpe?g|svg|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {}
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: { // 压缩 jpeg 的配置
                progressive: true,
                quality: 65
              },
              optipng: { // 使用 imagemin-optipng 压缩 png，enable: false 为关闭
                enabled: false,
              },
              pngquant: { // 使用 imagemin-pngquant 压缩 png
                quality: '65-90',
                speed: 4
              },
              gifsicle: { // 压缩 gif 的配置
                interlaced: false,
              },
              webp: { // 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
                quality: 75
              },
          },
        ],
      },
    ],
  },
}
```

url-loader 配置 limit，将其转换为一个 base64 编码的 DataURL。

```JavaScript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 单位是 Byte，当文件小于 8KB 时作为 DataURL 处理
            },
          },
        ],
      },
    ],
  },
}
```

#### 代码压缩

html-webpack-plugin 插件可以生成所需要的 HTML 并对其压缩。

```JavaScript
module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 配置输出文件名和路径
      template: 'assets/index.html', // 配置文件模板
      minify: { // 压缩 HTML 的配置
        minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
        minifyJS: true // 压缩 HTML 中出现的 JS 代码
      }
    }),
  ],
}
```

css-loader 提供了压缩 CSS 代码的功能。

```JavaScript
module.exports = {
  module: {
    rules: [
      // ...
      {
        test: /\.css/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: true, // 使用 css 的压缩功能
            },
          },
        ],
      },
    ],
  }
}
```

#### 分离代码文件

CSS 文件分离，可在 webpack 中使用 extract-text-webpack-plugin。

JS 文件分离，在 3.x 版本中使用 CommonsChunkPlugin 来作代码分离的，而 4.x 则把相关的功能包装到 optimize.splitChunks 中，直接使用配置实现代码分离。
