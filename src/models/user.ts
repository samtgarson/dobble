import jwt from 'jsonwebtoken'
import { Deck, Player, FirebasePlayer } from '~/types/game'

export class DobbleUser implements Player {
  constructor (
    public id: string,
    public name: string,
    public hand: Deck = [],
  ) {}

  static fromToken (token: string): DobbleUser {
    const { SECRET_KEY } = process.env
    if (!SECRET_KEY) throw new Error('Missing secret key env')

    const { id, name } = jwt.verify(token, SECRET_KEY) as { id: string, name: string }
    return new DobbleUser(id, name)
  }

  static deserialize (json: FirebasePlayer): DobbleUser {
    const { name, id, hand } = json
    return new DobbleUser(id, name, hand.map(c => JSON.parse(c)))
  }

  get toJSON (): Player {
    const { name, id, hand } = this
    return { name, id, hand }
  }

  get forFirebase (): FirebasePlayer {
    const { hand = [], ...attrs } = this.toJSON
    return { ...attrs, hand: hand.map(c => JSON.stringify(c)) }
  }
}
