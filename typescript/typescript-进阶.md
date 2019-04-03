> 类型别名
* 类型别名用来给一个类型起个新名字
* 类型别名常用与联合类型
``` typescript
// ./code/tsEG13.ts
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
> 类型兼容性
* 需要注意的是，我们在这里并不能像在其它语言里一样，传给入参的对象实现了这个接口。我们只会去关注值的外形。 只要传入的对象满足上面提到的必要条件，那么它就是被允许的。比如：greet
``` typescript
// ./code/tsEG12.ts
// 检查对象
interface Named {
    name: string;
}

let x: Named;
// y's inferred type is { name: string; location: string; }
let y = { name: 'Alice', location: 'Seattle' };
x = y;

// 检查函数
function greet(n: Named) {
    alert('Hello, ' + n.name);
}
greet(y); // OK
greet({name: 'Alice', location: 'Seattle' }); // 会报错 不知道为什么 对比上一条

// 对比两个函数
// 入参兼容
let x1 = (a: number) => 0;
let y1 = (b: number, s: string) => 0;

y1 = x1; // OK
x1 = y1; // Error
// 返回值兼容
let x2 = () => ({name: 'Alice'});
let y2 = () => ({name: 'Alice', location: 'Seattle'});

x2 = y2; // OK
y2 = x2; // Error because x() lacks a location property

```

> 类
* 传统方法中，javascript通过构造函数实现类的概念，通过原型链实现继承，而在ES6中，迎来了class
* Typescript 除了实现了所有ES6中类的功能之外，还添加了一些新的用法
###### 类的概念
* 类（class）：定义了一件的事物的抽象特点，包括属性和方法
* 对象（object）：类的实例，通过new 生成
* 面向对象（OOP）的三大特征：封装，继承，多态
* 封装（Encapsulation）：将对数据的操作细节隐藏起来，只暴露对外的接口，外界调用端也不需要知道细节，就能通过对外提供的接口来访问该对象，同时也保证了外界无法任意更改对象内部的数据
* 继承（Inheritance）：子类继承父类，子类除了拥有父类的所有特性之外，还有一些更具体的特性
* 多态（Polymorphism）：有继承而产生了相关的不同的类，对同Animal，但是分别实现了自己的eat方法，此时针对某一个实例，我们无需了解它是Cat 还是 Dog ，就可以直接调用eat方法，程序会自动判断出来应该如何执行eat
* 存取器（getter & setter）：用来改变属性的读取和赋值行为
* 修饰器（modifiers）：修饰符是一些关键字，用于限定成员或类型的性质，比如public表示公有属性或方法
* 抽象类（abstract class）：抽象类是供其他类继承的基类，抽象类不允许被实例化。抽象类中的方法必须在子类中被实现
* 接口（interfaces）：不同类之间公有的属性或方法，可以抽象成一个接口，接口可以被类实现（implements）。一个类只能继承自另一个类，但是可以实现多个接口，接口可以继承接口
###### ES6中类的用法
* 使用static 修饰符修饰的方法称为静态方法，他们不需要实例化，而是直接通过类来调用

``` javascript
class Animal{
    _age = 18;
    constructor(name){
        this.name = name;
    }
    get age(){
        return this._age;
    }
    set age(value){
        this._age = value
    }
    sayHi(){
        return `my name is ${this.name}; age = ${this._age}`;
    }
    static isAnimal(a){
        return a instanceof Animal;
    }
}
let a = new Animal('jack');
console.log(a.sayHi());
a.isAnimal(a); // 报错
Animal.isAnimal(a); // 报错

class Cat extends Animal{
    constructor(name){
        super(name);
        console.log(this.name)
    }
    sayHi(){
        return 'meow,' + super.sayHi();
    }
}

let c = new Cat('jack');
console.log(c.sayHi());
```
###### Typescript 中类的实现
* Typescript 可以使用三种访问修饰符，分别是public private 和 protected
    * public 修饰的属性或者方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是public
    * private 修饰的属性或者方法是私有的，不能在声明它的类的外部访问到，子类中也是不允许访问的，比如Cat.age
        * 不可以存取，比如Animal.age属性
        * 在Typescript编译之后的代码中，并没有限制private属性在外部的可访问性
    * protected 修饰的属性或者方法是受保护的，它和private 类似，区别是它在子类中也是允许被访问的，比如Cat.gender
###### 类的类型
* 比如 a1

``` typescript
// ./code/tsEG10.ts
class Animal{
    public name;
    private age;
    protected gender;
    public constructor(name,age,gender){
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
}
let a1: Animal = new Animal('jack',18,'male');
let a = new Animal('jack',18,'male');
console.log(a.name);
a.name = 'Tom';
console.log(a.name);
console.log(a.age);// 会报错
a.age = 54;// 会报错
console.log(a.age);// 会报错

class Cat extends Animal{
    constructor(name,age,gender){
        super(name,age,gender);
        console.log(this.age);// 会报错
        console.log(this.gender);// 不会报错
    }
}
```
###### 抽象类
* abstract 用于定义抽象类和其中的抽象方法
* 抽象类是不允许被实例化的
* 抽象类中的抽象方法必须被子类实现
* 即使是抽象方法，Typescript的编译结果中，仍然会存在这个类

``` typescript
// ./code/tsEG10.ts
abstract class Animal2{
    public name;
    private age;
    protected gender;
    public constructor(name,age,gender){
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
    public abstract sayHi();
}
let a2 = new Animal2('jack',18,'male'); // 会报错 不允许实例化的

class Cat21 extends Animal2{
    constructor(name,age,gender){
        super(name,age,gender);
        console.log(this.age);// 会报错
        console.log(this.gender);// 不会报错
    }
    // 会报错 没有实现父类的抽象方法
}
class Cat2 extends Animal2{
    public sayHi(){
        console.log(`meow,my name is ${this.name}`);
    }
}

// 编译的结果
// var Animal2 = /** @class */ (function () {
//     function Animal2(name, age, gender) {
//         this.name = name;
//         this.age = age;
//         this.gender = gender;
//     }
//     return Animal2;
// }());
// var a2 = new Animal2('jack', 18, 'male'); // 会报错 不允许实例化的
// var Cat21 = /** @class */ (function (_super) {
//     __extends(Cat21, _super);
//     function Cat21(name, age, gender) {
//         var _this = _super.call(this, name, age, gender) || this;
//         console.log(_this.age); // 会报错
//         console.log(_this.gender); // 不会报错
//         return _this;
//     }
//     return Cat21;
// }(Animal2));
// var Cat2 = /** @class */ (function (_super) {
//     __extends(Cat2, _super);
//     function Cat2() {
//         return _super !== null && _super.apply(this, arguments) || this;
//     }
//     Cat2.prototype.sayHi = function () {
//         console.log("meow,my name is " + this.name);
//     };
//     return Cat2;
// }(Animal2));
```


> 类与接口
* 接口（interfaces）可用于对【对象的形状(shape)】 进行描述
* 接口的另一个用途，对类的一部分行为进行抽象
###### 类实现接口
    实现（implements）是面向对象中的一个重要概念，一般来讲，一个类自能继承自另一个类，有时候不同类之间可以有一些共有的特性，这时候就可以把特性提取成接口（interfaces），用implements关键字来实现，这个特性大大提高来面向对象的灵活性
* 一个类可以多个接口
###### 接口继承接口
###### 接口继承类
###### 混合类型
* 用接口的方式类定义一个函数需要符合的形状
* 一个函数还可以有自己的属性和方法，比如getCounter

``` typescript
// ./code/tsEG11.ts
interface Alarm{
    alert()
}
interface Light{
    lightOn();
    lightOff();
}
// 接口继承接口
interface LightableAlarm extends Alarm{
    lightOn();
    lightOff();
}
class Door{

}
class SecurityDoor extends Door implements Alarm{
    alert(){
        console.log('SecurityDoor alert');
    }
}
class Car implements Alarm, Light{
    alert(){
        console.log('Car alert')
    }
    lightOn(){
        console.log('Car light on ')
    };
    lightOff(){
        console.log('Car light off')
    };
}
// 接口继承类
class Point{
    x: number;
    y:number;
}
interface Point3d extends Point{
    z:number
}
// 混合类型
interface SearchFunc{
    (source:string, subString: string): boolean;
}
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string){
    return source.search(subString) !== -1;
}

// 函数还可以有自己的属性和方法
interface Counter{
    (start: number):string;
    interval: number;
    reset():void
}
function getCounter(): Counter{
    let counter =<Counter>function(start: number){};
    counter.interval = 123;
    counter.reset = function(){};
    return counter;
}
let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;


```
> 泛型
> 声明合并
> 扩展阅读
>工程