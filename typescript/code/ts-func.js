function fun1(x, y) {
    return x + y;
}
fun1(1, 2);
fun1(1); // 报错 参数少 
fun1(1, 2, 3); // 报错 参数多
var fun2 = function (x, y) {
    return x + y;
};
var fun3 = function (x, y) {
    return x + y;
};
var fun4;
fun4 = function (source, subString) {
    return source.search(subString) !== -1;
};
var fun5;
fun5 = function (src, sub) {
    return src.search(sub) !== -1;
};
// 可选参数
function buildName(firstName, lastName) {
    if (lastName) {
        return firstName + ' ' + lastName;
    }
    else {
        return firstName;
    }
}
var feng = buildName('yi', 'feng');
var fengfeng = buildName('feng'); // 会报错 第二个参数必须
function buildName2(firstName, lastName) {
    if (lastName) {
        return firstName + ' ' + lastName;
    }
    else {
        return firstName;
    }
}
var feng2 = buildName2('yi', 'feng');
var fengfeng2 = buildName2('feng'); // 报错
// 参数默认值
function buildName3(firstName, lastName) {
    if (lastName === void 0) { lastName = 'fff'; }
    return firstName + ' ' + lastName;
}
var feng3 = buildName3('yi', 'feng');
var fengfeng3 = buildName3('feng');
function buildName4(firstName, lastName) {
    if (firstName === void 0) { firstName = 'li'; }
    return firstName + ' ' + lastName;
}
var feng4 = buildName4('yi', 'feng');
var fengfeng4 = buildName4(undefined, 'feng');
// 剩余参数
function fun6(arr) {
    var items = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        items[_i - 1] = arguments[_i];
    }
    items.map(function (v) {
        arr.push(v);
    });
}
var a = [];
fun6(a, 1, 2, 3);
// 重载
function reverse(x) {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    }
    else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
function reverse1(x) {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    }
    else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
