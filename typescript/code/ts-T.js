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
function identity(arg) {
    return arg;
}
// 用两种方法使用。 
// 第一种是，传入所有的参数，包含类型参数：
var output1 = identity("myString"); // type of output will be 'string'
// 第二种方法更普遍。利用了类型推论 -- 即编译器会根据传入的参数自动地帮助我们确定T的类型
var output2 = identity("myString"); // type of output will be 'string'
function loggingIdentity1(arg) {
    console.log(arg.length); // Array has a .length, so no more error
    return arg;
}
function loggingIdentity2(arg) {
    console.log(arg.length); // Array has a .length, so no more error
    return arg;
}
function identity2(arg) {
    return arg;
}
var myIdentity = identity2;
// 泛型类
var GenericNumber = /** @class */ (function () {
    function GenericNumber() {
    }
    return GenericNumber;
}());
var myGenericNumber = new GenericNumber();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) { return x + y; };
function loggingIdentity(arg) {
    console.log(arg.length); // Now we know it has a .length property, so no more error
    return arg;
}
loggingIdentity({ length: 10, value: 3 });
var BeeKeeper = /** @class */ (function () {
    function BeeKeeper() {
    }
    return BeeKeeper;
}());
var ZooKeeper = /** @class */ (function () {
    function ZooKeeper() {
    }
    return ZooKeeper;
}());
var Animal1 = /** @class */ (function () {
    function Animal1() {
    }
    return Animal1;
}());
var Bee = /** @class */ (function (_super) {
    __extends(Bee, _super);
    function Bee() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Bee;
}(Animal1));
var Lion = /** @class */ (function (_super) {
    __extends(Lion, _super);
    function Lion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Lion;
}(Animal1));
function findKeeper(a) {
    console.log();
    return a.prototype.keeper;
}
findKeeper(Lion).nametag;
