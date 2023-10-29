'use strict'

const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  AUTH0_DOMAIN: '"danielefrisanco.eu.auth0.com"',
  AUTH0_CLIENT_ID: '"2V1voFbC2Zx2ivUcTybXpLQK6peLGCEk"',
  AUTH0_CALLBACK_URL: '"http://localhost:8080/callback"',
  AUTH0_AUDIENCE: '"http://localhost:8082"'
})
