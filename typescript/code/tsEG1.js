function greeter(person) {
    return "Hello, " + person;
}
var user = "Jane User";
console.log(greeter(user));
var isDone = false;
// let isBoolean: boolean = new Boolean(1); 会报错
var isBoolean = new Boolean(1);
var isBoolean2 = Boolean(1);
var myName = 'Tom';
var sentence = "hello,my name is " + myName;
function alertName() {
    alert(sentence);
}
var unusable1 = undefined;
var unusable2 = null;
var unusable3 = undefined;
var unusable4 = null;
var num = undefined;
var u;
var num2 = u;
var u2;
var num3 = u2; //会报错
