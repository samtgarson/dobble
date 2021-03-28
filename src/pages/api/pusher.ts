import { MiddlewareStack } from "~/util/middleware"
import { DobbleGame } from "~/models/game"
import { logger } from "~/util/logger"

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

    const code = channel.replace(/^(presence|private)-/, '')
    const game = await DobbleGame.fromFirebase(req.db, code)

    if (!game) return res.error(404, 'Game not found')
    if (!game.canPlay(req.user.id)) return res.error(403, 'Cannot join game')

    const auth = req.pusher.authenticate(socketId, channel, {
      user_id: req.user.id,
      user_info: req.user
    })

    res.status(200).json(auth)
  } catch (e) {
    logger.error(e)
    res.status(500).end()
  }
})

export default PusherAuth
