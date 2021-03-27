const NS_PER_SEC = 1e9;
const time = process.hrtime();
// [ 1800216, 25 ]
console.log(time)

setTimeout(() => {
  const diff = process.hrtime(time);
  // [ 1, 552 ]
console.log(diff)
  console.log(`基准工具 ${diff[0] * NS_PER_SEC + diff[1]} 纳秒`);
  // 基准工具 1000000552 纳秒
}, 1000);