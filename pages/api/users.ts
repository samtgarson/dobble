import { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuid } from 'uuid'
import jwt from 'jsonwebtoken'

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (!process.env.SECRET_KEY) throw new Error('Missing room service secret')

  if (req.method !== 'POST') {
    return res.status(403).end()
  }

  const { name } = req.body
  if (!name) {
    res.status(400).json({ error: 'Name is required' })
    return
  }

  const id = uuid()
  const user = { id, name }
  const token = jwt.sign(
    user,
    process.env.SECRET_KEY,
    { expiresIn: '2d' }
  )

  res.statusCode = 201
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ token, user }))
}

