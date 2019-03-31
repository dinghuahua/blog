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
``` typescript  
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
``` typescript
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
``` typescript
// ./code/tsEG2.ts
let str: string = 'lyf';
str = 'liyf';
str = 7; // 会报错
```
###### 任意值的属性和方法
* 在任意值上访问任意属性都是允许的，tsc 编译不会报错，也会生成对应的js文件，只不过该js文件执行的时候如果访问来不存在的方法或者二级以上的属性会报错
* 可以认为，声明一个变量为任意值后，对它的作何操作，返回的内容类型都是任意值

``` typescript
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

``` typescript 
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
``` typescript
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

``` typescript
// ./code/tsEG3.ts
let myStrOrNum:string | number;
myStrOrNum = 'lyf';
myStrOrNum = '54';
myStrOrNum = true;// 报错
``` 
###### 访问联合类型的属性和方法
    当Typescript不确定一个联合类型的变量倒是是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或者方法

``` typescript
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
``` typescript
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
let lyf1: Person = {
    name:'LYF',
    age:18
}
// 报错 少了age属性
// 报错信息中会提示 当前180行导致了171行报错
let lyf2: Person = {
    name:'LYF'
}
// 报错 多了gender属性
let lyf3: Person = {
    name:'LYF',
    age:18,
    gender:'male'
}
```
<div align="center">
错误追踪<img src="https://github.com/dinghuahua/blog/blob/feature1/typescript/images/ts2.png" width="40%">
</div>

###### 可选属性
* 有时我们希望不要完全匹配一个形状，那么可以用可选属性,用?: 进行标示
* 可选属性的含义是该属性可以不存在
* 这是仍然不允许添加未定义的属性

``` typescript
// ./code/tsEG4.ts
interface Person1{
    name: string;
    age?: number;
}
let lyf11: Person1 = {
    name:'LYF',
    age:18
}
//少了age属性 也不会报错 
let lyf12: Person1 = {
    name:'LYF'
}
// 报错 多了gender属性
let lyf13: Person1 = {
    name:'LYF',
    age:18,
    gender:'male'
}

```
###### 任意属性
* 有时候我们希望一个接口允许有任意类型的属性，可以使用如下方式
* [propName: string]: any
    * [propName: string] 定义了任意属性取string类型的值，纯数字也可以被解析为string，故针对propName不会报错，但是‘123’字符串不能被解析为number；比如lyf27
* 一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集；比如Person21
* [propName: string]: any   一模一样的可选属性不能重复定义；比如Person22
* 定义类的时候可选属性，可以有多个但是不能重复；比如Person22
* 实现类的时候，即变量实现类的可选的时候，针对一种可选属性可以有多个属性，只要不和已经声明固定的属性名一样就行，比如lyf26

``` typescript
// ./code/tsEG4.ts
interface Person21{
    name: string;
    age?: number;
    [propName: string]: number; // 会报错  name值的string类型不是可选属性值的类型number的子集
}
interface Person22{
    name: string;
    age?: number;
    [propName: string]: string;
    [propName: string]: string; // 会报错  与上一条可选属性一模一样 重复了
    [propName: number]: string; // 不重复 所以不报错
}
// 以下以Person2 类举例
interface Person2{
    name: string;
    age?: number;
    [propName: string]: string | number;
}
let lyf21: Person2 = {
    name:'LYF',
    age:18
}
let lyf22: Person2 = {
    name:'LYF'
}
let lyf23: Person2 = {
    name:'LYF',
    age:18,
    gender:'male'
}
let lyf24: Person2 = {
    name:'LYF',
    age:18,
    gender:54
}
let lyf25: Person2 = {
    name:'LYF',
    age:18,
    gender:true // 会报错 自定义属性类型必须是string | number 类型
}
let lyf26: Person2 = {
    name:'LYF',
    age:18,
    gender1:'male',
    gender2:'female',
    age:19 // 会报错  自定义的age 和原本固定班的属性名重复
}
let lyf27: Person2 = {
    name:'LYF',
    age:18,
    // propName 123  也可以被解析为string  故不会报错
    123:'male'
}

// 以下以Person3 类举例
interface Person3{
    name: string;
    age?: number;
    [propName: number]: string | number;
}

let lyf31: Person3 = {
    name:'LYF',
    age:18,
    123:'male'
}
```

<div align="center">
    联合类型和接口的结合报错信息<img src="https://github.com/dinghuahua/blog/blob/feature1/typescript/images/ts3.png" width = "40%">
</div>

###### 只读属性
* 有时候希望对象中的一些字段只能在创建的时候被赋值，那么可以用readonly定义只读属性
* 格式为 readonly propName: any
* 只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候，比如Person5
``` typescript
// ./code/tsEG4.ts
interface Person4{
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}

let lyf41: Person4 = {
    id:19870504,
    name: 'lyf',
    age:18,
    gender:'male'
}
lyf41.id = 54; // 会报错  因为只读

interface Person5{
    readonly id?: number;
    name: string;
    age?: number;
    [propName: string]: any;
}

let lyf51: Person5 = {
    name: 'lyf',
    age:18,
    gender:'male'
}

lyf51.id = 54; // 会报错  因为只读
```

> 数组的类型
    在typescript中，数组类型有多种定义方式，比较灵活
######【类型+方括号】
* 比如number[],比如arr1
* 数组中不允许出现其他类型的值,比如arr2
* 数组的一些方法的参数也会根据数组在定义时约定的类型进行限制，比如arr1.push('a');

###### 数组泛型
* 比如Array<number>,比如arr2;

###### 用接口表示数组 todo inde propname  的区别
* 比如NumberArray;

###### any在数组中的应用
* 用any表示数组中允许出现任意类型，比如arr6

###### 类数组 todo 内置对象
* 类数组不是数组类型，比如arguments，比如arrFunction
* 常见放入类数组都有自己的接口定义，比如IArguments,NodeList,HTMLCollection

``` typescript
// ./code/tsEG5.ts

//【类型+方括号】
let arr1: number[] = [1,2,3,4,5];
let arr2: number[] = [1,2,3,4,'a'];//会报错 类型被推断为number | string
arr1.push('a'); //会报错 push进行的是个string，但是arr1定义的是number 

let arr3: Array<number> = [1,2,3,4,5];

interface NumberArray1{
    [index:number]:number
}
interface NumberArray2{
    [propName:number]:number
}
let arr4: NumberArray1 = [1,2,3,4,5];
let arr5: NumberArray2 = [1,2,3,4,5];

let arr6: any[] = [1,'2',{name:'lyf'}];

function arrFunction(){
    let args:IArguments = arguments;
}
```

> 函数的类型
###### 函数声明
* 一个函数有输入和输出，要在Typescript中对其进行约束，需要把输入和输出都考虑到，比如fun1 
*输入多余或者少于要求的参数，都是不被允许的
###### 函数表达式
* 对等号右侧的匿名函数进行了类型定义，而等号左边的变量fun2是通过赋值操作进行类型推论而推论出来的，如果需要手动给fun2添加类型，比如fun3


``` typescript
// ./code/tsEG6.ts
function fun1(x: number, y: number): number{
    return x + y;
}
fun1(1,2);
fun1(1); // 报错 参数少 
fun1(1,2,3); // 报错 参数多

let fun2 = function(x: number,y: number):number{
    return x + y;
}
let fun3:(x: number, y: number) => number = function(x: number, y: number): number{
    return x + y;
}

```
> 类型断言
> 声明文件
> 内置对象