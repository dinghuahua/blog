let arr1: number[] = [1,2,3,4,5];
let arr2: number[] = [1,2,3,4,'a']; //会报错 类型被推断为number | string
arr1.push('a'); //会报错 push进行的是个string，但是arr1定义的是number 

let arr3: Array<number> = [1,2,3,4,5];

interface NumberArray1{
    [index:number]:number
}
interface NumberArray2{
    [propName:number]:number
}
let arr4: NumberArray1 = [1,2,3,4,5];
let arr5: NumberArray2 = [1,2,3,4,5];

let arr6: any[] = [1,'2',{name:'lyf'}];

function arrFunction(){
    let args:IArguments = arguments;
}
// 元组
let lyf1: [string, number] = ['feng feng',1987];
let lyf2: [string, number];
lyf2[0] = 'feng feng';
lyf2[1] =1987;

lyf2[0].slice(1);
lyf2[1].toFixed(2);

// 也可以只赋值其中一项
let lyf3: [string, number];
lyf3[0] = 'feng feng';

let lyf4: [string, number] = ['feng feng']; // 会报错 数量不够
let lyf5: [string, number];
lyf5 = ['feng feng'];  // 会报错 赋值操作 数量不够
lyf5[1] = 1987;

let lyf6: [string, number];
lyf6 = ['feng feng', 1987];
lyf6.push('lyf');
lyf6.push(54);
lyf6.push(true);// 会报错