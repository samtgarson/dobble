import { MiddlewareStack } from '~/util/middleware'
import { DobbleGame } from '~/models/game'
import { Event } from '~/types/events'
import { DobbleUser } from '~/models/user'

export default MiddlewareStack(async (req, res) => {
  const { query, db, user, pusher } = req
  const { code } = query as { code: string }

  const getGame = async () => {
    try {
      const game = await DobbleGame.fromFirebase(db, code)
      if (!game || !game.canPlay(user.id)) return res.error(404, 'Game not found')
      return res.status(201).json(game.toJSON)
    } catch (e) {
      console.log(e)
      return res.error(500, 'Could not fetch game')
    }
  }

  const updateGame = async () => {
    const { body: { state, players = [] } } = req
    if (!Array.isArray(players) || players.length === 0) return res.error(400, 'Provide at least one player')

    try {
      const game = await DobbleGame.fromFirebase(db, code)
      if (!game || !game.canPlay(user.id)) return res.error(404, 'Game not found')
      if (!game.canTransition(state, user)) return res.error(400, 'Invalid state transition')

      game.addPlayers(players.map(p => new DobbleUser(p.id, p.name)))
      game.transition(state)

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
      return res.error(405, 'Wrong method')
  }
})
