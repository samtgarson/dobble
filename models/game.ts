import { Game, Deck, GameStatus, FirebaseGame } from "~/types/game"
import { DobbleUser } from "./user"
import { Dealer } from "~/services/dealer"
import { Firestore, UpdateData, Timestamp } from "@google-cloud/firestore"

const deserializePlayers = (ps: DobbleGame['players'], firebase = true) => ps
  .reduce((hsh, u) => ({ ...hsh, [u.id]: firebase ? u.forFirebase : u.toJSON }), {})

const serializePlayers = (ps: FirebaseGame['players']): DobbleGame['players'] => Object.values(ps)
  .map(u => DobbleUser.deserialize(u))

export class DobbleGame {
  constructor (
    public code: string,
    public owner: string,
    public state: GameStatus,
    public players: DobbleUser[],
    public stack: Deck = [],
    public winner: string | null = null,
    public startedAt: Timestamp | null = null,
    public finishedAt: Timestamp | null = null,
    public createdAt: Timestamp = Timestamp.now()
  ) {}

  static async fromFirebase (db: Firestore, code: string) {
    const game = (await db.collection('games').doc(code).get()).data() as FirebaseGame | undefined
    if (!game) return
    const { owner, stack = [], state, players, winner, createdAt, startedAt, finishedAt } = game

    return new DobbleGame(
      code,
      owner,
      state,
      serializePlayers(players),
      stack.map(c => JSON.parse(c)),
      winner,
      startedAt,
      finishedAt,
      createdAt
    )
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

  transition (to: GameStatus, opts: { winner? : string } = {}): void {
    switch (to) {
      case GameStatus.Playing:
        this.deal()
        this.setStartAt()
        break
      case GameStatus.Finished:
        if (opts.winner) this.winner = opts.winner
        this.finishedAt = Timestamp.now()
    }

    this.state = to
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

  updatePlayer (player: DobbleUser) {
    const i = this.players.findIndex(p => p.id === player.id)
    this.players.splice(i, 1, player)

    if (player.hand.length === 0) this.transition(GameStatus.Finished, { winner: player.id })
  }

  get forFirebase (): FirebaseGame {
    const { stack, ...attrs } = this.toJSON
    return {
      ...attrs,
      stack: stack.map(c => JSON.stringify(c)),
      players: deserializePlayers(this.players),
      startedAt: this.startedAt,
      finishedAt: this.finishedAt,
      createdAt: this.createdAt
    }
  }

  get toJSON (): Game {
    const { code, owner, stack, state, players, startedAt, finishedAt, winner, createdAt } = this
    return {
      code,
      owner,
      stack,
      state,
      startedAt: startedAt && startedAt.toDate().toISOString(),
      finishedAt: finishedAt && finishedAt.toDate().toISOString(),
      createdAt:  createdAt.toDate().toISOString(),
      players: deserializePlayers(players, false),
      winner
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
  }

  private setStartAt () {
    const startedAt = new Date()
    startedAt.setSeconds(startedAt.getSeconds() + 5)
    this.startedAt = Timestamp.fromDate(startedAt)
  }
}
