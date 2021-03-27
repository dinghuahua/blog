const fs = require('fs')
setTimeout(function timeout() {
  console.log('timeout')
  process.nextTick(() => {
    console.log('nextTick')
  })
}, 0)

setImmediate(function immediate() {
  console.log('immediate')
})
// setTimeout 下限时间范围是在 [1, 2147483647]，不在这个范围，被设置为1
// 打印的结果为 （timeout/nextTick  immediate） 或者 （immediate  timeout/nextTick）
// 但永不会出现 （timeout immediate nextTick） 这个顺序，即immediate穿插在timeout 和 nextTick 之间
// 因为 process.nextTick 是在每个阶段执行完之后执行的，即process.nextTick 代码是写在timer阶段里面的 ，所以一定会紧跟在timer执行完之后的后面执行

setTimeout(() => {
  console.log('timeout0')
  new Promise((resolve, reject) => {
    resolve('resolved')
  }).then((res) => console.log(res))
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('timeout resolved')
    })
  }).then((res) => console.log(res))
  process.nextTick(() => {
    console.log('nextTick1')
    process.nextTick(() => {
      console.log('nextTick2')
    })
  })
  process.nextTick(() => {
    console.log('nextTick3')
  })
  console.log('sync')
  setTimeout(() => {
    console.log('timeout2')
  }, 0)
}, 0)

// process.nextTick 比 Promise 先入微任务队列

setTimeout(function timeout() {
  console.log('timeout')
  process.nextTick(() => {
    console.log('nextTick2')
  })
}, 0)
process.nextTick(() => {
  console.log('nextTick总')
})
setImmediate(function immediate() {
  console.log('immediate')
})

// 先执行本轮循环的 process.nextTick 在执行下一轮循环的 setImmediate的回调/或者 timer的回调

// 读取本地文件 操作IO
function asyncOperation() {
  fs.readFile(__dirname + '/aa.js', (err, data) => {
    console.log(data)
    process.nextTick(() => {
      console.log('nextTick总')
      process.nextTick(() => {
        console.log('nextTick内')
      })
    })
  })
}
console.log(__dirname)
setImmediate(function immediate() {
  console.log('immediate')
})
asyncOperation()
process.nextTick(() => {
  console.log('nextTick外')
})

setImmediate(function () {
  console.log('setImmediate')
  setImmediate(function () {
    console.log('嵌套setImmediate')
  })
  process.nextTick(function () {
    console.log('nextTick')
  })
})

/* 
	setImmediate
	nextTick
	嵌套setImmediate
*/
// 解析：
// 事件循环check阶段执行回调函数输出setImmediate，之后输出nextTick。嵌套的setImmediate在下一个事件循环的check阶段执行回调输出嵌套的setImmediate。

async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2')
}
console.log('script start')
setTimeout(function () {
  console.log('setTimeout0')
}, 0)
setTimeout(function () {
  console.log('setTimeout3')
}, 3)
setImmediate(() => console.log('setImmediate'))
process.nextTick(() => console.log('nextTick'))
async1()
new Promise(function (resolve) {
  console.log('promise1')
  resolve()
  console.log('promise2')
}).then(function () {
  console.log('promise3')
})
console.log('script end')
// script start
// async1 start
// async2
// promise1
// promise2
// script end
// nextTick
// promise3
// async1 end
// setTimeout0
// setImmediate
// setTimeout3
// 最后三个打印的顺序 看代码执行的时间，会有偏差  即随机

// 主模块代码-》process.nextTick-》Promise回调-》async回调-》下一轮事件循环
// process.nextTick 是每个阶段执行完之后 都会执行的
// process.nextTick嵌套 process.nextTick 也会在连续在本阶段执行，所以会卡着本阶段不往下走，所以定义来执行1000次的上限
// setTimeout(callback,time) callback是在下一轮事件循环中 timer阶段 执行
//                           time这个下限时间有个范围：[1, 2147483647]，如果设定的时间不在这个范围，将被设置为1
// setImmediate(callback); callback是在下一轮事件循环中check阶段执行
