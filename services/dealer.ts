import { deck } from '~/util/cards/deck'
import { shuffle } from '~/util'
import { Deck } from '~/types/game'

export class Dealer {
  constructor (
    private playerCount: number
  ) {
    if (!playerCount) throw new Error('Not enough players')
  }

  run () {
    const pile = shuffle(deck)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const firstCard = pile.pop()!
    const hands = this.deal(pile)

    return { firstCard, hands }

  }

  private deal (pile: Deck) {
    const handSize = Math.ceil(pile.length / this.playerCount)
    const hands: Deck[] = []
    while (pile.length > 0) {
      hands.push(pile.splice(0, handSize))
    }

    return hands
  }
}
