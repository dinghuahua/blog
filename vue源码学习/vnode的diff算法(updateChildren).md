## updatechildren

### 更新子节点
当新的VNode与旧的oldVNode都是元素节点并且都包含子节点时，那么这两个节点的VNode实例上的children属性就是所包含的子节点数组。我们把新的VNode上的子节点数组记为newChildren，把旧的oldVNode上的子节点数组记为oldChildren，我们把newChildren里面的元素与oldChildren里的元素一一进行对比

那么这个过程会存在以下情况：

1. 创建子节点

如果newChildren里面的某个子节点在oldChildren里找不到与之相同的子节点，那么说明newChildren里面的这个子节点是之前没有的，是需要此次新增的节点，那么就创建子节点。

2. 删除子节点

如果把newChildren里面的每一个子节点都循环完毕后，发现在oldChildren还有未处理的子节点，那就说明这些未处理的子节点是需要被废弃的，那么就将这些节点删除。

3. 移动子节点

如果newChildren里面的某个子节点在oldChildren里找到了与之相同的子节点，但是所处的位置不同，这说明此次变化需要调整该子节点的位置，那就以newChildren里子节点的位置为基准，调整oldChildren里该节点的位置，使之与在newChildren里的位置相同。

4. 更新节点

如果newChildren里面的某个子节点在oldChildren里找到了与之相同的子节点，并且所处的位置也相同，那么就更新oldChildren里该节点，使之与newChildren里的该节点相同。

OK，到这里，逻辑就相对清晰了，接下来我们只需分门别类的处理这四种情况就好了。

### 算法分析

newChildren数组里的所有未处理子节点的第一个子节点称为：新前；<br>
newChildren数组里的所有未处理子节点的最后一个子节点称为：新后；<br>
oldChildren数组里的所有未处理子节点的第一个子节点称为：旧前；<br>
oldChildren数组里的所有未处理子节点的最后一个子节点称为：旧后；<br>
OK，有了以上概念以后，下面我们就来看看其具体是如何实施的。<br>

1. 新前与旧前
把newChildren数组里的所有未处理子节点的第一个子节点和oldChildren数组里所有未处理子节点的第一个子节点做比对，如果相同，那好极了，直接进入之前文章中说的更新节点的操作并且由于新前与旧前两个节点的位置也相同，无需进行节点移动操作；如果不同，没关系，再尝试后面三种情况。 

2. 新后与旧后
把newChildren数组里所有未处理子节点的最后一个子节点和oldChildren数组里所有未处理子节点的最后一个子节点做比对，如果相同，那就直接进入更新节点的操作并且由于新后与旧后两个节点的位置也相同，无需进行节点移动操作；如果不同，继续往后尝试。 

3. 新后与旧前
把newChildren数组里所有未处理子节点的最后一个子节点和oldChildren数组里所有未处理子节点的第一个子节点做比对，如果相同，那就直接进入更新节点的操作，更新完后再将oldChildren数组里的该节点移动到与newChildren数组里节点相同的位置； 

此时，出现了移动节点的操作，移动节点最关键的地方在于找准要移动的位置。我们一再强调，更新节点要以新VNode为基准，然后操作旧的oldVNode，使之最后旧的oldVNode与新的VNode相同。那么现在的情况是：newChildren数组里的最后一个子节点与oldChildren数组里的第一个子节点相同，那么我们就应该在oldChildren数组里把第一个子节点移动到最后一个子节点的位置

4. 新前与旧后
把newChildren数组里所有未处理子节点的第一个子节点和oldChildren数组里所有未处理子节点的最后一个子节点做比对，如果相同，那就直接进入更新节点的操作，更新完后再将oldChildren数组里的该节点移动到与newChildren数组里节点相同的位置；

同样，这种情况的节点移动位置逻辑与“新后与旧前”的逻辑类似，那就是newChildren数组里的第一个子节点与oldChildren数组里的最后一个子节点相同，那么我们就应该在oldChildren数组里把最后一个子节点移动到第一个子节点的位置

如果不属于以上四种情况，就进行常规的循环比对patch（ newStartVnode 与 老的children未处理的节点（范围是：(startEndIdx,oldEndIdx)） 之间进行对比，看看 老的未处理的节点 有没有 与 newStartVnode 相同的节点（一种是通过key(老未处理的节点 先根据key,vnode生成map)来找，另一种是遍历老的children未处理的节点 将每一个 与newStartVnode 进行对比）

5. newStartVnode没有key或者是该key没有在老节点中找到, 则为newStartVnode创建一个新的节点createElm
6. 找到相同的了，获取同key的老节点
    * 获取同key的老节点 elmToMove = oldCh[idxInOld]<br>
    * 如果elmToMove不存在： <br>
      - 说明之前已经有新节点放入过这个key的DOM中，提示可能存在重复的key，确保v-for的时候item有唯一的key值<br>
    * 如果elmToMove存在：<br> 
      - 如果新VNode与得到的有相同key的节点是同一个VNode则进行patchVnode（广义的对比两个节点是否一致，sameVnode(elmToMove, newStartVnode)）<br>
        + 因为已经patchVnode进去了，所以将这个老节点赋值undefined，之后如果还有新节点与该节点key相同可以检测出来提示已有重复的key<br>
        + 直接插入oldStartVnode对应的真实DOM节点前面<br>
      - 当新的VNode与找到的同样key的VNode不是sameVNode的时候（比如说tag不一样或者是有不一样type的input标签），创建一个新的节点
7. 全部比较完成以后，发现oldStartIdx > oldEndIdx的话，说明老节点已经遍历完了，新节点比老节点多，所以这时候多出来的新节点需要一个一个创建出来加入到真实DOM中<br>
  addVnodes(newStartIdx, newEndIdx,)
8. 如果全部比较完成以后发现newStartIdx > newEndIdx，则说明新节点已经遍历完了，老节点多余新节点，这个时候需要将多余的老节点从真实DOM中移除<br>
  removeVnodes(oldStartIdx, oldEndIdx)
      
### 图解算法
直接看源码可能比较难以捋清其中的关系，我们通过图来看一下。

![img](https://github.com/dinghuahua/blog/blob/master/vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/images/data19.png)

首先，在新老两个VNode节点的左右头尾两侧都有一个变量标记，在遍历过程中这几个变量都会向中间靠拢。当oldStartIdx > oldEndIdx或者newStartIdx > newEndIdx时结束循环。

索引与VNode节点的对应关系：<br>
oldStartIdx => oldStartVnode<br>
oldEndIdx => oldEndVnode<br>
newStartIdx => newStartVnode<br>
newEndIdx => newEndVnode<br>

在遍历中，如果存在key，并且满足sameVnode，会将该DOM节点进行复用，否则则会创建一个新的DOM节点。

首先，oldStartVnode、oldEndVnode与newStartVnode、newEndVnode两两比较一共有2*2=4种比较方法。

当新老VNode节点的start或者end满足sameVnode时，也就是sameVnode(oldStartVnode, newStartVnode)或者sameVnode(oldEndVnode, newEndVnode)，直接将该VNode节点进行patchVnode即可。

![img](https://github.com/dinghuahua/blog/blob/master/vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/images/data20.png)

如果oldStartVnode与newEndVnode满足sameVnode，即sameVnode(oldStartVnode, newEndVnode)。

这时候说明oldStartVnode已经跑到了oldEndVnode后面去了，进行patchVnode的同时还需要将真实DOM节点移动到oldEndVnode的后面。

![img](https://github.com/dinghuahua/blog/blob/master/vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/images/data21.png)

如果oldEndVnode与newStartVnode满足sameVnode，即sameVnode(oldEndVnode, newStartVnode)。

这说明oldEndVnode跑到了oldStartVnode的前面，进行patchVnode的同时真实的DOM节点移动到了oldStartVnode的前面。

![img](https://github.com/dinghuahua/blog/blob/master/vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/images/data22.png)

如果以上情况均不符合，则通过createKeyToOldIdx会得到一个oldKeyToIdx，里面存放了一个key为旧的VNode，value为对应index序列的哈希表。从这个哈希表中可以找到是否有与newStartVnode一致key的旧的VNode节点，如果同时满足sameVnode，patchVnode的同时会将这个真实DOM（elmToMove）移动到oldStartVnode对应的真实DOM的前面。

![img](https://github.com/dinghuahua/blog/blob/master/vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/images/data23.png)

当然也有可能newStartVnode在旧的VNode节点找不到一致的key，或者是即便key相同却不是sameVnode，这个时候会调用createElm创建一个新的DOM节点。

![img](https://github.com/dinghuahua/blog/blob/master/vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/images/data24.png)

到这里循环已经结束了，那么剩下我们还需要处理多余或者不够的真实DOM节点。

1.当结束时oldStartIdx > oldEndIdx，这个时候老的VNode节点已经遍历完了，但是新的节点还没有。说明了新的VNode节点实际上比老的VNode节点多，也就是比真实DOM多，需要将剩下的（也就是新增的）VNode节点插入到真实DOM节点中去，此时调用addVnodes（批量调用createElm的接口将这些节点加入到真实DOM中去）。

![img](https://github.com/dinghuahua/blog/blob/master/vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/images/data25.png)

2。同理，当newStartIdx > newEndIdx时，新的VNode节点已经遍历完了，但是老的节点还有剩余，说明真实DOM节点多余了，需要从文档中删除，这时候调用removeVnodes将这些多余的真实DOM删除。

![img](https://github.com/dinghuahua/blog/blob/master/vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/images/data26.png)

### 源码解读

``` javascript
// 循环更新子节点
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
  let oldStartIdx = 0               // oldChildren开始索引
  let oldEndIdx = oldCh.length - 1   // oldChildren结束索引
  let oldStartVnode = oldCh[0]        // oldChildren中所有未处理节点中的第一个
  let oldEndVnode = oldCh[oldEndIdx]   // oldChildren中所有未处理节点中的最后一个

  let newStartIdx = 0               // newChildren开始索引
  let newEndIdx = newCh.length - 1   // newChildren结束索引
  let newStartVnode = newCh[0]        // newChildren中所有未处理节点中的第一个
  let newEndVnode = newCh[newEndIdx]  // newChildren中所有未处理节点中的最后一个

  let oldKeyToIdx, idxInOld, vnodeToMove, refElm

  // removeOnly is a special flag used only by <transition-group>
  // to ensure removed elements stay in correct relative positions
  // during leaving transitions
  const canMove = !removeOnly

  if (process.env.NODE_ENV !== 'production') {
    checkDuplicateKeys(newCh)
  }

  // 以"新前"、"新后"、"旧前"、"旧后"的方式开始比对节点
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx] // 如果oldStartVnode不存在，则直接跳过，比对下一个
    } else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      // 如果新前与旧前节点相同，就把两个节点进行patch更新
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      // 如果新后与旧后节点相同，就把两个节点进行patch更新
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
      // 如果新后与旧前节点相同，先把两个节点进行patch更新，然后把旧前节点移动到oldChilren中所有未处理节点之后
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
      canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
      // 如果新前与旧后节点相同，先把两个节点进行patch更新，然后把旧后节点移动到oldChilren中所有未处理节点之前
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
      canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      // 如果不属于以上四种情况，就进行常规的循环比对patch
      if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
      idxInOld = isDef(newStartVnode.key)
        ? oldKeyToIdx[newStartVnode.key]
        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
      // 如果在oldChildren里找不到当前循环的newChildren里的子节点
      if (isUndef(idxInOld)) { // New element
        // 新增节点并插入到合适位置
        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
      } else {
        // 如果在oldChildren里找到了当前循环的newChildren里的子节点
        vnodeToMove = oldCh[idxInOld]
        // 如果两个节点相同
        if (sameVnode(vnodeToMove, newStartVnode)) {
          // 调用patchVnode更新节点
          patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
          oldCh[idxInOld] = undefined
          // canmove表示是否需要移动节点，如果为true表示需要移动，则移动节点，如果为false则不用移动
          canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
        } else {
          // same key but different element. treat as new element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        }
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }
  if (oldStartIdx > oldEndIdx) {
    /**
     * 如果oldChildren比newChildren先循环完毕，
     * 那么newChildren里面剩余的节点都是需要新增的节点，
     * 把[newStartIdx, newEndIdx]之间的所有节点都插入到DOM中
     */
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
  } else if (newStartIdx > newEndIdx) {
    /**
     * 如果newChildren比oldChildren先循环完毕，
     * 那么oldChildren里面剩余的节点都是需要删除的节点，
     * 把[oldStartIdx, oldEndIdx]之间的所有节点都删除
     */
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
  }
}
```
读源码之前，我们先有这样一个概念：那就是在我们前面所说的优化策略中，节点有可能是从前面对比，也有可能是从后面对比，对比成功就会进行更新处理，也就是说我们有可能处理第一个，也有可能处理最后一个，那么我们在循环的时候就不能简单从前往后或从后往前循环，而是要从两边向中间循环。

那么该如何从两边向中间循环呢？请看下图： 

首先，我们先准备4个变量：

newStartIdx:newChildren数组里开始位置的下标；
newEndIdx:newChildren数组里结束位置的下标；
oldStartIdx:oldChildren数组里开始位置的下标；
oldEndIdx:oldChildren数组里结束位置的下标；
在循环的时候，每处理一个节点，就将下标向图中箭头所指的方向移动一个位置，开始位置所表示的节点被处理后，就向后移动一个位置；结束位置所表示的节点被处理后，就向前移动一个位置；由于我们的优化策略都是新旧节点两两更新的，所以一次更新将会移动两个节点。说的再直白一点就是：newStartIdx和oldStartIdx只能往后移动（只会加），newEndIdx和oldEndIdx只能往前移动（只会减）。

当开始位置大于结束位置时，表示所有节点都已经遍历过了。

OK，有了这个概念后，我们开始读源码：

如果oldStartVnode不存在，则直接跳过，将oldStartIdx加1，比对下一个

// 以"新前"、"新后"、"旧前"、"旧后"的方式开始比对节点
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
 if (isUndef(oldStartVnode)) {
   oldStartVnode = oldCh[++oldStartIdx]
 }
}
如果oldEndVnode不存在，则直接跳过，将oldEndIdx减1，比对前一个

else if (isUndef(oldEndVnode)) {
    oldEndVnode = oldCh[--oldEndIdx]
}
如果新前与旧前节点相同，就把两个节点进行patch更新，同时oldStartIdx和newStartIdx都加1，后移一个位置

else if (sameVnode(oldStartVnode, newStartVnode)) {
    patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
    oldStartVnode = oldCh[++oldStartIdx]
    newStartVnode = newCh[++newStartIdx]
}
如果新后与旧后节点相同，就把两个节点进行patch更新，同时oldEndIdx和newEndIdx都减1，前移一个位置

else if (sameVnode(oldEndVnode, newEndVnode)) {
    patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
    oldEndVnode = oldCh[--oldEndIdx]
    newEndVnode = newCh[--newEndIdx]
}
如果新后与旧前节点相同，先把两个节点进行patch更新，然后把旧前节点移动到oldChilren中所有未处理节点之后，最后把oldStartIdx加1，后移一个位置，newEndIdx减1，前移一个位置

else if (sameVnode(oldStartVnode, newEndVnode)) {
    patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
    canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
    oldStartVnode = oldCh[++oldStartIdx]
    newEndVnode = newCh[--newEndIdx]
}
如果新前与旧后节点相同，先把两个节点进行patch更新，然后把旧后节点移动到oldChilren中所有未处理节点之前，最后把newStartIdx加1，后移一个位置，oldEndIdx减1，前移一个位置

else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
    patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
    canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
    oldEndVnode = oldCh[--oldEndIdx]
    newStartVnode = newCh[++newStartIdx]
}
如果不属于以上四种情况，就进行常规的循环比对patch

如果在循环中，oldStartIdx大于oldEndIdx了，那就表示oldChildren比newChildren先循环完毕，那么newChildren里面剩余的节点都是需要新增的节点，把[newStartIdx, newEndIdx]之间的所有节点都插入到DOM中

if (oldStartIdx > oldEndIdx) {
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
}
如果在循环中，newStartIdx大于newEndIdx了，那就表示newChildren比oldChildren先循环完毕，那么oldChildren里面剩余的节点都是需要删除的节点，把[oldStartIdx, oldEndIdx]之间的所有节点都删除

else if (newStartIdx > newEndIdx) {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
}
OK,处理完毕，可见源码中的处理逻辑跟我们之前分析的逻辑是一样的。
