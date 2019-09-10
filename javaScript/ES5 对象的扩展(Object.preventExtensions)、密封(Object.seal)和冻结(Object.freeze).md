
### 添加或修改对象属性的特性以及获取对象属性的特性

* 添加或修改对象属性的特性
    * Object.defineProperty 和 Object.defineProperties
* 获取对象属性的特性
    * Object.getOwnPropertyDescriptor 和 Object.getOwnPropertyDescriptors

>Object.defineProperty 和 Object.defineProperties  

* 1.可以给对象添加属性，也可以给已有属性设置特性
* 2.如果是通过Object.defineProperty 添加属性，不设置属性的特性话，那么configurable、enumerable、writable都默认为false
* 3.如果是通过obj.test = 值 这种方式添加的属性，则该属性的configurable、enumerable、writable特性为true
    * 参数 Object.definePropert(obj, prop, descriptor)
    * obj 必须，目标对象
    * prop 必须，需添加或者修改属性的名字
    * descriptor 必须，目标属性所拥有的特性

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
Object.defineProperties(obj,{
    type:{
        value:true,
        writable:true,
        enumerable:true
    }
});
````
注意：1. 当使用了getter或者setter方法，不允许使用writable和value 这两个属性
     1. get或者set不是必须成对出现，任写其一就可以，如果不设置方法，则get和set的默认值为undefined 
     2. 只有get方法就是只读，只有set方法就是只写
   
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
    2.属性test1  configurable为true,即可删除、可修改其它的特性
    3.属性test2  configurable为false,此特性不可逆，则enumerable不可以再更改，writable为true，可更改为false，但不可逆
    4.属性test3  configurable为false,此特性不可逆，则enumerable不可以再更改，writable为false，不可逆
    5.属性test4  因为有get和set方法，则不可以再用writable和value特性，可读可写

> Object.getOwnPropertyDescriptor  和 Object.getOwnPropertyDescriptors
>>> 例子
``` javascript
var obj = {
    self:'123',
    name:'join'
};
Object.getOwnPropertyDescriptor(obj,'self');// {value: "123", writable: true, enumerable: true, configurable: true}
Object.getOwnPropertyDescriptors(obj);
//{name: {value: "join", writable: true, enumerable: true, configurable: true},self: {value: "123", writable: true, enumerable: true, configurable: true}}
```

### 对象的扩展、密封和冻结

* 阻止对象扩展
  * Object.preventExtensions
  * Object.isExtensible
* 密封对象
  * Object.seal
  * Object.isSealed
* 冻结对象
  * Object.freeze
  * Object.isFrozen
  
> Object.preventExtensions 阻止对象扩展

  * 让一个对象不可扩展，并返回原对象
  * 阻止对象扩展，让一个对象变得不可扩展，也就是永远不能再添加新的属性
  * 使用严格模式，当一个对象阻止扩展时，新增属性时会报错
  * 只能阻止不能添加新的自身属性，但可以为该对象的原型添加属性
  * 可以删除现有属性
   
>> Object.isExtensible 判断对象是否可扩展

* 判断一个对象是否可扩展，即是否可以给它添加新属性

>>> 例子

``` javascript
var obj={name:'join'};
// 阻止对象扩展
Object.preventExtensions(obj);
obj.name = '123'; // {name: "123"}
// 如果使用严格模式  当新增属性时会报错
obj.age = 30
// obj阻止扩展后 新增的age 属性不会添加到obj上面
console.log(obj); // {name: "123"}
// 查看obj 是否可扩展
console.log(Object.isExtensible(obj));  // false
```

> Object.seal 密封对象
    
  * 让一个对象密封，并返回被密封后的原对象
  * 将该对象的所有属性的configurable特性置为false
  * 不能添加新属性，不能删除已有属性
  * 不能修改已有属性的可枚举性、可配置性、可写性
  * 可不可以修改已有属性的值，就看对应属性writable的值是否为true
  
>> Object.isSealed 是否被密封
  
>>> 例子
``` javascript
var obj ={
    name:'join'
};
Object.defineProperty(obj,'self',{
    writable:false
});
Object.seal(obj);
console.log(Object.isSealed(obj));  // true
Object.getOwnPropertyDescriptors(obj);
// {name:{value: "join", writable: true, enumerable: true, configurable: false},self:{value: undefined, writable: false, enumerable: false, configurable: false}}
// name 属性还可以修改值，self属性不可以修改值
```

> Object.freeze 冻结对象

  * 让一个对象冻结，并返回被冻结后的原对象
  * 将该对象的所有属性的configurable和writable特性都置为false
  * 不能添加新属性，不能删除已有属性
  * 不能修改已有属性的可枚举性、可配置性、可写性
  * 不能修改已有属性的值   
  
>> Object.isFrozen 是否被冻结
    
>>> 例子
``` javascript
var obj ={
    name:'join'
};
Object.defineProperty(obj,'self',{
    writable:false
});
Object.freeze(obj);
console.log(Object.isFrozen(obj));  // true
Object.getOwnPropertyDescriptors(obj);
// {name:{value: "join", writable: true, enumerable: true, configurable: false},self:{value: undefined, writable: false, enumerable: false, configurable: false}}
```
>todo proxy