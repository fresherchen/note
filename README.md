# Note micro services 0.1

***

Note micro services运行环境，适用于研发及部署。

本镜像提供：

* note server 0.1.1
* Node.js 0.12.3
* Npm 2.7.4
* Node Packages:
    - grunt
    
继承关系：note micro services -->nodejs

# 使用说明

***

**主要文件**

名称 |位置              |说明
--------|--------------------------|-----------------
初始化 | /script/runonce_notemicroservices.sh   | 只有首次启动执行

### PORTS

请在创建container时指定端口映射，本镜像推荐端口：
端口  | 说明     |推荐
3000| 常见端口  |√

### ENV

NOTE_DBNAME : DB的名字

### VOLUME

container路径  | Host存放位置  | 说明
-------------|--------------|------------------
/data/log | logcenter   | 继承自alpine
/data/persist  |datacenter  | 继承自alpine
/data/app |datacenter  |不建议代码做volume

# 实例

***

### Quickstart

```
nodejs:
  image: reg.leadstec.com/notemicroservices:latest
  ports:
  	- "41201:3000"
  volumes:
  	- /var/lib/docker/vfs/dir/logcenter/notemicroservices.localhost:/data/log
  	- /var/lib/docker/vfs/dir/datacenter/notemicroservices.localhost:/data/persist
  environment:
  	- EMAIL=user@example.com
  	- ENGINE=localhost
  hostname: notemicroservices.localhost
```

### Link Container

Node.js项目常采用MongoDB，本例子说明如何将notemicroservices与mongo进行linking。

```
db:
   image:reg.leadstec.com/mongo:latest
   ports:
   	 - "41203:27017"
   	 - "41204:28017"
   volumes:
     - /var/lib/docker/vfs/dir/logcenter/notemicroservices-db.example.com:/data/log
    - /var/lib/docker/vfs/dir/dbcenter/notemicroservices-db.example.com:/data/db
     - /var/lib/docker/vfs/dir/datacenter/notemicroservices-db.example.com:/data/persist
   links:
     - db:db
   environment:
     - EMAIL=user@example.com
     - ENGINE=localhost
   hostname: notemicroservices.example.com
```


#### Cap

## Usage

## Developing

### Tools

