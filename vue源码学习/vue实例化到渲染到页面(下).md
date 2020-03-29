vue 实例化到渲染到页面(下)

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
    并且注入组件的钩子 {on:{}, hook{
      init:()=>{
        // child = new Sub()
        // child/$mount(vnode.elm)
}}}
到此 main.js 中 vue 实例的 render 方法调用完毕，并会将返回值 vnode 作为参数，开始调用\_update 方法
进入 vm.\_updata,也就是进入 vnode diff 阶段 oldnode 是真实的#app 节点，newnode 是组件 app 组件对应的 vnode(仅仅知识组件空间的一个空格类似一个父节点)
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

回顾上一篇，vm.\_update()方法内部执行了 vm.**patch**(...),patch 方法的作用是把 VNode 转换成真正的 DOM 节点。
方法在目录 src/platforms/web/runtime/index.js 中定义

// install platform patch function
Vue.prototype.**patch** = inBrowser ? patch : noop
patch 方法是函数 createPatchFunction 返回的

```javascript
import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules)

export const patch: Function = createPatchFunction({ nodeOps, modules })
```

// patch 方法接受 4 个参数：
function patch (oldVnode, vnode, hydrating, removeOnly) { ... }

```javascript
createElm
patch 的过程会调用 createElm 创建元素节点:

function createElm (
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  // ...
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }
  // ...
}
```

这里对 createComponent(vnode, insertedVnodeQueue, parentElm, refElm)的返回值做了判断，如果为 true 则直接结束

createComponent
如果 vnode 是一个组件 VNode，那么条件会满足，并且得到 i 就是 init 钩子函数， init 钩子函数，定义在 src/core/vdom/create-component.js 中

```javascript
function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
    if (isDef((i = i.hook)) && isDef((i = i.init))) {
      i(vnode, false /* hydrating */)
    }
    // after calling the init hook, if the vnode is a child component
    // it should've created a child instance and mounted it. the child
    // component also has set the placeholder vnode's elm.
    // in that case we can just return the element and be done.
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue)
      insert(parentElm, vnode.elm, refElm)
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
      }
      return true
    }
  }
}
```

init 钩子的中，执行了 createComponentInstanceForVnode。它是通过 createComponentInstanceForVnode 创建一个 Vue 的实例，然后调用 \$mount 方法挂载子组件。

```javascript
init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
  if (
    vnode.componentInstance &&
    !vnode.componentInstance._isDestroyed &&
    vnode.data.keepAlive
  ) {
    // kept-alive components, treat as a patch
    const mountedNode: any = vnode // work around flow
    componentVNodeHooks.prepatch(mountedNode, mountedNode)
  } else {
    const child = vnode.componentInstance = createComponentInstanceForVnode(
      vnode,
      activeInstance
    )
    child.$mount(hydrating ? vnode.elm : undefined, hydrating)
  }
}
```

createComponentInstanceForVnode 的源码：该函数 return 出了：new vnode.componentOptions.Ctor(options)。
改 option 多了两个属性：

\_isComponent: true,
\_parentVnode: vnode,
这两个属性会使 vue 实例化子组件时走不同的处理逻辑。

```javascript
export function createComponentInstanceForVnode(
  vnode: any, // we know it's MountedComponentVNode but flow doesn't
  parent: any // activeInstance in lifecycle state
): Component {
  const options: InternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent
  }
  // check inline-template render functions
  const inlineTemplate = vnode.data.inlineTemplate
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render
    options.staticRenderFns = inlineTemplate.staticRenderFns
  }
  return new vnode.componentOptions.Ctor(options)
}
```

因为 JavaScript 是一个单线程，所以 Vue 整个初始化是一个深度遍历的过程，通过上边这种递归的把子组件都实例化并挂载在父组件中。

负责渲染成 DOM 的函数是 createElm，刚才只是分析了 VNode 为 vue 组件时的场景，下面看源码分析其他逻辑。

```javascript
function createElm(
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  // ...
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }

  const data = vnode.data
  const children = vnode.children
  const tag = vnode.tag
  if (isDef(tag)) {
    // ...

    vnode.elm = vnode.ns
      ? nodeOps.createElementNS(vnode.ns, tag)
      : nodeOps.createElement(tag, vnode)
    setScope(vnode)

    /* istanbul ignore if */
    if (__WEEX__) {
      // ...
    } else {
      createChildren(vnode, children, insertedVnodeQueue)
      if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue)
      }
      insert(parentElm, vnode.elm, refElm)
    }

    // ...
  } else if (isTrue(vnode.isComment)) {
    vnode.elm = nodeOps.createComment(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  } else {
    vnode.elm = nodeOps.createTextNode(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  }
}
```

当传入的 VNode 是描述普通的 dom 的 vnode 时， createComponent()会返回 false, createElm 会执行下面的逻辑。

createChildren 函数实际就是遍历 children(子 VNode )去调用 createElm 方法

```javascript
function createChildren(vnode, children, insertedVnodeQueue) {
  if (Array.isArray(children)) {
    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(children)
    }
    for (let i = 0; i < children.length; ++i) {
      createElm(
        children[i],
        insertedVnodeQueue,
        vnode.elm,
        null,
        true,
        children,
        i
      )
    }
  } else if (isPrimitive(vnode.text)) {
    nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
  }
}
```

在遍历的过程中，如果遇到子 VNode 是一个组件的 VNode,则重复了刚才介绍的组件 VNode 的逻辑，也就是 createComponent 方法。

在完成组件的整个 patch 过程后，最后执行 insert(parentElm, vnode.elm, refElm) 完成组件的 DOM 插入，如果组件 patch 过程中又创建了子组件，那么 DOM 的插入顺序是先子后父。

结合生命周期的话，created 钩子是父组件到子组件的顺序被调用，mounted 钩子则是由子元素到父元素的顺序被调用。

流程图：

<img src="https://github.com/dinghuahua/blog/blob/master/vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/images/data13.png" width="60%">

patch.png
