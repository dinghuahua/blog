# git常用命令操作

## 本地创建创建两个git账户

## git 常见缩写
    -r origin
    -d delete
    -b branch
## 本地创建分支并推送到远端
    创建分支
        git branch feature
    切换分支
        git checkout feature
    创建分支
    本地创建分支feature并切换到feature分支
        git checkout -b feature
    切换到feature分支后，将本地的feature分支 推送到远端
        git push origin feature
    git本地新建一个分支后 必须要做远程分支关联，
    如果没有关联，git会在下面的操作中提示显示的添加关联,关联的目的是，如果在本地分支操作：git pull,git push,不需要在命令行中指定远程分支，
    命令行中添加的关联,其实修改的是config文件
        git push --set-upstream origin dev分支名
    如果本地本地推送到远程后，不添加关联关系，在 git pull,git push 需要指定远程分支名称，不添加关联关系，那么新建的分支配置也不会显示在config文件中
        git push origin debug分支名称

    添加关联关系git push问题的解决
<img src="https://github.com/dinghuahua/blog/blob/master/images/git1.png" width="40%">
    不添加关联关系git push问题的解决
<img src="https://github.com/dinghuahua/blog/blob/master/images/git1.png" width="40%">
    config文件前后对比 
<img src="https://github.com/dinghuahua/blog/blob/master/images/git2.png" width="60%">
    
    合并分支 切换到接收修改的分支master,将feature分支的代码合并到master
        git merge feature
    删除本地分支
        git branch -d debug
    删除远程分支
        git push origin --delete debug   或者 git push origin -d debug
    回退命令 本地的回退
        git reset --hard HEAD^
    回退到上个版本  回退到前3次提交之前，以此类推，回退到n次提交之前 本地的回退
        git reset --hard HEAD~3
    退到/进到 指定commit的sha码 本地的回退
        git reset --hard commit_id
        git checkout commit ID
    查看提交记录
        git log
    强推到远程 
        git push origin HEAD --force
