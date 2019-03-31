> 类型别名
* 类型别名用来给一个类型起个新名字
* 类型别名常用与联合类型
``` typescript
// ./code/tsEG9.ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name{
    if(typeof n === 'string'){
        return n;
    } else {
        return n();
    }
}
```
> 字符串字面量类型
* 字符串字面量类型用来约束取值只能是某几个字符串中的一个
* 注意类型别名与字符串字面量类型都是使用type进行定义

``` typescript
// ./code/tsEG9.ts
type EventNames = 'click' | 'scroll' | 'mousemove';
function handleEvent(ele: Element, event: EventNames){
    // do something
}
handleEvent(document.getElementById('hello'), 'scroll');
handleEvent(document.getElementById('world'), 'dbclick'); // 报错 event 不能为dbclick

```
> 元组
* 数组合并了相同类型的对象，而元组(Tuple)合并了 不同类型的对象
* 元组起源于函数编程语言（比如：F#）在这些语言中频繁使用元组
* 元组也可以只赋值其中一项
* 但是当直接对元组类型的变量进行初始化或者赋值的时候，需要提供所有元素类型中指定的项
###### 越界的元素
* 当添加越界的元素时，它的类型会被限制为元组中元组中每个类型的联合类型

``` typescript
// ./code/tsEG9.ts
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
// ./code/tsEG9.ts
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
> 类

> 类与接口
> 泛型
> 声明合并
> 扩展阅读
>工程