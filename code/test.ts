// 函数
// 函数的声明
function fun0(x: number, y: number){
    return x + y;
}
function fun1(x: number, y: number): number{
    return x + y;
}
// 函数表达式
let add1: (x: number,y: number) => number = function(x: number, y: number): number{return x + y;}
let add2 = function(x: number,y: number): number{return x + y;}
let add3 = function(x: number,y: number){return x + y;}
let add4: (x: number, y: number) => number = function(x, y){return x + y;}
// let add5: (x: number, y: number) = function(x, y){return x + y;} // 会报错 前面写必须'=>' expected
// let add6: (x: number, y: number) = function(x, y): number{return x + y;}// 会报错 前面写必须'=>' expected

// 用接口定义函数声明
interface SquareConfig {
    color?: string;
    width?: number;
    name: string
}
function createSquare(config: SquareConfig): {color: string; area: number} {
    let newSquare = {color: "white", area: 100};
    if (config.color) {
      newSquare.color = config.color;
    }
    if (config.width) {
      newSquare.area = config.width * config.width;
    }
    return newSquare;
}
let mySquare = createSquare({name: 'lyf', color: "black"});
// 用接口定义函数表达式
interface SearchFunc{
    // 给接口定义一个调用签名
    (source: string, subString: string):boolean;
}
let fun4: SearchFunc;
fun4 = function(source: string, subString: string){
    return source.search(subString) !== -1;
}
// 重载
// 但是这样有一个缺点，就是不能精确的表达，输入为数字的时候，输出也为数字，输入为string，输出也应该为string
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

// 接口
function printLabel1(labelledObj: { label: string }) {
    console.log(labelledObj.label);
}
let myObj1 = { size: 10, label: "Size 10 Object" };
printLabel1(myObj1);
//需要注意的是，我们在这里并不能像在其它语言里一样，说传给 printLabel的对象实现了这个接口。我们只会去关注值的外形。 只要传入的对象满足上面提到的必要条件，那么它就是被允许的。
interface LabelledValue {
    label: string;
}

function printLabel2(labelledObj: LabelledValue) {
    console.log(labelledObj.label);
}
let myObj2 = {size: 10, label: "Size 10 Object"};
printLabel2(myObj2);
// printLabel2({size: 10, label: "Size 10 Object"}); // 会报错  不知道为什么？？？？
// 调用签名
// 构造器签名
// 索引签名
interface StringArray {
    [index: number]: string;
}
let myArray: StringArray;
myArray = ["Bob", "Fred"];
let myStr: string = myArray[0];

class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}
interface NotOkay {
    // [x: number]: Animal; // Error: indexing with a 'string' will sometimes get you a Dog!
    // [x: string]: Dog;
    [x: number]: Dog; // Error: indexing with a 'string' will sometimes get you a Dog!
    [x: string]: Animal;
}
interface NumberDictionary {
    [index: string]: number;
    length: number;    // 可以，length是number类型
    // name: string       // 错误，`name`的类型不是索引类型的子类型
}
// 接口描述一个方法 在类中进行实现
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}
class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) { }
}

// 泛型
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
// 泛型变量
// 泛型类型
// 泛型函数  非泛型函数
// 泛型接口
// 泛型参数

// 泛型参数 当做接口的一个参数
// 把非泛型函数签名作为泛型类型一部分
// 何时把参数放在调用签名里和何时放在接口
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