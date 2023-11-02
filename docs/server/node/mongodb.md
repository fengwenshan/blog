# Mongodb

## 安装

环境CentOS 7, docker

```shell
# 查看ip 大写的i
> hostname -I 
# 切换yum 阿里源
> yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
# 查找安装包 ce 社区版
> yum list docker-ce
# 安装
> yum install docker-ce
# 启动docker
# systemctl enable docker 开机自启
# systemctl stop docker 停止
# systemctl restart docker 重起
> systemctl start docker
# 查看版本号
> docker version
# 查询mongodb镜像
> docker search mongo
# 拉取docker镜像
> docker pull mongo:latest
# 查看容器运行帮助
> docker run -h
-i 表示以交互模式运行容器，通常与-t结合使用
-t：为容器重新分配一个伪输入终端，通常与-i结合使用
-d：后台运行容器，并返回容器 ID，即启动守护式容器 (这样创建的容器不会分配一个伪输入终端，如果是以-it两个参数启动，启动后则会分配一个伪输入终端)
-p：指定端口映射，格式为：-p 主机(宿主机)端口:容器映射端口，可以使用多个-p做多个端口映射
-v：指定挂载主机目录 / 文件 到容器目录 / 文件 上，即挂载容器数据卷，格式为：-v 主机(宿主机)目录/文件的绝对路径:容器内目录/文件的绝对路径[:读取权限]，可以使用多个-v做多个目录或文件映射，默认为rw读写模式，ro表示只读。
  rw读写模式：表示宿主机能对数据卷进行读取和更改，容器也能对其进行读取和更改。
  ro表示只读：表示宿主机能对数据卷进行读取和更改，容器只能对其进行读取不能更改。
  --name：为创建的容器指定一个名称，格式为：--name=容器名称
# 运行容器 -p 映射容器服务的27017端口到宿主机的27017端口 --auth 需要密码才能访问
> docker run -itd --name mongo -p 27017:27017 mongo --auth
eac3ccc28a1280a2983277e053adb03b3d0c430943f08eb24e449b4a39de4ee9
# 以exec方式进入容器内并以命令行交互
> docker exec -it mongo mongosh
# 以 attach方式进入容器：
# docker attach 容器id/容器名称
# 如果不想进入容器，直接获取相关指令的运行结果，可在后面填写操作指令：
# docker exec -it 容器id/容器名称 相关命令
#     exec：是在容器中打开新的终端，并且可以启动新的进程 (推荐)
#     attach：是直接进入容器启动命令的终端，不会启动新的进程
# 退出容器（exit会停止停止容器）， ctrl + p +q 退出就不会停止
# exit 
# 切换admin库操作
text> use admin
switched to db admin
# 【user:‘root’ 】：用户名:root
# 【pwd:‘root23’】：密码为:root123
# 【role:‘userAdminAnyDatabase’】：只在admin数据库中可用，赋予用户所有数据库的userAdmin权限
# 【db: ‘admin’】：可操作的数据库
# 【‘readWriteAnyDatabase’】：赋予用户读写权限
# dbAdmin：允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问system.profile
text> db.createUser({ user:'root',pwd:'123456',roles:[ { role:'userAdminAnyDatabase', db: 'admin'},'readWriteAnyDatabase']}); 
{ ok: 1 }
```

## NoSQL

传统的关系型数据库在存储及处理数据的时候受到很大挑战，其中主要有以下几点

- 难以应对每秒上万次的高并发数据写入
- 查询上亿量级数据的熟读及其缓慢
- 分库、分表形成的字到达一定规模后难以进一步扩展
- 分库、分表的规则可能会因为需求变更而发生变更
- 修改表结构困难

传统的数据库由于受到各种关系的累赘，各种数据形式的束缚，难以处理海量数据以及超高并发的业务场景。而非关系型简单理解就是把数据直接放进一个大仓库，不标号，不连线，单纯的堆起来，从而提高对海量数据的高性能存储及访问需求。


NoSQL分类:

- 键值数据库：在存储时不采用任何模式，因此极易添加数据。代表redis
- 文档数据库: 满足海量数据的存储和访问需求，同时对字段要求严格，可以随意增加、删除、修改字段。且不需要预定义表结构。代表mongoDB
- 列存储型数据库:查找速度快，可扩展，适用于作分布式文件存储系统。代表Hbase
- 图数据库：利用“图结构”的相关算法来存储实体之间的关系信息，适用于构建社交网络和推荐系统的关系图谱

那么NoSQL和RDB（关系型）该怎么选？

首先NoSQL并不能完全取代关系型数据库，NoSQL主要备用送来处理大量且多元数据的存储及运算问题。

NoSQL适合模型关联性比较低的应用。因此如果需要多表关联，则更是使用RDB.如果对象实体关联少，则更适合NoSQL数据库（其中MongoDB可以支持复杂度相对较高的数据结构，能够将相关联的数据以文档形式嵌入，从而减少数据之间的关联操作）。

性能要求：如果数据量多且访问速度很重要，那么使用NoSQL数据库可能比较适合。NoSQL数据库能听通过数据的分布式存储大幅地提升存储性能。

一致性：NoSQL数据库有一个缺点，在事务处理与一致性方面无法与RDB比较。因此NoSQL数据库很难同时满足强一致性与高并发。如果应用对性能有高要求，则NoSQL数据库只能做到数据最终一致。

可用性要求：考虑到数据不可用可能造成分析，NoSQL数据库提供了强大的数据可用性。

**注意：一个项目并非只选择一种数据库，可以将其拆开设计，将需要RDB特性的放到RDB中管理，而其它数据放到NoSQL中管理**


## 介绍

mongoDB是c++语言编写，是一个基于分布式文件存储的开源NoSQL数据库系统。介于关系型数据库和非关系型数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。

mongoDB将数据存储为一个文档，数据结构由键值对组成。MongoDB文档类似于JSON对象。字段值可以包含其他文档，数组及文档数组。

特点

- 文档型数据库
- 灵活性
- 可扩展性
- 强大的查询语言
- 优异性能
- 高性能（支持使用嵌入式数据时，减少系统系统IO负担，支持子文档查询）
- 多种查询类型支持，且支持数据聚合查询，文本检索，地址位置查询
- 高可用、水平扩展，支持副本集与分片
- 多种存储引擎：WiredTiger, In-Memory

MongoDB适用于哪些场景

1. 需要处理大量的低价值数据，且对数据处理性能有较高的要求，比如微博数据的处理就不需要太高的事务性，但是对数据的存取性有很高的要求，这时就适合MongoDB
2. 需要借助缓存层来处理数据: 可以用来做持久化缓存层，可以避免底层存储的资源过载。
3. 需要高度的伸缩性：对关系型数据库而言，当表的大小达到一定数量级以后，其性能会急剧下降。这时可以使用多台MongoDB服务器搭建一个集群环境，实现最大程度的扩展，且不影响其性能。

## 命令

1. 显示所有数据库：`show dbs`

```text
admin   0.000GB
config  0.000GB
local   0.000GB
```

MongoDB中默认的数据库为test,如果没有创建新的数据库，集合将存放在test数据库中。有一些数据库名是保留的，可以直接访问这些有特殊作用的数据库：

- admin 从权限的角度来看，这是root数据库。要是讲一个用户添加到这个数据库，这个用户自动继承所有数据库的权限。一些特定的服务器端命令也只能从这个数据库运行，比如列出所有数据库或者关闭服务器。
- local: 这个数据永远不会被复制，可以用来存储限于本地单台服务器的任意集合
- config： 当Mongo用于分片设置时，config数据库在内部使用，用于保存分片相关的信息

2. 切换创建数据库：use <database_name>
3. 删除数据库 db.dropDatabase()
4. 查看当前所处的库：db 
5. 创建集合（可以不用显示创建,直接操作就行会自动创建，显示创阿金可以设置最大大小或文档校验规则）:db.createCollection('user'); 
6. 显示当前数据库集合列表：show collections
7. 创建users集合（对象）：`db.users.insert({ name: 'jack', age: 15 })`
8. 查询users集合中的所有数据： db.users.find()
9. 删除users集合db.users.drop()


## 文档概念

MongoDB将数据记录存储为BSON（Binary JSON）文档。

Binary JSON 是JSON文档的二进制表示形式，它比JSON包含更多的数据类型。

```shell
{ 
  field1: value1,
  field2: value2,
  field3: value3,
  fieldN: valueN
}
```

- 字段名称_id保留用作主键，它的值在集合中必须是唯一的，不可变的，并且可以是数组以外的任何类型。
- 字段名称不能包含空字符串

```javascript
const doc = {
  _id: ObjectId('1231234234123123'),
  name: { first: 'Alan', last: 'Turing' },
  birth: new Date('Jun 23, 2023'),
  contribs: ['1', '2', '3'],
  views: NumberLong(123123123)
}
```

常用数据类型

| 类型                | 整数标识符 | 别名字符        |
|-------------------|-------|-------------|
| Double            | 1     | "double"    |
| String            | 2     | "string"    |
| Object            | 3     | "object"    |
| Array             | 4     | "array"     |
| Binary data       | 5     | "binData"   |
| ObjectId          | 7     | "objectId"  |
| Boolean           | 8     | "bool"      |
| Date              | 9     | "date"      |
| Null              | 10    | "null"      |
| Regular Expression | 11    | "regex"     |
| 32-bit integer    | 16    | "int"       |
| Timestamp         | 17    | "timestamp" |
| 64-bit integer    | 18    | "long"      |
| Decimal128        | 19    | "decimal"   |

1. 插入单个文档到集合：`db.collection.insertOne({})` 
2. 插入多个文档到集合：`db.collection.insertMany([{}, {}])` 
3. 将一个或多个插入文档：`db.collection.insert([])`
4. 查询文档：`db.coll_name.find({ age: {  $gt: 18}, { name: 1, address: 1 } }).limit(5)`
   1. 查询年龄大于18。$lt 小于。上面还存在and语句
   2. 指定返回name和address字段, `{ name: 0 }`不查name, 其他都差。`{ name: '张三' }`只查张三
   3. 查5条
   4. or： `db.users.find({ $or: [ { name: '张三'}, { age: { $gt: 18 } } ]})` 查询张三或年龄大于18


**比较运算符**

| 类型                 | 描述           | 
|--------------------|--------------|
| $eq                | 匹配等于值        |
| $gt                | 匹配大于指定值的值    |
| $gte               | 匹配大于或等于指定值得值 | 
| $lt                | 匹配小于指定值得值    | 
| $lte               | 匹配小于或等于指定值的值 | 
| $ne                | 匹配所有不等于指定值的值 |
| $in                | 匹配数组中指定的任何值  |
| $nin               | 不配配数组中指定的值   | 


**逻辑运算符**

| 类型   | 描述                            | 
|------|-------------------------------|
| $and | 将查询字句与逻辑连接，并返回与这个字句条件匹配的所有文档  |
| $not | 反转查询表达式的效果，并返回与查询表达式不匹配的文档    |
| $nor | 用逻辑NOR连接查询字句，返回所有不能匹配这两个字句的文档 | 
| $or  | 用逻辑连接查询字句，或返回与任一字句条件匹配的所有文档   | 


```NoSQL
# 完整查询size文档
db.users.find({
  # 文档中顺序如下所示，如果改变顺序就会查不出结果
   size: { w: 21, h:14, uom: "cm"}
})
# 嵌套在size字段中的uom字段等于in的所有文档
db.users.find({
   "size.uom": "in"
})

# 匹配一个数组
db.users.find({
  # 这个是包含顺序，如果不想要顺序使用 { $all: ["eat", "play"] }
  likes: ["eat", "play"]
})

# 查询数组中likes中包含play
db.users.find({
  tags: "play"
})

# 查询数组复合条件
db.user.find({ # 鳗鱼大于15条件，小于20
  likes_num: { $gt: 15, $lt: 20} 
})

# 查询满足多个条件的数组元素
db.user.find({ # 数组中同时大于22和小于30的元素文档
  likes_num: { $elemMatch: { $gt:22, $lt: 30 } }
})

# 通过数组索引位置查询数组
db.user.fing({ # 查询数组第二项大于25
  "likes_num.1": { $gt: 25 }
})

# 数组长度查询数组
db.user.fing({
  "likes_num": { $size: 3 }
})

# 查询数组中的元素与制定文档匹配的所有文档
# 查找当前likes_k_v的数组中是否包含（完全匹配，顺序还要一值）{ key:  'A', value: 1 },包含返回整个文档
db.user.find({ 
  // likes_k_v 格式 [{key, value}, {key, value}]
  "likes_k_v": { key:  'A', value: 1 }
})

# 查询嵌入数组上指定查询条件
db.user.find({ # 小于等于20的文档字段
  "likes_k_v.value": { $lte: 20 }
})

# 查询嵌入数组上指定项查询条件
db.user.find({ # 第一项小于等于20的文档字段
  "likes_k_v[0].value": { $lte: 20 }
})

# 单个嵌套文档在嵌套字段上满足多个查询条件
db.user.find({ # 同时包含value=5且key='A'的字段
  "likes_k_v": { 
    $elemMatch: { key: 'A', value: 5}
  }
})

# 数组中至少有一个嵌入式文档包含字段value大于10或小于20
db.user.find({
  "likes_k_v": { 
    $elemMatch: { value: { $gt: 10, $lt: 20}   }
  }
})


# 返回匹配文档中的所有字段, 只返回status字段和_id
db.users.find({ status: 'A' })

# 查询status为A, 返回item,status, _id字段
# 1 选中
# 0 取反
db.users.find({ status: 'A', { item:1, status: 1}})

# 嵌入字段返回
db.users.find({ status: 'A', { item:1, status: 1, "size.uom": 1}})

# $slice 指定数组元素 整数返回相应元素，负数从后面算
# 数组中最后一个元素 { $slice: -1 }
db.users.find({ status: 'A', {
  item: 1,
  status: 1,
  instock: { $slice: -1 }
}})


# 空字段 null， 缺少字段 N/A

# 可以查询到null和N/A的item字段
db.users.find({ item: null })
# 返回item子弹为null字段
db.users.find({ item: { $type: 10} }]})
# 查询与不包含item字段的文档
db.users.find({ item: { $exists: false } })
```


## 更新文档

- `db.users.updateOne(<filter>, <update>, <options>)`
- `db.users.updateMany(<filter>, <update>, <options>)`
- `db.users.replaceOne(<filter>, <update>, <options>)`


```shell
# 更新单个文档
# 使用$set将size.a字段更新为1, 将状态字段更新为p
# 使用$currentDate运算符将lastModified字段的值更新为当前日期
db.users.updateOne(
  { item: "paper" },
  {
    $set: { "size.a": "1", status: "p" },
    $currentDate: { lastModified: true }
  }
)
  
# 更新多个文档 
# updateMany 适用更新数量小于50的所有文档 
db.users.updateMany(  
  { "qty": { $lt: 18 } },
  { 
    $set: { "size.a": "1", status: "p" },
    $cuttentDate: { lastModified: true }  
  } 
)
  
  
# 替换文档 
db.users.replaceOne(
  { item: "paper" },
  { item: "paper", instock: [ { warehouse: "A", qty: 60 }, { warehouse: "B", qty: 80 }] }
) 
```

## 删除文档

- db.users.deleteMany()
- db.users.deleteOne()

```shell
# 删除所有文档
db.users.deleteMany({});

# 删除所有符合条件的文档 不需要集合全相等
db.users.deleteMany({ status: "A" })

# 删除1个符合条件的文档
db.users.deleteOne({ status: "A" })
```


## 连接node

安装包：`pnpm i mongodb`,这个是官方提供的包。
