---
layout: default
title: Linux学习笔记(四)
date: 2018-06-14
tag: [linux, shell]
category: 笔记
---

接下来一段时间打算学一下linux
学习来源书本《Linux命令行与shell脚本编程大全 第三版》


### 一、SHELL环境变量

bash shell用一个叫做环境变量(environment variable)的特性来存储有关shell会话和工作环境的信息。（这也是它们被称作环境变量的原因）。这项特性允许你在内存中存储数据，以便程序或shell中运行的脚本能够轻松访问到它们。这也是存储持久数据的一种简便方法。

在bash shell中，环境变量分为两类：
```html
全局变量：对于shell会话和所有生成的子shell都是可见的。可用来进行父子shell程序通信。
局部变量：只对创建它们的shell可见。
```

#### 全局环境变量

```shell
env # 打印出所有的全局变量
printenv # 同上
printenv {变量名} # 打印出特定环境变量
echo ${变量名} # 同上
```

ps：在echo命令中，在变量名前加 $ 不仅能够显示变量当前的值，还能让变量作为命令行参数。

eg:

```shell
echo $HOME # 打印出HOME的值
ls $HOME # ls HOME值目录下的文件列表
```

#### 局部环境变量

Linux系统默认定义了标准的局部环境变量。
除此之外，用户也可以定义自己的局部变量，这些变量被称为 **用户定义局部变量**。

和全局变量不一样，Linux系统没有一个只显示局部环境变量的命令。


```shell
set # 会显示某个特定进程设置的所有环境变量（包括全局、局部、用户定义局部变量）
somekey=somevalue # 定义用户局部变量。注意:等号两边不能有空格、不能再子shell中引用
```

#### 用户自定义全局环境变量

很显然系统自带的全局环境变量、自带的局部环境变量以及用户定义局部变量并不能满足父子shell进程之间的通讯
因此，linux还允许用户设置自定义全局变量。

```shell
somekey=somevalue # 先创建一个局部环境变量
export somekey # 再通过export将其导入到全局变量变量。注意：不需要$符号。

export somekey=somevalue # 一键创建全局环境变量
```
特别注意：
1.在父进程中修改的全局变量会影响子进程中的该变量；
2.但是在子进程中修改该变量不会影响到父进程中的该变量。即使再通过export导出也不会影响父进程，只会影响当前子进程的子进程。

删除环境变量
```shell
unset somekey # 删除环境变量。注意：不需要$符号
```

注意：同创建环境变量一样，子进程中删除在父进程中export导出的全局环境变量不会影响到父进程。

#### 设置PATH环境变量

当在shell命令行界面中输入一个外部命令时，shell必须搜索系统来找到对应的程序。
PATH环境变量定义了用于进行命令和程序查找的目录。

eg:

```shell
$ echo $PATH # 输出系统环境变量
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/Wireshark.app/Contents/MacOS:/usr/local/mysql/bin
```
执行某个命令的时候，系统会依次从上面输出的6个目录中，查找可执行命令的程序。如果找不到就会报错。

用户添加自己的命令到系统环境变量中只需要使用如下命令，将可执行文件目录添加到原有的系统环境变量PATH后面。

```shell
$ PATH=$PATH:/home/xxx/scripts/bin
```

#### 可持续使用的自定义系统环境变量

自定义变量的方法可以按照前面说的定义用户局部系统变量、或者用export导出为全局系统变量。
但是，这种方式创建的变量是临时的，当前shell进程结束之后就会失效。

要想永久的保存自定义变量，可以根据shell的启动过程，修改其启动时需要读取命令的文件。
如下面几个文件。

```shell
/etc/profile # 系统默认的bash shell主启动文件，系统上每个用户登录都会执行此文件
~/.bash_profile
~/.bashrc
~/.bash_login
~/.profile
```

shell会按照下列顺序，运行第一个被找到的问题件，找到之后则忽略后面的

```shell
~/.bash_profile
~/.bash_login
~/.profile
```

注意：这个列表中没有~/.bashrc文件，这是因为该文件往往是在其它文件(如：.profile，也可能是.bash_profile)中被执行的。

#### 交互式shell进程

如果你的bash shell不是登录系统时启动的，那么你启动的shell叫做交互式shell。
交互式shell不会像登录shell一样运行，但它依然提供了命令行提示符来输入命令。

如果bash是作为交互式shell启动的，它就不会访问/etc/profile文件，只会检查用户HOME目录中的.bashrc文件。

#### 非交互式shell

系统执行shell脚本时用的就是非交互式shell。
不同于交互式shell的地方在于它没有命令行提示符。


#### 数组变量

环境变量可作为数组使用。
数组是能够存储多个值的变量。
这些值可以单独引用，也可以作为整个数组来引用。



















### 附录 - 默认环境变量

##### bash shell 支持的Bourne变量
变量|描述
-|-
CDPATH | 冒号分隔的目录列表，作为cd命令的搜索
HOME | 当前用户的主目录
IFS | sell用来将文本字符串分割成字段的一系列字符
MAIL | 当前用户收件箱的文件名(bash shell会检查这个文件，看看有没有新的邮件）
MAILPATH | 冒号分隔的当前用户收件箱的文件名列表(bash shell会检查列表中的每个文件，看看有没有新邮件）
OPTARG | getopts命令处理的最后一个选项参数值
OPTIND | getopts命令处理的最后一个选项参数的索引号
PATH | shell查找命令的目录列表，由冒号分隔
PS1 | shell命令行界面的主提示符
PS2 | sell命令行界面的次提示符


##### bash shell环境变量

除了默认的Bourme的环境变量，bash shell还提供一此 自有的变量

变量 | 描述
-|-
BASH | 当前shel实例的全路径名
BASH_ALIASES | 含有当前已设置别名的关联数组
BASH_ARGC | 含有传入子函数或shel脚本的参数总数的数组变量 
BASH_ARCV | 含有传入子函数或shell脚本的参数的数组变量 
BASH_CMDS | 关联数组，包含shell执行过的命令的所在位置 
BASH_COMMAND  | shell正在执行的命令或马上就执行的命令 
BASH_ENV | 设置了的话，每个bash脚本会在运行前先尝试运行该变量定义的启动文件 
BASH_EXECUTION_STRING | 使用bash -c选项传递过来的命令 
BASH_LINENO | 含有当前执行的shell函数的源代码行号的数组变量 
BASH_REMATCH | 只读数组，在使用正则表达式的比较运算符=~进行肯定匹配(positive match)时， 包含了匹配到的模式和子模式 
BASH_SOURCE | 含有当前正在执行的hel函数所在源文件名的数组变量 
BASH_SUBSHELL | 当前子shell环境的嵌套级别(初始值是0) 
BASH_VERSINFO | 含有当前运行的bash shell的主版本号和次版本号的数组变量 
BASH_VERSION | 当前运行的bash shell的版本号 
BASH_XTRACEFD | 若设置成了有效的文件描述符(0,1,2)则'set -x' 调试选项生成的跟踪输出可被重定向。通常用来将跟踪输出到一个文件中 
BASHOPTS | 当前启用的bash shell选项的列表 
BASHPID | 当前bash进程的PID 
COLUMNS | 当前bash shell实例所用终端的宽度 
COMP_CWORD | COMP_WORDS变量的索引值，后者含有当前光标的位置 
COMP_LINE | 当前命令行 
COMP_POINT | 当前光标位置相对于当前命令起始的索引 
COMP_KEY | 用来调用shell函数补全功能的最后一个键 
COMP_TYPE | 一个整数值，表示所尝试的补全类型，用以完成shell函数补全 
COMP_WORDBREAKS | Readline库中用于单词补全的词分隔字符 
COMP_WORDS | 含有当前命令行所有单词的数组变量 
COMPREPLY | 含有由shell函数生成的可能填充代码的数组变量 
COPROC | 占用未命名的协进程的I/O文件描述符的数组变量 
DIRSTACK | 含有目录栈当前内容的数组变量 
EMACS | 设置为't' 时，表明emacs shell缓冲区正在工作，而行编辑功能被禁止 
ENV | 如果设置了该环境变量，在bash shell脚本运行之前会先执行已定义的启动文件(仅用于当bash shell以IPOSIX模式被调用时) 
EUID | 当前用户的有效用户ID (数字形式) 
FCEDIT | 供fc命令使用的默认编辑器 
FIGNORE | 在进行文件名补全时可以忽略后缀名列表，由冒号分隔 
FUNCNAME | 当前执行的shell函数的名称

**续**

变量 | 描述
-|-
FUNCNEST | 当设置成非零值时，表示所允许的最大函数嵌套级数(一旦超出，当前命令即被终止）
GLOBIGNORE | 冒号分隔的模式列表，定义了在进行文件名扩展时可以忽略的一组文件名
GROUPS | 含有当前用户属组列表的数组变量
histchars | 控制历史记录扩展，最多可有3个字符
HISTCMD | 当前命令在历史记录中的编号
HISICONTROL | 控制哪些命令留在历史记录列表中
HISTFILE | 保存shell历史记录列表的文件名(默认是bash history)
hISTFILESIZe | 最多在历史文件中存多少行
HISTTIMEFORMAT | 如果设置了且非空，就用作格式化字符串，以显示bash历史中每条命令的时间戳
HISTIGNORE | 由冒号分隔的模式列表，用来决定历史文件中哪些命令会被忽略
HISTSIZE | 最多在历史文件中存多少条命令
HOSTFILE | shell在补全主机名时读取的文件名称
HOSTNAME | 当前主机的名称
HOSTTYPE | 当前运行bash shell的机器
IGNOREEOF | sell在退出前必须收到连续的BOF字符的数量(如果这个值不存在，默认是1)
INPUTRC | Readline 初始化文件名(默认是.inputrc)
LANG | shell的语言环境类别
LC_ALL | 定义了一个语言环境类别，能够覆盖LANG变量
LC_COLLATE | 设置对字符串排序时用的排序规则
LC_CTYPE | 决定如何解释出现在文件名扩展和模式匹配中的字符
LC_MESSAGES | 在解释前面带有S的双引号字符串时，该环境变量决定了所采用的语言环境设置
LC_NUMERIC | 决定着格式化数字时采用的语言环境设置
LINENO | 当前执行的脚本的行号
LINES | 定义了终端上可见的行数
MACHTYPE | 用“CPU-公司-系统”(CPU-company-system) 格式定义的系统类利
MAPFILE | 一个数组变量， 当mapfile命令未指定数组变量作为参数时，它存储了了mapfile所读入的文本
MAILCHECK | shell查看新邮件的频率(以秒为单位，默认值是60)
OLDPWD | shell之前的工作目录
OPTERR | 设置为1时，bash sell会显示getopts命令产生的错误
OSTYPE | 定义shell所在的操作系统
PIPESTATUS | 含有前台进程的退出状态列表的数组变量
POSIXLY_CORRECT | 设置了的话，bas会以POSsx模式启动
PPID | bash sell父进程的PID
PROMPT_COMMAND | 设置了的话，在命令行主提示符显示之前会执行这条命令
PROMPT_DIRTRIM | 用来定义当启用了\w或\W提示符字符串转义时显示的尾部目录名的数量。被删除的目录名会用一组英文句点替换
PS3 | select命令的提示符
PS4 | 如果使用了bash的一x选项，在命令行之前显示的提示信息
PWD | 当前工作目录
RANDOM | 返回一个0~ 32767的随机数(对其的赋值可作为随机数生成器的种子)
READLINE_LINE | 当使用bind -x命令时，存储Readline缓冲区的内容
READLINE_POINT | 当使用bind -x命 令时，表示Readine缓冲区内容插人点的当前位置
REPLY | read命令的默认变量
SECONDS | 自从shell启动到现在的秒数(对其赋值将会重置计数器)
SHELL | bash shell的全路径名
SHELLOPTS | 已启用bash shell选项列表，列表项之间以冒号分隔
SHLVL | shell的层级;每次启动一个新bash shell,该值增加1
TIMEFORMAT | 指定了shell的时间显示格式
TMOUT | select和read命令在没输人的情况下等待多久(以秒为单位)。默认值为0，表示无限长
TMPDIR | 目录名，保存bash shell创建的临时文件
UID | 当前用户的真实用户ID (数字形式)







