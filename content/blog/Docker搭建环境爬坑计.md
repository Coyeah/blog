---
title: 'Docker搭建环境爬坑计'
date: '2020-03-19 17:50:30'
tag: 'Node/Docker'
path: 'docker-develop-env-construction'
---

Docker desktop 在电脑里吃了好几个月的灰，一直也没下手把玩，恰巧有个机会迫使自己开始用 docker 搭建起服务器和数据库了。涉及 Eggjs 和 mysql 的基础项目搭建。留个笔记。[docker gitbook](https://yeasy.gitbooks.io/docker_practice/content/)

## Eggjs 部署

要部署上 docker，首先在项目中新建一个 `Dockerfile` 的文件。

``` dockerfile
# 拉取要创建的新镜像的 base image（基础镜像），类似于面向对象里边的基础类
FROM node:8.11.3-alpine

# 设置时区
ENV TIME_ZONE=Asia/Shanghai

# 在容器内运行命令
RUN \
  mkdir -p /usr/src/app \
  && apk add --no-cache tzdata \
  && echo "${TIME_ZONE}" > /etc/timezone \ 
  && ln -sf /usr/share/zoneinfo/${TIME_ZONE} /etc/localtime 

# 创建 docker 工作目录
WORKDIR /usr/src/app

# 拷贝，把本机当前目录下的 package.json 拷贝到 Image 的 /usr/src/app/ 文件夹下
COPY package.json /usr/src/app/

# 使用 npm 安装 app 所需要的所有依赖
# RUN npm i

RUN npm i --registry=https://registry.npm.taobao.org

# 拷贝本地的所有文件到路径中去
COPY . /usr/src/app

# 暴露端口。如果程序是一个服务器，会监听一个或多个端口，可以用 EXPOSE 来表示这个端口
EXPOSE 7001

# 给容器指定一个执行入口
CMD npm run start
```

Dockerfile 的指令详解 》[传送门](https://www.runoob.com/docker/docker-dockerfile.html)，还有最佳实践，[传送门](https://www.jianshu.com/p/cbce69c7a52f)。

通过命令执行：

```bash
docker build -t myegg .
docker run -itd -p 7001:7001 --name myegg myegg
```

命令中有个 `.`，是上下文路径，是指 docker 在构建镜像，有时候想要使用到本机的文件（比如复制），docker build 命令得知这个路径后，会将路径下的所有内容打包。

+ **-t**：在容器指定一个伪终端或者终端；
+ **-i**：进行命令交互；
+ **-p**：匹配镜像内的网络端口号，即我们可以通过宿主机中访问5000端口来达到访问容器8080端口的目的；

docker 命令大全 》[传送门](https://www.runoob.com/docker/docker-command-manual.html)，还有一些教程，[Docker删除容器与镜像](https://blog.csdn.net/qq_32447301/article/details/79387649)、[MacOS Docker安装及使用](https://segmentfault.com/a/1190000017151019)。

### 注意事项

[官方文档](https://eggjs.org/zh-cn/core/deployment.html) 中介绍了应用部署的使用，有两点需要排雷。

+ 因为我们的 Docker 已经是后台运行了，在部署的时候需要去掉 `--daemon`，不能运行在后台的后台，会被 docker 机制关闭掉容器
+ 我们需要加上 `--port=7001`，因为 Docker 里有环境变量 PORT，如果不加上，会默认使用 Docker 里的环境变量，这个变量 PORT 是随机生成的数字，所以在正式部署的时候就会开启这个随机数生成的端口，从而报错。

以上修改都是在 package.json 文件中

## 还有一些用到的

进入一个正在运行的 Docker 容器命令：

```bash
docker ps
docker exec -it myegg /bin/sh
```

Docker 查看容器IP地址：

```bash
docker inspect myegg
```

Networks > bridge > IPAddress

### 参考资料：

+ [使用Docker部署Egg.js应用及Docker常用命令](https://hanhan.pro/deploy-eggjs-app-with-docker/)

## MySQL 部署

```bash
# 第一步，从 Docker 仓库中下载 MySQL 的官方镜像。我用的版本是 `8.0.19`。
docker pull mysql:8.0.19
# 第二步，运行一个容器。
docker run --name mysql8019 -e MYSQL_ROOT_PASSWORD=123456 -itd -p 53306:3306 --restart=always mysql:8.0.19
# docker mysql 就已经搭建好了。通过命令就可以从宿主机进入这个数据库
mysql -h 127.0.0.1 -P 53306 -u root -p
```

这里有个问题就是发现一直没办法通过 `Sequel Pro` 来连接 docker mysql。报错如下：

```javascript
'caching_sha2_password' cannot be loaded: dlopen(/usr/local/mysql/lib/plugin/caching_sha2_password.so, 2): image not found
```

这个不仅仅是在连接 docker mysql 中会出现的问题，即便本地安装的 mysql 也会有这样的问题。因为 MySql8.0 版本 和 5.0 的加密规则不一样，而现在的可视化工具只支持旧的加密方式。此问题有两种方法，一种是更新 Navicat 驱动来解决此问题，另一种是将 MySQL 用户登录的加密规则修改为 mysql_native_password，第一种方法我试过了没有起作用，我这里采用第二种方法。

在进入 mysql 中操作如下：

```bash
# 修改root 可以通过任何客户端连接
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
# 刷新权限信息
flush privileges;
```

## 容器间互联

```bash
# 创建一个网络 my-net
docker network create my-net
# 创建 docker 容器的时候就指定桥接网络，以 mysql 与 eggjs 举例
docker run --name mysql8019 -e MYSQL_ROOT_PASSWORD=123456 -itd -p 53306:3306 --restart=always --network my-net mysql:8.0.19
docker run -itd -p 7001:7001 --name myegg --network my-net myegg
```

Done！通过容器名称即可 ping 通在同一网桥的容器。也可以直接 ping 其IP。

## 关于 Docker

Docker 是一个可以用来快速部署的**轻量级虚拟技术**，允许开发人员将自己的程序和运行环境一起打包，省去了每次都安装各种依赖和环境的麻烦。

### 镜像（Image）

操作系统分为内核和用户空间。

对于 Linux 而言，内核启动后，会挂载 root 文件系统为其提供用户空间支持。而 Docker Image，就相当于是一个 root 文件系统。

除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。

### 容器（Container）

Image 和 Container 的关系，就像是面向对象程序设计中的`类`和`实例`一样，镜像是静态的定义，容器是镜像运行时的实体。

### 仓库（Docker Registry）

镜像构建完成后，可以很容易的在当前宿主机上运行，但是，如果需要在其它服务器上使用这个镜像，我们就需要一个集中的存储、分发镜像的服务，Docker Registry 就是这样的服务。

### Docker 架构

![Docker 架构图 1](https://www.coyeah.top/source/docker_architecture_1.png)

宿主机上主要是运行 `Docker Daemon` 的核心程序，也就是负责做各种各样的操作。客户端通过命令 Daemon 来做实际的操作。

![Docker 架构图 2](https://www.coyeah.top/source/docker_architecture_2.png)
