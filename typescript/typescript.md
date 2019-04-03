> 安装Typescript

 * 1.在命令行中输入以下命令：npm install -g typescript
 * 2.如果在安装过程中出现以下错误,是因为权限不足导致的。可以通过在命令前面添加sudo进行解决：sudo npm install -g Typescript,window下使用管理员权限运行CMD
<div align="center">
    <img src="https://github.com/dinghuahua/blog/blob/feature1/typescript/images/ts1.png" width="40%">
</div>

  * 3.以上命令会在全局安装tsc命令，安装完成之后，我们就可以在任何地方执行tsc命令了
  * 4.编译一个 文件：tsc hello.ts
  * 5.约定使用Typescript编写的文件为.ts为后缀，用Typescript编写react时，以.tsx为后缀
  * 6.Typescript中，使用: 指定类型的变量，:前后有没有空格都可以
  * 7.Typescript只会进行静态检查，如果发现有错误，编译的时候就会报错
  * 8.Typescript编译的时候即使报错了，也不影响后续的编译，还是会生成编译结果文件，我们仍然可以使用这个编译之后的文件
  * 9.如果要在报错的时候终止js文件的生成，可以在tsconfig.json(可以通过tsc --init 生成此文件)中配置noEmitError即可，可以参考 [官方文档](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
  * 
> 在typescript中主要提供以下数据类型
* 布尔类型(boolean) 
* 数字类型(number) 
* 字符串类型(string) 
* 数组类型(array) 
* 元组类型(tuple) 
* 枚举类型(enum) 
* 任意类型(any) 
* null和undefined 
* void类型 
* never类型  
    * never类型表示的是那些永不存在的值的类型。 例如， never类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 never类型，当它们被永不为真的类型保护所约束时。
  
> 数据类型

* 1.原始数据类型包括： boolean、number、string、null、undefined以及ES6中新增的Symbol
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

> 任意值类型
    任意值（Any）用来表示允许赋值为任意类型
###### 什么是任意值类型
* 如果一个普通类型，在赋值过程中改变类型是不被允许的
* 但如果是any类型，则允许被赋值为任意类型
``` typescript
// ./code/ts-any-inference-union.ts
let str: string = 'lyf';
str = 'liyf';
str = 7; // 会报错
```
###### 任意值的属性和方法
* 在任意值上访问任意属性都是允许的，tsc 编译不会报错，也会生成对应的js文件，只不过该js文件执行的时候如果访问来不存在的方法或者二级以上的属性会报错
* 可以认为，声明一个变量为任意值后，对它的任何操作，返回的内容类型都是任意值

``` typescript
// ./code/ts-any-inference-union.ts
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
// ./code/ts-any-inference-union.ts
let something;
something = 'lyf';
something = 54;

// 等价于
let something:any;
something = 'lyf';
something = 54;

```

> 数组的类型
    在typescript中，数组类型有多种定义方式，比较灵活
######【类型+方括号】
* 比如number[],比如arr1
* 数组中不允许出现其他类型的值,比如arr2
* 数组的一些方法的参数也会根据数组在定义时约定的类型进行限制，比如arr1.push('a');

###### 数组泛型
* 比如Array<number>,比如arr2;

###### 用接口表示数组 todo index propname  的区别
* 比如NumberArray;

###### any在数组中的应用
* 用any表示数组中允许出现任意类型，比如arr6

###### 类数组 todo 内置对象
* 类数组不是数组类型，比如arguments，比如arrFunction
* 常见放入类数组都有自己的接口定义，比如IArguments,NodeList,HTMLCollection

``` typescript
// ./code/ts-array-tuple.ts
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

> 元组
* 数组合并了相同类型的对象，而元组(Tuple)合并了 不同类型的对象
* 元组起源于函数编程语言（比如：F#）在这些语言中频繁使用元组
* 元组也可以只赋值其中一项
* 但是当直接对元组类型的变量进行初始化或者赋值的时候，需要提供所有元素类型中指定的项
###### 越界的元素
* 当添加越界的元素时，它的类型会被限制为元组中每个类型的联合类型

``` typescript
// ./code/ts-array-tuple.ts
let lyf1: [string, number] = ['feng feng',1987];
let lyf2: [string, number];
lyf2[0] = 'feng feng';
lyf2[1] =1987;

lyf2[0].slice(1);
lyf2[1].toFixed(2);

// 也可以只赋值其中一项
let lyf3: [string, number];
lyf3[0] = 'feng feng';

let lyf4: [string, number] = ['feng feng']; // 会报错 数量不够
let lyf5: [string, number];
lyf5 = ['feng feng'];  // 会报错 赋值操作 数量不够
lyf5[1] = 1987;

let lyf6: [string, number];
lyf6 = ['feng feng', 1987];
lyf6.push('lyf');
lyf6.push(54);
lyf6.push(true);// 会报错
```

> 类型推论
* 如果没有明确的指定类型，那么Typescript会依照类型推论的规则推断出一个类型
* 如果定义的时候赋值，不管之后有没有赋值，都会被推断成any类型而完全不被类型检查
###### 什么是类型推论
    声明变量时若没有指定类型，会根据当前行的赋值结果推论出变量的类型，如果在生命的时候没有赋值，则此变量的类型才是any
``` typescript
// ./code/ts-any-inference-union.ts
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
// ./code/ts-any-inference-union.ts
let myStrOrNum:string | number;
myStrOrNum = 'lyf';
myStrOrNum = '54';
myStrOrNum = true;// 报错
``` 
###### 访问联合类型的属性和方法
    当Typescript不确定一个联合类型的变量倒是是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或者方法

``` typescript
// ./code/ts-any-inference-union.ts
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
// ./code/ts-any-inference-union.ts
let myStrOrNum1:string | number;
myStrOrNum1 = 'lyf';
console.log(myStrOrNum1.length);// 3 不报错
myStrOrNum1 = 54;
console.log(myStrOrNum1.length);// 编译时报错 因为被
// 推断为number，访问length属性时就报错了
```

> 函数的类型
###### 函数声明
* 一个函数有输入和输出，要在Typescript中对其进行约束，需要把输入和输出都考虑到，比如fun1 
* 输入多余或者少于要求的参数，都是不被允许的
###### 函数表达式
* 对等号右侧的匿名函数进行了类型定义，而等号左边的变量fun2是通过赋值操作进行类型推论而推论出来的，如果需要手动给fun2添加类型，比如fun3
* 注意不要混淆了Typescript中的 => 和 ES6中的 => 
* 在Typescript中 => 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型
* 在ES6中 => 叫做箭头函数
###### 用接口定义函数的形状
* 比如SearchFunc 和 fun4
* 对于函数类型的类型检查来说，函数的参数名不需要与接口里定义的名字相匹配,比如fun5
###### 可选参数
* 前面提到参数多余或者少于都是不允许的，与接口中的可选属性类似，可以用?表示可选参数
* 可选参数必须接在必需参数的后面，换句话说，可选参数后面不允许再出现必需参数了，比如buildName2
###### 参数默认值
* 在ES6中，允许给函数参数添加默认值，Typescript会讲添加了默认值的参数识别为可选参数，比如buildName3
* 此时就不受【可选参数必须接在必须参数的后面了】，比如buildName4
###### 剩余参数
* 在ES6中，可以使用...rest 的方式获取函数中的剩余参数，事实上rest是一个数组，所以我们用数组的类型来定义它,比如fun6
###### 重载
* 重载允许一个函数接受不同数量或者类型的参数时，作出不同的处理，比如reverse
    * 但是这样有一个缺点，就是不能精确的表达，输入为数字的时候，输出也为数字，输入为string，输出也应该为string
* 可是使用重载定义多个reverse1 的函数类型，比如reverse1
    * 前几次reverse1 都是函数定义，最后一次是函数的实现
    * Typescript会优先从前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面


``` typescript
// ./code/ts-func.ts
//函数声明
function fun1(x: number, y: number): number{
    return x + y;
}
fun1(1,2);
fun1(1); // 报错 参数少 
fun1(1,2,3); // 报错 参数多

// 函数表达式
let fun2 = function(x: number,y: number):number{
    return x + y;
}
let fun3:(x: number, y: number) => number = function(x: number, y: number): number{
    return x + y;
}

//用接口定义函数的形状
interface SearchFunc{
    (source: string, subString: string):boolean;
}
let fun4: SearchFunc;
fun4 = function(source: string, subString: string){
    return source.search(subString) !== -1;
}
let fun5: SearchFunc;
fun5 = function(src: string, sub: string){
    return src.search(sub) !== -1;
}

function buildName(firstName: string, lastName: string){
    if(lastName){
        return firstName + ' ' + lastName;
    }else{
        return firstName;
    }
}
let feng = buildName('yi','feng');
let fengfeng = buildName('feng');// 会报错 第二个参数必须

// 可选参数
function buildName2(firstName?: string, lastName: string){// 会报错 不必须参数后面出现了必须参数
    
    if(lastName){
        return firstName + ' ' + lastName;
    }else{
        return firstName;
    }
}
let feng2 = buildName2('yi','feng');
let fengfeng2 = buildName2('feng'); // 报错

// 参数默认值
function buildName3(firstName: string, lastName: string = 'fff'){
    
    return firstName + ' ' + lastName;
}
let feng3 = buildName3('yi','feng');
let fengfeng3 = buildName3('feng'); 

function buildName4(firstName: string = 'li', lastName: string){ // 不会报错
    
    return firstName + ' ' + lastName;
}
// buildName4 被编译为
/*function buildName4(firstName, lastName) {
    if (firstName === void 0) { firstName = 'li'; }
    return firstName + ' ' + lastName;
}*/
let feng4 = buildName4('yi','feng');
let fengfeng4 = buildName4(undefined,'feng'); 

// 剩余参数
function fun6(arr: any[],...items: any[]){
	items.map(function(v){
	    arr.push(v)
    })
}
// fun6 被编译为
/*function fun6(arr) {
    var items = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        items[_i - 1] = arguments[_i];
    }
    items.map(function (v) {
        arr.push(v);
    });
}*/
let a = [];
fun6(a,1,2,3)

// 重载
function reverse(x: number | string):number | string{
    if(typeof x === 'number'){
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string'){
        return x.split('').reverse().join('');
    }
}
//前几次reverse1 都是函数定义，最后一次是函数的实现
//Typescript会优先从前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面
function reverse1(x: number):number;
function reverse1(x: string):string;
function reverse1(x: number | string):number | string{
    if(typeof x === 'number'){
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string'){
        return x.split('').reverse().join('');
    }
}

```

> 对象的类型——接口
    在Typescript中，我们使用接口(interfaces)来定义对象的类型
###### 什么是接口
* 在面向对象语言中，接口是一个很重要的概念，是对行为的抽象，而具体如何行动需要由类(classes)去实现(implements)
* Typescript中的接口是一个非常灵活的概念，除了可用于对类的一部分行为进行抽象外，也常用于【对象的形状】进行描述
* 定义的变量比接口少一些属性是不允许的，多一些属性也是不允许的，可见，赋值的时候，变量的形状必须和接口的形状保持一致。

``` typescript
// ./code/ts-class1.ts
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
// ./code/ts-class1.ts
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
* [index : number]: any
  * 共有支持两种索引签名：字符串和数字。 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。 这是因为当使用 number来索引时，JavaScript会将它转换成string然后再去索引对象。 也就是说用 100（一个number）去索引等同于使用"100"（一个string）去索引，因此两者需要保持一致。
* 一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集；比如Person21
* [propName: string]: any   一模一样的可选属性不能重复定义；比如Person22
* 定义类的时候可选属性，可以有多个但是不能重复；比如Person22
* 实现类的时候，即变量实现类的可选的时候，针对一种可选属性可以有多个属性，只要不和已经声明固定的属性名一样就行，比如lyf26

``` typescript
// ./code/ts-class1.ts
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
// ./code/ts-class1.ts
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

> 类型断言
* 类型断言可以用来手动指定一个值的类型
* 语法 <类型>值 或者  值 as 类型，在tsx语法（React的jsx语法的ts版）中必须用后一种。
###### 将一个联合类型的变量指定为一个更加具体的类型
* 当Typescript不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或者方法，比如getLength
* 而有时候，我们确实需要在还不确定类型的时候就访问其中一个类型的属性或方法,比如getLength1
* 此时可以用类型断言，将something断言成string，比如getLength3
* 类型断言的用法为：在需要断言的变量前面加上<Type>即可
* 类型断言不是类型转换，断言成一个联合类型中不存在的类型是不允许的，比如toBoolean;

``` typescript
// ./code/ts-assert.ts
function getLength(something:string | number): number{
    return something.length; // 会报错 因为不是所有类型里面共有的属性或者方法
}
function getLength2(something:string | number): number{
    if(something.length){
        return something.length; // 会报错 
    } else {
        return something.toString().length;
    }
}
// 断言
// 语法 <类型>值
function getLength3(something:string | number): number{
    if((<string>something).length){
        return (<string>something).length;
    } else {
        return something.toString().length;
    }
}
// 语法 值 as 类型
function getLength4(something:string | number): number{
    if((something as string).length){
        return (something as string).length;
    } else {
        return something.toString().length;
    }
}

function toboolean(something: string | number): boolean{
    return <boolean>something; // 会报错，因为断言成一个联合类型中不存在的类型
}
```
> 泛型
* 泛型变量
* 泛型类型
* 泛型函数  非泛型函数
* 泛型接口
* 泛型参数

* 泛型参数 当做接口的一个参数
* 把非泛型函数签名作为泛型类型一部分
* 何时把参数放在调用签名里和何时放在接口
* 
``` typescript
// ./code/ts-T.ts
function identity<T>(arg: T): T {
    return arg;
}
// 用两种方法使用。 
// 第一种是，传入所有的参数，包含类型参数：
let output1 = identity<string>("myString");  // type of output will be 'string'
// 第二种方法更普遍。利用了类型推论 -- 即编译器会根据传入的参数自动地帮助我们确定T的类型
let output2 = identity("myString");  // type of output will be 'string'

function loggingIdentity1<T>(arg: T[]): T[] {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
function loggingIdentity2<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identity2<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn<number> = identity2;

// 泛型类
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };

// 泛型约束
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
loggingIdentity({length: 10, value: 3});

class BeeKeeper {
    hasMask: boolean;
}

class ZooKeeper {
    nametag: string;
}

class Animal1 {
    numLegs: number;
}

class Bee extends Animal1 {
    keeper: BeeKeeper;
}

class Lion extends Animal1 {
    keeper: ZooKeeper;
}

function findKeeper<A extends Animal1, K> (a: {new(): A;
    prototype: {keeper: K}}): K {
        console.log()

    return a.prototype.keeper;
}

findKeeper(Lion).nametag;
```

> 枚举
* 枚举（Enum）类型用于取值被限定在一定范围内的场景，比如一周只能有七天，颜色限定红绿蓝等
* 枚举成员会被赋值为从 0 开始递增的数字，同时也会对枚举值到的枚举名进行反向映射
###### 手动赋值
* 未手动赋值的枚举项会接着上一个枚举项进行递增
* 如果未手动赋值的枚举项与手动赋值的重复了，以后者为准
* 手动赋值的枚举项也可以为小数或者负数，后续未手动赋值的项的递增步长仍为1
###### 常数项和计算所得项
* 枚举项有两种类型：常数项和计算所得项
* 如果紧接在计算所得项后面的是未手动赋值的项，那么就会因为无法获得初始值而报错
###### 常数枚举
* 常数枚举是用 const enum 定义的枚举类型
* 常数枚举 与 普通枚举 的区别是，它会在编译阶段被删除，并且不能包含计算成员
* 加入包含了计算成员，则会在编译阶段报错
###### 外部枚举
* 外部枚举是使用 declare enum 定义的枚举类型
* declare 定义的类型只会用于编译时检查，编译结果中会被删除
* 同时使用 declare 和 const 也是可以的

``` typescript
// ./code/ts-enum.ts
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};
// 会被编译成
/* var Days;
(function (Days) {
    Days[Days["Sun"] = 0] = "Sun";
    Days[Days["Mon"] = 1] = "Mon";
    Days[Days["Tue"] = 2] = "Tue";
    Days[Days["Wed"] = 3] = "Wed";
    Days[Days["Thu"] = 4] = "Thu";
    Days[Days["Fri"] = 5] = "Fri";
    Days[Days["Sat"] = 6] = "Sat";
})(Days || (Days = {}));*/

console.log(Days['Sun'] === 0); // true
console.log(Days['Mon'] === 1); // true
console.log(Days['Tue'] === 2); // true
console.log(Days['Wed'] === 3); // true
console.log(Days['Thu'] === 4); // true
console.log(Days['Fri'] === 5); // true
console.log(Days['Sat'] === 6); // true

console.log(Days[0] === 'Sun'); // true
console.log(Days[1] === 'Mon'); // true
console.log(Days[2] === 'Tue'); // true
console.log(Days[3] === 'Wed'); // true
console.log(Days[4] === 'Thu'); // true
console.log(Days[5] === 'Fri'); // true
console.log(Days[6] === 'Sat'); // true

// 手动赋值
enum Days1{Sun = 7, Mon = 1, Tue, Wed, Thu, Fri, Sat};
console.log(Days1['Sun'] === 7); // true
console.log(Days1['Mon'] === 1); // true
console.log(Days1['Tue'] === 2); // true
console.log(Days1['Sat'] === 6); // true

enum Days2{Sun = 3, Mon = 1, Tue, Wed, Thu, Fri, Sat};
// 编译结果
/*var Days2;
(function (Days2) {
    Days2[Days2["Sun"] = 3] = "Sun";
    Days2[Days2["Mon"] = 1] = "Mon";
    Days2[Days2["Tue"] = 2] = "Tue";
    Days2[Days2["Wed"] = 3] = "Wed";
    Days2[Days2["Thu"] = 4] = "Thu";
    Days2[Days2["Fri"] = 5] = "Fri";
    Days2[Days2["Sat"] = 6] = "Sat";
})(Days2 || (Days2 = {}));*/
console.log(Days2['Sun'] === 3); // true
console.log(Days2['Mon'] === 1); // true
console.log(Days2['Tue'] === 2); // true
console.log(Days2[3] === 'Wed'); // true
console.log(Days2[3] === 'Sun'); // false

enum Days3{Sun = 7, Mon = 1.5, Tue, Wed, Thu, Fri, Sat};
console.log(Days3['Sun'] === 7); // true
console.log(Days3['Mon'] === 1.5); // true
console.log(Days3['Tue'] === 2.5); // true
console.log(Days3['Sat'] === 6.5); // true

//常数项和计算所得项 
enum Color{Red, Green, Blue = 'blue'.length};
enum Color1{Red = 'red', Green, Blue = 'blue'.length}; // 会报错 red 后会报错

// 常数枚举
const enum Directions{Up, Down, Left, Right}
let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
//编译结果
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
const enum Color2{Red, Green, Blue = 'blue'.length};

// 外部枚举
declare enum Directions1{Up, Down, Left, Right}
let directions1 = [Directions1.Up, Directions1.Down, Directions1.Left, Directions1.Right];
// 编译结果
/*var directions1 = [Directions1.Up, Directions1.Down, Directions1.Left, Directions1.Right];*/
declare const enum Directions2{Up, Down, Left, Right}
let directions2 = [Directions2.Up, Directions2.Down, Directions2.Left, Directions2.Right];
// 编译结果
var directions2 = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];

```

> 声明文件
    当使用三方库时，需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能
###### 什么是声明语句

问题：假如使用第三方库jQuery，一种常见的方式是在html中通过script标签引入jQuery，然后就可以使用全局变量$或者jQuery了，但是在ts中，编译器并不知道$或者jQuery是什么东西？？
解决：这时，就需要使用 declare var 来定义它的类型

* declare var 并没有真的定义一个变量，只是定义了全局变量jQuery的类型，
* 仅仅用于编译时的检查，在编译结果中会被删除

``` javascript
$('#foo')
jQuery('#foo')
```

``` typescript
// ./code/tsEG8.ts
declare var jQuery:(selector: string)=>any;
jQuery('#foo')

// 编译结果
/*jQuery('#foo')*/
```
###### 什么是声明文件 todo
* 通常我们会把声明语句放到和一个单独的文件(jQuery.d.ts)中，这就是声明文件
* 声明文件必须以 .d.ts 为后缀
* 一般来说，ts会解析项目中所有的 *.ts 文件，当然也可以包含以 .d.ts 结尾的文件，所以当我们将jQuery.d.ts放到项目中时，其他所有 *.ts 文件就都可以获得jQuery的类型定义了
* 假如仍然无法解析，那么可以检查下tsconfig.json中的files、include 和 exclude 配置，确保其包含了jQuery.d.ts文件 

``` typescript
// ./code/jQuery.d.ts
declare var jQuery: (selector: string) => any;
```

###### 第三方声明文件


// ./code/tsEG6.ts
> 内置对象

declare class Animal{
    sayHi(s: string):string
}
