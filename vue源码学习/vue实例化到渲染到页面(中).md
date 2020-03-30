vue实例化到渲染到页面(中)

vm._update()方法内部执行了vm.__patch__(...),patch方法的作用是把 VNode 转换成真正的 DOM 节点。

方法在目录src/platforms/web/runtime/index.js中定义

// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop
patch方法是函数createPatchFunction返回的

``` javascript
import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules)

export const patch: Function = createPatchFunction({ nodeOps, modules })
```
// patch方法接受4个参数：
function patch (oldVnode, vnode, hydrating, removeOnly) { ... }

``` javascript
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
这里对createComponent(vnode, insertedVnodeQueue, parentElm, refElm)的返回值做了判断，如果为 true则直接结束

createComponent
如果 vnode 是一个组件 VNode，那么条件会满足，并且得到 i 就是 init 钩子函数， init 钩子函数，定义在 src/core/vdom/create-component.js 中

``` javascript
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
let i = vnode.data
if (isDef(i)) {
  const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
  if (isDef(i = i.hook) && isDef(i = i.init)) {
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

init钩子的中，执行了createComponentInstanceForVnode。它是通过 createComponentInstanceForVnode 创建一个 Vue 的实例，然后调用 $mount 方法挂载子组件。

``` javascript
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
createComponentInstanceForVnode的源码：该函数return出了：new vnode.componentOptions.Ctor(options)。

改option多了两个属性：

_isComponent: true,

_parentVnode: vnode,

这两个属性会使vue实例化子组件时走不同的处理逻辑。
``` javascript
export function createComponentInstanceForVnode (
  vnode: any, // we know it's MountedComponentVNode but flow doesn't
  parent: any, // activeInstance in lifecycle state
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

因为 JavaScript 是一个单线程，所以Vue 整个初始化是一个深度遍历的过程，通过上边这种递归的把子组件都实例化并挂载在父组件中。

负责渲染成 DOM 的函数是 createElm，刚才只是分析了VNode为vue组件时的场景，下面看源码分析其他逻辑。
``` javascript
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

当传入的VNode是描述普通的dom的vnode时， createComponent()会返回false, createElm会执行下面的逻辑。

createChildren函数实际就是遍历children(子 VNode )去调用createElm方法

``` javascript
function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      if (process.env.NODE_ENV !== 'production') {
        checkDuplicateKeys(children)
      }
      for (let i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
    }
}
```
在遍历的过程中，如果遇到子 VNode 是一个组件的 VNode,则重复了刚才介绍的组件VNode的逻辑，也就是createComponent方法。

在完成组件的整个 patch 过程后，最后执行 insert(parentElm, vnode.elm, refElm) 完成组件的 DOM 插入，如果组件 patch 过程中又创建了子组件，那么DOM 的插入顺序是先子后父。

结合生命周期的话，created钩子是父组件到子组件的顺序被调用，mounted钩子则是由子元素到父元素的顺序被调用。

流程图：

<img src="https://github.com/dinghuahua/blog/blob/master/vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/images/data13.png" width="60%">

patch.png