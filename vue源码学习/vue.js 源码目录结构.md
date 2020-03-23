## Vue 源码分析—— 目录结构

一，Vue.js 的源码都是在src 目录下，其目录结构如下。

1.compiler 目录包含Vue.js 所有编译相关的代码。它包括把所有模板解析成ast 语法树， ast 语法树优化等功能。<br>
2.core 目录 包含了Vue.js 的核心代码，包括内置组件，全局API封装，Vue 实例化，观察者，虚拟DOM, 工具函数等等。<br>
* (1) observer     相应系统，包含数据观测的核心代码。
* (2) vdom     包含虚拟DOM 创建（creation）和打补丁(patching) 的代码
* (3) instance  包含Vue 构建函数设计相关的代码
* (4) global-api   包含给Vue 构造函数挂在全局（静态方法）或属性的代码
* (5）components  包含抽象出来的通用组件

 3.platform Vue.js 是一个跨平台的MVVM 框架，它可以跑在web上，可以跑在weex, 分别打包成运行在web 上和weex 上的Vue.js<br>
 4.server  Vue.js 2.0 支持了服务端渲染，所有服务端渲染相关的逻辑都在这个目录下，注意，这部部分代码是跑在服务端的Node.js, 不要和跑在浏览器端的Vue.js 混为一谈。<br>
 
1. web 平台
    - entry-runtime.js     运行时构建的入口，不包含模板（template）到render 函数的编译器，所不支持template 选项我们使用vue 默认导出的就是一个运行时的版本。
    - entry-runtime-with-compiler.js    独立构建版本的入口，它在entry-runtime 的基础上添加了模板(template) 到render 函数的编译器
    - entry-compiler.js     vue-template-compiler 包的入口文件
    - entry-server-renderer.js     vue-server-renderer 包的入口文件
    - entry-server-basic-renderer.js     输出  packages/vue-server-renderer/basic.js
2. weex    混合应用

5.sfc  通常我们开发 Vue.js 都会借助 webpack 构建，然后通过.vue 单文件来编写组件。<br>
6. shared  Vue.js 会定义歇一下工具方法，这里定义的工具方法都是会陪浏览器端的Vue.js 和 服务端的Vue.js 所共享的。

二，配置文件

　　(1)package.json           

　　(2)yarn.lock   yarn 锁定文件

　 （3) .editorconfig   针对编辑器的编码风格配置的文件

　　(4) .flowconfig    flow 的配置文件

　　(5).babelrc        babel 配置文件

　　(6).eslintrc        eslint  配置文件

　 （7).eslintignore        eslint  忽略文件

　 （8).gitignore           git 忽略文件

三，test    包含所有测试文件

四，packages   存放独立发布的包的目录

五，flow   类声明，检查器

六，examples  存放一些使用Vue 开发的应用案例

七，dist      构建后文件的 输入目录

八，scripts     构建相关我文件