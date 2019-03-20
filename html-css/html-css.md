css
##### 水平居中
        行内元素水平居中
            .parent{text-align:center;}
        div 水平居中
            1、使用flex
                .parent{
                    height:100px;
                    border: 1px solid red;

                    display:flex;
                    justify-content:center;
                    align-item:center;
                }
                .child{
                    border:1px solid green;
                    width:20px;
                }
            2、使用transform
                .parent{
                    height:100px;
                    width:100px;
                    border:1px solid red;
                    
                    position:reletive;
                }
                .child{
                    border:1px solid green;
                    
                    position:absolute;
                    top:50%;
                    left:50%;
                    /* 
                        以当前元素为基准 进行百分比 50%即当前元素的50%
                        以当前元素的位置进行平移
                    */ 
                    transform:translate(-50%,-50%);
                }
            3、使用margin-top  一半的高度  不推荐 需要写死px
                .parent{
                    height:200px;
                    widht:200px;
                    border:1px solid red;
                    
                    position:relative;
                }
                .child{
                    border:1px solid green;
                    width:100px;
                    height:100px;

                    position:absolute;
                    top:50%;
                    left:50%;
                    margin-left:-50px;
                    margin-top:-50px;
                }
            4、使用绝对布局absolute 和 margin:auto
                .parent{
                    height:200px;
                    width:200px;
                    border:1px solid red;
                    position:relative;
                }
                .child{
                    border:1px solid green;
                    width:100px;
                    height:100px;
                    position:absolute;
                    margin:auto;
                    top:0;
                    bottom:0;
                    left:0;
                    right:0;
                }

##### 三栏布局

        要求两边两栏宽度固定，中间栏宽度自适应

            方案一：position绝对定位法

                center的div需要放到后面，将左右两边使用absolute定位，因为绝对定位使其脱离文档流，最后面的center会显示在正常文档流中，然后设置margin属性，留出左右两边的宽度。

                .parent {
                border: 1px solid red;
                position: relative;
                }

                .child_left {
                width: 100px;
                height: 100px;
                border: 1px solid gray;
                position: absolute;
                }

                .child_right {
                width: 100px;
                height: 100px;
                border: 1px solid green;
                position: absolute;
                right: 0;
                }

                // div在html中必须放在left和right之后
                .child_center {
                height: 100px;
                border: 1px solid black;
                margin: 0 100px;
                }
            方案二：float 自身浮动法

                center的div需要放到后面，对左右使用float:left和float：right，float使左右两个元素脱离文档流，中间的正常文档流中，然后设置margin属性，留出左右两边的宽度。

                .parent {
                border: 1px solid red;
                position: relative;
                }

                .child_left {
                width: 100px;
                height: 100px;
                border: 1px solid gray;
                float: left;
                }

                .child_right {
                width: 100px;
                height: 100px;
                border: 1px solid green;
                float: right;
                }

                .child_center {
                height: 100px;
                border: 1px solid black;
                margin: 0 100px;
                }
##### BFC
    BFC 是CSS 布局的一个概念，是一块独立的渲染区域，是一个环境，里面的元素不会影响到外部的元素
###### 如何生成BFC （即脱离文档流）
    * 根元素，即HTML 元素（最大的一个BFC）
    * float 的值不为none
    * overflow 的值不为visible
    * display 的值 为inline-block table-cell table-caption
    * position 的值为absolute 或者 fixed
    display:table 也可以认为生成BFC，其实主要原因在于table会默认生成一个匿名的table-cell，正是这个匿名的table-cell 生成了BFC
##### 浏览器对于BFC这块区域的约束规则如下：
    * 在一个BFC中，块盒 与 行盒（行盒由一行中所有的内联元素所组成）都垂直的沿着其父元素的边框排列。w3c的规范是：
         在BFC中，每一个盒子的左外边缘（margin-left）会触碰到容器的左边缘(border-left)（对于从右到左的格式来说，则触碰到右边缘）。浮动也是如此（尽管盒子里的行盒子 Line Box 可能由于浮动而变窄），除非盒子创建了一个新的BFC（在这种情况下盒子本身可能由于浮动而变窄）。
    * 外边距折叠 常规流布局时，盒子都是垂直排列的，两者之间的间距由各自的外边距所决定，但不是二者外边距之和。
        <div class="container">
            <p>Sibling 1</p>
            <p>Sibling 2</p>
        </div>
        .container {
            background-color: red;
            overflow: hidden; /* creates a block formatting context */
        }
        p {
            background-color: lightgreen;
            margin: 10px 0;
        }

        <div align="center">
            <img src="">
        </div>
        渲染结果是：两个相邻的元素 Sibling 1 和 Sibling 2 之间的垂直距离是10px，而不是20px，这是外边距折叠(Collapsing Margins)的结果。这是因为两个p标签都从属于同一个BFC。
        在CSS当中，相邻的两个盒子（可能是兄弟关系也可能是祖先关系）的外边距可以结合成一个单独的外边距，这种合并外边距的方式被称作折叠，并且因而所结合成的外边距成为折叠外边距。折叠的结果按照以下规则计算
            * 两个相邻的外边距都是正数时，折叠结果是它们两者之间较大的值
            * 两个相邻的外边距都是负数时，折叠结果是两者绝对值的较大值
            * 两个外边距一正一负时，折叠结果是两者的相加的和
        产生折叠的必备条件：margin必须是邻接的
        
        修改第三个p元素，使之创建一个新的BFC
        <div class="container">
            <p>Sibling 1</p>
            <p>Sibling 2</p>
        <div class="newBFC">
            <p>Sibling 3</p>
        </div>
        </div>
        .container {
            background-color: red;
            overflow: hidden; /* creates a block formatting context */
        }
        p {
            margin: 10px 0;
            background-color: lightgreen;
        }
        .newBFC {
            overflow: hidden;  /* creates new block formatting context */
        }
        
        <div align="center">
            <img src="">
        </div>
        渲染结果：第二个p标签 和 第三个p标签 之间的外边距为20px,因为第二个和第三个p标签分属于不同的BFC，它们之间就不会发生外边距折叠了。
##### BFC 的约束规则
* 利用BFC避免外边距折叠。  
        BFC产生外边距折叠要满足一个条件：两个相邻元素要处于同一个BFC中，所以，若两个相邻元素在不同的BFC中，就能避免外边距折叠。
* BFC包含浮动
        浮动元素会脱离文档流(绝对定位元素会脱离文档流)。如果一个没有高度或者height是auto的容器的子元素是浮动元素，则该容器的高度是不会被撑开的。我们通常会利用微元素（:after 或者 :before）俩解决这个问题。BFC能包含浮动，也能解决容器高度不会被撑开的问题。
* BFC 避免文字环绕
    <div class="parent">
		<div style="margin-top:20px;">第一个子元素</div>
	</div>
    如果父元素的第一个子元素设置margin-top,或者父元素的最后一个子元素设置margin-bottom，则margin-top、margin-bottom 会溢出到父元素，如要防止此类现象的发生，可以为父元素设置border

