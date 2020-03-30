### patch

在Vue中，把 DOM-Diff过程叫做patch过程。patch,其本质都是把对比新旧两份VNode的过程。我们在下面研究patch过程的时候，一定把握住这样一个思想：所谓旧的VNode(即oldVNode)就是数据变化之前视图所对应的虚拟DOM节点，而新的VNode是数据变化之后将要渲染的新的视图所对应的虚拟DOM节点，所以我们要以生成的新的VNode为基准，对比旧的oldVNode，如果新的VNode上有的节点而旧的oldVNode上没有，那么就在旧的oldVNode上加上去；如果新的VNode上没有的节点而旧的oldVNode上有，那么就在旧的oldVNode上去掉；如果某些节点在新的VNode和旧的oldVNode上都有，那么就以新的VNode为准，更新旧的oldVNode，从而让新旧VNode相同。

总之一句话：以新的VNode为基准，改造旧的oldVNode使之成为跟新的VNode一样，这就是patch过程要干的事。

说了这么多，听起来感觉好像很复杂的样子，其实不然，我们仔细想想，整个patch无非就是干三件事：

* 创建节点：新的VNode中有而旧的oldVNode中没有，就在旧的oldVNode中创建。
* 删除节点：新的VNode中没有而旧的oldVNode中有，就从旧的oldVNode中删除。
* 更新节点：新的VNode和旧的oldVNode中都有，就以新的VNode为准，更新旧的oldVNode。

OK，到这里，你就对Vue中的patch过程理解了一半了，接下来，我们就逐个分析，看Vue对于以上三件事都是怎么做的。

### 创建节点
VNode类可以描述6种类型的节点，而实际上只有3种类型的节点能够被创建并插入到DOM中，它们分别是：元素节点、文本节点、注释节点。所以Vue在创建节点的时候会判断在新的VNode中有而旧的oldVNode中没有的这个节点是属于哪种类型的节点，从而调用不同的方法创建并插入到DOM中。

其实判断起来也不难，因为这三种类型的节点其特点非常明显，在源码中是怎么判断的：

``` javascript
// 源码位置: /src/core/vdom/patch.js
function createElm (vnode, parentElm, refElm) {
    const data = vnode.data
    const children = vnode.children
    const tag = vnode.tag
    if (isDef(tag)) {
      vnode.elm = nodeOps.createElement(tag, vnode)   // 创建元素节点
      createChildren(vnode, children, insertedVnodeQueue) // 创建元素节点的子节点
      insert(parentElm, vnode.elm, refElm)       // 插入到DOM中
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text)  // 创建注释节点
      insert(parentElm, vnode.elm, refElm)           // 插入到DOM中
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text)  // 创建文本节点
      insert(parentElm, vnode.elm, refElm)           // 插入到DOM中
    }
  }
  ```

从上面代码中，我们可以看出：

* 判断是否为元素节点只需判断该VNode节点是否有tag标签即可。
* 如果有tag属性即认为是元素节点，则调用createElement方法创建元素节点，
* 通常元素节点还会有子节点，那就递归遍历创建所有子节点，将所有子节点创建好之后insert插入到当前元素节点里面，最后把当前元素节点插入到DOM中。
* 判断是否为注释节点，只需判断VNode的isComment属性是否为true即可，若为true则为注释节点，则调用createComment方法创建注释节点，再插入到DOM中。
* 如果既不是元素节点，也不是注释节点，那就认为是文本节点，则调用createTextNode方法创建文本节点，再插入到DOM中。
* 代码中的nodeOps是Vue为了跨平台兼容性，对所有节点操作进行了封装，例如nodeOps.createTextNode()在浏览器端等同于document.createTextNode()

以上就完成了创建节点的操作，其完整流程图如下： 

### 删除节点

如果某些节点再新的VNode中没有而在旧的oldVNode中有，那么就需要把这些节点从旧的oldVNode中删除。删除节点非常简单，只需在要删除节点的父元素上调用removeChild方法即可。源码如下：

``` javascriot
function removeNode (el) {
  const parent = nodeOps.parentNode(el)  // 获取父节点
  if (isDef(parent)) {
    nodeOps.removeChild(parent, el)  // 调用父节点的removeChild方法
  }
}
```

### 更新节点

创建节点和删除节点都比较简单，而更新节点就相对较为复杂一点了，其实也不算多复杂，只要理清逻辑就能理解了。

更新节点就是当某些节点在新的VNode和旧的oldVNode中都有时，我们就需要细致比较一下，找出不一样的地方进行更新。

介绍更新节点之前，我们先介绍一个小的概念，就是什么是静态节点？我们看个例子：

`<p>我是不会变化的文字</p>`
上面这个节点里面只包含了纯文字，没有任何可变的变量，这也就是说，不管数据再怎么变化，只要这个节点第一次渲染了，那么它以后就永远不会发生变化，这是因为它不包含任何变量，所以数据发生任何变化都与它无关。我们把这种节点称之为静态节点。

OK，有了这个概念以后，我们开始更新节点。更新节点的时候我们需要对以下3种情况进行判断并分别处理：

如果VNode和oldVNode均为静态节点

我们说了，静态节点无论数据发生任何变化都与它无关，所以都为静态节点的话则直接跳过，无需处理。

如果VNode是文本节点

如果VNode是文本节点即表示这个节点内只包含纯文本，那么只需看oldVNode是否也是文本节点，如果是，那就比较两个文本是否不同，如果不同则把oldVNode里的文本改成跟VNode的文本一样。如果oldVNode不是文本节点，那么不论它是什么，直接调用setTextNode方法把它改成文本节点，并且文本内容跟VNode相同。

如果VNode是元素节点

如果VNode是元素节点，则又细分以下两种情况：

该节点包含子节点

如果新的节点内包含了子节点，那么此时要看旧的节点是否包含子节点，如果旧的节点里也包含了子节点，那就需要递归对比更新子节点；如果旧的节点里不包含子节点，那么这个旧节点有可能是空节点或者是文本节点，如果旧的节点是空节点就把新的节点里的子节点创建一份然后插入到旧的节点里面，如果旧的节点是文本节点，则把文本清空，然后把新的节点里的子节点创建一份然后插入到旧的节点里面。

该节点不包含子节点

如果该节点不包含子节点，同时它又不是文本节点，那就说明该节点是个空节点，那就好办了，不管旧节点之前里面都有啥，直接清空即可。

OK，处理完以上3种情况，更新节点就算基本完成了，接下来我们看下源码中具体是怎么实现的，源码如下：

``` javascript
// 更新节点
function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
  // vnode与oldVnode是否完全一样？若是，退出程序
  if (oldVnode === vnode) {
    return
  }
  const elm = vnode.elm = oldVnode.elm

  // vnode与oldVnode是否都是静态节点？若是，退出程序
  if (isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
  ) {
    return
  }

  const oldCh = oldVnode.children
  const ch = vnode.children
  // 如果新VNode节点没有text文本时
  if (isUndef(vnode.text)) {
    // 新老节点均有children子节点，则对子节点进行diff操作，调用updateChildren
    if (isDef(oldCh) && isDef(ch)) {
      // 若都存在，判断子节点是否相同，不同则更新子节点
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
    }
    // 如果老节点没有子节点而新节点存在子节点，先清空elm的文本内容，然后为当前节点加入子节点
    else if (isDef(ch)) {
      /**
       * 判断oldVnode是否有文本？
       * 若没有，则把新vnode的子节点添加到真实DOM中
       * 若有，则清空Dom中的文本，再把新vnode的子节点添加到真实DOM中
       */

      // 如果老节点有子节点而新节点没有子节点，先清空elm的文本内容，然后为当前节点加入子节点
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    }
    // 若只有oldnode的子节点存在
    else if (isDef(oldCh)) {
      // 当新节点没有子节点而老节点有子节点的时候，则移除所有ele的子节点
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    }
    // 若vnode和oldnode都没有子节点，但是oldnode中有文本
    else if (isDef(oldVnode.text)) {
      //当新老节点都无子节点的时候，只是文本的替换，因为这个逻辑中新节点text不存在，所以直接去除ele的文本
      nodeOps.setTextContent(elm, '')
    }
    // 上面两个判断一句话概括就是，如果vnode中既没有text，也没有子节点，那么对应的oldnode中有什么就清空什么
  }
  // 若有，vnode的text属性与oldVnode的text属性是否不相同？
  else if (oldVnode.text !== vnode.text) {
    // 当新老节点text不一样时，直接替换这段文本
    nodeOps.setTextContent(elm, vnode.text)
  }
}
``` 

<img src="./images/data16.png" width="60%">

另外，如果新旧VNode里都包含了子节点，那么对于子节点的更新在代码里调用了updateChildren方法，而这个方法的逻辑到底查看 vnode的diff算法(updateChildren)文章

5. 总结

在本篇文章中我们介绍了Vue中的DOM-Diff算法：patch过程。我们先介绍了算法的整个思想流程，然后通过梳理算法思想，了解了整个patch过程干了三件事，分别是：创建节点，删除节点，更新节点。并且对每件事情都对照源码展开了细致的学习，画出了其逻辑流程图。另外对于更新节点中，如果新旧VNode里都包含了子节点，我们就需要细致的去更新子节点，关于更新子节点的过程我们在下一篇文章中展开学习。