import { User } from "./api"

export enum GameStatus {
  Open = 'open',
  Playing = 'playing',
  Finished = 'finished',
  Closed = 'closed'
}

export type Card = number[]

export type Deck = Card[]

export type Player = User & {
  hand: Deck
  game_id: string
}
