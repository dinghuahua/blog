Vue.js 模板解析器原理 上
小技巧：
  用单文件组件的情况，vue的编译是在打包构建时完成，这样的话就不可以调试编译的代码，
  所以可以先参照管的介绍修改本地的打包配置[运行版 vs 运行版+编译 ](https://cn.vuejs.org/v2/guide/installation.html#%E8%BF%90%E8%A1%8C%E6%97%B6-%E7%BC%96%E8%AF%91%E5%99%A8-vs-%E5%8F%AA%E5%8C%85%E5%90%AB%E8%BF%90%E8%A1%8C%E6%97%B6)，然后本地的模块写到template属性上，不要单独写template块，这样就可以调试vue的编译原理的代码

解析器要实现的功能是将模板解析成AST。

template是如何被编译成render function的呢？

 /*
    将AST树进行优化
    优化的目标：生成模板AST树，检测不需要进行DOM改变的静态子树。
    一旦检测到这些静态树，我们就能做以下这些事情：
    1.把它们变成常数，这样我们就再也不需要每次重新渲染时创建新的节点了。
    2.在patch的过程中直接跳过。
 */
 baseCompile首先会将模板template进行parse得到一个AST语法树,parse会用正则等方式解析template模板中的指令、class、style等数据，形成AST语法树。<br>
 再通过optimize做一些优化，<br>
 最后通过generate得到render以及staticRenderFns。<br>
 具体的template编译实现请参考[聊聊Vue.js的template编译]()。

#### optimize
optimize的主要作用是标记static静态节点，这是Vue在编译过程中的一处优化，后面当update更新界面时，会有一个patch的过程，diff算法会直接跳过静态节点，从而减少了比较的过程，优化了patch的性能。

#### generate
generate是将AST语法树转化成render funtion字符串的过程，得到结果是render的字符串以及staticRenderFns字符串。

具体的template编译实现请参考《聊聊Vue.js的template编译》。


例如：
``` javascript
<div>
  <p>{{name}}</p>
</div>
// 上面的代码是一个比较简单的模板，它转换成AST后的样子如下：
{
  tag: "div"
  type: 1,
  staticRoot: false,
  static: false,
  plain: true,
  parent: undefined,
  attrsList: [],
  attrsMap: {},
  children: [
    {
      tag: "p"
      type: 1,
      staticRoot: false,
      static: false,
      plain: true,
      parent: {tag: "div", ...},
      attrsList: [],
      attrsMap: {},
      children: [{
        type: 2,
        text: "{{name}}",
        static: false,
        expression: "_s(name)"
      }]
    }
  ]
}
```

其实AST是用JS中的对象来描述一个节点，一个对象代表一个节点，对象中的属性用来保存节点所需的各种数据。比如:<br>
parent属性保存了父节点的描述对象，<br>
children属性是一个数组，里面保存了一些子节点的描述对象。<br>
type属性代表一个节点的类型等。当很多个独立的节点通过parent属性和children属性连在一起时，就变成了一个树，而这样一个用对象描述的节点树其实就是AST。

### 解析器内部运行原理

事实上，解析器内部也分了好几个子解析器，比如HTML解析器、文本解析器以及过滤器解析器，其中最主要的是HTML解析器。顾名思义，HTML解析器的作用是解析HTML，它在解析HTML的过程中会不断触发各种钩子函数。这些钩子函数包括开始标签钩子函数、结束标签钩子函数、文本钩子函数以及注释钩子函数。

伪代码如下：
``` javascript
// 我们发现，钩子函数start有三个参数，分别是
// 而文本节点的钩子函数chars和注释节点的钩子函数comment都只有一个参数，只有text。
// 这是因为构建元素节点时需要知道标签名、属性和自闭合标识，而构建注释节点和文本节点时只需要知道文本即可。
parseHTML(template, {
    start (tag, attrs, unary) {
        // 每当解析到标签的开始位置时，触发该函数
        // tag、attrs和unary，它们分别代表标签名、标签的属性以及是否是自闭合标签。
    },
    end () {
        // 每当解析到标签的结束位置时，触发该函数
    },
    chars (text) {
        // 每当解析到文本时，触发该函数
        let element = {type: 3, text}
    },
    comment (text) {
        // 每当解析到注释时，触发该函数
        let element = {type: 3, text, isComment: true}
    }
})
```

你可能不能很清晰地理解，下面我们举个简单的例子：

``` javascript
<div><p>我是LYF</p></div>
```
当上面这个模板被HTML解析器解析时，所触发的钩子函数依次是：start、start、chars、end。<br/>
也就是说，解析器其实是从前向后解析的。<br/>
解析到`<div>`时，会触发一个标签开始的钩子函数start；<br/>
然后解析到`<p>`时，又触发一次钩子函数start；<br/>
接着解析到 我是LYF 这行文本，此时触发了文本钩子函数chars；<br/>
然后解析到`</p>`，触发了标签结束的钩子函数end；<br/>
接着继续解析到`</div>`，此时又触发一次标签结束的钩子函数end，解析结束。<br/>

因此，我们可以在钩子函数中构建AST节点。在start钩子函数中构建元素类型的节点，在chars钩子函数中构建文本类型的节点，在comment钩子函数中构建注释类型的节点。

当HTML解析器不再触发钩子函数时，就代表所有模板都解析完毕，所有类型的节点都在钩子函数中构建完成，即AST构建完成。

### 构建AST层级关系
如何构建AST层级关系。需要维护一个栈（stack）即可，用栈来记录层级关系，这个层级关系也可以理解为DOM的深度。<br>
HTML解析器在解析HTML时，是从前向后解析。每当遇到开始标签，就触发钩子函数start。每当遇到结束标签，就会触发钩子函数end。<br>
基于HTML解析器的逻辑，我们可以在每次触发钩子函数start时，把当前构建的节点推入栈中；每当触发钩子函数end时，就从栈中弹出一个节点（实际的源码中并没有出栈，而是通过来控制栈的长度来进行的）。<br>
这样就可以保证每当触发钩子函数start时，栈的最后一个节点就是当前正在构建的节点的父节点<br>

<img src="./images/data8.png" width="60%">

下面我们用一个具体的例子来描述如何从无到有构建一个带层级关系的AST。

假设有这样一个模板：
``` javascript
<div>
    <h1>我是LYF</h1>
    <p>我今年18岁</p>
</div>
```
构建AST的过程，具体如下。

(1) 模板的开始位置是div的开始标签，于是会触发钩子函数start。start触发后，会先构建一个div节点。此时发现栈是空的，这说明div节点是根节点，因为它没有父节点。最后，将div节点推入栈中，并将模板字符串中的div开始标签从模板中截取掉。

(2) 这时模板的开始位置是一些空格，这些空格会触发文本节点的钩子函数，在钩子函数里会忽略这些空格。同时会在模板中将这些空格截取掉。

(3) 这时模板的开始位置是h1的开始标签，于是会触发钩子函数start。与前面流程一样，start触发后，会先构建一个h1节点。此时发现栈的最后一个节点是div节点，这说明h1节点的父节点是div，于是将h1添加到div的子节点中，并且将h1节点推入栈中，同时从模板中将h1的开始标签截取掉。

(4) 这时模板的开始位置是一段文本，于是会触发钩子函数chars。chars触发后，会先构建一个文本节点，此时发现栈中的最后一个节点是h1，这说明文本节点的父节点是h1，于是将文本节点添加到h1节点的子节点中。由于文本节点没有子节点，所以文本节点不会被推入栈中。最后，将文本从模板中截取掉。

(5) 这时模板的开始位置是h1结束标签，于是会触发钩子函数end。end触发后，会把栈中最后一个节点弹出来。

(6) 与第(2)步一样，这时模板的开始位置是一些空格，这些空格会触发文本节点的钩子函数，在钩子函数里会忽略这些空格。同时会在模板中将这些空格截取掉。

(7) 这时模板的开始位置是p开始标签，于是会触发钩子函数start。start触发后，会先构建一个p节点。由于第(5)步已经从栈中弹出了一个节点，所以此时栈中的最后一个节点是div，这说明p节点的父节点是div。于是将p推入div的子节点中，最后将p推入到栈中，并将p的开始标签从模板中截取掉。

(8) 这时模板的开始位置又是一段文本，于是会触发钩子函数chars。当chars触发后，会先构建一个文本节点，此时发现栈中的最后一个节点是p节点，这说明文本节点的父节点是p节点。于是将文本节点推入p节点的子节点中，并将文本从模板中截取掉。

(9) 这时模板的开始位置是p的结束标签，于是会触发钩子函数end。当end触发后，会从栈中弹出一个节点出来，也就是把p标签从栈中弹出来，并将p的结束标签从模板中截取掉。

(10) 与第(2)步和第(6)步一样，这时模板的开始位置是一些空格，这些空格会触发文本节点的钩子函数并且在钩子函数里会忽略这些空格。同时会在模板中将这些空格截取掉。

(11) 这时模板的开始位置是div的结束标签，于是会触发钩子函数end。其逻辑与之前一样，把栈中的最后一个节点弹出来，也就是把div弹了出来，并将div的结束标签从模板中截取掉。

(12)这时模板已经被截取空了，也就代表着HTML解析器已经运行完毕。这时我们会发现栈已经空了，但是我们得到了一个完整的带层级关系的AST语法树。这个AST中清晰写明了每个节点的父节点、子节点及其节点类型。
 
### HTML解析器运行原理
通过前面的介绍，我们发现构建AST非常依赖HTML解析器所执行的钩子函数以及钩子函数中所提供的参数，你一定会非常好奇HTML解析器是如何解析模板的，接下来我们会详细介绍HTML解析器的运行原理。

事实上，解析HTML模板的过程就是循环的过程，简单来说就是用HTML模板字符串来循环，每轮循环都从HTML模板中通过正则匹配截取一小段字符串，然后重复以上过程，直到HTML模板被截成一个空字符串时结束循环，解析完毕，如图9-2所示。

在截取一小段字符串时，有可能截取到开始标签，也有可能截取到结束标签，又或者是文本或者注释，我们可以根据截取的字符串的类型来触发不同的钩子函数。

循环HTML模板的伪代码如下：
``` javascript
function parseHTML(html, options) {
  while (html) {
    // 截取模板字符串并触发钩子函数
  }
}
```
为了方便理解，我们手动模拟HTML解析器的解析过程。例如，下面这样一个简单的HTML模板：
``` javascript
`<div id="header" @click="add">
  我是LYF
  <p>{{name}}</p>
</div>`
```
它在被HTML解析器解析的过程如下:
最初的HTML模板：
``` javascript
`<div id="header" @click="add">
  我是LYF
  <p>{{name}}</p>
</div>`
//开始的所有的字符串,index = 0,html="<div id="header" @click="add">↵  我是LYF↵  <p>{{name}}</p>↵</div>"
// 第一轮循环时，
// 截取出一段字符串<div id="app" @click="add"，
// 进入到解析开始标签的循环中，提取标签的属性转为key/value的形式，
// 然后截取开始标签的闭合(>)，
// 触发钩子函数start
// 标签元素进栈stack
// 截取后的结果为下面，进行下一轮的循环：index=30, html="↵  我是LYF↵  <p>{{name}}</p>↵</div>"
`
  我是LYF
  <p>{{name}}</p>
</div>`

// 第二轮循环时：
// 截取出一段字符串"↵  我是LYF↵  "，
// 触发钩子函数chars，前后去空格后塞进了currentParent.children中，
// 截取后的结果为下面，进行下一轮的循环：index=41, html="<p>{{name}}</p>↵</div>"
`<p>{{name}}</p>
</div>`

// 第三轮循环时：
// 截取出一段字符串<p，
// 进入到解析开始标签的循环中，没有可提取的标签属性退出循环，
// 然后截取开始标签的闭合(>)，
// 触发钩子函数start
// 标签元素进栈stack
// 截取后的结果为下面，进行下一轮的循环：index=44, html="{{name}}</p>↵</div>"
`{{name}}</p>
</div>`

// 第四轮循环时，截取出一段字符串{{name}}，
// 并且触发钩子函数chars，
// 触发钩子函数chars，前后去空格后塞进了currentParent.children中，
// 截取后的结果为下面，进行下一轮的循环：index=52, html="</p>↵</div>"
`</p>
</div>`

// 第五轮循环时，截取出一段字符串</p>，
// 触发钩子函数end，
// 标签元素出栈stack
// 父标签的子元素压入children.push(element)
// 截取后的结果为下面，进行下一轮的循环：index=56, html="↵</div>"
`
</div>`

// 第六轮循环时，截取出一段字符串"↵"
// 并且触发钩子函数chars，
// 触发钩子函数chars，前后去空格后("↵"替换为‘ ’)塞进了currentParent.children中，
// 截取后的结果为下面，进行下一轮的循环：index=57, html="</div>"
`</div>`

// 第七轮循环时，截取出一段字符串</div>
// 触发钩子函数end，
// 标签元素出栈stack
// 父标签的子元素压入children.push(element)
// 截取后的结果为下面，进行下一轮的循环：index=56, html="↵</div>"
``

// 第八轮循环时，剩余字符串为假，退出循环，解析完毕

ast结构为下所示

ast = {
  type: 1,
  tag: "div",
  attrsList: [
    {"name": "id", value: "header", start: 5, end: 16},
    {"name": "@click", value: "add", start: 17, end: 29}
  ],
  attrsMap: {"id": "header", "@click": "add"},
  rawAttrsMap: {
    id: {"name": "id", value: "header", start: 5, end: 16},
    "@click": {"name": "@click", value: "add", start: 17, end: 29}
  },
  plain: false,
  attrs: [{"name": "id", "value": "header", "dynamic": undefined, start: 5, end: 16}],
  hasBindings: true,
  events:{"click":{"value": "add",dynamic: false,start: 17,end: 29}},
  parent: undefined,
  start: 0,
  end: 63,
  children: [
    {"type": 3, text: "↵  我是LYF↵  ", start: 30, end: 41},
    {
      type: 1,
      tag: "p",
      attrsList: [],
      attrsMap: {},
      rawAttrsMap: {},
      parent: {"type": 1, tag: "div"},
      children: [{
        type: 2,
        expression: "_s(name)",
        tokens: [{"@binding": "name"}],
        text: "{{name}}",
        start: 44,
        end: 52
      }],
      start: 41,
      end: 56,
      plain: true
    }
  ]
}
```
<img src="./images/data10.png" width="60%">
<img src="./images/data11.png" width="60%">

HTML解析器的全部逻辑都是在循环中执行，循环结束就代表解析结束。接下来，我们要讨论的重点是HTML解析器在循环中都干了些什么事。<br>
那就是每一轮截取字符串时，都是在整个模板的开始位置截取,源码中是通过字符串的下标来控制当前截取到哪里来，并从这个位置开始截取到最后advance这个方法)。我们根据模板开始位置的片段类型，进行不同的截取操作。

<img src="./images/data9.png" width="609%">

这些被截取的片段分很多种类型，示例如下。
``` javascript
`<div id="header" @click="add">
  我是LYF
</div>`
开始标签，例如<div id="header" @click="add"。
开始标签的结束，例如>。
标签的内容 例如 我是LYF
结束标签，例如</div>。
HTML注释，例如<!-- 我是注释 -->。
DOCTYPE，例如<!DOCTYPE html>。
条件注释，例如<!--[if !IE]>-->我是注释<!--<![endif]-->。
文本，例如 我是LYF。
通常，最常见的是开始标签、结束标签、文本以及注释。
```
#### 截取开始标签
每一轮循环都是从模板的最前面截取，所以只有模板以开始标签开头，才需要进行开始标签的截取操作。<br>
那么，如何确定模板是不是以开始标签开头？<br>
在HTML解析器中，想分辨出模板是否以开始标签开头并不难，我们需要先判断HTML模板是不是以<开头。<br>
如果HTML模板的第一个字符不是<，那么它一定不是以开始标签开头的模板，所以不需要进行开始标签的截取操作。<br>
如果HTML模板以<开头，那么说明它至少是一个以标签开头的模板，但这个标签到底是什么类型的标签，还需要进一步确认。<br>
如果模板以<开头，那么它有可能是以开始标签开头的模板，同时它也有可能是以结束标签开头的模板，还有可能是注释等其他标签，因为这些类型的片段都以<开头。那么，要进一步确定模板是不是以开始标签开头，还需要借助正则表达式来分辨模板的开始位置是否符合开始标签的特征。<br>
当HTML解析器解析到标签开始时，会触发钩子函数start，同时会给出三个参数，分别是标签名（tagName）、属性（attrs）以及自闭合标识（unary）。<br>

<p>开始标签被拆分成三个小部分，分别是标签名、属性和结尾<p>

因此，在分辨出模板以开始标签开始之后，需要将标签名、属性以及自闭合标识解析出来。<br>
在分辨模板是否以开始标签开始时，就可以得到标签名，而属性和自闭合标识则需要进一步解析。<br>
通过“标签名”这一段字符，就可以分辨出模板是否以开始标签开头，此后要想得到属性和自闭合标识，则需要进一步解析。<br>

1. 解析标签属性

在分辨模板是否以开始标签开头时，会将开始标签中的标签名这一小部分截取掉，
通常，标签属性是可选的，一个标签的属性有可能存在，也有可能不存在，所以需要判断标签是否存在属性，如果存在，对它进行截取。

下面的伪代码展示了如何解析开始标签中的属性：
``` javascript
const startTagClose = /^\s*(\/?)>/
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
let html = ' class="box" id="el"></div>'
let end, attr
const match = {tagName: 'div', attrs: []}

// 如果剩余HTML模板不符合开始标签结尾部分的特征，并且符合标签属性的特征，那么进入到循环中进行解析与截取操作。
while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
    html = html.substring(attr[0].length)
    match.attrs.push(attr)
}
// 通过match方法解析出的结果为：
{
  tagName: 'div',
  attrs: [
    [' class="box"', 'class', '=', 'box', null, null],
    [' id="el"', 'id','=', 'el', null, null]
  ]
}
```
2. 解析自闭合标识

`<input type="text" />`
自闭合标签是没有子节点的，所以前文中我们提到构建AST层级时，需要维护一个栈，而一个节点是否需要推入到栈中，可以使用这个自闭合标识来判断。

那么，如何解析开始标签中的结尾部分呢？看下面这段代码：
``` javascript
function parseStartTagEnd (html) {
  const startTagClose = /^\s*(\/?)>/
  const end = html.match(startTagClose)
  const match = {}

  if (end) {
      match.unarySlash = end[1]
      html = html.substring(end[0].length)
      return match
  }
}

console.log(parseStartTagEnd('></div>')) // {unarySlash: ""}
console.log(parseStartTagEnd('/><div></div>')) // {unarySlash: "/"}
```
这段代码可以正确解析出开始标签是否是自闭合标签。

从代码中打印出来的结果可以看到，自闭合标签解析后的unarySlash属性为/，而非自闭合标签为空字符串。

3. 截取注释

分辨模板是否已经截取到注释的原理与开始标签和结束标签相同，先判断剩余HTML模板的第一个字符是不是<，如果是，再用正则表达式来进一步匹配：
``` javascript
const comment = /^<!--/

if (comment.test(html)) {
    const commentEnd = html.indexOf('-->')

    if (commentEnd >= 0) {
        if (options.shouldKeepComment) {
            options.comment(html.substring(4, commentEnd))
        }
        html = html.substring(commentEnd + 3)
        continue
    }
}
```
在上面的代码中，我们使用正则表达式来判断剩余的模板是否符合注释的规则，如果符合，就将这段注释文本截取出来。

这里有一个有意思的地方，那就是注释的钩子函数可以通过选项来配置，只有options.shouldKeepComment为真时，才会触发钩子函数，否则只截取模板，不触发钩子函数。

4. 截取条件注释

条件注释不需要触发钩子函数，我们只需要把它截取掉就行了。

截取条件注释的原理与截取注释非常相似，如果模板的第一个字符是<，并且符合我们事先用正则表达式定义好的规则，就说明需要进行条件注释的截取操作。

在下面的代码中，我们通过indexOf找到条件注释结束位置的下标，然后将结束位置前的字符都截取掉：
``` javascript
const conditionalComment = /^<!\[/
if (conditionalComment.test(html)) {
    const conditionalEnd = html.indexOf(']>')

    if (conditionalEnd >= 0) {
        html = html.substring(conditionalEnd + 2)
        continue
    }
}
// 举个例子：
const conditionalComment = /^<!\[/
let html = '<![if !IE]><link href="non-ie.css" rel="stylesheet"><![endif]>'
if (conditionalComment.test(html)) {
    const conditionalEnd = html.indexOf(']>')
    if (conditionalEnd >= 0) {
        html = html.substring(conditionalEnd + 2)
    }
}

console.log(html) // '<link href="non-ie.css" rel="stylesheet"><![endif]>'
```
通过这个逻辑可以发现，在Vue.js中条件注释其实没有用，写了也会被截取掉，通俗一点说就是写了也白写。

5. 截取DOCTYPE

DOCTYPE与条件注释相同，都是不需要触发钩子函数的，只需要将匹配到的这一段字符截取掉即可。下面的代码将DOCTYPE这段字符匹配出来后，根据它的length属性来决定要截取多长的字符串：
``` javascript
const doctype = /^<!DOCTYPE [^>]+>/i
const doctypeMatch = html.match(doctype)
if (doctypeMatch) {
    html = html.substring(doctypeMatch[0].length)
    continue
}
// 示例如下：
const doctype = /^<!DOCTYPE [^>]+>/i
let html = '<!DOCTYPE html><html lang="en"><head></head><body></body></html>'
const doctypeMatch = html.match(doctype)
if (doctypeMatch) {
    html = html.substring(doctypeMatch[0].length)
}

console.log(html) // '<html lang="en"><head></head><body></body></html>'
```

6. 截取文本

若想分辨在本轮循环中HTML模板是否已经截取到文本，其实很简单，我们甚至不需要使用正则表达式。

在前面的其他标签类型中，我们都会判断剩余HTML模板的第一个字符是否是<，如果是，再进一步确认到底是哪种类型。这是因为以<开头的标签类型太多了，如开始标签、结束标签和注释等。然而文本只有一种，如果HTML模板的第一个字符不是<，那么它一定是文本了。

例如：
`我是文本</div>`
上面这段HTML模板并不是以<开头的，所以可以断定它是以文本开头的。

那么，如何从模板中将文本解析出来呢？我们只需要找到下一个<在什么位置，这之前的所有字符都属于文本，如图9-4所示。

尖括号前面的字符都属于文本

在代码中可以这样实现：
``` javascript
while (html) {
    let text
    let textEnd = html.indexOf('<')
    
    // 截取文本
    if (textEnd >= 0) {
        text = html.substring(0, textEnd)
        html = html.substring(textEnd)
    }

    // 如果模板中找不到<，就说明整个模板都是文本
    if (textEnd < 0) {
        text = html
        html = ''
    }

    // 触发钩子函数
    if (options.chars && text) {
        options.chars(text)
    }
}
```
上面的代码共有三部分逻辑。

第一部分是截取文本，这在前面介绍过了。<之前的所有字符都是文本，直接使用html.substring从模板的最开始位置截取到<之前的位置，就可以将文本截取出来。

第二部分是一个条件：如果在整个模板中都找不到<，那么说明整个模板全是文本。

第三部分是触发钩子函数并将截取出来的文本放到参数中。

关于文本，还有一个特殊情况需要处理：如果<是文本的一部分，该如何处理？

举个例子：

1<2</div>
在上面这样的模板中，如果只截取第一个<前面的字符，最后被截取出来的将只有1，而不能把所有文本都截取出来。

那么，该如何解决这个问题呢？

有一个思路是，如果将<前面的字符截取完之后，剩余的模板不符合任何需要被解析的片段的类型，就说明这个<是文本的一部分。

什么是需要被解析的片段的类型？<br>
我们说过HTML解析器是一段一段截取模板的，而被截取的每一段都符合某种类型，这些类型包括开始标签、结束标签和注释等。

说的再具体一点，那就是上面这段代码中的1被截取完之后，剩余模板是下面的样子：

`<2</div>`
<2符合开始标签的特征么？不符合。

<2符合结束标签的特征么？不符合。

<2符合注释的特征么？不符合。

当剩余的模板什么都不符合时，就说明<属于文本的一部分。

当判断出<是属于文本的一部分后，我们需要做的事情是找到下一个<并将其前面的文本截取出来加到前面截取了一半的文本后面。

这里还用上面的例子，第二个<之前的字符是<2，那么把<2截取出来后，追加到上一次截取出来的1的后面，此时的结果是：

1<2
截取后剩余的模板是：

`</div>`
如果剩余的模板依然不符合任何被解析的类型，那么重复此过程。直到所有文本都解析完。

说完了思路，我们看一下具体的实现，伪代码如下：
``` javascript
while (html) {
    let text, rest, next
    let textEnd = html.indexOf('<')
    
    // 截取文本
    if (textEnd >= 0) {
        rest = html.slice(textEnd)
        while (
            !endTag.test(rest) &&
            !startTagOpen.test(rest) &&
            !comment.test(rest) &&
            !conditionalComment.test(rest)
        ) {
            // 如果'<'在纯文本中，将它视为纯文本对待
            next = rest.indexOf('<', 1)
            if (next < 0) break
            textEnd += next
            rest = html.slice(textEnd)
        }
        text = html.substring(0, textEnd)
        html = html.substring(textEnd)
    }
    
    // 如果模板中找不到<，那么说明整个模板都是文本
    if (textEnd < 0) {
        text = html
        html = ''
    }
    
    // 触发钩子函数
    if (options.chars && text) {
        options.chars(text)
    }
}
```
在代码中，我们通过while来解决这个问题（注意是里面的while）。如果剩余的模板不符合任何被解析的类型，那么重复解析文本，直到剩余模板符合被解析的类型为止。

在Vue.js源码中，截取文本的逻辑和其他的实现思路一致。

7. 纯文本内容元素的处理

什么是纯文本内容元素呢？script、style和textarea这三种元素叫作纯文本内容元素。解析它们的时候，会把这三种标签内包含的所有内容都当作文本处理。那么，具体该如何处理呢？

前面介绍开始标签、结束标签、文本、注释的截取时，其实都是默认当前需要截取的元素的父级元素不是纯文本内容元素。事实上，如果要截取元素的父级元素是纯文本内容元素的话，处理逻辑将完全不一样。

事实上，在while循环中，lastTag代表父元素,最外层的判断条件就是,如果父元素不存在或者父元素不是纯文本内容元素，那么进行正常的处理逻辑，也就是前面介绍的逻辑。例如下面的伪代码：
``` javascript
// 而当父元素是script这种纯文本内容元素时，会进入到else这个语句里面。由于纯文本内容元素都被视作文本处理，所以我们的处理逻辑就变得很简单，只需要把这些文本截取出来并触发钩子函数chars，然后再将结束标签截取出来并触发钩子函数end。
// 也就是说，如果父标签是纯文本内容元素，那么本轮循环会一次性将这个父标签给处理完毕。
while (html) {
    if (!lastTag || !isPlainTextElement(lastTag)) {
        // 父元素为正常元素的处理逻辑
    } else {
        // 父元素为script、style、textarea的处理逻辑
        const stackedTag = lastTag.toLowerCase()
        const reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'))
        const rest = html.replace(reStackedTag, function (all, text) {
            if (options.chars) {
                options.chars(text)
            }
            return ''
        })
        html = rest
        options.end(stackedTag)
    }
}
``` 
上面代码中的正则表达式可以匹配结束标签前包括结束标签自身在内的所有文本。

我们可以给replace方法的第二个参数传递一个函数。在这个函数中，我们得到了参数text（代表结束标签前的所有内容），
触发了钩子函数chars并把text放到钩子函数的参数中传出去。最后，返回了一个空字符串，代表将匹配到的内容都截掉了。
注意，这里的截掉会将内容和结束标签一起截取掉。

最后，调用钩子函数end并将标签名放到参数中传出去，代表本轮循环中的所有逻辑都已处理完毕。

整体逻辑
如何将这些解析方式组装起来完成HTML解析器的功能。

* 判断父级元素是不是纯文本内容元素，纯文本内容元素呢？script、style和textarea这三种元素叫作纯文本内容元素
  * 父元素不是纯文本内容元素
    1. 判断模板是不是以开始标签（‘<’）开头？
        1. 判断是不是Comment注释 
        2. 判断是不是conditionalComment
        3. 判断是不是Doctype
        4. 判断是不是End tag<br>
            匹配栈，从后往前开始匹配，找到第一个对应的开始标签然后出栈<br>
            如果没有匹配到，判断是不是自闭合标签<br>
        5. 判断是不是Start tag<br>
            提取属性,构造属性结构，属性结构如图11<br>
            匹配开始标签的结束<br>
            匹配后面的空白字符串<br>
            调用start钩子<br>
        6. 判断是不是以上都不是但是以“<”开头的纯文本
    2. 是以开始标签（‘<’）开头,<br>
        截取从'<'开始到结尾的剩余字符串 rest = `<p>{{name}}</p>`
            判断rest不是以结束标签为开始<br>
                并且不是以开始标签为开始<br>
                并且不是以注释标签为开始<br>
                    获取下一个“<” 的下标 next=rest.indexOf('<', 1)<br>
                    并修改针对当前的下一个“<” 的位置<br>
                    textEnd += next<br>
                    剩余字符串修改为从下一个“<”开始到结尾的字符串 rest=html.slice(textEnd)<br>
            不满足以上的条件即不更改剩余字符串 <br>
              那么当前的文本为 text = html.substring(0, textEnd)
    3. 调用文本 chars 钩子
  * 父元素是纯文本内容元<br>
    纯文本内容元素 的处理script、style和textarea 



文本
注释
条件注释
DOCTYPE
结束标签
开始标签
我们会发现，在这些需要处理的类型中，除了文本之外，其他都是以标签形式存在的，而标签是以<开头的。

所以逻辑就很清晰了，我们先根据<来判断需要解析的字符是文本还是其他的：

在上面的代码中，我们可以通过<来分辨是否需要进行文本解析。

如果通过<分辨出即将解析的这一小部分字符不是文本而是标签类，那么标签类有那么多类型，我们需要进一步分辨具体是哪种类型：
``` javascript
export function parseHTML (html, options) {
    while (html) {
        if (!lastTag || !isPlainTextElement(lastTag)) {
            let textEnd = html.indexOf('<')
            if (textEnd === 0) {
                // 注释
                if (comment.test(html)) {
                    // 注释的处理逻辑
                    continue
                }
                
                // 条件注释
                if (conditionalComment.test(html)) {
                    // 条件注释的处理逻辑
                    continue
                }
                
                // DOCTYPE
                const doctypeMatch = html.match(doctype)
                if (doctypeMatch) {
                    // DOCTYPE的处理逻辑
                    continue
                }
                
                // 结束标签
                const endTagMatch = html.match(endTag)
                if (endTagMatch) {
                    // 结束标签的处理逻辑
                    continue
                }
                
                // 开始标签
                const startTagMatch = parseStartTag()
                if (startTagMatch) {
                    // 开始标签的处理逻辑
                    continue
                }
            }
            
            let text, rest, next
            if (textEnd >= 0) {
                // 解析文本
            }
            
            if (textEnd < 0) {
                text = html
                html = ''
            }
            
            if (options.chars && text) {
                options.chars(text)
            }
        } else {
            // 父元素为script、style、textarea的处理逻辑
        }
    }
}
```
Hello {{name}}
在Vue.js模板中，我们可以使用变量来填充模板。而HTML解析器在解析文本时，并不会区分文本是否是带变量的文本。如果是纯文本，不需要进行任何处理；但如果是带变量的文本，那么需要使用文本解析器进一步解析。因为带变量的文本在使用虚拟DOM进行渲染时，需要将变量替换成变量中的值。

每当HTML解析器解析到文本时，都会触发chars函数，并且从参数中得到解析出的文本。在chars函数中，我们需要构建文本类型的AST，并将它添加到父节点的children属性中。

而在构建文本类型的AST时，纯文本和带变量的文本是不同的处理方式。如果是带变量的文本，其代码如下：
``` javascript
parseHTML(template, {
    start (tag, attrs, unary) {
        // 每当解析到标签的开始位置时，触发该函数
    },
    end () {
        // 每当解析到标签的结束位置时，触发该函数
    },
    chars (text) {
        text = text.trim()
        if (text) {
            const children = currentParent.children
            let expression
            if (expression = parseText(text)) {
                children.push({
                    type: 2,
                    expression,
                    text
                })
            } else {
                children.push({
                    type: 3,
                    text
                })
            }
        }
    },
    comment (text) {
        // 每当解析到注释时，触发该函数
    }
})
```
在chars函数中，如果执行parseText后有返回结果，则说明文本是带变量的文本，并且已经通过文本解析器（parseText）二次加工，此时构建一个带变量的文本类型的AST并将其添加到父节点的children属性中。否则，就直接构建一个普通的文本节点并将其添加到父节点的children属性中。而代码中的currentParent是当前节点的父节点，也就是前面介绍的栈中的最后一个节点。

假设chars函数被触发后，我们得到的text是一个带变量的文本：

"Hello {{name}}"
这个带变量的文本被文本解析器解析之后，得到的expression变量是这样的：

"Hello "+_s(name)
上面代码中的_s其实是下面这个toString函数的别名：

假设当前上下文中有一个变量name，其值为LYF，那么expression中的内容被执行时，它的内容是不是就是Hello LYF了？

我们举个例子：
``` javascript
var obj = {name: 'LYF'}
with(obj) {
    function toString (val) {
        return val == null
            ? ''
            : typeof val === 'object'
                ? JSON.stringify(val, null, 2)
                : String(val)
    }
    console.log("Hello "+toString(name)) // "Hello LYF"
}
```
在上面的代码中，我们打印出来的结果是"Hello LYF"。

事实上，最终AST会转换成代码字符串放在with中执行。

接着，我们详细介绍如何加工文本，也就是文本解析器的内部实现原理。

在文本解析器中，第一步要做的事情就是使用正则表达式来判断文本是否是带变量的文本，也就是检查文本中是否包含{{xxx}}这样的语法。如果是纯文本，则直接返回undefined；如果是带变量的文本。所以我们的代码是这样的：

``` javascript
function parseText (text) {
    const tagRE = /\{\{((?:.|\n)+?)\}\}/g
    if (!tagRE(text)) {
        return
    }
}
```

在上面的代码中，如果是纯文本，则直接返回。如果是带变量的文本，该如何处理呢？

一个解决思路是使用正则表达式匹配出文本中的变量，先把变量左边的文本添加到数组中，然后把变量改成_s(x)这样的形式也添加到数组中。如果变量后面还有变量，则重复以上动作，直到所有变量都添加到数组中。如果最后一个变量的后面有文本，就将它添加到数组中。

这时我们其实已经有一个数组，数组元素的顺序和文本的顺序是一致的，此时将这些数组元素用+连起来变成字符串，就可以得到最终想要的效果

具体实现代码如下：
``` javascript
function parseText (text) {
    const tagRE = /\{\{((?:.|\n)+?)\}\}/g
    if (!tagRE.test(text)) {
        return
    }

    const tokens = []
    let lastIndex = tagRE.lastIndex = 0
    let match, index
    while ((match = tagRE.exec(text))) {
        index = match.index
        // 先把 {{ 前边的文本添加到tokens中
        if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        // 把变量改成`_s(x)`这样的形式也添加到数组中
        tokens.push(`_s(${match[1].trim()})`)
        
        // 设置lastIndex来保证下一轮循环时，正则表达式不再重复匹配已经解析过的文本
        lastIndex = index + match[0].length
    }
    
    // 当所有变量都处理完毕后，如果最后一个变量右边还有文本，就将文本添加到数组中
    if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    return tokens.join('+')
}
```
这是文本解析器的全部代码，代码并不多，逻辑也不是很复杂。

这段代码有一个很关键的地方在lastIndex：每处理完一个变量后，会重新设置lastIndex的位置，这样可以保证如果后面还有其他变量，那么在下一轮循环时可以从lastIndex的位置开始向后匹配，而lastIndex之前的文本将不再被匹配。

### vue.js 源码 添加注释

``` javascript
...
// Regular Expressions for parsing tags and attributes
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
// 开始标签正则
const startTagOpen = new RegExp(`^<${qnameCapture}`)
// 开始标签闭合正则
const startTagClose = /^\s*(\/?)>/
// 结束标签正则
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const doctype = /^<!DOCTYPE [^>]+>/i
// 条件正则
const comment = /^<!\--/
// 条件注释正则
const conditionalComment = /^<!\[/

// 是否是纯文本标签
export const isPlainTextElement = makeMap('script,style,textarea', true)
const reCache = {}

// encode 文本替换
const decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n',
  '&#9;': '\t',
  '&#39;': "'"
}
...
export function parseHTML (html, options) {
  const stack = []
  const expectHTML = options.expectHTML
  const isUnaryTag = options.isUnaryTag || no
  const canBeLeftOpenTag = options.canBeLeftOpenTag || no
  // 已经处理过的文本长度，可以当成下标来使用
  let index = 0
  // 上一次处理的标签，即父元素
  let last, lastTag
  while (html) {
    last = html
    // 父元素为真，或者不是纯文本标签（script,style,textarea）
    if (!lastTag || !isPlainTextElement(lastTag)) {
      // 第一次出现<的位置
      let textEnd = html.indexOf('<')
      // 以<开头的文本逻辑
      if (textEnd === 0) {
        // 注释逻辑处理
        if (comment.test(html)) {
          const commentEnd = html.indexOf('-->')

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3)
            }
            advance(commentEnd + 3)
            continue
          }
        }

        // 条件注释逻辑
        if (conditionalComment.test(html)) {
          const conditionalEnd = html.indexOf(']>')

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2)
            continue
          }
        }

        // Doctype逻辑
        const doctypeMatch = html.match(doctype)
        if (doctypeMatch) {
          advance(doctypeMatch[0].length)
          continue
        }

        // 结束标签逻辑
        const endTagMatch = html.match(endTag)
        if (endTagMatch) {
          const curIndex = index
          advance(endTagMatch[0].length)
          parseEndTag(endTagMatch[1], curIndex, index)
          continue
        }

        // 开始标签逻辑
        const startTagMatch = parseStartTag()
        if (startTagMatch) {
          handleStartTag(startTagMatch)
          if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
            advance(1)
          }
          continue
        }
      }

      let text, rest, next
      if (textEnd >= 0) {
        // 剩余文本内容
        rest = html.slice(textEnd)
        // 通过while来解决这个问题（注意是里面的while）。如果剩余的模板不符合任何被解析的类型，那么重复解析文本，直到剩余模板符合被解析的类型为止
        // 剩余的文本不是开始标签、结束标签和注释等
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // 当判断出<是属于文本的一部分后，我们需要做的事情是找到下一个<并将其前面的文本截取出来加到前面已经截取的文本后面。
          next = rest.indexOf('<', 1)
          if (next < 0) break
          textEnd += next
          rest = html.slice(textEnd)
        }
        // 当剩余的模板什么都不符合时，就说明<属于文本的一部分。
        text = html.substring(0, textEnd)
      }

      if (textEnd < 0) {
        text = html
      }

      if (text) {
        advance(text.length)
      }

      if (options.chars && text) {
        options.chars(text, index - text.length, index)
      }
    } else {
      // 父元素为纯文本内容元素的处理 script、style、textarea的处理逻辑
      let endTagLength = 0
      const stackedTag = lastTag.toLowerCase()
      const reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'))
      const rest = html.replace(reStackedTag, function (all, text, endTag) {
        // 参数text（代表结束标签前的所有内容）
        // ([\\s\\S]*?)(</textarea>) 正则会匹配待</textarea> 之前所有的可见非可见的字符
        //[\s\S] 意思是匹配所有 空白字符+非空白字符 , 说白了也就是全部字符都可以
        // ([\\s\\S]*?)是非懒惰模式，加个问号为尽量捕捉到更少的字符串, 也就是限定了不把后边的</textarea>也给捕捉进去
        endTagLength = endTag.length
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!\--([\s\S]*?)-->/g, '$1') 
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1')
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1)
        }
        // 调用chars钩子
        if (options.chars) {
          options.chars(text)
        }
        // 将符合正则的字符 替换为空
        return ''
      })
      index += html.length - rest.length
      html = rest
      // 借宿标签
      parseEndTag(stackedTag, index - endTagLength, index)
    }

    if (html === last) {
      options.chars && options.chars(html)
      if (process.env.NODE_ENV !== 'production' && !stack.length && options.warn) {
        options.warn(`Mal-formatted tag at end of template: "${html}"`, { start: index + html.length })
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag()

  // 改变下标 以及截取html
  function advance (n) {
    index += n
    html = html.substring(n)
  }

  function parseStartTag () {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
        start: index
      }
      advance(start[0].length)
      let end, attr
      // HTML模板不符合开始标签结尾部分的特征，并且符合标签属性的特征，那么进入到循环中进行解析与截取操作
      while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
        attr.start = index
        advance(attr[0].length)
        attr.end = index
        match.attrs.push(attr)
      }
      if (end) {
        match.unarySlash = end[1]
        advance(end[0].length)
        match.end = index
        return match
      }
    }
  }

  function handleStartTag (match) {
    const tagName = match.tagName
    const unarySlash = match.unarySlash

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag)
      }
      if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
        parseEndTag(tagName)
      }
    }
    // 是否是自闭和 标签
    const unary = isUnaryTag(tagName) || !!unarySlash

    const l = match.attrs.length
    const attrs = new Array(l)
    for (let i = 0; i < l; i++) {
      const args = match.attrs[i]
      const value = args[3] || args[4] || args[5] || ''
      const shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      }
      if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
        attrs[i].start = args.start + args[0].match(/^\s*/).length
        attrs[i].end = args.end
      }
    }

    if (!unary) {
      // 当前标签进栈，stack可以用来提取父元素
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end })
      lastTag = tagName
    }
    // 触发start钩子
    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end)
    }
  }

  function parseEndTag (tagName, start, end) {
    let pos, lowerCasedTagName
    if (start == null) start = index
    if (end == null) end = index

    // Find the closest opened tag of the same type
    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase()
      for (pos = stack.length - 1; pos >= 0; pos--) {
        // 从后往前开始便利 找到栈中匹配到的当前结束标签的开始标签 就退出循环
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // 如果没有 匹配到 就置为0
      pos = 0
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (let i = stack.length - 1; i >= pos; i--) {
        if (process.env.NODE_ENV !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            `tag <${stack[i].tag}> has no matching end tag.`,
            { start: stack[i].start, end: stack[i].end }
          )
        }
        // 调用end钩子
        if (options.end) {
          options.end(stack[i].tag, start, end)
        }
      }

      // 开始标签出栈，即父元素回到上一个
      stack.length = pos
      lastTag = pos && stack[pos - 1].tag
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end)
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end)
      }
      if (options.end) {
        options.end(tagName, start, end)
      }
    }
  }
}
```

### 总结

解析器的作用是通过模板得到AST（抽象语法树）。

生成AST的过程需要借助HTML解析器，当HTML解析器触发不同的钩子函数时，我们可以构建出不同的节点。

随后，我们可以通过栈来得到当前正在构建的节点的父节点，然后将构建出的节点添加到父节点的下面。

最终，当HTML解析器运行完毕后，我们就可以得到一个完整的带DOM层级关系的AST。

HTML解析器的内部原理是一小段一小段地截取模板字符串，每截取一小段字符串，就会根据截取出来的字符串类型触发不同的钩子函数，直到模板字符串截空停止运行。