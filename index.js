'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/isdream-oauth.cjs.min.js')
} else {
  module.exports = require('./dist/isdream-oauth.cjs.js')
}
