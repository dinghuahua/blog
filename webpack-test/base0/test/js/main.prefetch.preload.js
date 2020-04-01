// 通过 CommonJS 规范导入 show 函数
import(/*webpackChunkName: 'show' *//*webpackPrefetch: true */'../other/show').then(show=>{
  show('Prefetch')
})
import(/*webpackChunkName: 'preload' *//*webpackPreload: true */'../other/preload').then(preload => {
  preload('Preload')
})
