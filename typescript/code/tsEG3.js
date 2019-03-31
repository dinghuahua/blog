var myStrOrNum;
myStrOrNum = 'lyf';
myStrOrNum = '54';
myStrOrNum = true;
myStrOrNum = false;
function getLength(something) {
    return something.length; // length 不是共有属性，所以会报错
}
function getString(something) {
    return something.toString(); // toString是共有属性，所以不会报错
}
getLength('lyf');
getLength(54);
var myStrOrNum1;
myStrOrNum1 = 'lyf';
console.log(myStrOrNum1.length); // 3 不报错
myStrOrNum1 = 54;
console.log(myStrOrNum1.length); // 编译时报错
