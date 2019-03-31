var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Animal = /** @class */ (function () {
    function Animal(name, age, gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
    return Animal;
}());
var a = new Animal('jack', 18, 'male');
console.log(a.name);
a.name = 'Tom';
console.log(a.name);
console.log(a.age); // 会报错
a.age = 54; // 会报错
console.log(a.age); // 会报错
var Cat = /** @class */ (function (_super) {
    __extends(Cat, _super);
    function Cat(name, age, gender) {
        var _this = _super.call(this, name, age, gender) || this;
        console.log(_this.age); // 会报错
        console.log(_this.gender); // 不会报错
        return _this;
    }
    return Cat;
}(Animal));
var Animal2 = /** @class */ (function () {
    function Animal2(name, age, gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
    return Animal2;
}());
var a2 = new Animal2('jack', 18, 'male'); // 会报错 不允许实例化的
var Cat21 = /** @class */ (function (_super) {
    __extends(Cat21, _super);
    function Cat21(name, age, gender) {
        var _this = _super.call(this, name, age, gender) || this;
        console.log(_this.age); // 会报错
        console.log(_this.gender); // 不会报错
        return _this;
    }
    return Cat21;
}(Animal2));
var Cat2 = /** @class */ (function (_super) {
    __extends(Cat2, _super);
    function Cat2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Cat2.prototype.sayHi = function () {
        console.log("meow,my name is " + this.name);
    };
    return Cat2;
}(Animal2));
