let str: string = 'lyf';
str = 'liyf';
// str = 7; // 会报错

let anyThing: any = 'hello';
console.log(anyThing.myName);
console.log(anyThing.myName.firstName);
console.log(anyThing.setName('join'));
console.log(anyThing.setName('join').getName());


let something;
something = 'lyf';
something = 54;