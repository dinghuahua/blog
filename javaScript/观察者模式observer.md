## 前端设计模式之观察者模式
　　所谓的观察者模式我所认为的就是订阅发布。其中中间关于调度方法还有一点区别，这里就不多做叙述了
　　接下来给大家分享下我对所谓的发布订阅的理解吧，其实这种设计理念多体现在跨组件通信中，原理就是订阅者写一个函数然后不执行，接着把其储存在某一个地方，等待着发布者去触发这个函数，然后达到触发函数进行函数传参，从而能够达到组件之中的跨组件通信

``` javascript

 //第一种方式利用数组是比较啰嗦的
  const Observer={
    arr:[],
    $on(event,cb){
        this.arr.push({[event]:cb})
    },
    $emit(event,msg){
        //console.log(this.arr)
        this.arr.forEach(item=>{
            //console.log(Object.keys(item))
            if(Object.keys(item)[]===event){
                item[Object.keys(item)[]](msg)
            }
        })
    }
 }
// 第二种方式利用对象
// 这种方式只能监听一次  假如我们想要监听多次可以看下下面第三种方法
 const Observer={
    arr:{},
    $on(event,cb){
        this.arr[event]=cb
    },
    $emit(event,msg){
        this.arr[event](msg)
    }
 }
 
 
// 第三种方式 多次监听的订阅者
 const Observer={
    arr:{},
// 订阅者监听函数
    $on(event,cb){
        if(this.arr[event]){
            this.arr[event].push(cb)
        }else{
            this.arr[event]=[cb]
        }
        
    },
// 发布者触发函数
    $emit(event,msg){
        this.arr[event]&&this.arr[event].forEach(cb=>{
            cb(msg)
        })
    },
// 销毁阶段
    $delete(event){
        delete this.arr[event]
    }
 }
 
 
 
// 以下为封装检验过程
 
 
 Observer.$on("up",(msg)=>{
// 订阅者监听函数
     console.log(msg)
 })
 Observer.$on("up",(msg)=>{
// 订阅者监听函数
     console.log(msg)
 })
 
 Observer.$delete("up")
 
 Observer.$on("down",(msg)=>{
// 订阅者监听函数
     console.log(msg)
 })
 
 
 
 Observer.$emit("up",)//发布者 做函数的触发
 
 
 Observer.$emit("down",)//发布者
 
 
// 这样功能就可以实现了然后抛出使用了
```