//any
let str: string = 'lyf';
str = 'liyf';
// str = 7; // 会报错

let anyThing: any = 'hello';
console.log(anyThing.myName);
console.log(anyThing.myName.firstName);
console.log(anyThing.setName('join'));
console.log(anyThing.setName('join').getName());


let something;
something = 'lyf';
something = 54;

// 类型推论
let mystr = 'lyf';
// mystr = 54; // 会报错
// 等价于
// let mystr: string = 'lyf';
// mystr = 54; // 会报错

// 联合类型
let myStrOrNum:string | number;
myStrOrNum = 'lyf';
myStrOrNum = '54';
myStrOrNum = true;
myStrOrNum = false;

function getLength(something:string | number):number{
    return something.length; // length 不是共有属性，所以会报错
}
function getString(something:string | number):string{
    return something.toString(); // toString是共有属性，所以不会报错
}
getLength('lyf');
getLength(54);

let myStrOrNum1:string | number;
myStrOrNum1 = 'lyf';
console.log(myStrOrNum1.length);// 3 不报错
myStrOrNum1 = 54;
myStrOrNum1 = 54;
console.log(myStrOrNum1.length);// 编译时报错