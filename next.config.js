/* eslint-disable import/no-extraneous-dependencies, @typescript-eslint/no-var-requires */
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const path = require('path')
const withPlugins = require('next-compose-plugins')
const sourcemaps = require('@zeit/next-source-maps')

const { PUSHER_KEY, PUSHER_CLUSTER } = process.env
module.exports = withPlugins(
  [
    [sourcemaps]
  ],
  {
    webpack: config => {
      config.resolve.alias['~'] = path.resolve(__dirname) + "/"
      return config
    },
    env: { PUSHER_CLUSTER, PUSHER_KEY }
  }
)
