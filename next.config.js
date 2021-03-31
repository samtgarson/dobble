/* eslint-disable import/no-extraneous-dependencies, @typescript-eslint/no-var-requires */
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const path = require('path')
const withPlugins = require('next-compose-plugins')
const sourcemaps = require('@zeit/next-source-maps')()

module.exports = withPlugins(
  [
    [sourcemaps]
  ]
)
