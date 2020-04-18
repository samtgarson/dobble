import { Game, Deck, GameStatus, FirebaseGame } from "~/types/game"
import { DobbleUser } from "./user"
import { Dealer } from "~/services/dealer"
import { Firestore, UpdateData } from "@google-cloud/firestore"

const deserializePlayers = (ps: Game['players']): FirebaseGame['players'] => Object.keys(ps)
  .reduce((hsh, k) => ({ ...hsh, [k]: { ...ps[k], hand: ps[k].hand.map(c => JSON.stringify(c)) } }), {})

const serializePlayers = (ps: FirebaseGame['players']): Game['players'] => Object.keys(ps)
  .reduce((hsh, k) => ({ ...hsh, [k]: { ...ps[k], hand: ps[k].hand.map(c => JSON.parse(c)) } }), {})

export class DobbleGame implements Game {
  constructor (
    public code: string,
    public owner: string,
    public stack: Deck,
    public state: GameStatus,
    public players: Game['players']
  ) {}

  static async fromFirebase (db: Firestore, code: string) {
    const { owner, stack = [], state, players } = (
      await db.collection('games').doc(code).get()
    ).data() as FirebaseGame
    return new DobbleGame(code, owner, stack.map(c => JSON.parse(c)), state, serializePlayers(players))
  }

  ownedBy (user: DobbleUser) {
    return this.owner === user.id
  }

  canTransition (to: GameStatus, user: DobbleUser) {
    switch (this.state) {
      case GameStatus.Open:
        return to === GameStatus.Playing && this.ownedBy(user)
      case GameStatus.Playing:
        return to === GameStatus.Closed
      default:
        return false
    }
  }

  transition (to: GameStatus) {
    this.state = to

    switch (to) {
      case GameStatus.Playing:
        this.deal()
    }
  }

  update (db: Firestore, data: UpdateData) {
    return db.collection('games')
      .doc(this.code)
      .update(data)
  }

  reload (db: Firestore) {
    return DobbleGame.fromFirebase(db, this.code)
  }

  get forFirebase (): FirebaseGame {
    const { stack, players, ...attrs } = this
    return {
      ...attrs,
      stack: stack.map(c => JSON.stringify(c)),
      players: deserializePlayers(players)
    }
  }

  get toJSON (): Game {
    const { code, owner, stack, state, players } = this
    return { code, owner, stack, state, players }
  }

  deal () {
    const playerCount = Object.values(this.players).length
    const dealer = new Dealer(playerCount)
    const { firstCard, hands } = dealer.run()
    this.stack = [firstCard]

    Object.keys(this.players).forEach((id, i) => {
      this.players[id].hand = hands[i]
    })
  }
}
