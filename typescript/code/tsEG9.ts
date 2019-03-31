type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name{
    if(typeof n === 'string'){
        return n;
    } else {
        return n();
    }
}

type EventNames = 'click' | 'scroll' | 'mousemove';
function handleEvent(ele: Element, event: EventNames){
    // do something
}
handleEvent(document.getElementById('hello'), 'scroll');
handleEvent(document.getElementById('world'), 'dbclick'); // 报错 event 不能为dbclick

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

enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};

console.log(Days['Sun'] === 0); // true
console.log(Days['Mon'] === 1); // true
console.log(Days['Tue'] === 2); // true
console.log(Days['Wed'] === 3); // true
console.log(Days['Thu'] === 4); // true
console.log(Days['Fri'] === 5); // true
console.log(Days['Sat'] === 6); // true

console.log(Days[0] === 'Sun'); // true
console.log(Days[1] === 'Mon'); // true
console.log(Days[2] === 'Tue'); // true
console.log(Days[3] === 'Wed'); // true
console.log(Days[4] === 'Thu'); // true
console.log(Days[5] === 'Fri'); // true
console.log(Days[6] === 'Sat'); // true

// 手动赋值
enum Days1{Sun = 7, Mon = 1, Tue, Wed, Thu, Fri, Sat};
console.log(Days1['Sun'] === 7); // true
console.log(Days1['Mon'] === 1); // true
console.log(Days1['Tue'] === 2); // true
console.log(Days1['Sat'] === 6); // true

enum Days2{Sun = 3, Mon = 1, Tue, Wed, Thu, Fri, Sat};
console.log(Days2['Sun'] === 3); // true
console.log(Days2['Mon'] === 1); // true
console.log(Days2['Tue'] === 2); // true
console.log(Days2[3] === 'Wed'); // true
console.log(Days2[3] === 'Sun'); // false

enum Days3{Sun = 7, Mon = 1.5, Tue, Wed, Thu, Fri, Sat};
console.log(Days3['Sun'] === 7); // true
console.log(Days3['Mon'] === 1.5); // true
console.log(Days3['Tue'] === 2.5); // true
console.log(Days3['Sat'] === 6.5); // true

enum Color{Red, Green, Blue = 'blue'.length};
enum Color1{Red = 'red', Green, Blue = 'blue'.length}; //  会报错 red 后会报错
// 常数枚举
const enum Directions{Up, Down, Left, Right}
let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
const enum Color2{Red, Green, Blue = 'blue'.length};

// 外部枚举
declare enum Directions1{Up, Down, Left, Right}
let directions1 = [Directions1.Up, Directions1.Down, Directions1.Left, Directions1.Right];

declare const enum Directions2{Up, Down, Left, Right}
let directions2 = [Directions2.Up, Directions2.Down, Directions2.Left, Directions2.Right];