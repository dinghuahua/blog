# git常用命令操作

## 本地创建创建两个git账户
    背景：公司一个gitub账号，个人一个github账户，想在git上同时使用，两者互不干扰。
          即提交代码时想要分github账号进行提交，或者clone项目时也想分账号clone,故需要在本地配置两个github账号，如不介意在提交代码、clone项目时账户混用，请忽略此小节。
    思路：
        如果是单用户(single-user)，会默认拿id_rsa与你的github服务器的公钥对比；
        如果是多用户(multi-user)， 如user1(dinghh公司,默认),user2(dinghuahua个人),那么就不能用在user2的身上了，这个时候就要配置一下了;
        本地管理两个SHH key
    解决方案：
        注意使用：github官方的bash，避免在新秘钥添加到SSH agent中时，出现很多问题。

###### 新建dinghuahua的SSH Key
        如默认账户也没有SSH Key，那么默认账户也需要建立SSH Key，本人的默认账户已有SSH Key,也有公钥、私钥文件。
        cd ~/.ssh                                  # 切换到C:\Users\dingding\.ssh
        ssh-keygen -t rsa -C "huahuajxnu@163.com"  # user2新建的SSH key

        不要一路回车，在第一个对话的时候输入重命名（id_rsa_huahuajxnu,公司使用默认的id_rsa），这样huahuajxnu账户就会生成公钥、私钥2个文件

        第一个对话框形式如下：
            Enter file in which to save the key (C:/Users/dingding/.ssh/id_rsa): id_rsa_huahuajxnu

        注意1：ssh-keygen是linux命令，可以让两个机器之间使用ssh而不需要用户名和密码
        注意2：一定要在~/.ssh路径下运行命令行，不然生成的文件会出现在当前定位的目录

###### 新私钥添加到SSH agent中
        因为默认只读取id_rsa，为了让SSH识别新的私钥，需将其添加到SSH agent中：
        ssh-add ~/.ssh/id_rsa_huahuajxnu
        如果出现Could not open a connection to your authentication agent的错误，就试着用以下命令：
        ssh-agent bash
        ssh-add ~/.ssh/id_rsa_huahuajxnu

###### 修改config文件
        在~/.ssh目录下找到config文件，如果没有就创建：
        touch config
        # 该文件用于配置私钥对应的服务器
        # Default github user1(dinghh@mail.com)
        Host github.com
        HostName github.com
        User git
        IdentityFile ~/.ssh/id_rsa

        # user2(huahuajxnu@163.com)
        # 建一个github别名，新建的帐号使用这个别名做clone,push,pull
        Host huagithub
        HostName github.com
        User git
        # 新建的帐号使用id_rsa_huahuajxnu
        IdentityFile ~/.ssh/id_rsa_huahuajxnu
        
        如果default默认账户存在的话，其实就是往这个config中添加一个user2的Host
        其规则就是：从上至下读取config的内容，在每个Host下寻找对应的私钥。
        这里是将GitHub SSH仓库地址中的git@github.com整体替换成新建的Host别名如：github2，
        那么原地址是：git@github.com:dinghuahua/blog.git，替换后应该是：huagithub:dinghuahua/blog.git

<div align="center">
    <img src="https://github.com/dinghuahua/blog/blob/master/git-study/images/git11.png" width="40%">
</div>

###### GitHub后台 部署SSH key
        添加 新生成的~/.ssh/id_rsa2.pub 的公钥
        分别登陆两个github账号，进入Personal settings –> SSH and GPG keys：

<div align="center">
    <img src="https://github.com/dinghuahua/blog/blob/master/git-study/images/git12.png" width="40%">
</div>

###### 测试：
        cd C:\Users\dingding\.ssh 
        ssh -T git@github.com
        
        Hi dinghh! You've successfully authenticated, but GitHub does not provide shell access.

        Administrator@FANGPENG /e/work
        ssh -T huagithub
        Hi dinghuahua! You've successfully authenticated, but GitHub does not provide shell access.
###### 使用
        1、clone到本地
            (1)原来的写法：
                git clone git@github.com:user1的用户名(dinghh)/blog.git
                git clone git@github.com:user2的用户名(huahuajxnu)/blog.git
            (2)现在的写法：
                git clone git@github.com:user1的用户名(dinghh)/blog.git
                git clone huagithub(config文件中对user2配置的HOST):user2的用户名/blog.git
        2、分项目的配置用户名邮箱：
                配置用户名和邮箱（在某个特定的项目中）,如果不配置使用的则是全局的用户名和邮箱
                git config user.name dinghuahua
                git config user.email huahuajxnu@163.com
                用户名和密码存贮的位置是：本地仓库的.git文件中的config文件

<div align="center">
    <img src="https://github.com/dinghuahua/blog/blob/master/git-study/images/git14.png" width="40%">
    <img src="https://github.com/dinghuahua/blog/blob/master/git-study/images/git15.png" width="40%">
</div>

        3、全局配置的git 用户名、邮箱对应的文件地址为C:\Users\用户名\.gitconfig  文件

<div align="center">
    <img src="https://github.com/dinghuahua/blog/blob/master/git-study/images/git13.png" width="40%">
</div>

## git 常见缩写
    -r origin
    -d delete
    -b branch
    -f force
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
<img src="https://github.com/dinghuahua/blog/blob/master/git-study/images/git1.png" width="40%">

不添加关联关系git push问题的解决
<img src="https://github.com/dinghuahua/blog/blob/master/git-study/images/git1.png" width="40%">

config文件前后对比 
<img src="https://github.com/dinghuahua/blog/blob/master/git-study/images/git2.png" width="60%">
    
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
    在Git中，用HEAD表示当前版本，上一个版本就是HEAD^，上上一个版本就是HEAD^^，当然往上100个版本写100个^比较容易数不过来，所以写成HEAD~100

## git 工作流程

    git 工作区 暂存区 版本库 之间的关系
<img src="https://github.com/dinghuahua/blog/blob/master/git-study/images/git4.png" width="60%">

## git 回退 和 回滚
    git checkout
        工作区的改动
        git checkout commit ID
        git checkout . 或者 git checkout –  会用暂存区全部或指定的文件替换工作区的文件。这个操作很危险，会清除工作区中未添加到暂存区的改动
    git checkout HEAD   
        会用本地库全部或指定的文件替换工作区的全部或者指定的文件
    git reset
        默认是git reset –mixed
            --mixed  不删除工作空间改动代码，撤销commit，并且撤销git add . 操作
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
        git reset --hard 操作过后马上操作pull，则工作区会和远程同步，但是暂存区不会同步，和刚刚操作过的git reset --hard一样，是空的。
        故push过后如仅仅只需要撤销某一次的commitid，需要用revert 操作 
            
    git reset -- files 
        用来撤销最后一次的git add files（因为每git add file一次，暂存区的文件都会被更改一次），
        也可以用git reset 撤销所有暂存区域文件。 
    git reset HEAD 
        git reset --hard HEAD^      回退到上个版本
        git reset --hard HEAD~3     回退到前3次提交之前，以此类推，
        git reset --hard HEAD~n     回退到n次提交之前 本地的回退
        不改变工作区。即这个时候，上次提交的内容在工作区中还会存在。
        暂存区的目录树会被重写，被 master 分支指向的目录树所替换，
    git revert
        git revert  撤销最后一次的commit
        git revert commitid 撤销某一次的commitid
        仅仅是撤销某次提交，而git reset会将撤销点之后的操作都回退到暂存区中。 
        暂存区、版本库还和远程一样 但提示Unmerged 工作区出现未合并内容
        <<<<<<<<HEAD 内容表示 commitid 之后push到远程的内容
        
        =======
        >>>>>>> 表示此次commitid 撤销的内容
    git reset和git revert的区别： 
        reset是重置，
            如果使用git reset –hard 将版本库，暂存区和工作区的内容全部重置为某个commit的状态。之前的commit不会保留。
        revert比reset更加温柔一点，回滚到某次commit且该commit之后的提交记录都会保留，并且会在此基础上新建一个提交。对于已经push到服务器上的内容作回滚，推荐使用revert。
    使用git diff查看各个区之间的差异
        git diff	        比较的是工作区和暂存区的差别
        git diff –-cached	比较的是暂存区和版本库的差别
        git diff HEAD       可以查看工作区和版本库的差别
## git 常用操作 以及 常见问题        
    查看提交记录
        git log
    把a.txt改名为b.txt
        git mv a.txt b.txt 
    从暂存区删除文件，工作区不删除。
        git rm --cached "文件路径"
    从暂存区、工作区 删除文件（不会回收到垃圾桶）
        git rm --f "文件路径"
    如果一个文件已经add到暂存区，还没有 commit，此时如果不想要这个文件了，有两种方法：
        用版本库内容清空暂存区，git reset HEAD 回退到当前版本
    执行完commit后，想撤回commit
        git reset --soft HEAD^
    修改commit message
        还没有push 想要修改commit message 
            修改最近一次的message
                如果commit注释写错了，只是想改一下注释，只需要：
                    git commit --amend  此时会进入默认vim编辑器，修改注释完毕后保存就好了
        执行过push 想要修改commit message 
        修改注释前确保本地为最新的代码
            最近一次
                只能修改最近一次的commit message -s 就是自动加上Signed-off-by 
                    git commit --amend -s
                最后push 到远程仓库,所有的 DCO 就都可以加上啦,-f强制推送
                    git push origin <you_branch_name> -f
            修改最近3次的commit message 
                执行 git 命令, 修改近三次的信息
                    git rebase -i HEAD~3
                    将想要修改的message对应的 pick 改为 edit 此时还不需要修改message
<div align="center">
    <img src="https://github.com/dinghuahua/blog/blob/master/git-study/images/git6.png" width="60%">
</div>

                修改第一个edit commitid的message
                    git commit --amend -s 修改完成后,:wq 退出,
<div align="center">
    <img src="https://github.com/dinghuahua/blog/blob/master/git-study/images/git8.png" width="50%">
</div>

                继续下一个edit commitid的message
                    git rebase --continue
<div align="center">
    <img src="https://github.com/dinghuahua/blog/blob/master/git-study/images/git9.png" width="60%">
</div>

                git commit --amend 和 git rebase --continue 循环交替执行，直到所有的edit修改完
                修改就完成后,用git log 再看下:
<div align="center">
    <img src="https://github.com/dinghuahua/blog/blob/master/git-study/images/git10.png" width="60%">
</div>
         
                最后push 到远程仓库,所有的edit对应的commitid的message 就修改好了,-f强制推送
                    git push origin <you_branch_name> -f