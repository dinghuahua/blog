## iterator
## 概念理解
<br>JavaScript 原有的表示“集合”的数据结构，Object/Array/Set/Map
<br>遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。
<br>任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）

### 作用
Iterator 的作用有三个：
1. 一是为各种数据结构，提供一个统一的、简便的访问接口；
2. 二是使得数据结构的成员能够按某种次序排列；
3. 三是 ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费

### Iterator 的遍历过程

迭代协议具体分为两个协议：可迭代协议和迭代器协议

要成为可迭代对象， 一个对象必须实现 @@iterator 方法。这意味着对象（或者它原型链上的某个对象）必须有一个键为 @@iterator 的属性，可通过常量 Symbol.iterator 访问该属性：
[Symbol.iterator]	返回一个符合迭代器协议的对象的无参数函数。

只有实现了一个拥有以下语义（semantic）的 next() 方法，一个对象才能成为迭代器

内置可迭代对象
目前所有的内置可迭代对象如下：String、Array、TypedArray、Map 和 Set，它们的原型对象都实现了 @@iterator 方法


用于可迭代对象的语法
一些语句和表达式适用于可迭代对象，比如 for...of 循环、展开语法、yield*，和结构赋值。

## for..of


## 生成器函数的构造器GenerationFunction
GenerationFunction = Object.getPrototypeOf(function*(){}).constructor

## 生成器函数
在JavaScript中，生成器函数实际上都是GeneratorFunction的实例对象
