function fun1(x: number, y: number): number{
    return x + y;
}
fun1(1,2);
fun1(1); // 报错 参数少 
fun1(1,2,3); // 报错 参数多

let fun2 = function(x: number,y: number):number{
    return x + y;
}
let fun3:(x: number, y: number) => number = function(x: number, y: number): number{
    return x + y;
}