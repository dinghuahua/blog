> 安装Typescript

    1.在命令行中输入以下命令：npm install -g typescript
    2.如果在安装过程中出现以下错误,是因为权限不足导致的。可以通过在命令前面添加sudo进行解决：sudo npm install -g Typescript
<div align="center">
    <img src="https://github.com/dinghuahua/blog/blob/feature1/typescript/images/ts1.png" width="40%">
</div>

    3.以上命令会在全局安装tsc命令，安装完成之后，我们就可以在任何地方执行tsc命令了
    4.编译一个 文件：tsc hello.ts
    5.约定使用Typescript编写的文件为.ts为后缀，用Typescript编写react时，以.tsx为后缀
    6.Typescript中，使用: 指定类型的变量，:前后有没有空格都可以
    7.Typescript只会进行静态检查，如果发现有错误，编译的时候就会报错
    8.Typescript编译的时候即使报错了，还是会生成编译结果，我们仍然可以使用这个编译之后的文件
    9.如果要在报错的时候终止js文件的生成，可以在tsconfig.json中配置noEmitError即可，可以参考 
[官方文档](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
> 基础类型