vue实例化到渲染到页面(上)

本篇目的是介绍vue实例化到挂载到dom的整体路线。

从new Vue()开始
所有的一切都是从 new Vue()开始的，所以从这个点开始探寻这个过程发生了什么。
从源码中找到Vue构造函数的声明，src/core/instance/index.js
``` javascript
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```
是一个很简洁的function工厂模式声明的一个构造函数。
内部做了逻辑判断：构造函数调用必须有 new 关键字。

然后执行了this._init(options)，该初始化函数就是Vue 初始化的开始。

Vue.prototype._init()
this._init()是在何时声明的呢？通过下边5个初始化函数的执行，在Vue原型链中添加了大量的的属性与函数。this._init()实际就是调用了原型链上的Vue.prototype._init()函数。

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
Vue.prototype._init函数是在initMixin(Vue)中去添加到原型链上的。在src/core/instance/init.js中定义
``` javascript
Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```
_init主要做了这两件事：<br>
1.初始化（包括生命周期、事件、render函数、state等）。<br>
2.$mount组件。

_init函数内部又通过上边的这种调用初始化函数的模式完成了具体模块的初始化。声明钩子的调用也首次在这里出现，通过分析这些函数调用顺序，能更好的理解官方文档中提及的各个生命周期钩子函数的触发时机。

``` javascript
initLifecycle(vm)
initEvents(vm)
initRender(vm)
callHook(vm, 'beforeCreate')
initInjections(vm) // resolve injections before data/props
initState(vm)
initProvide(vm) // resolve provide after data/props
callHook(vm, 'created')
```

在生命钩子beforeCreate与created之间会初始化state，在此过程中，会依次初始化props、methods、data、computed与watch，这也就是Vue.js对options中的数据进行“响应式化”（即双向绑定）的过程。对于Vue.js响应式原理不了解的同学可以先看一下笔者的[Vue.js响应式原理]()和[Vue.js依赖收集原理]()

在_init()函数的最后，通过判断vm.$options.el是否存在进行执行vm.$mount()。vm代表的是当前vue实例也就是构造函数被调用后的this指向。

$mount是何时在vue上声明的呢？这次并不是在上边的初始化函数中完成声明的。因为 $mount 这个方法的实现是和平台（web/weex）、构建方式都相关，所以在不同构建入口文件中有不同的定义(本文只讨论web)。

Vue.prototype.$mount
原型上声明的 $mount方法在 src/platform/web/runtime/index.js 中定义,这个方法会被runtime only版本和含编译器完整版中复用。
在$mount过程中，如果是使用独立构建，则会在此过程中将template编译成render function。当然，你也可以采用运行时构建。

[运行版 vs 运行版+编译 ](https://cn.vuejs.org/v2/guide/installation.html#%E8%BF%90%E8%A1%8C%E6%97%B6-%E7%BC%96%E8%AF%91%E5%99%A8-vs-%E5%8F%AA%E5%8C%85%E5%90%AB%E8%BF%90%E8%A1%8C%E6%97%B6)
如果想要调试vue的编译原理，需要用运行+编译版本的，[编译原理的介绍可以看笔者这篇文章 ](./Vue.js 模板解析器原理.md)

``` javascript
// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

现在接着上边Vue.prototype._init函数中调用了vm.$mount函数，实际上是执行了mountComponent(this, el, hydrating)函数。

mountComponent定义在目录src/core/instance/lifecycle.js中
``` javascript
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        )
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
      }
    }
  }
  callHook(vm, 'beforeMount')

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```
抛开源码中对性能测试和异常警告部分的代码，这个函数内部做了以下事情：

callHook(vm, 'beforeMount'),调用生命周期钩子beforeMount
声明了updateComponent函数(vm.render,vm.updata())
new Watcher (vm, updateComponent, noop, {... callHook(vm, 'beforeUpdate')}})
callHook(vm, 'mounted')，调用生命周期钩子mounted
这里的new Watcher()实例化了Watcher类，内部逻辑先不去深入
(如果想深究，可以查看笔者的这两篇文章[响应式原理]()[依赖收集]())，这里仅仅需要知道的是在这个实例化的过程中调用了作为参数传入的updateComponent函数，而从这个函数的声明来看，它实际上执行的是vm._update(vm._render(), hydrating)这个函数。

首先vm._update和vm._render这两个方法是定义在Vue原型上的。

Vue.prototype._render
Vue 的 _render 方法是用来把实例渲染成一个vnode(虚拟Node)。是在renderMixin(Vue)执行时声明的。它定义在 src/core/instance/render.js 文件中

``` javascript
Vue.prototype._render = function (): VNode {
  const vm: Component = this
  const { render, _parentVnode } = vm.$options

  // reset _rendered flag on slots for duplicate slot check
  if (process.env.NODE_ENV !== 'production') {
    for (const key in vm.$slots) {
      // $flow-disable-line
      vm.$slots[key]._rendered = false
    }
  }

  if (_parentVnode) {
    vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject
  }

  // set parent vnode. this allows render functions to have access
  // to the data on the placeholder node.
  vm.$vnode = _parentVnode
  // render self
  let vnode
  try {
    vnode = render.call(vm._renderProxy, vm.$createElement)
  } catch (e) {
    handleError(e, vm, `render`)
    // return error render result,
    // or previous vnode to prevent render error causing blank component
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      if (vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
        } catch (e) {
          handleError(e, vm, `renderError`)
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    } else {
      vnode = vm._vnode
    }
  }
  // return empty vnode in case the render function errored out
  if (!(vnode instanceof VNode)) {
    if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
      warn(
        'Multiple root nodes returned from render function. Render function ' +
        'should return a single root node.',
        vm
      )
    }
    vnode = createEmptyVNode()
  }
  // set parent
  vnode.parent = _parentVnode
  return vnode
}
```
函数内部对不同逻辑有不同的处理，但最终返回的都是VNode。
Virtual DOM 就是用一个原生的 JS 对象去描述一个 DOM 节点。[vnode可以参考这篇文章]()

Vue.prototype._update函数
_update是在lifecycleMixin(Vue)函数执行时添加的。在目录src/core/instance/lifecycle.js

``` javascript
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }
```
通过源码看接受的参数：

vnode: VNode<br>
hydrating?: boolean<br>
接受的第一个参数类型是VNode（用来描述dom节点的虚拟节点）,第二个布尔类型的参数是跟ssr相关。

函数内部最关键的执行了vm.$el = vm.__patch__(...)
调用 vm.__patch__ 去把 VNode 转换成真正的 DOM 节点

**现在回顾总结一下目前的流程：

new Vue()操作后，会调用Vue.prototype._init()方法。完成一系列初始化（原型上添加方法和属性）
执行Vue.prototype.$mount
vm._render()获取描述当前实例的VNode
vm._update(VNode)，调用 vm.__patch__转换成真正的 DOM 节点

流程图：

<img src="https://github.com/dinghuahua/blog/blob/master/vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/images/data12.png" width="60%">

vue-update.png