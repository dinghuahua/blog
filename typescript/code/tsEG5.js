var arr1 = [1, 2, 3, 4, 5];
var arr2 = [1, 2, 3, 4, 'a']; //会报错 类型被推断为number | string
arr1.push('a'); //会报错 push进行的是个string，但是arr1定义的是number 
var arr3 = [1, 2, 3, 4, 5];
var arr4 = [1, 2, 3, 4, 5];
var arr5 = [1, 2, 3, 4, 5];
var arr6 = [1, '2', { name: 'lyf' }];
function arrFunction() {
    var args = arguments;
}
