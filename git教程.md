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
    强推到远程 
        git push origin HEAD --force

## git名词扫盲

    工作区   即本地工作目录 不包括.git
    暂存区   add后 git status 又是也称作缓存区
    版本库   commit后  即当前分支的本地仓库  常用HEAD 表示
    远程仓库  push后   将版本库(本地仓库)提交到远程对应的分支
## git 工作流程

    git 工作区 暂存区 版本库 之间的关系
<img src="https://github.com/dinghuahua/blog/blob/master/images/git4.png" width="60%">

## 回退 和 回滚
    git checkout
    git checkout HEAD
    git reset
        默认是git reset –mixed
        git reset commit_id
        让版本库重置到某个commitid状态, 
        如果不加commitid 则默认 最后一次的commitid的值
        git reset命令后面需要加2种参数："--hard"和"--soft"，如果不加，默认情况下是"--soft"。
            --soft
                不改变工作区。即这个时候，上次提交的内容在工作区中还会存在。
                表示该条commit号之后（时间作为参考点）的所有commit的修改都会退回到暂存区中。所以使用git status命令可以在暂存区中看到这些修改。
        但是操作过reset后在下次push之前进行pull操作，否则会提示在push之前请先pull。
    git reset --hard
        让版本库重置到某个commitid状态
            --hard
                暂存区中不会存储这些修改，git会直接丢弃这部分内容，
                直接在工作区修改，无法提交到远程服务器，
                    如果从本地工作区删掉的内容没有push到服务器上，则不会有副作用
                    如果直接丢弃的内容已经被push到远程服务器上了，则会造成本地工作区和远程无法同步的问题，
                    即git reset --hard只能针对本地操作，不能针对远程服务器进行同样操作。则下次本地工作区和服务器进行同步时，这部分删掉的内容仍然会回来。
                    其实这个问题则可以很好的被git revert 命令解决，
                    使用git revert + commit号，该命令撤销对某个commit的提交，这样，当你和服务器同步时，就不会产生什么副作用。
                    
    git reset -- files 
        用来撤销最后一次的git add files（因为每git add file一次，暂存区的文件都会被更改一次），
        也可以用git reset 撤销所有暂存区域文件。 
    git reset HEAD 
        不改变工作区。即这个时候，上次提交的内容在工作区中还会存在。
        暂存区的目录树会被重写，被 master 分支指向的目录树所替换，
    git revert 
        仅仅是撤销某次提交，而git reset会将撤销点之后的操作都回退到暂存区中。


git reset和git revert的区别： 
reset是重置，

如果使用git reset –hard 将版本库，暂存区和工作区的内容全部重置为某个commit的状态。之前的commit不会保留。

revert比reset更加温柔一点，回滚到某次commit且该commit之后的提交记录都会保留，并且会在此基础上新建一个提交。对于已经push到服务器上的内容作回滚，推荐使用revert。
使用git diff查看各个区之间的差异

使用命令	代表意义
git diff	比较的是工作区和暂存区的差别
git diff –-cached	比较的是暂存区和版本库的差别
git diff HEAD	可以查看工作区和版本库的差别


    回退命令 本地的回退
        git reset --hard HEAD^
    回退到上个版本  回退到前3次提交之前，以此类推，回退到n次提交之前 本地的回退
        git reset --hard HEAD~3
    退到/进到 指定commit的sha码 本地的回退
        git reset --hard commit_id
        git checkout commit ID
        当执行 “git checkout .” 或者 “git checkout – ” 命令时，会用暂存区全部或指定的文件替换工作区的文件。这个操作很危险，会清除工作区中未添加到暂存区的改动。
    查看提交记录
        git log
    不删除物理文件，仅将该文件从缓存中删除  会直接从暂存区删除文件，工作区则不做出改变。
        git rm --cached "文件路径"
    不仅将该文件从缓存中删除，还会将物理文件删除（不会回收到垃圾桶）
        git rm --f "文件路径"
    如果一个文件已经add到暂存区，还没有 commit，此时如果不想要这个文件了，有两种方法：
        用版本库内容清空暂存区，git reset HEAD 回退到当前版本（在Git中，用HEAD表示当前版本，上一个版本就是HEAD^，上上一个版本就是HEAD^^，当然往上100个版本写100个^比较容易数不过来，所以写成HEAD~100）；
    只把特定文件从暂存区删除
        git rm --cached xxx
    把a.txt改名为b.txt
        git mv a.txt b.txt 

    commit 1