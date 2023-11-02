# Redis

Redis是一个使用ANSI C编写的开源、支持网络、基于内存、可选持久性的键值对存储数据库。

Redis不是简单的Key-Value数据库，还支持数据结构，例如：字符串、hash、列表、集合、带范围查询的排序集合、位图、超日志、带有半径查询和流的地理空间索引。

Redis具有内置的复制功能，解析执行Lua脚本，LRU缓存控制，事务和不同级别的磁盘持久性，并通过Redis Sentinel和Redis Cluster自动分区提供高可用性。

在大多数编程语言中都有一种数据结构：字典，例如代码`dict['key'] = "value"`中：

- dict是一个字典结构变量
- key是键名
- value是键值

Redis是REmote DIctionary Server（远程字典服务器）的缩写，它以字典结构存储数据，并允许其他应用通过TCP协议读写字典中的内容。

Redis字典中的键值除了可以是字符串，还可以是其它数据类型。其中比较常见的有：

| 类型     | 描述                                                               | 
|--------|------------------------------------------------------------------|
| String | 字符串                                                              |
| Hash   | 散列，类似js中的对象结构                                                    |
| List   | 列表，根据插入顺序的字符串元素的集合。它们基本上是链表                                      | 
| Set    | 未排序的字符串元素集合，集合中的数据不重复                                            | 
| ZSet   | 与Sets类似，但每个字符串元素都与一个称为分数的浮点值相关联。元素总是按它们的分数排序，因此与Sets不同，可以检索一系列元素 | 


Redis数据库中所有数据都存储在内存中，相对磁盘，内存的数据读写速度更快，所以通常用Redis做缓存数据库，在一台普通电脑上，Redis可以一秒内读写超过10万个键值。

将数据存储在内存中也有问题，比如程序退出后，内存中的数据会丢失。不过Redis提供了对持久化的支持，即可以将内存中的数据异步写入到硬盘中，同时不影响继续提供服务。

Redis虽然是作为数据库开发的，但是由于提供丰富的功能，越来越多人将其用作缓存、队列系统、发布订阅功能等。

## 安装

```shell
> docker search redis
> docker pull redis
# 查看拉取镜像是否成功
> docker images -a
# 启动
> docker run -d --name redis -p 6379:6379 redis
find / -name redis.conf 
# docker容器内的redis服务器建立连接 相当于redis-server [--port 6379 --host 127.0.0.1]
> docker exec -it redis redis-cli
# 查看版本号
> docker exec -it redis redis-server -v
Redis server v=7.2.1 sha=00000000:0 malloc=jemalloc-5.3.0 bits=64 build=6b587cfb378b5c1e
```

redis-cli是redis自带的基于命令行的redis客户端，运行redis-cli即可连接数据库，也可以指定服务器地址和端口连接：`redis-cli -h 127.0.0.1 -p 1234`。不出意外已经连接上redis数据库，退出quit。

映射文件配置

```shell
# 创建配置文件 关闭上面的redis,然后创建文件：etc/redis/6379.conf
# 文件内容去官网可以找到，需要对应版本。
# 文件内容修改 daemonize yes 后台运行、protected-mode no 关闭保护模式
# mkdir redis
# touch 6379.config 以端口号命名 
# 复制Redis配置文件: redis容器中赋值默认的redis配置文件到本地目录，方便编辑

# 进入交互式查找redis配置文件
> docker exec -it redis /bin/bash

#  查找默认配置文件
> find / -name redis.conf 
1) "dir"
2) "/data"

# 上面描述很有可能在data里面
> cat /data/redis.conf
cat: /data/redis.conf: No such file or directory

# 找不到了，那么就用上面自定义的redis配置文件，并将其挂载到容器内覆盖默认配置
# 退出交互式
> exit 
# 把上面容器停止删除
> docker run -d --name redis -p 6379:6379 -v



> docker run -it \
--name redis \
-p 6379:6379 \
--privileged \
-v /data/docker/redis/6379/config/redis.conf:/etc/redis/redis.conf \
-v /data/docker/redis/6379/data/:/data \
-v /data/docker/redis/6379/logs:/logs \
-d redis 

# vi 查找模式 /port 查找port

# 交互模式中 修改配置文件 下面只是个案例（没有尝试），下面重启就会失效
> config get port
1) port 
2) 6379

> config set port 7777
```

## Redis中的多数据库

一个Redis实例提供了多个用来存储数据的字典，客户端可以指定将数据存储在哪个字典中。这与我们熟知的在一个关系数据库中可以创建多个数据库类似，所有可以将其中每个字段都理解成一个独立的数据库。

Redis默认支持16个数据库，分别编号为0-15,Redis不支持自定义数据库名，因为每个数据库都以编号命名，所有开发者必须明确哪个数据库存放了哪些数据,可以通过配置参数databases修改支持的数据库个数

每个数据库都是独立的，也就是说你在0号数据库中插入的数据在1号数据库中访问不到.客户端与redis建立连接后自动选择0号数据库，我们可以使用select命令来更换数据库。

```shell
select 1; # 切换1号数据库
```

redis不支持为每个数据库设置不同的访问密码，所有一个客户端要么可以访问全部数据库，要么一个数据库也没有权限访问。

最重要的一点是多个数据库之间并不是完全隔离的，比如flushall命令可以清空一个redis实例中所有数据库中的数据。所以说这些数据库更像一个命名空间，而不适宜存储不同应用程序的数据，比如不适合使用0号数据库存储A应用数据，而是用1号数据库存储B应用数据，这是非常不推荐做法。

不同应用的应该使用不同的Redis实例存储输出。由于Redis非常轻量级，一个空的Redis占用的内存只有1MB作用，所以不同担心多个Redis实例会额外占用很多内存的问题。










