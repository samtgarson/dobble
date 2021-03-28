import 'source-map-support/register'
import { DobbleApiHandler, DobbleApiRequest, DobbleApiResponse } from "~/types/api"
import { AuthMiddleware } from './auth'
import { DatabaseMiddleware } from './db'
import { PusherMiddleware } from './pusher'
import { NextApiHandler } from "next"

const stack = [AuthMiddleware, DatabaseMiddleware, PusherMiddleware]

export const MiddlewareStack = (handler: DobbleApiHandler): NextApiHandler => (req, res) => {
  let dReq: DobbleApiRequest | void = req as DobbleApiRequest
  const dRes = res as DobbleApiResponse
  dRes.error = (status, message = 'Something went wrong') => res.status(status).json({ error: message })


  for (const middleware of stack) {
    if (!dReq) break
    dReq = middleware(dReq, dRes)
  }

  if (!dReq) return

  return handler(dReq, dRes)
}
