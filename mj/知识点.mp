在层叠上下文中，其子元素按照上面解释的规则进行层叠。形成层叠上下文的方法有：

根元素<html></html>
position值为absolute | relative，且z-index值不为 auto
position 值为 fixed | sticky
z-index 值不为 auto 的flex元素，即：父元素display: flex | inline-flex
opacity 属性值小于 1 的元素
transform 属性值不为 none的元素
mix-blend-mode 属性值不为 normal 的元素
filter、perspective、clip-path、mask、mask-image、mask-border、motion-path 值不为 none 的元素
perspective 值不为 none 的元素
isolation 属性被设置为 isolate 的元素
will-change 中指定了任意 CSS 属性，即便你没有直接指定这些属性的值
-webkit-overflow-scrolling 属性被设置 touch的元素

总结:

层叠上下文可以包含在其他层叠上下文中，并且一起组建了一个有层级的层叠上下文
每个层叠上下文完全独立于它的兄弟元素，当处理层叠时只考虑子元素，这里类似于BFC
每个层叠上下文是自包含的：当元素的内容发生层叠后，整个该元素将会在父级叠上下文中按顺序进行层叠

层叠顺序 (层叠次序, 堆叠顺序, Stacking Order) 描述的是元素在同一个层叠上下文中的顺序规则，从层叠的底部开始，共有七种层叠顺序：
背景和边框：形成层叠上下文的元素的背景和边框。
负z-index值：层叠上下文内有着负z-index值的定位子元素，负的越大层叠等级越低；
块级盒：文档流中块级、非定位子元素；
浮动盒：非定位浮动元素；
行内盒：文档流中行内、非定位子元素；
z-index: 0：z-index为0或auto的定位元素， 这些元素形成了新的层叠上下文；
正z-index值：z-index 为正的定位元素，正的越大层叠等级越高