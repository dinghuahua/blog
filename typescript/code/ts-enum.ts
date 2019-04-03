

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