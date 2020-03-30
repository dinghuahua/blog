### promise

一、<br>
Promise也有一些缺点。

* 首先，无法取消Promise，一旦新建它就会立即执行，无法中途取消。
* 其次，如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。
* 第三，当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

二、<br>
then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）,因此可以采用链式写法，即then方法后面再调用另一个then方法。<br>
catch方法返回的还是一个 Promise 对象<br>
finally方法中 返回promise  是把之前的返回的promise  重新包装一个新的promise  <br>
finally方法中回掉函数的return返回值 不影响finally方法的返回值，手动在finally方法中写了return 也不会对之前的链式调用的返回值的造成影响。即  finally方法总是会返回原来的值。  类似try catch finally<br>
 
finally方法实现原理<br>
``` javscript
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
``` 
三、<br>
异步A嵌套异步B  <br>
* A异步回掉函数的参数值 不论什么情况下 都是 B异步回掉函数的参数值  但是是不同的Promise		    
  + A中用resole(B) 那么A的promise状态依赖于B  
  + B的异步结果, B resolve A就是resolve   
  + B reject A就是 reject
* A中用reject(B) 那么A的promise状态直接是reject , 不依赖于B的异步状态 ，但A的异步回掉函数的参数值 还是  B的异步回掉函数的参数值
``` javascript
p1 = new Promise(function (resolve, reject) {
  resolve("dasd");
});

p2 = new Promise(function (resolve, reject) {
  reject(p1);
})
``` 
四、 <br>
* 如果异步操作抛出错误，状态就会变为rejected，就会调用catch方法指定的回调函数，处理这个错误。另外，then方法指定的回调函数，如果运行中抛出错误，也会被catch方法捕获 

* Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个catch语句捕获
* 跟传统的try/catch代码块不同的是，如果没有使用catch方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。
* Promise 内部的错误不会影响到 Promise 外部的代码 外部的代码还会继续执行   Promise 会吃掉错误
* 如果没有报错，则会跳过catch方法，这样catch后面的代码promise的指向 是会 变动的
``` javascript
Promise.resolve()
.catch(function(error) {
  console.log('oh no', error);
})
.then(function() {
  console.log('carry on');
});
``` 
五、 <br>

Promise 在resolve语句后面，再抛出错误，不会被捕获，等于没有抛出。因为 Promise 的状态一旦改变，就永久保持该状态，不会再变了

Promise.allSettled(arrPromise)的总是返回 resolve状态的Promise 实例。参数是arrPromise状态组成的promise数组， 每个对象都有status属性，该属性的值只可能是字符串fulfilled或字符串rejected。fulfilled时，对象有value属性，rejected时有reason属性，对应两种状态的返回值。

``` javascript
const thenable = {
  then(resolve, reject) {
    reject('出错了');
  }
};

Promise.reject(thenable)
.catch(e => {
  console.log(e === thenable)
})
```