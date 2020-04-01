const path = require('path');
const webpack = require('webpack');
const miniCssPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const glob = require("glob")

// 根据匹配规则输出正确的文件路径
/*
返回结果 eg:
最终生成的文件，会是key的名称，也就是会放在 fe/demo/ 目录下
{ 
  'fe/demo/index': '/Users/zhongxia/Code/webpack/webpack4-mul-demo/sample/fe/demo/index.jsx' ,
  'fe/demo/test': '/Users/zhongxia/Code/webpack/webpack4-mul-demo/sample/fe/demo/test.jsx' ,
}
*/
const getEntries = (pattern, exc) => {
  var fileList = glob.sync(pattern)
  return fileList.reduce((previous, current) => {
    // var filePath = path.parse(path.relative(path.resolve(__dirname, './test'), current))
    var withoutSuffix = path.basename(current, exc);
    previous[withoutSuffix] = path.resolve(__dirname, current)
    return previous
  }, {})
}

// 推荐用 pug模板，支持模板集成，不需要每个页面都去写一些公共的东西[如果没用过，理解成html就行了]
const jsRegx = `test/js/**/*.js`
const htmlRegx = `test/html/**/*.html`

const jsEntries = getEntries(jsRegx, '.js')
const htmlEntries = getEntries(htmlRegx, '.html')

let htmlPlugins = []
for (var htmlEntry in htmlEntries) {
  const config = {
    title: htmlEntry,
    filename: './' + htmlEntry + '.html',
    template: htmlEntries[htmlEntry],
    chunks:[],
    inject: true,
    hash: false,
    cache: true,
    chunksSortMode: 'manual',
    minify: {
      removeComments: true,
      collapseWhitespace: false
    }
  }
  // 遍历判断注入每个页面对应的JS文件
  for (var jsEntry in jsEntries) {
    // eg 去掉后缀后： src/demo/index === src/demo/index ，则把生成的JS文件注入到HTML中
    if (htmlEntry === jsEntry) {
      config.chunks.push(jsEntry)
    }
  }
  htmlPlugins.push(new HtmlWebpackPlugin(config))
}
// console.log(jsEntries)
// console.log(htmlEntries)
// console.log(htmlPlugins)

module.exports = {
  // JavaScript 执行入口文件
  mode: 'development',
  // entry: {
  //   "main.common.js": path.resolve(__dirname, './test/main.common.js'),
  //   "main.es6.common.js": path.resolve(__dirname, './test/main.es6.common.js'),
  //   "main-url-loader.js": path.resolve(__dirname, './test/main-url-loader.js'),
  // },
  // 多页面入口
  entry: jsEntries,
  output: {
    // 把所有依赖的模块合并输出到一个 bundle.js 文件
    filename: 'js/[name].js',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
      // css
      {
        test: /\.css$/,
        // 因为这个插件需要干涉模块转换的内容，所以需要使用它对应的 loader
        use: [
          //   {
          //       // 将 css 插入 style 标签里
          //       // 注意！！！：插入 style 标签是 js 动态插入的！打包好的 html 文件中并没有此 css 的 style 标签
          //       // loader: 'style-loader', 
          //       // options: {
          //       //     insertAt: 'top', // 插入 css 的位置，是头部追加还是尾部追加
          //       // }
          // },
          'style-loader',
          miniCssPlugin.loader, // 创建一个 link 标签
          'css-loader', // css-loader 负责解析 CSS 代码, 处理 CSS 中的依赖, @import url 这种
          'postcss-loader', // 预处理 css 文件，例如加浏览器前缀什么的，具体功能看 postcss.config.js 的配置
        ]
    },
    // less
    {
        test: /\.less$/,
        // 因为这个插件需要干涉模块转换的内容，所以需要使用它对应的 loader
        use: [
          miniCssPlugin.loader, // 创建一个 link 标签
          'css-loader', // css-loader 负责解析 CSS 代码, 处理 CSS 中的依赖
          // 'postcss-loader',
          'less-loader', // less 处理
        ],
    },
      // {
      //   // 用正则去匹配要用该 loader 转换的 CSS 文件
      //   test: /\.css$/,
      //   use: [{
      //     loader: miniCssPlugin.loader,
      //   }, 'css-loader', 'postcss-loader']
      // },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader', //将资源转换成 base64
            options: {
              //[hash].[ext] -- 默认
              // [hash:4] 取hash值的前4位
              // name:'img/[name].[hash].[ext]'  将当前这个图片放入 dist/img文件夹下(等同与下面的这个outputPath参数) + 文件名字等
              name: '[name].[hash:8].[ext]', //.[ext]文件类型后缀，，png|jpg|...
              outputPath: 'assets/img', //图片相对于dist目录的输出路径  dist下面的 -asset下的 -img下
              publicPath: '../assets/img', //告诉当前引用这个图片资源的文件应该去哪找这个图片，这里写的路径是针对打包后的dist目录的相对路径 所以会在最终的打包文件中写入这个相对路径
              limit: 10 //图片小于5000kb将图片转成 base64，大于这个值时用file-loader打包(需要手动安装file-loader) 因为安装url-loader时不会安装file-loader 虽然url-loader依赖于file-loader
              /**
               * 为什么要把图片转成base64？ 可以减少资源请求
               * 为什么要设置大小？ 如果图片很大，css体积过大，下载较慢，首屏加载效果体验差 ，，，浏览器正常可以异步加载
               * 建议设置为5000，即小于5kb的可以转换成base64，大于5kb的采用异步加载
               */
            }
          }
        ]
      }
    ] 
  },
  plugins: [
    // 输出打包目录前先把 dist/ 删掉
    new CleanWebpackPlugin(),
    // 设置生成css 的路径和文件名，会自动将对应entry入口js文件中引入的CSS抽出成单独的文件
    new miniCssPlugin({
      filename:'css/[name].css'// 从 .js 文件中提取出来的 .css 文件的名称
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   children: true, //使用代码拆分功能，一个 chunk 的多个子 chunk 会有公共的依赖。为了防止重复，可以将这些公共模块移入父 chunk。这会减少总体的大小，但会对首次加载时间产生不良影响。如果预期到用户需要下载许多兄弟 chunks（例如，入口 trunk 的子 chunk），那这对改善加载时间将非常有用
    //   name: 'common' // 指定公共 bundle 的名称。
    // }),
    ...htmlPlugins
  ],
};