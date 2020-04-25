import { DobbleApiRequest, DobbleMiddleware } from "~/types/api"
import Pusher from 'pusher'

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

  dReq.pusher = pusher
  dReq.trigger = (channel, eventName, body) => new Promise((resolve, reject) => (
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    pusher.trigger(channel, eventName, body, err => err ? reject(err) : resolve())
  ))

  return dReq
}

