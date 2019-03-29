
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

  * 遍历结果为由对象自身可枚举属性组成的数组，数组中的属性名排列顺序与使用for in循环遍历该对象时返回的顺序一致；
  * 与for in区别在于不能遍历出原型链上的属性；

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

  * 不遍历原型链
  * ES6中添加的循环语法
  * for of 支持遍历数组、类数组(DOM NodeList对象)、字符串、Map对象、Set对象
  * for of 不支持遍历普通对象，可通过与Object.keys()搭配使用遍历
  * for of 遍历后的输出结果为数组元素的值
  * 搭配实例方法entries(),同时输出数组内容和索引，Object.keys()输出索引，Object.values()输出内容

>> 例子
``` javascript
Array.prototype.sayLength = function(){
    console.log(this.length)
}
var arr = ['a','b','c','d'];
arr.name = '数组';
Object.defineProperties(arr,{
    type:{
        value:true,
        writable:true,
        enumerable:true
    }
});
for(var v of arr){
    console.log(v); // a,b,c,d
}
for(var [v,k] of arr.entries()){
    console.log(v+':'+k); // 0:a 1:b 2:c 3:d
}

```

> foreach
    * 不遍历原型链，不遍历静态
    * 不可以使用break,会报错
    * 可以使用return ，从函数体内返回


>>> 例子
``` javascript
Array.prototype.sayLength = function(){
    console.log(this.length)
}
var arr=[1,2,3];
arr.name = '数组';
Object.defineProperties(arr,{
    type:{
        value:true,
        writable:true,
        enumerable:true
    }
});
function aa (){
	arr.forEach(function(v){
		console.log(v); // 1,2 ,3
	})
}
```

> todo链接 这三个方法的学习 
> 
* entries() 返回一个遍历器对象，用来遍历[键名, 键值]组成的数组。对于数组，键名就是索引值；对于 Set，键名与键值相同。Map 结构的 Iterator 接口，默认就是调用entries方法。
* keys() 返回一个遍历器对象，用来遍历所有的键名。
* values() 返回一个遍历器对象，用来遍历所有的键值。
> 让jquery对象支持for of遍历

* 因为jQuery对象与数组相似
* 可以为其添加与数组一致的迭代器方法
  
  jQuery.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

> 手动给对象部署iterator接口

``` javascript
  let obj = {
    data: [ 'hello', 'world' ],
    [Symbol.iterator]() {
        const self = this;
        let index = 0;
        return {
            next() {
                if (index < self.data.length) {
                    return {
                        value: self.data[index++],
                        done: false
                    };
                } else {
                    return { value: undefined, done: true };
                }
            }
        };
    }
  };
  for(var a of obj){
    console.log(a); // 'hello', 'world'
  }

```