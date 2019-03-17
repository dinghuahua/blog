# git常用命令操作

## 本地创建创建两个git账户

## 本地创建分支并推送到远端
    本地创建分支feature并切换到feature分支
        git checkout -b feature
    切换到feature分支后，将本地的feature分支 推送到远端
        git push origin featureæ
    git本地新建一个分支后 必须要做远程分支关联，
    如果没有关联，git会在下面的操作中提示显示的添加关联,关联的目的是
        如果在本地分支操作：git pull,git push,不需要在命令行中指定远程分支
        命令行中添加的关联修改的是config文件
        git push --set-upstream origin dev分支名

        关联关系问题到解决 
        ![alt 关联关系](https://github.com/dinghuahua/blog/blob/master/images/git1.png "关联关系问题到解决")
        config文件前后对比 
        ![alt config文件](https://github.com/dinghuahua/blog/blob/master/images/git2.png "config文件前后对比")