import { deck } from '~/util/cards/deck'
import { Game } from '~/types/game'
import { shuffle } from '~/util'
import { Deck, Player } from '~/types/game'

export class Dealer {
  players: Player[]

  constructor (
    private game: Game,
    private update: (cb: (state: Game) => void) => void
  ) {
    this.players = Object.values(this.game.players)
  }

  run () {
    const pile = shuffle(deck)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const firstCard = pile.pop()!

    this.deal(pile)
    return this.update(state => {
      state.stack = [firstCard]
      this.players.forEach(({ id, hand }) => {
        state.players[id].hand = hand
      })
    })
  }

  private deal (pile: Deck) {
    const n = this.players.length
    const handSize = Math.ceil(pile.length / n)

    return this.players.forEach(p =>
       p.hand = pile.splice(0, handSize)
    )
  }
}
