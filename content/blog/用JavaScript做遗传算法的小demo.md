---
title: '用JavaScript做遗传算法的小Demo'
date: '2019-03-29 16:28:33'
tag: 'JavaScript/算法'
path: 'genetic-algorithm-with-javascript'
---

前言：有一次在知乎上看到一篇文章，介绍遗传算法的，并且用遗传算法来训练一群像素小鸟，优化出一只通关相当厉害的像素鸟。又一次在知乎上看到一篇文章，用 JavaScript 来做一个遗传算法的小 Demo，就是本文要介绍的小 Demo，学习那位大兄弟的代码出来的给自己练个手，实在抱歉没能搜回那个大兄弟的项目地址，就没有 post 出来了。

## 遗传算法

> 遗传算法（Genetic Algorithm）是模拟达尔文生物进化论的自然选择和遗传学机理的生物进化过程的计算模型，是一种通过模拟自然进化过程搜索最优解的方法。

初高中生物教过我们，基因是产生一条多肽链或功能 RNA 所需的全部核苷酸序列，带有遗传讯息的 DNA 片段称为基因。通过不同的基因组合，构建出不同的个体。而我们的目的，就是在一个种群里面，通过繁衍，即基因的不断组合最终获取到我们要的目标各地，就像我们要的是一只能够通一百关的像素小鸟。而在繁衍的过程中，要充分体现出随机性和优胜劣汰的遗传规则，所以与目标个体越相近的，则有着更大的机会被保留并生产出下一代，而在生产出下一代的过程中，还有参杂基因突变的可能性。

简单来说就是从模仿染色体的结构不断地递归式组合,最后形成一个目标个体。

## 动手写 Demo

我们的目的是初始化一堆字符串，然后通过遗传算法，最终得到我们想要的字符串内容，**You are more powerful than any other person.**

该 Demo 中通过对字符串随机生成一个初始种群，然后组合形成新的种群，再进行组合......直至出现目标个体，或者超过预设的繁衍次数，毕竟总不可能让他不断地递归下去吧，因为有可能运气不好还真的不出现目标个体。

一开始我看到这个的时候，我以为是以字符为单位，后来看到大兄弟的代码，其实更甚者是用 **0** 与 **1** 来作为基础单位。妙啊~

Github 项目[传送门](https://github.com/Coyeah/genea)，如果喜欢，给我一个 Star。

## 第一步：初始化种群

```JavaScript
initPopulation () {
  this.currentGeneration = 1;
  this.populations = [];
  for (let i = 0, len = this.populationSize; i < len; i++) {
    let gene = getRandomGene(this.geneLength);     // 生成随机的基因组合，以 0 和 1 为单位，每个字母对应的是一个串二进制数字。
    this.populations.push(gene);                   // 把生成好的个体放入种群数组当中
  }
  this.makeFitnesses();                            // 计算一次种群当中每个个体的健康度（个体中与目标个体相同的基因数量 / 个体长度）
}
```

## 第二步：繁衍

```JavaScript
populationBreed () {
 if (this.judge()) return;                        // 判断是否种群当中是否出现了目标个体，或者繁衍次数已经超过预设的值
 this.currentGeneration++;
 let oldPopulations = this.populations;
 let newPopulations = [];
 for (let i = 0, len = oldPopulations.length; i < len; i++) {
   let father = this.rotate();                    // 在种群当中随机挑取一个父亲，当然不是完全随机的，这里要体现优胜劣汰。我们在第三部的时候探究一下。
   let mother = this.rotate();                    // 在种群当中随机挑取一个母亲
   let child = this.crossOver(father, mother);    // 根据父母的基因组合成新的个体，这个很好理解，就是一般一般嘛
   child = this.mutate(child);                    // 变异，在孩子的基因中随机一个位置取反，即 0 > 1 或 1 > 0
   newPopulations.push(child);
 }
 this.populations = newPopulations;
 this.makeFitnesses();
 return this.populationBreed();                   // 重复步骤，就是不断的繁衍
}
```


### 第三步：随机又优胜劣汰下选择父母

```JavaScript
rotate () {
  let pos = Math.random();
  let soFar = 0;
  for (let i = 0, len = this.fitnesses.length; i < len; i++) {
    let fitness = this.fitnesses[i];
    soFar += fitness;
    if (soFar / this.totalFitness >= pos) {
      return this.populations[i];
    }
  }
}
```

阅读下源码体会一下各种奥妙，我觉得这一块很值得回味。

随意一个数值 `pos` 和定义一个为 0 的变量 `soFar`，种群里面顺序遍历，会把个体的健康度加入 `soFar` 中，如果超过 `pos`，那就决定是你了！

妙就妙在这，如果你健康度高，其实很容易就会超过这个随机值，当然也有运气不好的时候，前面健康度高的给后面健康度低的做了嫁妆。所以体现了优胜劣汰，又饱含随机性的一段代码。


## 图解

![Demo 过程图解](https://www.coyeah.top/source/flow.jpg)
