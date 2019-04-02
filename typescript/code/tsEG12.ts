// 检查对象
interface Named {
    name: string;
}

let x: Named;
// y's inferred type is { name: string; location: string; }
let y = { name: 'Alice', location: 'Seattle' };
x = y;

// 检查函数
function greet(n: Named) {
    alert('Hello, ' + n.name);
}
greet(y); // OK
greet({name: 'Alice', location: 'Seattle' }); // 会报错 不知道为什么 对比上一条

// 对比两个函数
// 入参兼容
let x1 = (a: number) => 0;
let y1 = (b: number, s: string) => 0;

y1 = x1; // OK
x1 = y1; // Error
// 返回值兼容
let x2 = () => ({name: 'Alice'});
let y2 = () => ({name: 'Alice', location: 'Seattle'});

x2 = y2; // OK
y2 = x2; // Error because x() lacks a location property