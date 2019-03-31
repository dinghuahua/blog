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
