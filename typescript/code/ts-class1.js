var lyf1 = {
    name: 'LYF',
    age: 18
};
// 报错 少了age属性
// 报错信息中会提示 当前11行导致了3行报错
var lyf2 = {
    name: 'LYF'
};
// 报错 多了gender属性
var lyf3 = {
    name: 'LYF',
    age: 18,
    gender: 'male'
};
var lyf11 = {
    name: 'LYF',
    age: 18
};
//少了age属性 也不会报错 
var lyf12 = {
    name: 'LYF'
};
// 报错 多了gender属性
var lyf13 = {
    name: 'LYF',
    age: 18,
    gender: 'male'
};
var lyf21 = {
    name: 'LYF',
    age: 18
};
var lyf22 = {
    name: 'LYF'
};
var lyf23 = {
    name: 'LYF',
    age: 18,
    gender: 'male'
};
var lyf24 = {
    name: 'LYF',
    age: 18,
    gender: 54
};
var lyf25 = {
    name: 'LYF',
    age: 18,
    gender: true // 会报错 自定义属性类型必须是string | number 类型
};
var lyf26 = {
    name: 'LYF',
    age: 18,
    gender1: 'male',
    gender2: 'female',
    age: 19 // 会报错  自定义的age 和原本固定的属性名重复
};
var lyf27 = {
    name: 'LYF',
    age: 18,
    // propName 123  也可以被解析为string  故不会报错
    123: 'male'
};
var lyf31 = {
    name: 'LYF',
    age: 18,
    123: 'male'
};
var lyf41 = {
    id: 19870504,
    name: 'lyf',
    age: 18,
    gender: 'male'
};
lyf41.id = 54; // 会报错  因为只读
var lyf51 = {
    name: 'lyf',
    age: 18,
    gender: 'male'
};
lyf51.id = 54; // 会报错  因为只读
