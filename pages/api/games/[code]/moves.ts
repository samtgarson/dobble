import { GameStatus } from '~/types/game'
import { Event } from '~/types/events'
import { MiddlewareStack } from '~/util/middleware'
import { DobbleGame } from '~/models/game'

export default MiddlewareStack(async (req, res) => {
  if (req.method !== 'POST') {
    res.error(405, 'Wrong method')
    return
  }

  const { query, user, db, body, trigger } = req

  try {
    const game = await DobbleGame.fromFirebase(db, query.code as string)
    if (!game) return res.error(404, 'Game not found')
    if (game.state !== GameStatus.Playing) return res.error(422, 'Game not in playable state')

    const { match }: { match: number } = body
    const player = game.players.find(p => p.id === user.id)
    if (!player) return res.error(404, 'Game not found')

    const playerCard = player.hand.shift()
    const card = game.stack[game.stack.length - 1]

    if (playerCard && playerCard.includes(match) && card.includes(match)) {
      game.replacePlayer(player)
      game.stack.push(playerCard)
      await game.update(db, game.forFirebase)
      await trigger(`private-${game.code}`, Event.StateUpdated, game.toJSON)

      return res.status(201).end()
    }

    return res.error(422, 'Not a match')
  } catch (e) {
    console.error(e)
    res.error(500, 'Unable to create move')
  }
})
