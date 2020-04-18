import { MiddlewareStack } from '~/util/middleware'
import { GameStatus } from '~/types/game'
import { DobbleGame } from '~/models/game'

export default MiddlewareStack(async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405
    return
  }

  const { query, user, db } = req
  const { code } = query as { code: string }

  try {
    const game = await DobbleGame.fromFirebase(db, code)

    if (game.state !== GameStatus.Open) return res.error(400, 'Cannot join came which is not open')

    await game.update(db, { [`players.${user.id}`]: user.toJSON })
    await game.reload(db)

    res.status(201).json(game)
  } catch (e) {
    console.log(e)
    res.error(500, 'Could not register player')
  }
})
