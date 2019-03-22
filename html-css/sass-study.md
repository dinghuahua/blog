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