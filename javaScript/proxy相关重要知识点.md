* get/set方法的第三个参数的例子，它总是指向原始的读操作所在的那个对象
* 如果目标对象自身的某个属性，不可写，那么set方法将不起作用。如果是通过Object.defineProperty 添加属性，不设置属性的特性话，那么configurable、enumerable、writable都默认为false,，所以如果想要proxy.set起作用的话，需手动增加writable:true
* 严格模式下，set代理如果没有返回true，就会报错。
* 原对象不可配置或者禁止扩展，这时has拦截会报错。
has方法拦截的是HasProperty操作，而不是HasOwnProperty操作，即has方法不判断一个属性是对象自身的属性，还是继承的属性。
* 虽然for...in循环也用到了in运算符，但是has拦截对for...in循环不生效。
  + in 检查的是原型链
  + for...in 不遍历原型链
* ownKeys方法用来拦截对象自身属性的读取操作。具体来说，拦截以下操作。
  + Object.getOwnPropertyNames()
  + Object.getOwnPropertySymbols()
  + Object.keys()
  + for...in循环
  + 注意：
      + Object.keys方法时，有三类属性会被ownKeys方法自动过滤，不会返回。
      + 目标对象上不存在的属性
      + 属性名为 Symbol 值
      + 不可遍历（enumerable）的属性

#### get/set方法的第三个参数的例子，它总是指向原始的读操作所在的那个对象
```javascript
var proxy = new Proxy({}, {
  get: function(target, key, receiver) {
    return receiver;
  }
});
proxy.getReceiver === proxy // true

var handler = {
  set: function(obj, prop, value, receiver) {
    obj[prop] = receiver;
  }
};
const proxy = new Proxy({}, handler);
const myObj = {};
Object.setPrototypeOf(myObj, proxy);

myObj.foo = 'bar';
myObj.foo === myObj // true
```
####  set方法
``` javascript
//让set方法起作用
var target = Object.defineProperties({}, {
  foo: {
    value: 123,
    writable: true
  },
});
var handler = {
  get(target, propKey) {
    return 'abc';
  }
};
var proxy = new Proxy(target, handler);

proxy.foo

// 严格模式 set方法许返回true
'use strict';
const handler = {
  set: function(obj, prop, value, receiver) {
    obj[prop] = receiver;
    // 无论有没有下面这一行，都会报错
    return false;
  }
};
const proxy = new Proxy({}, handler);
proxy.foo = 'bar';
// TypeError: 'set' on proxy: trap returned falsish for property 'foo'

```

#### 原对象不可配置或者禁止扩展，这时has拦截会报错。

``` javascript
var obj = { a: 10 };
Object.preventExtensions(obj);

var p = new Proxy(obj, {
  has: function(target, prop) {
    return false;
  }
});

'a' in p // TypeError is thrown


var target = Object.defineProperties({}, {
  foo: {
    value: 123,
  },
});
var handler = {
  has: function(target, prop) {
    return false;
  }
};
var proxy = new Proxy(target, handler);

"foo" in proxy // 报错

var target = Object.defineProperties({}, {
  foo: {
    value: 123,
    configurable:true
  },
});
var handler = {
  has: function(target, prop) {
    return false;
  }
};
var proxy = new Proxy(target, handler);

"foo" in proxy // 不会报错
```