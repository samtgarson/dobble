import jwt from 'jsonwebtoken'
import { Deck, Player, FirebasePlayer } from '~/types/game'

export class DobbleUser implements Player {
  constructor (
    public id: string,
    public name: string,
    public hand: Deck = [],
    public online: boolean = true
  ) {}

  static fromToken (token: string) {
    const { SECRET_KEY } = process.env
    if (!SECRET_KEY) throw new Error('Missing secret key env')

    const { id, name } = jwt.verify(token, SECRET_KEY) as { id: string, name: string }
    return new DobbleUser(id, name)
  }

  static deserialize (json: FirebasePlayer) {
    const { name, id, hand, online } = json
    return new DobbleUser(id, name, hand.map(c => JSON.parse(c)), online)
  }

  get toJSON () {
    const { name, id, hand, online } = this
    return { name, id, hand, online }
  }

  get forFirebase () {
    const { hand = [], ...attrs } = this.toJSON
    return { ...attrs, hand: hand.map(c => JSON.stringify(c)) }
  }
}
