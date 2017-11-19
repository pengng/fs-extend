const assert = require('assert')
const extend = require('../index')
const describe = function (description, func) {
  if (func.length === 1) {
    const done = function (err) {
      if (err) {
        return console.error('\x1b[31m%s\n  %s\x1b[0m', description, err.stack)
      }
      console.log('\x1b[32m%s\x1b[0m', description)
    }
    return func(done)
  }
  try {
    func()
    console.log('\x1b[32m%s\x1b[0m', description)
  } catch (err) {
    console.error('\x1b[31m%s\n  %s\x1b[0m', description, err.stack)
  }
}

describe('test extend.js', function () {
  // describe('test mkdir()', function (done) {
  //   const fullpath = '/Users/yupeng.kuo/demo/demo/1/2/3/4'
  //   extend.mkdir(fullpath, done)
  // })
  describe('test mkdirSync()', function () {
    const fullpath = './1/2/3/4/5/6/7/8'
    extend.mkdirSync(fullpath)
  })
  describe('test rmSync()', function () {
    const fullpath = './1'
    extend.rmSync(fullpath)
  })
  describe('test find()', function (done) {
    const fullpath = '.'
    extend.find(fullpath, 'e', function (err, result) {
      if (err) {
        return done(err)
      }
      console.log(result)
      done()
    })
  })
  describe('test findSync()', function () {
    const fullpath = '.'
    const result = extend.findSync(fullpath, 'e')
    console.log(result)
  })
})