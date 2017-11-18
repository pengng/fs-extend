const FsExtendError = function (message, code) {
  this.message = message
  this.code = code || -1
  this.name = 'FsExtendError'
  Error.captureStackTrace(this, FsExtendError)
}

FsExtendError.prototype = Object.create(FsExtendError.prototype)

module.exports = {
  FsExtendError: FsExtendError
}