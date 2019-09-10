function greeter(person: string) {
    return "Hello, " + person;
}
var user = "Jane User";
console.log(greeter(user));  

let isDone: boolean = false;
// let isBoolean: boolean = new Boolean(1); 会报错
let isBoolean: Boolean = new Boolean(1);
let isBoolean2: boolean = Boolean(1);

let myName: string = 'Tom';
let sentence: string = `hello,my name is ${myName}`;

function alertName():void{
    alert(sentence);
}
let unusable1: void =undefined;
let unusable2: void =null;
let unusable3: undefined =undefined;
let unusable4: null =null;

let num:number = undefined;
let u:undefined;
let num2:number = u;

let u2:void;
let num3:number = u2;//会报错