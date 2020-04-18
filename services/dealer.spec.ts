import { Dealer } from './dealer'

describe('Dealer', () => {
  let result: ReturnType<Dealer['run']>

  beforeEach(() => {
    const dealer = new Dealer(3)
    result = dealer.run()
  })

  it ('leaves one card in the stack', () => {
    expect(result.firstCard).toBeInstanceOf(Array)
  })

  it('gives the players cards', () => {
    const lengths = [19, 19, 18]

    expect(result.hands).toBeInstanceOf(Array)
    result.hands.forEach((hand, i) => {
      expect(hand.length).toEqual(lengths[i])
    })
  })
})
