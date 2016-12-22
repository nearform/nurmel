'use strict'

const Aws = require('aws-sdk')
const Parse = require('fast-json-parse')

const defaults = {
}

const Nurmel = module.exports = function (opts) {
  if (!(this instanceof Nurmel)) {
    return new Nurmel(opts)
  }

  this.opts = Object.assign({}, defaults, opts)
  Aws.config.update(opts.aws)
  this.s3 = new Aws.S3({apiVersion: '2006-03-01'})
}

Nurmel.prototype.read = function (key, done) {
  const payload = {
    Bucket: this.opts.bucket,
    Key: key
  }

  this.s3.getObject(payload, (err, data) => {
    if (err) return done(err)

    data = Parse(data.Body.toString())

    if (data.err) {
      return done(err)
    }

    return done(null, data.value)
  })
}
