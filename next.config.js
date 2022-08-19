/* eslint-disable import/no-extraneous-dependencies, @typescript-eslint/no-var-requires */
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

module.exports ={
  experimental: {
    swcPlugins: [
      [
        'next-superjson-plugin',
        {
          excluded: []
        }
      ]
    ]
  }
}
