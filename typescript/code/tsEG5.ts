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