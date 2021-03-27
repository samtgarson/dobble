import { DobbleGame } from "~/models/game"
import { DobbleApiRequest, DobbleApiResponse } from "~/types/api"
import { DobbleUser } from "~/models/user"
import { Event } from '~/types/events'
import { logger } from "~/util/logger"

export const updateGame = async (req: DobbleApiRequest, code: string, res: DobbleApiResponse): Promise<void> => {
  const { user, db, pusher, body: { state, players = [] } } = req
  if (!Array.isArray(players) || players.length === 0) return res.error(400, 'Provide at least one player')

  try {
    const game = await DobbleGame.fromFirebase(db, code)
    if (!game || !game.canPlay(user.id)) return res.error(404, 'Game not found')
    if (!game.canTransition(state, user)) return res.error(400, 'Invalid state transition')

    logger.debug(`updating game ${code}`)
    game.addPlayers(players.map(p => new DobbleUser(p.id, p.name)))
    game.transition(state)

    logger.debug(`saving game ${code}`)
    await game.update(db, game.forFirebase)
    await pusher.trigger(`private-${game.code}`, Event.StateUpdated, game.toJSON)
    logger.debug(`saved game ${code}`)

    return res.status(200).json(game.toJSON)
  } catch (e) {
    logger.error(e)
    return res.error(500, 'Could not update game')
  }
}

