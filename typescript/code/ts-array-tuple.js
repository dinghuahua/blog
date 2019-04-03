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
// 元组
var lyf1 = ['feng feng', 1987];
var lyf2;
lyf2[0] = 'feng feng';
lyf2[1] = 1987;
lyf2[0].slice(1);
lyf2[1].toFixed(2);
// 也可以只赋值其中一项
var lyf3;
lyf3[0] = 'feng feng';
var lyf4 = ['feng feng']; // 会报错 数量不够
var lyf5;
lyf5 = ['feng feng']; // 会报错 赋值操作 数量不够
lyf5[1] = 1987;
var lyf6;
lyf6 = ['feng feng', 1987];
lyf6.push('lyf');
lyf6.push(54);
lyf6.push(true); // 会报错
