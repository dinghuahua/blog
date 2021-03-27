容易忘记问题：

- 脱离文档流，会导致父元素高度塌陷
1、浮动
2、position:absolute/ fixed =====sticky（无法挽救父元素高度塌陷的问题,除了定高）

2、创建BFC
BFC特性：
1.BFC里的布局跟常规流里的一样，例如盒子会在垂直方向排列。
2.属于同一个BFC里的盒子会产生margin重叠。
3.容器内元素的margin的左边，会与容器的border左边相接触。
4.BFC容器不会与float元素发生重叠。
5.BFC内的元素不会影响到外部的元素。
6.BFC容器计算高度时，内部float元素也参与计算高度
7、水平边距永远不会重合。

根元素
float不为none的浮动元素。
Position:fixed/absolutd
display:flex/grid == inline-block ==== table-cell; 等。
overflow auto/hidden. 不是visible


1、清除浮动 https://juejin.im/post/6844903504545316877
消除浮动的其中一个方式就是创建 BFC
元素设置了overflow样式且值不为visible时，该元素就构建了一个BFC，BFC在计算高度时，内部浮动元素的高度也要计算在内，BFC的高度也不会发生塌缩，所以达到了清除浮动的目的，

(clear:both 让当前元素的左右两边没有浮动元素)

在父级元素的最后，添加一个伪元素::after. 必须是after，clear:both，注意该伪元素的display为block/inline-block，
在文档流中，它必须在父元素的边界内，父元素只有增加其高度才能达到此目的，可以说是一个意外收获。(clear的值为both也有相同的效果，通俗理解就是，哪边不允许有浮动元素，clear就是对应方向的值，两边都不允许就是both)

父元素变为BFC

父元素设置高度


防止外边距重叠解决方法
外层元素padding代替 外层元素透明边框 border:1px solid transparent; 内层元素绝对定位 postion:absolute: 外层元素 overflow:hidden; 内层元素 加float:left;或display:inline-block; 内层元素padding:1px;



4、 css布局
参考回答：
六种布局方式总结：圣杯布局、双飞翼布局、Flex布局、绝对定位布局、表格布局、网格布局。
圣杯布局是指布局从上到下分为header、container、footer，然后container部分定为三栏布局。这种布局方式同样分为header、container、footer。圣杯布局的缺陷在于 center 是在 container 的padding中的，因此宽度小的时候会出现混乱。
双飞翼布局给center 部分包裹了一个 main 通过设置margin主动地把页面撑开。
Flex布局是由CSS3提供的一种方便的布局方式。
绝对定位布局是给container 设置position: relative和overflow: hidden，因为绝对定位的元素的参照物为第一个postion不为static的祖先元素。 left 向左浮动，right 向右浮动。center 使用绝对定位，通过设置left和right并把两边撑开。 center 设置top: 0和bottom: 0使其高度撑开。
表格布局的好处是能使三栏的高度统一。
网格布局可能是最强大的布局方式了，使用起来极其方便，但目前而言，兼容性并不好。网格布局，可以将页面分割成多个区域，或者用来定义内部元素的大小，位置，图层关系。

 5、垂直居中
单行文本

多行文本
固定高度
不固定高度

6、水平居中
7、性能优化
参考回答：
减少HTTP请求
使用内容发布网络（CDN）
添加本地缓存
压缩资源文件
将CSS样式表放在顶部，把javascript放在底部（浏览器的运行机制决定）
避免使用CSS表达式
减少DNS查询
使用外部javascript和CSS
避免重定向
图片lazyLoad


settimeout 第三个参数



