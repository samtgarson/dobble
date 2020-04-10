import {NextApiHandler} from "next/dist/next-server/lib/utils"
import jwt from 'jsonwebtoken'
import { HandlerWithUser, User } from "~/types/api"

export const AuthMiddleware = (handler: HandlerWithUser): NextApiHandler => (req, res) => {
  if (!process.env.SECRET_KEY) throw new Error('Missing room service secret')

  const { authorization: token } = req.headers

  if (!token) {
    return res.status(400).json({ error: 'Authorization token required' })
  }

  try {
    const user = jwt.verify(token as string, process.env.SECRET_KEY) as User
    return handler(req, res, user)
  } catch (e) {
    return res.status(401).json({ error: 'Not authorized' })
  }
}

