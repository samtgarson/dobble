import { DobbleApiRequest, DobbleMiddleware } from "~/types/api"
import Pusher from 'pusher'
import promisify from 'pify'

const {
  PUSHER_APP_ID: appId,
  PUSHER_KEY: key,
  PUSHER_SECRET: secret,
  PUSHER_CLUSTER: cluster
} = process.env

if (!appId || !key || !secret || !cluster) throw new Error('Missing Pusher server creds')

const pusher = new Pusher({
  appId,
  key,
  secret,
  cluster,
  useTLS: true
})

export const PusherMiddleware: DobbleMiddleware = req => {
  const dReq = req as DobbleApiRequest

  // dReq.pusher = promisify(pusher, { multiArgs: true, exclude: ['authenticate'] })
  dReq.pusher = pusher

  return dReq
}

