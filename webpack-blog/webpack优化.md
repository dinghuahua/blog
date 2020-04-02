### 代码分割的三种方式
webpack 中以下三种常见的代码分割方式:

* 入口起点：使用 entry 配置手动地分离代码。
* 动态导入：通过模块的内联函数调用来分离代码。
* 防止重复：使用 splitChunks 去重和分离 chunk。

第一种方式，很简单，只需要在 entry 里配置多个入口即可：
entry: { app: "./index.js", app1: "./index1.js" }
复制代码第二种方式，就是在代码中自动将使用 import() 加载的模块分离成独立的包：
//...

import("./a");

//...

复制代码第三种方式，是使用 splitChunks 插件，配置分离规则，然后 webpack 自动将满足规则的 chunk 分离。一切都是自动完成的。
前两种拆分方式，很容易理解。本文主要针对第三种方式进行讨论。



https://segmentfault.com/a/1190000018493260
如何输出Webpack构建分析
输出Webpack构建信息的.json文件：webpack --profile --json > stats.json
--profile:记录构建中的耗时信息
--json:以json格式输出构建结果，最后只输出一个json文件（包含所有的构建信息）
web可视化查看构建分析：得到了webpack构建信息文件stats.json，如何进行很好的可视化查看？

方案一：通过可视化分析工具Webpack Analyse，是个在线Web应用，上传stats.json文件就可以；不过好像需要翻墙；
方案二：安装webpack-bundle-analyzer工具npm i -g webpack-bundle-analyzer,生成stats.json后直接在其文件夹目录执行webpack-bundle-analyzer后，浏览器会打开对应网页并展示构建分析webpack-bundle-analyzer stats.json -p 8888文档地址webpack-bundle-analyzer
webpack-dashboard是一款统计和优化webpack日志的工具，可以以表格形势展示日志信息。其中包括构建过程和状态、日志以及涉及的模块列表
jarvis是一款基于webapck-dashboard的webpack性能分析插件，性能分析的结果在浏览器显示，比webpack-bundler-anazlyer更美观清晰
npm i -D webpack-jarvis

webpack.config.js配置：
const Jarvis = require("webpack-jarvis");

plugins: [
  new Jarvis({
    watchOnly: false,
    port: 3001 // optional: set a port
  })
];
port:监听的端口，默认1337，监听面板将监听这个端口，通常像http://localhost:port/
host:域名，默认localhost,不限制域名。
watchOnly:仅仅监听编译阶段。默认为true,如果高为false，jarvis不仅仅运行在编译阶段，在编译完成后还保持运行状态。
界面：看到构建时间为：Time: 11593ms(作为优化时间对比)
clipboard.png

webpack配置优化
webpack在启动时会从配置的Entry出发，解析出文件中的导入语句，再递归解析。
对于导入语句Webpack会做出以下操作：

根据导入语句寻找对应的要导入的文件；
在根据要导入的文件后缀，使用配置中的Loader去处理文件（如使用ES6需要使用babel-loader处理）
针对这两点可以优化查找途径
优化Loader配置

Loader处理文件的转换操作是很耗时的，所以需要让尽可能少的文件被Loader处理
{
    test: /\.js$/,
    use: [
        'babel-loader?cacheDirectory',//开启转换结果缓存
    ],
    include: path.resolve(__dirname, 'src'),//只对src目录中文件采用babel-loader
    exclude: path.resolve(__dirname,' ./node_modules'),//排除node_modules目录下的文件
},
优化resolve.modules配置

resolve.modules用于配置webpack去哪些目录下寻找第三方模块，默认是['node_modules']，但是，它会先去当前目录的./node_modules查找，没有的话再去../node_modules最后到根目录；
所以当安装的第三方模块都放在项目根目录时，就没有必要安默认的一层一层的查找，直接指明存放的绝对位置
resolve: {
        modules: [path.resolve(__dirname, 'node_modules')],
    }
优化resolve.extensions配置

在导入没带文件后缀的路径时，webpack会自动带上后缀去尝试询问文件是否存在，而resolve.extensions用于配置尝试后缀列表；默认为extensions:['js','json'];
及当遇到require('./data')时webpack会先尝试寻找data.js，没有再去找data.json；如果列表越长，或者正确的后缀越往后，尝试的次数就会越多；
所以在配置时为提升构建优化需遵守：

频率出现高的文件后缀优先放在前面；
列表尽可能的小；
书写导入语句时，尽量写上后缀名
因为项目中用的jsx较多，所以配置extensions: [".jsx",".js"],
基本配置后查看构建速度：Time: 10654ms;配置前为Time: 11593ms
使用DllPlugin优化
在使用webpack进行打包时候，对于依赖的第三方库，如react，react-dom等这些不会修改的依赖，可以让它和业务代码分开打包；
只要不升级依赖库版本，之后webpack就只需要打包项目业务代码，遇到需要导入的模块在某个动态链接库中时，就直接去其中获取；而不用再去编译第三方库，这样第三方库就只需要打包一次。
接入需要完成的事：

将依赖的第三方模块抽离，打包到一个个单独的动态链接库中
当需要导入的模块存在动态链接库中时，让其直接从链接库中获取
项目依赖的所有动态链接库都需要被加载
接入工具(webpack已内置)

DllPlugin插件：用于打包出一个个单独的动态链接库文件；
DllReferencePlugin:用于在主要的配置文件中引入DllPlugin插件打包好的动态链接库文件
配置webpack_dll.config.js构建动态链接库
const path = require('path');
const DllPlugin = require('webpack/lib/DllPlugin');

module.exports = {
    mode: 'production',
    entry: {
        // 将React相关模块放入一个动态链接库
        react: ['react','react-dom','react-router-dom','react-loadable'],
        librarys: ['wangeditor'],
        utils: ['axios','js-cookie']
    },
    output: {
        filename: '[name]-dll.js',
        path: path.resolve(__dirname, 'dll'),
        // 存放动态链接库的全局变量名，加上_dll_防止全局变量冲突
        library: '_dll_[name]'
    },
    // 动态链接库的全局变量名称，需要可output.library中保持一致，也是输出的manifest.json文件中name的字段值
    // 如react.manifest.json字段中存在"name":"_dll_react"
    plugins: [
        new DllPlugin({
            name: '_dll_[name]',
            path: path.join(__dirname, 'dll', '[name].manifest.json')
        })
    ]
}
webpack.pro.config.js中使用
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
...
plugins: [
    // 告诉webpack使用了哪些动态链接库
        new DllReferencePlugin({
            manifest: require('./dll/react.manifest.json')
        }),
        new DllReferencePlugin({
            manifest: require('./dll/librarys.manifest.json')
        }),
        new DllReferencePlugin({
            manifest: require('./dll/utils.manifest.json')
        }),
]
注意：在webpack_dll.config.js文件中，DllPlugin中的name参数必须和output.library中的一致；因为DllPlugin的name参数影响输出的manifest.json的name；而webpack.pro.config.js中的DllReferencePlugin会读取manifest.json的name，将值作为从全局变量中获取动态链接库内容时的全局变量名
执行构建

webpack --progress --colors --config ./webpack.dll.config.js
webpack --progress --colors --config ./webpack.prod.js
html中引入dll.js文件
构建时间对比：["11593ms","10654ms","8334ms"]
HappyPack并行构建优化
核心原理：将webpack中最耗时的loader文件转换操作任务，分解到多个进程中并行处理，从而减少构建时间。
HappyPack
接入HappyPack

安装：npm i -D happypack
重新配置rules部分,将loader交给happypack来分配：
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({size: 5}); //构建共享进程池，包含5个进程
...
plugins: [
    // happypack并行处理
    new HappyPack({
        // 用唯一ID来代表当前HappyPack是用来处理一类特定文件的，与rules中的use对应
        id: 'babel',
        loaders: ['babel-loader?cacheDirectory'],//默认设置loader处理
        threadPool: happyThreadPool,//使用共享池处理
    }),
    new HappyPack({
        // 用唯一ID来代表当前HappyPack是用来处理一类特定文件的，与rules中的use对应
        id: 'css',
        loaders: [
            'css-loader',
            'postcss-loader',
            'sass-loader'],
            threadPool: happyThreadPool
    })
],
module: {
    rules: [
    {
        test: /\.(js|jsx)$/,
        use: ['happypack/loader?id=babel'],
        exclude: path.resolve(__dirname,' ./node_modules'),
    },
    {
        test: /\.(scss|css)$/,
        //使用的mini-css-extract-plugin提取css此处，如果放在上面会出错
        use: [MiniCssExtractPlugin.loader,'happypack/loader?id=css'],
        include:[
            path.resolve(__dirname,'src'),
            path.join(__dirname, './node_modules/antd')
        ]
    },
}
参数：

threads：代表开启几个子进程去处理这一类文件，默认是3个；
verbose:是否运行HappyPack输出日志，默认true；
threadPool：代表共享进程池，即多个HappyPack示例使用一个共享进程池中的子进程去处理任务，以防资源占有过多
代码压缩用ParallelUglifyPlugin代替自带的 UglifyJsPlugin插件
自带的JS压缩插件是单线程执行的，而webpack-parallel-uglify-plugin可以并行的执行
配置参数：

uglifyJS: {}：用于压缩 ES5 代码时的配置，Object 类型
test: /.js$/g:使用正则去匹配哪些文件需要被 ParallelUglifyPlugin 压缩，默认是 /.js$/
include: []:使用正则去包含被压缩的文件，默认为 [].
exclude: []: 使用正则去包含不被压缩的文件，默认为 []
cacheDir: ''：缓存压缩后的结果，下次遇到一样的输入时直接从缓存中获取压缩后的结果并返回，默认不会缓存，开启缓存设置一个目录路径
workerCount: ''：开启几个子进程去并发的执行压缩。默认是当前运行电脑的 CPU 核数减去1
sourceMap: false：是否为压缩后的代码生成对应的Source Map, 默认不生成
...
minimizer: [
    // webpack:production模式默认有配有js压缩，但是如果这里设置了css压缩，js压缩也要重新设置,因为使用minimizer会自动取消webpack的默认配置
    new optimizeCssPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true
    }),
    new ParallelUglifyPlugin({
        cacheDir: '.cache/',
        uglifyJS:{
            output: {
           // 是否输出可读性较强的代码，即会保留空格和制表符，默认为输出，为了达到更好的压缩效果，可以设置为false
                beautify: false,
        //是否保留代码中的注释，默认为保留，为了达到更好的压缩效果，可以设置为false
                comments: false
            },
            compress: {
            //是否在UglifyJS删除没有用到的代码时输出警告信息，默认为输出
                warnings: false,
            //是否删除代码中所有的console语句，默认为不删除，开启后，会删除所有的console语句
                drop_console: true,
            //是否内嵌虽然已经定义了，但是只用到一次的变量，比如将 var x = 1; y = x, 转换成 y = 1, 默认为否
                collapse_vars: true,
            }
        }
}),
]




https://segmentfault.com/a/1190000018493260
使用DllPlugin优化
在使用webpack进行打包时候，对于依赖的第三方库，如react，react-dom等这些不会修改的依赖，可以让它和业务代码分开打包；
只要不升级依赖库版本，之后webpack就只需要打包项目业务代码，遇到需要导入的模块在某个动态链接库中时，就直接去其中获取；而不用再去编译第三方库，这样第三方库就只需要打包一次。
接入需要完成的事：

将依赖的第三方模块抽离，打包到一个个单独的动态链接库中
当需要导入的模块存在动态链接库中时，让其直接从链接库中获取
项目依赖的所有动态链接库都需要被加载
接入工具(webpack已内置)

DllPlugin插件：用于打包出一个个单独的动态链接库文件；
DllReferencePlugin:用于在主要的配置文件中引入DllPlugin插件打包好的动态链接库文件
配置webpack_dll.config.js构建动态链接库
const path = require('path');
const DllPlugin = require('webpack/lib/DllPlugin');

module.exports = {
    mode: 'production',
    entry: {
        // 将React相关模块放入一个动态链接库
        react: ['react','react-dom','react-router-dom','react-loadable'],
        librarys: ['wangeditor'],
        utils: ['axios','js-cookie']
    },
    output: {
        filename: '[name]-dll.js',
        path: path.resolve(__dirname, 'dll'),
        // 存放动态链接库的全局变量名，加上_dll_防止全局变量冲突
        library: '_dll_[name]'
    },
    // 动态链接库的全局变量名称，需要可output.library中保持一致，也是输出的manifest.json文件中name的字段值
    // 如react.manifest.json字段中存在"name":"_dll_react"
    plugins: [
        new DllPlugin({
            name: '_dll_[name]',
            path: path.join(__dirname, 'dll', '[name].manifest.json')
        })
    ]
}
webpack.pro.config.js中使用
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
...
plugins: [
    // 告诉webpack使用了哪些动态链接库
        new DllReferencePlugin({
            manifest: require('./dll/react.manifest.json')
        }),
        new DllReferencePlugin({
            manifest: require('./dll/librarys.manifest.json')
        }),
        new DllReferencePlugin({
            manifest: require('./dll/utils.manifest.json')
        }),
]
注意：在webpack_dll.config.js文件中，DllPlugin中的name参数必须和output.library中的一致；因为DllPlugin的name参数影响输出的manifest.json的name；而webpack.pro.config.js中的DllReferencePlugin会读取manifest.json的name，将值作为从全局变量中获取动态链接库内容时的全局变量名
执行构建

webpack --progress --colors --config ./webpack.dll.config.js
webpack --progress --colors --config ./webpack.prod.js
html中引入dll.js文件


UI 组件库按需引入