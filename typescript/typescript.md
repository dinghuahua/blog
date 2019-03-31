> 安装Typescript

 * 1.在命令行中输入以下命令：npm install -g typescript
 * 2.如果在安装过程中出现以下错误,是因为权限不足导致的。可以通过在命令前面添加sudo进行解决：sudo npm install -g Typescript
<div align="center">
    <img src="https://github.com/dinghuahua/blog/blob/feature1/typescript/images/ts1.png" width="40%">
</div>

  * 3.以上命令会在全局安装tsc命令，安装完成之后，我们就可以在任何地方执行tsc命令了
  * 4.编译一个 文件：tsc hello.ts
  * 5.约定使用Typescript编写的文件为.ts为后缀，用Typescript编写react时，以.tsx为后缀
  * 6.Typescript中，使用: 指定类型的变量，:前后有没有空格都可以
  * 7.Typescript只会进行静态检查，如果发现有错误，编译的时候就会报错
  * 8.Typescript编译的时候即使报错了，还是会生成编译结果，我们仍然可以使用这个编译之后的文件
  * 9.如果要在报错的时候终止js文件的生成，可以在tsconfig.json中配置noEmitError即可，可以参考 [官方文档](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
> 原始数据类型

  * 1.原始数据类型包括： 布尔值、数值、字符串、null、undefined以及ES6中新增的Symbol
  * 2.使用构造函数 new Boolean 创建的对象不是布尔值，返回的是Boolean对象,直接使用Boolean(1)返回的是boolean类型
  * 3.使用string定义字符串类型时，可以使用` 来定义ES6中的模板字符串
  * 4.javascript没有空值（void）的概念，在Typescript可以使用void表示没有任何返回值的函数
  * 5.声明一个void类型的变量没有什么作用，因为你只能将它赋值为undefined和null
  * 6.在Typescript 中，可以使用null和undefined来定义这两个原始数据类型
    * 与void的区别是，undefined和null是所有类型的子类型，即undefined类型的变量可以赋值给number类型的变量；let num:number = undefined;不会报错
    * 而void类型的变量不能赋值给number类型的变量；let num:number = void;会报错

###### 例子
``` javascript  
// ./code/tsEG1.ts  
let isDone: boolean = false;
// let isBoolean: boolean = new Boolean(1); 会报错
let isBoolean: Boolean = new Boolean(1);
let isBoolean2: boolean = Boolean(1);

let myName: string = 'Tom';
let sentence: string = `hello,my name is ${myName}`;

function alertName():void{
    alert(sentence);
}
let unusable: void =undefined;
let unusable: void =null;
let unusable: undefined =undefined;
let unusable: null =null;

let num:number = undefined;
let u:undefined;
let num2:number = u;

let u:void;
// let num3:number = u;会报错
```
编译结果为：
``` javascript
// ./code/sEG1.ts
var isDone = false;
// let isBoolean: boolean = new Boolean(1); // 会报错
var isBoolean = new Boolean(1);
var isBoolean2 = Boolean(1);
var myName = 'Tom';
var sentence = "hello,my name is " + myName;
```

> 任意值类型
    任意值（Any）用来表示允许赋值为任意类型
###### 什么是任意值类型
* 如果一个普通类型，在赋值过程中改变类型是不被允许的
* 但如果是any类型，则允许被赋值为任意类型
``` javascript
// ./code/tsEG2.ts
let str: string = 'lyf';
str = 'liyf';
// str = 7; // 会报错
```
###### 任意值的属性和方法
* 在任意值上访问任意属性都是允许的，tsc 编译不会报错，也会生成对应的js文件，只不过该js文件执行的时候如果访问来不存在的方法或者二级以上的属性会报错
* 可以认为，声明一个变量为任意值后，对它的作何操作，返回的内容类型都是任意值

``` javascript
// ./code/tsEG2.ts
let anyThing: any = 'hello';
// tsc 编译不会报错，也会生成对应的js文件，只不过该js文件执行的时候会报错
console.log(anyThing.myName);
console.log(anyThing.myName.firstName);
console.log(anyThing.setName('join'));
console.log(anyThing.setName('join').getName());

```
###### 未声明类型的变量
* 变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型

``` javascript 
// ./code/tsEG2.ts
let something;
something = 'lyf';
something = 54;

// 等价于
let something:any;
something = 'lyf';
something = 54;

```
> 类型推论
    如果没有明确的指定类型，那么Typescript会依照类型推论的规则推断出一个类型
###### 什么是类型推论
``` javascript
// ./code/tsEG2.ts
let
```
> 联合类型
> 对象的类型——接口
> 数组的类型
> 函数的类型
> 类型断言
> 声明文件
> 内置对象