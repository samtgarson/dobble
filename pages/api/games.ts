import yawg from 'yawg'
import { GameStatus } from '~/types/game'
import { User } from '~/types/api'
import { MiddlewareStack } from '~/util/middleware'
import { DobbleUser } from '~/models/user'
import { DobbleGame } from '~/models/game'

const newGame = (code: string, user: User) => new DobbleGame(
  code,
  user.id,
  GameStatus.Open,
  [new DobbleUser(user.id, user.name)]
)

export default MiddlewareStack(async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405
    return
  }

  const code = yawg({
    maxLength: 20,
    minWords: 3,
    maxWords: 3,
    delimiter: '-'
  })
  const game = newGame(code, req.user)

  try {
    await req.db.collection('games')
      .doc(code)
      .set(game.forFirebase)

    res.status(201).json(game)
  } catch (e) {
    console.error(e)
    res.error(500, 'Unable to create game')
  }
})
