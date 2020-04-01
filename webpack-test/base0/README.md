## 学习webpack打包原理
通过手动更改webpack.entry入口  ==> webpack.config.js
--save-dev devDependencies  production不会安装
--save     devdependencies  不写默认的安装地方

webpack将多个模块打包之后的代码集合称为chunk。根据不同webpack配置，chunk又有如下几种类型：
 1.webpack当中配置的入口文件（entry）是chunk，可以理解为entry chunk

       2.入口文件以及它的依赖文件通过code split （代码分割）出来的也是chunk，可以理解为children chunk

       3.通过commonsChunkPlugin创建出来的文件也是chunk，可以理解为commons chunk



Entry Chunk: 包含一系列模块代码，以及webpack的运行时(Runtime)代码，一个页面只能有一个Entry Chunk，并且需要先于Normal Chunk载入

### 编译原理的分析
1. main.common.js===>commonjs require 并分析打包原理
2. main.es6.common.js==>用es6的模块写法引用commonjs require  
### loader
1. url-loader/file-loader
   * main-url-loader.js==> url-loader的学习
``` javascript
 {
  test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
  use: [
    {
      loader: 'url-loader', //将资源转换成 base64
      options: {
        //[hash].[ext] -- 默认
        // [hash:4] 取hash值的前4位
        // name:'img/[name].[hash].[ext]'  将当前这个图片放入 dist/img文件夹下(等同与下面的这个outputPath参数) + 文件名字等
        name: '[name].[hash].[ext]', //.[ext]文件类型后缀，，png|jpg|...
        outputPath: 'assets/img', //图片相对于dist目录的输出路径  dist下面的 -asset下的 -img下
        publicPath: 'assets/img', //告诉当前引用这个图片资源的文件应该去哪找 
        limit: 5000 //图片小于5000kb将图片转成 base64，大于这个值时用file-loader打包(需要手动安装file-loader) 因为安装url-loader时不会安装file-loader 虽然url-loader依赖于file-loader
        /**
         * 为什么要把图片转成base64？ 可以减少资源请求
         * 为什么要设置大小？ 如果图片很大，css体积过大，下载较慢，首屏加载效果体验差 ，，，浏览器正常可以异步加载
         * 建议设置为5000，即小于5kb的可以转换成base64，大于5kb的采用异步加载
         */
      }
    }
  ]
}
```

### plugin
1. 将css从js中分离，注意引用路径的问题
  *  extract-text-webpack-plugin   在webpack4. 以上的版本有 打包时会保错：webpack Error: Cannot find module 'webpack/lib/Chunk'， 这是官方的问题，暂不纠结，改用为新版mini-css-extract-plugin 插件
``` javascript
modules{
   rules: [
    {
      // 用正则去匹配要用该 loader 转换的 CSS 文件
      test: /\.css$/,
      use: [{
        loader: miniCssPlugin.loader,
      }, 'css-loader']
    },
  ]
},
plugins: [
    // 设置生成css 的路径和文件名，会自动将对应entry入口js文件中引入的CSS抽出成单独的文件
    new miniCssPlugin({
      filename:'./css/[name].css'// 从 .js 文件中提取出来的 .css 文件的名称 并放入到css目录下
  })
  ],
```
2. HtmlWebpackPlugin 为所有入口chunk生成html,并且注入对应的 js 文件 和css文件
    html-webpack-plugin
    插件的基本作用就是生成html文件。原理很简单：将 webpack中`entry`配置的相关入口chunk  和  `extract-text-webpack-plugin`抽取的css样式，插入到该插件提供的`template`或者`templateContent`配置项指定的内容基础上生成一个html文件，具体插入方式是将样式`link`插入到`head`元素中，`script`插入到`head`或者`body`中
      
3. clean-webpack-plugin 清除目录
```javascript
plugins: [
  new CleanWebpackPlugin(['dist'])
]

### 项目比较大之后，如何优化构建速度
1. 代码分割


dll包和业务chunk包

项目比较大之后，每次构建的时间就随着增长。 目前项目从代码提交，再到 ci 触发 docker，自动去构建，需要 4~7 分钟。 这个时间有点久了，有什么办法可以加快吗？

经过调研和实践发现，主要有一下几种方式可以加快构建速度

2. 多线程构建 happypack
nodejs 是单线程运行的，因此可以采用多线程的方式，来加快构建速度。速度有一定的提升，但是提升不是非常明显

```javascript
const os = require('os')
const HappyPack = require('happypack')

// 系统几核，就用几个线程
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

const plugins = [
  new HappyPack({
    id: 'jsx',
    threadPool: happyThreadPool,
    loaders: ['babel-loader?cacheDirectory']
  }),
  new HappyPack({
    id: 'css',
    threadPool: happyThreadPool,
    loaders: ['css-loader?minimize', 'postcss-loader']
  }),
  new HappyPack({
    id: 'less',
    threadPool: happyThreadPool,
    loaders: ['css-loader?minimize', 'postcss-loader', 'less-loader']
  })
]

module.exports = {
  mode: 'production',
  entry: {
    /*省略*/
  },
  output: {
    /*省略*/
  },
  module: {
    rules: [
      /*省略*/
      {
        test: /\.jsx?$/,
        use: 'happypack/loader?id=jsx',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'happypack/loader?id=css']
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'happypack/loader?id=less']
      }
      // ,{
      //   test: /\.less$/,
      //   use: [MiniCssExtractPlugin.loader, 'css-loader?minimize', 'postcss-loader', 'less-loader']
      // }
      /*省略*/
    ]
  },
  // plugins: plugins
}
```
2. CommonsChunkPlugin 常用于构建多入口的情况
通过将公共模块拆出来，最终合成的文件能够在最开始的时候加载一次，便存到缓存中供后续使用。这个带来速度上的提升，因为浏览器会迅速将公共的代码从缓存中取出来，而不是每次访问一个新页面时，再去加载一个更大的文件。
mainfest
dll 质上的做法和我们手动分离这些第三方库是一样的，
####c

webpack --profile --json >stat.json