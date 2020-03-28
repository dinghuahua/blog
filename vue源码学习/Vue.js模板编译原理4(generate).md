
generate
generate是将AST转化成render funtion字符串的过程，得到结果是render的字符串以及staticRenderFns字符串。

至此，我们的template模板已经被转化成了我们所需的AST、render function字符串以及staticRenderFns字符串。

举个例子
来看一下这段代码的编译结果

<div class="main" :class="bindClass">
    <div>{{text}}</div>
    <div>hello world</div>
    <div v-for="(item, index) in arr">
        <p>{{item.name}}</p>
        <p>{{item.value}}</p>
        <p>{{index}}</p>
        <p>---</p>
    </div>
    <div v-if="text">
        {{text}}
    </div>
    <div v-else></div>
</div>
转化后得到AST，如下图：

img

我们可以看到最外层的div是这颗AST的根节点，节点上有许多数据代表这个节点的形态，比如static表示是否是静态节点，staticClass表示静态class属性（非bind:class）。children代表该节点的子节点，可以看到children是一个长度为4的数组，里面包含的是该节点下的四个div子节点。children里面的节点与父节点的结构类似，层层往下形成一棵AST。

再来看看由AST得到的render函数

with(this){
    return _c(  'div',
                {
                    /*static class*/
                    staticClass:"main",
                    /*bind class*/
                    class:bindClass
                },
                [
                    _c( 'div', [_v(_s(text))]),
                    _c('div',[_v("hello world")]),
                    /*这是一个v-for循环*/
                    _l(
                        (arr),
                        function(item,index){
                            return _c(  'div',
                                        [_c('p',[_v(_s(item.name))]),
                                        _c('p',[_v(_s(item.value))]),
                                        _c('p',[_v(_s(index))]),
                                        _c('p',[_v("---")])]
                                    )
                        }
                    ),
                    /*这是v-if*/
                    (text)?_c('div',[_v(_s(text))]):_c('div',[_v("no text")])],
                    2
            )
}
_c，_v，_s，_q
看了render function字符串，发现有大量的_c，_v，_s，_q，这些函数究竟是什么？

带着问题，我们来看一下core/instance/render。

/*处理v-once的渲染函数*/
  Vue.prototype._o = markOnce
  /*将字符串转化为数字，如果转换失败会返回原字符串*/
  Vue.prototype._n = toNumber
  /*将val转化成字符串*/
  Vue.prototype._s = toString
  /*处理v-for列表渲染*/
  Vue.prototype._l = renderList
  /*处理slot的渲染*/
  Vue.prototype._t = renderSlot
  /*检测两个变量是否相等*/
  Vue.prototype._q = looseEqual
  /*检测arr数组中是否包含与val变量相等的项*/
  Vue.prototype._i = looseIndexOf
  /*处理static树的渲染*/
  Vue.prototype._m = renderStatic
  /*处理filters*/
  Vue.prototype._f = resolveFilter
  /*从config配置中检查eventKeyCode是否存在*/
  Vue.prototype._k = checkKeyCodes
  /*合并v-bind指令到VNode中*/
  Vue.prototype._b = bindObjectProps
  /*创建一个文本节点*/
  Vue.prototype._v = createTextVNode
  /*创建一个空VNode节点*/
  Vue.prototype._e = createEmptyVNode
  /*处理ScopedSlots*/
  Vue.prototype._u = resolveScopedSlots

  /*创建VNode节点*/
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
通过这些函数，render函数最后会返回一个VNode节点，在_update的时候，经过patch与之前的VNode节点进行比较，得出差异后将这些差异渲染到真实的DOM上。