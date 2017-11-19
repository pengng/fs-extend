const fs = require('fs')
const path = require('path')
const FsExtendError = require('./error').FsExtendError
const extend = {}

const curry = function (func) {
  const args = Array.prototype.slice.call(arguments, 1)
  return function () {
    const newArgs = Array.prototype.slice.call(arguments).concat(args)
    func.apply(this, newArgs)
  }
}

const each = function (collection, iteration, callback) {
  let asyncOpt = collection.length
  const result = []
  let isCalled = false
  const next = function (index, err) {
    if (err && isCalled) {
      isCalled = true
      return callback(err)
    }
    const args = Array.prototype.slice.call(arguments, 2)
    result[index] = args
    asyncOpt--
    if (asyncOpt === 0) {
      callback(null, result)
    }
  }
  for (let i = 0, len = collection.length; i < len; i++) {
    iteration(collection[i], next.bind(null, i))
  }
}

extend.mkdir = function (fullpath, callback) {
  const access = function (fullpath, callback) {
    let arr = fullpath instanceof Array ? fullpath : [fullpath]
    fullpath = arr[arr.length - 1]
    fs.access(fullpath, function (err) {
      if (err) {
        const newPath = path.resolve(fullpath, '../')
        return access(arr.concat(newPath), callback)
      }
      callback(arr)
    })
  }
  const mkdir = function (arr, callback) {
    const fullpath = arr.pop()
    if (fullpath) {
      fs.mkdir(fullpath, function (err) {
        if (err) {
          return callback(err)
        }
        mkdir(arr, callback)
      })
    } else {
      callback()
    }
  }
  access(fullpath, function (result) {
    if (result && result instanceof Array) {
      mkdir(result.slice(0, -1), callback)
    }
  })
}

extend.mkdirSync = function (fullpath) {
  const access = function (fullpath) {
    try {
      fs.accessSync(fullpath)
    } catch (err) {
      const newPath = path.resolve(fullpath, '../')
      const result = access(newPath)
      if (result) {
        return [fullpath].concat(result)
      } else {
        return [fullpath]
      }
    }
  }
  const mkdir = function (arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
      fs.mkdirSync(arr[i])
    }
  }
  mkdir(access(fullpath))
}

extend.rm = function (fullpath, callback) {
  fullpath = /^\//.test(fullpath) ? fullpath : path.resolve(process.cwd(), fullpath)
  const done = function (func) {
    return function (err) {
      if (err) {
        return callback(err)
      }
      const args = Array.prototype.slice.call(arguments, 1)
      func.apply(this, args)
    }
  }
  const readdirCallback = function (files) {
    if (files.length === 0) {
      return fs.rmdir(fullpath, done(callback))
    }
    const arr = files.map(function (item) {
      return path.resolve(fullpath, item)
    })
    each(arr, extend.rm, done(
      fs.rmdir.bind(fs, fullpath, done(
        callback
      ))
    ))
  }
  const statCallback = function (stat) {
    if (stat.isDirectory()) {
      fs.readdir(fullpath, done(readdirCallback))
    } else {
      fs.unlink(fullpath, done(callback))
    }
  }
  fs.stat(fullpath, done(statCallback))
}

extend.rmSync = function (fullpath) {
  fullpath = /^\//.test(fullpath) ? fullpath : path.resolve(process.cwd(), fullpath)
  const stat = fs.statSync(fullpath)
  if (stat.isDirectory()) {
    const files = fs.readdirSync(fullpath)
    for (let i = 0, len = files.length; i < len; i++) {
      extend.rmSync(path.resolve(fullpath, files[i]))
    }
    fs.rmdirSync(fullpath)
  } else {
    fs.unlinkSync(fullpath)
  }
}

extend.find = function (fullpath, search, callback) {
  let reg = null
  if (typeof search === 'string') {
    reg = new RegExp(search, 'i')
  } else if (search instanceof RegExp) {
    reg = search
  } else {
    callback(new FsExtendError('search parameter must be a String or RegExp'))
  }
  fullpath = /^\//.test(fullpath) ? fullpath : path.resolve(process.cwd(), fullpath)
  const isMatch = reg.test(fullpath.split('/').pop())
  const done = function (func) {
    return function (err) {
      if (err) {
        return callback(err)
      }
      const args = Array.prototype.slice.call(arguments, 1)
      func.apply(this, args)
    }
  }
  const eachCallback = function (result) {
    let arr = []
    if (isMatch) {
      arr.push(fullpath)
    }
    result.forEach(function (item) {
      if (item[0] instanceof Array) {
        arr = arr.concat(item[0])
      } else if (typeof item[0] === 'string') {
        arr.push(item[0])
      }
    })
    if (arr.length === 0) {
      return callback()
    }
    callback(null, arr)
  }
  const readdirCallback = function (files) {
    if (files.length === 0) {
      if (isMatch) {
        return callback(null, fullpath)
      }
      return callback()
    }
    const arr = files.map(function (item) {
      return path.resolve(fullpath, item)
    })
    each(arr, function (item, next) {
      extend.find(item, search, next)
    }, done(eachCallback))
  }
  const statCallback = function (stat) {
    if (stat.isDirectory()) {
      return fs.readdir(fullpath, done(readdirCallback))
    }
    if (isMatch) {
      return callback(null, fullpath)
    }
    callback()
  }
  fs.stat(fullpath, done(statCallback))
}

extend.findSync = function (fullpath, search) {
  let reg = null
  if (typeof search === 'string') {
    reg = new RegExp(search, 'i')
  } else if (search instanceof RegExp) {
    reg = search
  } else {
    throw new FsExtendError('search parameter must be a String or RegExp')
  }
  fullpath = /^\//.test(fullpath) ? fullpath : path.resolve(process.cwd(), fullpath)
  const isMatch = reg.test(fullpath.split('/').pop())
  const stat = fs.lstatSync(fullpath)
  if (stat.isDirectory()) {
    const files = fs.readdirSync(fullpath)
    let arr = []
    for (let i = 0, len = files.length; i < len; i++) {
      const result = extend.findSync(path.resolve(fullpath, files[i]), search)
      if (typeof result === 'string') {
        arr.push(result)
      } else if (result instanceof Array) {
        arr = arr.concat(result)
      }
    }
    if (isMatch) {
      return [fullpath].concat(arr)
    }
    return arr
  } else {
    if (isMatch) {
      return fullpath
    }
  }
}
module.exports = extend