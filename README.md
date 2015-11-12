# notes micro services 0.1

***

notes micro services运行环境，适用于研发及部署。

本镜像提供：

* smartnotes server 0.1
* Node.js 0.12.2
* Npm 2.7.4
* Node Packages:
    - grunt
    
继承关系：notes micro services -->nodejs

# 使用说明

***

**主要文件**

名称 |位置              |说明
--------|--------------------------|-----------------
初始化 | /script/runonce_nodejs.sh   | 只有首次启动执行

### PORTS

请在创建container时指定端口映射，本镜像推荐端口：
端口  | 说明     |推荐
3000| 常见端口  |√

### ENV

无

### VOLUME

container路径  | Host存放位置  | 说明
-------------|--------------|------------------
/data/log | logcenter   | 继承自alpine
/data/persist  |datacenter  | 继承自alphine
/data/app |datacenter  |不建议代码做volume

# 实例

***

### Quickstart

```
nodejs:
  image: reg.leadstec.com/nodejs:latest
  ports:
  	- "41201:3000"
  volumes:
  	- /var/lib/docker/vfs/dir/logcenter/nodejs.localhost:/data/log
  	- /var/lib/docker/vfs/dir/datacenter/nodejs.localhost:/data/persist
  environment:
  	- EMAIL=user@example.com
  	- ENGINE=localhost
  hostname: nodejs.localhost
```

### Link Container

Node.js项目常采用MongoDB，本例子说明如何将nodejs与mongo进行linking。

```
db:
   image:reg.leadstec.com/mongo:latest
   ports:
   	 - "41203:27017"
   	 - "41204:28017"
   volumes:
     - /var/lib/docker/vfs/dir/logcenter/app-db.example.com:/data/log
     - /var/lib/docker/vfs/dir/datacenter/app-db.example.com:/data/persist
   links:
     - db:db
   environment:
     - EMAIL=user@example.com
     - ENGINE=localhost
   hostname: app.example.com
```


#### Cap

## Usage

## Developing

### Tools

