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

interface SearchFunc{
    (source: string, subString: string):boolean;
}
let fun4: SearchFunc;
fun4 = function(source: string, subString: string){
    return source.search(subString) !== -1;
}
let fun5: SearchFunc;
fun5 = function(src: string, sub: string){
    return src.search(sub) !== -1;
}

// 可选参数
function buildName(firstName: string, lastName: string){
    if(lastName){
        return firstName + ' ' + lastName;
    }else{
        return firstName;
    }
}
let feng = buildName('yi','feng');
let fengfeng = buildName('feng'); // 会报错 第二个参数必须
function buildName2(firstName?: string, lastName: string){// 会报错 不必须参数后面出现了必须参数
    if(lastName){
        return firstName + ' ' + lastName;
    }else{
        return firstName;
    }
}
let feng2 = buildName2('yi','feng');
let fengfeng2 = buildName2('feng'); // 报错

// 参数默认值
function buildName3(firstName: string, lastName: string = 'fff'){
    
    return firstName + ' ' + lastName;
}
let feng3 = buildName3('yi','feng');
let fengfeng3 = buildName3('feng'); 

function buildName4(firstName: string = 'li', lastName: string){ // 不会报错
    
    return firstName + ' ' + lastName;
}
let feng4 = buildName4('yi','feng');
let fengfeng4 = buildName4(undefined,'feng');

// 剩余参数
function fun6(arr: any[], ...items: any[]){
	items.map(function(v){
	    arr.push(v)
    })
}
let a = [];
fun6(a,1,2,3)

// 重载
function reverse(x: number | string):number | string{
    if(typeof x === 'number'){
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string'){
        return x.split('').reverse().join('');
    }
}
//前几次reverse1 都是函数定义，最后一次是函数的实现
//Typescript会优先从前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面
function reverse1(x: number):number;
function reverse1(x: string):string;
function reverse1(x: number | string):number | string{
    if(typeof x === 'number'){
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string'){
        return x.split('').reverse().join('');
    }
}


// 总结
// 函数的声明
function fun00(x: number, y: number){
    return x + y;
}
function fun11(x: number, y: number): number{
    return x + y;
}
// 函数表达式
let add11: (x: number,y: number) => number = function(x: number, y: number): number{return x + y;}
let add21 = function(x: number,y: number): number{return x + y;}
let add31 = function(x: number,y: number){return x + y;}
let add41: (x: number, y: number) => number = function(x, y){return x + y;}
// let add5: (x: number, y: number) = function(x, y){return x + y;} // 会报错 前面写必须'=>' expected
// let add6: (x: number, y: number) = function(x, y): number{return x + y;}// 会报错 前面写必须'=>' expected

// 用接口定义函数声明
interface SquareConfig {
    color?: string;
    width?: number;
    name: string
}
function createSquare(config: SquareConfig): {color: string; area: number} {
    let newSquare = {color: "white", area: 100};
    if (config.color) {
      newSquare.color = config.color;
    }
    if (config.width) {
      newSquare.area = config.width * config.width;
    }
    return newSquare;
}
let mySquare = createSquare({name: 'lyf', color: "black"});
// 用接口定义函数表达式
interface SearchFunc{
    // 给接口定义一个调用签名
    (source: string, subString: string):boolean;
}
let fun41: SearchFunc;
fun41 = function(source: string, subString: string){
    return source.search(subString) !== -1;
}
