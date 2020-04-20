import { Game, Deck, GameStatus, FirebaseGame } from "~/types/game"
import { DobbleUser } from "./user"
import { Dealer } from "~/services/dealer"
import { Firestore, UpdateData } from "@google-cloud/firestore"

const deserializePlayers = (ps: DobbleGame['players'], firebase = true) => ps
  .reduce((hsh, u) => ({ ...hsh, [u.id]: firebase ? u.forFirebase : u.toJSON }), {})

const serializePlayers = (ps: FirebaseGame['players']): DobbleGame['players'] => Object.values(ps)
  .map(u => DobbleUser.deserialize(u))

export class DobbleGame {
  public startAt: string | null = null

  constructor (
    public code: string,
    public owner: string,
    public state: GameStatus,
    public players: DobbleUser[],
    public stack: Deck = []
  ) {}

  static async fromFirebase (db: Firestore, code: string) {
    const game = (await db.collection('games').doc(code).get()).data() as FirebaseGame | undefined
    if (!game) return
    const { owner, stack = [], state, players } = game

    return new DobbleGame(code, owner, state, serializePlayers(players), stack.map(c => JSON.parse(c)))
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

  canPlay (id: string): boolean {
    if (this.state === GameStatus.Open) return true
    if (this.state === GameStatus.Closed) return false

    return !!(this.players.find(p => p.id === id))
  }

  addPlayers (players: DobbleUser[]) {
    this.players = players
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
    const { stack, ...attrs } = this.toJSON
    return {
      ...attrs,
      stack: stack.map(c => JSON.stringify(c)),
      players: deserializePlayers(this.players)
    }
  }

  get toJSON (): Game {
    const { code, owner, stack, state, players, startAt } = this
    return {
      code,
      owner,
      stack,
      state,
      startAt,
      players: deserializePlayers(players, false)
    }
  }

  private deal () {
    const playerCount = Object.values(this.players).length
    const dealer = new Dealer(playerCount)
    const { firstCard, hands } = dealer.run()
    this.stack = [firstCard]

    for (let i=0; i < this.players.length; i++) {
      this.players[i].hand = hands[i]
    }

    const startAt = new Date()
    startAt.setSeconds(startAt.getSeconds() + 5)
    this.startAt = startAt.toISOString()
  }
}
