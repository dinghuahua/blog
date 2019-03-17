# git常用命令操作

## 本地创建创建两个git账户

## 本地创建分支并推送到远端
    本地创建分支feature并切换到feature分支
        git checkout -b feature
    切换到feature分支后，将本地的feature分支 推送到远端
        git push origin featureæ
    git本地新建一个分支后 必须要做远程分支关联，如果没有关联，git会在下面的操作中提示 显示的添加关联
    关联目的是如果在本地分支操作：git pull,git push,git commit 不需要在命令行中指定远程分支
    推送到远程分支后，只要没有显示指定，git pull 的时候  就会提示这个 
    命令行中的修改都是针对config文件  使用 --set-upstream 去跟踪远程分支