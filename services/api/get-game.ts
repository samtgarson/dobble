import { DobbleGame } from "~/models/game"
import { DobbleApiRequest, DobbleApiResponse } from "~/types/api"
import { logger } from "~/util/logger"

export const getGame = async (req: DobbleApiRequest, code: string, res: DobbleApiResponse): Promise<void> => {
  const { db, user } = req
  try {
    const game = await DobbleGame.fromFirebase(db, code)
    if (!game || !game.canPlay(user.id)) return res.error(404, 'Game not found')
    return res.status(201).json(game.toJSON)
  } catch (e) {
    logger.error(e)
    return res.error(500, 'Could not fetch game')
  }
}


