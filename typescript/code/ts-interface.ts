// 接口
function printLabel1(labelledObj: { label: string }) {
    console.log(labelledObj.label);
}
let myObj1 = { size: 10, label: "Size 10 Object" };
printLabel1(myObj1);
//需要注意的是，我们在这里并不能像在其它语言里一样，说传给 printLabel的对象实现了这个接口。我们只会去关注值的外形。 只要传入的对象满足上面提到的必要条件，那么它就是被允许的。
interface LabelledValue {
    label: string;
}

function printLabel2(labelledObj: LabelledValue) {
    console.log(labelledObj.label);
}
let myObj2 = {size: 10, label: "Size 10 Object"};
printLabel2(myObj2);
printLabel2({size: 10, label: "Size 10 Object"}); // 会报错 ？？？？
// 调用签名

// 构造器签名
// 索引签名
interface StringArray {
    [index: number]: string;
}
let myArray: StringArray;
myArray = ["Bob", "Fred"];
let myStr: string = myArray[0];

class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}
interface NotOkay {
    // [x: number]: Animal; // Error: indexing with a 'string' will sometimes get you a Dog!
    // [x: string]: Dog;
    [x: number]: Dog; // Error: indexing with a 'string' will sometimes get you a Dog!
    [x: string]: Animal;
}
interface NumberDictionary {
    [index: string]: number;
    length: number;    // 可以，length是number类型
    // name: string       // 错误，`name`的类型不是索引类型的子类型
}
// 接口描述一个方法 在类中进行实现
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}
class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) { }
}