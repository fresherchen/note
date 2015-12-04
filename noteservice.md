# Note Servers API Reference 0.1

***

Note Micro Servers API Docs

# 使用说明

本servers是基于nodejs+mongodb开发的，以通过调用API的方式对外提供云笔记服务。

1、目前版本各方法暂不需要token验证即可调用，验证部分待后续补充；
2、是否要为每个新用户创建一个默认笔记本待讨论，这里暂时没有；
3、默认笔记本可以没有，有则只能有一个，且不能被删除，除非被置为非默认；
4、笔记本被删除，它的笔记被丢进Trash中，restore后笔记进入默认笔记本中；
5、笔记内容长度不大于100000；

# 主要方法

## Notebook

***

### http://[baseUrl]/notebooks

获取用户笔记本 list，亦可用于验证笔记本名是否重复

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
user     |  `String`   | 用户  user id 
isDefault(optional) |  `Boolean`  | 是否默认笔记本
notebookName(optional) |  `String` | 笔记本名

**Request Method**

  `get`

**Returns**

  success: status 200, json type datas
  fail: fail info
  
**Example**
```
params:

  "user": "562dd4ac7189f7be06291949"
  
  ......
  
results
[
  {
   "_id": "562f2409b3a7d6ce1d1a95ca",
   "user": "562dd4ac7189f7be06291949",
   "__v": 0,
   "isDefault": true,
   "createdOn": "2015-10-27T07:13:13.353Z",
   "notebookName": "FirstNotebook"
  },
  {
   "_id": "562f29a7f3065af51d343bf9",
   "user": "562dd4ac7189f7be06291949",
   "__v": 0,
   "isDefault": false,
   "createdOn": "2015-10-27T07:37:11.860Z",
   "notebookName": "aaa"
  }
]

```

### http://[baseUrl]/notebooks

创建新笔记本

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
user     |  `String`   | 用户  user id 
notebookName |  `String`  |  笔记本名称
isDefault(optional)  | `Boolean`  |   是否设置为默认笔记本；不传，默认false

**Request Method**

  `post`

**Returns**

  success: status 200, json type datas
  fail: fail info
  
**Example**
```
params:
{
  "user": "562dd4ac7189f7be06291949",
  "notebookName": "secondNotebook"
}
  
  ......
  
results
{
  "__v": 0,
  "user": "562dd4ac7189f7be06291949",
  "_id": "563c610953c5cb9e40be907a",
  "isDefault": false,
  "createdOn": "2015-11-06T08:12:57.116Z",
  "notebookName": "secondNotebook"
}

```

### http://[baseUrl]/notebooks/:notebookId

通过笔记本id获取笔记本

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
:notebookId |  `String`  |  笔记本id
user |  `String`  |  用户id

**Request Method**

  `get`

**Returns**

  success: status 200, json type datas
  fail: fail info
  
**Example**
```
params:

  :notebookId 替换为 563c641753c5cb9e40be907b
  user：562dd4ac7189f7be06291949

  ......

results
{
  "_id": "563c641753c5cb9e40be907b",
  "user": {
    "_id": "562dd4ac7189f7be06291949",
    "displayName": "aaa aaa"
  },
  "__v": 0,
  "isDefault": false,
  "createdOn": "2015-11-06T08:25:59.122Z",
  "notebookName": "secondNotebook"
}

```

### http://[baseUrl]/notebooks/:notebookId

通过笔记本id修改笔记本

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
:notebookId |  `String`  |  笔记本id
user  | `String`  | 用户id
notebookName  | `String`  |  笔记本名
isDefault  | `Boolean`  |   是否设置为默认笔记本；不传，默认false

**Request Method**

  `post`

**Returns**

  success: status 200, json type datas
  fail: fail info
  
**Example**
```
params:

  :notebookId 替换为 563c641753c5cb9e40be907b

{
  "user":"562dd4ac7189f7be06291949",
  "notebookName":"secondNotebook",
  "isDefault":false
}
  ......

results
{
  "_id": "563c641753c5cb9e40be907b",
  "user": "562dd4ac7189f7be06291949",
  "__v": 0,
  "isDefault": false,
  "createdOn": "2015-11-06T08:25:59.122Z",
  "notebookName": "secondNotebook"
}

```

### http://[baseUrl]/notebooks/:notebookId

通过笔记本id删除笔记本

**Parameters**

Param   |Type     |details
---------|-------------|---------------------
:notebookId |  `String`  |  笔记本id
user  | `String`  |  用户id

**Request Method**

  `delete`

**Returns**

  success: status 200, json type datas
  fail: fail info
  
**Example**
```
params:

  :notebookId 替换为 563c641753c5cb9e40be907b

{
  "user":"562dd4ac7189f7be06291949"
}
  ......

results
将notebook中的notes移动到Trash中
{
  "message": "Notebook was removed successfuly!!!"
}

```

## Tag

***

### http://[baseUrl]/tags

获取全部tag列表或通过tag名称搜索tag

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
user  | `String`  |  用户id
tagName(optional)  | `String` | 标签名称
status(optional) |  `Fuzzy`  | 搜索精度，与tagName配合，添加则为模糊查询

**Request Method**

  `get`

**Returns**

  success: status 200, json type datas
  fail: fail info
  
**Example**
```
params:
{
  "user":"562dd4ac7189f7be06291949",
  "tagName":"f",
  "status":"Fuzzy"
}
  ......

results
[
  {
   "_id": "56403337ddc25592097e3962",
   "user": "562dd4ac7189f7be06291949",
   "tagName": "ghf",
   "__v": 0,
   "createdOn": "2015-11-09T05:46:31.596Z"
  },
  {
   "_id": "564042acddc25592097e3963",
   "user": "562dd4ac7189f7be06291949",
   "tagName": "asf",
   "__v": 0,
   "createdOn": "2015-11-09T06:52:28.315Z"
  }
]

```
### http://[baseUrl]/tags

创建新tag

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
user  | `String`  |  用户id
tagName  | `String` | tag名

**Request Method**

  `post`

**Returns**

  success: status 200, json type datas
  fail: fail info
  
**Example**
```
params:
{
  "user":"562dd4ac7189f7be06291949",
  "tagName":"rrr"
}
  ......

results
{
  "__v": 0,
  "user": "562dd4ac7189f7be06291949",
  "tagName": "rrr",
  "_id": "564037f2d57531104581827d",
  "createdOn": "2015-11-09T06:06:42.872Z"
}

```

### http://[baseUrl]/tags/search

根据id搜索tag

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
user  | `String`  |  用户id
tagsId(optional)  | `Array` | 标签的id

**Request Method**

  `post`

**Returns**

  success: status 200, json type datas
  fail: fail info
  
**Example**
```
params:
{
  "user":"562dd4ac7189f7be06291949",
  "tagsId":["56403337ddc25592097e3962","564042acddc25592097e3963"]
}
  ......

results
[
  {
   "_id": "56403337ddc25592097e3962",
   "user": "562dd4ac7189f7be06291949",
   "tagName": "ghf",
   "__v": 0,
   "createdOn": "2015-11-09T05:46:31.596Z"
  },
  {
   "_id": "564042acddc25592097e3963",
   "user": "562dd4ac7189f7be06291949",
   "tagName": "asf",
   "__v": 0,
   "createdOn": "2015-11-09T06:52:28.315Z"
  }
]

```

### http://[baseUrl]/tags/:tagId

根据tagId获取tag

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
user  | `String`  |  用户id
tagId  | `String` | 标签的ID

**Request Method**

  `get`

**Returns**

  success: status 200, json type datas
  fail: fail info
  
**Example**
```
params:
	
  :tagId 替换为 56403337ddc25592097e3962
  user:562dd4ac7189f7be06291949

  ......

results
{
  "_id": "56403337ddc25592097e3962",
  "user": {
   "_id": "562dd4ac7189f7be06291949",
   "displayName": "aaa aaa"
  },
  "tagName": "ghf",
  "__v": 0,
  "createdOn": "2015-11-09T05:46:31.596Z"
}

```

### http://[baseUrl]/tags/:tagId

根据tagId更新tag

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
user  | `String`  |  用户id
tagId  | `String`  | 标签的id
tagName  | `String` | 标签名

**Request Method**

  `post`

**Returns**

  success: status 200, json type datas
  fail: fail info
  
**Example**
```
params:
	
  :tagId 替换为 56403337ddc25592097e3962
{
  "user":"562dd4ac7189f7be06291949",
  "tagName":"ddd"
}

  ......

results
{
  "_id": "56403337ddc25592097e3962",
  "user": "562dd4ac7189f7be06291949",
  "tagName": "ddd",
  "__v": 0,
  "createdOn": "2015-11-09T05:46:31.596Z"
}

```

### http://[baseUrl]/tags/:tagId

根据tagId删除tag

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
user  | `String`  |  用户id
tagId  | `String` | 标签的id

**Request Method**

  `delete`

**Returns**

  success: status 200
  fail: fail info
  
**Example**
```
params:
	
  :tagId 替换为 56403337ddc25592097e3962
{
  "user":"562dd4ac7189f7be06291949"
}

  ......

results
删除notes中的此tag
{
  "message": "Tag was removed successfuly!!!"
}

```

## Note

***

### http://[baseUrl]/notes

获取note

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
user | `String`  |  用户id
notebookId(optional) | `String` | 笔记本的id
tag(optional) | `String` | tag的id
key(optional) | `String`  | 根据key搜索笔记(含标题和内容)
sortmode(optional) | `-updatedOn(default)/updatedOn/-createdOn/createdOn/-title/title` | 排序方式

**Request Method**

  `get`

**Returns**

  success: status 200, json type datas
  fail: fail info
  
**Example**
```
params:
 
 user:562dd4ac7189f7be06291949
 notebookId:562f29a7f3065af51d343bf9
 
  ......

results
[
  {
   "_id": "5639e2b80e45cce7377c21a3",
   "user": "562dd4ac7189f7be06291949",
   "notebookId": "562f29a7f3065af51d343bf9",
   "__v": 0,
   "tag": [
     "564042acddc25592097e3963"
   ],
   "updatedOn": "2015-11-04T10:49:31.919Z",
   "createdOn": "2015-11-04T10:49:28.487Z",
   "content": "Write something here ~",
   "title": "b"
  }
]

```
### http://[baseUrl]/notes

创建新note

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
user | `String`  |  用户id
notebookId | `String` | 笔记本的id；不传，则添加默认笔记本id
title  | `String`  | 笔记标题
content | `String` | 笔记内容

**Request Method**

  `post`

**Returns**

  success: status 200, json type datas
  fail: fail info
  
**Example**
```
params:

{
  "user":"562dd4ac7189f7be06291949",
  "notebookId":"562f29a7f3065af51d343bf9",
  "title":"test function",
  "content":"This is testing ,action!"
}
  ......

results
{
  "__v": 0,
  "user": "562dd4ac7189f7be06291949",
  "notebookId": "562f29a7f3065af51d343bf9",
  "_id": "56406b142365258c47f99e86",
  "tag": [],
  "updatedOn": "2015-11-09T09:44:52.388Z",
  "createdOn": "2015-11-09T09:44:52.387Z",
  "content": "This is testing ,action!",
  "title": "test function"
}

```
### http://[baseUrl]/notes/tag

为note添加或删除tag

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
user | `String`  |  用户id
noteId | `String` | 笔记的id
tag | `String`  | tag的id
flag(optional) | `add` | 添加tag；不传，默认为删除

**Request Method**

  `post`

**Returns**

  success: status 200
  fail: fail info
  
**Example**
```
params:

{
  "user":"562dd4ac7189f7be06291949",
  "noteId":"56406f232365258c47f99e87",
  "tag":"564037f2d57531104581827d",
  "flag":"add"
}
  ......

results
{
  "message": "The tag has been added to this note successfuly!!!"
}

```
### http://[baseUrl]/notes/mail

通过邮件分享note(方法暂不可用，待完善)

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
user | `String`  |  用户id
noteId | `String` | 笔记的id
email | `String`  | 好友mail地址
message(optional) | `String` | 附加信息，留言

**Request Method**

  `post`

**Returns**

  success: status 200
  fail: fail info
  
**Example**
```
params:

{
  "user":"562dd4ac7189f7be06291949",
  "noteId":"56406f232365258c47f99e87",
  "email":"example@leadstec.com"
}
  ......

results
success/failed

```
### http://[baseUrl]/notes/:noteId

通过id获取note

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
user | `String`  |  用户id
noteId | `String` | 笔记的id

**Request Method**

  `get`

**Returns**

  success: status 200,json type datas
  fail: fail info
  
**Example**
```
params:

   :noteId 替换为 56406f232365258c47f99e87
   
   user:562dd4ac7189f7be06291949
  ......

results
{
  "_id": "56406f232365258c47f99e87",
  "user": {
    "_id": "562dd4ac7189f7be06291949",
    "displayName": "aaa aaa"
  },
  "notebookId": "562f29a7f3065af51d343bf9",
  "__v": 0,
  "tag": [],
  "updatedOn": "2015-11-10T02:13:02.616Z",
  "createdOn": "2015-11-09T10:02:11.168Z",
  "content": "That is testing ,action!",
  "title": "This test function"
}

```
### http://[baseUrl]/notes/:noteId

通过id更新note

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
user | `String`  |  用户id
noteId | `String` | 笔记的id
notebookId(optional) | `String` | 笔记本的id
title(optional) |  `String` | 笔记标题
content(optional) | `String` | 笔记内容
inTrash(optional) | `Boolean` | 是否将笔记移进Trash

**Request Method**

  `post`

**Returns**

  success: status 200,json type datas
  fail: fail info
  
**Example**
```
params:

   :noteId 替换为 56406f232365258c47f99e87
{
   "user":"562dd4ac7189f7be06291949",
   "title":"aaaaaa"
}
  ......

results
{
  "_id": "56406f232365258c47f99e87",
  "user": "562dd4ac7189f7be06291949",
  "notebookId": "562f29a7f3065af51d343bf9",
  "__v": 0,
  "tag": [],
  "updatedOn": "2015-11-10T03:17:57.329Z",
  "createdOn": "2015-11-09T10:02:11.168Z",
  "content": "That is testing ,action!",
  "title": "aaaaaa"
}

```
### http://[baseUrl]/notes/:noteId

通过id删除note

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
user | `String`  |  用户id
noteId | `String` | 笔记的id


**Request Method**

  `delete`

**Returns**

  success: status 200,json type datas
  fail: fail info
  
**Example**
```
params:

   :noteId 替换为 56406f232365258c47f99e87
{
   "user":"562dd4ac7189f7be06291949"
}
  ......

results
{
  "_id": "56406f232365258c47f99e87",
  "user": {
    "_id": "562dd4ac7189f7be06291949",
    "displayName": "aaa aaa"
  },
  "notebookId": "562f29a7f3065af51d343bf9",
  "__v": 0,
  "tag": [],
  "updatedOn": "2015-11-10T03:23:37.099Z",
  "createdOn": "2015-11-09T10:02:11.168Z",
  "content": "That is testing ,action!",
  "title": "bbbbbb"
}

```
## note-subsidiaryUser

笔记的附属user属性，包括list模式，排序方式，空间总量，已用空间量等

***

### http://[baseUrl]/subsidiaryNoteUser

通过userId获取subsidiaryUser

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
user | `String`  |  用户id

**Request Method**

  `get`

**Returns**

  success: status 200,json type datas
  fail: fail info
  
**Example**
```
params:

   user:562dd4ac7189f7be06291949
  ......

results
{
  "_id": "562dd4ac7189f7be06291949",
  "listmode": "list",
  "sortmode": "-updatedOn",
  "__v": 0
}

```
### http://[baseUrl]/subsidiaryNoteUser

通过userId创建subsidiaryUser

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
user | `String`  |  用户id
listmode(default) | `list(default)/snippet` | list模式
sortmode(default) | `-updatedOn(default)/updatedOn/-createdOn/createdOn/-title/title` | 排序方式

**Request Method**

  `post`

**Returns**

  success: status 200,json type datas
  fail: fail info
  
**Example**
```
params:

   user:562dd4ac7189f7be06291949
  ......

results
{
  "__v": 0,
  "_id": "562dd4ac7189f7be06291949",
  "listmode": "list",
  "sortmode": "-updatedOn"
}

```
### http://[baseUrl]/subsidiaryNoteUser

通过userId更新subsidiaryUser

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
user | `String`  |  用户id
listmode(optional) | `list/snippet` | list模式
sortmode(optional) | `-updatedOn/updatedOn/-createdOn/createdOn/-title/title` | 排序方式

**Request Method**

  `put`

**Returns**

  success: status 200,numAffected
  fail: fail info
  
**Example**
```
params:
{
  "user":"562dd4ac7189f7be06291949",
  "sortmode":"updatedOn"
}
  ......

results
1

```
### http://[baseUrl]/subsidiaryNoteUser

通过userId删除subsidiaryUser

**Parameters**

Param   |  Type     |details
---------|-------------|---------------------
user | `String`  |  用户id

**Request Method**

  `delete`

**Returns**

  success: status 200,json type datas
  fail: fail info
  
**Example**
```
params:
{
  "user":"562dd4ac7189f7be06291949"
}
  ......

results
{
  "_id": "562dd4ac7189f7be06291949"
}

```

## note-fileUpload

上传笔记附件，因openstack停用，此方法不能使用