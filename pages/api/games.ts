import { NextApiRequest, NextApiResponse } from 'next'
import yawg from 'yawg'
import {AuthMiddleware} from '~/util/middleware/auth'

export default AuthMiddleware((req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.statusCode = 405
    return
  }

  const code = yawg({
    maxLength: 20,
    minWords: 3,
    maxWords: 3,
    delimiter: '-'
  })

  res.statusCode = 201
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ code }))
})
