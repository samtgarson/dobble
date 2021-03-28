import { User } from "./api"
import { Timestamp } from "@google-cloud/firestore"

export type UpdateGame = (cb: (state: Game) => void) => void

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
}

export type FirebasePlayer = User & {
  hand: string[]
}

interface BaseGame {
  state: GameStatus
  code: string
  owner: string
  winner: string | null
}

export type Game = BaseGame & {
  players: {
    [id: string]: Player
  }
  stack: Deck
  startedAt: string | null
  finishedAt: string | null
  createdAt: string
}

export type FirebaseGame = BaseGame & {
  stack: string[]
  players: {
    [id: string]: FirebasePlayer
  }
  startedAt: Timestamp | null
  finishedAt: Timestamp | null
  createdAt: Timestamp
}
