function getName(n) {
    if (typeof n === 'string') {
        return n;
    }
    else {
        return n();
    }
}
function handleEvent(ele, event) {
    // do something
}
handleEvent(document.getElementById('hello'), 'scroll');
handleEvent(document.getElementById('world'), 'dbclick'); // 报错 event 不能为dbclick
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
var Days;
(function (Days) {
    Days[Days["Sun"] = 0] = "Sun";
    Days[Days["Mon"] = 1] = "Mon";
    Days[Days["Tue"] = 2] = "Tue";
    Days[Days["Wed"] = 3] = "Wed";
    Days[Days["Thu"] = 4] = "Thu";
    Days[Days["Fri"] = 5] = "Fri";
    Days[Days["Sat"] = 6] = "Sat";
})(Days || (Days = {}));
;
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
var Days1;
(function (Days1) {
    Days1[Days1["Sun"] = 7] = "Sun";
    Days1[Days1["Mon"] = 1] = "Mon";
    Days1[Days1["Tue"] = 2] = "Tue";
    Days1[Days1["Wed"] = 3] = "Wed";
    Days1[Days1["Thu"] = 4] = "Thu";
    Days1[Days1["Fri"] = 5] = "Fri";
    Days1[Days1["Sat"] = 6] = "Sat";
})(Days1 || (Days1 = {}));
;
console.log(Days1['Sun'] === 7); // true
console.log(Days1['Mon'] === 1); // true
console.log(Days1['Tue'] === 2); // true
console.log(Days1['Sat'] === 6); // true
var Days2;
(function (Days2) {
    Days2[Days2["Sun"] = 3] = "Sun";
    Days2[Days2["Mon"] = 1] = "Mon";
    Days2[Days2["Tue"] = 2] = "Tue";
    Days2[Days2["Wed"] = 3] = "Wed";
    Days2[Days2["Thu"] = 4] = "Thu";
    Days2[Days2["Fri"] = 5] = "Fri";
    Days2[Days2["Sat"] = 6] = "Sat";
})(Days2 || (Days2 = {}));
;
console.log(Days2['Sun'] === 3); // true
console.log(Days2['Mon'] === 1); // true
console.log(Days2['Tue'] === 2); // true
console.log(Days2[3] === 'Wed'); // true
console.log(Days2[3] === 'Sun'); // false
var Days3;
(function (Days3) {
    Days3[Days3["Sun"] = 7] = "Sun";
    Days3[Days3["Mon"] = 1.5] = "Mon";
    Days3[Days3["Tue"] = 2.5] = "Tue";
    Days3[Days3["Wed"] = 3.5] = "Wed";
    Days3[Days3["Thu"] = 4.5] = "Thu";
    Days3[Days3["Fri"] = 5.5] = "Fri";
    Days3[Days3["Sat"] = 6.5] = "Sat";
})(Days3 || (Days3 = {}));
;
console.log(Days3['Sun'] === 7); // true
console.log(Days3['Mon'] === 1.5); // true
console.log(Days3['Tue'] === 2.5); // true
console.log(Days3['Sat'] === 6.5); // true
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 'blue'.length] = "Blue";
})(Color || (Color = {}));
;
var Color1;
(function (Color1) {
    Color1["Red"] = "red";
    Color1[Color1["Green"] = void 0] = "Green";
    Color1[Color1["Blue"] = 0] = "Blue";
})(Color1 || (Color1 = {}));
; //  会报错 red 后会报错
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
;
var directions1 = [Directions1.Up, Directions1.Down, Directions1.Left, Directions1.Right];
var directions2 = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
