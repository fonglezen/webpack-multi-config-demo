# 将webpack单配置拆分为多个配置进行并行构建

当我们的应用达到某种程度的庞大时，我们可能需要考虑如何提高应用的生产构建速度，将大应用拆分为小应用的集合往往是比较好的办法，比如架构调整，将项目拆分为微前端架构，又或者将单个代码库拆分多个代码库等。

而本文要讲的是其中一种方案，就是通过拆分webpack单配置为多配置，使用并行构建提高构建速度。

## 1、新建 DEMO 

要研究这种方案是否可行，最好的方式是先创建一个简单的demo去验证，而不是在复杂庞大的应用上直接上手，因为项目的复杂度，可能会增加方案研究的难度。

这个demo需要满足这些条件：包含多个功能模块，每个功能模块都有一个入口文件；

### （1）包含多个功能模块

应用架构的设计，往往是需要将应用根据不同的功能进行划分，提高应用的可维护性。所以将应用简化到demo中，则需要在demo中根据项目结构，简化功能模块，创建一个类似与大应用的简化版本。

在demo工程中创建应用目录结构：

```
/src
-- index.js 
-- /apps
---- /users
---- /products
```

### （2）每个功能模块都有一个入口文件

这个方案的目标是，将每个功能模块都拆分为单独的webpack配置进行构建，那么每个功能模块都需要一个入口才可以执行，所以我们还需要为每个功能模块创建一个入口文件。

每个功能模块添加入口文件，同时添加公共功能模块文件：
```
/src
-- index.js 
-- /apps
---- /users
------ index.js
---- /products
------ index.js
---- /common
------ apis.js
------ utils.js
```
这样demo的目录结构创建完成。

## 2、安装开发依赖

虽然webpack5是最新的版本，但是需要优化的历史项目往往是webpack4的，我们当然可以选择webpack5重构配置，但是目前还说并不建议这样做，毕竟webpack5还需要等待生态完善起来。

但是基本思路和配置是几乎相同的，不管是webpack4还是webpack5，我们都需要对配置进行拆分。webpack4我们可以借助 `parallel-webpack` 工具实现并行构建，而webpack5只需要在配置文件中添加一行代码即可：

```js
// 这是webpack 5.22.0+ 新增的功能
// https://webpack.js.org/configuration/configuration-types/#parallelism
module.exports.parallelism = 3;
```

安装webpack4和webpack-cli：

```bash
npm init -y
npm i webpack@^4 webpack-cli -D

# 安装成功后依赖的版本：
# + webpack@4.46.0
# + webpack-cli@4.6.0
```

我们还需要借助 parallel-webpack 实现并行构建，安装parallel-webpack：
```bash
npm i parallel-webpack -D
```
在package.json中添加相关脚本：
```json
{
  "scripts": {
    "build": "webpack --config webpack.config.js",
    "build:parallel": "node parallel-webpack.js"
  }
}
```
根据执行的脚本，先添加好响应的配置文件。

```js
// ./webpack.config.js 
// webpack 单配置场景
module.exports = {
  mode: 'production'
}
```

```js
// ./parallel-webpack.js
// 并行构建脚本
var run = require('parallel-webpack').run,
    configPath = require.resolve('./webpack.parallel.config.js');

run(configPath, {
    watch: false,
    maxRetries: 1,
    stats: true,
    maxConcurrentWorkers: 4
});
```

```js
// ./webpack.parallel.config.js
// webpack多配置场景
module.exports = [

];
```

命令行终端执行这两个命令，均没有报错，开发依赖准备完成。
```bash
npm run build

# 打印以下内容

> webpack --config webpack.config.js

Hash: 0b2fe076091c99fcec7d
Version: webpack 4.46.0
Time: 65ms
Built at: 2021-05-05 16:48:27
  Asset       Size  Chunks             Chunk Names
main.js  930 bytes       0  [emitted]  main
Entrypoint main = main.js
[0] ./src/index.js 0 bytes {0} [built]


```

```bash
npm run build:parallel

# 打印以下内容

> node parallel-webpack.js

[WEBPACK] Building 0 targets
[WEBPACK] Finished build after 0.03 seconds

```