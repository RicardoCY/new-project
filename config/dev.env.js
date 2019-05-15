'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
   url_base:'"http://192.168.0.20:9090"',
  baseURL:'"http://192.168.0.20:9090/pst-oa-api/v2"', 
})
