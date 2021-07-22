'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://api.vesync3.local"'
  // BASE_API: '"http://performance-api.webdev.vesync.com"'

  


})
