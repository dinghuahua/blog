interface Alarm{
    alert()
}
interface Light{
    lightOn();
    lightOff();
}
// 接口继承接口
interface LightableAlarm extends Alarm{
    lightOn();
    lightOff();
}
class Door{

}
class SecurityDoor extends Door implements Alarm{
    alert(){
        console.log('SecurityDoor alert');
    }
}
class Car implements Alarm, Light{
    alert(){
        console.log('Car alert')
    }
    lightOn(){
        console.log('Car light on ')
    };
    lightOff(){
        console.log('Car light off')
    };
}
// 接口继承类
class Point{
    x: number;
    y:number;
}
interface Point3d extends Point{
    z:number
}
// 混合类型
interface SearchFunc{
    (source:string, subString: string): boolean;
}
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string){
    return source.search(subString) !== -1;
}

// 函数还可以有自己的属性和方法
interface Counter{
    (start: number):string;
    interval: number;
    reset():void
}
function getCounter(): Counter{
    let counter =<Counter>function(start: number){};
    counter.interval = 123;
    counter.reset = function(){};
    return counter;
}
let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
