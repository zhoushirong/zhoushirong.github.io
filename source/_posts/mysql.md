---
title: Mysql入门
tag: [mysql, 数据库]
date: 2016/12/25
category: 技术
---

Mysql 是最流行的关系型数据库管理系统，尤其是在Web应用方面。
Mysql,由瑞典MySQL AB公司开发，目前属于 Oracle 公司。MySQL 是一种关联数据库管理系统，关联数据库将数据保存在不同的表中，而不是将所有数据放在一个大仓库内，这样就增加了速度并提高了灵活性。
Mysql是开源的、免费的、支持大型的数据库
Mysql使用标准的SQL数据语言形式。
```html
ps: ${ xxx } 表示 xxx 是变量
```

### mysql安装

Mac 系统用 brew 安装mysql

安装mysql
``` html
brew update # 更新下brew
brew install mysql # brew安装 mysql
```

设置 MySQL 用户以及数据存放地址
``` html
$ unset TMPDIR

$ mysql_install_db --verbose --user=`whoami` --basedir="$(brew --prefix mysql)" --datadir=/usr/local/var/mysql --tmpdir=/tmp
```

忘记mysql数据库密码
``` sql
update user set authentication_string=password('my_password') where user='root';
```

可能遇到的问题

错误码：ERROR 1045 (28000)
``` html
cd /etc

sudo vim my.cnf

编辑如下代码到 my.cnf 文件,保存成功应该就可以了
[mysqld]
skip-grant-tables
lower_case_table_names=1
```

权限不足的时候可以创建一个账号
``` sql
CREATE USER 'golden'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON * . * TO 'golden'@'localhost';
FLUSH PRIVILEGES;
```

---

启动mysql
```shell
mysql.server start
sudo /etc/init.d/mysql start 

or

sudo /usr/local/mysql/support-files/mysql.server start;
```

开机启动mysql
``` html
/etc/init.d/mysqld start
```

通过sql文件执行脚本
``` sql
source  /Users/zsr/learn/crawler/sql/createtable.sql; 

or 

mysql -D samp_db -u root -p < createtable.sql
```

登录 mysql
``` shell
mysql -u ${ databasename } -p # 然后输入mysql密码
```

---

创建一个数据库，设置character是为了兼容汉字
``` sql
create database ${newdatabasename} character set gbk;
```

查看所有的数据库
``` sql
show databases;
```

删除数据库
``` sql
drop database ${databasename};
```

选中 testdb 数据库
``` sql
use ${databasename};
```

---

创建一张表
``` sql
use ${databasename}

create table students
（
	id int unsigned not null auto_increment primary key,
	name char(8) not null,
	sex char(4) not null,
	age tinyint unsigned not null,
	tel char(13) null default "-"
);
```

修改表名
``` sql
alter table ${oldtablename} rename to ${newtablename};
```

查看所有表
``` sql
show tables;
```

删除表
``` sql
drop table ${tabename};
```

显示数据表的属性，属性类型，主键信息
``` sql
show columns from students
```

---

查看列
``` sql
desc ${tablename};
```

添加列
``` sql
alter table ${tablename} add column ${newcolumnname} varchar(30);
```

删除列
``` sql
alter table ${tablename} drop column ${columnname};
```

修改列名
``` sql
alter table ${tablename} change ${ondcolumnname} ${newcolumnname} int; 
```

修改列属性
``` sql
alter table ${tablename} modify ${oldattr} char(80);
```

---

增加数据
``` sql 
insert into ${tablename} values (${column1}, ${column2}); /*如果自增id，则column1为0*/
```

修改数据
``` sql
update ${tablename} set ${attr}=${newAttr} where ${id=3}; /*id=3代表查询条件*/
```

查询数据
``` sql
select * from ${tablename} where ${id=3};
```

删除数据
``` sql
delete from ${tablename} where ${id=3};
```

---

详细的常用查询操作
1.查询从第n条开始的m条数据、asc 升序(desc 降序)
``` sql
select * from ${tablename} limit n,m;
select ${column1},${column2} from ${tablename} order by ${column} asc limit n,m
select ${column1},${column2} from ${tablename} order by ${column} desc limit n,m
```

查看数据库编码
``` sql
show variables like 'character%'; 
```

查看数据库位置
``` sql
show variables like 'datadir%'
```


备份数据
``` html
mysqldump -udbusername -pdbpwd dbname > ./epoos.sql
scp -r root@xxx.193.173.xx:/xxx/xxx/xxx/epoos.sql /Users/zsr/epoos 
```

还原数据
``` sql
mysql -h127.0.0.1 -uroot -p123456 epoos < epoos.sql
```

如果上面的还原功能不好使，可以
``` html
1.创建新数据库 newdb
2.use newdb
3.执行备份的sql文件
```

#### ubuntu安装mysql
```shell
sudo apt-get update 
sudo apt-get install mysql-server # 安装 mysql 服务端
mysql_secure_installation # mysql 安装安全配置向导，设置密码
```
执行安全配置向导可能报如下错误：
```shell
# 报错信息
Error: Access denied for user 'root'@'localhost'
```
解决方案：
```shell
sudo -iu root # 用 root 用户执行此命令即可
mysql_secure_installation

# 中文解释
1)为root用户设置密码；
2)删除匿名账号；
3)取消root用户远程登录；
4)删除test库和对test库的访问权限；
5)刷新授权表使修改生效。
```


#### 新建新用户
```shell
# 创建 dev 用户
mysql> CREATE USER dev@% IDENTIFIED BY 'Abc123456!';
# 给用户 dev 所有数据库的权限
mysql> grant all PRIVILEGES on *.* to 'dev'@'%' IDENTIFIED BY "Abc123456!";
# 刷新配置
flush privileges; 
```

#### 远程端口不通
```shell
# 测试端口是否通顺
telnet 10.216.8.142 3306
```
mysql 数据库经常会遇到本地能连通但是其它机器通过 ip 访问的时候就不通的情况。
排查可以从下面三种情形入手（具体方式可以网上搜一搜，很多，这里就不列了）

这种情形比较常见的原因有三个：
1.机器防火墙 3306 端口没有开
2.登录的数据库用户没有开 ip 访问的权限，找到user表，赋予其 % 权限。
3.数据库初始的时候地址没有注释掉 bind-address

```shell
# 这个文件配置可能在/etc/my.cnf/;/etc/mysql/my.cnf;也可能在 /etc/mysql/mysql.conf.d
# 具体情形根据系统有所不同，但是只需要找到 bind-address 将其注释掉即可
#bind-address		= 127.0.0.1
```


#### 卸载mysql

把下面几个目录全部删掉应该就可以完全卸载mysql了
值得注意的是，如果有数据库需要备份的，需提前做好备份。

```shell
rm -rf ~/Library/PreferencePanes/My*
sudo rm -rf /Library/Receipts/mysql*
sudo rm -rf /Library/Receipts/MySQL*
sudo rm -rf /var/db/receipts/com.mysql.*

sudo rm /usr/local/mysql
sudo rm -rf /usr/local/mysql*
sudo rm -rf /Library/StartupItems/MySQLCOM
sudo rm -rf /Library/PreferencePanes/My* 
```


### 传送门
https://dev.mysql.com/doc/refman/5.6/en/linux-installation.html