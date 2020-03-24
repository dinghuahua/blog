get/set方法的第三个参数的例子，它总是指向原始的读操作所在的那个对象
注意，如果目标对象自身的某个属性，不可写，那么set方法将不起作用。
如果是通过Object.defineProperty 添加属性，不设置属性的特性话，那么configurable、enumerable、writable都默认为false,，所以如果想要proxy.set起作用的话，需手动增加writable:true
严格模式下，set代理如果没有返回true，就会报错。

```javascript
var proxy = new Proxy({}, {
  get: function(target, key, receiver) {
    return receiver;
  }
});
proxy.getReceiver === proxy // true
```
``` javascript
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

``` javascript
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
```