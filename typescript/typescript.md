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
  * 8.Typescript编译的时候即使报错了，也不影响后续的编译，还是会生成编译结果文件，我们仍然可以使用这个编译之后的文件
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
  * 7.定义方法function的返回值类型格式为在入参的右括号后进行定义 function alertName():void{}

###### 例子
``` javascript  
// ./code/tsEG1.ts  
let isDone: boolean = false;
let isBoolean: boolean = new Boolean(1); // 会报错
let isBoolean: Boolean = new Boolean(1);
let isBoolean2: boolean = Boolean(1);

let myName: string = 'Tom';
let sentence: string = `hello,my name is ${myName}`;

function alertName():void{
    alert(sentence);
}
let unusable1: void =undefined;
let unusable2: void =null;
let unusable3: undefined =undefined;
let unusable4: null =null;

let num:number = undefined;
let u:undefined;
let num2:number = u;

let u2:void;
let num3:number = u2;// 会报错
```
编译结果为：
``` javascript
// ./code/sEG1.ts
var isDone = false;
let isBoolean: boolean = new Boolean(1); // 会报错
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
str = 7; // 会报错
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
* 如果没有明确的指定类型，那么Typescript会依照类型推论的规则推断出一个类型
* 如果定义的时候赋值，不管之后有没有赋值，都会被推断成any类型而完全不被类型检查
###### 什么是类型推论
    声明变量时若没有指定类型，会根据当前行的赋值结果推论出变量的类型，如果在生命的时候没有赋值，则此变量的类型才是any
``` javascript
// ./code/tsEG2.ts
let mystr = 'lyf';
mystr = 54; // 会报错

// 等价于
let mystr: string = 'lyf';
mystr = 54; // 会报错

```
> 联合类型
* 联合类型(Union Types)表示取值可以为多种类型中的一种
* 联合类型使用 | 分割每个类型
* 可以赋值为定义的联合类型中任意一个，如果是其他类型则会编译报错

``` javascript
// ./code/tsEG3.ts
let myStrOrNum:string | number;
myStrOrNum = 'lyf';
myStrOrNum = '54';
myStrOrNum = true;// 报错
``` 
###### 访问联合类型的属性和方法
    当Typescript不确定一个联合类型的变量倒是是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或者方法

``` javascript
// ./code/tsEG3.ts
function getLength(something:string | number):number{
    return something.length; // length 不是共有属性，所以会报错
}
function getString(something:string | number):string{
    return something.toString(); // toString是共有属性，所以不会报错
}
getLength('lyf');
// 报错信息中 不会提示当前行144导致了138报错
getLength(54);
```
上例中，length不是string和number的共有属性，所以会报错
###### 联合类型的变量的类型推论
    联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型
``` javascript
// ./code/tsEG3.ts
let myStrOrNum1:string | number;
myStrOrNum1 = 'lyf';
console.log(myStrOrNum1.length);// 3 不报错
myStrOrNum1 = 54;
console.log(myStrOrNum1.length);// 编译时报错 因为被
推断为number，访问length属性时就报错了
```

> 对象的类型——接口
    在Typescript中，我们使用接口(interfaces)来定义对象的类型
###### 什么是接口
* 在面向对象语言中，接口是一个很重要的概念，是对行为的抽象，而具体如何行动需要由类(classes)去实现(implements)
* Typescript中的接口是一个非常灵活的概念，除了可用于对类的一部分行为进行抽象外，也常用于【对象的形状】进行描述
* 定义的变量比接口少一些属性是不允许的，多一些属性也是不允许的，可见，赋值的时候，变量的形状必须和接口的形状保持一致。

``` typescript
// ./code/tsEG4.ts
interface Person{
    name: string;
    age: number;
}
let lyf: Person = {
    name:'LYF',
    age:18
}
// 报错 少了age属性
// 报错信息中会提示 当前180行导致了171行报错
let lyf: Person = {
    name:'LYF'
}
// 报错 多了gender属性
let lyf: Person = {
    name:'LYF',
    age:18,
    gender:'male'
}
```
错误追踪
<div align="center">

    
错误追踪<img src="https://github.com/dinghuahua/blog/blob/feature1/typescript/images/ts2.png" width="40%">
</div>
上例中，定义了一个接口Person，接着定义了一个变量lyf，它的类型是Person，这样我们就约束了lyf的形状必须和Person一致。
> 数组的类型
> 函数的类型
> 类型断言
> 声明文件
> 内置对象