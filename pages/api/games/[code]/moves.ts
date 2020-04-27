import { GameStatus, Card } from '~/types/game'
import { Event } from '~/types/events'
import { MiddlewareStack } from '~/util/middleware'
import { DobbleGame } from '~/models/game'

const compareCards = (a: Card, b: Card) => a.sort().join('-') === b.sort().join('-')

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

    const { match, deck, hand }: { match: number, deck: Card, hand: Card } = body
    const player = game.players.find(p => p.id === user.id)

    if (!player) return res.error(404, 'Game not found')

    const playerCard = player.hand.shift()
    const card = game.stack[game.stack.length - 1]

    if (!playerCard) return res.error(500)

    if (!compareCards(hand, playerCard) || !compareCards(deck, card)) {
      return res.error(422, 'Not the correct hand')
    }

    if (!playerCard.includes(match) || !card.includes(match)) {
      return res.error(422, 'Not a match')
    }

    game.updatePlayer(player)
    game.stack.push(playerCard)

    await Promise.all([
      trigger(`private-${game.code}`, Event.StateUpdated, game.toJSON),
      game.update(db, game.forFirebase)
    ])

    return res.status(201).end()
  } catch (e) {
    console.error(e)
    res.error(500, 'Unable to create move')
  }
})
