
在配置中新增devServer选项
```javascript
  devServer: {                  
    open: true, //服务器启动成功后，将自动打开浏览器
    hot: true,  //启用模块热替换功能   备注①          
    port: 8080, // 指定要监听的端口号           
    publicPath: '/', // 将用于确定应该从哪里提供资源、此路径下的打包文件可在浏览器中访问，优先级高于contentBase       
    contentBase: './dist' //告诉服务器从哪里提供内容。    
  }, 
  plugins: [
    ...
    new webpack.NamedModulesPlugin(),          
    new webpack.HotModuleReplacementPlugin()
  ]
```
备注①：在配置文件中开启hot时，需要配合HotModuleReplacementPlugin才能完全启用HMR。 如果使用package.json内联--hot选项启动webpack或webpack-dev-server，则会自动添加此插件，因此您可能不需要将其添加到webpack.config.js。
内联如下：
``` javascript
"scripts": {
  "serve": "npx webpack-dev-server --hot --config ./build/webpack.config.js"
}
```
新增webpack内置插件
NamedModulesPlugin：在热加载时直接返回更新文件名，而不是文件的id。
HotModuleReplacementPlugin：热替换插件

development模式下，webpack做了那些打包工作
development是告诉程序，我现在是开发状态，也就是打包出来的内容要对开发友好。在此mode下，就做了以下插件的事，其他都没做，所以这些插件可以省略。
// webpack.development.config.js
module.exports = {
+ mode: 'development'
- devtool: 'eval',
- plugins: [
-   new webpack.NamedModulesPlugin(),
-   new webpack.NamedChunksPlugin(),
-   new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
- ]
}
我们看看NamedModulesPlugin和NamedChunksPlugin这两个插件都做了啥，原本我们的webpack并不会给打包的模块加上姓名，一般都是按照序号来，从0开始，然后加载第几个模块。这个对机器来说无所谓，查找载入很快，但是对于人脑来说就是灾难了，所以这个时候给各个模块加上姓名，便于开发的时候查找。
没有NamedModulesPlugin，模块就是一个数组，引用也是按照在数组中的顺序引用，新增减模块都会导致序号的变化，就是webpack默认打包下的情况。
有了NamedModulesPlugin，模块都拥有了姓名，而且都是独一无二的key，不管新增减多少模块，模块的key都是固定的。

除了NamedModulesPlugin，还有一个NamedChunksPlugin，这个是给配置的每个chunks命名，原本的chunks也是数组，没有姓名。
             Asset      Size  Chunks             Chunk Names
          index.js  4.04 KiB       0  [emitted]  index
          page2.js  3.75 KiB       1  [emitted]  page2
             Asset      Size           Chunks             Chunk Names
          index.js   4.1 KiB            index  [emitted]  index
          page1.js  4.15 KiB            page1  [emitted]  page1
NamedChunksPlugin其实就提供了一个功能就是你可以自定义chunks的名字，假如我再不同的包中有相同chunk名，怎么办？这个时候就要在进行区分了，我么可以用所有的依赖模块名加本上的模块名。因为Chunk.modules已经废弃了，现在用其他的方法来代替chunk.mapModules，然后重命名chunk的名字：
new webpack.NamedChunksPlugin((chunk) => {
    return chunk.mapModules(m => {
        return path.relative(m.context, m.request)
    }).join("_")
}),      
看一眼做这一行代码的效果，我们可以看到Chunks这边已经重命名了，这样可以很大程度上解决chunks重名的问题：
             Asset      Size             Chunks             Chunk Names
          index.js   4.1 KiB  index.js_page2.js  [emitted]  index
          page2.js  3.78 KiB           page2.js  [emitted]  page2
总结：development也就给我们省略了命名的过程，其他的还是要自己加的。
production
在正式版本中，所省略的插件们，如下所示，我们会一个个分析。
// webpack.production.config.js
module.exports = {
+  mode: 'production',
-  plugins: [
-    new UglifyJsPlugin(/* ... */),
-    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
-    new webpack.optimize.ModuleConcatenationPlugin(),
-    new webpack.NoEmitOnErrorsPlugin()
-  ]
}
UglifyJsPlugin
我们第一个需要处理的就要混淆&压缩JS了吧，这个时候就要请出UglifyJs了，在webpack中他的名字是const UglifyJsPlugin = require('uglifyjs-webpack-plugin');，这样就可以使用他了。
不过new UglifyJsPlugin()，这个插件我们可以在optimize中配置，效果是一样的，那么我们是不是就不用再导入一个新的插件了，这样反而会拖慢webpack的就打包速度。
optimization:{
    minimize: true,
},
将插件去除，混淆压缩放入optimization，这样webpack速度快的飞起了。只有第一次打包会慢，之后再打包就快了。
ModuleConcatenationPlugin
webpack.optimize.ModuleConcatenationPlugin()这个插件的作用是什么呢？官方文档上是这么描述的：

记住，此插件仅适用于由 webpack 直接处理的 ES6 模块。在使用转译器(transpiler)时，你需要禁用对模块的处理（例如 Babel 中的 modules 选项）。

NoEmitOnErrorsPlugin
最后一个插件就是webpack.NoEmitOnErrorsPlugin()，这个就是用于防止程序报错，就算有错误也给我继续编译，很暴力的做法呢。
others
还有一些默认的插件配置，也就是可以不在plugins中引用的配置：
flagIncludedChunks
flagIncludedChunks这个配置的作用是，看结果：
未启用
   Asset       Size  Chunks             Chunk Names
index.js   1.02 KiB       0  [emitted]  index
page1.js  970 bytes       1  [emitted]  page1
启用后，如果只有二个文件似乎表现不明显，于是我增加了三个文件，page1调用page2，index调用page1，那么一目了然，在这里的chunks就是所有引用模块的id。
  Asset       Size   Chunks             Chunk Names
index.js   1.08 KiB  0, 1, 2  [emitted]  index
page1.js   1.01 KiB     1, 2  [emitted]  page1
page2.js  971 bytes        2  [emitted]  page2
OccurrenceOrderPlugin
webpack.optimize.OccurrenceOrderPlugin这个插件的作用是按照chunk引用次数来安排出现顺序，因为这让经常引用的模块和chunk拥有更小的id。将上面的例子加上这个配置运行下就是这样的。
   Asset       Size   Chunks             Chunk Names
page2.js  969 bytes        0  [emitted]  page2
page1.js   1.01 KiB     1, 0  [emitted]  page1
index.js   1.08 KiB  2, 0, 1  [emitted]  index
SideEffectsFlagPlugin
webpack.optimize.SideEffectsFlagPlugin()这个插件如果需要生效的话，需要两个条件，一个是导入的模块已经标记了sideEffect，即package.json中的sideEffects这个属性为false，第二个就是当前模块引用了次无副作用的模块，而且没有使用。那么在打包的时候，就不会将这个模块打包到文件中。
总结
实际上production mode下，与官方文档相比，他的配置等同于如下配置：
module.exports = {
    mode:"none",
    optimization:{
        flagIncludedChunks:true,
        minimize: true,
    },
    plugins: [
        new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.SideEffectsFlagPlugin()
    ]
}
production各插件参考文档



