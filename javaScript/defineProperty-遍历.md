>Object.defineProperty 

    1.可以给对象添加属性，也可以给已有属性设置特性
    2.如果是通过Object.defineProperty 添加属性，不设置属性的特性话，那么configurable、enumerable、writable都默认为false
    3.如果是通过obj.test = 值 这种方式添加的属性，则该属性的configurable、enumerable、writable特性为true

``` javascript
//对象已有的属性添加特性描述
Object.defineProperty(obj,"test",{
    configurable:true || false,  // 目标属性是否可以被删除或是否可以再次修改特性
    enumerable:true || false,    // 是否可被枚举
    value:'该属性的值',           // 设置属性的值
    writable:true || false,      // 值是否可以重写
    
    get:function (){} || undefined,
    set:function (value){} || undefined
});
````
注意：1. 当使用了getter或者setter方法，不允许使用writable和value 这两个属性
     2. get或者set不是必须成对出现，任写其一就可以，如果不设置方法，则get和set的默认值为undefined 
     3. 只有get方法就是只读，只有set方法就是只写
   
* configurable   该属性能否被删除  默认false
  * 该特性为true   delete obj.test属性  就可以被删除  并返回true
  * 该特性为false  delete obj.test属性  不可以删除    并返回false
    * 该特性如果一开始true可以改为false，如果一开始是false则不可以改为true，即不可逆。 
    * 该特性设置过false之后，configurable、enumerable不可再更改,当这两个重新修改时会报错 Uncaught TypeError: Cannot redefine property: test属性
    * writable 如果原本是true,可以改为false,改为false后或者一开始就是false,就不可以再改为true,此时如果更改就会报错，即configurable为false时此特性不可逆
    * value 是否可更改看writable的值是否为true该属性的value特性还可以修改
* enumerable 是否可枚举  默认false 
* value  该属性的值，不赋值为undefined
    * 通过obj.test属性 = '值',进行赋值更改时，该属性的value特性会自动更改
* writable  该属性的值是否可以重写    默认false
>例子

``` javascript
var obj = {
    self:'123'
};
var initValue = 'hello';
Object.defineProperty(obj,"test1",{
    configurable:true,  
    enumerable:true,   
    value:'hello',          
    writable:true
});
Object.defineProperty(obj,"test2",{
    configurable:false,  
    enumerable:true,   
    value:'hello',          
    writable:true
});
Object.defineProperty(obj,"test3",{
    configurable:false,  
    enumerable:true,   
    value:'hello',          
    writable:false
});
Object.defineProperty(obj,"test4",{
    get:function (){
        //当获取值的时候触发的函数
        return initValue;    
    },
    set:function (value){
        //当设置值的时候触发的函数,设置的新值通过参数value拿到
        initValue = value;
    }
});

```
    1.属性self  特性configurable、enumerable、writable 全部为true
    2.属性test1  configurable为true,即可删除即修改其它的特性
    3.属性test2  configurable为false,此特性不可逆，则enumerable不可以再更改，writable为true，可更改为false，但不可逆
    4.属性test3  configurable为false,此特性不可逆，则enumerable不可以再更改，writable为false，不可逆
    5.属性test4  因为有get和set方法，则不可以在用writable和value特性，可读可写


### 遍历方法的对比

> for ... in 遍历自身和原型链 可枚举

    * 遍历原型链
    * 只有具有 Enumerable （可枚举）属性的属性才能被 for ... in 遍历
>> 例子

```  javascript
// 使用寄生组合继承来创建原型链
    function Animal(name){
        this.name = name;
        this.sleep = function(){};
    }
    Animal.run = function(){};
    Animal.prototype.eat = function(){}

    function Cat(name){
        Animal.call(this,name);
        this.name = name;
    }
    (function(){
        var Super = function(){};
        Super.prototype = Animal.prototype;
        Cat.prototype = new Super();
        Cat.protype.constructor = Cat;
    })()

    var c1 =new Cat();
    for(var key in c1){
        // Object.prototype 上的属性几乎都是不可遍历(浏览器控制台对于可遍历的属性是深色的，不可遍历的是浅色的)
        console.log(key,c1[key]);
    }
```
c1.__proto==>Cat.prototype==>Animal.prototype==>Object.prototype
                                                  
> Object.keys 遍历自身可枚举  不遍历原型链

    遍历结果为由对象自身可枚举属性组成的数组，数组中的属性名排列顺序与使用for in循环遍历该对象时返回的顺序一致；

    与for in区别在于不能遍历出原型链上的属性；

>> 例子

``` javascript
Array.prototype.sayLength = function(){
    console.log(this.length);
}
let arr = ['a','b','c','d'];
arr.name = '数组';
Object.defineProperties(arr,{
    type:{
        value:true,
        writable:true,
        enumerable:true
    }
});
 var keys = Object.keys(arr);
 console.log(keys);//["0", "1", "2", "3", "name", "type"]
```

 > for of

* ES6中添加的循环语法
* for of 支持遍历数组、类数组(DOM NodeList对象)、字符串、Map对象、Set对象
* for of 不支持遍历普通对象，可通过与Object.keys()搭配使用遍历
* for of 遍历后的输出结果为数组元素的值
* 搭配实例方法entries(),同时输出数组内容和索引

>> 例子
    