1. 类的内部所有定义的方法，都是不可枚举的（non-enumerable）,这一点与 ES5 的行为不一致,
```javascript
// ES6
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]

// ES5
var Point = function (x, y) {
  // ...
};

Point.prototype.toString = function() {
  // ...
};

Object.keys(Point.prototype)
// ["toString"]
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
```
2. constructor方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加
``` javascript
class Point {
}

// 等同于
class Point {
  constructor() {}
}
```
3. constructor方法默认返回实例对象（即this），完全可以指定返回另外一个对象。 
4. 普通函数 return 一个对象，new 操作符实例化时的对象为 return出来的对象（可以覆盖），正常调用函数（即不用new） 返回值也是 return后面的内容，
5. 如果 普通函数 return 一个非引用类型的 那么 new 调用返回的就是原本的对象，和return后面的数据无关,方法体内 如果没有this.属性 一类的赋值操作 ，返回的就是空对象,联想new.target,保构造函数只能通过new命令调用
6. 类必须使用new调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用new也可以执行
7. __proto__ 并不是语言本身的特性，这是各大厂商具体实现时添加的私有属性，虽然目前很多现代浏览器的 JS 引擎中都提供了这个私有属性，但依旧不建议在生产中使用该属性，避免对环境产生依赖。生产环境中，我们可以使用 Object.getPrototypeOf 方法来获取实例对象的原型，然后再来为原型添加方法/属性
8. 属性的四大特性是在Descriptor 对象，存值函数和取值函数是设置在属性的 Descriptor 对象上的
9. 
```javascript 
var d1 = new function(f){this.a=123,this.f=f;}(456)
var d2 = new class d{constructor(f){this.a=123,this.f=f;}}(456)
```
9. 严格模式
10. 不存在提升(类不存在变量提升（hoist），这一点与 ES5 完全不同),这种规定的原因与下文要提到的继承有关，必须保证子类在父类之后定义/ 
11. 类的方法内部如果含有this，它默认指向类的实例,但是，如果将这个方法提取出来单独使用，this会指向该方法运行时所在的环境（由于 class 内部是严格模式，所以 this 实际指向的是undefined）,一个比较简单的解决方法是，在构造方法中绑定this或者使用箭头函数(箭头函数内部的this总是指向定义时所在的对象)，但都必须在构造方法中实现这一步,或者用代理的方法解决
12. 代理
```javascript
class Logger {
  constructor() {
    // bind
    this.printName = this.printName.bind(this);
    // 箭头函数
    this.printName = () => {};
  }
}
// 代理
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }
  print(text) {
    console.log(text);
  }
}
function selfish (target) {
  const cache = new WeakMap();
  const handler = {
    get (target, key) {
      const value = Reflect.get(target, key);
      if (typeof value !== 'function') {
        return value;
      }
      if (!cache.has(value)) {
        cache.set(value, value.bind(target));
      }
      return cache.get(value);
    }
  };
  const proxy = new Proxy(target, handler);
  return proxy;
}
// 直接访问 会报错
var logger = new Logger();
var { printName } = logger;
printName(); // 报错
// 通过代理
var logger1 = selfish(new Logger());
var { printName } = logger1;
printName();
```
13. 静态方法,
    * static关键字，就表示该方法不会被实例继承,如果静态方法包含this关键字，这个this指的是类，而不是实例
    * 静态方法可以与非静态方法重名
    * 父类的静态方法，可以被子类继承
    * 静态属性 静态属性指的是 Class 本身的属性，即Class.propName，直接写在class的外面
14. 静态属性, 因为 ES6 明确规定，Class 内部只有静态方法，没有静态属性。现在有一个提案提供了类的静态属性，写法是在实例属性的前面，加上static关键字。
15. 实例属性的新写法 实例属性除了定义在constructor()方法里面的this上面，也可以定义在类的最顶层。
16. 私有方法和私有属性,一种做法是在命名上加以区别,这种命名是不保险的，在类的外部，还是可以调用到这个方法。另一种方法就是索性将私有方法移出模块，因为模块内部的所有方法都是对外可见的。记得绑定this
17. 私有属性的提案 目前，有一个提案，为class加了私有属性。方法是在属性名之前，使用#表示。
    * 实例化出来的对象木有私有属性,访问undefined
    * 可以继承，但没有访问权限
18. Class 内部调用new.target，返回当前 Class,子类继承父类时，在父的构造器中new.target会返回子类，利用这个特点，可以写出不能独立使用、必须继承后才能使用的类，注意，在函数外部，使用new.target会报错，以及在父类中判断当前是哪个子类在进行new 实例化
19. 静态：说的是实例化对象没有这个属性，属性是类的，用类名来访问，可以被继承，只不过访问还是的还是父类的，有访问权限而已
20. 私有：针对的是访问的权限，类似作用域范围，只有类内部的地方可以访问，shili.私有 会报错，可以被继承，只不过没有访问权限





1. 子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类自己的this对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用super方法，子类就得不到this对象。
2. 子类不写constructor时，自动为子类生成的constructor默认会调用super()
```javascript
class ColorPoint extends Point {
}

// 等同于
class ColorPoint extends Point {
  constructor(...args) {
    super(...args);
  }
}
```
3. ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）。ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this
4. 在子类的构造函数中，只有调用super之后，才可以使用this关键字，否则会报错,这是因为子类实例的构建，基于父类实例，只有super方法才能调用父类实例。
5. instanceof检查的是原型链 子类实例对象 instanceof 父类 // true
6. Object.getPrototypeOf(B) ===A;  因此，可以使用这个方法判断，一个类是否继承了另一个类
7. super这个关键字，既可以当作函数使用，也可以当作对象使用。在这两种情况下，它的用法完全不同,
8. super当作构造函数时：super虽然代表了父类A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B的实例，因此super()在这里相当于A.prototype.constructor.call(this)
   * 函数时，super()只能用在子类的构造函数之中，用在其他地方就会报错
   * super()内部的this指向的是子类，重要！重要！重要！
9. super作为对象时(super=>A(static)/A.prorotype)，在普通方法中，指向父类的原型对象；在静态方法中，指向父类 
``` javascript
class A{
  constructor(){
    console.log(new.target,new.target)
  }
  hello(){console.log("hello world")}
  static hello(){console.log("static hello world")}
}
class B extends A{
  hello(){
      super.hello()
  }
  static hello(){
      super.hello()
  }
}
```
10. 注意，由于super指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的,属性定义在父类的原型对象上，super就可以取到
11. ES6 规定，在子类普通方法中通过super调用父类的方法时，方法内部的this指向当前的子类实例
12. 在子类的静态方法中通过super调用父类的方法时，方法内部的this指向当前的子类，而不是子类的实例。
13. 注意，使用super的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错
14. 类的 prototype 属性和__proto__属性
  * 这两条继承链，可以这样理解：作为一个对象，子类（B）的原型（__proto__属性）是父类（A）；
  * 作为一个构造函数，子类（B）的原型对象（prototype属性）是父类的原型对象（prototype属性）的实例
``` javascript
// es6
class A{}
class B extends A{} 
var b = new B();
B.__proto__===A; // 构造函数的继承，总是指向父类
B.prototype.__proto__===A.prototype; //true  (表示方法的继承，)总是指向父类的prototype属性

Object.getPrototypeOf(B) ===A; //true
Object.getPrototypeOf(b) ===B.prototype; //true

// es5
function A(){this.say=function(){console.log("123")}}
A.prototype.skip=function(){console.log("prototype")}
function B(){A.call(this,arguments)}

// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);
// B 继承 A 的静态属性
Object.setPrototypeOf(B, A);
// or
B.__proto__ = A;
B.prototype.__proto__=A.prototype;

//Object.setPrototypeOf方法的实现。 本身也有这个方法
Object.setPrototypeOf = function (obj, proto) {
  obj.__proto__ = proto;
  return obj;
}
```
15. 原生构造函数的继承: Boolean()/ Number()/ String()/ Array()/ Date()/ Function()/ RegExp()/ Error()/ Object() 
16. 下面，讨论两种情况。
    * 第一种情况，子类继承Object类。这种情况下，A其实就是构造函数Object的复制，A的实例就是Object的实例。
    * 第二种情况，不存在任何继承。这种情况下，A作为一个基类（即不存在任何继承），就是一个普通函数，所以直接继承Function.prototype。但是，A调用后返回一个空对象（即Object实例），所以A.prototype.__proto__指向构造函数（Object）的prototype属性
```javascript
// 第一种情况
class A extends Object {
}
A.__proto__ === Object // true
A.prototype.__proto__ === Object.prototype // true

// 第二种情况
class A {
}
A.__proto__ === Function.prototype // true
A.prototype.__proto__ === Object.prototype // true
```  
16. 以前，这些原生构造函数是无法继承的，比如，不能自己定义一个Array的子类,
    * 是因为子类无法获得原生构造函数的内部属性，通过Array.apply()或者分配给原型对象都不行。原生构造函数会忽略apply方法传入的this，也就是说，原生构造函数的this无法绑定，导致拿不到内部属性
    * ES5 是先新建子类的实例对象this，再将父类的属性添加到子类上，由于父类的内部属性无法获取，导致无法继承原生的构造函数
17. ES6 允许继承原生构造函数定义子类，因为 ES6 是先新建父类的实例对象this，然后再用子类的构造函数修饰this