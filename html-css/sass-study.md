### 变量
* 1. 变量以美元符号开头，赋值方法与css属性的写法一样
  *  $width:5em;
  *  #main { width :$width;}
* 2. 比那两支持块级作用域，嵌套规则内定义的变量只能在嵌套规则内使用（局部变量） ，不在嵌套规则内定义的 变量则可在任何地方使用（全局变量）。将局部变量转换为全局变量可以添加!global 声明：
  *   #main {$width:5em !global;width:$width;} 
  *   #sidebar{width:$width}
### 字符串
* 1. 支持的css的两种字符串类型：有引号字符串和无引号字符串
* 2. 在编译css文件时不会改变其类型，只有一种情况例外，使用#{}(interpolation)时，有引号字符串将被编译为无引号字符串，这样便于在mixin中引用选择器名
    @include firefox-message('.header');
    @mixin firefox-message($selector){
        body.firfox #{selector}:before{
            content: 'hi firefox user!';
        }
    } 
    编译为
    body.firefox .header:before{
        content:'hi firefox user!';
    }
### 数组
* 1.数组(lists) 指sass如何处理css中margin:10px 15px 0 0 或者 font-face:Helvetica, Arial, sans-serif 这样通过空格或者都好分割的一系列的值，事实上，独立的值也被视为数组——只包含一个值的数组
* 2.nth 函数可以直接访问数组中的某一项
* 3.join函数可以将多个数组连接在一起
* 4.append函数可以在数组汇总添加新值
* 5.@each 指令能够遍历数组中的每一项
* 6.用() 表示不包含任何值的空数组。空数组不可以直接编译成css，比如编译font-family: ()   sass将会报错。如果数组中包含空数组或者空值，编译时将被清除，比如1px 2px () 3px或者1px 2px null 3px
* 7.基于逗号分隔的数组允许保留结尾的都会，这样做的意义是强调数组的结构关系，尤其是需要声明只包含单个值的数组时
* 8.运算 支持数字的加减乘除、取整等运算（+ - * / %），如果必要会自动在不同单位间转换值
  * 一下三种情况 / 将被视为 除法运算符号
        1. 如果值，或值的一部分，是变量或者函数的返回值
        2. 如果值被圆括号包裹
        3. 如果值是算术表达式的一部分
  * 如果需要使用变量，同时又要确保 / 不做除法运算而是完整的编译到css文件中，只需要用#{} 插值语句将变量包裹  
  * 如果颜色值包含alpha channel (rgba 或者 hsla) 必须拥有相等的alpha值才能进行运算，因为算术运算不会作用于alpha值，颜色值alpha channel 可以通过opacify 或者 transparentize 两个函数进行调整
        $translucent-red: rgba(255, 0, 0, 0.5);
        p {
            color: opacify($translucent-red, 0.3);
            background-color: transparentize($translucent-red, 0.25);
        }
        编译为
        p {
            color: rgba(255, 0, 0, 0.8);
            background-color: rgba(255, 0, 0, 0.25); 
        }
* 9.插值语句#{} (interpolation:#{}) 通过#{} 插值语句可以在选择器或属性名中使用变量
* 10.@import 寻找sass文件并将其导入，但在以下情况下，@import仅作为普通的css语句，不会导入任何sass文件
  * 文件拓展名是 .css
  * 文件名以http://开头
  * 文件名是url()
  * @import 包含media queries
  * 如果不在上述情况内，文件的拓展名是.scss 或.sass ，则导入成功。没有指定拓展名，sass将会试着寻找文件名相同，拓展名为.scss 或者 .sass 的文件并将其导入