### 知识点

- include 表示只有匹配到的组件会被缓存，可以用字符串、正则表达式或一个数组来表示，并且源码中会监听此属性的变化，所以可以动态赋值
- exclude 表示任何匹配到的组件都不会被缓存，可以用字符串、正则表达式或一个数组来表示，并且源码中会监听此属性的变化，所以可以动态赋值
  1. include 和 exclude 的匹配首先检查组件自身的 name 选项(name 的指的是和 data 或者 prop 等平级的 key,即 new Vue 中 name 的 key,options.name 的值，name 和)，
  2. 如果 name 选项不可用，则匹配它的局部注册名称 (即父组件 components 选项的键值,也就是在父组件中 html 中，即 template 中写的标签名 tag，此 tag 也就是 components 选项的键值)。匿名组件不能被匹配
- max 表示缓存组件的数量，因为我们是缓存的 vnode 对象，它也会持有 DOM，当我们缓存的组件很多的时候，会比较占用内存，所以该配置允许我们指定缓存组件的数量，当超过数量时，第 0 个会出栈
- `<keep-alive>` 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中，即最终页面标签上是不会这个标签的，但是有对应的 vnode
- 当组件在 `<keep-alive>`内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行
- `<keep-alive>` 不会在函数式组件中正常工作，因为它们没有缓存实例
- `<keep-alive>` 是用在其一个直属的子组件被开关的情形, `<keep-alive>` 要求同时只有一个子元素被渲染（即只渲染第一个子元素，其他自元素直接丢弃）

### keep-alive 源码分析

```javascript
import { isRegExp, remove } from 'shared/util'
import { getFirstComponentChild } from 'core/vdom/helpers/index'

type VNodeCache = { [key: string]: ?VNode }

// name的获取
function getComponentName(opts: ?VNodeComponentOptions): ?string {
  // 当前 Ctor组件的构造器，Ctor继承于Vue, options 即data,props,methods等这些 name就是和这些平级的key,即new Vue(options),即参数的.name
  // tag 也就是父组件 components 选项的键值,也就是在父组件中html中，即template中写的标签名tag，此tag也就是components 选项的键值
  return opts && (opts.Ctor.options.name || opts.tag)
}

// 判断 name 在不在  pattern 中，也就是pattern 是否匹配得到 name
function matches(
  pattern: string | RegExp | Array<string>,
  name: string
): boolean {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}
// 修改 keep-alive 的缓存
function pruneCache(keepAliveInstance: any, filter: Function) {
  // 当前实例对象，中间有proxy
  // cache缓存 是一个对象，{key:vnode}
  // keys cache中所有key的集合 一个数组
  // _vnode 当前对应vnode
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const cachedNode: ?VNode = cache[key]
    if (cachedNode) {
      const name: ?string = getComponentName(cachedNode.componentOptions)
      // filter 实际调用的就是matches这个方法 即在没有匹配到时
      if (name && !filter(name)) {
        // 进入修改 keep-alive 的缓存
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}

// 进入修改 keep-alive 的缓存
function pruneCacheEntry(
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  // 有缓存 并且 当前vnode没有的情况下，对应的组件实例就被销毁
  // 或者有缓存 当前缓存的 tag不等于 current.tag  也直接销毁
  // 扩展  这里可以考虑做 动态 缓存， 即之前缓存过 然后销毁
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  // 清除 缓存中 key 对应的vnode 以及keys中的key
  cache[key] = null
  remove(keys, key)
}

const patternTypes: Array<Function> = [String, RegExp, Array]

export default {
  name: 'keep-alive',
  // 抽象组件
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created() {
    this.cache = Object.create(null)
    this.keys = []
  },

  destroyed() {
    // 组件 销毁时，清空所有的缓存
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted() {
    // 监听 include exclude 的变化
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },

  render() {
    const slot = this.$slots.default
    // 只获取第一个子元素
    const vnode: VNode = getFirstComponentChild(slot)
    const componentOptions: ?VNodeComponentOptions =
      vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      // 第一个子元素的name
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        // 当 include 不匹配 第一个子元素的name
        // 或者 excluded 匹配到  第一个子元素的name
        // 就默认展示 第一个子元素  但不缓存（人家知识不缓存而已，但页面上符合业务逻辑时要展示信息啊）

        return vnode
      }
      // 有匹配到 就进入下面的缓存阶段

      const { cache, keys } = this
      // null 为真
      // key 值的形式 Ctor.cid(第几次调用Sub这个方法从1开始++) +::+ tag标签名=》 比如(4::myheader)
      const key: ?string =
        vnode.key == null
          ? // same constructor may get registered as different local components
            // so cid alone is not enough (#3269)
            componentOptions.Ctor.cid +
            (componentOptions.tag ? `::${componentOptions.tag}` : '')
          : vnode.key
      if (cache[key]) {
        // 缓存中 已经存在有 ，就取缓存 中的componentInstance
        // 就是为了在拿到 对应的 组件实例 方便在后面销毁的时候 方便 用 destroy 这个方法 cached.componentInstance.$destroy()
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        // 然后刷新 keys 先移除后添加
        remove(keys, key)
        keys.push(key)
      } else {
        // 缓存中没有的时候 就添加到缓存中
        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        // 当max超过数量时，第0个会出栈 对应的 组件也会被 destroy掉
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
```

### 动态缓存的方法(即缓存过但是后期又不想要了，想要取清除这个对应的缓存)

业务场景：比如打开第二个页面 就把第一个页面 销毁掉

背景： 只要被 keep-alive 缓存的 就会一直在缓存，永不会销毁，所以也就是会导致 每次在 keep-alive 中打开这个组件 就一直缓存的样子，不会打开一个初始化的页面

第一种方式： 让 include/exclude 变为动态的 ，这样当值开始时 如果 name 在改变之后的值匹配不到 就会直接 销毁掉

第一种方式：手动触发 销毁
可以监听路由的离开钩子，
beforeRouteLeave:function(to, from, next){
if (跟据自己的业务更改此处的判断逻辑，酌情决定是否摧毁本层缓存) {
if (this.$vnode && this.$vnode.data.keepAlive)
{
if (this.$vnode.parent && this.$vnode.parent.componentInstance && this.$vnode.parent.componentInstance.cache)
                      {
                          if (this.$vnode.componentOptions)
{
var key = this.$vnode.key == null
                                          ? this.$vnode.componentOptions.Ctor.cid + (this.\$vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : '')
: this.$vnode.key;
                              var cache = this.$vnode.parent.componentInstance.cache;
var keys = this.$vnode.parent.componentInstance.keys;
                              if (cache[key])
                              {
                                  if (keys.length) {
                                      var index = keys.indexOf(key);
                                      if (index > -1) {
                                          keys.splice(index, 1);
                                      }
                                  }
                                  delete cache[key];
                              }
                          }
                      }
                  }
                  this.$destroy();
}
next();
},
