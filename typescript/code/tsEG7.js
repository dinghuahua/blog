function getLength(something) {
    return something.length; // 会报错 因为不是所有类型里面共有的属性或者方法
}
function getLength2(something) {
    if (something.length) {
        return something.length; // 会报错
    }
    else {
        return something.toString().length;
    }
}
// 断言
// 语法 <类型>值
function getLength3(something) {
    if (something.length) {
        return something.length;
    }
    else {
        return something.toString().length;
    }
}
// 语法 值 as 类型
function getLength4(something) {
    if (something.length) {
        return something.length;
    }
    else {
        return something.toString().length;
    }
}
function toboolean(something) {
    return something; // 会报错，因为断言成一个联合类型中不存在的类型
}
