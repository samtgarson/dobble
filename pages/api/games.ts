import yawg from 'yawg'
import { GameStatus, Game } from '~/types/game'
import { User } from '~/types/api'
import { MiddlewareStack } from '~/util/middleware'

const newGame = (code: string, user: User): Game  => ({
  code,
  owner: user.id,
  players: { [user.id]: { ...user, hand: [] } },
  state: GameStatus.Open,
  stack: []
})

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
      .set(game)

    res.status(201).json(game)
  } catch (e) {
    console.error(e)
    res.error(500, 'Unable to create game')
  }
})
