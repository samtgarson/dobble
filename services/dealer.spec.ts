import { Dealer } from './dealer'
import { Game, GameStatus } from '~/types/game'

type Callback = (state: Game) => void

describe('Dealer', () => {
  const update = jest.fn<void, [Callback]>()
  const setupGame: () => Game = () => ({
    players: {
      a: { name: 'a', id: 'a', hand: [] },
      b: { name: 'b', id: 'b', hand: [] },
      c: { name: 'c', id: 'c', hand: [] }
    },
    state: GameStatus.Playing,
    owner: 'a',
    code: 'code',
    stack: []
  })

  let game: Game
  let dealer: Dealer

  beforeEach(() => {
    game = setupGame()
    dealer = new Dealer(game, update)
    dealer.run()

    const [cb] = update.mock.calls[0]
    cb(game)
  })

  it ('leaves one card in the stack', () => {
    expect(game.stack.length).toEqual(1)
  })

  it('gives the players cards', () => {
    const lengths = [19, 19, 18]

    Object.values(game.players).forEach((p, i) => {
      expect(p.hand.length).toEqual(lengths[i])
    })
  })
})
