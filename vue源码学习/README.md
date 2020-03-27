## [常用操作解读](https://github.com/dinghuahua/blog/blob/master/vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/%E5%B8%B8%E7%94%A8%E6%93%8D%E4%BD%9C%E8%A7%A3%E8%AF%BB.md)
## [Vue.js源码目录结构](https://github.com/dinghuahua/blog/blob/master/vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/vue.js%20%E6%BA%90%E7%A0%81%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84.md)
## [Vue.js响应式原理](https://github.com/dinghuahua/blog/tree/master/vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/Vue.js%E5%93%8D%E5%BA%94%E5%BC%8F%E5%8E%9F%E7%90%86.md)
## [Vue.js依赖收集](https://github.com/dinghuahua/blog/tree/master/vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/Vue.js%E4%BE%9D%E8%B5%96%E6%94%B6%E9%9B%86%E5%8E%9F%E7%90%86.md)
## [从Vue.js源码角度再看数据绑定]()
## [Vue.js事件机制]()
## [VNode节点(Vue.js实现)]()
## [Virtual DOM与diff(Vue.js实现)]()
## [聊聊Vue.js的template编译]()
## [Vue.js异步更新DOM策略及nextTick]()
## [从template到DOM（Vue.js源码角度看内部运行机制）]()
https://segmentfault.com/a/1190000012922342
几种内部方法
_c：对应的是 createElement 方法，顾名思义，它的含义是创建一个元素(Vnode)
_v：创建一个文本结点。
_s：把一个值转换为字符串。（eg: {{data}}）
_m：渲染静态内容
假设我们有这么一段 template

<template>
  <div id="test">
    {{val}}
    <img src="http://xx.jpg">
  </div>
</template>
最终会被转换成这样子的函数字符串

{render: "with(this){return _c('div',{attrs:{"id":"test"}},[[_v(_s(val))]),_v(" "),_m(0)])}"}

## [Vuex源码解析]()
## [聊聊keep-alive组件的使用及其实现原理]()