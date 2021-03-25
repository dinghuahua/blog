var Queue = /** @class */ (function () {
    function Queue() {
        var _this = this;
        this.data = [];
        this.push = function (item) { return _this.data.push(item); };
        this.pop = function () { return _this.data.shift(); };
    }
    return Queue;
}());
var queue = new Queue();
queue.push(0);
queue.push('1'); // Oops，一个错误
// 一个使用者，走入了误区
console.log(queue.pop().toPrecision(1));
console.log(queue.pop().toPrecision(1)); // RUNTIME ERROR
// class QueueNumber {
//     private data = [];
//     push = (item: number) => this.data.push(item);
//     pop = (): number => this.data.shift();
//   }
//   const queue = new QueueNumber();
//   queue.push('0');
//   queue.push('1'); // Error: 不能推入一个 `string` 类型，只能是 `number` 类型
