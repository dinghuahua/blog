

```flow
s=start:开始
e=end:结束
o=operation:操作项

s-o-e
```

```flow
st=>start: Start:>https://www.zhihu.com
io=>inputoutput: verification
op=>operation: Your Operation
cond=>condition: Yes or No?
sub=>subroutine: Your Subroutine
e=>end

st->io->op->cond
cond(yes,right)->e
cond(no)->sub->io
```

```flow
    st=>start: Start
    e=>end: End
    op1=>operation: My Operation
    sub1=>subroutine: My Subroutine
    cond=>condition: Yes or No?
    io=>inputoutput: catch something...
    st->op1->cond
    cond(yes)->io->e
    cond(no)->sub1(right)->op1
```

```mermaid
	graph TB
	A[Apple]-->B{Boy}
	A---C(Cat)
	B.->D((Dog))
	C==喵==>D
	style A fill:#2ff,fill-opacity:0.1,stroke:#faa,stroke-width:4px
	style D stroke:#000,stroke-width:8px;
```

mermaid
graph LR
    start[开始] --> input[输入A,B,C]
    input --> conditionA{A是否大于B}
    conditionA -- YES --> conditionC{A是否大于C}
    conditionA -- NO --> conditionB{B是否大于C}
    conditionC -- YES --> printA[输出A]
    conditionC -- NO --> printC[输出C]
    conditionB -- YES --> printB[输出B]
    conditionB -- NO --> printC[输出C]
    printA --> stop[结束]
    printC --> stop
    printB --> stop)



# blog
记录学习过程，积累知识点
Record the learning process and accumulate knowledge points

## [git 命令行的操作](https://github.com/dinghuahua/blog/blob/master/git-study/git%E6%95%99%E7%A8%8B.md)
## [HTML和CSS常见问题整理](https://github.com/dinghuahua/blog/blob/master/html-css/html-css.md)
## [router 中 hash 和 history 的整理](https://github.com/dinghuahua/blog/blob/master/router/vue-router-history-hash.md)
## [todo https和http 1.1 2 的对比](http:www.baidu.com)
## [todo websocket和ajax 的对比](http:www.baidu.com)
## [todo eventloop](http:www.baidu.com)
## [todo cdn](http:www.baidu.com)
## [todo 浏览器缓存  强缓存  协议缓存](http:www.baidu.com)
## [todo 微信公众号授权](http:www.baidu.com)
## [todo 懒加载  时间戳](http:www.baidu.com)
## [todo 进阶题目](http:www.baidu.com)
## [todo 进阶题目](http:www.baidu.com)
## [todo 进阶题目](http:www.baidu.com)
## [todo webpack - 热部署时间](http:www.baidu.com)
## [todo webpack -load](http:www.baidu.com)
3月18日：你必须要掌握的新一代异步交互2.0技术

3月19日：JavaScript密码，探寻那些不为人知的底层API

3月20日：中高级前端大厂面试JS性能常考题之防抖节流

3月21日：前端架构师核心技能之一  高性能模板引擎开发

3月22日：搭建一个属于你的聊天室

3月23日：手撸网易内部纯前端报表生成

3月24日：全自定义页面布局算法 - 让用户定制（User-Defined）他的最爱

谈谈你对CSS布局的理解

讲讲输入完网址按下回车，到看到网页这个过程中发生了什么。

谈谈你对Web前端组件化的理解，Web Component会带来怎样的影响

谈谈你对前端资源下载性能优化的经验和思考

现在有很多的MV*框架，你对它们有什么看法

iOS体验好在哪里，Web能赶上么？

网页游戏怎么做？

Hybrid技术应当如何应用？
浏览器所有进程 和线程

你最爱的前端框架是什么，为什么？
【进阶1期】 调用堆栈
【进阶2期】 作用域闭包
【进阶3期】 this全面解析
【进阶4期】 深浅拷贝原理
【进阶5期】 原型Prototype
【进阶6期】 高阶函数
【进阶7期】 事件机制
【进阶8期】 Event Loop原理
【进阶9期】 Promise原理
【进阶10期】Async/Await原理
【进阶11期】防抖/节流原理
【进阶12期】模块化详解
【进阶13期】ES6重难点
【进阶14期】计算机网络概述
【进阶15期】浏览器渲染原理
【进阶16期】webpack配置
【进阶17期】webpack原理
【进阶18期】前端监控
【进阶19期】跨域和安全
【进阶20期】性能优化
【进阶21期】VirtualDom原理
【进阶22期】Diff算法
【进阶23期】MVVM双向绑定
【进阶24期】Vuex的原理
【进阶25期】Redux原理
【进阶26期】路由原理
【进阶27期】VueRouter源码解析
【进阶28期】ReactRouter源码解析


