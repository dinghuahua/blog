vue 实例化到渲染到页面(下)

``` javascript
main.js
import './App.vue'
new Vue({
render:h=>(app)
}).$mount("#app")
先调用Vue方法实例化这个对象(main里面的vue对象)
然后调用.$mount
有 render 这个方法 h=>(app) ，h 就是 createElement 这个方法
调用 render 其实就是直接调用 createElement(vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); }) =>_createElement()
  创建元素的时候发现 入参app是一个组件
    进入到create-component中
      先实现Sub构造器/Ctor （即Sub继承于Vue）但此时并没有new Sub(), 仅仅知识实现来一个继承于Vue的构造方法
          Ctor = Vue.extend(Ctor); // 此时的Ctor 是app.vue 文件默认抛出来出来的{...template:"",methods:{}，component:{}...等等}
          基于Vue 方法实现Sub继承Vue, Sub.Super指向Vue变成，但是每调用一次create-component方法Sub的cid++，原本的Vue.cid不会加加
    根据Ctor判断是否是异步组件
    创建app组件对应的vnode(仅仅知识组件空间的一个空格类似一个父节点) 
    并且注入组件的钩子 
    `{
      on:{}, 
      hook{
        init:()=>{
          // child = new Sub()
          // child/$mount(vnode.elm)
        }
      }
    }`
到此 main.js 中 vue 实例的 render 方法调用完毕，
并会将返回值 vnode 作为参数，开始调用_update 方法
进入 vm._updata,也就是进入 vnode diff 阶段 
  oldnode 是真实的#app 节点，newnode 是组件 app 组件对应的 vnode(仅仅知识组件空间的一个空格类似一个父节点)
  先为 oldnode 真实的元素#app 创建对应的 vnode=>oldvnode
  找到老节点的父元素
  为 newvnode 开始创建元素 createElm
  判断是不是组件
    开始在 patch 中调用创建组件的方法（会触发原本创建组件的钩子）createComponent
    createComponent
      这里会有闭包，保存当前组件实例
      var i= newvnode.data
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /_ hydrating _/)
      }
      判断 newvnode 有木有 hook.init 钩子(有就代表是之前的 App 组件) 有进入到钩子中，
      hook.init 钩子的做的事情
        为当前 newvnode(组件)创建 Sub 实例
        等同于 new Vue()操作，得到有个 vue 实例 child = new Sub()
        手动触发 child 的$mount
          child.$mount(newvnode.elm)
    然后就开始递归 \$mount 的流程
    
  递归结束后 newvno 是一个包含来 App.vue 标签的 vnode(中间是通过 parent 找到 parentvnode,elm 对应真实的节点,document.createElement,document.insertBefore 等方式挂载到父节点和创建节点以及其他一些 dom 上的关于节点的操作)

    回到为newvnode开始创建元素createElm中的createComponent这个流程里面
    initComponent(vnode, insertedVnodeQueue)
    insert(parentElm, vnode.elm, refElm)
    插入结束后会在页面上看到出现dom

    如果是通过old一开始没有vnode就是真实的节点或者oldvnode 和newvnode不相同 这种方式的那么就删除老节点，也就以为这#app 这个标签会被删除
patch 方法调用结束后会返回此次操作的真实的跟节点elm，赋值到vm.$el

全部调用结束（中间有生成 watch,在监听着数据上的变化，触发相应的方法）
```