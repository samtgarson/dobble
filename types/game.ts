import { User } from "./api"

export enum GameStatus {
  Open = 'open',
  Playing = 'playing',
  Closed = 'closed'
}

export type Card = number[]

export type Deck = Card[]

export type Player = User & {
  hand: Deck
}

export interface Game {
  state: GameStatus
  code: string
  owner: string
  players: {
    [id: string]: Player
  }
  stack: Deck
}
