var Person = /** @class */ (function () {
    function Person() {
    }
    return Person;
}());
var p;
// OK, because of structural typing
p = new Person();
var x;
// y's inferred type is { name: string; location: string; }
var y = { name: 'Alice', location: 'Seattle' };
x = y;
