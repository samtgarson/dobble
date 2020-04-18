import { MiddlewareStack } from '~/util/middleware'
import { DobbleGame } from '~/models/game'
import { Event } from '~/types/events'

export default MiddlewareStack(async (req, res) => {
  const { query, db, user, pusher } = req
  const { code } = query as { code: string }

  const getGame = async () => {
    try {
      const game = await DobbleGame.fromFirebase(db, code)
      return res.status(201).json(game.toJSON)
    } catch (e) {
      console.log(e)
      return res.error(500, 'Could not fetch game')
    }
  }

  const updateGame = async () => {
    const { body } = req
    if (Object.keys(body) == ['state']) return res.error(400, 'Can only update state')

    try {
      const game = await DobbleGame.fromFirebase(db, code)
      if (!game.canTransition(body.state, user)) return res.error(400, 'Invalid state transition')

      game.transition(body.state)

      await game.update(db, game.forFirebase)
      await pusher.trigger(`private-${game.code}`, Event.StateUpdated, game.toJSON)

      return res.status(200).json(game.toJSON)
    } catch (e) {
      console.log(e)
      return res.error(500, 'Could not update game')
    }
  }

  switch (req.method) {
    case 'GET':
      return getGame()
    case 'PATCH':
      return updateGame()
    default:
      return res.status(405)
  }
})
