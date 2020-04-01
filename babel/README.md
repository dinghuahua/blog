babel 到底做了什么？怎么做的？
简单来说把 JavaScript 中 es2015/2016/2017/2046 的新语法转化为 es5，让低端运行环境(如浏览器和 node )能够认识并执行。本文以 babel 6.x 为基准进行讨论。最近 babel 出了 7.x，放在最后聊。

严格来说，babel 也可以转化为更低的规范。但以目前情况来说，es5 规范已经足以覆盖绝大部分浏览器，因此常规来说转到 es5 是一个安全且流行的做法。

如果你对 es5/es2015 等等也不了解的话，那你可能真的需要先补补课了。

使用方法
总共存在三种方式：

使用单体文件 (standalone script)
命令行 (cli)
构建工具的插件 (webpack 的 babel-loader, rollup 的 rollup-plugin-babel)。
其中后面两种比较常见。第二种多见于 package.json 中的 scripts 段落中的某条命令；第三种就直接集成到构建工具中。

这三种方式只有入口不同而已，调用的 babel 内核，处理方式都是一样的，所以我们先不纠结入口的问题。

运行方式和插件
babel 总共分为三个阶段：解析，转换，生成。

babel 本身不具有任何转化功能，它把转化的功能都分解到一个个 plugin 里面。因此当我们不配置任何插件时，经过 babel 的代码和输入是相同的。

插件总共分为两种：

当我们添加 语法插件 之后，在解析这一步就使得 babel 能够解析更多的语法。(顺带一提，babel 内部使用的解析类库叫做 babylon，并非 babel 自行开发)
举个简单的例子，当我们定义或者调用方法时，最后一个参数之后是不允许增加逗号的，如 callFoo(param1, param2,) 就是非法的。如果源码是这种写法，经过 babel 之后就会提示语法错误。

但最近的 JS 提案中已经允许了这种新的写法(让代码 diff 更加清晰)。为了避免 babel 报错，就需要增加语法插件 babel-plugin-syntax-trailing-function-commas

当我们添加 转译插件 之后，在转换这一步把源码转换并输出。这也是我们使用 babel 最本质的需求。
比起语法插件，转译插件其实更好理解，比如箭头函数 (a) => a 就会转化为 function (a) {return a}。完成这个工作的插件叫做 babel-plugin-transform-es2015-arrow-functions。

同一类语法可能同时存在语法插件版本和转译插件版本。如果我们使用了转译插件，就不用再使用语法插件了。

配置文件
既然插件是 babel 的根本，那如何使用呢？总共分为 2 个步骤：

将插件的名字增加到配置文件中 (根目录下创建 .babelrc 或者 package.json 的 babel 里面，格式相同)
使用 npm install babel-plugin-xxx 进行安装
具体书写格式就不详述了。

preset
比如 es2015 是一套规范，包含大概十几二十个转译插件。如果每次要开发者一个个添加并安装，配置文件很长不说，npm install 的时间也会很长，更不谈我们可能还要同时使用其他规范呢。

为了解决这个问题，babel 还提供了一组插件的集合。因为常用，所以不必重复定义 & 安装。(单点和套餐的差别，套餐省下了巨多的时间和配置的精力)

preset 分为以下几种：

官方内容，目前包括 env, react, flow, minify 等。这里最重要的是 env，后面会详细介绍。
stage-x，这里面包含的都是当年最新规范的草案，每年更新。
这里面还细分为
Stage 0 - 稻草人: 只是一个想法，经过 TC39 成员提出即可。
Stage 1 - 提案: 初步尝试。
Stage 2 - 初稿: 完成初步规范。
Stage 3 - 候选: 完成规范和浏览器初步实现。
Stage 4 - 完成: 将被添加到下一年度发布。
例如 syntax-dynamic-import 就是 stage-2 的内容，transform-object-rest-spread 就是 stage-3 的内容。
此外，低一级的 stage 会包含所有高级 stage 的内容，例如 stage-1 会包含 stage-2, stage-3 的所有内容。
stage-4 在下一年更新会直接放到 env 中，所以没有单独的 stage-4 可供使用。
es201x, latest
这些是已经纳入到标准规范的语法。例如 es2015 包含 arrow-functions，es2017 包含 syntax-trailing-function-commas。但因为 env 的出现，使得 es2016 和 es2017 都已经废弃。所以我们经常可以看到 es2015 被单独列出来，但极少看到其他两个。
latest 是 env 的雏形，它是一个每年更新的 preset，目的是包含所有 es201x。但也是因为更加灵活的 env 的出现，已经废弃。
执行顺序
很简单的几条原则：

Plugin 会运行在 Preset 之前。
Plugin 会从前到后顺序执行。
Preset 的顺序则 刚好相反(从后向前)。
preset 的逆向顺序主要是为了保证向后兼容，因为大多数用户的编写顺序是 ['es2015', 'stage-0']。这样必须先执行 stage-0 才能确保 babel 不报错。因此我们编排 preset 的时候，也要注意顺序，其实只要按照规范的时间顺序列出即可。