// process.necttick嵌套执行顺序.js
var index = 0
function w_fn() { 
  function fn() { 
    console.log("哈哈")
    process.nextTick(() => { 
      console.log("idnex=", index++)
      fn()
    })
  }
  setImmediate(() => { 
    console.log("setImmediate")
  })
  fn()
}
w_fn()