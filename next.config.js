if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const path = require('path')

const { PUSHER_KEY, PUSHER_CLUSTER } = process.env
module.exports = {
  webpack: config => {
    config.resolve.alias['~'] = path.resolve(__dirname) + "/"
    return config
  },
  env: { PUSHER_CLUSTER, PUSHER_KEY }
}
