1. function Greeting(name) {
  this.name = name;
}

// new 的写法
const instance = new Greeting('张三');

// Reflect.construct 的写法
const instance = Reflect.construct(Greeting, ['张三']);

注意：  ['张三']必须是数组，不是数组会报错
Reflect.construct方法等同于new target(...args)