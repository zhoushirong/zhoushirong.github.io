---
title: 常用的git命令
date: 2018/01/10
tag: git
category: 技术
---

git是一种分布式版本管理工具，他有着强大的开源社区github，结合smartgit能够快速、高效、准确的对分支进行切换。
但是如果仅仅只是使用smartgit图形界面有时候也很不方便，至少在服务器上就没招了，因此了解一些git bash的基本命令是十分必要的。
接下来会介绍一些常用的基本的git bash命令。

### 配置git用户名和邮箱

``` shell
git config user.username "用户名" 

git config user.email "邮箱"
```

### 生成ssh-key

``` shell
zsr :: ~ ‹master*› % ssh-keygen                                                                 
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/zsr/.ssh/id_rsa): /Users/zsr/.ssh/githubsshkey # 填写路径
Enter passphrase (empty for no passphrase): # 密码可为空
Enter same passphrase again: # 密码可为空
Your identification has been saved in /Users/zsr/.ssh/githubsshkey.
Your public key has been saved in /Users/zsr/.ssh/githubsshkey.pub.
The key fingerprint is:
SHA256:Va57YAfyxN86cD5a1ejR6imhQiJuM/2IeTyK5FI+W+4 zsr@zsr.local
The key's randomart image is:
+---[RSA 2048]----+
|            .    |
|         . o     |
|        . = .    |
|         = + . + |
|        S * + = o|
|  . . . .. B.+ o |
| o...+ o  ..B.o  |
|.oo+=o=.. .+.+ . |
| .+=E=.o...  .o  |
+----[SHA256]-----+
```

然后根据提示连续回车即可在/Users/zsr/.ssh 目录下得到githubsshkey 和githubsshkey.pub 
其中githubsshkey.pub文件里面存放的就是我们要使用的public key。


### 生成多个ssh-key

要生成多个key重复上面操作即可，生成之后再.ssh目录下创建一个config文件，并配置私钥(没有.pub的那个文件)的相对路径
``` shell
Host github.com
User zhoushirong
IdentityFile ~/.ssh/githubsshkey
```

### git 常用命令

``` shell
git clone git仓库地址 # 从git仓库拉取git代码到本地

git branch # 列出本地分支

git branch -r # 列出远程分支

git branch -a # 列出本地和远程分支

git branch 分支名 # 创建一个分支（*只是创建，不切换）

git branch -d | -D 分支名 # 删除本地分支

git branch -d | -D  -r 分支名 # 删除远程分支

git checkout 分支名 # 拉取远程分支

```


### git commit && push

``` shell
git commit # 提交缓存区里面的文件

git commit -m "提交描述信息"

git push # 将本地仓库修改推送到服务器上的仓库

git push origin develop#— 将新分支push到远程分支

git push --set-upstream origin develop#— 将新分支push到远程分支并与之关联起来
```

### git 合并a 分支到 b分支

step1:

``` shell
git checkout b
```

step2:

``` shell
git merge a
```

### git查看log

step1:
``` shell
git log —— 按提交时间列出所有的更新

git log --pretty # pretty确定输出格式

git log --pretty=oneline # 日志简化版，只有commit message 和 hash

git log --pretty=oneline 文件名 # 显示某一个文件的git日志

git log -p -2 # -p 选项展开显示每次提交的内容差异，用 -2 则仅显示最近的两次更新：
```


### gitignore

有时候会遇到加入.gitignore文件的时候无效的问题，这个是因为某些文件已经被纳入了版本库

解决办法：

``` shell
git rm -r --cached .

git add .

git commit -m 'clean commit messages'

git push
```

### git撤销修改

git有四个区：工作区（Working Area）、暂存区（Stage）、本地仓库（Local Repository）、远程仓库（Remote Repository）
git有五种状态：未修改（Orgin）、已修改（Modified）、已暂存(Staged)、已提交（Committed）、已推送（Pushed）

1.已修改，未暂存
``` shell
git diff # 查看修改
git checkout . # 撤销修改(方法一)
git reset --hard # 撤销修改(方法二)
```

2.已暂存
``` shell
git add . # 加入暂存
git diff --cached #  查看修改

git reset # 把修改退回到git add .之前
git checkcout . # 撤回已修改，未缓存状态

git reset --hard # 等同于上面两个命令的组合
```

3.已提交，未推送
``` shell
git commit -m 'commit message' # 提交修改
git diff master orgin/master # 查看修改
git reset --hard orgin/master # 撤回修改（orgin/master代表远程仓库，相当于从远程仓库把代码取回来）
```

4.已推送的代码撤销
``` shell
git reset --hard HEAD^ # 恢复本地仓库
git push -f # 强制push到远程仓库
```


### git push提示没有权限

```shell
zsr@zsr:~/wywork/epay% git push
git@g.hz.netease.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

解决办法
```shell
ssh-add -l
# Then, if you don't see your key listed, add it with:
ssh-add ~/.ssh/identity # 生成的私钥
```

### 提示DNS欺骗检测

```shel 
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@       WARNING: POSSIBLE DNS SPOOFING DETECTED!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
The ECDSA host key for [g.hz.netease.com]:22222 has changed,
and the key for the corresponding IP address [59.111.178.110]:22222
is unknown. This could either mean that
DNS SPOOFING is happening or the IP address for the host
and its host key have changed at the same time.
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the ECDSA key sent by the remote host is
SHA256:iktCbxKzaP13xO9iY/5B9tkuIYE9BZfC31uW1Z6F4YQ.
Please contact your system administrator.
Add correct host key in /Users/zsr/.ssh/known_hosts to get rid of this message.
Offending ECDSA key in /Users/zsr/.ssh/known_hosts:20
ECDSA host key for [g.hz.netease.com]:22222 has changed and you have requested strict checking.
Host key verification failed.
fatal: Could not read from remote repository.
```

出错原因：
```shell
know_hosts 
# ssh登录的时候，当远程主机的公钥被接受以后，就会保存远程主机的公钥到此文件
# 出错的原因可能是公钥和对应的主机对应不上了。
```

解决办法
```shell
# 删除~/.ssh/known_hosts里面对应的公钥条目、或者直接删除此文件
rm -rf ~/.ssh/known_hosts
```



### 传送门

[https://git-scm.com/book/zh/v1/起步-关于版本控制](https://git-scm.com/book/zh/v1/%E8%B5%B7%E6%AD%A5)

