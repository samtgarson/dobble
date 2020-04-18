/* eslint-disable @typescript-eslint/camelcase */
import { MiddlewareStack } from "~/util/middleware"

const PusherAuth = MiddlewareStack(async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end()
    return
  }

  try {
    const {
      socket_id: socketId,
      channel_name: channel
    } = req.body

    const auth = await req.pusher.authenticate(socketId, channel, {
      user_id: req.user.id,
      // @ts-ignore https://github.com/pusher/pusher-http-node/pull/119
      user_info: req.user
    })

    res.status(200).json(auth)
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
})

export default PusherAuth
