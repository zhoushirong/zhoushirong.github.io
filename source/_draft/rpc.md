---
title: rpc基础
date: 2018/07/31
tag: rpc thrift nodejs
---


rpc是什么？
```html
rpc(remote procedure call)远程过程调用，是一个计算机通信协议。
该协议允许运行在一台计算机的程序调用另一台计算机的子程序。
如果涉及的软件采用面向对象编程，那么远程过程调用亦可称作远程调用或远程方法调用。
```

什么是IDL？
```html
IDL（Interface Description Language）接口描述语言。
是一个描述软件组件接口的语言“规范”。
为了不同服务器能够访问服务器，需要定制一些标准化的RPC，大部分采用的接口描述语言。
IDL采用一种中立的方式来描述接口，使得不同平台上运行的对象和用不同语言编写的程序可以相互通信交流。
```

thrift 是什么？
```html
thrift是一种接口描述语言和二进制通讯协议，它被用来定义和创建跨语言的服务。
它被当做一个远程过程调用（RPC）框架使用。
早期由Facebook“为大规模跨语言服务”而开发的。现在是Apache软件基金会的开源项目。
```

thrift与IDL
```html
thrift采用IDL来定义通用的服务接口，然后通过thrift提供的编译器，可以将服务接口编译成不同语言编写的代码，通过这种方式来实现跨语言通信。
thrift是一个基于IDL生成跨语言的RPC clients and services。
```

thrift使用？
```html
1.安装
https://thrift.apache.org/docs/install/os_x
```

##### 安装遇到问题：
Couldn't find libtoolize!
解决：
brew reinstall libtool;

问题：
configure: error: Bison version 2.5 or higher must be installed on the system!
解决：
brew install bison
export PATH=/usr/local/Cellar/bison/3.0.5/bin:$PATH

问题：make报错
'boost/tokenizer.hpp' file not found
解决：
brew install boost

问题：make报错
make[3]: /usr/local/bin/bundle: No such file or directory
解决：
…解决不了。。。放弃了

不可能的，这条路走不通了，要不回去重新用brew安装一下试试？
```shell
brew install thrift
```

好吧，安装成功了。（明明记得之前安装会报错的，唯一的解释是，上面的安装那些包还是有用的。）

---

要创建一个thrift服务，必须写一些thrift文件来描述它，为目标语言生成代码，并且写一些代码来启动服务器及从客户端调用它。

举例：
```java
enum PhoneType {
 HOME,
 WORK,
 MOBILE,
 OTHER
}

struct Phone {
 1: i32 id,
 2: string number,
 3: PhoneType type
}
```

支持的数据类型
```html
bool 布尔型
i8(byte) ８位整数
i16  16位整数
i32  32位整数
i64  64位整数
double 双精度浮点数
string 字符串
binary blob(字节数组)
list<i16> List集合，必须指明泛型
map<string, string> Map类型，必须指明泛型
set<i32> Set集合，必须指明泛型 
thrift构建
thrift --gen <language> <Thrift filename>
如：
thrift -r --gen js:node tutorial.thrift
```

生成的类包括5部分
```html
1.接口类型，默认名称都是IFace。
这个接口类型被服务端和客户端共同使用。
服务端使用它来做顶层接口，编写实现类。
客户端代码使用它作为生成代理的服务接口。
会自动生成同步调用和异步调用两个接口。

2.客户端类型，一个同步调用的客户端Client，一个异步调用的客户端AsyncClient。
3.Processor用来支持方法调用，每个服务的实现类都要使用Processor来注册，这样最后服务端调用接口实现时能定位到具体的实现类。
4.方法参数的封装类，已“方法名_args”命名
5.方法返回值的封装类，以方法名 _result 命名
```





传送门：
thrift的IDL
http://thrift.apache.org/docs/idl

NODEJS实例传送门：
https://thrift.apache.org/tutorial/nodejs

dubbo传送门
https://github.com/dubbo/dubbo2.js