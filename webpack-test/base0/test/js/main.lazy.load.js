// 通过 CommonJS 规范导入 show 函数
import('../other/show').then(show => {
  console.log(show)
  show.default('Prefetch')
})
console.log("dasd")