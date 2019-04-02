var x;
// y's inferred type is { name: string; location: string; }
var y = { name: 'Alice', location: 'Seattle' };
x = y;
// 检查函数
function greet(n) {
    alert('Hello, ' + n.name);
}
greet(y); // OK
greet({ name: 'Alice', location: 'Seattle' }); // 会报错 不知道为什么 对比上一条
// 对比两个函数
// 入参兼容
var x1 = function (a) { return 0; };
var y1 = function (b, s) { return 0; };
y1 = x1; // OK
x1 = y1; // Error
// 返回值兼容
var x2 = function () { return ({ name: 'Alice' }); };
var y2 = function () { return ({ name: 'Alice', location: 'Seattle' }); };
x2 = y2; // OK
y2 = x2; // Error because x() lacks a location property
