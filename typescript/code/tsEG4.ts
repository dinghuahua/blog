interface Person{
    name: string;
    age: number;
}
let lyf1: Person = {
    name:'LYF',
    age:18
}
// 报错 少了age属性
let lyf2: Person = {
    name:'LYF'
}
// 报错 多了gender属性
let lyf3: Person = {
    name:'LYF',
    age:18,
    gender:'male'
}