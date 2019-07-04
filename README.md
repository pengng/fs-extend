# fs-extend

#### 提供扩展原生fs模块不支持的功能

### Usage

```bash
npm i fs-extend -S
```

```javascript
const fsEx = require('fs-extend')
fsEx.mkdir('./1/2/3/4/5/6/7/8/9', (err) => {
  if (err) {
    return console.error(err)
  }
  console.log('ok')
})
```

### Function

- `mkdir(path, callback)` [递归建立目录](#mkdir)
- `mkdirSync(path)` [同步递归建立目录](#mkdirsync)
- `rm(path, callback)`  [删除目录及子目录](#rm)
- `rmSync(path)` [同步删除目录及子目录](#rmsync)
- `find(path, pattern, callback)` [查找`path`目录及子目录下匹配`pattern`的文件和目录。](#find)
- `findSync(path, pattern)` [同步查找`path`目录及子目录下匹配`pattern`的文件和目录。](#findsync)
- `listFiles(path, callback)` [列出目录及子目录下所有文件](#listfiles)
- `listFilesSync(path)` [同步列出目录及子目录所有文件](#listfilessync)
- `empty(path, callback)` [判断目录是否空目录](#empty)
- `emptySync(path)` [同步判断目录是否空目录](#emptysync)

#### mkdir

- `path` **\<string\>** 目录路径
- `callback` **\<Function\>**
  - `err` **\<Error\>**

递归建立目录

```javascript
fsEx.mkdir('./1/2/3/4/5/6/7/8/9', (err) => {
  if (err) {
    return console.error(err)
  }
  console.log('ok')
})
```

#### mkdirSync

同步递归建立目录

- `path` **\<string\>**

```javascript
try {
  fsEx.mkdirSync('./1/2/3/4/5/6/7/8/9')
  console.log('ok')
} catch (err) {
  console.error(err)
}
```

#### rm

删除目录及子目录

- `path` **\<string\>** 目录路径
- `callback` **\<Function\>**
  - `err` **\<Error\>**

```javascript
fsEx.rm('./1', (err) => {
  if (err) {
    return console.error(err)
  }
  console.log('ok')
})
```

#### rmSync

同步删除目录及子目录。

- `path` **\<string\>** 删除的目录

```javascript
try {
  fsEx.rmSync('./1')
  console.log('ok')
} catch (err) {
  console.error(err)
}
```

#### find

查找`path`目录及子目录下匹配`pattern`的文件和目录。

- `path` **\<string\>** 查找的目录。
- `pattern` **\<string\> | \<RegExp\>** 查找的模式。
- `callback` **\<Function\>**
  - `err` **\<Error\>**
  - `result` **\<string[]\>** 查找的结果。

```javascript
fsEx.find('.', '.jpg', (err, result) => {
  if (err) {
    return console.error(err)
  }
  console.log(result)
})
```

#### findSync

同步查找`path`目录及子目录下匹配`pattern`的文件和目录。

- `path` **\<string\>** 目录路径。
- `pattern` **\<string\> | \<RegExp\>** 查找的模式。

```javascript
try {
  const result = fsEx.findSync('.', '.jpg')
  console.log(result)
} catch (err) {
  console.error(err)
}
```

#### listFiles

列出目录及子目录下所有文件。

- `path` **\<string\>** 
- `callback` **\<Function\>**
  - `err` **\<Error\>** 
  - `result` **\<string[]\>** 文件列表。

```javascript
fsEx.listFiles('.', (err, result) => {
  if (err) {
    return console.error(err)
  }
  console.log(result)
})
```

#### listFilesSync

同步列出目录及子目录所有文件。

```javascript
try {
  const result = fsEx.listFilesSync('.')
  console.log(result)
} catch (err) {
  console.error(err)
}

```

#### empty

判断目录是否空目录

```javascript
fsEx.empty('.', (err, isEmpty) => {
  if (err) {
    return console.error(err)
  }
  console.log('isEmpty: %s', isEmpty)
})
```

#### emptySync

同步判断目录是否空目录。

- `path` **\<string\>**

```javascript
try {
  const isEmpty = fsEx.emptySync('.')
  console.log('isEmpty: %s', isEmpty)
} catch (err) {
  console.error(err)
}
```

