class Queue {
    private data = [];
    push = item => this.data.push(item);
    pop = () => this.data.shift();
  }
  
  const queue = new Queue();
  
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

const a = new Promise()