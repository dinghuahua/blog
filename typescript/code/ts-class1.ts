interface Person{
    name: string;
    age: number;
}
let lyf1: Person = {
    name:'LYF',
    age:18
}
// 报错 少了age属性
// 报错信息中会提示 当前11行导致了3行报错
let lyf2: Person = {
    name:'LYF'
}
// 报错 多了gender属性
let lyf3: Person = {
    name:'LYF',
    age:18,
    gender:'male'
}

// 可选属性
interface Person1{
    name: string;
    age?: number;
}
let lyf11: Person1 = {
    name:'LYF',
    age:18
}
//少了age属性 也不会报错 
let lyf12: Person1 = {
    name:'LYF'
}
// 报错 多了gender属性
let lyf13: Person1 = {
    name:'LYF',
    age:18,
    gender:'male'
}

//  任意属性
interface Person21{
    name: string;
    age?: number;
    [propName: string]: number; // 会报错  name值的string类型不是可选属性值的类型number的子集
}
interface Person22{
    name: string;
    age?: number;
    [propName: string]: string | number;
    [propName: string]: string | number; // 会报错  与上一条可选属性一模一样 重复了
    [propName: number]: string | number; // 不重复 所以不报错
}
// 以下以Person2 类举例
interface Person2{
    name: string;
    age?: number;
    [propName: string]: string | number;
}
let lyf21: Person2 = {
    name:'LYF',
    age:18
}
let lyf22: Person2 = {
    name:'LYF'
}
let lyf23: Person2 = {
    name:'LYF',
    age:18,
    gender:'male'
}
let lyf24: Person2 = {
    name:'LYF',
    age:18,
    gender:54
}
let lyf25: Person2 = {
    name:'LYF',
    age:18,
    gender:true // 会报错 自定义属性类型必须是string | number 类型
}
let lyf26: Person2 = {
    name:'LYF',
    age:18,
    gender1:'male',
    gender2:'female',
    age:19 // 会报错  自定义的age 和原本固定的属性名重复
}
let lyf27: Person2 = {
    name:'LYF',
    age:18,
    // propName 123  也可以被解析为string  故不会报错
    123:'male'
}

// 以下以Person3 类举例
interface Person3{
    name: string;
    age?: number;
    [propName: number]: string | number;
}

let lyf31: Person3 = {
    name:'LYF',
    age:18,
    123:'male'
}

// 只读属性
interface Person4{
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}

let lyf41: Person4 = {
    id:19870504,
    name: 'lyf',
    age:18,
    gender:'male'
}
lyf41.id = 54; // 会报错  因为只读

interface Person5{
    readonly id?: number;
    name: string;
    age?: number;
    [propName: string]: any;
}

let lyf51: Person5 = {
    name: 'lyf',
    age:18,
    gender:'male'
}

lyf51.id = 54; // 会报错  因为只读