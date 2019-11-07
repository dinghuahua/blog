## git介绍
    1、分布式版本系统的最大好处之一是在本地工作完全不需要考虑远程库的存在，也就是有没有联网都可以正常工作，而SVN在没有联网的时候是拒绝干活的！当有网络的时候，再把本地提交推送一下就完成了同步，真是太方便了！
    2、GitHub给出的地址不止一个，还可以用https://github.com/michaelliao/gitskills.git这样的地址。实际上，Git支持多种协议，默认的git://使用ssh，但也可以使用https等其他协议。
    3、使用https除了速度慢以外，还有个最大的麻烦是每次推送都必须输入口令，但是在某些只开放http端口的公司内部就无法使用ssh协议而只能用https

## git 名词扫盲

    工作区   即本地工作目录 不包括.git
    暂存区   add后 git status 又是也称作缓存区
    版本库   commit后  即当前分支的本地仓库  常用HEAD 表示
    远程仓库  push后   将版本库(本地仓库)提交到远程对应的分支 常用orgin 表示

    在Git中，用HEAD表示当前版本，上一个版本就是HEAD^，上上一个版本就是HEAD^^，当然往上100个版本写100个^比较容易数不过来，所以写成HEAD~100



## git 常见缩写
    -r origin
    -d delete
    -b branch
    -f force

## git 常用操作 
    git config -list                        查看配置   包括全局 和本地仓库  
    git config --local --list               查看本地仓库配置
    git config --global --list              查看全局的配置信息：
    git help config/merge                   查看帮助文件
    git config core.editor 编辑器            === git commit 没有添加描述时  打开的编辑器
    git config merge.tool                   工具   合并冲突时用什么工具进行对比
    git config  --global user.name 'name'   全局设置仓库的用户名
    git config  user.email 'email'          局部仓库设置邮箱
    git config --global color.ui true       Git显示颜色，会让命令输出看起来更醒目 
    git init                                本地项目初始化为git管理
    git remote                              查看远程仓库
    git remote -v                           查看远程仓库显示更详细的信息，fetch(抓取) push(推送)  也可以作为查看本地对远程的操作权限  
    git log                                 查看提交记录

## git 工作流程

    git 工作区 暂存区 版本库 之间的关系
<img src="https://github.com/dinghuahua/blog/blob/master/git-study/images/git4.png" width="60%">  

## 远程有仓库，本地创建分支并推送到远端
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
    命令行中添加的关联,其实修改的是config文件~
        git push --set-upstream origin dev分支名
    如果本地本地推送到远程后，不添加关联关系，在 git pull,git push 需要指定远程分支名称，不添加关联关系，那么新建的分支配置也不会显示在config文件中
        git push origin debug分支名称
    git  add 
    git commit
    git commit -am '' ==>add 和commit 的合并写法
    git push
    git pull
    git fetch
[git pull 和 git fetch 的区别](https://blog.csdn.net/weixin_41975655/article/details/82887273)

添加关联关系git push问题的解决
<img src="https://github.com/dinghuahua/blog/blob/master/git-study/images/git1.png" width="40%">

不添加关联关系git push问题的解决
<img src="https://github.com/dinghuahua/blog/blob/master/git-study/images/git1.png" width="40%">

config文件前后对比 
<img src="https://github.com/dinghuahua/blog/blob/master/git-study/images/git2.png" width="60%">
    
    合并分支 切换到接收修改的分支master,将feature分支的代码合并到master
        git merge feature
            fast-forward 默认
                fast-forward式的合并，且合并完之后的视图为扁平状，看不出develop分支开发的任何信息。
            –no-ff
                其作用是：要求git merge即使在fast forward条件下也要产生一个新的merge commit。其目的在于，希望保持原有“feature branches”整个提交链的完整性。
    删除本地分支
        git branch -d debug
    删除远程分支
        git push origin --delete debug   或者 git push origin -d debug
    强推到远程 
        git push origin HEAD --force

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
            如果使用git reset –hard 将版本库，暂存区和工作区的内容全部重置为某个commit的状态。之后的commit不会保留。
        revert比reset更加温柔一点，回滚到某次commit且该commit之后的提交记录都会保留，并且会在此基础上新建一个提交。对于已经push到服务器上的内容作回滚，推荐使用revert。
    使用git diff查看各个区之间的差异
        git diff	        比较的是工作区和暂存区的差别
        git diff –-cached	比较的是暂存区和版本库的差别
        git diff HEAD       可以查看工作区和版本库的差别

## git 常见问题解答   

    把a.txt改名为b.txt
        git mv a.txt b.txt 
    从暂存区删除文件，工作区不删除。
        git rm --cached "文件路径"
    从暂存区、工作区 删除文件（不会回收到垃圾桶）
        git rm --f "文件路径"
    git clean -d -f 删除未跟踪的目录和文件，会删除工作区以及暂存区的文件（会回收到垃圾桶）
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


## 本地创建创建两个git账户
    背景：公司一个gitub账号，个人一个github账户，想在git上同时使用，两者互不干扰。
          即提交代码时想要分github账号进行提交，或者clone项目时也想分账号clone,故需要在本地配置两个github账号，如不介意在提交代码、clone项目时账户混用，请忽略此小节。
    思路：
        如果是单用户(single-user)，会默认拿id_rsa与你的github服务器的公钥对比；
        如果是多用户(multi-user)， 如user1(dinghh公司,默认),user2(dinghuahua个人),那么就不能用在user2的身上了，这个时候就要配置一下了;
        本地管理两个SHH key
    解决方案：
        注意使用github官方的bash，避免在新秘钥添加到SSH agent中时，出现很多问题。

###### 新建user2(dinghuahua)的SSH Key
        如默认账户也没有SSH Key，那么默认账户也需要建立SSH Key，默认账户已有SSH Key,也有公钥、私钥文件，故不再这里进行演示了。
        cd ~/.ssh                                  # 切换到C:\Users\dingding\.ssh
        ssh-keygen -t rsa -C "huahuajxnu@163.com"  # user2新建的SSH key

        不要一路回车，在第一个对话的时候输入重命名（id_rsa_huahuajxnu,公司使用默认的id_rsa），这样user2账户就会生成公钥、私钥2个文件

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
        这里是将GitHub SSH仓库地址中的git@github.com整体替换成新建的Host别名如：huagithub，
        那么原地址是：git@github.com:dinghuahua/blog.git，替换后应该是：huagithub:dinghuahua/blog.git

<div align="center">
    <img src="https://github.com/dinghuahua/blog/blob/master/git-study/images/git11.png" width="40%">
</div>

###### GitHub后台 部署SSH key
        添加 新生成的~/.ssh/id_rsa_huahuajxnu.pub 的公钥
        分别登陆两个github账号，进入Personal settings –> SSH and GPG keys：

<div align="center">
    <img src="https://github.com/dinghuahua/blog/blob/master/git-study/images/git12.png" width="40%">
</div>

###### 测试
        cd C:\Users\dingding\.ssh 
        ssh -T git@github.com
        
        Hi dinghh! You've successfully authenticated, but GitHub does not provide shell access.

        Administrator@FANGPENG /e/work
        ssh -T huagithub

        Hi dinghuahua! You've successfully authenticated, but GitHub does not provide shell access.
###### 多github账户的使用
        1、clone到本地
            (1)原来的写法：
                git clone git@github.com:user1的用户名(dinghh)/blog.git
                git clone git@github.com:user2的用户名(huahuajxnu)/blog.git
            (2)现在的写法：
                git clone git@github.com:user1的用户名(dinghh)/blog.git
                git clone huagithub(config文件中对user2配置的HOST):user2的用户名/blog.git
        2、分项目的配置用户名邮箱：
                配置用户名和邮箱（在某个特定的项目中）,如果不配置使用的则是全局的用户名和邮箱
                作用：可以在github 项目中查看到某行代码是由谁(suer.name)提交的
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

###### 过程中使用的账户疑惑解答
    dinghh              是公司github账户名
    dinghuahua          是个人github账户名
    huahuajxnu@163.com  个人账户github使用的邮箱
    huagithub           本地为user2起的HOST名字
    huahuajxnu          本地为user2起的id_rsa_huahuajxnu

# git 高级操作  

## 分支缓存  主要用于多分支同时开发时  
    git stash                               将本地当前分支暂存起来
    git stash list                          查看当前分支暂存
    git stash apply                         恢复暂存的内容到工作区，但是恢复后，stash内容并不删除，你需要用git stash drop 来删除
    git stash apply stash@{0}               恢复指定的stash  可以多次stash，恢复的时候，先用git stash list查看，然后恢复指定的stash
    git stash drop                          暂存区删除
    git stash pop                           恢复的同时把stash内容也删了     

## tag  标签
    git tag v1.0                              打一个tag   默认标签是打在最新提交的commit上的
    git tag -a <tagname> -m '说明' commit_id  创建带有说明的标签，用-a指定标签名，-m指定说明文字   改命令 commit_id   可有可无  木有就默认最后一次commit
    git push orgin <tagname>                  推送本地tag到远程
    git push orgin --tags                     推送本地的所有tag 到远程
    git tag -d <tagname>                      删除本地tag
    git push origin :refs/tags/<tagname>      删除远程标签
    git tag                                   查看所有tag  标签不是按时间顺序列出，而是按字母排序的
    git tag v1.0 commit_id                    对历史的某一个commit 打tag
    git show <tagname>                        查看标签信息
    
## git命令配置别名
    git config alias.别名 本身的命令
            eg: git config --global alias.unstage 'reset HEAD'
                git config --global alias.ci commit 
## git 远程没有仓库，将本地仓库推送到远程

###### git给远程库起的默认名称是origin,如果有多个远程库，我们需要用不同的名称来标识不同的远程库, 这样的话，我们的本地库就可以同时与多个远程库互相同步：
    git remote add origin 远程仓库地址           为本地仓库设置远程仓库的关联
    git remote rm origin                        删除本地仓库设置的origin远程仓库的关联

###### 实现fork的项目和原项目同步的方法是利用本地的项目作为“中转”，为本地的项目添加两个远程信息，拉取原仓库的新代码，push到自己的仓库上，就达到了“同步”。
    git remote add 仓库名字 其它项目仓库地址         为本地项目设置其它远程项目仓库地址   并可以随意设置仓库名字
    git fetch 仓库名字                              拉取仓库名字对应的远程项目
    git push  本地设置的仓库名字
    git pull  仓库名字  分支
    git merge 仓库名字/master                       将仓库名字对应的远程项目的master分支合并到本地项目 
    git push                                       把当前本地分支推送到远程。
        推送分支，就是把该分支上的所有本地提交推送到远程库。推送时，要指定本地分支，这样，Git就会把该分支推送到远程库对应的远程分支上：
    git push origin master                         把本地master分支的最新修改推送至GitHub  推送其它分支 git push origin dev
    git push -u origin master                      由于远程库是空的，我们第一次推送master分支时，加上了-u参数，
                                                   Git不但会把本地的master分支内容推送的远程新的master分支，还会把本地的master分支和远程的master分支关联起来，在以后的推送或者拉取时就可以简化命令。
                                                   
 # git中使用https和ssh协议的区别
 ## git, https, ssh, 心得
 ### http好还是ssh好?
    git可以使用四种主要的协议来传输资料: 本地协议（Local），HTTP 协议，SSH（Secure Shell）协议及 git 协议。其中，本地协议由于目前大都是进行远程开发和共享代码所以一般不常用，而git协议由于缺乏授权机制且较难架设所以也不常用。
    
    最常用的便是SSH和HTTP(S)协议。git关联远程仓库可以使用http协议或者ssh协议。
    
    HTTPS优缺点
        优点1: 相比 SSH 协议，可以使用用户名／密码授权是一个很大的优势，这样用户就不必须在使用 Git 之前先在本地生成 SSH 密钥对再把公钥上传到服务器。 对非资深的使用者，或者系统上缺少 SSH 相关程序的使用者，HTTP 协议的可用性是主要的优势。 与 SSH 协议类似，HTTP 协议也非常快和高效
        
        优点2: 企业防火墙一般会打开 80 和 443 这两个常见的http和https协议的端口，使用http和https的协议在架设了防火墙的企业里面就可以绕过安全限制正常使用git，非常方便
        
        缺点: 使用http/https除了速度慢以外，还有个最大的麻烦是每次推送都必须输入口令. 但是现在操作系统或者其他git工具都提供了 keychain 的功能，可以把你的账户密码记录在系统里，例如OSX 的 Keychain 或者 Windows 的凭证管理器。
    
    SSH的优缺点
        优点1: 架设 Git 服务器时常用 SSH 协议作为传输协议。 因为大多数环境下已经支持通过 SSH 访问 —— 即时没有也比较很容易架设。 SSH 协议也是一个验证授权的网络协议；并且，因为其普遍性，架设和使用都很容易。
        缺点1: SSH服务端一般使用22端口，企业防火墙可能没有打开这个端口。
        
        缺点2: SSH 协议的缺点在于你不能通过他实现匿名访问。 即便只要读取数据，使用者也要有通过 SSH 访问你的主机的权限，这使得 SSH 协议不利于开源的项目。 如果你只在公司网络使用，SSH 协议可能是你唯一要用到的协议。 如果你要同时提供匿名只读访问和 SSH 协议，那么你除了为自己推送架设 SSH 服务以外，还得架设一个可以让其他人访问的服务。
    
    总结
        HTTPS利于匿名访问，适合开源项目可以方便被别人克隆和读取(但他没有push权限)；毕竟为了克隆别人一个仓库学习一下你就要生成个ssh-key折腾一番还是比较麻烦，所以github除了支持ssh协议必然提供了https协议的支持。
        
        而SSH协议使用公钥认证比较适合内部项目。 当然了现在的代码管理平台例如github、gitliab，两种协议都是支持的，基本上看自己喜好和需求来选择就可以了。
        
    简单理解ssh协议
        ssh的协议理解起来比https简单多了，大家可以参考   [阮一峰老师的这篇文章SSH原理与运用](http://www.ruanyifeng.com/blog/2011/12/ssh_remote_login.html)  和 我的这篇文章ssh建立通道和认证原理。
    
    总结来看，就是SSH协议使用目前已经比较成熟的RSA这类非对称加密技术来实现了安全秘钥的协商: 目标主机把自己的公钥发送给客户端，客户端用公钥加密 一些东西 之后传给服务器，服务器用RSA私钥从中解出 一些东西，保证了 一些东西 防篡改、防泄密，最终协商出只有双方才知道的通信密钥。
    
    github上使用ssh协议
        如果要使用ssh协议来克隆或者push github上的代码，则git程序会采用ssh的校验机制。而由于github上所有仓库都是采用共用git账号体系的方式, 是无法用git用户登录github服务器的。各个用户只能通过公钥认证的方式使用此SSH账号访问版本库。 因此，你在执行 git clone 命令之前，必须确保已经把ssh公钥放置到了github服务器上。
    
    生成公钥可以看这里: github官方公钥配置教程
    
    RSA公钥生成后，可以用mac上的拷贝命令，把公钥拷贝到剪切板:
 ```shell
    # Copies the contents of the id_rsa.pub file to your clipboard
    # pbcopy < ~/.ssh/id_rsa.pub
  ```
    然后，去github上把这个公钥拷贝到网站的个人配置中（相当于在github服务器的~/.ssh/authorized_keys ），接下来就能愉快的进行克隆。
    
    如果远程主机是自己可以控制的机器，也可以这样:
    
    ssh-copy-id user@host
    或 
    scp -P 22 id_rsa.pub root@192.168.1.77:/root/.ssh/authorized_keys 
    或追加
    cat ~/.ssh/id_dsa.pub|ssh -p 22 root@192.168.1.91 `cat - >> ~/.ssh/authorized_keys`
    注意一点: 当你把公钥设置到github上时，你会在UI界面上看到一个 fingerprint 的指纹，这个指纹其实就是你的公钥的指纹。你可以对比这个指纹是否跟你本机的公钥指纹相同，尽量把github上不熟悉的公钥都删掉
    
    公钥指纹可以参考这篇文章:ssh建立通道的过程和认证原理
    
 ####   HTTPS协议如何保存凭证信息
    HTTPS认证方式虽然需要输入账户密码，但现在也不需要每次都输入。这个凭据保存需要依赖一个凭据管理器，每个操作系统平台都有自己的凭据管理器。可以参考github官方提供的教程来配置
    
    我这里介绍一个git的凭据管理方式:
    
    # 建立凭据文件
    $ touch ~/.git-credentials
    $ vim ~/.git-credentials
    在文件中加入带凭据的url信息:
    
    https://{username}:{passwd}@github.com
    然后告诉git使用这个凭据管理器:
    
    $ git config --global credential.helper store
    上面命令会在git配置文件 ～/.gitconfig 中设置上一个凭据地址:
    
    [credential]
        helper = store
    refer
    git之ssh和https密码配置
    1223123

